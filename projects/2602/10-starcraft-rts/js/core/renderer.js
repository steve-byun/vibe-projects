// === StarCraft RTS Clone - Renderer ===
// Handles all Canvas drawing: terrain, entities, fog, selection, build preview.
// Exposes at window.SC.Renderer

window.SC = window.SC || {};

window.SC.Renderer = {
  canvas: null,
  ctx: null,

  /**
   * Initialize the renderer with a canvas element.
   * @param {HTMLCanvasElement} canvasElement
   */
  init(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
  },

  /**
   * Clear the entire canvas.
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // Fill with black as default background (matches unexplored fog)
    this.ctx.fillStyle = SC.CONST.COLORS.FOG_UNEXPLORED;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },

  /**
   * Draw visible terrain tiles.
   * Uses checkerboard pattern with TERRAIN_GROUND / TERRAIN_GROUND_ALT.
   * @param {object} map - SC.Map with getTile(tileX, tileY)
   * @param {object} fog - SC.Fog with getState(tileX, tileY)
   * @param {object} camera - SC.Camera
   */
  drawTerrain(map, fog, camera) {
    if (!map || !camera) return;

    const C = SC.CONST;
    const ctx = this.ctx;
    const tileSize = C.TILE_SIZE;
    const visRect = camera.getVisibleRect();

    // Calculate visible tile range
    const startTileX = Math.max(0, Math.floor(visRect.x / tileSize));
    const startTileY = Math.max(0, Math.floor(visRect.y / tileSize));
    const endTileX = Math.min(C.MAP_WIDTH_TILES - 1, Math.ceil((visRect.x + visRect.w) / tileSize));
    const endTileY = Math.min(C.MAP_HEIGHT_TILES - 1, Math.ceil((visRect.y + visRect.h) / tileSize));

    for (let ty = startTileY; ty <= endTileY; ty++) {
      for (let tx = startTileX; tx <= endTileX; tx++) {
        // Skip fully unexplored tiles (they stay black from clear)
        if (fog) {
          const fogState = fog.getState ? fog.getState(tx, ty) : C.FOG.VISIBLE;
          if (fogState === C.FOG.UNEXPLORED) continue;
        }

        const terrain = map.getTile ? map.getTile(tx, ty) : C.TERRAIN.GROUND;
        const screen = camera.worldToScreen(tx * tileSize, ty * tileSize);
        const renderSize = Math.ceil(tileSize * camera.zoom);

        // Determine tile color
        let color;
        switch (terrain) {
          case C.TERRAIN.CLIFF:
            color = C.COLORS.TERRAIN_CLIFF;
            break;
          case C.TERRAIN.WATER:
            color = C.COLORS.TERRAIN_WATER;
            break;
          case C.TERRAIN.RAMP:
            color = C.COLORS.TERRAIN_RAMP;
            break;
          case C.TERRAIN.GROUND:
          default:
            // Checkerboard pattern for ground
            color = ((tx + ty) % 2 === 0)
              ? C.COLORS.TERRAIN_GROUND
              : C.COLORS.TERRAIN_GROUND_ALT;
            break;
        }

        ctx.fillStyle = color;
        ctx.fillRect(
          Math.floor(screen.x),
          Math.floor(screen.y),
          renderSize + 1, // +1 to avoid seams between tiles
          renderSize + 1
        );
      }
    }
  },

  /**
   * Draw fog of war overlay.
   * Semi-transparent for EXPLORED, solid black for UNEXPLORED.
   * Rendered AFTER entities so it covers them.
   * @param {object} fog - SC.Fog
   * @param {object} camera - SC.Camera
   */
  drawFog(fog, camera) {
    if (!fog || !camera) return;

    const C = SC.CONST;
    const ctx = this.ctx;
    const tileSize = C.TILE_SIZE;
    const visRect = camera.getVisibleRect();

    const startTileX = Math.max(0, Math.floor(visRect.x / tileSize));
    const startTileY = Math.max(0, Math.floor(visRect.y / tileSize));
    const endTileX = Math.min(C.MAP_WIDTH_TILES - 1, Math.ceil((visRect.x + visRect.w) / tileSize));
    const endTileY = Math.min(C.MAP_HEIGHT_TILES - 1, Math.ceil((visRect.y + visRect.h) / tileSize));

    for (let ty = startTileY; ty <= endTileY; ty++) {
      for (let tx = startTileX; tx <= endTileX; tx++) {
        const fogState = fog.getState ? fog.getState(tx, ty) : C.FOG.VISIBLE;
        if (fogState === C.FOG.VISIBLE) continue; // fully visible, no overlay

        const screen = camera.worldToScreen(tx * tileSize, ty * tileSize);
        const renderSize = Math.ceil(tileSize * camera.zoom);

        if (fogState === C.FOG.UNEXPLORED) {
          ctx.fillStyle = C.COLORS.FOG_UNEXPLORED;
        } else {
          // EXPLORED - semi-transparent
          ctx.fillStyle = C.COLORS.FOG_EXPLORED;
        }

        ctx.fillRect(
          Math.floor(screen.x),
          Math.floor(screen.y),
          renderSize + 1,
          renderSize + 1
        );
      }
    }
  },

  /**
   * Draw all entities (units, buildings, resources, projectiles).
   * Only draws entities visible to the human player (fog check).
   * @param {object} gameState
   * @param {object} camera - SC.Camera
   * @param {object} fog - SC.Fog
   */
  drawEntities(gameState, camera, fog) {
    if (!gameState || !camera) return;

    const C = SC.CONST;
    const ctx = this.ctx;
    const entities = gameState.entities;

    for (const id in entities) {
      const entity = entities[id];
      if (!entity || !entity.alive) continue;

      // Fog visibility check: only draw if tile is VISIBLE (or EXPLORED for buildings/resources)
      if (fog && fog.getState) {
        const tile = entity.getTilePos();
        const fogState = fog.getState(tile.tileX, tile.tileY);
        if (fogState === C.FOG.UNEXPLORED) continue;
        // Units in fog-of-war (explored but not visible) are hidden
        if (entity.type === 'unit' && fogState !== C.FOG.VISIBLE) continue;
        if (entity.type === 'projectile' && fogState !== C.FOG.VISIBLE) continue;
      }

      // Frustum cull: skip entities outside the visible viewport
      if (!camera.isVisible(entity.x, entity.y, C.TILE_SIZE * 3)) continue;

      const screen = camera.worldToScreen(entity.x, entity.y);

      switch (entity.type) {
        case 'unit':
          this._drawUnit(entity, screen, camera);
          break;
        case 'building':
          this._drawBuilding(entity, screen, camera);
          break;
        case 'resource':
          this._drawResource(entity, screen, camera);
          break;
        case 'projectile':
          this._drawProjectile(entity, screen, camera);
          break;
      }
    }
  },

  /**
   * Draw selection indicators (green circles/borders + HP bars) for selected entities.
   * @param {number[]} selectedIds
   * @param {object} gameState
   * @param {object} camera - SC.Camera
   */
  drawSelectionIndicators(selectedIds, gameState, camera) {
    if (!selectedIds || !gameState || !camera) return;

    const C = SC.CONST;
    const ctx = this.ctx;

    for (const id of selectedIds) {
      const entity = gameState.entities[id];
      if (!entity || !entity.alive) continue;
      if (!camera.isVisible(entity.x, entity.y, C.TILE_SIZE * 3)) continue;

      const screen = camera.worldToScreen(entity.x, entity.y);
      const zoom = camera.zoom;

      if (entity.type === 'unit') {
        // Green circle around unit
        const radius = (entity.drawRadius || 10) * zoom;
        ctx.strokeStyle = C.COLORS.SELECTION_CIRCLE;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, radius + 3 * zoom, 0, Math.PI * 2);
        ctx.stroke();
      } else if (entity.type === 'building') {
        // Green border around building
        const bw = (entity.size ? entity.size.w : 2) * C.TILE_SIZE * zoom;
        const bh = (entity.size ? entity.size.h : 2) * C.TILE_SIZE * zoom;
        ctx.strokeStyle = C.COLORS.SELECTION_BORDER;
        ctx.lineWidth = 2;
        ctx.strokeRect(
          screen.x - bw / 2,
          screen.y - bh / 2,
          bw,
          bh
        );
      }

      // HP bar
      this._drawHPBar(entity, screen, camera);
    }
  },

  /**
   * Draw the selection drag rectangle (screen coordinates).
   * @param {{ x1: number, y1: number, x2: number, y2: number } | null} rect
   */
  drawSelectionBox(rect) {
    if (!rect) return;

    const C = SC.CONST;
    const ctx = this.ctx;

    const x = rect.x1;
    const y = rect.y1;
    const w = rect.x2 - rect.x1;
    const h = rect.y2 - rect.y1;

    // Semi-transparent green fill
    ctx.fillStyle = C.COLORS.SELECTION_BOX;
    ctx.fillRect(x, y, w, h);

    // Green border
    ctx.strokeStyle = C.COLORS.SELECTION_BORDER;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
  },

  /**
   * Draw a ghost building preview at the given tile position.
   * Green if valid placement, red if invalid.
   * @param {string} buildingId - building subType (e.g. 'supply_depot')
   * @param {number} tileX
   * @param {number} tileY
   * @param {boolean} isValid
   * @param {object} camera - SC.Camera
   */
  drawBuildPreview(buildingId, tileX, tileY, isValid, camera) {
    if (!camera) return;

    const C = SC.CONST;
    const ctx = this.ctx;

    // Get building data to determine size
    let bw = 2;
    let bh = 2;
    if (SC.BuildingData && SC.BuildingData[buildingId]) {
      const bd = SC.BuildingData[buildingId];
      bw = bd.size ? bd.size.w : 2;
      bh = bd.size ? bd.size.h : 2;
    }

    const worldX = tileX * C.TILE_SIZE;
    const worldY = tileY * C.TILE_SIZE;
    const centerX = worldX + (bw * C.TILE_SIZE) / 2;
    const centerY = worldY + (bh * C.TILE_SIZE) / 2;
    const screen = camera.worldToScreen(centerX, centerY);

    const width = bw * C.TILE_SIZE * camera.zoom;
    const height = bh * C.TILE_SIZE * camera.zoom;

    // Ghost outline
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = isValid ? '#00ff00' : '#ff0000';
    ctx.fillRect(
      screen.x - width / 2,
      screen.y - height / 2,
      width,
      height
    );

    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = isValid ? '#00ff00' : '#ff0000';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      screen.x - width / 2,
      screen.y - height / 2,
      width,
      height
    );

    // Draw grid cells within the building footprint
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = isValid ? '#88ff88' : '#ff8888';
    ctx.lineWidth = 1;
    const cellSize = C.TILE_SIZE * camera.zoom;
    const startScreenX = screen.x - width / 2;
    const startScreenY = screen.y - height / 2;
    for (let dy = 0; dy < bh; dy++) {
      for (let dx = 0; dx < bw; dx++) {
        ctx.strokeRect(
          startScreenX + dx * cellSize,
          startScreenY + dy * cellSize,
          cellSize,
          cellSize
        );
      }
    }
    ctx.globalAlpha = 1.0;
  },

  // =====================
  // Internal draw helpers
  // =====================

  /**
   * Draw a unit entity.
   * Uses drawShape and drawRadius if available, otherwise defaults.
   */
  _drawUnit(entity, screen, camera) {
    const ctx = this.ctx;
    const zoom = camera.zoom;
    const color = entity.getColor();
    const radius = (entity.drawRadius || 8) * zoom;
    const shape = entity.drawShape || 'circle';

    ctx.fillStyle = color;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;

    switch (shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;

      case 'rect':
        ctx.fillRect(
          screen.x - radius,
          screen.y - radius,
          radius * 2,
          radius * 2
        );
        ctx.strokeRect(
          screen.x - radius,
          screen.y - radius,
          radius * 2,
          radius * 2
        );
        break;

      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(screen.x, screen.y - radius);
        ctx.lineTo(screen.x - radius, screen.y + radius);
        ctx.lineTo(screen.x + radius, screen.y + radius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(screen.x, screen.y - radius);
        ctx.lineTo(screen.x + radius, screen.y);
        ctx.lineTo(screen.x, screen.y + radius);
        ctx.lineTo(screen.x - radius, screen.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;

      default:
        // Fallback: circle
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
    }

    // Draw tiny direction indicator if unit has a facing angle
    if (entity.angle !== undefined && entity.angle !== null) {
      const indicatorLen = radius + 3 * zoom;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(screen.x, screen.y);
      ctx.lineTo(
        screen.x + Math.cos(entity.angle) * indicatorLen,
        screen.y + Math.sin(entity.angle) * indicatorLen
      );
      ctx.stroke();
    }
  },

  /**
   * Draw a building entity.
   * Colored rectangle sized by building.size.
   */
  _drawBuilding(entity, screen, camera) {
    const C = SC.CONST;
    const ctx = this.ctx;
    const zoom = camera.zoom;
    const color = entity.getColor();

    const bw = (entity.size ? entity.size.w : 2) * C.TILE_SIZE * zoom;
    const bh = (entity.size ? entity.size.h : 2) * C.TILE_SIZE * zoom;

    // Building body
    ctx.fillStyle = color;
    ctx.fillRect(
      screen.x - bw / 2,
      screen.y - bh / 2,
      bw,
      bh
    );

    // Darker border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      screen.x - bw / 2,
      screen.y - bh / 2,
      bw,
      bh
    );

    // Construction progress bar (if still building)
    if (entity.state === C.BUILDING_STATE.CONSTRUCTING && entity.buildProgress !== undefined) {
      const barWidth = bw * 0.8;
      const barHeight = 4 * zoom;
      const barX = screen.x - barWidth / 2;
      const barY = screen.y + bh / 2 + 4 * zoom;

      // Background
      ctx.fillStyle = C.COLORS.HP_BAR_BG;
      ctx.fillRect(barX, barY, barWidth, barHeight);

      // Progress fill
      ctx.fillStyle = C.COLORS.BUILD_PROGRESS;
      ctx.fillRect(barX, barY, barWidth * entity.buildProgress, barHeight);
    }

    // Draw building subType label (small text)
    if (entity.subType) {
      ctx.fillStyle = '#ffffff';
      ctx.font = `${Math.max(8, 10 * zoom)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = entity.subType.replace(/_/g, ' ').substring(0, 6).toUpperCase();
      ctx.fillText(label, screen.x, screen.y);
    }
  },

  /**
   * Draw a resource entity (mineral or geyser).
   */
  _drawResource(entity, screen, camera) {
    const C = SC.CONST;
    const ctx = this.ctx;
    const zoom = camera.zoom;
    const size = 12 * zoom;

    if (entity.subType === 'mineral') {
      // Blue diamond shape
      ctx.fillStyle = C.COLORS.MINERAL;
      ctx.beginPath();
      ctx.moveTo(screen.x, screen.y - size);
      ctx.lineTo(screen.x + size * 0.7, screen.y);
      ctx.lineTo(screen.x, screen.y + size * 0.6);
      ctx.lineTo(screen.x - size * 0.7, screen.y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#0088cc';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Crystal shine highlight
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.moveTo(screen.x - 2 * zoom, screen.y - size * 0.5);
      ctx.lineTo(screen.x + 2 * zoom, screen.y - size * 0.3);
      ctx.lineTo(screen.x, screen.y);
      ctx.closePath();
      ctx.fill();
    } else if (entity.subType === 'geyser') {
      // Green circle (geyser)
      ctx.fillStyle = C.COLORS.GAS;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, size, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#008800';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner ring
      ctx.strokeStyle = '#88ff88';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, size * 0.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Show remaining amount (small text)
    if (entity.amount !== undefined) {
      ctx.fillStyle = '#ffffff';
      ctx.font = `${Math.max(7, 8 * zoom)}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(entity.amount, screen.x, screen.y + size + 2 * zoom);
    }
  },

  /**
   * Draw a projectile entity.
   */
  _drawProjectile(entity, screen, camera) {
    const ctx = this.ctx;
    const zoom = camera.zoom;
    const size = 3 * zoom;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, size, 0, Math.PI * 2);
    ctx.fill();

    // Slight glow
    ctx.fillStyle = 'rgba(255,255,200,0.4)';
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, size * 2, 0, Math.PI * 2);
    ctx.fill();
  },

  /**
   * Draw HP bar above an entity.
   * Green > 60%, yellow > 30%, red otherwise.
   */
  _drawHPBar(entity, screen, camera) {
    if (!entity.maxHp || entity.maxHp <= 0) return;

    const C = SC.CONST;
    const ctx = this.ctx;
    const zoom = camera.zoom;

    const hpRatio = entity.hp / entity.maxHp;

    // Bar dimensions
    let barWidth;
    if (entity.type === 'building') {
      barWidth = (entity.size ? entity.size.w : 2) * C.TILE_SIZE * zoom * 0.8;
    } else {
      barWidth = (entity.drawRadius || 10) * 2 * zoom;
    }
    const barHeight = 3 * zoom;

    // Position above entity
    let barY;
    if (entity.type === 'building') {
      const bh = (entity.size ? entity.size.h : 2) * C.TILE_SIZE * zoom;
      barY = screen.y - bh / 2 - barHeight - 4 * zoom;
    } else {
      barY = screen.y - (entity.drawRadius || 10) * zoom - barHeight - 4 * zoom;
    }
    const barX = screen.x - barWidth / 2;

    // Background
    ctx.fillStyle = C.COLORS.HP_BAR_BG;
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // HP color
    let hpColor;
    if (hpRatio > 0.6) {
      hpColor = C.COLORS.HP_BAR_ALLY;
    } else if (hpRatio > 0.3) {
      hpColor = C.COLORS.HP_BAR_YELLOW;
    } else {
      hpColor = C.COLORS.HP_BAR_ENEMY;
    }

    ctx.fillStyle = hpColor;
    ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
  },
};
