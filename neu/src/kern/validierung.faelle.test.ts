/* N44 C1 (18.10.2026): gebaute Grenzfaelle je Regel in `validierung.ts` – die Gleichheit gegen `referenz/logik.js`
   (`validierung.gleichheit.test.ts`) verdirbt Pool-Fragen nur eine Ebene tief und trifft nicht jede Grenze;
   Stryker liess nach dem Umbau zur Pruefliste 62 Mutanten ueberleben (vorher ebenso). Je Fall: die gueltige
   Grundfrage besteht, die gezielt verdorbene faellt mit GENAU der erwarteten Meldung. */
import { describe, expect, it } from "vitest";

import { validateFragen } from "./validierung.ts";

type Q = Record<string, unknown>;
const KOPF = { pruefungsteil: "AP1", modul: "M03", thema: "T", schwierigkeit: 2, erklaerungKurz: "k" };
const meldungen = (q: Q): string[] => validateFragen([q]).fehler.map((e) => e.meldung);
const feld = (name: string): string => "Feld '" + name + "' fehlt oder ist ungültig";

function grenzen(basis: Q, faelle: Array<[Q, string]>): void {
  expect(meldungen(basis)).toEqual([]);
  for (const [aenderung, name] of faelle) expect(meldungen({ ...basis, ...aenderung }), name).toEqual([feld(name)]);
}

describe("Kopf", () => {
  const mc: Q = { ...KOPF, id: "K1", typ: "mc", frage: "f", optionen: ["a", "b", "c", "d"], loesungIndex: 0, distraktorErklaerungen: ["", "", "", ""] };
  it("modul nur als String M01..M09, ganz", () => {
    grenzen(mc, [[{ modul: ["M03"] }, "modul"], [{ modul: "M03x" }, "modul"], [{ modul: "xM03" }, "modul"]]);
  });
});

describe("freitext: Schluesselbegriffe", () => {
  const ft: Q = { ...KOPF, id: "F1", typ: "freitext", frage: "f", musterloesung: "m", schluesselbegriffe: { pflicht: ["a", ["b", "c"]] } };
  it("Eintraege duerfen nicht leer sein, auch nicht nur aus Leerzeichen, auch nicht in Alternativlisten", () => {
    const p = "schluesselbegriffe.pflicht (nicht leer)";
    grenzen(ft, [[{ schluesselbegriffe: { pflicht: [""] } }, p], [{ schluesselbegriffe: { pflicht: ["  "] } }, p],
      [{ schluesselbegriffe: { pflicht: ["a", ["b", "  "]] } }, p]]);
  });
});

describe("mehrfach", () => {
  it("Loesungsindizes nicht negativ", () => {
    grenzen({ ...KOPF, id: "M1", typ: "mehrfach", frage: "f", optionen: ["a", "b", "c"], loesungIndizes: [0, 2] },
      [[{ loesungIndizes: [-1] }, "loesungIndizes"]]);
  });
});

describe("kreuztabelle", () => {
  it("jede Zelle ein Wahrheitswert", () => {
    grenzen({ ...KOPF, id: "X1", typ: "kreuztabelle", frage: "f", zeilen: ["a", "b"], spalten: ["x", "y"], loesung: [[true, false], [false, true]] },
      [[{ loesung: [[true, "ja"], [false, true]] }, "loesung (Matrix zeilen×spalten, bool)"]]);
  });
});

describe("szenario2: Schritt", () => {
  const s = { frage: "s", optionen: ["a", "b"], loesungIndex: 1 };
  const sz: Q = { ...KOPF, id: "S1", typ: "szenario2", frage: "f", schritt1: s, schritt2: s, feedback1: ["x", "y"] };
  it("Frage nicht leer, Optionen nicht leer, Index im Bereich", () => {
    grenzen(sz, [[{ schritt2: { ...s, frage: "" } }, "schritt2"], [{ schritt2: { ...s, optionen: ["a", ""] } }, "schritt2"],
      [{ schritt2: { ...s, optionen: ["a", 7] } }, "schritt2"], [{ schritt2: { ...s, loesungIndex: -1 } }, "schritt2"],
      [{ schritt2: { ...s, loesungIndex: 2 } }, "schritt2"], [{ schritt2: "abc" }, "schritt2"]]);
  });
});

describe("dropdown: akzeptiert", () => {
  const l = { optionen: ["a", "b"], loesung: 0, akzeptiert: ["A"] };
  it("nur nicht leere Strings", () => {
    const n = "luecken[].akzeptiert (optional String[])";
    grenzen({ ...KOPF, id: "D1", typ: "dropdown", frage: "f ___", luecken: [l] },
      [[{ luecken: [{ ...l, akzeptiert: ["  "] }] }, n], [{ luecken: [{ ...l, akzeptiert: [3] }] }, n]]);
  });
});

describe("rechenassistent: Variablen und Platzhalter", () => {
  const ra: Q = { ...KOPF, id: "R1", typ: "rechenassistent", frage: "Rechne {x}", variablen: { x: { min: 1, max: 3, schritt: 1 } },
    schritte: [{ text: "a {s1}", formel: "x + 1" }, { text: "b", formel: "s1 * 2" }] };
  it("Grenzen und Schrittweite als Zahl", () => {
    const n = "variablen (min<=max, schritt>0)";
    grenzen(ra, [[{ variablen: { x: { min: 1, max: 3, schritt: "1" } } }, n]]);
    // max als Text: die Extremprobe rechnet danach mit "3" und meldet zusaetzlich die Formel
    expect(meldungen({ ...ra, variablen: { x: { min: 1, max: "3" } } })[0]!.startsWith(feld(n) + "; ")).toBe(true);
  });
  it("nur Namen der Form s<Zahl> kollidieren", () => {
    const v = (name: string): Q => ({ variablen: { [name]: { min: 1, max: 3 } }, frage: "Rechne {" + name + "}",
      schritte: [{ text: "a", formel: name + " + 1" }, { text: "b", formel: "s1 * 2" }] });
    expect(meldungen({ ...ra, ...v("as1") })).toEqual([]);
    expect(meldungen({ ...ra, ...v("s1x") })).toEqual([]);
  });
  it("Platzhalter in den Schritttexten werden geprueft", () => {
    expect(meldungen({ ...ra, schritte: [{ text: "a {y}", formel: "x + 1" }, { text: "b", formel: "s1 * 2" }] }))
      .toEqual([feld("platzhalter aufloesbar ({y})")]);
  });
});

describe("kalkulation", () => {
  it("jede Zelle ein Objekt mit Text oder Loesung", () => {
    grenzen({ ...KOPF, id: "C1", typ: "kalkulation", frage: "f", kopf: ["a", "b"], zeilen: [[{ v: "x" }, { loesung: [1] }]] },
      [[{ zeilen: [[{ v: "x" }, {}], [{ v: "y" }, { loesung: [1] }]] }, "zeilen"]],
    );
  });
});
