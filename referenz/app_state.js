"use strict";
/* v3.0 – minions Design-System + Sidebar/Split-Workspace/Aktions-Footer (Logik unverändert) */
/* Zentrale Anwendungs-Version (T6 #96) – Single Source of Truth. Wird ueberall dort genutzt, wo die
   Versionsnummer angezeigt oder gebraucht wird (Anzeige in sEinstellungen). SemVer MAJOR.MINOR.PATCH;
   Aenderungen je Meilenstein in CHANGELOG.md. NICHT verwechseln mit STATE_VERSION (LocalStorage-Schema). */
var APP_VERSION = "2.0.0";
/* Termin der naechsten WiSo-Klausur der Klasse – SINGLE SOURCE (2026-08-04).
   `null` = kein Termin bekannt: der Bereich „Vorbereitung nächste Klausur" zeigt dann KEINE
   Terminzeile, nur den Kicker. Ist ein Datum gesetzt, erscheint der Countdown wieder.
   ⚠️ VORHER stand der Termin an ZWEI Stellen: `new Date(2026, 6, 31)` in app_seiten.js und das
   ausgeschriebene Datum im Text `TEXTE.unterricht.countdownPrefix` in app_util.js. Nach der
   Klausur am 31.07.2026 zeigte der Kopf dauerhaft „(liegt zurück)", und wer das aendern wollte,
   musste beide Stellen finden. Zwei Quellen fuer denselben Wert driften – hier war es nur eine
   Frage der Zeit. **Fuer die naechste Klausur genuegt jetzt diese eine Zeile.**
   Beispiel: var KLAUSUR_TERMIN = new Date(2027, 0, 15);   // 15.01.2027 */
var KLAUSUR_TERMIN = null;
/* Zentrale App-Konfiguration (T4 #83) – Werte unveraendert gegenueber vorherigen Inline-Literalen.
   Muss vor defaultState() stehen (wird darin referenziert). */
var APP_CONFIG = {
  tagesziel: 20,        // defaultState() Tagesziel-Default
  simAnzahl: 40,        // defaultState() Anzahl Fragen der Pruefungssimulation
  fdEinstreuung: 5,     // naechsteFrage(): Fehler-Deck-Einstreuung 1 von 5 (uebenZaehler % 5)
  generatorEinstreuung: 4, // naechsteFrage(): Generator-Einstreuung 1 von 4 (uebenZaehler % 4)
  teilpunkteRichtig: 0.65,   // gradeTeilpunkte: Schwelle "richtig" (65 %)
  teilpunkteTeilweise: 0.35  // gradeTeilpunkte: Schwelle "teilweise" (35 %)
};
/* =================== Zustand (LocalStorage) =================== */
var LS_KEY = "ap1v2_state";
var STATE_VERSION = 5;   // WICHTIG: vor ladeState() initialisieren (migriereState nutzt sie)
/* R2: LocalStorage-Fehler sichtbar machen. Flags werden von ladeState()/speichere() gesetzt und in
   render() als fixierter Banner angezeigt (app_seiten.js lsFehlerBanner). Verhalten sonst unveraendert:
   Lade-Fehler -> Neustart mit defaultState(); Speicher-Fehler -> App laeuft im Notbetrieb weiter. */
