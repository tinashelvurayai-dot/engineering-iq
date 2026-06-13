// Service Worker for offline support
const CACHE_NAME = "ia-v2";
const OFFLINE_URL = "/index.html";

// Files to cache immediately on install
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/icon-192.png",
  "/icon-512.png",
];

self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching precache URLs");
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // HTML pages: Network first, fall back to cache
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            // Cache successful responses
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Network failed, check cache
          return caches.match(request).then((cached) => {
            if (cached) {
              return cached;
            }
            // If not in cache, return offline placeholder
            return caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // Assets (JS, CSS, images): Cache first, network fallback
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return (
          cached ||
          fetch(request).then((response) => {
            if (response.status === 200) {
              caches.open(CACHE_NAME).then((c) => c.put(request, response.clone()));
            }
            return response;
          })
        );
      })
    );
    return;
  }

  // API calls: Network first, timeout fallback
  if (url.pathname.startsWith("/functions/") || url.pathname.startsWith("/rest/")) {
    event.respondWith(
      Promise.race([
        fetch(request),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000)),
      ]).catch(() => {
        // API unavailable offline
        return new Response(JSON.stringify({ offline: true }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        });
      })
    );
    return;
  }

  // Default: Network first
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});
