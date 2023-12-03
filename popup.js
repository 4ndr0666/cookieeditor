// popup.js - Merged and Enhanced for 'cookieeditor' project

/**
 * Function to update the "leftCredits" cookie to 3 for the .vanceai.com domain.
 */
function updateLeftCreditsCookie() {
    const targetDomain = '.vanceai.com';

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tab = tabs[0];
        const url = tab.url;

        if (url.includes(targetDomain)) {
            chrome.cookies.get({ url, name: 'leftCredits', domain: targetDomain }, function (cookie) {
                if (cookie) {
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

/**
 * Function to send a message to the service worker to protect the 'leftCredits' cookie.
 */
function protectLeftCreditsCookie() {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'PROTECT_COOKIE',
            cookieName: 'leftCredits'
        });
        console.log('Protection request sent for leftCredits cookie.');
    } else {
        console.error('Service Worker not available.');
    }
}

/**
 * Attach event listeners to buttons on DOMContentLoaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    const editCookieButton = document.getElementById('editCookieButton');
    const protectCookieButton = document.getElementById('protectCookieButton');

    editCookieButton.addEventListener('click', updateLeftCreditsCookie);
    protectCookieButton.addEventListener('click', protectLeftCreditsCookie);
});

// Export functions for modularity
export { updateLeftCreditsCookie, protectLeftCreditsCookie };
