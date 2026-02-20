/* iCloud Photo Cleaner - Content Script for icloud.com/photos */
(function () {
  'use strict';

  // ── Selector strategies (fallback chain) ──
  const SELECTORS = {
    // iCloud Photos uses a virtualized grid; these may change
    photoGrid: [
      '[class*="photo-grid"]',
      '[class*="PhotoGrid"]',
      '[role="grid"]',
      '[class*="moments"]',
      '.grid-container',
    ],
    photoItem: [
      '[class*="photo-container"] img',
      '[class*="PhotoItem"] img',
      '[role="gridcell"] img',
      '[class*="thumbnail"] img',
      '.grid-item img',
    ],
    photoCell: [
      '[class*="photo-container"]',
      '[class*="PhotoItem"]',
      '[role="gridcell"]',
      '[class*="thumbnail"]',
      '.grid-item',
    ],
    deleteButton: [
      'button[aria-label*="삭제"]',
      'button[aria-label*="Delete"]',
      'button[aria-label*="delete"]',
      '[class*="delete"]',
      '[data-testid="delete"]',
    ],
    toolbar: [
      '[class*="toolbar"]',
      '[class*="Toolbar"]',
      '[role="toolbar"]',
    ],
  };

  function queryFirst(selectorList, root) {
    root = root || document;
    for (const sel of selectorList) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function queryAll(selectorList, root) {
    root = root || document;
    for (const sel of selectorList) {
      const els = root.querySelectorAll(sel);
      if (els.length > 0) return Array.from(els);
    }
    return [];
  }

  // ── Fallback: find all visible images that look like photos ──
  function findPhotoImages() {
    // Strategy 1: try known selectors
    let imgs = queryAll(SELECTORS.photoItem);
    if (imgs.length > 0) return imgs;

    // Strategy 2: find all images with iCloud CDN URLs
    imgs = Array.from(document.querySelectorAll('img')).filter((img) => {
      const src = img.src || '';
      return (
        src.includes('icloud-content.com') ||
        src.includes('icloud.com') ||
        src.startsWith('blob:') ||
        (src.startsWith('data:image') && img.width > 50)
      );
    });
    if (imgs.length > 0) return imgs;

    // Strategy 3: find reasonably sized images (likely photo thumbnails)
    imgs = Array.from(document.querySelectorAll('img')).filter((img) => {
      const rect = img.getBoundingClientRect();
      return rect.width >= 50 && rect.height >= 50 && rect.width < 800 && img.src;
    });

    return imgs;
  }

  // ── Photo extraction with data URL conversion ──
  async function extractPhotoAsDataUrl(img) {
    // For CORS-restricted images, use a canvas within the content script context
    // Content scripts share the page's origin, so same-origin images are accessible
    try {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth || img.width;
      c.height = img.naturalHeight || img.height;
      const cx = c.getContext('2d');
      cx.drawImage(img, 0, 0);
      return c.toDataURL('image/jpeg', 0.8);
    } catch {
      // CORS blocked — return original URL (offscreen will try to load it)
      return img.src;
    }
  }

  // ── Message handler ──
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    switch (msg.type) {
      case MSG.PROBE_DOM:
        handleProbe(sendResponse);
        return true;

      case MSG.EXTRACT_PHOTOS:
        handleExtract(msg.payload).then(sendResponse);
        return true;

      case MSG.SCROLL_MORE:
        handleScroll().then(sendResponse);
        return true;

      case MSG.SELECT_PHOTOS:
        handleSelect(msg.payload).then(sendResponse);
        return true;

      case MSG.DELETE_SELECTED:
        handleDelete().then(sendResponse);
        return true;
    }
  });

  // ── Probe DOM ──
  function handleProbe(sendResponse) {
    const imgs = findPhotoImages();
    const grid = queryFirst(SELECTORS.photoGrid);

    sendResponse({
      success: imgs.length > 0,
      photoCount: imgs.length,
      gridFound: !!grid,
      url: location.href,
    });
  }

  // ── Extract photos ──
  async function handleExtract(payload) {
    const maxPhotos = (payload && payload.maxPhotos) || 500;
    const imgs = findPhotoImages();

    if (imgs.length === 0) {
      return { photos: [], error: '사진을 찾을 수 없습니다. 페이지가 완전히 로드되었는지 확인하세요.' };
    }

    const photos = [];
    const seen = new Set();
    const limit = Math.min(imgs.length, maxPhotos);

    for (let i = 0; i < limit; i++) {
      const img = imgs[i];
      // Generate a unique ID from the src or position
      const srcKey = img.src || `pos_${i}`;
      if (seen.has(srcKey)) continue;
      seen.add(srcKey);

      const dataUrl = await extractPhotoAsDataUrl(img);

      photos.push({
        id: `photo_${i}`,
        thumbnailUrl: dataUrl,
        originalSrc: img.src,
        index: i,
      });
    }

    return { photos };
  }

  // ── Scroll to load more ──
  async function handleScroll() {
    const grid = queryFirst(SELECTORS.photoGrid);
    const scrollTarget = grid || document.documentElement;

    const beforeCount = findPhotoImages().length;

    // Scroll down
    scrollTarget.scrollTop = scrollTarget.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);

    // Wait for lazy loading
    await new Promise((r) => setTimeout(r, 2000));

    const afterCount = findPhotoImages().length;

    return {
      beforeCount,
      afterCount,
      newPhotos: afterCount - beforeCount,
      reachedEnd: afterCount === beforeCount,
    };
  }

  // ── Select photos for deletion ──
  async function handleSelect(payload) {
    const indices = payload.indices || [];
    const cells = queryAll(SELECTORS.photoCell);
    const selected = [];
    const errors = [];

    for (const idx of indices) {
      if (idx >= cells.length) {
        errors.push(`Index ${idx} out of range`);
        continue;
      }

      try {
        const cell = cells[idx];

        // Simulate Ctrl+click for multi-select (Cmd on Mac)
        const isMac = navigator.platform.includes('Mac');
        cell.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            ctrlKey: !isMac,
            metaKey: isMac,
          })
        );

        selected.push(idx);
        // Small delay between clicks to avoid rate limiting
        await new Promise((r) => setTimeout(r, 100));
      } catch (err) {
        errors.push(`Index ${idx}: ${err.message}`);
      }
    }

    return { selected: selected.length, errors };
  }

  // ── Trigger delete ──
  async function handleDelete() {
    const deleteBtn = queryFirst(SELECTORS.deleteButton);

    if (!deleteBtn) {
      return {
        success: false,
        error: '삭제 버튼을 찾을 수 없습니다. 사진이 선택되었는지 확인하세요.',
      };
    }

    deleteBtn.click();

    // Wait for confirmation dialog to appear
    await new Promise((r) => setTimeout(r, 500));

    return {
      success: true,
      message: 'iCloud 삭제 확인 다이얼로그가 표시됩니다',
    };
  }

  console.log('[PhotoCleaner] Content script loaded on:', location.href);
})();
