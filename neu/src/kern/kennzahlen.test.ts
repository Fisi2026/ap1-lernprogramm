/* Die Zahlen im Kopf — gegen den Lernstand gerechnet, nicht geschaetzt.

   ⛔ ANLASS: der Kopf zeigte vier erfundene Zahlen. Dieser Test haelt fest, dass
      jede davon jetzt aus dem Stand kommt — und dass "nichts da" als `null`
      durchgereicht wird statt als erfundene Null. */
import { describe, it, expect } from "vitest";
import { leererStand } from "./stand";
import type { Lernstand } from "./stand";
import { kennzahlen, tageBis, bereitschaft } from "./kennzahlen";

const JETZT = Date.UTC(2026, 8, 14, 10, 0, 0);
const TAG = 86400000;

describe("Ein frischer Stand erfindet nichts", () => {
  const k = kennzahlen(leererStand(), JETZT);

  it("zaehlt heute null", () => expect(k.heute).toBe(0));
  it("nimmt das Tagesziel aus dem Stand", () => expect(k.tagesziel).toBe(20));
  it("hat KEINE Trefferquote — null, nicht 0 %", () => expect(k.quote).toBeNull());
  it("hat nichts im Fehler-Deck", () => {
    expect(k.faellig).toBe(0);
    expect(k.imDeck).toBe(0);
  });
  it("kennt KEINEN Pruefungstermin — null, keine erfundenen 412 Tage", () => {
    expect(k.tageBisPruefung).toBeNull();
  });
});

describe("Mit Lernstand stimmen die Zahlen", () => {
  const stand = {
    ...leererStand(),
    statistik: {
      M01: { richtig: 7, gesamt: 10 },
      M08: { richtig: 1, gesamt: 5 },
      M09: { richtig: 99, gesamt: 99 },        // zaehlt NICHT mit
      "T:M01:Netzplan & Puffer": { richtig: 7, gesamt: 10 },
      "GEN:raid": { richtig: 3, gesamt: 3 },   // zaehlt NICHT mit
    },
    dailyCounts: { "2026-09-14": 12, "2026-09-13": 30 },
    fehlerDeck: {
      "M01-001": { streak: 0, due: JETZT - TAG },
      "M02-002": { streak: 1, due: JETZT + TAG },
    },
    pruefungsdatum: "2027-10-01",
  } as Lernstand;
  const k = kennzahlen(stand, JETZT);

  it("zaehlt heute aus dailyCounts", () => expect(k.heute).toBe(12));
  it("rechnet die Quote ueber die acht Module — ohne M09 und ohne GEN", () => {
    expect(k.beantwortet).toBe(15);
    expect(k.quote).toBe(53);                  // 8 von 15
  });
  it("trennt faellig von 'liegt im Deck'", () => {
    expect(k.faellig).toBe(1);
    expect(k.imDeck).toBe(2);
  });
  it("rechnet die Tage bis zur Pruefung", () => {
    expect(k.tageBisPruefung).toBe(382);
  });
});

describe("tageBis", () => {
  it("gibt null ohne Datum", () => {
    expect(tageBis("", JETZT)).toBeNull();
    expect(tageBis(undefined, JETZT)).toBeNull();
    expect(tageBis("kein datum", JETZT)).toBeNull();
  });
  it("zaehlt heute als 0 und morgen als 1", () => {
    expect(tageBis("2026-09-14", JETZT)).toBe(0);
    expect(tageBis("2026-09-15", JETZT)).toBe(1);
  });
  it("wird negativ, wenn der Termin vorbei ist", () => {
    expect(tageBis("2026-09-01", JETZT)).toBe(-13);
  });
});

describe("Die Bereitschaft kommt aus logik.js", () => {
  it("ist leer, solange nichts beantwortet ist", () => {
    const b = bereitschaft(leererStand());
    expect(b.gebiete).toEqual([]);
    expect(b.gesamt.score).toBeNull();
  });

  it("rechnet je Gebiet und traegt eine Ampel", () => {
    const stand = {
      ...leererStand(),
      statistik: {
        "T:M01:Netzplan & Puffer": { richtig: 9, gesamt: 10 },
        "T:M03:RAID": { richtig: 2, gesamt: 10 },
      },
    } as Lernstand;
    const b = bereitschaft(stand);
    expect(b.gebiete.length).toBeGreaterThan(0);
    for (const g of b.gebiete) {
      expect(g.score).not.toBeNull();
      expect(typeof g.ampel).toBe("string");
      expect(g.antworten).toBeGreaterThan(0);
    }
    expect(b.gesamt.score).not.toBeNull();
  });

  /* ⛔ Nutzer-Entscheid 20.07.2026: die Klausurvorbereitung zaehlt NIE in die
     AP1-Bereitschaft. Steht in logik.js; hier wird es festgehalten. */
  it("laesst M09 aussen vor", () => {
    const nurM09 = {
      ...leererStand(),
      statistik: { "T:M09:Klausurvorbereitung 1": { richtig: 10, gesamt: 10 } },
    } as Lernstand;
    expect(bereitschaft(nurM09).gebiete).toEqual([]);
    expect(bereitschaft(nurM09).gesamt.score).toBeNull();
  });
});
