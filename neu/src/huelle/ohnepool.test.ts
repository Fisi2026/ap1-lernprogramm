/* N38 P1 (E63): `OHNE_POOL` in App.tsx behauptet, diese Schirme lesen den Pool nicht. Hier wird es
   an den Importen gemessen – transitiv ueber `@/…` und relative Pfade, ohne Tests.
   ⚠️ Die Startseite ist die bewusste Ausnahme: sie liest den Pool, bekommt aber `poolDa` und zeigt
      ohne ihn nur, was stimmt (`kern/startseite.ts`, eigener Test). */
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { OHNE_POOL } from "@/App";

const SRC = path.resolve(__dirname, "..");
const SCHIRM: Record<string, string> = {
  stat: "schirme/Statistik.tsx", gen: "schirme/RechenGenerator.tsx", gantt: "schirme/Gantt.tsx",
  netzplan: "schirme/Netzplan.tsx", spickzettel: "schirme/Spickzettel.tsx",
};
const POOL = [path.join(SRC, "daten/laden.ts"), path.join(SRC, "daten/pooldaten.ts"), path.join(SRC, "daten/faelle.ts")];

function aufloesen(von: string, ziel: string): string | null {
  const basis = ziel.startsWith("@/") ? path.join(SRC, ziel.slice(2)) : ziel.startsWith(".") ? path.resolve(path.dirname(von), ziel) : null;
  if (!basis) return null;
  for (const k of [basis, basis + ".ts", basis + ".tsx", path.join(basis, "index.ts")]) if (existsSync(k) && k.match(/\.tsx?$/)) return k;
  return null;
}
function erreicht(start: string): string[] {
  const gesehen = new Set<string>(); const offen = [start]; const treffer: string[] = [];
  while (offen.length) {
    const f = offen.pop()!;
    if (gesehen.has(f)) continue;
    gesehen.add(f);
    if (POOL.includes(f)) { treffer.push(path.relative(SRC, f)); continue; }
    for (const m of readFileSync(f, "utf8").matchAll(/from\s+"([^"]+)"|import\(\s*"([^"]+)"\s*\)/g)) {
      const z = aufloesen(f, m[1] ?? m[2] ?? "");
      if (z) offen.push(z);
    }
  }
  return treffer;
}

describe("OHNE_POOL (N38 P1)", () => {
  it("nennt genau die gemessenen Schirme plus die Startseite", () => {
    expect([...OHNE_POOL].sort()).toEqual(["start", ...Object.keys(SCHIRM)].sort());
  });
  it.each(Object.entries(SCHIRM))("%s erreicht den Pool nicht", (_b, datei) => {
    expect(erreicht(path.join(SRC, datei))).toEqual([]);
  });
  it("Gegenprobe: ein Schirm mit Pool wird erkannt", () => {
    expect(erreicht(path.join(SRC, "schirme/Fehlerdeck.tsx")).length).toBeGreaterThan(0);
  });
});
