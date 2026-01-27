// 전역 변수
let gptTabId = null;
let geminiTabId = null;
let gptResponse = '';
let geminiResponse = '';

// 페이지 로드 시 탭 상태 확인
document.addEventListener('DOMContentLoaded', async () => {
    await checkTabs();

    // 이벤트 리스너
    document.getElementById('sendBtn').addEventListener('click', sendQuestion);
    document.getElementById('questionInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            sendQuestion();
        }
    });
});

// 열린 탭 확인
async function checkTabs() {
    const tabs = await chrome.tabs.query({});

    // ChatGPT 탭 찾기
    const gptTab = tabs.find(tab =>
        tab.url && (tab.url.includes('chatgpt.com') || tab.url.includes('chat.openai.com'))
    );

    // Gemini 탭 찾기
    const geminiTab = tabs.find(tab =>
        tab.url && tab.url.includes('gemini.google.com')
    );

    // GPT 상태 업데이트
    const gptStatusEl = document.getElementById('gptStatus');
    const gptIndicator = gptStatusEl.querySelector('.indicator');
    const gptText = gptStatusEl.querySelector('.status-text');

    if (gptTab) {
        gptTabId = gptTab.id;
        gptIndicator.className = 'indicator active';
        gptText.textContent = '연결됨';
    } else {
        gptTabId = null;
        gptIndicator.className = 'indicator inactive';
        gptText.textContent = '탭 없음';
        document.getElementById('useGpt').checked = false;
        document.getElementById('useGpt').disabled = true;
    }

    // Gemini 상태 업데이트
    const geminiStatusEl = document.getElementById('geminiStatus');
    const geminiIndicator = geminiStatusEl.querySelector('.indicator');
    const geminiText = geminiStatusEl.querySelector('.status-text');

    if (geminiTab) {
        geminiTabId = geminiTab.id;
        geminiIndicator.className = 'indicator active';
        geminiText.textContent = '연결됨';
    } else {
        geminiTabId = null;
        geminiIndicator.className = 'indicator inactive';
        geminiText.textContent = '탭 없음';
        document.getElementById('useGemini').checked = false;
        document.getElementById('useGemini').disabled = true;
    }
}

// 질문 보내기
async function sendQuestion() {
    const question = document.getElementById('questionInput').value.trim();
    if (!question) {
        alert('질문을 입력하세요.');
        return;
    }

    const useGpt = document.getElementById('useGpt').checked;
    const useGemini = document.getElementById('useGemini').checked;

    if (!useGpt && !useGemini) {
        alert('최소 하나의 AI를 선택하세요.');
        return;
    }

    // UI 업데이트
    document.getElementById('sendBtn').disabled = true;
    document.getElementById('progressSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';

    gptResponse = '';
    geminiResponse = '';

    const promises = [];

    // ChatGPT에 질문
    if (useGpt && gptTabId) {
        updateProgress('gptProgress', 'sending', '전송중...');
        promises.push(
            sendToGpt(question)
                .then(response => {
                    gptResponse = response;
                    updateProgress('gptProgress', 'done', '완료');
                })
                .catch(error => {
                    updateProgress('gptProgress', 'error', '오류: ' + error.message);
                })
        );
    }

    // Gemini에 질문
    if (useGemini && geminiTabId) {
        updateProgress('geminiProgress', 'sending', '전송중...');
        promises.push(
            sendToGemini(question)
                .then(response => {
                    geminiResponse = response;
                    updateProgress('geminiProgress', 'done', '완료');
                })
                .catch(error => {
                    updateProgress('geminiProgress', 'error', '오류: ' + error.message);
                })
        );
    }

    await Promise.all(promises);

    // 결과 표시
    showResults();
    document.getElementById('sendBtn').disabled = false;
}

// ChatGPT에 전송 (scripting API 사용)
async function sendToGpt(question) {
    try {
        // 메시지 전송
        const sendResult = await chrome.scripting.executeScript({
            target: { tabId: gptTabId },
            func: sendMessageToChatGPT,
            args: [question]
        });

        if (sendResult[0]?.result?.error) {
            throw new Error(sendResult[0].result.error);
        }

        updateProgress('gptProgress', 'waiting', '응답 대기중...');

        // 응답 대기
        return await waitForGptResponse();
    } catch (error) {
        throw error;
    }
}

// Gemini에 전송 (scripting API 사용)
async function sendToGemini(question) {
    try {
        // 메시지 전송
        const sendResult = await chrome.scripting.executeScript({
            target: { tabId: geminiTabId },
            func: sendMessageToGemini,
            args: [question]
        });

        if (sendResult[0]?.result?.error) {
            throw new Error(sendResult[0].result.error);
        }

        updateProgress('geminiProgress', 'waiting', '응답 대기중...');

        // 응답 대기
        return await waitForGeminiResponse();
    } catch (error) {
        throw error;
    }
}

// GPT 응답 대기
async function waitForGptResponse(attempts = 0) {
    if (attempts > 60) {
        throw new Error('응답 시간 초과');
    }

    await sleep(1000);

    const result = await chrome.scripting.executeScript({
        target: { tabId: gptTabId },
        func: checkChatGPTResponse
    });

    if (result[0]?.result?.done) {
        return result[0].result.text;
    }

    return waitForGptResponse(attempts + 1);
}

// Gemini 응답 대기
async function waitForGeminiResponse(attempts = 0) {
    if (attempts > 60) {
        throw new Error('응답 시간 초과');
    }

    await sleep(1000);

    const result = await chrome.scripting.executeScript({
        target: { tabId: geminiTabId },
        func: checkGeminiResponse
    });

    if (result[0]?.result?.done) {
        return result[0].result.text;
    }

    return waitForGeminiResponse(attempts + 1);
}

// ============ 페이지에서 실행될 함수들 ============

// ChatGPT에 메시지 전송 (페이지 컨텍스트에서 실행)
function sendMessageToChatGPT(question) {
    try {
        // 입력 필드 찾기
        const textarea = document.querySelector('#prompt-textarea')
            || document.querySelector('textarea[data-id="root"]')
            || document.querySelector('textarea');

        if (!textarea) {
            return { error: '입력 필드를 찾을 수 없습니다' };
        }

        // 기존 응답 수 저장
        window._lastResponseCount = document.querySelectorAll('[data-message-author-role="assistant"]').length;

        // 텍스트 입력
        textarea.value = question;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));

        // 전송 버튼 찾기 및 클릭
        setTimeout(() => {
            const sendButton = document.querySelector('[data-testid="send-button"]')
                || document.querySelector('button[aria-label="Send prompt"]')
                || document.querySelector('form button:not([disabled])');

            if (sendButton) {
                sendButton.click();
            }
        }, 300);

        return { success: true };
    } catch (e) {
        return { error: e.message };
    }
}

