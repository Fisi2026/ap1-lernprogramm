/* N48 P3 (Nutzer-Entscheid 11.10.2026, BUILD_LOG 136): Zahlenzellen der Kalkulation wie der
   Rechenassistent. Gemessen vorher: „300 €" in 21 Fragen abgelehnt, „5.000,00" in 4.
   Gehalten wird hier: saubere Zahl in anderer Schreibweise = richtig; angehaengter Text,
   falsche Zahl und %-Zellen bleiben, wie sie waren. */
import { describe, it, expect } from "vitest";
import { gradeKalkulation } from "./bewertung";

type F = Parameters<typeof gradeKalkulation>[0];
const frage = {
  typ: "kalkulation",
  zeilen: [
    [{ v: "A" }, { loesung: ["300"] }],
    [{ v: "B" }, { loesung: ["5.000", "5000"] }],
    [{ v: "C" }, { loesung: ["1,33", "1.33", "1,3"] }],
    [{ v: "D" }, { loesung: ["110", "110 %"] }],
  ],
} as unknown as F;
const richtig = { "0,1": "300", "1,1": "5000", "2,1": "1,33", "3,1": "110" };
const mit = (zelle: string, wert: string) => gradeKalkulation(frage, { ...richtig, [zelle]: wert });

describe("Kalkulation: Zahlenzellen als Zahl", () => {
  it("nimmt die gelisteten Schreibweisen wie bisher", () => {
    expect(gradeKalkulation(frage, richtig)).toBe(true);
  });
  it("nimmt Euro-Zeichen, zwei Nachkommastellen und Tausenderpunkt mit Komma", () => {
    expect(mit("0,1", "300 €")).toBe(true);
    expect(mit("0,1", "300,00")).toBe(true);
    expect(mit("0,1", "300 EUR")).toBe(true);
    expect(mit("1,1", "5.000,00")).toBe(true);
    expect(mit("1,1", "5.000,00 €")).toBe(true);
  });
  it("vergleicht gegen JEDEN gelisteten Wert (zwei erlaubte Rundungen)", () => {
    expect(mit("2,1", "1,30")).toBe(true);
    expect(mit("2,1", "1,33 €")).toBe(true);
  });
  it("lehnt falsche Zahlen und angehaengten Text ab", () => {
    expect(mit("0,1", "301")).toBe(false);
    expect(mit("0,1", "300###falsch")).toBe(false);
    expect(mit("1,1", "1.000,00###falsch")).toBe(false);
    expect(mit("2,1", "1,4")).toBe(false);
  });
  it("laesst Zellen mit Text in der Loesung (hier „110 %\") beim Textvergleich", () => {
    expect(mit("3,1", "110 %")).toBe(true);
    expect(mit("3,1", "110 €")).toBe(false);
  });
});
