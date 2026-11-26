#!/usr/bin/env node
"use strict";
/* tools/pool_laden.js – DER EINE WEG ZUM POOL (N29 Teil 2, E40, 24.09.2026).

   Liest `pool/pool_m*.json` (Fragen) und `pool/pool_faelle.json` (Faelle) und prueft dabei genau das,
   was bis heute `build_fragen.py` beim Bauen von `fragen.js`/`faelle.js` prueft (Pflichtfelder,
   ID-Format, Modul-Praefix, Pruefungsteil, Schwierigkeit, Dubletten). Bei einem Befund WIRFT er –
   jeder Leser bekommt die Pruefung mit, keiner liest einen kaputten Pool still weiter.

   ►► WARUM: `fragen.js`/`faelle.js` waren ein BAUERGEBNIS im Repo, das 20 Werkzeuge lasen und ein
      Drift-Waechter bewachte. Der Neubau liest `pool/*.json` direkt; die alte App ist Referenz
      (`referenz/`). Mit diesem Lader gibt es keine zweite Fassung des Pools mehr, die driften kann.

   ⚠️ Reihenfolge der Dateien wie `build_fragen.py` (`sorted(glob)`): Codepunkt-Ordnung der Namen.
      Fuer die ASCII-Namen in `pool/` ist JS-`sort()` dieselbe Ordnung.

   Aufruf:
     const { laden } = require("./pool_laden.js");  const { fragen, faelle } = laden();
     node tools/pool_laden.js --pruefe        # "POOL <fragen> <faelle> <teilaufgaben>", rc 1 bei Befund
     node tools/pool_laden.js --json fragen   # JSON-Array auf stdout (fuer Python-Werkzeuge)
     node tools/pool_laden.js --json faelle
     node tools/pool_laden.js --js <ordner>   # fragen.js + faelle.js wie frueher build_fragen.py –
                                              # NUR fuer den Test-Arbeitsordner (tools/work_dateien.sh),
                                              # nie in den Projektordner (die alte App laedt sie per <script>)
*/
const fs = require("fs");
const path = require("path");

const WURZEL = path.join(__dirname, "..");
const PFLICHT = ["id", "modul", "thema", "typ", "schwierigkeit", "pruefungsteil"];
const ID_RE = /^M0\d-\d{3}$/;
const FALL_PFLICHT = ["id", "modul", "thema", "pruefungsteil", "titel", "szenario", "teilaufgaben"];
const FALL_ID_RE = /^FALL-\d{2}$/;

function fehler(/** @type {string} */ msg) { throw new Error("POOL UNGUELTIG – " + msg); }
const leer = /** @param {any} v */ (v) => v === undefined || v === null || v === "";
const istStufe = /** @param {any} v */ (v) => Number.isInteger(v) && v >= 1 && v <= 4;

function liesJson(/** @type {string} */ p) {
  const text = fs.readFileSync(p, "utf8");
  try { return JSON.parse(text); } catch (e) { fehler(`${rel(p)}: ungueltiges JSON (${/** @type {Error} */ (e).message})`); }
}
const rel = /** @param {string} p */ (p) => path.relative(WURZEL, p).replace(/\\/g, "/");

function dubletten(/** @type {string[]} */ ids) {
  const zahl = new Map();
  for (const i of ids) zahl.set(i, (zahl.get(i) || 0) + 1);
  return [...zahl].filter(([, n]) => n > 1).map(([i]) => i).sort();
}

function ladeFragen(/** @type {string} */ wurzel) {
  const ordner = path.join(wurzel, "pool");
  const namen = fs.readdirSync(ordner).filter((n) => /^pool_m.*\.json$/.test(n)).sort();
  if (namen.length === 0) fehler("keine pool/pool_m*.json gefunden");
  const alle = [];
  for (const n of namen) {
    const p = path.join(ordner, n), daten = liesJson(p), wo = "pool/" + n;
    if (!Array.isArray(daten)) fehler(`${wo}: kein JSON-Array`);
    daten.forEach((/** @type {any} */ q, /** @type {number} */ i) => {
      if (!q || typeof q !== "object" || Array.isArray(q)) fehler(`${wo}[${i}]: Eintrag ist kein Objekt`);
      const fehlend = PFLICHT.filter((k) => leer(q[k]));
      if (fehlend.length) fehler(`${wo} · ${q.id || "?"}: fehlende Pflichtfelder ${fehlend.join(", ")}`);
      if (!ID_RE.test(String(q.id))) fehler(`${wo}: ID-Format ungueltig '${q.id}' (erwartet M0X-NNN)`);
      if (!String(q.id).startsWith(String(q.modul) + "-")) fehler(`${wo} · ${q.id}: ID-Praefix passt nicht zu modul '${q.modul}'`);
      if (q.pruefungsteil !== "AP1" && q.pruefungsteil !== "AP2") fehler(`${wo} · ${q.id}: pruefungsteil '${q.pruefungsteil}' (nur AP1/AP2)`);
      if (!istStufe(q.schwierigkeit)) fehler(`${wo} · ${q.id}: schwierigkeit '${q.schwierigkeit}' (nur 1–4)`);
    });
    alle.push(...daten);
  }
  const d = dubletten(alle.map((q) => q.id));
  if (d.length) fehler("Doppelte IDs: " + d.join(", "));
  return alle;
}

