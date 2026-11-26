#!/usr/bin/env node
"use strict";
/* item_flaws.js – Item-Writing-Flaws im Pool als Befundliste (N50 Q1, 18.10.2026)
   Regeln nach Moore u. a. 2023 (arXiv 2307.08161). MESSWERKZEUG, KEIN WAECHTER: es schreibt nichts,
   steht nicht in check.sh und aendert den Pool nicht. Ob eine Regel Waechter wird, entscheidet der Nutzer
   anhand von tools/item_flaws_befund.md (Zaehlung + Fehlalarmquote).

   Aufruf:  node tools/item_flaws.js [--json] [--kurz] [--min N] [--ziehe N [--seed S]] [--regel R1..R4]
            node tools/item_flaws.js --probe        # gebaute Faelle mit bekannter Antwort, rc 1 bei Fehlurteil
     --json     maschinenlesbar (Zaehlung + Befunde)
     --kurz     nur die Zaehlung, keine Befundliste
     --min N    Mindestlaenge der laengsten Option fuer R1 (Standard: laengen_ausnahmen.json, 25 – wie der
                Pool-Waechter tests/test_didaktik.js). --min 0 misst auch Kurzoptionen.
     --ziehe N  statt der ganzen Liste je Regel N Befunde ziehen (fester Seed, Standard 1018)

   EINHEITEN (Auswahltypen): mc · bild mit optionen · mehrfach · jede Dropdown-Luecke (dropdown, bild+luecken)
   · szenario2 schritt1/schritt2 · Fall-Teilaufgaben (mc, mehrfach, dropdown). Nicht gemessen: zuordnung, mtf,
   kreuztabelle, matrix usw. – dort gibt es keine Liste „eine richtige Option unter mehreren".
   REGELN
     R1 laengste Option = richtig (Gleichstand zaehlt, wie der Waechter; Einheiten, deren Optionen alle gleich lang
        sind, haben keine laengste Option und fallen heraus; mehrfach: laengste Option ist EINE der richtigen)
     R2 absoluter Begriff (immer, nie, alle, nur, keine/keiner, jede, stets, ausschliesslich …) in einer RICHTIGEN Option
     R3 Option „keine der genannten" / „alle genannten" (auch in Distraktoren; ein Fund ist die Option, nicht ihre Rolle)
     R4 Inhaltswort des Fragestamms steht in der richtigen Option, aber in KEINER falschen (Wortwiederholung als Hinweis)
   Fuer R2–R4 liefert die Zaehlung zusaetzlich die Basisrate je falscher Option (was wuerde die Regel dort melden?),
   damit sichtbar ist, ob die Regel richtige Optionen ueberhaupt anders trifft als falsche. */
const fs = require("fs");
const path = require("path");

const KONF = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "laengen_ausnahmen.json"), "utf8"));
const MIN_STANDARD = KONF.grenzwerte.min_optionslaenge;

/* ------------------------------------------------------------------ Einheiten */
/** @typedef {{id:string, typ:string, quelle:string, stamm:string, opt:string[], richtig:number[]}} Einheit */

function aufListe(/** @type {any} */ opt, /** @type {any} */ loes) {
  if (!Array.isArray(opt) || opt.length < 2) return null;
  const r = Array.isArray(loes) ? loes : [loes];
  if (!r.length || r.some((i) => !Number.isInteger(i) || i < 0 || i >= opt.length)) return null;
  return { opt: opt.map((o) => (typeof o === "string" ? o : String(o && o.text !== undefined ? o.text : o))), richtig: r };
}

