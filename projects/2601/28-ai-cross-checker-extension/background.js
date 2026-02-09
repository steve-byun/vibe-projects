// Background Service Worker - 크로스체크 로직 v2
// Phase 1: 원본 질문 → A(GPT), B(Gemini), C(Claude) 병렬
// Phase 2: A+B+C를 Gemini에 보내서 중립 취합 + 팩트체크

// 상태 초기화
chrome.runtime.onInstalled.addListener(() => {
    resetState();
    console.log('AI Cross Checker v2 installed');
});

function resetState() {
    return chrome.storage.local.set({
        phase: 'idle',           // idle, phase1, phase2, done
        gptPhase: 'idle',        // idle, asking, asked, done
        geminiPhase: 'idle',     // idle, asking, asked, consolidating, done
        claudePhase: 'idle',     // idle, asking, asked, done
        responseA: '',           // GPT 원본 답변
        responseB: '',           // Gemini 원본 답변
        responseC: '',           // Claude 원본 답변
        finalResult: '',         // Gemini 최종 취합 결과
        lastQuestion: '',
        error: '',
        debugData: null
    });
}

// 최종 결과 검증
function validateFinalResult(result) {
    if (!result || result.length < 30) {
        return { valid: false, reason: '결과가 비어있거나 너무 짧습니다' };
    }

    const hasTag = /===동일===|===GPT===|===GEMINI===|===CLAUDE===|\(결과\)|\(GPT\)|\(Gemini\)|\(Claude\)/i.test(result);

    if (!hasTag && result.length < 50) {
        return { valid: false, reason: '결과 형식이 올바르지 않습니다' };
    }

    const errorPatterns = ['입력 필드를 찾을 수 없', '연결 실패', '응답 없음', '시간 초과'];
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
        changeModelImmediate(request.tabId, request.type, request.model)
            .then(() => sendResponse({ success: true }))
            .catch(e => sendResponse({ success: false, error: e.message }));
        return true;
    }
});

