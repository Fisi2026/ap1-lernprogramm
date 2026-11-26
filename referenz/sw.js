/* Service Worker – AP1-Lernprogramm (F2)
   Cache-First für alle App-Dateien -> echte Offline-Fähigkeit der installierten App.
   Versionierter Cache; activate räumt alte Caches auf.
   HINWEIS: Bei jeder Änderung der App-Dateiliste ODER App-Version CACHE_VERSION erhöhen,
   damit installierte Clients die neue Fassung nachladen. */
"use strict";

var CACHE_VERSION = "ap1-v2.0.0";

/* Alle App-Dateien (relativ, kein external -> Offline-Audit bleibt 0).
   Muss der Skript-/Ressourcenliste in lernprogramm_ap1.html entsprechen. */
var APP_FILES = [
  ".",
  "index.html",
  "lernprogramm_ap1.html",
  "styles.css",
  "logik.js",
  "fragen.js",
  "faelle.js",
  "spickzettel.js",
  "abkuerzungen.js",
  "app_state.js",
  "app_pool.js",
  "app_util.js",
  "app_ui.js",
  "app_frage.js",
  "app_glossar.js",
  "app_loeser.js",
  "app_verbuchen.js",
  "app_seiten.js",
  "app_sim.js",
  "app_pages2.js",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon-180.png"
  /* ⚠️⚠️ 2026-08-25 (Nutzer-Entscheid, BUILD_LOG 25.08. (8)): DIE BEIDEN MANIFEST-SCREENSHOTS
     STEHEN HIER BEWUSST NICHT MEHR. `screenshot-start.png` (32 kB) und `screenshot-ueben.png`
     (41 kB) sind zusammen 67 kB gzip = 7,6 % der 877-kB-Erstinstallation und werden im laufenden
     Programm NIE angezeigt - sie sind allein fuer den Installationsdialog des Betriebssystems da,
     der online erscheint. Im `manifest.webmanifest` bleiben sie eingetragen, im Repo bleiben sie
     liegen; nur vorab in den Offline-Cache geladen werden sie nicht mehr.
     ►► NICHT WIEDER EINTRAGEN, ohne den Entscheid neu zu stellen. `test_pwa` haelt das fest. */
];

/* G1.6 #11: KEIN unbedingtes skipWaiting mehr. Eine neue Fassung bleibt im Zustand „waiting", bis die
   Seite SKIP_WAITING schickt – erst dann übernimmt sie und die Seite lädt neu. So werden App-Dateien
   nie mitten in einer offenen Frage/laufenden Simulation ausgetauscht. */
self.addEventListener("message", function (e) {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.addAll(APP_FILES);
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (k) {
          /* ⛔ N33 (23.09.2026): NUR EIGENE Caches (`ap1-v*`) raeumen. Vorher fiel jeder fremde
             Name – auch der Offline-Cache des Neubaus (`ap1v2-*`) unter /v2/: mit jedem Release
             der alten App waere der Neubau offline leer gewesen, bis er wieder online ist. */
          if (k.indexOf("ap1-v") === 0 && k !== CACHE_VERSION) return caches.delete(k);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  /* ⛔⛔ /v2/ GEHOERT DIESEM SERVICE WORKER NICHT (17.09.2026). Dort liegt der Neubau,
     parallel ausgeliefert. Dieser Lauscher faengt sonst JEDE GET-Anfrage derselben
     Herkunft ab - und zwar cache-first: eine einmal geholte /v2/index.html kaeme
     danach fuer immer aus DIESEM Cache, auch nach einem neuen Deploy des Neubaus.
     Offline waere es noch schlimmer: der Rueckfall unten liefert bei jeder
     Navigation `lernprogramm_ap1.html` - unter /v2/ stuende dann die ALTE App.
     ►► Gemessen am Quelltext, bevor etwas ausgeliefert wurde. Hier wird nichts
        beantwortet; der Browser holt /v2/ selbst. */
  if (new URL(req.url).pathname.indexOf("/v2/") === 0) return;
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        /* Erfolgreiche gleichartige Antworten nachträglich cachen (App wächst nicht, aber robust). */
        if (res && res.status === 200 && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE_VERSION).then(function (cache) {
            cache.put(req, copy);
          });
        }
        return res;
      }).catch(function () {
        /* Offline & nicht im Cache: für Navigationsanfragen die Startseite liefern. */
        if (req.mode === "navigate") return caches.match("lernprogramm_ap1.html");
      });
    })
  );
});
