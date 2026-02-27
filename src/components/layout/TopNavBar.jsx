import { useState, useEffect } from 'react'
import { useGallery } from '../../context/GalleryContext'
import { getVariantPrice } from '../../utils/helpers'
import BrandLogo from '../../assets/Gallery Wall Planner powered by Laboo Studio.png'

export default function TopNavBar() {
  const {
    cartItems, quantities, showCart, setShowCart,
    handleCheckout, calculateCartTotal, handleQuantityChange,
    setShowResetModal, setCartItems, currentStep, handleReset,
    calculateTotalPrice, selectedArtworks, setSelectedArtworks,
    printSize, perFrameSizes, printStyle, handleAddToCart,
  } = useGallery()

  const hasSelectedArtworks = Object.keys(selectedArtworks).length > 0

  // Show total price based on selected artworks (persists across steps)
  const displayPrice = calculateTotalPrice()

  // Helper: get resolved price for a frame index
  const getFramePrice = (frameIdx) => {
    const artwork = selectedArtworks[frameIdx]
    if (!artwork) return 0
    const framePrintSize = perFrameSizes?.length > 0
      ? (perFrameSizes[parseInt(frameIdx)] || printSize)
      : printSize
    return parseFloat(getVariantPrice(artwork, framePrintSize)) || 0
  }

  // Helper: get size label for a frame index
  const getFrameSize = (frameIdx) => {
    const framePrintSize = perFrameSizes?.length > 0
      ? (perFrameSizes[parseInt(frameIdx)] || printSize)
      : printSize
    return framePrintSize || ''
  }

  // Local quantities for the dropdown
  const [dropdownQty, setDropdownQty] = useState({})
  useEffect(() => {
    setDropdownQty(prev => {
      const next = {}
      Object.keys(selectedArtworks).forEach(k => { next[k] = prev[k] || 1 })
      return next
    })
  }, [selectedArtworks])

  // Last-saved clock
  const [lastSaved, setLastSaved] = useState(null)
  useEffect(() => {
    const now = new Date()
    setLastSaved(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase())
    const id = setInterval(() => {
      const t = new Date()
      setLastSaved(t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase())
    }, 60_000)
    return () => clearInterval(id)
  }, [currentStep])

  return (
    <div className="hidden lg:flex bg-[#f5f3ee] border-b border-gray-200 px-8 py-2 items-center justify-between">

      {/* ── Left: Brand ── */}
      <div className="flex items-center">
        <img src={BrandLogo} alt="Gallery Wall Planner powered by Laboo Studio" className="h-[65px] object-contain" />
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-6">

        {/* Cloud Sync */}
        <button className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 3.75 3.75 0 013.572 5.345A4.5 4.5 0 0118.75 19.5H6.75z" />
            </svg>
            <span className="text-[11px] font-bold tracking-widest uppercase">Cloud Sync</span>
          </div>
          {lastSaved && (
            <span className="text-[9px] text-gray-400 tracking-wide">LAST SAVED: {lastSaved}</span>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300" />

        {/* Reset App */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
          <span className="text-[11px] font-bold tracking-widest uppercase">Reset App</span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300" />

        {/* Price */}
        <div className="relative">
          <button
            onClick={() => setShowCart(!showCart)}
            className="text-gray-900 font-bold text-xl cursor-pointer hover:text-gray-700 transition-colors"
          >
            £{displayPrice}
          </button>

          {/* Dropdown showing selected artworks */}
          {showCart && hasSelectedArtworks && (
            <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 shadow-2xl rounded-lg z-50 max-h-[500px] sm:max-h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {Object.entries(selectedArtworks).map(([frameIdx, artwork]) => {
                  const price = getFramePrice(frameIdx)
                  const size = getFrameSize(frameIdx)
                  const qty = dropdownQty[frameIdx] || 1
                  return (
                    <div key={`artwork-${frameIdx}`} className="flex gap-3 pb-4 border-b border-gray-200">
                      <div className="w-20 h-28 flex-shrink-0 border border-gray-200 rounded overflow-hidden">
                        <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover rounded" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h3 className="font-semibold text-sm mb-0.5">{artwork.title}</h3>
                        {size && (
                          <p className="text-xs text-gray-400 mb-1">{size}</p>
                        )}
                        <p className="text-red-600 font-bold text-base mb-2">£ {(price * qty).toFixed(2)}</p>
                        <div className="relative inline-block w-fit">
                          <select
                            value={qty}
                            onChange={(e) => setDropdownQty(prev => ({ ...prev, [frameIdx]: parseInt(e.target.value) }))}
                            className="pl-4 pr-8 py-1.5 border border-gray-300 rounded-md text-sm bg-white cursor-pointer appearance-none focus:outline-none"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                              backgroundPosition: 'right 0.4rem center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '1.2em 1.2em',
                            }}
                          >
                            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                      </div>
                      <button onClick={() => {
                        const newArtworks = { ...selectedArtworks }
                        delete newArtworks[frameIdx]
                        setSelectedArtworks(newArtworks)
                      }} className="text-gray-300 hover:text-gray-500 transition-colors cursor-pointer self-start mt-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )
                })}
              </div>
              <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-extrabold">TOTAL AMOUNT</span>
                  <span className="text-base font-extrabold">£{displayPrice}</span>
                </div>
                <button
                  onClick={() => { handleAddToCart(); setTimeout(() => handleCheckout(), 100) }}
                  className="w-full bg-[#4a6741] text-white py-3 font-bold text-sm tracking-[0.2em] hover:bg-[#3d5636] rounded-full transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
                >
                  CHECKOUT
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Checkout Button */}
        <button
          onClick={() => { handleAddToCart(); setTimeout(() => handleCheckout(), 100) }}
          className="bg-[#4a6741] text-white px-7 py-2.5 font-bold text-[13px] tracking-widest uppercase rounded-full hover:bg-[#3d5636] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
        >
          CHECKOUT
        </button>
      </div>
    </div>
  )
}
