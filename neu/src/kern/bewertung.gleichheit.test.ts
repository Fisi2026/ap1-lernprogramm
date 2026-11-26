/* ============================================================================
   N34 T2 (E50, E52, 26.09.2026): GLEICHHEITSBEWEIS FUER `bewertung.ts` UND `zahlen.ts`
   Verglichen wird mit `L` aus `referenz/logik.js` (eingefroren, T0; die Wurzel-Fassung fiel mit
   N34 T6c, 27.09.2026).
   ⛔ Ueber den GANZEN Bestand: jede Frage (instanziiert, wie die Karte sie zeigt) mit der
      richtigen, der falschen, getippt-verbogenen (Gross/Klein, Satzzeichen, Umlaut, ein Zeichen
      weg) und KAPUTTEN Antworten (null, [], {}, Text, Zahl …). Auch WERFEN muss gleich sein.
   ⛔ Die Exportmenge ist fest aufgezaehlt (LEHREN B151: Anwesenheit ist nicht Menge).
   ⛔ Node laedt beide Dateien NATIV (E49) – eigener Prozess im letzten Block.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { altQuelle } from "../testhilfe/altquelle";
import { FRAGEN } from "@/daten/laden";
import type { Frage } from "@/daten/typen";
import { instanziiere } from "./instanz";
import { richtigeAntwort, falscheAntwort } from "./antwortform";
import * as bewertung from "./bewertung.ts";
import * as zahlen from "./zahlen.ts";
import { TYPEN } from "./tabellen/fragetypen.ts";

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, "../../..");
const req = createRequire(import.meta.url);
type Fn = (...a: unknown[]) => unknown;
type Lx = Record<string, unknown> & { TYP: Record<string, Record<string, unknown>>; TYPEN: string[] };
const QUELLEN: Array<[string, Lx]> = [
  ["referenz/logik.js", req(altQuelle(WURZEL, "logik.js")) as Lx],
];

const FUNKTIONEN = [
  "gradeMC", "normAntwort", "gradeLuecke", "distanzEins", "gradeLueckeTolerant", "gradeLueckentext",
  "gradeZuordnung", "gradeMehrfach", "gradeReihenfolge", "gradeDropdown", "dropdownAkzeptiert",
  "gradeDropdownText", "gradeHotspot", "gradeFehlersuche", "gradeRechenassistent", "gradeMatrix",
  "gradeBeschriftung", "gradeTrace", "normBefehl", "gradeKonsole", "gradeKalkulation", "gradeBaukasten",
  "gradeMtf", "mtfTreffer", "gradeSzenario2", "szenario2Treffer", "gradeKreuztabelle", "kreuztabelleTreffer",
  "grade", "gradeSim",
];
const ZAHLEN = ["rundeAuf", "runde2", "toleranzFuer", "zahlAusText"];

/** Ergebnis ODER Wurf – beides muss gleich sein. */
function lauf(fn: Fn, args: unknown[]): unknown {
  try { return { wert: fn(...args) }; } catch (e) { return { wirft: e instanceof Error ? e.constructor.name : "?" }; }
}

const FRAGEN_GESTELLT: Frage[] = FRAGEN.map((f) => instanziiere(f));
const KAPUTT: unknown[] = [null, undefined, 0, 1, -1, "", "x", [], [null], ["x"], [[]], {}, { 0: "a" }, { s1: 0 }, true, NaN];

