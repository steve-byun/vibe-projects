"""Level-up skill selection screen with 3 skill cards."""

import pygame

from src.core.settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT, LEVEL_UP_CHOICES,
    COLOR_UI_TEXT, COLOR_UI_TEXT_DIM, COLOR_UI_HIGHLIGHT,
    COLOR_UI_PANEL, COLOR_UI_BUTTON, COLOR_UI_BUTTON_HOVER, COLOR_UI_BORDER,
    COLOR_WHITE, COLOR_BLACK,
    COLOR_SKILL_PROJECTILE, COLOR_SKILL_ORBIT, COLOR_SKILL_AREA, COLOR_SKILL_PASSIVE,
)


class LevelUpScreen:
    """Level-up screen showing skill choices."""

    # Card dimensions
    CARD_WIDTH = 200
    CARD_HEIGHT = 280
    CARD_SPACING = 25

    def __init__(self):
        self.font_title = pygame.font.SysFont(None, 56)
        self.font_subtitle = pygame.font.SysFont(None, 28)
        self.font_card_name = pygame.font.SysFont(None, 24)
        self.font_card_desc = pygame.font.SysFont(None, 18)
        self.font_card_level = pygame.font.SysFont(None, 20)
        self.font_key_hint = pygame.font.SysFont(None, 22)

        self.hovered_index = -1
        self.choices: list[dict] = []
        self.card_rects: list[pygame.Rect] = []

        # Title glow animation
        self.glow_timer = 0.0

    def set_choices(self, choices: list[dict]):
        """
        Set the skill choices to display.

        Each choice dict: {
            name, description, skill_type,
            level (current), max_level,
            is_upgrade (bool), stat_preview (str)
        }
        """
        self.choices = choices[:LEVEL_UP_CHOICES]
        self._calculate_card_rects()
        self.hovered_index = -1

    def _calculate_card_rects(self):
        """Calculate positions for skill cards."""
        count = len(self.choices)
        total_w = count * self.CARD_WIDTH + (count - 1) * self.CARD_SPACING
        start_x = (SCREEN_WIDTH - total_w) // 2
        y = (SCREEN_HEIGHT - self.CARD_HEIGHT) // 2 + 30  # offset down for title

        self.card_rects = []
        for i in range(count):
            x = start_x + i * (self.CARD_WIDTH + self.CARD_SPACING)
            self.card_rects.append(pygame.Rect(x, y, self.CARD_WIDTH, self.CARD_HEIGHT))

    def handle_event(self, event: pygame.event.Event) -> int | None:
        """
        Handle input events.

        Returns: index of chosen skill (0-2), or None if no selection made.
        """
        if event.type == pygame.MOUSEMOTION:
            mx, my = event.pos
            self.hovered_index = -1
            for i, rect in enumerate(self.card_rects):
                if rect.collidepoint(mx, my):
                    self.hovered_index = i
                    break

        elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            mx, my = event.pos
            for i, rect in enumerate(self.card_rects):
                if rect.collidepoint(mx, my):
                    return i

        elif event.type == pygame.KEYDOWN:
            # Number keys 1, 2, 3
            key_map = {pygame.K_1: 0, pygame.K_2: 1, pygame.K_3: 2}
            if event.key in key_map:
                idx = key_map[event.key]
                if idx < len(self.choices):
                    return idx

        return None

    def update(self, dt: float):
        """Update animations."""
        self.glow_timer += dt

    def render(self, surface: pygame.Surface):
        """Render the level-up screen."""
        # Semi-transparent dark overlay
        overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 160))
        surface.blit(overlay, (0, 0))

        # Title with golden glow effect
        self._draw_title(surface)

        # Skill cards
        for i, choice in enumerate(self.choices):
            hovered = (i == self.hovered_index)
            self._draw_card(surface, self.card_rects[i], choice, i, hovered)

        # Key hint
        hint = self.font_key_hint.render("Press 1, 2, 3 or click to select", True, COLOR_UI_TEXT_DIM)
        hint_rect = hint.get_rect(centerx=SCREEN_WIDTH // 2,
                                  top=self.card_rects[0].bottom + 20 if self.card_rects else SCREEN_HEIGHT - 50)
        surface.blit(hint, hint_rect)

    def _draw_title(self, surface: pygame.Surface):
        """Draw 'LEVEL UP!' title with golden glow."""
        import math
        # Glow pulse
        pulse = 0.7 + 0.3 * math.sin(self.glow_timer * 4)
        glow_intensity = int(255 * pulse)

        # Glow background text (slightly larger, yellow)
        glow_color = (glow_intensity, int(glow_intensity * 0.85), 0)
        glow_font = pygame.font.SysFont(None, 60)
        glow_text = glow_font.render("LEVEL UP!", True, glow_color)
        glow_rect = glow_text.get_rect(centerx=SCREEN_WIDTH // 2,
                                       top=self.card_rects[0].top - 70 if self.card_rects else 80)
        surface.blit(glow_text, glow_rect)

        # Main title text
        title_color = (255, 220, 50)
        title_text = self.font_title.render("LEVEL UP!", True, title_color)
        title_rect = title_text.get_rect(center=glow_rect.center)
        surface.blit(title_text, title_rect)

    def _draw_card(self, surface: pygame.Surface, rect: pygame.Rect,
                   choice: dict, index: int, hovered: bool):
        """Draw a single skill card."""
        # Card background
        bg_color = COLOR_UI_BUTTON_HOVER if hovered else COLOR_UI_BUTTON
        card_surf = pygame.Surface((rect.width, rect.height), pygame.SRCALPHA)
        pygame.draw.rect(card_surf, (*bg_color, 230), (0, 0, rect.width, rect.height),
                         border_radius=8)
        surface.blit(card_surf, rect.topleft)

        # Border (highlight if hovered)
        border_color = COLOR_UI_HIGHLIGHT if hovered else COLOR_UI_BORDER
        border_width = 2 if hovered else 1
        pygame.draw.rect(surface, border_color, rect, border_width, border_radius=8)

        # Skill type color
        skill_type = choice.get("skill_type", "projectile")
        type_colors = {
            "projectile": COLOR_SKILL_PROJECTILE,
            "orbit": COLOR_SKILL_ORBIT,
            "area": COLOR_SKILL_AREA,
            "passive": COLOR_SKILL_PASSIVE,
        }
        type_color = type_colors.get(skill_type, COLOR_WHITE)

        # Icon area (colored shape)
        icon_y = rect.top + 20
        icon_size = 50
        icon_center = (rect.centerx, icon_y + icon_size // 2)

        # Draw icon background circle
        pygame.draw.circle(surface, (40, 40, 55), icon_center, icon_size // 2 + 4)
        pygame.draw.circle(surface, type_color, icon_center, icon_size // 2 + 4, 2)

        # Draw type shape inside
        self._draw_type_icon(surface, icon_center, icon_size // 2 - 4, skill_type, type_color)

        # Skill name
        name = choice.get("name", "Unknown")
        name_text = self.font_card_name.render(name, True, COLOR_WHITE)
        name_rect = name_text.get_rect(centerx=rect.centerx, top=icon_y + icon_size + 10)
        surface.blit(name_text, name_rect)

        # Level info
        is_upgrade = choice.get("is_upgrade", False)
        level = choice.get("level", 0)
        max_level = choice.get("max_level", 5)

        if is_upgrade:
            lvl_str = f"Level {level} -> {level + 1}"
            lvl_color = COLOR_UI_HIGHLIGHT
        else:
            lvl_str = "NEW"
            lvl_color = (100, 255, 100)

        lvl_text = self.font_card_level.render(lvl_str, True, lvl_color)
        lvl_rect = lvl_text.get_rect(centerx=rect.centerx, top=name_rect.bottom + 6)
        surface.blit(lvl_text, lvl_rect)

        # Description (word-wrapped)
        desc = choice.get("description", "")
        self._draw_wrapped_text(surface, desc, rect.left + 12, lvl_rect.bottom + 10,
                                rect.width - 24, self.font_card_desc, COLOR_UI_TEXT_DIM)

        # Stat preview
        stat_preview = choice.get("stat_preview", "")
        if stat_preview:
            stat_text = self.font_card_desc.render(stat_preview, True, (150, 220, 255))
            stat_rect = stat_text.get_rect(centerx=rect.centerx, bottom=rect.bottom - 30)
            surface.blit(stat_text, stat_rect)

        # Key hint number at bottom
        key_text = self.font_key_hint.render(str(index + 1), True,
                                             COLOR_UI_HIGHLIGHT if hovered else COLOR_UI_TEXT_DIM)
        key_rect = key_text.get_rect(centerx=rect.centerx, bottom=rect.bottom - 8)
        surface.blit(key_text, key_rect)

    def _draw_type_icon(self, surface: pygame.Surface, center: tuple, radius: int,
                        skill_type: str, color: tuple):
        """Draw a shape representing the skill type."""
        cx, cy = center
        if skill_type == "projectile":
            pts = [(cx, cy - radius), (cx + radius, cy + radius), (cx - radius, cy + radius)]
            pygame.draw.polygon(surface, color, pts)
        elif skill_type == "orbit":
            pygame.draw.circle(surface, color, center, radius, 2)
            pygame.draw.circle(surface, color, center, 4)
        elif skill_type == "area":
            pts = [(cx, cy - radius), (cx + radius, cy),
                   (cx, cy + radius), (cx - radius, cy)]
            pygame.draw.polygon(surface, color, pts)
        else:  # passive
            t = 3
            pygame.draw.rect(surface, color, (cx - t, cy - radius, t * 2, radius * 2))
            pygame.draw.rect(surface, color, (cx - radius, cy - t, radius * 2, t * 2))

    def _draw_wrapped_text(self, surface: pygame.Surface, text: str,
                           x: int, y: int, max_width: int,
                           font: pygame.font.Font, color: tuple):
        """Draw text with word wrapping."""
        words = text.split()
        lines = []
        current_line = ""

        for word in words:
            test_line = f"{current_line} {word}".strip()
            if font.size(test_line)[0] <= max_width:
                current_line = test_line
            else:
                if current_line:
                    lines.append(current_line)
                current_line = word

        if current_line:
            lines.append(current_line)

        for i, line in enumerate(lines):
            text_surf = font.render(line, True, color)
            text_rect = text_surf.get_rect(centerx=x + max_width // 2, top=y + i * 18)
            surface.blit(text_surf, text_rect)
