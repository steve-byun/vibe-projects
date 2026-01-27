// Background Service Worker
// 탭 업데이트 감지
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        // ChatGPT나 Gemini 페이지가 로드되면 content script가 자동으로 주입됨
        console.log('Tab updated:', tab.url);
    }
});

// 설치/업데이트 시
chrome.runtime.onInstalled.addListener(() => {
    console.log('AI Cross Checker extension installed');
});
