"""Main game class - handles game loop and state management."""

import math
import json
import pygame
from src.core.settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT, FPS, TITLE,
    WORLD_WIDTH, WORLD_HEIGHT, TILE_SIZE, TOTAL_WAVES,
    COLOR_BACKGROUND, COLOR_GRID, COLOR_PLAYER,
    GameState,
)
from src.core.camera import Camera
from src.entities.player import Player
from src.entities.enemy import EnemyProjectile
from src.systems.collision import CollisionSystem, apply_knockback, circle_collision
from src.systems.wave_manager import WaveManager
from src.systems.skill_system import SkillSystem
from src.systems.exp_system import ExpSystem
from src.systems.equipment import EquipmentSystem
from src.ui.menu import MainMenu
from src.ui.hud import HUD
from src.ui.level_up_screen import LevelUpScreen
from src.ui.result_screen import ResultScreen
from src.ui.equipment_screen import EquipmentScreen
from src.ui.damage_numbers import DamageNumberManager


class Game:
    """Main game class managing the game loop and state."""

    def __init__(self):
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption(TITLE)
        self.clock = pygame.time.Clock()
        self.running = True
        self.state = GameState.MENU
        self.dt = 0.0

        # Core systems (created once, reused)
        self.equipment_system = EquipmentSystem()

        # Per-session systems (created on game start)
        self.camera = None
        self.player = None
        self.enemies = []
        self.projectiles = []
        self.exp_gems = []
        self.enemy_projectiles = []
        self.wave_manager = None
        self.skill_system = None
        self.exp_system = None
        self.collision_system = None
        self.damage_numbers = None

        # UI (created once)
        self.main_menu = MainMenu()
        self.hud = HUD()
        self.level_up_screen = LevelUpScreen()
        self.result_screen = ResultScreen()
        self.equipment_screen = EquipmentScreen()

        # Stats tracking
        self.stats = {
            "enemies_killed": 0,
            "time_survived": 0.0,
            "level_reached": 1,
            "wave_reached": 1,
            "damage_dealt": 0,
        }

    def run(self):
        """Main game loop."""
        while self.running:
            self.dt = self.clock.tick(FPS) / 1000.0
            # Cap dt to prevent physics issues on lag spikes
            self.dt = min(self.dt, 0.05)
            self._handle_events()
            self._update()
            self._draw()

    def _handle_events(self):
        """Process input events."""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
                return

            if self.state == GameState.MENU:
                self._handle_menu_events(event)
            elif self.state == GameState.EQUIPMENT:
                self._handle_equipment_events(event)
            elif self.state == GameState.PLAYING:
                self._handle_playing_events(event)
            elif self.state == GameState.LEVEL_UP:
                self._handle_level_up_events(event)
            elif self.state == GameState.PAUSED:
                self._handle_pause_events(event)
            elif self.state in (GameState.GAME_OVER, GameState.VICTORY):
                self._handle_result_events(event)

    def _handle_menu_events(self, event):
        """Handle menu state input."""
        result = self.main_menu.handle_event(event)
        if result == "start":
            self._start_game()
        elif result == "equipment":
            self._open_equipment()
        elif result == "quit":
            self.running = False

    def _handle_equipment_events(self, event):
        """Handle equipment screen input."""
        result = self.equipment_screen.handle_event(event)
        if result is None:
            return
        action = result.get("action")
        if action == "back":
            self.state = GameState.MENU
        elif action == "equip":
            idx = result.get("inv_index", -1)
            inv = self.equipment_screen.inventory
            if 0 <= idx < len(inv):
                item = inv[idx]
                slot_type = item.get("type", "weapon")
                slot_key = slot_type
                if slot_type == "accessory":
                    # Fill first empty accessory slot
                    if self.equipment_system.equipped.get("accessory_1") is None:
                        slot_key = "accessory_1"
                    else:
                        slot_key = "accessory_2"
                self.equipment_system.equip(slot_key, item["id"])
                self._refresh_equipment_screen()
        elif action == "unequip":
            slot_display = result.get("slot", "")
            # Map display slot to internal slot key
            slot_map = {"Weapon": "weapon", "Armor": "armor", "Accessory": "accessory_1"}
            slot_key = slot_map.get(slot_display, slot_display)
            self.equipment_system.unequip(slot_key)
            self._refresh_equipment_screen()

    def _handle_playing_events(self, event):
        """Handle playing state input."""
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                self.state = GameState.PAUSED

    def _handle_level_up_events(self, event):
        """Handle level up screen input."""
        self.level_up_screen.update(self.dt)
        choice_idx = self.level_up_screen.handle_event(event)
        if choice_idx is not None and 0 <= choice_idx < len(self.level_up_screen.choices):
            choice = self.level_up_screen.choices[choice_idx]
            self.skill_system.apply_choice(choice)
            self.state = GameState.PLAYING

    def _handle_pause_events(self, event):
        """Handle pause state input."""
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_ESCAPE:
                self.state = GameState.PLAYING

    def _handle_result_events(self, event):
        """Handle game over / victory screen input."""
        result = self.result_screen.handle_event(event)
        if result == "retry":
            self._start_game()
        elif result == "menu":
            self.state = GameState.MENU

    # ------------------------------------------------------------------
    # Game session management
    # ------------------------------------------------------------------

    def _open_equipment(self):
        """Open the equipment screen."""
        self.state = GameState.EQUIPMENT
        self._refresh_equipment_screen()

    def _refresh_equipment_screen(self):
        """Sync equipment screen data with equipment system."""
        equipped_display = {}
        for slot_key, item_id in self.equipment_system.equipped.items():
            if item_id is None:
                continue
            from src.systems.equipment import EQUIPMENT_ITEMS
            item = EQUIPMENT_ITEMS.get(item_id)
            if item is None:
                continue
            # Map internal slot keys to display slot types
            if slot_key == "weapon":
                equipped_display["Weapon"] = item
            elif slot_key == "armor":
                equipped_display["Armor"] = item
            elif slot_key.startswith("accessory"):
                if "Accessory" not in equipped_display:
                    equipped_display["Accessory"] = item

        # Build inventory: all items not currently equipped
        from src.systems.equipment import EQUIPMENT_ITEMS
        equipped_ids = set(v for v in self.equipment_system.equipped.values() if v)
        inventory = [item for item in EQUIPMENT_ITEMS.values()
                     if item["id"] not in equipped_ids]

        # Ensure display dict has all slot keys
        for slot_type in ["Weapon", "Armor", "Accessory"]:
            if slot_type not in equipped_display:
                equipped_display[slot_type] = None

        self.equipment_screen.set_data(equipped_display, inventory)

    def _start_game(self):
        """Initialize a new game session."""
        self.state = GameState.PLAYING

        # Reset entity lists
        self.enemies = []
        self.projectiles = []
        self.exp_gems = []
        self.enemy_projectiles = []

        # Reset stats
        self.stats = {
            "enemies_killed": 0,
            "time_survived": 0.0,
            "level_reached": 1,
            "wave_reached": 1,
            "damage_dealt": 0,
        }

        # Initialize player at world center
        self.player = Player()

        # Apply equipment bonuses
        self.equipment_system.apply_to_player(self.player)

        # Initialize camera and snap to player
        self.camera = Camera()
        self.camera.center_on(self.player.x, self.player.y)

        # Initialize systems
        self.collision_system = CollisionSystem(cell_size=100)
        self.wave_manager = WaveManager()
        self.skill_system = SkillSystem()
        self.exp_system = ExpSystem()
        self.damage_numbers = DamageNumberManager()

        # Give player starting skill
        self.skill_system.add_or_upgrade("spinning_blade")

        # Start wave 1
        self.wave_manager.start()

    # ------------------------------------------------------------------
    # Update
    # ------------------------------------------------------------------

    def _update(self):
        """Update game logic based on current state."""
        if self.state == GameState.MENU:
            self.main_menu.update(self.dt)
        elif self.state == GameState.PLAYING:
            self._update_playing()
        elif self.state == GameState.LEVEL_UP:
            self.level_up_screen.update(self.dt)

    def _update_playing(self):
        """Update all gameplay systems."""
        dt = self.dt
        self.stats["time_survived"] += dt

        if not self.player or not self.player.alive:
            return

        # --- Player input and movement ---
        keys = pygame.key.get_pressed()
        self.player.handle_input(keys)
        self.player.update(dt)

        # --- Wave manager: spawn enemies ---
        wave_events = self.wave_manager.update(dt, self.enemies, self.camera)
        if wave_events.get("new_wave"):
            self.stats["wave_reached"] = self.wave_manager.wave_number
        if wave_events.get("all_complete"):
            self.state = GameState.VICTORY
            self._show_result(is_victory=True)
            return

        # --- Update enemies ---
        for enemy in self.enemies:
            enemy.update(dt, self.player, self.enemies, self.enemy_projectiles)

        # --- Update enemy projectiles ---
        for ep in self.enemy_projectiles:
            ep.update(dt)
        self.enemy_projectiles = [ep for ep in self.enemy_projectiles if ep.alive]

        # --- Enemy projectile vs player collision ---
        if self.player.alive:
            for ep in self.enemy_projectiles:
                if not ep.alive:
                    continue
                if circle_collision(self.player.x, self.player.y, self.player.radius,
                                    ep.x, ep.y, ep.radius):
                    self.player.take_damage(ep.damage)
                    ep.alive = False
                    if self.damage_numbers:
                        self.damage_numbers.spawn(
                            self.player.x, self.player.y, ep.damage,
                            is_player_damage=True)

        # --- Skill system: auto-fire skills ---
        self.skill_system.update(dt, self.player, self.enemies)

        # --- Skill hit detection ---
        skill_hits = self.skill_system.check_all_hits(self.enemies)
        flame_hits = self.skill_system.check_flame_hits(self.player, self.enemies)
        all_skill_hits = skill_hits + flame_hits

        for enemy, damage, is_crit, skill in all_skill_hits:
            if enemy.alive:
                died = enemy.take_damage(damage)
                self.stats["damage_dealt"] += damage
                if self.damage_numbers:
                    self.damage_numbers.spawn(enemy.x, enemy.y, damage, is_crit=is_crit)
                if died:
                    self.stats["enemies_killed"] += 1
                    self.wave_manager.on_enemy_killed()
                    # Spawn EXP gem
                    self.exp_system.spawn_gem(enemy.x, enemy.y, enemy.exp_drop)

        # --- Collision detection (player-enemy contact, projectile-enemy) ---
        collision_result = self.collision_system.update(
            self.player, self.enemies, self.projectiles, None
        )

        # Player takes contact damage from enemies
        for enemy in collision_result.player_hit_by:
            if enemy.can_damage_player():
                self.player.take_damage(enemy.damage)
                enemy.reset_contact_timer()
                apply_knockback(enemy, self.player.x, self.player.y, 30)
                if self.damage_numbers:
                    self.damage_numbers.spawn(
                        self.player.x, self.player.y, enemy.damage,
                        is_player_damage=True)

        # Projectile hits on enemies (from player's own auto-attack projectiles)
        for proj, enemy in collision_result.enemies_hit:
            if enemy.alive:
                died = enemy.take_damage(proj.damage)
                self.stats["damage_dealt"] += proj.damage
                apply_knockback(enemy, proj.x, proj.y, 15)
                if self.damage_numbers:
                    self.damage_numbers.spawn(enemy.x, enemy.y, proj.damage)
                if died:
                    self.stats["enemies_killed"] += 1
                    self.wave_manager.on_enemy_killed()
                    self.exp_system.spawn_gem(enemy.x, enemy.y, enemy.exp_drop)

        # --- Update player auto-attack projectiles ---
        for proj in self.projectiles:
            proj.update(dt, self.enemies, self.player.x, self.player.y)
        self.projectiles = [p for p in self.projectiles if p.alive]

        # --- EXP system: gem attraction and collection ---
        exp_collected = self.exp_system.update(dt, self.player)
        if exp_collected > 0:
            leveled_up = self.player.add_exp(exp_collected)
            if leveled_up:
                self.stats["level_reached"] = self.player.level
                # Apply passive skill stat bonuses
                passive_stats = self.skill_system.get_passive_stats()
                if passive_stats.get('regen_per_second', 0) > 0:
                    heal = int(passive_stats['regen_per_second'])
                    self.player.hp = min(self.player.max_hp, self.player.hp + heal)
                # Show level-up screen
                choices = self.skill_system.get_level_up_choices(3)
                if choices:
                    self.level_up_screen.set_choices(choices)
                    self.state = GameState.LEVEL_UP
                    return

        # --- Clean up dead enemies ---
        self.enemies = [e for e in self.enemies if e.alive]

        # --- Update camera to follow player ---
        self.camera.update(self.player.x, self.player.y, dt)

        # --- Update damage numbers ---
        if self.damage_numbers:
            self.damage_numbers.update(dt)

        # --- Check player death ---
        if not self.player.alive:
            self.state = GameState.GAME_OVER
            self._show_result(is_victory=False)

    def _show_result(self, is_victory: bool):
        """Configure and show the result screen."""
        skill_names = self.skill_system.get_skill_names() if self.skill_system else []
        self.result_screen.set_result(is_victory, self.stats, skill_names)

    # ------------------------------------------------------------------
    # Draw
    # ------------------------------------------------------------------

    def _draw(self):
        """Render the current frame."""
        self.screen.fill(COLOR_BACKGROUND)

        if self.state == GameState.MENU:
            self.main_menu.render(self.screen)
        elif self.state == GameState.EQUIPMENT:
            self.equipment_screen.render(self.screen)
        elif self.state == GameState.PLAYING:
            self._draw_game()
        elif self.state == GameState.LEVEL_UP:
            self._draw_game()
            self.level_up_screen.render(self.screen)
        elif self.state == GameState.PAUSED:
            self._draw_game()
            self._draw_pause()
        elif self.state in (GameState.GAME_OVER, GameState.VICTORY):
            self._draw_game()
            self.result_screen.render(self.screen)

        pygame.display.flip()

    def _draw_game(self):
        """Draw the gameplay scene: world background, entities, HUD."""
        if not self.camera:
            return

        # Draw tiled background with grid lines
        self._draw_world()

        # Draw EXP gems
        self.exp_system.draw(self.screen, self.camera)

        # Draw enemies
        for enemy in self.enemies:
            if self.camera.is_visible(enemy.x, enemy.y, 50):
                enemy.draw(self.screen, self.camera)

        # Draw enemy projectiles
        for ep in self.enemy_projectiles:
            if self.camera.is_visible(ep.x, ep.y):
                ep.draw(self.screen, self.camera)

        # Draw skill effects and projectiles
        self.skill_system.draw(self.screen, self.camera)
        if self.player:
            self.skill_system.draw_flame_circles(
                self.screen, self.camera, self.player.x, self.player.y)

        # Draw player auto-attack projectiles
        for proj in self.projectiles:
            proj.draw(self.screen, self.camera)

        # Draw player
        if self.player:
            self.player.draw(self.screen, self.camera)

        # --- HUD (screen-space, no camera offset) ---

        # Boss HP bar
        for enemy in self.enemies:
            if enemy.category == 'boss' and enemy.alive:
                enemy.draw_boss_hp_bar(self.screen)

        # Wave announcements
        if self.wave_manager:
            self.wave_manager.draw_wave_text(self.screen)
            self.wave_manager.draw_rest_text(self.screen)

        # Damage numbers (world-space with camera offset)
        if self.damage_numbers:
            self.damage_numbers.render(self.screen, (self.camera.x, self.camera.y))

        # HUD overlay
        if self.player and self.wave_manager:
            player_data = {
                "hp": self.player.hp,
                "max_hp": self.player.max_hp,
                "exp": self.player.exp,
                "exp_needed": self.player.exp_to_next,
                "level": self.player.level,
                "kill_count": self.stats["enemies_killed"],
            }
            wave_data = {
                "wave_number": self.wave_manager.wave_number,
                "total_waves": TOTAL_WAVES,
                "time_remaining": self.wave_manager.wave_time_remaining,
            }
            skill_data = self.skill_system.get_hud_data() if self.skill_system else []
            self.hud.render(self.screen, player_data, wave_data, skill_data)

    def _draw_world(self):
        """Draw the tiled background with grid lines."""
        visible = self.camera.get_visible_rect()

        # Calculate grid line range (only draw visible lines)
        start_x = max(0, (visible.left // TILE_SIZE) * TILE_SIZE)
        end_x = min(WORLD_WIDTH, visible.right + TILE_SIZE)
        start_y = max(0, (visible.top // TILE_SIZE) * TILE_SIZE)
        end_y = min(WORLD_HEIGHT, visible.bottom + TILE_SIZE)

        # Draw vertical grid lines
        x = start_x
        while x <= end_x:
            sx, _ = self.camera.apply(x, 0)
            pygame.draw.line(
                self.screen, COLOR_GRID,
                (int(sx), 0), (int(sx), SCREEN_HEIGHT)
            )
            x += TILE_SIZE

        # Draw horizontal grid lines
        y = start_y
        while y <= end_y:
            _, sy = self.camera.apply(0, y)
            pygame.draw.line(
                self.screen, COLOR_GRID,
                (0, int(sy)), (SCREEN_WIDTH, int(sy))
            )
            y += TILE_SIZE

        # Draw world boundary (visible red border)
        border_rect = self.camera.apply_rect(
            pygame.Rect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
        )
        pygame.draw.rect(self.screen, (100, 30, 30), border_rect, 2)

    def _draw_pause(self):
        """Draw pause overlay."""
        # Semi-transparent background
        overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 140))
        self.screen.blit(overlay, (0, 0))

        font = pygame.font.Font(None, 48)
        text = font.render("PAUSED", True, (255, 255, 255))
        self.screen.blit(text, (SCREEN_WIDTH // 2 - text.get_width() // 2,
                                SCREEN_HEIGHT // 2 - 30))

        font_small = pygame.font.Font(None, 28)
        hint = font_small.render("Press ESC to Resume", True, (180, 180, 180))
        self.screen.blit(hint, (SCREEN_WIDTH // 2 - hint.get_width() // 2,
                                SCREEN_HEIGHT // 2 + 20))
