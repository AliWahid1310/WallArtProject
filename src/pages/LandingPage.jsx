"use client"

import { GalleryProvider, useGallery } from '../context/GalleryContext'
import { MobilePortraitBlocker, FullscreenPrompt } from '../components'
import {
  SelectPlaceStep,
  SelectLayoutStep,
  SelectDesignStep,
  CheckoutStep
} from '../components/steps'

function GalleryRouter() {
  const {
    currentStep,
    isMobile, isLandscape, isFullscreen,
    isIOS, enterFullscreen,
  } = useGallery()

  console.log('[GalleryRouter] currentStep:', currentStep, 'isMobile:', isMobile, 'isLandscape:', isLandscape, 'isFullscreen:', isFullscreen)

  // Mobile Portrait Mode Blocker - Shows rotate prompt before any content
  if (isMobile && !isLandscape) {
    return <MobilePortraitBlocker />
  }

  // Mobile Landscape but NOT Fullscreen - Shows fullscreen prompt
  if (isMobile && isLandscape && !isFullscreen) {
    return <FullscreenPrompt isIOS={isIOS} onEnterFullscreen={enterFullscreen} />
  }

  switch (currentStep) {
    case 'step1':
      return <SelectPlaceStep />
    case 'step2':
      return <SelectLayoutStep />
    case 'step3':
      return <SelectDesignStep />
    case 'checkout':
      return <CheckoutStep />
    default:
      return <SelectPlaceStep />
  }
}

export default function LandingPage() {
  return (
    <GalleryProvider>
      <GalleryRouter />
    </GalleryProvider>
  )
}
