/* ============================================================================
   DIE PRUEFUNGSSIMULATION — DER KERN

   ⛔ Gerechnet wird in `kern/pruefung.ts` (seit N34 T4, vorher logik.js), auch der Pruefungsbau.
      Hier wird gemessen, dass der Neubau ihn WIRKLICH benutzt und richtig
      einspannt — nicht, dass er ihn nachbaut.
   ============================================================================ */
import { CONFIG } from "./tabellen/konfig.ts";
import { AP1_AUFGABEN as AP1_TABELLE, M04_NETZ } from "./tabellen/pruefung.ts";
import { fallFuerSim } from "./pruefung.ts";
import { describe, it, expect } from "vitest";
import { FRAGEN } from "@/daten/laden";
import { FAELLE } from "@/daten/faelle";
import { leererStand } from "./stand";
import type { Lernstand } from "./stand";
import {
  AP1_AUFGABEN, aufgabeVon, simBewertbar, punkteVerteilung, bauePruefung,
  vorschlagMinuten, bewerte, ergebnis, jeAufgabe, verbucheSimulation, istFallTeil, istSimKarte,
} from "./simulation";

const stand = leererStand() as Lernstand;
const PUNKTE = AP1_AUFGABEN.map((a) => a.punkte);
const JETZT = Date.UTC(2026, 8, 16, 12, 0, 0);

describe("Die vier Aufgaben und die Zuordnung", () => {
  it("kommen aus kern/tabellen/pruefung.ts, nicht aus einer eigenen Liste", () => {
    expect(AP1_AUFGABEN).toBe(AP1_TABELLE);
    expect(AP1_AUFGABEN.length).toBe(4);
    expect(AP1_AUFGABEN.reduce((s, a) => s + a.punkte, 0)).toBe(100);
  });

  it("ordnet jedes Modul einer der vier Aufgaben zu", () => {
    for (const f of FRAGEN) {
      const bi = aufgabeVon(f);
      expect(bi, f.id).toBeGreaterThanOrEqual(0);
      expect(bi, f.id).toBeLessThan(4);
    }
  });

  it("trennt M04 nach Fein-Thema in Netz und Software", () => {
    const netz = M04_NETZ;
    const m04 = FRAGEN.filter((f) => f.modul === "M04");
    expect(m04.length).toBeGreaterThan(10);
    for (const f of m04) {
      expect(aufgabeVon(f), f.id + " / " + f.thema).toBe(netz.indexOf(f.thema) >= 0 ? 2 : 1);
    }
  });
});

