/* ============================================================================
   WAS EINE FRAGETYP-KOMPONENTE IST

   Eine Fragetyp-Komponente zeichnet die Eingabe und sammelt eine Antwort ein.
   Sie bewertet NICHT. Bewertet wird ausschliesslich in logik.js.

   ⛔ Die Form der Antwort ist nicht frei: sie muss genau das sein, was
      `grade(frage, antwort)` fuer diesen Typ erwartet. Welche Form das ist,
      steht in `src/kern/antwortform.ts` und ist dort an allen 1131 Fragen belegt.
   ============================================================================ */
import type { ComponentType } from "react";
import type { FrageMitWirkTyp, Fragetyp, OhneGebiet } from "@/daten/typen";

/** N37 U4 (E60): `T` ist der Typ, dessen Antwortflaeche die Komponente zeichnet – sie bekommt die Frage
    GENAU dieses Typs (oder die `bild`-Frage mit diesem `unterTyp`) und liest ihre Felder ohne `as`. */
export interface EingabeProps<T extends Fragetyp = Fragetyp> {
  /** N38: ohne `gebiet` – auch die Teilaufgabe einer Fallaufgabe (`SimKarte`) wird so gezeichnet. */
  frage: OhneGebiet<FrageMitWirkTyp<T>>;
  /** Der aktuelle Stand der Eingabe. `undefined` heisst: noch nichts gewaehlt. */
  antwort: unknown;
  /** Meldet die neue Antwort in der Form, die grade fuer diesen Typ erwartet. */
  aufAntwort: (antwort: unknown) => void;
  /** Nach dem Pruefen: keine Eingabe mehr, aber weiterhin lesbar. */
  gesperrt: boolean;
  /** N24: die Beschriftung der Zeichnung (`kern/schalter.ts` bildBeschriftung) —
      nur für Typen, deren Zeichnung die Eingabe IST (hotspot). */
  bildtext?: string;
}

export type Eingabe<T extends Fragetyp = Fragetyp> = ComponentType<EingabeProps<T>>;

/** Wird eine Antwort als "abgegeben" gewertet? Ein leeres Feld ist keine Antwort.
    ⚠️ Bewusst ohne den Fragetyp: die Frage "ist ueberhaupt etwas eingetragen" laesst
       sich an der Antwort selbst beantworten. Ein Parameter, den niemand liest, ist
       eine Einladung, spaeter doch typabhaengig zu urteilen — und das gehoert nach
       logik.js, nicht hierher. */
export function hatGeantwortet(antwort: unknown): boolean {
  if (antwort === undefined || antwort === null) return false;
  if (Array.isArray(antwort)) {
    return antwort.length > 0 && antwort.every((x) => x !== null && x !== undefined && x !== "");
  }
  if (typeof antwort === "object") return Object.keys(antwort).length > 0;
  if (typeof antwort === "string") return antwort.trim() !== "";
  return true;
}
