"""Game over and victory result screens."""

import pygame

from src.core.settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT,
    COLOR_UI_TEXT, COLOR_UI_TEXT_DIM, COLOR_UI_HIGHLIGHT,
    COLOR_UI_BUTTON, COLOR_UI_BUTTON_HOVER, COLOR_UI_BORDER,
    COLOR_WHITE, COLOR_BLACK,
)


class ResultScreen:
    """Game over / Victory result screen with stats summary."""

    BUTTON_WIDTH = 180
    BUTTON_HEIGHT = 44

    def __init__(self):
        self.font_title = pygame.font.SysFont(None, 64)
        self.font_subtitle = pygame.font.SysFont(None, 28)
        self.font_stat_label = pygame.font.SysFont(None, 22)
        self.font_stat_value = pygame.font.SysFont(None, 26)
        self.font_button = pygame.font.SysFont(None, 26)
        self.font_skill = pygame.font.SysFont(None, 20)

        self.is_victory = False
        self.stats: dict = {}
        self.skills_acquired: list[str] = []
        self.hovered_button = -1
        self.button_rects: list[pygame.Rect] = []

        self._setup_buttons()

    def _setup_buttons(self):
        """Create button rectangles."""
        cx = SCREEN_WIDTH // 2
        btn_y = SCREEN_HEIGHT - 80
        gap = 20

        retry_rect = pygame.Rect(0, 0, self.BUTTON_WIDTH, self.BUTTON_HEIGHT)
        retry_rect.centerx = cx - self.BUTTON_WIDTH // 2 - gap // 2
        retry_rect.top = btn_y

        menu_rect = pygame.Rect(0, 0, self.BUTTON_WIDTH, self.BUTTON_HEIGHT)
        menu_rect.centerx = cx + self.BUTTON_WIDTH // 2 + gap // 2
        menu_rect.top = btn_y

        self.button_rects = [retry_rect, menu_rect]
        self.button_labels = ["Retry", "Main Menu"]

    def set_result(self, is_victory: bool, stats: dict, skills_acquired: list[str]):
        """
        Set the result data.

        Args:
            is_victory: True for victory, False for game over
            stats: {time_survived, enemies_killed, level_reached, damage_dealt, wave_reached}
            skills_acquired: list of skill names the player had
        """
        self.is_victory = is_victory
        self.stats = stats
        self.skills_acquired = skills_acquired

    def handle_event(self, event: pygame.event.Event) -> str | None:
        """
        Handle input events.

        Returns: "retry", "menu", or None
        """
        if event.type == pygame.MOUSEMOTION:
            mx, my = event.pos
            self.hovered_button = -1
            for i, rect in enumerate(self.button_rects):
                if rect.collidepoint(mx, my):
                    self.hovered_button = i
                    break

        elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            mx, my = event.pos
            for i, rect in enumerate(self.button_rects):
                if rect.collidepoint(mx, my):
                    return "retry" if i == 0 else "menu"

        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_r:
                return "retry"
            elif event.key == pygame.K_ESCAPE:
                return "menu"

        return None

    def render(self, surface: pygame.Surface):
        """Render the result screen."""
        # Dark overlay
        overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 180))
        surface.blit(overlay, (0, 0))

        # Title
        self._draw_title(surface)

        # Stats
        self._draw_stats(surface)

        # Skills acquired
        self._draw_skills(surface)

        # Buttons
        self._draw_buttons(surface)

    def _draw_title(self, surface: pygame.Surface):
        """Draw GAME OVER or VICTORY title."""
        if self.is_victory:
            title_str = "VICTORY!"
            title_color = (255, 220, 50)
            sub_str = "You survived all waves!"
        else:
            title_str = "GAME OVER"
            title_color = (255, 80, 80)
            sub_str = "Better luck next time..."

        title_text = self.font_title.render(title_str, True, title_color)
        title_rect = title_text.get_rect(centerx=SCREEN_WIDTH // 2, top=40)
        surface.blit(title_text, title_rect)

        sub_text = self.font_subtitle.render(sub_str, True, COLOR_UI_TEXT_DIM)
        sub_rect = sub_text.get_rect(centerx=SCREEN_WIDTH // 2, top=title_rect.bottom + 8)
        surface.blit(sub_text, sub_rect)

    def _draw_stats(self, surface: pygame.Surface):
        """Draw the stats summary panel."""
        panel_w, panel_h = 350, 180
        panel_x = (SCREEN_WIDTH - panel_w) // 2
        panel_y = 130

        # Panel background
        panel_surf = pygame.Surface((panel_w, panel_h), pygame.SRCALPHA)
        pygame.draw.rect(panel_surf, (20, 20, 35, 220), (0, 0, panel_w, panel_h),
                         border_radius=6)
        surface.blit(panel_surf, (panel_x, panel_y))
        pygame.draw.rect(surface, COLOR_UI_BORDER, (panel_x, panel_y, panel_w, panel_h),
                         1, border_radius=6)

        # Stats list
        stat_items = [
            ("Time Survived", self._format_time(self.stats.get("time_survived", 0))),
            ("Enemies Killed", str(self.stats.get("enemies_killed", 0))),
            ("Level Reached", str(self.stats.get("level_reached", 1))),
            ("Wave Reached", str(self.stats.get("wave_reached", 1))),
            ("Damage Dealt", self._format_number(self.stats.get("damage_dealt", 0))),
        ]

        y_offset = panel_y + 15
        for label, value in stat_items:
            label_text = self.font_stat_label.render(label, True, COLOR_UI_TEXT_DIM)
            value_text = self.font_stat_value.render(value, True, COLOR_UI_HIGHLIGHT)

            surface.blit(label_text, (panel_x + 20, y_offset))
            value_rect = value_text.get_rect(right=panel_x + panel_w - 20, top=y_offset)
            surface.blit(value_text, value_rect)

            y_offset += 32

    def _draw_skills(self, surface: pygame.Surface):
        """Draw the list of skills acquired."""
        if not self.skills_acquired:
            return

        y_start = 330
        header = self.font_subtitle.render("Skills Acquired", True, COLOR_UI_TEXT)
        header_rect = header.get_rect(centerx=SCREEN_WIDTH // 2, top=y_start)
        surface.blit(header, header_rect)

        # Draw skills in a horizontal row
        skill_y = y_start + 30
        total_w = len(self.skills_acquired) * 80
        start_x = max(20, (SCREEN_WIDTH - total_w) // 2)

        for i, skill_name in enumerate(self.skills_acquired[:6]):
            x = start_x + i * 80
            # Small card
            card_rect = pygame.Rect(x, skill_y, 70, 35)
            pygame.draw.rect(surface, (40, 40, 55), card_rect, border_radius=4)
            pygame.draw.rect(surface, COLOR_UI_BORDER, card_rect, 1, border_radius=4)

            name_text = self.font_skill.render(skill_name[:8], True, COLOR_UI_TEXT)
            name_rect = name_text.get_rect(center=card_rect.center)
            surface.blit(name_text, name_rect)

    def _draw_buttons(self, surface: pygame.Surface):
        """Draw Retry and Main Menu buttons."""
        for i, (rect, label) in enumerate(zip(self.button_rects, self.button_labels)):
            hovered = (i == self.hovered_button)
            bg_color = COLOR_UI_BUTTON_HOVER if hovered else COLOR_UI_BUTTON

            pygame.draw.rect(surface, bg_color, rect, border_radius=6)
            border_color = COLOR_UI_HIGHLIGHT if hovered else COLOR_UI_BORDER
            pygame.draw.rect(surface, border_color, rect, 2 if hovered else 1, border_radius=6)

            text = self.font_button.render(label, True, COLOR_WHITE)
            text_rect = text.get_rect(center=rect.center)
            surface.blit(text, text_rect)

        # Key hints
        hint_y = self.button_rects[0].bottom + 8
        hint_r = self.font_skill.render("[R] Retry", True, COLOR_UI_TEXT_DIM)
        hint_r_rect = hint_r.get_rect(centerx=self.button_rects[0].centerx, top=hint_y)
        surface.blit(hint_r, hint_r_rect)

        hint_esc = self.font_skill.render("[ESC] Menu", True, COLOR_UI_TEXT_DIM)
        hint_esc_rect = hint_esc.get_rect(centerx=self.button_rects[1].centerx, top=hint_y)
        surface.blit(hint_esc, hint_esc_rect)

    @staticmethod
    def _format_time(seconds: float) -> str:
        """Format seconds to MM:SS."""
        m = int(seconds) // 60
        s = int(seconds) % 60
        return f"{m}:{s:02d}"

    @staticmethod
    def _format_number(n: int) -> str:
        """Format large numbers with commas."""
        if n >= 1_000_000:
            return f"{n / 1_000_000:.1f}M"
        elif n >= 1_000:
            return f"{n / 1_000:.1f}K"
        return str(n)
