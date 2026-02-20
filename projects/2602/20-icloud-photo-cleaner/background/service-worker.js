/* iCloud Photo Cleaner - Background Service Worker (Orchestrator) */

// Import grouping (can't use ES module import for non-module scripts loaded by content)
// We inline the grouping logic here since service worker is type: "module"

// ── Constants (duplicated here since service worker can't load content scripts' globals) ──
const MSG = {
  START_SCAN: 'PC_START_SCAN',
  STOP_SCAN: 'PC_STOP_SCAN',
  GET_STATUS: 'PC_GET_STATUS',
  CONFIRM_DELETE: 'PC_CONFIRM_DELETE',
  GET_SETTINGS: 'PC_GET_SETTINGS',
  SET_SETTINGS: 'PC_SET_SETTINGS',
  EXTRACT_PHOTOS: 'PC_EXTRACT_PHOTOS',
  SELECT_PHOTOS: 'PC_SELECT_PHOTOS',
  DELETE_SELECTED: 'PC_DELETE_SELECTED',
  SCROLL_MORE: 'PC_SCROLL_MORE',
  PROBE_DOM: 'PC_PROBE_DOM',
  PROCESS_BATCH: 'PC_PROCESS_BATCH',
  LOAD_FACE_API: 'PC_LOAD_FACE_API',
};

const STORAGE_KEYS = {
  SCAN_STATE: 'pc_scan_state',
  SCAN_RESULTS: 'pc_scan_results',
  SETTINGS: 'pc_settings',
};

const UI_STATE = {
  IDLE: 'idle',
  SCANNING: 'scanning',
  COMPLETE: 'complete',
  DELETING: 'deleting',
  DONE: 'done',
  ERROR: 'error',
};

// ── State ──
let scanning = false;
let stopRequested = false;

// ── Message handler ──
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    case MSG.START_SCAN:
      handleStartScan(msg.payload)
        .then((result) => sendResponse(result))
        .catch((err) => sendResponse({ error: err.message }));
      return true;

    case MSG.STOP_SCAN:
      stopRequested = true;
      sendResponse({ ok: true });
      return false;

    case MSG.CONFIRM_DELETE:
      handleDelete(msg.payload)
        .then((result) => sendResponse(result))
        .catch((err) => sendResponse({ error: err.message }));
      return true;

    case MSG.GET_STATUS:
      chrome.storage.local.get(STORAGE_KEYS.SCAN_STATE, (data) => {
        sendResponse(data[STORAGE_KEYS.SCAN_STATE] || { state: UI_STATE.IDLE });
      });
      return true;
  }
});

