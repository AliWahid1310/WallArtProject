import { useGallery } from '../../context/GalleryContext'
import {
  colorOptions,
  orientationOptions,
  styleOptions,
  collectionOptions,
  artistOptions,
  roomOptions
} from '../../data'
import { TopNavBar, Breadcrumb, MobileBottomNav, MobileMenuModal, ResetModal } from '../layout'
import { DesktopFilterPanel, MobileFilterPanel } from '../filters'
import { processMobileFrames } from '../canvas'

export default function SelectDesignStep() {
  const {
    currentStep, setCurrentStep,
    selectedLayout,
    selectedBackground,
    selectedArtworks, setSelectedArtworks,
    activeFrameIndex, setActiveFrameIndex,
    selectedFrames,
    showFilter, setShowFilter,
    searchQuery, setSearchQuery,
    selectedColorFilters, setSelectedColorFilters,
    selectedOrientationFilters, setSelectedOrientationFilters,
    selectedStyleFilters, setSelectedStyleFilters,
    selectedCollectionFilters, setSelectedCollectionFilters,
    selectedArtistFilters, setSelectedArtistFilters,
    selectedRoomFilters, setSelectedRoomFilters,
    expandedFilterSection, setExpandedFilterSection,
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
  } = useGallery()

  // Get available artworks for the currently active frame
  const activeFrame = activeFrameIndex !== null && selectedLayout ? selectedLayout.frames[activeFrameIndex] : null
  const availableArtworks = activeFrame ? getArtworksForFrameSize(activeFrame.size) : []

  return (
    <>
      <ResetModal />
      <div className="h-screen bg-white flex flex-col overflow-hidden">
        <TopNavBar />
        <Breadcrumb />
        {/* Mobile/Desktop Layout Container */}
        <div className="flex flex-row flex-1 overflow-hidden pb-12 lg:pb-0">
          {/* Left Sidebar - Narrow on mobile, standard on desktop */}
          <div className="flex w-28 lg:w-80 bg-white border-r border-gray-300 px-1 lg:px-6 py-1 lg:py-4 flex-col h-full">

            {/* Mobile: Header "4. SELECT DESIGNS" */}
            <div className="lg:hidden flex-shrink-0 mb-1 border-b border-gray-200 pb-1">
              <p className="text-[7px] font-bold tracking-wide text-gray-500">4. DESIGNS</p>
            </div>

            {/* Desktop: Step Header with Close Button - Fixed */}
            <div className="hidden lg:flex items-center justify-between px-0 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
              <p className="text-xs sm:text-sm font-semibold tracking-wide">4. SELECT DESIGNS</p>
              <button
                onClick={() => setCurrentStep("intro")}
                className="text-2xl font-light text-gray-600 hover:text-black transition-colors cursor-pointer leading-none"
              >
                ✕
              </button>
            </div>

          {/* Instructions or Artwork List */}
          <div ref={artworkScrollRef} className="flex-1 overflow-y-auto px-1 lg:px-4 py-1 lg:py-6" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            {activeFrameIndex === null ? (
              /* Show instructions when no frame is selected */
              <div className="flex flex-col items-center justify-center h-full text-center px-2">
                <div className="mb-2 lg:mb-6">
                  <svg className="w-8 h-8 lg:w-16 lg:h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-[10px] lg:text-base font-semibold text-gray-700 mb-1 lg:mb-3">
                  Click on a picture on the wall to select a design
                </p>
                <p className="text-[8px] lg:text-sm text-gray-500">
                  Select each frame on your gallery wall to choose artwork
                </p>
              </div>
            ) : (
              /* Show artwork options for selected frame */
              <div className="relative">
                  {/* Mobile: Filter Header - Stacked vertically */}
                  <div className="lg:hidden mb-1">
                    <div className="flex flex-col">
                      <button 
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center gap-1 text-[8px] font-bold text-black hover:text-gray-600 transition-colors cursor-pointer py-0.5 border-b border-gray-200"
                      >
                        {showFilter ? 'HIDE FILTER' : 'SHOW FILTER'}
                        <span className="text-[8px]">×</span>
                      </button>
                      <button 
                        onClick={() => {
                          setSearchQuery('')
                          setSelectedColorFilters([])
                        }}
                        className="text-[8px] font-bold text-black hover:text-gray-600 transition-colors cursor-pointer py-0.5 border-b border-gray-200 text-left"
                      >
                        ALL PRODUCTS
                      </button>
                    </div>
                  </div>

                  {/* Desktop: Selected Filters Chips */}
                  {selectedColorFilters.length > 0 && (
                    <div className="hidden lg:flex mb-4 flex-wrap gap-2">
                      {selectedColorFilters.map(color => (
                      <button
                        key={color}
                        onClick={() => toggleFilter('color', color)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm font-medium text-gray-800 rounded cursor-pointer transition-colors"
                      >
                        {color.charAt(0).toUpperCase() + color.slice(1)} ✕
                      </button>
                    ))}
                  </div>
                )}

                {/* Desktop: Filter Bar */}
                <div className="hidden lg:flex mb-4 items-center justify-between border-b border-gray-200 pb-4">
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

                {/* Desktop: Color Filter Panel - Flyout to the right of sidebar */}
                <DesktopFilterPanel />

                  {/* Artwork Grid */}
                  {availableArtworks.length === 0 ? (
                    <div className="text-center py-4 lg:py-8">
                      <p className="text-gray-500 text-[8px] lg:text-base">No artworks available</p>
                    </div>
                  ) : (
                    <div>
                      {/* Two column grid on mobile for compact view */}
                      <div className="grid grid-cols-2 gap-1 lg:grid-cols-2 lg:gap-3">
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
                                ? 'ring-1 lg:ring-2 ring-black ring-offset-0 lg:ring-offset-2'
                                : 'hover:shadow-lg'
                            }`}
                          >
                            {/* Artwork Image */}
                            <div className="relative aspect-square lg:aspect-[3/4] bg-gray-200 overflow-hidden">
                              <img 
                                src={artwork.image}
                                alt={artwork.title}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                              />
                              {selectedArtworks[activeFrameIndex]?.id === artwork.id && (
                                <div className="absolute top-0.5 left-0.5 lg:top-2 lg:left-2 bg-black text-white rounded w-3 h-3 lg:w-6 lg:h-6 flex items-center justify-center">
                                  <span className="text-[8px] lg:text-sm font-bold">✓</span>
                                </div>
                              )}
                            </div>

                            {/* Artwork Info */}
                            <div className="p-0.5 lg:p-2 bg-white border border-t-0 border-gray-200">
                              <h3 className="text-[6px] lg:text-xs font-bold text-black mb-0 lg:mb-1 line-clamp-1">{artwork.title}</h3>
                              <div className="flex items-center justify-center">
                                <span className="text-[7px] lg:text-xs font-semibold text-black">£{artwork.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Show count & loading */}
                      <div className="text-center py-2">
                        <p className="text-[7px] lg:text-xs text-gray-400">
                          Showing {Math.min(displayedArtworkCount, availableArtworks.length)} of {availableArtworks.length} products
                        </p>
                      </div>
                      {isLoadingMore && displayedArtworkCount < availableArtworks.length && (
                        <div className="flex justify-center py-2">
                          <div className="flex items-center gap-2 text-gray-500">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-xs font-medium">Loading more...</span>
                          </div>
                        </div>
                      )}

                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Mobile & Desktop: Navigation Buttons - Fixed at bottom */}
          <div className="px-0 py-2 lg:py-4 border-t border-gray-200 space-y-1.5 lg:space-y-3 flex-shrink-0">
            <button 
              onClick={() => {
                // Check if at least one artwork is selected
                const hasArtworks = Object.keys(selectedArtworks).length > 0
                if (!hasArtworks) {
                  setShowEmptyArtworkModal(true)
                } else {
                  // For mobile only: Add items to cart before going to checkout
                  // Desktop users should use the ADD TO CART button explicitly
                  if (isMobile) {
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
                    
                    // Initialize quantities for cart items
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
                  }
                  
                  setCurrentStep("checkout")
                }
              }}
              className="w-full bg-black text-white py-2 lg:py-4 font-bold text-[10px] lg:text-sm tracking-widest hover:bg-gray-800 transition-all duration-200 cursor-pointer"
            >
              NEXT
            </button>
            {/* Desktop: PREVIOUS button - goes to previous step */}
            <button 
              onClick={() => {
                setActiveFrameIndex(null)
                setCurrentStep("step3")
              }}
              className="hidden lg:flex w-full bg-white text-black py-2 lg:py-3 font-bold text-[10px] lg:text-sm tracking-wide border-2 border-black hover:bg-gray-100 transition-all duration-200 cursor-pointer items-center justify-center gap-1"
            >
              PREVIOUS
            </button>
            {/* Mobile: CLOSE button - goes to landing page */}
            <button 
              onClick={() => setCurrentStep("intro")}
              className="lg:hidden w-full bg-white text-black py-2 font-bold text-[10px] tracking-wide border-2 border-black hover:bg-gray-100 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1"
            >
              <span className="text-xs">✕</span>
              CLOSE
            </button>
          </div>
        </div>

        {/* Mobile: Filter Panel - Adjacent column to the right of sidebar */}
        <MobileFilterPanel />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Main Canvas with Background and Clickable Frames */}
          <div className="flex-1 flex flex-col overflow-hidden no-scroll-fullscreen">
            <div
              ref={canvasRef}
              className="flex-1 relative bg-cover bg-center transition-all duration-500"
            style={{
              backgroundImage: selectedBackground 
                ? `url(${selectedBackground.image})` 
                : "url(https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/welcome-bg.jpg?v=1)",
            }}
          >
            {/* Frame Container - Draggable as a group */}
            <div 
              className={`absolute inset-0 ${isMobile ? 'flex items-center justify-center' : ''}`}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
              style={{
                cursor: isDragging ? 'grabbing' : 'default',
                transform: `translate(${groupOffset.x + dragOffset.x}px, ${groupOffset.y + dragOffset.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 1.2)'
              }}
            >
              {/* Clickable Frame Placeholders with Selected Artworks */}
              {isMobile ? (
                /* Mobile: Centered container with all boxes grouped tightly */
                <div className="relative flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                  {selectedLayout && (() => {
                    const { processedFrames, centerOffsetX, centerOffsetY, scale } = processMobileFrames(selectedLayout.frames, 0.6)

                    return processedFrames.map((frame) => {
                      return (
                        <div
                          key={frame.idx}
                          onMouseDown={handleDragStart}
                          onTouchStart={handleDragStart}
                          onClick={() => {
                            if (!wasDraggingRef.current) {
                              setActiveFrameIndex(frame.idx)
                            }
                            wasDraggingRef.current = false
                          }}
                          className={`absolute cursor-pointer group overflow-hidden select-none ${
                            activeFrameIndex === frame.idx ? 'z-20' : 'z-10'
                          }`}
                          style={{
                            width: `${frame.width * scale}%`,
                            height: `${frame.height * scale}%`,
                            left: `${frame.calcLeft * scale + centerOffsetX}%`,
                            top: `${frame.calcTop * scale + centerOffsetY}%`,
                            transition: 'all 0.25s ease-out'
                          }}
                        >
                          {selectedArtworks[frame.idx] ? (
                            <>
                              <img 
                                src={selectedArtworks[frame.idx].image}
                                alt={selectedArtworks[frame.idx].title}
                                className="w-full h-full object-contain bg-gray-100 pointer-events-none"
                                draggable={false}
                              />
                              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-gray-200/80 backdrop-blur-sm flex items-center justify-center shadow-lg pointer-events-none">
                              <span className="text-gray-500 font-semibold text-[8px]">
                                {frame.size}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })
                  })()}
                </div>
              ) : (
                /* Desktop: Frames move together with container */
                selectedLayout && selectedLayout.frames.map((frame, idx) => {
                  const artwork = selectedArtworks[idx]
                  
                  return (
                    <div
                      key={idx}
                      onMouseDown={handleDragStart}
                      onTouchStart={handleDragStart}
                      onClick={(e) => {
                        // Only trigger click if not dragging
                        if (!wasDraggingRef.current) {
                          setActiveFrameIndex(idx)
                        }
                        wasDraggingRef.current = false
                      }}
                      className={`absolute cursor-pointer group overflow-hidden select-none ${
                        activeFrameIndex === idx ? 'z-20' : 'z-10'
                      } hover:shadow-xl`}
                      style={{
                        width: frame.width,
                        height: frame.height,
                        top: frame.top,
                        bottom: frame.bottom,
                        left: frame.left,
                        right: frame.right,
                        transform: frame.transform,
                        transition: 'box-shadow 0.2s ease-out'
                      }}
                    >
                      {artwork ? (
                        <>
                          <img 
                            src={artwork.image}
                            alt={artwork.title}
                            className="w-full h-full object-cover pointer-events-none"
                            draggable={false}
                          />
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
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
                        <div className="absolute inset-0 bg-gray-200/80 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:bg-gray-300/90 group-hover:shadow-xl transition-all duration-200 pointer-events-none">
                          <span className="text-gray-500 font-semibold text-sm group-hover:text-gray-700 transition-colors">
                            {frame.size}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
        </div>{/* End of Main Content Area */}

        {/* Validation Modal - No Artworks Selected */}
        {showEmptyArtworkModal && (
          <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 sm:p-8 max-w-md w-full relative shadow-2xl border border-gray-200 rounded-lg">
              {/* Modal Content */}
              <div className="text-center">
                {/* Icon */}
                <div className="mx-auto flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-yellow-100 mb-4">
                  <svg className="h-7 w-7 sm:h-8 sm:w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                  No Designs Selected
                </h2>
                
                <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
                  Please select at least one design for your gallery wall before proceeding to checkout.
                </p>

                {/* Button */}
                <button
                  onClick={() => setShowEmptyArtworkModal(false)}
                  className="w-full bg-black text-white px-6 sm:px-8 py-2.5 sm:py-3 font-bold text-xs sm:text-sm tracking-wider hover:bg-gray-800 transition-all duration-200 cursor-pointer rounded"
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
