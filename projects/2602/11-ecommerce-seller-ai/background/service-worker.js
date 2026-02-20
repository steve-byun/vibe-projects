/**
 * ListingPro AI - Background Service Worker
 * 메시지 라우팅 + AI 호출 오케스트레이터
 * Manifest v3 service worker (type: "module")
 */

import { callClaude, parseJsonResponse } from '../lib/ai-client.js';
import { getPrompts } from '../lib/prompts.js';
import { checkUsage, incrementUsage, resetIfNewDay } from '../lib/usage-tracker.js';

// constants.js는 service worker에서 전역 주입이 안 되므로 직접 정의
const MSG = {
  ANALYZE_LISTING: 'ANALYZE_LISTING',
  OPTIMIZE_LISTING: 'OPTIMIZE_LISTING',
  ANALYSIS_RESULT: 'ANALYSIS_RESULT',
  OPTIMIZED_LISTING: 'OPTIMIZED_LISTING',
  GET_STATUS: 'GET_STATUS',
  GET_API_KEY: 'GET_API_KEY',
  SET_API_KEY: 'SET_API_KEY',
  GET_USAGE: 'GET_USAGE',
  STATUS_RESULT: 'STATUS_RESULT',
};

const STORAGE_KEYS = {
  API_KEY: 'listingpro_api_key',
};

// ============================================================
// API Key 헬퍼
// ============================================================

async function getApiKey() {
  const data = await chrome.storage.local.get([STORAGE_KEYS.API_KEY]);
  return data[STORAGE_KEYS.API_KEY] || null;
}

async function setApiKey(key) {
  await chrome.storage.local.set({ [STORAGE_KEYS.API_KEY]: key });
}

// ============================================================
// 데모 모드 (API 키 없을 때 샘플 결과 반환)
// ============================================================

