"""Floating damage numbers that pop up and fade out."""

import pygame
import random

from src.core.settings import COLOR_WHITE, COLOR_UI_HIGHLIGHT


class DamageNumber:
    """A single floating damage number."""

    def __init__(self, x: float, y: float, amount: int, color: tuple = COLOR_WHITE,
                 is_crit: bool = False, is_player_damage: bool = False):
        self.x = x + random.uniform(-10, 10)
        self.y = y
        self.amount = amount
        self.alive = True

        # Determine color based on type
        if is_player_damage:
            self.color = (255, 80, 80)
        elif is_crit:
            self.color = (255, 220, 50)
        else:
            self.color = color

        # Size scales with damage amount (min 16, max 36)
        base_size = 18
        if is_crit:
            base_size = 24
        self.font_size = min(36, max(16, base_size + amount // 10))

        # Animation
        self.lifetime = 0.8  # seconds
        self.timer = 0.0
        self.vy = -80  # float upward speed
        self.vx = random.uniform(-15, 15)

        # Scale pop effect
        self.scale = 1.5 if is_crit else 1.2
        self.target_scale = 1.0

    def update(self, dt: float):
        """Update position, fade, and lifetime."""
        self.timer += dt

        if self.timer >= self.lifetime:
            self.alive = False
            return

        # Move upward with deceleration
        self.y += self.vy * dt
        self.x += self.vx * dt
        self.vy *= 0.95  # slow down

        # Scale pop-in effect
        if self.scale > self.target_scale:
            self.scale -= dt * 3.0
            if self.scale < self.target_scale:
                self.scale = self.target_scale

    def get_alpha(self) -> int:
        """Get current alpha based on lifetime progress."""
        progress = self.timer / self.lifetime
        if progress < 0.2:
            return 255
        # Fade out in last 80%
        return max(0, int(255 * (1.0 - (progress - 0.2) / 0.8)))

    def render(self, surface: pygame.Surface, camera_offset: tuple[float, float]):
        """Render the damage number."""
        if not self.alive:
            return

        alpha = self.get_alpha()
        if alpha <= 0:
            return

        screen_x = self.x - camera_offset[0]
        screen_y = self.y - camera_offset[1]

        # Create font and render text
        size = int(self.font_size * self.scale)
        font = pygame.font.SysFont(None, size)
        text = str(self.amount)

        # Render text with alpha using a temporary surface
        text_surf = font.render(text, True, self.color)
        alpha_surf = pygame.Surface(text_surf.get_size(), pygame.SRCALPHA)
        alpha_surf.blit(text_surf, (0, 0))
        alpha_surf.set_alpha(alpha)

        # Draw shadow for readability
        shadow_surf = font.render(text, True, (0, 0, 0))
        shadow_alpha = pygame.Surface(shadow_surf.get_size(), pygame.SRCALPHA)
        shadow_alpha.blit(shadow_surf, (0, 0))
        shadow_alpha.set_alpha(alpha // 2)

        rect = alpha_surf.get_rect(center=(int(screen_x), int(screen_y)))
        shadow_rect = rect.copy()
        shadow_rect.x += 1
        shadow_rect.y += 1

        surface.blit(shadow_alpha, shadow_rect)
        surface.blit(alpha_surf, rect)


class DamageNumberManager:
    """Manages all active damage numbers."""

    def __init__(self):
        self.numbers: list[DamageNumber] = []

    def spawn(self, x: float, y: float, amount: int, color: tuple = COLOR_WHITE,
              is_crit: bool = False, is_player_damage: bool = False):
        """Create a new floating damage number."""
        self.numbers.append(
            DamageNumber(x, y, amount, color, is_crit, is_player_damage)
        )

    def update(self, dt: float):
        """Update all damage numbers and remove dead ones."""
        for num in self.numbers:
            num.update(dt)
        self.numbers = [n for n in self.numbers if n.alive]

    def render(self, surface: pygame.Surface, camera_offset: tuple[float, float]):
        """Render all active damage numbers."""
        for num in self.numbers:
            num.render(surface, camera_offset)
