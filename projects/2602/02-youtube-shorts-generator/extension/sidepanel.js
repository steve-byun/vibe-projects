// YouTube Shorts Generator - Side Panel

const BACKEND_URL = 'http://127.0.0.1:5000';

// DOM 요소
let elements = {};

document.addEventListener('DOMContentLoaded', () => {
  elements = {
    serverStatus: document.getElementById('serverStatus'),
    topicInput: document.getElementById('topicInput'),
    videoCount: document.getElementById('videoCount'),
    generateBtn: document.getElementById('generateBtn'),
    progressSection: document.getElementById('progressSection'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    progressLog: document.getElementById('progressLog'),
    resultSection: document.getElementById('resultSection'),
    resultList: document.getElementById('resultList'),
    openFolderBtn: document.getElementById('openFolderBtn'),
    errorSection: document.getElementById('errorSection'),
    errorMessage: document.getElementById('errorMessage')
  };

  // 이벤트 리스너
  elements.generateBtn.addEventListener('click', startGeneration);
  elements.openFolderBtn.addEventListener('click', openOutputFolder);

  // 초기화
  checkServerStatus();
});

// 서버 상태 확인
async function checkServerStatus() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    if (response.ok) {
      elements.serverStatus.textContent = '연결됨';
      elements.serverStatus.className = 'status-badge status-ok';
    } else {
      throw new Error('Server error');
    }
  } catch (e) {
    elements.serverStatus.textContent = '연결 실패';
    elements.serverStatus.className = 'status-badge status-error';
  }
}

// 영상 생성 시작
async function startGeneration() {
  const topic = elements.topicInput.value.trim();
  const count = parseInt(elements.videoCount.value);

  if (!topic) {
    alert('주제를 입력해주세요.');
    return;
  }

  // UI 상태 변경
  elements.generateBtn.disabled = true;
  elements.progressSection.style.display = 'block';
  elements.resultSection.style.display = 'none';
  elements.errorSection.style.display = 'none';
  elements.progressLog.innerHTML = '';
  elements.resultList.innerHTML = '';

  const results = [];

  for (let i = 0; i < count; i++) {
    const progress = ((i) / count) * 100;
    updateProgress(progress, `영상 ${i + 1}/${count} 생성 중...`);

    try {
      // 1. Gemini 탭 찾기
      addLog(`[${i + 1}/${count}] Gemini 탭 찾는 중...`);
      const geminiTab = await findGeminiTab();

      if (!geminiTab) {
        addLog('Gemini 탭을 찾을 수 없습니다. gemini.google.com을 열어주세요.', 'error');
        continue;
      }

      // 2. 스크립트 생성 프롬프트
      addLog(`스크립트 생성 요청 중...`);
      const prompt = createScriptPrompt(topic, i + 1);

      // 3. Gemini에 전송
      const scriptResponse = await sendToGemini(geminiTab.id, prompt);

      if (!scriptResponse) {
        addLog('Gemini 응답을 받지 못했습니다.', 'error');
        continue;
      }

      addLog('스크립트 생성 완료', 'success');

      // 4. 백엔드로 영상 생성 요청
      addLog('영상 생성 중... (1-2분 소요)');
      const videoResult = await generateVideo(scriptResponse);

      if (videoResult.error) {
        addLog(`영상 생성 실패: ${videoResult.error}`, 'error');
        continue;
      }

      addLog(`영상 생성 완료: ${videoResult.title}`, 'success');
      results.push(videoResult);

    } catch (e) {
      addLog(`오류: ${e.message}`, 'error');
    }
  }

  // 완료
  updateProgress(100, '완료!');
  elements.generateBtn.disabled = false;

  if (results.length > 0) {
    showResults(results);
  } else {
    showError('생성된 영상이 없습니다.');
  }
}

// 스크립트 생성 프롬프트
function createScriptPrompt(topic, index) {
  return `당신은 유튜브 쇼츠 스크립트 작가입니다.
주제: ${topic}

다음 형식으로 60초 분량 스크립트를 작성해주세요:

[제목]: (영상 제목 - 클릭을 유도하는 흥미로운 제목)
[태그]: (콤마로 구분된 Pexels 검색용 영어 키워드 5개, 예: space, galaxy, stars)
[스크립트]:
(나레이션 텍스트, 문장마다 줄바꿈)

주의사항:
- 첫 문장에서 시청자 관심을 끌 것 (질문이나 놀라운 사실로 시작)
- 짧고 임팩트 있는 문장 사용
- 한국어로 작성
- 총 150-200단어 내외
- 이전과 다른 새로운 내용으로 작성 (${index}번째 영상)`;
}

// Gemini 탭 찾기
async function findGeminiTab() {
  const tabs = await chrome.tabs.query({ url: 'https://gemini.google.com/*' });
  return tabs.length > 0 ? tabs[0] : null;
}

// Gemini에 메시지 전송 및 응답 대기
async function sendToGemini(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: 'sendToGemini',
      tabId: tabId,
      message: message
    }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else if (response.error) {
        reject(new Error(response.error));
      } else {
        resolve(response.result);
      }
    });
  });
}

// 백엔드에 영상 생성 요청
async function generateVideo(scriptResponse) {
  const response = await fetch(`${BACKEND_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ script_response: scriptResponse })
  });

  return await response.json();
}

// 진행 상태 업데이트
function updateProgress(percent, text) {
  elements.progressFill.style.width = `${percent}%`;
  elements.progressText.textContent = text;
}

// 로그 추가
function addLog(message, type = 'normal') {
  const item = document.createElement('div');
  item.className = `log-item ${type === 'success' ? 'log-success' : type === 'error' ? 'log-error' : ''}`;
  item.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  elements.progressLog.appendChild(item);
  elements.progressLog.scrollTop = elements.progressLog.scrollHeight;
}

// 결과 표시
function showResults(results) {
  elements.resultSection.style.display = 'block';

  results.forEach(result => {
    const item = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `
      <div>
        <div class="title">${result.title || '제목 없음'}</div>
        <div class="duration">${Math.round(result.duration || 0)}초</div>
      </div>
    `;
    elements.resultList.appendChild(item);
  });
}

// 에러 표시
function showError(message) {
  elements.errorSection.style.display = 'block';
  elements.errorMessage.textContent = message;
}

// 출력 폴더 열기
async function openOutputFolder() {
  try {
    const response = await fetch(`${BACKEND_URL}/open-folder`, {
      method: 'POST'
    });
    if (!response.ok) {
      alert('폴더를 열 수 없습니다.');
    }
  } catch (e) {
    alert('서버에 연결할 수 없습니다.');
  }
}
