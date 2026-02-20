/* iCloud Photo Cleaner - Popup Controller */
(function () {
  'use strict';

  // DOM refs
  const views = {
    notIcloud: document.getElementById('viewNotIcloud'),
    idle: document.getElementById('viewIdle'),
    scanning: document.getElementById('viewScanning'),
    results: document.getElementById('viewResults'),
    deleting: document.getElementById('viewDeleting'),
    done: document.getElementById('viewDone'),
    settings: document.getElementById('viewSettings'),
    error: document.getElementById('viewError'),
  };

  const $ = (id) => document.getElementById(id);

  // State
  let currentView = 'notIcloud';
  let scanResults = null;
  let settings = { ...DEFAULT_SETTINGS };
  let previousView = 'idle';

  // ── View management ──
  function showView(name) {
    Object.values(views).forEach((v) => v.classList.add('hidden'));
    if (views[name]) {
      views[name].classList.remove('hidden');
      previousView = currentView;
      currentView = name;
    }
  }

  // ── Init ──
  async function init() {
    await loadSettings();
    await checkCurrentTab();
    await checkScanState();
    bindEvents();
  }

  async function checkCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.url?.includes('icloud.com/photos')) {
        showView('idle');
      } else {
        showView('notIcloud');
      }
    } catch {
      showView('notIcloud');
    }
  }

  async function checkScanState() {
    try {
      const data = await chrome.storage.local.get([STORAGE_KEYS.SCAN_STATE, STORAGE_KEYS.SCAN_RESULTS]);
      const state = data[STORAGE_KEYS.SCAN_STATE];
      if (!state) return;

      if (state.state === UI_STATE.SCANNING) {
        showView('scanning');
        updateScanProgress(state);
        startProgressPolling();
      } else if (state.state === UI_STATE.COMPLETE) {
        scanResults = data[STORAGE_KEYS.SCAN_RESULTS];
        if (scanResults) {
          showView('results');
          renderResults();
        }
      }
    } catch { /* ignore */ }
  }

  async function loadSettings() {
    try {
      const data = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
      if (data[STORAGE_KEYS.SETTINGS]) {
        settings = { ...DEFAULT_SETTINGS, ...data[STORAGE_KEYS.SETTINGS] };
      }
    } catch { /* use defaults */ }
    applySettingsToUI();
  }

  function applySettingsToUI() {
    $('thresholdSlider').value = settings.similarityThreshold;
    $('thresholdValue').textContent = settings.similarityThreshold;
    $('maxPhotosSlider').value = settings.maxPhotosToScan;
    $('maxPhotosValue').textContent = settings.maxPhotosToScan;
    $('faceToggle').checked = settings.enableFaceDetection;
  }

  async function saveSettings() {
    settings.similarityThreshold = parseInt($('thresholdSlider').value);
    settings.maxPhotosToScan = parseInt($('maxPhotosSlider').value);
    settings.enableFaceDetection = $('faceToggle').checked;
    await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: settings });
  }

  // ── Scan ──
  let pollTimer = null;

  async function startScan() {
    showView('scanning');
    $('scanProgressFill').style.width = '0%';
    $('scanPercent').textContent = '0%';
    $('scanStatusText').textContent = '사진 추출 중...';
    $('scanDetail').textContent = '준비 중...';

    try {
      await chrome.runtime.sendMessage({ type: MSG.START_SCAN, payload: settings });
      startProgressPolling();
    } catch (err) {
      showError('스캔 시작 실패: ' + err.message);
    }
  }

  function startProgressPolling() {
    stopProgressPolling();
    pollTimer = setInterval(pollProgress, 500);
  }

  function stopProgressPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  async function pollProgress() {
    try {
      const data = await chrome.storage.local.get([STORAGE_KEYS.SCAN_STATE, STORAGE_KEYS.SCAN_RESULTS]);
      const state = data[STORAGE_KEYS.SCAN_STATE];
      if (!state) return;

      if (state.state === UI_STATE.SCANNING) {
        updateScanProgress(state);
      } else if (state.state === UI_STATE.COMPLETE) {
        stopProgressPolling();
        scanResults = data[STORAGE_KEYS.SCAN_RESULTS];
        showView('results');
        renderResults();
      } else if (state.state === UI_STATE.ERROR) {
        stopProgressPolling();
        showError(state.error || '스캔 중 오류 발생');
      }
    } catch { /* ignore */ }
  }

  function updateScanProgress(state) {
    const pct = state.progress || 0;
    $('scanProgressFill').style.width = pct + '%';
    $('scanPercent').textContent = pct + '%';

    if (state.phase === 'extracting') {
      $('scanStatusText').textContent = '사진 추출 중...';
      $('scanDetail').textContent = `${state.extracted || 0}장 발견`;
    } else if (state.phase === 'processing') {
      $('scanStatusText').textContent = '분석 중...';
      $('scanDetail').textContent = `${state.processed || 0} / ${state.total || '?'}장`;
    } else if (state.phase === 'grouping') {
      $('scanStatusText').textContent = '유사 사진 그룹핑...';
      $('scanDetail').textContent = '거의 완료!';
    }
  }

  async function stopScan() {
    stopProgressPolling();
    try {
      await chrome.runtime.sendMessage({ type: MSG.STOP_SCAN });
    } catch { /* ignore */ }
    showView('idle');
  }

  // ── Results rendering ──
  function renderResults() {
    if (!scanResults) return;

    $('groupCount').textContent = scanResults.groups.length;
    const deletable = scanResults.groups.reduce((sum, g) => sum + g.photos.length - 1, 0);
    $('deletableCount').textContent = deletable;
    $('totalScanned').textContent = scanResults.totalScanned;

    const list = $('groupsList');
    list.innerHTML = '';

    if (scanResults.groups.length === 0) {
      list.innerHTML = '<div class="pc-empty"><p>유사한 사진 그룹이 없습니다</p></div>';
      $('cleanBtn').classList.add('hidden');
      return;
    }

    scanResults.groups.forEach((group, gi) => {
      const card = document.createElement('div');
      card.className = 'pc-group-card';
      card.dataset.groupIndex = gi;

      const deleteCount = group.photos.length - 1;
      card.innerHTML = `
        <div class="pc-group-header">
          <label>
            <input type="checkbox" class="pc-group-check" data-gi="${gi}" checked>
            그룹 ${gi + 1} (${group.photos.length}장)
          </label>
          <span class="pc-group-badge">-${deleteCount}장</span>
        </div>
        <div class="pc-photo-grid">
          ${group.photos.map((p, pi) => {
            const isBest = p.id === group.bestId;
            const cls = isBest ? 'pc-photo-item pc-best' : 'pc-photo-item pc-to-delete';
            const score = Math.round(p.quality.total);
            const scoreClass = score >= 70 ? 'pc-quality-high' : score >= 40 ? 'pc-quality-mid' : 'pc-quality-low';
            return `
              <div class="${cls}" data-gi="${gi}" data-pi="${pi}" data-id="${p.id}" title="품질: ${score}점">
                <img src="${p.thumbnailUrl}" alt="" loading="lazy">
                ${isBest ? '<span class="pc-best-label">BEST</span>' : ''}
                <span class="pc-quality-badge ${scoreClass}">${score}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;

      list.appendChild(card);
    });

    // Click to change best pick
    list.querySelectorAll('.pc-photo-item').forEach((item) => {
      item.addEventListener('click', () => {
        const gi = parseInt(item.dataset.gi);
        const pi = parseInt(item.dataset.pi);
        changeBestPick(gi, pi);
      });
    });
  }

  function changeBestPick(groupIndex, photoIndex) {
    if (!scanResults) return;
    const group = scanResults.groups[groupIndex];
    group.bestId = group.photos[photoIndex].id;
    group.bestScore = group.photos[photoIndex].quality.total;
    renderResults();
  }

  // ── Delete ──
  async function confirmDelete() {
    if (!scanResults) return;

    const checkedGroups = scanResults.groups.filter((_, i) => {
      const cb = document.querySelector(`.pc-group-check[data-gi="${i}"]`);
      return cb && cb.checked;
    });

    const toDelete = [];
    checkedGroups.forEach((group) => {
      group.photos.forEach((p) => {
        if (p.id !== group.bestId) {
          toDelete.push(p);
        }
      });
    });

    if (toDelete.length === 0) return;

    const ok = confirm(`${toDelete.length}장의 사진을 정리할까요?\n(iCloud에서 삭제됩니다)`);
    if (!ok) return;

    showView('deleting');
    try {
      await chrome.runtime.sendMessage({
        type: MSG.CONFIRM_DELETE,
        payload: { photoIds: toDelete.map((p) => p.id) },
      });
      startDeletePolling();
    } catch (err) {
      showError('삭제 시작 실패: ' + err.message);
    }
  }

  let deletePollTimer = null;

  function startDeletePolling() {
    deletePollTimer = setInterval(async () => {
      try {
        const data = await chrome.storage.local.get(STORAGE_KEYS.SCAN_STATE);
        const state = data[STORAGE_KEYS.SCAN_STATE];
        if (!state) return;

        if (state.state === UI_STATE.DELETING) {
          const pct = state.deleteProgress || 0;
          $('deleteProgressFill').style.width = pct + '%';
          $('deletePercent').textContent = pct + '%';
          $('deleteDetail').textContent = state.deleteDetail || '처리 중...';
        } else if (state.state === UI_STATE.DONE) {
          clearInterval(deletePollTimer);
          $('doneCount').textContent = state.deletedCount || 0;
          showView('done');
        } else if (state.state === UI_STATE.ERROR) {
          clearInterval(deletePollTimer);
          showError(state.error || '삭제 중 오류 발생');
        }
      } catch { /* ignore */ }
    }, 500);
  }

  // ── Error ──
  function showError(msg) {
    $('errorMessage').textContent = msg;
    showView('error');
  }

  // ── Events ──
  function bindEvents() {
    $('scanBtn').addEventListener('click', startScan);
    $('stopScanBtn').addEventListener('click', stopScan);
    $('cleanBtn').addEventListener('click', confirmDelete);
    $('rescanBtn').addEventListener('click', startScan);
    $('doneBtn').addEventListener('click', () => showView('idle'));
    $('errorRetryBtn').addEventListener('click', () => showView('idle'));

    // Settings
    $('settingsBtn').addEventListener('click', () => {
      previousView = currentView;
      showView('settings');
    });
    $('settingsBackBtn').addEventListener('click', () => {
      saveSettings();
      showView(previousView);
    });
    $('thresholdSlider').addEventListener('input', (e) => {
      $('thresholdValue').textContent = e.target.value;
    });
    $('maxPhotosSlider').addEventListener('input', (e) => {
      $('maxPhotosValue').textContent = e.target.value;
    });
  }

  // ── Start ──
  init();
})();
