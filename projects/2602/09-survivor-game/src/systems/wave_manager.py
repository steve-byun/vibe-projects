"""Wave management system - controls enemy spawning and wave progression."""

import json
import os
import random

import pygame

from src.core.settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT,
    WAVE_DURATION, WAVE_REST_DURATION, TOTAL_WAVES,
    COLOR_WHITE, COLOR_UI_HIGHLIGHT,
)
from src.entities.enemy import Enemy, spawn_enemy, ENEMY_DEFS


# Load wave data
_data_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'waves.json')
with open(_data_path, 'r', encoding='utf-8') as _f:
    _WAVE_DATA = json.load(_f)

WAVE_CONFIGS = _WAVE_DATA['waves']
ELITE_POOL = _WAVE_DATA['elite_pool']
DIFFICULTY_SCALING = _WAVE_DATA['difficulty_scaling']


class WaveManager:
    """Manages wave progression, enemy spawning, and difficulty scaling."""

    def __init__(self):
        self.current_wave = 0  # 0-indexed internally, displayed as 1-indexed
        self.wave_timer = 0.0
        self.spawn_timer = 0.0
        self.rest_timer = 0.0

        # State
        self.active = False
        self.resting = False
        self.all_waves_complete = False
        self.show_wave_text = False
        self.wave_text_timer = 0.0
        self.wave_text_duration = 2.5

        # Current wave config
        self._config = None

        # Difficulty multipliers
        self._hp_mult = 1.0
        self._dmg_mult = 1.0
        self._spd_mult = 1.0

        # Boss tracking
        self.current_boss = None

        # Stats
        self.total_enemies_spawned = 0
        self.total_enemies_killed = 0

    @property
    def wave_number(self) -> int:
        """Current wave number (1-indexed for display)."""
        return self.current_wave + 1

    @property
    def wave_time_remaining(self) -> float:
        """Seconds remaining in current wave."""
        if self._config is None:
            return 0
        return max(0, self._config['duration'] - self.wave_timer)

    @property
    def wave_description(self) -> str:
        """Description of current wave."""
        if self._config:
            return self._config.get('description', '')
        return ''

    def start(self):
        """Start wave 1."""
        self.current_wave = 0
        self.active = True
        self.resting = False
        self.all_waves_complete = False
        self._begin_wave()

    def _begin_wave(self):
        """Initialize the current wave."""
        if self.current_wave >= len(WAVE_CONFIGS):
            self.all_waves_complete = True
            self.active = False
            return

        self._config = WAVE_CONFIGS[self.current_wave]
        self.wave_timer = 0.0
        self.spawn_timer = 0.0
        self.resting = False

        # Calculate difficulty multipliers
        wave_num = self.current_wave  # 0-indexed
        hp_per_wave = DIFFICULTY_SCALING['hp_multiplier_per_wave']
        dmg_per_wave = DIFFICULTY_SCALING['damage_multiplier_per_wave']
        spd_per_wave = DIFFICULTY_SCALING['speed_multiplier_per_wave']
        self._hp_mult = hp_per_wave ** wave_num
        self._dmg_mult = dmg_per_wave ** wave_num
        self._spd_mult = spd_per_wave ** wave_num

        # Show wave announcement
        self.show_wave_text = True
        self.wave_text_timer = 0.0

        # Reset boss
        self.current_boss = None

    def update(self, dt: float, enemies: list, camera) -> dict:
        """Update wave state, spawn enemies.

        Args:
            dt: Delta time in seconds.
            enemies: Mutable list of enemies to add to.
            camera: Camera for spawn position calculation.

        Returns:
            Dict with events: {'boss_spawned': Enemy|None, 'wave_complete': bool,
                               'all_complete': bool, 'new_wave': int|None}
        """
        events = {
            'boss_spawned': None,
            'wave_complete': False,
            'all_complete': False,
            'new_wave': None,
        }

        if not self.active or self.all_waves_complete:
            return events

        # Wave text timer
        if self.show_wave_text:
            self.wave_text_timer += dt
            if self.wave_text_timer >= self.wave_text_duration:
                self.show_wave_text = False

        # Rest between waves
        if self.resting:
            self.rest_timer += dt
            if self.rest_timer >= WAVE_REST_DURATION:
                self.resting = False
                self._begin_wave()
                events['new_wave'] = self.wave_number
            return events

        if self._config is None:
            return events

        # Update wave timer
        self.wave_timer += dt

        # Spawn enemies
        self._update_spawning(dt, enemies, camera)

        # Check wave completion
        wave_duration = self._config['duration']
        if self.wave_timer >= wave_duration:
            # Wave time is up - check if boss is dead (if there is one)
            if self.current_boss is not None and self.current_boss.alive:
                # Wait for boss to die
                pass
            else:
                events['wave_complete'] = True
                self.current_wave += 1
                if self.current_wave >= TOTAL_WAVES:
                    self.all_waves_complete = True
                    self.active = False
                    events['all_complete'] = True
                else:
                    self.resting = True
                    self.rest_timer = 0.0

        return events

    def _update_spawning(self, dt: float, enemies: list, camera):
        """Handle enemy spawn logic for current wave."""
        config = self._config
        spawn_rate = config['spawn_rate']  # enemies per second
        max_enemies = config['max_enemies']
        enemy_types = config['enemy_types']
        elite_chance = config['elite_chance']
        boss_id = config.get('boss')

        # Count alive enemies
        alive_count = sum(1 for e in enemies if e.alive)

        # Spawn boss at start of wave if applicable
        if boss_id and self.current_boss is None and boss_id in ENEMY_DEFS:
            boss = spawn_enemy(boss_id, camera, self._hp_mult, self._dmg_mult, self._spd_mult)
            enemies.append(boss)
            self.current_boss = boss
            self.total_enemies_spawned += 1

        # Regular enemy spawning
        self.spawn_timer += dt
        spawn_interval = 1.0 / spawn_rate if spawn_rate > 0 else 999

        while self.spawn_timer >= spawn_interval and alive_count < max_enemies:
            self.spawn_timer -= spawn_interval

            # Determine enemy type
            if random.random() < elite_chance and ELITE_POOL:
                enemy_id = random.choice(ELITE_POOL)
            else:
                enemy_id = random.choice(enemy_types)

            # Validate enemy exists
            if enemy_id not in ENEMY_DEFS:
                continue

            enemy = spawn_enemy(enemy_id, camera, self._hp_mult, self._dmg_mult, self._spd_mult)
            enemies.append(enemy)
            alive_count += 1
            self.total_enemies_spawned += 1

    def on_enemy_killed(self):
        """Track enemy kill count."""
        self.total_enemies_killed += 1

    def draw_wave_text(self, surface: pygame.Surface):
        """Draw the wave announcement text overlay."""
        if not self.show_wave_text:
            return

        # Fade in/out
        progress = self.wave_text_timer / self.wave_text_duration
        if progress < 0.2:
            alpha = int(255 * (progress / 0.2))
        elif progress > 0.7:
            alpha = int(255 * (1.0 - (progress - 0.7) / 0.3))
        else:
            alpha = 255

        # Wave number
        font_big = pygame.font.SysFont(None, 64)
        font_small = pygame.font.SysFont(None, 32)

        wave_text = f"Wave {self.wave_number}"
        desc_text = self.wave_description

        wave_surf = font_big.render(wave_text, True, COLOR_UI_HIGHLIGHT)
        desc_surf = font_small.render(desc_text, True, COLOR_WHITE)

        wave_surf.set_alpha(alpha)
        desc_surf.set_alpha(alpha)

        wave_rect = wave_surf.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 - 20))
        desc_rect = desc_surf.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 25))

        surface.blit(wave_surf, wave_rect)
        surface.blit(desc_surf, desc_rect)

    def draw_rest_text(self, surface: pygame.Surface):
        """Draw the rest between waves overlay."""
        if not self.resting:
            return

        font = pygame.font.SysFont(None, 36)
        remaining = max(0, WAVE_REST_DURATION - self.rest_timer)
        text = f"Next wave in {remaining:.1f}s..."
        text_surf = font.render(text, True, COLOR_WHITE)
        rect = text_surf.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2))
        surface.blit(text_surf, rect)
