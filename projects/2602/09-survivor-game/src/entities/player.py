"""Player entity with movement, stats, and auto-attack."""

import math
import os
import pygame

from src.core.settings import (
    WORLD_WIDTH, WORLD_HEIGHT,
    PLAYER_SIZE, PLAYER_SPEED, PLAYER_MAX_HP,
    PLAYER_INVINCIBILITY_TIME, PLAYER_PICKUP_RANGE,
    PLAYER_MAX_SKILLS,
    EXP_BASE_REQUIREMENT, EXP_SCALING,
    COLOR_PLAYER, COLOR_PLAYER_DAMAGED, COLOR_WHITE,
)
from src.core.sprite_manager import (
    SpriteAnimation, get_sprite_manager, ASSETS_DIR,
)


def _rotate_point(cx, cy, x, y, angle):
    """Rotate point (x,y) around (cx,cy) by angle radians."""
    cos_a = math.cos(angle)
    sin_a = math.sin(angle)
    dx = x - cx
    dy = y - cy
    return cx + dx * cos_a - dy * sin_a, cy + dx * sin_a + dy * cos_a


# ---------------------------------------------------------------------------
# Player sprite loading (module-level, loaded once)
# ---------------------------------------------------------------------------
_player_sprites_loaded = False
_player_anims = {}  # 'idle', 'move', 'shoot', 'melee' -> SpriteAnimation
_player_sprite_size = 0  # target pixel size for the scaled sprite
_use_sprites = False


def _load_player_sprites():
    """Load player survivor handgun sprite frames and build animations."""
    global _player_sprites_loaded, _player_anims, _player_sprite_size, _use_sprites
    if _player_sprites_loaded:
        return
    _player_sprites_loaded = True

    sm = get_sprite_manager()
    base = os.path.join(ASSETS_DIR, 'raw', 'Top_Down_Survivor', 'handgun')

    # Target visual size for the player sprite (diameter-ish)
    _player_sprite_size = PLAYER_SIZE * 3  # ~60px to look good at PLAYER_SIZE=20

    anim_defs = {
        'idle': ('idle', 'survivor-idle_handgun_*.png', 20, 10.0),
        'move': ('move', 'survivor-move_handgun_*.png', 20, 15.0),
        'shoot': ('shoot', 'survivor-shoot_handgun_*.png', 3, 12.0),
        'melee': ('meleeattack', 'survivor-meleeattack_handgun_*.png', 15, 15.0),
    }

    for key, (subfolder, pattern, max_frames, fps) in anim_defs.items():
        folder = os.path.join(base, subfolder)
        frames = sm.load_frame_sequence(folder, pattern, count=max_frames)
        if frames:
            scaled = sm.scale_frames(frames, _player_sprite_size)
            _player_anims[key] = SpriteAnimation(scaled, fps)

    _use_sprites = len(_player_anims) > 0


