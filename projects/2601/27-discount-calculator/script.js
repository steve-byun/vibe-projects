// 모드 전환
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // 탭 버튼 활성화
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // 모드 전환
        const mode = this.dataset.mode;
        document.querySelectorAll('.calc-mode').forEach(m => m.classList.add('hidden'));
        document.getElementById(mode + 'Mode').classList.remove('hidden');
    });
});

// 빠른 할인율 버튼
document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('discountRate').value = this.dataset.rate;
        calculateDiscount();
    });
});

// 숫자 포맷팅 (천 단위 콤마)
function formatNumber(num) {
    return num.toLocaleString('ko-KR');
}

// 할인가 계산
function calculateDiscount() {
    const originalPrice = parseFloat(document.getElementById('originalPrice').value) || 0;
    const discountRate = parseFloat(document.getElementById('discountRate').value) || 0;

    if (originalPrice <= 0) {
        alert('원래 가격을 입력해주세요.');
        return;
    }

    if (discountRate < 0 || discountRate > 100) {
        alert('할인율은 0~100% 사이로 입력해주세요.');
        return;
    }

    const savings = originalPrice * (discountRate / 100);
    const finalPrice = originalPrice - savings;

    // 결과 표시
    document.getElementById('finalPrice').textContent = formatNumber(Math.round(finalPrice)) + '원';
    document.getElementById('savingsAmount').textContent = formatNumber(Math.round(savings)) + '원 절약';

    // 가격 바 업데이트
    const fillPercent = (finalPrice / originalPrice) * 100;
    document.getElementById('priceBarFill').style.width = fillPercent + '%';
    document.getElementById('priceBarMax').textContent = formatNumber(originalPrice) + '원';

    // 결과 애니메이션
    animateResult('discountResult');
}

// 할인율 계산
function calculateRate() {
    const originalPrice = parseFloat(document.getElementById('originalPrice2').value) || 0;
    const salePrice = parseFloat(document.getElementById('salePrice').value) || 0;

    if (originalPrice <= 0) {
        alert('원래 가격을 입력해주세요.');
        return;
    }

    if (salePrice < 0) {
        alert('세일 가격을 올바르게 입력해주세요.');
        return;
    }

    if (salePrice > originalPrice) {
        alert('세일 가격이 원래 가격보다 높습니다.');
        return;
    }

    const savings = originalPrice - salePrice;
    const discountRate = (savings / originalPrice) * 100;

    // 결과 표시
    document.getElementById('calculatedRate').textContent = discountRate.toFixed(1) + '%';
    document.getElementById('savingsAmount2').textContent = formatNumber(Math.round(savings)) + '원 절약';

    // 결과 애니메이션
    animateResult('rateResult');
}

// 결과 애니메이션
function animateResult(sectionId) {
    const section = document.getElementById(sectionId);
    section.style.transform = 'scale(1.02)';
    setTimeout(() => {
        section.style.transform = 'scale(1)';
    }, 200);
}

// 입력값 변경 시 자동 계산 (선택적)
document.getElementById('originalPrice').addEventListener('input', calculateDiscount);
document.getElementById('discountRate').addEventListener('input', calculateDiscount);
document.getElementById('originalPrice2').addEventListener('input', calculateRate);
document.getElementById('salePrice').addEventListener('input', calculateRate);

// 페이지 로드 시 초기 계산
document.addEventListener('DOMContentLoaded', function() {
    calculateDiscount();
    calculateRate();
});