describe("Der Pruefungsbau", () => {
  it("zieht ungefaehr die gewuenschte Zahl und verteilt sie auf alle vier Aufgaben", () => {
    const p = bauePruefung(stand, 40, PUNKTE, FRAGEN, FAELLE);
    expect(p.fragen.length).toBeGreaterThan(30);
    expect(p.fragen.length).toBeLessThanOrEqual(48);
    const je = [0, 0, 0, 0];
    for (const f of p.fragen) je[aufgabeVon(f)]++;
    for (let i = 0; i < 4; i++) expect(je[i], "Aufgabe " + (i + 1)).toBeGreaterThan(0);
  });

  /* ⛔ M08 (WiSo) ist nicht Teil der AP1 — davon liegen 103 Fragen im Bestand,
     69 davon automatisch bewertbar. Der Filter ist also am echten Bestand messbar. */
  it("laesst M08 draussen und nimmt nur automatisch Bewertbares", () => {
    const p = bauePruefung(stand, 40, PUNKTE, FRAGEN, FAELLE);
    for (const f of p.fragen) {
      expect(f.modul, f.id).not.toBe("M08");
      expect(simBewertbar(f), f.id + " / " + f.typ).toBe(true);
    }
  });

  /* ⛔⛔ DER M09-FILTER IST AM ECHTEN BESTAND NICHT MESSBAR: `pool/pool_m*.json`
     enthaelt **null** M09-Fragen (nachgemessen 16.09.2026 — der Unterrichts-Pool
     wird anderswo gefuehrt). Die Sabotage, die den Filter entfernt, blieb
     deshalb gruen, und ein Test ueber die gezogenen Fragen haette nie etwas
     gesagt. ►► Gemessen wird an einem GEBAUTEN Bestand, und der Test sagt
     ausdruecklich, dass der Bestand den Fall nicht erreicht. */
  it("laesst den Unterrichts-Pool M09 draussen — auch wenn er im Bestand laege", () => {
    expect(FRAGEN.filter((f) => f.modul === "M09").length).toBe(0);
    const echte = FRAGEN.filter((f) => simBewertbar(f) && f.modul !== "M08").slice(0, 60);
    const getarnt = echte.slice(0, 20).map((f, i) => Object.assign({}, f, { id: "M09-x" + i, modul: "M09" }));
    const p = bauePruefung(stand, 40, PUNKTE, [...echte, ...getarnt], FAELLE);
    expect(p.fragen.length).toBeGreaterThan(0);
    expect(p.fragen.some((f) => f.modul === "M09")).toBe(false);
  });

  it("schreibt das Wiederholungs-Gedaechtnis fort", () => {
    const eins = bauePruefung(stand, 40, PUNKTE, FRAGEN, FAELLE);
    expect(eins.benutzt.length).toBeGreaterThanOrEqual(eins.fragen.length);
    const danach = { ...stand, simUsedIds: eins.benutzt } as Lernstand;
    const zwei = bauePruefung(danach, 40, PUNKTE, FRAGEN, FAELLE);
    /* Die zweite Pruefung meidet die Kennungen der ersten, solange der Bestand reicht. */
    const wieder = zwei.fragen.filter((f) => eins.benutzt.indexOf(f.id) >= 0);
    expect(wieder.length).toBeLessThan(zwei.fragen.length / 2);
  });

  it("nimmt eine Fallaufgabe geschlossen mit — samt Szenario", () => {
    expect(FAELLE.length).toBeGreaterThan(0);
    let gefunden = false;
    for (let i = 0; i < 10 && !gefunden; i++) {
      const p = bauePruefung(stand, 40, PUNKTE, FRAGEN, FAELLE);
      const teile = p.fragen.filter((f) => typeof f.fallSzenario === "string");
      if (teile.length) {
        gefunden = true;
        for (const t of teile) {
          expect(typeof t.fallTitel).toBe("string");
          expect(t.id).toContain("-t");
        }
      }
    }
    expect(gefunden, "in 10 Anlaeufen kam keine Fallaufgabe").toBe(true);
  });

  it("wuerfelt — zwei Pruefungen sind nicht dieselbe Folge", () => {
    const a = bauePruefung(stand, 40, PUNKTE, FRAGEN, FAELLE).fragen.map((f) => f.id).join(",");
    const b = bauePruefung(stand, 40, PUNKTE, FRAGEN, FAELLE).fragen.map((f) => f.id).join(",");
    expect(a).not.toBe(b);
  });

  it("schlaegt eine Dauer vor, die mit der Fragenzahl waechst", () => {
    const p = bauePruefung(stand, 40, PUNKTE, FRAGEN, FAELLE);
    const wenig = vorschlagMinuten(p.fragen.slice(0, 5));
    const viel = vorschlagMinuten(p.fragen);
    expect(wenig).toBeGreaterThan(0);
    expect(viel).toBeGreaterThan(wenig);
  });
});

describe("Die Punkteverteilung", () => {
  it("summiert sich auf 100 und bleibt in den Grenzen", () => {
    for (let i = 0; i < 20; i++) {
      const p = punkteVerteilung();
      expect(p.length).toBe(4);
      expect(p.reduce((s, x) => s + x, 0)).toBe(CONFIG.ap1PunkteSumme);
      for (const x of p) {
        expect(x).toBeGreaterThanOrEqual(CONFIG.ap1PunkteMin);
        expect(x).toBeLessThanOrEqual(CONFIG.ap1PunkteMax);
      }
    }
  });
});

