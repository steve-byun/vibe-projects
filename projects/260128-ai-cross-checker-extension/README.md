# AI Cross Checker - Chrome Extension

GPT와 Gemini에 동시에 질문하고 답변을 비교하는 Chrome 확장 프로그램

## 설치 방법

### 개발자 모드로 설치 (권장)

1. Chrome에서 `chrome://extensions` 접속
2. 오른쪽 상단 **개발자 모드** 활성화
3. **압축해제된 확장 프로그램을 로드합니다** 클릭
4. 이 폴더 선택

### 아이콘 생성 (필수)

아이콘 파일이 필요합니다. `icons/` 폴더에 다음 파일들을 추가하세요:
- icon16.png (16x16)
- icon48.png (48x48)
- icon128.png (128x128)

간단히 생성하려면:
1. icons/icon.svg 파일을 브라우저에서 열기
2. 스크린샷으로 PNG 저장
3. 각 크기로 리사이즈

## 사용법

1. ChatGPT (chatgpt.com) 탭을 열고 로그인
2. Gemini (gemini.google.com) 탭을 열고 로그인
3. 확장 프로그램 아이콘 클릭
4. 사용할 AI 선택 (체크박스)
5. 질문 입력 후 "질문 보내기"
6. 결과 확인

## 주의사항

- 각 AI 사이트에 미리 로그인되어 있어야 합니다
- 웹사이트 UI가 변경되면 동작하지 않을 수 있습니다
- 응답 대기 시간은 최대 60초입니다

## 파일 구조

```
260128-ai-cross-checker-extension/
├── manifest.json          # 확장 프로그램 설정
├── popup.html/js/css      # 팝업 UI
├── content-chatgpt.js     # ChatGPT 페이지 조작
├── content-gemini.js      # Gemini 페이지 조작
├── background.js          # 백그라운드 서비스
└── icons/                 # 아이콘 파일
```
