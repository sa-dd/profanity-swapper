import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

const ExamplesPage = () => {
  const examples = [
    { name: 'Holly', original: "I'm so pissed off!", filtered: "I'm so angry!" },
    { name: 'Jenny', original: "This is bullsh*t", filtered: "This is ridiculous" },
    { name: 'Mark', original: "That's f*cked up", filtered: "That's messed up" },
    { name: 'Alex', original: "What the h*ll?", filtered: "What the heck?" },
    { name: 'Ava', original: "You're a b*tch", filtered: "You're annoying" },
  ];

  return (
    <div className="bg-gray-900 text-white p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Detoxify Profanity</h1>
      
      <div className="flex flex-col space-y-4 mb-6 flex-grow overflow-y-auto">
        {examples.map((example, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400">{example.name}:</span>
              <Eye className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-gray-400">{example.original}</p>
            <p>{example.filtered}</p>
          </div>
        ))}
      </div>
      
      <button className="bg-blue-500 text-white py-3 rounded mt-auto">
        Add to Chrome
      </button>
    </div>
  );
};

export default ExamplesPage;
