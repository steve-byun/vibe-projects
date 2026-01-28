const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const BrowserController = require('./browser');

let mainWindow;
let browserController;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'icon.ico')
    });

    mainWindow.loadFile('renderer/index.html');

    // DevTools 열기
    mainWindow.webContents.openDevTools();

    // 에러 로깅
    mainWindow.webContents.on('did-fail-load', (e, code, desc) => {
        console.error('Failed to load:', code, desc);
    });
}

app.whenReady().then(() => {
    createWindow();
    browserController = new BrowserController();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', async () => {
    if (browserController) {
        await browserController.close();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC 핸들러들

// 브라우저 초기화
ipcMain.handle('init-browser', async () => {
    try {
        await browserController.init();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// 브라우저 상태 확인
ipcMain.handle('check-status', async () => {
    try {
        const status = await browserController.checkStatus();
        return status;
    } catch (error) {
        return { gptReady: false, geminiReady: false, error: error.message };
    }
});

// ChatGPT 열기
ipcMain.handle('open-gpt', async () => {
    console.log('[Main] open-gpt called');
    try {
        console.log('[Main] Calling browserController.openGpt()...');
        await browserController.openGpt();
        console.log('[Main] openGpt() completed');
        return { success: true };
    } catch (error) {
        console.error('[Main] openGpt error:', error);
        return { success: false, error: error.message };
    }
});

// Gemini 열기
ipcMain.handle('open-gemini', async () => {
    try {
        await browserController.openGemini();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// 질문 보내기
ipcMain.handle('send-question', async (event, { question, useGpt, useGemini }) => {
    try {
        const results = await browserController.sendQuestion(question, useGpt, useGemini);
        return results;
    } catch (error) {
        return { error: error.message };
    }
});

// 진행 상태 업데이트 전송
ipcMain.on('request-progress', () => {
    if (browserController) {
        browserController.onProgress = (progress) => {
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('progress-update', progress);
            }
        };
    }
});
