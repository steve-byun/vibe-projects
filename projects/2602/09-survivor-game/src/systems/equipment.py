"""Equipment system - pre-game equipment selection and stat bonuses."""

import json
import os


# Load equipment data
_data_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'equipment.json')
with open(_data_path, 'r', encoding='utf-8') as _f:
    _EQUIPMENT_DATA = json.load(_f)

# Build flat lookup of all equipment items
EQUIPMENT_ITEMS = {}
for _category in _EQUIPMENT_DATA.get('equipment', {}).values():
    if isinstance(_category, list):
        for _item in _category:
            EQUIPMENT_ITEMS[_item['id']] = _item

EQUIPMENT_SLOTS = _EQUIPMENT_DATA.get('slots', {
    'weapon': 1, 'armor': 1, 'accessory': 2
})


class EquipmentSystem:
    """Manages equipment selection and stat bonus calculation."""

    def __init__(self):
        self.equipped = {
            'weapon': None,
            'armor': None,
            'accessory_1': None,
            'accessory_2': None,
        }

    def equip(self, slot: str, item_id: str) -> bool:
        """Equip an item to a slot.

        Args:
            slot: One of 'weapon', 'armor', 'accessory_1', 'accessory_2'.
            item_id: ID of the equipment item.

        Returns:
            True if equipped successfully.
        """
        if slot not in self.equipped:
            return False
        if item_id not in EQUIPMENT_ITEMS:
            return False

        item = EQUIPMENT_ITEMS[item_id]

        # Validate type matches slot
        if slot == 'weapon' and item['type'] != 'weapon':
            return False
        if slot == 'armor' and item['type'] != 'armor':
            return False
        if slot.startswith('accessory') and item['type'] != 'accessory':
            return False

        self.equipped[slot] = item_id
        return True

    def unequip(self, slot: str):
        """Remove equipment from a slot."""
        if slot in self.equipped:
            self.equipped[slot] = None

    def get_total_bonuses(self) -> dict:
        """Calculate combined stat bonuses from all equipped items.

        Returns:
            Dict of stat_name -> total_value. Possible keys:
            damage_percent, hp_percent, speed_percent, crit_chance,
            crit_damage, cooldown_reduction, exp_bonus, pickup_range,
            damage_reduction, hp_regen, life_steal
        """
        totals = {}
        for slot, item_id in self.equipped.items():
            if item_id is None:
                continue
            item = EQUIPMENT_ITEMS.get(item_id)
            if item is None:
                continue
            for stat, value in item.get('stat_bonuses', {}).items():
                totals[stat] = totals.get(stat, 0) + value
        return totals

    def apply_to_player(self, player):
        """Apply equipment bonuses to a player object.

        Args:
            player: Player object with stat attributes.
        """
        bonuses = self.get_total_bonuses()

        # Apply percentage bonuses
        if 'damage_percent' in bonuses:
            player.attack = int(player.attack * (1 + bonuses['damage_percent'] / 100))
        if 'hp_percent' in bonuses:
            bonus_hp = int(player.max_hp * bonuses['hp_percent'] / 100)
            player.max_hp += bonus_hp
            player.hp += bonus_hp
        if 'speed_percent' in bonuses:
            player.speed = player.speed * (1 + bonuses['speed_percent'] / 100)
        if 'crit_chance' in bonuses:
            player.crit_chance += bonuses['crit_chance'] / 100
        if 'crit_damage' in bonuses:
            player.crit_damage += bonuses['crit_damage'] / 100
        if 'pickup_range' in bonuses:
            player.pickup_range += bonuses['pickup_range']

    def get_equipped_items(self) -> list[dict]:
        """Return list of equipped item data dicts."""
        items = []
        for slot, item_id in self.equipped.items():
            if item_id and item_id in EQUIPMENT_ITEMS:
                item = EQUIPMENT_ITEMS[item_id].copy()
                item['slot'] = slot
                items.append(item)
        return items

    def get_all_items_by_type(self, item_type: str) -> list[dict]:
        """Get all available items of a given type.

        Args:
            item_type: 'weapon', 'armor', or 'accessory'.

        Returns:
            List of equipment item dicts.
        """
        return [item for item in EQUIPMENT_ITEMS.values() if item['type'] == item_type]
