/* ============================================================================
   N34 T5 (E50, 26.09.2026): DIE RECHENAUFGABE AUS `logik.js`
   Uebernommen aus `referenz/logik.js` (Z. 655-862): Formel-Parser, Werte ziehen, Zahlen deutsch
   schreiben, Platzhalter fuellen, Schritte rechnen, Loesungs-Schreibweisen, Instanziierung –
   Regeln UND Kommentare wortgleich, typisiert. Die Zahl-Hilfen kommen aus T2 (`zahlen.ts`),
   der Zufall aus T3 (`zufall.ts`). Schnitt: Nutzer-Entscheid 26.09. abends (zwei Dateien,
   Aufrufer in T5), die Wuerfel-Generatoren stehen in `generatoren.ts`.
   ⚠️ `instanziiere` gibt IMMER eine Kopie zurueck (R1) – die Aufrufer verlassen sich darauf.
   Gehalten von `generatoren.gleichheit.test.ts` gegen `referenz/logik.js`.
   ⛔ Importiert wird relativ mit Endung `.ts`, nie ueber `@/` (E49).
   ============================================================================ */
import { da } from "./da.ts";
import { rundeAuf, runde2 } from "./zahlen.ts";
import { pick, type Zufall } from "./zufall.ts";

export type Werte = Record<string, number>;
export interface VariablenDef { min?: unknown; max?: unknown; schritt?: unknown; [weiteres: string]: unknown }
export interface Rechenschritt { text?: unknown; formel?: unknown; dezimalen?: unknown; wert?: number; loesung?: string[]; [weiteres: string]: unknown }
export interface RechenFrage {
  frage?: unknown; variablen?: Record<string, VariablenDef> | null; schritte?: Rechenschritt[]; varianten?: unknown;
  erklaerungLang?: unknown; erklaerungKurz?: unknown; _werte?: Werte; [weiteres: string]: unknown;
}

/* ---------------- #35 Laufzeit-Randomisierung: Formelauswertung ----------------
   Mini-Ausdrucksparser (rekursiver Abstieg) für die Formeln in "schritte[].formel".
   BEWUSST KEIN eval/new Function: Inhaltsdaten dürfen keinen ausführbaren Code tragen.
   Unterstützt: Zahlen (auch dezimal), Bezeichner, + - * / ( ) und unäres Minus.
   Bezeichner sind die gezogenen Variablen sowie s1..sN = Ergebnis des jeweiligen
   vorherigen Schritts (Schritt 3 kann also mit "s1 + s2" rechnen).               */
export const FORMEL_TOKEN = /\s*(\d+(?:\.\d+)?|[A-Za-z_][A-Za-z_0-9]*|\*\*|[-+*/()])/g;
export function evalFormel(ausdruck: unknown, werte?: Record<string, unknown> | null): number {
  const src = String(ausdruck ?? "");
  const toks: string[] = [];
  let m: RegExpExecArray | null, letzte = 0;
  FORMEL_TOKEN.lastIndex = 0;
  while ((m = FORMEL_TOKEN.exec(src)) !== null) {
    if (m.index !== letzte) throw new Error("Formel: unerlaubtes Zeichen in '" + src + "'");
    toks.push(da(m[1], "Formel-Token")); letzte = FORMEL_TOKEN.lastIndex;   /* Gruppe 1 ist nicht optional */
  }
  if (src.slice(letzte).trim() !== "") throw new Error("Formel: unerlaubtes Zeichen in '" + src + "'");
  if (!toks.length) throw new Error("Formel: leer");
  let pos = 0;
  const schau = (): string | undefined => toks[pos];
  const nimm = (t?: string): string | undefined => {
    if (t != null && toks[pos] !== t) throw new Error("Formel: erwartet '" + t + "' in '" + src + "'");
    return toks[pos++];
  };
  function primaer(): number {
    const t = schau();
    if (t === "(") { nimm("("); const v = ausdruckP(); nimm(")"); return v; }
    if (t === "-") { nimm("-"); return -faktor(); }
    if (t === "+") { nimm("+"); return faktor(); }
    if (t == null) throw new Error("Formel: unerwartetes Ende in '" + src + "'");
    if (/^\d/.test(t)) { nimm(); return parseFloat(t); }
    if (/^[A-Za-z_]/.test(t)) {
      nimm();
      const w = werte ? werte[t] : undefined;
      if (!werte || typeof w !== "number" || !isFinite(w)) {
        throw new Error("Formel: unbekannte Variable '" + t + "' in '" + src + "'");
      }
      return w;
    }
    throw new Error("Formel: unerwartetes Token '" + t + "' in '" + src + "'");
  }
  function faktor(): number { return primaer(); }
  function punkt(): number {
    let v = faktor(), t: string | undefined;
    while ((t = schau()) === "*" || t === "/") {
      nimm();
      const r = faktor();
      if (t === "/") { if (r === 0) throw new Error("Formel: Division durch 0 in '" + src + "'"); v = v / r; }
      else v = v * r;
    }
    return v;
  }
  function ausdruckP(): number {
    let v = punkt(), t: string | undefined;
    while ((t = schau()) === "+" || t === "-") { nimm(); const r = punkt(); v = (t === "+") ? v + r : v - r; }
    return v;
  }
  const erg = ausdruckP();
  if (pos !== toks.length) throw new Error("Formel: Rest nach Ausdruck in '" + src + "'");
  if (typeof erg !== "number" || !isFinite(erg)) throw new Error("Formel: kein endliches Ergebnis in '" + src + "'");
  return erg;
}

