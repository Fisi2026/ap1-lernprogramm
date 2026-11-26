/* Die Zusicherung hinter `Baukasten.zerlegeZeile`.

   Das Geruest traegt seine Luecken als Marke in eckigen Klammern. In den
   Pseudocode-Aufgaben stehen dort aber AUCH echte Feldzugriffe — gemessen am
   11.09.2026: zweimal `[0]`, einmal `[i]`. Wuerde die Zerlegung jede Klammer als
   Luecke nehmen, bekaeme `werte[0]` ein Auswahlfeld, und die Aufgabe waere kaputt.

   ⛔ Deshalb wird hier an ALLEN baukasten-Fragen gemessen:
      genau so viele Felder wie Ziele, jede Ziel-Nummer genau einmal,
      und kein fremder Klammer-Ausdruck wird zum Feld. */
import { describe, it, expect } from "vitest";
import { FRAGEN } from "@/daten/laden";
import { zerlegeZeile } from "./zeilen";

const OFFEN = String.fromCharCode(91);
const ZU = String.fromCharCode(93);

interface Ziel { nr?: number; loesung: string }

const BAUKASTEN = FRAGEN.filter((f) => f.typ === "baukasten");
const BESCHRIFTUNG = FRAGEN.filter((f) => f.typ === "beschriftung");

function marken(f: (typeof FRAGEN)[number]): string[] {
  const ziele: Ziel[] = "ziele" in f ? f.ziele : [];
  const nummern = new Set(ziele.map((z, i) => String(z.nr ?? i + 1)));
  const geruest = "geruest" in f ? f.geruest : [];
  return geruest.flatMap((z) =>
    zerlegeZeile(z, nummern).flatMap((t) => ("marke" in t ? [t.marke] : [])),
  );
}

describe("baukasten: das Geruest zerfaellt in genau die richtigen Luecken", () => {
  it("findet ueberhaupt Fragen dieses Typs", () => {
    expect(BAUKASTEN.length).toBeGreaterThan(0);
  });

  it(`jede der ${BAUKASTEN.length} Fragen hat genau so viele Felder wie Ziele, jedes genau einmal`, () => {
    const abweichung = BAUKASTEN.filter((f) => {
      const ziele: Ziel[] = "ziele" in f ? f.ziele : [];
      const m = marken(f);
      const erwartet = ziele.map((z, i) => String(z.nr ?? i + 1)).sort();
      return m.length !== ziele.length || m.slice().sort().join(",") !== erwartet.join(",");
    }).map((f) => `${f.id}: ${marken(f).join("|")}`);
    expect(abweichung).toEqual([]);
  });

  it("ein Feldzugriff im Pseudocode wird NICHT zur Luecke", () => {
    /* Der Fall, um den es geht — mit einer Ziel-Nummer, die es nicht gibt. */
    const zeile = "maximum = werte" + OFFEN + "0" + ZU + " UND " + OFFEN + "1" + ZU;
    const teile = zerlegeZeile(zeile, new Set(["1"]));
    expect(teile.filter((t) => "marke" in t)).toHaveLength(1);
    expect(teile.map((t) => ("marke" in t ? "<" + t.marke + ">" : t.text)).join("")).toBe(
      "maximum = werte" + OFFEN + "0" + ZU + " UND <1>",
    );
  });

  it("eine Zeile ohne Marke bleibt unveraendert", () => {
    const zeile = "ENDE FUNKTION";
    expect(zerlegeZeile(zeile, new Set(["1"])).map((t) => ("text" in t ? t.text : "?")).join("")).toBe(zeile);
  });
});

describe("beschriftung: die angezeigte Nummer ist nicht der Schluessel", () => {
  it("jede Loesung steht auch im Vorrat der Begriffe", () => {
    const fehlt = BESCHRIFTUNG.filter((f) =>
      ((f.ziele as Ziel[]) ?? []).some((z) => !((f.labels as string[]) ?? []).includes(z.loesung)),
    ).map((f) => f.id);
    expect(fehlt).toEqual([]);
  });

  it("mindestens eine Frage nummeriert NICHT von 1 aufwaerts — darauf ruht die Trennung von nr und Index", () => {
    const abweichend = BESCHRIFTUNG.filter((f) =>
      ((f.ziele as Ziel[]) ?? []).some((z, i) => z.nr !== i + 1),
    ).map((f) => f.id);
    expect(abweichend.length).toBeGreaterThan(0);
  });
});
