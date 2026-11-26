/* tools/melde_ids.js – erzeugt neu/src/server/fragen-ids.ts aus dem Pool (N20b; seit N29 Teil 2 ueber tools/pool_laden.js).
   WARUM: der Worker prüft jede Online-Meldung gegen die Kennungen des Pools, kann aber den
   2,4-MB-Pool nicht laden. ⛔ Die Datei ist ERZEUGT – `fragen-ids.test.ts` meldet jede Abweichung
   vom Pool; dann hier neu erzeugen:   node tools/melde_ids.js                                   */
const fs = require("fs"), path = require("path");
const wurzel = path.resolve(__dirname, "..");
const ids = require(path.join(__dirname, "pool_laden.js")).laden().fragen.map(/** @param {any} f */ (f) => f.id).sort();
const zeilen = [];
for (let i = 0; i < ids.length; i += 10) zeilen.push("  " + ids.slice(i, i + 10).map(/** @param {string} x */ (x) => JSON.stringify(x)).join(", ") + ",");
const text = "/* ERZEUGT von tools/melde_ids.js – nicht von Hand ändern. Anzahl: " + ids.length + " */\n" +
  "export const FRAGE_IDS: readonly string[] = [\n" + zeilen.join("\n") + "\n];\n";
fs.writeFileSync(path.join(wurzel, "neu/src/server/fragen-ids.ts"), text);
console.log("fragen-ids.ts: " + ids.length + " Kennungen");