// ── Scan workflow ──
async function handleStartScan(settings) {
  if (scanning) return { error: '이미 스캔 중입니다' };

  scanning = true;
  stopRequested = false;

  const batchSize = settings?.batchSize || 20;
  const maxPhotos = settings?.maxPhotosToScan || 500;
  const threshold = settings?.similarityThreshold || 10;
  const enableFace = settings?.enableFaceDetection !== false;

  try {
    // Step 1: Get active iCloud tab
    await updateState({ state: UI_STATE.SCANNING, phase: 'extracting', progress: 0, extracted: 0 });

    const tab = await getICloudTab();
    if (!tab) throw new Error('iCloud Photos 탭을 찾을 수 없습니다');

    // Step 2: Probe DOM
    const probe = await sendToTab(tab.id, { type: MSG.PROBE_DOM });
    if (!probe?.success) {
      throw new Error('사진을 찾을 수 없습니다. iCloud Photos가 로드되었는지 확인하세요.');
    }

    // Step 3: Extract photos (with scroll cycles)
    let allPhotos = [];
    let scrollAttempts = 0;
    const maxScrollAttempts = 10;

    while (allPhotos.length < maxPhotos && scrollAttempts < maxScrollAttempts) {
      if (stopRequested) throw new Error('사용자에 의해 중지됨');

      const result = await sendToTab(tab.id, {
        type: MSG.EXTRACT_PHOTOS,
        payload: { maxPhotos },
      });

      if (result?.error) throw new Error(result.error);
      if (!result?.photos?.length) break;

      // Deduplicate by originalSrc
      const existing = new Set(allPhotos.map((p) => p.originalSrc));
      const newPhotos = result.photos.filter((p) => !existing.has(p.originalSrc));
      allPhotos.push(...newPhotos);

      await updateState({
        state: UI_STATE.SCANNING,
        phase: 'extracting',
        progress: Math.min(10, Math.round((allPhotos.length / maxPhotos) * 10)),
        extracted: allPhotos.length,
      });

      // Try scrolling for more
      if (allPhotos.length < maxPhotos) {
        const scrollResult = await sendToTab(tab.id, { type: MSG.SCROLL_MORE });
        if (scrollResult?.reachedEnd) break;
        scrollAttempts++;
      } else {
        break;
      }
    }

    if (allPhotos.length === 0) {
      throw new Error('사진을 추출할 수 없습니다');
    }

    // Step 4: Ensure offscreen document
    await ensureOffscreenDocument();

    // Step 5: Load face-api.js if enabled
    if (enableFace) {
      try {
        await chrome.runtime.sendMessage({ type: MSG.LOAD_FACE_API });
      } catch {
        console.warn('[PhotoCleaner] face-api.js 로드 실패, 얼굴 인식 없이 진행');
      }
    }

    // Step 6: Process in batches
    const processed = [];
    for (let i = 0; i < allPhotos.length; i += batchSize) {
      if (stopRequested) throw new Error('사용자에 의해 중지됨');

      const batch = allPhotos.slice(i, i + batchSize);
      const results = await chrome.runtime.sendMessage({
        type: MSG.PROCESS_BATCH,
        payload: batch,
      });

      if (results?.error) {
        console.warn('[PhotoCleaner] Batch error:', results.error);
        continue;
      }

      if (Array.isArray(results)) {
        processed.push(...results);
      }

      const pct = 10 + Math.round(((i + batch.length) / allPhotos.length) * 70);
      await updateState({
        state: UI_STATE.SCANNING,
        phase: 'processing',
        progress: pct,
        processed: processed.length,
        total: allPhotos.length,
      });
    }

    // Step 7: Group similar photos
    await updateState({
      state: UI_STATE.SCANNING,
      phase: 'grouping',
      progress: 85,
    });

    const groups = groupSimilarPhotos(processed, threshold);

    // Step 8: Store results
    const scanResults = {
      groups,
      totalScanned: processed.length,
      totalGroups: groups.length,
      totalDeletable: groups.reduce((sum, g) => sum + g.photos.length - 1, 0),
      scannedAt: Date.now(),
    };

    await chrome.storage.local.set({
      [STORAGE_KEYS.SCAN_RESULTS]: scanResults,
      [STORAGE_KEYS.SCAN_STATE]: { state: UI_STATE.COMPLETE, progress: 100 },
    });

    scanning = false;
    return { success: true };
  } catch (err) {
    scanning = false;
    await updateState({ state: UI_STATE.ERROR, error: err.message });
    return { error: err.message };
  }
}

