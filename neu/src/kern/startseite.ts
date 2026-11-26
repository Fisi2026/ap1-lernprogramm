/* ============================================================================
   DIE STARTSEITE — was sie zeigt, gerechnet ohne Oberfläche (Etappe N22)

   Vorbild `sStart` (app_seiten.js): Kachelmenü und „Dein Stand".
   ⛔⛔ JEDE ZAHL IST GEMESSEN (Lehre N8, Nutzer-Entscheid 17.09.2026):
      * Badges nur, wo sie etwas zählen: fällige Karten, markierte Fragen,
        „heute offen" bei der Tagesserie. Die festen „NEU"-Badges der alten App
        entfallen, die Unterricht-Kachel kommt erst mit N28.
      * Was es nicht gibt, steht nicht da: keine Trefferquote ohne Antwort
        (die alte App zeigt dort „0 %"), keine letzte Simulation ohne Lauf.
   ============================================================================ */
import { TAG_MS } from "./tabellen/konfig.ts";
import { GEBIETE } from "./tabellen/gebiete.ts";
import type { Lernstand } from "./stand";
import type { Frage } from "@/daten/typen";
import type { Bereich } from "./route";
import { kennzahlen, bereitschaft } from "./kennzahlen";
import { markierteIds } from "./markiert";
import { schwaechstesGebiet, serieHeuteErledigt } from "./tagesserie";
import { abkuerzungenFrei } from "./glossar";
import { dayKey, gebietName, statProGebiet } from "./lernen.ts";

export interface Kachel {
  ziel: Bereich;
  titel: string;
  sub: string;
  badge?: string;
  hero?: boolean;
}

/** Die Kacheln in der Reihenfolge der alten App (ohne Unterricht).
    N38 P1 (E63): `alle === null` heisst „Pool noch nicht da" – dann steht nur, was ohne ihn stimmt:
    kein Gebietsname in der Tagesserie, die Markiert-Kachel ohne Zahl (ob die IDs noch im Pool
    stehen, weiss erst der Pool). ⛔ Nicht mit `[]` rufen: das waere ein leerer Pool, kein fehlender. */
export function kacheln(stand: Lernstand, alle: readonly Frage[] | null, jetzt: number): Kachel[] {
  const k = kennzahlen(stand, jetzt);
  const byId: Record<string, Frage> = {};
  for (const f of alle ?? []) byId[f.id] = f;
  const markiert = alle ? markierteIds(stand, (id) => byId[id]).length : Object.keys(stand.markiert).length;
  const heuteSerie = serieHeuteErledigt(stand, jetzt);
  const gebiet = alle ? gebietName(schwaechstesGebiet(stand, alle)) : null;

  const liste: Kachel[] = [
    { ziel: "ueben", hero: true, titel: "Üben", sub: "Adaptives Training über alle Themen – mit Fehler-Deck-Einstreuung." },
    {
      ziel: "serie", titel: "Tagesserie: schwächstes Gebiet",
      sub: (gebiet ? `${gebiet} – 5` : "5") + " Fragen gegen deine größte Schwäche." + (heuteSerie ? " Heute schon absolviert." : ""),
      ...(heuteSerie ? {} : { badge: "heute offen" }),
    },
    ...(markiert > 0
      ? [{ ziel: "markiert" as const, titel: "Markiert ★", sub: "Deine per ★ markierten Fragen gezielt wiederholen.", ...(alle ? { badge: String(markiert) } : {}) }]
      : []),
    {
      ziel: "fd", titel: "Fehler-Deck", sub: "Wiedervorlage falsch beantworteter Fragen (1/3/7-Tage-Rhythmus).",
      ...(k.faellig > 0 ? { badge: String(k.faellig) } : {}),
    },
    { ziel: "sim", titel: "Prüfungssimulation", sub: "AP1-Format: 4 Aufgaben, 100 Punkte, auf Zeit – inkl. Fallaufgaben." },
    { ziel: "gen", titel: "Rechen-Generator", sub: "Übertragungszeit, Subnetting, Zahlensysteme, Datenmengen – immer neue Werte." },
    { ziel: "netzplan", titel: "Netzplan-Training", sub: "Interaktive Netzpläne: FAZ, FEZ, SAZ, SEZ und Puffer selbst eintragen." },
    { ziel: "gantt", titel: "Gantt-Training", sub: "Balkenplan/Terminplanung: Start- und End-Tage selbst bestimmen – mit kritischem Pfad." },
    {
      ziel: "glossar", titel: "Glossar",
      sub: "Begriffslexikon aus allen Erklär-Fragen." + (abkuerzungenFrei(stand) ? " Jetzt auch mit IT-Abkürzungs-Lexikon." : ""),
    },
    { ziel: "spickzettel", titel: "Spickzettel", sub: "Formeln & Zusammenfassungen aller Module." },
    { ziel: "stat", titel: "Statistik", sub: "Stärken, Schwächen und Verlauf im Detail." },
    { ziel: "einst", titel: "Einstellungen", sub: "Tagesziel, Prüfungsdatum, Prüfungsteil, Meldungen." },
  ];
  return liste;
}

export interface StandZeile {
  /** Bereitschaft gesamt — null ohne Daten. */
  bereitschaft: { score: number; ampel: string } | null;
  heute: number;
  tagesziel: number;
  quote: number | null;
  faellig: number;
  /** Prozent der letzten Simulation — null, wenn es keine gab. */
  letzteSimulation: number | null;
}

export function standZeile(stand: Lernstand, jetzt: number): StandZeile {
  const k = kennzahlen(stand, jetzt);
  const b = bereitschaft(stand).gesamt;
  const hist = stand.simHistorie || [];
  const letzte = hist.at(-1)?.prozent;
  return {
    bereitschaft: b.score === null ? null : { score: b.score, ampel: b.ampel },
    heute: k.heute,
    tagesziel: k.tagesziel,
    quote: k.quote,
    faellig: k.faellig,
    letzteSimulation: typeof letzte === "number" ? letzte : null,
  };
}

/** Die letzten 14 Tage, ältester zuerst (alte App: `dailyCounts`, `L.dayKey`). */
export function aktivitaet14(stand: Lernstand, jetzt: number): Array<{ tag: string; anzahl: number }> {
  const tage = stand.dailyCounts || {};
  const out: Array<{ tag: string; anzahl: number }> = [];
  for (let d = 13; d >= 0; d--) {
    const tag = dayKey(jetzt - d * TAG_MS);
    out.push({ tag, anzahl: tage[tag] || 0 });
  }
  return out;
}

/** Trefferquote je Gebiet, roh (`L.statProGebiet`) — ohne M9.
    `null` heißt: in diesem Gebiet ist noch nichts beantwortet. */
export function quoteJeGebiet(stand: Lernstand): Array<{ code: string; name: string; richtig: number; gesamt: number; quote: number | null }> {
  const spg = statProGebiet(stand.statistik);
  return GEBIETE
    .filter(([code]) => code !== "M9")
    .map(([code, name]) => {
      const e = spg[code];
      return {
        code, name,
        richtig: e ? e.richtig : 0,
        gesamt: e ? e.gesamt : 0,
        quote: e && e.gesamt ? Math.round((e.richtig / e.gesamt) * 100) : null,
      };
    });
}

export function poolZahlen(alle: readonly Frage[]): { gesamt: number; ap1: number; ap2: number } {
  const ap1 = alle.filter((f) => f.pruefungsteil !== "AP2").length;
  return { gesamt: alle.length, ap1, ap2: alle.length - ap1 };
}
