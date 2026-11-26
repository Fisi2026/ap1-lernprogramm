// @ts-nocheck
/* register: welche Komponente zeichnet welchen Typ, und welche Karte lässt sich auf die Eingabe ein. */
import { describe, it, expect } from "vitest";
import { eingabeFuer, wirkTyp, ZEICHNUNG_IST_EINGABE, FRAGETEXT_IST_EINGABE, EIGENES_URTEIL } from "./register";
import { MC, Mehrfach } from "./Auswahl";
import { Dropdown } from "./Dropdown";
import { Zuordnung } from "./Zuordnung";
import { Freitext } from "./Freitext";
import { Hotspot } from "./Hotspot";
import { Reihenfolge } from "./Reihenfolge";
import { Fehlersuche, Mtf, Szenario2 } from "./Einfach";
import { Lueckentext } from "./Lueckentext";
import { Konsole } from "./Konsole";
import { Trace, Kreuztabelle } from "./Tabellen";
import { Beschriftung, Baukasten } from "./Bausteine";
import { Matrix } from "./Matrix";
import { Rechenassistent, Kalkulation } from "./Rechnen";

describe("eingabeFuer", () => {
  const ERWARTET = {
    mc: MC, mehrfach: Mehrfach, dropdown: Dropdown, zuordnung: Zuordnung, freitext: Freitext,
    erklaeren: Freitext, hotspot: Hotspot, reihenfolge: Reihenfolge, fehlersuche: Fehlersuche, mtf: Mtf,
    szenario2: Szenario2, lueckentext: Lueckentext, konsole: Konsole, trace: Trace, kreuztabelle: Kreuztabelle,
    beschriftung: Beschriftung, baukasten: Baukasten, matrix: Matrix, rechenassistent: Rechenassistent,
    kalkulation: Kalkulation,
  };

  for (const [typ, komponente] of Object.entries(ERWARTET)) {
    it(`${typ} wird von seiner Komponente gezeichnet`, () => {
      expect(eingabeFuer({ id: "X", typ })).toBe(komponente);
    });
  }

  it("ein Typ ohne Eingabe liefert nichts", () => {
    expect(eingabeFuer({ id: "X", typ: "gibtsnicht" })).toBeUndefined();
  });

  it("bild ohne unterTyp wird wie mc gezeichnet", () => {
    expect(eingabeFuer({ id: "X", typ: "bild" })).toBe(MC);
  });

  it("bild mit unterTyp wird wie dieser Typ gezeichnet", () => {
    expect(eingabeFuer({ id: "X", typ: "bild", unterTyp: "lueckentext" })).toBe(Lueckentext);
    expect(eingabeFuer({ id: "X", typ: "bild", unterTyp: "hotspot" })).toBe(Hotspot);
  });

  it("wirkTyp wird weitergereicht", () => {
    expect(wirkTyp({ id: "X", typ: "bild", unterTyp: "matrix" })).toBe("matrix");
    expect(wirkTyp({ id: "X", typ: "mc" })).toBe("mc");
  });
});

describe("Mengen für die Karte", () => {
  it("nur beim Hotspot ist die Zeichnung die Eingabe", () => {
    expect([...ZEICHNUNG_IST_EINGABE]).toEqual(["hotspot"]);
  });
  it("nur beim Lückentext ist der Fragetext die Eingabe", () => {
    expect([...FRAGETEXT_IST_EINGABE]).toEqual(["lueckentext"]);
  });
  it("freitext und erklären zeigen ihr Urteil selbst", () => {
    expect([...EIGENES_URTEIL].sort()).toEqual(["erklaeren", "freitext"]);
  });
});
