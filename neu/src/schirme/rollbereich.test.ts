/* ============================================================================
   ROLLBEREICHE: Karten dürfen nicht gestaucht werden

   ⛔ ANLASS 17.09.2026 (Nutzer: „kann nicht scrollen"): In den Einstellungen war
      die Karte mit „Meldungen aller Lerner öffnen" unerreichbar. Der Rollbereich
      ist ein Grid mit impliziten Zeilen; die Karten tragen `overflow-hidden`,
      ihre Mindesthöhe ist damit 0 — das Grid STAUCHTE sie auf die Fensterhöhe
      (gemessen bei 600 px: 105 von 163 px sichtbar, Rollhöhe = Fensterhöhe),
      statt zu rollen. `content-start` hilft nicht (gemessen).
   ►► Jeder Grid-Rollbereich ohne feste Zeilenvorlage braucht `auto-rows-max`.
   ⚠️ jsdom rechnet kein Layout — geprüft wird deshalb die Klassenliste im Quelltext.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const hier = path.dirname(fileURLToPath(import.meta.url));
const dateien = fs.readdirSync(hier).filter((d) => d.endsWith(".tsx") && !d.includes(".test."));

function rollbereiche(): Array<{ datei: string; klasse: string }> {
  const out: Array<{ datei: string; klasse: string }> = [];
  for (const d of dateien) {
    const text = fs.readFileSync(path.join(hier, d), "utf8");
    for (const m of text.matchAll(/className="([^"]*)"/g)) {
      const k = m[1].split(/\s+/);
      if (k.includes("grid") && k.includes("overflow-auto") && !k.some((x) => x.startsWith("grid-rows-"))) {
        out.push({ datei: d, klasse: m[1] });
      }
    }
  }
  return out;
}

describe("Grid-Rollbereiche", () => {
  it("es gibt sie (sonst prüft der Test nichts)", () => {
    expect(rollbereiche().length).toBeGreaterThanOrEqual(6);
  });
  it("jeder hat auto-rows-max", () => {
    for (const r of rollbereiche()) expect(r.klasse.split(/\s+/), r.datei).toContain("auto-rows-max");
  });
});
