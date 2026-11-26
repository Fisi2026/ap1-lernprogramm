import { describe, expect, it } from "vitest";

import { istObjekt, istText, istWahrheit, istZahl, listeAus, listeVon, oderNull, optional, tabelleVon } from "./pruefe.ts";

describe("pruefe (N38 Q1)", () => {
  it("listeVon gibt die Liste zurueck, wenn JEDES Element passt", () => {
    const l = ["a", "b"];
    expect(listeVon(l, istText)).toBe(l);
    expect(listeVon([], istZahl)).toEqual([]);
    expect(listeVon([1, null], oderNull(istZahl))).toEqual([1, null]);
    expect(listeVon([[true], [false, true]], listeAus(istWahrheit))).toEqual([[true], [false, true]]);
  });
  it("listeVon liefert null bei Nicht-Liste oder EINEM falschen Element", () => {
    expect(listeVon(undefined, istText)).toBeNull();
    expect(listeVon("abc", istText)).toBeNull();
    expect(listeVon(["a", 1], istText)).toBeNull();
    expect(listeVon([1, "2"], istZahl)).toBeNull();
    expect(listeVon([[true], ["x"]], listeAus(istWahrheit))).toBeNull();
    expect(listeVon([null], istZahl)).toBeNull();
  });
  it("istObjekt: einfaches Objekt ja – null, Liste, Text nein", () => {
    expect(istObjekt({})).toBe(true);
    expect(istObjekt({ a: 1 })).toBe(true);
    expect(istObjekt(null)).toBe(false);
    expect(istObjekt([])).toBe(false);
    expect(istObjekt("x")).toBe(false);
    expect(istObjekt(undefined)).toBe(false);
  });
  it("optional: undefined oder bestanden", () => {
    expect(optional(istText)(undefined)).toBe(true);
    expect(optional(istText)("a")).toBe(true);
    expect(optional(istText)(null)).toBe(false);
    expect(optional(istText)(1)).toBe(false);
  });
  it("tabelleVon behaelt nur passende Werte, kein Objekt -> leer", () => {
    expect(tabelleVon({ 0: "a", 1: 2, 2: "c" }, istText)).toEqual({ 0: "a", 2: "c" });
    expect(tabelleVon({ "1,2": "x" }, istText)).toEqual({ "1,2": "x" });
    expect(tabelleVon(null, istZahl)).toEqual({});
    expect(tabelleVon([1, 2], istZahl)).toEqual({});
    expect(tabelleVon("abc", istText)).toEqual({});
  });
});
