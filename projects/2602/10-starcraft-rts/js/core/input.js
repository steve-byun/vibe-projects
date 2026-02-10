// === StarCraft RTS Clone - Input Manager ===
// Handles mouse, keyboard input, drag selection, double-click detection.
// Exposes at window.SC.Input

window.SC = window.SC || {};

window.SC.Input = {
  // --- Public state ---
  mouse: { x: 0, y: 0, worldX: 0, worldY: 0, down: false, button: 0 },
  keys: {},
  dragStart: null,       // { x, y } screen coords when left mouse pressed
  isDragging: false,     // true when drag distance > 5px

  // --- Handler registrations ---
  _clickHandlers: [],
  _rightClickHandlers: [],
  _doubleClickHandlers: [],
  _wheelHandlers: [],
  _dragEndHandlers: [],

  // --- Double-click tracking ---
  _doubleClickTime: 0,
  _lastClickPos: null,

  // --- Internal ---
  _canvas: null,
  _dragThreshold: 5,
  _doubleClickThreshold: 300,  // ms
  _doubleClickDistance: 10,    // px

  /**
   * Initialize input listeners on the canvas.
   * @param {HTMLCanvasElement} canvas
   */
  init(canvas) {
    this._canvas = canvas;

    // --- Mouse move ---
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;

      // Check if we started dragging (left button only)
      if (this.mouse.down && this.mouse.button === 0 && this.dragStart) {
        const dx = this.mouse.x - this.dragStart.x;
        const dy = this.mouse.y - this.dragStart.y;
        if (Math.sqrt(dx * dx + dy * dy) > this._dragThreshold) {
          this.isDragging = true;
        }
      }
    });

    // --- Mouse down ---
    canvas.addEventListener('mousedown', (e) => {
      this.mouse.down = true;
      this.mouse.button = e.button;

      if (e.button === 0) {
        // Left button: begin potential drag
        this.dragStart = { x: this.mouse.x, y: this.mouse.y };
        this.isDragging = false;
      }
    });

    // --- Mouse up ---
    canvas.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        // Left button release
        if (this.isDragging) {
          // Drag ended - notify drag end handlers
          const rect = this.getDragRect();
          for (const handler of this._dragEndHandlers) {
            handler(rect);
          }
        } else {
          // It was a click (not a drag)
          this._handleLeftClick(e);
        }
        this.dragStart = null;
        this.isDragging = false;
      } else if (e.button === 2) {
        // Right click
        this._handleRightClick(e);
      }

      this.mouse.down = false;
      this.mouse.button = -1;
    });

    // --- Mouse leave ---
    canvas.addEventListener('mouseleave', () => {
      // Reset edge-scroll-relevant mouse coords to center
      // so camera stops scrolling when mouse leaves canvas
      this.mouse.x = SC.CONST.CANVAS_WIDTH / 2;
      this.mouse.y = SC.CONST.CANVAS_HEIGHT / 2;
    });

    // --- Context menu (prevent on canvas) ---
    canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // --- Mouse wheel ---
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -1 : 1;  // scroll up = zoom in
      for (const handler of this._wheelHandlers) {
        handler(delta, this.mouse.x, this.mouse.y);
      }
    }, { passive: false });

    // --- Keyboard down ---
    document.addEventListener('keydown', (e) => {
      // Prevent repeated firing for held keys
      if (e.repeat) return;
      this.keys[e.key] = true;
      this.keys[e.code] = true;

      // Emit hotkey through EventBus
      if (SC.EventBus) {
        SC.EventBus.emit('input:keydown', { key: e.key, code: e.code, ctrlKey: e.ctrlKey, shiftKey: e.shiftKey });
      }
    });

    // --- Keyboard up ---
    document.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
      this.keys[e.code] = false;
    });
  },

  /**
   * Update world coordinates based on current camera position.
   * Called once per frame at the start of the tick.
   * @param {object} camera - SC.Camera
   */
  updateWorldCoords(camera) {
    if (!camera) return;
    const world = camera.screenToWorld(this.mouse.x, this.mouse.y);
    this.mouse.worldX = world.x;
    this.mouse.worldY = world.y;
  },

  /**
   * Check if a key is currently held down.
   * @param {string} key - Key name (e.g. 'a', 'ArrowUp', 'Control')
   * @returns {boolean}
   */
  isKeyDown(key) {
    return !!this.keys[key];
  },

  /**
   * Get the current drag rectangle in screen coordinates.
   * @returns {{ x1: number, y1: number, x2: number, y2: number } | null}
   */
  getDragRect() {
    if (!this.isDragging || !this.dragStart) return null;
    return {
      x1: Math.min(this.dragStart.x, this.mouse.x),
      y1: Math.min(this.dragStart.y, this.mouse.y),
      x2: Math.max(this.dragStart.x, this.mouse.x),
      y2: Math.max(this.dragStart.y, this.mouse.y),
    };
  },

  /**
   * Get the current drag rectangle in world coordinates.
   * @param {object} camera - SC.Camera
   * @returns {{ x1: number, y1: number, x2: number, y2: number } | null}
   */
  getDragRectWorld(camera) {
    if (!this.isDragging || !this.dragStart || !camera) return null;
    const topLeft = camera.screenToWorld(
      Math.min(this.dragStart.x, this.mouse.x),
      Math.min(this.dragStart.y, this.mouse.y)
    );
    const bottomRight = camera.screenToWorld(
      Math.max(this.dragStart.x, this.mouse.x),
      Math.max(this.dragStart.y, this.mouse.y)
    );
    return {
      x1: topLeft.x,
      y1: topLeft.y,
      x2: bottomRight.x,
      y2: bottomRight.y,
    };
  },

  /**
   * Register a left-click handler.
   * @param {Function} callback - (screenX, screenY, worldX, worldY, shiftKey)
   */
  onLeftClick(callback) {
    this._clickHandlers.push(callback);
  },

  /**
   * Register a right-click handler.
   * @param {Function} callback - (screenX, screenY, worldX, worldY)
   */
  onRightClick(callback) {
    this._rightClickHandlers.push(callback);
  },

  /**
   * Register a double-click handler.
   * @param {Function} callback - (screenX, screenY, worldX, worldY)
   */
  onDoubleClick(callback) {
    this._doubleClickHandlers.push(callback);
  },

  /**
   * Register a mouse wheel handler.
   * @param {Function} callback - (delta, screenX, screenY) delta: +1 zoom in, -1 zoom out
   */
  onWheel(callback) {
    this._wheelHandlers.push(callback);
  },

  /**
   * Register a drag-end handler (called when box select ends).
   * @param {Function} callback - (rect) where rect = { x1,y1,x2,y2 } screen coords
   */
  onDragEnd(callback) {
    this._dragEndHandlers.push(callback);
  },

  /**
   * Internal: handle left click and double-click detection.
   */
  _handleLeftClick(e) {
    const now = performance.now();
    const screenX = this.mouse.x;
    const screenY = this.mouse.y;
    const worldX = this.mouse.worldX;
    const worldY = this.mouse.worldY;

    // Double-click detection
    if (this._lastClickPos) {
      const dx = screenX - this._lastClickPos.x;
      const dy = screenY - this._lastClickPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const elapsed = now - this._doubleClickTime;

      if (elapsed < this._doubleClickThreshold && dist < this._doubleClickDistance) {
        // Double click detected
        for (const handler of this._doubleClickHandlers) {
          handler(screenX, screenY, worldX, worldY);
        }
        this._lastClickPos = null;
        this._doubleClickTime = 0;
        return;
      }
    }

    // Single click
    this._lastClickPos = { x: screenX, y: screenY };
    this._doubleClickTime = now;

    for (const handler of this._clickHandlers) {
      handler(screenX, screenY, worldX, worldY, e.shiftKey);
    }
  },

  /**
   * Internal: handle right click.
   */
  _handleRightClick(e) {
    const screenX = this.mouse.x;
    const screenY = this.mouse.y;
    const worldX = this.mouse.worldX;
    const worldY = this.mouse.worldY;

    for (const handler of this._rightClickHandlers) {
      handler(screenX, screenY, worldX, worldY);
    }
  },
};
