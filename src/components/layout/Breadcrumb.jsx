import { useGallery } from '../../context/GalleryContext'

const STEPS = [
  { key: 'step1', label: 'Choose Room', num: 1 },
  { key: 'step2', label: 'Customize Your Prints', num: 2 },
  { key: 'step3', label: 'Select Art', num: 3 },
  { key: 'checkout', label: 'Checkout', num: 4 },
]

function getStepIndex(currentStep) {
  switch (currentStep) {
    case 'intro': return -1
    case 'step1': return 0
    case 'step2': return 1
    case 'step3': return 2
    case 'checkout': return 3
    default: return -1
  }
}

export default function Breadcrumb() {
  const { currentStep, setCurrentStep, isCheckoutReady } = useGallery()
  const activeIndex = getStepIndex(currentStep)

  return (
    <div className="hidden lg:block bg-[#f5f3ee] border-b border-gray-200">
      <div className="w-full px-8 py-2.5">
        <div className="flex items-center justify-center max-w-4xl mx-auto">
          {STEPS.map((step, idx) => {
            const isActive = idx === activeIndex
            const isCompleted = idx < activeIndex
            // Steps 1-3 always clickable; step 4 only when all artworks are assigned
            const isCheckout = step.key === 'checkout'
            const isClickable = isCheckout ? isCheckoutReady : true

            return (
              <div key={step.key} className="flex items-center flex-1 last:flex-none">
                {/* Step circle + label */}
                <button
                  onClick={() => isClickable && setCurrentStep(step.key)}
                  className={`flex items-center gap-2.5 group ${
                    isClickable ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  disabled={!isClickable}
                >
                  {/* Circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 flex-shrink-0 ${
                      isCompleted
                        ? 'border-2 border-[#4a6741] text-[#4a6741] bg-white'
                        : isActive
                          ? 'bg-[#4a6741] text-white'
                          : isClickable
                            ? 'border-2 border-gray-400 text-gray-500 bg-white hover:border-[#4a6741] hover:text-[#4a6741]'
                            : 'border-2 border-gray-300 text-gray-400 bg-white'
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      step.num
                    )}
                  </div>
                  {/* Label */}
                  <span
                    className={`text-[15px] whitespace-nowrap transition-colors ${
                      isActive
                        ? 'font-semibold text-gray-900'
                        : isCompleted
                          ? 'font-medium text-gray-600 group-hover:text-gray-900'
                          : isClickable
                            ? 'font-normal text-gray-500 group-hover:text-gray-900'
                            : 'font-normal text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </button>

                {/* Connecting line */}
                {idx < STEPS.length - 1 && (
                  <div className="flex-1 mx-5">
                    <div
                      className={`h-[1.5px] w-full transition-colors duration-200 ${
                        idx < activeIndex ? 'bg-[#4a6741]' : 'bg-gray-300'
                      }`}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