// 메인 크로스체크 플로우 (v2: 3AI → Gemini 취합)
async function handleSendQuestion(request) {
    const { question, gptTabId, geminiTabId, claudeTabId, gptModel, geminiModel, newChat } = request;

    try {
        // 새 채팅 시작
        if (newChat) {
            console.log('[Prep] 새 채팅 시작...');
            await Promise.all([
                startNewChat(gptTabId, 'gpt'),
                startNewChat(geminiTabId, 'gemini'),
                startNewChat(claudeTabId, 'claude')
            ]);
            await sleep(1000);

            // 모델 선택 (병렬)
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

        // ========== Phase 1: 원본 질문 (GPT/Gemini/Claude 병렬) ==========
        await chrome.storage.local.set({
            phase: 'phase1',
            gptPhase: 'asking',
            geminiPhase: 'asking',
            claudePhase: 'asking',
            lastQuestion: question,
            error: ''
        });

        console.log('[Phase 1] 원본 질문 전송 (3 AI)...');

        // 1. 세 곳에 텍스트 입력
        console.log('[Phase 1] GPT 텍스트 입력...');
        await chrome.tabs.update(gptTabId, { active: true });
        await sleep(100);
        await inputText(gptTabId, question, 'gpt');

        console.log('[Phase 1] Gemini 텍스트 입력...');
        await chrome.tabs.update(geminiTabId, { active: true });
        await sleep(1000);
        await inputText(geminiTabId, question, 'gemini');

        console.log('[Phase 1] Claude 텍스트 입력...');
        await chrome.tabs.update(claudeTabId, { active: true });
        await sleep(1000);
        await inputText(claudeTabId, question, 'claude');

        // 2. 세 곳에 전송 버튼 클릭
        console.log('[Phase 1] GPT 전송...');
        await chrome.tabs.update(gptTabId, { active: true });
        await sleep(100);
        await clickSend(gptTabId, 'gpt');

        console.log('[Phase 1] Gemini 전송...');
        await chrome.tabs.update(geminiTabId, { active: true });
        await sleep(500);
        await clickSend(geminiTabId, 'gemini');

        console.log('[Phase 1] Claude 전송...');
        await chrome.tabs.update(claudeTabId, { active: true });
        await sleep(500);
        await clickSend(claudeTabId, 'claude');

        // 3. 응답 대기 (3개 병렬)
        console.log('[Phase 1] 응답 대기 (3개 병렬)...');
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

        const claudePromise = waitForResponse(claudeTabId, 'claude').then(async (response) => {
            await chrome.storage.local.set({ responseC: response, claudePhase: 'asked' });
            console.log('[Phase 1] Claude 완료 - C:', response.substring(0, 100), '...');
            return response;
        });

        const [responseA, responseB, responseC] = await Promise.all([gptPromise, geminiPromise, claudePromise]);

        // 응답 유효성 검사
        if (!responseA || responseA.length === 0) throw new Error('GPT 응답이 비어있습니다. 다시 시도해주세요.');
        if (!responseB || responseB.length === 0) throw new Error('Gemini 응답이 비어있습니다. 다시 시도해주세요.');
        if (!responseC || responseC.length === 0) throw new Error('Claude 응답이 비어있습니다. 다시 시도해주세요.');

        console.log('[Phase 1] 3개 AI 모두 완료!');
        console.log(`[Phase 1] GPT: ${responseA.length}자 / Gemini: ${responseB.length}자 / Claude: ${responseC.length}자`);

        // Phase 1 → Phase 2 전환 안정화 대기
        await sleep(1500);

        // ========== Phase 2: Gemini 최종 취합 ==========
        await chrome.storage.local.set({
            phase: 'phase2',
            gptPhase: 'done',
            geminiPhase: 'consolidating',
            claudePhase: 'done'
        });

        console.log('[Phase 2] Gemini 최종 취합 시작...');

        const consolidationPrompt = createConsolidationPrompt(question, responseA, responseB, responseC);

        // Gemini에 전송 (재시도 로직)
        let finalResult = '';
        const maxRetries = 3;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            console.log(`[Phase 2] 전송 시도 ${attempt}/${maxRetries}...`);
            try {
                finalResult = await sendAndWaitWithTimeout(geminiTabId, consolidationPrompt, 'gemini', 15000);
                break;
            } catch (retryError) {
                console.log(`[Phase 2] 시도 ${attempt} 실패:`, retryError.message);
                if (attempt === maxRetries) {
                    throw new Error(`Gemini 취합 전송 실패 (${maxRetries}회 시도): ${retryError.message}`);
                }
                await sleep(2000);
            }
        }

        // 결과 검증
        const isValidResult = validateFinalResult(finalResult);

        if (!isValidResult.valid) {
            console.error('[Phase 2] 결과 검증 실패:', isValidResult.reason);
            await chrome.storage.local.set({
                phase: 'error',
                error: `취합 실패: ${isValidResult.reason}`,
                debugData: { responseA, responseB, responseC, finalResult }
            });
            return;
        }

        await chrome.storage.local.set({
            phase: 'done',
            gptPhase: 'done',
            geminiPhase: 'done',
            claudePhase: 'done',
            finalResult
        });

        console.log('[Phase 2] 완료!');

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
    const funcMap = {
        'gpt': injectNewChatGpt,
        'gemini': injectNewChatGemini,
        'claude': injectNewChatClaude
    };
    const func = funcMap[type];
    if (func) {
        await chrome.scripting.executeScript({
            target: { tabId },
            func: func
        });
    }
}

// 모델 선택
async function selectModel(tabId, type, model) {
    const openFunc = type === 'gpt' ? injectOpenGptModelDropdown : injectOpenGeminiModelDropdown;
    await chrome.scripting.executeScript({
        target: { tabId },
        func: openFunc
    });

    await sleep(500);

    const selectFunc = type === 'gpt' ? injectSelectGptModelOption : injectSelectGeminiModelOption;
    await chrome.scripting.executeScript({
        target: { tabId },
        func: selectFunc,
        args: [model]
    });
}

// 즉시 모델 변경
async function changeModelImmediate(tabId, type, model) {
    console.log(`[Model Change] 즉시 변경: ${type} -> ${model}`);
    await selectModel(tabId, type, model);
    console.log(`[Model Change] 완료: ${type} -> ${model}`);
}

// 최종 취합 프롬프트 (Gemini용 - 중립 취합 + 팩트체크)
function createConsolidationPrompt(question, responseA, responseB, responseC) {
    return `[시스템 지시]
너는 지금부터 "중립 취합자" 역할이다.
아래 3개 AI(GPT, Gemini, Claude)의 답변을 객관적으로 취합해야 한다.

절대 규칙:
- Gemini(너 자신)의 답변에 가중치를 부여하지 마라. 3개 답변을 완전히 동등하게 취급하라.
- 자기 답변이라고 해서 옹호하거나 유리하게 해석하지 마라.
- 사실 관계가 의심되면 웹 검색으로 확인하라.
- 잘못된 정보가 있으면 어떤 AI의 답변이든 명확히 지적하라.

사용자 질문: "${question}"

[GPT 답변]
${responseA}

[Gemini 답변]
${responseB}

[Claude 답변]
${responseC}

위 3개 답변을 취합해서 아래 형식으로 출력하라:

===동일===
(3개 AI가 공통으로 동의하는 내용)

===GPT===
(GPT만의 고유한 의견/분석, 없으면 "없음")

===GEMINI===
(Gemini만의 고유한 의견/분석, 없으면 "없음")

===CLAUDE===
(Claude만의 고유한 의견/분석, 없으면 "없음")

규칙:
1. 반드시 ===동일===, ===GPT===, ===GEMINI===, ===CLAUDE=== 구분자 사용
2. 구분자는 정확히 위 형식 (등호 3개씩)
3. 제목/서론/맺음말 없이 내용만
4. 각 섹션 내용은 bullet point(•)로 정리
5. 사실 오류가 있으면 해당 섹션에서 ⚠️로 표시하고 올바른 정보 제공
6. 2개 AI만 동의하고 1개가 다른 경우, 동일 섹션에 넣되 "(GPT, Claude 동의)" 식으로 표기`;
}

// 텍스트 입력만
async function inputText(tabId, message, type) {
    console.log(`[${type}] 텍스트 입력`);

    const funcMap = {
        'gpt': injectSendToGpt,
        'gemini': injectSendToGemini,
        'claude': injectSendToClaude
    };
    const sendFunc = funcMap[type];
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

// 전송 버튼 클릭만
async function clickSend(tabId, type) {
    console.log(`[${type}] 전송 버튼 클릭`);

    const funcMap = {
        'gpt': injectClickSendGpt,
        'gemini': injectClickSendGemini,
        'claude': injectClickSendClaude
    };
    const clickFunc = funcMap[type];
    let waitCount = 0;

    while (true) {
        const clickResult = await chrome.scripting.executeScript({
            target: { tabId },
            func: clickFunc
        });

        const result = clickResult[0]?.result;

        if (result?.needsWait) {
            waitCount++;
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

// 메시지 전송 (입력 + 전송)
async function sendMessage(tabId, message, type) {
    await inputText(tabId, message, type);
    const waitAfterInput = (type === 'gemini' || type === 'claude') ? 500 : 100;
    await sleep(waitAfterInput);
    await clickSend(tabId, type);
}

// 메시지 전송 및 응답 대기 (탭 활성화 포함)
async function sendAndWait(tabId, message, type) {
    console.log(`[${type}] 메시지 전송 시작 (탭 활성화 + 대기)`);

    await chrome.tabs.update(tabId, { active: true });
    const waitTime = (type === 'gemini' || type === 'claude') ? 1000 : 100;
    await sleep(waitTime);

    await sendMessage(tabId, message, type);
    const response = await waitForResponse(tabId, type);
    return response;
}

// 메시지 전송 및 응답 대기 (초기 전송 확인 타임아웃)
async function sendAndWaitWithTimeout(tabId, message, type, initialTimeout) {
    console.log(`[${type}] 메시지 전송 시작 (타임아웃 ${initialTimeout}ms)`);

    await chrome.tabs.update(tabId, { active: true });
    const waitTime = (type === 'gemini' || type === 'claude') ? 1000 : 100;
    await sleep(waitTime);

    await sendMessage(tabId, message, type);
    const response = await waitForResponseWithInitialTimeout(tabId, type, initialTimeout);
    return response;
}

// 응답 대기 (초기 타임아웃)
async function waitForResponseWithInitialTimeout(tabId, type, initialTimeout) {
    const funcMap = {
        'gpt': injectCheckButtonState,
        'gemini': injectCheckButtonStateGemini,
        'claude': injectCheckButtonStateClaude
    };
    const checkFunc = funcMap[type];
    let checkCount = 0;
    const checkInterval = 500;
    let sawStopButton = false;
    const maxInitialChecks = Math.ceil(initialTimeout / checkInterval);

    console.log(`[${type}] 응답 대기 시작 (초기 타임아웃: ${initialTimeout}ms)`);

    while (true) {
        await sleep(checkInterval);
        checkCount++;

        try {
            const result = await chrome.scripting.executeScript({
                target: { tabId },
                func: checkFunc
            });

            const { hasStopButton } = result[0]?.result || {};
            const elapsedSec = Math.floor(checkCount * checkInterval / 1000);

            if (hasStopButton) {
                sawStopButton = true;
                if (elapsedSec > 0 && elapsedSec % 10 === 0 && checkCount % (10000 / checkInterval) === 0) {
                    console.log(`[${type}] 응답 생성 중... (${elapsedSec}초)`);
                }
                continue;
            }

            if (!hasStopButton && sawStopButton) {
                console.log(`[${type}] 응답 완료! (${elapsedSec}초)`);

                const textFuncMap = {
                    'gpt': injectGetLastResponseGpt,
                    'gemini': injectGetLastResponseGemini,
                    'claude': injectGetLastResponseClaude
                };
                const textResult = await chrome.scripting.executeScript({
                    target: { tabId },
                    func: textFuncMap[type]
                });
                const text = textResult[0]?.result || '';
                console.log(`[${type}] 응답 텍스트: ${text.length}자`);
                return text;
            }

            if (!sawStopButton && checkCount >= maxInitialChecks) {
                throw new Error(`전송 후 ${initialTimeout}ms 동안 응답 생성이 시작되지 않음 (Stop 버튼 미감지)`);
            }

        } catch (e) {
            if (e.message.includes('Stop 버튼 미감지')) throw e;
            console.error(`[${type}] Check error:`, e);
        }
    }
}

// 응답 대기 (버튼 모양 기반)
async function waitForResponse(tabId, type) {
    const funcMap = {
        'gpt': injectCheckButtonState,
        'gemini': injectCheckButtonStateGemini,
        'claude': injectCheckButtonStateClaude
    };
    const checkFunc = funcMap[type];
    let checkCount = 0;
    const checkInterval = 500;
    let sawStopButton = false;

    console.log(`[${type}] 응답 대기 시작`);

    while (true) {
        await sleep(checkInterval);
        checkCount++;

        try {
            const result = await chrome.scripting.executeScript({
                target: { tabId },
                func: checkFunc
            });

            const { hasStopButton } = result[0]?.result || {};
            const elapsedSec = Math.floor(checkCount * checkInterval / 1000);

            if (elapsedSec > 0 && elapsedSec % 60 === 0 && checkCount % (60000 / checkInterval) === 0) {
                console.log(`[${type}] 응답 대기 중... (${elapsedSec}초 경과)`);
            }

            if (hasStopButton) {
                sawStopButton = true;
                if (elapsedSec > 0 && elapsedSec % 10 === 0 && checkCount % (10000 / checkInterval) === 0) {
                    console.log(`[${type}] 응답 생성 중... (${elapsedSec}초)`);
                }
                continue;
            }

            if (!hasStopButton && sawStopButton) {
                console.log(`[${type}] 응답 완료! (${elapsedSec}초)`);

                const textFuncMap = {
                    'gpt': injectGetLastResponseGpt,
                    'gemini': injectGetLastResponseGemini,
                    'claude': injectGetLastResponseClaude
                };
                const textResult = await chrome.scripting.executeScript({
                    target: { tabId },
                    func: textFuncMap[type]
                });
                const text = textResult[0]?.result || '';
                console.log(`[${type}] 응답 텍스트: ${text.length}자`);
                return text;
            }

            if (!sawStopButton && elapsedSec > 0 && elapsedSec % 5 === 0 && checkCount % (5000 / checkInterval) === 0) {
                console.log(`[${type}] Stop 버튼 대기 중... (${elapsedSec}초)`);
            }

        } catch (e) {
            console.error(`[${type}] Check error:`, e);
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============ 페이지에 주입될 함수들 ============

// ===== GPT 함수들 =====

function injectNewChatGpt() {
    try {
        const newChatBtn = document.querySelector('a[href="/"]')
            || document.querySelector('[data-testid="new-chat-button"]')
            || document.querySelector('nav a[class*="new-chat"]')
            || document.querySelector('button[aria-label="New chat"]');

        if (newChatBtn) { newChatBtn.click(); return { success: true }; }
        window.location.href = 'https://chatgpt.com/';
        return { success: true };
    } catch (e) { return { error: e.message }; }
}

function injectOpenGptModelDropdown() {
    try {
        const allClickables = [...document.querySelectorAll('button, [role="button"], div[class*="menu"], span[class*="menu"], a, [aria-haspopup]')];
        let modelSelector = allClickables.find(el => {
            const text = el.textContent?.toLowerCase() || '';
            return text.includes('chatgpt') && (
                text.includes('auto') || text.includes('instant') || text.includes('thinking') ||
                text.includes('5.') || text.includes('4o')
            ) && text.length < 50;
        });

        if (!modelSelector) modelSelector = document.querySelector('[data-testid="model-switcher-dropdown-button"]');

        if (!modelSelector) {
            const allElements = [...document.querySelectorAll('*')];
            modelSelector = allElements.find(el => {
                const text = el.textContent?.toLowerCase() || '';
                const rect = el.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0 && text.includes('chatgpt') && text.includes('instant') &&
                       text.length < 50 && el.childElementCount < 5;
            });
        }

        if (modelSelector) {
            modelSelector.focus();
            modelSelector.click();
            modelSelector.dispatchEvent(new MouseEvent('click', { view: window, bubbles: true, cancelable: true }));
            modelSelector.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
            modelSelector.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
            return { success: true };
        }
        return { error: '선택기 없음' };
    } catch (e) { return { error: e.message }; }
}

function injectSelectGptModelOption(model) {
    try {
        const targetText = model.toLowerCase();
        const allElements = [...document.querySelectorAll('div, span, button, li, a, p')];

        let modelOption = allElements.find(el => {
            const text = el.textContent?.trim().toLowerCase() || '';
            const rect = el.getBoundingClientRect();
            if (!(rect.width > 0 && rect.height > 0 && rect.top > 0)) return false;
            if (targetText === 'thinking') return text.startsWith('thinking') && text.length < 80;
            if (targetText === 'auto') return text.startsWith('auto') && text.length < 80;
            if (targetText === 'instant') return text.startsWith('instant') && text.length < 80;
            return false;
        });

        if (!modelOption) {
            modelOption = allElements.find(el => {
                const text = el.textContent?.toLowerCase() || '';
                const rect = el.getBoundingClientRect();
                if (!(rect.width > 0 && rect.height > 0 && rect.top > 0)) return false;
                if (targetText === 'thinking') return (text.includes('thinking') || text.includes('오래 생각')) && text.length < 100;
                if (targetText === 'auto') return (text.includes('auto') || text.includes('자동')) && text.length < 100;
                if (targetText === 'instant') return (text.includes('instant') || text.includes('즉시')) && text.length < 100;
                return false;
            });
        }

        if (modelOption) { modelOption.click(); return { success: true }; }
        document.body.click();
        return { error: '옵션 없음' };
    } catch (e) { return { error: e.message }; }
}

function injectSendToGpt(question) {
    try {
        const textarea = document.querySelector('#prompt-textarea')
            || document.querySelector('textarea[data-id="root"]')
            || document.querySelector('div[contenteditable="true"][id="prompt-textarea"]')
            || document.querySelector('textarea');

        if (!textarea) return { error: '입력 필드를 찾을 수 없습니다' };

        const responses = document.querySelectorAll('[data-message-author-role="assistant"], article[data-testid^="conversation-turn"]:has(.agent-turn), .agent-turn');
        window._gptResponseCountBefore = responses.length;

        if (textarea.getAttribute('contenteditable') === 'true') {
            textarea.innerHTML = `<p>${question}</p>`;
            textarea.dispatchEvent(new InputEvent('input', { bubbles: true }));
        } else {
            textarea.value = question;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }

        return { success: true, needsSend: true };
    } catch (e) { return { error: e.message }; }
}

function injectClickSendGpt() {
    try {
        const isStopButton = (btn) => {
            const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
            const testId = (btn.getAttribute('data-testid') || '').toLowerCase();
            return ariaLabel.includes('stop') || ariaLabel.includes('중지') || testId.includes('stop');
        };

        const stopButton = document.querySelector('button[aria-label="Stop generating"]')
            || document.querySelector('button[aria-label="Stop"]')
            || document.querySelector('button[aria-label="중지"]')
            || document.querySelector('button[data-testid="stop-button"]');

        if (stopButton && !stopButton.disabled) return { error: '응답 생성 중', needsWait: true };

        let sendButton = document.querySelector('button[data-testid="send-button"]')
            || document.querySelector('button[aria-label="Send prompt"]')
            || document.querySelector('button[aria-label="메시지 보내기"]')
            || document.querySelector('button[aria-label="Send message"]');

        if (!sendButton) {
            sendButton = [...document.querySelectorAll('button')].find(btn => {
                if (btn.disabled || isStopButton(btn)) return false;
                const rect = btn.getBoundingClientRect();
                return rect.bottom > window.innerHeight - 200 && btn.querySelector('svg') && rect.width < 80;
            });
        }

        if (sendButton && !sendButton.disabled) { sendButton.click(); return { success: true }; }

        const inputArea = document.querySelector('#prompt-textarea')
            || document.querySelector('div[contenteditable="true"][id="prompt-textarea"]')
            || document.querySelector('[contenteditable="true"]');

        if (inputArea) {
            inputArea.focus();
            inputArea.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true
            }));
            return { success: true, method: 'enter' };
        }

        return { error: '전송 방법 없음' };
    } catch (e) { return { error: e.message }; }
}

function injectCheckButtonState() {
    try {
        const stopSelectors = [
            'button[aria-label="Stop generating"]', 'button[aria-label="Stop"]',
            'button[aria-label="중지"]', 'button[aria-label="생성 중지"]',
            'button[data-testid="stop-button"]'
        ];
        const stopButton = stopSelectors.map(s => document.querySelector(s)).find(el => el);

        let isThinking = false;
        const inputArea = document.querySelector('#prompt-textarea, [contenteditable="true"]');
        if (inputArea) {
            const inputContainer = inputArea.closest('form') || inputArea.parentElement?.parentElement;
            if (inputContainer) {
                const t = inputContainer.textContent || '';
                if (t.includes('지금 응답 받기') || t.includes('Get response') ||
                    t.includes('Stop thinking') || t.includes('생각 중지')) isThinking = true;
            }
        }

        const hasStopButton = !!stopButton || isThinking;
        const sendSelectors = [
            'button[data-testid="send-button"]', 'button[aria-label="Send prompt"]',
            'button[aria-label="프롬프트 보내기"]', 'button[aria-label="메시지 보내기"]',
            'button[aria-label="Send message"]'
        ];
        const hasSendButton = !!sendSelectors.map(s => document.querySelector(s)).find(el => el);

        return { hasSendButton, hasStopButton };
    } catch (e) { return { hasSendButton: false, hasStopButton: false }; }
}

function injectGetLastResponseGpt() {
    try {
        const responses = document.querySelectorAll('[data-message-author-role="assistant"], .agent-turn, article .markdown');
        if (responses.length > 0) return responses[responses.length - 1].textContent || '';
        return '';
    } catch (e) { return ''; }
}

// ===== Gemini 함수들 =====

function injectNewChatGemini() {
    try {
        const newChatBtn = document.querySelector('button[aria-label="New chat"]')
            || document.querySelector('a[href="/app"]')
            || document.querySelector('[data-test-id="new-chat-button"]');

        if (newChatBtn) { newChatBtn.click(); return { success: true }; }
        window.location.href = 'https://gemini.google.com/app';
        return { success: true };
    } catch (e) { return { error: e.message }; }
}

function injectOpenGeminiModelDropdown() {
    try {
        let modelSelector = document.querySelector('[data-test-id="model-selector"]');

        if (!modelSelector) {
            modelSelector = [...document.querySelectorAll('button')].find(btn => {
                const text = btn.textContent?.toLowerCase() || '';
                return (text.includes('flash') || text.includes('pro') || text.includes('gemini'))
                    && (btn.querySelector('svg') || btn.getAttribute('aria-haspopup'));
            });
        }

        if (!modelSelector) {
            modelSelector = [...document.querySelectorAll('button[aria-haspopup="true"], button[aria-haspopup="menu"]')].find(btn => {
                const text = btn.textContent?.toLowerCase() || '';
                return text.includes('flash') || text.includes('pro') || text.includes('2.0');
            });
        }

        if (!modelSelector) {
            modelSelector = document.querySelector('bard-mode-switcher button')
                || document.querySelector('[class*="model"] button');
        }

        if (modelSelector) { modelSelector.click(); return { success: true }; }
        return { error: '선택기 없음' };
    } catch (e) { return { error: e.message }; }
}

function injectSelectGeminiModelOption(model) {
    try {
        const menuItems = [...document.querySelectorAll('[role="menuitem"], [role="option"], .model-option, [role="menuitemradio"], mat-option, [role="listbox"] > *, [class*="menu"] li, [class*="dropdown"] button, [class*="menu"] button')];

        const searchPatterns = {
            'flash': ['빠른 모드', '빠른', '2.0 flash', 'flash 2.0', 'gemini flash'],
            'flash-thinking': ['사고 모드', '사고', 'thinking', 'flash thinking'],
            'pro': ['2.0 pro', 'gemini pro', 'gemini 2.0 pro', 'pro 실험', 'pro experimental', 'pro']
        };

        const patterns = searchPatterns[model] || [];
        let modelOption;

        for (const pattern of patterns) {
            modelOption = menuItems.find(el => {
                const text = el.textContent?.toLowerCase() || '';
                if (model === 'flash') return text.includes(pattern) && !text.includes('thinking') && !text.includes('사고');
                return text.includes(pattern);
            });
            if (modelOption) break;
        }

        if (!modelOption) {
            const allClickables = [...document.querySelectorAll('button, [role="button"], li, a, div[tabindex], span')];
            for (const pattern of patterns) {
                modelOption = allClickables.find(el => {
                    const text = el.textContent?.toLowerCase() || '';
                    const rect = el.getBoundingClientRect();
                    if (!(rect.width > 0 && rect.height > 0 && rect.top >= 0)) return false;
                    if (model === 'flash') return text.includes(pattern) && !text.includes('thinking') && !text.includes('사고') && text.length < 100;
                    return text.includes(pattern) && text.length < 100;
                });
                if (modelOption) break;
            }
        }

        if (modelOption) { modelOption.click(); return { success: true }; }
        document.body.click();
        return { error: '옵션 없음' };
    } catch (e) { return { error: e.message }; }
}

function injectSendToGemini(question) {
    try {
        const inputArea = document.querySelector('.ql-editor[contenteditable="true"]')
            || document.querySelector('rich-textarea [contenteditable="true"]')
            || document.querySelector('[contenteditable="true"][aria-label*="Enter"]')
            || document.querySelector('[contenteditable="true"]');

        if (!inputArea) return { error: '입력 필드를 찾을 수 없습니다' };

        const responses = document.querySelectorAll('model-response, .model-response, [data-message-author-role="model"], .response-container, message-content');
        window._geminiResponseCountBefore = responses.length;

        inputArea.innerHTML = `<p>${question}</p>`;
        inputArea.dispatchEvent(new Event('input', { bubbles: true }));
        inputArea.dispatchEvent(new Event('change', { bubbles: true }));

        return { success: true, needsSend: true };
    } catch (e) { return { error: e.message }; }
}

function injectClickSendGemini() {
    try {
        const allButtons = [...document.querySelectorAll('button')];
        const isStopButton = (btn) => {
            const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
            return ariaLabel.includes('stop') || ariaLabel.includes('중지');
        };

        let sendButton = document.querySelector('button[aria-label="Send message"]')
            || document.querySelector('button[aria-label="메시지 보내기"]')
            || document.querySelector('button[aria-label="보내기"]')
            || document.querySelector('button[aria-label="Submit"]')
            || document.querySelector('button[aria-label="제출"]')
            || document.querySelector('button[aria-label="전송"]')
            || document.querySelector('button[data-test-id="send-button"]')
            || document.querySelector('.send-button-container button')
            || document.querySelector('button.send-button');

        if (!sendButton) {
            sendButton = allButtons.filter(btn => {
                const rect = btn.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0 && rect.bottom > window.innerHeight - 200 &&
                       rect.right > window.innerWidth - 300 && btn.querySelector('svg');
            }).filter(btn => {
                const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
                if (isStopButton(btn)) return false;
                if (ariaLabel.includes('voice') || ariaLabel.includes('음성') || ariaLabel.includes('mic')) return false;
                if (ariaLabel.includes('attach') || ariaLabel.includes('첨부') || ariaLabel.includes('add')) return false;
                return true;
            }).sort((a, b) => b.getBoundingClientRect().right - a.getBoundingClientRect().right)[0];
        }

        if (sendButton) { sendButton.click(); return { success: true }; }

        const inputArea = document.querySelector('.ql-editor[contenteditable="true"]')
            || document.querySelector('rich-textarea [contenteditable="true"]')
            || document.querySelector('[contenteditable="true"]');

        if (inputArea) {
            inputArea.focus();
            inputArea.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true
            }));
            return { success: true, method: 'enter' };
        }

        return { error: '전송 방법 없음' };
    } catch (e) { return { error: e.message }; }
}

function injectCheckButtonStateGemini() {
    try {
        const allButtons = [...document.querySelectorAll('button')];
        const stopButton = allButtons.find(btn => {
            const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
            const btnText = (btn.textContent || '').toLowerCase();
            const rect = btn.getBoundingClientRect();
            if (!(rect.width > 0 && rect.height > 0)) return false;
            return ariaLabel.includes('stop') || ariaLabel.includes('중지') ||
                   btnText.includes('stop') || btnText.includes('중지') || btnText.includes('대답 생성 중지');
        });
        const hasStopButton = !!stopButton;

        const sendButton = allButtons.find(btn => {
            const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
            if (ariaLabel.includes('stop') || ariaLabel.includes('중지')) return false;
            if (ariaLabel.includes('voice') || ariaLabel.includes('음성') || ariaLabel.includes('mic')) return false;
            const rect = btn.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && rect.bottom > window.innerHeight - 150 &&
                   rect.width < 80 && btn.querySelector('svg');
        });

        const sendByLabel = document.querySelector('button[aria-label="Send message"]')
            || document.querySelector('button[aria-label="메시지 보내기"]')
            || document.querySelector('button[aria-label="보내기"]');

        const hasSendButton = !!(sendButton || sendByLabel);
        return { hasSendButton, hasStopButton };
    } catch (e) { return { hasSendButton: false, hasStopButton: false }; }
}

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
    } catch (e) { return ''; }
}

