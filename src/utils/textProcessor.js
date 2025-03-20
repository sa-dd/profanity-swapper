// textProcessor.js
// Utility functions for text processing

// Score emotional charge of a text (simplified version)
export const calculateEmotionalCharge = (text) => {
  // This is a simplified algorithm - in a real application,
  // you would use NLP libraries or ML models

  // Example scoring:
  // 1. Count profanities and assign weight
  // 2. Look for ALL CAPS (shouting)
  // 3. Look for excessive punctuation (!!, ?!, etc.)
  // 4. Check for negative sentiment words
  
  // Convert to lowercase
  const lowerText = text.toLowerCase();
  
  // Simple list of trigger words with intensity scores
  const triggerWords = {
    'hate': 3,
    'angry': 1.5,
    'mad': 1.5,
    'furious': 2.5,
    'pissed': 2.5,
    'fuck': 3,
    'shit': 2,
    'damn': 1.5,
    'hell': 1,
    'awful': 1.5,
    'terrible': 1.5,
    'horrible': 2,
    'stupid': 2,
    'idiot': 2.5,
    'dumb': 2,
    'worst': 1.5,
    'bad': 1,
    'kill': 3,
    'die': 2.5,
    'death': 2,
    'hurt': 1.5,
    'pain': 1.5,
    'suffer': 2
  };
  
  // Base score
  let score = 5; // Start at neutral (5/10)
  
  // Check for trigger words
  Object.keys(triggerWords).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowerText.match(regex);
    if (matches) {
      score += matches.length * triggerWords[word] * 0.5;
    }
  });
  
  // Check for ALL CAPS (shouting)
  const words = text.split(/\s+/);
  const capsWordCount = words.filter(word => 
    word.length > 2 && word === word.toUpperCase()
  ).length;
  
  if (capsWordCount > 0) {
    score += capsWordCount * 0.5;
  }
  
  // Check for excessive punctuation
  const excessivePunctuation = (text.match(/!{2,}|\?{2,}|!+\?+|\?+!+/g) || []).length;
  score += excessivePunctuation * 0.3;
  
  // Cap the score at 10
  return Math.min(Math.max(score, 0), 10).toFixed(1);
};

// Detoxify text by replacing profanities
export const detoxifyText = (text, profanityList, replacements) => {
  if (!text) return text;
  
  let detoxifiedText = text;
  
  profanityList.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const replacement = replacements[word] || '*'.repeat(word.length);
    detoxifiedText = detoxifiedText.replace(regex, replacement);
  });
  
  return detoxifiedText;
};

// Calculate reduction in emotional charge
export const calculateChargeReduction = (originalCharge, detoxifiedCharge) => {
  return ((originalCharge - detoxifiedCharge) / originalCharge * 100).toFixed(1);
};

// Export a sample profanity list
export const defaultProfanityList = [
  "fuck", "shit", "damn", "bitch", "ass", "hell", "bastard", 
  "crap", "piss", "dick", "pussy", "asshole", "fag", "bullshit"
];

// Export default replacements
export const defaultReplacements = {
  "fuck": "darn",
  "shit": "poop",
  "damn": "dang",
  "bitch": "jerk",
  "ass": "butt",
  "hell": "heck",
  "bastard": "jerk",
  "crap": "crud",
  "piss": "pee",
  "dick": "jerk",
  "pussy": "wimp",
  "asshole": "jerk",
  "fag": "person",
  "bullshit": "nonsense"
};
