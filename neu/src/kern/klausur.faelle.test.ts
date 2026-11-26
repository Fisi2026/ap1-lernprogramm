/* N43 M3 Rest (17.10.2026): gebaute Faelle fuer `klausur.ts` – kleine Sets aus echten Pool-Kennungen, je Regel ein
   Fall (Formpruefung des Sets, Bestand, Sicht, Rechenaufgaben-Takt, Serie, leere Ziehung, Neumischen). */
import { afterEach, describe, expect, it, vi } from "vitest";

import { FRAGEN } from "@/daten/laden";
import { leererStand, type Lernstand } from "./stand";
import {
  klausurBestand, klausurFortschritt, klausurSicht, klausurVorbei, leseSet, zieheFuerKlausur,
  type KlausurKontext, type KlausurSet,
} from "./klausur";

const POOL = new Map(FRAGEN.map((f) => [f.id, f]));
const nachId = (id: string) => POOL.get(id);
const IDS = FRAGEN.slice(0, 3).map((f) => f.id) as [string, string, string];
const SET: KlausurSet = { name: "t", datum: "d", themen: [{ nr: 1, titel: "eins", generator: null, ids: [...IDS] }] };
const MIT_GEN: KlausurSet = { name: "t", datum: "d", themen: [{ nr: 1, titel: "eins", generator: "subnetting", ids: [...IDS] }] };

function zufall(saat: number): () => number {
  let s = saat >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}
function kontext(teil: Partial<KlausurKontext> = {}): KlausurKontext {
  return { stand: leererStand(), alle: FRAGEN, nachId, letzteThemen: [], serie: [], heute: Date.UTC(2026, 9, 14),
    set: SET, themen: [], rng: zufall(3), ...teil };
}

afterEach(() => { vi.restoreAllMocks(); });

describe("leseSet", () => {
  it("liest ein gueltiges Set vollstaendig und filtert Kennungen, die kein Text sind", () => {
    const s = leseSet({ name: "K", datum: "20.10.", themen: [{ nr: 2, titel: "T", generator: "raid", ids: ["a", 3, "b"] }] });
    expect(s).toEqual({ name: "K", datum: "20.10.", themen: [{ nr: 2, titel: "T", generator: "raid", ids: ["a", "b"] }] });
  });
  it("jedes fehlerhafte Kopffeld macht das Set leer und meldet es", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const leer = { name: "", datum: "", themen: [] };
    expect(leseSet(null)).toEqual(leer);
    expect(leseSet({ name: 1, datum: "d", themen: [] })).toEqual(leer);
    expect(leseSet({ name: "n", datum: 1, themen: [] })).toEqual(leer);
    expect(leseSet({ name: "n", datum: "d", themen: {} })).toEqual(leer);
    expect(err).toHaveBeenCalledTimes(4);
    expect(err).toHaveBeenCalledWith("[Klausur-Set] unbrauchbar");
  });
  it("ein fehlerhaftes Thema wird uebersprungen und gemeldet, die anderen bleiben", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const gut = { nr: 1, titel: "g", generator: null, ids: [] };
    const schlecht = [null, { ...gut, nr: "1" }, { ...gut, titel: 1 }, { ...gut, ids: "x" }, { ...gut, generator: 5 }];
    const s = leseSet({ name: "n", datum: "d", themen: [gut, ...schlecht] });
    expect(s.themen).toEqual([gut]);
    expect(err).toHaveBeenCalledTimes(schlecht.length);
    expect(err).toHaveBeenCalledWith("[Klausur-Set] unbrauchbares Thema", null);
  });
});

describe("klausurBestand und klausurSicht", () => {
  it("zaehlt vorhandene Verweise und nennt die fehlenden", () => {
    const set: KlausurSet = { name: "", datum: "", themen: [{ nr: 4, titel: "v", generator: null, ids: [IDS[0], "GIBTS-NICHT", IDS[1]] }] };
    expect(klausurBestand(set, nachId)).toEqual([{ nr: 4, titel: "v", anzahl: 2, fehlend: ["GIBTS-NICHT"] }]);
  });
  it("die Sicht hebt die Auswahl des Ueben-Bereichs auf und laesst den Rest", () => {
    const s: Lernstand = { ...leererStand(), gebiete: ["A5"], themen: ["x"], uebenAP: "ap1", wirtschaftNur: true, level: 3 };
    const v = klausurSicht(s);
    expect(v).toEqual({ ...s, gebiete: [], themen: [], uebenAP: "beide", wirtschaftNur: false });
  });
});

