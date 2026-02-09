"""Equipment management screen with slots, inventory grid, and stat preview."""

import pygame

from src.core.settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT,
    COLOR_UI_TEXT, COLOR_UI_TEXT_DIM, COLOR_UI_HIGHLIGHT,
    COLOR_UI_BUTTON, COLOR_UI_BUTTON_HOVER, COLOR_UI_BORDER, COLOR_UI_PANEL,
    COLOR_WHITE, COLOR_BLACK, COLOR_BACKGROUND,
    COLOR_RARITY_COMMON, COLOR_RARITY_RARE, COLOR_RARITY_EPIC, COLOR_RARITY_LEGENDARY,
)

RARITY_COLORS = {
    "common": COLOR_RARITY_COMMON,
    "rare": COLOR_RARITY_RARE,
    "epic": COLOR_RARITY_EPIC,
    "legendary": COLOR_RARITY_LEGENDARY,
}

SLOT_TYPES = ["Weapon", "Armor", "Accessory"]


class EquipmentScreen:
    """Equipment management screen with slots and inventory."""

    SLOT_SIZE = 70
    SLOT_SPACING = 15
    INV_CELL_SIZE = 55
    INV_COLS = 6
    INV_ROWS = 4

    def __init__(self):
        self.font_title = pygame.font.SysFont(None, 40)
        self.font_slot_label = pygame.font.SysFont(None, 20)
        self.font_item_name = pygame.font.SysFont(None, 22)
        self.font_stat = pygame.font.SysFont(None, 18)
        self.font_button = pygame.font.SysFont(None, 26)

        # Equipment slots (what's currently equipped)
        self.equipped: dict[str, dict | None] = {
            "Weapon": None,
            "Armor": None,
            "Accessory": None,
        }

        # Inventory items
        self.inventory: list[dict] = []

        # UI state
        self.slot_rects: dict[str, pygame.Rect] = {}
        self.inv_rects: list[pygame.Rect] = []
        self.hovered_slot: str | None = None
        self.hovered_inv_idx: int = -1
        self.tooltip_item: dict | None = None
        self.tooltip_pos: tuple[int, int] = (0, 0)

        # Back button
        self.back_rect = pygame.Rect(0, 0, 120, 40)
        self.back_rect.topleft = (20, 20)
        self.back_hovered = False

        self._setup_layout()

    def _setup_layout(self):
        """Calculate positions for slots and inventory grid."""
        # Equipment slots (left side)
        slot_start_x = 60
        slot_start_y = 100
        self.slot_rects = {}
        for i, slot_type in enumerate(SLOT_TYPES):
            y = slot_start_y + i * (self.SLOT_SIZE + self.SLOT_SPACING + 20)
            self.slot_rects[slot_type] = pygame.Rect(slot_start_x, y,
                                                     self.SLOT_SIZE, self.SLOT_SIZE)

        # Inventory grid (right side)
        inv_start_x = SCREEN_WIDTH // 2 - 20
        inv_start_y = 100
        self.inv_rects = []
        for row in range(self.INV_ROWS):
            for col in range(self.INV_COLS):
                x = inv_start_x + col * (self.INV_CELL_SIZE + 4)
                y = inv_start_y + row * (self.INV_CELL_SIZE + 4)
                self.inv_rects.append(pygame.Rect(x, y, self.INV_CELL_SIZE, self.INV_CELL_SIZE))

    def set_data(self, equipped: dict[str, dict | None], inventory: list[dict]):
        """
        Set equipment data.

        equipped: {"Weapon": item_dict|None, "Armor": item_dict|None, "Accessory": item_dict|None}
        inventory: list of item dicts: {name, slot_type, rarity, stats: {damage%, hp%, ...}, description}
        """
        self.equipped = equipped
        self.inventory = inventory

    def handle_event(self, event: pygame.event.Event) -> dict | None:
        """
        Handle input events.

        Returns:
            {"action": "back"} - return to menu
            {"action": "equip", "inv_index": int} - equip item from inventory
            {"action": "unequip", "slot": str} - unequip from slot
            None - no action
        """
        if event.type == pygame.MOUSEMOTION:
            mx, my = event.pos
            self._update_hover(mx, my)

        elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            mx, my = event.pos

            # Back button
            if self.back_rect.collidepoint(mx, my):
                return {"action": "back"}

            # Click on equipment slot to unequip
            for slot_type, rect in self.slot_rects.items():
                if rect.collidepoint(mx, my) and self.equipped.get(slot_type) is not None:
                    return {"action": "unequip", "slot": slot_type}

            # Click on inventory item to equip
            for i, rect in enumerate(self.inv_rects):
                if i < len(self.inventory) and rect.collidepoint(mx, my):
                    return {"action": "equip", "inv_index": i}

        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                return {"action": "back"}

        return None

    def _update_hover(self, mx: int, my: int):
        """Update hover state and tooltip."""
        self.hovered_slot = None
        self.hovered_inv_idx = -1
        self.tooltip_item = None
        self.back_hovered = self.back_rect.collidepoint(mx, my)

        # Check equipment slots
        for slot_type, rect in self.slot_rects.items():
            if rect.collidepoint(mx, my):
                self.hovered_slot = slot_type
                item = self.equipped.get(slot_type)
                if item:
                    self.tooltip_item = item
                    self.tooltip_pos = (rect.right + 10, rect.top)
                return

        # Check inventory cells
        for i, rect in enumerate(self.inv_rects):
            if rect.collidepoint(mx, my) and i < len(self.inventory):
                self.hovered_inv_idx = i
                self.tooltip_item = self.inventory[i]
                self.tooltip_pos = (rect.right + 10, rect.top)
                return

    def render(self, surface: pygame.Surface):
        """Render the equipment screen."""
        surface.fill(COLOR_BACKGROUND)

        # Title
        title = self.font_title.render("Equipment", True, COLOR_UI_TEXT)
        title_rect = title.get_rect(centerx=SCREEN_WIDTH // 2, top=20)
        surface.blit(title, title_rect)

        # Back button
        self._draw_back_button(surface)

        # Equipment slots
        self._draw_equipment_slots(surface)

        # Inventory grid
        self._draw_inventory(surface)

        # Tooltip
        if self.tooltip_item:
            self._draw_tooltip(surface, self.tooltip_item, self.tooltip_pos)

    def _draw_back_button(self, surface: pygame.Surface):
        """Draw the back button."""
        bg = COLOR_UI_BUTTON_HOVER if self.back_hovered else COLOR_UI_BUTTON
        pygame.draw.rect(surface, bg, self.back_rect, border_radius=6)
        border = COLOR_UI_HIGHLIGHT if self.back_hovered else COLOR_UI_BORDER
        pygame.draw.rect(surface, border, self.back_rect, 1, border_radius=6)

        text = self.font_button.render("< Back", True, COLOR_WHITE)
        text_rect = text.get_rect(center=self.back_rect.center)
        surface.blit(text, text_rect)

    def _draw_equipment_slots(self, surface: pygame.Surface):
        """Draw the 3 equipment slots on the left."""
        # Section label
        section_label = self.font_item_name.render("Equipped", True, COLOR_UI_TEXT_DIM)
        surface.blit(section_label, (60, 75))

        for slot_type in SLOT_TYPES:
            rect = self.slot_rects[slot_type]
            item = self.equipped.get(slot_type)
            is_hovered = (self.hovered_slot == slot_type)

            # Slot background
            bg_color = COLOR_UI_BUTTON_HOVER if is_hovered else (35, 35, 50)
            pygame.draw.rect(surface, bg_color, rect, border_radius=6)

            # Border with rarity color if equipped
            if item:
                rarity = item.get("rarity", "common")
                border_color = RARITY_COLORS.get(rarity, COLOR_UI_BORDER)
                pygame.draw.rect(surface, border_color, rect, 2, border_radius=6)
            else:
                pygame.draw.rect(surface, COLOR_UI_BORDER, rect, 1, border_radius=6)

            # Slot type label below
            label = self.font_slot_label.render(slot_type, True, COLOR_UI_TEXT_DIM)
            label_rect = label.get_rect(centerx=rect.centerx, top=rect.bottom + 4)
            surface.blit(label, label_rect)

            # Item visual or empty indicator
            if item:
                self._draw_item_icon(surface, rect, item)
            else:
                # Empty slot indicator
                plus = self.font_title.render("+", True, (60, 60, 80))
                plus_rect = plus.get_rect(center=rect.center)
                surface.blit(plus, plus_rect)

    def _draw_inventory(self, surface: pygame.Surface):
        """Draw the inventory grid."""
        # Section label
        inv_x = SCREEN_WIDTH // 2 - 20
        section_label = self.font_item_name.render("Inventory", True, COLOR_UI_TEXT_DIM)
        surface.blit(section_label, (inv_x, 75))

        for i, rect in enumerate(self.inv_rects):
            is_hovered = (self.hovered_inv_idx == i)
            has_item = i < len(self.inventory)

            # Cell background
            bg_color = COLOR_UI_BUTTON_HOVER if is_hovered else (30, 30, 42)
            pygame.draw.rect(surface, bg_color, rect, border_radius=4)

            if has_item:
                item = self.inventory[i]
                rarity = item.get("rarity", "common")
                border_color = RARITY_COLORS.get(rarity, COLOR_UI_BORDER)
                pygame.draw.rect(surface, border_color, rect, 2 if is_hovered else 1, border_radius=4)
                self._draw_item_icon(surface, rect, item)
            else:
                pygame.draw.rect(surface, (40, 40, 50), rect, 1, border_radius=4)

    def _draw_item_icon(self, surface: pygame.Surface, rect: pygame.Rect, item: dict):
        """Draw a simple icon for an item inside a rect."""
        slot_type = item.get("slot_type", "Weapon")
        rarity = item.get("rarity", "common")
        color = RARITY_COLORS.get(rarity, COLOR_RARITY_COMMON)

        cx, cy = rect.center
        margin = min(rect.width, rect.height) // 4

        if slot_type == "Weapon":
            # Sword-like shape (vertical rectangle)
            w = 6
            h = rect.height - margin * 2
            pygame.draw.rect(surface, color, (cx - w // 2, cy - h // 2, w, h), border_radius=2)
            # Crossguard
            pygame.draw.rect(surface, color, (cx - 10, cy + h // 4, 20, 4))
        elif slot_type == "Armor":
            # Shield shape (rounded rectangle)
            shield_w = rect.width - margin * 2
            shield_h = rect.height - margin * 2
            shield_rect = pygame.Rect(cx - shield_w // 2, cy - shield_h // 2, shield_w, shield_h)
            pygame.draw.rect(surface, color, shield_rect, 2, border_radius=8)
            # Inner cross
            pygame.draw.line(surface, color, (cx, shield_rect.top + 4), (cx, shield_rect.bottom - 4), 2)
            pygame.draw.line(surface, color, (shield_rect.left + 4, cy), (shield_rect.right - 4, cy), 2)
        else:  # Accessory
            # Ring / circle
            radius = min(rect.width, rect.height) // 3
            pygame.draw.circle(surface, color, (cx, cy), radius, 2)
            pygame.draw.circle(surface, color, (cx, cy - radius + 3), 4)  # gem on top

    def _draw_tooltip(self, surface: pygame.Surface, item: dict, pos: tuple[int, int]):
        """Draw a tooltip showing item details."""
        name = item.get("name", "Unknown")
        rarity = item.get("rarity", "common")
        description = item.get("description", "")
        stats = item.get("stats", {})
        slot_type = item.get("slot_type", "")

        # Calculate tooltip size
        tooltip_w = 200
        line_h = 18
        lines_count = 3 + len(stats) + (1 if description else 0)
        tooltip_h = 15 + lines_count * line_h + 10

        # Position (keep on screen)
        tx, ty = pos
        if tx + tooltip_w > SCREEN_WIDTH - 10:
            tx = pos[0] - tooltip_w - 20
        if ty + tooltip_h > SCREEN_HEIGHT - 10:
            ty = SCREEN_HEIGHT - tooltip_h - 10

        # Background
        tooltip_surf = pygame.Surface((tooltip_w, tooltip_h), pygame.SRCALPHA)
        pygame.draw.rect(tooltip_surf, (15, 15, 25, 240), (0, 0, tooltip_w, tooltip_h),
                         border_radius=6)
        surface.blit(tooltip_surf, (tx, ty))

        rarity_color = RARITY_COLORS.get(rarity, COLOR_RARITY_COMMON)
        pygame.draw.rect(surface, rarity_color, (tx, ty, tooltip_w, tooltip_h), 1, border_radius=6)

        # Content
        y = ty + 10

        # Name
        name_text = self.font_item_name.render(name, True, rarity_color)
        surface.blit(name_text, (tx + 10, y))
        y += line_h + 2

        # Rarity + slot type
        info_str = f"{rarity.capitalize()} {slot_type}"
        info_text = self.font_stat.render(info_str, True, COLOR_UI_TEXT_DIM)
        surface.blit(info_text, (tx + 10, y))
        y += line_h + 4

        # Separator line
        pygame.draw.line(surface, (50, 50, 65), (tx + 10, y), (tx + tooltip_w - 10, y))
        y += 6

        # Stats
        for stat_name, stat_value in stats.items():
            prefix = "+" if stat_value > 0 else ""
            stat_str = f"{prefix}{stat_value}% {stat_name}"
            stat_color = (100, 255, 100) if stat_value > 0 else (255, 100, 100)
            stat_text = self.font_stat.render(stat_str, True, stat_color)
            surface.blit(stat_text, (tx + 10, y))
            y += line_h

        # Description
        if description:
            y += 4
            desc_text = self.font_stat.render(description[:30], True, COLOR_UI_TEXT_DIM)
            surface.blit(desc_text, (tx + 10, y))
