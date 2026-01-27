# 현재 프로젝트 상태

> **마지막 업데이트**: 2026-01-27
> **다른 PC에서 작업 시 이 파일을 먼저 확인하세요!**

---

## 계정 정보

### Google AdSense
- **클라이언트 ID**: `ca-pub-4976487856728705`
- **상태**: 계정 생성 완료, 사이트 승인 대기 중

### GitHub
- **계정**: steve-byun
- **레포지토리**: https://github.com/steve-byun/vibe-projects
- **브랜치**: main

### Vercel (배포 플랫폼)
- **계정**: steve-byun GitHub 연동
- **팀 이름**: steves-projects-3576c0ae

---

## 배포된 사이트 목록

| 프로젝트 | Vercel URL | Git 자동배포 | Root Directory |
|---------|------------|-------------|----------------|
| BMI 계산기 | https://bmi-calculator-topaz-five.vercel.app | ✅ 연결됨 | `projects/260127-bmi-calculator` |
| 팁 계산기 | https://tip-calculator-nu-flax.vercel.app | ✅ 연결됨 | `projects/260127-tip-calculator` |
| 환율 계산기 | https://currency-calculator-dun-mu.vercel.app | ✅ 연결됨 | `projects/260127-currency-calculator` |
| 나이 계산기 | https://vibe-projects-two.vercel.app | ✅ 연결됨 | `projects/260127-age-calculator` |

---

## 완료된 설정

### 1. Vercel + GitHub 자동 배포
- [x] Vercel CLI 설치 (`npm install -g vercel`)
- [x] Vercel 로그인 완료
- [x] GitHub 레포지토리 연결
- [x] 3개 프로젝트 모두 Git 연동 완료
- [x] Root Directory 설정 완료
- [x] 자동 배포 테스트 완료

### 2. 폴더 구조 개편 (2026-01-27)
- [x] revenue-project-factory 중첩 폴더 제거
- [x] 프로젝트 폴더명에 날짜 추가 (YYMMDD-name 형식)
- [x] .claude 폴더 통합 (2개 → 1개)
- [x] GitHub 레포지토리 이름 변경 (vibe-projects)
- [x] 세션 명령어 설정 (`/start`, `/end`, `ㄱㄱ`, `ㅈㅈ`)
- [x] 불필요한 가이드 파일 정리 (HOW_TO_USE.md, README.md 삭제)
- [x] Claude Code 자동 승인 설정 (Edit, Write 권한)

### 3. 프로젝트 생성
- [x] BMI 계산기 - 키/몸무게로 BMI 계산, 건강 상태 표시
- [x] 팁 계산기 - 팁 금액 계산, N분의 1 계산
- [x] 환율 계산기 - 6개 통화 지원 (KRW, USD, JPY, EUR, CNY, GBP)
- [x] 대출 계산기 - 원리금균등/원금균등/만기일시상환
- [x] 나이 계산기 - 만 나이/한국 나이/띠/별자리 계산

---

## 자동 배포 방법

코드 수정 후 이렇게만 하면 자동 배포됩니다:

```bash
cd c:\Steve\01_Vibe_Projects

# 변경사항 확인
git status

# 스테이징
git add .

# 커밋
git commit -m "변경 내용 설명"

# 푸시 (자동 배포 트리거)
git push
```

Vercel이 자동으로 변경된 프로젝트만 재배포합니다!

---

## 새 PC에서 시작하기

### 1단계: 레포지토리 클론
```bash
git clone https://github.com/steve-byun/vibe-projects.git 01_Vibe_Projects
cd 01_Vibe_Projects
```

### 2단계: Vercel CLI 설치 및 로그인
```bash
npm install -g vercel
vercel login
```
- 브라우저에서 인증 URL 열기
- steve-byun GitHub 계정으로 로그인

### 3단계: 작업 시작!
```bash
# 새 계산기 만들기
# Claude에게: "XXX 계산기 만들어줘" 라고 요청

# 배포하기
git add .
git commit -m "Add new calculator"
git push
```

---

## 프로젝트 구조

```
01_Vibe_Projects/
├── .claude/                         # Claude 가이드 문서
│   ├── MASTER_GUIDE.md              # 전체 워크플로우
│   ├── CURRENT_STATUS.md            # 현재 상태 (이 파일)
│   └── TEMPLATE_GUIDE.md            # 템플릿 생성 가이드
├── templates/                        # 프로젝트 템플릿
│   ├── calculator/                   # 계산기 템플릿
│   └── utility-webapp/               # 유틸리티 웹앱 템플릿
├── projects/                         # 생성된 프로젝트들 (YYMMDD-name 형식)
│   ├── 260127-bmi-calculator/        # BMI 계산기
│   ├── 260127-tip-calculator/        # 팁 계산기
│   ├── 260127-currency-calculator/   # 환율 계산기
│   ├── 260127-loan-calculator/       # 대출 계산기
│   ├── 260127-age-calculator/        # 나이 계산기
│   └── 260127-demo-text-tools/       # 텍스트 도구 (Netlify)
└── scripts/                          # 자동화 스크립트
    ├── create-project.js             # 프로젝트 생성
    └── deploy.js                     # 배포 (현재 미사용)
```

---

## 다음에 할 일 (TODO)

### 우선순위 높음
- [ ] AdSense 승인 대기 (2-3일 소요)
- [ ] 2-3개 프로젝트 더 만들기 (SEO 최적화 전)

### 우선순위 중간
- [ ] Google Search Console 등록
- [ ] sitemap.xml 생성
- [ ] SEO 최적화

### 아이디어 목록
- [ ] 단위 변환기 (길이, 무게, 온도)
- [ ] D-day 계산기
- [ ] 퍼센트 계산기
- [ ] 할인가 계산기

---

## 주의사항

1. **커밋 전 확인**: AdSense 코드가 `<head>`에 있는지 확인
2. **Vercel 계정**: steve-byun GitHub으로 로그인한 Vercel 계정 사용
3. **기존 Netlify 사이트**: demo-text-tools는 아직 Netlify에 있음 (playful-llama-64ad1f.netlify.app)

---

## 유용한 링크

- **GitHub 레포**: https://github.com/steve-byun/vibe-projects
- **Vercel 대시보드**: https://vercel.com/dashboard
- **AdSense**: https://www.google.com/adsense
- **Google Search Console**: https://search.google.com/search-console
