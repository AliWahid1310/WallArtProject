import { useMemo } from 'react'
import { useGallery } from '../../context/GalleryContext'
import {
  colorOptions,
  styleOptions,
  collectionOptions,
  artistOptions,
  backgroundOptions,
} from '../../data'
import { TopNavBar, Breadcrumb, MobileBottomNav, MobileMenuModal, ResetModal } from '../layout'
import { MobileFilterPanel } from '../filters'
import { processMobileFrames } from '../canvas'
import { getDynamicFrames } from '../../utils/helpers'
import Ruler from '../Ruler'

export default function SelectDesignStep() {

const PRINT_STYLE_OPTIONS = ['Black', 'White', 'Light Oak', 'Walnut']

const FRAME_STYLE_COLORS = {
  Black:      { border: '#1a1a1a', shadow: 'rgba(0,0,0,0.45)' },
  White:      { border: '#f0f0f0', shadow: 'rgba(0,0,0,0.15)' },
  'Light Oak': { border: '#c8a876', shadow: 'rgba(0,0,0,0.25)' },
  Walnut:     { border: '#4a2c2a', shadow: 'rgba(0,0,0,0.35)' },
}

const PRINT_SIZES = {
  Landscape: {
    cm: ['18 × 13', '35 × 27', '40 × 30', '50 × 40', '60 × 40', '70 × 50', '80 × 60', '90 × 60', '100 × 70', '100 × 75', '29.7 × 21', '42 × 29.7', '59.4 × 42', '84.1 × 59.5', '118.9 × 84.1'],
    in: ['7 × 5', '14 × 11', '16 × 12', '20 × 16', '24 × 16', '28 × 20', '32 × 24', '36 × 24', '40 × 28', '40 × 30', 'A4', 'A3', 'A2', 'A1', 'A0'],
  },
  Portrait: {
    cm: ['13 × 18', '27 × 35', '30 × 40', '40 × 50', '40 × 60', '50 × 70', '60 × 80', '60 × 90', '70 × 100', '75 × 100', '21 × 29.7', '29.7 × 42', '42 × 59.4', '59.5 × 84.1', '84.1 × 118.9'],
    in: ['5 × 7', '11 × 14', '12 × 16', '16 × 20', '16 × 24', '20 × 28', '24 × 32', '24 × 36', '28 × 40', '30 × 40', 'A4', 'A3', 'A2', 'A1', 'A0'],
  },
  Square: {
    cm: ['25 × 25', '30 × 30', '35 × 35', '40 × 40', '45 × 45', '50 × 50', '70 × 70'],
    in: ['10 × 10', '12 × 12', '14 × 14', '16 × 16', '18 × 18', '20 × 20', '28 × 28'],
  },
  Mix: {
    cm: ['13 × 18', '27 × 35', '30 × 40', '40 × 50', '40 × 60', '50 × 70', '60 × 80', '60 × 90', '70 × 100', '75 × 100', '21 × 29.7', '29.7 × 42', '42 × 59.4', '59.5 × 84.1', '84.1 × 118.9'],
    in: ['5 × 7', '11 × 14', '12 × 16', '16 × 20', '16 × 24', '20 × 28', '24 × 32', '24 × 36', '28 × 40', '30 × 40', 'A4', 'A3', 'A2', 'A1', 'A0'],
  },
}
  const {
    setCurrentStep,
    selectedLayout,
    selectedBackground,
    selectedArtworks, setSelectedArtworks,
    activeFrameIndex, setActiveFrameIndex,
    selectedFrames,
    showFilter, setShowFilter,
    searchQuery, setSearchQuery,
    selectedColorFilters, setSelectedColorFilters,
    selectedStyleFilters, setSelectedStyleFilters,
    selectedCollectionFilters, setSelectedCollectionFilters,
    selectedArtistFilters, setSelectedArtistFilters,
    toggleFilter,
    getArtworksForFrameSize,
    showCart, setShowCart,
    cartItems, setCartItems,
    quantities, setQuantities,
    showEmptyArtworkModal, setShowEmptyArtworkModal,
    showMobileMenu, setShowMobileMenu,
    displayedArtworkCount,
    isLoadingMore,
    artworkScrollRef,
    handleAddToCart,
    handleCheckout,
    calculateCartTotal,
    isMobile,
    isDragging,
    groupOffset, dragOffset,
    handleDragStart,
    wasDraggingRef,
    canvasRef,
    showResetModal, setShowResetModal,
    handleReset,
    handleQuantityChange,
    printOrientation,
    printStyle, setPrintStyle,
    printSize, setPrintSize,
    measurementUnit, setMeasurementUnit,
    innerShadow,
    wallScale, setWallScale,
    showGrid, setShowGrid,
    showRuler, setShowRuler,
    undo, redo, canUndo, canRedo,
    selectedPlace,
  } = useGallery()

  // Compute dynamically-sized frames when a print size is selected
  const dynamicFrames = useMemo(() =>
    getDynamicFrames(selectedLayout?.frames, printSize, measurementUnit, printOrientation, wallScale),
    [selectedLayout, printSize, measurementUnit, printOrientation, wallScale]
  )

  // Get available artworks for the currently active frame
  const activeFrame = activeFrameIndex !== null && selectedLayout ? selectedLayout.frames[activeFrameIndex] : null
  const availableArtworks = activeFrame ? getArtworksForFrameSize(activeFrame.size) : []

  const innerShadowCSS = `inset ${innerShadow.xOffset}px ${innerShadow.yOffset}px ${innerShadow.blur}px ${innerShadow.spread}px rgba(0,0,0,${(innerShadow.opacity / 100).toFixed(1)})`

  const unit = measurementUnit === 'cm' ? 'cm' : 'in'
  const sizeOptions = PRINT_SIZES[printOrientation]?.[unit] || PRINT_SIZES['Portrait'][unit]

  const handleUnitChange = (newUnit) => {
    setMeasurementUnit(newUnit)
    const sizes = PRINT_SIZES[printOrientation]?.[newUnit] || PRINT_SIZES['Landscape'][newUnit]
    if (sizes?.length) setPrintSize(sizes[0])
  }

  // Resolve the human-readable background label
  const getBackgroundLabel = () => {
    if (!selectedBackground) return ''
    for (const section of backgroundOptions) {
      for (const v of section.variants) {
        if (v.id === selectedBackground.id) return (section.label || section.section).toUpperCase()
      }
    }
    return ''
  }

  // Layout name for the subtitle
  const layoutLabel = selectedLayout?.name || selectedLayout?.label || 'Select a layout'

  // Determine orientation label from active frame
  const getOrientationLabel = () => {
    if (!activeFrame) return ''
    const [w, h] = activeFrame.size.split(/x/i).map(Number)
    if (w > h) return 'LANDSCAPE'
    if (h > w) return 'PORTRAIT'
    return 'SQUARE'
  }

  // Dropdown arrow style for selects
  const selectArrowStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em',
    paddingRight: '2.5rem',
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedColorFilters([])
    setSelectedStyleFilters([])
    setSelectedCollectionFilters([])
    setSelectedArtistFilters([])
  }

  // Handle single-select filter dropdown changes
  const handleColorDropdown = (val) => {
    if (val === 'All') {
      setSelectedColorFilters([])
    } else {
      setSelectedColorFilters([val])
    }
  }

  const handleCategoryDropdown = (val) => {
    if (val === 'All') {
      setSelectedCollectionFilters([])
    } else {
      setSelectedCollectionFilters([val])
    }
  }

  const handleStyleDropdown = (val) => {
    if (val === 'All') {
      setSelectedStyleFilters([])
    } else {
      setSelectedStyleFilters([val])
    }
  }

  const handleArtistDropdown = (val) => {
    if (val === 'All') {
      setSelectedArtistFilters([])
    } else {
      setSelectedArtistFilters([val])
    }
  }

  return (
    <>
      <ResetModal />
      <div className="h-screen bg-white flex flex-col overflow-hidden">
        <TopNavBar />
        <Breadcrumb />
        {/* Mobile/Desktop Layout Container */}
        <div className="flex flex-row flex-1 overflow-hidden pb-12 lg:pb-0">
          {/* Left Sidebar */}
          <div className="flex w-28 lg:w-80 bg-white border-r border-gray-300 flex-col h-full">

            {/* Mobile: Header */}
            <div className="lg:hidden flex-shrink-0 mb-1 border-b border-gray-200 pb-1 pt-1 px-1">
              <p className="text-[7px] font-bold tracking-wide text-gray-500">SELECT ART</p>
            </div>

            {/* Scrollable sidebar content */}
            <div ref={artworkScrollRef} className="flex-1 overflow-y-auto px-1 lg:px-5 py-1 lg:py-3">

              {/* Desktop: Header with refresh icon */}
              <div className="hidden lg:flex items-center justify-between pb-1">
                <h2 className="text-lg font-bold text-gray-900">Select Art</h2>
                <button
                  onClick={handleClearFilters}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer rounded-full hover:bg-gray-100"
                  title="Reset filters"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

              {/* Desktop: Subtitle - orientation + print number */}
              <div className="hidden lg:flex items-center gap-2 pb-4">
                {activeFrame && (
                  <>
                    <span className="text-[10px] font-bold tracking-widest text-gray-400">{getOrientationLabel()} PRINTS ONLY</span>
                    <span className="text-[10px] text-gray-300">·</span>
                    <span className="text-[10px] font-bold tracking-widest text-gray-400">PRINT #{activeFrameIndex !== null ? activeFrameIndex + 1 : '–'}</span>
                  </>
                )}
                {!activeFrame && (
                  <span className="text-[10px] font-bold tracking-widest text-gray-400">CLICK A FRAME TO SELECT ART</span>
                )}
              </div>

              {/* Desktop: Filter Dropdowns - 2x2 grid */}
              <div className="hidden lg:grid grid-cols-2 gap-3 pb-4">
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-gray-500 mb-1.5 block">COLOR</label>
                  <select
                    value={selectedColorFilters.length > 0 ? selectedColorFilters[0] : 'All'}
                    onChange={e => handleColorDropdown(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#4a6741] cursor-pointer appearance-none"
                    style={selectArrowStyle}
                  >
                    <option value="All">All</option>
                    {colorOptions.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-gray-500 mb-1.5 block">CATEGORY</label>
                  <select
                    value={selectedCollectionFilters.length > 0 ? selectedCollectionFilters[0] : 'All'}
                    onChange={e => handleCategoryDropdown(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#4a6741] cursor-pointer appearance-none"
                    style={selectArrowStyle}
                  >
                    <option value="All">All</option>
                    {collectionOptions.map(c => <option key={c.value} value={c.value}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-gray-500 mb-1.5 block">STYLE</label>
                  <select
                    value={selectedStyleFilters.length > 0 ? selectedStyleFilters[0] : 'All'}
                    onChange={e => handleStyleDropdown(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#4a6741] cursor-pointer appearance-none"
                    style={selectArrowStyle}
                  >
                    <option value="All">All</option>
                    {styleOptions.map(s => <option key={s.value} value={s.value}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-widest text-gray-500 mb-1.5 block">ARTIST</label>
                  <select
                    value={selectedArtistFilters.length > 0 ? selectedArtistFilters[0] : 'All'}
                    onChange={e => handleArtistDropdown(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#4a6741] cursor-pointer appearance-none"
                    style={selectArrowStyle}
                  >
                    <option value="All">All</option>
                    {artistOptions.map(a => <option key={a.value} value={a.value}>{a.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Mobile: Quick filter toggle */}
              <div className="lg:hidden mb-1">
                <button 
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center gap-1 text-[8px] font-bold text-black hover:text-gray-600 transition-colors cursor-pointer py-0.5 border-b border-gray-200"
                >
                  {showFilter ? 'HIDE FILTER' : 'SHOW FILTER'}
                  <span className="text-[8px]">×</span>
                </button>
              </div>

              {/* Art Grid */}
              {activeFrameIndex === null ? (
                /* Show instructions when no frame is selected */
                <div className="flex flex-col items-center justify-center h-48 lg:h-64 text-center px-2">
                  <div className="mb-2 lg:mb-4">
                    <svg className="w-8 h-8 lg:w-14 lg:h-14 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-[9px] lg:text-sm font-semibold text-gray-600 mb-1">
                    Click on a frame to select art
                  </p>
                  <p className="text-[8px] lg:text-xs text-gray-400">
                    Select each frame on the wall to choose artwork
                  </p>
                </div>
              ) : (
                <div>
                  {availableArtworks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">No artworks available</p>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-2 gap-1.5 lg:gap-3">
                        {/* ADD ART placeholder card - first item */}
                        <div
                          onClick={() => {
                            // Clear current selection for this frame
                            const newArtworks = { ...selectedArtworks }
                            delete newArtworks[activeFrameIndex]
                            setSelectedArtworks(newArtworks)
                          }}
                          className="cursor-pointer group"
                        >
                          <div className="aspect-square lg:aspect-[3/4] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-[#4a6741] hover:bg-gray-50 transition-all duration-200">
                            <span className="text-xl lg:text-3xl text-gray-300 group-hover:text-[#4a6741] transition-colors mb-1">+</span>
                            <span className="text-[7px] lg:text-xs font-semibold text-gray-400 group-hover:text-[#4a6741] tracking-wide transition-colors">ADD ART</span>
                          </div>
                        </div>

                        {/* Artwork cards */}
                        {availableArtworks.slice(0, displayedArtworkCount).map((artwork) => (
                          <div
                            key={artwork.id}
                            onClick={() => {
                              setSelectedArtworks({
                                ...selectedArtworks,
                                [activeFrameIndex]: artwork
                              })
                            }}
                            className={`relative cursor-pointer transition-all duration-200 group rounded-xl overflow-hidden ${
                              selectedArtworks[activeFrameIndex]?.id === artwork.id
                                ? 'ring-2 ring-[#4a6741] ring-offset-1'
                                : 'hover:shadow-lg'
                            }`}
                          >
                            {/* Artwork Image */}
                            <div className="relative aspect-square lg:aspect-[3/4] bg-gray-100 overflow-hidden rounded-t-xl">
                              <img 
                                src={artwork.image}
                                alt={artwork.title}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {selectedArtworks[activeFrameIndex]?.id === artwork.id && (
                                <div className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2 bg-[#4a6741] text-white rounded-full w-4 h-4 lg:w-6 lg:h-6 flex items-center justify-center">
                                  <svg className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </div>

                            {/* Artwork Info - artist + title */}
                            <div className="p-1 lg:p-2.5 bg-white">
                              {artwork.artists && artwork.artists.length > 0 && (
                                <p className="text-[6px] lg:text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-0.5 truncate">
                                  {artwork.artists[0]}
                                </p>
                              )}
                              <h3 className="text-[7px] lg:text-xs font-semibold text-gray-800 line-clamp-1">{artwork.title}</h3>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Show count & loading */}
                      <div className="text-center py-2 mt-1">
                        <p className="text-[7px] lg:text-[10px] text-gray-400">
                          Showing {Math.min(displayedArtworkCount, availableArtworks.length)} of {availableArtworks.length} products
                        </p>
                      </div>
                      {isLoadingMore && displayedArtworkCount < availableArtworks.length && (
                        <div className="flex justify-center py-2">
                          <div className="flex items-center gap-2 text-gray-400">
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-xs">Loading more...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Navigation Buttons - pinned */}
            <div className="hidden lg:block flex-shrink-0 px-5 py-3 border-t border-gray-200">
              <button 
                onClick={() => {
                  const hasArtworks = Object.keys(selectedArtworks).length > 0
                  if (!hasArtworks) {
                    setShowEmptyArtworkModal(true)
                  } else {
                    setCurrentStep("checkout")
                  }
                }}
                className="w-full bg-[#4a6741] text-white py-2.5 font-bold text-xs tracking-widest rounded-lg hover:bg-[#3d5636] transition-all duration-200 cursor-pointer"
              >
                CHECKOUT &gt;
              </button>
              <button
                onClick={() => {
                  setActiveFrameIndex(null)
                  setCurrentStep("step2")
                }}
                className="w-full text-gray-400 py-1.5 font-medium text-xs hover:text-gray-600 transition-colors cursor-pointer flex items-center justify-center gap-1 mt-1"
              >
                ← PREVIOUS STEP
              </button>
            </div>

            {/* Mobile: Bottom buttons */}
            <div className="lg:hidden flex-shrink-0 px-1 py-1.5 border-t border-gray-200 space-y-1">
              <button 
                onClick={() => {
                  const hasArtworks = Object.keys(selectedArtworks).length > 0
                  if (!hasArtworks) {
                    setShowEmptyArtworkModal(true)
                  } else {
                    if (isMobile) {
                      const artworksWithSize = {}
                      Object.entries(selectedArtworks).forEach(([frameIdx, artwork]) => {
                        const frameSize = selectedLayout?.frames[parseInt(frameIdx)]?.size || artwork.size
                        artworksWithSize[frameIdx] = { ...artwork, frameSize }
                      })
                      setCartItems({ artworks: artworksWithSize, frames: { ...selectedFrames } })
                      const newQuantities = { ...quantities }
                      Object.keys(selectedArtworks).forEach(frameIdx => {
                        if (!newQuantities.artworks[frameIdx]) newQuantities.artworks[frameIdx] = 1
                      })
                      Object.keys(selectedFrames).forEach(frameIdx => {
                        if (!newQuantities.frames[frameIdx]) newQuantities.frames[frameIdx] = 1
                      })
                      setQuantities(newQuantities)
                    }
                    setCurrentStep("checkout")
                  }
                }}
                className="w-full bg-black text-white py-2 font-bold text-[10px] tracking-widest"
              >
                NEXT
              </button>
              <button 
                onClick={() => setCurrentStep("step1")}
                className="w-full bg-white text-black py-1.5 font-bold text-[10px] tracking-wide border-2 border-black flex items-center justify-center gap-1"
              >
                <span className="text-xs">✕</span> CLOSE
              </button>
            </div>
          </div>

          {/* Mobile: Filter Panel */}
          <MobileFilterPanel />

          {/* ========== RIGHT SECTION ========== */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* ---- Canvas Header Bar ---- */}
            <div className="hidden lg:flex items-center justify-between px-5 py-2.5 border-b border-gray-200 bg-white flex-shrink-0">
              <div className="flex-shrink-0">
                <h3 className="text-sm font-extrabold tracking-wide text-gray-900 uppercase leading-tight">
                  {getBackgroundLabel() || 'SELECT A BACKGROUND'}
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Previewing Layout: {layoutLabel}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="tracking-wide leading-tight text-left">DRAG TO REPOSITION<br/>GALLERY</span>
                </button>
                <div className="w-px h-8 bg-gray-200 mx-1" />
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold rounded transition-colors cursor-pointer ${
                    showGrid ? 'text-[#4a6741] bg-green-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                  <span className="tracking-wide leading-tight text-left">GRID<br/>{showGrid ? 'ON' : 'OFF'}</span>
                </button>
                <div className="w-px h-8 bg-gray-200 mx-1" />
                <button
                  onClick={() => setShowRuler(!showRuler)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold rounded transition-colors cursor-pointer ${
                    showRuler ? 'text-[#4a6741] bg-green-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                  </svg>
                  <span className="tracking-wide">RULER</span>
                </button>
                <div className="w-px h-8 bg-gray-200 mx-1" />
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                  <span className="tracking-wide">ENLARGE</span>
                </button>
              </div>
            </div>

            {/* ---- Canvas Area ---- */}
            <div className="flex-1 flex flex-col overflow-hidden no-scroll-fullscreen">
              <div
                ref={canvasRef}
                className="flex-1 relative bg-cover bg-center overflow-hidden transition-all duration-500"
                style={{
                  backgroundImage: selectedBackground
                    ? `url(${selectedBackground.image})`
                    : selectedPlace
                      ? `url(${selectedPlace.image})`
                      : "url(https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/welcome-bg.jpg?v=1)",
                }}
              >
                {/* Grid Overlay */}
                {showGrid && (
                  <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                    }}
                  />
                )}

                {/* Ruler Overlay */}
                {showRuler && (
                  <Ruler onClose={() => setShowRuler(false)} />
                )}

                {/* Frame Preview on Canvas */}
                {selectedLayout && dynamicFrames ? (
                  <div
                    className={`absolute inset-0 ${isMobile ? 'flex items-center justify-center' : ''}`}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    style={{
                      cursor: isDragging ? 'grabbing' : 'default',
                      transform: `translate(${groupOffset.x + dragOffset.x}px, ${groupOffset.y + dragOffset.y}px)`,
                      transformOrigin: 'center center',
                      transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 1.2)'
                    }}
                  >
                    {isMobile ? (
                      <div className="relative flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                        {(() => {
                          const { processedFrames, centerOffsetX, centerOffsetY, scale } = processMobileFrames(dynamicFrames, 0.6)
                          const frameColor = FRAME_STYLE_COLORS[printStyle] || FRAME_STYLE_COLORS.Black
                          return processedFrames.map((frame, idx) => (
                            <div key={idx} className="absolute select-none" style={{
                              left: `${frame.calcLeft * scale + centerOffsetX}%`,
                              top: `${frame.calcTop * scale + centerOffsetY}%`,
                            }}>
                              <div
                                onClick={() => {
                                  if (!wasDraggingRef.current) setActiveFrameIndex(frame.idx)
                                  wasDraggingRef.current = false
                                }}
                                className={`bg-white flex items-center justify-center overflow-hidden cursor-pointer group ${
                                  activeFrameIndex === frame.idx ? 'z-20' : 'z-10'
                                }`}
                                style={{
                                  width: `${frame.width * scale}vw`,
                                  height: `${frame.height * scale}vw`,
                                  border: `${Math.max(1, frame.borderWidth - 1)}px solid ${frameColor.border}`,
                                  borderRadius: '1px',
                                  boxShadow: `0 4px 16px ${frameColor.shadow}, inset 0 0 0 1px rgba(255,255,255,0.1)`,
                                }}
                              >
                                {selectedArtworks[frame.idx] ? (
                                  <img src={selectedArtworks[frame.idx].image} alt={selectedArtworks[frame.idx].title} className="w-full h-full object-contain bg-gray-100 pointer-events-none" draggable={false} />
                                ) : (
                                  <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                  </svg>
                                )}
                              </div>
                              <div className="mt-0.5 text-center">
                                <span className="bg-white/90 text-gray-600 text-[6px] font-bold tracking-wider px-1.5 py-0.5 rounded whitespace-nowrap uppercase">
                                  {frame.size}{/^A\d$/i.test(frame.size) ? '' : ` ${measurementUnit.toUpperCase()}`}
                                </span>
                              </div>
                            </div>
                          ))
                        })()}
                      </div>
                    ) : (
                      (() => {
                        const frameColor = FRAME_STYLE_COLORS[printStyle] || FRAME_STYLE_COLORS.Black
                        return dynamicFrames.map((frame, idx) => {
                          const artwork = selectedArtworks[idx]
                          return (
                            <div
                              key={idx}
                              className="absolute select-none"
                              style={{
                                top: `${frame.centerY}%`,
                                left: `${frame.centerX}%`,
                                width: frame.width,
                                aspectRatio: frame.aspectRatio,
                                transform: 'translate(-50%, -50%)',
                              }}
                            >
                              <div
                                onClick={() => {
                                  if (!wasDraggingRef.current) setActiveFrameIndex(idx)
                                  wasDraggingRef.current = false
                                }}
                                className={`w-full h-full bg-white flex items-center justify-center overflow-hidden cursor-pointer group relative ${
                                  activeFrameIndex === idx ? 'z-20' : 'z-10'
                                }`}
                                style={{
                                  border: `${frame.borderWidth}px solid ${frameColor.border}`,
                                  borderRadius: '2px',
                                  boxShadow: `0 6px 24px ${frameColor.shadow}, 0 2px 8px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.08)`,
                                }}
                              >
                                {artwork ? (
                                  <>
                                    <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover pointer-events-none" draggable={false} />
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none" />
                                    <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                      CHANGE
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        const newArtworks = { ...selectedArtworks }
                                        delete newArtworks[idx]
                                        setSelectedArtworks(newArtworks)
                                      }}
                                      onMouseDown={(e) => e.stopPropagation()}
                                      className="absolute top-2 left-2 bg-white text-black w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white shadow-lg cursor-pointer"
                                      title="Remove design"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </>
                                ) : (
                                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                  </svg>
                                )}
                              </div>
                              <div className="mt-1 flex justify-center">
                                <span className="bg-white/90 backdrop-blur-sm text-gray-600 text-[8px] font-bold tracking-wider px-2 py-0.5 rounded shadow-sm whitespace-nowrap uppercase">
                                  {frame.size}{/^A\d$/i.test(frame.size) ? '' : ` ${measurementUnit.toUpperCase()}`}
                                </span>
                              </div>
                            </div>
                          )
                        })
                      })()
                    )}
                  </div>
                ) : (
                  !selectedPlace && !selectedBackground && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm px-6 lg:px-12 py-4 lg:py-8 rounded-lg shadow-xl">
                        <p className="text-xs lg:text-2xl font-light text-gray-700 text-center">
                          Select a room to continue
                        </p>
                      </div>
                    </div>
                  )
                )}
                
                {/* ---- Canvas Overlay Controls ---- */}
                <div className="hidden lg:flex absolute top-4 left-4 z-20 items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-md">
                  <span className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">Wall Scale</span>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={wallScale}
                    onChange={(e) => setWallScale(parseInt(e.target.value))}
                    className="w-24 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#4a6741]"
                  />
                  <span className="text-[9px] font-bold text-gray-500 min-w-[20px] text-right">{wallScale}</span>
                </div>
                <div className="hidden lg:flex absolute top-4 right-4 z-20 items-center gap-2">
                  <button
                    onClick={undo}
                    disabled={!canUndo}
                    className={`w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center transition-colors cursor-pointer ${canUndo ? 'hover:bg-gray-100' : 'opacity-40 cursor-default'}`}
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                  </button>
                  <button
                    onClick={redo}
                    disabled={!canRedo}
                    className={`w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center transition-colors cursor-pointer ${canRedo ? 'hover:bg-gray-100' : 'opacity-40 cursor-default'}`}
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
                    </svg>
                  </button>
                </div>
                <div className="hidden lg:flex absolute bottom-4 left-4 z-20">
                  <button
                    onClick={() => handleUnitChange('cm')}
                    className={`px-3 py-1.5 text-[10px] font-bold tracking-wide border transition-all duration-150 cursor-pointer rounded-l-md ${
                      measurementUnit === 'cm'
                        ? 'bg-[#4a6741] text-white border-[#4a6741]'
                        : 'bg-white/90 text-gray-400 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    CM
                  </button>
                  <button
                    onClick={() => handleUnitChange('in')}
                    className={`px-3 py-1.5 text-[10px] font-bold tracking-wide border-t border-b border-r transition-all duration-150 cursor-pointer rounded-r-md ${
                      measurementUnit === 'in'
                        ? 'bg-[#4a6741] text-white border-[#4a6741]'
                        : 'bg-white/90 text-gray-400 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    IN
                  </button>
                </div>
                <div className="hidden lg:flex absolute bottom-4 right-4 z-20 items-center gap-2">
                  <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* ---- Bottom Bar: Print Size + Frame Style + Description ---- */}
            <div className="hidden lg:flex items-center gap-6 px-6 py-3 border-t border-gray-200 bg-white flex-shrink-0">
              <div className="flex-shrink-0">
                <label className="block text-[9px] font-bold tracking-widest text-gray-400 mb-1">PRINT SIZE</label>
                <div className="relative">
                  <select
                    value={printSize}
                    onChange={(e) => setPrintSize(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#4a6741] cursor-pointer appearance-none pr-8 min-w-[140px]"
                    style={selectArrowStyle}
                  >
                    <option value="">Select size...</option>
                    {sizeOptions.map(s => <option key={s} value={s}>{s.startsWith('A') ? s : `${s} ${unit === 'in' ? '"' : unit}`}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex-shrink-0">
                <label className="block text-[9px] font-bold tracking-widest text-gray-400 mb-1">YOUR FRAME STYLE</label>
                <div className="relative">
                  <select
                    value={printStyle}
                    onChange={(e) => setPrintStyle(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#4a6741] cursor-pointer appearance-none pr-8 min-w-[120px]"
                    style={selectArrowStyle}
                  >
                    {PRINT_STYLE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex-1 text-right">
                <p className="text-sm text-gray-400 italic leading-snug">
                  {selectedPlace
                    ? `A ${selectedPlace.name?.toLowerCase()} is the heart of the home.`
                    : 'Choose a room to begin.'}
                </p>
              </div>
            </div>

            <MobileBottomNav />
          </div>{/* End of Right Section */}

          {/* Validation Modal - No Artworks Selected */}
          {showEmptyArtworkModal && (
            <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className="bg-white p-6 sm:p-8 max-w-md w-full relative shadow-2xl border border-gray-200 rounded-lg">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-yellow-100 mb-4">
                    <svg className="h-7 w-7 sm:h-8 sm:w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">No Designs Selected</h2>
                  <p className="text-sm text-gray-600 mb-5">
                    Please select at least one design for your gallery wall before proceeding to checkout.
                  </p>
                  <button
                    onClick={() => setShowEmptyArtworkModal(false)}
                    className="w-full bg-black text-white px-6 py-2.5 font-bold text-xs tracking-wider hover:bg-gray-800 transition-all duration-200 cursor-pointer rounded"
                  >
                    OK, GOT IT
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Bottom Menu Bar */}
          <div className="lg:hidden fixed bottom-0 left-28 right-0 bg-white border-t border-gray-300 flex items-center z-40">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="px-2 py-2 text-[8px] font-bold tracking-wide text-black hover:bg-gray-100 transition-colors cursor-pointer border-r border-gray-300 flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              MENU
            </button>
            <button 
              className="flex-1 px-3 py-3 text-[9px] font-bold tracking-wide text-black hover:bg-gray-100 transition-colors cursor-pointer border-r border-gray-300 flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              SAVED GALLERY WALLS
            </button>
            <button 
              onClick={() => setShowCart(!showCart)}
              className="relative px-3 py-3 hover:bg-gray-100 transition-colors cursor-pointer border-r border-gray-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                {Object.keys(cartItems.artworks).length + Object.keys(cartItems.frames).length}
              </span>
            </button>
            <button 
              onClick={handleAddToCart}
              className="px-4 py-3 text-[10px] font-bold tracking-wide bg-black text-white hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              ADD TO 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              £{(Object.keys(cartItems.artworks).length > 0 || Object.keys(cartItems.frames).length > 0) ? calculateCartTotal() : '0'}
            </button>
          </div>
        </div>{/* End of flex-row container */}
      </div>

      <MobileMenuModal />
    </>
  )
}
