const CACHE = 'metres-v5';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(async c => {
      const cached = await c.match(e.request);
      const fresh = fetch(e.request).then(r => {
        if (r && r.status === 200 && r.type === 'basic') c.put(e.request, r.clone());
        return r;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
