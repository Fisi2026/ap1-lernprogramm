/* ============================================================================
   N34 T5 (E50, 26.09.2026): GLEICHHEITSBEWEIS FUER `rechenaufgabe.ts` UND `generatoren.ts`
   Gegen `L` aus `referenz/logik.js` (eingefroren).
   ⛔ Zufall wird GESEEDET: beide Seiten bekommen je Fall einen frischen, gleichen Generator; nach
      dem Aufruf wird der NAECHSTE Wert beider Generatoren verglichen – gleiche Ziehung heisst
      gleich viele Zufallszahlen verbraucht, nicht nur gleiches Ergebnis.
   ⛔ Fehler zaehlen mit: wirft die eine Seite, muss die andere mit DERSELBEN Meldung werfen.
   ⛔ Mutation zaehlt mit: `netzplanBerechne` schreibt in seine Eingabe, `instanziiere` darf es nie.
   ⛔ Exportmenge fest (LEHREN B151); Node laedt beide Dateien nativ (E49).
   ============================================================================ */
import { describe, it, expect } from "vitest";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { altQuelle } from "../testhilfe/altquelle";
import { FRAGEN } from "@/daten/laden";
import * as rechen from "./rechenaufgabe.ts";
import * as gen from "./generatoren.ts";

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, "../../..");
const req = createRequire(import.meta.url);
type Fn = (...a: unknown[]) => unknown;
type Lx = Record<string, Fn> & { GENERATOREN: Record<string, Record<string, unknown>> };
const QUELLEN: Array<[string, Lx]> = [
  ["referenz/logik.js", req(altQuelle(WURZEL, "logik.js")) as Lx],
];
const RECHEN = ["FORMEL_TOKEN", "evalFormel", "zieheWert", "tausender", "formatZahl", "fuelleText", "rechneAufgabe", "loesungsSchreibweisen", "instanziiere"];
const GEN = ["genUebertragung", "genRaid", "genSubnetting", "netzplanBerechne", "genNetzplan", "ganttBerechne", "genGantt", "zahlNach",
  "genZahlensysteme", "genDatenmengen", "GENERATOREN"];
const GEN_FN = ["genUebertragung", "genRaid", "genSubnetting", "genNetzplan", "genGantt", "genZahlensysteme", "genDatenmengen"];
/** K3 (24.11.2026): Exporte, die es nur in der neuen App gibt – ohne Gegenstueck in logik.js (eigene Tests in generatoren.k3.test.ts). */
const NEU_K3 = ["genRaidK3", "genUsv", "genDhcpBereich", "genNetzteil", "RAID_K3", "NETZTEIL_GROESSEN", "K3_ARTEN"];

