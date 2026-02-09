"""Flame Circle skill - expanding fire ring that damages nearby enemies."""

import math

import pygame

from src.skills.base_skill import BaseSkill


class FlameCircle(BaseSkill):
    """A ring of fire around the player that burns enemies on contact."""

    def __init__(self):
        super().__init__('flame_circle')
        self._pulse_timer = 0.0
        self._pulse_speed = 2.0
        self._hit_cooldowns = {}  # enemy id -> timer

    def activate(self, player, enemies: list):
        """Flame circle is always active, no activation needed."""
        pass

    def update(self, dt: float, player, enemies: list):
        """Update flame animation and damage ticks."""
        self._pulse_timer += dt * self._pulse_speed

        # Decay hit cooldowns
        to_remove = []
        for eid, timer in self._hit_cooldowns.items():
            self._hit_cooldowns[eid] = timer - dt
            if self._hit_cooldowns[eid] <= 0:
                to_remove.append(eid)
        for eid in to_remove:
            del self._hit_cooldowns[eid]

    def check_hits(self, enemies: list) -> list:
        """Check which enemies are within the flame ring."""
        # We need player position - stored from draw; use a workaround
        return []

    def check_hits_with_player(self, player, enemies: list) -> list:
        """Check flame damage with player position."""
        hits = []
        for enemy in enemies:
            if not enemy.alive:
                continue
            if id(enemy) in self._hit_cooldowns:
                continue

            dx = enemy.x - player.x
            dy = enemy.y - player.y
            dist = math.sqrt(dx * dx + dy * dy)

            # Damage enemies within the ring (between 0.7*range and 1.1*range)
            inner = self.range * 0.5
            outer = self.range * 1.1
            if inner <= dist <= outer:
                hits.append((enemy, self.damage, False))
                self._hit_cooldowns[id(enemy)] = 0.4  # Tick rate

        return hits

    def draw(self, surface: pygame.Surface, camera):
        """Draw the flame ring around the player."""
        pass  # Drawn from outside with player position

    def draw_at(self, surface: pygame.Surface, camera,
                player_x: float, player_y: float):
        """Draw the flame circle as flickering flame shapes around the player."""
        sx, sy = camera.apply(player_x, player_y)
        sx_i = int(sx)
        sy_i = int(sy)
        t = pygame.time.get_ticks()

        # Pulsing radius
        pulse = math.sin(self._pulse_timer) * 5
        radius = int(self.range + pulse)

        # Create surface for semi-transparent drawing
        surf_size = (radius + 20) * 2
        ring_surf = pygame.Surface((surf_size, surf_size), pygame.SRCALPHA)
        center = surf_size // 2

        # Outer glow ring
        pygame.draw.circle(ring_surf, (*self.color, 25), (center, center), radius + 4)

        # Draw individual flame shapes around the circle
        flame_count = max(12, radius // 5)
        for i in range(flame_count):
            flame_angle = (2 * math.pi * i / flame_count) + t * 0.002
            fx = center + int(math.cos(flame_angle) * radius)
            fy = center + int(math.sin(flame_angle) * radius)

            # Flame flicker
            flicker = math.sin(t * 0.012 + i * 1.7) * 4 + 3
            flame_h = int(8 + flicker)

            # Flame triangle (pointed outward)
            outward_cos = math.cos(flame_angle)
            outward_sin = math.sin(flame_angle)
            perp_cos = math.cos(flame_angle + math.pi / 2)
            perp_sin = math.sin(flame_angle + math.pi / 2)

            tip = (fx + int(outward_cos * flame_h), fy + int(outward_sin * flame_h))
            base_w = 3
            bl = (fx + int(perp_cos * base_w), fy + int(perp_sin * base_w))
            br = (fx - int(perp_cos * base_w), fy - int(perp_sin * base_w))

            # Outer flame (orange-red)
            flame_color_outer = (255, max(80, 150 - int(flicker * 10)), 0, 100)
            pygame.draw.polygon(ring_surf, flame_color_outer, [tip, bl, br])

            # Inner flame (yellow-white core)
            inner_h = flame_h * 0.5
            inner_tip = (fx + int(outward_cos * inner_h), fy + int(outward_sin * inner_h))
            inner_w = 1.5
            ibl = (fx + int(perp_cos * inner_w), fy + int(perp_sin * inner_w))
            ibr = (fx - int(perp_cos * inner_w), fy - int(perp_sin * inner_w))
            inner_pts = [(int(inner_tip[0]), int(inner_tip[1])),
                         (int(ibl[0]), int(ibl[1])),
                         (int(ibr[0]), int(ibr[1]))]
            pygame.draw.polygon(ring_surf, (255, 220, 80, 120), inner_pts)

        # Inner ring glow
        pygame.draw.circle(ring_surf, (255, 200, 50, 30), (center, center),
                           int(radius * 0.85), 3)

        surface.blit(ring_surf, (sx_i - center, sy_i - center))
