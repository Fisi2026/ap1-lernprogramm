/* ============================================================================
   N20a: GLEICHHEITSBEWEIS FUER LESEZEICHEN UND MELDUNGEN

   ⛔ `app_util.js`, `app_pool.js`, `app_frage.js` und `app_seiten.js` werden in
      einer node:vm WIRKLICH AUSGEFUEHRT (Muster: auswahl.gleichheit.test.ts).
      Verglichen werden: die Modulnamen, `MELDE_GRUENDE`, `markierteIds` ueber
      alle Kombinationen, und das EXPORTFORMAT `meldungenText`/`meldungenJSON`
      Zeichen fuer Zeichen.
   ⚠️ Jeder Vergleich prueft vorher, dass die alte Funktion WIRKLICH geladen ist
      und etwas Nichtleeres liefert — „beide leer" ist keine Gleichheit.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { FRAGEN } from "@/daten/laden";
import type { Frage } from "@/daten/typen";
import { leererStand } from "./stand";
import type { Lernstand } from "./stand";
import {
  MELDE_GRUENDE, MODUL_NAMEN, modulName, markierteIds, meldungenText, meldungenJSON,
  schalteMarkierung, setzeMeldung, entferneMeldung, verwaisteMarkierungen,
} from "./markiert";
import { altQuelle } from "../testhilfe/altquelle";

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, "../../..");
const requireCjs = createRequire(import.meta.url);
const Lroh = requireCjs(altQuelle(WURZEL, "logik.js"));

const POOL_INDEX: Record<string, Frage> = {};
for (const f of FRAGEN) POOL_INDEX[f.id] = f;
const nachId = (id: string) => POOL_INDEX[id];

function alteApp() {
  const leer = () => ({ style: {}, setAttribute: () => {}, appendChild: () => {}, classList: { add: () => {} } });
  const sandbox: Record<string, unknown> = {
    console, L: Lroh, POOL: FRAGEN, POOL_INDEX, S: leererStand(),
    document: {
      addEventListener: () => {}, getElementById: () => null, querySelector: () => null,
      querySelectorAll: () => [], createElement: leer,
    },
    window: { addEventListener: () => {} },
    setTimeout, clearTimeout,
  };
  vm.createContext(sandbox);
  for (const datei of ["app_util.js", "app_pool.js", "app_frage.js", "app_seiten.js"]) {
    try {
      vm.runInContext(fs.readFileSync(altQuelle(WURZEL, datei), "utf8"), sandbox, { filename: datei });
    } catch { /* Oberflaechen-Zeilen am Dateiende; Deklarationen sind gehoben – unten geprueft */ }
  }
  sandbox.POOL = FRAGEN;
  sandbox.POOL_INDEX = POOL_INDEX;
  return sandbox as Record<string, any>;
}
const ALT = alteApp();

function mitStand(s: Lernstand) { ALT.S = JSON.parse(JSON.stringify(s)); }

const einAP1 = FRAGEN.find((f) => f.pruefungsteil !== "AP2" && f.modul !== "M09")!;
const einAP2 = FRAGEN.find((f) => f.pruefungsteil === "AP2")!;
const einM09 = FRAGEN.find((f) => f.modul === "M09");
const mitLeerraum = FRAGEN.find((f) => /\s{2,}|\n/.test(f.frage))!;

describe("Die alte App ist wirklich geladen", () => {
  it("alle verglichenen Funktionen und Listen existieren", () => {
    for (const n of ["markierteIds", "meldungenText", "meldungenJSON", "modulName", "passtAP"]) {
      expect(typeof ALT[n], n).toBe("function");
    }
    expect(Array.isArray(ALT.MODULE) && ALT.MODULE.length).toBe(8);
    expect(Array.isArray(ALT.MELDE_GRUENDE)).toBe(true);
    expect(einAP1 && einAP2 && mitLeerraum, "Bestand liefert die Testfaelle nicht").toBeTruthy();
  });
});

