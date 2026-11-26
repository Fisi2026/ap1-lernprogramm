#!/usr/bin/env node
/* validate_schema.js – #22 (Arbeitspaket 29 Ideen, G1.1)
   Deklarative Zusatzprüfung: validiert den Pool (pool/*.json ueber tools/pool_laden.js) gegen tools/schema/frage.schema.json
   (Draft-07, pro Typ streng) mit ajv. Ergänzt L.validateFragen/validate_pool.js um eine unabhängige,
   maschinenlesbare Schicht (Defense in Depth). thema-Enum wird zur Laufzeit aus L.THEMA_RELEVANZ injiziert
   (Single Source). varianten werden – wie in L.validateFragen – gemergt mitgeprüft.
   Aufruf im Training-Ordner:  node tools/validate_schema.js   (Exit 1 bei Verstößen). */
"use strict";
const fs = require("fs"), path = require("path");
const BASIS = path.join(__dirname, "..");   // N34 T6a: nicht mehr an logik.js festgemacht (faellt mit T6c weg)

// ajv aus persistenter .tooling (mit /tmp-Fallbacks wie jsdom in check.sh).
// NODE_PATH wird zusätzlich ausgewertet: in check.sh ist es an dieser Stelle noch NICHT exportiert,
// aber wer das Werkzeug direkt aufruft, hat es evtl. gesetzt.
function ladeAjv() {
  const ausNodePath = (process.env.NODE_PATH || "").split(path.delimiter)
    .filter(Boolean).map(p => path.join(p, "ajv"));
  const kandidaten = [path.join(BASIS, ".tooling", "node_modules", "ajv"),
    ...ausNodePath,
    "/tmp/node_modules/ajv", "/tmp/jt/node_modules/ajv", "ajv"];
  for (const k of kandidaten) { try { return require(k); } catch (e) { /* weiter */ } }
  console.error("FEHLER: ajv nicht gefunden. Einmalig: npm install ajv --prefix .tooling");
  process.exit(2);
}
const Ajv = ladeAjv();
const L = require(path.join(__dirname, "kern.js"));   // N34 T6a (E56): Rechenkern aus neu/src/kern/*.ts, nicht mehr logik.js
const F = require(path.join(__dirname, "pool_laden.js")).laden().fragen;  // N29 Teil 2 (E40)
const schema = JSON.parse(fs.readFileSync(path.join(__dirname, "schema", "frage.schema.json"), "utf8"));

// thema-Enum aus der Single Source injizieren (Artefakt bleibt driftfrei).
// Zwei Varianten: M01–M08 gegen L.THEMA_RELEVANZ, M09 „Unser Unterricht" gegen L.M09_THEMEN.
// Bewusst NICHT die Vereinigung – sonst dürfte eine M03-Frage ein Unterrichts-Thema tragen und
// die Modultrennung wäre auf Schema-Ebene nicht mehr prüfbar.
// $id muss je Kompilat eindeutig sein, sonst lehnt ajv das zweite Schema ab.
const mitThemen = (/** @type {any} */ suffix, /** @type {any} */ liste) => Object.assign({}, schema, {
  $id: schema.$id + "#" + suffix,
  properties: Object.assign({}, schema.properties, { thema: { type: "string", enum: liste } })
});

const ajv = new Ajv({ allErrors: true, strict: false });
const validateAP = ajv.compile(mitThemen("ap", Object.keys(L.THEMA_RELEVANZ)));
const validateM09 = ajv.compile(mitThemen("m09", L.M09_THEMEN.slice()));
// Wrapper mit .errors, damit die Auswertung unten unverändert bleibt (ajv hängt errors an die
// jeweils aufgerufene Funktion – die muss hier durchgereicht werden).
/** @type {{ (obj: any): any, errors?: any }} */
const validate = function (/** @type {any} */ obj) {
  const v = (obj && obj.modul === "M09") ? validateM09 : validateAP;
  const ok = v(obj);
  validate.errors = v.errors;
  return ok;
};

// varianten wie in L.validateFragen expandieren (Basis + Variante gemergt).
// Die gemergte Variante behält die Basis-ID (Schema prüft keine Eindeutigkeit; die reale Pipeline
// prüft das ID-Pattern ohnehin nur auf Basisfragen in validate_pool.js). Varianten-Info nur fürs Reporting.
/** @type {{ obj: any, label: string }[]} */
const alle = [];
F.forEach(function (/** @type {any} */ f) {
  alle.push({ obj: f, label: f.id });
  if (Array.isArray(f.varianten)) f.varianten.forEach(function (/** @type {any} */ v, /** @type {any} */ vi) {
    const merged = Object.assign({}, f, v);
    delete merged.varianten;
    alle.push({ obj: merged, label: f.id + " (Variante " + vi + ")" });
  });
});

let fehler = 0;
alle.forEach(function (eintrag) {
  if (!validate(eintrag.obj)) {
    fehler++;
    const msg = (validate.errors || []).map(function (/** @type {any} */ e) {
      return (e.instancePath || "/") + " " + e.message; }).join(" · ");
    console.log("FEHLER " + eintrag.label + ": " + msg);
  }
});

console.log("---");
console.log(alle.length + " Objekte (inkl. Varianten) gegen frage.schema.json geprüft.");
console.log(fehler ? fehler + " SCHEMA-VERSTOSS/VERSTÖSSE" : "OK – Pool schema-valide");
process.exit(fehler ? 1 : 0);
