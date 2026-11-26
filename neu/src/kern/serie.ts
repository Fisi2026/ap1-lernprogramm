/* ============================================================================
   DIE THEMEN-SERIE (#60/#27)

   Nach einer FALSCHEN Antwort bietet die alte App an, "mehr zu diesem Thema"
   zu ueben: fuenf weitere Fragen aus demselben Feinthema, die ab der naechsten
   Ziehung mit Vorrang kommen (`ziehen.ts`, Zweig 1).

   ⛔ DER FILTER VERGLEICHT MODUL **UND** THEMA. Poolweit ist ein Feinthema
      ueberall als "modul|thema" definiert (S.themen, L.THEMA_GEBIET), und die
      alte App haelt es hier seit FB-R3 Punkt 8 ausdruecklich genauso. Wer nur
      ueber `thema` vergleicht, zieht bei einer spaeteren Namenskollision
      modulfremde Fragen — und niemand merkt es, weil der Themenname stimmt.
   ⚠️ DER RUECKFALL IST AUF DAS MODUL, NICHT AUF DEN GANZEN BESTAND: hat das
      Feinthema weniger als zwei weitere Fragen, wird das Modul genommen. Sonst
      hiesse "mehr zu diesem Thema" irgendwann "irgendwas".
   ============================================================================ */
import { CONFIG } from "./tabellen/konfig.ts";
import type { Lernstand } from "./stand";
import type { Frage } from "@/daten/typen";
import { kandidaten } from "./auswahl";
import { shuffle } from "./zufall.ts";

/** Aus CONFIG.serie (kern/tabellen/konfig.ts) — NICHT hier noch einmal hingeschrieben. */
export const SERIEN_LAENGE = CONFIG.serie;

/** Die Kennungen, aus denen eine Serie zu `f` gezogen werden darf.
    Leer heisst: kein Angebot. Veraendert nichts. */
export function serienKandidaten(
  stand: Lernstand,
  alle: readonly Frage[],
  nachId: (id: string) => Frage | undefined,
  f: Frage,
): string[] {
  if (!f.thema || f.generatorArt) return [];
  const ids = kandidaten(stand, alle);
  const gefiltert = (passt: (x: Frage) => boolean) =>
    ids.filter((id) => {
      const x = nachId(id);
      return !!x && id !== f.id && passt(x);
    });
  const imThema = gefiltert((x) => x.thema === f.thema && x.modul === f.modul);
  /* "< 2", nicht "=== 0": eine einzelne Nachbarfrage ist keine Serie. */
  return imThema.length < 2 ? gefiltert((x) => x.modul === f.modul) : imThema;
}

/** Aus den Kandidaten die Warteschlange bauen — gemischt, hoechstens fuenf. */
export function starteSerie(ids: readonly string[], rng?: () => number): string[] {
  const s = shuffle(ids, rng);
  return s.slice(0, SERIEN_LAENGE);
}
