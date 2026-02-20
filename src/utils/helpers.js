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
export const getDynamicFrames = (frames, printSize, measurementUnit, printOrientation, wallScale = 50) => {
  if (!printSize || !frames || frames.length === 0) return frames

  const parsed = parsePrintSize(printSize)
  if (!parsed) return frames

  // Convert to cm – A-series labels are already in cm (isCm flag)
  let widthCm = parsed.w
  let heightCm = parsed.h
  if (!parsed.isCm && measurementUnit === 'in') {
    widthCm *= 2.54
    heightCm *= 2.54
  }

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
  const raw = frames.map(frame => {
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
    const isALabel = parsed.isCm && /^A\d$/i.test(printSize.trim())
    const sizeLabel = isALabel
      ? printSize.trim().toUpperCase()
      : Number.isInteger(fwCm) && Number.isInteger(fhCm)
        ? `${fwCm}x${fhCm}`
        : `${parseFloat(fwCm.toFixed(1))}x${parseFloat(fhCm.toFixed(1))}`

    const avgDim = (fwCm + fhCm) / 2
    const borderWidth = avgDim < 25 ? 2 : avgDim < 55 ? 3 : 4

    return { frame, wPct, hPctH, cx, cy, fwCm, fhCm, sizeLabel, borderWidth }
  })

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

  // ---------- Pass 3: apply shrink & re-centre ----------
  return raw.map(r => {
    const finalW = r.wPct * shrink
    // Centre positions shrink relative to group centre
    const newCX = groupCX + (r.cx - groupCX) * shrink
    const newCY = groupCY + (r.cy - groupCY) * shrink

    // Clamp centres so the frame stays within safe area
    const clampedCX = Math.max(MARGIN + finalW / 2, Math.min(100 - MARGIN - finalW / 2, newCX))
    const finalH = r.hPctH * shrink
    const clampedCY = Math.max(MARGIN + finalH / 2, Math.min(100 - MARGIN - finalH / 2, newCY))

    return {
      ...r.frame,
      width:       `${finalW.toFixed(1)}%`,
      height:      `${(r.hPctH * shrink).toFixed(1)}%`,
      top:         undefined,
      left:        undefined,
      bottom:      undefined,
      right:       undefined,
      transform:   undefined,
      centerX:     clampedCX,
      centerY:     clampedCY,
      aspectRatio: r.fwCm / r.fhCm,
      size:        r.sizeLabel,
      borderWidth: r.borderWidth,
    }
  })
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
