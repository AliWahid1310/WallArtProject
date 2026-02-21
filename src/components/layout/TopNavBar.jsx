import { useState, useEffect } from 'react'
import { useGallery } from '../../context/GalleryContext'
import BrandLogo from '../../assets/Gallery Wall Planner powered by Laboo Studio.png'

export default function TopNavBar() {
  const {
    cartItems, quantities, showCart, setShowCart,
    handleCheckout, calculateCartTotal, handleQuantityChange,
    setShowResetModal, setCartItems, currentStep
  } = useGallery()

  const cartCount = Object.keys(cartItems.artworks).length + Object.keys(cartItems.frames).length
  const hasCartItems = cartCount > 0

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
        <img src={BrandLogo} alt="Gallery Wall Planner powered by Laboo Studio" className="h-[52px] object-contain" />
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
          onClick={() => setShowResetModal(true)}
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
            £{hasCartItems ? calculateCartTotal() : '0.00'}
          </button>

          {/* Cart Dropdown */}
          {showCart && hasCartItems && (
            <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 shadow-2xl rounded-lg z-50 max-h-[400px] sm:max-h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {Object.entries(cartItems.artworks).map(([frameIdx, artwork]) => (
                  <div key={`artwork-${frameIdx}`} className="flex gap-3 pb-4 border-b border-gray-200">
                    <div className="w-20 h-28 flex-shrink-0 border border-gray-200 rounded">
                      <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-medium text-sm mb-1">{artwork.title}</h3>
                      {artwork.frameSize && (
                        <p className="text-xs text-gray-500 mb-1">{artwork.frameSize}</p>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-600 font-bold text-base">£ {artwork.price}</span>
                      </div>
                      <select
                        value={quantities.artworks[frameIdx] || 1}
                        onChange={(e) => handleQuantityChange('artworks', frameIdx, e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center cursor-pointer"
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <button onClick={() => {
                      const newArtworks = { ...cartItems.artworks }
                      delete newArtworks[frameIdx]
                      setCartItems({ ...cartItems, artworks: newArtworks })
                    }} className="text-gray-400 hover:text-black transition-colors cursor-pointer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                {Object.entries(cartItems.frames).map(([frameIdx, frame]) => {
                  const artwork = cartItems.artworks[frameIdx]
                  if (!artwork) return null
                  return (
                    <div key={`frame-${frameIdx}`} className="flex gap-3 pb-4 border-b border-gray-200">
                      <div className="w-20 h-28 flex-shrink-0 rounded" style={{ padding: '3px', backgroundColor: frame.color, border: frame.borderColor ? `1px solid ${frame.borderColor}` : 'none' }}>
                        <div className="w-full h-full bg-white rounded">
                          <img src={artwork.image} alt={`${frame.name} frame`} className="w-full h-full object-cover rounded" />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h3 className="font-medium text-sm mb-1">{frame.name} picture frame</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-red-600 font-bold text-base">£ {frame.price.toFixed(2)}</span>
                        </div>
                        <select value={quantities.frames[frameIdx] || 1} onChange={(e) => handleQuantityChange('frames', frameIdx, e.target.value)} className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center cursor-pointer">
                          {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                      <button onClick={() => {
                        const newFrames = { ...cartItems.frames }
                        delete newFrames[frameIdx]
                        setCartItems({ ...cartItems, frames: newFrames })
                      }} className="text-gray-400 hover:text-black transition-colors cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )
                })}
              </div>
              <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">TOTAL AMOUNT</span>
                  <span className="text-lg font-bold">£{calculateCartTotal()}</span>
                </div>
                <button onClick={handleCheckout} className="w-full bg-[#4a6741] text-white py-3 font-bold text-sm tracking-widest hover:bg-[#3d5636] rounded-full transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg">CHECKOUT</button>
              </div>
            </div>
          )}
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="bg-[#3d3d3d] text-white px-7 py-2.5 font-bold text-[13px] tracking-widest uppercase rounded-md hover:bg-[#2a2a2a] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
        >
          CHECKOUT
        </button>
      </div>
    </div>
  )
}
