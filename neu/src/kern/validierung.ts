/* ============================================================================
   N34 T6a (E50, E56, 26.09.2026): DIE SCHEMA-PRUEFUNG DES POOLS AUS `logik.js`
   Uebernommen aus `referenz/logik.js` (Z. 416-648, `L.validateFragen`) – Regeln UND Kommentare
   wortgleich. Gerufen von den Pool-Werkzeugen (`tools/validate_*.js`, `build_schema.js`), nicht von
   der App. Tabellen aus T1, Formeln/Werte aus T5, Runden aus T2.
   ⚠️ Der Eingang ist ROHES JSON, dessen Form hier erst geprueft wird – deshalb `Roh = any`: ein
      erfundener Typ waere hier eine Behauptung ueber genau das, was diese Funktion erst misst.
   ⚠️ `zieheWert` ohne rng in der Stichprobe: wie in logik.js wird mit Math.random gewuerfelt.
   Gehalten von `validierung.gleichheit.test.ts` gegen `referenz/logik.js`.
   ⛔ Importiert wird relativ mit Endung `.ts`, nie ueber `@/` (E49).
   ============================================================================ */
import { TYPEN } from "./tabellen/fragetypen.ts";
import { evalFormel, zieheWert } from "./rechenaufgabe.ts";
import { rundeAuf } from "./zahlen.ts";

// oxlint-disable-next-line typescript/no-explicit-any
type Roh = any;
export interface PruefFehler { id: string; index?: number; meldung: string }

type Need = (feld: string, bed: unknown) => void;
type Pruefung = (f: Roh, need: Need) => void;

/* N44 C1 (18.10.2026): die eine lange Verzweigung je Fragetyp ist als PRUEFLISTE zerlegt – je Typ eine
   Funktion, gewaehlt ueber `NACH_TYP` (typ) bzw. `NACH_INNENTYP` (typ, bei `bild` der unterTyp).
   Reiner Umbau: Regeln, Meldungen und ihre Reihenfolge wie vorher (gehalten vom Gleichheitstest).
   ⚠️ Nicht aus `tools/schema/frage.schema.json` abgeleitet: das Schema ist der SPIEGEL dieser Regeln
      (`build_schema.js`: „Quelle der Wahrheit bleibt validateFragen“), weicht bewusst ab
      (`schema.deckung.test.ts`) und kennt weder die Meldungstexte noch die Rechenproben.
   ⚠️ Ausdruecke, die werfen koennen (`(f.frage || "").match`, `(f.schritte || []).forEach`, `r.some` …),
      stehen wortgleich wie vorher: V8 baut aus ihrem Text die Meldung, und die vergleicht der Gleichheitstest. */
function pruefeKopf(f: Roh, ids: Record<string, boolean>, probleme: string[], need: Need): void {
  need("id", typeof f.id === "string" && f.id.length > 0);
  if (f.id && ids[f.id]) probleme.push("doppelte ID '" + f.id + "'");
  if (f.id) ids[f.id] = true;
  need("pruefungsteil", f.pruefungsteil === "AP1" || f.pruefungsteil === "AP2");
  need("modul", typeof f.modul === "string" && /^M0[1-9]$/.test(f.modul));   // M09 = „Klausurvorbereitung" (2026-07-20)
  need("thema", typeof f.thema === "string" && f.thema.length > 0);
  need("typ", TYPEN.indexOf(f.typ) >= 0);
  need("schwierigkeit", [1, 2, 3, 4].indexOf(f.schwierigkeit) >= 0);
  need("frage", typeof f.frage === "string" && f.frage.length > 0);
}

function pruefeBild(f: Roh, need: Need): void {
  need("svg", typeof f.svg === "string" && f.svg.indexOf("<svg") >= 0);
  need("unterTyp", ["mc", "lueckentext", "dropdown"].indexOf(f.unterTyp) >= 0);
}

function pruefeMc(f: Roh, need: Need): void {
  need("optionen", Array.isArray(f.optionen) && f.optionen.length === 4 &&
    f.optionen.every((o: Roh) => typeof o === "string" && o.length > 0));
  need("loesungIndex", typeof f.loesungIndex === "number" && f.loesungIndex >= 0 &&
    f.optionen && f.loesungIndex < f.optionen.length);
}

function pruefeLueckentext(f: Roh, need: Need): void {
  need("luecken", Array.isArray(f.luecken) && f.luecken.length > 0 &&
    f.luecken.every((l: Roh) => Array.isArray(l) && l.length > 0));
  need("frage (Lücken)", ((f.frage || "").match(/___/g) || []).length === (f.luecken || []).length);
}

