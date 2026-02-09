// Gemini Content Script
let isWaitingForResponse = false;
let lastResponseText = '';

// 메시지 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'sendMessage') {
        sendMessageToGemini(request.question)
            .then(() => sendResponse({ success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // 비동기 응답
    }

    if (request.action === 'getResponse') {
        const result = checkForResponse();
        sendResponse(result);
        return true;
    }
});

// Gemini에 메시지 전송
async function sendMessageToGemini(question) {
    // 입력 필드 찾기
    const textarea = document.querySelector('.ql-editor[contenteditable="true"]')
        || document.querySelector('[contenteditable="true"]')
        || document.querySelector('textarea');

    if (!textarea) {
        throw new Error('입력 필드를 찾을 수 없습니다');
    }

    // 기존 응답 저장
    const existingResponses = document.querySelectorAll('.model-response-text, .response-content, [data-message-id]');
    lastResponseText = existingResponses.length > 0
        ? existingResponses[existingResponses.length - 1].textContent
        : '';

    // 텍스트 입력 (contenteditable의 경우)
    if (textarea.getAttribute('contenteditable') === 'true') {
        textarea.innerHTML = question;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
        textarea.value = question;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    await sleep(300);

    // 전송 버튼 찾기
    const sendButton = document.querySelector('[aria-label="Send message"]')
        || document.querySelector('button[aria-label*="보내기"]')
        || document.querySelector('button[aria-label*="Send"]')
        || findSendButton();

    if (!sendButton) {
        throw new Error('전송 버튼을 찾을 수 없습니다');
    }

    sendButton.click();
    isWaitingForResponse = true;
}

// 전송 버튼 찾기 (대체 방법 - 크기/위치 체크 없이 DOM만 확인)
function findSendButton() {
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
        if (btn.querySelector('mat-icon') || btn.querySelector('svg')) {
            const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
            if (ariaLabel.includes('stop') || ariaLabel.includes('중지')) continue;
            if (ariaLabel.includes('voice') || ariaLabel.includes('음성') || ariaLabel.includes('mic')) continue;
            if (ariaLabel.includes('attach') || ariaLabel.includes('첨부')) continue;
            return btn;
        }
    }
    return null;
}

// 응답 확인
function checkForResponse() {
    // Gemini 응답 요소 찾기 (최신 UI 기준)
    const responseSelectors = [
        'model-response .markdown-main-panel',
        'model-response message-content',
        '.model-response-text',
        '.response-content',
        '.markdown-content',
        '[data-message-id] .markdown'
    ];

    let allResponses = [];
    for (const selector of responseSelectors) {
        allResponses = document.querySelectorAll(selector);
        if (allResponses.length > 0) break;
    }

    if (allResponses.length === 0) {
        return { done: false };
    }

    const lastResponse = allResponses[allResponses.length - 1];
    const currentText = lastResponse.textContent || '';

    // 로딩 중인지 확인 (더 구체적인 셀렉터 사용)
    const isLoading = document.querySelector('model-response .loading')
        || document.querySelector('model-response mat-progress-spinner')
        || document.querySelector('.response-container .loading-dots')
        || document.querySelector('mat-spinner');

    if (isLoading) {
        return { done: false };
    }

    // 새 응답이 있고 이전과 다르면 완료
    if (currentText && currentText !== lastResponseText && currentText.length > 10) {
        isWaitingForResponse = false;
        return { done: true, text: currentText };
    }

    return { done: false };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('AI Cross Checker: Gemini content script loaded');
