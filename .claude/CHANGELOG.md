# 완료된 작업 히스토리

> MASTER_GUIDE.md에서 분리된 과거 작업 기록

---

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
