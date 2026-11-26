/* ============================================================================
   DAS GANTT-TRAINING — DIE REGELN

   ⛔ Gerechnet wird in logik.js; `L.ganttBerechne` ist dort seit jeher geprueft.
      Hier wird gemessen, was DIESE Datei tut: pruefen, verbuchen, den Balkenplan
      beschreiben — und dass sie die Rechnung NICHT nachbaut.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import { leererStand } from "./stand";
import type { Lernstand } from "./stand";
import { dayKey } from "./lernen";
import {
  neueAufgabe, pruefe, istRichtig, normZahl, verbucheGantt, loesungsweg, zelle,
  BESTEHENSGRENZE,
} from "./gantt";
import type { GanttDaten, GanttVorgang, Eingaben } from "./gantt";

const JETZT = Date.UTC(2026, 8, 16, 10, 0, 0);
const TAG = dayKey(JETZT);

/** Alle Felder richtig ausgefuellt. */
function alleRichtig(daten: GanttDaten): Eingaben {
  const e: Eingaben = {};
  for (const v of daten.vorgaenge) e[v.id] = { start: String(v.start), ende: String(v.ende) };
  return e;
}

describe("Die Aufgabe kommt aus logik.js", () => {
  it("bringt Szenario, Vorgaenge, Projektdauer und kritischen Pfad mit", () => {
    const a = neueAufgabe();
    expect(a.szenario.titel.length).toBeGreaterThan(0);
    expect(a.szenario.text.length).toBeGreaterThan(0);
    expect(a.daten.vorgaenge.length).toBeGreaterThan(2);
    expect(a.daten.projektdauer).toBeGreaterThan(0);
    expect(a.daten.kritisch.length).toBeGreaterThan(0);
    for (const v of a.daten.vorgaenge) {
      expect(v.ende).toBe(v.start + v.dauer - 1);
      expect(v.puffer).toBe(v.spStart - v.start);
    }
  });

  it("wuerfelt — nicht immer dasselbe Szenario", () => {
    const titel = new Set<string>();
    for (let i = 0; i < 40; i++) titel.add(neueAufgabe().szenario.titel);
    expect(titel.size).toBeGreaterThan(1);
  });

  it("der kritische Pfad ist genau die Menge mit Puffer 0", () => {
    const d = neueAufgabe().daten;
    expect(d.kritisch.slice().sort()).toEqual(
      d.vorgaenge.filter((v) => v.puffer === 0).map((v) => v.id).sort(),
    );
  });
});

describe("Das Pruefen der Eingaben", () => {
  it("zaehlt zwei Felder je Vorgang", () => {
    const d = neueAufgabe().daten;
    expect(pruefe(d, {}).gesamt).toBe(d.vorgaenge.length * 2);
    expect(pruefe(d, {}).richtig).toBe(0);
    expect(pruefe(d, {}).quote).toBe(0);
  });

  it("gibt bei vollstaendig richtiger Planung 100 Prozent", () => {
    const d = neueAufgabe().daten;
    const r = pruefe(d, alleRichtig(d));
    expect(r.richtig).toBe(r.gesamt);
    expect(r.quote).toBe(100);
    expect(r.alleOk).toBe(true);
  });

  it("nimmt Komma statt Punkt und Leerzeichen hin — mehr aber nicht", () => {
    expect(normZahl(" 4 ")).toBe("4");
    expect(normZahl("4,0")).toBe("4.0");
    const v = { id: "A", name: "n", dauer: 1, vorgaenger: [], start: 4, ende: 4,
                spStart: 4, spEnde: 4, puffer: 0 } as GanttVorgang;
    expect(istRichtig(v, "start", " 4 ")).toBe(true);
    expect(istRichtig(v, "start", "4 Tage")).toBe(false);
    expect(istRichtig(v, "start", "")).toBe(false);
    expect(istRichtig(v, "start", undefined)).toBe(false);
  });

  it("unterscheidet Start und Ende", () => {
    const v = { id: "A", name: "n", dauer: 3, vorgaenger: [], start: 1, ende: 3,
                spStart: 1, spEnde: 3, puffer: 0 } as GanttVorgang;
    expect(istRichtig(v, "start", "1")).toBe(true);
    expect(istRichtig(v, "ende", "1")).toBe(false);
    expect(istRichtig(v, "ende", "3")).toBe(true);
  });
});

