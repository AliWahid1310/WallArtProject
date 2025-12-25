/**
 * Reusable confirmation modal component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Function to call when closing modal
 * @param {Function} props.onConfirm - Function to call on confirmation
 * @param {string} props.title - Modal title
 * @param {string} props.subtitle - Modal subtitle
 * @param {string} props.message - Modal message content
 * @param {string} props.confirmText - Text for confirm button
 * @param {string} props.cancelText - Text for cancel button
 * @param {'warning' | 'danger' | 'info'} props.type - Modal type for icon styling
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  subtitle = "This action cannot be undone",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning"
}) {
  if (!isOpen) return null

  const iconColors = {
    warning: { bg: 'bg-amber-100', text: 'text-amber-600' },
    danger: { bg: 'bg-red-100', text: 'text-red-600' },
    info: { bg: 'bg-blue-100', text: 'text-blue-600' }
  }

  const colors = iconColors[type] || iconColors.warning

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-fadeIn">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
              <svg className={`w-6 h-6 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-5">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-50 transition-all duration-200 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
