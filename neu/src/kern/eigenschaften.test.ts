/* EIGENSCHAFTSTESTS mit fast-check (26.11.2026, BUILD_LOG 290).
   Warum: Beispieltests pruefen die Faelle, an die jemand gedacht hat; fast-check erzeugt zufaellige
   Eingaben und verkleinert einen Fehlschlag auf das kleinste Gegenbeispiel. Ziel sind Funktionen,
   die beliebige Eingaben des Lerners oder fremde Dateien verarbeiten (Rechner, Lernstand-Import,
   Antwort-Normalisierung, Tooltip-Zerlegung). Anlass: CodeQL-Fund js/double-escaping (BUILD_LOG 288)
   und die Scorecard-Pruefung „Fuzzing“, die fast-check erkennt. */
import { describe, expect, it } from "vitest";
import * as fc from "fast-check";
import { rechne } from "./rechner";
import { ausDatei, alsDatei } from "./lernstanddatei";
import { leererStand } from "./stand";
import { normAntwort } from "./bewertung";
import { normFreitext } from "./freitext";
import { tipTeile } from "./glossartip";

describe("Rechner", () => {
  it("wirft nie; ok heisst endliche Zahl", () => {
    fc.assert(fc.property(fc.string(), (s) => {
      const r = rechne(s);
      if (r.ok) expect(Number.isFinite(r.wert)).toBe(true);
      else expect(typeof r.fehler).toBe("string");
    }));
  });
  it("Summe und Produkt kleiner Ganzzahlen stimmen", () => {
    const zahl = fc.integer({ min: 0, max: 100_000 });
    fc.assert(fc.property(zahl, zahl, (a, b) => {
      expect(rechne(`${a}+${b}`)).toEqual({ ok: true, wert: a + b });
      expect(rechne(`${a}×${b}`)).toEqual({ ok: true, wert: a * b });
    }));
  });
});

describe("Lernstand-Import", () => {
  it("wirft nie, auch nicht bei beliebigem Text oder JSON", () => {
    fc.assert(fc.property(fc.oneof(fc.string(), fc.json()), (text) => {
      const r = ausDatei(text);
      expect(typeof r.ok).toBe("boolean");
    }));
  });
  it("wirft nie bei einer Datei mit richtigem Kopf und beliebigem Stand", () => {
    fc.assert(fc.property(fc.jsonValue(), (stand) => {
      const r = ausDatei(JSON.stringify({ format: "fisi-ap1-lernstand", fassung: 1, stand }));
      expect(typeof r.ok).toBe("boolean");
    }));
  });
  it("eigener Export kommt unveraendert zurueck", () => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 4_102_444_800_000 }), (jetzt) => {
      const stand = leererStand();
      const r = ausDatei(alsDatei(stand, jetzt, "0.0.0"));
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.stand).toEqual(stand);
    }));
  });
});

/** Zeichen, an denen Normalisierungen kippen: Leerraum, Satzzeichen, Ziffern, Umlaute. Reine
    Zufallstexte treffen solche Folgen selten (fc.string() fand den Fall unten in 100 Laeufen nicht). */
const knifflig = fc.string({ unit: fc.constantFrom("a", "R", "1", "0", " ", "\t", ".", ",", "!", "?", ";", "Ä", "ß", "ẞ", "-") });

describe("Normalisierung", () => {
  it("normFreitext ist idempotent", () => {
    fc.assert(fc.property(fc.oneof(fc.string(), knifflig), (s) => {
      const n = normFreitext(s);
      expect(normFreitext(n)).toBe(n);
    }));
  });
  // ⚠️ BEKANNT (26.11.2026, BUILD_LOG 290): normAntwort("Router .") = "router " – das Satzzeichen am Ende
  //    faellt, das Leerzeichen davor bleibt; gradeLuecke(["Router"], "Router .") ist darum false.
  //    Die Regel zu aendern ist ein Bewertungs-Entscheid des Nutzers (bewertung.gleichheit.test.ts
  //    vergleicht mit der alten App). Bis dahin steht der Test als `fails`: wird die Regel behoben,
  //    wird er rot und muss zu `it` werden.
  it.fails("normAntwort ist idempotent (bekannt: Leerzeichen vor Schlusspunkt)", () => {
    fc.assert(fc.property(knifflig, (s) => {
      const n = normAntwort(s);
      expect(normAntwort(n)).toBe(n);
    }));
  });
});

describe("Tooltip-Zerlegung", () => {
  it("die Teile ergeben zusammen wieder den Text", () => {
    const fall = fc.string({ minLength: 1 }).chain((text) =>
      fc.uniqueArray(fc.integer({ min: 0, max: text.length }), { maxLength: 8 }).map((p) => {
        const s = [...p].sort((a, b) => a - b);
        const treffer = [];
        for (let i = 0; i + 1 < s.length; i += 2) treffer.push({ start: s[i]!, end: s[i + 1]!, term: "t", def: "d" });
        return { text, treffer };
      }));
    fc.assert(fc.property(fall, ({ text, treffer }) => {
      const teile = tipTeile(text, treffer);
      expect(teile.map((t) => t.text).join("")).toBe(text);
      expect(teile.filter((t) => t.treffer).length).toBe(treffer.length);
    }));
  });
});
