// ChatGPT Content Script
let isWaitingForResponse = false;
let lastResponseText = '';

// 메시지 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'sendMessage') {
        sendMessageToChatGPT(request.question)
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

// ChatGPT에 메시지 전송
async function sendMessageToChatGPT(question) {
    // 입력 필드 찾기 (ChatGPT의 textarea)
    const textarea = document.querySelector('textarea[data-id="root"]')
        || document.querySelector('#prompt-textarea')
        || document.querySelector('textarea');

    if (!textarea) {
        throw new Error('입력 필드를 찾을 수 없습니다');
    }

    // 기존 응답 수 저장 (새 응답 감지용)
    const existingResponses = document.querySelectorAll('[data-message-author-role="assistant"]');
    lastResponseText = existingResponses.length > 0
        ? existingResponses[existingResponses.length - 1].textContent
        : '';

    // 텍스트 입력
    textarea.value = question;
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    // 잠시 대기 후 전송 버튼 클릭
    await sleep(300);

    // 전송 버튼 찾기
    const sendButton = document.querySelector('[data-testid="send-button"]')
        || document.querySelector('button[aria-label="Send prompt"]')
        || document.querySelector('form button[type="submit"]')
        || findSendButton();

    if (!sendButton) {
        throw new Error('전송 버튼을 찾을 수 없습니다');
    }

    sendButton.click();
    isWaitingForResponse = true;
}

// 전송 버튼 찾기 (대체 방법)
function findSendButton() {
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
        if (btn.querySelector('svg') && btn.closest('form')) {
            return btn;
        }
    }
    return null;
}

// 응답 확인
function checkForResponse() {
    // 응답 요소들 찾기
    const responses = document.querySelectorAll('[data-message-author-role="assistant"]');

    if (responses.length === 0) {
        return { done: false };
    }

    const lastResponse = responses[responses.length - 1];
    const currentText = lastResponse.textContent || '';

    // 응답이 생성 중인지 확인 (스트리밍 중)
    const isStreaming = document.querySelector('.result-streaming')
        || document.querySelector('[class*="streaming"]');

    if (isStreaming) {
        return { done: false };
    }

    // 새 응답이 있고 이전과 다르면 완료
    if (currentText && currentText !== lastResponseText) {
        isWaitingForResponse = false;
        return { done: true, text: currentText };
    }

    return { done: false };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('AI Cross Checker: ChatGPT content script loaded');
