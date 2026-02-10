// === StarCraft RTS Clone - Game Engine ===
// Main game loop, state management, tick/render pipeline, entity lifecycle.
// Exposes at window.SC.Engine

window.SC = window.SC || {};

window.SC.Engine = {
  // --- Public state ---
  gameState: null,
  running: false,
  lastTime: 0,

  // --- Internal ---
  _animFrameId: null,
  _accumulator: 0,
  _tickRate: 1 / 60,   // fixed timestep ~60 FPS

  /**
   * Initialize the engine: set up canvas, renderer, camera, input,
   * register event handlers, and show the title screen.
   */
  init() {
    const C = SC.CONST;

    // Get canvas and set size
    const canvas = document.getElementById('game-canvas');
    canvas.width = C.CANVAS_WIDTH;
    canvas.height = C.CANVAS_HEIGHT;

    // Initialize core systems
    SC.Renderer.init(canvas);
    SC.Camera.init(C.CANVAS_WIDTH, C.CANVAS_HEIGHT);
    SC.Input.init(canvas);

    // --- Register input handlers ---

    // Mouse wheel -> camera zoom
    SC.Input.onWheel((delta, screenX, screenY) => {
      SC.Camera.applyZoom(delta, screenX, screenY);
    });

    // Left click
    SC.Input.onLeftClick((screenX, screenY, worldX, worldY, shiftKey) => {
      if (!this.gameState || this.gameState.phase !== 'playing') return;

      // If in build mode, confirm placement
      if (SC.BuildMenu && SC.BuildMenu.isActive && SC.BuildMenu.isActive()) {
        SC.BuildMenu.confirmPlacement(worldX, worldY);
        return;
      }

      // Otherwise, selection click
      if (SC.Selection) {
        SC.Selection.handleClick(worldX, worldY, shiftKey, this.gameState);
      }
    });

    // Right click
    SC.Input.onRightClick((screenX, screenY, worldX, worldY) => {
      if (!this.gameState || this.gameState.phase !== 'playing') return;

      // Cancel build mode if active
      if (SC.BuildMenu && SC.BuildMenu.isActive && SC.BuildMenu.isActive()) {
        SC.BuildMenu.cancelPlacement();
        return;
      }

      // Issue right-click command
      if (SC.Commands) {
        SC.Commands.processRightClick(worldX, worldY, this.gameState);
      }
    });

    // Double click
    SC.Input.onDoubleClick((screenX, screenY, worldX, worldY) => {
      if (!this.gameState || this.gameState.phase !== 'playing') return;

      if (SC.Selection) {
        SC.Selection.handleDoubleClick(worldX, worldY, this.gameState, SC.Camera);
      }
    });

    // Box select end (drag end)
    SC.Input.onDragEnd((rect) => {
      if (!this.gameState || this.gameState.phase !== 'playing') return;
      if (!rect) return;

      if (SC.Selection) {
        // Convert screen rect to world rect
        const worldRect = SC.Input.getDragRectWorld(SC.Camera);
        if (worldRect) {
          SC.Selection.handleBoxSelect(worldRect, this.gameState);
        }
      }
    });

    // --- Keyboard hotkeys (via EventBus) ---
    SC.EventBus.on('input:keydown', (data) => {
      if (!this.gameState || this.gameState.phase !== 'playing') return;

      const { key, code, ctrlKey, shiftKey } = data;

      // Ctrl + 0-9: assign control group
      if (ctrlKey && key >= '0' && key <= '9') {
        if (SC.Selection) {
          SC.Selection.assignControlGroup(parseInt(key), this.gameState);
        }
        return;
      }

      // 0-9: recall control group
      if (!ctrlKey && key >= '0' && key <= '9') {
        if (SC.Selection) {
          SC.Selection.recallControlGroup(parseInt(key), this.gameState);
        }
        return;
      }

      // Hotkeys
      switch (key.toLowerCase()) {
        case SC.CONST.HOTKEYS.ATTACK_MOVE:
          // 'a' - set attack-move mode
          if (SC.Commands) {
            SC.Commands.setAttackMoveMode();
          }
          break;

        case SC.CONST.HOTKEYS.BUILD_BASIC:
          // 'b' - open basic build menu if SCV is selected
          if (SC.BuildMenu) {
            SC.BuildMenu.open('basic', this.gameState);
          }
          break;

        case SC.CONST.HOTKEYS.BUILD_ADVANCED:
          // 'v' - open advanced build menu
          if (SC.BuildMenu) {
            SC.BuildMenu.open('advanced', this.gameState);
          }
          break;

        case SC.CONST.HOTKEYS.STOP:
          // 's' - stop command
          if (SC.Commands) {
            SC.Commands.issueStop(this.gameState);
          }
          break;

        case SC.CONST.HOTKEYS.HOLD:
          // 'h' - hold position
          if (SC.Commands) {
            SC.Commands.issueHold(this.gameState);
          }
          break;

        case SC.CONST.HOTKEYS.PATROL:
          // 'p' - patrol
          if (SC.Commands) {
            SC.Commands.setPatrolMode();
          }
          break;

        case 'escape':
          // Cancel build menu / deselect
          if (SC.BuildMenu && SC.BuildMenu.isActive && SC.BuildMenu.isActive()) {
            SC.BuildMenu.cancelPlacement();
          } else if (SC.Selection) {
            SC.Selection.clearSelection();
          }
          break;
      }
    });

    // --- GAME_START event ---
    SC.EventBus.on(SC.CONST.EVENT.GAME_START, () => {
      this._startGame();
    });

    // --- MINIMAP_CLICK event ---
    SC.EventBus.on(SC.CONST.EVENT.MINIMAP_CLICK, (data) => {
      if (data && data.worldX !== undefined && data.worldY !== undefined) {
        SC.Camera.centerOn(data.worldX, data.worldY);
      }
    });

    // --- UI buttons ---
    const btnStart = document.getElementById('btn-start');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        SC.EventBus.emit(SC.CONST.EVENT.GAME_START);
      });
    }

    const btnRestartVictory = document.getElementById('btn-restart-victory');
    if (btnRestartVictory) {
      btnRestartVictory.addEventListener('click', () => {
        this.restart();
      });
    }

    const btnRestartDefeat = document.getElementById('btn-restart-defeat');
    if (btnRestartDefeat) {
      btnRestartDefeat.addEventListener('click', () => {
        this.restart();
      });
    }
  },

  /**
   * Start the game loop.
   */
  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this._accumulator = 0;
    this._loop(this.lastTime);
  },

  /**
   * Stop the game loop.
   */
  stop() {
    this.running = false;
    if (this._animFrameId) {
      cancelAnimationFrame(this._animFrameId);
      this._animFrameId = null;
    }
  },

  /**
   * Restart: reset everything and go back to title screen.
   */
  restart() {
    this.stop();

    // Reset entity ID counter
    window.SC._nextEntityId = 1;

    // Clear existing state
    this.gameState = null;

    // Hide all screens, show title
    this._showScreen('screen-title');

    // Clear selection
    if (SC.Selection) {
      SC.Selection.clearSelection();
    }
  },

  /**
   * Main game loop via requestAnimationFrame.
   * Uses fixed timestep accumulator for deterministic simulation.
   * @param {number} timestamp
   */
  _loop(timestamp) {
    if (!this.running) return;

    const frameTime = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    // Clamp frame time to prevent spiral of death
    const clampedFrameTime = Math.min(frameTime, 0.1);
    this._accumulator += clampedFrameTime;

    // Fixed timestep simulation
    while (this._accumulator >= this._tickRate) {
      this._tick(this._tickRate);
      this._accumulator -= this._tickRate;
    }

    // Render at display rate
    this._render();

    this._animFrameId = requestAnimationFrame((ts) => this._loop(ts));
  },

  /**
   * Simulation update (fixed timestep).
   * Follows the exact tick pipeline order specified.
   * @param {number} dt - fixed delta time in seconds
   */
  _tick(dt) {
    const gs = this.gameState;
    if (!gs || gs.phase !== 'playing') return;

    gs.tick++;
    gs.time += dt;

    // 1. Update input world coords
    SC.Input.updateWorldCoords(SC.Camera);

    // 2. Update camera (edge scroll, keys, clamp)
    SC.Camera.update(dt);

    // 3. Fog of war recalculation
    if (SC.Fog && gs.fog) {
      try {
        const allEntities = Object.values(gs.entities);
        SC.Fog.update(allEntities, gs.fog);
      } catch (e) { /* guard */ }
    }

    // 4. Harvesting (SCV resource gathering)
    if (SC.Harvesting) {
      try { SC.Harvesting.update(dt, gs); } catch (e) { /* guard */ }
    }

    // 5. Production (construction + training)
    if (SC.Production) {
      try { SC.Production.update(dt, gs); } catch (e) { /* guard */ }
    }

    // 6. Update each unit
    for (const unitId of gs.units) {
      const unit = gs.entities[unitId];
      if (unit && unit.alive && unit.update) {
        try { unit.update(dt, gs); } catch (e) { /* guard */ }
      }
    }

    // 7. Update each building
    for (const buildingId of gs.buildings) {
      const building = gs.entities[buildingId];
      if (building && building.alive && building.update) {
        try { building.update(dt, gs); } catch (e) { /* guard */ }
      }
    }

    // 8. Combat (damage, projectiles)
    if (SC.Combat) {
      try { SC.Combat.update(dt, gs); } catch (e) { /* guard */ }
    }

    // 9. AI decisions
    if (SC.AI) {
      try { SC.AI.update(dt, gs); } catch (e) { /* guard */ }
    }

    // 10. Cleanup dead entities
    this._cleanupDead();

    // 11. Check win/lose conditions
    this._checkEndConditions();
  },

  /**
   * Render the current game state to the canvas.
   * Follows the exact render pipeline order specified.
   */
  _render() {
    const gs = this.gameState;
    if (!gs) return;

    const camera = SC.Camera;
    const renderer = SC.Renderer;

    // 1. Clear canvas
    renderer.clear();

    // Only render game world when we have a map
    if (gs.map) {
      // 2. Draw terrain
      renderer.drawTerrain(gs.map, gs.fog, camera);

      // 3. Draw entities
      renderer.drawEntities(gs, camera, gs.fog);

      // 4. Draw selection indicators
      if (SC.Selection) {
        renderer.drawSelectionIndicators(
          SC.Selection.selectedIds || [],
          gs,
          camera
        );
      }

      // 5. Draw selection box (drag rect)
      renderer.drawSelectionBox(SC.Input.getDragRect());

      // 6. Draw build preview
      if (SC.BuildMenu && SC.BuildMenu.isActive && SC.BuildMenu.isActive()) {
        const preview = SC.BuildMenu.getPreview
          ? SC.BuildMenu.getPreview(SC.Input.mouse.worldX, SC.Input.mouse.worldY)
          : null;
        if (preview) {
          renderer.drawBuildPreview(
            preview.buildingId,
            preview.tileX,
            preview.tileY,
            preview.isValid,
            camera
          );
        }
      }

      // 7. Draw fog of war (AFTER entities, covers them)
      renderer.drawFog(gs.fog, camera);

      // 8. Minimap
      if (SC.Minimap) {
        try {
          SC.Minimap.render(gs.map, gs.fog, gs, camera);
        } catch (e) { /* guard */ }
      }
    }

    // 9-11. UI updates (DOM-based)
    if (SC.HUD && gs.players) {
      try {
        const p = gs.players[SC.CONST.PLAYER.HUMAN];
        if (p) {
          SC.HUD.updateResources(p.minerals, p.gas, p.supplyUsed, p.supplyMax);
        }
      } catch (e) { /* guard */ }
    }

    if (SC.SelectionPanel) {
      try { SC.SelectionPanel.update(SC.Selection ? SC.Selection.selectedIds : [], gs); } catch (e) { /* guard */ }
    }

    if (SC.CommandPanel) {
      try { SC.CommandPanel.update(SC.Selection ? SC.Selection.selectedIds : [], gs); } catch (e) { /* guard */ }
    }
  },

  /**
   * Create the initial game state object.
   * @returns {object} gameState
   */
  _createGameState() {
    const C = SC.CONST;
    return {
      phase: 'playing',
      tick: 0,
      time: 0.0,
      players: {
        1: {
          id: 1,
          minerals: C.STARTING_MINERALS,
          gas: C.STARTING_GAS,
          supplyUsed: 0,
          supplyMax: 0,
        },
        2: {
          id: 2,
          minerals: C.STARTING_MINERALS,
          gas: C.STARTING_GAS,
          supplyUsed: 0,
          supplyMax: 0,
        },
      },
      entities: {},
      units: [],
      buildings: [],
      resources: [],
      projectiles: [],
      map: null,
      fog: null,
    };
  },

  /**
   * Register an entity into the game state.
   * @param {object} entity
   */
  _registerEntity(entity) {
    const gs = this.gameState;
    if (!gs) return;

    gs.entities[entity.id] = entity;

    switch (entity.type) {
      case 'unit':
        gs.units.push(entity.id);
        break;
      case 'building':
        gs.buildings.push(entity.id);
        break;
      case 'resource':
        gs.resources.push(entity.id);
        break;
      case 'projectile':
        gs.projectiles.push(entity.id);
        break;
    }

    SC.EventBus.emit(SC.CONST.EVENT.ENTITY_CREATED, { entity });
  },

  /**
   * Spawn starting entities for a player.
   * Command Center + 4 SCVs + 8 mineral patches + 1 vespene geyser.
   * @param {number} playerId - 1 (human) or 2 (AI)
   * @param {number} startTileX - tile X of starting area center
   * @param {number} startTileY - tile Y of starting area center
   */
  _spawnStartingEntities(playerId, startTileX, startTileY) {
    const C = SC.CONST;
    const tileSize = C.TILE_SIZE;

    // Center position in world pixels
    const centerX = startTileX * tileSize + tileSize;
    const centerY = startTileY * tileSize + tileSize;

    // --- Command Center ---
    const ccConfig = {
      type: 'building',
      subType: 'command_center',
      owner: playerId,
      x: centerX,
      y: centerY,
      maxHp: 1500,
      armor: 1,
      sightRange: 11,
    };

    // Pull from building data if available
    if (SC.BuildingData && SC.BuildingData.command_center) {
      const bd = SC.BuildingData.command_center;
      ccConfig.maxHp = bd.maxHp || ccConfig.maxHp;
      ccConfig.armor = bd.armor || ccConfig.armor;
      ccConfig.sightRange = bd.sightRange || ccConfig.sightRange;
    }

    let cc;
    if (SC.Building) {
      cc = new SC.Building(ccConfig);
    } else {
      cc = new SC.Entity(ccConfig);
    }
    // Set building size
    cc.size = { w: 4, h: 3 };
    if (SC.BuildingData && SC.BuildingData.command_center && SC.BuildingData.command_center.size) {
      cc.size = { ...SC.BuildingData.command_center.size };
    }
    cc.state = C.BUILDING_STATE.ACTIVE;
    cc.buildProgress = 1.0;
    cc.rallyPoint = null;
    // Supply provided
    cc.supplyProvided = 10;
    if (SC.BuildingData && SC.BuildingData.command_center && SC.BuildingData.command_center.supplyProvided !== undefined) {
      cc.supplyProvided = SC.BuildingData.command_center.supplyProvided;
    }

    this._registerEntity(cc);

    // Update supply
    if (this.gameState.players[playerId]) {
      this.gameState.players[playerId].supplyMax += cc.supplyProvided;
    }

    // --- 4 SCVs ---
    const scvOffsets = [
      { dx: -2, dy: 2 },
      { dx: -1, dy: 2 },
      { dx: 0, dy: 2 },
      { dx: 1, dy: 2 },
    ];

    for (const offset of scvOffsets) {
      const scvConfig = {
        type: 'unit',
        subType: 'scv',
        owner: playerId,
        x: centerX + offset.dx * tileSize,
        y: centerY + offset.dy * tileSize,
        maxHp: 60,
        armor: 0,
        sightRange: 7,
      };

      // Pull from unit data if available
      if (SC.UnitData && SC.UnitData.scv) {
        const ud = SC.UnitData.scv;
        scvConfig.maxHp = ud.maxHp || scvConfig.maxHp;
        scvConfig.armor = ud.armor || scvConfig.armor;
        scvConfig.sightRange = ud.sightRange || scvConfig.sightRange;
      }

      let scv;
      if (SC.Unit) {
        scv = new SC.Unit(scvConfig);
      } else {
        scv = new SC.Entity(scvConfig);
      }
      // Set visual properties
      scv.drawShape = 'rect';
      scv.drawRadius = 6;
      if (SC.UnitData && SC.UnitData.scv) {
        scv.drawShape = SC.UnitData.scv.drawShape || 'rect';
        scv.drawRadius = SC.UnitData.scv.drawRadius || 6;
        scv.speed = SC.UnitData.scv.speed || 60;
      }
      scv.state = C.UNIT_STATE.IDLE;
      scv.angle = 0;

      this._registerEntity(scv);

      // Update supply used
      const supplyCost = (SC.UnitData && SC.UnitData.scv) ? (SC.UnitData.scv.supplyCost || 1) : 1;
      if (this.gameState.players[playerId]) {
        this.gameState.players[playerId].supplyUsed += supplyCost;
      }
    }

    // --- 8 Mineral patches ---
    const mineralOffsets = [
      { dx: -5, dy: -4 }, { dx: -4, dy: -4 },
      { dx: -3, dy: -4 }, { dx: -2, dy: -4 },
      { dx: -5, dy: -3 }, { dx: -4, dy: -3 },
      { dx: -3, dy: -3 }, { dx: -2, dy: -3 },
    ];

    for (const offset of mineralOffsets) {
      const mineral = new SC.Entity({
        type: 'resource',
        subType: 'mineral',
        owner: C.PLAYER.NEUTRAL,
        x: centerX + offset.dx * tileSize,
        y: centerY + offset.dy * tileSize,
        maxHp: 0,
        sightRange: 0,
      });
      mineral.amount = C.MINERAL_PATCH_AMOUNT;
      this._registerEntity(mineral);
    }

    // --- 1 Vespene Geyser ---
    const geyser = new SC.Entity({
      type: 'resource',
      subType: 'geyser',
      owner: C.PLAYER.NEUTRAL,
      x: centerX + 5 * tileSize,
      y: centerY - 3 * tileSize,
      maxHp: 0,
      sightRange: 0,
    });
    geyser.amount = C.GEYSER_AMOUNT;
    this._registerEntity(geyser);
  },

  /**
   * Remove dead entities from the game state at end of tick.
   */
  _cleanupDead() {
    const gs = this.gameState;
    if (!gs) return;

    const deadIds = [];

    for (const id in gs.entities) {
      const entity = gs.entities[id];
      if (!entity.alive) {
        deadIds.push(entity);
      }
    }

    for (const entity of deadIds) {
      const id = entity.id;

      // Remove from entities map
      delete gs.entities[id];

      // Remove from type arrays
      gs.units = gs.units.filter(uid => uid !== id);
      gs.buildings = gs.buildings.filter(bid => bid !== id);
      gs.resources = gs.resources.filter(rid => rid !== id);
      gs.projectiles = gs.projectiles.filter(pid => pid !== id);

      // Update supply if it was a unit
      if (entity.type === 'unit' && entity.owner) {
        const player = gs.players[entity.owner];
        if (player) {
          const supplyCost = entity.supplyCost || 1;
          player.supplyUsed = Math.max(0, player.supplyUsed - supplyCost);
        }
      }

      // Update supply max if it was a supply building
      if (entity.type === 'building' && entity.owner && entity.supplyProvided) {
        const player = gs.players[entity.owner];
        if (player) {
          player.supplyMax = Math.max(0, player.supplyMax - entity.supplyProvided);
        }
      }

      // Remove from selection
      if (SC.Selection && SC.Selection.selectedIds) {
        const idx = SC.Selection.selectedIds.indexOf(id);
        if (idx !== -1) {
          SC.Selection.selectedIds.splice(idx, 1);
        }
      }

      SC.EventBus.emit(SC.CONST.EVENT.ENTITY_DESTROYED, { entity });
    }
  },

  /**
   * Check win/lose conditions.
   * Win: all enemy buildings destroyed.
   * Lose: all player buildings destroyed.
   */
  _checkEndConditions() {
    const gs = this.gameState;
    if (!gs || gs.phase !== 'playing') return;

    const C = SC.CONST;

    let playerHasBuildings = false;
    let enemyHasBuildings = false;

    for (const bid of gs.buildings) {
      const b = gs.entities[bid];
      if (!b || !b.alive) continue;
      if (b.owner === C.PLAYER.HUMAN) playerHasBuildings = true;
      if (b.owner === C.PLAYER.AI) enemyHasBuildings = true;
    }

    if (!enemyHasBuildings && gs.tick > 10) {
      // Victory
      gs.phase = 'victory';
      this._onGameEnd('victory');
    } else if (!playerHasBuildings && gs.tick > 10) {
      // Defeat
      gs.phase = 'defeat';
      this._onGameEnd('defeat');
    }
  },

  /**
   * Handle game end (victory or defeat).
   * @param {'victory' | 'defeat'} result
   */
  _onGameEnd(result) {
    const gs = this.gameState;

    // Build stats string
    const timeMinutes = Math.floor(gs.time / 60);
    const timeSeconds = Math.floor(gs.time % 60);
    const statsText = `Time: ${timeMinutes}:${timeSeconds.toString().padStart(2, '0')} | Ticks: ${gs.tick}`;

    if (result === 'victory') {
      const statsEl = document.getElementById('victory-stats');
      if (statsEl) statsEl.textContent = statsText;
      this._showScreen('screen-victory');
    } else {
      const statsEl = document.getElementById('defeat-stats');
      if (statsEl) statsEl.textContent = statsText;
      this._showScreen('screen-defeat');
    }

    SC.EventBus.emit(SC.CONST.EVENT.GAME_OVER, { result, time: gs.time, tick: gs.tick });

    // Don't stop the loop entirely so the game world still renders behind the overlay
    // but set phase so _tick stops updating
  },

  /**
   * Internal: start a new game (called from GAME_START event).
   */
  _startGame() {
    const C = SC.CONST;

    // Reset entity ID counter
    window.SC._nextEntityId = 1;

    // Create fresh game state
    this.gameState = this._createGameState();

    // Generate map
    if (SC.Map) {
      try {
        this.gameState.map = SC.Map.generate
          ? SC.Map.generate(C.MAP_WIDTH_TILES, C.MAP_HEIGHT_TILES)
          : SC.Map;
        // If Map is an object with init method
        if (SC.Map.init) {
          SC.Map.init(C.MAP_WIDTH_TILES, C.MAP_HEIGHT_TILES);
          this.gameState.map = SC.Map;
        }
      } catch (e) {
        console.warn('Map generation failed, using fallback', e);
        this.gameState.map = this._createFallbackMap();
      }
    } else {
      this.gameState.map = this._createFallbackMap();
    }

    // Initialize fog of war
    if (SC.Fog) {
      try {
        if (SC.Fog.init) {
          SC.Fog.init(C.MAP_WIDTH_TILES, C.MAP_HEIGHT_TILES);
        }
        this.gameState.fog = SC.Fog;
      } catch (e) {
        console.warn('Fog init failed', e);
      }
    }

    // Initialize minimap
    if (SC.Minimap && SC.Minimap.init) {
      try {
        const minimapCanvas = document.getElementById('minimap-canvas');
        if (minimapCanvas) {
          SC.Minimap.init(minimapCanvas, this.gameState.map);
        }
      } catch (e) {
        console.warn('Minimap init failed', e);
      }
    }

    // Initialize selection system
    if (SC.Selection && SC.Selection.init) {
      try { SC.Selection.init(); } catch (e) { /* guard */ }
    }

    // Initialize command system
    if (SC.Commands && SC.Commands.init) {
      try { SC.Commands.init(); } catch (e) { /* guard */ }
    }

    // Initialize harvesting
    if (SC.Harvesting && SC.Harvesting.init) {
      try { SC.Harvesting.init(); } catch (e) { /* guard */ }
    }

    // Initialize production
    if (SC.Production && SC.Production.init) {
      try { SC.Production.init(); } catch (e) { /* guard */ }
    }

    // Initialize combat
    if (SC.Combat && SC.Combat.init) {
      try { SC.Combat.init(); } catch (e) { /* guard */ }
    }

    // Initialize AI
    if (SC.AI && SC.AI.init) {
      try { SC.AI.init(this.gameState); } catch (e) { /* guard */ }
    }

    // Initialize UI systems
    if (SC.HUD && SC.HUD.init) {
      try { SC.HUD.init(); } catch (e) { /* guard */ }
    }
    if (SC.SelectionPanel && SC.SelectionPanel.init) {
      try { SC.SelectionPanel.init(); } catch (e) { /* guard */ }
    }
    if (SC.CommandPanel && SC.CommandPanel.init) {
      try { SC.CommandPanel.init(); } catch (e) { /* guard */ }
    }
    if (SC.BuildMenu && SC.BuildMenu.init) {
      try { SC.BuildMenu.init(this.gameState); } catch (e) { /* guard */ }
    }
    if (SC.Screens && SC.Screens.init) {
      try { SC.Screens.init(); } catch (e) { /* guard */ }
    }

    // Spawn starting entities
    // Player 1 (Human): bottom-left area (~tile 16, 112)
    this._spawnStartingEntities(C.PLAYER.HUMAN, 16, 112);

    // Player 2 (AI): top-right area (~tile 112, 16)
    this._spawnStartingEntities(C.PLAYER.AI, 112, 16);

    // Center camera on player's starting position
    SC.Camera.centerOn(16 * C.TILE_SIZE, 112 * C.TILE_SIZE);

    // Hide title screen, show game
    this._showScreen(null);

    // Start the game loop
    this.start();
  },

  /**
   * Create a fallback flat map when SC.Map is not available.
   * @returns {object}
   */
  _createFallbackMap() {
    const C = SC.CONST;
    const tiles = [];
    for (let y = 0; y < C.MAP_HEIGHT_TILES; y++) {
      tiles[y] = [];
      for (let x = 0; x < C.MAP_WIDTH_TILES; x++) {
        tiles[y][x] = C.TERRAIN.GROUND;
      }
    }
    return {
      width: C.MAP_WIDTH_TILES,
      height: C.MAP_HEIGHT_TILES,
      tiles: tiles,
      getTile(tx, ty) {
        if (tx < 0 || ty < 0 || tx >= C.MAP_WIDTH_TILES || ty >= C.MAP_HEIGHT_TILES) {
          return C.TERRAIN.CLIFF;
        }
        return tiles[ty][tx];
      },
      isWalkable(tx, ty) {
        if (tx < 0 || ty < 0 || tx >= C.MAP_WIDTH_TILES || ty >= C.MAP_HEIGHT_TILES) {
          return false;
        }
        const t = tiles[ty][tx];
        return t === C.TERRAIN.GROUND || t === C.TERRAIN.RAMP;
      },
      isBuildable(tx, ty) {
        return this.isWalkable(tx, ty);
      },
    };
  },

  /**
   * Show a screen overlay or hide all.
   * Uses classList.add/remove('active') per team rules.
   * @param {string|null} screenId - element ID to show, or null to hide all
   */
  _showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    for (const screen of screens) {
      screen.classList.remove('active');
    }

    if (screenId) {
      const target = document.getElementById(screenId);
      if (target) {
        target.classList.add('active');
      }
    }
  },
};

// === Auto-initialize when DOM is ready ===
document.addEventListener('DOMContentLoaded', () => {
  SC.Engine.init();
});
