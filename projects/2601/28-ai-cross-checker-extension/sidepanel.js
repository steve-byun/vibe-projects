// Side Panel UI - 크로스체크 진행 상태 표시 v2

let gptTabId = null;
let geminiTabId = null;
let claudeTabId = null;

// 페이지 로드 시
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    await checkTabs();
    await loadStatus();

    // 이벤트 리스너
    document.getElementById('sendBtn').addEventListener('click', sendQuestion);
    document.getElementById('questionInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) sendQuestion();
    });

    document.getElementById('copyBtn').addEventListener('click', copyResult);
    document.getElementById('fullPageBtn')?.addEventListener('click', openFullPage);
    document.getElementById('retryBtn').addEventListener('click', reset);
    document.getElementById('cancelCheckBtn').addEventListener('click', cancelPrecheck);

    // 설정 변경 저장 및 즉시 모델 변경
    document.getElementById('gptModel').addEventListener('change', async (e) => {
        await saveSettings();
        if (gptTabId) changeModelNow('gpt', e.target.value);
    });
    document.getElementById('geminiModel').addEventListener('change', async (e) => {
        await saveSettings();
        if (geminiTabId) changeModelNow('gemini', e.target.value);
    });
    document.getElementById('newChatOption').addEventListener('change', saveSettings);

    // Storage 변경 감지 (실시간 업데이트)
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local') loadStatus();
    });

    setInterval(checkTabs, 3000);
});

// 설정 로드
async function loadSettings() {
    const settings = await chrome.storage.local.get(['gptModel', 'geminiModel', 'newChatOption']);
    if (settings.gptModel) document.getElementById('gptModel').value = settings.gptModel;
    if (settings.geminiModel) document.getElementById('geminiModel').value = settings.geminiModel;
    if (settings.newChatOption !== undefined) document.getElementById('newChatOption').checked = settings.newChatOption;
}

// 설정 저장
async function saveSettings() {
    await chrome.storage.local.set({
        gptModel: document.getElementById('gptModel').value,
        geminiModel: document.getElementById('geminiModel').value,
        newChatOption: document.getElementById('newChatOption').checked
    });
}

// 즉시 모델 변경
async function changeModelNow(type, model) {
    const tabId = type === 'gpt' ? gptTabId : geminiTabId;
    if (!tabId) return;

    try {
        await chrome.runtime.sendMessage({ action: 'changeModel', tabId, type, model });
    } catch (e) {
        console.error(`[Model] 에러:`, e);
    }
}

// 열린 탭 확인
async function checkTabs() {
    const tabs = await chrome.tabs.query({});

    const gptTab = tabs.find(tab => tab.url && (tab.url.includes('chatgpt.com') || tab.url.includes('chat.openai.com')));
    const geminiTab = tabs.find(tab => tab.url && tab.url.includes('gemini.google.com'));
    const claudeTab = tabs.find(tab => tab.url && tab.url.includes('claude.ai'));

    // GPT 상태
    updateTabStatus('gptStatus', gptTab);
    gptTabId = gptTab ? gptTab.id : null;

    // Gemini 상태
    updateTabStatus('geminiStatus', geminiTab);
    geminiTabId = geminiTab ? geminiTab.id : null;

    // Claude 상태
    updateTabStatus('claudeStatus', claudeTab);
    claudeTabId = claudeTab ? claudeTab.id : null;

    // 버튼 활성화/비활성화
    const data = await chrome.storage.local.get(['phase']);
    if (!data.phase || data.phase === 'idle' || data.phase === 'done' || data.phase === 'error') {
        const sendBtn = document.getElementById('sendBtn');
        if (gptTabId && geminiTabId && claudeTabId) {
            sendBtn.disabled = false;
            sendBtn.textContent = '크로스체크 시작';
        } else {
            sendBtn.disabled = true;
            const missing = [];
            if (!gptTabId) missing.push('GPT');
            if (!geminiTabId) missing.push('Gemini');
            if (!claudeTabId) missing.push('Claude');
            sendBtn.textContent = `${missing.join(', ')} 탭 필요`;
        }
    }
}

