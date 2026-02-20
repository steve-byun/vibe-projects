/**
 * ListingPro AI - AI Prompt Templates
 * 플랫폼별 최적화/분석 프롬프트
 */

// ============================================================
// Etsy 프롬프트
// ============================================================

const ETSY_OPTIMIZE_SYSTEM = `You are an expert Etsy SEO specialist and copywriter with deep knowledge of Etsy's search algorithm, buyer psychology, and marketplace trends. Your goal is to maximize listing visibility and conversion rate.`;

function buildEtsyOptimizePrompt(listing) {
  return `Optimize this Etsy listing for maximum visibility and conversion.

Input listing:
- Title: ${listing.title || '(not provided)'}
- Description: ${listing.description || '(not provided)'}
- Tags: ${(listing.tags || []).join(', ') || '(none)'}
- Price: ${listing.price || '(not provided)'}
- Category: ${listing.category || '(not provided)'}

Generate an optimized version following these rules:
1. SEO-optimized title (max 140 chars, front-load primary keywords, use natural phrasing)
2. Compelling description (benefits-focused, weave keywords naturally, include a strong opening hook, keep paragraphs short)
3. Exactly 13 optimized tags (mix of long-tail and short keywords, no duplicating title words unnecessarily)
4. SEO Score (0-100) with brief justification
5. List of specific improvements made vs. the original

Respond ONLY in JSON format:
{
  "title": "...",
  "description": "...",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10", "tag11", "tag12", "tag13"],
  "bulletPoints": [],
  "seoScore": 85,
  "improvements": ["Improvement 1", "Improvement 2"],
  "keywords": ["keyword1", "keyword2"]
}`;
}

const ETSY_ANALYZE_SYSTEM = `You are an expert Etsy SEO analyst. You evaluate listings and provide actionable feedback to improve search ranking and conversion.`;

function buildEtsyAnalyzePrompt(listing) {
  return `Analyze this Etsy listing's SEO performance and provide actionable feedback.

Listing:
- Title: ${listing.title || '(not provided)'}
- Description: ${listing.description || '(not provided)'}
- Tags: ${(listing.tags || []).join(', ') || '(none)'}
- Price: ${listing.price || '(not provided)'}
- Category: ${listing.category || '(not provided)'}
- Rating: ${listing.rating || 'N/A'}
- Reviews: ${listing.reviewCount ?? 'N/A'}

Evaluate:
1. Title SEO quality (keyword placement, length, readability)
2. Description effectiveness (hook, benefits, keyword density)
3. Tag optimization (relevance, variety, long-tail coverage)
4. Overall SEO score (0-100)
5. Top 5 specific, actionable improvements

Respond ONLY in JSON format:
{
  "seoScore": 72,
  "improvements": ["Improvement 1", "Improvement 2", "Improvement 3", "Improvement 4", "Improvement 5"],
  "keywords": ["suggested keyword 1", "suggested keyword 2"],
  "competitorInsights": "Brief competitive analysis summary"
}`;
}

// ============================================================
// Amazon 프롬프트
// ============================================================

const AMAZON_OPTIMIZE_SYSTEM = `You are an expert Amazon listing optimization specialist with deep knowledge of Amazon's A9/A10 search algorithm, PPC relevance, and conversion rate optimization. Your goal is to maximize organic rank and sales.`;

function buildAmazonOptimizePrompt(listing) {
  return `Optimize this Amazon product listing for maximum search visibility and conversion.

Input listing:
- Title: ${listing.title || '(not provided)'}
- Bullet Points: ${(listing.bulletPoints || []).map((b, i) => `\n  ${i + 1}. ${b}`).join('') || '(none)'}
- Description: ${listing.description || '(not provided)'}
- Price: ${listing.price || '(not provided)'}
- Category: ${listing.category || '(not provided)'}

Generate an optimized version following these rules:
1. SEO-optimized title (max 200 chars, format: Brand + Primary Keywords + Key Attributes + Size/Color)
2. 5 bullet points in feature-to-benefit format (start each with a CAPS keyword, then explain benefit)
3. Compelling description with HTML formatting hints (paragraph breaks, bold key phrases)
4. Backend keyword suggestions (terms NOT already in title/bullets)
5. SEO Score (0-100) with A9 algorithm justification
6. Specific improvements vs. original

Respond ONLY in JSON format:
{
  "title": "...",
  "description": "...",
  "tags": ["backend keyword 1", "backend keyword 2"],
  "bulletPoints": ["KEYWORD - Benefit-focused bullet 1", "KEYWORD - Benefit-focused bullet 2", "KEYWORD - Benefit-focused bullet 3", "KEYWORD - Benefit-focused bullet 4", "KEYWORD - Benefit-focused bullet 5"],
  "seoScore": 85,
  "improvements": ["Improvement 1", "Improvement 2"],
  "keywords": ["keyword1", "keyword2"]
}`;
}

const AMAZON_ANALYZE_SYSTEM = `You are an expert Amazon listing analyst. You evaluate product listings against A9/A10 algorithm best practices and provide actionable optimization feedback.`;

function buildAmazonAnalyzePrompt(listing) {
  return `Analyze this Amazon listing's SEO and conversion performance.

Listing:
- Title: ${listing.title || '(not provided)'}
- Bullet Points: ${(listing.bulletPoints || []).map((b, i) => `\n  ${i + 1}. ${b}`).join('') || '(none)'}
- Description: ${listing.description || '(not provided)'}
- Price: ${listing.price || '(not provided)'}
- Category: ${listing.category || '(not provided)'}
- Rating: ${listing.rating || 'N/A'}
- Reviews: ${listing.reviewCount ?? 'N/A'}

Evaluate:
1. Title optimization (keyword density, brand placement, length)
2. Bullet point effectiveness (feature-benefit format, keyword usage)
3. Description quality (persuasiveness, keyword coverage)
4. A9 algorithm compliance
5. Overall SEO score (0-100)
6. Top 5 specific, actionable improvements

Respond ONLY in JSON format:
{
  "seoScore": 72,
  "improvements": ["Improvement 1", "Improvement 2", "Improvement 3", "Improvement 4", "Improvement 5"],
  "keywords": ["suggested keyword 1", "suggested keyword 2"],
  "competitorInsights": "Brief competitive analysis and positioning advice"
}`;
}

