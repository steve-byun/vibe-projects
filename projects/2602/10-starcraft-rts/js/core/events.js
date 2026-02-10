// === StarCraft RTS Clone - EventBus ===
// Central pub/sub system for decoupled module communication.
// All cross-module events go through here.

window.SC = window.SC || {};

window.SC.EventBus = {
  _listeners: {},

  /**
   * Subscribe to an event.
   * @param {string} event - Event name from SC.CONST.EVENT
   * @param {Function} callback - Function(data) to call
   * @returns {Function} unsubscribe function
   */
  on(event, callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    const entry = { callback, once: false };
    this._listeners[event].push(entry);
    return () => this.off(event, callback);
  },

  /**
   * Subscribe to an event, auto-remove after first call.
   */
  once(event, callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push({ callback, once: true });
  },

  /**
   * Unsubscribe a specific callback.
   */
  off(event, callback) {
    const list = this._listeners[event];
    if (!list) return;
    this._listeners[event] = list.filter(e => e.callback !== callback);
  },

  /**
   * Emit an event to all subscribers.
   * @param {string} event - Event name
   * @param {*} data - Arbitrary data payload
   */
  emit(event, data) {
    const list = this._listeners[event];
    if (!list) return;
    // Copy array to avoid mutation during iteration
    const snapshot = list.slice();
    for (const entry of snapshot) {
      entry.callback(data);
      if (entry.once) {
        this.off(event, entry.callback);
      }
    }
  },

  /**
   * Remove all listeners (used on game reset).
   */
  clear() {
    this._listeners = {};
  },
};
