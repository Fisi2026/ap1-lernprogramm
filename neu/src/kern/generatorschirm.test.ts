/* ============================================================================
   DER RECHEN-GENERATOR-SCHIRM — DIE REGELN DAHINTER

   Gemessen wird zweierlei, und beides ist neu gegenueber der Einstreuung beim
   Ueben: eine Aufgabe einer BESTIMMTEN Art bauen, und sie so verbuchen, wie es
   `sGenerator` in der alten App tut — GEN-Zeile und Tageszaehler, sonst nichts.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import { dayKey } from "./lernen";
import { GENERATOREN } from "./generatoren.ts";
import { leererStand } from "./stand";
import type { Lernstand } from "./stand";
import {
  arten, artName, aufgabeDerArt, verbucheZufall, verbucheAufGeneratorschirm,
} from "./generator";

const stand = leererStand() as Lernstand;
const JETZT = Date.UTC(2026, 8, 16, 9, 0, 0);
const TAG = dayKey(JETZT);

/** Die Arten, die der Schirm anbietet — gemessen, nicht abgeschrieben. */
const MOEGLICH = arten(stand);

describe("Eine Aufgabe der gewaehlten Art bauen", () => {
  it("liefert genau die verlangte Art, nicht irgendeine", () => {
    expect(MOEGLICH.length).toBeGreaterThan(1);   // sonst misst das hier nichts
    for (const a of MOEGLICH) {
      const x = aufgabeDerArt(stand, a);
      expect(x, a).not.toBeNull();
      expect(x!.generatorArt).toBe(a);
      expect(x!.id).toBe("GEN-" + a);
      expect(x!.frage.length).toBeGreaterThan(0);
      expect((x!.weg ?? []).length).toBeGreaterThan(0);
    }
  });

  it("gibt null bei einer Art, die es nicht gibt — statt etwas zu erfinden", () => {
    expect(aufgabeDerArt(stand, "gibtesnicht")).toBeNull();
  });

  it("wuerfelt bei jedem Aufruf neu", () => {
    /* ⚠️ Gemessen ueber viele Anlaeufe, nicht ueber zwei: eine Generator-Art mit
       wenigen Werten darf zweimal dasselbe liefern, ohne kaputt zu sein. */
    const fragen = new Set<string>();
    for (let i = 0; i < 30; i++) fragen.add(aufgabeDerArt(stand, MOEGLICH[0])!.frage);
    expect(fragen.size).toBeGreaterThan(1);
  });

  it("nennt die Art so, wie GENERATOREN (kern/generatoren.ts) sie nennt", () => {
    const G = GENERATOREN;
    for (const a of MOEGLICH) expect(artName(a)).toBe(G[a].name);
    expect(artName("gibtesnicht")).toBe("gibtesnicht");
  });
});

describe("Verbuchen auf dem Generator-Schirm", () => {
  const aufgabe = aufgabeDerArt(stand, MOEGLICH[0])!;
  const schluessel = "GEN:" + aufgabe.generator;

  it("schreibt die GEN-Zeile und den Tageszaehler", () => {
    const s = verbucheAufGeneratorschirm(stand, aufgabe, true, JETZT);
    expect((s.statistik as Record<string, unknown>)[schluessel]).toEqual({ richtig: 1, gesamt: 1 });
    expect((s.dailyCounts as Record<string, number>)[TAG]).toBe(1);
  });

  it("zaehlt eine falsche Antwort mit, aber nicht als richtig", () => {
    const s = verbucheAufGeneratorschirm(stand, aufgabe, false, JETZT);
    expect((s.statistik as Record<string, unknown>)[schluessel]).toEqual({ richtig: 0, gesamt: 1 });
    expect((s.dailyCounts as Record<string, number>)[TAG]).toBe(1);
  });

  /* ⛔⛔ DER KERN DER GANZEN SACHE. Wer sich die Aufgabenart aussuchen darf,
     darf damit nicht seine Trefferquote faerben — sonst ist die Bereitschaft je
     Gebiet nichts mehr wert. */
  it("ruehrt WEDER Modul NOCH Thema an — anders als der Weg beim Ueben", () => {
    const s = verbucheAufGeneratorschirm(stand, aufgabe, true, JETZT);
    const st = s.statistik as Record<string, unknown>;
    expect(Object.keys(st)).toEqual([schluessel]);
    expect(st[aufgabe.modul]).toBeUndefined();
    expect(st["T:" + aufgabe.modul + ":" + aufgabe.thema]).toBeUndefined();
  });

  it("legt nichts ins Fehler-Deck und zaehlt keine Antwort mit", () => {
    const s = verbucheAufGeneratorschirm(stand, aufgabe, false, JETZT);
    expect(Object.keys(s.fehlerDeck as object)).toEqual([]);
    expect((s.antworten as unknown[]).length).toBe(0);
    expect(s.uebenZaehler).toBe(stand.uebenZaehler);
  });

  it("laesst den Ausgangsstand unveraendert", () => {
    const vorher = JSON.stringify(stand);
    verbucheAufGeneratorschirm(stand, aufgabe, true, JETZT);
    expect(JSON.stringify(stand)).toBe(vorher);
  });

  it("zaehlt beim zweiten Mal weiter, statt zu ueberschreiben", () => {
    const eins = verbucheAufGeneratorschirm(stand, aufgabe, true, JETZT);
    const zwei = verbucheAufGeneratorschirm(eins, aufgabe, false, JETZT);
    expect((zwei.statistik as Record<string, unknown>)[schluessel]).toEqual({ richtig: 1, gesamt: 2 });
    expect((zwei.dailyCounts as Record<string, number>)[TAG]).toBe(2);
  });

  /* ⚠️ Der Unterschied zum Ueben-Weg ausdruecklich: dort bucht `verbucheZufall`
     nur die GEN-Zeile, den Tageszaehler macht `verbuche(...)` daneben. */
  it("verbucheZufall allein ruehrt den Tageszaehler NICHT an", () => {
    const s = verbucheZufall(stand, aufgabe, true);
    expect(Object.keys(s.dailyCounts as object)).toEqual([]);
  });
});
