/* Node-Testskript: node test_rechnen.js – #35 (G2.6) Laufzeit-Randomisierung rechenassistent.
   Prueft den Formelparser, die Rundungs-/Toleranzregeln, die Wertziehung, die Platzhalter,
   die Instanziierung (inkl. Robustheit) und das Grading – jeweils gegen logik.js, sowie
   den echten Pool aus fragen.js. Reine Logik, kein jsdom. */
"use strict";
const L = require("./logik.js");
let ok = 0, fail = 0;
function t(name, bed) { if (bed) { ok++; } else { fail++; console.log("FEHLER: " + name); } }
function wirft(fn) { try { fn(); return false; } catch (e) { return true; } }

/* ---- Formelparser: Grundrechenarten und Vorrang ---- */
t("Parser: Punkt vor Strich", L.evalFormel("2+3*4", {}) === 14);
t("Parser: Klammern", L.evalFormel("(2+3)*4", {}) === 20);
t("Parser: unaeres Minus", L.evalFormel("-5+8", {}) === 3);
t("Parser: Division", L.evalFormel("10/4", {}) === 2.5);
t("Parser: Variablen", L.evalFormel("a*b+c", { a: 2, b: 3, c: 4 }) === 10);
t("Parser: Schrittbezug s1/s2", L.evalFormel("s1+s2", { s1: 1.5, s2: 2.25 }) === 3.75);
t("Parser: verschachtelte Klammern", L.evalFormel("((2+3)*(4-1))/5", {}) === 3);
t("Parser: Dezimalzahlen", L.evalFormel("0.5*8", {}) === 4);

/* ---- Formelparser: lehnt Unzulaessiges ab (KEIN eval!) ---- */
t("Parser lehnt unbekannte Variable ab", wirft(() => L.evalFormel("x", {})));
t("Parser lehnt Funktionsaufruf ab", wirft(() => L.evalFormel("alert(1)", {})));
t("Parser lehnt Semikolon ab", wirft(() => L.evalFormel("2;3", {})));
t("Parser lehnt unvollstaendigen Ausdruck ab", wirft(() => L.evalFormel("a+", { a: 1 })));
t("Parser lehnt doppelten Operator ab", wirft(() => L.evalFormel("1+*2", {})));
t("Parser lehnt Division durch 0 ab", wirft(() => L.evalFormel("1/0", {})));
t("Parser lehnt leere Formel ab", wirft(() => L.evalFormel("", {})));

/* ---- Rundung und Toleranz ---- */
t("rundeAuf: kaufmaennisch 1.005 -> 1.01", L.rundeAuf(1.005, 2) === 1.01);
t("rundeAuf: 2.344 -> 2.34", L.rundeAuf(2.344, 2) === 2.34);
t("rundeAuf: eine Nachkommastelle", L.rundeAuf(1862.645, 1) === 1862.6);
t("rundeAuf: grosse Zahlen unveraendert", L.rundeAuf(2000000000000, 2) === 2000000000000);
t("rundeAuf: negative Werte", L.rundeAuf(-1.005, 2) === -1.01);
t("toleranzFuer: 2 Dezimalen = 1 Cent", L.toleranzFuer(2) === 0.01);
t("toleranzFuer: 1 Dezimale groesser", L.toleranzFuer(1) === 0.05);

/* ---- Deutsche Zahleingabe ---- */
t("zahlAusText: Tausenderpunkt + Komma", L.zahlAusText("3.000,50") === 3000.5);
t("zahlAusText: nur Komma", L.zahlAusText("3000,5") === 3000.5);
t("zahlAusText: englischer Punkt", L.zahlAusText("3000.5") === 3000.5);
t("zahlAusText: reine Ganzzahl", L.zahlAusText("4764") === 4764);
t("zahlAusText: Tausenderpunkt ohne Komma", L.zahlAusText("1.971") === 1971);
t("zahlAusText: Waehrung wird ignoriert", L.zahlAusText("120 EUR") === 120);
t("zahlAusText: Unsinn -> NaN", isNaN(L.zahlAusText("abc")));
t("zahlAusText: leer -> NaN", isNaN(L.zahlAusText("")));

