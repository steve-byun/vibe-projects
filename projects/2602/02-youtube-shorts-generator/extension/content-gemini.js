// YouTube Shorts Generator - Gemini Content Script
// 필요시 페이지 내에서 직접 조작이 필요한 경우 사용

console.log('[YouTube Shorts Generator] Gemini content script loaded');

// 페이지 로드 감지
let isPageReady = false;

function checkPageReady() {
  const input = document.querySelector('.ql-editor[contenteditable="true"]')
    || document.querySelector('[contenteditable="true"][aria-label*="prompt"]');

  if (input) {
    isPageReady = true;
    console.log('[YouTube Shorts Generator] Gemini page ready');
  }
}

// 초기 체크
setTimeout(checkPageReady, 1000);

// DOM 변경 감시
const observer = new MutationObserver(() => {
  if (!isPageReady) {
    checkPageReady();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