// ===== Claude 함수들 =====

function injectNewChatClaude() {
    try {
        const newChatBtn = document.querySelector('a[href="/new"]')
            || document.querySelector('button[aria-label="New chat"]')
            || document.querySelector('button[aria-label="새 채팅"]')
            || document.querySelector('[data-testid="new-chat-button"]');

        if (newChatBtn) { newChatBtn.click(); return { success: true }; }
        window.location.href = 'https://claude.ai/new';
        return { success: true };
    } catch (e) { return { error: e.message }; }
}

function injectSendToClaude(question) {
    try {
        const inputArea = document.querySelector('div.ProseMirror[contenteditable="true"]')
            || document.querySelector('[contenteditable="true"].ProseMirror')
            || document.querySelector('fieldset [contenteditable="true"]')
            || document.querySelector('div[contenteditable="true"][role="textbox"]')
            || document.querySelector('[contenteditable="true"]');

        if (!inputArea) return { error: '입력 필드를 찾을 수 없습니다' };

        const responses = document.querySelectorAll('[data-is-streaming], .font-claude-message, [class*="message"][class*="assistant"]');
        window._claudeResponseCountBefore = responses.length;

        inputArea.focus();
        inputArea.innerHTML = `<p>${question}</p>`;
        inputArea.dispatchEvent(new InputEvent('input', { bubbles: true }));

        return { success: true, needsSend: true };
    } catch (e) { return { error: e.message }; }
}

