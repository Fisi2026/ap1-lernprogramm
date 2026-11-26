/* ============================================================================
   N34 T1 (E49, E50, 25.09.2026): GLEICHHEITSBEWEIS FUER DIE TABELLEN IN `kern/tabellen/`
   Verglichen wird jede exportierte Tabelle mit `L.<name>` aus `referenz/logik.js` –
   eingefroren (T0, Pruefsumme in `altquelle.test.ts`); die Wurzel-Fassung fiel mit N34 T6c.
   ⚠️ Gleich heisst: `toStrictEqual` UND gleiche Schluessel-Reihenfolge (JSON), und nicht leer –
      „beide leer" ist keine Gleichheit.
   ⛔ Die Exportmenge ist fest aufgezaehlt: eine neue Tabelle ohne Vergleich macht den Test rot
      (Anwesenheit pruefen heisst nicht Menge pruefen, LEHREN B151).
   ⛔ Node laedt jede Datei NATIV (E49) – der letzte Block startet dafuer einen eigenen Prozess.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { altQuelle } from "../../testhilfe/altquelle";
import * as konfig from "./konfig.ts";
import * as gebiete from "./gebiete.ts";
import * as noten from "./noten.ts";
import * as fragetypen from "./fragetypen.ts";
import * as pruefung from "./pruefung.ts";
import * as szenarien from "./szenarien.ts";

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, "../../../..");
const req = createRequire(import.meta.url);
type Lx = Record<string, unknown> & { TYP: Record<string, Record<string, unknown>>; TYPEN: string[] };
const QUELLEN: Array<[string, Lx]> = [
  ["referenz/logik.js", req(altQuelle(WURZEL, "logik.js")) as Lx],
];

const MODULE: Record<string, Record<string, unknown>> = { konfig, gebiete, noten, fragetypen, pruefung, szenarien };
const LISTE = [
  "konfig.CONFIG", "konfig.RECHEN_TOLERANZ", "konfig.TIPP_MINLAENGE", "konfig.LEVEL_MIN", "konfig.LEVEL_MAX", "konfig.TAG_MS",
  "gebiete.THEMA_RELEVANZ", "gebiete.M09_THEMEN", "gebiete.GEBIETE", "gebiete.THEMA_GEBIET",
  "noten.NOTEN_SCHLUESSEL", "noten.NOTE_BESTANDEN_AB", "noten.BEREITSCHAFT_AMPEL",
  "fragetypen.TYP_DATEN", "fragetypen.TYP_META_DEFAULT", "fragetypen.TYPEN", "fragetypen.SIM_TYPEN", "fragetypen.TYP_META",
  "pruefung.AP1_AUFGABEN", "pruefung.M04_NETZ",
  "szenarien.NETZPLAN_SZENARIEN", "szenarien.GANTT_SZENARIEN", "szenarien.ZAHLENSYSTEME",
];
/* E60 „je Fall“ – bewusste Abweichung zur alten App (K2, 14.10.2026, PLAN_KLAUSUR2 K2-E9/E10, BUILD_LOG 183):
   drei AP2-Themen der Klausurvorbereitung sind NEU in THEMA_RELEVANZ und THEMA_GEBIET. Verglichen wird die Tabelle
   OHNE genau diese Schluessel (Rest unveraendert, gleiche Reihenfolge); dass sie da sind und die alte App sie nicht
   kennt, prueft der eigene Test unten. */
const NEU_K2: Record<string, Record<string, unknown>> = {
  THEMA_RELEVANZ: { "RAID-Systeme": 1, "IDS/IPS": 1, "Netzwerktopologien": 1 },
  THEMA_GEBIET: { "M06|RAID-Systeme": "B2", "M06|IDS/IPS": "B2", "M03|Netzwerktopologien": "B2", "M04|Netzwerktopologien": "B2" },
};
function ohneK2(n: string, w: unknown): unknown {
  const neu = NEU_K2[n];
  if (!neu) return w;
  return Object.fromEntries(Object.entries(w as Record<string, unknown>).filter(([k]) => !(k in neu)));
}

const ALLE = Object.entries(MODULE).flatMap(([m, mod]) => Object.keys(mod).map((n) => [m, n, mod[n]] as const));

function nichtLeer(w: unknown): boolean {
  if (Array.isArray(w)) return w.length > 0;
  if (typeof w === "number") return Number.isFinite(w) && w > 0;
  if (w && typeof w === "object") return Object.keys(w).length > 0;
  return false;
}

it("die Exportmenge ist genau die gepruefte Liste (23)", () => {
  expect(ALLE.map(([m, n]) => m + "." + n).sort()).toEqual([...LISTE].sort());
});

describe.each(QUELLEN)("gleich %s", (_name, L) => {
  it.each(ALLE.filter(([, n]) => n !== "TYP_DATEN").map(([m, n, w]) => [m + "." + n, n, w] as const))(
    "%s", (_k, n, wert) => {
      expect(nichtLeer(L[n])).toBe(true);
      expect(ohneK2(n, wert)).toStrictEqual(L[n]);
      expect(JSON.stringify(ohneK2(n, wert))).toBe(JSON.stringify(L[n]));
    });

  it.each(Object.keys(NEU_K2))("K2-Abweichung %s: genau die neuen Schluessel, der alten App unbekannt", (n) => {
    const wert = (n === "THEMA_RELEVANZ" ? gebiete.THEMA_RELEVANZ : gebiete.THEMA_GEBIET) as Record<string, unknown>;
    const alt = L[n] as Record<string, unknown>;
    for (const [k, v] of Object.entries(NEU_K2[n])) {
      expect(wert[k]).toBe(v);
      expect(k in alt).toBe(false);
    }
    expect(Object.keys(wert).length).toBe(Object.keys(alt).length + Object.keys(NEU_K2[n]).length);
  });

  it("TYP_DATEN = L.TYP ohne grade, gleiche Reihenfolge", () => {
    expect(Object.keys(fragetypen.TYP_DATEN)).toEqual(L.TYPEN);
    expect(L.TYPEN.length).toBeGreaterThan(20);
    for (const t of L.TYPEN) {
      const { grade, ...daten } = L.TYP[t];
      expect(Object.keys(L.TYP[t]).sort()).toEqual(["grade", "punkte", "sek", "simAuto"]);
      expect(grade === null || typeof grade === "function").toBe(true);
      expect(fragetypen.TYP_DATEN[t]).toStrictEqual(daten);
    }
  });
});

it("Node laedt jede Tabelle nativ per require (E49)", () => {
  const dateien = Object.keys(MODULE).map((m) => path.join(hier, m + ".ts"));
  const skript = "for (const p of JSON.parse(process.argv[1])) console.log(Object.keys(require(p)).sort().join(','))";
  const r = spawnSync(process.execPath, ["-e", skript, JSON.stringify(dateien)], { encoding: "utf8" });
  expect(r.status, r.stderr).toBe(0);
  const soll = Object.values(MODULE).map((mod) => Object.keys(mod).sort().join(","));
  expect(r.stdout.trim().split(/\r?\n/)).toEqual(soll);
});
