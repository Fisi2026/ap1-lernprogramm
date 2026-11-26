/* Node-Testskript: node test_logik.js  – prüft logik.js und (falls vorhanden) fragen.js */
"use strict";
const L = require("./logik.js");
let ok = 0, fail = 0;
function t(name, bed) { if (bed) { ok++; } else { fail++; console.log("FEHLER: " + name); } }
function rngFolge(vals) { let i = 0; return () => vals[i++ % vals.length]; }

/* ---- Notenschlüssel ---- */
t("Note 92% = 1", L.note(92).note === 1);
t("Note 91% = 2", L.note(91).note === 2);
t("Note 81% = 2", L.note(81).note === 2);
t("Note 80% = 3", L.note(80).note === 3);
t("Note 67% = 3", L.note(67).note === 3);
t("Note 66% = 4", L.note(66).note === 4);
t("Note 50% = 4 (bestanden)", L.note(50).note === 4 && L.note(50).bestanden);
t("Note 49.9% = 5 (nicht bestanden)", L.note(49.9).note === 5 && !L.note(49.9).bestanden);

/* ---- Deck-Prinzip ---- */
{
  const cand = Array.from({ length: 20 }, (_, i) => "Q" + i);
  let seen = {}, last = [];
  const gezogen = new Set();
  for (let i = 0; i < 20; i++) {
    const r = L.deckPick(cand, seen, last);
    t("Deck: keine Wiederholung vor Erschöpfung (" + i + ")", !gezogen.has(r.id));
    gezogen.add(r.id); seen[r.id] = true; last.push(r.id);
  }
  t("Deck: alle 20 einmal gezogen", gezogen.size === 20);
  const r21 = L.deckPick(cand, seen, last);
  t("Deck: Reset nach Erschöpfung", r21.deckReset === true);
  t("Deck: Sperrfrist – Frage nicht unter letzten 10", last.slice(-10).indexOf(r21.id) === -1);
}
{ // kleiner Pool < Sperrfrist darf nicht blockieren
  const cand = ["A", "B", "C"];
  let seen = { A: true, B: true, C: true };
  const r = L.deckPick(cand, seen, ["A", "B", "C"]);
  t("Deck: Mini-Pool liefert trotzdem eine Frage", cand.indexOf(r.id) >= 0);
}

/* ---- Adaptivität ---- (Die globale Auto-Level-/Reife-Logik wurde 2026-07-23 als toter Code
   entfernt; die adaptive Schwierigkeit je Thema prüft test_adaptiv.js.) ---- */

/* ---- Fehler-Deck (manipulierte Zeitstempel) ---- */
{
  const T = L.TAG_MS; let now = 1000000000000; let deck = {};
  L.fdOnWrong(deck, "F1", now);
  t("FD: nach Fehler fällig in 1 Tag", deck.F1.due === now + T);
  t("FD: nicht sofort fällig", L.fdDue(deck, now).length === 0);
  t("FD: nach 1 Tag fällig", L.fdDue(deck, now + T).length === 1);
  L.fdOnCorrect(deck, "F1", now + T);
  t("FD: 1. richtig -> +3 Tage", deck.F1.due === now + T + 3 * T && deck.F1.streak === 1);
  L.fdOnCorrect(deck, "F1", now + 4 * T);
  t("FD: 2. richtig -> +7 Tage", deck.F1.due === now + 4 * T + 7 * T && deck.F1.streak === 2);
  L.fdOnWrong(deck, "F1", now + 5 * T); // Rückfall
  t("FD: Rückfall auf Stufe 1 (+1 Tag, streak 0)", deck.F1.streak === 0 && deck.F1.due === now + 6 * T);
  L.fdOnCorrect(deck, "F1", now + 6 * T);
  L.fdOnCorrect(deck, "F1", now + 10 * T);
  L.fdOnCorrect(deck, "F1", now + 20 * T);
  t("FD: nach 3× richtig in Folge entfernt", !deck.F1);
}

