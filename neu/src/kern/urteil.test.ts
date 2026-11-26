/* Wann wird gebucht, und als was?

   ⛔ Diese Regel entscheidet, welche Frage wiederkommt und welche nicht. Sie
      falsch zu haben faellt nicht auf — es zeigt sich Wochen spaeter als
      "warum sehe ich das staendig" oder "warum nie wieder".
   ⚠️ Der Massstab ist app_loeser.js:704 —
      `fertig(o[2] === true, { keinFehlerDeck: o[2] === null })` — mit den drei
      Knoepfen true / null / false. */
import { describe, it, expect } from "vitest";
import { urteilAus, EIGENES_URTEIL } from "./verbuchen";

describe("Typen mit Maschinen-Urteil", () => {
  it("bucht ein true als richtig", () => {
    expect(urteilAus("mc", 2, true)).toEqual({ korrekt: true, keinFehlerDeck: false });
  });
  it("bucht ein false als falsch, mit Fehler-Deck", () => {
    expect(urteilAus("mc", 2, false)).toEqual({ korrekt: false, keinFehlerDeck: false });
  });
  it("liest auch das Teilpunkte-Objekt, das manche grade* liefern", () => {
    expect(urteilAus("mtf", [], { korrekt: true, punkte: 3, max: 3 })).toEqual({
      korrekt: true, keinFehlerDeck: false,
    });
    expect(urteilAus("mtf", [], { korrekt: false, punkte: 2, max: 3 })).toEqual({
      korrekt: false, keinFehlerDeck: false,
    });
  });
  it("wertet null und undefined als NICHT richtig — nie als Treffer", () => {
    expect(urteilAus("mc", 2, null)?.korrekt).toBe(false);
    expect(urteilAus("mc", 2, undefined)?.korrekt).toBe(false);
  });
  it("bucht Aufgeben als falsch UND mit Fehler-Deck", () => {
    expect(urteilAus("mc", undefined, null, true)).toEqual({
      korrekt: false, keinFehlerDeck: false,
    });
  });
});

describe("Typen, bei denen der Mensch urteilt", () => {
  it("kennt genau freitext und erklaeren", () => {
    expect([...EIGENES_URTEIL].sort()).toEqual(["erklaeren", "freitext"]);
  });

  it("bucht NICHT, solange keine Selbsteinschaetzung da ist", () => {
    expect(urteilAus("freitext", { text: "irgendwas" }, null)).toBeNull();
    expect(urteilAus("freitext", undefined, null)).toBeNull();
    expect(urteilAus("erklaeren", { text: "" }, null)).toBeNull();
  });

  it('"Wusste ich" ist richtig', () => {
    expect(urteilAus("freitext", { text: "x", selbst: true }, null)).toEqual({
      korrekt: true, keinFehlerDeck: false,
    });
  });

  /* ⛔ DER FALL, UM DEN ES GEHT. */
  it('"Teilweise" zaehlt als NICHT richtig, kommt aber NICHT ins Fehler-Deck', () => {
    expect(urteilAus("freitext", { text: "x", selbst: null }, null)).toEqual({
      korrekt: false, keinFehlerDeck: true,
    });
  });

  it('"Wusste ich nicht" ist falsch UND kommt ins Fehler-Deck', () => {
    expect(urteilAus("erklaeren", { text: "x", selbst: false }, null)).toEqual({
      korrekt: false, keinFehlerDeck: false,
    });
  });

  it("Aufgeben nimmt dem Menschen das Urteil NICHT ab", () => {
    /* Sonst stuende bei freitext ein Urteil im Stand, das niemand gefaellt hat. */
    expect(urteilAus("freitext", { text: "x" }, null, true)).toBeNull();
  });
});