// ChatGPT 응답 확인 (페이지 컨텍스트에서 실행)
function checkChatGPTResponse() {
    try {
        const responses = document.querySelectorAll('[data-message-author-role="assistant"]');
        const lastCount = window._lastResponseCount || 0;

        // 새 응답이 없으면 대기
        if (responses.length <= lastCount) {
            return { done: false };
        }

        // 스트리밍 중인지 확인
        const isStreaming = document.querySelector('.result-streaming')
            || document.querySelector('[class*="streaming"]')
            || document.querySelector('.agent-turn');

        if (isStreaming) {
            return { done: false };
        }

        // 마지막 응답 가져오기
        const lastResponse = responses[responses.length - 1];
        const text = lastResponse.textContent || '';

        if (text.length > 0) {
            return { done: true, text: text };
        }

        return { done: false };
    } catch (e) {
        return { done: false, error: e.message };
    }
}

// Gemini에 메시지 전송 (페이지 컨텍스트에서 실행)
function sendMessageToGemini(question) {
    try {
        // 입력 필드 찾기 (Gemini는 contenteditable div 사용)
        const inputArea = document.querySelector('.ql-editor[contenteditable="true"]')
            || document.querySelector('rich-textarea [contenteditable="true"]')
            || document.querySelector('[contenteditable="true"][aria-label*="prompt"]')
            || document.querySelector('[contenteditable="true"]');

        if (!inputArea) {
            return { error: '입력 필드를 찾을 수 없습니다' };
        }

        // 기존 응답 수 저장
        window._lastGeminiResponseCount = document.querySelectorAll('message-content').length
            || document.querySelectorAll('.model-response-text').length
            || document.querySelectorAll('[data-message-id]').length;

        // 텍스트 입력
        inputArea.innerHTML = `<p>${question}</p>`;
        inputArea.dispatchEvent(new Event('input', { bubbles: true }));
        inputArea.dispatchEvent(new Event('change', { bubbles: true }));

        // 전송 버튼 찾기 및 클릭
        setTimeout(() => {
            const sendButton = document.querySelector('button[aria-label*="Send"]')
                || document.querySelector('button[aria-label*="보내기"]')
                || document.querySelector('.send-button')
                || document.querySelector('button[mat-icon-button]');

            if (sendButton && !sendButton.disabled) {
                sendButton.click();
            }
        }, 300);

        return { success: true };
    } catch (e) {
        return { error: e.message };
    }
}

// Gemini 응답 확인 (페이지 컨텍스트에서 실행)
function checkGeminiResponse() {
    try {
        // 응답 요소들 찾기
        const responseSelectors = [
            'message-content.model-response-text',
            '.model-response-text',
            'model-response message-content',
            '[data-message-id] .markdown'
        ];

        let responses = [];
        for (const selector of responseSelectors) {
            responses = document.querySelectorAll(selector);
            if (responses.length > 0) break;
        }

        const lastCount = window._lastGeminiResponseCount || 0;

        // 새 응답이 없으면 대기
        if (responses.length <= lastCount) {
            return { done: false };
        }

        // 로딩 중인지 확인
        const isLoading = document.querySelector('.loading-indicator')
            || document.querySelector('[class*="loading"]')
            || document.querySelector('.response-streaming');

        if (isLoading) {
            return { done: false };
        }

        // 마지막 응답 가져오기
        const lastResponse = responses[responses.length - 1];
        const text = lastResponse.textContent || '';

        if (text.length > 10) {
            return { done: true, text: text };
        }

        return { done: false };
    } catch (e) {
        return { done: false, error: e.message };
    }
}

// ============ 유틸리티 ============

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 진행 상태 업데이트
function updateProgress(elementId, status, text) {
    const el = document.getElementById(elementId);
    const statusEl = el.querySelector('.progress-status');
    statusEl.className = 'progress-status ' + status;
    statusEl.textContent = text;
}

// 결과 표시
function showResults() {
    document.getElementById('resultsSection').style.display = 'block';

    if (gptResponse) {
        document.querySelector('#gptResult .result-content').textContent = gptResponse;
        document.getElementById('gptResult').style.display = 'block';
    } else {
        document.getElementById('gptResult').style.display = 'none';
    }

    if (geminiResponse) {
        document.querySelector('#geminiResult .result-content').textContent = geminiResponse;
        document.getElementById('geminiResult').style.display = 'block';
    } else {
        document.getElementById('geminiResult').style.display = 'none';
    }
}