/** Zerlegt eine Pool-Frage (oder Fall-Teilaufgabe) in Auswahl-Einheiten. */
function einheiten(/** @type {any} */ f, /** @type {string} */ id, /** @type {string} */ quelle) {
  /** @type {Einheit[]} */
  const out = [];
  const add = (/** @type {string} */ eid, /** @type {string} */ typ, /** @type {string} */ stamm, /** @type {any} */ opt, /** @type {any} */ loes) => {
    const l = aufListe(opt, loes);
    if (l) out.push({ id: eid, typ, quelle, stamm: stamm || "", opt: l.opt, richtig: l.richtig });
  };
  const typ = f.typ;
  if ((typ === "mc" || typ === "bild") && f.optionen) add(id, typ, f.frage, f.optionen, f.loesungIndex);
  if (typ === "mehrfach") add(id, typ, f.frage, f.optionen, f.loesungIndizes);
  if ((typ === "dropdown" || typ === "bild") && Array.isArray(f.luecken)) {
    f.luecken.forEach((/** @type {any} */ l, /** @type {number} */ i) => {
      if (l && !Array.isArray(l) && l.optionen) add(id + "#l" + (i + 1), typ, f.frage, l.optionen, l.loesung);
    });
  }
  if (typ === "szenario2") {
    ["schritt1", "schritt2"].forEach((s, i) => {
      if (f[s]) add(id + "#s" + (i + 1), typ, f[s].frage, f[s].optionen, f[s].loesungIndex);
    });
  }
  return out;
}

function alleEinheiten(/** @type {{fragen:any[], faelle:any[]}} */ pool) {
  /** @type {Einheit[]} */
  let e = [];
  pool.fragen.forEach((f) => { e = e.concat(einheiten(f, f.id, "fragen")); });
  pool.faelle.forEach((fall) => (fall.teilaufgaben || []).forEach((/** @type {any} */ t, /** @type {number} */ i) => {
    e = e.concat(einheiten(t, fall.id + "-t" + (i + 1), "faelle"));
  }));
  return e;
}

/* ------------------------------------------------------------------ Regeln */
const kurzer = (/** @type {string} */ s, n = 90) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const woerter = (/** @type {string} */ s) => s.toLowerCase().match(/[a-zäöüß0-9]+/g) || [];

/* „scharf“ = Teilmenge der Befunde, die nach dem 18.10. bei der Handpruefung der 20er-Stichprobe ueberwiegend als echte Hinweise erkannt wurden (tools/item_flaws_befund.md):
   R1 Vorsprung > 5 Zeichen UND hoechstens 60 % der Optionen richtig (bei mehr ist „die laengste ist richtig“ ohnehin wahrscheinlich)
   R2 keine falsche Option traegt einen Absolutbegriff · R3 die Option ist die richtige · R4 hoechstens 60 % der Optionen richtig.
   Reine Zusatzspalte – die Befundzahl der Regel bleibt die ungefilterte. */
const ZUFALL_GRENZE = 0.6;

/* R1 */
function r1(/** @type {Einheit} */ u, /** @type {number} */ minLen) {
  const len = u.opt.map((o) => o.length), max = Math.max(...len);
  if (max < minLen || len.every((l) => l === len[0])) return null;
  const hit = u.richtig.find((i) => len[i] === max);
  if (hit === undefined) return null;
  const anderer = Math.max(...len.filter((_, i) => !u.richtig.includes(i)).concat([0]));
  const scharf = max - anderer > 5 && u.richtig.length / u.opt.length < ZUFALL_GRENZE;
  return { beleg: "richtig " + max + " Z., laengste falsche " + anderer + " Z.: „" + kurzer(u.opt[hit]) + "“", scharf };
}

/* R2 */
const ABSOLUT = new Set(["immer", "nie", "niemals", "stets", "nur", "alle", "aller", "allen", "alles", "jede", "jeder", "jedes", "jeden", "jedem",
  "ausschließlich", "ausschliesslich", "sämtliche", "sämtlichen", "keine", "keiner", "keinen", "keines", "keinem", "kein", "nichts", "niemand",
  "ausnahmslos", "grundsätzlich", "unbedingt"]);
function r2opt(/** @type {string} */ opt) {
  const w = woerter(opt).filter((x) => ABSOLUT.has(x));
  return w.length ? { beleg: "„" + [...new Set(w)].join("“, „") + "“ in: „" + kurzer(opt) + "“", scharf: false } : null;
}

/* R3 */
const R3 = /\b(?:keine?r?s?|alle|allen|aller)\b(?:\s+(?:der|den|von den|dieser|obigen))?\s+(?:oben\s+|vorstehend\s+)?(?:genannten|aufgeführten|aufgefuehrten|obigen|oben|vorstehenden|angegebenen|aufgezählten|aufgezaehlten|antworten|optionen|aussagen|varianten|antwortmöglichkeiten|antwortmoeglichkeiten|vorgenannten|aufgelisteten)\b/i;
function r3opt(/** @type {string} */ opt) {
  const m = R3.exec(opt);
  return m ? { beleg: "„" + m[0] + "“ in: „" + kurzer(opt) + "“", scharf: false } : null;
}

