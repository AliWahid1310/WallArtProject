import { useGallery } from '../../context/GalleryContext'

export default function TopNavBar() {
  const {
    cartItems, quantities, showCart, setShowCart,
    handleCheckout, calculateCartTotal, handleQuantityChange,
    setShowResetModal, setCartItems
  } = useGallery()

  const cartCount = Object.keys(cartItems.artworks).length + Object.keys(cartItems.frames).length
  const hasCartItems = cartCount > 0

  return (
    <div className="hidden lg:flex bg-gray-200 border-b border-gray-200 px-8 py-4 items-center justify-between">
      {/* Left: Title */}
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gallery Wall Planner</h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-5">
        {/* Wishlist / Heart Icon */}
        <button
          className="text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          title="Wishlist"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Save / Gallery Icon */}
        <button
          onClick={() => setShowResetModal(true)}
          className="text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          title="Save"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
        </button>

        {/* Price */}
        <div className="relative">
          <button
            onClick={() => setShowCart(!showCart)}
            className="text-gray-700 font-semibold text-base cursor-pointer hover:text-gray-900 transition-colors"
          >
            £{hasCartItems ? calculateCartTotal() : '0.00'}
          </button>

          {/* Cart Dropdown */}
          {showCart && hasCartItems && (
            <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 shadow-2xl rounded-lg z-50 max-h-[400px] sm:max-h-[600px] flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Artwork Items */}
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
                {/* Frame Items */}
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
          className="bg-[#4a6741] text-white px-6 py-2 font-semibold text-sm rounded-full hover:bg-[#3d5636] transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
        >
          Checkout
        </button>
      </div>
    </div>
  )
}
