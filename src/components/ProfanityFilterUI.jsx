import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';

const ProfanityFilterUI = ({ onNavigate }) => {
  return (
    <div className="bg-gray-900 text-white p-4 h-screen flex flex-col">
      <header className="mb-4">
        <ArrowLeft className="cursor-pointer" onClick={() => onNavigate('main')} />
      </header>
      
      <h1 className="text-2xl font-bold mb-2">Detoxify your online experience</h1>
      <p className="text-sm text-gray-400 mb-6">
        Profanity filter is on. It's blocking 3 words and 2 phrases from your view.
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-sm text-gray-400">Total detected</h2>
          <p className="text-2xl font-bold">1,234</p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-sm text-gray-400">Words</h2>
          <p className="text-2xl font-bold">567</p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-sm text-gray-400">Phrases</h2>
          <p className="text-2xl font-bold">345</p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-sm text-gray-400">Sentences</h2>
          <p className="text-2xl font-bold">322</p>
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded flex items-center mb-6">
        <Clock className="mr-2" />
        <div>
          <h2 className="font-bold">Recent activity</h2>
          <p className="text-sm text-gray-400">Showed 10 new detections</p>
        </div>
      </div>
      
      <button className="bg-gray-700 text-white py-2 rounded mb-6">
        Pause profanity filter
      </button>
      
      <footer className="mt-auto text-center text-sm text-gray-500">
        2022 © Profanity Detox. All rights reserved
      </footer>
    </div>
  );
};

export default ProfanityFilterUI;
