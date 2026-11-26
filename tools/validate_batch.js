#!/usr/bin/env node
/* validate_batch.js – Strukturprüfung eines neuen Fragen-Batches (Token-Sparregel 5).
   Aufruf: node tools/validate_batch.js <batch.json>   (im Training-Ordner oder /tmp mit Kopien)
   Prüft: Schema (L.validateFragen), ID-Duplikate gegen den Pool + im Batch, kanonisches thema,
   pruefungsteil, Schwierigkeit 1–4, hotspot: genau 1 richtige Zone + Zonen im viewBox.        */
const fs = require("fs"), path = require("path");
const L = require(path.join(__dirname, "kern.js"));   // N34 T6a (E56): Rechenkern aus neu/src/kern/*.ts, nicht mehr logik.js
const ALT = require(path.join(__dirname, "pool_laden.js")).laden().fragen;  // N29 Teil 2 (E40)
const batch = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
let fehler = 0;
const melde = (/** @type {any} */ id, /** @type {any} */ t) => { console.log("FEHLER " + id + ": " + t); fehler++; };

const v = L.validateFragen(batch);
v.fehler.forEach(/** @param {any} e */ e => melde(e.id, e.meldung));

const altIds = new Set(ALT.map(/** @param {any} f */ f => f.id)), gesehen = new Set();
/* M09 „Unser Unterricht": kanonische Themenliste, Single Source ist L.M09_THEMEN in logik.js
   (bewusst getrennt von L.THEMA_RELEVANZ – Begründung dort). Früher stand die Liste hier als
   lokale Kopie; seit der Integration lesen validate_batch/validate_pool/build_schema dieselbe. */
