/* ============================================================================
   DAS GANTT-TRAINING — Balkenplan planen (Bereich `gantt`)

   Gerechnet wird in `generatoren.ts` (seit N34 T5, vorher logik.js): `genGantt()` wuerfelt ein Szenario und laesst
   `ganttBerechne` die frueheste Terminplanung rechnen (Ende-Start-Beziehung,
   Tag 1 = Projektstart). ⛔ Hier wird davon NICHTS nachgebaut — nur geordnet,
   geprueft und verbucht.

   ⚠️ VERBUCHT WIRD WIE AUF DEM GENERATOR-SCHIRM, mit einem Unterschied, der im
      Verhalten steckt: **richtig ist der Durchgang ab 80 % der Felder**, nicht
      erst bei allen. So macht es `sGantt` in app_pages2.js, und das ist auch
      vernuenftig: 14 Zahlenfelder, ein Tippfehler soll nicht alles verwerfen.
   ============================================================================ */
import { genGantt } from "./generatoren.ts";
import type { Lernstand } from "./stand";
import { jsonKopie } from "./kopie.ts";
import { dayKey } from "./lernen.ts";

export interface GanttVorgang {
  id: string;
  name: string;
  dauer: number;
  vorgaenger: string[];
  /** Fruehester Start-/Endtag. */
  start: number;
  ende: number;
  /** Spaetester Start-/Endtag und der Gesamtpuffer dazwischen. */
  spStart: number;
  spEnde: number;
  puffer: number;
}

export interface GanttDaten {
  vorgaenge: GanttVorgang[];
  projektdauer: number;
  /** Die Vorgaenge mit Puffer 0 — der kritische Pfad. */
  kritisch: string[];
}

export interface GanttAufgabe {
  szenario: { titel: string; text: string };
  daten: GanttDaten;
}

/** Eine frische Aufgabe aus `generatoren.ts`. */
export function neueAufgabe(): GanttAufgabe {
  return genGantt();
}

/** Welches Feld einer Zeile gemeint ist. */
export type Feld = "start" | "ende";

/** Die Eingaben, nach Vorgangskennung und Feld. */
export type Eingaben = Record<string, { start?: string; ende?: string }>;

/* ⛔ DIESELBE NORMALISIERUNG WIE IN DER ALTEN APP, Zeichen fuer Zeichen:
   trimmen und das ERSTE Komma zu einem Punkt. Nicht mehr — "3 Tage" bleibt
   falsch, und das soll es auch. */
export function normZahl(s: string | undefined): string {
  return (s ?? "").trim().replace(",", ".");
}

export function istRichtig(v: GanttVorgang, feld: Feld, eingabe: string | undefined): boolean {
  return normZahl(eingabe) === String(feld === "start" ? v.start : v.ende);
}

export interface Pruefung {
  richtig: number;
  gesamt: number;
  /** Gerundete Prozent — die Zahl, an der das Verbuchen haengt. */
  quote: number;
  alleOk: boolean;
}

/** Zaehlt die richtigen Felder. Zwei je Vorgang, Start und Ende. */
export function pruefe(daten: GanttDaten, eingaben: Eingaben): Pruefung {
  let richtig = 0;
  let gesamt = 0;
  for (const v of daten.vorgaenge) {
    for (const feld of ["start", "ende"] as Feld[]) {
      gesamt++;
      if (istRichtig(v, feld, eingaben[v.id]?.[feld])) richtig++;
    }
  }
  const quote = gesamt ? Math.round((richtig / gesamt) * 100) : 0;
  return { richtig, gesamt, quote, alleOk: gesamt > 0 && richtig === gesamt };
}

/** Ab hier zaehlt der Durchgang als richtig (alte App: `quote >= 80`). */
export const BESTEHENSGRENZE = 80;

/** Bucht wie `sGantt`: die Zeile `GEN:gantt` und den Tageszaehler — kein Modul,
    kein Thema, kein Fehler-Deck. ⚠️ `richtig` haengt an der 80-Prozent-Grenze. */
export function verbucheGantt(stand: Lernstand, quote: number, jetzt: number = Date.now()): Lernstand {
  const s = jsonKopie(stand);
  const st = s.statistik;
  const e = (st["GEN:gantt"] ??= { richtig: 0, gesamt: 0 });
  e.gesamt++;
  if (quote >= BESTEHENSGRENZE) e.richtig++;
  const tag = dayKey(jetzt);
  const tage = s.dailyCounts;
  tage[tag] = (tage[tag] ?? 0) + 1;
  return s;
}

/** Der Loesungsweg, Zeile fuer Zeile — derselbe Satzbau wie in der alten App. */
export function loesungsweg(daten: GanttDaten): string[] {
  return daten.vorgaenge.map(
    (v) =>
      v.id + ": Start Tag " + v.start + ", Ende Tag " + v.ende +
      " (Dauer " + v.dauer +
      (v.vorgaenger.length ? ", frühestens nach " + v.vorgaenger.join("/") : ", ohne Vorgänger") +
      "), Puffer " + v.puffer,
  );
}

/** Wie eine Zelle des Balkenplans aussieht: Balken, Puffer oder leer.
    ⛔ Die drei Faelle stehen hier, nicht im Schirm: sie sind die Aussage des
       Bildes (rot = kritisch, blau = Balken mit Puffer, grau = der Puffer). */
export type Zelle = "kritisch" | "balken" | "puffer" | "leer";

export function zelle(v: GanttVorgang, tag: number): Zelle {
  if (tag >= v.start && tag <= v.ende) return v.puffer === 0 ? "kritisch" : "balken";
  if (tag > v.ende && tag <= v.spEnde) return "puffer";
  return "leer";
}
