/* ============================================================================
   K3 (docs/plaene/PLAN_KLAUSUR3.md K3-E9/E38, 24.11.2026): DIE VIER NEUEN GENERATOR-ARTEN
   Ohne Gegenstueck in `referenz/logik.js` – darum hier gegen eine UNABHAENGIG
   hingeschriebene Rechnung und ueber viele Samen geprueft: ganzzahlige Loesung,
   Loesungsweg, Felder, und die eigene Musterloesung wird als richtig bewertet.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import { GENERATOREN, K3_ARTEN, NETZTEIL_GROESSEN, genDhcpBereich, genNetzteil, genRaidK3, genUsv } from "./generatoren.ts";
import { aufgabeDerArt, alleRichtig, felder, arten } from "./generator";
import { leererStand } from "./stand";

function seed(s: number): () => number {
  let a = s >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const SAMEN = 2000;
const zahlen = (text: string): number[] => (text.match(/\d+(?:,\d+)?/g) ?? []).map((z) => Number(z.replace(",", ".")));

describe("K3-Arten in GENERATOREN", () => {
  it("stehen alle vier drin, mit Stufe und Namen", () => {
    expect(K3_ARTEN).toEqual(["raidk3", "usv", "dhcpbereich", "netzteil"]);
    for (const a of K3_ARTEN) {
      expect(GENERATOREN[a], a).toBeDefined();
      expect(GENERATOREN[a]!.stufe).toBe(3);
      expect(GENERATOREN[a]!.name.length).toBeGreaterThan(3);
    }
  });
  it("kommen beim normalen Ueben ohne Auswahl in Frage (K3-E56)", () => {
    const moeglich = arten(leererStand());
    for (const a of K3_ARTEN) expect(moeglich, a).toContain(a);
  });
  it.each(K3_ARTEN)("%s: jede Aufgabe ist vollstaendig und die eigene Loesung gilt als richtig", (art) => {
    for (let s = 1; s <= SAMEN; s++) {
      const a = aufgabeDerArt(leererStand(), art, seed(s))!;
      expect(a.frage!.length).toBeGreaterThan(20);
      expect(a.weg!.length).toBeGreaterThanOrEqual(3);
      const f = felder(a);
      expect(f.length).toBe(2 + (art === "raidk3" ? 1 : 0));
      for (const akz of f) expect(Number.isInteger(Number(akz[0])), art + "#" + s + " " + akz[0]).toBe(true);
      expect(alleRichtig(a, f.map((x) => x[0]!))).toBe(true);
      expect(alleRichtig(a, f.map(() => "0"))).toBe(false);
    }
  });
});

describe("Rechnung unabhaengig nachgerechnet", () => {
  const RAID: Record<string, [(n: number, s: number) => number, number, number]> = {
    "RAID 0": [(n, s) => n * s, 0, 2], "RAID 1": [(_n, s) => s, 1, 2], "RAID 5": [(n, s) => (n - 1) * s, 1, 3],
    "RAID 6": [(n, s) => (n - 2) * s, 2, 4], "RAID 10": [(n, s) => n * s / 2, 1, 4], "RAID 0+1": [(n, s) => n * s / 2, 1, 4],
  };
  it("raidk3: Kapazitaet, Ausfalltoleranz, Mindestanzahl; alle sechs Stufen kommen vor", () => {
    const gesehen = new Set<string>();
    for (let s = 1; s <= SAMEN; s++) {
      const a = genRaidK3(seed(s));
      const typ = /(RAID 0\+1|RAID 10|RAID \d)/.exec(a.frage!)![1]!;
      gesehen.add(typ);
      const [n, gb] = zahlen(a.frage!.replace(/RAID [\d+]+/g, ""));
      const [f, tol, min] = RAID[typ]!;
      expect(n!).toBeGreaterThanOrEqual(min);
      expect(a.antwort2!.map((x) => x[0])).toEqual([String(f(n!, gb!)), String(tol), String(min)]);
    }
    expect([...gesehen].sort()).toEqual(Object.keys(RAID).sort());
  });
  it("usv: P = Summe × (1 + Reserve), S = P ÷ cos phi", () => {
    for (let s = 1; s <= SAMEN; s++) {
      const a = genUsv(seed(s));
      const geraete = [...a.frage!.matchAll(/(\d+) W/g)].map((m) => Number(m[1]));
      const reserve = Number(/mit (\d+) %/.exec(a.frage!)![1]);
      const pf = Number(/ist (0,\d)/.exec(a.frage!)![1]!.replace(",", "."));
      const p = geraete.reduce((x, y) => x + y, 0) * (100 + reserve) / 100;
      expect(Number(a.antwort2![0]![0])).toBe(p);
      expect(Math.abs(Number(a.antwort2![1]![0]) - p / pf)).toBeLessThan(1e-9);
    }
  });
  it("dhcpbereich: Groesse inkl. Grenzen, frei = Groesse − Ausschluss − Reservierungen; Split 80/20", () => {
    let split = 0;
    for (let s = 1; s <= SAMEN; s++) {
      const a = genDhcpBereich(seed(s));
      const okt = [...a.frage!.matchAll(/\.(\d+) bis [\d.]+\.(\d+)/g)].map((m) => [Number(m[1]), Number(m[2])] as const);
      const [von, bis] = okt[0]!;
      const groesse = bis - von + 1;
      if (/Split-Scope/.test(a.frage!)) {
        split++;
        expect(a.antwort2!.map((x) => Number(x[0]))).toEqual([groesse * 0.8, groesse * 0.2]);
      } else {
        const [exV, exB] = okt[1]!;
        expect(exV).toBeGreaterThanOrEqual(von); expect(exB).toBeLessThanOrEqual(bis);
        const res = Number(/es (\d+) Reservierungen/.exec(a.frage!)![1]);
        expect(a.antwort2!.map((x) => Number(x[0]))).toEqual([groesse, groesse - (exB - exV + 1) - res]);
      }
      expect(bis).toBeLessThanOrEqual(254);
    }
    expect(split).toBeGreaterThan(SAMEN / 4);
    expect(split).toBeLessThan(SAMEN * 3 / 4);
  });
  it("netzteil: Summe × (1 + Reserve), kleinstes lieferbares Netzteil darueber", () => {
    for (let s = 1; s <= SAMEN; s++) {
      const a = genNetzteil(seed(s));
      const teil = a.frage!.split("Geplant")[0]!;
      const watt = [...teil.matchAll(/(\d+) W(?!\))/g)].map((m) => Number(m[1]));
      const reserve = Number(/mit (\d+) %/.exec(a.frage!)![1]);
      const p = watt.reduce((x, y) => x + y, 0) * (100 + reserve) / 100;
      const g = NETZTEIL_GROESSEN.find((x) => x >= p)!;
      expect(a.antwort2!.map((x) => Number(x[0])), a.frage).toEqual([p, g]);
    }
  });
});