function generateDemoResult(listing) {
  const platform = listing.platform || 'etsy';
  const originalTitle = listing.title || 'Sample Product';
  const truncated = originalTitle.slice(0, 50);

  if (platform === 'etsy') {
    return {
      title: `${truncated} - Handmade Gift | Unique Design | Free Shipping | Perfect for Home Decor`,
      description: `Discover this beautifully crafted ${truncated}. Made with premium materials and attention to detail, this piece is perfect for adding a touch of elegance to your space.\n\n✨ WHY YOU'LL LOVE IT:\n• Handcrafted with care and precision\n• Premium quality materials\n• Makes a perfect gift for any occasion\n• Ships within 1-3 business days\n\n📦 SHIPPING & RETURNS:\nWe offer free standard shipping on all orders. Not satisfied? Return within 30 days for a full refund.`,
      tags: [
        'handmade gift', 'unique home decor', 'personalized gift',
        'birthday gift for her', 'custom made', 'artisan crafted',
        'boho home decor', 'minimalist design', 'eco friendly gift',
        'housewarming gift', 'anniversary gift', 'wall art decor', 'gift idea'
      ],
      bulletPoints: [],
      seoScore: 82,
      improvements: [
        'Front-loaded primary keywords in title for better search visibility',
        'Added emotional trigger words (unique, perfect, handmade) to boost CTR',
        'Expanded to all 13 Etsy tags with long-tail keyword mix',
        'Structured description with benefit-focused bullet points',
        'Added shipping info to reduce buyer hesitation'
      ],
      keywords: ['handmade', 'gift for her', 'home decor', 'unique gift', 'artisan', 'boho'],
      competitorInsights: 'Top sellers in this category use 130+ character titles and emphasize "free shipping" and "gift ready" in their first 3 tags.',
    };
  }

  if (platform === 'coupang') {
    return {
      title: `${truncated} 프리미엄 품질 | 무료배송 | 로켓배송 가능 | 선물용 추천`,
      description: `${truncated} - 프리미엄 소재로 제작된 고품질 제품입니다.\n\n✅ 제품 특징:\n• 프리미엄 소재로 내구성이 뛰어남\n• 가볍고 실용적인 디자인\n• 선물용으로 최적화된 패키징\n• 로켓배송으로 빠른 수령 가능\n\n📦 배송 안내:\n로켓배송 대상 상품 - 쿠팡에서 직접 배송합니다.\n무료 반품 가능 (30일 이내)`,
      tags: [
        '프리미엄', '무료배송', '선물추천', '인기상품', '로켓배송',
        '가성비', '베스트셀러', '신상품', '할인', '추천'
      ],
      bulletPoints: [
        '프리미엄 소재 - 고급 원단/재질로 오래 사용 가능한 내구성',
        '실용적 디자인 - 일상에서 편리하게 사용할 수 있는 실용적 구조',
        '선물 추천 - 깔끔한 패키징으로 생일, 기념일 선물에 적합',
        '간편 사용 - 별도 도구 없이 바로 사용 가능한 편의성',
        '품질 보증 - 30일 무료 반품 + 1년 품질 보증'
      ],
      seoScore: 80,
      improvements: [
        '제목에 핵심 키워드를 앞부분에 배치하여 검색 노출 향상',
        '쿠팡 검색 알고리즘에 최적화된 제목 구조로 변경',
        '구매 전환율을 높이는 혜택 중심 설명 작성',
        '쿠팡 내부 검색에서 자주 사용되는 키워드 10개 추가',
        '모바일 화면 기준으로 핵심 정보를 상단에 배치'
      ],
      keywords: ['프리미엄', '선물', '가성비', '무료배송', '인기', '추천'],
      competitorInsights: '쿠팡 상위 판매자들은 평균 50-80자 제목을 사용하며, "무료배송", "로켓배송", "프리미엄" 키워드를 필수로 포함합니다.',
    };
  }

  // Amazon
  return {
    title: `${truncated} - Premium Quality | Perfect Gift Idea | Durable & Lightweight Design | For Home, Office & Travel`,
    description: `Upgrade your experience with this premium ${truncated}. Engineered for durability and designed for everyday use, this product delivers exceptional value.\n\nKey Benefits:\n• Built with high-grade materials for long-lasting performance\n• Lightweight and portable design\n• Makes an ideal gift for friends and family\n• 100% satisfaction guaranteed`,
    tags: ['premium quality', 'gift idea', 'home office', 'lightweight', 'durable design'],
    bulletPoints: [
      'PREMIUM MATERIALS - Crafted with high-quality components that ensure durability and long-lasting performance for daily use',
      'VERSATILE DESIGN - Perfect for home, office, or travel with a compact form factor that fits any lifestyle',
      'IDEAL GIFT - Comes in beautiful packaging, ready to gift for birthdays, holidays, or special occasions',
      'EASY TO USE - Simple setup with no tools required, get started in minutes right out of the box',
      'SATISFACTION GUARANTEED - Backed by our 30-day money-back guarantee and responsive customer support team'
    ],
    seoScore: 78,
    improvements: [
      'Restructured title with Brand + Keywords + Benefits format for A9 algorithm',
      'Created 5 benefit-focused bullet points with CAPS keyword openers',
      'Added backend keyword suggestions not already in title/bullets',
      'Improved description with persuasive copy and feature-benefit pairs',
      'Optimized for mobile-first display (key info in first 200 chars)'
    ],
    keywords: ['premium', 'gift', 'durable', 'lightweight', 'home office', 'portable'],
    competitorInsights: 'Top 10 competitors average 180-char titles. Most use "Premium" and "Gift" in title. Price range: $19.99-$34.99.',
  };
}

// ============================================================
// 리스팅 최적화
// ============================================================

