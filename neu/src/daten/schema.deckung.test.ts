/* ============================================================================
   N37 U3 (E60, 27.09.2026): DECKUNG SCHEMA ↔ `validateFragen`
   Das JSON-Schema (`tools/schema/frage.schema.json`, Quelle der TS-Typen in `frage.generiert.ts`) und die
   Laufzeitpruefung `kern/validierung.ts` beschreiben dieselbe Frage – aber NICHT gleich (gemessen 27.09.):
   * nur der KERN lehnt ab: Regeln UEBER Felder hinweg (Luecken im Fragetext zaehlen, Matrix zeilen×spalten,
     Formeln rechenbar, Platzhalter aufloesbar, loesungIndizes < optionen …) – das kann ein Schema nicht;
   * nur das SCHEMA lehnt ab: Muster/Enums der Grundfelder (id, modul, thema, gebiet) und die Typen einiger
     optionaler Felder – `validateFragen` prueft sie nicht (wortgleich zur alten App, E50).
   ⛔ Dieser Test haelt die Abweichung als GENAUE MENGE fest (typ.feld). Eine neue Abweichung – eine Seite
      geaendert, die andere nicht – macht ihn rot. Gewollt ist sie erst mit Eintrag hier (und Grund im BUILD_LOG).
   ⛔ Stichprobe: je Typ die ersten 12 Poolfragen × alle verdorbenen Fassungen (`testhilfe/verderben.ts`),
      Math.random je Fassung geseedet (die Formelprobe wuerfelt).
   ============================================================================ */
