/* ============================================================================
   N34 T2 (E50, E52, 26.09.2026): DIE BEWERTUNG AUS `logik.js`
   Uebernommen aus `referenz/logik.js` (Z. 896-1149): alle `grade*`, ihre Hilfen
   (`normAntwort`, `distanzEins`, `gradeLueckeTolerant`, `dropdownAkzeptiert`, `normBefehl`,
   die drei `…Treffer`), die Registry MIT Bewertern (`TYP`) und `grade`/`gradeSim`.
   Regeln UND Begruendungs-Kommentare wortgleich, nur typisiert.
   Gehalten von `bewertung.gleichheit.test.ts`: jede Funktion gegen `referenz/logik.js`
   (die Wurzel-Fassung fiel mit T6c), ueber ALLE Fragen des Pools mit richtiger, falscher, verbogener und
   kaputter Antwort.
   ⛔ Seit T2 bewertet die App HIER, nicht mehr ueber `L.grade*` (Nutzer-Entscheid E52).
   ⛔ Importiert wird relativ mit Endung `.ts`, nie ueber `@/` (E49).
   ⚠️ Die Fragen sind hier bewusst LOSE getypt: eine Bewertung darf nie werfen, nur weil eine
      Antwort die falsche Form hat (#79) – die Laufzeitpruefungen stehen im Code, wie in logik.js.
   ============================================================================ */
import { TIPP_MINLAENGE } from "./tabellen/konfig.ts";
import { da } from "./da.ts";
import { TYP_DATEN, type TypDaten } from "./tabellen/fragetypen.ts";
import { toleranzFuer, zahlAusText } from "./zahlen.ts";

/** Die Felder, die die Bewerter lesen – je Typ ein Teil davon. */
export interface BewertbareFrage {
  typ?: string;
  unterTyp?: string;
  loesungIndex?: unknown;
  loesungIndizes?: number[];
  luecken?: unknown[];
  paare?: unknown[][];
  schritte?: unknown[];
  zonen?: Array<{ richtig?: unknown }>;
  fehlerZeile?: unknown;
  elemente?: Array<{ quadrant?: unknown }>;
  ziele?: Array<{ loesung?: unknown }>;
  /** N37 U4: bei trace/kalkulation ein Feld je Zeile, bei fehlersuche/kreuztabelle Text – die Bewerter pruefen es. */
  zeilen?: unknown[];
  aufgaben?: Array<{ akzeptiert?: unknown[] }>;
  aussagen?: Array<{ wahr?: unknown }>;
  schritt1?: { loesungIndex?: unknown };
  schritt2?: { loesungIndex?: unknown };
  loesung?: unknown[][];
}
export type Bewerter = (frage: BewertbareFrage, antwort: unknown) => boolean;

type Feld = Record<PropertyKey, unknown>;
/* N38 Q1: DIE EINE Umwandlung dieser Datei, begruendet. `feld(x)[k]` ist genau der JS-Zugriff `x[k]`
   aus logik.js: ein Wert (auch unknown) oder – bei null/undefined – ein TypeError. Behauptet wird nur
   „man kann hineinsehen“; was herauskommt, bleibt `unknown` und wird dort geprueft, wo es gebraucht wird.
   Schluessel werden mit `String(k)` gebildet: fuer alles ausser Symbolen (kommen aus JSON nie) ist das
   dieselbe Umwandlung, die JS beim Zugriff selbst macht (ToPropertyKey). */
const feld = (x: unknown): Feld => x as Feld;
/** Eine Liste – sonst ein TypeError, wie ihn logik.js beim ersten `.some`/`.map` darauf warf. */
function liste(x: unknown, was: string): unknown[] {
  if (!Array.isArray(x)) throw new TypeError("[bewertung] keine Liste: " + was);
  return x;
}

/* ---------------- Bewertung der Antworten ---------------- */
export function gradeMC(frage: BewertbareFrage, antwortIndex: unknown): boolean { return antwortIndex === frage.loesungIndex; }