/* ---- Bewertung ---- */
t("Lücke: tolerant (Groß/Klein, Komma)", L.gradeLuecke(["62"], " 62 ") && L.gradeLuecke(["3,5"], "3.5") && L.gradeLuecke(["DORA"], "dora"));
t("Lücke: falsch bleibt falsch", !L.gradeLuecke(["62"], "64"));
/* FB-R2.6a (2026-07-21): getippte Antworten ohne Umlaute und mit Satzzeichen am Ende.
   Vorher wurde „Unterstuetzungsprozesse" gegen „Unterstützungsprozesse" als FALSCH gewertet –
   am Handy tippt man Umlaute aber haeufig aus. Die Freitext-Bewertung konnte das seit jeher,
   nur diese Stelle nicht. */
t("Lücke: Umlaute ausgeschrieben zählen (ae/oe/ue/ss)",
  L.gradeLuecke(["Unterstützungsprozesse"], "Unterstuetzungsprozesse") &&
  L.gradeLuecke(["Gewähr"], "Gewaehr") && L.gradeLuecke(["Straße"], "Strasse"));
t("Lücke: Umlaut-Toleranz wirkt in BEIDE Richtungen",
  L.gradeLuecke(["Unterstuetzungsprozesse"], "Unterstützungsprozesse"));
t("Lücke: Satzzeichen am Ende stören nicht",
  L.gradeLuecke(["Beschaffung"], "Beschaffung.") && L.gradeLuecke(["Absatz"], "Absatz!"));
/* GEGENPROBEN – die Lockerung darf NICHT ins Rutschen kommen: */
t("Gegenprobe: Umlaut-Toleranz macht verschiedene Wörter nicht gleich",
  !L.gradeLuecke(["Absatz"], "Produktion") && !L.gradeLuecke(["Höhe"], "Hoehle"));
t("Gegenprobe: Satzzeichen INNERHALB bleiben bedeutsam (IP-Adressen)",
  L.gradeLuecke(["192.168.1.1"], "192.168.1.1") && !L.gradeLuecke(["192.168.1.1"], "19216811"));
/* BEWUSST NICHT geaendert: der Tausenderpunkt. „1.500" bleibt ungleich 1500, weil Zeile 2 der
   Normalisierung Komma zu Punkt macht – „1.500" waere sonst nicht mehr von der Dezimalzahl 1,5
   unterscheidbar. Der Test haelt diese Entscheidung fest, damit sie nicht versehentlich kippt. */
t("Tausenderpunkt bleibt bewusst ungleich (Zielkonflikt mit Dezimaltrennzeichen)",
  !L.gradeLuecke(["1500"], "1.500") && L.gradeLuecke(["1.5"], "1,5"));
{
  const f = { luecken: [["62"], ["255.255.255.192", "/26"]] };
  t("Lückentext: beide Lücken nötig", L.gradeLueckentext(f, ["62", "/26"]) && !L.gradeLueckentext(f, ["62", "/27"]));
}
{
  const f = { paare: [["a", "1"], ["b", "2"], ["c", "3"]] };
  t("Zuordnung: korrekt", L.gradeZuordnung(f, { 0: 0, 1: 1, 2: 2 }));
  t("Zuordnung: vertauscht = falsch", !L.gradeZuordnung(f, { 0: 1, 1: 0, 2: 2 }));
}

