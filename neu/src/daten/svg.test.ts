/* ============================================================================
   WÄCHTER: SVG AUS DEM POOL IST REINE ZEICHNUNG (Prüfbericht 26.09.2026)

   `Bildflaeche.tsx` und `Hotspot.tsx` setzen `frage.svg` per
   `dangerouslySetInnerHTML` ein. Das ist nur sicher, solange der Pool keine
   ausführbaren Teile trägt. Gemessen 26.09.: 96 SVG, kein Befund – aber bis
   heute prüfte das niemand. Dieser Test hält es fest.
   ⛔ Er liest pool/*.json SELBST (fs), nicht über `FRAGEN`: vor `ladePool()`
      wäre die Liste leer, und ein leerer Wächter wäre grün (LEHREN 4e2b).
   ============================================================================ */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const hier = path.dirname(fileURLToPath(import.meta.url));
const POOL = path.join(hier, "../../../pool");

const VERBOTEN: [string, RegExp][] = [
  ["script", /<script/i],
  ["foreignObject", /<foreignobject/i],
  ["eingebettetes Dokument", /<(iframe|object|embed)\b/i],
  ["Ereignis-Attribut", /\son[a-z]+\s*=/i],
  ["javascript:-Adresse", /javascript\s*:/i],
  ["externe oder data-Quelle", /href\s*=\s*["']\s*(https?:|\/\/|data:)/i],
  ["Stil-Import", /@import/i],
];

/** Liefert die Namen aller Regeln, die ein SVG-Text verletzt. */
function svgBefunde(svg: string): string[] {
  return VERBOTEN.filter(([, re]) => re.test(svg)).map(([name]) => name);
}

function alleSvg(): { datei: string; id: string; svg: string }[] {
  const aus: { datei: string; id: string; svg: string }[] = [];
  for (const datei of fs.readdirSync(POOL).filter((d) => d.endsWith(".json"))) {
    const geh = (o: unknown, id: string): void => {
      if (Array.isArray(o)) { for (const x of o) geh(x, id); return; }
      if (o && typeof o === "object") {
        const r = o as Record<string, unknown>;
        const eigene = typeof r.id === "string" ? r.id : id;
        for (const w of Object.values(r)) geh(w, eigene);
        return;
      }
      if (typeof o === "string" && o.includes("<svg")) aus.push({ datei, id, svg: o });
    };
    geh(JSON.parse(fs.readFileSync(path.join(POOL, datei), "utf8")), "?");
  }
  return aus;
}

describe("Wächter: SVG im Pool", () => {
  it("erkennt jede verbotene Form (Fälle mit bekannter Antwort)", () => {
    const faelle: [string, string][] = [
      ["script", '<svg><script>alert(1)</script></svg>'],
      ["foreignObject", '<svg><foreignObject><div/></foreignObject></svg>'],
      ["eingebettetes Dokument", '<svg><iframe src="x"/></svg>'],
      ["Ereignis-Attribut", '<svg><rect onclick="x()"/></svg>'],
      ["Ereignis-Attribut", '<svg onload=alert(1)>'],
      ["javascript:-Adresse", '<svg><a href="javascript:x()"/></svg>'],
      ["externe oder data-Quelle", '<svg><image href="https://boese.example/a.png"/></svg>'],
      ["externe oder data-Quelle", "<svg><use xlink:href='data:image/svg+xml,x'/></svg>"],
      ["Stil-Import", '<svg><style>@import url(x)</style></svg>'],
    ];
    for (const [erwartet, svg] of faelle) expect(svgBefunde(svg), svg).toContain(erwartet);
    expect(svgBefunde('<svg viewBox="0 0 10 10"><text font-family="sans">Ein Ton</text><rect width="4"/></svg>')).toEqual([]);
  });

  it("jedes SVG im Pool ist reine Zeichnung – und es gibt welche", () => {
    const alle = alleSvg();
    expect(alle.length, "keine SVG gefunden – misst der Wächter ins Leere?").toBeGreaterThan(50);
    const befunde = alle.flatMap((s) => svgBefunde(s.svg).map((b) => `${s.datei} ${s.id}: ${b}`));
    expect(befunde).toEqual([]);
  });
});
