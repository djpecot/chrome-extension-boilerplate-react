console.log('This is the background page.');
console.log('Put the background scripts here.');

// Listen for messages in the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'searchHistory') {
        chrome.history.search({ text: request.searchText, maxResults: 10 }, (results) => {
            // Send the results back to the sender or handle them as needed
            sendResponse(results);
        });
        return true; // Return true to indicate you wish to send a response asynchronously
    }
});