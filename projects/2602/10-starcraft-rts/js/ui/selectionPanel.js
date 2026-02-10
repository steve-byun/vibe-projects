// === StarCraft RTS Clone - Selection Panel ===
// Displays info about selected entities: single unit, single building, or multi-select.
// Listens for SELECTION_CHANGED event.
// Exposed at window.SC.SelectionPanel

window.SC = window.SC || {};

window.SC.SelectionPanel = {
  container: null,

  /**
   * Initialize the selection panel.
   * Cache the container and bind event listeners.
   */
  init() {
    this.container = document.getElementById('panel-selection');

    // Listen for selection changes
    if (SC.EventBus) {
      SC.EventBus.on(SC.CONST.EVENT.SELECTION_CHANGED, (data) => {
        const gameState = SC.Engine ? SC.Engine.gameState : null;
        if (!gameState) {
          this.update([]);
          return;
        }

        // Get selected entities from the selection system
        let entities = [];
        if (SC.Selection && SC.Selection.getSelectedEntities) {
          entities = SC.Selection.getSelectedEntities(gameState);
        } else if (data && data.ids && data.ids.length > 0) {
          // Fallback: manually look up entities
          entities = data.ids
            .map(id => gameState.entities ? gameState.entities[id] : null)
            .filter(e => e && e.alive);
        }

        this.update(entities);
      });

      // Also update periodically during game ticks for HP/progress changes
      SC.EventBus.on(SC.CONST.EVENT.GAME_TICK, () => {
        this._refreshIfNeeded();
      });
    }
  },

  /** Track current selection for periodic refresh */
  _currentIds: [],

  /**
   * Update the selection panel display.
   * @param {Array} selectedEntities - Array of entity objects
   */
  update(selectedEntities) {
    if (!this.container) return;

    // Filter to alive entities only
    const entities = (selectedEntities || []).filter(e => e && e.alive);

    // Track IDs for periodic refresh
    this._currentIds = entities.map(e => e.id);

    // Clear panel
    this.container.innerHTML = '';

    if (entities.length === 0) {
      // No selection
      return;
    }

    if (entities.length === 1) {
      // Single entity selected
      const entity = entities[0];
      if (entity.type === 'unit') {
        this._renderSingleUnit(entity);
      } else if (entity.type === 'building') {
        this._renderSingleBuilding(entity);
      } else if (entity.type === 'resource') {
        this._renderResource(entity);
      }
    } else {
      // Multi-select
      this._renderMultiSelect(entities);
    }
  },

  /**
   * Refresh the panel display if entities are currently selected.
   * Called on game tick for live HP/progress updates.
   */
  _refreshIfNeeded() {
    if (this._currentIds.length === 0) return;

    const gameState = SC.Engine ? SC.Engine.gameState : null;
    if (!gameState || !gameState.entities) return;

    const entities = this._currentIds
      .map(id => gameState.entities[id])
      .filter(e => e && e.alive);

    // If selection changed (entities died), do a full update
    if (entities.length !== this._currentIds.length) {
      this.update(entities);
      return;
    }

    // For single selection, update HP bar and progress in-place for performance
    if (entities.length === 1) {
      const entity = entities[0];
      const hpFill = this.container.querySelector('.sel-hp-fill');
      if (hpFill && entity.maxHp > 0) {
        const ratio = entity.hp / entity.maxHp;
        hpFill.style.width = (ratio * 100) + '%';
        hpFill.className = 'sel-hp-fill' + this._getHpClass(ratio);
      }

      const hpText = this.container.querySelector('.sel-hp-text');
      if (hpText) {
        hpText.textContent = 'HP: ' + Math.ceil(entity.hp) + '/' + entity.maxHp;
      }

      // Update build progress
      if (entity.type === 'building' && entity.state === SC.CONST.BUILDING_STATE.CONSTRUCTING) {
        const progressFill = this.container.querySelector('.sel-progress-fill');
        if (progressFill && entity.buildProgress !== undefined) {
          progressFill.style.width = (entity.buildProgress * 100) + '%';
        }
      }

      // Update training queue
      if (entity.type === 'building' && entity.trainingQueue) {
        const queueContainer = this.container.querySelector('.sel-train-queue');
        if (queueContainer) {
          this._updateTrainingQueue(queueContainer, entity);
        }
      }
    }
  },

  /**
   * Render a single unit's info.
   * @param {object} entity - Unit entity
   */
  _renderSingleUnit(entity) {
    const C = SC.CONST;
    const unitData = SC.UNIT_DATA ? SC.UNIT_DATA[entity.subType] : null;
    const playerColor = entity.owner === C.PLAYER.HUMAN ? C.COLORS.PLAYER_1 : C.COLORS.PLAYER_2;
    const hpRatio = entity.maxHp > 0 ? entity.hp / entity.maxHp : 1;

    const name = unitData ? unitData.name : (entity.subType || 'Unit');
    const damage = unitData ? unitData.damage : (entity.damage || 0);
    const armor = unitData ? unitData.armor : (entity.armor || 0);
    const speed = unitData ? unitData.speed : (entity.speed || 0);

    const html = `
      <div class="sel-single">
        <div class="sel-portrait" style="background: ${playerColor}"></div>
        <div class="sel-info">
          <div class="sel-name">${this._escapeHtml(name)}</div>
          <div class="sel-hp-bar">
            <div class="sel-hp-fill${this._getHpClass(hpRatio)}" style="width: ${hpRatio * 100}%"></div>
          </div>
          <div class="sel-stats">
            <span class="sel-hp-text">HP: ${Math.ceil(entity.hp)}/${entity.maxHp}</span>
            | DMG: ${damage} | ARM: ${armor} | SPD: ${speed.toFixed(1)}
          </div>
          ${entity.state ? '<div class="sel-stats">State: ' + this._escapeHtml(entity.state) + '</div>' : ''}
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  },

  /**
   * Render a single building's info.
   * @param {object} entity - Building entity
   */
  _renderSingleBuilding(entity) {
    const C = SC.CONST;
    const buildingData = SC.BUILDING_DATA ? SC.BUILDING_DATA[entity.subType] : null;
    const playerColor = entity.owner === C.PLAYER.HUMAN ? C.COLORS.PLAYER_1 : C.COLORS.PLAYER_2;
    const drawColor = buildingData ? buildingData.drawColor : playerColor;
    const hpRatio = entity.maxHp > 0 ? entity.hp / entity.maxHp : 1;
    const name = buildingData ? buildingData.name : (entity.subType || 'Building');

    let progressHtml = '';
    if (entity.state === C.BUILDING_STATE.CONSTRUCTING && entity.buildProgress !== undefined) {
      const pct = (entity.buildProgress * 100).toFixed(0);
      progressHtml = `
        <div class="sel-progress-bar">
          <div class="sel-progress-fill" style="width: ${pct}%"></div>
        </div>
        <div class="sel-stats">Building... ${pct}%</div>
      `;
    }

    let trainQueueHtml = '';
    if (entity.state === C.BUILDING_STATE.ACTIVE && entity.trainingQueue && entity.trainingQueue.length > 0) {
      trainQueueHtml = '<div class="sel-train-queue">';
      for (let i = 0; i < entity.trainingQueue.length; i++) {
        const item = entity.trainingQueue[i];
        const unitName = (SC.UNIT_DATA && SC.UNIT_DATA[item.unitType])
          ? SC.UNIT_DATA[item.unitType].name
          : item.unitType;
        const isActive = i === 0;
        const timeLeft = isActive && item.timeLeft != null ? ' (' + Math.ceil(item.timeLeft) + 's)' : '';
        trainQueueHtml += `<div class="train-item${isActive ? ' active' : ''}">${this._escapeHtml(unitName)}${timeLeft}</div>`;
      }
      trainQueueHtml += '</div>';
    }

    const html = `
      <div class="sel-single">
        <div class="sel-portrait building-portrait" style="background: ${drawColor}"></div>
        <div class="sel-info">
          <div class="sel-name">${this._escapeHtml(name)}</div>
          <div class="sel-hp-bar">
            <div class="sel-hp-fill${this._getHpClass(hpRatio)}" style="width: ${hpRatio * 100}%"></div>
          </div>
          <div class="sel-stats">
            <span class="sel-hp-text">HP: ${Math.ceil(entity.hp)}/${entity.maxHp}</span>
          </div>
          ${progressHtml}
          ${trainQueueHtml}
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  },

  /**
   * Render resource info (mineral/geyser).
   * @param {object} entity - Resource entity
   */
  _renderResource(entity) {
    const C = SC.CONST;
    const isMineral = entity.subType === 'mineral';
    const color = isMineral ? C.COLORS.MINERAL : C.COLORS.GAS;
    const name = isMineral ? 'Mineral Field' : 'Vespene Geyser';
    const amount = entity.amount != null ? entity.amount : '???';

    const html = `
      <div class="sel-single">
        <div class="sel-portrait" style="background: ${color}"></div>
        <div class="sel-info">
          <div class="sel-name">${name}</div>
          <div class="sel-stats">Remaining: ${amount}</div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  },

  /**
   * Render multi-select view with grouped unit icons.
   * @param {Array} entities - Array of selected entities
   */
  _renderMultiSelect(entities) {
    const C = SC.CONST;

    // Group by subType
    const groups = {};
    for (const entity of entities) {
      const key = entity.subType || entity.type || 'unknown';
      if (!groups[key]) {
        groups[key] = { entities: [], subType: key, type: entity.type };
      }
      groups[key].entities.push(entity);
    }

    let html = '<div class="sel-multi">';

    for (const key in groups) {
      const group = groups[key];
      const count = group.entities.length;
      const sample = group.entities[0];

      // Determine visual
      let color;
      if (sample.type === 'unit') {
        const unitData = SC.UNIT_DATA ? SC.UNIT_DATA[sample.subType] : null;
        color = (unitData && unitData.drawColor) ||
                (sample.owner === C.PLAYER.HUMAN ? C.COLORS.PLAYER_1 : C.COLORS.PLAYER_2);
      } else if (sample.type === 'building') {
        const bData = SC.BUILDING_DATA ? SC.BUILDING_DATA[sample.subType] : null;
        color = (bData && bData.drawColor) ||
                (sample.owner === C.PLAYER.HUMAN ? C.COLORS.PLAYER_1 : C.COLORS.PLAYER_2);
      } else {
        color = '#888888';
      }

      // Shape class for the dot
      let shapeClass = '';
      const unitData = SC.UNIT_DATA ? SC.UNIT_DATA[sample.subType] : null;
      if (unitData) {
        if (unitData.drawShape === 'rect') shapeClass = ' shape-rect';
        else if (unitData.drawShape === 'triangle') shapeClass = ' shape-triangle';
      }

      const displayName = this._getDisplayName(sample);

      html += `
        <div class="sel-unit-icon" title="${this._escapeHtml(displayName)} x${count}">
          <div class="unit-dot${shapeClass}" style="background: ${color}"></div>
          <span class="unit-count">${count}</span>
        </div>
      `;
    }

    html += '</div>';
    this.container.innerHTML = html;
  },

  /**
   * Update training queue display in-place.
   * @param {HTMLElement} queueContainer
   * @param {object} entity
   */
  _updateTrainingQueue(queueContainer, entity) {
    if (!entity.trainingQueue || entity.trainingQueue.length === 0) {
      queueContainer.innerHTML = '';
      return;
    }

    const items = [];
    for (let i = 0; i < entity.trainingQueue.length; i++) {
      const item = entity.trainingQueue[i];
      const unitName = (SC.UNIT_DATA && SC.UNIT_DATA[item.unitType])
        ? SC.UNIT_DATA[item.unitType].name
        : item.unitType;
      const isActive = i === 0;
      const timeLeft = isActive && item.timeLeft != null ? ' (' + Math.ceil(item.timeLeft) + 's)' : '';
      items.push(`<div class="train-item${isActive ? ' active' : ''}">${this._escapeHtml(unitName)}${timeLeft}</div>`);
    }
    queueContainer.innerHTML = items.join('');
  },

  /**
   * Get HP CSS class based on ratio.
   * @param {number} ratio - HP ratio 0..1
   * @returns {string} CSS class suffix
   */
  _getHpClass(ratio) {
    if (ratio > 0.6) return '';
    if (ratio > 0.3) return ' hp-mid';
    return ' hp-low';
  },

  /**
   * Get display name for an entity.
   * @param {object} entity
   * @returns {string}
   */
  _getDisplayName(entity) {
    if (entity.type === 'unit' && SC.UNIT_DATA && SC.UNIT_DATA[entity.subType]) {
      return SC.UNIT_DATA[entity.subType].name;
    }
    if (entity.type === 'building' && SC.BUILDING_DATA && SC.BUILDING_DATA[entity.subType]) {
      return SC.BUILDING_DATA[entity.subType].name;
    }
    return entity.subType || entity.type || 'Unknown';
  },

  /**
   * Escape HTML characters to prevent injection.
   * @param {string} str
   * @returns {string}
   */
  _escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },
};
