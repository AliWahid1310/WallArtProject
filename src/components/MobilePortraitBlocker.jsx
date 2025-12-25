/**
 * Mobile Portrait Mode Blocker - Shows rotate prompt when device is in portrait
 */
export default function MobilePortraitBlocker() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[200] p-6">
      <div className="text-center text-white max-w-sm">
        {/* Rotate Phone Animation */}
        <div className="mb-8 relative">
          <div className="animate-pulse">
            <svg className="w-32 h-32 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-16 h-16 animate-spin" style={{animationDuration: '3s'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Rotate Your Device</h1>
        <p className="text-gray-300 text-lg mb-8">
          Please rotate your phone to <span className="font-semibold text-white">landscape mode</span> for the best gallery wall experience.
        </p>
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <svg className="w-12 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth={1.5} />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
          </svg>
          <span className="text-sm">Landscape mode</span>
        </div>
      </div>
    </div>
  )
}
