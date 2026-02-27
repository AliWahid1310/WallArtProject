import { useGallery } from '../../context/GalleryContext'
import BrandLogo from '../../assets/Gallery Wall Planner powered by Laboo Studio.png'
import Breadcrumb from './Breadcrumb'

export default function TopNavBar() {
  const {
    handleCheckout, handleAddToCart,
    calculateTotalPrice,
  } = useGallery()

  const displayPrice = calculateTotalPrice()

  return (
    <div className="hidden lg:grid bg-[#f5f3ee] border-b border-gray-200 px-6 py-1" style={{ gridTemplateColumns: '1fr auto 1fr' }}>

      {/* Left: Brand */}
      <div className="flex items-center">
        <img src={BrandLogo} alt="Gallery Wall Planner powered by Laboo Studio" className="h-[65px] object-contain" />
      </div>

      {/* Centre: Step progress */}
      <div className="flex items-center pl-16">
        <Breadcrumb inline />
      </div>

      {/* Right: Price + Checkout */}
      <div className="flex items-center justify-end gap-4">

        {/* Price */}
        <span className="text-gray-900 font-bold text-xl">
          £{displayPrice}
        </span>

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