class Player:
    """Player character with 8-directional movement and auto-attack."""

    def __init__(self):
        # Position (center of world)
        self.x = WORLD_WIDTH / 2
        self.y = WORLD_HEIGHT / 2
        self.radius = PLAYER_SIZE

        # Movement
        self.speed = PLAYER_SPEED
        self.dx = 0.0  # Normalized direction x
        self.dy = 0.0  # Normalized direction y
        self.facing_angle = 0.0  # Angle in radians, 0 = right

        # Stats
        self.max_hp = PLAYER_MAX_HP
        self.hp = self.max_hp
        self.attack = 10
        self.defense = 0
        self.crit_chance = 0.05
        self.crit_damage = 1.5

        # Level / EXP
        self.level = 1
        self.exp = 0
        self.exp_to_next = EXP_BASE_REQUIREMENT
        self.gold = 0

        # Pickup range (grows with level)
        self.pickup_range = PLAYER_PICKUP_RANGE

        # Invincibility
        self.invincible = False
        self.invincible_timer = 0.0
        self.flash_timer = 0.0

        # Auto-attack
        self.attack_interval = 1.0  # seconds between auto-attacks
        self.attack_timer = 0.0
        self.attack_range = 300.0  # pixels

        # Skills
        self.skills = []

        # Alive flag
        self.alive = True

        # Sprite animation state
        self._anim_state = 'idle'  # 'idle' or 'move'
        self._prev_anim_state = 'idle'
        _load_player_sprites()

    def handle_input(self, keys):
        """Read WASD/arrow input and set movement direction.

        Args:
            keys: pygame key state from pygame.key.get_pressed().
        """
        move_x = 0.0
        move_y = 0.0

        if keys[pygame.K_a] or keys[pygame.K_LEFT]:
            move_x -= 1.0
        if keys[pygame.K_d] or keys[pygame.K_RIGHT]:
            move_x += 1.0
        if keys[pygame.K_w] or keys[pygame.K_UP]:
            move_y -= 1.0
        if keys[pygame.K_s] or keys[pygame.K_DOWN]:
            move_y += 1.0

        # Normalize diagonal movement
        length = math.sqrt(move_x * move_x + move_y * move_y)
        if length > 0:
            self.dx = move_x / length
            self.dy = move_y / length
            self.facing_angle = math.atan2(self.dy, self.dx)
        else:
            self.dx = 0.0
            self.dy = 0.0

    def update(self, dt: float):
        """Update player position, timers, etc.

        Args:
            dt: Delta time in seconds.
        """
        if not self.alive:
            return

        # Move
        self.x += self.dx * self.speed * dt
        self.y += self.dy * self.speed * dt

        # Clamp to world bounds
        self.x = max(self.radius, min(self.x, WORLD_WIDTH - self.radius))
        self.y = max(self.radius, min(self.y, WORLD_HEIGHT - self.radius))

        # Update invincibility timer
        if self.invincible:
            self.invincible_timer -= dt
            self.flash_timer += dt
            if self.invincible_timer <= 0:
                self.invincible = False
                self.invincible_timer = 0.0
                self.flash_timer = 0.0

        # Update auto-attack timer
        self.attack_timer += dt

        # Update sprite animation state
        is_moving = (self.dx != 0 or self.dy != 0)
        self._anim_state = 'move' if is_moving else 'idle'
        if self._anim_state != self._prev_anim_state:
            # Reset animation when switching states
            anim = _player_anims.get(self._anim_state)
            if anim:
                anim.reset()
            self._prev_anim_state = self._anim_state
        # Advance current animation
        anim = _player_anims.get(self._anim_state)
        if anim:
            anim.update(dt)

    def can_auto_attack(self) -> bool:
        """Check if auto-attack is ready."""
        return self.attack_timer >= self.attack_interval

    def reset_attack_timer(self):
        """Reset the auto-attack timer after firing."""
        self.attack_timer = 0.0

    def find_nearest_enemy(self, enemies: list) -> object | None:
        """Find the nearest alive enemy within attack range.

        Args:
            enemies: List of enemy objects with x, y, alive attributes.

        Returns:
            Nearest enemy or None.
        """
        nearest = None
        nearest_dist_sq = self.attack_range * self.attack_range

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

    def take_damage(self, amount: int):
        """Apply damage to player, respecting invincibility and defense.

        Args:
            amount: Raw damage amount before defense reduction.
        """
        if self.invincible or not self.alive:
            return

        # Apply defense
        actual_damage = max(1, amount - self.defense)
        self.hp -= actual_damage

        # Trigger invincibility frames
        self.invincible = True
        self.invincible_timer = PLAYER_INVINCIBILITY_TIME
        self.flash_timer = 0.0

        if self.hp <= 0:
            self.hp = 0
            self.alive = False

    def add_exp(self, amount: int) -> bool:
        """Add EXP and check for level up.

        Args:
            amount: EXP to add.

        Returns:
            True if player leveled up.
        """
        self.exp += amount
        if self.exp >= self.exp_to_next:
            self.exp -= self.exp_to_next
            self.level += 1
            self.exp_to_next = int(EXP_BASE_REQUIREMENT * (EXP_SCALING ** self.level))
            # Increase pickup range slightly with level
            self.pickup_range = PLAYER_PICKUP_RANGE + self.level * 2
            return True
        return False

    def draw(self, surface: pygame.Surface, camera):
        """Draw the player using sprite animation or fallback shapes.

        Args:
            surface: Pygame surface to draw on.
            camera: Camera instance for world-to-screen conversion.
        """
        if not self.alive:
            return

        screen_x, screen_y = camera.apply(self.x, self.y)
        sx = int(screen_x)
        sy = int(screen_y)

        if _use_sprites:
            self._draw_sprite(surface, screen_x, screen_y, sx, sy)
        else:
            self._draw_fallback(surface, sx, sy)

        # Draw HP bar above player
        self._draw_hp_bar(surface, sx, sy)

    def _draw_sprite(self, surface: pygame.Surface,
                     screen_x: float, screen_y: float,
                     sx: int, sy: int):
        """Draw the player using the loaded survivor sprites.

        Args:
            surface: Pygame surface to draw on.
            screen_x: Precise screen x.
            screen_y: Precise screen y.
            sx: Integer screen x.
            sy: Integer screen y.
        """
        sm = get_sprite_manager()

        # Pick the right animation
        anim = _player_anims.get(self._anim_state)
        if anim is None:
            anim = _player_anims.get('idle')
        if anim is None:
            self._draw_fallback(surface, sx, sy)
            return

        frame = anim.get_frame()

        # Determine tint for invincibility flash
        tint = None
        alpha = 255
        if self.invincible:
            flash_on = int(self.flash_timer * 10) % 2 == 0
            if not flash_on:
                tint = (200, 80, 80)
                alpha = 180

        sm.draw_sprite(surface, frame, screen_x, screen_y,
                       angle_rad=self.facing_angle,
                       tint_color=tint, alpha=alpha)

    def _draw_fallback(self, surface: pygame.Surface, sx: int, sy: int):
        """Draw the player using Pygame shapes (original draw code).

        This is the fallback when sprite files are not available.

        Args:
            surface: Pygame surface to draw on.
            sx: Screen x of player center.
            sy: Screen y of player center.
        """
        # Determine color (flash when invincible)
        if self.invincible:
            flash_on = int(self.flash_timer * 10) % 2 == 0
            color = COLOR_PLAYER if flash_on else COLOR_PLAYER_DAMAGED
        else:
            color = COLOR_PLAYER

        r = self.radius
        angle = self.facing_angle
        ticks = pygame.time.get_ticks()
        is_moving = (self.dx != 0 or self.dy != 0)

        # Leg animation offset when moving
        leg_swing = math.sin(ticks * 0.012) * 4 if is_moving else 0

        # --- Cape/scarf trailing behind ---
        cape_angle = angle + math.pi  # opposite of facing
        cape_sway = math.sin(ticks * 0.008) * 3
        for i in range(3):
            t = (i + 1) * 0.35
            cx = sx + math.cos(cape_angle + cape_sway * 0.02 * i) * (r * 0.5 + t * r * 0.7)
            cy = sy + math.sin(cape_angle + cape_sway * 0.02 * i) * (r * 0.5 + t * r * 0.7)
            perp = cape_angle + math.pi / 2
            w = r * 0.6 * (1.0 - t * 0.3) + cape_sway * (i * 0.15)
            p1 = (int(cx + math.cos(perp) * w), int(cy + math.sin(perp) * w))
            p2 = (int(cx - math.cos(perp) * w), int(cy - math.sin(perp) * w))
            cape_color = (30, 50, 120)
            pygame.draw.line(surface, cape_color, p1, p2, 2)

        # --- Legs (two small rectangles below body) ---
        outline_color = (20, 40, 100)
        leg_length = r * 0.6
        leg_width = r * 0.25
        back_angle = angle + math.pi
        perp = angle + math.pi / 2
        leg_offset = r * 0.3
        for sign, swing in [(1, leg_swing), (-1, -leg_swing)]:
            lx = sx + math.cos(back_angle) * (r * 0.25 + swing * 0.3)
            ly = sy + math.sin(back_angle) * (r * 0.25 + swing * 0.3)
            lx += math.cos(perp) * leg_offset * sign
            ly += math.sin(perp) * leg_offset * sign
            half_l = leg_length * 0.5
            half_w = leg_width * 0.5
            corners = [
                (lx - math.cos(angle) * half_l - math.cos(perp) * half_w,
                 ly - math.sin(angle) * half_l - math.sin(perp) * half_w),
                (lx + math.cos(angle) * half_l - math.cos(perp) * half_w,
                 ly + math.sin(angle) * half_l - math.sin(perp) * half_w),
                (lx + math.cos(angle) * half_l + math.cos(perp) * half_w,
                 ly + math.sin(angle) * half_l + math.sin(perp) * half_w),
                (lx - math.cos(angle) * half_l + math.cos(perp) * half_w,
                 ly - math.sin(angle) * half_l + math.sin(perp) * half_w),
            ]
            int_corners = [(int(cx_), int(cy_)) for cx_, cy_ in corners]
            pygame.draw.polygon(surface, (60, 60, 80), int_corners)
            pygame.draw.polygon(surface, outline_color, int_corners, 1)

        # --- Body (rounded rectangle torso) ---
        body_w = r * 1.3
        body_h = r * 0.9
        half_w = body_w * 0.5
        half_h = body_h * 0.5
        body_corners = [
            _rotate_point(sx, sy, sx - half_w, sy - half_h, angle),
            _rotate_point(sx, sy, sx + half_w, sy - half_h, angle),
            _rotate_point(sx, sy, sx + half_w, sy + half_h, angle),
            _rotate_point(sx, sy, sx - half_w, sy + half_h, angle),
        ]
        int_body = [(int(bx), int(by)) for bx, by in body_corners]
        pygame.draw.polygon(surface, color, int_body)
        pygame.draw.polygon(surface, outline_color, int_body, 2)

        # --- Arms ---
        arm_length = r * 0.7
        arm_width = r * 0.25
        arm_offset = r * 0.7
        arm_swing = math.sin(ticks * 0.01) * 0.15 if is_moving else 0
        for sign in [1, -1]:
            ax = sx + math.cos(perp) * arm_offset * sign
            ay = sy + math.sin(perp) * arm_offset * sign
            arm_angle = angle + arm_swing * sign
            half_al = arm_length * 0.5
            half_aw = arm_width * 0.5
            arm_corners = [
                (ax + math.cos(arm_angle) * half_al - math.cos(arm_angle + math.pi/2) * half_aw,
                 ay + math.sin(arm_angle) * half_al - math.sin(arm_angle + math.pi/2) * half_aw),
                (ax + math.cos(arm_angle) * half_al + math.cos(arm_angle + math.pi/2) * half_aw,
                 ay + math.sin(arm_angle) * half_al + math.sin(arm_angle + math.pi/2) * half_aw),
                (ax - math.cos(arm_angle) * half_al + math.cos(arm_angle + math.pi/2) * half_aw,
                 ay - math.sin(arm_angle) * half_al + math.sin(arm_angle + math.pi/2) * half_aw),
                (ax - math.cos(arm_angle) * half_al - math.cos(arm_angle + math.pi/2) * half_aw,
                 ay - math.sin(arm_angle) * half_al - math.sin(arm_angle + math.pi/2) * half_aw),
            ]
            int_arms = [(int(acx), int(acy)) for acx, acy in arm_corners]
            pygame.draw.polygon(surface, color, int_arms)
            pygame.draw.polygon(surface, outline_color, int_arms, 1)

        # --- Head ---
        head_dist = r * 0.5
        hx = sx + math.cos(angle) * head_dist
        hy = sy + math.sin(angle) * head_dist
        head_radius = int(r * 0.4)
        pygame.draw.circle(surface, color, (int(hx), int(hy)), head_radius)
        pygame.draw.circle(surface, outline_color, (int(hx), int(hy)), head_radius, 1)

        # --- Weapon: sword ---
        sword_start_dist = r * 0.7
        sword_length = r * 1.2
        sword_sx = sx + math.cos(angle) * sword_start_dist
        sword_sy = sy + math.sin(angle) * sword_start_dist
        sword_ex = sx + math.cos(angle) * (sword_start_dist + sword_length)
        sword_ey = sy + math.sin(angle) * (sword_start_dist + sword_length)
        pygame.draw.line(surface, (200, 210, 220),
                         (int(sword_sx), int(sword_sy)),
                         (int(sword_ex), int(sword_ey)), 3)
        tip_p = angle + math.pi / 2
        tip_len = r * 0.2
        tip_pts = [
            (int(sword_ex), int(sword_ey)),
            (int(sword_ex - math.cos(angle) * tip_len + math.cos(tip_p) * tip_len * 0.4),
             int(sword_ey - math.sin(angle) * tip_len + math.sin(tip_p) * tip_len * 0.4)),
            (int(sword_ex - math.cos(angle) * tip_len - math.cos(tip_p) * tip_len * 0.4),
             int(sword_ey - math.sin(angle) * tip_len - math.sin(tip_p) * tip_len * 0.4)),
        ]
        pygame.draw.polygon(surface, (220, 230, 240), tip_pts)
        guard_x = sx + math.cos(angle) * sword_start_dist
        guard_y = sy + math.sin(angle) * sword_start_dist
        guard_hw = r * 0.3
        pygame.draw.line(surface, (160, 140, 80),
                         (int(guard_x + math.cos(tip_p) * guard_hw),
                          int(guard_y + math.sin(tip_p) * guard_hw)),
                         (int(guard_x - math.cos(tip_p) * guard_hw),
                          int(guard_y - math.sin(tip_p) * guard_hw)), 2)

    def _draw_hp_bar(self, surface: pygame.Surface, sx: int, sy: int):
        """Draw HP bar above the player.

        Args:
            surface: Pygame surface to draw on.
            sx: Screen x of player center.
            sy: Screen y of player center.
        """
        if self.hp >= self.max_hp:
            return  # Don't show full HP bar

        bar_width = self.radius * 3
        bar_height = 4
        bar_x = sx - bar_width // 2
        bar_y = sy - self.radius - 10

        # Background
        pygame.draw.rect(surface, (80, 20, 20),
                         (bar_x, bar_y, bar_width, bar_height))
        # HP fill
        hp_ratio = self.hp / self.max_hp
        pygame.draw.rect(surface, (255, 50, 50),
                         (bar_x, bar_y, int(bar_width * hp_ratio), bar_height))
