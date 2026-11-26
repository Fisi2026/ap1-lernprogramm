/* ============================================================================
   N37 U5 (E60, 27.09.2026): DER ABLAUF DES UEBEN-SCHIRMS ALS ZUSTANDSMASCHINE

   Bis U5 hielt `schirme/Ueben.tsx` den Ablauf in acht `useState` und einem Ref, und jede Regel
   (was ist "live", wann darf man zurueck, was verbraucht eine Serie) stand mitten im Zeichnen.
   Getestet werden konnte sie nur ueber jsdom und Klicks.
   Jetzt: EIN reiner Reducer (`uebenSchritt`) und eine reine Ziehung (`zieheFuerUeben`) – DOM-frei
   getestet in `uebenablauf.test.ts`. Der Schirm zeichnet nur noch und reicht Ereignisse durch.

   ⛔ WORTGLEICH UEBERNOMMEN, NICHT VERBESSERT: jede Zeile hier entspricht einer Zeile der alten
      Fassung (Kommentare mit ⛔ stehen weiter im Schirm, wo der Fehler sichtbar wurde). Der
      Schnappschuss-Test (`huelle/schnappschuss.jsdom.test.tsx`) haelt die Oberflaeche fest.
   ⚠️ Seiteneffekte (Lernstand buchen, Zufall wuerfeln, Pool nachschlagen) bleiben AUSSERHALB des
      Reducers: ein Reducer darf von React zweimal gerufen werden (dieselbe Lehre wie 14.09.2026
      im Schirm: "Ein State-Updater ist kein Ort fuer Seiteneffekte").
   ============================================================================ */
import type { Frage } from "@/daten/typen";
import type { Herkunft, Zug, Ziehkontext } from "./ziehen";
import { ziehe } from "./ziehen";
import type { Zufallsaufgabe } from "./generator";
import { unerreichbar } from "./da.ts";

/** Ein Schritt im Verlauf: welche Frage, und was darauf geantwortet wurde. */
export interface VerlaufEintrag {
  id: string;
  /** `undefined`, solange nichts eingetragen wurde. */
  antwort: unknown;
}

export interface UebenZustand {
  /** Die gezogenen Pool-Fragen mit der gegebenen Antwort (nie eine Zufallsaufgabe). */
  verlauf: VerlaufEintrag[];
  /** Die gezeigte Stelle im Verlauf; -1 = noch nichts gezogen. */
  idx: number;
  herkunft: Herkunft;
  /** Zur Auswahl gibt es keine Frage. */
  leer: boolean;
  /** Die gezeigte Zufallsaufgabe – sie steht in keinem Bestand und nicht im Verlauf. */
  zufall: Zufallsaufgabe | null;
  /** Ob die oberste Karteikarte noch "live" ist (eine Zufallsaufgabe setzt es zurueck). */
  poolLive: boolean;
  /** Themen-Serie (#60): Kennungen mit Vorrang bei der naechsten Ziehung. */
  serie: string[];
  /** Das Angebot nach einer falschen Antwort – erst auf Klick wird daraus eine Serie. */
  angebot: { frage: Frage; ids: string[] } | null;
  /** Die Themen der letzten zwei Fragen (Interleaving-Malus). Sitzungswissen, kein Fortschritt. */
  letzteThemen: string[];
}

export const UEBEN_START: UebenZustand = {
  verlauf: [], idx: -1, herkunft: "deck", leer: false, zufall: null,
  poolLive: false, serie: [], angebot: null, letzteThemen: [],
};

/** Was eine Ziehung ergeben hat – berechnet AUSSERHALB des Reducers (`zieheFuerUeben`). */
type Gezogen =
  | { art: "zufall"; aufgabe: Zufallsaufgabe }
  | { art: "pool"; id: string; herkunft: Herkunft; thema: string | undefined }
  | { art: "leer" };

export type UebenAktion =
  | { art: "gezogen"; ergebnis: Gezogen; serieVerbraucht: boolean }
  | { art: "wechsle" }
  | { art: "zurueck" }
  | { art: "zurAktuellen" }
  | { art: "antwortGemerkt"; antwort: unknown }
  | { art: "angebot"; frage: Frage; ids: string[] }
  | { art: "serieStarten"; ids: string[] };

