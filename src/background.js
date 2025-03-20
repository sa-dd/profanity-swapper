// Stable background script
console.log("Stable Profanity Filter background script loaded");

// Extension state
let isActive = true;
let profanityList = ["fuck", "shit", "damn", "ass", "hell", "bitch"];
let replacements = {
  "fuck": "darn",
  "shit": "poop",
  "damn": "dang",
  "ass": "butt",
  "hell": "heck",
  "bitch": "jerk"
};

// Cache of processed tabs to avoid redundant operations
const processedTabs = new Set();
const messageQueue = new Map();

// Load saved state
chrome.storage.local.get(['profanityFilter_isActive', 'profanityFilter_list', 'profanityFilter_replacements'], (result) => {
  if (result.profanityFilter_isActive !== undefined) {
    isActive = result.profanityFilter_isActive;
  }
  
  if (result.profanityFilter_list) {
    profanityList = result.profanityFilter_list;
  }
  
  if (result.profanityFilter_replacements) {
    replacements = result.profanityFilter_replacements;
  }
  
  console.log("Loaded settings, active:", isActive);
});

// Save settings
function saveSettings() {
  chrome.storage.local.set({
    'profanityFilter_isActive': isActive,
    'profanityFilter_list': profanityList,
    'profanityFilter_replacements': replacements
  });
}

// Handle messages with debouncing
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    // Handle getState request
    if (message.action === 'getState') {
      sendResponse({
        isActive: isActive,
        profanityList: profanityList,
        replacements: replacements
      });
      return true;
    }
    
    // Handle toggleActive request
    if (message.action === 'toggleActive') {
      isActive = message.isActive;
      saveSettings();
      
      // Only update tabs when actually changing state
      updateTabs(isActive);
      
      sendResponse({ success: true });
      return true;
    }
    
    // Handle updateWords request
    if (message.action === 'updateWords') {
      if (message.profanityList) {
        profanityList = message.profanityList;
      }
      
      if (message.replacements) {
        replacements = message.replacements;
      }
      
      saveSettings();
      
      if (isActive) {
        updateTabs(true);
      }
      
      sendResponse({ success: true });
      return true;
    }
  } catch (e) {
    console.error("Error handling message:", e);
    sendResponse({ success: false, error: e.message });
  }
  
  return false;
});

// Debounced function to update tabs
const updateTabs = (() => {
  let timeout = null;
  
  return (shouldHighlight) => {
    // Clear any pending update
    if (timeout) {
      clearTimeout(timeout);
    }
    
    // Schedule new update
    timeout = setTimeout(() => {
      timeout = null;
      
      // Get all tabs
      chrome.tabs.query({ url: ["http://*/*", "https://*/*"] }, (tabs) => {
        tabs.forEach(tab => {
          sendMessageToTab(tab.id, {
            action: shouldHighlight ? 'highlight' : 'removeHighlights',
            profanityList: profanityList,
            replacements: replacements
          });
        });
      });
    }, 300);
  };
})();

// Send message to tab with retry and queueing
function sendMessageToTab(tabId, message) {
  // Skip if tab is known to be closed/invalid
  if (!tabId) return;
  
  // Add to queue if there's already a pending message for this tab
  if (messageQueue.has(tabId)) {
    messageQueue.get(tabId).push(message);
    return;
  }
  
  // Create new queue
  messageQueue.set(tabId, []);
  
  // Send message
  sendMessageWithRetry(tabId, message, 0);
}

// Send message with retry
function sendMessageWithRetry(tabId, message, retryCount) {
  const MAX_RETRIES = 2;
  
  chrome.tabs.sendMessage(tabId, message, (response) => {
    const lastError = chrome.runtime.lastError;
    
    if (lastError) {
      console.log(`Error sending message to tab ${tabId}:`, lastError.message);
      
      if (retryCount < MAX_RETRIES) {
        // Content script might not be loaded, inject it
        injectContentScript(tabId, () => {
          // Retry after injection
          setTimeout(() => {
            sendMessageWithRetry(tabId, message, retryCount + 1);
          }, 200);
        });
      } else {
        // Max retries reached, process next message
        processNextMessage(tabId);
      }
    } else {
      // Message sent successfully
      processNextMessage(tabId);
    }
  });
}

// Process next message in queue
function processNextMessage(tabId) {
  // Get queue
  const queue = messageQueue.get(tabId);
  
  if (queue && queue.length > 0) {
    // Send next message
    const nextMessage = queue.shift();
    sendMessageWithRetry(tabId, nextMessage, 0);
  } else {
    // Queue empty, remove it
    messageQueue.delete(tabId);
  }
}

// Inject content script
function injectContentScript(tabId, callback) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['contentScript.js']
  })
  .then(() => {
    processedTabs.add(tabId);
    if (callback) callback();
  })
  .catch(err => {
    console.error("Error injecting content script:", err);
    if (callback) callback();
  });
}

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only process tabs that have completed loading and are http/https
  if (changeInfo.status === 'complete' && tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
    // Skip if not active
    if (!isActive) return;
    
    // Add reasonable delay to ensure page is fully loaded
    setTimeout(() => {
      sendMessageToTab(tabId, {
        action: 'highlight',
        profanityList: profanityList,
        replacements: replacements
      });
    }, 1000);
  }
});

// Handle tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  // Clean up cache
  processedTabs.delete(tabId);
  messageQueue.delete(tabId);
});

console.log("Stable background script initialized");
