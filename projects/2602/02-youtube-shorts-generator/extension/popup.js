document.getElementById('openPanel').addEventListener('click', async () => {
  // 사이드패널 열기
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.sidePanel.open({ tabId: tab.id });
  window.close();
});
