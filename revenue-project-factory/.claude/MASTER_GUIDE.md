# 🤖 Claude Code - Revenue Project Factory 마스터 가이드

이 파일은 Claude가 수익형 프로젝트를 자동으로 생성하고 배포하기 위한 완전한 가이드입니다.

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [전체 워크플로우](#전체-워크플로우)
3. [템플릿 구조](#템플릿-구조)
4. [AdSense 통합](#adsense-통합)
5. [배포 프로세스](#배포-프로세스)
6. [자주 사용하는 명령어](#자주-사용하는-명령어)

---

## 🎯 프로젝트 개요

**목적**: 수익형 웹 프로젝트를 빠르게 생성하고 배포하는 자동화 시스템

**핵심 기능**:
- 템플릿 기반 프로젝트 생성
- Google AdSense 자동 통합
- Netlify/Vercel 원클릭 배포
- SEO 최적화 구조

**사용자 정보**:
- AdSense 클라이언트 ID: `ca-pub-4976487856728705`
- 배포 플랫폼: Netlify
- 기존 사이트: https://playful-llama-64ad1f.netlify.app

---

## 🔄 전체 워크플로우

사용자가 "XXX를 만들어줘"라고 요청하면:

### Step 1: 템플릿 확인
```bash
# 기존 템플릿 확인
ls revenue-project-factory/templates/
```

**기존 템플릿**:
- `utility-webapp`: 텍스트 도구 모음 (6가지 도구)
- (추가 예정) `calculator`: 계산기 템플릿
- (추가 예정) `converter`: 변환 도구 템플릿

### Step 2: 프로젝트 생성
```bash
cd revenue-project-factory
node scripts/create-project.js [프로젝트명] [템플릿명]

# 예시
node scripts/create-project.js bmi-calculator calculator
```

### Step 3: 프로젝트 커스터마이징
사용자 요청에 따라:
- HTML: 콘텐츠, 제목, 설명 수정
- CSS: 색상, 레이아웃 변경
- JS: 기능 추가/수정

### Step 4: AdSense 코드 확인
**중요**: 모든 프로젝트에 다음 코드가 `<head>` 안에 있어야 함:

```html
<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4976487856728705"
     crossorigin="anonymous"></script>
```

### Step 5: 로컬 테스트
```bash
cd projects/[프로젝트명]
npx serve .
```

브라우저에서 http://localhost:3000 확인

### Step 6: Netlify 배포

**방법 A: 수동 배포 (가장 확실)**
1. https://app.netlify.com 접속
2. "Add new site" → "Deploy manually"
3. 프로젝트 폴더 드래그 앤 드롭
4. URL 받기

**방법 B: CLI 배포 (시도해볼 수 있음)**
```bash
cd revenue-project-factory
node scripts/deploy.js [프로젝트명] netlify
```

단, CLI에 버그가 있을 수 있으므로 실패하면 방법 A 사용

### Step 7: 배포 확인
```bash
# 웹에서 확인
curl https://[사이트URL] | grep "ca-pub-4976487856728705"
```

AdSense 코드가 있으면 성공!

---

## 📦 템플릿 구조

### 필수 파일 구조
```
templates/[템플릿명]/
├── index.html           # 메인 HTML (AdSense 코드 포함)
├── style.css            # 스타일시트
├── script.js            # JavaScript 로직
└── adsense-config.js    # AdSense 설정
```

### index.html 템플릿

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="[SEO 설명]">
    <meta name="keywords" content="[키워드1, 키워드2, 키워드3]">
    <title>[프로젝트 제목]</title>

    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4976487856728705"
         crossorigin="anonymous"></script>

    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>[프로젝트 제목]</h1>
            <p class="subtitle">[부제목]</p>
        </header>

        <!-- 상단 광고 -->
        <div class="ad-container" id="top-ad">
            <div class="ad-placeholder">광고 영역</div>
        </div>

        <!-- 메인 콘텐츠 -->
        <main>
            <!-- 여기에 기능 추가 -->
        </main>

        <!-- 하단 광고 -->
        <div class="ad-container" id="bottom-ad">
            <div class="ad-placeholder">광고 영역</div>
        </div>

        <footer>
            <p>&copy; 2026 [프로젝트명]. Made with Claude Code.</p>
        </footer>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

### style.css 기본 구조

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

/* 광고 영역 */
.ad-container {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
}

/* 반응형 */
@media (max-width: 768px) {
    body {
        padding: 10px;
    }
}
```

---

## 🎨 AdSense 통합

### 설정 정보
- **클라이언트 ID**: `ca-pub-4976487856728705`
- **테스트 모드**: 기본적으로 `true` (배포 시 수동으로 `false`)
- **광고 위치**: 상단, 하단 (필요시 사이드바)

### adsense-config.js 표준

```javascript
const ADSENSE_CONFIG = {
    clientId: 'ca-pub-4976487856728705',
    slots: {
        topBanner: '1234567890',
        bottomBanner: '0987654321',
    },
    settings: {
        enableAutoAds: true,
        testMode: true  // 배포 후 false로 변경
    }
};
```

### 중요 체크리스트
- [ ] `<head>`에 AdSense 스크립트 있음
- [ ] 클라이언트 ID가 정확함
- [ ] 광고 영역이 2개 이상 있음
- [ ] 테스트 모드 확인

---

## 🚀 배포 프로세스

### Netlify 수동 배포 (권장)

**단계**:
1. 프로젝트 폴더 준비
   ```
   revenue-project-factory/projects/[프로젝트명]/
   ```

2. Netlify 접속
   ```
   https://app.netlify.com
   ```

3. 배포 방법 선택:
   - **신규 사이트**: "Add new site" → "Deploy manually"
   - **기존 사이트 업데이트**: 사이트 페이지 → "Deploys" → 드래그 앤 드롭

4. 폴더 업로드
   - 프로젝트 폴더 전체를 드래그 앤 드롭
   - 또는 "browse to upload"로 폴더 선택

5. 배포 완료 확인
   - URL 받기: `https://[랜덤-이름].netlify.app`
   - 사이트 작동 확인
   - AdSense 코드 확인 (페이지 소스 보기)

### 배포 후 체크리스트
- [ ] 사이트가 정상적으로 로드됨
- [ ] 모든 기능이 작동함
- [ ] AdSense 코드가 `<head>`에 있음
- [ ] 모바일에서도 잘 보임
- [ ] SEO meta 태그가 적절함

---

## 🛠️ 자주 사용하는 명령어

### 프로젝트 관리
```bash
# 템플릿 목록 보기
ls revenue-project-factory/templates/

# 프로젝트 목록 보기
ls revenue-project-factory/projects/

# 새 프로젝트 생성
cd revenue-project-factory
node scripts/create-project.js [이름] [템플릿]

# 프로젝트 로컬 실행
cd projects/[프로젝트명]
npx serve .
```

### 파일 확인
```bash
# HTML에 AdSense 코드 확인
grep -n "ca-pub-4976487856728705" projects/[프로젝트명]/index.html

# 파일 구조 확인
ls -la projects/[프로젝트명]/
```

### 배포
```bash
# CLI 배포 시도 (실패할 수 있음)
node scripts/deploy.js [프로젝트명] netlify

# 실패 시: 수동 배포 안내
```

---

## 💡 사용자 요청 처리 패턴

### 패턴 1: "XXX 만들어줘"

**예시**: "BMI 계산기 만들어줘"

**처리 순서**:
1. 적절한 템플릿 선택 (calculator)
2. 프로젝트 생성
3. 기능 커스터마이징 (BMI 계산 로직)
4. 로컬 테스트
5. 배포 안내

**응답 예시**:
```
BMI 계산기를 만들겠습니다!

1. 프로젝트 생성 중...
   [create-project.js 실행]

2. BMI 계산 기능 추가 중...
   [HTML/JS 수정]

3. 로컬에서 테스트해보세요:
   cd projects/bmi-calculator
   npx serve .

4. 배포는 Netlify에서 드래그 앤 드롭하세요!
```

### 패턴 2: "XXX를 참고해서 YYY 만들어줘"

**예시**: "텍스트 도구를 참고해서 이미지 변환기 만들어줘"

**처리 순서**:
1. 참고 프로젝트 확인
2. 유사한 템플릿 선택 또는 새로 생성
3. 프로젝트 생성
4. 차이점 커스터마이징
5. 배포

### 패턴 3: "배포해줘"

**처리 순서**:
1. 배포할 프로젝트 확인
2. AdSense 코드 체크
3. Netlify 수동 배포 안내
4. 배포 URL 확인 요청

---

## 🎯 성공 기준

프로젝트가 성공적으로 완료되려면:

- ✅ 프로젝트가 생성됨
- ✅ 로컬에서 정상 작동
- ✅ AdSense 코드가 포함됨
- ✅ Netlify에 배포됨
- ✅ 배포된 사이트에 AdSense 코드가 있음
- ✅ 사용자가 URL을 확인함

---

## 🚨 자주 발생하는 문제

### 문제 1: AdSense 코드가 배포된 사이트에 없음

**원인**:
- 잘못된 폴더를 업로드함
- 템플릿 폴더를 업로드함

**해결**:
```bash
# 올바른 폴더 확인
head -20 revenue-project-factory/projects/[프로젝트명]/index.html

# AdSense 코드가 있는지 확인
grep "ca-pub-4976487856728705" revenue-project-factory/projects/[프로젝트명]/index.html
```

### 문제 2: Netlify CLI 오류

**해결**: 수동 배포 사용
- https://app.netlify.com에서 드래그 앤 드롭

### 문제 3: 캐시 문제

**해결**:
- 강제 새로고침: `Ctrl + Shift + R`
- 시크릿 모드로 확인
- 페이지 소스 직접 확인

---

## 📚 참고 자료

- [프로젝트 README](../README.md)
- [템플릿 가이드](./TEMPLATE_GUIDE.md)
- [배포 가이드](./DEPLOYMENT_GUIDE.md)

---

**마지막 업데이트**: 2026-01-26
**버전**: 1.0
**작성자**: Claude Code
