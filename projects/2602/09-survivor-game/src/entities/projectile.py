"""Projectile base class and movement patterns."""

import math
import pygame

from src.core.settings import WORLD_WIDTH, WORLD_HEIGHT


class MovementPattern:
    """Constants for projectile movement patterns."""
    STRAIGHT = "straight"
    HOMING = "homing"
    ORBIT = "orbit"
    BOOMERANG = "boomerang"


class Projectile:
    """Base projectile that travels through the world and damages enemies.

    Supports multiple movement patterns: straight, homing, orbit, boomerang.
    """

    def __init__(
        self,
        x: float,
        y: float,
        angle: float,
        speed: float,
        damage: int,
        lifetime: float = 3.0,
        pierce: int = 1,
        radius: float = 6.0,
        color: tuple = (255, 200, 50),
        pattern: str = MovementPattern.STRAIGHT,
        owner=None,
    ):
        """
        Args:
            x: Starting world x position.
            y: Starting world y position.
            angle: Direction angle in radians (for STRAIGHT/BOOMERANG).
            speed: Movement speed in pixels per second.
            damage: Damage dealt on hit.
            lifetime: Seconds before projectile disappears.
            pierce: Number of enemies it can hit before disappearing.
            radius: Collision radius.
            color: RGB color tuple for rendering.
            pattern: Movement pattern (see MovementPattern).
            owner: Reference to the entity that fired this projectile.
        """
        self.x = x
        self.y = y
        self.angle = angle
        self.speed = speed
        self.damage = damage
        self.lifetime = lifetime
        self.max_lifetime = lifetime
        self.pierce = pierce
        self.radius = radius
        self.color = color
        self.pattern = pattern
        self.owner = owner

        # Velocity for straight movement
        self.vx = math.cos(angle) * speed
        self.vy = math.sin(angle) * speed

        # Track which enemies have been hit (for pierce)
        self.hit_enemies = set()

        # Alive flag
        self.alive = True

        # Pattern-specific state
        # Orbit
        self.orbit_angle = angle
        self.orbit_radius = 0.0
        self.orbit_speed = 0.0

        # Boomerang
        self.boomerang_phase = 0.0  # 0 to 1, outward then return
        self.origin_x = x
        self.origin_y = y

        # Homing
        self.homing_target = None
        self.homing_turn_speed = 3.0  # radians per second

    def update(self, dt: float, enemies=None, owner_x: float = 0, owner_y: float = 0):
        """Update projectile position based on movement pattern.

        Args:
            dt: Delta time in seconds.
            enemies: List of enemies (used for homing).
            owner_x: Owner's current x position (used for orbit).
            owner_y: Owner's current y position (used for orbit).
        """
        if not self.alive:
            return

        self.lifetime -= dt

        if self.lifetime <= 0:
            self.alive = False
            return

        if self.pattern == MovementPattern.STRAIGHT:
            self._update_straight(dt)
        elif self.pattern == MovementPattern.HOMING:
            self._update_homing(dt, enemies)
        elif self.pattern == MovementPattern.ORBIT:
            self._update_orbit(dt, owner_x, owner_y)
        elif self.pattern == MovementPattern.BOOMERANG:
            self._update_boomerang(dt)

        # Kill projectile if way out of world bounds
        margin = 100
        if (self.x < -margin or self.x > WORLD_WIDTH + margin or
                self.y < -margin or self.y > WORLD_HEIGHT + margin):
            self.alive = False

    def _update_straight(self, dt: float):
        """Move in a straight line."""
        self.x += self.vx * dt
        self.y += self.vy * dt

    def _update_homing(self, dt: float, enemies=None):
        """Home in on the nearest enemy."""
        # Find or re-acquire target
        if enemies and (self.homing_target is None or not self.homing_target.alive):
            self.homing_target = self._find_nearest(enemies)

        if self.homing_target and self.homing_target.alive:
            # Calculate desired angle to target
            dx = self.homing_target.x - self.x
            dy = self.homing_target.y - self.y
            desired_angle = math.atan2(dy, dx)

            # Gradually turn toward target
            angle_diff = desired_angle - self.angle
            # Normalize angle difference to [-pi, pi]
            angle_diff = (angle_diff + math.pi) % (2 * math.pi) - math.pi

            max_turn = self.homing_turn_speed * dt
            if abs(angle_diff) < max_turn:
                self.angle = desired_angle
            elif angle_diff > 0:
                self.angle += max_turn
            else:
                self.angle -= max_turn

        # Update velocity from angle
        self.vx = math.cos(self.angle) * self.speed
        self.vy = math.sin(self.angle) * self.speed

        self.x += self.vx * dt
        self.y += self.vy * dt

    def _update_orbit(self, dt: float, center_x: float, center_y: float):
        """Orbit around the owner's position."""
        self.orbit_angle += self.orbit_speed * dt
        self.x = center_x + math.cos(self.orbit_angle) * self.orbit_radius
        self.y = center_y + math.sin(self.orbit_angle) * self.orbit_radius

    def _update_boomerang(self, dt: float):
        """Move outward then return to origin."""
        phase_speed = 1.0 / (self.max_lifetime * 0.5)  # complete cycle in lifetime
        self.boomerang_phase += phase_speed * dt

        if self.boomerang_phase >= 2.0:
            self.alive = False
            return

        if self.boomerang_phase < 1.0:
            # Outward phase
            t = self.boomerang_phase
            dist = t * self.speed * self.max_lifetime * 0.3
        else:
            # Return phase
            t = 2.0 - self.boomerang_phase
            dist = t * self.speed * self.max_lifetime * 0.3

        self.x = self.origin_x + math.cos(self.angle) * dist
        self.y = self.origin_y + math.sin(self.angle) * dist

    def _find_nearest(self, enemies) -> object | None:
        """Find nearest alive enemy."""
        nearest = None
        nearest_dist_sq = float('inf')

        for enemy in enemies:
            if not enemy.alive:
                continue
            dx = enemy.x - self.x
            dy = enemy.y - self.y
            dist_sq = dx * dx + dy * dy
            if dist_sq < nearest_dist_sq:
                nearest_dist_sq = dist_sq
                nearest = enemy

        return nearest

    def on_hit(self, enemy):
        """Called when projectile hits an enemy.

        Args:
            enemy: The enemy that was hit.

        Returns:
            True if the projectile should deal damage (not already hit this enemy).
        """
        enemy_id = id(enemy)
        if enemy_id in self.hit_enemies:
            return False

        self.hit_enemies.add(enemy_id)
        self.pierce -= 1
        if self.pierce <= 0:
            self.alive = False
        return True

    def draw(self, surface: pygame.Surface, camera):
        """Draw the projectile on screen as an arrow/bolt shape.

        Args:
            surface: Pygame surface to draw on.
            camera: Camera for world-to-screen conversion.
        """
        if not self.alive:
            return

        if not camera.is_visible(self.x, self.y):
            return

        screen_x, screen_y = camera.apply(self.x, self.y)
        sx = int(screen_x)
        sy = int(screen_y)

        if self.pattern == MovementPattern.ORBIT:
            # Draw orbit projectile as a spinning rectangle
            size = int(self.radius * 2)
            angle_deg = math.degrees(self.orbit_angle)
            rect_surf = pygame.Surface((size, size), pygame.SRCALPHA)
            pygame.draw.rect(rect_surf, self.color, (0, 0, size, size))
            rotated = pygame.transform.rotate(rect_surf, -angle_deg)
            rect = rotated.get_rect(center=(sx, sy))
            surface.blit(rotated, rect)
        elif self.pattern == MovementPattern.HOMING:
            # Homing: glowing trail effect (fading circles behind) + arrow
            angle = self.angle
            r = self.radius
            # Trail: fading circles behind
            for i in range(4):
                trail_dist = (i + 1) * r * 0.7
                tx = sx - int(math.cos(angle) * trail_dist)
                ty = sy - int(math.sin(angle) * trail_dist)
                trail_r = max(1, int(r * (0.6 - i * 0.12)))
                trail_alpha = max(20, 120 - i * 30)
                trail_surf = pygame.Surface((trail_r * 2 + 2, trail_r * 2 + 2), pygame.SRCALPHA)
                pygame.draw.circle(trail_surf, (*self.color[:3], trail_alpha),
                                   (trail_r + 1, trail_r + 1), trail_r)
                surface.blit(trail_surf, (tx - trail_r - 1, ty - trail_r - 1))
            # Glow behind main projectile
            glow_r = int(r * 1.5)
            glow_surf = pygame.Surface((glow_r * 2 + 2, glow_r * 2 + 2), pygame.SRCALPHA)
            pygame.draw.circle(glow_surf, (*self.color[:3], 50),
                               (glow_r + 1, glow_r + 1), glow_r)
            surface.blit(glow_surf, (sx - glow_r - 1, sy - glow_r - 1))
            # Arrow head
            tip_x = sx + int(math.cos(angle) * r * 1.5)
            tip_y = sy + int(math.sin(angle) * r * 1.5)
            perp = angle + math.pi / 2
            base_l = (sx - int(math.cos(angle) * r * 0.5) + int(math.cos(perp) * r * 0.6),
                      sy - int(math.sin(angle) * r * 0.5) + int(math.sin(perp) * r * 0.6))
            base_r = (sx - int(math.cos(angle) * r * 0.5) - int(math.cos(perp) * r * 0.6),
                      sy - int(math.sin(angle) * r * 0.5) - int(math.sin(perp) * r * 0.6))
            pygame.draw.polygon(surface, self.color, [(tip_x, tip_y), base_l, base_r])
            pygame.draw.polygon(surface, (255, 255, 255), [(tip_x, tip_y), base_l, base_r], 1)
        else:
            # Straight/default: arrow/bolt shape (triangle + line)
            angle = self.angle
            r = self.radius
            # Glow behind
            glow_r = int(r * 1.3)
            glow_surf = pygame.Surface((glow_r * 2 + 2, glow_r * 2 + 2), pygame.SRCALPHA)
            pygame.draw.circle(glow_surf, (*self.color[:3], 40),
                               (glow_r + 1, glow_r + 1), glow_r)
            surface.blit(glow_surf, (sx - glow_r - 1, sy - glow_r - 1))
            # Arrow shaft (line behind)
            shaft_len = r * 1.5
            tail_x = sx - int(math.cos(angle) * shaft_len)
            tail_y = sy - int(math.sin(angle) * shaft_len)
            pygame.draw.line(surface, self.color, (tail_x, tail_y), (sx, sy), max(1, int(r * 0.3)))
            # Arrow head (triangle)
            tip_x = sx + int(math.cos(angle) * r * 1.2)
            tip_y = sy + int(math.sin(angle) * r * 1.2)
            perp = angle + math.pi / 2
            hw = r * 0.5
            base_l = (sx + int(math.cos(perp) * hw), sy + int(math.sin(perp) * hw))
            base_r = (sx - int(math.cos(perp) * hw), sy - int(math.sin(perp) * hw))
            pygame.draw.polygon(surface, self.color, [(tip_x, tip_y), base_l, base_r])
            # Bright center dot
            pygame.draw.circle(surface, (255, 255, 255), (sx, sy), max(1, int(r * 0.3)))


