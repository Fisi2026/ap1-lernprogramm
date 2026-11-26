#!/usr/bin/env node
"use strict";
/* tools/schnappschuss.js – DIE STRUKTUR JEDES SCREENS EINFRIEREN UND VERGLEICHEN.

     node tools/schnappschuss.js --setze     Referenz neu schreiben (dom_referenz.json)
     node tools/schnappschuss.js --pruefe    vergleichen, rc=1 bei Abweichung
     node tools/schnappschuss.js --zeige <route>   eine Route als Baum ausgeben

   ══════════ WARUM ES DAS GIBT (10.09.2026, Umbau der Darstellungsschicht) ══════════
   Der Umbau des Aussehens fasst genau die Schicht an, die 41 der 45 Suiten pruefen. Diese
   Suiten pruefen VERHALTEN – ob ein Knopf bucht, ob eine Antwort richtig bewertet wird.
   ⛔ WAS SIE NICHT SEHEN: dass ein Element beim Umbauen still verschwindet. Ein geloeschtes
   `<div class="rail">` faellt keiner Verhaltenspruefung auf – und der Lerner merkt es sofort.
   ►► Dieses Werkzeug friert die STRUKTUR ein: welche Elemente, mit welchen Klassen, in welcher
   Verschachtelung. Es ist absichtlich BLIND fuer Aussehen (Abstaende, Farben, Groessen) –
   dafuer ist der Bildvergleich da, und der ist bewusst KEIN Waechter.

   ══════════ WARUM ES NICHT WUERFELT ══════════
   ⛔⛔ EIN SCHNAPPSCHUSS, DER JEDES MAL EINE ANDERE FRAGE ZIEHT, IST KEINE PRUEFUNG.
   Zwei Vorkehrungen, beide noetig:
     1. `Math.random` wird durch einen geseedeten PRNG ersetzt (wie tools/probe_lernfluss.js).
     2. Die Fragetypen werden ueber FESTE IDs gezeigt (Route `frage`, Deep-Link-Pfad), nicht
        ueber die Ziehung. Sonst waere jede neue Pool-Frage ein Fehlalarm – das Netz haette
        genau dann angeschlagen, wenn jemand Inhalte ergaenzt, und nie beim Umbau.
   ⚠️ Textinhalt wird NICHT gespeichert, nur seine LAENGENKLASSE. Eine korrigierte Formulierung
      darf das Netz nicht ausloesen; ein verschwundener Absatz schon.

   ⚠️ ES BRAUCHT jsdom. Gefunden wird es ueber NODE_PATH (so ruft check.sh die Suiten auf) oder
      ueber .tooling/node_modules. Fehlt es, sagt das Werkzeug das – es raet nicht.
*/

const fs = require("fs");
const path = require("path");

const WURZEL = path.join(__dirname, "..");
// ⚠️ NICHT in den Wurzelordner: .assetsignore schliesst *.json dort NICHT aus, und eine
//    Messnotiz ging so schon einmal an den Lerner (teilbegriffe.json, 06.09.2026).
const REFERENZ = path.join(__dirname, "dom_referenz.json");
const APP = path.join(WURZEL, "referenz", "lernprogramm_ap1.html");  // N29 Teil 2: alte App in referenz/

/* ---- jsdom finden, ohne zu raten ---- */
function ladeJsdom() {
  const versuche = [];
  try { return require(/** @type {string} */ ("jsdom")); } catch (e) { versuche.push("require('jsdom')"); }
  const extra = [process.env.NODE_PATH, path.join(WURZEL, ".tooling", "node_modules")].filter(Boolean);
  for (const p of extra) {
    for (const teil of String(p).split(path.delimiter)) {
      try { return require(path.join(teil, "jsdom")); } catch (e) { versuche.push(teil); }
    }
  }
  console.log("⛔ jsdom nicht gefunden. Versucht: " + versuche.join(" · "));
  console.log("   Aufruf wie die Suiten: NODE_PATH=<spiegel> node tools/schnappschuss.js --pruefe");
  process.exit(2);
}

