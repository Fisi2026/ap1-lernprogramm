/* ============================================================================
   DER TASCHENRECHNER — DER PARSER (N26 T1, E6)

   Tokenizer + rekursiver Abstieg, OHNE dynamische Codeauswertung - dieselbe
   Zusage wie in der alten App (`app_util.js`, `rechnerAuswerten`). Ein Test liest
   diesen Quelltext und sucht beide verbotenen Namen (rechner.test.ts).

   ⛔ DER VERTRAG IST DIE ALTE FASSUNG (E6, E20): `app_util.js` 999-1170, am 22.09.
      gelesen. T2 (`rechner.gleichheit.test.ts`) beweist die Gleichheit ueber
      hunderte Ausdruecke - wer hier eine Regel aendert, bricht diesen Beweis.
      Die Regeln, einzeln:
      * `%` ist NACHGESTELLT und teilt durch 100: `50+10%` = 50,1 (E19).
      * Unaeres Minus bindet lockerer als `^`: `-2^2` = -4; `^` ist
        rechtsassoziativ: `2^3^2` = 512; der Exponent darf ein Vorzeichen tragen.
      * Genau EIN Dezimaltrenner je Zahl, Punkt ODER Komma (`1,5` = 1,5). Das
        Komma ist daher kein Argumenttrenner - es gibt nur einstellige Funktionen.
      * `pi` ist eine Konstante; sqrt, ln, log, sin, cos, tan sind Funktionen und
        verlangen Klammern (`sqrt 9` ist ein Fehler). Namen: nur a-z, A-Z,
        Gross/klein egal. sin/cos/tan im GRADMASS.
      * Die Tastenzeichen × ÷ − – — √ werden vorab ersetzt (√ wird zu `sqrt`).
      * Division durch null ist ein Fehler, `0^-1` (unendlich) "zu gross".
   ⚠️ EINE BEWUSSTE ABWEICHUNG (fuer die Liste in T2): die alte Fassung sucht Namen
      in einem Objekt (`RECHNER_FUNKTIONEN[name]`) und trifft so auch `constructor`
      aus dem Prototyp - `constructor(4)` ergibt dort "Unbekannte Funktion: ...",
      hier "Unbekanntes Zeichen: ...". Nur ueber diesen Zufall ist der Text
      `FEHLER.funktion` ueberhaupt erreichbar; er bleibt fuer den Vergleich stehen.
   ⛔ FEHLER SIND WERTE: `rechne` wirft nie. Intern traegt eine private Klasse den
      Text bis zur Grenze (wie `{ rechnerFehler }` in der alten Fassung); alles
      andere (etwa ein Stapelueberlauf bei tiefer Klammerung) wird zum Sammeltext.
   ============================================================================ */
import { unerreichbar } from "./da.ts";

export type RechenErgebnis = { ok: true; wert: number } | { ok: false; fehler: string };

/** Die Fehlertexte - wortgleich mit der alten Fassung (T2 vergleicht sie). */
export const FEHLER = {
  leer: "Leere Eingabe",
  zahl: "Ungültige Zahl",
  zeichen: "Unbekanntes Zeichen: ",
  funktion: "Unbekannte Funktion: ",
  wurzel: "Wurzel aus negativer Zahl nicht möglich",
  logarithmus: "Logarithmus nur für positive Zahlen",
  null: "Division durch null",
  klammern: "Klammern stimmen nicht",
  ende: "Unerwartetes Ende des Ausdrucks",
  unerwartet: "Unerwartetes Zeichen",
  ausdruck: "Ungültiger Ausdruck",
  keineZahl: "Ergebnis ist keine gültige Zahl",
  zuGross: "Ergebnis ist zu groß",
  sonst: "Ausdruck konnte nicht ausgewertet werden",
} as const;

const FUNKTIONEN = ["sqrt", "ln", "log", "sin", "cos", "tan"] as const;
type Funktion = (typeof FUNKTIONEN)[number];

type Token =
  | { art: "zahl"; wert: number }
  | { art: "funktion"; name: Funktion }
  | { art: EinfachArt | "ende" };
