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
        gptStatus: 'idle',
        geminiStatus: 'idle',
        responseA: '',           // GPT 원본 답변
        responseB: '',           // Gemini 원본 답변
        responseC: '',           // Gemini의 GPT 검토
        responseD: '',           // GPT의 Gemini 검토
        finalResult: '',         // 최종 분석 결과
        lastQuestion: '',
        error: ''
    });
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
            await sleep(1500); // 새 채팅 로드 대기
        }

        // 모델 선택 (기본값이 아닌 경우에만)
        if (gptModel && gptModel !== 'auto') {
            console.log('[Prep] GPT 모델 선택:', gptModel);
            await selectModel(gptTabId, 'gpt', gptModel);
            await sleep(500);
        }
        if (geminiModel && geminiModel !== 'flash') {
            console.log('[Prep] Gemini 모델 선택:', geminiModel);
            await selectModel(geminiTabId, 'gemini', geminiModel);
            await sleep(500);
        }

        // ========== Phase 1: 원본 질문 ==========
        await chrome.storage.local.set({
            phase: 'phase1',
            gptStatus: 'sending',
            geminiStatus: 'sending',
            lastQuestion: question,
            error: ''
        });

        console.log('[Phase 1] 원본 질문 전송...');

        // GPT와 Gemini에 동시에 질문
        const [responseA, responseB] = await Promise.all([
            sendAndWait(gptTabId, question, 'gpt'),
            sendAndWait(geminiTabId, question, 'gemini')
        ]);

        await chrome.storage.local.set({
            responseA,
            responseB,
            gptStatus: 'done',
            geminiStatus: 'done'
        });

        console.log('[Phase 1] 완료 - A:', responseA.substring(0, 100), '...');
        console.log('[Phase 1] 완료 - B:', responseB.substring(0, 100), '...');

        // ========== Phase 2: 크로스체크 ==========
        await chrome.storage.local.set({
            phase: 'phase2',
            gptStatus: 'crosscheck',
            geminiStatus: 'crosscheck'
        });

        console.log('[Phase 2] 크로스체크 시작...');

        // 크로스체크 프롬프트 생성
        const crosscheckPromptForGemini = createCrosscheckPrompt(question, responseA, 'GPT');
        const crosscheckPromptForGpt = createCrosscheckPrompt(question, responseB, 'Gemini');

        // 크로스체크 실행 (A→Gemini, B→GPT)
        const [responseC, responseD] = await Promise.all([
            sendAndWait(geminiTabId, crosscheckPromptForGemini, 'gemini'),
            sendAndWait(gptTabId, crosscheckPromptForGpt, 'gpt')
        ]);

        await chrome.storage.local.set({
            responseC,
            responseD,
            gptStatus: 'done',
            geminiStatus: 'done'
        });

        console.log('[Phase 2] 완료 - C:', responseC.substring(0, 100), '...');
        console.log('[Phase 2] 완료 - D:', responseD.substring(0, 100), '...');

        // ========== Phase 3: 최종 분석 (Gemini 사용) ==========
        await chrome.storage.local.set({
            phase: 'phase3',
            geminiStatus: 'analyzing'
        });

        console.log('[Phase 3] 최종 분석 시작 (Gemini)...');

        const analysisPrompt = createAnalysisPrompt(question, responseC, responseD);
        const finalResult = await sendAndWait(geminiTabId, analysisPrompt, 'gemini');

        await chrome.storage.local.set({
            phase: 'done',
            gptStatus: 'done',
            geminiStatus: 'done',
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

// 모델 선택
async function selectModel(tabId, type, model) {
    const func = type === 'gpt' ? injectSelectGptModel : injectSelectGeminiModel;
    await chrome.scripting.executeScript({
        target: { tabId },
        func: func,
        args: [model]
    });
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

위 내용을 바탕으로 최종 결과를 정리해주세요.

형식:
- (결과) 양쪽이 동의하는 내용
- (GPT) GPT만의 의견이나 추가 내용
- (Gemini) Gemini만의 의견이나 추가 내용

만약 모든 내용이 동일하다면 "(결과)"로만 표시하세요.
간결하게 작성해주세요.`;
}

// 메시지 전송 및 응답 대기
async function sendAndWait(tabId, message, type) {
    // 메시지 전송
    const sendFunc = type === 'gpt' ? injectSendToGpt : injectSendToGemini;
    const sendResult = await chrome.scripting.executeScript({
        target: { tabId },
        func: sendFunc,
        args: [message]
    });

    if (sendResult[0]?.result?.error) {
        throw new Error(`${type} 전송 실패: ${sendResult[0].result.error}`);
    }

    // 응답 대기 (최대 120초)
    const response = await waitForResponse(tabId, type, 120);
    return response;
}

// 응답 대기
async function waitForResponse(tabId, type, maxSeconds) {
    const checkFunc = type === 'gpt' ? injectCheckGpt : injectCheckGemini;

    for (let i = 0; i < maxSeconds; i++) {
        await sleep(1000);

        try {
            const result = await chrome.scripting.executeScript({
                target: { tabId },
                func: checkFunc
            });

            if (result[0]?.result?.done) {
                return result[0].result.text;
            }
        } catch (e) {
            console.error('Check error:', e);
        }
    }

    throw new Error(`${type} 응답 시간 초과`);
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

// GPT 모델 선택
function injectSelectGptModel(model) {
    try {
        // 모델 선택기 열기
        const modelSelector = document.querySelector('[data-testid="model-switcher-dropdown"]')
            || document.querySelector('button[aria-haspopup="menu"]');

        if (modelSelector) {
            modelSelector.click();

            setTimeout(() => {
                let modelOption;
                if (model === '4o') {
                    modelOption = document.querySelector('[data-testid="gpt-4o"]')
                        || [...document.querySelectorAll('[role="menuitem"]')].find(el => el.textContent.includes('4o'));
                } else if (model === 'o1') {
                    modelOption = document.querySelector('[data-testid="o1"]')
                        || [...document.querySelectorAll('[role="menuitem"]')].find(el => el.textContent.includes('o1'));
                }

                if (modelOption) {
                    modelOption.click();
                }
            }, 300);
        }
        return { success: true };
    } catch (e) {
        return { error: e.message };
    }
}

// Gemini 모델 선택
function injectSelectGeminiModel(model) {
    try {
        // 모델 선택기 찾기 (Gemini UI)
        const modelSelector = document.querySelector('[data-test-id="model-selector"]')
            || document.querySelector('button[aria-label*="model"]')
            || document.querySelector('.model-selector');

        if (modelSelector) {
            modelSelector.click();

            setTimeout(() => {
                let modelOption;
                const menuItems = document.querySelectorAll('[role="menuitem"], [role="option"], .model-option');

                if (model === 'flash-thinking') {
                    modelOption = [...menuItems].find(el =>
                        el.textContent.toLowerCase().includes('thinking') ||
                        el.textContent.toLowerCase().includes('flash 2.0')
                    );
                } else if (model === 'pro') {
                    modelOption = [...menuItems].find(el =>
                        el.textContent.toLowerCase().includes('pro')
                    );
                }

                if (modelOption) {
                    modelOption.click();
                }
            }, 300);
        }
        return { success: true };
    } catch (e) {
        return { error: e.message };
    }
}

// ChatGPT에 메시지 전송
function injectSendToGpt(question) {
    try {
        const textarea = document.querySelector('#prompt-textarea')
            || document.querySelector('textarea[data-id="root"]')
            || document.querySelector('div[contenteditable="true"][id="prompt-textarea"]')
            || document.querySelector('textarea');

        if (!textarea) {
            return { error: '입력 필드를 찾을 수 없습니다' };
        }

        // 기존 응답 수 저장
        window._gptLastCount = document.querySelectorAll('[data-message-author-role="assistant"]').length;

        // contenteditable div인 경우
        if (textarea.getAttribute('contenteditable') === 'true') {
            textarea.innerHTML = `<p>${question}</p>`;
            textarea.dispatchEvent(new InputEvent('input', { bubbles: true }));
        } else {
            textarea.value = question;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // 전송 버튼 클릭
        setTimeout(() => {
            const sendButton = document.querySelector('[data-testid="send-button"]')
                || document.querySelector('button[aria-label="Send prompt"]')
                || document.querySelector('button[aria-label="메시지 보내기"]')
                || document.querySelector('form button[type="submit"]');

            if (sendButton && !sendButton.disabled) {
                sendButton.click();
            }
        }, 300);

        return { success: true };
    } catch (e) {
        return { error: e.message };
    }
}

// ChatGPT 응답 확인
function injectCheckGpt() {
    try {
        const responses = document.querySelectorAll('[data-message-author-role="assistant"]');
        const lastCount = window._gptLastCount || 0;

        if (responses.length <= lastCount) {
            return { done: false };
        }

        const lastResponse = responses[responses.length - 1];

        // 스트리밍 중인지 확인
        const stopButton = document.querySelector('button[aria-label="Stop generating"]')
            || document.querySelector('button[aria-label="중지"]')
            || document.querySelector('button[data-testid="stop-button"]');

        if (stopButton) {
            return { done: false };
        }

        const isStreaming = lastResponse.querySelector('.result-streaming')
            || document.querySelector('.result-streaming');

        if (isStreaming) {
            return { done: false };
        }

        const text = lastResponse.textContent || '';

        if (text.length > 0) {
            return { done: true, text: text };
        }

        return { done: false };
    } catch (e) {
        return { done: false, error: e.message };
    }
}

// Gemini에 메시지 전송
function injectSendToGemini(question) {
    try {
        const inputArea = document.querySelector('.ql-editor[contenteditable="true"]')
            || document.querySelector('rich-textarea [contenteditable="true"]')
            || document.querySelector('[contenteditable="true"][aria-label*="Enter"]')
            || document.querySelector('[contenteditable="true"]');

        if (!inputArea) {
            return { error: '입력 필드를 찾을 수 없습니다' };
        }

        // 기존 응답 수 저장
        window._geminiLastCount = document.querySelectorAll('model-response').length;
        window._geminiLastText = '';

        // 텍스트 입력
        inputArea.innerHTML = `<p>${question}</p>`;
        inputArea.dispatchEvent(new Event('input', { bubbles: true }));
        inputArea.dispatchEvent(new Event('change', { bubbles: true }));

        // 전송 버튼 클릭
        setTimeout(() => {
            const sendButton = document.querySelector('button[aria-label="Send message"]')
                || document.querySelector('button[aria-label*="보내기"]')
                || document.querySelector('button[aria-label*="Send"]')
                || document.querySelector('.send-button button');

            if (sendButton && !sendButton.disabled) {
                sendButton.click();
            }
        }, 300);

        return { success: true };
    } catch (e) {
        return { error: e.message };
    }
}

// Gemini 응답 확인
function injectCheckGemini() {
    try {
        const responseElements = document.querySelectorAll('model-response');
        const lastCount = window._geminiLastCount || 0;

        if (responseElements.length <= lastCount) {
            return { done: false };
        }

        const lastResponse = responseElements[responseElements.length - 1];

        const isLoading = lastResponse.querySelector('mat-progress-spinner')
            || lastResponse.querySelector('.loading')
            || document.querySelector('mat-spinner');

        if (isLoading) {
            return { done: false };
        }

        const contentEl = lastResponse.querySelector('.markdown-main-panel')
            || lastResponse.querySelector('message-content')
            || lastResponse;

        const text = contentEl?.textContent || '';

        if (text.length > 10) {
            if (window._geminiLastText === text) {
                return { done: true, text: text };
            }
            window._geminiLastText = text;
            return { done: false };
        }

        return { done: false };
    } catch (e) {
        return { done: false, error: e.message };
    }
}
