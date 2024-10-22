import React, { useState } from 'react';

const MainPage = ({ onNavigate }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleExtension = () => {
    setIsActive(!isActive);
    // Here you would add logic to actually start/pause the extension
  };

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col items-center justify-between p-6">
      <h1 className="text-2xl font-bold mb-8">Profanity Filter</h1>
      
      <div className="flex flex-col items-center">
        <button 
          onClick={toggleExtension}
          className={`w-16 h-8 flex items-center ${isActive ? 'bg-blue-600' : 'bg-gray-600'} rounded-full p-1 duration-300 ease-in-out`}
        >
          <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${isActive ? 'translate-x-8' : ''}`}></div>
        </button>
        <p className="mt-2 text-xl">{isActive ? 'Connected' : 'Disconnected'}</p>
      </div>
      
      <nav className="w-full mt-8">
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