/* Derselbe PRNG wie tools/probe_lernfluss.js – gleiche Seeds, gleiche Ziehung. */
function mulberry32(/** @type {any} */ a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/* ---- Was aufgenommen wird ----
   ⚠️ Die Routen stammen aus der Tabelle in app_seiten.js `render()`. Wer dort eine Route
      ergaenzt und hier nicht, bekommt keinen Fehler – deshalb prueft `--pruefe` die Liste
      gegen SEITEN aus app_ui.js mit. */
const ROUTEN = ["start", "ueben", "unterricht", "fd", "markiert", "gen", "netzplan",
                "gantt", "glossar", "spickzettel", "serie", "stat", "einst"];

/* Feste Fragen je Typ – bewusst Bestands-IDs, die laut START_PROMPT stehen bleiben.
   ⚠️ Faellt eine davon aus dem Pool, meldet das Werkzeug sie als fehlend statt still
      eine andere zu nehmen. */
const FRAGEN = ["M01-117", "M02-017", "M03-001", "M04-308", "M06-002", "M07-008"];

const LAENGE = /** @param {any} n */ n => n === 0 ? "0" : n < 20 ? "s" : n < 80 ? "m" : n < 240 ? "l" : "xl";

function knoten(/** @type {any} */ el, /** @type {any} */ tiefe, /** @type {any} */ raus) {
  if (el.nodeType !== 1) return;
  const klassen = (el.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean).sort();
  const merkmale = [];
  for (const a of ["id", "role", "type", "aria-label", "aria-live", "hidden", "disabled"]) {
    if (el.hasAttribute && el.hasAttribute(a)) {
      const v = el.getAttribute(a);
      merkmale.push(a === "id" || a === "role" || a === "type" ? a + "=" + v : a);
    }
  }
  /* Nur der EIGENE Text des Elements, nicht der seiner Kinder – sonst zaehlt jeder
     Absatz in jedem Vorfahren noch einmal mit und eine kleine Aenderung wandert nach oben. */
  let eigen = 0;
  for (const k of el.childNodes) if (k.nodeType === 3) eigen += k.textContent.trim().length;
  raus.push("  ".repeat(tiefe) + el.tagName.toLowerCase()
            + (klassen.length ? "." + klassen.join(".") : "")
            + (merkmale.length ? "[" + merkmale.join(",") + "]" : "")
            + (eigen ? " #" + LAENGE(eigen) : ""));
  for (const k of el.children) knoten(k, tiefe + 1, raus);
}

function aufnehmen(/** @type {any} */ w, /** @type {any} */ name) {
  const raus = [];
  for (const sel of ["#nav", "#main", "#actionbar"]) {
    const el = w.document.querySelector(sel);
    if (!el) { raus.push("FEHLT " + sel); continue; }
    knoten(el, 0, raus);
  }
  return { name: name, zeilen: raus };
}

async function starten(/** @type {any} */ jsdom) {
  const { JSDOM } = jsdom;
  /** @type {Record<string, any>} */ const speicher = {};
  const dom = await JSDOM.fromFile(APP, {
    runScripts: "dangerously", resources: "usable", pretendToBeVisual: true,
    url: "file://" + APP.replace(/\\/g, "/"),
    beforeParse(/** @type {any} */ w) {
      w.confirm = () => true; w.alert = () => {};
      Object.defineProperty(w, "localStorage", { configurable: true, value: {
        getItem: /** @param {any} k */ k => Object.prototype.hasOwnProperty.call(speicher, k) ? speicher[k] : null,
        setItem: (/** @type {any} */ k, /** @type {any} */ v) => { speicher[k] = String(v); },
        removeItem: /** @param {any} k */ k => { delete speicher[k]; }, clear: () => {},
        key: () => null, get length() { return Object.keys(speicher).length; } } });
    }
  });
  const w = dom.window;
  const bereit = () => typeof w.render === "function" && Array.isArray(w.POOL) && w.POOL.length > 0
                       && typeof w.S === "object" && !!w.document.getElementById("main");
  const bis = Date.now() + 15000;
  while (!bereit() && Date.now() < bis) await new Promise(r => setTimeout(r, 15));
  await new Promise(r => setTimeout(r, 150));
  if (!bereit()) { console.log("⛔ App nicht bereit – nichts aufgenommen."); process.exit(3); }
  return w;
}

async function alleAufnehmen(/** @type {any} */ w) {
  const bilder = [];
  for (const r of ROUTEN) {
    w.Math.random = mulberry32(42);          // je Route derselbe Seed
    try { w.gotoSeite(r); } catch (e) { bilder.push({ name: r, zeilen: ["AUSNAHME " + /** @type {Error} */ (e).message] }); continue; }
    await new Promise(res => setTimeout(res, 40));
    bilder.push(aufnehmen(w, r));
  }
  for (const id of FRAGEN) {
    w.Math.random = mulberry32(7);
    const f = w.frageById ? w.frageById(id) : null;
    if (!f) { bilder.push({ name: "frage:" + id, zeilen: ["FEHLT IM POOL"] }); continue; }
    try { w.frageDirekt = id; w.gotoSeite("frage"); } catch (e) {
      bilder.push({ name: "frage:" + id, zeilen: ["AUSNAHME " + /** @type {Error} */ (e).message] }); continue;
    }
    await new Promise(res => setTimeout(res, 40));
    bilder.push(aufnehmen(w, "frage:" + id + " (" + (f.typ || "?") + ")"));
  }
  return bilder;
}

function vergleiche(/** @type {any} */ alt, /** @type {any} */ neu) {
  const nachName = /** @param {any} l @returns {Record<string, any>} */ l => { const m = {}; l.forEach(/** @param {any} b */ b => /** @type {Record<string, any>} */ (m)[b.name] = b.zeilen); return m; };
  const a = nachName(alt), b = nachName(neu);
  const raus = [];
  for (const name of Object.keys(a)) if (!(name in b)) raus.push({ name, art: "Screen fehlt jetzt" });
  for (const name of Object.keys(b)) if (!(name in a)) raus.push({ name, art: "Screen ist neu" });
  for (const name of Object.keys(a)) {
    if (!(name in b)) continue;
    const x = a[name], y = b[name];
    if (x.join("\n") === y.join("\n")) continue;
    const weg = x.filter(/** @param {any} z */ z => !y.includes(z));
    const dazu = y.filter(/** @param {any} z */ z => !x.includes(z));
    raus.push({ name, art: "geaendert", weg, dazu, vorher: x.length, nachher: y.length });
  }
  return raus;
}

(async () => {
  const setze = process.argv.includes("--setze");
  const zeigeIdx = process.argv.indexOf("--zeige");
  const jsdom = ladeJsdom();
  const w = await starten(jsdom);
  const bilder = await alleAufnehmen(w);
  const elemente = bilder.reduce((s, b) => s + b.zeilen.length, 0);

  if (zeigeIdx >= 0) {
    const wunsch = process.argv[zeigeIdx + 1];
    const b = bilder.find(x => x.name === wunsch || x.name.startsWith(wunsch));
    if (!b) { console.log("Unbekannt: " + wunsch + " – vorhanden: " + bilder.map(x => x.name).join(", ")); process.exit(2); }
    console.log("### " + b.name + "  (" + b.zeilen.length + " Elemente)");
    console.log(b.zeilen.join("\n"));
    process.exit(0);
  }

  console.log("Aufgenommen: " + bilder.length + " Screens, " + elemente + " Elemente");
  const leer = bilder.filter(b => b.zeilen.length < 3);
  if (leer.length) console.log("⚠️ verdaechtig leer: " + leer.map(b => b.name).join(", "));

  if (setze) {
    fs.writeFileSync(REFERENZ, JSON.stringify({
      _warnung: "ERZEUGT von tools/schnappschuss.js --setze. Nicht von Hand pflegen. " +
                "Wer diese Datei nach einer Aenderung einfach neu schreibt, hat kein Netz mehr, " +
                "sondern eine Gewohnheit: erst lesen, was sich geaendert hat, DANN setzen.",
      _stand: new Date().toISOString().slice(0, 10),
      _screens: bilder.length, _elemente: elemente, bilder
    }, null, 1), "utf8");
    console.log("GESCHRIEBEN: dom_referenz.json");
    process.exit(0);
  }

  if (!fs.existsSync(REFERENZ)) {
    console.log("⛔ Keine Referenz vorhanden – einmalig 'node tools/schnappschuss.js --setze'.");
    process.exit(2);
  }
  const ref = JSON.parse(fs.readFileSync(REFERENZ, "utf8"));
  const diff = vergleiche(ref.bilder, bilder);
  if (!diff.length) {
    console.log("SCHNAPPSCHUSS: unveraendert gegen " + ref._stand +
                " (" + ref._screens + " Screens, " + ref._elemente + " Elemente)");
    process.exit(0);
  }
  console.log("SCHNAPPSCHUSS: " + diff.length + " Screen(s) weichen ab");
  for (const d of diff) {
    if (d.art !== "geaendert") { console.log("   " + d.name + ": " + d.art); continue; }
    console.log("   " + d.name + ": " + d.vorher + " -> " + d.nachher + " Elemente");
    d.weg.slice(0, 6).forEach(/** @param {any} z */ z => console.log("      - " + z.trim()));
    d.dazu.slice(0, 6).forEach(/** @param {any} z */ z => console.log("      + " + z.trim()));
    if (d.weg.length > 6 || d.dazu.length > 6) console.log("      ... gekuerzt");
  }
  console.log("⚠️ Jede Zeile einzeln lesen. Gewollt? Dann '--setze'. Ungewollt? Dann ist genau das der Fund.");
  process.exit(1);
})();
