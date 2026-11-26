#!/usr/bin/env node
/* build_schema.js – #22 (Arbeitspaket 29 Ideen, G1.1)
   Erzeugt das deklarative JSON-Schema (Draft-07) des Fragenpools: tools/schema/frage.schema.json.
   QUELLE der Wahrheit für die Feldregeln bleibt L.validateFragen in logik.js – dieses Schema ist der
   maschinenlesbare, pro-Typ-strenge Spiegel davon (für validate_schema.js/CI/Editoren).
   Analog zu fragen.js: die .json ist GENERIERT – nicht von Hand editieren, sondern hier anpassen und
   `node tools/build_schema.js` neu bauen.  Aufruf im Training-Ordner. */
"use strict";
const fs = require("fs"), path = require("path");
const OUT = path.join(__dirname, "schema", "frage.schema.json");
/* Gebiets-Codes aus der Single Source L.GEBIETE (logik.js) statt als vierte Kopie hier. */
const L = require(path.join(__dirname, "kern.js"));   // N34 T6a (E56): Rechenkern aus neu/src/kern/*.ts, nicht mehr logik.js
const GEBIET_CODES = L.GEBIETE.map(/** @param {any} g */ g => Array.isArray(g) ? g[0] : g);
if (GEBIET_CODES.length < 5) { throw new Error("L.GEBIETE liefert zu wenige Codes: " + GEBIET_CODES); }

// ---- Helfer -------------------------------------------------------------
/** @param {number} [min] */
const S = (min) => ({ type: "string", minLength: (min == null ? 1 : min) });      // nicht-leerer String
/** @param {number} minItems */
const strArr = (minItems) => ({ type: "array", minItems: minItems, items: S(1) });
/** @param {number} min @param {number} max */
const intRange = (min, max) => ({ type: "integer", minimum: min, maximum: max });
const bool = { type: "boolean" };
// N37 U3 (E60, 27.09.2026): ein oneOf-ZWEIG je Typ (typ als Konstante) statt allOf + if/then. Aus if/then
// erzeugt json-schema-to-typescript KEINE Union (gemessen: nur ein Objekttyp mit Index-Signatur); aus oneOf
// mit typ-Konstante schon. ajv prueft gleichwertig – die Zweige schliessen sich ueber `typ` gegenseitig aus.
/** @param {string} name @param {Record<string, any>} schema */
const branch = (name, schema) => Object.assign({}, schema, {
  required: ["typ"].concat(schema.required || []),
  properties: Object.assign({ typ: { const: name } }, schema.properties || {}) });
/** @param {string[]} required @param {Record<string, any>} [properties] */
const req = (required, properties) => ({ required: required, properties: properties || {} });

