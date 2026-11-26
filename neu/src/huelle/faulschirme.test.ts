/* N38 P3 (E63): die acht faulen Schirme duerfen NUR ueber `huelle/faulschirme.ts` (dynamisch) erreicht
   werden. Ein einziger statischer Import aus dem Einstieg zieht den Schirm still zurueck in den ersten
   Chunk – `check.sh` 4f merkte das erst an der gzip-Zahl, hier steht die Stelle. Tests zaehlen nicht. */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const SRC = path.resolve(__dirname, "..");
const FAUL = ["Simulation", "Gantt", "Netzplan", "RechenGenerator", "Einstellungen", "Meldungsliste", "Spickzettel", "Glossar"];
const MUSTER = new RegExp(`from\\s+"(?:@/schirme/|\\./|\\.\\./schirme/)(${FAUL.join("|")})"`);

function dateien(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    return statSync(p).isDirectory() ? dateien(p) : /\.tsx?$/.test(n) && !/\.test\.tsx?$/.test(n) ? [p] : [];
  });
}
/** Statische Importe faul geladener Schirme, ausser zwischen den faulen Schirmen selbst. */
function statisch(): string[] {
  return dateien(SRC).flatMap((f) => {
    const eigen = FAUL.some((n) => f.endsWith(path.join("schirme", n + ".tsx")));
    return readFileSync(f, "utf8").split("\n").filter((z) => MUSTER.test(z) && !eigen)
      .map((z) => path.relative(SRC, f) + ": " + z.trim());
  });
}

describe("faule Schirme (N38 P3)", () => {
  it("kein statischer Import ausserhalb von faulschirme.ts", () => {
    expect(statisch()).toEqual([]);
  });
  it("Gegenprobe: das Muster erkennt einen statischen Import", () => {
    expect(MUSTER.test('import { Gantt } from "@/schirme/Gantt";')).toBe(true);
    expect(MUSTER.test('import("@/schirme/Gantt")')).toBe(false);
  });
  it("faulschirme.ts nennt jeden der acht dynamisch", () => {
    const q = readFileSync(path.join(SRC, "huelle/faulschirme.ts"), "utf8");
    for (const n of FAUL) expect(q).toContain(`import("@/schirme/${n}")`);
  });
});
