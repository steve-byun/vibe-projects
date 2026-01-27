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

// ChatGPT에 전송
async function sendToGpt(question) {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(gptTabId, {
            action: 'sendMessage',
            question: question
        }, response => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }
            if (response && response.success) {
                updateProgress('gptProgress', 'waiting', '응답 대기중...');
                // 응답 대기
                waitForGptResponse(resolve, reject);
            } else {
                reject(new Error(response?.error || '전송 실패'));
            }
        });
    });
}

// Gemini에 전송
async function sendToGemini(question) {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(geminiTabId, {
            action: 'sendMessage',
            question: question
        }, response => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }
            if (response && response.success) {
                updateProgress('geminiProgress', 'waiting', '응답 대기중...');
                // 응답 대기
                waitForGeminiResponse(resolve, reject);
            } else {
                reject(new Error(response?.error || '전송 실패'));
            }
        });
    });
}

// GPT 응답 대기
function waitForGptResponse(resolve, reject, attempts = 0) {
    if (attempts > 60) { // 최대 60초 대기
        reject(new Error('응답 시간 초과'));
        return;
    }

    setTimeout(() => {
        chrome.tabs.sendMessage(gptTabId, { action: 'getResponse' }, response => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }
            if (response && response.done) {
                resolve(response.text);
            } else {
                waitForGptResponse(resolve, reject, attempts + 1);
            }
        });
    }, 1000);
}

// Gemini 응답 대기
function waitForGeminiResponse(resolve, reject, attempts = 0) {
    if (attempts > 60) {
        reject(new Error('응답 시간 초과'));
        return;
    }

    setTimeout(() => {
        chrome.tabs.sendMessage(geminiTabId, { action: 'getResponse' }, response => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }
            if (response && response.done) {
                resolve(response.text);
            } else {
                waitForGeminiResponse(resolve, reject, attempts + 1);
            }
        });
    }, 1000);
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