function updateTabStatus(elementId, tab) {
    const el = document.getElementById(elementId);
    const indicator = el.querySelector('.indicator');
    const text = el.querySelector('.status-text');

    if (tab) {
        indicator.className = 'indicator active';
        text.textContent = '연결됨';
    } else {
        indicator.className = 'indicator inactive';
        text.textContent = '탭 없음';
    }
}

// 상태 로드 및 UI 업데이트
async function loadStatus() {
    const data = await chrome.storage.local.get(null);
    const { phase, finalResult, error } = data;

    // 에러
    if (phase === 'error' || error) {
        document.getElementById('errorSection').style.display = 'block';
        document.querySelector('.error-message').textContent = error || '알 수 없는 오류가 발생했습니다.';
        document.getElementById('phaseSection').style.display = 'none';
        document.getElementById('questionInput').disabled = false;
        const sendBtn = document.getElementById('sendBtn');
        sendBtn.style.display = '';
        sendBtn.disabled = false;
        sendBtn.textContent = '크로스체크 시작';
        return;
    } else {
        document.getElementById('errorSection').style.display = 'none';
    }

    // 진행 중
    if (phase && phase !== 'idle' && phase !== 'done') {
        document.getElementById('phaseSection').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('sendBtn').style.display = 'none';
        updatePhaseUI(data);
    }

    // 완료
    if (phase === 'done') {
        if (!finalResult || finalResult.length < 30) {
            document.getElementById('errorSection').style.display = 'block';
            document.querySelector('.error-message').textContent = '크로스체크 결과가 비어있습니다. 다시 시도해주세요.';
            document.getElementById('phaseSection').style.display = 'none';
            document.getElementById('resultsSection').style.display = 'none';
            document.getElementById('questionInput').disabled = false;
            const sendBtn = document.getElementById('sendBtn');
            sendBtn.style.display = '';
            sendBtn.disabled = false;
            sendBtn.textContent = '크로스체크 시작';
            return;
        }

        document.getElementById('phaseSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        document.getElementById('questionInput').disabled = false;
        displayResult(finalResult);
        const sendBtn = document.getElementById('sendBtn');
        sendBtn.style.display = '';
        sendBtn.disabled = false;
        sendBtn.textContent = '새 질문하기';
    }
}

// Phase UI 업데이트
function updatePhaseUI(data) {
    const { phase, gptPhase, geminiPhase, claudePhase } = data;

    // AI 뱃지 업데이트
    updateBadge('gptBadge', 'gptBadgeStatus', gptPhase || 'idle');
    updateBadge('geminiBadge', 'geminiBadgeStatus', geminiPhase || 'idle');
    updateBadge('claudeBadge', 'claudeBadgeStatus', claudePhase || 'idle');

    // 전체 프로그레스 바
    const overallFill = document.getElementById('overallProgressFill');
    const progressMap = {
        'phase1': 40,
        'phase2': 75
    };
    overallFill.style.width = `${progressMap[phase] || 0}%`;

    // 단계 라벨
    const phaseLabel = document.getElementById('phaseLabel');
    const phaseLabels = {
        'phase1': '1/2 GPT · Gemini · Claude 질문 중...',
        'phase2': '2/2 Gemini 취합 중...'
    };
    phaseLabel.textContent = phaseLabels[phase] || '준비 중...';
}

// AI 뱃지 상태 업데이트
function updateBadge(badgeId, statusId, aiPhase) {
    const badge = document.getElementById(badgeId);
    const statusEl = document.getElementById(statusId);

    const config = {
        'idle': { text: '—', badgeClass: '', statusClass: 'waiting' },
        'asking': { text: '...', badgeClass: 'active', statusClass: 'active' },
        'asked': { text: '✓', badgeClass: 'done', statusClass: 'done' },
        'consolidating': { text: '...', badgeClass: 'active', statusClass: 'active' },
        'done': { text: '✓', badgeClass: 'done', statusClass: 'done' }
    };

    const c = config[aiPhase] || config['idle'];
    badge.className = `ai-badge ${c.badgeClass}`;
    statusEl.textContent = c.text;
    statusEl.className = `badge-status ${c.statusClass}`;
}

// 결과 파싱 및 표시
function displayResult(text) {
    const commonContent = document.getElementById('commonContent');
    const gptContent = document.getElementById('gptContent');
    const geminiContent = document.getElementById('geminiContent');
    const claudeContent = document.getElementById('claudeContent');

    const markdownToHtml = (text) => {
        const lines = text.split('\n');
        let html = '';
        let inList = false;

        lines.forEach(line => {
            let processedLine = line.trim();
            if (!processedLine) {
                if (inList) { html += '</ul>'; inList = false; }
                html += '<div class="spacer"></div>';
                return;
            }

            processedLine = processedLine.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            processedLine = processedLine.replace(/\*([^*]+)\*/g, '<em>$1</em>');

            if (/^[•\-\*]\s+/.test(processedLine)) {
                if (!inList) { html += '<ul>'; inList = true; }
                html += `<li>${processedLine.replace(/^[•\-\*]\s+/, '')}</li>`;
            } else {
                if (inList) { html += '</ul>'; inList = false; }
                html += `<p>${processedLine}</p>`;
            }
        });

        if (inList) html += '</ul>';
        return html;
    };

    let commonText = '';
    let gptText = '';
    let geminiText = '';
    let claudeText = '';

    // ===동일===, ===GPT===, ===GEMINI===, ===CLAUDE=== 파싱
    const newFormatMatch = text.match(/===동일===|===GPT===|===GEMINI===|===CLAUDE===/i);

    if (newFormatMatch) {
        const sections = text.split(/===(동일|GPT|GEMINI|CLAUDE)===/i);

        for (let i = 1; i < sections.length; i += 2) {
            const sectionName = sections[i]?.toLowerCase();
            const sectionContent = sections[i + 1]?.trim() || '';

            if (sectionName === '동일') commonText = sectionContent;
            else if (sectionName === 'gpt') gptText = sectionContent;
            else if (sectionName === 'gemini') geminiText = sectionContent;
            else if (sectionName === 'claude') claudeText = sectionContent;
        }
    } else {
        // 기존 형식 파싱 (fallback)
        const lines = text.split('\n');
        let currentSection = null;
        let currentContent = [];

        const saveSection = () => {
            if (currentSection && currentContent.length > 0) {
                const content = currentContent.join('\n').trim();
                if (['결과', '공통', '동일'].includes(currentSection)) commonText = content;
                else if (currentSection === 'gpt') gptText = content;
                else if (currentSection === 'gemini') geminiText = content;
                else if (currentSection === 'claude') claudeText = content;
            }
            currentContent = [];
        };

        const sectionHeaderPattern = /^\s*(?:●\s*)?(?:\d+\.\s*)?\((결과|공통|동일|GPT|Gemini|Claude)\)/i;

        lines.forEach(line => {
            const headerMatch = line.match(sectionHeaderPattern);
            if (headerMatch) {
                saveSection();
                currentSection = headerMatch[1].toLowerCase();
                return;
            }

            const trimmedLine = line.trim();
            if (!trimmedLine) return;
            if (/^[^•\-\*]/.test(trimmedLine) && /동의|만의\s*(의견|내용)|추가\s*의견/.test(trimmedLine)) return;
            if (/궁금하신|말씀해\s*주세요|더\s*알고\s*싶|한번\s*시도|전반적인\s*평가/.test(trimmedLine)) return;
            if (currentSection) currentContent.push(line);
        });

        saveSection();
    }

    // "없음" 제거
    if (gptText.trim() === '없음') gptText = '';
    if (geminiText.trim() === '없음') geminiText = '';
    if (claudeText.trim() === '없음') claudeText = '';

    // 섹션을 못 찾았으면 원본 표시
    if (!commonText && !gptText && !geminiText && !claudeText) {
        commonContent.innerHTML = markdownToHtml(text);
        gptContent.innerHTML = '';
        geminiContent.innerHTML = '';
        claudeContent.innerHTML = '';
    } else {
        commonContent.innerHTML = commonText ? markdownToHtml(commonText) : '<p class="no-content">없음</p>';
        gptContent.innerHTML = gptText ? markdownToHtml(gptText) : '';
        geminiContent.innerHTML = geminiText ? markdownToHtml(geminiText) : '';
        claudeContent.innerHTML = claudeText ? markdownToHtml(claudeText) : '';
    }

    // 개별 박스가 모두 비어있으면 숨기기
    const splitSection = document.querySelector('.result-split');
    if (!gptText && !geminiText && !claudeText) {
        splitSection.style.display = 'none';
    } else {
        splitSection.style.display = 'flex';
    }
}

// 질문 보내기 (사전 검사 포함)
async function sendQuestion() {
    const question = document.getElementById('questionInput').value.trim();
    if (!question) { alert('질문을 입력하세요.'); return; }

    if (!gptTabId || !geminiTabId || !claudeTabId) {
        const missing = [];
        if (!gptTabId) missing.push('ChatGPT');
        if (!geminiTabId) missing.push('Gemini');
        if (!claudeTabId) missing.push('Claude');
        alert(`${missing.join(', ')} 탭을 열어주세요.`);
        return;
    }

    // 사전 검사
    const status = await chrome.runtime.sendMessage({
        action: 'checkTabStatus',
        gptTabId,
        geminiTabId,
        claudeTabId
    });

    const hasIssues = Object.values(status).some(s => s.status === 'warning' || s.status === 'error');

    if (hasIssues) {
        showPrecheckWarning(status);
        return;
    }

    // 문제 없으면 바로 진행
    startCrossCheck();
}

// 사전 검사 경고 표시
function showPrecheckWarning(status) {
    const section = document.getElementById('precheckSection');
    const items = document.getElementById('precheckItems');
    items.innerHTML = '';

    for (const [name, info] of Object.entries(status)) {
        const statusClass = info.status === 'ok' ? 'ok' : info.status === 'warning' ? 'warning' : 'error';
        const icon = info.status === 'ok' ? '✓' : info.status === 'warning' ? '⚠' : '✕';
        const message = info.issues && info.issues.length > 0 ? info.issues.join(', ') : '정상';

        const item = document.createElement('div');
        item.className = `precheck-item ${statusClass}`;
        item.innerHTML = `
            <span class="precheck-icon">${icon}</span>
            <span class="precheck-name">${name}</span>
            <span class="precheck-msg">${message}</span>
        `;
        items.appendChild(item);
    }

    section.style.display = 'block';
    document.getElementById('sendBtn').style.display = 'none';
}

// 사전 검사 취소 (확인 버튼)
function cancelPrecheck() {
    document.getElementById('precheckSection').style.display = 'none';
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.style.display = '';
    sendBtn.disabled = false;
}

// 실제 크로스체크 시작
function startCrossCheck() {
    const question = document.getElementById('questionInput').value.trim();
    const gptModel = document.getElementById('gptModel').value;
    const geminiModel = document.getElementById('geminiModel').value;
    const newChatOption = document.getElementById('newChatOption').checked;

    // UI 업데이트
    document.getElementById('sendBtn').style.display = 'none';
    document.getElementById('questionInput').disabled = true;
    document.getElementById('phaseSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('errorSection').style.display = 'none';
    document.getElementById('precheckSection').style.display = 'none';

    updatePhaseUI({ phase: 'phase1', gptPhase: 'asking', geminiPhase: 'asking', claudePhase: 'asking' });

    chrome.runtime.sendMessage({
        action: 'sendQuestion',
        question,
        gptTabId,
        geminiTabId,
        claudeTabId,
        gptModel,
        geminiModel,
        newChat: newChatOption
    });
}

// 결과 복사
async function copyResult() {
    const common = document.getElementById('commonContent').innerText;
    const gpt = document.getElementById('gptContent').innerText;
    const gemini = document.getElementById('geminiContent').innerText;
    const claude = document.getElementById('claudeContent').innerText;

    let text = '[공통 의견]\n' + common;
    if (gpt) text += '\n\n[GPT]\n' + gpt;
    if (gemini) text += '\n\n[Gemini]\n' + gemini;
    if (claude) text += '\n\n[Claude]\n' + claude;

    try {
        await navigator.clipboard.writeText(text);
        const copyBtn = document.getElementById('copyBtn');
        copyBtn.textContent = '복사됨!';
        setTimeout(() => { copyBtn.textContent = '결과 복사'; }, 2000);
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
