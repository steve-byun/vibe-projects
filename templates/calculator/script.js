// 숫자 포맷팅
function formatNumber(num) {
    return Math.round(num).toLocaleString('ko-KR');
}

// 콤마 제거하여 숫자로 변환
function parseAmount(value) {
    return parseFloat(value.replace(/,/g, ''));
}

// 대출 금액 입력 시 콤마 자동 추가
function formatAmountInput(input) {
    let value = input.value.replace(/,/g, '');
    if (value && !isNaN(value)) {
        input.value = parseFloat(value).toLocaleString('ko-KR');
    }
}

// 대출 계산 메인 함수
function calculateLoan() {
    // 입력값 가져오기
    const loanAmountInput = document.getElementById('loanAmount').value;
    const loanAmount = parseAmount(loanAmountInput);
    const annualRate = parseFloat(document.getElementById('interestRate').value);
    const loanPeriodYears = parseFloat(document.getElementById('loanPeriod').value);
    const loanPeriod = Math.round(loanPeriodYears * 12); // 년을 개월로 변환
    const repaymentType = document.getElementById('repaymentType').value;

    // 유효성 검사
    if (!loanAmount || !annualRate || !loanPeriodYears) {
        alert('모든 값을 입력해주세요.');
        return;
    }

    if (loanAmount <= 0 || annualRate < 0 || loanPeriodYears <= 0) {
        alert('올바른 값을 입력해주세요.');
        return;
    }

    // 월 이자율
    const monthlyRate = annualRate / 100 / 12;

    let result;
    switch (repaymentType) {
        case 'equal':
            result = calculateEqualPayment(loanAmount, monthlyRate, loanPeriod);
            break;
        case 'principal':
            result = calculateEqualPrincipal(loanAmount, monthlyRate, loanPeriod);
            break;
        case 'maturity':
            result = calculateMaturityPayment(loanAmount, monthlyRate, loanPeriod);
            break;
    }

    // 결과 표시
    displayResults(result);
}

// 원리금균등상환 계산
function calculateEqualPayment(principal, monthlyRate, months) {
    // 월 상환액 = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
                          (Math.pow(1 + monthlyRate, months) - 1);

    let balance = principal;
    const schedule = [];
    let totalInterest = 0;

    for (let month = 1; month <= months; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;
        totalInterest += interestPayment;

        if (month <= 12) {
            schedule.push({
                month,
                payment: monthlyPayment,
                principal: principalPayment,
                interest: interestPayment,
                balance: Math.max(0, balance)
            });
        }
    }

    return {
        monthlyPayment,
        totalPayment: monthlyPayment * months,
        totalInterest,
        principal,
        schedule
    };
}

// 원금균등상환 계산
function calculateEqualPrincipal(principal, monthlyRate, months) {
    const principalPayment = principal / months;
    let balance = principal;
    const schedule = [];
    let totalPayment = 0;
    let totalInterest = 0;
    let firstMonthPayment = 0;

    for (let month = 1; month <= months; month++) {
        const interestPayment = balance * monthlyRate;
        const monthlyPayment = principalPayment + interestPayment;
        balance -= principalPayment;
        totalPayment += monthlyPayment;
        totalInterest += interestPayment;

        if (month === 1) {
            firstMonthPayment = monthlyPayment;
        }

        if (month <= 12) {
            schedule.push({
                month,
                payment: monthlyPayment,
                principal: principalPayment,
                interest: interestPayment,
                balance: Math.max(0, balance)
            });
        }
    }

    return {
        monthlyPayment: firstMonthPayment, // 첫 달 상환액
        totalPayment,
        totalInterest,
        principal,
        schedule
    };
}

// 만기일시상환 계산
function calculateMaturityPayment(principal, monthlyRate, months) {
    const monthlyInterest = principal * monthlyRate;
    const schedule = [];
    let totalInterest = 0;

    for (let month = 1; month <= months; month++) {
        totalInterest += monthlyInterest;

        if (month <= 12) {
            const isLastMonth = month === months;
            schedule.push({
                month,
                payment: isLastMonth ? principal + monthlyInterest : monthlyInterest,
                principal: isLastMonth ? principal : 0,
                interest: monthlyInterest,
                balance: isLastMonth ? 0 : principal
            });
        }
    }

    return {
        monthlyPayment: monthlyInterest,
        totalPayment: principal + totalInterest,
        totalInterest,
        principal,
        schedule
    };
}

// 결과 표시
function displayResults(result) {
    // 요약 결과
    document.getElementById('monthlyPayment').textContent =
        formatNumber(result.monthlyPayment) + '원';
    document.getElementById('totalPayment').textContent =
        formatNumber(result.totalPayment) + '원';
    document.getElementById('totalInterest').textContent =
        formatNumber(result.totalInterest) + '원';

    // 차트 업데이트
    const principalPercent = (result.principal / result.totalPayment * 100).toFixed(1);
    const interestPercent = (result.totalInterest / result.totalPayment * 100).toFixed(1);

    document.getElementById('principalBar').style.width = principalPercent + '%';
    document.getElementById('interestBar').style.width = interestPercent + '%';
    document.getElementById('principalPercent').textContent = principalPercent + '%';
    document.getElementById('interestPercent').textContent = interestPercent + '%';

    // 스케줄 테이블
    displaySchedule(result.schedule);

    // 결과 섹션 스크롤
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 스케줄 테이블 표시
function displaySchedule(schedule) {
    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>회차</th>
                    <th>월 상환액</th>
                    <th>원금</th>
                    <th>이자</th>
                    <th>잔액</th>
                </tr>
            </thead>
            <tbody>
                ${schedule.map(row => `
                    <tr>
                        <td>${row.month}개월</td>
                        <td>${formatNumber(row.payment)}원</td>
                        <td>${formatNumber(row.principal)}원</td>
                        <td>${formatNumber(row.interest)}원</td>
                        <td>${formatNumber(row.balance)}원</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    document.getElementById('scheduleTable').innerHTML = tableHTML;
}

// 페이지 로드 시 초기 계산
document.addEventListener('DOMContentLoaded', function() {
    // 대출 금액 입력 필드에 콤마 자동 포맷 추가
    const loanAmountInput = document.getElementById('loanAmount');
    loanAmountInput.addEventListener('blur', function() {
        formatAmountInput(this);
    });

    // 초기 계산
    calculateLoan();

    // 입력값 변경 시 자동 계산
    const inputs = ['loanAmount', 'interestRate', 'loanPeriod', 'repaymentType'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        element.addEventListener('change', calculateLoan);
        if (element.tagName === 'INPUT' && id !== 'loanAmount') {
            element.addEventListener('input', debounce(calculateLoan, 500));
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
