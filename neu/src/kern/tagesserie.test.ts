/* ============================================================================
   N21: DIE TAGESSERIE — die Regel, gemessen am echten Bestand und an gebauten
   Faellen. Der Vergleich mit der alten App steht in tagesserie.gleichheit.test.ts.
   ⚠️ Wo der Bestand einen Fall nicht erreicht (Rest-Stufe, leeres Gebiet), wird
      er GEBAUT — und der Test sagt es.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import { FRAGEN } from "@/daten/laden";
import type { Frage } from "@/daten/typen";
import { leererStand } from "./stand";
import type { Lernstand } from "./stand";
import {
  schwaechstesGebiet, baueTagesserie, mischeTypen, typVon, passtAP,
  serieHeuteErledigt, markiereSerieErledigt, TAGESSERIE_LAENGE,
} from "./tagesserie";

function zufall(saat: number): () => number {
  let s = saat >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

const ersteIn = (g: string) => FRAGEN.find((f) => f.gebiet === g)!;
/** Stand mit `gesamt` Antworten (davon `richtig`) in einem Feinthema des Gebiets. */
function mit(s: Lernstand, g: string, richtig: number, gesamt: number): Lernstand {
  const f = ersteIn(g);
  const st = { ...s.statistik };
  st["T:" + f.modul + ":" + f.thema] = { richtig, gesamt };
  return { ...s, statistik: st };
}
const leer = () => leererStand() as Lernstand;

describe("schwaechstesGebiet", () => {
  it("neuer Lerner: das erste Gebiet in GEBIETE-Reihenfolge (A1)", () => {
    expect(schwaechstesGebiet(leer(), FRAGEN)).toBe("A1");
  });
  it("unter fuenf Antworten ueberall: das am wenigsten geuebte", () => {
    let s = leer();
    for (const g of ["A1", "A2", "A3", "A4"]) s = mit(s, g, 3, 3);
    expect(schwaechstesGebiet(s, FRAGEN)).toBe("A5");
  });
  it("ab fuenf Antworten zaehlt die Quote; vier Antworten zaehlen nicht", () => {
    let s = leer();
    s = mit(s, "A1", 4, 5);
    s = mit(s, "A3", 1, 5);
    s = mit(s, "A2", 0, 4);
    expect(schwaechstesGebiet(s, FRAGEN)).toBe("A3");
  });
  it("AP2-Gebiete nur mit inklAP2", () => {
    let s = leer();
    for (const g of ["A1", "A2", "A3", "A4", "A5"]) s = mit(s, g, 1, 1);
    expect(schwaechstesGebiet(s, FRAGEN)).toBe("A1");
    expect(schwaechstesGebiet({ ...s, inklAP2: true }, FRAGEN)).toBe("B1");
  });
  it("ohne Fragen: Rueckfall A1 (gebauter Fall, der Bestand erreicht ihn nicht)", () => {
    const nurAP2 = FRAGEN.filter((f) => f.pruefungsteil === "AP2");
    expect(nurAP2.length).toBeGreaterThan(0);
    expect(schwaechstesGebiet(leer(), nurAP2)).toBe("A1");
    expect(baueTagesserie(leer(), nurAP2).ids).toEqual([]);
  });
});

