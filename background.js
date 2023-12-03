// background.js - Revised for 'cookieeditor' project with primary focus on "leftCredits" cookie

// Function to update the "leftCredits" cookie to 3 for the .vanceai.com domain
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

// Attach the updateLeftCreditsCookie function to the button click event
document.addEventListener('DOMContentLoaded', function () {
    const editCookieButton = document.getElementById('editCookieButton');
    editCookieButton.addEventListener('click', updateLeftCreditsCookie);
});

// Secondary functionality: Monitor and protect cookies
const protectCookies = (() => {
    // Map to store original cookie values
    let originalCookies = new Map();

    // Function to hash cookie data
    const hashCookie = (cookie) => {
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256');
        hash.update(JSON.stringify(cookie));
        return hash.digest('hex');
    };

    // Function to revert cookie to original state
    const revertCookie = (cookieName, originalValue) => {
        chrome.cookies.set({ name: cookieName, value: originalValue }, () => {
            if (chrome.runtime.lastError) {
                console.error(`Error reverting cookie ${cookieName}: ${chrome.runtime.lastError.message}`);
            }
        });
    };

    // Function to check for unauthorized changes
    const isUnauthorizedChange = (cookie) => {
        const originalHash = originalCookies.get(cookie.name);
        return hashCookie(cookie) !== originalHash;
    };

    // Function to update original cookie state
    const updateOriginalCookie = (cookie) => {
        originalCookies.set(cookie.name, hashCookie(cookie));
    };

    // Listen for cookie changes
    chrome.cookies.onChanged.addListener((changeInfo) => {
        const { cookie, removed } = changeInfo;

        if (!removed && isUnauthorizedChange(cookie)) {
            const originalValue = JSON.parse(atob(originalCookies.get(cookie.name))).value;
            revertCookie(cookie.name, originalValue);
        } else if (!removed) {
            updateOriginalCookie(cookie);
        }
    });

    // Public API
    return {
        updateOriginalCookie,
    };
})();

// Initialize cookie protection for existing cookies
chrome.cookies.getAll({}, (cookies) => {
    cookies.forEach(cookie => {
        protectCookies.updateOriginalCookie(cookie);
    });
});
