/* distraktoren/textOder: reine Funktionen – was ausgegeben wird, auch bei kaputten Pool-Formen. */
import { describe, it, expect } from "vitest";
import type { Frage } from "@/daten/typen";
import { distraktoren, textOder } from "./distraktoren";

const mc = (teil: Record<string, unknown>) => ({ typ: "mc", loesungIndex: 1, optionen: ["A", "B", "C", "D"], ...teil }) as unknown as Frage;

describe("textOder", () => {
  it("trimmt Text, alles andere wird leer", () => {
    expect(textOder("  x \n")).toBe("x");
    expect(textOder("   ")).toBe("");
    for (const nicht of [5, null, undefined, ["a"], {}]) expect(textOder(nicht)).toBe("");
  });
});

describe("distraktoren", () => {
  it("nur Typ mc; sonst leer", () => {
    expect(distraktoren(mc({ typ: "freitext", distraktorErklaerungen: ["a", "b", "c", "d"] }))).toEqual([]);
  });

  it("fehlt Liste der Erklärungen ODER der Optionen: leer (auch wenn nur eine fehlt)", () => {
    expect(distraktoren(mc({ distraktorErklaerungen: undefined }))).toEqual([]);
    expect(distraktoren(mc({ distraktorErklaerungen: ["a", "b"], optionen: undefined }))).toEqual([]);
    expect(distraktoren(mc({ distraktorErklaerungen: "a", optionen: ["A", "B"] }))).toEqual([]);
    expect(distraktoren(mc({ distraktorErklaerungen: [], optionen: undefined }))).toEqual([]);
  });

  it("ohne die richtige Option und ohne leere Erklärungen, in Pool-Reihenfolge, mit Optionstext", () => {
    const erg = distraktoren(mc({ distraktorErklaerungen: ["falsch weil a", "RICHTIG", "  ", "falsch weil d"] }));
    expect(erg).toEqual([{ option: "A", warum: "falsch weil a" }, { option: "D", warum: "falsch weil d" }]);
  });

  it("nicht-textige Erklärung wird übersprungen; fehlt die Option, bleibt der Optionstext leer", () => {
    const erg = distraktoren(mc({ loesungIndex: 0, optionen: ["A"], distraktorErklaerungen: ["x", 5, "warum"] }));
    expect(erg).toEqual([{ option: "", warum: "warum" }]);
  });
});
