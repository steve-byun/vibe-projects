/**
 * ListingPro AI - Popup Application
 * 확장 팝업: 상태 확인 → 최적화 실행 → 결과 팝업 내 표시
 */

(function () {
  'use strict';

  // DOM
  const statusCard = document.getElementById('statusCard');
  const statusIcon = document.getElementById('statusIcon');
  const statusText = document.getElementById('statusText');
  const optimizeBtn = document.getElementById('optimizeBtn');
  const optimizeBtnText = document.getElementById('optimizeBtnText');
  const resultArea = document.getElementById('resultArea');
  const usageCount = document.getElementById('usageCount');
  const usageLimit = document.getElementById('usageLimit');
  const usageBar = document.getElementById('usageBar');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const saveKeyBtn = document.getElementById('saveKeyBtn');
  const toggleKeyBtn = document.getElementById('toggleKeyBtn');
  const apiStatus = document.getElementById('apiStatus');
  const settingsBtn = document.getElementById('settingsBtn');

  let isKeyVisible = false;
  let detectedPlatform = null;
  let currentTabId = null;
  let lastResult = null; // 복사용 저장

  // ============================================================
  // API Key
  // ============================================================
  async function loadApiKey() {
    const result = await chrome.storage.local.get(STORAGE_KEYS.API_KEY);
    const key = result[STORAGE_KEYS.API_KEY] || '';
    if (key) {
      apiKeyInput.value = key;
      apiStatus.textContent = 'API key configured.';
      apiStatus.className = 'lp-api-hint lp-success';
    } else {
      apiStatus.textContent = 'Demo mode active — sample results will be shown.';
      apiStatus.className = 'lp-api-hint';
    }
  }

  async function saveApiKey() {
    const key = apiKeyInput.value.trim();
    if (!key) {
      apiStatus.textContent = 'Please enter a valid API key.';
      apiStatus.className = 'lp-api-hint lp-error';
      return;
    }
    if (!key.startsWith('sk-ant-')) {
      apiStatus.textContent = 'Key should start with "sk-ant-".';
      apiStatus.className = 'lp-api-hint lp-error';
      return;
    }
    await chrome.storage.local.set({ [STORAGE_KEYS.API_KEY]: key });
    apiStatus.textContent = 'Saved!';
    apiStatus.className = 'lp-api-hint lp-success';
    setTimeout(() => {
      apiStatus.textContent = 'Stored locally, never shared.';
      apiStatus.className = 'lp-api-hint';
    }, 2000);
  }

  function toggleKeyVisibility() {
    isKeyVisible = !isKeyVisible;
    apiKeyInput.type = isKeyVisible ? 'text' : 'password';
  }

  // ============================================================
  // Usage
  // ============================================================
  async function loadUsage() {
    const result = await chrome.storage.local.get([STORAGE_KEYS.USAGE_COUNT, STORAGE_KEYS.USAGE_RESET_DATE]);
    const today = new Date().toISOString().split('T')[0];
    let count = result[STORAGE_KEYS.USAGE_COUNT] || 0;
    if ((result[STORAGE_KEYS.USAGE_RESET_DATE] || '') !== today) {
      count = 0;
      await chrome.storage.local.set({ [STORAGE_KEYS.USAGE_COUNT]: 0, [STORAGE_KEYS.USAGE_RESET_DATE]: today });
    }
    const limit = FREE_PLAN.DAILY_LIMIT;
    usageCount.textContent = count;
    usageLimit.textContent = limit;
    usageBar.style.width = Math.min((count / limit) * 100, 100) + '%';
  }

  // ============================================================
  // Tab Detection
  // ============================================================
  async function checkCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.url) {
        setStatus('idle', 'Open Etsy, Amazon, or Coupang product page.');
        return;
      }
      currentTabId = tab.id;
      const url = tab.url;

      if (url.includes('etsy.com/listing/')) {
        detectedPlatform = 'etsy';
        setStatus('active', 'Etsy listing detected!');
      } else if (url.includes('amazon.') && (url.includes('/dp/') || url.includes('/gp/product/'))) {
        detectedPlatform = 'amazon';
        setStatus('active', 'Amazon listing detected!');
      } else if (url.includes('coupang.com/vp/products/')) {
        detectedPlatform = 'coupang';
        setStatus('active', '쿠팡 상품 감지!');
      } else if (url.includes('coupang.com')) {
        setStatus('idle', '쿠팡 상품 상세 페이지로 이동하세요.');
      } else if (url.includes('etsy.com') || url.includes('amazon.')) {
        setStatus('idle', 'Navigate to a product detail page.');
      } else {
        setStatus('idle', 'Open Etsy, Amazon, or Coupang product page.');
      }

      if (detectedPlatform) {
        optimizeBtn.style.display = 'inline-flex';
      }
    } catch (e) {
      setStatus('idle', 'Open a product page to get started.');
    }
  }

  function setStatus(state, text) {
    statusText.textContent = text;
    if (state === 'active') {
      statusCard.classList.add('lp-active');
      statusIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    } else {
      statusCard.classList.remove('lp-active');
      statusIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>';
    }
  }

  // ============================================================
  // Optimize — 핵심 로직
  // ============================================================
  async function handleOptimize() {
    if (!currentTabId || !detectedPlatform) return;

    optimizeBtn.disabled = true;
    optimizeBtnText.textContent = 'Analyzing...';
    resultArea.style.display = 'none';

    try {
      // 1) 페이지에서 리스팅 데이터 추출
      const extractResults = await chrome.scripting.executeScript({
        target: { tabId: currentTabId },
        func: extractListingFromPage,
        args: [detectedPlatform],
      });

      const listingData = extractResults?.[0]?.result;
      if (!listingData || !listingData.title) {
        apiStatus.textContent = 'Could not extract data. Try refreshing the page.';
        apiStatus.className = 'lp-api-hint lp-error';
        resetBtn();
        return;
      }

      optimizeBtnText.textContent = 'Optimizing...';

      // 2) background에 최적화 요청
      const response = await chrome.runtime.sendMessage({
        type: MSG.OPTIMIZE_LISTING,
        payload: listingData,
      });

      if (response && response.success && response.payload) {
        lastResult = response.payload;
        showResult(response.payload);
        loadUsage();
      } else {
        apiStatus.textContent = response?.error || 'Optimization failed.';
        apiStatus.className = 'lp-api-hint lp-error';
      }
    } catch (err) {
      apiStatus.textContent = 'Error: ' + err.message;
      apiStatus.className = 'lp-api-hint lp-error';
    }

    resetBtn();
  }

  function resetBtn() {
    optimizeBtn.disabled = false;
    optimizeBtnText.textContent = 'Optimize with AI';
  }

  // ============================================================
  // 결과를 팝업 안에 표시
  // ============================================================
  function showResult(data) {
    // Score
    const scoreEl = document.getElementById('scoreNumber');
    const score = data.seoScore || 0;
    scoreEl.textContent = score;
    scoreEl.className = 'lp-score-number ' +
      (score >= 70 ? 'lp-score-high' : score >= 40 ? 'lp-score-mid' : 'lp-score-low');

    // Title
    document.getElementById('resultTitle').textContent = data.title || 'N/A';

    // Description
    document.getElementById('resultDescription').textContent = data.description || 'N/A';

    // Tags
    const tagsSection = document.getElementById('resultTagsSection');
    const tagsEl = document.getElementById('resultTags');
    if (data.tags && data.tags.length > 0) {
      tagsEl.innerHTML = data.tags.map(t => `<span>${escHtml(t)}</span>`).join('');
      tagsSection.style.display = 'block';
    }

    // Bullet Points
    const bulletsSection = document.getElementById('resultBulletsSection');
    const bulletsEl = document.getElementById('resultBullets');
    if (data.bulletPoints && data.bulletPoints.length > 0) {
      bulletsEl.innerHTML = data.bulletPoints.map(b => `<li>${escHtml(b)}</li>`).join('');
      bulletsSection.style.display = 'block';
    }

    // Improvements
    const improvSection = document.getElementById('resultImprovementsSection');
    const improvEl = document.getElementById('resultImprovements');
    if (data.improvements && data.improvements.length > 0) {
      improvEl.innerHTML = data.improvements.map(i => `<li>${escHtml(i)}</li>`).join('');
      improvSection.style.display = 'block';
    }

    // Insights
    const insightsSection = document.getElementById('resultInsightsSection');
    const insightsEl = document.getElementById('resultInsights');
    if (data.competitorInsights) {
      insightsEl.textContent = data.competitorInsights;
      insightsSection.style.display = 'block';
    }

    resultArea.style.display = 'flex';
  }

  function escHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  // ============================================================
  // 복사 버튼
  // ============================================================
  function handleCopy(e) {
    const btn = e.target.closest('.lp-copy-btn');
    if (!btn || !lastResult) return;
    const field = btn.getAttribute('data-copy');
    const text = lastResult[field] || '';
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = 'Copied!';
      btn.classList.add('lp-copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('lp-copied');
      }, 1500);
    });
  }

  // ============================================================
  // 페이지에서 실행되는 추출 함수 (injected)
  // ============================================================
  function extractListingFromPage(platform) {
    function _t(sel) {
      const el = document.querySelector(sel);
      return el ? el.textContent.trim() : '';
    }
    function _tAll(sel) {
      return Array.from(document.querySelectorAll(sel)).map(el => el.textContent.trim()).filter(t => t.length > 0);
    }

    if (platform === 'coupang') {
      const title = _t('h2.prod-buy-header__title') || _t('h1.prod-buy-header__title') || _t('.prod-buy-header__title') || _t('h1');
      let price = _t('.total-price strong') || _t('.prod-sale-price .total-price');
      price = price.replace(/[^\d,원₩]/g, '').trim();
      let desc = _t('.product-detail-content-inside') || _t('#productDetail .product-detail-content-inside');
      if (!desc) desc = _tAll('#productDetail p, #productDetail li').slice(0, 10).join('\n');
      const bullets = _tAll('.prod-attr-item');
      const category = _tAll('.breadcrumb a').join(' > ');
      return { platform: 'coupang', title, description: desc, tags: category ? category.split(' > ').filter(Boolean) : [], bulletPoints: bullets, price, currency: 'KRW', category, images: [], url: location.href, shopName: _t('.prod-brand-name a') || _t('.prod-brand-name'), rating: '', reviewCount: 0 };
    }

    if (platform === 'amazon') {
      const title = _t('#productTitle');
      const bullets = _tAll('#feature-bullets li .a-list-item').filter(b => !b.startsWith('Make sure') && b.length > 5);
      let desc = _t('#productDescription .content') || _t('#productDescription p') || _t('#productDescription');
      if (!desc) { const a = _tAll('#aplus .aplus-module-wrapper'); if (a.length) desc = a.join('\n'); }
      const pw = _t('.a-price-whole'), pf = _t('.a-price-fraction');
      let price = pw ? '$' + pw.replace(/[^\d.]/, '') + (pf || '00') : (_t('#priceblock_ourprice') || _t('.a-price .a-offscreen'));
      return { platform: 'amazon', title, description: desc, tags: [], bulletPoints: bullets, price, currency: 'USD', category: _tAll('#wayfinding-breadcrumbs_feature_div li a').join(' > '), images: [], url: location.href, shopName: _t('#bylineInfo'), rating: '', reviewCount: 0 };
    }

    // etsy
    const title = _t('[data-buy-box-listing-title]') || _t('h1.wt-text-body-03') || _t('h1');
    const desc = _t('[data-product-details-description-text-content]') || _t('.wt-content-toggle--truncated');
    let tags = _tAll('.wt-action-group__item-container a[href*="/search?q="]');
    if (!tags.length) tags = _tAll('a.wt-tag');
    return { platform: 'etsy', title, description: desc, tags, bulletPoints: [], price: _t('[data-buy-box-region="price"] .wt-text-title-03') || _t('.wt-text-title-larger'), currency: 'USD', category: _tAll('nav[aria-label="Breadcrumbs"] a').join(' > '), images: [], url: location.href, shopName: _t('[data-buy-box-region="shop-name"] a'), rating: '', reviewCount: 0 };
  }

  // ============================================================
  // 설정 토글
  // ============================================================
  let settingsVisible = true;
  function toggleSettings() {
    settingsVisible = !settingsVisible;
    document.getElementById('apiSection').style.display = settingsVisible ? 'flex' : 'none';
  }

  // ============================================================
  // Init
  // ============================================================
  saveKeyBtn.addEventListener('click', saveApiKey);
  toggleKeyBtn.addEventListener('click', toggleKeyVisibility);
  settingsBtn.addEventListener('click', toggleSettings);
  optimizeBtn.addEventListener('click', handleOptimize);
  document.addEventListener('click', handleCopy);
  apiKeyInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveApiKey(); });

  loadApiKey();
  loadUsage();
  checkCurrentTab();
})();
