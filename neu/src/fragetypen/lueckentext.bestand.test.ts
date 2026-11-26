/* Die Zusicherung hinter `Lueckentext.tsx`.

   Die Eingabe setzt die Felder MITTEN IN DEN SATZ, indem sie den Fragetext an
   `___` zerlegt. Das geht nur auf, solange jede Frage genau so viele Platzhalter
   traegt wie sie Luecken hat. Steht das nirgends geschrieben, zeichnet ein
   spaeterer Pool-Eintrag stillschweigend eine Luecke zu wenig — und niemand
   merkt es, weil die Komponente dann still auf die Notdarstellung umschaltet.

   ⛔ Deshalb wird es hier gemessen, nicht angenommen. */
import { describe, it, expect } from "vitest";
import { FRAGEN } from "@/daten/laden";
import { PLATZHALTER, zerlegen } from "./luecken";

const LUECKENFRAGEN = FRAGEN.filter(
  (f) => f.typ === "lueckentext" || (f.typ === "bild" && f.unterTyp === "lueckentext"),
);

describe("lueckentext: Platzhalter und Luecken decken sich", () => {
  it("findet ueberhaupt Fragen dieses Typs", () => {
    expect(LUECKENFRAGEN.length).toBeGreaterThan(0);
  });

  it(`jede der ${LUECKENFRAGEN.length} Fragen traegt genau so viele "${PLATZHALTER}" wie Luecken`, () => {
    const abweichung = LUECKENFRAGEN.filter((f) => {
      const luecken = (f.luecken as string[][]) ?? [];
      return zerlegen(f.frage).length !== luecken.length + 1;
    }).map((f) => `${f.id}: ${zerlegen(f.frage).length - 1} Platzhalter, ${(f.luecken as string[][]).length} Luecken`);
    expect(abweichung).toEqual([]);
  });

  it("keine Frage schreibt die Luecke anders (zwei, vier oder mehr Unterstriche)", () => {
    const anders = LUECKENFRAGEN.filter((f) =>
      (f.frage.match(/_{2,}/g) ?? []).some((t) => t !== PLATZHALTER),
    ).map((f) => f.id);
    expect(anders).toEqual([]);
  });

  it("jede Luecke bietet mindestens eine akzeptierte Schreibweise", () => {
    const leer = LUECKENFRAGEN.filter((f) =>
      ((f.luecken as string[][]) ?? []).some((l) => !Array.isArray(l) || l.length === 0),
    ).map((f) => f.id);
    expect(leer).toEqual([]);
  });
});
