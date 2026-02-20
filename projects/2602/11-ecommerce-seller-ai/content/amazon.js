/**
 * ListingPro AI - Amazon Content Script
 *
 * Amazon 상품 페이지에서 리스팅 데이터를 추출하고
 * 플로팅 버튼을 통해 AI 최적화를 트리거합니다.
 *
 * 대상 URL: https://www.amazon.*/dp/*, https://www.amazon.*/*/dp/*, etc.
 * 의존성: constants.js, shared.js (먼저 로드됨)
 */

(function () {
  'use strict';

  /**
   * Amazon 상품 페이지에서 ListingData 추출
   * @returns {Object} ListingData
   */
  function extractAmazonListing() {
    // Title
    const title = extractText('#productTitle');

    // Bullet Points
    const bulletPoints = extractAllText('#feature-bullets li .a-list-item');
    // 필터: "Make sure this fits" 등 시스템 텍스트 제거
    const filteredBullets = bulletPoints.filter(
      bp => !bp.startsWith('Make sure this fits') &&
            !bp.startsWith('›') &&
            bp.length > 5
    );

    // Description - productDescription 또는 A+ Content
    let description = extractText('#productDescription .content') ||
      extractText('#productDescription p') ||
      extractText('#productDescription');

    // A+ Content 보조 (description이 비어있는 경우)
    if (!description) {
      const aplusTexts = extractAllText('#aplus .aplus-module-wrapper');
      if (aplusTexts.length > 0) {
        description = aplusTexts.join('\n');
      }
    }
    // 여전히 비어있으면 bookDescription 시도
    if (!description) {
      description = extractText('#bookDescription_feature_div .a-text-bold') ||
        extractText('#bookDescription_feature_div');
    }

    // Price
    const priceWhole = extractText('.a-price-whole');
    const priceFraction = extractText('.a-price-fraction');
    let price = '';
    if (priceWhole) {
      price = '$' + priceWhole.replace(/[^\d.]/, '') + (priceFraction || '00');
    }
    if (!price) {
      price = extractText('#priceblock_ourprice') ||
        extractText('#priceblock_dealprice') ||
        extractText('.a-price .a-offscreen');
    }

    // Currency
    const currencySymbol = extractText('.a-price-symbol');
    let currency = 'USD';
    if (currencySymbol === '€') currency = 'EUR';
    else if (currencySymbol === '£') currency = 'GBP';
    else if (currencySymbol === '¥') currency = 'JPY';

    // Brand / Seller
    const shopName =
      extractText('#bylineInfo') ||
      extractText('#sellerProfileTriggerId') ||
      extractText('.a-link-normal[href*="/stores/"]');

    // Images
    const images = [];
    // 메인 이미지
    const mainImg = document.querySelector('#landingImage, #imgBlkFront, #ebooksImgBlkFront');
    if (mainImg) {
      // data-a-dynamic-image에 JSON으로 이미지 URL들이 있음
      const dynamicData = mainImg.getAttribute('data-a-dynamic-image');
      if (dynamicData) {
        try {
          const imgObj = JSON.parse(dynamicData);
          // 가장 큰 이미지 URL 선택
          const urls = Object.keys(imgObj);
          images.push(...urls);
        } catch (e) {
          // fallback to src
          if (mainImg.src) images.push(mainImg.src);
        }
      } else if (mainImg.src) {
        images.push(mainImg.src);
      }
    }
    // 썸네일 이미지들
    const thumbs = document.querySelectorAll('#altImages .a-button-thumbnail img');
    thumbs.forEach(img => {
      // 썸네일 URL을 풀사이즈로 변환
      let src = img.src || '';
      if (src) {
        // Amazon 이미지 URL 패턴: ._SX38_SY50_ → 제거하면 풀사이즈
        src = src.replace(/\._[A-Z0-9_,]+_\./, '.');
        images.push(src);
      }
    });
    const uniqueImages = [...new Set(images)].filter(u => u.startsWith('http'));

    // Category breadcrumbs
    const category = extractAllText(
      '#wayfinding-breadcrumbs_feature_div li a, ' +
      '.a-breadcrumb li a'
    ).join(' > ');

    // Rating
    const ratingText =
      extractText('#acrPopover .a-icon-alt') ||
      extractText('.a-icon-alt');
    const ratingMatch = ratingText.match(/([\d.]+)/);
    const rating = ratingMatch ? ratingMatch[1] : '';

    // Review count
    const reviewCountText = extractText('#acrCustomerReviewText');
    const reviewMatch = reviewCountText.match(/([\d,]+)/);
    const reviewCount = reviewMatch ? parseInt(reviewMatch[1].replace(/,/g, ''), 10) : 0;

    return {
      platform: PLATFORMS.AMAZON,
      title,
      description,
      tags: [], // Amazon은 백엔드 키워드라 페이지에서 추출 불가
      bulletPoints: filteredBullets,
      price,
      currency,
      category,
      images: uniqueImages,
      url: window.location.href,
      shopName,
      rating,
      reviewCount,
    };
  }

  /**
   * 플로팅 버튼 클릭 핸들러 — 추출 후 background로 전송
   */
  async function handleOptimizeClick() {
    showLoading();

    try {
      const listingData = extractAmazonListing();

      if (!listingData.title) {
        hideLoading();
        showError('Could not extract listing data. Please make sure you are on a product page.');
        return;
      }

      const response = await sendToBackground(MSG.OPTIMIZE_LISTING, listingData);

      if (response && response.error) {
        hideLoading();
        showError(response.error);
      }
      // 성공 시 background가 OPTIMIZED_LISTING 메시지를 보내면
      // shared.js의 리스너가 showResultOverlay를 호출
    } catch (err) {
      hideLoading();
      showError(err.message || 'Failed to connect to background service.');
    }
  }

  /**
   * 현재 페이지가 Amazon 상품 페이지인지 판별
   * @returns {boolean}
   */
  function isProductPage() {
    return !!(
      document.querySelector('#productTitle') ||
      document.querySelector('#dp-container') ||
      document.querySelector('#ppd') ||
      window.location.pathname.includes('/dp/')
    );
  }

  // ============================================================
  // 초기화 + SPA 네비게이션 대응
  // ============================================================

  let _lastUrl = '';

  function tryInit() {
    const currentUrl = window.location.href;
    // 같은 URL이면 중복 실행 방지
    if (currentUrl === _lastUrl) return;
    _lastUrl = currentUrl;

    if (!isProductPage()) return;

    createFloatingButton(handleOptimizeClick);
  }

  // 최초 실행
  tryInit();

  // SPA 네비게이션 감지: popstate (뒤로가기/앞으로가기)
  window.addEventListener('popstate', () => {
    setTimeout(tryInit, 500);
  });

  // SPA 네비게이션 감지: pushState/replaceState 가로채기
  const _origPushState = history.pushState;
  const _origReplaceState = history.replaceState;

  history.pushState = function () {
    _origPushState.apply(this, arguments);
    setTimeout(tryInit, 500);
  };

  history.replaceState = function () {
    _origReplaceState.apply(this, arguments);
    setTimeout(tryInit, 500);
  };

  // DOM 변경 감지 (Amazon이 동적으로 페이지를 업데이트할 때)
  let _domCheckTimer = null;
  const observer = new MutationObserver(() => {
    // debounce: 빈번한 DOM 변경에 대해 500ms 후 한 번만 체크
    if (_domCheckTimer) clearTimeout(_domCheckTimer);
    _domCheckTimer = setTimeout(() => {
      if (window.location.href !== _lastUrl) {
        tryInit();
      }
    }, 500);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
