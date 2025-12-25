/**
 * Fullscreen Prompt - Shows when device is landscape but not fullscreen
 * @param {Object} props
 * @param {boolean} props.isIOS - Whether device is iOS
 * @param {Function} props.onEnterFullscreen - Function to enter fullscreen
 */
export default function FullscreenPrompt({ isIOS, onEnterFullscreen }) {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[200] p-6">
      <div className="text-center text-white max-w-sm">
        {/* Fullscreen Icon */}
        <div className="mb-8">
          <svg className="w-28 h-28 mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </div>
        
        {isIOS ? (
          // iOS-specific content
          <>
            <h1 className="text-3xl font-bold mb-4">Ready to Start</h1>
            <p className="text-gray-300 text-lg mb-6">
              For the best experience, keep your device in <span className="font-semibold text-white">landscape mode</span>.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              💡 Tip: Add this page to your Home Screen for a fullscreen app-like experience!
            </p>
            <button
              onClick={onEnterFullscreen}
              className="bg-white text-black px-10 py-4 font-bold text-sm tracking-wider hover:bg-gray-200 transition-all duration-200 rounded-lg shadow-lg"
            >
              CONTINUE
            </button>
          </>
        ) : (
          // Android/Other devices content
          <>
            <h1 className="text-3xl font-bold mb-4">Go Fullscreen</h1>
            <p className="text-gray-300 text-lg mb-8">
              Tap the button below to enter <span className="font-semibold text-white">fullscreen mode</span> for an immersive gallery wall experience.
            </p>
            <button
              onClick={onEnterFullscreen}
              className="bg-white text-black px-10 py-4 font-bold text-sm tracking-wider hover:bg-gray-200 transition-all duration-200 rounded-lg shadow-lg"
            >
              ENTER FULLSCREEN
            </button>
          </>
        )}
      </div>
    </div>
  )
}
