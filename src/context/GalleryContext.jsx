"use client"

import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from "react"
import { fetchArtworkProducts, createCheckout } from '../utils/shopify'
import { useMobileDetection, useFullscreen } from '../hooks'
import { portraitLayoutOptions } from '../data'

const DEFAULT_LAYOUT = portraitLayoutOptions[0] // Single Portrait

const GalleryContext = createContext(null)

export function GalleryProvider({ children }) {
  // Mobile and fullscreen detection hooks
  const { isMobile, isLandscape, isIOS, showRotatePrompt, setShowRotatePrompt } = useMobileDetection()
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen(isIOS)

  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem('galleryCurrentStep')
    // Migration: "intro" step was removed, redirect to step1
    if (savedStep === 'intro') return "step1"
    return savedStep || "step1"
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
    return saved ? JSON.parse(saved) : DEFAULT_LAYOUT
  })
  const [activeVariants, setActiveVariants] = useState(() => {
    const saved = localStorage.getItem('galleryActiveVariants')
    return saved ? JSON.parse(saved) : {}
  })
  const [expandedSection, setExpandedSection] = useState(null)
  const [selectedArtworks, setSelectedArtworks] = useState(() => {
    const saved = localStorage.getItem('gallerySelectedArtworks')
    return saved ? JSON.parse(saved) : {}
  })
  const [activeFrameIndex, setActiveFrameIndex] = useState(null)
  const [artworkProducts, setArtworkProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedColorFilters, setSelectedColorFilters] = useState([])
  const [selectedOrientationFilters, setSelectedOrientationFilters] = useState([])
  const [selectedSizeFilters, setSelectedSizeFilters] = useState([])
  const [selectedStyleFilters, setSelectedStyleFilters] = useState([])
  const [selectedCollectionFilters, setSelectedCollectionFilters] = useState([])
  const [selectedArtistFilters, setSelectedArtistFilters] = useState([])
  const [selectedRoomFilters, setSelectedRoomFilters] = useState([])
  const [expandedFilterSection, setExpandedFilterSection] = useState(null)
  const [selectedFrames, setSelectedFrames] = useState(() => {
    const saved = localStorage.getItem('gallerySelectedFrames')
    return saved ? JSON.parse(saved) : {}
  })
  const [activeFrameForStyle, setActiveFrameForStyle] = useState(null)
  const [showCart, setShowCart] = useState(false)
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('galleryCart')
    return savedCart ? JSON.parse(savedCart) : { artworks: {}, frames: {} }
  })
  const [quantities, setQuantities] = useState(() => {
    const savedQuantities = localStorage.getItem('galleryQuantities')
    return savedQuantities ? JSON.parse(savedQuantities) : { artworks: {}, frames: {} }
  })
  const [displayedArtworkCount, setDisplayedArtworkCount] = useState(120)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const artworkScrollRef = useRef(null)
  const [showLayoutChangeModal, setShowLayoutChangeModal] = useState(false)
  const [pendingLayout, setPendingLayout] = useState(null)
  const [showEmptyArtworkModal, setShowEmptyArtworkModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [savedGalleryWalls, setSavedGalleryWalls] = useState([])
  const [showCartDropdown, setShowCartDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Customize Your Prints settings
  const [measurementUnit, setMeasurementUnit] = useState('cm')
  const [printOrientation, setPrintOrientation] = useState('Portrait')
  const [printStyle, setPrintStyle] = useState('Black')
  const [printSize, setPrintSize] = useState('13 × 18')
  const [perFrameSizes, setPerFrameSizes] = useState([]) // per-frame size overrides
  const [spacingPreset, setSpacingPreset] = useState('tight')
  const [spacingValue, setSpacingValue] = useState(2) // in cm
  const [innerShadow, setInnerShadow] = useState({
    xOffset: 0,
    yOffset: 2,
    blur: 10,
    spread: 0,
    opacity: 20,
  })

  // Canvas overlay controls
  const [wallScale, setWallScale] = useState(0)
  const [showGrid, setShowGrid] = useState(false)
  const [showRuler, setShowRuler] = useState(false)

  // Draggable group position
  const [groupOffset, setGroupOffset] = useState(() => {
    const saved = localStorage.getItem('galleryGroupOffset')
    return saved ? JSON.parse(saved) : { x: 0, y: 0 }
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const wasDraggingRef = useRef(false)
  const canvasRef = useRef(null)

  // Lock / individual-drag state
  const [isLocked, setIsLocked] = useState(true)   // true = collective drag, false = individual
  const [individualOffsets, setIndividualOffsets] = useState({}) // { frameIdx: {x,y} }
  const [activeDragFrameIdx, setActiveDragFrameIdx] = useState(null)
  const [individualDragStart, setIndividualDragStart] = useState({ x: 0, y: 0 })
  const [individualDragLive, setIndividualDragLive] = useState({ x: 0, y: 0 })

  // ===== UNDO / REDO HISTORY =====
  const historyRef = useRef([])
  const futureRef = useRef([])
  const isRestoringRef = useRef(false)
  const MAX_HISTORY = 50

  const getSnapshot = useCallback(() => ({
    selectedPlace, selectedBackground, selectedLayout,
    selectedArtworks: { ...selectedArtworks },
    selectedFrames: { ...selectedFrames },
    printOrientation, printStyle, printSize, measurementUnit,
    wallScale, spacingPreset, spacingValue,
    groupOffset: { ...groupOffset },
  }), [selectedPlace, selectedBackground, selectedLayout, selectedArtworks, selectedFrames,
    printOrientation, printStyle, printSize, measurementUnit, wallScale, spacingPreset, spacingValue, groupOffset])

  const pushHistory = useCallback(() => {
    if (isRestoringRef.current) return
    const snap = getSnapshot()
    historyRef.current = [...historyRef.current.slice(-(MAX_HISTORY - 1)), snap]
    futureRef.current = []
  }, [getSnapshot])

  // Auto-push on meaningful state changes
  const prevSnapRef = useRef(null)
  useEffect(() => {
    if (isRestoringRef.current) return
    const snap = getSnapshot()
    const prev = prevSnapRef.current
    if (prev && JSON.stringify(prev) !== JSON.stringify(snap)) {
      historyRef.current = [...historyRef.current.slice(-(MAX_HISTORY - 1)), prev]
      futureRef.current = []
    }
    prevSnapRef.current = snap
  }, [getSnapshot])

  const restoreSnapshot = useCallback((snap) => {
    isRestoringRef.current = true
    if (snap.selectedPlace !== undefined) setSelectedPlace(snap.selectedPlace)
    if (snap.selectedBackground !== undefined) setSelectedBackground(snap.selectedBackground)
    if (snap.selectedLayout !== undefined) setSelectedLayout(snap.selectedLayout)
    if (snap.selectedArtworks !== undefined) setSelectedArtworks(snap.selectedArtworks)
    if (snap.selectedFrames !== undefined) setSelectedFrames(snap.selectedFrames)
    if (snap.printOrientation !== undefined) setPrintOrientation(snap.printOrientation)
    if (snap.printStyle !== undefined) setPrintStyle(snap.printStyle)
    if (snap.printSize !== undefined) setPrintSize(snap.printSize)
    if (snap.measurementUnit !== undefined) setMeasurementUnit(snap.measurementUnit)
    if (snap.wallScale !== undefined) setWallScale(snap.wallScale)
    if (snap.spacingPreset !== undefined) setSpacingPreset(snap.spacingPreset)
    if (snap.spacingValue !== undefined) setSpacingValue(snap.spacingValue)
    if (snap.groupOffset !== undefined) setGroupOffset(snap.groupOffset)
    // Allow state to settle, then re-enable tracking
    setTimeout(() => {
      prevSnapRef.current = getSnapshot()
      isRestoringRef.current = false
    }, 0)
  }, [getSnapshot])

  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return
    const current = getSnapshot()
    futureRef.current = [current, ...futureRef.current]
    const prev = historyRef.current.pop()
    restoreSnapshot(prev)
  }, [getSnapshot, restoreSnapshot])

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return
    const current = getSnapshot()
    historyRef.current = [...historyRef.current, current]
    const next = futureRef.current.shift()
    restoreSnapshot(next)
  }, [getSnapshot, restoreSnapshot])

  const canUndo = historyRef.current.length > 0
  const canRedo = futureRef.current.length > 0

  // ===== EFFECTS =====

  // Fetch artwork products from Shopify on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true)
        const products = await fetchArtworkProducts()
        console.log('=== LOADED PRODUCTS ===', products.length)
        if (products.length > 0) {
          console.log('Sample product structure:', {
            title: products[0].title,
            colors: products[0].colors,
            sizes: products[0].sizes,
            styles: products[0].styles,
            rooms: products[0].rooms,
            artists: products[0].artists,
            tags: products[0].tags,
            productType: products[0].productType
          })
        }
        setArtworkProducts(products)
      } catch (error) {
        console.error('Failed to fetch artwork products:', error)
      } finally {
        setIsLoadingProducts(false)
      }
    }
    loadProducts()
  }, [])

  // Save to localStorage effects
  useEffect(() => { localStorage.setItem('galleryCart', JSON.stringify(cartItems)) }, [cartItems])
  useEffect(() => { localStorage.setItem('galleryQuantities', JSON.stringify(quantities)) }, [quantities])
  useEffect(() => { localStorage.setItem('galleryCurrentStep', currentStep) }, [currentStep])
  useEffect(() => { if (selectedPlace) localStorage.setItem('gallerySelectedPlace', JSON.stringify(selectedPlace)) }, [selectedPlace])
  useEffect(() => { if (selectedBackground) localStorage.setItem('gallerySelectedBackground', JSON.stringify(selectedBackground)) }, [selectedBackground])
  useEffect(() => { if (selectedLayout) localStorage.setItem('gallerySelectedLayout', JSON.stringify(selectedLayout)) }, [selectedLayout])
  useEffect(() => { localStorage.setItem('galleryActiveVariants', JSON.stringify(activeVariants)) }, [activeVariants])
  useEffect(() => { localStorage.setItem('gallerySelectedArtworks', JSON.stringify(selectedArtworks)) }, [selectedArtworks])
  useEffect(() => { localStorage.setItem('gallerySelectedFrames', JSON.stringify(selectedFrames)) }, [selectedFrames])
  useEffect(() => { localStorage.setItem('galleryGroupOffset', JSON.stringify(groupOffset)) }, [groupOffset])

  // Reset displayed count when active frame or filter changes
  useEffect(() => {
    setDisplayedArtworkCount(120)
  }, [activeFrameIndex, searchQuery, selectedColorFilters, selectedOrientationFilters, selectedStyleFilters, selectedCollectionFilters, selectedArtistFilters, selectedRoomFilters])

  // ===== FILTER LOGIC =====

  const toggleFilter = (filterType, value) => {
    const setterMap = {
      'color': setSelectedColorFilters,
      'orientation': setSelectedOrientationFilters,
      'size': setSelectedSizeFilters,
      'style': setSelectedStyleFilters,
      'collection': setSelectedCollectionFilters,
      'artist': setSelectedArtistFilters,
      'room': setSelectedRoomFilters
    }
    const setter = setterMap[filterType]
    if (setter) {
      setter(prev => {
        if (prev.includes(value)) {
          return prev.filter(item => item !== value)
        } else {
          return [...prev, value]
        }
      })
    }
  }

  // Memoized filtered artworks — only recalculates when products or filters change
  const filteredArtworks = useMemo(() => {
    let filtered = artworkProducts

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(artwork => {
        const searchableText = `${artwork.title} ${artwork.category} ${artwork.tags?.join(' ')}`.toLowerCase()
        return searchableText.includes(query)
      })
    }

    // Apply size filters
    if (selectedSizeFilters.length > 0) {
      filtered = filtered.filter(artwork => {
        if (!artwork.sizes || !Array.isArray(artwork.sizes) || artwork.sizes.length === 0) {
          return true
        }
        return selectedSizeFilters.some(sizeFilter => {
          return artwork.sizes.some(size => {
            const normalizedSize = String(size).toLowerCase().replace(/[×\s×]/gi, 'x').replace(/cm/gi, '').trim()
            const normalizedFilter = String(sizeFilter).toLowerCase().replace(/[×\s×]/gi, 'x').replace(/cm/gi, '').trim()
            return normalizedSize === normalizedFilter || normalizedSize.includes(normalizedFilter) || normalizedFilter.includes(normalizedSize)
          })
        })
      })
    }

    // Apply color filters
    if (selectedColorFilters.length > 0) {
      filtered = filtered.filter(artwork => {
        return selectedColorFilters.some(colorFilter => {
          const normalizedFilter = colorFilter.toLowerCase().trim()
          if (artwork.colors && Array.isArray(artwork.colors) && artwork.colors.length > 0) {
            const matchesColor = artwork.colors.some(color => {
              const normalizedColor = color.toLowerCase().trim()
              return normalizedColor.includes(normalizedFilter) || normalizedFilter.includes(normalizedColor)
            })
            if (matchesColor) return true
          }
          if (artwork.tags && Array.isArray(artwork.tags)) {
            const matchesTag = artwork.tags.some(tag => {
              const normalizedTag = tag.toLowerCase().trim()
              return normalizedTag.includes(normalizedFilter) || normalizedFilter.includes(normalizedTag)
            })
            if (matchesTag) return true
          }
          const searchText = `${artwork.category || ''} ${artwork.title || ''}`.toLowerCase()
          return searchText.includes(normalizedFilter)
        })
      })
    }

    // Apply orientation filters
    if (selectedOrientationFilters.length > 0) {
      filtered = filtered.filter(artwork => {
        const hasOrientationTags = artwork.tags && Array.isArray(artwork.tags) && artwork.tags.some(tag =>
          ['portrait', 'landscape', 'square', 'horizontal', 'vertical'].includes(tag.toLowerCase())
        )
        if (!hasOrientationTags) {
          return true
        }
        return selectedOrientationFilters.some(orientation => {
          if (!artwork.tags || !Array.isArray(artwork.tags)) return false
          return artwork.tags.some(tag => tag.toLowerCase() === orientation.toLowerCase())
        })
      })
    }

    // Apply style filters
    if (selectedStyleFilters.length > 0) {
      filtered = filtered.filter(artwork => {
        const hasStyleData = artwork.styles && Array.isArray(artwork.styles) && artwork.styles.length > 0
        const hasStyleTags = artwork.tags && Array.isArray(artwork.tags) && artwork.tags.some(tag =>
          selectedStyleFilters.some(style => tag.toLowerCase().includes(style.toLowerCase()))
        )
        if (!hasStyleData && !hasStyleTags) {
          return true
        }
        return selectedStyleFilters.some(style => {
          const normalizedStyle = style.toLowerCase().trim()
          if (artwork.styles && Array.isArray(artwork.styles) && artwork.styles.length > 0) {
            const hasStyle = artwork.styles.some(artworkStyle => {
              const normalized = artworkStyle.toLowerCase().trim()
              return normalized.includes(normalizedStyle) || normalizedStyle.includes(normalized)
            })
            if (hasStyle) return true
          }
          if (artwork.tags && Array.isArray(artwork.tags)) {
            return artwork.tags.some(tag => {
              const normalizedTag = tag.toLowerCase().trim()
              return normalizedTag.includes(normalizedStyle) || normalizedStyle.includes(normalizedTag)
            })
          }
          return false
        })
      })
    }

    // Apply collection filters (matches against productType)
    if (selectedCollectionFilters.length > 0) {
      filtered = filtered.filter(artwork => {
        if (!artwork.productType || artwork.productType.trim() === '') {
          return false // Products without a productType should NOT pass collection filter
        }
        return selectedCollectionFilters.some(collection => {
          const normalizedCollection = collection.toLowerCase().trim()
          const productType = artwork.productType.toLowerCase().trim()
          return productType === normalizedCollection || productType.includes(normalizedCollection) || normalizedCollection.includes(productType)
        })
      })
    }

    // Apply artist filters
    if (selectedArtistFilters.length > 0) {
      filtered = filtered.filter(artwork => {
        const hasArtistData = artwork.artists && Array.isArray(artwork.artists) && artwork.artists.length > 0
        if (!hasArtistData) {
          return true
        }
        return selectedArtistFilters.some(artist => {
          const normalizedArtist = artist.toLowerCase().trim()
          const hasArtist = artwork.artists.some(artworkArtist => {
            const normalized = artworkArtist.toLowerCase().trim()
            return normalized.includes(normalizedArtist) || normalizedArtist.includes(normalized)
          })
          if (hasArtist) return true
          if (artwork.vendor) {
            const normalizedVendor = artwork.vendor.toLowerCase().trim()
            if (normalizedVendor.includes(normalizedArtist) || normalizedArtist.includes(normalizedVendor)) return true
          }
          if (artwork.tags && Array.isArray(artwork.tags)) {
            const hasTag = artwork.tags.some(tag => {
              const normalizedTag = tag.toLowerCase().trim()
              return normalizedTag.includes(normalizedArtist) || normalizedArtist.includes(normalizedTag)
            })
            if (hasTag) return true
          }
          return false
        })
      })
    }

    // Apply room filters
    if (selectedRoomFilters.length > 0) {
      filtered = filtered.filter(artwork => {
        const hasRoomData = artwork.rooms && Array.isArray(artwork.rooms) && artwork.rooms.length > 0
        const hasRoomTags = artwork.tags && Array.isArray(artwork.tags) && artwork.tags.some(tag =>
          selectedRoomFilters.some(room => tag.toLowerCase().includes(room.toLowerCase()))
        )
        if (!hasRoomData && !hasRoomTags) {
          return true
        }
        return selectedRoomFilters.some(room => {
          const normalizedRoom = room.toLowerCase().trim()
          if (artwork.rooms && Array.isArray(artwork.rooms) && artwork.rooms.length > 0) {
            const hasRoom = artwork.rooms.some(artworkRoom => {
              const normalized = artworkRoom.toLowerCase().trim()
              return normalized.includes(normalizedRoom) || normalizedRoom.includes(normalized)
            })
            if (hasRoom) return true
          }
          if (artwork.tags && Array.isArray(artwork.tags)) {
            const hasTag = artwork.tags.some(tag => {
              const normalizedTag = tag.toLowerCase().trim()
              return normalizedTag.includes(normalizedRoom) || normalizedRoom.includes(normalizedTag)
            })
            if (hasTag) return true
          }
          return false
        })
      })
    }

    console.log(`🎨 Filter results: ${filtered.length}/${artworkProducts.length} products`)

    return filtered
  }, [artworkProducts, searchQuery, selectedSizeFilters, selectedColorFilters, selectedOrientationFilters, selectedStyleFilters, selectedCollectionFilters, selectedArtistFilters, selectedRoomFilters])

  // Keep getArtworksForFrameSize as a simple wrapper for backward compat
  const getArtworksForFrameSize = (frameSize) => filteredArtworks

  // ===== INFINITE SCROLL =====

  const handleScroll = useCallback(() => {
    if (!artworkScrollRef.current || isLoadingMore) return
    const container = artworkScrollRef.current
    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      if (displayedArtworkCount >= filteredArtworks.length) return
      setIsLoadingMore(true)
      setTimeout(() => {
        setDisplayedArtworkCount(prev => Math.min(prev + 80, filteredArtworks.length))
        setIsLoadingMore(false)
      }, 200)
    }
  }, [isLoadingMore, displayedArtworkCount, filteredArtworks.length])

  useEffect(() => {
    const container = artworkScrollRef.current
    if (!container) return
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // ===== PRICE CALCULATIONS =====

  const calculateTotalPrice = () => {
    let total = 0
    Object.entries(selectedArtworks).forEach(([frameIdx, artwork]) => {
      const quantity = quantities.artworks[frameIdx] || 1
      total += (parseFloat(artwork.price) || 0) * quantity
    })
    Object.entries(selectedFrames).forEach(([frameIdx, frame]) => {
      const quantity = quantities.frames[frameIdx] || 1
      total += (parseFloat(frame.price) || 0) * quantity
    })
    return total.toFixed(2)
  }

  const calculateCartTotal = () => {
    let total = 0
    if (cartItems.artworks && typeof cartItems.artworks === 'object') {
      Object.entries(cartItems.artworks).forEach(([frameIdx, artwork]) => {
        const quantity = quantities.artworks?.[frameIdx] || 1
        const price = parseFloat(artwork.price) || 0
        total += price * quantity
      })
    }
    if (cartItems.frames && typeof cartItems.frames === 'object') {
      Object.entries(cartItems.frames).forEach(([frameIdx, frame]) => {
        const quantity = quantities.frames?.[frameIdx] || 1
        const price = parseFloat(frame.price) || 0
        total += price * quantity
      })
    }
    return total.toFixed(2)
  }

  // ===== DRAG HANDLERS =====

  const DRAG_BOUNDARY = {
    left: 250,
    right: 250,
    top: 50,
    bottom: 200
  }

  const handleDragStart = (e) => {
    e.preventDefault()
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY
    setIsDragging(true)
    setDragStart({ x: clientX, y: clientY })
    setDragOffset({ x: 0, y: 0 })
    wasDraggingRef.current = false
  }

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY
    let deltaX = clientX - dragStart.x
    let deltaY = clientY - dragStart.y
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      wasDraggingRef.current = true
    }
    const totalX = groupOffset.x + deltaX
    const totalY = groupOffset.y + deltaY
    const elasticFactor = 0.3
    if (totalX > DRAG_BOUNDARY.right) {
      const overflow = totalX - DRAG_BOUNDARY.right
      deltaX = DRAG_BOUNDARY.right - groupOffset.x + (overflow * elasticFactor)
    } else if (totalX < -DRAG_BOUNDARY.left) {
      const overflow = -DRAG_BOUNDARY.left - totalX
      deltaX = -DRAG_BOUNDARY.left - groupOffset.x - (overflow * elasticFactor)
    }
    if (totalY > DRAG_BOUNDARY.bottom) {
      const overflow = totalY - DRAG_BOUNDARY.bottom
      deltaY = DRAG_BOUNDARY.bottom - groupOffset.y + (overflow * elasticFactor)
    } else if (totalY < -DRAG_BOUNDARY.top) {
      const overflow = -DRAG_BOUNDARY.top - totalY
      deltaY = -DRAG_BOUNDARY.top - groupOffset.y - (overflow * elasticFactor)
    }
    setDragOffset({ x: deltaX, y: deltaY })
  }, [isDragging, dragStart, groupOffset])

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    let finalX = groupOffset.x + dragOffset.x
    let finalY = groupOffset.y + dragOffset.y
    finalX = Math.max(-DRAG_BOUNDARY.left, Math.min(DRAG_BOUNDARY.right, finalX))
    finalY = Math.max(-DRAG_BOUNDARY.top, Math.min(DRAG_BOUNDARY.bottom, finalY))
    setGroupOffset({ x: finalX, y: finalY })
    setIsDragging(false)
    setDragOffset({ x: 0, y: 0 })
  }, [isDragging, dragOffset, groupOffset])

  // Reset group offset when layout changes
  useEffect(() => {
    if (selectedLayout) {
      setGroupOffset({ x: 0, y: 0 })
      setIndividualOffsets({})
    }
  }, [selectedLayout?.id])

  // ===== INDIVIDUAL FRAME DRAG (unlocked mode) =====
  const handleIndividualDragStart = useCallback((e, idx) => {
    e.preventDefault()
    e.stopPropagation()
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY
    setActiveDragFrameIdx(idx)
    setIndividualDragStart({ x: clientX, y: clientY })
    setIndividualDragLive({ x: 0, y: 0 })
    wasDraggingRef.current = false
  }, [])

  const handleIndividualDragMove = useCallback((e) => {
    if (activeDragFrameIdx === null) return
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY
    const deltaX = clientX - individualDragStart.x
    const deltaY = clientY - individualDragStart.y
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) wasDraggingRef.current = true
    setIndividualDragLive({ x: deltaX, y: deltaY })
  }, [activeDragFrameIdx, individualDragStart])

  const handleIndividualDragEnd = useCallback(() => {
    if (activeDragFrameIdx === null) return
    const prev = individualOffsets[activeDragFrameIdx] || { x: 0, y: 0 }
    setIndividualOffsets(o => ({
      ...o,
      [activeDragFrameIdx]: { x: prev.x + individualDragLive.x, y: prev.y + individualDragLive.y }
    }))
    setActiveDragFrameIdx(null)
    setIndividualDragLive({ x: 0, y: 0 })
  }, [activeDragFrameIdx, individualOffsets, individualDragLive])

  useEffect(() => {
    if (activeDragFrameIdx !== null) {
      window.addEventListener('mousemove', handleIndividualDragMove)
      window.addEventListener('mouseup', handleIndividualDragEnd)
      window.addEventListener('touchmove', handleIndividualDragMove, { passive: false })
      window.addEventListener('touchend', handleIndividualDragEnd)
      return () => {
        window.removeEventListener('mousemove', handleIndividualDragMove)
        window.removeEventListener('mouseup', handleIndividualDragEnd)
        window.removeEventListener('touchmove', handleIndividualDragMove)
        window.removeEventListener('touchend', handleIndividualDragEnd)
      }
    }
  }, [activeDragFrameIdx, handleIndividualDragMove, handleIndividualDragEnd])

  // Reset both group and individual positions to centre
  const resetPositions = useCallback(() => {
    setGroupOffset({ x: 0, y: 0 })
    setIndividualOffsets({})
  }, [])

  // Add global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('touchmove', handleDragMove, { passive: false })
      window.addEventListener('touchend', handleDragEnd)
      return () => {
        window.removeEventListener('mousemove', handleDragMove)
        window.removeEventListener('mouseup', handleDragEnd)
        window.removeEventListener('touchmove', handleDragMove)
        window.removeEventListener('touchend', handleDragEnd)
      }
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  // ===== CART HANDLERS =====

  const handleQuantityChange = (type, frameIdx, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [frameIdx]: parseInt(newQuantity)
      }
    }))
  }

  const handleAddToCart = () => {
    const artworksWithSize = {}
    Object.entries(selectedArtworks).forEach(([frameIdx, artwork]) => {
      const frameSize = selectedLayout?.frames[parseInt(frameIdx)]?.size || artwork.size
      artworksWithSize[frameIdx] = {
        ...artwork,
        frameSize: frameSize
      }
    })
    setCartItems({
      artworks: artworksWithSize,
      frames: { ...selectedFrames }
    })
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

  // ===== CHECKOUT =====

  const handleCheckout = async () => {
    console.log("=== CHECKOUT FUNCTION CALLED ===");
    console.log("Cart items:", cartItems);
    console.log("Quantities:", quantities);
    try {
      const lineItems = []
      Object.entries(cartItems.artworks).forEach(([frameIdx, artwork]) => {
        console.log('=== PROCESSING ARTWORK ===')
        console.log('Artwork title:', artwork.title)
        console.log('Artwork frameSize:', artwork.frameSize)
        console.log('Artwork has variants:', artwork.variants?.length || 0)
        let variantId = artwork.variants?.[0]?.id || artwork.shopifyProductId
        if (artwork.frameSize && artwork.variants && artwork.variants.length > 0) {
          const normalizedFrameSize = artwork.frameSize.replace(/\s+/g, '').toUpperCase().replace(/[×]/g, 'X')
          console.log('Normalized frame size to match:', normalizedFrameSize)
          console.log('Available variants:')
          artwork.variants.forEach((v, idx) => {
            console.log(`  ${idx + 1}. "${v.title}" (ID: ${v.id})`)
          })
          const matchingVariant = artwork.variants.find(variant => {
            const variantTitle = variant.title || ''
            const normalizedVariantTitle = variantTitle.replace(/\s+/g, '').toUpperCase().replace(/[×]/g, 'X')
            const matches = normalizedVariantTitle.includes(normalizedFrameSize)
            console.log(`  Comparing "${variantTitle}" -> "${normalizedVariantTitle}" contains "${normalizedFrameSize}"? ${matches}`)
            return matches
          })
          if (matchingVariant) {
            variantId = matchingVariant.id
            console.log('✓ FOUND MATCHING VARIANT:', matchingVariant.title, 'ID:', matchingVariant.id)
          } else {
            console.warn('✗ NO MATCH FOUND for size', artwork.frameSize, '- Using first variant:', artwork.variants[0]?.title)
          }
        } else {
          console.log('Skipping variant matching (no frameSize or no variants)')
        }
        const quantity = quantities.artworks?.[frameIdx] || 1
        console.log('Final: Variant ID:', variantId, 'Quantity:', quantity, 'Frame Size:', artwork.frameSize)
        console.log('=========================\n')
        if (variantId) {
          const lineItem = {
            variantId: variantId,
            quantity: quantity
          }
          if (artwork.frameSize) {
            lineItem.customAttributes = [
              { key: "Frame Size", value: artwork.frameSize }
            ]
          }
          lineItems.push(lineItem)
        }
      })
      console.log('Line items prepared:', lineItems)
      if (lineItems.length === 0) {
        alert('Please add items to cart before checkout')
        return
      }
      console.log('Creating checkout with line items:', lineItems)
      const checkout = await createCheckout(lineItems)
      console.log('Checkout response:', checkout)
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

  // ===== RESET =====

  const handleReset = () => {
    localStorage.removeItem('galleryCurrentStep')
    localStorage.removeItem('gallerySelectedPlace')
    localStorage.removeItem('gallerySelectedBackground')
    localStorage.removeItem('gallerySelectedLayout')
    localStorage.removeItem('galleryActiveVariants')
    localStorage.removeItem('gallerySelectedArtworks')
    localStorage.removeItem('gallerySelectedFrames')
    localStorage.removeItem('galleryCart')
    localStorage.removeItem('galleryQuantities')
    setCurrentStep('step1')
    setSelectedPlace(null)
    setSelectedBackground(null)
    setSelectedLayout(DEFAULT_LAYOUT)
    setActiveVariants({})
    setSelectedArtworks({})
    setSelectedFrames({})
    setCartItems({ artworks: {}, frames: {} })
    setQuantities({ artworks: {}, frames: {} })
    setActiveFrameIndex(null)
    setActiveFrameForStyle(null)
    setExpandedSection(null)
    setShowFilter(false)
    setSearchQuery('')
    setSelectedColorFilters([])
    setShowCart(false)
    setShowResetModal(false)
    setPrintOrientation('Portrait')
    setPrintSize('13 × 18')
    setPrintStyle('Black')
    setMeasurementUnit('cm')
    setWallScale(0)
    setGroupOffset({ x: 0, y: 0 })
  }

  const value = {
    // Mobile / Fullscreen
    isMobile, isLandscape, isIOS, showRotatePrompt, setShowRotatePrompt,
    isFullscreen, enterFullscreen, exitFullscreen,
    // Steps
    currentStep, setCurrentStep,
    // Selections
    selectedPlace, setSelectedPlace,
    selectedBackground, setSelectedBackground,
    selectedLayout, setSelectedLayout,
    activeVariants, setActiveVariants,
    expandedSection, setExpandedSection,
    selectedArtworks, setSelectedArtworks,
    activeFrameIndex, setActiveFrameIndex,
    selectedFrames, setSelectedFrames,
    activeFrameForStyle, setActiveFrameForStyle,
    // Products
    artworkProducts, isLoadingProducts,
    // Filters
    showFilter, setShowFilter,
    searchQuery, setSearchQuery,
    selectedColorFilters, setSelectedColorFilters,
    selectedOrientationFilters, setSelectedOrientationFilters,
    selectedSizeFilters, setSelectedSizeFilters,
    selectedStyleFilters, setSelectedStyleFilters,
    selectedCollectionFilters, setSelectedCollectionFilters,
    selectedArtistFilters, setSelectedArtistFilters,
    selectedRoomFilters, setSelectedRoomFilters,
    expandedFilterSection, setExpandedFilterSection,
    toggleFilter,
    getArtworksForFrameSize,
    // Cart
    showCart, setShowCart,
    cartItems, setCartItems,
    quantities, setQuantities,
    showCartDropdown, setShowCartDropdown,
    // Scroll
    displayedArtworkCount, setDisplayedArtworkCount,
    isLoadingMore,
    artworkScrollRef,
    // Modals
    showLayoutChangeModal, setShowLayoutChangeModal,
    pendingLayout, setPendingLayout,
    showEmptyArtworkModal, setShowEmptyArtworkModal,
    showResetModal, setShowResetModal,
    showMobileMenu, setShowMobileMenu,
    // Customize prints settings
    measurementUnit, setMeasurementUnit,
    printOrientation, setPrintOrientation,
    printStyle, setPrintStyle,
    printSize, setPrintSize,
    perFrameSizes, setPerFrameSizes,
    spacingPreset, setSpacingPreset,
    spacingValue, setSpacingValue,
    innerShadow, setInnerShadow,
    // Canvas overlay controls
    wallScale, setWallScale,
    showGrid, setShowGrid,
    showRuler, setShowRuler,
    // Undo / Redo
    undo, redo, canUndo, canRedo,
    // Saved
    savedGalleryWalls, setSavedGalleryWalls,
    // Drag
    groupOffset, setGroupOffset,
    isDragging, dragOffset,
    wasDraggingRef, canvasRef,
    handleDragStart,
    // Lock / individual drag
    isLocked, setIsLocked,
    individualOffsets, activeDragFrameIdx, individualDragLive,
    handleIndividualDragStart,
    resetPositions,
    // Handlers
    handleQuantityChange,
    handleAddToCart,
    handleCheckout,
    handleReset,
    calculateTotalPrice,
    calculateCartTotal,
  }

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  )
}

export function useGallery() {
  const context = useContext(GalleryContext)
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider')
  }
  return context
}
