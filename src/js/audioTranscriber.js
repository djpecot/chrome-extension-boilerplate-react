const insertTextIntoComposer = (text) => {
  const composerDiv = document.querySelector('#prompt-textarea');
  if (composerDiv) {
    // Set the text content
    composerDiv.textContent = text;
    
    // Simulate Enter key press
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      bubbles: true
    });
    composerDiv.dispatchEvent(enterEvent);
  }
};

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'insertText') {
    insertTextIntoComposer(request.text);
    sendResponse({success: true});
  }
});