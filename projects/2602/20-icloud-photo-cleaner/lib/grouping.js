/* iCloud Photo Cleaner - Similar Photo Grouping (Union-Find) */

/**
 * Group photos by visual similarity using Union-Find
 * @param {Array<{id: string, hash: string, quality: object, thumbnailUrl: string}>} photos
 * @param {number} threshold Max Hamming distance for "similar" (default: 10)
 * @returns {Array<{photos: Array, bestId: string, bestScore: number}>}
 *   Only groups with 2+ photos are returned
 */
function groupSimilarPhotos(photos, threshold) {
  if (typeof threshold !== 'number') threshold = 10;
  const n = photos.length;
  if (n < 2) return [];

  // Union-Find
  const parent = new Int32Array(n);
  const rank = new Int32Array(n);
  for (let i = 0; i < n; i++) parent[i] = i;

  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]; // path compression
      x = parent[x];
    }
    return x;
  }

  function union(a, b) {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return;
    if (rank[ra] < rank[rb]) { parent[ra] = rb; }
    else if (rank[ra] > rank[rb]) { parent[rb] = ra; }
    else { parent[rb] = ra; rank[ra]++; }
  }

  // Compare all pairs
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dist = hammingDistance(photos[i].hash, photos[j].hash);
      if (dist <= threshold) {
        union(i, j);
      }
    }
  }

  // Collect groups
  const groupMap = new Map();
  for (let i = 0; i < n; i++) {
    const root = find(i);
    if (!groupMap.has(root)) groupMap.set(root, []);
    groupMap.get(root).push(i);
  }

  // Build result (only groups with 2+ photos)
  const groups = [];
  for (const indices of groupMap.values()) {
    if (indices.length < 2) continue;

    const groupPhotos = indices.map((i) => photos[i]);
    let bestIdx = 0;
    let bestScore = -1;
    groupPhotos.forEach((p, idx) => {
      if (p.quality.total > bestScore) {
        bestScore = p.quality.total;
        bestIdx = idx;
      }
    });

    groups.push({
      photos: groupPhotos,
      bestId: groupPhotos[bestIdx].id,
      bestScore: bestScore,
    });
  }

  // Sort by group size (largest first)
  groups.sort((a, b) => b.photos.length - a.photos.length);

  return groups;
}
