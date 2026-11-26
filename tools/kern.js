/* tools/kern.js – DER RECHENKERN FUER DIE WERKZEUGE (N34 T6a, E49, E56, 26.09.2026)
   Die Pool-Werkzeuge (`validate_*.js`, `build_schema.js`, `pool_query.js`, `probe_lernfluss.js`) lasen
   `L` aus der Wurzel-`logik.js`. Seit T6a kommt dasselbe aus `neu/src/kern/*.ts` – Node laedt die
   Dateien nativ (E49). Diese Datei sammelt ihre Exporte zu EINEM Objekt, damit die Werkzeuge
   weiter `L.<name>` schreiben koennen.
   ⛔ Ein Name, der in zwei Kern-Dateien VERSCHIEDEN belegt ist, bricht hier laut ab – sonst gewaenne
      still die zuletzt geladene Datei.
   ⛔ Keine eigene Regel hier. Gerechnet wird in `neu/src/kern/`. */
"use strict";
const path = require("path");
const KERN = path.join(__dirname, "..", "neu", "src", "kern");
const DATEIEN = [
  "tabellen/konfig.ts", "tabellen/gebiete.ts", "tabellen/noten.ts", "tabellen/fragetypen.ts",
  "tabellen/pruefung.ts", "tabellen/szenarien.ts", "zahlen.ts", "zufall.ts", "bewertung.ts",
  "lernen.ts", "rechenaufgabe.ts", "generatoren.ts", "pruefung.ts", "validierung.ts",
  "freitext.ts", // 13.10.2026 (BUILD_LOG 153): gradeTeilpunkte/normFreitext fuer trennschaerfe.js, mess_freitext.js
];
/** @type {Record<string, any>} */
const L = {};
for (const d of DATEIEN) {
  const m = require(path.join(KERN, d));
  for (const [n, w] of Object.entries(m)) {
    if (Object.prototype.hasOwnProperty.call(L, n) && L[n] !== w) throw new Error("tools/kern.js: '" + n + "' doppelt belegt (zuletzt " + d + ")");
    L[n] = w;
  }
}
module.exports = L;
