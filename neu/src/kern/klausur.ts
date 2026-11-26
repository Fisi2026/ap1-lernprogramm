/* ============================================================================
   K2 (PLAN_KLAUSUR2.md, 14.10.2026) / K3 (PLAN_KLAUSUR3.md, 23.11.2026): DAS KLAUSUR-SET UND SEINE ZIEHUNG

   Seit K3 (K3-E10) wird `pool/sets/klausur_k3.json` geuebt; `klausur_k2.json` bleibt nur im Repo.
   K3-E40/E54: jedes Thema traegt seine Klausurpunkte; im Regelfall (Deck) wird zuerst ein Thema nach
   Punkten gewichtet gewaehlt, dann darin gezogen. Serie und Fehler-Deck bleiben ueber der ganzen Auswahl.
   K3-E41: ab dem Tag nach `datum` gilt die Klausur als vorbei (`klausurVorbei`) – der Bereich wird ausgeblendet.

   Das Set ist eine Liste von VERWEISEN auf Pool-IDs je Klausurthema –
   keine Kopien (K2-E3, Lehre E46: Kopien laufen auseinander). Geuebt wird mit DERSELBEN Ziehung wie im
   Bereich Ueben (`ziehe`), nur auf das Set beschraenkt:
   * K2-E11: gebucht wird ganz normal (Lernstand, Fehler-Deck, Statistik, Bereitschaft).
   * K2-E17: Themen an-/abwaehlbar; nichts gewaehlt = alle.
   * K2-E18: in den Themen mit Generator (Subnetting, RAID) jede fuenfte Ziehung eine Rechenaufgabe.
   ⚠️ Die Ziehung arbeitet auf einer SICHT des Standes ohne Gebiets-/Themen-/Pruefungsteil-Filter des
      Ueben-Bereichs – sonst schnitte die Auswahl dort (z. B. „nur AP1") still das Set weg.
   ⛔ Das Deck („gesehen") ist EINES fuer alle Bereiche. Ist das Set einmal durch, mischt `deckPick` neu
      und gibt ein LEERES `seen` zurueck – das wuerde den Fortschritt im Ueben-Bereich mitloeschen.
      `zieheFuerKlausur` setzt deshalb nur die Set-Kennungen zurueck (Test in klausur.test.ts).
   ============================================================================ */
import type { Frage } from "@/daten/typen";
import type { Lernstand } from "./stand";
import { ziehe } from "./ziehen";
import type { UebenZug } from "./uebenablauf";
import { aufgabeDerArt, type Zufallsaufgabe } from "./generator";
import { pick } from "./zufall.ts";
import { istArtGekonnt } from "./gekonnt.ts";
import { istObjekt } from "./pruefe.ts";

interface KlausurThema {
  nr: number;
  titel: string;
  /** Art aus `GENERATOREN` (generatoren.ts) oder null. */
  generator: string | null;
  /** Klausurpunkte (K3-E40); fehlt die Angabe, zaehlt das Thema wie 1 Punkt. */
  punkte?: number;
  ids: string[];
}
export interface KlausurSet {
  name: string;
  datum: string;
  themen: KlausurThema[];
}

/* Wie `pooldaten.ts` ueber `import.meta.glob` (tsconfig kennt `@pool` nur im Bundler). Das Set ist
   klein (nur Kennungen) und liegt deshalb im Einstieg, nicht im Pool-Chunk. */
// Stryker disable next-line all: Vite verlangt hier ein woertliches Argument (Mutation des Musters bricht den Lauf)
const dateien = import.meta.glob<{ default: unknown }>("@pool/sets/klausur_k3.json", { eager: true });

