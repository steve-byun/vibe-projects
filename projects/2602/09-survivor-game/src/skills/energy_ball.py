"""Energy Ball skill - fires toward nearest enemy, pierces 2 enemies."""

import math

import pygame

from src.skills.base_skill import BaseSkill, SkillProjectile


class EnergyBall(BaseSkill):
    """Fires an energy ball toward the nearest enemy that pierces through enemies."""

    def __init__(self):
        super().__init__('energy_ball')
        self._trail_positions = []  # List of (x, y, timer) for trail

    def activate(self, player, enemies: list):
        """Fire energy balls toward nearest enemies."""
        for i in range(self.projectile_count):
            target = self._find_nearest_enemy(player.x, player.y, enemies)
            if target is None:
                return

            dx = target.x - player.x
            dy = target.y - player.y
            dist = math.sqrt(dx * dx + dy * dy) or 1
            nx = dx / dist
            ny = dy / dist

            # Slight spread for multiple projectiles
            if self.projectile_count > 1 and i > 0:
                spread = (i - self.projectile_count / 2) * 0.15
                cos_s = math.cos(spread)
                sin_s = math.sin(spread)
                nx, ny = nx * cos_s - ny * sin_s, nx * sin_s + ny * cos_s

            proj = SkillProjectile(
                player.x, player.y, nx, ny,
                self.projectile_speed, self.damage,
                self.base_projectile_size, self.color,
                pierce=2, lifetime=2.0,
            )
            self.projectiles.append(proj)

    def draw(self, surface: pygame.Surface, camera):
        """Draw energy balls with glowing particle trail effect."""
        t = pygame.time.get_ticks()
        for proj in self.projectiles:
            if not proj.alive:
                continue
            sx, sy = camera.apply(proj.x, proj.y)
            sx_i = int(sx)
            sy_i = int(sy)
            r = proj.radius

            # Trail: fading circles along movement direction
            angle = math.atan2(proj.dy, proj.dx)
            for i in range(5):
                trail_dist = (i + 1) * r * 0.6
                tx = sx_i - int(math.cos(angle) * trail_dist)
                ty = sy_i - int(math.sin(angle) * trail_dist)
                trail_r = max(1, int(r * (0.7 - i * 0.1)))
                trail_alpha = max(15, 100 - i * 20)
                t_surf = pygame.Surface((trail_r * 2 + 2, trail_r * 2 + 2), pygame.SRCALPHA)
                pygame.draw.circle(t_surf, (*proj.color[:3], trail_alpha),
                                   (trail_r + 1, trail_r + 1), trail_r)
                surface.blit(t_surf, (tx - trail_r - 1, ty - trail_r - 1))

            # Outer glow
            glow_r = int(r * 1.6)
            glow_surf = pygame.Surface((glow_r * 2 + 2, glow_r * 2 + 2), pygame.SRCALPHA)
            pygame.draw.circle(glow_surf, (*proj.color[:3], 50),
                               (glow_r + 1, glow_r + 1), glow_r)
            surface.blit(glow_surf, (sx_i - glow_r - 1, sy_i - glow_r - 1))

            # Core ball
            pygame.draw.circle(surface, proj.color, (sx_i, sy_i), r)
            # Bright center
            pygame.draw.circle(surface, (255, 255, 255), (sx_i, sy_i), max(1, r // 2))
            # Pulsing ring
            pulse_r = r + int(math.sin(t * 0.015) * 2)
            pygame.draw.circle(surface, proj.color, (sx_i, sy_i), pulse_r, 1)

        for effect in self.effects:
            effect.draw(surface, camera)
