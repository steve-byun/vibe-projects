/**
 * 카피바라 Go! - 게임 데이터
 * window.GAME_DATA 객체로 모든 게임 데이터를 노출
 */

window.GAME_DATA = {

  // ============================================================
  // 1. SKILLS (32개: common 20, legendary 7, mythic 5)
  // ============================================================
  skills: [
    // ── 일반 (common) 스킬 20개 ──
    {
      id: 'skill_dagger',
      name: '단검 투척',
      description: '적에게 공격력의 45%의 물리 피해를 입힌다',
      rarity: 'common',
      type: 'attack',
      icon: '🗡️',
      effects: [
        { type: 'damage', value: 0.45, target: 'single', element: 'physical' }
      ]
    },
    {
      id: 'skill_lightning_arrow',
      name: '번개 화살',
      description: '적에게 공격력의 30%의 번개 피해를 입힌다',
      rarity: 'common',
      type: 'attack',
      icon: '⚡',
      effects: [
        { type: 'damage', value: 0.30, target: 'single', element: 'lightning' }
      ]
    },
    {
      id: 'skill_ice_spike',
      name: '얼음 가시',
      description: '적에게 공격력의 35%의 얼음 피해를 입힌다',
      rarity: 'common',
      type: 'attack',
      icon: '❄️',
      effects: [
        { type: 'damage', value: 0.35, target: 'single', element: 'ice' }
      ]
    },
    {
      id: 'skill_flame_strike',
      name: '화염 강타',
      description: '모든 적에게 공격력의 40%의 화염 피해를 입힌다',
      rarity: 'common',
      type: 'attack',
      icon: '🔥',
      effects: [
        { type: 'damage', value: 0.40, target: 'all', element: 'fire' }
      ]
    },
    {
      id: 'skill_light_spear',
      name: '빛의 창',
      description: '모든 적에게 공격력의 30%의 신성 피해를 입힌다',
      rarity: 'common',
      type: 'attack',
      icon: '✨',
      effects: [
        { type: 'damage', value: 0.30, target: 'all', element: 'holy' }
      ]
    },
    {
      id: 'skill_atk_boost',
      name: '기본 공격 강화',
      description: '공격력이 15% 증가한다',
      rarity: 'common',
      type: 'buff',
      icon: '⚔️',
      effects: [
        { type: 'buff', stat: 'atkPercent', value: 0.15 }
      ]
    },
    {
      id: 'skill_fortitude',
      name: '강인함',
      description: '방어력이 30% 증가한다',
      rarity: 'common',
      type: 'defense',
      icon: '🛡️',
      effects: [
        { type: 'buff', stat: 'defPercent', value: 0.30 }
      ]
    },
    {
      id: 'skill_hp_boost',
      name: '체력 증강',
      description: '최대 HP가 15% 증가한다',
      rarity: 'common',
      type: 'buff',
      icon: '❤️',
      effects: [
        { type: 'buff', stat: 'maxHpPercent', value: 0.15 }
      ]
    },
    {
      id: 'skill_critical_heal',
      name: '치명적 회복',
      description: 'HP가 30% 미만일 때 매 라운드 10% 회복',
      rarity: 'common',
      type: 'heal',
      icon: '💚',
      effects: [
        { type: 'conditionalHeal', value: 0.10, condition: 'hpBelow', threshold: 0.30, trigger: 'perRound' }
      ]
    },
    {
      id: 'skill_rage_slash',
      name: '분노의 검기',
      description: '모든 적에게 공격력의 70%의 물리 피해를 입힌다',
      rarity: 'common',
      type: 'attack',
      icon: '💢',
      effects: [
        { type: 'damage', value: 0.70, target: 'all', element: 'physical' }
      ]
    },
    {
      id: 'skill_poison_dagger',
      name: '독 단검',
      description: '적에게 공격력의 30%의 피해를 입히고 매 라운드 5%의 독 피해를 준다',
      rarity: 'common',
      type: 'attack',
      icon: '☠️',
      effects: [
        { type: 'damage', value: 0.30, target: 'single', element: 'physical' },
        { type: 'dot', value: 0.05, element: 'poison', duration: 3 }
      ]
    },
    {
      id: 'skill_healing_dagger',
      name: '회복의 단검',
      description: '적에게 공격력의 30%의 피해를 입히고 HP를 5% 회복한다',
      rarity: 'common',
      type: 'attack',
      icon: '💖',
      effects: [
        { type: 'damage', value: 0.30, target: 'single', element: 'physical' },
        { type: 'healOnHit', value: 0.05 }
      ]
    },
    {
      id: 'skill_lightning_rush',
      name: '번개 쇄도',
      description: '모든 적에게 공격력의 25%의 번개 피해를 입힌다',
      rarity: 'common',
      type: 'attack',
      icon: '⚡',
      effects: [
        { type: 'damage', value: 0.25, target: 'all', element: 'lightning' }
      ]
    },
    {
      id: 'skill_flame_shield',
      name: '화염 보호막',
      description: '최대 HP의 15%만큼 보호막을 생성한다',
      rarity: 'common',
      type: 'defense',
      icon: '🔥',
      effects: [
        { type: 'shield', value: 0.15 }
      ]
    },
    {
      id: 'skill_frost_blast',
      name: '냉기 폭발',
      description: '모든 적에게 공격력의 50%의 얼음 피해를 입힌다',
      rarity: 'common',
      type: 'attack',
      icon: '❄️',
      effects: [
        { type: 'damage', value: 0.50, target: 'all', element: 'ice' }
      ]
    },
    {
      id: 'skill_counter_stance',
      name: '반격 자세',
      description: '30% 확률로 받은 공격을 반격한다',
      rarity: 'common',
      type: 'defense',
      icon: '🔄',
      effects: [
        { type: 'counter', chance: 0.30 }
      ]
    },
    {
      id: 'skill_combo_attack',
      name: '콤보 공격',
      description: '25% 확률로 추가 공격, 공격력의 60% 피해',
      rarity: 'common',
      type: 'attack',
      icon: '👊',
      effects: [
        { type: 'combo', chance: 0.25, damage: 0.60 }
      ]
    },
    {
      id: 'skill_lifesteal',
      name: '흡혈 공격',
      description: '적에게 공격력의 40%의 피해를 입히고 피해량의 20%를 흡수한다',
      rarity: 'common',
      type: 'attack',
      icon: '🧛',
      effects: [
        { type: 'damage', value: 0.40, target: 'single', element: 'physical' },
        { type: 'lifesteal', value: 0.20 }
      ]
    },
    {
      id: 'skill_defense_stance',
      name: '방어 태세',
      description: '받는 피해가 10% 감소한다',
      rarity: 'common',
      type: 'defense',
      icon: '🛡️',
      effects: [
        { type: 'damageReduction', value: 0.10 }
      ]
    },
    {
      id: 'skill_exp_blessing',
      name: '경험의 축복',
      description: '획득 경험치가 20% 증가한다',
      rarity: 'common',
      type: 'buff',
      icon: '📚',
      effects: [
        { type: 'buff', stat: 'expBonus', value: 0.20 }
      ]
    },

    // ── 전설 (legendary) 스킬 7개 ──
    {
      id: 'skill_dagger_mastery',
      name: '단검 마스터리',
      description: '단검 스킬 피해가 60% 증가하지만 다른 스킬 피해가 10% 감소한다',
      rarity: 'legendary',
      type: 'buff',
      icon: '🗡️',
      effects: [
        { type: 'skillBoost', category: 'dagger', value: 0.60 },
        { type: 'skillPenalty', category: 'other', value: -0.10 }
      ]
    },
    {
      id: 'skill_berserker',
      name: '버서커',
      description: '기본 공격이 50% 증가하지만 스킬 피해가 30% 감소한다',
      rarity: 'legendary',
      type: 'buff',
      icon: '👹',
      effects: [
        { type: 'buff', stat: 'basicAtkPercent', value: 0.50 },
        { type: 'skillPenalty', category: 'all', value: -0.30 }
      ]
    },
    {
      id: 'skill_mage',
      name: '마법사',
      description: '스킬 피해가 100% 증가하지만 기본 공격이 50% 감소한다',
      rarity: 'legendary',
      type: 'buff',
      icon: '🧙',
      effects: [
        { type: 'skillBoost', category: 'all', value: 1.00 },
        { type: 'buff', stat: 'basicAtkPercent', value: -0.50 }
      ]
    },
    {
      id: 'skill_explosive_dagger',
      name: '폭발 단검',
      description: '단검이 폭발하여 150% 추가 피해를 입힌다',
      rarity: 'legendary',
      type: 'attack',
      icon: '💥',
      effects: [
        { type: 'transform', skill: 'dagger', property: 'explosive' },
        { type: 'skillBoost', category: 'dagger', value: 1.50 }
      ]
    },
    {
      id: 'skill_electric_storm',
      name: '전기 폭풍',
      description: '번개 범위 공격에 기절 확률이 추가된다',
      rarity: 'legendary',
      type: 'attack',
      icon: '⛈️',
      effects: [
        { type: 'damage', value: 0.60, target: 'all', element: 'lightning' },
        { type: 'stun', chance: 0.20 }
      ]
    },
    {
      id: 'skill_frozen_touch',
      name: '냉동 손길',
      description: '얼음 가시에 5% 확률로 즉사 효과가 추가된다',
      rarity: 'legendary',
      type: 'attack',
      icon: '🥶',
      effects: [
        { type: 'enhance', skill: 'skill_ice_spike' },
        { type: 'instantKill', chance: 0.05 }
      ]
    },
    {
      id: 'skill_rage_mastery',
      name: '분노 숙련',
      description: '분노 게이지 충전량이 50% 증가하지만 피해가 10% 감소한다',
      rarity: 'legendary',
      type: 'buff',
      icon: '😤',
      effects: [
        { type: 'buff', stat: 'rageGeneration', value: 0.50 },
        { type: 'buff', stat: 'damagePercent', value: -0.10 }
      ]
    },

    // ── 신화 (mythic) 스킬 5개 ──
    {
      id: 'skill_battle_veteran',
      name: '전투 베테랑',
      description: '매 라운드 공격력이 15%씩 증가한다',
      rarity: 'mythic',
      type: 'buff',
      icon: '🎖️',
      effects: [
        { type: 'stackingBuff', stat: 'atkPercent', value: 0.15, trigger: 'perRound' }
      ]
    },
    {
      id: 'skill_battle_hardened',
      name: '전투 단련',
      description: '매 라운드 받는 피해가 8%씩 감소한다',
      rarity: 'mythic',
      type: 'defense',
      icon: '🏋️',
      effects: [
        { type: 'stackingBuff', stat: 'damageReduction', value: 0.08, trigger: 'perRound' }
      ]
    },
    {
      id: 'skill_trinity',
      name: '삼위일체',
      description: '치명타, 콤보, 반격 확률이 모두 15% 증가한다',
      rarity: 'mythic',
      type: 'buff',
      icon: '🔱',
      effects: [
        { type: 'buff', stat: 'critRate', value: 0.15 },
        { type: 'buff', stat: 'comboRate', value: 0.15 },
        { type: 'buff', stat: 'counterRate', value: 0.15 }
      ]
    },
    {
      id: 'skill_revive',
      name: '부활',
      description: 'HP가 0이 되면 30%의 HP로 한 번 부활한다',
      rarity: 'mythic',
      type: 'heal',
      icon: '💫',
      effects: [
        { type: 'revive', value: 0.30, uses: 1 }
      ]
    },
    {
      id: 'skill_glass_cannon',
      name: '유리 대포',
      description: 'HP가 30% 미만일 때 극단적으로 높은 피해를 입힌다',
      rarity: 'mythic',
      type: 'attack',
      icon: '💎',
      effects: [
        { type: 'conditionalDamage', value: 2.50, condition: 'hpBelow', threshold: 0.30 }
      ]
    }
  ],

  // ============================================================
  // 2. ENCOUNTERS (16개)
  // ============================================================
  encounters: [
    {
      id: 'campsite',
      name: '야영지',
      description: '버려진 야영지를 발견했다. 아직 모닥불의 온기가 남아 있다.',
      type: 'choice',
      icon: '🏕️',
      minDay: 1,
      maxDay: 60,
      weight: 10,
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
    },
    {
      id: 'empty_cabin',
      name: '빈 오두막',
      description: '숲 속에 낡은 오두막이 하나 서 있다. 문이 열려 있다.',
      type: 'choice',
      icon: '🛖',
      minDay: 1,
      maxDay: 60,
      weight: 10,
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
    },
    {
      id: 'stone_spirit',
      name: '돌의 정령',
      description: '고대의 돌 정령이 앞을 가로막고 있다. 강한 영적 기운이 느껴진다.',
      type: 'choice',
      icon: '🗿',
      minDay: 5,
      maxDay: 60,
      weight: 8,
      choices: [
        {
          text: '기도하기',
          description: 'HP를 30% 회복한다',
          effects: [{ type: 'healPercent', value: 0.3 }]
        },
        {
          text: '제물 바치기',
          description: '스킬이 강화되지만 최대 HP가 5% 감소한다',
          effects: [
            { type: 'skillUpgrade', value: 1 },
            { type: 'maxHpPercent', value: -0.05 }
          ]
        }
      ]
    },
    {
      id: 'threatening_enemy',
      name: '위협적인 적',
      description: '앞에 강력해 보이는 적이 길을 막고 있다. 싸울 것인가?',
      type: 'choice',
      icon: '⚔️',
      minDay: 3,
      maxDay: 60,
      weight: 8,
      choices: [
        {
          text: '숨기',
          description: '전투를 피한다',
          effects: [{ type: 'avoid' }]
        },
        {
          text: '싸우기',
          description: '엘리트 전투! 승리 시 스킬 보상',
          effects: [
            { type: 'eliteBattle' },
            { type: 'skillReward', value: 1 }
          ]
        }
      ]
    },
    {
      id: 'demon',
      name: '악마',
      description: '그림자 속에서 악마가 모습을 드러낸다. 달콤한 거래를 제안한다.',
      type: 'choice',
      icon: '😈',
      minDay: 10,
      maxDay: 60,
      weight: 5,
      choices: [
        {
          text: '거절하기',
          description: '아무 일도 일어나지 않는다',
          effects: [{ type: 'nothing' }]
        },
        {
          text: '수락하기',
          description: '스킬을 얻지만 최대 HP가 20% 감소한다',
          effects: [
            { type: 'skillReward', value: 1 },
            { type: 'maxHpPercent', value: -0.20 }
          ]
        }
      ]
    },
    {
      id: 'fire_ants',
      name: '불개미',
      description: '발밑에 불개미 떼가 우글거린다! 피하기엔 너무 늦었다.',
      type: 'trap',
      icon: '🐜',
      minDay: 1,
      maxDay: 60,
      weight: 7,
      choices: [],
      trapEffect: {
        description: 'HP가 10% 감소한다',
        effects: [{ type: 'hpPercent', value: -0.10 }]
      }
    },
    {
      id: 'razor_ants',
      name: '면도날 개미',
      description: '날카로운 턱을 가진 개미들이 장비를 갉아먹고 있다!',
      type: 'trap',
      icon: '🐜',
      minDay: 5,
      maxDay: 60,
      weight: 5,
      choices: [],
      trapEffect: {
        description: '공격력이 5% 감소한다',
        effects: [{ type: 'atkPercent', value: -0.05 }]
      }
    },
    {
      id: 'angel',
      name: '천사',
      description: '한 줄기 빛과 함께 천사가 내려왔다. 축복을 내려주겠다고 한다.',
      type: 'choice',
      icon: '👼',
      minDay: 10,
      maxDay: 60,
      weight: 5,
      choices: [
        {
          text: '능력 선택',
          description: '스킬 선택 기회를 얻는다',
          effects: [{ type: 'skillReward', value: 1 }]
        },
        {
          text: '능력 + 회복',
          description: '스킬을 얻고 HP를 30% 회복한다',
          effects: [
            { type: 'skillReward', value: 1 },
            { type: 'healPercent', value: 0.30 }
          ]
        }
      ]
    },
    {
      id: 'lucky_merchant',
      name: '행운의 상인',
      description: '화려한 복장의 상인이 수레를 끌고 지나간다. "운을 시험해 보시겠어요?"',
      type: 'fortune',
      icon: '🛒',
      minDay: 5,
      maxDay: 60,
      weight: 6,
      choices: [
        {
          text: '슬롯머신 돌리기',
          description: '3개의 슬롯을 돌려 보상을 얻는다',
          effects: [{ type: 'slotMachine', slots: 3 }]
        },
        {
          text: '그냥 지나가기',
          description: '아무 일도 일어나지 않는다',
          effects: [{ type: 'nothing' }]
        }
      ]
    },
    {
      id: 'treasure_map',
      name: '보물 지도',
      description: '땅에서 낡은 보물 지도를 발견했다. 해독할 수 있을까?',
      type: 'fortune',
      icon: '🗺️',
      minDay: 8,
      maxDay: 60,
      weight: 5,
      choices: [
        {
          text: '지도 따라가기',
          description: '미니게임에 성공하면 보상을 얻는다',
          effects: [{ type: 'minigame', reward: 'equipment' }]
        },
        {
          text: '무시하기',
          description: '아무 일도 일어나지 않는다',
          effects: [{ type: 'nothing' }]
        }
      ]
    },
    {
      id: 'spinning_roulette',
      name: '회전하는 룰렛',
      description: '길 한복판에 거대한 룰렛이 돌아가고 있다. 누가 여기에 놓은 거지?',
      type: 'fortune',
      icon: '🎰',
      minDay: 5,
      maxDay: 60,
      weight: 6,
      choices: [
        {
          text: '룰렛 돌리기',
          description: '랜덤 보상 또는 패널티',
          effects: [{ type: 'wheelSpin' }]
        },
        {
          text: '그냥 지나가기',
          description: '아무 일도 일어나지 않는다',
          effects: [{ type: 'nothing' }]
        }
      ]
    },
    {
      id: 'skeleton_warrior',
      name: '해골 전사',
      description: '어둠 속에서 해골 전사가 칼을 들고 다가온다. 눈구멍에서 붉은 빛이 새어나온다.',
      type: 'choice',
      icon: '💀',
      minDay: 8,
      maxDay: 60,
      weight: 7,
      choices: [
        {
          text: '싸우기',
          description: '전투에서 승리하면 보상을 얻는다',
          effects: [{ type: 'eliteBattle' }]
        },
        {
          text: '도망치기',
          description: 'HP가 5% 감소하지만 전투를 피한다',
          effects: [{ type: 'hpPercent', value: -0.05 }]
        }
      ]
    },
    {
      id: 'ghost_doll',
      name: '유령 인형',
      description: '길가에 버려진 인형에서 기이한 기운이 느껴진다. 인형이 말을 건다.',
      type: 'choice',
      icon: '👻',
      minDay: 10,
      maxDay: 60,
      weight: 5,
      choices: [
        {
          text: '최대 HP 바치기',
          description: '최대 HP -7%, 스킬 획득',
          effects: [
            { type: 'maxHpPercent', value: -0.07 },
            { type: 'skillReward', value: 1 }
          ]
        },
        {
          text: '공격력 바치기',
          description: '공격력 -7%, 스킬 획득',
          effects: [
            { type: 'atkPercent', value: -0.07 },
            { type: 'skillReward', value: 1 }
          ]
        }
      ]
    },
    {
      id: 'brewery',
      name: '양조장',
      description: '수상한 양조장을 발견했다. 거대한 욕조와 이상한 액체가 가득한 병이 보인다.',
      type: 'choice',
      icon: '🧪',
      minDay: 5,
      maxDay: 60,
      weight: 7,
      choices: [
        {
          text: '목욕하기',
          description: '최대 HP +15%, 공격력 -5%',
          effects: [
            { type: 'maxHpPercent', value: 0.15 },
            { type: 'atkPercent', value: -0.05 }
          ]
        },
        {
          text: '마시기',
          description: '공격력 +15%',
          effects: [{ type: 'atkPercent', value: 0.15 }]
        }
      ]
    },
    {
      id: 'mystic_spring',
      name: '신비로운 샘',
      description: '은빛으로 빛나는 샘물이 졸졸 흐르고 있다. 신성한 기운이 느껴진다.',
      type: 'choice',
      icon: '⛲',
      minDay: 1,
      maxDay: 60,
      weight: 6,
      choices: [
        {
          text: '마시기',
          description: 'HP를 전부 회복한다',
          effects: [{ type: 'fullHeal' }]
        },
        {
          text: '무시하기',
          description: '아무 일도 일어나지 않는다',
          effects: [{ type: 'nothing' }]
        }
      ]
    },
    {
      id: 'suspicious_bundle',
      name: '수상한 보따리',
      description: '길가에 수상한 보따리가 떨어져 있다. 열어볼까?',
      type: 'fortune',
      icon: '🎒',
      minDay: 3,
      maxDay: 60,
      weight: 7,
      choices: [
        {
          text: '열어보기',
          description: '랜덤 장비를 획득한다',
          effects: [{ type: 'randomEquipment' }]
        },
        {
          text: '그냥 지나가기',
          description: '아무 일도 일어나지 않는다',
          effects: [{ type: 'nothing' }]
        }
      ]
    }
  ],

  // ============================================================
  // 3. ENEMIES (15개: 챕터별 5개)
  // ============================================================
  enemies: [
    // ── 챕터 1: 숲 ──
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
      bossOf: null
    },
    {
      id: 'goblin',
      name: '고블린',
      icon: '👺',
      baseHp: 70,
      baseAtk: 12,
      baseDef: 3,
      exp: 30,
      gold: 8,
      skills: [],
      minChapter: 1,
      bossOf: null
    },
    {
      id: 'wolf',
      name: '늑대',
      icon: '🐺',
      baseHp: 60,
      baseAtk: 15,
      baseDef: 2,
      exp: 25,
      gold: 7,
      skills: [],
      minChapter: 1,
      bossOf: null
    },
    {
      id: 'poison_mushroom',
      name: '독버섯',
      icon: '🍄',
      baseHp: 40,
      baseAtk: 10,
      baseDef: 5,
      exp: 22,
      gold: 6,
      skills: [{ type: 'dot', value: 0.03, element: 'poison', duration: 2 }],
      minChapter: 1,
      bossOf: null
    },
    {
      id: 'troll_king',
      name: '트롤 왕',
      icon: '👹',
      baseHp: 300,
      baseAtk: 25,
      baseDef: 10,
      exp: 150,
      gold: 50,
      skills: [
        { type: 'damage', value: 0.60, target: 'single', element: 'physical' },
        { type: 'heal', value: 0.10 }
      ],
      minChapter: 1,
      bossOf: 1
    },

    // ── 챕터 2: 사막 ──
    {
      id: 'scorpion',
      name: '전갈',
      icon: '🦂',
      baseHp: 80,
      baseAtk: 18,
      baseDef: 5,
      exp: 40,
      gold: 12,
      skills: [{ type: 'dot', value: 0.04, element: 'poison', duration: 2 }],
      minChapter: 2,
      bossOf: null
    },
    {
      id: 'mummy',
      name: '미라',
      icon: '🧟',
      baseHp: 100,
      baseAtk: 15,
      baseDef: 8,
      exp: 45,
      gold: 14,
      skills: [],
      minChapter: 2,
      bossOf: null
    },
    {
      id: 'sand_snake',
      name: '모래 뱀',
      icon: '🐍',
      baseHp: 70,
      baseAtk: 22,
      baseDef: 3,
      exp: 38,
      gold: 11,
      skills: [],
      minChapter: 2,
      bossOf: null
    },
    {
      id: 'bandit',
      name: '도적',
      icon: '🗡️',
      baseHp: 90,
      baseAtk: 20,
      baseDef: 6,
      exp: 42,
      gold: 18,
      skills: [{ type: 'steal', value: 5 }],
      minChapter: 2,
      bossOf: null
    },
    {
      id: 'pharaoh',
      name: '사막의 파라오',
      icon: '👑',
      baseHp: 500,
      baseAtk: 35,
      baseDef: 15,
      exp: 300,
      gold: 100,
      skills: [
        { type: 'damage', value: 0.80, target: 'single', element: 'physical' },
        { type: 'buff', stat: 'atkPercent', value: 0.20 }
      ],
      minChapter: 2,
      bossOf: 2
    },

    // ── 챕터 3: 화산 ──
    {
      id: 'fire_imp',
      name: '화염 임프',
      icon: '👿',
      baseHp: 120,
      baseAtk: 25,
      baseDef: 8,
      exp: 55,
      gold: 18,
      skills: [{ type: 'damage', value: 0.30, target: 'single', element: 'fire' }],
      minChapter: 3,
      bossOf: null
    },
    {
      id: 'lava_golem',
      name: '용암 골렘',
      icon: '🪨',
      baseHp: 180,
      baseAtk: 20,
      baseDef: 20,
      exp: 60,
      gold: 20,
      skills: [],
      minChapter: 3,
      bossOf: null
    },
    {
      id: 'firebird',
      name: '불새',
      icon: '🔥',
      baseHp: 100,
      baseAtk: 30,
      baseDef: 5,
      exp: 52,
      gold: 16,
      skills: [{ type: 'damage', value: 0.40, target: 'all', element: 'fire' }],
      minChapter: 3,
      bossOf: null
    },
    {
      id: 'volcano_mage',
      name: '화산 마법사',
      icon: '🧙',
      baseHp: 110,
      baseAtk: 35,
      baseDef: 10,
      exp: 58,
      gold: 22,
      skills: [
        { type: 'damage', value: 0.50, target: 'single', element: 'fire' },
        { type: 'shield', value: 0.10 }
      ],
      minChapter: 3,
      bossOf: null
    },
    {
      id: 'fire_dragon',
      name: '화염 드래곤',
      icon: '🐉',
      baseHp: 800,
      baseAtk: 50,
      baseDef: 25,
      exp: 500,
      gold: 200,
      skills: [
        { type: 'damage', value: 1.00, target: 'single', element: 'fire' },
        { type: 'damage', value: 0.50, target: 'all', element: 'fire' },
        { type: 'buff', stat: 'atkPercent', value: 0.15 }
      ],
      minChapter: 3,
      bossOf: 3
    }
  ],

  // ============================================================
  // 4. EQUIPMENT (12개: 무기 4, 방어구 4, 장신구 4)
  // ============================================================
  equipment: [
    // ── 무기 ──
    {
      id: 'nomad_bow',
      name: '유목민의 활',
      type: 'weapon',
      rarity: 'common',
      stats: { atk: 5 },
      icon: '🏹',
      description: '유목민이 사용하던 낡은 활'
    },
    {
      id: 'steel_sword',
      name: '강철 검',
      type: 'weapon',
      rarity: 'common',
      stats: { atk: 8 },
      icon: '⚔️',
      description: '단단한 강철로 만든 믿음직한 검'
    },
    {
      id: 'magic_staff',
      name: '마법 지팡이',
      type: 'weapon',
      rarity: 'legendary',
      stats: { atk: 12, skillDamage: 0.15 },
      icon: '🪄',
      description: '마력이 깃든 지팡이. 스킬 피해가 증가한다'
    },
    {
      id: 'assassin_dagger',
      name: '암살자의 단검',
      type: 'weapon',
      rarity: 'legendary',
      stats: { atk: 10, critRate: 0.10 },
      icon: '🗡️',
      description: '어둠 속에서 빛나는 단검. 치명타 확률이 증가한다'
    },

    // ── 방어구 ──
    {
      id: 'leather_armor',
      name: '가죽 갑옷',
      type: 'armor',
      rarity: 'common',
      stats: { def: 5 },
      icon: '🦺',
      description: '가볍고 튼튼한 가죽 갑옷'
    },
    {
      id: 'steel_armor',
      name: '강철 갑옷',
      type: 'armor',
      rarity: 'common',
      stats: { def: 10 },
      icon: '🛡️',
      description: '무거운 강철 갑옷. 높은 방어력을 제공한다'
    },
    {
      id: 'mage_robe',
      name: '마법사 로브',
      type: 'armor',
      rarity: 'legendary',
      stats: { def: 4, maxHp: 30, skillDamage: 0.10 },
      icon: '👘',
      description: '마력이 흐르는 로브. 최대 HP와 스킬 피해가 증가한다'
    },
    {
      id: 'dark_cloak',
      name: '암흑 망토',
      type: 'armor',
      rarity: 'legendary',
      stats: { def: 7, evasion: 0.08 },
      icon: '🧥',
      description: '그림자를 두른 망토. 회피 확률이 증가한다'
    },

    // ── 장신구 ──
    {
      id: 'guardian_ring',
      name: '수호자의 반지',
      type: 'accessory',
      rarity: 'common',
      stats: { def: 3, maxHp: 20 },
      icon: '💍',
      description: '착용자를 보호하는 신비로운 반지'
    },
    {
      id: 'magic_necklace',
      name: '마력의 목걸이',
      type: 'accessory',
      rarity: 'common',
      stats: { atk: 4, skillDamage: 0.05 },
      icon: '📿',
      description: '마력이 깃든 목걸이. 공격력과 스킬 피해가 소폭 증가한다'
    },
    {
      id: 'warrior_belt',
      name: '전사의 벨트',
      type: 'accessory',
      rarity: 'common',
      stats: { atk: 3, def: 3 },
      icon: '🔗',
      description: '전사가 애용하는 벨트. 공격력과 방어력이 소폭 증가한다'
    },
    {
      id: 'lucky_charm',
      name: '행운의 부적',
      type: 'accessory',
      rarity: 'legendary',
      stats: { critRate: 0.08, goldBonus: 0.15 },
      icon: '🍀',
      description: '행운을 불러오는 부적. 치명타 확률과 골드 획득량이 증가한다'
    }
  ],

  // ============================================================
  // 5. PETS (6개)
  // ============================================================
  pets: [
    {
      id: 'ice_shroom',
      name: '얼음 버섯',
      icon: '🍄',
      rarity: 'common',
      description: '전투 시작 시 최대 HP의 10%만큼 보호막을 생성한다',
      effect: { type: 'shield', value: 0.10 }
    },
    {
      id: 'snow_rabbit',
      name: '눈토끼',
      icon: '🐇',
      rarity: 'common',
      description: '전투 시작 시 적을 1라운드 동안 둔화시킨다',
      effect: { type: 'crowdControl', subType: 'slow', duration: 1 }
    },
    {
      id: 'flame_fox',
      name: '불꽃 여우',
      icon: '🦊',
      rarity: 'common',
      description: '전투 중 공격 피해가 10% 증가한다',
      effect: { type: 'damageBuff', value: 0.10 }
    },
    {
      id: 'healing_butterfly',
      name: '치유의 나비',
      icon: '🦋',
      rarity: 'common',
      description: '매 라운드 HP를 5% 회복한다',
      effect: { type: 'healPerRound', value: 0.05 }
    },
    {
      id: 'steel_turtle',
      name: '강철 거북',
      icon: '🐢',
      rarity: 'common',
      description: '방어력이 20% 증가한다',
      effect: { type: 'defBuff', value: 0.20 }
    },
    {
      id: 'thunder_hawk',
      name: '번개 매',
      icon: '🦅',
      rarity: 'common',
      description: '치명타 확률이 10% 증가한다',
      effect: { type: 'critBuff', value: 0.10 }
    }
  ],

  // ============================================================
  // 6. TEXT (전체 UI 텍스트)
  // ============================================================
  text: {
    // 기본 UI
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
    noSaveData: '저장된 데이터가 없습니다',
    equipment: '장비',
    pet: '펫',
    weapon: '무기',
    armor: '방어구',
    accessory: '장신구',
    empty: '비어있음',
    confirm: '확인',
    cancel: '취소',
    skip: '건너뛰기',

    // 등급
    rarityCommon: '일반',
    rarityLegendary: '전설',
    rarityMythic: '신화',

    // 스킬 타입
    typeAttack: '공격',
    typeDefense: '방어',
    typeBuff: '버프',
    typeHeal: '회복',

    // 챕터 이름
    chapterNames: {
      1: '어둠의 숲',
      2: '불타는 사막',
      3: '화산의 심장'
    },

    // 전투 메시지 템플릿
    battleMessages: {
      playerAttack: '{player}의 공격! {enemy}에게 {damage}의 피해!',
      enemyAttack: '{enemy}의 공격! {player}에게 {damage}의 피해!',
      playerSkill: '{player}이(가) {skill}을(를) 사용! {enemy}에게 {damage}의 피해!',
      enemySkill: '{enemy}이(가) 특수 공격! {player}에게 {damage}의 피해!',
      playerHeal: '{player}이(가) {amount}만큼 회복했다!',
      playerShield: '{player}에게 {amount}의 보호막이 생성되었다!',
      critical: '치명타! 피해가 1.5배로 증가!',
      miss: '빗나갔다!',
      counter: '{player}의 반격! {damage}의 피해!',
      combo: '콤보! 추가 공격으로 {damage}의 피해!',
      poison: '{target}이(가) 독에 의해 {damage}의 피해를 입었다!',
      stun: '{target}이(가) 기절했다! 이번 턴 행동 불가!',
      lifesteal: '{player}이(가) {amount}의 HP를 흡수했다!',
      revive: '{player}이(가) 부활했다! HP {amount} 회복!',
      dodge: '{target}이(가) 공격을 회피했다!',
      shieldBreak: '보호막이 파괴되었다!',
      buffApplied: '{target}의 {stat}이(가) {value}% 증가!',
      debuffApplied: '{target}의 {stat}이(가) {value}% 감소!',
      petAction: '{pet}이(가) {action}!',
      instantKill: '즉사! {enemy}이(가) 한 방에 쓰러졌다!'
    },

    // 전투 결과
    battleVictory: '{enemy}을(를) 처치했다!',
    battleDefeat: '{player}이(가) 쓰러졌다...',
    battleExpGained: '경험치 +{exp}',
    battleGoldGained: '골드 +{gold}',
    battleItemDrop: '{item}을(를) 획득했다!',

    // 인카운터 인트로 텍스트
    encounterIntro: {
      choice: '길을 가다 무언가를 발견했다...',
      battle: '앞에서 위험한 기운이 느껴진다...',
      fortune: '오늘은 운이 좋을지도 모른다...',
      trap: '이런! 함정에 빠졌다!'
    },

    // 날 바뀜 분위기 메시지
    dayMessages: {
      morning: [
        '새벽 안개가 걷히며 새로운 하루가 밝았다.',
        '아침 햇살이 나뭇잎 사이로 비추고 있다.',
        '새들이 지저귀며 하루의 시작을 알린다.',
        '이슬이 맺힌 풀잎을 밟으며 길을 나선다.',
        '동쪽 하늘이 붉게 물들며 여정이 시작된다.'
      ],
      afternoon: [
        '태양이 머리 위에 높이 떠올랐다.',
        '한낮의 열기가 대지를 달구고 있다.',
        '길 위의 먼지가 바람에 흩날린다.',
        '그림자가 짧아진 한낮, 발걸음을 재촉한다.',
        '뜨거운 햇살 아래 땀이 흘러내린다.'
      ],
      evening: [
        '석양이 하늘을 붉게 물들이고 있다.',
        '어둠이 서서히 내려앉고 있다.',
        '저녁노을 너머로 연기가 피어오른다.',
        '하루의 끝자락, 피로가 밀려온다.',
        '붉은 하늘 아래 오늘의 여정을 되돌아본다.'
      ],
      night: [
        '달빛이 길을 비추고 있다.',
        '별들이 하늘 가득 빛나고 있다.',
        '어둠 속에서 벌레 소리만이 들려온다.',
        '차가운 밤공기가 뺨을 스친다.',
        '밤의 정적 속에서 경계를 늦추지 않는다.'
      ]
    },

    // 레벨업 메시지
    levelUpMessage: '축하합니다! 레벨 {level}에 도달했습니다!',
    levelUpStats: '공격력 +{atk}, 방어력 +{def}, 최대 HP +{hp}',

    // 챕터 관련
    chapterClearMessage: '챕터 {chapter} "{name}"을(를) 클리어했습니다!',
    chapterBossAppear: '강력한 기운이 느껴진다... 보스가 나타났다!',
    chapterReward: '클리어 보상을 획득했습니다!',

    // 게임 오버
    gameOverMessage: '카피바라가 쓰러졌습니다...',
    gameOverStats: '도달 챕터: {chapter}, 일차: {day}, 레벨: {level}',
    gameOverRetry: '다시 한번 도전하시겠습니까?',

    // 이벤트 결과
    eventHeal: 'HP를 {amount} 회복했다!',
    eventMaxHpUp: '최대 HP가 {amount} 증가했다!',
    eventMaxHpDown: '최대 HP가 {amount} 감소했다...',
    eventAtkUp: '공격력이 {amount} 증가했다!',
    eventAtkDown: '공격력이 {amount} 감소했다...',
    eventDefUp: '방어력이 {amount} 증가했다!',
    eventDefDown: '방어력이 {amount} 감소했다...',
    eventSkillGained: '새로운 스킬을 습득했다!',
    eventEquipGained: '장비를 획득했다!',
    eventNothing: '아무 일도 일어나지 않았다.',
    eventTrap: '함정에 걸렸다!',

    // 기타
    saveSuccess: '게임이 저장되었습니다.',
    loadSuccess: '저장된 게임을 불러왔습니다.',
    bossWarning: '⚠️ 보스 전투가 다가오고 있다!'
  }
};