const M09_THEMEN = new Set(L.M09_THEMEN);
const themen = new Set(Object.keys(L.THEMA_RELEVANZ));
batch.forEach(/** @param {any} f */ f => {
  if (altIds.has(f.id)) melde(f.id, "ID bereits im Pool belegt");
  if (gesehen.has(f.id)) melde(f.id, "ID doppelt im Batch"); gesehen.add(f.id);
  if (!f.id.startsWith(f.modul + "-")) melde(f.id, "Modul != ID-Präfix");
  if (!(f.modul === "M09" ? M09_THEMEN : themen).has(f.thema)) melde(f.id, "thema nicht kanonisch: " + f.thema);
  if (!["AP1", "AP2"].includes(f.pruefungsteil)) melde(f.id, "pruefungsteil fehlt/ungültig");
  if (!(f.schwierigkeit >= 1 && f.schwierigkeit <= 4)) melde(f.id, "schwierigkeit nicht 1–4");
  /* FB-R2b.3: HARTE PRÜFUNG DER AUSWAHL-TYPEN.
     Anlass: Ein Haiku-Batch lieferte 16 mehrfach-Fragen, die hier mit „0 Fehler" durchliefen,
     obwohl 14 davon die Umfangsvorgabe des Auftrags verfehlten. Formale Regeln, die nur im
     Prompt stehen und kein Werkzeug prüft, werden früher oder später verletzt.
     ⚠️ GRENZWERT BEWUSST BEI 4, NICHT BEI 3 (Nutzer-Entscheid 2026-07-21): Der Auftrag hatte
     „2–3 richtige" verlangt, das war aber die Vorgabe EINES Auftrags und nicht der Pool-Standard
     – NACHGEMESSEN haben 31 der 52 vorhandenen mehrfach-Fragen 4 richtige Antworten. Ein
     Grenzwert bei 3 hätte zwei Qualitätsniveaus im Pool erzeugt, also genau das, was R2a beim
     Freitext bewusst aufgelöst hat. Gefangen werden damit echte Ausreißer (5+ Richtige) und
     Fragen ohne verbleibenden Distraktor.
     Ebenfalls neu geprüft: die Kopplung von distraktorErklaerungen an die Lösung. Ein leerer
     String muss GENAU an den richtigen Optionen stehen – sonst erklärt die App dem Lernenden
     eine richtige Antwort als Fehler (oder schweigt zu einem echten Distraktor). */
  const auswahlTyp = f.typ === "bild" ? f.unterTyp : f.typ;
  if (auswahlTyp === "mehrfach") {
    const r = (f.loesungIndizes || []).length, n = (f.optionen || []).length;
    if (r < 2) melde(f.id, "mehrfach: nur " + r + " richtige Antwort(en) – mindestens 2 nötig");
    if (r > 4) melde(f.id, "mehrfach: " + r + " richtige Antworten (Obergrenze 4, sonst zu leicht zu raten)");
    if (n < 4 || n > 6) melde(f.id, "mehrfach: " + n + " Optionen (Vorgabe 4–6)");
    /* Auch hier am BESTAND gemessen statt am Bauchgefühl: „mindestens 2 Distraktoren" wäre eine
       weitere frei erfundene Regel gewesen – 18 der 52 vorhandenen mehrfach-Fragen kommen mit
       genau EINEM Distraktor aus (4 von 5 Optionen richtig). Geprüft wird deshalb nur der
       wirklich kaputte Fall: keine falsche Option mehr übrig. */
    if (n - r < 1) melde(f.id, "mehrfach: alle Optionen sind richtig – kein Distraktor vorhanden");
  }
  if ((auswahlTyp === "mc" || auswahlTyp === "mehrfach") && f.distraktorErklaerungen) {
    const loes = auswahlTyp === "mc" ? [f.loesungIndex] : (f.loesungIndizes || []);
    if (f.distraktorErklaerungen.length !== (f.optionen || []).length)
      melde(f.id, "distraktorErklaerungen: " + f.distraktorErklaerungen.length + " Einträge, aber " + (f.optionen || []).length + " Optionen");
    else f.distraktorErklaerungen.forEach((/** @type {any} */ t, /** @type {number} */ i) => {
      const richtig = loes.indexOf(i) >= 0, leer = (t || "").trim() === "";
      if (richtig && !leer) melde(f.id, "Option " + i + " ist richtig, hat aber eine Distraktor-Erklärung");
      if (!richtig && leer) melde(f.id, "Option " + i + " ist ein Distraktor, hat aber keine Erklärung");
    });
  }
  if (Array.isArray(f.optionen) && new Set(f.optionen).size !== f.optionen.length)
    melde(f.id, "doppelte Option im Antwortsatz");
  if (f.typ === "hotspot") {
    const r = (f.zonen || []).filter(/** @param {any} z */ z => z.richtig === true).length;
    if (r !== 1) melde(f.id, "hotspot: " + r + " richtige Zonen (genau 1 nötig)");
    const vb = ((f.svg || "").match(/viewBox=['"]([\d\s.]+)['"]/) || [])[1];
    if (!vb) melde(f.id, "hotspot: kein viewBox");
    else { const [, , W, H] = vb.split(/\s+/).map(Number);
      (f.zonen || []).forEach((/** @type {any} */ z, /** @type {number} */ i) => { if (z.x < 0 || z.y < 0 || z.x + z.w > W || z.y + z.h > H)
        melde(f.id, "Zone " + i + " außerhalb viewBox"); }); }
    (f.zonen || []).forEach((/** @type {any} */ z, /** @type {number} */ i) => {
      const rect = "x='" + z.x + "' y='" + z.y + "' width='" + z.w + "' height='" + z.h + "'";
      if ((f.svg || "").indexOf(rect) < 0) melde(f.id, "Zone " + i + " (" + rect + ") hat kein deckungsgleiches rect im SVG");
    });
  }
});

/* ---- Self-Grading: eigene Musterlösung durch den echten Grader (auto-bewertbare Typen). ----
   Fängt mechanische Fehler (loesungIndex/-Indizes vertauscht, falsche Zone, dropdown-loesung),
   die Struktur-Checks nicht sehen. Nicht-konstruierbare Typen (freitext/erklaeren/rechenassistent/
   kalkulation/trace/konsole/matrix/beschriftung/baukasten/fehlersuche) → n/a (brauchen Fachprüfung). */
function korrektAntwort(/** @type {any} */ f) {
  const t = f.typ === "bild" ? f.unterTyp : f.typ;
  switch (t) {
    case "mc": return f.loesungIndex;
    case "mehrfach": return f.loesungIndizes;
    case "dropdown": return (f.luecken || []).map(/** @param {any} l */ l => l.loesung);
    case "zuordnung": { const m = {}; (f.paare || []).forEach((/** @type {any} */ _, /** @type {number} */ i) => /** @type {Record<number, number>} */ (m)[i] = i); return m; }
    case "reihenfolge": return (f.schritte || []).map((/** @type {any} */ _, /** @type {number} */ i) => i);
    case "lueckentext": return f.loesung;
    case "hotspot": return (f.zonen || []).findIndex(/** @param {any} z */ z => z.richtig === true);
    default: return undefined;
  }
}
function selfGrade(/** @type {any} */ f) {
  const t = f.typ === "bild" ? f.unterTyp : f.typ;
  const a = korrektAntwort(f);
  if (a === undefined) return null;              // n/a
  try {
    if (t === "mc") return L.gradeMC(f, a);
    if (t === "mehrfach") return L.gradeMehrfach(f, a);
    if (t === "dropdown") return L.gradeDropdown(f, a);
    if (t === "zuordnung") return L.gradeZuordnung(f, a);
    if (t === "reihenfolge") return L.gradeReihenfolge(f, a);
    if (t === "lueckentext") return L.gradeLueckentext(f, a);
    if (t === "hotspot") return L.gradeHotspot(f, a);
  } catch (e) { return "ERR:" + /** @type {Error} */ (e).message; }
  return null;
}

/* ---- Review-Digest: eine Zeile je Frage (Scan statt rohes JSON lesen) ---- */
console.log("\n--- Review-Digest ---");
console.log("id".padEnd(12) + " mod  st typ".padEnd(20) + " selfgrade  thema");
batch.forEach(/** @param {any} f */ f => {
  const t = f.typ === "bild" ? "bild:" + f.unterTyp : f.typ;
  const r = selfGrade(f);
  let sg;
  if (r === null) sg = "n/a ";
  else if (r === true) sg = "OK  ";
  else { sg = "FALSCH"; melde(f.id, "Self-Grade FALSCH – Musterlösung wird vom Grader nicht als korrekt gewertet (" + r + ")"); }
  console.log(String(f.id).padEnd(12) + " " + String(f.modul).padEnd(4) + " " +
    String(f.schwierigkeit) + "  " + String(t).padEnd(16) + " " + sg.padEnd(9) + " " + (f.thema || ""));
});

console.log("\n" + batch.length + " Fragen geprüft, " + fehler + " Fehler");
process.exit(fehler ? 1 : 0);
