/* ============================================================================
   DIE ZIEHUNG — GEMESSENES VERHALTEN, KEIN GLEICHHEITSBEWEIS

   ⚠️ DAS IST DER UNTERSCHIED ZU `auswahl.gleichheit.test.ts` UND
      `verbuchen.gleichheit.test.ts`, UND ER GEHOERT AUSGESPROCHEN:
      `naechsteFrage()` in app_seiten.js laesst sich NICHT ausfuehren, ohne die
      halbe alte Oberflaeche nachzubauen (`qa.innerHTML`, `uebenRender`,
      `uebenVerlauf`, `themenSerie`). Ein Vergleich gegen einen Nachbau beweist
      den Nachbau, nicht die Sache.
   ►► Deshalb wird hier das VERHALTEN gemessen: der Rhythmus ueber lange Folgen,
      die Vorrang-Reihenfolge, die Sperren und die Buchfuehrung. Wer diesen Test
      fuer einen Gleichheitsbeweis haelt, ueberschaetzt ihn.

   ⛔ Die Zahlen, gegen die gemessen wird, stammen aus der alten App:
      APP_CONFIG.fdEinstreuung = 5, APP_CONFIG.generatorEinstreuung = 4,
      und der Zaehler wird VOR der Pruefung hochgezaehlt.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import { FRAGEN } from "@/daten/laden";
import { leererStand } from "./stand";
import type { Lernstand } from "./stand";
import { ziehe, nachDemZiehen, EINSTREUUNG, anzahlBeantwortet, gewichtsKontext, faelligeAusDeck } from "./ziehen";
import { uebenPasst, typVon, kandidaten } from "./auswahl";

const POOL: Record<string, (typeof FRAGEN)[number]> = {};
for (const f of FRAGEN) POOL[f.id] = f;
const nachId = (id: string) => POOL[id];

const TAG = 24 * 60 * 60 * 1000;
const JETZT = Date.UTC(2026, 8, 14, 8, 0, 0);

function zufall(saat: number): () => number {
  let s = saat >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

function kontext(stand: Lernstand, extra: Partial<Parameters<typeof ziehe>[0]> = {}) {
  return {
    stand, alle: FRAGEN, nachId, letzteThemen: [], serie: [],
    heute: JETZT, rng: zufall(99), generatorMoeglich: false,
    ...extra,
  };
}

const passt = (stand: Lernstand) => (f: (typeof FRAGEN)[number]) => uebenPasst(stand, f);

describe("Die Vorrang-Reihenfolge", () => {
  it("eine laufende Themen-Serie schlaegt alles andere", () => {
    const stand = { ...leererStand(), uebenZaehler: 4 } as Lernstand;   // waere FD-Takt
    const z = ziehe(kontext(stand, { serie: ["M01-001", "M01-002"] }), passt(stand));
    expect(z.herkunft).toBe("serie");
    expect(z.id).toBe("M01-001");
  });

  it("das Fehler-Deck kommt bei jeder fuenften — und nur, wenn etwas faellig ist", () => {
    const mitDeck = {
      ...leererStand(),
      fehlerDeck: { "M01-001": { streak: 0, due: JETZT - TAG } },
    } as Lernstand;

    const takt: number[] = [];
    for (let z = 0; z < 40; z++) {
      const stand = { ...mitDeck, uebenZaehler: z } as Lernstand;
      if (ziehe(kontext(stand), passt(stand)).herkunft === "fehlerdeck") takt.push(z);
    }
    /* Der Zaehler wird VOR der Pruefung hochgezaehlt: getroffen wird z+1 % 5 === 0. */
    expect(takt).toEqual([4, 9, 14, 19, 24, 29, 34, 39]);
    expect(takt.length).toBe(40 / EINSTREUUNG.fehlerDeck);
  });

  it("ohne faellige Frage greift der Fehler-Deck-Zweig nicht", () => {
    const stand = { ...leererStand(), uebenZaehler: 4 } as Lernstand;
    expect(ziehe(kontext(stand), passt(stand)).herkunft).toBe("deck");
  });

  it("eine noch nicht faellige Frage zaehlt nicht als faellig", () => {
    const stand = {
      ...leererStand(), uebenZaehler: 4,
      fehlerDeck: { "M01-001": { streak: 0, due: JETZT + TAG } },
    } as Lernstand;
    expect(faelligeAusDeck(kontext(stand), passt(stand))).toEqual([]);
    expect(ziehe(kontext(stand), passt(stand)).herkunft).toBe("deck");
  });

  it("eine Frage aus den letzten zehn wird uebersprungen", () => {
    const basis = {
      ...leererStand(), uebenZaehler: 4,
      fehlerDeck: { "M01-001": { streak: 0, due: JETZT - TAG } },
    } as Lernstand;
    expect(faelligeAusDeck(kontext(basis), passt(basis))).toEqual(["M01-001"]);

    const gesperrt = { ...basis, lastShown: ["M01-001"] } as Lernstand;
    expect(faelligeAusDeck(kontext(gesperrt), passt(gesperrt))).toEqual([]);

    /* elf Fragen her ist nicht mehr gesperrt.
       ⚠️ Die Fuellfragen muessen ANDERE sein — `FRAGEN.slice(0, 10)` faengt
          selbst mit M01-001 an, und der erste Anlauf dieses Tests hat sich
          genau daran selbst widerlegt. */
    const langeHer = {
      ...basis,
      lastShown: ["M01-001", ...FRAGEN.filter((f) => f.id !== "M01-001").slice(0, 10).map((f) => f.id)],
    } as Lernstand;
    expect(faelligeAusDeck(kontext(langeHer), passt(langeHer))).toEqual(["M01-001"]);
  });

  it("der Generator kommt bei jeder vierten (Rest 2) und nie zweimal hintereinander", () => {
    const takt: number[] = [];
    for (let z = 0; z < 40; z++) {
      const stand = { ...leererStand(), uebenZaehler: z } as Lernstand;
      const g = ziehe(kontext(stand, { generatorMoeglich: true }), passt(stand));
      if (g.herkunft === "generator") takt.push(z);
    }
    expect(takt).toEqual([1, 5, 9, 13, 17, 21, 25, 29, 33, 37]);

    const direktDanach = { ...leererStand(), uebenZaehler: 1, lastTyp: "generator" } as Lernstand;
    expect(ziehe(kontext(direktDanach, { generatorMoeglich: true }), passt(direktDanach)).herkunft).toBe("deck");
  });

  it("solange die Oberflaeche keine Generator-Aufgabe zeichnet, wird der Zweig uebersprungen", () => {
    const stand = { ...leererStand(), uebenZaehler: 1 } as Lernstand;
    expect(ziehe(kontext(stand), passt(stand)).herkunft).toBe("deck");
  });

  /* ⛔⛔ GEMESSEN, NACHDEM DIESER TEST MEINE EIGENE ANNAHME WIDERLEGT HAT:
     Ich hatte behauptet, die beiden Takte ueberschnitten sich NIE. Sie tun es —
     bei jedem 20. Zaehlerstand (10, 30, 50, 70, 90 …), weil 5 und 4 zusammen
     eine Periode von 20 haben. Dort greift die Kaskade zuerst beim Fehler-Deck,
     der Generator faellt aus. **Das ist Verhalten der ALTEN App, kein Fehler —
     aber es gehoert gewusst:** von 10 Generator-Takten je 40 Fragen fallen 2 aus,
     sobald ueberhaupt etwas faellig ist. */
  it("die beiden Takte ueberschneiden sich bei jedem 20. — dort gewinnt das Fehler-Deck", () => {
    const fd: number[] = [], gen: number[] = [];
    for (let z = 1; z <= 100; z++) {
      if (z % EINSTREUUNG.fehlerDeck === 0) fd.push(z);
      if (z % EINSTREUUNG.generator === 2) gen.push(z);
    }
    expect(fd.filter((z) => gen.includes(z))).toEqual([10, 30, 50, 70, 90]);

    /* und in der Kaskade gewinnt dort wirklich das Fehler-Deck */
    const stand = {
      ...leererStand(), uebenZaehler: 9,   // +1 = 10
      fehlerDeck: { "M01-001": { streak: 0, due: JETZT - TAG } },
    } as Lernstand;
    expect(ziehe(kontext(stand, { generatorMoeglich: true }), passt(stand)).herkunft).toBe("fehlerdeck");
  });
});

