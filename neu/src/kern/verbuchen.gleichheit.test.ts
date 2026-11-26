/* ============================================================================
   GLEICHHEITSBEWEIS FUER DAS VERBUCHEN

   `verbuchen.ts` ist die Zweitschrift von `app_verbuchen.js`. Ein Unterschied
   faellt hier NICHT sofort auf — er zeigt sich Wochen spaeter als "warum kommt
   diese Frage nie wieder" oder "warum bin ich immer noch auf Anfaenger".

   ⛔ Deshalb wird `app_verbuchen.js` in einer node:vm WIRKLICH AUSGEFUEHRT, mit
      Ersatz fuer alles, was es aus der alten Oberflaeche zieht (mutS, heute,
      istUnterricht, setFrageOffen, renderKopf, renderNav). Verglichen wird nicht
      stichprobenhaft, sondern ueber lange Antwortfolgen an echten Fragen aus dem
      Bestand — Zeichen fuer Zeichen ueber den GANZEN Stand.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { FRAGEN } from "@/daten/laden";
import type { Frage } from "@/daten/typen";
import { leererStand } from "./stand";
import type { Lernstand } from "./stand";
import { verbuche, istUnterricht, UNTERRICHT_MODUL } from "./verbuchen";
import { altQuelle } from "../testhilfe/altquelle";

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, "../../..");
const requireCjs = createRequire(import.meta.url);
const Lroh = requireCjs(altQuelle(WURZEL, "logik.js"));

/** Baut die ALTE Verbuchung nach — nicht nachgeschrieben, sondern ausgefuehrt. */
function alteVerbuchung() {
  const quelle = fs.readFileSync(altQuelle(WURZEL, "app_verbuchen.js"), "utf8");
  let stand: Lernstand;
  let jetzt = 0;
  const sandbox: Record<string, unknown> = {
    console,
    L: Lroh,
    /* Die Ersatzteile sind bewusst so knapp wie moeglich: je mehr hier nachgebaut
       wird, desto weniger beweist der Vergleich. */
    mutS: (fn: (s: Lernstand) => void) => fn(stand),
    heute: () => jetzt,
    istUnterricht: (f: { modul?: string }) => !!f && f.modul === UNTERRICHT_MODUL,
    setFrageOffen: () => {},
    renderKopf: () => {},
    renderNav: () => {},
  };
  vm.createContext(sandbox);
  vm.runInContext(quelle + "\n;globalThis.verbucheImSandbox = verbucheAntwort;", sandbox);
  const fn = sandbox.verbucheImSandbox as (f: unknown, korrekt: boolean, extra?: unknown) => void;
  return {
    verbuche(s: Lernstand, f: unknown, korrekt: boolean, zeit: number, extra?: unknown) {
      stand = JSON.parse(JSON.stringify(s)) as Lernstand;
      jetzt = zeit;
      fn(f, korrekt, extra);
      return stand;
    },
  };
}

const ALT = alteVerbuchung();

/** Ein Zufall mit Saat — damit eine Abweichung wiederholbar ist. */
function zufall(saat: number): () => number {
  let s = saat >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;  s >>>= 0;
    return s / 4294967296;
  };
}

const TAG = 24 * 60 * 60 * 1000;
const START = Date.UTC(2026, 8, 14, 8, 0, 0);

/* ⛔⛔ GEMESSEN AM 14.09.2026, UND DER TEST HAT ES GEFUNDEN:
   **Der Bestand enthaelt zur Zeit KEINE EINZIGE M09-Frage.** `pool_m09_unterricht.json`
   ist eine leere Liste — der klassenspezifische Stoff gehoerte zur Klausur vom
   31.07.2026 und wurde danach ausgeraeumt.
   ►► Das ist kein Fehler, aber es hat eine Folge, die zaehlt: der Zweig
      `fdTageFehlerUnterricht` (M09-Fehler sind SOFORT wieder faellig statt nach
      einem Tag) waere in einem Beweis, der nur den Bestand abfaehrt, **nie
      durchlaufen worden**. Gruen, und trotzdem blind — dieselbe Klasse wie der
      Freitext-Befund vom 11.09.
   ►► Deshalb bekommt jeder Lauf unten KUENSTLICHE M09-Fragen eingestreut. */
const M09_IM_BESTAND = FRAGEN.filter((f) => f.modul === "M09");

