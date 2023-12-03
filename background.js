// Function to update the "leftCredits" cookie to 3 for the .vanceai.com domain
function updateCookie() {
  // Define the target domain
  const targetDomain = '.vanceai.com';

  // Query the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    const url = tab.url;

    // Check if the tab's URL matches the target domain
    if (url.includes(targetDomain)) {
      // Attempt to get the "leftCredits" cookie
      chrome.cookies.get({ url, name: 'leftCredits', domain: targetDomain }, function (cookie) {
        if (cookie) {
          // Update the cookie value to '3'
          chrome.cookies.set({ url, name: 'leftCredits', value: '3', domain: targetDomain }, function (newCookie) {
            if (newCookie) {
              console.log('Cookie updated to 3');
            } else {
              console.error('Failed to update cookie');
            }
          });
        } else {
          console.error('Cookie not found');
        }
      });
    } else {
      console.error('This tab is not on the target domain');
    }
  });
}

// Attach the updateCookie function to the button click event
document.addEventListener('DOMContentLoaded', function () {
  const editCookieButton = document.getElementById('editCookieButton');
  editCookieButton.addEventListener('click', updateCookie);
});
