/* ============================================================================
   DIE ZAHLEN IM KOPF — ALLE GEMESSEN, KEINE ERFUNDEN

   ⛔⛔ ANLASS 14.09.2026: Der Kopf der neuen Oberflaeche zeigte seit dem Entwurf
      **vier frei erfundene Zahlen**: "12/20 heute", "71 % Trefferquote", "8
      Fehler-Deck faellig", "412 Tage bis AP1". Sie standen gut da und waren
      nichts als Fuellung. Dieselbe Sorte Fehler wie die drei erfundenen Faecher
      vom 11.09. — und im Kopf steht sie an der sichtbarsten Stelle ueberhaupt.
   ►► Jede Zahl hier kommt aus dem Lernstand oder aus logik.js. Was sich nicht
      messen laesst, wird NICHT gezeigt: `null` heisst "noch nichts da", und die
      Oberflaeche laesst den Platz dann leer, statt eine Null zu erfinden.
   ============================================================================ */
import type { Lernstand } from "./stand";
import { bereitschaft as bereitschaftRoh, dayKey, fdDue } from "./lernen.ts";

/** Dieselben acht Module wie `anzahlBeantwortet` — M09 zaehlt nicht mit. */
const MODULE = ["M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08"];

export interface Kennzahlen {
  /** Heute beantwortet, und das Tagesziel. */
  heute: number;
  tagesziel: number;
  /** Trefferquote in Prozent ueber alle Module — null, solange nichts beantwortet ist. */
  quote: number | null;
  /** Wie viele Fragen im Fehler-Deck JETZT faellig sind. */
  faellig: number;
  /** Wie viele ueberhaupt im Fehler-Deck liegen. */
  imDeck: number;
  /** Tage bis zur Pruefung — null, wenn kein Datum gesetzt ist. */
  tageBisPruefung: number | null;
  /** Beantwortete Fragen insgesamt. */
  beantwortet: number;
}

export function kennzahlen(stand: Lernstand, jetzt: number = Date.now()): Kennzahlen {
  const st = stand.statistik;
  let richtig = 0;
  let gesamt = 0;
  for (const m of MODULE) {
    const e = st[m];
    if (!e) continue;
    richtig += e.richtig ?? 0;
    gesamt += e.gesamt ?? 0;
  }

  const tag = dayKey(jetzt);
  const tage = stand.dailyCounts;
  const deck = stand.fehlerDeck;

  return {
    heute: tage[tag] ?? 0,
    tagesziel: stand.tagesziel || 0,
    quote: gesamt > 0 ? Math.round((richtig / gesamt) * 100) : null,
    faellig: fdDue(deck, jetzt).length,
    imDeck: Object.keys(deck).length,
    tageBisPruefung: tageBis(stand.pruefungsdatum, jetzt),
    beantwortet: gesamt,
  };
}

/** Tage bis zu einem Datum im Format JJJJ-MM-TT. `null`, wenn keins gesetzt ist.
    ⛔ Kein Rueckfall auf einen erfundenen Termin: ohne Datum gibt es keine Zahl. */
export function tageBis(datum: string | undefined, jetzt: number): number | null {
  if (typeof datum !== "string" || datum.trim() === "") return null;
  const ziel = Date.parse(datum + "T00:00:00");
  if (!Number.isFinite(ziel)) return null;
  const heute = new Date(jetzt);
  const heuteMitternacht = Date.UTC(heute.getFullYear(), heute.getMonth(), heute.getDate());
  /* ⚠️ `+ 0` gegen die negative Null: Math.round(-0.2) ist -0, und -0 ist nicht 0.
     Der Test hat es gefunden — am Pruefungstag selbst haette dort "-0 Tage" gestanden. */
  return Math.round((ziel - heuteMitternacht) / 86400000) + 0;
}

/* ------------------------------------------------------------- Bereitschaft */

interface GebietsStand {
  code: string;
  score: number | null;
  ampel: string;
  themen: number;
  antworten: number;
}

export interface Bereitschaft {
  gebiete: GebietsStand[];
  gesamt: GebietsStand;
}

/** Die Bereitschaft je Gebiet — gerechnet von `L.bereitschaft`, nicht hier.
    ⚠️ Sie liest NUR die Themen-Zeilen (`T:modul:thema`) und laesst M09 aussen
       vor; das ist ein Nutzer-Entscheid vom 20.07.2026 und steht in logik.js. */
export function bereitschaft(stand: Lernstand): Bereitschaft {
  const roh = bereitschaftRoh(stand.statistik);
  return {
    gebiete: Object.entries(roh.gebiete)
      .map(([code, e]) => Object.assign({ code }, e))
      .sort((a, b) => a.code.localeCompare(b.code)),
    gesamt: { code: "gesamt", ...roh.gesamt },
  };
}
