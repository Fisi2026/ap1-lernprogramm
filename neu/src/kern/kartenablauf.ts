/* ============================================================================
   N38 Q2 (30.09.2026): DER ABLAUF DER KARTEIKARTE ALS REINER REDUCER

   Bis Q2 hielt `schirme/Karteikarte.tsx` den Ablauf in vier `useState` und drei Funktionen, die
   mitten zwischen dem Zeichnen standen: WANN gebucht wird (beim Pruefen, beim Aufgeben, oder erst
   bei der Selbsteinschaetzung NACH dem Pruefen) und dass es GENAU EINMAL geschieht.
   Jetzt: ein reiner Reducer (`kartenSchritt`) und eine reine Entscheidung (`zuBuchen`) – DOM-frei
   getestet in `kartenablauf.test.ts`. Muster wie `uebenablauf.ts`.

   ⛔ WORTGLEICH UEBERNOMMEN, NICHT VERBESSERT: jede Regel hier entspricht einer Zeile der alten
      Fassung. Die Regel des Urteils selbst steht weiter in `verbuchen.ts` (`urteilAus`).
   ⚠️ Das Buchen ist ein Seiteneffekt und bleibt AUSSERHALB des Reducers (ein Reducer darf von
      React zweimal gerufen werden – Lehre vom 14.09.2026). Der Schirm fragt `zuBuchen`, bucht
      und meldet danach `{ art: "gebucht" }`.
   ============================================================================ */
import type { Buchung } from "./verbuchen";
import { urteilAus } from "./verbuchen";
import { grade, istAutomatischBewertbar } from "./bewertung";
import { unerreichbar } from "./da.ts";
import type { Frage } from "@/daten/typen";

export interface KartenZustand {
  /** Die Eingabe; `undefined`, solange nichts eingetragen wurde. */
  antwort: unknown;
  geprueft: boolean;
  /** ⛔ Genau EINMAL je Karte buchen – ohne die Sperre zaehlte jedes Neuzeichnen erneut. */
  gebucht: boolean;
  /** N24: Abruf-Uebung aufgedeckt. */
  aufgedeckt: boolean;
}

export type KartenAktion =
  | { art: "pruefen" }
  | { art: "aufgeben" }
  | { art: "antwort"; antwort: unknown }
  | { art: "aufdecken" }
  | { art: "gebucht" };

/** ⛔⛔ Eine Karte aus dem VERLAUF ist bereits beantwortet und gebucht (Befund 14.09.2026) –
    sie traegt die damals gegebene Antwort (seit 15.09.2026). */
export function kartenStart(ausVerlauf: boolean, antwortAusVerlauf?: unknown): KartenZustand {
  return {
    antwort: ausVerlauf ? antwortAusVerlauf : undefined,
    geprueft: ausVerlauf,
    gebucht: ausVerlauf,
    aufgedeckt: false,
  };
}

export function kartenSchritt(z: KartenZustand, a: KartenAktion): KartenZustand {
  switch (a.art) {
    case "pruefen":
    case "aufgeben":
      return { ...z, geprueft: true };
    case "antwort":
      return { ...z, antwort: a.antwort };
    case "aufdecken":
      return { ...z, aufgedeckt: true };
    case "gebucht":
      return { ...z, gebucht: true };
    default:
      return unerreichbar(a, "kartenSchritt");
  }
}

/** Wie eine Antwort beurteilt wird: `aufgegeben` wie beim Knopf „Aufgeben“. */
export type Beurteile = (antwort: unknown, aufgegeben: boolean) => Buchung | null;

/** Das Urteil fuer eine (schon instanziierte) Frage – `urteilAus` mit dem Maschinen-Urteil,
    wo es eines gibt. */
export function beurteilerFuer(frage: Frage): Beurteile {
  const automatisch = istAutomatischBewertbar(kartenBewerterTyp(frage));
  return (antwort, aufgegeben) =>
    urteilAus(frage.typ, antwort, automatisch ? grade(frage, antwort) : null, aufgegeben);
}

/** Der Typ, nach dem entschieden wird, ob maschinell bewertet wird (bild traegt ihn als `unterTyp`). */
export function kartenBewerterTyp(frage: Frage): string {
  return frage.typ === "bild" && typeof frage.unterTyp === "string" ? frage.unterTyp : frage.typ;
}

/** Was nach dieser Aktion zu buchen ist – `null`: nichts.
    ⛔ WANN gebucht wird, haengt am Typ: automatisch bewertbare beim Pruefen; `freitext` und
       `erklaeren` erst, wenn die Selbsteinschaetzung kommt – und die trifft als ANTWORT erst
       NACH dem Pruefen ein. Deshalb bucht eine Antwort nach dem Pruefen noch einmal nach. */
export function zuBuchen(z: KartenZustand, a: KartenAktion, beurteile: Beurteile): Buchung | null {
  if (z.gebucht) return null;
  switch (a.art) {
    case "pruefen":
      return beurteile(z.antwort, false);
    case "aufgeben":
      return beurteile(z.antwort, true);
    case "antwort":
      return z.geprueft ? beurteile(a.antwort, false) : null;
    case "aufdecken":
    case "gebucht":
      return null;
    default:
      return unerreichbar(a, "zuBuchen");
  }
}
