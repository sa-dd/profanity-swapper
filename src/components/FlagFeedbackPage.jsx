import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';

const FlagFeedbackPage = ({ onNavigate }) => {
  const [selectedIssue, setSelectedIssue] = useState('Spelling');
  const [suggestion, setSuggestion] = useState('');
  const [feedback, setFeedback] = useState('');

  const issues = ['Spelling', 'Punctuation', 'Capitalization', 'Grammar', 'Word choice'];

  return (
    <div className="bg-gray-900 text-white p-4 h-screen flex flex-col">
      <header className="mb-6 flex items-center">
        <ArrowLeft className="cursor-pointer mr-4" onClick={() => onNavigate('main')} />
        <h1 className="text-2xl font-bold">Flag</h1>
      </header>

      <h2 className="text-lg font-semibold mb-4">What's wrong with this word?</h2>

      <div className="space-y-2 mb-6">
        {issues.map((issue) => (
          <button
            key={issue}
            className={`flex justify-between items-center w-full p-3 rounded ${
              selectedIssue === issue ? 'bg-gray-700' : 'bg-gray-800'
            }`}
            onClick={() => setSelectedIssue(issue)}
          >
            {issue}
            {selectedIssue === issue && <Check className="text-blue-500" />}
          </button>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-2">Do you have a replacement suggestion?</h2>
      <input
        type="text"
        value={suggestion}
        onChange={(e) => setSuggestion(e.target.value)}
        placeholder="Suggestion"
        className="w-full bg-gray-800 p-3 rounded mb-6"
      />

      <h2 className="text-lg font-semibold mb-2">Anything else you'd like to share?</h2>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Feedback"
        className="w-full bg-gray-800 p-3 rounded mb-6 h-24 resize-none"
      />

      <button 
        className="bg-blue-500 text-white py-3 rounded mt-auto"
        onClick={() => onNavigate('main')}
      >
        Submit
      </button>
    </div>
  );
};

export default FlagFeedbackPage;