var LS_LADE_FEHLER = false, LS_SPEICHER_FEHLER = false;
var S = ladeState();
function defaultState() {
  return {
    seen:{}, lastShown:[], antworten:[],            // Deck + Adaptivität (antworten: letzte Ergebnisse)
    /* ⚠️ 2026-07-30 NUTZER-BEFUND: "ich habe jetzt schon Wiederholungen von richtig beantworteten
       Fragen". Ursache: Der M09-Flow zog mit L.pick() und kannte nur die letzten 10 Fragen –
       anders als der AP1-Flow, der über L.deckPick(S.seen, …) jede Frage EINMAL bringt, bevor
       eine wiederholt wird. Gemessen (30 Simulationen, 60 Aufgaben): 7 Wiederholungen, erste
       nach Aufgabe 34, nur 53 von 121 Fragen überhaupt gesehen.
       EIGENES Deck, damit sich AP1-Training und Klausurvorbereitung nicht gegenseitig zurücksetzen. */
    seenUnterricht:{},                               // Deck der Klausurvorbereitung (M09)
    level:1, levelModus:"auto",
    module:[],                                       // LEGACY (bis FB-R3 Etappe 1). Seit Etappe 2 nutzt die Üben-Auswahl S.gebiete/S.themen; S.module wird von kandidaten()/themaGewaehlt() NICHT mehr gelesen und bleibt nur stehen, damit ältere Tests/Serialisierungen nicht crashen. Leere Liste = alle.
    fehlerDeck:{}, notizen:{},
    statistik:{},                                    // je Modul {richtig, gesamt}
    dailyCounts:{}, tagesziel:APP_CONFIG.tagesziel,
    pruefungsdatum:"", theme:null,
    simHistorie:[], simAnzahl:APP_CONFIG.simAnzahl, simUsedIds:[],
    m09Historie:[], m09UsedIds:[],                   // M09-Klausursimulation (2026-07-21): eigene Historie/Gedaechtnis, getrennt von AP1 (kein STATE_VERSION-Bump noetig, siehe Kommentar unten)
    uebenZaehler:0, fokusZu:true, serieDone:"",
    lastTyp:"",
    inklAP2:false,                                   // false = nur AP1-Prüfungsstoff; true = auch AP2-Zusatz (WiSo, Subnetting, DB). GLOBAL (Startseiten-Statistik, Statistik-Seite, Simulation) – NICHT die Üben-Auswahl, die läuft über uebenAP.
    uebenAP:"beide",                                 // FB-R3 Punkt 6: Prüfungsteil-Filter NUR der Üben-Themenauswahl: "ap1" | "ap2" | "beide" (Default beide, Nutzer-Entscheid 2026-07-23). Kein STATE_VERSION-Bump nötig (Object.assign-Default).
    ap2Themen:[],                                    // LEGACY (FB-R3 Punkt 6). Seit Etappe 2 durch S.themen ersetzt; nicht mehr gelesen, bleibt nur zur Rückwärtskompatibilität. Default leer.
    gebiete:[],                                      // FB-R3 Etappe 2 (2026-07-23): ganz gewählte Gebiete (Codes A1..A5/B1..B3, aus L.GEBIETE). Leer & S.themen leer = alle. ODER-verknüpft mit S.themen in themaGewaehlt().
    themen:[],                                       // FB-R3 Etappe 2: einzeln gewählte Feinthemen als "modul|thema". Ersetzt S.module+S.ap2Themen. Default leer.
    wirtschaftNur:false,                             // FB-R3: Schwerpunkt „Wirtschaft" – filtert quer über M01/M02/M03/M07 (WIRTSCHAFT_THEMEN in app_pool.js), AP1-Querschnitt (istWirtschaft)
    abrufAn:true,                                    // FB-R3 Punkt 7 (#98): Abruf-Übung ist jetzt VOREINSTELLUNG (Nutzer-Entscheid 2026-07-23). Auswahlfragen (mc/dropdown/mehrfach) zeigen im Üben/Deck/Markiert/Unterricht zuerst nur die Frage, Optionen werden selbst aufgedeckt. NICHT in Simulation/M09-Klausur. Umschalter nur noch in den Einstellungen (leise abschaltbar). Persistiert (früher Session-var).
    /* --- v5-Felder (Schema-Version, siehe migriereState) --- */
    version:5,
    markiert:{},                                     // Lesezeichen: id -> 1 (Feature #46)
    simDauerMin:90,                                  // Klausur-Timer (Feature #45)
    fokus:false,                                     // Fokus-/Konzentrationsmodus (Feature #55)
    meldungen:{},                                    // "Frage melden": id -> {grund,datum} (Feature #57)
    relevanzGewichtung:true,                         // prüfungsnah gewichten (A3/#51; Default AN, Nutzer-Entscheid 2026-07-12)
    farbsymbole:false,                               // ✓/✗ zusätzlich zu Farben (Feature #64)
    ariaAltTexte:false,                              // ARIA/Alt-Texte für SVG (Feature #65)
    onboardingDone:false,                            // Onboarding-Tour gezeigt (Feature #66)
    typHilfeAus:{},                                  // Kontexthilfe je Typ abgeschaltet: typ -> true (Feature #67)
    glossarTip:true,                                 // Begriffs-Tooltips im Fragetext (Feature #53; Default AN)
    schriftStufe:"normal",                           // #31: "normal" | "gross" | "sehrgross" (kein STATE_VERSION-Bump noetig)
    /* --- G3.2 #6: adaptive Schwierigkeit je Thema (Default AN, Nutzer-Entscheid 2026-07-19) ---
       Kein STATE_VERSION-Bump noetig: ladeState() legt fehlende Felder ueber
       Object.assign(defaultState(), s) automatisch mit ihrem Default an. */
    themaLevel:{},                                   // "modul|thema" -> Stufe 1..4
    themaTrack:{},                                   // "modul|thema" -> [bool, ...] (offener 3er-Block)
    /* --- FB-R1 (2026-07-21), ebenfalls ohne STATE_VERSION-Bump --- */
    markierenAn:false,                               // E3/R1.8: Markieren-Button anzeigen (Default AUS)
    panelOffen:{}                                    // R1.6: aufgeklappte Statistik-Panels, key -> true (Default: alle ZU)
  };
}
/* Zentrale Schema-Migration (idempotent). Historie:
   v3 -> v4: Streak/TTS/Tagesfrage/Fall-Felder entfallen, simLastIds -> simUsedIds,
             Schwierigkeit 1..3 -> 2..4 (neue Stufe 1 = Anfänger).
   v4 -> v5: S.version eingeführt; neue Feature-Felder (markiert, simDauerMin, fokus, meldungen,
             relevanzGewichtung, farbsymbole, ariaAltTexte, onboardingDone, typHilfeAus) erhalten
             ihre Defaults über Object.assign(defaultState(), s) in ladeState(). */
