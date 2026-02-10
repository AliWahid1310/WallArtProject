import { useGallery } from '../../context/GalleryContext'
import { TopNavBar, Breadcrumb, ResetModal } from '../layout'
import { processMobileFrames } from '../canvas'

export default function CheckoutStep() {
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
  } = useGallery()

  const totalPrice = calculateTotalPrice()
  const currency = selectedArtworks[Object.keys(selectedArtworks)[0]]?.currency || '£'

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
              {/* Step 1 - Select Place */}
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
                    alt="Select Place" 
                    className="w-6 h-6 lg:w-8 lg:h-8 object-contain opacity-40 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <p className="text-[10px] lg:text-sm font-semibold mb-0.5 lg:mb-1 text-gray-400 group-hover:text-black transition-colors">1</p>
                <p className="text-[8px] lg:text-xs font-semibold tracking-wide text-gray-400 group-hover:text-black transition-colors">SELECT PLACE</p>
              </button>

              {/* Step 2 - Select Background */}
              <button
                onClick={() => setCurrentStep("step1")}
                className="w-full text-center cursor-pointer transition-all duration-200 py-2 lg:py-3 group relative"
              >
                <div className="absolute top-0 left-2 lg:left-12 text-gray-400 text-[10px] lg:text-sm">
                  ✓
                </div>
                <div className="flex justify-center mb-2 lg:mb-4">
                  <div className="relative w-8 h-8 lg:w-10 lg:h-10">
                    <div className="absolute top-0 right-0 w-5 h-6 lg:w-7 lg:h-9 border lg:border-2 border-gray-400 group-hover:border-black bg-white transition-colors transform rotate-6"></div>
                    <div className="absolute top-1 left-0 w-5 h-6 lg:w-7 lg:h-9 border lg:border-2 border-gray-400 group-hover:border-black bg-white transition-colors">
                      <div className="absolute inset-1 lg:inset-2 bg-gray-400 group-hover:bg-black transition-colors"></div>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] lg:text-sm font-semibold mb-0.5 lg:mb-1 text-gray-400 group-hover:text-black transition-colors">2</p>
                <p className="text-[8px] lg:text-xs font-semibold tracking-wide text-gray-400 group-hover:text-black transition-colors">SELECT BACKGROUND</p>
              </button>

              {/* Step 3 - Select Picture Wall */}
              <button
                onClick={() => setCurrentStep("step3")}
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
                <p className="text-[10px] lg:text-sm font-semibold mb-0.5 lg:mb-1 text-gray-400 group-hover:text-black transition-colors">3</p>
                <p className="text-[8px] lg:text-xs font-semibold tracking-wide text-gray-400 group-hover:text-black transition-colors">SELECT PICTURE WALL</p>
              </button>

              {/* Step 4 - Select Design */}
              <button
                onClick={() => setCurrentStep("step4")}
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
                <p className="text-[10px] lg:text-sm font-semibold mb-0.5 lg:mb-1 text-gray-400 group-hover:text-black transition-colors">4</p>
                <p className="text-[8px] lg:text-xs font-semibold tracking-wide text-gray-400 group-hover:text-black transition-colors">SELECT DESIGN</p>
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

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col h-full pb-12 lg:pb-0">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-gray-300 px-3 py-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-bold tracking-widest text-black">SUMMARY</h2>
              <button 
                onClick={() => setCurrentStep("intro")}
                className="text-xl font-light text-gray-600 hover:text-black transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>
          </div>

          {/* Main Canvas - Final Preview */}
          <div
            className="flex-1 relative bg-cover bg-center transition-all duration-500 overflow-hidden no-scroll-fullscreen"
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
              {/* Final Gallery Wall Preview */}
              {isMobile ? (
                <div 
                  className="relative flex items-center justify-center" 
                  style={{ width: '100%', height: '100%' }}
                >
                  {selectedLayout && (() => {
                    const { processedFrames, centerOffsetX, centerOffsetY, scale } = processMobileFrames(selectedLayout.frames, 0.6)

                    return processedFrames.map((frame) => {
                      const artwork = selectedArtworks[frame.idx]
                      if (!artwork) return null
                      return (
                        <div
                          key={frame.idx}
                          className="absolute transition-all duration-300 overflow-hidden cursor-pointer"
                          style={{
                            width: `${frame.width * scale}%`,
                            height: `${frame.height * scale}%`,
                            left: `${frame.calcLeft * scale + centerOffsetX}%`,
                            top: `${frame.calcTop * scale + centerOffsetY}%`,
                          }}
                          onClick={() => {
                            if (!wasDraggingRef.current) {
                              setActiveFrameIndex(frame.idx)
                              setCurrentStep("step4")
                            }
                            wasDraggingRef.current = false
                          }}
                        >
                          <img 
                            src={artwork.image}
                            alt={artwork.title}
                            className="w-full h-full object-contain bg-gray-100"
                          />
                        </div>
                      )
                    })
                  })()}
                </div>
              ) : (
                /* Desktop: Original positioning */
                selectedLayout && selectedLayout.frames.map((frame, idx) => {
                  const artwork = selectedArtworks[idx]
                  const frameStyle = selectedFrames[idx]
                  if (!artwork) return null
                  return (
                    <div
                      key={idx}
                      className="absolute transition-all duration-300 overflow-hidden cursor-pointer"
                      style={{
                        width: frame.width,
                        height: frame.height,
                        top: frame.top,
                        bottom: frame.bottom,
                        left: frame.left,
                        right: frame.right,
                        transform: frame.transform
                      }}
                      onClick={() => {
                        if (!wasDraggingRef.current) {
                          setActiveFrameIndex(idx)
                          setCurrentStep("step4")
                        }
                        wasDraggingRef.current = false
                      }}
                    >
                      <img 
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )
                })
              )}
            </div>
          </div>

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
