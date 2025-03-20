// background.js
console.log("Profanity Filter background script loaded");

// Extension state
let extensionState = {
  isActive: false,
  profanityList: ["fuck", "shit", "damn", "bitch", "ass", "hell"],
  replacements: {
    "fuck": "darn",
    "shit": "poop",
    "damn": "dang",
    "bitch": "jerk",
    "ass": "butt",
    "hell": "heck"
  },
  statistics: {
    totalFiltered: 0,
    recentDetections: []
  }
};

// Load saved state
chrome.storage.local.get('profanityFilterState', (result) => {
  if (result.profanityFilterState) {
    extensionState = {...extensionState, ...result.profanityFilterState};
  }
});

// Message handlers
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle getState request
  if (message.action === 'getState') {
    sendResponse(extensionState);
    return true;
  }
  
  // Handle toggleActive request
  if (message.action === 'toggleActive') {
    extensionState.isActive = message.isActive;
    chrome.storage.local.set({ 'profanityFilterState': extensionState });
    sendResponse({ success: true, isActive: extensionState.isActive });
    return true;
  }
  
  // Handle updatePreferences request
  if (message.action === 'updatePreferences') {
    if (message.preferences) {
      extensionState.preferences = {...extensionState.preferences, ...message.preferences};
      chrome.storage.local.set({ 'profanityFilterState': extensionState });
      sendResponse({ success: true });
    }
    return true;
  }
  
  return false;
});