// ---- Gemeinsame Pflicht-/Optionalfelder (alle Fragen) -------------------
// thema: hier nur nicht-leerer String; die kanonische Enum-Liste injiziert validate_schema.js zur Laufzeit
// aus L.THEMA_RELEVANZ (Single Source), damit das Artefakt nicht mit 73 Themen driftet.
const base = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://ap1-lernprogramm/frage.schema.json",
  title: "AP1-Lernprogramm – Frage",
  type: "object",
  required: ["id", "pruefungsteil", "modul", "thema", "gebiet", "typ", "schwierigkeit", "frage", "erklaerungKurz"],
  properties: {
    id: { type: "string", pattern: "^M0[1-9]-\\d{3}$" },   // M09 = „Unser Unterricht" (2026-07-20)
    pruefungsteil: { enum: ["AP1", "AP2"] },
    modul: { type: "string", pattern: "^M0[1-9]$" },   // M09 = „Unser Unterricht" (2026-07-20)
    thema: S(1),
    /* ⚠️⚠️ 2026-07-30 NACHGETRAGEN – DER GENERATOR UND SEIN ARTEFAKT WAREN AUSEINANDERGELAUFEN.
       `gebiet` stand als required UND mit Enum in der eingecheckten frage.schema.json, aber in
       DIESER Datei kam es nicht vor. Aufgefallen erst, als das Schema nach einem neuen M09-Thema
       neu gebaut wurde: Der Neubau loeschte die Pruefung stillschweigend (14 Zeilen weniger,
       keine einzige dazu) – und `validate_schema` blieb gruen, weil es genau das pruefte, was das
       Artefakt noch sagte. Wer ein GENERIERTES Artefakt von Hand ergaenzt, verliert die Ergaenzung
       beim naechsten Lauf, ohne dass etwas rot wird.
       ►► Die Codes kommen aus L.GEBIETE (logik.js), damit es EINE Quelle bleibt. */
    gebiet: { enum: GEBIET_CODES },
    typ: { enum: ["mc", "freitext", "lueckentext", "zuordnung", "bild", "erklaeren", "mehrfach", "mtf",
      "kreuztabelle", "szenario2", "reihenfolge", "dropdown", "hotspot", "fehlersuche", "rechenassistent",
      "matrix", "beschriftung", "trace", "konsole", "kalkulation", "baukasten"] },
    schwierigkeit: { enum: [1, 2, 3, 4] },
    frage: S(1),
    erklaerungKurz: S(1),
    erklaerungLang: { type: "string" },
    verweis: { type: "string" },
    /* K3-E65 / P7 (24.11.2026, Lerner-Meldung 15): die Karteikarte zeigt den Rechner auch ausserhalb der Rechen-Typen. */
    rechner: { type: "boolean" },
    varianten: { type: "array", items: { type: "object" } }
  },
  /** @type {any[]} */ oneOf: []
};

// ---- Baustein: der "mc-artige" Antwortkern (auch für bild/unterTyp=mc) --
const mcCore = { optionen: { type: "array", minItems: 4, maxItems: 4, items: S(1) },
  loesungIndex: intRange(0, 3),
  distraktorErklaerungen: { type: "array", minItems: 4, maxItems: 4, items: { type: "string" } } };
const dropdownLuecken = { type: "array", minItems: 1, items: {
  type: "object", required: ["optionen", "loesung"],
  properties: { optionen: { type: "array", minItems: 2, items: S(1) }, loesung: { type: "integer", minimum: 0 },
    akzeptiert: { type: "array", items: S(1) } } } };

