# 카피바라 Go! - 아키텍처 설계서

## 개요
카피바라 Go 스타일의 텍스트 기반 로그라이크 RPG 웹게임.
언어: 한국어, 플랫폼: 웹 브라우저 (모바일 우선)

## 파일 구조
```
index.html          ← Agent 1 (html-architect)
css/style.css       ← Agent 2 (css-stylist)
js/data.js          ← Agent 3 (data-creator)
js/mechanics.js     ← Agent 4 (mechanics-dev)
js/game.js          ← Agent 5 (game-engine)
assets/             ← 이미지 에셋
```

## 스크립트 로드 순서 (index.html)
```html
<script src="js/data.js"></script>
<script src="js/mechanics.js"></script>
<script src="js/game.js"></script>
```

---

## HTML 구조 (Element IDs)

### 화면 (Screens) - class="screen"으로 표시/숨김
- `#screen-title` : 타이틀 화면
- `#screen-game` : 메인 게임 화면
- `#screen-battle` : 전투 화면
- `#screen-skill-select` : 스킬 선택 화면
- `#screen-event` : 이벤트/인카운터 화면
- `#screen-chapter-clear` : 챕터 클리어 화면
- `#screen-gameover` : 게임 오버 화면

### 타이틀 화면 (#screen-title)
- `#title-logo` : 게임 로고/타이틀 영역
- `#btn-start` : 새 게임 시작 버튼
- `#btn-continue` : 이어하기 버튼 (저장 있을 때만 표시)

### 메인 게임 화면 (#screen-game)
- `#game-header` : 상단 바 (챕터/일차)
  - `#display-chapter` : 챕터 번호
  - `#display-day` : 현재 일차 / 최대 일차
