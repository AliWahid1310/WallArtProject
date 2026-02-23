import { useEffect, useState } from 'react'
import { useGallery } from '../../context/GalleryContext'

export default function ResetModal() {
  const { showResetToast, setShowResetToast } = useGallery()

  // Two-phase state: rendered keeps DOM alive during exit animation
  const [rendered, setRendered] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (showResetToast) {
      setRendered(true)
      // Double rAF ensures the element is painted before transitioning in
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    } else {
      setVisible(false)
      const t = setTimeout(() => setRendered(false), 450)
      return () => clearTimeout(t)
    }
  }, [showResetToast])

  if (!rendered) return null

  return (
    <div
      className="fixed top-5 left-1/2 z-[9999]"
      style={{
        transform: `translateX(-50%) translateY(${visible ? '0px' : '-90px'})`,
        opacity: visible ? 1 : 0,
        transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className="flex items-start gap-3 bg-[#e6f4ea] border border-[#a8d5b5] text-[#1e5631] rounded-xl shadow-xl px-5 py-4 min-w-[320px] max-w-[420px]">
        {/* Checkmark icon */}
        <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-[#4a6741] flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        {/* Text */}
        <div className="flex-1">
          <p className="font-bold text-sm text-[#1e5631] leading-tight">Workspace Reset</p>
          <p className="text-[12px] text-[#2d7a4a] mt-1 leading-snug">
            The canvas has been cleared, but your uploaded rooms and art are still in your library.
          </p>
        </div>
        {/* Close button */}
        <button
          onClick={() => setShowResetToast(false)}
          className="flex-shrink-0 text-[#4a6741] hover:text-[#1e5631] transition-colors ml-1 mt-0.5 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