function pruefeZuordnung(f: Roh, need: Need): void {
  need("paare", Array.isArray(f.paare) && f.paare.length >= 3 &&
    f.paare.every((p: Roh) => Array.isArray(p) && p.length === 2));
}

/* Seit 2026-07-20 darf ein Eintrag auch eine ALTERNATIVLISTE sein (>= 2 Strings) –
   gleiche Regel wie im JSON-Schema und in gradeTeilpunkte. Vorher lehnte NUR diese
   Stelle Listen ab, womit eine gueltige Pool-Frage beim Boot still rausgefallen waere. */
const eintragOk = (x: Roh): boolean => {
  if (typeof x === "string") return x.trim().length > 0;
  return Array.isArray(x) && x.length >= 2 && x.every((y: Roh) => typeof y === "string" && y.trim().length > 0);
};
const strListe = (a: Roh): boolean => Array.isArray(a) && a.every(eintragOk);

function pruefeFreitext(f: Roh, need: Need): void {
  need("musterloesung", typeof f.musterloesung === "string" && f.musterloesung.length > 0);
  if (f.schluesselbegriffe != null) {   // #76: optional, abwärtskompatibel
    const sb = f.schluesselbegriffe;
    need("schluesselbegriffe.pflicht (nicht leer)", sb && typeof sb === "object" && strListe(sb.pflicht) && sb.pflicht.length >= 1);
    need("schluesselbegriffe.kuer (optional, Strings/Alternativlisten)", !sb || sb.kuer == null || strListe(sb.kuer));
  }
}

function pruefeMehrfach(f: Roh, need: Need): void {
  need("optionen", Array.isArray(f.optionen) && f.optionen.length >= 3 &&
    f.optionen.every((o: Roh) => typeof o === "string" && o.length > 0));
  need("loesungIndizes", Array.isArray(f.loesungIndizes) && f.loesungIndizes.length >= 1 &&
    f.loesungIndizes.every((x: Roh) => typeof x === "number" && x >= 0 && f.optionen && x < f.optionen.length));
}

function pruefeMtf(f: Roh, need: Need): void {
  need("aussagen", Array.isArray(f.aussagen) && f.aussagen.length >= 3 &&
    f.aussagen.every((a: Roh) => a && typeof a.text === "string" && a.text.length > 0 && typeof a.wahr === "boolean"));
}

function pruefeKreuztabelle(f: Roh, need: Need): void {
  need("zeilen", Array.isArray(f.zeilen) && f.zeilen.length >= 2 &&
    f.zeilen.every((z: Roh) => typeof z === "string" && z.length > 0));
  need("spalten", Array.isArray(f.spalten) && f.spalten.length >= 2 &&
    f.spalten.every((s: Roh) => typeof s === "string" && s.length > 0));
  need("loesung (Matrix zeilen×spalten, bool)", Array.isArray(f.loesung) && f.loesung.length === (f.zeilen || []).length &&
    f.loesung.every((row: Roh) => Array.isArray(row) && row.length === (f.spalten || []).length &&
      row.every((c: Roh) => typeof c === "boolean")));
  need("mind. eine wahre Zelle", Array.isArray(f.loesung) && f.loesung.some((row: Roh) => Array.isArray(row) && row.some(Boolean)));
}

const okSchritt = (s: Roh): boolean =>
  s && typeof s === "object" && typeof s.frage === "string" && s.frage.length > 0 &&
    Array.isArray(s.optionen) && s.optionen.length >= 2 &&
    s.optionen.every((o: Roh) => typeof o === "string" && o.length > 0) &&
    typeof s.loesungIndex === "number" && s.loesungIndex >= 0 && s.loesungIndex < s.optionen.length;

function pruefeSzenario2(f: Roh, need: Need): void {
  need("schritt1", okSchritt(f.schritt1));
  need("schritt2", okSchritt(f.schritt2));
  need("feedback1 (je Schritt-1-Option)", Array.isArray(f.feedback1) && f.schritt1 && Array.isArray(f.schritt1.optionen) &&
    f.feedback1.length === f.schritt1.optionen.length &&
    f.feedback1.every((x: Roh) => typeof x === "string" && x.length > 0));
}

function pruefeReihenfolge(f: Roh, need: Need): void {
  need("schritte", Array.isArray(f.schritte) && f.schritte.length >= 3 &&
    f.schritte.every((s: Roh) => typeof s === "string" && s.length > 0));
}

