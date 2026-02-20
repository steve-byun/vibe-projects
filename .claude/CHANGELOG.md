# 완료된 작업 히스토리

> MASTER_GUIDE.md에서 분리된 과거 작업 기록

---

### 260220-7
- [x] iCloud Photo Cleaner 로컬 Python 도구 2종 생성 (`projects/2602/20-icloud-photo-cleaner/`)
  - **photo_cleaner.py**: 로컬 유사 사진 정리 도구
    - dHash + Hamming distance + Union-Find 그룹핑
    - 품질 평가: 선명도(50%) + 노출(30%) + 대비(20%) + 해상도 보너스
    - E:\test\2023 실제 테스트: threshold 18 → 7그룹 15중복 → --move 완료
  - **food_filter.py**: CLIP 모델 음식 사진 필터
    - OpenAI CLIP (clip-vit-base-patch32) zero-shot 분류, 100% 로컬 실행
    - 2단계 판별: food_prob >= 0.4 AND person_prob < 0.3
    - 라벨 13개: FOOD_ONLY(3) + PERSON(5) + OTHER(5) — 사람 포함 오탐 해결
  - **Live Photo 지원** (양쪽 스크립트): JPG 이동 시 동일 stem의 .MOV 동반 처리
    - 이름 충돌 시 suffix_tag 방식으로 JPG/MOV stem 동기화 유지

### 260220-6
- [x] Claude Usage Widget VSCode 확장 개선 (`projects/2602/20-claude-usage-widget/vscode-extension/`)
  - Chrome 연결 끊김 감지: 2분 이상 업데이트 없으면 "연결 끊김" 워닝 (노란 배경 + 경과 시간 표시)
  - 툴팁/상세 형식 통일: `5시간 세션 : 50% 사용 (리셋 : 2h 41m 후)` 한 줄 형식
  - 색상 기준 변경: 0~74% 초록, 75~89% 노란, 90%+ 빨간

### 260220-5
- [x] iCloud Photo Cleaner 신규 프로젝트 생성 (`projects/2602/20-icloud-photo-cleaner/`)
  - Chrome 확장 MV3: iCloud Photos 웹에서 유사 사진 자동 그룹핑 + 베스트 추천
  - dHash 알고리즘 (64비트 perceptual hash) + Hamming distance로 유사도 판별
  - 품질 평가: Laplacian 선명도 + 노출 + 대비 + face-api.js 얼굴 인식
  - Offscreen Document로 Canvas 이미지 처리, Union-Find 그룹핑
  - 반자동 삭제: 그룹 표시 → 베스트 추천 → 사용자 확인 후 정리
  - 다크 테마 팝업 UI, 설정 패널 (유사도 임계값, 얼굴 인식 토글)

### 260220-4
- [x] 원격 PC 셋업 도구 생성 (`tools/remote-pc-setup/`)
  - README.md: 전체 가이드 (아키텍처, 방식 비교, 퀵스타트, 트러블슈팅)
  - WinRM 방식: setup_controller_winrm.bat + setup_develop_winrm.bat
  - SSH 방식: setup_controller_ssh.bat + setup_develop_ssh.bat
  - PC 명칭 정리: PC A → pc_develop, PC B → pc_controller
  - 옛 파일(setup_pc_a/b_*.bat) 정리 삭제

### 260220-3
- [x] LAN Notifier 프로젝트 생성 — PC간 알림 전달 시스템
  - PC B (desktop-39phk2u)의 Teams/Outlook 알림을 PC A (메인 작업 PC)로 전달
  - **monitor.py**: Windows 알림 리스너 (winsdk) + Outlook COM 폴백
  - **receiver.py**: HTTP 수신 + win11toast 표시 + pystray 트레이 아이콘
  - **config.py**: IP/포트/토큰/감시앱 설정
  - **test_connection.py**: IP 확인 + 연결 테스트 유틸리티
  - install.bat, start_receiver.bat, start_monitor.bat
  - 파일: 7개 (config + monitor + receiver + test + bat 3개)

