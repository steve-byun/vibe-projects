// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 기본 날짜 설정 (오늘 + 100일)
    const today = new Date();
    const defaultDate = new Date(today);
    defaultDate.setDate(defaultDate.getDate() + 100);
    document.getElementById('targetDate').value = formatDateForInput(defaultDate);

    // 저장된 D-day 로드
    loadSavedDdays();

    // 초기 계산
    calculateDday();
});

// 날짜 포맷 (input용)
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 날짜 포맷 (표시용)
function formatDateForDisplay(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

// 빠른 설정 버튼
document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const days = parseInt(this.dataset.days);
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);
        document.getElementById('targetDate').value = formatDateForInput(targetDate);
        calculateDday();
    });
});

// D-day 계산
function calculateDday() {
    const targetDateInput = document.getElementById('targetDate').value;
    const eventName = document.getElementById('eventName').value || '목표일';

    if (!targetDateInput) {
        alert('목표 날짜를 선택해주세요.');
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(targetDateInput);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 이벤트 이름 표시
    document.getElementById('eventTitle').textContent = eventName;

    // D-day 배지
    const ddayBadge = document.getElementById('ddayBadge');
    ddayBadge.classList.remove('past', 'today');

    if (diffDays > 0) {
        ddayBadge.textContent = `D-${diffDays}`;
    } else if (diffDays === 0) {
        ddayBadge.textContent = 'D-Day!';
        ddayBadge.classList.add('today');
    } else {
        ddayBadge.textContent = `D+${Math.abs(diffDays)}`;
        ddayBadge.classList.add('past');
    }

    // 목표 날짜 표시
    document.getElementById('targetDateDisplay').textContent = formatDateForDisplay(targetDate);

    // 상세 시간
    const absDays = Math.abs(diffDays);
    document.getElementById('totalDays').textContent = absDays;
    document.getElementById('totalWeeks').textContent = Math.floor(absDays / 7);
    document.getElementById('totalMonths').textContent = Math.floor(absDays / 30);
    document.getElementById('totalHours').textContent = (absDays * 24).toLocaleString();

    // 진행 바 (100일 기준)
    const progress = Math.max(0, Math.min(100, 100 - (diffDays / 100 * 100)));
    document.getElementById('progressFill').style.width = progress + '%';

    // 진행 텍스트
    const progressText = document.getElementById('progressText');
    if (diffDays > 0) {
        progressText.textContent = `${eventName}까지 ${diffDays}일 남았습니다`;
    } else if (diffDays === 0) {
        progressText.textContent = `오늘이 ${eventName}입니다!`;
    } else {
        progressText.textContent = `${eventName}로부터 ${Math.abs(diffDays)}일 지났습니다`;
    }

    // 결과 애니메이션
    const resultSection = document.getElementById('resultSection');
    resultSection.style.transform = 'scale(1.02)';
    setTimeout(() => {
        resultSection.style.transform = 'scale(1)';
    }, 200);

    // 로컬 스토리지에 저장
    saveDday(eventName, targetDateInput, diffDays);
}

// D-day 저장
function saveDday(name, date, dday) {
    let savedDdays = JSON.parse(localStorage.getItem('ddays') || '[]');

    // 같은 이름이 있으면 업데이트
    const existingIndex = savedDdays.findIndex(d => d.name === name);
    if (existingIndex >= 0) {
        savedDdays[existingIndex] = { name, date, dday };
    } else {
        savedDdays.push({ name, date, dday });
    }

    // 최대 10개만 저장
    if (savedDdays.length > 10) {
        savedDdays = savedDdays.slice(-10);
    }

    localStorage.setItem('ddays', JSON.stringify(savedDdays));
    loadSavedDdays();
}

// 저장된 D-day 로드
function loadSavedDdays() {
    const savedDdays = JSON.parse(localStorage.getItem('ddays') || '[]');
    const savedList = document.getElementById('savedList');

    if (savedDdays.length === 0) {
        savedList.innerHTML = '<p class="empty-message">저장된 D-day가 없습니다</p>';
        return;
    }

    // 오늘 기준으로 D-day 재계산
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    savedList.innerHTML = savedDdays.map((item, index) => {
        const targetDate = new Date(item.date);
        targetDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

        let ddayText;
        if (diffDays > 0) {
            ddayText = `D-${diffDays}`;
        } else if (diffDays === 0) {
            ddayText = 'D-Day!';
        } else {
            ddayText = `D+${Math.abs(diffDays)}`;
        }

        return `
            <div class="saved-item">
                <span class="event-name">${item.name}</span>
                <span class="event-dday">${ddayText}</span>
                <button class="delete-btn" onclick="deleteDday(${index})">×</button>
            </div>
        `;
    }).join('');
}

// D-day 삭제
function deleteDday(index) {
    let savedDdays = JSON.parse(localStorage.getItem('ddays') || '[]');
    savedDdays.splice(index, 1);
    localStorage.setItem('ddays', JSON.stringify(savedDdays));
    loadSavedDdays();
}

// 입력값 변경 시 자동 계산
document.getElementById('targetDate').addEventListener('change', calculateDday);
document.getElementById('eventName').addEventListener('input', function() {
    document.getElementById('eventTitle').textContent = this.value || '목표일';
});
