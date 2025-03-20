// Improved content script with pastel highlight styling
console.log("Profanity Filter content script loaded - updated highlight styling");

// Basic state management
let profanityList = ["fuck", "shit", "damn", "ass", "hell", "bitch", "ive"]; // Default list
let replacements = {
  "fuck": "darn",
  "shit": "poop",
  "damn": "dang",
  "ass": "butt",
  "hell": "heck",
  "bitch": "jerk",
  "ive": "I've"
}; // Default replacements
let activePopup = null;
let processedTextNodes = new WeakSet();

// Add CSS styles with pastel highlights matching the provided images
function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Highlight styles matching the provided images */
    .profanity-highlight {
      background-color: #72e072; /* Light green highlight */
      border-radius: 0;
      padding: 0;
      color: inherit;
      cursor: pointer;
      display: inline;
    }
    
    /* Alternative color options based on the images */
    .profanity-highlight-purple {
      background-color: #d8b5ff; /* Light purple highlight */
    }
    
    .profanity-highlight-blue {
      background-color: #b5d9ff; /* Light blue highlight */
    }
    
    .profanity-popup {
      position: absolute;
      background: white;
      color: #333;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      font-size: 14px;
      width: 320px;
      z-index: 9999999;
      overflow: hidden;
      animation: popup-fade-in 0.2s ease-out;
    }
    
    @keyframes popup-fade-in {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .profanity-popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .profanity-popup-title {
      display: flex;
      align-items: center;
      font-size: 13px;
      font-weight: 500;
      color: #5a5a5a;
    }
    
    .profanity-popup-title::before {
      content: '';
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-right: 8px;
      background-color: #dd2e44;
      border-radius: 50%;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3E%3Cpath d='M6.5,1 L9.5,1 L13,4.5 L13,9.5 L9.5,13 L4.5,13 L1,9.5 L1,4.5 L4.5,1 L6.5,1 Z'/%3E%3C/svg%3E");
      background-size: 12px;
      background-position: center;
      background-repeat: no-repeat;
    }
    
    .profanity-popup-content {
      padding: 12px 16px;
      font-size: 14px;
    }
    
    .profanity-popup-actions {
      display: flex;
      padding: 8px 16px 16px;
    }
    
    .profanity-popup-actions button {
      padding: 6px 16px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .profanity-accept-btn {
      background-color: #4285f4;
      color: white;
      border: none;
      margin-right: 8px;
    }
    
    .profanity-accept-btn:hover {
      background-color: #3b78e7;
    }
    
    .profanity-dismiss-btn {
      background-color: transparent;
      color: #5f6368;
      border: none;
    }
    
    .profanity-dismiss-btn:hover {
      background-color: #f1f3f4;
    }
    
    .profanity-popup-controls {
      display: flex;
      padding: 0 16px 16px;
      justify-content: space-between;
    }
    
    .profanity-popup-close {
      cursor: pointer;
      color: #5f6368;
      font-size: 16px;
    }
    
    .profanity-popup-nav {
      display: flex;
      align-items: center;
    }
    
    .profanity-popup-nav button {
      background: none;
      border: none;
      color: #5f6368;
      cursor: pointer;
      font-size: 18px;
      padding: 4px;
      margin: 0 4px;
    }
    
    .profanity-text-correction {
      margin: 8px 0;
      font-size: 14px;
    }
    
    .profanity-text-correction .incorrect {
      text-decoration: line-through;
      color: #d93025;
      margin-right: 4px;
    }
    
    .profanity-text-correction .correct {
      color: #1a73e8;
      font-weight: 500;
    }
  `;
  
  document.head.appendChild(style);
}

// Process the document to find and highlight profanity
function processDocument() {
  try {
    // Create the regex pattern once
    const pattern = new RegExp('\\b(' + profanityList.join('|') + ')\\b', 'gi');
    
    // Walk through the document to find text nodes
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Skip nodes we've processed already
          if (processedTextNodes.has(node)) {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Skip empty nodes and nodes in scripts, styles, etc.
          if (!node.textContent.trim() || 
              !node.parentElement || 
              ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OPTION'].includes(node.parentElement.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Skip nodes that are already in a highlighted span
          if (node.parentElement.classList && 
              node.parentElement.classList.contains('profanity-highlight')) {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Check if the text contains any profanity
          return pattern.test(node.textContent) ? 
            NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );
    
    // Process nodes in batches to avoid freezing
    const processNodes = (batchSize = 10, maxTime = 50) => {
      const startTime = performance.now();
      let nodeCount = 0;
      let node;
      
      while ((node = walker.nextNode()) && 
             nodeCount < batchSize && 
             performance.now() - startTime < maxTime) {
        
        // Mark this node as processed so we don't process it again
        processedTextNodes.add(node);
        
        // Process this node
        processTextNode(node, pattern);
        nodeCount++;
      }
      
      // If there are more nodes, process them after a small delay
      if (node) {
        setTimeout(() => processNodes(batchSize, maxTime), 0);
      }
    };
    
    // Start processing
    processNodes();
    
  } catch (error) {
    console.error('Error in profanity filter:', error);
  }
}

// Process a single text node to highlight profanity
function processTextNode(textNode, pattern) {
  const text = textNode.textContent;
  const parent = textNode.parentElement;
  
  // Reset the regex (important!)
  pattern.lastIndex = 0;
  
  // Find all matches
  let match;
  const matches = [];
  while ((match = pattern.exec(text)) !== null) {
    matches.push({
      word: match[0],
      index: match.index
    });
  }
  
  // If no matches, skip
  if (matches.length === 0) return;
  
  // Replace the text node with highlighted spans
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  
  // Define highlight colors to rotate through
  const highlightColors = ['profanity-highlight', 'profanity-highlight-purple', 'profanity-highlight-blue'];
  let colorIndex = 0;
  
  matches.forEach(match => {
    // Add text before the match
    if (match.index > lastIndex) {
      fragment.appendChild(
        document.createTextNode(text.substring(lastIndex, match.index))
      );
    }
    
    // Create a highlighted span for the match
    const span = document.createElement('span');
    span.textContent = match.word;
    
    // Rotate through highlight colors
    span.className = highlightColors[colorIndex];
    colorIndex = (colorIndex + 1) % highlightColors.length;
    
    // Store the original word and the correct version
    span.dataset.original = match.word;
    span.dataset.correction = replacements[match.word.toLowerCase()] || '****';
    
    // Add click handler
    span.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      showPopup(event, span);
    });
    
    fragment.appendChild(span);
    lastIndex = match.index + match.word.length;
  });
  
  // Add remaining text after the last match
  if (lastIndex < text.length) {
    fragment.appendChild(
      document.createTextNode(text.substring(lastIndex))
    );
  }
  
  // Replace the original text node with our fragment
  try {
    parent.replaceChild(fragment, textNode);
  } catch (error) {
    console.error('Error replacing text node:', error);
  }
}

// Show a popup when a highlighted word is clicked
function showPopup(event, element) {
  // Remove any existing popup
  if (activePopup) {
    activePopup.remove();
    activePopup = null;
  }
  
  // Get the correction data
  const original = element.dataset.original;
  const correction = element.dataset.correction;
  
  // Create the popup
  const popup = document.createElement('div');
  popup.className = 'profanity-popup';
  
  // Calculate position above the highlighted text
  const rect = element.getBoundingClientRect();
  
  // Position popup above the element with enough space
  // The popup will be positioned relative to the viewport initially
  popup.style.position = 'fixed';
  popup.style.left = `${rect.left}px`;
  
  // Set the popup height (we'll use this to position it above the text)
  const popupHeight = 170; // Approximate height based on content
  
  // Position above the text with a 10px gap
  popup.style.top = `${rect.top - popupHeight - 10}px`;
  
  // Add content to match the image
  popup.innerHTML = `
    <div class="profanity-popup-header">
      <div class="profanity-popup-title">Correctness · Correct your spelling</div>
      <div class="profanity-popup-close">×</div>
    </div>
    <div class="profanity-popup-content">
      <div class="profanity-text-correction">
        For years <span class="incorrect">${original}</span><span class="correct">${correction}</span> driven an old...
      </div>
    </div>
    <div class="profanity-popup-actions">
      <button class="profanity-accept-btn">Accept</button>
      <button class="profanity-dismiss-btn">Dismiss</button>
    </div>
    <div class="profanity-popup-controls">
      <div></div>
      <div class="profanity-popup-nav">
        <button class="profanity-prev">◀</button>
        <button class="profanity-next">▶</button>
      </div>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(popup);
  activePopup = popup;
  
  // Add event listeners
  popup.querySelector('.profanity-accept-btn').addEventListener('click', () => {
    element.textContent = correction;
    element.classList.remove(element.className);
    popup.remove();
    activePopup = null;
  });
  
  popup.querySelector('.profanity-dismiss-btn').addEventListener('click', () => {
    popup.remove();
    activePopup = null;
  });
  
  popup.querySelector('.profanity-popup-close').addEventListener('click', () => {
    popup.remove();
    activePopup = null;
  });
  
  // Close when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function closePopup(e) {
      if (!popup.contains(e.target) && e.target !== element) {
        popup.remove();
        activePopup = null;
        document.removeEventListener('click', closePopup);
      }
    });
  }, 0);
  
  // Adjust position if popup goes off-screen
  setTimeout(() => {
    const popupRect = popup.getBoundingClientRect();
    
    // Check if popup goes off the top of the viewport
    if (popupRect.top < 10) {
      // Position below the element instead
      popup.style.top = `${rect.bottom + 10}px`;
    }
    
    // Check if popup goes off the left or right edge
    if (popupRect.left < 10) {
      popup.style.left = "10px";
    } else if (popupRect.right > window.innerWidth - 10) {
      popup.style.left = `${window.innerWidth - popupRect.width - 10}px`;
    }
    
    // Now that we've shown the popup in the viewport, convert its position to absolute
    // This will make it stay in place when scrolling
    const absoluteTop = popupRect.top + window.scrollY;
    const absoluteLeft = popupRect.left + window.scrollX;
    
    popup.style.position = 'absolute';
    popup.style.top = `${absoluteTop}px`;
    popup.style.left = `${absoluteLeft}px`;
  }, 0);
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'highlight') {
    // Update profanity list and replacements if provided
    if (message.profanityList && message.profanityList.length > 0) {
      profanityList = message.profanityList;
    }
    
    if (message.replacements) {
      replacements = message.replacements;
    }
    
    // Process the document
    processDocument();
    sendResponse({ success: true });
    return true;
  }
  
  if (message.action === 'removeHighlights') {
    // This would need an implementation
    sendResponse({ success: true });
    return true;
  }
  
  // Default response
  sendResponse({ success: false, error: 'Unknown action' });
  return true;
});

// Add styles and start processing
addStyles();
processDocument();

// Monitor for dynamic content
const observer = new MutationObserver((mutations) => {
  let shouldProcess = false;
  
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      shouldProcess = true;
      break;
    }
  }
  
  if (shouldProcess) {
    // Use debouncing to avoid excessive processing
    clearTimeout(window._profanityProcessTimeout);
    window._profanityProcessTimeout = setTimeout(() => {
      processDocument();
    }, 1000);
  }
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log("Profanity filter initialization complete");
