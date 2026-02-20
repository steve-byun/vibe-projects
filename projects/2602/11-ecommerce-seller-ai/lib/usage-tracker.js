/**
 * ListingPro AI - Usage Tracker
 * 일일 사용량 추적 (chrome.storage.local 기반)
 */

// constants.js는 content script에서는 전역으로 주입되지만,
// service worker (module)에서는 import 필요
// 직접 키 참조하여 의존성 순환 방지
const KEYS = {
  USAGE_COUNT: 'listingpro_usage_count',
  USAGE_RESET_DATE: 'listingpro_usage_reset',
};

const DAILY_LIMIT = 3;

/**
 * 오늘 날짜 문자열 (YYYY-MM-DD)
 */
function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * 날짜가 바뀌었으면 카운터 리셋
 */
export async function resetIfNewDay() {
  const data = await chrome.storage.local.get([KEYS.USAGE_RESET_DATE, KEYS.USAGE_COUNT]);
  const today = getTodayString();

  if (data[KEYS.USAGE_RESET_DATE] !== today) {
    await chrome.storage.local.set({
      [KEYS.USAGE_COUNT]: 0,
      [KEYS.USAGE_RESET_DATE]: today,
    });
    return true; // 리셋됨
  }
  return false;
}

/**
 * 현재 사용량 확인
 * @returns {Promise<{ count: number, limit: number, canUse: boolean, resetTime: string }>}
 */
export async function checkUsage() {
  await resetIfNewDay();
  const data = await chrome.storage.local.get([KEYS.USAGE_COUNT]);
  const count = data[KEYS.USAGE_COUNT] || 0;

  // 다음 리셋 시간: 내일 00:00
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return {
    count,
    limit: DAILY_LIMIT,
    canUse: count < DAILY_LIMIT,
    resetTime: tomorrow.toISOString(),
  };
}

/**
 * 사용 횟수 1 증가
 */
export async function incrementUsage() {
  await resetIfNewDay();
  const data = await chrome.storage.local.get([KEYS.USAGE_COUNT]);
  const count = (data[KEYS.USAGE_COUNT] || 0) + 1;
  await chrome.storage.local.set({ [KEYS.USAGE_COUNT]: count });
  return count;
}
