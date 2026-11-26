/* ============================================================================
   GLEICHHEITSBEWEIS: der Parser des Neubaus gegen `rechnerAuswerten` der alten App
   (N26 T2, R1, E20 - der Referenzvergleich).

   ⛔ Der Rechner ist die einzige Stelle, an der eine Regel bewusst ZWEIMAL existiert.
      Dieser Test laedt die alte Fassung DIREKT AUS app_util.js und verlangt fuer
      jeden Ausdruck dasselbe Ergebnisobjekt ({ ok, wert } bzw. { ok, fehler }) und
      dieselbe Anzeige (`rechnerFormatiereZahl` gegen `formatiere`).
   ►► GEMESSEN 22.09.2026: `node:vm` genuegt, jsdom ist nicht noetig. Geladen wird nur
      der Block `var rechnerAuswerten, rechnerPanel;` bis `})();` - `rechnerPanel`
      wird definiert, nie aufgerufen, braucht also kein DOM. Damit die Anzeige
      verglichen werden kann, wird VOR der schliessenden Zeile EIN Satz angehaengt,
      der die innere `rechnerFormatiereZahl` herausreicht; die Datei bleibt unberuehrt.
   ⚠️ Der Test sagt selbst, wenn er leer laeuft: Untergrenzen fuer die Zahl der
      Vergleiche, fuer beide Zweige und fuer die Zahl verschiedener Fehlertexte.
   ⚠️ Wo sich die Fassungen unterscheiden DUERFEN, steht in ABWEICHUNGEN, mit Grund -
      und auch dort wird gemessen: beide Seiten muessen genau das Eingetragene liefern.
   ============================================================================ */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { rechne, formatiere, FEHLER } from "./rechner";
import { altQuelle } from "../testhilfe/altquelle";

const hier = path.dirname(fileURLToPath(import.meta.url));
const WURZEL = path.resolve(hier, "../../..");

type Ergebnis = { ok: boolean; wert?: number | undefined; fehler?: string | undefined };

function ladeAlt() {
  const q = fs.readFileSync(altQuelle(WURZEL, "app_util.js"), "utf8").split("\n");
  const von = q.findIndex((z) => z.startsWith("var rechnerAuswerten, rechnerPanel;"));
  const bis = q.findIndex((z, i) => i > von && z === "})();");
  expect(von, "Rechner-Block nicht gefunden - hat app_util.js sich verschoben?").toBeGreaterThan(0);
  expect(bis, "Ende des Rechner-Blocks nicht gefunden").toBeGreaterThan(von);
  const block = q.slice(von, bis).join("\n") + "\n  formatiereImKontext = rechnerFormatiereZahl;\n})();";
  const ctx = vm.createContext({ formatiereImKontext: null }) as Record<string, unknown>;
  vm.runInContext(block, ctx, { filename: "app_util.js#rechner" });
  expect(typeof ctx.rechnerAuswerten).toBe("function");
  expect(typeof ctx.formatiereImKontext).toBe("function");
  const auswerten = ctx.rechnerAuswerten as (a: unknown) => Ergebnis;
  const fmt = ctx.formatiereImKontext as (n: number) => string;
  /* Aus dem fremden Realm in ein schlichtes Objekt - toEqual vergleicht dann nur Inhalt. */
  return {
    rechne: (a: unknown): Ergebnis => {
      const r = auswerten(a);
      return r.ok ? { ok: true, wert: r.wert } : { ok: false, fehler: r.fehler };
    },
    formatiere: fmt,
  };
}
const ALT = ladeAlt();

/* ---- Die erlaubten Abweichungen, je mit Grund --------------------------------- */
const ABWEICHUNGEN: Array<{ ausdruck: string; alt: Ergebnis; neu: Ergebnis; grund: string }> = [
  {
    ausdruck: "constructor(4)",
    alt: { ok: false, fehler: "Unbekannte Funktion: constructor" },
    neu: { ok: false, fehler: FEHLER.zeichen + "constructor" },
    grund: "alt sucht Namen per Objekt-Lookup und trifft `constructor` aus dem Prototyp - ein Zufall, kein Vertrag",
  },
  {
    ausdruck: "constructor",
    alt: { ok: false, fehler: FEHLER.klammern },
    neu: { ok: false, fehler: FEHLER.zeichen + "constructor" },
    grund: "derselbe Prototyp-Zufall; alt haelt den Namen fuer eine Funktion und vermisst die Klammer",
  },
];

