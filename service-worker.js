// service-worker.js - Merged and Completed for 'cookieeditor' project

self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated.');
});

self.addEventListener('fetch', (event) => {
    // Intercept fetch requests and check if they involve cookie modifications
    if (event.request.headers.has('Cookie')) {
        event.respondWith((async () => {
            const originalResponse = await fetch(event.request);
            const responseClone = originalResponse.clone();

            // Analyze cookies in the response
            const cookies = responseClone.headers.get('Set-Cookie');
            if (cookies && cookies.includes('leftCredits')) {
                // Check if 'leftCredits' cookie is being altered
                const protectedValue = '3'; // The value that 'leftCredits' should always have
                const modifiedCookie = cookies.replace(/leftCredits=[^;]+/, `leftCredits=${protectedValue}`);

                // Create a new response with the modified cookie
                const newHeaders = new Headers(responseClone.headers);
                newHeaders.set('Set-Cookie', modifiedCookie);

                return new Response(responseClone.body, {
                    status: responseClone.status,
                    statusText: responseClone.statusText,
                    headers: newHeaders
                });
            }

            return originalResponse;
        })());
    }
});

// Listen for messages from other scripts (e.g., background.js)
self.addEventListener('message', (event) => {
    // Handle incoming messages related to cookie protection
    if (event.data && event.data.type === 'PROTECT_COOKIE') {
        console.log('Received protection request for cookie:', event.data.cookieName);
    }
});

// Service Worker registration code (to be included in the main script, not in the service worker itself)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.error('Service Worker registration failed:', error);
        });
}
