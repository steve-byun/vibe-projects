// 도구 1: 문자 수 세기
const textCounter = document.getElementById('textCounter');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');
const lineCount = document.getElementById('lineCount');

textCounter.addEventListener('input', function() {
    const text = this.value;

    // 문자 수
    charCount.textContent = text.length;

    // 단어 수
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    wordCount.textContent = words.length;

    // 줄 수
    const lines = text.split('\n').length;
    lineCount.textContent = lines;
});

// 도구 2: 대소문자 변환
function convertCase(type) {
    const input = document.getElementById('caseInput').value;
    const output = document.getElementById('caseOutput');

    if (!input) {
        alert('텍스트를 입력하세요!');
        return;
    }

    switch(type) {
        case 'upper':
            output.value = input.toUpperCase();
            break;
        case 'lower':
            output.value = input.toLowerCase();
            break;
        case 'title':
            output.value = input.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
            break;
    }
}

// 도구 3: JSON 포맷터
function formatJSON() {
    const input = document.getElementById('jsonInput').value;
    const output = document.getElementById('jsonOutput');
    const error = document.getElementById('jsonError');

    try {
        const parsed = JSON.parse(input);
        output.value = JSON.stringify(parsed, null, 2);
        error.textContent = '';
    } catch(e) {
        error.textContent = '❌ 유효하지 않은 JSON입니다: ' + e.message;
        output.value = '';
    }
}

function minifyJSON() {
    const input = document.getElementById('jsonInput').value;
    const output = document.getElementById('jsonOutput');
    const error = document.getElementById('jsonError');

    try {
        const parsed = JSON.parse(input);
        output.value = JSON.stringify(parsed);
        error.textContent = '';
    } catch(e) {
        error.textContent = '❌ 유효하지 않은 JSON입니다: ' + e.message;
        output.value = '';
    }
}

function validateJSON() {
    const input = document.getElementById('jsonInput').value;
    const error = document.getElementById('jsonError');

    try {
        JSON.parse(input);
        error.textContent = '✅ 유효한 JSON입니다!';
        error.style.color = '#27ae60';
        setTimeout(() => {
            error.style.color = '#e74c3c';
        }, 3000);
    } catch(e) {
        error.textContent = '❌ 유효하지 않은 JSON입니다: ' + e.message;
    }
}

// 도구 4: Base64 인코더/디코더
function encodeBase64() {
    const input = document.getElementById('base64Input').value;
    const output = document.getElementById('base64Output');

    if (!input) {
        alert('텍스트를 입력하세요!');
        return;
    }

    try {
        output.value = btoa(unescape(encodeURIComponent(input)));
    } catch(e) {
        alert('인코딩 실패: ' + e.message);
    }
}

function decodeBase64() {
    const input = document.getElementById('base64Input').value;
    const output = document.getElementById('base64Output');

    if (!input) {
        alert('Base64 텍스트를 입력하세요!');
        return;
    }

    try {
        output.value = decodeURIComponent(escape(atob(input)));
    } catch(e) {
        alert('디코딩 실패: 유효한 Base64가 아닙니다.');
    }
}

// 도구 5: 공백 제거
function trimSpaces(type) {
    const input = document.getElementById('trimInput').value;
    const output = document.getElementById('trimOutput');

    if (!input) {
        alert('텍스트를 입력하세요!');
        return;
    }

    switch(type) {
        case 'all':
            output.value = input.replace(/\s+/g, '');
            break;
        case 'extra':
            output.value = input.replace(/\s+/g, ' ').trim();
            break;
        case 'lines':
            output.value = input.split('\n').filter(line => line.trim()).join('\n');
            break;
    }
}

// 도구 6: 텍스트 정렬
function sortText(type) {
    const input = document.getElementById('sortInput').value;
    const output = document.getElementById('sortOutput');

    if (!input) {
        alert('텍스트를 입력하세요!');
        return;
    }

    let lines = input.split('\n').filter(line => line.trim());

    switch(type) {
        case 'asc':
            lines.sort();
            break;
        case 'desc':
            lines.sort().reverse();
            break;
        case 'shuffle':
            lines = lines.sort(() => Math.random() - 0.5);
            break;
    }

    output.value = lines.join('\n');
}

// 페이지 로드 시 애니메이션
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.tool-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});
