// Background Service Worker - 크로스체크 로직
// Phase 1: 원본 질문 → A(GPT), B(Gemini)
// Phase 2: 크로스체크 → C(A를 Gemini에), D(B를 GPT에)
// Phase 3: 최종 분석 → C+D를 Gemini에 보내서 정리

// 상태 초기화
chrome.runtime.onInstalled.addListener(() => {
    resetState();
    console.log('AI Cross Checker installed');
});

function resetState() {
    return chrome.storage.local.set({
        phase: 'idle',           // idle, phase1, phase2, phase3, done
        gptPhase: 'idle',        // idle, asking, asked, crosschecking, crosschecked, done
        geminiPhase: 'idle',     // idle, asking, asked, crosschecking, crosschecked, analyzing, done
        responseA: '',           // GPT 원본 답변
        responseB: '',           // Gemini 원본 답변
        responseC: '',           // Gemini의 GPT 검토
        responseD: '',           // GPT의 Gemini 검토
        finalResult: '',         // 최종 분석 결과
        lastQuestion: '',
        error: '',
        debugData: null
    });
}

// 최종 결과 검증
function validateFinalResult(result) {
    // 결과가 없거나 너무 짧음
    if (!result || result.length < 30) {
        return { valid: false, reason: '결과가 비어있거나 너무 짧습니다' };
    }

    // 최소한 하나의 태그가 있어야 함 (결과), (GPT), (Gemini), [공통], [GPT], [Gemini]
    const hasTag = /\(결과\)|\(GPT\)|\(Gemini\)|\[공통|\[GPT\]|\[Gemini\]/i.test(result);

    // 태그가 없어도 실제 내용이 충분하면 허용 (50자 이상)
    if (!hasTag && result.length < 50) {
        return { valid: false, reason: '결과 형식이 올바르지 않습니다' };
    }

    // 응답이 이전 질문의 반복이거나 에러 메시지인지 확인
    const errorPatterns = [
        '입력 필드를 찾을 수 없',
        '연결 실패',
        '응답 없음',
        '시간 초과'
    ];

    for (const pattern of errorPatterns) {
        if (result.includes(pattern)) {
            return { valid: false, reason: '응답에 에러가 포함되어 있습니다' };
        }
    }

    return { valid: true };
}

// 메시지 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openSidePanel') {
        chrome.sidePanel.open({ windowId: request.windowId });
        sendResponse({ success: true });
        return true;
    }

    if (request.action === 'sendQuestion') {
        handleSendQuestion(request);
        sendResponse({ success: true });
        return true;
    }

    if (request.action === 'getStatus') {
        chrome.storage.local.get(null, (data) => {
            sendResponse(data);
        });
        return true;
    }

    if (request.action === 'reset') {
        resetState().then(() => sendResponse({ success: true }));
        return true;
    }

    if (request.action === 'changeModel') {
        // 즉시 모델 변경 (드롭다운 선택 시)
        changeModelImmediate(request.tabId, request.type, request.model)
            .then(() => sendResponse({ success: true }))
            .catch(e => sendResponse({ success: false, error: e.message }));
        return true;
    }
});