function injectClickSendClaude() {
    try {
        const stopButton = document.querySelector('button[aria-label="Stop Response"]')
            || document.querySelector('button[aria-label="응답 중지"]')
            || document.querySelector('button[aria-label="Stop"]');

        if (stopButton) {
            const rect = stopButton.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) return { error: '응답 생성 중', needsWait: true };
        }

        let sendButton = document.querySelector('button[aria-label="Send Message"]')
            || document.querySelector('button[aria-label="메시지 보내기"]')
            || document.querySelector('button[aria-label="Send message"]')
            || document.querySelector('button[aria-label="Send"]');

        if (!sendButton) {
            sendButton = [...document.querySelectorAll('button')].find(btn => {
                if (btn.disabled) return false;
                const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
                if (ariaLabel.includes('stop') || ariaLabel.includes('attach') || ariaLabel.includes('voice')) return false;
                const rect = btn.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0 && rect.bottom > window.innerHeight - 200 &&
                       btn.querySelector('svg') && rect.width < 80;
            });
        }

        if (sendButton && !sendButton.disabled) { sendButton.click(); return { success: true }; }

        const inputArea = document.querySelector('div.ProseMirror[contenteditable="true"]')
            || document.querySelector('[contenteditable="true"]');

        if (inputArea) {
            inputArea.focus();
            inputArea.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true
            }));
            return { success: true, method: 'enter' };
        }

        return { error: '전송 방법 없음' };
    } catch (e) { return { error: e.message }; }
}

