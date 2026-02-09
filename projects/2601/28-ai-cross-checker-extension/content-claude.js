// Claude Content Script
let isWaitingForResponse = false;
let lastResponseText = '';

// 메시지 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'sendMessage') {
        sendMessageToClaude(request.question)
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

// Claude에 메시지 전송
async function sendMessageToClaude(question) {
    // 입력 필드 찾기 (Claude의 ProseMirror contenteditable)
    const textarea = document.querySelector('div.ProseMirror[contenteditable="true"]')
        || document.querySelector('[contenteditable="true"].ProseMirror')
        || document.querySelector('fieldset [contenteditable="true"]')
        || document.querySelector('[contenteditable="true"]');

    if (!textarea) {
        throw new Error('입력 필드를 찾을 수 없습니다');
    }

    // 기존 응답 수 저장 (새 응답 감지용)
    const existingResponses = document.querySelectorAll('[data-is-streaming], .font-claude-message, [class*="message"][class*="assistant"]');
    lastResponseText = existingResponses.length > 0
        ? existingResponses[existingResponses.length - 1].textContent
        : '';

    // 텍스트 입력
    textarea.innerHTML = `<p>${question}</p>`;
    textarea.dispatchEvent(new InputEvent('input', { bubbles: true }));

    await sleep(300);

    // 전송 버튼 찾기
    const sendButton = document.querySelector('button[aria-label="Send Message"]')
        || document.querySelector('button[aria-label="메시지 보내기"]')
        || document.querySelector('button[aria-label="Send message"]')
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
        if (btn.querySelector('svg')) {
            const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
            if (ariaLabel.includes('attach') || ariaLabel.includes('voice')) continue;
            if (ariaLabel.includes('stop') || ariaLabel.includes('중지')) continue;
            return btn;
        }
    }
    return null;
}

// 응답 확인
function checkForResponse() {
    const responseSelectors = [
        '[data-is-streaming]',
        '.font-claude-message',
        '[class*="message"][class*="assistant"]',
        '.prose',
        '[data-testid="chat-message-text"]'
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

    // 스트리밍 중인지 확인
    const isStreaming = document.querySelector('[data-is-streaming="true"]')
        || document.querySelector('button[aria-label="Stop Response"]')
        || document.querySelector('button[aria-label="응답 중지"]');

    if (isStreaming) {
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

console.log('AI Cross Checker: Claude content script loaded');
