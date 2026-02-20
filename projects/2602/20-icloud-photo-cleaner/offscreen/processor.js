/* iCloud Photo Cleaner - Offscreen Image Processor */
(function () {
  'use strict';

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  let faceApiLoaded = false;
  let faceApiLoading = false;

  // ── Message handler ──
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === 'PC_PROCESS_BATCH') {
      processBatch(msg.payload)
        .then(sendResponse)
        .catch((err) => sendResponse({ error: err.message }));
      return true;
    }

    if (msg.type === 'PC_LOAD_FACE_API') {
      loadFaceApi()
        .then(() => sendResponse({ success: true }))
        .catch((err) => sendResponse({ success: false, error: err.message }));
      return true;
    }
  });

  // ── Batch processing ──
  async function processBatch(photos) {
    const results = [];

    for (const photo of photos) {
      try {
        const img = await loadImage(photo.thumbnailUrl);
        const hash = computeDHash(img, ctx, canvas);
        const quality = computeQuality(img, ctx, canvas);

        let faceScore = 0;
        let hasFace = false;
        if (faceApiLoaded) {
          const faceResult = await detectFaceQuality(img);
          faceScore = faceResult.score;
          hasFace = faceResult.detected;
        }

        const total = weightedScore(quality, faceScore, hasFace);

        results.push({
          id: photo.id,
          thumbnailUrl: photo.thumbnailUrl,
          hash,
          quality: {
            sharpness: quality.sharpness,
            exposure: quality.exposure,
            contrast: quality.contrast,
            faceScore,
            hasFace,
            total: Math.round(total),
          },
        });
      } catch (err) {
        // Skip failed images but log
        console.warn('[PhotoCleaner] Failed to process:', photo.id, err.message);
        results.push({
          id: photo.id,
          thumbnailUrl: photo.thumbnailUrl,
          hash: '0000000000000000',
          quality: { sharpness: 0, exposure: 0, contrast: 0, faceScore: 0, hasFace: false, total: 0 },
        });
      }
    }

    return results;
  }

  // ── Image loading ──
  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const timeout = setTimeout(() => {
        reject(new Error('Image load timeout'));
      }, 10000);

      img.onload = () => {
        clearTimeout(timeout);
        resolve(img);
      };
      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Image load failed'));
      };

      // Handle both regular URLs and data URLs
      img.src = url;
    });
  }

  // ── Face API integration ──
  async function loadFaceApi() {
    if (faceApiLoaded) return;
    if (faceApiLoading) {
      // Wait for existing load
      await new Promise((resolve) => {
        const check = setInterval(() => {
          if (faceApiLoaded || !faceApiLoading) {
            clearInterval(check);
            resolve();
          }
        }, 100);
      });
      return;
    }

    faceApiLoading = true;
    try {
      // Dynamically load face-api.js from bundled file
      await loadScript('../lib/face-api.min.js');

      // Load tiny face detector model
      const modelUrl = chrome.runtime.getURL('models');
      await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);

      faceApiLoaded = true;
      console.log('[PhotoCleaner] face-api.js loaded');
    } catch (err) {
      console.warn('[PhotoCleaner] face-api.js load failed:', err.message);
      faceApiLoading = false;
      throw err;
    }
    faceApiLoading = false;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Script load failed: ' + src));
      document.head.appendChild(script);
    });
  }

  async function detectFaceQuality(img) {
    if (!faceApiLoaded || typeof faceapi === 'undefined') {
      return { detected: false, score: 0 };
    }

    try {
      const detections = await faceapi.detectAllFaces(
        img,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 })
      );

      if (!detections || detections.length === 0) {
        return { detected: false, score: 0 };
      }

      // Score based on: confidence + face size + face position
      const imgArea = img.width * img.height;
      let bestScore = 0;

      for (const det of detections) {
        const box = det.box;
        const faceArea = box.width * box.height;

        // Confidence (0-1)
        const confidence = det.score;

        // Size bonus: face should be a reasonable portion of the image
        const sizeRatio = faceArea / imgArea;
        const sizeScore = Math.min(1, sizeRatio * 10); // ~10% of image = 1.0

        // Position bonus: centered faces score higher
        const faceCenterX = (box.x + box.width / 2) / img.width;
        const faceCenterY = (box.y + box.height / 2) / img.height;
        const distFromCenter = Math.sqrt(
          Math.pow(faceCenterX - 0.5, 2) + Math.pow(faceCenterY - 0.4, 2)
        );
        const positionScore = Math.max(0, 1 - distFromCenter * 2);

        const score = confidence * 0.5 + sizeScore * 0.3 + positionScore * 0.2;
        if (score > bestScore) bestScore = score;
      }

      return {
        detected: true,
        score: Math.round(bestScore * 100),
      };
    } catch {
      return { detected: false, score: 0 };
    }
  }
})();
