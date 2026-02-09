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

---

**마지막 업데이트**: 2026-02-09
