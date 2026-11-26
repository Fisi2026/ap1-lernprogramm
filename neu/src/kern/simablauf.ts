/* ============================================================================
   N37 U5 (E60, 27.09.2026): DER ABLAUF DER PRUEFUNGSSIMULATION ALS ZUSTANDSMASCHINE

   Drei Lagen – Start, Lauf, Auswertung –, bis U5 als vier `useState` in `schirme/Simulation.tsx`.
   Jetzt: EIN reiner Reducer (`simSchritt`) und reine Helfer fuer Start, Uhr und Abgabe, DOM-frei
   getestet in `simablauf.test.ts`. Der Schirm zeichnet und haelt nur noch die Uhr (setInterval).

   ⛔ WORTGLEICH UEBERNOMMEN: Regeln und Zahlen wie vorher im Schirm (Fragenzahl 12..80, Vorgabe 40,
      Mindestens 8 Fragen, Dauer aus `simDauerMin` oder aus den Richtwerten).
   ⚠️ DIE UHR LAEUFT NACH DER WANDUHR (`jetzt - startTs`), nicht nach gezaehlten Ticks: ein gedrosselter
      Hintergrund-Tab wuerde die Pruefungszeit sonst verlaengern (app_sim.js R3). Deshalb nimmt `tick`
      die Zeit als Wert entgegen, statt einen Zaehler hochzuzaehlen.
   ⚠️ Der Lauf lebt NUR im Schirm; was bleiben soll (Anzahl, Gedaechtnis, Historie, Fehler-Deck), bucht
      der Schirm AUSSERHALB des Reducers in den Lernstand.
   ============================================================================ */
import type { Frage, SimKarte } from "@/daten/typen";
import type { Fall } from "@/daten/faelle";
import type { Lernstand } from "./stand";
import { bauePruefung, bewerte, ergebnis, vorschlagMinuten, type Ergebnis } from "./simulation";
import { unerreichbar } from "./da.ts";

/** Der laufende Versuch — bewusst nur im Schirm, nicht im Lernstand. */
export interface Lauf {
  fragen: SimKarte[];
  antworten: Record<number, unknown>;
  markiert: Record<number, boolean>;
  idx: number;
  dauerMin: number;
  startTs: number;
  punkte: number[];
}

export interface Auswertung {
  fragen: SimKarte[];
  korrekt: boolean[];
  erg: Ergebnis;
  punkte: number[];
  zeitSek: number;
  /** N47 B (10.10.2026): die gegebenen Antworten – die Auswertung zeigt je Frage die gesperrte
      Eingabe mit markierter Loesung (Nutzer-Entscheid: Loesung ueberall, wo geprueft ist). */
  antworten: Lauf["antworten"];
}

export interface SimZustand {
  lauf: Lauf | null;
  fertig: Auswertung | null;
  /** Die eingetippte Fragenzahl (noch nicht begrenzt – das tut `startAnzahl`). */
  anzahl: number;
  restSek: number;
}

export function simStart(stand: Lernstand): SimZustand {
  return { lauf: null, fertig: null, anzahl: stand.simAnzahl || 40, restSek: 0 };
}

export type SimAktion =
  | { art: "anzahl"; anzahl: number }
  | { art: "gestartet"; lauf: Lauf }
  | { art: "tick"; jetzt: number }
  | { art: "antwort"; i: number; antwort: unknown }
  | { art: "sprung"; i: number }
  | { art: "marke" }
  | { art: "abgegeben"; auswertung: Auswertung }
  | { art: "neu" };

export function simSchritt(z: SimZustand, a: SimAktion): SimZustand {
  switch (a.art) {
    case "anzahl":
      return { ...z, anzahl: a.anzahl };
    case "gestartet":
      return { ...z, lauf: a.lauf, fertig: null, restSek: a.lauf.dauerMin * 60 };
    case "tick":
      return z.lauf ? { ...z, restSek: restZeit(z.lauf, a.jetzt) } : z;
    case "antwort":
      return z.lauf ? { ...z, lauf: { ...z.lauf, antworten: { ...z.lauf.antworten, [a.i]: a.antwort } } } : z;
    case "sprung":
      return z.lauf ? { ...z, lauf: { ...z.lauf, idx: a.i } } : z;
    case "marke": {
      const l = z.lauf;
      return l ? { ...z, lauf: { ...l, markiert: { ...l.markiert, [l.idx]: !l.markiert[l.idx] } } } : z;
    }
    case "abgegeben":
      return { ...z, fertig: a.auswertung, lauf: null };
    case "neu":
      return { ...z, fertig: null };
    default:
      return unerreichbar(a, "simSchritt");
  }
}

/* ---------------------------------------------------------------- Helfer */

/** Die Fragenzahl, mit der gestartet wird: 12..80, leer oder 0 → 40. */
export function startAnzahl(anzahl: number): number {
  return Math.max(12, Math.min(80, anzahl || 40));
}

/** Baut den Lauf – oder `null`, wenn der Bestand keine Pruefung hergibt (unter 8 Fragen).
    `benutzt` und `n` gehoeren danach in den Lernstand (`simUsedIds`, `simAnzahl`). */
export function bereiteLauf(
  stand: Lernstand,
  anzahl: number,
  punkte: number[],
  pool: readonly Frage[],
  faelle: readonly Fall[],
  jetzt: number,
): { lauf: Lauf; benutzt: string[]; n: number } | null {
  const n = startAnzahl(anzahl);
  const p = bauePruefung(stand, n, punkte, pool, faelle);
  if (p.fragen.length < 8) return null;
  const dauer = stand.simDauerMin > 0 ? stand.simDauerMin : vorschlagMinuten(p.fragen);
  return {
    lauf: { fragen: p.fragen, antworten: {}, markiert: {}, idx: 0, dauerMin: dauer, startTs: jetzt, punkte },
    benutzt: p.benutzt,
    n,
  };
}

/** Die Restzeit in Sekunden nach der Wanduhr; <= 0 heisst: abgeben. */
export function restZeit(lauf: Lauf, jetzt: number): number {
  return lauf.dauerMin * 60 - Math.floor((jetzt - lauf.startTs) / 1000);
}

/** Wertet den Lauf aus. Die benoetigte Zeit ist die Dauer minus die (nicht negative) Restzeit. */
export function werteAus(lauf: Lauf, restSek: number): Auswertung {
  const korrekt = bewerte(lauf.fragen, lauf.antworten);
  const erg = ergebnis(lauf.fragen, korrekt);
  const zeitSek = Math.max(0, lauf.dauerMin * 60 - Math.max(0, restSek));
  return { fragen: lauf.fragen, korrekt, erg, punkte: lauf.punkte, zeitSek, antworten: lauf.antworten };
}
