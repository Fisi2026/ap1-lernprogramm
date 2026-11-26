/* Node-Testskript: node test_note.js – G3.6(a) #5 IHK-Notenschlüssel + Simulations-Auswertung.
   Prüft die Notengrenzen 92/81/67/50/30 inklusive der neuen Trennung mangelhaft (5) / ungenügend (6),
   die Bestehensgrenze bei 50 % und die Kennzahlen aus L.simErgebnis. Reine Logik, kein jsdom. */
"use strict";
const L = require("./logik.js");
let ok = 0, fail = 0;
function t(name, bed) { if (bed) { ok++; } else { fail++; console.log("FEHLER: " + name); } }

/* ---- Notengrenzen: jeweils AUF der Grenze und knapp darunter ---- */
t("100 % = Note 1", L.note(100).note === 1);
t("92 % = Note 1 (Grenze)", L.note(92).note === 1);
t("91,9 % = Note 2", L.note(91.9).note === 2);
t("81 % = Note 2 (Grenze)", L.note(81).note === 2);
t("80,9 % = Note 3", L.note(80.9).note === 3);
t("67 % = Note 3 (Grenze)", L.note(67).note === 3);
t("66,9 % = Note 4", L.note(66.9).note === 4);
t("50 % = Note 4 (Grenze)", L.note(50).note === 4);
t("49,9 % = Note 5", L.note(49.9).note === 5);
t("30 % = Note 5 (Grenze)", L.note(30).note === 5);
t("29,9 % = Note 6", L.note(29.9).note === 6);
t("0 % = Note 6", L.note(0).note === 6);

/* ---- Notentexte ---- */
t("Note 1 heißt 'sehr gut'", L.note(95).text === "sehr gut");
t("Note 2 heißt 'gut'", L.note(85).text === "gut");
t("Note 3 heißt 'befriedigend'", L.note(70).text === "befriedigend");
t("Note 4 heißt 'ausreichend'", L.note(55).text === "ausreichend");
t("Note 5 heißt 'mangelhaft'", L.note(40).text === "mangelhaft");
t("Note 6 heißt 'ungenügend'", L.note(10).text === "ungenügend");

/* ---- Bestehensgrenze ---- */
t("50 % ist bestanden", L.note(50).bestanden === true);
t("49,9 % ist nicht bestanden", L.note(49.9).bestanden === false);
t("Note 5 ist nie bestanden", L.note(35).bestanden === false);
t("Note 6 ist nie bestanden", L.note(5).bestanden === false);
t("100 % ist bestanden", L.note(100).bestanden === true);

/* ---- Robustheit ---- */
t("negativer Wert -> Note 6", L.note(-5).note === 6);
t("über 100 -> Note 1", L.note(120).note === 1);
t("undefined -> Note 6, nicht bestanden", L.note(undefined).note === 6 && !L.note(undefined).bestanden);
t("NaN -> Note 6", L.note(NaN).note === 6);
t("Schlüssel ist absteigend sortiert", L.NOTEN_SCHLUESSEL.every(function (s, i, a) {
  return i === 0 || a[i - 1].ab > s.ab;
}));
t("Schlüssel deckt Note 1 bis 6 ab",
  L.NOTEN_SCHLUESSEL.map(function (s) { return s.note; }).join(",") === "1,2,3,4,5,6");

/* ---- Simulations-Auswertung ---- */
{
  const fragen = [
    { id: "A", modul: "M01" }, { id: "B", modul: "M01" },
    { id: "C", modul: "M03" }, { id: "D", modul: "M03" }
  ];
  const erg = L.simErgebnis(fragen, [true, true, true, false]);
  t("simErgebnis: Punkte gezählt", erg.punkte === 3);
  t("simErgebnis: Gesamtzahl", erg.gesamt === 4);
  t("simErgebnis: Prozent auf eine Nachkommastelle", erg.prozent === 75);
  t("simErgebnis: Note aus Prozent abgeleitet", erg.note.note === 3);
  t("simErgebnis: bestanden", erg.note.bestanden === true);
  t("simErgebnis: proModul M01 vollständig", erg.proModul.M01.richtig === 2 && erg.proModul.M01.gesamt === 2);
  t("simErgebnis: proModul M03 teilweise", erg.proModul.M03.richtig === 1 && erg.proModul.M03.gesamt === 2);

  const leer = L.simErgebnis([], []);
  t("simErgebnis: leere Simulation ohne Division durch 0", leer.prozent === 0 && leer.gesamt === 0);
  t("simErgebnis: leere Simulation -> Note 6", leer.note.note === 6);

  const alleFalsch = L.simErgebnis(fragen, [false, false, false, false]);
  t("simErgebnis: 0 % -> Note 6, nicht bestanden",
    alleFalsch.prozent === 0 && alleFalsch.note.note === 6 && !alleFalsch.note.bestanden);

  const alleRichtig = L.simErgebnis(fragen, [true, true, true, true]);
  t("simErgebnis: 100 % -> Note 1", alleRichtig.prozent === 100 && alleRichtig.note.note === 1);

  /* Genau an der Bestehensgrenze: 2 von 4 = 50 % */
  const knapp = L.simErgebnis(fragen, [true, false, true, false]);
  t("simErgebnis: 2 von 4 = 50 % = Note 4, bestanden",
    knapp.prozent === 50 && knapp.note.note === 4 && knapp.note.bestanden);
}

