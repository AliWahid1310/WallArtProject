import { useGallery } from '../../context/GalleryContext'
import { placeCategories } from '../../data'
import { TopNavBar, Breadcrumb, MobileBottomNav, MobileMenuModal, ResetModal } from '../layout'

export default function SelectPlaceStep() {
  const {
    setCurrentStep,
    selectedPlace, setSelectedPlace,
  } = useGallery()

  return (
    <>
      <ResetModal />
      
      <div className="h-screen bg-white flex flex-col overflow-hidden">
        <TopNavBar />
        <Breadcrumb />
        <div className="flex flex-row flex-1 overflow-hidden pb-12 lg:pb-0">
          {/* Left Sidebar */}
          <div className="flex w-36 lg:w-80 bg-white border-r border-gray-300 px-2 lg:px-6 py-3 lg:py-4 flex-col h-full">

            <div className="lg:hidden flex-shrink-0 mb-3 text-center border-b border-gray-200 pb-2">
              <p className="text-[9px] font-bold tracking-wide">1 SELECT PLACE</p>
            </div>

            <div className="hidden lg:flex items-center justify-between px-0 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
              <p className="text-xs sm:text-sm font-semibold tracking-wide">1. SELECT PLACE</p>
              <button
                onClick={() => setCurrentStep("intro")}
                className="text-2xl font-light text-gray-600 hover:text-black transition-colors cursor-pointer leading-none"
              >
                ✕
              </button>
            </div>

            {/* Place Options */}
            <div className="flex-1 flex flex-col overflow-y-auto min-h-0 py-1 lg:py-6 px-0" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <div className="space-y-3 lg:space-y-6 py-1 lg:pr-2">
                {placeCategories.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => setSelectedPlace(place)}
                    className="relative cursor-pointer transition-all duration-300 group hover:shadow-lg"
                  >
                    <div className="relative h-16 lg:h-40 bg-gray-200 overflow-hidden">
                      <img 
                        src={place.image} 
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      />
                    </div>
                    <div className="hidden lg:block py-4 pl-2 pr-4 bg-white border border-t-0 border-gray-200">
                      <h3 className="text-base font-bold text-black mb-1">{place.name}</h3>
                      <p className="text-xs text-gray-600">{place.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="px-0 py-2 lg:py-4 border-t border-gray-200 space-y-1.5 lg:space-y-3 flex-shrink-0">
              <button 
                disabled={!selectedPlace}
                onClick={() => selectedPlace && setCurrentStep("step2")}
                className="w-full bg-black text-white py-2 lg:py-4 font-bold text-[10px] lg:text-sm tracking-widest hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
              >
                NEXT
              </button>
              <button 
                onClick={() => setCurrentStep("intro")}
                className="hidden lg:flex w-full bg-white text-black py-2 lg:py-3 font-bold text-[10px] lg:text-sm tracking-wide border-2 border-black hover:bg-gray-100 transition-all duration-200 cursor-pointer items-center justify-center gap-1"
              >
                PREVIOUS
              </button>
              <button 
                onClick={() => setCurrentStep("intro")}
                className="lg:hidden w-full bg-white text-black py-2 font-bold text-[10px] tracking-wide border-2 border-black hover:bg-gray-100 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1"
              >
                <span className="text-xs">✕</span>
                CLOSE
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">

            <div className="flex-1 flex flex-col overflow-hidden">
              <div
                className="flex-1 relative bg-cover bg-center overflow-hidden"
                style={{
                  backgroundImage: selectedPlace 
                    ? `url(${selectedPlace.image})` 
                    : "url(https://res.cloudinary.com/desenio/image/upload/w_1400/backgrounds/welcome-bg.jpg?v=1)",
                }}
              >
                {!selectedPlace && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm px-8 lg:px-12 py-6 lg:py-8 rounded-lg shadow-xl">
                      <p className="text-sm lg:text-2xl font-light text-gray-700 text-center">
                        Select a place to continue
                      </p>
                    </div>
                  </div>
                )}
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
