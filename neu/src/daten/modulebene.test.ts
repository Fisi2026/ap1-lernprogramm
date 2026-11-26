/* ============================================================================
   N32 Schritt 3 – WÄCHTER: KEIN MODUL LIEST DEN POOL BEIM LADEN

   Seit E31 ist der Pool ein eigener Chunk; `FRAGEN`/`FAELLE` sind vor
   `ladePool()` LEER. Eine Schleife oder Konstante auf Modulebene sähe still
   einen leeren Pool (in den Tests nicht: dort lädt `pruefstand.ts` vorher –
   genau deshalb braucht es diese Prüfung am Quelltext).
   Gelesen wird der Syntaxbaum: jede Anweisung auf oberster Ebene, OHNE die
   Körper von Funktionen, Pfeilfunktionen und Methoden (die laufen erst beim
   Aufruf). ⛔ Ausgenommen sind nur die zwei Ladedateien selbst.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseSync } from "oxc-parser";

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NAMEN = new Set(["FRAGEN", "FAELLE", "fragenNach", "frageMitId", "bestandJeGebiet"]);
const AUSGENOMMEN = new Set(["daten/laden.ts", "daten/faelle.ts"]);

/* TS 7 (28.09.2026, BUILD_LOG 86): das Paket `typescript` hat keine stabile JS-Compiler-API mehr
   (nur `typescript/unstable/*`). Gelesen wird deshalb mit oxc-parser (ESTree, dieselbe Familie wie
   oxlint). Was „spaeter laeuft" (Funktionen, Pfeilfunktionen, Methoden, Klassen), wird nicht betreten. */
type Knoten = { type: string; start: number; name?: string } & Record<string, unknown>;
const SPAETER = new Set(["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression",
  "ClassDeclaration", "ClassExpression", "TSDeclareFunction"]);
const UEBERSPRINGEN = new Set(["ImportDeclaration", "TSInterfaceDeclaration", "TSTypeAliasDeclaration"]);
const istKnoten = (w: unknown): w is Knoten =>
  typeof w === "object" && w !== null && typeof (w as { type?: unknown }).type === "string";

function fundeAufModulebene(quelle: string, name = "x.ts"): string[] {
  const { program, errors } = parseSync(name, quelle);
  if (errors.length) throw new Error(`${name}: ${errors[0]?.message}`);
  const zeile = (pos: number) => quelle.slice(0, pos).split("\n").length;
  const funde: string[] = [];
  const besuche = (n: Knoten): void => {
    if (SPAETER.has(n.type)) return;
    if (n.type === "Identifier" && n.name !== undefined && NAMEN.has(n.name)) {
      funde.push(`${name}:${zeile(n.start)} ${n.name}`);
    }
    for (const [k, w] of Object.entries(n)) {
      if (k === "parent") continue;
      if (Array.isArray(w)) { for (const e of w) if (istKnoten(e)) besuche(e); }
      else if (istKnoten(w)) besuche(w);
    }
  };
  for (const st of program.body as unknown as Knoten[]) {
    if (UEBERSPRINGEN.has(st.type)) continue;
    besuche(st);
  }
  return funde;
}

function dateien(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "__schnappschuss__" ? [] : dateien(p);
    return /\.(ts|tsx)$/.test(e.name) && !/\.test\.tsx?$/.test(e.name) && !e.name.endsWith(".d.ts") ? [p] : [];
  });
}

describe("Kein Modul liest den Pool beim Laden", () => {
  it("der Detektor kennt die Antwort (bekannte Fälle)", () => {
    expect(fundeAufModulebene("for (const f of FRAGEN) POOL[f.id] = f;")).toHaveLength(1);
    expect(fundeAufModulebene("const X =\n  FRAGEN.filter((f) => f.typ);")).toHaveLength(1);
    expect(fundeAufModulebene("export const Y = frageMitId('a');")).toHaveLength(1);
    expect(fundeAufModulebene("import { FRAGEN } from 'x';\nexport function f() { return FRAGEN; }")).toEqual([]);
    expect(fundeAufModulebene("const g = () => FRAGEN.length;\nfunction h(a = FRAGEN) { return a; }")).toEqual([]);
    expect(fundeAufModulebene("class K { m() { return FAELLE; } }")).toEqual([]);
  });

  it("im Quelltext von neu/src gibt es keine solche Stelle", () => {
    const liste = dateien(SRC);
    expect(liste.length).toBeGreaterThan(80);
    const funde = liste
      .filter((p) => !AUSGENOMMEN.has(path.relative(SRC, p).replaceAll("\\", "/")))
      .flatMap((p) => fundeAufModulebene(fs.readFileSync(p, "utf8"), path.relative(SRC, p)));
    expect(funde).toEqual([]);
  });

  it("der Pool ist ein eigener Chunk: nur laden.ts importiert pooldaten, und nur dynamisch", () => {
    const IMPORT = /(from\s+|import\(\s*)["'][^"']*pooldaten(\.ts)?["']/;
    const nenner = dateien(SRC).filter((p) => IMPORT.test(fs.readFileSync(p, "utf8")));
    expect(nenner.map((p) => path.relative(SRC, p).replaceAll("\\", "/"))).toEqual(["daten/laden.ts"]);
    const laden = fs.readFileSync(path.join(SRC, "daten/laden.ts"), "utf8");
    expect(laden).toMatch(/import\("\.\/pooldaten"\)/);
    expect(laden).not.toMatch(/from "\.\/pooldaten"/);
  });
});
