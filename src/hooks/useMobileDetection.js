import { useState, useEffect } from 'react'

/**
 * Custom hook for detecting mobile viewport, orientation, and iOS
 * @returns {{ isMobile: boolean, isLandscape: boolean, isIOS: boolean, showRotatePrompt: boolean, setShowRotatePrompt: Function }}
 */
export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLandscape, setIsLandscape] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showRotatePrompt, setShowRotatePrompt] = useState(true)

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    setIsIOS(iOS)
    
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      const landscape = window.innerWidth > window.innerHeight
      setIsMobile(mobile)
      setIsLandscape(landscape)
      // On mobile portrait, always show rotate prompt (blocks entire app)
      if (mobile && !landscape) {
        setShowRotatePrompt(true)
      } else {
        setShowRotatePrompt(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [])

  return { isMobile, isLandscape, isIOS, showRotatePrompt, setShowRotatePrompt }
}
