import { useMemo } from 'react'
import { useGallery } from '../../context/GalleryContext'
import { backgroundOptions } from '../../data'
import { TopNavBar, Breadcrumb, MobileBottomNav, MobileMenuModal, ResetModal } from '../layout'
import { processMobileFrames } from '../canvas'
import { getDynamicFrames } from '../../utils/helpers'
import Ruler from '../Ruler'

export default function CheckoutStep() {

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
    selectedArtworks,
    selectedFrames,
    activeFrameIndex, setActiveFrameIndex,
    showCart, setShowCart,
    cartItems, setCartItems,
    quantities,
    showMobileMenu, setShowMobileMenu,
    showResetModal, setShowResetModal,
    isMobile,
    isDragging,
    groupOffset, dragOffset,
    handleDragStart,
    wasDraggingRef,
    handleQuantityChange,
    handleAddToCart,
    handleCheckout,
    handleReset,
    calculateTotalPrice,
    calculateCartTotal,
    canvasRef,
    selectedPlace,
    printStyle, setPrintStyle,
    printSize, setPrintSize,
    measurementUnit, setMeasurementUnit,
    printOrientation,
    innerShadow,
    wallScale, setWallScale,
    showGrid, setShowGrid,
    showRuler, setShowRuler,
    undo, redo, canUndo, canRedo,
  } = useGallery()

  // Compute dynamically-sized frames when a print size is selected
  const dynamicFrames = useMemo(() =>
    getDynamicFrames(selectedLayout?.frames, printSize, measurementUnit, printOrientation, wallScale),
    [selectedLayout, printSize, measurementUnit, printOrientation, wallScale]
  )

  const totalPrice = calculateTotalPrice()
  const currency = selectedArtworks[Object.keys(selectedArtworks)[0]]?.currency || '£'

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

  // Dropdown arrow style
  const selectArrowStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em',
    paddingRight: '2.5rem',
  }

  return (
    <>
      <ResetModal />
      <div className="h-screen bg-white flex flex-col overflow-hidden">
        <TopNavBar />
        <Breadcrumb />
        <div className="flex flex-row flex-1 overflow-hidden">
        {/* Left Sidebar - Summary */}
        <div className="w-28 lg:w-80 border-r border-gray-200 flex flex-col h-full">

          {/* Completed Steps */}
          <div className="flex-1 overflow-y-auto px-1 lg:px-6 py-2 lg:py-6">
            <div className="space-y-2 lg:space-y-8">
              {/* Step 1 - Choose Room */}
              <button
                onClick={() => setCurrentStep("step1")}
                className="w-full text-center cursor-pointer transition-all duration-200 py-2 lg:py-3 group relative"
              >
                <div className="absolute top-0 left-2 lg:left-12 text-gray-400 text-[10px] lg:text-sm">
                  ✓
                </div>
                <div className="flex justify-center mb-2 lg:mb-4">
                  <img 
                    src="https://cdn2.iconfinder.com/data/icons/travel-locations/24/house-512.png" 
                    alt="Choose Room" 
                    className="w-6 h-6 lg:w-8 lg:h-8 object-contain opacity-40 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <p className="text-[10px] lg:text-sm font-semibold mb-0.5 lg:mb-1 text-gray-400 group-hover:text-black transition-colors">1</p>
                <p className="text-[8px] lg:text-xs font-semibold tracking-wide text-gray-400 group-hover:text-black transition-colors">CHOOSE ROOM</p>
              </button>

              {/* Step 2 - Customize Your Prints */}
              <button
                onClick={() => setCurrentStep("step2")}
                className="w-full text-center cursor-pointer transition-all duration-200 py-2 lg:py-3 group relative"
              >
                <div className="absolute top-0 left-2 lg:left-12 text-gray-400 text-[10px] lg:text-sm">
                  ✓
                </div>
                <div className="flex justify-center mb-2 lg:mb-4">
                  <div className="flex gap-0.5 lg:gap-1 items-start">
                    <div className="w-4 h-6 lg:w-5 lg:h-8 bg-gray-400 group-hover:bg-black transition-colors"></div>
                    <div className="flex flex-col gap-0.5 lg:gap-1">
                      <div className="w-1.5 h-2.5 lg:w-2 lg:h-3.5 bg-gray-400 group-hover:bg-black transition-colors"></div>
                      <div className="w-1.5 h-2.5 lg:w-2 lg:h-3.5 bg-gray-400 group-hover:bg-black transition-colors"></div>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] lg:text-sm font-semibold mb-0.5 lg:mb-1 text-gray-400 group-hover:text-black transition-colors">2</p>
                <p className="text-[8px] lg:text-xs font-semibold tracking-wide text-gray-400 group-hover:text-black transition-colors">CUSTOMIZE YOUR PRINTS</p>
              </button>

              {/* Step 3 - Select Art */}
              <button
                onClick={() => setCurrentStep("step3")}
                className="w-full text-center cursor-pointer transition-all duration-200 py-2 lg:py-3 group relative"
              >
                <div className="absolute top-0 left-2 lg:left-12 text-gray-400 text-[10px] lg:text-sm">
                  ✓
                </div>
                <div className="flex justify-center mb-2 lg:mb-4">
                  <div className="relative w-5 h-7 lg:w-6 lg:h-9 border lg:border-2 border-gray-400 group-hover:border-black flex items-center justify-center transition-colors">
                    <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gray-400 group-hover:bg-black rounded-full transition-colors"></div>
                  </div>
                </div>
                <p className="text-[10px] lg:text-sm font-semibold mb-0.5 lg:mb-1 text-gray-400 group-hover:text-black transition-colors">3</p>
                <p className="text-[8px] lg:text-xs font-semibold tracking-wide text-gray-400 group-hover:text-black transition-colors">SELECT ART</p>
              </button>
            </div>
          </div>

          {/* Price and Add to Cart - Desktop only */}
          <div className="hidden lg:block px-6 py-6 border-t border-gray-200">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-black">{currency} {totalPrice}</div>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 sm:py-4 font-bold text-xs sm:text-sm tracking-wider hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              ADD TO 
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
          </div>
        </div>

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
                          return processedFrames.map((frame, idx) => {
                            const artwork = selectedArtworks[frame.idx]
                            return (
                              <div key={idx} className="absolute select-none" style={{
                                left: `${frame.calcLeft * scale + centerOffsetX}%`,
                                top: `${frame.calcTop * scale + centerOffsetY}%`,
                              }}>
                                <div
                                  onClick={() => {
                                    if (!wasDraggingRef.current) {
                                      setActiveFrameIndex(frame.idx)
                                      setCurrentStep("step3")
                                    }
                                    wasDraggingRef.current = false
                                  }}
                                  className="bg-white flex items-center justify-center overflow-hidden cursor-pointer"
                                  style={{
                                    width: `${frame.width * scale}vw`,
                                    height: `${frame.height * scale}vw`,
                                    border: `${Math.max(1, frame.borderWidth - 1)}px solid ${frameColor.border}`,
                                    borderRadius: '1px',
                                    boxShadow: `0 4px 16px ${frameColor.shadow}, inset 0 0 0 1px rgba(255,255,255,0.1)`,
                                  }}
                                >
                                  {artwork ? (
                                    <img src={artwork.image} alt={artwork.title} className="w-full h-full object-contain bg-gray-100 pointer-events-none" draggable={false} />
                                  ) : (
                                    <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                  )}
                                </div>
                                <div className="absolute bottom-[-14px] left-0 right-0 flex justify-center pointer-events-none">
                                  <span className="bg-white/90 text-gray-600 text-[5px] font-bold tracking-wider px-1 py-0.5 rounded whitespace-nowrap uppercase">
                                    {frame.size}{/^A\d$/i.test(frame.size) ? '' : ` ${measurementUnit.toUpperCase()}`}
                                  </span>
                                </div>
                              </div>
                            )
                          })
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
                                zIndex: Math.round(100 - frame.centerY),
                              }}
                            >
                              <div
                                onClick={() => {
                                  if (!wasDraggingRef.current) {
                                    setActiveFrameIndex(idx)
                                    setCurrentStep("step3")
                                  }
                                  wasDraggingRef.current = false
                                }}
                                className="w-full h-full bg-white flex items-center justify-center overflow-hidden cursor-pointer group relative"
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
                                  </>
                                ) : (
                                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                  </svg>
                                )}
                              </div>
                              <div className="absolute left-0 right-0 flex justify-center pointer-events-none" style={{ bottom: '-18px' }}>
                                <span className="bg-white/90 backdrop-blur-sm text-gray-600 text-[7px] font-bold tracking-wider px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap uppercase">
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

          {/* Mobile: Bottom Navigation Bar - Summary/Checkout page */}
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
              onClick={handleCheckout}
              className="flex-1 px-4 py-3 text-[10px] font-bold tracking-wide bg-black text-white hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              CHECKOUT {currency}{calculateCartTotal()}
            </button>
          </div>

          {/* Mobile Cart Popup */}
          {showCart && (
            <div className="lg:hidden fixed top-0 right-0 bottom-12 w-[55%] bg-white shadow-2xl flex flex-col animate-slide-in-right z-50">

                {/* Checkout Button Header */}
                <div className="bg-black p-4">
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-black text-white py-3 font-bold text-sm tracking-widest border-2 border-white hover:bg-gray-800 transition-all duration-200 cursor-pointer"
                  >
                    CHECKOUT
                  </button>
                </div>

                {/* Total Amount */}
                <div className="px-4 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold">TOTAL AMOUNT</span>
                    <span className="text-base font-bold">{currency} {calculateCartTotal()}</span>
                  </div>
                </div>

                {/* Cart Items Scrollable */}
                <div className="flex-1 overflow-y-auto px-4 py-2">
                  {/* Artwork Items */}
                  {Object.entries(cartItems.artworks).map(([frameIdx, artwork]) => (
                    <div key={`artwork-${frameIdx}`} className="flex gap-3 py-3 border-b border-gray-200">
                      <div className="w-20 h-24 flex-shrink-0 border border-gray-200">
                        <img 
                          src={artwork.image}
                          alt={artwork.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h3 className="font-medium text-sm mb-2">{artwork.title}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-gray-400 line-through text-xs">{currency} {artwork.price}</span>
                          <span className="text-red-600 font-bold text-sm">{currency} {artwork.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number"
                            min="1"
                            max="10"
                            value={quantities.artworks[frameIdx] || 1}
                            onChange={(e) => handleQuantityChange('artworks', frameIdx, e.target.value)}
                            className="w-20 px-2 py-1.5 border border-gray-300 text-sm text-center"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const newArtworks = { ...cartItems.artworks }
                          delete newArtworks[frameIdx]
                          setCartItems({ ...cartItems, artworks: newArtworks })
                        }}
                        className="text-gray-400 hover:text-black transition-colors cursor-pointer self-start"
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
                      <div key={`frame-${frameIdx}`} className="flex gap-3 py-3 border-b border-gray-200">
                        <div 
                          className="w-20 h-24 flex-shrink-0 border border-gray-200"
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
                        <div className="flex-1 flex flex-col">
                          <h3 className="font-medium text-sm mb-2">{frame.name} picture frame</h3>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-gray-400 line-through text-xs">{currency} {frame.price.toFixed(2)}</span>
                            <span className="text-red-600 font-bold text-sm">{currency} {frame.price.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              min="1"
                              max="10"
                              value={quantities.frames[frameIdx] || 1}
                              onChange={(e) => handleQuantityChange('frames', frameIdx, e.target.value)}
                              className="w-20 px-2 py-1.5 border border-gray-300 text-sm text-center"
                            />
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            const newFrames = { ...cartItems.frames }
                            delete newFrames[frameIdx]
                            setCartItems({ ...cartItems, frames: newFrames })
                          }}
                          className="text-gray-400 hover:text-black transition-colors cursor-pointer self-start"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )
                  })}
                </div>
            </div>
          )}

          {/* Mobile Menu Popup */}
          {showMobileMenu && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-[60]" onClick={() => setShowMobileMenu(false)}>
              <div 
                className="absolute bottom-16 left-0 right-0 bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 space-y-3">
                  <button 
                    className="w-full px-4 py-3 border-2 border-black text-sm font-bold flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all duration-200"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    SAVE
                  </button>
                  <button 
                    className="w-full px-4 py-3 border-2 border-black text-sm font-bold flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all duration-200"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    🔗 SHARE
                  </button>
                  <button 
                    onClick={() => {
                      setShowResetModal(true)
                      setShowMobileMenu(false)
                    }}
                    className="w-full px-4 py-3 border-2 border-black text-sm font-bold flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all duration-200"
                  >
                    ■ CREATE NEW
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  )
}
