#!/usr/bin/env node
"use strict";
/* tools/p5_ziehen.js – Stichprobe fuer N48 P5 (Inhaltspruefung), deterministisch (PLAN_NACHT_18-10 Phase 9).

   WARUM: die Ziehung vom 11.10. (BUILD_LOG 141) lag nur in `_to_delete/helfer/` und ist weg; ihre 30 IDs sind
   nicht rekonstruierbar (genannt sind nur M03-484, M04-513, M08-110, M03-115). Diese Fassung liegt im Repo.

   Regel: je Fragetyp 5 Fragen, Seed 1110 (mulberry32). Die IDs eines Typs werden aufsteigend sortiert und per
   Fisher-Yates gemischt; genommen werden die ersten 5, die nicht ausgeschlossen sind. Ausgeschlossen:
   * die sechs am 11.10. voll gelesenen Typen (baukasten, beschriftung, bild, dropdown, erklaeren, fehlersuche),
   * die am 11.10. gelesenen und namentlich bekannten IDs (AUS_IDS).
   Der Zufallsstrom laeuft je Typ neu ab Seed 1110 – ein neuer Typ verschiebt die Ziehung der anderen nicht.

   Aufruf:  node tools/p5_ziehen.js            # Tabelle "| Nr | ID | Typ |"
            node tools/p5_ziehen.js --probe    # bekannte Faelle (regeln/messen.md 11.10.), rc 0 nur bei allen ok */
const path = require("path");

const SEED = 1110;
const JE_TYP = 5;
const AUS_TYPEN = ["baukasten", "beschriftung", "bild", "dropdown", "erklaeren", "fehlersuche"];
const AUS_IDS = ["M03-484", "M04-513", "M08-110", "M03-115"];

function mulberry32(/** @type {number} */ a) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** @param {{id: string, typ: string}[]} fragen @param {string[]} ausTypen @param {string[]} ausIds */
function ziehen(fragen, ausTypen = AUS_TYPEN, ausIds = AUS_IDS, seed = SEED, jeTyp = JE_TYP) {
  /** @type {Map<string, string[]>} */
  const jeTypIds = new Map();
  for (const f of fragen) {
    if (ausTypen.includes(f.typ)) continue;
    if (!jeTypIds.has(f.typ)) jeTypIds.set(f.typ, []);
    /** @type {string[]} */ (jeTypIds.get(f.typ)).push(f.id);
  }
  /** @type {{id: string, typ: string}[]} */
  const aus = [];
  for (const typ of [...jeTypIds.keys()].sort()) {
    const ids = /** @type {string[]} */ (jeTypIds.get(typ)).slice().sort();
    const zufall = mulberry32(seed);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(zufall() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    for (const id of ids.filter((x) => !ausIds.includes(x)).slice(0, jeTyp)) aus.push({ id, typ });
  }
  return aus;
}

function probe() {
  const f = (/** @type {string} */ typ, /** @type {number} */ n) =>
    Array.from({ length: n }, (_, i) => ({ id: "M0" + (i % 9 + 1) + "-" + String(100 + i), typ }));
  const fall = [...f("mc", 20), ...f("bild", 8), ...f("konsole", 3)];
  /** @type {[string, boolean][]} */
  const faelle = [];
  const a = ziehen(fall, ["bild"], []);
  faelle.push(["5 je Typ, Typ mit 3 Fragen gibt 3", a.filter((x) => x.typ === "mc").length === 5 && a.filter((x) => x.typ === "konsole").length === 3]);
  faelle.push(["ausgeschlossener Typ fehlt", !a.some((x) => x.typ === "bild")]);
  faelle.push(["deterministisch", JSON.stringify(a) === JSON.stringify(ziehen(fall, ["bild"], []))]);
  faelle.push(["Eingabereihenfolge egal", JSON.stringify(a) === JSON.stringify(ziehen(fall.slice().reverse(), ["bild"], []))]);
  const weg = a[0].id;
  const b = ziehen(fall, ["bild"], [weg]);
  faelle.push(["ausgeschlossene ID fehlt, Ersatz rueckt nach", !b.some((x) => x.id === weg) && b.filter((x) => x.typ === "mc").length === 5]);
  faelle.push(["anderer Seed zieht anders (muss abweichen)", JSON.stringify(a) !== JSON.stringify(ziehen(fall, ["bild"], [], 1111))]);
  faelle.push(["leerer Pool gibt nichts", ziehen([], [], []).length === 0]);
  let ok = 0;
  for (const [name, gut] of faelle) { console.log((gut ? "ok   " : "FALSCH ") + name); if (gut) ok++; }
  console.log("PROBE " + ok + "/" + faelle.length);
  return ok === faelle.length ? 0 : 1;
}

if (require.main === module) {
  if (process.argv.includes("--probe")) process.exit(probe());
  const { fragen } = require(path.join(__dirname, "pool_laden.js")).laden();
  const liste = ziehen(fragen);
  console.log("| Nr | ID | Typ |\n|---|---|---|");
  liste.forEach((x, i) => console.log("| " + (i + 1) + " | " + x.id + " | " + x.typ + " |"));
}

module.exports = { ziehen };
