/* Service Worker des Neubaus (N33, E33; seit N29 unter /app-sw.js) – ERZEUGT beim Bau aus `neu/sw/vorlage.js`.
   ⛔ Nicht in v2/ von Hand aendern: `neu/sw/plugin.ts` setzt Cache-Name und Dateiliste ein.

   Regeln (PLAN_NEUBAU N33):
   * Cache-Name = APP_VERSION (mit Vorsatz `ap1-app-`; `ap1-v*` und `ap1v2-*` gehoeren den alten
     Fassungen und raeumt der Abschalt-SW, `neu/sw/abschalten.js`).
   * Huelle UND Pool-Chunk vorab – die Liste kommt aus dem Buendel, nicht von Hand.
   * `/api/*` wird NIE beantwortet und nie gecacht – Meldungen, Fehlerberichte und die
     Melde-Warteschlange gehen am Service Worker vorbei ins Netz.
   * KEIN unbedingtes skipWaiting: eine neue Fassung wartet, bis die Seite SKIP_WAITING schickt
     (der Update-Hinweis, nie waehrend einer Simulation oder Tagesserie).
   * Beim START der Seite (Nutzer-Entscheid 25.11.2026, BUILD_LOG 277): SKIP_WAITING_ALLEIN schaltet nur um,
     wenn kein anderes Fenster der App offen ist (dort koennte ein Durchgang laufen); die Antwort geht
     ueber den mitgeschickten Port zurueck, VOR dem Umschalten.
   * `activate` raeumt NUR eigene alte Caches (`ap1-app-*`). */
"use strict";

var CACHE = "ap1-app-2.13.1-7abd144b";
var VORSATZ = "ap1-app-";
var DATEIEN = [
  "./",
  "apple-touch-icon-180.png",
  "assets/Einstellungen-CrhYhmE7.js",
  "assets/Gantt-CmQqT5Zr.js",
  "assets/Glossar-CWwl8_t0.js",
  "assets/Meldungsliste-vbyCLlq_.js",
  "assets/Netzplan-C38Gs3xJ.js",
  "assets/RechenGenerator-B_6KoXus.js",
  "assets/Simulation-CxE-nbHL.js",
  "assets/Spickzettel-C6yaoK2R.js",
  "assets/accordion-7WwaTJJE.js",
  "assets/badge-BpvriCU-.js",
  "assets/da-CvYILz6e.js",
  "assets/dist--KlWTGLr.js",
  "assets/dist-14JP6Ohm.js",
  "assets/dist-fgTM840t.js",
  "assets/dist-hEVwlKWm.js",
  "assets/geist-latin-ext-wght-normal-DC-KSUi6.woff2",
  "assets/geist-latin-wght-normal-BgDaEnEv.woff2",
  "assets/index-D3AyQTuu.js",
  "assets/index-pZEedhq7.css",
  "assets/input-IarGOL-0.js",
  "assets/pooldaten-CmcSGG2E.js",
  "assets/pruefe-CDyRw_2D.js",
  "assets/rolldown-runtime-hePW80VL.js",
  "assets/search-BdC0MMUS.js",
  "icon-192.png",
  "icon-512.png",
  "index.html",
  "manifest.webmanifest"
];

self.addEventListener("message", function (e) {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
  if (e.data && e.data.type === "SKIP_WAITING_ALLEIN") {
    var port = e.ports && e.ports[0];
    e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (l) {
      var allein = l.length <= 1;
      if (port) port.postMessage({ allein: allein });
      return allein ? self.skipWaiting() : undefined;
    }));
  }
});

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(DATEIEN); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k.indexOf(VORSATZ) === 0 && k !== CACHE) return caches.delete(k);
        return undefined;   // N38 Q4: fremde und aktuelle Caches bleiben (vorher fiel die Funktion heraus – gleich)
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf("/api/") === 0) return;
  /* Die App steuert Bereiche ueber den Hash – jede Navigation im Geltungsbereich ist die Huelle. */
  if (req.mode === "navigate") {
    e.respondWith(caches.match("./", { cacheName: CACHE }).then(function (hit) {
      return hit ?? fetch(req);
    }));
    return;
  }
  e.respondWith(caches.match(req, { cacheName: CACHE }).then(function (hit) {
    return hit ?? fetch(req);
  }));
});
