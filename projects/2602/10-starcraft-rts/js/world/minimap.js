// === StarCraft RTS Clone - Minimap ===
// Renders a scaled-down view of the map with terrain, fog, units, and buildings.
// Handles click-to-pan: clicking the minimap emits MINIMAP_CLICK with world coords.

window.SC = window.SC || {};

window.SC.Minimap = {
  canvas: null,
  ctx: null,
  width: 200,
  height: 200,

  // Pre-computed scale factors (updated on init)
  _scaleX: 0,
  _scaleY: 0,
  _imageData: null,
  _bound: false,

  /**
   * Initialize the minimap.
   * @param {HTMLCanvasElement} canvasElement - the #minimap-canvas element
   */
  init(canvasElement) {
    this.canvas = canvasElement;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');

    this._scaleX = this.width / SC.CONST.MAP_WIDTH_TILES;
    this._scaleY = this.height / SC.CONST.MAP_HEIGHT_TILES;

    // Bind click handler (only once)
    if (!this._bound) {
      this._bound = true;
      this.canvas.addEventListener('mousedown', (e) => this.handleClick(e));
    }
  },

  /**
   * Render the minimap.
   * @param {object} map       - SC.Map
   * @param {object} fog       - SC.Fog
   * @param {object} gameState - { entities: Array }
   * @param {object} camera    - { x, y, viewWidth, viewHeight } in world pixels
   */
  render(map, fog, gameState, camera) {
    if (!this.ctx) return;

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const COLORS = SC.CONST.COLORS;
    const FOG = SC.CONST.FOG;
    const TERRAIN = SC.CONST.TERRAIN;
    const mapW = map.widthTiles;
    const mapH = map.heightTiles;
    const sx = this._scaleX;
    const sy = this._scaleY;

    // 1) Fill background
    ctx.fillStyle = COLORS.MINIMAP_BG;
    ctx.fillRect(0, 0, w, h);

    // 2) Draw terrain tile by tile using imageData for performance
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    // Map terrain colors to RGBA for fast pixel writes
    const colorLookup = this._getTerrainColorRGBA();

    for (let ty = 0; ty < mapH; ty++) {
      for (let tx = 0; tx < mapW; tx++) {
        const fogState = fog.getState(tx, ty);

        // Pixel position on minimap
        const px = Math.floor(tx * sx);
        const py = Math.floor(ty * sy);
        if (px >= w || py >= h) continue;

        const idx = (py * w + px) * 4;

        if (fogState === FOG.UNEXPLORED) {
          // Black
          data[idx] = 0;
          data[idx + 1] = 0;
          data[idx + 2] = 0;
          data[idx + 3] = 255;
        } else {
          // Draw terrain
          const terrain = map.getTile(tx, ty);
          const rgba = colorLookup[terrain] || colorLookup[TERRAIN.GROUND];

          if (fogState === FOG.EXPLORED) {
            // Dim the color (multiply by 0.5)
            data[idx] = (rgba[0] * 0.5) | 0;
            data[idx + 1] = (rgba[1] * 0.5) | 0;
            data[idx + 2] = (rgba[2] * 0.5) | 0;
            data[idx + 3] = 255;
          } else {
            // Fully visible
            data[idx] = rgba[0];
            data[idx + 1] = rgba[1];
            data[idx + 2] = rgba[2];
            data[idx + 3] = 255;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // 3) Draw entities (resources, units, buildings)
    const entities = gameState ? (gameState.entities || []) : [];
    const TILE_SIZE = SC.CONST.TILE_SIZE;
    const PLAYER = SC.CONST.PLAYER;

    for (let i = 0; i < entities.length; i++) {
      const ent = entities[i];
      if (!ent.alive) continue;

      // Convert entity position to minimap position
      const mx = (ent.x / TILE_SIZE) * sx;
      const my = (ent.y / TILE_SIZE) * sy;

      // Fog check: skip enemy entities that are not visible
      if (ent.owner !== PLAYER.NEUTRAL && ent.owner !== fog.playerId) {
        const etx = Math.floor(ent.x / TILE_SIZE);
        const ety = Math.floor(ent.y / TILE_SIZE);
        if (fog.getState(etx, ety) !== FOG.VISIBLE) continue;
      }

      // Determine color and size
      let color;
      let dotSize;

      if (ent.type === 'resource') {
        if (ent.resourceType === 'mineral' || ent.subType === 'mineral') {
          color = COLORS.MINERAL;
        } else {
          color = COLORS.GAS;
        }
        dotSize = 1.5;
        // Resources are only shown if explored
        const rtx = Math.floor(ent.x / TILE_SIZE);
        const rty = Math.floor(ent.y / TILE_SIZE);
        if (fog.getState(rtx, rty) === FOG.UNEXPLORED) continue;
      } else if (ent.type === 'building') {
        color = ent.owner === PLAYER.HUMAN ? COLORS.PLAYER_1 : COLORS.PLAYER_2;
        dotSize = 3;
      } else if (ent.type === 'unit') {
        color = ent.owner === PLAYER.HUMAN ? COLORS.PLAYER_1 : COLORS.PLAYER_2;
        dotSize = 1.5;
      } else {
        // Projectiles or unknown — skip
        continue;
      }

      ctx.fillStyle = color;
      ctx.fillRect(Math.floor(mx - dotSize / 2), Math.floor(my - dotSize / 2), dotSize, dotSize);
    }

    // 4) Draw camera rectangle
    if (camera) {
      const camLeft = (camera.x / (TILE_SIZE * mapW)) * w;
      const camTop = (camera.y / (TILE_SIZE * mapH)) * h;
      const camW = (camera.viewWidth / (TILE_SIZE * mapW)) * w;
      const camH = (camera.viewHeight / (TILE_SIZE * mapH)) * h;

      ctx.strokeStyle = COLORS.MINIMAP_CAMERA;
      ctx.lineWidth = 1;
      ctx.strokeRect(camLeft, camTop, camW, camH);
    }
  },

  /**
   * Handle mouse click on the minimap canvas.
   * Converts click position to world coordinates and emits MINIMAP_CLICK.
   * @param {MouseEvent} event
   */
  handleClick(event) {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Convert minimap coords to world coords
    const TILE_SIZE = SC.CONST.TILE_SIZE;
    const mapW = SC.CONST.MAP_WIDTH_TILES;
    const mapH = SC.CONST.MAP_HEIGHT_TILES;

    const worldX = (clickX / this.width) * mapW * TILE_SIZE;
    const worldY = (clickY / this.height) * mapH * TILE_SIZE;

    SC.EventBus.emit(SC.CONST.EVENT.MINIMAP_CLICK, {
      worldX: worldX,
      worldY: worldY,
    });
  },

  // ===== Internal helpers =====

  /**
   * Parse hex/CSS colors into RGBA arrays for terrain rendering.
   * Cached internally after first call.
   */
  _terrainColorCache: null,

  _getTerrainColorRGBA() {
    if (this._terrainColorCache) return this._terrainColorCache;

    const T = SC.CONST.TERRAIN;
    const C = SC.CONST.COLORS;

    this._terrainColorCache = {};
    this._terrainColorCache[T.GROUND] = this._parseColor(C.TERRAIN_GROUND);
    this._terrainColorCache[T.CLIFF] = this._parseColor(C.TERRAIN_CLIFF);
    this._terrainColorCache[T.WATER] = this._parseColor(C.TERRAIN_WATER);
    this._terrainColorCache[T.RAMP] = this._parseColor(C.TERRAIN_RAMP);

    return this._terrainColorCache;
  },

  /**
   * Parse a hex color string like '#5a4a32' to [r, g, b].
   */
  _parseColor(hex) {
    if (!hex || hex.charAt(0) !== '#') {
      return [90, 74, 50]; // fallback brown
    }
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return [r, g, b];
  },
};
