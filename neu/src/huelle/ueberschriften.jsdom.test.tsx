// @vitest-environment jsdom
/* ============================================================================
   WAECHTER: DIE UEBERSCHRIFTEN-EBENEN JE BEREICH (N25 P7, 22.09.2026)

   Gemessen am 22.09. vor dem Umbau: `glossar` und `spickzettel` sprangen von h1
   direkt auf h3, weil Radix' AccordionPrimitive.Header ein <h3> rendert und der
   Kopf die h1 traegt. `markiert` und `meldungen` sagten ihren Namen zweimal -
   einmal als h1 im Kopf, einmal als h2 im Schirm. Beides sind Nutzer-Entscheide
   vom 22.09.2026: Accordion auf Ebene 2, zweite Ueberschrift zu Text.

   DREI ZUSICHERUNGEN JE BEREICH:
     1. genau EINE h1 (der Kopf)
     2. KEIN Ebenensprung groesser als 1
     3. keine zwei aufeinanderfolgenden Ueberschriften mit demselben Text

   GRENZE, DIE DIESER WAECHTER NICHT MISST: nur der Grundzustand je Bereich, so
   wie der Lerner ihn zuerst sieht. Was erst nach dem Aufklappen erscheint (die
   Markdown-h3 im Spickzettel, die Auswertung der Simulation) sieht er nicht.
   ============================================================================ */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import App from "@/App";
import { BEREICHE } from "@/kern/route";

interface Kopf { stufe: number; text: string }

function ueberschriften(): Kopf[] {
  return screen.queryAllByRole("heading").map((h) => ({
    stufe: Number(h.getAttribute("aria-level") || h.tagName.replace("H", "")),
    text: (h.textContent || "").replace(/\s+/g, " ").trim(),
  }));
}

function oeffne(bereich: string) {
  cleanup();
  localStorage.clear();
  history.replaceState(null, "", "#" + bereich);
  render(<App />);
}

beforeEach(() => { cleanup(); localStorage.clear(); });

describe("Die Ueberschriften-Ebenen je Bereich", () => {
  it.each(BEREICHE.map((b) => [b]))("%s: eine h1, keine Spruenge, keine Dopplung", (bereich) => {
    oeffne(bereich);
    const hs = ueberschriften();
    expect(hs.length, bereich + ": gar keine Ueberschrift").toBeGreaterThan(0);

    const einsen = hs.filter((h) => h.stufe === 1);
    expect(einsen.length, bereich + ": h1 genau einmal, ist " + JSON.stringify(einsen.map((h) => h.text))).toBe(1);
    expect(hs[0].stufe, bereich + ": die erste Ueberschrift ist nicht die h1").toBe(1);

    for (let i = 1; i < hs.length; i++) {
      expect(
        hs[i].stufe - hs[i - 1].stufe,
        bereich + ": Sprung h" + hs[i - 1].stufe + " -> h" + hs[i].stufe + " bei " + JSON.stringify(hs[i].text),
      ).toBeLessThanOrEqual(1);
      expect(
        hs[i].text === hs[i - 1].text,
        bereich + ": zwei Ueberschriften hintereinander sagen dasselbe: " + JSON.stringify(hs[i].text),
      ).toBe(false);
    }
  });
});