// 메인 크로스체크 플로우
async function handleSendQuestion(request) {
    const { question, gptTabId, geminiTabId, gptModel, geminiModel, newChat } = request;

    try {
        // 새 채팅 시작 옵션이 켜져있으면 새 채팅 열기
        if (newChat) {
            console.log('[Prep] 새 채팅 시작...');
            await Promise.all([
                startNewChat(gptTabId, 'gpt'),
                startNewChat(geminiTabId, 'gemini')
            ]);
            await sleep(1000); // 새 채팅 로드 대기

            // 새 채팅 후 모델 선택 (병렬 처리)
            console.log('[Prep] 모델 선택 (병렬)...');
            const modelPromises = [];
            if (gptModel && gptModel !== 'auto') {
                modelPromises.push(selectModel(gptTabId, 'gpt', gptModel));
            }
            if (geminiModel && geminiModel !== 'flash') {
                modelPromises.push(selectModel(geminiTabId, 'gemini', geminiModel));
            }
            if (modelPromises.length > 0) {
                await Promise.all(modelPromises);
                await sleep(500);
            }
        }

        // ========== Phase 1: 원본 질문 (GPT/Gemini 병렬 처리) ==========
        await chrome.storage.local.set({
            phase: 'phase1',
            gptPhase: 'asking',
            geminiPhase: 'asking',
            lastQuestion: question,
            error: ''
        });

        console.log('[Phase 1] 원본 질문 전송...');

        // 양쪽에 먼저 텍스트 입력 → 양쪽에 전송 (전송 실패 방지)
        // 1. 양쪽에 텍스트 입력
        console.log('[Phase 1] GPT 텍스트 입력...');
        await chrome.tabs.update(gptTabId, { active: true });
        await sleep(100);
        await inputText(gptTabId, question, 'gpt');

        console.log('[Phase 1] Gemini 텍스트 입력...');
        await chrome.tabs.update(geminiTabId, { active: true });
        await sleep(1000);  // Gemini는 1초 대기 (안정화)
        await inputText(geminiTabId, question, 'gemini');

        // 2. 양쪽에 전송 버튼 클릭
        console.log('[Phase 1] GPT 전송...');
        await chrome.tabs.update(gptTabId, { active: true });
        await sleep(100);
        await clickSend(gptTabId, 'gpt');

        console.log('[Phase 1] Gemini 전송...');
        await chrome.tabs.update(geminiTabId, { active: true });
        await sleep(500);
        await clickSend(geminiTabId, 'gemini');

        // 2. 응답 대기는 병렬로
        console.log('[Phase 1] 응답 대기 (병렬)...');
        const gptPromise = waitForResponse(gptTabId, 'gpt').then(async (response) => {
            await chrome.storage.local.set({ responseA: response, gptPhase: 'asked' });
            console.log('[Phase 1] GPT 완료 - A:', response.substring(0, 100), '...');
            return response;
        });

        const geminiPromise = waitForResponse(geminiTabId, 'gemini').then(async (response) => {
            await chrome.storage.local.set({ responseB: response, geminiPhase: 'asked' });
            console.log('[Phase 1] Gemini 완료 - B:', response.substring(0, 100), '...');
            return response;
        });

        // 둘 다 완료될 때까지 대기
        const [responseA, responseB] = await Promise.all([gptPromise, geminiPromise]);

        // 응답 유효성 검사 - 둘 다 응답이 있어야 진행
        if (!responseA || responseA.length === 0) {
            throw new Error(`GPT 응답이 비어있습니다. 다시 시도해주세요.`);
        }
        if (!responseB || responseB.length === 0) {
            throw new Error(`Gemini 응답이 비어있습니다. 다시 시도해주세요.`);
        }

        console.log('[Phase 1] 둘 다 완료, 크로스체크 시작 준비...');
        console.log('[Phase 1] GPT 응답 길이:', responseA.length, '/ Gemini 응답 길이:', responseB.length);

        // ========== Phase 2: 크로스체크 (GPT/Gemini 병렬 처리) ==========
        await chrome.storage.local.set({
            phase: 'phase2',
            gptPhase: 'crosschecking',
            geminiPhase: 'crosschecking'
        });

        console.log('[Phase 2] 크로스체크 시작...');

        // 크로스체크 프롬프트 생성
        const crosscheckPromptForGemini = createCrosscheckPrompt(question, responseA, 'GPT');
        const crosscheckPromptForGpt = createCrosscheckPrompt(question, responseB, 'Gemini');

        // 양쪽에 먼저 텍스트 입력 → 양쪽에 전송
        // 1. 양쪽에 텍스트 입력
        console.log('[Phase 2] GPT 텍스트 입력...');
        await chrome.tabs.update(gptTabId, { active: true });
        await sleep(100);
        await inputText(gptTabId, crosscheckPromptForGpt, 'gpt');

        console.log('[Phase 2] Gemini 텍스트 입력...');
        await chrome.tabs.update(geminiTabId, { active: true });
        await sleep(1000);  // Gemini는 1초 대기 (안정화)
        await inputText(geminiTabId, crosscheckPromptForGemini, 'gemini');

        // 2. 양쪽에 전송 버튼 클릭
        console.log('[Phase 2] GPT 전송...');
        await chrome.tabs.update(gptTabId, { active: true });
        await sleep(100);
        await clickSend(gptTabId, 'gpt');

        console.log('[Phase 2] Gemini 전송...');
        await chrome.tabs.update(geminiTabId, { active: true });
        await sleep(500);
        await clickSend(geminiTabId, 'gemini');

        // 2. 응답 대기는 병렬로
        console.log('[Phase 2] 응답 대기 (병렬)...');
        const gptCrossPromise = waitForResponse(gptTabId, 'gpt').then(async (response) => {
            await chrome.storage.local.set({ responseD: response, gptPhase: 'crosschecked' });
            console.log('[Phase 2] GPT 크로스체크 완료 - D:', response.substring(0, 100), '...');
            return response;
        });

        const geminiCrossPromise = waitForResponse(geminiTabId, 'gemini').then(async (response) => {
            await chrome.storage.local.set({ responseC: response, geminiPhase: 'crosschecked' });
            console.log('[Phase 2] Gemini 크로스체크 완료 - C:', response.substring(0, 100), '...');
            return response;
        });

        // 둘 다 완료될 때까지 대기
        const [responseD, responseC] = await Promise.all([gptCrossPromise, geminiCrossPromise]);
        console.log('[Phase 2] 둘 다 완료, 최종 분석 시작 준비...');

        // ========== Phase 3: 최종 분석 (Gemini 사용) ==========
        await chrome.storage.local.set({
            phase: 'phase3',
            gptPhase: 'done',
            geminiPhase: 'analyzing'
        });

        console.log('[Phase 3] 최종 분석 시작 (Gemini)...');

        const analysisPrompt = createAnalysisPrompt(question, responseC, responseD);
        const finalResult = await sendAndWait(geminiTabId, analysisPrompt, 'gemini');

        // 결과 검증 - 최소 길이와 형식 확인
        const isValidResult = validateFinalResult(finalResult);

        if (!isValidResult.valid) {
            console.error('[Phase 3] 결과 검증 실패:', isValidResult.reason);
            await chrome.storage.local.set({
                phase: 'error',
                error: `최종 분석 실패: ${isValidResult.reason}`,
                // 디버깅용으로 원본 데이터도 저장
                debugData: { responseA, responseB, responseC, responseD, finalResult }
            });
            return;
        }

        await chrome.storage.local.set({
            phase: 'done',
            gptPhase: 'done',
            geminiPhase: 'done',
            finalResult
        });

        console.log('[Phase 3] 완료!');

    } catch (error) {
        console.error('Error:', error);
        await chrome.storage.local.set({
            phase: 'error',
            error: error.message
        });
    }
}

// 새 채팅 시작
async function startNewChat(tabId, type) {
    const func = type === 'gpt' ? injectNewChatGpt : injectNewChatGemini;
    await chrome.scripting.executeScript({
        target: { tabId },
        func: func
    });
}

// 모델 선택 (2단계: 드롭다운 열기 → 대기 → 옵션 선택)
async function selectModel(tabId, type, model) {
    // 1단계: 드롭다운 열기
    const openFunc = type === 'gpt' ? injectOpenGptModelDropdown : injectOpenGeminiModelDropdown;
    await chrome.scripting.executeScript({
        target: { tabId },
        func: openFunc
    });

    // 드롭다운 열리는 시간 대기 (빠른 속도로 변경)
    await sleep(500);

    // 2단계: 옵션 선택
    const selectFunc = type === 'gpt' ? injectSelectGptModelOption : injectSelectGeminiModelOption;
    await chrome.scripting.executeScript({
        target: { tabId },
        func: selectFunc,
        args: [model]
    });
}