function pruefeDropdown(f: Roh, need: Need): void {
  need("luecken", Array.isArray(f.luecken) && f.luecken.length > 0 &&
    f.luecken.every((l: Roh) => l && Array.isArray(l.optionen) && l.optionen.length >= 2 &&
      typeof l.loesung === "number" && l.loesung >= 0 && l.loesung < l.optionen.length));
  need("frage (Dropdown-Lücken)", ((f.frage || "").match(/___/g) || []).length === (f.luecken || []).length);
  // #102 optionale Erweiterungen (abwärtskompatibel): Freitext-Startmodus + zusätzliche Freitext-Schreibweisen
  need("freitext (optional bool)", f.freitext == null || typeof f.freitext === "boolean");
  need("luecken[].akzeptiert (optional String[])", Array.isArray(f.luecken) && f.luecken.every((l: Roh) =>
    !l || l.akzeptiert == null || (Array.isArray(l.akzeptiert) && l.akzeptiert.every((x: Roh) => typeof x === "string" && x.trim().length > 0))));
}

function pruefeHotspot(f: Roh, need: Need): void {
  need("svg", typeof f.svg === "string" && f.svg.indexOf("<svg") >= 0);
  need("zonen", Array.isArray(f.zonen) && f.zonen.length >= 2 &&
    f.zonen.some((z: Roh) => z && z.richtig) &&
    f.zonen.every((z: Roh) => z && typeof z.x === "number" && typeof z.y === "number" && typeof z.w === "number" && typeof z.h === "number"));
}

function pruefeFehlersuche(f: Roh, need: Need): void {
  need("zeilen", Array.isArray(f.zeilen) && f.zeilen.length >= 2 && f.zeilen.every((z: Roh) => typeof z === "string"));
  need("fehlerZeile", typeof f.fehlerZeile === "number" && f.fehlerZeile >= 0 && f.zeilen && f.fehlerZeile < f.zeilen.length);
}

function pruefeRechenassistent(f: Roh, need: Need): void {
  const randomisiert = !!(f.variablen && typeof f.variablen === "object" && !Array.isArray(f.variablen));
  need("schritte", Array.isArray(f.schritte) && f.schritte.length >= 2 &&
    f.schritte.every((s: Roh) => {
      if (!s || typeof s.text !== "string" || !s.text.length) return false;
      /* #35: randomisierte Aufgaben tragen je Schritt eine Formel statt fester Lösungen. */
      if (randomisiert) return typeof s.formel === "string" && s.formel.length > 0;
      return Array.isArray(s.loesung) && s.loesung.length >= 1;
    }));
  if (randomisiert) pruefeRandomisiert(f, need);
}

function pruefeRandomisiert(f: Roh, need: Need): void {
  const varNamen = Object.keys(f.variablen);
  need("variablen (min<=max, schritt>0)", varNamen.length >= 1 && varNamen.every((k) => {
    const d = f.variablen[k];
    return d && typeof d.min === "number" && typeof d.max === "number" && d.max >= d.min &&
      (d.schritt == null || (typeof d.schritt === "number" && d.schritt > 0));
  }));
  need("variablennamen kollidieren nicht mit s1..sN", varNamen.every((k) => !/^s\d+$/.test(k)));
  /* Formeln müssen mit Testwerten fehlerfrei durchrechnen und dürfen nur bekannte
     Bezeichner nutzen (Variablen + bereits berechnete Vorgängerschritte).          */
  const probe: Record<string, number> = {};
  let ok = true, meldung = "";
  varNamen.forEach((k) => { probe[k] = zieheWert(f.variablen[k], () => 0.5); });
  (f.schritte || []).forEach((s: Roh, si: number) => {
    if (!ok || !s || typeof s.formel !== "string") return;
    try { probe["s" + (si + 1)] = rundeAuf(evalFormel(s.formel, probe), s.dezimalen); }
    catch (e) { ok = false; meldung = e instanceof Error ? e.message : String(e); }
  });
  need("formeln rechenbar" + (ok ? "" : " (" + meldung + ")"), ok);
  if (ok) {
    const entartet = entartung(f, varNamen);
    need("formeln fuer ALLE zulaessigen Werte rechenbar" + (entartet ? " (" + entartet + ")" : ""), !entartet);
  }
  const offen = offenePlatzhalter(f, probe);
  need("platzhalter aufloesbar" + (offen.length ? " (" + offen.join(",") + ")" : ""), offen.length === 0);
}

/* Nicht nur EINE Probe: alle Extremkombinationen (min/max je Variable) plus eine
   Zufallsstichprobe. So faellt schon zur Bauzeit auf, wenn eine zulaessige
   Kombination entartet (z. B. Ersparnis 0 -> Division durch 0).            */
