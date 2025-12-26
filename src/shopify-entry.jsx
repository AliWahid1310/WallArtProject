/**
 * Shopify Entry Point
 * This file is the entry point for the Shopify Theme App Extension build.
 * It mounts the React app into the Shopify storefront.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Wait for DOM to be ready
function mountApp() {
  const container = document.getElementById('gallery-wall-app')
  
  if (container) {
    // Remove loading spinner
    container.classList.remove('gallery-wall-builder-loading')
    container.innerHTML = ''
    
    // Mount React app
    const root = ReactDOM.createRoot(container)
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
    
    console.log('Gallery Wall Builder mounted successfully')
  } else {
    console.error('Gallery Wall Builder: Container element not found')
  }
}

// Mount when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp)
} else {
  mountApp()
}
