const cacheName = 'pwa-display-test-v5';
const contentToCache = [
  '/pwa-standalone-example/',
  '/pwa-standalone-example/index.html',
  '/pwa-standalone-example/styles/normalize.css',
  '/pwa-standalone-example/styles/main.css',
  '/pwa-standalone-example/main.js',
  '/pwa-standalone-example/images/icons/baseline-get_app-24px.svg',
  '/pwa-standalone-example/images/icons/baseline-help-24px.svg',
];

// Install the Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(contentToCache);
  })());
});

// Fetch content using the Service Worker
self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const r = await caches.match(e.request);
    if (r) return r;
    const response = await fetch(e.request);
    const cache = await caches.open(cacheName);
    cache.put(e.request, response.clone());
    return response;
  })());
});

// Clear the cache
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === cacheName) { return; }
      return caches.delete(key);
    }))
  }));
});