// 즉시 모델 변경 (사이드패널 드롭다운 선택 시 호출)
async function changeModelImmediate(tabId, type, model) {
    console.log(`[Model Change] 즉시 변경: ${type} -> ${model}`);

    // 모든 모델 선택 가능 (기본값 포함)
    await selectModel(tabId, type, model);
    console.log(`[Model Change] 완료: ${type} -> ${model}`);
}

// 크로스체크 프롬프트 생성
function createCrosscheckPrompt(originalQuestion, answer, sourceAI) {
    return `다음은 "${originalQuestion}"에 대한 ${sourceAI}의 답변입니다:

---
${answer}
---

위 답변을 검토해주세요:
1. 동의하는 부분
2. 다르게 생각하거나 보완할 부분

간결하게 답변해주세요.`;
}

// 최종 분석 프롬프트 생성
function createAnalysisPrompt(originalQuestion, responseC, responseD) {
    return `사용자 질문: "${originalQuestion}"

아래는 GPT와 Gemini가 서로의 답변을 크로스체크한 결과입니다.

[Gemini가 GPT 답변을 검토한 결과]
${responseC}

[GPT가 Gemini 답변을 검토한 결과]
${responseD}

위 내용을 정리해서 아래 형식으로 출력하세요:

===동일===
(양쪽이 동의하는 내용들을 여기에 작성)

===GPT===
(GPT만의 고유한 의견/분석을 여기에 작성, 없으면 "없음")

===GEMINI===
(Gemini만의 고유한 의견/분석을 여기에 작성, 없으면 "없음")

규칙:
1. 반드시 ===동일===, ===GPT===, ===GEMINI=== 구분자를 사용
2. 구분자는 정확히 위 형식대로 (등호 3개씩)
3. 제목/서론/맺음말 없이 내용만
4. 각 섹션 내용은 bullet point(•)로 정리`;
}

// 텍스트 입력만 (전송 안 함) - 탭이 활성화된 상태에서 호출해야 함
async function inputText(tabId, message, type) {
    console.log(`[${type}] 텍스트 입력`);

    const sendFunc = type === 'gpt' ? injectSendToGpt : injectSendToGemini;
    const sendResult = await chrome.scripting.executeScript({
        target: { tabId },
        func: sendFunc,
        args: [message]
    });

    if (sendResult[0]?.result?.error) {
        throw new Error(`${type} 입력 실패: ${sendResult[0].result.error}`);
    }

    console.log(`[${type}] 텍스트 입력 완료`);
}

// 전송 버튼 클릭만 - 탭이 활성화된 상태에서 호출해야 함
// 이전 응답 생성 중이면 무한 대기 (Thinking 모드 지원)
async function clickSend(tabId, type) {
    console.log(`[${type}] 전송 버튼 클릭`);

    const clickFunc = type === 'gpt' ? injectClickSendGpt : injectClickSendGemini;
    let waitCount = 0;

    while (true) {
        const clickResult = await chrome.scripting.executeScript({
            target: { tabId },
            func: clickFunc
        });

        const result = clickResult[0]?.result;

        if (result?.needsWait) {
            waitCount++;
            // 60초마다 로그 출력
            if (waitCount % 60 === 0) {
                console.log(`[${type}] 이전 응답 생성 중, 대기... (${waitCount}초)`);
            }
            await sleep(1000);
            continue;
        }

        if (result?.error && !result?.needsWait) {
            throw new Error(`${type} 전송 버튼 클릭 실패: ${result.error}`);
        }

        console.log(`[${type}] 전송 완료`);
        return;
    }
}

// 메시지 전송 (입력 + 전송) - 탭이 활성화된 상태에서 호출해야 함
async function sendMessage(tabId, message, type) {
    await inputText(tabId, message, type);
    await sleep(100);
    await clickSend(tabId, type);
}

// 메시지 전송 및 응답 대기 (탭 활성화 포함)
async function sendAndWait(tabId, message, type) {
    console.log(`[${type}] 메시지 전송 시작 (탭 활성화 + 대기)`);

    // 탭 활성화
    await chrome.tabs.update(tabId, { active: true });
    const waitTime = type === 'gemini' ? 1000 : 100;  // Gemini는 1초 대기
    await sleep(waitTime);

    // 메시지 전송
    await sendMessage(tabId, message, type);

    // 응답 대기
    const response = await waitForResponse(tabId, type);

    return response;
}

