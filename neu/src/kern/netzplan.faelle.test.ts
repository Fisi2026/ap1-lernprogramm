/* N43 M3 Rest (17.10.2026): gebaute Grenzfaelle fuer `netzplan.ts` – leere Eingabe, „alles richtig“ nur bei
   vollem Treffer, Anordnung nach dem LAENGSTEN Weg, unbekannter Vorgaenger, Zyklus haelt an. */
import { describe, expect, it } from "vitest";

import { anordnung, normZahl, pruefe, type NetzplanDaten } from "./netzplan.ts";

const daten = (vs: [string, string[]][]): NetzplanDaten => ({
  vorgaenge: vs.map(([id, vorgaenger]) => ({ id, name: id, dauer: 1, vorgaenger, nachfolger: [], faz: 0, fez: 1, saz: 0, sez: 1, gp: 0, fp: 0 })),
  projektdauer: 1, kritisch: [],
});

describe("normZahl und pruefe", () => {
  it("keine Eingabe ist der leere Text", () => {
    expect(normZahl(undefined)).toBe("");
  });
  it("alleOk nur, wenn es Felder gibt und jedes stimmt", () => {
    expect(pruefe(daten([]), {})).toEqual({ richtig: 0, gesamt: 0, quote: 0, alleOk: false });
    const d = daten([["A", []]]);
    const voll = { A: { faz: "0", fez: "1", saz: "0", sez: "1", gp: "0" } };
    expect(pruefe(d, voll).alleOk).toBe(true);
    expect(pruefe(d, { A: { ...voll.A, gp: "2" } })).toEqual({ richtig: 4, gesamt: 5, quote: 80, alleOk: false });
  });
});

describe("anordnung", () => {
  const spalten = (d: NetzplanDaten) => Object.fromEntries(anordnung(d).map((p) => [p.id, p.spalte]));
  it("die Spalte ist der laengste Weg von vorn, nicht der kuerzeste", () => {
    expect(spalten(daten([["A", []], ["B", ["A"]], ["C", ["B"]], ["D", ["A", "C"]]]))).toEqual({ A: 0, B: 1, C: 2, D: 3 });
  });
  it("ein unbekannter Vorgaenger zaehlt als Start", () => {
    expect(spalten(daten([["A", ["X"]]]))).toEqual({ A: 1 });
  });
  it("ein Zyklus (am Typ vorbei) haelt an der Schranke an, statt endlos zu laufen", () => {
    expect(() => anordnung(daten([["A", ["B"]], ["B", ["A"]]]))).not.toThrow();
    expect(() => anordnung(daten([["A", ["B"]], ["B", ["C"]], ["C", ["A"]]]))).not.toThrow();
  });
});
