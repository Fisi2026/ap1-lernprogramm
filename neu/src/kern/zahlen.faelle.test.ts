/* N43 M3 Rest (17.10.2026): gebaute Faelle je Regel in `zahlen.ts` – die Gleichheit gegen `referenz/logik.js`
   (`bewertung.gleichheit.test.ts`) trifft nicht jede Grenze, Stryker liess 20 Mutanten ueberleben. */
import { describe, expect, it } from "vitest";

import { rundeAuf, runde2, toleranzFuer, zahlAusText } from "./zahlen.ts";

describe("rundeAuf", () => {
  it("rundet kaufmaennisch auf 2 Dezimalen, Halbe aufwaerts, vorzeichenrichtig", () => {
    expect(rundeAuf(1.005)).toBe(1.01);
    expect(rundeAuf(-1.005)).toBe(-1.01);
    expect(rundeAuf(2.344)).toBe(2.34);
    expect(rundeAuf(-2.345)).toBe(-2.35);
    expect(rundeAuf(0)).toBe(0);
    expect(rundeAuf("3,5")).toBeNaN();
    expect(rundeAuf("3.456")).toBe(3.46);
  });
  it("liefert NaN fuer nicht endliche Werte", () => {
    expect(rundeAuf(Infinity)).toBeNaN();
    expect(rundeAuf(-Infinity)).toBeNaN();
    expect(rundeAuf("abc")).toBeNaN();
  });
  it("nimmt Dezimalen nur als Zahl von 0 bis 6, abgerundet; sonst 2", () => {
    expect(rundeAuf(1.23456789, 0)).toBe(1);
    expect(rundeAuf(1.5, 0)).toBe(2);
    expect(rundeAuf(1.23456789, 6)).toBe(1.234568);
    expect(rundeAuf(1.23456789, 7)).toBe(1.23);
    expect(rundeAuf(1.23456789, -1)).toBe(1.23);
    expect(rundeAuf(1.23456789, 3.9)).toBe(1.235);
    expect(rundeAuf(1.23456789, "3")).toBe(1.23);
    expect(rundeAuf(1.23456789)).toBe(1.23);
  });
  it("verfaelscht grosse Werte nicht (absolutes Epsilon)", () => {
    expect(rundeAuf(2e12)).toBe(2e12);
  });
  it("runde2 ist rundeAuf mit 2 Dezimalen", () => {
    expect(runde2(1.005)).toBe(1.01);
    expect(runde2(7.777)).toBe(7.78);
  });
});

describe("toleranzFuer", () => {
  it("1 Cent ab 2 Dezimalen und als Vorgabe, halbe Stelle bei 1, streng bei 0", () => {
    expect(toleranzFuer()).toBe(0.01);
    expect(toleranzFuer(2)).toBe(0.01);
    expect(toleranzFuer(3)).toBe(0.01);
    expect(toleranzFuer(1)).toBe(0.05);
    expect(toleranzFuer(1.7)).toBe(0.05);
    expect(toleranzFuer(0)).toBe(0.01);
    expect(toleranzFuer(-1)).toBe(0.01);
    expect(toleranzFuer("1")).toBe(0.01);
  });
});

describe("zahlAusText", () => {
  it("Zahlen gehen durch, nicht endliche werden NaN", () => {
    expect(zahlAusText(12.5)).toBe(12.5);
    expect(zahlAusText(1e21)).toBe(1e21);   // nicht ueber den Text: "1e+21" laese parseFloat als 1
    expect(zahlAusText(-0)).toBe(-0);
    expect(zahlAusText(Infinity)).toBeNaN();
    expect(zahlAusText(NaN)).toBeNaN();
  });
  it("leer, null, undefined und nur Leerraum sind NaN", () => {
    expect(zahlAusText("")).toBeNaN();
    expect(zahlAusText("   ")).toBeNaN();
    expect(zahlAusText(null)).toBeNaN();
    expect(zahlAusText(undefined)).toBeNaN();
    expect(zahlAusText("abc")).toBeNaN();
  });
  it("Komma ist Dezimaltrenner, Punkte davor sind Tausender", () => {
    expect(zahlAusText("3.000,50")).toBe(3000.5);
    expect(zahlAusText("1.234.567,8")).toBe(1234567.8);
    expect(zahlAusText("3000,5")).toBe(3000.5);
    expect(zahlAusText("-0,5")).toBe(-0.5);
    expect(zahlAusText(",5")).toBe(0.5);
  });
  it("mehrere Punkte ohne Komma sind Tausenderpunkte", () => {
    expect(zahlAusText("1.234.567")).toBe(1234567);
    expect(zahlAusText("1.2.3")).toBe(123);
  });
  it("ein Punkt mit genau drei Ziffern danach ist Tausender, sonst Dezimal", () => {
    expect(zahlAusText("3.000")).toBe(3000);
    expect(zahlAusText("-3.000")).toBe(-3000);
    expect(zahlAusText("12.345")).toBe(12345);
    expect(zahlAusText("3000.5")).toBe(3000.5);
    expect(zahlAusText("3.0001")).toBe(3.0001);
    expect(zahlAusText("1234.567")).toBe(1234.567);
    expect(zahlAusText("x3.000")).toBeNaN();
    expect(zahlAusText("3.000x")).toBe(3);
  });
  it("Leerraum und Waehrung werden entfernt", () => {
    expect(zahlAusText("1 234")).toBe(1234);
    expect(zahlAusText("1 234")).toBe(1234);
    expect(zahlAusText(" 12 € ")).toBe(12);
    expect(zahlAusText("$12")).toBe(12);
    expect(zahlAusText("12EUR")).toBe(12);
    expect(zahlAusText("12eur")).toBe(12);
    expect(zahlAusText("1 2 3")).toBe(123);
  });
});