describe("Der Regelfall zieht aus dem Deck", () => {
  it("liefert eine Frage, die es gibt und die zur Auswahl passt", () => {
    const stand = leererStand();
    const z = ziehe(kontext(stand), passt(stand));
    expect(z.herkunft).toBe("deck");
    expect(z.id).toBeTruthy();
    expect(nachId(z.id!)).toBeDefined();
    expect(uebenPasst(stand, nachId(z.id!))).toBe(true);
  });

  it("bringt ueber eine lange Folge JEDE Frage einmal, bevor eine wiederholt wird", () => {
    /* Das ist die Kernzusage von L.deckPick — und der Nutzer-Befund vom
       30.07.2026 ("ich habe jetzt schon Wiederholungen"). */
    let stand = { ...leererStand(), themen: ["M01|Projektmerkmale & Meilensteine"] } as Lernstand;
    /* ⛔ GEMESSEN, NACHDEM DIESER TEST ZUERST FIEL: das Thema hat 9 Fragen, der
       Lerner sieht auf Stufe 1 aber nur die drei Stufe-1-Fragen — `kandidaten`
       filtert VOR der Ziehung auf die Themenstufe. Die Zusage von L.deckPick gilt
       fuer die KANDIDATEN, nicht fuer das Thema. Wer hier gegen die Themengroesse
       prueft, prueft den Stufenfilter mit und versteht den Fehlschlag falsch. */
    const imThema = FRAGEN.filter((f) => f.modul === "M01" && f.thema === "Projektmerkmale & Meilensteine");
    const auswahl = kandidaten(stand, FRAGEN);
    expect(imThema.length, "das Thema muss es geben").toBeGreaterThan(3);
    expect(auswahl.length, "auf der Stufe muss mehr als eine Frage liegen").toBeGreaterThan(1);
    expect(auswahl.length).toBeLessThan(imThema.length);

    const gezogen: string[] = [];
    const r = zufall(7);
    for (let i = 0; i < auswahl.length; i++) {
      const z = ziehe(kontext(stand, { rng: r }), passt(stand));
      expect(z.id).toBeTruthy();
      gezogen.push(z.id!);
      stand = nachDemZiehen(stand, z, nachId(z.id!));
    }
    expect(new Set(gezogen).size, `Wiederholung in ${gezogen.join(",")}`).toBe(auswahl.length);
  });

  it("mischt neu, wenn das Deck leer ist", () => {
    let stand = { ...leererStand(), themen: ["M01|Projektmerkmale & Meilensteine"] } as Lernstand;
    const anzahl = kandidaten(stand, FRAGEN).length;
    const r = zufall(11);
    let neuGemischt = 0;
    for (let i = 0; i < anzahl * 2 + 2; i++) {
      const z = ziehe(kontext(stand, { rng: r }), passt(stand));
      if (z.deckNeu) neuGemischt++;
      stand = nachDemZiehen(stand, z, nachId(z.id!));
    }
    expect(neuGemischt).toBeGreaterThan(0);
  });
});

