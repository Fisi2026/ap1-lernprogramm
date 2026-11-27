/* ============================================================================
   N34 T1 (E49, E50, 25.09.2026): Konfiguration und kleine Konstanten
   Uebernommen aus `referenz/logik.js` (Z. 9-45, 751-751, 944-944) - Werte UND Kommentare wortgleich,
   per Skript ausgeschnitten. Gehalten von `tabellen.gleichheit.test.ts` gegen die
   eingefrorene `referenz/logik.js`.
   ⚠️ Bis T2-T5 rechnen die Funktionen in logik.js noch mit IHRER Abschrift dieser Werte;
      der Test haelt beide gleich. Ein Wert aendert sich hier nicht still.
   ⛔ Importiert wird relativ mit Endung `.ts`, nie ueber `@/` (E49: sonst laedt Node sie nicht).
   ⛔ Diese Datei importiert nichts - Werkzeuge laden sie direkt (T6).
   ============================================================================ */

/* ---------------- Zentrale Konfiguration (T4 #83) ----------------
   Magic Numbers der Deck-/Gewichtungs-/Adaptiv-/Fehler-Deck-Logik.
   Werte unveraendert gegenueber vorherigen Inline-Literalen.        */
export const CONFIG = {
  sperrfrist: 10,          // L.deckPick Default-Sperrfrist
  interleavingMalus: 0.3,  // L.gewichteFrage Malus fuer letzte Themen
  gewichtFloor: 0.15,      // L.gewichteFrage Untergrenze
  adaptivMinGesamt: 3,     // L.gewichteFrage Mindest-Gesamt fuer Adaptiv-Faktor
  stufeMinKandidaten: 3,   // aufStufeFiltern: ab wie wenigen Fragen EINES THEMAS auf der
                           // aktuellen Stufe die Stufe darunter dazugenommen wird.
                           // ⚠️ GEMESSEN, NICHT GESETZT (09.09.2026) - Herleitung und
                           // Messreihe: docs/befunde/BEFUNDE_LERNFLUSS.md. Vor jeder Aenderung neu messen.
  fdTageFehler: 1,         // L.fdOnWrong Tage bei Fehler (AP1)
  fdTageFehlerUnterricht: 0, // dito fuer M09 „Klausurvorbereitung": sofort wieder faellig,
                           // die Sperre der letzten 10 verhindert die direkte Wiederholung
  fdStreakWeg: 3,          // L.fdOnCorrect Streak, ab dem Frage das Deck verlaesst
  fdTageStreak1: 3,        // L.fdOnCorrect Tage nach 1. Treffer in Folge
  fdTageStreakRest: 7,     // L.fdOnCorrect Tage nach weiteren Treffern in Folge
  serie: 5,                // Themen-Serie-Laenge (App-Code)
  gate: 30,                // Adaptiv-/Abkuerzungs-Gate anzahlBeantwortet() (App-Code)
  /* ⚠️⚠️ GEAENDERT 2026-07-30 AUF NUTZER-BEFUND: "fast 20 Aufgaben geloest und es kommen immer
     noch Anfaenger-Aufgaben". Gemessen (40 Simulationen, alle Antworten richtig): erste
     Stufe-2-Frage erst nach 21 Aufgaben, erste Stufe-3-Frage nach 49. Ursache ist die
     Arithmetik: Die Stufe haengt JE THEMA, und M09 hat 13 Themen - bei Block 3 braucht es
     13 x 3 = 39 richtige Antworten, bis ueberhaupt jedes Thema einmal aufsteigt.
     NUTZER-ENTSCHEID: Block auf 2, ABER aus Stufe 1 genuegt EINE richtige Antwort. */
  adaptivBlock: 2,         // G3.2 #6: Blockgroesse je Thema ab Stufe 2 (L.adaptivBuchen)
  adaptivBlockStufe1: 1,   // aus Stufe 1 (Anfaenger) genuegt eine richtige Antwort
  /* ⚠️ MUSSTE MITWANDERN, SONST WAERE DIE ABSTUFUNG STILL HAERTER GEWORDEN: Bei Block 3 hiess
     "hoechstens 1 Treffer" = 1 von 3, also erst zwei Fehler stufen ab. Bei Block 2 haette
     derselbe Wert 1 bedeutet: EIN Fehler von zwei stuft ab. Mit 0 gilt weiter, dass erst ein
     KOMPLETT verpatzter Block abstuft - proportional zur alten Regel. */
  adaptivAbSchwelle: 0,    // hoechstens so viele Treffer im Block -> Stufe -1
  ap1PunkteMin: 20,        // G3.6b: Mindestpunkte einer AP1-Aufgabe (recherchiert)
  ap1PunkteMax: 30,        // G3.6b: Hoechstpunkte einer AP1-Aufgabe (recherchiert)
  ap1PunkteSumme: 100      // G3.6b: Gesamtpunkte der AP1
};

export const RECHEN_TOLERANZ: number = 0.01;   /* Nutzer-Entscheid G2.6: 1 Cent Toleranf auf 2 Dezimalen */

export const TIPP_MINLAENGE: number = 6;

/* Stufen 1..4 (1 = Anfänger, 4 = Schwer). Grenzen der adaptiven Schwierigkeit je Thema (G3.2). */
export const LEVEL_MIN: number = 1;
export const LEVEL_MAX: number = 4;

/* Ein Tag in Millisekunden (logik.js: `var TAG = 24 * 60 * 60 * 1000; L.TAG_MS = TAG;`). */
export const TAG_MS: number = 24 * 60 * 60 * 1000;