// 응답 대기 (버튼 모양 기반 - 단순화)
// Stop 버튼(■) 있음 → 응답 생성 중
// 전송 버튼(↑) 있음 → 입력 가능/응답 완료
// 플로우: 전송 후 Stop 버튼 → 전송 버튼으로 바뀔 때까지 대기
async function waitForResponse(tabId, type) {
    const checkFunc = type === 'gpt' ? injectCheckButtonState : injectCheckButtonStateGemini;
    let checkCount = 0;
    const checkInterval = 500; // 500ms마다 체크
    let sawStopButton = false; // Stop 버튼을 본 적이 있는지

    console.log(`[${type}] 응답 대기 시작 (버튼 모양 기반)`);

    while (true) {
        await sleep(checkInterval);
        checkCount++;

        try {
            const result = await chrome.scripting.executeScript({
                target: { tabId },
                func: checkFunc
            });

            const { hasSendButton, hasStopButton } = result[0]?.result || {};
            const elapsedSec = Math.floor(checkCount * checkInterval / 1000);

            // 60초마다 로그 출력
            if (elapsedSec > 0 && elapsedSec % 60 === 0 && checkCount % (60000 / checkInterval) === 0) {
                console.log(`[${type}] 응답 대기 중... (${elapsedSec}초 경과)`);
            }

            // Stop 버튼(■) 감지 → 응답 생성 중
            if (hasStopButton) {
                sawStopButton = true;
                // 10초마다 로그
                if (elapsedSec > 0 && elapsedSec % 10 === 0 && checkCount % (10000 / checkInterval) === 0) {
                    console.log(`[${type}] 응답 생성 중... (■ Stop 버튼, ${elapsedSec}초)`);
                }
                continue;
            }

            // Stop 버튼(■) 없음 + Stop 버튼을 본 적이 있음 → 응답 완료!
            // (전송 버튼/음성 버튼 구분 없이, Stop 버튼 유무만으로 판단)
            if (!hasStopButton && sawStopButton) {
                console.log(`[${type}] 응답 완료! (■ Stop 버튼 사라짐, ${elapsedSec}초)`);

                // 응답 텍스트 가져오기
                const textFunc = type === 'gpt' ? injectGetLastResponseGpt : injectGetLastResponseGemini;
                const textResult = await chrome.scripting.executeScript({
                    target: { tabId },
                    func: textFunc
                });
                const text = textResult[0]?.result || '';
                console.log(`[${type}] 응답 텍스트: ${text.length}자`);
                return text;
            }

            // 아직 Stop 버튼을 못 봤으면 계속 대기 (전송 직후 상태)
            if (!sawStopButton) {
                if (elapsedSec > 0 && elapsedSec % 5 === 0 && checkCount % (5000 / checkInterval) === 0) {
                    console.log(`[${type}] Stop 버튼 대기 중... (${elapsedSec}초)`);
                }
            }

        } catch (e) {
            console.error(`[${type}] Check error:`, e);
            // 에러가 나도 계속 대기 (탭 연결 문제 등)
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============ 페이지에 주입될 함수들 ============

// GPT 새 채팅 시작
function injectNewChatGpt() {
    try {
        // 새 채팅 버튼 찾기 (여러 셀렉터 시도)
        const newChatBtn = document.querySelector('a[href="/"]')
            || document.querySelector('[data-testid="new-chat-button"]')
            || document.querySelector('nav a[class*="new-chat"]')
            || document.querySelector('button[aria-label="New chat"]');

        if (newChatBtn) {
            newChatBtn.click();
            return { success: true };
        }

        // 대안: 직접 네비게이션
        window.location.href = 'https://chatgpt.com/';
        return { success: true };
    } catch (e) {
        return { error: e.message };
    }
}

// Gemini 새 채팅 시작
function injectNewChatGemini() {
    try {
        // 새 채팅 버튼 찾기
        const newChatBtn = document.querySelector('button[aria-label="New chat"]')
            || document.querySelector('a[href="/app"]')
            || document.querySelector('[data-test-id="new-chat-button"]');

        if (newChatBtn) {
            newChatBtn.click();
            return { success: true };
        }

        // 대안: 직접 네비게이션
        window.location.href = 'https://gemini.google.com/app';
        return { success: true };
    } catch (e) {
        return { error: e.message };
    }
}

// GPT 모델 드롭다운 열기 (1단계)
function injectOpenGptModelDropdown() {
    try {
        // 1. 모든 클릭 가능한 요소에서 "ChatGPT X.X" 찾기
        const allClickables = [...document.querySelectorAll('button, [role="button"], div[class*="menu"], span[class*="menu"], a, [aria-haspopup]')];
        let modelSelector = allClickables.find(el => {
            const text = el.textContent?.toLowerCase() || '';
            return text.includes('chatgpt') && (
                text.includes('auto') ||
                text.includes('instant') ||
                text.includes('thinking') ||
                text.includes('5.') ||
                text.includes('4o')
            ) && text.length < 50; // 너무 긴 텍스트 제외
        });

        // 2. data-testid로 찾기
        if (!modelSelector) {
            modelSelector = document.querySelector('[data-testid="model-switcher-dropdown-button"]');
        }

        // 3. 텍스트로 직접 찾기 - 더 넓은 범위
        if (!modelSelector) {
            const allElements = [...document.querySelectorAll('*')];
            modelSelector = allElements.find(el => {
                const text = el.textContent?.toLowerCase() || '';
                const rect = el.getBoundingClientRect();
                const isVisible = rect.width > 0 && rect.height > 0;
                const isClickable = el.tagName === 'BUTTON' || el.onclick || el.getAttribute('role') === 'button' ||
                                   window.getComputedStyle(el).cursor === 'pointer';

                return isVisible && text.includes('chatgpt') && text.includes('instant') &&
                       text.length < 50 && el.childElementCount < 5;
            });
        }

        console.log('[GPT Model] 찾은 요소:', modelSelector?.tagName, modelSelector?.textContent?.substring(0, 50));

        if (modelSelector) {
            // 다양한 클릭 방식 시도
            modelSelector.focus();

            // 1. 일반 click
            modelSelector.click();

            // 2. MouseEvent로 클릭
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            modelSelector.dispatchEvent(clickEvent);

            // 3. pointerdown + pointerup (React 등에서 필요할 수 있음)
            modelSelector.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
            modelSelector.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

            console.log('[GPT Model] 드롭다운 열기 클릭 완료 (여러 방식 시도)');
            return { success: true };
        } else {
            console.log('[GPT Model] 선택기를 찾지 못함');
            // 디버깅: chatgpt 텍스트가 있는 모든 요소 출력
            const withChatgpt = [...document.querySelectorAll('*')].filter(el =>
                el.textContent?.toLowerCase().includes('chatgpt') && el.textContent.length < 100
            );
            console.log('[GPT Model] chatgpt 포함 요소 수:', withChatgpt.length);
            withChatgpt.slice(0, 5).forEach((el, i) => {
                console.log(`[GPT Model] 요소 ${i}:`, el.tagName, el.textContent?.substring(0, 50));
            });
            return { error: '선택기 없음' };
        }
    } catch (e) {
        console.error('[GPT Model] 에러:', e);
        return { error: e.message };
    }
}

// GPT 모델 옵션 선택 (2단계)
function injectSelectGptModelOption(model) {
    try {
        const targetText = model.toLowerCase();
        let modelOption;

        // 바로 전체 요소에서 텍스트로 찾기 (메뉴 아이템 셀렉터가 안 맞을 수 있음)
        const allElements = [...document.querySelectorAll('div, span, button, li, a, p')];
        console.log('[GPT Model] 전체 요소 수:', allElements.length);

        // 1. "Thinking", "Auto", "Instant" 텍스트가 정확히 있는 요소 찾기
        modelOption = allElements.find(el => {
            const text = el.textContent?.trim().toLowerCase() || '';
            const rect = el.getBoundingClientRect();
            const isVisible = rect.width > 0 && rect.height > 0 && rect.top > 0;
            if (!isVisible) return false;

            // 텍스트가 해당 모델명으로 시작하고, 너무 길지 않은 것
            if (targetText === 'thinking') {
                return text.startsWith('thinking') && text.length < 80;
            } else if (targetText === 'auto') {
                return text.startsWith('auto') && text.length < 80;
            } else if (targetText === 'instant') {
                return text.startsWith('instant') && text.length < 80;
            }
            return false;
        });

        // 2. 못 찾았으면 부분 매칭 시도
        if (!modelOption) {
            console.log('[GPT Model] 정확한 매칭 실패, 부분 매칭 시도...');
            modelOption = allElements.find(el => {
                const text = el.textContent?.toLowerCase() || '';
                const rect = el.getBoundingClientRect();
                const isVisible = rect.width > 0 && rect.height > 0 && rect.top > 0;
                if (!isVisible) return false;

                if (targetText === 'thinking') {
                    return (text.includes('thinking') || text.includes('오래 생각')) && text.length < 100;
                } else if (targetText === 'auto') {
                    // auto 또는 자동 (OR 조건)
                    return (text.includes('auto') || text.includes('자동')) && text.length < 100;
                } else if (targetText === 'instant') {
                    return (text.includes('instant') || text.includes('즉시')) && text.length < 100;
                }
                return false;
            });
        }

        if (modelOption) {
            console.log('[GPT Model] 옵션 찾음:', modelOption.tagName, modelOption.textContent.substring(0, 50));
            modelOption.click();
            return { success: true, selected: modelOption.textContent.substring(0, 50) };
        } else {
            console.log('[GPT Model] 옵션을 찾지 못함');
            // 디버깅: thinking이 포함된 요소 출력
            const withThinking = allElements.filter(el => {
                const text = el.textContent?.toLowerCase() || '';
                const rect = el.getBoundingClientRect();
                return rect.width > 0 && text.includes('thinking');
            });
            console.log('[GPT Model] thinking 포함 요소 수:', withThinking.length);
            withThinking.slice(0, 3).forEach((el, i) => {
                console.log(`[GPT Model] thinking 요소 ${i}:`, el.tagName, el.textContent?.substring(0, 60));
            });
            document.body.click();
            return { error: '옵션 없음' };
        }
    } catch (e) {
        console.error('[GPT Model] 에러:', e);
        return { error: e.message };
    }
}

// Gemini 모델 드롭다운 열기 (1단계)
function injectOpenGeminiModelDropdown() {
    try {
        // 1. data-test-id로 찾기
        let modelSelector = document.querySelector('[data-test-id="model-selector"]');

        // 2. 텍스트 기반으로 찾기 (Flash, Pro, Gemini 포함된 버튼)
        if (!modelSelector) {
            const buttons = [...document.querySelectorAll('button')];
            modelSelector = buttons.find(btn => {
                const text = btn.textContent?.toLowerCase() || '';
                // Flash나 Pro 텍스트가 있고, 드롭다운 표시(화살표)가 있는 버튼
                return (text.includes('flash') || text.includes('pro') || text.includes('gemini'))
                    && (btn.querySelector('svg') || btn.querySelector('[class*="arrow"]') || btn.getAttribute('aria-haspopup'));
            });
        }

        // 3. aria-haspopup 버튼 중 모델 관련 찾기
        if (!modelSelector) {
            const menuButtons = [...document.querySelectorAll('button[aria-haspopup="true"], button[aria-haspopup="menu"]')];
            modelSelector = menuButtons.find(btn => {
                const text = btn.textContent?.toLowerCase() || '';
                return text.includes('flash') || text.includes('pro') || text.includes('2.0') || text.includes('1.5');
            });
        }

        // 4. 입력창 근처의 드롭다운 버튼
        if (!modelSelector) {
            modelSelector = document.querySelector('bard-mode-switcher button')
                || document.querySelector('[class*="model"] button')
                || document.querySelector('.input-area button[aria-haspopup]');
        }

        console.log('[Gemini Model] 드롭다운 열기:', modelSelector?.textContent?.substring(0, 50));

        if (modelSelector) {
            modelSelector.click();
            return { success: true };
        } else {
            console.log('[Gemini Model] 선택기를 찾지 못함');
            const allButtons = document.querySelectorAll('button');
            console.log('[Gemini Model] 페이지의 버튼 수:', allButtons.length);
            return { error: '선택기 없음' };
        }
    } catch (e) {
        console.error('[Gemini Model] 에러:', e);
        return { error: e.message };
    }
}

// Gemini 모델 옵션 선택 (2단계)
function injectSelectGeminiModelOption(model) {
    try {
        // 다양한 셀렉터로 메뉴 아이템 찾기
        const menuItems = [...document.querySelectorAll('[role="menuitem"], [role="option"], .model-option, [role="menuitemradio"], mat-option, [role="listbox"] > *, [class*="menu"] li, [class*="dropdown"] button, [class*="menu"] button')];
        console.log('[Gemini Model] 메뉴 아이템 수:', menuItems.length);
        menuItems.forEach((el, i) => console.log(`[Gemini Model] 아이템 ${i}:`, el.textContent.substring(0, 50)));

        let modelOption;

        // 모델별 검색 키워드 (영문 + 한국어)
        const searchPatterns = {
            'flash': ['빠른 모드', '빠른', '2.0 flash', 'flash 2.0', 'gemini flash'],  // Flash (기본)
            'flash-thinking': ['사고 모드', '사고', 'thinking', 'flash thinking'],  // Flash Thinking
            'pro': ['2.0 pro', 'gemini pro', 'gemini 2.0 pro', 'pro 실험', 'pro experimental', 'pro']  // Pro (더 구체적인 패턴 우선)
        };

        const patterns = searchPatterns[model] || [];
        console.log('[Gemini Model] 검색 패턴:', patterns);

        // 메뉴 아이템에서 찾기
        for (const pattern of patterns) {
            modelOption = menuItems.find(el => {
                const text = el.textContent?.toLowerCase() || '';
                // flash 모델은 thinking/사고 모드가 포함되지 않은 것만
                if (model === 'flash') {
                    return text.includes(pattern) && !text.includes('thinking') && !text.includes('사고');
                }
                return text.includes(pattern);
            });
            if (modelOption) break;
        }

        // 못 찾았으면 visible한 요소에서 텍스트로 찾기
        if (!modelOption) {
            console.log('[Gemini Model] 메뉴에서 못 찾음, 전체 요소에서 찾기...');
            const allClickables = [...document.querySelectorAll('button, [role="button"], li, a, div[tabindex], span')];

            for (const pattern of patterns) {
                modelOption = allClickables.find(el => {
                    const text = el.textContent?.toLowerCase() || '';
                    const rect = el.getBoundingClientRect();
                    const isVisible = rect.width > 0 && rect.height > 0 && rect.top >= 0;
                    if (!isVisible) return false;

                    // flash 모델은 thinking/사고 모드가 포함되지 않은 것만
                    if (model === 'flash') {
                        return text.includes(pattern) && !text.includes('thinking') && !text.includes('사고') && text.length < 100;
                    }
                    return text.includes(pattern) && text.length < 100;
                });
                if (modelOption) break;
            }
        }

        if (modelOption) {
            console.log('[Gemini Model] 옵션 선택:', modelOption.textContent);
            modelOption.click();
            return { success: true, selected: modelOption.textContent };
        } else {
            console.log('[Gemini Model] 옵션을 찾지 못함');
            // 디버깅: 현재 보이는 모든 메뉴 아이템 출력
            const visibleItems = [...document.querySelectorAll('[role="menuitem"], [role="option"], [role="menuitemradio"], button, li, div')]
                .filter(el => {
                    const rect = el.getBoundingClientRect();
                    return rect.width > 0 && rect.height > 0 && rect.top > 0 && rect.top < window.innerHeight;
                });
            console.log('[Gemini Model] 화면에 보이는 요소 수:', visibleItems.length);
            visibleItems.slice(0, 10).forEach((el, i) => {
                console.log(`  ${i}: [${el.tagName}] ${el.textContent?.substring(0, 50)}`);
            });
            document.body.click();
            return { error: '옵션 없음' };
        }
    } catch (e) {
        console.error('[Gemini Model] 에러:', e);
        return { error: e.message };
    }
}

// ChatGPT에 메시지 전송 (텍스트 입력만)
function injectSendToGpt(question) {
    try {
        const textarea = document.querySelector('#prompt-textarea')
            || document.querySelector('textarea[data-id="root"]')
            || document.querySelector('div[contenteditable="true"][id="prompt-textarea"]')
            || document.querySelector('textarea');

        if (!textarea) {
            return { error: '입력 필드를 찾을 수 없습니다' };
        }

        // 전송 전 응답 개수 저장 (새 응답 감지용)
        const responses = document.querySelectorAll('[data-message-author-role="assistant"], article[data-testid^="conversation-turn"]:has(.agent-turn), .agent-turn');
        window._gptResponseCountBefore = responses.length;
        console.log('[GPT Send] 텍스트 입력 시작, 현재 응답 개수:', responses.length);

        // contenteditable div인 경우
        if (textarea.getAttribute('contenteditable') === 'true') {
            textarea.innerHTML = `<p>${question}</p>`;
            textarea.dispatchEvent(new InputEvent('input', { bubbles: true }));
        } else {
            textarea.value = question;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }

        console.log('[GPT Send] 텍스트 입력 완료');
        return { success: true, needsSend: true };
    } catch (e) {
        return { error: e.message };
    }
}

// ChatGPT 전송 (버튼 클릭 우선, Enter 키 fallback)
function injectClickSendGpt() {
    try {
        // Stop 버튼인지 확인하는 함수
        const isStopButton = (btn) => {
            const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
            const testId = (btn.getAttribute('data-testid') || '').toLowerCase();
            return ariaLabel.includes('stop') || ariaLabel.includes('중지') ||
                   testId.includes('stop');
        };

        // 먼저 Stop 버튼이 있는지 확인 (응답 생성 중이면 전송 불가)
        const stopButton = document.querySelector('button[aria-label="Stop generating"]')
            || document.querySelector('button[aria-label="Stop"]')
            || document.querySelector('button[aria-label="중지"]')
            || document.querySelector('button[data-testid="stop-button"]');

        if (stopButton && !stopButton.disabled) {
            console.log('[GPT Send] 응답 생성 중 (Stop 버튼 존재) - 전송 대기 필요');
            return { error: '응답 생성 중', needsWait: true };
        }

        // 방법 1: 전송 버튼 클릭 (우선)
        let sendButton = document.querySelector('button[data-testid="send-button"]')
            || document.querySelector('button[aria-label="Send prompt"]')
            || document.querySelector('button[aria-label="메시지 보내기"]')
            || document.querySelector('button[aria-label="Send message"]');

        // 못 찾았으면 입력창 근처 버튼 중 전송 버튼 찾기
        if (!sendButton) {
            const allButtons = [...document.querySelectorAll('button')];
            sendButton = allButtons.find(btn => {
                if (btn.disabled) return false;
                if (isStopButton(btn)) return false;

                const rect = btn.getBoundingClientRect();
                // 화면 하단 근처 (입력창 영역)
                const isNearBottom = rect.bottom > window.innerHeight - 200;
                // SVG 아이콘이 있음
                const hasSvg = btn.querySelector('svg');
                // 작은 버튼
                const isSmall = rect.width < 80 && rect.height < 80;

                return isNearBottom && hasSvg && isSmall;
            });
        }

        if (sendButton && !sendButton.disabled) {
            console.log('[GPT Send] 전송 버튼 찾음:', sendButton.getAttribute('aria-label') || sendButton.getAttribute('data-testid') || sendButton.className);
            sendButton.click();
            console.log('[GPT Send] 버튼 클릭 완료');
            return { success: true, method: 'button' };
        }

        console.log('[GPT Send] 전송 버튼 못 찾음, Enter 키 시도...');

        // 방법 2: Enter 키 (fallback)
        const inputArea = document.querySelector('#prompt-textarea')
            || document.querySelector('div[contenteditable="true"][id="prompt-textarea"]')
            || document.querySelector('[contenteditable="true"]');

        if (inputArea) {
            inputArea.focus();

            // Enter 키 이벤트
            inputArea.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            }));

            console.log('[GPT Send] Enter 키 전송');
            return { success: true, method: 'enter' };
        }

        console.log('[GPT Send] 전송 방법 없음');
        return { error: '전송 방법 없음' };
    } catch (e) {
        console.error('[GPT Send] 에러:', e);
        return { error: e.message };
    }
}

