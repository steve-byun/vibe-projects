# 에이전트 팀 아키텍처 템플릿

> **사용법**: 새 에이전트 팀 프로젝트 생성 시, 이 파일의 Part A를 그대로 복사하고
> Part B를 프로젝트에 맞게 채워서 `ARCHITECTURE.md`로 저장합니다.
> 버그를 수정할 때마다 Part A에 사례를 추가합니다.

---

# Part A: 공통 규칙 (모든 프로젝트 필수 포함)

> 이 섹션은 실제 프로젝트에서 발생한 버그를 기반으로 작성되었습니다.
> **모든 에이전트는 코드 작성 전에 이 섹션을 반드시 읽어야 합니다.**

---

## A1. CSS ↔ JS 연동 규칙

### show/hide는 반드시 CSS 클래스로
```javascript
// ✅ 올바른 방법
element.classList.add('active');     // 보이기
element.classList.remove('active');  // 숨기기

// ❌ 절대 하지 마세요
element.style.display = 'block';    // CSS 기본값과 충돌 가능
element.style.display = '';         // CSS의 display:none으로 돌아감
element.style.display = 'flex';     // CSS가 .active에서 flex를 정의했으면 충돌
```

### 동적 생성 요소는 CSS에 정의된 클래스 사용
```javascript
// ✅ CSS에 .log-entry 스타일이 정의되어 있으면
p.classList.add('log-entry');

// ❌ CSS와 무관한 클래스를 임의로 사용하지 마세요
p.classList.add('slide-up');        // CSS에 정의 안 되어 있으면 스타일 미적용
```

### 스크롤은 requestAnimationFrame 안에서
```javascript
// ✅ DOM 렌더링 후 스크롤
container.appendChild(newElement);
requestAnimationFrame(() => {
  container.scrollTop = container.scrollHeight;
});

// ❌ 추가 직후 바로 스크롤 (렌더링 전이라 안 먹힘)
container.appendChild(newElement);
container.scrollTop = container.scrollHeight;
```

---

## A2. 속성명 계약 규칙

### 반환 객체 속성명은 아키텍처 문서에 정의된 것만 사용
```javascript
// 아키텍처에서 "newSkill"로 정의했으면:

// ✅ 정의된 이름 사용
return { effects: { newSkill: skillObj } };

// ❌ 비슷하지만 다른 이름 사용 (버그 원인)
return { effects: { skill: skillObj } };      // "new" 빠짐
return { effects: { addSkill: skillObj } };   // 다른 동사
```

### 여러 에이전트가 같은 데이터를 주고받을 때
- 생산자(mechanics.js)가 만드는 속성명 = 소비자(game.js)가 읽는 속성명
- 아키텍처 문서에 **정확한 예시 코드**로 명시
- 양쪽 에이전트 모두에게 동일한 예시를 전달

---

## A3. 데이터 안전 규칙

### 배열은 undefined 대신 빈 배열 []
```javascript
// ✅
skills: [],
choices: [],
effects: []

// ❌ (for...of, .length, .forEach 등에서 크래시)
skills: undefined,
// skills 속성 자체를 생략
```

### null 가능한 속성은 명시적 null
```javascript
// ✅
bossOf: null,
item: null

// ❌ (속성 자체를 생략하면 === null 비교 시 false)
// bossOf 속성 없음
```

### switch문은 모든 케이스 처리
```javascript
// ✅ data.js가 사용하는 모든 type을 처리
switch (effect.type) {
  case 'healPercent': ...
  case 'goldGain': ...
  case 'nothing': ...
  // ... 아키텍처에 정의된 모든 타입
  default:
    console.warn(`처리되지 않은 이펙트: ${effect.type}`);
    break;
}

// ❌ 일부만 처리하고 나머지 무시
switch (effect.type) {
  case 'healPercent': ...
  case 'goldGain': ...
  // nothing, avoid, fullHeal 등 누락 → 선택지 클릭 시 아무 반응 없음
}
```

---

## A4. Side Effect 규칙

### 입력 객체를 수정하는 함수는 반드시 표기
```javascript
// 아키텍처에 명시:
// ⚠️ checkLevelUp은 playerState를 직접 수정합니다 (side effect)
// → 호출 후 별도로 스탯을 적용하면 이중 적용 버그 발생

// ✅ side effect 함수 호출 후 결과만 확인
const result = checkLevelUp(player);
if (result.leveledUp) {
  // 로그만 추가 (스탯은 이미 적용됨)
  addLog(`레벨 업! Lv.${player.level}`);
}

// ❌ side effect + 수동 적용 = 이중 적용
const result = checkLevelUp(player);
if (result.leveledUp) {
  player.maxHp += 10;  // 이미 checkLevelUp에서 했는데 또 함
  player.atk += 2;     // 이중 적용!
}
```

