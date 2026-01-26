// 환율 데이터 (2026년 1월 기준 참고값)
const exchangeRates = {
    KRW: 1,
    USD: 1350,    // 1 USD = 1350 KRW
    JPY: 9.2,     // 1 JPY = 9.2 KRW
    EUR: 1480,    // 1 EUR = 1480 KRW
    CNY: 186,     // 1 CNY = 186 KRW
    GBP: 1710     // 1 GBP = 1710 KRW
};

// 숫자 포맷팅
function formatNumber(num, decimals = 2) {
    return num.toLocaleString('ko-KR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
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

// 통화 교환
function swapCurrencies() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');

    const tempValue = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = tempValue;

    convertCurrency();
}

// 빠른 선택
function setQuickPair(from, to) {
    document.getElementById('fromCurrency').value = from;
    document.getElementById('toCurrency').value = to;
    convertCurrency();
}

// 환율 계산
function getExchangeRate(from, to) {
    // KRW를 기준으로 환율 계산
    const fromRate = exchangeRates[from];
    const toRate = exchangeRates[to];

    // from 통화 1단위당 to 통화 값
    return fromRate / toRate;
}

// 환전 계산
function convertCurrency() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const fromAmountInput = document.getElementById('fromAmount').value;
    const fromAmount = parseAmount(fromAmountInput);

    // 유효성 검사
    if (!fromAmount || fromAmount <= 0) {
        alert('올바른 금액을 입력해주세요.');
        return;
    }

    // 환율 계산
    const rate = getExchangeRate(fromCurrency, toCurrency);
    const toAmount = fromAmount * rate;

    // 결과 표시
    displayResults({
        fromCurrency,
        toCurrency,
        fromAmount,
        toAmount,
        rate
    });
}

// 결과 표시
function displayResults(result) {
    // 받는 통화 금액 표시
    document.getElementById('toAmount').value = formatNumber(result.toAmount);

    // 큰 결과 박스 업데이트
    document.getElementById('fromCurrencyCode').textContent = result.fromCurrency;
    document.getElementById('toCurrencyCode').textContent = result.toCurrency;
    document.getElementById('fromAmountDisplay').textContent = formatNumber(result.fromAmount);
    document.getElementById('toAmountDisplay').textContent = formatNumber(result.toAmount);

    // 환율 정보 표시
    const reverseRate = 1 / result.rate;
    document.getElementById('currentRate').textContent =
        `1 ${result.fromCurrency} = ${formatNumber(result.rate, 4)} ${result.toCurrency}`;
    document.getElementById('baseRate').textContent =
        `1 ${result.fromCurrency} = ${formatNumber(result.rate, 4)} ${result.toCurrency}`;
    document.getElementById('reverseRate').textContent =
        `1 ${result.toCurrency} = ${formatNumber(reverseRate, 4)} ${result.fromCurrency}`;

    // 환전 테이블 업데이트
    updateConversionTable(result);

    // 결과 섹션 스크롤
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 환전 테이블 업데이트
function updateConversionTable(result) {
    const tableAmounts = getTableAmounts(result.fromCurrency);

    // 테이블 헤더 업데이트
    document.getElementById('tableFromCurrency').textContent = result.fromCurrency;
    document.getElementById('tableToCurrency').textContent = result.toCurrency;

    // 테이블 바디 생성
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = tableAmounts.map(amount => {
        const converted = amount * result.rate;
        return `
            <tr>
                <td>${formatNumber(amount, 0)}</td>
                <td>${formatNumber(converted, 2)}</td>
            </tr>
        `;
    }).join('');
}

// 테이블에 표시할 금액 배열 생성
function getTableAmounts(currency) {
    if (currency === 'KRW') {
        return [10000, 50000, 100000, 500000, 1000000, 5000000];
    } else if (currency === 'JPY') {
        return [1000, 5000, 10000, 50000, 100000, 500000];
    } else {
        return [10, 50, 100, 500, 1000, 5000];
    }
}

// 페이지 로드 시 초기 계산
document.addEventListener('DOMContentLoaded', function() {
    // 금액 입력 필드에 콤마 자동 포맷 추가
    const fromAmountInput = document.getElementById('fromAmount');
    fromAmountInput.addEventListener('blur', function() {
        formatAmountInput(this);
    });

    // 초기 계산
    convertCurrency();

    // 입력값 변경 시 자동 계산
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');

    fromCurrencySelect.addEventListener('change', convertCurrency);
    toCurrencySelect.addEventListener('change', convertCurrency);
    fromAmountInput.addEventListener('input', debounce(convertCurrency, 500));
    fromAmountInput.addEventListener('change', convertCurrency);
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
