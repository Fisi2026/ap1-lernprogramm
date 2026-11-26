/* N38 Q2: der Ablauf der Karteikarte, DOM-frei. Jede Regel stand bis Q2 nur im Schirm und war nur
   ueber jsdom-Klicks erreichbar. Die ⛔-Faelle sind die Fehler, die der Schirm schon hatte. */
import { describe, it, expect } from "vitest";
import type { Frage } from "@/daten/typen";
import {
  kartenStart, kartenSchritt, zuBuchen, beurteilerFuer, kartenBewerterTyp,
  type Beurteile, type KartenAktion, type KartenZustand,
} from "./kartenablauf";

/** Ein Beurteiler mit bekannter Antwort: „r“ ist richtig, alles andere falsch; Aufgeben = falsch. */
const maschine: Beurteile = (a, aufgegeben) =>
  aufgegeben ? { korrekt: false, keinFehlerDeck: false } : { korrekt: a === "r", keinFehlerDeck: false };

/** Faehrt Aktionen wie der Schirm: erst fragen, was zu buchen ist, dann schalten, dann „gebucht“. */
function fahre(z: KartenZustand, aktionen: KartenAktion[], beurteile: Beurteile) {
  const buchungen: Array<{ korrekt: boolean; keinFehlerDeck: boolean }> = [];
  for (const a of aktionen) {
    const b = zuBuchen(z, a, beurteile);
    z = kartenSchritt(z, a);
    if (b) { buchungen.push(b); z = kartenSchritt(z, { art: "gebucht" }); }
  }
  return { z, buchungen };
}

describe("kartenStart", () => {
  it("eine frische Karte ist leer, ungeprueft, ungebucht", () => {
    expect(kartenStart(false, "x")).toEqual({ antwort: undefined, geprueft: false, gebucht: false, aufgedeckt: false });
  });
  it("⛔ eine Karte aus dem Verlauf ist geprueft, gebucht und traegt die damalige Antwort", () => {
    expect(kartenStart(true, "damals")).toEqual({ antwort: "damals", geprueft: true, gebucht: true, aufgedeckt: false });
  });
});

describe("zuBuchen", () => {
  it("Pruefen bucht das Urteil der eingetragenen Antwort", () => {
    const { buchungen, z } = fahre(kartenStart(false), [{ art: "antwort", antwort: "r" }, { art: "pruefen" }], maschine);
    expect(buchungen).toEqual([{ korrekt: true, keinFehlerDeck: false }]);
    expect(z.geprueft).toBe(true);
  });
  it("Aufgeben bucht falsch", () => {
    const { buchungen } = fahre(kartenStart(false), [{ art: "aufgeben" }], maschine);
    expect(buchungen).toEqual([{ korrekt: false, keinFehlerDeck: false }]);
  });
  it("⛔ genau EINMAL: eine Antwort nach dem Pruefen bucht bei gebuchter Karte nicht nach", () => {
    const { buchungen } = fahre(kartenStart(false),
      [{ art: "antwort", antwort: "f" }, { art: "pruefen" }, { art: "antwort", antwort: "r" }, { art: "pruefen" }], maschine);
    expect(buchungen).toHaveLength(1);
  });
  it("vor dem Pruefen bucht eine Antwort nicht", () => {
    expect(zuBuchen(kartenStart(false), { art: "antwort", antwort: "r" }, maschine)).toBeNull();
  });
  it("⛔ eine Karte aus dem Verlauf bucht nie", () => {
    const { buchungen } = fahre(kartenStart(true, "r"), [{ art: "pruefen" }, { art: "aufgeben" }, { art: "antwort", antwort: "r" }], maschine);
    expect(buchungen).toEqual([]);
  });
  it("Aufdecken bucht nicht und deckt auf", () => {
    const { buchungen, z } = fahre(kartenStart(false), [{ art: "aufdecken" }], maschine);
    expect(buchungen).toEqual([]);
    expect(z.aufgedeckt).toBe(true);
  });
});

describe("freitext: der Mensch urteilt (beurteilerFuer mit echtem urteilAus)", () => {
  const FREI = { id: "F", typ: "freitext" } as unknown as Frage;
  const b = beurteilerFuer(FREI);
  it("Pruefen ohne Selbsteinschaetzung bucht nicht, Aufgeben auch nicht", () => {
    expect(fahre(kartenStart(false), [{ art: "antwort", antwort: { text: "x" } }, { art: "pruefen" }, { art: "aufgeben" }], b).buchungen).toEqual([]);
  });
  it("⛔ die Selbsteinschaetzung kommt NACH dem Pruefen und bucht dann – einmal", () => {
    const { buchungen } = fahre(kartenStart(false), [
      { art: "antwort", antwort: { text: "x" } }, { art: "pruefen" },
      { art: "antwort", antwort: { text: "x", selbst: true } },
      { art: "antwort", antwort: { text: "x", selbst: false } },
    ], b);
    expect(buchungen).toEqual([{ korrekt: true, keinFehlerDeck: false }]);
  });
  it("⛔ die Mitte (selbst = null) zaehlt nicht richtig, kommt aber nicht ins Fehler-Deck", () => {
    const { buchungen } = fahre(kartenStart(false), [{ art: "pruefen" }, { art: "antwort", antwort: { selbst: null } }], b);
    expect(buchungen).toEqual([{ korrekt: false, keinFehlerDeck: true }]);
  });
});

describe("kartenBewerterTyp", () => {
  it("bild nimmt den unterTyp, sonst der Typ", () => {
    expect(kartenBewerterTyp({ typ: "bild", unterTyp: "hotspot" } as unknown as Frage)).toBe("hotspot");
    expect(kartenBewerterTyp({ typ: "mc" } as unknown as Frage)).toBe("mc");
  });
});
