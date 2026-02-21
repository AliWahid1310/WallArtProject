// Utility functions for the Gallery Wall Configurator

/**
 * Format currency values
 */
export const formatPrice = (price) => {
  return `$${parseFloat(price).toFixed(2)}`;
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Filter products by category
 */
export const filterByCategory = (products, category) => {
  if (!category || category === 'all') return products;
  return products.filter((product) => product.category === category);
};

/**
 * Search products by name or description
 */
export const searchProducts = (products, query) => {
  if (!query) return products;
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      (product.description && product.description.toLowerCase().includes(lowerQuery)) ||
      (product.artist && product.artist.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Sort products by specified field
 */
export const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    case 'price-desc':
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
};

/**
 * Get unique categories from products
 */
export const getCategories = (products) => {
  const categories = new Set();
  products.forEach((product) => {
    if (product.category) {
      categories.add(product.category);
    }
  });
  return ['all', ...Array.from(categories)];
};

/**
 * Calculate position for frame on canvas
 */
export const calculateFramePosition = (position, canvasWidth, canvasHeight) => {
  return {
    left: `${position.x}%`,
    top: `${position.y}%`,
    width: `${position.width}%`,
    height: `${position.height}%`,
    transform: 'translate(-50%, -50%)',
  };
};

/**
 * Validate configuration before checkout
 */
export const validateConfiguration = (config) => {
  const errors = [];
  
  if (!config.selectedBackground) {
    errors.push('Please select a background');
  }
  
  if (!config.selectedLayout) {
    errors.push('Please select a layout');
  }
  
  if (config.selectedArtworks.length === 0) {
    errors.push('Please select at least one artwork');
  }
  
  if (config.selectedFrames.length === 0) {
    errors.push('Please select at least one frame');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Parse a print size string like "50 × 70" into numeric width/height (in the
 * unit the string represents).  Also handles A-series labels (A0–A4) which
 * are returned in **centimetres**.
 *
 * Returns { w, h, isCm } or null if invalid.
 *   isCm === true  → the returned values are already in cm (A-labels)
 *   isCm === false → caller should apply any in→cm conversion if needed
 */
const A_SIZES = {
  A0: { w: 84.1, h: 118.9 },
  A1: { w: 59.4, h: 84.1 },
  A2: { w: 42, h: 59.4 },
  A3: { w: 29.7, h: 42 },
  A4: { w: 21, h: 29.7 },
}

export const parsePrintSize = (printSize) => {
  if (!printSize) return null
  // Handle A-series labels
  const upper = printSize.trim().toUpperCase()
  if (A_SIZES[upper]) {
    return { w: A_SIZES[upper].w, h: A_SIZES[upper].h, isCm: true }
  }
  const parts = printSize.split('×').map(s => parseFloat(s.trim()))
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return null
  return { w: parts[0], h: parts[1], isCm: false }
}

/**
 * Compute dynamically sized frames based on the selected print size.
 *
 * Scale approach:
 *   - A single CM_SCALE converts centimetres → % of canvas height.
 *   - CANVAS_ASPECT_RATIO corrects for the wider-than-tall canvas so that
 *     visual proportions (aspect ratio of each frame) are accurate.
 *   - Centre positions from the original layout are preserved; only the
 *     width / height around that centre change.
 *
 * For Mix orientation the function detects whether each individual frame
 * is landscape- or portrait-shaped and swaps the print-size dimensions
 * accordingly so that landscape frames stay landscape even though the
 * dropdown value is given in portrait format.
 *
 * @param {Array}  frames           – the layout's frames array
 * @param {string} printSize        – e.g. "50 × 70"
 * @param {string} measurementUnit  – "cm" | "in"
 * @param {string} printOrientation – "Portrait" | "Landscape" | "Square" | "Mix"
 * @param {number} wallScale        – slider value (default 50); sizes scale by wallScale/50
 * @returns {Array} new frames array with computed width/height/top/left
 */
export const getDynamicFrames = (frames, printSizes, measurementUnit, printOrientation, wallScale = 50, spacingValue = 5) => {
  if (!printSizes || !frames || frames.length === 0) return frames

  // Normalise: string → same size for every frame; array → one size per frame
  const sizesArr = Array.isArray(printSizes)
    ? printSizes
    : new Array(frames.length).fill(printSizes)

  const firstParsed = parsePrintSize(sizesArr[0])
  if (!firstParsed) return frames

  // 1 cm ≈ 0.52% of canvas width  (canvas represents ≈ 192 cm wall)
  const CM_SCALE = 0.52

  // Canvas aspect ratio (width / height) — the canvas container is typically
  // ~1.6 : 1 landscape.  We need this to convert width-% to height-% so we
  // can check vertical overflow.
  const CANVAS_AR = 1.6

  // Safe inset — frames must stay within this margin (%)
  const MARGIN = 4

  // ---------- Pass 1: compute raw sizes & centres ----------
  const scaleFactor = (wallScale + 50) / 50
  const raw = frames.map((frame, i) => {
    const sizeStr = sizesArr[i] ?? sizesArr[0]
    const parsed = parsePrintSize(sizeStr) || firstParsed

    let widthCm = parsed.w
    let heightCm = parsed.h
    if (!parsed.isCm && measurementUnit === 'in') {
      widthCm *= 2.54
      heightCm *= 2.54
    }

    const origW = parseFloat(frame.width)
    const origH = parseFloat(frame.height)

    let fwCm = widthCm
    let fhCm = heightCm
    if (printOrientation === 'Mix') {
      const isLandscapeFrame = origW > origH
      const isPortraitSize  = widthCm < heightCm
      if (isLandscapeFrame && isPortraitSize) {
        fwCm = heightCm
        fhCm = widthCm
      }
    }

    const wPct = fwCm * CM_SCALE * scaleFactor
    // Height in the same %-of-width units (so we can compare apples-to-apples)
    const hPctW = fhCm * CM_SCALE * scaleFactor
    // Actual height as %-of-container-height = hPctW * CANVAS_AR
    const hPctH = hPctW * CANVAS_AR

    // Original centre
    const hasTranslateX = frame.transform?.includes('translateX(-50%)')
    let origLeft = frame.left
      ? parseFloat(frame.left)
      : frame.right
        ? 100 - parseFloat(frame.right) - origW
        : 50
    if (hasTranslateX) origLeft -= origW / 2
    const origTop = frame.top
      ? parseFloat(frame.top)
      : frame.bottom
        ? 100 - parseFloat(frame.bottom) - origH
        : 50

    const cx = origLeft + origW / 2
    const cy = origTop  + origH / 2

    // Size label
    const isALabel = parsed.isCm && /^A\d$/i.test(sizeStr.trim())
    const sizeLabel = isALabel
      ? sizeStr.trim().toUpperCase()
      : Number.isInteger(fwCm) && Number.isInteger(fhCm)
        ? `${fwCm}x${fhCm}`
        : `${parseFloat(fwCm.toFixed(1))}x${parseFloat(fhCm.toFixed(1))}`

    const avgDim = (fwCm + fhCm) / 2
    const borderWidth = avgDim < 25 ? 2 : avgDim < 55 ? 3 : 4

    return { frame, wPct, hPctH, cx, cy, fwCm, fhCm, sizeLabel, borderWidth }
  })

  // ---------- Pass 1b: position frames so inter-frame gap = spacingValue ----------
  // For each pair, compute the centroid-scale factor k that places that pair's edges
  // exactly targetGap apart.  bestK = max over all pairs so the TIGHTEST pair gets
  // exactly targetGap and every other pair gets ≥ targetGap.
  // Works for any wallScale: frame sizes already embed scaleFactor via wPct/hPctH.
  const spacingCm  = measurementUnit === 'in' ? spacingValue * 2.54 : spacingValue
  const targetGap  = spacingCm * CM_SCALE  // desired gap in width-%
  if (raw.length > 1) {
    const gcx = raw.reduce((s, r) => s + r.cx, 0) / raw.length
    const gcy = raw.reduce((s, r) => s + r.cy, 0) / raw.length
    let bestK = 0
    for (let i = 0; i < raw.length; i++) {
      for (let j = i + 1; j < raw.length; j++) {
        const ri = raw[i], rj = raw[j]
        const dx   = Math.abs(rj.cx - ri.cx)              // width-%
        const dy_w = Math.abs(rj.cy - ri.cy) / CANVAS_AR  // height-% → width-%
        let k_ij
        if (dx >= dy_w) {
          if (dx === 0) continue
          const hwSum = (ri.wPct + rj.wPct) / 2
          k_ij = (hwSum + targetGap) / dx
        } else {
          if (dy_w === 0) continue
          const hhSum_w = (ri.hPctH + rj.hPctH) / (2 * CANVAS_AR)
          k_ij = (hhSum_w + targetGap) / dy_w
        }
        if (k_ij > bestK) bestK = k_ij
      }
    }
    if (bestK > 0) {
      for (const r of raw) {
        r.cx = gcx + (r.cx - gcx) * bestK
        r.cy = gcy + (r.cy - gcy) * bestK
      }
    }
  }

  // ---------- Pass 2: compute bounding box & shrink factor ----------
  // Bounding box in %-of-width (horizontal) and %-of-height (vertical)
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const r of raw) {
    const l = r.cx - r.wPct / 2
    const rr = r.cx + r.wPct / 2
    const t = r.cy - r.hPctH / 2
    const b = r.cy + r.hPctH / 2
    if (l < minX) minX = l
    if (rr > maxX) maxX = rr
    if (t < minY) minY = t
    if (b > maxY) maxY = b
  }

  const usableW = 100 - MARGIN * 2
  const usableH = 100 - MARGIN * 2
  const groupW = maxX - minX
  const groupH = maxY - minY

  let shrink = 1
  if (groupW > usableW) shrink = Math.min(shrink, usableW / groupW)
  if (groupH > usableH) shrink = Math.min(shrink, usableH / groupH)

  // Also clamp individual frames (single-frame edge case)
  for (const r of raw) {
    if (r.wPct * shrink > usableW) shrink = Math.min(shrink, usableW / r.wPct)
    if (r.hPctH * shrink > usableH) shrink = Math.min(shrink, usableH / r.hPctH)
  }

  // Compute group centre so we can keep the group centred after shrinking
  const groupCX = (minX + maxX) / 2
  const groupCY = (minY + maxY) / 2

  // ---------- Pass 2b: iterative frame separation ----------
  // Since CSS renders frames with aspectRatio (height derived from width),
  // frame height in pixels = wPct * canvasW / aspectRatio.
  // Work entirely in "% of canvas width" space for both X and Y:
  //   - X: already in width-%
  //   - Y: convert from height-% to width-% by dividing by CANVAS_AR
  // MIN_GAP_W = minimum clear gap between frame edges in width-% units
  const MIN_GAP_W = 0  // overlap prevention only; spacing is fully controlled by Pass 1b

  // Build mutable position array, all in width-% space
  const pos = raw.map(r => ({
    cx: groupCX + (r.cx - groupCX) * shrink,                    // width-%
    cy: (groupCY + (r.cy - groupCY) * shrink) / CANVAS_AR,      // convert to width-%
    hw: (r.wPct * shrink) / 2,                                   // half-width in width-%
    hh: (r.wPct * shrink) / 2 / (r.fwCm / r.fhCm),             // half-height in width-% (via aspectRatio)
  }))

  for (let iter = 0; iter < 60; iter++) {
    let moved = false
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const a = pos[i], b = pos[j]
        const dx = Math.abs(b.cx - a.cx)
        const dy = Math.abs(b.cy - a.cy)
        const minSepX = a.hw + b.hw + MIN_GAP_W
        const minSepY = a.hh + b.hh + MIN_GAP_W
        const ovX = minSepX - dx
        const ovY = minSepY - dy
        if (ovX > 0 && ovY > 0) {
          // Push apart on the axis requiring less movement
          if (ovX <= ovY) {
            const push = ovX / 2
            if (a.cx <= b.cx) { a.cx -= push; b.cx += push }
            else               { a.cx += push; b.cx -= push }
          } else {
            const push = ovY / 2
            if (a.cy <= b.cy) { a.cy -= push; b.cy += push }
            else               { a.cy += push; b.cy -= push }
          }
          moved = true
        }
      }
    }
    if (!moved) break
  }

  // Convert cy back to height-% and clamp within safe area
  for (const p of pos) {
    p.cy = p.cy * CANVAS_AR // back to height-%
    const finalW = p.hw * 2
    const finalH = p.hh * 2 * CANVAS_AR // height in height-%
    p.cx = Math.max(MARGIN + p.hw,          Math.min(100 - MARGIN - p.hw,          p.cx))
    p.cy = Math.max(MARGIN + finalH / 2,    Math.min(100 - MARGIN - finalH / 2,    p.cy))
  }

  // ---------- Pass 3: emit final frame objects using separated positions ----------
  return raw.map((r, i) => ({
    ...r.frame,
    width:       `${(r.wPct * shrink).toFixed(1)}%`,
    height:      `${(r.hPctH * shrink).toFixed(1)}%`,
    top:         undefined,
    left:        undefined,
    bottom:      undefined,
    right:       undefined,
    transform:   undefined,
    centerX:     pos[i].cx,
    centerY:     pos[i].cy,
    aspectRatio: r.fwCm / r.fhCm,
    size:        r.sizeLabel,
    borderWidth: r.borderWidth,
  }))
}

/**
 * Prepare cart data for Shopify Ajax API
 * (For future Shopify integration)
 */
export const prepareShopifyCart = (config) => {
  const items = [];
  
  // Add background
  if (config.selectedBackground && config.selectedBackground.price > 0) {
    items.push({
      id: config.selectedBackground.id,
      quantity: 1,
      properties: {
        type: 'background',
      },
    });
  }
  
  // Add artworks
  config.selectedArtworks.forEach((artwork, index) => {
    if (artwork) {
      items.push({
        id: artwork.id,
        quantity: 1,
        properties: {
          type: 'artwork',
          position: index + 1,
        },
      });
    }
  });
  
  // Add frames
  config.selectedFrames.forEach((frame, index) => {
    if (frame) {
      items.push({
        id: frame.id,
        quantity: 1,
        properties: {
          type: 'frame',
          position: index + 1,
        },
      });
    }
  });
  
  return {
    items,
    attributes: {
      layout: config.selectedLayout?.name,
      total: config.calculateTotal(),
    },
  };
};
