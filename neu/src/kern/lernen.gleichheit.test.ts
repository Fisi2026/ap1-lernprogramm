/* ============================================================================
   N34 T3 (E50, E53, 26.09.2026): GLEICHHEITSBEWEIS FUER `lernen.ts` UND `zufall.ts`
   Gegen `L` aus `referenz/logik.js` (eingefroren).
   ⛔ Zufall wird GESEEDET: beide Seiten bekommen je Fall einen frischen, gleichen Generator –
      gleiche Ziehung heisst gleiche Zahlenfolge verbraucht, nicht nur gleiches Ergebnis.
   ⛔ Zustandsfunktionen (adaptivBuchen, fdOn*) laufen als lange Zufallsfolge auf zwei getrennten
      Kopien; nach JEDEM Schritt muessen Rueckgabe UND mutierter Zustand gleich sein.
   ⛔ Exportmenge fest (LEHREN B151); Node laedt beide Dateien nativ (E49).
   ============================================================================ */
import { describe, it, expect } from "vitest";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { altQuelle } from "../testhilfe/altquelle";
import { FRAGEN } from "@/daten/laden";
import * as lernen from "./lernen.ts";
import * as zufall from "./zufall.ts";
import { GEBIETE } from "./tabellen/gebiete.ts";

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, "../../..");
const req = createRequire(import.meta.url);
type Fn = (...a: unknown[]) => unknown;
type Lx = Record<string, Fn>;
const QUELLEN: Array<[string, Lx]> = [
  ["referenz/logik.js", req(altQuelle(WURZEL, "logik.js")) as Lx],
];
const LERNEN = ["deckPick", "gebietFuer", "gebietName", "gewichteFrage", "ampelFuer", "themaKeyTeile", "statProGebiet",
  "bereitschaft", "themaKey", "themaStufe", "blockFuerStufe", "adaptivBuchen", "fdOnWrong", "fdOnCorrect", "fdDue", "dayKey"];
const ZUFALL = ["shuffle", "pick", "pickGewichtet"];

