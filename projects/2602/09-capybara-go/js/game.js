/**
 * 카피바라 Go! - Game Engine
 */
class Game {
  constructor() {
    this.state = {
      player: {
        name: '카피바라',
        hp: 100,
        maxHp: 100,
        atk: 15,
        def: 5,
        level: 1,
        exp: 0,
        expToNext: 100,
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
      phase: 'title'
    };
    this.currentEncounter = null;
    this.battleAnimationTimers = [];
    this.isBattleAnimating = false;
  }

  // ─── 초기화 ───

  init() {
    this._bindButton('#btn-start', () => this.newGame());
    this._bindButton('#btn-continue', () => this.loadGame());
    this._bindButton('#btn-next-day', () => this.nextDay());
    this._bindButton('#btn-inventory', () => this.toggleInventory());
    this._bindButton('#btn-skills', () => this.toggleSkills());
    this._bindButton('#btn-battle-continue', () => this.onBattleContinue());
    this._bindButton('#btn-next-chapter', () => this.nextChapter());
    this._bindButton('#btn-restart', () => this.newGame());
    this._bindButton('#btn-close-inventory', () => this.closeInventory());

    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.closeInventory());
    }

    // 저장 데이터 확인하여 이어하기 버튼 표시/숨김
    const btnContinue = document.getElementById('btn-continue');
    if (btnContinue) {
      const saveData = localStorage.getItem('capybara_go_save');
      btnContinue.style.display = saveData ? '' : 'none';
    }
  }

  _bindButton(selector, handler) {
    const el = document.querySelector(selector);
    if (el) {
      el.addEventListener('click', handler);
    } else {
      console.warn(`[Game] 버튼을 찾을 수 없음: ${selector}`);
    }
  }

  // ─── 화면 전환 ───

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) {
      screen.classList.add('active');
    } else {
      console.warn(`[Game] 화면을 찾을 수 없음: ${screenId}`);
    }

    // phase 업데이트
    const phaseMap = {
      'screen-title': 'title',
      'screen-game': 'playing',
      'screen-battle': 'battle',
      'screen-event': 'event',
      'screen-skill-select': 'skillSelect',
      'screen-chapter-clear': 'chapterClear',
      'screen-gameover': 'gameover'
    };
    this.state.phase = phaseMap[screenId] || this.state.phase;
  }

  // ─── 새 게임 ───

  newGame() {
    // state 초기화
    this.state = {
      player: {
        name: '카피바라',
        hp: 100,
        maxHp: 100,
        atk: 15,
        def: 5,
        level: 1,
        exp: 0,
        expToNext: 100,
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
      phase: 'title'
    };

    // 첫 장비 지급
    this._equipStartingGear();

    // 게임 로그 초기화
    const logEl = document.getElementById('game-log');
    if (logEl) logEl.innerHTML = '';

    this.showScreen('screen-game');
    this.updateUI();
    this.addLog('새로운 모험이 시작됩니다!');
    this.saveGame();
  }

  _equipStartingGear() {
    const data = window.GAME_DATA;
    if (!data || !data.equipment) return;

    const bow = data.equipment.find(e => e.id === 'nomad_bow');
    const armor = data.equipment.find(e => e.id === 'leather_armor');

    if (bow) {
      this.state.player.equipment.weapon = bow;
      if (bow.stats) {
        if (bow.stats.atk) this.state.player.atk += bow.stats.atk;
        if (bow.stats.def) this.state.player.def += bow.stats.def;
      }
    }
    if (armor) {
      this.state.player.equipment.armor = armor;
      if (armor.stats) {
        if (armor.stats.atk) this.state.player.atk += armor.stats.atk;
        if (armor.stats.def) this.state.player.def += armor.stats.def;
      }
    }
  }

  // ─── 저장/로드 ───

  saveGame() {
    try {
      localStorage.setItem('capybara_go_save', JSON.stringify(this.state));
    } catch (e) {
      console.warn('[Game] 저장 실패:', e);
    }
  }

  loadGame() {
    try {
      const raw = localStorage.getItem('capybara_go_save');
      if (!raw) return;
      const loaded = JSON.parse(raw);
      this.state = loaded;

      // 게임 로그 복원
      const logEl = document.getElementById('game-log');
      if (logEl) {
        logEl.innerHTML = '';
        this.state.gameLog.forEach(msg => {
          const p = document.createElement('p');
          p.textContent = msg;
          p.classList.add('log-entry');
          logEl.appendChild(p);
        });
        requestAnimationFrame(() => {
          logEl.scrollTop = logEl.scrollHeight;
        });
      }

      this.showScreen('screen-game');
      this.updateUI();
      this.addLog('저장된 모험을 이어갑니다.');
    } catch (e) {
      console.warn('[Game] 로드 실패:', e);
    }
  }

  // ─── 다음 날 ───

  nextDay() {
    if (this.isBattleAnimating) return;

    const p = this.state.player;
    this.state.day++;
    this.addLog(`--- ${this.state.day}일차 ---`);

    const event = window.GameMechanics
      ? window.GameMechanics.determineDayEvent(this.state.day, this.state.chapter)
      : { type: 'rest', data: {} };

    switch (event.type) {
      case 'battle':
        this.startBattle(event.data);
        break;
      case 'boss':
        this.startBattle(event.data);
        break;
      case 'encounter':
        this.showEvent(event.data);
        break;
      case 'rest':
        this._handleRest();
        break;
      case 'shop': {
        // 상점: 랜덤 장비 구매 기회
        const shopEncounter = {
          id: 'shop_event', name: '떠돌이 상인', icon: '🛒',
          description: '떠돌이 상인이 신비로운 물건을 보여준다.',
          type: 'choice',
          choices: [
            { text: '물건 구매 (골드 50)', description: '랜덤 장비를 획득한다', effects: [{ type: 'goldLoss', value: 50 }, { type: 'randomEquipment' }] },
            { text: '구경만 하기', description: '아무 일도 일어나지 않는다', effects: [] }
          ]
        };
        this.showEvent(shopEncounter);
        break;
      }
      default:
        this._handleRest();
        break;
    }

    this.updateUI();
    this.saveGame();
  }

  _handleRest() {
    const p = this.state.player;
    const healAmount = Math.floor(p.maxHp * 0.2);
    p.hp = Math.min(p.hp + healAmount, p.maxHp);
    this.addLog(`평화로운 하루를 보냈다. HP가 ${healAmount} 회복되었다.`);
  }

  // ─── 전투 ───

  startBattle(enemy) {
    if (!enemy) return;

    this.showScreen('screen-battle');
    this.isBattleAnimating = true;

    // 적 정보 표시
    this._setTextContent('#enemy-name', enemy.name || '???');
    this._setTextContent('#enemy-icon', enemy.icon || '?');

    // 적 HP 바 초기화
    const enemyHpFill = document.getElementById('enemy-hp-fill');
    const enemyHpText = document.getElementById('enemy-hp-text');
    const enemyMaxHp = enemy.baseHp || enemy.hp || 50;
    if (enemyHpFill) enemyHpFill.style.width = '100%';
    if (enemyHpText) enemyHpText.textContent = `${enemyMaxHp} / ${enemyMaxHp}`;

    // 플레이어 HP 바
    this._updateBattlePlayerHp();

    // 전투 로그 초기화
    const battleLog = document.getElementById('battle-log');
    if (battleLog) battleLog.innerHTML = '';

    // 전투 결과 숨김
    const resultEl = document.getElementById('battle-result');
    if (resultEl) resultEl.classList.remove('active');

    // 전투 실행
    const battleResult = window.GameMechanics
      ? window.GameMechanics.runBattle(this.state.player, enemy)
      : this._fallbackBattle(enemy);

    this._showBattleAnimation(battleResult, enemy);
  }

  _fallbackBattle(enemy) {
    // GameMechanics가 없을 경우 간단한 전투
    const p = this.state.player;
    const enemyHp = enemy.baseHp || 50;
    return {
      rounds: [{ round: 1, logs: ['전투가 진행된다...'], playerHp: p.hp, enemyHp: 0 }],
      result: 'victory',
      rewards: { exp: enemy.exp || 20, gold: enemy.gold || 5, item: null }
    };
  }

  _showBattleAnimation(battleResult, enemy) {
    // 이전 타이머 정리
    this.battleAnimationTimers.forEach(t => clearTimeout(t));
    this.battleAnimationTimers = [];

    const battleLog = document.getElementById('battle-log');
    const rounds = battleResult.rounds || [];
    const enemyMaxHp = enemy.baseHp || enemy.hp || 50;
    let delay = 0;

    this._addBattleLog('전투 시작!', 0);
    delay += 500;

    rounds.forEach((round) => {
      const roundDelay = delay;

      // 라운드 번호
      this._addBattleLog(`── 라운드 ${round.round} ──`, roundDelay);
      delay += 300;

      // 라운드 로그
      if (round.logs && Array.isArray(round.logs)) {
        round.logs.forEach((log) => {
          this._addBattleLog(log, delay);
          delay += 400;
        });
      }

      // HP 바 업데이트
      const hpDelay = delay;
      const tid = setTimeout(() => {
        // 적 HP 바
        const enemyHpFill = document.getElementById('enemy-hp-fill');
        const enemyHpText = document.getElementById('enemy-hp-text');
        const eHp = Math.max(0, round.enemyHp || 0);
        const ePercent = Math.max(0, (eHp / enemyMaxHp) * 100);
        if (enemyHpFill) enemyHpFill.style.width = `${ePercent}%`;
        if (enemyHpText) enemyHpText.textContent = `${eHp} / ${enemyMaxHp}`;

        // 플레이어 HP 바
        if (round.playerHp !== undefined) {
          this.state.player.hp = Math.max(0, round.playerHp);
        }
        this._updateBattlePlayerHp();

        // 피격 흔들림 효과
        this._shakeElement('#battle-enemy');
      }, hpDelay);
      this.battleAnimationTimers.push(tid);
      delay += 500;
    });

    // 전투 종료
    const endDelay = delay;
    const endTimer = setTimeout(() => {
      this.isBattleAnimating = false;
      this._showBattleResult(battleResult);
    }, endDelay);
    this.battleAnimationTimers.push(endTimer);
  }

  _addBattleLog(text, delay) {
    const tid = setTimeout(() => {
      const battleLog = document.getElementById('battle-log');
      if (!battleLog) return;
      const p = document.createElement('p');
      p.textContent = text;
      p.classList.add('log-entry');
      battleLog.appendChild(p);
      requestAnimationFrame(() => {
        battleLog.scrollTop = battleLog.scrollHeight;
      });
    }, delay);
    this.battleAnimationTimers.push(tid);
  }

  _showBattleResult(battleResult) {
    const resultEl = document.getElementById('battle-result');
    const resultText = document.getElementById('battle-result-text');
    const rewardsEl = document.getElementById('battle-rewards');

    if (resultEl) resultEl.classList.add('active');

    if (battleResult.result === 'victory') {
      if (resultText) resultText.textContent = '승리!';

      const rewards = battleResult.rewards || {};
      if (rewardsEl) {
        rewardsEl.innerHTML = '';
        if (rewards.exp) {
          const p = document.createElement('p');
          p.textContent = `경험치 +${rewards.exp}`;
          rewardsEl.appendChild(p);
        }
        if (rewards.gold) {
          const p = document.createElement('p');
          p.textContent = `골드 +${rewards.gold}`;
          rewardsEl.appendChild(p);
        }
        if (rewards.item) {
          const p = document.createElement('p');
          p.textContent = `아이템 획득: ${rewards.item.icon || ''} ${rewards.item.name || ''}`;
          rewardsEl.appendChild(p);
        }
      }

      // 보상 적용
      this.state.player.exp += rewards.exp || 0;
      this.state.player.gold += rewards.gold || 0;

      this.addLog(`전투 승리! 경험치 +${rewards.exp || 0}, 골드 +${rewards.gold || 0}`);
    } else {
      // 패배
      if (resultText) resultText.textContent = '패배...';
      if (rewardsEl) rewardsEl.innerHTML = '';
      this.addLog('전투에서 패배했다...');
    }
  }

  onBattleContinue() {
    if (this.isBattleAnimating) return;

    const p = this.state.player;

    if (p.hp <= 0) {
      this.checkGameOver();
      return;
    }

    // 레벨업 체크
    const levelResult = window.GameMechanics
      ? window.GameMechanics.checkLevelUp(p)
      : this._fallbackLevelUp();

    if (levelResult && levelResult.leveledUp) {
      // mechanics.checkLevelUp가 이미 스탯을 적용했으므로 중복 적용하지 않음
      this.addLog(`레벨 업! Lv.${p.level} 도달! (HP+10, ATK+2, DEF+1)`);

      // 스킬 선택
      const choices = window.GameMechanics
        ? window.GameMechanics.generateSkillChoices(p.skills, 3)
        : [];

      if (choices && choices.length > 0) {
        this.showSkillSelect(choices);
        return;
      }
    }

    // 챕터 클리어 체크
    if (this.state.day >= this.state.maxDays) {
      this.checkChapterClear();
      return;
    }

    this.showScreen('screen-game');
    this.updateUI();
    this.saveGame();
  }

  _fallbackLevelUp() {
    const p = this.state.player;
    if (p.exp >= p.expToNext) {
      return { leveledUp: true, newLevel: p.level + 1 };
    }
    return { leveledUp: false, newLevel: p.level };
  }

  _updateBattlePlayerHp() {
    const p = this.state.player;
    const fill = document.querySelector('#battle-player-hp-bar .hp-fill') ||
                 document.getElementById('battle-player-hp-fill');
    const text = document.querySelector('#battle-player-hp-bar .hp-text') ||
                 document.getElementById('battle-player-hp-text');
    const percent = Math.max(0, (p.hp / p.maxHp) * 100);
    if (fill) {
      fill.style.width = `${percent}%`;
      fill.style.backgroundColor = this._hpColor(percent);
    }
    if (text) text.textContent = `${p.hp} / ${p.maxHp}`;
  }

  _shakeElement(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 400);
  }

  // ─── 이벤트/인카운터 ───

  showEvent(encounter) {
    if (!encounter) return;
    this.currentEncounter = encounter;

    this.showScreen('screen-event');

    this._setTextContent('#event-icon', encounter.icon || '?');
    this._setTextContent('#event-title', encounter.name || '이벤트');
    this._setTextContent('#event-description', encounter.description || '');

    const choicesEl = document.getElementById('event-choices');
    if (choicesEl) {
      choicesEl.innerHTML = '';

      // trap 타입: 선택지 없이 확인 버튼만
      if (encounter.type === 'trap') {
        if (encounter.trapEffect) {
          const descP = document.getElementById('event-description');
          if (descP) descP.textContent = encounter.trapEffect.description || encounter.description;
        }
        const btn = document.createElement('button');
        btn.className = 'btn btn-danger';
        btn.textContent = '확인';
        btn.addEventListener('click', () => this.handleEventChoice(0));
        choicesEl.appendChild(btn);
      } else if (encounter.choices) {
        encounter.choices.forEach((choice, index) => {
          const btn = document.createElement('button');
          btn.className = 'btn btn-secondary';
          btn.innerHTML = `<span class="choice-title">${choice.text || '선택 ' + (index + 1)}</span>${choice.description ? '<span class="choice-desc">' + choice.description + '</span>' : ''}`;
          btn.addEventListener('click', () => this.handleEventChoice(index));
          choicesEl.appendChild(btn);
        });
      }
    }
  }

  handleEventChoice(index) {
    const encounter = this.currentEncounter;
    if (!encounter) return;

    const result = window.GameMechanics
      ? window.GameMechanics.processEncounter(this.state.player, encounter, index)
      : { logs: ['선택을 완료했다.'], effects: {} };

    // 효과 적용
    const effects = result.effects || {};
    const p = this.state.player;

    if (effects.hpChange) {
      p.hp = Math.min(p.hp + effects.hpChange, p.maxHp);
      p.hp = Math.max(0, p.hp);
    }
    if (effects.maxHpChange) {
      p.maxHp += effects.maxHpChange;
      p.hp = Math.min(p.hp, p.maxHp);
    }
    if (effects.atkChange) p.atk += effects.atkChange;
    if (effects.defChange) p.def += effects.defChange;
    if (effects.goldChange) p.gold += effects.goldChange;
    if (effects.expChange) p.exp += effects.expChange;
    if (effects.newSkill) p.skills.push(effects.newSkill);
    if (effects.newEquipment) {
      const eq = effects.newEquipment;
      if (eq.type && p.equipment[eq.type] !== undefined) {
        const old = p.equipment[eq.type];
        if (old && old.stats) {
          if (old.stats.atk) p.atk -= old.stats.atk;
          if (old.stats.def) p.def -= old.stats.def;
        }
        p.equipment[eq.type] = eq;
        if (eq.stats) {
          if (eq.stats.atk) p.atk += eq.stats.atk;
          if (eq.stats.def) p.def += eq.stats.def;
        }
      }
    }
    if (effects.newPet) p.pets.push(effects.newPet);

    // 로그 추가
    if (result.logs && Array.isArray(result.logs)) {
      result.logs.forEach(log => this.addLog(log));
    }

    this.currentEncounter = null;

    // HP 체크
    if (p.hp <= 0) {
      this.checkGameOver();
      return;
    }

    this.showScreen('screen-game');
    this.updateUI();
    this.saveGame();
  }

  // ─── 스킬 선택 ───

  showSkillSelect(skills) {
    if (!skills || skills.length === 0) {
      this.showScreen('screen-game');
      return;
    }

    this.showScreen('screen-skill-select');

    const container = document.getElementById('skill-cards');
    if (!container) return;

    container.innerHTML = '';

    skills.forEach(skill => {
      const card = document.createElement('div');
      card.className = `skill-card rarity-${skill.rarity || 'common'}`;
      card.dataset.skillId = skill.id;

      card.innerHTML = `
        <div class="skill-card-icon">${skill.icon || '?'}</div>
        <div class="skill-card-name">${skill.name || '???'}</div>
        <div class="skill-card-rarity">${this._rarityLabel(skill.rarity)}</div>
        <div class="skill-card-desc">${skill.description || ''}</div>
        <div class="skill-card-type">${this._typeLabel(skill.type)}</div>
      `;

      card.addEventListener('click', () => this.handleSkillSelect(skill.id));
      container.appendChild(card);
    });
  }

  _rarityLabel(rarity) {
    const map = { common: '일반', legendary: '전설', mythic: '신화' };
    return map[rarity] || '일반';
  }

  _typeLabel(type) {
    const map = { attack: '공격', defense: '방어', buff: '버프', heal: '회복' };
    return map[type] || '기타';
  }

  handleSkillSelect(skillId) {
    const data = window.GAME_DATA;
    if (!data || !data.skills) return;

    const skill = data.skills.find(s => s.id === skillId);
    if (!skill) return;

    this.state.player.skills.push(skill);
    this.addLog(`새로운 스킬 습득: ${skill.icon || ''} ${skill.name}`);

    // 챕터 클리어 체크
    if (this.state.day >= this.state.maxDays) {
      this.checkChapterClear();
      return;
    }

    this.showScreen('screen-game');
    this.updateUI();
    this.saveGame();
  }

  // ─── UI 업데이트 ───

  updateUI() {
    const p = this.state.player;

    // 챕터/일차
    this._setTextContent('#display-chapter', `${this.state.chapter}`);
    this._setTextContent('#display-day', `${this.state.day} / ${this.state.maxDays}`);

    // HP 바
    const hpPercent = p.maxHp > 0 ? Math.max(0, (p.hp / p.maxHp) * 100) : 0;
    const hpFill = document.getElementById('stat-hp-fill');
    const hpText = document.getElementById('stat-hp-text');
    if (hpFill) {
      hpFill.style.width = `${hpPercent}%`;
      hpFill.style.backgroundColor = this._hpColor(hpPercent);
    }
    if (hpText) hpText.textContent = `${p.hp} / ${p.maxHp}`;

    // EXP 바
    const expPercent = p.expToNext > 0 ? Math.max(0, (p.exp / p.expToNext) * 100) : 0;
    const expFill = document.getElementById('stat-exp-fill');
    const expText = document.getElementById('stat-exp-text');
    if (expFill) expFill.style.width = `${expPercent}%`;
    if (expText) expText.textContent = `${p.exp} / ${p.expToNext}`;

    // 스탯 (stat-item 구조: .stat-value 자식 업데이트)
    const setStatValue = (id, val) => {
      const el = document.getElementById(id);
      if (el) {
        const valEl = el.querySelector('.stat-value');
        if (valEl) valEl.textContent = val;
        else el.textContent = val;
      }
    };
    setStatValue('stat-level', p.level);
    setStatValue('stat-atk', p.atk);
    setStatValue('stat-def', p.def);
    setStatValue('stat-gold', p.gold);
  }

  _hpColor(percent) {
    if (percent > 60) return '#4ecca3';
    if (percent > 30) return '#f0a500';
    return '#e94560';
  }

  // ─── 게임 로그 ───

  addLog(message) {
    this.state.gameLog.push(message);

    const logEl = document.getElementById('game-log');
    if (!logEl) return;

    const p = document.createElement('p');
    p.textContent = message;
    p.classList.add('log-entry');
    logEl.appendChild(p);
    requestAnimationFrame(() => {
      logEl.scrollTop = logEl.scrollHeight;
    });
  }

  // ─── 인벤토리 ───

  toggleInventory() {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('modal-inventory');
    if (!overlay || !modal) return;

    const isVisible = overlay.classList.contains('active');
    if (isVisible) {
      this.closeInventory();
    } else {
      overlay.classList.add('active');
      modal.classList.add('active');
      this._updateInventoryUI();
    }
  }

  toggleSkills() {
    // 스킬 탭을 인벤토리 모달 안에서 보여줌
    this.toggleInventory();
  }

  closeInventory() {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('modal-inventory');
    if (overlay) overlay.classList.remove('active');
    if (modal) modal.classList.remove('active');
  }

  _updateInventoryUI() {
    const p = this.state.player;

    // 장비 슬롯
    const eqEl = document.getElementById('inventory-equipment');
    if (eqEl) {
      eqEl.innerHTML = '';
      const slots = [
        { key: 'weapon', label: '무기' },
        { key: 'armor', label: '방어구' },
        { key: 'accessory', label: '악세서리' }
      ];
      slots.forEach(slot => {
        const item = p.equipment[slot.key];
        const div = document.createElement('div');
        div.className = 'equipment-slot';
        if (item) {
          div.innerHTML = `<span class="eq-icon">${item.icon || '?'}</span> <span class="eq-name">${item.name}</span>`;
        } else {
          div.innerHTML = `<span class="eq-label">${slot.label}</span> <span class="eq-empty">비어 있음</span>`;
        }
        eqEl.appendChild(div);
      });
    }

    // 보유 스킬
    const skillsEl = document.getElementById('inventory-skills');
    if (skillsEl) {
      skillsEl.innerHTML = '';
      if (p.skills.length === 0) {
        skillsEl.innerHTML = '<p>보유 스킬 없음</p>';
      } else {
        p.skills.forEach(skill => {
          const div = document.createElement('div');
          div.className = `skill-item rarity-${skill.rarity || 'common'}`;
          div.innerHTML = `<span>${skill.icon || '?'}</span> <span>${skill.name}</span>`;
          skillsEl.appendChild(div);
        });
      }
    }

    // 펫 목록
    const petsEl = document.getElementById('inventory-pets');
    if (petsEl) {
      petsEl.innerHTML = '';
      if (p.pets.length === 0) {
        petsEl.innerHTML = '<p>동행 펫 없음</p>';
      } else {
        p.pets.forEach(pet => {
          const div = document.createElement('div');
          div.className = `pet-item rarity-${pet.rarity || 'common'}`;
          div.innerHTML = `<span>${pet.icon || '?'}</span> <span>${pet.name}</span>`;
          petsEl.appendChild(div);
        });
      }
    }
  }

  // ─── 게임 오버 ───

  checkGameOver() {
    if (this.state.player.hp > 0) return false;

    this.showScreen('screen-gameover');
    const p = this.state.player;

    const statsEl = document.getElementById('gameover-stats');
    if (statsEl) {
      statsEl.innerHTML = `
        <p>챕터: ${this.state.chapter}</p>
        <p>도달 일차: ${this.state.day} / ${this.state.maxDays}</p>
        <p>레벨: ${p.level}</p>
        <p>공격력: ${p.atk} | 방어력: ${p.def}</p>
        <p>획득 골드: ${p.gold}</p>
        <p>습득 스킬: ${p.skills.length}개</p>
      `;
    }

    // 저장 데이터 삭제
    localStorage.removeItem('capybara_go_save');
    return true;
  }

  // ─── 챕터 클리어 ───

  checkChapterClear() {
    this.showScreen('screen-chapter-clear');

    const clearTitle = document.getElementById('clear-title');
    if (clearTitle) clearTitle.textContent = `챕터 ${this.state.chapter} 클리어!`;

    const rewardsEl = document.getElementById('clear-rewards');
    if (rewardsEl) {
      const bonusHp = 20;
      const bonusAtk = 5;
      const bonusDef = 3;
      const bonusGold = 50;
      rewardsEl.innerHTML = `
        <p>최대 HP +${bonusHp}</p>
        <p>공격력 +${bonusAtk}</p>
        <p>방어력 +${bonusDef}</p>
        <p>골드 +${bonusGold}</p>
      `;

      // 보상 적용
      const p = this.state.player;
      p.maxHp += bonusHp;
      p.hp = p.maxHp;
      p.atk += bonusAtk;
      p.def += bonusDef;
      p.gold += bonusGold;
    }

    this.addLog(`챕터 ${this.state.chapter} 클리어!`);
    this.saveGame();
  }

  nextChapter() {
    this.state.chapter++;
    this.state.day = 0;
    this.addLog(`챕터 ${this.state.chapter} 시작!`);
    this.showScreen('screen-game');
    this.updateUI();
    this.saveGame();
  }

  // ─── 유틸리티 ───

  _setTextContent(selector, text) {
    const el = document.querySelector(selector);
    if (el) {
      el.textContent = text;
    }
  }
}

// ─── 페이지 로드 시 자동 시작 ───
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
  window.game.init();
});
