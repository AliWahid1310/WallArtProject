import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

// Provider component
export const AppProvider = ({ children }) => {
  // Wizard step state (1-4)
  const [currentStep, setCurrentStep] = useState(1);

  // Selected items for each step
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [selectedArtworks, setSelectedArtworks] = useState([]); // array of artwork IDs
  const [selectedFrames, setSelectedFrames] = useState([]); // array of frame IDs per position

  // Cart state
  const [cart, setCart] = useState([]);

  // Saved configurations
  const [savedWalls, setSavedWalls] = useState([]);

  // Canvas zoom level
  const [zoomLevel, setZoomLevel] = useState(1);

  // Load saved walls from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedWalls');
    if (saved) {
      try {
        setSavedWalls(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved walls:', error);
      }
    }
  }, []);

  // Save walls to localStorage whenever they change
  useEffect(() => {
    if (savedWalls.length > 0) {
      localStorage.setItem('savedWalls', JSON.stringify(savedWalls));
    }
  }, [savedWalls]);

  // Calculate total price
  const calculateTotal = () => {
    let total = 0;

    // Add background price
    if (selectedBackground) {
      total += selectedBackground.price || 0;
    }

    // Add layout price
    if (selectedLayout) {
      total += selectedLayout.price || 0;
    }

    // Add artwork prices
    selectedArtworks.forEach((artwork) => {
      if (artwork) {
        total += artwork.price || 0;
      }
    });

    // Add frame prices
    selectedFrames.forEach((frame) => {
      if (frame) {
        total += frame.price || 0;
      }
    });

    return total.toFixed(2);
  };

  // Add item to cart
  const addToCart = (item) => {
    setCart((prev) => [...prev, { ...item, cartId: Date.now() }]);
  };

  // Remove item from cart
  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Save current configuration
  const saveConfiguration = (name) => {
    const config = {
      id: Date.now(),
      name: name || `Gallery Wall ${savedWalls.length + 1}`,
      date: new Date().toISOString(),
      background: selectedBackground,
      layout: selectedLayout,
      artworks: selectedArtworks,
      frames: selectedFrames,
      totalPrice: calculateTotal(),
    };

    setSavedWalls((prev) => [...prev, config]);
    return config;
  };

  // Load a saved configuration
  const loadConfiguration = (configId) => {
    const config = savedWalls.find((w) => w.id === configId);
    if (config) {
      setSelectedBackground(config.background);
      setSelectedLayout(config.layout);
      setSelectedArtworks(config.artworks);
      setSelectedFrames(config.frames);
    }
  };

  // Delete a saved configuration
  const deleteConfiguration = (configId) => {
    setSavedWalls((prev) => prev.filter((w) => w.id !== configId));
    // Also remove from localStorage
    const updated = savedWalls.filter((w) => w.id !== configId);
    localStorage.setItem('savedWalls', JSON.stringify(updated));
  };

  // Reset current configuration
  const resetConfiguration = () => {
    setSelectedBackground(null);
    setSelectedLayout(null);
    setSelectedArtworks([]);
    setSelectedFrames([]);
    setCurrentStep(1);
    setZoomLevel(1);
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Go to specific step
  const goToStep = (step) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  };

  const value = {
    // Step state
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    goToStep,

    // Selection state
    selectedBackground,
    setSelectedBackground,
    selectedLayout,
    setSelectedLayout,
    selectedArtworks,
    setSelectedArtworks,
    selectedFrames,
    setSelectedFrames,

    // Cart
    cart,
    addToCart,
    removeFromCart,
    clearCart,

    // Saved configurations
    savedWalls,
    saveConfiguration,
    loadConfiguration,
    deleteConfiguration,
    resetConfiguration,

    // Canvas
    zoomLevel,
    setZoomLevel,

    // Utils
    calculateTotal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