### 260220-2
- [x] Claude Usage Widget Chrome 확장 프로젝트 생성
  - claude.ai 내부 API (`/api/organizations/{orgId}/usage`) 활용
  - 세션 쿠키 기반 인증 (cookies 권한)
  - **팝업 UI**: 다크테마, 5시간 세션 + 7일 주간 사용량 바, 리셋 카운트다운 타이머
  - **배지**: 5시간 세션 사용률 % 표시 (초록/노랑/빨강 색상)
  - **알림**: 50%/75%/90% 도달 시 Windows 네이티브 토스트 알림 (중복 방지, 세션 리셋 시 초기화)
  - **자동 갱신**: chrome.alarms로 1분마다 백그라운드 업데이트
  - 게이지 미터 아이콘 (Python으로 16/48/128px PNG 생성)
  - 파일: 7개 (manifest + popup 3 + background 1 + lib 1 + icons 3)

### 260220-1
- [x] 3개 작업영역 설정 통합 정리
  - **글로벌 CLAUDE.md**: Dev의 구체적 세션 명령어 병합 + 작업영역 테이블 추가
  - **Dev CLAUDE.md**: 중복 내용 제거 (기본 규칙, 세션 명령어) → Dev 전용만 유지
  - **Data_Review**: CLAUDE.md + .claude/CHANGELOG.md 신규 생성 (HCR 분석 도구 지침)
  - **src**: changelog.md 신규 생성 (~/.claude/projects/ 아래, 회사 git 충돌 방지)
  - **MEMORY.md**: 설정 구조 섹션 추가, 중복 정리

### 260211-4
- [x] 로봇공학 s09 임피던스 제어 복습 (Figure 1~2 상세 설명)
  - s09 Figure 2 막대 그래프 정렬 버그 수정 (categorical 알파벳순 → 오름차순)
- [x] 로봇공학 s10 궤적 생성 스크립트 작성 + 학습 완료
  - Figure 1: MoveJ vs MoveL (관절 공간 vs 작업 공간, 핵심)
  - Figure 2: 속도 프로파일 비교 (1차/3차/5차/사다리꼴)
  - Figure 3: MoveL vs MoveC (직선 vs 원호)
  - Figure 1에 사다리꼴 점선 비교 추가 (사용자 요청)
  - ROBOTICS_LEARNING.md 학습 노트 갱신

### 260211-3
- [x] ListingPro AI — 쿠팡 지원 추가 + 팝업 기반 최적화 플로우 완성
  - **쿠팡 추가**: content/coupang.js (DOM 파서), 한국어 프롬프트 (prompts.js), 데모 결과 (service-worker.js)
  - **Popup 기반 결과 표시**: 페이지 오버레이 → 팝업 내 표시로 전환 (DOM 충돌 해결)
  - **Optimize 버튼**: 팝업에서 직접 `chrome.scripting.executeScript`로 데이터 추출 → Background → 결과
  - **결과 UI**: SEO 점수, 최적화 제목/설명 (Copy 버튼), 태그 칩, Key Points, 개선점, 경쟁 인사이트
  - **SPA 네비게이션**: Amazon/Etsy/쿠팡 모두 pushState 감지 + MutationObserver
  - **manifest.json**: 쿠팡 host_permissions 추가, `scripting` 권한, Amazon 10개국 도메인
  - 쿠팡 데모 모드 동작 확인 완료

### 260211-2
- [x] ListingPro AI Chrome 확장 프로젝트 생성 (E-commerce Seller AI)
  - Revenue Research TOP 1 아이템 기반 실제 개발 착수
  - 2명 에이전트 팀 (frontend-dev, backend-dev) 병렬 작업
  - **프로젝트 구조**: Manifest v3, Content Scripts, Service Worker, Popup
  - **Frontend**: Etsy/Amazon DOM 파서, 플로팅 버튼, 결과 오버레이 (SEO 점수 게이지, 태그 칩, 복사 버튼)
  - **Backend**: Claude Haiku API 연동, Etsy/Amazon 최적화 프롬프트 4종, 일일 사용량 추적
  - **공통**: 메시지 타입/데이터 계약 (constants.js), CSS lp- prefix 충돌 방지
  - 파일: 11개 (manifest + popup 3 + content 3 + background 1 + lib 4 + styles 1)
  - 다음: 아이콘 생성 → Chrome 로드 → 실제 페이지 테스트