/* FB-R2.6a (2026-07-21): Normalisierung fuer getippte Antworten (Lueckentext, Dropdown im
   Freitext-Modus, Rechenassistent, Trace, Konsole).
   ZWEI LUECKEN GESCHLOSSEN, beide gemessen:
     1. UMLAUTE/ss. Bis hierher wurde „Unterstuetzungsprozesse" gegen „Unterstützungsprozesse"
        als FALSCH gewertet – am Handy tippt man Umlaute aber haeufig aus. Die Freitext-Bewertung
        (normText in app_util.js) macht das seit jeher; nur diese Stelle nicht. Betrifft Zahlen
        nicht und ist deshalb gefahrlos.
     2. SATZZEICHEN AM ENDE. „Beschaffung." galt als falsch. Nur am Wortende abgeschnitten,
        damit IP-Adressen und Dezimalzahlen im Inneren unberuehrt bleiben.
   BEWUSST NICHT GEAENDERT – TAUSENDERPUNKT: „1.500" wird weiterhin nicht als 1500 akzeptiert.
   Grund: Zeile 2 ersetzt Komma durch Punkt, damit ist „1,500" bereits „1.500". Wuerde man den
   Tausenderpunkt entfernen, waere „1.500" nicht mehr von der Dezimalzahl 1,5 unterscheidbar.
   Das ist ein echter Zielkonflikt und liegt als Entscheidung beim Nutzer, nicht beim Code. */
export function normAntwort(s: unknown): string {
  return String(s ?? "").trim().toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/,/g, ".").replace(/\s+/g, " ")
    .replace(/[.,;:!?]+$/, "")
    .replace(/^([0-9]+)\.0+$/, "$1");
}
export function gradeLuecke(akzeptiert: readonly unknown[], eingabe: unknown): boolean {
  const e = normAntwort(eingabe);
  return akzeptiert.some((a) => normAntwort(a) === e);
}
/* TIPPFEHLER-TOLERANZ (2026-08-04, Nutzer-Entscheid). Levenshtein-Distanz GENAU 1, mit
   frühem Ausstieg – die volle Matrix wird nie gebraucht, weil alles ab Distanz 2 falsch ist.
   ⚠️ ABSICHTLICH NUR EIN ZEICHEN. Bei Distanz 2 fallen im Bestand Paare wie „7,1"/„7,5" und
   „stufe 1"/„stufe 3" zusammen; gemessen am 04.08. an allen getippten Typen. */
export function distanzEins(a: string, b: string): boolean {
  if (a === b) return false;
  if (Math.abs(a.length - b.length) > 1) return false;
  if (a.length === b.length) {
    let d = 0;
    for (let i = 0; i < a.length; i++) { if (a[i] !== b[i] && ++d > 1) return false; }
    return d === 1;
  }
  const kurz = a.length < b.length ? a : b, lang = a.length < b.length ? b : a;
  let x = 0, y = 0, f = 0;
  while (x < kurz.length && y < lang.length) {
    if (kurz[x] === lang[y]) x++; else if (++f > 1) return false;
    y++;
  }
  return true;
}
/* Toleranter Vergleich für GETIPPTE Einzelantworten. Bewusst NICHT in gradeLuecke selbst:
   dieselbe Funktion bedient `trace` (Zellen wie „Stufe 1"/„Stufe 2"), den Freitextmodus von
   `dropdown` („ISO 9001"/„ISO 9000", „Wartung"/„Warnung") und die nicht-numerischen Schritte
   des Rechenassistenten. Dort ist die Toleranz gefährlich und bleibt aus – Nutzer-Entscheid
   04.08. nach Messung aller vier getippten Typen. NUR `lueckentext` ruft diese Fassung.
   (Die Mindestlaenge `TIPP_MINLAENGE` steht mit ihrer Messung in `tabellen/konfig.ts`.) */