### 장비 스탯도 이중 적용 주의
```javascript
// player.atk에 이미 장비 보너스가 포함되어 있는데
// 전투에서 calculateEquipmentStats()로 다시 더하면 이중 적용
// → 아키텍처에서 "스탯에 장비 포함 여부" 명확히 정의할 것
```

---

## A5. 이벤트 타입별 분기 누락 방지

### 생산자가 만드는 모든 타입을 소비자가 처리
```javascript
// determineDayEvent()가 반환하는 모든 type:
// 'battle', 'boss', 'encounter', 'rest', 'shop'

// game.js의 switch문에서 모든 type 처리 필수:
switch (event.type) {
  case 'battle': ...
  case 'boss': ...
  case 'encounter': ...
  case 'rest': ...
  case 'shop': ...       // ← 빠뜨리면 상점 이벤트 무시됨
  default: ...           // ← fallback 필수
}
```

### data가 null일 수 있는 경우 처리
```javascript
// type='shop'일 때 data는 null → 호출 측에서 직접 생성 필요
// type='encounter'에서 getRandomEncounter가 null 반환 가능
// → showEvent(null) 호출 시 early return 필수

showEvent(encounter) {
  if (!encounter) return;  // null 체크 필수
  ...
}
```

---

## A6. 실전 버그 사례 DB

> 새 버그를 수정할 때마다 여기에 추가합니다.
> 포맷: **프로젝트명** | 증상 | 원인 | 해결

| # | 프로젝트 | 증상 | 원인 | 해결 |
|---|---------|------|------|------|
| 1 | 카피바라Go | 전투 후 "계속" 버튼 안 보임 → 게임 멈춤 | CSS: `#battle-result { display: none }` + `.active`로 표시. JS: `style.display = ''`로 인라인만 제거 → CSS 기본값 `none`으로 돌아감 | `classList.add/remove('active')` 사용 |
| 2 | 카피바라Go | 인벤토리 열리지 않음 | 모달도 같은 패턴: CSS `.active`, JS `style.display` | 동일하게 `classList` 방식으로 수정 |
| 3 | 카피바라Go | 게임 로그 스크롤 안 내려감 | JS가 `.slide-up` 클래스 사용, CSS는 `.log-entry` 정의. `scrollTop`을 DOM 렌더링 전에 설정 | `.log-entry` 클래스 + `requestAnimationFrame` |
| 4 | 카피바라Go | 이벤트 선택지 효과 없음 (일부 타입) | data.js가 `nothing`, `avoid`, `fullHeal` 등 이펙트 사용, mechanics.js switch에서 누락 | switch에 모든 이펙트 타입 케이스 추가 |
| 5 | 카피바라Go | 함정(trap) 이벤트에서 선택지 없이 빈 화면 | data.js에 `type: 'trap'` + `trapEffect` 구조, mechanics.js/game.js에서 trap 분기 없음 | trap 타입 전용 처리 로직 추가 |
| 6 | 카피바라Go | 이벤트 효과 속성 `effects.skill` 읽으면 undefined | mechanics.js는 `effects.newSkill`로 반환, game.js는 `effects.skill`로 읽음 | 속성명을 아키텍처 기준으로 통일 |
| 7 | 카피바라Go | 레벨업 시 스탯 이중 적용 | `checkLevelUp()`이 playerState 직접 수정(side effect) + game.js에서 한 번 더 적용 | game.js에서 수동 적용 제거 |
| 8 | 카피바라Go | 상점 이벤트에서 크래시 | `determineDayEvent`가 `{ type: 'shop', data: null }` 반환 → `showEvent(null)` 호출 | game.js에서 shop용 인라인 데이터 생성 |

---

## A7. 에이전트 팀 운영 규칙

### 아키텍처 문서 작성 원칙
1. **모든 인터페이스에 예시 코드 포함** — 텍스트 설명만으로는 속성명 불일치 방지 불가
2. **정확한 속성명 목록** — `newSkill` vs `skill` 같은 차이가 버그의 핵심 원인
3. **null/undefined 가능 여부 명시** — 각 속성이 null이 될 수 있는지 표기
4. **side effect 함수 경고** — 입력 객체를 수정하는 함수는 반드시 표기
5. **CSS 표시 방식 통일** — show/hide 패턴을 하나로 확정하고 전 에이전트에 전달

### 에이전트에게 프롬프트 줄 때
1. 아키텍처 문서 전문을 프롬프트에 포함 (링크/참조 X, 전문 복붙 O)
2. "이 문서에 정의된 속성명/클래스명을 정확히 사용하세요"를 명시적으로 지시
3. 다른 에이전트의 출력 포맷을 구체적 코드 예시로 전달
4. 완성 후 통합 테스트 시간 확보 (파일 수 x 10분 이상)

### 팀 vs 단독 판단 기준
| 상황 | 추천 |
|------|------|
| 파일 1~2개, 1000줄 이하 | 단독 AI |
| 파일 3개+, 인터페이스 단순 | 팀 가능 (아키텍처 간단히) |
| 파일 5개+, 인터페이스 복잡 | 팀 가능하나 통합 비용 큼 |
| 파일 간 의존성 높음 (서로 호출) | 단독 AI 추천 (일관성 중요) |
| 파일 간 독립적 (데이터 분리) | 팀 추천 (병렬 효과 큼) |

