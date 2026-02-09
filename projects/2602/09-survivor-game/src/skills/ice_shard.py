"""Ice Shard skill - 3-way spread shot that pierces and slows."""

import math

import pygame

from src.skills.base_skill import BaseSkill, SkillProjectile


class IceShard(BaseSkill):
    """Fires ice shards in a spread pattern that pierce and slow enemies."""

    def __init__(self):
        super().__init__('ice_shard')
        self._slow_duration = 1.5
        self._slow_amount = 0.5  # 50% speed reduction

    def activate(self, player, enemies: list):
        """Fire ice shards in a spread toward nearest enemy."""
        target = self._find_nearest_enemy(player.x, player.y, enemies)
        if target is None:
            base_angle = player.facing_angle
        else:
            dx = target.x - player.x
            dy = target.y - player.y
            base_angle = math.atan2(dy, dx)

        count = self.projectile_count
        spread_angle = 0.25

        for i in range(count):
            offset = (i - (count - 1) / 2) * spread_angle
            angle = base_angle + offset

            proj = SkillProjectile(
                player.x, player.y,
                math.cos(angle), math.sin(angle),
                self.projectile_speed, self.damage,
                self.base_projectile_size, self.color,
                pierce=2, lifetime=1.5,
            )
            self.projectiles.append(proj)

    def draw(self, surface: pygame.Surface, camera):
        """Draw ice shards as crystal/diamond shapes with white highlights."""
        for proj in self.projectiles:
            if not proj.alive:
                continue
            sx, sy = camera.apply(proj.x, proj.y)
            sx_i = int(sx)
            sy_i = int(sy)
            r = proj.radius
            angle = math.atan2(proj.dy, proj.dx)

            cos_a = math.cos(angle)
            sin_a = math.sin(angle)
            perp_cos = math.cos(angle + math.pi / 2)
            perp_sin = math.sin(angle + math.pi / 2)

            # Diamond/crystal shape: elongated along travel direction
            tip_fwd = (sx_i + int(cos_a * r * 1.5), sy_i + int(sin_a * r * 1.5))
            tip_back = (sx_i - int(cos_a * r * 0.8), sy_i - int(sin_a * r * 0.8))
            side_l = (sx_i + int(perp_cos * r * 0.6), sy_i + int(perp_sin * r * 0.6))
            side_r = (sx_i - int(perp_cos * r * 0.6), sy_i - int(perp_sin * r * 0.6))

            # Main crystal body (light blue)
            pygame.draw.polygon(surface, proj.color, [tip_fwd, side_l, tip_back, side_r])

            # Light facet (upper half lighter)
            hl_color = (min(255, proj.color[0] + 60), min(255, proj.color[1] + 60),
                        min(255, proj.color[2] + 60))
            pygame.draw.polygon(surface, hl_color, [tip_fwd, side_l, (sx_i, sy_i)])

            # White edge highlights
            pygame.draw.line(surface, (255, 255, 255), tip_fwd, side_l, 1)
            pygame.draw.line(surface, (220, 240, 255), tip_fwd, side_r, 1)

            # Center line (white)
            pygame.draw.line(surface, (255, 255, 255), tip_fwd, tip_back, 1)

            # Outline
            pygame.draw.polygon(surface, (180, 220, 255),
                                [tip_fwd, side_l, tip_back, side_r], 1)

        for effect in self.effects:
            effect.draw(surface, camera)
