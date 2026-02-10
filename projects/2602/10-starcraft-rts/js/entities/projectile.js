// === StarCraft RTS Clone - Projectile Class ===
// Extends SC.Entity. Moves toward target, applies damage on impact, supports splash.
// Exposed at window.SC.Projectile

window.SC = window.SC || {};

window.SC.Projectile = class Projectile extends SC.Entity {
  constructor(config) {
    super({
      ...config,
      type: 'projectile',
      maxHp: 1,
      armor: 0,
      sightRange: 0,
    });

    this.targetId = config.targetId;        // entity ID of target
    this.targetX = config.targetX;          // fallback position if target dies
    this.targetY = config.targetY;
    this.damage = config.damage || 0;
    this.speed = config.speed || 10;        // tiles per second
    this.splashRadius = config.splashRadius || 0;  // splash damage radius in tiles
    this.sourceOwner = config.sourceOwner || 0;

    // Visual
    this.trail = [];  // Array of {x, y} for trail effect
    this.maxTrailLength = 5;
  }

  /**
   * Main update. Move toward target, check for hit.
   * @param {number} dt - delta time in seconds
   * @param {object} gameState
   */
  update(dt, gameState) {
    if (!this.alive) return;

    // Update target position if target is still alive
    const target = this._getTarget(gameState);
    if (target && target.alive) {
      this.targetX = target.x;
      this.targetY = target.y;
    }

    // Save trail position
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }

    // Move toward target
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const moveSpeed = this.speed * SC.CONST.TILE_SIZE * dt;

    if (dist <= moveSpeed || dist < 4) {
      // Hit!
      this.x = this.targetX;
      this.y = this.targetY;
      this._onHit(gameState);
    } else {
      // Move closer
      const nx = dx / dist;
      const ny = dy / dist;
      this.x += nx * moveSpeed;
      this.y += ny * moveSpeed;
    }
  }

  /**
   * Called when the projectile reaches its target.
   */
  _onHit(gameState) {
    if (!gameState || !gameState.entities) {
      this.alive = false;
      return;
    }

    if (this.splashRadius > 0) {
      // Splash damage: damage all enemies in radius
      this._applySplashDamage(gameState);
    } else {
      // Single target damage
      const target = this._getTarget(gameState);
      if (target && target.alive) {
        const result = target.takeDamage(this.damage);
        if (SC.EventBus) {
          SC.EventBus.emit(SC.CONST.EVENT.ENTITY_DAMAGED, {
            targetId: target.id,
            damage: result.actualDamage,
            attackerId: this.sourceOwner,
          });
        }
        if (result.died) {
          if (SC.EventBus) {
            SC.EventBus.emit(SC.CONST.EVENT.ENTITY_DESTROYED, {
              entity: target,
              killerId: this.sourceOwner,
            });
          }
        }
      }
    }

    // Destroy the projectile
    this.alive = false;
    if (SC.EventBus) {
      SC.EventBus.emit(SC.CONST.EVENT.ENTITY_DESTROYED, { entity: this });
    }
  }

  /**
   * Apply splash damage to all entities in radius.
   */
  _applySplashDamage(gameState) {
    const splashPx = this.splashRadius * SC.CONST.TILE_SIZE;

    for (const entity of gameState.entities) {
      if (!entity.alive) continue;
      if (entity.type === 'projectile') continue;
      if (entity.isFlying) continue; // Splash doesn't hit air

      // Splash damages all entities (including friendlies!) within radius
      const dx = entity.x - this.x;
      const dy = entity.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= splashPx) {
        // Damage falls off with distance
        const falloff = 1.0 - (dist / splashPx) * 0.5; // 100% at center, 50% at edge
        const actualDamage = Math.floor(this.damage * falloff);

        if (actualDamage > 0) {
          const result = entity.takeDamage(actualDamage);
          if (SC.EventBus) {
            SC.EventBus.emit(SC.CONST.EVENT.ENTITY_DAMAGED, {
              targetId: entity.id,
              damage: result.actualDamage,
              attackerId: this.sourceOwner,
            });
          }
          if (result.died) {
            if (SC.EventBus) {
              SC.EventBus.emit(SC.CONST.EVENT.ENTITY_DESTROYED, {
                entity: entity,
                killerId: this.sourceOwner,
              });
            }
          }
        }
      }
    }
  }

  /**
   * Get the target entity by ID.
   */
  _getTarget(gameState) {
    if (!gameState || !gameState.entities || this.targetId === null) return null;
    return gameState.entities.find(e => e.id === this.targetId) || null;
  }

  // ============ DRAWING ============

  /**
   * Draw the projectile on the canvas.
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} camera - SC.Camera
   */
  draw(ctx, camera) {
    if (!this.alive) return;

    const screen = camera.worldToScreen(this.x, this.y);
    const r = 3 * camera.zoom;

    // Draw trail
    if (this.trail.length > 1) {
      ctx.strokeStyle = 'rgba(255, 255, 200, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const firstTrail = camera.worldToScreen(this.trail[0].x, this.trail[0].y);
      ctx.moveTo(firstTrail.x, firstTrail.y);
      for (let i = 1; i < this.trail.length; i++) {
        const tp = camera.worldToScreen(this.trail[i].x, this.trail[i].y);
        ctx.lineTo(tp.x, tp.y);
      }
      ctx.lineTo(screen.x, screen.y);
      ctx.stroke();
      ctx.lineWidth = 1;
    }

    // Draw projectile body
    const color = this.splashRadius > 0 ? '#ff6600' : '#ffffaa';
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, r, 0, Math.PI * 2);
    ctx.fill();

    // Glow effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
};
