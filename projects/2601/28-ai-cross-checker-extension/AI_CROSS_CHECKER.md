# AI Cross Checker - 개발 노트

GPT와 Gemini에 동시에 질문하고 답변을 비교하는 Chrome 확장 프로그램

---

## 상태: 사용 중

## 기술 스택
- Chrome Extension (Manifest V3)
- Service Worker (background.js)
- Content Scripts (ChatGPT, Gemini, Claude)
- Side Panel UI

## 파일 구조
```
28-ai-cross-checker-extension/
├── manifest.json          # 확장 프로그램 설정
├── background.js          # 백그라운드 서비스 워커
├── sidepanel.html/css/js  # 사이드 패널 UI
├── content-chatgpt.js     # ChatGPT 페이지 조작
├── content-gemini.js      # Gemini 페이지 조작
├── content-claude.js      # Claude 페이지 조작
├── popup.html/js/css      # 팝업 UI (레거시)
└── README.md              # 사용 설명서
```

## 주요 구현 내역

### 260209 (5차) - 구조 단순화 + 사전 검사 + 응답 감지 강화
- **팝업 윈도우 로직 완전 제거**: `setupBackgroundWindow`, `teardownBackgroundWindow`, `injectVisibilityOverride`, `injectSilentAudio`, `cleanupSilentAudio`, `bgWindowIds` 등 삭제
  - 더 이상 탭을 별도 윈도우로 이동하지 않음
  - 사용자가 직접 AI 탭들을 열어두고 관리
- **사전 검사 시스템 추가**: 크로스체크 시작 전 각 AI 탭 상태 자동 검사
  - 윈도우 최소화 여부 확인
  - 문제 있는 탭에 경고 표시 (노란색 경고 UI)
  - 문제 해결 후 다시 시도하도록 안내
- **응답 감지 fallback 추가**: 빠른 응답에서 Stop 버튼을 놓치는 문제 해결
  - Stop 버튼 없이도 응답 텍스트가 변경 후 2초 안정화되면 완료 처리
  - `getResponseText` 헬퍼 함수 추출
  - `waitForResponse`, `waitForResponseWithInitialTimeout` 모두 적용
  - **교훈**: 팝업 윈도우 없이는 백그라운드 탭에서 빠른 응답의 Stop 버튼을 놓칠 수 있음
- **background.js**: `checkTabStatus` 핸들러 추가, 윈도우 관리 코드 전부 삭제
- **sidepanel**: 사전 검사 경고 UI + "확인" 버튼

### 260209 (4차) - Claude 응답 감지 버그 수정
- **핵심 수정**: `button[aria-label="Stop"]`이 너무 일반적 → Claude UI에 항상 존재하는 버튼 오감지
  - `injectCheckButtonStateClaude`: `"Stop"` 단독 셀렉터 제거, `"Stop Response"`/`"응답 중지"`만 유지
  - `injectClickSendClaude`: 동일하게 일반적 셀렉터 제거 + `isStreaming` 체크 추가
  - `button[aria-label="Send"]`도 제거 (오감지 방지)
- **교훈**: aria-label 셀렉터는 구체적이어야 함 — 단어 하나짜리(`"Stop"`, `"Send"`)는 다른 UI 요소와 충돌

### 260209 (3차) - 근본 원인 수정
- **핵심 수정**: 오프스크린 윈도우에서 `getBoundingClientRect()`/`offsetWidth`가 0 반환 → 모든 버튼 감지 실패 문제 해결
  - 모든 inject 함수에서 `isVisible`/`getBoundingClientRect`/`offsetWidth` 크기 체크 **완전 제거**
  - DOM 셀렉터(aria-label, data-testid) 기반으로만 요소 탐색
  - `injectCheckButtonState*`: Stop/Send 버튼 존재 여부만 확인 (크기 무관)
  - `injectClickSend*`: 셀렉터 매칭 우선, fallback은 aria-label 필터만 사용
  - `injectSelectGpt/GeminiModelOption`: 텍스트 매칭만 사용
- **visibilityState 오버라이드 타이밍 수정**: 윈도우 생성 전 → 생성 후 주입
  - `visibilitychange` 이벤트도 `stopImmediatePropagation`으로 차단
- **무음 오디오 주입**: Chrome의 백그라운드 탭 타이머 throttling 방지
  - AudioContext + OscillatorNode (gain=0.00001)로 "오디오 재생 중" 인식
  - `chrome.tabs.update(tabId, { muted: true })`로 실제 소리 음소거
  - 완료 후 자동 정리

### 260209 (2차)
- 백그라운드 동작 지원: 탭별 별도 오프스크린 윈도우 생성
  - 각 AI 탭을 별도 윈도우(`left: -32000, state: 'normal'`)로 이동
  - `visibilityState` 오버라이드 (`world: 'MAIN'`)
  - 불필요한 `element.focus()` 호출 제거

### 260209
- 최종 분석 전송 실패 문제 수정
  - Phase 2 → Phase 3 전환 시 안정화 대기 추가 (1.5초)
  - sendMessage에서 Gemini 텍스트 입력 후 대기 시간 증가 (100ms → 500ms)
  - Phase 3에 재시도 로직 추가 (최대 3회, 15초 타임아웃)
  - sendAndWaitWithTimeout, waitForResponseWithInitialTimeout 함수 추가

### 260130
- 응답 감지 로직 버튼 모양 기반으로 전면 개편

### 260129
- 모델 선택 함수 수정

### 260128
- 사이드 패널 + 크로스체크 로직 전체 구현
- UI/UX 전면 개편 (프로그레스 바, 결과 파싱 등)

## 알려진 이슈
- 웹사이트 UI가 변경되면 content script 셀렉터가 깨질 수 있음
- 각 AI 사이트에 미리 로그인되어 있어야 함
- AI 탭이 화면에 보여야 함 (Chrome throttle 제한)
  - 최소화, 가상 데스크톱, 다른 창 뒤에 가림 → 전부 동작 안 함
  - Chrome이 비가시 탭의 JS 실행을 throttle → 입력/클릭 이벤트 처리 안 됨
  - 사전 검사는 최소화만 감지 가능 (가상 데스크톱/가림은 감지 불가)
  - **해결법**: AI 창을 작게 줄여서 화면에 보이게 배치, 또는 PowerToys "Always on Top" (Win+Ctrl+T) 사용

---

**마지막 업데이트**: 2026-02-09
