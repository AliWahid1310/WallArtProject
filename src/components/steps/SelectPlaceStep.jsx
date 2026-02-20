import { useMemo } from 'react'
import { useGallery } from '../../context/GalleryContext'
import { placeCategories, backgroundOptions } from '../../data'
import { TopNavBar, Breadcrumb, MobileBottomNav, MobileMenuModal, ResetModal } from '../layout'
import { processMobileFrames } from '../canvas'
import { getDynamicFrames } from '../../utils/helpers'
import Ruler from '../Ruler'

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

export default function SelectPlaceStep() {
  const {
    setCurrentStep,
    selectedPlace, setSelectedPlace,
    selectedBackground, setSelectedBackground,
    selectedLayout,
    activeVariants, setActiveVariants,
    isMobile,
    isDragging,
    groupOffset, dragOffset,
    handleDragStart,
    wasDraggingRef,
    canvasRef,
    measurementUnit, setMeasurementUnit,
    printOrientation,
    printStyle, setPrintStyle,
    printSize, setPrintSize,
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

  const innerShadowCSS = `inset ${innerShadow.xOffset}px ${innerShadow.yOffset}px ${innerShadow.blur}px ${innerShadow.spread}px rgba(0,0,0,${(innerShadow.opacity / 100).toFixed(1)})`

  const unit = measurementUnit === 'cm' ? 'cm' : 'in'
  const sizeOptions = PRINT_SIZES[printOrientation]?.[unit] || PRINT_SIZES['Portrait'][unit]

  const handleUnitChange = (newUnit) => {
    setMeasurementUnit(newUnit)
    const sizes = PRINT_SIZES[printOrientation]?.[newUnit] || PRINT_SIZES['Landscape'][newUnit]
    if (sizes?.length) setPrintSize(sizes[0])
  }

  // Build background grid items from sections
  const backgroundItems = backgroundOptions.map((section, idx) => {
    const activeVariant = activeVariants[idx] || section.variants[0]
    return {
      sectionIdx: idx,
      label: section.label || section.section,
      image: activeVariant.image,
      variant: activeVariant,
      isSelected: selectedBackground?.id === activeVariant.id
    }
  })

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
  const layoutLabel = selectedLayout?.name || selectedLayout?.label || 'Single Portrait'

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
        <div className="flex flex-row flex-1 overflow-hidden pb-12 lg:pb-0">

          {/* ========== LEFT SIDEBAR ========== */}
          <div className="flex w-28 lg:w-[35%] bg-white border-r border-gray-300 px-2 lg:px-5 py-2 lg:py-3 flex-col h-full">

            {/* Header: Choose Room + Save Changes */}
            <div className="flex items-center justify-between pb-2.5 lg:pb-3 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-1.5 lg:gap-2">
                <span className="text-sm lg:text-lg">🏠</span>
                <h2 className="text-[10px] lg:text-base font-bold text-gray-900">Choose Room</h2>
              </div>
              <button className="flex items-center gap-1 px-1.5 lg:px-2.5 py-0.5 lg:py-1 border border-[#4a6741] text-[#4a6741] rounded text-[7px] lg:text-xs font-semibold hover:bg-green-50 transition-colors cursor-pointer">
                <span className="hidden lg:inline">💾</span> SAVE CHANGES
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto min-h-0 py-2 lg:py-3">
              {/* Room Type Dropdown */}
              <div className="mb-3 lg:mb-4">
                <label className="block text-[7px] lg:text-[11px] font-bold text-gray-400 tracking-widest mb-1 lg:mb-1.5">ROOM TYPE</label>
                <div className="relative">
                  <select
                    value={selectedPlace?.id || ''}
                    onChange={(e) => {
                      const place = placeCategories.find(p => p.id === e.target.value)
                      setSelectedPlace(place || null)
                    }}
                    className="w-full border border-gray-300 rounded-lg px-2 lg:px-3 py-1.5 lg:py-2.5 text-[9px] lg:text-sm font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#4a6741] focus:border-transparent cursor-pointer appearance-none pr-7 lg:pr-8"
                  >
                    <option value="">Select a room...</option>
                    {placeCategories.map(place => (
                      <option key={place.id} value={place.id}>{place.name}</option>
                    ))}
                  </select>
                  <svg className="absolute right-2 lg:right-3 top-1/2 -translate-y-1/2 w-3 h-3 lg:w-4 lg:h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>

              {/* Background Options Grid */}
              <div>
                <label className="block text-[7px] lg:text-[11px] font-bold text-gray-400 tracking-widest mb-1.5 lg:mb-2">BACKGROUND OPTIONS</label>
                <div className="grid grid-cols-3 gap-1.5 lg:gap-2.5">
                  {backgroundItems.map((item) => (
                    <div
                      key={item.sectionIdx}
                      onClick={() => setSelectedBackground(item.variant)}
                      className="cursor-pointer group"
                    >
                      <div className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        item.isSelected ? 'border-[#4a6741] shadow-md' : 'border-transparent hover:border-gray-300'
                      }`}>
                        <img
                          src={item.image}
                          alt={item.label}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        {item.isSelected && (
                          <div className="absolute top-0.5 left-0.5 lg:top-1.5 lg:left-1.5 w-4 h-4 lg:w-5 lg:h-5 bg-[#4a6741]/90 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        {/* Placeholder icon */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 -z-10">
                          <svg className="w-6 h-6 lg:w-8 lg:h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-[6px] lg:text-[10px] font-bold text-gray-500 text-center mt-0.5 lg:mt-1 uppercase leading-tight tracking-wide">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="px-0 py-1.5 lg:py-3 border-t border-gray-200 flex-shrink-0">
              <button
                disabled={!selectedPlace || !selectedBackground}
                onClick={() => setCurrentStep("step2")}
                className="w-full bg-[#4a6741] text-white py-2 lg:py-3 font-bold text-[8px] lg:text-xs tracking-wide rounded-lg hover:bg-[#3d5636] transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
              >
                CUSTOMIZE YOUR PRINTS &gt;
              </button>
            </div>
          </div>

          {/* ========== RIGHT SECTION ========== */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* ---- Canvas Header Bar ---- */}
            <div className="hidden lg:flex items-center justify-between px-5 py-2.5 border-b border-gray-200 bg-white flex-shrink-0">
              {/* Left: background name + layout subtitle */}
              <div className="flex-shrink-0">
                <h3 className="text-sm font-extrabold tracking-wide text-gray-900 uppercase leading-tight">
                  {getBackgroundLabel() || 'SELECT A BACKGROUND'}
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Previewing Layout: {layoutLabel}
                </p>
              </div>

              {/* Right: Action buttons */}
              <div className="flex items-center gap-1">
                {/* Drag to Reposition */}
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="tracking-wide leading-tight text-left">DRAG TO REPOSITION<br/>GALLERY</span>
                </button>

                <div className="w-px h-8 bg-gray-200 mx-1" />

                {/* Grid Toggle */}
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

                {/* Ruler Toggle */}
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

                {/* Enlarge */}
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
                          const { processedFrames, centerOffsetX, centerOffsetY, scale } = processMobileFrames(dynamicFrames)
                          const frameColor = FRAME_STYLE_COLORS[printStyle] || FRAME_STYLE_COLORS.Black
                          return processedFrames.map((frame, idx) => (
                            <div key={idx} className="absolute select-none" style={{
                              left: `${frame.calcLeft * scale + centerOffsetX}%`,
                              top: `${frame.calcTop * scale + centerOffsetY}%`,
                            }}>
                              <div
                                className="bg-white flex items-center justify-center overflow-hidden"
                                style={{
                                  width: `${frame.width * scale}vw`,
                                  height: `${frame.height * scale}vw`,
                                  border: `${Math.max(1, frame.borderWidth - 1)}px solid ${frameColor.border}`,
                                  borderRadius: '1px',
                                  boxShadow: `0 4px 16px ${frameColor.shadow}, inset 0 0 0 1px rgba(255,255,255,0.1)`,
                                }}
                              >
                                <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
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
                        return dynamicFrames.map((frame, idx) => (
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
                            {/* Frame with colored border */}
                            <div
                              className="w-full h-full bg-white flex items-center justify-center overflow-hidden"
                              style={{
                                border: `${frame.borderWidth}px solid ${frameColor.border}`,
                                borderRadius: '2px',
                                boxShadow: `0 6px 24px ${frameColor.shadow}, 0 2px 8px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.08)`,
                              }}
                            >
                              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                            </div>
                            {/* Size label below frame */}
                            <div className="mt-1 flex justify-center">
                              <span className="bg-white/90 backdrop-blur-sm text-gray-600 text-[8px] font-bold tracking-wider px-2 py-0.5 rounded shadow-sm whitespace-nowrap uppercase">
                                {frame.size}{/^A\d$/i.test(frame.size) ? '' : ` ${measurementUnit.toUpperCase()}`}
                              </span>
                            </div>
                          </div>
                        ))
                      })()
                    )}
                  </div>
                ) : (
                  /* No layout selected yet */
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

                {/* Wall Scale Slider - top left */}
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

                {/* Undo / Redo - top right */}
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

                {/* CM / IN Toggle - bottom left */}
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

                {/* Rotate / Lock - bottom right */}
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
              {/* Print Size */}
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

              {/* Frame Style */}
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

              {/* Description */}
              <div className="flex-1 text-right">
                <p className="text-sm text-gray-400 italic leading-snug">
                  {selectedPlace
                    ? `A ${selectedPlace.name?.toLowerCase()} is the heart of the home.`
                    : 'Choose a room to begin.'}
                </p>
              </div>
            </div>

            <MobileBottomNav />
          </div>
        </div>
      </div>

      <MobileMenuModal />
    </>
  )
}
