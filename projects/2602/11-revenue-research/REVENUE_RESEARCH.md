# Revenue Research (수익 리서치)

## 개요
실리콘밸리 스타트업 관점에서 최고 수익 기회를 발굴하기 위한 리서치 프로젝트.
3명의 C-Suite AI 에이전트 (CMO, COO/CTO, CRO)가 독립 분석 후 합의 도출.

## 에이전트 구성
| 역할 | 에이전트 파일 | 모델 | 담당 |
|------|-------------|------|------|
| CMO (마케팅) | `.claude/agents/product-manager.md` | Sonnet | 시장 트렌드, GTM, 성장 전략 |
| COO/CTO (운영/기술) | `.claude/agents/business-strategist.md` | Sonnet | 실행가능성, 유닛이코노믹스, Moat |
| CRO (수익) | `.claude/agents/sales-expert.md` | Sonnet | 수익성, 판매 퍼널, 고객 심리 |

## 산출물

### Phase 1: 글로벌 TOP 10 수익 모델 (실리콘밸리 관점)
- [cmo-analysis.md](cmo-analysis.md) — CMO 분석
- [coo-analysis.md](coo-analysis.md) — COO/CTO 분석
- [cro-analysis.md](cro-analysis.md) — CRO 분석
- [final-consensus.md](final-consensus.md) — 3자 합의 TOP 10

**합의 TOP 10:**
1. Vertical AI SaaS (만장일치 1위)
2. AI Agents / Infrastructure
3. AI Coding Tools
4. Cybersecurity AI
5. Defense Tech
6. Healthcare AI
7. Embedded Finance
8. Climate Tech
9. Creator AI + AI Governance
10. Robotics

### Phase 2: Chrome Extension Vertical AI 세부 분석
- [cmo-verticals.md](cmo-verticals.md) — CMO 버티컬 분석
- [coo-verticals.md](coo-verticals.md) — COO 버티컬 분석
- [cro-verticals.md](cro-verticals.md) — CRO 버티컬 분석

**최종 추천 TOP 3:**
1. **E-commerce Seller AI** (Etsy/Amazon 셀러용) — 리스팅 최적화, SEO, 가격 전략
2. **B2B SDR LinkedIn Outreach** — AI 기반 아웃바운드 메시지 자동화
3. **Freelancer Proposal AI** (Upwork 등) — 제안서 자동 작성, 입찰 최적화

### 기타
- [revenue-opportunities.md](revenue-opportunities.md) — 초기 1인 개발자 관점 분석 (Phase 1 이전, 참고용)

## 상태
- Phase 1: 완료 (글로벌 TOP 10)
- Phase 2: 완료 (Chrome Extension 버티컬 TOP 3)
- 다음: 실제 구현할 아이디어 선정 → 프로젝트 시작
