// 계산기 1: A의 B%는?
function calculate1() {
    const value = parseFloat(document.getElementById('calc1-value').value);
    const percent = parseFloat(document.getElementById('calc1-percent').value);
    const resultEl = document.getElementById('result1');

    if (isNaN(value) || isNaN(percent)) {
        resultEl.textContent = '숫자를 입력하세요';
        resultEl.classList.remove('highlight');
        return;
    }

    const result = value * (percent / 100);
    resultEl.textContent = `${value}의 ${percent}% = ${formatNumber(result)}`;
    resultEl.classList.add('highlight');
}

// 계산기 2: A는 B의 몇 %?
function calculate2() {
    const part = parseFloat(document.getElementById('calc2-part').value);
    const whole = parseFloat(document.getElementById('calc2-whole').value);
    const resultEl = document.getElementById('result2');

    if (isNaN(part) || isNaN(whole)) {
        resultEl.textContent = '숫자를 입력하세요';
        resultEl.classList.remove('highlight');
        return;
    }

    if (whole === 0) {
        resultEl.textContent = '전체 값은 0이 될 수 없습니다';
        resultEl.classList.remove('highlight');
        return;
    }

    const result = (part / whole) * 100;
    resultEl.textContent = `${part}는 ${whole}의 ${formatNumber(result)}%`;
    resultEl.classList.add('highlight');
}

// 계산기 3: 증감률 계산
function calculate3() {
    const before = parseFloat(document.getElementById('calc3-before').value);
    const after = parseFloat(document.getElementById('calc3-after').value);
    const resultEl = document.getElementById('result3');

    if (isNaN(before) || isNaN(after)) {
        resultEl.textContent = '숫자를 입력하세요';
        resultEl.classList.remove('highlight');
        return;
    }

    if (before === 0) {
        resultEl.textContent = '이전 값은 0이 될 수 없습니다';
        resultEl.classList.remove('highlight');
        return;
    }

    const change = ((after - before) / before) * 100;
    const direction = change >= 0 ? '증가' : '감소';
    const emoji = change >= 0 ? '📈' : '📉';

    resultEl.textContent = `${emoji} ${Math.abs(formatNumber(change))}% ${direction}`;
    resultEl.classList.add('highlight');
}

// 계산기 4: 원래 값 역산
function calculate4() {
    const resultValue = parseFloat(document.getElementById('calc4-result').value);
    const percent = parseFloat(document.getElementById('calc4-percent').value);
    const resultEl = document.getElementById('result4');

    if (isNaN(resultValue) || isNaN(percent)) {
        resultEl.textContent = '숫자를 입력하세요';
        resultEl.classList.remove('highlight');
        return;
    }

    if (percent === 0) {
        resultEl.textContent = '퍼센트는 0이 될 수 없습니다';
        resultEl.classList.remove('highlight');
        return;
    }

    const original = resultValue / (percent / 100);
    resultEl.textContent = `원래 값 = ${formatNumber(original)}`;
    resultEl.classList.add('highlight');
}

// 숫자 포맷팅 (소수점 2자리까지, 불필요한 0 제거)
function formatNumber(num) {
    const rounded = Math.round(num * 100) / 100;
    return rounded.toLocaleString('ko-KR');
}

// Enter 키로 계산
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const target = e.target;
        if (target.id.startsWith('calc1')) calculate1();
        else if (target.id.startsWith('calc2')) calculate2();
        else if (target.id.startsWith('calc3')) calculate3();
        else if (target.id.startsWith('calc4')) calculate4();
    }
});
