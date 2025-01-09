const CACHE_NAME = 'weather-app-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/headJS.js',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

// Instalacja Service Workera
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching app shell...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Opdalenie Service Workera
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

// Obsługa fetch (zapytania sieciowe)
self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Zwróć odpowiedź z cache lub wykonaj żądanie sieciowe
            return response || fetch(event.request).then((fetchResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    // Buforuj nową odpowiedź
                    if (event.request.method === 'GET') {
                        cache.put(event.request, fetchResponse.clone());
                    }
                    return fetchResponse;
                });
            });
        }).catch(() => {
            // Fallback dla trybu offline
            if (event.request.mode === 'navigate') {
                return caches.match('/index.html');
            }
        })
    );
});