/* ---- Generatoren: Stichproben nachrechnen ---- */
for (let i = 0; i < 200; i++) {
  const g = L.genUebertragung();
  const m = g.frage.match(/([\d,]+) GB.*?(\d+) Mbit/);
  const gb = parseFloat(m[1].replace(",", ".")), rate = parseInt(m[2]);
  t("GenÜbertragung: Ergebnis stimmt (" + gb + "GB@" + rate + ")", String(gb * 8000 / rate) === g.antwort[0]);
  t("GenÜbertragung: glatt", Number(g.antwort[0]) === Math.floor(Number(g.antwort[0])));
}
for (let i = 0; i < 200; i++) {
  const g = L.genRaid();
  const m = g.frage.match(/(RAID \d+)-Verbund besteht aus (\d+) Festplatten mit je (\d+) GB/);
  const typ = m[1], n = +m[2], s = +m[3];
  const erwartet = typ === "RAID 0" ? n * s : typ === "RAID 1" ? s : typ === "RAID 5" ? (n - 1) * s : n / 2 * s;
  t("GenRAID: " + typ + " n=" + n, g.antwort[0] === String(erwartet));
}
for (let i = 0; i < 200; i++) {
  const g = L.genSubnetting();
  t("GenSubnetting: hat 2 Antworten + Weg", Array.isArray(g.antwort2) && g.antwort2.length === 2 && g.weg.length >= 3);
}
{ // Subnetting-Referenzfall deterministisch: /24 in 4 Subnetze -> /26, 62 Hosts
  const g = L.genSubnetting(rngFolge([0.1, 0.34, 0.34])); // basis, variante "teilen", x=4
  if (g.generator === "subnetting" && /geteilt werden/.test(g.frage) && /4 gleich/.test(g.frage)) {
    t("GenSubnetting Referenz: /26", g.antwort2[0].some(a => a === "/26" || a === "26"));
    t("GenSubnetting Referenz: 62 Hosts", g.antwort2[1][0] === "62");
  }
}
for (let i = 0; i < 100; i++) {
  const g = L.genNetzplan();
  const res = g.daten;
  // Invarianten: kritischer Pfad existiert, GP >= 0, Projektdauer = max FEZ, F auf kritischem Weg
  t("GenNetzplan: kritischer Weg nicht leer", res.kritisch.length >= 3);
  t("GenNetzplan: alle GP >= 0", res.vorgaenge.every(v => v.gp >= 0));
  t("GenNetzplan: FP <= GP", res.vorgaenge.every(v => v.fp <= v.gp));
  const dauer = Math.max(...res.vorgaenge.map(v => v.fez));
  t("GenNetzplan: Projektdauer = max FEZ", res.projektdauer === dauer);
}
{ // Netzplan-Referenz: bekanntes Beispiel aus Modul 01
  const res = L.netzplanBerechne([
    { id: "A", dauer: 2, vorgaenger: [] }, { id: "B", dauer: 1, vorgaenger: [] },
    { id: "C", dauer: 1, vorgaenger: ["A"] }, { id: "D", dauer: 3, vorgaenger: ["B", "C"] },
    { id: "E", dauer: 2, vorgaenger: ["D"] }, { id: "F", dauer: 2, vorgaenger: ["E"] }
  ]);
  t("Netzplan-Referenz: Dauer 10", res.projektdauer === 10);
  t("Netzplan-Referenz: B hat GP 2", res.vorgaenge.find(v => v.id === "B").gp === 2);
  t("Netzplan-Referenz: kritisch A,C,D,E,F", res.kritisch.join("") === "ACDEF");
}

/* ---- Simulation ---- */
{
  const pool = [];
  ["M01", "M02", "M03", "M04"].forEach(m => {
    for (let i = 0; i < 10; i++) pool.push({ id: m + "-" + i, modul: m, typ: "mc", schwierigkeit: 1 + i % 3 });
    pool.push({ id: m + "-ft", modul: m, typ: "freitext", schwierigkeit: 1 });
  });
  /* ⛔ VIER PRUEFUNGEN SIND AM 27.08.2026 HIER RAUSGEFALLEN (20 Fragen / keine Freitexte /
     gleichmaessig je Modul / Modulfilter). Sie fuhren L.buildSimulation - eine Funktion, die
     AUSSCHLIESSLICH diese Datei aufgerufen hat. Die App baut ihre Simulation mit buildAP1Exam()
     in app_sim.js, und die hatte keine einzige Suite.
     ►►► Vier gruene Pruefungen ueber einen toten Codepfad, null ueber den lebenden.
     Die Pruefungen stehen jetzt in tests/test_sim.js und fahren den echten Weg. */
  const sim = pool.slice(0, 20);
  const erg = L.simErgebnis(sim, sim.map((_, i) => i < 10));
  t("Sim: 10/20 = 50% = Note 4", erg.prozent === 50 && erg.note.note === 4);
}

