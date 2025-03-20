import React, { useState, useEffect } from 'react'
import ProfanityFilterUI from './components/ProfanityFilterUI'
import PreferencesPage from './components/PreferencesPage'
import ExamplesPage from './components/ExamplesPage'
import FilteringSettingsPage from './components/FilteringSettingsPage'
import FlagFeedbackPage from './components/FlagFeedbackPage'
import TextAnalysisPage from './components/TextAnalysisPage'
import MainPage from "./components/MainPage"

function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [extensionState, setExtensionState] = useState({
    isActive: false,
    statistics: {
      totalFiltered: 0,
      recentDetections: []
    }
  });

  // Load extension state on component mount
  useEffect(() => {
    // Check if we're in a browser extension environment
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
        if (response) {
          setExtensionState(response);
        }
      });
    }
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };
  
  const toggleExtension = (isActive) => {
    // Update local state
    setExtensionState(prev => ({ ...prev, isActive }));
    
    // Send message to background script
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ 
        action: 'toggleActive', 
        isActive 
      });
    }
  };

  // Render the appropriate component based on currentPage
  const renderPage = () => {
    switch (currentPage) {
      case 'main':
        return <MainPage 
          onNavigate={navigateTo} 
          isActive={extensionState.isActive}
          toggleExtension={toggleExtension}
          statistics={extensionState.statistics}
        />;
      case 'preferences':
        return <PreferencesPage 
          onNavigate={navigateTo} 
          preferences={extensionState.preferences}
        />;
      case 'examples':
        return <ExamplesPage onNavigate={navigateTo} />;
      case 'filtering-settings':
        return <FilteringSettingsPage 
          onNavigate={navigateTo}
          profanityList={extensionState.profanityList}
          replacements={extensionState.replacements}
        />;
      case 'flag-feedback':
        return <FlagFeedbackPage onNavigate={navigateTo} />;
      case 'text-analysis':
        return <TextAnalysisPage onNavigate={navigateTo} />;
      case 'profanity-filter':
        return <ProfanityFilterUI 
          onNavigate={navigateTo}
          statistics={extensionState.statistics}
          isActive={extensionState.isActive}
        />;
      default:
        return <MainPage 
          onNavigate={navigateTo}
          isActive={extensionState.isActive}
          toggleExtension={toggleExtension}
          statistics={extensionState.statistics}
        />;
    }
  };

  return (
    <div className="w-[400px] h-[600px] bg-gray-900 text-white">
      {renderPage()}
    </div>
  )
}

export default App