function migriereState(s) {
  if (!s) return s;
  if (s.version === STATE_VERSION) return s;       // R5: Early-Exit – aktuelles Schema, nichts zu tun
  if (s.simLastIds && !s.simUsedIds) s.simUsedIds = s.simLastIds;
  ["tts","tagesfrageDone","fallAktiv","fallIdx","simLastIds"].forEach(function(k){ delete s[k]; });
  if (!s._v4 && !s.version) {                        // Level-Skala verschoben: alt 1..3 = neu 2..4
    if (typeof s.level === "number") s.level = Math.min(4, s.level + 1);
  }
  s._v4 = true;
  s.version = STATE_VERSION;
  return s;
}
/* FB-R3 (2026-07-21): Das Thema „Szenarien Rhaus" heisst jetzt „Praxisszenarien". Die adaptive
   Stufe und der offene 3er-Block haengen am Schluessel „modul|thema" (L.themaKey) – ohne diese
   Umschreibung fiele das Thema auf die Grundstufe zurueck. BEWUSST OHNE STATE_VERSION-Bump: die
   Umbenennung ist idempotent (wirkt nur, wenn der alte Schluessel vorhanden ist) und laeuft
   deshalb bei JEDEM Laden mit – ein frischer Stand hat den alten Schluessel nie, also kein Effekt.
   Betrifft nur M04. */
function migriereThemaKeys(s) {
  if (!s) return s;
  ["themaLevel","themaTrack"].forEach(function(feld){
    var m = s[feld]; if (!m || typeof m !== "object") return;
    var alt = "M04|Szenarien Rhaus", neu = "M04|Praxisszenarien";
    if (Object.prototype.hasOwnProperty.call(m, alt)) {
      if (!Object.prototype.hasOwnProperty.call(m, neu)) m[neu] = m[alt];
      delete m[alt];
    }
  });
  return s;
}
function ladeState() {
  try { var s = JSON.parse(localStorage.getItem(LS_KEY)); if (s) return migriereThemaKeys(Object.assign(defaultState(), migriereState(s))); }
  catch(e){ LS_LADE_FEHLER = true; try { console.warn("ladeState fehlgeschlagen – Neustart mit leerem Stand:", e); } catch(_){} }
  return defaultState();
}
function speichere() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(S)); LS_SPEICHER_FEHLER = false; }
  catch(e){
    if (!LS_SPEICHER_FEHLER) { try { console.warn("speichere fehlgeschlagen (Speicher voll/blockiert?):", e); } catch(_){} }
    LS_SPEICHER_FEHLER = true;
  }
}
/* T5 #82 State-Kapselung: zentrale Schreib-Helfer. Alle State-Aenderungen laufen ueber setS/mutS,
   Lesezugriffe bleiben S.x. Beide persistieren via speichere(); mit persist===false wird NUR im
   Speicher geaendert (fuer transiente Session-Felder, die im Original ohne speichere() geschrieben
   wurden – Verhalten dadurch unveraendert). setS: einzelne Top-Level-Zuweisung. mutS: verschachtelte
   bzw. mehrfeldrige Mutation via Callback fn(S). */
function setS(pfad, wert, persist) { S[pfad] = wert; if (persist !== false) speichere(); return wert; }
function mutS(fn, persist) { fn(S); if (persist !== false) speichere(); }
/* R5 State-Hygiene: PURE Funktion – liefert bereinigte KOPIE (keine Mutation des Originals).
   Entfernt aus fehlerDeck und markiert alle IDs, die es im Pool nicht (mehr) gibt (Kriterium streng
   „nicht im poolIndex", NICHT passtAP – AP2-Fragen bleiben erhalten). simUsedIds („FALL:"-Vermeide-
   Mechanik) und meldungen (Anzeige „nicht im Pool" gewollt) werden BEWUSST nicht angefasst.
   Aufruf: Aufräum-IIFE am Ende von app_pool.js (nach POOL_INDEX-Befüllung, mit Sicherheitsnetz). */
function sanitizeState(poolIndex, s) {
  var kopie = Object.assign({}, s);
  kopie.fehlerDeck = {}; kopie.markiert = {}; kopie.seenUnterricht = {};
  Object.keys(s.fehlerDeck || {}).forEach(function(id){ if (poolIndex[id]) kopie.fehlerDeck[id] = s.fehlerDeck[id]; });
  Object.keys(s.markiert || {}).forEach(function(id){ if (poolIndex[id]) kopie.markiert[id] = s.markiert[id]; });
  /* ⚠️ 2026-07-30 mitgereinigt: Ohne das würden die 19 am 30.07. gestrichenen M09-IDs im Deck
     stehen bleiben und als "schon gesehen" gelten – das Deck liefe nie leer und würde nie neu
     mischen. Dieselbe Fehlerklasse wie bei fehlerDeck. */
  Object.keys(s.seenUnterricht || {}).forEach(function(id){ if (poolIndex[id]) kopie.seenUnterricht[id] = s.seenUnterricht[id]; });
  return kopie;
}
