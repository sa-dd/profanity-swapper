// chromeApiUtils.js
// Utility functions for interacting with Chrome extension APIs

// Check if we're in a Chrome extension environment
export const isExtensionEnvironment = () => {
  return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
};

// Get the current tab
export const getCurrentTab = async () => {
  if (!isExtensionEnvironment()) {
    console.error('Not in a Chrome extension environment');
    return null;
  }
  
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
  } catch (error) {
    console.error('Error getting current tab:', error);
    return null;
  }
};

// Send a message to a tab
export const sendMessageToTab = async (tabId, message) => {
  if (!isExtensionEnvironment()) {
    console.error('Not in a Chrome extension environment');
    return null;
  }
  
  try {
    return await chrome.tabs.sendMessage(tabId, message);
  } catch (error) {
    console.error(`Error sending message to tab ${tabId}:`, error);
    return null;
  }
};

// Send a message to the background script
export const sendMessageToBackground = async (message) => {
  if (!isExtensionEnvironment()) {
    console.error('Not in a Chrome extension environment');
    return null;
  }
  
  try {
    return await chrome.runtime.sendMessage(message);
  } catch (error) {
    console.error('Error sending message to background script:', error);
    return null;
  }
};

// Get extension state from storage
export const getExtensionState = async () => {
  if (!isExtensionEnvironment()) {
    console.error('Not in a Chrome extension environment');
    return null;
  }
  
  try {
    const result = await chrome.storage.local.get('profanityFilterState');
    return result.profanityFilterState || null;
  } catch (error) {
    console.error('Error getting extension state:', error);
    return null;
  }
};

// Save extension state to storage
export const saveExtensionState = async (state) => {
  if (!isExtensionEnvironment()) {
    console.error('Not in a Chrome extension environment');
    return false;
  }
  
  try {
    await chrome.storage.local.set({ 'profanityFilterState': state });
    return true;
  } catch (error) {
    console.error('Error saving extension state:', error);
    return false;
  }
};

// Add a listener for messages from content scripts or background
export const addMessageListener = (callback) => {
  if (!isExtensionEnvironment()) {
    console.error('Not in a Chrome extension environment');
    return null;
  }
  
  chrome.runtime.onMessage.addListener(callback);
  
  // Return a function to remove the listener
  return () => chrome.runtime.onMessage.removeListener(callback);
};

// Execute a function in the current tab
export const executeScriptInCurrentTab = async (func, ...args) => {
  if (!isExtensionEnvironment()) {
    console.error('Not in a Chrome extension environment');
    return null;
  }
  
  try {
    const tab = await getCurrentTab();
    if (!tab) return null;
    
    return await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func,
      args
    });
  } catch (error) {
    console.error('Error executing script in current tab:', error);
    return null;
  }
};
