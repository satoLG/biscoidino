// Service Worker for Biscoidino PWA
const CACHE_NAME = 'biscoidino-v1.0.0';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/biscoidino_logo.png',
  '/biscoidino.gif'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static resources');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then((response) => {
            // Don't cache responses that aren't successful
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
      .catch(() => {
        // If both cache and network fail, return a basic offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return new Response(
            `<!DOCTYPE html>
            <html lang="pt-BR">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Biscoidino - Offline</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  text-align: center; 
                  padding: 2rem; 
                  background: #FFF8DC;
                  color: #2F2F2F;
                  margin: 0;
                }
                .offline-container {
                  max-width: 400px;
                  margin: 0 auto;
                  padding: 2rem;
                }
                .logo {
                  width: 80px;
                  height: 80px;
                  margin: 0 auto 1rem;
                  background: #ffb6bf;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 2rem;
                }
                h1 { 
                  color: #ffb6bf; 
                  margin-bottom: 1rem; 
                  font-size: 2rem;
                }
                p { 
                  margin-bottom: 1.5rem; 
                  line-height: 1.5; 
                  font-size: 1.1rem;
                }
                button {
                  background: #ffb6bf;
                  color: white;
                  border: none;
                  padding: 0.75rem 1.5rem;
                  border-radius: 8px;
                  font-size: 1rem;
                  cursor: pointer;
                  transition: background-color 0.3s ease;
                }
                button:hover {
                  background: #d68891;
                }
              </style>
            </head>
            <body>
              <div class="offline-container">
                <div class="logo">🍪</div>
                <h1>Biscoidino</h1>
                <p>Você está offline, mas o app está instalado e funcionando!</p>
                <p>Verifique sua conexão e tente novamente.</p>
                <button onclick="window.location.reload()">Tentar Novamente</button>
              </div>
            </body>
            </html>`,
            {
              headers: {
                'Content-Type': 'text/html; charset=utf-8'
              }
            }
          );
        }
      })
  );
});

// Handle background sync and push notifications (for future use)
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
});

self.addEventListener('push', (event) => {
  console.log('🔔 Push notification received:', event.data?.text());
});