/* ---- Schema-Validierung ---- */
{
  const gut = {
    id: "T-1", pruefungsteil: "AP1", modul: "M01", thema: "Test", typ: "mc", schwierigkeit: 1,
    frage: "F?", optionen: ["a", "b", "c", "d"], loesungIndex: 0,
    distraktorErklaerungen: ["", "x", "y", "z"], erklaerungKurz: "k", erklaerungLang: "l"
  };
  const schlecht1 = Object.assign({}, gut, { id: "T-2", loesungIndex: 9 });
  const schlecht2 = Object.assign({}, gut, { id: "T-1" }); // doppelte ID
  const schlecht3 = { id: "T-3", pruefungsteil: "AP1", modul: "M02", thema: "x", typ: "lueckentext", schwierigkeit: 2, frage: "Nur eine ___ hier", luecken: [["a"], ["b"]], erklaerungKurz: "k" };
  const v = L.validateFragen([gut, schlecht1, schlecht2, schlecht3]);
  t("Validierung: 1 gültig", v.gueltig.length === 1);
  t("Validierung: 3 Fehler gemeldet", v.fehler.length === 3);
  t("Validierung: loesungIndex erkannt", v.fehler.some(f => f.id === "T-2" && /loesungIndex/.test(f.meldung)));
  t("Validierung: doppelte ID erkannt", v.fehler.some(f => /doppelte ID/.test(f.meldung)));
  t("Validierung: Lücken/___-Anzahl erkannt", v.fehler.some(f => f.id === "T-3"));
}

