"""Laser Beam skill - line damage through all enemies in a direction."""

import math

import pygame

from src.skills.base_skill import BaseSkill


class LaserBeamVisual:
    """Visual representation of a laser beam."""

    def __init__(self, start_x: float, start_y: float,
                 end_x: float, end_y: float, color: tuple, width: int = 4):
        self.start_x = start_x
        self.start_y = start_y
        self.end_x = end_x
        self.end_y = end_y
        self.color = color
        self.width = width
        self.alive = True
        self.timer = 0.0
        self.duration = 0.3

    def update(self, dt: float):
        self.timer += dt
        if self.timer >= self.duration:
            self.alive = False

    def draw(self, surface: pygame.Surface, camera):
        if not self.alive:
            return
        alpha_ratio = 1.0 - (self.timer / self.duration)
        sx1, sy1 = camera.apply(self.start_x, self.start_y)
        sx2, sy2 = camera.apply(self.end_x, self.end_y)
        p1 = (int(sx1), int(sy1))
        p2 = (int(sx2), int(sy2))

        # Outer glow (wide, semi-transparent)
        glow_width = max(2, int((self.width + 8) * alpha_ratio))
        glow_surf = pygame.Surface((surface.get_width(), surface.get_height()), pygame.SRCALPHA)
        glow_alpha = int(40 * alpha_ratio)
        glow_color = (*tuple(min(255, c + 40) for c in self.color), glow_alpha)
        pygame.draw.line(glow_surf, glow_color, p1, p2, glow_width)
        surface.blit(glow_surf, (0, 0))

        # Mid beam (colored)
        mid_width = max(1, int((self.width + 2) * alpha_ratio))
        mid_color = tuple(min(255, int(c * alpha_ratio + 60 * alpha_ratio)) for c in self.color)
        pygame.draw.line(surface, mid_color, p1, p2, mid_width)

        # Bright core center (white-hot)
        core_width = max(1, int(self.width * 0.5 * alpha_ratio))
        core_brightness = int(255 * alpha_ratio)
        core_color = (core_brightness, core_brightness, core_brightness)
        pygame.draw.line(surface, core_color, p1, p2, core_width)

        # Start and end flash circles
        if alpha_ratio > 0.3:
            flash_r = max(2, int(6 * alpha_ratio))
            flash_alpha = int(120 * alpha_ratio)
            flash_surf = pygame.Surface((flash_r * 2 + 2, flash_r * 2 + 2), pygame.SRCALPHA)
            pygame.draw.circle(flash_surf, (*self.color, flash_alpha),
                               (flash_r + 1, flash_r + 1), flash_r)
            surface.blit(flash_surf, (p1[0] - flash_r - 1, p1[1] - flash_r - 1))
            surface.blit(flash_surf, (p2[0] - flash_r - 1, p2[1] - flash_r - 1))


class LaserBeam(BaseSkill):
    """Fires a laser beam that damages all enemies in a line."""

    def __init__(self):
        super().__init__('laser_beam')
        self._beams: list[LaserBeamVisual] = []
        self._beam_width = 10  # Collision width

    def activate(self, player, enemies: list):
        """Fire laser beams toward nearest enemies."""
        for _ in range(self.projectile_count):
            target = self._find_nearest_enemy(player.x, player.y, enemies)
            if target is None:
                return

            dx = target.x - player.x
            dy = target.y - player.y
            dist = math.sqrt(dx * dx + dy * dy) or 1
            nx = dx / dist
            ny = dy / dist

            # Extend beam to max range
            end_x = player.x + nx * self.range
            end_y = player.y + ny * self.range

            # Damage all enemies along the beam
            self._damage_along_line(player.x, player.y, end_x, end_y,
                                    nx, ny, enemies)

            # Visual
            self._beams.append(LaserBeamVisual(
                player.x, player.y, end_x, end_y, self.color, 4
            ))

    def _damage_along_line(self, x1: float, y1: float,
                           x2: float, y2: float,
                           nx: float, ny: float,
                           enemies: list):
        """Apply damage to all enemies along a line."""
        for enemy in enemies:
            if not enemy.alive:
                continue
            # Point-to-line distance
            # Vector from start to enemy
            ex = enemy.x - x1
            ey = enemy.y - y1

            # Project onto beam direction
            proj_len = ex * nx + ey * ny
            if proj_len < 0 or proj_len > self.range:
                continue

            # Perpendicular distance
            perp_x = ex - nx * proj_len
            perp_y = ey - ny * proj_len
            perp_dist = math.sqrt(perp_x * perp_x + perp_y * perp_y)

            if perp_dist <= self._beam_width + enemy.radius:
                enemy.take_damage(self.damage)

    def update(self, dt: float, player, enemies: list):
        """Update cooldown and beam visuals."""
        if self.cooldown > 0:
            self.cooldown_timer += dt
            if self.cooldown_timer >= self.cooldown:
                self.ready = True

        if self.ready and self.cooldown > 0:
            self.activate(player, enemies)
            self.cooldown_timer = 0.0
            self.ready = False

        for beam in self._beams:
            beam.update(dt)
        self._beams = [b for b in self._beams if b.alive]

    def check_hits(self, enemies: list) -> list:
        """Laser applies damage directly in activate()."""
        return []

    def draw(self, surface: pygame.Surface, camera):
        for beam in self._beams:
            beam.draw(surface, camera)
