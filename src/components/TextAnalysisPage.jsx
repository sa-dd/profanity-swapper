import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

// Simple fallback implementations
const calculateEmotionalCharge = (text) => {
  // Simple implementation
  let score = 5;
  if (text.toLowerCase().includes('hate')) score += 2;
  if (text.toLowerCase().includes('love')) score -= 1;
  return score.toFixed(1);
};

const detoxifyText = (text, profanityList = [], replacements = {}) => {
  if (!text) return text;
  
  let detoxifiedText = text;
  
  // Use provided profanity list and replacements if available
  if (profanityList && profanityList.length > 0) {
    profanityList.forEach(word => {
      if (word) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const replacement = replacements[word] || '*'.repeat(word.length);
        detoxifiedText = detoxifiedText.replace(regex, replacement);
      }
    });
  } else {
    // Default replacements if no list is provided
    detoxifiedText = text
      .replace(/\bhate\b/gi, 'dislike')
      .replace(/\bdamn\b/gi, 'darn')
      .replace(/\bhell\b/gi, 'heck');
  }
  
  return detoxifiedText;
};

const defaultProfanityList = ["hate", "damn", "hell", "shit", "fuck"];
const defaultReplacements = {
  "hate": "dislike",
  "damn": "darn",
  "hell": "heck",
  "shit": "poop",
  "fuck": "fudge"
};

const TextAnalysisPage = ({ onNavigate }) => {
  const [inputText, setInputText] = useState("I hate my job, I feel so overwhelmed.");
  const [beforeText, setBeforeText] = useState("I hate my job, I feel so overwhelmed.");
  const [afterText, setAfterText] = useState("I dislike my job, I feel so overwhelmed.");
  const [beforeCharge, setBeforeCharge] = useState("7.8");
  const [afterCharge, setAfterCharge] = useState("6.8");
  const [profanityList, setProfanityList] = useState(defaultProfanityList);
  const [replacements, setReplacements] = useState(defaultReplacements);
  
  // Load extension settings when component mounts
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
        if (response) {
          if (response.profanityList) setProfanityList(response.profanityList);
          if (response.replacements) setReplacements(response.replacements);
        }
      });
    }
  }, []);
  
  // Analyze text when input changes
  const analyzeText = () => {
    // Use the input text as the before text
    setBeforeText(inputText);
    
    // Calculate emotional charge for original text
    const charge = calculateEmotionalCharge(inputText);
    setBeforeCharge(charge);
    
    // Detoxify the text
    const detoxified = detoxifyText(inputText, profanityList, replacements);
    setAfterText(detoxified);
    
    // Calculate emotional charge for detoxified text
    const detoxifiedCharge = calculateEmotionalCharge(detoxified);
    setAfterCharge(detoxifiedCharge);
  };
  
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
      <header className="mb-4">
        <ArrowLeft className="cursor-pointer" onClick={() => onNavigate('main')} />
      </header>
      
      <h1 className="text-2xl font-bold mb-4">Text analysis</h1>
      
      <div className="mb-6">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to analyze"
          className="w-full bg-gray-800 p-3 rounded mb-2 text-white"
          rows={4}
        />
        <button 
          onClick={analyzeText}
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
        >
          Analyze Text
        </button>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        <AnalysisSection 
          title="Before detoxification"
          text={beforeText}
          emotionalCharge={beforeCharge}
        />

        <AnalysisSection 
          title="After detoxification"
          text={afterText}
          emotionalCharge={afterCharge}
        />
      </div>
    </div>
  );
};

export default TextAnalysisPage;