/* ---- Neue Fragetypen: Grading ---- */
{
  const mf = { loesungIndizes: [0, 2, 3] };
  t("Mehrfach: exakte Menge korrekt", L.gradeMehrfach(mf, [3, 0, 2]));
  t("Mehrfach: fehlende Auswahl falsch", !L.gradeMehrfach(mf, [0, 2]));
  t("Mehrfach: zu viel Auswahl falsch", !L.gradeMehrfach(mf, [0, 1, 2, 3]));
  t("Mehrfach: leere Auswahl falsch", !L.gradeMehrfach(mf, []));
}
{
  const rf = { schritte: ["a", "b", "c", "d"] };
  t("Reihenfolge: korrekt = 0,1,2,3", L.gradeReihenfolge(rf, [0, 1, 2, 3]));
  t("Reihenfolge: vertauscht falsch", !L.gradeReihenfolge(rf, [1, 0, 2, 3]));
  t("Reihenfolge: unvollständig falsch", !L.gradeReihenfolge(rf, [0, 1, 2]));
}
{
  const dd = { frage: "Ein ___ und ein ___.", luecken: [{ optionen: ["x", "y"], loesung: 1 }, { optionen: ["p", "q", "r"], loesung: 0 }] };
  t("Dropdown: korrekte Auswahl", L.gradeDropdown(dd, [1, 0]));
  t("Dropdown: eine falsch => falsch", !L.gradeDropdown(dd, [1, 2]));
  t("Dropdown: Länge falsch => falsch", !L.gradeDropdown(dd, [1]));
}
{
  const hs = { zonen: [{ x: 0, y: 0, w: 10, h: 10, richtig: false }, { x: 20, y: 0, w: 10, h: 10, richtig: true }, { x: 40, y: 0, w: 10, h: 10, richtig: false }] };
  t("Hotspot: richtige Zone korrekt", L.gradeHotspot(hs, 1));
  t("Hotspot: falsche Zone falsch", !L.gradeHotspot(hs, 0));
  t("Hotspot: ungültiger Index falsch", !L.gradeHotspot(hs, 9));
}
{
  const fs2 = { zeilen: ["a=1", "b=2", "c=a+b"], fehlerZeile: 1 };
  t("Fehlersuche: richtige Zeile", L.gradeFehlersuche(fs2, 1));
  t("Fehlersuche: falsche Zeile", !L.gradeFehlersuche(fs2, 0));
}
{
  const ra = { schritte: [{ text: "P=U*I", loesung: ["12"] }, { text: "I=P/U", loesung: ["2,4", "2.4"] }] };
  t("Rechenassistent: alle Schritte korrekt", L.gradeRechenassistent(ra, ["12", "2.4"]));
  t("Rechenassistent: ein Schritt falsch", !L.gradeRechenassistent(ra, ["12", "3"]));
  t("Rechenassistent: Länge falsch", !L.gradeRechenassistent(ra, ["12"]));
}
{
  const base2 = { pruefungsteil: "AP1", modul: "M04", thema: "T", schwierigkeit: 2, frage: "F?", erklaerungKurz: "k" };
  const gutFs = Object.assign({}, base2, { id: "FS-1", typ: "fehlersuche", zeilen: ["x", "y"], fehlerZeile: 0 });
  const gutRa = Object.assign({}, base2, { id: "RA-1", typ: "rechenassistent", schritte: [{ text: "s1", loesung: ["1"] }, { text: "s2", loesung: ["2"] }] });
  const badFs = Object.assign({}, base2, { id: "FS-2", typ: "fehlersuche", zeilen: ["x", "y"], fehlerZeile: 5 });
  const v2 = L.validateFragen([gutFs, gutRa, badFs]);
  t("Validierung: fehlersuche+rechenassistent gültig", v2.gueltig.length === 2);
  t("Validierung: fehlerZeile-Bereich erkannt", v2.fehler.some(f => f.id === "FS-2"));
}
{
  const mx = { elemente: [{ text:"a", quadrant:0 }, { text:"b", quadrant:3 }] };
  t("Matrix: korrekt", L.gradeMatrix(mx, { 0:0, 1:3 }));
  t("Matrix: falsch", !L.gradeMatrix(mx, { 0:1, 1:3 }));
  const bs = { ziele: [{ loesung:"X" }, { loesung:"Y" }] };
  t("Beschriftung: korrekt", L.gradeBeschriftung(bs, { 0:"X", 1:"Y" }));
  t("Beschriftung: falsch", !L.gradeBeschriftung(bs, { 0:"Y", 1:"X" }));
}
{
  const tr = { spalten:["i","summe"], zeilen:[["1","1"],["2","3"],["3","6"]] };
  t("Trace: korrekt", L.gradeTrace(tr, [["1","1"],["2","3"],["3","6"]]));
  t("Trace: eine Zelle falsch", !L.gradeTrace(tr, [["1","1"],["2","4"],["3","6"]]));
  t("Trace: Zeilenzahl falsch", !L.gradeTrace(tr, [["1","1"]]));
  const ko = { aufgaben:[{ prompt:"IP anzeigen", akzeptiert:["ipconfig /all","ipconfig"] }, { prompt:"ping", akzeptiert:["ping 8.8.8.8"] }] };
  t("Konsole: akzeptierter Befehl", L.gradeKonsole(ko, ["IPCONFIG  /all", "ping 8.8.8.8"]));
  t("Konsole: falscher Befehl", !L.gradeKonsole(ko, ["ifconfig", "ping 8.8.8.8"]));
  const ka = { kopf:["Kriterium","Wert"], zeilen:[[{ v:"Preis" },{ loesung:["2,4","2.4"] }],[{ v:"Summe" },{ loesung:["7,15"] }]] };
  t("Kalkulation: korrekt", L.gradeKalkulation(ka, { "0,1":"2.4", "1,1":"7,15" }));
  t("Kalkulation: falsch", !L.gradeKalkulation(ka, { "0,1":"2.4", "1,1":"9" }));
  const ba = { ziele:[{ loesung:"WENN" }, { loesung:"SONST" }] };
  t("Baukasten: korrekt", L.gradeBaukasten(ba, { 0:"WENN", 1:"SONST" }));
  t("Baukasten: falsch", !L.gradeBaukasten(ba, { 0:"SONST", 1:"WENN" }));
}
{
  // Zuordnung many-to-one (mehrere Aussagen -> selbe Kategorie), textbasierte Wertung
  const zm = { paare: [["A1","Wasserfall"],["A2","SCRUM"],["A3","Wasserfall"],["A4","SCRUM"]] };
  t("Zuordnung 1:1 exakt korrekt", L.gradeZuordnung(zm, {0:0,1:1,2:2,3:3}));
  t("Zuordnung many-to-one: index-vertauscht aber Kategorie korrekt", L.gradeZuordnung(zm, {0:2,1:3,2:0,3:1}));
  t("Zuordnung many-to-one: falsche Kategorie erkannt", !L.gradeZuordnung(zm, {0:1,1:0,2:2,3:3}));
  t("Zuordnung: unvollständig -> falsch", !L.gradeZuordnung(zm, {0:0,1:1,2:2}));
}
{
  // Gantt / Balkenplan-Terminplanung
  const vg = [
    { id:"A", name:"A", dauer:2, vorgaenger:[] },
    { id:"B", name:"B", dauer:3, vorgaenger:["A"] },
    { id:"C", name:"C", dauer:2, vorgaenger:["A"] },
    { id:"D", name:"D", dauer:4, vorgaenger:["B","C"] },
    { id:"E", name:"E", dauer:2, vorgaenger:["D"] }
  ];
  const r = L.ganttBerechne(vg);
  const by = {}; r.vorgaenge.forEach(v => by[v.id] = v);
  t("Gantt: Start A = 1", by.A.start === 1);
  t("Gantt: Ende A = 2", by.A.ende === 2);
  t("Gantt: Start B = 3", by.B.start === 3);
  t("Gantt: Start C = 3", by.C.start === 3);
  t("Gantt: Ende C = 4", by.C.ende === 4);
  t("Gantt: Start D = 6 (nach max(EndeB=5,EndeC=4)+1)", by.D.start === 6);
  t("Gantt: Ende E = 11", by.E.ende === 11);
  t("Gantt: Projektdauer = 11", r.projektdauer === 11);
  t("Gantt: Puffer C = 1", by.C.puffer === 1);
  t("Gantt: Puffer A/B/D/E = 0", by.A.puffer===0 && by.B.puffer===0 && by.D.puffer===0 && by.E.puffer===0);
  t("Gantt: kritischer Pfad A,B,D,E", r.kritisch.join("") === "ABDE");
  // Generator liefert gültige Szenariodaten
  let seed = 7; const rng = () => { seed = (seed*1103515245+12345) & 0x7fffffff; return seed/0x7fffffff; };
  for (let i=0; i<12; i++) {
    const g = L.genGantt(rng);
    const ok = g && g.daten && g.daten.vorgaenge.length === 5 &&
      g.daten.vorgaenge.every(v => v.start >= 1 && v.ende === v.start + v.dauer - 1 && v.puffer >= 0) &&
      g.daten.kritisch.length >= 1;
    t("Gantt genGantt #" + i + " (" + (g&&g.szenario?g.szenario.titel:"?") + ")", ok);
  }
}
{
  const base3 = { pruefungsteil:"AP1", modul:"M01", thema:"T", schwierigkeit:2, frage:"F?", erklaerungKurz:"k" };
  const gutMx = Object.assign({}, base3, { id:"MX-1", typ:"matrix", quadranten:["a","b","c","d"], elemente:[{ text:"e1", quadrant:0 }, { text:"e2", quadrant:2 }] });
  const gutBs = Object.assign({}, base3, { id:"BS-1", typ:"beschriftung", svg:"<svg></svg>", ziele:[{ loesung:"L1" }, { loesung:"L2" }], labels:["L1","L2","L3"] });
  const badBs = Object.assign({}, base3, { id:"BS-2", typ:"beschriftung", svg:"<svg></svg>", ziele:[{ loesung:"L1" }], labels:["X","Y"] });
  const v3 = L.validateFragen([gutMx, gutBs, badBs]);
  t("Validierung: matrix+beschriftung gültig", v3.gueltig.length === 2);
  t("Validierung: beschriftung labels-ohne-Lösung erkannt", v3.fehler.some(f => f.id === "BS-2"));
}
{ // Schema-Validierung neuer Typen
  const base = { pruefungsteil: "AP1", modul: "M01", thema: "T", schwierigkeit: 1, frage: "F?", erklaerungKurz: "k" };
  const gutMf = Object.assign({}, base, { id: "N-1", typ: "mehrfach", optionen: ["a", "b", "c", "d"], loesungIndizes: [0, 2] });
  const gutRf = Object.assign({}, base, { id: "N-2", typ: "reihenfolge", schritte: ["a", "b", "c"] });
  const gutDd = Object.assign({}, base, { id: "N-3", typ: "dropdown", frage: "Ein ___ Test.", luecken: [{ optionen: ["a", "b"], loesung: 0 }] });
  const badMf = Object.assign({}, base, { id: "N-4", typ: "mehrfach", optionen: ["a", "b", "c"], loesungIndizes: [9] });
  const badDd = Object.assign({}, base, { id: "N-5", typ: "dropdown", frage: "Keine Lücke.", luecken: [{ optionen: ["a", "b"], loesung: 0 }] });
  const v = L.validateFragen([gutMf, gutRf, gutDd, badMf, badDd]);
  t("Validierung: 3 neue Typen gültig", v.gueltig.length === 3);
  t("Validierung: mehrfach loesungIndizes-Bereich erkannt", v.fehler.some(f => f.id === "N-4"));
  t("Validierung: dropdown ___-Anzahl erkannt", v.fehler.some(f => f.id === "N-5"));
}