// GPT 버튼 상태 확인 (단순화)
// 전송 버튼(↑) 모양 = 입력 가능/응답 완료 (disabled 여부 무관)
// Stop 버튼(■) 모양 = 응답 생성 중
function injectCheckButtonState() {
    try {
        // Stop 버튼(■) 찾기 - 응답 생성 중
        const stopSelectors = [
            'button[aria-label="Stop generating"]',
            'button[aria-label="Stop"]',
            'button[aria-label="중지"]',
            'button[aria-label="생성 중지"]',
            'button[data-testid="stop-button"]'
        ];
        // Stop 버튼은 존재만 하면 됨 (disabled 무관)
        const stopButton = stopSelectors.map(s => document.querySelector(s)).find(el => el);

        // Thinking 모드도 Stop 상태로 처리 (입력창 근처에서만)
        let isThinking = false;
        const inputArea = document.querySelector('#prompt-textarea, [contenteditable="true"]');
        if (inputArea) {
            const inputContainer = inputArea.closest('form') || inputArea.parentElement?.parentElement;
            if (inputContainer) {
                const containerText = inputContainer.textContent || '';
                if (containerText.includes('지금 응답 받기') || containerText.includes('Get response') ||
                    containerText.includes('Stop thinking') || containerText.includes('생각 중지')) {
                    isThinking = true;
                }
            }
        }

        const hasStopButton = !!stopButton || isThinking;

        // 전송 버튼(↑) 찾기 - 모양만 확인 (disabled 여부 무관)
        // 응답 완료 후 입력창이 비어있으면 전송 버튼이 disabled지만, 모양은 전송 버튼
        const sendSelectors = [
            'button[data-testid="send-button"]',
            'button[aria-label="Send prompt"]',
            'button[aria-label="프롬프트 보내기"]',
            'button[aria-label="메시지 보내기"]',
            'button[aria-label="Send message"]'
        ];
        // disabled 여부와 관계없이 존재만 확인
        const sendButton = sendSelectors.map(s => document.querySelector(s)).find(el => el);
        const hasSendButton = !!sendButton;

        console.log(`[GPT ButtonState] Send=${hasSendButton}, Stop=${hasStopButton}, SendDisabled=${sendButton?.disabled}`);
        return { hasSendButton, hasStopButton };

    } catch (e) {
        console.error('[GPT ButtonState] 에러:', e);
        return { hasSendButton: false, hasStopButton: false, error: e.message };
    }
}

