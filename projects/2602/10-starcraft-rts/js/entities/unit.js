// === StarCraft RTS Clone - Unit Class ===
// Extends SC.Entity. Full state machine for movement, combat, harvesting, building, healing.
// Exposed at window.SC.Unit

window.SC = window.SC || {};

window.SC.Unit = class Unit extends SC.Entity {
  constructor(config) {
    super({ ...config, type: 'unit', maxHp: 0, armor: 0 });

    const data = SC.UNIT_DATA[config.subType];
    if (!data) {
      throw new Error('Unknown unit subType: ' + config.subType);
    }

    // Copy stats from data
    this.name = data.name;
    this.maxHp = data.maxHp;
    this.hp = data.maxHp;
    this.armor = data.armor;
    this.damage = data.damage;
    this.attackRange = data.attackRange;
    this.attackCooldown = data.attackCooldown;
    this.speed = data.speed;
    this.sightRange = data.sightRange;
    this.unitSize = data.size;
    this.isWorker = data.isWorker || false;
    this.canAttack = data.canAttack || false;
    this.canAttackAir = data.canAttackAir || false;
    this.isFlying = data.isFlying || false;
    this.isHealer = data.isHealer || false;

    // Siege tank specific
    this.siegeDamage = data.siegeDamage || 0;
    this.splashRadius = data.splashRadius || 0;
    this.siegeRange = data.siegeRange || 0;
    this.siegeMinRange = data.siegeMinRange || 0;
    this.siegeCooldown = data.siegeCooldown || 0;
    this.siegeDeployTime = data.siegeDeployTime || 0;

    // Medic specific
    this.healRate = data.healRate || 0;
    this.healRange = data.healRange || 0;

    // Drawing
    this.drawShape = data.drawShape || 'circle';
    this.drawRadius = data.drawRadius || 8;
    this.drawColor = data.drawColor;

    // State machine
    this.state = SC.CONST.UNIT_STATE.IDLE;
    this.orderQueue = [];       // Array of { command, targetX, targetY, targetId, buildingType, shift }

    // Movement
    this.path = [];             // Array of {x,y} world pixel waypoints
    this.pathIndex = 0;
    this.targetX = 0;
    this.targetY = 0;

    // Combat
    this.attackTimer = 0;
    this.targetEntity = null;   // entity ID of attack target

    // Harvesting (SCV)
    this.carryingMinerals = 0;
    this.carryingGas = 0;
    this.harvestTarget = null;  // entity ID
    this.harvestTimer = 0;

    // Building (SCV)
    this.buildTarget = null;    // entity ID of building being constructed

    // Siege Tank
    this.isSieged = false;
    this.siegeTimer = 0;

    // Patrol
    this.patrolStartX = 0;
    this.patrolStartY = 0;
    this.patrolEndX = 0;
    this.patrolEndY = 0;
    this.patrolToEnd = true;    // direction: true = going to end, false = going to start

    // Heal target (Medic)
    this.healTarget = null;     // entity ID
  }

  /**
   * Issue an order to this unit.
   * @param {{ command, targetX, targetY, targetId, buildingType, shift }} order
   * If shift=true, append to queue; otherwise, replace queue.
   */
  issueOrder(order) {
    if (this.state === SC.CONST.UNIT_STATE.DEAD) return;

    if (order.shift) {
      this.orderQueue.push(order);
    } else {
      this.orderQueue = [order];
      this._executeCurrentOrder();
    }
  }

  /**
   * Get the current order or null.
   */
  getCurrentOrder() {
    return this.orderQueue.length > 0 ? this.orderQueue[0] : null;
  }

  /**
   * Start executing the first order in the queue.
   */
  _executeCurrentOrder() {
    const order = this.getCurrentOrder();
    if (!order) {
      this._setState(SC.CONST.UNIT_STATE.IDLE);
      return;
    }

    const CMD = SC.CONST.COMMAND;
    const US = SC.CONST.UNIT_STATE;

    switch (order.command) {
      case CMD.MOVE:
        this.targetX = order.targetX;
        this.targetY = order.targetY;
        this._requestPath(order.targetX, order.targetY);
        this._setState(US.MOVING);
        break;

      case CMD.ATTACK:
        this.targetEntity = order.targetId || null;
        this.targetX = order.targetX || 0;
        this.targetY = order.targetY || 0;
        this._setState(US.ATTACKING);
        break;

      case CMD.ATTACK_MOVE:
        this.targetX = order.targetX;
        this.targetY = order.targetY;
        this._requestPath(order.targetX, order.targetY);
        this._setState(US.MOVING);
        // Mark that this is an attack-move so we scan for enemies during movement
        this._isAttackMove = true;
        break;

      case CMD.PATROL:
        this.patrolStartX = this.x;
        this.patrolStartY = this.y;
        this.patrolEndX = order.targetX;
        this.patrolEndY = order.targetY;
        this.patrolToEnd = true;
        this.targetX = order.targetX;
        this.targetY = order.targetY;
        this._requestPath(order.targetX, order.targetY);
        this._setState(US.PATROLLING);
        break;

      case CMD.HOLD:
        this.path = [];
        this._setState(US.HOLDING);
        break;

      case CMD.STOP:
        this.path = [];
        this.targetEntity = null;
        this._setState(US.IDLE);
        this.orderQueue = [];
        break;

      case CMD.GATHER:
        this.harvestTarget = order.targetId;
        this.targetX = order.targetX || 0;
        this.targetY = order.targetY || 0;
        if (this.carryingMinerals > 0 || this.carryingGas > 0) {
          // Return cargo first, then go harvest
          this._setState(US.RETURNING);
        } else {
          this._setState(US.HARVESTING);
        }
        break;

      case CMD.RETURN_CARGO:
        this._setState(US.RETURNING);
        break;

      case CMD.BUILD:
        this.targetX = order.targetX;
        this.targetY = order.targetY;
        this.buildTarget = order.targetId || null;
        this._requestPath(order.targetX, order.targetY);
        this._setState(US.BUILDING);
        break;

      case CMD.SIEGE:
        if (this.subType === 'siege_tank' && !this.isSieged) {
          this.siegeTimer = this.siegeDeployTime;
          this._setState(US.SIEGE_DEPLOYING);
        }
        break;

      case CMD.UNSIEGE:
        if (this.subType === 'siege_tank' && this.isSieged) {
          this.siegeTimer = this.siegeDeployTime;
          this._setState(US.SIEGE_UNDEPLOYING);
        }
        break;

      case CMD.HEAL:
        this.healTarget = order.targetId || null;
        this._setState(US.HEALING);
        break;

      default:
        this._setState(US.IDLE);
        break;
    }
  }

  /**
   * Request a path from pathfinding system.
   */
  _requestPath(targetX, targetY) {
    if (!SC.Pathfinding || !SC.Map) {
      // Fallback: direct path
      this.path = [{ x: targetX, y: targetY }];
      this.pathIndex = 0;
      return;
    }

    const TILE = SC.CONST.TILE_SIZE;
    const startTX = Math.floor(this.x / TILE);
    const startTY = Math.floor(this.y / TILE);
    const endTX = Math.floor(targetX / TILE);
    const endTY = Math.floor(targetY / TILE);

    this.path = SC.Pathfinding.findPath(startTX, startTY, endTX, endTY, SC.Map);
    this.pathIndex = 0;

    // If no path found, try direct movement
    if (this.path.length === 0) {
      this.path = [{ x: targetX, y: targetY }];
      this.pathIndex = 0;
    }
  }

  /**
   * Set unit state and emit state change event.
   */
  _setState(newState) {
    if (this.state === newState) return;
    const oldState = this.state;
    this.state = newState;

    // Reset attack-move flag when entering non-movement states
    if (newState !== SC.CONST.UNIT_STATE.MOVING) {
      this._isAttackMove = false;
    }

    if (SC.EventBus) {
      SC.EventBus.emit(SC.CONST.EVENT.UNIT_STATE_CHANGE, {
        entityId: this.id,
        oldState: oldState,
        newState: newState,
      });
    }
  }

  /**
   * Advance to the next order in the queue.
   */
  _nextOrder() {
    if (this.orderQueue.length > 0) {
      this.orderQueue.shift();
    }
    this._executeCurrentOrder();
  }

  /**
   * Main update. Called every frame.
   * @param {number} dt - delta time in seconds
   * @param {object} gameState - global game state
   */
  update(dt, gameState) {
    if (!this.alive) return;

    const US = SC.CONST.UNIT_STATE;

    // Decrement attack cooldown timer
    if (this.attackTimer > 0) {
      this.attackTimer -= dt;
    }

    switch (this.state) {
      case US.IDLE:
        this._updateIdle(dt, gameState);
        break;
      case US.MOVING:
        this._updateMoving(dt, gameState);
        break;
      case US.ATTACKING:
        this._updateAttacking(dt, gameState);
        break;
      case US.HARVESTING:
        this._updateHarvesting(dt, gameState);
        break;
      case US.RETURNING:
        this._updateReturning(dt, gameState);
        break;
      case US.BUILDING:
        this._updateBuilding(dt, gameState);
        break;
      case US.PATROLLING:
        this._updatePatrolling(dt, gameState);
        break;
      case US.HOLDING:
        this._updateHolding(dt, gameState);
        break;
      case US.SIEGE_DEPLOYING:
        this._updateSiegeDeploying(dt, gameState);
        break;
      case US.SIEGE_MODE:
        this._updateSiegeMode(dt, gameState);
        break;
      case US.SIEGE_UNDEPLOYING:
        this._updateSiegeUndeploying(dt, gameState);
        break;
      case US.HEALING:
        this._updateHealing(dt, gameState);
        break;
      case US.DEAD:
        // Do nothing
        break;
    }
  }

  // ============ STATE HANDLERS ============

  /**
   * IDLE: Look for auto-actions.
   * - SCV: if was harvesting, go back to resource
   * - Medic: auto-heal nearby wounded allies
   * - Combat units: attack enemies in sight (if auto-attack enabled)
   */
  _updateIdle(dt, gameState) {
    // Medic auto-heal
    if (this.isHealer) {
      const wounded = this._findNearbyWoundedAlly(gameState);
      if (wounded) {
        this.healTarget = wounded.id;
        this._setState(SC.CONST.UNIT_STATE.HEALING);
        return;
      }
    }

    // Auto-attack for combat units (not workers)
    if (this.canAttack && !this.isWorker) {
      const enemy = this._findNearbyEnemy(gameState, this.sightRange);
      if (enemy) {
        this.targetEntity = enemy.id;
        this._setState(SC.CONST.UNIT_STATE.ATTACKING);
        return;
      }
    }
  }

  /**
   * MOVING: Follow path waypoints. Arrive at end = IDLE or next order.
   */
  _updateMoving(dt, gameState) {
    // If attack-move, scan for enemies while moving
    if (this._isAttackMove && this.canAttack) {
      const enemy = this._findNearbyEnemy(gameState, this.sightRange);
      if (enemy) {
        this.targetEntity = enemy.id;
        this._setState(SC.CONST.UNIT_STATE.ATTACKING);
        return;
      }
    }

    const arrived = this._followPath(dt);
    if (arrived) {
      this._isAttackMove = false;
      this._nextOrder();
    }
  }

  /**
   * ATTACKING: Check range, move closer if out of range, fire when in range.
   */
  _updateAttacking(dt, gameState) {
    // Find target entity
    let target = null;
    if (this.targetEntity !== null) {
      target = this._getEntity(this.targetEntity, gameState);
    }

    // If target is dead or invalid, find a new one or go idle
    if (!target || !target.alive) {
      this.targetEntity = null;
      // Scan for new target
      const enemy = this._findNearbyEnemy(gameState, this.sightRange);
      if (enemy) {
        this.targetEntity = enemy.id;
        target = enemy;
      } else {
        this._nextOrder();
        return;
      }
    }

    // Check if we can attack this target (air vs ground)
    if (target.isFlying && !this.canAttackAir) {
      this.targetEntity = null;
      this._nextOrder();
      return;
    }

    const dist = this.tileDistanceTo(target);
    const range = this.isSieged ? this.siegeRange : this.attackRange;

    // Siege tank minimum range check
    if (this.isSieged && dist < this.siegeMinRange) {
      // Target too close for siege mode, can't fire
      return;
    }

    if (dist <= range) {
      // In range - fire
      if (this.attackTimer <= 0) {
        this._fireAt(target, gameState);
        this.attackTimer = this.isSieged ? this.siegeCooldown : this.attackCooldown;
      }
    } else {
      // Out of range - move closer (unless holding position or sieged)
      if (!this.isSieged) {
        this._moveToward(target.x, target.y, dt);
      }
    }
  }

  /**
   * HARVESTING: Timer ticks at resource. When done, transition to RETURNING.
   * Actual harvest logic delegated to SC.Harvesting system.
   */
  _updateHarvesting(dt, gameState) {
    // The Harvesting system handles the actual timer and state transitions.
    // Unit just needs to be in position. If not at resource, move to it.
    if (this.harvestTarget === null) {
      this._nextOrder();
      return;
    }

    const resource = this._getEntity(this.harvestTarget, gameState);
    if (!resource || !resource.alive) {
      this.harvestTarget = null;
      this._nextOrder();
      return;
    }

    // Move toward resource if not close enough
    const dist = this.distanceTo(resource);
    if (dist > SC.CONST.TILE_SIZE * 1.5) {
      this._moveToward(resource.x, resource.y, dt);
    }
    // The Harvesting system handles harvestTimer and state transitions
  }

  /**
   * RETURNING: Move to nearest dropoff. Deposit handled by Harvesting system.
   */
  _updateReturning(dt, gameState) {
    // The Harvesting system handles finding the dropoff and depositing.
    // Unit just moves toward the dropoff point.
    // Movement is handled by the Harvesting system which sets the path.
    if (this.path.length > 0) {
      this._followPath(dt, SC.CONST.RETURN_SPEED_BONUS);
    }
  }

  /**
   * BUILDING: Move to build site, construct building.
   */
  _updateBuilding(dt, gameState) {
    if (this.buildTarget === null) {
      this._nextOrder();
      return;
    }

    const building = this._getEntity(this.buildTarget, gameState);
    if (!building || !building.alive) {
      this.buildTarget = null;
      this._nextOrder();
      return;
    }

    // Check if building is complete
    if (building.state === SC.CONST.BUILDING_STATE.ACTIVE) {
      this.buildTarget = null;
      this._nextOrder();
      return;
    }

    // Move toward building if not close enough
    const dist = this.distanceTo(building);
    if (dist > SC.CONST.TILE_SIZE * 2) {
      this._moveToward(building.x, building.y, dt);
    } else {
      // Construction progress handled by Production system
      // SCV just needs to be near the building
    }
  }

  /**
   * PATROLLING: Move between two points, attack enemies in sight range.
   */
  _updatePatrolling(dt, gameState) {
    // Check for enemies while patrolling
    if (this.canAttack) {
      const enemy = this._findNearbyEnemy(gameState, this.sightRange);
      if (enemy) {
        this.targetEntity = enemy.id;
        this._setState(SC.CONST.UNIT_STATE.ATTACKING);
        return;
      }
    }

    const arrived = this._followPath(dt);
    if (arrived) {
      // Swap patrol direction
      this.patrolToEnd = !this.patrolToEnd;
      if (this.patrolToEnd) {
        this.targetX = this.patrolEndX;
        this.targetY = this.patrolEndY;
      } else {
        this.targetX = this.patrolStartX;
        this.targetY = this.patrolStartY;
      }
      this._requestPath(this.targetX, this.targetY);
    }
  }

  /**
   * HOLDING: Don't move, but attack enemies in range.
   */
  _updateHolding(dt, gameState) {
    if (this.canAttack) {
      const enemy = this._findNearbyEnemy(gameState, this.attackRange);
      if (enemy) {
        if (enemy.isFlying && !this.canAttackAir) {
          return; // Can't attack air
        }
        if (this.attackTimer <= 0) {
          this._fireAt(enemy, gameState);
          this.attackTimer = this.attackCooldown;
        }
      }
    }
  }

  /**
   * SIEGE_DEPLOYING: Timer ticks down, then enter siege mode.
   */
  _updateSiegeDeploying(dt, gameState) {
    this.siegeTimer -= dt;
    if (this.siegeTimer <= 0) {
      this.isSieged = true;
      this.siegeTimer = 0;
      this._setState(SC.CONST.UNIT_STATE.SIEGE_MODE);
      this._nextOrder();
    }
  }

  /**
   * SIEGE_MODE: Stationary, attack enemies in siege range. Cannot move.
   */
  _updateSiegeMode(dt, gameState) {
    if (this.canAttack) {
      let target = null;
      if (this.targetEntity !== null) {
        target = this._getEntity(this.targetEntity, gameState);
      }

      if (!target || !target.alive) {
        this.targetEntity = null;
        target = this._findNearbyEnemy(gameState, this.siegeRange);
        if (target) {
          this.targetEntity = target.id;
        }
      }

      if (target && target.alive) {
        const dist = this.tileDistanceTo(target);
        // Check siege range limits
        if (dist >= this.siegeMinRange && dist <= this.siegeRange) {
          if (!target.isFlying) { // Siege tanks can't hit air
            if (this.attackTimer <= 0) {
              this._fireAt(target, gameState);
              this.attackTimer = this.siegeCooldown;
            }
          }
        } else {
          // Target out of siege range, try to find another
          this.targetEntity = null;
        }
      }
    }
  }

  /**
   * SIEGE_UNDEPLOYING: Timer ticks down, then exit siege mode.
   */
  _updateSiegeUndeploying(dt, gameState) {
    this.siegeTimer -= dt;
    if (this.siegeTimer <= 0) {
      this.isSieged = false;
      this.siegeTimer = 0;
      this._setState(SC.CONST.UNIT_STATE.IDLE);
      this._nextOrder();
    }
  }

  /**
   * HEALING: Move to wounded ally, heal them.
   */
  _updateHealing(dt, gameState) {
    if (!this.isHealer) {
      this._nextOrder();
      return;
    }

    let target = null;
    if (this.healTarget !== null) {
      target = this._getEntity(this.healTarget, gameState);
    }

    // If target is dead, fully healed, or invalid, find new target
    if (!target || !target.alive || target.hp >= target.maxHp) {
      this.healTarget = null;
      const wounded = this._findNearbyWoundedAlly(gameState);
      if (wounded) {
        this.healTarget = wounded.id;
        target = wounded;
      } else {
        this._setState(SC.CONST.UNIT_STATE.IDLE);
        return;
      }
    }

    const dist = this.tileDistanceTo(target);
    if (dist <= this.healRange) {
      // Heal the target
      target.hp = Math.min(target.maxHp, target.hp + this.healRate * dt);
    } else {
      // Move closer
      this._moveToward(target.x, target.y, dt);
    }
  }

  // ============ MOVEMENT HELPERS ============

  /**
   * Follow the current path. Returns true if arrived at final waypoint.
   * @param {number} dt
   * @param {number} [speedMultiplier=1]
   * @returns {boolean} arrived
   */
  _followPath(dt, speedMultiplier) {
    speedMultiplier = speedMultiplier || 1;
    if (this.path.length === 0 || this.pathIndex >= this.path.length) {
      return true;
    }

    const waypoint = this.path[this.pathIndex];
    const dx = waypoint.x - this.x;
    const dy = waypoint.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const moveSpeed = this.speed * SC.CONST.TILE_SIZE * speedMultiplier * dt;

    if (dist <= moveSpeed) {
      // Arrived at waypoint
      this.x = waypoint.x;
      this.y = waypoint.y;
      this.pathIndex++;

      if (this.pathIndex >= this.path.length) {
        // Arrived at final destination
        this.path = [];
        this.pathIndex = 0;
        return true;
      }
    } else {
      // Move toward waypoint
      const nx = dx / dist;
      const ny = dy / dist;
      this.x += nx * moveSpeed;
      this.y += ny * moveSpeed;
    }
    return false;
  }

  /**
   * Move directly toward a world position (no pathfinding).
   */
  _moveToward(targetX, targetY, dt) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return;

    const moveSpeed = this.speed * SC.CONST.TILE_SIZE * dt;
    if (dist <= moveSpeed) {
      this.x = targetX;
      this.y = targetY;
    } else {
      const nx = dx / dist;
      const ny = dy / dist;
      this.x += nx * moveSpeed;
      this.y += ny * moveSpeed;
    }
  }

  // ============ COMBAT HELPERS ============

  /**
   * Fire at a target entity.
   */
  _fireAt(target, gameState) {
    const dmg = this.isSieged ? this.siegeDamage : this.damage;

    // Create projectile if available, otherwise apply damage directly
    if (SC.Projectile && gameState && gameState.entities) {
      const proj = new SC.Projectile({
        x: this.x,
        y: this.y,
        owner: this.owner,
        subType: 'projectile',
        targetId: target.id,
        targetX: target.x,
        targetY: target.y,
        damage: dmg,
        speed: 12,
        splashRadius: this.isSieged ? this.splashRadius : 0,
        sourceOwner: this.owner,
      });
      gameState.entities.push(proj);
      if (SC.EventBus) {
        SC.EventBus.emit(SC.CONST.EVENT.ENTITY_CREATED, { entity: proj });
      }
    } else {
      // Direct damage (fallback)
      const result = target.takeDamage(dmg);
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
   * Find the nearest enemy entity within a tile range.
   * @returns {SC.Entity|null}
   */
  _findNearbyEnemy(gameState, rangeTiles) {
    if (!gameState || !gameState.entities) return null;

    let closest = null;
    let closestDist = Infinity;

    for (const entity of gameState.entities) {
      if (!entity.alive) continue;
      if (!this.isEnemy(entity)) continue;
      if (entity.type === 'projectile') continue;

      // Check if we can attack air targets
      if (entity.isFlying && !this.canAttackAir) continue;

      const dist = this.tileDistanceTo(entity);
      if (dist <= rangeTiles && dist < closestDist) {
        closestDist = dist;
        closest = entity;
      }
    }
    return closest;
  }

  /**
   * Find the nearest wounded allied unit for medic healing.
   * @returns {SC.Entity|null}
   */
  _findNearbyWoundedAlly(gameState) {
    if (!gameState || !gameState.entities) return null;

    let closest = null;
    let closestDist = Infinity;

    for (const entity of gameState.entities) {
      if (!entity.alive) continue;
      if (entity.type !== 'unit') continue;
      if (entity.owner !== this.owner) continue;
      if (entity.id === this.id) continue;
      if (entity.hp >= entity.maxHp) continue;

      const dist = this.tileDistanceTo(entity);
      if (dist <= this.sightRange && dist < closestDist) {
        closestDist = dist;
        closest = entity;
      }
    }
    return closest;
  }

  /**
   * Get an entity by ID from gameState.
   */
  _getEntity(entityId, gameState) {
    if (!gameState || !gameState.entities) return null;
    return gameState.entities.find(e => e.id === entityId) || null;
  }

  // ============ DRAWING ============

  /**
   * Draw the unit on the canvas.
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} camera - SC.Camera
   */
  draw(ctx, camera) {
    if (!this.alive) return;

    const screen = camera.worldToScreen(this.x, this.y);
    const r = this.drawRadius * camera.zoom;
    const color = this.drawColor || this.getColor();

    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    switch (this.drawShape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, r, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'rect':
        ctx.fillRect(screen.x - r, screen.y - r, r * 2, r * 2);
        break;

      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(screen.x, screen.y - r);
        ctx.lineTo(screen.x - r, screen.y + r);
        ctx.lineTo(screen.x + r, screen.y + r);
        ctx.closePath();
        ctx.fill();
        break;

      default:
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, r, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    // Draw siege mode indicator (larger outline)
    if (this.isSieged) {
      ctx.strokeStyle = '#ffaa00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, r + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1;
    }

    // Draw carry indicator for SCVs
    if (this.isWorker && (this.carryingMinerals > 0 || this.carryingGas > 0)) {
      const carryColor = this.carryingMinerals > 0 ? SC.CONST.COLORS.MINERAL : SC.CONST.COLORS.GAS;
      ctx.fillStyle = carryColor;
      ctx.beginPath();
      ctx.arc(screen.x + r * 0.6, screen.y - r * 0.6, 3 * camera.zoom, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw HP bar
    this._drawHpBar(ctx, screen, r);

    // Draw healing effect
    if (this.state === SC.CONST.UNIT_STATE.HEALING && this.isHealer) {
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, r + 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  /**
   * Draw HP bar above the unit.
   */
  _drawHpBar(ctx, screen, radius) {
    if (this.hp >= this.maxHp) return; // Don't draw if full HP

    const barWidth = radius * 2.5;
    const barHeight = 3;
    const barX = screen.x - barWidth / 2;
    const barY = screen.y - radius - 8;

    // Background
    ctx.fillStyle = SC.CONST.COLORS.HP_BAR_BG;
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // HP fill
    const hpRatio = this.hp / this.maxHp;
    let barColor;
    if (this.owner === SC.CONST.PLAYER.HUMAN) {
      barColor = hpRatio > 0.5 ? SC.CONST.COLORS.HP_BAR_ALLY : SC.CONST.COLORS.HP_BAR_YELLOW;
    } else {
      barColor = SC.CONST.COLORS.HP_BAR_ENEMY;
    }
    ctx.fillStyle = barColor;
    ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
  }
};