describe("zieheFuerKlausur – Rechenaufgaben-Takt (K2-E18)", () => {
  const takt = { ...leererStand(), uebenZaehler: 2 };   // naechste Ziehung ist die dritte: % 5 === 3
  it("im Takt mit Generator-Thema: Rechenaufgabe, Deck unberuehrt", () => {
    const s = { ...takt, seen: { [IDS[0]]: true as const } };
    const z = zieheFuerKlausur(kontext({ stand: s, set: MIT_GEN }));
    expect(z.ergebnis.art).toBe("zufall");
    expect(z.serieVerbraucht).toBe(false);
    expect(z.zug).toEqual({ id: null, herkunft: "generator", deckNeu: false, seen: s.seen });
    expect(z.frage).toBeUndefined();
  });
  it("nie waehrend einer Serie und nie zweimal hintereinander", () => {
    expect(zieheFuerKlausur(kontext({ stand: takt, set: MIT_GEN, serie: [IDS[1]] })).ergebnis.art).toBe("pool");
    expect(zieheFuerKlausur(kontext({ stand: { ...takt, lastTyp: "generator" }, set: MIT_GEN })).ergebnis.art).toBe("pool");
  });
  it("ein Generator, den es nicht gibt, faellt auf eine Pool-Frage zurueck", () => {
    const set: KlausurSet = { ...MIT_GEN, themen: [{ ...MIT_GEN.themen[0]!, generator: "gibts-nicht" }] };
    expect(zieheFuerKlausur(kontext({ stand: takt, set })).ergebnis.art).toBe("pool");
    /* „Kann ich schon“ (25.11.2026, BUILD_LOG 278): ausgeblendete Art -> nur noch Pool-Fragen. */
    expect(zieheFuerKlausur(kontext({ stand: takt, set: MIT_GEN })).ergebnis.art).toBe("zufall");
    const aus = { ...takt, gekonnt: { "GEN:subnetting": 1 } };
    expect(zieheFuerKlausur(kontext({ stand: aus, set: MIT_GEN })).ergebnis.art).toBe("pool");
  });
});

describe("zieheFuerKlausur – Pool", () => {
  it("eine Serie wird verbraucht und gemeldet, sonst nicht", () => {
    const mit = zieheFuerKlausur(kontext({ serie: [IDS[1]] }));
    expect(mit.serieVerbraucht).toBe(true);
    expect(mit.ergebnis).toMatchObject({ art: "pool", id: IDS[1], herkunft: "serie" });
    expect(zieheFuerKlausur(kontext()).serieVerbraucht).toBe(false);
  });
  it("keine Frage des Sets im Bestand: leere Ziehung", () => {
    const z = zieheFuerKlausur(kontext({ alle: [] }));
    expect(z).toEqual({ ergebnis: { art: "leer" }, serieVerbraucht: false, zug: null, frage: undefined });
  });
  it("findet nachId die Frage nicht, bleibt das Thema leer statt zu werfen", () => {
    const z = zieheFuerKlausur(kontext({ nachId: () => undefined }));
    expect(z.ergebnis).toMatchObject({ art: "pool", thema: undefined });
    expect(z.frage).toBeUndefined();
  });
  it("gleicher Zufall, gleiche Ziehung (rng wird durchgereicht)", () => {
    const reihe = () => Array.from({ length: 12 }, (_, i) =>
      zieheFuerKlausur(kontext({ set: { ...SET, themen: [{ ...SET.themen[0]!, ids: FRAGEN.slice(0, 60).map((f) => f.id) }] },
        rng: zufall(11 + i) })).zug?.id);
    expect(reihe()).toEqual(reihe());
  });
  it("Set durch: nur die Set-Kennungen werden zurueckgesetzt, fremde bleiben gesehen", () => {
    const fremd = FRAGEN[10]!.id;
    const seen = { [fremd]: true as const, [IDS[0]]: true as const, [IDS[1]]: true as const, [IDS[2]]: true as const };
    const z = zieheFuerKlausur(kontext({ stand: { ...leererStand(), seen } }));
    expect(z.zug?.deckNeu).toBe(true);
    expect(z.zug?.seen[fremd]).toBe(true);
    for (const id of IDS) expect(z.zug?.seen[id], id).toBeUndefined();
  });
});

