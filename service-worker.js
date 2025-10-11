// service-worker.js
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("app-cache").then(cache => {
      return cache.addAll(["/", "/index.html", "/style.css", "/main.js"]);
    })
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