export function gradeLueckeTolerant(akzeptiert: readonly unknown[], eingabe: unknown): boolean {
  if (gradeLuecke(akzeptiert, eingabe)) return true;
  const e = normAntwort(eingabe);
  if (e.length < TIPP_MINLAENGE || /[0-9]/.test(e)) return false;
  return akzeptiert.some((a) => {
    const n = normAntwort(a);
    return n.length >= TIPP_MINLAENGE && !/[0-9]/.test(n) && distanzEins(n, e);
  });
}
export function gradeLueckentext(frage: BewertbareFrage, eingaben: unknown): boolean {
  const luecken = frage.luecken!;
  if (!Array.isArray(eingaben) || eingaben.length !== luecken.length) return false;
  return luecken.every((l, i) => gradeLueckeTolerant(liste(l, "Luecke"), eingaben[i]));
}
export function gradeZuordnung(frage: BewertbareFrage, zuordnung: unknown): boolean { // zuordnung: {linksIndex: rechtsIndex}
  // Text-basiert: korrekt, wenn die zugeordnete rechte Kategorie inhaltlich passt.
  // Für eindeutige Kategorien identisch zum Index-Vergleich; nötig für many-to-one
  // (z. B. mehrere Aussagen → dieselbe Kategorie "Wasserfallmodell"/"SCRUM").
  if (!zuordnung || typeof zuordnung !== "object") return false; // Guard (#79): L.grade darf nie werfen
  const paare = frage.paare!;
  return paare.every((_, i) => {
    const j = feld(zuordnung)[i];
    const p = feld(paare)[String(j)];
    return j != null && !!p && feld(p)[1] === paare[i]![1];
  });
}
export function gradeMehrfach(frage: BewertbareFrage, indizes: unknown): boolean { // indizes: Array gewählter Options-Indizes
  if (!Array.isArray(indizes)) return false;
  // oxlint-disable-next-line typescript/prefer-nullish-coalescing -- kaputte Daten (z. B. 0 statt Liste) sollen auf [] fallen; bewertung.gleichheit.test prueft genau das
  const soll = (frage.loesungIndizes || []).slice().sort((a, b) => a - b);
  /* N38 Q1: `Number(a) - Number(b)` ist fuer JSON-Werte genau das `a - b` von vorher (ToNumeric) – kein Filter. */
  const ist: unknown[] = indizes.slice().sort((a, b) => Number(a) - Number(b));
  return soll.length === ist.length && soll.every((v, i) => v === ist[i]);
}
export function gradeReihenfolge(frage: BewertbareFrage, reihenfolge: unknown): boolean { // Original-Indizes in Nutzer-Reihenfolge
  if (!Array.isArray(reihenfolge) || reihenfolge.length !== frage.schritte!.length) return false;
  return reihenfolge.every((v, i) => v === i);
}
/* Dropdown-Luecke im Bestand: { optionen: Text[]; loesung: Index; akzeptiert?: Text[] } – gelesen per `feld`. */
export function gradeDropdown(frage: BewertbareFrage, auswahl: unknown): boolean { // gewählter Options-Index je Lücke
  const luecken = frage.luecken!;
  if (!Array.isArray(auswahl) || auswahl.length !== luecken.length) return false;
  return luecken.every((l, i) => auswahl[i] === feld(l).loesung);
}
// #102 Freitext-Modus des dropdown-Typs (pro Aufgabe umschaltbar): jede Lücke als Text prüfen.
// Akzeptiert = korrekte Option (l.optionen[l.loesung]) + optionale zusätzliche Schreibweisen (l.akzeptiert).
// Toleranz identisch zu gradeLuecke (normAntwort: Groß/Klein, Trim, Zahlen/Umlaut) – Nutzer-Entscheid.
export function dropdownAkzeptiert(l: unknown): unknown[] {   // N38 Q1: jede Luecke, wie in logik.js
  const x = feld(l);
  return [feld(x.optionen)[String(x.loesung)]].concat(Array.isArray(x.akzeptiert) ? x.akzeptiert : []);
}
export function gradeDropdownText(frage: BewertbareFrage, eingaben: unknown): boolean { // Freitext je Lücke
  const luecken = frage.luecken!;
  if (!Array.isArray(eingaben) || eingaben.length !== luecken.length) return false;
  return luecken.every((l, i) => gradeLuecke(dropdownAkzeptiert(l), eingaben[i]));
}
export function gradeHotspot(frage: BewertbareFrage, index: unknown): boolean { // angeklickte Zone
  const z = frage.zonen ? feld(frage.zonen)[String(index)] : undefined;
  return !!(frage.zonen && z && feld(z).richtig);
}
export function gradeFehlersuche(frage: BewertbareFrage, zeileIndex: unknown): boolean { // angeklickte Zeile
  return zeileIndex === frage.fehlerZeile;
}
/* Rechenschritt: { wert?: Zahl; dezimalen?: Zahl; loesung?: Text[] } – gelesen per `feld`. */
export function gradeRechenassistent(frage: BewertbareFrage, eingaben: unknown): boolean { // Array je Schritt
  const schritte = frage.schritte!;
  if (!Array.isArray(eingaben) || eingaben.length !== schritte.length) return false;
  return schritte.every((schritt, i) => {
    const s = feld(schritt);   // wie vorher `s.wert`: null/undefined werfen hier
    /* #35: berechnete Schritte werden NUMERISCH mit Toleranz geprüft (Nutzer-Entscheid:
       2 Dezimalen, 1 Cent). Das fängt abweichende Schreibweisen und Zwischenrundungen ab.
       Schritte ohne berechneten Wert bleiben beim bisherigen Schreibweisen-Vergleich.   */
    if (typeof s.wert === "number" && isFinite(s.wert)) {
      const e = zahlAusText(eingaben[i]);
      if (!isFinite(e)) return false;
      return Math.abs(e - s.wert) <= toleranzFuer(s.dezimalen) + 1e-9;
    }
    return gradeLuecke(liste(da(s.loesung, "Loesung des Rechenschritts"), "Loesung des Rechenschritts"), eingaben[i]);   /* vorher warf `.some` auf undefined */
  });
}
export function gradeMatrix(frage: BewertbareFrage, zuordnung: unknown): boolean { // {elementIndex: quadrantIndex}
  if (!zuordnung) return false;
  return frage.elemente!.every((e, i) => feld(zuordnung)[i] === e.quadrant);
}
export function gradeBeschriftung(frage: BewertbareFrage, zuordnung: unknown): boolean { // {zielIndex: labelText}
  if (!zuordnung) return false;
  return frage.ziele!.every((z, i) => feld(zuordnung)[i] === z.loesung);
}
export function gradeTrace(frage: BewertbareFrage, eingaben: unknown): boolean { // 2D-Array [zeile][spalte]
  const zeilen = frage.zeilen!;
  if (!Array.isArray(eingaben) || eingaben.length !== zeilen.length) return false;
  return zeilen.every((row, r) => {
    const z: unknown = eingaben[r];
    return Array.isArray(row) && Array.isArray(z) && z.length === row.length &&
      row.every((cell, c) => gradeLuecke([String(cell)], z[c]));
  });
}
export function normBefehl(s: unknown): string {
  return String(s ?? "").trim().toLowerCase().replace(/\s+/g, " ").replace(/\s*([/|])\s*/g, "$1");
}
export function gradeKonsole(frage: BewertbareFrage, eingaben: unknown): boolean { // Array je Aufgabe
  const aufgaben = frage.aufgaben!;
  if (!Array.isArray(eingaben) || eingaben.length !== aufgaben.length) return false;
  return aufgaben.every((a, i) => {
    const e = normBefehl(eingaben[i]);
    return (a.akzeptiert ?? []).some((ok) => normBefehl(ok) === e);
  });
}
export function gradeKalkulation(frage: BewertbareFrage, eingaben: unknown): boolean { // {"r,c": wert} nur für Lösungszellen
  if (!eingaben) return false;
  return frage.zeilen!.every((row, r) => Array.isArray(row) && row.every((cell, c) => {
    const loesung = feld(cell).loesung;
    if (!Array.isArray(loesung)) return true;             // feste Zelle
    const l = loesung.map(String);
    const eingabe = feld(eingaben)[r + "," + c];
    return gradeLuecke(l, eingabe) || zahlZelleTrifft(l, eingabe);
  }));
}
/* N48 P3 (Nutzer-Entscheid 11.10.2026, BUILD_LOG 136): ZAHLENZELLEN WIE DER RECHENASSISTENT.
   Gemessen: die Textpruefung lehnte „300 €" in 21 Kalkulationen ab (82 von 82 Proben) und
   „5.000,00" in 4 – der Rechenassistent nahm dieselben Eingaben an (4.600 von 4.600). Darum
   zusaetzlich zum Textvergleich: sind ALLE Loesungseintraege reine Zahlen, gilt die Eingabe
   als richtig, wenn `zahlAusText` sie auf einen der gelisteten Werte bringt (Toleranz wie
   `toleranzFuer()`, 1 Cent). Zellen mit „%" oder Text bleiben beim Textvergleich (3 von 106).
   ⚠️ Die Entscheidung vom 04.08. („1.500" ist nicht 1500) gilt weiter fuer `normAntwort`;
   hier entscheidet `zahlAusText`, das „1.500" ohne Komma als Tausenderpunkt liest. */
