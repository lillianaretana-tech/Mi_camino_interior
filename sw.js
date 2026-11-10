// Mi Camino Interior - instalación PWA limpia (v2)
const CACHE_NAME = 'mi-camino-interior-pwa-v2';
const HOME = new URL('./index.html', self.registration.scope).href;
self.addEventListener('install', event => {
  // No bloquear la instalación por fallos al descargar iconos o recursos.
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('mi-camino-interior-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || event.request.mode !== 'navigate') return;
  if (new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(event.request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(HOME, response.clone());
      }
      return response;
    } catch (error) {
      return (await caches.match(HOME)) || Response.error();
    }
  })());
});
