"""Sprite loading, caching, animation, and rendering utilities."""

import math
import os
import glob as glob_mod

import pygame


# Base path for all game assets
_BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ASSETS_DIR = os.path.join(_BASE_DIR, 'assets', 'sprites')


class SpriteAnimation:
    """A sequence of frames that can be played as an animation.

    Attributes:
        frames: List of pygame.Surface objects (individual frames).
        frame_count: Number of frames.
        fps: Playback speed in frames per second.
    """

    def __init__(self, frames: list[pygame.Surface], fps: float = 10.0):
        self.frames = frames
        self.frame_count = len(frames)
        self.fps = fps
        self._timer = 0.0
        self._current_frame = 0

    def reset(self):
        """Reset animation to the first frame."""
        self._timer = 0.0
        self._current_frame = 0

    def update(self, dt: float):
        """Advance the animation timer.

        Args:
            dt: Delta time in seconds.
        """
        if self.frame_count <= 1:
            return
        self._timer += dt
        frame_duration = 1.0 / self.fps if self.fps > 0 else 1.0
        if self._timer >= frame_duration:
            self._timer -= frame_duration
            self._current_frame = (self._current_frame + 1) % self.frame_count

    def get_frame(self) -> pygame.Surface:
        """Return the current animation frame."""
        if not self.frames:
            return pygame.Surface((1, 1), pygame.SRCALPHA)
        return self.frames[self._current_frame]


