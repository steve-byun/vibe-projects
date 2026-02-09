// YouTube Shorts Generator - Background Service Worker

// 확장 아이콘 클릭 시 사이드 패널 열기
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// 메시지 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'sendToGemini') {
    handleSendToGemini(request.tabId, request.message)
      .then(result => sendResponse({ result }))
      .catch(error => sendResponse({ error: error.message }));
    return true; // 비동기 응답
  }
});

// Gemini에 메시지 전송 및 응답 대기
async function handleSendToGemini(tabId, message) {
  // 1. 탭 활성화
  await chrome.tabs.update(tabId, { active: true });
  await sleep(500);

  // 2. 텍스트 입력
  await inputText(tabId, message);
  await sleep(300);

  // 3. 전송 버튼 클릭
  const sendResult = await clickSend(tabId);
  if (sendResult.error) {
    throw new Error(sendResult.error);
  }

  // 4. 응답 대기
  const response = await waitForResponse(tabId);
  return response;
}

// 텍스트 입력
async function inputText(tabId, message) {
  return chrome.scripting.executeScript({
    target: { tabId },
    func: injectInputText,
    args: [message]
  });
}

function injectInputText(message) {
  // Gemini 입력창 찾기
  const input = document.querySelector('.ql-editor[contenteditable="true"]')
    || document.querySelector('[contenteditable="true"][aria-label*="prompt"]')
    || document.querySelector('rich-textarea [contenteditable="true"]');

  if (!input) {
    throw new Error('입력창을 찾을 수 없습니다.');
  }

  // 텍스트 입력
  input.innerHTML = `<p>${message}</p>`;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));

  return { success: true };
}

// 전송 버튼 클릭
async function clickSend(tabId) {
  const maxRetries = 30;

  for (let i = 0; i < maxRetries; i++) {
    const result = await chrome.scripting.executeScript({
      target: { tabId },
      func: injectClickSend
    });

    const data = result[0]?.result;

    if (data?.success) {
      return { success: true };
    }

    if (data?.needsWait) {
      // 응답 생성 중이면 대기
      await sleep(1000);
      continue;
    }

    if (data?.error) {
      return { error: data.error };
    }

    await sleep(500);
  }

  return { error: '전송 버튼을 찾을 수 없습니다.' };
}

function injectClickSend() {
  // Stop 버튼 확인 (응답 생성 중)
  const stopSelectors = [
    'button[aria-label="Stop generating"]',
    'button[aria-label="중지"]',
    'button[aria-label="Stop"]'
  ];

  for (const sel of stopSelectors) {
    const stopBtn = document.querySelector(sel);
    if (stopBtn && stopBtn.offsetParent !== null) {
      return { needsWait: true };
    }
  }

  // Stop 버튼 (정사각형 아이콘)
  const buttons = document.querySelectorAll('button');
  for (const btn of buttons) {
    const svg = btn.querySelector('svg');
    if (svg) {
      const rect = svg.querySelector('rect');
      if (rect && !svg.querySelector('path') && btn.offsetParent !== null) {
        return { needsWait: true };
      }
    }
  }

  // 전송 버튼 찾기 (화면 하단)
  const allButtons = Array.from(document.querySelectorAll('button'));
  const bottomButtons = allButtons.filter(btn => {
    const rect = btn.getBoundingClientRect();
    return rect.bottom > window.innerHeight - 200 && btn.offsetParent !== null;
  });

  // 화살표 아이콘이 있는 버튼 찾기
  for (const btn of bottomButtons) {
    const svg = btn.querySelector('svg');
    if (svg && svg.querySelector('path')) {
      // 마이크/첨부 버튼 제외
      const ariaLabel = btn.getAttribute('aria-label') || '';
      if (ariaLabel.includes('음성') || ariaLabel.includes('Voice') ||
          ariaLabel.includes('첨부') || ariaLabel.includes('Upload') ||
          ariaLabel.includes('마이크') || ariaLabel.includes('Mic')) {
        continue;
      }
      btn.click();
      return { success: true };
    }
  }

  // fallback: Enter 키
  const input = document.querySelector('.ql-editor[contenteditable="true"]')
    || document.querySelector('[contenteditable="true"][aria-label*="prompt"]');

  if (input) {
    input.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true
    }));
    return { success: true };
  }

  return { error: '전송 버튼을 찾을 수 없습니다.' };
}

