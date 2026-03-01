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

export default function Breadcrumb({ inline = false }) {
  const { currentStep, setCurrentStep, isCheckoutReady } = useGallery()
  const activeIndex = getStepIndex(currentStep)

  const inner = (
    <div className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const isActive = idx === activeIndex
        const isCompleted = idx < activeIndex
        const isCheckout = step.key === 'checkout'
        const isClickable = isCheckout ? isCheckoutReady : true

        return (
          <div key={step.key} className="flex items-center">
            <button
              onClick={() => isClickable && setCurrentStep(step.key)}
              className={`flex items-center gap-2 group ${
                isClickable ? 'cursor-pointer' : 'cursor-default'
              }`}
              disabled={!isClickable}
            >
              <div
                className={`w-7 h-7 rounded-full grid place-items-center text-xs font-semibold transition-all duration-200 flex-shrink-0 ${
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
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span
                className={`text-[13px] whitespace-nowrap transition-colors ${
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

            {idx < STEPS.length - 1 && (
              <div className="w-10 mx-3">
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
  )

  if (inline) return inner

  return (
    <div className="hidden lg:block bg-[#f5f3ee] border-b border-gray-200">
      <div className="w-full px-8 py-2.5">
        <div className="flex items-center justify-center max-w-4xl mx-auto">
          {inner}
        </div>
      </div>
    </div>
  )
}
