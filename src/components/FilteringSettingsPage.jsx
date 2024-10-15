import React from 'react';
import { Plus } from 'lucide-react';

const FilteringSettingsPage = () => {
  return (
    <div className="bg-gray-900 text-white p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Filtering</h1>
      
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Website</h2>
        <button className="flex items-center justify-between w-full bg-gray-800 p-3 rounded">
          <span className="text-gray-400">Add a website</span>
          <Plus className="text-gray-400" />
        </button>
      </section>
      
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Filtering</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Profanity</h3>
              <p className="text-sm text-gray-400">Block all profanity</p>
            </div>
            <button className="bg-gray-700 px-3 py-1 rounded text-sm">
              Change
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Custom</h3>
              <p className="text-sm text-gray-400">Show only the words you choose</p>
            </div>
            <button className="bg-gray-700 px-3 py-1 rounded text-sm">
              Change
            </button>
          </div>
        </div>
      </section>
      
      <button className="bg-blue-500 text-white py-3 rounded mt-auto">
        Save
      </button>
    </div>
  );
};

export default FilteringSettingsPage;