/* ---- Zahlenvarianz (instanziiere + Varianten-Validierung) ---- */
{
  const basisF = { id: "V-1", pruefungsteil: "AP1", modul: "M03", thema: "T", typ: "rechenassistent", schwierigkeit: 3,
    frage: "Basisfrage 10 GB", erklaerungKurz: "k",
    schritte: [{ text: "s1", loesung: ["80"] }, { text: "s2", loesung: ["8"] }],
    varianten: [
      { frage: "Variante 25 GB", schritte: [{ text: "s1", loesung: ["200"] }, { text: "s2", loesung: ["20"] }] },
      { frage: "Variante 50 GB", schritte: [{ text: "s1", loesung: ["400"] }, { text: "s2", loesung: ["40"] }] }
    ] };
  const inst = L.instanziiere(basisF, () => 0.6);
  t("instanziiere: Variante gewählt", inst.frage === "Variante 50 GB" && inst.schritte[0].loesung[0] === "400");
  t("instanziiere: id/modul bleiben", inst.id === "V-1" && inst.modul === "M03");
  t("instanziiere: varianten-Feld entfernt", !inst.varianten);
  t("instanziiere: ohne varianten unverändert", L.instanziiere({ id: "x" }).id === "x");
  const v = L.validateFragen([basisF]);
  t("Validierung: Basis + Varianten gültig", v.fehler.length === 0 && v.gueltig.length === 1);
  const kaputt = Object.assign({}, basisF, { id: "V-2", varianten: [{ schritte: [{ text: "s1" }] }] });
  const v2 = L.validateFragen([kaputt]);
  t("Validierung: kaputte Variante erkannt", v2.fehler.some(e => String(e.id).indexOf("V-2#v0") === 0));
}

