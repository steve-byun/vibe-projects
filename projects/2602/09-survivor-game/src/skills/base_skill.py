"""Base skill class and skill factory for loading skills from JSON."""

import json
import math
import os
import random

import pygame

from src.core.settings import SKILL_MAX_LEVEL, COLOR_WHITE


# Load skill data
_data_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'skills.json')
with open(_data_path, 'r', encoding='utf-8') as _f:
    _SKILL_DATA = json.load(_f)

SKILL_DEFS = {s['id']: s for s in _SKILL_DATA['skills']}
EVOLUTION_DEFS = {e['id']: e for e in _SKILL_DATA['evolutions']}
# Build reverse lookup: skill_id -> list of evolutions it participates in
SKILL_EVOLUTION_MAP = {}
for evo in _SKILL_DATA['evolutions']:
    for req in evo['requires']:
        SKILL_EVOLUTION_MAP.setdefault(req, []).append(evo)


class SkillProjectile:
    """A projectile spawned by a skill."""

    def __init__(self, x: float, y: float, dx: float, dy: float,
                 speed: float, damage: int, radius: int,
                 color: tuple, pierce: int = 0, lifetime: float = 3.0,
                 homing: bool = False, returning: bool = False,
                 owner_x: float = 0, owner_y: float = 0):
        self.x = x
        self.y = y
        self.dx = dx
        self.dy = dy
        self.speed = speed
        self.damage = damage
        self.radius = radius
        self.color = color
        self.alive = True
        self.pierce = pierce  # How many enemies it can pass through
        self.hit_count = 0
        self.lifetime = lifetime
        self.timer = 0.0
        self.homing = homing
        self.returning = returning
        self.returned = False
        self.owner_x = owner_x
        self.owner_y = owner_y
        self.travel_dist = 0.0
        self.max_travel = 0.0  # Set by boomerang
        self._hit_enemies = set()  # Track which enemies were already hit

    def update(self, dt: float, enemies: list = None,
               owner_x: float = 0, owner_y: float = 0):
        """Update projectile position.

        Args:
            dt: Delta time.
            enemies: List of enemies for homing.
            owner_x: Current owner x for returning projectiles.
            owner_y: Current owner y for returning projectiles.
        """
        if not self.alive:
            return

        self.timer += dt
        if self.timer >= self.lifetime:
            self.alive = False
            return

        self.owner_x = owner_x
        self.owner_y = owner_y

        # Homing behavior
        if self.homing and enemies:
            nearest = None
            nearest_dist = float('inf')
            for e in enemies:
                if not e.alive:
                    continue
                edx = e.x - self.x
                edy = e.y - self.y
                d = math.sqrt(edx * edx + edy * edy)
                if d < nearest_dist:
                    nearest_dist = d
                    nearest = e
            if nearest and nearest_dist > 0:
                edx = nearest.x - self.x
                edy = nearest.y - self.y
                d = nearest_dist
                # Steer toward target
                target_dx = edx / d
                target_dy = edy / d
                turn_rate = 3.0 * dt
                self.dx += (target_dx - self.dx) * turn_rate
                self.dy += (target_dy - self.dy) * turn_rate
                # Normalize
                length = math.sqrt(self.dx * self.dx + self.dy * self.dy) or 1
                self.dx /= length
                self.dy /= length

        # Returning behavior (boomerang)
        if self.returning and not self.returned:
            self.travel_dist += self.speed * dt
            if self.travel_dist >= self.max_travel:
                self.returned = True
                self._hit_enemies.clear()  # Can hit again on return

        if self.returned:
            # Move back toward owner
            to_owner_x = owner_x - self.x
            to_owner_y = owner_y - self.y
            dist = math.sqrt(to_owner_x * to_owner_x + to_owner_y * to_owner_y) or 1
            self.dx = to_owner_x / dist
            self.dy = to_owner_y / dist
            if dist < 20:
                self.alive = False
                return

        # Move
        self.x += self.dx * self.speed * dt
        self.y += self.dy * self.speed * dt

    def check_hit(self, enemy) -> bool:
        """Check if this projectile hits the given enemy.

        Returns:
            True if hit and damage should be applied.
        """
        if not self.alive or not enemy.alive:
            return False
        if id(enemy) in self._hit_enemies:
            return False

        dx = enemy.x - self.x
        dy = enemy.y - self.y
        dist = math.sqrt(dx * dx + dy * dy)
        hit_dist = self.radius + enemy.radius

        if dist <= hit_dist:
            self._hit_enemies.add(id(enemy))
            self.hit_count += 1
            if self.hit_count > self.pierce + 1:
                self.alive = False
            return True
        return False

    def draw(self, surface: pygame.Surface, camera):
        if not self.alive:
            return
        sx, sy = camera.apply(self.x, self.y)
        sx_i = int(sx)
        sy_i = int(sy)
        r = self.radius
        angle = math.atan2(self.dy, self.dx)

        # Glow behind
        glow_r = int(r * 1.4)
        glow_surf = pygame.Surface((glow_r * 2 + 2, glow_r * 2 + 2), pygame.SRCALPHA)
        pygame.draw.circle(glow_surf, (*self.color[:3], 40),
                           (glow_r + 1, glow_r + 1), glow_r)
        surface.blit(glow_surf, (sx_i - glow_r - 1, sy_i - glow_r - 1))

        # Arrow/bolt shape
        tip = (sx_i + int(math.cos(angle) * r * 1.2),
               sy_i + int(math.sin(angle) * r * 1.2))
        perp = angle + math.pi / 2
        hw = r * 0.5
        base_l = (sx_i + int(math.cos(perp) * hw) - int(math.cos(angle) * r * 0.3),
                  sy_i + int(math.sin(perp) * hw) - int(math.sin(angle) * r * 0.3))
        base_r = (sx_i - int(math.cos(perp) * hw) - int(math.cos(angle) * r * 0.3),
                  sy_i - int(math.sin(perp) * hw) - int(math.sin(angle) * r * 0.3))
        pygame.draw.polygon(surface, self.color, [tip, base_l, base_r])
        # Shaft line
        tail = (sx_i - int(math.cos(angle) * r), sy_i - int(math.sin(angle) * r))
        pygame.draw.line(surface, self.color, tail, (sx_i, sy_i), max(1, r // 3))
        # White center
        pygame.draw.circle(surface, (255, 255, 255), (sx_i, sy_i), max(1, r // 3))


class SkillEffect:
    """A visual/damage area effect (for AOE skills)."""

    def __init__(self, x: float, y: float, radius: float, damage: int,
                 duration: float, color: tuple, tick_rate: float = 0.5,
                 pull_strength: float = 0.0):
        self.x = x
        self.y = y
        self.radius = radius
        self.damage = damage
        self.duration = duration
        self.color = color
        self.alive = True
        self.timer = 0.0
        self.tick_rate = tick_rate
        self.tick_timer = 0.0
        self.pull_strength = pull_strength
        self.alpha = 180

    def update(self, dt: float) -> bool:
        """Update effect. Returns True if it should deal damage this frame."""
        if not self.alive:
            return False
        self.timer += dt
        if self.timer >= self.duration:
            self.alive = False
            return False

        # Fade out near end
        remaining_ratio = 1.0 - (self.timer / self.duration)
        self.alpha = int(180 * remaining_ratio)

        # Tick damage
        self.tick_timer += dt
        if self.tick_timer >= self.tick_rate:
            self.tick_timer -= self.tick_rate
            return True
        return False

    def draw(self, surface: pygame.Surface, camera):
        if not self.alive:
            return
        sx, sy = camera.apply(self.x, self.y)
        # Draw semi-transparent circle
        effect_surf = pygame.Surface((int(self.radius * 2), int(self.radius * 2)), pygame.SRCALPHA)
        alpha = max(0, min(255, self.alpha))
        draw_color = (*self.color[:3], alpha)
        pygame.draw.circle(effect_surf, draw_color,
                           (int(self.radius), int(self.radius)), int(self.radius))
        surface.blit(effect_surf,
                     (int(sx - self.radius), int(sy - self.radius)))


class BaseSkill:
    """Base class for all skills."""

    def __init__(self, skill_id: str):
        if skill_id in SKILL_DEFS:
            sdef = SKILL_DEFS[skill_id]
        elif skill_id in EVOLUTION_DEFS:
            sdef = EVOLUTION_DEFS[skill_id]
        else:
            raise ValueError(f"Unknown skill: {skill_id}")

        self.id = skill_id
        self.name = sdef['name']
        self.description = sdef.get('description', '')
        self.skill_type = sdef['type']
        self.color = tuple(sdef['color'])
        self.level = 1
        self.max_level = SKILL_MAX_LEVEL
        self.is_evolved = skill_id in EVOLUTION_DEFS

        # Base stats
        self.base_damage = sdef['damage']
        self.base_cooldown = sdef['cooldown']
        self.base_range = sdef.get('range', 0)
        self.base_projectile_count = sdef.get('projectile_count', 1)
        self.base_projectile_speed = sdef.get('projectile_speed', 0)
        self.base_projectile_size = sdef.get('projectile_size', 8)
        self.base_duration = sdef.get('duration', 0)

        # Level stats lookup
        self._level_stats = sdef.get('level_stats', {})

        # Current computed stats
        self.damage = self.base_damage
        self.cooldown = self.base_cooldown
        self.range = self.base_range
        self.projectile_count = self.base_projectile_count
        self.projectile_speed = self.base_projectile_speed
        self.projectile_size = self.base_projectile_size
        self.duration = self.base_duration

        # Cooldown timer
        self.cooldown_timer = 0.0
        self.ready = True if self.cooldown == 0 else False

        # Active projectiles and effects owned by this skill
        self.projectiles: list[SkillProjectile] = []
        self.effects: list[SkillEffect] = []

        # Apply level 1 stats
        self._apply_level_stats()

    def _apply_level_stats(self):
        """Apply stats for current level."""
        level_key = str(self.level)
        if level_key in self._level_stats:
            stats = self._level_stats[level_key]
            self.damage = stats.get('damage', self.damage)
            self.cooldown = stats.get('cooldown', self.cooldown)
            self.range = stats.get('range', self.range)
            self.projectile_count = stats.get('projectile_count', self.projectile_count)
            self.duration = stats.get('duration', self.duration)

    def level_up(self) -> bool:
        """Increase skill level by 1.

        Returns:
            True if leveled up, False if already max.
        """
        if self.level >= self.max_level:
            return False
        self.level += 1
        self._apply_level_stats()
        return True

    def update(self, dt: float, player, enemies: list):
        """Update skill: cooldown, auto-fire, projectiles, effects.

        Args:
            dt: Delta time.
            player: Player object.
            enemies: List of enemies.
        """
        # Cooldown
        if self.cooldown > 0:
            self.cooldown_timer += dt
            if self.cooldown_timer >= self.cooldown:
                self.ready = True

        # Auto-fire when ready
        if self.ready and self.cooldown > 0:
            self.activate(player, enemies)
            self.cooldown_timer = 0.0
            self.ready = False

        # For orbit/continuous skills (cooldown=0), activate every frame
        if self.cooldown == 0:
            self.activate(player, enemies)

        # Update projectiles
        for proj in self.projectiles:
            proj.update(dt, enemies, player.x, player.y)
        self.projectiles = [p for p in self.projectiles if p.alive]

        # Update effects
        for effect in self.effects:
            should_damage = effect.update(dt)
            if should_damage:
                self._apply_aoe_damage(effect, enemies)
            # Apply pull
            if effect.pull_strength > 0 and effect.alive:
                self._apply_pull(effect, enemies, dt)
        self.effects = [e for e in self.effects if e.alive]

    def activate(self, player, enemies: list):
        """Fire the skill. Override in subclasses for custom behavior."""
        pass

    def check_hits(self, enemies: list) -> list:
        """Check all projectiles against all enemies.

        Returns:
            List of (enemy, damage, is_crit) tuples for hits this frame.
        """
        hits = []
        for proj in self.projectiles:
            for enemy in enemies:
                if proj.check_hit(enemy):
                    hits.append((enemy, proj.damage, False))
        return hits

    def _apply_aoe_damage(self, effect: SkillEffect, enemies: list):
        """Apply AOE damage from an effect to enemies in range."""
        for enemy in enemies:
            if not enemy.alive:
                continue
            dx = enemy.x - effect.x
            dy = enemy.y - effect.y
            dist = math.sqrt(dx * dx + dy * dy)
            if dist <= effect.radius + enemy.radius:
                enemy.take_damage(effect.damage)

    def _apply_pull(self, effect: SkillEffect, enemies: list, dt: float):
        """Pull enemies toward an effect center."""
        for enemy in enemies:
            if not enemy.alive:
                continue
            dx = effect.x - enemy.x
            dy = effect.y - enemy.y
            dist = math.sqrt(dx * dx + dy * dy)
            if 0 < dist <= effect.radius * 1.5:
                strength = effect.pull_strength * (1.0 - dist / (effect.radius * 1.5))
                enemy.x += (dx / dist) * strength * dt
                enemy.y += (dy / dist) * strength * dt

    def _find_nearest_enemy(self, x: float, y: float, enemies: list,
                            max_range: float = 0) -> object | None:
        """Find nearest alive enemy within range."""
        if max_range <= 0:
            max_range = self.range
        nearest = None
        nearest_dist = max_range * max_range
        for e in enemies:
            if not e.alive:
                continue
            dx = e.x - x
            dy = e.y - y
            d2 = dx * dx + dy * dy
            if d2 < nearest_dist:
                nearest_dist = d2
                nearest = e
        return nearest

    def _find_enemies_in_range(self, x: float, y: float, enemies: list,
                               max_range: float = 0) -> list:
        """Find all alive enemies within range."""
        if max_range <= 0:
            max_range = self.range
        result = []
        range_sq = max_range * max_range
        for e in enemies:
            if not e.alive:
                continue
            dx = e.x - x
            dy = e.y - y
            if dx * dx + dy * dy <= range_sq:
                result.append(e)
        return result

    def draw(self, surface: pygame.Surface, camera):
        """Draw skill projectiles and effects."""
        for proj in self.projectiles:
            proj.draw(surface, camera)
        for effect in self.effects:
            effect.draw(surface, camera)

    def get_display_stats(self) -> dict:
        """Get stats dict for UI display."""
        return {
            'name': self.name,
            'level': self.level,
            'damage': self.damage,
            'cooldown': self.cooldown,
            'range': self.range,
            'type': self.skill_type,
            'color': self.color,
            'description': self.description,
        }