// GPT 마지막 응답 텍스트 가져오기
function injectGetLastResponseGpt() {
    try {
        const responses = document.querySelectorAll('[data-message-author-role="assistant"], .agent-turn, article .markdown');
        if (responses.length > 0) {
            return responses[responses.length - 1].textContent || '';
        }
        return '';
    } catch (e) {
        console.error('[GPT GetResponse] 에러:', e);
        return '';
    }
}

// Gemini에 메시지 전송 (텍스트 입력만)
function injectSendToGemini(question) {
    try {
        const inputArea = document.querySelector('.ql-editor[contenteditable="true"]')
            || document.querySelector('rich-textarea [contenteditable="true"]')
            || document.querySelector('[contenteditable="true"][aria-label*="Enter"]')
            || document.querySelector('[contenteditable="true"]');

        if (!inputArea) {
            return { error: '입력 필드를 찾을 수 없습니다' };
        }

        // 전송 전 응답 개수 저장 (새 응답 감지용)
        const responses = document.querySelectorAll('model-response, .model-response, [data-message-author-role="model"], .response-container, message-content');
        window._geminiResponseCountBefore = responses.length;
        console.log('[Gemini Send] 텍스트 입력 시작, 현재 응답 개수:', responses.length);

        // 텍스트 입력
        inputArea.innerHTML = `<p>${question}</p>`;
        inputArea.dispatchEvent(new Event('input', { bubbles: true }));
        inputArea.dispatchEvent(new Event('change', { bubbles: true }));

        console.log('[Gemini Send] 텍스트 입력 완료');
        return { success: true, needsSend: true };
    } catch (e) {
        return { error: e.message };
    }
}

