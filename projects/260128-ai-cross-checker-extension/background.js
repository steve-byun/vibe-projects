// Background Service Worker - 핵심 로직 처리
// 팝업이 닫혀도 계속 실행됨

// 상태 초기화
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        status: 'idle',
        gptStatus: 'idle',
        geminiStatus: 'idle',
        gptResponse: '',
        geminiResponse: '',
        lastQuestion: ''
    });
    console.log('AI Cross Checker installed');
});

// 메시지 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'sendQuestion') {
        handleSendQuestion(request);
        sendResponse({ success: true });
        return true;
    }

    if (request.action === 'getStatus') {
        chrome.storage.local.get(['status', 'gptStatus', 'geminiStatus', 'gptResponse', 'geminiResponse'], (data) => {
            sendResponse(data);
        });
        return true;
    }

    if (request.action === 'reset') {
        chrome.storage.local.set({
            status: 'idle',
            gptStatus: 'idle',
            geminiStatus: 'idle',
            gptResponse: '',
            geminiResponse: ''
        });
        sendResponse({ success: true });
        return true;
    }
});

// 질문 처리
async function handleSendQuestion(request) {
    const { question, useGpt, useGemini, gptTabId, geminiTabId } = request;

    // 상태 초기화
    await chrome.storage.local.set({
        status: 'processing',
        gptStatus: useGpt ? 'sending' : 'idle',
        geminiStatus: useGemini ? 'sending' : 'idle',
        gptResponse: '',
        geminiResponse: '',
        lastQuestion: question
    });

    const promises = [];

    if (useGpt && gptTabId) {
        promises.push(processGpt(gptTabId, question));
    }

    if (useGemini && geminiTabId) {
        promises.push(processGemini(geminiTabId, question));
    }

    await Promise.all(promises);

    // 완료
    await chrome.storage.local.set({ status: 'done' });
}

// ChatGPT 처리
async function processGpt(tabId, question) {
    try {
        // 메시지 전송
        await chrome.storage.local.set({ gptStatus: 'sending' });

        const sendResult = await chrome.scripting.executeScript({
            target: { tabId },
            func: injectSendToGpt,
            args: [question]
        });

        if (sendResult[0]?.result?.error) {
            throw new Error(sendResult[0].result.error);
        }

        await chrome.storage.local.set({ gptStatus: 'waiting' });

        // 응답 대기 (최대 90초)
        const response = await waitForResponse(tabId, 'gpt', 90);

        await chrome.storage.local.set({
            gptStatus: 'done',
            gptResponse: response
        });

    } catch (error) {
        await chrome.storage.local.set({
            gptStatus: 'error',
            gptResponse: '오류: ' + error.message
        });
    }
}

// Gemini 처리
async function processGemini(tabId, question) {
    try {
        await chrome.storage.local.set({ geminiStatus: 'sending' });

        const sendResult = await chrome.scripting.executeScript({
            target: { tabId },
            func: injectSendToGemini,
            args: [question]
        });

        if (sendResult[0]?.result?.error) {
            throw new Error(sendResult[0].result.error);
        }

        await chrome.storage.local.set({ geminiStatus: 'waiting' });

        // 응답 대기 (최대 90초)
        const response = await waitForResponse(tabId, 'gemini', 90);

        await chrome.storage.local.set({
            geminiStatus: 'done',
            geminiResponse: response
        });

    } catch (error) {
        await chrome.storage.local.set({
            geminiStatus: 'error',
            geminiResponse: '오류: ' + error.message
        });
    }
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

    throw new Error('응답 시간 초과');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============ 페이지에 주입될 함수들 ============

// ChatGPT에 메시지 전송
function injectSendToGpt(question) {
    try {
        // 입력 필드 찾기 (최신 ChatGPT UI)
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
            // textarea인 경우
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

        // 새 응답이 없으면 대기
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

        // 결과 스트리밍 클래스 확인
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
        // 입력 필드 찾기
        const inputArea = document.querySelector('.ql-editor[contenteditable="true"]')
            || document.querySelector('rich-textarea [contenteditable="true"]')
            || document.querySelector('[contenteditable="true"][aria-label*="Enter"]')
            || document.querySelector('[contenteditable="true"]');

        if (!inputArea) {
            return { error: '입력 필드를 찾을 수 없습니다' };
        }

        // 기존 응답 수 저장
        const responseElements = document.querySelectorAll('model-response');
        window._geminiLastCount = responseElements.length;
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
        // model-response 요소 찾기
        const responseElements = document.querySelectorAll('model-response');
        const lastCount = window._geminiLastCount || 0;

        // 새 응답이 없으면 대기
        if (responseElements.length <= lastCount) {
            return { done: false };
        }

        // 마지막 응답
        const lastResponse = responseElements[responseElements.length - 1];

        // 로딩 중인지 확인
        const isLoading = lastResponse.querySelector('mat-progress-spinner')
            || lastResponse.querySelector('.loading')
            || document.querySelector('mat-spinner');

        if (isLoading) {
            return { done: false };
        }

        // 응답 텍스트 가져오기
        const contentEl = lastResponse.querySelector('.markdown-main-panel')
            || lastResponse.querySelector('message-content')
            || lastResponse;

        const text = contentEl?.textContent || '';

        // 텍스트가 계속 변하는지 확인 (스트리밍 감지)
        if (text.length > 10) {
            if (window._geminiLastText === text) {
                // 텍스트가 같으면 완료
                return { done: true, text: text };
            }
            // 텍스트가 다르면 저장하고 대기
            window._geminiLastText = text;
            return { done: false };
        }

        return { done: false };
    } catch (e) {
        return { done: false, error: e.message };
    }
}