// ---- Pro-Typ-Zweige -----------------------------------------------------
base.oneOf.push(
  branch("mc", req(["optionen", "loesungIndex", "distraktorErklaerungen"], mcCore)),
  branch("mehrfach", req(["optionen", "loesungIndizes"], {
    optionen: { type: "array", minItems: 3, items: S(1) },
    loesungIndizes: { type: "array", minItems: 1, items: { type: "integer", minimum: 0 } },
    distraktorErklaerungen: { type: "array", items: { type: "string" } } })),
  branch("mtf", req(["aussagen"], { aussagen: { type: "array", minItems: 3, items: {
    type: "object", required: ["text", "wahr"], properties: { text: S(1), wahr: bool } } } })),
  branch("kreuztabelle", req(["zeilen", "spalten", "loesung"], {
    zeilen: strArr(2), spalten: strArr(2),
    loesung: { type: "array", minItems: 2, items: { type: "array", minItems: 2, items: bool } } })),
  branch("szenario2", req(["schritt1", "schritt2", "feedback1"], {
    schritt1: schrittSchema(), schritt2: schrittSchema(), feedback1: strArr(2) })),
  branch("reihenfolge", req(["schritte"], { schritte: strArr(3) })),
  branch("dropdown", req(["luecken"], { luecken: dropdownLuecken, freitext: bool })),
  branch("lueckentext", req(["luecken"], { luecken: { type: "array", minItems: 1, items: strArr(1) } })),
  /* K3-E64 (24.11.2026, Lerner-Meldung 18): `extra` = ueberzaehlige Kategorien, die zu keiner Aussage gehoeren –
     sonst ist jede 1:1-Zuordnung per Ausschluss loesbar. Optional; validate_pool prueft: keine gleicht einer Paar-Kategorie. */
  branch("zuordnung", req(["paare"], { paare: { type: "array", minItems: 3, items: {
    type: "array", minItems: 2, maxItems: 2, items: S(1) } }, extra: strArr(1) })),
  branch("hotspot", req(["svg", "zonen"], { svg: svgSchema(),
    zonen: { type: "array", minItems: 2, items: { type: "object", required: ["x", "y", "w", "h"], properties: {
      x: { type: "number" }, y: { type: "number" }, w: { type: "number" }, h: { type: "number" },
      richtig: bool, label: { type: "string" } } } } })),
  branch("fehlersuche", req(["zeilen", "fehlerZeile"], {
    zeilen: { type: "array", minItems: 2, items: { type: "string" } }, fehlerZeile: { type: "integer", minimum: 0 } })),
  /* #35 (G2.6): rechenassistent kennt ZWEI Bauformen.
     (a) klassisch  – je Schritt eine hinterlegte "loesung" (feste Zahlenvarianten),
     (b) randomisiert – Frage traegt "variablen" {min,max,schritt}, je Schritt eine "formel";
         die Musterloesung wird zur Laufzeit BERECHNET (L.rechneAufgabe), optional mit
         abweichender Rundung ("dezimalen"). Genau eine der beiden Formen muss zutreffen. */
  branch("rechenassistent", Object.assign(
    req(["schritte"], { schritte: { type: "array", minItems: 2, items: {
        type: "object", required: ["text"], properties: { text: S(1),
          loesung: { type: "array", minItems: 1 },
          formel: S(1),
          dezimalen: intRange(0, 6) } } },
      variablen: { type: "object", minProperties: 1, additionalProperties: {
        type: "object", required: ["min", "max"], properties: {
          min: { type: "number" }, max: { type: "number" }, schritt: { type: "number", exclusiveMinimum: 0 } },
        additionalProperties: false } } }),
    /* Genau eine der beiden Bauformen – oneOf gehoert NEBEN "properties", nicht hinein. */
    { oneOf: [
      { required: ["variablen"],
        properties: { schritte: { type: "array", items: { required: ["formel"] } } } },
      { not: { required: ["variablen"] },
        properties: { schritte: { type: "array", items: { required: ["loesung"] } } } }
    ] })),
  branch("matrix", req(["quadranten", "elemente"], {
    quadranten: { type: "array", minItems: 4, maxItems: 4, items: S(1) },
    elemente: { type: "array", minItems: 2, items: { type: "object", required: ["text", "quadrant"],
      properties: { text: S(1), quadrant: intRange(0, 3) } } },
    xAchse: { type: "string" }, yAchse: { type: "string" } })),
  branch("beschriftung", req(["svg", "ziele", "labels"], { svg: svgSchema(),
    ziele: { type: "array", minItems: 2, items: { type: "object", required: ["loesung"], properties: { loesung: S(1) } } },
    labels: strArr(2) })),
  branch("trace", req(["code", "spalten", "zeilen"], {
    code: { type: "array", minItems: 1, items: { type: "string" } }, spalten: strArr(1),
    zeilen: { type: "array", minItems: 1, items: { type: "array" } } })),
  branch("konsole", req(["aufgaben"], { aufgaben: { type: "array", minItems: 1, items: {
    type: "object", required: ["prompt", "akzeptiert"], properties: { prompt: S(1),
      akzeptiert: { type: "array", minItems: 1, items: S(1) } } } } })),
  branch("kalkulation", req(["kopf", "zeilen"], {
    kopf: { type: "array", minItems: 1 }, zeilen: { type: "array", minItems: 1, items: { type: "array", minItems: 1 } } })),
  branch("baukasten", req(["geruest", "ziele", "bausteine"], {
    geruest: { type: "array", minItems: 1, items: { type: "string" } },
    ziele: { type: "array", minItems: 2, items: { type: "object", required: ["loesung"], properties: { loesung: S(1) } } },
    bausteine: strArr(2) })),
  branch("freitext", req(["musterloesung"], { musterloesung: S(1), schluesselbegriffe: schluesselSchema() })),
  branch("erklaeren", req(["musterloesung"], { musterloesung: S(1), schluesselbegriffe: schluesselSchema() })),
  // bild: svg + unterTyp; je unterTyp ein eigener Zweig (N37 U3: statt verschachteltem if/then)
  branch("bild", req(["svg", "unterTyp", "optionen", "loesungIndex"],
    Object.assign({ svg: svgSchema(), unterTyp: { const: "mc" } }, mcCore))),
  branch("bild", req(["svg", "unterTyp", "luecken"],
    { svg: svgSchema(), unterTyp: { const: "dropdown" }, luecken: dropdownLuecken })),
  branch("bild", req(["svg", "unterTyp", "luecken"],
    { svg: svgSchema(), unterTyp: { const: "lueckentext" }, luecken: { type: "array", minItems: 1, items: strArr(1) } }))
);