function zahlZelleTrifft(loesung: readonly string[], eingabe: unknown): boolean {
  if (!loesung.length || !loesung.every((s) => /^-?[0-9.,]+$/.test(s.trim()))) return false;
  /* ⛔ Nur SAUBERE Zahleingaben: `parseFloat` in `zahlAusText` ignoriert angehaengten Text –
     „1.000,00###falsch" galt sonst als 1000 (gefunden von bewertung.gleichheit, 11.10.). */
  const roh = String(eingabe ?? "").replace(/€|EUR|eur/g, "").trim();
  if (!/^-?[0-9][0-9., ]*$/.test(roh)) return false;
  const ist = zahlAusText(eingabe);
  if (!isFinite(ist)) return false;
  return loesung.some((s) => Math.abs(zahlAusText(s) - ist) <= toleranzFuer() + 1e-9);
}
export function gradeBaukasten(frage: BewertbareFrage, zuordnung: unknown): boolean { // {zielIndex: bausteinText}
  if (!zuordnung) return false;
  return frage.ziele!.every((z, i) => feld(zuordnung)[i] === z.loesung);
}
export function gradeMtf(frage: BewertbareFrage, antwort: unknown): boolean { // Array Bool je Aussage (true=wahr markiert). "richtig" nur bei 100 %.
  const aussagen = frage.aussagen!;
  if (!Array.isArray(antwort) || antwort.length !== aussagen.length) return false;
  return aussagen.every((a, i) => typeof antwort[i] === "boolean" && antwort[i] === !!a.wahr);
}
// Teil-Trefferzahl je Aussage (nur Anzeige/Teilpunkte; Wertung fürs Fehler-Deck bleibt gradeMtf=100 %).
export function mtfTreffer(frage: BewertbareFrage, antwort: unknown): number {
  if (!Array.isArray(antwort)) return 0;
  return frage.aussagen!.reduce((n, a, i) => n + (typeof antwort[i] === "boolean" && antwort[i] === !!a.wahr ? 1 : 0), 0);
}
export function gradeSzenario2(frage: BewertbareFrage, antwort: unknown): boolean { // {s1,s2} Indizes. "richtig" nur wenn BEIDE Schritte korrekt.
  if (!antwort || typeof antwort !== "object") return false;
  const a = antwort as { s1?: unknown; s2?: unknown };
  return a.s1 === frage.schritt1!.loesungIndex && a.s2 === frage.schritt2!.loesungIndex;
}
// Teil-Trefferzahl je Schritt (0..2; nur Anzeige/Teilpunkte; Wertung fürs Fehler-Deck bleibt gradeSzenario2=100 %).
export function szenario2Treffer(frage: BewertbareFrage, antwort: unknown): number {
  if (!antwort || typeof antwort !== "object") return 0;
  const a = antwort as { s1?: unknown; s2?: unknown };
  return (a.s1 === frage.schritt1!.loesungIndex ? 1 : 0) + (a.s2 === frage.schritt2!.loesungIndex ? 1 : 0);
}
export function gradeKreuztabelle(frage: BewertbareFrage, antwort: unknown): boolean { // 2D-Bool-Array (zeilen×spalten). "richtig" nur bei 100 %.
  const loesung = frage.loesung!;
  if (!Array.isArray(antwort) || antwort.length !== loesung.length) return false;
  return loesung.every((row, r) => {
    const z: unknown = antwort[r];
    return Array.isArray(z) && z.length === row.length &&
      row.every((soll, c) => (z[c] === true) === !!soll);
  });
}
// Teil-Trefferzahl je Zelle (nur Anzeige/Teilpunkte; Wertung fürs Fehler-Deck bleibt gradeKreuztabelle=100 %).
export function kreuztabelleTreffer(frage: BewertbareFrage, antwort: unknown): number {
  let n = 0;
  frage.loesung!.forEach((row, r) => {
    row.forEach((soll, c) => {
      const zeile: unknown = Array.isArray(antwort) ? antwort[r] : undefined;
      const v = Array.isArray(zeile) ? zeile[c] : undefined;
      if ((v === true) === !!soll) n++;   // richtig gesetzt ODER richtig leer gelassen
    });
  });
  return n;
}

