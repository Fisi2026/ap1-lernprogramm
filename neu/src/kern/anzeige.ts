/* ============================================================================
   N47 A (10.10.2026): IN WELCHER REIHENFOLGE EINE AUSWAHLLISTE ERSCHEINT

   Anlass: Lerner-Meldungen 2–4 („die richtige Antwort steht immer zuerst"). Gemessen am
   10.10.: mc 272 von 352 Fragen mit `loesungIndex` 0, mehrfach 80 von 80 mit Option 0
   richtig, szenario2 38 von 38 Schritten mit Index 0; zuordnung, beschriftung, baukasten
   halten ihre Auswahlliste in Loesungsreihenfolge. Die alte App mischte die Anzeige
   (`referenz/app_loeser.js` 65/98/144/518/643), der Neubau bis 2.3.2 nicht.

   ⛔ GEMISCHT WIRD NUR DIE ANZEIGE. Die Antwort bleibt in der Form, die `grade` erwartet
      (Ursprungs-Index bzw. Text, `kern/antwortform.ts`) – Bewertung, Lernstand, Verlauf
      und Fehler-Deck sehen die Mischung nie.
   ⛔ NEU JE ANZEIGE, FEST WAEHREND DER KARTE (Nutzer-Entscheid 10.10.): ein `Mischer` merkt
      sich je Schluessel die einmal gezogene Reihenfolge. Die Karte bekommt je Frage einen
      frischen, die Pruefungssimulation EINEN fuer den ganzen Lauf (sonst mischte jedes
      Blaettern neu).
   ⚠️ Zahlen-Listen bleiben aufsteigend (Nutzer-Entscheid 10.10.): ein Dropdown „18 · 19 ·
      20 · 22" gemischt hilft niemandem beim Lernen. `bleibtGeordnet` entscheidet je Liste.
   ⚠️ Sammel-Optionen („Beide …", „Alle genannten …") werden MITGEMISCHT (Nutzer-Entscheid
      10.10., wie die alte App).
   ============================================================================ */
import { shuffle, type Zufall } from "./zufall.ts";

/** Die Positionen 0..n-1 in Anzeige-Reihenfolge: `reihenfolge[k]` ist der Ursprungs-Index,
    der an Stelle k steht. */
export function mischReihenfolge(n: number, rng?: Zufall): number[] {
  return shuffle(Array.from({ length: Math.max(0, n) }, (_, i) => i), rng);
}

/** Die Positionen in Ursprungs-Reihenfolge (fuer Listen, die geordnet bleiben). */
export function festeReihenfolge(n: number): number[] {
  return Array.from({ length: Math.max(0, n) }, (_, i) => i);
}

/** Eine Option, die nur eine Zahl ist – mit Vorzeichen, Tausender-/Dezimaltrenner und
    hoechstens einer kurzen Einheit („20", "1.024", "3,5 %", "12 €", "100 Mbit/s"). */
const ZAHL = /^\s*[-+−]?\d[\d.,\s]*(\s*(%|€|[A-Za-zÄÖÜäöüß]{1,6}(\/[A-Za-z]{1,3})?))?\s*$/;

/** Wird diese Liste geordnet statt gemischt? Ja, wenn JEDE Option eine Zahl ist. */
export function bleibtGeordnet(optionen: readonly string[]): boolean {
  return optionen.length > 0 && optionen.every((o) => ZAHL.test(o));
}

/** Der Zahlenwert einer Option in deutscher Schreibweise („1.732,50" → 1732.5). */
export function zahlenwert(o: string): number {
  const t = o.replace(/−/g, "-").replace(/[^\d.,+-]/g, "");
  return Number(t.replace(/\./g, "").replace(",", "."));
}

/** ⚠️ AUFSTEIGEND NACH WERT, nicht in Pool-Reihenfolge: gemessen 10.10. standen 31 von 60
    Zahlen-Listen ungeordnet im Pool („60 | 6 | 200 | 600"), die Loesung meist an Stelle 2/3
    (0:6, 1:24, 2:27, 3:3) – die Pool-Reihenfolge war selbst ein Hinweis. */
export function zahlenReihenfolge(optionen: readonly string[]): number[] {
  return festeReihenfolge(optionen.length)
    .sort((a, b) => zahlenwert(optionen[a] ?? "") - zahlenwert(optionen[b] ?? "") || a - b);
}

/** Merkt sich je Schluessel die einmal gezogene Reihenfolge. */
export interface Mischer {
  reihenfolge(schluessel: string, n: number): number[];
}

export function neuerMischer(rng: Zufall = Math.random): Mischer {
  const gemerkt = new Map<string, number[]>();
  return {
    reihenfolge(schluessel, n) {
      const k = schluessel + "|" + n;
      let r = gemerkt.get(k);
      if (!r) { r = mischReihenfolge(n, rng); gemerkt.set(k, r); }
      return r;
    },
  };
}

/** Elemente einer Liste in der Reihenfolge eines Mischers – mit ihrem Ursprungs-Index. */
export function inReihenfolge<T>(liste: readonly T[], reihenfolge: readonly number[]): Array<{ wert: T; index: number }> {
  const aus: Array<{ wert: T; index: number }> = [];
  for (const i of reihenfolge) {
    const wert = liste[i];
    if (wert !== undefined) aus.push({ wert, index: i });
  }
  return aus;
}

/** Eine Reihenfolge, die NICHT die geordnete ist – fuer `reihenfolge`, wo die geordnete die Loesung
    waere. Trifft das Mischen sie doch, werden die ersten beiden getauscht (wie bisher in
    Reihenfolge.tsx). Rein: dieselbe Eingabe ergibt dieselbe Ausgabe. */
export function nichtGeordnet(r: readonly number[]): number[] {
  const a = [...r];
  if (a.length > 1 && a.every((v, i) => v === i)) [a[0], a[1]] = [a[1]!, a[0]!]; // Laenge > 1 geprueft
  return a;
}

/** N47 B: das Urteil ueber EINE Option nach dem Pruefen – `richtig` ist die richtige Option
    (IMMER markiert, auch nach richtiger Antwort und nach „Aufgeben", Nutzer-Entscheid 10.10.),
    `falsch` die eigene falsche Wahl. Vor dem Pruefen: keines. */
export type OptionsUrteil = "richtig" | "falsch" | undefined;

export function urteilFuer(gesperrt: boolean, istRichtig: boolean, gewaehlt: boolean): OptionsUrteil {
  if (!gesperrt) return undefined;
  if (istRichtig) return "richtig";
  return gewaehlt ? "falsch" : undefined;
}
