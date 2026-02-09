"""Game constants and configuration."""

from enum import Enum, auto


# --- Display ---
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
FPS = 60
TITLE = "Survivor Game"

# --- World ---
WORLD_WIDTH = 2000
WORLD_HEIGHT = 2000
TILE_SIZE = 32

# --- Camera ---
CAMERA_LERP = 0.08  # Smooth follow factor

# --- Player ---
PLAYER_SIZE = 20
PLAYER_SPEED = 200  # pixels per second
PLAYER_MAX_HP = 100
PLAYER_INVINCIBILITY_TIME = 0.5  # seconds after being hit
PLAYER_PICKUP_RANGE = 80  # EXP gem magnet radius
PLAYER_MAX_SKILLS = 6

# --- Enemy ---
ENEMY_SPAWN_MARGIN = 100  # spawn outside screen by this many pixels
ENEMY_FLASH_DURATION = 0.1  # seconds of white flash on hit

# --- EXP ---
EXP_BASE_REQUIREMENT = 10  # EXP needed for level 2
EXP_SCALING = 1.2  # multiplier per level
EXP_GEM_MAGNET_SPEED = 400  # speed gems travel to player when in range
EXP_GEM_SIZE = 6
LEVEL_UP_CHOICES = 3  # number of skill options on level up

# --- Wave ---
WAVE_DURATION = 60  # seconds per wave
WAVE_REST_DURATION = 3  # seconds between waves
TOTAL_WAVES = 20
BOSS_WAVES = [5, 10, 15, 20]

# --- Skills ---
SKILL_MAX_LEVEL = 5

# --- Colors ---
# Player
COLOR_PLAYER = (0, 200, 255)
COLOR_PLAYER_DAMAGED = (255, 100, 100)

# Enemies
COLOR_ENEMY_NORMAL = (200, 50, 50)
COLOR_ENEMY_ELITE = (200, 150, 0)
COLOR_ENEMY_BOSS = (150, 0, 200)

# EXP Gems
COLOR_EXP_GREEN = (0, 255, 100)
COLOR_EXP_BLUE = (0, 100, 255)
COLOR_EXP_PURPLE = (180, 0, 255)

# World
COLOR_BACKGROUND = (30, 30, 40)
COLOR_GRID = (40, 40, 55)

# UI
COLOR_HP_BAR = (255, 50, 50)
COLOR_HP_BAR_BG = (80, 20, 20)
COLOR_EXP_BAR = (255, 220, 0)
COLOR_EXP_BAR_BG = (80, 70, 0)
COLOR_UI_PANEL = (20, 20, 30)
COLOR_UI_PANEL_ALPHA = 200
COLOR_UI_TEXT = (255, 255, 255)
COLOR_UI_TEXT_DIM = (150, 150, 150)
COLOR_UI_HIGHLIGHT = (255, 220, 50)
COLOR_UI_BUTTON = (60, 60, 80)
COLOR_UI_BUTTON_HOVER = (80, 80, 110)
COLOR_UI_BORDER = (100, 100, 130)
COLOR_WHITE = (255, 255, 255)
COLOR_BLACK = (0, 0, 0)

# Rarity colors
COLOR_RARITY_COMMON = (180, 180, 180)
COLOR_RARITY_RARE = (50, 150, 255)
COLOR_RARITY_EPIC = (180, 50, 255)
COLOR_RARITY_LEGENDARY = (255, 180, 0)

# Skill type colors
COLOR_SKILL_PROJECTILE = (255, 100, 50)
COLOR_SKILL_ORBIT = (50, 200, 255)
COLOR_SKILL_AREA = (150, 50, 255)
COLOR_SKILL_PASSIVE = (50, 255, 100)


class GameState(Enum):
    """Game state machine states."""
    MENU = auto()
    EQUIPMENT = auto()
    PLAYING = auto()
    LEVEL_UP = auto()
    PAUSED = auto()
    GAME_OVER = auto()
    VICTORY = auto()