/* ---------------- Fragetyp-Registry (#79) ----------------
   Eine Quelle der Wahrheit je Aufgabentyp. Die DATEN (simAuto/sek/punkte) stehen seit T1 in
   `tabellen/fragetypen.ts`; hier kommen die Bewerter dazu:
     - grade: Bewertungsfunktion (frage, antwort) -> bool; null = nicht automatisch
              bewertbar (freitext/erklaeren) bzw. Bewertung über unterTyp (bild).
   ⛔ Schlüssel-Reihenfolge == TYPEN (der Gleichheitstest prueft sie). */
export const BEWERTER: Record<string, Bewerter | null> = {
  mc: gradeMC,
  freitext: null,
  lueckentext: gradeLueckentext,
  zuordnung: gradeZuordnung,
  bild: null,
  erklaeren: null,
  mehrfach: gradeMehrfach,
  mtf: gradeMtf,
  kreuztabelle: gradeKreuztabelle,
  szenario2: gradeSzenario2,
  reihenfolge: gradeReihenfolge,
  dropdown: gradeDropdown,
  hotspot: gradeHotspot,
  fehlersuche: gradeFehlersuche,
  rechenassistent: gradeRechenassistent,
  matrix: gradeMatrix,
  beschriftung: gradeBeschriftung,
  trace: gradeTrace,
  konsole: gradeKonsole,
  kalkulation: gradeKalkulation,
  baukasten: gradeBaukasten,
};

