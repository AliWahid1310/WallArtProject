"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { fetchArtworkProducts, createCheckout } from '../utils/shopify'

export default function LandingPage() {
  const [currentStep, setCurrentStep] = useState(() => {
    // Load current step from localStorage
    const savedStep = localStorage.getItem('galleryCurrentStep')
    return savedStep || "intro"
  })
  const [selectedPlace, setSelectedPlace] = useState(() => {
    const saved = localStorage.getItem('gallerySelectedPlace')
    return saved ? JSON.parse(saved) : null
  })
  const [selectedBackground, setSelectedBackground] = useState(() => {
    const saved = localStorage.getItem('gallerySelectedBackground')
    return saved ? JSON.parse(saved) : null
  })
  const [selectedLayout, setSelectedLayout] = useState(() => {
    const saved = localStorage.getItem('gallerySelectedLayout')
    return saved ? JSON.parse(saved) : null
  })
  const [activeVariants, setActiveVariants] = useState(() => {
    const saved = localStorage.getItem('galleryActiveVariants')
    return saved ? JSON.parse(saved) : {}
  })
  const [expandedSection, setExpandedSection] = useState(null)
  const [selectedArtworks, setSelectedArtworks] = useState(() => {
    const saved = localStorage.getItem('gallerySelectedArtworks')
    return saved ? JSON.parse(saved) : {}
  }) // frameIndex: artworkObject
  const [activeFrameIndex, setActiveFrameIndex] = useState(null) // which frame is being edited
  const [artworkProducts, setArtworkProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedColorFilters, setSelectedColorFilters] = useState([])
  const [selectedFrames, setSelectedFrames] = useState(() => {
    const saved = localStorage.getItem('gallerySelectedFrames')
    return saved ? JSON.parse(saved) : {}
  }) // frameIndex: frameStyleObject
  const [activeFrameForStyle, setActiveFrameForStyle] = useState(null) // which artwork is being styled (null = "All")
  const [showCart, setShowCart] = useState(false)
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on initial mount
    const savedCart = localStorage.getItem('galleryCart')
    return savedCart ? JSON.parse(savedCart) : { artworks: {}, frames: {} }
  }) // Items added to cart
  const [quantities, setQuantities] = useState(() => {
    // Load quantities from localStorage on initial mount
    const savedQuantities = localStorage.getItem('galleryQuantities')
    return savedQuantities ? JSON.parse(savedQuantities) : { artworks: {}, frames: {} }
  }) // Quantities for each item
  const [displayedArtworkCount, setDisplayedArtworkCount] = useState(20) // Number of artworks to display
  const [isLoadingMore, setIsLoadingMore] = useState(false) // Loading more artworks
  const artworkScrollRef = useRef(null) // Ref for artwork scroll container
  const [showLayoutChangeModal, setShowLayoutChangeModal] = useState(false) // Confirmation modal for layout change
  const [pendingLayout, setPendingLayout] = useState(null) // Store the layout user wants to switch to
  const [showEmptyArtworkModal, setShowEmptyArtworkModal] = useState(false) // Validation modal for no artworks selected

  // Fetch artwork products from Shopify on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true)
        const products = await fetchArtworkProducts()
        setArtworkProducts(products)
      } catch (error) {
        console.error('Failed to fetch artwork products:', error)
        // Keep empty array on error
      } finally {
        setIsLoadingProducts(false)
      }
    }

    loadProducts()
  }, [])

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('galleryCart', JSON.stringify(cartItems))
  }, [cartItems])

  // Save quantities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('galleryQuantities', JSON.stringify(quantities))
  }, [quantities])

  // Save current step to localStorage
  useEffect(() => {
    localStorage.setItem('galleryCurrentStep', currentStep)
  }, [currentStep])

  // Save selections to localStorage
  useEffect(() => {
    if (selectedPlace) localStorage.setItem('gallerySelectedPlace', JSON.stringify(selectedPlace))
  }, [selectedPlace])

  useEffect(() => {
    if (selectedBackground) localStorage.setItem('gallerySelectedBackground', JSON.stringify(selectedBackground))
  }, [selectedBackground])

  useEffect(() => {
    if (selectedLayout) localStorage.setItem('gallerySelectedLayout', JSON.stringify(selectedLayout))
  }, [selectedLayout])

  useEffect(() => {
    localStorage.setItem('galleryActiveVariants', JSON.stringify(activeVariants))
  }, [activeVariants])

  useEffect(() => {
    localStorage.setItem('gallerySelectedArtworks', JSON.stringify(selectedArtworks))
  }, [selectedArtworks])

  useEffect(() => {
    localStorage.setItem('gallerySelectedFrames', JSON.stringify(selectedFrames))
  }, [selectedFrames])

  useEffect(() => {
    localStorage.setItem('gallerySelectedFrames', JSON.stringify(selectedFrames))
  }, [selectedFrames])

  // Reset displayed count when active frame or filter changes
  useEffect(() => {
    setDisplayedArtworkCount(20)
  }, [activeFrameIndex, searchQuery, selectedColorFilters])

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!artworkScrollRef.current || isLoadingMore) return

    const container = artworkScrollRef.current
    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight

    // Load more when user scrolls to 80% of the content
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      const availableArtworks = activeFrameIndex !== null ? getArtworksForFrameSize(selectedLayout?.frames[activeFrameIndex]?.size) : []
      
      if (displayedArtworkCount < availableArtworks.length) {
        setIsLoadingMore(true)
        setTimeout(() => {
          setDisplayedArtworkCount(prev => Math.min(prev + 20, availableArtworks.length))
          setIsLoadingMore(false)
        }, 500)
      }
    }
  }, [isLoadingMore, displayedArtworkCount, activeFrameIndex, selectedLayout])

  // Add scroll listener
  useEffect(() => {
    const container = artworkScrollRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Function to toggle color filter
  const toggleColorFilter = (color) => {
    setSelectedColorFilters(prev => {
      if (prev.includes(color)) {
        return prev.filter(c => c !== color)
      } else {
        return [...prev, color]
      }
    })
  }

  // Function to filter artworks
  const getArtworksForFrameSize = (frameSize) => {
    let filtered = [...artworkProducts]

    console.log('Frame size requested:', frameSize)
    console.log('Total products:', artworkProducts.length)
    
    // Filter by size
    if (frameSize) {
      // Normalize the frame size (e.g., "50X70" -> "50x70")
      const normalizedFrameSize = frameSize.toLowerCase().replace(/[×\s]/gi, 'x').replace(/cm/gi, '')
      console.log('Normalized frame size:', normalizedFrameSize)
      
      // Extract dimensions
      const frameParts = normalizedFrameSize.split('x')
      const frameWidth = parseInt(frameParts[0])
      const frameHeight = parseInt(frameParts[1])
      
      console.log('Frame dimensions:', frameWidth, 'x', frameHeight)
      
      filtered = filtered.filter(artwork => {
        // Check if product has sizes array with actual values
        if (!artwork.sizes || !Array.isArray(artwork.sizes) || artwork.sizes.length === 0) {
          console.log(`Product "${artwork.title}" has no sizes array - SHOWING IT`)
          return true // Include products without size info (show for all frames)
        }
        
        // Check if sizes array has valid data
        const hasValidSizes = artwork.sizes.some(size => size && size.trim())
        if (!hasValidSizes) {
          console.log(`Product "${artwork.title}" has empty sizes - SHOWING IT`)
          return true // Include if sizes are empty/invalid
        }
        
        // Check each size in the product
        const hasMatchingSize = artwork.sizes.some(size => {
          const normalizedSize = size.toLowerCase().replace(/[×\s]/gi, 'x').replace(/cm/gi, '')
          const sizeParts = normalizedSize.split('x')
          
          if (sizeParts.length !== 2) return false
          
          const sizeWidth = parseInt(sizeParts[0])
          const sizeHeight = parseInt(sizeParts[1])
          
          if (isNaN(sizeWidth) || isNaN(sizeHeight)) return false
          
          // Match in either orientation
          const matches = (sizeWidth === frameWidth && sizeHeight === frameHeight) ||
                         (sizeWidth === frameHeight && sizeHeight === frameWidth)
          
          if (matches) {
            console.log(`Product "${artwork.title}" matches with size: ${size}`)
          }
          
          return matches
        })
        
        if (!hasMatchingSize) {
          console.log(`Product "${artwork.title}" sizes:`, artwork.sizes, `- doesn't match ${frameWidth}x${frameHeight} - SHOWING IT ANYWAY`)
          return true // Show all products regardless of size match for now
        }
        
        return hasMatchingSize
      })
      
      console.log('Filtered products count:', filtered.length)
    }

    // Determine frame orientation from activeFrame dimensions
    if (activeFrameIndex !== null && selectedLayout) {
      const activeFrame = selectedLayout.frames[activeFrameIndex]
      if (activeFrame) {
        // Parse width and height percentages to determine orientation
        const widthPercent = parseFloat(activeFrame.width)
        const heightPercent = parseFloat(activeFrame.height)
        
        let requiredOrientation = null
        
        // Determine orientation based on frame dimensions
        if (heightPercent > widthPercent * 1.2) {
          // Frame is portrait (taller than wide)
          requiredOrientation = 'portrait'
        } else if (widthPercent > heightPercent * 1.2) {
          // Frame is landscape (wider than tall)
          requiredOrientation = 'landscape'
        } else {
          // Frame is roughly square
          requiredOrientation = 'square'
        }

        // Filter by orientation tag
        if (requiredOrientation) {
          filtered = filtered.filter(artwork => {
            if (!artwork.tags || !Array.isArray(artwork.tags)) return true
            
            // Check if product has orientation tag matching required orientation
            const hasMatchingOrientation = artwork.tags.some(tag => 
              tag.toLowerCase() === requiredOrientation.toLowerCase()
            )
            
            // If no orientation tag found, include the artwork (backwards compatibility)
            const hasOrientationTag = artwork.tags.some(tag => 
              ['portrait', 'landscape', 'square'].includes(tag.toLowerCase())
            )
            
            return hasMatchingOrientation || !hasOrientationTag
          })
        }
      }
    }

    // Apply search query filter (searches in title, category, and tags)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(artwork => {
        const searchableText = `${artwork.title} ${artwork.category} ${artwork.tags?.join(' ')}`.toLowerCase()
        return searchableText.includes(query)
      })
    }

    // Apply color filters
    if (selectedColorFilters.length > 0) {
      filtered = filtered.filter(artwork => {
        return selectedColorFilters.some(colorFilter => {
          const hasColorTag = artwork.tags?.some(tag => 
            tag.toLowerCase().includes(colorFilter.toLowerCase())
          )
          const searchText = `${artwork.category} ${artwork.title}`.toLowerCase()
          const hasColorInText = searchText.includes(colorFilter.toLowerCase())
          return hasColorTag || hasColorInText
        })
      })
    }

    return filtered
  }

  // Color options for filter
  const colorOptions = [
    { name: 'Multi', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', value: 'multi' },
    { name: 'Red', color: '#DC2626', value: 'red' },
    { name: 'Orange', color: '#F97316', value: 'orange' },
    { name: 'Blue', color: '#2563EB', value: 'blue' },
    { name: 'Green', color: '#16A34A', value: 'green' },
    { name: 'Brown', color: '#92400E', value: 'brown' },
    { name: 'Yellow', color: '#EAB308', value: 'yellow' },
    { name: 'Beige', color: '#D4B896', value: 'beige' },
    { name: 'Grey', color: '#6B7280', value: 'grey' },
    { name: 'Black', color: '#000000', value: 'black' },
    { name: 'White', color: '#FFFFFF', value: 'white' },
    { name: 'Black and White', color: 'linear-gradient(90deg, #000 50%, #FFF 50%)', value: 'black and white' },
    { name: 'Silver', color: '#C0C0C0', value: 'silver' },
    { name: 'Gold', color: '#FFD700', value: 'gold' },
    { name: 'Copper', color: '#B87333', value: 'copper' },
    { name: 'Purple', color: '#9333EA', value: 'purple' },
    { name: 'Pink', color: '#EC4899', value: 'pink' },
    { name: 'Turquoise', color: '#14B8A6', value: 'turquoise' }
  ]

  // Frame style options
  const frameStyles = [
    { id: 'black', name: 'Black', color: '#000000', borderWidth: '8px', price: 15.00 },
    { id: 'white', name: 'White', color: '#FFFFFF', borderWidth: '8px', borderColor: '#E5E5E5', price: 15.00 },
    { id: 'oak', name: 'Oak', color: '#D4A574', borderWidth: '8px', price: 18.00 },
    { id: 'walnut', name: 'Walnut', color: '#5C4033', borderWidth: '8px', price: 18.00 },
    { id: 'silver', name: 'Silver', color: '#C0C0C0', borderWidth: '8px', price: 20.00 },
    { id: 'gold', name: 'Gold', color: '#D4AF37', borderWidth: '8px', price: 20.00 }
  ]

  // Calculate total price
  const calculateTotalPrice = () => {
    let total = 0
    
    // Add artwork prices with quantities
    Object.entries(selectedArtworks).forEach(([frameIdx, artwork]) => {
      const quantity = quantities.artworks[frameIdx] || 1
      total += (parseFloat(artwork.price) || 0) * quantity
    })
    
    // Add frame prices with quantities
    Object.entries(selectedFrames).forEach(([frameIdx, frame]) => {
      const quantity = quantities.frames[frameIdx] || 1
      total += (parseFloat(frame.price) || 0) * quantity
    })
    
    return total.toFixed(2)
  }

  // Handle quantity change
  const handleQuantityChange = (type, frameIdx, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [frameIdx]: parseInt(newQuantity)
      }
    }))
  }

  // Handle Add to Cart
  const handleAddToCart = () => {
    setCartItems({
      artworks: { ...selectedArtworks },
      frames: { ...selectedFrames }
    })
    
    // Initialize quantities for new cart items if not already set
    const newQuantities = { ...quantities }
    Object.keys(selectedArtworks).forEach(frameIdx => {
      if (!newQuantities.artworks[frameIdx]) {
        newQuantities.artworks[frameIdx] = 1
      }
    })
    Object.keys(selectedFrames).forEach(frameIdx => {
      if (!newQuantities.frames[frameIdx]) {
        newQuantities.frames[frameIdx] = 1
      }
    })
    setQuantities(newQuantities)
    
    setShowCart(true)
  }

  // Calculate cart total price
  const calculateCartTotal = () => {
    let total = 0
    
    // Add artwork prices from cart with quantities
    if (cartItems.artworks && typeof cartItems.artworks === 'object') {
      Object.entries(cartItems.artworks).forEach(([frameIdx, artwork]) => {
        const quantity = quantities.artworks?.[frameIdx] || 1
        const price = parseFloat(artwork.price) || 0
        total += price * quantity
      })
    }
    
    // Add frame prices from cart with quantities
    if (cartItems.frames && typeof cartItems.frames === 'object') {
      Object.entries(cartItems.frames).forEach(([frameIdx, frame]) => {
        const quantity = quantities.frames?.[frameIdx] || 1
        const price = parseFloat(frame.price) || 0
        total += price * quantity
      })
    }
    
    return total.toFixed(2)
  }

  // Handle Checkout - Redirect to Shopify Checkout
  const handleCheckout = async () => {
    alert("Checkout button clicked! Function is running...");
    console.log("=== CHECKOUT FUNCTION CALLED ===");
    console.log("Cart items:", cartItems);
    console.log("Quantities:", quantities);
    try {
      // Prepare line items from cart
      const lineItems = []
      
      // Add artworks to line items with quantities
      Object.entries(cartItems.artworks).forEach(([frameIdx, artwork]) => {
        console.log('Processing artwork for checkout:', artwork)
        // Use the first available variant ID from the artwork
        const variantId = artwork.variants?.[0]?.id || artwork.shopifyProductId
        const quantity = quantities.artworks?.[frameIdx] || 1
        console.log('Variant ID:', variantId, 'Quantity:', quantity)
        if (variantId) {
          lineItems.push({
            variantId: variantId,
            quantity: quantity
          })
        }
      })
      
      console.log('Line items prepared:', lineItems)
      
      // Note: Frames need to be actual Shopify products to be added to checkout
      // If frames are separate products in your Shopify store, you need to:
      // 1. Fetch frame products and match them by name/style
      // 2. Add frame variant IDs to the lineItems array
      // For now, frames are handled as custom data and won't be in Shopify checkout
      // You'll need to create frame products in Shopify with variants for each style
      
      if (lineItems.length === 0) {
        alert('Please add items to cart before checkout')
        return
      }
      
      // Create checkout in Shopify
      console.log('Creating checkout with line items:', lineItems)
      const checkout = await createCheckout(lineItems)
      console.log('Checkout response:', checkout)
      
      // Redirect to Shopify checkout page
      if (checkout?.webUrl) {
        window.location.href = checkout.webUrl
      } else {
        throw new Error('Could not get checkout URL')
      }
    } catch (error) {
      console.error('Checkout error details:', error)
      alert(`Failed to create checkout: ${error.message}`)
    }
  }

  // Room/Place Categories
  const placeCategories = [
    {
      id: "living-room",
      name: "Living Room",
      image: "PLACEHOLDER_IMAGE_URL_1",
      description: "Modern and cozy living spaces"
    },
    {
      id: "bedroom",
      name: "Bedroom",
      image: "PLACEHOLDER_IMAGE_URL_2",
      description: "Relaxing bedroom environments"
    },
    {
      
      id: "dining-room",
      name: "Dining Room",
      image: "PLACEHOLDER_IMAGE_URL_3",
      description: "Elegant dining areas"
    },
    {
      id: "home-office",
      name: "Home Office",
      image: "PLACEHOLDER_IMAGE_URL_4",
      description: "Productive workspace settings"
    },
    {
      id: "hallway",
      name: "Hallway",
      image: "PLACEHOLDER_IMAGE_URL_5",
      description: "Welcoming entrance spaces"
    },
    {
      id: "kids-room",
      name: "Kids Room",
      image: "PLACEHOLDER_IMAGE_URL_6",
      description: "Fun and playful children's rooms"
    }
  ]

  const layoutOptions = [
    {
      id: 1,
      name: "Two 50x70",
      image: "https://gwt.desenio.co.uk/walls/2-50x70.png",
      frames: [
        { width: "14%", height: "35%", size: "50X70", top: "20%", left: "36%" },
         { width: "14%", height: "35%", size: "50X70", top: "20%", right: "36%" }
      ]
    },
    {
      id: 2,
      name: "Two 70x100",
      image: "https://gwt.desenio.co.uk/walls/2-70x100.png",
      frames: [
        { width: "12%", height: "31%", size: "70x100", top: "20%", left: "36%" },
        { width: "12%", height: "31%", size: "70x100", top: "20%", right: "36%" }
      ]
    },
    {
      id: 3,
      name: "Three 50x70",
      image: "https://gwt.desenio.co.uk/walls/3-50x70.png",
      frames: [
        { width: "13%", height: "31.5%", size: "50x70", top: "25%", left: "30%" },
        { width: "13%", height: "31.5%", size: "50x70", top: "25%", left: "50%", transform: "translateX(-50%)" },
        { width: "13%", height: "31.5%", size: "50x70", top: "25%", right: "30%" }
      ]
    },
    {
      id: 4,
      name: "Center 70x100 + Sides",
      image: "https://gwt.desenio.co.uk/walls/3-mixed.png",
      frames: [
        { width: "10.5%", height: "26.25%", size: "50x75", top: "25%", left: "33%" },
        { width: "14%", height: "35.625%", size: "70x100", top: "20%", left: "50%", transform: "translateX(-50%)" },
        { width: "10.5%", height: "26.25%", size: "50x75", top: "25%", right: "33%", }
      ]
    },
    {
      id: 5,
      name: "Four 30x40 Grid",
      image: "https://gwt.desenio.co.uk/walls/4-30x40.png",
      frames: [
        { width: "10.5%", height: "25%", size: "30x40", top: "15%", left: "40%" },
        { width: "10.5%", height: "25%", size: "30x40", top: "15%", right: "40%" },
        { width: "10.5%", height: "25%", size: "30x40", bottom: "30%", left: "40%" },
        { width: "10.5%", height: "25%", size: "30x40", bottom: "30%", right: "40%" }
      ]
    },
    {
      id: 6,
      name: "Four Row Mix",
      image: "https://gwt.desenio.co.uk/walls/4-mixed.png",
      frames: [
        { width: "8.4%", height: "20%", size: "30x40", top: "26%", left: "31%" },
        { width: "10.5%", height: "26.25%", size: "50x75", top: "23%", left: "40%" },
        { width: "10.5%", height: "26.25%", size: "50x75", top: "23%", right: "40%" },
        { width: "8.4%", height: "20%", size: "30x40", top: "26%", right: "31%" }
      ]
    },
    {
      id: 7,
      name: "Gallery Wall Mix",
      image: "https://gwt.desenio.co.uk/walls/4-mixed-2.png",
      frames: [
       // TOP LEFT — 50x70 (HORIZONTAL)
  {
    width: "15.4%",
    height: "12%",
    size: "50x70",
    top: "8%",
    left: "35%"
  },

  // RIGHT — 70x100 (VERTICAL)
  {
    width: "16.8%",
    height: "42.5%",
    size: "70x100",
    top: "12%",
    left: "50%"
  },

  // BOTTOM LEFT — 30x40 (VERTICAL)
  {
    width: "8.4%",
    height: "20%",
    size: "30x40",
    top: "30%",
    left: "30%"
  },

  // BOTTOM CENTER — 50x70 (VERTICAL)
  {
    width: "11.2%",
    height: "28.125%",
    size: "50x70",
    top: "30%",
    left: "38.7%"
  }
      ]
    },
    {
      id: 8,
      name: "Asymmetric Collection",
      image: "https://gwt.desenio.co.uk/walls/4-mixed-3.png",
      frames: [
        // LEFT — 50x70 (vertical big)
  {
    width: "12.6%",
    height: "31.5%",
    size: "50x70",
    top: "12%",
    left: "37%"
  },

  // RIGHT — 50x50 (square, top right)
  {
    width: "11.2%",
    height: "20%",
    size: "50x50",
    top: "12%",
    left: "49%"
  },

  // RIGHT — 30x40 (vertical, below the square)
  {
    width: "8.4%",
    height: "20%",
    size: "30x40",
    top: "34%",
    left: "49%"
  },

  // RIGHT — 13x18 (small vertical, to the right of 30x40)
  {
    width: "5.6%",
    height: "14%",
    size: "13x18",
    top: "34%",
    left: "57%"
  }
      ]
    },
    {
      id: 9,
      name: "Large Center + Corners",
      image: "https://gwt.desenio.co.uk/walls/5-mixed.png",
      frames: [
        // LEFT — small 21x30 (slightly left of the two 30x40s)
  {
    width: "6.3%",
    height: "15.75%",
    size: "21x30",
    top: "25%",
    left: "27.2%"
  },

  // LEFT TOP — 30x40 (top of the left stack)
  {
    width: "8.4%",
    height: "20%",
    size: "30x40",
    top: "11%",
    left: "33.5%"
  },

  // LEFT BOTTOM — 30x40 (below the first 30x40)
  {
    width: "8.4%",
    height: "20%",
    size: "30x40",
    top: "33%",
    left: "33.5%"
  },

  // CENTER — 70x100 (big center piece)
  {
    width: "18.2%",
    height: "46.25%",
    size: "70x100",
    top: "8%",
    left: "50%",
    transform: "translateX(-50%)"
  },

  // RIGHT — 50x70 (single piece on the right)
  {
    width: "12.6%",
    height: "31.5%",
    size: "50x70",
    top: "16%",
    right: "29.8%"
  }
      ]
    },
    {
      id: 10,
      name: "Creative Cluster",
      image: "https://gwt.desenio.co.uk/walls/large-wall.png",
      frames: [
     // LEFT — 40x50 (top left)
{
  width: "9.8%",
  height: "21.875%",
  size: "40x50",
  top: "8%",
  left: "31.5%"
},

// LEFT — 50x70 (under the 40x50)
{
  width: "11.2%",
  height: "28.125%",
  size: "50x70",
  top: "32%",
  left: "30.22%"
},

// CENTER — 70x100 (big)
{
  width: "19.6%",
  height: "45%",
  size: "70x100",
  top: "6%",
  left: "50%",
  transform: "translateX(-50%)"
},

// RIGHT TOP — 50x70 (top right)
{
  width: "12.6%",
  height: "31.5%",
  size: "50x70",
  top: "6%",
  right: "29%"
},

// RIGHT MID — 40x50
{
  width: "9.8%",
  height: "21.875%",
  size: "40x50",
  top: "39.5%",
  right: "31.5%"
},

// RIGHT MID — 30x40 **horizontal**
{
  width: "11.2%",
  height: "15%",
  size: "30x40",
  top: "39.5%",
  right: "21%"
},

// BOTTOM LEFT OF CENTER — 30x40 **horizontal**
{
  width: "12.6%",
  height: "15%",
  size: "30x40",
  top: "54%",
  left: "42%"
},

// BOTTOM CENTER — 21x30 **horizontal**
{
  width: "5.25%",
  height: "15%",
  size: "21x30",
  top: "54%",
  left: "56%",
  transform: "translateX(-50%)"
}
      ]
    }
  ]

  const backgroundOptions = [
    { 
      section: "Modern Living Room",
      variants: [
        { id: "bg-1-white", name: "White Wall", color: "#FFFFFF", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/4-grey.jpg" },
        { id: "bg-1-grey", name: "Grey Wall", color: "#E8E8E8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/4-white.jpg" },
        { id: "bg-1-blue", name: "Blue Wall", color: "#87CEEB", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/4-blue.jpg" },
        { id: "bg-1-sage", name: "Sage Wall", color: "#98D8C8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/4-green.jpg" },
        { id: "bg-1-pink", name: "Pink Wall", color: "#F5C0C0", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/4-pink.jpg" }
      ]
    },
    { 
      section: "Contemporary Space",
      variants: [
        { id: "bg-2-white", name: "White Minimal", color: "#FFFFFF", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/5-grey.jpg" },
        { id: "bg-2-grey", name: "Grey Minimal", color: "#E8E8E8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/5-white.jpg" },
        { id: "bg-2-blue", name: "Blue Minimal", color: "#87CEEB", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/5-blue.jpg" },
        { id: "bg-2-sage", name: "Sage Minimal", color: "#98D8C8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/5-pink.jpg" },
      ]
    },
    { 
      section: "Cozy Corner",
      variants: [
        { id: "bg-3-white", name: "White Cozy", color: "#FFFFFF", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/6-grey.jpg" },
        { id: "bg-3-grey", name: "Grey Cozy", color: "#E8E8E8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/6-blue.jpg" },
      ]
    },
    { 
      section: "Scandinavian Style",
      variants: [
        { id: "bg-4-grey", name: "Grey Nordic", color: "#E8E8E8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/7-grey.jpg" },
        { id: "bg-4-blue", name: "Blue Nordic", color: "#87CEEB", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/7-blue.jpg" },
        { id: "bg-4-pink", name: "Pink Nordic", color: "#F5C0C0", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/7-pink.jpg" }
      ]
    },
    { 
      section: "Urban Loft",
      variants: [
        { id: "bg-5-white", name: "White Industrial", color: "#FFFFFF", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/8-white.jpg" },
        { id: "bg-5-grey", name: "Grey Industrial", color: "#E8E8E8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/8-grey.jpg" },
        { id: "bg-5-blue", name: "Blue Industrial", color: "#87CEEB", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/8-blue.jpg" },
        { id: "bg-5-pink", name: "Pink Industrial", color: "#F5C0C0", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/8-pink.jpg" }
      ]
    },
    { 
      section: "Classic Elegance",
      variants: [
        { id: "bg-6-white", name: "White Classic", color: "#FFFFFF", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/9-white.jpg" },
        { id: "bg-6-grey", name: "Grey Classic", color: "#E8E8E8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/9-grey.jpg" },
        { id: "bg-6-blue", name: "Blue Classic", color: "#87CEEB", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/9-green.jpg" },
      ]
    },
    { 
      section: "Minimalist Studio",
      variants: [
        { id: "bg-7-grey", name: "Grey Studio", color: "#E8E8E8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/10-grey.jpg" },
        { id: "bg-7-blue", name: "Blue Studio", color: "#87CEEB", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/10-blue.jpg" },
        { id: "bg-7-sage", name: "Sage Studio", color: "#98D8C8", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/10-dark.jpg" },
        { id: "bg-7-pink", name: "Pink Studio", color: "#F5C0C0", image: "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/10-green.jpg" }
      ]
    }
  ]

  // Intro page (original)
  if (currentStep === "intro") {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-72 bg-white border-r border-gray-300 px-6 py-8 flex flex-col">
          {/* Logo */}
          <h1 className="text-4xl font-bold tracking-tight mb-6 text-center">DESENIO</h1>

          {/* Steps Container */}
          <div className="flex-1 flex flex-col justify-start pt-4 space-y-8">
            {/* Step 1 - NEW: Select Place */}
            <div className="text-center cursor-pointer transition-all duration-200 py-3 group">
              {/* House/Room icon */}
              <div className="flex justify-center mb-4">
                <div className="relative w-10 h-10">
                  <div className="w-8 h-6 border-2 border-b-0 border-black group-hover:border-gray-400 transition-colors"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[12px] border-b-black group-hover:border-b-gray-400 transition-colors"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-black group-hover:bg-gray-400 transition-colors"></div>
                </div>
              </div>
              <p className="text-sm font-semibold mb-1 text-black group-hover:text-gray-400 transition-colors">1</p>
              <p className="text-xs font-semibold tracking-wide text-black group-hover:text-gray-400 transition-colors">SELECT PLACE</p>
            </div>

            {/* Step 2 - Background */}
            <div className="text-center cursor-pointer transition-all duration-200 py-3 group">
              {/* Overlapping frames icon */}
              <div className="flex justify-center mb-4">
                <div className="relative w-10 h-10">
                  {/* Back frame */}
                  <div className="absolute top-0 right-0 w-7 h-9 border-2 border-black group-hover:border-gray-400 bg-white transition-colors transform rotate-6"></div>
                  {/* Front frame */}
                  <div className="absolute top-1 left-0 w-7 h-9 border-2 border-black group-hover:border-gray-400 bg-white transition-colors">
                    {/* Small image representation inside frame */}
                    <div className="absolute inset-2 bg-black group-hover:bg-gray-400 transition-colors"></div>
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold mb-1 text-black group-hover:text-gray-400 transition-colors">2</p>
              <p className="text-xs font-semibold tracking-wide text-black group-hover:text-gray-400 transition-colors">SELECT BACKGROUND</p>
            </div>

            {/* Step 3 - Picture Wall */}
            <div className="text-center cursor-pointer transition-all duration-200 py-3 group">
              {/* Picture wall layout icon */}
              <div className="flex justify-center mb-4">
                <div className="flex gap-1 items-start">
                  {/* Large rectangle on left */}
                  <div className="w-5 h-8 bg-black group-hover:bg-gray-400 transition-colors"></div>
                  {/* Two smaller rectangles stacked on right */}
                  <div className="flex flex-col gap-1">
                    <div className="w-2 h-3.5 bg-black group-hover:bg-gray-400 transition-colors"></div>
                    <div className="w-2 h-3.5 bg-black group-hover:bg-gray-400 transition-colors"></div>
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold mb-1 text-black group-hover:text-gray-400 transition-colors">3</p>
              <p className="text-xs font-semibold tracking-wide text-black group-hover:text-gray-400 transition-colors">SELECT PICTURE WALL</p>
            </div>

            {/* Step 4 - Design */}
            <div className="text-center cursor-pointer transition-all duration-200 py-3 group">
              {/* Tall rectangle with circle icon */}
              <div className="flex justify-center mb-4">
                <div className="relative w-6 h-9 border-2 border-black group-hover:border-gray-400 flex items-center justify-center transition-colors">
                  <div className="w-2 h-2 bg-black group-hover:bg-gray-400 rounded-full transition-colors"></div>
                </div>
              </div>
              <p className="text-sm font-semibold mb-1 text-black group-hover:text-gray-400 transition-colors">4</p>
              <p className="text-xs font-semibold tracking-wide text-black group-hover:text-gray-400 transition-colors">SELECT DESIGN</p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-auto space-y-6">
            {/* Price */}
            <div>
              <p className="text-3xl font-bold text-center">£ 0</p>
            </div>

            {/* Add to Basket Button */}
            <button className="w-full bg-black text-white py-3 font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95">
              ADD TO <span>🛍️</span>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <div className="bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105">
                ▼ SAVED GALLERY WALLS
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105">
                📋 SAVE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105">
                🔗 SHARE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105">
                ■ CREATE NEW
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Cart Icon with Badge */}
              <div className="relative">
                <button
                  onClick={() => setShowCart(!showCart)}
                  className="relative cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                    {Object.keys(cartItems.artworks).length + Object.keys(cartItems.frames).length}
                  </span>
                </button>

                {/* Cart Dropdown - shown when items exist */}
                {showCart && (Object.keys(cartItems.artworks).length > 0 || Object.keys(cartItems.frames).length > 0) && (
                  <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-gray-200 shadow-2xl z-50 max-h-[600px] flex flex-col">
                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* Artwork Items */}
                      {Object.entries(selectedArtworks).map(([frameIdx, artwork]) => (
                        <div key={`artwork-${frameIdx}`} className="flex gap-3 pb-4 border-b border-gray-200">
                          <div className="w-20 h-28 flex-shrink-0 border border-gray-200">
                            <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 flex flex-col">
                            <h3 className="font-medium text-sm mb-1">{artwork.title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-red-600 font-bold text-base">£ {artwork.price}</span>
                            </div>
                            <select 
                              value={quantities.artworks[frameIdx] || 1}
                              onChange={(e) => handleQuantityChange('artworks', frameIdx, e.target.value)}
                              className="w-16 px-2 py-1 border border-gray-300 text-sm text-center cursor-pointer"
                            >
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                              <option value="7">7</option>
                              <option value="8">8</option>
                              <option value="9">9</option>
                              <option value="10">10</option>
                            </select>
                          </div>
                          <button onClick={() => { const newArtworks = { ...selectedArtworks }; delete newArtworks[frameIdx]; setSelectedArtworks(newArtworks); }} className="text-gray-400 hover:text-black transition-colors cursor-pointer">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      {/* Frame Items */}
                      {Object.entries(selectedFrames).map(([frameIdx, frame]) => {
                        const artwork = selectedArtworks[frameIdx];
                        if (!artwork) return null;
                        return (
                          <div key={`frame-${frameIdx}`} className="flex gap-3 pb-4 border-b border-gray-200">
                            <div className="w-20 h-28 flex-shrink-0" style={{ padding: '3px', backgroundColor: frame.color, border: frame.borderColor ? `1px solid ${frame.borderColor}` : 'none' }}>
                              <div className="w-full h-full bg-white"><img src={artwork.image} alt={`${frame.name} frame`} className="w-full h-full object-cover" /></div>
                            </div>
                            <div className="flex-1 flex flex-col">
                              <h3 className="font-medium text-sm mb-1">{frame.name} picture frame</h3>
                              <div className="flex items-center gap-2 mb-2"><span className="text-red-600 font-bold text-base">£ {frame.price.toFixed(2)}</span></div>
                              <select 
                                value={quantities.frames[frameIdx] || 1}
                                onChange={(e) => handleQuantityChange('frames', frameIdx, e.target.value)}
                                className="w-16 px-2 py-1 border border-gray-300 text-sm text-center cursor-pointer"
                              >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                              </select>
                            </div>
                            <button onClick={() => { const newFrames = { ...selectedFrames }; delete newFrames[frameIdx]; setSelectedFrames(newFrames); }} className="text-gray-400 hover:text-black transition-colors cursor-pointer">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    {/* Total and Checkout */}
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold">TOTAL AMOUNT</span>
                        <span className="text-lg font-bold">£{calculateCartTotal()}</span>
                      </div>
                      <button onClick={handleCheckout} className="w-full bg-black text-white py-3 font-bold text-sm tracking-wider hover:bg-gray-800 transition-all duration-200 cursor-pointer">CHECKOUT</button>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={handleCheckout} className="bg-black text-white px-6 py-2 font-bold text-xs tracking-wider hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                CHECKOUT £{calculateCartTotal()}
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="bg-white px-6 py-2 text-xs text-gray-500 border-b border-gray-300">
            WALL ART / INSPIRATION / <span className="text-gray-700 font-semibold">CREATE YOUR GALLERY WALL</span>
          </div>

          {/* Hero Section */}
          <div
            className="flex-1 relative bg-cover bg-center"
            style={{
              backgroundImage: "url(https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/welcome-bg.jpg?v=1)",
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-8">
              {/* Dark Box Container */}
              <div className="bg-black/70 backdrop-blur-sm px-20 py-16 max-w-3xl">
                <p className="text-xs tracking-[0.3em] mb-6 text-gray-300 font-light">STEP-BY-STEP</p>
                <h2 className="text-5xl font-serif italic mb-8 text-white font-light leading-tight">
                  Create the perfect gallery wall
                </h2>
                <p className="text-base mb-12 text-gray-200 font-light leading-relaxed">
                  Use our new tool to find designs and frames that match each other
                </p>
                <button
                  onClick={() => setCurrentStep("step1")}
                  className="bg-white text-black px-12 py-4 font-bold text-sm tracking-widest hover:bg-gray-100 border-2 border-white hover:border-black transition-all duration-300 cursor-pointer"
                >
                  START HERE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 1: Select Place/Room Category
  if (currentStep === "step1") {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-300 flex flex-col">
          {/* Logo - Fixed at top */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold tracking-tight text-center">DESENIO</h1>
          </div>

          {/* Step Header with Close Button - Fixed */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <p className="text-sm font-semibold tracking-wide">1. SELECT PLACE</p>
            <button
              onClick={() => setCurrentStep("intro")}
              className="text-2xl font-light text-gray-600 hover:text-black transition-colors cursor-pointer leading-none"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Place Options */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              {placeCategories.map((place) => (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className={`relative cursor-pointer transition-all duration-300 group ${
                    selectedPlace?.id === place.id 
                      ? 'ring-2 ring-black ring-offset-2' 
                      : 'hover:shadow-lg'
                  }`}
                >
                  {/* Place Image */}
                  <div className="relative h-40 bg-gray-200 overflow-hidden">
                    <img 
                      src={place.image} 
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    />
                    {selectedPlace?.id === place.id && (
                      <div className="absolute top-3 left-3 bg-black text-white rounded w-8 h-8 flex items-center justify-center">
                        <span className="text-lg font-bold">✓</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Place Info */}
                  <div className="p-4 bg-white border border-t-0 border-gray-200">
                    <h3 className="text-base font-bold text-black mb-1">{place.name}</h3>
                    <p className="text-xs text-gray-600">{place.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button - Fixed at bottom */}
          <div className="px-6 py-4 border-t border-gray-200">
            <button 
              disabled={!selectedPlace}
              onClick={() => selectedPlace && setCurrentStep("step2")}
              className="w-full bg-black text-white py-4 font-bold text-sm tracking-widest hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
            >
              NEXT
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <div className="bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ▼ SAVED GALLERY WALLS
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                📋 SAVE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                🔗 SHARE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ■ CREATE NEW
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">{Object.keys(cartItems.artworks).length + Object.keys(cartItems.frames).length}</span>
                <span className="text-lg">🛍️</span>
              </div>
              <button onClick={handleCheckout} className="bg-black text-white px-6 py-2 font-bold text-xs tracking-wider hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                CHECKOUT £{calculateCartTotal()}
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="bg-white px-6 py-2 text-xs text-gray-500 border-b border-gray-300">
            WALL ART / INSPIRATION / <span className="text-gray-700 font-semibold">CREATE YOUR GALLERY WALL</span>
          </div>

          {/* Main Display - Show selected place or default */}
          <div
            className="flex-1 relative bg-cover bg-center"
            style={{
              backgroundImage: selectedPlace 
                ? `url(${selectedPlace.image})` 
                : "url(https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/welcome-bg.jpg?v=1)",
            }}
          >
            {!selectedPlace && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm px-12 py-8 rounded-lg shadow-xl">
                  <p className="text-2xl font-light text-gray-700 text-center">
                    Select a place to continue
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Select Background
  if (currentStep === "step2") {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-70 bg-white border-r border-gray-300 flex flex-col">
          {/* Logo - Fixed at top */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold tracking-tight text-center">DESENIO</h1>
          </div>

          {/* Step Header with Close Button - Fixed */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <p className="text-sm font-semibold tracking-wide">2. SELECT BACKGROUND</p>
            <button
              onClick={() => setCurrentStep("intro")}
              className="text-2xl font-light text-gray-600 hover:text-black transition-colors cursor-pointer leading-none"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Background Options */}
          <div className="flex-1 overflow-y-auto px-3 py-6">
            <div className="space-y-6">
              {backgroundOptions.map((section, sectionIdx) => {
                const activeVariant = activeVariants[sectionIdx] || section.variants[0]
                
                return (
                  <div key={sectionIdx}>
                    {/* Background Image */}
                    <div
                      className={`relative w-full aspect-[16/9] bg-cover bg-center transition-all duration-300 cursor-pointer ${
                        selectedBackground?.id === activeVariant.id 
                          ? 'ring-2 ring-black ring-offset-2' 
                          : 'hover:opacity-90'
                      }`}
                      style={{
                        backgroundImage: `url(${activeVariant.image})`
                      }}
                      onClick={() => {
                        setExpandedSection(expandedSection === sectionIdx ? null : sectionIdx)
                        setSelectedBackground(activeVariant)
                      }}
                    >
                      {selectedBackground?.id === activeVariant.id && (
                        <div className="absolute top-3 left-3 bg-black text-white rounded w-8 h-8 flex items-center justify-center">
                          <span className="text-lg font-bold">✓</span>
                        </div>
                      )}
                    </div>

                    {/* Color Swatches - Show only when section is expanded */}
                    {expandedSection === sectionIdx && (
                      <div className="flex gap-2 mt-3 animate-fadeIn">
                        {section.variants.map((variant) => (
                          <div
                            key={variant.id}
                            className={`w-10 h-10 border-2 cursor-pointer transition-all duration-200 ${
                              activeVariant.id === variant.id 
                                ? 'border-black scale-110' 
                                : 'border-gray-300 hover:border-gray-600'
                            }`}
                            style={{ backgroundColor: variant.color }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveVariants({ ...activeVariants, [sectionIdx]: variant })
                              setSelectedBackground(variant)
                            }}
                            title={variant.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation Buttons - Fixed at bottom */}
          <div className="px-6 py-4 border-t border-gray-200 space-y-3">
            <button 
              disabled={!selectedBackground}
              onClick={() => selectedBackground && setCurrentStep("step3")}
              className="w-full bg-black text-white py-4 font-bold text-sm tracking-widest hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
            >
              NEXT
            </button>
            <button 
              onClick={() => setCurrentStep("step1")}
              className="w-full bg-white text-black py-3 font-bold text-sm tracking-wide border-2 border-black hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              PREVIOUS
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <div className="bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ▼ SAVED GALLERY WALLS
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                📋 SAVE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                🔗 SHARE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ■ CREATE NEW
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">{Object.keys(cartItems.artworks).length + Object.keys(cartItems.frames).length}</span>
                <span className="text-lg">🛍️</span>
              </div>
              <button onClick={handleCheckout} className="bg-black text-white px-6 py-2 font-bold text-xs tracking-wider hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                CHECKOUT £{calculateCartTotal()}
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="bg-white px-6 py-2 text-xs text-gray-500 border-b border-gray-300">
            WALL ART / INSPIRATION / <span className="text-gray-700 font-semibold">CREATE YOUR GALLERY WALL</span>
          </div>

          {/* Main Background Display */}
          <div
            className="flex-1 relative bg-cover bg-center transition-all duration-500"
            style={{
              backgroundImage: selectedBackground 
                ? `url(${selectedBackground.image})` 
                : "url(https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/welcome-bg.jpg?v=1)",
            }}
          >
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Select Picture Wall Layout
  if (currentStep === "step3") {
    return (
      <div className="h-screen bg-white flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-300 flex flex-col">
          {/* Logo - Fixed at top */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold tracking-tight text-center">DESENIO</h1>
          </div>

          {/* Step Header with Close Button - Fixed */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <p className="text-sm font-semibold tracking-wide">3. SELECT PICTURE WALL</p>
            <button
              onClick={() => setCurrentStep("intro")}
              className="text-2xl font-light text-gray-600 hover:text-black transition-colors cursor-pointer leading-none"
            >
              ✕
            </button>
          </div>

          {/* Scrollable Layout Options */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6 mb-6">
            {layoutOptions.map((layout) => (
              <div
                key={layout.id}
                onClick={() => {
                  // Check if user has already selected artworks
                  const hasSelectedArtworks = Object.keys(selectedArtworks).length > 0
                  
                  console.log('Layout clicked:', layout.id)
                  console.log('Has artworks:', hasSelectedArtworks)
                  console.log('Current layout:', selectedLayout?.id)
                  console.log('Different layout?', selectedLayout?.id !== layout.id)
                  
                  // If changing to a different layout and artworks are selected, show confirmation
                  if (hasSelectedArtworks && selectedLayout?.id !== layout.id) {
                    console.log('Showing modal')
                    setPendingLayout(layout)
                    setShowLayoutChangeModal(true)
                  } else {
                    // No artworks selected or same layout, just set it
                    console.log('Setting layout directly')
                    setSelectedLayout(layout)
                  }
                }}
                className="relative cursor-pointer transition-all duration-200 group hover:shadow-lg"
              >
                {/* Layout Preview */}
                <div className="relative h-48 bg-white group-hover:bg-gray-50">
                  {layout.image ? (
                    /* Image-based preview */
                    <img 
                      src={layout.image} 
                      alt={layout.name}
                      className="w-full h-full object-contain transition-all duration-200 group-hover:opacity-80 cursor-pointer"
                    />
                  ) : (
                    /* Fallback to frame boxes */
                    layout.frames.map((frame, idx) => (
                      <div
                        key={idx}
                        className={`absolute bg-gray-300 border border-gray-400 flex items-center justify-center transition-all duration-200 ${
                          selectedLayout?.id === layout.id ? 'border-black border-2' : 'group-hover:border-gray-600 group-hover:bg-gray-400'
                        }`}
                        style={{
                          width: `${parseInt(frame.width) / 3.5}px`,
                          height: `${parseInt(frame.height) / 3.5}px`,
                          top: frame.top ? `${parseInt(frame.top) / 1.8}%` : undefined,
                          bottom: frame.bottom ? `${parseInt(frame.bottom) / 1.8}%` : undefined,
                          left: frame.left ? `${parseInt(frame.left) / 1.8}%` : undefined,
                          right: frame.right ? `${parseInt(frame.right) / 1.8}%` : undefined,
                          transform: frame.transform
                        }}
                      >
                        <div className="text-[9px] text-gray-600 font-semibold">
                          {frame.size}
                        </div>
                      </div>
                    ))
                  )}
                  
                  {/* Selected Indicator */}
                  {selectedLayout?.id === layout.id && (
                    <div className="absolute top-2 left-2 bg-black text-white rounded w-6 h-6 flex items-center justify-center">
                      <span className="text-xs font-bold">✓</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 space-y-3">
            <button 
              disabled={!selectedLayout}
              onClick={() => selectedLayout && setCurrentStep("step4")}
              className="w-full bg-black text-white py-3 font-bold text-sm tracking-wide hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
            >
              NEXT
            </button>
            <button 
              onClick={() => setCurrentStep("step2")}
              className="w-full bg-white text-black py-3 font-bold text-sm tracking-wide border-2 border-black hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              PREVIOUS
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <div className="bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ▼ SAVED GALLERY WALLS
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                💾 SAVE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ↗ SHARE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ■ CREATE NEW
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">{Object.keys(cartItems.artworks).length + Object.keys(cartItems.frames).length}</span>
                <span className="text-lg">🛍️</span>
              </div>
              <button onClick={handleCheckout} className="bg-black text-white px-6 py-2 font-bold text-xs tracking-wider hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                CHECKOUT £{calculateCartTotal()}
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="bg-white px-6 py-2 text-xs text-gray-400 border-b border-gray-300">
            WALL ART / INSPIRATION / <span className="text-gray-700 font-semibold">CREATE YOUR GALLERY WALL</span>
          </div>

          {/* Main Canvas with Background and Frames */}
          <div
            className="flex-1 relative bg-cover bg-center transition-all duration-500 overflow-hidden"
            style={{
              backgroundImage: selectedBackground 
                ? `url(${selectedBackground.image})` 
                : "url(https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/welcome-bg.jpg?v=1)",
            }}
          >
            <div className="absolute inset-0">
              {/* Frame Placeholders - Only show when layout is selected */}
              {selectedLayout && selectedLayout.frames.map((frame, idx) => (
              <div
                key={idx}
                className="absolute bg-gray-300 border-2 border-gray-400 flex items-center justify-center transition-all duration-300"
                style={{
                  width: frame.width,
                  height: frame.height,
                  top: frame.top,
                  bottom: frame.bottom,
                  left: frame.left,
                  right: frame.right,
                  transform: frame.transform
                }}
              >
                <span className="text-gray-600 font-semibold text-sm">
                  {frame.size}
                </span>
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* Confirmation Modal for Layout Change */}
        {showLayoutChangeModal && (
          <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white p-8 max-w-md w-full mx-4 relative shadow-2xl border border-gray-200">
              {/* Close button */}
              <button
                onClick={() => {
                  setShowLayoutChangeModal(false)
                  setPendingLayout(null)
                }}
                className="absolute top-4 right-4 text-2xl font-light text-gray-600 hover:text-black transition-colors cursor-pointer leading-none"
              >
                ✕
              </button>

              {/* Modal Content */}
              <h2 className="text-xl font-bold text-center mb-6 tracking-wide">
                WOULD YOU LIKE TO CONTINUE?
              </h2>
              
              <p className="text-center text-gray-600 mb-8 leading-relaxed">
                YOU HAVE MADE CHANGES THAT HAVE NOT BEEN SAVED. WOULD YOU LIKE TO SAVE YOUR PICTURE WALL NOW?
              </p>

              {/* Modal Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    // Save option - keep current artworks and don't change layout
                    setShowLayoutChangeModal(false)
                    setPendingLayout(null)
                  }}
                  className="bg-black text-white px-8 py-3 font-bold text-sm tracking-wider hover:bg-gray-800 transition-all duration-200 cursor-pointer"
                >
                  SAVE
                </button>
                <button
                  onClick={() => {
                    // Don't save - clear artworks and change to new layout
                    setSelectedArtworks({})
                    setActiveFrameIndex(null)
                    setSelectedLayout(pendingLayout)
                    setShowLayoutChangeModal(false)
                    setPendingLayout(null)
                  }}
                  className="bg-white text-black px-8 py-3 font-bold text-sm tracking-wider border-2 border-black hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                >
                  DON'T SAVE
                </button>
                <button
                  onClick={() => {
                    // Cancel - do nothing
                    setShowLayoutChangeModal(false)
                    setPendingLayout(null)
                  }}
                  className="bg-white text-black px-8 py-3 font-bold text-sm tracking-wider border-2 border-black hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Step 4: Select Designs/Artworks  
  if (currentStep === "step4") {
    // Get available artworks for the currently active frame
    const activeFrame = activeFrameIndex !== null && selectedLayout ? selectedLayout.frames[activeFrameIndex] : null
    const availableArtworks = activeFrame ? getArtworksForFrameSize(activeFrame.size) : []

    return (
      <div className="h-screen bg-white flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-300 flex flex-col">
          {/* Logo - Fixed at top */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold tracking-tight text-center">DESENIO</h1>
          </div>

          {/* Step Header with Close Button - Fixed */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <p className="text-sm font-semibold tracking-wide">4. SELECT DESIGNS</p>
            <button
              onClick={() => setCurrentStep("intro")}
              className="text-2xl font-light text-gray-600 hover:text-black transition-colors cursor-pointer leading-none"
            >
              ✕
            </button>
          </div>

          {/* Instructions or Artwork List */}
          <div ref={artworkScrollRef} className="flex-1 overflow-y-auto px-6 py-6">
            {activeFrameIndex === null ? (
              /* Show instructions when no frame is selected */
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="mb-6">
                  <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-gray-700 mb-3">
                  Click on a picture on the wall to select a design
                </p>
                <p className="text-sm text-gray-500">
                  Select each frame on your gallery wall to choose artwork that fits perfectly
                </p>
              </div>
            ) : (
              /* Show artwork options for selected frame */
              <div className="relative">
                {/* Selected Filters Chips */}
                {selectedColorFilters.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {selectedColorFilters.map(color => (
                      <button
                        key={color}
                        onClick={() => toggleColorFilter(color)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm font-medium text-gray-800 rounded cursor-pointer transition-colors"
                      >
                        {color.charAt(0).toUpperCase() + color.slice(1)} ✕
                      </button>
                    ))}
                  </div>
                )}

                {/* Filter Bar */}
                <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
                  <button 
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedColorFilters([])
                    }}
                    className="text-sm font-semibold text-black hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    ALL PRODUCTS
                  </button>
                  <button 
                    onClick={() => setShowFilter(!showFilter)}
                    className="flex items-center gap-2 text-sm font-semibold text-black hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showFilter ? 'HIDE FILTER ✕' : 'SHOW FILTER'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>

                {/* Color Filter Panel - Flyout to the right of sidebar */}
                {showFilter && (
                  <div className="fixed left-80 top-[132px] h-[calc(100%-132px)] w-80 bg-white border-r border-gray-200 shadow-xl z-50 overflow-y-auto">
                    {/* Header with Clear Filter and Search - aligned with ALL PRODUCTS / HIDE FILTER */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-end mb-4">
                        <button 
                          onClick={() => {
                            setSearchQuery('')
                            setSelectedColorFilters([])
                          }}
                          className="text-xs font-semibold text-black hover:text-gray-600 transition-colors cursor-pointer border border-gray-300 px-3 py-1.5"
                        >
                          CLEAR FILTER
                        </button>
                      </div>

                      {/* Search Box */}
                      <div className="relative mb-4">
                        <input 
                          type="text" 
                          placeholder="Search abstract, typography..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 text-sm focus:outline-none focus:border-black"
                        />
                        <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* Color Section */}
                    <div className="p-6">
                      <h3 className="text-sm font-bold text-black mb-4">Color</h3>
                      
                      {/* Color Grid */}
                      <div className="grid grid-cols-3 gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => toggleColorFilter(color.value)}
                            className={`flex flex-col items-center gap-1.5 px-2 py-2.5 border-2 transition-all cursor-pointer ${
                              selectedColorFilters.includes(color.value)
                                ? 'border-black bg-black text-white'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <div 
                              className="w-7 h-7 border border-gray-300"
                              style={{ background: color.color }}
                            />
                            <span className={`text-xs font-medium text-center leading-tight ${
                              selectedColorFilters.includes(color.value) ? 'text-white' : 'text-gray-800'
                            }`}>{color.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {availableArtworks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No artworks available for this size</p>
                  </div>
                ) : (
                  <div>
                    {/* 2-Column Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {availableArtworks.slice(0, displayedArtworkCount).map((artwork) => (
                        <div
                          key={artwork.id}
                          onClick={() => {
                            setSelectedArtworks({
                              ...selectedArtworks,
                              [activeFrameIndex]: artwork
                            })
                          }}
                          className={`relative cursor-pointer transition-all duration-200 group ${
                            selectedArtworks[activeFrameIndex]?.id === artwork.id
                              ? 'ring-2 ring-black ring-offset-2'
                              : 'hover:shadow-lg'
                          }`}
                        >
                          {/* Artwork Image */}
                          <div className="relative aspect-[3/4] bg-gray-200 overflow-hidden">
                            <img 
                              src={artwork.image}
                              alt={artwork.title}
                              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                            />
                            {selectedArtworks[activeFrameIndex]?.id === artwork.id && (
                              <div className="absolute top-2 left-2 bg-black text-white rounded w-6 h-6 flex items-center justify-center">
                                <span className="text-sm font-bold">✓</span>
                              </div>
                            )}
                          </div>

                          {/* Artwork Info */}
                          <div className="p-2 bg-white border border-t-0 border-gray-200">
                            <h3 className="text-xs font-bold text-black mb-1 line-clamp-1">{artwork.title}</h3>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600 line-clamp-1">{artwork.category}</span>
                              <span className="text-xs font-semibold text-black">£{artwork.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Loading Indicator - Shown when loading more */}
                    {isLoadingMore && (
                      <div className="mt-6 flex justify-center py-4">
                        <div className="flex items-center gap-2 text-gray-500">
                          <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-sm font-medium">Loading more...</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons - Fixed at bottom */}
          <div className="px-6 py-4 border-t border-gray-200 space-y-3">
            <button 
              onClick={() => {
                // Check if at least one artwork is selected
                const hasArtworks = Object.keys(selectedArtworks).length > 0
                if (!hasArtworks) {
                  setShowEmptyArtworkModal(true)
                } else {
                  setCurrentStep("checkout")
                }
              }}
              className="w-full bg-black text-white py-3 font-bold text-sm tracking-wide hover:bg-gray-800 transition-all duration-200 cursor-pointer"
            >
              NEXT
            </button>
            <button 
              onClick={() => {
                setActiveFrameIndex(null)
                setCurrentStep("step3")
              }}
              className="w-full bg-white text-black py-3 font-bold text-sm tracking-wide border-2 border-black hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              PREVIOUS
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <div className="bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ▼ SAVED GALLERY WALLS
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                💾 SAVE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ↗ SHARE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ■ CREATE NEW
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">{Object.keys(cartItems.artworks).length + Object.keys(cartItems.frames).length}</span>
                <span className="text-lg">🛍️</span>
              </div>
              <button onClick={handleCheckout} className="w-full bg-black text-white py-3 font-bold text-sm tracking-wider hover:bg-gray-800 transition-all duration-200 cursor-pointer">CHECKOUT</button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="bg-white px-6 py-2 text-xs text-gray-400 border-b border-gray-300">
            WALL ART / INSPIRATION / <span className="text-gray-700 font-semibold">CREATE YOUR GALLERY WALL</span>
          </div>

          {/* Main Canvas with Background and Clickable Frames */}
          <div
            className="flex-1 relative bg-cover bg-center transition-all duration-500 overflow-hidden"
            style={{
              backgroundImage: selectedBackground 
                ? `url(${selectedBackground.image})` 
                : "url(https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/welcome-bg.jpg?v=1)",
            }}
          >
            {/* Frame Container - Fixed aspect ratio wrapper */}
            <div className="absolute inset-0">
              {/* Clickable Frame Placeholders with Selected Artworks */}
              {selectedLayout && selectedLayout.frames.map((frame, idx) => {
              const artwork = selectedArtworks[idx]
              const frameStyle = selectedFrames[idx]
              
              return (
                <div
                  key={idx}
                  onClick={() => setActiveFrameIndex(idx)}
                  className={`absolute transition-all duration-300 cursor-pointer group overflow-hidden ${
                    activeFrameIndex === idx 
                      ? 'z-10' 
                      : ''
                  }`}
                  style={{
                    width: frame.width,
                    height: frame.height,
                    top: frame.top,
                    bottom: frame.bottom,
                    left: frame.left,
                    right: frame.right,
                    transform: frame.transform
                  }}
                >
                  {artwork ? (
                    /* Show selected artwork - fills entire box */
                    <>
                      <img 
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        CHANGE
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const newArtworks = { ...selectedArtworks }
                          delete newArtworks[idx]
                          setSelectedArtworks(newArtworks)
                        }}
                        className="absolute top-2 left-2 bg-white text-black w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white shadow-lg cursor-pointer"
                        title="Remove design"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    /* Show placeholder */
                    <div className="absolute inset-0 bg-gray-300 flex items-center justify-center border-2 border-dashed border-gray-400 group-hover:border-blue-400 transition-colors">
                      <span className="text-gray-600 font-semibold text-sm group-hover:text-blue-600 transition-colors">
                        {frame.size}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
            </div>
          </div>
        </div>

        {/* Validation Modal - No Artworks Selected */}
        {showEmptyArtworkModal && (
          <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white p-8 max-w-md w-full mx-4 relative shadow-2xl border border-gray-200 rounded-lg">
              {/* Modal Content */}
              <div className="text-center">
                {/* Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                  <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  No Designs Selected
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Please select at least one design for your gallery wall before proceeding to checkout.
                </p>

                {/* Button */}
                <button
                  onClick={() => setShowEmptyArtworkModal(false)}
                  className="w-full bg-black text-white px-8 py-3 font-bold text-sm tracking-wider hover:bg-gray-800 transition-all duration-200 cursor-pointer rounded"
                >
                  OK, GOT IT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // STEP 5: Frame Selection
  // STEP 5 - FRAME SELECTION - COMMENTED OUT
  if (false && currentStep === "step5") {
    // Get list of frame indices that have artworks
    const framesWithArtworks = Object.keys(selectedArtworks).map(Number).sort((a, b) => a - b)
    const currentIndex = activeFrameForStyle !== null ? framesWithArtworks.indexOf(activeFrameForStyle) : -1

    const goToPreviousFrame = () => {
      if (currentIndex > 0) {
        setActiveFrameForStyle(framesWithArtworks[currentIndex - 1])
      }
    }

    const goToNextFrame = () => {
      if (currentIndex < framesWithArtworks.length - 1) {
        setActiveFrameForStyle(framesWithArtworks[currentIndex + 1])
      }
    }

    const handleFrameSelect = (frame) => {
      if (activeFrameForStyle === null) {
        // Apply to all
        const newFrames = {}
        framesWithArtworks.forEach(idx => {
          newFrames[idx] = frame
        })
        setSelectedFrames(newFrames)
      } else {
        // Apply to specific frame
        setSelectedFrames({
          ...selectedFrames,
          [activeFrameForStyle]: frame
        })
      }
    }

    const handleDeleteFrame = () => {
      if (activeFrameForStyle !== null) {
        const newFrames = { ...selectedFrames }
        delete newFrames[activeFrameForStyle]
        setSelectedFrames(newFrames)
      }
    }

    return (
      <div className="flex h-screen bg-white">
        {/* Left Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Logo */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold tracking-tight text-center">DESENIO</h1>
          </div>

          {/* Step Header with Close Button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <p className="text-sm font-semibold tracking-wide">5. FRAME YOUR DESIGNS</p>
            <button
              onClick={() => setCurrentStep("intro")}
              className="text-2xl font-light text-gray-600 hover:text-black transition-colors cursor-pointer leading-none"
            >
              ✕
            </button>
          </div>

          {/* Frame Navigation with Preview */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousFrame}
                disabled={currentIndex <= 0 && activeFrameForStyle !== null}
                className="text-3xl font-light text-gray-600 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ‹
              </button>
              
              <div className="text-base font-semibold tracking-wide">
                {activeFrameForStyle === null 
                  ? 'All' 
                  : `${currentIndex + 1} / ${framesWithArtworks.length}`
                }
              </div>
              
              <button
                onClick={goToNextFrame}
                disabled={currentIndex >= framesWithArtworks.length - 1 || activeFrameForStyle === null}
                className="text-3xl font-light text-gray-600 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ›
              </button>
            </div>

            {/* Preview of current selection */}
            <div className="flex justify-center">
              {activeFrameForStyle === null ? (
                /* Show all artworks in a scrollable row */
                <div className="flex gap-2 overflow-x-auto max-w-full pb-2" style={{ scrollbarWidth: 'thin' }}>
                  {framesWithArtworks.map((frameIdx) => {
                    const artwork = selectedArtworks[frameIdx]
                    const frameStyle = selectedFrames[frameIdx]
                    return (
                      <div
                        key={frameIdx}
                        onClick={() => setActiveFrameForStyle(frameIdx)}
                        className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          width: '80px',
                          height: '100px',
                          padding: frameStyle ? frameStyle.borderWidth : '2px',
                          backgroundColor: frameStyle ? frameStyle.color : '#E5E5E5',
                          border: frameStyle?.borderColor ? `1px solid ${frameStyle.borderColor}` : 'none'
                        }}
                      >
                        <div className="w-full h-full bg-white">
                          <img 
                            src={artwork.image}
                            alt={artwork.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                /* Show single selected artwork */
                <div
                  className="cursor-pointer"
                  onClick={() => setActiveFrameForStyle(null)}
                  style={{
                    width: '120px',
                    height: '150px',
                    padding: selectedFrames[activeFrameForStyle] ? selectedFrames[activeFrameForStyle].borderWidth : '2px',
                    backgroundColor: selectedFrames[activeFrameForStyle] ? selectedFrames[activeFrameForStyle].color : '#E5E5E5',
                    border: selectedFrames[activeFrameForStyle]?.borderColor ? `1px solid ${selectedFrames[activeFrameForStyle].borderColor}` : 'none'
                  }}
                >
                  <div className="w-full h-full bg-white">
                    <img 
                      src={selectedArtworks[activeFrameForStyle].image}
                      alt={selectedArtworks[activeFrameForStyle].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Frame Options Grid */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              {frameStyles.map((frame) => {
                const isSelected = activeFrameForStyle === null
                  ? Object.values(selectedFrames).every(f => f?.id === frame.id)
                  : selectedFrames[activeFrameForStyle]?.id === frame.id

                // Get artwork to show in preview
                const previewArtwork = activeFrameForStyle !== null 
                  ? selectedArtworks[activeFrameForStyle]
                  : selectedArtworks[framesWithArtworks[0]] // Show first artwork for "All" mode

                return (
                  <button
                    key={frame.id}
                    onClick={() => handleFrameSelect(frame)}
                    className={`relative aspect-[3/4] border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
                      isSelected
                        ? 'border-black ring-2 ring-black ring-offset-2'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {/* Frame Preview with Artwork */}
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                      <div 
                        className="w-full h-full relative"
                        style={{
                          padding: frame.borderWidth,
                          backgroundColor: frame.color,
                          border: frame.borderColor ? `1px solid ${frame.borderColor}` : 'none'
                        }}
                      >
                        {/* Inner area with artwork */}
                        <div className="w-full h-full bg-white overflow-hidden">
                          {previewArtwork && (
                            <img 
                              src={previewArtwork.image}
                              alt={previewArtwork.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Frame Name */}
                    <div className="absolute bottom-1 left-0 right-0 text-center pointer-events-none">
                      <span className="text-xs font-semibold bg-white bg-opacity-90 px-2 py-0.5 inline-block">{frame.name}</span>
                    </div>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 bg-black text-white rounded w-5 h-5 flex items-center justify-center z-10">
                        <span className="text-xs font-bold">✓</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Delete Frame Button (only visible when specific frame is selected) */}
          {activeFrameForStyle !== null && (
            <div className="px-6 py-3 border-t border-gray-200">
              <button
                onClick={handleDeleteFrame}
                className="w-full py-3 font-bold text-sm tracking-wide border-2 border-black hover:bg-gray-100 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                DELETE FRAME
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 space-y-3">
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 font-bold text-sm tracking-wide hover:bg-gray-800 transition-all duration-200 cursor-pointer"
            >
              DONE
            </button>
            <button
              onClick={() => setCurrentStep("step4")}
              className="w-full bg-white text-black py-3 font-bold text-sm tracking-wide border-2 border-black hover:bg-gray-100 transition-all duration-200 cursor-pointer"
            >
              PREVIOUS
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <div className="bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ▼ SAVED GALLERY WALLS
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                📋 SAVE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                🔗 SHARE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ■ CREATE NEW
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">{Object.keys(cartItems.artworks).length + Object.keys(cartItems.frames).length}</span>
                <span className="text-lg">🛍️</span>
              </div>
              <button onClick={handleCheckout} className="bg-black text-white px-6 py-2 font-bold text-xs tracking-wider hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                CHECKOUT £{calculateCartTotal()}
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="bg-white px-6 py-2 text-xs text-gray-400 border-b border-gray-300">
            WALL ART / INSPIRATION / <span className="text-gray-700 font-semibold">CREATE YOUR GALLERY WALL</span>
          </div>

          {/* Main Canvas with Background, Artworks, and Frames */}
          <div
            className="flex-1 relative bg-cover bg-center transition-all duration-500 overflow-hidden"
            style={{
              backgroundImage: selectedBackground 
                ? `url(${selectedBackground.image})` 
                : "url(https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/welcome-bg.jpg?v=1)",
            }}
          >
            <div className="absolute inset-0">
              {/* Artworks with Frames */}
              {selectedLayout && selectedLayout.frames.map((frame, idx) => {
              const artwork = selectedArtworks[idx]
              const frameStyle = selectedFrames[idx]
              const isActive = activeFrameForStyle === idx

              if (!artwork) return null

              return (
                <div
                  key={idx}
                  onClick={() => setActiveFrameForStyle(idx)}
                  className={`absolute transition-all duration-300 cursor-pointer group ${
                    isActive ? 'z-10' : ''
                  }`}
                  style={{
                    width: frame.width,
                    height: frame.height,
                    top: frame.top,
                    bottom: frame.bottom,
                    left: frame.left,
                    right: frame.right,
                    transform: frame.transform,
                    padding: frameStyle ? frameStyle.borderWidth : '0px',
                    backgroundColor: frameStyle ? frameStyle.color : 'transparent',
                    border: frameStyle?.borderColor ? `1px solid ${frameStyle.borderColor}` : 'none'
                  }}
                >
                  {/* Artwork Image */}
                  <div className="relative w-full h-full bg-white">
                    <img 
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  </div>
                </div>
              )
            })}
            </div>
          </div>
        </div>
      </div>
    )
  }  // END OF STEP 5 - FRAME SELECTION - COMMENTED OUT

  // CHECKOUT/SUMMARY STEP
  if (currentStep === "checkout") {
    const totalPrice = calculateTotalPrice()
    const currency = selectedArtworks[Object.keys(selectedArtworks)[0]]?.currency || '£'

    return (
      <div className="flex h-screen bg-white">
        {/* Left Sidebar - Summary */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Logo */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold tracking-tight text-center">DESENIO</h1>
          </div>

          {/* Completed Steps */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-8">
              {/* Step 1 - Background */}
              <button
                onClick={() => setCurrentStep("step1")}
                className="w-full text-center cursor-pointer transition-all duration-200 py-3 group relative"
              >
                {/* Checkmark - positioned top-left */}
                <div className="absolute top-0 left-12 text-gray-400 text-sm">
                  ✓
                </div>
                
                {/* Overlapping frames icon */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-10 h-10">
                    {/* Back frame */}
                    <div className="absolute top-0 right-0 w-7 h-9 border-2 border-gray-400 group-hover:border-black bg-white transition-colors transform rotate-6"></div>
                    {/* Front frame */}
                    <div className="absolute top-1 left-0 w-7 h-9 border-2 border-gray-400 group-hover:border-black bg-white transition-colors">
                      {/* Small image representation inside frame */}
                      <div className="absolute inset-2 bg-gray-400 group-hover:bg-black transition-colors"></div>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-semibold mb-1 text-gray-400 group-hover:text-black transition-colors">1</p>
                <p className="text-xs font-semibold tracking-wide text-gray-400 group-hover:text-black transition-colors">SELECT BACKGROUND</p>
              </button>

              {/* Step 2 - Picture Wall */}
              <button
                onClick={() => setCurrentStep("step3")}
                className="w-full text-center cursor-pointer transition-all duration-200 py-3 group relative"
              >
                {/* Checkmark - positioned top-left */}
                <div className="absolute top-0 left-12 text-gray-400 text-sm">
                  ✓
                </div>
                
                {/* Picture wall layout icon */}
                <div className="flex justify-center mb-4">
                  <div className="flex gap-1 items-start">
                    {/* Large rectangle on left */}
                    <div className="w-5 h-8 bg-gray-400 group-hover:bg-black transition-colors"></div>
                    {/* Two smaller rectangles stacked on right */}
                    <div className="flex flex-col gap-1">
                      <div className="w-2 h-3.5 bg-gray-400 group-hover:bg-black transition-colors"></div>
                      <div className="w-2 h-3.5 bg-gray-400 group-hover:bg-black transition-colors"></div>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-semibold mb-1 text-gray-400 group-hover:text-black transition-colors">2</p>
                <p className="text-xs font-semibold tracking-wide text-gray-400 group-hover:text-black transition-colors">SELECT PICTURE WALL</p>
              </button>

              {/* Step 3 - Design */}
              <button
                onClick={() => setCurrentStep("step4")}
                className="w-full text-center cursor-pointer transition-all duration-200 py-3 group relative"
              >
                {/* Checkmark - positioned top-left */}
                <div className="absolute top-0 left-12 text-gray-400 text-sm">
                  ✓
                </div>
                
                {/* Tall rectangle with circle icon */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-6 h-9 border-2 border-gray-400 group-hover:border-black flex items-center justify-center transition-colors">
                    <div className="w-2 h-2 bg-gray-400 group-hover:bg-black rounded-full transition-colors"></div>
                  </div>
                </div>
                <p className="text-sm font-semibold mb-1 text-gray-400 group-hover:text-black transition-colors">3</p>
                <p className="text-xs font-semibold tracking-wide text-gray-400 group-hover:text-black transition-colors">SELECT DESIGN</p>
              </button>

              {/* Step 4 - Select Design */}
              <button
                onClick={() => setCurrentStep("step4")}
                className="w-full text-center cursor-pointer transition-all duration-200 py-3 group relative"
              >
                {/* Checkmark - positioned top-left */}
                <div className="absolute top-0 left-12 text-gray-400 text-sm">
                  ✓
                </div>
                
                {/* Tall rectangle with circle icon */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-6 h-9 border-2 border-gray-400 group-hover:border-black flex items-center justify-center transition-colors">
                    <div className="w-2 h-2 bg-gray-400 group-hover:bg-black rounded-full transition-colors"></div>
                  </div>
                </div>
                <p className="text-sm font-semibold mb-1 text-gray-400 group-hover:text-black transition-colors">4</p>
                <p className="text-xs font-semibold tracking-wide text-gray-400 group-hover:text-black transition-colors">SELECT DESIGN</p>
              </button>
            </div>
          </div>

          {/* Price and Add to Cart */}
          <div className="px-6 py-6 border-t border-gray-200">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-black">{currency} {totalPrice}</div>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-4 font-bold text-sm tracking-wider hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              ADD TO 
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <div className="bg-white border-b border-gray-300 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ▼ SAVED GALLERY WALLS
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                📋 SAVE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                🔗 SHARE
              </button>
              <button className="px-4 py-2 border-2 border-black text-xs font-semibold flex items-center gap-2 hover:bg-black hover:text-white transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                ■ CREATE NEW
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Cart Icon with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCart(!showCart)}
                  className="relative flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                    {Object.keys(cartItems.artworks).length + Object.keys(cartItems.frames).length}
                  </span>
                </button>

                {/* Cart Dropdown */}
                {showCart && (
                  <div className="fixed top-20 right-0 w-[600px] bg-white border border-gray-200 shadow-2xl z-50 max-h-[600px] flex flex-col">
                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* Artwork Items */}
                      {Object.entries(cartItems.artworks).map(([frameIdx, artwork]) => (
                        <div key={`artwork-${frameIdx}`} className="flex gap-3 pb-4 border-b border-gray-200">
                          {/* Thumbnail */}
                          <div className="w-20 h-28 flex-shrink-0 border border-gray-200">
                            <img 
                              src={artwork.image}
                              alt={artwork.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Details */}
                          <div className="flex-1 flex flex-col">
                            <h3 className="font-medium text-sm mb-1">{artwork.title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-red-600 font-bold text-base">£ {artwork.price}</span>
                            </div>
                            
                            {/* Quantity */}
                            <div className="flex items-center gap-2">
                              <select 
                                value={quantities.artworks[frameIdx] || 1}
                                onChange={(e) => handleQuantityChange('artworks', frameIdx, e.target.value)}
                                className="w-16 px-2 py-1 border border-gray-300 text-sm text-center cursor-pointer"
                              >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                              </select>
                            </div>
                          </div>

                          {/* Delete Button */}
                          <button 
                            onClick={() => {
                              const newArtworks = { ...cartItems.artworks }
                              delete newArtworks[frameIdx]
                              setCartItems({ ...cartItems, artworks: newArtworks })
                            }}
                            className="text-gray-400 hover:text-black transition-colors cursor-pointer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}

                      {/* Frame Items */}
                      {Object.entries(cartItems.frames).map(([frameIdx, frame]) => {
                        const artwork = cartItems.artworks[frameIdx]
                        if (!artwork) return null
                        
                        return (
                          <div key={`frame-${frameIdx}`} className="flex gap-3 pb-4 border-b border-gray-200">
                            {/* Thumbnail with frame */}
                            <div 
                              className="w-20 h-28 flex-shrink-0 border border-gray-200"
                              style={{
                                padding: '3px',
                                backgroundColor: frame.color,
                                border: frame.borderColor ? `1px solid ${frame.borderColor}` : 'none'
                              }}
                            >
                              <div className="w-full h-full bg-white">
                                <img 
                                  src={artwork.image}
                                  alt={`${frame.name} frame`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            
                            {/* Details */}
                            <div className="flex-1 flex flex-col">
                              <h3 className="font-medium text-sm mb-1">{frame.name} picture frame</h3>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-red-600 font-bold text-base">£ {frame.price.toFixed(2)}</span>
                              </div>
                              
                              {/* Quantity */}
                              <div className="flex items-center gap-2">
                                <select 
                                  value={quantities.frames[frameIdx] || 1}
                                  onChange={(e) => handleQuantityChange('frames', frameIdx, e.target.value)}
                                  className="w-16 px-2 py-1 border border-gray-300 text-sm text-center cursor-pointer"
                                >
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5</option>
                                  <option value="6">6</option>
                                  <option value="7">7</option>
                                  <option value="8">8</option>
                                  <option value="9">9</option>
                                  <option value="10">10</option>
                                </select>
                              </div>
                            </div>

                            {/* Delete Button */}
                            <button 
                              onClick={() => {
                                const newFrames = { ...cartItems.frames }
                                delete newFrames[frameIdx]
                                setCartItems({ ...cartItems, frames: newFrames })
                              }}
                              className="text-gray-400 hover:text-black transition-colors cursor-pointer"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )
                      })}
                    </div>

                    {/* Total and Checkout */}
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold">TOTAL AMOUNT</span>
                        <span className="text-lg font-bold">£{calculateCartTotal()}</span>
                      </div>
                      <button 
                        onClick={handleCheckout}
                        className="w-full bg-black text-white py-3 font-bold text-sm tracking-wider hover:bg-gray-800 transition-all duration-200 cursor-pointer"
                      >
                        CHECKOUT
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleCheckout}
                className="bg-black text-white px-6 py-2 font-bold text-xs tracking-wider hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer"
              >
                CHECKOUT {currency}{totalPrice}
              </button>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="bg-white px-6 py-2 text-xs text-gray-400 border-b border-gray-300">
            WALL ART / INSPIRATION / <span className="text-gray-700 font-semibold">CREATE YOUR GALLERY WALL</span>
          </div>

          {/* Main Canvas - Final Preview */}
          <div
            className="flex-1 relative bg-cover bg-center transition-all duration-500 overflow-hidden"
            style={{
              backgroundImage: selectedBackground 
                ? `url(${selectedBackground.image})` 
                : "url(https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/welcome-bg.jpg?v=1)",
            }}
          >
            <div className="absolute inset-0">
              {/* Final Gallery Wall Preview */}
              {selectedLayout && selectedLayout.frames.map((frame, idx) => {
                const artwork = selectedArtworks[idx]
                const frameStyle = selectedFrames[idx]

                if (!artwork) return null

                return (
                  <div
                    key={idx}
                    className="absolute transition-all duration-300 overflow-hidden"
                    style={{
                      width: frame.width,
                      height: frame.height,
                      top: frame.top,
                      bottom: frame.bottom,
                      left: frame.left,
                      right: frame.right,
                      transform: frame.transform
                    }}
                  >
                    {/* Artwork Image - fills entire box */}
                    <img 
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

