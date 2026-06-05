// MHMSocial Service Worker v2.0 - FCM Background Push
const CACHE_NAME = "mhmsocial-v2";
const STATIC_ASSETS = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// Handle raw push events (fallback if FCM compat SW not loaded)
self.addEventListener("push", e => {
  let data = { title: "MHMSocial", body: "You have a new notification", icon: "icon-192.png", tag: "mhm-push" };
  if (e.data) {
    try { Object.assign(data, e.data.json()); } catch (_) { data.body = e.data.text(); }
  }
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || "icon-192.png",
      badge: "icon-192.png",
      tag: data.tag || "mhm-push",
      renotify: true,
      vibrate: [200, 100, 200, 100, 200],
      data: { url: data.url || "./" },
      actions: [
        { action: "open", title: "Open App" },
        { action: "dismiss", title: "Dismiss" }
      ]
    })
  );
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  if (e.action === "dismiss") return;
  const targetUrl = (e.notification.data && e.notification.data.url) || "./";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});

self.addEventListener("sync", e => {
  if (e.tag === "mhm-sync") {
    console.log("[SW] Background sync triggered");
  }
});
