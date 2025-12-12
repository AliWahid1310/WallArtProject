import { useAppContext } from '../context/AppContext';
import { useState } from 'react';

/**
 * Canvas Component
 * Interactive preview of the gallery wall with zoom controls
 */
const Canvas = () => {
  const {
    selectedBackground,
    selectedLayout,
    selectedArtworks,
    selectedFrames,
    zoomLevel,
    setZoomLevel,
  } = useAppContext();

  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.2, 0.5));
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <main className="flex-1 flex flex-col bg-gray-100 relative">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          title="Zoom Out"
        >
          <span className="text-xl">−</span>
        </button>
        <span className="text-sm font-semibold w-12 text-center">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          title="Zoom In"
        >
          <span className="text-xl">+</span>
        </button>
        <button
          onClick={resetZoom}
          className="ml-2 px-3 py-1 text-xs rounded hover:bg-gray-100 transition-colors"
          title="Reset Zoom"
        >
          Reset
        </button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-hidden flex items-center justify-center p-8">
        <div
          className="relative bg-white rounded-lg shadow-2xl transition-transform duration-200"
          style={{
            width: '800px',
            height: '600px',
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          {/* Background */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: selectedBackground?.value || '#ffffff',
            }}
          />

          {/* Preview Content */}
          <div className="relative w-full h-full flex items-center justify-center">
            {!selectedBackground && !selectedLayout ? (
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">🖼️</div>
                <h3 className="text-xl font-semibold mb-2">Start Building Your Gallery Wall</h3>
                <p className="text-sm">Select a background to begin</p>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {/* Layout visualization will be rendered here */}
                {selectedLayout && (
                  <div className="text-center text-gray-600 p-8">
                    <p className="font-semibold">{selectedLayout.name}</p>
                    <p className="text-sm mt-2">{selectedLayout.description}</p>
                    <p className="text-xs mt-4 text-gray-400">
                      {selectedLayout.frameCount} frame{selectedLayout.frameCount > 1 ? 's' : ''}
                    </p>
                  </div>
                )}
                
                {!selectedLayout && selectedBackground && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <p className="text-lg">Background Selected!</p>
                      <p className="text-sm mt-2">Now choose a layout</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            {selectedBackground && (
              <span className="mr-4">
                Background: <strong>{selectedBackground.name}</strong>
              </span>
            )}
            {selectedLayout && (
              <span>
                Layout: <strong>{selectedLayout.name}</strong>
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400">
            Click and drag to pan • Use controls to zoom
          </div>
        </div>
      </div>
    </main>
  );
};

export default Canvas;