/* ---- Die Handliste: Zahlen, Klammern, Funktionen, Komma, Tastenzeichen, Fehler ---- */
const HAND: unknown[] = [
  "0", "007", "42", "3.14", "3,14", ",5", ".5", "5.", "5,", "1e3", "1,000.5", "1.2.3", "12345678901234567890",
  "1+2*3", "2*3+1", "(1+2)*3", "10-2-3", "100/10/5", "7/2", "1/3", "2/3*3", "0.1+0.2", "0,1+0,2", "1-0.9",
  "2^10", "2^3^2", "(2^3)^2", "2^3*2", "-2^2", "(-2)^2", "2^-2", "2^-1^2", "-2^-2", "0^0", "0^-1", "10^400", "10^-400",
  "(-8)^(1/3)", "(-8)^3", "4^0.5", "--3", "+-3", "-+3", "---3", "2*-3", "2/-4", "-(3)", "-(-(-1))", "+5",
  "5%", "50+10%", "200*5%", "10%%", "3%*2", "(50+50)%", "50%^2", "2^50%", "-5%", "100-10%", "%5",
  "  3 \t+\n4 ", "\r1+1\r", "1 +2", "   ", "1 2",
  "8−3", "8–3", "8—3", "6×7", "8÷2", "√(16)", "√9", "√(2)×√(2)", "2√(4)", "√(-4)", "√(0)",
  "sqrt(9)", "SQRT(9)", "Sqrt(9)", "sqrt 9", "sqrt()", "sqrt(", "sqrt)", "sqrt(4)(2)", "sqrt(sqrt(16))",
  "ln(1)", "ln(0)", "ln(-1)", "ln(pi)", "log(1000)", "log(0.001)", "log(0)", "log(-5)", "LOG(10)",
  "sin(0)", "sin(30)", "sin(90)", "sin(180)", "sin(-30)", "cos(0)", "cos(60)", "cos(90)", "cos(180)",
  "tan(0)", "tan(45)", "tan(90)", "tan(135)", "sin(30)^2+cos(30)^2", "sin(pi)",
  "pi", "PI", "Pi*2", "2pi", "pi2", "pix", "e", "abc", "x+1", "sinus(30)", "sin30", "sin(30",
  "", "   ", "((", "))", "(", ")", "()", "(1+2", "1+2)", "(1)(2)", "2(3)", "(((1)))", "1+", "1*", "2^", "*3", "/3",
  "^2", "%", "1 2", "1+*2", "1**2", "1//2", "1^^2", "1/0", "1/(2-2)", "0/0", "0/5", "-0", "-0*5", "5*-0",
  "3$", "3#", "ä", "1+ä", "€5", "1;2", "1=1", "[1]", "{1}", "1,2,3", "1..2",
  "(".repeat(1000) + "1" + ")".repeat(1000),
  "(".repeat(200000) + "1" + ")".repeat(200000),
  null, undefined, 42, 0,
];

