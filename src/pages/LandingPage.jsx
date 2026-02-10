"use client"

import { GalleryProvider, useGallery } from '../context/GalleryContext'
import { MobilePortraitBlocker, FullscreenPrompt } from '../components'
import {
  IntroStep,
  SelectPlaceStep,
  SelectBackgroundStep,
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
    case 'intro':
      return <IntroStep />
    case 'step1':
      return <SelectPlaceStep />
    case 'step2':
      return <SelectBackgroundStep />
    case 'step3':
      return <SelectLayoutStep />
    case 'step4':
      return <SelectDesignStep />
    case 'checkout':
      return <CheckoutStep />
    default:
      return <IntroStep />
  }
}

export default function LandingPage() {
  return (
    <GalleryProvider>
      <GalleryRouter />
    </GalleryProvider>
  )
}