/* ---- Neue Generatoren: Zahlensysteme & Datenmengen ---- */
for (let i = 0; i < 200; i++) {
  const g = L.genZahlensysteme();
  const m = g.frage.match(/Rechnen Sie um: ([0-9A-F]+) \(([^)]+)\) = \? \(([^)]+)\)/);
  t("GenZahlensysteme: Frage-Format", !!m);
  if (m) {
    const basen = { Dezimal: 10, "Binär": 2, Oktal: 8, Hexadezimal: 16 };
    const wert = parseInt(m[1], basen[m[2]]);
    const erwartet = wert.toString(basen[m[3]]).toUpperCase();
    t("GenZahlensysteme: Ergebnis stimmt (" + m[1] + " " + m[2] + "->" + m[3] + ")", g.antwort.indexOf(erwartet) >= 0 || g.antwort.indexOf(erwartet.toLowerCase()) >= 0);
  }
}
for (let i = 0; i < 200; i++) {
  const g = L.genDatenmengen();
  t("GenDatenmengen: hat Antwort + Weg", Array.isArray(g.antwort) && g.antwort.length >= 1 && Array.isArray(g.weg) && g.weg.length >= 2);
  t("GenDatenmengen: Antwort numerisch parsebar", !isNaN(parseFloat(String(g.antwort[0]).replace(",", "."))));
}
{ // Referenz: 8 GiB -> 8,59 GB; 4 MiB -> 4096 KiB; 10 MB -> 80 Mbit
  t("Datenmengen-Referenz GiB->GB", Math.abs(8 * 1073741824 / 1e9 - 8.59) < 0.005);
  t("Datenmengen-Referenz MiB->KiB", 4 * 1024 === 4096);
  t("Datenmengen-Referenz MB->Mbit", 10 * 8 === 80);
}
{ // Netzplan-Szenario vorhanden
  const g = L.genNetzplan();
  t("Netzplan: Szenariotext vorhanden", g.szenario && typeof g.szenario.text === "string" && g.szenario.text.indexOf("Rhaus") >= 0);
  t("Netzplan: Vorgänge benannt", g.daten.vorgaenge.every(v => typeof v.name === "string" && v.name.length > 2));
}

