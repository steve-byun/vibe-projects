const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // 브라우저 초기화
    initBrowser: () => ipcRenderer.invoke('init-browser'),

    // 상태 확인
    checkStatus: () => ipcRenderer.invoke('check-status'),

    // ChatGPT 열기
    openGpt: () => ipcRenderer.invoke('open-gpt'),

    // Gemini 열기
    openGemini: () => ipcRenderer.invoke('open-gemini'),

    // 질문 보내기
    sendQuestion: (data) => ipcRenderer.invoke('send-question', data),

    // 진행 상태 업데이트 수신
    onProgress: (callback) => {
        ipcRenderer.on('progress-update', (event, progress) => callback(progress));
        ipcRenderer.send('request-progress');
    }
});
