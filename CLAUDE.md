# 프로젝트 지침

## 세션 명령어

### `시작` / `작업준비`
1. 현재 상태 요약 출력
2. 작업할 프로젝트의 상세 MD 읽기 (필요시)

### `저장` / `끝` / `이상` / `탭 종료`
1. 작업한 프로젝트의 상세 MD 업데이트
2. `.claude/CHANGELOG.md`에 작업 내용 추가
3. MEMORY.md 상태 갱신

### `pull` → git pull origin main
### `push` → git add -A && git commit && git push

## 기본 규칙
- 한국어로 대화
- git push는 항상 먼저 물어보기

---

## 프로젝트 목록

### 활성
| 프로젝트 | 경로 | 상세 파일 | 상태 |
|---------|------|----------|------|
| AI 크로스체커 (확장) | `projects/2601/28-ai-cross-checker-extension` | `AI_CROSS_CHECKER.md` | 사용 중 |
| AI 크로스체커 (웹) | `projects/2601/28-ai-cross-checker` | - | 배포됨 |
| 서바이버 게임 | `projects/2602/09-survivor-game` | `SURVIVOR_GAME.md` | 개발 중 |
| 로봇공학 학습 | `Robotics_Learning` | `ROBOTICS_LEARNING.md` | 학습 중 |

### 완료
| 프로젝트 | 경로 |
|---------|------|
| BMI 계산기 | `projects/2601/27-bmi-calculator` |
| 팁 계산기 | `projects/2601/27-tip-calculator` |
| 환율 계산기 | `projects/2601/27-currency-calculator` |
| 나이 계산기 | `projects/2601/27-age-calculator` |
| 할인가 계산기 | `projects/2601/27-discount-calculator` |
| D-day 계산기 | `projects/2601/27-dday-calculator` |
| 퍼센트 계산기 | `projects/2601/27-percent-calculator` |
| YouTube Shorts Generator | `projects/2602/02-youtube-shorts-generator` |
| PinDirect 위젯 | `projects/2601/28-pindirect-widget` |
| Window Cleaner | `projects/2601/28-window-cleaner` |

---

## 상세 파일 규칙
- 각 프로젝트 폴더 안에 `프로젝트명.md` (예: `SURVIVOR_GAME.md`)
- MEMORY.md = AI가 항상 알고 있는 핵심 요약 (자동 로드)
- `.claude/CHANGELOG.md` = 완료된 작업 히스토리

## 프로젝트 구조

```
C:\Dev\
├── CLAUDE.md                  # 이 파일 (프로젝트 지침 + 인덱스)
├── .claude/
│   └── CHANGELOG.md           # 완료된 작업 히스토리
├── Robotics_Learning/         # 로봇공학 학습
│   └── ROBOTICS_LEARNING.md
├── projects/                  # 프로젝트들 (각 폴더에 상세 MD)
│   └── YYMM/DD-project-name/
├── tools/                     # 유틸리티 도구
└── scripts/                   # 자동화 스크립트
```

---

## 계정 정보

| 서비스 | 정보 |
|--------|------|
| **GitHub** | steve-byun / [vibe-projects](https://github.com/steve-byun/vibe-projects) |
| **AdSense** | `ca-pub-4976487856728705` (승인 대기 중) |

## TODO
- [ ] s07_control 심화: Computed Torque, 임피던스/힘 제어
- [ ] AdSense 승인 확인