/* R4 */
const STOP = new Set(("aber alle allen aller alles also anderen auch auf aus bei beim bis dann dass dem den der des die dies diese diesem diesen dieser dieses doch durch eine einem einen einer eines einfach "
  + "für fuer gegen haben hat hier ihre ihrer ihren ihrem immer ist kann können koennen mehr mit nach nicht noch nur oder ohne sein seine seiner seinen sich sind sowie über ueber um und unter von vom vor war wegen werden wenn wie wird wurde zum zur zwischen "
  + "welche welcher welches welchen welchem folgende folgenden folgender folgendes folgt richtig richtige richtigen falsch falsche falschen zutreffend zutrifft trifft treffen beschreibt beschreiben gilt gelten "
  + "aussage aussagen antwort antworten option optionen frage nennen nennt wählen waehlen wählt ordnen kreuzen geben sollte sollen soll müssen muss muessen darf dürfen ergibt ergeben bedeutet bedeuten "
  + "unternehmen firma gmbh mitarbeiter mitarbeiterin kunde kunden beispiel beispielsweise geeignet geeignetsten passt passend ehesten meisten erste ersten zweite dritte wieso warum "
  + "lücke luecke lücken luecken einsetzen ergänzen ergaenzen vervollständigen sinnvoll sinnvollsten damit dabei davon dazu hierbei").split(/\s+/));
const PRAEFIX = 8;
const stamm = (/** @type {string} */ w) => (w.length > PRAEFIX ? w.slice(0, PRAEFIX) : w);
function inhaltsStamme(/** @type {string} */ s) {
  return new Set(woerter(s).filter((w) => w.length >= 5 && !STOP.has(w) && !/^\d+$/.test(w)).map(stamm));
}
/** Inhaltswoerter des Stamms, die in genau dieser Option stehen und in keiner falschen anderen. */
function r4opt(/** @type {Einheit} */ u, /** @type {number} */ i) {
  const st = inhaltsStamme(u.stamm);
  if (!st.size) return null;
  const mein = inhaltsStamme(u.opt[i]);
  /** @type {Set<string>[]} */
  const andere = u.opt.filter((_, j) => j !== i && !u.richtig.includes(j)).map(inhaltsStamme);
  if (!andere.length) return null;
  const treffer = [...mein].filter((w) => st.has(w) && !andere.some((a) => a.has(w)));
  return treffer.length ? { beleg: "Stammwort „" + treffer.join("“, „") + "“ nur in: „" + kurzer(u.opt[i]) + "“", scharf: u.richtig.length / u.opt.length < ZUFALL_GRENZE } : null;
}

const REGELN = {
  R1: "laengste Option = richtig",
  R2: "absoluter Begriff in richtiger Option",
  R3: "„keine/alle der genannten“ als Option",
  R4: "Stammwort nur in der richtigen Option",
};

/** Beurteilt eine Einheit gegen alle Regeln. Rueckgabe: Befunde + Basisraten-Zaehler. */
function beurteile(/** @type {Einheit} */ u, /** @type {number} */ minLen) {
  const befunde = /** @type {{id:string, regel:string, typ:string, beleg:string, scharf:boolean}[]} */ ([]);
  const basis = { R2: 0, R3: 0, R4: 0 };       // falsche Optionen, die dieselbe Eigenschaft tragen
  const falsche = u.opt.map((_, i) => i).filter((i) => !u.richtig.includes(i));
  const push = (/** @type {string} */ regel, /** @type {{beleg:string, scharf:boolean}} */ x) => befunde.push({ id: u.id, regel, typ: u.typ, beleg: x.beleg, scharf: x.scharf });
  const a = r1(u, minLen); if (a) push("R1", a);
  const falscheTragen = falsche.some((i) => r2opt(u.opt[i]));
  u.richtig.forEach((i) => { const b = r2opt(u.opt[i]); if (b) push("R2", { beleg: b.beleg, scharf: !falscheTragen && falsche.length > 0 }); });
  u.opt.forEach((o, i) => { const c = r3opt(o); if (c) push("R3", { beleg: (u.richtig.includes(i) ? "[richtig] " : "[falsch] ") + c.beleg, scharf: u.richtig.includes(i) }); });
  u.richtig.forEach((i) => { const d = r4opt(u, i); if (d) push("R4", d); });
  falsche.forEach((i) => { if (r2opt(u.opt[i])) basis.R2++; if (r3opt(u.opt[i])) basis.R3++; if (r4opt(u, i)) basis.R4++; });
  return { befunde, basis, nFalsche: falsche.length, nRichtige: u.richtig.length };
}

