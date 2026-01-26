# 💰 Revenue Project Factory

**수익형 미니 프로젝트를 빠르게 생성하고 배포하는 자동화 시스템**

이 시스템을 사용하면 AdSense가 통합된 웹 프로젝트를 몇 분 만에 생성하고 배포할 수 있습니다!

---

## 🎯 목표

1. **빠른 프로젝트 생성**: 템플릿 기반으로 수익형 프로젝트를 자동 생성
2. **수익화 자동화**: Google AdSense 통합 구조가 이미 구축됨
3. **쉬운 배포**: 원클릭 배포 스크립트로 Netlify, Vercel, GitHub Pages에 즉시 배포
4. **확장 가능**: 새로운 템플릿을 추가하여 다양한 프로젝트 생성

---

## 📁 프로젝트 구조

```
revenue-project-factory/
├── templates/              # 프로젝트 템플릿
│   └── utility-webapp/     # 기본 템플릿: 텍스트 유틸리티 웹앱
│       ├── index.html
│       ├── style.css
│       ├── script.js
│       └── adsense-config.js
├── projects/               # 생성된 프로젝트들이 저장되는 곳
├── scripts/                # 자동화 스크립트
│   ├── create-project.js   # 프로젝트 생성 스크립트
│   └── deploy.js           # 배포 자동화 스크립트
├── .claude/                # Claude AI 참조 가이드 ⭐ NEW!
│   ├── MASTER_GUIDE.md     # 전체 프로세스 가이드
│   ├── TEMPLATE_GUIDE.md   # 템플릿 제작 가이드
│   └── HOW_TO_USE.md       # 사용법 가이드
├── docs/                   # 사용자 문서
└── README.md               # 이 파일
```

---

## 🚀 빠른 시작

### 1. 새 프로젝트 생성

```bash
cd revenue-project-factory
node scripts/create-project.js my-awesome-tool
```

이제 `projects/my-awesome-tool/` 폴더에 완전한 프로젝트가 생성됩니다!

### 2. 로컬에서 테스트

```bash
cd projects/my-awesome-tool
npx serve .
```

브라우저에서 http://localhost:3000 열기

### 3. AdSense 설정

`adsense-config.js` 파일 수정:
- `clientId`: 본인의 AdSense 클라이언트 ID로 변경
- `slots`: 광고 슬롯 ID들 업데이트
- `testMode`: false로 변경 (실제 광고 표시)

### 4. 배포

```bash
cd revenue-project-factory
node scripts/deploy.js my-awesome-tool netlify
```

또는 Vercel:
```bash
node scripts/deploy.js my-awesome-tool vercel
```

---

## 📚 상세 사용법

### 프로젝트 생성 옵션

```bash
# 기본 템플릿으로 생성
node scripts/create-project.js project-name

# 특정 템플릿 지정
node scripts/create-project.js project-name utility-webapp

# 사용 가능한 템플릿 목록 보기
node scripts/create-project.js --list

# 도움말
node scripts/create-project.js --help
```

### 배포 옵션

```bash
# Netlify 배포 (자동)
node scripts/deploy.js project-name netlify

# Vercel 배포 (자동)
node scripts/deploy.js project-name vercel

# GitHub Pages 배포 (안내)
node scripts/deploy.js project-name github

# 도움말
node scripts/deploy.js --help
```

---

## 💡 기본 템플릿 소개

### utility-webapp: 텍스트 유틸리티 도구 모음

**포함된 기능:**
1. 📊 문자 수 세기 (문자/단어/줄 수)
2. 🔄 대소문자 변환 (대문자/소문자/제목형)
3. 📋 JSON 포맷터 (포맷/압축/검증)
4. 🔐 Base64 인코더/디코더
5. ✂️ 공백 제거 (전체/여분/빈줄)
6. 📝 텍스트 정렬 (오름차순/내림차순/섞기)

**특징:**
- 반응형 디자인 (모바일 최적화)
- 즉시 사용 가능한 6가지 도구
- AdSense 광고 슬롯 2개 (상단/하단)
- SEO 최적화된 meta 태그
- 로컬 처리 (개인정보 보호)

---

## 🎨 새 템플릿 만들기

1. `templates/` 폴더에 새 폴더 생성
2. 최소한 `index.html` 포함
3. `adsense-config.js` 포함 권장
4. 프로젝트 생성 시 템플릿명 지정

```bash
node scripts/create-project.js my-project new-template-name
```

---

## 💰 수익화 가이드

### Google AdSense 시작하기

1. **AdSense 계정 생성**
   - https://www.google.com/adsense/ 방문
   - 계정 생성 및 승인 대기 (보통 1-2일)

