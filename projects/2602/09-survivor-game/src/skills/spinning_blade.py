"""Spinning Blade skill - blades orbit around the player."""

import math
import pygame

from src.skills.base_skill import BaseSkill


class SpinningBlade(BaseSkill):
    """Blades that orbit around the player, damaging enemies on contact."""

    def __init__(self):
        super().__init__('spinning_blade')
        self._angle = 0.0
        self._rotation_speed = 3.0  # radians per second
        self._blade_positions = []
        self._hit_cooldowns = {}  # enemy_id -> timer

    def activate(self, player, enemies: list):
        """Update blade positions around player."""
        pass  # Handled in update

    def update(self, dt: float, player, enemies: list):
        """Rotate blades and check for collisions."""
        self._angle += self._rotation_speed * dt

        # Calculate blade positions
        self._blade_positions = []
        for i in range(self.projectile_count):
            angle = self._angle + (2 * math.pi * i / self.projectile_count)
            bx = player.x + math.cos(angle) * self.range
            by = player.y + math.sin(angle) * self.range
            self._blade_positions.append((bx, by))

        # Decay hit cooldowns
        to_remove = []
        for eid, timer in self._hit_cooldowns.items():
            self._hit_cooldowns[eid] = timer - dt
            if self._hit_cooldowns[eid] <= 0:
                to_remove.append(eid)
        for eid in to_remove:
            del self._hit_cooldowns[eid]

    def check_hits(self, enemies: list) -> list:
        """Check blade collisions with enemies."""
        hits = []
        blade_radius = self.base_projectile_size

        for bx, by in self._blade_positions:
            for enemy in enemies:
                if not enemy.alive:
                    continue
                if id(enemy) in self._hit_cooldowns:
                    continue

                dx = enemy.x - bx
                dy = enemy.y - by
                dist = math.sqrt(dx * dx + dy * dy)
                if dist <= blade_radius + enemy.radius:
                    hits.append((enemy, self.damage, False))
                    self._hit_cooldowns[id(enemy)] = 0.3  # Hit cooldown per enemy

        return hits

    def draw(self, surface: pygame.Surface, camera):
        """Draw spinning blades as actual sword/blade shapes rotating."""
        blade_radius = self.base_projectile_size
        for idx, (bx, by) in enumerate(self._blade_positions):
            sx, sy = camera.apply(bx, by)
            sx_i = int(sx)
            sy_i = int(sy)
            # Each blade rotates based on orbit angle
            blade_angle = self._angle + idx * math.pi / self.projectile_count
            cos_a = math.cos(blade_angle)
            sin_a = math.sin(blade_angle)
            br = blade_radius
            # Sword shape: pointed tip, narrow body, wider guard
            # Tip
            tip = (sx_i + int(cos_a * br * 1.3), sy_i + int(sin_a * br * 1.3))
            # Blade sides
            perp_cos = math.cos(blade_angle + math.pi / 2)
            perp_sin = math.sin(blade_angle + math.pi / 2)
            hw = br * 0.25  # half-width of blade
            mid_fwd = 0.3 * br
            bl1 = (sx_i + int(cos_a * mid_fwd + perp_cos * hw),
                   sy_i + int(sin_a * mid_fwd + perp_sin * hw))
            br1 = (sx_i + int(cos_a * mid_fwd - perp_cos * hw),
                   sy_i + int(sin_a * mid_fwd - perp_sin * hw))
            # Guard (wider)
            gw = br * 0.45
            gl = (sx_i + int(-cos_a * 0.1 * br + perp_cos * gw),
                  sy_i + int(-sin_a * 0.1 * br + perp_sin * gw))
            gr = (sx_i + int(-cos_a * 0.1 * br - perp_cos * gw),
                  sy_i + int(-sin_a * 0.1 * br - perp_sin * gw))
            # Pommel
            pommel = (sx_i - int(cos_a * br * 0.6), sy_i - int(sin_a * br * 0.6))
            # Draw blade polygon
            blade_pts = [tip, bl1, gl, pommel, gr, br1]
            pygame.draw.polygon(surface, self.color, blade_pts)
            # Bright edge highlight
            pygame.draw.line(surface, (220, 230, 255), tip, bl1, 1)
            pygame.draw.line(surface, (220, 230, 255), tip, br1, 1)
            # Guard crossbar
            pygame.draw.line(surface, (180, 160, 100), gl, gr, 2)
            # Outline
            pygame.draw.polygon(surface, (255, 255, 255), blade_pts, 1)