describe("K3 – Punkte, Ausblenden, Fortschritt, gewichtete Ziehung", () => {
  it("leseSet uebernimmt positive Punkte und laesst fehlende/ungueltige weg", () => {
    const s = leseSet({ name: "K", datum: "2026-11-27", themen: [
      { nr: 1, titel: "a", generator: null, punkte: 21, ids: [] },
      { nr: 2, titel: "b", generator: null, punkte: 0, ids: [] },
      { nr: 3, titel: "c", generator: null, punkte: "6", ids: [] },
    ] });
    expect(s.themen.map((t) => t.punkte)).toEqual([21, undefined, undefined]);
    expect("punkte" in s.themen[1]!).toBe(false);
  });
  it("K3-E41: vorbei ab 0 Uhr des Folgetags (Ortszeit), am Klausurtag noch nicht; unlesbares Datum nie", () => {
    const set: KlausurSet = { name: "", datum: "2026-11-27", themen: [] };
    expect(klausurVorbei(set, new Date(2026, 10, 27, 23, 59).getTime())).toBe(false);
    expect(klausurVorbei(set, new Date(2026, 10, 28, 0, 0).getTime())).toBe(true);
    expect(klausurVorbei(set, new Date(2026, 10, 23, 12, 0).getTime())).toBe(false);
    expect(klausurVorbei({ ...set, datum: "27.11." }, new Date(2030, 0, 1).getTime())).toBe(false);
  });
  it("K3-E40: Fortschritt zaehlt gesehene Fragen ohne offenen Fehler, doppelte Kennung einmal", () => {
    const set: KlausurSet = { name: "", datum: "", themen: [
      { nr: 1, titel: "a", generator: null, ids: [IDS[0], IDS[1], IDS[0]] }, { nr: 2, titel: "b", generator: null, ids: [] },
    ] };
    const stand = { seen: { [IDS[0]]: true, [IDS[1]]: true }, fehlerDeck: { [IDS[1]]: { streak: 0, due: 0 } } };
    expect(klausurFortschritt(set, stand)).toEqual(new Map([[1, 1], [2, 0]]));
  });
  it("K3-E54: im Regelfall zieht das gewichtete Thema; Fehler-Deck bleibt ueber der ganzen Auswahl", () => {
    const set: KlausurSet = { name: "", datum: "", themen: [
      { nr: 1, titel: "a", generator: null, punkte: 1, ids: [IDS[0]] },
      { nr: 2, titel: "b", generator: null, punkte: 1, ids: [IDS[1], IDS[2]] },
    ] };
    /* rng 0 → erstes Thema; 0.99 → zweites */
    expect(zieheFuerKlausur(kontext({ set, rng: () => 0 })).zug?.id).toBe(IDS[0]);
    expect([IDS[1], IDS[2]]).toContain(zieheFuerKlausur(kontext({ set, rng: () => 0.99 })).zug?.id);
    const faellig = { ...leererStand(), uebenZaehler: 4, fehlerDeck: { [IDS[2]]: { streak: 0, due: 0 } } };
    const z = zieheFuerKlausur(kontext({ set, stand: faellig, rng: () => 0 }));
    expect(z.zug).toMatchObject({ id: IDS[2], herkunft: "fehlerdeck" });
  });
  it("K3-E54: ist das gewichtete Thema durch, mischt nur dieses Thema neu", () => {
    const set: KlausurSet = { name: "", datum: "", themen: [
      { nr: 1, titel: "a", generator: null, punkte: 1, ids: [IDS[0]] },
      { nr: 2, titel: "b", generator: null, punkte: 1, ids: [IDS[1], IDS[2]] },
    ] };
    const seen = { [IDS[0]]: true as const, [IDS[1]]: true as const };
    const z = zieheFuerKlausur(kontext({ set, stand: { ...leererStand(), seen }, rng: () => 0 }));
    expect(z.zug?.id).toBe(IDS[0]);
    expect(z.zug?.deckNeu).toBe(true);
    expect(z.zug?.seen[IDS[1]]).toBe(true);
  });
});