function entartung(f: Roh, varNamen: string[]): string {
  let entartet = "";
  const kombis: Array<Record<string, number>> = [];
  const grenzen = varNamen.map((k) => [f.variablen[k].min, f.variablen[k].max]);
  const anzahl = Math.min(Math.pow(2, varNamen.length), 64);
  for (let c = 0; c < anzahl; c++) {
    const w: Record<string, number> = {};
    varNamen.forEach((k, bi) => { w[k] = grenzen[bi]![(c >> bi) & 1]; });
    kombis.push(w);
  }
  for (let z = 0; z < 40; z++) {
    const wz: Record<string, number> = {};
    varNamen.forEach((k) => { wz[k] = zieheWert(f.variablen[k]); });
    kombis.push(wz);
  }
  kombis.forEach((w) => {
    if (entartet) return;
    const wv: Record<string, number> = Object.assign({}, w);
    for (let si = 0; si < f.schritte.length; si++) {
      try { wv["s" + (si + 1)] = rundeAuf(evalFormel(f.schritte[si].formel, wv), f.schritte[si].dezimalen); }
      catch (e) { entartet = (e instanceof Error ? e.message : String(e)) + " bei " + JSON.stringify(w); return; }
    }
  });
  return entartet;
}

/* Platzhalter müssen mit den Probewerten auflösbar sein (sonst bliebe "{x}" sichtbar). */
function offenePlatzhalter(f: Roh, probe: Record<string, number>): string[] {
  const offen: string[] = [];
  [f.frage, f.erklaerungKurz, f.erklaerungLang].concat((f.schritte || []).map((s: Roh) => s && s.text))
    .forEach((txt: Roh) => {
      (String(txt || "").match(/\{[^{}]+\}/g) ?? []).forEach((ph) => {
        const ausdruck = ph.slice(1, -1).split("|")[0]!.trim();
        try { evalFormel(ausdruck, probe); } catch { if (offen.indexOf(ph) < 0) offen.push(ph); }
      });
    });
  return offen;
}

function pruefeMatrix(f: Roh, need: Need): void {
  need("quadranten", Array.isArray(f.quadranten) && f.quadranten.length === 4 && f.quadranten.every((q: Roh) => typeof q === "string" && q.length > 0));
  need("elemente", Array.isArray(f.elemente) && f.elemente.length >= 2 &&
    f.elemente.every((e: Roh) => e && typeof e.text === "string" && e.text.length > 0 && typeof e.quadrant === "number" && e.quadrant >= 0 && e.quadrant < 4));
}

function pruefeBeschriftung(f: Roh, need: Need): void {
  need("svg", typeof f.svg === "string" && f.svg.indexOf("<svg") >= 0);
  need("ziele", Array.isArray(f.ziele) && f.ziele.length >= 2 && f.ziele.every((z: Roh) => z && typeof z.loesung === "string" && z.loesung.length > 0));
  need("labels", Array.isArray(f.labels) && f.labels.length >= (f.ziele || []).length &&
    (f.ziele || []).every((z: Roh) => (f.labels || []).indexOf(z.loesung) >= 0));
}

function pruefeTrace(f: Roh, need: Need): void {
  need("code", Array.isArray(f.code) && f.code.length >= 1 && f.code.every((l: Roh) => typeof l === "string"));
  need("spalten", Array.isArray(f.spalten) && f.spalten.length >= 1 && f.spalten.every((s: Roh) => typeof s === "string" && s.length > 0));
  need("zeilen", Array.isArray(f.zeilen) && f.zeilen.length >= 1 &&
    f.zeilen.every((r: Roh) => Array.isArray(r) && r.length === (f.spalten || []).length));
}

function pruefeKonsole(f: Roh, need: Need): void {
  need("aufgaben", Array.isArray(f.aufgaben) && f.aufgaben.length >= 1 &&
    f.aufgaben.every((a: Roh) => a && typeof a.prompt === "string" && a.prompt.length > 0 && Array.isArray(a.akzeptiert) && a.akzeptiert.length >= 1));
}

function pruefeKalkulation(f: Roh, need: Need): void {
  need("kopf", Array.isArray(f.kopf) && f.kopf.length >= 1);
  need("zeilen", Array.isArray(f.zeilen) && f.zeilen.length >= 1 &&
    f.zeilen.every((r: Roh) => Array.isArray(r) && r.length === (f.kopf || []).length &&
      r.every((c: Roh) => c && (typeof c.v === "string" || Array.isArray(c.loesung)))));
  need("min. eine Lösungszelle", f.zeilen && f.zeilen.some((r: Roh) => r.some((c: Roh) => Array.isArray(c.loesung))));
}

