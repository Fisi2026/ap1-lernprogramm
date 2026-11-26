/* Abschalt-Service-Worker (N29 Schritt 2, R9) – ERZEUGT beim Bau aus `neu/sw/abschalten.js`.
   Liegt unter /sw.js (alte App, Geltungsbereich /) UND /v2/sw.js (Neubau bis v1.41, Geltungsbereich /v2/).
   Jeder dort registrierte alte Service Worker holt sich beim naechsten Update-Check DIESE Fassung:
   sie uebernimmt sofort, loescht die Caches der alten Fassungen (`ap1-v*`, `ap1v2-*`), meldet sich
   ab und laedt jede offene Seite auf den Neubau unter / – der #-Bereich bleibt (gleiches Format, N22).
   ⛔ Der Cache des Neubaus (`ap1-app-*`) wird NICHT angefasst.
   ⛔ Kein fetch-Lauscher: bis zum Neuladen geht alles ins Netz.
   ⛔ Diese Datei muss dauerhaft ausgeliefert bleiben – ein Geraet kann Monate spaeter wiederkommen. */
"use strict";

var ALT = ["ap1-v", "ap1v2-"];
var ZIEL = "__ZIEL__";

function istAlt(k) {
  return ALT.some(function (v) { return k.indexOf(v) === 0; });
}

self.addEventListener("install", function () { self.skipWaiting(); });

self.addEventListener("activate", function (e) {
  /* ⛔ Das Neuladen steht AUSSERHALB von waitUntil (gemessen 24.09., Edge): unter /v2/ kam
     `client.navigate("/")` – Ziel ausserhalb des eigenen Geltungsbereichs – nie zurueck, der
     Worker blieb in „activating" haengen und meldete sich nie ab. Aufraeumen und Abmelden
     entscheiden; das Neuladen ist Zugabe (die alten Seiten laden bei controllerchange ohnehin
     selbst bzw. zeigen „Neue Fassung – neu laden"). */
  var fertig = caches.keys()
    .then(function (keys) { return Promise.all(keys.filter(istAlt).map(function (k) { return caches.delete(k); })); })
    .then(function () { return self.registration.unregister(); });
  e.waitUntil(fertig);
  fertig
    .then(function () { return self.clients.matchAll({ type: "window" }); })
    .then(function (fenster) {
      fenster.forEach(function (f) { f.navigate(ZIEL + new URL(f.url).hash).catch(function () { return null; }); });
    })
    .catch(function () { return null; });
});
