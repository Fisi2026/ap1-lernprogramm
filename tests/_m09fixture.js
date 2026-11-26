/* tests/_m09fixture.js – EINE Quelle fuer synthetische M09-Fragen (2026-08-04).

   ⚠️ WARUM ES DIESE DATEI GIBT: Mit Etappe B der M09-Aufloesung ist der Bereich
   „Klausurvorbereitung" LEER – die Kategorie bleibt fuer die naechste Klausur, ihr Inhalt ist
   nach M01/M02/M03/M07/M08 umgezogen. Zwei Suiten haben ihre Testdaten bis dahin aus dem
   echten Pool gezogen (test_zurueck_m09 komplett, test_unterricht fuer Klausursimulation,
   Typvielfalt und Themenrunde) und fielen sofort aus – ohne dass am geprueften Verhalten
   irgendetwas falsch war. test_unterricht sagt in seinem eigenen Kopf seit dem 20.07.:
   „Da der echte M09-Pool zum Testzeitpunkt leer sein kann, injizieren die Tests synthetische
   M09-Fragen" – die Injektion war nur nie gross genug (8 Fragen, ein einziger Typ).

   ►► TESTDATEN GEHOEREN IN DEN TEST, NICHT IN DEN CONTENT-STAND.
   Und sie gehoeren in EINE Datei: zwei Suiten mit je eigener Fixture laufen auseinander –
   dieselbe Ursache wie bei den zwei Kopierlisten von check.sh und tools/suite.sh.

   Aufruf:  const FIX = require("./_m09fixture.js");  FIX.injiziere(w, 30);
   Liefert das Array der injizierten Fragen zurueck. Der Aufruf MUSS vor dem ersten Rendern der
   Unterrichtsseite stehen – sonst zeigt sie „keine Fragen" und es gibt keine Navigationsleiste. */
"use strict";

/* Sechs Typen, damit die Wechselsperre (>= 5 Typen) und die Klausursimulation etwas zu ziehen
   haben. Alle Typen sind so gebaut, dass L.validateFragen sie akzeptiert und app_loeser sie
   rendern kann – bewusst die einfachsten Formen, nicht die vollstaendigsten. */
function baue(n, thema) {
  const basis = { id: "M09-" + String(900 + n).slice(-3), pruefungsteil: "AP1", modul: "M09",
    thema: thema, schwierigkeit: ((n % 4) + 1),
    erklaerungKurz: "Testerklaerung." };
  switch (n % 6) {
    case 0: return Object.assign({}, basis, { typ: "mc",
      frage: "Unterrichts-Testfrage " + n + " (mc)?",
      optionen: ["richtig", "falsch1", "falsch2", "falsch3"], loesungIndex: 0,
      distraktorErklaerungen: ["", "warum falsch 1", "warum falsch 2", "warum falsch 3"] });
    case 1: return Object.assign({}, basis, { typ: "mehrfach",
      frage: "Unterrichts-Testfrage " + n + " (mehrfach)?",
      optionen: ["richtig a", "richtig b", "falsch1", "falsch2"], loesungIndizes: [0, 1],
      distraktorErklaerungen: ["", "", "warum falsch 1", "warum falsch 2"] });
    /* ⚠️ lueckentext fuehrt `luecken` als Liste von AKZEPTIERTEN VARIANTEN je Luecke
       ([["alpha"], ["beta"]]), dropdown dagegen als Liste von Objekten mit optionen/loesung.
       Der erste Entwurf schrieb hier `loesungen` – ein Feldname, den es nicht gibt. Gemeldet hat
       das nicht der Test, sondern L.gradeLueckentext mit einem TypeError auf frage.luecken. */
    case 2: return Object.assign({}, basis, { typ: "lueckentext",
      frage: "Unterrichts-Testfrage " + n + ": ___ und ___ .",
      luecken: [["alpha"], ["beta"]] });
    case 3: return Object.assign({}, basis, { typ: "dropdown",
      frage: "Unterrichts-Testfrage " + n + ": ___ .",
      luecken: [{ optionen: ["alpha", "beta", "gamma", "delta"], loesung: 0 }] });
    case 4: return Object.assign({}, basis, { typ: "zuordnung",
      frage: "Unterrichts-Testfrage " + n + " (zuordnung)?",
      paare: [["links 1", "rechts 1"], ["links 2", "rechts 2"],
        ["links 3", "rechts 3"], ["links 4", "rechts 4"]] });
    default: return Object.assign({}, basis, { typ: "reihenfolge",
      frage: "Unterrichts-Testfrage " + n + " (reihenfolge)?",
      schritte: ["erstens", "zweitens", "drittens", "viertens"] });
  }
}

/* anzahl >= 25, damit buildM09Klausur(25) bedient werden kann; themen >= 5 fuer die Themenrunde.
   Die Themen kommen aus L.M09_THEMEN, NICHT aus einer eigenen Liste – ein Fixture, das die
   geprueften Werte danebenschreibt, misst irgendwann etwas anderes. */
function injiziere(w, anzahl) {
  const themen = w.L.M09_THEMEN;
  if (!themen || themen.length < 5) {
    throw new Error("_m09fixture: L.M09_THEMEN hat nur " + (themen ? themen.length : 0) +
      " Themen – die Themenrunde braucht mindestens 5.");
  }
  const n = Math.max(30, anzahl || 0);
  const fragen = [];
  for (let i = 1; i <= n; i++) fragen.push(baue(i, themen[i % themen.length]));
  fragen.forEach(f => { w.POOL.push(f); w.POOL_INDEX[f.id] = f; });
  return fragen;
}

module.exports = { injiziere, baue };