async function handleOptimize(listing, sender) {
  const tabId = sender.tab?.id;

  // 사용량 체크
  const usage = await checkUsage();
  if (!usage.canUse) {
    return {
      success: false,
      error: `Daily limit reached (${usage.limit}/${usage.limit}). Resets at midnight. Upgrade for unlimited access.`,
    };
  }

  // API 키 확인 — 없으면 데모 모드
  const apiKey = await getApiKey();
  let result;

  if (!apiKey) {
    // 데모 모드: 1초 대기 후 샘플 결과 반환
    await new Promise(r => setTimeout(r, 1000));
    result = generateDemoResult(listing);
  } else {
    const platform = listing.platform || 'etsy';
    const { system, user } = getPrompts(platform, 'optimize', listing);

    try {
      const rawResponse = await callClaude(apiKey, system, user);
      const optimized = parseJsonResponse(rawResponse);

      result = {
        title: optimized.title || '',
        description: optimized.description || '',
        tags: Array.isArray(optimized.tags) ? optimized.tags : [],
        bulletPoints: Array.isArray(optimized.bulletPoints) ? optimized.bulletPoints : [],
        seoScore: typeof optimized.seoScore === 'number' ? optimized.seoScore : 0,
        improvements: Array.isArray(optimized.improvements) ? optimized.improvements : [],
        keywords: Array.isArray(optimized.keywords) ? optimized.keywords : [],
        competitorInsights: optimized.competitorInsights || '',
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // 사용량 증가
  await incrementUsage();

  // 탭으로도 결과 전송 (content script가 수신)
  if (tabId) {
    chrome.tabs.sendMessage(tabId, {
      type: MSG.OPTIMIZED_LISTING,
      payload: result,
    }).catch(() => { /* 탭이 닫혔을 수 있음 */ });
  }

  return { success: true, payload: result };
}

// ============================================================
// 리스팅 분석
// ============================================================

async function handleAnalyze(listing, sender) {
  const tabId = sender.tab?.id;

  // 사용량 체크
  const usage = await checkUsage();
  if (!usage.canUse) {
    return {
      success: false,
      error: `Daily limit reached (${usage.limit}/${usage.limit}). Resets at midnight.`,
    };
  }

  // API 키 확인
  const apiKey = await getApiKey();
  if (!apiKey) {
    return {
      success: false,
      error: 'API key is not set. Please add your Claude API key in the extension popup.',
    };
  }

  const platform = listing.platform || 'etsy';
  const { system, user } = getPrompts(platform, 'analyze', listing);

  try {
    const rawResponse = await callClaude(apiKey, system, user);
    const analysis = parseJsonResponse(rawResponse);

    const result = {
      seoScore: typeof analysis.seoScore === 'number' ? analysis.seoScore : 0,
      improvements: Array.isArray(analysis.improvements) ? analysis.improvements : [],
      keywords: Array.isArray(analysis.keywords) ? analysis.keywords : [],
      competitorInsights: analysis.competitorInsights || '',
    };

    // 사용량 증가
    await incrementUsage();

    // 탭으로 결과 전송
    if (tabId) {
      chrome.tabs.sendMessage(tabId, {
        type: MSG.ANALYSIS_RESULT,
        payload: result,
      }).catch(() => {});
    }

    return { success: true, payload: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ============================================================
// 메시지 리스너
// ============================================================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, payload } = message;

  // 비동기 처리를 위해 true 반환
  const handleAsync = async () => {
    // 매 요청마다 날짜 리셋 체크
    await resetIfNewDay();

    switch (type) {
      case MSG.OPTIMIZE_LISTING:
        return handleOptimize(payload, sender);

      case MSG.ANALYZE_LISTING:
        return handleAnalyze(payload, sender);

      case MSG.GET_STATUS: {
        const apiKey = await getApiKey();
        const usage = await checkUsage();
        return {
          success: true,
          payload: {
            hasApiKey: !!apiKey,
            usage,
          },
        };
      }

      case MSG.GET_API_KEY: {
        const key = await getApiKey();
        return { success: true, payload: { apiKey: key } };
      }

      case MSG.SET_API_KEY: {
        await setApiKey(payload?.apiKey || '');
        return { success: true };
      }

      case MSG.GET_USAGE: {
        const usageData = await checkUsage();
        return { success: true, payload: usageData };
      }

      default:
        return null; // 알 수 없는 메시지 무시
    }
  };

  handleAsync()
    .then(result => {
      if (result !== null) sendResponse(result);
    })
    .catch(err => {
      sendResponse({ success: false, error: err.message });
    });

  return true; // 비동기 sendResponse를 위해 필수
});

// ============================================================
// 설치/업데이트 이벤트
// ============================================================

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('ListingPro AI installed. Welcome!');
  }
});