function schrittSchema() {
  return { type: "object", required: ["frage", "optionen", "loesungIndex"], properties: {
    frage: S(1), optionen: { type: "array", minItems: 2, items: S(1) }, loesungIndex: { type: "integer", minimum: 0 } } };
}
function svgSchema() { return { type: "string", pattern: "<svg" }; }
function schluesselSchema() {
  // Ein Eintrag ist ENTWEDER ein Begriff ODER eine Liste gleichwertiger Alternativen (2026-07-20),
  // z. B. ["Puffer","Spielraum","Reserve"] – gilt als EIN Begriff, sobald eine Alternative trifft.
  const eintrag = { anyOf: [S(1), { type: "array", minItems: 2, items: S(1) }] };
  return { type: "object", required: ["pflicht"], properties: {
    pflicht: { type: "array", minItems: 1, items: eintrag }, kuer: { type: "array", items: eintrag } } };
}

/* ---- N37 U3 (E60, 27.09.2026): EINE QUELLE – die TS-Typen werden aus DIESEM Schema erzeugt ----------------
   Ziel `neu/src/daten/frage.generiert.ts` (json-schema-to-typescript, devDependency von neu/). `--pruefe` schreibt
   nichts und endet mit 1, wenn Schema ODER Typen nicht dem Stand dieser Datei entsprechen (check.sh). */
const TS_OUT = path.join(__dirname, "..", "neu", "src", "daten", "frage.generiert.ts");
const PRUEFE = process.argv.includes("--pruefe");
const schemaText = JSON.stringify(base, null, 2) + "\n";
const { compile } = require(path.join(__dirname, "..", "neu", "node_modules", "json-schema-to-typescript"));
/** @type {Record<string, any>} */ const fuerTypen = Object.assign({}, base); delete fuerTypen.title; delete fuerTypen.$id; delete fuerTypen.$schema;
compile(fuerTypen, "FrageRoh", { bannerComment: "", additionalProperties: false, ignoreMinAndMaxItems: true, format: false })
  .then(/** @param {string} ts */ function (ts) {
    const tsText = "/* ERZEUGT von tools/build_schema.js aus tools/schema/frage.schema.json (N37 U3, E60).\n" +
      "   NICHT von Hand aendern – dort aendern und `node tools/build_schema.js` laufen lassen; check.sh prueft es. */\n" +
      "/* oxlint-disable */\n" + ts.split("\r\n").join("\n");
    const lies = /** @param {string} p */ function (p) { try { return fs.readFileSync(p, "utf8"); } catch (e) { return null; } };
    if (PRUEFE) {
      const ok = [lies(OUT) === schemaText, lies(TS_OUT) === tsText];
      if (ok[0] && ok[1]) { console.log("Schema + Typen aktuell (" + base.oneOf.length + " Typ-Zweige)"); return; }
      console.log("VERALTET: " + (ok[0] ? "" : "frage.schema.json ") + (ok[1] ? "" : "frage.generiert.ts") + " – node tools/build_schema.js");
      process.exit(1);
    }
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, schemaText);
    fs.writeFileSync(TS_OUT, tsText);
    console.log("Schema gebaut: " + path.relative(process.cwd(), OUT) + " (" + base.oneOf.length + " Typ-Zweige) + " + path.relative(process.cwd(), TS_OUT));
  })
  .catch(/** @param {Error} e */ function (e) { console.error("FEHLER beim Erzeugen der Typen: " + e.message); process.exit(2); });
