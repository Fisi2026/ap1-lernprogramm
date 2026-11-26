/* ============================================================================
   DIE PRUEFUNGSSIMULATION — DIE APP-SCHICHT (Bereich `sim`)

   Vier Aufgaben, 100 Punkte, eine Zeit. ⛔ GERECHNET WIRD IN `kern/pruefung.ts` (seit N34 T4,
   26.09.2026, E55 – vorher in logik.js): `baueAP1Pruefung` zieht die Fragen, `aufgabeVon` ordnet
   sie den vier Aufgaben zu, `gradeSim` bewertet, `simErgebnis` rechnet Punkte, Prozent und Note.
   Diese Datei reicht Pool, Faelle und Lernstand hinein und ordnet nur.

   ⛔⛔ DIESE REGELN STANDEN FRUEHER IN `app_seiten.js` UND `app_sim.js` — also in
      der alten Oberflaeche. Sie hierher zu KOPIEREN waere eine zweite Fassung
      derselben Ziehung gewesen; das Projekt hat an genau dieser Stelle schon
      einmal Lehrgeld gezahlt (27.08.2026: eine zweite Typenliste neben
      `TYP.simAuto`, 23 Fragen still ausgeschlossen). Deshalb gibt es genau EINE
      Quelle: erst logik.js (16.09.), seit T4 `kern/pruefung.ts`.
   ⚠️ DIE FAELLE KOMMEN AUS `pool/pool_faelle.json`, NICHT AUS `faelle.js`: das ist
      ein Bauergebnis, und wer das Bauergebnis liest, merkt nicht, wenn der Bau
      schiefgeht (dieselbe Begruendung wie in `daten/laden.ts`).
   ============================================================================ */
import { CONFIG } from "./tabellen/konfig.ts";
import { AP1_AUFGABEN as AP1_TABELLE } from "./tabellen/pruefung.ts";
import { gradeSim } from "./bewertung.ts";
import {
  aufgabeVon, baueAP1Pruefung, istFallTeil, metaFuer, simBewertbar, simErgebnis, wuerfelPunkte,
  type Ergebnis, type SimFrage,
} from "./pruefung.ts";
import { FRAGETYPEN, type Frage, type SimKarte } from "@/daten/typen";
import type { Fall } from "@/daten/faelle";
import type { Lernstand } from "./stand";
import { jsonKopie } from "./kopie.ts";
import { dayKey, fdOnWrong } from "./lernen.ts";

export type { Ergebnis } from "./pruefung.ts";
/** In welche der vier Aufgaben eine Frage faellt (0 bis 3) · Teilaufgabe einer Fallaufgabe? ·
    in der Simulation automatisch bewertbar? – gerechnet in `pruefung.ts`. */
export { aufgabeVon, istFallTeil, simBewertbar };

export interface AP1Aufgabe {
  nr: number;
  titel: string;
  punkte: number;
  module: string[];
}

/** Die vier Aufgaben der AP1 — aus kern/tabellen/pruefung.ts, nicht hier noch einmal geschrieben. */
export const AP1_AUFGABEN: AP1Aufgabe[] = AP1_TABELLE;

/** Die Punkteverteilung fuer einen Lauf — gewuerfelt, Summe 100.
    ⚠️ Die echte AP1 vergibt je Aufgabe 20 bis 30 Punkte; die frueher fest
       verdrahteten 25/25/26/24 waren nur EINE moegliche Auspraegung. */
export function punkteVerteilung(): number[] {
  return wuerfelPunkte(
    AP1_AUFGABEN.length,
    CONFIG.ap1PunkteMin,
    CONFIG.ap1PunkteMax,
    CONFIG.ap1PunkteSumme,
  );
}

export interface Pruefung {
  /** Pool-Fragen UND Teilaufgaben einer Fallaufgabe (diese ohne `gebiet`, siehe `SimKarte`). */
  fragen: SimKarte[];
  /** Das fortgeschriebene Wiederholungs-Gedaechtnis — gehoert in den Lernstand. */
  benutzt: string[];
}

/** Baut eine Pruefung. Der Bestand und das Gedaechtnis kommen von aussen. */
export function bauePruefung(
  stand: Lernstand,
  anzahl: number,
  punkte: number[],
  alle: readonly Frage[],
  faelle: readonly Fall[],   /* N37 U1: Bestand und Faelle kommen von aussen – `kern/` laedt keinen Pool */
): Pruefung {
  const p = baueAP1Pruefung<Frage>({
    pool: alle,
    faelle,
    benutzt: stand.simUsedIds || [],
    anzahl,
    punkte,
  });
  return { fragen: p.fragen.filter(istSimKarte), benutzt: p.benutzt };
}

