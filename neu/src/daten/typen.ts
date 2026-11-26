/* ============================================================================
   Die Form des Bestands — abgeleitet aus pool/*.json, nicht erfunden.
   Gemessen am 10.09.2026: 21 Typen, 1131 Fragen.
   ⚠️ Diese Datei beschreibt NUR, was in den Dateien steht. Sie entscheidet nichts.
      Ausgewertet wird ausschliesslich in logik.js (20 grade*-Funktionen) —
      der Umbau der Oberflaeche fasst die Auswertung nicht an.
   ============================================================================ */

import type { FrageRoh } from "./frage.generiert";

export const FRAGETYPEN = [
  "mc", "mehrfach", "dropdown", "zuordnung", "freitext", "erklaeren",
  "hotspot", "bild", "rechenassistent", "fehlersuche", "beschriftung",
  "matrix", "baukasten", "konsole", "reihenfolge", "trace", "kalkulation",
  "szenario2", "kreuztabelle", "mtf", "lueckentext",
] as const;

export type Fragetyp = (typeof FRAGETYPEN)[number];

/* Die Gebiete der Pruefungsordnung. EINZIGE QUELLE ist seit N34 T1 `kern/tabellen/gebiete.ts` (= L.GEBIETE);
   diese Liste ist eine Abschrift und wird von einem Waechter dagegen gehalten.
   ⚠️ Gemessen am 10.09.2026: A6/A7/A8 gibt es NICHT. Es sind fuenf AP1-Gebiete
      (A1-A5) und drei AP2-Gebiete (B1-B3), dazu M9 fuer die Klausurvorbereitung. */
export const GEBIETE = [
  { id: "A1", name: "Kundenbedarfe ermitteln", teil: "AP1" },
  { id: "A2", name: "Hard- und Software auswählen & beschaffen", teil: "AP1" },
  { id: "A3", name: "IT-Arbeitsplatz konfigurieren, testen & absichern", teil: "AP1" },
  { id: "A4", name: "Kunden und Kundinnen einweisen", teil: "AP1" },
  { id: "A5", name: "Leistungserbringung kontrollieren & protokollieren", teil: "AP1" },
  { id: "B1", name: "Konzeption und Administration von IT-Systemen", teil: "AP2" },
  { id: "B2", name: "Analyse und Entwicklung von Netzwerken", teil: "AP2" },
  { id: "B3", name: "Wirtschafts- und Sozialkunde", teil: "AP2" },
  { id: "M9", name: "Klausurvorbereitung", teil: "M09" },
] as const;

export type Gebiet = (typeof GEBIETE)[number]["id"];

/** Kurzname fuers Reiterband — der Klarname ist fuer einen Reiter zu lang.
    Acht Reiter auf 1440px lassen rund 170px je Reiter; laenger wird abgeschnitten. */
export const GEBIET_KURZ: Record<Gebiet, string> = {
  A1: "Bedarfe",
  A2: "Beschaffung",
  A3: "Arbeitsplatz",
  A4: "Einweisung",
  A5: "Leistung",
  B1: "IT-Systeme",
  B2: "Netzwerke",
  B3: "WiSo",
  M9: "Klausur",
};

/** Felder, die die App zur LAUFZEIT ergaenzt – sie stehen nicht im Pool und deshalb nicht im Schema:
    Zufallsaufgaben (`kern/generator.ts`) und Teilaufgaben einer Fallaufgabe (`kern/pruefung.ts`).
    ⚠️ Bewusst `type`, nicht `interface`: nur ein Typ-Literal ist implizit indexierbar – mit `interface`
       passte `Frage` nicht mehr auf `Record<string, unknown>`/`SimFrage` (gemessen N37 U4, 27.09.2026). */
type FrageZusatz = {
  generatorArt?: string;
  fallTitel?: string;
  fallSzenario?: string;
};

/** Eine Frage – N37 U4 (E60, 27.09.2026): AUS DEM SCHEMA ERZEUGT (`frage.generiert.ts`), eine Union je `typ`
    (bei `bild` je `unterTyp`). Bis U4 stand hier ein Hand-Typ mit `[weiteres: string]: unknown`: jedes
    typspezifische Feld war `unknown` und wurde per `as` behauptet – und `schwierigkeit` log (`1 | 2 | 3`).
    ►► Wer auf ein Feld eines bestimmten Typs zugreift, grenzt vorher ueber `typ` ein oder nimmt `FrageVon<T>`. */
export type Frage = FrageRoh & FrageZusatz;

/** N38 (30.09.2026): eine Karte der Pruefungssimulation – eine Pool-Frage ODER die Teilaufgabe einer
    Fallaufgabe (`fallFuerSim`). ⛔ Gemessen: die 45 Teilaufgaben der 9 Faelle tragen KEIN `gebiet` – das
    Pflichtfeld von `Frage`. Bis hier behauptete `baueAP1Pruefung` sie per `as T[]` zu Fragen. Die
    Simulation liest `gebiet` nirgends; deshalb ist ihr Typ die Frage OHNE `gebiet` (je `typ`, damit das
    Eingrenzen ueber `typ` erhalten bleibt). Jede `Frage` passt hinein. */
export type SimKarte = OhneGebiet<Frage>;
export type OhneGebiet<F> = F extends unknown ? Omit<F, "gebiet"> : never;

/** Die Frage eines bestimmten Typs, z. B. `FrageVon<"matrix">`. */
export type FrageVon<T extends Fragetyp> = Extract<Frage, { typ: T }>;

/** Die Frage, deren ANTWORTFLAECHE Typ `T` ist: `T` selbst oder eine `bild`-Frage mit `unterTyp` `T`
    (so loest `wirkTyp` bzw. `grade` sie auf). */
export type FrageMitWirkTyp<T extends Fragetyp> = FrageVon<T> | Extract<FrageVon<"bild">, { unterTyp: T }>;

/** Grenzt eine Frage auf ihren Typ ein – `FRAGEN.filter((f) => istTyp(f, "mc"))` liefert `FrageVon<"mc">[]`. */
export function istTyp<T extends Fragetyp>(f: Frage, typ: T): f is FrageVon<T> {
  return f.typ === typ;
}