// ============================================================
// Coupang 프롬프트
// ============================================================

const COUPANG_OPTIMIZE_SYSTEM = `You are an expert Coupang (쿠팡) listing optimization specialist with deep knowledge of Coupang's search algorithm, Korean e-commerce SEO, and Korean consumer psychology. You understand Coupang Wing/Rocket seller platform rules and best practices. Respond in Korean.`;

function buildCoupangOptimizePrompt(listing) {
  return `쿠팡 상품 리스팅을 검색 노출 및 전환율 극대화를 위해 최적화하세요.

입력 리스팅:
- 제목: ${listing.title || '(미제공)'}
- 설명: ${listing.description || '(미제공)'}
- 속성: ${(listing.bulletPoints || []).map((b, i) => `\n  ${i + 1}. ${b}`).join('') || '(없음)'}
- 가격: ${listing.price || '(미제공)'}
- 카테고리: ${listing.category || '(미제공)'}
- 태그/키워드: ${(listing.tags || []).join(', ') || '(없음)'}

다음 규칙을 따라 최적화된 버전을 생성하세요:
1. SEO 최적화 제목 (최대 100자, 핵심 키워드 앞배치, 브랜드+핵심속성+용도 형식)
2. 설득력 있는 상품 설명 (혜택 중심, 신뢰감 구축, 핵심 정보 먼저)
3. 5개 핵심 특징/속성 (구매 결정에 영향을 주는 정보 중심)
4. 10개 검색 키워드 (쿠팡 내부 검색 최적화, 롱테일+단기 키워드 믹스)
5. SEO 점수 (0-100)와 근거
6. 원본 대비 구체적인 개선 사항

JSON 형식으로만 응답:
{
  "title": "...",
  "description": "...",
  "tags": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5", "키워드6", "키워드7", "키워드8", "키워드9", "키워드10"],
  "bulletPoints": ["핵심 특징 1", "핵심 특징 2", "핵심 특징 3", "핵심 특징 4", "핵심 특징 5"],
  "seoScore": 85,
  "improvements": ["개선 사항 1", "개선 사항 2"],
  "keywords": ["추가 추천 키워드1", "추가 추천 키워드2"],
  "competitorInsights": "경쟁 분석 요약"
}`;
}

const COUPANG_ANALYZE_SYSTEM = `You are an expert Coupang (쿠팡) listing analyst. You evaluate product listings against Coupang's search algorithm and Korean e-commerce best practices. Respond in Korean.`;

function buildCoupangAnalyzePrompt(listing) {
  return `이 쿠팡 상품 리스팅의 SEO 및 전환 성과를 분석하세요.

리스팅:
- 제목: ${listing.title || '(미제공)'}
- 설명: ${listing.description || '(미제공)'}
- 속성: ${(listing.bulletPoints || []).map((b, i) => `\n  ${i + 1}. ${b}`).join('') || '(없음)'}
- 가격: ${listing.price || '(미제공)'}
- 카테고리: ${listing.category || '(미제공)'}
- 평점: ${listing.rating || 'N/A'}
- 리뷰 수: ${listing.reviewCount ?? 'N/A'}

평가 항목:
1. 제목 최적화 (키워드 배치, 길이, 가독성)
2. 설명 효과 (설득력, 키워드 밀도, 정보 완성도)
3. 카테고리 및 속성 정확성
4. 전체 SEO 점수 (0-100)
5. 상위 5개 구체적 개선 방안

JSON 형식으로만 응답:
{
  "seoScore": 72,
  "improvements": ["개선 1", "개선 2", "개선 3", "개선 4", "개선 5"],
  "keywords": ["추천 키워드 1", "추천 키워드 2"],
  "competitorInsights": "경쟁 분석 및 포지셔닝 조언"
}`;
}

// ============================================================
// 프롬프트 선택 헬퍼
// ============================================================

/**
 * 플랫폼과 액션에 맞는 프롬프트 반환
 * @param {'etsy'|'amazon'|'coupang'} platform
 * @param {'optimize'|'analyze'} action
 * @param {object} listing - 리스팅 데이터
 * @returns {{ system: string, user: string }}
 */
export function getPrompts(platform, action, listing) {
  if (platform === 'etsy') {
    if (action === 'optimize') {
      return { system: ETSY_OPTIMIZE_SYSTEM, user: buildEtsyOptimizePrompt(listing) };
    }
    return { system: ETSY_ANALYZE_SYSTEM, user: buildEtsyAnalyzePrompt(listing) };
  }

  if (platform === 'coupang') {
    if (action === 'optimize') {
      return { system: COUPANG_OPTIMIZE_SYSTEM, user: buildCoupangOptimizePrompt(listing) };
    }
    return { system: COUPANG_ANALYZE_SYSTEM, user: buildCoupangAnalyzePrompt(listing) };
  }

  // amazon (default)
  if (action === 'optimize') {
    return { system: AMAZON_OPTIMIZE_SYSTEM, user: buildAmazonOptimizePrompt(listing) };
  }
  return { system: AMAZON_ANALYZE_SYSTEM, user: buildAmazonAnalyzePrompt(listing) };
}
