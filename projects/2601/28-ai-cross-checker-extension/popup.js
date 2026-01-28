// Popup UI - 화면 표시만 담당
// 실제 작업은 background.js에서 처리

let gptTabId = null;
let geminiTabId = null;

// 페이지 로드 시
document.addEventListener('DOMContentLoaded', async () => {
    await checkTabs();
    await loadStatus();

    // 이벤트 리스너
    document.getElementById('sendBtn').addEventListener('click', sendQuestion);
    document.getElementById('questionInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            sendQuestion();
        }
    });

    // Storage 변경 감지 (실시간 업데이트)
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local') {
            loadStatus();
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

// 상태 로드 및 UI 업데이트
async function loadStatus() {
    const data = await chrome.storage.local.get([
        'status', 'gptStatus', 'geminiStatus', 'gptResponse', 'geminiResponse'
    ]);

    const { status, gptStatus, geminiStatus, gptResponse, geminiResponse } = data;

    // 진행 중이면 프로그레스 표시
    if (status === 'processing') {
        document.getElementById('progressSection').style.display = 'block';
        document.getElementById('sendBtn').disabled = true;
        updateProgressUI('gptProgress', gptStatus);
        updateProgressUI('geminiProgress', geminiStatus);
    } else {
        document.getElementById('sendBtn').disabled = false;
    }

    // 완료 시 결과 표시
    if (status === 'done' || gptResponse || geminiResponse) {
        showResults(gptResponse, geminiResponse, gptStatus, geminiStatus);
    }
}

// 진행 상태 UI 업데이트
function updateProgressUI(elementId, status) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const statusEl = el.querySelector('.progress-status');
    if (!statusEl) return;

    const statusText = {
        'idle': '-',
        'sending': '전송중...',
        'waiting': '응답 대기중...',
        'done': '완료',
        'error': '오류'
    };

    statusEl.className = 'progress-status ' + status;
    statusEl.textContent = statusText[status] || status;
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

    // Background로 메시지 전송
    chrome.runtime.sendMessage({
        action: 'sendQuestion',
        question,
        useGpt,
        useGemini,
        gptTabId,
        geminiTabId
    });
}

// 결과 표시
function showResults(gptResponse, geminiResponse, gptStatus, geminiStatus) {
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('progressSection').style.display = 'block';

    // GPT 결과
    updateProgressUI('gptProgress', gptStatus);
    if (gptResponse) {
        document.querySelector('#gptResult .result-content').textContent = gptResponse;
        document.getElementById('gptResult').style.display = 'block';
    } else {
        document.getElementById('gptResult').style.display = 'none';
    }

    // Gemini 결과
    updateProgressUI('geminiProgress', geminiStatus);
    if (geminiResponse) {
        document.querySelector('#geminiResult .result-content').textContent = geminiResponse;
        document.getElementById('geminiResult').style.display = 'block';
    } else {
        document.getElementById('geminiResult').style.display = 'none';
    }
}
