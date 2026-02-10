// === StarCraft RTS Clone - Base Entity Class ===
// All game objects (units, buildings, resources, projectiles) extend this.

window.SC = window.SC || {};

window.SC.Entity = class Entity {
  constructor(config) {
    this.id = window.SC._nextEntityId++;
    this.type = config.type;        // 'unit' | 'building' | 'projectile' | 'resource'
    this.subType = config.subType;  // e.g. 'marine', 'command_center', 'mineral'
    this.owner = config.owner || 0; // 0=neutral, 1=human, 2=AI
    this.x = config.x || 0;        // world pixel X
    this.y = config.y || 0;        // world pixel Y
    this.hp = config.maxHp || 0;
    this.maxHp = config.maxHp || 0;
    this.armor = config.armor || 0;
    this.alive = true;
    this.sightRange = config.sightRange || 0; // in tiles
  }

  /**
   * Apply damage to this entity.
   * @param {number} amount - raw damage before armor
   * @returns {{ died: boolean, actualDamage: number }}
   */
  takeDamage(amount) {
    const actualDamage = Math.max(1, amount - this.armor);
    this.hp -= actualDamage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
      return { died: true, actualDamage };
    }
    return { died: false, actualDamage };
  }

  /**
   * Check if another entity is an enemy.
   * Neutral entities (owner=0) are not enemies.
   */
  isEnemy(other) {
    if (this.owner === 0 || other.owner === 0) return false;
    return this.owner !== other.owner;
  }

  /**
   * Pixel distance to another entity.
   */
  distanceTo(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Tile-based distance to another entity.
   */
  tileDistanceTo(other) {
    return this.distanceTo(other) / SC.CONST.TILE_SIZE;
  }

  /**
   * Get the tile coordinates of this entity.
   */
  getTilePos() {
    return {
      tileX: Math.floor(this.x / SC.CONST.TILE_SIZE),
      tileY: Math.floor(this.y / SC.CONST.TILE_SIZE),
    };
  }

  /**
   * Get the player color for this entity.
   */
  getColor() {
    if (this.owner === SC.CONST.PLAYER.HUMAN) return SC.CONST.COLORS.PLAYER_1;
    if (this.owner === SC.CONST.PLAYER.AI) return SC.CONST.COLORS.PLAYER_2;
    return SC.CONST.COLORS.NEUTRAL;
  }
};
