/* Simple offline cache for the portfolio. Bump CACHE to invalidate. */
var CACHE = "hp-site-v1";
var CORE = [
    "/",
    "/css/bootstrap.min.css",
    "/css/all.css",
    "/css/Custom.css",
    "/js/bootstrap.min.js",
    "/assets/js/main.js",
    "/assets/img/avatar.jpg",
    "/assets/img/icon.svg",
    "/manifest.webmanifest"
];

self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open(CACHE)
            .then(function (c) { return c.addAll(CORE); })
            .then(function () { return self.skipWaiting(); })
    );
});

self.addEventListener("activate", function (e) {
    e.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (k) {
                if (k !== CACHE) return caches.delete(k);
            }));
        }).then(function () { return self.clients.claim(); })
    );
});

self.addEventListener("fetch", function (e) {
    var req = e.request;
    if (req.method !== "GET") return;

    var url = new URL(req.url);
    // Let cross-origin requests (GitHub API, fonts, Web3Forms, analytics) hit the network directly.
    if (url.origin !== self.location.origin) return;

    // Network-first for page navigations so content stays fresh; fall back to cache offline.
    if (req.mode === "navigate") {
        e.respondWith(
            fetch(req).then(function (res) {
                var copy = res.clone();
                caches.open(CACHE).then(function (c) { c.put("/", copy); });
                return res;
            }).catch(function () { return caches.match("/"); })
        );
        return;
    }

    // Cache-first for static assets.
    e.respondWith(
        caches.match(req).then(function (cached) {
            return cached || fetch(req).then(function (res) {
                if (res && res.ok && res.type === "basic") {
                    var copy = res.clone();
                    caches.open(CACHE).then(function (c) { c.put(req, copy); });
                }
                return res;
            });
        })
    );
});
