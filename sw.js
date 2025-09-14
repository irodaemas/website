/* Roda Emas Indonesia – Service Worker (subfolder-friendly) */
const CACHE_NAME = 'rodaemas-v6';
const FONT_CACHE = 'rodaemas-fonts-v1';

// Base URL (scope) – agar aman saat di subfolder
const BASE = self.registration.scope; // e.g. http://localhost:63342/Roda%20Emas%20Indonesia/

// Core assets gunakan path relatif terhadap scope
const CORE_ASSETS = [
    './',
    './index.html',
    './404.html',
    './manifest.webmanifest',
    './assets/css/styles.css',
    './assets/js/main.js',
    './assets/img/logo.webp?v=1',
    './assets/img/asset1.webp',
    './assets/img/wm.webp',
    './offline.html'
];

// ===== Install: precache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(CORE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// ===== Activate: cleanup lama
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((k) => (k !== CACHE_NAME && k !== FONT_CACHE ? caches.delete(k) : Promise.resolve()))
            )
        ).then(() => self.clients.claim())
    );
});

// ===== Helpers
async function handleNavigate(request) {
    // Network-first untuk HTML (navigate)
    try {
        const fresh = await fetch(request);
        // Jika server mengembalikan 404, tampilkan 404.html dari cache (lebih cepat & konsisten)
        if (fresh && fresh.status === 404) {
            const cache = await caches.open(CACHE_NAME);
            const notFound = await cache.match('./404.html');
            if (notFound) {
                const body = await notFound.blob();
                return new Response(body, { status: 404, statusText: 'Not Found', headers: { 'Content-Type': 'text/html; charset=utf-8' } });
            }
            return fresh;
        }
        // Cache halaman yang valid untuk navigasi cepat berikutnya
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, fresh.clone());
        return fresh;
    } catch (e) {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match('./index.html');
        const offline = await cache.match('./offline.html');
        return offline || cached || new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html' } });
    }
}

async function handleAsset(request) {
    // Stale-while-revalidate untuk aset same-origin
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    const fetchPromise = fetch(request).then((netRes) => {
        cache.put(request, netRes.clone());
        return netRes;
    }).catch(() => null);
    return cached || fetchPromise;
}

async function handleFonts(request) {
    // Runtime cache untuk Google Fonts
    const cache = await caches.open(FONT_CACHE);
    const cached = await cache.match(request);
    const fetchPromise = fetch(request, { mode: 'cors' }).then((res) => {
        cache.put(request, res.clone());
        return res;
    }).catch(() => null);
    return cached || fetchPromise;
}

// ===== Fetch
self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);

    if (req.method !== 'GET') return;

    // Fonts: googleapis/gstatic
    if (/fonts\.g(oogleapis|static)\.com$/.test(url.hostname)) {
        event.respondWith(handleFonts(req));
        return;
    }

    // Same-origin: gunakan strategi berbeda untuk navigasi vs aset
    if (url.origin === location.origin) {
        if (req.mode === 'navigate' || req.destination === 'document') {
            event.respondWith(handleNavigate(req));
            return;
        }
        event.respondWith(handleAsset(req));
    }
});

// ===== Background Sync untuk klik WA
self.addEventListener('sync', (event) => {
    if (!event.tag || !event.tag.startsWith('wa-click:')) return;
    event.waitUntil((async () => {
        try {
            const parts = event.tag.split(':'); // ['wa-click', 'label', 'ts']
            const label = parts[1] || 'wa';
            await fetch(`./track?e=wa&label=${encodeURIComponent(label)}&t=${Date.now()}`, {
                method: 'GET',
                credentials: 'omit'
            });
        } catch (_) {}
    })());
});
