// === StarCraft RTS Clone - Global Constants ===
// This is the SINGLE SOURCE OF TRUTH for all shared constants.
// Every other file depends on this. Do NOT duplicate values.

window.SC = window.SC || {};

window.SC.CONST = {
  // === Display ===
  CANVAS_WIDTH: 1280,
  CANVAS_HEIGHT: 720,
  TARGET_FPS: 60,

  // === World ===
  TILE_SIZE: 32,
  MAP_WIDTH_TILES: 128,
  MAP_HEIGHT_TILES: 128,
  MAP_WIDTH_PX: 128 * 32,  // 4096
  MAP_HEIGHT_PX: 128 * 32, // 4096

  // === Camera ===
  CAMERA_EDGE_SCROLL_SPEED: 500,
  CAMERA_EDGE_SCROLL_MARGIN: 20,
  CAMERA_ZOOM_MIN: 0.5,
  CAMERA_ZOOM_MAX: 2.0,
  CAMERA_ZOOM_STEP: 0.1,
  CAMERA_KEY_SCROLL_SPEED: 500,

  // === Resources ===
  STARTING_MINERALS: 50,
  STARTING_GAS: 0,
  MAX_SUPPLY: 200,
  MINERAL_PATCH_AMOUNT: 1500,
  GEYSER_AMOUNT: 5000,
  MINERAL_HARVEST_AMOUNT: 8,
  GAS_HARVEST_AMOUNT: 8,
  HARVEST_TIME: 2.0,        // seconds per harvest cycle
  RETURN_SPEED_BONUS: 1.3,  // SCVs move faster when returning resources

  // === Terrain Types ===
  TERRAIN: {
    GROUND: 0,
    CLIFF: 1,
    WATER: 2,
    RAMP: 3,
  },

  // === Fog of War States ===
  FOG: {
    UNEXPLORED: 0,
    EXPLORED: 1,
    VISIBLE: 2,
  },

  // === Player IDs ===
  PLAYER: {
    NEUTRAL: 0,
    HUMAN: 1,
    AI: 2,
  },

  // === Colors ===
  COLORS: {
    PLAYER_1: '#0042ff',
    PLAYER_2: '#ff0000',
    NEUTRAL: '#ffff00',
    MINERAL: '#00bfff',
    GAS: '#00ff00',
    FOG_UNEXPLORED: '#000000',
    FOG_EXPLORED: 'rgba(0,0,0,0.5)',
    TERRAIN_GROUND: '#5a4a32',
    TERRAIN_GROUND_ALT: '#554530',
    TERRAIN_CLIFF: '#3a3a3a',
    TERRAIN_WATER: '#1a3a5c',
    TERRAIN_RAMP: '#6a5a42',
    TERRAIN_BUILDABLE: '#5e4e36',
    SELECTION_BOX: 'rgba(0,255,0,0.15)',
    SELECTION_BORDER: '#00ff00',
    SELECTION_CIRCLE: '#00ff00',
    HP_BAR_BG: '#333333',
    HP_BAR_ALLY: '#00cc00',
    HP_BAR_ENEMY: '#cc0000',
    HP_BAR_YELLOW: '#cccc00',
    BUILD_PROGRESS: '#00aaff',
    MINIMAP_BG: '#111111',
    MINIMAP_CAMERA: 'rgba(255,255,255,0.8)',
    RALLY_LINE: '#ffff00',
  },

  // === Unit States ===
  UNIT_STATE: {
    IDLE: 'idle',
    MOVING: 'moving',
    ATTACKING: 'attacking',
    HARVESTING: 'harvesting',
    RETURNING: 'returning',
    BUILDING: 'building',
    PATROLLING: 'patrolling',
    HOLDING: 'holding',
    SIEGE_DEPLOYING: 'siege_deploying',
    SIEGE_MODE: 'siege_mode',
    SIEGE_UNDEPLOYING: 'siege_undeploying',
    HEALING: 'healing',
    DEAD: 'dead',
  },

  // === Building States ===
  BUILDING_STATE: {
    CONSTRUCTING: 'constructing',
    ACTIVE: 'active',
    DESTROYED: 'destroyed',
  },

  // === Command Types ===
  COMMAND: {
    MOVE: 'move',
    ATTACK: 'attack',
    ATTACK_MOVE: 'attack_move',
    PATROL: 'patrol',
    HOLD: 'hold',
    STOP: 'stop',
    BUILD: 'build',
    TRAIN: 'train',
    GATHER: 'gather',
    RETURN_CARGO: 'return_cargo',
    SIEGE: 'siege',
    UNSIEGE: 'unsiege',
    HEAL: 'heal',
    RALLY: 'rally',
  },

  // === Event Names (for EventBus) ===
  EVENT: {
    GAME_START: 'game:start',
    GAME_TICK: 'game:tick',
    GAME_RENDER: 'game:render',
    GAME_OVER: 'game:over',

    ENTITY_CREATED: 'entity:created',
    ENTITY_DESTROYED: 'entity:destroyed',
    ENTITY_DAMAGED: 'entity:damaged',

    UNIT_ORDER: 'unit:order',
    UNIT_STATE_CHANGE: 'unit:stateChange',

    BUILDING_COMPLETE: 'building:complete',
    BUILDING_START: 'building:start',
    TRAINING_COMPLETE: 'training:complete',
    TRAINING_START: 'training:start',

    SELECTION_CHANGED: 'selection:changed',
    COMMAND_ISSUED: 'command:issued',

    RESOURCES_CHANGED: 'resources:changed',
    SUPPLY_CHANGED: 'supply:changed',

    FOG_UPDATED: 'fog:updated',

    CAMERA_MOVED: 'camera:moved',
    MINIMAP_CLICK: 'minimap:click',

    UI_BUILD_MENU_OPEN: 'ui:buildMenuOpen',
    UI_BUILD_MENU_CLOSE: 'ui:buildMenuClose',
  },

  // === Hotkeys ===
  HOTKEYS: {
    ATTACK_MOVE: 'a',
    STOP: 's',
    HOLD: 'h',
    PATROL: 'p',
    BUILD_BASIC: 'b',
    BUILD_ADVANCED: 'v',
    CANCEL: 'Escape',
  },
};

// Global entity ID counter
window.SC._nextEntityId = 1;
