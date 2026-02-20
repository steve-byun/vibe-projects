importScripts('../lib/constants.js');

// --- Lifecycle ---

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('refreshUsage', { periodInMinutes: REFRESH_INTERVAL_MINUTES });
  updateBadge();
});

chrome.runtime.onStartup.addListener(() => {
  updateBadge();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'refreshUsage') {
    updateBadge();
  }
});

// --- API ---

async function getOrgId() {
  const cached = await chrome.storage.local.get(STORAGE_KEYS.ORG_ID);
  if (cached[STORAGE_KEYS.ORG_ID]) return cached[STORAGE_KEYS.ORG_ID];

  const cookie = await chrome.cookies.get({ url: 'https://claude.ai', name: 'lastActiveOrg' });
  if (cookie?.value) {
    await chrome.storage.local.set({ [STORAGE_KEYS.ORG_ID]: cookie.value });
    return cookie.value;
  }

  try {
    const cookieStr = await buildCookieString();
    const res = await fetch(ENDPOINTS.ORGANIZATIONS, { headers: { 'Cookie': cookieStr } });
    if (res.ok) {
      const orgs = await res.json();
      if (orgs[0]?.uuid) {
        await chrome.storage.local.set({ [STORAGE_KEYS.ORG_ID]: orgs[0].uuid });
        return orgs[0].uuid;
      }
    }
  } catch (e) {
    console.error('[CUW] getOrgId error:', e);
  }

  return null;
}

async function buildCookieString() {
  const cookies = await chrome.cookies.getAll({ url: 'https://claude.ai' });
  return cookies.map(c => `${c.name}=${c.value}`).join('; ');
}

async function fetchUsage() {
  const orgId = await getOrgId();
  if (!orgId) return null;

  try {
    const cookieStr = await buildCookieString();
    const res = await fetch(ENDPOINTS.USAGE(orgId), {
      headers: { 'Cookie': cookieStr },
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        await chrome.storage.local.remove(STORAGE_KEYS.ORG_ID);
      }
      return null;
    }

    const data = await res.json();

    await chrome.storage.local.set({
      [STORAGE_KEYS.LAST_USAGE]: data,
      [STORAGE_KEYS.LAST_UPDATE]: Date.now(),
    });

    // VSCode Bridge로 데이터 전송 (실패해도 무시)
    pushToBridge(data);

    return data;
  } catch (e) {
    console.error('[CUW] fetchUsage error:', e);
    return null;
  }
}

// --- VSCode Bridge ---

async function pushToBridge(data) {
  try {
    await fetch(BRIDGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    // Bridge 서버가 꺼져있으면 조용히 무시
  }
}

// --- Badge ---

async function updateBadge() {
  const usage = await fetchUsage();

  if (!usage) {
    chrome.action.setBadgeText({ text: '?' });
    chrome.action.setBadgeBackgroundColor({ color: BADGE_COLORS.INACTIVE });
    return;
  }

  const percent = Math.round(usage.five_hour?.utilization ?? 0);
  const text = `${percent}%`;

  let color;
  if (percent >= THRESHOLDS.DANGER) {
    color = BADGE_COLORS.DANGER;
  } else if (percent >= THRESHOLDS.WARNING) {
    color = BADGE_COLORS.WARNING;
  } else {
    color = BADGE_COLORS.GOOD;
  }

  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });

  await checkAlerts(usage);
}

// --- Notifications ---

async function checkAlerts(usage) {
  const percent = Math.round(usage.five_hour?.utilization ?? 0);
  const resetAt = usage.five_hour?.resets_at || '';

  // Load stored state
  const stored = await chrome.storage.local.get([
    STORAGE_KEYS_ALERTS.NOTIFIED_LEVELS,
    STORAGE_KEYS_ALERTS.LAST_RESET_AT,
  ]);

  let notified = stored[STORAGE_KEYS_ALERTS.NOTIFIED_LEVELS] || [];
  const lastResetAt = stored[STORAGE_KEYS_ALERTS.LAST_RESET_AT] || '';

  // If reset window changed, clear notification history
  if (resetAt && resetAt !== lastResetAt) {
    notified = [];
    await chrome.storage.local.set({
      [STORAGE_KEYS_ALERTS.LAST_RESET_AT]: resetAt,
      [STORAGE_KEYS_ALERTS.NOTIFIED_LEVELS]: [],
    });
  }

  // Check each alert level
  for (const level of ALERT_LEVELS) {
    if (percent >= level && !notified.includes(level)) {
      notified.push(level);
      await chrome.storage.local.set({
        [STORAGE_KEYS_ALERTS.NOTIFIED_LEVELS]: notified,
      });

      const info = ALERT_MESSAGES[level];
      chrome.notifications.create(`claude-usage-${level}`, {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: info.title,
        message: info.msg + `\n현재: ${percent}%`,
        priority: level >= 90 ? 2 : 1,
      });
    }
  }
}

// --- Message handling (popup ↔ service worker) ---

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'REFRESH_USAGE') {
    fetchUsage().then((data) => {
      updateBadge();
      sendResponse({ success: !!data, data });
    });
    return true;
  }

  if (msg.type === 'GET_CACHED_USAGE') {
    chrome.storage.local
      .get([STORAGE_KEYS.LAST_USAGE, STORAGE_KEYS.LAST_UPDATE])
      .then((result) => {
        sendResponse({
          data: result[STORAGE_KEYS.LAST_USAGE],
          updatedAt: result[STORAGE_KEYS.LAST_UPDATE],
        });
      });
    return true;
  }
});
