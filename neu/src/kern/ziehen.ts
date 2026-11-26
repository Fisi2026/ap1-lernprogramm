/* ============================================================================
   DIE ZIEHUNG

   `kern/auswahl.ts` sagt, WELCHE Fragen in Frage kommen. Hier wird eine davon
   gezogen — und zwar nicht gleichverteilt, sondern in genau der Reihenfolge von
   Vorrechten, die `naechsteFrage()` in app_seiten.js hat:

     1. eine laufende THEMEN-SERIE hat Vorrang (nach einer falschen Antwort)
     2. sonst, bei JEDER FUENFTEN Frage: eine faellige Frage aus dem FEHLER-DECK
     3. sonst, bei jeder VIERTEN (Rest 2): eine GENERATOR-Aufgabe
     4. sonst: `deckPick` mit `gewichteFrage` — Relevanz x Schwaeche x Interleaving

   ⛔ DIE REIHENFOLGE IST DIE SACHE SELBST. Wer 2 und 3 vertauscht, aendert den
      Lernrhythmus, ohne dass ein Test es merken muesste. Deshalb steht sie hier
      als Kaskade und nicht als Sammlung von Sonderfaellen.

   ⚠️ DIESE DATEI HAT KEIN LAUFFAEHIGES GEGENSTUECK. `naechsteFrage()` schreibt
      mitten in die Oberflaeche (`qa.innerHTML`, `uebenRender`, `uebenVerlauf`) und
      laesst sich nicht ausfuehren, ohne dass man die halbe alte App nachbaut —
      und je mehr man nachbaut, desto weniger beweist der Vergleich.
      ►► Deshalb wird hier NICHT zeichengleich verglichen, sondern das VERHALTEN
         gemessen: der Rhythmus ueber lange Folgen, die Sperren, die Buchfuehrung.
         Das steht so auch im Test — damit niemand ihn fuer einen Gleichheitsbeweis
         haelt, der er nicht ist.
   ============================================================================ */
import { CONFIG } from "./tabellen/konfig.ts";
import type { Lernstand } from "./stand";
import { jsonKopie } from "./kopie.ts";
import type { Frage } from "@/daten/typen";
import { kandidatenMitTypWechsel, typVon } from "./auswahl";
import { deckPick, fdDue, gewichteFrage } from "./lernen.ts";
import { pick } from "./zufall.ts";
import { istGekonnt } from "./gekonnt.ts";

/** Aus app_pool.js — die acht Module, ueber die `anzahlBeantwortet` zaehlt.
    ⚠️ M09 ist bewusst NICHT dabei: die Klausurvorbereitung zaehlt nicht auf das
       Adaptiv-Gate ein. */
const MODULE = ["M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08"] as const;

/** Aus APP_CONFIG in app_state.js. */
export const EINSTREUUNG = {
  /** Fehler-Deck: hoechstens eine von fuenf. */
  fehlerDeck: 5,
  /** Generator: eine von vier, und nie zweimal hintereinander. */
  generator: 4,
} as const;

export function anzahlBeantwortet(stand: Lernstand): number {
  const st = stand.statistik;
  let g = 0;
  for (const m of MODULE) if (st[m]) g += st[m].gesamt ?? 0;
  return g;
}

export interface Gewichtskontext {
  relevanzAn: boolean;
  adaptivAktiv: boolean;
  themaStat: (f: Frage) => { richtig: number; gesamt: number } | null;
  letzteThemen: string[];
}

export function gewichtsKontext(stand: Lernstand, letzteThemen: string[]): Gewichtskontext {
  return {
    relevanzAn: stand.relevanzGewichtung,
    adaptivAktiv: anzahlBeantwortet(stand) > CONFIG.gate,
    themaStat: (f) =>
      stand.statistik[
        "T:" + f.modul + ":" + f.thema
      ] ?? null,
    letzteThemen,
  };
}

/** Woher die gezogene Frage kommt — die Oberflaeche zeigt das als Hinweis an,
    genau wie die alte App (`hinweisSerie`, `hinweisFD`). */
export type Herkunft = "serie" | "fehlerdeck" | "generator" | "deck";

export interface Zug {
  id: string | null;
  herkunft: Herkunft;
  /** true, wenn das Deck in diesem Zug neu gemischt wurde. */
  deckNeu: boolean;
  /** Der neue `seen`-Satz, den L.deckPick geliefert hat. */
  seen: Record<string, unknown>;
}

