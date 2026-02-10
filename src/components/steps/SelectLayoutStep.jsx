import { useState, useMemo } from 'react'
import { useGallery } from '../../context/GalleryContext'
import { layoutOptions } from '../../data'
import { TopNavBar, Breadcrumb, MobileBottomNav, MobileMenuModal, ResetModal } from '../layout'
import { BackgroundCanvas, DraggableFrameContainer, processMobileFrames } from '../canvas'

export default function SelectLayoutStep() {
  const {
    setCurrentStep,
    selectedLayout, setSelectedLayout,
    selectedBackground,
    selectedArtworks, setSelectedArtworks,
    setActiveFrameIndex,
    showLayoutChangeModal, setShowLayoutChangeModal,
    pendingLayout, setPendingLayout,
    isMobile,
    canvasRef,
  } = useGallery()

  const [searchQuery, setSearchQuery] = useState('')
  const [printsFilter, setPrintsFilter] = useState('All')
  const [orientationFilter, setOrientationFilter] = useState('Mix')

  const printsOptions = ['All', '3', '4', '5', '6+']
  const orientationOptions = ['Mix', 'Portrait', 'Landscape', 'Square']

  const filteredLayouts = useMemo(() => {
    return layoutOptions.filter(layout => {
      // Search filter
      if (searchQuery && !layout.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      // Prints (frame count) filter
      if (printsFilter !== 'All') {
        const count = layout.frames.length
        if (printsFilter === '6+') {
          if (count < 6) return false
        } else {
          if (count !== parseInt(printsFilter)) return false
        }
      }
      // Orientation filter
      if (orientationFilter !== 'Mix') {
        const hasMatchingOrientation = layout.frames.some(frame => {
          const [w, h] = frame.size.split(/x/i).map(Number)
          if (orientationFilter === 'Portrait') return h > w
          if (orientationFilter === 'Landscape') return w > h
          if (orientationFilter === 'Square') return w === h
          return true
        })
        if (!hasMatchingOrientation) return false
      }
      return true
    })
  }, [searchQuery, printsFilter, orientationFilter])

  const handleLayoutSelect = (layout) => {
    const hasSelectedArtworks = Object.keys(selectedArtworks).length > 0
    if (hasSelectedArtworks && selectedLayout?.id !== layout.id) {
      setPendingLayout(layout)
      setShowLayoutChangeModal(true)
    } else {
      setSelectedLayout(layout)
    }
  }

  return (
    <>
      <ResetModal />
      <div className="h-screen bg-white flex flex-col overflow-hidden">
        <TopNavBar />
        <Breadcrumb />
        <div className="flex flex-row flex-1 overflow-hidden pb-12 lg:pb-0">
          {/* Left Sidebar */}
          <div className="flex w-28 lg:w-[35%] bg-white border-r border-gray-300 px-1 lg:px-4 py-1 lg:py-4 flex-col h-full">

            <div className="lg:hidden flex-shrink-0 mb-1 text-center border-b border-gray-200 pb-1">
              <p className="text-[7px] font-bold tracking-wide">3 PICTURE WALL</p>
            </div>

            {/* Step heading - desktop */}
            <div className="hidden lg:flex items-center justify-between px-1 pb-4 flex-shrink-0">
              <p className="text-xl font-bold text-gray-900">Step 2: Choose Layout</p>
              <button
                onClick={() => setCurrentStep("intro")}
                className="text-2xl font-light text-gray-600 hover:text-black transition-colors cursor-pointer leading-none"
              >
                ✕
              </button>
            </div>

            {/* Search bar */}
            <div className="hidden lg:block px-1 pb-4 flex-shrink-0">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search layouts..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-1 focus:ring-[#4a6741] focus:border-[#4a6741] bg-white"
                />
              </div>
            </div>

            {/* Prints filter */}
            <div className="hidden lg:flex items-center gap-3 px-1 pb-3 flex-shrink-0">
              <span className="text-base font-semibold text-gray-700">Prints:</span>
              <div className="flex gap-2">
                {printsOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setPrintsFilter(opt)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                      printsFilter === opt
                        ? 'bg-[#4a6741] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation filter */}
            <div className="hidden lg:flex items-center gap-3 px-1 pb-4 border-b border-gray-200 flex-shrink-0">
              <span className="text-base font-semibold text-gray-700">Orientation:</span>
              <div className="flex gap-2">
                {orientationOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setOrientationFilter(opt)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                      orientationFilter === opt
                        ? 'bg-[#4a6741] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Options - 2 column grid */}
            <div className="flex-1 overflow-y-auto min-h-0 py-2 lg:py-3 px-0 lg:px-1">
              <div className="grid grid-cols-2 gap-2 lg:gap-3">
                {filteredLayouts.map((layout) => (
                  <div
                    key={layout.id}
                    onClick={() => handleLayoutSelect(layout)}
                    className={`relative cursor-pointer transition-all duration-200 group rounded-lg border-2 overflow-hidden ${
                      selectedLayout?.id === layout.id
                        ? 'border-[#4a6741] shadow-md'
                        : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
                    }`}
                  >
                    <div className="relative aspect-square bg-gray-50 p-2">
                      {layout.image ? (
                        <img 
                          src={layout.image} 
                          alt={layout.name}
                          className="w-full h-full object-contain transition-all duration-200 group-hover:opacity-80 cursor-pointer"
                        />
                      ) : (
                        layout.frames.map((frame, idx) => (
                          <div
                            key={idx}
                            className={`absolute bg-gray-300 transition-all duration-200 ${
                              selectedLayout?.id === layout.id ? 'bg-gray-500' : 'group-hover:bg-gray-400'
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
                          />
                        ))
                      )}
                      {selectedLayout?.id === layout.id && (
                        <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                          <span className="bg-[#4a6741] text-white text-[9px] lg:text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Selected
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="px-1.5 py-1 lg:px-2 lg:py-1.5 bg-white border-t border-gray-100 text-center">
                      <p className="text-[8px] lg:text-xs font-medium text-gray-700 truncate">{layout.name}</p>
                    </div>
                  </div>
                ))}
                {filteredLayouts.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-400 text-sm">
                    No layouts match your filters
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">

            <div className="flex-1 flex flex-col overflow-hidden no-scroll-fullscreen">
              <div
                ref={canvasRef}
                className="flex-1 relative bg-cover bg-center transition-all duration-500"
                style={{
                  backgroundImage: `url(${selectedBackground?.image || "https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/welcome-bg.jpg?v=1"})`,
                }}
              >
                <DraggableFrameContainer>
                  {isMobile ? (
                    <div className="relative flex items-center justify-center" style={{ width: '100%', height: '100%' }}>
                      {selectedLayout && (() => {
                        const { processedFrames, centerOffsetX, centerOffsetY, scale } = processMobileFrames(selectedLayout.frames)
                        return processedFrames.map((frame, idx) => (
                          <div
                            key={idx}
                            className="absolute cursor-pointer bg-gray-200 flex items-center justify-center shadow-md select-none"
                            style={{
                              width: `${frame.width * scale}%`,
                              height: `${frame.height * scale}%`,
                              left: `${frame.calcLeft * scale + centerOffsetX}%`,
                              top: `${frame.calcTop * scale + centerOffsetY}%`,
                            }}
                          >
                            <span className="text-gray-500 font-semibold text-[8px]">{frame.size}</span>
                          </div>
                        ))
                      })()}
                    </div>
                  ) : (
                    selectedLayout && selectedLayout.frames.map((frame, idx) => (
                      <div
                        key={idx}
                        className="absolute cursor-pointer bg-gray-200 flex items-center justify-center shadow-md select-none"
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
                        <span className="text-gray-500 font-semibold text-sm">{frame.size}</span>
                      </div>
                    ))
                  )}
                </DraggableFrameContainer>
              </div>
            </div>

            {/* Next Button - below preview */}
            <div className="hidden lg:flex flex-shrink-0 justify-center py-4">
              <button 
                disabled={!selectedLayout}
                onClick={() => selectedLayout && setCurrentStep("step4")}
                className="px-16 py-3 bg-[#4a6741] text-white font-bold text-sm tracking-widest rounded-full hover:bg-[#3d5636] transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer shadow-md"
              >
                NEXT
              </button>
            </div>

            <MobileBottomNav />
          </div>
        </div>
      </div>

      <MobileMenuModal />

      {/* Layout Change Confirmation Modal */}
      {showLayoutChangeModal && (
        <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 max-w-md w-full relative shadow-2xl border border-gray-200">
            <button
              onClick={() => {
                setShowLayoutChangeModal(false)
                setPendingLayout(null)
              }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xl sm:text-2xl font-light text-gray-600 hover:text-black transition-colors cursor-pointer leading-none"
            >
              ✕
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6 tracking-wide pr-8">
              WOULD YOU LIKE TO CONTINUE?
            </h2>
            <p className="text-center text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              YOU HAVE MADE CHANGES THAT HAVE NOT BEEN SAVED. WOULD YOU LIKE TO SAVE YOUR PICTURE WALL NOW?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setShowLayoutChangeModal(false)
                  setPendingLayout(null)
                }}
                className="bg-black text-white px-6 sm:px-8 py-2.5 sm:py-3 font-bold text-xs sm:text-sm tracking-wider hover:bg-gray-800 transition-all duration-200 cursor-pointer"
              >
                SAVE
              </button>
              <button
                onClick={() => {
                  setSelectedArtworks({})
                  setActiveFrameIndex(null)
                  setSelectedLayout(pendingLayout)
                  setShowLayoutChangeModal(false)
                  setPendingLayout(null)
                }}
                className="bg-white text-black px-6 sm:px-8 py-2.5 sm:py-3 font-bold text-xs sm:text-sm tracking-wider border-2 border-black hover:bg-gray-100 transition-all duration-200 cursor-pointer"
              >
                DON'T SAVE
              </button>
              <button
                onClick={() => {
                  setShowLayoutChangeModal(false)
                  setPendingLayout(null)
                }}
                className="bg-white text-black px-6 sm:px-8 py-2.5 sm:py-3 font-bold text-xs sm:text-sm tracking-wider border-2 border-black hover:bg-gray-100 transition-all duration-200 cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