function seed(s: number): () => number {
  let a = s >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const klon = <T,>(x: T): T => (x === undefined ? x : JSON.parse(JSON.stringify(x)) as T);
/** Ergebnis ODER Fehlermeldung – damit „wirft gleich" mitverglichen wird. */
function lauf(f: () => unknown): unknown {
  try { return { ok: f() }; } catch (e) { return { wirft: (e as Error).constructor.name + ": " + (e as Error).message }; }
}
const R = rechen as unknown as Record<string, Fn>;
const G = gen as unknown as Record<string, Fn>;
const MIT_FORMEL = FRAGEN.filter((f) => Array.isArray((f as { schritte?: unknown }).schritte));
const VERAENDERLICH = FRAGEN.filter((f) => (f as { variablen?: unknown }).variablen || (f as { varianten?: unknown }).varianten);
const FORMELN = [...new Set(MIT_FORMEL.flatMap((f) => ((f as unknown as { schritte: Array<{ formel?: unknown }> }).schritte).map((s) => s.formel)).filter((x) => typeof x === "string"))] as string[];
const ZAHLEN = [0, -0, 1, -1, 0.5, 1.005, -1.005, 2.675, 999, 1000, 9999, 10000, -12345.678, 123456789.125, 1e-7, 2e12, 0.1 + 0.2, NaN, Infinity, "3,5", "12", null, undefined];
const DEZ = [undefined, 0, 1, 2, 3, 6, 7, 2.7, "2", -1, null];

it("die Exportmenge ist genau die gepruefte Liste", () => {
  expect(Object.keys(rechen).sort()).toEqual([...RECHEN].sort());
  expect(Object.keys(gen).sort()).toEqual([...GEN, ...NEU_K3].sort());
  expect(MIT_FORMEL.length).toBeGreaterThan(20);
  expect(VERAENDERLICH.length).toBeGreaterThan(20);
  expect(FORMELN.length).toBeGreaterThan(40);
});

describe.each(QUELLEN)("gleich %s", (_name, L) => {
  it("jede Funktion hat ihr Gegenstueck in L, FORMEL_TOKEN ist dieselbe Regex", () => {
    for (const n of [...RECHEN, ...GEN]) expect(L[n], n).toBeDefined();
    expect(String(rechen.FORMEL_TOKEN)).toBe(String(L.FORMEL_TOKEN));
  });

  it("evalFormel: jede Pool-Formel mit gewuerfelten Werten und die Grenzfaelle – Wert oder Meldung gleich", () => {
    let n = 0;
    FORMELN.forEach((formel, fi) => {
      const namen = formel.match(/[A-Za-z_][A-Za-z_0-9]*/g) ?? [];
      for (let s = 0; s < 25; s++) {
        const z = seed(fi * 100 + s), w: Record<string, unknown> = {};
        for (const k of namen) w[k] = s % 9 === 0 ? 0 : Math.round(z() * 2000 - 200) / (s % 3 ? 1 : 10);
        if (s === 24) delete w[namen[0] ?? "x"];
        expect(lauf(() => R.evalFormel!(formel, w)), formel).toEqual(lauf(() => L.evalFormel!(formel, w))); n++;
      }
    });
    const rand = ["", " ", "1+2*3", "(1+2)*3", "-(-2)", "+3", "2**3", "1/0", "1/(2-2)", "a", "1 2", "1+", "(1", ")", "3.5.2", "1e3", "x_1*2", "1 $ 2", "s1+s2",
      "constructor", "__proto__", "toString", "a/b", "--a", "-+-a", "1-2-3", "8/2/2", "2*(3+4)*a", null, undefined, 42];
    const werte = [{ a: 1, b: 4 }, {}, null, undefined, { x_1: 2, s1: 1, s2: 2.5 }, { a: "1" }, { a: Infinity }, { a: 0, b: 0 }, { a: NaN }];
    for (const f of rand) for (const w of werte) { expect(lauf(() => R.evalFormel!(f, w)), String(f)).toEqual(lauf(() => L.evalFormel!(f, w))); n++; }
    expect(n).toBeGreaterThan(1500);
  });

  it("zieheWert: 3000 Definitionen, gleiche Ziehung, gleicher Verbrauch", () => {
    const roh = [0, 1, 2.5, -3, 10, 0.01, 0.5, "4", "x", null, undefined, 100, 7];
    for (let s = 1; s <= 3000; s++) {
      const z = seed(s), pickRoh = () => roh[Math.floor(z() * roh.length)];
      const def: Record<string, unknown> = { min: pickRoh(), max: s % 2 ? pickRoh() : 1000, schritt: s % 5 ? pickRoh() : undefined };
      const a = seed(s * 7), b = seed(s * 7);
      expect(lauf(() => R.zieheWert!(def, a)), JSON.stringify(def)).toEqual(lauf(() => L.zieheWert!(def, b)));
      expect(a()).toBe(b());
    }
  });

  it("tausender, formatZahl, loesungsSchreibweisen: jede Zahl x jede Dezimalvorgabe", () => {
    for (const v of ZAHLEN) for (const d of DEZ) {
      expect(lauf(() => R.formatZahl!(v, d)), v + "|" + d).toEqual(lauf(() => L.formatZahl!(v, d)));
      expect(lauf(() => R.loesungsSchreibweisen!(v, d)), v + "|" + d).toEqual(lauf(() => L.loesungsSchreibweisen!(v, d)));
    }
    for (const t of ["0", "-1", "123", "1234", "12345", "-123456,78", "1000000,5", "", "-", "12,3,4"]) expect(R.tausender!(t)).toBe(L.tausender!(t));
  });

  it("fuelleText: jeder Text der veraenderlichen Fragen und die Grenzfaelle", () => {
    const texte: unknown[] = ["{a|2}", "{a|x}", "{}", "{ a }", "{{a}}", "{a/0}", "{abstract}", "{static, final}", "{a|0} {a|-1} {a|9}", "{b*1000|1} EUR", null, undefined, 5];
    for (const f of VERAENDERLICH as unknown as Array<Record<string, unknown>>) {
      texte.push(f.frage, f.erklaerungLang, f.erklaerungKurz);
      if (Array.isArray(f.schritte)) for (const s of f.schritte as Array<{ text?: unknown }>) texte.push(s.text);
    }
    const werteListe: unknown[] = [{ a: 1234.5, b: 7 }, {}, null];
    VERAENDERLICH.forEach((f, i) => { const r = lauf(() => L.rechneAufgabe!(f, seed(i + 1))) as { ok?: { werte: unknown } }; if (r.ok) werteListe.push(r.ok.werte); });
    for (const t of texte) for (const w of werteListe) expect(R.fuelleText!(t, w), String(t)).toBe(L.fuelleText!(t, w));
  });

  it("rechneAufgabe und instanziiere: jede Frage, veraenderliche mit 60 Samen – Ergebnis, Verbrauch, keine Mutation", () => {
    const faelle: Array<[unknown, number]> = [];
    for (const f of FRAGEN) for (let s = 1; s <= 2; s++) faelle.push([f, s]);
    for (const f of VERAENDERLICH) for (let s = 3; s <= 62; s++) faelle.push([f, s]);
    const kaputt = { id: "X", typ: "rechenassistent", frage: "{a}", variablen: { a: { min: 1, max: 3 } }, schritte: [{ text: "t", formel: "1/(a-a)" }] };
    /* variablen UND varianten zugleich (heute kein Pool-Fall, gemessen): die Varianten muessen weg sein. */
    const beides = { id: "Y", frage: "{a}", variablen: { a: { min: 1, max: 9 } }, schritte: [{ text: "{a}", formel: "a*2" }], varianten: [{ frage: "v" }] };
    for (let s = 1; s <= 20; s++) faelle.push([kaputt, s], [beides, s], [{ varianten: [{ frage: "v1" }, { frage: "v2", x: 1 }], frage: "f" }, s], [{ varianten: [] }, s]);
    for (const [f, s] of faelle) {
      const vorher = klon(f), a = seed(s), b = seed(s);
      const ist = R.instanziiere!(f, a), soll = L.instanziiere!(f, b);
      expect(ist, (f as { id?: string }).id + "#" + s).toEqual(soll);
      expect(a()).toBe(b());
      expect(ist).not.toBe(f);
      expect(klon(f)).toEqual(vorher);
      if (Array.isArray((f as { schritte?: unknown }).schritte) && (f as { variablen?: unknown }).variablen) {
        const c = seed(s + 1000), d = seed(s + 1000);
        expect(lauf(() => R.rechneAufgabe!(f, c))).toEqual(lauf(() => L.rechneAufgabe!(f, d)));
        expect(c()).toBe(d());
      }
    }
    for (const leer of [null, undefined, 0, "", false]) expect(R.instanziiere!(leer)).toBe(L.instanziiere!(leer));
  });

  it.each(GEN_FN)("%s: 1500 Samen – gleiche Aufgabe, gleicher Verbrauch", (n) => {
    for (let s = 1; s <= 1500; s++) {
      const a = seed(s), b = seed(s);
      expect(G[n]!(a), n + "#" + s).toEqual(L[n]!(b));
      expect(a()).toBe(b());
    }
    expect(typeof (G[n]!() as { typ: string }).typ).toBe("string");   /* ohne Zufall: Math.random, laeuft */
  });

  it("genNetzplan: Wiederholung bei lauter kritischen Vorgaengen – bis zur Grenze von 50 Versuchen", () => {
    /* Ein gleichbleibender Zufall macht A..F gleich lang: alles kritisch, kein Puffer -> neuer Versuch.
       Erst nach `k` Zahlen wird gewuerfelt. k = 6*60 ueberschreitet die Grenze (Rueckfall auf Vorgang A). */
    const gezinkt = (k: number, s: number) => { const z = seed(s); let i = 0; return () => (i++ < k ? 0.5 : z()); };
    for (const k of [6, 6 * 7, 6 * 20, 6 * 49, 6 * 51, 6 * 60]) for (let s = 1; s <= 5; s++) {
      const a = gezinkt(k, s), b = gezinkt(k, s);
      expect(G.genNetzplan!(a), "k=" + k + "#" + s).toEqual(L.genNetzplan!(b));
      expect(a()).toBe(b());
    }
  });

  it("netzplanBerechne und ganttBerechne: 600 zufaellige Plaene, Ergebnis UND beschriebene Eingabe gleich", () => {
    for (let s = 1; s <= 600; s++) {
      const z = seed(s), n = 1 + Math.floor(z() * 8), ids = "ABCDEFGH".slice(0, n).split("");
      const plan = ids.map((id, i) => ({ id, name: "V" + id, dauer: s % 50 === 0 ? 0 : 1 + Math.floor(z() * 9),
        vorgaenger: ids.slice(0, i).filter(() => z() < 0.4) }));
      if (s % 3 === 0) plan.reverse();                 /* Eingabe nicht topologisch sortiert */
      if (s % 97 === 0 && n > 1) plan[0]!.vorgaenger = [plan[plan.length - 1]!.id];   /* Zyklus: der Waechter bricht ab */
      const pk = klon(plan), pl = klon(plan);
      expect(lauf(() => G.netzplanBerechne!(pk)), "netz " + s).toEqual(lauf(() => L.netzplanBerechne!(pl)));
      expect(pk, "netz-Eingabe " + s).toEqual(pl);
      const gk = klon(plan), gl = klon(plan);
      expect(lauf(() => G.ganttBerechne!(gk)), "gantt " + s).toEqual(lauf(() => L.ganttBerechne!(gl)));
      expect(gk, "gantt-Eingabe " + s).toEqual(plan);   /* Gantt arbeitet auf Kopien */
    }
  });

  it("zahlNach: 0..300 in allen vier Basen", () => {
    for (let w = 0; w <= 300; w++) for (const b of [2, 8, 10, 16]) expect(G.zahlNach!(w, b)).toBe(L.zahlNach!(w, b));
  });

  it("GENERATOREN: gleiche Arten in gleicher Reihenfolge, gleiche Angaben, gleiche Aufgaben", () => {
    /* K3: die alten Arten als Praefix in gleicher Reihenfolge, dahinter genau K3_ARTEN. */
    expect(Object.keys(gen.GENERATOREN)).toEqual([...Object.keys(L.GENERATOREN), ...gen.K3_ARTEN]);
    for (const [art, e] of Object.entries(gen.GENERATOREN).filter(([a]) => !gen.K3_ARTEN.includes(a))) {
      const alt = L.GENERATOREN[art] as Record<string, unknown>;
      const { fn: _a, ...meta } = e; const { fn: _b, ...metaAlt } = alt;
      expect(meta, art).toEqual(metaAlt);
      for (let s = 1; s <= 50; s++) expect(e.fn(seed(s)), art + "#" + s).toEqual((alt.fn as Fn)(seed(s)));
    }
  });
});

it("Node laedt beide Dateien nativ per require (E49)", () => {
  const dateien = ["rechenaufgabe.ts", "generatoren.ts"].map((d) => path.join(hier, d));
  const skript = "for (const p of JSON.parse(process.argv[1])) console.log(Object.keys(require(p)).sort().join(','))";
  const r = spawnSync(process.execPath, ["-e", skript, JSON.stringify(dateien)], { encoding: "utf8" });
  expect(r.status, r.stderr).toBe(0);
  expect(r.stdout.trim().split(/\r?\n/)).toEqual([Object.keys(rechen).sort().join(","), Object.keys(gen).sort().join(",")]);
});
