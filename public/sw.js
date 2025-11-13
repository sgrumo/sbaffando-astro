const CACHE_NAME = 'sbaffando-v1'
const RUNTIME_CACHE = 'sbaffando-runtime-v1'
const urlsToCache = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/manifest.json',
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache)
            })
            .then(() => self.skipWaiting()),
    )
})

self.addEventListener('activate', event => {
    event.waitUntil(
        caches
            .keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (
                            cacheName !== CACHE_NAME &&
                            cacheName !== RUNTIME_CACHE
                        ) {
                            return caches.delete(cacheName)
                        }
                    }),
                )
            })
            .then(() => self.clients.claim()),
    )
})

// Fetch event - Cache First for assets, Network First for API calls
self.addEventListener('fetch', event => {
    const { request } = event
    const url = new URL(request.url)

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return
    }

    // API calls - Network First
    if (url.pathname.includes('/api/')) {
        event.respondWith(networkFirst(request))
        return
    }

    // Assets - Cache First
    if (
        request.destination === 'image' ||
        request.destination === 'font' ||
        request.destination === 'style' ||
        request.destination === 'script'
    ) {
        event.respondWith(cacheFirst(request))
        return
    }

    // HTML pages - Network First with cache fallback
    if (request.mode === 'navigate') {
        event.respondWith(networkFirstWithCache(request))
        return
    }

    // Default - Network First
    event.respondWith(networkFirst(request))
})

// Cache First strategy
async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME)
    const cached = await cache.match(request)

    if (cached) {
        return cached
    }

    try {
        const response = await fetch(request)
        if (response.ok) {
            cache.put(request, response.clone())
        }
        return response
    } catch (error) {
        return new Response('Network error', { status: 408 })
    }
}

// Network First strategy
async function networkFirst(request) {
    const cache = await caches.open(RUNTIME_CACHE)

    try {
        const response = await fetch(request)
        if (response.ok) {
            cache.put(request, response.clone())
        }
        return response
    } catch (error) {
        const cached = await cache.match(request)
        if (cached) {
            return cached
        }
        return new Response('Network error', { status: 408 })
    }
}

// Network First with cache fallback (for navigation)
async function networkFirstWithCache(request) {
    const cache = await caches.open(RUNTIME_CACHE)

    try {
        const response = await fetch(request)
        if (response.ok) {
            cache.put(request, response.clone())
        }
        return response
    } catch (error) {
        const cached = await cache.match(request)
        if (cached) {
            return cached
        }
        // Return offline page if available
        return cache.match('/offline.html').catch(() => {
            return new Response('You are offline', { status: 503 })
        })
    }
}

// Background sync for future use
self.addEventListener('sync', event => {
    if (event.tag === 'sync-search') {
        event.waitUntil(syncSearch())
    }
})

async function syncSearch() {
    // This could be used to sync search data when back online
    return Promise.resolve()
}
