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

    // 설정 변경 저장 및 즉시 모델 변경
    document.getElementById('gptModel').addEventListener('change', async (e) => {
        await saveSettings();
        if (gptTabId) {
            changeModelNow('gpt', e.target.value);
        }
    });
    document.getElementById('geminiModel').addEventListener('change', async (e) => {
        await saveSettings();
        if (geminiTabId) {
            changeModelNow('gemini', e.target.value);
        }
    });
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

// 즉시 모델 변경 (드롭다운 선택 시)
async function changeModelNow(type, model) {
    const tabId = type === 'gpt' ? gptTabId : geminiTabId;
    if (!tabId) {
        console.log(`[Model] ${type} 탭이 없어서 모델 변경 스킵`);
        return;
    }

    console.log(`[Model] 즉시 변경 요청: ${type} -> ${model}`);

    try {
        const response = await chrome.runtime.sendMessage({
            action: 'changeModel',
            tabId: tabId,
            type: type,
            model: model
        });
        if (response.success) {
            console.log(`[Model] 변경 완료: ${type} -> ${model}`);
        } else {
            console.log(`[Model] 변경 실패: ${response.error}`);
        }
    } catch (e) {
        console.error(`[Model] 에러:`, e);
    }
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
        document.getElementById('questionInput').disabled = false;
        const sendBtn = document.getElementById('sendBtn');
        sendBtn.style.display = '';
        sendBtn.disabled = false;
        sendBtn.textContent = '크로스체크 시작';
        return;
    } else {
        document.getElementById('errorSection').style.display = 'none';
    }

    // 진행 중이면 Phase 표시 (버튼 숨기고 진행 상태만 표시)
    if (phase && phase !== 'idle' && phase !== 'done') {
        document.getElementById('phaseSection').style.display = 'block';
        document.getElementById('resultsSection').style.display = 'none';
        const sendBtn = document.getElementById('sendBtn');
        sendBtn.style.display = 'none';
        updatePhaseUI(data);
    }

    // 완료 시 결과 표시
    if (phase === 'done') {
        // 결과가 비어있거나 너무 짧으면 에러 표시
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

// Phase UI 업데이트 (GPT/Gemini 개별 상태)
function updatePhaseUI(data) {
    const { phase, gptPhase, geminiPhase } = data;

    // GPT 진행 바 업데이트
    const gptFill = document.getElementById('gptProgressFill');
    const gptStatus = document.getElementById('gptProgressStatus');
    updateIndividualProgress(gptFill, gptStatus, gptPhase || 'idle');

    // Gemini 진행 바 업데이트
    const geminiFill = document.getElementById('geminiProgressFill');
    const geminiStatus = document.getElementById('geminiProgressStatus');
    updateIndividualProgress(geminiFill, geminiStatus, geminiPhase || 'idle');

    // 전체 단계 라벨 업데이트
    const phaseLabel = document.getElementById('phaseLabel');
    const phaseLabels = {
        'phase1': '1/3 질문 전송 중...',
        'phase2': '2/3 크로스체크 중...',
        'phase3': '3/3 최종 분석 중...'
    };
    phaseLabel.textContent = phaseLabels[phase] || '준비 중...';
}

// 개별 AI 진행 바 업데이트
function updateIndividualProgress(fillEl, statusEl, aiPhase) {
    // 상태별 진행률과 텍스트
    const phaseConfig = {
        'idle': { progress: 0, text: '대기', class: '' },
        'asking': { progress: 33, text: '질문 중...', class: 'active' },
        'asked': { progress: 50, text: '완료 (대기)', class: 'waiting' },
        'crosschecking': { progress: 66, text: '크로스체크 중...', class: 'active' },
        'crosschecked': { progress: 83, text: '완료 (대기)', class: 'waiting' },
        'analyzing': { progress: 90, text: '최종 분석 중...', class: 'active' },
        'done': { progress: 100, text: '완료', class: 'done' }
    };

    const config = phaseConfig[aiPhase] || phaseConfig['idle'];

    fillEl.style.width = `${config.progress}%`;
    statusEl.textContent = config.text;
    statusEl.className = `progress-status ${config.class}`;
}

// 결과 파싱 및 표시
function displayResult(text) {
    const commonContent = document.getElementById('commonContent');
    const gptContent = document.getElementById('gptContent');
    const geminiContent = document.getElementById('geminiContent');

    // 마크다운을 HTML로 변환 (개선된 버전)
    const markdownToHtml = (text) => {
        // 줄 단위로 처리
        const lines = text.split('\n');
        let html = '';
        let inList = false;

        lines.forEach((line, index) => {
            let processedLine = line.trim();
            if (!processedLine) {
                // 빈 줄은 단락 구분
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                html += '<div class="spacer"></div>';
                return;
            }

            // **굵은 글씨** 처리
            processedLine = processedLine.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            // *기울임* 처리
            processedLine = processedLine.replace(/\*([^*]+)\*/g, '<em>$1</em>');

            // 글머리 기호 처리 (•, -, *)
            if (/^[•\-\*]\s+/.test(processedLine)) {
                if (!inList) {
                    html += '<ul>';
                    inList = true;
                }
                const itemText = processedLine.replace(/^[•\-\*]\s+/, '');
                html += `<li>${itemText}</li>`;
            } else {
                // 일반 텍스트
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                html += `<p>${processedLine}</p>`;
            }
        });

        if (inList) {
            html += '</ul>';
        }

        return html;
    };

    // 제목 줄 제거 함수
    const removeTitle = (content) => {
        // 첫 줄이 제목인지 확인 (글머리 기호가 없고 짧은 경우)
        const lines = content.split('\n');
        if (lines.length > 1) {
            const firstLine = lines[0].trim();
            // 첫 줄이 50자 미만이고 글머리 기호가 없으면 제목으로 간주
            if (firstLine.length < 50 && !/^[•\-\*]/.test(firstLine) && !firstLine.includes(':')) {
                // 제목 제거하지 않고 유지 (사용자가 요청한 경우에만 제거)
            }
        }
        return content;
    };

    // 섹션별 내용 저장
    let commonText = '';
    let gptText = '';
    let geminiText = '';

    // 새로운 구분자 패턴으로 분리: ===동일===, ===GPT===, ===GEMINI===
    const newFormatMatch = text.match(/===동일===|===GPT===|===GEMINI===/i);

    if (newFormatMatch) {
        // 새 형식 파싱
        const sections = text.split(/===(동일|GPT|GEMINI)===/i);
        // sections: ['앞부분', '동일', '내용', 'GPT', '내용', 'GEMINI', '내용']

        for (let i = 1; i < sections.length; i += 2) {
            const sectionName = sections[i]?.toLowerCase();
            const sectionContent = sections[i + 1]?.trim() || '';

            if (sectionName === '동일') {
                commonText = sectionContent;
            } else if (sectionName === 'gpt') {
                gptText = sectionContent;
            } else if (sectionName === 'gemini') {
                geminiText = sectionContent;
            }
        }

        console.log('[Parse] 새 형식 감지');
    } else {
        // 기존 형식 파싱 (fallback): (결과), (GPT), (Gemini)
        const lines = text.split('\n');
        let currentSection = null;
        let currentContent = [];

        const saveSection = () => {
            if (currentSection && currentContent.length > 0) {
                const content = currentContent.join('\n').trim();
                if (currentSection === '결과' || currentSection === '공통' || currentSection === '동일') {
                    commonText = content;
                } else if (currentSection === 'gpt') {
                    gptText = content;
                } else if (currentSection === 'gemini') {
                    geminiText = content;
                }
            }
            currentContent = [];
        };

        // 섹션 헤더 패턴: "(결과)", "(GPT)", "(Gemini)" 등
        const sectionHeaderPattern = /^\s*(?:●\s*)?(?:\d+\.\s*)?\((결과|공통|동일|GPT|Gemini)\)/i;

        lines.forEach(line => {
            const headerMatch = line.match(sectionHeaderPattern);
            if (headerMatch) {
                saveSection();
                currentSection = headerMatch[1].toLowerCase();
                return;
            }

            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            // 부제목 스킵
            if (/^[^•\-\*]/.test(trimmedLine) && /동의|만의\s*(의견|내용)|추가\s*의견/.test(trimmedLine)) {
                return;
            }

            // 마지막 요약/질문 문장 패턴
            if (/궁금하신|말씀해\s*주세요|더\s*알고\s*싶|한번\s*시도|전반적인\s*평가/.test(trimmedLine)) {
                return;
            }

            if (currentSection) {
                currentContent.push(line);
            }
        });

        saveSection();
        console.log('[Parse] 기존 형식 사용');
    }

    // "없음" 텍스트 제거
    if (gptText.trim() === '없음') gptText = '';
    if (geminiText.trim() === '없음') geminiText = '';

    // 섹션 파싱 결과 로그
    console.log('[Parse] 공통:', commonText.substring(0, 50), '...');
    console.log('[Parse] GPT:', gptText.substring(0, 50), '...');
    console.log('[Parse] Gemini:', geminiText.substring(0, 50), '...');

    // 섹션을 못 찾았으면 원본 표시
    if (!commonText && !gptText && !geminiText) {
        commonContent.innerHTML = markdownToHtml(text);
        gptContent.innerHTML = '';
        geminiContent.innerHTML = '';
    } else {
        // 각 박스에 마크다운 변환된 내용 삽입
        commonContent.innerHTML = commonText
            ? markdownToHtml(commonText)
            : '<p class="no-content">없음</p>';
        gptContent.innerHTML = gptText ? markdownToHtml(gptText) : '';
        geminiContent.innerHTML = geminiText ? markdownToHtml(geminiText) : '';
    }

    // GPT/Gemini 박스가 둘 다 비어있으면 숨기기
    const splitSection = document.querySelector('.result-split');
    if (!gptText && !geminiText) {
        splitSection.style.display = 'none';
    } else {
        splitSection.style.display = 'flex';
    }
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

    // UI 업데이트 - 버튼 즉시 숨기고 진행 상태 표시
    document.getElementById('sendBtn').style.display = 'none';
    document.getElementById('questionInput').disabled = true;
    document.getElementById('phaseSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('errorSection').style.display = 'none';

    // 초기 Phase UI (GPT/Gemini 둘 다 질문 중으로 표시)
    updatePhaseUI({ phase: 'phase1', gptPhase: 'asking', geminiPhase: 'asking' });

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
    const common = document.getElementById('commonContent').innerText;
    const gpt = document.getElementById('gptContent').innerText;
    const gemini = document.getElementById('geminiContent').innerText;

    let text = '[공통 의견]\n' + common;
    if (gpt) text += '\n\n[GPT]\n' + gpt;
    if (gemini) text += '\n\n[Gemini]\n' + gemini;

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
