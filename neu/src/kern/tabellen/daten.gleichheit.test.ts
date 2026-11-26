/* ============================================================================
   N34 T6b/T6c (E56, E57, 27.09.2026): DIE DATEN-TABELLEN – FORM STATT REFERENZ
   `glossar.ts` und `abkuerzungen.ts` sind in T6b wortgleich aus den Wurzel-Dateien geschnitten
   (Beweis gegen `referenz/` im Commit df65a66). Seit T6c (E57, Nutzer-Entscheid) sind SIE die
   Quelle und werden bewusst gepflegt – gehalten wird deshalb die FORM, nicht ein eingefrorener Stand.
   ⛔ Der Spickzettel hat eine zweite, dauerhafte Quelle: `99_Spickzettel.md`. `tools/build_spick.py`
      schreibt daraus `spickzettel.ts`; hier wird beides zeichengleich gehalten.
   ⛔ Die Exportmenge ist fest aufgezaehlt (LEHREN B151: Anwesenheit ist nicht Menge).
   ⛔ Node laedt jede Datei NATIV (E49) – dafuer ein eigener Prozess.
   ============================================================================ */
import { it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import * as glossar from "./glossar.ts";
import * as abkuerzungen from "./abkuerzungen.ts";
import * as spickzettel from "./spickzettel.ts";

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, "../../../..");
const MODULE: Record<string, Record<string, unknown>> = { glossar, abkuerzungen, spickzettel };
const LISTE = ["glossar.GLOSSAR_TIPS", "glossar.GLOSSAR_M09_BEGRIFFE", "abkuerzungen.ABKUERZUNGEN", "spickzettel.SPICKZETTEL"];
const ALLE = Object.entries(MODULE).flatMap(([m, mod]) => Object.keys(mod).map((n) => m + "." + n));

const voll = (w: unknown) => typeof w === "string" && w.trim().length > 0;

it("die Exportmenge ist genau die gepruefte Liste (4)", () => {
  expect([...ALLE].sort()).toEqual([...LISTE].sort());
});

it("GLOSSAR_TIPS: jeder Begriff und jede Definition ist ein nicht leerer Text", () => {
  const e = Object.entries(glossar.GLOSSAR_TIPS);
  expect(e.length).toBeGreaterThan(50);
  for (const [k, v] of e) { expect(voll(k), k).toBe(true); expect(voll(v), k).toBe(true); }
});

it("GLOSSAR_M09_BEGRIFFE: nicht leer, ohne Dubletten, jeder mit Definition", () => {
  const m = glossar.GLOSSAR_M09_BEGRIFFE;
  expect(m.length).toBeGreaterThan(20);
  expect(new Set(m).size).toBe(m.length);
  for (const t of m) expect(voll(glossar.GLOSSAR_TIPS[t]), t).toBe(true);
});

it("ABKUERZUNGEN: genau vier Textfelder je Eintrag, Kuerzel eindeutig", () => {
  const a = abkuerzungen.ABKUERZUNGEN;
  expect(a.length).toBeGreaterThan(100);
  for (const x of a) {
    expect(Object.keys(x), x.kurz).toEqual(["kurz", "lang", "def", "kat"]);
    for (const w of Object.values(x)) expect(voll(w), x.kurz).toBe(true);
  }
  expect(new Set(a.map((x) => x.kurz)).size).toBe(a.length);
});

it("SPICKZETTEL ist zeichengleich mit 99_Spickzettel.md (tools/build_spick.py)", () => {
  const md = fs.readFileSync(path.join(WURZEL, "99_Spickzettel.md"), "utf8").split("\r\n").join("\n");
  expect(md.length).toBeGreaterThan(2000);
  expect(spickzettel.SPICKZETTEL).toBe(md);
});

it("Node laedt jede Datei nativ per require (E49)", () => {
  const dateien = Object.keys(MODULE).map((m) => path.join(hier, m + ".ts"));
  const skript = "for (const p of JSON.parse(process.argv[1])) console.log(Object.keys(require(p)).sort().join(','))";
  const r = spawnSync(process.execPath, ["-e", skript, JSON.stringify(dateien)], { encoding: "utf8" });
  expect(r.status, r.stderr).toBe(0);
  const soll = Object.values(MODULE).map((mod) => Object.keys(mod).sort().join(","));
  expect(r.stdout.trim().split("\n").map((z) => z.trim())).toEqual(soll);
});
