import React, { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const PreferencesPage = () => {
  const [selectedOptions, setSelectedOptions] = useState(['Slurs']);
  
  const options = ['Slurs', 'Insults', 'Blasphemy', 'Profanity'];

  const toggleOption = (option) => {
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="bg-gray-900 text-white p-4 h-screen flex flex-col">
      <header className="mb-6 flex items-center">
        <ArrowLeft className="cursor-pointer mr-4" />
        <h1 className="text-2xl font-bold">Set preferences</h1>
      </header>
      
      <p className="text-sm text-gray-400 mb-6">Choose your replacement</p>
      
      <div className="flex flex-col space-y-4 mb-6">
        {options.map((option) => (
          <button
            key={option}
            className={`flex justify-between items-center p-3 rounded ${
              selectedOptions.includes(option) ? 'bg-gray-700' : 'bg-gray-800'
            }`}
            onClick={() => toggleOption(option)}
          >
            {option}
            {selectedOptions.includes(option) && (
              <div className="w-4 h-4 bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
      
      <button className="bg-blue-500 text-white py-3 rounded mt-auto">
        Save changes
      </button>
    </div>
  );
};

export default PreferencesPage;
