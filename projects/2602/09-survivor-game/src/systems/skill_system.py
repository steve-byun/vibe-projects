"""Skill system - manages active skills, upgrades, and evolution."""

import json
import os
import random

from src.core.settings import SKILL_MAX_LEVEL, PLAYER_MAX_SKILLS

from src.skills.base_skill import (
    BaseSkill, SKILL_DEFS, EVOLUTION_DEFS, SKILL_EVOLUTION_MAP,
)
from src.skills.spinning_blade import SpinningBlade
from src.skills.energy_ball import EnergyBall
from src.skills.lightning import Lightning
from src.skills.boomerang import Boomerang
from src.skills.drone import Drone
from src.skills.flame_circle import FlameCircle
from src.skills.ice_shard import IceShard
from src.skills.poison_cloud import PoisonCloud
from src.skills.shuriken import Shuriken
from src.skills.laser_beam import LaserBeam


# Skill class registry - maps skill_id to class
SKILL_CLASSES = {
    'spinning_blade': SpinningBlade,
    'energy_ball': EnergyBall,
    'lightning': Lightning,
    'boomerang': Boomerang,
    'drone': Drone,
    'flame_circle': FlameCircle,
    'ice_shard': IceShard,
    'poison_cloud': PoisonCloud,
    'shuriken': Shuriken,
    'laser_beam': LaserBeam,
}


def _create_skill(skill_id: str) -> BaseSkill:
    """Create a skill instance by ID using custom class if available."""
    if skill_id in SKILL_CLASSES:
        return SKILL_CLASSES[skill_id]()
    return BaseSkill(skill_id)


