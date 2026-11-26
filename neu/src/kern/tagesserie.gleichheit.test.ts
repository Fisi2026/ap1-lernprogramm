/* ============================================================================
   N21: GLEICHHEITSBEWEIS FUER DIE TAGESSERIE

   ⛔ `app_util.js`, `app_pool.js`, `app_frage.js`, `app_seiten.js` und
      `app_pages2.js` laufen in einer node:vm WIRKLICH (Muster: N20a).
      Verglichen werden `schwaechstesGebiet` ueber viele Staende und die ZIEHUNG
      selbst: `sSerie` wird mit Attrappen fuer Oberflaeche und Loeser gefahren,
      beide Seiten bekommen dieselbe Zufallsfolge — dann muss dieselbe Serie
      herauskommen, Kennung fuer Kennung und in derselben Reihenfolge.
   ⚠️ Verglichen wird nur der ERSTE Aufbau. Dass die alte App das Gebiet danach
      neu rechnet, ist die gewollte Abweichung (tagesserie.ts, Kopf).
   ============================================================================ */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { FRAGEN as ALLE_FRAGEN } from "@/daten/laden";
import type { Frage } from "@/daten/typen";
import { leererStand } from "./stand";
import type { Lernstand } from "./stand";
import { schwaechstesGebiet, baueTagesserie } from "./tagesserie";
import { altQuelle } from "../testhilfe/altquelle";

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, "../../..");
const requireCjs = createRequire(import.meta.url);
const Lroh = requireCjs(altQuelle(WURZEL, "logik.js"));

/* E60 „je Fall“ (K2, BUILD_LOG 183/188): Fragen der drei AP2-Themen der Klausurvorbereitung sind NEU in THEMA_GEBIET –
   die alte App kennt sie nicht (Gebiet undefined) und rechnet das schwaechste Gebiet darum anders. Verglichen wird wie in
   lernen.gleichheit.test.ts nur der Bestand, fuer den alte und neue Regel gleich sein sollen. Seit M03-048 (VLAN, B2)
   wich Stand 46 ab; vorher war der Vergleich nur zufaellig gruen. */
const K2_THEMEN = new Set(["M06:RAID-Systeme", "M06:IDS/IPS", "M03:Netzwerktopologien"]);
const FRAGEN = ALLE_FRAGEN.filter((f) => !K2_THEMEN.has(f.modul + ":" + f.thema));
it("K2-Ausschluss trifft genau die AP2-Themen der Klausur", () => {
  const raus = ALLE_FRAGEN.length - FRAGEN.length;
  expect(raus).toBeGreaterThan(40);
  expect(ALLE_FRAGEN.filter((f) => K2_THEMEN.has(f.modul + ":" + f.thema)).every((f) => f.gebiet === "B2")).toBe(true);
});

const POOL_INDEX: Record<string, Frage> = {};
for (const f of FRAGEN) POOL_INDEX[f.id] = f;