describe("Die Auswertung", () => {
  const fragen = bauePruefung(stand, 40, PUNKTE, FRAGEN, FAELLE).fragen;

  it("zaehlt eine unbeantwortete Pruefung als null Punkte", () => {
    const korrekt = bewerte(fragen, {});
    expect(korrekt.length).toBe(fragen.length);
    expect(korrekt.some(Boolean)).toBe(false);
    const e = ergebnis(fragen, korrekt);
    expect(e.punkte).toBe(0);
    expect(e.prozent).toBe(0);
    expect(e.note.bestanden).toBe(false);
  });

  it("gibt bei durchweg richtigen Antworten die beste Note", () => {
    const e = ergebnis(fragen, fragen.map(() => true));
    expect(e.punkte).toBe(fragen.length);
    expect(e.prozent).toBe(100);
    expect(e.note.bestanden).toBe(true);
  });

  it("rechnet je Aufgabe Punkte anteilig aus den Treffern", () => {
    const korrekt = fragen.map(() => true);
    const je = jeAufgabe(fragen, korrekt, PUNKTE);
    expect(je.length).toBeGreaterThan(0);
    for (const a of je) {
      expect(a.richtig).toBe(a.gesamt);
      expect(a.quote).toBe(100);
      expect(a.punkte).toBe(a.maxPunkte);
    }
    expect(je.reduce((s, a) => s + a.gesamt, 0)).toBe(fragen.length);
  });

  /* ⛔⛔ MIT LAUTER RICHTIGEN ANTWORTEN IST "ANTEILIG" NICHT MESSBAR: dort ist der
     Anteil 1, und die Sabotage `punkte: maxPunkte` blieb gruen. Gemessen wird
     deshalb ein TEILWEISE richtiger Durchgang. */
  it("gibt bei halb richtiger Aufgabe auch ungefaehr die halben Punkte", () => {
    const erste = fragen.filter((f) => aufgabeVon(f) === 0);
    expect(erste.length).toBeGreaterThan(1);
    const korrekt = erste.map((_, i) => i === 0);        // genau EINE richtig
    const je = jeAufgabe(erste, korrekt, PUNKTE);
    expect(je.length).toBe(1);
    expect(je[0].richtig).toBe(1);
    expect(je[0].punkte).toBe(Math.round((je[0].maxPunkte * 1) / erste.length));
    expect(je[0].punkte).toBeLessThan(je[0].maxPunkte);
  });

  it("laesst eine Aufgabe ohne Fragen weg, statt 0 von 0 zu zeigen", () => {
    const nurEine = fragen.filter((f) => aufgabeVon(f) === 0);
    expect(nurEine.length).toBeGreaterThan(0);
    const je = jeAufgabe(nurEine, nurEine.map(() => true), PUNKTE);
    expect(je.length).toBe(1);
    expect(je[0].aufgabe.nr).toBe(1);
  });
});

