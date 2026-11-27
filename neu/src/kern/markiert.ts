/* ============================================================================
   LESEZEICHEN (★) UND „FRAGE MELDEN" — Etappe N20a (docs/plaene/PLAN_NEUBAU.md, E3/E4)

   Vorbild: `renderStern`, `renderMelden`, `meldungenText` (app_frage.js) und
   `markierteIds` (app_seiten.js). ⛔ DERSELBE LERNSTAND: `S.markiert[id] = 1`
   und `S.meldungen[id] = {grund, text, datum}` — die alte App liest, was hier
   geschrieben wird, und umgekehrt (Parallelbetrieb, E2).

   ⚠️ Entscheide 17.09.2026: der Stern steht im Neubau IMMER im Kartenkopf
      (die alte App blendet ihn per `markierenAn` aus, weil er dort dem
      Melden-Knopf die Stelle nahm). Online-Meldungen folgen in N20b.
   ⛔ `meldungenText` ist ein EXPORTFORMAT: `markiert.gleichheit.test.ts` legt
      es gegen die Funktion der alten App.
   ============================================================================ */
import type { Frage } from "@/daten/typen";
import type { Lernstand } from "./stand";
import { istObjekt } from "./pruefe.ts";

/** Wie `MELDE_GRUENDE` in app_frage.js — Reihenfolge ist Anzeige-Reihenfolge. */
export const MELDE_GRUENDE = ["Falsche Lösung", "Unklar formuliert", "Tippfehler", "Veraltet", "Sonstiges"] as const;

/** Wie `MODULE` in app_pool.js (Gleichheitstest). M09 steht dort bewusst NICHT. */
export const MODUL_NAMEN: Readonly<Record<string, string>> = {
  M01: "Projektmanagement",
  M02: "Kundenberatung & Marketing",
  M03: "IT-Systeme & Hardware",
  M04: "IT-Lösungen & Programmierung",
  M05: "Qualitätssicherung",
  M06: "IT-Sicherheit & Datenschutz",
  M07: "Leistungserbringung & Verträge",
  M08: "WiSo",
};
const UNTERRICHT: readonly [string, string] = ["M09", "Klausurvorbereitung"];

export function modulName(m: string): string {
  if (m === UNTERRICHT[0]) return UNTERRICHT[1];
  return MODUL_NAMEN[m] ?? m;
}

export interface Meldung { grund: string; text: string; datum: number }

type NachId = (id: string) => Frage | undefined;

function markierungen(s: Lernstand): Record<string, unknown> {
  return (s.markiert && typeof s.markiert === "object") ? s.markiert : {};
}
function meldungenVon(s: Lernstand): Record<string, unknown> {
  return (s.meldungen && typeof s.meldungen === "object") ? s.meldungen : {};
}

export function istMarkiert(s: Lernstand, id: string): boolean {
  return !!markierungen(s)[id];
}

/** Umschalten wie `renderStern`: an → `1`, aus → Schlüssel löschen. */
export function schalteMarkierung(s: Lernstand, id: string): Lernstand {
  const m = { ...markierungen(s) };
  if (m[id]) delete m[id]; else m[id] = 1;
  return { ...s, markiert: m };
}

export function entferneMarkierung(s: Lernstand, id: string): Lernstand {
  const m = { ...markierungen(s) };
  delete m[id];
  return { ...s, markiert: m };
}

/** Wie `markierteIds()`: Frage muss existieren und in den Prüfungsteil-Filter
    `passtAP` passen (`inklAP2`) — markierte M09-Fragen bleiben ausdrücklich sichtbar. */
export function markierteIds(s: Lernstand, nachId: NachId): string[] {
  return Object.keys(markierungen(s)).filter((id) => {
    const f = nachId(id);
    if (!f) return false;
    if (f.modul === UNTERRICHT[0]) return true;
    return s.inklAP2 || f.pruefungsteil !== "AP2";
  });
}

/** Markierungen ohne Frage im Bestand. ⛔ Nicht still verwerfen (Lehre N10). */
export function verwaisteMarkierungen(s: Lernstand, nachId: NachId): string[] {
  return Object.keys(markierungen(s)).filter((id) => !nachId(id));
}

export function meldungFuer(s: Lernstand, id: string): Meldung | undefined {
  const m = meldungenVon(s)[id];
  if (!istObjekt(m)) return undefined;   // N38 Q1: vorher behauptet; eine Liste als Meldung ist kaputt
  return { grund: String(m.grund ?? ""), text: String(m.text ?? ""), datum: Number(m.datum ?? 0) };
}

/** Wie der Melde-Knopf: ohne gewählten Grund → „Sonstiges", Text getrimmt. */
export function setzeMeldung(s: Lernstand, id: string, grund: string, text: string, jetzt: number): Lernstand {
  return {
    ...s,
    meldungen: { ...meldungenVon(s), [id]: { grund: grund || "Sonstiges", text: text.trim(), datum: jetzt } },
  };
}

export function entferneMeldung(s: Lernstand, id: string): Lernstand {
  const m = { ...meldungenVon(s) };
  delete m[id];
  return { ...s, meldungen: m };
}

export function anzahlMeldungen(s: Lernstand): number {
  return Object.keys(meldungenVon(s)).length;
}

/** Export wie `meldungenJSON()`. */
export function meldungenJSON(s: Lernstand): string {
  return JSON.stringify(meldungenVon(s), null, 2);
}

/** Export wie `meldungenText()` — Zeichen für Zeichen (Gleichheitstest). */
export function meldungenText(s: Lernstand, nachId: NachId): string {
  const alle = meldungenVon(s);
  return Object.keys(alle).map((id) => {
    /* N38 Q1: BEGRUENDET STEHEN GELASSEN – Zeichen fuer Zeichen wie die alte App (Gleichheitstest),
       auch ihr Verhalten bei kaputtem Eintrag; `meldungen` wird beim Laden nicht je Eintrag gesiebt. */
    const mm = alle[id] as Meldung;
    const f = nachId(id);
    return "[" + id + "] " + (f ? modulName(f.modul) + " · " + f.thema : "(nicht im Pool)") +
      "\nGrund: " + (mm.grund || "-") + (mm.text ? "\nDetails: " + mm.text : "") +
      "\nDatum: " + new Date(mm.datum).toLocaleString("de-DE") +
      "\nFrage: " + (f ? (f.frage || "").replace(/\s+/g, " ").trim() : "") + "\n";
  }).join("\n");
}
