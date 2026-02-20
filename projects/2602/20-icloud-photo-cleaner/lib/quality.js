/* iCloud Photo Cleaner - Image Quality Assessment */

/**
 * Compute quality metrics from an Image element
 * @param {HTMLImageElement} img
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLCanvasElement} canvas
 * @returns {{ sharpness: number, exposure: number, contrast: number }}
 *   All scores 0-100
 */
function computeQuality(img, ctx, canvas) {
  const SIZE = 64;
  canvas.width = SIZE;
  canvas.height = SIZE;
  ctx.drawImage(img, 0, 0, SIZE, SIZE);

  const data = ctx.getImageData(0, 0, SIZE, SIZE).data;

  // Build grayscale 2D array
  const gray = new Float32Array(SIZE * SIZE);
  for (let i = 0; i < SIZE * SIZE; i++) {
    const idx = i * 4;
    gray[i] = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
  }

  return {
    sharpness: computeSharpness(gray, SIZE),
    exposure: computeExposure(gray),
    contrast: computeContrast(gray),
  };
}

/**
 * Sharpness via Laplacian variance
 * Higher variance = sharper image
 */
function computeSharpness(gray, size) {
  // Laplacian kernel: [0,1,0], [1,-4,1], [0,1,0]
  let sum = 0;
  let sumSq = 0;
  let count = 0;

  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const center = gray[y * size + x];
      const lap =
        gray[(y - 1) * size + x] +
        gray[(y + 1) * size + x] +
        gray[y * size + (x - 1)] +
        gray[y * size + (x + 1)] -
        4 * center;

      sum += lap;
      sumSq += lap * lap;
      count++;
    }
  }

  const mean = sum / count;
  const variance = sumSq / count - mean * mean;

  // Normalize: variance typically 0~2000+, map to 0~100
  // Use sigmoid-like mapping: score = 100 * (1 - e^(-var/500))
  const score = 100 * (1 - Math.exp(-variance / 500));
  return Math.round(Math.max(0, Math.min(100, score)));
}

/**
 * Exposure score based on average brightness
 * Ideal range: 80-180 on 0-255 scale
 */
function computeExposure(gray) {
  let sum = 0;
  for (let i = 0; i < gray.length; i++) {
    sum += gray[i];
  }
  const mean = sum / gray.length;

  // Best score when mean is 100-160
  if (mean >= 100 && mean <= 160) return 100;

  // Linear falloff outside ideal range
  const center = 130;
  const dist = Math.abs(mean - center);
  const score = Math.max(0, 100 - dist * 1.2);
  return Math.round(score);
}

/**
 * Contrast via standard deviation of luminance
 */
function computeContrast(gray) {
  let sum = 0;
  let sumSq = 0;
  for (let i = 0; i < gray.length; i++) {
    sum += gray[i];
    sumSq += gray[i] * gray[i];
  }
  const mean = sum / gray.length;
  const variance = sumSq / gray.length - mean * mean;
  const stddev = Math.sqrt(Math.max(0, variance));

  // Normalize: stddev 50+ = score 100
  const score = Math.min(100, stddev * 2);
  return Math.round(score);
}

/**
 * Weighted total quality score
 * @param {{ sharpness, exposure, contrast }} quality
 * @param {number} faceScore 0-100 (0 if no face or disabled)
 * @param {boolean} hasFace
 * @returns {number} 0-100
 */
function weightedScore(quality, faceScore, hasFace) {
  if (hasFace && faceScore > 0) {
    return (
      quality.sharpness * 0.35 +
      quality.exposure * 0.20 +
      quality.contrast * 0.15 +
      faceScore * 0.30
    );
  }
  // No face: redistribute weights
  return (
    quality.sharpness * 0.50 +
    quality.exposure * 0.30 +
    quality.contrast * 0.20
  );
}
