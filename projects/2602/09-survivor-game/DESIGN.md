# Survivor Game - Game Design Document

## Overview

A top-down auto-shooter survival game inspired by Survivor.io. The player character automatically attacks nearby enemies while the player focuses on movement and strategic skill selection. Survive 20 waves of increasingly difficult enemies, level up, and evolve skills to become unstoppable.

## Core Loop

1. Move to avoid enemies
2. Auto-attack nearby enemies
3. Collect EXP gems from defeated enemies
4. Level up -> choose new skill or upgrade existing
5. Survive the wave -> next wave with harder enemies
6. Every 5 waves: Boss fight
7. Survive all 20 waves = Victory

---

## Systems

### Player System
- Top-down 8-directional movement (WASD or arrow keys)
- Base stats: HP, speed, attack power, pickup range
- Auto-attacks with equipped skills
- Invincibility frames on hit
- HP bar displayed above character
- Max 6 active skills at a time

### Enemy System
- Enemies spawn from outside the visible screen area
- Behaviors:
  - **Chase**: Move directly toward player
  - **Ranged**: Keep distance, shoot projectiles
  - **Swarm**: Fast, weak, come in large groups
- Types: Normal, Elite (glowing outline), Boss (large, special attacks)
- Drop EXP gems on death

### Skill / Weapon System
- 20 skills organized into tiers
- Each skill levels 1-5 with scaling stats
- Evolution: Combine two max-level skills into a powerful evolved skill
- Skill types:
  - **Projectile**: Fires in direction (Energy Ball, Missile)
  - **Orbit**: Rotates around player (Spinning Blade, Flame Circle)
  - **Area**: Affects zone (Lightning, Poison Cloud, Black Hole)
  - **Passive**: Permanent stat boost
- Skills auto-activate on cooldown

### EXP / Leveling System
- Enemies drop colored EXP gems (green=1, blue=5, purple=20)
- Gems are magnetically attracted within pickup range
- Each level requires more EXP (formula: base * 1.2^level)
- On level up: pause game, show 3 random skill options
- Options: new skill (if <6 active) or upgrade existing skill

### Equipment System
- Pre-game equipment selection
- 4 types: Weapon, Armor, Accessory (x2 slots)
- Rarities: Common, Rare, Epic, Legendary
- Stat bonuses: damage%, hp%, speed%, crit%, exp_bonus%

### Wave System
- 20 waves total
- Each wave: 60 seconds
- Between waves: brief rest period (3s)
- Difficulty scaling per wave:
  - More enemies
  - Faster spawn rate
  - Tougher enemy types introduced
  - Boss at waves 5, 10, 15, 20
- Wave indicator on HUD

### Camera System
- Camera follows player smoothly (lerp)
- World is 2000x2000, screen is 800x600
- Camera clamped to world boundaries

### Collision System
- Player vs Enemy: Player takes damage
- Skill/Projectile vs Enemy: Enemy takes damage
- Player vs EXP Gem: Collect experience
- Spatial grid for efficient collision detection

---

## UI Screens

### Main Menu
- Title
- Play button
- Equipment select
- Quit

### HUD (In-Game)
- HP bar (top-left)
- EXP bar (top, full width)
- Level indicator
- Wave indicator
- Timer (countdown per wave)
- Active skills display (bottom)
- Mini kill counter

### Level Up Screen
- Pause gameplay
- Show 3 skill cards
- Each card: skill icon (colored rect), name, description, level
- Click to select

### Pause Screen
- Resume
- Quit to menu

### Game Over Screen
- Stats: time survived, enemies killed, level reached, wave reached
- Retry button
- Menu button

### Victory Screen
- Congratulations
- Final stats
- Menu button

---

## Tech Stack

- **Language**: Python 3.10+
- **Engine**: Pygame 2.x
- **Architecture**: Component-based with manager systems
- **Rendering**: Simple shapes (rectangles, circles) with colors - no sprite assets needed
- **Data**: JSON config files for skills, enemies, waves, equipment

---

## File Structure

```
09-survivor-game/
├── main.py                      # Entry point
├── requirements.txt             # Dependencies
├── DESIGN.md                    # This file
├── src/
│   ├── __init__.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── game.py              # Main game class, loop, state management
│   │   ├── settings.py          # Constants, colors, enums
│   │   └── camera.py            # Camera follow + world bounds
│   ├── entities/
│   │   ├── __init__.py
│   │   ├── player.py            # Player movement, stats, HP
│   │   ├── enemy.py             # Enemy types, AI behaviors
│   │   └── projectile.py        # Skill projectiles
│   ├── systems/
│   │   ├── __init__.py
│   │   ├── wave_manager.py      # Wave progression, spawning
│   │   ├── skill_system.py      # Skill management, activation
│   │   ├── exp_system.py        # EXP gems, leveling
│   │   ├── equipment.py         # Equipment stat bonuses
│   │   └── collision.py         # Collision detection (spatial grid)
│   ├── skills/
│   │   ├── __init__.py
│   │   └── base_skill.py        # Base skill class + skill factory
│   └── ui/
│       ├── __init__.py
│       ├── hud.py               # In-game HUD overlay
│       ├── level_up_screen.py   # Level up skill selection
│       ├── result_screen.py     # Game over / victory screen
│       └── menu.py              # Main menu + pause menu
├── data/
│   ├── skills.json              # 20 skills + evolutions
│   ├── enemies.json             # Enemy definitions
│   ├── waves.json               # 20 wave configs
│   └── equipment.json           # Equipment items
└── assets/                      # (empty - using shape rendering)
```

---

## Color Palette

| Element | Color (RGB) |
|---------|------------|
| Player | (0, 200, 255) - Cyan |
| Enemy Normal | (200, 50, 50) - Red |
| Enemy Elite | (200, 150, 0) - Gold |
| Enemy Boss | (150, 0, 200) - Purple |
| EXP Gem Green | (0, 255, 100) |
| EXP Gem Blue | (0, 100, 255) |
| EXP Gem Purple | (180, 0, 255) |
| Background | (30, 30, 40) - Dark |
| Grid Lines | (40, 40, 55) |
| HP Bar | (255, 50, 50) |
| EXP Bar | (255, 220, 0) |
| UI Panel | (20, 20, 30, 200) |