### 260211-1
- [x] Revenue Research 프로젝트 시작 (수익 기회 리서치)
  - C-Suite AI 에이전트 3명 생성: CMO, COO/CTO, CRO (`.claude/agents/`)
  - Phase 1: 실리콘밸리 관점 글로벌 TOP 10 수익 모델 도출
    - 3자 독립 분석 → 합의: #1 Vertical AI SaaS (만장일치)
  - Phase 2: Chrome Extension Vertical AI 세부 분석
    - 최종 TOP 3: E-commerce Seller AI, B2B SDR LinkedIn, Freelancer Proposal AI
  - 산출물 8개 파일 (`projects/2602/11-revenue-research/`)

### 260210-3
- [x] 로봇공학 s08: Computed Torque (CT) 제어 학습
  - PD+G(g만 보상) vs CT(M,C,g 전부 보상) 비교
  - 빠른 궤적(0.5초, ~90 deg/s)에서 CT 압승 확인
  - 모델 오차(20%) 시 성능 저하 실험
- [x] 로봇공학 s09: 임피던스 제어 학습
  - 위치 제어 vs 힘 제어 개념 (벽 접촉 시나리오)
  - 강성(K) 튜닝: K=0(프리드라이브)~K=∞(포지션 모드) 스펙트럼
  - 작업 공간 제어 (J' 사용), UR 프리드라이브와의 연관
- [x] s07 LaTeX 텍스트 수정 (다크 테마 호환)
- [x] ROBOTICS_LEARNING.md 업데이트 (s08, s09 추가, 학습 노트)

### 260210-2
- [x] 카피바라 Go! v1.1 버그 수정 (3건)
  - 전투 결과 안 보임 (늑대 프리즈): CSS `.active` vs JS `style.display` 불일치 → classList 통일
  - 인벤토리 안 열림: 동일 원인 → classList 방식 수정
  - 로그 자동 스크롤 안 됨: `.slide-up` → `.log-entry` 클래스명 통일 + requestAnimationFrame
- [x] 에이전트 팀 아키텍처 템플릿 생성 (`tools/AGENT_TEAM_ARCHITECTURE_TEMPLATE.md`)
  - Part A: 공통 규칙 7개 (CSS↔JS, 속성명 계약, 데이터 안전, side effect, 버그 DB 등)
  - Part B: 프로젝트별 채우기 템플릿

### 260210-1
- [x] StarCraft RTS 웹 클론 프로젝트 생성 시작
  - 5명 에이전트 팀 구성 (foundation-dev, world-dev, entity-dev, combat-ai-dev, ui-dev)
  - HTML5 Canvas + Vanilla JS, Top-down 2D 뷰
  - 테란 1종족: 유닛 5종, 건물 9종
  - 핵심 메커니즘: 자원 채취, 건설, 생산, 전투, A* 패스파인딩, 포그 오브 워, 미니맵, AI 상대
  - Phase 0 완료: 공유 기반 파일 3개 (constants.js, events.js, entity.js)
  - Phase 1 실행: 5 에이전트 28개 파일 병렬 작업 중
  - 파일: 28개 (1 HTML + 1 CSS + 26 JS)

### 260209-9
- [x] Shorts Factory (5-Agent 쇼츠 자동 생성) 프로젝트 생성
  - 5명 AI 에이전트 팀: 기획PD, 작가, 리서처, 성우, 편집자
  - Claude API + Edge-TTS + Pexels API + FFmpeg 파이프라인
  - 리서처+성우 병렬 실행 (ThreadPoolExecutor)
  - 웹 UI (다크 테마, SSE 실시간 파이프라인 시각화)
  - 기존 youtube-shorts-generator의 서비스 모듈 재활용/개선
  - 파일: 22개 (backend 19 + frontend 3)

### 260209-8
- [x] 카피바라 Go! 웹 게임 프로젝트 생성
  - 5명 에이전트 팀 구성 (html-architect, css-stylist, data-creator, mechanics-dev, game-engine)
  - 카피바라 Go 스타일 텍스트 기반 로그라이크 RPG (웹)
  - 모바일 우선 다크 테마 UI, 전체 한국어
  - 60일 챕터 시스템, 자동 전투, 스킬 선택 (32개 스킬)
  - 16개 인카운터 이벤트, 15개 적 (3챕터), 12개 장비, 6개 펫
  - 저장/로드 (localStorage), 인벤토리, 레벨업 시스템
  - 파일: index.html, css/style.css, js/data.js, js/mechanics.js, js/game.js (총 4138줄)

### 260209-7
- [x] AI 크로스체커 Chrome throttle 이슈 분석 및 문서화
  - 최소화/가상 데스크톱/가림 → Chrome이 탭 JS 실행 throttle → 동작 불가 확인
  - 이전 백그라운드 우회 로직(2~4차) 재시도 불가 판단
  - 해결법 정리: 화면에 보이게 배치 또는 PowerToys Always on Top 사용
  - 알려진 이슈 문서 업데이트

### 260209-6
- [x] AI 크로스체커 구조 단순화 + 사전 검사 + 응답 감지 강화
  - 팝업 윈도우 로직 완전 제거 (setupBackgroundWindow, teardownBackgroundWindow, visibilityOverride, silentAudio 등)
  - 사전 검사 시스템: 크로스체크 시작 전 탭 상태 확인 (최소화 감지 → 경고)
  - 응답 감지 fallback: Stop 버튼 놓쳐도 텍스트 안정화로 완료 판단 (2초 안정 시)

### 260209-5
- [x] AI 크로스체커 Claude 응답 감지 버그 수정
  - `button[aria-label="Stop"]` 일반적 셀렉터가 Claude UI 상시 존재 버튼 오감지 → 제거
  - `injectCheckButtonStateClaude`, `injectClickSendClaude`에서 구체적 셀렉터만 유지
  - `button[aria-label="Send"]` 일반적 셀렉터도 제거

### 260209-4
- [x] C:\share 폴더 전체 정리
  - 삭제: Duplicates_Temp, Installers(2.8GB), youtube-url-summarizer, Claude Setup.exe
  - 삭제: Personal/대용량첨부 zip(927MB), 추출/ffmpeg 중복(~400MB)
  - 이동: Robot_Collision_Detection.pptx → Robot_Engineering/
  - 이동: 2026-01-05/(인사발령) → Company_Admin/
  - Thumbs.db 파일 정리
  - SHARE_INDEX.md 생성 (전체 폴더 내용 문서화)
  - 총 약 3.9GB 정리

### 260209-3
- [x] 서바이버 게임 (탕탕특공대 클론) 프로젝트 생성
  - 에이전트 팀 (4명: architect, engine-dev, combat-dev, ui-dev) 활용
  - Python Pygame 기반 톱다운 서바이버 슈터
  - 20개 스킬 (8개 진화 조합), 14종 적 (노말5, 엘리트5, 보스4)
  - 20웨이브 시스템, 장비/인벤토리, EXP/레벨업
  - 전체 UI: HUD, 레벨업 화면, 결과 화면, 메뉴, 장비 화면
- [x] 모든 캐릭터 비주얼 디자인 적용 (동그라미 → 고유 형태)
  - 14종 적 전부 Pygame 도형 기반 고유 디자인
  - 플레이어: 전사/기사 디자인 (망토, 검, 애니메이션)
- [x] 무료 스프라이트 에셋 다운로드 및 적용
  - OpenGameArt.org에서 플레이어/좀비/박쥐/스켈레톤/슬라임 스프라이트 다운
  - sprite_manager.py 생성, 스프라이트 기반 렌더링 + shape fallback 구조

### 260209-2
- [x] 로봇공학 학습 폴더 이전: `C:\Work` → `C:\Dev`
  - `Robotics_Learning` → `C:\Dev\Robotics_Learning\`
  - `OJT_Robotics_Study` → `C:\Dev\Robotics_Learning\ref\` (하위 폴더로 통합)
- [x] s07_control_basics: PD 제어 + 중력보상 학습
  - PD 제어 개념 (P=스프링, D=댐퍼)
  - PD only vs PD+중력보상 시뮬레이션 비교
  - Kp/Kd 게인 튜닝 효과 실험
  - PID vs PD+G 차이 이해

### 260209
- [x] AI 크로스체커 최종 분석 전송 실패 문제 수정
  - Phase 2 → Phase 3 전환 시 안정화 대기 추가 (1.5초)
  - sendMessage에서 Gemini 텍스트 입력 후 대기 시간 증가 (100ms → 500ms)
  - Phase 3에 재시도 로직 추가 (최대 3회, 15초 타임아웃)
  - sendAndWaitWithTimeout, waitForResponseWithInitialTimeout 함수 추가
- [x] 세션 종료 명령어 추가 (이상, 탭 종료, 끝)
- [x] 작업 공간 이전: `c:\Steve\01_Vibe_Projects` → `C:\Dev`
- [x] MASTER_GUIDE.md 다이어트 (완료 히스토리 → CHANGELOG.md 분리)

### 260205
- [x] 로봇공학 OJT 학습 환경 구축
  - `C:\Work\OJT_Robotics_Study` - HCR 로봇 OJT 원본 복사
  - `C:\Work\Robotics_Learning` - 직접 만들며 배우는 학습 폴더
- [x] 2-Link 로봇 기초 실습 (MATLAB + RVCTools)
  - step1: 로봇 정의, 5개 자세 시각화, Workspace 표시
  - step2: FK 개념 - q1 고정 시 q2 변화에 따른 끝점 궤적
  - step3: IK 개념 - 같은 위치에 대한 Elbow Up/Down 두 해
- [x] RVCTools 버전 호환성 문제 해결 (`T.t` → `transl(T)`)
- [x] MATLAB 다크 테마 대응 (기본 배경 사용)

### 260202-3
- [x] YouTube Shorts Generator 샘플 영상 분석 기반 개선
  - 샘플 영상 분석: https://www.youtube.com/shorts/UqieAa1vQTE
    - 자막 글자 수: 3~8자 (평균 5자)
    - 배경 전환: 평균 2.5초
  - 자막 시스템 개편:
    - 최대 글자 수: 10자 → 8자
    - 팝업 애니메이션 추가 (50% → 115% → 100%)
    - 한글 자연 분할 (조사/어미 인식, 단어 중간 끊김 방지)
  - 배경 영상 움직임 효과 추가:
    - 4가지 패턴 순환: zoom_in, zoom_out, pan_left, pan_right
    - 15% 확대 후 프레임 기반 애니메이션
  - 배경 전환 간격: 3초 → 2.5초
  - 배경 영상 검색 개선:
    - 수동 매핑 테이블 → Google 번역 자동 변환 (deep-translator)
    - 스크립트/제목/태그에서 영어 키워드 자동 추출

### 260202-2
- [x] YouTube Shorts Generator 대폭 개선
  - 폴더 열기 경로 문제 수정 (explorer.exe 명시적 호출)
  - 영상 파일 존재 확인 로직 추가 (생성 실패 시 에러 반환)
  - Pexels API Key 입력 UI 제거 (config.json 사용)
  - 배경 영상 3초마다 전환 (돌려쓰기 금지, 최소 20개 다운로드)
  - 영상 파일명 제목으로 저장 (한글 지원)
  - 자막 스타일 전면 개편
  - 확장 아이콘 클릭 시 바로 사이드 패널 열기 (팝업 제거)
- [x] 세션 명령어 변경 (작업종료 → 저장)

### 260202-1
- [x] YouTube Shorts Generator 프로젝트 완성
- [x] AI 크로스체커 Chrome 확장 완료 처리

### 260130-8
- [x] AI 크로스체커 응답 감지 로직 버튼 모양 기반으로 전면 개편

### 260130-7
- [x] 외부 경로 권한 설정 추가 (`C:/Work/**` → settings.local.json)
- [x] Confluence 매뉴얼 폰트 통일 (9개 페이지 HTML 정규화)

### 260129-2
- [x] Confluence 매뉴얼 페이지 중복 제거
- [x] confluence-uploader 스크립트 추가

### 260130-6 ~ 260130-1
- [x] AI 크로스체커 응답 감지/전송 로직 대규모 개선 (8회 반복)

### 260129-1
- [x] AI 크로스체커 모델 선택 함수 수정
- [x] Confluence 매뉴얼 자동 업로드 도구 제작 (`tools/confluence-uploader/`)
- [x] vscode-session-watcher 확장 하이브리드 방식으로 개선

### 260128
- [x] Window Cleaner 윈도우 앱 제작
- [x] 프로젝트 폴더 구조 개편 (YYMM/DD-name 형식)
- [x] PinDirect 위젯 시스템 트레이 기능 추가
- [x] AI 크로스체커 확장 사이드 패널 + 크로스체크 로직 전체 구현
- [x] AI 크로스체커 UI/UX 전면 개편 (프로그레스 바, 결과 파싱 등)
