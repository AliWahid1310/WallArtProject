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
