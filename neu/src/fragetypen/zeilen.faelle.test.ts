/* zerlegeZeile: nur echte Ziel-Nummern in eckigen Klammern werden zu Eingabefeldern. */
import { describe, it, expect } from "vitest";
import { zerlegeZeile } from "./zeilen";

const N = new Set(["1", "2", "10"]);

describe("zerlegeZeile", () => {
  it("eine Zeile ohne Marker bleibt ein Textstück", () => {
    expect(zerlegeZeile("x = y + 1", N)).toEqual([{ text: "x = y + 1" }]);
  });

  it("eine leere Zeile ergibt ein leeres Textstück", () => {
    expect(zerlegeZeile("", N)).toEqual([{ text: "" }]);
  });

  it("ein Marker mitten in der Zeile trennt Text davor und danach", () => {
    expect(zerlegeZeile("x = [1] + y", N)).toEqual([{ text: "x = " }, { marke: "1" }, { text: " + y" }]);
  });

  it("ein Marker am Ende hängt kein leeres Textstück an", () => {
    expect(zerlegeZeile("a = [2]", N)).toEqual([{ text: "a = " }, { marke: "2" }]);
  });

  it("ein Marker am Anfang beginnt mit einem leeren Textstück", () => {
    expect(zerlegeZeile("[1] rest", N)).toEqual([{ text: "" }, { marke: "1" }, { text: " rest" }]);
  });

  it("nur der Marker allein", () => {
    expect(zerlegeZeile("[10]", N)).toEqual([{ text: "" }, { marke: "10" }]);
  });

  it("zwei Marker hintereinander behalten ein leeres Textstück dazwischen", () => {
    expect(zerlegeZeile("[1][2]", N)).toEqual([{ text: "" }, { marke: "1" }, { text: "" }, { marke: "2" }]);
  });

  it("Feldzugriffe im Code sind keine Marker und bleiben im Text", () => {
    expect(zerlegeZeile("werte[0] = werte[i] + [1]", N))
      .toEqual([{ text: "werte[0] = werte[i] + " }, { marke: "1" }]);
  });

  it("eine unbekannte Nummer bleibt Text, auch zwischen zwei bekannten", () => {
    expect(zerlegeZeile("[1] x [9] y [2]", N))
      .toEqual([{ text: "" }, { marke: "1" }, { text: " x [9] y " }, { marke: "2" }]);
  });

  it("nur Zeilen mit unbekannten Nummern bleiben ganz Text", () => {
    expect(zerlegeZeile("a[7]b[8]c", N)).toEqual([{ text: "a[7]b[8]c" }]);
  });

  it("eine nicht geschlossene Klammer bleibt Text", () => {
    expect(zerlegeZeile("a [1", N)).toEqual([{ text: "a [1" }]);
    expect(zerlegeZeile("a [1] b [2", N)).toEqual([{ text: "a " }, { marke: "1" }, { text: " b [2" }]);
  });

  it("eine schließende Klammer vor der öffnenden stört nicht", () => {
    expect(zerlegeZeile("a]b[1]c", N)).toEqual([{ text: "a]b" }, { marke: "1" }, { text: "c" }]);
  });

  it("ohne bekannte Nummern ist jede Zeile ein Textstück", () => {
    expect(zerlegeZeile("a [1] b", new Set())).toEqual([{ text: "a [1] b" }]);
  });

  it("die Textstücke ergeben mit den Markern wieder die Zeile", () => {
    const zeile = "für i = [1] bis [2] tue x[i] = [10]";
    const teile = zerlegeZeile(zeile, N);
    const zusammen = teile.map((t) => ("text" in t ? t.text : `[${t.marke}]`)).join("");
    expect(zusammen).toBe(zeile);
    expect(teile.filter((t) => "marke" in t)).toHaveLength(3);
  });
});
