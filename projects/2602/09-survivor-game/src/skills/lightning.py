"""Lightning skill - strikes random nearby enemy, chains to 2 more."""

import math
import random

import pygame

from src.skills.base_skill import BaseSkill


class LightningBolt:
    """Visual representation of a lightning strike."""

    def __init__(self, start_x: float, start_y: float,
                 end_x: float, end_y: float, color: tuple):
        self.start_x = start_x
        self.start_y = start_y
        self.end_x = end_x
        self.end_y = end_y
        self.color = color
        self.alive = True
        self.timer = 0.0
        self.duration = 0.25
        # Generate jagged path
        self.points = self._generate_path()

    def _generate_path(self) -> list:
        """Generate jagged lightning points between start and end."""
        points = [(self.start_x, self.start_y)]
        dx = self.end_x - self.start_x
        dy = self.end_y - self.start_y
        segments = 6
        for i in range(1, segments):
            t = i / segments
            x = self.start_x + dx * t + random.uniform(-15, 15)
            y = self.start_y + dy * t + random.uniform(-15, 15)
            points.append((x, y))
        points.append((self.end_x, self.end_y))
        return points

    def update(self, dt: float):
        self.timer += dt
        if self.timer >= self.duration:
            self.alive = False

    def draw(self, surface: pygame.Surface, camera):
        if not self.alive or len(self.points) < 2:
            return
        alpha_ratio = max(0.0, 1.0 - self.timer / self.duration)
        screen_points = []
        for px, py in self.points:
            sx, sy = camera.apply(px, py)
            screen_points.append((int(sx), int(sy)))

        if len(screen_points) < 2:
            return

        # Bright flash at start
        flash_width = max(1, int(6 * alpha_ratio))
        bright_width = max(1, int(3 * alpha_ratio))
        core_width = max(1, int(1 * alpha_ratio))

        # Outer glow (wide, dim)
        outer_color = (
            min(255, int(self.color[0] * 0.6 * alpha_ratio)),
            min(255, int(self.color[1] * 0.6 * alpha_ratio)),
            min(255, int((self.color[2] + 100) * alpha_ratio)),
        )
        pygame.draw.lines(surface, outer_color, False, screen_points, flash_width)

        # Mid layer (medium, bright)
        mid_color = (
            min(255, int((self.color[0] + 80) * alpha_ratio)),
            min(255, int((self.color[1] + 80) * alpha_ratio)),
            min(255, int(self.color[2] * alpha_ratio)),
        )
        pygame.draw.lines(surface, mid_color, False, screen_points, bright_width)

        # Core (thin, white-hot)
        core_color = (
            min(255, int(255 * alpha_ratio)),
            min(255, int(255 * alpha_ratio)),
            min(255, int(255 * alpha_ratio)),
        )
        pygame.draw.lines(surface, core_color, False, screen_points, core_width)

        # Bright flash circles at each node during first half of duration
        if alpha_ratio > 0.5:
            for point in screen_points:
                node_r = max(1, int(3 * alpha_ratio))
                pygame.draw.circle(surface, (255, 255, 200), point, node_r)


class Lightning(BaseSkill):
    """Strikes a random nearby enemy with lightning, chains to nearby enemies."""

    def __init__(self):
        super().__init__('lightning')
        self._bolts: list[LightningBolt] = []
        self._chain_count = 2

    def activate(self, player, enemies: list):
        """Strike random enemies with chaining lightning."""
        targets_in_range = self._find_enemies_in_range(
            player.x, player.y, enemies)
        if not targets_in_range:
            return

        for _ in range(self.projectile_count):
            if not targets_in_range:
                break

            # Pick random target
            target = random.choice(targets_in_range)
            hit_enemies = [target]
            target.take_damage(self.damage)

            # Visual bolt from player to target
            self._bolts.append(LightningBolt(
                player.x, player.y, target.x, target.y, self.color
            ))

            # Chain to nearby enemies
            current = target
            for _ in range(self._chain_count):
                chain_range = 120
                nearest = None
                nearest_dist = chain_range * chain_range
                for e in enemies:
                    if not e.alive or e in hit_enemies:
                        continue
                    dx = e.x - current.x
                    dy = e.y - current.y
                    d2 = dx * dx + dy * dy
                    if d2 < nearest_dist:
                        nearest_dist = d2
                        nearest = e
                if nearest:
                    chain_damage = int(self.damage * 0.7)
                    nearest.take_damage(chain_damage)
                    self._bolts.append(LightningBolt(
                        current.x, current.y, nearest.x, nearest.y,
                        (200, 200, 255)
                    ))
                    hit_enemies.append(nearest)
                    current = nearest
                else:
                    break

    def update(self, dt: float, player, enemies: list):
        """Update cooldown and visual bolts."""
        # Cooldown handling
        if self.cooldown > 0:
            self.cooldown_timer += dt
            if self.cooldown_timer >= self.cooldown:
                self.ready = True

        if self.ready and self.cooldown > 0:
            self.activate(player, enemies)
            self.cooldown_timer = 0.0
            self.ready = False

        # Update bolt visuals
        for bolt in self._bolts:
            bolt.update(dt)
        self._bolts = [b for b in self._bolts if b.alive]

    def check_hits(self, enemies: list) -> list:
        """Lightning applies damage directly in activate(), no projectile hits."""
        return []

    def draw(self, surface: pygame.Surface, camera):
        for bolt in self._bolts:
            bolt.draw(surface, camera)
