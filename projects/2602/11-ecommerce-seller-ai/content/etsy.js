/**
 * ListingPro AI - Etsy Content Script
 *
 * Etsy 상품 페이지에서 리스팅 데이터를 추출하고
 * 플로팅 버튼을 통해 AI 최적화를 트리거합니다.
 *
 * 대상 URL: https://www.etsy.com/listing/*
 * 의존성: constants.js, shared.js (먼저 로드됨)
 */

(function () {
  'use strict';

  /**
   * Etsy 상품 페이지에서 ListingData 추출
   * @returns {Object} ListingData
   */
  function extractEtsyListing() {
    // Title - 여러 셀렉터 시도
    const title =
      extractText('[data-buy-box-listing-title]') ||
      extractText('h1.wt-text-body-03') ||
      extractText('h1');

    // Description - 상품 설명 영역
    const description =
      extractText('[data-product-details-description-text-content]') ||
      extractText('.wt-content-toggle--truncated') ||
      extractText('#wt-content-toggle-product-details-content-toggle') ||
      extractText('.wt-text-body-01[data-appears-component-name="product_description"]') ||
      extractText('.listing-page-description');

    // Tags - Etsy는 리스팅 하단에 태그를 표시
    let tags = extractAllText('.wt-action-group__item-container a[href*="/search?q="]');
    if (tags.length === 0) {
      tags = extractAllText('a.wt-tag');
    }
    if (tags.length === 0) {
      // 대체: 관련 검색어 섹션
      tags = extractAllText('.tag-cards-container a');
    }

    // Price
    const priceText =
      extractText('[data-buy-box-region="price"] .wt-text-title-03') ||
      extractText('.wt-text-title-03.wt-mr-xs-1') ||
      extractText('p[data-appears-component-name="price"]') ||
      extractText('.wt-text-title-larger');

    // Currency 추출 (기본 USD)
    let currency = 'USD';
    const currencyMatch = priceText.match(/([A-Z]{3})/);
    if (currencyMatch) {
      currency = currencyMatch[1];
    } else if (priceText.includes('$')) {
      currency = 'USD';
    } else if (priceText.includes('€')) {
      currency = 'EUR';
    } else if (priceText.includes('£')) {
      currency = 'GBP';
    }

    // Shop name
    const shopName =
      extractText('[data-buy-box-region="shop-name"] a') ||
      extractText('a[href*="/shop/"]') ||
      extractText('.wt-text-link-no-underline.shop-name-and-title-container');

    // Images
    const imageEls = document.querySelectorAll(
      'img[data-listing-card-listing-image], ' +
      '.image-carousel-container img, ' +
      'ul.carousel-pane-list img, ' +
      '.listing-page-image-carousel img'
    );
    const images = Array.from(imageEls)
      .map(img => img.src || img.getAttribute('data-src') || '')
      .filter(src => src.length > 0 && src.startsWith('http'));
    // 중복 제거
    const uniqueImages = [...new Set(images)];

    // Category breadcrumbs
    const category = extractAllText(
      'nav[aria-label="Breadcrumbs"] a, ' +
      '.wt-action-group--nowrap a, ' +
      '#breadcrumbs a'
    ).join(' > ');

    // Rating
    const ratingText =
      extractText('[data-buy-box-region="reviews"] .wt-text-title-01') ||
      extractText('input[name="rating"]') ||
      '';
    const ratingMatch = ratingText.match(/([\d.]+)/);
    const rating = ratingMatch ? ratingMatch[1] : '';

    // Review count
    const reviewText =
      extractText('[data-buy-box-region="reviews"]') ||
      extractText('.wt-text-link-no-underline[href*="#reviews"]') ||
      '';
    const reviewMatch = reviewText.match(/([\d,]+)\s*review/i);
    const reviewCount = reviewMatch ? parseInt(reviewMatch[1].replace(/,/g, ''), 10) : 0;

    return {
      platform: PLATFORMS.ETSY,
      title,
      description,
      tags,
      bulletPoints: [],
      price: priceText,
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
      const listingData = extractEtsyListing();

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
   * 현재 페이지가 Etsy 상품 페이지인지 판별
   * @returns {boolean}
   */
  function isListingPage() {
    return window.location.pathname.startsWith('/listing/');
  }

  // ============================================================
  // 초기화 + SPA 네비게이션 대응
  // ============================================================

  let _lastUrl = '';

  function tryInit() {
    const currentUrl = window.location.href;
    if (currentUrl === _lastUrl) return;
    _lastUrl = currentUrl;

    if (!isListingPage()) return;

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
