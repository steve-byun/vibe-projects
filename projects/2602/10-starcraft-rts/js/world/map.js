// === StarCraft RTS Clone - TileMap ===
// 2D tile grid with terrain types, resource node placement, and map generation.
// Produces a two-player map with start locations, mineral patches, geysers, and choke points.

window.SC = window.SC || {};

window.SC.Map = {
  tiles: null,          // Uint8Array, row-major [y * width + x]
  widthTiles: 0,
  heightTiles: 0,

  // --- Internal seed for deterministic pseudo-random ---
  _seed: 12345,
  _random() {
    // Simple LCG pseudo-random (0..1)
    this._seed = (this._seed * 1664525 + 1013904223) & 0x7fffffff;
    return this._seed / 0x7fffffff;
  },

  /**
   * Generate a two-player map.
   * @param {number} width  - tiles wide (default MAP_WIDTH_TILES)
   * @param {number} height - tiles tall (default MAP_HEIGHT_TILES)
   * @returns {{ tiles: Uint8Array, mineralPatches: Array, gasGeysers: Array, startLocations: Array }}
   */
  generate(width, height) {
    const C = SC.CONST;
    const T = C.TERRAIN;
    const w = width || C.MAP_WIDTH_TILES;
    const h = height || C.MAP_HEIGHT_TILES;

    this.widthTiles = w;
    this.heightTiles = h;
    this.tiles = new Uint8Array(w * h);
    this._seed = 42; // reset seed for reproducible maps

    // 1) Fill all tiles with GROUND
    this.tiles.fill(T.GROUND);

    // 2) Border walls (2 tiles thick)
    this._fillRect(0, 0, w, 2, T.CLIFF);            // top
    this._fillRect(0, h - 2, w, 2, T.CLIFF);         // bottom
    this._fillRect(0, 0, 2, h, T.CLIFF);             // left
    this._fillRect(w - 2, 0, 2, h, T.CLIFF);         // right

    // 3) Central water lake (~12x10 centred)
    const lakeX = Math.floor(w / 2) - 6;
    const lakeY = Math.floor(h / 2) - 5;
    this._fillEllipse(Math.floor(w / 2), Math.floor(h / 2), 7, 6, T.WATER);

    // 4) Cliff formations for choke points
    // Diagonal walls from top-left to centre and bottom-right to centre
    this._addCliffWall(30, 30, 50, 45, 3);   // upper-left wall
    this._addCliffWall(78, 83, 98, 98, 3);   // lower-right wall

    // Horizontal cliff walls creating choke points in the middle
    this._fillRect(40, 55, 18, 2, T.CLIFF);  // mid-left horizontal
    this._fillRect(70, 71, 18, 2, T.CLIFF);  // mid-right horizontal

    // Small cliff clusters for tactical cover
    this._fillRect(20, 60, 4, 6, T.CLIFF);
    this._fillRect(104, 62, 4, 6, T.CLIFF);
    this._fillRect(55, 25, 6, 4, T.CLIFF);
    this._fillRect(67, 99, 6, 4, T.CLIFF);

    // 5) Ramps connecting through cliff walls
    this._fillRect(38, 56, 2, 2, T.RAMP);   // ramp through mid-left wall
    this._fillRect(58, 55, 2, 2, T.RAMP);   // ramp through mid-left wall (right end)
    this._fillRect(68, 72, 2, 2, T.RAMP);   // ramp through mid-right wall
    this._fillRect(88, 71, 2, 2, T.RAMP);   // ramp through mid-right wall (right end)

    // Ramps through diagonal walls
    this._fillRect(40, 37, 2, 2, T.RAMP);
    this._fillRect(88, 90, 2, 2, T.RAMP);

    // 6) Scatter some random cliff patches for variety
    for (let i = 0; i < 12; i++) {
      const rx = Math.floor(this._random() * (w - 20)) + 10;
      const ry = Math.floor(this._random() * (h - 20)) + 10;
      // Don't place near start locations
      if (this._nearStart(rx, ry, 20)) continue;
      // Don't place in the lake
      if (this._nearCenter(rx, ry, w, h, 12)) continue;
      const sw = Math.floor(this._random() * 3) + 2;
      const sh = Math.floor(this._random() * 3) + 2;
      this._fillRect(rx, ry, sw, sh, T.CLIFF);
    }

    // 7) Define start locations
    const startLocations = [
      { tileX: 16, tileY: 112 },  // Player 1 (bottom-left)
      { tileX: 112, tileY: 16 },  // Player 2 (top-right)
    ];

    // Clear the start areas (ensure walkable ground around base)
    for (const start of startLocations) {
      this._fillRect(start.tileX - 6, start.tileY - 6, 16, 16, T.GROUND);
    }

    // 8) Place mineral patches in arcs around each start location
    const mineralPatches = [];
    for (const start of startLocations) {
      const patches = this._placeMineralArc(start.tileX, start.tileY, 8, 5);
      mineralPatches.push(...patches);
    }

    // 9) Place gas geysers near each start
    const gasGeysers = [];
    for (const start of startLocations) {
      const geyser = this._placeGeyser(start.tileX, start.tileY, 6);
      gasGeysers.push(geyser);
    }

    // 10) Natural expansion locations (midway between bases)
    // Expansion 1: roughly (40, 88) — closer to Player 1
    const exp1 = { tileX: 40, tileY: 88 };
    this._fillRect(exp1.tileX - 5, exp1.tileY - 5, 14, 14, T.GROUND);
    const exp1Minerals = this._placeMineralArc(exp1.tileX, exp1.tileY, 6, 5);
    mineralPatches.push(...exp1Minerals);
    const exp1Gas = this._placeGeyser(exp1.tileX, exp1.tileY, 6);
    gasGeysers.push(exp1Gas);

    // Expansion 2: roughly (88, 40) — closer to Player 2
    const exp2 = { tileX: 88, tileY: 40 };
    this._fillRect(exp2.tileX - 5, exp2.tileY - 5, 14, 14, T.GROUND);
    const exp2Minerals = this._placeMineralArc(exp2.tileX, exp2.tileY, 6, 5);
    mineralPatches.push(...exp2Minerals);
    const exp2Gas = this._placeGeyser(exp2.tileX, exp2.tileY, 6);
    gasGeysers.push(exp2Gas);

    return {
      tiles: this.tiles,
      mineralPatches: mineralPatches,
      gasGeysers: gasGeysers,
      startLocations: startLocations,
    };
  },

  // --- Terrain queries ---

  /**
   * Get the terrain type at (tileX, tileY).
   * Returns CLIFF for out-of-bounds.
   */
  getTile(tileX, tileY) {
    if (tileX < 0 || tileX >= this.widthTiles || tileY < 0 || tileY >= this.heightTiles) {
      return SC.CONST.TERRAIN.CLIFF;
    }
    return this.tiles[tileY * this.widthTiles + tileX];
  },

  /**
   * True if the tile is walkable (GROUND or RAMP).
   */
  isWalkable(tileX, tileY) {
    const t = this.getTile(tileX, tileY);
    return t === SC.CONST.TERRAIN.GROUND || t === SC.CONST.TERRAIN.RAMP;
  },

  /**
   * Check if a rectangular region is all GROUND tiles and
   * does not overlap any existing buildings.
   * @param {number} tileX       - left tile column
   * @param {number} tileY       - top tile row
   * @param {number} w           - width in tiles
   * @param {number} h           - height in tiles
   * @param {Array}  existingBuildings - [{ tileX, tileY, size: { w, h } }]
   * @returns {boolean}
   */
  isBuildable(tileX, tileY, w, h, existingBuildings) {
    const buildings = existingBuildings || [];

    // Check every tile in the rectangle is GROUND
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const t = this.getTile(tileX + dx, tileY + dy);
        if (t !== SC.CONST.TERRAIN.GROUND) {
          return false;
        }
      }
    }

    // Check overlap with existing buildings (AABB intersection)
    for (const b of buildings) {
      const bx = b.tileX;
      const by = b.tileY;
      const bw = b.size ? b.size.w : 0;
      const bh = b.size ? b.size.h : 0;

      const overlapX = tileX < bx + bw && tileX + w > bx;
      const overlapY = tileY < by + bh && tileY + h > by;
      if (overlapX && overlapY) {
        return false;
      }
    }

    return true;
  },

  /**
   * Convert world pixel coords to tile coords.
   */
  worldToTile(worldX, worldY) {
    return {
      tileX: Math.floor(worldX / SC.CONST.TILE_SIZE),
      tileY: Math.floor(worldY / SC.CONST.TILE_SIZE),
    };
  },

  /**
   * Convert tile coords to world pixel coords (center of tile).
   */
  tileToWorld(tileX, tileY) {
    const half = SC.CONST.TILE_SIZE / 2;
    return {
      x: tileX * SC.CONST.TILE_SIZE + half,
      y: tileY * SC.CONST.TILE_SIZE + half,
    };
  },

  // ===== Internal helpers =====

  /**
   * Fill a rectangular area with a terrain type.
   */
  _fillRect(x, y, w, h, terrain) {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const tx = x + dx;
        const ty = y + dy;
        if (tx >= 0 && tx < this.widthTiles && ty >= 0 && ty < this.heightTiles) {
          this.tiles[ty * this.widthTiles + tx] = terrain;
        }
      }
    }
  },

  /**
   * Fill an elliptical area with a terrain type.
   */
  _fillEllipse(cx, cy, rx, ry, terrain) {
    for (let dy = -ry; dy <= ry; dy++) {
      for (let dx = -rx; dx <= rx; dx++) {
        const nx = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
        if (nx <= 1.0) {
          const tx = cx + dx;
          const ty = cy + dy;
          if (tx >= 0 && tx < this.widthTiles && ty >= 0 && ty < this.heightTiles) {
            this.tiles[ty * this.widthTiles + tx] = terrain;
          }
        }
      }
    }
  },

  /**
   * Add a diagonal cliff wall from (x1,y1) to (x2,y2) with given thickness.
   */
  _addCliffWall(x1, y1, x2, y2, thickness) {
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    if (steps === 0) return;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const cx = Math.round(x1 + (x2 - x1) * t);
      const cy = Math.round(y1 + (y2 - y1) * t);
      for (let dy = 0; dy < thickness; dy++) {
        for (let dx = 0; dx < thickness; dx++) {
          const tx = cx + dx;
          const ty = cy + dy;
          if (tx >= 2 && tx < this.widthTiles - 2 && ty >= 2 && ty < this.heightTiles - 2) {
            this.tiles[ty * this.widthTiles + tx] = SC.CONST.TERRAIN.CLIFF;
          }
        }
      }
    }
  },

  /**
   * Check if a tile is near either start location.
   */
  _nearStart(tx, ty, range) {
    // Player 1 start: (16, 112), Player 2 start: (112, 16)
    const d1 = Math.abs(tx - 16) + Math.abs(ty - 112);
    const d2 = Math.abs(tx - 112) + Math.abs(ty - 16);
    return d1 < range || d2 < range;
  },

  /**
   * Check if a tile is near the center of the map.
   */
  _nearCenter(tx, ty, w, h, range) {
    const cx = Math.floor(w / 2);
    const cy = Math.floor(h / 2);
    return Math.abs(tx - cx) + Math.abs(ty - cy) < range;
  },

  /**
   * Place mineral patches in a semi-circle arc around a base position.
   * @param {number} baseX - center tileX of the base
   * @param {number} baseY - center tileY of the base
   * @param {number} count - how many patches
   * @param {number} radius - tile distance from center
   * @returns {Array<{tileX: number, tileY: number}>}
   */
  _placeMineralArc(baseX, baseY, count, radius) {
    const patches = [];
    // Determine arc direction: face toward map center
    const mapCx = Math.floor(this.widthTiles / 2);
    const mapCy = Math.floor(this.heightTiles / 2);
    const angleToCenter = Math.atan2(mapCy - baseY, mapCx - baseX);

    // Spread minerals in a ~120-degree arc facing toward map center
    const arcSpan = Math.PI * 0.65;
    const startAngle = angleToCenter - arcSpan / 2;

    for (let i = 0; i < count; i++) {
      const angle = startAngle + (arcSpan / (count - 1)) * i;
      const tileX = Math.round(baseX + Math.cos(angle) * radius);
      const tileY = Math.round(baseY + Math.sin(angle) * radius);
      // Ensure the tile is within bounds and set to GROUND
      if (tileX >= 2 && tileX < this.widthTiles - 2 && tileY >= 2 && tileY < this.heightTiles - 2) {
        this.tiles[tileY * this.widthTiles + tileX] = SC.CONST.TERRAIN.GROUND;
        patches.push({ tileX: tileX, tileY: tileY });
      }
    }
    return patches;
  },

  /**
   * Place a gas geyser near a base position.
   * @param {number} baseX
   * @param {number} baseY
   * @param {number} distance - tile distance from base
   * @returns {{ tileX: number, tileY: number }}
   */
  _placeGeyser(baseX, baseY, distance) {
    // Place geyser on the opposite side of the mineral arc (away from center)
    const mapCx = Math.floor(this.widthTiles / 2);
    const mapCy = Math.floor(this.heightTiles / 2);
    const angleAway = Math.atan2(baseY - mapCy, baseX - mapCx);
    // Offset slightly so it's not directly behind
    const angle = angleAway + 0.5;
    const tileX = Math.round(baseX + Math.cos(angle) * distance);
    const tileY = Math.round(baseY + Math.sin(angle) * distance);
    // Ensure walkable
    if (tileX >= 2 && tileX < this.widthTiles - 2 && tileY >= 2 && tileY < this.heightTiles - 2) {
      this.tiles[tileY * this.widthTiles + tileX] = SC.CONST.TERRAIN.GROUND;
    }
    return { tileX: tileX, tileY: tileY };
  },
};
