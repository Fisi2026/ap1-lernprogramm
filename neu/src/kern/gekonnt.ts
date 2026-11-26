/* ============================================================================
   „KANN ICH SCHON“ — eine Frage überspringen (Nutzer-Wunsch 25.11.2026)

   Nutzer-Entscheide vom 25.11.2026 (AskUserQuestion, BUILD_LOG 272):
   * AUSBLENDEN, nicht seltener: eine gekonnte Frage zieht weder Üben (`kandidaten`)
     noch die Tagesserie (`baueTagesserie`) noch das Fehler-Deck (`faelligeAusDeck`),
     bis der Lerner sie zurückholt. Die Simulation bleibt vollständig (die Prüfung ist es auch).
     Gemessen vorher: `deckPick` zieht jede Kandidatin genau einmal je Runde; ein kleineres
     Gewicht hätte nur die Reihenfolge in der Runde geändert, nicht wie oft sie kommt.
   * ALS RICHTIG ZÄHLEN: „Kann ich schon“ vor der Antwort bucht wie eine richtige Antwort
     (`verbuche(…, true)`: Statistik, Tageszähler, Themenstufe, Fehler-Deck-Treffer).
     „Nicht mehr zeigen“ nach der Antwort bucht NICHTS mehr — gebucht ist dort schon.
   * Zurückholen in „Markierte Fragen“, je Frage und alle auf einmal.

   ⛔ Gespeichert wird die POOL-Kennung (wie beim Stern), Wert = Zeitpunkt in ms.
   ⛔ Kennungen ohne Frage im Bestand werden gezeigt und auf Klick entfernt, nie still (Lehre N10).

   RECHENAUFGABEN MIT ZUFALLSWERTEN (Nutzer-Entscheid 25.11.2026, BUILD_LOG 278, „Diese Art ausblenden“):
   * Eine Zufallsaufgabe hat keine feste Kennung (jedes Ziehen wuerfelt neu) – ausgeblendet wird darum
     die ART, unter dem Schluessel `GEN:<art>` (`genSchluessel`) im selben Feld `gekonnt`.
     Gemessen vorher: `gekonnt` prueft nur den Wert (Zahl, stand.ts `gekonnt: istZahl`), keine
     Migration noetig; Pool-Kennungen tragen kein `:` (gekonnt.test.ts), also kein Zusammenstoss.
   * Ohne eigenen Zweig hier meldete `verwaisteGekonnte` jede Art als „ohne Frage im Bestand“ (Lehre N10):
     `GEN:`-Schluessel einer bekannten Art zaehlen deshalb NICHT als verwaist, einer unbekannten schon.
   * Nur Üben (`zufallsaufgabe`) und Klausurvorbereitung (`zieheFuerKlausur`) blenden aus; der
     Rechen-Generator-Schirm, auf dem man die Art selbst waehlt, zeigt weiter alle.
   ============================================================================ */
import type { Frage } from "@/daten/typen";
import type { Lernstand } from "./stand";
import { verbuche, type VerbuchbareFrage } from "./verbuchen.ts";
import { GENERATOREN } from "./generatoren.ts";

type NachId = (id: string) => Frage | undefined;

function eintraege(s: Lernstand): Record<string, unknown> {
  return (s.gekonnt && typeof s.gekonnt === "object") ? s.gekonnt : {};
}

export function istGekonnt(s: Lernstand, id: string): boolean {
  return Object.prototype.hasOwnProperty.call(eintraege(s), id);
}

/** Nach der Antwort: nur ausblenden, nichts buchen. */
export function setzeGekonnt(s: Lernstand, id: string, jetzt: number): Lernstand {
  return { ...s, gekonnt: { ...eintraege(s), [id]: jetzt } };
}

/** Vor der Antwort: wie eine richtige Antwort buchen UND ausblenden — ein Schreiben. */
export function ueberspringe(s: Lernstand, frage: VerbuchbareFrage, poolId: string, jetzt: number): Lernstand {
  return setzeGekonnt(verbuche(s, frage, true, { heute: jetzt }), poolId, jetzt);
}

export function holeZurueck(s: Lernstand, id: string): Lernstand {
  const g = { ...eintraege(s) };
  delete g[id];
  return { ...s, gekonnt: g };
}

/** Alle zurückholen, auch die verwaisten. */
export function holeAlleZurueck(s: Lernstand): Lernstand {
  return { ...s, gekonnt: {} };
}

/** Gekonnte Fragen im Bestand, zuletzt übersprungene zuerst. */
export function gekonnteIds(s: Lernstand, nachId: NachId): string[] {
  const g = eintraege(s);
  const zeit = (id: string) => { const v = g[id]; return typeof v === "number" ? v : 0; };
  return Object.keys(g).filter((id) => !!nachId(id)).sort((a, b) => zeit(b) - zeit(a));
}

const GEN_PRAEFIX = "GEN:";

/** Der Schluessel einer ausgeblendeten Rechenaufgaben-Art. */
export function genSchluessel(art: string): string {
  return GEN_PRAEFIX + art;
}

function bekannteArt(schluessel: string): string | null {
  if (!schluessel.startsWith(GEN_PRAEFIX)) return null;
  const art = schluessel.slice(GEN_PRAEFIX.length);
  return Object.prototype.hasOwnProperty.call(GENERATOREN, art) ? art : null;
}

export function istArtGekonnt(s: Lernstand, art: string): boolean {
  return istGekonnt(s, genSchluessel(art));
}

/** Ausgeblendete Rechenaufgaben-Arten (nur bekannte), zuletzt ausgeblendete zuerst. */
export function gekonnteArten(s: Lernstand): string[] {
  const g = eintraege(s);
  const zeit = (k: string) => { const v = g[k]; return typeof v === "number" ? v : 0; };
  return Object.keys(g).filter((k) => bekannteArt(k) !== null)
    .sort((a, b) => zeit(b) - zeit(a)).map((k) => k.slice(GEN_PRAEFIX.length));
}

/** Gekonnt-Einträge ohne Frage im Bestand – ausser den Schluesseln bekannter Rechenaufgaben-Arten. */
export function verwaisteGekonnte(s: Lernstand, nachId: NachId): string[] {
  return Object.keys(eintraege(s)).filter((id) => !nachId(id) && bekannteArt(id) === null);
}
