/* iCloud Photo Cleaner - dHash (Difference Hash) Algorithm */

/**
 * Compute dHash from an Image element using a Canvas context
 * @param {HTMLImageElement} img
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLCanvasElement} canvas
 * @returns {string} 16-char hex hash (64 bits)
 */
function computeDHash(img, ctx, canvas) {
  canvas.width = 9;
  canvas.height = 8;
  ctx.drawImage(img, 0, 0, 9, 8);

  const data = ctx.getImageData(0, 0, 9, 8).data;
  let hash = 0n;
  let bit = 0;

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const li = (y * 9 + x) * 4;
      const ri = (y * 9 + x + 1) * 4;
      const lGray = data[li] * 0.299 + data[li + 1] * 0.587 + data[li + 2] * 0.114;
      const rGray = data[ri] * 0.299 + data[ri + 1] * 0.587 + data[ri + 2] * 0.114;

      if (lGray > rGray) {
        hash |= 1n << BigInt(bit);
      }
      bit++;
    }
  }

  return hash.toString(16).padStart(16, '0');
}

/**
 * Compute Hamming distance between two 16-char hex hashes
 * @param {string} a
 * @param {string} b
 * @returns {number} 0-64 (0 = identical)
 */
function hammingDistance(a, b) {
  let xor = BigInt('0x' + a) ^ BigInt('0x' + b);
  let dist = 0;
  while (xor > 0n) {
    dist += Number(xor & 1n);
    xor >>= 1n;
  }
  return dist;
}
