/* K2 Etappe A (docs/plaene/PLAN_KLAUSUR2.md), seit K3 L1 (docs/plaene/PLAN_KLAUSUR3.md) am Set K3: das Klausur-Set und seine Ziehung – gemessenes Verhalten. */
import { describe, it, expect } from "vitest";
import { FRAGEN } from "@/daten/laden";
import { leererStand } from "./stand";
import type { Lernstand } from "./stand";
import { nachDemZiehen } from "./ziehen";
import { GENERATOREN } from "./generatoren.ts";
import {
  KLAUSUR_SET, KLAUSUR_GENERATOR_TAKT, klausurBestand, klausurIds, leseSet, zieheFuerKlausur, waehleThemaNachPunkten,
  type KlausurSet,
} from "./klausur";

const POOL = new Map(FRAGEN.map((f) => [f.id, f]));
const nachId = (id: string) => POOL.get(id);
const JETZT = Date.UTC(2026, 9, 14, 8, 0, 0);

function zufall(saat: number): () => number {
  let s = saat >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

function lauf(stand: Lernstand, themen: number[], n: number, set: KlausurSet = KLAUSUR_SET) {
  const rng = zufall(7);
  let s = stand;
  const zuege = [];
  for (let i = 0; i < n; i++) {
    const z = zieheFuerKlausur({ stand: s, alle: FRAGEN, nachId, letzteThemen: [], serie: [], heute: JETZT, set, themen, rng });
    zuege.push(z);
    if (z.zug) s = nachDemZiehen(s, z.zug, z.frage);
  }
  return { zuege, stand: s };
}

describe("K3 Klausur-Set", () => {
  it("das Set hat sieben Themen mit 78 Klausurpunkten, jede Kennung zeigt auf eine Frage im Pool", () => {
    expect(KLAUSUR_SET.themen.map((t) => t.nr)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(KLAUSUR_SET.themen.map((t) => t.punkte)).toEqual([21, 6, 13, 8, 8, 12, 10]);
    expect(KLAUSUR_SET.datum).toBe("2026-11-27");
    for (const t of klausurBestand(KLAUSUR_SET, nachId)) {
      expect(t.fehlend, "Thema " + t.nr).toEqual([]);
      expect(t.anzahl, "Thema " + t.nr).toBeGreaterThan(0);
    }
  });

  it("je Thema keine doppelte Kennung; Generatoren gibt es wirklich", () => {
    for (const t of KLAUSUR_SET.themen) {
      expect(new Set(t.ids).size, "Thema " + t.nr).toBe(t.ids.length);
      if (t.generator) expect(GENERATOREN[t.generator], t.generator).toBeTruthy();
    }
    expect(KLAUSUR_SET.themen.filter((t) => t.generator).map((t) => t.nr)).toEqual([1, 2, 4, 6]);   /* K3-E38: dhcpbereich, usv, raidk3, netzteil */
    const alle = KLAUSUR_SET.themen.flatMap((t) => t.ids);
    expect(new Set(alle).size, "keine Kennung in zwei Themen").toBe(alle.length);
  });

  it("ein kaputtes Set wird leer, nicht still halb gelesen", () => {
    const fehler = console.error;
    console.error = () => {};
    try {
      expect(leseSet(null).themen).toEqual([]);
      expect(leseSet({ name: "x", datum: "y", themen: [{ nr: "1", titel: "t", generator: null, ids: [] }] }).themen).toEqual([]);
    } finally { console.error = fehler; }
  });
});

describe("Ziehung im Set", () => {
  it("zieht nur aus den gewaehlten Themen – auch wenn der Ueben-Bereich auf ein anderes Gebiet steht", () => {
    const s: Lernstand = { ...leererStand(), gebiete: ["A5"], uebenAP: "ap1" };
    const erlaubt = klausurIds(KLAUSUR_SET, [3]);
    const { zuege } = lauf(s, [3], 60);
    const ids = zuege.flatMap((z) => (z.ergebnis.art === "pool" ? [z.ergebnis.id] : []));
    expect(ids.length).toBe(60);   // Thema 3 hat keinen Generator
    for (const id of ids) expect(erlaubt.has(id), id).toBe(true);
  });

  it("AP2-Fragen des Sets werden gezogen, obwohl der Ueben-Bereich auf AP1 steht", () => {
    const s: Lernstand = { ...leererStand(), uebenAP: "ap1", levelModus: "manuell", level: 4 };
    const ap2 = [...klausurIds(KLAUSUR_SET, [4])].filter((id) => POOL.get(id)?.pruefungsteil === "AP2");
    expect(ap2.length).toBeGreaterThan(0);
    const { zuege } = lauf(s, [4], 200);
    const gezogen = new Set(zuege.flatMap((z) => (z.ergebnis.art === "pool" ? [z.ergebnis.id] : [])));
    expect(ap2.some((id) => gezogen.has(id))).toBe(true);
  });

  it("K2-E18: mit USV/RAID jede fuenfte eine Rechenaufgabe, ohne Generator-Thema keine", () => {
    const mit = lauf(leererStand(), [2, 4], 50).zuege;
    const takte = mit.flatMap((z, i) => (z.ergebnis.art === "zufall" ? [i + 1] : []));
    expect(takte.length).toBe(50 / KLAUSUR_GENERATOR_TAKT);
    for (const t of takte) expect(t % KLAUSUR_GENERATOR_TAKT).toBe(3);
    for (const z of mit) if (z.ergebnis.art === "zufall") expect(["usv", "raidk3"]).toContain(z.ergebnis.aufgabe.generatorArt);   /* K3-E38: Thema 2 usv, Thema 4 raidk3 */
    const ohne = lauf(leererStand(), [3], 50).zuege;   /* Thema 3 Switching hat keinen Generator */
    expect(ohne.some((z) => z.ergebnis.art === "zufall")).toBe(false);
  });

  it("ist das Set durch, wird NUR das Set neu gemischt – das uebrige Deck bleibt", () => {
    const fremd = FRAGEN.find((f) => !klausurIds(KLAUSUR_SET, []).has(f.id))!;
    const s: Lernstand = { ...leererStand(), seen: { [fremd.id]: true } };
    const n = klausurIds(KLAUSUR_SET, [2]).size;   // Redundanz: kleinstes Thema
    const { stand } = lauf(s, [2], n * 3 + 2);
    expect(stand.seen[fremd.id]).toBe(true);
  });

  it("leere Auswahl = alle Themen", () => {
    expect(klausurIds(KLAUSUR_SET, []).size).toBe(new Set(KLAUSUR_SET.themen.flatMap((t) => t.ids)).size);
  });

  it("K3-E54: ueber alle Themen kommen Fragen ungefaehr nach Klausurpunkten (DHCP 21 P. am haeufigsten)", () => {
    const { zuege } = lauf(leererStand(), [], 600);
    const nachThema = new Map<number, number>();
    for (const z of zuege) {
      if (z.ergebnis.art !== "pool") continue;
      const id = z.ergebnis.id;
      const t = KLAUSUR_SET.themen.find((x) => x.ids.includes(id))!;
      nachThema.set(t.nr, (nachThema.get(t.nr) ?? 0) + 1);
    }
    const n = [...nachThema.values()].reduce((a, b) => a + b, 0);
    expect(n).toBe(480);   // jede fuenfte ist eine RAID-Rechenaufgabe (K2-E18)
    /* Erwartung je Thema = Punkte/78; Fehler-Deck und Serie gibt es hier nicht, also nur Zufallsstreuung */
    for (const t of KLAUSUR_SET.themen) {
      const anteil = (nachThema.get(t.nr) ?? 0) / n;
      expect(Math.abs(anteil - t.punkte! / 78), "Thema " + t.nr).toBeLessThan(0.06);
    }
  });
});

describe("waehleThemaNachPunkten", () => {
  const T = [{ nr: 1, titel: "a", generator: null, punkte: 3, ids: ["x"] }, { nr: 2, titel: "b", generator: null, ids: ["y"] }];
  it("teilt [0,1) nach Punkten auf; ohne Punkte zaehlt ein Thema wie 1", () => {
    expect(waehleThemaNachPunkten(T, () => 0)?.nr).toBe(1);
    expect(waehleThemaNachPunkten(T, () => 0.74)?.nr).toBe(1);
    expect(waehleThemaNachPunkten(T, () => 0.75)?.nr).toBe(2);
    expect(waehleThemaNachPunkten(T, () => 0.9999)?.nr).toBe(2);
    expect(waehleThemaNachPunkten([], () => 0.5)).toBeUndefined();
  });
});