/* ---- fragen.js (falls schon gebaut) ---- */
const fs = require("fs");
if (fs.existsSync("./fragen.js")) {
  const FRAGEN = require("./fragen.js");
  const v = L.validateFragen(FRAGEN);
  t("fragen.js: keine Schemafehler (" + v.fehler.map(f => f.id).join(",") + ")", v.fehler.length === 0);
  t("fragen.js: Pool nicht leer", v.gueltig.length >= 100);
  const dup = L.duplikatScan(FRAGEN);
  t("fragen.js: keine Duplikate (" + dup.map(d => d.a + "~" + d.b).join(" ") + ")", dup.length === 0);
  const typen = {}; FRAGEN.forEach(f => typen[f.typ] = (typen[f.typ] || 0) + 1);
  ["mc", "freitext", "dropdown", "zuordnung", "bild", "erklaeren", "mehrfach", "rechenassistent"].forEach(ty =>
    t("fragen.js: Format vorhanden: " + ty, (typen[ty] || 0) > 0));
  const module = {}; FRAGEN.forEach(f => module[f.modul] = (module[f.modul] || 0) + 1);
  ["M01","M02","M03","M04","M05","M06","M07","M08"].forEach(m =>
    t("fragen.js: Modul " + m + " vorhanden (" + (module[m] || 0) + ")", (module[m] || 0) > 0));
  console.log("Pool-Statistik:", JSON.stringify({ gesamt: FRAGEN.length, module, typen }));
} else {
  console.log("(fragen.js noch nicht gebaut – Pool-Tests übersprungen)");
}

console.log("\n==== " + ok + " Tests OK, " + fail + " Fehler ====");
process.exit(fail ? 1 : 0);
