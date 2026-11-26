/* ============================================================================
   DAS NETZPLAN-TRAINING — DIE REGELN

   ⛔ Gerechnet wird in logik.js. Hier wird gemessen, was DIESE Datei tut:
      pruefen (fuenf Felder je Vorgang), verbuchen, und die Knoten anordnen.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import { dayKey } from "./lernen";
import { leererStand } from "./stand";
import type { Lernstand } from "./stand";
import {
  neueAufgabe, pruefe, istRichtig, normZahl, verbucheNetzplan, anordnung, kanten,
  FELDER, BESTEHENSGRENZE,
} from "./netzplan";
import type { NetzplanDaten, NetzplanVorgang, Eingaben } from "./netzplan";

const JETZT = Date.UTC(2026, 8, 16, 11, 0, 0);
const TAG = dayKey(JETZT);

function alleRichtig(daten: NetzplanDaten): Eingaben {
  const e: Eingaben = {};
  for (const v of daten.vorgaenge) {
    e[v.id] = {};
    for (const f of FELDER) e[v.id][f] = String(v[f]);
  }
  return e;
}

describe("Die Aufgabe kommt aus logik.js", () => {
  it("bringt Szenario, Vorgaenge, Projektdauer, kritischen Pfad und Loesungsweg mit", () => {
    const a = neueAufgabe();
    expect(a.szenario.titel.length).toBeGreaterThan(0);
    expect(a.daten.vorgaenge.length).toBeGreaterThan(3);
    expect(a.daten.projektdauer).toBeGreaterThan(0);
    expect(a.daten.kritisch.length).toBeGreaterThan(0);
    expect(a.weg.length).toBeGreaterThan(5);
  });

  it("die Termine haengen zusammen: FEZ = FAZ + Dauer, GP = SAZ - FAZ", () => {
    const d = neueAufgabe().daten;
    for (const v of d.vorgaenge) {
      expect(v.fez, v.id).toBe(v.faz + v.dauer);
      expect(v.gp, v.id).toBe(v.saz - v.faz);
      expect(v.sez, v.id).toBe(v.saz + v.dauer);
    }
  });

  it("der kritische Pfad ist genau die Menge mit GP 0", () => {
    const d = neueAufgabe().daten;
    expect(d.kritisch.slice().sort()).toEqual(
      d.vorgaenge.filter((v) => v.gp === 0).map((v) => v.id).sort(),
    );
  });

  /* ⛔ ANDERE ZAEHLUNG ALS BEIM GANTT: dort ist Tag 1 der Projektstart, hier
     beginnt der erste Vorgang bei FAZ 0. Das steht so in logik.js und wird
     hier NICHT angeglichen. */
  it("faengt bei 0 an, nicht bei 1", () => {
    const d = neueAufgabe().daten;
    const anfang = d.vorgaenge.filter((v) => v.vorgaenger.length === 0);
    expect(anfang.length).toBeGreaterThan(0);
    for (const v of anfang) expect(v.faz).toBe(0);
  });
});

describe("Das Pruefen", () => {
  it("zaehlt fuenf Felder je Vorgang — Dauer und FP werden nicht abgefragt", () => {
    expect(FELDER).toEqual(["faz", "fez", "saz", "sez", "gp"]);
    const d = neueAufgabe().daten;
    expect(pruefe(d, {}).gesamt).toBe(d.vorgaenge.length * 5);
  });

  it("gibt bei vollstaendig richtiger Rechnung 100 Prozent", () => {
    const d = neueAufgabe().daten;
    const r = pruefe(d, alleRichtig(d));
    expect(r.richtig).toBe(r.gesamt);
    expect(r.quote).toBe(100);
    expect(r.alleOk).toBe(true);
  });

  /* ⛔ DIESE NORMALISIERUNG IST EINE ANDERE ALS BEIM GANTT: hier faellt ein
     angehaengtes ",0" weg, dort nicht. Nachgemessen an beiden Schirmen der
     alten App — nicht angeglichen, weil das eine Verhaltensaenderung waere. */
  it("nimmt Komma, Leerzeichen und ein angehaengtes ,0 hin", () => {
    expect(normZahl(" 4 ")).toBe("4");
    expect(normZahl("4,0")).toBe("4");
    expect(normZahl("4.00")).toBe("4");
    expect(normZahl("4,5")).toBe("4.5");
    expect(normZahl("vier")).toBe("vier");
  });

  it("vergleicht Feld fuer Feld, nicht querbeet", () => {
    const v = { id: "A", name: "n", dauer: 2, vorgaenger: [], nachfolger: [],
                faz: 0, fez: 2, saz: 3, sez: 5, gp: 3, fp: 0 } as NetzplanVorgang;
    expect(istRichtig(v, "faz", "0")).toBe(true);
    expect(istRichtig(v, "fez", "0")).toBe(false);
    expect(istRichtig(v, "gp", "3")).toBe(true);
    expect(istRichtig(v, "gp", "")).toBe(false);
    expect(istRichtig(v, "gp", undefined)).toBe(false);
  });
});

