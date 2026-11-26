/* ============================================================================
   N34 T4 (E50, E55, 26.09.2026): GLEICHHEITSBEWEIS FUER `pruefung.ts`
   Gegen `L` aus `referenz/logik.js` (eingefroren).
   ⛔ Zufall wird GESEEDET: beide Seiten bekommen je Fall einen frischen, gleichen Generator; nach
      dem Aufruf wird der NAECHSTE Wert verglichen – gleiche Ziehung heisst gleich viele Zufallszahlen
      verbraucht. `baueAP1Pruefung` instanziiert OHNE rng (Math.random) – auch Math.random wird
      deshalb je Seite gleich geseedet und danach verglichen.
   ⛔ Mutation zaehlt mit: der Bauer ist REIN, Pool, Faelle und Gedaechtnis bleiben unberuehrt.
   ⛔ Exportmenge fest (LEHREN B151); Node laedt die Datei nativ (E49).
   ============================================================================ */
import { describe, it, expect, vi, afterEach } from "vitest";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { altQuelle } from "../testhilfe/altquelle";
import { FRAGEN } from "@/daten/laden";
import { FAELLE } from "@/daten/faelle";
import * as pruefung from "./pruefung.ts";

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, "../../..");
const req = createRequire(import.meta.url);
type Fn = (...a: unknown[]) => unknown;
type Lx = Record<string, Fn>;
const QUELLEN: Array<[string, Lx]> = [
  ["referenz/logik.js", req(altQuelle(WURZEL, "logik.js")) as Lx],
];
const NAMEN = ["wuerfelPunkte", "note", "metaFuer", "aufgabeVon", "simBewertbar", "fallFuerSim", "istFallTeil",
  "baueAP1Pruefung", "simErgebnis"];

