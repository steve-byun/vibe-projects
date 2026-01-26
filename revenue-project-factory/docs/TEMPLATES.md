# 📦 템플릿 가이드

현재 사용 가능한 템플릿과 새 템플릿을 만드는 방법을 설명합니다.

---

## 🎨 현재 템플릿

### 1. utility-webapp (기본)

**설명**: 6가지 텍스트 처리 도구가 포함된 유틸리티 웹앱

**포함 기능**:
- 문자 수 세기
- 대소문자 변환
- JSON 포맷터
- Base64 인코더/디코더
- 공백 제거
- 텍스트 정렬

**사용 사례**:
- 개발자 도구
- 텍스트 편집 유틸리티
- 데이터 변환 도구

**SEO 키워드**:
- "문자 수 세기"
- "JSON 포맷터"
- "Base64 변환"

**수익 잠재력**: ⭐⭐⭐⭐
- 개발자 트래픽
- 재방문율 높음
- 광고 클릭률 중간

---

## 🆕 새 템플릿 만들기

### 기본 구조

새 템플릿은 다음 구조를 따라야 합니다:

```
templates/
└── your-template-name/
    ├── index.html          # 필수
    ├── style.css           # 권장
    ├── script.js           # 권장
    ├── adsense-config.js   # 권장 (수익화용)
    └── README.md           # 선택사항
```

### Step 1: 폴더 생성

```bash
cd revenue-project-factory/templates
mkdir my-new-template
cd my-new-template
```

### Step 2: index.html 작성

최소한의 구조:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="프로젝트 설명">
    <meta name="keywords" content="키워드1, 키워드2, 키워드3">
    <title>프로젝트 제목</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>프로젝트 제목</h1>
        </header>

        <!-- 상단 광고 영역 -->
        <div class="ad-container" id="top-ad">
            <div class="ad-placeholder">광고 영역</div>
        </div>

        <!-- 메인 콘텐츠 -->
        <main>
            <!-- 여기에 기능 추가 -->
        </main>

        <!-- 하단 광고 영역 -->
        <div class="ad-container" id="bottom-ad">
            <div class="ad-placeholder">광고 영역</div>
        </div>

        <footer>
            <p>&copy; 2026 Your Project. Made with Claude Code.</p>
        </footer>
    </div>

    <script src="adsense-config.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

### Step 3: style.css 작성

기본 스타일:

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

header {
    text-align: center;
    color: white;
    margin-bottom: 30px;
}

.ad-container {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
}

main {
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

footer {
    text-align: center;
    color: white;
    margin-top: 30px;
    opacity: 0.8;
}
```

### Step 4: script.js 작성

기본 기능:

```javascript
// 페이지 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('프로젝트 시작!');

    // 여기에 기능 추가
    initializeFeatures();
});

function initializeFeatures() {
    // 기능 초기화 코드
}
```

### Step 5: adsense-config.js 복사

기존 템플릿에서 복사:

```bash
cp ../utility-webapp/adsense-config.js .
```

---

## 💡 템플릿 아이디어

### 계산기 템플릿

**파일**: `templates/calculator/`

**기능**:
- 기본 사칙연산
- 과학 계산기 모드
- 계산 히스토리
- 키보드 지원

**타겟**: "계산기", "온라인 계산기"

---

### 게임 템플릿

**파일**: `templates/simple-game/`

**기능**:
- 캔버스 기반 게임
- 점수 시스템
- 로컬스토리지 최고점
- 공유 기능

**타겟**: "온라인 게임", "무료 게임"

---

### 변환 도구 템플릿

**파일**: `templates/converter/`

**기능**:
- 단위 변환 (길이, 무게, 온도)
- 실시간 변환
- 즐겨찾기 변환
- 계산 히스토리

**타겟**: "단위 변환", "길이 변환"

---

### QR 코드 생성기 템플릿

**파일**: `templates/qr-generator/`

**기능**:
- QR 코드 생성
- 다운로드 기능
- 색상 커스터마이징
- 로고 삽입

**라이브러리**: qrcode.js

**타겟**: "QR 코드 생성", "무료 QR"

---

## 🔧 고급 기능 추가

### 1. 외부 라이브러리 사용

CDN으로 라이브러리 추가:

```html
<!-- Chart.js 예시 -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

### 2. API 연동

```javascript
// 날씨 API 예시
async function getWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/...`);
    const data = await response.json();
    return data;
}
```

### 3. 로컬스토리지 활용

```javascript
// 데이터 저장
localStorage.setItem('userData', JSON.stringify(data));

// 데이터 불러오기
const data = JSON.parse(localStorage.getItem('userData'));
```

### 4. PWA 기능

`manifest.json` 추가:

```json
{
  "name": "My App",
  "short_name": "App",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "icon.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 📋 템플릿 체크리스트

새 템플릿을 만들 때 확인할 사항:

- [ ] `index.html` 존재
- [ ] 반응형 디자인 (모바일 지원)
- [ ] 광고 영역 2개 이상
- [ ] SEO meta 태그 완성
- [ ] 브라우저 호환성 테스트
- [ ] 로딩 속도 최적화
- [ ] 접근성 (accessibility) 고려
- [ ] README.md 작성

---

## 🎯 템플릿 최적화 팁

### SEO

```html
<!-- 필수 meta 태그 -->
<meta name="description" content="명확하고 매력적인 설명">
<meta name="keywords" content="타겟 키워드들">

<!-- Open Graph -->
<meta property="og:title" content="제목">
<meta property="og:description" content="설명">
<meta property="og:image" content="이미지 URL">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
```

### 성능

- 이미지 최적화 (WebP 사용)
- CSS/JS 압축
- 불필요한 라이브러리 제거
- 지연 로딩 (lazy loading)

### 사용자 경험

- 직관적인 UI
- 빠른 로딩 시간
- 명확한 버튼/레이블
- 에러 처리
- 로딩 인디케이터

---

## 🚀 템플릿 테스트

새 템플릿 생성 후 테스트:

```bash
# 1. 프로젝트 생성
node scripts/create-project.js test-project my-new-template

# 2. 로컬 실행
cd projects/test-project
npx serve .

# 3. 테스트
# - 모든 기능 작동 확인
# - 다양한 브라우저 테스트
# - 모바일 디바이스 테스트

# 4. 문제 없으면 템플릿 완성!
```

---

## 📚 참고 자료

- [HTML 기본](https://developer.mozilla.org/ko/docs/Web/HTML)
- [CSS 기본](https://developer.mozilla.org/ko/docs/Web/CSS)
- [JavaScript 기본](https://developer.mozilla.org/ko/docs/Web/JavaScript)
- [Google AdSense 정책](https://support.google.com/adsense/answer/48182)

---

## 🤝 템플릿 공유

좋은 템플릿을 만들었다면:
1. `templates/` 폴더에 추가
2. 이 문서에 설명 추가
3. 커뮤니티와 공유!

---

다음: [빠른 시작 가이드](QUICKSTART.md)
