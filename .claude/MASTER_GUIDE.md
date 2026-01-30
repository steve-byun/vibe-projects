# Claude Code - Vibe Projects 마스터 가이드

이 파일은 Claude가 수익형 프로젝트를 자동으로 생성하고 배포하기 위한 완전한 가이드입니다.

---

## 세션 명령어

### `작업준비` 또는 `작업준비해줘`
1. `.claude/MASTER_GUIDE.md` 읽기
2. 현재 상태 요약 출력

**응용**: `작업준비 해주고 ~~를 실행시켜줘` 형태로 사용 가능

### `작업종료` 또는 `작업종료해줘`
1. 오늘 작업 내용으로 이 파일의 TODO/상태 업데이트
2. `scripts/session-end.ps1` 실행 (현재 탭 닫기 → 신규 탭 열기)
3. 신규 탭에서 자동으로 `작업준비` 실행 (MASTER_GUIDE.md 읽기)

### `pull` 또는 `pull해줘`
1. `git pull origin main` - 최신 데이터 가져오기

### `push` 또는 `push해줘`
1. `git add -A && git commit -m "작업 내용 요약" && git push` - 모든 변경사항 push

---

## 계정 정보

| 서비스 | 정보 |
|--------|------|
| **AdSense** | `ca-pub-4976487856728705` (승인 대기 중) |
| **GitHub** | steve-byun / [vibe-projects](https://github.com/steve-byun/vibe-projects) |
| **Vercel** | GitHub 연동 (팀: steves-projects-3576c0ae) |

---

## 배포된 프로젝트

| 프로젝트 | URL | Root Directory |
|---------|-----|----------------|
| BMI 계산기 | https://bmi-calculator-topaz-five.vercel.app | `projects/2601/27-bmi-calculator` |
| 팁 계산기 | https://tip-calculator-nu-flax.vercel.app | `projects/2601/27-tip-calculator` |
| 환율 계산기 | https://currency-calculator-dun-mu.vercel.app | `projects/2601/27-currency-calculator` |
| 나이 계산기 | https://vibe-projects-two.vercel.app | `projects/2601/27-age-calculator` |
| 할인가 계산기 | https://260127-discount-calculator.vercel.app | `projects/2601/27-discount-calculator` |
| D-day 계산기 | https://260127-dday-calculator.vercel.app | `projects/2601/27-dday-calculator` |
| 퍼센트 계산기 | https://260127-percent-calculator.vercel.app | `projects/2601/27-percent-calculator` |
| AI 크로스체커 | https://260128-ai-cross-checker.vercel.app | `projects/2601/28-ai-cross-checker` |
| AI 크로스체커 (확장) | Chrome 확장 프로그램 (개발중) | `projects/2601/28-ai-cross-checker-extension` |
| AI 크로스체커 (앱) | Electron 앱 (개발중) | `projects/2601/28-ai-cross-checker-app` |
| PinDirect 위젯 | 데스크톱 위젯 (완료) | `projects/2601/28-pindirect-widget` |
| Window Cleaner | 윈도우 앱 (로컬) | `projects/2601/28-window-cleaner` |

**URL 확인**: `vercel project ls`

---

## 프로젝트 구조

```
01_Vibe_Projects/
├── .claude/
│   └── MASTER_GUIDE.md      # 이 파일
├── templates/                # 프로젝트 템플릿
├── projects/                 # 생성된 프로젝트들
│   └── YYMM/                 # 연월별 폴더
│       ├── DD-project-name/  # 일-프로젝트명
│       └── ...
└── scripts/                  # 자동화 스크립트
```

**폴더명 규칙**: `projects/YYMM/DD-project-name` (예: `projects/2601/27-bmi-calculator`)

---

## 워크플로우

### 새 프로젝트 만들기
1. `projects/YYMM/DD-xxx/` 폴더 생성 (예: `projects/2601/28-new-app`)
2. 템플릿 복사 또는 새로 작성
3. AdSense 코드 확인 (`<head>` 안에 있어야 함)
4. Git push
5. Vercel에서 Import (새 프로젝트일 경우, Root Directory 설정 필수)
6. 이 파일의 배포 목록 업데이트

### AdSense 코드 (필수)
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4976487856728705"
     crossorigin="anonymous"></script>
```

### 자주 쓰는 명령어
```bash
# Git
git pull origin main
git add -A && git commit -m "메시지" && git push

# Vercel
vercel whoami
vercel project ls
```

---

## 새 PC에서 시작하기

```bash
# 1. 클론
git clone https://github.com/steve-byun/vibe-projects.git 01_Vibe_Projects
cd 01_Vibe_Projects

# 2. Vercel CLI
npm install -g vercel
vercel login
```

---

## TODO

### 우선순위 높음
- [ ] AdSense 승인 대기 (2-3일 소요)
- [ ] 2-3개 프로젝트 더 만들기

### 우선순위 중간
- [ ] Google Search Console 등록
- [ ] sitemap.xml 생성

### 진행 중
- [x] AI 크로스체커 Chrome 확장 - 전송 문제 해결 완료
  - 버튼 클릭 우선, Enter 키 fallback 방식으로 변경
  - Stop 버튼 감지하여 응답 생성 중이면 대기 후 재시도
  - 안정화 체크 3회로 강화

### 아이디어
- [ ] 단위 변환기
- [x] D-day 계산기 ✅ 완료
- [x] 퍼센트 계산기 ✅ 완료
- [x] 할인가 계산기 ✅ 완료
- [x] Window Cleaner (미사용 창 자동 종료) ✅ 완료

### 완료된 작업 (260130-8)
- [x] AI 크로스체커 응답 감지 로직 버튼 모양 기반으로 전면 개편
  - 복잡한 로직 제거 (응답 개수, 액션 버튼 체크 등)
  - Stop 버튼(■) 유무만으로 상태 판단
  - Stop 버튼 있음 → 응답 생성 중
  - Stop 버튼 없음 (+ 이전에 본 적 있음) → 응답 완료
- [x] GPT/Gemini 버튼 상태 확인 함수 단순화
  - disabled 조건 제거 (버튼 모양만 확인)
  - GPT Thinking 모드 감지 유지
- [x] Gemini 전송 시 Stop 버튼 체크 제거 (오감지로 인한 무한 대기 방지)
- [x] Gemini 전송 버튼 찾기 로직 개선 (화면 하단 오른쪽에서 찾기)

### 완료된 작업 (260130-7)
- [x] 외부 경로 권한 설정 추가 (`C:/Work/**` → settings.local.json)
- [x] Confluence 매뉴얼 폰트 통일 (9개 페이지 HTML 정규화)
- [x] UDP Data Gathering 통합 매뉴얼 재생성 (삭제 후 재업로드)
- [x] log 암호화 해제 페이지 첨부파일 수정 (cryptor.zip 다운로드 가능하게)

### 완료된 작업 (260129-2)
- [x] Confluence 매뉴얼 페이지 중복 제거 (info 박스, expand 섹션, 날짜 중복)
- [x] 모든 통합 매뉴얼 txt 파일 첨부 및 클릭 가능한 링크 연결 (5개 페이지)
- [x] 기존 페이지 6개 HTML 구조 재작성 (기준 페이지와 동일한 형식으로)
- [x] 마지막 업데이트 날짜 통일 (2026-01-29)
- [x] confluence-uploader 스크립트 추가 (fix_page, fix_all_pages, reformat_all_pages 등)

### 완료된 작업 (260130-6)
- [x] AI 크로스체커 응답 감지 로직 전면 개편 (Stop/Copy 버튼 기반)
  - 타임아웃 완전 제거 (Thinking 모드 무한 대기 지원)
  - 액션 버튼 우선 확인 → Stop 버튼 체크 순서로 변경
  - GPT: "ChatGPT 5.2 Thinking" 모델명 오감지 방지 (입력창 영역으로 제한)
  - Gemini: 페이지 전체 스피너 오감지 방지 (응답 영역 내로 제한)
  - 응답 완료: 액션 버튼(복사/좋아요/싫어요 등) 있으면 즉시 완료 처리

### 완료된 작업 (260130-5)
- [x] AI 크로스체커 전송 방식 버튼 클릭 우선으로 변경 (Enter 키 fallback)
- [x] GPT/Gemini Stop 버튼 감지 - 응답 생성 중이면 대기 후 재시도 (최대 30초)
- [x] 응답 완료 안정화 체크 3회로 강화 (조기 완료 방지)
- [x] GPT Thinking 모드 UI 텍스트 감지 추가 ("지금 응답 받기" 등 오감지 방지)
- [x] 모델 선택 병렬 처리로 변경 (GPT/Gemini 동시 선택)
- [x] Stop 버튼을 전송 버튼으로 오인하는 문제 수정

### 완료된 작업 (260130-4)
- [x] GPT/Gemini 응답 개수 체크 추가 (크로스체크 건너뛰기 방지)
- [x] 짧은 응답 감지 조건 완화 (50자 → 1자)
- [x] 새 채팅 후 모델 선택 추가 (기본 모델 리셋 대응)

### 완료된 작업 (260130-3)
- [x] AI 크로스체커 GPT 전송 안 됐는데 완료 처리되는 버그 수정
  - 전송 버튼 클릭 실패 시 에러 throw
  - 안정화 체크 텍스트 초기화
- [x] AI 크로스체커 Gemini 응답 감지 개선 (응답 개수 체크 → 텍스트 변경 감지)
- [x] AI 크로스체커 결과 표시 개선:
  - displayResult 함수 재작성 (줄 단위 파싱)
  - 제목/부제목/요약 문장 자동 제거
  - 마크다운 변환 개선 (글머리 기호, 굵은 글씨)
  - CSS 스타일 개선 (리스트 색상, 간격)
- [x] AI 크로스체커 최종 분석 프롬프트 개선 (형식 명확화)

### 완료된 작업 (260130-2)
- [x] AI 크로스체커 Phase 1/2 순차 탭 활성화 + 병렬 응답 대기 패턴 적용
- [x] AI 크로스체커 모델 선택 중복 호출 제거 (사이드패널에서 즉시 처리)
- [x] AI 크로스체커 탭 활성화 딜레이 단축 (300ms → 100ms)
- [x] AI 크로스체커 GPT 응답 감지 개선:
  - thinkingIndicators 광범위 셀렉터 제거 (오감지 방지)
  - 페이지 전체 텍스트 패턴 검색 제거
  - 체크 주기 단축 (1000ms → 300ms)
  - 안정화 체크 단축 (3회 → 1회)

### 완료된 작업 (260130-1)
- [x] session-watcher 확장 수정 (claude-code.openInNewTab → claude-vscode.editor.open 명령어로 변경)
- [x] AI 크로스체커 드롭다운 변경 시 즉시 모델 변경 기능 추가
- [x] AI 크로스체커 모델 선택 대기 시간 단축 (2000ms → 500ms, 1500ms → 300ms)

### 완료된 작업 (260129-1)
- [x] AI 크로스체커 모델 선택 함수 수정 (setTimeout → async/await Promise)
- [x] AI 크로스체커 모델 선택 대기 시간 증가 (500ms → 1500ms)
- [x] Session Watcher 확장 재빌드 및 재설치
- [x] Confluence 매뉴얼 자동 업로드 도구 제작 (`tools/confluence-uploader/`)
- [x] Confluence 폴더 구조 재구성 (7개 카테고리)
- [x] 로컬 매뉴얼 5개 통합 업로드 및 기존 페이지 통폐합
- [x] 원본 txt 파일 클릭 시 펼쳐지는 기능 추가
- [x] 통일된 양식 적용 (날짜 포맷, footer 등)
- [x] session-end.ps1 CLI 방식 시도 (code chat은 Copilot 전용, Claude는 미지원)
- [x] session-end.ps1 SendKeys 방식으로 복귀 (VSCode 활성화 필요)
- [x] vscode-session-watcher 확장 하이브리드 방식으로 개선 (탭 닫기/열기는 API, 텍스트 입력은 SendKeys)

### 완료된 작업 (260128)
- [x] Window Cleaner 윈도우 앱 제작
- [x] 프로젝트 폴더 구조 개편 (YYMM/DD-name 형식)
- [x] PinDirect 위젯 시스템 트레이 기능 추가
- [x] PinDirect 위젯 시작 시 트레이로 바로 최소화
- [x] 세션 명령어 체계 개편 (작업준비/작업종료/pull/push 분리)
- [x] 작업종료 자동화 스크립트 추가 (session-end.ps1)
- [x] session-end.ps1 단순화 (그룹 이동 제거)
- [x] AI 크로스체커 확장 사이드 패널로 변경
- [x] AI 크로스체커 크로스체크 로직 구현
- [x] AI 크로스체커 모델 선택/새채팅 옵션 추가
- [x] AI 크로스체커 사이드패널/전체페이지 모드 선택 추가
- [x] AI 크로스체커 GPT 모델 옵션 변경 (Auto/Instant/Thinking)
- [x] AI 크로스체커 결과 박스 레이아웃 개선 (공통/GPT/Gemini 분리)
- [x] AI 크로스체커 진행 상태 UI 현대화 (프로그레스 바, 스피너)
- [x] AI 크로스체커 GPT/Gemini 응답 감지 로직 개선
- [x] AI 크로스체커 크로스체크 시작 시 입력창 비활성화
- [x] AI 크로스체커 진행중 표시 UI 간격 조정
- [x] AI 크로스체커 타임아웃 로직 개선 (응답 중 무한대기, 멈추면 30초 후 타임아웃)
- [x] AI 크로스체커 GPT Thinking 모드 감지 추가
- [x] AI 크로스체커 GPT 모델 선택 셀렉터 수정
- [x] AI 크로스체커 응답 감지 텍스트 비교 방식으로 전면 개선
- [x] AI 크로스체커 무한 루프 방지 (최대 대기 180초, 텍스트 안정화 5회)
- [x] AI 크로스체커 UI 간소화 (스피너+텍스트+프로그레스바만 유지)
- [x] AI 크로스체커 결과 가독성 개선 (문장 단위 줄바꿈)
- [x] AI 크로스체커 탭 자동 활성화 (최소화 시 응답 감지 문제 해결)
- [x] AI 크로스체커 PWA(앱) 환경 지원 (최소화 상태일 때만 창 복원)
- [x] AI 크로스체커 결과 검증 로직 추가 (불완전한 결과 에러 처리)
- [x] AI 크로스체커 setTimeout 문제 해결 (별도 스크립트로 전송 버튼 클릭)
- [x] AI 크로스체커 창/탭 자동 활성화 비활성화 (Memory Saver 예외 처리 사용)
- [x] AI 크로스체커 짧은 응답 감지 조건 완화 (length > 0)
- [x] AI 크로스체커 "분석 중" 버튼 제거, 진행 상태만 표시
- [x] AI 크로스체커 결과 파싱 개선 (번호 제거, 마크다운 형식 유지)
- [x] AI 크로스체커 버튼 즉시 전환 (클릭하자마자 1/3 표시)
- [ ] Vercel Root Directory 설정 변경 (대시보드에서 수동 필요)

---

## 외부 경로 권한 설정

`.claude/settings.local.json`에서 외부 경로 접근 권한 관리:

```json
{
  "permissions": {
    "allow": [
      "Glob(//c/Work/**)",
      "Grep(//c/Work/**)",
      "Read(//c/Work/**)"
    ]
  }
}
```

**새 경로 추가 시**: `"Glob(//c/새경로/**)"` 형식으로 추가

---

## 주의사항

1. 커밋 전 AdSense 코드 확인
2. Vercel은 steve-byun GitHub 계정으로 로그인
3. demo-text-tools는 아직 Netlify에 있음

---

## 유용한 링크

- [GitHub 레포](https://github.com/steve-byun/vibe-projects)
- [Vercel 대시보드](https://vercel.com/dashboard)
- [AdSense](https://www.google.com/adsense)
- [Search Console](https://search.google.com/search-console)

---

**마지막 업데이트**: 2026-01-30
**버전**: 5.8 (AI 크로스체커 응답 감지 버튼 모양 기반 개편)