/* ---- Wertziehung ---- */
{
  const def = { min: 20, max: 60, schritt: 5 };
  let alleImRaster = true, minGesehen = false, maxGesehen = false;
  for (let i = 0; i < 500; i++) {
    const v = L.zieheWert(def);
    if (v < def.min || v > def.max || (v - def.min) % def.schritt !== 0) alleImRaster = false;
    if (v === def.min) minGesehen = true;
    if (v === def.max) maxGesehen = true;
  }
  t("zieheWert: immer im Raster min..max", alleImRaster);
  t("zieheWert: erreicht die Untergrenze", minGesehen);
  t("zieheWert: erreicht die Obergrenze", maxGesehen);
}

/* ---- Platzhalter ---- */
t("fuelleText: schlichte Variable", L.fuelleText("{a} Stueck", { a: 7 }) === "7 Stueck");
t("fuelleText: Ausdruck", L.fuelleText("{a*b}", { a: 3, b: 4 }) === "12");
t("fuelleText: Nachkommastellen erzwingen", L.fuelleText("{c/100|2}", { c: 30 }) === "0,30");
t("fuelleText: Tausenderpunkte deutsch", L.fuelleText("{a}", { a: 12000 }) === "12.000");
t("fuelleText: unaufloesbar bleibt stehen", L.fuelleText("{xyz}", { a: 1 }) === "{xyz}");

/* ---- Instanziierung ---- */
{
  const f = {
    id: "T-001", pruefungsteil: "AP1", modul: "M01", thema: "Machbarkeit & Kalkulation",
    typ: "rechenassistent", schwierigkeit: 2, erklaerungKurz: "x",
    variablen: { a: { min: 10, max: 20, schritt: 5 }, b: { min: 2, max: 4, schritt: 1 } },
    frage: "Nimm {a} und {b}.",
    schritte: [{ text: "a mal b", formel: "a*b", einheit: "EUR" },
               { text: "plus 10", formel: "s1+10", einheit: "EUR" }]
  };
  const inst = L.instanziiere(f, () => 0);
  t("instanziiere: Fragetext gefuellt", inst.frage === "Nimm 10 und 2.");
  t("instanziiere: Schritt 1 berechnet", inst.schritte[0].wert === 20);
  t("instanziiere: Schritt 2 nutzt s1", inst.schritte[1].wert === 30);
  t("instanziiere: Schreibweisen erzeugt", Array.isArray(inst.schritte[0].loesung) && inst.schritte[0].loesung.length >= 1);
  t("instanziiere: variablen entfernt", inst.variablen === undefined);
  t("instanziiere: Original unveraendert (R1)", f.schritte[0].wert === undefined && !!f.variablen);
  /* Achtung: validateFragen liefert {gueltig:[...], fehler:[...]} – gueltig ist ein ARRAY. */
  t("Validator akzeptiert randomisierte Fassung", L.validateFragen([f]).fehler.length === 0);

  /* Grading: Toleranz und Ablehnung */
  t("grade: Musterloesung richtig", L.gradeRechenassistent(inst, ["20", "30"]));
  t("grade: deutsche Schreibweise richtig", L.gradeRechenassistent(inst, ["20,00", "30,00"]));
  t("grade: 1 Cent Abweichung toleriert", L.gradeRechenassistent(inst, ["20,01", "30"]));
  t("grade: 2 Cent Abweichung falsch", !L.gradeRechenassistent(inst, ["20,02", "30"]));
  t("grade: falscher Wert abgelehnt", !L.gradeRechenassistent(inst, ["21", "30"]));
  t("grade: Text statt Zahl abgelehnt", !L.gradeRechenassistent(inst, ["zwanzig", "30"]));
  t("grade: fehlender Schritt abgelehnt", !L.gradeRechenassistent(inst, ["20"]));

  /* Robustheit: entartende Formel darf NICHT werfen */
  const kaputt = Object.assign({}, f, {
    schritte: [{ text: "a minus a", formel: "a-a" }, { text: "durch 0", formel: "10/s1" }]
  });
  let geworfen = false, res = null;
  try { res = L.instanziiere(kaputt, () => 0); } catch (e) { geworfen = true; }
  t("instanziiere wirft NIE (Rueckfallebene)", !geworfen && !!res);

  /* Validator meldet entartende Bereiche zur Bauzeit */
  t("Validator meldet entartende Formel", L.validateFragen([kaputt]).fehler.length > 0);
}

