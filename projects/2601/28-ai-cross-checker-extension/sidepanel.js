// Side Panel UI - 크로스체크 진행 상태 표시

let gptTabId = null;
let geminiTabId = null;

// 페이지 로드 시
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    await checkTabs();
    await loadStatus();

    // 이벤트 리스너
    document.getElementById('sendBtn').addEventListener('click', sendQuestion);
    document.getElementById('questionInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            sendQuestion();
        }
    });

    // 복사 버튼
    document.getElementById('copyBtn').addEventListener('click', copyResult);

    // 전체 페이지로 열기 버튼
    document.getElementById('fullPageBtn')?.addEventListener('click', openFullPage);

    // 재시도 버튼
    document.getElementById('retryBtn').addEventListener('click', reset);

    // 설정 변경 저장
    document.getElementById('gptModel').addEventListener('change', saveSettings);
    document.getElementById('geminiModel').addEventListener('change', saveSettings);
    document.getElementById('newChatOption').addEventListener('change', saveSettings);

    // Storage 변경 감지 (실시간 업데이트)
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local') {
            loadStatus();
        }
    });

    // 주기적으로 탭 상태 확인
    setInterval(checkTabs, 3000);
});

// 설정 로드
async function loadSettings() {
    const settings = await chrome.storage.local.get(['gptModel', 'geminiModel', 'newChatOption']);

    if (settings.gptModel) {
        document.getElementById('gptModel').value = settings.gptModel;
    }
    if (settings.geminiModel) {
        document.getElementById('geminiModel').value = settings.geminiModel;
    }
    if (settings.newChatOption !== undefined) {
        document.getElementById('newChatOption').checked = settings.newChatOption;
    }
}

// 설정 저장
async function saveSettings() {
    await chrome.storage.local.set({
        gptModel: document.getElementById('gptModel').value,
        geminiModel: document.getElementById('geminiModel').value,
        newChatOption: document.getElementById('newChatOption').checked
    });
}

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
    }

    // 버튼 활성화/비활성화 (진행 중이 아닐 때만)
    const data = await chrome.storage.local.get(['phase']);
    if (!data.phase || data.phase === 'idle' || data.phase === 'done' || data.phase === 'error') {
        const sendBtn = document.getElementById('sendBtn');
        if (gptTabId && geminiTabId) {
            sendBtn.disabled = false;
            sendBtn.textContent = '크로스체크 시작';
        } else {
            sendBtn.disabled = true;
            sendBtn.textContent = '두 탭 모두 필요';
        }
    }
}

// 상태 로드 및 UI 업데이트
async function loadStatus() {
    const data = await chrome.storage.local.get(null);
    const { phase, finalResult, error } = data;

    // 에러 표시
    if (phase === 'error' || error) {
        document.getElementById('errorSection').style.display = 'block';
        document.querySelector('.error-message').textContent = error || '알 수 없는 오류가 발생했습니다.';
        document.getElementById('phaseSection').style.display = 'none';
        document.getElementById('sendBtn').disabled = false;
        return;
    } else {
        document.getElementById('errorSection').style.display = 'none';
    }

    // 진행 중이면 Phase 표시
    if (phase && phase !== 'idle' && phase !== 'done') {
        document.getElementById('phaseSection').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('sendBtn').disabled = true;
        document.getElementById('sendBtn').textContent = '진행 중...';
        updatePhaseUI(phase);
    }

    // 완료 시 결과 표시
    if (phase === 'done' && finalResult) {
        document.getElementById('phaseSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('finalResult').innerHTML = formatResult(finalResult);
        document.getElementById('sendBtn').disabled = false;
        document.getElementById('sendBtn').textContent = '새 질문하기';
    }
}

// Phase UI 업데이트
function updatePhaseUI(currentPhase) {
    const phases = ['phase1', 'phase2', 'phase3'];
    const phaseIndex = phases.indexOf(currentPhase);

    phases.forEach((phase, index) => {
        const el = document.getElementById(phase);
        const icon = el.querySelector('.phase-icon');

        if (index < phaseIndex) {
            // 완료된 단계
            el.className = 'phase-item completed';
            icon.textContent = '✓';
        } else if (index === phaseIndex) {
            // 현재 진행 중
            el.className = 'phase-item active';
            icon.textContent = '◉';
        } else {
            // 대기 중
            el.className = 'phase-item';
            icon.textContent = '○';
        }
    });
}

// 결과 포맷팅
function formatResult(text) {
    // 줄바꿈 처리
    let formatted = text.replace(/\n/g, '<br>');

    // (결과), (GPT), (Gemini) 강조
    formatted = formatted.replace(/\(결과\)/g, '<span class="tag tag-result">(결과)</span>');
    formatted = formatted.replace(/\(GPT\)/g, '<span class="tag tag-gpt">(GPT)</span>');
    formatted = formatted.replace(/\(Gemini\)/g, '<span class="tag tag-gemini">(Gemini)</span>');

    return formatted;
}

// 질문 보내기
async function sendQuestion() {
    const question = document.getElementById('questionInput').value.trim();
    if (!question) {
        alert('질문을 입력하세요.');
        return;
    }

    if (!gptTabId || !geminiTabId) {
        alert('ChatGPT와 Gemini 탭을 모두 열어주세요.');
        return;
    }

    // 설정 가져오기
    const gptModel = document.getElementById('gptModel').value;
    const geminiModel = document.getElementById('geminiModel').value;
    const newChatOption = document.getElementById('newChatOption').checked;

    // UI 업데이트
    document.getElementById('sendBtn').disabled = true;
    document.getElementById('sendBtn').textContent = '진행 중...';
    document.getElementById('phaseSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('errorSection').style.display = 'none';

    // 초기 Phase UI
    updatePhaseUI('phase1');

    // Background로 메시지 전송
    chrome.runtime.sendMessage({
        action: 'sendQuestion',
        question,
        gptTabId,
        geminiTabId,
        gptModel,
        geminiModel,
        newChat: newChatOption
    });
}

// 결과 복사
async function copyResult() {
    const resultEl = document.getElementById('finalResult');
    const text = resultEl.innerText;

    try {
        await navigator.clipboard.writeText(text);
        const copyBtn = document.getElementById('copyBtn');
        copyBtn.textContent = '복사됨!';
        setTimeout(() => {
            copyBtn.textContent = '결과 복사';
        }, 2000);
    } catch (err) {
        alert('복사 실패: ' + err.message);
    }
}

// 리셋
async function reset() {
    await chrome.runtime.sendMessage({ action: 'reset' });
    document.getElementById('errorSection').style.display = 'none';
    document.getElementById('phaseSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
    await checkTabs();
}

// 전체 페이지로 열기
function openFullPage() {
    chrome.tabs.create({ url: chrome.runtime.getURL('sidepanel.html') });
}