describe("baueTagesserie am Bestand", () => {
  let s = leer();
  for (const g of ["A1", "A2", "A3", "A5"]) s = mit(s, g, 5, 6);
  s = mit(s, "A4", 1, 6);
  const a4 = FRAGEN.filter((f) => f.gebiet === "A4");
  const a1 = ersteIn("A1");
  const deck: Lernstand["fehlerDeck"] = { [a1.id]: { streak: 0, due: 0 } };
  for (const f of a4.slice(0, 4)) deck[f.id] = { streak: 0, due: 0 };
  const gesehen = a4.slice(4, 30).map((f) => f.id);
  const stand: Lernstand = { ...s, fehlerDeck: deck, lastShown: gesehen };
  const POOL: Record<string, Frage> = {};
  for (const f of FRAGEN) POOL[f.id] = f;

  it("200 Anlaeufe: Gebiet A4, fuenf verschiedene, genau zwei aus dem Deck, nichts Gesehenes", () => {
    expect(a4.length - 30).toBeGreaterThan(TAGESSERIE_LAENGE);
    for (let i = 1; i <= 200; i++) {
      const t = baueTagesserie(stand, FRAGEN, zufall(i));
      expect(t.gebiet).toBe("A4");
      expect(t.ids.length).toBe(TAGESSERIE_LAENGE);
      expect(new Set(t.ids).size).toBe(t.ids.length);
      for (const id of t.ids) {
        expect(POOL[id].gebiet).toBe("A4");
        expect(passtAP(stand, POOL[id])).toBe(true);
        expect(gesehen).not.toContain(id);
      }
      expect(t.ids.filter((id) => deck[id]).length).toBe(2);
    }
  });
  it("veraendert den Stand nicht", () => {
    const vorher = JSON.stringify(stand);
    baueTagesserie(stand, FRAGEN, zufall(7));
    expect(JSON.stringify(stand)).toBe(vorher);
  });
});

describe("baueTagesserie: die Stufen (gebauter Fall)", () => {
  const basis = FRAGEN.filter((f) => f.gebiet === "A4").slice(0, 7);
  const [d1, d2, d3, fr1, fr2, r1, r2] = basis.map((f) => f.id);
  const stand: Lernstand = {
    ...leer(),
    fehlerDeck: { [d1]: { streak: 0, due: 0 }, [d2]: { streak: 0, due: 0 }, [d3]: { streak: 0, due: 0 } },
    lastShown: [r1, r2],
  };
  it("zwei Deck + beide frischen + eine gesehene", () => {
    for (let i = 1; i <= 50; i++) {
      const t = baueTagesserie(stand, basis, zufall(i));
      expect(t.gebiet).toBe("A4");
      expect(t.ids.length).toBe(5);
      expect(t.ids.filter((id) => [d1, d2, d3].includes(id)).length).toBe(2);
      expect(t.ids).toContain(fr1);
      expect(t.ids).toContain(fr2);
      expect(t.ids.filter((id) => [r1, r2].includes(id)).length).toBe(1);
    }
  });
});

describe("mischeTypen", () => {
  const mc = FRAGEN.filter((f) => f.typ === "mc").slice(0, 2);
  const lt = FRAGEN.filter((f) => f.typ === "lueckentext").slice(0, 2);
  const bildMc = FRAGEN.find((f) => f.typ === "bild" && (!f.unterTyp || f.unterTyp === "mc"));
  it("zwei Typen je zweimal: nie zwei gleiche nebeneinander", () => {
    expect(mc.length + lt.length).toBe(4);
    for (let i = 1; i <= 100; i++) {
      const out = mischeTypen([...mc, ...lt], zufall(i));
      expect(out.map((f) => f.id).sort()).toEqual([...mc, ...lt].map((f) => f.id).sort());
      for (let k = 1; k < out.length; k++) expect(typVon(out[k])).not.toBe(typVon(out[k - 1]));
    }
  });
  it("eine Bildfrage zaehlt als ihr Unter-Typ", () => {
    expect(bildMc, "Bestand hat keine Bildfrage mit mc").toBeTruthy();
    expect(typVon(bildMc!)).toBe("mc");
    for (let i = 1; i <= 100; i++) {
      const out = mischeTypen([bildMc!, mc[0], ...lt], zufall(i));
      for (let k = 1; k < out.length; k++) expect(typVon(out[k])).not.toBe(typVon(out[k - 1]));
    }
  });
});

describe("serieDone", () => {
  it("merkt sich den Tag, am naechsten Tag wieder offen", () => {
    const jetzt = new Date(2026, 8, 17, 10, 0).getTime();
    const s = markiereSerieErledigt(leer(), jetzt);
    expect(s.serieDone).toBe("2026-09-17");
    expect(serieHeuteErledigt(s, jetzt)).toBe(true);
    expect(serieHeuteErledigt(s, jetzt + 24 * 3600 * 1000)).toBe(false);
    expect(serieHeuteErledigt(leer(), jetzt)).toBe(false);
  });
});
