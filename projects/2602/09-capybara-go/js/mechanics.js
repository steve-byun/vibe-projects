/**
 * 카피바라 Go! - 게임 메카닉스
 * window.GAME_DATA가 먼저 로드되어 있어야 합니다.
 */

window.GameMechanics = (function () {
  const DATA = window.GAME_DATA;

  // ── 유틸리티 ──────────────────────────────────────────

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function weightedPick(items, weightFn) {
    const total = items.reduce((s, i) => s + weightFn(i), 0);
    let r = Math.random() * total;
    for (const item of items) {
      r -= weightFn(item);
      if (r <= 0) return item;
    }
    return items[items.length - 1];
  }

  // ── 7. applySkillInBattle ─────────────────────────────

  function applySkillInBattle(skill, attacker, defender) {
    const result = { damage: 0, heal: 0, statusEffect: null, logs: [] };

    for (const effect of skill.effects) {
      switch (effect.type) {
        case 'damage': {
          const raw = Math.floor(attacker.atk * effect.value);
          const dmg = Math.max(1, raw - defender.def);
          result.damage += dmg;
          result.logs.push(`[${skill.name}] ${dmg} 데미지!`);
          break;
        }
        case 'trueDamage': {
          const dmg = Math.floor(attacker.atk * effect.value);
          result.damage += dmg;
          result.logs.push(`[${skill.name}] ${dmg} 고정 데미지!`);
          break;
        }
        case 'heal': {
          const amount = Math.floor(attacker.maxHp * effect.value);
          result.heal += amount;
          result.logs.push(`[${skill.name}] HP ${amount} 회복!`);
          break;
        }
        case 'lifesteal': {
          const raw = Math.floor(attacker.atk * effect.value);
          const dmg = Math.max(1, raw - defender.def);
          result.damage += dmg;
          const stolen = Math.floor(dmg * 0.5);
          result.heal += stolen;
          result.logs.push(`[${skill.name}] ${dmg} 데미지! HP ${stolen} 흡수!`);
          break;
        }
        case 'shield': {
          const amount = Math.floor(attacker.maxHp * effect.value);
          result.heal += amount;
          result.logs.push(`[${skill.name}] 보호막 ${amount} 생성!`);
          break;
        }
        case 'buff': {
          result.statusEffect = 'buff';
          result.logs.push(`[${skill.name}] 버프 효과 발동!`);
          break;
        }
        case 'debuff': {
          result.statusEffect = 'debuff';
          result.logs.push(`[${skill.name}] 디버프 효과 발동!`);
          break;
        }
        case 'dot': {
          const dmg = Math.floor(attacker.atk * effect.value);
          result.damage += dmg;
          result.statusEffect = 'dot';
          result.logs.push(`[${skill.name}] 지속 피해 ${dmg}!`);
          break;
        }
        default:
          break;
      }
    }

    return result;
  }

  // ── 1. runBattle ──────────────────────────────────────

  function runBattle(playerState, enemy) {
    const MAX_ROUNDS = 20;
    let pHp = playerState.hp;
    const pMaxHp = playerState.maxHp;
    let pAtk = playerState.atk;
    let pDef = playerState.def;

    // 장비 스탯 적용
    if (playerState.equipment) {
      const eqStats = calculateEquipmentStats(playerState.equipment);
      pAtk += eqStats.atk;
      pDef += eqStats.def;
      pHp = Math.min(pHp + eqStats.hp, pMaxHp + eqStats.hp);
    }

    let eHp = enemy.baseHp;
    const eAtk = enemy.baseAtk;
    const eDef = enemy.baseDef;

    // 펫 효과 (전투 시작 시)
    const startLogs = [];
    if (playerState.pets && playerState.pets.length > 0) {
      for (const pet of playerState.pets) {
        if (pet.effect) {
          switch (pet.effect.type) {
            case 'shield': {
              const shield = Math.floor(pMaxHp * pet.effect.value);
              pHp += shield;
              startLogs.push(`[${pet.name}] 보호막 ${shield} 생성!`);
              break;
            }
            case 'atkBoost': {
              const boost = Math.floor(pAtk * pet.effect.value);
              pAtk += boost;
              startLogs.push(`[${pet.name}] 공격력 ${boost} 증가!`);
              break;
            }
            case 'defBoost': {
              const boost = Math.floor(pDef * pet.effect.value);
              pDef += boost;
              startLogs.push(`[${pet.name}] 방어력 ${boost} 증가!`);
              break;
            }
            case 'healStart': {
              const amount = Math.floor(pMaxHp * pet.effect.value);
              pHp = Math.min(pHp + amount, pMaxHp);
              startLogs.push(`[${pet.name}] HP ${amount} 회복!`);
              break;
            }
            default:
              break;
          }
        }
      }
    }

    // 버프 적용
    if (playerState.buffs && playerState.buffs.length > 0) {
      for (const buff of playerState.buffs) {
        if (buff.type === 'atkUp') {
          pAtk += buff.value;
          startLogs.push(`버프: 공격력 +${buff.value}`);
        } else if (buff.type === 'defUp') {
          pDef += buff.value;
          startLogs.push(`버프: 방어력 +${buff.value}`);
        }
      }
    }

    const rounds = [];
    let result = 'defeat';

    for (let r = 1; r <= MAX_ROUNDS; r++) {
      const logs = [];

      if (r === 1 && startLogs.length > 0) {
        logs.push(...startLogs);
      }

      // ── 플레이어 턴 ──
      let pDmg = Math.max(1, pAtk - eDef);
      let isCrit = Math.random() < 0.1;
      if (isCrit) pDmg = Math.floor(pDmg * 1.5);

      eHp -= pDmg;
      logs.push(
        `카피바라가 ${enemy.name}을(를) 공격! ${pDmg} 데미지!` +
          (isCrit ? ' 크리티컬!' : '')
      );

      // 플레이어 스킬 발동
      if (playerState.skills && playerState.skills.length > 0) {
        for (const skill of playerState.skills) {
          const chance = skill.rarity === 'mythic' ? 0.15 : skill.rarity === 'legendary' ? 0.2 : 0.25;
          if (Math.random() < chance) {
            const skillResult = applySkillInBattle(skill, { atk: pAtk, maxHp: pMaxHp, def: pDef }, { atk: eAtk, def: eDef, maxHp: enemy.baseHp });
            eHp -= skillResult.damage;
            pHp = Math.min(pHp + skillResult.heal, pMaxHp);
            logs.push(...skillResult.logs);
          }
        }
      }

      eHp = Math.max(0, eHp);

      if (eHp <= 0) {
        logs.push(`${enemy.name}을(를) 쓰러뜨렸다!`);
        rounds.push({ round: r, logs, playerHp: pHp, enemyHp: 0 });
        result = 'victory';
        break;
      }

      // ── 적 턴 ──
      let eDmg = Math.max(1, eAtk - pDef);
      let eCrit = Math.random() < 0.1;
      if (eCrit) eDmg = Math.floor(eDmg * 1.5);

      pHp -= eDmg;
      logs.push(
        `${enemy.name}의 공격! ${eDmg} 데미지!` +
          (eCrit ? ' 크리티컬!' : '')
      );

      // 적 스킬 발동
      if (enemy.skills && enemy.skills.length > 0) {
        for (const skill of enemy.skills) {
          if (Math.random() < 0.2) {
            const skillResult = applySkillInBattle(skill, { atk: eAtk, maxHp: enemy.baseHp, def: eDef }, { atk: pAtk, def: pDef, maxHp: pMaxHp });
            pHp -= skillResult.damage;
            eHp = Math.min(eHp + skillResult.heal, enemy.baseHp);
            logs.push(...skillResult.logs);
          }
        }
      }

      pHp = Math.max(0, pHp);

      rounds.push({ round: r, logs, playerHp: pHp, enemyHp: eHp });

      if (pHp <= 0) {
        result = 'defeat';
        break;
      }
    }

    // 보상 계산 (승리 시)
    let rewards = { exp: 0, gold: 0, item: null };
    if (result === 'victory') {
      rewards.exp = enemy.exp || 20;
      rewards.gold = enemy.gold || 5;
      // 아이템 드롭 (20% 확률)
      if (Math.random() < 0.2 && DATA.equipment && DATA.equipment.length > 0) {
        rewards.item = pick(DATA.equipment);
      }
    }

    return { rounds, result, rewards };
  }

  // ── 2. processEncounter ───────────────────────────────

  function processEncounter(playerState, encounter, choiceIndex) {
    // trap 타입: 선택지 없이 바로 효과 적용
    if (encounter.type === 'trap' && encounter.trapEffect) {
      const logs = [encounter.trapEffect.description || '함정에 걸렸다!'];
      const effects = { hpChange: 0, maxHpChange: 0, atkChange: 0, defChange: 0, goldChange: 0, expChange: 0, newSkill: null, newEquipment: null, newPet: null };
      for (const eff of (encounter.trapEffect.effects || [])) {
        if (eff.type === 'hpPercent') {
          const amount = Math.floor(playerState.maxHp * Math.abs(eff.value));
          effects.hpChange -= amount;
        } else if (eff.type === 'atkPercent') {
          const amount = Math.max(1, Math.floor(playerState.atk * Math.abs(eff.value)));
          effects.atkChange -= amount;
        }
      }
      return { logs, effects };
    }

    const choice = (encounter.choices && encounter.choices[choiceIndex]) || null;
    if (!choice) {
      return { logs: ['아무 일도 일어나지 않았다.'], effects: { hpChange: 0, maxHpChange: 0, atkChange: 0, defChange: 0, goldChange: 0, expChange: 0, newSkill: null, newEquipment: null, newPet: null } };
    }

    const logs = [];
    const effects = {
      hpChange: 0,
      maxHpChange: 0,
      atkChange: 0,
      defChange: 0,
      goldChange: 0,
      expChange: 0,
      newSkill: null,
      newEquipment: null,
      newPet: null,
    };

    for (const effect of choice.effects) {
      switch (effect.type) {
        case 'healPercent': {
          const amount = Math.floor(playerState.maxHp * effect.value);
          effects.hpChange += amount;
          logs.push(`HP가 ${amount} 회복되었다!`);
          break;
        }
        case 'maxHpPercent': {
          const amount = Math.floor(playerState.maxHp * effect.value);
          effects.maxHpChange += amount;
          logs.push(`최대 HP가 ${amount} 증가했다!`);
          break;
        }
        case 'atkPercent': {
          const amount = Math.floor(playerState.atk * effect.value);
          effects.atkChange += amount;
          logs.push(`공격력이 ${amount} 증가했다!`);
          break;
        }
        case 'defPercent': {
          const amount = Math.floor(playerState.def * effect.value);
          effects.defChange += amount;
          logs.push(`방어력이 ${amount} 증가했다!`);
          break;
        }
        case 'hpLossPercent': {
          const amount = Math.floor(playerState.maxHp * effect.value);
          effects.hpChange -= amount;
          logs.push(`HP가 ${amount} 감소했다...`);
          break;
        }
        case 'maxHpLossPercent': {
          const amount = Math.floor(playerState.maxHp * effect.value);
          effects.maxHpChange -= amount;
          logs.push(`최대 HP가 ${amount} 감소했다...`);
          break;
        }
        case 'goldGain': {
          const amount = effect.value;
          effects.goldChange += amount;
          logs.push(`골드 ${amount}을(를) 획득했다!`);
          break;
        }
        case 'goldLoss': {
          const amount = effect.value;
          effects.goldChange -= amount;
          logs.push(`골드 ${amount}을(를) 잃었다...`);
          break;
        }
        case 'expGain': {
          const amount = effect.value;
          effects.expChange += amount;
          logs.push(`경험치 ${amount}을(를) 획득했다!`);
          break;
        }
        case 'randomSkill': {
          const choices = generateSkillChoices(playerState.skills || [], 1);
          if (choices.length > 0) {
            effects.newSkill = choices[0];
            logs.push(`새로운 스킬 [${choices[0].name}]을(를) 획득했다!`);
          } else {
            logs.push('배울 수 있는 새로운 스킬이 없다.');
          }
          break;
        }
        case 'randomEquipment': {
          if (DATA.equipment && DATA.equipment.length > 0) {
            const eq = pick(DATA.equipment);
            effects.newEquipment = eq;
            logs.push(`장비 [${eq.name}]을(를) 획득했다!`);
          }
          break;
        }
        case 'randomPet': {
          if (DATA.pets && DATA.pets.length > 0) {
            const ownedIds = (playerState.pets || []).map(p => p.id);
            const available = DATA.pets.filter(p => !ownedIds.includes(p.id));
            if (available.length > 0) {
              const pet = pick(available);
              effects.newPet = pet;
              logs.push(`새로운 동료 [${pet.name}]이(가) 합류했다!`);
            } else {
              logs.push('새로운 동료를 찾지 못했다.');
            }
          }
          break;
        }
        case 'nothing':
        case 'avoid':
          logs.push('아무 일도 일어나지 않았다.');
          break;
        case 'fullHeal': {
          const amount = playerState.maxHp - playerState.hp;
          effects.hpChange += amount;
          logs.push(`HP가 완전히 회복되었다!`);
          break;
        }
        case 'hpPercent': {
          const amount = Math.floor(playerState.maxHp * Math.abs(effect.value));
          if (effect.value < 0) {
            effects.hpChange -= amount;
            logs.push(`HP가 ${amount} 감소했다...`);
          } else {
            effects.hpChange += amount;
            logs.push(`HP가 ${amount} 회복되었다!`);
          }
          break;
        }
        case 'skillReward':
        case 'skillUpgrade': {
          const choices = generateSkillChoices(playerState.skills || [], 1);
          if (choices.length > 0) {
            effects.newSkill = choices[0];
            logs.push(`새로운 스킬 [${choices[0].name}]을(를) 획득했다!`);
          }
          break;
        }
        case 'eliteBattle': {
          // 엘리트 전투 효과: 경험치 보상으로 대체
          effects.expChange += 50;
          logs.push('강적과의 전투에서 승리했다! 경험치 +50');
          break;
        }
        case 'slotMachine':
        case 'wheelSpin':
        case 'minigame': {
          // 랜덤 보상
          const roll = Math.random();
          if (roll < 0.3) {
            effects.goldChange += 80;
            logs.push('대박! 골드 80을 획득했다!');
          } else if (roll < 0.6) {
            effects.expChange += 60;
            logs.push('경험치 60을 획득했다!');
          } else if (roll < 0.8) {
            const hpBonus = Math.floor(playerState.maxHp * 0.1);
            effects.maxHpChange += hpBonus;
            logs.push(`최대 HP가 ${hpBonus} 증가했다!`);
          } else {
            const choices = generateSkillChoices(playerState.skills || [], 1);
            if (choices.length > 0) {
              effects.newSkill = choices[0];
              logs.push(`스킬 [${choices[0].name}]을(를) 획득했다!`);
            } else {
              effects.goldChange += 50;
              logs.push('골드 50을 획득했다!');
            }
          }
          break;
        }
        default:
          break;
      }
    }

    if (choice.description) {
      logs.unshift(choice.description);
    }

    return { logs, effects };
  }

  // ── 3. getRandomEncounter ─────────────────────────────

  function getRandomEncounter(day, chapter) {
    const eligible = DATA.encounters.filter(
      (e) => day >= e.minDay && day <= e.maxDay
    );
    if (eligible.length === 0) return null;
    return weightedPick(eligible, (e) => e.weight);
  }

  // ── 4. getRandomEnemy ─────────────────────────────────

  function getRandomEnemy(chapter) {
    const eligible = DATA.enemies.filter(
      (e) => e.minChapter <= chapter && !e.bossOf
    );
    if (eligible.length === 0) return null;

    const base = pick(eligible);
    const scale = 1 + (chapter - base.minChapter) * 0.2;

    return {
      ...base,
      baseHp: Math.floor(base.baseHp * scale),
      baseAtk: Math.floor(base.baseAtk * scale),
      baseDef: Math.floor(base.baseDef * scale),
    };
  }

  // ── 5. getBoss ────────────────────────────────────────

  function getBoss(chapter) {
    const boss = DATA.enemies.find((e) => e.bossOf === chapter);
    if (!boss) return null;
    return { ...boss };
  }

  // ── 6. generateSkillChoices ───────────────────────────

  function generateSkillChoices(playerSkills, count) {
    if (count === undefined) count = 3;

    const ownedIds = playerSkills.map((s) => s.id);
    const available = DATA.skills.filter((s) => !ownedIds.includes(s.id));

    if (available.length === 0) return [];

    const rarityPool = { common: [], legendary: [], mythic: [] };
    for (const s of available) {
      if (rarityPool[s.rarity]) {
        rarityPool[s.rarity].push(s);
      }
    }

    const chosen = [];
    const usedIds = new Set();

    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      let rarity;
      if (roll < 0.05) rarity = 'mythic';
      else if (roll < 0.30) rarity = 'legendary';
      else rarity = 'common';

      // 해당 등급에 스킬이 없으면 다른 등급에서 선택
      let pool = rarityPool[rarity].filter((s) => !usedIds.has(s.id));
      if (pool.length === 0) {
        pool = available.filter((s) => !usedIds.has(s.id));
      }
      if (pool.length === 0) break;

      const skill = pick(pool);
      chosen.push(skill);
      usedIds.add(skill.id);
    }

    return chosen;
  }

  // ── 8. checkLevelUp ───────────────────────────────────

  function checkLevelUp(playerState) {
    if (playerState.exp < playerState.expToNext) {
      return { leveledUp: false, newLevel: playerState.level, statGains: { hp: 0, atk: 0, def: 0 } };
    }

    const newLevel = playerState.level + 1;
    const statGains = { hp: 10, atk: 2, def: 1 };

    playerState.exp -= playerState.expToNext;
    playerState.level = newLevel;
    playerState.maxHp += statGains.hp;
    playerState.hp = Math.min(playerState.hp + statGains.hp, playerState.maxHp);
    playerState.atk += statGains.atk;
    playerState.def += statGains.def;
    playerState.expToNext = newLevel * 100;

    return { leveledUp: true, newLevel, statGains };
  }

  // ── 9. calculateEquipmentStats ────────────────────────

  function calculateEquipmentStats(equipment) {
    const total = { atk: 0, def: 0, hp: 0 };

    const slots = ['weapon', 'armor', 'accessory'];
    for (const slot of slots) {
      const item = equipment[slot];
      if (item && item.stats) {
        total.atk += item.stats.atk || 0;
        total.def += item.stats.def || 0;
        total.hp += item.stats.hp || 0;
      }
    }

    return total;
  }

  // ── 10. determineDayEvent ─────────────────────────────

  function determineDayEvent(day, chapter) {
    // 60일차(마지막): 항상 보스
    if (day === 60) {
      const boss = getBoss(chapter);
      return { type: 'boss', data: boss };
    }

    // 매 10일마다: 휴식
    if (day % 10 === 0) {
      return { type: 'rest', data: null };
    }

    // 나머지: 확률 기반
    const roll = Math.random();
    if (roll < 0.50) {
      // 전투 50%
      const enemy = getRandomEnemy(chapter);
      return { type: 'battle', data: enemy };
    } else if (roll < 0.85) {
      // 인카운터 35%
      const encounter = getRandomEncounter(day, chapter);
      return { type: 'encounter', data: encounter };
    } else if (roll < 0.95) {
      // 휴식 10%
      return { type: 'rest', data: null };
    } else {
      // 상점 5%
      return { type: 'shop', data: null };
    }
  }

  // ── Public API ────────────────────────────────────────

  return {
    runBattle,
    processEncounter,
    getRandomEncounter,
    getRandomEnemy,
    getBoss,
    generateSkillChoices,
    applySkillInBattle,
    checkLevelUp,
    calculateEquipmentStats,
    determineDayEvent,
  };
})();
