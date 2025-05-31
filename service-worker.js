const CACHE_NAME = "web-desktop-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./offline_apps/word/word.html",
  "./offline_apps/excel.html",
  "./offline_apps/browser.html",
  "./offline_apps/whiteboard/index.html",
  "./offline_apps/camera.html",
  "./offline_apps/rotina.html",
  "./offline_apps/diario/diario.html",
  "./offline_apps/tarefas.html",
  "./offline_apps/touchpad.js",
  "./offline_apps/calculadora.html",
  "./offline_apps/youtube-wrapper.html",
  "./offline_apps/filemanager.html",
  "./offline_apps/player.html",
  "./offline_apps/terminal.html",
  "./images/google.png",
  "./images/word.png"  
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
  );
});

