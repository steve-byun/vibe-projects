const API_BASE = 'https://claude.ai/api';

const ENDPOINTS = {
  ORGANIZATIONS: `${API_BASE}/organizations`,
  USAGE: (orgId) => `${API_BASE}/organizations/${orgId}/usage`,
};

const STORAGE_KEYS = {
  ORG_ID: 'claude_org_id',
  LAST_USAGE: 'claude_last_usage',
  LAST_UPDATE: 'claude_last_update',
};

const BADGE_COLORS = {
  GOOD: '#4A9960',
  WARNING: '#D4A843',
  DANGER: '#D94F3D',
  INACTIVE: '#888888',
};

const REFRESH_INTERVAL_MINUTES = 1;

const THRESHOLDS = {
  WARNING: 50,
  DANGER: 80,
};

const ALERT_LEVELS = [50, 75, 90];

const ALERT_MESSAGES = {
  50: { title: '사용량 50% 도달', msg: '세션 사용량이 절반을 넘었습니다.' },
  75: { title: '사용량 75% 경고', msg: '세션 사용량이 75%에 도달했습니다. 속도를 조절하세요!' },
  90: { title: '사용량 90% 위험!', msg: '세션 한도가 거의 소진됩니다. 리셋까지 아껴 쓰세요!' },
};

const STORAGE_KEYS_ALERTS = {
  NOTIFIED_LEVELS: 'claude_notified_levels',
  LAST_RESET_AT: 'claude_last_reset_at',
};

// VSCode Bridge (로컬 HTTP 서버)
const BRIDGE_URL = 'http://localhost:19283/usage';
