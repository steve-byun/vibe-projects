# 📦 템플릿 제작 가이드

새로운 템플릿을 만들 때 참고하는 가이드입니다.

---

## 🎨 기존 템플릿

### utility-webapp
**위치**: `templates/utility-webapp/`

**기능**:
- 문자 수 세기
- 대소문자 변환
- JSON 포맷터
- Base64 인코더/디코더
- 공백 제거
- 텍스트 정렬

**특징**:
- 6가지 도구
- 카드 그리드 레이아웃
- 그라디언트 배경
- 반응형 디자인

**사용 예시**:
```bash
node scripts/create-project.js text-tools utility-webapp
```

---

## 🆕 새 템플릿 만들기

### 예시: Calculator 템플릿

아래는 계산기 템플릿을 만드는 완전한 예시입니다.

#### index.html
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="무료 온라인 계산기 - 기본 계산부터 과학 계산까지">
    <meta name="keywords" content="계산기, 온라인 계산기, 무료 계산기, 과학 계산기">
    <title>무료 온라인 계산기</title>

    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4976487856728705"
         crossorigin="anonymous"></script>

    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>🧮 온라인 계산기</h1>
            <p class="subtitle">빠르고 정확한 계산</p>
        </header>

        <!-- 상단 광고 -->
        <div class="ad-container" id="top-ad">
            <div class="ad-placeholder">광고 영역</div>
        </div>

        <!-- 계산기 -->
        <div class="calculator">
            <div class="display" id="display">0</div>
            <div class="buttons">
                <button onclick="clearDisplay()" class="btn-clear">C</button>
                <button onclick="deleteLast()" class="btn-operator">⌫</button>
                <button onclick="appendOperator('/')" class="btn-operator">÷</button>
                <button onclick="appendOperator('*')" class="btn-operator">×</button>

                <button onclick="appendNumber('7')" class="btn-number">7</button>
                <button onclick="appendNumber('8')" class="btn-number">8</button>
                <button onclick="appendNumber('9')" class="btn-number">9</button>
                <button onclick="appendOperator('-')" class="btn-operator">-</button>

                <button onclick="appendNumber('4')" class="btn-number">4</button>
                <button onclick="appendNumber('5')" class="btn-number">5</button>
                <button onclick="appendNumber('6')" class="btn-number">6</button>
                <button onclick="appendOperator('+')" class="btn-operator">+</button>

                <button onclick="appendNumber('1')" class="btn-number">1</button>
                <button onclick="appendNumber('2')" class="btn-number">2</button>
                <button onclick="appendNumber('3')" class="btn-number">3</button>
                <button onclick="calculate()" class="btn-equals" style="grid-row: span 2;">=</button>

                <button onclick="appendNumber('0')" class="btn-number" style="grid-column: span 2;">0</button>
                <button onclick="appendNumber('.')" class="btn-number">.</button>
            </div>

            <div class="history">
                <h3>계산 기록</h3>
                <div id="history-list"></div>
            </div>
        </div>

        <!-- 하단 광고 -->
        <div class="ad-container" id="bottom-ad">
            <div class="ad-placeholder">광고 영역</div>
        </div>

        <footer>
            <p>모든 계산은 브라우저에서 로컬로 수행됩니다.</p>
            <p>&copy; 2026 Online Calculator. Made with Claude Code.</p>
        </footer>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

#### script.js
```javascript
let currentValue = '0';
let previousValue = '';
let operator = '';
let history = [];

const display = document.getElementById('display');
const historyList = document.getElementById('history-list');

function updateDisplay() {
    display.textContent = currentValue;
}

function appendNumber(num) {
    if (currentValue === '0') {
        currentValue = num;
    } else {
        currentValue += num;
    }
    updateDisplay();
}

function appendOperator(op) {
    if (currentValue === '') return;
    if (previousValue !== '') {
        calculate();
    }
    operator = op;
    previousValue = currentValue;
    currentValue = '';
}

function calculate() {
    if (previousValue === '' || currentValue === '' || operator === '') return;

    const prev = parseFloat(previousValue);
    const curr = parseFloat(currentValue);
    let result;

    switch (operator) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '*':
            result = prev * curr;
            break;
        case '/':
            result = prev / curr;
            break;
        default:
            return;
    }

    // 히스토리 추가
    const calculation = `${prev} ${operator} ${curr} = ${result}`;
    history.unshift(calculation);
    if (history.length > 10) history.pop();
    updateHistory();

    currentValue = result.toString();
    previousValue = '';
    operator = '';
    updateDisplay();
}

function clearDisplay() {
    currentValue = '0';
    previousValue = '';
    operator = '';
    updateDisplay();
}

function deleteLast() {
    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue = '0';
    }
    updateDisplay();
}

function updateHistory() {
    historyList.innerHTML = history
        .map(item => `<div class="history-item">${item}</div>`)
        .join('');
}

// 키보드 지원
document.addEventListener('keydown', function(e) {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendNumber('.');
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        appendOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Escape') {
        clearDisplay();
    } else if (e.key === 'Backspace') {
        deleteLast();
    }
});
```

---

## 🎨 템플릿 카테고리

### 1. 도구(Utility) 템플릿
- 텍스트 처리
- 데이터 변환
- 파일 조작

### 2. 계산기(Calculator) 템플릿
- 기본 계산기
- 전문 계산기 (대출, BMI, 환율 등)
- 과학 계산기

### 3. 생성기(Generator) 템플릿
- QR 코드
- 비밀번호
- Lorem Ipsum
- 그라디언트

### 4. 게임(Game) 템플릿
- 2048
- 뱀게임
- 퍼즐

### 5. 변환기(Converter) 템플릿
- 단위 변환
- 통화 변환
- 이미지 포맷 변환

---

## 📋 템플릿 체크리스트

새 템플릿을 만들 때 확인:

- [ ] index.html 있음
- [ ] `<head>`에 AdSense 코드 있음
- [ ] style.css 있음
- [ ] script.js 있음
- [ ] adsense-config.js 있음
- [ ] 광고 영역 2개 이상
- [ ] 반응형 디자인
- [ ] SEO meta 태그
- [ ] 사용자 가이드/설명
- [ ] 로컬에서 테스트 완료

---

**마지막 업데이트**: 2026-01-26
