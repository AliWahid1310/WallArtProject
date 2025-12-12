import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import LeftSidebar from './components/LeftSidebar';
import Canvas from './components/Canvas';
import RightSidebar from './components/RightSidebar';

/**
 * Main App Component
 * Gallery Wall Configurator - React + JavaScript + Tailwind CSS
 * 
 * Structure:
 * - Landing Page: Initial welcome screen
 * - Left Sidebar: Step navigation + product list
 * - Center Canvas: Interactive preview with zoom
 * - Right Sidebar: Cart + saved walls + checkout
 */
function App() {
  const [showLanding, setShowLanding] = useState(true);

  const handleStartBuilding = () => {
    setShowLanding(false);
  };

  return (
    <AppProvider>
      {showLanding ? (
        <LandingPage onStartBuilding={handleStartBuilding} />
      ) : (
        <div className="flex h-screen overflow-hidden bg-gray-50">
          {/* Left Sidebar - Step Navigation & Products */}
          <LeftSidebar />

          {/* Center Canvas - Gallery Wall Preview */}
          <Canvas />

          {/* Right Sidebar - Cart & Saved Designs */}
          <RightSidebar />
        </div>
      )}
    </AppProvider>
  );
}

export default App;