function pruefeBaukasten(f: Roh, need: Need): void {
  need("geruest", Array.isArray(f.geruest) && f.geruest.length >= 1 && f.geruest.every((l: Roh) => typeof l === "string"));
  need("ziele", Array.isArray(f.ziele) && f.ziele.length >= 2 && f.ziele.every((z: Roh) => z && typeof z.loesung === "string" && z.loesung.length > 0));
  need("bausteine", Array.isArray(f.bausteine) && f.bausteine.length >= (f.ziele || []).length &&
    (f.ziele || []).every((z: Roh) => (f.bausteine || []).indexOf(z.loesung) >= 0));
}

/** Nach `typ`. Je Typ hoechstens ein Eintrag; `bild` laeuft VOR seinem Innentyp (wie vorher). */
const NACH_TYP = new Map<unknown, Pruefung>([
  ["bild", pruefeBild], ["zuordnung", pruefeZuordnung], ["freitext", pruefeFreitext], ["erklaeren", pruefeFreitext],
  ["mehrfach", pruefeMehrfach], ["mtf", pruefeMtf], ["kreuztabelle", pruefeKreuztabelle], ["szenario2", pruefeSzenario2],
  ["reihenfolge", pruefeReihenfolge], ["dropdown", pruefeDropdown], ["hotspot", pruefeHotspot], ["fehlersuche", pruefeFehlersuche],
  ["rechenassistent", pruefeRechenassistent], ["matrix", pruefeMatrix], ["beschriftung", pruefeBeschriftung], ["trace", pruefeTrace],
  ["konsole", pruefeKonsole], ["kalkulation", pruefeKalkulation], ["baukasten", pruefeBaukasten],
]);
/** Nach dem Innentyp: `typ`, bei `bild` der `unterTyp` (Vorgabe `mc`). */
const NACH_INNENTYP = new Map<unknown, Pruefung>([["mc", pruefeMc], ["lueckentext", pruefeLueckentext]]);

/** Alle Probleme EINER Frage (Objekt), in der festen Reihenfolge: Kopf, Typ, Innentyp, Erklaerung. */
function problemeDerFrage(f: Roh, ids: Record<string, boolean>): string[] {
  const probleme: string[] = [];
  function need(feld: string, bed: unknown): void { if (!bed) probleme.push("Feld '" + feld + "' fehlt oder ist ungültig"); }
  pruefeKopf(f, ids, probleme, need);
  const t = f.typ;
  const iTyp = (t === "bild") ? (f.unterTyp || "mc") : t;
  NACH_TYP.get(t)?.(f, need);
  NACH_INNENTYP.get(iTyp)?.(f, need);
  need("erklaerungKurz", typeof f.erklaerungKurz === "string" && f.erklaerungKurz.length > 0);
  if (t === "mc") {
    need("distraktorErklaerungen", Array.isArray(f.distraktorErklaerungen) && f.distraktorErklaerungen.length === 4);
  }
  return probleme;
}

/** Zahlenvarianz: jede Variante – gemergt mit der Basisfrage – als eigene Frage. */
function variantenAus(gueltig: Roh[]): Roh[] {
  const variantenExpandiert: Roh[] = [];
  gueltig.forEach((f) => {
    if (!Array.isArray(f.varianten)) return;
    f.varianten.forEach((v: Roh, vi: number) => {
      const merged = Object.assign({}, f, v, { id: f.id + "#v" + vi });
      delete merged.varianten;
      variantenExpandiert.push(merged);
    });
  });
  return variantenExpandiert;
}

export function validateFragen(fragen: unknown): { gueltig: Roh[]; fehler: PruefFehler[] } {
  const fehler: PruefFehler[] = [], gueltig: Roh[] = [], ids: Record<string, boolean> = {};
  if (!Array.isArray(fragen)) return { gueltig: [], fehler: [{ id: "-", meldung: "FRAGEN ist kein Array" }] };
  fragen.forEach((f, i) => {
    if (!f || typeof f !== "object") { fehler.push({ id: "?", index: i, meldung: "Eintrag " + i + " ist kein Objekt" }); return; }
    const probleme = problemeDerFrage(f, ids);
    if (probleme.length) fehler.push({ id: f.id || ("Eintrag " + i), index: i, meldung: probleme.join("; ") });
    else gueltig.push(f);
  });
  // Zahlenvarianz: jede Variante muss – gemergt mit der Basisfrage – ebenfalls valide sein
  const variantenExpandiert = variantenAus(gueltig);
  if (variantenExpandiert.length) {
    const vv = validateFragen(variantenExpandiert);
    vv.fehler.forEach((e) => { fehler.push({ id: e.id, meldung: "Variante ungültig: " + e.meldung }); });
  }
  return { gueltig, fehler };
}
