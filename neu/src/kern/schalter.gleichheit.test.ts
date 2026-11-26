/* ============================================================================
   N24: GLEICHHEITSBEWEIS FÜR DIE REGELN HINTER DEN SCHALTERN

   ⛔ `app_util.js` läuft in einer node:vm WIRKLICH (Muster: glossartip.gleichheit).
      `svgAltFuer` wird an ALLEN Fragen des Bestandes gegen die alte Fassung gelegt.
   ⚠️ Die Abruf-Bedingung steht in der alten App INLINE am Ende von `loeseFrage`
      (app_loeser.js) und braucht dort einen DOM. Sie wird deshalb aus der Quelle
      GELESEN und muss wörtlich so dastehen, wie dieser Test sie nachstellt —
      ändert sie sich dort, wird er rot, statt still eine alte Fassung zu prüfen.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FRAGEN } from "@/daten/laden";
import { leererStand } from "./stand";
import { abrufGilt, svgAltFuer, bildBeschriftung, simDauerAus } from "./schalter";
import { altQuelle } from "../testhilfe/altquelle";

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, "../../..");

function alteApp(ariaAltTexte: boolean) {
  const leer = () => ({ style: {}, setAttribute: () => {}, appendChild: () => {}, classList: { add: () => {} } });
  const sandbox: Record<string, unknown> = {
    console, S: { ...leererStand(), ariaAltTexte },
    document: {
      addEventListener: () => {}, getElementById: () => null, querySelector: () => null,
      querySelectorAll: () => [], createElement: leer, body: { appendChild: () => {} },
    },
    window: { addEventListener: () => {} },
    setTimeout, clearTimeout,
  };
  vm.createContext(sandbox);
  try {
    vm.runInContext(fs.readFileSync(altQuelle(WURZEL, "app_util.js"), "utf8"), sandbox, { filename: "app_util.js" });
  } catch { /* Oberflaechen-Zeilen am Dateiende; Deklarationen sind gehoben – unten geprueft */ }
  return sandbox as Record<string, any>;
}
const ALT = alteApp(true);

describe("Die alte App ist wirklich geladen", () => {
  it("svgAltFuer ist da und liefert Text", () => {
    expect(typeof ALT.svgAltFuer).toBe("function");
    expect(String(ALT.svgAltFuer({ typ: "hotspot", thema: "X" }))).toBe("Hotspot-Grafik zum Anklicken zum Thema X");
  });
});

describe("svgAltFuer — gleich an allen Fragen des Bestandes", () => {
  it("jede Frage ergibt denselben Text wie app_util.js", () => {
    const abweichend = FRAGEN.filter((f) => svgAltFuer(f) !== String(ALT.svgAltFuer(f))).map((f) => f.id);
    expect(abweichend).toEqual([]);
    expect(FRAGEN.length).toBeGreaterThan(1000);
  });
  it("die Bildfragen treffen mehr als einen Zweig (sonst hätte der Vergleich nichts gemessen)", () => {
    const texte = new Set(FRAGEN.filter((f) => "svg" in f && typeof f.svg === "string").map((f) => svgAltFuer(f).split(" zum Thema ")[0]));
    expect(texte.size).toBeGreaterThanOrEqual(3);
  });
});

describe("bildBeschriftung — der Schalter verbessert, statt hinzuzufügen", () => {
  const f = FRAGEN.find((x) => "svg" in x && typeof x.svg === "string" && typeof x.thema === "string")!;
  it("aus: die generische Zeile mit der Kennung", () => {
    expect(bildBeschriftung(f, false)).toBe(`Zeichnung zur Frage ${f.id}`);
  });
  it("an: der inhaltliche Text", () => {
    expect(bildBeschriftung(f, true)).toBe(svgAltFuer(f));
    expect(bildBeschriftung(f, true)).toContain(" zum Thema ");
  });
});

describe("abrufGilt — dieselbe Bedingung wie app_loeser.js", () => {
  const quelle = fs.readFileSync(altQuelle(WURZEL, "app_loeser.js"), "utf8");
  it("die alte Bedingung steht wörtlich so in der Quelle", () => {
    expect(quelle).toContain('var iTyp = f.typ === "bild" ? f.unterTyp : f.typ;');
    expect(quelle).toContain('if (S.abrufAn && !opts.simulation && (iTyp === "mc" || iTyp === "mehrfach" || iTyp === "dropdown")) abrufVerdecken(R);');
  });
  it("an allen Fragen: an = alte Bedingung, aus = nie", () => {
    const alt = (f: Record<string, unknown>) => {
      const iTyp = f.typ === "bild" ? f.unterTyp : f.typ;
      return iTyp === "mc" || iTyp === "mehrfach" || iTyp === "dropdown";
    };
    const abweichend = FRAGEN.filter((f) => abrufGilt(f, true) !== alt(f)).map((f) => f.id);
    expect(abweichend).toEqual([]);
    expect(FRAGEN.filter((f) => abrufGilt(f, false)).length).toBe(0);
    /* Nenner benannt: es gibt Fragen beider Arten, sonst misst der Vergleich nichts. */
    const an = FRAGEN.filter((f) => abrufGilt(f, true)).length;
    expect(an).toBeGreaterThan(100);
    expect(an).toBeLessThan(FRAGEN.length);
  });
});

describe("simDauerAus — dieselbe Grenze wie app_pages2.js", () => {
  const alt = (v: unknown) => Math.max(0, Math.min(240, Number(v) || 0));
  it.each([["45"], ["45.5"], ["0"], [""], ["abc"], ["-5"], ["999"], ["240"], ["90"]])("%s", (v) => {
    expect(simDauerAus(v)).toBe(alt(v));
  });
});