/** Eine Klausurvorbereitungs-Frage, wie sie zur naechsten Klausur wieder im Pool
    stuende. Nur Felder, die das Verbuchen ueberhaupt liest. */
function m09Frage(nr: number): Frage {
  return {
    id: "M09-" + String(nr).padStart(3, "0"),
    modul: "M09",
    thema: "Klausurvorbereitung " + ((nr % 4) + 1),
    typ: "mc",
  } as unknown as Frage;
}

describe("istUnterricht trifft dieselben Fragen wie app_pool.js", () => {
  it("erkennt eine M09-Frage und keine andere", () => {
    expect(istUnterricht(m09Frage(1))).toBe(true);
    expect(FRAGEN.slice(0, 50).some(istUnterricht)).toBe(false);
  });

  it("haelt fest, dass M09 derzeit LEER ist — aendert sich das, gehoert es gelesen", () => {
    /* Kein toBeGreaterThan(0): der Bestand hat heute 0 M09-Fragen, und das soll
       sichtbar bleiben statt als Annahme durchzurutschen. Kommen welche dazu,
       faellt dieser Test und jemand schaut hin. */
    expect(M09_IM_BESTAND.length).toBe(0);
    expect(FRAGEN.filter(istUnterricht).length).toBe(0);
  });
});

describe("Verbuchen ist zeichengleich mit app_verbuchen.js", () => {
  /* Fuenf Laeufe mit verschiedenen Saaten. Jeder Lauf zieht Fragen quer durch den
     Bestand, wuerfelt richtig/falsch und laesst die Tage weiterlaufen — nur so
     kommen Streak, Faelligkeit und Stufenwechsel ueberhaupt zum Tragen. */
  it.each([1, 2, 3, 4, 5])("Lauf mit Saat %i, 400 Antworten", (saat) => {
    const r = zufall(saat * 7919);
    let a = leererStand();
    let b = leererStand();
    const abweichung: string[] = [];

    for (let i = 0; i < 400 && abweichung.length === 0; i++) {
      /* Jede fuenfte Frage ist eine kuenstliche M09-Frage — sonst bleibt der
         Zweig `fdTageFehlerUnterricht` in diesem Beweis unberuehrt. */
      const f = i % 5 === 3 ? m09Frage(i % 17) : FRAGEN[Math.floor(r() * FRAGEN.length)];
      const korrekt = r() < 0.55;
      /* Die Zeit laeuft mit: ohne das wird keine Frage je wieder faellig. */
      const zeit = START + Math.floor(i / 8) * TAG + i * 1000;
      const extra = r() < 0.1 ? { keinFehlerDeck: true } : undefined;

      a = ALT.verbuche(a, f, korrekt, zeit, extra);
      b = verbuche(b, f, korrekt, {
        heute: zeit,
        keinFehlerDeck: !!(extra && extra.keinFehlerDeck),
      });

      const sa = JSON.stringify(a);
      const sb = JSON.stringify(b);
      if (sa !== sb) {
        abweichung.push(`Schritt ${i} (${f.id}, ${korrekt ? "richtig" : "falsch"})`);
      }
    }
    expect(abweichung).toEqual([]);
  });

  it("wirkt auch wirklich — ein leerer Stand bleibt nach 400 Antworten nicht leer", () => {
    const r = zufall(4711);
    let b = leererStand();
    for (let i = 0; i < 400; i++) {
      const f = i % 5 === 3 ? m09Frage(i % 17) : FRAGEN[Math.floor(r() * FRAGEN.length)];
      b = verbuche(b, f, r() < 0.55, { heute: START + Math.floor(i / 8) * TAG });
    }
    expect(Object.keys(b.statistik).length).toBeGreaterThan(10);
    expect(Object.keys(b.fehlerDeck).length).toBeGreaterThan(10);
    expect(Object.keys(b.themaLevel).length).toBeGreaterThan(10);
    expect(Object.keys(b.dailyCounts).length).toBeGreaterThan(1);
    /* und der M09-Zweig wurde wirklich beruehrt */
    expect(Object.keys(b.fehlerDeck).some((id) => id.startsWith("M09-"))).toBe(true);
    expect(b.antworten.length).toBe(30);
    /* mindestens ein Thema muss aufgestiegen sein, sonst misst der Lauf die
       Stufenlogik gar nicht */
    expect(Object.values(b.themaLevel).some((v) => (v as number) > 1)).toBe(true);
  });
});
