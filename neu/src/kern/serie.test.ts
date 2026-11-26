/* ============================================================================
   DIE THEMEN-SERIE — GEMESSEN AM ECHTEN BESTAND

   ⚠️ KEIN GLEICHHEITSBEWEIS. `zeigeThemenSerieAngebot()` in app_seiten.js baut
      einen Knopf in `qa` und liest `kandidaten()` aus der laufenden Oberflaeche;
      ausfuehrbar ist das nur mit halber alter App. Gemessen wird deshalb die
      REGEL: Modul UND Thema, Rueckfall auf das Modul, Laenge, und dass die
      Ausgangsfrage nie in ihrer eigenen Serie steht.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import { FRAGEN } from "@/daten/laden";
import type { Frage } from "@/daten/typen";
import { leererStand } from "./stand";
import type { Lernstand } from "./stand";
import { serienKandidaten, starteSerie, SERIEN_LAENGE } from "./serie";
import { kandidaten } from "./auswahl";

const POOL: Record<string, Frage> = {};
for (const f of FRAGEN) POOL[f.id] = f;
const nachId = (id: string) => POOL[id];
const stand = leererStand() as Lernstand;

function zufall(saat: number): () => number {
  let s = saat >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

/** Eine Frage, deren Feinthema in der Auswahl genug Nachbarn hat. */
function ergiebigeFrage(): Frage {
  const ids = kandidaten(stand, FRAGEN);
  const proThema: Record<string, string[]> = {};
  for (const id of ids) {
    const f = POOL[id];
    const k = f.modul + "|" + f.thema;
    (proThema[k] = proThema[k] || []).push(id);
  }
  const voll = Object.keys(proThema).find((k) => proThema[k].length >= 6);
  if (!voll) throw new Error("kein Feinthema mit 6 Kandidaten - Test waere sonst leer");
  return POOL[proThema[voll][0]];
}