type EinfachArt = "plus" | "minus" | "stern" | "slash" | "dach" | "prozent" | "klauf" | "klzu";

class RechnerFehler extends Error {
  readonly text: string;
  constructor(text: string) { super(text); this.text = text; }
}

const istZiffer = (c: string) => c >= "0" && c <= "9";
const istBuchstabe = (c: string) => (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
const EINZEL: Record<string, EinfachArt> = {   // N38 Q1: nur die Arten, die allein ein Token sind
  "×": "stern", "*": "stern", "÷": "slash", "/": "slash",
  "−": "minus", "–": "minus", "—": "minus", "-": "minus",
  "+": "plus", "^": "dach", "%": "prozent", "(": "klauf", ")": "klzu",
};

/** Ergebnis eines Lesevorgangs: gelesene Tokens und die Position dahinter. */
interface Gelesen { tokens: Token[]; i: number }

function istLeerzeichen(c: string): boolean { return c === " " || c === "\t" || c === "\n" || c === "\r"; }

/** Liest eine Zahl (Ziffern, hoechstens ein Dezimaltrenner) ab Position `i0`. */
function leseZahl(s: string, i0: number): Gelesen {
  let i = i0;
  let trenner = false;
  while (i < s.length) {
    const ch = s.charAt(i);
    if (istZiffer(ch)) { i++; continue; }
    if ((ch === "." || ch === ",") && !trenner) { trenner = true; i++; continue; }
    break;
  }
  const roh = s.slice(i0, i).replace(",", ".");
  const wert = Number(roh);
  if (roh === "" || Number.isNaN(wert)) throw new RechnerFehler(FEHLER.zahl);
  return { tokens: [{ art: "zahl", wert }], i };
}

/** Liest einen Namen (`pi` oder eine bekannte Funktion) ab Position `i0`. */
function leseName(s: string, i0: number): Gelesen {
  let i = i0;
  while (i < s.length && istBuchstabe(s.charAt(i))) i++;
  const name = s.slice(i0, i).toLowerCase();
  if (name === "pi") return { tokens: [{ art: "zahl", wert: Math.PI }], i };
  const fn = FUNKTIONEN.find((x) => x === name);   // N38 Q1: find statt includes + Umwandlung
  if (fn !== undefined) return { tokens: [{ art: "funktion", name: fn }], i };
  throw new RechnerFehler(FEHLER.zeichen + name);
}

/** Liest ein einzelnes Zeichen (Wurzelzeichen oder Operator/Klammer) an Position `i`. */
function leseZeichen(s: string, i: number): Gelesen {
  const c = s.charAt(i);
  if (c === "√") return { tokens: [{ art: "funktion", name: "sqrt" }], i: i + 1 };
  const art = EINZEL[c];
  if (art) return { tokens: [{ art }], i: i + 1 };
  throw new RechnerFehler(FEHLER.zeichen + c);
}

function zerlege(s: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s.charAt(i);
    if (istLeerzeichen(c)) { i++; continue; }
    const g = istZiffer(c) || ((c === "." || c === ",") && istZiffer(s.charAt(i + 1))) ? leseZahl(s, i)
      : istBuchstabe(c) ? leseName(s, i)
      : leseZeichen(s, i);
    tokens.push(...g.tokens);
    i = g.i;
  }
  tokens.push({ art: "ende" });
  return tokens;
}

function wende(name: Funktion, x: number): number {
  switch (name) {
    case "sqrt":
      if (x < 0) throw new RechnerFehler(FEHLER.wurzel);
      return Math.sqrt(x);
    case "ln":
      if (x <= 0) throw new RechnerFehler(FEHLER.logarithmus);
      return Math.log(x);
    case "log":
      if (x <= 0) throw new RechnerFehler(FEHLER.logarithmus);
      return Math.log(x) / Math.LN10;
    case "sin": return Math.sin((x * Math.PI) / 180);
    case "cos": return Math.cos((x * Math.PI) / 180);
    case "tan": return Math.tan((x * Math.PI) / 180);
    default: return unerreichbar(name, "wende");
  }
}

