"""Camera system that follows the player with smooth interpolation."""

import pygame

from src.core.settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT,
    WORLD_WIDTH, WORLD_HEIGHT,
    CAMERA_LERP,
)


class Camera:
    """Camera that smoothly follows a target within world bounds."""

    def __init__(self):
        # Camera position represents the top-left corner of the viewport
        self.x = 0.0
        self.y = 0.0
        self.width = SCREEN_WIDTH
        self.height = SCREEN_HEIGHT

    def update(self, target_x: float, target_y: float, dt: float):
        """Smoothly follow the target position (usually player center).

        Args:
            target_x: Target world x position to center on.
            target_y: Target world y position to center on.
            dt: Delta time in seconds.
        """
        # Desired camera position: center the target on screen
        desired_x = target_x - self.width / 2
        desired_y = target_y - self.height / 2

        # Smooth interpolation (framerate-independent lerp)
        # Using 1 - (1 - CAMERA_LERP)^(dt*60) for consistent feel across framerates
        factor = 1.0 - (1.0 - CAMERA_LERP) ** (dt * 60)
        self.x += (desired_x - self.x) * factor
        self.y += (desired_y - self.y) * factor

        # Clamp to world boundaries
        self.x = max(0, min(self.x, WORLD_WIDTH - self.width))
        self.y = max(0, min(self.y, WORLD_HEIGHT - self.height))

    def apply(self, world_x: float, world_y: float) -> tuple[float, float]:
        """Convert world coordinates to screen coordinates.

        Args:
            world_x: X position in world space.
            world_y: Y position in world space.

        Returns:
            Tuple of (screen_x, screen_y).
        """
        return world_x - self.x, world_y - self.y

    def apply_rect(self, rect: pygame.Rect) -> pygame.Rect:
        """Convert a world-space rect to screen-space rect.

        Args:
            rect: A pygame.Rect in world coordinates.

        Returns:
            New pygame.Rect in screen coordinates.
        """
        return pygame.Rect(rect.x - self.x, rect.y - self.y, rect.width, rect.height)

    def get_visible_rect(self) -> pygame.Rect:
        """Return the world-space rectangle currently visible on screen."""
        return pygame.Rect(int(self.x), int(self.y), self.width, self.height)

    def is_visible(self, world_x: float, world_y: float, margin: float = 50) -> bool:
        """Check if a world position is visible on screen (with margin).

        Args:
            world_x: X position in world space.
            world_y: Y position in world space.
            margin: Extra pixels beyond screen edge to still count as visible.

        Returns:
            True if the position is within the visible area + margin.
        """
        return (self.x - margin <= world_x <= self.x + self.width + margin and
                self.y - margin <= world_y <= self.y + self.height + margin)

    def center_on(self, world_x: float, world_y: float):
        """Immediately center the camera on a world position (no lerp).

        Args:
            world_x: X position in world space.
            world_y: Y position in world space.
        """
        self.x = world_x - self.width / 2
        self.y = world_y - self.height / 2
        # Clamp to world boundaries
        self.x = max(0, min(self.x, WORLD_WIDTH - self.width))
        self.y = max(0, min(self.y, WORLD_HEIGHT - self.height))
