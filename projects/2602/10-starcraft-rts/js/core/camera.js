// === StarCraft RTS Clone - Camera ===
// Handles viewport position, edge scrolling, keyboard scrolling, zoom,
// and world<->screen coordinate conversions.
// Exposes at window.SC.Camera

window.SC = window.SC || {};

window.SC.Camera = {
  // --- Public state ---
  x: 0,           // top-left world X of viewport
  y: 0,           // top-left world Y of viewport
  zoom: 1.0,      // current zoom level
  width: 0,       // viewport width in pixels (canvas width)
  height: 0,      // viewport height in pixels (canvas height)

  /**
   * Initialize the camera with viewport dimensions.
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   */
  init(canvasWidth, canvasHeight) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.x = 0;
    this.y = 0;
    this.zoom = 1.0;
  },

  /**
   * Convert world coordinates to screen (canvas) coordinates.
   * @param {number} worldX
   * @param {number} worldY
   * @returns {{ x: number, y: number }}
   */
  worldToScreen(worldX, worldY) {
    return {
      x: (worldX - this.x) * this.zoom,
      y: (worldY - this.y) * this.zoom,
    };
  },

  /**
   * Convert screen (canvas) coordinates to world coordinates.
   * @param {number} screenX
   * @param {number} screenY
   * @returns {{ x: number, y: number }}
   */
  screenToWorld(screenX, screenY) {
    return {
      x: screenX / this.zoom + this.x,
      y: screenY / this.zoom + this.y,
    };
  },

  /**
   * Get the visible rectangle in world coordinates.
   * @returns {{ x: number, y: number, w: number, h: number }}
   */
  getVisibleRect() {
    return {
      x: this.x,
      y: this.y,
      w: this.width / this.zoom,
      h: this.height / this.zoom,
    };
  },

  /**
   * Update camera position from edge scroll, keyboard, and clamping.
   * Called once per frame.
   * @param {number} dt - delta time in seconds
   */
  update(dt) {
    const C = SC.CONST;
    let dx = 0;
    let dy = 0;

    // --- Edge scrolling ---
    if (SC.Input) {
      const mx = SC.Input.mouse.x;
      const my = SC.Input.mouse.y;
      const margin = C.CAMERA_EDGE_SCROLL_MARGIN;
      const speed = C.CAMERA_EDGE_SCROLL_SPEED;

      if (mx <= margin) {
        dx -= speed * dt;
      } else if (mx >= this.width - margin) {
        dx += speed * dt;
      }

      if (my <= margin) {
        dy -= speed * dt;
      } else if (my >= this.height - margin) {
        dy += speed * dt;
      }
    }

    // --- Keyboard scrolling ---
    if (SC.Input) {
      const kSpeed = C.CAMERA_KEY_SCROLL_SPEED;
      if (SC.Input.isKeyDown('ArrowLeft') || SC.Input.isKeyDown('a')) {
        // 'a' is attack-move hotkey, so only use arrows
      }
      if (SC.Input.isKeyDown('ArrowLeft')) {
        dx -= kSpeed * dt;
      }
      if (SC.Input.isKeyDown('ArrowRight')) {
        dx += kSpeed * dt;
      }
      if (SC.Input.isKeyDown('ArrowUp')) {
        dy -= kSpeed * dt;
      }
      if (SC.Input.isKeyDown('ArrowDown')) {
        dy += kSpeed * dt;
      }
    }

    // Apply movement
    this.x += dx;
    this.y += dy;

    // --- Clamp to world bounds ---
    this._clamp();

    // Emit event
    if (dx !== 0 || dy !== 0) {
      if (SC.EventBus) {
        SC.EventBus.emit(SC.CONST.EVENT.CAMERA_MOVED, { x: this.x, y: this.y });
      }
    }
  },

  /**
   * Center the camera on a world position.
   * @param {number} worldX
   * @param {number} worldY
   */
  centerOn(worldX, worldY) {
    this.x = worldX - (this.width / this.zoom) / 2;
    this.y = worldY - (this.height / this.zoom) / 2;
    this._clamp();

    if (SC.EventBus) {
      SC.EventBus.emit(SC.CONST.EVENT.CAMERA_MOVED, { x: this.x, y: this.y });
    }
  },

  /**
   * Check if a world point is within the visible viewport.
   * @param {number} worldX
   * @param {number} worldY
   * @param {number} [margin=0] - extra margin in world pixels
   * @returns {boolean}
   */
  isVisible(worldX, worldY, margin) {
    margin = margin || 0;
    const rect = this.getVisibleRect();
    return (
      worldX >= rect.x - margin &&
      worldX <= rect.x + rect.w + margin &&
      worldY >= rect.y - margin &&
      worldY <= rect.y + rect.h + margin
    );
  },

  /**
   * Apply zoom change. Zoom toward/away from the mouse position.
   * @param {number} delta - +1 to zoom in, -1 to zoom out
   * @param {number} screenX - mouse screen X for zoom anchor
   * @param {number} screenY - mouse screen Y for zoom anchor
   */
  applyZoom(delta, screenX, screenY) {
    const C = SC.CONST;

    // World point under mouse before zoom
    const beforeWorld = this.screenToWorld(screenX, screenY);

    // Change zoom
    const oldZoom = this.zoom;
    this.zoom += delta * C.CAMERA_ZOOM_STEP;
    this.zoom = Math.max(C.CAMERA_ZOOM_MIN, Math.min(C.CAMERA_ZOOM_MAX, this.zoom));

    if (this.zoom === oldZoom) return;

    // Adjust camera so the world point under mouse stays in same screen position
    this.x = beforeWorld.x - screenX / this.zoom;
    this.y = beforeWorld.y - screenY / this.zoom;

    this._clamp();
  },

  /**
   * Internal: clamp camera position to world bounds.
   */
  _clamp() {
    const C = SC.CONST;
    const viewW = this.width / this.zoom;
    const viewH = this.height / this.zoom;

    // Don't allow camera to go past world edges
    this.x = Math.max(0, Math.min(C.MAP_WIDTH_PX - viewW, this.x));
    this.y = Math.max(0, Math.min(C.MAP_HEIGHT_PX - viewH, this.y));
  },
};
