/**
 * Google AdSense 설정 파일
 *
 * 사용법:
 * 1. Google AdSense 계정에서 사이트 승인 받기
 * 2. 광고 단위 생성하기
 * 3. 아래 설정값 업데이트하기
 * 4. index.html에 스크립트 추가하기
 */

const ADSENSE_CONFIG = {
    // Google AdSense 클라이언트 ID (ca-pub-XXXXXXXXXXXXXXXX)
    clientId: 'ca-pub-XXXXXXXXXXXXXXXX',

    // 광고 슬롯 ID들
    slots: {
        topBanner: '1234567890',      // 상단 배너 광고
        bottomBanner: '0987654321',   // 하단 배너 광고
        sidebar: '1122334455'         // 사이드바 광고 (필요시)
    },

    // 광고 설정
    settings: {
        enableAutoAds: true,          // 자동 광고 활성화
        enableAdBlock: false,         // 광고 차단 감지 (선택사항)
        testMode: true                // 테스트 모드 (배포시 false로 변경)
    }
};

/**
 * AdSense 스크립트를 동적으로 로드
 */
function loadAdSense() {
    if (ADSENSE_CONFIG.settings.testMode) {
        console.log('🧪 AdSense 테스트 모드 - 실제 광고가 표시되지 않습니다');
        return;
    }

    // AdSense 메인 스크립트
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.clientId}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    // 자동 광고 활성화
    if (ADSENSE_CONFIG.settings.enableAutoAds) {
        script.onload = function() {
            (adsbygoogle = window.adsbygoogle || []).push({});
        };
    }
}

/**
 * 광고 단위 삽입
 */
function insertAd(containerId, slotId, format = 'auto') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (ADSENSE_CONFIG.settings.testMode) {
        container.innerHTML = `
            <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px;">
                <p>📢 광고 테스트 영역</p>
                <p style="font-size: 0.8em; color: #666;">Slot ID: ${slotId}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${ADSENSE_CONFIG.clientId}"
             data-ad-slot="${slotId}"
             data-ad-format="${format}"
             data-full-width-responsive="true"></ins>
    `;

    (adsbygoogle = window.adsbygoogle || []).push({});
}

/**
 * 모든 광고 초기화
 */
function initializeAds() {
    loadAdSense();

    // 각 광고 영역에 광고 삽입
    setTimeout(() => {
        insertAd('top-ad', ADSENSE_CONFIG.slots.topBanner, 'horizontal');
        insertAd('bottom-ad', ADSENSE_CONFIG.slots.bottomBanner, 'horizontal');
    }, 1000);
}

// 페이지 로드 시 광고 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAds);
} else {
    initializeAds();
}

/**
 * 광고 차단 감지 (선택사항)
 */
function detectAdBlock() {
    if (!ADSENSE_CONFIG.settings.enableAdBlock) return;

    setTimeout(() => {
        const adElement = document.querySelector('.adsbygoogle');
        if (adElement && adElement.innerHTML.length === 0) {
            console.log('⚠️ 광고 차단기가 감지되었습니다');
            // 여기에 광고 차단 알림 로직 추가 가능
        }
    }, 3000);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ADSENSE_CONFIG, initializeAds };
}
