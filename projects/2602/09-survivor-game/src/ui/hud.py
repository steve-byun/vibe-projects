"""In-game HUD overlay: HP bar, EXP bar, level, wave, timer, kill count, active skills."""

import pygame
import math

from src.core.settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT,
    COLOR_HP_BAR, COLOR_HP_BAR_BG, COLOR_EXP_BAR, COLOR_EXP_BAR_BG,
    COLOR_UI_TEXT, COLOR_UI_TEXT_DIM, COLOR_UI_PANEL, COLOR_UI_HIGHLIGHT,
    COLOR_WHITE, COLOR_BLACK,
    COLOR_SKILL_PROJECTILE, COLOR_SKILL_ORBIT, COLOR_SKILL_AREA, COLOR_SKILL_PASSIVE,
)


class HUD:
    """In-game heads-up display."""

    def __init__(self):
        self.font_large = pygame.font.SysFont(None, 32)
        self.font_medium = pygame.font.SysFont(None, 24)
        self.font_small = pygame.font.SysFont(None, 18)

    def render(self, surface: pygame.Surface, player_data: dict, wave_data: dict,
               skill_data: list[dict]):
        """
        Render the full HUD.

        Args:
            player_data: {hp, max_hp, exp, exp_needed, level, kill_count}
            wave_data: {wave_number, total_waves, time_remaining}
            skill_data: list of {name, skill_type, level, max_level, cooldown_pct}
        """
        self._draw_hp_bar(surface, player_data)
        self._draw_exp_bar(surface, player_data)
        self._draw_level(surface, player_data)
        self._draw_wave_info(surface, wave_data)
        self._draw_kill_count(surface, player_data)
        self._draw_active_skills(surface, skill_data)

    def _draw_hp_bar(self, surface: pygame.Surface, data: dict):
        """Draw player HP bar at top-left."""
        x, y = 15, 35
        bar_w, bar_h = 180, 16

        hp = data.get("hp", 0)
        max_hp = data.get("max_hp", 1)
        ratio = max(0, min(1, hp / max_hp))

        # Background
        pygame.draw.rect(surface, COLOR_HP_BAR_BG, (x, y, bar_w, bar_h), border_radius=3)

        # HP fill with gradient (green when full, red when low)
        if ratio > 0:
            fill_w = int(bar_w * ratio)
            green = int(200 * ratio)
            red = int(255 * (1 - ratio * 0.5))
            hp_color = (red, green, 50)
            pygame.draw.rect(surface, hp_color, (x, y, fill_w, bar_h), border_radius=3)

        # Border
        pygame.draw.rect(surface, (100, 100, 100), (x, y, bar_w, bar_h), 1, border_radius=3)

        # HP text
        hp_text = self.font_small.render(f"{int(hp)}/{int(max_hp)}", True, COLOR_WHITE)
        text_rect = hp_text.get_rect(center=(x + bar_w // 2, y + bar_h // 2))
        surface.blit(hp_text, text_rect)

        # "HP" label
        label = self.font_small.render("HP", True, COLOR_UI_TEXT_DIM)
        surface.blit(label, (x, y - 14))

    def _draw_exp_bar(self, surface: pygame.Surface, data: dict):
        """Draw EXP bar at the very top of the screen, full width."""
        bar_h = 8
        x, y = 0, 0

        exp = data.get("exp", 0)
        exp_needed = data.get("exp_needed", 1)
        ratio = max(0, min(1, exp / exp_needed))

        # Background
        pygame.draw.rect(surface, COLOR_EXP_BAR_BG, (x, y, SCREEN_WIDTH, bar_h))

        # EXP fill
        if ratio > 0:
            fill_w = int(SCREEN_WIDTH * ratio)
            pygame.draw.rect(surface, COLOR_EXP_BAR, (x, y, fill_w, bar_h))

        # Shine effect at the fill edge
        if ratio > 0.01:
            fill_x = int(SCREEN_WIDTH * ratio)
            shine_color = (255, 255, 200)
            pygame.draw.line(surface, shine_color, (fill_x - 1, y), (fill_x - 1, y + bar_h - 1), 2)

    def _draw_level(self, surface: pygame.Surface, data: dict):
        """Draw level indicator at top-left, above HP bar."""
        level = data.get("level", 1)
        text = self.font_medium.render(f"Lv.{level}", True, COLOR_UI_HIGHLIGHT)
        surface.blit(text, (15, 10))

    def _draw_wave_info(self, surface: pygame.Surface, data: dict):
        """Draw wave number and timer at top-right."""
        wave = data.get("wave_number", 1)
        total = data.get("total_waves", 20)
        time_remaining = data.get("time_remaining", 0)

        # Wave number
        wave_text = self.font_medium.render(f"Wave {wave}/{total}", True, COLOR_UI_TEXT)
        wave_rect = wave_text.get_rect(topright=(SCREEN_WIDTH - 15, 12))
        surface.blit(wave_text, wave_rect)

        # Timer
        minutes = int(time_remaining) // 60
        seconds = int(time_remaining) % 60
        timer_color = (255, 100, 100) if time_remaining < 10 else COLOR_UI_TEXT_DIM
        timer_text = self.font_medium.render(f"{minutes}:{seconds:02d}", True, timer_color)
        timer_rect = timer_text.get_rect(topright=(SCREEN_WIDTH - 15, 34))
        surface.blit(timer_text, timer_rect)

    def _draw_kill_count(self, surface: pygame.Surface, data: dict):
        """Draw kill count below wave info."""
        kills = data.get("kill_count", 0)
        # Skull symbol approximation
        kill_text = self.font_small.render(f"Kills: {kills}", True, COLOR_UI_TEXT_DIM)
        kill_rect = kill_text.get_rect(topright=(SCREEN_WIDTH - 15, 56))
        surface.blit(kill_text, kill_rect)

    def _draw_active_skills(self, surface: pygame.Surface, skills: list[dict]):
        """Draw active skill icons at the bottom of the screen."""
        if not skills:
            return

        icon_size = 40
        spacing = 8
        total_width = len(skills) * icon_size + (len(skills) - 1) * spacing
        start_x = (SCREEN_WIDTH - total_width) // 2
        y = SCREEN_HEIGHT - icon_size - 15

        for i, skill in enumerate(skills):
            x = start_x + i * (icon_size + spacing)
            self._draw_skill_icon(surface, x, y, icon_size, skill)

    def _draw_skill_icon(self, surface: pygame.Surface, x: int, y: int,
                         size: int, skill: dict):
        """Draw a single skill icon with cooldown overlay."""
        # Background
        bg_rect = pygame.Rect(x, y, size, size)
        pygame.draw.rect(surface, (30, 30, 45), bg_rect, border_radius=4)

        # Skill type color
        skill_type = skill.get("skill_type", "projectile")
        type_colors = {
            "projectile": COLOR_SKILL_PROJECTILE,
            "orbit": COLOR_SKILL_ORBIT,
            "area": COLOR_SKILL_AREA,
            "passive": COLOR_SKILL_PASSIVE,
        }
        color = type_colors.get(skill_type, COLOR_WHITE)

        # Draw simple icon shape based on skill type
        inner_margin = 6
        inner_rect = pygame.Rect(x + inner_margin, y + inner_margin,
                                 size - inner_margin * 2, size - inner_margin * 2)
        center = inner_rect.center

        if skill_type == "projectile":
            # Arrow/triangle shape
            pts = [
                (center[0], inner_rect.top),
                (inner_rect.right, inner_rect.bottom),
                (inner_rect.left, inner_rect.bottom),
            ]
            pygame.draw.polygon(surface, color, pts)
        elif skill_type == "orbit":
            # Circle
            pygame.draw.circle(surface, color, center, inner_rect.width // 2, 2)
            pygame.draw.circle(surface, color, center, 3)
        elif skill_type == "area":
            # Diamond
            pts = [
                (center[0], inner_rect.top),
                (inner_rect.right, center[1]),
                (center[0], inner_rect.bottom),
                (inner_rect.left, center[1]),
            ]
            pygame.draw.polygon(surface, color, pts)
        else:
            # Passive: plus sign
            hw = inner_rect.width // 2
            hh = inner_rect.height // 2
            t = 3
            pygame.draw.rect(surface, color,
                             (center[0] - t, inner_rect.top, t * 2, inner_rect.height))
            pygame.draw.rect(surface, color,
                             (inner_rect.left, center[1] - t, inner_rect.width, t * 2))

        # Cooldown overlay (dark sweep)
        cooldown_pct = skill.get("cooldown_pct", 0)  # 0=ready, 1=full cooldown
        if cooldown_pct > 0:
            overlay = pygame.Surface((size, size), pygame.SRCALPHA)
            # Draw semi-transparent dark overlay proportional to cooldown
            overlay_h = int(size * cooldown_pct)
            pygame.draw.rect(overlay, (0, 0, 0, 150),
                             (0, size - overlay_h, size, overlay_h),
                             border_radius=4)
            surface.blit(overlay, (x, y))

        # Level indicator
        level = skill.get("level", 1)
        if level > 0:
            lvl_text = self.font_small.render(str(level), True, COLOR_WHITE)
            lvl_rect = lvl_text.get_rect(bottomright=(x + size - 2, y + size - 1))
            surface.blit(lvl_text, lvl_rect)

        # Border
        border_color = color if cooldown_pct <= 0 else (60, 60, 70)
        pygame.draw.rect(surface, border_color, bg_rect, 1, border_radius=4)