---

# Part B: 프로젝트별 템플릿 (프로젝트에 맞게 채우기)

> 아래 섹션들을 프로젝트에 맞게 수정하여 ARCHITECTURE.md로 사용합니다.

---

## B1. 파일 담당 및 의존 관계

| 에이전트 | 담당 파일 | 의존하는 파일 | 역할 |
|---------|----------|-------------|------|
| (이름) | `파일명` | (의존 파일) | (역할 설명) |

**스크립트 로드 순서**: `a.js` → `b.js` → `c.js`

---

## B2. DOM 요소 ID 목록 (HTML ↔ JS 계약)

> HTML이 정의하고, JS가 사용하는 모든 ID를 나열합니다.

### 화면 (section)
| ID | 용도 |
|----|------|
| `screen-xxx` | 설명 |

### 버튼
| ID | 클릭 시 동작 |
|----|-------------|
| `btn-xxx` | `함수명()` |

### 동적 텍스트
| ID | 표시 내용 | 예시 값 |
|----|----------|--------|
| `display-xxx` | 설명 | `"예시"` |

---

## B3. CSS 클래스 규칙 (CSS ↔ JS 계약)

### `.active`로 표시/숨김하는 요소 목록
| 요소 | CSS 기본 | `.active` 시 |
|------|---------|------------|
| `#요소id` | `display: none` | `display: block` |
| `#모달` | `display: none` | `display: flex` |

### 동적 생성 요소의 클래스
| 생성 위치 | 요소 | CSS 클래스 |
|----------|------|-----------|
| game.js `addLog()` | `<p>` | `.log-entry` |
| game.js `_updateInventoryUI()` | `<div>` | `.equipment-slot` |

---

## B4. 데이터 구조 (전역 변수 규격)

> `window.변수명`으로 노출. 각 객체의 모든 속성을 예시 코드로 정의합니다.

```javascript
// 예시: 객체 타입 A
{
  id: 'unique_id',    // string (필수, 고유)
  name: '이름',        // string (필수)
  list: [],           // Array (필수, 빈 배열 가능, undefined 불가)
  optional: null      // Type | null
}
```

---

## B5. 함수 시그니처 (모듈 간 계약)

> 반환값의 **정확한 속성명**을 코드 예시로 정의합니다.

### `함수명(param1, param2) → 반환타입`
```javascript
// 입력
param1: { 속성: 타입 }

// 반환 (속성명 정확히 이대로 사용)
{
  result: 'value',     // string
  data: {
    propName: value    // ← 이 이름을 소비자도 동일하게 사용
  }
}
// ⚠️ side effect: param1.xxx를 직접 수정합니다
```

---

## B6. 열거형 / 타입 값 전체 목록

> 생산자(data)가 사용하는 모든 type 값을 나열합니다.
> 소비자(logic)는 이 목록의 **모든 값**을 switch/if에서 처리해야 합니다.

| type 값 | 파라미터 | 설명 |
|---------|---------|------|
| `typeA` | `value: number` | 설명 |
| `typeB` | - | 설명 |

---

## B7. 프로젝트별 체크리스트

### 전 에이전트 공통
- [ ] Part A의 공통 규칙을 모두 읽었는가?
- [ ] 배열 속성에 `undefined` 대신 `[]` 사용했는가?
- [ ] 아키텍처에 정의된 속성명을 정확히 사용했는가?

### CSS 에이전트
- [ ] `.active` 토글 요소 목록 → B3에 정의했는가?
- [ ] 동적 생성 요소 클래스명 → B3에 정의했는가?
- [ ] `display: none` 기본 요소에 `.active` 스타일 정의했는가?

### UI/엔진 JS 에이전트
- [ ] show/hide에 `classList.add/remove('active')` 사용했는가?
- [ ] `style.display` 직접 설정하지 않았는가?
- [ ] 동적 요소에 CSS 정의된 클래스를 사용했는가?
- [ ] `scrollTop`을 `requestAnimationFrame` 안에서 설정했는가?
- [ ] B6의 모든 타입 값을 switch에서 처리했는가?

### 로직 JS 에이전트
- [ ] 반환 객체 속성명이 B5와 정확히 일치하는가?
- [ ] side effect 함수에 주석으로 표기했는가?
- [ ] B6의 모든 이펙트 타입을 처리했는가?
- [ ] null 반환 가능한 함수를 아키텍처에 명시했는가?

### 데이터 에이전트
- [ ] 배열 속성은 `[]`로 초기화했는가? (undefined 아님)
- [ ] 사용하는 모든 type 값을 B6에 나열했는가?
- [ ] 각 객체의 모든 필수 속성이 예시에 포함되어 있는가?
