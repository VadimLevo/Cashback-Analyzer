const CACHE_NAME = 'cashback-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Установка: кэшируем основные файлы
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Перехват запросов: сначала сеть, потом кэш (Network-First)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Если интернет есть, сохраняем свежую копию в кэш
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Если интернета нет, отдаем из кэша
        return caches.match(event.request);
      })
  );
});
