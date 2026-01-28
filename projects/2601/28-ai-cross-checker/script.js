// 전역 변수
let gptResponse = '';
let geminiResponse = '';
let originalQuestion = '';

// 페이지 로드 시 저장된 API 키 불러오기
document.addEventListener('DOMContentLoaded', () => {
    const savedOpenAI = localStorage.getItem('openai_api_key');
    const savedGemini = localStorage.getItem('gemini_api_key');

    if (savedOpenAI) {
        document.getElementById('openaiKey').value = savedOpenAI;
    }
    if (savedGemini) {
        document.getElementById('geminiKey').value = savedGemini;
    }

    // 키가 둘 다 있으면 설정 섹션 닫기
    if (savedOpenAI && savedGemini) {
        document.getElementById('settingsSection').style.display = 'none';
        document.getElementById('settingsToggle').style.display = 'block';
    }
});

// API 키 저장
function saveApiKeys() {
    const openaiKey = document.getElementById('openaiKey').value.trim();
    const geminiKey = document.getElementById('geminiKey').value.trim();

    if (openaiKey) {
        localStorage.setItem('openai_api_key', openaiKey);
    }
    if (geminiKey) {
        localStorage.setItem('gemini_api_key', geminiKey);
    }

    alert('API 키가 저장되었습니다.');

    if (openaiKey && geminiKey) {
        document.getElementById('settingsSection').style.display = 'none';
        document.getElementById('settingsToggle').style.display = 'block';
    }
}

// 설정 토글
function toggleSettings() {
    const section = document.getElementById('settingsSection');
    const toggle = document.getElementById('settingsToggle');

    if (section.style.display === 'none') {
        section.style.display = 'block';
        toggle.style.display = 'none';
    } else {
        section.style.display = 'none';
        toggle.style.display = 'block';
    }
}

// GPT API 호출
async function callGPT(prompt, systemPrompt = '') {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) throw new Error('OpenAI API 키가 없습니다.');

    const messages = [];
    if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: messages,
            temperature: 0.7,
            max_tokens: 2000
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'GPT API 오류');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// Gemini API 호출
async function callGemini(prompt) {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) throw new Error('Gemini API 키가 없습니다.');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2000
            }
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Gemini API 오류');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// 두 AI에 동시에 질문
async function askBothAIs() {
    const question = document.getElementById('questionInput').value.trim();
    if (!question) {
        alert('질문을 입력하세요.');
        return;
    }

    const openaiKey = localStorage.getItem('openai_api_key');
    const geminiKey = localStorage.getItem('gemini_api_key');

    if (!openaiKey || !geminiKey) {
        alert('API 키를 먼저 설정하세요.');
        return;
    }

    originalQuestion = question;

    // UI 초기화
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('crossCheckSection').style.display = 'none';
    document.getElementById('finalSection').style.display = 'none';
    document.getElementById('gptResult').innerHTML = '<div class="loading">응답 대기중...</div>';
    document.getElementById('geminiResult').innerHTML = '<div class="loading">응답 대기중...</div>';
    document.getElementById('gptStatus').textContent = '요청중';
    document.getElementById('gptStatus').className = 'status';
    document.getElementById('geminiStatus').textContent = '요청중';
    document.getElementById('geminiStatus').className = 'status';
    document.getElementById('crossCheckBtn').disabled = true;
    document.getElementById('askBtn').disabled = true;

    gptResponse = '';
    geminiResponse = '';

    // 동시에 호출
    const gptPromise = callGPT(question)
        .then(response => {
            gptResponse = response;
            document.getElementById('gptResult').textContent = response;
            document.getElementById('gptStatus').textContent = '완료';
            document.getElementById('gptStatus').className = 'status done';
        })
        .catch(error => {
            document.getElementById('gptResult').textContent = '오류: ' + error.message;
            document.getElementById('gptStatus').textContent = '오류';
            document.getElementById('gptStatus').className = 'status error';
        });

    const geminiPromise = callGemini(question)
        .then(response => {
            geminiResponse = response;
            document.getElementById('geminiResult').textContent = response;
            document.getElementById('geminiStatus').textContent = '완료';
            document.getElementById('geminiStatus').className = 'status done';
        })
        .catch(error => {
            document.getElementById('geminiResult').textContent = '오류: ' + error.message;
            document.getElementById('geminiStatus').textContent = '오류';
            document.getElementById('geminiStatus').className = 'status error';
        });

    // 둘 다 완료되면 크로스체킹 버튼 활성화
    await Promise.all([gptPromise, geminiPromise]);

    document.getElementById('askBtn').disabled = false;

    if (gptResponse && geminiResponse) {
        document.getElementById('crossCheckBtn').disabled = false;
    }
}