/* ---- Klassische Fassung bleibt gueltig (Abwaertskompatibilitaet) ---- */
{
  const alt = {
    id: "T-002", pruefungsteil: "AP1", modul: "M01", thema: "Machbarkeit & Kalkulation",
    typ: "rechenassistent", schwierigkeit: 2, erklaerungKurz: "x", frage: "Rechne.",
    schritte: [{ text: "eins", loesung: ["10"] }, { text: "zwei", loesung: ["20", "20,0"] }]
  };
  t("Validator akzeptiert klassische Fassung", L.validateFragen([alt]).fehler.length === 0);
  t("grade klassisch: richtig", L.gradeRechenassistent(alt, ["10", "20"]));
  t("grade klassisch: falsch", !L.gradeRechenassistent(alt, ["10", "21"]));
}

/* ---- Echter Pool ---- */
let FRAGEN = null;
try { FRAGEN = require("./fragen.js"); } catch (e) { FRAGEN = null; }
if (FRAGEN) {
  const rand = FRAGEN.filter(f => f.typ === "rechenassistent" && f.variablen);
  t("Pool: randomisierte Rechenaufgaben vorhanden", rand.length >= 20);

  let instOk = true, gradeOk = true, platzOk = true, ablehnOk = true;
  rand.forEach(f => {
    for (let k = 0; k < 50; k++) {
      let a;
      try { a = L.instanziiere(f); } catch (e) { instOk = false; return; }
      if (!a.schritte.every(s => typeof s.wert === "number" && isFinite(s.wert))) instOk = false;
      const texte = [a.frage, a.erklaerungKurz || "", a.erklaerungLang || ""]
        .concat(a.schritte.map(s => s.text));
      if (texte.some(x => /\{[^{}]+\}/.test(x))) platzOk = false;
      if (!L.gradeRechenassistent(a, a.schritte.map(s => String(s.wert)))) gradeOk = false;
      if (L.gradeRechenassistent(a, a.schritte.map(s => String(s.wert + 1)))) ablehnOk = false;
    }
  });
  t("Pool: alle Instanzen rechenbar (50 je Aufgabe)", instOk);
  t("Pool: keine offenen Platzhalter", platzOk);
  t("Pool: Musterloesung wird akzeptiert", gradeOk);
  t("Pool: falsche Antwort wird abgelehnt", ablehnOk);

  /* ⚠️ NUTZER-ENTSCHEID 09.09.2026: jede Generator-Art traegt eine feste `stufe`. Ohne sie faellt
     genAlsFrage() auf S.level zurueck – im Automatik-Modus dauerhaft 1, also das Tag „Anfaenger"
     an jeder vierten Aufgabe und ein falscher Nenner in der Lernfluss-Probe.
     ⛔ Der Waechter greift auch fuer JEDE KUENFTIGE Generator-Art: ohne ihn faellt genau dieser
     Fehler beim naechsten Generator wieder durch, weil `meta.stufe || S.level` still zurueckfaellt. */
  const genArten = Object.keys(L.GENERATOREN);
  t("Generatoren: jede Art hat eine Stufe 1-4 (" + genArten.length + " Arten)",
    genArten.length > 0 && genArten.every(a => [1, 2, 3, 4].indexOf(L.GENERATOREN[a].stufe) >= 0));

  const klassisch = FRAGEN.filter(f => f.typ === "rechenassistent" && !f.variablen);
  t("Pool: klassische Rechenaufgaben weiter gueltig",
    klassisch.every(f => f.schritte.every(s => Array.isArray(s.loesung) && s.loesung.length >= 1)));
  t("Pool: randomisierte Aufgaben ohne Restvarianten", rand.every(f => !f.varianten));
} else {
  console.log("(fragen.js noch nicht gebaut – Pool-Tests uebersprungen)");
}

console.log("\n==== " + ok + " Tests OK, " + fail + " Fehler ====");
process.exit(fail ? 1 : 0);