describe("Die Buchfuehrung nach dem Ziehen", () => {
  it("zaehlt hoch, merkt die Frage und den Typ", () => {
    const stand = leererStand();
    const z = ziehe(kontext(stand), passt(stand));
    const neu = nachDemZiehen(stand, z, nachId(z.id!));
    expect(neu.uebenZaehler).toBe(1);
    expect((neu.lastShown as string[]).at(-1)).toBe(z.id);
    expect(neu.seen).toHaveProperty(z.id!);
    expect(neu.lastTyp).toBe(typVon(nachId(z.id!)));
  });

  it("haelt lastShown bei 50", () => {
    let stand = leererStand();
    const r = zufall(3);
    for (let i = 0; i < 60; i++) {
      const z = ziehe(kontext(stand, { rng: r }), passt(stand));
      stand = nachDemZiehen(stand, z, nachId(z.id!));
    }
    expect((stand.lastShown as string[]).length).toBe(50);
    expect(stand.uebenZaehler).toBe(60);
  });

  it("merkt sich `generator` als Typ, damit er nicht zweimal kommt", () => {
    const stand = { ...leererStand(), uebenZaehler: 1 } as Lernstand;
    const z = ziehe(kontext(stand, { generatorMoeglich: true }), passt(stand));
    expect(z.herkunft).toBe("generator");
    expect(nachDemZiehen(stand, z, undefined).lastTyp).toBe("generator");
  });
});

describe("Der Gewichtungs-Kontext", () => {
  it("zaehlt ueber die acht Module — M09 zaehlt NICHT auf das Gate ein", () => {
    const stand = {
      ...leererStand(),
      statistik: {
        M01: { richtig: 5, gesamt: 10 },
        M08: { richtig: 1, gesamt: 5 },
        M09: { richtig: 9, gesamt: 99 },
      },
    } as Lernstand;
    expect(anzahlBeantwortet(stand)).toBe(15);
  });

  it("schaltet die Schwaechen-Gewichtung erst OBERHALB des Gates ein", () => {
    const gate = 30;   // CONFIG.gate
    const knapp = { ...leererStand(), statistik: { M01: { richtig: 0, gesamt: gate } } } as Lernstand;
    const drueber = { ...leererStand(), statistik: { M01: { richtig: 0, gesamt: gate + 1 } } } as Lernstand;
    expect(gewichtsKontext(knapp, []).adaptivAktiv).toBe(false);
    expect(gewichtsKontext(drueber, []).adaptivAktiv).toBe(true);
  });

  it("reicht die Themen-Statistik unter dem richtigen Schluessel durch", () => {
    const stand = {
      ...leererStand(),
      statistik: { "T:M01:Netzplan & Puffer": { richtig: 2, gesamt: 8 } },
    } as Lernstand;
    const ctx = gewichtsKontext(stand, []);
    expect(ctx.themaStat({ modul: "M01", thema: "Netzplan & Puffer" } as never)).toEqual({
      richtig: 2, gesamt: 8,
    });
    expect(ctx.themaStat({ modul: "M01", thema: "gibt es nicht" } as never)).toBeNull();
  });

  it("gibt die letzten Themen weiter — daran haengt der Interleaving-Malus", () => {
    expect(gewichtsKontext(leererStand(), ["Netzplan & Puffer"]).letzteThemen).toEqual([
      "Netzplan & Puffer",
    ]);
  });
});