class SkillSystem:
    """Manages the player's active skills, selection, and evolution."""

    def __init__(self):
        self.active_skills: list[BaseSkill] = []

    @property
    def skill_count(self) -> int:
        return len(self.active_skills)

    def has_skill(self, skill_id: str) -> bool:
        return any(s.id == skill_id for s in self.active_skills)

    def get_skill(self, skill_id: str) -> BaseSkill | None:
        for s in self.active_skills:
            if s.id == skill_id:
                return s
        return None

    def add_or_upgrade(self, skill_id: str) -> bool:
        """Add a new skill or upgrade an existing one.

        Returns True if successful.
        """
        existing = self.get_skill(skill_id)
        if existing:
            return existing.level_up()
        elif self.skill_count < PLAYER_MAX_SKILLS:
            skill = _create_skill(skill_id)
            self.active_skills.append(skill)
            return True
        return False

    def update(self, dt: float, player=None, enemies: list = None):
        """Update all active skill cooldowns and behavior.

        Args:
            dt: Delta time.
            player: Player object (needed for skill targeting).
            enemies: List of enemies (needed for skill targeting).
        """
        if player is not None and enemies is not None:
            for skill in self.active_skills:
                skill.update(dt, player, enemies)
        else:
            # Fallback: just tick cooldowns
            for skill in self.active_skills:
                if hasattr(skill, 'cooldown_timer'):
                    skill.cooldown_timer += dt

    def check_all_hits(self, enemies: list) -> list:
        """Check hits from all active skills.

        Returns:
            List of (enemy, damage, is_crit, skill) tuples.
        """
        all_hits = []
        for skill in self.active_skills:
            hits = skill.check_hits(enemies)
            for enemy, damage, is_crit in hits:
                all_hits.append((enemy, damage, is_crit, skill))
        return all_hits

    def check_flame_hits(self, player, enemies: list) -> list:
        """Check flame circle hits specifically (needs player pos).

        Returns:
            List of (enemy, damage, is_crit, skill) tuples.
        """
        hits = []
        for skill in self.active_skills:
            if hasattr(skill, 'check_hits_with_player'):
                skill_hits = skill.check_hits_with_player(player, enemies)
                for enemy, damage, is_crit in skill_hits:
                    hits.append((enemy, damage, is_crit, skill))
        return hits

    def get_level_up_choices(self, count: int = 3) -> list[dict]:
        """Generate random skill choices for the level-up screen.

        Prioritizes: evolutions, then upgradeable existing skills, then new skills.
        Returns list of choice dicts for LevelUpScreen.
        """
        choices = []

        # Check for available evolutions
        evolutions = self._check_evolutions()
        for evo in evolutions:
            choices.append({
                'id': evo['id'],
                'name': evo['name'],
                'description': evo.get('description', ''),
                'skill_type': evo['type'],
                'level': 0,
                'max_level': SKILL_MAX_LEVEL,
                'is_upgrade': False,
                'is_evolution': True,
                'stat_preview': 'EVOLUTION',
            })

        # Upgradeable existing skills (owned but not maxed)
        for skill in self.active_skills:
            if skill.level < SKILL_MAX_LEVEL and not skill.is_evolved:
                next_level = skill.level + 1
                next_key = str(next_level)
                level_stats = skill._level_stats.get(next_key, {})
                stat_preview = ''
                if 'damage' in level_stats:
                    stat_preview = f"DMG: {level_stats['damage']}"
                if 'cooldown' in level_stats and level_stats['cooldown'] > 0:
                    stat_preview += f"  CD: {level_stats['cooldown']}s"

                choices.append({
                    'id': skill.id,
                    'name': skill.name,
                    'description': skill.description,
                    'skill_type': skill.skill_type,
                    'level': skill.level,
                    'max_level': SKILL_MAX_LEVEL,
                    'is_upgrade': True,
                    'is_evolution': False,
                    'stat_preview': stat_preview,
                })

        # New skills (not yet owned, only if room available)
        owned_ids = {s.id for s in self.active_skills}
        if self.skill_count < PLAYER_MAX_SKILLS:
            available_new = [
                sid for sid in SKILL_DEFS
                if sid not in owned_ids
            ]
            random.shuffle(available_new)
            for sid in available_new:
                sdef = SKILL_DEFS[sid]
                stat_preview = ''
                level1 = sdef.get('level_stats', {}).get('1', {})
                if 'damage' in level1:
                    stat_preview = f"DMG: {level1['damage']}"
                if 'cooldown' in level1 and level1['cooldown'] > 0:
                    stat_preview += f"  CD: {level1['cooldown']}s"

                choices.append({
                    'id': sid,
                    'name': sdef['name'],
                    'description': sdef.get('description', ''),
                    'skill_type': sdef['type'],
                    'level': 0,
                    'max_level': SKILL_MAX_LEVEL,
                    'is_upgrade': False,
                    'is_evolution': False,
                    'stat_preview': stat_preview,
                })

        # Prioritize: evolutions > upgrades > new
        evo_choices = [c for c in choices if c.get('is_evolution')]
        upgrade_choices = [c for c in choices if c['is_upgrade']]
        new_choices = [c for c in choices if not c['is_upgrade'] and not c.get('is_evolution')]

        random.shuffle(upgrade_choices)
        random.shuffle(new_choices)

        final = []
        final.extend(evo_choices[:1])  # At most 1 evolution
        # Mix upgrades and new
        if upgrade_choices and new_choices and count >= 2:
            if not final:
                final.append(upgrade_choices.pop(0))
                final.append(new_choices.pop(0))
            remaining = upgrade_choices + new_choices
            random.shuffle(remaining)
            final.extend(remaining)
        else:
            final.extend(upgrade_choices)
            final.extend(new_choices)

        random.shuffle(final)
        return final[:count]

    def apply_choice(self, choice: dict) -> bool:
        """Apply a level-up choice.

        Args:
            choice: Dict with 'id', 'is_upgrade', 'is_evolution' keys.

        Returns:
            True if applied successfully.
        """
        skill_id = choice['id']

        if choice.get('is_evolution'):
            return self._apply_evolution(skill_id)
        else:
            return self.add_or_upgrade(skill_id)

    def _check_evolutions(self) -> list:
        """Check if any skill evolutions are available."""
        max_skill_ids = {s.id for s in self.active_skills if s.level >= SKILL_MAX_LEVEL}
        available = []
        for evo_id, evo_def in EVOLUTION_DEFS.items():
            required = set(evo_def['requires'])
            if required.issubset(max_skill_ids):
                # Don't offer if already evolved
                if not self.has_skill(evo_id):
                    available.append(evo_def)
        return available

    def _apply_evolution(self, evolution_id: str) -> bool:
        """Perform a skill evolution, replacing component skills."""
        if evolution_id not in EVOLUTION_DEFS:
            return False

        evo_def = EVOLUTION_DEFS[evolution_id]
        remove_ids = set(evo_def['requires'])

        # Remove component skills
        self.active_skills = [s for s in self.active_skills if s.id not in remove_ids]

        # Add evolved skill
        evolved = _create_skill(evolution_id)
        self.active_skills.append(evolved)
        return True

    def check_evolution(self) -> dict | None:
        """Check if any evolution combo is available.

        Returns evolution def dict or None.
        """
        evos = self._check_evolutions()
        return evos[0] if evos else None

    def apply_evolution(self, evolution: dict):
        """Apply evolution (compatibility with architect's API)."""
        self._apply_evolution(evolution['id'])

    def draw(self, surface, camera):
        """Draw all skill effects and projectiles."""
        for skill in self.active_skills:
            skill.draw(surface, camera)

    def draw_flame_circles(self, surface, camera, player_x, player_y):
        """Draw flame circle effects at player position."""
        for skill in self.active_skills:
            if hasattr(skill, 'draw_at'):
                skill.draw_at(surface, camera, player_x, player_y)

    def get_passive_stats(self) -> dict:
        """Get combined passive stat bonuses from all passive skills."""
        stats = {
            'speed_bonus': 0,
            'crit_chance': 0,
            'crit_multiplier': 0,
            'heal_percent': 0,
            'regen_per_second': 0,
            'block_chance': 0,
        }
        for skill in self.active_skills:
            if skill.skill_type != 'passive':
                continue
            level_key = str(skill.level)
            level_stats = skill._level_stats.get(level_key, {})
            for key in stats:
                if key in level_stats:
                    stats[key] += level_stats[key]
        return stats

    def get_hud_data(self) -> list[dict]:
        """Get skill data formatted for HUD display."""
        result = []
        for s in self.active_skills:
            cooldown_pct = 0.0
            if s.cooldown > 0:
                cooldown_pct = max(0.0, min(1.0, s.cooldown_timer / s.cooldown))
            result.append({
                'name': s.name,
                'skill_type': s.skill_type,
                'level': s.level,
                'max_level': SKILL_MAX_LEVEL,
                'cooldown_pct': cooldown_pct,
            })
        return result

    def get_skill_names(self) -> list[str]:
        """Get list of active skill names."""
        return [s.name for s in self.active_skills]