/** Prueft die Form; ein kaputtes Set wird laut gemeldet und als leer behandelt. */
export function leseSet(x: unknown): KlausurSet {
  const leer: KlausurSet = { name: "", datum: "", themen: [] };
  if (!istObjekt(x) || typeof x.name !== "string" || typeof x.datum !== "string" || !Array.isArray(x.themen)) {
    console.error("[Klausur-Set] unbrauchbar");
    return leer;
  }
  const themen: KlausurThema[] = [];
  for (const t of x.themen) {
    if (!istObjekt(t) || typeof t.nr !== "number" || typeof t.titel !== "string" || !Array.isArray(t.ids)
        || !(t.generator === null || typeof t.generator === "string")) {
      console.error("[Klausur-Set] unbrauchbares Thema", t);
      continue;
    }
    themen.push({ nr: t.nr, titel: t.titel, generator: t.generator,
      ...(typeof t.punkte === "number" && t.punkte > 0 ? { punkte: t.punkte } : {}),
      ids: t.ids.filter((i): i is string => typeof i === "string") });
  }
  return { name: x.name, datum: x.datum, themen };
}

export const KLAUSUR_SET: KlausurSet = leseSet(Object.values(dateien)[0]?.default);

/** Jede wievielte Ziehung eine Rechenaufgabe ist (K2-E18). `% 5 === 3`: faellt nie auf den
    Takt des Fehler-Decks (`% 5 === 0`, EINSTREUUNG.fehlerDeck). */
export const KLAUSUR_GENERATOR_TAKT = 5;

/** Die gewaehlten Themen; leer = alle (K2-E17). */
function gewaehlteThemen(set: KlausurSet, nrn: readonly number[]): KlausurThema[] {
  return nrn.length ? set.themen.filter((t) => nrn.includes(t.nr)) : set.themen;
}

/** Die Kennungen der gewaehlten Themen (ohne Doppelte). */
export function klausurIds(set: KlausurSet, nrn: readonly number[]): Set<string> {
  return new Set(gewaehlteThemen(set, nrn).flatMap((t) => t.ids));
}

/** Je Thema: wie viele Verweise auf eine vorhandene Frage zeigen, und welche ins Leere. */
export function klausurBestand(
  set: KlausurSet, nachId: (id: string) => Frage | undefined,
): { nr: number; titel: string; anzahl: number; fehlend: string[] }[] {
  return set.themen.map((t) => {
    const fehlend = t.ids.filter((id) => !nachId(id));
    return { nr: t.nr, titel: t.titel, anzahl: t.ids.length - fehlend.length, fehlend };
  });
}

/** K3-E41: ab 0 Uhr des Tages NACH `datum` (Ortszeit) ist die Klausur vorbei. Ein unlesbares Datum
    blendet nichts aus. */
export function klausurVorbei(set: KlausurSet, heute: number): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(set.datum);
  if (!m) return false;
  const danach = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + 1).getTime();
  return heute >= danach;
}

/** K3-E40: Fortschritt je Thema im laufenden Durchgang – Fragen, die schon vorkamen (`seen`) und nicht
    offen im Fehler-Deck liegen. Kein neues Feld im Lernstand (wie K2: keine Migration); mischt das Set
    neu, beginnt der Durchgang wieder bei null. */
export function klausurFortschritt(
  set: KlausurSet, stand: Pick<Lernstand, "seen" | "fehlerDeck">,
): Map<number, number> {
  return new Map(set.themen.map((t) => [
    t.nr, [...new Set(t.ids)].filter((id) => stand.seen[id] && !stand.fehlerDeck[id]).length,
  ]));
}

/** K3-E54: ein Thema, nach Klausurpunkten gewichtet. */
export function waehleThemaNachPunkten(themen: readonly KlausurThema[], rng: () => number = Math.random): KlausurThema | undefined {
  const summe = themen.reduce((a, t) => a + (t.punkte ?? 1), 0);
  let r = rng() * summe;
  for (const t of themen) {
    r -= t.punkte ?? 1;
    if (r < 0) return t;
  }
  return themen[themen.length - 1];
}

/** Die Stand-Sicht fuer die Ziehung: ohne die Auswahl des Ueben-Bereichs. */
export function klausurSicht(stand: Lernstand): Lernstand {
  return { ...stand, gebiete: [], themen: [], uebenAP: "beide", wirtschaftNur: false };
}