import { it, expect, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import { FRAGEN } from "@/daten/laden";
import { validateFragen } from "@/kern/validierung";
import { THEMA_RELEVANZ, M09_THEMEN } from "@/kern/tabellen/gebiete.ts";
import { varianten, type Q } from "@/testhilfe/verderben";

const hier = path.dirname(fileURLToPath(import.meta.url));
const schema = JSON.parse(fs.readFileSync(path.resolve(hier, "../../../tools/schema/frage.schema.json"), "utf8"));
const mit = (s: string, l: string[]) => ({ ...schema, $id: schema.$id + "#" + s, properties: { ...schema.properties, thema: { type: "string", enum: l } } });
const ajv = new Ajv({ allErrors: true, strict: false });
const vAP = ajv.compile(mit("ap", Object.keys(THEMA_RELEVANZ)));
const vM9 = ajv.compile(mit("m9", [...M09_THEMEN]));
const schemaOk = (q: Q) => ((q.modul === "M09" ? vM9 : vAP)(q) as boolean);
function seed(s: number): () => number {
  let a = s >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function kernFehler(q: Q, s: number): string {
  const spion = vi.spyOn(Math, "random").mockImplementation(seed(s));
  try { return validateFragen([q]).fehler[0]?.meldung ?? ""; } catch (e) { return "WIRFT " + (e as Error).message; } finally { spion.mockRestore(); }
}

/** Wie verdorben: `weg`, einer der festen Schlechtwerte (`null`, `""`, `0`, `-1`, `[]`, `{}`, `"x"`, `true`) oder
    die Art des Werts (`liste`/`objekt`/`zahl`/`text`). Erst diese Feinheit macht die Menge scharf: ein Schema,
    das `gebiet` nur noch als Pflicht, nicht mehr als Enum prueft, verliert `*.gebiet:"x"`, nicht `*.gebiet:weg`. */
/** Grundfelder, die bei JEDEM Typ gleich geprueft werden – in der Menge als `*.` zusammengefasst. */
const GRUND = ["erklaerungLang", "gebiet", "id", "modul", "thema", "verweis", "rechner"];   // rechner: K3-E65 / P7, 24.11.2026

function wertArt(w: unknown): string {
  if (w === undefined) return "weg";
  const j = JSON.stringify(w);
  if (["null", '""', "0", "-1", "[]", "{}", '"x"', "true"].includes(j)) return j;
  return Array.isArray(w) ? "liste" : w !== null && typeof w === "object" ? "objekt" : typeof w === "number" ? "zahl" : "text";
}
/** Nur das SCHEMA lehnt ab (`*.` = bei jedem Typ; Feld:Art der Verderbnis). Gemessen 27.09.2026. */
const NUR_SCHEMA = [
  "*.erklaerungLang:-1", "*.erklaerungLang:0", "*.erklaerungLang:[]", "*.erklaerungLang:null",
  "*.erklaerungLang:true", "*.erklaerungLang:{}", "*.gebiet:\"\"", "*.gebiet:\"x\"", "*.gebiet:-1", "*.gebiet:0",
  "*.gebiet:[]", "*.gebiet:null", "*.gebiet:true", "*.gebiet:weg", "*.gebiet:{}", "*.id:\"x\"", "*.modul:text",
  "*.thema:\"x\"", "*.verweis:-1", "*.verweis:0", "*.verweis:[]", "*.verweis:null", "*.verweis:true", "*.verweis:{}",
  "bild.distraktorErklaerungen:\"\"", "bild.distraktorErklaerungen:\"x\"", "bild.distraktorErklaerungen:-1",
  "bild.distraktorErklaerungen:0", "bild.distraktorErklaerungen:[]", "bild.distraktorErklaerungen:liste",
  "bild.distraktorErklaerungen:null", "bild.distraktorErklaerungen:true", "bild.distraktorErklaerungen:{}",
  "bild.luecken:\"\"", "bild.luecken:\"x\"", "bild.luecken:-1", "bild.luecken:0", "bild.luecken:[]",
  "bild.luecken:liste", "bild.luecken:null", "bild.luecken:true", "bild.luecken:weg", "bild.luecken:{}",
  "dropdown.freitext:null", "dropdown.luecken:liste", "erklaeren.schluesselbegriffe:null",
  "erklaeren.schluesselbegriffe:objekt", "freitext.schluesselbegriffe:null", "freitext.schluesselbegriffe:objekt",
  "hotspot.zonen:liste", "matrix.xAchse:-1", "matrix.xAchse:0", "matrix.xAchse:[]", "matrix.xAchse:null",
  "matrix.xAchse:true", "matrix.xAchse:{}", "matrix.yAchse:-1", "matrix.yAchse:0", "matrix.yAchse:[]",
  "matrix.yAchse:null", "matrix.yAchse:true", "matrix.yAchse:{}", "mc.distraktorErklaerungen:liste",
  "mehrfach.distraktorErklaerungen:\"\"", "mehrfach.distraktorErklaerungen:\"x\"",
  "mehrfach.distraktorErklaerungen:-1", "mehrfach.distraktorErklaerungen:0", "mehrfach.distraktorErklaerungen:liste",
  "mehrfach.distraktorErklaerungen:null", "mehrfach.distraktorErklaerungen:true",
  "mehrfach.distraktorErklaerungen:{}", "rechenassistent.varianten:\"\"", "rechenassistent.varianten:\"x\"",
  "rechenassistent.varianten:-1", "rechenassistent.varianten:0", "rechenassistent.varianten:liste",
  "rechenassistent.varianten:null", "rechenassistent.varianten:true", "rechenassistent.varianten:{}",
  /* K3-E64 (24.11.2026, BUILD_LOG 240): `zuordnung.extra` ist optional und wird wie die uebrigen optionalen Felder nur
     vom Schema geprueft; die Querregel (keine Zusatzantwort = Paar-Kategorie) steht in tools/validate_pool.js. */
  "zuordnung.extra:\"\"", "zuordnung.extra:\"x\"", "zuordnung.extra:-1", "zuordnung.extra:0", "zuordnung.extra:[]",
  "zuordnung.extra:liste", "zuordnung.extra:null", "zuordnung.extra:true", "zuordnung.extra:{}",
  /* K3-E65 / P7 (24.11.2026, BUILD_LOG 246): `rechner` (optional, jeder Typ) prueft nur das Schema – die Karteikarte liest nur `=== true`. */
  "*.rechner:\"\"", "*.rechner:\"x\"", "*.rechner:-1", "*.rechner:0", "*.rechner:[]", "*.rechner:null", "*.rechner:{}",
];

/** Nur der KERN lehnt ab – Regeln ueber Felder hinweg (typ.feld:Art | Feld der Meldung). Gemessen 27.09.2026. */
const NUR_KERN = [
  "baukasten.bausteine:liste | bausteine", "beschriftung.labels:liste | labels", "beschriftung.ziele:liste | labels",
  "bild.frage:\"x\" | frage (Lücken)", "bild.luecken:liste | frage (Lücken)",
  "dropdown.frage:\"x\" | frage (Dropdown-Lücken)", "dropdown.luecken:liste | frage (Dropdown-Lücken)",
  "dropdown.luecken:liste | luecken", "fehlersuche.zeilen:liste | fehlerZeile", "hotspot.zonen:liste | zonen",
  "kalkulation.kopf:liste | zeilen", "kalkulation.zeilen:liste | min. eine Lösungszelle",
  "kalkulation.zeilen:liste | zeilen", "kreuztabelle.loesung:liste | loesung (Matrix zeilen×spalten, bool)",
  "kreuztabelle.spalten:liste | loesung (Matrix zeilen×spalten, bool)",
  "kreuztabelle.zeilen:liste | loesung (Matrix zeilen×spalten, bool)", "lueckentext.frage:\"x\" | frage (Lücken)",
  "lueckentext.luecken:liste | frage (Lücken)", "mehrfach.optionen:liste | loesungIndizes",
  "rechenassistent.schritte:liste | formeln rechenbar (Formel: unbekannte Variable ",
  "rechenassistent.schritte:liste | platzhalter aufloesbar ({sN|N})",
  "rechenassistent.schritte:liste | platzhalter aufloesbar ({sN|N},{sN|N})",
  "rechenassistent.schritte:liste | platzhalter aufloesbar ({sN})",
  "rechenassistent.schritte:liste | platzhalter aufloesbar ({sN},{sN|N})",
  "rechenassistent.schritte:liste | platzhalter aufloesbar ({sN},{sN})",
  "rechenassistent.variablen:objekt | formeln rechenbar (Formel: unbekannte Variable ",
  "rechenassistent.variablen:objekt | variablen (min<=max, schritt>N)",
  "rechenassistent.varianten:liste | erklaerungKurz", "rechenassistent.varianten:liste | frage",
  "rechenassistent.varianten:liste | schritte", "szenario2.feedback1:liste | feedbackN (je Schritt-N-Option)",
  "trace.spalten:liste | zeilen", "trace.zeilen:liste | zeilen",
];

it("der ganze Pool ist fuer BEIDE gueltig", () => {
  const alle = FRAGEN as unknown as Q[];
  expect(alle.length).toBeGreaterThan(1000);
  expect(alle.filter((f) => !schemaOk(f)).map((f) => f.id)).toEqual([]);
  expect(validateFragen(alle).fehler).toEqual([]);
});

it("Schema und Kern weichen GENAU in den bekannten Faellen ab – nicht mehr, nicht weniger", () => {
  const jeTyp = new Map<string, Q[]>();
  for (const f of FRAGEN as unknown as Q[]) { const l = jeTyp.get(String(f.typ)) ?? []; if (l.length < 12) l.push(f); jeTyp.set(String(f.typ), l); }
  expect(jeTyp.size).toBeGreaterThan(18);
  const nurSchema = new Set<string>(); const nurKern = new Set<string>(); let n = 0; let s = 0;
  for (const l of jeTyp.values()) for (const f of l) for (const v0 of varianten(f)) {
    const v: Q = { ...v0, id: typeof v0.id === "string" ? v0.id.split("~")[0] : v0.id };
    n++; s++;
    const diff = [...new Set([...Object.keys(f), ...Object.keys(v)])]
      .filter((x) => x !== "id" && JSON.stringify(f[x]) !== JSON.stringify(v[x])).join("+") || "id";
    const a = schemaOk(v); const fehl = kernFehler(v, s); const b = fehl === "";
    const art = diff.includes("+") ? "" : ":" + wertArt(v[diff]);
    if (!a && b) nurSchema.add((GRUND.includes(diff) ? "*." : String(f.typ) + ".") + diff + art);
    if (a && !b) nurKern.add(String(f.typ) + "." + diff + art + " | " + (fehl.match(/Feld .([^']+)./)?.[1] ?? fehl).replace(/[0-9]+/g, "N"));
  }
  expect(n).toBeGreaterThan(20000);
  if (process.env.DECKUNG_AUSGABE) fs.writeFileSync(process.env.DECKUNG_AUSGABE, JSON.stringify({ nurSchema: [...nurSchema].sort(), nurKern: [...nurKern].sort() }, null, 1));
  expect([...nurSchema].sort()).toEqual([...NUR_SCHEMA].sort());
  expect([...nurKern].sort()).toEqual([...NUR_KERN].sort());
});
