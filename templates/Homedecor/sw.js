/* Maison Decor — service worker
   Precaches the app shell; serves pages network-first (so updates show)
   and assets/fonts cache-first (so the site is fast and works offline). */
var VERSION = "maison-v2";
var CORE = [
    "index.html", "products.html", "product.html", "services.html",
    "gallery.html", "about.html", "contact.html", "booking.html", "404.html",
    "css/styles.css", "css/themes.css", "css/fonts.css",
    "js/main.js", "js/products.js",
    "assets/img/favicon.svg", "manifest.webmanifest"
];

self.addEventListener("install", function (e) {
    self.skipWaiting();
    e.waitUntil(caches.open(VERSION).then(function (c) {
        // Don't fail the whole install if one optional file 404s.
        return Promise.all(CORE.map(function (url) {
            return c.add(url).catch(function () {});
        }));
    }));
});

self.addEventListener("activate", function (e) {
    e.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (k) {
                if (k !== VERSION) return caches.delete(k);
            }));
        }).then(function () { return self.clients.claim(); })
    );
});

self.addEventListener("fetch", function (e) {
    var req = e.request;
    if (req.method !== "GET") return;

    var isPage = req.mode === "navigate" ||
        (req.headers.get("accept") || "").indexOf("text/html") !== -1;

    if (isPage) {
        // Network-first for HTML so content stays fresh; fall back to cache/offline.
        e.respondWith(
            fetch(req).then(function (res) {
                var copy = res.clone();
                caches.open(VERSION).then(function (c) { c.put(req, copy); });
                return res;
            }).catch(function () {
                return caches.match(req).then(function (m) {
                    return m || caches.match("index.html");
                });
            })
        );
        return;
    }

    // Cache-first for everything else (CSS, JS, images, fonts, icons).
    e.respondWith(
        caches.match(req).then(function (cached) {
            return cached || fetch(req).then(function (res) {
                var copy = res.clone();
                caches.open(VERSION).then(function (c) { c.put(req, copy); });
                return res;
            }).catch(function () { return cached; });
        })
    );
});
