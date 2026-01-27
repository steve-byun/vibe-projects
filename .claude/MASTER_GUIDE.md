# Claude Code - Vibe Projects 마스터 가이드

이 파일은 Claude가 수익형 프로젝트를 자동으로 생성하고 배포하기 위한 완전한 가이드입니다.

---

## 세션 시작/종료 명령어

### 시작: `/start` 또는 `ㄱㄱ`
사용자가 이 명령어를 입력하면 Claude가 자동으로:
1. `git pull origin main` - 최신 데이터 가져오기
2. `.claude/` 폴더의 모든 md 파일 읽기:
   - MASTER_GUIDE.md (이 파일)
   - CURRENT_STATUS.md (현재 상태)
   - TEMPLATE_GUIDE.md (템플릿 가이드)
   - HOW_TO_USE.md (사용자 가이드)
3. 현재 상태 요약 출력

### 종료: `/end` 또는 `ㅈㅈ`
사용자가 이 명령어를 입력하면 Claude가 자동으로:
1. 오늘 작업 내용으로 CURRENT_STATUS.md 업데이트
2. `git add -A` - 모든 변경사항 스테이징
3. `git commit -m "작업 내용 요약"` - 커밋
4. `git push` - GitHub에 업로드
5. 오늘 작업 요약 출력

---

## 프로젝트 개요

**목적**: 수익형 웹 프로젝트를 빠르게 생성하고 배포하는 자동화 시스템

**핵심 기능**:
- 템플릿 기반 프로젝트 생성
- Google AdSense 자동 통합
- Vercel 자동 배포 (Git Push)
- SEO 최적화 구조

**사용자 정보**:
- AdSense 클라이언트 ID: `ca-pub-4976487856728705`
- 배포 플랫폼: **Vercel** (Git 자동 배포)
- GitHub: https://github.com/steve-byun/vibe-projects
- 현재 상태: [CURRENT_STATUS.md](./CURRENT_STATUS.md) 참고

---

## 프로젝트 구조

```
01_Vibe_Projects/
├── .claude/                         # Claude 가이드 문서
│   ├── MASTER_GUIDE.md              # 전체 워크플로우 (이 파일)
│   ├── CURRENT_STATUS.md            # 현재 상태
│   ├── TEMPLATE_GUIDE.md            # 템플릿 생성 가이드
│   └── HOW_TO_USE.md                # 사용자 가이드
├── templates/                        # 프로젝트 템플릿
│   ├── calculator/                   # 계산기 템플릿
│   └── utility-webapp/               # 유틸리티 웹앱 템플릿
├── projects/                         # 생성된 프로젝트들 (YYMMDD-name 형식)
│   ├── 260127-bmi-calculator/
│   ├── 260127-tip-calculator/
│   ├── 260127-currency-calculator/
│   ├── 260127-loan-calculator/
│   └── 260127-demo-text-tools/
└── scripts/                          # 자동화 스크립트
    ├── create-project.js
    └── deploy.js
```

**폴더명 규칙**: `YYMMDD-project-name` (예: 260127-bmi-calculator)
- 날짜순 정렬 가능
- kebab-case 사용 (URL 친화적)

---

## 전체 워크플로우

사용자가 "XXX를 만들어줘"라고 요청하면:

### Step 1: 프로젝트 생성
```bash
# 새 프로젝트 폴더 생성 (날짜 포함)
# 예: projects/260128-age-calculator/
```

### Step 2: 템플릿 복사 및 커스터마이징
- HTML: 콘텐츠, 제목, 설명 수정
- CSS: 색상, 레이아웃 변경
- JS: 기능 추가/수정

### Step 3: AdSense 코드 확인
**중요**: 모든 프로젝트에 다음 코드가 `<head>` 안에 있어야 함:

```html
<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4976487856728705"
     crossorigin="anonymous"></script>
```

### Step 4: Git Push (자동 배포)
```bash
cd c:\Steve\01_Vibe_Projects
git add -A
git commit -m "Add YYMMDD-project-name"
git push
```

### Step 5: Vercel에서 새 프로젝트 설정 (수동)
1. https://vercel.com/new 접속
2. `steve-byun/vibe-projects` 선택
3. Root Directory: `projects/YYMMDD-project-name` 입력
4. Deploy 클릭
5. Settings → Git → 연결 확인

---

## 자주 사용하는 명령어

### Git 작업
```bash
# 최신 데이터 가져오기
git pull origin main

# 변경사항 확인
git status

# 모든 변경사항 커밋 & 푸시
git add -A
git commit -m "메시지"
git push
```

### 프로젝트 확인
```bash
# 프로젝트 목록 보기
ls projects/

# AdSense 코드 확인
grep "ca-pub-4976487856728705" projects/YYMMDD-xxx/index.html
```

### 로컬 테스트
```bash
cd projects/YYMMDD-xxx
npx serve .
```

---

## AdSense 통합

### 설정 정보
- **클라이언트 ID**: `ca-pub-4976487856728705`
- **광고 위치**: 상단, 하단 (필요시 사이드바)

### 체크리스트
- [ ] `<head>`에 AdSense 스크립트 있음
- [ ] 클라이언트 ID가 정확함
- [ ] 광고 영역이 2개 이상 있음

---

## 배포 프로세스

### 기존 프로젝트 업데이트
Git Push만 하면 자동 배포:
```bash
git add -A
git commit -m "Update YYMMDD-xxx"
git push
```

### 새 프로젝트 추가
1. 프로젝트 생성 후 Git Push
2. Vercel에서 Import:
   - https://vercel.com/new
   - Root Directory: `projects/YYMMDD-xxx`
3. Settings에서 Git 연결 확인

---

## 배포된 프로젝트 목록

| 프로젝트 | URL | Root Directory |
|---------|-----|----------------|
| BMI 계산기 | https://bmi-calculator-topaz-five.vercel.app | `projects/260127-bmi-calculator` |
| 팁 계산기 | https://tip-calculator-nu-flax.vercel.app | `projects/260127-tip-calculator` |
| 환율 계산기 | https://currency-calculator-dun-mu.vercel.app | `projects/260127-currency-calculator` |

---

## 문제 해결

### Vercel 자동 배포 안 됨
1. Settings → Git 확인
2. Root Directory 확인
3. 새 커밋 푸시해서 테스트

### AdSense 코드가 없음
```bash
grep "ca-pub-4976487856728705" projects/YYMMDD-xxx/index.html
```
없으면 `<head>`에 추가

---

**마지막 업데이트**: 2026-01-27
**버전**: 3.0 (폴더 구조 개편)