2. **사이트 승인**
   - 프로젝트 배포 후 URL 등록
   - 승인 코드를 `<head>`에 추가
   - 승인 대기 (보통 1-2주)

3. **광고 단위 생성**
   - AdSense 대시보드에서 광고 단위 생성
   - 디스플레이 광고 선택
   - 슬롯 ID 복사

4. **프로젝트에 적용**
   - `adsense-config.js`에 ID들 입력
   - `testMode: false`로 변경
   - 재배포

### 수익 최적화 팁

- **트래픽 늘리기**: SEO 최적화, 소셜 미디어 공유
- **광고 배치**: 콘텐츠 중간에 자연스럽게 배치
- **여러 프로젝트**: 다양한 니치에 여러 프로젝트 만들기
- **사용자 경험**: 광고가 너무 방해되지 않도록 주의
- **A/B 테스트**: 광고 위치와 크기 실험

---

## 📈 프로젝트 아이디어

이 시스템으로 만들 수 있는 프로젝트들:

### 계산기 시리즈
- 대출 계산기
- BMI 계산기
- 환율 계산기
- 팁 계산기
- 날짜 계산기

### 변환 도구
- 단위 변환기 (길이/무게/온도)
- 이미지 포맷 변환기
- 색상 코드 변환기
- 파일 크기 변환기

### 생성 도구
- QR 코드 생성기
- 랜덤 비밀번호 생성기
- Lorem Ipsum 생성기
- 그라디언트 생성기

### 게임
- 2048
- 뱀 게임
- 테트리스
- 타이핑 게임

---

## 🛠️ 기술 스택

- **프론트엔드**: HTML, CSS, JavaScript (순수, 프레임워크 불필요)
- **광고**: Google AdSense
- **배포**: Netlify, Vercel, GitHub Pages
- **자동화**: Node.js

---

## 📖 다음 단계

1. **첫 프로젝트 만들기**
   ```bash
   node scripts/create-project.js calculator
   ```

2. **커스터마이징**
   - 디자인 변경 (style.css)
   - 기능 추가/수정 (script.js)
   - 내용 변경 (index.html)

3. **테스트**
   ```bash
   cd projects/calculator
   npx serve .
   ```

4. **배포**
   ```bash
   node scripts/deploy.js calculator netlify
   ```

5. **수익화**
   - AdSense 설정
   - SEO 최적화
   - 마케팅

6. **반복!**
   - 새 프로젝트 생성
   - 다양한 니치 공략
   - 포트폴리오 확장

---

## ❓ FAQ

**Q: Node.js가 없으면?**
A: https://nodejs.org/ 에서 다운로드 및 설치

**Q: AdSense 승인이 안 되면?**
A: 충분한 콘텐츠와 트래픽 확보 후 재신청. 보통 2-3주 소요

**Q: 무료로 배포할 수 있나요?**
A: 네! Netlify, Vercel, GitHub Pages 모두 무료 플랜 제공

**Q: 얼마나 벌 수 있나요?**
A: 트래픽과 니치에 따라 다름. 처음엔 작지만 프로젝트가 많아지면 복리 효과

**Q: 프로그래밍 초보인데 가능한가요?**
A: 네! 이미 만들어진 템플릿을 복사하는 것부터 시작하세요

**Q: 템플릿을 어떻게 수정하나요?**
A: HTML/CSS/JS 파일을 직접 편집. Claude에게 물어보세요!

---

## 🎯 성공 사례 시나리오

**시나리오 1: 계산기 포트폴리오**
- 10개의 다른 계산기 프로젝트 생성
- 각각 특정 키워드 타겟 (예: "대출 계산기")
- 총 월 10,000 방문자 → 월 $50-100 수익

**시나리오 2: 유틸리티 도구 모음**
- 5개의 유틸리티 사이트
- SNS에 공유하여 바이럴
- 월 50,000 방문자 → 월 $200-500 수익

**시나리오 3: 게임 포털**
- 간단한 브라우저 게임 10개
- 중독성 있는 게임플레이
- 재방문율 높음 → 안정적 수익

---

## 🤝 기여 및 피드백

이 프로젝트를 개선할 아이디어가 있으신가요?
- 새로운 템플릿 추가
- 자동화 스크립트 개선
- 문서 개선

---

## 📝 라이센스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

## 🚀 지금 시작하세요!

```bash
# 1. 프로젝트 생성
node scripts/create-project.js my-first-project

# 2. 테스트
cd projects/my-first-project
npx serve .

# 3. 배포
cd ../..
node scripts/deploy.js my-first-project netlify
```

**행운을 빕니다! 첫 수익을 기대하세요! 💰**

---

생성 날짜: ${new Date().toLocaleDateString('ko-KR')}
Made with ❤️ using Claude Code