/* ------------------------------------------------------------------ Lauf */
function messe(/** @type {Einheit[]} */ ein, /** @type {number} */ minLen) {
  /** @type {{id:string, regel:string, typ:string, beleg:string, scharf:boolean}[]} */
  let befunde = [];
  /** @type {Record<string, any>} */
  const je = {};
  ein.forEach((u) => {
    const z = (je[u.typ] = je[u.typ] || { einheiten: 0, richtigeOpt: 0, falscheOpt: 0, R1_grundmenge: 0, R1_zufall: 0, basis: { R2: 0, R3: 0, R4: 0 } });
    const b = beurteile(u, minLen);
    z.einheiten++; z.richtigeOpt += b.nRichtige; z.falscheOpt += b.nFalsche;
    const len = u.opt.map((o) => o.length);
    if (Math.max(...len) >= minLen && !len.every((l) => l === len[0])) { z.R1_grundmenge++; z.R1_zufall += u.richtig.length / u.opt.length; }
    for (const k of ["R2", "R3", "R4"]) z.basis[k] += b.basis[/** @type {"R2"|"R3"|"R4"} */ (k)];
    befunde = befunde.concat(b.befunde);
  });
  /** @type {Record<string, Record<string, number>>} */
  const zaehlung = {};
  for (const r of Object.keys(REGELN)) zaehlung[r] = {};
  befunde.forEach((b) => { zaehlung[b.regel][b.typ] = (zaehlung[b.regel][b.typ] || 0) + 1; });
  /** @type {Record<string, number>} */
  const scharf = {};
  for (const r of Object.keys(REGELN)) scharf[r] = befunde.filter((b) => b.regel === r && b.scharf).length;
  return { befunde, zaehlung, je, scharf };
}

