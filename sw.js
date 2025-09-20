/* Sentral Emas – Service Worker (subfolder-friendly) */
const CACHE_NAME = 'sentralemas-v6';
const FONT_CACHE = 'sentralemas-fonts-v1';

// Core assets gunakan path relatif terhadap scope
const CORE_ASSETS = [
    './',
    './index.html',
    './404.html',
    './manifest.webmanifest',
    './assets/css/styles.css',
    './assets/css/fonts.css',
    './assets/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2',
    './assets/fonts/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgA.woff2',
    './assets/js/main.js',
    './assets/img/logo.webp?v=1',
    './assets/img/asset1.webp',
    './assets/img/wm.webp',
    './harga/',
    './harga/index.html',
    './blog/',
    './blog/index.html',
    './blog/keuntungan-jual-emas-cod/',
    './blog/keuntungan-jual-emas-cod/index.html',
    './blog/panduan-menilai-keaslian-emas-sebelum-cod/',
    './blog/panduan-menilai-keaslian-emas-sebelum-cod/index.html',
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
        (async () => {
            if (self.registration.navigationPreload) {
                try { await self.registration.navigationPreload.enable(); } catch (_) {}
            }
            const keys = await caches.keys();
            return Promise.all(
                keys.map((k) => (k !== CACHE_NAME && k !== FONT_CACHE ? caches.delete(k) : Promise.resolve()))
            );
        })().then(() => self.clients.claim())
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
        if (fresh && fresh.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, fresh.clone());
        }
        return fresh;
    } catch (e) {
        const cache = await caches.open(CACHE_NAME);
        const cachedPage = await cache.match(request);
        if (cachedPage) {
            return cachedPage;
        }
        const offline = await cache.match('./offline.html');
        if (offline) {
            return offline;
        }
        const fallback = await cache.match('./index.html');
        return fallback || new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html' } });
    }
}

async function handleAsset(event) {
    const { request } = event;
    // Stale-while-revalidate untuk aset same-origin
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    const networkPromise = fetch(request)
        .then((netRes) => {
            if (netRes && netRes.ok) {
                cache.put(request, netRes.clone());
            }
            return netRes;
        })
        .catch(() => null);

    if (cached) {
        // Kembalikan versi cache segera, update berjalan di background
        event.waitUntil(networkPromise);
        return cached;
    }

    const fresh = await networkPromise;
    if (fresh) {
        return fresh;
    }

    return new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
}

async function handleFonts(event) {
    const { request } = event;
    // Runtime cache untuk Google Fonts
    const cache = await caches.open(FONT_CACHE);
    const cached = await cache.match(request);
    const networkPromise = fetch(request, { mode: 'cors' })
        .then((res) => {
            if (res && res.ok) {
                cache.put(request, res.clone());
            }
            return res;
        })
        .catch(() => null);

    if (cached) {
        event.waitUntil(networkPromise);
        return cached;
    }

    const fresh = await networkPromise;
    if (fresh) {
        return fresh;
    }

    return new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
}

// ===== Fetch
self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);

    if (req.method !== 'GET') return;

    // Fonts: googleapis/gstatic
    if (/fonts\.g(oogleapis|static)\.com$/.test(url.hostname)) {
        event.respondWith(handleFonts(event));
        return;
    }

    // Same-origin: gunakan strategi berbeda untuk navigasi vs aset
    if (url.origin === location.origin) {
        if (req.mode === 'navigate' || req.destination === 'document') {
            event.respondWith(handleNavigate(req));
            return;
        }
        event.respondWith(handleAsset(event));
    }
});

// ===== Background Sync untuk klik WA
self.addEventListener('sync', (event) => {
    if (!event.tag || !event.tag.startsWith('wa-click:')) return;
    event.waitUntil((async () => {
        try {
            const parts = event.tag.split(':'); // ['wa-click', 'label', 'ts']
            const label = parts[1] || 'wa';
            await fetch(`/track?e=wa&label=${encodeURIComponent(label)}&t=${Date.now()}`, {
                method: 'GET',
                credentials: 'omit'
            });
        } catch (_) {}
    })());
});
