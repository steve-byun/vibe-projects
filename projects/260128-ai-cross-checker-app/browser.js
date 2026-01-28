const { chromium } = require('playwright');
const path = require('path');

class BrowserController {
    constructor() {
        this.browser = null;
        this.context = null;
        this.gptPage = null;
        this.geminiPage = null;
        this.onProgress = null;
    }

    // 브라우저 초기화 (로그인 상태 유지를 위해 persistent context 사용)
    async init() {
        if (this.browser) return;

        const userDataDir = path.join(__dirname, 'user-data');

        this.context = await chromium.launchPersistentContext(userDataDir, {
            headless: false,
            viewport: { width: 1280, height: 800 },
            args: [
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox'
            ]
        });

        // 빈 페이지 닫기
        const pages = this.context.pages();
        if (pages.length > 0 && pages[0].url() === 'about:blank') {
            await pages[0].close();
        }
    }

    // 브라우저 닫기
    async close() {
        if (this.context) {
            await this.context.close();
            this.context = null;
        }
    }

    // 상태 확인
    async checkStatus() {
        let gptReady = false;
        let geminiReady = false;
        let gptLoggedIn = false;
        let geminiLoggedIn = false;

        if (this.gptPage && !this.gptPage.isClosed()) {
            gptReady = true;
            // 로그인 상태 확인
            try {
                const url = this.gptPage.url();
                gptLoggedIn = url.includes('chatgpt.com') && !url.includes('auth');
            } catch (e) {}
        }

        if (this.geminiPage && !this.geminiPage.isClosed()) {
            geminiReady = true;
            try {
                const url = this.geminiPage.url();
                geminiLoggedIn = url.includes('gemini.google.com') && !url.includes('signin');
            } catch (e) {}
        }

        return { gptReady, geminiReady, gptLoggedIn, geminiLoggedIn };
    }

    // ChatGPT 열기
    async openGpt() {
        if (!this.context) await this.init();

        if (!this.gptPage || this.gptPage.isClosed()) {
            this.gptPage = await this.context.newPage();
        }

        await this.gptPage.goto('https://chatgpt.com', { waitUntil: 'domcontentloaded' });
        await this.gptPage.waitForTimeout(2000);
    }

    // Gemini 열기
    async openGemini() {
        if (!this.context) await this.init();

        if (!this.geminiPage || this.geminiPage.isClosed()) {
            this.geminiPage = await this.context.newPage();
        }

        await this.geminiPage.goto('https://gemini.google.com', { waitUntil: 'domcontentloaded' });
        await this.geminiPage.waitForTimeout(2000);
    }

    // 질문 보내기
    async sendQuestion(question, useGpt, useGemini) {
        const results = {
            gptResponse: '',
            geminiResponse: '',
            gptError: '',
            geminiError: ''
        };

        const promises = [];

        if (useGpt && this.gptPage && !this.gptPage.isClosed()) {
            promises.push(
                this.sendToGpt(question)
                    .then(response => { results.gptResponse = response; })
                    .catch(error => { results.gptError = error.message; })
            );
        }

        if (useGemini && this.geminiPage && !this.geminiPage.isClosed()) {
            promises.push(
                this.sendToGemini(question)
                    .then(response => { results.geminiResponse = response; })
                    .catch(error => { results.geminiError = error.message; })
            );
        }

        await Promise.all(promises);
        return results;
    }

