/* N23: die Tooltip-Regel am echten Bestand und an gebauten Fällen. */
import { describe, it, expect } from "vitest";
import { FRAGEN } from "@/daten/laden";
import type { Frage } from "@/daten/typen";
import * as GLOSSAR from "./tabellen/glossar.ts";
import { tipTreffer, tipTeile, leakText, MAX_TREFFER } from "./glossartip";

const TIPS = (GLOSSAR as { GLOSSAR_TIPS: Record<string, string> }).GLOSSAR_TIPS;
const bau = (f: Partial<Frage> & { frage: string }) => ({ id: "X-1", modul: "M01", thema: "T", typ: "mc", ...f }) as unknown as Frage;
const terme = (f: Frage) => tipTreffer(f, true).map((t) => t.term);

describe("Auswahl", () => {
  it("aus ist aus", () => {
    const f = bau({ frage: `Was ist ${Object.keys(TIPS)[0]}?` });
    expect(tipTreffer(f, true).length).toBeGreaterThan(0);
    expect(tipTreffer(f, false)).toEqual([]);
  });
  it("höchstens zwei Begriffe, sortiert nach Textstelle", () => {
    const drei = Object.keys(TIPS).slice(0, 3);
    const f = bau({ frage: `Erst ${drei[0]}, dann ${drei[1]}, zuletzt ${drei[2]}.` });
    const t = tipTreffer(f, true);
    expect(t.length).toBeLessThanOrEqual(MAX_TREFFER);
    expect(t.map((x) => x.start)).toEqual([...t.map((x) => x.start)].sort((a, b) => a - b));
  });
  it("Leak-Schutz: ein Begriff aus Option oder Musterlösung wird übersprungen", () => {
    const b = Object.keys(TIPS)[0];
    expect(terme(bau({ frage: `Frage zu ${b}.` }))).toContain(b);
    expect(terme(bau({ frage: `Frage zu ${b}.`, optionen: ["egal", b] }))).not.toContain(b);
    expect(terme(bau({ frage: `Frage zu ${b}.`, musterloesung: `Es ist ${b.toLowerCase()}.` }))).not.toContain(b);
    expect(leakText(bau({ frage: "x", optionen: ["A"], musterloesung: "B" }))).toBe("a  b");
  });
  it("nur ganze Wörter", () => {
    const b = Object.keys(TIPS).find((t) => /^[A-Za-zÄÖÜäöü]+$/.test(t))!;
    expect(terme(bau({ frage: `Das ${b} hier.` }))).toContain(b);
    expect(terme(bau({ frage: `Das X${b}Y hier.` }))).not.toContain(b);
  });
  it("die Stelle trifft den Begriff im Rohtext — auch neben & und <", () => {
    const b = Object.keys(TIPS)[0];
    const f = bau({ frage: `A & B < C: ${b} zählt.` });
    const t = tipTreffer(f, true)[0];
    expect((f.frage as string).slice(t.start, t.end).toLowerCase()).toBe(b.toLowerCase());
  });
  it("der längere Begriff gewinnt gegen den kürzeren, der in ihm steckt", () => {
    const paar = Object.keys(TIPS).find((lang) =>
      Object.keys(TIPS).some((kurz) => kurz !== lang && lang.toLowerCase().includes(kurz.toLowerCase())));
    if (!paar) return;                       // im Bestand kein solches Paar – dann ist nichts zu prüfen
    const t = tipTreffer(bau({ frage: `Hier steht ${paar}.` }), true);
    expect(t[0].term).toBe(paar);
  });
});

describe("tipTeile", () => {
  it("setzt den Text lückenlos wieder zusammen", () => {
    for (const f of FRAGEN.slice(0, 200)) {
      const text = f.frage;
      const teile = tipTeile(text, tipTreffer(f, true));
      expect(teile.map((t) => t.text).join("")).toBe(text);
      for (const t of teile) {
        if (t.treffer) expect(t.text.toLowerCase()).toBe(t.treffer.term.toLowerCase());
      }
    }
  });
  it("ohne Treffer genau ein Stück", () => {
    expect(tipTeile("nichts", [])).toEqual([{ text: "nichts" }]);
  });
});

describe("Am Bestand", () => {
  it("nie mehr als zwei, nie ein Begriff aus der Lösung", () => {
    let mitTreffer = 0;
    for (const f of FRAGEN) {
      const t = tipTreffer(f, true);
      expect(t.length, f.id).toBeLessThanOrEqual(MAX_TREFFER);
      if (t.length) mitTreffer++;
      const leak = leakText(f);
      for (const x of t) expect(leak.includes(x.term.toLowerCase()), `${f.id} ${x.term}`).toBe(false);
    }
    /* Sonst liefe der Test ins Leere. */
    expect(mitTreffer).toBeGreaterThan(50);
  });
});
