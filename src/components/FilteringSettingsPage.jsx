import React from 'react';
import { Plus, ArrowLeft } from 'lucide-react';

const FilteringSettingsPage = ({ onNavigate, profanityList = [], replacements = {} }) => {
  const [customMode, setCustomMode] = useState(false);
  const [customWords, setCustomWords] = useState([]);
  const [editingWord, setEditingWord] = useState('');
  const [editingReplacement, setEditingReplacement] = useState('');
  return (
    <div className="bg-gray-900 text-white p-4 h-screen flex flex-col">
      <header className="mb-6 flex items-center">
        <ArrowLeft className="cursor-pointer mr-4" onClick={() => onNavigate('main')} />
        <h1 className="text-2xl font-bold">Filtering</h1>
      </header>
      
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
      
      <button 
        className="bg-blue-500 text-white py-3 rounded mt-auto"
        onClick={() => onNavigate('main')}
      >
        Save
      </button>
    </div>
  );
};

export default FilteringSettingsPage;
