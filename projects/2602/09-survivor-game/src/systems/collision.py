"""Collision detection system with spatial hashing for performance."""

import math


class SpatialHash:
    """Spatial hash grid for broad-phase collision detection.

    Divides the world into cells. Entities are inserted into cells
    based on their position, and collision checks only compare
    entities in the same or neighboring cells.
    """

    def __init__(self, cell_size: int = 100):
        """
        Args:
            cell_size: Size of each grid cell in pixels.
        """
        self.cell_size = cell_size
        self.cells: dict[tuple[int, int], list] = {}

    def clear(self):
        """Clear all entities from the grid."""
        self.cells.clear()

    def _get_cell(self, x: float, y: float) -> tuple[int, int]:
        """Get the cell key for a world position."""
        return int(x // self.cell_size), int(y // self.cell_size)

    def insert(self, entity):
        """Insert an entity into the spatial hash.

        Entity must have x, y attributes.

        Args:
            entity: Object with x, y (and optionally radius) attributes.
        """
        cell = self._get_cell(entity.x, entity.y)
        if cell not in self.cells:
            self.cells[cell] = []
        self.cells[cell].append(entity)

    def get_nearby(self, x: float, y: float, radius: float = 0) -> list:
        """Get all entities in the same and neighboring cells.

        Args:
            x: Query x position.
            y: Query y position.
            radius: Optional radius to expand the search area.

        Returns:
            List of entities that might be colliding.
        """
        cx, cy = self._get_cell(x, y)
        # Check neighboring cells based on radius
        extra = max(1, int(radius / self.cell_size) + 1)
        nearby = []

        for dx in range(-extra, extra + 1):
            for dy in range(-extra, extra + 1):
                cell = (cx + dx, cy + dy)
                if cell in self.cells:
                    nearby.extend(self.cells[cell])

        return nearby


class CollisionSystem:
    """Handles collision detection and response between game entities."""

    def __init__(self, cell_size: int = 100):
        self.spatial_hash = SpatialHash(cell_size)

    def update(self, player, enemies, projectiles, exp_gems=None):
        """Run all collision checks for the frame.

        Args:
            player: Player entity.
            enemies: List of enemy entities.
            projectiles: List of projectile entities.
            exp_gems: Optional list of EXP gem entities.

        Returns:
            CollisionResult with lists of events that occurred.
        """
        result = CollisionResult()

        # Rebuild spatial hash
        self.spatial_hash.clear()
        for enemy in enemies:
            if enemy.alive:
                self.spatial_hash.insert(enemy)

        # Player vs Enemies
        if player.alive:
            self._check_player_enemy(player, result)

        # Projectiles vs Enemies
        for proj in projectiles:
            if proj.alive:
                self._check_projectile_enemy(proj, result)

        # Player vs EXP Gems
        if exp_gems and player.alive:
            self._check_player_gems(player, exp_gems, result)

        return result

    def _check_player_enemy(self, player, result: "CollisionResult"):
        """Check player collision with nearby enemies."""
        nearby = self.spatial_hash.get_nearby(player.x, player.y, player.radius)

        for enemy in nearby:
            if not enemy.alive:
                continue
            if circle_collision(player.x, player.y, player.radius,
                                enemy.x, enemy.y, enemy.radius):
                result.player_hit_by.append(enemy)

    def _check_projectile_enemy(self, projectile, result: "CollisionResult"):
        """Check projectile collision with nearby enemies."""
        nearby = self.spatial_hash.get_nearby(
            projectile.x, projectile.y, projectile.radius
        )

        for enemy in nearby:
            if not enemy.alive:
                continue
            if circle_collision(projectile.x, projectile.y, projectile.radius,
                                enemy.x, enemy.y, enemy.radius):
                if projectile.on_hit(enemy):
                    result.enemies_hit.append((projectile, enemy))

    def _check_player_gems(self, player, gems, result: "CollisionResult"):
        """Check player pickup range against EXP gems."""
        for gem in gems:
            if not gem.alive:
                continue
            dx = gem.x - player.x
            dy = gem.y - player.y
            dist_sq = dx * dx + dy * dy
            pickup_range_sq = player.pickup_range * player.pickup_range

            if dist_sq < pickup_range_sq:
                result.gems_collected.append(gem)


class CollisionResult:
    """Results from a collision check frame."""

    def __init__(self):
        # Enemies that hit the player this frame
        self.player_hit_by: list = []
        # (projectile, enemy) pairs for projectile hits
        self.enemies_hit: list[tuple] = []
        # EXP gems within player pickup range
        self.gems_collected: list = []


def circle_collision(
    x1: float, y1: float, r1: float,
    x2: float, y2: float, r2: float,
) -> bool:
    """Check if two circles overlap.

    Args:
        x1, y1, r1: Center and radius of first circle.
        x2, y2, r2: Center and radius of second circle.

    Returns:
        True if circles overlap.
    """
    dx = x2 - x1
    dy = y2 - y1
    dist_sq = dx * dx + dy * dy
    radii_sum = r1 + r2
    return dist_sq < radii_sum * radii_sum


def apply_knockback(
    entity,
    from_x: float,
    from_y: float,
    strength: float = 100.0,
):
    """Apply knockback to an entity away from a point.

    The entity must have x, y attributes.

    Args:
        entity: Entity to push.
        from_x: X origin of the knockback force.
        from_y: Y origin of the knockback force.
        strength: Knockback distance in pixels.
    """
    dx = entity.x - from_x
    dy = entity.y - from_y
    dist = math.sqrt(dx * dx + dy * dy)

    if dist < 0.001:
        # Entities are at same position, push in random-ish direction
        dx = 1.0
        dy = 0.0
        dist = 1.0

    # Normalize and apply knockback
    nx = dx / dist
    ny = dy / dist
    entity.x += nx * strength
    entity.y += ny * strength
