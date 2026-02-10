// === StarCraft RTS Clone - Fog of War ===
// Per-tile visibility tracking for a single player.
// States: UNEXPLORED (never seen), EXPLORED (seen before), VISIBLE (currently in sight).

window.SC = window.SC || {};

window.SC.Fog = {
  grid: null,           // Uint8Array, per-tile fog state
  widthTiles: 0,
  heightTiles: 0,
  playerId: 0,

  // Cache: pre-computed sight offsets per radius to avoid recomputing each frame
  _sightCache: {},

  /**
   * Initialize the fog grid.
   * @param {number} widthTiles
   * @param {number} heightTiles
   * @param {number} playerId - which player this fog is for
   */
  init(widthTiles, heightTiles, playerId) {
    this.widthTiles = widthTiles;
    this.heightTiles = heightTiles;
    this.playerId = playerId;
    this.grid = new Uint8Array(widthTiles * heightTiles);
    // All start as UNEXPLORED (0)
    this.grid.fill(SC.CONST.FOG.UNEXPLORED);
    this._sightCache = {};
  },

  /**
   * Update fog based on entity positions.
   * @param {Array} entities - all game entities
   */
  update(entities) {
    if (!this.grid) return;

    const FOG = SC.CONST.FOG;
    const w = this.widthTiles;
    const h = this.heightTiles;
    const grid = this.grid;

    // Step 1: Downgrade all VISIBLE tiles to EXPLORED
    const len = w * h;
    for (let i = 0; i < len; i++) {
      if (grid[i] === FOG.VISIBLE) {
        grid[i] = FOG.EXPLORED;
      }
    }

    // Step 2: For each entity owned by this player, reveal tiles within sight range
    const TILE_SIZE = SC.CONST.TILE_SIZE;
    for (let i = 0; i < entities.length; i++) {
      const ent = entities[i];
      if (!ent.alive) continue;
      if (ent.owner !== this.playerId) continue;
      if (ent.sightRange <= 0) continue;

      const cx = Math.floor(ent.x / TILE_SIZE);
      const cy = Math.floor(ent.y / TILE_SIZE);
      const range = ent.sightRange;

      // Use cached offsets for this range
      const offsets = this._getSightOffsets(range);
      for (let j = 0; j < offsets.length; j++) {
        const tx = cx + offsets[j][0];
        const ty = cy + offsets[j][1];
        if (tx >= 0 && tx < w && ty >= 0 && ty < h) {
          grid[ty * w + tx] = FOG.VISIBLE;
        }
      }
    }

    // Emit event so other systems know fog changed
    SC.EventBus.emit(SC.CONST.EVENT.FOG_UPDATED, null);
  },

  /**
   * Get fog state at a tile position.
   * @returns {number} FOG.UNEXPLORED | FOG.EXPLORED | FOG.VISIBLE
   */
  getState(tileX, tileY) {
    if (tileX < 0 || tileX >= this.widthTiles || tileY < 0 || tileY >= this.heightTiles) {
      return SC.CONST.FOG.UNEXPLORED;
    }
    return this.grid[tileY * this.widthTiles + tileX];
  },

  /**
   * Check if a world-pixel position is currently VISIBLE.
   */
  isVisible(worldX, worldY) {
    const tileX = Math.floor(worldX / SC.CONST.TILE_SIZE);
    const tileY = Math.floor(worldY / SC.CONST.TILE_SIZE);
    return this.getState(tileX, tileY) === SC.CONST.FOG.VISIBLE;
  },

  /**
   * Check if a world-pixel position has been EXPLORED (or is currently VISIBLE).
   */
  isExplored(worldX, worldY) {
    const tileX = Math.floor(worldX / SC.CONST.TILE_SIZE);
    const tileY = Math.floor(worldY / SC.CONST.TILE_SIZE);
    const state = this.getState(tileX, tileY);
    return state === SC.CONST.FOG.EXPLORED || state === SC.CONST.FOG.VISIBLE;
  },

  /**
   * Debug: reveal the entire map.
   */
  revealAll() {
    if (!this.grid) return;
    this.grid.fill(SC.CONST.FOG.VISIBLE);
    SC.EventBus.emit(SC.CONST.EVENT.FOG_UPDATED, null);
  },

  // ===== Internal =====

  /**
   * Get (or compute and cache) the list of tile offsets within a given sight radius.
   * Uses circle check: dx*dx + dy*dy <= range*range.
   * @param {number} range - sight range in tiles
   * @returns {Array<[number, number]>}
   */
  _getSightOffsets(range) {
    if (this._sightCache[range]) {
      return this._sightCache[range];
    }

    const offsets = [];
    const r2 = range * range;
    const ir = Math.ceil(range);

    for (let dy = -ir; dy <= ir; dy++) {
      for (let dx = -ir; dx <= ir; dx++) {
        if (dx * dx + dy * dy <= r2) {
          offsets.push([dx, dy]);
        }
      }
    }

    this._sightCache[range] = offsets;
    return offsets;
  },
};