/* ---- Zufall mit festem Startwert: Zeichensuppe und Ausdruecke nach der Grammatik -- */
function lcg(start: number) {
  let x = start;
  return (n: number) => { x = (x * 1103515245 + 12345) % 2147483648; return x % n; };
}
function suppe(anzahl: number): string[] {
  const z = lcg(4711);
  const ZEICHEN = "0123456789.,+-*/^%()×÷−√ sinqrtlogcpa";
  const aus: string[] = [];
  for (let k = 0; k < anzahl; k++) {
    let s = "";
    for (let j = z(14); j > 0; j--) s += ZEICHEN.charAt(z(ZEICHEN.length));
    aus.push(s);
  }
  return aus;
}
function grammatik(anzahl: number): string[] {
  const z = lcg(22092026);
  const zahl = () => {
    const ganz = String(z(1000));
    const art = z(4);
    if (art === 0) return ganz;
    if (art === 1) return ganz + "." + z(100);
    if (art === 2) return ganz + "," + z(100);
    return String(z(10));
  };
  const OPS = ["+", "-", "*", "/", "^", "×", "÷", "−"];
  const FUNK = ["sqrt", "ln", "log", "sin", "cos", "tan", "√"];
  const knoten = (tiefe: number): string => {
    const w = tiefe <= 0 ? 0 : z(7);
    if (w <= 1) return zahl() + (z(6) === 0 ? "%" : "");
    if (w === 2) return "(" + knoten(tiefe - 1) + ")";
    if (w === 3) return FUNK[z(FUNK.length)] + "(" + knoten(tiefe - 1) + ")";
    if (w === 4) return "-" + knoten(tiefe - 1);
    if (w === 5 && z(3) === 0) return "pi";
    return knoten(tiefe - 1) + OPS[z(OPS.length)] + knoten(tiefe - 1);
  };
  const aus: string[] = [];
  for (let k = 0; k < anzahl; k++) aus.push(knoten(1 + z(4)));
  return aus;
}

const ZUFALL = [...suppe(3000), ...grammatik(3000)];
const ALLE: unknown[] = [...HAND, ...ZUFALL];

describe("rechne gegen rechnerAuswerten (app_util.js)", () => {
  it("die Abweichungsliste stimmt auf BEIDEN Seiten - sonst ist sie veraltet", () => {
    for (const a of ABWEICHUNGEN) {
      expect(a.grund.length, a.ausdruck).toBeGreaterThan(20);
      expect(ALT.rechne(a.ausdruck), "alt: " + a.ausdruck).toEqual(a.alt);
      expect(rechne(a.ausdruck), "neu: " + a.ausdruck).toEqual(a.neu);
    }
  });

  it("jeder Ausdruck: dasselbe Ergebnis und dieselbe Anzeige", () => {
    const ausgenommen = new Set(ABWEICHUNGEN.map((a) => a.ausdruck));
    let verglichen = 0, gut = 0;
    const fehlertexte = new Set<string>();
    const abweichend: string[] = [];
    for (const a of ALLE) {
      if (typeof a === "string" && ausgenommen.has(a)) continue;
      const alt = ALT.rechne(a);
      const neu = rechne(a);
      verglichen++;
      const gleich = JSON.stringify(alt) === JSON.stringify(neu) && Object.is(alt.wert, neu.ok ? neu.wert : undefined);
      if (!gleich) { abweichend.push(`${JSON.stringify(String(a).slice(0, 40))}: alt ${JSON.stringify(alt)} neu ${JSON.stringify(neu)}`); continue; }
      if (neu.ok) {
        gut++;
        if (ALT.formatiere(neu.wert) !== formatiere(neu.wert)) abweichend.push(`Anzeige ${neu.wert}: alt ${ALT.formatiere(neu.wert)} neu ${formatiere(neu.wert)}`);
      } else fehlertexte.add(neu.fehler.startsWith(FEHLER.zeichen) ? FEHLER.zeichen : neu.fehler);
    }
    expect(abweichend.slice(0, 15), `${abweichend.length} Abweichung(en)`).toEqual([]);
    /* Untergrenzen - ein leerer oder einseitiger Lauf faellt hier durch. */
    expect(verglichen).toBeGreaterThanOrEqual(6000);
    expect(gut).toBeGreaterThanOrEqual(1500);
    expect(verglichen - gut).toBeGreaterThanOrEqual(1500);
    expect(fehlertexte.size, [...fehlertexte].join(" | ")).toBeGreaterThanOrEqual(11);
  });

  it("die Anzeige auch jenseits der Rechenergebnisse", () => {
    const Z = [0, -0, 1, -1, 0.1 + 0.2, 1 / 3, 2 / 3, 1e-10, 5e-10, 1e-9, 123456789.12345679, 1e21, -1e21, 1e300,
      Infinity, -Infinity, NaN, Math.PI, 1 - 0.9, 6.123233995736766e-17];
    for (const n of Z) expect(formatiere(n), String(n)).toBe(ALT.formatiere(n));
  });
});
