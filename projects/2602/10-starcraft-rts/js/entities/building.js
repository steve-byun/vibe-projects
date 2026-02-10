// === StarCraft RTS Clone - Building Class ===
// Extends SC.Entity. Handles construction progress, training queue, defensive attacks.
// Exposed at window.SC.Building

window.SC = window.SC || {};

window.SC.Building = class Building extends SC.Entity {
  constructor(config) {
    const data = SC.BUILDING_DATA[config.subType];
    if (!data) {
      throw new Error('Unknown building subType: ' + config.subType);
    }

    super({
      ...config,
      type: 'building',
      maxHp: data.maxHp,
      armor: data.armor,
      sightRange: data.sightRange,
    });

    this.name = data.name;
    this.tileX = config.tileX;
    this.tileY = config.tileY;
    this.size = { w: data.size.w, h: data.size.h };

    // Set world position to center of building footprint
    const TILE = SC.CONST.TILE_SIZE;
    this.x = config.x || (this.tileX * TILE + (this.size.w * TILE) / 2);
    this.y = config.y || (this.tileY * TILE + (this.size.h * TILE) / 2);

    // Construction
    this.state = config.startActive
      ? SC.CONST.BUILDING_STATE.ACTIVE
      : SC.CONST.BUILDING_STATE.CONSTRUCTING;
    this.constructionProgress = config.startActive ? 1.0 : 0.0;
    this.constructionTime = data.buildTime;

    // If starting active, HP is full; if constructing, HP starts at 10%
    if (!config.startActive) {
      this.hp = Math.floor(this.maxHp * 0.1);
    }

    // Supply
    this.supplyProvided = data.supplyProvided || 0;

    // Resource dropoff
    this.isResourceDropoff = data.isResourceDropoff || false;
    this.isGasBuilding = data.isGasBuilding || false;

    // Training
    this.canTrain = data.canTrain ? data.canTrain.slice() : [];
    this.trainQueue = [];         // Array of unitSubType strings
    this.trainProgress = 0;       // 0.0 to buildTime of current training unit

    // Rally point
    this.rallyPoint = null;       // { x, y } in world pixels

    // Defensive buildings (missile turret)
    this.canAttack = data.canAttack || false;
    this.canAttackAir = data.canAttackAir || false;
    this.attackRange = data.attackRange || 0;
    this.attackCooldown = data.attackCooldown || 0;
    this.attackDamage = data.attackDamage || 0;
    this.attackTimer = 0;
    this.targetEntity = null;     // entity ID of current attack target

    // Bunker garrison
    this.garrisonCapacity = data.garrisonCapacity || 0;
    this.garrisonedUnits = [];    // Array of unit entity IDs

    // Drawing
    this.drawColor = data.drawColor || '#888888';
  }

  /**
   * Main update. Called every frame.
   * @param {number} dt - delta time in seconds
   * @param {object} gameState - global game state
   */
  update(dt, gameState) {
    if (!this.alive) return;

    const BS = SC.CONST.BUILDING_STATE;

    switch (this.state) {
      case BS.CONSTRUCTING:
        // Construction progress is advanced by the Production system
        // when an SCV is building this. We just check for completion here.
        if (this.constructionProgress >= 1.0) {
          this._completeConstruction();
        }
        break;

      case BS.ACTIVE:
        // Process training queue
        this._updateTrainingQueue(dt, gameState);

        // Defensive attack (missile turret)
        if (this.canAttack) {
          this._updateDefensiveAttack(dt, gameState);
        }
        break;

      case BS.DESTROYED:
        // Do nothing
        break;
    }
  }

  /**
   * Complete construction: transition to ACTIVE, restore full HP.
   */
  _completeConstruction() {
    this.state = SC.CONST.BUILDING_STATE.ACTIVE;
    this.constructionProgress = 1.0;
    this.hp = this.maxHp;

    if (SC.EventBus) {
      SC.EventBus.emit(SC.CONST.EVENT.BUILDING_COMPLETE, {
        entityId: this.id,
        subType: this.subType,
        owner: this.owner,
      });
      SC.EventBus.emit(SC.CONST.EVENT.SUPPLY_CHANGED, { owner: this.owner });
    }
  }

  /**
   * Update the training queue. Progress the current item.
   * @param {number} dt
   * @param {object} gameState
   */
  _updateTrainingQueue(dt, gameState) {
    if (this.trainQueue.length === 0) return;

    const currentUnit = this.trainQueue[0];
    const unitData = SC.UNIT_DATA ? SC.UNIT_DATA[currentUnit] : null;
    if (!unitData) return;

    this.trainProgress += dt;

    if (this.trainProgress >= unitData.buildTime) {
      // Training complete - spawn unit
      this.trainProgress = 0;
      this.trainQueue.shift();

      this._spawnTrainedUnit(currentUnit, gameState);
    }
  }

  /**
   * Spawn a trained unit near the building.
   * @param {string} unitSubType
   * @param {object} gameState
   */
  _spawnTrainedUnit(unitSubType, gameState) {
    if (!SC.Unit || !gameState || !gameState.entities) return;

    // Spawn position: just outside the building footprint
    const TILE = SC.CONST.TILE_SIZE;
    let spawnX = this.x;
    let spawnY = this.y + (this.size.h * TILE) / 2 + TILE / 2;

    // If there's a rally point, use spawn position near building edge toward rally
    if (this.rallyPoint) {
      const dx = this.rallyPoint.x - this.x;
      const dy = this.rallyPoint.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        const nx = dx / dist;
        const ny = dy / dist;
        spawnX = this.x + nx * (this.size.w * TILE / 2 + TILE / 2);
        spawnY = this.y + ny * (this.size.h * TILE / 2 + TILE / 2);
      }
    }

    const unit = new SC.Unit({
      subType: unitSubType,
      owner: this.owner,
      x: spawnX,
      y: spawnY,
    });

    gameState.entities.push(unit);

    if (SC.EventBus) {
      SC.EventBus.emit(SC.CONST.EVENT.ENTITY_CREATED, { entity: unit });
      SC.EventBus.emit(SC.CONST.EVENT.TRAINING_COMPLETE, {
        buildingId: this.id,
        unitId: unit.id,
        unitSubType: unitSubType,
        owner: this.owner,
      });
      SC.EventBus.emit(SC.CONST.EVENT.SUPPLY_CHANGED, { owner: this.owner });
    }

    // If rally point set, issue move order
    if (this.rallyPoint) {
      unit.issueOrder({
        command: SC.CONST.COMMAND.MOVE,
        targetX: this.rallyPoint.x,
        targetY: this.rallyPoint.y,
        shift: false,
      });
    }
  }

  /**
   * Start training a unit. Checks if this building can train it.
   * @param {string} unitSubType
   * @returns {{ success: boolean, reason: string }}
   */
  startTraining(unitSubType) {
    if (this.state !== SC.CONST.BUILDING_STATE.ACTIVE) {
      return { success: false, reason: 'Building not active' };
    }

    if (this.canTrain.indexOf(unitSubType) === -1) {
      return { success: false, reason: 'Cannot train ' + unitSubType + ' here' };
    }

    // Max queue size of 5
    if (this.trainQueue.length >= 5) {
      return { success: false, reason: 'Training queue full' };
    }

    this.trainQueue.push(unitSubType);

    if (SC.EventBus) {
      SC.EventBus.emit(SC.CONST.EVENT.TRAINING_START, {
        buildingId: this.id,
        unitSubType: unitSubType,
        owner: this.owner,
      });
    }

    return { success: true, reason: '' };
  }

  /**
   * Cancel a training item at the given queue index.
   * Refunds cost (handled by Production system).
   * @param {number} index
   */
  cancelTraining(index) {
    if (index < 0 || index >= this.trainQueue.length) return;

    const cancelled = this.trainQueue[index];

    // If cancelling the current (first) item, reset progress
    if (index === 0) {
      this.trainProgress = 0;
    }

    this.trainQueue.splice(index, 1);

    // Refund is handled by Production system externally
    return cancelled;
  }

  /**
   * Update defensive attack (missile turret).
   */
  _updateDefensiveAttack(dt, gameState) {
    if (this.attackTimer > 0) {
      this.attackTimer -= dt;
    }

    // Find or verify target
    let target = null;
    if (this.targetEntity !== null) {
      target = this._getEntity(this.targetEntity, gameState);
      if (!target || !target.alive) {
        this.targetEntity = null;
        target = null;
      }
    }

    // Find new target if none
    if (!target) {
      target = this._findNearbyEnemy(gameState);
      if (target) {
        this.targetEntity = target.id;
      }
    }

    if (!target) return;

    // Check range
    const dist = this.tileDistanceTo(target);
    if (dist > this.attackRange) {
      this.targetEntity = null;
      return;
    }

    // Fire
    if (this.attackTimer <= 0) {
      this._fireAt(target, gameState);
      this.attackTimer = this.attackCooldown;
    }
  }

  /**
   * Find nearest enemy in attack range.
   */
  _findNearbyEnemy(gameState) {
    if (!gameState || !gameState.entities) return null;

    let closest = null;
    let closestDist = Infinity;

    for (const entity of gameState.entities) {
      if (!entity.alive) continue;
      if (!this.isEnemy(entity)) continue;
      if (entity.type === 'projectile') continue;

      // Missile turret: only attacks air (and ground if configured)
      if (this.canAttackAir && entity.isFlying) {
        // Can attack this
      } else if (!entity.isFlying && this.canAttack) {
        // Can attack ground
      } else {
        continue;
      }

      const dist = this.tileDistanceTo(entity);
      if (dist <= this.attackRange && dist < closestDist) {
        closestDist = dist;
        closest = entity;
      }
    }
    return closest;
  }

  /**
   * Fire at a target.
   */
  _fireAt(target, gameState) {
    if (SC.Projectile && gameState && gameState.entities) {
      const proj = new SC.Projectile({
        x: this.x,
        y: this.y,
        owner: this.owner,
        subType: 'projectile',
        targetId: target.id,
        targetX: target.x,
        targetY: target.y,
        damage: this.attackDamage,
        speed: 10,
        splashRadius: 0,
        sourceOwner: this.owner,
      });
      gameState.entities.push(proj);
      if (SC.EventBus) {
        SC.EventBus.emit(SC.CONST.EVENT.ENTITY_CREATED, { entity: proj });
      }
    } else {
      // Direct damage fallback
      const result = target.takeDamage(this.attackDamage);
      if (SC.EventBus) {
        SC.EventBus.emit(SC.CONST.EVENT.ENTITY_DAMAGED, {
          targetId: target.id,
          damage: result.actualDamage,
          attackerId: this.id,
        });
      }
      if (result.died) {
        if (SC.EventBus) {
          SC.EventBus.emit(SC.CONST.EVENT.ENTITY_DESTROYED, { entity: target, killerId: this.id });
        }
      }
    }
  }

  /**
   * Get entity by ID from gameState.
   */
  _getEntity(entityId, gameState) {
    if (!gameState || !gameState.entities) return null;
    return gameState.entities.find(e => e.id === entityId) || null;
  }

  // ============ DRAWING ============

  /**
   * Draw the building on the canvas.
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} camera - SC.Camera
   */
  draw(ctx, camera) {
    if (!this.alive) return;

    const TILE = SC.CONST.TILE_SIZE;
    const topLeftWorld = {
      x: this.tileX * TILE,
      y: this.tileY * TILE,
    };
    const screen = camera.worldToScreen(topLeftWorld.x, topLeftWorld.y);
    const w = this.size.w * TILE * camera.zoom;
    const h = this.size.h * TILE * camera.zoom;

    // Building fill
    ctx.fillStyle = this.drawColor;

    if (this.state === SC.CONST.BUILDING_STATE.CONSTRUCTING) {
      // Semi-transparent while constructing
      ctx.globalAlpha = 0.4 + 0.6 * this.constructionProgress;
    }

    ctx.fillRect(screen.x, screen.y, w, h);

    // Building outline
    ctx.strokeStyle = this.getColor();
    ctx.lineWidth = 2;
    ctx.strokeRect(screen.x, screen.y, w, h);
    ctx.lineWidth = 1;

    // Reset alpha
    ctx.globalAlpha = 1.0;

    // Draw construction progress bar
    if (this.state === SC.CONST.BUILDING_STATE.CONSTRUCTING) {
      const barY = screen.y + h + 2;
      const barW = w;
      const barH = 4;

      ctx.fillStyle = SC.CONST.COLORS.HP_BAR_BG;
      ctx.fillRect(screen.x, barY, barW, barH);

      ctx.fillStyle = SC.CONST.COLORS.BUILD_PROGRESS;
      ctx.fillRect(screen.x, barY, barW * this.constructionProgress, barH);
    }

    // Draw HP bar (only when damaged)
    if (this.hp < this.maxHp && this.state !== SC.CONST.BUILDING_STATE.CONSTRUCTING) {
      const centerScreen = camera.worldToScreen(this.x, this.y);
      const barWidth = w * 0.8;
      const barHeight = 3;
      const barX = centerScreen.x - barWidth / 2;
      const barY = screen.y - 6;

      ctx.fillStyle = SC.CONST.COLORS.HP_BAR_BG;
      ctx.fillRect(barX, barY, barWidth, barHeight);

      const hpRatio = this.hp / this.maxHp;
      const barColor = this.owner === SC.CONST.PLAYER.HUMAN
        ? (hpRatio > 0.5 ? SC.CONST.COLORS.HP_BAR_ALLY : SC.CONST.COLORS.HP_BAR_YELLOW)
        : SC.CONST.COLORS.HP_BAR_ENEMY;

      ctx.fillStyle = barColor;
      ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
    }

    // Draw training progress bar
    if (this.trainQueue.length > 0) {
      const unitData = SC.UNIT_DATA ? SC.UNIT_DATA[this.trainQueue[0]] : null;
      if (unitData) {
        const progress = this.trainProgress / unitData.buildTime;
        const barY2 = screen.y + h + (this.state === SC.CONST.BUILDING_STATE.CONSTRUCTING ? 8 : 2);
        const barW2 = w;
        const barH2 = 3;

        ctx.fillStyle = SC.CONST.COLORS.HP_BAR_BG;
        ctx.fillRect(screen.x, barY2, barW2, barH2);

        ctx.fillStyle = '#ffcc00';
        ctx.fillRect(screen.x, barY2, barW2 * progress, barH2);
      }
    }

    // Draw rally point line
    if (this.rallyPoint && this.state === SC.CONST.BUILDING_STATE.ACTIVE) {
      const rallyScreen = camera.worldToScreen(this.rallyPoint.x, this.rallyPoint.y);
      ctx.strokeStyle = SC.CONST.COLORS.RALLY_LINE;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(screen.x + w / 2, screen.y + h / 2);
      ctx.lineTo(rallyScreen.x, rallyScreen.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Rally point marker
      ctx.fillStyle = SC.CONST.COLORS.RALLY_LINE;
      ctx.beginPath();
      ctx.arc(rallyScreen.x, rallyScreen.y, 4 * camera.zoom, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};