function ladeFaelle(/** @type {string} */ wurzel) {
  const p = path.join(wurzel, "pool", "pool_faelle.json"), wo = "pool/pool_faelle.json";
  const faelle = liesJson(p);
  if (!Array.isArray(faelle)) fehler(`${wo}: kein JSON-Array`);
  faelle.forEach((/** @type {any} */ fa, /** @type {number} */ i) => {
    if (!fa || typeof fa !== "object" || Array.isArray(fa)) fehler(`${wo}[${i}]: Eintrag ist kein Objekt`);
    const fehlend = FALL_PFLICHT.filter((k) => leer(fa[k]) || (Array.isArray(fa[k]) && fa[k].length === 0));
    if (fehlend.length) fehler(`${wo} · ${fa.id || "?"}: fehlende Pflichtfelder ${fehlend.join(", ")}`);
    const fid = String(fa.id);
    if (!FALL_ID_RE.test(fid)) fehler(`${wo}: ID-Format ungueltig '${fid}' (erwartet FALL-NN)`);
    if (fa.pruefungsteil !== "AP1" && fa.pruefungsteil !== "AP2") fehler(`${wo} · ${fid}: pruefungsteil '${fa.pruefungsteil}' (nur AP1/AP2)`);
    if (!Array.isArray(fa.teilaufgaben) || !fa.teilaufgaben.length) fehler(`${wo} · ${fid}: teilaufgaben fehlen oder sind kein Array`);
    fa.teilaufgaben.forEach((/** @type {any} */ ta, /** @type {number} */ j) => {
      const w = `${wo} · ${fid} · Teilaufgabe ${j + 1}`;
      if (!ta || typeof ta !== "object" || Array.isArray(ta)) fehler(`${w}: kein Objekt`);
      for (const k of ["typ", "schwierigkeit", "frage", "erklaerungKurz"]) if (leer(ta[k])) fehler(`${w}: Pflichtfeld '${k}' fehlt`);
      if (!istStufe(ta.schwierigkeit)) fehler(`${w}: schwierigkeit '${ta.schwierigkeit}' (nur 1–4)`);
    });
  });
  const d = dubletten(faelle.map(/** @param {any} fa */ (fa) => fa.id));
  if (d.length) fehler("Doppelte Fall-IDs: " + d.join(", "));
  return faelle;
}

/** { fragen, faelle } – geprueft. Jeder Aufruf liest frisch (Werkzeuge laufen kurz). */
function laden(wurzel = WURZEL) {
  return { fragen: ladeFragen(wurzel), faelle: ladeFaelle(wurzel) };
}

/* Genau das Format von build_fragen.py (json.dump indent=1, ensure_ascii=False, LF). */
function alsJs(/** @type {any} */ fragen, /** @type {any} */ faelle) {
  const fr = "/* fragen.js – automatisch gebaut aus pool/pool_m*.json (build_fragen.py).\n" +
    "   Eigene Fragen: einfach weitere Objekte an das Array anhängen – Schema siehe README.md. */\n" +
    "var FRAGEN = " + JSON.stringify(fragen, null, 1) +
    ";\nif (typeof module !== \"undefined\" && module.exports) module.exports = FRAGEN;\n";
  const fa = "/* faelle.js – automatisch gebaut aus pool/pool_faelle.json. */\n" +
    "var FAELLE = " + JSON.stringify(faelle, null, 1) +
    ";\nif (typeof module !== \"undefined\" && module.exports) module.exports = FAELLE;\n";
  return { "fragen.js": fr, "faelle.js": fa };
}

module.exports = { laden, alsJs };

if (require.main === module) {
  const [art, arg] = process.argv.slice(2);
  try {
    const { fragen, faelle } = laden();
    if (art === "--pruefe") {
      const ta = faelle.reduce((/** @type {any} */ s, /** @type {any} */ fa) => s + fa.teilaufgaben.length, 0);
      console.log(`POOL ${fragen.length} ${faelle.length} ${ta}`);
    } else if (art === "--json" && (arg === "fragen" || arg === "faelle")) {
      process.stdout.write(JSON.stringify(arg === "fragen" ? fragen : faelle));
    } else if (art === "--js" && arg) {
      if (path.resolve(arg) === path.resolve(WURZEL)) throw new Error("--js nie in den Projektordner (E40)");
      for (const [n, t] of Object.entries(alsJs(fragen, faelle))) fs.writeFileSync(path.join(arg, n), t, "utf8");
    } else {
      console.error("Aufruf: node tools/pool_laden.js --pruefe | --json fragen|faelle | --js <ordner>");
      process.exit(2);
    }
  } catch (e) {
    console.error("[pool_laden] " + /** @type {Error} */ (e).message);
    process.exit(1);
  }
}
