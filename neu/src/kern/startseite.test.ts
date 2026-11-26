/* N22: die Startseite — jede Zahl gemessen, nichts erfunden. */
import { CONFIG, TAG_MS } from "./tabellen/konfig.ts";
import { describe, it, expect } from "vitest";
import { FRAGEN } from "@/daten/laden";
import { gebietName } from "./lernen";
import { leererStand } from "./stand";
import type { Lernstand } from "./stand";
import { kacheln, standZeile, aktivitaet14, quoteJeGebiet, poolZahlen } from "./startseite";
import { tagVon } from "./tagesserie";

const JETZT = new Date(2026, 8, 17, 10, 0).getTime();
const TAG = TAG_MS;
const leer = () => leererStand() as Lernstand;
const ziele = (s: Lernstand) => kacheln(s, FRAGEN, JETZT).map((k) => k.ziel);
const kachel = (s: Lernstand, z: string) => kacheln(s, FRAGEN, JETZT).find((k) => k.ziel === z);

describe("Kacheln", () => {
  it("leerer Stand: Reihenfolge, keine Zahl-Badges, Tagesserie offen", () => {
    expect(ziele(leer())).toEqual(["ueben", "serie", "fd", "sim", "gen", "netzplan", "gantt", "glossar", "spickzettel", "stat", "einst"]);
    const alle = kacheln(leer(), FRAGEN, JETZT);
    expect(alle.filter((k) => k.badge).map((k) => [k.ziel, k.badge])).toEqual([["serie", "heute offen"]]);
    expect(alle.some((k) => k.badge === "NEU")).toBe(false);
    expect(alle.filter((k) => k.hero).map((k) => k.ziel)).toEqual(["ueben"]);
  });
  it("Tagesserie: Gebiet im Text, nach Abschluss kein Badge, dafür der Hinweis", () => {
    expect(kachel(leer(), "serie")!.sub).toContain(gebietName("A1"));
    const s = { ...leer(), serieDone: tagVon(JETZT) };
    expect(kachel(s, "serie")!.badge).toBeUndefined();
    expect(kachel(s, "serie")!.sub).toMatch(/Heute schon absolviert\.$/);
  });
  it("Markiert erscheint erst mit Markierung, hinter der Tagesserie, mit Anzahl", () => {
    const [a, b] = FRAGEN;
    const s = { ...leer(), markiert: { [a.id]: 1, [b.id]: 1, "WEG-1": 1 } };
    expect(ziele(s).slice(0, 4)).toEqual(["ueben", "serie", "markiert", "fd"]);
    expect(kachel(s, "markiert")!.badge).toBe("2");
  });
  it("Fehler-Deck: Badge = jetzt fällige Karten, nicht alle im Deck", () => {
    const [a, b, c] = FRAGEN;
    const s = { ...leer(), fehlerDeck: {
      [a.id]: { streak: 0, due: JETZT - TAG }, [b.id]: { streak: 0, due: JETZT - 1 }, [c.id]: { streak: 0, due: JETZT + TAG },
    } };
    expect(kachel(s, "fd")!.badge).toBe("2");
  });
  it("Glossar erwähnt die Abkürzungen erst hinter dem Tor", () => {
    expect(kachel(leer(), "glossar")!.sub).not.toContain("Abkürzungs");
    const st: Lernstand["statistik"] = { M01: { richtig: 1, gesamt: CONFIG.gate + 1 } };
    expect(kachel({ ...leer(), statistik: st }, "glossar")!.sub).toContain("Abkürzungs");
  });
});

describe("Dein Stand", () => {
  it("leer: keine Quote, keine Bereitschaft, keine Simulation", () => {
    expect(standZeile(leer(), JETZT)).toEqual({
      bereitschaft: null, heute: 0, tagesziel: (leer().tagesziel as number), quote: null, faellig: 0, letzteSimulation: null,
    });
  });
  it("mit Daten: heute, Quote, letzte Simulation, Bereitschaft", () => {
    const f = FRAGEN[0];
    const s: Lernstand = {
      ...leer(),
      dailyCounts: { [tagVon(JETZT)]: 7, [tagVon(JETZT - TAG)]: 3 },
      statistik: { [f.modul]: { richtig: 3, gesamt: 4 }, ["T:" + f.modul + ":" + f.thema]: { richtig: 3, gesamt: 4 } },
      simHistorie: [{ datum: "2026-09-01", prozent: 40 }, { datum: "2026-09-02", prozent: 63 }],
    };
    const z = standZeile(s, JETZT);
    expect(z.heute).toBe(7);
    expect(z.quote).toBe(75);
    expect(z.letzteSimulation).toBe(63);
    expect(z.bereitschaft).not.toBeNull();
    expect(typeof z.bereitschaft!.score).toBe("number");
  });
});

describe("Aktivität, Quote je Gebiet, Pool", () => {
  it("14 Tage, ältester zuerst, heute zuletzt", () => {
    const s = { ...leer(), dailyCounts: { [tagVon(JETZT)]: 5, [tagVon(JETZT - 13 * TAG)]: 2, [tagVon(JETZT - 14 * TAG)]: 9 } };
    const a = aktivitaet14(s, JETZT);
    expect(a).toHaveLength(14);
    expect(a[13]).toEqual({ tag: tagVon(JETZT), anzahl: 5 });
    expect(a[0]).toEqual({ tag: tagVon(JETZT - 13 * TAG), anzahl: 2 });
    expect(a.reduce((x, t) => x + t.anzahl, 0)).toBe(7);
  });
  it("Quote je Gebiet: ohne M9, null ohne Antwort", () => {
    const f = FRAGEN.find((x) => x.gebiet === "A3")!;
    const s = { ...leer(), statistik: { ["T:" + f.modul + ":" + f.thema]: { richtig: 1, gesamt: 3 } } };
    const q = quoteJeGebiet(s);
    expect(q.map((g) => g.code)).not.toContain("M9");
    expect(q.find((g) => g.code === "A3")).toMatchObject({ richtig: 1, gesamt: 3, quote: 33 });
    expect(q.find((g) => g.code === "A1")!.quote).toBeNull();
  });
  it("Pool: AP1 + AP2 = gesamt", () => {
    const p = poolZahlen(FRAGEN);
    expect(p.gesamt).toBe(FRAGEN.length);
    expect(p.ap1 + p.ap2).toBe(p.gesamt);
    expect(p.ap2).toBeGreaterThan(0);
  });
});

describe("kacheln ohne Pool (N38 P1, E63)", () => {
  it("gleiche Kacheln, aber ohne Gebietsname und ohne Markiert-Zahl", () => {
    const s = { ...leer(), markiert: { [FRAGEN[0]!.id]: 1 } };
    const mit = kacheln(s, FRAGEN, JETZT);
    const ohne = kacheln(s, null, JETZT);
    expect(ohne.map((k) => k.ziel)).toEqual(mit.map((k) => k.ziel));
    expect(ohne.find((k) => k.ziel === "serie")!.sub.startsWith("5 Fragen")).toBe(true);
    expect(ohne.find((k) => k.ziel === "markiert")!.badge).toBeUndefined();
    expect(mit.find((k) => k.ziel === "markiert")!.badge).toBe("1");
  });
});
