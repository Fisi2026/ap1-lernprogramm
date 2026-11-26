/* ============================================================================
   Bestand laden — direkt aus pool/, der einzigen Quelle.
   ⛔ NICHT aus fragen.js: das ist ein Bauergebnis. Wer das Bauergebnis liest,
      merkt nicht, wenn der Bau schiefgeht. Genau dafuer gibt es in check.sh
      den Drift-Waechter "fragen.js == pool-Build" (beide entfielen mit N29 Teil 2).
   Die Gegenprobe (gleiche Menge, gleiche IDs) laeuft als eigener Test, nicht hier.
   ============================================================================ */
import type { Frage, Gebiet } from "./typen";
import { FRAGETYPEN, GEBIETE } from "./typen";

import { setzeFaelle } from "./faelle";
import { istObjekt } from "../kern/pruefe.ts";

/* N32/E31: der Pool kommt als EIGENER Chunk (`pooldaten.ts`), geladen von
   `ladePool()`. Seit N38 P1 (E63) zeichnet die App SOFORT; Schirme, die Fragen
   brauchen, warten ueber `poolStatus()`/`abonnierePool()` (`huelle/usePool.ts`).
   ⛔⛔ DESHALB DARF KEIN MODUL `FRAGEN` BEIM LADEN LESEN – nur beim Aufruf.
      Vor `ladePool()` ist die Liste LEER, und eine Schleife auf Modulebene
      saehe still einen leeren Pool. Der Waechter `modulebene.test.ts` meldet
      jede solche Stelle. `FRAGEN` ist eine lebende Bindung (`export let`):
      wer sie beim Aufruf liest, sieht den geladenen Pool. */

const GEBIET_IDS: readonly string[] = GEBIETE.map((g) => g.id);

function istFrage(x: unknown, quelle: string): x is Frage {
  if (!istObjekt(x)) return false;   // eine Liste scheiterte vorher an `id` – Urteil gleich
  const f = x;
  const fehlt =
    typeof f.id !== "string" ||
    typeof f.frage !== "string" ||
    typeof f.thema !== "string" ||
    !FRAGETYPEN.some((t) => t === f.typ) ||
    !GEBIET_IDS.some((g) => g === f.gebiet);
  if (fehlt) {
    // Laut, nicht still: eine Frage, die durchrutscht, faellt sonst erst beim Lernen auf.
    console.error("[Bestand] unbrauchbarer Satz in " + quelle, f.id ?? f);
    return false;
  }
  return true;
}

function lies(dateien: Record<string, { default: unknown }>): Frage[] {
  const alle: Frage[] = [];
  for (const [pfad, mod] of Object.entries(dateien)) {
    const roh = mod.default;
    /* N38 Q1: vorher `(roh as { fragen?: unknown[] })?.fragen ?? …` – jetzt geprueft */
    const liste: unknown[] = Array.isArray(roh) ? roh
      : !istObjekt(roh) ? []
      : Array.isArray(roh.fragen) ? roh.fragen
      : Array.isArray(roh.items) ? roh.items
      : [];
    for (const satz of liste) if (istFrage(satz, pfad)) alle.push(satz);
  }
  alle.sort((a, b) => a.id.localeCompare(b.id));
  return alle;
}

export let FRAGEN: readonly Frage[] = [];
let nachId = new Map<string, Frage>();
let laeuft: Promise<void> | null = null;

/** Laedt den Pool (einmal; weitere Aufrufe bekommen dasselbe Versprechen). */
export function ladePool(): Promise<void> {
  laeuft ??= import("./pooldaten").then((m) => {
    FRAGEN = lies(m.fragenDateien);
    nachId = new Map(FRAGEN.map((f) => [f.id, f]));
    setzeFaelle(Object.values(m.faelleDateien)[0]?.default ?? []);
  }).catch((e: unknown) => { laeuft = null; throw e; });
  return laeuft;
}

/* N38 P1 (E63): der Ladezustand als kleiner Speicher, damit die App ohne Pool
   zeichnen und beim Eintreffen neu zeichnen kann (`huelle/usePool.ts`).
   ⚠️ Solange niemand `startePool` gerufen hat (Tests, die den Pool im Pruefstand laden), gilt der
      Pool als „da", sobald er geladen ist. Danach zaehlt allein der gefuehrte Zustand.
      „fehler" ist kein Endzustand: `nochmalPool()`. */
export type PoolStatus = "laedt" | "da" | "fehler";
let status: PoolStatus = "laedt";
let gestartet = false;
let lader: () => Promise<void> = ladePool;
const hoerer = new Set<() => void>();
function setzeStatus(neu: PoolStatus): void {
  if (neu === status) return;
  status = neu;
  for (const h of hoerer) h();
}
export function poolStatus(): PoolStatus {
  if (!gestartet) return FRAGEN.length > 0 ? "da" : "laedt";
  return status;
}
export function abonnierePool(h: () => void): () => void {
  hoerer.add(h);
  return () => { hoerer.delete(h); };
}
/** Startet das Laden und fuehrt den Zustand mit (`huelle/start.tsx`). */
export function startePool(l: () => Promise<void> = ladePool): Promise<void> {
  lader = l;
  gestartet = true;
  status = "laedt";
  for (const h of hoerer) h();
  return l().then(() => { setzeStatus("da"); }, (e: unknown) => { setzeStatus("fehler"); throw e; });
}
/** „Nochmal versuchen": derselbe Lader wie beim Start. */
export function nochmalPool(): void {
  startePool(lader).catch(() => undefined);
}

export function frageMitId(id: string): Frage | undefined {
  return nachId.get(id);
}

/** Zaehlung je Gebiet — die Grundlage der Fuellstaende im Reiterband. */
export function bestandJeGebiet(): Record<Gebiet, number> {
  /* N38 Q1: BEGRUENDET STEHEN GELASSEN – `GEBIETE` traegt jedes Gebiet genau einmal; TS kann die
     Vollstaendigkeit eines aus einer Liste gebauten Objekts nicht sehen. */
  const z = Object.fromEntries(GEBIETE.map((g) => [g.id, 0])) as Record<Gebiet, number>;
  for (const f of FRAGEN) z[f.gebiet]++;
  return z;
}
