var cacheName = 'jokes-pwa';
var filesToCache = [
    '/1d1j/',
    '/1d1j/index.html',
    '/1d1j/css/style.css',
    '/1d1j/js/index.js',
    '/1d1j/images/*'
];
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});
/* Serve cached content when offline */
self.addEventListener('fetch', function (e) {
    e.respondWith(caches.match(e.request).then(function (response) {
        return response || fetch(e.request);
    })
    );
});