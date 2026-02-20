(function () {
  'use strict';

  // --- DOM refs ---
  const $loading = document.getElementById('loading');
  const $error = document.getElementById('error');
  const $content = document.getElementById('content');
  const $refreshBtn = document.getElementById('refreshBtn');
  const $lastUpdate = document.getElementById('lastUpdate');

  const $fiveHourBar = document.getElementById('fiveHourBar');
  const $fiveHourPct = document.getElementById('fiveHourPct');
  const $fiveHourReset = document.getElementById('fiveHourReset');

  const $sevenDayBar = document.getElementById('sevenDayBar');
  const $sevenDayPct = document.getElementById('sevenDayPct');
  const $sevenDayReset = document.getElementById('sevenDayReset');

  let countdownInterval = null;
  let currentUsage = null;

  // --- Init ---
  loadUsage();
  $refreshBtn.addEventListener('click', refreshUsage);

  // --- Load (try cache first, then fresh) ---
  async function loadUsage() {
    showLoading();

    try {
      // Try cached data first for instant display
      const cached = await sendMessage({ type: 'GET_CACHED_USAGE' });
      if (cached?.data) {
        renderUsage(cached.data, cached.updatedAt);
      }

      // Then fetch fresh data
      const result = await sendMessage({ type: 'REFRESH_USAGE' });
      if (result?.success && result.data) {
        renderUsage(result.data, Date.now());
      } else if (!cached?.data) {
        showError();
      }
    } catch (e) {
      console.error('[CUW] loadUsage error:', e);
      showError();
    }
  }

  async function refreshUsage() {
    $refreshBtn.classList.add('spinning');

    try {
      const result = await sendMessage({ type: 'REFRESH_USAGE' });
      if (result?.success && result.data) {
        renderUsage(result.data, Date.now());
      } else {
        showError();
      }
    } catch (e) {
      showError();
    } finally {
      $refreshBtn.classList.remove('spinning');
    }
  }

  // --- Render ---
  function renderUsage(data, updatedAt) {
    currentUsage = data;

    $loading.classList.add('hidden');
    $error.classList.add('hidden');
    $content.classList.remove('hidden');

    // 5-hour window
    const fiveHour = data.five_hour || {};
    setBar($fiveHourBar, $fiveHourPct, fiveHour.utilization ?? 0);
    setResetTimer($fiveHourReset, fiveHour.resets_at);

    // 7-day window
    const sevenDay = data.seven_day || {};
    setBar($sevenDayBar, $sevenDayPct, sevenDay.utilization ?? 0);
    setResetTimer($sevenDayReset, sevenDay.resets_at);

    // Last update
    if (updatedAt) {
      $lastUpdate.textContent = `마지막 업데이트: ${formatTime(new Date(updatedAt))}`;
    }

    // Start countdown
    startCountdown();
  }

  function setBar($bar, $pct, utilization) {
    const pct = Math.round(utilization);
    $bar.style.width = `${Math.max(pct, 2)}%`;
    $pct.textContent = `${pct}% 사용됨`;

    $bar.classList.remove('warning', 'danger');
    if (pct >= THRESHOLDS.DANGER) {
      $bar.classList.add('danger');
    } else if (pct >= THRESHOLDS.WARNING) {
      $bar.classList.add('warning');
    }
  }

  function setResetTimer($el, resetAt) {
    if (!resetAt) {
      $el.textContent = '';
      return;
    }
    $el.textContent = formatCountdown(resetAt);
  }

  // --- Countdown ---
  function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
      if (!currentUsage) return;

      if (currentUsage.five_hour?.resets_at) {
        $fiveHourReset.textContent = formatCountdown(currentUsage.five_hour.resets_at);
      }
      if (currentUsage.seven_day?.resets_at) {
        $sevenDayReset.textContent = formatCountdown(currentUsage.seven_day.resets_at);
      }
    }, 1000);
  }

  // --- Helpers ---
  function formatCountdown(isoString) {
    const diff = new Date(isoString) - Date.now();
    if (diff <= 0) return '곧 재설정됩니다';

    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      const remainHours = hours % 24;
      return `${days}일 ${remainHours}시간 후 재설정`;
    }

    if (hours > 0) {
      return `${hours}시간 ${mins}분 후 재설정`;
    }

    return `${mins}분 ${secs}초 후 재설정`;
  }

  function formatTime(date) {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  function showLoading() {
    $loading.classList.remove('hidden');
    $error.classList.add('hidden');
    $content.classList.add('hidden');
  }

  function showError() {
    $loading.classList.add('hidden');
    $error.classList.remove('hidden');
    $content.classList.add('hidden');
  }

  function sendMessage(msg) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(msg, (response) => {
        if (chrome.runtime.lastError) {
          console.error('[CUW]', chrome.runtime.lastError.message);
          resolve(null);
        } else {
          resolve(response);
        }
      });
    });
  }
})();
