# ⚡ 빠른 시작 가이드

이 가이드를 따라하면 **10분 안에** 첫 수익형 프로젝트를 배포할 수 있습니다!

---

## 📋 체크리스트

시작하기 전에 확인:
- [ ] Node.js 설치됨 (버전 14 이상)
- [ ] 인터넷 연결
- [ ] 텍스트 에디터 (VS Code 추천)
- [ ] 배포 계정 (Netlify 또는 Vercel 추천)

---

## 🎯 10분 완성 가이드

### Step 1: 프로젝트 생성 (1분)

터미널을 열고:

```bash
cd revenue-project-factory
node scripts/create-project.js my-text-tools
```

✅ 완료! `projects/my-text-tools/` 폴더가 생성되었습니다.

---

### Step 2: 로컬 테스트 (2분)

```bash
cd projects/my-text-tools
npx serve .
```

브라우저에서 http://localhost:3000 열기

🎉 작동하는 것을 확인하세요!

---

### Step 3: 배포 (5분)

#### Option A: Netlify (가장 쉬움)

```bash
cd ../..  # revenue-project-factory로 돌아가기
node scripts/deploy.js my-text-tools netlify
```

처음 사용하면:
1. 브라우저에서 Netlify 로그인
2. 권한 승인
3. 배포 완료!

#### Option B: Vercel

```bash
node scripts/deploy.js my-text-tools vercel
```

---

### Step 4: 확인 (1분)

배포 완료 후 나오는 URL 클릭!

예: `https://my-text-tools.netlify.app`

🌐 전 세계에서 접근 가능합니다!

---

### Step 5: 수익화 시작 (나중에)

지금은 AdSense가 테스트 모드입니다. 실제 수익을 얻으려면:

1. **Google AdSense 계정 만들기**
   - https://www.google.com/adsense/
   - 가입 및 승인 대기 (1-2일)

2. **사이트 등록 및 승인**
   - 배포한 URL 등록
   - 승인 코드 추가
   - 승인 대기 (1-2주)

3. **광고 설정**
   - `adsense-config.js` 파일 수정:
   ```javascript
   clientId: 'ca-pub-YOUR-ID-HERE',  // 본인 ID로 변경
   testMode: false                     // false로 변경
   ```

4. **재배포**
   ```bash
   node scripts/deploy.js my-text-tools netlify
   ```

---

## 🎨 커스터마이징 (선택사항)

### 제목 변경

[index.html](../projects/my-text-tools/index.html) 열기:

```html
<h1>🛠️ 무료 텍스트 도구 모음</h1>
```

→ 원하는 제목으로 변경

### 색상 변경

[style.css](../projects/my-text-tools/style.css) 열기:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

→ 원하는 그라디언트로 변경

### 기능 추가

[script.js](../projects/my-text-tools/script.js)에 새 함수 추가

---

## 🚀 다음 프로젝트 만들기

이제 더 쉬워졌습니다!

```bash
# 프로젝트 2
node scripts/create-project.js calculator

# 프로젝트 3
node scripts/create-project.js password-generator

# 프로젝트 4
node scripts/create-project.js qr-code-maker
```

각 프로젝트를 배포:

```bash
node scripts/deploy.js calculator netlify
node scripts/deploy.js password-generator netlify
node scripts/deploy.js qr-code-maker netlify
```

---

## 💡 실전 팁

### 1. SEO 최적화

각 프로젝트의 `index.html`에서 수정:

```html
<meta name="description" content="무료 텍스트 도구...">
<meta name="keywords" content="텍스트 도구, 문자 수...">
<title>무료 텍스트 도구 모음</title>
```

→ 검색에 잘 나오도록 키워드 최적화

### 2. Google Search Console 등록

1. https://search.google.com/search-console/
2. 사이트 추가
3. 소유권 확인
4. Sitemap 제출

### 3. 트래픽 늘리기

- 📱 SNS에 공유 (트위터, 페이스북, 레딧)
- 📝 블로그 글 작성
- 🔗 관련 커뮤니티에 소개
- 📧 이메일 서명에 링크 추가

### 4. 분석 도구 추가

Google Analytics 추가:

```html
<!-- index.html의 </head> 앞에 추가 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🎯 첫 달 목표

- [ ] 3개 프로젝트 만들기
- [ ] AdSense 승인 받기
- [ ] 각 프로젝트에 100명 방문자
- [ ] 첫 수익 발생 확인

---

## ❓ 문제 해결

### "npx serve not found"

```bash
npm install -g serve
serve .
```

### "netlify command not found"

```bash
npm install -g netlify-cli
```

### 포트가 이미 사용 중

```bash
npx serve . -p 3001  # 다른 포트 사용
```

### AdSense 승인 안 됨

- 충분한 콘텐츠 (최소 10-15개 페이지)
- 고유한 콘텐츠 (복사 붙여넣기 X)
- 트래픽 (하루 최소 50-100명)
- 정책 준수 (불법 콘텐츠 X)

---

## 🤝 도움 받기

- **Claude Code**: 이 도구를 만든 AI 어시스턴트에게 물어보세요!
- **문서**: [README.md](../README.md) 전체 가이드
- **커뮤니티**: 개발자 커뮤니티에 질문

---

## 🎉 축하합니다!

첫 수익형 프로젝트를 배포했습니다!

이제 할 일:
1. ✅ 프로젝트 작동 확인
2. ✅ AdSense 계정 만들기
3. ✅ 2-3개 프로젝트 더 만들기
4. ✅ SNS에 공유
5. ⏳ 첫 수익 기다리기

**수익화는 마라톤입니다. 꾸준히 프로젝트를 늘려가세요! 💪**

---

다음: [전체 가이드 보기](../README.md)
