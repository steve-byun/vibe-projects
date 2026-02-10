// === StarCraft RTS Clone - AI Opponent ===
// Computer-controlled player 2. Builds a base, produces units, attacks in waves.
// Exposed at window.SC.AI

window.SC = window.SC || {};

window.SC.AI = {
  // --- Configuration ---
  playerId: 2,                // AI is always player 2
  state: 'opening',           // 'opening' | 'building' | 'attacking' | 'defending'
  buildOrderIndex: 0,         // Current step in the build order
  attackTimer: 0,             // Counts up toward attackInterval
  attackInterval: 180,        // Seconds between attack waves (3 minutes)
  lastAttackTime: 0,          // gameState.time of last attack launch
  scoutSent: false,
  targetSCVCount: 12,         // Desired number of SCVs
  _decisionTimer: 0,          // Timer to throttle AI decisions (every 0.5s)
  _decisionInterval: 0.5,     // How often the AI makes decisions (seconds)
  _trainCycle: 0,             // Counter for barracks training rotation (marine/marine/medic)
  _baseX: 0,                  // AI base center X in world pixels
  _baseY: 0,                  // AI base center Y in world pixels
  _baseTileX: 0,              // AI base center tile X
  _baseTileY: 0,              // AI base center tile Y
  _initialized: false,
  _previousState: 'opening',  // State to return to after defending

  /**
   * Initialize AI with starting position.
   * Called once at game start or lazily on first update.
   * @param {object} gameState
   */
  _init(gameState) {
    // Find AI's command center to determine base location
    const myBuildings = this._getMyBuildings(gameState);
    let cc = null;
    for (let i = 0; i < myBuildings.length; i++) {
      if (myBuildings[i].subType === 'command_center') {
        cc = myBuildings[i];
        break;
      }
    }

    if (cc) {
      this._baseX = cc.x;
      this._baseY = cc.y;
      this._baseTileX = Math.floor(cc.x / SC.CONST.TILE_SIZE);
      this._baseTileY = Math.floor(cc.y / SC.CONST.TILE_SIZE);
    } else {
      // Fallback: use Player 2 start location from map data (top-right)
      this._baseTileX = 112;
      this._baseTileY = 16;
      this._baseX = this._baseTileX * SC.CONST.TILE_SIZE + SC.CONST.TILE_SIZE / 2;
      this._baseY = this._baseTileY * SC.CONST.TILE_SIZE + SC.CONST.TILE_SIZE / 2;
    }

    this._initialized = true;
    this.state = 'opening';
    this.buildOrderIndex = 0;
    this.attackTimer = 0;
    this.lastAttackTime = 0;
    this._trainCycle = 0;
    this.scoutSent = false;
    this._previousState = 'opening';
  },

  /**
   * Main AI update. Called every tick.
   * @param {number} dt - delta time in seconds
   * @param {object} gameState
   */
  update(dt, gameState) {
    if (!gameState || gameState.phase !== 'playing') return;

    // Lazy initialization
    if (!this._initialized) {
      this._init(gameState);
    }

    // Throttle decisions for performance: only decide every 0.5s
    this._decisionTimer += dt;
    if (this._decisionTimer < this._decisionInterval) return;
    this._decisionTimer = 0;

    // Phase transitions based on game time
    const time = gameState.time || 0;
    if (this.state === 'opening' && time >= 60) {
      this.state = 'building';
    }

    // Always check defense first
    this._handleDefense(gameState);

    // Core AI loops
    this._manageWorkers(gameState);
    this._executeBuildOrder(gameState);
    this._manageMilitary(gameState);
    this._manageSupply(gameState);
    this._decideAttack(gameState);
  },

  // ===========================
  // Worker Management
  // ===========================

  /**
   * Keep SCVs producing and harvesting.
   */
  _manageWorkers(gameState) {
    const workers = this._getMyWorkers(gameState);
    const workerCount = workers.length;

    // Train more SCVs if needed
    if (workerCount < this.targetSCVCount) {
      const cc = this._getMyCommandCenter(gameState);
      if (cc && cc.state === SC.CONST.BUILDING_STATE.ACTIVE) {
        // Check if CC is already training
        if (!cc.trainingQueue || cc.trainingQueue.length === 0) {
          // Check resources
          if (SC.Production && SC.Production.canAfford('scv', false, this.playerId, gameState)) {
            if (SC.Production && SC.Production.hasSupply(1, this.playerId, gameState)) {
              if (SC.Commands) {
                SC.Commands.issueTrainCommand(cc.id, 'scv', gameState);
              }
            }
          }
        }
      }
    }

    // Assign idle workers to mineral gathering
    const idleWorkers = this._getIdleWorkers(gameState);
    for (let i = 0; i < idleWorkers.length; i++) {
      const worker = idleWorkers[i];
      this._assignWorkerToResource(worker, gameState);
    }
  },

  /**
   * Assign a worker to the nearest mineral patch or gas.
   */
  _assignWorkerToResource(worker, gameState) {
    const entities = gameState.entities;
    let nearestMineral = null;
    let nearestDist = Infinity;

    // Look for nearest mineral patch
    for (let i = 0; i < gameState.resources.length; i++) {
      const resId = gameState.resources[i];
      const res = entities[resId];
      if (!res || !res.alive) continue;
      if (res.subType !== 'mineral') continue;
      if (res.amount !== undefined && res.amount <= 0) continue;

      const dx = worker.x - res.x;
      const dy = worker.y - res.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < nearestDist) {
        nearestMineral = res;
        nearestDist = dist;
      }
    }

    if (nearestMineral) {
      if (SC.Harvesting) {
        SC.Harvesting.assignToResource(worker.id, nearestMineral.id, gameState);
      } else if (SC.Commands) {
        SC.Commands.issueCommand(SC.CONST.COMMAND.GATHER, { targetId: nearestMineral.id }, gameState, [worker.id]);
      }
    }
  },

  // ===========================
  // Build Order Execution
  // ===========================

  /**
   * Follow the build order template step by step.
   */
  _executeBuildOrder(gameState) {
    const buildOrder = SC.TECH_DATA ? SC.TECH_DATA.aiBuildOrders.standard : null;
    if (!buildOrder) return;
    if (this.buildOrderIndex >= buildOrder.length) return;

    const nextBuilding = buildOrder[this.buildOrderIndex];
    const bData = SC.BUILDING_DATA ? SC.BUILDING_DATA[nextBuilding] : null;
    if (!bData) return;

    // Check if we can afford it
    const player = gameState.players[this.playerId];
    if (!player) return;

    const mineralCost = bData.mineralCost || 0;
    const gasCost = bData.gasCost || 0;

    if (player.minerals < mineralCost || player.gas < gasCost) return;

    // Check prerequisites
    if (SC.Production && !SC.Production.hasRequirements(nextBuilding, true, this.playerId, gameState)) return;

    // Find a free SCV to build
    const idleWorkers = this._getIdleWorkers(gameState);
    let builder = idleWorkers.length > 0 ? idleWorkers[0] : null;

    // If no idle workers, grab any harvesting worker
    if (!builder) {
      const workers = this._getMyWorkers(gameState);
      for (let i = 0; i < workers.length; i++) {
        if (workers[i].state === SC.CONST.UNIT_STATE.HARVESTING ||
            workers[i].state === SC.CONST.UNIT_STATE.RETURNING ||
            workers[i].state === SC.CONST.UNIT_STATE.IDLE) {
          builder = workers[i];
          break;
        }
      }
    }

    if (!builder) return;

    // Find a valid build location near the base
    const buildSize = bData.size || { w: 2, h: 2 };
    const location = this._findBuildLocation(this._baseTileX, this._baseTileY, buildSize, gameState);
    if (!location) return;

    // Issue build command
    if (SC.Commands) {
      SC.Commands.issueBuildCommand(nextBuilding, location.tileX, location.tileY, gameState, builder.id);
    }

    // Advance build order index
    this.buildOrderIndex++;
  },

  // ===========================
  // Military Management
  // ===========================

  /**
   * Train combat units from available production buildings.
   */
  _manageMilitary(gameState) {
    // Don't train military in opening phase
    if (this.state === 'opening') return;

    const buildings = this._getMyBuildings(gameState);
    const player = gameState.players[this.playerId];
    if (!player) return;

    for (let i = 0; i < buildings.length; i++) {
      const building = buildings[i];
      if (!building.alive) continue;
      if (building.state !== SC.CONST.BUILDING_STATE.ACTIVE) continue;

      const bData = SC.BUILDING_DATA ? SC.BUILDING_DATA[building.subType] : null;
      if (!bData || !bData.canTrain || bData.canTrain.length === 0) continue;

      // Skip command center (handled by worker management)
      if (building.subType === 'command_center') continue;

      // Check if building is already training
      if (building.trainingQueue && building.trainingQueue.length > 0) continue;

      // Determine what to train
      let unitToTrain = null;

      switch (building.subType) {
        case 'barracks':
          // Cycle: marine, marine, medic
          if (this._trainCycle % 3 === 2) {
            // Check if we can afford medic (needs gas)
            if (SC.Production && SC.Production.canAfford('medic', false, this.playerId, gameState)) {
              unitToTrain = 'medic';
            } else {
              unitToTrain = 'marine';
            }
          } else {
            unitToTrain = 'marine';
          }
          break;

        case 'factory':
          unitToTrain = 'siege_tank';
          break;

        case 'starport':
          unitToTrain = 'wraith';
          break;

        default:
          continue;
      }

      if (!unitToTrain) continue;

      // Check affordability and supply
      if (SC.Production) {
        if (!SC.Production.canAfford(unitToTrain, false, this.playerId, gameState)) continue;
        const unitData = SC.UNIT_DATA ? SC.UNIT_DATA[unitToTrain] : null;
        const supplyCost = unitData ? (unitData.supplyCost || 1) : 1;
        if (!SC.Production.hasSupply(supplyCost, this.playerId, gameState)) continue;
      } else {
        // Manual check if Production system not available
        const unitData = SC.UNIT_DATA ? SC.UNIT_DATA[unitToTrain] : null;
        if (!unitData) continue;
        if (player.minerals < (unitData.mineralCost || 0)) continue;
        if (player.gas < (unitData.gasCost || 0)) continue;
      }

      if (SC.Commands) {
        SC.Commands.issueTrainCommand(building.id, unitToTrain, gameState);
        if (building.subType === 'barracks') {
          this._trainCycle++;
        }
      }
    }
  },

  // ===========================
  // Supply Management
  // ===========================

  /**
   * Build supply depots when near capacity.
   */
  _manageSupply(gameState) {
    const player = gameState.players[this.playerId];
    if (!player) return;

    // Recalculate supply if Production system available
    if (SC.Production) {
      const supply = SC.Production.calculateSupply(this.playerId, gameState);
      if (supply) {
        player.supplyUsed = supply.used !== undefined ? supply.used : player.supplyUsed;
        player.supplyMax = supply.max !== undefined ? supply.max : player.supplyMax;
      }
    }

    const supplyUsed = player.supplyUsed || 0;
    const supplyMax = player.supplyMax || 0;

    // Don't exceed max supply cap
    if (supplyMax >= SC.CONST.MAX_SUPPLY) return;

    // Build a supply depot when within 4 of cap
    if (supplyUsed >= supplyMax - 4) {
      // Check if we're already building a supply depot
      const buildings = this._getMyBuildings(gameState);
      let buildingSupply = false;
      for (let i = 0; i < buildings.length; i++) {
        if (buildings[i].subType === 'supply_depot' &&
            buildings[i].state === SC.CONST.BUILDING_STATE.CONSTRUCTING) {
          buildingSupply = true;
          break;
        }
      }

      if (buildingSupply) return;

      const bData = SC.BUILDING_DATA ? SC.BUILDING_DATA['supply_depot'] : null;
      if (!bData) return;

      if (player.minerals < (bData.mineralCost || 100)) return;

      // Find an idle worker
      const idleWorkers = this._getIdleWorkers(gameState);
      let builder = idleWorkers.length > 0 ? idleWorkers[0] : null;

      if (!builder) {
        const workers = this._getMyWorkers(gameState);
        for (let i = 0; i < workers.length; i++) {
          if (workers[i].state === SC.CONST.UNIT_STATE.HARVESTING ||
              workers[i].state === SC.CONST.UNIT_STATE.RETURNING ||
              workers[i].state === SC.CONST.UNIT_STATE.IDLE) {
            builder = workers[i];
            break;
          }
        }
      }

      if (!builder) return;

      const buildSize = bData.size || { w: 2, h: 2 };
      const location = this._findBuildLocation(this._baseTileX, this._baseTileY, buildSize, gameState);
      if (!location) return;

      if (SC.Commands) {
        SC.Commands.issueBuildCommand('supply_depot', location.tileX, location.tileY, gameState, builder.id);
      }
    }
  },

  // ===========================
  // Attack Decision
  // ===========================

  /**
   * Decide when to attack the player.
   */
  _decideAttack(gameState) {
    // Don't attack while defending or in opening
    if (this.state === 'defending') return;
    if (this.state === 'opening') return;

    const combatUnits = this._getMyCombatUnits(gameState);
    const time = gameState.time || 0;

    // Attack if army is large enough OR timer expired
    const armySizeThreshold = 15;
    const timerExpired = time >= this.lastAttackTime + this.attackInterval;
    const armyReady = combatUnits.length >= armySizeThreshold;

    if (armyReady || (timerExpired && combatUnits.length >= 5)) {
      this._launchAttack(combatUnits, gameState);
    }
  },

  /**
   * Launch an attack toward the enemy base.
   */
  _launchAttack(combatUnits, gameState) {
    if (combatUnits.length === 0) return;

    this.state = 'attacking';
    this.lastAttackTime = gameState.time || 0;

    // Find attack target: enemy command center or nearest enemy building
    const targetPos = this._findAttackTarget(gameState);
    if (!targetPos) return;

    // Gather unit IDs
    const unitIds = [];
    for (let i = 0; i < combatUnits.length; i++) {
      unitIds.push(combatUnits[i].id);
    }

    // Issue attack-move command to all combat units
    if (SC.Commands) {
      SC.Commands.issueCommand(
        SC.CONST.COMMAND.ATTACK_MOVE,
        { x: targetPos.x, y: targetPos.y },
        gameState,
        unitIds
      );
    } else {
      // Fallback: manually set attack-move
      for (let i = 0; i < combatUnits.length; i++) {
        const unit = combatUnits[i];
        unit.state = SC.CONST.UNIT_STATE.MOVING;
        unit._isAttackMoving = true;
        unit.attackMoveTarget = { x: targetPos.x, y: targetPos.y };
      }
    }

    // After launching attack, return to building state for next wave
    // (will be set back once units idle or all dead)
    this._previousState = 'building';
    // Reset state after a short delay conceptually - set to building so AI keeps producing
    this.state = 'building';
  },

  /**
   * Find the position of the enemy's base (command center or nearest building).
   */
  _findAttackTarget(gameState) {
    const entities = gameState.entities;

    // Look for enemy command center first
    for (const id in entities) {
      const e = entities[id];
      if (!e || !e.alive) continue;
      if (e.owner === this.playerId || e.owner === SC.CONST.PLAYER.NEUTRAL) continue;
      if (e.type === 'building' && e.subType === 'command_center') {
        return { x: e.x, y: e.y };
      }
    }

    // Fallback: any enemy building
    for (const id in entities) {
      const e = entities[id];
      if (!e || !e.alive) continue;
      if (e.owner === this.playerId || e.owner === SC.CONST.PLAYER.NEUTRAL) continue;
      if (e.type === 'building') {
        return { x: e.x, y: e.y };
      }
    }

    // Fallback: any enemy unit
    for (const id in entities) {
      const e = entities[id];
      if (!e || !e.alive) continue;
      if (e.owner === this.playerId || e.owner === SC.CONST.PLAYER.NEUTRAL) continue;
      if (e.type === 'unit') {
        return { x: e.x, y: e.y };
      }
    }

    // Last resort: player 1 start location
    return {
      x: 16 * SC.CONST.TILE_SIZE + SC.CONST.TILE_SIZE / 2,
      y: 112 * SC.CONST.TILE_SIZE + SC.CONST.TILE_SIZE / 2,
    };
  },

  // ===========================
  // Defense
  // ===========================

  /**
   * Handle defense when enemy units are near the AI base.
   */
  _handleDefense(gameState) {
    const C = SC.CONST;
    const entities = gameState.entities;
    const defenseRange = 20 * C.TILE_SIZE; // 20 tiles around base

    // Check for enemy units near base
    let enemyNearBase = false;
    let nearestEnemyX = 0;
    let nearestEnemyY = 0;
    let nearestEnemyDist = Infinity;

    for (const id in entities) {
      const e = entities[id];
      if (!e || !e.alive) continue;
      if (e.owner === this.playerId || e.owner === C.PLAYER.NEUTRAL) continue;
      if (e.type !== 'unit') continue;

      const dx = e.x - this._baseX;
      const dy = e.y - this._baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < defenseRange) {
        enemyNearBase = true;
        if (dist < nearestEnemyDist) {
          nearestEnemyDist = dist;
          nearestEnemyX = e.x;
          nearestEnemyY = e.y;
        }
      }
    }

    if (enemyNearBase && this.state !== 'defending') {
      // Switch to defending
      this._previousState = this.state;
      this.state = 'defending';

      // Rally all combat units to defend
      const combatUnits = this._getMyCombatUnits(gameState);
      if (combatUnits.length > 0) {
        const unitIds = [];
        for (let i = 0; i < combatUnits.length; i++) {
          unitIds.push(combatUnits[i].id);
        }

        if (SC.Commands) {
          SC.Commands.issueCommand(
            C.COMMAND.ATTACK_MOVE,
            { x: nearestEnemyX, y: nearestEnemyY },
            gameState,
            unitIds
          );
        } else {
          for (let i = 0; i < combatUnits.length; i++) {
            const unit = combatUnits[i];
            unit.state = C.UNIT_STATE.MOVING;
            unit._isAttackMoving = true;
            unit.attackMoveTarget = { x: nearestEnemyX, y: nearestEnemyY };
          }
        }
      }
    } else if (!enemyNearBase && this.state === 'defending') {
      // Threat cleared, return to previous state
      this.state = this._previousState || 'building';
    }
  },

  // ===========================
  // Build Location Finding
  // ===========================

  /**
   * Spiral search from base position for a valid build location.
   * @param {number} baseX - tile X to search from
   * @param {number} baseY - tile Y to search from
   * @param {{ w: number, h: number }} buildingSize
   * @param {object} gameState
   * @returns {{ tileX: number, tileY: number } | null}
   */
  _findBuildLocation(baseX, baseY, buildingSize, gameState) {
    const map = gameState.map || SC.Map;
    if (!map) return null;

    // Collect existing buildings for overlap check
    const existingBuildings = [];
    const entities = gameState.entities;
    for (const id in entities) {
      const e = entities[id];
      if (!e || !e.alive) continue;
      if (e.type !== 'building') continue;
      const bData = SC.BUILDING_DATA ? SC.BUILDING_DATA[e.subType] : null;
      const size = bData ? (bData.size || { w: 2, h: 2 }) : { w: 2, h: 2 };
      const tile = e.getTilePos ? e.getTilePos() : { tileX: Math.floor(e.x / SC.CONST.TILE_SIZE), tileY: Math.floor(e.y / SC.CONST.TILE_SIZE) };
      existingBuildings.push({
        tileX: tile.tileX - Math.floor(size.w / 2),
        tileY: tile.tileY - Math.floor(size.h / 2),
        size: size,
      });
    }

    // Also add resources as obstacles
    for (let i = 0; i < gameState.resources.length; i++) {
      const resId = gameState.resources[i];
      const res = entities[resId];
      if (!res || !res.alive) continue;
      const tile = res.getTilePos ? res.getTilePos() : { tileX: Math.floor(res.x / SC.CONST.TILE_SIZE), tileY: Math.floor(res.y / SC.CONST.TILE_SIZE) };
      existingBuildings.push({
        tileX: tile.tileX,
        tileY: tile.tileY,
        size: { w: 1, h: 1 },
      });
    }

    const bw = buildingSize.w;
    const bh = buildingSize.h;

    // Spiral search outward from base
    for (let radius = 3; radius <= 25; radius++) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          // Only check tiles at the edge of the current radius ring
          if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;

          const tileX = baseX + dx;
          const tileY = baseY + dy;

          // Bounds check
          if (tileX < 2 || tileX + bw >= SC.CONST.MAP_WIDTH_TILES - 2) continue;
          if (tileY < 2 || tileY + bh >= SC.CONST.MAP_HEIGHT_TILES - 2) continue;

          // Check if buildable
          if (map.isBuildable && map.isBuildable(tileX, tileY, bw, bh, existingBuildings)) {
            return { tileX: tileX, tileY: tileY };
          }
        }
      }
    }

    return null;
  },

  // ===========================
  // Entity Queries
  // ===========================

  /**
   * Get all of AI's units.
   */
  _getMyUnits(gameState) {
    const result = [];
    const entities = gameState.entities;
    for (let i = 0; i < gameState.units.length; i++) {
      const id = gameState.units[i];
      const unit = entities[id];
      if (unit && unit.alive && unit.owner === this.playerId) {
        result.push(unit);
      }
    }
    return result;
  },

  /**
   * Get all of AI's buildings.
   */
  _getMyBuildings(gameState) {
    const result = [];
    const entities = gameState.entities;
    for (let i = 0; i < gameState.buildings.length; i++) {
      const id = gameState.buildings[i];
      const building = entities[id];
      if (building && building.alive && building.owner === this.playerId) {
        result.push(building);
      }
    }
    return result;
  },

  /**
   * Get AI's combat units (non-worker, non-healer).
   */
  _getMyCombatUnits(gameState) {
    const result = [];
    const entities = gameState.entities;
    for (let i = 0; i < gameState.units.length; i++) {
      const id = gameState.units[i];
      const unit = entities[id];
      if (!unit || !unit.alive || unit.owner !== this.playerId) continue;

      const unitData = SC.UNIT_DATA ? SC.UNIT_DATA[unit.subType] : null;
      if (!unitData) continue;
      if (unitData.isWorker) continue;
      if (unitData.isHealer) continue;

      result.push(unit);
    }
    return result;
  },

  /**
   * Get AI's workers (SCVs).
   */
  _getMyWorkers(gameState) {
    const result = [];
    const entities = gameState.entities;
    for (let i = 0; i < gameState.units.length; i++) {
      const id = gameState.units[i];
      const unit = entities[id];
      if (!unit || !unit.alive || unit.owner !== this.playerId) continue;

      const unitData = SC.UNIT_DATA ? SC.UNIT_DATA[unit.subType] : null;
      if (!unitData || !unitData.isWorker) continue;

      result.push(unit);
    }
    return result;
  },

  /**
   * Get AI's idle workers.
   */
  _getIdleWorkers(gameState) {
    const result = [];
    const workers = this._getMyWorkers(gameState);
    for (let i = 0; i < workers.length; i++) {
      if (workers[i].state === SC.CONST.UNIT_STATE.IDLE) {
        result.push(workers[i]);
      }
    }
    return result;
  },

  /**
   * Get the AI's main command center.
   */
  _getMyCommandCenter(gameState) {
    const buildings = this._getMyBuildings(gameState);
    for (let i = 0; i < buildings.length; i++) {
      if (buildings[i].subType === 'command_center' &&
          buildings[i].state === SC.CONST.BUILDING_STATE.ACTIVE) {
        return buildings[i];
      }
    }
    return null;
  },
};
