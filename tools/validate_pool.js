#!/usr/bin/env node
/* validate_pool.js – #81: validiert den GESAMTEN Fragenpool (fragen.js) in einem Durchlauf.
   Prüft mit L.validateFragen (Schema/Pflichtfelder/Grade-Struktur je Typ) plus Zusatzregeln:
   ID-Duplikate, ID-Format (M0X-NNN), Modul==ID-Präfix, kanonisches thema (Keys von L.THEMA_RELEVANZ),
   pruefungsteil AP1/AP2, schwierigkeit 1–4, hotspot: genau 1 richtige Zone.
   Anders als validate_batch.js (nur EIN neuer Batch gegen den Bestand) prüft dies den kompletten,
   bereits gebauten Pool. Aufruf im Training-Ordner:  node tools/validate_pool.js   (Exit 1 bei Problemen).
   Schema-Referenz siehe SCHEMA.md. */
const path = require("path"), fs = require("fs");
const L = require(path.join(__dirname, "kern.js"));   // N34 T6a (E56): Rechenkern aus neu/src/kern/*.ts, nicht mehr logik.js
const POOL = require(path.join(__dirname, "pool_laden.js")).laden();  // N29 Teil 2 (E40)
const F = POOL.fragen;

let fehler = 0;
const melde = (/** @type {any} */ id, /** @type {any} */ t) => { console.log("FEHLER " + id + ": " + t); fehler++; };

// 1) Schema/Grade-Struktur je Typ (Quelle der Wahrheit)
const v = L.validateFragen(F);
v.fehler.forEach(/** @param {any} e */ e => melde(e.id, e.meldung));

// 2) Zusatzregeln über den ganzen Pool
const themen = new Set(Object.keys(L.THEMA_RELEVANZ));
/* M09 „Unser Unterricht" hat eine eigene kanonische Themenliste (L.M09_THEMEN, Single Source in
   logik.js). Sie ist bewusst NICHT Teil von THEMA_RELEVANZ, weil das die Gewichtungstabelle der
   AP1-Ziehung ist und M09 dort nicht vorkommen darf. Für die Validierung gilt je Modul die
   passende Liste. */
const m09Themen = new Set(L.M09_THEMEN);
const themenFuer = /** @param {any} f */ f => (f.modul === "M09" ? m09Themen : themen);
const ids = F.map(/** @param {any} f */ f => f.id);
[...new Set(ids.filter((/** @type {any} */ x, /** @type {number} */ i) => ids.indexOf(x) !== i))].forEach(id => melde(id, "ID doppelt im Pool"));
F.forEach(/** @param {any} f */ f => {
  if (!/^M0\d-\d{3}$/.test(String(f.id))) melde(f.id, "ID-Format ungültig (erwartet M0X-NNN)");
  if (!String(f.id).startsWith(f.modul + "-")) melde(f.id, "Modul != ID-Präfix (" + f.modul + ")");
  if (!themenFuer(f).has(f.thema)) melde(f.id, "thema nicht kanonisch: " + f.thema);
  /* FB-R3 (2026-07-23): gebiet ist Pflicht und muss der Single-Source-Zuordnung L.THEMA_GEBIET
     (bzw. „M9" für M09) entsprechen – Tippfehler-/Drift-Wächter für die Prüfungsordnungs-Sortierung. */
  var erwGebiet = L.gebietFuer(f);
  if (!f.gebiet) melde(f.id, "gebiet fehlt");
  else if (!erwGebiet) melde(f.id, "kein Soll-Gebiet für " + f.modul + "|" + f.thema + " (THEMA_GEBIET unvollständig)");
  else if (f.gebiet !== erwGebiet) melde(f.id, "gebiet '" + f.gebiet + "' != Soll '" + erwGebiet + "'");
  if (!["AP1", "AP2"].includes(f.pruefungsteil)) melde(f.id, "pruefungsteil fehlt/ungültig");
  if (!(f.schwierigkeit >= 1 && f.schwierigkeit <= 4)) melde(f.id, "schwierigkeit nicht 1–4");
  if (f.typ === "hotspot") {
    const r = (f.zonen || []).filter(/** @param {any} z */ z => z.richtig === true).length;
    if (r !== 1) melde(f.id, "hotspot: " + r + " richtige Zonen (genau 1 nötig)");
  }
  /* K3-E64 (24.11.2026): eine Zusatz-Kategorie, die einer Paar-Kategorie gleicht, wuerde in der Anzeige verschluckt
     (Zuordnung.tsx filtert sie) – der Autor glaubte dann an eine Falschantwort, die es nicht gibt. Doppelte ebenso. */
  if (f.typ === "zuordnung" && Array.isArray(f.extra)) {
    const kat = new Set((f.paare || []).map(/** @param {any} p */ p => p[1]));
    f.extra.forEach(/** @param {any} e @param {number} i */ (e, i) => {
      if (kat.has(e)) melde(f.id, "zuordnung: extra '" + e + "' ist schon eine Kategorie der Paare");
      if (f.extra.indexOf(e) !== i) melde(f.id, "zuordnung: extra '" + e + "' doppelt");
    });
  }
});

