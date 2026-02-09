"""Enemy entities with different behaviors and types."""

import math
import random
import json
import os

import pygame

from src.core.settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT,
    WORLD_WIDTH, WORLD_HEIGHT,
    ENEMY_SPAWN_MARGIN, ENEMY_FLASH_DURATION,
    COLOR_ENEMY_NORMAL, COLOR_ENEMY_ELITE, COLOR_ENEMY_BOSS,
    COLOR_WHITE,
)
from src.core.sprite_manager import (
    SpriteAnimation, get_sprite_manager, ASSETS_DIR,
)


def _rp(cx, cy, x, y, angle):
    """Rotate point (x,y) around (cx,cy) by angle radians."""
    cos_a = math.cos(angle)
    sin_a = math.sin(angle)
    dx = x - cx
    dy = y - cy
    return cx + dx * cos_a - dy * sin_a, cy + dx * sin_a + dy * cos_a


# Load enemy data from JSON
_data_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'enemies.json')
with open(_data_path, 'r', encoding='utf-8') as _f:
    _ENEMY_DATA = json.load(_f)

# Build lookup dicts
ENEMY_DEFS = {}
for _category in ('normal', 'elite', 'boss'):
    for _edef in _ENEMY_DATA['enemies'].get(_category, []):
        _edef['category'] = _category
        ENEMY_DEFS[_edef['id']] = _edef


# ---------------------------------------------------------------------------
# Enemy sprite loading (lazy, loaded once on first use)
# ---------------------------------------------------------------------------
_enemy_sprites_loaded = False
_enemy_sprite_anims = {}  # enemy_id -> {'walk': SpriteAnimation, ...}
_enemy_sprite_sizes = {}  # enemy_id -> int (target pixel size)


def _load_enemy_sprites():
    """Load sprite sheets for enemies that have PNG assets.

    Sprite layout analysis (from visual inspection):
    - bat.png: 128x128, 4x4 grid of 32x32 frames (16 walking frames)
    - skeleton.png: 320x160, 10 cols x 5 rows of 32x32 frames
    - zombie.png: 256x255, 4 cols x 4 rows of 64x~64 frames
    - slime: individual sprite sheets per action in sub-folders
      - Idle: 384x256, 6 cols x 4 rows => first row used (6 frames)
      - Walk: 512x256, 8 cols x 4 rows => first row used (8 frames)
    """
    global _enemy_sprites_loaded, _enemy_sprite_anims, _enemy_sprite_sizes
    if _enemy_sprites_loaded:
        return
    _enemy_sprites_loaded = True

    sm = get_sprite_manager()

    # --- Bat ---
    bat_path = os.path.join(ASSETS_DIR, 'bat.png')
    bat_frames = sm.split_sprite_sheet(bat_path, cols=4, rows=4,
                                       frame_width=32, frame_height=32)
    if bat_frames:
        # Use all 16 frames as a walking/flying cycle
        bat_size = ENEMY_DEFS.get('bat', {}).get('size', 10)
        target = bat_size * 3  # scale up for visibility
        scaled = sm.scale_frames(bat_frames, target)
        _enemy_sprite_anims['bat'] = {
            'walk': SpriteAnimation(scaled, fps=12.0),
        }
        _enemy_sprite_sizes['bat'] = target

    # --- Skeleton ---
    skel_path = os.path.join(ASSETS_DIR, 'skeleton.png')
    skel_frames = sm.split_sprite_sheet(skel_path, cols=10, rows=5,
                                        frame_width=32, frame_height=32)
    if skel_frames:
        # First row (10 frames) is typically the walk cycle
        walk_frames = skel_frames[:10]
        skel_size = ENEMY_DEFS.get('skeleton', {}).get('size', 13)
        target = skel_size * 3
        scaled = sm.scale_frames(walk_frames, target)
        _enemy_sprite_anims['skeleton'] = {
            'walk': SpriteAnimation(scaled, fps=10.0),
        }
        _enemy_sprite_sizes['skeleton'] = target

    # --- Zombie ---
    zombie_path = os.path.join(ASSETS_DIR, 'zombie.png')
    # 256x255 -> 4 cols, frame_width=64, frame_height=~64
    zombie_frames = sm.split_sprite_sheet(zombie_path, cols=4, rows=4,
                                          frame_width=64, frame_height=63)
    if zombie_frames:
        # First row (4 frames) for walking
        walk_frames = zombie_frames[:4]
        zombie_size = ENEMY_DEFS.get('zombie', {}).get('size', 14)
        target = zombie_size * 3
        scaled = sm.scale_frames(walk_frames, target)
        _enemy_sprite_anims['zombie'] = {
            'walk': SpriteAnimation(scaled, fps=8.0),
        }
        _enemy_sprite_sizes['zombie'] = target

    # --- Slime ---
    slime_idle_path = os.path.join(ASSETS_DIR, 'slime', 'Idle', 'Slime1_Idle_full.png')
    slime_walk_path = os.path.join(ASSETS_DIR, 'slime', 'Walk', 'Slime1_Walk_full.png')
    slime_size = ENEMY_DEFS.get('slime', {}).get('size', 12)
    target = slime_size * 3

    slime_anims = {}
    # Idle: 384x256, 6 cols x 4 rows of 64x64
    idle_frames = sm.split_sprite_sheet(slime_idle_path, cols=6, rows=4,
                                        frame_width=64, frame_height=64,
                                        count=6)  # first row only
    if idle_frames:
        scaled = sm.scale_frames(idle_frames, target)
        slime_anims['idle'] = SpriteAnimation(scaled, fps=8.0)

    # Walk: 512x256, 8 cols x 4 rows of 64x64
    walk_frames = sm.split_sprite_sheet(slime_walk_path, cols=8, rows=4,
                                        frame_width=64, frame_height=64,
                                        count=8)  # first row only
    if walk_frames:
        scaled = sm.scale_frames(walk_frames, target)
        slime_anims['walk'] = SpriteAnimation(scaled, fps=10.0)

    if slime_anims:
        _enemy_sprite_anims['slime'] = slime_anims
        _enemy_sprite_sizes['slime'] = target