export interface KlausurKontext {
  stand: Lernstand;
  alle: readonly Frage[];
  nachId: (id: string) => Frage | undefined;
  letzteThemen: string[];
  serie: string[];
  heute: number;
  set: KlausurSet;
  themen: readonly number[];
  rng?: () => number;
}

/** Zieht im Klausur-Set. Veraendert NICHTS – verbucht wird wie beim Ueben (`nachDemZiehen`). */
export function zieheFuerKlausur(k: KlausurKontext): UebenZug {
  const ids = klausurIds(k.set, k.themen);
  const sicht = klausurSicht(k.stand);
  const alle = k.alle.filter((f) => ids.has(f.id));
  const passt = (f: Frage) => ids.has(f.id);

  /* K2-E18: Rechenaufgabe, wenn ein gewaehltes Thema einen Generator hat – nie zweimal hintereinander,
     nie waehrend einer Themen-Serie. */
  const zaehler = k.stand.uebenZaehler + 1;
  /* „Kann ich schon“ (25.11.2026, kern/gekonnt.ts): ausgeblendete Arten nicht mehr ziehen. Sind alle Arten
     der Auswahl ausgeblendet, faellt der Zweig weg und es kommen nur Pool-Fragen. */
  const arten = gewaehlteThemen(k.set, k.themen)
    .flatMap((t) => (t.generator && !istArtGekonnt(k.stand, t.generator) ? [t.generator] : []));
  if (!k.serie.length && arten.length && zaehler % KLAUSUR_GENERATOR_TAKT === 3 && k.stand.lastTyp !== "generator") {
    const art = pick(arten, k.rng);
    const aufgabe: Zufallsaufgabe | null = art ? aufgabeDerArt(k.stand, art, k.rng) : null;
    if (aufgabe) {
      return {
        ergebnis: { art: "zufall", aufgabe },
        serieVerbraucht: false,
        zug: { id: null, herkunft: "generator", deckNeu: false, seen: k.stand.seen },
        frage: undefined,
      };
    }
  }

  const ziehkontext = (auswahl: readonly Frage[]) => ({
    stand: sicht, alle: auswahl, nachId: k.nachId, letzteThemen: k.letzteThemen, serie: k.serie,
    heute: k.heute, ...(k.rng ? { rng: k.rng } : {}), generatorMoeglich: false,
  });
  let zug = ziehe(ziehkontext(alle), passt);
  /* Deck-Ids, die bei `deckNeu` zurueckgesetzt werden: die ganze Auswahl oder das gewichtete Thema. */
  let deckIds: Set<string> = ids;
  /* K3-E54: im Regelfall erst ein Thema nach Punkten waehlen, dann darin ziehen (Serie und Fehler-Deck oben
     bleiben ueber der ganzen Auswahl). Liefert das Thema nichts, gilt der Zug ueber alle. */
  const gewaehlt = gewaehlteThemen(k.set, k.themen).filter((t) => t.ids.length);
  if (zug.herkunft === "deck" && gewaehlt.length > 1) {
    const thema = waehleThemaNachPunkten(gewaehlt, k.rng);
    if (thema) {
      const tIds = new Set(thema.ids);
      const tZug = ziehe(ziehkontext(alle.filter((f) => tIds.has(f.id))), (f) => tIds.has(f.id));
      if (tZug.id && tZug.herkunft === "deck") { zug = tZug; deckIds = tIds; }
    }
  }
  const serieVerbraucht = zug.herkunft === "serie";
  if (!zug.id) return { ergebnis: { art: "leer" }, serieVerbraucht, zug: null, frage: undefined };
  if (zug.deckNeu) {
    /* nur das Set (bzw. Thema) neu mischen, den Rest des Decks behalten (siehe Kopf) */
    const behalten = Object.fromEntries(Object.entries(k.stand.seen).filter(([id]) => !deckIds.has(id)));
    zug.seen = { ...behalten, ...zug.seen };
  }
  const frage = k.nachId(zug.id);
  return {
    ergebnis: { art: "pool", id: zug.id, herkunft: zug.herkunft, thema: frage?.thema },
    serieVerbraucht,
    zug,
    frage,
  };
}