function zufall(saat: number): () => number {
  let s = saat >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

const knoten = (): Record<string, unknown> => {
  const k: Record<string, unknown> = { style: {}, setAttribute: () => {}, classList: { add: () => {} } };
  k.appendChild = () => knoten();
  return k;
};

function alteApp() {
  const sandbox: Record<string, unknown> = {
    console, L: Lroh, POOL: FRAGEN, POOL_INDEX, S: leererStand(),
    document: {
      addEventListener: () => {}, getElementById: () => null, querySelector: () => null,
      querySelectorAll: () => [], createElement: knoten,
    },
    window: { addEventListener: () => {} },
    setTimeout, clearTimeout,
  };
  vm.createContext(sandbox);
  for (const datei of ["app_util.js", "app_pool.js", "app_frage.js", "app_seiten.js", "app_pages2.js"]) {
    try {
      vm.runInContext(fs.readFileSync(altQuelle(WURZEL, datei), "utf8"), sandbox, { filename: datei });
    } catch { /* Oberflaechen-Zeilen; Deklarationen sind gehoben – unten geprueft */ }
  }
  sandbox.POOL = FRAGEN;
  sandbox.POOL_INDEX = POOL_INDEX;
  /* Attrappen NACH dem Laden: die Deklarationen sind Eigenschaften des Kontexts. */
  sandbox.el = () => knoten();
  sandbox.abrufToggle = () => knoten();
  sandbox.loeseFrage = () => {};
  return sandbox as Record<string, any>;
}
const ALT = alteApp();

function mitStand(s: Lernstand, rng?: () => number) {
  ALT.S = JSON.parse(JSON.stringify(s));
  ALT.L = rng ? { ...Lroh, shuffle: (a: unknown[]) => Lroh.shuffle(a, rng) } : Lroh;
}

/** Zufaelliger, aber reproduzierbarer Stand: Statistik, Fehler-Deck, zuletzt gesehen. */
function standAus(saat: number): Lernstand {
  const r = zufall(saat * 7919);
  const st: Record<string, { richtig: number; gesamt: number }> = {};
  const deck: Lernstand["fehlerDeck"] = {};
  const zuletzt: string[] = [];
  const n = Math.floor(r() * 40);
  for (let i = 0; i < n; i++) {
    const f = FRAGEN[Math.floor(r() * FRAGEN.length)];
    const k = "T:" + f.modul + ":" + f.thema;
    const e = (st[k] ??= { richtig: 0, gesamt: 0 });
    e.gesamt++;
    if (r() < 0.6) e.richtig++;
    if (r() < 0.3) deck[f.id] = { streak: 0, due: 0 };
    if (r() < 0.5 && zuletzt.length < 50) zuletzt.push(f.id);
  }
  return { ...(leererStand() as Lernstand), statistik: st, fehlerDeck: deck, lastShown: zuletzt, inklAP2: r() < 0.3 };
}

describe("Die alte App ist wirklich geladen", () => {
  it("die verglichenen Funktionen existieren", () => {
    for (const n of ["schwaechstesGebiet", "sSerie", "mischeTypen", "poolAP"]) {
      expect(typeof ALT[n], n).toBe("function");
    }
  });
});

describe("schwaechstesGebiet", () => {
  it("300 Staende: dasselbe Gebiet, und mehr als zwei verschiedene Ergebnisse", () => {
    const gesehen = new Set<string>();
    for (let i = 1; i <= 300; i++) {
      const s = standAus(i);
      mitStand(s);
      const alt = ALT.schwaechstesGebiet();
      expect(schwaechstesGebiet(s, FRAGEN), "Stand " + i).toBe(alt);
      gesehen.add(alt);
    }
    expect(gesehen.size).toBeGreaterThan(2);
  });
});

describe("Die Ziehung", () => {
  it("300 Staende, gleiche Zufallsfolge: dieselbe Serie in derselben Reihenfolge", () => {
    let mitDeck = 0;
    for (let i = 1; i <= 300; i++) {
      const s = standAus(i);
      mitStand(s, zufall(i));
      ALT.serieAktiv = null;
      ALT.sSerie(knoten());
      const alt = ALT.serieAktiv as { gebiet: string; fragen: Frage[] } | null;
      expect(alt, "sSerie hat keine Serie gebaut (Stand " + i + ")").toBeTruthy();
      const neu = baueTagesserie(s, FRAGEN, zufall(i));
      expect(neu.gebiet, "Stand " + i).toBe(alt!.gebiet);
      expect(neu.ids, "Stand " + i).toEqual(alt!.fragen.map((f) => f.id));
      if (neu.ids.some((id) => (s.fehlerDeck as Record<string, unknown>)[id])) mitDeck++;
    }
    /* Sonst waere die Deck-Stufe nie verglichen worden. */
    expect(mitDeck).toBeGreaterThan(10);
  });
});