class EnemyProjectile:
    """A projectile fired by a ranged enemy."""

    def __init__(self, x: float, y: float, dx: float, dy: float,
                 speed: float, damage: int, color: tuple):
        self.x = x
        self.y = y
        self.dx = dx
        self.dy = dy
        self.speed = speed
        self.damage = damage
        self.color = color
        self.radius = 4
        self.alive = True
        self.lifetime = 3.0
        self.timer = 0.0

    def update(self, dt: float):
        if not self.alive:
            return
        self.x += self.dx * self.speed * dt
        self.y += self.dy * self.speed * dt
        self.timer += dt
        if self.timer >= self.lifetime:
            self.alive = False
        # Remove if out of world
        if self.x < -50 or self.x > WORLD_WIDTH + 50 or self.y < -50 or self.y > WORLD_HEIGHT + 50:
            self.alive = False

    def draw(self, surface: pygame.Surface, camera):
        if not self.alive:
            return
        sx, sy = camera.apply(self.x, self.y)
        sx_i = int(sx)
        sy_i = int(sy)
        r = self.radius
        angle = math.atan2(self.dy, self.dx)

        # Glow behind
        glow_surf = pygame.Surface((r * 4 + 2, r * 4 + 2), pygame.SRCALPHA)
        pygame.draw.circle(glow_surf, (*self.color[:3], 40), (r * 2 + 1, r * 2 + 1), r * 2)
        surface.blit(glow_surf, (sx_i - r * 2 - 1, sy_i - r * 2 - 1))

        # Small dart/bolt shape
        tip = (sx_i + int(math.cos(angle) * r * 1.5),
               sy_i + int(math.sin(angle) * r * 1.5))
        perp = angle + math.pi / 2
        hw = r * 0.5
        bl = (sx_i + int(math.cos(perp) * hw), sy_i + int(math.sin(perp) * hw))
        br = (sx_i - int(math.cos(perp) * hw), sy_i - int(math.sin(perp) * hw))
        pygame.draw.polygon(surface, self.color, [tip, bl, br])
        # Core
        pygame.draw.circle(surface, (255, 255, 255), (sx_i, sy_i), max(1, r // 2))


class Enemy:
    """An enemy entity with behavior, HP, and rendering."""

    def __init__(self, enemy_id: str, x: float, y: float,
                 wave_hp_mult: float = 1.0, wave_dmg_mult: float = 1.0,
                 wave_spd_mult: float = 1.0):
        edef = ENEMY_DEFS[enemy_id]
        self.id = enemy_id
        self.name = edef['name']
        self.category = edef['category']

        # Position
        self.x = x
        self.y = y

        # Stats with wave scaling
        self.max_hp = int(edef['hp'] * wave_hp_mult)
        self.hp = self.max_hp
        self.speed = edef['speed'] * wave_spd_mult
        self.damage = int(edef['damage'] * wave_dmg_mult)
        self.exp_drop = edef['exp_drop']
        self.size = edef['size']
        self.base_color = tuple(edef['color'])
        self.behavior = edef['behavior']

        # Category-specific visuals
        if self.category == 'elite':
            self.outline_color = COLOR_ENEMY_ELITE
        elif self.category == 'boss':
            self.outline_color = COLOR_ENEMY_BOSS
        else:
            self.outline_color = None

        # Alive / state
        self.alive = True
        self.radius = self.size

        # Hit flash
        self.flash_timer = 0.0

        # Ranged behavior
        self.attack_range = edef.get('attack_range', 0)
        self.projectile_speed = edef.get('projectile_speed', 0)
        self.attack_cooldown = edef.get('attack_cooldown', 1.0)
        self.attack_timer = 0.0

        # Boss abilities
        self.abilities = edef.get('abilities', [])
        self.ability_timers = {}
        for ability in self.abilities:
            cooldown_key = f'{ability}_cooldown'
            self.ability_timers[ability] = edef.get(cooldown_key, 5.0) * random.uniform(0.3, 0.7)

        # Boss special data
        self.boss_data = {k: v for k, v in edef.items()
                         if k not in ('id', 'name', 'hp', 'speed', 'damage',
                                      'exp_drop', 'size', 'color', 'behavior',
                                      'category', 'wave', 'abilities')}

        # Enrage state (for bosses)
        self.enraged = False
        self.enrage_hp_threshold = edef.get('enrage_hp_threshold', 0)
        self.enrage_speed_mult = edef.get('enrage_speed_mult', 1.0)
        self.enrage_damage_mult = edef.get('enrage_damage_mult', 1.0)
        self._base_speed = self.speed
        self._base_damage = self.damage

        # Phase shift (chaos_emperor)
        self.phase_shifted = False
        self.phase_shift_timer = 0.0

        # Summon on death (necromancer)
        self.summon_on_death = edef.get('summon_on_death', None)

        # Swarm offset for grouping
        self._swarm_angle = random.uniform(0, math.pi * 2)
        self._swarm_radius = random.uniform(20, 40)

        # Knockback
        self.knockback_vx = 0.0
        self.knockback_vy = 0.0

        # Damage cooldown (don't damage player every frame)
        self.contact_damage_timer = 0.0
        self.contact_damage_cooldown = 0.5

        # Sprite animation support
        _load_enemy_sprites()
        self._sprite_anims = _enemy_sprite_anims.get(self.id, {})
        self._has_sprites = len(self._sprite_anims) > 0
        self._move_dir_x = 0.0  # track movement direction for flip
        self._move_dir_y = 0.0
        self._prev_x = x
        self._prev_y = y

    def update(self, dt: float, player, enemies: list, enemy_projectiles: list):
        """Update enemy AI, movement, timers.

        Args:
            dt: Delta time in seconds.
            player: Player object.
            enemies: List of all enemies (for swarm behavior).
            enemy_projectiles: List to append new projectiles to.
        """
        if not self.alive:
            return

        # Flash timer
        if self.flash_timer > 0:
            self.flash_timer -= dt

        # Contact damage timer
        if self.contact_damage_timer > 0:
            self.contact_damage_timer -= dt

        # Knockback decay
        if self.knockback_vx != 0 or self.knockback_vy != 0:
            self.x += self.knockback_vx * dt
            self.y += self.knockback_vy * dt
            self.knockback_vx *= 0.85
            self.knockback_vy *= 0.85
            if abs(self.knockback_vx) < 1:
                self.knockback_vx = 0
            if abs(self.knockback_vy) < 1:
                self.knockback_vy = 0

        # Boss enrage check
        if not self.enraged and self.enrage_hp_threshold > 0:
            if self.hp / self.max_hp <= self.enrage_hp_threshold:
                self.enraged = True
                self.speed = self._base_speed * self.enrage_speed_mult
                self.damage = int(self._base_damage * self.enrage_damage_mult)

        # Phase shift update (boss)
        if self.phase_shifted:
            self.phase_shift_timer -= dt
            if self.phase_shift_timer <= 0:
                self.phase_shifted = False

        # Movement behavior
        dx = player.x - self.x
        dy = player.y - self.y
        dist = math.sqrt(dx * dx + dy * dy) or 1.0

        if self.behavior == 'chase':
            self._move_chase(dt, dx, dy, dist)
        elif self.behavior == 'ranged':
            self._move_ranged(dt, dx, dy, dist, player, enemy_projectiles)
        elif self.behavior == 'swarm':
            self._move_swarm(dt, dx, dy, dist, player)

        # Boss abilities
        if self.category == 'boss':
            self._update_boss_abilities(dt, player, enemies, enemy_projectiles)

        # Clamp to world
        self.x = max(self.radius, min(self.x, WORLD_WIDTH - self.radius))
        self.y = max(self.radius, min(self.y, WORLD_HEIGHT - self.radius))

        # Track movement direction for sprite flipping
        self._move_dir_x = self.x - self._prev_x
        self._move_dir_y = self.y - self._prev_y
        self._prev_x = self.x
        self._prev_y = self.y

        # Advance sprite animations
        if self._has_sprites:
            for anim in self._sprite_anims.values():
                anim.update(dt)

    def _move_chase(self, dt: float, dx: float, dy: float, dist: float):
        """Move directly toward the player."""
        nx = dx / dist
        ny = dy / dist
        self.x += nx * self.speed * dt
        self.y += ny * self.speed * dt

    def _move_ranged(self, dt: float, dx: float, dy: float, dist: float,
                     player, enemy_projectiles: list):
        """Move toward player but stop at attack range; fire projectiles."""
        if dist > self.attack_range:
            nx = dx / dist
            ny = dy / dist
            self.x += nx * self.speed * dt
            self.y += ny * self.speed * dt
        elif dist < self.attack_range * 0.6:
            # Back away if too close
            nx = dx / dist
            ny = dy / dist
            self.x -= nx * self.speed * 0.5 * dt
            self.y -= ny * self.speed * 0.5 * dt

        # Fire projectile on cooldown
        self.attack_timer += dt
        if self.attack_timer >= self.attack_cooldown and dist <= self.attack_range * 1.2:
            self.attack_timer = 0.0
            nx = dx / dist
            ny = dy / dist
            proj = EnemyProjectile(
                self.x, self.y, nx, ny,
                self.projectile_speed, self.damage,
                self.base_color
            )
            enemy_projectiles.append(proj)

    def _move_swarm(self, dt: float, dx: float, dy: float, dist: float, player):
        """Move toward player in a weaving group pattern."""
        nx = dx / dist
        ny = dy / dist

        # Add oscillation for swarm feel
        self._swarm_angle += dt * 3.0
        offset_x = math.cos(self._swarm_angle) * self._swarm_radius * 0.02
        offset_y = math.sin(self._swarm_angle) * self._swarm_radius * 0.02

        self.x += (nx + offset_x) * self.speed * dt
        self.y += (ny + offset_y) * self.speed * dt

    def _update_boss_abilities(self, dt: float, player, enemies: list,
                               enemy_projectiles: list):
        """Update boss special ability timers and trigger effects."""
        for ability in self.abilities:
            cooldown_key = f'{ability}_cooldown'
            cooldown = self.boss_data.get(cooldown_key, 5.0)
            self.ability_timers[ability] += dt

            if self.ability_timers[ability] >= cooldown:
                self.ability_timers[ability] = 0.0
                self._trigger_boss_ability(ability, player, enemies, enemy_projectiles)

    def _trigger_boss_ability(self, ability: str, player, enemies: list,
                              enemy_projectiles: list):
        """Trigger a specific boss ability."""
        dx = player.x - self.x
        dy = player.y - self.y
        dist = math.sqrt(dx * dx + dy * dy) or 1.0

        if ability == 'ground_slam':
            slam_range = self.boss_data.get('ground_slam_range', 120)
            slam_damage = self.boss_data.get('ground_slam_damage', 50)
            if dist <= slam_range:
                player.take_damage(slam_damage)

        elif ability == 'fire_breath':
            # Fire multiple projectiles in a cone
            fb_damage = self.boss_data.get('fire_breath_damage', 15)
            nx = dx / dist
            ny = dy / dist
            base_angle = math.atan2(ny, nx)
            for i in range(-2, 3):
                angle = base_angle + i * 0.15
                proj = EnemyProjectile(
                    self.x, self.y,
                    math.cos(angle), math.sin(angle),
                    self.projectile_speed * 0.8,
                    fb_damage,
                    (255, 120, 30)
                )
                proj.lifetime = self.boss_data.get('fire_breath_duration', 2.0)
                enemy_projectiles.append(proj)

        elif ability == 'dark_nova':
            nova_range = self.boss_data.get('dark_nova_range', 200)
            nova_damage = self.boss_data.get('dark_nova_damage', 60)
            if dist <= nova_range:
                player.take_damage(nova_damage)

        elif ability == 'summon_minions':
            summon_type = self.boss_data.get('summon_type', 'imp')
            summon_count = self.boss_data.get('summon_count', 5)
            for i in range(summon_count):
                angle = (2 * math.pi * i) / summon_count
                sx = self.x + math.cos(angle) * 60
                sy = self.y + math.sin(angle) * 60
                minion = Enemy(summon_type, sx, sy)
                enemies.append(minion)

        elif ability == 'teleport':
            # Teleport near the player
            angle = random.uniform(0, 2 * math.pi)
            tp_dist = random.uniform(100, 200)
            self.x = player.x + math.cos(angle) * tp_dist
            self.y = player.y + math.sin(angle) * tp_dist

        elif ability == 'chaos_beam':
            beam_damage = self.boss_data.get('chaos_beam_damage', 40)
            beam_range = self.boss_data.get('chaos_beam_range', 400)
            if dist <= beam_range:
                nx = dx / dist
                ny = dy / dist
                for i in range(5):
                    proj = EnemyProjectile(
                        self.x + nx * i * 30, self.y + ny * i * 30,
                        nx, ny,
                        self.projectile_speed if self.projectile_speed > 0 else 300,
                        beam_damage,
                        (255, 0, 100)
                    )
                    enemy_projectiles.append(proj)

        elif ability == 'summon_elites':
            summon_type = self.boss_data.get('summon_type', 'berserker')
            summon_count = self.boss_data.get('summon_count', 3)
            for i in range(summon_count):
                angle = random.uniform(0, 2 * math.pi)
                sx = self.x + math.cos(angle) * 80
                sy = self.y + math.sin(angle) * 80
                minion = Enemy(summon_type, sx, sy)
                enemies.append(minion)

        elif ability == 'phase_shift':
            self.phase_shifted = True
            self.phase_shift_timer = self.boss_data.get('phase_shift_duration', 3.0)

        elif ability == 'flight':
            # Quick reposition
            angle = random.uniform(0, 2 * math.pi)
            fly_dist = random.uniform(150, 300)
            self.x = player.x + math.cos(angle) * fly_dist
            self.y = player.y + math.sin(angle) * fly_dist

    def take_damage(self, amount: int) -> bool:
        """Apply damage to this enemy.

        Args:
            amount: Damage to apply.

        Returns:
            True if the enemy died from this damage.
        """
        if not self.alive:
            return False

        if self.phase_shifted:
            return False

        self.hp -= amount
        self.flash_timer = ENEMY_FLASH_DURATION

        if self.hp <= 0:
            self.hp = 0
            self.alive = False
            return True
        return False

    def can_damage_player(self) -> bool:
        """Check if enemy can deal contact damage to player."""
        return self.contact_damage_timer <= 0

    def reset_contact_timer(self):
        """Reset contact damage cooldown."""
        self.contact_damage_timer = self.contact_damage_cooldown

    def draw(self, surface: pygame.Surface, camera):
        """Draw the enemy on screen using sprites or shape fallback."""
        if not self.alive:
            return

        sx, sy = camera.apply(self.x, self.y)
        sx_i = int(sx)
        sy_i = int(sy)

        # Determine draw color
        if self.flash_timer > 0:
            color = COLOR_WHITE
        elif self.enraged:
            pulse = int(128 + 127 * math.sin(pygame.time.get_ticks() * 0.01))
            color = (min(255, self.base_color[0] + pulse // 2),
                     max(0, self.base_color[1] - pulse // 4),
                     max(0, self.base_color[2] - pulse // 4))
        elif self.phase_shifted:
            if pygame.time.get_ticks() % 100 < 50:
                return
            color = (180, 180, 255)
        else:
            color = self.base_color

        # Draw outline for elite/boss
        if self.outline_color:
            pygame.draw.circle(surface, self.outline_color, (sx_i, sy_i), self.radius + 3)

        # Try sprite-based drawing first
        if self._has_sprites:
            self._draw_with_sprite(surface, sx, sy, sx_i, sy_i, color)
        else:
            # Dispatch to type-specific shape drawing
            draw_fn = _ENEMY_DRAW_MAP.get(self.id, _draw_default)
            draw_fn(surface, sx_i, sy_i, self.radius, color, self)

        # HP bar above enemy
        if self.hp < self.max_hp and self.category != 'boss':
            self._draw_hp_bar(surface, sx_i, sy_i)

    def _draw_with_sprite(self, surface: pygame.Surface,
                          sx: float, sy: float,
                          sx_i: int, sy_i: int,
                          color: tuple):
        """Draw this enemy using its loaded sprite animation.

        Args:
            surface: Target draw surface.
            sx: Float screen x.
            sy: Float screen y.
            sx_i: Integer screen x.
            sy_i: Integer screen y.
            color: Current draw color (used to detect flash state).
        """
        sm = get_sprite_manager()

        # Pick animation: use 'walk' for moving, 'idle' if available
        anim = self._sprite_anims.get('walk')
        if anim is None:
            anim = self._sprite_anims.get('idle')
        if anim is None:
            # Fallback to shape drawing
            draw_fn = _ENEMY_DRAW_MAP.get(self.id, _draw_default)
            draw_fn(surface, sx_i, sy_i, self.radius, color, self)
            return

        frame = anim.get_frame()

        # Determine flip direction based on movement
        flip_x = self._move_dir_x < -0.1

        # Determine tint for flash effect
        tint = None
        alpha = 255
        if self.flash_timer > 0:
            tint = (255, 255, 255)
        elif self.phase_shifted:
            alpha = 140

        sm.draw_sprite_flipped(surface, frame, sx, sy,
                               flip_x=flip_x,
                               tint_color=tint, alpha=alpha)

    def _draw_hp_bar(self, surface: pygame.Surface, sx: int, sy: int):
        """Draw a small HP bar above the enemy."""
        bar_width = max(self.radius * 2, 20)
        bar_height = 3
        bar_x = sx - bar_width // 2
        bar_y = sy - self.radius - 8

        # Background
        pygame.draw.rect(surface, (60, 10, 10),
                         (bar_x, bar_y, bar_width, bar_height))
        # Fill
        hp_ratio = max(0, self.hp / self.max_hp)
        fill_color = (200, 50, 50) if self.category == 'normal' else (200, 150, 0)
        pygame.draw.rect(surface, fill_color,
                         (bar_x, bar_y, int(bar_width * hp_ratio), bar_height))

    def draw_boss_hp_bar(self, surface: pygame.Surface):
        """Draw the boss HP bar at the top of the screen."""
        if not self.alive or self.category != 'boss':
            return

        bar_width = SCREEN_WIDTH - 100
        bar_height = 16
        bar_x = 50
        bar_y = 40

        hp_ratio = max(0, self.hp / self.max_hp)

        # Background
        pygame.draw.rect(surface, (40, 10, 10),
                         (bar_x - 2, bar_y - 2, bar_width + 4, bar_height + 4))
        pygame.draw.rect(surface, (60, 10, 10),
                         (bar_x, bar_y, bar_width, bar_height))

        # HP fill
        fill_color = COLOR_ENEMY_BOSS if not self.enraged else (255, 50, 50)
        pygame.draw.rect(surface, fill_color,
                         (bar_x, bar_y, int(bar_width * hp_ratio), bar_height))

        # Boss name
        font = pygame.font.SysFont(None, 22)
        name_surf = font.render(f"{self.name}", True, COLOR_WHITE)
        name_rect = name_surf.get_rect(centerx=SCREEN_WIDTH // 2, bottom=bar_y - 4)
        surface.blit(name_surf, name_rect)

        # HP text
        hp_text = font.render(f"{self.hp}/{self.max_hp}", True, COLOR_WHITE)
        hp_rect = hp_text.get_rect(center=(SCREEN_WIDTH // 2, bar_y + bar_height // 2))
        surface.blit(hp_text, hp_rect)


# ---------------------------------------------------------------------------
# Type-specific enemy drawing functions
# ---------------------------------------------------------------------------

def _draw_default(surface, sx, sy, r, color, enemy):
    """Fallback: simple filled circle."""
    pygame.draw.circle(surface, color, (sx, sy), r)


def _draw_zombie(surface, sx, sy, r, color, enemy):
    """Zombie: humanoid, green skin, arms stretched forward, jagged clothes."""
    t = pygame.time.get_ticks()
    # Body (slightly tall oval)
    body_rect = pygame.Rect(sx - int(r * 0.6), sy - r, int(r * 1.2), int(r * 2))
    pygame.draw.ellipse(surface, color, body_rect)
    # Torn clothes / jagged edge at bottom
    jag_y = sy + r
    for i in range(-int(r * 0.6), int(r * 0.6), 4):
        jag_h = random.Random(i + 42).randint(2, 5)
        pygame.draw.line(surface, (60, 100, 50),
                         (sx + i, jag_y), (sx + i, jag_y + jag_h), 1)
    # Head
    head_r = max(3, int(r * 0.4))
    pygame.draw.circle(surface, color, (sx, sy - r - head_r + 2), head_r)
    pygame.draw.circle(surface, (60, 100, 50), (sx, sy - r - head_r + 2), head_r, 1)
    # Arms stretched forward (toward movement)
    arm_len = r * 0.9
    arm_angle = math.sin(t * 0.006) * 0.15
    for sign in [1, -1]:
        ax = sx + int(r * 0.6) * sign
        ay = sy - int(r * 0.3)
        ex = ax + int(arm_len * math.cos(arm_angle))
        ey = ay + int(arm_len * math.sin(arm_angle - 0.3))
        pygame.draw.line(surface, color, (ax, ay), (ex, ey), max(2, r // 5))
    # Eyes
    pygame.draw.circle(surface, (200, 200, 50), (sx - 3, sy - r - head_r + 1), 2)
    pygame.draw.circle(surface, (200, 200, 50), (sx + 3, sy - r - head_r + 1), 2)


def _draw_bat(surface, sx, sy, r, color, enemy):
    """Bat: triangle wings that flap, small body, red eye dots."""
    t = pygame.time.get_ticks()
    flap = math.sin(t * 0.015) * r * 0.8
    # Body (small ellipse)
    body_r = max(2, int(r * 0.4))
    pygame.draw.ellipse(surface, color,
                        (sx - body_r, sy - body_r // 2, body_r * 2, body_r))
    # Left wing
    lw = [(sx - 2, sy), (sx - r - int(flap * 0.5), sy - r + int(abs(flap))),
          (sx - int(r * 0.5), sy + int(r * 0.3))]
    pygame.draw.polygon(surface, color, lw)
    pygame.draw.polygon(surface, (60, 40, 80), lw, 1)
    # Right wing
    rw = [(sx + 2, sy), (sx + r + int(flap * 0.5), sy - r + int(abs(flap))),
          (sx + int(r * 0.5), sy + int(r * 0.3))]
    pygame.draw.polygon(surface, color, rw)
    pygame.draw.polygon(surface, (60, 40, 80), rw, 1)
    # Red eyes
    pygame.draw.circle(surface, (255, 30, 30), (sx - 2, sy - 2), 1)
    pygame.draw.circle(surface, (255, 30, 30), (sx + 2, sy - 2), 1)


def _draw_skeleton(surface, sx, sy, r, color, enemy):
    """Skeleton: stick-figure with ribs (horizontal lines), skull head."""
    # Skull (circle with hollow eyes)
    skull_r = max(3, int(r * 0.45))
    skull_y = sy - r + skull_r
    pygame.draw.circle(surface, color, (sx, skull_y), skull_r)
    # Eye sockets (dark)
    pygame.draw.circle(surface, (40, 40, 30), (sx - skull_r // 3, skull_y - 1), max(1, skull_r // 4))
    pygame.draw.circle(surface, (40, 40, 30), (sx + skull_r // 3, skull_y - 1), max(1, skull_r // 4))
    # Jaw line
    pygame.draw.line(surface, (160, 160, 140),
                     (sx - skull_r // 3, skull_y + skull_r // 2),
                     (sx + skull_r // 3, skull_y + skull_r // 2), 1)
    # Spine
    spine_top = skull_y + skull_r
    spine_bot = sy + r - 3
    pygame.draw.line(surface, color, (sx, spine_top), (sx, spine_bot), 2)
    # Ribs (horizontal lines)
    rib_count = 3
    for i in range(rib_count):
        ry = spine_top + (spine_bot - spine_top) * (i + 1) // (rib_count + 1)
        rib_w = int(r * 0.5 * (1.0 - i * 0.15))
        pygame.draw.line(surface, color, (sx - rib_w, ry), (sx + rib_w, ry), 1)
    # Arms
    arm_y = spine_top + 3
    pygame.draw.line(surface, color, (sx, arm_y), (sx - r, arm_y + r // 2), 1)
    pygame.draw.line(surface, color, (sx, arm_y), (sx + r, arm_y + r // 2), 1)
    # Legs
    pygame.draw.line(surface, color, (sx, spine_bot), (sx - r // 2, sy + r + 2), 1)
    pygame.draw.line(surface, color, (sx, spine_bot), (sx + r // 2, sy + r + 2), 1)


def _draw_slime(surface, sx, sy, r, color, enemy):
    """Slime: wobbling blob (ellipse), semi-transparent, drip particles."""
    t = pygame.time.get_ticks()
    wobble_x = math.sin(t * 0.005) * r * 0.15
    wobble_y = math.cos(t * 0.006) * r * 0.1
    # Semi-transparent blob
    blob_surf = pygame.Surface((r * 3, r * 3), pygame.SRCALPHA)
    blob_cx, blob_cy = r * 1.5, r * 1.5
    blob_w = int(r + wobble_x)
    blob_h = int(r * 0.8 + wobble_y)
    draw_color = (*color[:3], 160)
    pygame.draw.ellipse(blob_surf, draw_color,
                        (int(blob_cx - blob_w), int(blob_cy - blob_h * 0.5),
                         blob_w * 2, int(blob_h * 1.5)))
    # Highlight
    hl_color = (min(255, color[0] + 80), min(255, color[1] + 80),
                min(255, color[2] + 80), 100)
    pygame.draw.ellipse(blob_surf, hl_color,
                        (int(blob_cx - blob_w * 0.4), int(blob_cy - blob_h * 0.4),
                         int(blob_w * 0.5), int(blob_h * 0.4)))
    surface.blit(blob_surf, (sx - int(r * 1.5), sy - int(r * 1.5)))
    # Drip particles
    for i in range(2):
        drip_y = sy + r + (t // (200 + i * 80)) % 8
        drip_x = sx + (i * 7 - 4) + int(wobble_x)
        pygame.draw.circle(surface, color, (drip_x, drip_y), max(1, r // 6))
    # Eyes
    pygame.draw.circle(surface, (255, 255, 255), (sx - r // 4, sy - r // 5), max(1, r // 5))
    pygame.draw.circle(surface, (255, 255, 255), (sx + r // 4, sy - r // 5), max(1, r // 5))
    pygame.draw.circle(surface, (20, 20, 20), (sx - r // 4, sy - r // 5), max(1, r // 8))
    pygame.draw.circle(surface, (20, 20, 20), (sx + r // 4, sy - r // 5), max(1, r // 8))


def _draw_imp(surface, sx, sy, r, color, enemy):
    """Imp: small devil, horns (triangles on head), pointed tail, red skin."""
    # Body (small triangle)
    body_pts = [
        (sx, sy - r),
        (sx - int(r * 0.7), sy + r),
        (sx + int(r * 0.7), sy + r),
    ]
    pygame.draw.polygon(surface, color, body_pts)
    pygame.draw.polygon(surface, (150, 40, 40), body_pts, 1)
    # Head
    head_r = max(2, int(r * 0.4))
    head_y = sy - r
    pygame.draw.circle(surface, color, (sx, head_y), head_r)
    # Horns
    horn_h = head_r + 3
    pygame.draw.polygon(surface, (180, 60, 60), [
        (sx - head_r + 1, head_y - 1),
        (sx - head_r - 2, head_y - horn_h),
        (sx - head_r + 4, head_y - 2),
    ])
    pygame.draw.polygon(surface, (180, 60, 60), [
        (sx + head_r - 1, head_y - 1),
        (sx + head_r + 2, head_y - horn_h),
        (sx + head_r - 4, head_y - 2),
    ])
    # Eyes
    pygame.draw.circle(surface, (255, 255, 50), (sx - 2, head_y), 1)
    pygame.draw.circle(surface, (255, 255, 50), (sx + 2, head_y), 1)
    # Pointed tail
    t = pygame.time.get_ticks()
    tail_sway = math.sin(t * 0.008) * 5
    pygame.draw.lines(surface, (150, 40, 40), False, [
        (sx, sy + r),
        (sx - 6 + int(tail_sway), sy + r + 5),
        (sx - 10 + int(tail_sway * 1.5), sy + r + 3),
    ], 2)


def _draw_goblin_warrior(surface, sx, sy, r, color, enemy):
    """Goblin Warrior: stocky body, helmet (arc), shield (rect), green."""
    # Stocky body
    body_w = int(r * 0.9)
    body_h = int(r * 1.4)
    pygame.draw.rect(surface, color,
                     (sx - body_w, sy - body_h // 2, body_w * 2, body_h))
    pygame.draw.rect(surface, (40, 100, 20),
                     (sx - body_w, sy - body_h // 2, body_w * 2, body_h), 2)
    # Head
    head_r = max(3, int(r * 0.4))
    head_y = sy - body_h // 2 - head_r + 2
    pygame.draw.circle(surface, color, (sx, head_y), head_r)
    # Helmet (arc on head)
    helmet_rect = pygame.Rect(sx - head_r - 2, head_y - head_r - 2,
                              (head_r + 2) * 2, head_r * 2)
    pygame.draw.arc(surface, (120, 120, 120), helmet_rect, 0, math.pi, 3)
    # Helmet spike
    pygame.draw.line(surface, (150, 150, 150), (sx, head_y - head_r - 2),
                     (sx, head_y - head_r - 6), 2)
    # Shield on left side
    shield_w = int(r * 0.5)
    shield_h = int(r * 0.8)
    shield_x = sx - body_w - shield_w
    shield_y = sy - shield_h // 2
    pygame.draw.rect(surface, (100, 80, 50), (shield_x, shield_y, shield_w, shield_h))
    pygame.draw.rect(surface, (140, 120, 70), (shield_x, shield_y, shield_w, shield_h), 2)
    # Cross on shield
    pygame.draw.line(surface, (140, 120, 70),
                     (shield_x + shield_w // 2, shield_y + 2),
                     (shield_x + shield_w // 2, shield_y + shield_h - 2), 1)
    pygame.draw.line(surface, (140, 120, 70),
                     (shield_x + 2, shield_y + shield_h // 2),
                     (shield_x + shield_w - 2, shield_y + shield_h // 2), 1)
    # Weapon on right
    pygame.draw.line(surface, (160, 160, 160),
                     (sx + body_w, sy), (sx + body_w + r, sy - r), 2)
    # Eyes
    pygame.draw.circle(surface, (255, 200, 50), (sx - 3, head_y), 2)
    pygame.draw.circle(surface, (255, 200, 50), (sx + 3, head_y), 2)


def _draw_dark_mage(surface, sx, sy, r, color, enemy):
    """Dark Mage: hooded robe (triangle body), glowing staff, purple aura particles."""
    t = pygame.time.get_ticks()
    # Robe body (triangle)
    robe_pts = [
        (sx, sy - r - 2),
        (sx - int(r * 0.9), sy + r),
        (sx + int(r * 0.9), sy + r),
    ]
    pygame.draw.polygon(surface, color, robe_pts)
    pygame.draw.polygon(surface, (80, 30, 120), robe_pts, 2)
    # Hood (arc at top)
    hood_r = max(3, int(r * 0.45))
    hood_y = sy - r - 2
    pygame.draw.circle(surface, (80, 30, 120), (sx, hood_y), hood_r)
    pygame.draw.circle(surface, color, (sx, hood_y), hood_r - 2)
    # Glowing eyes under hood
    pygame.draw.circle(surface, (200, 100, 255), (sx - 3, hood_y + 1), 2)
    pygame.draw.circle(surface, (200, 100, 255), (sx + 3, hood_y + 1), 2)
    # Staff
    staff_x = sx + int(r * 0.9) + 3
    pygame.draw.line(surface, (100, 70, 50),
                     (staff_x, sy - r), (staff_x, sy + r + 3), 2)
    # Glowing orb on staff
    orb_pulse = int(3 + math.sin(t * 0.008) * 2)
    pygame.draw.circle(surface, (200, 100, 255), (staff_x, sy - r - 2), orb_pulse)
    pygame.draw.circle(surface, (255, 180, 255), (staff_x, sy - r - 2), max(1, orb_pulse - 2))
    # Aura particles
    for i in range(3):
        pa = t * 0.003 + i * 2.1
        px = sx + int(math.cos(pa) * (r + 5))
        py = sy + int(math.sin(pa) * (r + 5))
        p_size = max(1, int(2 + math.sin(t * 0.01 + i) * 1))
        pygame.draw.circle(surface, (180, 80, 255), (px, py), p_size)


def _draw_ghost(surface, sx, sy, r, color, enemy):
    """Ghost: wavy bottom edge, translucent, hollow eyes."""
    t = pygame.time.get_ticks()
    # Build ghost shape with wavy bottom
    ghost_surf = pygame.Surface((r * 3, r * 3), pygame.SRCALPHA)
    gcx, gcy = int(r * 1.5), int(r * 1.5)
    alpha = 120 + int(math.sin(t * 0.005) * 30)
    g_color = (*color[:3], min(255, alpha))
    # Top dome
    pygame.draw.circle(ghost_surf, g_color, (gcx, gcy - r // 4), r)
    # Body rectangle
    pygame.draw.rect(ghost_surf, g_color,
                     (gcx - r, gcy - r // 4, r * 2, int(r * 1.2)))
    # Wavy bottom
    wave_pts = [(gcx - r, gcy + int(r * 0.9))]
    segments = 8
    for i in range(segments + 1):
        wx = gcx - r + (r * 2 * i // segments)
        wy = gcy + int(r * 0.9) + int(math.sin(t * 0.008 + i * 0.8) * (r * 0.25))
        wave_pts.append((wx, wy))
    wave_pts.append((gcx + r, gcy + int(r * 0.9)))
    # Fill wavy bottom with background to cut
    for i in range(len(wave_pts) - 1):
        x1, y1 = wave_pts[i]
        x2, y2 = wave_pts[i + 1]
        max_y = max(y1, y2) + r
        clear_pts = [(x1, y1), (x2, y2), (x2, max_y), (x1, max_y)]
        pygame.draw.polygon(ghost_surf, (0, 0, 0, 0), clear_pts)
    surface.blit(ghost_surf, (sx - int(r * 1.5), sy - int(r * 1.5)))
    # Hollow eyes
    pygame.draw.circle(surface, (40, 40, 60), (sx - r // 3, sy - r // 4), max(2, r // 4))
    pygame.draw.circle(surface, (40, 40, 60), (sx + r // 3, sy - r // 4), max(2, r // 4))
    # Mouth
    pygame.draw.ellipse(surface, (40, 40, 60),
                        (sx - r // 5, sy + r // 6, r // 3, r // 4))


def _draw_berserker(surface, sx, sy, r, color, enemy):
    """Berserker: large muscular frame, spiked shoulders, red glow, dual axes."""
    t = pygame.time.get_ticks()
    # Red glow behind
    glow_r = r + 4 + int(math.sin(t * 0.008) * 2)
    glow_surf = pygame.Surface((glow_r * 2 + 4, glow_r * 2 + 4), pygame.SRCALPHA)
    pygame.draw.circle(glow_surf, (255, 40, 20, 40),
                       (glow_r + 2, glow_r + 2), glow_r)
    surface.blit(glow_surf, (sx - glow_r - 2, sy - glow_r - 2))
    # Muscular body (wide rect)
    body_w = int(r * 1.0)
    body_h = int(r * 1.4)
    pygame.draw.rect(surface, color,
                     (sx - body_w, sy - body_h // 2, body_w * 2, body_h))
    pygame.draw.rect(surface, (150, 30, 20),
                     (sx - body_w, sy - body_h // 2, body_w * 2, body_h), 2)
    # Head
    head_r = max(3, int(r * 0.35))
    pygame.draw.circle(surface, color, (sx, sy - body_h // 2 - head_r + 2), head_r)
    # Angry eyes
    pygame.draw.circle(surface, (255, 50, 30), (sx - 3, sy - body_h // 2 - head_r + 2), 2)
    pygame.draw.circle(surface, (255, 50, 30), (sx + 3, sy - body_h // 2 - head_r + 2), 2)
    # Spiked shoulders
    for sign in [1, -1]:
        shoulder_x = sx + body_w * sign
        shoulder_y = sy - body_h // 4
        spike_pts = [
            (shoulder_x, shoulder_y - 4),
            (shoulder_x + 5 * sign, shoulder_y - 8),
            (shoulder_x + 3 * sign, shoulder_y),
        ]
        pygame.draw.polygon(surface, (160, 50, 30), spike_pts)
    # Dual axes
    for sign in [1, -1]:
        ax_x = sx + (body_w + 5) * sign
        ax_y = sy
        # Handle
        pygame.draw.line(surface, (120, 80, 40),
                         (ax_x, ax_y - r), (ax_x, ax_y + r // 2), 2)
        # Blade
        blade_pts = [
            (ax_x, ax_y - r),
            (ax_x + 6 * sign, ax_y - r - 4),
            (ax_x + 8 * sign, ax_y - r + 2),
            (ax_x + 6 * sign, ax_y - r + 6),
        ]
        pygame.draw.polygon(surface, (180, 180, 180), blade_pts)


def _draw_necromancer(surface, sx, sy, r, color, enemy):
    """Necromancer: tall thin shape, skull staff, dark purple, floating bone particles."""
    t = pygame.time.get_ticks()
    # Tall thin robe body
    robe_pts = [
        (sx, sy - r - 4),
        (sx - int(r * 0.6), sy + r + 2),
        (sx + int(r * 0.6), sy + r + 2),
    ]
    pygame.draw.polygon(surface, color, robe_pts)
    pygame.draw.polygon(surface, (30, 50, 30), robe_pts, 2)
    # Hood
    hood_r = max(3, int(r * 0.4))
    pygame.draw.circle(surface, (30, 50, 30), (sx, sy - r - 4), hood_r + 1)
    pygame.draw.circle(surface, color, (sx, sy - r - 4), hood_r)
    # Eerie eyes
    pygame.draw.circle(surface, (100, 255, 100), (sx - 3, sy - r - 4), 2)
    pygame.draw.circle(surface, (100, 255, 100), (sx + 3, sy - r - 4), 2)
    # Skull staff
    staff_x = sx - int(r * 0.6) - 4
    pygame.draw.line(surface, (80, 80, 60), (staff_x, sy - r), (staff_x, sy + r + 4), 2)
    # Skull on staff
    skull_r = max(2, int(r * 0.25))
    pygame.draw.circle(surface, (200, 200, 180), (staff_x, sy - r - skull_r), skull_r)
    pygame.draw.circle(surface, (40, 40, 30), (staff_x - 1, sy - r - skull_r), 1)
    pygame.draw.circle(surface, (40, 40, 30), (staff_x + 1, sy - r - skull_r), 1)
    # Floating bone particles
    for i in range(4):
        ba = t * 0.004 + i * 1.57
        bx = sx + int(math.cos(ba) * (r + 8))
        by = sy + int(math.sin(ba) * (r + 4)) - 3
        pygame.draw.line(surface, (200, 200, 180),
                         (bx - 2, by), (bx + 2, by), 1)


def _draw_ogre_king(surface, sx, sy, r, color, enemy):
    """Ogre King: massive body, crown (zigzag), club, tusks."""
    # Massive body
    body_w = int(r * 0.8)
    body_h = int(r * 1.2)
    pygame.draw.ellipse(surface, color,
                        (sx - body_w, sy - body_h // 2, body_w * 2, body_h))
    pygame.draw.ellipse(surface, (60, 100, 30),
                        (sx - body_w, sy - body_h // 2, body_w * 2, body_h), 2)
    # Head
    head_r = max(5, int(r * 0.35))
    head_y = sy - body_h // 2 - head_r + 4
    pygame.draw.circle(surface, color, (sx, head_y), head_r)
    # Crown (zigzag)
    crown_pts = []
    crown_w = head_r + 4
    crown_y_base = head_y - head_r + 1
    teeth = 5
    for i in range(teeth * 2 + 1):
        cx = sx - crown_w + (crown_w * 2 * i // (teeth * 2))
        if i % 2 == 0:
            cy = crown_y_base
        else:
            cy = crown_y_base - 8
        crown_pts.append((cx, cy))
    crown_pts.append((sx + crown_w, crown_y_base + 4))
    crown_pts.append((sx - crown_w, crown_y_base + 4))
    pygame.draw.polygon(surface, (255, 200, 50), crown_pts)
    pygame.draw.polygon(surface, (200, 150, 0), crown_pts, 1)
    # Tusks
    pygame.draw.line(surface, (240, 230, 200),
                     (sx - head_r // 2, head_y + head_r // 2),
                     (sx - head_r // 2 - 3, head_y + head_r + 4), 2)
    pygame.draw.line(surface, (240, 230, 200),
                     (sx + head_r // 2, head_y + head_r // 2),
                     (sx + head_r // 2 + 3, head_y + head_r + 4), 2)
    # Eyes
    pygame.draw.circle(surface, (255, 200, 50), (sx - head_r // 3, head_y - 1), 3)
    pygame.draw.circle(surface, (255, 200, 50), (sx + head_r // 3, head_y - 1), 3)
    pygame.draw.circle(surface, (20, 20, 0), (sx - head_r // 3, head_y - 1), 1)
    pygame.draw.circle(surface, (20, 20, 0), (sx + head_r // 3, head_y - 1), 1)
    # Club weapon
    club_x = sx + body_w + 5
    pygame.draw.line(surface, (100, 70, 30),
                     (club_x, sy - r // 2), (club_x, sy + r // 2 + 5), 3)
    pygame.draw.ellipse(surface, (80, 60, 30),
                        (club_x - 6, sy + r // 2, 12, 14))
    # Spikes on club
    for i in range(3):
        spike_y = sy + r // 2 + 3 + i * 4
        pygame.draw.line(surface, (120, 120, 120),
                         (club_x + 6, spike_y), (club_x + 10, spike_y - 1), 1)


def _draw_dragon(surface, sx, sy, r, color, enemy):
    """Dragon: serpentine body, spread wings, fire from mouth, scale pattern."""
    t = pygame.time.get_ticks()
    # Body (elongated oval)
    body_w = int(r * 0.7)
    body_h = int(r * 1.0)
    pygame.draw.ellipse(surface, color,
                        (sx - body_w, sy - body_h, body_w * 2, body_h * 2))
    # Scale pattern (diamond grid)
    for iy in range(-body_h + 6, body_h, 8):
        for ix in range(-body_w + 6, body_w, 8):
            if ix * ix / (body_w * body_w) + iy * iy / (body_h * body_h) < 0.8:
                scale_c = (min(255, color[0] + 30), max(0, color[1] - 10), max(0, color[2] - 10))
                pygame.draw.polygon(surface, scale_c, [
                    (sx + ix, sy + iy - 3),
                    (sx + ix + 3, sy + iy),
                    (sx + ix, sy + iy + 3),
                    (sx + ix - 3, sy + iy),
                ], 1)
    # Head
    head_r = max(5, int(r * 0.3))
    head_y = sy - body_h - head_r + 5
    pygame.draw.circle(surface, color, (sx, head_y), head_r)
    # Snout
    pygame.draw.ellipse(surface, color,
                        (sx - head_r // 2, head_y - 2, head_r, head_r // 2 + 4))
    # Eyes
    pygame.draw.circle(surface, (255, 200, 0), (sx - head_r // 3, head_y - 2), 3)
    pygame.draw.circle(surface, (255, 200, 0), (sx + head_r // 3, head_y - 2), 3)
    pygame.draw.circle(surface, (20, 0, 0), (sx - head_r // 3, head_y - 2), 1)
    pygame.draw.circle(surface, (20, 0, 0), (sx + head_r // 3, head_y - 2), 1)
    # Wings (large triangles)
    wing_span = int(r * 1.5)
    wing_flap = int(math.sin(t * 0.004) * r * 0.2)
    # Left wing
    pygame.draw.polygon(surface, (min(255, color[0] + 40), color[1], color[2]), [
        (sx - body_w + 2, sy - body_h // 2),
        (sx - body_w - wing_span, sy - r + wing_flap),
        (sx - body_w - wing_span // 2, sy + body_h // 3),
    ])
    pygame.draw.polygon(surface, (150, 30, 15), [
        (sx - body_w + 2, sy - body_h // 2),
        (sx - body_w - wing_span, sy - r + wing_flap),
        (sx - body_w - wing_span // 2, sy + body_h // 3),
    ], 1)
    # Right wing
    pygame.draw.polygon(surface, (min(255, color[0] + 40), color[1], color[2]), [
        (sx + body_w - 2, sy - body_h // 2),
        (sx + body_w + wing_span, sy - r + wing_flap),
        (sx + body_w + wing_span // 2, sy + body_h // 3),
    ])
    pygame.draw.polygon(surface, (150, 30, 15), [
        (sx + body_w - 2, sy - body_h // 2),
        (sx + body_w + wing_span, sy - r + wing_flap),
        (sx + body_w + wing_span // 2, sy + body_h // 3),
    ], 1)
    # Fire particles from mouth
    for i in range(4):
        fa = t * 0.01 + i * 1.0
        fx = sx + int(math.cos(fa) * (3 + i * 2))
        fy = head_y - head_r - 3 - i * 3
        fire_r = max(1, 4 - i)
        fire_c = (255, max(0, 180 - i * 50), 0, max(50, 200 - i * 50))
        fire_surf = pygame.Surface((fire_r * 2 + 2, fire_r * 2 + 2), pygame.SRCALPHA)
        pygame.draw.circle(fire_surf, fire_c, (fire_r + 1, fire_r + 1), fire_r)
        surface.blit(fire_surf, (fx - fire_r - 1, fy - fire_r - 1))
    # Tail (serpentine line)
    tail_pts = []
    for i in range(5):
        tx = sx + int(math.sin(t * 0.005 + i * 0.5) * 5)
        ty = sy + body_h + i * 6
        tail_pts.append((tx, ty))
    if len(tail_pts) >= 2:
        pygame.draw.lines(surface, color, False, tail_pts, max(2, 5 - 1))


def _draw_demon_lord(surface, sx, sy, r, color, enemy):
    """Demon Lord: horned head, bat wings, glowing red eyes, dark aura, tail."""
    t = pygame.time.get_ticks()
    # Dark aura
    aura_r = r + 8 + int(math.sin(t * 0.005) * 3)
    aura_surf = pygame.Surface((aura_r * 2 + 4, aura_r * 2 + 4), pygame.SRCALPHA)
    pygame.draw.circle(aura_surf, (80, 10, 10, 35),
                       (aura_r + 2, aura_r + 2), aura_r)
    surface.blit(aura_surf, (sx - aura_r - 2, sy - aura_r - 2))
    # Body (large oval)
    body_w = int(r * 0.75)
    body_h = int(r * 1.1)
    pygame.draw.ellipse(surface, color,
                        (sx - body_w, sy - body_h, body_w * 2, body_h * 2))
    pygame.draw.ellipse(surface, (100, 15, 15),
                        (sx - body_w, sy - body_h, body_w * 2, body_h * 2), 2)
    # Head
    head_r = max(5, int(r * 0.32))
    head_y = sy - body_h - head_r + 6
    pygame.draw.circle(surface, color, (sx, head_y), head_r)
    # Horns (large)
    horn_h = int(r * 0.4)
    for sign in [1, -1]:
        horn_pts = [
            (sx + head_r * sign * 0.6, head_y - head_r + 2),
            (sx + (head_r + 6) * sign, head_y - head_r - horn_h),
            (sx + head_r * sign * 0.3, head_y - head_r + 6),
        ]
        int_pts = [(int(px), int(py)) for px, py in horn_pts]
        pygame.draw.polygon(surface, (60, 10, 10), int_pts)
    # Glowing red eyes
    eye_pulse = int(200 + math.sin(t * 0.01) * 55)
    pygame.draw.circle(surface, (eye_pulse, 30, 20), (sx - head_r // 3, head_y), 3)
    pygame.draw.circle(surface, (eye_pulse, 30, 20), (sx + head_r // 3, head_y), 3)
    pygame.draw.circle(surface, (255, 200, 100), (sx - head_r // 3, head_y), 1)
    pygame.draw.circle(surface, (255, 200, 100), (sx + head_r // 3, head_y), 1)
    # Bat wings
    wing_span = int(r * 1.3)
    wing_flap = int(math.sin(t * 0.005) * r * 0.15)
    for sign in [1, -1]:
        wing_pts = [
            (sx + body_w * sign * 0.8, sy - body_h // 2),
            (sx + (body_w + wing_span) * sign, sy - r * 0.5 + wing_flap),
            (sx + (body_w + wing_span * 0.7) * sign, sy + body_h // 4),
            (sx + (body_w + wing_span * 0.4) * sign, sy - body_h // 6),
        ]
        int_pts = [(int(px), int(py)) for px, py in wing_pts]
        pygame.draw.polygon(surface, (100, 20, 20), int_pts)
        pygame.draw.polygon(surface, (60, 10, 10), int_pts, 1)
    # Tail
    tail_pts = []
    for i in range(6):
        tx = sx + int(math.sin(t * 0.005 + i * 0.6) * (4 + i))
        ty = sy + body_h + i * 5
        tail_pts.append((tx, ty))
    if len(tail_pts) >= 2:
        pygame.draw.lines(surface, (120, 20, 20), False, tail_pts, 2)
    # Tail tip (pointed)
    if len(tail_pts) >= 2:
        tip = tail_pts[-1]
        pygame.draw.polygon(surface, (140, 20, 20), [
            tip,
            (tip[0] - 4, tip[1] + 6),
            (tip[0] + 4, tip[1] + 6),
        ])


def _draw_chaos_emperor(surface, sx, sy, r, color, enemy):
    """Chaos Emperor: armored figure, multiple arms, crown, energy swirls."""
    t = pygame.time.get_ticks()
    # Energy swirls around body
    for i in range(6):
        ea = t * 0.006 + i * (math.pi / 3)
        er = r + 10 + int(math.sin(t * 0.008 + i) * 5)
        ex = sx + int(math.cos(ea) * er)
        ey = sy + int(math.sin(ea) * er)
        swirl_surf = pygame.Surface((10, 10), pygame.SRCALPHA)
        pygame.draw.circle(swirl_surf, (*color[:3], 80), (5, 5), 4)
        surface.blit(swirl_surf, (ex - 5, ey - 5))
    # Armored body (hexagonal)
    hex_pts = []
    for i in range(6):
        ha = i * math.pi / 3 - math.pi / 6
        hx = sx + int(math.cos(ha) * r * 0.8)
        hy = sy + int(math.sin(ha) * r * 0.8)
        hex_pts.append((hx, hy))
    pygame.draw.polygon(surface, color, hex_pts)
    pygame.draw.polygon(surface, (200, 0, 80), hex_pts, 2)
    # Armor lines
    pygame.draw.line(surface, (200, 0, 80), (sx, sy - int(r * 0.8)),
                     (sx, sy + int(r * 0.8)), 1)
    pygame.draw.line(surface, (200, 0, 80), (sx - int(r * 0.7), sy),
                     (sx + int(r * 0.7), sy), 1)
    # Head
    head_r = max(5, int(r * 0.28))
    head_y = sy - int(r * 0.8) - head_r + 4
    pygame.draw.circle(surface, color, (sx, head_y), head_r)
    pygame.draw.circle(surface, (200, 0, 80), (sx, head_y), head_r, 1)
    # Crown
    crown_w = head_r + 6
    crown_base_y = head_y - head_r + 1
    crown_pts_list = []
    teeth = 7
    for i in range(teeth * 2 + 1):
        cx = sx - crown_w + (crown_w * 2 * i // (teeth * 2))
        if i % 2 == 0:
            cy = crown_base_y
        else:
            cy = crown_base_y - 10
        crown_pts_list.append((cx, cy))
    crown_pts_list.append((sx + crown_w, crown_base_y + 3))
    crown_pts_list.append((sx - crown_w, crown_base_y + 3))
    pygame.draw.polygon(surface, (255, 200, 50), crown_pts_list)
    pygame.draw.polygon(surface, (200, 150, 0), crown_pts_list, 1)
    # Glowing eyes
    eye_pulse = int(200 + math.sin(t * 0.01) * 55)
    pygame.draw.circle(surface, (eye_pulse, 0, 50), (sx - head_r // 3, head_y), 3)
    pygame.draw.circle(surface, (eye_pulse, 0, 50), (sx + head_r // 3, head_y), 3)
    # Multiple arms (4 arms)
    arm_len = int(r * 0.7)
    for i, arm_a in enumerate([0.4, 0.9, -0.4, -0.9]):
        a = arm_a + math.sin(t * 0.005 + i) * 0.15
        base_x = sx + int(math.cos(math.pi / 2 + a) * r * 0.5 * (-1 if i < 2 else 1))
        base_y = sy + int(math.sin(math.pi / 2 + a) * r * 0.2)
        end_x = base_x + int(math.cos(a) * arm_len * (-1 if i < 2 else 1))
        end_y = base_y + int(math.sin(a) * arm_len)
        pygame.draw.line(surface, color, (base_x, base_y), (end_x, end_y), 3)
        # Hand/weapon glow
        pygame.draw.circle(surface, (255, 100, 150), (end_x, end_y), 3)


# Lookup table for enemy draw functions
_ENEMY_DRAW_MAP = {
    'zombie': _draw_zombie,
    'bat': _draw_bat,
    'skeleton': _draw_skeleton,
    'slime': _draw_slime,
    'imp': _draw_imp,
    'goblin_warrior': _draw_goblin_warrior,
    'dark_mage': _draw_dark_mage,
    'ghost': _draw_ghost,
    'berserker': _draw_berserker,
    'necromancer': _draw_necromancer,
    'ogre_king': _draw_ogre_king,
    'dragon': _draw_dragon,
    'demon_lord': _draw_demon_lord,
    'chaos_emperor': _draw_chaos_emperor,
}


def spawn_enemy(enemy_id: str, camera, wave_hp_mult: float = 1.0,
                wave_dmg_mult: float = 1.0, wave_spd_mult: float = 1.0) -> Enemy:
    """Spawn an enemy at a random position outside the visible screen.

    Args:
        enemy_id: ID of the enemy type to spawn.
        camera: Camera object to determine visible area.
        wave_hp_mult: HP multiplier from wave scaling.
        wave_dmg_mult: Damage multiplier from wave scaling.
        wave_spd_mult: Speed multiplier from wave scaling.

    Returns:
        A new Enemy instance.
    """
    margin = ENEMY_SPAWN_MARGIN
    visible = camera.get_visible_rect()

    # Pick a random side (0=top, 1=right, 2=bottom, 3=left)
    side = random.randint(0, 3)

    if side == 0:  # Top
        x = random.uniform(visible.left - margin, visible.right + margin)
        y = visible.top - margin
    elif side == 1:  # Right
        x = visible.right + margin
        y = random.uniform(visible.top - margin, visible.bottom + margin)
    elif side == 2:  # Bottom
        x = random.uniform(visible.left - margin, visible.right + margin)
        y = visible.bottom + margin
    else:  # Left
        x = visible.left - margin
        y = random.uniform(visible.top - margin, visible.bottom + margin)

    # Clamp to world bounds
    x = max(10, min(x, WORLD_WIDTH - 10))
    y = max(10, min(y, WORLD_HEIGHT - 10))

    return Enemy(enemy_id, x, y, wave_hp_mult, wave_dmg_mult, wave_spd_mult)
