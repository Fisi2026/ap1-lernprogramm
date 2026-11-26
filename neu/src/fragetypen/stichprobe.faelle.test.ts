/* N43 M3 (Mutationstest fragetypen): die feste Stichprobe von eingabe.test.tsx ist DATEN – ein
   Eintrag, der zu "" oder zu einer unbekannten ID wird, liesse die Bedienpruefung still weniger
   Fragen sehen. Hier: jede ID gibt es, gehoert zum Typ ihrer Liste, kommt einmal vor; die Liste ist
   nicht leer und hoechstens 25 lang. */
import { describe, expect, it } from "vitest";
import { FRAGEN } from "@/daten/laden";
import { STICHPROBE } from "./eingabe.stichprobe";

describe("STICHPROBE", () => {
  const eintraege = Object.entries(STICHPROBE) as Array<[string, readonly string[]]>;

  it("hat Listen und jede ist nicht leer und hoechstens 25 lang", () => {
    expect(eintraege.length).toBeGreaterThan(0);
    for (const [typ, ids] of eintraege) {
      expect(ids.length, typ).toBeGreaterThan(0);
      expect(ids.length, typ).toBeLessThanOrEqual(25);
    }
  });

  it("jede ID gibt es im Bestand und sie hat den Typ der Liste (bild: unterTyp)", () => {
    const nachId = new Map(FRAGEN.map((f) => [f.id, f]));
    const falsch: string[] = [];
    for (const [typ, ids] of eintraege) {
      for (const id of ids) {
        const f = nachId.get(id) as { typ: string; unterTyp?: string } | undefined;
        if (!f) { falsch.push(`${typ}: ${id} fehlt`); continue; }
        const typDerFrage = f.typ === "bild" ? f.unterTyp : f.typ;
        if (typDerFrage !== typ && f.typ !== typ) falsch.push(`${typ}: ${id} ist ${f.typ}/${f.unterTyp}`);
      }
    }
    expect(falsch).toEqual([]);
  });

  it("keine ID steht zweimal in einer Liste", () => {
    for (const [typ, ids] of eintraege) expect(new Set(ids).size, typ).toBe(ids.length);
  });
});