/** Getippte Varianten eines Texts: die Toleranzen der Bewertung muessen gleich greifen. */
function tippVarianten(s: string): string[] {
  return [s.toUpperCase(), " " + s + ". ", s.replace(/ae/g, "ä").replace(/ue/g, "ü"), s.slice(1), s.slice(0, -1) + "x", s + s.slice(-1)];
}
/** Zahl-Varianten knapp ueber/unter jeder Toleranz, die `toleranzFuer` vergibt (0,01 / 0,05). */
function zahlVarianten(s: string): string[] {
  const x = Number(s.trim().replace(",", "."));
  if (s.trim() === "" || !Number.isFinite(x)) return [];
  return [0.009, 0.011, 0.02, 0.049, 0.051, -0.011].map((d) => String(Math.round((x + d) * 1000) / 1000).replace(".", ","));
}
function variantenFuer(f: Frage): unknown[] {
  const aus: unknown[] = [...KAPUTT];
  const r = richtigeAntwort(f);
  const fa = falscheAntwort(f);
  if (r) aus.push(r.wert);
  if (fa) aus.push(fa.wert);
  if (r && typeof r.wert === "string") aus.push(...tippVarianten(r.wert));
  if (r && Array.isArray(r.wert) && typeof r.wert[0] === "string") {
    for (const v of tippVarianten(r.wert[0])) aus.push([v, ...r.wert.slice(1)]);
  }
  if (r && Array.isArray(r.wert)) aus.push(r.wert.slice(1), [...r.wert, r.wert[0]], [...r.wert].reverse());
  if (r && typeof r.wert === "string") aus.push(...zahlVarianten(r.wert));
  if (r && Array.isArray(r.wert)) {
    r.wert.forEach((w, i) => {
      if (typeof w === "string") for (const v of zahlVarianten(w)) { const k = [...r.wert as unknown[]]; k[i] = v; aus.push(k); }
    });
  }
  return aus;
}

it("die Exportmenge ist genau die gepruefte Liste", () => {
  expect(Object.keys(bewertung).sort()).toEqual([...FUNKTIONEN, "BEWERTER", "TYP", "istAutomatischBewertbar"].sort());
  expect(Object.keys(zahlen).sort()).toEqual([...ZAHLEN].sort());
});

/* N34 T6b (27.09.2026): `istAutomatischBewertbar` zog aus `kern/logik.ts` hierher. L kennt sie nicht –
   verglichen wird deshalb mit ihrer Definition dort: `typeof L.TYP[t].grade === "function"`. */
it.each(QUELLEN)("istAutomatischBewertbar folgt L.TYP (%s)", (_name, L) => {
  const typen = Object.keys(L.TYP);
  expect(typen.length).toBeGreaterThan(20);
  const ja = typen.filter((t) => typeof L.TYP[t].grade === "function");
  expect(ja.length).toBeGreaterThan(0);
  expect(ja.length).toBeLessThan(typen.length);
  for (const t of typen) expect(bewertung.istAutomatischBewertbar(t), t).toBe(ja.includes(t));
  expect(bewertung.istAutomatischBewertbar("gibt-es-nicht")).toBe(false);
});

it("der Bestand ist da (ein leerer Pool waere ein leerer Beweis)", () => {
  expect(FRAGEN_GESTELLT.length).toBeGreaterThan(1000);
  expect(new Set(FRAGEN_GESTELLT.map((f) => f.typ)).size).toBeGreaterThan(18);
});