/* Zufallswert für eine Variablendefinition {min,max,schritt}. Ganzzahlige Schritte
   (Nutzer-Entscheid); schritt darf dezimal sein, dann wird auf 2 Stellen gerundet. */
export function zieheWert(def: VariablenDef, rng?: Zufall): number {
  const r = rng ?? Math.random;
  const min = Number(def.min), max = Number(def.max), schritt = Number(def.schritt || 1);
  if (!isFinite(min) || !isFinite(max) || !isFinite(schritt) || schritt <= 0 || max < min) return NaN;
  const n = Math.floor((max - min) / schritt + 1e-9) + 1;
  return runde2(min + Math.floor(r() * n) * schritt);
}

/* Platzhalter {name} im Text durch die gezogenen Werte ersetzen (deutsche Schreibweise). */
/* Deutsche Schreibweise: Tausenderpunkte ab 5 Stellen vor dem Komma (1000 bleibt "1000",
   10000 wird "10.000") – so schreiben es auch die Aufgabentexte. Komma als Dezimaltrenner. */
export function tausender(s: string): string {
  const neg = s.charAt(0) === "-"; if (neg) s = s.slice(1);
  const teile = s.split(",");
  let ganz = teile[0] ?? "";   /* split liefert immer mindestens ein Element */
  if (ganz.length > 3) ganz = ganz.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (neg ? "-" : "") + ganz + (teile.length > 1 ? "," + teile[1] : "");
}
export function formatZahl(v: unknown, dezimalen?: unknown): string {
  if (typeof dezimalen === "number") {
    return tausender(rundeAuf(v, dezimalen).toFixed(Math.floor(dezimalen)).replace(".", ","));
  }
  const r = runde2(v);
  const ganz = Math.abs(r % 1) < 1e-9;
  return tausender(ganz ? String(Math.round(r)) : String(r).replace(".", ","));
}
/* Platzhalter: {name}, {ausdruck} (voller Formelsyntax) und {ausdruck|2} für feste
   Nachkommastellen – z. B. "{preisCent/100|2} EUR" bei ganzzahlig gezogenen Cent-Werten.
   Unauflösbare Platzhalter bleiben unverändert stehen (der Validator schlägt dann an).  */
export function fuelleText(text: unknown, werte?: Record<string, unknown> | null): string {
  return String(text ?? "").replace(/\{([^{}]+)\}/g, (ganz: string, inhalt: string) => {
    const [kopf = "", dezTeil] = inhalt.split("|");   /* split liefert immer mindestens ein Element */
    const ausdruck = kopf.trim();
    const dez = dezTeil !== undefined ? parseInt(dezTeil, 10) : null;
    try {
      const v = evalFormel(ausdruck, werte ?? {});
      return formatZahl(v, (dez != null && isFinite(dez)) ? dez : undefined);
    } catch { return ganz; }
  });
}

/* Zieht Werte und berechnet ALLE Schritt-Ergebnisse. Wirft bei fehlerhafter Formel.
   Rückgabe: {werte:{}, schritte:[{...,loesung:[...],wert:Number}]}                */
