/**
 * ListingPro AI - Shared Constants & Data Contracts
 *
 * 이 파일은 content scripts, background worker, popup 간의 공통 계약입니다.
 * 모든 모듈이 이 인터페이스를 따릅니다.
 */

// ============================================================
// 플랫폼 상수
// ============================================================
const PLATFORMS = {
  ETSY: 'etsy',
  AMAZON: 'amazon',
  COUPANG: 'coupang',
};

// ============================================================
// 메시지 타입 (Content Script ↔ Background Service Worker)
// ============================================================
const MSG = {
  // Content → Background
  ANALYZE_LISTING: 'ANALYZE_LISTING',
  OPTIMIZE_LISTING: 'OPTIMIZE_LISTING',

  // Background → Content (response)
  ANALYSIS_RESULT: 'ANALYSIS_RESULT',
  OPTIMIZED_LISTING: 'OPTIMIZED_LISTING',

  // Popup → Background
  GET_STATUS: 'GET_STATUS',
  GET_API_KEY: 'GET_API_KEY',
  SET_API_KEY: 'SET_API_KEY',
  GET_USAGE: 'GET_USAGE',

  // Background → Popup (response)
  STATUS_RESULT: 'STATUS_RESULT',
};

// ============================================================
// 추출된 리스팅 데이터 구조 (Content Script가 생성)
// ============================================================
// ListingData = {
//   platform: 'etsy' | 'amazon',
//   title: string,
//   description: string,
//   tags: string[],           // Etsy: 최대 13개 태그
//   bulletPoints: string[],   // Amazon: 5개 bullet points
//   price: string,            // 예: "$24.99"
//   currency: string,         // 예: "USD"
//   category: string,
//   images: string[],         // 이미지 URL 배열
//   url: string,              // 현재 페이지 URL
//   shopName: string,         // 셀러/샵 이름
//   rating: string,           // 평점
//   reviewCount: number,      // 리뷰 수
// }

// ============================================================
// 최적화 결과 구조 (Background Worker가 생성)
// ============================================================
// OptimizedListing = {
//   title: string,
//   description: string,
//   tags: string[],
//   bulletPoints: string[],
//   seoScore: number,          // 0-100
//   improvements: string[],    // 개선 사항 리스트
//   keywords: string[],        // 추천 키워드
//   competitorInsights: string, // 경쟁 분석 요약 (선택)
// }

// ============================================================
// UI 상태
// ============================================================
const UI_STATE = {
  IDLE: 'idle',
  EXTRACTING: 'extracting',
  ANALYZING: 'analyzing',
  OPTIMIZING: 'optimizing',
  DONE: 'done',
  ERROR: 'error',
};

// ============================================================
// 스토리지 키
// ============================================================
const STORAGE_KEYS = {
  API_KEY: 'listingpro_api_key',
  USAGE_COUNT: 'listingpro_usage_count',
  USAGE_RESET_DATE: 'listingpro_usage_reset',
  USER_SETTINGS: 'listingpro_settings',
  LAST_RESULT: 'listingpro_last_result',
};

// ============================================================
// 무료 플랜 제한
// ============================================================
const FREE_PLAN = {
  DAILY_LIMIT: 3,
};
