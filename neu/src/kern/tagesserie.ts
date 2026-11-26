/* ============================================================================
   DIE TAGESSERIE (`serie`) — Etappe N21

   Vorbild `sSerie` (app_pages2.js), `schwaechstesGebiet` (app_seiten.js) und
   `mischeTypen` (app_util.js). Nutzer-Entscheid 17.09.2026: fuer den Neubau NEU
   geschrieben, die alte App bleibt unangetastet. Gegen die alte Fassung misst
   `tagesserie.gleichheit.test.ts` (node:vm, wie N20a).

   ⚠️ NICHT ZU VERWECHSELN mit der Themen-Serie (`serie.ts`, N11).

   Die Regel:
   * Gebiet: das mit der schlechtesten Quote unter denen mit mindestens FUENF
     gespeicherten Antworten; hat keines so viele, das am wenigsten geuebte.
     Nur Gebiete, zu denen es Fragen im AP-Filter (`inklAP2`) gibt, nie M9.
   * Ziehung: hoechstens ZWEI aus dem Fehler-Deck, dann frische (nicht in
     `lastShown`), dann der Rest — zusammen FUENF, danach nach Typen gemischt.

   ⛔⛔ ABWEICHUNG VON DER ALTEN APP (Nutzer-Entscheid 17.09.2026, gemessen):
      `sSerie` rechnet das Gebiet nach JEDER Antwort neu und baut die Serie bei
      einem Wechsel von vorn auf. Ein neuer Lerner wechselte in 12 von 12
      Antworten das Gebiet — die Serie war erst nach rund 21 Antworten
      abschliessbar. Hier wird Gebiet UND Auswahl beim Start festgelegt
      (`baueTagesserie`) und danach nicht mehr angefasst.
   ============================================================================ */
import { GEBIETE } from "./tabellen/gebiete.ts";
import type { Lernstand } from "./stand";
import type { Frage } from "@/daten/typen";
import { istUnterrichtsFrage } from "./auswahl";
import { istGekonnt } from "./gekonnt.ts";
import { dayKey, gebietFuer, statProGebiet } from "./lernen.ts";
import { shuffle } from "./zufall.ts";

/** Laenge der Tagesserie — in der alten App ein Literal in `sSerie`, nicht
    `CONFIG.serie` (das ist die Themen-Serie). */
export const TAGESSERIE_LAENGE = 5;
/** Hoechstens so viele Fragen aus dem Fehler-Deck. */
const TAGESSERIE_DECK_MAX = 2;
/** Ab so vielen gespeicherten Antworten zaehlt die Quote eines Gebiets. */
const TAGESSERIE_MIN_ANTWORTEN = 5;

type Rng = () => number;
const mische = <T,>(a: readonly T[], rng?: Rng): T[] =>
  shuffle(a, rng);

/** Der AP-Filter der globalen Ansichten (`passtAP`, app_pool.js):
    AP2 nur mit `inklAP2`, M09 nie. */
export function passtAP(stand: Lernstand, f: Frage): boolean {
  return (stand.inklAP2 || f.pruefungsteil !== "AP2") && !istUnterrichtsFrage(f);
}

/** Das statistisch schwaechste Gebiet. Faellt auf "A1" zurueck, wenn es gar
    keine Fragen gibt (wie die alte App). */
export function schwaechstesGebiet(stand: Lernstand, alle: readonly Frage[]): string {
  const spg = statProGebiet(stand.statistik);
  const vorhanden = new Set<string>();
  for (const f of alle) {
    const g = passtAP(stand, f) ? gebietFuer(f) : undefined;
    if (g !== undefined) vorhanden.add(g);   /* N38 Q1: ohne Gebiet fragt `has(code)` ohnehin nie danach */
  }
  let best: { gebiet: string; q: number } | null = null;
  let least: { gebiet: string; g: number } | null = null;
  for (const [code] of GEBIETE) {
    if (code === "M9" || !vorhanden.has(code)) continue;
    const e = spg[code];
    if (e && e.gesamt >= TAGESSERIE_MIN_ANTWORTEN) {
      const q = e.richtig / e.gesamt;
      if (best === null || q < best.q) best = { gebiet: code, q };
    }
    const g = (e && e.gesamt) || 0;
    if (least === null || g < least.g) least = { gebiet: code, g };
  }
  return best ? best.gebiet : least ? least.gebiet : "A1";
}

/** Effektiver Typ: eine Bildfrage zaehlt als ihr Unter-Typ. */
export function typVon(f: Frage): string {
  return f.typ === "bild" ? (f.unterTyp || "mc") : f.typ;
}

/** Moeglichst nie zwei gleiche Typen direkt hintereinander. */
export function mischeTypen(fragen: readonly Frage[], rng?: Rng): Frage[] {
  const rest = mische(fragen, rng);
  const out: Frage[] = [];
  while (rest.length) {
    const zuletzt = out.at(-1);
    const letzter = zuletzt ? typVon(zuletzt) : null;
    let idx = rest.findIndex((f) => typVon(f) !== letzter);
    if (idx < 0) idx = 0;
    out.push(rest.splice(idx, 1)[0]!); // idx < rest.length
  }
  return out;
}

export interface Tagesserie {
  gebiet: string;
  /** Kennungen in Spielreihenfolge. Leer heisst: keine Fragen im Gebiet. */
  ids: string[];
}

/** Gebiet bestimmen und fuenf Fragen ziehen. Veraendert nichts. */
export function baueTagesserie(stand: Lernstand, alle: readonly Frage[], rng?: Rng): Tagesserie {
  const gebiet = schwaechstesGebiet(stand, alle);
  const deck = stand.fehlerDeck || {};
  const zuletzt = stand.lastShown || [];
  /* „Kann ich schon“ (25.11.2026, kern/gekonnt.ts): gekonnte Fragen kommen nicht in die Serie. */
  const pool = alle.filter((f) => passtAP(stand, f) && f.gebiet === gebiet && !istGekonnt(stand, f.id));
  const imFD = pool.filter((f) => !!deck[f.id]);
  const frisch = pool.filter((f) => !deck[f.id] && zuletzt.indexOf(f.id) === -1);
  const rest = pool.filter((f) => !deck[f.id] && zuletzt.indexOf(f.id) >= 0);
  const auswahl = mische(imFD, rng).slice(0, TAGESSERIE_DECK_MAX)
    .concat(mische(frisch, rng))
    .concat(mische(rest, rng))
    .slice(0, TAGESSERIE_LAENGE);
  return { gebiet, ids: mischeTypen(auswahl, rng).map((f) => f.id) };
}

/** Der Tag im Format der alten App (`L.dayKey`, ISO — nie aendern). */
export function tagVon(jetzt: number): string {
  return dayKey(jetzt);
}

export function serieHeuteErledigt(stand: Lernstand, jetzt: number): boolean {
  return stand.serieDone === tagVon(jetzt);
}

/** Beim Abschluss: `serieDone` auf heute (alte App: `setS('serieDone', …)`). */
export function markiereSerieErledigt(stand: Lernstand, jetzt: number): Lernstand {
  return { ...stand, serieDone: tagVon(jetzt) };
}
