import { useAppContext } from '../context/AppContext';
import { useState } from 'react';

/**
 * Right Sidebar Component
 * Shows cart, total price, saved walls, and checkout button
 */
const RightSidebar = () => {
  const {
    cart,
    removeFromCart,
    calculateTotal,
    savedWalls,
    loadConfiguration,
    deleteConfiguration,
    saveConfiguration,
    resetConfiguration,
  } = useAppContext();

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [configName, setConfigName] = useState('');
  const [activeTab, setActiveTab] = useState('cart'); // 'cart' or 'saved'

  const handleSave = () => {
    if (configName.trim()) {
      saveConfiguration(configName);
      setConfigName('');
      setShowSaveDialog(false);
      setActiveTab('saved');
    }
  };

  return (
    <aside className="sidebar w-96 h-screen flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('cart')}
          className={`flex-1 px-4 py-3 font-semibold transition-colors ${
            activeTab === 'cart'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Cart ({cart.length})
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 px-4 py-3 font-semibold transition-colors ${
            activeTab === 'saved'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Saved ({savedWalls.length})
        </button>
      </div>

      {/* Cart Tab */}
      {activeTab === 'cart' && (
        <>
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Shopping Cart</h3>
            
            {cart.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">🛒</div>
                <p>Your cart is empty</p>
                <p className="text-sm mt-2">Add items to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="card flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-800">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">{item.category || item.type}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-primary">
                        ${item.price?.toFixed(2) || '0.00'}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total & Checkout */}
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary">${calculateTotal()}</span>
            </div>
            
            <button className="btn-primary w-full py-3 text-lg">
              Checkout
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowSaveDialog(true)}
                className="btn-secondary flex-1"
              >
                💾 Save Design
              </button>
              <button
                onClick={resetConfiguration}
                className="btn-secondary flex-1"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </>
      )}

      {/* Saved Walls Tab */}
      {activeTab === 'saved' && (
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Saved Designs</h3>
          
          {savedWalls.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-2">📁</div>
              <p>No saved designs yet</p>
              <p className="text-sm mt-2">Save your first design!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedWalls.map((wall) => (
                <div key={wall.id} className="card">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{wall.name}</h4>
                    <button
                      onClick={() => deleteConfiguration(wall.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {new Date(wall.date).toLocaleDateString()}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">
                      ${wall.totalPrice}
                    </span>
                    <button
                      onClick={() => {
                        loadConfiguration(wall.id);
                        setActiveTab('cart');
                      }}
                      className="text-xs bg-primary text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      Load
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Save Design</h3>
            <input
              type="text"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              placeholder="Enter design name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!configName.trim()}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default RightSidebar;