/* ---- G3.6(b) #5: Punkteverteilung der vier AP1-Aufgaben (L.wuerfelPunkte) ----
   Recherche-Befund: 4 Aufgaben, je 20–30 Punkte, Summe 100. */
{
  const MIN = L.CONFIG.ap1PunkteMin, MAX = L.CONFIG.ap1PunkteMax, SUM = L.CONFIG.ap1PunkteSumme;
  t("CONFIG: Mindestpunkte 20", MIN === 20);
  t("CONFIG: Höchstpunkte 30", MAX === 30);
  t("CONFIG: Gesamtpunkte 100", SUM === 100);

  /* 300 Ziehungen: Summe und Korridor müssen IMMER stimmen */
  let summeImmer = true, korridorImmer = true, laengeImmer = true;
  const gesehen = {};
  for (let i = 0; i < 300; i++) {
    const v = L.wuerfelPunkte(4, MIN, MAX, SUM);
    if (v.length !== 4) laengeImmer = false;
    if (v.reduce((s, x) => s + x, 0) !== SUM) summeImmer = false;
    if (!v.every(x => x >= MIN && x <= MAX)) korridorImmer = false;
    gesehen[v.join("-")] = 1;
  }
  t("wuerfelPunkte: immer 4 Werte", laengeImmer);
  t("wuerfelPunkte: Summe immer 100", summeImmer);
  t("wuerfelPunkte: jeder Wert immer in [20,30]", korridorImmer);
  t("wuerfelPunkte: liefert wirklich verschiedene Verteilungen", Object.keys(gesehen).length > 5);

  /* Determinismus über eine gesteuerte Zufallsquelle */
  const rngNull = () => 0;
  const ersteNimmtAlles = L.wuerfelPunkte(4, MIN, MAX, SUM, rngNull);
  t("wuerfelPunkte: rng=0 füllt die erste Aufgabe zuerst bis zum Maximum",
    ersteNimmtAlles[0] === MAX && ersteNimmtAlles.reduce((s, x) => s + x, 0) === SUM);

  /* Randfälle */
  const exakt = L.wuerfelPunkte(4, 25, 25, 100);
  t("wuerfelPunkte: min===max liefert die feste Verteilung", exakt.join(",") === "25,25,25,25");
  const nurMin = L.wuerfelPunkte(4, 20, 30, 80);
  t("wuerfelPunkte: Summe == n*min liefert lauter Mindestwerte", nurMin.join(",") === "20,20,20,20");
  const nurMax = L.wuerfelPunkte(4, 20, 30, 120);
  t("wuerfelPunkte: Summe == n*max liefert lauter Höchstwerte", nurMax.join(",") === "30,30,30,30");
  const unmoeglich = L.wuerfelPunkte(4, 20, 30, 500);
  t("wuerfelPunkte: unerfüllbare Vorgabe bricht ab statt endlos zu laufen",
    unmoeglich.every(x => x === 30));

  /* Die feste Alt-Verteilung 25/25/26/24 liegt im recherchierten Korridor – der Befund
     entwertet sie nicht, er zeigt nur, dass sie eine von vielen Ausprägungen ist. */
  const alt = [25, 25, 26, 24];
  t("Alt-Verteilung 25/25/26/24 ergibt 100", alt.reduce((s, x) => s + x, 0) === SUM);
  t("Alt-Verteilung liegt im Korridor 20–30", alt.every(x => x >= MIN && x <= MAX));
}

console.log("\n==== " + ok + " Tests OK, " + fail + " Fehler ====");
process.exit(fail ? 1 : 0);