describe("Listen", () => {
  it("Modulnamen gleich (MODULE aus app_pool.js)", () => {
    expect(Object.fromEntries(ALT.MODULE)).toEqual(MODUL_NAMEN);
    for (const m of ["M01", "M04", "M08", "M09", "MXX"]) expect(modulName(m), m).toBe(ALT.modulName(m));
  });
  it("Meldegruende gleich, in derselben Reihenfolge", () => {
    expect([...MELDE_GRUENDE]).toEqual(ALT.MELDE_GRUENDE);
  });
});

describe("markierteIds ueber alle Kombinationen", () => {
  const ids = [einAP1.id, einAP2.id, ...(einM09 ? [einM09.id] : []), "GIBT-ES-NICHT"];
  for (const inklAP2 of [false, true]) {
    it(`inklAP2=${inklAP2}`, () => {
      const s = { ...leererStand(), inklAP2, markiert: Object.fromEntries(ids.map((i) => [i, 1])) } as Lernstand;
      mitStand(s);
      const alt = ALT.markierteIds();
      expect(alt.length, "alte Funktion liefert nichts").toBeGreaterThan(0);
      expect(markierteIds(s, nachId)).toEqual(alt);
    });
  }
  it("AP2 fehlt ohne inklAP2, erscheint mit — der Test erreicht beide Zweige", () => {
    const s = { ...leererStand(), markiert: { [einAP2.id]: 1 } } as Lernstand;
    expect(markierteIds(s, nachId)).toEqual([]);
    expect(markierteIds({ ...s, inklAP2: true } as Lernstand, nachId)).toEqual([einAP2.id]);
  });
  it("eine Kennung ohne Frage wird nicht gezeigt, aber als verwaist gemeldet", () => {
    const s = { ...leererStand(), markiert: { "GIBT-ES-NICHT": 1, [einAP1.id]: 1 } } as Lernstand;
    expect(markierteIds(s, nachId)).toEqual([einAP1.id]);
    expect(verwaisteMarkierungen(s, nachId)).toEqual(["GIBT-ES-NICHT"]);
  });
});

describe("Exportformat der Meldungen", () => {
  it("meldungenText und meldungenJSON Zeichen fuer Zeichen", () => {
    let s = leererStand() as Lernstand;
    s = setzeMeldung(s, einAP1.id, "Tippfehler", "  steht doppelt  ", 1789600000000);
    s = setzeMeldung(s, mitLeerraum.id, "", "", 1789610000000);
    s = { ...s, meldungen: { ...(s.meldungen as object), "WEG-001": { grund: "", datum: 1789620000000 } } };
    mitStand(s);
    const alt = ALT.meldungenText();
    expect(alt.length).toBeGreaterThan(100);
    expect(meldungenText(s, nachId)).toBe(alt);
    expect(meldungenJSON(s)).toBe(ALT.meldungenJSON());
    /* die drei Sonderfaelle sind wirklich drin */
    expect(alt).toContain("Grund: Sonstiges");
    expect(alt).toContain("(nicht im Pool)");
    expect(alt).toContain("Details: steht doppelt");
  });
});

describe("Die Schreibregeln (wie die Klick-Handler der alten App)", () => {
  it("Stern: an → 1, aus → Schluessel weg; andere bleiben", () => {
    const s0 = { ...leererStand(), markiert: { X: 1 } } as Lernstand;
    const s1 = schalteMarkierung(s0, "Y");
    expect(s1.markiert).toEqual({ X: 1, Y: 1 });
    expect(schalteMarkierung(s1, "Y").markiert).toEqual({ X: 1 });
    expect(s0.markiert).toEqual({ X: 1 });   // nicht veraendert
  });
  it("Meldung: Grund leer → Sonstiges, Text getrimmt, Entfernen loescht nur diese", () => {
    let s = setzeMeldung(leererStand() as Lernstand, "A", "", "  x ", 5);
    s = setzeMeldung(s, "B", "Veraltet", "", 6);
    expect(s.meldungen).toEqual({ A: { grund: "Sonstiges", text: "x", datum: 5 }, B: { grund: "Veraltet", text: "", datum: 6 } });
    expect(entferneMeldung(s, "A").meldungen).toEqual({ B: { grund: "Veraltet", text: "", datum: 6 } });
  });
});
