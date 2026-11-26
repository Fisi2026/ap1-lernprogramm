"use strict";
/* =================== Ergebnis-Verbuchung =================== */
function verbucheAntwort(f, korrekt, extra) {
  extra = extra || {};
  setFrageOffen(false);   // G1.6 #11: Frage ist verbucht → ab dem nächsten render() darf ein PWA-Update greifen
  mutS(function(s){
    var st = s.statistik[f.modul] = s.statistik[f.modul] || { richtig:0, gesamt:0 };
    st.gesamt++; if (korrekt) st.richtig++;
    var them = s.statistik["T:" + f.modul + ":" + f.thema] = s.statistik["T:" + f.modul + ":" + f.thema] || { richtig:0, gesamt:0 };
    them.gesamt++; if (korrekt) them.richtig++;
    s.antworten.push({ richtig: !!korrekt }); if (s.antworten.length > 30) s.antworten.shift();
    var k = L.dayKey(heute()); s.dailyCounts[k] = (s.dailyCounts[k] || 0) + 1;
    /* 2026-07-30: M09 bekommt ein Erstintervall von 0 Tagen – eine falsch beantwortete Frage der
       Klausurvorbereitung ist SOFORT wieder faellig und kommt noch in derselben Sitzung zurueck
       (die Sperre der letzten 10 in dueUnterricht verhindert die direkte Wiederholung). Fuer AP1
       bleibt es bei 1 Tag. Vorher galt fuer beide 1 Tag – wer am Vorabend einer Klausur uebte,
       bekam die Fehler erst am Pruefungsmorgen wieder vorgelegt. */
    var fdTage = istUnterricht(f) ? L.CONFIG.fdTageFehlerUnterricht : undefined;
    if (s.fehlerDeck[f.id]) { korrekt ? L.fdOnCorrect(s.fehlerDeck, f.id, heute()) : L.fdOnWrong(s.fehlerDeck, f.id, heute(), fdTage); }
    else if (!korrekt && !extra.keinFehlerDeck) L.fdOnWrong(s.fehlerDeck, f.id, heute(), fdTage);
    /* G3.2 #6: adaptive Schwierigkeit JE THEMA. Loest das 8/10-Tracking samt Level-Dialog ab
       (Nutzer-Entscheid E3, 2026-07-19). Nur im Automatik-Modus – „manuell" bleibt Uebersteuerung.
       Generator-Pseudofragen (kein echtes Thema) werden nicht gewertet. */
    if (s.levelModus === "auto" && f.thema && f.typ !== "generator") {
      L.adaptivBuchen(s.themaLevel, s.themaTrack, L.themaKey(f.modul, f.thema), korrekt, s.level);
    }
  });
  renderKopf(); renderNav();
}
/* G3.2 #6 (2026-07-19): zeigeLevelDialog() ENTFERNT. Das Hochstufen wird nicht mehr angeboten,
   sondern laeuft automatisch je Thema ueber L.adaptivBuchen (Nutzer-Entscheid E3). Die alten
   Logik-Bausteine L.autoLevel/L.trackAntwort/L.levelReif samt S.levelTrack/S.levelDialogGezeigt
   wurden 2026-07-23 als toter Code entfernt (Aufraeum-Task vor Release v1.7.0). */