// Gemini 전송 (버튼 클릭 우선, Enter 키 fallback)
// Stop 버튼 체크 제거 - 전송 버튼만 찾아서 클릭
function injectClickSendGemini() {
    try {
        const allButtons = [...document.querySelectorAll('button')];

        // Stop 버튼인지 확인하는 함수 (전송 버튼 제외용)
        const isStopButton = (btn) => {
            const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
            return ariaLabel.includes('stop') || ariaLabel.includes('중지');
        };

        // 방법 1: 전송 버튼 클릭 (우선)
        // 다양한 셀렉터로 전송 버튼 찾기
        let sendButton = document.querySelector('button[aria-label="Send message"]')
            || document.querySelector('button[aria-label="메시지 보내기"]')
            || document.querySelector('button[aria-label="보내기"]')
            || document.querySelector('button[aria-label="Submit"]')
            || document.querySelector('button[aria-label="제출"]')
            || document.querySelector('button[aria-label="전송"]')
            || document.querySelector('button[data-test-id="send-button"]')
            || document.querySelector('.send-button-container button')
            || document.querySelector('button.send-button');

        // 못 찾았으면 입력창 근처에서 SVG 아이콘 버튼 찾기 (오른쪽 끝)
        if (!sendButton) {
            const allButtons = [...document.querySelectorAll('button')];
            // 화면 하단 오른쪽의 작은 버튼들 찾기
            const bottomRightButtons = allButtons.filter(btn => {
                const rect = btn.getBoundingClientRect();
                const isVisible = rect.width > 0 && rect.height > 0;
                const isNearBottom = rect.bottom > window.innerHeight - 200;
                const isRightSide = rect.right > window.innerWidth - 300;  // 오른쪽 영역
                const hasSvg = btn.querySelector('svg');
                return isVisible && isNearBottom && isRightSide && hasSvg;
            });

            console.log('[Gemini Send] 하단 오른쪽 버튼 수:', bottomRightButtons.length);

            // Stop/마이크 버튼 제외하고 가장 오른쪽 버튼 선택
            sendButton = bottomRightButtons.filter(btn => {
                const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
                if (isStopButton(btn)) return false;
                if (ariaLabel.includes('voice') || ariaLabel.includes('음성') || ariaLabel.includes('mic')) return false;
                if (ariaLabel.includes('attach') || ariaLabel.includes('첨부') || ariaLabel.includes('add')) return false;
                return true;
            }).sort((a, b) => {
                // 가장 오른쪽 버튼 선택
                return b.getBoundingClientRect().right - a.getBoundingClientRect().right;
            })[0];
        }

        if (sendButton) {
            console.log('[Gemini Send] 전송 버튼 찾음:', sendButton.getAttribute('aria-label') || sendButton.className, 'disabled:', sendButton.disabled);
            sendButton.click();
            console.log('[Gemini Send] 버튼 클릭 완료');
            return { success: true, method: 'button' };
        }

        console.log('[Gemini Send] 전송 버튼 못 찾음, Enter 키 시도...');

        // 방법 2: Enter 키 (fallback)
        const inputArea = document.querySelector('.ql-editor[contenteditable="true"]')
            || document.querySelector('rich-textarea [contenteditable="true"]')
            || document.querySelector('[contenteditable="true"]');

        if (inputArea) {
            inputArea.focus();

            // Enter 키 이벤트
            inputArea.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            }));

            console.log('[Gemini Send] Enter 키 전송');
            return { success: true, method: 'enter' };
        }

        console.log('[Gemini Send] 전송 방법 없음');
        return { error: '전송 방법 없음' };
    } catch (e) {
        console.error('[Gemini Send] 에러:', e);
        return { error: e.message };
    }
}

