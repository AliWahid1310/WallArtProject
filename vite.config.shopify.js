import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Shopify-specific build configuration
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'extensions/gallery-extension/assets',
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, 'src/shopify-entry.jsx'),
      output: {
        entryFileNames: 'gallery-app.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css' || assetInfo.name?.endsWith('.css')) {
            return 'gallery-app.css'
          }
          return assetInfo.name
        },
        // Single bundle for Shopify
        manualChunks: undefined,
        inlineDynamicImports: true,
      },
    },
    // Ensure CSS is extracted
    cssCodeSplit: false,
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging initially
      },
    },
  },
})
