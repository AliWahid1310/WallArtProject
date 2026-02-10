import { useGallery } from '../../context/GalleryContext'

export default function MobileMenuModal() {
  const { showMobileMenu, setShowMobileMenu, setShowResetModal } = useGallery()

  if (!showMobileMenu) return null

  return (
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
  )
}
