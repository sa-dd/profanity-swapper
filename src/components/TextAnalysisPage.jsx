import React from 'react';

const TextAnalysisPage = () => {
  const beforeText = "I hate my job, I feel so overwhelmed.";
  const afterText = "I dislike my job, I feel so overwhelmed.";
  
  const AnalysisSection = ({ title, text, emotionalCharge }) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="bg-gray-800 p-4 rounded mb-4">{text}</p>
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-gray-400 mb-1">Emotional charge</h3>
          <p className="text-3xl font-bold">{emotionalCharge}</p>
        </div>
        <p className="text-gray-400">3 months</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 text-white p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Text analysis</h1>
      
      <AnalysisSection 
        title="Before detoxification"
        text={beforeText}
        emotionalCharge="7.8"
      />

      <AnalysisSection 
        title="After detoxification"
        text={afterText}
        emotionalCharge="6.8"
      />
    </div>
  );
};

export default TextAnalysisPage;
