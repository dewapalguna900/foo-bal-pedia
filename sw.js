const CACHE_NAME = "foo-bal-pedia-v1";
let urlsToCache = [
    "/",
    "/index.html",
    "/detail-team.html",
    "/sw.js",
    "/manifest.json",
    "/push.js",
    "/icon_128.png",
    "/icon_192.png",
    "/icon_512.png",
    "/assets/img/default_team_logo.png",
    "/assets/img/default_team_logo.svg",
    "/assets/img/nav_icon.svg",
    "/assets/img/profil.jpg",
    "/src/css/font-awesome/all.css",
    "/src/css/font-awesome/fa-regular-400.ttf",
    "/src/css/font-awesome/fa-regular-400.woff",
    "/src/css/font-awesome/fa-regular-400.woff2",
    "/src/css/font-awesome/fa-solid-900.ttf",
    "/src/css/font-awesome/fa-solid-900.woff",
    "/src/css/font-awesome/fa-solid-900.woff2",
    "/src/css/materialize.min.css",
    "/src/js/idb/index.js",
    "/src/js/idb/wrap-idb-value.js",
    "/src/js/api.js",
    "/src/js/db.js",
    "/src/js/detail_team.js",
    "/src/js/index.js",
    "/src/js/materialize.min.js",
    "/src/js/register_sw.js",
    "/src/pages/competitions.html",
    "/src/pages/contact.html",
    "/src/pages/home.html",
    "/src/pages/nav.html",
    "/src/pages/saved.html",
];

self.addEventListener("install", function (event) {
    console.log("ServiceWorker: Menginstall..");

    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log("ServiceWorker: Membuka cache..");
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function (event) {
    const urlApi = "https://api.football-data.org/v2/";

    if (event.request.url.indexOf(urlApi) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME)
                .then(function (cache) {
                    return fetch(event.request)
                        .then(function (response) {
                            cache.put(event.request.url, response.clone());
                            return response;
                        })
                })
        );
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true })
                .then(function (response) {
                    return response || fetch(event.request, {
                        headers: {
                            'X-Auth-Token': '35794953e6804ca6ac42557550827322'
                        }
                    });
                })
        );
    }
});

self.addEventListener('activate', function (event) {
    console.log('Aktivasi service worker baru');
    event.waitUntil(
        // agar asset disimpan langsung,
        // tanpa user harus refresh halaman terlebih dahulu
        self.clients.claim(),
        // menghapus versi cache selain versi cache yang digunakan saat ini
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE_NAME && cacheName.startsWith("foo-bal-pedia")) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('push', function (event) {
    let body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    const options = {
        body: body,
        icon: 'icon_128.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});