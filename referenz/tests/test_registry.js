/* Node-Testskript: node test_registry.js – prüft Fragetyp-Registry L.TYP (#79):
   Konsolidierung (grade/simAuto/sek/punkte je Typ), abgeleitete Sichten
   (TYPEN/SIM_TYPEN/TYP_META) und zentraler Dispatcher L.grade. */
"use strict";
const L = require("./logik.js");
let ok = 0, fail = 0;
function t(name, bed) { if (bed) { ok++; } else { fail++; console.log("FEHLER: " + name); } }

/* ---- Registry vorhanden + wohlgeformt ---- */
t("L.TYP ist Objekt", L.TYP && typeof L.TYP === "object");
t("L.TYP hat 21 Typen", Object.keys(L.TYP).length === 21);
t("L.grade ist Funktion", typeof L.grade === "function");

Object.keys(L.TYP).forEach(function (ty) {
  const e = L.TYP[ty];
  t("TYP['" + ty + "'].grade fn|null", e && (typeof e.grade === "function" || e.grade === null));
  t("TYP['" + ty + "'].simAuto bool", e && typeof e.simAuto === "boolean");
  t("TYP['" + ty + "'].sek plausibel", e && e.sek >= 30 && e.sek <= 300);
  t("TYP['" + ty + "'].punkte plausibel", e && e.punkte >= 1 && e.punkte <= 5);
});

/* ---- Abgeleitete Sichten stimmen mit Registry überein ---- */
t("TYPEN == Object.keys(TYP)", JSON.stringify(L.TYPEN) === JSON.stringify(Object.keys(L.TYP)));
const simSoll = L.TYPEN.filter(function (x) { return L.TYP[x].simAuto; });
t("SIM_TYPEN == simAuto-Filter", JSON.stringify([...L.SIM_TYPEN].sort()) === JSON.stringify([...simSoll].sort()));
t("SIM_TYPEN-Inhalt unverändert",
  JSON.stringify([...L.SIM_TYPEN].sort()) ===
  JSON.stringify(["mc", "lueckentext", "zuordnung", "bild", "mehrfach", "mtf", "reihenfolge", "dropdown"].sort()));
let metaOk = true;
L.TYPEN.forEach(function (ty) {
  const m = L.TYP_META[ty];
  if (!m || m.sek !== L.TYP[ty].sek || m.punkte !== L.TYP[ty].punkte) metaOk = false;
});
t("TYP_META == Registry sek/punkte", metaOk);

/* ---- grade-Zuordnung ist identisch zu den exportierten grade-Funktionen ---- */
const map = {
  mc: L.gradeMC, lueckentext: L.gradeLueckentext, zuordnung: L.gradeZuordnung,
  mehrfach: L.gradeMehrfach, reihenfolge: L.gradeReihenfolge, dropdown: L.gradeDropdown,
  hotspot: L.gradeHotspot, fehlersuche: L.gradeFehlersuche, rechenassistent: L.gradeRechenassistent,
  matrix: L.gradeMatrix, beschriftung: L.gradeBeschriftung, trace: L.gradeTrace,
  konsole: L.gradeKonsole, kalkulation: L.gradeKalkulation, baukasten: L.gradeBaukasten
};
Object.keys(map).forEach(function (ty) {
  t("TYP['" + ty + "'].grade === L.grade" + ty, L.TYP[ty].grade === map[ty]);
});
t("freitext.grade === null", L.TYP.freitext.grade === null);
t("erklaeren.grade === null", L.TYP.erklaeren.grade === null);
t("bild.grade === null (Dispatch über unterTyp)", L.TYP.bild.grade === null);

/* ---- Zentraler Dispatcher L.grade ---- */
t("grade(mc, richtig) == true", L.grade({ typ: "mc", loesungIndex: 2 }, 2) === true);
t("grade(mc, falsch) == false", L.grade({ typ: "mc", loesungIndex: 2 }, 0) === false);
t("grade(bild->mc) löst unterTyp auf", L.grade({ typ: "bild", unterTyp: "mc", loesungIndex: 1 }, 1) === true);
t("grade(bild ohne unterTyp) -> default mc", L.grade({ typ: "bild", loesungIndex: 0 }, 0) === true);
t("grade(freitext) == null (nicht auto-bewertbar)", L.grade({ typ: "freitext" }, "x") === null);
t("grade(unbekannt) == null (Fallback)", L.grade({ typ: "gibtsnicht" }, "x") === null);
t("grade(null) == null", L.grade(null, "x") === null);
/* Dispatcher liefert exakt dasselbe wie die direkte grade-Funktion */
const dd = { typ: "dropdown", luecken: [{ optionen: ["a", "b"], loesung: 1 }] };
t("grade(dropdown) == gradeDropdown", L.grade(dd, [1]) === L.gradeDropdown(dd, [1]));

/* ---- Konsistenz gegen echten Pool: jede auto-bewertbare Frage dispatcht ohne Fehler ---- */
let FRAGEN = null;
try { FRAGEN = require("./fragen.js"); } catch (e) { /* noch nicht gebaut */ }
if (Array.isArray(FRAGEN)) {
  let dispatchOk = true, geprueft = 0;
  FRAGEN.forEach(function (f) {
    const it = f.typ === "bild" ? (f.unterTyp || "mc") : f.typ;
    if (L.TYP[it] && typeof L.TYP[it].grade === "function") {
      geprueft++;
      try { L.grade(f, undefined); } catch (e) { dispatchOk = false; }  // darf nicht werfen
    }
  });
  t("L.grade dispatcht " + geprueft + " auto-bewertbare Fragen ohne Exception", dispatchOk);
} else {
  console.log("(fragen.js noch nicht gebaut – Pool-Konsistenz übersprungen)");
}

console.log("\n==== " + ok + " Tests OK, " + fail + " Fehler ====");
process.exit(fail ? 1 : 0);
