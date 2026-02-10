// === StarCraft RTS Clone - Combat System ===
// Handles damage, targeting, projectiles, auto-aggro, healing, siege mode, splash.
// Exposed at window.SC.Combat

window.SC = window.SC || {};

window.SC.Combat = {
  // Active projectiles managed by combat system
  _projectiles: [],

  // Projectile speed in pixels per second
  _projectileSpeed: 400,

  /**
   * Main combat update. Called every tick.
   * @param {number} dt - delta time in seconds
   * @param {object} gameState
   */
  update(dt, gameState) {
    if (!gameState || gameState.phase !== 'playing') return;

    const C = SC.CONST;
    const entities = gameState.entities;

    // --- Process units ---
    for (let i = 0; i < gameState.units.length; i++) {
      const unitId = gameState.units[i];
      const unit = entities[unitId];
      if (!unit || !unit.alive) continue;

      const state = unit.state;

      switch (state) {
        case C.UNIT_STATE.ATTACKING:
          this._processAttacking(unit, dt, gameState);
          break;
        case C.UNIT_STATE.ATTACK_MOVE:
          // Handled below — hybrid of MOVING + ATTACKING
          break;
        case C.UNIT_STATE.HOLDING:
          this._processHolding(unit, dt, gameState);
          break;
        case C.UNIT_STATE.SIEGE_MODE:
          this._processSiegeMode(unit, dt, gameState);
          break;
        case C.UNIT_STATE.HEALING:
          this._processHealing(unit, dt, gameState);
          break;
        case C.UNIT_STATE.IDLE:
          this._processAutoAggro(unit, dt, gameState);
          break;
        default:
          break;
      }
    }

    // --- Process attack-move units separately (they may be in MOVING or need scan) ---
    this._processAttackMoveUnits(dt, gameState);

    // --- Process buildings that can attack (missile turret) ---
    this._processBuildingAttacks(dt, gameState);

    // --- Process medic auto-heal when idle ---
    this._processMedicAutoHeal(dt, gameState);

    // --- Update projectiles ---
    this._updateProjectiles(dt, gameState);
  },

  // ===========================
  // State Processing
  // ===========================

  /**
   * Process a unit in ATTACKING state.
   */
  _processAttacking(unit, dt, gameState) {
    const C = SC.CONST;
    const target = unit.attackTarget ? gameState.entities[unit.attackTarget] : null;

    // Target dead or gone?
    if (!target || !target.alive) {
      // Find a new target within sight range
      const newTarget = this.findTarget(unit, gameState, unit.sightRange);
      if (newTarget) {
        unit.attackTarget = newTarget.id;
        unit.attackTimer = 0;
      } else {
        unit.state = C.UNIT_STATE.IDLE;
        unit.attackTarget = null;
        return;
      }
    }

    const currentTarget = gameState.entities[unit.attackTarget];
    if (!currentTarget || !currentTarget.alive) {
      unit.state = C.UNIT_STATE.IDLE;
      unit.attackTarget = null;
      return;
    }

    const unitData = SC.UNIT_DATA ? SC.UNIT_DATA[unit.subType] : null;
    if (!unitData || !unitData.canAttack) {
      unit.state = C.UNIT_STATE.IDLE;
      unit.attackTarget = null;
      return;
    }

    // Check if target is valid (flying check)
    if (currentTarget.isFlying && !unitData.canAttackAir) {
      // Can't attack this target, find another
      const newTarget = this.findTarget(unit, gameState, unit.sightRange);
      if (newTarget) {
        unit.attackTarget = newTarget.id;
        unit.attackTimer = 0;
      } else {
        unit.state = C.UNIT_STATE.IDLE;
        unit.attackTarget = null;
      }
      return;
    }

    const range = unitData.attackRange;
    const distTiles = unit.tileDistanceTo(currentTarget);

    if (distTiles > range) {
      // Move toward target
      this._moveToward(unit, currentTarget.x, currentTarget.y, dt, unitData);
    } else {
      // In range - attack when timer ready
      if (unit.attackTimer === undefined || unit.attackTimer === null) {
        unit.attackTimer = 0;
      }
      unit.attackTimer -= dt;

      if (unit.attackTimer <= 0) {
        this._fireAttack(unit, currentTarget, unitData, gameState);
        unit.attackTimer = unitData.attackCooldown;
      }

      // Face the target
      unit.angle = Math.atan2(currentTarget.y - unit.y, currentTarget.x - unit.x);
    }
  },

  /**
   * Process units in HOLDING state - attack in range, never move.
   */
  _processHolding(unit, dt, gameState) {
    const C = SC.CONST;
    const unitData = SC.UNIT_DATA ? SC.UNIT_DATA[unit.subType] : null;
    if (!unitData || !unitData.canAttack) return;

    const range = unitData.attackRange;

    // Check current target
    const target = unit.attackTarget ? gameState.entities[unit.attackTarget] : null;
    if (!target || !target.alive || unit.tileDistanceTo(target) > range) {
      // Find new target in range
      const newTarget = this.findTarget(unit, gameState, range);
      if (newTarget) {
        unit.attackTarget = newTarget.id;
        unit.attackTimer = 0;
      } else {
        unit.attackTarget = null;
        return;
      }
    }

    const currentTarget = gameState.entities[unit.attackTarget];
    if (!currentTarget || !currentTarget.alive) return;

    // Check flying
    if (currentTarget.isFlying && !unitData.canAttackAir) {
      unit.attackTarget = null;
      return;
    }

    if (unit.attackTimer === undefined || unit.attackTimer === null) {
      unit.attackTimer = 0;
    }
    unit.attackTimer -= dt;

    if (unit.attackTimer <= 0) {
      this._fireAttack(unit, currentTarget, unitData, gameState);
      unit.attackTimer = unitData.attackCooldown;
    }

    unit.angle = Math.atan2(currentTarget.y - unit.y, currentTarget.x - unit.x);
  },

  /**
   * Process siege tank in SIEGE_MODE.
   */
  _processSiegeMode(unit, dt, gameState) {
    const C = SC.CONST;
    const unitData = SC.UNIT_DATA ? SC.UNIT_DATA[unit.subType] : null;
    if (!unitData) return;

    const siegeRange = unitData.siegeRange || 12;
    const siegeMinRange = unitData.siegeMinRange || 2;

    // Check current target
    const target = unit.attackTarget ? gameState.entities[unit.attackTarget] : null;
    if (!target || !target.alive) {
      // Find new target within siege range but outside min range
      const newTarget = this._findSiegeTarget(unit, gameState, siegeRange, siegeMinRange);
      if (newTarget) {
        unit.attackTarget = newTarget.id;
        unit.attackTimer = 0;
      } else {
        unit.attackTarget = null;
        return;
      }
    }

    const currentTarget = gameState.entities[unit.attackTarget];
    if (!currentTarget || !currentTarget.alive) {
      unit.attackTarget = null;
      return;
    }

    // Flying check - siege tanks can't attack air
    if (currentTarget.isFlying) {
      unit.attackTarget = null;
      return;
    }

    const distTiles = unit.tileDistanceTo(currentTarget);

    // Out of siege range or too close
    if (distTiles > siegeRange || distTiles < siegeMinRange) {
      const newTarget = this._findSiegeTarget(unit, gameState, siegeRange, siegeMinRange);
      if (newTarget) {
        unit.attackTarget = newTarget.id;
        unit.attackTimer = 0;
      } else {
        unit.attackTarget = null;
      }
      return;
    }

    if (unit.attackTimer === undefined || unit.attackTimer === null) {
      unit.attackTimer = 0;
    }
    unit.attackTimer -= dt;

    if (unit.attackTimer <= 0) {
      // Siege fire - splash damage
      const damage = unitData.siegeDamage || 70;
      this._createProjectile(unit, currentTarget, damage, true, gameState);
      unit.attackTimer = unitData.siegeCooldown || 3.0;
    }

    unit.angle = Math.atan2(currentTarget.y - unit.y, currentTarget.x - unit.x);
  },

  /**
   * Process medic healing.
   */
  _processHealing(unit, dt, gameState) {
    const C = SC.CONST;
    const unitData = SC.UNIT_DATA ? SC.UNIT_DATA[unit.subType] : null;
    if (!unitData || !unitData.isHealer) return;

    const healRange = unitData.healRange || 2;
    const healRate = unitData.healRate || 7;

    // Find heal target
    const healTarget = unit.healTarget ? gameState.entities[unit.healTarget] : null;

    if (!healTarget || !healTarget.alive || healTarget.hp >= healTarget.maxHp) {
      // Find a new wounded friendly
      const wounded = this._findWoundedFriendly(unit, gameState, healRange);
      if (wounded) {
        unit.healTarget = wounded.id;
      } else {
        // No wounded nearby - follow nearest combat unit
        unit.state = C.UNIT_STATE.IDLE;
        unit.healTarget = null;
        this._medicFollowCombat(unit, dt, gameState);
        return;
      }
    }

    const target = gameState.entities[unit.healTarget];
    if (!target || !target.alive || target.hp >= target.maxHp) {
      unit.state = C.UNIT_STATE.IDLE;
      unit.healTarget = null;
      return;
    }

    const distTiles = unit.tileDistanceTo(target);
    if (distTiles > healRange) {
      // Move toward wounded ally
      this._moveToward(unit, target.x, target.y, dt, unitData);
    } else {
      // Heal
      target.hp = Math.min(target.maxHp, target.hp + healRate * dt);
      unit.angle = Math.atan2(target.y - unit.y, target.x - unit.x);
    }
  },

  /**
   * Auto-aggro: idle units attack nearby enemies.
   */
  _processAutoAggro(unit, dt, gameState) {
    const C = SC.CONST;
    const unitData = SC.UNIT_DATA ? SC.UNIT_DATA[unit.subType] : null;
    if (!unitData) return;

    // Workers don't auto-aggro unless they're specifically military
    if (unitData.isWorker) return;

    // Healers don't auto-aggro, they auto-heal
    if (unitData.isHealer) return;

    if (!unitData.canAttack) return;

    // Find nearest enemy within sight range
    const target = this.findTarget(unit, gameState, unit.sightRange);
    if (target) {
      unit.state = C.UNIT_STATE.ATTACKING;
      unit.attackTarget = target.id;
      unit.attackTimer = 0;
    }
  },

  /**
   * Process attack-move units: move toward destination, attack enemies in sight.
   */
  _processAttackMoveUnits(dt, gameState) {
    const C = SC.CONST;
    const entities = gameState.entities;

    for (let i = 0; i < gameState.units.length; i++) {
      const unitId = gameState.units[i];
      const unit = entities[unitId];
      if (!unit || !unit.alive) continue;

      // Skip units that aren't in a combat-movement hybrid
      if (unit.attackMoveTarget === undefined || unit.attackMoveTarget === null) continue;
      // Only process if the unit is currently in attack-move mode
      if (unit.state !== C.UNIT_STATE.MOVING && unit.state !== C.UNIT_STATE.ATTACKING) continue;
      if (!unit._isAttackMoving) continue;

      const unitData = SC.UNIT_DATA ? SC.UNIT_DATA[unit.subType] : null;
      if (!unitData || !unitData.canAttack) continue;

      // If currently attacking a target, continue that fight
      if (unit.state === C.UNIT_STATE.ATTACKING && unit.attackTarget) {
        const target = entities[unit.attackTarget];
        if (target && target.alive) {
          // Let normal attacking logic handle it
          continue;
        }
        // Target dead, resume move
      }

      // Scan for enemies while moving
      const enemy = this.findTarget(unit, gameState, unit.sightRange);
      if (enemy) {
        unit.state = C.UNIT_STATE.ATTACKING;
        unit.attackTarget = enemy.id;
        unit.attackTimer = 0;
      } else {
        // No enemy - keep moving toward attack-move destination
        if (unit.attackMoveTarget) {
          const destX = unit.attackMoveTarget.x;
          const destY = unit.attackMoveTarget.y;
          const dx = destX - unit.x;
          const dy = destY - unit.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < SC.CONST.TILE_SIZE) {
            // Reached destination
            unit.state = C.UNIT_STATE.IDLE;
            unit._isAttackMoving = false;
            unit.attackMoveTarget = null;
          } else {
            unit.state = C.UNIT_STATE.MOVING;
            this._moveToward(unit, destX, destY, dt, unitData);
          }
        }
      }
    }
  },

  /**
   * Process buildings that can attack (missile turrets).
   */
  _processBuildingAttacks(dt, gameState) {
    const C = SC.CONST;
    const entities = gameState.entities;

    for (let i = 0; i < gameState.buildings.length; i++) {
      const buildingId = gameState.buildings[i];
      const building = entities[buildingId];
      if (!building || !building.alive) continue;
      if (building.state !== C.BUILDING_STATE.ACTIVE) continue;

      const bData = SC.BUILDING_DATA ? SC.BUILDING_DATA[building.subType] : null;
      if (!bData || !bData.canAttack) continue;

      const range = bData.attackRange || 7;

      // Check current target
      const target = building.attackTarget ? entities[building.attackTarget] : null;
      if (!target || !target.alive || building.tileDistanceTo(target) > range) {
        // Find new target - missile turrets attack air units primarily
        const newTarget = this._findBuildingTarget(building, gameState, range, bData);
        if (newTarget) {
          building.attackTarget = newTarget.id;
          if (building.attackTimer === undefined) building.attackTimer = 0;
        } else {
          building.attackTarget = null;
          continue;
        }
      }

      const currentTarget = entities[building.attackTarget];
      if (!currentTarget || !currentTarget.alive) continue;

      if (building.attackTimer === undefined || building.attackTimer === null) {
        building.attackTimer = 0;
      }
      building.attackTimer -= dt;

      if (building.attackTimer <= 0) {
        const damage = bData.attackDamage || 20;
        this._createProjectile(building, currentTarget, damage, false, gameState);
        building.attackTimer = bData.attackCooldown || 1.5;
      }
    }
  },

  /**
   * Process medic auto-heal: idle medics look for wounded friendlies.
   */
  _processMedicAutoHeal(dt, gameState) {
    const C = SC.CONST;
    const entities = gameState.entities;

    for (let i = 0; i < gameState.units.length; i++) {
      const unitId = gameState.units[i];
      const unit = entities[unitId];
      if (!unit || !unit.alive) continue;
      if (unit.state !== C.UNIT_STATE.IDLE) continue;

      const unitData = SC.UNIT_DATA ? SC.UNIT_DATA[unit.subType] : null;
      if (!unitData || !unitData.isHealer) continue;

      const healRange = unitData.healRange || 2;
      const wounded = this._findWoundedFriendly(unit, gameState, unit.sightRange);
      if (wounded) {
        unit.state = C.UNIT_STATE.HEALING;
        unit.healTarget = wounded.id;
      } else {
        // Follow nearest combat unit
        this._medicFollowCombat(unit, dt, gameState);
      }
    }
  },

  // ===========================
  // Combat Actions
  // ===========================

  /**
   * Fire an attack from attacker to target.
   */
  _fireAttack(attacker, target, unitData, gameState) {
    const range = unitData.attackRange;
    const damage = unitData.damage || 0;

    if (range <= 1) {
      // Melee attack - instant damage
      this._dealDamage(target, damage, attacker, gameState);
    } else {
      // Ranged attack - create projectile
      const hasSplash = (unitData.splashRadius && unitData.splashRadius > 0);
      this._createProjectile(attacker, target, damage, hasSplash, gameState);
    }
  },

  /**
   * Deal damage to a target entity.
   */
  _dealDamage(target, rawDamage, source, gameState) {
    if (!target || !target.alive) return;

    const actualDamage = this.calculateDamage(rawDamage, target.armor || 0);
    const result = target.takeDamage(actualDamage);

    // Emit damage event
    if (SC.EventBus) {
      SC.EventBus.emit(SC.CONST.EVENT.ENTITY_DAMAGED, {
        entityId: target.id,
        damage: result.actualDamage,
        sourceId: source ? source.id : null,
        died: result.died,
      });
    }

    if (result.died) {
      this._handleDeath(target, gameState);
    }
  },

  /**
   * Handle entity death: mark dead, emit event, remove from lists.
   */
  _handleDeath(entity, gameState) {
    entity.alive = false;

    if (entity.type === 'unit') {
      entity.state = SC.CONST.UNIT_STATE.DEAD;
    } else if (entity.type === 'building') {
      entity.state = SC.CONST.BUILDING_STATE.DESTROYED;
    }

    if (SC.EventBus) {
      SC.EventBus.emit(SC.CONST.EVENT.ENTITY_DESTROYED, {
        entityId: entity.id,
        entityType: entity.type,
        subType: entity.subType,
        owner: entity.owner,
        x: entity.x,
        y: entity.y,
      });
    }
  },

  // ===========================
  // Projectile System
  // ===========================

  /**
   * Create a projectile from source to target.
   */
  _createProjectile(source, target, damage, isSplash, gameState) {
    const proj = {
      id: window.SC._nextEntityId++,
      type: 'projectile',
      x: source.x,
      y: source.y,
      targetId: target.id,
      targetX: target.x,
      targetY: target.y,
      damage: damage,
      isSplash: isSplash || false,
      splashRadius: isSplash ? (SC.UNIT_DATA && SC.UNIT_DATA[source.subType]
        ? SC.UNIT_DATA[source.subType].splashRadius || 2 : 2) : 0,
      sourceOwner: source.owner,
      alive: true,
      speed: this._projectileSpeed,
    };

    this._projectiles.push(proj);

    // Also add to gameState.entities so renderer can draw it
    gameState.entities[proj.id] = proj;
    // Give it a getTilePos method for renderer compatibility
    proj.getTilePos = function () {
      return {
        tileX: Math.floor(this.x / SC.CONST.TILE_SIZE),
        tileY: Math.floor(this.y / SC.CONST.TILE_SIZE),
      };
    };
    proj.getColor = function () { return '#ffffff'; };
    proj.distanceTo = function (other) {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      return Math.sqrt(dx * dx + dy * dy);
    };
    proj.tileDistanceTo = function (other) {
      return this.distanceTo(other) / SC.CONST.TILE_SIZE;
    };
  },

  /**
   * Update all projectiles: move toward target, deal damage on arrival.
   */
  _updateProjectiles(dt, gameState) {
    const toRemove = [];

    for (let i = 0; i < this._projectiles.length; i++) {
      const proj = this._projectiles[i];
      if (!proj.alive) {
        toRemove.push(i);
        continue;
      }

      // Update target position if target still alive (homing)
      const target = gameState.entities[proj.targetId];
      if (target && target.alive) {
        proj.targetX = target.x;
        proj.targetY = target.y;
      }

      // Move toward target position
      const dx = proj.targetX - proj.x;
      const dy = proj.targetY - proj.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= proj.speed * dt) {
        // Arrived at target
        proj.x = proj.targetX;
        proj.y = proj.targetY;

        if (proj.isSplash) {
          // Splash damage at arrival point
          this.applySplash(proj.x, proj.y, proj.splashRadius, proj.damage, proj.sourceOwner, gameState);
        } else {
          // Direct damage to target
          if (target && target.alive) {
            this._dealDamage(target, proj.damage, null, gameState);
          }
        }

        proj.alive = false;
        toRemove.push(i);

        // Remove from gameState.entities
        delete gameState.entities[proj.id];
      } else {
        // Move toward target
        const speed = proj.speed * dt;
        proj.x += (dx / dist) * speed;
        proj.y += (dy / dist) * speed;
      }
    }

    // Remove dead projectiles (iterate in reverse to preserve indices)
    for (let i = toRemove.length - 1; i >= 0; i--) {
      const idx = toRemove[i];
      const proj = this._projectiles[idx];
      // Clean up from entities if not already removed
      if (proj && gameState.entities[proj.id]) {
        delete gameState.entities[proj.id];
      }
      this._projectiles.splice(idx, 1);
    }
  },

  // ===========================
  // Targeting
  // ===========================

  /**
   * Find nearest enemy within range (in tiles).
   * For ground units that can't attack air: skip flying enemies.
   * For units that canAttackAir: include flying enemies.
   * Only target entities visible through fog (for human player) or always (for AI).
   * @param {object} entity - the searching entity
   * @param {object} gameState
   * @param {number} range - in tiles
   * @returns {object|null} nearest enemy Entity or null
   */
  findTarget(entity, gameState, range) {
    const C = SC.CONST;
    const entities = gameState.entities;
    const unitData = SC.UNIT_DATA ? SC.UNIT_DATA[entity.subType] : null;
    const canAttackAir = unitData ? unitData.canAttackAir : false;

    let nearest = null;
    let nearestDist = Infinity;
    const rangePixels = range * C.TILE_SIZE;

    for (const id in entities) {
      const other = entities[id];
      if (!other || !other.alive) continue;
      if (other.type === 'projectile' || other.type === 'resource') continue;
      if (!entity.isEnemy(other)) continue;

      // Flying check: skip flying if we can't attack air
      if (other.isFlying && !canAttackAir) continue;

      // Fog visibility check for human player
      if (entity.owner === C.PLAYER.HUMAN && gameState.fog) {
        if (!gameState.fog.isVisible(other.x, other.y)) continue;
      }

      const dx = entity.x - other.x;
      const dy = entity.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= rangePixels && dist < nearestDist) {
        nearest = other;
        nearestDist = dist;
      }
    }

    return nearest;
  },

  /**
   * Find a target for siege tank (within siege range but outside min range).
   */
  _findSiegeTarget(unit, gameState, siegeRange, siegeMinRange) {
    const C = SC.CONST;
    const entities = gameState.entities;

    let nearest = null;
    let nearestDist = Infinity;
    const maxPixels = siegeRange * C.TILE_SIZE;
    const minPixels = siegeMinRange * C.TILE_SIZE;

    for (const id in entities) {
      const other = entities[id];
      if (!other || !other.alive) continue;
      if (other.type === 'projectile' || other.type === 'resource') continue;
      if (!unit.isEnemy(other)) continue;
      if (other.isFlying) continue; // Siege tanks can't attack air

      // Fog check for human player
      if (unit.owner === C.PLAYER.HUMAN && gameState.fog) {
        if (!gameState.fog.isVisible(other.x, other.y)) continue;
      }

      const dx = unit.x - other.x;
      const dy = unit.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= maxPixels && dist >= minPixels && dist < nearestDist) {
        nearest = other;
        nearestDist = dist;
      }
    }

    return nearest;
  },

  /**
   * Find target for buildings (missile turret targets air units only).
   */
  _findBuildingTarget(building, gameState, range, bData) {
    const C = SC.CONST;
    const entities = gameState.entities;
    const rangePixels = range * C.TILE_SIZE;

    let nearest = null;
    let nearestDist = Infinity;

    for (const id in entities) {
      const other = entities[id];
      if (!other || !other.alive) continue;
      if (other.type === 'projectile' || other.type === 'resource') continue;
      if (!building.isEnemy(other)) continue;

      // Missile turrets can attack both air and ground based on data
      // but primarily designed for air defense
      if (!bData.canAttackAir && other.isFlying) continue;

      const dx = building.x - other.x;
      const dy = building.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= rangePixels && dist < nearestDist) {
        nearest = other;
        nearestDist = dist;
      }
    }

    return nearest;
  },

  /**
   * Find the nearest wounded friendly unit.
   */
  _findWoundedFriendly(unit, gameState, range) {
    const C = SC.CONST;
    const entities = gameState.entities;
    const rangePixels = range * C.TILE_SIZE;

    let nearest = null;
    let nearestDist = Infinity;

    for (const id in entities) {
      const other = entities[id];
      if (!other || !other.alive) continue;
      if (other.type !== 'unit') continue;
      if (other.owner !== unit.owner) continue;
      if (other.id === unit.id) continue;
      if (other.hp >= other.maxHp) continue;

      // Skip other medics
      const otherData = SC.UNIT_DATA ? SC.UNIT_DATA[other.subType] : null;
      if (otherData && otherData.isHealer) continue;

      const dx = unit.x - other.x;
      const dy = unit.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= rangePixels && dist < nearestDist) {
        nearest = other;
        nearestDist = dist;
      }
    }

    return nearest;
  },

  /**
   * Medic follows the nearest combat unit when no one needs healing.
   */
  _medicFollowCombat(medic, dt, gameState) {
    const entities = gameState.entities;
    let nearest = null;
    let nearestDist = Infinity;

    for (const id in entities) {
      const other = entities[id];
      if (!other || !other.alive) continue;
      if (other.type !== 'unit') continue;
      if (other.owner !== medic.owner) continue;
      if (other.id === medic.id) continue;

      const otherData = SC.UNIT_DATA ? SC.UNIT_DATA[other.subType] : null;
      if (!otherData || otherData.isWorker || otherData.isHealer) continue;

      const dx = medic.x - other.x;
      const dy = medic.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < nearestDist) {
        nearest = other;
        nearestDist = dist;
      }
    }

    if (nearest && nearestDist > SC.CONST.TILE_SIZE * 3) {
      const medicData = SC.UNIT_DATA ? SC.UNIT_DATA[medic.subType] : null;
      if (medicData) {
        this._moveToward(medic, nearest.x, nearest.y, dt, medicData);
      }
    }
  },

  // ===========================
  // Movement Helpers
  // ===========================

  /**
   * Move a unit toward a world position.
   */
  _moveToward(unit, targetX, targetY, dt, unitData) {
    const speed = (unitData.speed || 2.5) * SC.CONST.TILE_SIZE; // tiles/s -> pixels/s
    const dx = targetX - unit.x;
    const dy = targetY - unit.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= 1) return;

    const moveAmount = Math.min(speed * dt, dist);
    unit.x += (dx / dist) * moveAmount;
    unit.y += (dy / dist) * moveAmount;
    unit.angle = Math.atan2(dy, dx);
  },

  // ===========================
  // Public API
  // ===========================

  /**
   * Calculate actual damage after armor.
   * @param {number} rawDamage
   * @param {number} targetArmor
   * @returns {number} at least 1
   */
  calculateDamage(rawDamage, targetArmor) {
    return Math.max(1, rawDamage - targetArmor);
  },

  /**
   * Apply splash damage around a world point.
   * Damage decreases with distance: full at center, 50% at edge.
   * Don't damage own units.
   * @param {number} worldX
   * @param {number} worldY
   * @param {number} radius - in tiles
   * @param {number} damage - raw damage at center
   * @param {number} sourceOwner - player ID of the attacker
   * @param {object} gameState
   */
  applySplash(worldX, worldY, radius, damage, sourceOwner, gameState) {
    const C = SC.CONST;
    const entities = gameState.entities;
    const radiusPixels = radius * C.TILE_SIZE;

    for (const id in entities) {
      const entity = entities[id];
      if (!entity || !entity.alive) continue;
      if (entity.type === 'projectile' || entity.type === 'resource') continue;
      if (entity.owner === sourceOwner) continue; // Don't damage own units

      const dx = worldX - entity.x;
      const dy = worldY - entity.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radiusPixels) {
        // Damage falloff: 100% at center, 50% at edge
        const falloff = 1.0 - (dist / radiusPixels) * 0.5;
        const splashDamage = Math.round(damage * falloff);
        this._dealDamage(entity, splashDamage, null, gameState);
      }
    }
  },
};
