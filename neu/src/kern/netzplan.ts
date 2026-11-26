/* ============================================================================
   DAS NETZPLAN-TRAINING (Bereich `netzplan`)

   `genNetzplan()` (`generatoren.ts`, seit N34 T5; vorher logik.js) wuerfelt ein Szenario und rechnet die Termine
   (`netzplanBerechne`). ⛔ Hier wird davon NICHTS nachgebaut — geordnet wird
   nur: pruefen, verbuchen, und wo die Knoten liegen.

   ⚠️ FUENF FELDER JE VORGANG, NICHT SECHS: FAZ, FEZ, SAZ, SEZ, GP. Die Dauer ist
      vorgegeben, und der freie Puffer FP entfaellt (Nutzer-Entscheid 22.07.2026).
      Das Knotenschema ist das, was der Pool lehrt und M01-970 als Hotspot abfragt:
        oben   FAZ | Dauer | FEZ
               Vorgangsname
        unten  SAZ |  GP   | SEZ
   ⛔ DIE ZAHLEN BEGINNEN BEI 0 (FAZ des ersten Vorgangs), anders als beim
      Gantt-Training, wo Tag 1 der Projektstart ist. Beides kommt aus `generatoren.ts`
      und wird hier NICHT angeglichen.
   ============================================================================ */
import { genNetzplan } from "./generatoren.ts";
import type { Lernstand } from "./stand";
import { jsonKopie } from "./kopie.ts";
import { dayKey } from "./lernen.ts";

export interface NetzplanVorgang {
  id: string;
  name: string;
  dauer: number;
  vorgaenger: string[];
  nachfolger: string[];
  faz: number;
  fez: number;
  saz: number;
  sez: number;
  /** Gesamtpuffer. 0 heisst: kritischer Weg. */
  gp: number;
  /** Freier Puffer — vorhanden, aber bewusst nicht abgefragt. */
  fp: number;
}

export interface NetzplanDaten {
  vorgaenge: NetzplanVorgang[];
  projektdauer: number;
  kritisch: string[];
}

export interface NetzplanAufgabe {
  szenario: { titel: string; text: string };
  daten: NetzplanDaten;
  /** Der Loesungsweg, Zeile fuer Zeile — kommt fertig aus `generatoren.ts`. */
  weg: string[];
}

/** Die fuenf abgefragten Felder, in der Reihenfolge des Knotenschemas. */
export const FELDER = ["faz", "fez", "saz", "sez", "gp"] as const;
export type Feld = (typeof FELDER)[number];

export type Eingaben = Record<string, Partial<Record<Feld, string>>>;

export function neueAufgabe(): NetzplanAufgabe {
  return genNetzplan();
}

/* ⛔ DIESELBE NORMALISIERUNG WIE IN `sNetzplan`, UND SIE IST EINE ANDERE ALS BEIM
   GANTT: hier faellt zusaetzlich ein angehaengtes ",0" / ".0" weg, dort nicht.
   Nachgemessen am Quelltext beider Schirme — nicht angeglichen, weil ein
   Angleichen eine Verhaltensaenderung waere, die niemand entschieden hat. */
const NACHKOMMA_NULLEN = /\.0+$/;

export function normZahl(s: string | undefined): string {
  return (s ?? "").trim().replace(",", ".").replace(NACHKOMMA_NULLEN, "");
}

export function istRichtig(v: NetzplanVorgang, feld: Feld, eingabe: string | undefined): boolean {
  return String(v[feld]) === normZahl(eingabe);
}

export interface Pruefung {
  richtig: number;
  gesamt: number;
  quote: number;
  alleOk: boolean;
}

/** Zaehlt die richtigen Felder — fuenf je Vorgang. */
export function pruefe(daten: NetzplanDaten, eingaben: Eingaben): Pruefung {
  let richtig = 0;
  let gesamt = 0;
  for (const v of daten.vorgaenge) {
    for (const feld of FELDER) {
      gesamt++;
      if (istRichtig(v, feld, eingaben[v.id]?.[feld])) richtig++;
    }
  }
  const quote = gesamt ? Math.round((richtig / gesamt) * 100) : 0;
  return { richtig, gesamt, quote, alleOk: gesamt > 0 && richtig === gesamt };
}

/** Wie beim Gantt: ab 80 Prozent zaehlt der Durchgang als richtig. */
export const BESTEHENSGRENZE = 80;

export function verbucheNetzplan(
  stand: Lernstand, quote: number, jetzt: number = Date.now(),
): Lernstand {
  const s = jsonKopie(stand);
  const st = s.statistik;
  const e = (st["GEN:netzplan"] ??= { richtig: 0, gesamt: 0 });
  e.gesamt++;
  if (quote >= BESTEHENSGRENZE) e.richtig++;
  const tag = dayKey(jetzt);
  const tage = s.dailyCounts;
  tage[tag] = (tage[tag] ?? 0) + 1;
  return s;
}

/* ----------------------------------------------------------------- Anordnung */
/** Wo ein Knoten liegt — Spalte = Tiefe im Abhaengigkeitsnetz, Zeile = Platz darin.

    ⛔ DIE ALTE APP HAT DIE PLAETZE FEST VERDRAHTET (`POS = {A:[10,15], …}`) und
       verliesse sich darauf, dass jedes Szenario genau A bis F heisst. Das stimmt
       heute (nachgemessen: 40 Zuege, immer dieselben sechs Kennungen) — aber ein
       siebter Vorgang laege still auf Position 0,0 uebereinander.
    ►► Hier wird die Spalte GERECHNET: ein Vorgang steht so weit rechts, wie sein
       laengster Weg von einem Startvorgang lang ist. Damit ordnet sich jedes
       Szenario selbst, und die Pfeile zeigen immer nach rechts. */
export interface Platz {
  id: string;
  spalte: number;
  zeile: number;
}

export function anordnung(daten: NetzplanDaten): Platz[] {
  const tiefe = new Map<string, number>();
  const nachId = new Map(daten.vorgaenge.map((v) => [v.id, v]));

  /* Laengster Weg von vorn. Ein Zyklus kann hier nicht entstehen (die Daten
     kommen aus einer Vorwaertsrechnung), die Schranke faengt ihn trotzdem. */
  function tief(id: string, schranke = 0): number {
    if (tiefe.has(id)) return tiefe.get(id)!;
    const v = nachId.get(id);
    if (!v || schranke > daten.vorgaenge.length) return 0;
    const t = v.vorgaenger.length
      ? Math.max(...v.vorgaenger.map((p) => tief(p, schranke + 1) + 1))
      : 0;
    tiefe.set(id, t);
    return t;
  }

  const belegt = new Map<number, number>();
  return daten.vorgaenge.map((v) => {
    const spalte = tief(v.id);
    const zeile = belegt.get(spalte) ?? 0;
    belegt.set(spalte, zeile + 1);
    return { id: v.id, spalte, zeile };
  });
}

/** Eine Kante von Vorgaenger zu Nachfolger — fuer die Pfeile. */
export interface Kante {
  von: string;
  nach: string;
}

export function kanten(daten: NetzplanDaten): Kante[] {
  const k: Kante[] = [];
  for (const v of daten.vorgaenge) {
    for (const p of v.vorgaenger) k.push({ von: p, nach: v.id });
  }
  return k;
}
