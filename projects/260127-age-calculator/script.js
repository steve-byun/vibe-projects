// 띠 (12지신) 데이터 - 쥐부터 시작 (년도 - 4) % 12 공식 사용
const zodiacAnimals = [
    { name: '쥐', emoji: '🐭' },      // 0: 1984, 1996, 2008, 2020
    { name: '소', emoji: '🐮' },      // 1: 1985, 1997, 2009, 2021
    { name: '호랑이', emoji: '🐯' },  // 2: 1986, 1998, 2010, 2022
    { name: '토끼', emoji: '🐰' },    // 3: 1987, 1999, 2011, 2023
    { name: '용', emoji: '🐲' },      // 4: 1988, 2000, 2012, 2024
    { name: '뱀', emoji: '🐍' },      // 5: 1989, 2001, 2013, 2025
    { name: '말', emoji: '🐴' },      // 6: 1990, 2002, 2014, 2026
    { name: '양', emoji: '🐑' },      // 7: 1991, 2003, 2015, 2027
    { name: '원숭이', emoji: '🐵' },  // 8: 1992, 2004, 2016, 2028
    { name: '닭', emoji: '🐔' },      // 9: 1993, 2005, 2017, 2029
    { name: '개', emoji: '🐕' },      // 10: 1994, 2006, 2018, 2030
    { name: '돼지', emoji: '🐷' }     // 11: 1995, 2007, 2019, 2031
];

// 별자리 데이터
const zodiacSigns = [
    { name: '물병자리', emoji: '♒', start: [1, 20], end: [2, 18] },
    { name: '물고기자리', emoji: '♓', start: [2, 19], end: [3, 20] },
    { name: '양자리', emoji: '♈', start: [3, 21], end: [4, 19] },
    { name: '황소자리', emoji: '♉', start: [4, 20], end: [5, 20] },
    { name: '쌍둥이자리', emoji: '♊', start: [5, 21], end: [6, 21] },
    { name: '게자리', emoji: '♋', start: [6, 22], end: [7, 22] },
    { name: '사자자리', emoji: '♌', start: [7, 23], end: [8, 22] },
    { name: '처녀자리', emoji: '♍', start: [8, 23], end: [9, 22] },
    { name: '천칭자리', emoji: '♎', start: [9, 23], end: [10, 22] },
    { name: '전갈자리', emoji: '♏', start: [10, 23], end: [11, 21] },
    { name: '사수자리', emoji: '♐', start: [11, 22], end: [12, 21] },
    { name: '염소자리', emoji: '♑', start: [12, 22], end: [1, 19] }
];

// 요일 이름
const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

// 페이지 로드 시 날짜 입력 최대값 설정
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('birthdate').max = today;
});

// 나이 계산 함수
function calculateAge() {
    const birthdateInput = document.getElementById('birthdate').value;

    if (!birthdateInput) {
        alert('생년월일을 입력해주세요.');
        return;
    }

    const birthdate = new Date(birthdateInput);
    const today = new Date();

    // 만 나이 계산
    let internationalAge = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
        internationalAge--;
    }

    // 한국 나이 계산 (태어난 해를 1살로)
    const koreanAge = today.getFullYear() - birthdate.getFullYear() + 1;

    // 연 나이 계산
    const yearAge = today.getFullYear() - birthdate.getFullYear();

    // 띠 계산
    const birthYear = birthdate.getFullYear();
    const zodiacIndex = (birthYear - 4) % 12;
    const zodiac = zodiacAnimals[zodiacIndex];

    // 별자리 계산
    const zodiacSign = getZodiacSign(birthdate.getMonth() + 1, birthdate.getDate());

    // 태어난 지 며칠
    const daysLived = Math.floor((today - birthdate) / (1000 * 60 * 60 * 24));

    // 다음 생일까지
    let nextBirthday = new Date(today.getFullYear(), birthdate.getMonth(), birthdate.getDate());
    if (nextBirthday <= today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysToBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

    // 태어난 요일
    const birthDay = dayNames[birthdate.getDay()];

    // 결과 표시
    document.getElementById('international-age').textContent = internationalAge;
    document.getElementById('korean-age').textContent = koreanAge;
    document.getElementById('year-age').textContent = yearAge;
    document.getElementById('zodiac-emoji').textContent = zodiac.emoji;
    document.getElementById('zodiac-name').textContent = zodiac.name + '띠';
    document.getElementById('days-lived').textContent = daysLived.toLocaleString() + '일';
    document.getElementById('days-to-birthday').textContent = daysToBirthday + '일';
    document.getElementById('birth-day').textContent = birthDay;
    document.getElementById('zodiac-sign').textContent = zodiacSign.emoji + ' ' + zodiacSign.name;

    // 결과 섹션 표시
    document.getElementById('result').style.display = 'block';

    // 결과로 스크롤
    document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 별자리 계산 함수
function getZodiacSign(month, day) {
    for (const sign of zodiacSigns) {
        const [startMonth, startDay] = sign.start;
        const [endMonth, endDay] = sign.end;

        if (startMonth === endMonth) {
            if (month === startMonth && day >= startDay && day <= endDay) {
                return sign;
            }
        } else if (startMonth < endMonth) {
            if ((month === startMonth && day >= startDay) ||
                (month === endMonth && day <= endDay)) {
                return sign;
            }
        } else {
            // 염소자리 (12월 ~ 1월)
            if ((month === startMonth && day >= startDay) ||
                (month === endMonth && day <= endDay)) {
                return sign;
            }
        }
    }
    return zodiacSigns[0]; // 기본값
}

// Enter 키로 계산
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculateAge();
    }
});