describe("Das Verbuchen", () => {
  const stand = leererStand() as Lernstand;

  /* ⛔⛔ DIE 80-PROZENT-GRENZE IST DIE ENTSCHEIDUNG DIESES SCHIRMS: 14 Zahlenfelder,
     ein Tippfehler soll nicht den ganzen Durchgang verwerfen. Sie gilt ab 80, nicht
     ueber 80 — und darunter zaehlt der Durchgang zwar mit, aber nicht als richtig. */
  it("zaehlt ab 80 Prozent als richtig, darunter nur als Versuch", () => {
    expect(BESTEHENSGRENZE).toBe(80);
    const knapp = verbucheGantt(stand, BESTEHENSGRENZE - 1, JETZT);
    expect((knapp.statistik as Record<string, unknown>)["GEN:gantt"]).toEqual({ richtig: 0, gesamt: 1 });
    const genau = verbucheGantt(stand, BESTEHENSGRENZE, JETZT);
    expect((genau.statistik as Record<string, unknown>)["GEN:gantt"]).toEqual({ richtig: 1, gesamt: 1 });
  });

  it("zaehlt den Tag mit — geuebt hat man", () => {
    const s = verbucheGantt(stand, 100, JETZT);
    expect((s.dailyCounts as Record<string, number>)[TAG]).toBe(1);
  });

  it("ruehrt kein Modul, kein Thema und kein Fehler-Deck an", () => {
    const s = verbucheGantt(stand, 100, JETZT);
    expect(Object.keys(s.statistik as object)).toEqual(["GEN:gantt"]);
    expect(Object.keys(s.fehlerDeck as object)).toEqual([]);
    expect((s.antworten as unknown[]).length).toBe(0);
  });

  it("laesst den Ausgangsstand unveraendert und zaehlt beim zweiten Mal weiter", () => {
    const vorher = JSON.stringify(stand);
    const eins = verbucheGantt(stand, 100, JETZT);
    expect(JSON.stringify(stand)).toBe(vorher);
    const zwei = verbucheGantt(eins, 10, JETZT);
    expect((zwei.statistik as Record<string, unknown>)["GEN:gantt"]).toEqual({ richtig: 1, gesamt: 2 });
    expect((zwei.dailyCounts as Record<string, number>)[TAG]).toBe(2);
  });
});

describe("Der Balkenplan", () => {
  it("faerbt den Balken kritisch, wenn der Vorgang keinen Puffer hat", () => {
    const v = { id: "A", name: "n", dauer: 2, vorgaenger: [], start: 2, ende: 3,
                spStart: 2, spEnde: 3, puffer: 0 } as GanttVorgang;
    expect(zelle(v, 1)).toBe("leer");
    expect(zelle(v, 2)).toBe("kritisch");
    expect(zelle(v, 3)).toBe("kritisch");
    expect(zelle(v, 4)).toBe("leer");
  });

  it("zeigt den Puffer als eigenen Streifen HINTER dem Balken", () => {
    const v = { id: "B", name: "n", dauer: 2, vorgaenger: [], start: 2, ende: 3,
                spStart: 4, spEnde: 5, puffer: 2 } as GanttVorgang;
    expect(zelle(v, 2)).toBe("balken");
    expect(zelle(v, 3)).toBe("balken");
    expect(zelle(v, 4)).toBe("puffer");
    expect(zelle(v, 5)).toBe("puffer");
    expect(zelle(v, 6)).toBe("leer");
  });

  it("beschreibt jeden Vorgang im Loesungsweg, mit Puffer und Vorgaengern", () => {
    const d = neueAufgabe().daten;
    const weg = loesungsweg(d);
    expect(weg.length).toBe(d.vorgaenge.length);
    for (let i = 0; i < d.vorgaenge.length; i++) {
      const v = d.vorgaenge[i];
      expect(weg[i]).toContain("Start Tag " + v.start);
      expect(weg[i]).toContain("Ende Tag " + v.ende);
      expect(weg[i]).toContain("Puffer " + v.puffer);
      expect(weg[i]).toContain(v.vorgaenger.length ? v.vorgaenger.join("/") : "ohne Vorgänger");
    }
  });
});
