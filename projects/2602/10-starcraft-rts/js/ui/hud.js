// === StarCraft RTS Clone - HUD (Resource Display) ===
// Displays minerals, gas, and supply counts in the top bar.
// Listens for RESOURCES_CHANGED and SUPPLY_CHANGED events.
// Exposed at window.SC.HUD

window.SC = window.SC || {};

window.SC.HUD = {
  elements: {
    mineralCount: null,
    gasCount: null,
    supplyCount: null,
    supplyContainer: null,
  },

  /**
   * Initialize the HUD.
   * Cache DOM references and bind event listeners.
   */
  init() {
    // Cache DOM elements
    this.elements.mineralCount = document.getElementById('mineral-count');
    this.elements.gasCount = document.getElementById('gas-count');
    this.elements.supplyCount = document.getElementById('supply-count');
    this.elements.supplyContainer = document.getElementById('res-supply');

    // Listen for resource change events
    if (SC.EventBus) {
      SC.EventBus.on(SC.CONST.EVENT.RESOURCES_CHANGED, (data) => {
        if (data) {
          this.updateResources(
            data.minerals != null ? data.minerals : 0,
            data.gas != null ? data.gas : 0,
            data.supplyUsed != null ? data.supplyUsed : 0,
            data.supplyMax != null ? data.supplyMax : 0
          );
        }
      });

      SC.EventBus.on(SC.CONST.EVENT.SUPPLY_CHANGED, (data) => {
        if (data) {
          this._updateSupply(
            data.supplyUsed != null ? data.supplyUsed : 0,
            data.supplyMax != null ? data.supplyMax : 0
          );
        }
      });
    }
  },

  /**
   * Update the resource display.
   * @param {number} minerals - Current mineral count
   * @param {number} gas - Current gas count
   * @param {number} supplyUsed - Current supply used
   * @param {number} supplyMax - Current supply max
   */
  updateResources(minerals, gas, supplyUsed, supplyMax) {
    if (this.elements.mineralCount) {
      this.elements.mineralCount.textContent = Math.floor(minerals);
    }
    if (this.elements.gasCount) {
      this.elements.gasCount.textContent = Math.floor(gas);
    }
    this._updateSupply(supplyUsed, supplyMax);
  },

  /**
   * Internal: Update supply display and apply supply-blocked styling.
   * @param {number} supplyUsed
   * @param {number} supplyMax
   */
  _updateSupply(supplyUsed, supplyMax) {
    if (this.elements.supplyCount) {
      this.elements.supplyCount.textContent = supplyUsed + '/' + supplyMax;
    }

    // Color supply red if supply blocked
    if (this.elements.supplyContainer) {
      if (supplyUsed >= supplyMax && supplyMax > 0) {
        this.elements.supplyContainer.classList.add('supply-blocked');
      } else {
        this.elements.supplyContainer.classList.remove('supply-blocked');
      }
    }
  },
};
