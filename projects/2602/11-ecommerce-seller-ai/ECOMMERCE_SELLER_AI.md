# ListingPro AI - E-commerce Seller AI Chrome Extension

## 개요
Etsy/Amazon/쿠팡 상품 페이지에서 1클릭으로 SEO 최적화 제목+설명+태그를 AI로 생성하는 Chrome 확장 프로그램.

## 기술 스택
- Chrome Extension (Manifest v3)
- Content Scripts: Vanilla JS (Etsy/Amazon/Coupang DOM 파싱)
- Background: Service Worker (AI API 호출, module type)
- Popup: 상태 감지 → 최적화 실행 → 결과 표시 (팝업 내)
- AI: Claude Haiku API
- 데이터 추출: `chrome.scripting.executeScript` (popup에서 직접 주입)
- Auth: Chrome Storage (MVP) → Supabase (Phase 2)
- Billing: Stripe (Phase 2)

## 프로젝트 구조
```
11-ecommerce-seller-ai/
├── manifest.json            # Extension manifest v3
├── popup/
│   ├── index.html           # 팝업 UI (상태+버튼+결과 영역)
│   ├── style.css            # 팝업 스타일 (결과 카드 포함)
│   └── app.js               # 팝업 로직 (추출→최적화→표시)
├── content/
│   ├── shared.js            # 공통 유틸 (버튼, 오버레이, 메시지)
│   ├── etsy.js              # Etsy 페이지 파서 + SPA 네비게이션
│   ├── amazon.js            # Amazon 페이지 파서 + SPA 네비게이션
│   └── coupang.js           # 쿠팡 페이지 파서 + SPA 네비게이션
├── background/
│   └── service-worker.js    # AI API 호출, 메시지 라우팅, 데모 모드
├── lib/
│   ├── constants.js         # 공통 상수, 메시지 타입, 데이터 계약
│   ├── ai-client.js         # Claude API 래퍼
│   ├── prompts.js           # AI 프롬프트 (Etsy/Amazon/쿠팡)
│   └── usage-tracker.js     # 사용량 추적
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── styles/
│   └── content.css          # Content script 스타일
└── ECOMMERCE_SELLER_AI.md   # 이 파일
```

## 핵심 아키텍처 (Popup 기반)
1. 팝업 열림 → `chrome.tabs.query`로 현재 탭 URL 확인
2. Etsy/Amazon/쿠팡 상품 페이지 감지 시 "Optimize with AI" 버튼 표시
3. 버튼 클릭 → `chrome.scripting.executeScript`로 페이지 데이터 추출
4. 추출 데이터 → `chrome.runtime.sendMessage`로 Background에 전송
5. Background → Claude API 호출 (또는 데모 모드 샘플 반환)
6. 결과를 **팝업 안에** 표시 (SEO 점수, 제목, 설명, 태그, 개선점 등)
7. 각 항목 "Copy" 버튼으로 클립보드 복사

> **설계 결정**: 페이지 내 오버레이 대신 팝업 내 표시 방식 채택 — 호스트 페이지 CSS/DOM 충돌 없음

## MVP 기능 (Phase 1)
- [x] 프로젝트 구조 + manifest
- [x] 공통 인터페이스 (constants.js)
- [x] Etsy 상품 페이지 파싱 (content/etsy.js)
- [x] Amazon 상품 페이지 파싱 (content/amazon.js)
- [x] 쿠팡 상품 페이지 파싱 (content/coupang.js)
- [x] AI 리스팅 최적화 (Claude Haiku) - ai-client.js + prompts.js
- [x] 쿠팡 전용 한국어 프롬프트 (prompts.js)
- [x] Popup UI — 상태 감지 + Optimize 버튼 + 결과 표시 + 복사
- [x] 데모 모드 (API 키 없을 때 플랫폼별 샘플 결과)
- [x] Background Service Worker (메시지 라우팅, 사용량 추적)
- [x] SPA 네비게이션 처리 (pushState, MutationObserver)
- [ ] 아이콘 PNG 생성 (icons/generate-icons.html → 브라우저에서 다운로드)
- [ ] 쿠팡 DOM 셀렉터 실제 페이지 검증 및 조정

## Phase 2 (향후)
- [ ] Supabase 인증 + 사용자 계정
- [ ] Stripe 구독 결제
- [ ] Shopify 지원
- [ ] 벌크 최적화
- [ ] 경쟁사 분석
- [ ] 랜딩 페이지

## 지원 플랫폼
| 플랫폼 | URL 패턴 | 상태 |
|--------|---------|------|
| Etsy | `etsy.com/listing/` | 구현 완료 |
| Amazon | `amazon.*/dp/`, `amazon.*/gp/product/` (10개국) | 구현 완료 |
| 쿠팡 | `coupang.com/vp/products/` | 구현 완료 (셀렉터 검증 필요) |

## 가격 정책
| 플랜 | 가격 | 제한 |
|------|------|------|
| Free | $0 | 일 3회 분석 |
| Starter | $15/월 | 일 20회 + AI 생성 |
| Pro | $39/월 | 무제한 + 니치 추천 + 트렌드 |

## 테스트 방법
1. `icons/generate-icons.html`을 브라우저에서 열어 아이콘 PNG 다운로드 → icons/ 폴더에 저장
2. Chrome → `chrome://extensions` → "개발자 모드" → "압축해제된 확장 프로그램을 로드합니다"
3. 이 프로젝트 폴더 선택
4. 쿠팡/Etsy/Amazon 상품 페이지 열기
5. 확장 아이콘 클릭 → 팝업에서 플랫폼 감지 확인
6. "Optimize with AI" 클릭 → 데모 결과 확인 (또는 API 키 입력 후 실제 AI 결과)

## 상태
- Phase 1 MVP: 쿠팡 추가 + 팝업 기반 최적화 플로우 완성 (데모 모드 동작 확인)
- 쿠팡 감지 및 데모 결과 표시 테스트 완료
- 다음: 아이콘 생성 → 쿠팡 셀렉터 실제 페이지 검증 → Phase 2
