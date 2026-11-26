/* Node-Testskript: node test_bereitschaft.js – prüft L.bereitschaft / L.ampelFuer (L1 / G1).
   FB-R3 (2026-07-23): Bereitschaft läuft jetzt JE GEBIET (Rückgabefeld `gebiete`, Schlüssel A1..B3)
   statt je Modul. Die Zuordnung Thema→Gebiet kommt aus L.THEMA_GEBIET; Erwartungen werden dynamisch
   aus L.THEMA_RELEVANZ/L.THEMA_GEBIET berechnet, damit der Test die Zuordnung selbst mitprüft. */
"use strict";
const L = require("./logik.js");
let ok = 0, fail = 0;
function t(name, bed) { if (bed) { ok++; } else { fail++; console.log("FEHLER: " + name); } }
const rel = th => L.THEMA_RELEVANZ[th] || 2;
const geb = (m, th) => L.THEMA_GEBIET[m + "|" + th];

/* ---- Ampel-Schwellen (Nutzer-Entscheid 60/80): <60 rot, 60..80 gelb, >80 grün ---- */
t("Ampel: Schwellen 60/80", L.BEREITSCHAFT_AMPEL.rot === 60 && L.BEREITSCHAFT_AMPEL.gelb === 80);
t("Ampel: 0 -> rot",   L.ampelFuer(0)   === "rot");
t("Ampel: 59 -> rot",  L.ampelFuer(59)  === "rot");
t("Ampel: 60 -> gelb", L.ampelFuer(60)  === "gelb");
t("Ampel: 80 -> gelb", L.ampelFuer(80)  === "gelb");
t("Ampel: 81 -> grün", L.ampelFuer(81)  === "gruen");
t("Ampel: 100 -> grün",L.ampelFuer(100) === "gruen");
t("Ampel: null -> keine", L.ampelFuer(null) === "keine");

/* ---- Leerer Zustand ---- */
const leer = L.bereitschaft({});
t("leer: gesamt.score null", leer.gesamt.score === null);
t("leer: gesamt.ampel keine", leer.gesamt.ampel === "keine");
t("leer: keine Gebiete", Object.keys(leer.gebiete).length === 0);
t("leer: themen 0 / antworten 0", leer.gesamt.themen === 0 && leer.gesamt.antworten === 0);
t("undefined-Arg robust", L.bereitschaft().gesamt.score === null);

/* ---- Einzelthema: OSI-Modell & Protokolle -> Gebiet A3, 8/10 = 80 % (rel-unabhängig bei 1 Thema) ---- */
t("Voraussetzung: OSI liegt in A3", geb("M03", "OSI-Modell & Protokolle") === "A3");
const s1 = L.bereitschaft({ "T:M03:OSI-Modell & Protokolle": { richtig: 8, gesamt: 10 } });
t("einzel: A3 score 80", s1.gebiete.A3.score === 80);
t("einzel: A3 ampel gelb", s1.gebiete.A3.ampel === "gelb");
t("einzel: A3 themen 1 / antworten 10", s1.gebiete.A3.themen === 1 && s1.gebiete.A3.antworten === 10);
t("einzel: gesamt score 80", s1.gesamt.score === 80);
t("einzel: gesamt themen 1", s1.gesamt.themen === 1);

/* ---- Gewichtung INNERHALB eines Gebiets: CIA 100 % + Security by Design 0 % (beide M06 -> A3) ---- */
t("Voraussetzung: CIA und Security by Design beide A3",
  geb("M06", "Schutzziele (CIA)") === "A3" && geb("M06", "Security by Design") === "A3");
const rCIA = rel("Schutzziele (CIA)"), rSBD = rel("Security by Design");
const expA3 = Math.round((rCIA * 100 + rSBD * 0) / (rCIA + rSBD));
const s2 = L.bereitschaft({
  "T:M06:Schutzziele (CIA)":   { richtig: 10, gesamt: 10 },
  "T:M06:Security by Design":  { richtig: 0,  gesamt: 5  }
});
t("gewichtung: A3 score " + expA3, s2.gebiete.A3.score === expA3);
t("gewichtung: A3 themen 2 / antworten 15", s2.gebiete.A3.themen === 2 && s2.gebiete.A3.antworten === 15);
t("gewichtung: A3 ampel gesetzt", ["rot", "gelb", "gruen"].indexOf(s2.gebiete.A3.ampel) >= 0);

