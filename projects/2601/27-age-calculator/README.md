# age-calculator

이 프로젝트는 **Revenue Project Factory**로 생성되었습니다.

## 기능

- **만 나이 계산**: 2023년부터 법적으로 사용되는 나이
- **한국 나이 계산**: 태어난 해를 1살로 계산
- **연 나이 계산**: 올해 연도 - 태어난 연도
- **띠(12지신) 계산**: 출생년도 기준 띠 확인
- **별자리 계산**: 생일 기준 별자리 확인
- **상세 정보**: 태어난 지 며칠, 다음 생일까지, 태어난 요일

## 시작하기

```bash
# 로컬에서 실행
npx serve .

# 또는
python -m http.server 8000
```

브라우저에서 http://localhost:8000 (또는 다른 포트) 열기

## 수익화 설정

1. [Google AdSense](https://www.google.com/adsense/) 계정 생성
2. 사이트 승인 받기
3. `adsense-config.js` 파일에서 설정 업데이트:
   - `clientId`: 본인의 AdSense 클라이언트 ID
   - `slots`: 광고 단위 슬롯 ID들
   - `testMode`: false로 변경 (배포 시)
4. `index.html`에 AdSense 스크립트 추가

## 배포

### Vercel (Git 자동 배포)
```bash
git add .
git commit -m "Add age-calculator"
git push
```
Vercel에서 Import 후 Root Directory: `projects/260127-age-calculator` 설정

### Netlify
```bash
netlify deploy --prod
```

## SEO 최적화

- [ ] meta 태그 수정 (description, keywords)
- [ ] Open Graph 태그 추가
- [ ] sitemap.xml 생성
- [ ] robots.txt 설정
- [ ] Google Search Console 등록
- [ ] Google Analytics 설정

## 커스터마이징

- `style.css`: 디자인 변경
- `script.js`: 기능 추가/수정
- `index.html`: 구조 변경

생성 날짜: 2026. 1. 27.
