// === StarCraft RTS Clone - Tech Tree & AI Build Orders ===
// Defines building prerequisites, training prerequisites, and AI build order sequences.
// Exposed at window.SC.TECH_DATA

window.SC = window.SC || {};

window.SC.TECH_DATA = {
  // Which buildings must exist before you can build this building
  buildRequirements: {
    command_center: [],
    supply_depot: [],
    barracks: ['supply_depot'],
    refinery: [],
    factory: ['barracks'],
    engineering_bay: ['command_center'],
    starport: ['factory'],
    bunker: ['barracks'],
    missile_turret: ['engineering_bay'],
  },

  // Which buildings must exist before you can train this unit
  trainRequirements: {
    scv: [],
    marine: [],
    medic: [],
    siege_tank: [],
    wraith: [],
  },

  // AI build order sequences — each entry is a building subType to construct next
  aiBuildOrders: {
    standard: [
      'supply_depot',
      'barracks',
      'refinery',
      'supply_depot',
      'barracks',
      'factory',
      'supply_depot',
      'starport',
      'supply_depot',
      'engineering_bay',
    ],
  },
};
