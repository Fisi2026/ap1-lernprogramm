/* Was liegt im Fehler-Deck, und wann kommt es wieder?

   ⛔ DIE REGELN STEHEN IN `kern/lernen.ts` (seit N34 T3, vorher logik.js), NICHT HIER: `fdDue` sagt, was faellig ist;
      `fdOnWrong`/`fdOnCorrect` setzen `streak` und `due` (1 Tag beim Fehler,
      dann 3, dann 7; bei `fdStreakWeg` Treffern in Folge faellt die Frage raus).
      Diese Datei ordnet nur, was dort schon entschieden ist.

   ⚠️ Eine Kennung im Deck, zu der es keine Frage (mehr) gibt, wird NICHT
      verschwiegen: die alte App raeumt so etwas in `sanitizeState` auf, und bis
      das auch hier passiert, soll man es sehen statt es zu verlieren. */
import { CONFIG } from "./tabellen/konfig.ts";
import type { Lernstand } from "./stand";
import { jsonKopie } from "./kopie.ts";
import type { Frage } from "@/daten/typen";
import { fdDue } from "./lernen.ts";

export interface DeckEintrag {
  id: string;
  /** null, wenn es die Frage im Bestand nicht (mehr) gibt. */
  frage: Frage | null;
  /** Treffer in Folge — bei CONFIG.fdStreakWeg faellt die Frage aus dem Deck. */
  streak: number;
  /** Zeitpunkt der naechsten Faelligkeit, in Millisekunden. */
  faelligAb: number;
  faellig: boolean;
}

export interface DeckStand {
  faellig: DeckEintrag[];
  spaeter: DeckEintrag[];
  /** Kennungen im Deck, zu denen es keine Frage mehr gibt. */
  verwaist: DeckEintrag[];
  /** Ab wie vielen Treffern in Folge eine Frage das Deck verlaesst. */
  raus: number;
}

export function deckStand(
  stand: Lernstand,
  nachId: (id: string) => Frage | undefined,
  jetzt: number = Date.now(),
): DeckStand {
  const deck = stand.fehlerDeck ?? {};
  const faelligeIds = new Set(
    fdDue(deck, jetzt),
  );

  const alle: DeckEintrag[] = Object.entries(deck).map(([id, e]) => ({
    id,
    frage: nachId(id) ?? null,
    streak: e.streak ?? 0,
    faelligAb: e.due ?? 0,
    faellig: faelligeIds.has(id),
  }));

  /* Faelliges zuerst, und innerhalb dessen das laengst Ueberfaellige — das ist
     die Reihenfolge, in der man es abarbeiten wuerde. */
  const nachZeit = (a: DeckEintrag, b: DeckEintrag) => a.faelligAb - b.faelligAb;

  return {
    faellig: alle.filter((e) => e.faellig && e.frage).sort(nachZeit),
    spaeter: alle.filter((e) => !e.faellig && e.frage).sort(nachZeit),
    verwaist: alle.filter((e) => !e.frage).sort(nachZeit),
    raus: CONFIG.fdStreakWeg,
  };
}

/** "heute", "morgen", "in 3 Tagen" — grob genug, um nicht zu luegen. */
export function wannWieder(faelligAb: number, jetzt: number = Date.now()): string {
  const tage = Math.ceil((faelligAb - jetzt) / 86400000);
  if (tage <= 0) return "jetzt";
  if (tage === 1) return "morgen";
  return `in ${tage} Tagen`;
}

/** Entfernt Kennungen aus dem Fehler-Deck, zu denen es keine Frage mehr gibt.

    ⛔⛔ DIE ALTE APP TUT DAS STILL BEIM LADEN (`sanitizeState`, "R5 State-Hygiene").
       Hier ausdruecklich NICHT: Loeschen ist der einzige Schritt, der Lernstand
       vernichtet, und er soll nicht nebenbei passieren, waehrend jemand die App
       oeffnet. Der Schirm zeigt, was verwaist ist; weg ist es erst, wenn jemand
       darauf geklickt hat.
    ⚠️ Angefasst wird NUR das Fehler-Deck. `markiert` und `seenUnterricht` raeumt
       die alte App mit auf — das gehoert zu den Schirmen, die es hier noch nicht
       gibt, und wird dort gemacht, nicht heimlich hier. */
export function raeumeVerwaiste(
  stand: Lernstand,
  nachId: (id: string) => Frage | undefined,
): Lernstand {
  const s = jsonKopie(stand);
  const deck = s.fehlerDeck;
  for (const id of Object.keys(deck)) if (!nachId(id)) delete deck[id];
  return s;
}