export interface Ziehkontext {
  stand: Lernstand;
  /* ⚠️ `readonly`: hier wird nichts veraendert, und `FRAGEN` ist readonly.
     Ohne das muesste jeder Aufrufer eine Kopie machen — Arbeit ohne Zweck. */
  alle: readonly Frage[];
  nachId: (id: string) => Frage | undefined;
  /** Die Themen der letzten zwei Fragen (Interleaving-Malus). */
  letzteThemen: string[];
  /** Warteschlange "Mehr zu diesem Thema". Wird hier NICHT veraendert. */
  serie: string[];
  /** Jetzt, in Millisekunden. */
  heute: number;
  /** Zufall — als Parameter, damit ein Test denselben Zug zweimal fahren kann. */
  rng?: () => number;
  /** Darf eine Generator-Aufgabe kommen? Solange die neue Oberflaeche keine
      zeichnet, steht das auf false — und der Zweig wird uebersprungen statt
      eine Frage zu liefern, die niemand anzeigen kann. */
  generatorMoeglich?: boolean;
}

/** Die faelligen Fragen aus dem Fehler-Deck, nach denselben drei Bedingungen
    wie in app_seiten.js: es gibt sie noch, sie passt zur Uebungsauswahl, und sie
    war nicht unter den letzten zehn. */
export function faelligeAusDeck(k: Ziehkontext, passt: (f: Frage) => boolean): string[] {
  const due = fdDue(k.stand.fehlerDeck, k.heute);
  const letzte10 = k.stand.lastShown.slice(-10);
  return due.filter((id) => {
    const f = k.nachId(id);
    /* „Kann ich schon“ (25.11.2026): auch aus dem Fehler-Deck nicht mehr ziehen. */
    return !!f && passt(f) && letzte10.indexOf(id) === -1 && !istGekonnt(k.stand, id);
  });
}

/** Zieht die naechste Frage. Veraendert NICHTS — der Aufrufer verbucht. */
export function ziehe(k: Ziehkontext, passt: (f: Frage) => boolean): Zug {
  const rng = k.rng ?? Math.random;
  /* ⛔⛔ HIER LAG EIN OFF-BY-ONE, UND ER WAERE NICHT AUFGEFALLEN:
     `naechsteFrage()` zaehlt `s.uebenZaehler++` als ERSTE Zeile hoch und prueft
     den Rest DANACH. Wer hier den alten Wert nimmt, verschiebt den ganzen
     Rhythmus um eins — die Fehler-Deck-Einstreuung kaeme auf anderen Zaehler-
     staenden, und niemand haette es gemerkt, weil "jede fuenfte" weiterhin
     gestimmt haette. Gemessen wird deshalb mit dem Wert NACH dem Hochzaehlen. */
  const zaehler = k.stand.uebenZaehler + 1;

  /* 1. laufende Themen-Serie */
  if (k.serie.length) {
    return { id: k.serie[0] ?? null, herkunft: "serie", deckNeu: false, seen: k.stand.seen };
  }

  /* 2. Fehler-Deck, hoechstens eine von fuenf */
  const faellig = faelligeAusDeck(k, passt);
  if (zaehler % EINSTREUUNG.fehlerDeck === 0 && faellig.length) {
    const id = pick(faellig, rng) ?? null; // `faellig` ist hier nie leer
    return { id, herkunft: "fehlerdeck", deckNeu: false, seen: k.stand.seen };
  }

  /* 3. Generator, eine von vier — und nie zweimal hintereinander.
     ⚠️ `% 4 === 2`, nicht `=== 0`: sonst faellt der Zweig mit dem Fehler-Deck
        auf dieselben Zaehlerstaende und kaeme nie dran. */
  if (
    k.generatorMoeglich &&
    zaehler % EINSTREUUNG.generator === 2 &&
    k.stand.lastTyp !== "generator"
  ) {
    return { id: null, herkunft: "generator", deckNeu: false, seen: k.stand.seen };
  }

  /* 4. der Regelfall */
  const ids = kandidatenMitTypWechsel(k.stand, k.alle, k.nachId);
  const ctx = gewichtsKontext(k.stand, k.letzteThemen);
  const r = deckPick(
    ids, k.stand.seen, k.stand.lastShown, null, rng,
    (id) => {
      const f = k.nachId(id);
      return f ? gewichteFrage(f, ctx) : 1;
    },
  );
  return { id: r.id ?? null, herkunft: "deck", deckNeu: r.deckReset, seen: r.seen };
}

/** Schreibt fort, was nach einer gezogenen Frage im Stand vermerkt wird —
    getrennt von `ziehe`, damit die Ziehung selbst nichts veraendert. */
export function nachDemZiehen(stand: Lernstand, zug: Zug, frage: Frage | undefined): Lernstand {
  const s = jsonKopie(stand);
  s.uebenZaehler = s.uebenZaehler + 1;
  if (zug.herkunft === "deck") {
    s.seen = { ...zug.seen };
    if (zug.id) s.seen[zug.id] = true;
  }
  if (zug.id) {
    const zuletzt = s.lastShown;
    zuletzt.push(zug.id);
    if (zuletzt.length > 50) zuletzt.shift();
  }
  s.lastTyp = zug.herkunft === "generator" ? "generator" : frage ? typVon(frage) : "";
  return s;
}