- `#player-stats` : 플레이어 스탯 바
  - `#player-avatar` : 카피바라 아바타 이미지
  - `#stat-hp-bar` : HP 바 (내부에 #stat-hp-fill, #stat-hp-text)
  - `#stat-exp-bar` : EXP 바 (내부에 #stat-exp-fill, #stat-exp-text)
  - `#stat-level` : 레벨
  - `#stat-atk` : 공격력
  - `#stat-def` : 방어력
  - `#stat-gold` : 골드
- `#game-log` : 게임 로그 (스크롤 가능 텍스트 영역)
- `#game-actions` : 하단 액션 버튼 영역
  - `#btn-next-day` : "다음 날 →" 버튼
  - `#btn-inventory` : 인벤토리 버튼
  - `#btn-skills` : 스킬 목록 버튼

### 전투 화면 (#screen-battle)
- `#battle-enemy` : 적 정보
  - `#enemy-name` : 적 이름
  - `#enemy-icon` : 적 아이콘
  - `#enemy-hp-bar` : 적 HP 바 (#enemy-hp-fill, #enemy-hp-text)
- `#battle-vs` : VS 표시
- `#battle-player` : 플레이어 정보 (간략)
  - `#battle-player-hp-bar` : 플레이어 HP 바
- `#battle-log` : 전투 로그 (라운드별 텍스트)
- `#battle-result` : 전투 결과 (숨겨져 있다가 표시)
  - `#battle-result-text` : 결과 텍스트
  - `#battle-rewards` : 보상 목록
  - `#btn-battle-continue` : 계속 버튼

### 이벤트 화면 (#screen-event)
- `#event-icon` : 이벤트 아이콘 (큰 이모지/이미지)
- `#event-title` : 이벤트 제목
- `#event-description` : 이벤트 설명 텍스트
- `#event-choices` : 선택지 버튼 컨테이너 (동적 생성)

### 스킬 선택 화면 (#screen-skill-select)
- `#skill-select-title` : "스킬을 선택하세요!" 제목
- `#skill-cards` : 스킬 카드 3개 컨테이너
  - 각 카드: `.skill-card` 클래스, data-skill-id 속성
    - `.skill-card-icon` : 스킬 아이콘
    - `.skill-card-name` : 스킬 이름
    - `.skill-card-rarity` : 등급 (일반/전설/신화)
    - `.skill-card-desc` : 스킬 설명
    - `.skill-card-type` : 유형 (공격/방어/버프/회복)

### 챕터 클리어 (#screen-chapter-clear)
- `#clear-title` : "챕터 N 클리어!"
- `#clear-rewards` : 보상 목록
- `#btn-next-chapter` : 다음 챕터 버튼

### 게임 오버 (#screen-gameover)
- `#gameover-title` : "게임 오버"
- `#gameover-stats` : 최종 스탯 요약
- `#btn-restart` : 다시 시작 버튼

### 모달/패널
- `#modal-inventory` : 인벤토리 모달
  - `#inventory-equipment` : 장비 슬롯
  - `#inventory-skills` : 보유 스킬 목록
  - `#inventory-pets` : 펫 목록
  - `#btn-close-inventory` : 닫기 버튼
- `#modal-overlay` : 모달 배경 오버레이

---

## CSS 클래스 규칙

### 화면 전환
```css
.screen { display: none; }
.screen.active { display: flex; }
```

### 공통 클래스
- `.btn` : 기본 버튼
- `.btn-primary` : 주요 액션 버튼 (녹색 계열)
- `.btn-secondary` : 보조 버튼
- `.btn-danger` : 위험/빨간 버튼
- `.hp-bar` : HP 바 컨테이너
- `.hp-fill` : HP 바 채움 (width: N%)
- `.exp-bar` : EXP 바
- `.exp-fill` : EXP 바 채움
- `.rarity-common` : 일반 등급 (회색 테두리)
- `.rarity-legendary` : 전설 등급 (보라색 테두리/빛남)
- `.rarity-mythic` : 신화 등급 (금색 테두리/빛남)
- `.damage-text` : 데미지 숫자 애니메이션
- `.heal-text` : 회복 숫자 애니메이션
- `.shake` : 흔들림 애니메이션 (피격)
- `.fade-in` : 페이드인
- `.slide-up` : 슬라이드업

### 테마 컬러
- 배경: #1a1a2e (다크 네이비)
- 카드/패널: #16213e (다크 블루)
- 주요 텍스트: #e8e8e8 (밝은 회색)
- 포인트: #e94560 (핑크-레드)
- HP 바: #4ecca3 → #e94560 (높음 → 낮음)
- EXP 바: #00b4d8
- 골드: #ffd700
- 일반 등급: #9e9e9e
- 전설 등급: #a855f7
- 신화 등급: #f59e0b

---

## 데이터 구조 (data.js가 window에 노출)

### window.GAME_DATA.skills
```js
{
  id: 'skill_dagger',
  name: '단검 투척',
  description: '적에게 공격력의 45%의 물리 피해를 입힌다',
  rarity: 'common',   // 'common' | 'legendary' | 'mythic'
  type: 'attack',     // 'attack' | 'defense' | 'buff' | 'heal'
  icon: '🗡️',
  effects: [
    { type: 'damage', value: 0.45, target: 'single', element: 'physical' }
  ]
}
```

### window.GAME_DATA.encounters
```js
{
  id: 'campsite',
  name: '야영지',
  description: '버려진 야영지를 발견했다. 아직 사용할 수 있어 보인다.',
  type: 'choice',     // 'choice' | 'battle' | 'fortune' | 'trap'
  icon: '🏕️',
  minDay: 1,
  maxDay: 60,
  weight: 10,          // 등장 확률 가중치
  choices: [
    {
      text: '휴식하기',
      description: 'HP를 60% 회복한다',
      effects: [{ type: 'healPercent', value: 0.6 }]
    },
    {
      text: '수색하기',
      description: '최대 HP가 15% 증가한다',
      effects: [{ type: 'maxHpPercent', value: 0.15 }]
    }
  ]
}
```

### window.GAME_DATA.enemies
```js
{
  id: 'slime',
  name: '슬라임',
  icon: '🟢',
  baseHp: 50,
  baseAtk: 8,
  baseDef: 2,
  exp: 20,
  gold: 5,
  skills: [],
  minChapter: 1,
  bossOf: null          // null이면 일반적, 챕터번호면 해당 챕터 보스
}
```

### window.GAME_DATA.equipment
```js
{
  id: 'nomad_bow',
  name: '유목민의 활',
  type: 'weapon',       // 'weapon' | 'armor' | 'accessory'
  rarity: 'common',
  stats: { atk: 5 },
  icon: '🏹',
  description: '유목민이 사용하던 낡은 활'
}
```

### window.GAME_DATA.pets
```js
{
  id: 'ice_shroom',
  name: '얼음 버섯',
  icon: '🍄',
  rarity: 'common',
  description: '전투 시작 시 보호막 생성',
  effect: { type: 'shield', value: 0.1 }  // 최대HP의 10% 보호막
}
```

### window.GAME_DATA.text (UI 텍스트)
```js
{
  title: '카피바라 Go!',
  subtitle: '텍스트 로그라이크 RPG',
  newGame: '새 게임',
  continueGame: '이어하기',
  nextDay: '다음 날 →',
  inventory: '인벤토리',
  skillList: '스킬 목록',
  chapter: '챕터',
  day: '일차',
  level: 'Lv.',
  attack: '공격력',
  defense: '방어력',
  gold: '골드',
  hp: 'HP',
  exp: 'EXP',
  victory: '승리!',
  defeat: '패배...',
  selectSkill: '스킬을 선택하세요!',
  chapterClear: '챕터 클리어!',
  gameOver: '게임 오버',
  restart: '다시 시작',
  nextChapter: '다음 챕터 →',
  close: '닫기',
  battleStart: '전투 시작!',
  round: '라운드',
  rewards: '보상',
  expGained: '경험치 획득',
  goldGained: '골드 획득',
  levelUp: '레벨 업!',
  skillLearned: '스킬 습득!',
  // ... 추가 텍스트
}
```

---

## 메카닉스 API (mechanics.js가 window에 노출)

### window.GameMechanics
```js
{
  // 전투 실행 - 라운드별 로그 배열 반환
  runBattle(playerState, enemy): {
    rounds: [{ round: 1, logs: ['...'], playerHp: N, enemyHp: N }],
    result: 'victory' | 'defeat',
    rewards: { exp: N, gold: N, item: null|Object }
  },

  // 인카운터 선택 처리
  processEncounter(playerState, encounter, choiceIndex): {
    logs: ['...'],
    effects: { hpChange: N, maxHpChange: N, atkChange: N, ... }
  },

  // 랜덤 인카운터 가져오기
  getRandomEncounter(day, chapter): encounterObject,

  // 랜덤 적 가져오기
  getRandomEnemy(chapter): enemyObject (스탯이 챕터에 맞게 스케일링됨),

  // 스킬 선택지 생성
  generateSkillChoices(playerSkills, count=3): [skillObject, ...],

  // 스킬 적용 (전투 중)
  applySkillInBattle(skill, attacker, defender): { damage: N, logs: ['...'] },

  // 레벨업 체크
  checkLevelUp(playerState): { leveledUp: boolean, newLevel: N },

  // 장비 스탯 계산
  calculateEquipmentStats(equipment): { atk: N, def: N, hp: N },

  // 데이 이벤트 결정 (전투 vs 인카운터 vs 보물 등)
  determineDayEvent(day, chapter): {
    type: 'battle' | 'encounter' | 'rest' | 'shop' | 'boss',
    data: Object
  }
}
```

---

## 게임 엔진 API (game.js)

### window.Game (클래스)
```js
class Game {
  constructor()

  // 상태
  state: {
    player: {
      name: '카피바라',
      hp: 100, maxHp: 100,
      atk: 15, def: 5,
      level: 1, exp: 0, expToNext: 100,
      gold: 0,
      skills: [],
      equipment: { weapon: null, armor: null, accessory: null },
      pets: [],
      buffs: []
    },
    chapter: 1,
    day: 0,
    maxDays: 60,
    gameLog: [],
    phase: 'title' // 'title'|'playing'|'battle'|'event'|'skillSelect'|'gameover'
  }

  // 메서드
  init()                    // 게임 초기화, 이벤트 바인딩
  newGame()                 // 새 게임 시작
  loadGame()                // 저장된 게임 로드
  saveGame()                // 게임 저장 (localStorage)

  showScreen(screenId)      // 화면 전환

  nextDay()                 // 다음 날 진행
  startBattle(enemy)        // 전투 시작
  showBattleAnimation(battleResult) // 전투 애니메이션
  showEvent(encounter)      // 이벤트 표시
  handleEventChoice(index)  // 이벤트 선택 처리
  showSkillSelect(skills)   // 스킬 선택 화면
  handleSkillSelect(skillId) // 스킬 선택 처리

  updateUI()                // 모든 UI 업데이트
  addLog(message)           // 게임 로그 추가

  checkGameOver()           // 게임 오버 체크
  checkChapterClear()       // 챕터 클리어 체크
}
```

---

## 게임 플로우

1. 타이틀 → "새 게임" 클릭
2. 메인 화면 표시 (챕터 1, 1일차)
3. "다음 날 →" 클릭
4. determineDayEvent() 호출
   - battle → 전투 화면으로 전환, 자동 전투
   - encounter → 이벤트 화면으로 전환, 선택
   - rest → 자동 회복, 로그에 표시
   - shop → 상점 이벤트
   - boss (60일차) → 보스 전투
5. 전투 승리 → 경험치/골드 획득 → 레벨업 시 스킬 선택
6. 60일 완료 → 챕터 클리어 → 다음 챕터
7. HP 0 → 게임 오버

## 밸런스 기본값
- 전투 확률: 50%
- 인카운터 확률: 35%
- 휴식 확률: 10%
- 상점 확률: 5%
- 적 스케일링: 챕터 * 1.2 배율
- 레벨업 경험치: level * 100
- 보스 HP: 일반적의 5배
