// BMI 계산 메인 함수
function calculateBMI() {
    // 입력값 가져오기
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    // 유효성 검사
    if (!height || !weight) {
        alert('키와 몸무게를 모두 입력해주세요.');
        return;
    }

    if (height <= 0 || weight <= 0) {
        alert('올바른 값을 입력해주세요.');
        return;
    }

    // BMI 계산 (체중(kg) / (키(m) * 키(m)))
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    // 표준 체중 계산 (키(m) * 키(m) * 22)
    const standardWeight = heightInMeters * heightInMeters * 22;

    // 적정 체중 범위 계산 (BMI 18.5~24.9)
    const minHealthyWeight = heightInMeters * heightInMeters * 18.5;
    const maxHealthyWeight = heightInMeters * heightInMeters * 24.9;

    // BMI 상태 판정
    const status = getBMIStatus(bmi);

    // 결과 표시
    displayResults(bmi, status, standardWeight, weight, minHealthyWeight, maxHealthyWeight);
}

// BMI 상태 판정
function getBMIStatus(bmi) {
    if (bmi < 18.5) {
        return {
            text: '저체중',
            class: 'underweight',
            advice: '체중이 정상보다 낮습니다. 균형 잡힌 영양 섭취와 근력 운동을 통해 건강한 체중 증가를 권장합니다.'
        };
    } else if (bmi < 25) {
        return {
            text: '정상',
            class: 'normal',
            advice: '이상적인 체중입니다! 현재의 건강한 생활 습관을 유지하시고, 규칙적인 운동과 균형 잡힌 식단을 계속하세요.'
        };
    } else if (bmi < 30) {
        return {
            text: '과체중',
            class: 'overweight',
            advice: '체중이 다소 높습니다. 규칙적인 유산소 운동(주 3-5회)과 식단 조절을 통해 체중 관리를 시작하시는 것을 권장합니다.'
        };
    } else {
        return {
            text: '비만',
            class: 'obese',
            advice: '건강에 주의가 필요합니다. 전문가(의사, 영양사)와 상담하여 체계적인 체중 관리 계획을 세우시는 것을 강력히 권장합니다.'
        };
    }
}

// 결과 표시
function displayResults(bmi, status, standardWeight, currentWeight, minHealthyWeight, maxHealthyWeight) {
    // BMI 값 표시
    document.getElementById('bmiValue').textContent = bmi.toFixed(1);
    document.getElementById('bmiStatus').textContent = status.text;

    // BMI 차트 인디케이터 위치 계산
    const indicator = document.getElementById('indicator');
    let position;

    if (bmi < 18.5) {
        // 저체중: 0-25% 범위
        position = (bmi / 18.5) * 25;
    } else if (bmi < 25) {
        // 정상: 25-50% 범위
        position = 25 + ((bmi - 18.5) / (25 - 18.5)) * 25;
    } else if (bmi < 30) {
        // 과체중: 50-75% 범위
        position = 50 + ((bmi - 25) / (30 - 25)) * 25;
    } else {
        // 비만: 75-100% 범위
        position = 75 + Math.min(((bmi - 30) / 10) * 25, 25);
    }

    indicator.style.left = position + '%';

    // 표준 체중 표시
    document.getElementById('standardWeight').textContent = standardWeight.toFixed(1) + 'kg';

    // 체중 차이 계산
    const weightDiff = currentWeight - standardWeight;
    const weightDiffText = weightDiff > 0
        ? `+${weightDiff.toFixed(1)}kg (표준보다 높음)`
        : `${weightDiff.toFixed(1)}kg (표준보다 낮음)`;
    document.getElementById('weightDiff').textContent = weightDiffText;

    // 적정 체중 범위 표시
    document.getElementById('healthyRange').textContent =
        `${minHealthyWeight.toFixed(1)}kg ~ ${maxHealthyWeight.toFixed(1)}kg`;

    // 건강 조언 표시
    document.getElementById('adviceText').textContent = status.advice;

    // BMI 차트 바 하이라이트
    const allBars = document.querySelectorAll('.bmi-bar');
    allBars.forEach(bar => bar.classList.remove('active'));

    const activeBar = document.querySelector(`.bmi-bar.${status.class}`);
    if (activeBar) {
        activeBar.classList.add('active');
    }

    // 결과 섹션 스크롤
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 페이지 로드 시 초기 계산
document.addEventListener('DOMContentLoaded', function() {
    // 초기 계산
    calculateBMI();

    // 입력값 변경 시 자동 계산
    const inputs = ['height', 'weight'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        element.addEventListener('input', debounce(calculateBMI, 500));
        element.addEventListener('change', calculateBMI);
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
