/* ============================================================================
   N24b: GLEICHHEITSBEWEIS FÜR DIE TYP-HILFE

   ⛔ `TYP_HILFE` wird aus app_ui.js GELESEN und in einer node:vm ausgewertet –
      nur dieser eine Block, weil app_ui.js beim Laden Oberfläche anfasst. Der
      Block muss dort wörtlich beginnen wie unten verlangt, sonst wird der Test
      rot, statt still eine alte Fassung zu prüfen.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FRAGEN } from "@/daten/laden";
import type { Frage } from "@/daten/typen";
import { leererStand } from "./stand";
import { TYP_HILFE, typHilfeFuer, blendeHilfeAus, alleHilfenZurueck, anzahlAusgeblendet } from "./typhilfe";
import { altQuelle } from "../testhilfe/altquelle";

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, "../../..");
const QUELLE = fs.readFileSync(altQuelle(WURZEL, "app_ui.js"), "utf8");

function alteHilfe(): Record<string, string> {
  const start = QUELLE.indexOf("var TYP_HILFE = {");
  const ende = QUELLE.indexOf("};", start);
  if (start < 0 || ende < 0) return {};
  const box: Record<string, unknown> = {};
  vm.createContext(box);
  vm.runInContext(QUELLE.slice(start, ende + 2), box);
  return box.TYP_HILFE as Record<string, string>;
}
const ALT = alteHilfe();

describe("Die alte Hilfe ist wirklich gelesen", () => {
  it("zehn Texte, darunter hotspot", () => {
    expect(Object.keys(ALT).length).toBe(10);
    expect(ALT.hotspot).toContain("Grafik");
  });
  it("renderTypHilfe prüft wörtlich TYP_HILFE[typ] und S.typHilfeAus[typ]", () => {
    expect(QUELLE).toContain("if (typeof S === \"undefined\" || !TYP_HILFE[typ] || (S.typHilfeAus && S.typHilfeAus[typ])) return;");
    expect(fs.readFileSync(altQuelle(WURZEL, "app_loeser.js"), "utf8"))
      .toContain("if (!opts.simulation) renderTypHilfe(R, iTyp);");
  });
});

describe("Texte zeichengleich", () => {
  it("dieselben Typen, dieselben Sätze", () => {
    expect(TYP_HILFE).toEqual(ALT);
  });
});

describe("typHilfeFuer — an allen Fragen wie die alte App", () => {
  const altFuer = (f: Record<string, unknown>, aus: Record<string, boolean>) => {
    const iTyp = String(f.typ === "bild" ? f.unterTyp : f.typ);
    return ALT[iTyp] && !aus[iTyp] ? ALT[iTyp] : null;
  };
  it("nichts abgehakt", () => {
    const s = leererStand();
    const ab = FRAGEN.filter((f) => typHilfeFuer(f, s) !== altFuer(f, {})).map((f) => f.id);
    expect(ab).toEqual([]);
    /* Nenner benannt: es gibt Fragen mit UND ohne Hilfe */
    const mit = FRAGEN.filter((f) => typHilfeFuer(f, s) !== null).length;
    expect(mit).toBeGreaterThan(20);
    expect(mit).toBeLessThan(FRAGEN.length);
  });
  it("hotspot abgehakt – nur hotspot verschwindet", () => {
    const s = blendeHilfeAus(leererStand(), "hotspot");
    const ab = FRAGEN.filter((f) => typHilfeFuer(f, s) !== altFuer(f, { hotspot: true })).map((f) => f.id);
    expect(ab).toEqual([]);
    expect(anzahlAusgeblendet(s)).toBe(1);
  });
  it("gebauter Fall: bild mit unterTyp eines Hilfetyps (im Bestand heute keiner)", () => {
    /* Die Sabotage T7 blieb am echten Bestand gruen – kein bild traegt heute einen
       unterTyp mit Hilfe. Die alte App nimmt trotzdem den unterTyp; also hier gebaut. */
    /* ausserhalb des Schemas gebaut (kein bild traegt unterTyp matrix) – deshalb die Umwandlung */
    const bild = { ...FRAGEN.find((f) => f.typ === "bild")!, unterTyp: "matrix" } as unknown as Frage;
    expect(typHilfeFuer(bild, leererStand())).toBe(altFuer(bild, {}));
    expect(typHilfeFuer(bild, leererStand())).toBe(ALT.matrix);
  });
  it("ein zweiter Haken lässt den ersten stehen", () => {
    const s = blendeHilfeAus(blendeHilfeAus(leererStand(), "hotspot"), "matrix");
    expect(s.typHilfeAus).toEqual({ hotspot: true, matrix: true });
    expect(anzahlAusgeblendet(s)).toBe(2);
  });
  it("zurückholen leert alles", () => {
    const s = alleHilfenZurueck(blendeHilfeAus(blendeHilfeAus(leererStand(), "hotspot"), "matrix"));
    expect(s.typHilfeAus).toEqual({});
    expect(anzahlAusgeblendet(s)).toBe(0);
  });
});
