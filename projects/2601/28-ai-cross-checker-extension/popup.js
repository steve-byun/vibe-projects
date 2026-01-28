// Popup - 모드 선택 (사이드 패널 / 전체 페이지)

document.addEventListener('DOMContentLoaded', async () => {
    // 저장된 선택 확인
    const { preferredMode, rememberChoice } = await chrome.storage.local.get(['preferredMode', 'rememberChoice']);

    // 기억하기 옵션이 켜져있고 이전 선택이 있으면 바로 실행
    if (rememberChoice && preferredMode) {
        openMode(preferredMode);
        return;
    }

    // 체크박스 상태 복원
    if (rememberChoice) {
        document.getElementById('rememberChoice').checked = true;
    }

    // 이벤트 리스너
    document.getElementById('sidePanelBtn').addEventListener('click', () => {
        saveAndOpen('sidepanel');
    });

    document.getElementById('fullPageBtn').addEventListener('click', () => {
        saveAndOpen('fullpage');
    });
});

async function saveAndOpen(mode) {
    const remember = document.getElementById('rememberChoice').checked;

    await chrome.storage.local.set({
        preferredMode: mode,
        rememberChoice: remember
    });

    openMode(mode);
}

async function openMode(mode) {
    if (mode === 'sidepanel') {
        // 사이드 패널 열기
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.runtime.sendMessage({ action: 'openSidePanel', windowId: tab.windowId });
        window.close();
    } else {
        // 전체 페이지로 열기 (새 탭)
        chrome.tabs.create({ url: chrome.runtime.getURL('sidepanel.html') });
        window.close();
    }
}