/** N38: die GRENZE von `SimFrage` (lose) zu `SimKarte` – gleiche Tiefe wie `istFrage` beim Laden
    (Kennung, Text, Thema, bekannter Typ), nur ohne `gebiet`, das die Fall-Teile nicht haben.
    ⚠️ Ein Satz, der hier scheitert, faellt heraus (laut, wie beim Laden). Gemessen 30.09.2026:
       alle 45 Teilaufgaben der 9 Faelle bestehen (`simulation.test.ts`). */
export function istSimKarte(f: SimFrage): f is SimFrage & SimKarte {
  const ok = typeof f.id === "string" && typeof f.frage === "string" && typeof f.thema === "string" &&
    FRAGETYPEN.some((t) => t === f.typ);
  if (!ok) console.error("[Simulation] unbrauchbare Karte", f.id);
  return ok;
}

/** Die vorgeschlagene Dauer in Minuten — die Summe der Richtwerte je Fragetyp. */
export function vorschlagMinuten(fragen: readonly SimKarte[]): number {
  const sek = fragen.reduce((s, f) => s + (metaFuer(f).sek || 0), 0);
  return Math.max(1, Math.round(sek / 60));
}

/** Bewertet Frage fuer Frage — `undefined` heisst: nicht beantwortet. */
export function bewerte(fragen: readonly SimKarte[], antworten: Record<number, unknown>): boolean[] {
  return fragen.map((f, i) =>
    gradeSim(f, antworten[i]),
  );
}

export function ergebnis(fragen: readonly SimKarte[], korrekt: readonly boolean[]): Ergebnis {
  return simErgebnis(fragen, korrekt);
}

/** Das Ergebnis je Aufgabe — Treffer, Punkte und Quote. */
export interface AufgabenErgebnis {
  aufgabe: AP1Aufgabe;
  richtig: number;
  gesamt: number;
  punkte: number;
  maxPunkte: number;
  quote: number;
}

export function jeAufgabe(
  fragen: readonly SimKarte[], korrekt: readonly boolean[], punkte: number[],
): AufgabenErgebnis[] {
  return AP1_AUFGABEN.map((a, bi) => {
    let richtig = 0;
    let gesamt = 0;
    fragen.forEach((f, i) => {
      if (aufgabeVon(f) !== bi) return;
      gesamt++;
      if (korrekt[i]) richtig++;
    });
    const maxPunkte = punkte[bi] ?? a.punkte;
    const quote = gesamt ? Math.round((richtig / gesamt) * 100) : 0;
    return {
      aufgabe: a, richtig, gesamt, maxPunkte, quote,
      punkte: gesamt ? Math.round((maxPunkte * richtig) / gesamt) : 0,
    };
  }).filter((e) => e.gesamt > 0);
}

/** Bucht das Ende einer Simulation: falsche Fragen ins Fehler-Deck, ein Eintrag
    in die Historie. ⛔ KEIN Modul, KEIN Tageszaehler — so macht es `simAbgeben`. */
export function verbucheSimulation(
  stand: Lernstand,
  fragen: readonly SimKarte[],
  korrekt: readonly boolean[],
  erg: Ergebnis,
  zeitSek: number,
  jetzt: number = Date.now(),
): Lernstand {
  const s = jsonKopie(stand);
  fragen.forEach((f, i) => {
    /* ⛔ Teilaufgaben einer Fallaufgabe bleiben draussen: ihre Kennungen entstehen
       erst beim Bauen der Pruefung und stehen in keinem Pool — die Ziehung findet
       sie nie wieder. Gefunden im Rauchtest am 16.09.2026, die Regel steht seit
       N34 T4 in `pruefung.ts` (`istFallTeil`, vorher logik.js). */
    if (korrekt[i] || istFallTeil(f)) return;
    fdOnWrong(s.fehlerDeck, f.id, jetzt);
  });
  s.simHistorie.push({
    datum: dayKey(jetzt),
    prozent: erg.prozent,
    note: erg.note.note,
    punkte: erg.punkte,
    gesamt: erg.gesamt,
    zeitSek,
  });
  return s;
}
