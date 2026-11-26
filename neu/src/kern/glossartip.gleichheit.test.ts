/* ============================================================================
   N23: GLEICHHEITSBEWEIS FÜR DIE TOOLTIP-AUSWAHL

   ⛔ `app_util.js`, `app_pool.js` und `app_glossar.js` laufen in einer node:vm
      WIRKLICH (Muster: N20a/N21). Verglichen wird die AUSWAHL: welche Begriffe
      `glossarWrap` in den Fragetext einsetzt — an ALLEN Fragen des Bestandes.
   ⚠️ Die alte Fassung arbeitet auf HTML-escaptem Text und liefert HTML; darum
      werden aus ihrer Ausgabe die `data-term`-Werte gezogen, nicht Zeichenstellen
      verglichen. Dass unsere Stellen stimmen, misst `glossartip.test.ts` am
      Rohtext (Zusammensetzen ohne Lücke, Treffertext = Begriff).
   ============================================================================ */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { FRAGEN } from "@/daten/laden";
import { leererStand } from "./stand";
import { tipTreffer } from "./glossartip";
import { altQuelle } from "../testhilfe/altquelle";

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, "../../..");
const requireCjs = createRequire(import.meta.url);
const Lroh = requireCjs(altQuelle(WURZEL, "logik.js"));

function alteApp(glossarTip: boolean) {
  const leer = () => ({ style: {}, setAttribute: () => {}, appendChild: () => {}, classList: { add: () => {} } });
  const sandbox: Record<string, unknown> = {
    console, L: Lroh, POOL: FRAGEN, S: { ...leererStand(), glossarTip },
    document: {
      addEventListener: () => {}, getElementById: () => null, querySelector: () => null,
      querySelectorAll: () => [], createElement: leer, body: { appendChild: () => {} },
    },
    window: { addEventListener: () => {} },
    setTimeout, clearTimeout,
  };
  vm.createContext(sandbox);
  for (const datei of ["app_util.js", "app_pool.js", "app_glossar.js"]) {
    try {
      vm.runInContext(fs.readFileSync(altQuelle(WURZEL, datei), "utf8"), sandbox, { filename: datei });
    } catch { /* Oberflaechen-Zeilen am Dateiende; Deklarationen sind gehoben – unten geprueft */ }
  }
  return sandbox as Record<string, any>;
}
const AN = alteApp(true);
const AUS = alteApp(false);

/** Die Begriffe, die die alte App gewählt hat, in der Reihenfolge des Textes. */
function alteTerme(app: Record<string, any>, f: unknown): string[] {
  const html = String(app.glossarWrap(f));
  return [...html.matchAll(/data-term="([^"]*)"/g)].map((m) => m[1]
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
}

describe("Die alte App ist wirklich geladen", () => {
  it("glossarWrap, glossarListe und GLOSSAR_TIPS sind da und liefern etwas", () => {
    expect(typeof AN.glossarWrap).toBe("function");
    expect(typeof AN.glossarListe).toBe("function");
    expect(AN.glossarListe().length).toBeGreaterThan(20);
    const mitTreffer = FRAGEN.filter((f) => alteTerme(AN, f).length > 0);
    expect(mitTreffer.length, "die alte App findet nirgends etwas – dann misst der Vergleich nichts")
      .toBeGreaterThan(50);
  });
});

describe("Dieselbe Auswahl an allen 1131 Fragen", () => {
  it("Begriffe und Reihenfolge stimmen überein", () => {
    let gleich = 0;
    for (const f of FRAGEN) {
      const alt = alteTerme(AN, f);
      const neu = tipTreffer(f, true).map((t) => t.term);
      expect(neu, f.id).toEqual(alt);
      if (alt.length) gleich++;
    }
    expect(gleich).toBeGreaterThan(50);
  });
  it("ohne die Einstellung wählt keine von beiden etwas", () => {
    for (const f of FRAGEN.slice(0, 100)) {
      expect(alteTerme(AUS, f)).toEqual([]);
      expect(tipTreffer(f, false)).toEqual([]);
    }
  });
});
