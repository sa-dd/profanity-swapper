import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';

const AdvancedSettingsPage = ({ onNavigate }) => {
  const [settings, setSettings] = useState({
    lowSeverityColor: '#4caf50',   // Green
    mediumSeverityColor: '#ffc107', // Yellow
    highSeverityColor: '#f44336',   // Red
    lowOpacity: 20,
    mediumOpacity: 20,
    highOpacity: 20,
    highlightBorders: true,
    contextAnalysis: true,
    detectionSensitivity: 'medium',
    overlayPosition: 'above'
  });
  
  const [isSaved, setIsSaved] = useState(true);
  
  // Load settings from storage
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get('advancedSettings', (result) => {
        if (result.advancedSettings) {
          setSettings(result.advancedSettings);
        }
      });
    }
  }, []);
  
  // Handle settings change
  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setIsSaved(false);
  };
  
  // Save settings
  const saveSettings = () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ 'advancedSettings': settings }, () => {
        console.log('Advanced settings saved');
        setIsSaved(true);
        
        // Also send message to content script to update styles
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: 'updateAdvancedSettings',
              settings: settings
            });
          }
        });
      });
    } else {
      console.log('Settings would be saved:', settings);
      setIsSaved(true);
    }
  };
  
  // Reset to defaults
  const resetToDefaults = () => {
    setSettings({
      lowSeverityColor: '#4caf50',
      mediumSeverityColor: '#ffc107',
      highSeverityColor: '#f44336',
      lowOpacity: 20,
      mediumOpacity: 20,
      highOpacity: 20,
      highlightBorders: true,
      contextAnalysis: true,
      detectionSensitivity: 'medium',
      overlayPosition: 'above'
    });
    setIsSaved(false);
  };
  
  // Preview color with opacity
  const getColorWithOpacity = (color, opacity) => {
    // Convert hex to rgba
    let hexColor = color.replace('#', '');
    if (hexColor.length === 3) {
      hexColor = hexColor.split('').map(c => c + c).join('');
    }
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  return (
    <div className="bg-gray-900 text-white p-4 h-screen flex flex-col">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <ArrowLeft 
            className="cursor-pointer mr-4" 
            onClick={() => onNavigate('main')} 
          />
          <h1 className="text-2xl font-bold">Advanced Settings</h1>
        </div>
        
        {!isSaved && (
          <div className="flex items-center text-yellow-400 text-sm">
            <AlertCircle size={16} className="mr-1" />
            <span>Unsaved changes</span>
          </div>
        )}
      </header>
      
      <div className="flex-grow overflow-y-auto pb-24">
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Highlight Colors</h2>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Low Severity Color</label>
            <div className="flex items-center">
              <input
                type="color"
                value={settings.lowSeverityColor}
                onChange={e => handleChange('lowSeverityColor', e.target.value)}
                className="w-12 h-8 rounded cursor-pointer mr-3 bg-transparent"
              />
              <div 
                className="w-full h-8 rounded relative"
                style={{ backgroundColor: getColorWithOpacity(settings.lowSeverityColor, settings.lowOpacity) }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm">Sample text</span>
                </div>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={settings.lowOpacity}
              onChange={e => handleChange('lowOpacity', parseInt(e.target.value))}
              className="w-full mt-2"
            />
            <div className="text-xs text-gray-400 text-right">
              Opacity: {settings.lowOpacity}%
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Medium Severity Color</label>
            <div className="flex items-center">
              <input
                type="color"
                value={settings.mediumSeverityColor}
                onChange={e => handleChange('mediumSeverityColor', e.target.value)}
                className="w-12 h-8 rounded cursor-pointer mr-3 bg-transparent"
              />
              <div 
                className="w-full h-8 rounded relative"
                style={{ backgroundColor: getColorWithOpacity(settings.mediumSeverityColor, settings.mediumOpacity) }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm">Sample text</span>
                </div>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={settings.mediumOpacity}
              onChange={e => handleChange('mediumOpacity', parseInt(e.target.value))}
              className="w-full mt-2"
            />
            <div className="text-xs text-gray-400 text-right">
              Opacity: {settings.mediumOpacity}%
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">High Severity Color</label>
            <div className="flex items-center">
              <input
                type="color"
                value={settings.highSeverityColor}
                onChange={e => handleChange('highSeverityColor', e.target.value)}
                className="w-12 h-8 rounded cursor-pointer mr-3 bg-transparent"
              />
              <div 
                className="w-full h-8 rounded relative"
                style={{ backgroundColor: getColorWithOpacity(settings.highSeverityColor, settings.highOpacity) }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm">Sample text</span>
                </div>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={settings.highOpacity}
              onChange={e => handleChange('highOpacity', parseInt(e.target.value))}
              className="w-full mt-2"
            />
            <div className="text-xs text-gray-400 text-right">
              Opacity: {settings.highOpacity}%
            </div>
          </div>
        </section>
        
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Highlight Style</h2>
          
          <div className="mb-4 flex items-center justify-between">
            <span>Show border under highlights</span>
            <button
              onClick={() => handleChange('highlightBorders', !settings.highlightBorders)}
              className={`w-12 h-6 flex items-center ${
                settings.highlightBorders ? 'bg-blue-600' : 'bg-gray-600'
              } rounded-full p-1 duration-300 ease-in-out`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                settings.highlightBorders ? 'translate-x-6' : ''
              }`}></div>
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Overlay Position</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`p-3 rounded text-center ${
                  settings.overlayPosition === 'above' ? 'bg-blue-800' : 'bg-gray-800'
                }`}
                onClick={() => handleChange('overlayPosition', 'above')}
              >
                Above Text
              </button>
              <button
                className={`p-3 rounded text-center ${
                  settings.overlayPosition === 'below' ? 'bg-blue-800' : 'bg-gray-800'
                }`}
                onClick={() => handleChange('overlayPosition', 'below')}
              >
                Below Text
              </button>
            </div>
          </div>
        </section>
        
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Detection Settings</h2>
          
          <div className="mb-4 flex items-center justify-between">
            <span>Context Analysis (smarter detection)</span>
            <button
              onClick={() => handleChange('contextAnalysis', !settings.contextAnalysis)}
              className={`w-12 h-6 flex items-center ${
                settings.contextAnalysis ? 'bg-blue-600' : 'bg-gray-600'
              } rounded-full p-1 duration-300 ease-in-out`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                settings.contextAnalysis ? 'translate-x-6' : ''
              }`}></div>
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2">Detection Sensitivity</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`p-2 rounded text-center ${
                  settings.detectionSensitivity === 'low' ? 'bg-blue-800' : 'bg-gray-800'
                }`}
                onClick={() => handleChange('detectionSensitivity', 'low')}
              >
                Low
              </button>
              <button
                className={`p-2 rounded text-center ${
                  settings.detectionSensitivity === 'medium' ? 'bg-blue-800' : 'bg-gray-800'
                }`}
                onClick={() => handleChange('detectionSensitivity', 'medium')}
              >
                Medium
              </button>
              <button
                className={`p-2 rounded text-center ${
                  settings.detectionSensitivity === 'high' ? 'bg-blue-800' : 'bg-gray-800'
                }`}
                onClick={() => handleChange('detectionSensitivity', 'high')}
              >
                High
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {settings.detectionSensitivity === 'low' && 'Only flag the most severe profanity'}
              {settings.detectionSensitivity === 'medium' && 'Balance between accuracy and coverage'}
              {settings.detectionSensitivity === 'high' && 'Catch more edge cases (may have false positives)'}
            </p>
          </div>
        </section>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 border-t border-gray-800">
        <div className="flex justify-between">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 bg-gray-800 text-white rounded"
          >
            Reset to Defaults
          </button>
          <div>
            <button
              onClick={() => onNavigate('main')}
              className="px-4 py-2 bg-gray-800 text-white rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={saveSettings}
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={isSaved}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettingsPage;
