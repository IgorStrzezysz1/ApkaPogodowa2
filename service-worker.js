const CACHE_NAME = 'weather-app-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/manifest.json',
    '/historyWheater.html',
    '/detailsWheater.html',
    '/detailsWhaeter.js',
    '/searchpage.html',
    '/searchpage.js',
];

// Installing Service Worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching app shell...');
            return Promise.all(ASSETS_TO_CACHE.map((url) => {
                return fetch(url)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Failed to fetch ${url}`);
                        }
                        return cache.put(url, response);
                    })
                    .catch((error) => {
                        console.error('[Service Worker] Failed to cache:', url, error);
                    });
            }));
        })

    );
});

// Activating Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch Event Handler
// Fetch Event Handler in Service Worker
self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetching:', event.request.url);

    // Check if the request is for the weather API
    if (event.request.url.includes('api.openweathermap.org')) {
        event.respondWith(
            fetch(event.request).catch(() => {
                // If network fails, return a custom error response
                return new Response('No internet connection. Please try again later.', {
                    status: 503,
                    statusText: 'Service Unavailable',
                });
            })
        );
    } else {
        // Cache other assets
        event.respondWith(
            caches.match(event.request).then((response) => {
                if (response) {
                    return response; // Return cached version if available
                }

                return fetch(event.request).then((fetchResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        if (fetchResponse.ok) {
                            cache.put(event.request, fetchResponse.clone());
                        }
                        return fetchResponse;
                    });
                });
            }).catch(() => {
                // Fallback to cache for other pages if no network
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
                return new Response('Network error and no cached version available.', {
                    status: 503,
                    statusText: 'Service Unavailable',
                });
            })
        );
    }
});

// Handling Push Notifications
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push received:', event);

    let data = {};
    if (event.data) {
        try {
            // Try parsing the payload as JSON
            data = event.data.json();
        } catch (error) {
            console.warn('[Service Worker] Push data is not JSON:', event.data.text());
            // Use the raw string as the notification body
            data = { body: event.data.text() };
        }
    }

    const title = data.title || 'New Notification';
    const options = {
        body: data.body || 'You have a new message.',
        icon: data.icon || '/default-icon.png',
        badge: data.badge || '/badge-icon.png',
        data: {
            url: data.url || '/',
        },
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Handling Notification Clicks
// self.addEventListener('notificationclick', (event) => {
//     console.log('[Service Worker] Notification click received.');

//     event.notification.close();

//     event.waitUntil(
//         clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
//             if (clientList.length > 0) {
//                 const client = clientList[0];
//                 client.focus();
//                 return client.navigate(event.notification.data.url);
//             }

//             return clients.openWindow(event.notification.data.url);
//         })
//     );
// });