class SpriteManager:
    """Central sprite loading, caching, and rendering manager.

    All sprites are loaded once and cached. Scaled/rotated variants
    are also cached to avoid per-frame Surface creation.
    """

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._cache = {}
            cls._instance._scale_cache = {}
            cls._instance._rotate_cache = {}
        return cls._instance

    # -----------------------------------------------------------------
    # Loading helpers
    # -----------------------------------------------------------------

    def load_image(self, path: str) -> pygame.Surface | None:
        """Load a single image from disk with caching.

        Args:
            path: Absolute or relative path to the image file.

        Returns:
            The loaded Surface, or None if the file doesn't exist.
        """
        abs_path = os.path.abspath(path)
        if abs_path in self._cache:
            return self._cache[abs_path]

        if not os.path.isfile(abs_path):
            return None

        try:
            img = pygame.image.load(abs_path).convert_alpha()
            self._cache[abs_path] = img
            return img
        except pygame.error:
            return None

    def load_frame_sequence(self, folder: str, pattern: str,
                            count: int | None = None) -> list[pygame.Surface]:
        """Load a numbered sequence of individual frame files.

        Args:
            folder: Directory containing the frames.
            pattern: Filename pattern with a '*' or format placeholder.
                     e.g. 'survivor-idle_handgun_*.png'
            count: If given, load frames 0..count-1 using the pattern.
                   If None, auto-detect using glob.

        Returns:
            List of Surface objects in frame order, or empty list on failure.
        """
        folder = os.path.abspath(folder)
        if not os.path.isdir(folder):
            return []

        # Auto-detect files with glob
        search = os.path.join(folder, pattern)
        files = sorted(glob_mod.glob(search))

        if not files:
            return []

        # Sort numerically by extracting the number from the filename
        def _extract_num(filepath):
            base = os.path.splitext(os.path.basename(filepath))[0]
            # Get the last segment after '_'
            parts = base.rsplit('_', 1)
            try:
                return int(parts[-1])
            except (ValueError, IndexError):
                return 0

        files.sort(key=_extract_num)

        if count is not None:
            files = files[:count]

        frames = []
        for f in files:
            img = self.load_image(f)
            if img is not None:
                frames.append(img)
        return frames

    def split_sprite_sheet(self, path: str, cols: int, rows: int,
                           frame_width: int | None = None,
                           frame_height: int | None = None,
                           count: int | None = None) -> list[pygame.Surface]:
        """Split a sprite sheet into individual frames.

        Frames are extracted left-to-right, top-to-bottom.

        Args:
            path: Path to the sprite sheet image.
            cols: Number of columns in the grid.
            rows: Number of rows in the grid.
            frame_width: Width of each frame (auto-calculated if None).
            frame_height: Height of each frame (auto-calculated if None).
            count: Maximum number of frames to extract (default: all).

        Returns:
            List of Surface objects, or empty list on failure.
        """
        cache_key = f"sheet:{os.path.abspath(path)}:{cols}:{rows}:{frame_width}:{frame_height}:{count}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        sheet = self.load_image(path)
        if sheet is None:
            return []

        sw, sh = sheet.get_size()
        fw = frame_width or (sw // cols)
        fh = frame_height or (sh // rows)
        max_frames = count or (cols * rows)

        frames = []
        for row in range(rows):
            for col in range(cols):
                if len(frames) >= max_frames:
                    break
                rect = pygame.Rect(col * fw, row * fh, fw, fh)
                frame = sheet.subsurface(rect).copy()
                frames.append(frame)
            if len(frames) >= max_frames:
                break

        self._cache[cache_key] = frames
        return frames

    # -----------------------------------------------------------------
    # Scaling and rotation
    # -----------------------------------------------------------------

    def scale_surface(self, surface: pygame.Surface,
                      target_size: int) -> pygame.Surface:
        """Scale a surface so its largest dimension matches target_size.

        Results are cached for performance.

        Args:
            surface: Source surface.
            target_size: Desired size (largest dimension).

        Returns:
            Scaled Surface.
        """
        key = (id(surface), target_size)
        if key in self._scale_cache:
            return self._scale_cache[key]

        w, h = surface.get_size()
        if w == 0 or h == 0:
            return surface

        scale = target_size / max(w, h)
        new_w = max(1, int(w * scale))
        new_h = max(1, int(h * scale))
        scaled = pygame.transform.smoothscale(surface, (new_w, new_h))
        self._scale_cache[key] = scaled
        return scaled

    def scale_frames(self, frames: list[pygame.Surface],
                     target_size: int) -> list[pygame.Surface]:
        """Scale a list of frames to a uniform target size.

        Args:
            frames: List of source frame surfaces.
            target_size: Desired size (largest dimension).

        Returns:
            List of scaled Surface objects.
        """
        return [self.scale_surface(f, target_size) for f in frames]

    def rotate_surface(self, surface: pygame.Surface,
                       angle_deg: float) -> pygame.Surface:
        """Rotate a surface by the given angle in degrees.

        Uses a coarse angle cache (snapped to 5-degree increments)
        to avoid creating excessive Surface variants.

        Args:
            surface: Source surface.
            angle_deg: Rotation angle in degrees (counter-clockwise).

        Returns:
            Rotated Surface.
        """
        # Snap to 5-degree increments for cache efficiency
        snapped = round(angle_deg / 5.0) * 5.0
        key = (id(surface), snapped)
        if key in self._rotate_cache:
            return self._rotate_cache[key]

        rotated = pygame.transform.rotate(surface, snapped)
        self._rotate_cache[key] = rotated
        return rotated

    # -----------------------------------------------------------------
    # High-level drawing
    # -----------------------------------------------------------------

    def draw_sprite(self, surface: pygame.Surface,
                    sprite: pygame.Surface,
                    screen_x: float, screen_y: float,
                    angle_rad: float = 0.0,
                    tint_color: tuple | None = None,
                    alpha: int = 255):
        """Draw a sprite centered at (screen_x, screen_y) with rotation.

        The Top_Down_Survivor sprites face RIGHT (0 radians) by default.
        We convert the facing angle to a pygame rotation (counter-clockwise
        degrees) and center-blit.

        Args:
            surface: Target surface to draw on.
            sprite: The sprite frame to draw.
            screen_x: Screen x coordinate (center).
            screen_y: Screen y coordinate (center).
            angle_rad: Facing angle in radians (0 = right).
            tint_color: Optional (R, G, B) tuple to tint (for damage flash).
            alpha: Overall alpha (0-255).
        """
        # Convert radians to degrees for pygame (counter-clockwise positive)
        angle_deg = -math.degrees(angle_rad)
        drawn = self.rotate_surface(sprite, angle_deg)

        if tint_color is not None:
            drawn = drawn.copy()
            tint_surf = pygame.Surface(drawn.get_size(), pygame.SRCALPHA)
            tint_surf.fill((*tint_color, 0))
            # Use BLEND_RGB_ADD to overlay white flash
            drawn.blit(tint_surf, (0, 0), special_flags=pygame.BLEND_RGB_ADD)

        if alpha < 255:
            drawn = drawn.copy()
            drawn.set_alpha(alpha)

        rect = drawn.get_rect(center=(int(screen_x), int(screen_y)))
        surface.blit(drawn, rect)

    def draw_sprite_flipped(self, surface: pygame.Surface,
                            sprite: pygame.Surface,
                            screen_x: float, screen_y: float,
                            flip_x: bool = False, flip_y: bool = False,
                            tint_color: tuple | None = None,
                            alpha: int = 255):
        """Draw a sprite with optional horizontal/vertical flip.

        Used for enemy sprites that should face left/right based on
        movement direction, without full rotation.

        Args:
            surface: Target surface.
            sprite: The sprite frame.
            screen_x: Center x.
            screen_y: Center y.
            flip_x: Mirror horizontally.
            flip_y: Mirror vertically.
            tint_color: Optional tint color for damage flash.
            alpha: Alpha transparency.
        """
        drawn = sprite
        if flip_x or flip_y:
            drawn = pygame.transform.flip(drawn, flip_x, flip_y)

        if tint_color is not None:
            drawn = drawn.copy()
            tint_surf = pygame.Surface(drawn.get_size(), pygame.SRCALPHA)
            tint_surf.fill((*tint_color, 0))
            drawn.blit(tint_surf, (0, 0), special_flags=pygame.BLEND_RGB_ADD)

        if alpha < 255:
            drawn = drawn.copy()
            drawn.set_alpha(alpha)

        rect = drawn.get_rect(center=(int(screen_x), int(screen_y)))
        surface.blit(drawn, rect)


# Module-level singleton accessor
_sprite_manager = None


def get_sprite_manager() -> SpriteManager:
    """Get the global SpriteManager singleton.

    Returns:
        The SpriteManager instance.
    """
    global _sprite_manager
    if _sprite_manager is None:
        _sprite_manager = SpriteManager()
    return _sprite_manager