function seed(s: number): () => number {
  let a = s >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const klon = <T,>(x: T): T => (x === undefined ? x : JSON.parse(JSON.stringify(x)) as T);
const K = pruefung as unknown as Record<string, Fn>;
type Q = Record<string, unknown>;

/** Ruft fn mit geseedetem rng UND geseedetem Math.random; liefert Ergebnis + die je naechste Zahl. */
function mitZufall(s: number, fn: (rng: () => number) => unknown): unknown[] {
  const rng = seed(s);
  const mr = seed(s + 7919);
  const spion = vi.spyOn(Math, "random").mockImplementation(mr);
  try {
    const erg = fn(rng);
    return [klon(erg), rng(), Math.random()];
  } finally { spion.mockRestore(); }
}
afterEach(() => { vi.restoreAllMocks(); });

/* Gebaute Faelle fuer Wege, die der Bestand nicht (sicher) nimmt – je Fall steht der Weg dabei. */
const GEBAUT: Q[] = [
  { id: "x1", typ: "bild" },                                  // bild ohne unterTyp -> "mc"
  { id: "x2", typ: "bild", unterTyp: "freitext" },            // bild, unterTyp nicht simAuto
  { id: "x3", typ: "mc", modul: "M04", thema: "Subnetting" }, // M04-Netz
  { id: "x4", typ: "mc", modul: "M04", thema: "UML" },        // M04-Software
  { id: "x5", typ: "mc", modul: "M99" },                      // ohne Zuordnung -> Aufgabe 4
  { id: "x6", typ: "freitext", sek: 0, punkte: -1 },          // Overrides ungueltig
  { id: "x7", typ: "mc", sek: 17, punkte: 3 },                // Overrides gueltig
  { id: "x12", typ: "mc", punkte: 0 },                        // punkte 0 -> Vorgabe (Sabotage 26.09.: >= 0 blieb sonst gruen)
  { id: "x8", typ: "unbekannt", sek: "30" },                  // unbekannter Typ, sek als Text
  { id: "x9", fallTitel: "T" }, { id: "x10", fallSzenario: "S" }, { id: "x11", fallSzenario: 5 },
];

it("die Exportmenge ist genau die gepruefte Liste", () => {
  expect(Object.keys(pruefung).sort()).toEqual([...NAMEN].sort());
  expect(FRAGEN.length).toBeGreaterThan(1000);
  expect(FAELLE.length).toBeGreaterThan(0);
});

describe.each(QUELLEN)("gleich %s", (_name, L) => {
  it("jede Funktion hat ihr Gegenstueck in L", () => {
    for (const n of NAMEN) expect(typeof L[n], n).toBe("function");
  });

  it("wuerfelPunkte: 2000 Vorgaben, auch unerfuellbare – gleiche Werte, gleicher Zufallsverbrauch", () => {
    for (let s = 1; s <= 2000; s++) {
      const n = s % 7, min = (s % 5) * 5, max = min + (s % 13), summe = (s % 3 === 0) ? n * max + (s % 4) : 100;
      expect(mitZufall(s, (r) => K.wuerfelPunkte!(n, min, max, summe, r)), "s=" + s)
        .toEqual(mitZufall(s, (r) => L.wuerfelPunkte!(n, min, max, summe, r)));
    }
    expect(mitZufall(3, () => K.wuerfelPunkte!(4, 20, 30, 100))).toEqual(mitZufall(3, () => L.wuerfelPunkte!(4, 20, 30, 100)));
  });

  it("note: -10 bis 110 in Zehnteln und Sonderwerte", () => {
    const werte: unknown[] = [NaN, Infinity, -Infinity, "abc", "50", "", null, undefined, true, [], {}, 49.99, 91.99, 92];
    for (let p = -100; p <= 1100; p++) werte.push(p / 10);
    for (const w of werte) expect(K.note!(w), String(w)).toEqual(L.note!(w));
  });

  it("metaFuer, aufgabeVon, simBewertbar, istFallTeil: jede Frage und die gebauten Faelle", () => {
    const alle: Q[] = [...(FRAGEN as unknown as Q[]), ...GEBAUT];
    for (const f of alle) {
      const id = String(f.id);
      expect(K.metaFuer!(f), id).toEqual(L.metaFuer!(f));
      expect(K.aufgabeVon!(f), id).toBe(L.aufgabeVon!(f));
      expect(K.simBewertbar!(f), id).toBe(L.simBewertbar!(f));
      expect(K.istFallTeil!(f), id).toBe(L.istFallTeil!(f));
    }
    for (const x of [null, undefined]) {
      expect(K.metaFuer!(x)).toEqual(L.metaFuer!(x));
      expect(K.istFallTeil!(x)).toBe(L.istFallTeil!(x));
    }
    // Der Bestand muss die Wege wirklich nehmen, die hier gleich sein sollen:
    expect(alle.filter((f) => K.simBewertbar!(f)).length).toBeGreaterThan(500);
    expect(new Set(alle.map((f) => K.aufgabeVon!(f)))).toEqual(new Set([0, 1, 2, 3]));
  });

  it("fallFuerSim: 600 Samen × Gedaechtnis, dazu leere, kaputte und untaugliche Faelle", () => {
    const faelle = FAELLE as unknown as Q[];
    const kaputt: unknown[] = [
      [], null, "x", [{ titel: "ohne id und Teile" }],
      [{ id: "nurFrei", teilaufgaben: [{ typ: "freitext", frage: "?" }] }],        // nichts simBewertbar -> null
      [{ modul: "M03", thema: "T", titel: "t", szenario: "s", teilaufgaben: [{ typ: "mc", frage: "?" }, { typ: "mc", schwierigkeit: 1 }] }],
    ];
    for (let s = 1; s <= 600; s++) {
      const vermeide: Record<string, number> = {};
      faelle.forEach((f, i) => { if ((s >> (i % 8)) & 1) vermeide["FALL:" + String(f.id)] = 1; });
      if (s % 50 === 0) faelle.forEach((f) => { vermeide["FALL:" + String(f.id)] = 1; });   // alle benutzt -> Rueckfall auf die ganze Liste
      expect(mitZufall(s, (r) => K.fallFuerSim!(faelle, vermeide, r)), "s=" + s)
        .toEqual(mitZufall(s, (r) => L.fallFuerSim!(faelle, vermeide, r)));
    }
    kaputt.forEach((k, i) => expect(mitZufall(i, (r) => K.fallFuerSim!(k, {}, r)), "kaputt " + i)
      .toEqual(mitZufall(i, (r) => L.fallFuerSim!(k, {}, r))));
  });

  it("baueAP1Pruefung: 400 Laeufe – Anzahl, Punkte, Gedaechtnis ueber Laeufe, Faelle; rein", () => {
    const pool = FRAGEN as unknown as Q[];
    const vorher = JSON.stringify([pool.length, FAELLE]);
    let gedK: string[] = [], gedL: string[] = [];
    let resets = 0;
    for (let s = 1; s <= 400; s++) {
      const anzahl = [undefined, 0, 10, 40, 80][s % 5];
      const punkte = s % 4 === 0 ? undefined : s % 4 === 1 ? [25, 25, 26] : (K.wuerfelPunkte!(4, 20, 30, 100, seed(s)) as number[]);
      const faelle = s % 6 === 0 ? [] : FAELLE;
      const teil = s % 9 === 0 ? pool.filter((f) => f.modul === "M03" || f.modul === "M04") : pool;
      const opt = (ged: string[], r: () => number) => ({ pool: teil, faelle, benutzt: ged, anzahl, punkte, rng: r });
      const k = mitZufall(s, (r) => K.baueAP1Pruefung!(opt(gedK, r))) as [{ benutzt: string[] }, number, number];
      const l = mitZufall(s, (r) => L.baueAP1Pruefung!(opt(gedL, r))) as [{ benutzt: string[] }, number, number];
      expect(k, "s=" + s).toEqual(l);
      if (k[0].benutzt.length < gedK.length) resets++;
      gedK = k[0].benutzt; gedL = l[0].benutzt;
    }
    expect(resets, "das 70-%-Zuruecksetzen muss vorkommen").toBeGreaterThan(0);
    expect(JSON.stringify([pool.length, FAELLE])).toBe(vorher);
    expect(mitZufall(1, () => K.baueAP1Pruefung!({}))).toEqual(mitZufall(1, () => L.baueAP1Pruefung!({})));
  });

  /* ⚠️ Was der BESTAND nicht erreicht, wird an gebauten Faellen gemessen – und der Test sagt es (PLAN_NEUBAU §4 Regel 4).
     Gefunden per Sabotage (26.09.): M09-Ausschluss, Instanziierung, die 70-%-Grenze und die Mindestzahl 3 im
     Fall-Block blieben mit dem Bestand allein gruen. */
  it("gebaute Pruefungen fuer die Wege, die der Bestand nicht nimmt", () => {
    const pool = FRAGEN as unknown as Q[];
    const sim = pool.filter((f) => K.simBewertbar!(f));
    expect(sim.filter((f) => f.variablen || f.varianten).length, "Bestand: sim-bewertbar UND veraenderlich").toBe(0);
    expect(pool.filter((f) => f.modul === "M09").length, "Bestand: M09").toBe(0);
    const extra: Q[] = sim.slice(0, 40).map((f, i) => Object.assign({}, f, { id: "G" + i },
      i % 2 ? { varianten: [{ frage: "Variante A" }, { frage: "Variante B" }, { frage: "Variante C" }] } : { modul: "M09" }));
    const einTeil = [{ id: "EIN", modul: "M03", thema: "T", titel: "t", szenario: "s", teilaufgaben: [{ typ: "mc", frage: "?" }] }];
    for (let s = 1; s <= 60; s++) {
      const opt = (r: () => number) => ({ pool: pool.concat(extra), faelle: einTeil, anzahl: s % 2 ? 5 : 40, rng: r });
      expect(mitZufall(s, (r) => K.baueAP1Pruefung!(opt(r))), "s=" + s).toEqual(mitZufall(s, (r) => L.baueAP1Pruefung!(opt(r))));
    }
    // 70-%-Grenze: Schritte von ~80 laufen sicher durch das Fenster 0,7..0,8 des Bestands
    let gK: string[] = [], gL: string[] = [], resets = 0;
    for (let s = 1; s <= 40; s++) {
      const opt = (ged: string[], r: () => number) => ({ pool, faelle: FAELLE, benutzt: ged, anzahl: 80, rng: r });
      const k = mitZufall(s, (r) => K.baueAP1Pruefung!(opt(gK, r))) as [{ benutzt: string[] }];
      const l = mitZufall(s, (r) => L.baueAP1Pruefung!(opt(gL, r))) as [{ benutzt: string[] }];
      expect(k, "Kette s=" + s).toEqual(l);
      if (k[0].benutzt.length < gK.length) resets++;
      gK = k[0].benutzt; gL = l[0].benutzt;
    }
    expect(resets).toBeGreaterThan(0);
  });

  it("simErgebnis: 500 zufaellige Auswertungen, leer, kurze und nicht-boolsche korrekt-Listen", () => {
    const pool = FRAGEN as unknown as Q[];
    for (let s = 1; s <= 500; s++) {
      const r = seed(s);
      const fr = pool.slice(s, s + (s % 60));
      const ko = fr.map(() => [true, false, 1, 0, "", "ja", null][Math.floor(r() * 7)]);
      if (s % 10 === 0) ko.length = Math.floor(ko.length / 2);
      expect(K.simErgebnis!(fr, ko), "s=" + s).toEqual(L.simErgebnis!(fr, ko));
    }
    expect(K.simErgebnis!([], [])).toEqual(L.simErgebnis!([], []));
  });
});

it("Node laedt die Datei nativ per require (E49)", () => {
  const skript = "console.log(Object.keys(require(process.argv[1])).sort().join(','))";
  const r = spawnSync(process.execPath, ["-e", skript, path.join(hier, "pruefung.ts")], { encoding: "utf8" });
  expect(r.status, r.stderr).toBe(0);
  expect(r.stdout.trim()).toBe(Object.keys(pruefung).sort().join(","));
});