// Gemini 버튼 상태 확인 (단순화)
// 전송 버튼(↑) 모양 = 입력 가능/응답 완료 (disabled 여부 무관)
// Stop 버튼(■) 모양 = 응답 생성 중
function injectCheckButtonStateGemini() {
    try {
        // Stop 버튼(■) 찾기 - 응답 생성 중
        const allButtons = [...document.querySelectorAll('button')];
        const stopButton = allButtons.find(btn => {
            const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
            const btnText = (btn.textContent || '').toLowerCase();
            const rect = btn.getBoundingClientRect();
            const isVisible = rect.width > 0 && rect.height > 0;
            if (!isVisible) return false;  // disabled 조건 제거

            return ariaLabel.includes('stop') || ariaLabel.includes('중지') ||
                   btnText.includes('stop') || btnText.includes('중지') ||
                   btnText.includes('대답 생성 중지');
        });
        const hasStopButton = !!stopButton;

        // 전송 버튼(↑) 찾기 - 모양만 확인 (disabled 여부 무관)
        // 화면 하단 입력창 근처의 작은 버튼
        const sendButton = allButtons.find(btn => {
            // disabled 조건 제거 - 모양만 확인
            const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
            if (ariaLabel.includes('stop') || ariaLabel.includes('중지')) return false;
            if (ariaLabel.includes('voice') || ariaLabel.includes('음성') || ariaLabel.includes('mic')) return false;

            const rect = btn.getBoundingClientRect();
            const isVisible = rect.width > 0 && rect.height > 0;
            const isNearBottom = rect.bottom > window.innerHeight - 150;
            const isSmall = rect.width < 80 && rect.height < 80;
            const hasSvg = btn.querySelector('svg');

            return isVisible && isNearBottom && isSmall && hasSvg;
        });

        // aria-label로도 찾기 (disabled 무관)
        const sendByLabel = document.querySelector('button[aria-label="Send message"]')
            || document.querySelector('button[aria-label="메시지 보내기"]')
            || document.querySelector('button[aria-label="보내기"]');

        const hasSendButton = !!(sendButton || sendByLabel);

        console.log(`[Gemini ButtonState] Send=${hasSendButton}, Stop=${hasStopButton}`);
        return { hasSendButton, hasStopButton };

    } catch (e) {
        console.error('[Gemini ButtonState] 에러:', e);
        return { hasSendButton: false, hasStopButton: false, error: e.message };
    }
}

// Gemini 마지막 응답 텍스트 가져오기
function injectGetLastResponseGemini() {
    try {
        const responseContainers = document.querySelectorAll('model-response, .model-response, [data-message-author-role="model"]');
        if (responseContainers.length > 0) {
            const lastContainer = responseContainers[responseContainers.length - 1];
            const contentEl = lastContainer.querySelector('.markdown-main-panel')
                || lastContainer.querySelector('message-content')
                || lastContainer.querySelector('.response-text')
                || lastContainer;
            return contentEl?.textContent?.trim() || '';
        }
        return '';
    } catch (e) {
        console.error('[Gemini GetResponse] 에러:', e);
        return '';
    }
}
