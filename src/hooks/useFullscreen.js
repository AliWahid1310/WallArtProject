import { useState, useEffect } from 'react'

/**
 * Custom hook for managing fullscreen state
 * @param {boolean} isIOS - Whether device is iOS (doesn't support fullscreen API)
 * @returns {{ isFullscreen: boolean, enterFullscreen: Function, exitFullscreen: Function }}
 */
export function useFullscreen(isIOS = false) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Track fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Check various fullscreen properties for cross-browser support
      const isFS = !!(document.fullscreenElement || 
                      document.webkitFullscreenElement || 
                      document.mozFullScreenElement ||
                      document.msFullscreenElement)
      setIsFullscreen(isFS)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  // Function to enter fullscreen (or skip for iOS)
  const enterFullscreen = () => {
    // iOS doesn't support Fullscreen API - just set state to continue
    if (isIOS) {
      setIsFullscreen(true)
      return
    }
    
    const elem = document.documentElement
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen()
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen()
    }
  }

  // Function to exit fullscreen
  const exitFullscreen = () => {
    // iOS - just set state
    if (isIOS) {
      setIsFullscreen(false)
      return
    }
    
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }

  return { isFullscreen, enterFullscreen, exitFullscreen }
}
