/**
 * ListingPro AI - Coupang Content Script
 *
 * 쿠팡 상품 페이지에서 리스팅 데이터를 추출하고
 * 플로팅 버튼을 통해 AI 최적화를 트리거합니다.
 *
 * 대상 URL: https://www.coupang.com/vp/products/*
 * 의존성: constants.js, shared.js (먼저 로드됨)
 */

(function () {
  'use strict';

  /**
   * 쿠팡 상품 페이지에서 ListingData 추출
   * @returns {Object} ListingData
   */
  function extractCoupangListing() {
    // Title
    const title =
      extractText('h2.prod-buy-header__title') ||
      extractText('h1.prod-buy-header__title') ||
      extractText('.prod-buy-header__title') ||
      extractText('h1');

    // Price — 할인가 우선, 없으면 원가
    let price = '';
    const salePrice = extractText('.total-price strong');
    const originPrice = extractText('.origin-price');
    if (salePrice) {
      price = salePrice;
    } else if (originPrice) {
      price = originPrice;
    }
    // 원 기호 정리
    price = price.replace(/[^\d,원₩]/g, '').trim();
    if (price && !price.includes('원') && !price.includes('₩')) {
      price = price + '원';
    }

    // Currency — 쿠팡은 항상 KRW
    const currency = 'KRW';

    // Description — 상품 상세 설명 영역
    let description =
      extractText('.product-detail-content-inside') ||
      extractText('#productDetail .product-detail-content-inside') ||
      extractText('.product-detail__description');

    // 상세 이미지 밑의 텍스트도 수집 (너무 길면 잘라냄)
    if (!description) {
      const detailTexts = extractAllText('#productDetail p, #productDetail li');
      if (detailTexts.length > 0) {
        description = detailTexts.slice(0, 10).join('\n');
      }
    }

    // Bullet Points — 상품 속성 (사이즈, 재질 등)
    const bulletPoints = extractAllText('.prod-attr-item');
    // 추가: 상품 요약 정보
    const summaryItems = extractAllText('.prod-description__item');
    bulletPoints.push(...summaryItems);

    // Brand / Seller
    const shopName =
      extractText('.prod-brand-name a') ||
      extractText('.prod-brand-name') ||
      extractText('.prod-sale-vendor-name a') ||
      extractText('a[href*="/brands/"]');

    // Images
    const images = [];
    // 메인 이미지
    const mainImg = document.querySelector('.prod-image__detail img, #repImageContainer img');
    if (mainImg) {
      const src = mainImg.src || mainImg.getAttribute('data-img-src') || '';
      if (src) images.push(src);
    }
    // 썸네일 이미지들
    const thumbs = document.querySelectorAll('.prod-image__items img, .prod-image__thumbs img');
    thumbs.forEach(img => {
      const src = img.src || img.getAttribute('data-img-src') || '';
      if (src && src.startsWith('http')) {
        // 쿠팡 썸네일 → 풀사이즈 변환 (230x230 → 원본)
        const fullSrc = src.replace(/\/thumbnails\//, '/originals/').replace(/_230x230\./, '.');
        images.push(fullSrc);
      }
    });
    const uniqueImages = [...new Set(images)].filter(u => u.startsWith('http'));

    // Category breadcrumbs
    const category = extractAllText(
      '.breadcrumb a, .prod-breadcrumb-link'
    ).join(' > ');

    // Rating
    const ratingText =
      extractText('.rating-star-num .rating') ||
      extractText('.prod-rating__number') ||
      extractText('.star-rating__text');
    const ratingMatch = ratingText.match(/([\d.]+)/);
    const rating = ratingMatch ? ratingMatch[1] : '';

    // Review count
    const reviewCountText =
      extractText('.count') ||
      extractText('.prod-rating__count') ||
      extractText('.sdp-review__count');
    const reviewMatch = reviewCountText.match(/([\d,]+)/);
    const reviewCount = reviewMatch ? parseInt(reviewMatch[1].replace(/,/g, ''), 10) : 0;

    // Tags — 쿠팡은 태그가 없으므로 검색 키워드 추출 시도
    let tags = extractAllText('.tag a, .related-search a');
    // 카테고리 이름들도 태그로 활용
    if (tags.length === 0 && category) {
      tags = category.split(' > ').map(t => t.trim()).filter(t => t.length > 0);
    }

    return {
      platform: PLATFORMS.COUPANG,
      title,
      description,
      tags,
      bulletPoints,
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
      const listingData = extractCoupangListing();

      if (!listingData.title) {
        hideLoading();
        showError('상품 데이터를 추출할 수 없습니다. 상품 페이지인지 확인해주세요.');
        return;
      }

      const response = await sendToBackground(MSG.OPTIMIZE_LISTING, listingData);

      if (response && response.error) {
        hideLoading();
        showError(response.error);
      }
    } catch (err) {
      hideLoading();
      showError(err.message || '백그라운드 서비스 연결 실패');
    }
  }

  /**
   * 현재 페이지가 쿠팡 상품 페이지인지 판별
   * @returns {boolean}
   */
  function isProductPage() {
    return !!(
      window.location.pathname.startsWith('/vp/products/') ||
      document.querySelector('.prod-buy-header__title') ||
      document.querySelector('#productDetail')
    );
  }

  // ============================================================
  // 초기화 + SPA 네비게이션 대응
  // ============================================================

  let _lastUrl = '';

  function tryInit() {
    const currentUrl = window.location.href;
    if (currentUrl === _lastUrl) return;
    _lastUrl = currentUrl;

    if (!isProductPage()) return;

    createFloatingButton(handleOptimizeClick);
  }

  // 최초 실행
  tryInit();

  // SPA 네비게이션 감지
  window.addEventListener('popstate', () => {
    setTimeout(tryInit, 500);
  });

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

  // DOM 변경 감지
  let _domCheckTimer = null;
  const observer = new MutationObserver(() => {
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
