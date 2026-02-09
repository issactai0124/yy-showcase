const CACHE_NAME = "yy-showcase-v1";
const urlsToCache = [
  "/yy-showcase/",
  "/yy-showcase/index.html",
  "/yy-showcase/styles.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