describe("Welche Fragen eine Serie fuellen duerfen", () => {
  it("nimmt nur Fragen aus DEMSELBEN Modul und Thema", () => {
    const f = ergiebigeFrage();
    const ids = serienKandidaten(stand, FRAGEN, nachId, f);
    expect(ids.length).toBeGreaterThanOrEqual(5);
    for (const id of ids) {
      expect(POOL[id].thema).toBe(f.thema);
      expect(POOL[id].modul).toBe(f.modul);
    }
  });

  it("laesst die Ausgangsfrage selbst weg", () => {
    const f = ergiebigeFrage();
    expect(serienKandidaten(stand, FRAGEN, nachId, f)).not.toContain(f.id);
  });

  it("nimmt nur Fragen, die auch die Uebenauswahl zulaesst", () => {
    const f = ergiebigeFrage();
    const erlaubt = new Set(kandidaten(stand, FRAGEN));
    for (const id of serienKandidaten(stand, FRAGEN, nachId, f)) {
      expect(erlaubt.has(id)).toBe(true);
    }
  });

  it("faellt auf das MODUL zurueck, wenn das Feinthema zu duenn ist", () => {
    /* ⛔ GENAU EINE Nachbarfrage im Feinthema — der Grenzfall. Die Regel lautet
       "weniger als zwei", nicht "gar keine": eine einzelne Frage ist keine
       Serie. Mit einem Fixture ohne Nachbarn waere der Unterschied zwischen
       "< 2" und "=== 0" nicht messbar, und die Grenze koennte still verrutschen. */
    const bau = (id: string, thema: string, modul: string): Frage =>
      ({ ...POOL[kandidaten(stand, FRAGEN)[0]], id, thema, modul, schwierigkeit: 1 }) as Frage;
    const alle = [
      bau("X-1", "Duenn", "M77"),
      bau("X-2", "Duenn", "M77"),        // der einzige Nachbar im Feinthema
      bau("X-3", "Dick", "M77"),
      bau("X-4", "Dick", "M77"),
      bau("X-5", "Dick", "M88"),         // fremdes Modul - bleibt draussen
    ];
    const eigen = (id: string) => alle.find((f) => f.id === id);
    const ids = serienKandidaten(stand, alle, eigen, alle[0]);
    expect(ids.sort()).toEqual(["X-2", "X-3", "X-4"]);
  });

  /* ⚠️ DER GRUND FUER DEN MODUL-VERGLEICH, ALS TEST. Poolweit gibt es derzeit
     KEINE Namenskollision (nachgemessen: 0 von 81 Themennamen in mehr als einem
     Modul) — ein Test am echten Bestand koennte die Haertung also gar nicht
     messen. Deshalb hier ausdruecklich eine gebaute Kollision.
     ⛔⛔ DAS FREMDE MODUL DARF NICHT M09 SEIN. In der ersten Fassung stand hier
        M09 — und `kandidaten()` wirft M09 ohnehin raus (`istM09`, auswahl.ts).
        Der Test war gruen, ohne den Modul-Vergleich auch nur zu beruehren:
        **Sabotage 15.09.2026 „Modul-Vergleich weg" blieb GRUEN.** Gemessen wird
        die Haertung erst gegen ein Modul, das die Uebenauswahl DURCHLAESST. */
  it("zieht bei gleichem Themennamen NICHT aus einem fremden Modul", () => {
    const bau = (id: string, modul: string): Frage =>
      ({ ...POOL[kandidaten(stand, FRAGEN)[0]], id, thema: "Gantt", modul, schwierigkeit: 1 }) as Frage;
    const alle = [bau("K-1", "M01"), bau("K-2", "M01"), bau("K-3", "M01"),
                  bau("K-4", "M03"), bau("K-5", "M03")];
    const eigen = (id: string) => alle.find((f) => f.id === id);
    expect(serienKandidaten(stand, alle, eigen, alle[0]).sort()).toEqual(["K-2", "K-3"]);
  });

  it("bietet nichts an, wenn die Frage kein Thema hat", () => {
    const f = { ...ergiebigeFrage(), thema: "" } as Frage;
    expect(serienKandidaten(stand, FRAGEN, nachId, f)).toEqual([]);
  });

  it("bietet nichts an, wenn es ausser der Frage nichts im Modul gibt", () => {
    const einzig = { ...POOL[kandidaten(stand, FRAGEN)[0]], id: "Y-1", modul: "M99" } as Frage;
    expect(serienKandidaten(stand, [einzig], () => einzig, einzig)).toEqual([]);
  });
});

describe("Die Warteschlange selbst", () => {
  it("ist hoechstens so lang wie CONFIG.serie", () => {
    const f = ergiebigeFrage();
    const ids = serienKandidaten(stand, FRAGEN, nachId, f);
    expect(ids.length).toBeGreaterThan(SERIEN_LAENGE);          // sonst misst die Grenze nichts
    expect(starteSerie(ids, zufall(7)).length).toBe(SERIEN_LAENGE);
  });

  it("enthaelt nur Kandidaten, und jede Kennung hoechstens einmal", () => {
    const ids = serienKandidaten(stand, FRAGEN, nachId, ergiebigeFrage());
    const s = starteSerie(ids, zufall(13));
    expect(new Set(s).size).toBe(s.length);
    for (const id of s) expect(ids).toContain(id);
  });

  it("mischt - zwei Saaten geben nicht dieselbe Reihenfolge", () => {
    const ids = serienKandidaten(stand, FRAGEN, nachId, ergiebigeFrage());
    const a = starteSerie(ids, zufall(1));
    const b = starteSerie(ids, zufall(1234567));
    expect(a).not.toEqual(b);
  });

  it("nimmt auch weniger als fuenf, wenn es nicht mehr gibt", () => {
    expect(starteSerie(["A", "B"], zufall(3)).sort()).toEqual(["A", "B"]);
  });
});
