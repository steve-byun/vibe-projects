// 숫자 포맷팅
function formatNumber(num) {
    return Math.round(num).toLocaleString('ko-KR');
}

// 콤마 제거하여 숫자로 변환
function parseAmount(value) {
    return parseFloat(value.replace(/,/g, ''));
}

// 금액 입력 시 콤마 자동 추가
function formatAmountInput(input) {
    let value = input.value.replace(/,/g, '');
    if (value && !isNaN(value)) {
        input.value = parseFloat(value).toLocaleString('ko-KR');
    }
}

// 팁 퍼센트 설정
function setTipPercent(percent) {
    document.getElementById('tipPercent').value = percent;
    calculateTip();
}

// 팁 계산 메인 함수
function calculateTip() {
    // 입력값 가져오기
    const billAmountInput = document.getElementById('billAmount').value;
    const billAmount = parseAmount(billAmountInput);
    const tipPercent = parseFloat(document.getElementById('tipPercent').value);
    const peopleCount = parseInt(document.getElementById('peopleCount').value);

    // 유효성 검사
    if (!billAmount || !tipPercent === undefined || !peopleCount) {
        alert('모든 값을 입력해주세요.');
        return;
    }

    if (billAmount <= 0 || tipPercent < 0 || peopleCount <= 0) {
        alert('올바른 값을 입력해주세요.');
        return;
    }

    // 팁 금액 계산
    const tipAmount = billAmount * (tipPercent / 100);
    const totalAmount = billAmount + tipAmount;
    const perPersonAmount = totalAmount / peopleCount;
    const perPersonBill = billAmount / peopleCount;
    const perPersonTip = tipAmount / peopleCount;

    // 결과 표시
    displayResults({
        tipAmount,
        totalAmount,
        perPersonAmount,
        perPersonBill,
        perPersonTip,
        billAmount,
        tipPercent
    });
}

// 결과 표시
function displayResults(result) {
    // 요약 결과
    document.getElementById('tipAmount').textContent = formatNumber(result.tipAmount) + '원';
    document.getElementById('totalAmount').textContent = formatNumber(result.totalAmount) + '원';
    document.getElementById('perPersonAmount').textContent = formatNumber(result.perPersonAmount) + '원';

    // 상세 분할
    document.getElementById('perPersonBill').textContent = formatNumber(result.perPersonBill) + '원';
    document.getElementById('perPersonTip').textContent = formatNumber(result.perPersonTip) + '원';
    document.getElementById('perPersonTotal').textContent = formatNumber(result.perPersonAmount) + '원';

    // 차트 업데이트
    const billPercent = (result.billAmount / result.totalAmount * 100).toFixed(1);
    const tipPercentDisplay = (result.tipAmount / result.totalAmount * 100).toFixed(1);

    document.getElementById('billBar').style.width = billPercent + '%';
    document.getElementById('tipBar').style.width = tipPercentDisplay + '%';
    document.getElementById('billPercent').textContent = billPercent + '%';
    document.getElementById('tipPercent').textContent = tipPercentDisplay + '%';

    // 결과 섹션 스크롤
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 페이지 로드 시 초기 계산
document.addEventListener('DOMContentLoaded', function() {
    // 계산서 금액 입력 필드에 콤마 자동 포맷 추가
    const billAmountInput = document.getElementById('billAmount');
    billAmountInput.addEventListener('blur', function() {
        formatAmountInput(this);
    });

    // 초기 계산
    calculateTip();

    // 입력값 변경 시 자동 계산
    const inputs = ['billAmount', 'tipPercent', 'peopleCount'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        element.addEventListener('change', calculateTip);
        if (element.tagName === 'INPUT' && id !== 'billAmount') {
            element.addEventListener('input', debounce(calculateTip, 500));
        }
    });
});

// 디바운스 함수 (입력 중 너무 자주 계산하지 않도록)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
