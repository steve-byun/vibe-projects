// 앱 초기화
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, window.api:', window.api);

    // 이벤트 리스너 등록
    document.getElementById('openGptBtn').addEventListener('click', () => {
        console.log('GPT button clicked');
        openGpt();
    });
    document.getElementById('openGeminiBtn').addEventListener('click', () => {
        console.log('Gemini button clicked');
        openGemini();
    });
    document.getElementById('sendBtn').addEventListener('click', sendQuestion);
    document.getElementById('questionInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            sendQuestion();
        }
    });

    // 진행 상태 업데이트 수신
    if (window.api) {
        window.api.onProgress((progress) => {
            updateProgress(progress.ai, progress.status);
        });

        // 브라우저 초기화
        await initBrowser();
    } else {
        console.error('window.api is not available');
        showLoading(false);
    }
});

// 브라우저 초기화
async function initBrowser() {
    showLoading(true);

    try {
        await window.api.initBrowser();
        await checkStatus();
    } catch (error) {
        console.error('Browser init error:', error);
    }

    showLoading(false);
}

// 상태 확인
async function checkStatus() {
    const status = await window.api.checkStatus();

    // GPT 상태
    const gptCard = document.getElementById('gptStatus');
    const gptIndicator = gptCard.querySelector('.indicator');
    const gptText = gptCard.querySelector('.status-text');

    if (status.gptReady) {
        gptIndicator.className = 'indicator active';
        gptText.textContent = status.gptLoggedIn ? '로그인됨' : '로그인 필요';
    } else {
        gptIndicator.className = 'indicator inactive';
        gptText.textContent = '연결 안됨';
    }

    // Gemini 상태
    const geminiCard = document.getElementById('geminiStatus');
    const geminiIndicator = geminiCard.querySelector('.indicator');
    const geminiText = geminiCard.querySelector('.status-text');

    if (status.geminiReady) {
        geminiIndicator.className = 'indicator active';
        geminiText.textContent = status.geminiLoggedIn ? '로그인됨' : '로그인 필요';
    } else {
        geminiIndicator.className = 'indicator inactive';
        geminiText.textContent = '연결 안됨';
    }
}

// ChatGPT 열기
async function openGpt() {
    console.log('openGpt() called');
    document.getElementById('openGptBtn').disabled = true;
    document.getElementById('openGptBtn').textContent = '여는 중...';

    try {
        console.log('Calling window.api.openGpt()...');
        const result = await window.api.openGpt();
        console.log('openGpt result:', result);
        await checkStatus();
    } catch (error) {
        console.error('Open GPT error:', error);
        alert('GPT 열기 오류: ' + error.message);
    }

    document.getElementById('openGptBtn').disabled = false;
    document.getElementById('openGptBtn').textContent = '열기';
}

// Gemini 열기
async function openGemini() {
    document.getElementById('openGeminiBtn').disabled = true;
    document.getElementById('openGeminiBtn').textContent = '여는 중...';

    try {
        await window.api.openGemini();
        await checkStatus();
    } catch (error) {
        console.error('Open Gemini error:', error);
    }

    document.getElementById('openGeminiBtn').disabled = false;
    document.getElementById('openGeminiBtn').textContent = '열기';
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

    // UI 초기화
    document.getElementById('sendBtn').disabled = true;
    document.getElementById('progressSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';

    if (useGpt) updateProgress('gpt', 'waiting');
    if (useGemini) updateProgress('gemini', 'waiting');

    try {
        const results = await window.api.sendQuestion({ question, useGpt, useGemini });
        showResults(results);
    } catch (error) {
        console.error('Send error:', error);
        alert('오류가 발생했습니다: ' + error.message);
    }

    document.getElementById('sendBtn').disabled = false;
}

// 진행 상태 업데이트
function updateProgress(ai, status) {
    const elementId = ai === 'gpt' ? 'gptProgress' : 'geminiProgress';
    const el = document.getElementById(elementId);
    const statusEl = el.querySelector('.progress-status');

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

// 결과 표시
function showResults(results) {
    document.getElementById('resultsSection').style.display = 'block';

    // GPT 결과
    if (results.gptResponse) {
        document.querySelector('#gptResult .result-content').textContent = results.gptResponse;
        document.getElementById('gptResult').style.display = 'block';
        updateProgress('gpt', 'done');
    } else if (results.gptError) {
        document.querySelector('#gptResult .result-content').textContent = '오류: ' + results.gptError;
        document.getElementById('gptResult').style.display = 'block';
        updateProgress('gpt', 'error');
    } else {
        document.getElementById('gptResult').style.display = 'none';
    }

    // Gemini 결과
    if (results.geminiResponse) {
        document.querySelector('#geminiResult .result-content').textContent = results.geminiResponse;
        document.getElementById('geminiResult').style.display = 'block';
        updateProgress('gemini', 'done');
    } else if (results.geminiError) {
        document.querySelector('#geminiResult .result-content').textContent = '오류: ' + results.geminiError;
        document.getElementById('geminiResult').style.display = 'block';
        updateProgress('gemini', 'error');
    } else {
        document.getElementById('geminiResult').style.display = 'none';
    }
}

// 로딩 표시
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}
