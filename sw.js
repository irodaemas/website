/* Sentral Emas – Service Worker (subfolder-friendly) */
const CACHE_NAME = 'sentralemas-v27';
const FONT_CACHE = 'sentralemas-fonts-v2';

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
    './blog/panduan-buyback-berlian/',
    './blog/panduan-buyback-berlian/index.html',
    './blog/checklist-foto-emas-cod/',
    './blog/checklist-foto-emas-cod/index.html',
    './blog/panduan-jual-emas-tanpa-surat/',
    './blog/panduan-jual-emas-tanpa-surat/index.html',
    './offline.html'
];

const IMMUTABLE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 tahun
const IMMUTABLE_CACHE_CONTROL = `public, max-age=${IMMUTABLE_MAX_AGE_SECONDS}, immutable`;
const IMMUTABLE_ASSET_PATTERN = /\.(?:css|js|mjs|cjs|woff2?|ttf|otf|eot|png|jpe?g|gif|svg|webp|avif|ico|mp4|webm|ogg|ogv|mp3|wav|flac|webmanifest|json|map|txt|xml|xsl|pdf|wasm)$/i;
const CACHEABLE_DESTINATIONS = new Set(['style', 'script', 'image', 'font', 'audio', 'video', 'manifest', 'worker', 'paintworklet']);
const CACHE_EXCLUDE_PATHS = [/\/track\b/i];

function isExcludedPath(pathname) {
    return CACHE_EXCLUDE_PATHS.some((pattern) => pattern.test(pathname));
}

function shouldTreatAsImmutable(request, response) {
    if (!request) return false;
    const url = new URL(request.url, location.origin);
    if (isExcludedPath(url.pathname)) return false;
    if (url.pathname === '/' || url.pathname.endsWith('.html')) return false;
    if (url.origin !== location.origin) return false;
    if (response && response.type === 'opaque') return false;
    if (IMMUTABLE_ASSET_PATTERN.test(url.pathname)) return true;
    const destination = request.destination;
    return destination ? CACHEABLE_DESTINATIONS.has(destination) : false;
}

function isCacheableAssetRequest(request) {
    if (!request || request.method !== 'GET') return false;
    const url = new URL(request.url, location.origin);
    if (url.origin !== location.origin) return false;
    if (isExcludedPath(url.pathname)) return false;
    if (url.pathname === '/' || url.pathname.endsWith('.html')) return false;
    if (url.pathname.endsWith('/sw.js') || url.pathname.endsWith('/service-worker.js')) return false;
    if (request.mode === 'navigate' || request.destination === 'document') return false;
    const destination = request.destination;
    if (destination && destination.length) {
        return CACHEABLE_DESTINATIONS.has(destination);
    }
    return IMMUTABLE_ASSET_PATTERN.test(url.pathname);
}

function buildImmutableHeaders(extraHeaders) {
    const headers = {
        'Cache-Control': IMMUTABLE_CACHE_CONTROL,
        'Expires': new Date(Date.now() + IMMUTABLE_MAX_AGE_SECONDS * 1000).toUTCString()
    };
    if (extraHeaders && typeof extraHeaders === 'object') {
        Object.keys(extraHeaders).forEach((key) => {
            const value = extraHeaders[key];
            if (value === null || typeof value === 'undefined') {
                delete headers[key];
            } else {
                headers[key] = value;
            }
        });
    }
    return headers;
}

async function createResponseWithHeaders(response, overrides) {
    const headers = new Headers(response.headers);
    if (overrides && typeof overrides === 'object') {
        Object.keys(overrides).forEach((key) => {
            const value = overrides[key];
            if (value === null || typeof value === 'undefined') {
                headers.delete(key);
            } else {
                headers.set(key, value);
            }
        });
    }
    const body = await response.arrayBuffer();
    return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers
    });
}