def create_projectile(
    x: float,
    y: float,
    angle: float,
    speed: float = 400,
    damage: int = 10,
    lifetime: float = 3.0,
    pierce: int = 1,
    radius: float = 6.0,
    color: tuple = (255, 200, 50),
    pattern: str = MovementPattern.STRAIGHT,
    owner=None,
    **kwargs,
) -> Projectile:
    """Factory function to create projectiles with various patterns.

    Args:
        x, y: Starting position.
        angle: Direction angle.
        speed: Movement speed.
        damage: Damage on hit.
        lifetime: Duration in seconds.
        pierce: Number of enemies to pierce.
        radius: Collision radius.
        color: RGB color.
        pattern: Movement pattern string.
        owner: Entity that fired this.
        **kwargs: Pattern-specific parameters:
            - orbit_radius, orbit_speed (for ORBIT pattern)
            - homing_turn_speed (for HOMING pattern)

    Returns:
        Configured Projectile instance.
    """
    proj = Projectile(
        x=x, y=y, angle=angle, speed=speed, damage=damage,
        lifetime=lifetime, pierce=pierce, radius=radius,
        color=color, pattern=pattern, owner=owner,
    )

    # Apply pattern-specific kwargs
    if pattern == MovementPattern.ORBIT:
        proj.orbit_radius = kwargs.get("orbit_radius", 60)
        proj.orbit_speed = kwargs.get("orbit_speed", 3.0)
        proj.orbit_angle = angle
    elif pattern == MovementPattern.HOMING:
        proj.homing_turn_speed = kwargs.get("homing_turn_speed", 3.0)

    return proj
