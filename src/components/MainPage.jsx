import React, { useState, useEffect } from 'react';

const MainPage = ({ onNavigate, isActive, toggleExtension, statistics, highlightMode }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [highlightEnabled, setHighlightEnabled] = useState(
    highlightMode?.enabled ?? true
  );
  const [autoReplace, setAutoReplace] = useState(
    highlightMode?.autoReplace ?? false
  );

  // Update highlight mode when toggled
  const handleHighlightToggle = () => {
    const newValue = !highlightEnabled;
    setHighlightEnabled(newValue);
    
    // Update in background script
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({
        action: 'updateHighlightMode',
        highlightMode: {
          enabled: newValue
        }
      });
    }
  };

  // Update auto-replace mode when toggled
  const handleAutoReplaceToggle = () => {
    const newValue = !autoReplace;
    setAutoReplace(newValue);
    
    // Update in background script
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({
        action: 'updateHighlightMode',
        highlightMode: {
          autoReplace: newValue
        }
      });
    }
  };

  // Toggle main extension
  const handleToggle = () => {
    toggleExtension(!isActive);
  };

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">Profanity Filter</h1>
      
      <div className="flex flex-col items-center mb-4 w-full">
        <div className="flex items-center justify-between w-full mb-2">
          <span className="text-lg">Extension Active</span>
          <button 
            onClick={handleToggle}
            className={`w-16 h-8 flex items-center ${isActive ? 'bg-blue-600' : 'bg-gray-600'} rounded-full p-1 duration-300 ease-in-out`}
          >
            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${isActive ? 'translate-x-8' : ''}`}></div>
          </button>
        </div>
        <p className="text-sm text-gray-400 w-full text-right">
          {isActive ? 'Filtering content' : 'Not filtering content'}
        </p>
      </div>
      
      {isActive && (
        <>
          <div className="flex flex-col items-center mb-4 w-full">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-lg">Highlight Mode</span>
              <button 
                onClick={handleHighlightToggle}
                className={`w-16 h-8 flex items-center ${highlightEnabled ? 'bg-blue-600' : 'bg-gray-600'} rounded-full p-1 duration-300 ease-in-out`}
              >
                <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${highlightEnabled ? 'translate-x-8' : ''}`}></div>
              </button>
            </div>
            <p className="text-sm text-gray-400 w-full text-right">
              {highlightEnabled ? 'Highlight profanity for review' : 'Auto-replace all profanity'}
            </p>
          </div>

          {highlightEnabled && (
            <div className="flex flex-col items-center mb-6 w-full">
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-lg">Auto-Replace</span>
                <button 
                  onClick={handleAutoReplaceToggle}
                  className={`w-16 h-8 flex items-center ${autoReplace ? 'bg-blue-600' : 'bg-gray-600'} rounded-full p-1 duration-300 ease-in-out`}
                >
                  <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${autoReplace ? 'translate-x-8' : ''}`}></div>
                </button>
              </div>
              <p className="text-sm text-gray-400 w-full text-right">
                {autoReplace ? 'Automatically replace with suggestions' : 'Ask for confirmation before replacing'}
              </p>
            </div>
          )}
        </>
      )}
      
      {isActive && statistics && (
        <div className="w-full mb-6 p-4 bg-gray-800 rounded">
          <h2 className="text-lg font-semibold mb-2">Statistics</h2>
          <div className="flex justify-between mb-1">
            <span>Total profanities filtered:</span>
            <span className="font-medium">{statistics.totalFiltered || 0}</span>
          </div>
          {statistics.recentDetections && statistics.recentDetections.length > 0 && (
            <div className="mt-2">
              <h3 className="text-sm text-gray-400">Recent detections:</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {statistics.recentDetections.slice(0, 5).map((word, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <button
        className="text-sm text-gray-400 mb-6"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
      </button>
      
      {showAdvanced && (
        <div className="w-full mb-6 p-4 bg-gray-800 rounded">
          <h2 className="text-lg font-semibold mb-2">Advanced Options</h2>
          <div className="text-sm text-gray-400 mb-2">
            Configure highlight colors, detection sensitivity, and context analysis settings.
          </div>
          <button 
            className="w-full bg-gray-700 py-2 rounded text-sm"
            onClick={() => onNavigate('advanced-settings')}
          >
            Open Advanced Settings
          </button>
        </div>
      )}
      
      <nav className="w-full mt-2">
        <ul className="space-y-2">
          {[
            { name: 'Preferences', view: 'preferences' },
            { name: 'Examples', view: 'examples' },
            { name: 'Filtering Settings', view: 'filtering-settings' },
            { name: 'Flag & Feedback', view: 'flag-feedback' },
            { name: 'Text Analysis', view: 'text-analysis' },
          ].map((item) => (
            <li key={item.name}>
              <button
                onClick={() => onNavigate(item.view)}
                className="w-full text-left py-2 px-4 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default MainPage;
