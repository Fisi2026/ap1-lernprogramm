#!/usr/bin/env node
/* tools/stryker_wert.js - Mutationswert aus Strykers JSON-Bericht (N43 M3, BUILD_LOG 303).
 *
 * ZWECK: Der Zeitplan-Job `.github/workflows/mutation.yml` braucht EINE Zahl und ein Urteil gegen die
 * Schwelle `thresholds.break` aus `neu/stryker.config.json` - ohne Strykers Textausgabe zu parsen.
 * Rechnung wie Stryker (mutation-testing-metrics): erkannt = Killed + Timeout, unerkannt = Survived +
 * NoCoverage; CompileError/RuntimeError sind ungueltig, Ignored und Pending zaehlen nicht.
 * Wert = erkannt / (erkannt + unerkannt) * 100.
 *
 * Aufruf:  node tools/stryker_wert.js <mutation.json> [--schwelle <zahl>]
 *            rc 0 Wert >= Schwelle (ohne Schwelle: Wert gelesen) · 1 Wert < Schwelle · 2 Lese-/Aufruffehler
 *            oder KEIN gueltiger Mutant (dann gibt es keinen Wert - nie gruen)
 *          node tools/stryker_wert.js --probe   Selbsttest an sechs Faellen mit bekannter Antwort
 */
"use strict";
const fs = require("node:fs");

/** @typedef {{ files: Record<string, { mutants: Array<{ status: string }> }> }} Bericht */
/** @typedef {{ wert: number | null, zahlen: Record<string, number> }} Ergebnis */

const ERKANNT = ["Killed", "Timeout"];
const UNERKANNT = ["Survived", "NoCoverage"];

/** @param {Bericht} bericht @returns {Ergebnis} */
function auswerten(bericht) {
  /** @type {Record<string, number>} */
  const zahlen = {};
  for (const datei of Object.values(bericht.files || {})) {
    for (const m of datei.mutants || []) zahlen[m.status] = (zahlen[m.status] || 0) + 1;
  }
  const summe = (/** @type {string[]} */ liste) => liste.reduce((s, k) => s + (zahlen[k] || 0), 0);
  const erkannt = summe(ERKANNT), gueltig = erkannt + summe(UNERKANNT);
  return { wert: gueltig ? (erkannt / gueltig) * 100 : null, zahlen };
}

/** @param {Ergebnis} e @param {number | null} schwelle @returns {number} rc */
function urteil(e, schwelle) {
  if (e.wert === null) return 2;
  return schwelle !== null && e.wert < schwelle ? 1 : 0;
}

/** @param {Record<string, number>} je Status -> Anzahl @returns {Bericht} */
function bericht(je) {
  /** @type {Array<{ status: string }>} */
  const mutants = [];
  for (const [status, n] of Object.entries(je)) for (let i = 0; i < n; i++) mutants.push({ status });
  return { files: { "src/a.ts": { mutants } } };
}

function probe() {
  /** @type {Array<[string, Record<string, number>, number | null, number | null, number]>} Name, Status, Schwelle, Wert, rc */
  const faelle = [
    ["alle getoetet", { Killed: 10 }, 88, 100, 0],
    ["Timeout zaehlt als erkannt", { Killed: 6, Timeout: 2, Survived: 2 }, 80, 80, 0],
    ["Ignored/CompileError zaehlen nicht", { Killed: 9, Survived: 1, Ignored: 50, CompileError: 7, RuntimeError: 1 }, 88, 90, 0],
    ["NoCoverage zaehlt als unerkannt - unter Schwelle ROT", { Killed: 8, NoCoverage: 2 }, 88, 80, 1],
    ["leer: kein gueltiger Mutant -> kein Wert, rc 2", { Ignored: 3 }, 88, null, 2],
    ["genau auf der Schwelle ist gruen", { Killed: 22, Survived: 3 }, 88, 88, 0],
  ];
  let ok = 0;
  for (const [name, je, schwelle, wert, rc] of faelle) {
    const e = auswerten(bericht(je));
    const r = urteil(e, schwelle);
    const gleich = (e.wert === null ? wert === null : wert !== null && Math.abs(e.wert - wert) < 1e-9) && r === rc;
    console.log(`${gleich ? "ok  " : "FALSCH"} ${name}: Wert ${e.wert === null ? "-" : e.wert.toFixed(2)} rc ${r} (erwartet ${wert ?? "-"} rc ${rc})`);
    if (gleich) ok++;
  }
  console.log(`[stryker_wert] Probe ${ok}/${faelle.length}`);
  return ok === faelle.length ? 0 : 1;
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--probe")) return probe();
  const i = args.indexOf("--schwelle");
  const schwelle = i >= 0 ? Number(args[i + 1]) : null;
  const datei = args.find((a, j) => !a.startsWith("--") && (i < 0 || j !== i + 1));
  if (!datei || (schwelle !== null && !Number.isFinite(schwelle))) {
    console.error("Aufruf: node tools/stryker_wert.js <mutation.json> [--schwelle <zahl>] | --probe");
    return 2;
  }
  /** @type {Bericht} */
  let b;
  try { b = JSON.parse(fs.readFileSync(datei, "utf8")); } catch (e) {
    console.error(`[stryker_wert] ${datei} nicht lesbar: ${e instanceof Error ? e.message : String(e)}`);
    return 2;
  }
  const e = auswerten(b);
  const rc = urteil(e, schwelle);
  const zahlen = Object.entries(e.zahlen).sort().map(([k, n]) => `${k} ${n}`).join(" · ");
  if (e.wert === null) console.log(`[stryker_wert] KEIN gueltiger Mutant (${zahlen || "leer"}) - kein Wert`);
  else console.log(`[stryker_wert] Mutationswert ${e.wert.toFixed(2)} %${schwelle !== null ? ` (Schwelle ${schwelle})` : ""} · ${zahlen}`);
  return rc;
}

process.exitCode = main();
