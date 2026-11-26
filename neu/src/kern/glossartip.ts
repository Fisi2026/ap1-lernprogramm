/* ============================================================================
   BEGRIFFS-TOOLTIPS IM FRAGETEXT (#53) — Etappe N23

   Vorbild `glossarWrap` (app_glossar.js): höchstens ZWEI Begriffe je Frage,
   längster zuerst, Wortgrenzen, keine Überlappung, und der **Leak-Schutz** —
   ein Begriff, der in einer Antwortoption oder der Musterlösung vorkommt, wird
   übersprungen, weil er die Lösung verriete.

   ⛔ EINE DATENQUELLE: `GLOSSAR_TIPS` aus `tabellen/glossar.ts` (seit N34 T6b;
      vorher `app_glossar.js`) — dieselbe Quelle wie das Lexikon, in beiden Programmen.
   ⛔ NEU GESCHRIEBEN statt übernommen (Nutzer-Entscheid 17.09.2026, geprüft):
      `glossarWrap` arbeitet auf HTML-escaptem Text und liefert HTML mit
      data-Attributen, an die sie hinterher von Hand Ereignisse hängt. Im Neubau
      hieße das `dangerouslySetInnerHTML` auf dem Fragetext. Hier arbeitet die
      Regel deshalb auf dem ROHTEXT und gibt Stellen zurück; gezeichnet wird mit
      React. **Dass beide dieselben Begriffe wählen, misst
      `glossartip.gleichheit.test.ts` an allen Fragen des Bestandes.**
   ============================================================================ */
import * as GLOSSAR from "./tabellen/glossar.ts";
import type { Frage } from "@/daten/typen";
import { istText } from "./pruefe.ts";

const TIPS = (GLOSSAR as { GLOSSAR_TIPS: Record<string, string> }).GLOSSAR_TIPS;

/** Höchstens so viele Begriffe je Frage (alte App: 2). */
export const MAX_TREFFER = 2;

export interface Treffer {
  start: number;
  end: number;
  term: string;
  def: string;
}

interface Eintrag { term: string; def: string; re: RegExp }

/* Längster Begriff zuerst: „Netzwerkkarte" soll nicht an „Netzwerk" hängenbleiben. */
const LISTE: Eintrag[] = Object.keys(TIPS)
  .map((term) => ({
    term,
    def: TIPS[term]!, // term stammt aus Object.keys(TIPS)
    re: new RegExp(
      "(^|[^0-9A-Za-zÄÖÜäöüß])(" + term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")(?![0-9A-Za-zÄÖÜäöüß])",
      "i",
    ),
  }))
  .sort((a, b) => b.term.length - a.term.length);

/** Was die Lösung verraten würde: Optionen, Musterlösung, Antwortfelder. */
export function leakText(f: Frage): string {
  const teile: string[] = [];
  const x = f as Record<string, unknown>;
  if (Array.isArray(x.optionen)) teile.push(...x.optionen.filter(istText));   // N38 Q1: Optionen sind Texte
  if (x.musterloesung) teile.push(String(x.musterloesung));
  if (x.antwort != null) teile.push(String(x.antwort));
  if (Array.isArray(x.antwort2)) teile.push(...(x.antwort2 as unknown[]).map(String));
  if (Array.isArray(x.loesungen)) teile.push(...(x.loesungen as unknown[]).map(String));
  return teile.join("  ").toLowerCase();
}

/** Die Stellen im Fragetext, die einen Tooltip bekommen. `aktiv=false` → keine. */
export function tipTreffer(f: Frage, aktiv: boolean): Treffer[] {
  if (!aktiv || !f || typeof f.frage !== "string") return [];
  const txt = f.frage;
  const leak = leakText(f);
  const gewaehlt: Treffer[] = [];
  for (const it of LISTE) {
    if (gewaehlt.length >= MAX_TREFFER) break;
    if (leak.includes(it.term.toLowerCase())) continue;     // Leak-Schutz
    const m = it.re.exec(txt);
    if (!m) continue;
    const start = m.index + m[1]!.length;
    const end = start + m[2]!.length;
    if (gewaehlt.some((g) => start < g.end && end > g.start)) continue;   // Überlappung
    gewaehlt.push({ start, end, term: it.term, def: it.def });
  }
  return gewaehlt.sort((a, b) => a.start - b.start);
}

export type Teil = { text: string; treffer?: Treffer };

/** Den Text in Stücke schneiden: reiner Text und Stücke mit Treffer — für React. */
export function tipTeile(text: string, treffer: readonly Treffer[]): Teil[] {
  const teile: Teil[] = [];
  let pos = 0;
  for (const t of [...treffer].sort((a, b) => a.start - b.start)) {
    if (t.start > pos) teile.push({ text: text.slice(pos, t.start) });
    teile.push({ text: text.slice(t.start, t.end), treffer: t });
    pos = t.end;
  }
  if (pos < text.length) teile.push({ text: text.slice(pos) });
  return teile;
}
