/* ============================================================================
   ONLINE-MELDUNGEN: VERSAND MIT WARTESCHLANGE (N20b, Entscheid E8)

   ⛔ EIGENE SCHLÜSSEL im localStorage, NICHT im Lernstand `ap1v2_state`: den
      liest und schreibt auch die alte App, und was dort neu hinzukommt, muss sie
      unverändert durchreichen. Warteschlange und Gerätekennung gehören nur dem
      Neubau.
   ⚠️ Gesendet wird sofort; scheitert das Netz, bleibt der Eintrag liegen und
      geht beim nächsten Start oder beim Ereignis `online` hinaus.
   ⚠️ Eine vom Server ABGEWIESENE Meldung (400) wird nicht endlos wiederholt –
      sie wird als abgewiesen vermerkt. 429 und 5xx bleiben in der Schlange.
   ============================================================================ */
export const S_SCHLANGE = "ap1v2_meldeschlange";
export const S_GERAET = "ap1v2_geraet";
const S_ERGEBNIS = "ap1v2_meldeergebnis";

import { istObjekt, istText, istZahl } from "./pruefe.ts";

export interface Ablage { getItem(k: string): string | null; setItem(k: string, v: string): void }

export interface Ausstehend { frageId: string; grund: string; text: string; datum: number }
export type Versandstand = "gesendet" | "wartet" | "abgewiesen";
interface Ergebnis { datum: number; stand: "gesendet" | "abgewiesen" }

/* N38 Q1: liefert `unknown` – vorher `JSON.parse(roh) as T`, die Form war nur behauptet.
   Jeder Leser prueft selbst, was er braucht (`undefined` = nichts oder unlesbar). */
function lies(ablage: Ablage, k: string): unknown {
  try {
    const roh = ablage.getItem(k);
    return roh ? JSON.parse(roh) : undefined;
  } catch { return undefined; }
}
const istAusstehend = (x: unknown): x is Ausstehend =>
  istObjekt(x) && istText(x.frageId) && istText(x.grund) && istText(x.text) && istZahl(x.datum);
function ergebnisse(ablage: Ablage): Record<string, unknown> {
  const e = lies(ablage, S_ERGEBNIS);
  return istObjekt(e) ? e : {};
}
function schreib(ablage: Ablage, k: string, wert: unknown): void {
  try { ablage.setItem(k, JSON.stringify(wert)); } catch { /* Speicher voll: Meldung bleibt lokal */ }
}

/** Zufällige Kennung dieses Geräts – nur für die Mengenbremse des Servers. */
export function geraetKennung(ablage: Ablage, neu: () => string = () => crypto.randomUUID()): string {
  const alt = lies(ablage, S_GERAET);
  if (istText(alt) && /^[A-Za-z0-9-]{16,64}$/.test(alt)) return alt;
  const k = neu();
  schreib(ablage, S_GERAET, k);
  return k;
}

export function schlange(ablage: Ablage): Ausstehend[] {
  const s = lies(ablage, S_SCHLANGE);
  return Array.isArray(s) ? s.filter(istAusstehend) : [];   // Unlesbares haette der Server mit 400 abgewiesen
}

/** Stellt eine Meldung ein; eine ältere, noch nicht gesendete zur selben Frage wird ersetzt. */
export function vormerken(ablage: Ablage, m: Ausstehend): void {
  schreib(ablage, S_SCHLANGE, [...schlange(ablage).filter((x) => x.frageId !== m.frageId), m]);
}

/** Nimmt eine noch nicht gesendete Meldung zurück. Gesendete bleiben beim Betreiber. */
export function zuruecknehmen(ablage: Ablage, frageId: string): void {
  schreib(ablage, S_SCHLANGE, schlange(ablage).filter((x) => x.frageId !== frageId));
}

export function versandstand(ablage: Ablage, frageId: string, datum: number): Versandstand | null {
  if (schlange(ablage).some((x) => x.frageId === frageId && x.datum === datum)) return "wartet";
  const e = ergebnisse(ablage)[frageId];
  return istObjekt(e) && e.datum === datum && (e.stand === "gesendet" || e.stand === "abgewiesen") ? e.stand : null;
}

export type Sende = (url: string, init: RequestInit) => Promise<Response>;

/** Schickt alles Ausstehende. Liefert, wie viele angekommen sind. */
export async function sendeAusstehende(ablage: Ablage, sende: Sende, version: string): Promise<number> {
  /* ⚠️ Ohne Ausstehendes kein Netz und keine Gerätekennung – der App-Start ruft das bei jedem Laden. */
  if (schlange(ablage).length === 0) return 0;
  const geraet = geraetKennung(ablage);
  let angekommen = 0;
  for (const m of schlange(ablage)) {
    let status: number;
    try {
      // oxlint-disable-next-line eslint/no-await-in-loop -- der Reihe nach: beim ersten Netzfehler bleibt der Rest liegen, und die Mengenbremse des Servers zaehlt je Anfrage
      const r = await sende("/api/meldung", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ frageId: m.frageId, grund: m.grund, text: m.text, geraet, version }),
      });
      status = r.status;
    } catch {
      return angekommen;            // kein Netz: Rest bleibt liegen
    }
    if (status === 201 || status === 400) {
      const stand: Ergebnis["stand"] = status === 201 ? "gesendet" : "abgewiesen";
      schreib(ablage, S_ERGEBNIS, { ...ergebnisse(ablage), [m.frageId]: { datum: m.datum, stand } });
      schreib(ablage, S_SCHLANGE, schlange(ablage).filter((x) => !(x.frageId === m.frageId && x.datum === m.datum)));
      if (status === 201) angekommen++;
    } else {
      return angekommen;            // 429/5xx/404: später erneut
    }
  }
  return angekommen;
}
