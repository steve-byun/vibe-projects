// === StarCraft RTS Clone - Resource Entity ===
// Mineral patches and gas geysers. Extends SC.Entity.
// Workers harvest from these; minerals deplete over time, gas requires a refinery.

window.SC = window.SC || {};

window.SC.Resource = class Resource extends SC.Entity {
  /**
   * @param {object} config
   * @param {string} config.resourceType - 'mineral' | 'gas'
   * @param {number} config.amount       - starting resource amount
   * @param {number} config.tileX        - tile position X
   * @param {number} config.tileY        - tile position Y
   */
  constructor(config) {
    const TILE_SIZE = SC.CONST.TILE_SIZE;
    const halfTile = TILE_SIZE / 2;
    super({
      type: 'resource',
      subType: config.resourceType,  // 'mineral' or 'gas'
      owner: SC.CONST.PLAYER.NEUTRAL,
      x: config.tileX * TILE_SIZE + halfTile,
      y: config.tileY * TILE_SIZE + halfTile,
      maxHp: config.resourceType === 'mineral' ? 50 : 100,
      armor: 0,
      sightRange: 0,
    });

    this.resourceType = config.resourceType;  // 'mineral' | 'gas'
    this.amount = config.amount;              // remaining resource
    this.maxAmount = config.amount;           // initial amount (for display ratio)
    this.tileX = config.tileX;
    this.tileY = config.tileY;
    this.harvesters = [];                     // IDs of SCVs currently harvesting
    this.maxHarvesters = config.resourceType === 'mineral' ? 2 : 3;
    this.hasRefinery = false;                 // gas: true when refinery is built on it

    // Animation accumulators
    this._shimmerPhase = Math.random() * Math.PI * 2;
    this._smokeTimer = 0;
    this._smokeParticles = [];
  }

  /**
   * Harvest resources.
   * @param {number} amount - how much to try harvesting
   * @returns {number} actual amount harvested (may be less if near depletion)
   */
  harvest(amount) {
    if (this.amount <= 0) {
      this.alive = false;
      return 0;
    }

    const actual = Math.min(amount, this.amount);
    this.amount -= actual;

    if (this.amount <= 0) {
      this.amount = 0;
      this.alive = false;
      SC.EventBus.emit(SC.CONST.EVENT.ENTITY_DESTROYED, { entity: this });
    }

    return actual;
  }

  /**
   * Check if this resource can be harvested.
   * - Must have amount > 0
   * - For gas: must have a refinery built on it
   * - Must not be at max harvesters
   * @returns {boolean}
   */
  canHarvest() {
    if (this.amount <= 0) return false;
    if (this.resourceType === 'gas' && !this.hasRefinery) return false;
    if (this.harvesters.length >= this.maxHarvesters) return false;
    return true;
  }

  /**
   * Draw the resource on the game canvas.
   * @param {CanvasRenderingContext2D} ctx
   * @param {object} camera - { x, y } camera offset in world pixels
   */
  draw(ctx, camera) {
    if (!this.alive) return;

    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;
    const TILE_SIZE = SC.CONST.TILE_SIZE;

    // Quick cull: skip if off-screen (generous margin)
    if (screenX < -TILE_SIZE * 2 || screenX > SC.CONST.CANVAS_WIDTH + TILE_SIZE * 2) return;
    if (screenY < -TILE_SIZE * 2 || screenY > SC.CONST.CANVAS_HEIGHT + TILE_SIZE * 2) return;

    if (this.resourceType === 'mineral') {
      this._drawMineral(ctx, screenX, screenY);
    } else {
      this._drawGeyser(ctx, screenX, screenY);
    }
  }

  /**
   * Draw a mineral patch as a blue diamond shape.
   * Size shrinks as the mineral is depleted.
   */
  _drawMineral(ctx, sx, sy) {
    const ratio = this.amount / this.maxAmount;
    const baseSize = 10;
    const size = baseSize * (0.4 + 0.6 * ratio); // min 40% size when nearly depleted

    // Shimmer effect
    this._shimmerPhase += 0.03;
    const shimmer = Math.sin(this._shimmerPhase) * 0.15;

    ctx.save();

    // Diamond shape
    ctx.beginPath();
    ctx.moveTo(sx, sy - size);           // top
    ctx.lineTo(sx + size * 0.7, sy);     // right
    ctx.lineTo(sx, sy + size * 0.6);     // bottom
    ctx.lineTo(sx - size * 0.7, sy);     // left
    ctx.closePath();

    // Fill with gradient-like color
    const r = Math.floor(0 + shimmer * 30);
    const g = Math.floor(180 + shimmer * 40);
    const b = Math.floor(255);
    ctx.fillStyle = `rgb(${Math.max(0, r)}, ${Math.max(0, Math.min(255, g))}, ${b})`;
    ctx.fill();

    // Highlight edge
    ctx.strokeStyle = 'rgba(150, 220, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Small sparkle at top
    if (Math.sin(this._shimmerPhase * 2) > 0.7) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(sx - 1, sy - size + 1, 2, 2);
    }

    ctx.restore();
  }

  /**
   * Draw a gas geyser as a green circle with optional smoke.
   */
  _drawGeyser(ctx, sx, sy) {
    const radius = 12;

    ctx.save();

    // Base circle (dark green ground vent)
    ctx.beginPath();
    ctx.arc(sx, sy, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#1a4a1a';
    ctx.fill();

    // Inner circle (brighter green)
    ctx.beginPath();
    ctx.arc(sx, sy, radius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = SC.CONST.COLORS.GAS;
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Outline
    ctx.beginPath();
    ctx.arc(sx, sy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#00aa00';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Smoke effect when refinery is built
    if (this.hasRefinery) {
      this._smokeTimer += 0.05;
      this._updateSmoke(ctx, sx, sy);
    }

    ctx.restore();
  }

  /**
   * Draw rising smoke particles above a refinery geyser.
   */
  _updateSmoke(ctx, sx, sy) {
    // Spawn new particles periodically
    if (this._smokeTimer % 0.5 < 0.06) {
      this._smokeParticles.push({
        x: sx + (Math.random() - 0.5) * 6,
        y: sy - 8,
        life: 1.0,
      });
      // Cap particle count
      if (this._smokeParticles.length > 8) {
        this._smokeParticles.shift();
      }
    }

    // Update and draw particles
    for (let i = this._smokeParticles.length - 1; i >= 0; i--) {
      const p = this._smokeParticles[i];
      p.y -= 0.5;
      p.x += (Math.random() - 0.5) * 0.3;
      p.life -= 0.02;

      if (p.life <= 0) {
        this._smokeParticles.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = p.life * 0.4;
      ctx.fillStyle = '#88cc88';
      const pSize = 3 + (1 - p.life) * 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, pSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1.0;
  }
};
