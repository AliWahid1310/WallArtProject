import { useGallery } from '../../context/GalleryContext'

export default function MobileBottomNav() {
  const {
    showMobileMenu, setShowMobileMenu,
    showCart, setShowCart,
    cartItems,
    handleAddToCart,
    calculateCartTotal
  } = useGallery()

  const cartCount = Object.keys(cartItems.artworks).length + Object.keys(cartItems.frames).length
  const hasCartItems = Object.keys(cartItems.artworks).length > 0 || Object.keys(cartItems.frames).length > 0

  return (
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
          {cartCount}
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
        £{hasCartItems ? calculateCartTotal() : '0'}
      </button>
    </div>
  )
}