// 3) Fälle (G2.2, 2026-07-19): bis dahin waren Fälle die EINZIGEN Inhalte ganz ohne Prüfung.
//    Jede Teilaufgabe ist strukturell eine Frage → dieselbe Typ-/Grade-Validierung wie oben.
//    Die Teilaufgaben tragen keine eigene id/modul/thema, daher werden diese Felder für die
//    Validierung aus dem Fall abgeleitet (Kopie, der Datenbestand bleibt unberührt).
const FA = POOL.faelle;
const fallIds = FA.map(/** @param {any} fa */ fa => fa.id);
[...new Set(fallIds.filter((/** @type {any} */ x, /** @type {number} */ i) => fallIds.indexOf(x) !== i))].forEach(id => melde(id, "Fall-ID doppelt"));
let taGesamt = 0;
FA.forEach(/** @param {any} fa */ fa => {
  if (!/^FALL-\d{2}$/.test(String(fa.id))) melde(fa.id, "Fall-ID-Format ungültig (erwartet FALL-NN)");
  if (!themen.has(fa.thema)) {
    // Fälle nutzen bewusst eigene Fall-Themen (z. B. „Softwareprojekt-Einführung") – nur Hinweis,
    // kein Fehler: die kanonische Themenliste gilt für den Fragenpool, nicht für Fall-Überschriften.
    console.log("[hinweis] " + fa.id + ": Fall-Thema nicht in THEMA_RELEVANZ: " + fa.thema);
  }
  if (!["AP1", "AP2"].includes(fa.pruefungsteil)) melde(fa.id, "Fall: pruefungsteil fehlt/ungültig");
  const proben = (fa.teilaufgaben || []).map((/** @type {any} */ ta, /** @type {number} */ i) => Object.assign({}, ta, {
    id: fa.id + "-" + String(i + 1),
    modul: fa.modul,
    thema: fa.thema,
    pruefungsteil: fa.pruefungsteil
  }));
  taGesamt += proben.length;
  L.validateFragen(proben).fehler.forEach(/** @param {any} e */ e => melde(e.id, "Teilaufgabe: " + e.meldung));
  proben.forEach(/** @param {any} ta */ ta => {
    if (ta.typ === "hotspot") {
      const r = (ta.zonen || []).filter(/** @param {any} z */ z => z.richtig === true).length;
      if (r !== 1) melde(ta.id, "Teilaufgabe hotspot: " + r + " richtige Zonen (genau 1 nötig)");
    }
  });
});

console.log("---");
console.log(F.length + " Fragen geprüft · " + new Set(ids).size + " eindeutige IDs · " + themen.size + " kanonische Themen.");
console.log(FA.length + " Fälle geprüft · " + taGesamt + " Teilaufgaben.");
console.log(fehler ? fehler + " PROBLEM(E)" : "OK – Pool valide");
process.exit(fehler ? 1 : 0);
