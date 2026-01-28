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
- [ ] AI 크로스체커 Chrome 확장 - 사이드 패널 방식 (테스트 필요)
  - 크로스체크 로직: GPT/Gemini 상호 검토 후 Gemini가 최종 분석
  - 모델 선택 드롭박스 (GPT: Auto/4o/o1, Gemini: Flash/Thinking/Pro)
  - 새 채팅 옵션 체크박스

### 아이디어
- [ ] 단위 변환기
- [x] D-day 계산기 ✅ 완료
- [x] 퍼센트 계산기 ✅ 완료
- [x] 할인가 계산기 ✅ 완료
- [x] Window Cleaner (미사용 창 자동 종료) ✅ 완료

### 완료된 작업 (260128)
- [x] Window Cleaner 윈도우 앱 제작
- [x] 프로젝트 폴더 구조 개편 (YYMM/DD-name 형식)
- [x] PinDirect 위젯 시스템 트레이 기능 추가
- [x] PinDirect 위젯 시작 시 트레이로 바로 최소화
- [x] 세션 명령어 체계 개편 (작업준비/작업종료/pull/push 분리)
- [x] 작업종료 자동화 스크립트 추가 (session-end.ps1)
- [x] AI 크로스체커 확장 사이드 패널로 변경
- [x] AI 크로스체커 크로스체크 로직 구현
- [x] AI 크로스체커 모델 선택/새채팅 옵션 추가
- [ ] Vercel Root Directory 설정 변경 (대시보드에서 수동 필요)

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

**마지막 업데이트**: 2026-01-28
**버전**: 4.3 (작업종료 자동화 스크립트 추가)
