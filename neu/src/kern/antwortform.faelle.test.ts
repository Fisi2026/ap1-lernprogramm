/* N43 M3 Rest (17.10.2026): gebaute Faelle fuer `antwortform.ts`. Die Gegenprobe ueber den Pool
   (`antwortform.test.ts`) trifft nur die Formen, die der Bestand hat – hier je Zweig von `falscheAntwort`,
   `verbiegeText` und den Sonderfaellen der Bauer (kalkulation, rechenassistent, bild) ein Fall. */
import { describe, expect, it } from "vitest";

import type { Frage } from "@/daten/typen";
import { falscheAntwort, richtigeAntwort } from "./antwortform.ts";

const frage = (k: Record<string, unknown>): Frage => k as unknown as Frage;
/* `fehlersuche` reicht `fehlerZeile` unveraendert durch – damit laesst sich jede Wertform bauen. */
const mitWert = (w: unknown): Frage => frage({ typ: "fehlersuche", fehlerZeile: w });
const falsch = (w: unknown) => falscheAntwort(mitWert(w));

describe("richtigeAntwort – Sonderfaelle der Bauer", () => {
  it("nicht ableitbare Typen liefern null", () => {
    expect(richtigeAntwort(frage({ typ: "freitext" }))).toBeNull();
    expect(falscheAntwort(frage({ typ: "freitext" }))).toBeNull();
  });
  it("kalkulation: nur Zellen mit loesung-Liste, erste Schreibweise als Text", () => {
    const f = frage({ typ: "kalkulation", zeilen: [[{ v: 1 }, { loesung: [7, "7,0"] }, null, 5, { loesung: "x" }], [{ loesung: ["a"] }]] });
    expect(richtigeAntwort(f)).toEqual({ wert: { "0,1": "7", "1,0": "a" } });
  });
  it("rechenassistent: wert als Text, sonst erste loesung, sonst leer", () => {
    const f = frage({ typ: "rechenassistent", schritte: [{ wert: 3.5 }, { loesung: ["x", "y"] }, { loesung: [] }, {}, { wert: "9" }] });
    expect(richtigeAntwort(f)).toEqual({ wert: ["3.5", "x", "", "", ""] });
  });
  it("bild mit unbekanntem unterTyp liefert keinen Wert", () => {
    expect(richtigeAntwort(frage({ typ: "bild", unterTyp: "matrix", loesungIndex: 1 }))).toEqual({ wert: undefined });
    expect(richtigeAntwort(frage({ typ: "bild", unterTyp: "mc", loesungIndex: 1 }))).toEqual({ wert: 1 });
  });
});

describe("falscheAntwort – je Wertform", () => {
  it("Zahl: 0 wird 1, alles andere 0", () => {
    expect(falsch(0)).toEqual({ wert: 1 });
    expect(falsch(4)).toEqual({ wert: 0 });
  });
  it("Wahrheitswert wird umgedreht", () => {
    expect(falsch(true)).toEqual({ wert: false });
    expect(falsch(false)).toEqual({ wert: true });
  });
  it("Text: Zahlen numerisch +7,77 (Komma erlaubt, Rand egal), sonst Anhang", () => {
    expect(falsch("3")).toEqual({ wert: "10.77" });
    expect(falsch(" 2,5 ")).toEqual({ wert: String(2.5 + 7.77) });
    expect(falsch("abc")).toEqual({ wert: "abc###falsch" });
    expect(falsch("")).toEqual({ wert: "###falsch" });
    expect(falsch("  ")).toEqual({ wert: "  ###falsch" });
  });
  it("Liste: erstes Element verbogen, Rest unveraendert; leer oder unbekannt -> null", () => {
    expect(falsch([])).toBeNull();
    expect(falsch([0, 1])).toEqual({ wert: [999, 1] });
    expect(falsch([3, 1])).toEqual({ wert: [0, 1] });
    expect(falsch([true, true])).toEqual({ wert: [false, true] });
    expect(falsch(["a", "b"])).toEqual({ wert: ["a###falsch", "b"] });
    expect(falsch(["5"])).toEqual({ wert: ["12.77"] });
    expect(falsch([["x", "y"], ["z"]])).toEqual({ wert: [["###falsch", "###falsch"], ["z"]] });
    expect(falsch([{ a: 1 }])).toBeNull();
  });
  it("Objekt: erster Schluessel verbogen, Rest unveraendert; leer oder unbekannt -> null", () => {
    expect(falsch({})).toBeNull();
    expect(falsch({ a: 0, b: 2 })).toEqual({ wert: { a: 999, b: 2 } });
    expect(falsch({ a: 5 })).toEqual({ wert: { a: 0 } });
    expect(falsch({ a: "t", b: "u" })).toEqual({ wert: { a: "t###falsch", b: "u" } });
    expect(falsch({ a: true })).toBeNull();
  });
  it("andere Werte -> null", () => {
    expect(falsch(undefined)).toBeNull();
    expect(falsch(null)).toBeNull();
  });
});
