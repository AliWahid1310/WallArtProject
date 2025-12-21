import { useAppContext } from '../context/AppContext';

/**
 * Left Sidebar Component - Exact replica from image
 * Centered vertical layout with icons, numbers, and text
 */
const LeftSidebar = () => {
  const { currentStep, goToStep, calculateTotal } = useAppContext();

  const steps = [
    { 
      number: 1, 
      name: 'SELECT BACKGROUND',
      icon: (
        <img 
          src="https://cdn2.iconfinder.com/data/icons/travel-locations/24/house-512.png" 
          alt="Select Place" 
          className="w-12 h-12 object-contain"
        />
      )
    },
    { 
      number: 2, 
      name: 'SELECT PICTURE WALL',
      icon: (
        <div className="flex items-center gap-1">
          <div className="w-8 h-10 bg-black rounded-sm"></div>
          <div className="w-4 h-10 bg-gray-300 rounded-sm"></div>
        </div>
      )
    },
    { 
      number: 3, 
      name: 'SELECT DESIGN',
      icon: (
        <div className="w-12 h-14 border-2 border-black rounded-sm flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
        </div>
      )
    },
    { 
      number: 4, 
      name: 'FRAME YOUR DESIGNS',
      icon: (
        <div className="w-12 h-14 border-2 border-black rounded-sm"></div>
      )
    },
  ];

  return (
    <aside className="w-96 h-screen flex flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="py-8 px-6 border-b border-gray-100">
        <h1 className="text-3xl font-bold tracking-[0.15em] text-center">DESENIO</h1>
      </div>

      {/* Step Navigation - Centered Vertical Layout */}
      <nav className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`flex flex-col items-center text-center cursor-pointer ${
              index < steps.length - 1 ? 'mb-16' : ''
            }`}
            onClick={() => goToStep(step.number)}
          >
            {/* Icon */}
            <div className="mb-6 flex items-center justify-center">
              {step.icon}
            </div>

            {/* Number */}
            <div className="mb-3">
              <span className="text-3xl font-light text-gray-900">
                {step.number}
              </span>
            </div>

            {/* Text */}
            <div>
              <p className="text-xs font-normal tracking-wider text-gray-900 uppercase">
                {step.name}
              </p>
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Section - Price and Add to Cart */}
      <div className="border-t border-gray-200 px-6 py-8 space-y-6">
        {/* Price */}
        <div className="text-center">
          <p className="text-5xl font-light text-gray-900">£ {calculateTotal()}</p>
        </div>

        {/* Add to Cart Button */}
        <button className="w-full bg-black text-white py-4 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm font-medium tracking-widest uppercase">
          ADD TO 
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default LeftSidebar;