function injectCheckButtonStateClaude() {
    try {
        const allButtons = [...document.querySelectorAll('button')];
        const stopButton = allButtons.find(btn => {
            const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
            const rect = btn.getBoundingClientRect();
            if (!(rect.width > 0 && rect.height > 0)) return false;
            return ariaLabel.includes('stop response') || ariaLabel.includes('응답 중지') || ariaLabel.includes('stop');
        });

        const isStreaming = !!document.querySelector('[data-is-streaming="true"]');
        const hasStopButton = !!stopButton || isStreaming;

        const sendButton = allButtons.find(btn => {
            const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
            if (ariaLabel.includes('stop') || ariaLabel.includes('voice') || ariaLabel.includes('attach')) return false;
            const rect = btn.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && rect.bottom > window.innerHeight - 200 && btn.querySelector('svg');
        });

        const sendByLabel = document.querySelector('button[aria-label="Send Message"]')
            || document.querySelector('button[aria-label="메시지 보내기"]');

        const hasSendButton = !!(sendButton || sendByLabel);
        return { hasSendButton, hasStopButton };
    } catch (e) { return { hasSendButton: false, hasStopButton: false }; }
}

function injectGetLastResponseClaude() {
    try {
        const selectors = [
            '[data-is-streaming] .markdown', '[data-is-streaming]',
            '.font-claude-message .markdown', '.font-claude-message',
            '[class*="message"][class*="assistant"] .markdown',
            '[class*="message"][class*="assistant"]',
            '[data-testid="chat-message-text"]', '.prose'
        ];

        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                const text = elements[elements.length - 1].textContent?.trim() || '';
                if (text.length > 0) return text;
            }
        }
        return '';
    } catch (e) { return ''; }
}
