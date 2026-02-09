"""Shuriken skill - rapid fire small projectiles in multiple directions."""

import math

import pygame

from src.skills.base_skill import BaseSkill, SkillProjectile


class Shuriken(BaseSkill):
    """Throws shurikens in multiple directions at high speed."""

    def __init__(self):
        super().__init__('shuriken')
        self._fire_angle = 0.0
        self._spin_angle = 0.0

    def activate(self, player, enemies: list):
        """Fire shurikens in evenly spaced directions."""
        count = self.projectile_count
        self._fire_angle += 0.3

        for i in range(count):
            angle = self._fire_angle + (2 * math.pi * i / count)
            dx = math.cos(angle)
            dy = math.sin(angle)

            proj = SkillProjectile(
                player.x, player.y, dx, dy,
                self.projectile_speed, self.damage,
                self.base_projectile_size, self.color,
                pierce=1, lifetime=1.2,
            )
            self.projectiles.append(proj)

    def update(self, dt: float, player, enemies: list):
        """Update with spin tracking."""
        self._spin_angle += dt * 15.0
        super().update(dt, player, enemies)

    def draw(self, surface: pygame.Surface, camera):
        """Draw shurikens as 4-pointed star shapes that spin."""
        for proj in self.projectiles:
            if not proj.alive:
                continue
            sx, sy = camera.apply(proj.x, proj.y)
            sx_i = int(sx)
            sy_i = int(sy)
            r = proj.radius

            # 4-pointed star
            star_pts = []
            for i in range(8):
                a = self._spin_angle + i * math.pi / 4
                # Alternating outer/inner radius
                sr = r * 1.2 if i % 2 == 0 else r * 0.4
                px = sx_i + int(math.cos(a) * sr)
                py = sy_i + int(math.sin(a) * sr)
                star_pts.append((px, py))

            pygame.draw.polygon(surface, proj.color, star_pts)
            pygame.draw.polygon(surface, (255, 255, 255), star_pts, 1)
            # Center hole
            pygame.draw.circle(surface, (40, 40, 40), (sx_i, sy_i), max(1, r // 4))

        for effect in self.effects:
            effect.draw(surface, camera)