/** Wiederholbare Ziehung: mulberry32, partieller Fisher-Yates auf der nach (id, beleg) sortierten Liste. */
function ziehe(/** @type {any[]} */ liste, /** @type {number} */ n, /** @type {number} */ seed) {
  let s = seed >>> 0;
  const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const a = liste.slice().sort((x, y) => (x.id + x.beleg < y.id + y.beleg ? -1 : 1));
  for (let i = 0; i < Math.min(n, a.length); i++) { const j = i + Math.floor(rnd() * (a.length - i)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, Math.min(n, a.length));
}

/* ------------------------------------------------------------------ --probe */
/** Gebaute Faelle mit bekannter Antwort. erwartet = die Regel MUSS melden (false: darf nicht melden). */
function probeFaelle() {
  const L = (/** @type {number} */ n, /** @type {string} */ c = "x") => c.repeat(n);
  const mc = (/** @type {string} */ frage, /** @type {string[]} */ optionen, /** @type {number} */ loesungIndex) => ({ id: "P-1", typ: "mc", frage, optionen, loesungIndex });
  /** @type {{name:string, regel:string, frage:any, erwartet:boolean}[]} */
  const F = [];
  // R1
  F.push({ name: "R1 richtig eindeutig laengste (MUSS rot)", regel: "R1", erwartet: true, frage: mc("Was gilt?", [L(30, "a"), L(40, "b"), L(31, "c"), L(29, "d")], 1) });
  F.push({ name: "R1 Gleichstand an der Spitze zaehlt", regel: "R1", erwartet: true, frage: mc("Was gilt?", [L(40, "a"), L(40, "b"), L(31, "c")], 0) });
  F.push({ name: "R1 laengste ist falsch", regel: "R1", erwartet: false, frage: mc("Was gilt?", [L(30, "a"), L(40, "b"), L(31, "c")], 0) });
  F.push({ name: "R1 alle Optionen gleich lang (keine laengste)", regel: "R1", erwartet: false, frage: mc("Was gilt?", [L(30, "a"), L(30, "b"), L(30, "c")], 1) });
  F.push({ name: "R1 laengste Option unter Mindestlaenge 25", regel: "R1", erwartet: false, frage: mc("Was gilt?", ["Kurz", "Etwas laenger", "Mittel"], 1) });
  F.push({ name: "R1 genau an der Grenze 25 Zeichen", regel: "R1", erwartet: true, frage: mc("Was gilt?", [L(10, "a"), L(25, "b"), L(12, "c")], 1) });
  F.push({ name: "R1 knapp unter der Grenze 24 Zeichen", regel: "R1", erwartet: false, frage: mc("Was gilt?", [L(10, "a"), L(24, "b"), L(12, "c")], 1) });
  F.push({ name: "R1 mehrfach: laengste ist eine der richtigen (MUSS rot)", regel: "R1", erwartet: true,
    frage: { id: "P-2", typ: "mehrfach", frage: "Welche?", optionen: [L(30, "a"), L(50, "b"), L(31, "c"), L(32, "d")], loesungIndizes: [0, 1] } });
  F.push({ name: "R1 mehrfach: laengste ist falsch", regel: "R1", erwartet: false,
    frage: { id: "P-2", typ: "mehrfach", frage: "Welche?", optionen: [L(30, "a"), L(50, "b"), L(31, "c"), L(32, "d")], loesungIndizes: [0, 2] } });
  F.push({ name: "R1 dropdown-Luecke mit laengster richtiger (MUSS rot)", regel: "R1", erwartet: true,
    frage: { id: "P-3", typ: "dropdown", frage: "Ein ___ ist", luecken: [{ optionen: [L(30, "a"), L(26, "b"), L(60, "c")], loesung: 2 }] } });
  F.push({ name: "R1 szenario2 Schritt 2 laengste richtig (MUSS rot)", regel: "R1", erwartet: true,
    frage: { id: "P-4", typ: "szenario2", frage: "Lage", schritt1: { frage: "A?", optionen: [L(30, "a"), L(40, "b"), L(31, "c")], loesungIndex: 0 },
      schritt2: { frage: "B?", optionen: [L(30, "a"), L(31, "b"), L(60, "c")], loesungIndex: 2 } } });
  // R2
  F.push({ name: "R2 „immer“ in richtiger Option (MUSS rot)", regel: "R2", erwartet: true, frage: mc("Was gilt?", ["Das Backup wird immer verschluesselt", "Es gibt eine Ausnahme", "Es ist optional"], 0) });
  F.push({ name: "R2 „nie“ nur im Distraktor", regel: "R2", erwartet: false, frage: mc("Was gilt?", ["Das Backup wird nie getestet", "Es wird regelmaessig getestet", "Es ist optional"], 1) });
  F.push({ name: "R2 „niedrig“ ist kein „nie“", regel: "R2", erwartet: false, frage: mc("Was gilt?", ["Das Risiko ist niedrig", "Das Risiko ist hoch", "Unbekannt"], 0) });
  F.push({ name: "R2 „Nur“ gross geschrieben am Satzanfang (MUSS rot)", regel: "R2", erwartet: true, frage: mc("Was gilt?", ["Nur der Leiter darf freigeben", "Jeder Mitarbeiter darf freigeben", "Das Team entscheidet gemeinsam"], 0) });
  F.push({ name: "R2 „keine“ in richtiger Option (MUSS rot)", regel: "R2", erwartet: true, frage: mc("Was gilt?", ["Es entstehen keine laufenden Kosten", "Es entstehen Kosten", "Unklar"], 0) });
  F.push({ name: "R2 „Allerdings“ ist kein „alle“", regel: "R2", erwartet: false, frage: mc("Was gilt?", ["Allerdings gilt eine Frist", "Es gilt keine Frist", "Unklar"], 0) });
  F.push({ name: "R2 mehrfach: absolut in einer richtigen (MUSS rot)", regel: "R2", erwartet: true,
    frage: { id: "P-2", typ: "mehrfach", frage: "Welche?", optionen: ["Daten sind stets verschluesselt", "Ein Passwort", "Eine PIN"], loesungIndizes: [0, 1] } });
  // R3
  F.push({ name: "R3 „Keine der genannten“ (MUSS rot)", regel: "R3", erwartet: true, frage: mc("Was gilt?", ["Option eins", "Option zwei", "Keine der genannten"], 2) });
  F.push({ name: "R3 „Alle genannten Antworten sind richtig“ (MUSS rot)", regel: "R3", erwartet: true, frage: mc("Was gilt?", ["Option eins", "Option zwei", "Alle genannten Antworten sind richtig"], 2) });
  F.push({ name: "R3 „Keine Zugriffsrechte“ ohne Bezugswort (Grenzfall)", regel: "R3", erwartet: false, frage: mc("Was gilt?", ["Option eins", "Option zwei", "Keine Zugriffsrechte"], 2) });
  F.push({ name: "R3 „Alle Mitarbeiter“ ist kein „alle genannten“", regel: "R3", erwartet: false, frage: mc("Was gilt?", ["Alle Mitarbeiter schulen", "Option zwei", "Option drei"], 0) });
  F.push({ name: "R3 Variante „Keine der Aussagen trifft zu“", regel: "R3", erwartet: true, frage: mc("Was gilt?", ["Option eins", "Option zwei", "Keine der Aussagen trifft zu"], 2) });
  F.push({ name: "R3 normale Optionen", regel: "R3", erwartet: false, frage: mc("Was gilt?", ["Option eins", "Option zwei", "Option drei"], 0) });
  // R4
  F.push({ name: "R4 Stammwort nur in richtiger Option (MUSS rot)", regel: "R4", erwartet: true,
    frage: mc("Wofuer dient die Firewall im Netzwerk?", ["Sie filtert den Verkehr an der Firewall", "Sie verschluesselt Datenbanken", "Sie speichert Sicherungen"], 0) });
  F.push({ name: "R4 Stammwort in allen Optionen", regel: "R4", erwartet: false,
    frage: mc("Wofuer dient die Firewall im Netzwerk?", ["Die Firewall filtert Pakete", "Die Firewall speichert Daten", "Die Firewall druckt Berichte"], 0) });
  F.push({ name: "R4 Stammwort nur in einem Distraktor", regel: "R4", erwartet: false,
    frage: mc("Wofuer dient die Firewall im Netzwerk?", ["Sie filtert den Verkehr", "Die Firewall speichert Sicherungen", "Sie verschluesselt Datenbanken"], 0) });
  F.push({ name: "R4 nur Stoppwoerter gemeinsam", regel: "R4", erwartet: false,
    frage: mc("Welche Aussage ist richtig?", ["Die Aussage stimmt nicht", "Ein Zug faehrt schnell", "Rot ist eine Farbe"], 1) });
  F.push({ name: "R4 Stammwort mit anderer Endung nur richtig (MUSS rot)", regel: "R4", erwartet: true,
    frage: mc("Was beschreibt die Datensicherung?", ["Datensicherungen werden regelmaessig geprueft", "Strom wird gespeichert", "Papier wird archiviert"], 0) });
  F.push({ name: "R4 Grossschreibung/Satzzeichen im Stamm", regel: "R4", erwartet: true,
    frage: mc("Was leistet ein „Router“, genau?", ["Ein ROUTER, der Pakete weiterleitet", "Ein Kabel", "Ein Drucker"], 0) });
  F.push({ name: "R4 leerer Stamm", regel: "R4", erwartet: false, frage: mc("", ["Eine Antwort", "Andere Antwort", "Dritte Antwort"], 0) });
  return F;
}

/** „scharf“-Teilmenge: gebaute Faelle, erwartet = Befund der Regel ist scharf. */
function probeScharf() {
  const L = (/** @type {number} */ n, /** @type {string} */ c = "x") => c.repeat(n);
  const mc = (/** @type {string} */ frage, /** @type {string[]} */ optionen, /** @type {number} */ loesungIndex) => ({ id: "P-1", typ: "mc", frage, optionen, loesungIndex });
  const mf = (/** @type {string[]} */ optionen, /** @type {number[]} */ loesungIndizes) => ({ id: "P-2", typ: "mehrfach", frage: "Welche?", optionen, loesungIndizes });
  return [
    { name: "scharf R1 Vorsprung 10 Z., 1 von 3 richtig", regel: "R1", erwartet: true, frage: mc("F?", [L(30, "a"), L(40, "b"), L(31, "c")], 1) },
    { name: "nicht scharf R1 Vorsprung nur 5 Z.", regel: "R1", erwartet: false, frage: mc("F?", [L(30, "a"), L(35, "b"), L(31, "c")], 1) },
    { name: "nicht scharf R1 mehrfach 3 von 5 richtig (60 %)", regel: "R1", erwartet: false, frage: mf([L(30, "a"), L(50, "b"), L(31, "c"), L(32, "d"), L(33, "e")], [0, 1, 2]) },
    { name: "scharf R1 mehrfach 2 von 5 richtig", regel: "R1", erwartet: true, frage: mf([L(30, "a"), L(50, "b"), L(31, "c"), L(32, "d"), L(33, "e")], [0, 1]) },
    { name: "scharf R2 nur die richtige traegt „immer“", regel: "R2", erwartet: true, frage: mc("F?", ["Wird immer geprueft", "Wird geprueft", "Entfaellt"], 0) },
    { name: "nicht scharf R2 ein Distraktor traegt „nie“ ebenfalls", regel: "R2", erwartet: false, frage: mc("F?", ["Wird immer geprueft", "Wird nie geprueft", "Entfaellt"], 0) },
    { name: "scharf R3 die Option ist die richtige", regel: "R3", erwartet: true, frage: mc("F?", ["Eins", "Zwei", "Keine der genannten"], 2) },
    { name: "nicht scharf R3 die Option ist ein Distraktor", regel: "R3", erwartet: false, frage: mc("F?", ["Eins", "Zwei", "Keine der genannten"], 0) },
    { name: "nicht scharf R4 mehrfach 3 von 5 richtig", regel: "R4", erwartet: false,
      frage: { id: "P-2", typ: "mehrfach", frage: "Wofuer dient die Firewall?", optionen: ["Firewall filtert", "Router routet", "Switch schaltet", "Kabel leitet", "Drucker druckt"], loesungIndizes: [0, 1, 2] } },
    { name: "scharf R4 mc ein Stammwort nur in der richtigen", regel: "R4", erwartet: true,
      frage: mc("Wofuer dient die Firewall?", ["Firewall filtert", "Router routet", "Switch schaltet"], 0) },
  ];
}

function probe() {
  const F = probeFaelle();
  let falsch = 0;
  const nScharf = probeScharf().length;
  probeScharf().forEach((c) => {
    const ein = einheiten(c.frage, c.frage.id, "probe");
    const b = ein.flatMap((u) => beurteile(u, MIN_STANDARD).befunde).filter((x) => x.regel === c.regel);
    const ist = b.length > 0 && b.every((x) => x.scharf);
    const ok = b.length > 0 && ist === c.erwartet;
    if (!ok) falsch++;
    console.log((ok ? "  ok     " : "  FALSCH ") + c.name + "  (erwartet " + (c.erwartet ? "scharf" : "nicht scharf") + ", " + (b.length ? (ist ? "war scharf" : "war nicht scharf") : "kein Befund") + ")");
  });
  const je = /** @type {Record<string, number>} */ ({});
  F.forEach((c) => {
    je[c.regel] = (je[c.regel] || 0) + 1;
    const ein = einheiten(c.frage, c.frage.id, "probe");
    const gefunden = ein.some((u) => beurteile(u, MIN_STANDARD).befunde.some((b) => b.regel === c.regel));
    const ok = gefunden === c.erwartet;
    if (!ok) falsch++;
    console.log((ok ? "  ok     " : "  FALSCH ") + c.name + "  (erwartet " + (c.erwartet ? "Befund" : "kein Befund") + ", war " + (gefunden ? "Befund" : "kein Befund") + ")");
  });
  // Ziehung: gleiche Eingabe + Seed => gleiche Ziehung (auch bei umgekehrter Reihenfolge); anderer Seed => andere; Grenzen
  const liste = Array.from({ length: 50 }, (_, i) => ({ id: "X" + String(i).padStart(2, "0"), beleg: "" }));
  const a = ziehe(liste, 5, 7).map((x) => x.id).join(), b = ziehe(liste.slice().reverse(), 5, 7).map((x) => x.id).join(), c2 = ziehe(liste, 5, 8).map((x) => x.id).join();
  const zOk = a === b && a !== c2 && ziehe(liste, 100, 1).length === 50 && ziehe([], 5, 1).length === 0;
  if (!zOk) falsch++;
  console.log((zOk ? "  ok     " : "  FALSCH ") + "Ziehung: fester Seed, reihenfolgeunabhaengig, mehr gewuenscht als da, leere Liste");
  for (const r of Object.keys(REGELN)) if ((je[r] || 0) < 5) { falsch++; console.log("  FALSCH Regel " + r + " hat nur " + (je[r] || 0) + " Faelle"); }
  const rot = F.filter((c) => c.erwartet).length;
  console.log("probe: " + F.length + " Faelle + " + nScharf + " scharf-Faelle (" + Object.entries(je).map(([k, v]) => k + "=" + v).join(" ") + "), davon " + rot + " mit erwartetem Befund, " + falsch + " falsch beurteilt");
  return falsch ? 1 : 0;
}

/* ------------------------------------------------------------------ Aufruf */
function main() {
  const arg = process.argv.slice(2);
  if (arg.includes("--probe")) process.exit(probe());
  const wert = (/** @type {string} */ n, /** @type {number} */ std) => { const i = arg.indexOf(n); return i >= 0 ? Number(arg[i + 1]) : std; };
  const json = arg.includes("--json"), kurz = arg.includes("--kurz");
  const minLen = wert("--min", MIN_STANDARD), nZieh = wert("--ziehe", 0), seed = wert("--seed", 1018);
  const ri = arg.indexOf("--regel"); const nurRegel = ri >= 0 ? arg[ri + 1].toUpperCase() : null;
  const pool = require(path.join(__dirname, "pool_laden.js")).laden();
  const ein = alleEinheiten(pool);
  const m = messe(ein, minLen);
  const befunde = nurRegel ? m.befunde.filter((b) => b.regel === nurRegel) : m.befunde;
  /** @type {Record<string, any[]>} */
  const gezogen = {};
  if (nZieh) for (const r of Object.keys(REGELN)) if (!nurRegel || nurRegel === r) gezogen[r] = ziehe(m.befunde.filter((b) => b.regel === r), nZieh, seed);
  const summe = (/** @type {Record<string, number>} */ o) => Object.values(o).reduce((x, y) => x + y, 0);
  const kopf = { einheiten: ein.length, min_laenge_R1: minLen, seed: nZieh ? seed : undefined,
    zaehlung_je_regel: Object.fromEntries(Object.keys(REGELN).map((r) => [r, summe(m.zaehlung[r])])),
    davon_scharf: m.scharf, zaehlung_je_regel_und_typ: m.zaehlung, je_typ: m.je };
  if (json) {
    console.log(JSON.stringify(Object.assign({}, kopf, nZieh ? { stichprobe: gezogen } : kurz ? {} : { befunde }), null, 1));
    return;
  }
  console.log("item_flaws: " + ein.length + " Auswahl-Einheiten (R1-Mindestlaenge " + minLen + ")");
  for (const r of Object.keys(REGELN)) {
    if (nurRegel && nurRegel !== r) continue;
    const z = m.zaehlung[r];
    console.log("\n" + r + " " + REGELN[/** @type {keyof typeof REGELN} */ (r)] + ": " + summe(z) + " (davon scharf " + m.scharf[r] + ")  { " + Object.entries(z).map(([t, n]) => t + " " + n).join(", ") + " }");
    if (nZieh) gezogen[r].forEach((b) => console.log("  " + b.id + " [" + b.typ + "]" + (b.scharf ? " [scharf] " : " ") + b.beleg));
    else if (!kurz) befunde.filter((b) => b.regel === r).forEach((b) => console.log("  " + b.id + " [" + b.typ + "]" + (b.scharf ? " [scharf] " : " ") + b.beleg));
  }
  console.log("\nGrundmenge und Basisrate je Typ:");
  for (const [t, z] of Object.entries(m.je)) {
    console.log("  " + t.padEnd(9) + " Einheiten " + String(z.einheiten).padStart(4) + " · R1-Grundmenge " + String(z.R1_grundmenge).padStart(4) + " (Zufallserwartung " + z.R1_zufall.toFixed(1) + ")"
      + " · falsche Optionen mit R2/R3/R4: " + z.basis.R2 + "/" + z.basis.R3 + "/" + z.basis.R4 + " von " + z.falscheOpt);
  }
}
main();
