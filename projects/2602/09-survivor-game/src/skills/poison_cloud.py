"""Poison Cloud skill - AOE at random position near enemies."""

import math
import random

import pygame

from src.skills.base_skill import BaseSkill, SkillEffect


class PoisonCloudEffect(SkillEffect):
    """A poison cloud with bubbling visual."""

    def __init__(self, x, y, radius, damage, duration, color, tick_rate=0.5):
        super().__init__(x, y, radius, damage, duration, color, tick_rate)
        # Pre-generate bubble data for consistent look
        self._bubbles = []
        for _ in range(8):
            bx = random.uniform(-radius * 0.7, radius * 0.7)
            by = random.uniform(-radius * 0.7, radius * 0.7)
            br = random.uniform(radius * 0.2, radius * 0.5)
            speed = random.uniform(0.5, 2.0)
            phase = random.uniform(0, math.pi * 2)
            self._bubbles.append((bx, by, br, speed, phase))

    def draw(self, surface: pygame.Surface, camera):
        if not self.alive:
            return
        sx, sy = camera.apply(self.x, self.y)
        t = pygame.time.get_ticks()
        r = int(self.radius)
        alpha = max(0, min(255, self.alpha))

        # Cloud surface
        surf_size = (r + 10) * 2
        cloud_surf = pygame.Surface((surf_size, surf_size), pygame.SRCALPHA)
        center = surf_size // 2

        # Draw overlapping semi-transparent circles for cloud look
        for bx, by, br, speed, phase in self._bubbles:
            wobble = math.sin(t * 0.003 * speed + phase) * 3
            cx = center + int(bx + wobble)
            cy = center + int(by + wobble * 0.5)
            bubble_r = int(br)
            cloud_alpha = max(10, int(alpha * 0.5))
            c = (*self.color[:3], cloud_alpha)
            pygame.draw.circle(cloud_surf, c, (cx, cy), bubble_r)

        # Rising bubbles
        for i in range(3):
            bubble_phase = (t * 0.004 + i * 1.5) % 3.0
            if bubble_phase < 2.0:
                bub_x = center + int(math.sin(t * 0.005 + i * 2) * r * 0.3)
                bub_y = center - int(bubble_phase * r * 0.3)
                bub_r = max(1, int(3 - bubble_phase))
                bub_alpha = max(10, int(alpha * 0.4 * (1.0 - bubble_phase / 2.0)))
                pygame.draw.circle(cloud_surf,
                                   (*self.color[:3], bub_alpha),
                                   (bub_x, bub_y), bub_r)

        surface.blit(cloud_surf, (int(sx) - center, int(sy) - center))


class PoisonCloud(BaseSkill):
    """Drops poison clouds at random positions near enemies, dealing damage over time."""

    def __init__(self):
        super().__init__('poison_cloud')
        self._cloud_radius = 50

    def activate(self, player, enemies: list):
        """Place poison clouds near clusters of enemies."""
        targets = self._find_enemies_in_range(player.x, player.y, enemies)
        if not targets:
            return

        for _ in range(self.projectile_count):
            if not targets:
                break
            target = random.choice(targets)
            cx = target.x + random.uniform(-30, 30)
            cy = target.y + random.uniform(-30, 30)

            effect = PoisonCloudEffect(
                cx, cy,
                self._cloud_radius,
                self.damage,
                self.duration,
                self.color,
                tick_rate=0.5,
            )
            self.effects.append(effect)