describe("Das Verbuchen am Ende", () => {
  const fragen = bauePruefung(stand, 40, PUNKTE, FRAGEN, FAELLE).fragen;

  it("legt jede falsch beantwortete Frage ins Fehler-Deck — und nur die", () => {
    const korrekt = fragen.map((_, i) => i % 2 === 0);
    const e = ergebnis(fragen, korrekt);
    const s = verbucheSimulation(stand, fragen, korrekt, e, 600, JETZT);
    const deck = Object.keys(s.fehlerDeck as object);
    const falsche = fragen
      .filter((f, i) => !korrekt[i] && !istFallTeil(f))
      .map((f) => f.id);
    expect(deck.sort()).toEqual([...new Set(falsche)].sort());
  });

  /* ⛔⛔ GEFUNDEN IM RAUCHTEST AM 16.09.2026, nicht von einem Test: nach einer
     Simulation lagen fuenf Kennungen im Fehler-Deck, zu denen es keine Frage gibt
     — die Teilaufgaben der Fallaufgabe. Sie entstehen erst beim Bauen der
     Pruefung, die Ziehung findet sie nie wieder, und sie blieben als
     unaufloesbare Eintraege liegen. **Ein Eintrag, der nie faellig werden kann,
     ist kein Wiedersehen, sondern totes Gewicht.** */
  it("laesst die Teilaufgaben einer Fallaufgabe draussen — sie kaemen nie wieder", () => {
    /* Erst nachsehen, ob der Fall im Bestand ueberhaupt vorkommt — sonst misst
       dieser Test nichts (und sagt es). */
    let mitFall = fragen;
    for (let i = 0; i < 10 && !mitFall.some(istFallTeil); i++) {
      mitFall = bauePruefung(stand, 40, PUNKTE, FRAGEN, FAELLE).fragen;
    }
    const teile = mitFall.filter(istFallTeil);
    expect(teile.length, "in 10 Anlaeufen kam keine Fallaufgabe").toBeGreaterThan(0);

    const korrekt = mitFall.map(() => false);
    const s = verbucheSimulation(stand, mitFall, korrekt, ergebnis(mitFall, korrekt), 60, JETZT);
    const deck = Object.keys(s.fehlerDeck as object);
    for (const t of teile) expect(deck, t.id).not.toContain(t.id);
    /* Die echten Fragen liegen sehr wohl drin. */
    expect(deck.length).toBe(mitFall.length - teile.length);
  });

  it("schreibt genau einen Eintrag in die Historie", () => {
    const korrekt = fragen.map(() => true);
    const e = ergebnis(fragen, korrekt);
    const s = verbucheSimulation(stand, fragen, korrekt, e, 1234, JETZT);
    const h = s.simHistorie;
    expect(h.length).toBe(1);
    expect(h[0].prozent).toBe(100);
    expect(h[0].zeitSek).toBe(1234);
    expect(h[0].gesamt).toBe(fragen.length);
  });

  /* ⛔ KEIN Tageszaehler und KEINE Modul-Statistik — eine Simulation ist eine
     Pruefung, kein Uebungsdurchgang. So macht es `simAbgeben`. */
  it("ruehrt Tageszaehler und Modul-Statistik nicht an", () => {
    const korrekt = fragen.map(() => false);
    const e = ergebnis(fragen, korrekt);
    const s = verbucheSimulation(stand, fragen, korrekt, e, 60, JETZT);
    expect(Object.keys(s.dailyCounts as object)).toEqual([]);
    expect(Object.keys(s.statistik as object)).toEqual([]);
  });

  it("laesst den Ausgangsstand unveraendert", () => {
    const vorher = JSON.stringify(stand);
    const korrekt = fragen.map(() => false);
    verbucheSimulation(stand, fragen, korrekt, ergebnis(fragen, korrekt), 60, JETZT);
    expect(JSON.stringify(stand)).toBe(vorher);
  });
});

/* N38 (30.09.2026): die Grenze `istSimKarte` – die Teilaufgaben der Faelle sind keine `Frage`
   (kein `gebiet`), aber jede muss als Karte taugen. Bekannte Antwort: 9 Faelle, 45 Teile, alle bestehen. */
describe("istSimKarte", () => {
  const teile = FAELLE.flatMap((f) => fallFuerSim([f], {})?.teile.map((t) => ({ t })) ?? []);
  it("alle Teilaufgaben aller Faelle bestehen (und keine traegt ein gebiet)", () => {
    expect(FAELLE.length).toBe(9);
    expect(teile.length).toBe(45);
    expect(teile.filter(({ t }) => !istSimKarte(t)).map(({ t }) => t.id)).toEqual([]);
    expect(teile.filter(({ t }) => "gebiet" in t)).toEqual([]);
  });
  it("lehnt ab, was keine Karte ist", () => {
    const leise = console.error;
    console.error = () => {};
    try {
      expect(istSimKarte({ id: "x", frage: "f", thema: "t", typ: "gibtsnicht" })).toBe(false);
      expect(istSimKarte({ id: "x", thema: "t", typ: "mc" })).toBe(false);
      expect(istSimKarte({ id: "x", frage: "f", thema: "t", typ: "mc" })).toBe(true);
    } finally { console.error = leise; }
  });
});