describe("Das Verbuchen", () => {
  const stand = leererStand() as Lernstand;

  it("zaehlt ab 80 Prozent als richtig, darunter nur als Versuch", () => {
    expect(BESTEHENSGRENZE).toBe(80);
    const knapp = verbucheNetzplan(stand, 79, JETZT);
    expect((knapp.statistik as Record<string, unknown>)["GEN:netzplan"]).toEqual({ richtig: 0, gesamt: 1 });
    const genau = verbucheNetzplan(stand, 80, JETZT);
    expect((genau.statistik as Record<string, unknown>)["GEN:netzplan"]).toEqual({ richtig: 1, gesamt: 1 });
  });

  it("schreibt den Tageszaehler, aber kein Modul und kein Fehler-Deck", () => {
    const s = verbucheNetzplan(stand, 100, JETZT);
    expect((s.dailyCounts as Record<string, number>)[TAG]).toBe(1);
    expect(Object.keys(s.statistik as object)).toEqual(["GEN:netzplan"]);
    expect(Object.keys(s.fehlerDeck as object)).toEqual([]);
  });

  it("laesst den Ausgangsstand unveraendert und zaehlt weiter", () => {
    const vorher = JSON.stringify(stand);
    const eins = verbucheNetzplan(stand, 100, JETZT);
    expect(JSON.stringify(stand)).toBe(vorher);
    const zwei = verbucheNetzplan(eins, 0, JETZT);
    expect((zwei.statistik as Record<string, unknown>)["GEN:netzplan"]).toEqual({ richtig: 1, gesamt: 2 });
  });
});

describe("Die Anordnung der Knoten", () => {
  it("stellt einen Vorgang immer RECHTS von jedem seiner Vorgaenger", () => {
    const d = neueAufgabe().daten;
    const sp = new Map(anordnung(d).map((p) => [p.id, p.spalte]));
    for (const v of d.vorgaenge) {
      for (const p of v.vorgaenger) {
        expect(sp.get(v.id)!, v.id + " nach " + p).toBeGreaterThan(sp.get(p)!);
      }
    }
  });

  it("setzt Startvorgaenge in die erste Spalte und stapelt sie untereinander", () => {
    const d = neueAufgabe().daten;
    const plaetze = anordnung(d);
    const erste = plaetze.filter((p) => p.spalte === 0);
    expect(erste.length).toBeGreaterThan(0);
    expect(erste.map((p) => p.zeile).sort()).toEqual(erste.map((_, i) => i));
  });

  it("gibt jedem Vorgang genau einen Platz, und keine zwei denselben", () => {
    const d = neueAufgabe().daten;
    const plaetze = anordnung(d);
    expect(plaetze.length).toBe(d.vorgaenge.length);
    const schluessel = plaetze.map((p) => p.spalte + "/" + p.zeile);
    expect(new Set(schluessel).size).toBe(schluessel.length);
  });

  /* ⚠️ Die alte App verdrahtet die Plaetze fest fuer A bis F. Hier wird gerechnet —
     also muss ein siebter Vorgang auch einen Platz bekommen. */
  it("ordnet auch ein Netz, das die alte App nicht kennt", () => {
    const bau = (id: string, vor: string[]): NetzplanVorgang =>
      ({ id, name: id, dauer: 1, vorgaenger: vor, nachfolger: [],
         faz: 0, fez: 1, saz: 0, sez: 1, gp: 0, fp: 0 }) as NetzplanVorgang;
    const d = { vorgaenge: [bau("X", []), bau("Y", ["X"]), bau("Z", ["Y"]), bau("W", ["X"])],
                projektdauer: 3, kritisch: [] } as NetzplanDaten;
    const sp = new Map(anordnung(d).map((p) => [p.id, p.spalte]));
    expect(sp.get("X")).toBe(0);
    expect(sp.get("Y")).toBe(1);
    expect(sp.get("W")).toBe(1);
    expect(sp.get("Z")).toBe(2);
  });

  it("zaehlt jede Abhaengigkeit als genau eine Kante", () => {
    const d = neueAufgabe().daten;
    const erwartet = d.vorgaenge.reduce((n, v) => n + v.vorgaenger.length, 0);
    expect(kanten(d).length).toBe(erwartet);
    for (const k of kanten(d)) {
      expect(d.vorgaenge.some((v) => v.id === k.von)).toBe(true);
      expect(d.vorgaenge.find((v) => v.id === k.nach)!.vorgaenger).toContain(k.von);
    }
  });
});
