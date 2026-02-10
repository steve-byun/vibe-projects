# StarCraft RTS 웹 클론

## 개요
- 웹 브라우저에서 돌아가는 스타크래프트 RTS 클론
- HTML5 Canvas + Vanilla JavaScript (프레임워크 없음)
- Top-down 2D 뷰, 컬러 도형 기반 유닛/건물

## 구현 범위
- **종족**: 테란 1종족 (플레이어 + AI)
- **유닛 5종**: SCV, Marine, Siege Tank, Medic, Wraith
- **건물 9종**: Command Center, Supply Depot, Barracks, Refinery, Factory, Engineering Bay, Starport, Bunker, Missile Turret
- **시스템**: 자원 채취, 건설, 생산, 테크 트리, A* 패스파인딩, 포그 오브 워, 미니맵, 컨트롤 그룹, AI 상대
- **미포함**: 멀티플레이어, 사운드, 상세 스프라이트, 리플레이

## 기술 스택
- HTML5 Canvas (게임 렌더링) + HTML/CSS overlay (HUD/UI)
- Vanilla JS, `window.SC` 네임스페이스
- EventBus pub/sub 패턴으로 모듈 간 통신
- 60FPS 고정 타임스텝 게임 루프

## 파일 구조 (28개 파일)
```
10-starcraft-rts/
├── index.html
├── css/style.css
├── js/
│   ├── data/     (constants, units, buildings, tech)
│   ├── core/     (events, input, camera, renderer, engine)
│   ├── world/    (map, fog, minimap)
│   ├── entities/ (entity, unit, building, projectile, resource)
│   ├── systems/  (pathfinding, selection, commands, production, combat, harvesting, ai)
│   └── ui/       (hud, selectionPanel, commandPanel, minimapPanel, buildMenu, screens)
```

## 에이전트 팀 (5명)
| 에이전트 | 역할 | 파일 수 |
|---------|------|--------|
| foundation-dev | 엔진, 렌더링, 카메라, 입력, HTML | 5 |
| world-dev | 맵, 포그, 미니맵, 자원 노드 | 4 |
| entity-dev | 유닛/건물 데이터+클래스, 패스파인딩, 선택, 명령, 생산, 채취 | 11 |
| combat-ai-dev | 전투 시스템, AI 상대 | 2 |
| ui-dev | CSS, HUD, 패널, 메뉴, 화면 | 7 |

## 현재 상태
- **Phase 0 완료**: 공유 기반 파일 3개 (constants.js, events.js, entity.js)
- **Phase 1 부분 완료**: 24/29 파일 작성됨, 9개 미작성
- **Phase 2 대기**: 미작성 파일 완성 → 통합 → 테스트

### 완성된 파일 (24개)
- index.html, css/style.css
- js/data: constants, units, buildings, tech
- js/core: events, input, camera, renderer, engine
- js/world: map, fog, minimap
- js/entities: entity, unit, building, projectile, resource
- js/systems: combat, ai
- js/ui: hud, selectionPanel

### 미작성 파일 (9개) — 다음 세션에서 작성 필요
- **시스템**: pathfinding.js, selection.js, commands.js, production.js, harvesting.js
- **UI**: commandPanel.js, minimapPanel.js, buildMenu.js, screens.js

## 아키텍처 문서
- 기획서: `C:\Users\steveb\.claude\plans\linear-swinging-map.md`
- 팀 규칙: `tools/AGENT_TEAM_ARCHITECTURE_TEMPLATE.md` 적용

## 다음 할 일
- [ ] 미작성 9개 파일 완성
- [ ] Phase 2: engine.js에서 모든 시스템 연결 (tick/render 파이프라인)
- [ ] 입력 → 선택/명령 통합
- [ ] 브라우저 테스트 + 버그 수정
- [ ] 밸런싱 조정
