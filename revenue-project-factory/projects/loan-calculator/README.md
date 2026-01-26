# loan-calculator

이 프로젝트는 **Revenue Project Factory**로 생성되었습니다.

## 🚀 시작하기

```bash
# 로컬에서 실행
npx serve .

# 또는
python -m http.server 8000
```

브라우저에서 http://localhost:8000 (또는 다른 포트) 열기

## 💰 수익화 설정

1. [Google AdSense](https://www.google.com/adsense/) 계정 생성
2. 사이트 승인 받기
3. `adsense-config.js` 파일에서 설정 업데이트:
   - `clientId`: 본인의 AdSense 클라이언트 ID
   - `slots`: 광고 단위 슬롯 ID들
   - `testMode`: false로 변경 (배포 시)
4. `index.html`에 AdSense 스크립트 추가

## 📤 배포

### Netlify (추천)
```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 배포
netlify deploy --prod
```

### Vercel
```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel --prod
```

### GitHub Pages
1. GitHub 저장소 생성
2. Settings > Pages에서 활성화
3. `git push`

## 📈 SEO 최적화

- [ ] meta 태그 수정 (description, keywords)
- [ ] Open Graph 태그 추가
- [ ] sitemap.xml 생성
- [ ] robots.txt 설정
- [ ] Google Search Console 등록
- [ ] Google Analytics 설정

## 🔧 커스터마이징

- `style.css`: 디자인 변경
- `script.js`: 기능 추가/수정
- `index.html`: 구조 변경

생성 날짜: 2026. 1. 26.