// 응답 대기 (AI 크로스체커와 동일한 방식)
async function waitForResponse(tabId) {
  const checkInterval = 500;
  let sawStopButton = false;

  console.log('[Gemini] 응답 대기 시작 (버튼 모양 기반)');

  while (true) {
    await sleep(checkInterval);

    try {
      const result = await chrome.scripting.executeScript({
        target: { tabId },
        func: injectCheckButtonStateGemini
      });

      const { hasStopButton } = result[0]?.result || {};

      // Stop 버튼(■) 감지 → 응답 생성 중
      if (hasStopButton) {
        sawStopButton = true;
        continue;
      }

      // Stop 버튼(■) 없음 + Stop 버튼을 본 적이 있음 → 응답 완료!
      if (!hasStopButton && sawStopButton) {
        console.log('[Gemini] 응답 완료! (Stop 버튼 사라짐)');

        // 응답 텍스트 가져오기
        const textResult = await chrome.scripting.executeScript({
          target: { tabId },
          func: injectGetLastResponseGemini
        });
        const text = textResult[0]?.result || '';
        console.log(`[Gemini] 응답 텍스트: ${text.length}자`);
        return text;
      }

    } catch (e) {
      console.error('[Gemini] Check error:', e);
    }
  }
}

// Gemini 버튼 상태 확인 (AI 크로스체커와 동일)
function injectCheckButtonStateGemini() {
  try {
    const allButtons = [...document.querySelectorAll('button')];
    const stopButton = allButtons.find(btn => {
      const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
      const btnText = (btn.textContent || '').toLowerCase();
      const rect = btn.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0;
      if (!isVisible) return false;

      return ariaLabel.includes('stop') || ariaLabel.includes('중지') ||
             btnText.includes('stop') || btnText.includes('중지') ||
             btnText.includes('대답 생성 중지');
    });

    const hasStopButton = !!stopButton;
    console.log(`[Gemini ButtonState] Stop=${hasStopButton}`);
    return { hasStopButton };

  } catch (e) {
    console.error('[Gemini ButtonState] 에러:', e);
    return { hasStopButton: false, error: e.message };
  }
}

// Gemini 마지막 응답 텍스트 가져오기 (AI 크로스체커와 동일)
function injectGetLastResponseGemini() {
  try {
    // 다양한 Gemini UI 버전 대응
    const selectors = [
      'model-response',
      '.model-response',
      '[data-message-author-role="model"]',
      '.response-container',
      '.conversation-container model-response',
      'message-content[data-message-id]',
      '.markdown-main-panel'
    ];

    let responseContainers = [];
    for (const sel of selectors) {
      const elements = document.querySelectorAll(sel);
      if (elements.length > 0) {
        responseContainers = elements;
        break;
      }
    }

    if (responseContainers.length > 0) {
      const lastContainer = responseContainers[responseContainers.length - 1];

      // 콘텐츠 요소 찾기
      const contentEl = lastContainer.querySelector('.markdown-main-panel')
        || lastContainer.querySelector('message-content')
        || lastContainer.querySelector('.response-text')
        || lastContainer.querySelector('.markdown')
        || lastContainer;

      const text = contentEl?.innerText?.trim() || contentEl?.textContent?.trim() || '';
      console.log('[Gemini GetResponse] 추출된 텍스트 길이:', text.length);
      console.log('[Gemini GetResponse] 텍스트 미리보기:', text.substring(0, 200));
      return text;
    }

    console.log('[Gemini GetResponse] 응답 컨테이너를 찾을 수 없음');
    return '';
  } catch (e) {
    console.error('[Gemini GetResponse] 에러:', e);
    return '';
  }
}

// 유틸리티
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
