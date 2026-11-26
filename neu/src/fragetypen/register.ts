/* Welche Typen die neue Oberflaeche schon zeichnen kann.

   ⚠️ Diese Liste ist mit Absicht kurz und waechst Typ fuer Typ. Ein Typ steht
      erst drin, wenn seine Eingabe gebaut UND ihre Antwortform an den echten
      Fragen belegt ist. Alles andere zeigt in der Karte einen Platzhalter, der
      sagt was fehlt — statt so zu tun, als sei es fertig. */
import { MC, Mehrfach } from "./Auswahl";
import { Dropdown } from "./Dropdown";
import { Zuordnung } from "./Zuordnung";
import { Freitext } from "./Freitext";
import { Hotspot } from "./Hotspot";
import { Reihenfolge } from "./Reihenfolge";
import { Fehlersuche, Mtf, Szenario2 } from "./Einfach";
import { Lueckentext } from "./Lueckentext";
import { Konsole } from "./Konsole";
import { Trace, Kreuztabelle } from "./Tabellen";
import { Beschriftung, Baukasten } from "./Bausteine";
import { Matrix } from "./Matrix";
import { Rechenassistent, Kalkulation } from "./Rechnen";
import type { Eingabe } from "./vertrag";
import type { Fragetyp, SimKarte } from "@/daten/typen";

/** Je Typ die Komponente, die GENAU seine Frage bekommt (N37 U4). */
type Register = { [T in Fragetyp]?: Eingabe<T> };

const EINGABEN: Register = {
  mc: MC,
  mehrfach: Mehrfach,
  dropdown: Dropdown,
  zuordnung: Zuordnung,
  freitext: Freitext,
  erklaeren: Freitext,
  hotspot: Hotspot,
  reihenfolge: Reihenfolge,
  fehlersuche: Fehlersuche,
  mtf: Mtf,
  szenario2: Szenario2,
  lueckentext: Lueckentext,
  konsole: Konsole,
  trace: Trace,
  kreuztabelle: Kreuztabelle,
  beschriftung: Beschriftung,
  baukasten: Baukasten,
  matrix: Matrix,
  rechenassistent: Rechenassistent,
  kalkulation: Kalkulation,
};

/** Typen, deren Zeichnung die ANTWORTFLAECHE ist — die Karte zeigt das SVG dort
    nicht zusaetzlich links, sonst stuende es zweimal da. */
export const ZEICHNUNG_IST_EINGABE: ReadonlySet<Fragetyp> = new Set<Fragetyp>(["hotspot"]);

/** Typen, deren FRAGETEXT die Antwortflaeche ist — bei `lueckentext` stehen die
    Felder mitten im Satz. Die Karte zeigt den Text dann nicht zusaetzlich links;
    er stuende sonst zweimal da, einmal mit `___` und einmal mit Feldern. */
export const FRAGETEXT_IST_EINGABE: ReadonlySet<Fragetyp> = new Set<Fragetyp>(["lueckentext"]);

/** Typen, die ihr Urteil SELBST zeigen. Die Karte haelt sich dort heraus.
    ⛔ freitext und erklaeren haben in TYP keinen Bewerter — sie zeigen eine
       Naeherung, die Musterloesung und eine Selbsteinschaetzung. Eine generische
       "Richtig/Nicht richtig"-Zeile waere dort schlicht gelogen. */
export const EIGENES_URTEIL: ReadonlySet<Fragetyp> = new Set<Fragetyp>(["freitext", "erklaeren"]);

/* N37 U1 (27.09.2026): `wirkTyp` wohnt in `kern/wirktyp.ts` (reine Regel, kein React) – hier nur
   weitergereicht, damit die Oberflaeche ihn weiter aus dem Register holen kann. */
import { wirkTyp } from "@/kern/wirktyp";
export { wirkTyp };

/** `bild` ist kein eigener Typ, sondern eine Huelle um einen anderen —
    genauso, wie grade es behandelt (siehe kern/antwortform.ts). */
export function eingabeFuer(f: SimKarte): Eingabe | undefined {
  /* N37 U4: EINE Umwandlung, begruendet – TS sieht nicht, dass `EINGABEN[wirkTyp(f)]` genau zu `f` passt
     (korrelierte Union); das sichert der Aufbau von `Register` (je Schluessel die Komponente SEINES Typs). */
  return EINGABEN[wirkTyp(f)] as Eingabe | undefined;
}