/*  ausdruck := term (('+'|'-') term)*
    term     := unaer (('*'|'/') unaer)*
    unaer    := ('-'|'+') unaer | potenz
    potenz   := postfix ('^' unaer)?        rechtsassoziativ
    postfix  := primaer ('%')*              je % durch 100
    primaer  := ZAHL | '(' ausdruck ')' | FUNKTION '(' ausdruck ')'          */
function werte(tokens: Token[]): number {
  let pos = 0;
  const blick = () => tokens[pos]!;
  const nimm = () => tokens[pos++]!;
  const erwarte = (art: Token["art"], text: string) => {
    if (blick().art !== art) throw new RechnerFehler(text);
    nimm();
  };
  function ausdruck(): number {
    let wert = term();
    while (blick().art === "plus" || blick().art === "minus") {
      const op = nimm().art;
      const rechts = term();
      wert = op === "plus" ? wert + rechts : wert - rechts;
    }
    return wert;
  }
  function term(): number {
    let wert = unaer();
    while (blick().art === "stern" || blick().art === "slash") {
      const op = nimm().art;
      const rechts = unaer();
      if (op === "stern") wert = wert * rechts;
      else {
        if (rechts === 0) throw new RechnerFehler(FEHLER.null);
        wert = wert / rechts;
      }
    }
    return wert;
  }
  function unaer(): number {
    if (blick().art === "minus") { nimm(); return -unaer(); }
    if (blick().art === "plus") { nimm(); return unaer(); }
    return potenz();
  }
  function potenz(): number {
    const basis = postfix();
    if (blick().art === "dach") { nimm(); return Math.pow(basis, unaer()); }
    return basis;
  }
  function postfix(): number {
    let wert = primaer();
    while (blick().art === "prozent") { nimm(); wert = wert / 100; }
    return wert;
  }
  function primaer(): number {
    const t = blick();
    if (t.art === "zahl") { nimm(); return t.wert; }
    if (t.art === "klauf") {
      nimm();
      const wert = ausdruck();
      erwarte("klzu", FEHLER.klammern);
      return wert;
    }
    if (t.art === "funktion") {
      nimm();
      erwarte("klauf", FEHLER.klammern);
      const arg = ausdruck();
      erwarte("klzu", FEHLER.klammern);
      return wende(t.name, arg);
    }
    if (t.art === "klzu") throw new RechnerFehler(FEHLER.klammern);
    if (t.art === "ende") throw new RechnerFehler(FEHLER.ende);
    throw new RechnerFehler(FEHLER.unerwartet);
  }
  const ergebnis = ausdruck();
  if (blick().art !== "ende") {
    throw new RechnerFehler(blick().art === "klzu" ? FEHLER.klammern : FEHLER.ausdruck);
  }
  return ergebnis;
}

/** Tastenzeichen in Parserzeichen - wie `rechnerNormalisiereAnzeige`. */
export function normalisiere(s: unknown): string {
  return String(s ?? "").replace(/×/g, "*").replace(/÷/g, "/").replace(/[−–—]/g, "-").replace(/√/g, "sqrt");
}

/** Rechnet einen Ausdruck aus. Wirft nie: jeder Fehlerfall ist `{ ok: false, fehler }`. */
export function rechne(ausdruck: unknown): RechenErgebnis {
  const s = normalisiere(ausdruck).trim();
  if (s === "") return { ok: false, fehler: FEHLER.leer };
  try {
    const tokens = zerlege(s);
    if (tokens.length <= 1) return { ok: false, fehler: FEHLER.leer };
    const wert = werte(tokens);
    if (typeof wert !== "number" || Number.isNaN(wert)) return { ok: false, fehler: FEHLER.keineZahl };
    if (!Number.isFinite(wert)) return { ok: false, fehler: FEHLER.zuGross };
    return { ok: true, wert };
  } catch (e) {
    if (e instanceof RechnerFehler) return { ok: false, fehler: e.text };
    return { ok: false, fehler: FEHLER.sonst };
  }
}

/** Anzeige einer Zahl - wie `rechnerFormatiereZahl`: Gleitkomma-Rauschen auf 1e-9 gekappt. */
export function formatiere(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  if (n === 0) return "0";
  return String(Math.round(n * 1e9) / 1e9);
}
