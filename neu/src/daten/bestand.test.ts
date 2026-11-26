/* ============================================================================
   Gegenprobe: sieht die neue Oberflaeche denselben Bestand wie die alte?

   Die alte App (`referenz/`) bekommt den Pool seit N29 Teil 2 (E40) ueber
   `tools/pool_laden.js` — der erzeugt ihr `fragen.js` im Test-Arbeitsordner und
   speist alle Werkzeuge. Die neue laedt `pool/` ueber `daten/laden.ts`. Das sind
   ZWEI Lader derselben Quelle; beide muessen zur selben Menge fuehren.

   ⚠️ Bis 24.09.2026 stand hier `fragen.js` (Bauergebnis von `build_fragen.py`,
      bewacht vom Drift-Waechter). Beides ist mit E40 entfallen.
   ============================================================================ */
import { GEBIETE } from "../kern/tabellen/gebiete.ts";
import { describe, it, expect } from "vitest";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FRAGEN } from "./laden";

const hier = path.dirname(fileURLToPath(import.meta.url));
const requireCjs = createRequire(import.meta.url);
const WURZEL = path.resolve(hier, "../../..");

type AlteFrage = {
  id: string; typ: string; gebiet: string; thema: string;
  modul: string; schwierigkeit: number; frage: string;
};
const LADER = requireCjs(path.join(WURZEL, "tools", "pool_laden.js")) as {
  laden: () => { fragen: AlteFrage[]; faelle: Array<{ id: string }> };
};
const ALT = LADER.laden().fragen;

const alteIds = new Set(ALT.map((f) => f.id));
const neueIds = new Set(FRAGEN.map((f) => f.id));
const nurAlt = [...alteIds].filter((id) => !neueIds.has(id));
const nurNeu = [...neueIds].filter((id) => !alteIds.has(id));

describe("Bestand: daten/laden.ts (neu) gegen tools/pool_laden.js (alt)", () => {
  it("laedt ueberhaupt etwas — beide Seiten", () => {
    expect(ALT.length).toBeGreaterThan(1000);
    expect(FRAGEN.length).toBeGreaterThan(1000);
  });

  it("hat auf beiden Seiten gleich viele Fragen", () => {
    expect(
      FRAGEN.length,
      `neu ${FRAGEN.length}, alt ${ALT.length} — nur alt: ${nurAlt.slice(0, 5).join(", ")} | nur neu: ${nurNeu.slice(0, 5).join(", ")}`,
    ).toBe(ALT.length);
  });

  it("laesst keine Frage der alten Fassung fallen", () => {
    expect(nurAlt, `${nurAlt.length} Fragen fehlen im neuen Lader`).toEqual([]);
  });

  it("erfindet keine Frage, die es in der alten nicht gibt", () => {
    expect(nurNeu, `${nurNeu.length} Fragen kennt nur der neue Lader`).toEqual([]);
  });

  it("vergibt keine ID doppelt", () => {
    expect(neueIds.size).toBe(FRAGEN.length);
  });

  it("stimmt Feld fuer Feld ueberein (typ, gebiet, thema, modul, schwierigkeit)", () => {
    const neuNach = new Map(FRAGEN.map((f) => [f.id, f]));
    const abweichungen: string[] = [];
    for (const a of ALT) {
      const n = neuNach.get(a.id);
      if (!n) continue; // von den beiden Tests oben schon gemeldet
      for (const feld of ["typ", "gebiet", "thema", "modul", "schwierigkeit"] as const) {
        if (n[feld] !== a[feld]) {
          abweichungen.push(`${a.id}.${feld}: alt="${a[feld]}" neu="${String(n[feld])}"`);
        }
      }
      if (n.frage !== a.frage) abweichungen.push(`${a.id}.frage: Text weicht ab`);
    }
    expect(abweichungen.slice(0, 10), `${abweichungen.length} Abweichungen`).toEqual([]);
  });

  /* Gegenprobe der Gegenprobe: der Vergleich MUSS eine Abweichung finden, sonst
     ist er eine gruene Beruhigungspille. Dieselbe Klasse wie B153/B158. */
  it("schlaegt an, wenn eine Frage verbogen wird", () => {
    const verbogen = ALT.map((f, i) => (i === 0 ? { ...f, typ: "gibtEsNicht" } : f));
    const neuNach = new Map(FRAGEN.map((f) => [f.id, f]));
    const gefunden = verbogen.filter((a) => neuNach.get(a.id)?.typ !== a.typ);
    expect(gefunden.length).toBe(1);
    expect(gefunden[0].id).toBe(ALT[0].id);
  });

  it("kennt nur Gebiete, die kern/tabellen/gebiete.ts fuehrt (= logik.js, N34 T1)", () => {
    const erlaubt = new Set(GEBIETE.map((g) => g[0]));
    const fremde = [...new Set(FRAGEN.map((f) => f.gebiet))].filter((g) => !erlaubt.has(g));
    expect(fremde, `Gebiete ohne Eintrag in GEBIETE: ${fremde.join(", ")}`).toEqual([]);
  });

  it("haelt die gemessene Verteilung fest", () => {
    const je: Record<string, number> = {};
    for (const f of FRAGEN) je[f.gebiet] = (je[f.gebiet] ?? 0) + 1;
    /* ⚠️ Sollwerte, gemessen am 10.09.2026. Sie duerfen wachsen — deshalb wird
       nach UNTEN geprueft, nicht auf Gleichheit. Ein Fach, das schrumpft, ist
       ein Befund; ein Fach, das waechst, ist Arbeit. */
    const mindestens: Record<string, number> = {
      A1: 152, A2: 206, A3: 401, A4: 66, A5: 185, B1: 10, B2: 8, B3: 103,
    };
    for (const [g, soll] of Object.entries(mindestens)) {
      expect(je[g] ?? 0, `Fach ${g} ist auf ${je[g] ?? 0} geschrumpft (war ${soll})`)
        .toBeGreaterThanOrEqual(soll);
    }
  });
});

describe("Bestand: Faelle", () => {
  it("liest die Fallaufgaben und zaehlt sie", () => {
    const FAELLE = LADER.laden().faelle;
    expect(FAELLE.length).toBeGreaterThanOrEqual(9);
    expect(new Set(FAELLE.map((f) => f.id)).size).toBe(FAELLE.length);
  });
});