async function prepareAssetResponse(request, response, options = {}) {
    if (!response) return null;
    const isOpaque = response.type === 'opaque';
    if (!isOpaque && !response.ok) return null;

    const { forceImmutable = false, extraHeaders } = options;
    const canOverride = !isOpaque;
    const shouldImmutable = canOverride && (forceImmutable || shouldTreatAsImmutable(request, response));

    let overrides = null;
    if (shouldImmutable) {
        overrides = buildImmutableHeaders(extraHeaders);
    } else if (extraHeaders && canOverride) {
        overrides = extraHeaders;
    }

    if (!overrides || Object.keys(overrides).length === 0) {
        return response;
    }

    try {
        return await createResponseWithHeaders(response, overrides);
    } catch (err) {
        console.warn('[SW] Gagal menerapkan header cache untuk', request.url, err);
        return response;
    }
}

async function cacheResponse(cache, request, response) {
    if (!cache || !request || !response) return;
    const isOpaque = response.type === 'opaque';
    if (!isOpaque && !response.ok) return;
    try {
        await cache.put(request, response);
    } catch (err) {
        console.warn('[SW] cache.put gagal untuk', request.url, err);
    }
}

async function precacheCoreAssets() {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(
        CORE_ASSETS.map(async (asset) => {
            try {
                const request = new Request(asset, { cache: 'reload' });
                const response = await fetch(request);
                if (!response) return;
                if (!response.ok && response.type !== 'opaque') return;
                const prepared = await prepareAssetResponse(request, response.clone());
                if (prepared) {
                    await cacheResponse(cache, request, prepared);
                }
            } catch (err) {
                console.warn('[SW] Precaching gagal untuk', asset, err);
            }
        })
    );
}

async function refreshAsset(cache, request) {
    try {
        const response = await fetch(request, { cache: 'no-store' });
        if (!response) return;
        if (!response.ok && response.type !== 'opaque') return;
        const prepared = await prepareAssetResponse(request, response.clone());
        if (prepared) {
            await cacheResponse(cache, request, prepared);
        }
    } catch (_) {}
}

async function refreshFont(cache, request) {
    try {
        const response = await fetch(request, { mode: 'cors', cache: 'no-store' });
        if (!response) return;
        if (!response.ok && response.type !== 'opaque') return;
        const prepared = await prepareAssetResponse(request, response.clone(), { forceImmutable: true });
        if (prepared) {
            await cacheResponse(cache, request, prepared);
        }
    } catch (_) {}
}

// ===== Install: precache core assets
self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        try {
            await precacheCoreAssets();
        } catch (err) {
            console.warn('[SW] Precaching utama gagal', err);
        }
        await self.skipWaiting();
    })());
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
        const fresh = await fetch(request, { cache: 'no-store' });
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
            await cacheResponse(cache, request, fresh.clone());
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
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
        event.waitUntil(refreshAsset(cache, request));
        return cached;
    }

    try {
        const response = await fetch(request, { cache: 'no-store' });
        if (!response) {
            throw new Error('no-response');
        }
        if (!response.ok && response.type !== 'opaque') {
            return response;
        }
        const prepared = await prepareAssetResponse(request, response.clone());
        if (prepared) {
            event.waitUntil(cacheResponse(cache, request, prepared.clone()));
            return prepared;
        }
        return response;
    } catch (err) {
        if (cached) {
            return cached;
        }
        return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }
}

async function handleFonts(event) {
    const { request } = event;
    const cache = await caches.open(FONT_CACHE);
    const cached = await cache.match(request);
    if (cached) {
        event.waitUntil(refreshFont(cache, request));
        return cached;
    }

    try {
        const response = await fetch(request, { mode: 'cors', cache: 'no-store' });
        if (!response) {
            throw new Error('no-response');
        }
        if (!response.ok && response.type !== 'opaque') {
            return response;
        }
        const prepared = await prepareAssetResponse(request, response.clone(), { forceImmutable: true });
        if (prepared) {
            event.waitUntil(cacheResponse(cache, request, prepared.clone()));
            return prepared;
        }
        return response;
    } catch (err) {
        return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    }
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
        if (isCacheableAssetRequest(req)) {
            event.respondWith(handleAsset(event));
        }
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