/* ---- Aggregation über ZWEI Gebiete: OSI (A3) 80 % + Hardware-Komponenten (A2) 30 % ---- */
t("Voraussetzung: OSI A3, Hardware A2",
  geb("M03", "OSI-Modell & Protokolle") === "A3" && geb("M03", "Hardware-Komponenten") === "A2");
const rOSI = rel("OSI-Modell & Protokolle"), rHW = rel("Hardware-Komponenten");
const expGes = Math.round((rOSI * 80 + rHW * 30) / (rOSI + rHW));
const s3 = L.bereitschaft({
  "T:M03:OSI-Modell & Protokolle": { richtig: 8, gesamt: 10 },
  "T:M03:Hardware-Komponenten":    { richtig: 3, gesamt: 10 }
});
t("aggregat: A3 80 / A2 30", s3.gebiete.A3.score === 80 && s3.gebiete.A2.score === 30);
t("aggregat: gesamt score " + expGes, s3.gesamt.score === expGes);
t("aggregat: gesamt themen 2 / antworten 20", s3.gesamt.themen === 2 && s3.gesamt.antworten === 20);

/* ---- Unbekanntes Thema (kein Soll-Gebiet) wird ausgelassen ---- */
const s4 = L.bereitschaft({ "T:M05:Voellig Unbekanntes Thema": { richtig: 5, gesamt: 10 } });
t("unbekanntes Thema ohne Gebiet wird ignoriert", Object.keys(s4.gebiete).length === 0 && s4.gesamt.score === null);

/* ---- M09 zählt NIE in die AP1-Bereitschaft ---- */
const s4b = L.bereitschaft({ "T:M09:Wertschöpfung": { richtig: 5, gesamt: 10 } });
t("M09 zählt nicht in die Bereitschaft", Object.keys(s4b.gebiete).length === 0);

/* ---- Nicht-Themen-Keys werden ignoriert (Gebiet-Aggregat, Generator) ---- */
const s5 = L.bereitschaft({
  "A3": { richtig: 99, gesamt: 99 },                  // Gebiet-Aggregat-Key -> ignorieren
  "GEN:Subnetting": { richtig: 1, gesamt: 1 },        // Generator-Key -> ignorieren
  "T:M03:OSI-Modell & Protokolle": { richtig: 5, gesamt: 10 }
});
t("ignoriert: nur T:-Keys zählen (gesamt themen 1)", s5.gesamt.themen === 1);
t("ignoriert: A3 score 50", s5.gebiete.A3.score === 50);

/* ---- Themen mit gesamt 0 werden ignoriert (Lastenheft -> A1) ---- */
t("Voraussetzung: Lastenheft in A1", geb("M04", "Lastenheft & Pflichtenheft") === "A1");
const s6 = L.bereitschaft({
  "T:M04:Lizenzen & Urheberrecht": { richtig: 0, gesamt: 0 },      // keine Daten
  "T:M04:Lastenheft & Pflichtenheft": { richtig: 4, gesamt: 8 }   // quote 50 -> A1
});
t("gesamt0 ignoriert: A1 themen 1", s6.gebiete.A1.themen === 1);
t("gesamt0 ignoriert: A1 score 50", s6.gebiete.A1.score === 50);

/* ---- Rundung: SMART-Ziele (A1) 2/3 -> 66.67 -> 67 ---- */
t("Voraussetzung: SMART-Ziele in A1", geb("M01", "SMART-Ziele") === "A1");
const s7 = L.bereitschaft({ "T:M01:SMART-Ziele": { richtig: 2, gesamt: 3 } });
t("rundung: A1 2/3 -> 67", s7.gebiete.A1.score === 67);

console.log("\n==== " + ok + " Tests OK, " + fail + " Fehler ====");
process.exit(fail ? 1 : 0);