export function uebenSchritt(z: UebenZustand, a: UebenAktion): UebenZustand {
  switch (a.art) {
    case "gezogen": {
      /* Verbraucht wird beim Ziehen, nicht in `ziehe` – die Ziehung veraendert nichts. */
      const basis: UebenZustand = {
        ...z,
        serie: a.serieVerbraucht ? z.serie.slice(1) : z.serie,
        angebot: null,
      };
      const e = a.ergebnis;
      if (e.art === "leer") return { ...basis, leer: true };
      if (e.art === "zufall") {
        /* Eine Zufallsaufgabe kommt NICHT in den Verlauf: "Zurueck" fuehrt auf die letzte echte Frage. */
        return { ...basis, zufall: e.aufgabe, poolLive: false, herkunft: "generator", leer: false };
      }
      return {
        ...basis,
        zufall: null,
        poolLive: true,
        letzteThemen: e.thema ? [...z.letzteThemen, e.thema].slice(-2) : z.letzteThemen,
        herkunft: e.herkunft,
        verlauf: [...z.verlauf, { id: e.id, antwort: undefined }],
        idx: z.idx + 1,
        leer: false,
      };
    }
    case "wechsle":
      /* Eine laufende Serie gehoert zum alten Fach – beim Wechsel ist sie hin. `herkunft` bleibt
         (wie vorher): sie wird erst mit der naechsten Ziehung wieder gezeigt. */
      return { ...UEBEN_START, herkunft: z.herkunft };
    case "zurueck":
      return z.zufall ? { ...z, zufall: null } : { ...z, idx: Math.max(0, z.idx - 1) };
    case "zurAktuellen":
      return { ...z, idx: z.verlauf.length - 1 };
    case "antwortGemerkt":
      return { ...z, verlauf: z.verlauf.map((e, i) => (i === z.idx ? { ...e, antwort: a.antwort } : e)) };
    case "angebot":
      return angebotMoeglich(z, false) && a.ids.length ? { ...z, angebot: { frage: a.frage, ids: a.ids } } : z;
    case "serieStarten":
      return { ...z, serie: a.ids, angebot: null };
    default:
      return unerreichbar(a, "uebenSchritt");
  }
}

/* ---------------------------------------------------------------- Ablesen */

/** Der gezeigte Verlaufseintrag (bei einer Zufallsaufgabe der, zu dem "Zurueck" fuehrt). */
export function aktuellerEintrag(z: UebenZustand): VerlaufEintrag | undefined {
  return z.verlauf[z.idx];
}

/** Nur die NEUESTE Pool-Karte ist "live" und wird gebucht. */
export function istLive(z: UebenZustand): boolean {
  return !z.zufall && z.poolLive && z.idx === z.verlauf.length - 1;
}

/** "Zurueck" ist frei – bei einer Zufallsaufgabe nur, wenn es eine echte Frage davor gibt (N20a). */
export function kannZurueck(z: UebenZustand): boolean {
  return z.zufall ? z.verlauf.length > 0 : z.idx > 0;
}

/** Steht man AM ENDE (dann "Naechste Frage", sonst "Zur aktuellen")? Bei einer Zufallsaufgabe immer. */
export function amEnde(z: UebenZustand): boolean {
  return !!z.zufall || z.idx === z.verlauf.length - 1;
}

/** #60: ein Serien-Angebot nur nach einer FALSCHEN Antwort, und nur, wenn weder eine Serie
    laeuft noch schon ein Angebot steht. */
export function angebotMoeglich(z: UebenZustand, korrekt: boolean): boolean {
  return !korrekt && z.serie.length === 0 && !z.angebot;
}

/* ---------------------------------------------------------------- Ziehen */

export interface UebenZug {
  ergebnis: Gezogen;
  serieVerbraucht: boolean;
  /** Was im Lernstand verbucht wird (`nachDemZiehen`) – `null` bei "leer". */
  zug: Zug | null;
  /** Die gezogene Pool-Frage (fuer `nachDemZiehen`), bei einer Zufallsaufgabe `undefined`. */
  frage: Frage | undefined;
}

/** Die Ziehung des Ueben-Schirms: erst mit Generator-Zweig; passt keine Art zur Auswahl, wird ohne
    ihn noch einmal gezogen, statt die Runde zu verschenken. Rein bis auf den Zufall in `ziehe` und
    `baueZufall` (beide als Parameter bzw. im Kontext steuerbar). */
export function zieheFuerUeben(
  k: Omit<Ziehkontext, "generatorMoeglich">,
  passt: (f: Frage) => boolean,
  baueZufall: () => Zufallsaufgabe | null,
): UebenZug {
  const zug = ziehe({ ...k, generatorMoeglich: true }, passt);
  const serieVerbraucht = zug.herkunft === "serie";
  if (zug.herkunft === "generator") {
    const aufgabe = baueZufall();
    if (aufgabe) return { ergebnis: { art: "zufall", aufgabe }, serieVerbraucht, zug, frage: undefined };
    const ersatz = ziehe({ ...k, generatorMoeglich: false }, passt);
    if (!ersatz.id) return { ergebnis: { art: "leer" }, serieVerbraucht, zug: null, frage: undefined };
    zug.id = ersatz.id;
    zug.herkunft = ersatz.herkunft;
    zug.deckNeu = ersatz.deckNeu;
    zug.seen = ersatz.seen;
  }
  if (!zug.id) return { ergebnis: { art: "leer" }, serieVerbraucht, zug: null, frage: undefined };
  const frage = k.nachId(zug.id);
  return {
    ergebnis: { art: "pool", id: zug.id, herkunft: zug.herkunft, thema: frage?.thema },
    serieVerbraucht,
    zug,
    frage,
  };
}
