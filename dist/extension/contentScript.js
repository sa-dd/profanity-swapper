// contentScript.js
console.log("Profanity Filter content script loaded");

// Function to get all text nodes
function getAllTextNodes() {
  const textNodes = [];
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  let node;
  while (node = walker.nextNode()) {
    if (node.nodeValue.trim().length > 0) {
      textNodes.push(node);
    }
  }
  
  return textNodes;
}

// Function to filter text
function filterProfanity(text, profanityList, replacements) {
  let filteredText = text;
  
  profanityList.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const replacement = replacements[word] || '*'.repeat(word.length);
    filteredText = filteredText.replace(regex, replacement);
  });
  
  return filteredText;
}

// Process page on load
chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
  if (response && response.isActive) {
    const textNodes = getAllTextNodes();
    let totalFiltered = 0;
    
    textNodes.forEach(node => {
      const original = node.nodeValue;
      const filtered = filterProfanity(original, response.profanityList, response.replacements);
      
      if (original !== filtered) {
        node.nodeValue = filtered;
        totalFiltered++;
      }
    });
    
    if (totalFiltered > 0) {
      chrome.runtime.sendMessage({ 
        action: 'updateStatistics',
        filtered: totalFiltered
      });
    }
  }
});

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'analyze') {
    const textNodes = getAllTextNodes();
    const text = textNodes.map(node => node.nodeValue).join(' ');
    
    sendResponse({
      success: true,
      nodeCount: textNodes.length,
      sample: text.substring(0, 200) + (text.length > 200 ? '...' : '')
    });
    
    return true;
  }
  
  return false;
});