function seed(s: number): () => number {
  let a = s >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const klon = <T,>(x: T): T => (x === undefined ? x : JSON.parse(JSON.stringify(x)) as T);
const K = lernen as unknown as Record<string, Fn>;
const Z = zufall as unknown as Record<string, Fn>;
const IDS = FRAGEN.map((f) => f.id);
/* E60 „je Fall“ (K2, 14.10.2026, BUILD_LOG 183): drei AP2-Themen der Klausurvorbereitung sind NEU in THEMA_GEBIET/
   THEMA_RELEVANZ (tabellen.gleichheit.test.ts, NEU_K2) – die alte App kennt sie nicht (Gebiet undefined, Gewicht Standard).
   Ihre Fragen werden darum nicht mit der alten App verglichen, sondern auf die neue Regel geprueft (Gebiet B2). */
const K2_THEMEN = new Set(["M06:RAID-Systeme", "M06:IDS/IPS", "M03:Netzwerktopologien", "M04:Netzwerktopologien"]);
const istK2 = (f: { modul?: unknown; thema?: unknown }) => K2_THEMEN.has(String(f.modul) + ":" + String(f.thema));
const THEMEN = [...new Set(FRAGEN.filter((f) => !istK2(f)).map((f) => f.modul + ":" + f.thema))];

it("die Exportmenge ist genau die gepruefte Liste", () => {
  expect(Object.keys(lernen).sort()).toEqual([...LERNEN].sort());
  expect(Object.keys(zufall).sort()).toEqual([...ZUFALL].sort());
  expect(IDS.length).toBeGreaterThan(1000);
});

describe.each(QUELLEN)("gleich %s", (_name, L) => {
  it("jede Funktion hat ihr Gegenstueck in L", () => {
    for (const n of [...LERNEN, ...ZUFALL]) expect(typeof L[n], n).toBe("function");
  });

  it("Zufall: shuffle, pick, pickGewichtet – gleiche Ziehung bei gleichem Samen", () => {
    for (let s = 1; s <= 300; s++) {
      const arr = IDS.slice(s, s + (s % 40));
      expect(Z.shuffle!(arr, seed(s)), "shuffle " + s).toEqual(L.shuffle!(arr, seed(s)));
      expect(Z.pick!(arr, seed(s)), "pick " + s).toEqual(L.pick!(arr, seed(s)));
      const gw = (id: string) => (s % 7 === 0 ? 0 : (id.charCodeAt(id.length - 1) % 5) - 1);
      expect(Z.pickGewichtet!(arr, gw, seed(s)), "pickGewichtet " + s).toEqual(L.pickGewichtet!(arr, gw, seed(s)));
    }
    expect(Z.pickGewichtet!(null, () => 1)).toBe(L.pickGewichtet!(null, () => 1));
    /* Randfall der Grenze `z < 0`: Zufall genau 0 und ein Gewicht 0 vorn – die Karte mit Gewicht 0 darf NICHT kommen */
    for (const gw of [[0, 1, 1], [0, 0, 2], [1, 0, 0], [2, 3, 0]]) {
      const ids = ["a", "b", "c"], f = (id: string) => gw[ids.indexOf(id)];
      for (const z of [0, 0.3333333333333333, 0.5, 0.999999]) expect(Z.pickGewichtet!(ids, f, () => z), String(gw) + " " + z).toBe(L.pickGewichtet!(ids, f, () => z));
    }
  });

  it("deckPick: gleiche Karte, gleicher Reset, gleiches seen – ueber 600 gewuerfelte Lagen", () => {
    for (let s = 1; s <= 600; s++) {
      const r = seed(s * 7);
      const n = Math.floor(r() * 30);
      const kand = IDS.slice(s % 900, s % 900 + n);
      const seen: Record<string, boolean> = {};
      kand.forEach((id) => { if (r() < (s % 3 === 0 ? 1 : 0.6)) seen[id] = true; });
      const last = kand.filter(() => r() < 0.4);
      const frist = [null, undefined, 0, 1, 3, 10, 50][s % 7];
      const gw = s % 2 ? (id: string) => lernen.gewichteFrage(FRAGEN.find((f) => f.id === id) ?? {}, { relevanzAn: true }) : undefined;
      const a = K.deckPick!(kand, klon(seen), last, frist, seed(s), gw);
      const b = L.deckPick!(kand, klon(seen), last, frist, seed(s), gw);
      expect(a, "deckPick " + s).toEqual(b);
    }
    expect(K.deckPick!([], null, null)).toEqual(L.deckPick!([], null, null));
  });

  it("Gebiet, Name, Gewicht: gleich fuer JEDE Frage des Pools", () => {
    const ctxe = [undefined, {}, { relevanzAn: true }, { relevanzAn: true, adaptivAktiv: true, themaStat: () => ({ richtig: 3, gesamt: 40 }) },
      { adaptivAktiv: true, themaStat: () => null }, { letzteThemen: FRAGEN.slice(0, 50).map((f) => f.thema) }];
    const k2 = FRAGEN.filter(istK2);
    expect(k2.length).toBeGreaterThanOrEqual(48);
    for (const f of k2) { expect(K.gebietFuer!(f), f.id).toBe("B2"); expect(L.gebietFuer!(f), f.id).toBeUndefined(); }
    for (const f of FRAGEN.filter((x) => !istK2(x))) {
      expect(K.gebietFuer!(f), f.id).toBe(L.gebietFuer!(f));
      for (const c of ctxe) expect(K.gewichteFrage!(f, c), f.id).toBe(L.gewichteFrage!(f, c));
    }
    for (const c of [...GEBIETE.map((g) => g[0]), "XX", ""]) expect(K.gebietName!(c)).toBe(L.gebietName!(c));
    expect(K.gebietFuer!(null)).toBe(L.gebietFuer!(null));
    expect(K.gebietFuer!({ modul: "M09", thema: "x" })).toBe(L.gebietFuer!({ modul: "M09", thema: "x" }));
  });

  it("Statistik: ampelFuer, themaKeyTeile, statProGebiet, bereitschaft", () => {
    for (const v of [null, undefined, -1, 0, 59, 60, 61, 80, 81, 100, NaN]) expect(K.ampelFuer!(v), String(v)).toBe(L.ampelFuer!(v));
    for (const k of ["T:M01:Thema", "T:M03:a:b:c", "x", "", "T:"]) expect(K.themaKeyTeile!(k)).toEqual(L.themaKeyTeile!(k));
    for (let s = 1; s <= 200; s++) {
      const r = seed(s);
      const stat: Record<string, unknown> = {};
      for (const t of THEMEN) if (r() < 0.3) { const g = Math.floor(r() * 20); stat["T:" + t] = { richtig: Math.floor(r() * (g + 1)), gesamt: g }; }
      stat["T:M09:Wertschöpfung"] = { richtig: 1, gesamt: 2 }; stat["T:MXX:unbekannt"] = { richtig: 1, gesamt: 1 }; stat["M:M01"] = { richtig: 1, gesamt: 1 };
      if (s % 5 === 0) stat["T:M01:leer"] = null;
      expect(K.statProGebiet!(stat), "stat " + s).toEqual(L.statProGebiet!(stat));
      expect(K.bereitschaft!(stat), "ber " + s).toEqual(L.bereitschaft!(stat));
    }
    expect(K.bereitschaft!(undefined)).toEqual(L.bereitschaft!(undefined));
  });
});

describe.each(QUELLEN)("gleich %s – Zustand und Zeit", (_name, L) => {
  it("adaptive Stufe: themaKey, themaStufe, blockFuerStufe und 3000 gebuchte Antworten, Zustand nach jedem Schritt", () => {
    for (const [m, t] of [["M01", "a"], [1, null], [undefined, "x"]]) expect(K.themaKey!(m, t)).toBe(L.themaKey!(m, t));
    for (const st of [0, 1, 2, 3, 4, 5, -1]) expect(K.blockFuerStufe!(st)).toBe(L.blockFuerStufe!(st));
    const lv: Array<Record<string, unknown> | undefined> = [undefined, {}, { k: 2 }, { k: 9 }, { k: "3" }, { k: NaN }, { k: 2.6 }];
    for (const l of lv) for (const start of [undefined, 1, 3, 7, NaN, "2"]) expect(K.themaStufe!(l, "k", start)).toBe(L.themaStufe!(l, "k", start));
    const r = seed(42);
    let ka: Record<string, unknown> = {}, kt: Record<string, boolean[]> = {}, la: Record<string, unknown> = {}, lt: Record<string, boolean[]> = {};
    for (let i = 0; i < 3000; i++) {
      const key = "M0" + Math.floor(r() * 3) + "|t" + Math.floor(r() * 2);
      const richtig = r() < 0.6;
      const start = [undefined, 1, 2, 4][i % 4];
      const a = K.adaptivBuchen!(ka, kt, key, richtig, start) as { levels: typeof ka; track: typeof kt; stufe: number };
      const b = L.adaptivBuchen!(la, lt, key, richtig, start) as { levels: typeof la; track: typeof lt; stufe: number };
      expect(a.stufe, "Schritt " + i).toBe(b.stufe);
      expect(ka).toEqual(la); expect(kt).toEqual(lt);
      expect(a.levels).toBe(ka); expect(b.levels).toBe(la);   /* in-place, wie in logik.js */
      ka = a.levels; kt = a.track; la = b.levels; lt = b.track;
    }
    expect(K.adaptivBuchen!(null, null, "k", true)).toEqual(L.adaptivBuchen!(null, null, "k", true));
  });

  it("Fehler-Deck: 3000 Schritte falsch/richtig/faellig, Zustand und faellige Liste gleich", () => {
    const r = seed(7);
    const kd: Record<string, unknown> = {}, ld: Record<string, unknown> = {};
    let jetzt = 1_789_600_000_000;
    for (let i = 0; i < 3000; i++) {
      const id = IDS[Math.floor(r() * 40)]!;
      jetzt += Math.floor(r() * 3) * 86_400_000;
      const w = r();
      if (w < 0.4) {
        const tage = [undefined, 0, 1, 2.5, "3"][i % 5];
        expect(K.fdOnWrong!(kd, id, jetzt, tage)).toBe(kd); L.fdOnWrong!(ld, id, jetzt, tage);
      } else { expect(K.fdOnCorrect!(kd, id, jetzt)).toBe(kd); L.fdOnCorrect!(ld, id, jetzt); }
      expect(kd, "Schritt " + i).toEqual(ld);
      expect(K.fdDue!(kd, jetzt)).toEqual(L.fdDue!(ld, jetzt));
    }
    expect(K.fdDue!(null, 0)).toEqual(L.fdDue!(null, 0));
    expect(K.fdOnCorrect!(undefined, "x", 0)).toEqual(L.fdOnCorrect!(undefined, "x", 0));
  });

  it("dayKey: gleich ueber Jahreswechsel, Sommerzeit und Mitternacht", () => {
    const zeiten = [0, 1_789_600_000_000, Date.UTC(2026, 11, 31, 22, 59), Date.UTC(2026, 11, 31, 23, 1), Date.UTC(2026, 2, 29, 0, 30), Date.UTC(2026, 9, 25, 1, 30), "2026-09-26T00:00:00"];
    for (let s = 0; s < 500; s++) zeiten.push(1_700_000_000_000 + s * 3_600_000 * 7);
    for (const t of zeiten) expect(K.dayKey!(t), String(t)).toBe(L.dayKey!(t));
  });
});

it("Node laedt beide Dateien nativ per require (E49)", () => {
  const dateien = ["lernen.ts", "zufall.ts"].map((d) => path.join(hier, d));
  const skript = "for (const p of JSON.parse(process.argv[1])) console.log(Object.keys(require(p)).sort().join(','))";
  const r = spawnSync(process.execPath, ["-e", skript, JSON.stringify(dateien)], { encoding: "utf8" });
  expect(r.status, r.stderr).toBe(0);
  expect(r.stdout.trim().split(/\r?\n/)).toEqual([Object.keys(lernen).sort().join(","), Object.keys(zufall).sort().join(",")]);
});
