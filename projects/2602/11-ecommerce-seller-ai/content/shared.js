/**
 * ListingPro AI - Content Script Shared Utilities
 *
 * 모든 플랫폼 content script가 공통으로 사용하는 UI 및 헬퍼 함수
 * constants.js가 먼저 로드된 상태에서 사용
 */

// 플로팅 버튼 및 오버레이 인스턴스 관리
let _floatingBtn = null;
let _resultOverlay = null;
let _loadingOverlay = null;
let _backdrop = null;

// ============================================================
// 텍스트 추출 헬퍼
// ============================================================

/**
 * 단일 요소에서 텍스트 안전 추출
 * @param {string} selector - CSS selector
 * @param {Element} [root=document] - 검색 루트
 * @returns {string} trimmed text or ''
 */
function extractText(selector, root = document) {
  const el = root.querySelector(selector);
  return el ? el.textContent.trim() : '';
}

/**
 * 모든 매칭 요소에서 텍스트 추출
 * @param {string} selector - CSS selector
 * @param {Element} [root=document] - 검색 루트
 * @returns {string[]} trimmed text 배열 (빈 문자열 제외)
 */
function extractAllText(selector, root = document) {
  const els = root.querySelectorAll(selector);
  return Array.from(els)
    .map(el => el.textContent.trim())
    .filter(t => t.length > 0);
}

// ============================================================
// Background 통신
// ============================================================

/**
 * Background service worker에 메시지 전송
 * @param {string} type - MSG 상수
 * @param {Object} payload - 전송 데이터
 * @returns {Promise<any>} response
 */
function sendToBackground(type, payload) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type, payload }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
}

// ============================================================
// 플로팅 버튼
// ============================================================

/**
 * "Optimize with AI" 플로팅 버튼 생성
 * @param {Function} onClick - 클릭 시 콜백 (listing 데이터 추출 → 전송)
 * @returns {HTMLElement} button element
 */
function createFloatingButton(onClick) {
  // 이미 존재하면 제거
  if (_floatingBtn) {
    _floatingBtn.remove();
  }

  const btn = document.createElement('div');
  btn.className = 'lp-floating-btn';
  btn.setAttribute('role', 'button');
  btn.setAttribute('tabindex', '0');
  btn.innerHTML = `
    <svg class="lp-floating-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
    <span class="lp-floating-btn-text">Optimize with AI</span>
  `;

  btn.addEventListener('click', () => {
    if (typeof onClick === 'function') {
      onClick();
    }
  });

  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });

  document.body.appendChild(btn);
  _floatingBtn = btn;
  return btn;
}

// ============================================================
// 로딩 오버레이
// ============================================================

/**
 * 로딩 스피너 오버레이 표시
 */
function showLoading() {
  hideLoading(); // 기존 것 제거

  const overlay = document.createElement('div');
  overlay.className = 'lp-loading-overlay';
  overlay.innerHTML = `
    <div class="lp-loading-content">
      <div class="lp-spinner"></div>
      <p class="lp-loading-text">Analyzing your listing...</p>
      <p class="lp-loading-sub">This may take a few seconds</p>
    </div>
  `;

  document.body.appendChild(overlay);
  _loadingOverlay = overlay;

  // 애니메이션 트리거
  requestAnimationFrame(() => {
    overlay.classList.add('lp-visible');
  });
}

/**
 * 로딩 스피너 오버레이 숨기기
 */
function hideLoading() {
  if (_loadingOverlay) {
    _loadingOverlay.classList.remove('lp-visible');
    setTimeout(() => {
      if (_loadingOverlay) {
        _loadingOverlay.remove();
        _loadingOverlay = null;
      }
    }, 300);
  }
}

// ============================================================
// 결과 오버레이
// ============================================================

/**
 * SEO 점수 원형 게이지 HTML 생성
 * @param {number} score - 0~100
 * @returns {string} HTML
 */
function _buildScoreGauge(score) {
  const circumference = 2 * Math.PI * 40; // r=40
  const offset = circumference - (score / 100) * circumference;
  let colorClass = 'lp-score-low';
  if (score >= 70) colorClass = 'lp-score-high';
  else if (score >= 40) colorClass = 'lp-score-mid';

  return `
    <div class="lp-score-gauge ${colorClass}">
      <svg viewBox="0 0 100 100">
        <circle class="lp-score-bg" cx="50" cy="50" r="40"/>
        <circle class="lp-score-fill" cx="50" cy="50" r="40"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          transform="rotate(-90 50 50)"/>
      </svg>
      <div class="lp-score-value">${score}</div>
      <div class="lp-score-label">SEO Score</div>
    </div>
  `;
}

/**
 * 태그 칩 리스트 HTML 생성
 * @param {string[]} tags
 * @returns {string} HTML
 */
function _buildTagChips(tags) {
  if (!tags || tags.length === 0) return '<p class="lp-empty">No tags suggested</p>';
  return tags.map(tag => `<span class="lp-tag-chip">${_escapeHtml(tag)}</span>`).join('');
}

/**
 * 개선사항 리스트 HTML 생성
 * @param {string[]} items
 * @returns {string} HTML
 */
function _buildImprovements(items) {
  if (!items || items.length === 0) return '<p class="lp-empty">No improvements needed!</p>';
  return '<ul class="lp-improvements-list">' +
    items.map(item => `<li>${_escapeHtml(item)}</li>`).join('') +
    '</ul>';
}