    // ChatGPT에 질문 보내기
    async sendToGpt(question) {
        this.updateProgress('gpt', 'sending');

        const page = this.gptPage;

        // 입력 필드 찾기
        const inputSelector = '#prompt-textarea, textarea[data-id="root"], div[contenteditable="true"][id="prompt-textarea"]';

        await page.waitForSelector(inputSelector, { timeout: 10000 });

        // 기존 응답 수 확인
        const initialCount = await page.$$eval(
            '[data-message-author-role="assistant"]',
            els => els.length
        );

        // 텍스트 입력
        const input = await page.$(inputSelector);
        const tagName = await input.evaluate(el => el.tagName.toLowerCase());

        if (tagName === 'div') {
            await input.fill('');
            await input.type(question, { delay: 10 });
        } else {
            await input.fill(question);
        }

        await page.waitForTimeout(300);

        // 전송 버튼 클릭
        const sendButton = await page.$('[data-testid="send-button"]:not([disabled]), button[aria-label="Send prompt"]:not([disabled])');
        if (sendButton) {
            await sendButton.click();
        } else {
            await page.keyboard.press('Enter');
        }

        this.updateProgress('gpt', 'waiting');

        // 응답 대기 (최대 90초)
        const response = await this.waitForGptResponse(page, initialCount, 90000);

        this.updateProgress('gpt', 'done');
        return response;
    }

    // GPT 응답 대기
    async waitForGptResponse(page, initialCount, timeout) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            await page.waitForTimeout(1000);

            // 새 응답 확인
            const responses = await page.$$('[data-message-author-role="assistant"]');

            if (responses.length > initialCount) {
                // 스트리밍 중인지 확인
                const isStreaming = await page.$('.result-streaming, button[aria-label="Stop generating"]');

                if (!isStreaming) {
                    // 마지막 응답 텍스트 가져오기
                    const lastResponse = responses[responses.length - 1];
                    const text = await lastResponse.textContent();

                    if (text && text.length > 0) {
                        return text;
                    }
                }
            }
        }

        throw new Error('응답 시간 초과');
    }

    // Gemini에 질문 보내기
    async sendToGemini(question) {
        this.updateProgress('gemini', 'sending');

        const page = this.geminiPage;

        // 입력 필드 찾기
        const inputSelector = '.ql-editor[contenteditable="true"], rich-textarea [contenteditable="true"], [contenteditable="true"]';

        await page.waitForSelector(inputSelector, { timeout: 10000 });

        // 기존 응답 수 확인
        const initialCount = await page.$$eval('model-response', els => els.length);

        // 텍스트 입력
        const input = await page.$(inputSelector);
        await input.click();
        await input.fill(question);

        await page.waitForTimeout(300);

        // 전송 버튼 클릭
        const sendButton = await page.$('button[aria-label="Send message"], button[aria-label*="보내기"], button[aria-label*="Send"]');
        if (sendButton) {
            await sendButton.click();
        } else {
            await page.keyboard.press('Enter');
        }

        this.updateProgress('gemini', 'waiting');

        // 응답 대기 (최대 90초)
        const response = await this.waitForGeminiResponse(page, initialCount, 90000);

        this.updateProgress('gemini', 'done');
        return response;
    }

    // Gemini 응답 대기
    async waitForGeminiResponse(page, initialCount, timeout) {
        const startTime = Date.now();
        let lastText = '';

        while (Date.now() - startTime < timeout) {
            await page.waitForTimeout(1000);

            // 새 응답 확인
            const responses = await page.$$('model-response');

            if (responses.length > initialCount) {
                // 로딩 중인지 확인
                const isLoading = await page.$('model-response mat-progress-spinner, mat-spinner');

                if (!isLoading) {
                    // 마지막 응답 텍스트 가져오기
                    const lastResponse = responses[responses.length - 1];
                    const contentEl = await lastResponse.$('.markdown-main-panel, message-content');
                    const text = contentEl
                        ? await contentEl.textContent()
                        : await lastResponse.textContent();

                    // 텍스트가 더 이상 변하지 않으면 완료
                    if (text && text.length > 10) {
                        if (text === lastText) {
                            return text;
                        }
                        lastText = text;
                    }
                }
            }
        }

        throw new Error('응답 시간 초과');
    }

    // 진행 상태 업데이트
    updateProgress(ai, status) {
        if (this.onProgress) {
            this.onProgress({ ai, status });
        }
    }
}

module.exports = BrowserController;
