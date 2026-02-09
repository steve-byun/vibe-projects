"""Boomerang skill - thrown forward and returns to player, hits enemies twice."""

import math

import pygame

from src.skills.base_skill import BaseSkill, SkillProjectile


class Boomerang(BaseSkill):
    """Throws boomerangs that return to the player, hitting enemies on both trips."""

    def __init__(self):
        super().__init__('boomerang')
        self._spin_angle = 0.0

    def activate(self, player, enemies: list):
        """Throw boomerangs toward nearest enemies."""
        target = self._find_nearest_enemy(player.x, player.y, enemies)
        if target is None:
            dx = math.cos(player.facing_angle)
            dy = math.sin(player.facing_angle)
        else:
            tdx = target.x - player.x
            tdy = target.y - player.y
            dist = math.sqrt(tdx * tdx + tdy * tdy) or 1
            dx = tdx / dist
            dy = tdy / dist

        for i in range(self.projectile_count):
            spread = 0
            if self.projectile_count > 1:
                spread = (i - (self.projectile_count - 1) / 2) * 0.3
            cos_s = math.cos(spread)
            sin_s = math.sin(spread)
            ndx = dx * cos_s - dy * sin_s
            ndy = dx * sin_s + dy * cos_s

            proj = SkillProjectile(
                player.x, player.y, ndx, ndy,
                self.projectile_speed, self.damage,
                self.base_projectile_size, self.color,
                pierce=999,
                lifetime=4.0,
                returning=True,
                owner_x=player.x, owner_y=player.y,
            )
            proj.max_travel = self.range
            self.projectiles.append(proj)

    def update(self, dt: float, player, enemies: list):
        """Update boomerang with spin angle tracking."""
        self._spin_angle += dt * 12.0  # Fast spin
        super().update(dt, player, enemies)

    def draw(self, surface: pygame.Surface, camera):
        """Draw boomerangs as rotating cross/X shapes."""
        for proj in self.projectiles:
            if not proj.alive:
                continue
            sx, sy = camera.apply(proj.x, proj.y)
            sx_i = int(sx)
            sy_i = int(sy)
            r = proj.radius

            # Rotating cross/X shape
            angle = self._spin_angle
            for arm_a in [0, math.pi / 2, math.pi, math.pi * 1.5]:
                a = angle + arm_a
                # Each arm of the cross
                arm_len = r * 1.2
                arm_w = r * 0.3
                cos_a = math.cos(a)
                sin_a = math.sin(a)
                perp_cos = math.cos(a + math.pi / 2)
                perp_sin = math.sin(a + math.pi / 2)
                pts = [
                    (sx_i + int(cos_a * arm_len + perp_cos * arm_w),
                     sy_i + int(sin_a * arm_len + perp_sin * arm_w)),
                    (sx_i + int(cos_a * arm_len - perp_cos * arm_w),
                     sy_i + int(sin_a * arm_len - perp_sin * arm_w)),
                    (sx_i - int(perp_cos * arm_w * 0.5),
                     sy_i - int(perp_sin * arm_w * 0.5)),
                    (sx_i + int(perp_cos * arm_w * 0.5),
                     sy_i + int(perp_sin * arm_w * 0.5)),
                ]
                pygame.draw.polygon(surface, self.color, pts)
                pygame.draw.polygon(surface, (255, 255, 255), pts, 1)

            # Center circle
            pygame.draw.circle(surface, (255, 255, 255), (sx_i, sy_i), max(1, r // 3))

        for effect in self.effects:
            effect.draw(surface, camera)
