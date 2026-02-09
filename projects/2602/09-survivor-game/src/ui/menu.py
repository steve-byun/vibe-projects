"""Main menu with animated background particles."""

import pygame
import random
import math

from src.core.settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT,
    COLOR_UI_TEXT, COLOR_UI_TEXT_DIM, COLOR_UI_HIGHLIGHT,
    COLOR_UI_BUTTON, COLOR_UI_BUTTON_HOVER, COLOR_UI_BORDER,
    COLOR_WHITE, COLOR_BLACK, COLOR_BACKGROUND,
)


class Particle:
    """A simple floating background particle."""

    def __init__(self):
        self.reset()

    def reset(self):
        self.x = random.uniform(0, SCREEN_WIDTH)
        self.y = random.uniform(0, SCREEN_HEIGHT)
        self.size = random.uniform(2, 6)
        self.speed = random.uniform(10, 30)
        self.angle = random.uniform(0, math.pi * 2)
        self.alpha = random.randint(30, 100)
        self.color = random.choice([
            (0, 200, 255),   # cyan
            (255, 100, 50),  # orange
            (50, 255, 100),  # green
            (180, 50, 255),  # purple
            (255, 220, 50),  # gold
        ])
        self.wobble_speed = random.uniform(0.5, 2.0)
        self.wobble_amp = random.uniform(0.3, 1.0)
        self.timer = random.uniform(0, 10)

    def update(self, dt: float):
        self.timer += dt
        self.x += math.cos(self.angle + math.sin(self.timer * self.wobble_speed) * self.wobble_amp) * self.speed * dt
        self.y += math.sin(self.angle + math.cos(self.timer * self.wobble_speed) * self.wobble_amp) * self.speed * dt

        # Wrap around screen
        if self.x < -10:
            self.x = SCREEN_WIDTH + 10
        elif self.x > SCREEN_WIDTH + 10:
            self.x = -10
        if self.y < -10:
            self.y = SCREEN_HEIGHT + 10
        elif self.y > SCREEN_HEIGHT + 10:
            self.y = -10

    def render(self, surface: pygame.Surface):
        particle_surf = pygame.Surface((int(self.size * 2 + 2), int(self.size * 2 + 2)), pygame.SRCALPHA)
        pygame.draw.circle(particle_surf, (*self.color, self.alpha),
                           (int(self.size + 1), int(self.size + 1)), int(self.size))
        surface.blit(particle_surf, (int(self.x - self.size), int(self.y - self.size)))


class MainMenu:
    """Main menu screen."""

    BUTTON_WIDTH = 220
    BUTTON_HEIGHT = 50
    BUTTON_SPACING = 16

    def __init__(self):
        self.font_title = pygame.font.SysFont(None, 80)
        self.font_subtitle = pygame.font.SysFont(None, 28)
        self.font_button = pygame.font.SysFont(None, 30)

        self.hovered_button = -1
        self.title_timer = 0.0

        # Background particles
        self.particles = [Particle() for _ in range(40)]

        # Buttons
        self.button_labels = ["Start Game", "Equipment", "Quit"]
        self.button_rects: list[pygame.Rect] = []
        self._setup_buttons()

    def _setup_buttons(self):
        """Calculate button positions."""
        cx = SCREEN_WIDTH // 2
        start_y = SCREEN_HEIGHT // 2 + 20

        self.button_rects = []
        for i in range(len(self.button_labels)):
            rect = pygame.Rect(0, 0, self.BUTTON_WIDTH, self.BUTTON_HEIGHT)
            rect.centerx = cx
            rect.top = start_y + i * (self.BUTTON_HEIGHT + self.BUTTON_SPACING)
            self.button_rects.append(rect)

    def handle_event(self, event: pygame.event.Event) -> str | None:
        """
        Handle input events.

        Returns: "start", "equipment", "quit", or None
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
                    return ["start", "equipment", "quit"][i]

        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_RETURN or event.key == pygame.K_SPACE:
                return "start"
            elif event.key == pygame.K_ESCAPE:
                return "quit"

        return None

    def update(self, dt: float):
        """Update animations."""
        self.title_timer += dt
        for p in self.particles:
            p.update(dt)

    def render(self, surface: pygame.Surface):
        """Render the main menu."""
        # Background
        surface.fill(COLOR_BACKGROUND)

        # Particles
        for p in self.particles:
            p.render(surface)

        # Title
        self._draw_title(surface)

        # Buttons
        self._draw_buttons(surface)

    def _draw_title(self, surface: pygame.Surface):
        """Draw the game title with subtle animation."""
        # Title shadow
        offset_y = math.sin(self.title_timer * 1.5) * 3
        title_y = SCREEN_HEIGHT // 4 + offset_y

        shadow_text = self.font_title.render("SURVIVOR", True, (20, 20, 30))
        shadow_rect = shadow_text.get_rect(centerx=SCREEN_WIDTH // 2 + 3, centery=title_y + 3)
        surface.blit(shadow_text, shadow_rect)

        # Title with color cycling
        pulse = 0.8 + 0.2 * math.sin(self.title_timer * 2)
        title_color = (int(0 * pulse + 255 * (1 - pulse)),
                       int(200 * pulse),
                       int(255 * pulse))
        title_text = self.font_title.render("SURVIVOR", True, title_color)
        title_rect = title_text.get_rect(centerx=SCREEN_WIDTH // 2, centery=title_y)
        surface.blit(title_text, title_rect)

        # Subtitle
        sub_text = self.font_subtitle.render("Survive the horde", True, COLOR_UI_TEXT_DIM)
        sub_rect = sub_text.get_rect(centerx=SCREEN_WIDTH // 2, top=title_rect.bottom + 10)
        surface.blit(sub_text, sub_rect)

    def _draw_buttons(self, surface: pygame.Surface):
        """Draw menu buttons."""
        for i, (rect, label) in enumerate(zip(self.button_rects, self.button_labels)):
            hovered = (i == self.hovered_button)
            bg_color = COLOR_UI_BUTTON_HOVER if hovered else COLOR_UI_BUTTON

            # Button background
            btn_surf = pygame.Surface((rect.width, rect.height), pygame.SRCALPHA)
            pygame.draw.rect(btn_surf, (*bg_color, 220),
                             (0, 0, rect.width, rect.height), border_radius=8)
            surface.blit(btn_surf, rect.topleft)

            # Border
            border_color = COLOR_UI_HIGHLIGHT if hovered else COLOR_UI_BORDER
            border_w = 2 if hovered else 1
            pygame.draw.rect(surface, border_color, rect, border_w, border_radius=8)

            # Label
            text_color = COLOR_UI_HIGHLIGHT if hovered else COLOR_WHITE
            text = self.font_button.render(label, True, text_color)
            text_rect = text.get_rect(center=rect.center)
            surface.blit(text, text_rect)

            # Arrow indicator for hovered
            if hovered:
                arrow = self.font_button.render(">", True, COLOR_UI_HIGHLIGHT)
                arrow_rect = arrow.get_rect(right=rect.left - 10, centery=rect.centery)
                surface.blit(arrow, arrow_rect)
