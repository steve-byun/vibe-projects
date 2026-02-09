"""Drone skill - orbits at distance, shoots at nearest enemy."""

import math

import pygame

from src.skills.base_skill import BaseSkill, SkillProjectile


class Drone(BaseSkill):
    """A drone that orbits around the player and periodically shoots enemies."""

    def __init__(self):
        super().__init__('drone')
        self._orbit_angle = 0.0
        self._orbit_speed = 1.5  # radians per second
        self._orbit_radius = 60
        self._drone_x = 0.0
        self._drone_y = 0.0
        self._shoot_timer = 0.0

    def update(self, dt: float, player, enemies: list):
        """Update drone orbit and shooting."""
        # Update orbit position
        self._orbit_angle += self._orbit_speed * dt
        self._drone_x = player.x + math.cos(self._orbit_angle) * self._orbit_radius
        self._drone_y = player.y + math.sin(self._orbit_angle) * self._orbit_radius

        # Shooting cooldown
        self._shoot_timer += dt
        if self._shoot_timer >= self.cooldown:
            self._shoot_timer = 0.0
            self._shoot(enemies)

        # Update projectiles
        for proj in self.projectiles:
            proj.update(dt, enemies, player.x, player.y)
        self.projectiles = [p for p in self.projectiles if p.alive]

    def _shoot(self, enemies: list):
        """Fire projectiles from drone position toward nearest enemy."""
        for _ in range(self.projectile_count):
            target = self._find_nearest_enemy(self._drone_x, self._drone_y, enemies)
            if target is None:
                return

            dx = target.x - self._drone_x
            dy = target.y - self._drone_y
            dist = math.sqrt(dx * dx + dy * dy) or 1

            proj = SkillProjectile(
                self._drone_x, self._drone_y,
                dx / dist, dy / dist,
                self.projectile_speed, self.damage,
                self.base_projectile_size, self.color,
                pierce=0, lifetime=2.0,
            )
            self.projectiles.append(proj)

    def activate(self, player, enemies: list):
        """Drone doesn't use standard activation."""
        pass

    def check_hits(self, enemies: list) -> list:
        """Check drone projectile hits."""
        hits = []
        for proj in self.projectiles:
            for enemy in enemies:
                if proj.check_hit(enemy):
                    hits.append((enemy, proj.damage, False))
        return hits

    def draw(self, surface: pygame.Surface, camera):
        """Draw the drone as a small hexagonal mechanical shape with propeller lines."""
        sx, sy = camera.apply(self._drone_x, self._drone_y)
        sx_i = int(sx)
        sy_i = int(sy)
        t = pygame.time.get_ticks()

        # Hexagonal body
        hex_r = 8
        hex_pts = []
        for i in range(6):
            a = i * math.pi / 3 - math.pi / 6
            hx = sx_i + int(math.cos(a) * hex_r)
            hy = sy_i + int(math.sin(a) * hex_r)
            hex_pts.append((hx, hy))
        pygame.draw.polygon(surface, self.color, hex_pts)
        pygame.draw.polygon(surface, (255, 255, 255), hex_pts, 1)

        # Inner detail (smaller hexagon)
        inner_r = 4
        inner_pts = []
        for i in range(6):
            a = i * math.pi / 3 - math.pi / 6
            hx = sx_i + int(math.cos(a) * inner_r)
            hy = sy_i + int(math.sin(a) * inner_r)
            inner_pts.append((hx, hy))
        pygame.draw.polygon(surface, (min(255, self.color[0] + 40),
                                      min(255, self.color[1] + 40),
                                      min(255, self.color[2] + 40)), inner_pts, 1)

        # Propeller lines (3 spinning lines)
        prop_angle = t * 0.03
        for i in range(3):
            pa = prop_angle + i * (2 * math.pi / 3)
            p1x = sx_i + int(math.cos(pa) * (hex_r + 4))
            p1y = sy_i + int(math.sin(pa) * (hex_r + 4))
            p2x = sx_i - int(math.cos(pa) * (hex_r + 4))
            p2y = sy_i - int(math.sin(pa) * (hex_r + 4))
            pygame.draw.line(surface, (200, 200, 220), (p1x, p1y), (p2x, p2y), 1)

        # Center dot (light indicator)
        blink = (t // 300) % 2
        if blink:
            pygame.draw.circle(surface, (0, 255, 100), (sx_i, sy_i), 2)
        else:
            pygame.draw.circle(surface, (100, 100, 100), (sx_i, sy_i), 2)

        # Draw projectiles
        for proj in self.projectiles:
            proj.draw(surface, camera)
