"""EXP gem system - handles gem drops, magnet attraction, and collection."""

import math
import random

import pygame

from src.core.settings import (
    EXP_GEM_SIZE, EXP_GEM_MAGNET_SPEED,
    COLOR_EXP_GREEN, COLOR_EXP_BLUE, COLOR_EXP_PURPLE,
)


class ExpGem:
    """A single EXP gem dropped by an enemy."""

    def __init__(self, x: float, y: float, amount: int):
        self.x = x + random.uniform(-8, 8)
        self.y = y + random.uniform(-8, 8)
        self.amount = amount
        self.alive = True
        self.collected = False

        # Visual
        self.radius = EXP_GEM_SIZE
        if amount >= 20:
            self.color = COLOR_EXP_PURPLE
            self.radius = EXP_GEM_SIZE + 3
        elif amount >= 5:
            self.color = COLOR_EXP_BLUE
            self.radius = EXP_GEM_SIZE + 1
        else:
            self.color = COLOR_EXP_GREEN

        # Animation
        self.bob_timer = random.uniform(0, math.pi * 2)
        self.base_y = self.y

        # Magnet movement
        self.magnetized = False
        self.magnet_speed = 0.0

        # Spawn pop effect
        self.spawn_timer = 0.0
        self.spawn_duration = 0.3
        vangle = random.uniform(0, 2 * math.pi)
        vspeed = random.uniform(40, 80)
        self.vx = math.cos(vangle) * vspeed
        self.vy = math.sin(vangle) * vspeed

    def update(self, dt: float, player_x: float, player_y: float,
               pickup_range: float) -> bool:
        """Update gem position and check for pickup.

        Args:
            dt: Delta time.
            player_x: Player x position.
            player_y: Player y position.
            pickup_range: Player's magnet range.

        Returns:
            True if the gem was collected by the player.
        """
        if not self.alive:
            return False

        # Spawn pop
        if self.spawn_timer < self.spawn_duration:
            self.spawn_timer += dt
            self.x += self.vx * dt
            self.y += self.vy * dt
            self.vx *= 0.9
            self.vy *= 0.9
            self.base_y = self.y
            return False

        # Bob animation
        self.bob_timer += dt * 3.0
        self.y = self.base_y + math.sin(self.bob_timer) * 2

        # Check distance to player
        dx = player_x - self.x
        dy = player_y - self.y
        dist = math.sqrt(dx * dx + dy * dy)

        if dist <= pickup_range:
            self.magnetized = True

        if self.magnetized:
            # Accelerate toward player
            self.magnet_speed = min(self.magnet_speed + EXP_GEM_MAGNET_SPEED * dt * 3,
                                    EXP_GEM_MAGNET_SPEED * 2)
            if dist > 1:
                nx = dx / dist
                ny = dy / dist
                self.x += nx * self.magnet_speed * dt
                self.base_y += ny * self.magnet_speed * dt
                self.y = self.base_y + math.sin(self.bob_timer) * 2

            # Collect if close enough
            if dist < 15:
                self.alive = False
                self.collected = True
                return True

        return False

    def draw(self, surface: pygame.Surface, camera):
        """Draw the gem as a diamond/gem shape with sparkle effect."""
        if not self.alive:
            return

        sx, sy = camera.apply(self.x, self.y)
        sx_i = int(sx)
        sy_i = int(sy)
        r = self.radius
        t = pygame.time.get_ticks()

        # Glow behind (larger transparent circle)
        glow_r = r + 3
        glow_surf = pygame.Surface((glow_r * 2 + 2, glow_r * 2 + 2), pygame.SRCALPHA)
        glow_color = (*tuple(min(255, c + 40) for c in self.color), 60)
        pygame.draw.circle(glow_surf, glow_color, (glow_r + 1, glow_r + 1), glow_r)
        surface.blit(glow_surf, (sx_i - glow_r - 1, sy_i - glow_r - 1))

        # Diamond / rotated square shape
        diamond_pts = [
            (sx_i, sy_i - r - 1),   # top
            (sx_i + r, sy_i),        # right
            (sx_i, sy_i + r + 1),    # bottom
            (sx_i - r, sy_i),        # left
        ]
        pygame.draw.polygon(surface, self.color, diamond_pts)

        # Upper facet (lighter)
        upper_color = (min(255, self.color[0] + 50),
                       min(255, self.color[1] + 50),
                       min(255, self.color[2] + 50))
        pygame.draw.polygon(surface, upper_color, [
            diamond_pts[0], diamond_pts[1], (sx_i, sy_i), diamond_pts[3],
        ])

        # Outline
        pygame.draw.polygon(surface, (255, 255, 255), diamond_pts, 1)

        # Center highlight line
        pygame.draw.line(surface, (255, 255, 255),
                         (sx_i, sy_i - r + 1), (sx_i, sy_i), 1)

        # Sparkle effect: small white dots that appear/disappear
        sparkle_phase = (t + hash((sx_i, sy_i)) % 1000) % 800
        if sparkle_phase < 200:
            # Show sparkle
            sp_x = sx_i - r // 3
            sp_y = sy_i - r // 3
            # Small cross sparkle
            sl = max(1, r // 3)
            pygame.draw.line(surface, (255, 255, 255),
                             (sp_x - sl, sp_y), (sp_x + sl, sp_y), 1)
            pygame.draw.line(surface, (255, 255, 255),
                             (sp_x, sp_y - sl), (sp_x, sp_y + sl), 1)
        elif 400 < sparkle_phase < 500:
            # Second sparkle at different position
            sp_x = sx_i + r // 4
            sp_y = sy_i + r // 4
            pygame.draw.circle(surface, (255, 255, 255), (sp_x, sp_y), 1)


class ExpSystem:
    """Manages all EXP gems in the world."""

    def __init__(self):
        self.gems: list[ExpGem] = []

    def spawn_gem(self, x: float, y: float, exp_amount: int):
        """Spawn an EXP gem at the given position.

        For large EXP amounts, split into multiple gems.
        """
        if exp_amount <= 0:
            return

        if exp_amount >= 40:
            # Split into purple gems
            count = exp_amount // 20
            remainder = exp_amount % 20
            for _ in range(count):
                self.gems.append(ExpGem(x, y, 20))
            if remainder >= 5:
                self.gems.append(ExpGem(x, y, remainder))
            elif remainder > 0:
                self.gems.append(ExpGem(x, y, remainder))
        elif exp_amount >= 10:
            # Split into blue gems
            count = exp_amount // 5
            remainder = exp_amount % 5
            for _ in range(count):
                self.gems.append(ExpGem(x, y, 5))
            if remainder > 0:
                self.gems.append(ExpGem(x, y, remainder))
        else:
            self.gems.append(ExpGem(x, y, exp_amount))

    def update(self, dt: float, player) -> int:
        """Update all gems and return total EXP collected.

        Args:
            dt: Delta time.
            player: Player object with x, y, pickup_range.

        Returns:
            Total EXP collected this frame.
        """
        total_exp = 0
        for gem in self.gems:
            if gem.update(dt, player.x, player.y, player.pickup_range):
                total_exp += gem.amount

        # Remove dead gems
        self.gems = [g for g in self.gems if g.alive]

        return total_exp

    def magnetize_all(self):
        """Pull all gems toward player (e.g., on wave complete)."""
        for gem in self.gems:
            gem.magnetized = True

    def draw(self, surface: pygame.Surface, camera):
        """Draw all gems."""
        for gem in self.gems:
            gem.draw(surface, camera)

    def clear(self):
        """Remove all gems."""
        self.gems.clear()
