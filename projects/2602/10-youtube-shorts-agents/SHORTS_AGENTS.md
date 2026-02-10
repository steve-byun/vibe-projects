# YouTube Shorts 5-Agent 자동 생성 시스템 (Shorts Factory)

## 개요
주제만 입력하면 5명의 AI 에이전트가 팀으로 협업하여 한국인 타겟 YouTube Shorts를 자동 생성하는 웹 프로그램.

## 실행 방법
```bash
cd projects/2602/10-youtube-shorts-agents/backend
pip install -r requirements.txt
python app.py
# 브라우저에서 http://127.0.0.1:5000 접속
```

## 사전 설정
1. 웹 UI 우측 상단 ⚙ 클릭
2. **Anthropic API Key** 입력 (Claude API)
3. **Pexels API Key** 입력 (무료: https://www.pexels.com/api/)

## 5 에이전트 파이프라인
```
사용자 입력 → [기획PD] → [작가] → ┬→ [리서처] → ┬→ [편집자] → 완성 영상
                                   └→ [성우]   → ┘
```

| # | 에이전트 | 역할 | 기술 |
|---|---------|------|------|
| 1 | 기획 PD | 콘셉트, 톤, 구조 결정 | Claude Sonnet |
| 2 | 작가 | 내레이션 스크립트 작성 | Claude Sonnet |
| 3 | 리서처 | 키워드 번역 → 스톡 영상 검색/다운로드 | Claude + Pexels API |
| 4 | 성우 | TTS 나레이션 + 단어별 타이밍 | Edge-TTS (무료) |
| 5 | 편집자 | 영상 조합 + 자막 + 렌더링 | FFmpeg |

- 리서처 + 성우 **병렬 실행** (속도 최적화)
- Claude API 호출: 영상당 **3회** → 약 $0.01~0.03/영상

## 기술 스택
- **AI**: Claude API (Anthropic SDK)
- **TTS**: Edge-TTS (ko-KR-SunHiNeural)
- **영상 소스**: Pexels API
- **영상 처리**: FFmpeg (libx264, AAC)
- **백엔드**: Flask + SSE
- **프론트엔드**: Vanilla HTML/CSS/JS

## 프로젝트 구조
```
backend/
├── app.py              # Flask 웹 서버
├── config.json         # API 키, 설정
├── agents/             # 5개 AI 에이전트
├── pipeline/           # 오케스트레이터 + 데이터 모델
├── services/           # 공통 서비스 (Claude, TTS, Pexels, FFmpeg, 자막)
├── ffmpeg/             # FFmpeg 바이너리
└── output/             # 생성된 영상
frontend/
├── index.html          # 웹 UI
├── style.css           # 다크 테마
└── app.js              # SSE + 제어
```

## 현재 상태
- [x] 기본 구조 완성
- [x] 5개 에이전트 구현
- [x] 파이프라인 오케스트레이터
- [x] 웹 UI (다크 테마, 파이프라인 시각화)
- [x] 서버 기동 확인
- [ ] API 키 설정 후 E2E 테스트