describe.each(QUELLEN)("gleich %s", (_name, L) => {
  it("jede Funktion hat ihr Gegenstueck in L", () => {
    for (const n of [...FUNKTIONEN, ...ZAHLEN]) expect(typeof L[n], n).toBe("function");
  });

  it("Registry: TYP hat Schluessel, Reihenfolge, Daten und Bewerter wie L.TYP", () => {
    expect(Object.keys(bewertung.TYP)).toEqual(L.TYPEN);
    expect(TYPEN).toEqual(L.TYPEN);
    for (const t of L.TYPEN) {
      const { grade, ...daten } = L.TYP[t]!;
      const k = bewertung.TYP[t]!;
      expect(Object.keys(k), t).toEqual(Object.keys(L.TYP[t]!));
      expect({ simAuto: k.simAuto, sek: k.sek, punkte: k.punkte }, t).toStrictEqual(daten);
      expect(k.grade === null, t).toBe(grade === null);
      /* derselbe Bewerter: L.TYP[t].grade ist L.grade<Name> – bei uns die gleichnamige Funktion */
      if (typeof grade === "function") {
        const name = Object.keys(L).find((n) => n.startsWith("grade") && L[n] === grade);
        expect(k.grade, t).toBe((bewertung as Record<string, unknown>)[name!]);
      }
    }
  });

  it("grade, gradeSim und der Typ-Bewerter: gleiches Urteil fuer JEDE Frage und JEDE Antwort", () => {
    let n = 0;
    const abweichung: string[] = [];
    for (const f of FRAGEN_GESTELLT) {
      for (const a of variantenFuer(f)) {
        for (const name of ["grade", "gradeSim"]) {
          const soll = lauf(L[name] as Fn, [f, a]);
          const ist = lauf((bewertung as unknown as Record<string, Fn>)[name]!, [f, a]);
          n++;
          if (JSON.stringify(soll) !== JSON.stringify(ist)) abweichung.push(`${f.id} ${name} ${JSON.stringify(a)}: ${JSON.stringify(soll)} ≠ ${JSON.stringify(ist)}`);
        }
      }
    }
    expect(abweichung.slice(0, 5)).toEqual([]);
    expect(n).toBeGreaterThan(40000);
  });

  /* N38 Q1 (30.09.2026): NACHWEIS „GLEICHES URTEIL“ FUER KAPUTTE FRAGEN. Die Umwandlungen in
     bewertung.ts behaupteten die Form der FRAGE (Luecken, Paare, Schritte, Zonen, Zellen); der Test
     oben variiert nur die Antwort. Hier wird je Typ eine Frage verdorben – ein Feld ganz und je
     Element – und mit richtiger, falscher und kaputter Antwort bewertet. Verglichen: Wert ODER Wurf.
     ⚠️ Die Fehlerklasse zaehlt hier nicht (seit BUILD_LOG 93 wirft `da` mit Klartext statt TypeError);
        das Urteil ist dasselbe: die Bewertung bricht ab. */
  it("kaputte FRAGEN: gleiches Urteil oder gleicher Abbruch wie L (je Typ, je Feld, je Element)", () => {
    const FELDER = ["luecken", "paare", "loesungIndizes", "schritte", "zonen", "fehlerZeile", "elemente", "ziele",
      "zeilen", "aufgaben", "aussagen", "schritt1", "schritt2", "loesung", "loesungIndex"];
    const urteil = (fn: Fn, args: unknown[]): unknown => {
      try { return { wert: fn(...args) }; } catch { return "wirft"; }
    };
    const proTyp = new Map<string, Frage>();
    for (const f of FRAGEN_GESTELLT) if (!proTyp.has(f.typ)) proTyp.set(f.typ, f);
    let n = 0;
    const abweichung: string[] = [];
    for (const f of proTyp.values()) {
      const antworten = [...KAPUTT, richtigeAntwort(f)?.wert, falscheAntwort(f)?.wert];
      const roh = f as unknown as Record<string, unknown>;
      const verdorben: Array<[string, unknown]> = [];
      for (const k of FELDER) {
        if (!(k in roh)) continue;
        for (const x of KAPUTT) verdorben.push([k + "=" + JSON.stringify(x), { ...roh, [k]: x }]);
        const v = roh[k];
        if (Array.isArray(v)) v.forEach((_, i) => {
          for (const x of KAPUTT) { const kopie = [...v]; kopie[i] = x; verdorben.push([`${k}[${i}]=${JSON.stringify(x)}`, { ...roh, [k]: kopie }]); }
        });
      }
      for (const [was, q] of verdorben) for (const a of antworten) for (const name of ["grade", "gradeSim"]) {
        n++;
        const soll = urteil(L[name] as Fn, [q, a]);
        const ist = urteil((bewertung as unknown as Record<string, Fn>)[name]!, [q, a]);
        if (JSON.stringify(soll) !== JSON.stringify(ist)) abweichung.push(`${f.typ} ${was} ${name} ${JSON.stringify(a)}: ${JSON.stringify(soll)} ≠ ${JSON.stringify(ist)}`);
      }
    }
    /* BEKANNT, NICHT aus N38: seit N37 U4 prueft `gradeTrace`/`gradeKalkulation` `Array.isArray(row)` –
       eine kaputte ZEILE ergibt „falsch“, wo L abbrach. Gemessen 30.09.: 461 solche Faelle, alle dieser Art;
       die N38-Fassung gegen die Fassung davor (4faffb4) ergab 0 Abweichungen. Alles andere muss gleich sein. */
    const bekannt = (s: string) => /^(trace|kalkulation) zeilen/.test(s) && s.endsWith('"wirft" ≠ {"wert":false}');
    expect(abweichung.filter((s) => !bekannt(s)).slice(0, 5)).toEqual([]);
    expect(abweichung.length).toBeGreaterThan(0);   // die bekannte Abweichung ist wirklich da (sonst Regel pruefen)
    expect(n).toBeGreaterThan(20000);
  });

  it("die Teilpunkte (…Treffer) und dropdownAkzeptiert: gleich fuer jede passende Frage", () => {
    const paar: Array<[string, string]> = [["mtf", "mtfTreffer"], ["szenario2", "szenario2Treffer"], ["kreuztabelle", "kreuztabelleTreffer"]];
    let n = 0;
    for (const [typ, fn] of paar) {
      for (const f of FRAGEN_GESTELLT.filter((x) => x.typ === typ)) {
        for (const a of variantenFuer(f)) {
          n++;
          expect(lauf((bewertung as unknown as Record<string, Fn>)[fn]!, [f, a]), `${f.id} ${fn}`).toEqual(lauf(L[fn] as Fn, [f, a]));
        }
      }
    }
    for (const f of FRAGEN_GESTELLT.filter((x) => x.typ === "dropdown")) {
      for (const l of f.luecken as unknown[]) {
        n++;
        expect(bewertung.dropdownAkzeptiert(l as never)).toEqual((L.dropdownAkzeptiert as Fn)(l));
        for (const e of ["", "x", ...tippVarianten(((l as { optionen: string[] }).optionen)[0])]) {
          expect(bewertung.gradeDropdownText({ luecken: [l] }, [e])).toBe((L.gradeDropdownText as Fn)({ luecken: [l] }, [e]));
        }
      }
    }
    expect(n).toBeGreaterThan(300);
  });

  it("Text- und Zahlen-Hilfen: gleich an Grenzfaellen", () => {
    const texte: unknown[] = ["", " ", "Unterstützungsprozesse", "Unterstuetzungsprozesse.", "1,50", "1.500", "3,0", "IP 192.168.0.1!",
      "Größe", "  a   b  ", null, undefined, 0, 12.0, "7,1", "Stufe 1", "ISO 9001", "ls -l | grep x", "cd  /  tmp", "3.000,50 €", "1 234", "-1.234.567", "abc", "12EUR", "1e3"];
    for (const t of texte) {
      expect(bewertung.normAntwort(t), String(t)).toBe((L.normAntwort as Fn)(t));
      expect(bewertung.normBefehl(t), String(t)).toBe((L.normBefehl as Fn)(t));
      expect(Object.is(zahlen.zahlAusText(t), (L.zahlAusText as Fn)(t)), String(t)).toBe(true);
    }
    const woerter = ["netzwerk", "netzwerke", "netzwerx", "etzwerk", "abc", "abd", "sez", "saz", "", "wartung", "warnung"];
    for (const a of woerter) for (const b of woerter) {
      expect(bewertung.distanzEins(a, b), a + "/" + b).toBe((L.distanzEins as Fn)(a, b));
      for (const g of ["gradeLuecke", "gradeLueckeTolerant"]) {
        expect(lauf((bewertung as unknown as Record<string, Fn>)[g]!, [[a], b]), g + a + b).toEqual(lauf(L[g] as Fn, [[a], b]));
      }
    }
    for (const d of [undefined, null, -1, 0, 1, 1.5, 2, 3, 6, 7, "2"]) {
      expect(zahlen.toleranzFuer(d), String(d)).toBe((L.toleranzFuer as Fn)(d));
      for (const x of [1.005, -1.005, 2e12, 0.125, "3,5", NaN, Infinity, 12.345]) {
        expect(Object.is(zahlen.rundeAuf(x, d), (L.rundeAuf as Fn)(x, d)), `${x} ${d}`).toBe(true);
        expect(Object.is(zahlen.runde2(x), (L.runde2 as Fn)(x)), String(x)).toBe(true);
      }
    }
  });
});

it("Node laedt beide Dateien nativ per require (E49)", () => {
  const dateien = ["bewertung.ts", "zahlen.ts"].map((d) => path.join(hier, d));
  const skript = "for (const p of JSON.parse(process.argv[1])) console.log(Object.keys(require(p)).sort().join(','))";
  const r = spawnSync(process.execPath, ["-e", skript, JSON.stringify(dateien)], { encoding: "utf8" });
  expect(r.status, r.stderr).toBe(0);
  expect(r.stdout.trim().split(/\r?\n/)).toEqual([Object.keys(bewertung).sort().join(","), Object.keys(zahlen).sort().join(",")]);
});
