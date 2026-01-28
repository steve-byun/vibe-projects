// Google AdSense 설정
const adsenseConfig = {
    // AdSense 클라이언트 ID
    clientId: 'ca-pub-4976487856728705',

    // 광고 슬롯 ID (AdSense에서 생성 후 입력)
    slots: {
        top: '',      // 상단 광고 슬롯
        bottom: '',   // 하단 광고 슬롯
    },

    // 테스트 모드 (배포 시 false로 변경)
    testMode: true
};

// 광고 초기화 함수
function initAds() {
    if (adsenseConfig.testMode) {
        console.log('AdSense: 테스트 모드');
        return;
    }

    // 실제 광고 코드 삽입 로직
    // AdSense 승인 후 구현
}

// 페이지 로드 시 광고 초기화
document.addEventListener('DOMContentLoaded', initAds);