/** Die ganze Registry wie `L.TYP`: Daten aus T1 + Bewerter. */
export const TYP: Record<string, TypDaten & { grade: Bewerter | null }> = {};
for (const [t, daten] of Object.entries(TYP_DATEN)) TYP[t] = { grade: BEWERTER[t] ?? null, ...daten };   /* TYPEN = Object.keys(TYP_DATEN), gleiche Reihenfolge */

/* Zentrale Bewertung (Registry-Dispatch mit Fallback). Löst bild -> unterTyp auf.
   Rückgabe: bool, oder null wenn nicht automatisch bewertbar bzw. Typ unbekannt. */
export function grade(frage: BewertbareFrage | null | undefined, antwort: unknown): boolean | null {
  if (!frage) return null;
  const t = frage.typ === "bild" ? (frage.unterTyp || "mc") : frage.typ;
  const fn = t === undefined ? undefined : TYP[t]?.grade;
  return (typeof fn === "function") ? fn(frage, antwort) : null;
}
/** Sagt, ob dieser Typ ueberhaupt maschinell bewertet werden kann (bis N34 T6b in `kern/logik.ts`). */
export function istAutomatischBewertbar(typ: string): boolean {
  return typeof TYP[typ]?.grade === "function";
}
/* Zentrale Bewertung fuer Simulationen (AP1 + M09-Klausur, 2026-07-21). simAbgeben in app_sim.js
   hatte bisher eine EIGENE if-Kaskade fuer nur 5 Typen (mc/lueckentext/zuordnung/dropdown/
   mehrfach) - bereits die DRITTE Kopie derselben Typliste (nach der L.TYP-Registry und
   L.SIM_TYPEN). gradeSim buendelt das ueber grade/TYP: liefert IMMER bool (nie null),
   auch bei unbeantworteter oder nicht automatisch bewertbarer Frage (freitext/erklaeren). */
export function gradeSim(frage: BewertbareFrage | null | undefined, antwort: unknown): boolean {
  if (antwort == null) return false;
  return grade(frage, antwort) === true;
}