export function rechneAufgabe(f: RechenFrage, rng?: Zufall): { werte: Werte; schritte: Rechenschritt[] } {
  const werte: Werte = {};
  for (const [k, def] of Object.entries(f.variablen ?? {})) werte[k] = zieheWert(def, rng);   /* eigene Schluessel, gleiche Reihenfolge wie for-in + hasOwnProperty */
  const schritte = da(f.schritte, "Schritte der Rechenaufgabe").map((s, i) => {   /* vorher warf `.map` auf undefined */
    const out: Rechenschritt = Object.assign({}, s);
    out.text = fuelleText(s.text, werte);
    if (typeof s.formel === "string" && s.formel.length) {
      const roh = evalFormel(s.formel, werte);
      const wert = rundeAuf(roh, s.dezimalen);
      werte["s" + (i + 1)] = wert;          /* Folgeschritte rechnen mit dem GERUNDETEN Zwischenwert */
      out.wert = wert;
      out.loesung = loesungsSchreibweisen(wert, s.dezimalen);
    }
    return out;
  });
  return { werte, schritte };
}
/* Akzeptierte Schreibweisen zu einem Zahlwert (nur Anzeige/Abwärtskompatibilität –
   die eigentliche Prüfung läuft in gradeRechenassistent numerisch mit Toleranz).  */
export function loesungsSchreibweisen(wert: unknown, dezimalen?: unknown): string[] {
  const d = (typeof dezimalen === "number" && dezimalen >= 0 && dezimalen <= 6) ? Math.floor(dezimalen) : 2;
  const r = rundeAuf(wert, d), out: string[] = [];
  const ganz = Math.abs(r % 1) < 1e-9;
  if (ganz) { out.push(String(Math.round(r))); if (d > 0) out.push(r.toFixed(d).replace(".", ",")); }
  else {
    out.push(r.toFixed(d).replace(".", ","));
    out.push(r.toFixed(d));
    const knapp = String(r);                       /* ohne aufgefüllte Nullen: 1401.6 statt 1401.60 */
    if (out.indexOf(knapp) < 0) { out.push(knapp); out.push(knapp.replace(".", ",")); }
  }
  return out;
}

export function instanziiere<T>(f: T, rng?: Zufall): T {
  if (!f) return f;                                     /* falsy durchreichen (loeseFrage-Guard #91) */
  /* N38 Q1: BEGRUENDET STEHEN GELASSEN – die EINE Behauptung dieser Funktion: „die ausgefuellte Frage
     hat wieder den Typ der Eingabe“. Jeder Aufrufer reicht eine Frage aus seinem Bestand (T); gelesen
     werden nur die Felder von RechenFrage, und die werden unten alle geprueft (typeof/Array.isArray).
     Vorher stand dieselbe Behauptung an fuenf Stellen, jetzt an dieser einen Zeile. */
  return instanziiereFrage(f, rng) as unknown as T;
}

function instanziiereFrage(q: RechenFrage, rng?: Zufall): RechenFrage {
  /* R1: IMMER Kopie zurückgeben – Aufrufer setzen z. B. _beantwortet; das darf nie
     das POOL-Objekt mutieren (sonst zählt eine Wiederziehung in der Session nicht). */
  /* #35: echte Laufzeit-Randomisierung, wenn "variablen" vorhanden sind.
     ROBUSTHEIT: Eine Wertekombination kann rechnerisch entarten (z. B. Division durch 0,
     wenn eine Differenz zufaellig 0 wird). Das darf NIE nach aussen dringen – der Aufrufer
     (loeseFrage) wuerde sonst mit einer Ausnahme abbrechen. Daher mehrere Versuche und
     zuletzt die unveraenderte Frage als Rueckfallebene. */
  if (q.variablen && typeof q.variablen === "object" && Array.isArray(q.schritte)) {
    let r: { werte: Werte; schritte: Rechenschritt[] } | null = null;
    for (let versuch = 0; versuch < 25 && !r; versuch++) {
      try { r = rechneAufgabe(q, rng); } catch { r = null; }
    }
    if (!r) return Object.assign({}, q);
    const res: RechenFrage = Object.assign({}, q);
    res.frage = fuelleText(q.frage, r.werte);
    res.schritte = r.schritte;
    if (typeof q.erklaerungLang === "string") res.erklaerungLang = fuelleText(q.erklaerungLang, r.werte);
    if (typeof q.erklaerungKurz === "string") res.erklaerungKurz = fuelleText(q.erklaerungKurz, r.werte);
    // oxlint-disable-next-line eslint/no-underscore-dangle -- Schluessel `_werte` ist Datenvertrag mit referenz/logik.js:850 (Gleichheitstests)
    res._werte = r.werte;
    delete res.variablen;
    delete res.varianten;
    return res;
  }
  if (!Array.isArray(q.varianten) || q.varianten.length === 0) return Object.assign({}, q);
  const v = pick(q.varianten as unknown[], rng);
  const out: RechenFrage = Object.assign({}, q, v);
  delete out.varianten;
  return out;
}