// ── Delete workflow ──
async function handleDelete(payload) {
  const photoIds = payload?.photoIds || [];
  if (photoIds.length === 0) return { error: '삭제할 사진이 없습니다' };

  try {
    const tab = await getICloudTab();
    if (!tab) throw new Error('iCloud Photos 탭을 찾을 수 없습니다');

    await updateState({
      state: UI_STATE.DELETING,
      deleteProgress: 0,
      deleteDetail: '사진 선택 중...',
    });

    // Get indices from photo IDs
    const indices = photoIds.map((id) => parseInt(id.replace('photo_', '')));

    // Select photos in batches (to avoid overwhelming the UI)
    const SELECT_BATCH = 10;
    let totalSelected = 0;

    for (let i = 0; i < indices.length; i += SELECT_BATCH) {
      const batch = indices.slice(i, i + SELECT_BATCH);
      const result = await sendToTab(tab.id, {
        type: MSG.SELECT_PHOTOS,
        payload: { indices: batch },
      });

      totalSelected += result?.selected || 0;
      const pct = Math.round(((i + batch.length) / indices.length) * 80);
      await updateState({
        state: UI_STATE.DELETING,
        deleteProgress: pct,
        deleteDetail: `${totalSelected}/${indices.length}장 선택됨`,
      });
    }

    // Trigger delete
    await updateState({
      state: UI_STATE.DELETING,
      deleteProgress: 90,
      deleteDetail: '삭제 요청 중...',
    });

    const deleteResult = await sendToTab(tab.id, { type: MSG.DELETE_SELECTED });

    if (deleteResult?.success) {
      await updateState({
        state: UI_STATE.DONE,
        deletedCount: totalSelected,
      });
      return { success: true, deleted: totalSelected };
    } else {
      throw new Error(deleteResult?.error || '삭제 실패');
    }
  } catch (err) {
    await updateState({ state: UI_STATE.ERROR, error: err.message });
    return { error: err.message };
  }
}

// ── Helpers ──
async function getICloudTab() {
  const tabs = await chrome.tabs.query({ url: 'https://www.icloud.com/photos/*' });
  return tabs[0] || null;
}

function sendToTab(tabId, message) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        resolve({ error: chrome.runtime.lastError.message });
      } else {
        resolve(response);
      }
    });
  });
}

async function updateState(state) {
  await chrome.storage.local.set({ [STORAGE_KEYS.SCAN_STATE]: state });
}

async function ensureOffscreenDocument() {
  const existing = await chrome.offscreen.hasDocument();
  if (!existing) {
    await chrome.offscreen.createDocument({
      url: 'offscreen/offscreen.html',
      reasons: ['BLOBS'],
      justification: 'Canvas-based image processing for photo hashing and quality analysis',
    });
  }
}

// ── Inline grouping (since we can't import from lib/ in service worker easily) ──
function groupSimilarPhotos(photos, threshold) {
  if (typeof threshold !== 'number') threshold = 10;
  const n = photos.length;
  if (n < 2) return [];

  const parent = new Int32Array(n);
  const rank = new Int32Array(n);
  for (let i = 0; i < n; i++) parent[i] = i;

  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }

  function union(a, b) {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return;
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else { parent[rb] = ra; rank[ra]++; }
  }

  function hammingDist(a, b) {
    let xor = BigInt('0x' + a) ^ BigInt('0x' + b);
    let dist = 0;
    while (xor > 0n) {
      dist += Number(xor & 1n);
      xor >>= 1n;
    }
    return dist;
  }

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (hammingDist(photos[i].hash, photos[j].hash) <= threshold) {
        union(i, j);
      }
    }
  }

  const groupMap = new Map();
  for (let i = 0; i < n; i++) {
    const root = find(i);
    if (!groupMap.has(root)) groupMap.set(root, []);
    groupMap.get(root).push(i);
  }

  const groups = [];
  for (const indices of groupMap.values()) {
    if (indices.length < 2) continue;

    const groupPhotos = indices.map((i) => photos[i]);
    let bestIdx = 0;
    let bestScore = -1;
    groupPhotos.forEach((p, idx) => {
      if (p.quality.total > bestScore) {
        bestScore = p.quality.total;
        bestIdx = idx;
      }
    });

    groups.push({
      photos: groupPhotos,
      bestId: groupPhotos[bestIdx].id,
      bestScore,
    });
  }

  groups.sort((a, b) => b.photos.length - a.photos.length);
  return groups;
}

console.log('[PhotoCleaner] Service worker loaded');
