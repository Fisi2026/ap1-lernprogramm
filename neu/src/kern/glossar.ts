/* ============================================================================
   DAS GLOSSAR — BEGRIFFSLEXIKON UND ABKUERZUNGEN

   ⛔⛔ DER HAUPTTEIL KOMMT AUS DEM POOL, NICHT AUS EINER LISTE. `glossarBegriffeView`
      in app_pages2.js baut das Lexikon aus den `erklaeren`-Fragen mit Musterloesung:
      der Begriff wird aus dem FRAGETEXT geschnitten, die Definition IST die
      Musterloesung. Gemessen am Bestand: 57 erklaeren-Fragen, davon 33 Begriffe —
      die uebrigen fallen durch den Kurzbegriff-Filter (Fragezeichen, ueber 52
      Zeichen). **Wer hier eine eigene Begriffsliste pflegte, haette eine zweite
      Fassung desselben Stoffs.**
   ⚠️ DAZU 34 BEGRIFFE AUS DER KLAUSURVORBEREITUNG: die fuenf M09-Erklaerfragen sind
      Fallfragen und fallen durch denselben Filter. Sie stehen namentlich in
      `GLOSSAR_M09_BEGRIFFE`, ihre Definition in `GLOSSAR_TIPS` — eine Quelle fuer
      Tooltip UND Lexikon, so haelt es die alte App ausdruecklich.
   ⚠️ DIE ABKUERZUNGEN (131) liegen seit N34 T6b in `tabellen/abkuerzungen.ts`
      (vorher `abkuerzungen.js` an der Wurzel). Sie stehen hinter einem Tor: erst nach mehr als
      `CONFIG.gate` beantworteten Fragen. Das ist keine Gaengelei, sondern die
      Regel der alten App (`sGlossar`), und sie gehoert hierher, nicht in den Schirm.
   ============================================================================ */
import { CONFIG } from "./tabellen/konfig.ts";
import type { Frage } from "@/daten/typen";
import * as GLOSSAR from "./tabellen/glossar.ts";
import { ABKUERZUNGEN } from "./tabellen/abkuerzungen.ts";
import type { Lernstand } from "./stand";
import { anzahlBeantwortet } from "./ziehen";

export interface Begriff {
  term: string;
  def: string;
  /** Das Modul, aus dem der Begriff stammt — "M09" bei der Klausurvorbereitung. */
  modul: string;
}

export interface Abkuerzung {
  kurz: string;
  lang: string;
  def: string;
  kat: string;
}

/* ⛔ DIESELBEN DREI SCHNITTE WIE IN DER ALTEN APP, Zeichen fuer Zeichen:
   Vorspann weg ("Erklaere den Begriff: …"), Schlusszeichen weg, dann der
   Kurzbegriff-Filter. Wer einen davon weglaesst, bekommt ganze Satzfragen ins
   Lexikon — und das Lexikon ist dann keines mehr. */
const VORSPANN = /^Erkläre\s+(den Begriff|das Modell|das Prinzip|die)?:?\s*/i;
const SCHLUSS = /[.:]\s*$/;
/** Laenger als das ist kein Begriff mehr, sondern eine Frage (alte App: 52). */
export const HOECHSTLAENGE = 52;

/** Der Begriff, den eine Frage beisteuert — oder null, wenn sie keinen hergibt. */
export function begriffAus(f: Frage): string | null {
  if (f.typ !== "erklaeren" || !f.musterloesung) return null;
  const t = f.frage.replace(VORSPANN, "").replace(SCHLUSS, "").trim();
  if (!t || t.indexOf("?") >= 0 || t.length > HOECHSTLAENGE) return null;
  return t;
}

/** Die zweite Quelle: Namen der Klausurbegriffe und ihre Definitionen. */
export interface Klausurquelle {
  GLOSSAR_TIPS: Record<string, string>;
  GLOSSAR_M09_BEGRIFFE: string[];
}

/** Das ganze Lexikon, alphabetisch nach deutscher Sortierung.
    ⚠️ Bestand UND Klausurquelle kommen als Parameter — im Betrieb sind es immer
       die echten. ⛔ Die Quelle ist nicht aus Bequemlichkeit da: der Zweig "ein
       Klausurbegriff OHNE Definition" ist im Bestand NICHT erreichbar (gemessen
       am 16.09.2026: 0 von 34 Begriffen ohne Definition). Ohne diesen Parameter
       waere der Test dazu leer gelaufen und haette trotzdem gruen gemeldet. */
export function begriffe(
  alle: readonly Frage[],   /* N37 U1: der Bestand kommt von aussen – `kern/` laedt keinen Pool */
  quelle: Klausurquelle = GLOSSAR,
): Begriff[] {
  const gesehen = new Set<string>();
  const liste: Begriff[] = [];
  for (const f of alle) {
    const term = begriffAus(f);
    if (!term || f.typ !== "erklaeren") continue; // begriffAus liefert nur bei erklaeren einen Begriff
    const k = term.toLowerCase();
    if (gesehen.has(k)) continue;
    gesehen.add(k);
    liste.push({ term, def: f.musterloesung, modul: f.modul });
  }
  for (const term of quelle.GLOSSAR_M09_BEGRIFFE) {
    const def = quelle.GLOSSAR_TIPS[term];
    /* ⚠️ Fehlt die Definition, wird der Begriff WEGGELASSEN — nicht mit leerem
       Text gezeigt. So macht es die alte App auch. */
    if (!def) continue;
    const k = term.toLowerCase();
    if (gesehen.has(k)) continue;
    gesehen.add(k);
    liste.push({ term, def, modul: "M09" });
  }
  liste.sort((a, b) => a.term.localeCompare(b.term, "de"));
  return liste;
}

/** Die Abkuerzungen, nach Kuerzel sortiert. */
export function abkuerzungen(): Abkuerzung[] {
  return [...ABKUERZUNGEN].sort((a, b) => a.kurz.localeCompare(b.kurz, "de"));
}

/** Sind die Abkuerzungen schon frei? Die Regel steht in CONFIG.gate. */
export function abkuerzungenFrei(stand: Lernstand): boolean {
  return anzahlBeantwortet(stand) > CONFIG.gate;
}

/** Wie viele Fragen noch fehlen, bis das Tor aufgeht. Nie negativ. */
export function nochBisFrei(stand: Lernstand): number {
  const fehlt = CONFIG.gate + 1 - anzahlBeantwortet(stand);
  return fehlt > 0 ? fehlt : 0;
}

function enthaelt(text: string, such: string): boolean {
  return text.toLowerCase().indexOf(such) >= 0;
}

/** Sucht in Begriff UND Definition — leerer Suchtext: alles. */
export function passendeBegriffe(liste: readonly Begriff[], suche: string): Begriff[] {
  const s = suche.toLowerCase().trim();
  if (!s) return [...liste];
  return liste.filter((b) => enthaelt(b.term, s) || enthaelt(b.def, s));
}

/** Sucht in Kuerzel, Langform, Definition UND Kategorie — wie die alte App. */
export function passendeAbk(liste: readonly Abkuerzung[], suche: string): Abkuerzung[] {
  const s = suche.toLowerCase().trim();
  if (!s) return [...liste];
  return liste.filter(
    (a) => enthaelt(a.kurz, s) || enthaelt(a.lang, s) || enthaelt(a.def, s) || enthaelt(a.kat, s),
  );
}
