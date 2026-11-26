/* ============================================================================
   DER TASCHENRECHNER — DIE REGELN DES PARSERS (N26 T1)

   ⛔ Die Erwartungen sind die Regeln der ALTEN Fassung (`app_util.js`, BUILD_LOG 33),
      von Hand hergeleitet - nicht aus `rechne` abgeschrieben. Der Beweis gegen die
      alte Fassung selbst ist T2 (`rechner.gleichheit.test.ts`).
   ============================================================================ */
import fs from "node:fs";
import { describe, it, expect } from "vitest";
import { rechne, formatiere, normalisiere, FEHLER } from "./rechner";

const WERTE: Array<[string, number]> = [
  ["1+2*3", 7], ["2*3+1", 7], ["(1+2)*3", 9], ["10-2-3", 5], ["100/10/5", 2], ["7/2", 3.5],
  ["2^10", 1024], ["2^3^2", 512], ["2^3*2", 16], ["-2^2", -4], ["(-2)^2", 4], ["2^-2", 0.25],
  ["--3", 3], ["+-3", -3], ["2*-3", -6], ["-(3)", -3],
  ["5%", 0.05], ["50+10%", 50.1], ["200*5%", 10], ["10%%", 0.001], ["3%*2", 0.06],
  ["1,5+1.5", 3], [",5", 0.5], ["5.", 5], ["  3 \t+\n4 ", 7],
  ["8−3", 5], ["8–3", 5], ["8—3", 5], ["6×7", 42], ["8÷2", 4], ["√(16)", 4], ["SQRT(9)", 3],
  ["ln(1)", 0], ["pi", Math.PI], ["PI*2", 2 * Math.PI],
];
const NAEHERUNG: Array<[string, number]> = [
  ["sin(30)", 0.5], ["cos(60)", 0.5], ["tan(45)", 1], ["log(1000)", 3], ["sqrt(2)^2", 2], ["sin(90)", 1],
];
const FEHLERFAELLE: Array<[unknown, string]> = [
  ["", FEHLER.leer], ["   ", FEHLER.leer], [null, FEHLER.leer], [undefined, FEHLER.leer],
  ["1/0", FEHLER.null], ["1/(2-2)", FEHLER.null], ["sqrt(-1)", FEHLER.wurzel],
  ["ln(0)", FEHLER.logarithmus], ["log(-1)", FEHLER.logarithmus],
  ["((", FEHLER.ende], ["1+", FEHLER.ende], ["2^", FEHLER.ende],
  ["(1+2", FEHLER.klammern], ["1+2)", FEHLER.klammern], [")", FEHLER.klammern],
  ["sqrt 9", FEHLER.klammern], ["√9", FEHLER.klammern],
  ["1 2", FEHLER.ausdruck], ["1.2.3", FEHLER.ausdruck], ["2(3)", FEHLER.ausdruck],
  ["*3", FEHLER.unerwartet], ["%", FEHLER.unerwartet],
  ["abc", FEHLER.zeichen + "abc"], ["3$", FEHLER.zeichen + "$"], ["ä", FEHLER.zeichen + "ä"],
  ["pix", FEHLER.zeichen + "pix"], ["constructor(4)", FEHLER.zeichen + "constructor"],
  ["0^-1", FEHLER.zuGross], ["10^400", FEHLER.zuGross], ["(-8)^(1/3)", FEHLER.keineZahl],
  ["(".repeat(200000) + "1" + ")".repeat(200000), FEHLER.sonst],
];

describe("rechne: Werte nach den Regeln der alten Fassung", () => {
  it.each(WERTE)("%s = %d", (a, w) => { expect(rechne(a)).toEqual({ ok: true, wert: w }); });
  it.each(NAEHERUNG)("%s ≈ %d (Gradmass)", (a, w) => {
    const r = rechne(a);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.wert).toBeCloseTo(w, 9);
  });
});

describe("rechne: Fehler sind Werte, keine Ausnahmen", () => {
  it.each(FEHLERFAELLE.map(([a, f]) => [String(a).slice(0, 20), a, f] as const))("%s -> Fehler", (_n, a, f) => {
    expect(rechne(a)).toEqual({ ok: false, fehler: f });
  });

  it("wirft nie und liefert nur bekannte Texte - 3000 Zufallsausdruecke mit festem Startwert", () => {
    let x = 20260922;
    const zufall = (n: number) => { x = (x * 1103515245 + 12345) % 2147483648; return x % n; };
    const ZEICHEN = "0123456789.,+-*/^%()×÷−√ sinqrtlogcpa";
    const texte = new Set<string>(Object.values(FEHLER));
    let gut = 0, schlecht = 0;
    for (let k = 0; k < 3000; k++) {
      let s = "";
      for (let j = zufall(13); j > 0; j--) s += ZEICHEN.charAt(zufall(ZEICHEN.length));
      const r = rechne(s);
      if (r.ok) { expect(Number.isFinite(r.wert)).toBe(true); gut++; }
      else {
        expect(texte.has(r.fehler) || r.fehler.startsWith(FEHLER.zeichen), `${s} -> ${r.fehler}`).toBe(true);
        schlecht++;
      }
    }
    /* Der Test sagt selbst, wenn er leer laeuft: beide Zweige muessen vorkommen. */
    expect(gut).toBeGreaterThan(100);
    expect(schlecht).toBeGreaterThan(100);
  });
});

describe("Anzeige und Tastenzeichen", () => {
  it("formatiere kappt Gleitkomma-Rauschen auf 1e-9", () => {
    expect(formatiere(0.1 + 0.2)).toBe("0.3");
    expect(formatiere(1 / 3)).toBe("0.333333333");
    expect(formatiere(0)).toBe("0");
    expect(formatiere(-0)).toBe("0");
    expect(formatiere(1e21)).toBe("1e+21");
    expect(formatiere(Infinity)).toBe("Infinity");
  });
  it("normalisiere ersetzt × ÷ − – — √", () => {
    expect(normalisiere("6×7÷2−1–1—1√")).toBe("6*7/2-1-1-1sqrt");
    expect(normalisiere(null)).toBe("");
  });
});

describe("Zusage: keine dynamische Codeauswertung", () => {
  it("der Quelltext enthaelt weder eval( noch new Function / Function(", () => {
    const quelle = fs.readFileSync(new URL("./rechner.ts", import.meta.url), "utf8");
    expect(quelle.length).toBeGreaterThan(1000);   // wirklich die Datei gelesen
    expect(quelle).not.toMatch(/\beval\s*\(/);
    expect(quelle).not.toMatch(/\bnew\s+Function\b|\bFunction\s*\(/);
  });
});