// 크로스체킹
async function crossCheck() {
    if (!gptResponse || !geminiResponse) {
        alert('먼저 두 AI의 답변을 받아야 합니다.');
        return;
    }

    document.getElementById('crossCheckSection').style.display = 'block';
    document.getElementById('finalSection').style.display = 'block';
    document.getElementById('crossCheckBtn').disabled = true;

    document.getElementById('gptReview').innerHTML = '<div class="loading">검토중...</div>';
    document.getElementById('geminiReview').innerHTML = '<div class="loading">검토중...</div>';
    document.getElementById('commonOpinion').textContent = '분석중...';
    document.getElementById('gptUnique').textContent = '분석중...';
    document.getElementById('geminiUnique').textContent = '분석중...';

    const reviewPrompt = (otherAI, otherResponse) => `
다음은 "${originalQuestion}"이라는 질문에 대한 ${otherAI}의 답변입니다:

---
${otherResponse}
---

위 답변을 검토해주세요:
1. 정확한 부분
2. 부정확하거나 의문이 드는 부분
3. 추가하면 좋을 내용

간결하게 핵심만 답변해주세요.
`;

    const comparisonPrompt = `
다음은 같은 질문 "${originalQuestion}"에 대한 GPT와 Gemini의 답변입니다.

[GPT 답변]
${gptResponse}

[Gemini 답변]
${geminiResponse}

두 답변을 비교 분석해서 다음 형식으로 정리해주세요:

[공통 의견]
두 AI가 동의하는 핵심 내용

[GPT만의 의견]
GPT에서만 언급한 내용

[Gemini만의 의견]
Gemini에서만 언급한 내용

각 섹션을 명확히 구분해서 답변해주세요.
`;

    // GPT가 Gemini 검토
    callGPT(reviewPrompt('Gemini', geminiResponse), 'You are a critical reviewer. Be objective and concise.')
        .then(response => {
            document.getElementById('gptReview').textContent = response;
        })
        .catch(error => {
            document.getElementById('gptReview').textContent = '오류: ' + error.message;
        });

    // Gemini가 GPT 검토
    callGemini(reviewPrompt('GPT', gptResponse))
        .then(response => {
            document.getElementById('geminiReview').textContent = response;
        })
        .catch(error => {
            document.getElementById('geminiReview').textContent = '오류: ' + error.message;
        });

    // 최종 비교 (GPT 사용)
    callGPT(comparisonPrompt, 'You are an objective analyst. Compare the two responses fairly.')
        .then(response => {
            parseComparison(response);
        })
        .catch(error => {
            document.getElementById('commonOpinion').textContent = '분석 오류: ' + error.message;
            document.getElementById('gptUnique').textContent = '-';
            document.getElementById('geminiUnique').textContent = '-';
        });
}

// 비교 결과 파싱
function parseComparison(response) {
    const commonMatch = response.match(/\[공통 의견\]([\s\S]*?)(?=\[GPT만의 의견\]|\[Gemini만의 의견\]|$)/i);
    const gptMatch = response.match(/\[GPT만의 의견\]([\s\S]*?)(?=\[Gemini만의 의견\]|$)/i);
    const geminiMatch = response.match(/\[Gemini만의 의견\]([\s\S]*?)$/i);

    document.getElementById('commonOpinion').textContent = commonMatch ? commonMatch[1].trim() : response;
    document.getElementById('gptUnique').textContent = gptMatch ? gptMatch[1].trim() : '특이사항 없음';
    document.getElementById('geminiUnique').textContent = geminiMatch ? geminiMatch[1].trim() : '특이사항 없음';
}

// Enter 키로 질문
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        const askBtn = document.getElementById('askBtn');
        if (!askBtn.disabled) {
            askBothAIs();
        }
    }
});