/**
 * HTML 이스케이프
 */
function _escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 결과 오버레이 표시
 * @param {Object} optimizedListing - OptimizedListing 구조체
 */
function showResultOverlay(optimizedListing) {
  hideResultOverlay(); // 기존 것 제거
  hideLoading();

  // 백드롭
  _backdrop = document.createElement('div');
  _backdrop.className = 'lp-backdrop';
  _backdrop.addEventListener('click', hideResultOverlay);
  document.body.appendChild(_backdrop);

  // 결과 패널
  const panel = document.createElement('div');
  panel.className = 'lp-result-panel';

  const data = optimizedListing || {};

  panel.innerHTML = `
    <div class="lp-panel-header">
      <h2 class="lp-panel-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        ListingPro AI
      </h2>
      <button class="lp-close-btn" aria-label="Close">&times;</button>
    </div>
    <div class="lp-panel-body">
      <!-- SEO Score -->
      <section class="lp-section lp-section-score">
        ${_buildScoreGauge(data.seoScore || 0)}
      </section>

      <!-- Optimized Title -->
      <section class="lp-section">
        <h3 class="lp-section-title">Optimized Title</h3>
        <div class="lp-section-content lp-copyable" data-field="title">
          <p>${_escapeHtml(data.title || 'N/A')}</p>
          <button class="lp-copy-btn" data-copy="title" title="Copy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
          </button>
        </div>
      </section>

      <!-- Optimized Description -->
      <section class="lp-section">
        <h3 class="lp-section-title">Optimized Description</h3>
        <div class="lp-section-content lp-copyable" data-field="description">
          <p>${_escapeHtml(data.description || 'N/A')}</p>
          <button class="lp-copy-btn" data-copy="description" title="Copy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
          </button>
        </div>
      </section>

      <!-- Tags -->
      <section class="lp-section">
        <h3 class="lp-section-title">Suggested Tags</h3>
        <div class="lp-tags-container">
          ${_buildTagChips(data.tags)}
        </div>
      </section>

      <!-- Bullet Points (Amazon) -->
      ${data.bulletPoints && data.bulletPoints.length > 0 ? `
      <section class="lp-section">
        <h3 class="lp-section-title">Bullet Points</h3>
        <ul class="lp-bullet-list">
          ${data.bulletPoints.map(bp => `<li>${_escapeHtml(bp)}</li>`).join('')}
        </ul>
      </section>` : ''}

      <!-- Keywords -->
      ${data.keywords && data.keywords.length > 0 ? `
      <section class="lp-section">
        <h3 class="lp-section-title">Recommended Keywords</h3>
        <div class="lp-tags-container">
          ${data.keywords.map(kw => `<span class="lp-keyword-chip">${_escapeHtml(kw)}</span>`).join('')}
        </div>
      </section>` : ''}

      <!-- Improvements -->
      <section class="lp-section">
        <h3 class="lp-section-title">Improvements</h3>
        ${_buildImprovements(data.improvements)}
      </section>

      <!-- Competitor Insights -->
      ${data.competitorInsights ? `
      <section class="lp-section">
        <h3 class="lp-section-title">Competitor Insights</h3>
        <p class="lp-insight-text">${_escapeHtml(data.competitorInsights)}</p>
      </section>` : ''}
    </div>
  `;

  document.body.appendChild(panel);
  _resultOverlay = panel;

  // 애니메이션 트리거
  requestAnimationFrame(() => {
    _backdrop.classList.add('lp-visible');
    panel.classList.add('lp-visible');
  });

  // 이벤트 바인딩
  panel.querySelector('.lp-close-btn').addEventListener('click', hideResultOverlay);

  // 복사 버튼 바인딩
  panel.querySelectorAll('.lp-copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const field = btn.getAttribute('data-copy');
      const text = data[field] || '';
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('lp-copied');
        setTimeout(() => btn.classList.remove('lp-copied'), 1500);
      });
    });
  });
}

/**
 * 결과 오버레이 숨기기
 */
function hideResultOverlay() {
  if (_resultOverlay) {
    _resultOverlay.classList.remove('lp-visible');
  }
  if (_backdrop) {
    _backdrop.classList.remove('lp-visible');
  }
  setTimeout(() => {
    if (_resultOverlay) {
      _resultOverlay.remove();
      _resultOverlay = null;
    }
    if (_backdrop) {
      _backdrop.remove();
      _backdrop = null;
    }
  }, 300);
}

/**
 * 에러 메시지 표시
 * @param {string} message
 */
function showError(message) {
  hideLoading();

  const toast = document.createElement('div');
  toast.className = 'lp-toast lp-toast-error';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
    <span>${_escapeHtml(message)}</span>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('lp-visible');
  });

  setTimeout(() => {
    toast.classList.remove('lp-visible');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ============================================================
// Background → Content 메시지 수신
// ============================================================
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === MSG.OPTIMIZED_LISTING) {
    showResultOverlay(msg.payload);
    sendResponse({ success: true });
  }
  if (msg.type === MSG.ANALYSIS_RESULT) {
    // 분석 결과도 동일하게 오버레이로 표시
    showResultOverlay(msg.payload);
    sendResponse({ success: true });
  }
});
