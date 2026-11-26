/* =====================================================================
   logik.js – Reine Logik des AP1-Lernprogramms (kein DOM!)
   Läuft im Browser (window.L) UND in Node (module.exports) für Tests.
   ===================================================================== */
(function (root) {
  "use strict";
  var L = {};

  /* ---------------- Zentrale Konfiguration (T4 #83) ----------------
     Magic Numbers der Deck-/Gewichtungs-/Adaptiv-/Fehler-Deck-Logik.
     Werte unveraendert gegenueber vorherigen Inline-Literalen.        */
  L.CONFIG = {
    sperrfrist: 10,          // L.deckPick Default-Sperrfrist
    interleavingMalus: 0.3,  // L.gewichteFrage Malus fuer letzte Themen
    gewichtFloor: 0.15,      // L.gewichteFrage Untergrenze
    adaptivMinGesamt: 3,     // L.gewichteFrage Mindest-Gesamt fuer Adaptiv-Faktor
    stufeMinKandidaten: 3,   // aufStufeFiltern: ab wie wenigen Fragen EINES THEMAS auf der
                             // aktuellen Stufe die Stufe darunter dazugenommen wird.
                             // ⚠️ GEMESSEN, NICHT GESETZT (09.09.2026) - Herleitung und
                             // Messreihe: BEFUNDE_LERNFLUSS.md. Vor jeder Aenderung neu messen.
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

  /* ---------------- Zufall & Shuffle ---------------- */
  L.shuffle = function (arr, rng) {
    rng = rng || Math.random;
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  L.pick = function (arr, rng) { rng = rng || Math.random; return arr[Math.floor(rng() * arr.length)]; };

  /* ---------------- Deck-Prinzip mit Sperrfrist ----------------
     candidates: Array von Frage-IDs (bereits nach Filter/Schwierigkeit)
     seen:       Objekt {id:true} – in dieser Deck-Runde gesehene Fragen
     lastShown:  Array der zuletzt gezeigten IDs (neueste am Ende)
     sperrfrist: Anzahl Fragen, in denen eine gerade gesehene Frage
                 nach dem Neumischen nicht wiederkommen darf (Default 10)
     gewichtFn:  optional, id -> Gewicht > 0; dann gewichtete Ziehung (A3)
     Rückgabe: {id, deckReset:boolean, seen} (seen ggf. zurückgesetzt)      */
  L.deckPick = function (candidates, seen, lastShown, sperrfrist, rng, gewichtFn) {
    sperrfrist = (sperrfrist == null) ? L.CONFIG.sperrfrist : sperrfrist;
    seen = seen || {};
    lastShown = lastShown || [];
    if (!candidates || candidates.length === 0) return { id: null, deckReset: false, seen: seen };
    var unseen = candidates.filter(function (id) { return !seen[id]; });
    var deckReset = false;
    if (unseen.length === 0) {                 // Deck erschöpft -> neu mischen
      deckReset = true;
      seen = {};
      var sperre = {};
      lastShown.slice(-sperrfrist).forEach(function (id) { sperre[id] = true; });
      unseen = candidates.filter(function (id) { return !sperre[id]; });
      if (unseen.length === 0) unseen = candidates.slice(); // Pool kleiner als Sperrfrist
    } else {
      // Auch innerhalb der Runde direkte Wiederholung der letzten Fragen vermeiden, wenn möglich
      var sperre2 = {};
      lastShown.slice(-Math.min(sperrfrist, Math.max(0, unseen.length - 1))).forEach(function (id) { sperre2[id] = true; });
      var frei = unseen.filter(function (id) { return !sperre2[id]; });
      if (frei.length > 0) unseen = frei;
    }
    var id = gewichtFn ? L.pickGewichtet(unseen, gewichtFn, rng) : L.pick(unseen, rng);
    return { id: id, deckReset: deckReset, seen: seen };
  };

  /* ---------------- Gewichtungs-Engine (A3 = #51+#62+#97) ----------------
     Kombiniert multiplikativ (Nutzer-Entscheid 2026-07-12):
     1. IHK-Relevanz je Thema (3 hoch / 2 mittel / 1 niedrig), Toggle S.relevanzGewichtung
     2. Themenschwäche (ab >30 beantworteten Fragen): Faktor 1.5 - geglättete Trefferquote
     3. Interleaving: Malus x0.3 für Themen der letzten 2 Fragen (immer aktiv)
     Untergrenze 0.15 – keine Frage fällt auf Gewicht 0.                    */
  L.pickGewichtet = function (ids, gewichtFn, rng) {
    rng = rng || Math.random;
    if (!ids || !ids.length) return undefined;
    var summe = 0;
    var gw = ids.map(function (id) { var w = Math.max(0, +gewichtFn(id) || 0); summe += w; return w; });
    if (summe <= 0) return L.pick(ids, rng);
    var z = rng() * summe;
    for (var i = 0; i < ids.length; i++) { z -= gw[i]; if (z < 0) return ids[i]; }
    return ids[ids.length - 1];
  };

  /* Relevanz je kanonischem Thema, gesetzt nach Recherche der aktuellen
     AP1-Schwerpunkte (Prüfungskatalog-Cluster Stand 06/2026 + Community-Berichte).
     3 = Dauerbrenner, 2 = regelmäßig, 1 = selten/AP2-nah. Unbekannte Themen -> 2. */
  L.THEMA_RELEVANZ = {
    /* M01 */
    "Netzplan & Puffer": 3, "Gantt & PSP": 3, "Projektmerkmale & Meilensteine": 3,
    "Machbarkeit & Kalkulation": 3, "Scrum & Wasserfall": 3, "SMART-Ziele": 2,
    "Risiko & Stakeholder": 2, "Teambildung & Reflexion": 2, "Ticketsystem & Support-Level": 2,
    "KI im Störungsmanagement": 1,
    /* M02 */
    "Bezugskalkulation & Skonto": 3, "Nutzwertanalyse": 3, "Bedarfsanalyse & Marktforschung": 2,
    "Kommunikationsmodelle": 2, "Präsentation & Quellen": 2, "Englische Fachtexte": 2,
    "Marktformen & Marktsituation": 1, "Vertriebsformen": 1,
    /* M03 */
    "Berechnungen: Energie": 3, "Berechnungen: Daten & Übertragung": 3, "Datenmengen & Präfixe": 3,
    "Hardware-Komponenten": 3, "Netzwerkkomponenten & Medien": 3, "OSI-Modell & Protokolle": 3,
    "Netzwerk- und Arbeitsplatz-Ausstattung": 3, "Ergonomie & Barrierefreiheit": 3,
    "Wirtschaftlichkeit & TCO": 3, "WLAN & Übertragungsstandards": 2,
    "Cloud & Virtualisierung": 2, "Dateisysteme & Software": 2,
    /* M04 */
    "Programmiersprachen, Kontrollstrukturen & Systemgrundlagen": 3, "Lastenheft & Pflichtenheft": 3,
    "Lizenzen & Urheberrecht": 3, "Konsolenbefehle & Fehlersuche": 2, "UML & Schreibtischtest": 2,
    "DHCP & Netzwerkdienste": 2, "WLAN & VPN": 2, "GUI-Entwurf & Software-Ergonomie": 2,
    "Praxisszenarien": 2, "IP-Adressierung": 2, "Subnetting": 1, "ER-Modell & Datenbanken": 1,
    /* M05 */
    "PDCA & KVP": 3, "Testprotokoll": 3, "QM-Begriffe & Normen": 2, "Qualitätskosten": 2,
    "QM-Prozesse": 2, "Audit & Prüfverfahren": 1,
    /* M06 */
    "Schutzziele (CIA)": 3, "BSI-Grundschutz & Schutzbedarf": 3, "TOM & Rechtsgrundlagen": 3,
    "DSGVO & Datenschutz": 3, "Passwörter & Authentifizierung": 3,
    "Verschlüsselung & Signaturen": 2, "Phishing & Social Engineering": 2,
    "Backup & Verfügbarkeit": 2, "Härtung & Zugriffskontrolle": 2,
    "IT-Sicherheit und Datenschutz-Vorfall": 2, "Security by Design": 1,
    /* M07 */
    "Vertragsarten": 3, "Vertragsstörungen & Mängel": 3, "SLA & Servicevertrag": 3,
    "Abnahme & Übergabe": 3, "Soll-Ist & Nachkalkulation": 3,
    "Aufbauorganisation & Vollmachten": 2, "Unternehmensziele & Leitbild": 2,
    "Change Management": 2, "Onsite/Remote & Nachfolgeaufträge": 1,
    /* NEU 2026-07-27 (Qualitätsrunde Q1, Etappe 5): Gebiet A4 „Kunden und Kundinnen einweisen"
       hatte nur drei Feinthemen und war mit 24 von 843 AP1-Fragen (2,85 %) das mit Abstand
       dünnste Prüfungsgebiet. Einweisungsgespräch, Schulungsunterlagen, Übergabeprotokoll und
       Endanwender-Dokumentation lagen bisher in KEINEM Thema – sie unter „Abnahme & Übergabe"
       einzusortieren wäre fachlich schief (Abnahme ist der Rechtsakt, Einweisung die Leistung
       danach). Relevanz 2 wie die anderen A4-Themen außer Abnahme. */
    "Einweisung & Schulung": 2,
    /* M08 (in der App AP2-Stoff, greift nur bei inklAP2) */
    "Ausbildungsvertrag & BBiG": 1, "Kündigung": 1, "Mitbestimmung: JAV & Betriebsrat": 1,
    "Rechte & Pflichten": 1, "Tarifrecht": 1, "Arbeitsschutz & Arbeitszeit": 1,
    /* M08, Etappe A der M09-Aufloesung (2026-08-04): 48 Fragen aus der Klausurvorbereitung.
       Der IHK-Prüfungskatalog (2. Aufl. 2024, S. 9) stellt fest: „Wirtschafts- und Sozialkunde
       ist eigener Prüfungsbereich der AP2 – wirtschaftliche Themen tauchen in AP1 nur innerhalb
       der Fragenkomplexe 02, 03 und 07 auf." HGB-Stoff (Kaufmann, Firma, Rechtsformen),
       Führungslehre und Vertragsanbahnung stehen dort NICHT – deshalb B3 und nicht A1/A5. */
    "Rechtsformen": 1, "Kaufmannseigenschaft": 1, "Firma & Handelsregister": 1,
    "Führung & Managementtechniken": 1, "Aufgabenanalyse & -synthese": 1,
    "Vertragsanbahnung: Anfrage & Angebot": 1
  };

  /* M09 „Klausurvorbereitung" (2026-07-20): kanonische Themenliste des Unterrichtsmoduls.
     BEWUSST getrennt von THEMA_RELEVANZ – das ist eine GEWICHTUNGS-Tabelle und speist Ziehung
     und Bereitschafts-Score, von denen M09 ausgeschlossen ist (Sperre in passtAP()). Dies hier
     ist eine reine Vokabelliste für die Validierung; die beiden Mengen MÜSSEN disjunkt bleiben
     (bewacht durch tests/test_unterricht.js). Single Source für validate_batch.js,
     validate_pool.js und tools/build_schema.js; MUSS mit UNTERRICHT_MATRIX.md übereinstimmen.
     ⚠️ GEÄNDERT 2026-07-30 nach der Probeklausur „Übungsfragen WiSo 31.07.2026 – FISI0126":
     NEU „Aufbau- & Ablauforganisation" (Klausuraufgaben 3, 4, 5, 19, 21 und der Abschnitt
     „Ablauforganisation"); ENTFERNT „Berufsausbildung (BBiG/JArbSchG)" – die 19 Fragen
     M09-131…149 wurden gestrichen, weil die Probeklausur das Thema mit keinem Wort nennt
     (Nutzer-Entscheid 30.07.: die Probeklausur ist laut Lehrer der Bauplan der echten Klausur,
     nicht bloß eine Stichprobe). BBiG-Stoff bleibt in M08 erhalten.
     ⚠️ GEÄNDERT 2026-08-04, Etappe A der M09-Aufloesung (Nutzer-Entscheid nach abgelaufenem
     Klausurtermin): Fünf Themen sind KOMPLETT nach M08/B3 umgezogen und stehen jetzt in
     THEMA_RELEVANZ – „Rechtsformen", „Kaufmannseigenschaft", „Die Firma" (dort
     „Firma & Handelsregister"), „Führungsstile" (dort „Führung & Managementtechniken") und
     „Aufgabenanalyse & -synthese". Sie MÜSSEN hier raus, sonst reisst die Disjunktheits-
     Zusicherung in tests/test_unterricht.js. Die acht verbliebenen Themen warten auf Etappe B
     (Umzug nach M01/M02/M03/M07), die erst laufen kann, wenn A4 ausgebaut ist – der
     Gebiets-Wächter erlaubt nur 28 zusätzliche AP1-Fragen, gebraucht werden 45. */
  L.M09_THEMEN = ["Wertschöpfung", "Aufbau- & Ablauforganisation",
    "Leitungssysteme", "Managementtechniken", "Gantt-Diagramm", "Netzplantechnik",
    "Handlungsvollmachten & Prokura", "Kundenauftrag: Anfrage & Angebot"];

  /* FB-R3 (2026-07-23): Sortier-Struktur nach Prüfungsordnung (FISI, Prüfungskatalog 2. Aufl.).
     Oberkategorie „gebiet" (Feld an jeder Frage). AP1 = 5 Gebiete (§ 9 Abs. 2), AP2 = 3 Prüfungs-
     bereiche (§ 21/§ 22/§ 4 Abs. 7), M9 = Klausurvorbereitung (klassenspezifisch, separat).
     L.GEBIETE ist die Anzeige-Reihenfolge + Klarnamen; L.THEMA_GEBIET ist die SINGLE SOURCE der
     Zuordnung Thema→Gebiet und wird von validate_pool gegen das Pool-Feld „gebiet" geprüft
     (Tippfehler-/Drift-Wächter, analog WIRTSCHAFT_THEMEN). */
  L.GEBIETE = [
    ["A1", "Kundenbedarfe ermitteln", "AP1"],
    ["A2", "Hard- und Software auswählen & beschaffen", "AP1"],
    ["A3", "IT-Arbeitsplatz konfigurieren, testen & absichern", "AP1"],
    ["A4", "Kunden und Kundinnen einweisen", "AP1"],
    ["A5", "Leistungserbringung kontrollieren & protokollieren", "AP1"],
    ["B1", "Konzeption und Administration von IT-Systemen", "AP2"],
    ["B2", "Analyse und Entwicklung von Netzwerken", "AP2"],
    ["B3", "Wirtschafts- und Sozialkunde", "AP2"],
    ["M9", "Klausurvorbereitung", "M09"]
  ];
  L.THEMA_GEBIET = {
    "M01|Machbarkeit & Kalkulation":"A1","M01|SMART-Ziele":"A1","M01|Projektmerkmale & Meilensteine":"A1","M01|Scrum & Wasserfall":"A1","M01|Risiko & Stakeholder":"A1","M01|Teambildung & Reflexion":"A1","M01|Gantt & PSP":"A5","M01|Netzplan & Puffer":"A5","M01|Ticketsystem & Support-Level":"A5","M01|KI im Störungsmanagement":"A5",
    "M02|Bedarfsanalyse & Marktforschung":"A1","M02|Kommunikationsmodelle":"A1","M02|Marktformen & Marktsituation":"A1","M02|Nutzwertanalyse":"A1","M02|Vertriebsformen":"A1","M02|Englische Fachtexte":"A1","M02|Präsentation & Quellen":"A4","M02|Bezugskalkulation & Skonto":"A2",
    "M03|Hardware-Komponenten":"A2","M03|Netzwerkkomponenten & Medien":"A2","M03|Cloud & Virtualisierung":"A2","M03|Dateisysteme & Software":"A2","M03|Datenmengen & Präfixe":"A2","M03|Berechnungen: Daten & Übertragung":"A2","M03|Berechnungen: Energie":"A2","M03|WLAN & Übertragungsstandards":"A2","M03|Wirtschaftlichkeit & TCO":"A2","M03|Netzwerk- und Arbeitsplatz-Ausstattung":"A2","M03|OSI-Modell & Protokolle":"A3","M03|Ergonomie & Barrierefreiheit":"A3",
    "M04|Konsolenbefehle & Fehlersuche":"A3","M04|DHCP & Netzwerkdienste":"A3","M04|WLAN & VPN":"A3","M04|GUI-Entwurf & Software-Ergonomie":"A3","M04|Programmiersprachen, Kontrollstrukturen & Systemgrundlagen":"A3","M04|UML & Schreibtischtest":"A3","M04|Praxisszenarien":"A3","M04|Lastenheft & Pflichtenheft":"A1","M04|Lizenzen & Urheberrecht":"A2","M04|IP-Adressierung":"A3","M04|Subnetting":"B2","M04|ER-Modell & Datenbanken":"B1",
    "M05|Audit & Prüfverfahren":"A3","M05|PDCA & KVP":"A3","M05|QM-Begriffe & Normen":"A3","M05|QM-Prozesse":"A3","M05|Qualitätskosten":"A3","M05|Testprotokoll":"A3",
    "M06|BSI-Grundschutz & Schutzbedarf":"A3","M06|Backup & Verfügbarkeit":"A3","M06|DSGVO & Datenschutz":"A3","M06|Härtung & Zugriffskontrolle":"A3","M06|IT-Sicherheit und Datenschutz-Vorfall":"A3","M06|Passwörter & Authentifizierung":"A3","M06|Phishing & Social Engineering":"A3","M06|Schutzziele (CIA)":"A3","M06|Security by Design":"A3","M06|TOM & Rechtsgrundlagen":"A3","M06|Verschlüsselung & Signaturen":"A3",
    "M07|Abnahme & Übergabe":"A4","M07|Change Management":"A4","M07|Einweisung & Schulung":"A4","M07|SLA & Servicevertrag":"A5","M07|Soll-Ist & Nachkalkulation":"A5","M07|Vertragsarten":"A5","M07|Vertragsstörungen & Mängel":"A5","M07|Onsite/Remote & Nachfolgeaufträge":"A5","M07|Aufbauorganisation & Vollmachten":"A5","M07|Unternehmensziele & Leitbild":"A5",
    "M08|Arbeitsschutz & Arbeitszeit":"B3","M08|Ausbildungsvertrag & BBiG":"B3","M08|Kündigung":"B3","M08|Mitbestimmung: JAV & Betriebsrat":"B3","M08|Rechte & Pflichten":"B3","M08|Tarifrecht":"B3",
    "M08|Rechtsformen":"B3","M08|Kaufmannseigenschaft":"B3","M08|Firma & Handelsregister":"B3","M08|Führung & Managementtechniken":"B3","M08|Aufgabenanalyse & -synthese":"B3","M08|Vertragsanbahnung: Anfrage & Angebot":"B3"
  };
  L.gebietFuer = function (f) { return (f && f.modul === "M09") ? "M9" : (f ? L.THEMA_GEBIET[f.modul + "|" + f.thema] : undefined); };
  L.gebietName = function (code) { var e = L.GEBIETE.find(function (g) { return g[0] === code; }); return e ? e[1] : code; };

  /* Gewicht einer Frage im Üben-Deck.
     ctx: { relevanzAn:bool, adaptivAktiv:bool (erst ab >30 beantwortet),
            themaStat: f -> {richtig,gesamt}|null, letzteThemen: [thema,...] } */
  L.gewichteFrage = function (f, ctx) {
    ctx = ctx || {};
    var w = ctx.relevanzAn ? (L.THEMA_RELEVANZ[f.thema] || 2) : 2;
    if (ctx.adaptivAktiv && typeof ctx.themaStat === "function") {
      var st = ctx.themaStat(f);
      if (st && st.gesamt >= L.CONFIG.adaptivMinGesamt) {
        var q = (st.richtig + 1) / (st.gesamt + 2);   // geglättete Trefferquote (Laplace)
        w *= (1.5 - q);                                // 0.5 (stark) .. 1.5 (schwach)
      }
    }
    if (ctx.letzteThemen && ctx.letzteThemen.indexOf(f.thema) !== -1) w *= L.CONFIG.interleavingMalus; // Interleaving
    return Math.max(w, L.CONFIG.gewichtFloor);
  };

  /* ---------------- Bereitschafts-Score (L1 / G1) ----------------
     Gewichteter Mittelwert (Gewicht = THEMA_RELEVANZ, Default 2) der Themen-Trefferquoten,
     NUR über tatsächlich geübte Themen (gesamt>=1). Ungeübte Themen fließen NICHT ein
     (Nutzer-Entscheid "nur Geübtes werten") – sie werden im Render separat als "offen" gezeigt.
     Quote = richtig/gesamt*100 (roh, wie die Modul-Balken). Rein aus statistik ableitbar
     (Keys "T:<modul>:<thema>") → ohne Pool testbar. Rückgabe je Modul + gesamt. */
  L.BEREITSCHAFT_AMPEL = { rot: 60, gelb: 80 };   // score<rot=rot, rot..gelb=gelb, >gelb=grün
  L.ampelFuer = function (score) {
    if (score == null) return "keine";
    if (score < L.BEREITSCHAFT_AMPEL.rot)  return "rot";
    if (score <= L.BEREITSCHAFT_AMPEL.gelb) return "gelb";
    return "gruen";
  };
  /* Zerlegt einen Statistik-Schlüssel "T:modul:thema" in {modul,thema} (thema kann ":" enthalten). */
  L.themaKeyTeile = function (k) {
    var teile = String(k).split(":");           // ["T", modul, ...thema]
    return { modul: teile[1], thema: teile.slice(2).join(":") };
  };
  /* FB-R3 (2026-07-23): Fragen je Gebiet aus den T:modul:thema-Einträgen ableiten (roh, ungewichtet).
     Liefert { gebietCode: {richtig,gesamt,themen} }. M09 wird ausgelassen (eigener Bereich). */
  L.statProGebiet = function (statistik) {
    statistik = statistik || {}; var out = {};
    Object.keys(statistik).forEach(function (k) {
      if (k.indexOf("T:") !== 0) return;
      var e = statistik[k]; if (!e || !e.gesamt) return;
      var t = L.themaKeyTeile(k); if (t.modul === "M09") return;
      var g = L.THEMA_GEBIET[t.modul + "|" + t.thema]; if (!g) return;
      var o = out[g] || (out[g] = { richtig: 0, gesamt: 0, themen: 0 });
      o.richtig += e.richtig; o.gesamt += e.gesamt; o.themen += 1;
    });
    return out;
  };
  /* Prüfungs-Bereitschaft je GEBIET (FB-R3 2026-07-23; vorher je Modul). Relevanz-gewichtet über
     die T:modul:thema-Einträge; die Zuordnung Thema→Gebiet kommt aus L.THEMA_GEBIET. Rückgabefeld
     heißt jetzt `gebiete` (Schlüssel = Gebiet-Codes A1..B3). M09 zählt NIE mit. */
  L.bereitschaft = function (statistik) {
    statistik = statistik || {};
    var geb = {};
    var g = { wsum: 0, rsum: 0, themen: 0, antworten: 0 };
    Object.keys(statistik).forEach(function (k) {
      if (k.indexOf("T:") !== 0) return;
      var e = statistik[k];
      if (!e || !e.gesamt) return;
      var t = L.themaKeyTeile(k);
      if (t.modul === "M09") return;            // „Klausurvorbereitung" zaehlt NIE in die AP1-Bereitschaft (Nutzer-Entscheid 2026-07-20)
      var code = L.THEMA_GEBIET[t.modul + "|" + t.thema];
      if (!code) return;                        // kein Soll-Gebiet -> nicht werten (Wächter fängt das im Pool ab)
      var rel = L.THEMA_RELEVANZ[t.thema] || 2;
      var quote = e.richtig / e.gesamt * 100;
      var m = geb[code] || (geb[code] = { wsum: 0, rsum: 0, themen: 0, antworten: 0 });
      m.wsum += rel * quote; m.rsum += rel; m.themen += 1; m.antworten += e.gesamt;
      g.wsum += rel * quote; g.rsum += rel; g.themen += 1; g.antworten += e.gesamt;
    });
    var gebiete = {};
    Object.keys(geb).forEach(function (code) {
      var m = geb[code];
      var score = m.rsum ? Math.round(m.wsum / m.rsum) : null;
      gebiete[code] = { score: score, ampel: L.ampelFuer(score), themen: m.themen, antworten: m.antworten };
    });
    var gScore = g.rsum ? Math.round(g.wsum / g.rsum) : null;
    return {
      gebiete: gebiete,
      gesamt: { score: gScore, ampel: L.ampelFuer(gScore), themen: g.themen, antworten: g.antworten }
    };
  };

  /* Stufen 1..4 (1 = Anfänger, 4 = Schwer). Grenzen der adaptiven Schwierigkeit je Thema (G3.2).
     Die alte globale Auf-/Abstufung (L.autoLevel/L.trackAntwort/L.levelReif samt Level-Dialog)
     wurde 2026-07-23 als toter Code entfernt – abgelöst durch die Je-Thema-Logik weiter unten. */
  L.LEVEL_MIN = 1; L.LEVEL_MAX = 4;

  /* ---------------- G3.2 #6: Adaptive Schwierigkeit JE THEMA ----------------
     Loest das globale Auf-/Abstufen samt Level-Dialog ab (Nutzer-Entscheid E3, 2026-07-19).
     Je Thema werden die Antworten in einem BLOCK gesammelt; sobald L.CONFIG.adaptivBlock
     Antworten vorliegen, wird ausgewertet und der Block GELEERT (kein gleitendes Fenster,
     also hoechstens eine Stufenaenderung je Block):
       alle Antworten richtig                         -> Stufe +1
       hoechstens L.CONFIG.adaptivAbSchwelle richtig   -> Stufe -1
       alles dazwischen                               -> Stufe bleibt
     Grenzen L.LEVEL_MIN..L.LEVEL_MAX. Schluessel = "modul|thema" (L.themaKey).
     Der MANUELLE Modus uebersteuert das Ganze im App-Code (S.levelModus).             */
  L.themaKey = function (modul, thema) { return String(modul) + "|" + String(thema); };
  /* Aktuelle Stufe eines Themas. Unbekanntes Thema startet auf `start` (= globale S.level). */
  L.themaStufe = function (levels, key, start) {
    var v = (levels || {})[key];
    if (typeof v !== "number" || !isFinite(v)) v = (typeof start === "number" && isFinite(start)) ? start : L.LEVEL_MIN;
    return Math.max(L.LEVEL_MIN, Math.min(L.LEVEL_MAX, Math.round(v)));
  };
  /* Bucht eine Antwort und liefert die (ggf. angepasste) Stufe. Mutiert levels/track bewusst
     in-place, damit der Aufruf in mutS(...) ohne Rueckschreiben auskommt. */
  /* ⚠️ 2026-07-30: Die Blockgroesse haengt jetzt an der AKTUELLEN Stufe. Aus Stufe 1 genuegt eine
     richtige Antwort (adaptivBlockStufe1), ab Stufe 2 sind es zwei (adaptivBlock).
     Nutzer-Entscheid: "von 3 auf 2 senken mit der Ausnahme das man nur 1ne richtige braucht um
     aus anfaenger rauszukommen". Grund siehe L.CONFIG. */
  L.blockFuerStufe = function (stufe) {
    return stufe <= L.LEVEL_MIN ? L.CONFIG.adaptivBlockStufe1 : L.CONFIG.adaptivBlock;
  };
  L.adaptivBuchen = function (levels, track, key, richtig, start) {
    levels = levels || {}; track = track || {};
    var stufe = L.themaStufe(levels, key, start);
    var block = L.blockFuerStufe(stufe);
    var a = track[key] = track[key] || [];
    a.push(!!richtig);
    if (a.length >= block) {
      var treffer = a.filter(Boolean).length;
      if (treffer >= block) stufe = Math.min(L.LEVEL_MAX, stufe + 1);
      else if (treffer <= L.CONFIG.adaptivAbSchwelle) stufe = Math.max(L.LEVEL_MIN, stufe - 1);
      track[key] = [];
    }
    levels[key] = stufe;
    return { levels: levels, track: track, stufe: stufe };
  };

  /* ---------------- G3.6b: Punkteverteilung der AP1-Aufgaben ----------------
     RECHERCHE-BEFUND (2026-07-19, zwei unabhaengige Quellen): Die AP1 besteht aus VIER
     ungebundenen Aufgaben, jede zwischen 20 und 30 Punkten, Summe 100, 90 Minuten. Der
     Schwerpunkt je Aufgabe wird zufaellig gezogen. Die bisher fest verdrahteten 25/25/26/24
     waren also nicht falsch (Summe 100, alle im Korridor), aber nur EINE moegliche Auspraegung.
     Nutzer-Entscheid: Punkte je Simulationslauf wuerfeln, die THEMATISCHE Zuordnung der vier
     Aufgaben aber fest lassen, damit jeder Durchlauf den ganzen Stoff abdeckt.
     Liefert n Werte in [min, max] mit exakter Summe `summe`. Verteilt den Rest ueber `summe`
     hinaus Punkt fuer Punkt auf zufaellige, noch nicht ausgereizte Aufgaben – dadurch sind alle
     zulaessigen Verteilungen erreichbar und die Summe stimmt immer.
     Ist die Vorgabe unerfuellbar (z. B. Summe groesser als n*max), wird defensiv so weit wie
     moeglich aufgefuellt und das Ergebnis auf den gueltigen Bereich begrenzt zurueckgegeben. */
  L.wuerfelPunkte = function (n, min, max, summe, rng) {
    rng = rng || Math.random;
    var a = [], i;
    for (i = 0; i < n; i++) a.push(min);
    var rest = summe - n * min;
    while (rest > 0) {
      var frei = [];
      for (i = 0; i < n; i++) if (a[i] < max) frei.push(i);
      if (!frei.length) break;                       // Kapazitaet erschoepft (unerfuellbare Vorgabe)
      a[frei[Math.floor(rng() * frei.length)]]++;
      rest--;
    }
    return a;
  };

  /* ---------------- IHK-Notenschlüssel ---------------- */
  /* IHK-Notenschlüssel (100-Punkte-Schlüssel, G3.6a #5): 92 / 81 / 67 / 50 / 30.
     Unterhalb von 50 % wird jetzt zwischen „mangelhaft" (Note 5) und „ungenügend" (Note 6)
     unterschieden – vorher fiel beides pauschal auf Note 5. Bestanden ab 50 %. */
  L.NOTEN_SCHLUESSEL = [
    { ab: 92, note: 1, text: "sehr gut" },
    { ab: 81, note: 2, text: "gut" },
    { ab: 67, note: 3, text: "befriedigend" },
    { ab: 50, note: 4, text: "ausreichend" },
    { ab: 30, note: 5, text: "mangelhaft" },
    { ab: 0, note: 6, text: "ungenügend" }
  ];
  L.NOTE_BESTANDEN_AB = 50;
  L.note = function (prozent) {
    var p = Number(prozent);
    if (!isFinite(p)) p = 0;
    for (var i = 0; i < L.NOTEN_SCHLUESSEL.length; i++) {
      var s = L.NOTEN_SCHLUESSEL[i];
      if (p >= s.ab) return { note: s.note, text: s.text, bestanden: p >= L.NOTE_BESTANDEN_AB };
    }
    return { note: 6, text: "ungenügend", bestanden: false };
  };

  /* ---------------- Schema-Validierung (Selbsttest) ---------------- */
  /* L.TYPEN, L.TYP_META und L.SIM_TYPEN werden aus der Fragetyp-Registry L.TYP
     abgeleitet (#79). L.TYP wird nach den grade-Funktionen weiter unten definiert
     (eine Quelle der Wahrheit je Aufgabentyp: Typ-Liste, Auto-Bewertbarkeit,
     Zeit/Punkte-Richtwerte #73, grade-Funktion). */
  L.TYP_META_DEFAULT = { sek: 90, punkte: 1 };
  /* Liefert {sek, punkte} für eine Frage; Frage-Overrides (f.sek/f.punkte) haben Vorrang. */
  L.metaFuer = function (f) {
    var base = (f && L.TYP_META[f.typ]) || L.TYP_META_DEFAULT;
    return {
      sek:    (f && typeof f.sek    === "number" && f.sek    > 0) ? f.sek    : base.sek,
      punkte: (f && typeof f.punkte === "number" && f.punkte > 0) ? f.punkte : base.punkte
    };
  };
  L.validateFragen = function (fragen) {
    var fehler = [], gueltig = [], ids = {};
    if (!Array.isArray(fragen)) return { gueltig: [], fehler: [{ id: "-", meldung: "FRAGEN ist kein Array" }] };
    fragen.forEach(function (f, i) {
      var probleme = [];
      function need(feld, bed) { if (!bed) probleme.push("Feld '" + feld + "' fehlt oder ist ungültig"); }
      if (!f || typeof f !== "object") { fehler.push({ id: "?", index: i, meldung: "Eintrag " + i + " ist kein Objekt" }); return; }
      need("id", typeof f.id === "string" && f.id.length > 0);
      if (f.id && ids[f.id]) probleme.push("doppelte ID '" + f.id + "'");
      if (f.id) ids[f.id] = true;
      need("pruefungsteil", f.pruefungsteil === "AP1" || f.pruefungsteil === "AP2");
      need("modul", typeof f.modul === "string" && /^M0[1-9]$/.test(f.modul));   // M09 = „Klausurvorbereitung" (2026-07-20)
      need("thema", typeof f.thema === "string" && f.thema.length > 0);
      need("typ", L.TYPEN.indexOf(f.typ) >= 0);
      need("schwierigkeit", [1, 2, 3, 4].indexOf(f.schwierigkeit) >= 0);
      need("frage", typeof f.frage === "string" && f.frage.length > 0);
      var t = f.typ;
      var iTyp = (t === "bild") ? (f.unterTyp || "mc") : t;
      if (t === "bild") {
        need("svg", typeof f.svg === "string" && f.svg.indexOf("<svg") >= 0);
        need("unterTyp", ["mc", "lueckentext", "dropdown"].indexOf(f.unterTyp) >= 0);
      }
      if (iTyp === "mc") {
        need("optionen", Array.isArray(f.optionen) && f.optionen.length === 4 &&
          f.optionen.every(function (o) { return typeof o === "string" && o.length > 0; }));
        need("loesungIndex", typeof f.loesungIndex === "number" && f.loesungIndex >= 0 &&
          f.optionen && f.loesungIndex < f.optionen.length);
      }
      if (iTyp === "lueckentext") {
        need("luecken", Array.isArray(f.luecken) && f.luecken.length > 0 &&
          f.luecken.every(function (l) { return Array.isArray(l) && l.length > 0; }));
        need("frage (Lücken)", ((f.frage || "").match(/___/g) || []).length === (f.luecken || []).length);
      }
      if (t === "zuordnung") {
        need("paare", Array.isArray(f.paare) && f.paare.length >= 3 &&
          f.paare.every(function (p) { return Array.isArray(p) && p.length === 2; }));
      }
      if (t === "freitext" || t === "erklaeren") {
        need("musterloesung", typeof f.musterloesung === "string" && f.musterloesung.length > 0);
        if (f.schluesselbegriffe != null) {   // #76: optional, abwärtskompatibel
          var sb = f.schluesselbegriffe;
          /* Seit 2026-07-20 darf ein Eintrag auch eine ALTERNATIVLISTE sein (>= 2 Strings) –
             gleiche Regel wie im JSON-Schema und in gradeTeilpunkte. Vorher lehnte NUR diese
             Stelle Listen ab, womit eine gueltige Pool-Frage beim Boot still rausgefallen waere. */
          var eintragOk = function (x) {
            if (typeof x === "string") return x.trim().length > 0;
            return Array.isArray(x) && x.length >= 2 && x.every(function (y) { return typeof y === "string" && y.trim().length > 0; });
          };
          var strListe = function (a) { return Array.isArray(a) && a.every(eintragOk); };
          need("schluesselbegriffe.pflicht (nicht leer)", sb && typeof sb === "object" && strListe(sb.pflicht) && sb.pflicht.length >= 1);
          need("schluesselbegriffe.kuer (optional, Strings/Alternativlisten)", !sb || sb.kuer == null || strListe(sb.kuer));
        }
      }
      if (t === "mehrfach") {
        need("optionen", Array.isArray(f.optionen) && f.optionen.length >= 3 &&
          f.optionen.every(function (o) { return typeof o === "string" && o.length > 0; }));
        need("loesungIndizes", Array.isArray(f.loesungIndizes) && f.loesungIndizes.length >= 1 &&
          f.loesungIndizes.every(function (x) { return typeof x === "number" && x >= 0 && f.optionen && x < f.optionen.length; }));
      }
      if (t === "mtf") {
        need("aussagen", Array.isArray(f.aussagen) && f.aussagen.length >= 3 &&
          f.aussagen.every(function (a) { return a && typeof a.text === "string" && a.text.length > 0 && typeof a.wahr === "boolean"; }));
      }
      if (t === "kreuztabelle") {
        need("zeilen", Array.isArray(f.zeilen) && f.zeilen.length >= 2 &&
          f.zeilen.every(function (z) { return typeof z === "string" && z.length > 0; }));
        need("spalten", Array.isArray(f.spalten) && f.spalten.length >= 2 &&
          f.spalten.every(function (s) { return typeof s === "string" && s.length > 0; }));
        need("loesung (Matrix zeilen×spalten, bool)", Array.isArray(f.loesung) && f.loesung.length === (f.zeilen || []).length &&
          f.loesung.every(function (row) { return Array.isArray(row) && row.length === (f.spalten || []).length &&
            row.every(function (c) { return typeof c === "boolean"; }); }));
        need("mind. eine wahre Zelle", Array.isArray(f.loesung) && f.loesung.some(function (row) { return Array.isArray(row) && row.some(Boolean); }));
      }
      if (t === "szenario2") {
        var okSchritt = function (s) {
          return s && typeof s === "object" && typeof s.frage === "string" && s.frage.length > 0 &&
            Array.isArray(s.optionen) && s.optionen.length >= 2 &&
            s.optionen.every(function (o) { return typeof o === "string" && o.length > 0; }) &&
            typeof s.loesungIndex === "number" && s.loesungIndex >= 0 && s.loesungIndex < s.optionen.length;
        };
        need("schritt1", okSchritt(f.schritt1));
        need("schritt2", okSchritt(f.schritt2));
        need("feedback1 (je Schritt-1-Option)", Array.isArray(f.feedback1) && f.schritt1 && Array.isArray(f.schritt1.optionen) &&
          f.feedback1.length === f.schritt1.optionen.length &&
          f.feedback1.every(function (x) { return typeof x === "string" && x.length > 0; }));
      }
      if (t === "reihenfolge") {
        need("schritte", Array.isArray(f.schritte) && f.schritte.length >= 3 &&
          f.schritte.every(function (s) { return typeof s === "string" && s.length > 0; }));
      }
      if (t === "dropdown") {
        need("luecken", Array.isArray(f.luecken) && f.luecken.length > 0 &&
          f.luecken.every(function (l) { return l && Array.isArray(l.optionen) && l.optionen.length >= 2 &&
            typeof l.loesung === "number" && l.loesung >= 0 && l.loesung < l.optionen.length; }));
        need("frage (Dropdown-Lücken)", ((f.frage || "").match(/___/g) || []).length === (f.luecken || []).length);
        // #102 optionale Erweiterungen (abwärtskompatibel): Freitext-Startmodus + zusätzliche Freitext-Schreibweisen
        need("freitext (optional bool)", f.freitext == null || typeof f.freitext === "boolean");
        need("luecken[].akzeptiert (optional String[])", Array.isArray(f.luecken) && f.luecken.every(function (l) {
          return !l || l.akzeptiert == null || (Array.isArray(l.akzeptiert) && l.akzeptiert.every(function (x) { return typeof x === "string" && x.trim().length > 0; })); }));
      }
      if (t === "hotspot") {
        need("svg", typeof f.svg === "string" && f.svg.indexOf("<svg") >= 0);
        need("zonen", Array.isArray(f.zonen) && f.zonen.length >= 2 &&
          f.zonen.some(function (z) { return z && z.richtig; }) &&
          f.zonen.every(function (z) { return z && typeof z.x === "number" && typeof z.y === "number" && typeof z.w === "number" && typeof z.h === "number"; }));
      }
      if (t === "fehlersuche") {
        need("zeilen", Array.isArray(f.zeilen) && f.zeilen.length >= 2 && f.zeilen.every(function (z) { return typeof z === "string"; }));
        need("fehlerZeile", typeof f.fehlerZeile === "number" && f.fehlerZeile >= 0 && f.zeilen && f.fehlerZeile < f.zeilen.length);
      }
      if (t === "rechenassistent") {
        var randomisiert = !!(f.variablen && typeof f.variablen === "object" && !Array.isArray(f.variablen));
        need("schritte", Array.isArray(f.schritte) && f.schritte.length >= 2 &&
          f.schritte.every(function (s) {
            if (!s || typeof s.text !== "string" || !s.text.length) return false;
            /* #35: randomisierte Aufgaben tragen je Schritt eine Formel statt fester Lösungen. */
            if (randomisiert) return typeof s.formel === "string" && s.formel.length > 0;
            return Array.isArray(s.loesung) && s.loesung.length >= 1;
          }));
        if (randomisiert) {
          var varNamen = Object.keys(f.variablen);
          need("variablen (min<=max, schritt>0)", varNamen.length >= 1 && varNamen.every(function (k) {
            var d = f.variablen[k];
            return d && typeof d.min === "number" && typeof d.max === "number" && d.max >= d.min &&
              (d.schritt == null || (typeof d.schritt === "number" && d.schritt > 0));
          }));
          need("variablennamen kollidieren nicht mit s1..sN", varNamen.every(function (k) { return !/^s\d+$/.test(k); }));
          /* Formeln müssen mit Testwerten fehlerfrei durchrechnen und dürfen nur bekannte
             Bezeichner nutzen (Variablen + bereits berechnete Vorgängerschritte).          */
          var probe = {}, ok = true, meldung = "";
          varNamen.forEach(function (k) { probe[k] = L.zieheWert(f.variablen[k], function () { return 0.5; }); });
          (f.schritte || []).forEach(function (s, i) {
            if (!ok || !s || typeof s.formel !== "string") return;
            try { probe["s" + (i + 1)] = L.rundeAuf(L.evalFormel(s.formel, probe), s.dezimalen); }
            catch (e) { ok = false; meldung = e.message; }
          });
          need("formeln rechenbar" + (ok ? "" : " (" + meldung + ")"), ok);
          /* Nicht nur EINE Probe: alle Extremkombinationen (min/max je Variable) plus eine
             Zufallsstichprobe. So faellt schon zur Bauzeit auf, wenn eine zulaessige
             Kombination entartet (z. B. Ersparnis 0 -> Division durch 0).            */
          if (ok) {
            var entartet = "", kombis = [];
            var grenzen = varNamen.map(function (k) { return [f.variablen[k].min, f.variablen[k].max]; });
            var anzahl = Math.min(Math.pow(2, varNamen.length), 64);
            for (var c = 0; c < anzahl; c++) {
              var w = {};
              varNamen.forEach(function (k, bi) { w[k] = grenzen[bi][(c >> bi) & 1]; });
              kombis.push(w);
            }
            for (var z = 0; z < 40; z++) {
              var wz = {};
              varNamen.forEach(function (k) { wz[k] = L.zieheWert(f.variablen[k]); });
              kombis.push(wz);
            }
            kombis.forEach(function (w) {
              if (entartet) return;
              var wv = Object.assign({}, w);
              for (var i = 0; i < f.schritte.length; i++) {
                try { wv["s" + (i + 1)] = L.rundeAuf(L.evalFormel(f.schritte[i].formel, wv), f.schritte[i].dezimalen); }
                catch (e) { entartet = e.message + " bei " + JSON.stringify(w); return; }
              }
            });
            need("formeln fuer ALLE zulaessigen Werte rechenbar" + (entartet ? " (" + entartet + ")" : ""), !entartet);
          }
          /* Platzhalter müssen mit den Probewerten auflösbar sein (sonst bliebe "{x}" sichtbar). */
          var offen = [];
          [f.frage, f.erklaerungKurz, f.erklaerungLang].concat((f.schritte || []).map(function (s) { return s && s.text; }))
            .forEach(function (txt) {
              (String(txt || "").match(/\{[^{}]+\}/g) || []).forEach(function (ph) {
                var ausdruck = ph.slice(1, -1).split("|")[0].trim();
                try { L.evalFormel(ausdruck, probe); } catch (e) { if (offen.indexOf(ph) < 0) offen.push(ph); }
              });
            });
          need("platzhalter aufloesbar" + (offen.length ? " (" + offen.join(",") + ")" : ""), offen.length === 0);
        }
      }
      if (t === "matrix") {
        need("quadranten", Array.isArray(f.quadranten) && f.quadranten.length === 4 && f.quadranten.every(function (q) { return typeof q === "string" && q.length > 0; }));
        need("elemente", Array.isArray(f.elemente) && f.elemente.length >= 2 &&
          f.elemente.every(function (e) { return e && typeof e.text === "string" && e.text.length > 0 && typeof e.quadrant === "number" && e.quadrant >= 0 && e.quadrant < 4; }));
      }
      if (t === "beschriftung") {
        need("svg", typeof f.svg === "string" && f.svg.indexOf("<svg") >= 0);
        need("ziele", Array.isArray(f.ziele) && f.ziele.length >= 2 && f.ziele.every(function (z) { return z && typeof z.loesung === "string" && z.loesung.length > 0; }));
        need("labels", Array.isArray(f.labels) && f.labels.length >= (f.ziele || []).length &&
          (f.ziele || []).every(function (z) { return (f.labels || []).indexOf(z.loesung) >= 0; }));
      }
      if (t === "trace") {
        need("code", Array.isArray(f.code) && f.code.length >= 1 && f.code.every(function (l) { return typeof l === "string"; }));
        need("spalten", Array.isArray(f.spalten) && f.spalten.length >= 1 && f.spalten.every(function (s) { return typeof s === "string" && s.length > 0; }));
        need("zeilen", Array.isArray(f.zeilen) && f.zeilen.length >= 1 &&
          f.zeilen.every(function (r) { return Array.isArray(r) && r.length === (f.spalten || []).length; }));
      }
      if (t === "konsole") {
        need("aufgaben", Array.isArray(f.aufgaben) && f.aufgaben.length >= 1 &&
          f.aufgaben.every(function (a) { return a && typeof a.prompt === "string" && a.prompt.length > 0 && Array.isArray(a.akzeptiert) && a.akzeptiert.length >= 1; }));
      }
      if (t === "kalkulation") {
        need("kopf", Array.isArray(f.kopf) && f.kopf.length >= 1);
        need("zeilen", Array.isArray(f.zeilen) && f.zeilen.length >= 1 &&
          f.zeilen.every(function (r) { return Array.isArray(r) && r.length === (f.kopf || []).length &&
            r.every(function (c) { return c && (typeof c.v === "string" || Array.isArray(c.loesung)); }); }));
        need("min. eine Lösungszelle", f.zeilen && f.zeilen.some(function (r) { return r.some(function (c) { return Array.isArray(c.loesung); }); }));
      }
      if (t === "baukasten") {
        need("geruest", Array.isArray(f.geruest) && f.geruest.length >= 1 && f.geruest.every(function (l) { return typeof l === "string"; }));
        need("ziele", Array.isArray(f.ziele) && f.ziele.length >= 2 && f.ziele.every(function (z) { return z && typeof z.loesung === "string" && z.loesung.length > 0; }));
        need("bausteine", Array.isArray(f.bausteine) && f.bausteine.length >= (f.ziele || []).length &&
          (f.ziele || []).every(function (z) { return (f.bausteine || []).indexOf(z.loesung) >= 0; }));
      }
      need("erklaerungKurz", typeof f.erklaerungKurz === "string" && f.erklaerungKurz.length > 0);
      if (t === "mc") {
        need("distraktorErklaerungen", Array.isArray(f.distraktorErklaerungen) && f.distraktorErklaerungen.length === 4);
      }
      if (probleme.length) fehler.push({ id: f.id || ("Eintrag " + i), index: i, meldung: probleme.join("; ") });
      else gueltig.push(f);
    });
    // Zahlenvarianz: jede Variante muss – gemergt mit der Basisfrage – ebenfalls valide sein
    var variantenExpandiert = [];
    gueltig.forEach(function (f) {
      if (!Array.isArray(f.varianten)) return;
      f.varianten.forEach(function (v, vi) {
        var merged = Object.assign({}, f, v, { id: f.id + "#v" + vi });
        delete merged.varianten;
        variantenExpandiert.push(merged);
      });
    });
    if (variantenExpandiert.length) {
      var vv = L.validateFragen(variantenExpandiert);
      vv.fehler.forEach(function (e) { fehler.push({ id: e.id, meldung: "Variante ungültig: " + e.meldung }); });
    }
    return { gueltig: gueltig, fehler: fehler };
  };

  /* ---------------- Zahlenvarianz: parametrisierte Aufgaben ----------------
     Eine Frage kann "varianten" tragen: ein Array von Objekten, die beim
     Anzeigen zufällig gewählt werden und Felder der Basisfrage überschreiben
     (z. B. frage, schritte, luecken). Lösungen sind je Variante VORBERECHNET,
     der Validator prüft jede Variante wie eine eigenständige Frage.          */
  /* ---------------- #35 Laufzeit-Randomisierung: Formelauswertung ----------------
     Mini-Ausdrucksparser (rekursiver Abstieg) für die Formeln in "schritte[].formel".
     BEWUSST KEIN eval/new Function: Inhaltsdaten dürfen keinen ausführbaren Code tragen.
     Unterstützt: Zahlen (auch dezimal), Bezeichner, + - * / ( ) und unäres Minus.
     Bezeichner sind die gezogenen Variablen sowie s1..sN = Ergebnis des jeweiligen
     vorherigen Schritts (Schritt 3 kann also mit "s1 + s2" rechnen).               */
  L.FORMEL_TOKEN = /\s*(\d+(?:\.\d+)?|[A-Za-z_][A-Za-z_0-9]*|\*\*|[-+*/()])/g;
  L.evalFormel = function (ausdruck, werte) {
    var src = String(ausdruck == null ? "" : ausdruck);
    var toks = [], m, letzte = 0;
    L.FORMEL_TOKEN.lastIndex = 0;
    while ((m = L.FORMEL_TOKEN.exec(src)) !== null) {
      if (m.index !== letzte) throw new Error("Formel: unerlaubtes Zeichen in '" + src + "'");
      toks.push(m[1]); letzte = L.FORMEL_TOKEN.lastIndex;
    }
    if (src.slice(letzte).trim() !== "") throw new Error("Formel: unerlaubtes Zeichen in '" + src + "'");
    if (!toks.length) throw new Error("Formel: leer");
    var pos = 0;
    var schau = function () { return toks[pos]; };
    var nimm = function (t) {
      if (t != null && toks[pos] !== t) throw new Error("Formel: erwartet '" + t + "' in '" + src + "'");
      return toks[pos++];
    };
    var ausdruckP, faktor;
    var primaer = function () {
      var t = schau();
      if (t === "(") { nimm("("); var v = ausdruckP(); nimm(")"); return v; }
      if (t === "-") { nimm("-"); return -faktor(); }
      if (t === "+") { nimm("+"); return faktor(); }
      if (t == null) throw new Error("Formel: unerwartetes Ende in '" + src + "'");
      if (/^\d/.test(t)) { nimm(); return parseFloat(t); }
      if (/^[A-Za-z_]/.test(t)) {
        nimm();
        if (!werte || typeof werte[t] !== "number" || !isFinite(werte[t])) {
          throw new Error("Formel: unbekannte Variable '" + t + "' in '" + src + "'");
        }
        return werte[t];
      }
      throw new Error("Formel: unerwartetes Token '" + t + "' in '" + src + "'");
    };
    faktor = function () { return primaer(); };
    var punkt = function () {
      var v = faktor(), t;
      while ((t = schau()) === "*" || t === "/") {
        nimm();
        var r = faktor();
        if (t === "/") { if (r === 0) throw new Error("Formel: Division durch 0 in '" + src + "'"); v = v / r; }
        else v = v * r;
      }
      return v;
    };
    ausdruckP = function () {
      var v = punkt(), t;
      while ((t = schau()) === "+" || t === "-") { nimm(); var r = punkt(); v = (t === "+") ? v + r : v - r; }
      return v;
    };
    var erg = ausdruckP();
    if (pos !== toks.length) throw new Error("Formel: Rest nach Ausdruck in '" + src + "'");
    if (typeof erg !== "number" || !isFinite(erg)) throw new Error("Formel: kein endliches Ergebnis in '" + src + "'");
    return erg;
  };

  /* Kaufmännisch auf 2 Dezimalen runden (Halbe aufwärts, vorzeichenrichtig).
     Der Epsilon-Zuschlag fängt Binärdarstellungsfehler ab (1.005 -> 1.01).      */
  L.rundeAuf = function (x, dezimalen) {
    var v = Number(x);
    if (!isFinite(v)) return NaN;
    var d = (typeof dezimalen === "number" && dezimalen >= 0 && dezimalen <= 6) ? Math.floor(dezimalen) : 2;
    var p = Math.pow(10, d);
    var s = v < 0 ? -1 : 1;
    /* winziges ABSOLUTES Epsilon gegen Binärdarstellungsfehler (1.005 -> 1.01).
       Bewusst nicht relativ zum Betrag: das verfälschte große Werte (2e12 -> 2e12+2). */
    return s * Math.round((Math.abs(v) + 1e-9) * p) / p;
  };
  L.runde2 = function (x) { return L.rundeAuf(x, 2); };
  /* Toleranz zur Rundungsvorgabe: Standard 1 Cent bei 2 Dezimalen (Nutzer-Entscheid G2.6);
     bei gröberer Vorgabe die halbe letzte Stelle, damit korrekt gerechnete, nur anders
     gerundete Eingaben nicht als falsch gelten. Ganzzahlige Schritte bleiben streng.   */
  L.toleranzFuer = function (dezimalen) {
    var d = (typeof dezimalen === "number" && dezimalen >= 0) ? Math.floor(dezimalen) : 2;
    if (d >= 2) return 0.01;
    if (d === 1) return 0.05;
    return 0.01;
  };
  /* Deutsche Zahleingabe -> Number: "3.000,50" / "3000,5" / "3000.5" / "1 234" */
  L.zahlAusText = function (s) {
    if (typeof s === "number") return isFinite(s) ? s : NaN;
    var t = String(s == null ? "" : s).trim().replace(/\s| /g, "");
    if (t === "") return NaN;
    t = t.replace(/[€$]|EUR|eur/g, "");
    if (t.indexOf(",") >= 0) t = t.replace(/\./g, "").replace(",", ".");   /* Komma = Dezimaltrenner */
    else if ((t.match(/\./g) || []).length > 1) t = t.replace(/\./g, "");  /* nur Tausenderpunkte */
    else if (/^-?\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, "");    /* 3.000 = dreitausend */
    var v = parseFloat(t);
    return isFinite(v) ? v : NaN;
  };
  L.RECHEN_TOLERANZ = 0.01;   /* Nutzer-Entscheid G2.6: 1 Cent Toleranf auf 2 Dezimalen */

  /* Zufallswert für eine Variablendefinition {min,max,schritt}. Ganzzahlige Schritte
     (Nutzer-Entscheid); schritt darf dezimal sein, dann wird auf 2 Stellen gerundet. */
  L.zieheWert = function (def, rng) {
    rng = rng || Math.random;
    var min = Number(def.min), max = Number(def.max), schritt = Number(def.schritt || 1);
    if (!isFinite(min) || !isFinite(max) || !isFinite(schritt) || schritt <= 0 || max < min) return NaN;
    var n = Math.floor((max - min) / schritt + 1e-9) + 1;
    return L.runde2(min + Math.floor(rng() * n) * schritt);
  };

  /* Platzhalter {name} im Text durch die gezogenen Werte ersetzen (deutsche Schreibweise). */
  /* Deutsche Schreibweise: Tausenderpunkte ab 5 Stellen vor dem Komma (1000 bleibt "1000",
     10000 wird "10.000") – so schreiben es auch die Aufgabentexte. Komma als Dezimaltrenner. */
  L.tausender = function (s) {
    var neg = s.charAt(0) === "-"; if (neg) s = s.slice(1);
    var teile = s.split(","), ganz = teile[0];
    if (ganz.length > 3) ganz = ganz.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return (neg ? "-" : "") + ganz + (teile.length > 1 ? "," + teile[1] : "");
  };
  L.formatZahl = function (v, dezimalen) {
    if (typeof dezimalen === "number") {
      return L.tausender(L.rundeAuf(v, dezimalen).toFixed(Math.floor(dezimalen)).replace(".", ","));
    }
    var r = L.runde2(v);
    var ganz = Math.abs(r % 1) < 1e-9;
    return L.tausender(ganz ? String(Math.round(r)) : String(r).replace(".", ","));
  };
  /* Platzhalter: {name}, {ausdruck} (voller Formelsyntax) und {ausdruck|2} für feste
     Nachkommastellen – z. B. "{preisCent/100|2} EUR" bei ganzzahlig gezogenen Cent-Werten.
     Unauflösbare Platzhalter bleiben unverändert stehen (der Validator schlägt dann an).  */
  L.fuelleText = function (text, werte) {
    return String(text == null ? "" : text).replace(/\{([^{}]+)\}/g, function (ganz, inhalt) {
      var teile = String(inhalt).split("|");
      var ausdruck = teile[0].trim();
      var dez = teile.length > 1 ? parseInt(teile[1], 10) : null;
      try {
        var v = L.evalFormel(ausdruck, werte || {});
        return L.formatZahl(v, (dez != null && isFinite(dez)) ? dez : undefined);
      } catch (e) { return ganz; }
    });
  };

  /* Zieht Werte und berechnet ALLE Schritt-Ergebnisse. Wirft bei fehlerhafter Formel.
     Rückgabe: {werte:{}, schritte:[{...,loesung:[...],wert:Number}]}                */
  L.rechneAufgabe = function (f, rng) {
    var werte = {}, k;
    for (k in f.variablen) { if (Object.prototype.hasOwnProperty.call(f.variablen, k)) werte[k] = L.zieheWert(f.variablen[k], rng); }
    var schritte = f.schritte.map(function (s, i) {
      var out = Object.assign({}, s);
      out.text = L.fuelleText(s.text, werte);
      if (typeof s.formel === "string" && s.formel.length) {
        var roh = L.evalFormel(s.formel, werte);
        var wert = L.rundeAuf(roh, s.dezimalen);
        werte["s" + (i + 1)] = wert;          /* Folgeschritte rechnen mit dem GERUNDETEN Zwischenwert */
        out.wert = wert;
        out.loesung = L.loesungsSchreibweisen(wert, s.dezimalen);
      }
      return out;
    });
    return { werte: werte, schritte: schritte };
  };
  /* Akzeptierte Schreibweisen zu einem Zahlwert (nur Anzeige/Abwärtskompatibilität –
     die eigentliche Prüfung läuft in gradeRechenassistent numerisch mit Toleranz).  */
  L.loesungsSchreibweisen = function (wert, dezimalen) {
    var d = (typeof dezimalen === "number" && dezimalen >= 0 && dezimalen <= 6) ? Math.floor(dezimalen) : 2;
    var r = L.rundeAuf(wert, d), out = [];
    var ganz = Math.abs(r % 1) < 1e-9;
    if (ganz) { out.push(String(Math.round(r))); if (d > 0) out.push(r.toFixed(d).replace(".", ",")); }
    else {
      out.push(r.toFixed(d).replace(".", ","));
      out.push(r.toFixed(d));
      var knapp = String(r);                       /* ohne aufgefüllte Nullen: 1401.6 statt 1401.60 */
      if (out.indexOf(knapp) < 0) { out.push(knapp); out.push(knapp.replace(".", ",")); }
    }
    return out;
  };

  L.instanziiere = function (f, rng) {
    if (!f) return f;                                     /* falsy durchreichen (loeseFrage-Guard #91) */
    /* R1: IMMER Kopie zurückgeben – Aufrufer setzen z. B. _beantwortet; das darf nie
       das POOL-Objekt mutieren (sonst zählt eine Wiederziehung in der Session nicht). */
    /* #35: echte Laufzeit-Randomisierung, wenn "variablen" vorhanden sind.
       ROBUSTHEIT: Eine Wertekombination kann rechnerisch entarten (z. B. Division durch 0,
       wenn eine Differenz zufaellig 0 wird). Das darf NIE nach aussen dringen – der Aufrufer
       (loeseFrage) wuerde sonst mit einer Ausnahme abbrechen. Daher mehrere Versuche und
       zuletzt die unveraenderte Frage als Rueckfallebene. */
    if (f.variablen && typeof f.variablen === "object" && Array.isArray(f.schritte)) {
      var r = null;
      for (var versuch = 0; versuch < 25 && !r; versuch++) {
        try { r = L.rechneAufgabe(f, rng); } catch (e) { r = null; }
      }
      if (!r) return Object.assign({}, f);
      var res = Object.assign({}, f);
      res.frage = L.fuelleText(f.frage, r.werte);
      res.schritte = r.schritte;
      if (typeof f.erklaerungLang === "string") res.erklaerungLang = L.fuelleText(f.erklaerungLang, r.werte);
      if (typeof f.erklaerungKurz === "string") res.erklaerungKurz = L.fuelleText(f.erklaerungKurz, r.werte);
      res._werte = r.werte;
      delete res.variablen;
      delete res.varianten;
      return res;
    }
    if (!Array.isArray(f.varianten) || f.varianten.length === 0) return Object.assign({}, f);
    var v = L.pick(f.varianten, rng);
    var out = Object.assign({}, f, v);
    delete out.varianten;
    return out;
  };

  /* ---------------- Duplikat-Scan (Build-Zeit) ----------------
     Normalisiert Fragetexte und meldet Paare mit hoher Ähnlichkeit.   */
  L.normText = function (s) {
    return (s || "").toLowerCase().replace(/[^a-zäöüß0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  };
  L.duplikatScan = function (fragen) {
    var out = [];
    var norm = fragen.map(function (f) {
      var inhalt = [f.frage || ""];
      if (f.optionen) inhalt = inhalt.concat(f.optionen);
      if (f.schritte) inhalt = inhalt.concat(f.schritte.map(function (s) { return typeof s === "string" ? s : (s && s.text ? s.text : ""); }));
      if (f.zeilen) inhalt = inhalt.concat(f.zeilen);
      if (f.elemente) inhalt = inhalt.concat(f.elemente.map(function (e) { return e && e.text ? e.text : ""; }));
      if (f.labels) inhalt = inhalt.concat(f.labels);
      if (f.paare) f.paare.forEach(function (p) { inhalt.push(p[0] + " " + p[1]); });
      if (f.luecken) f.luecken.forEach(function (l) { inhalt.push(Array.isArray(l) ? l.join(" ") : (l && l.optionen ? l.optionen.join(" ") : "")); });
      return { id: f.id, t: L.normText(inhalt.join(" ")), set: {} };
    });
    norm.forEach(function (n) { n.t.split(" ").forEach(function (w) { if (w.length > 3) n.set[w] = true; }); });
    for (var i = 0; i < norm.length; i++) {
      for (var j = i + 1; j < norm.length; j++) {
        var a = norm[i], b = norm[j];
        if (a.t === b.t) { out.push({ a: a.id, b: b.id, aehnlichkeit: 1 }); continue; }
        var wa = Object.keys(a.set), gemeinsam = 0;
        wa.forEach(function (w) { if (b.set[w]) gemeinsam++; });
        var union = wa.length + Object.keys(b.set).length - gemeinsam;
        var jac = union ? gemeinsam / union : 0;
        if (jac >= 0.85) out.push({ a: a.id, b: b.id, aehnlichkeit: Math.round(jac * 100) / 100 });
      }
    }
    return out;
  };

  /* ---------------- Bewertung der Antworten ---------------- */
  L.gradeMC = function (frage, antwortIndex) { return antwortIndex === frage.loesungIndex; };
  /* FB-R2.6a (2026-07-21): Normalisierung fuer getippte Antworten (Lueckentext, Dropdown im
     Freitext-Modus, Rechenassistent, Trace, Konsole).
     ZWEI LUECKEN GESCHLOSSEN, beide gemessen:
       1. UMLAUTE/ss. Bis hierher wurde „Unterstuetzungsprozesse" gegen „Unterstützungsprozesse"
          als FALSCH gewertet – am Handy tippt man Umlaute aber haeufig aus. Die Freitext-Bewertung
          (normText in app_util.js) macht das seit jeher; nur diese Stelle nicht. Betrifft Zahlen
          nicht und ist deshalb gefahrlos.
       2. SATZZEICHEN AM ENDE. „Beschaffung." galt als falsch. Nur am Wortende abgeschnitten,
          damit IP-Adressen und Dezimalzahlen im Inneren unberuehrt bleiben.
     BEWUSST NICHT GEAENDERT – TAUSENDERPUNKT: „1.500" wird weiterhin nicht als 1500 akzeptiert.
     Grund: Zeile 2 ersetzt Komma durch Punkt, damit ist „1,500" bereits „1.500". Wuerde man den
     Tausenderpunkt entfernen, waere „1.500" nicht mehr von der Dezimalzahl 1,5 unterscheidbar.
     Das ist ein echter Zielkonflikt und liegt als Entscheidung beim Nutzer, nicht beim Code. */
  L.normAntwort = function (s) {
    return String(s == null ? "" : s).trim().toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/,/g, ".").replace(/\s+/g, " ")
      .replace(/[.,;:!?]+$/, "")
      .replace(/^([0-9]+)\.0+$/, "$1");
  };
  L.gradeLuecke = function (akzeptiert, eingabe) {
    var e = L.normAntwort(eingabe);
    return akzeptiert.some(function (a) { return L.normAntwort(a) === e; });
  };
  /* TIPPFEHLER-TOLERANZ (2026-08-04, Nutzer-Entscheid). Levenshtein-Distanz GENAU 1, mit
     frühem Ausstieg – die volle Matrix wird nie gebraucht, weil alles ab Distanz 2 falsch ist.
     ⚠️ ABSICHTLICH NUR EIN ZEICHEN. Bei Distanz 2 fallen im Bestand Paare wie „7,1"/„7,5" und
     „stufe 1"/„stufe 3" zusammen; gemessen am 04.08. an allen getippten Typen. */
  L.distanzEins = function (a, b) {
    if (a === b) return false;
    if (Math.abs(a.length - b.length) > 1) return false;
    if (a.length === b.length) {
      var d = 0;
      for (var i = 0; i < a.length; i++) { if (a[i] !== b[i] && ++d > 1) return false; }
      return d === 1;
    }
    var kurz = a.length < b.length ? a : b, lang = a.length < b.length ? b : a;
    var x = 0, y = 0, f = 0;
    while (x < kurz.length && y < lang.length) {
      if (kurz[x] === lang[y]) { x++; y++; } else { if (++f > 1) return false; y++; }
    }
    return true;
  };
  /* MINDESTLÄNGE 6 – gemessen, nicht geschätzt (04.08.2026). Darunter liegen im Bestand echte
     Verwechslungspaare („SEZ"/„SAZ", „12"/„14"), darüber bei `lueckentext` KEINE: die fünf
     Treffer in Distanz 1 sind Bindestrich-Varianten DESSELBEN Begriffs, die ohnehin beide
     akzeptiert werden. **Nicht senken, ohne neu zu messen.** */
  L.TIPP_MINLAENGE = 6;
  /* Toleranter Vergleich für GETIPPTE Einzelantworten. Bewusst NICHT in gradeLuecke selbst:
     dieselbe Funktion bedient `trace` (Zellen wie „Stufe 1"/„Stufe 2"), den Freitextmodus von
     `dropdown` („ISO 9001"/„ISO 9000", „Wartung"/„Warnung") und die nicht-numerischen Schritte
     des Rechenassistenten. Dort ist die Toleranz gefährlich und bleibt aus – Nutzer-Entscheid
     04.08. nach Messung aller vier getippten Typen. NUR `lueckentext` ruft diese Fassung. */
  L.gradeLueckeTolerant = function (akzeptiert, eingabe) {
    if (L.gradeLuecke(akzeptiert, eingabe)) return true;
    var e = L.normAntwort(eingabe);
    if (e.length < L.TIPP_MINLAENGE || /[0-9]/.test(e)) return false;
    return akzeptiert.some(function (a) {
      var n = L.normAntwort(a);
      return n.length >= L.TIPP_MINLAENGE && !/[0-9]/.test(n) && L.distanzEins(n, e);
    });
  };
  L.gradeLueckentext = function (frage, eingaben) {
    if (!Array.isArray(eingaben) || eingaben.length !== frage.luecken.length) return false;
    return frage.luecken.every(function (l, i) { return L.gradeLueckeTolerant(l, eingaben[i]); });
  };
  L.gradeZuordnung = function (frage, zuordnung) { // zuordnung: {linksIndex: rechtsIndex}
    // Text-basiert: korrekt, wenn die zugeordnete rechte Kategorie inhaltlich passt.
    // Für eindeutige Kategorien identisch zum Index-Vergleich; nötig für many-to-one
    // (z. B. mehrere Aussagen → dieselbe Kategorie "Wasserfallmodell"/"SCRUM").
    if (!zuordnung || typeof zuordnung !== "object") return false; // Guard (#79): L.grade darf nie werfen
    return frage.paare.every(function (_, i) {
      var j = zuordnung[i];
      return j != null && frage.paare[j] && frage.paare[j][1] === frage.paare[i][1];
    });
  };
  L.gradeMehrfach = function (frage, indizes) { // indizes: Array gewählter Options-Indizes
    if (!Array.isArray(indizes)) return false;
    var soll = (frage.loesungIndizes || []).slice().sort(function (a, b) { return a - b; });
    var ist = indizes.slice().sort(function (a, b) { return a - b; });
    return soll.length === ist.length && soll.every(function (v, i) { return v === ist[i]; });
  };
  L.gradeReihenfolge = function (frage, reihenfolge) { // reihenfolge: Array der Original-Indizes in Nutzer-Reihenfolge
    if (!Array.isArray(reihenfolge) || reihenfolge.length !== frage.schritte.length) return false;
    return reihenfolge.every(function (v, i) { return v === i; });
  };
  L.gradeDropdown = function (frage, auswahl) { // auswahl: Array gewählter Options-Index je Lücke
    if (!Array.isArray(auswahl) || auswahl.length !== frage.luecken.length) return false;
    return frage.luecken.every(function (l, i) { return auswahl[i] === l.loesung; });
  };
  // #102 Freitext-Modus des dropdown-Typs (pro Aufgabe umschaltbar): jede Lücke als Text prüfen.
  // Akzeptiert = korrekte Option (l.optionen[l.loesung]) + optionale zusätzliche Schreibweisen (l.akzeptiert).
  // Toleranz identisch zu gradeLuecke (normAntwort: Groß/Klein, Trim, Zahlen/Umlaut) – Nutzer-Entscheid.
  L.dropdownAkzeptiert = function (l) { return [l.optionen[l.loesung]].concat(Array.isArray(l.akzeptiert) ? l.akzeptiert : []); };
  L.gradeDropdownText = function (frage, eingaben) { // eingaben: Array Freitext je Lücke
    if (!Array.isArray(eingaben) || eingaben.length !== frage.luecken.length) return false;
    return frage.luecken.every(function (l, i) { return L.gradeLuecke(L.dropdownAkzeptiert(l), eingaben[i]); });
  };
  L.gradeHotspot = function (frage, index) { // index: angeklickte Zone
    return !!(frage.zonen && frage.zonen[index] && frage.zonen[index].richtig);
  };
  L.gradeFehlersuche = function (frage, zeileIndex) { // zeileIndex: angeklickte Zeile
    return zeileIndex === frage.fehlerZeile;
  };
  L.gradeRechenassistent = function (frage, eingaben) { // eingaben: Array je Schritt
    if (!Array.isArray(eingaben) || eingaben.length !== frage.schritte.length) return false;
    return frage.schritte.every(function (s, i) {
      /* #35: berechnete Schritte werden NUMERISCH mit Toleranz geprüft (Nutzer-Entscheid:
         2 Dezimalen, 1 Cent). Das fängt abweichende Schreibweisen und Zwischenrundungen ab.
         Schritte ohne berechneten Wert bleiben beim bisherigen Schreibweisen-Vergleich.   */
      if (typeof s.wert === "number" && isFinite(s.wert)) {
        var e = L.zahlAusText(eingaben[i]);
        if (!isFinite(e)) return false;
        return Math.abs(e - s.wert) <= L.toleranzFuer(s.dezimalen) + 1e-9;
      }
      return L.gradeLuecke(s.loesung, eingaben[i]);
    });
  };
  L.gradeMatrix = function (frage, zuordnung) { // zuordnung: {elementIndex: quadrantIndex}
    if (!zuordnung) return false;
    return frage.elemente.every(function (e, i) { return zuordnung[i] === e.quadrant; });
  };
  L.gradeBeschriftung = function (frage, zuordnung) { // zuordnung: {zielIndex: labelText}
    if (!zuordnung) return false;
    return frage.ziele.every(function (z, i) { return zuordnung[i] === z.loesung; });
  };
  L.gradeTrace = function (frage, eingaben) { // eingaben: 2D-Array [zeile][spalte]
    if (!Array.isArray(eingaben) || eingaben.length !== frage.zeilen.length) return false;
    return frage.zeilen.every(function (row, r) {
      return Array.isArray(eingaben[r]) && eingaben[r].length === row.length &&
        row.every(function (cell, c) { return L.gradeLuecke([String(cell)], eingaben[r][c]); });
    });
  };
  L.normBefehl = function (s) { return String(s == null ? "" : s).trim().toLowerCase().replace(/\s+/g, " ").replace(/\s*([\/|])\s*/g, "$1"); };
  L.gradeKonsole = function (frage, eingaben) { // eingaben: Array je Aufgabe
    if (!Array.isArray(eingaben) || eingaben.length !== frage.aufgaben.length) return false;
    return frage.aufgaben.every(function (a, i) {
      var e = L.normBefehl(eingaben[i]);
      return (a.akzeptiert || []).some(function (ok) { return L.normBefehl(ok) === e; });
    });
  };
  L.gradeKalkulation = function (frage, eingaben) { // eingaben: {"r,c": wert} nur für Lösungszellen
    if (!eingaben) return false;
    return frage.zeilen.every(function (row, r) {
      return row.every(function (cell, c) {
        if (!Array.isArray(cell.loesung)) return true;             // feste Zelle
        return L.gradeLuecke(cell.loesung.map(String), eingaben[r + "," + c]);
      });
    });
  };
  L.gradeBaukasten = function (frage, zuordnung) { // zuordnung: {zielIndex: bausteinText}
    if (!zuordnung) return false;
    return frage.ziele.every(function (z, i) { return zuordnung[i] === z.loesung; });
  };
  L.gradeMtf = function (frage, antwort) { // antwort: Array Bool je Aussage (true=wahr markiert). "richtig" nur bei 100 %.
    if (!Array.isArray(antwort) || antwort.length !== frage.aussagen.length) return false;
    return frage.aussagen.every(function (a, i) { return typeof antwort[i] === "boolean" && antwort[i] === !!a.wahr; });
  };
  // Teil-Trefferzahl je Aussage (nur Anzeige/Teilpunkte; Wertung fürs Fehler-Deck bleibt gradeMtf=100 %).
  L.mtfTreffer = function (frage, antwort) {
    if (!Array.isArray(antwort)) return 0;
    return frage.aussagen.reduce(function (n, a, i) { return n + (typeof antwort[i] === "boolean" && antwort[i] === !!a.wahr ? 1 : 0); }, 0);
  };
  L.gradeSzenario2 = function (frage, antwort) { // antwort: {s1,s2} Indizes. "richtig" nur wenn BEIDE Schritte korrekt.
    if (!antwort || typeof antwort !== "object") return false;
    return antwort.s1 === frage.schritt1.loesungIndex && antwort.s2 === frage.schritt2.loesungIndex;
  };
  // Teil-Trefferzahl je Schritt (0..2; nur Anzeige/Teilpunkte; Wertung fürs Fehler-Deck bleibt gradeSzenario2=100 %).
  L.szenario2Treffer = function (frage, antwort) {
    if (!antwort || typeof antwort !== "object") return 0;
    return (antwort.s1 === frage.schritt1.loesungIndex ? 1 : 0) + (antwort.s2 === frage.schritt2.loesungIndex ? 1 : 0);
  };
  L.gradeKreuztabelle = function (frage, antwort) { // antwort: 2D-Bool-Array (zeilen×spalten). "richtig" nur bei 100 %.
    if (!Array.isArray(antwort) || antwort.length !== frage.loesung.length) return false;
    return frage.loesung.every(function (row, r) {
      return Array.isArray(antwort[r]) && antwort[r].length === row.length &&
        row.every(function (soll, c) { return (antwort[r][c] === true) === !!soll; });
    });
  };
  // Teil-Trefferzahl je Zelle (nur Anzeige/Teilpunkte; Wertung fürs Fehler-Deck bleibt gradeKreuztabelle=100 %).
  L.kreuztabelleTreffer = function (frage, antwort) {
    var n = 0;
    frage.loesung.forEach(function (row, r) {
      row.forEach(function (soll, c) {
        var v = Array.isArray(antwort) && Array.isArray(antwort[r]) ? antwort[r][c] : undefined;
        if ((v === true) === !!soll) n++;   // richtig gesetzt ODER richtig leer gelassen
      });
    });
    return n;
  };

  /* ---------------- Fragetyp-Registry (#79) ----------------
     Eine Quelle der Wahrheit je Aufgabentyp. Konsolidiert:
       - grade:   Bewertungsfunktion (frage, antwort) -> bool; null = nicht automatisch
                  bewertbar (freitext/erklaeren) bzw. Bewertung über unterTyp (bild).
       - simAuto: in der Prüfungssimulation automatisch auswertbar (-> L.SIM_TYPEN).
       - sek/punkte: Zeit-/Punkte-Richtwerte (#73, -> L.TYP_META / L.metaFuer).
     Abgeleitete Arrays (L.TYPEN/L.SIM_TYPEN/L.TYP_META) via Object.keys/filter darunter.
     Schlüssel-Reihenfolge == bisheriges L.TYPEN (deterministisch). */
  L.TYP = {
    mc:             { grade: L.gradeMC,              simAuto: true,  sek: 60,  punkte: 1 },
    freitext:       { grade: null,                   simAuto: false, sek: 120, punkte: 2 },
    lueckentext:    { grade: L.gradeLueckentext,     simAuto: true,  sek: 75,  punkte: 1 },
    zuordnung:      { grade: L.gradeZuordnung,       simAuto: true,  sek: 90,  punkte: 2 },
    bild:           { grade: null,                   simAuto: true,  sek: 60,  punkte: 1 },
    erklaeren:      { grade: null,                   simAuto: false, sek: 150, punkte: 3 },
    mehrfach:       { grade: L.gradeMehrfach,        simAuto: true,  sek: 90,  punkte: 2 },
    /* ⚠️ simAuto 2026-08-27 von false auf true. ANLASS: Die urspruengliche Begruendung lautete
       "simAuto:false (wie uebrige interaktive Typen; Sim-Renderer aus Scope - bewusst, dokumentiert)".
       Gemessen an diesem Tag: renderSimFrage() in app_sim.js ruft renderFrage() auf - DENSELBEN
       Renderer wie der Uebungsmodus. Einen eigenen Sim-Renderer gibt es nicht und gab es nie.
       ►► Die Grenze war eine Behauptung ueber das Werkzeug, und die ist abgelaufen. Folge des
       alten Zustands: 6 der 45 Fall-Teilaufgaben waren fuer keinen Lerner erreichbar, weil die
       Faelle NUR in der Simulation vorkommen und dort weggefiltert wurden. */
    mtf:            { grade: L.gradeMtf,             simAuto: true,  sek: 120, punkte: 2 },
    kreuztabelle:   { grade: L.gradeKreuztabelle,    simAuto: false, sek: 120, punkte: 2 },
    szenario2:      { grade: L.gradeSzenario2,       simAuto: false, sek: 120, punkte: 2 },
    reihenfolge:    { grade: L.gradeReihenfolge,     simAuto: true,  sek: 75,  punkte: 2 },
    dropdown:       { grade: L.gradeDropdown,        simAuto: true,  sek: 75,  punkte: 1 },
    hotspot:        { grade: L.gradeHotspot,         simAuto: false, sek: 60,  punkte: 1 },
    fehlersuche:    { grade: L.gradeFehlersuche,     simAuto: false, sek: 120, punkte: 2 },
    rechenassistent:{ grade: L.gradeRechenassistent, simAuto: false, sek: 150, punkte: 3 },
    matrix:         { grade: L.gradeMatrix,          simAuto: false, sek: 90,  punkte: 2 },
    beschriftung:   { grade: L.gradeBeschriftung,    simAuto: false, sek: 90,  punkte: 2 },
    trace:          { grade: L.gradeTrace,           simAuto: false, sek: 120, punkte: 2 },
    konsole:        { grade: L.gradeKonsole,         simAuto: false, sek: 90,  punkte: 2 },
    kalkulation:    { grade: L.gradeKalkulation,     simAuto: false, sek: 150, punkte: 3 },
    baukasten:      { grade: L.gradeBaukasten,       simAuto: false, sek: 120, punkte: 2 }
  };
  /* Abgeleitete Sichten (Abwärtskompatibilität – identische Werte wie bisher). */
  L.TYPEN = Object.keys(L.TYP);
  L.SIM_TYPEN = L.TYPEN.filter(function (t) { return L.TYP[t].simAuto; });
  L.TYP_META = {};
  L.TYPEN.forEach(function (t) { L.TYP_META[t] = { sek: L.TYP[t].sek, punkte: L.TYP[t].punkte }; });
  /* Zentrale Bewertung (Registry-Dispatch mit Fallback). Löst bild -> unterTyp auf.
     Rückgabe: bool, oder null wenn nicht automatisch bewertbar bzw. Typ unbekannt. */
  L.grade = function (frage, antwort) {
    if (!frage) return null;
    var t = frage.typ === "bild" ? (frage.unterTyp || "mc") : frage.typ;
    var reg = L.TYP[t];
    var fn = reg && reg.grade;
    return (typeof fn === "function") ? fn(frage, antwort) : null;
  };
  /* Zentrale Bewertung fuer Simulationen (AP1 + M09-Klausur, 2026-07-21). simAbgeben in app_sim.js
     hatte bisher eine EIGENE if-Kaskade fuer nur 5 Typen (mc/lueckentext/zuordnung/dropdown/
     mehrfach) - bereits die DRITTE Kopie derselben Typliste (nach der L.TYP-Registry und
     L.SIM_TYPEN). L.gradeSim buendelt das ueber L.grade/L.TYP: liefert IMMER bool (nie null),
     auch bei unbeantworteter oder nicht automatisch bewertbarer Frage (freitext/erklaeren). */
  L.gradeSim = function (frage, antwort) {
    if (antwort == null) return false;
    var iTyp = frage ? (frage.typ === "bild" ? (frage.unterTyp || "mc") : frage.typ) : null;   // nur zur Klarheit; L.grade loest bild->unterTyp intern identisch auf
    return L.grade(frage, antwort) === true;
  };

  /* ---------------- Fehler-Deck (Spaced Repetition) ----------------
     deck: {id: {streak, due}}  due = Timestamp (ms)
     Intervalle: falsch -> +1 Tag; 1. richtig -> +3 Tage; 2. richtig -> +7 Tage;
     3. richtig in Folge -> Frage verlässt das Deck. Fehler -> Rückfall.   */
  var TAG = 24 * 60 * 60 * 1000;
  L.TAG_MS = TAG;
  /* tage: optionales Erstintervall in Tagen. Ohne Angabe gilt L.CONFIG.fdTageFehler (= 1 Tag).
     ⚠️ 2026-07-30: Die Klausurvorbereitung (M09) uebergibt fdTageFehlerUnterricht = 0, damit eine
     falsch beantwortete Frage NOCH IN DERSELBEN SITZUNG zurueckkommt. Grund: Vor einer Klausur am
     naechsten Tag ist ein Erstintervall von 24 Stunden die falsche Einstellung – die Frage taucht
     dann erst am Pruefungsmorgen wieder auf. Fuer AP1 bleibt es bei 1 Tag (Spaced Repetition auf
     Monate), festgeschrieben durch tests/test_logik.js „FD: nicht sofort faellig". */
  L.fdOnWrong = function (deck, id, now, tage) {
    deck = deck || {};
    var t = (typeof tage === "number") ? tage : L.CONFIG.fdTageFehler;
    deck[id] = { streak: 0, due: now + t * TAG };
    return deck;
  };
  L.fdOnCorrect = function (deck, id, now) {
    deck = deck || {};
    var e = deck[id];
    if (!e) return deck;
    e.streak = (e.streak || 0) + 1;
    if (e.streak >= L.CONFIG.fdStreakWeg) { delete deck[id]; return deck; }
    e.due = now + (e.streak === 1 ? L.CONFIG.fdTageStreak1 : L.CONFIG.fdTageStreakRest) * TAG;
    return deck;
  };
  L.fdDue = function (deck, now) {
    deck = deck || {};
    return Object.keys(deck).filter(function (id) { return deck[id].due <= now; });
  };

  /* ---------------- Tagesziel (Datums-Schlüssel) ---------------- */
  L.dayKey = function (ts) {
    var d = new Date(ts);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  };

  /* ---------------- Prüfungssimulation ---------------- */
  /* L.SIM_TYPEN wird aus der Registry L.TYP abgeleitet (simAuto), siehe #79 oben. */
  /* ⛔ HIER STAND L.buildSimulation (entfernt 2026-08-27). Sie filterte ueber L.SIM_TYPEN und war
     damit der einzige Codepfad, der diese Registry-Sicht wirklich las - benutzt hat sie AUSSCHLIESSLICH
     tests/test_logik.js. Die App baut ihre Simulation seit jeher mit buildAP1Exam() in app_sim.js.
     ►►► Drei gruene Pruefungen bestaetigten eine Funktion, die im Produkt tot war, waehrend
     buildAP1Exam selbst KEINE einzige Suite hatte. Dieselbe Familie wie "test_axe wuerfelte":
     eine Pruefung ist gruen, weil sie etwas anderes prueft als das, was laeuft.
     Die Pruefungen stehen jetzt in tests/test_sim.js und fahren buildAP1Exam. */
  /* ══════════ DIE VIER AP1-AUFGABEN UND DER PRUEFUNGSBAU (hierher am 16.09.2026) ══════════
     ⛔⛔ SIE STANDEN IN app_seiten.js UND app_sim.js — ALSO IN DER OBERFLAECHE. Solange es nur
        eine Oberflaeche gab, fiel das nicht auf. Der Neubau braucht dieselbe Ziehung, und ein
        zweiter Bauer waere eine zweite Fassung derselben Regel: zwei Listen fuer dieselbe Sache
        driften immer (nachgelesen 27.08.2026 an genau dieser Datei: `SIM_TYPEN` gegen eine
        hartkodierte Typenliste, 23 Fragen still ausgeschlossen).
     ►► Hier ist der Ort, an dem gerechnet wird. `app_sim.js` ruft von hier, der Neubau auch.
     ⚠️ Der Bauer ist REIN: Pool, Faelle und das Wiederholungs-Gedaechtnis kommen als Parameter.
        logik.js kennt weder POOL noch S noch FAELLE — und soll sie nicht kennen. */
  L.AP1_AUFGABEN = [
    { nr: 1, titel: "Auftrag, Kundenberatung & kaufmännische Prozesse", punkte: 25, module: ["M01", "M02"] },
    { nr: 2, titel: "Softwarelösung: Lasten-/Pflichtenheft, UML, Datenmodell & Programmierung", punkte: 25, module: ["M04-sw"] },
    { nr: 3, titel: "IT-Systeme, Hardware & Netzwerk", punkte: 26, module: ["M03", "M04-netz"] },
    { nr: 4, titel: "Qualität, IT-Sicherheit, Datenschutz & Auftragsabschluss", punkte: 24, module: ["M05", "M06", "M07"] }
  ];
  /* Welche M04-Feinthemen zur NETZ-Aufgabe zaehlen; alle uebrigen M04-Themen sind Software. */
  L.M04_NETZ = ["IP-Adressierung", "Subnetting", "DHCP & Netzwerkdienste", "Konsolenbefehle & Fehlersuche", "WLAN & VPN"];

  /* In welche der vier Aufgaben eine Frage faellt. Alles, was keine Zuordnung hat, landet in 4. */
  L.aufgabeVon = function (f) {
    if (f.modul === "M01" || f.modul === "M02") return 0;
    if (f.modul === "M03") return 2;
    if (f.modul === "M05" || f.modul === "M06" || f.modul === "M07") return 3;
    if (f.modul === "M04") return L.M04_NETZ.indexOf(f.thema) >= 0 ? 2 : 1;
    return 3;
  };

  /* Ist die Frage in der AP1-Simulation automatisch bewertbar? Quelle ist die Registry
     (L.SIM_TYPEN aus L.TYP.simAuto), NICHT eine zweite Typenliste. Bei `bild` entscheidet
     der unterTyp. */
  L.simBewertbar = function (f) {
    var t = f.typ === "bild" ? (f.unterTyp || "mc") : f.typ;
    return L.SIM_TYPEN.indexOf(t) >= 0;
  };

  /* Eine Fallaufgabe fuer die Simulation aufbereiten — ihre Teilaufgaben werden zu eigenen
     Fragen mit Szenario-Anzeige. Gibt null, wenn keine taugt. */
  L.fallFuerSim = function (faelle, vermeide, rng) {
    var liste = Array.isArray(faelle) ? faelle : [];
    if (!liste.length) return null;
    var frisch = liste.filter(function (fall) { return !vermeide["FALL:" + fall.id]; });
    var fall = L.pick(frisch.length ? frisch : liste, rng);
    var teile = (fall.teilaufgaben || []).map(function (t, i) {
      var o = {};
      Object.keys(t).forEach(function (k) { o[k] = t[k]; });
      o.id = (fall.id || "FALL") + "-t" + i;
      o.modul = fall.modul; o.thema = fall.thema;
      o.pruefungsteil = fall.pruefungsteil || "AP1";
      o.schwierigkeit = t.schwierigkeit || 3;
      o.fallTitel = fall.titel; o.fallSzenario = fall.szenario;
      return o;
    }).filter(L.simBewertbar);
    return teile.length ? { id: fall.id, teile: teile } : null;
  };

  /* Ist das die Teilaufgabe einer Fallaufgabe? Sie traegt das Szenario mit sich —
     `L.fallFuerSim` haengt es an. Ihre Kennung ("<Fall>-t0") entsteht erst beim
     Bauen der Pruefung und steht in KEINEM Pool.
     ⛔⛔ ANLASS 16.09.2026, GEFUNDEN IM RAUCHTEST: nach einer Simulation lagen
        fuenf solcher Kennungen im Fehler-Deck. Sie koennen dort nie wieder
        herauskommen — die Ziehung filtert jede Kennung heraus, zu der es keine
        Frage gibt. **Ein Eintrag, der nie faellig werden kann, ist kein
        Wiedersehen, sondern totes Gewicht.** Der Neubau macht es sichtbar, weil
        er unaufloesbare Kennungen ausweist; die alte App uebergeht sie still. */
  L.istFallTeil = function (f) {
    return !!f && (typeof f.fallSzenario === "string" || typeof f.fallTitel === "string");
  };

  /* Baut eine AP1-Pruefung. REIN: alles Aeussere kommt als Parameter.
       pool     — alle Fragen (M08 und der Unterrichts-Pool M09 werden hier ausgeschlossen)
       faelle   — FAELLE oder []
       benutzt  — Kennungen frueherer Laeufe (Wiederholungs-Gedaechtnis)
       anzahl   — gewuenschte Fragenzahl
       punkte   — Punkte je Aufgabe (Laenge 4); fehlt sie, gelten die Vorgabewerte
     Zurueck kommt { fragen, benutzt } — der Aufrufer speichert `benutzt`. */
  L.baueAP1Pruefung = function (opt) {
    var pool = opt.pool || [], anzahl = opt.anzahl || 40, rng = opt.rng;
    var punkte = opt.punkte && opt.punkte.length === L.AP1_AUFGABEN.length
      ? opt.punkte : L.AP1_AUFGABEN.map(function (a) { return a.punkte; });
    var basis = pool.filter(function (f) {
      return f.modul !== "M08" && f.modul !== "M09" && L.simBewertbar(f);
    });
    var proBlock = [[], [], [], []];
    basis.forEach(function (f) { proBlock[L.aufgabeVon(f)].push(f); });
    var soll = L.AP1_AUFGABEN.map(function (a, bi) {
      return Math.max(3, Math.round(anzahl * punkte[bi] / 100));
    });
    var vermeide = {};
    (opt.benutzt || []).forEach(function (id) { vermeide[id] = 1; });
    var fall = L.fallFuerSim(opt.faelle, vermeide, rng);
    var fallBlock = fall ? L.aufgabeVon(fall.teile[0]) : -1;
    var blockFragen = [[], [], [], []];
    proBlock.forEach(function (topf, bi) {
      var zielN = soll[bi] - (bi === fallBlock ? fall.teile.length : 0);
      zielN = Math.max(bi === fallBlock ? 0 : 3, zielN);
      var frisch = L.shuffle(topf.filter(function (f) { return !vermeide[f.id]; }), rng);
      var alt = L.shuffle(topf.filter(function (f) { return vermeide[f.id]; }), rng);
      blockFragen[bi] = frisch.concat(alt).slice(0, Math.min(zielN, topf.length));
    });
    if (fall) blockFragen[fallBlock] = blockFragen[fallBlock].concat(fall.teile);
    var fragen = blockFragen[0].concat(blockFragen[1], blockFragen[2], blockFragen[3]);
    /* Gedaechtnis ueber MEHRERE Laeufe. Erst wenn rund 70 % des geeigneten Bestands
       verbraucht sind, faengt es von vorn an. */
    var neu = fragen.map(function (f) { return f.id; });
    if (fall) neu.push("FALL:" + fall.id);
    var benutzt = (opt.benutzt || []).concat(neu);
    if (benutzt.length > basis.length * 0.7) benutzt = neu;
    return {
      fragen: fragen.map(function (f) { return L.instanziiere(f); }),   // Zahlenvarianz auch hier
      benutzt: benutzt
    };
  };

  L.simErgebnis = function (fragen, korrekt) { // korrekt: Array bool
    var punkte = korrekt.filter(Boolean).length;
    var prozent = fragen.length ? Math.round(punkte / fragen.length * 1000) / 10 : 0;
    var proModul = {};
    fragen.forEach(function (f, i) {
      var e = proModul[f.modul] = proModul[f.modul] || { richtig: 0, gesamt: 0 };
      e.gesamt++; if (korrekt[i]) e.richtig++;
    });
    return { punkte: punkte, gesamt: fragen.length, prozent: prozent, note: L.note(prozent), proModul: proModul };
  };

  /* =====================================================================
     RECHENAUFGABEN-GENERATOREN (immer mit Schritt-für-Schritt-Lösungsweg)
     ===================================================================== */

  /* ---- Übertragungszeit ---- */
  L.genUebertragung = function (rng) {
    rng = rng || Math.random;
    var kombis = [];
    var groessenGB = [0.5, 1, 2, 2.5, 4, 5, 8, 10, 20, 25];
    var raten = [8, 10, 16, 20, 25, 40, 50, 80, 100, 200, 250, 400, 500, 1000];
    groessenGB.forEach(function (g) {
      raten.forEach(function (r) {
        var sek = g * 8000 / r;
        if (sek === Math.floor(sek) && sek >= 20 && sek <= 4000) kombis.push({ g: g, r: r, sek: sek });
      });
    });
    var k = L.pick(kombis, rng);
    var mbit = k.g * 8000;
    var min = Math.floor(k.sek / 60), rest = k.sek % 60;
    var zeitText = k.sek + " s" + (k.sek >= 60 ? " (= " + min + " min" + (rest ? " " + rest + " s" : "") + ")" : "");
    return {
      typ: "generator", generator: "uebertragung",
      frage: "Eine Datei von " + String(k.g).replace(".", ",") + " GB soll über eine Leitung mit " + k.r +
        " Mbit/s übertragen werden (dezimale Einheiten: 1 GB = 1000 MB). Wie lange dauert die Übertragung in Sekunden?",
      antwort: [String(k.sek)],
      einheit: "Sekunden",
      weg: [
        "Datenmenge in Megabit umrechnen: " + String(k.g).replace(".", ",") + " GB × 1000 = " + (k.g * 1000) + " MB; × 8 = " + mbit + " Mbit",
        "Zeit = Datenmenge ÷ Übertragungsrate = " + mbit + " Mbit ÷ " + k.r + " Mbit/s = " + k.sek + " s",
        "Ergebnis: " + zeitText
      ]
    };
  };

  /* ---- RAID-Nettokapazität ---- */
  L.genRaid = function (rng) {
    rng = rng || Math.random;
    var s = L.pick([500, 1000, 2000, 4000], rng); // GB je Platte
    var typ = L.pick(["RAID 0", "RAID 1", "RAID 5", "RAID 10"], rng);
    var n, netto, formel;
    if (typ === "RAID 0") { n = L.pick([2, 3, 4], rng); netto = n * s; formel = "n × Kapazität = " + n + " × " + s + " GB"; }
    else if (typ === "RAID 1") { n = 2; netto = s; formel = "Kapazität einer Platte (Spiegelung) = " + s + " GB"; }
    else if (typ === "RAID 5") { n = L.pick([3, 4, 5, 6], rng); netto = (n - 1) * s; formel = "(n − 1) × Kapazität = (" + n + " − 1) × " + s + " GB"; }
    else { n = L.pick([4, 6, 8], rng); netto = n / 2 * s; formel = "(n ÷ 2) × Kapazität = (" + n + " ÷ 2) × " + s + " GB"; }
    var nettoTB = netto / 1000;
    var akz = [String(netto)];
    if (nettoTB === Math.floor(nettoTB)) akz.push(String(nettoTB) + "tb");
    return {
      typ: "generator", generator: "raid",
      hinweis: "RAID-Details sind laut Katalog 2. Auflage AP2-Stoff – hier als Zusatzübung.",
      frage: "Ein " + typ + "-Verbund besteht aus " + n + " Festplatten mit je " + s +
        " GB. Wie groß ist die nutzbare Nettokapazität in GB?",
      antwort: akz,
      einheit: "GB",
      weg: [
        typ + ": " + formel,
        "Nettokapazität = " + netto + " GB" + (nettoTB === Math.floor(nettoTB) ? " (= " + nettoTB + " TB)" : "")
      ]
    };
  };

  /* ---- Subnetting (bleibt innerhalb eines /24 – IHK-typisch) ---- */
  L.genSubnetting = function (rng) {
    rng = rng || Math.random;
    var basis = L.pick(["192.168.10.0", "192.168.50.0", "172.16.5.0", "10.0.3.0"], rng);
    var variante = L.pick(["teilen", "kteSubnetz", "maskeFuerHosts"], rng);
    var o = basis.split(".").map(Number);
    if (variante === "maskeFuerHosts") {
      var hosts = L.pick([10, 14, 20, 25, 30, 50, 60, 100, 120], rng);
      var bits = 1; while (Math.pow(2, bits) - 2 < hosts) bits++;
      var prefix = 32 - bits;
      var maskeOktett = 256 - Math.pow(2, bits);
      var maske = "255.255.255." + maskeOktett;
      var nutzbar = Math.pow(2, bits) - 2;
      return {
        typ: "generator", generator: "subnetting",
        frage: "Ein Subnetz soll mindestens " + hosts + " Hosts aufnehmen. Welche Subnetzmaske (dezimal) ist die KLEINSTE passende? Und wie viele Hostadressen sind damit nutzbar? (Antwort 1: Maske, Antwort 2: Anzahl)",
        antwort2: [[maske, "/" + prefix], [String(nutzbar)]],
        weg: [
          "Benötigte Hostbits: 2^h − 2 ≥ " + hosts + " → h = " + bits + " (2^" + bits + " − 2 = " + nutzbar + ")",
          "Präfix = 32 − " + bits + " = /" + prefix,
          "Maske: letztes Oktett = 256 − 2^" + bits + " = " + maskeOktett + " → " + maske,
          "Nutzbare Hosts: 2^" + bits + " − 2 = " + nutzbar
        ]
      };
    }
    if (variante === "teilen") {
      var x = L.pick([2, 4, 8, 16], rng);
      var addBits = Math.log2(x);
      var prefix2 = 24 + addBits;
      var size = 256 / x;
      var maskeOkt = 256 - size;
      var nutzbar2 = size - 2;
      return {
        typ: "generator", generator: "subnetting",
        frage: "Das Netz " + basis + "/24 soll in " + x + " gleich große Subnetze geteilt werden. Wie lautet das neue Präfix (z. B. /26) und wie viele nutzbare Hostadressen hat jedes Subnetz? (Antwort 1: Präfix, Antwort 2: Anzahl)",
        antwort2: [["/" + prefix2, String(prefix2)], [String(nutzbar2)]],
        weg: [
          x + " Subnetze → " + addBits + " zusätzliche Netzbits (2^" + addBits + " = " + x + ")",
          "Neues Präfix: /24 + " + addBits + " = /" + prefix2 + " (Maske 255.255.255." + maskeOkt + ")",
          "Blockgröße: 256 ÷ " + x + " = " + size + " Adressen je Subnetz",
          "Nutzbar: " + size + " − 2 (Netz- und Broadcastadresse) = " + nutzbar2
        ]
      };
    }
    // k-tes Subnetz: Netz- und Broadcastadresse
    var x2 = L.pick([4, 8], rng);
    var addB = Math.log2(x2);
    var size2 = 256 / x2;
    var k = 1 + Math.floor(rng() * x2); // 1-basiert
    var netzOkt = (k - 1) * size2;
    var bcOkt = netzOkt + size2 - 1;
    var netz = o[0] + "." + o[1] + "." + o[2] + "." + netzOkt;
    var bc = o[0] + "." + o[1] + "." + o[2] + "." + bcOkt;
    return {
      typ: "generator", generator: "subnetting",
      frage: "Das Netz " + basis + "/24 wird in " + x2 + " gleich große Subnetze geteilt. Bestimmen Sie für das " + k +
        ". Subnetz die Netzadresse und die Broadcastadresse. (Antwort 1: Netzadresse, Antwort 2: Broadcastadresse)",
      antwort2: [[netz], [bc]],
      weg: [
        x2 + " Subnetze → Präfix /" + (24 + addB) + ", Blockgröße 256 ÷ " + x2 + " = " + size2,
        "Subnetz Nr. " + k + " beginnt bei Oktett (" + k + " − 1) × " + size2 + " = " + netzOkt + " → Netzadresse " + netz,
        "Broadcast = Netzadresse + Blockgröße − 1 = ." + bcOkt + " → " + bc,
        "Nutzbare Hosts dazwischen: ." + (netzOkt + 1) + " bis ." + (bcOkt - 1)
      ]
    };
  };

  /* ---- Netzplan (Vorwärts-/Rückwärtsrechnung) ---- */
  L.netzplanBerechne = function (vorgaenge) {
    // vorgaenge: [{id, dauer, vorgaenger:[ids]}] – topologisch sortierbar
    var map = {}; vorgaenge.forEach(function (v) { map[v.id] = v; });
    var offen = vorgaenge.slice(), guard = 0;
    while (offen.length && guard++ < 1000) {          // Vorwärtsrechnung
      for (var i = 0; i < offen.length; i++) {
        var v = offen[i];
        if (v.vorgaenger.every(function (p) { return map[p].fez != null; })) {
          v.faz = v.vorgaenger.length ? Math.max.apply(null, v.vorgaenger.map(function (p) { return map[p].fez; })) : 0;
          v.fez = v.faz + v.dauer;
          offen.splice(i, 1); break;
        }
      }
    }
    var dauer = Math.max.apply(null, vorgaenge.map(function (v) { return v.fez; }));
    vorgaenge.forEach(function (v) {                  // Nachfolger ermitteln
      v.nachfolger = vorgaenge.filter(function (n) { return n.vorgaenger.indexOf(v.id) >= 0; }).map(function (n) { return n.id; });
    });
    var offen2 = vorgaenge.slice(); guard = 0;
    while (offen2.length && guard++ < 1000) {         // Rückwärtsrechnung
      for (var j = 0; j < offen2.length; j++) {
        var w = offen2[j];
        if (w.nachfolger.every(function (n) { return map[n].saz != null; })) {
          w.sez = w.nachfolger.length ? Math.min.apply(null, w.nachfolger.map(function (n) { return map[n].saz; })) : dauer;
          w.saz = w.sez - w.dauer;
          offen2.splice(j, 1); break;
        }
      }
    }
    vorgaenge.forEach(function (v) {
      v.gp = v.saz - v.faz;
      v.fp = v.nachfolger.length ? Math.min.apply(null, v.nachfolger.map(function (n) { return map[n].faz; })) - v.fez : dauer - v.fez;
    });
    var kritisch = vorgaenge.filter(function (v) { return v.gp === 0; }).map(function (v) { return v.id; });
    return { vorgaenge: vorgaenge, projektdauer: dauer, kritisch: kritisch };
  };

  /* Projekt-Szenarien für Netzplan-Aufgaben (Rhaus-Metall-GmbH-Kontext).
     Jedes Szenario benennt die Vorgänge A..F fachlich sinnvoll.            */
  L.NETZPLAN_SZENARIEN = [
    { titel: "Serverraum-Umbau", text: "Die Rhaus-Metall-GmbH baut ihren Serverraum am Standort Wuppertal um. Die Projektleitung hat folgende Vorgänge mit Dauer (in Arbeitstagen) und Abhängigkeiten geplant.",
      namen: { A: "Ist-Analyse & Messung", B: "Angebotseinholung Klimatechnik", C: "Demontage Alt-Racks", D: "Bestellung & Lieferung", E: "Montage & Verkabelung", F: "Abnahme & Dokumentation" } },
    { titel: "Rollout Client-Arbeitsplätze", text: "In der Fertigungshalle der Rhaus-Metall-GmbH werden 40 neue IT-Arbeitsplätze eingerichtet. Der Projektplan enthält folgende Vorgänge (Dauer in Arbeitstagen).",
      namen: { A: "Anforderungsaufnahme", B: "Netzwerkdosen prüfen", C: "Master-Image erstellen", D: "Patchfeld erweitern", E: "Geräte installieren & anschließen", F: "Einweisung & Übergabe" } },
    { titel: "Einführung Ticketsystem", text: "Die IT-Abteilung der Rhaus-Metall-GmbH führt ein neues Ticketsystem ein. Folgende Vorgänge sind geplant (Dauer in Arbeitstagen).",
      namen: { A: "Auswahl & Beschaffung", B: "Prozesse dokumentieren", C: "Server aufsetzen", D: "Kategorien & Workflows definieren", E: "Testbetrieb mit Pilotgruppe", F: "Go-Live & Schulung" } },
    { titel: "Standortvernetzung", text: "Die Rhaus-Metall-GmbH bindet einen neuen Vertriebsstandort per VPN an die Zentrale an. Der Projektplan umfasst folgende Vorgänge (Dauer in Arbeitstagen).",
      namen: { A: "Bandbreitenbedarf ermitteln", B: "Provider-Angebote vergleichen", C: "Router konfigurieren", D: "Leitung beauftragen", E: "VPN einrichten & testen", F: "Monitoring aufschalten" } }
  ];
  L.genNetzplan = function (rng) {
    rng = rng || Math.random;
    function d() { return 1 + Math.floor(rng() * 8); } // 1..8 Tage
    var vg, res, puffer, versuche = 0;
    do {                                             // Struktur: A,B parallel -> C(A), D(B) -> E(C,D) -> F(E)
      vg = [
        { id: "A", dauer: d(), vorgaenger: [] },
        { id: "B", dauer: d(), vorgaenger: [] },
        { id: "C", dauer: d(), vorgaenger: ["A"] },
        { id: "D", dauer: d(), vorgaenger: ["B"] },
        { id: "E", dauer: d(), vorgaenger: ["C", "D"] },
        { id: "F", dauer: d(), vorgaenger: ["E"] }
      ];
      res = L.netzplanBerechne(vg);
      puffer = res.vorgaenge.filter(function (v) { return v.gp > 0; });
    } while ((puffer.length === 0 || res.kritisch.length >= 6) && versuche++ < 50);
    var szenario = L.pick(L.NETZPLAN_SZENARIEN, rng);
    res.vorgaenge.forEach(function (v) { v.name = szenario.namen[v.id] || v.id; });
    var pv = puffer.length ? puffer[Math.floor(rng() * puffer.length)] : res.vorgaenge[0];
    var tabelle = vg.map(function (v) {
      return v.id + " – " + (v.name || v.id) + " (Dauer " + v.dauer + ", Vorgänger: " + (v.vorgaenger.join(", ") || "–") + ")";
    });
    var weg = ["Vorwärtsrechnung (FAZ = max. FEZ der Vorgänger, FEZ = FAZ + Dauer):"];
    res.vorgaenge.forEach(function (v) { weg.push("  " + v.id + ": FAZ " + v.faz + ", FEZ " + v.fez); });
    weg.push("Projektdauer = größter FEZ = " + res.projektdauer + " Tage");
    weg.push("Rückwärtsrechnung (SEZ = min. SAZ der Nachfolger, SAZ = SEZ − Dauer):");
    res.vorgaenge.forEach(function (v) { weg.push("  " + v.id + ": SAZ " + v.saz + ", SEZ " + v.sez + ", GP " + v.gp); });
    weg.push("Kritischer Weg (GP = 0): " + res.kritisch.join(" → "));
    weg.push("Gesamtpuffer von " + pv.id + ": GP = SAZ − FAZ = " + pv.saz + " − " + pv.faz + " = " + pv.gp);
    return {
      typ: "generator", generator: "netzplan",
      szenario: szenario,
      frage: szenario.text + "\n\n" + tabelle.join("\n") +
        "\n\nBerechnen Sie: (1) die Projektdauer in Tagen, (2) den Gesamtpuffer von Vorgang " + pv.id + ".",
      antwort2: [[String(res.projektdauer)], [String(pv.gp)]],
      daten: res,
      weg: weg
    };
  };

  /* ---- Gantt / Balkenplan: früheste Terminplanung (Ende-Start-Beziehung, Tag 1 = Projektstart) ---- */
  L.ganttBerechne = function (vg) {
    var map = {};
    vg.forEach(function (v) { map[v.id] = { id: v.id, name: v.name, dauer: v.dauer, vorgaenger: v.vorgaenger.slice() }; });
    // Vorwärts: frühester Start-/End-Tag (Start = 1 wenn kein Vorgänger, sonst max. End-Tag der Vorgänger + 1)
    var offen = vg.map(function (v) { return v.id; }), guard = 0;
    while (offen.length && guard++ < 300) {
      offen = offen.filter(function (id) {
        var v = map[id];
        if (!v.vorgaenger.every(function (p) { return map[p].ende != null; })) return true;
        var s = 1;
        v.vorgaenger.forEach(function (p) { s = Math.max(s, map[p].ende + 1); });
        v.start = s; v.ende = s + v.dauer - 1;
        return false;
      });
    }
    var projektdauer = 0;
    vg.forEach(function (v) { projektdauer = Math.max(projektdauer, map[v.id].ende); });
    // Nachfolger bestimmen
    var nachf = {}; vg.forEach(function (v) { nachf[v.id] = []; });
    vg.forEach(function (v) { v.vorgaenger.forEach(function (p) { nachf[p].push(v.id); }); });
    // Rückwärts: spätester Start-/End-Tag und Puffer
    var offen2 = vg.map(function (v) { return v.id; }); guard = 0;
    while (offen2.length && guard++ < 300) {
      offen2 = offen2.filter(function (id) {
        var v = map[id], succ = nachf[id];
        if (!succ.every(function (s) { return map[s].spStart != null; })) return true;
        var e = projektdauer;
        succ.forEach(function (s) { e = Math.min(e, map[s].spStart - 1); });
        v.spEnde = e; v.spStart = e - v.dauer + 1; v.puffer = v.spStart - v.start;
        return false;
      });
    }
    var vorgaenge = vg.map(function (v) {
      var mm = map[v.id];
      return { id: mm.id, name: mm.name, dauer: mm.dauer, vorgaenger: mm.vorgaenger, start: mm.start, ende: mm.ende, spStart: mm.spStart, spEnde: mm.spEnde, puffer: mm.puffer };
    });
    var kritisch = vorgaenge.filter(function (v) { return v.puffer === 0; }).map(function (v) { return v.id; });
    return { vorgaenge: vorgaenge, projektdauer: projektdauer, kritisch: kritisch };
  };
  L.GANTT_SZENARIEN = [
    { titel: "Website-Relaunch", text: "Die Rhaus-Metall-GmbH überarbeitet ihre Firmen-Website. Plane die Vorgänge so früh wie möglich (Ende-Start-Beziehung).",
      vorgaenge: [
        { id: "A", name: "Konzept & Struktur", dauer: 2, vorgaenger: [] },
        { id: "B", name: "Design erstellen", dauer: 3, vorgaenger: ["A"] },
        { id: "C", name: "Texte schreiben", dauer: 2, vorgaenger: ["A"] },
        { id: "D", name: "Umsetzung/Programmierung", dauer: 4, vorgaenger: ["B", "C"] },
        { id: "E", name: "Test & Livegang", dauer: 2, vorgaenger: ["D"] }
      ] },
    { titel: "Serverraum-Umbau", text: "Der Serverraum am Standort Wuppertal wird umgebaut. Trage für jeden Vorgang den frühesten Start- und End-Tag ein.",
      vorgaenge: [
        { id: "A", name: "Ist-Analyse", dauer: 2, vorgaenger: [] },
        { id: "B", name: "Klimatechnik bestellen & liefern", dauer: 4, vorgaenger: ["A"] },
        { id: "C", name: "Alt-Racks demontieren", dauer: 2, vorgaenger: ["A"] },
        { id: "D", name: "Montage & Verkabelung", dauer: 3, vorgaenger: ["B", "C"] },
        { id: "E", name: "Abnahme & Doku", dauer: 1, vorgaenger: ["D"] }
      ] },
    { titel: "Ticketsystem einführen", text: "Die IT-Abteilung führt ein neues Ticketsystem ein. Ermittle die früheste Terminlage aller Vorgänge.",
      vorgaenge: [
        { id: "A", name: "Auswahl & Beschaffung", dauer: 3, vorgaenger: [] },
        { id: "B", name: "Server aufsetzen", dauer: 2, vorgaenger: ["A"] },
        { id: "C", name: "Workflows definieren", dauer: 4, vorgaenger: ["A"] },
        { id: "D", name: "Testbetrieb", dauer: 2, vorgaenger: ["B", "C"] },
        { id: "E", name: "Go-Live & Schulung", dauer: 1, vorgaenger: ["D"] }
      ] },
    { titel: "Standort per VPN anbinden", text: "Ein neuer Vertriebsstandort wird per VPN angebunden. Plane die Vorgänge frühestmöglich.",
      vorgaenge: [
        { id: "A", name: "Bedarf ermitteln", dauer: 2, vorgaenger: [] },
        { id: "B", name: "Leitung beauftragen", dauer: 5, vorgaenger: ["A"] },
        { id: "C", name: "Router konfigurieren", dauer: 3, vorgaenger: ["A"] },
        { id: "D", name: "VPN einrichten & testen", dauer: 2, vorgaenger: ["B", "C"] },
        { id: "E", name: "Monitoring aufschalten", dauer: 1, vorgaenger: ["D"] }
      ] }
  ];
  L.genGantt = function (rng) {
    rng = rng || Math.random;
    var sz = L.pick(L.GANTT_SZENARIEN, rng);
    var res = L.ganttBerechne(sz.vorgaenge.map(function (v) { return { id: v.id, name: v.name, dauer: v.dauer, vorgaenger: v.vorgaenger.slice() }; }));
    return { typ: "gantt", generator: "gantt", szenario: { titel: sz.titel, text: sz.text }, daten: res };
  };

  /* ---- Zahlensystem-Umrechnungen (Dez/Bin/Okt/Hex, beide Richtungen) ---- */
  L.ZAHLENSYSTEME = [
    { name: "Dezimal", basis: 10 }, { name: "Binär", basis: 2 },
    { name: "Oktal", basis: 8 }, { name: "Hexadezimal", basis: 16 }
  ];
  L.zahlNach = function (wert, basis) { return wert.toString(basis).toUpperCase(); };
  L.genZahlensysteme = function (rng) {
    rng = rng || Math.random;
    var von = L.pick(L.ZAHLENSYSTEME, rng), nach = L.pick(L.ZAHLENSYSTEME, rng);
    while (nach.basis === von.basis) nach = L.pick(L.ZAHLENSYSTEME, rng);
    var wert = 16 + Math.floor(rng() * 240);          // 16..255 – prüfungstypischer Bereich
    var quelle = L.zahlNach(wert, von.basis);
    var ziel = L.zahlNach(wert, nach.basis);
    var akzeptiert = [ziel, ziel.toLowerCase()];
    if (nach.basis === 2) akzeptiert.push(ziel.replace(/^(.{4})(.{1,4})$/, "$1 $2")); // mit Nibble-Leerzeichen
    if (nach.basis === 16) { akzeptiert.push("0x" + ziel); akzeptiert.push("0x" + ziel.toLowerCase()); }
    var weg = [];
    if (von.basis !== 10) weg.push(quelle + " (" + von.name + ") → Dezimal: Stellenwerte aufsummieren = " + wert);
    if (nach.basis !== 10) {
      var schritte = [], w = wert;
      while (w > 0) { schritte.push(w + " ÷ " + nach.basis + " = " + Math.floor(w / nach.basis) + " Rest " + L.zahlNach(w % nach.basis, 16)); w = Math.floor(w / nach.basis); }
      weg.push("Dezimal " + wert + " → " + nach.name + " (fortgesetzte Division, Reste rückwärts lesen):");
      weg = weg.concat(schritte.map(function (s) { return "  " + s; }));
    }
    weg.push("Ergebnis: " + quelle + " (" + von.name + ") = " + ziel + " (" + nach.name + ")");
    return {
      typ: "generator", generator: "zahlensysteme",
      frage: "Rechnen Sie um: " + quelle + " (" + von.name + ") = ? (" + nach.name + ")",
      antwort: akzeptiert,
      einheit: nach.name,
      weg: weg
    };
  };

  /* ---- Datenmengen: binäre vs. dezimale Präfixe (GiB/GB, Bit/Byte) ---- */
  L.genDatenmengen = function (rng) {
    rng = rng || Math.random;
    var variante = L.pick(["gib2gb", "gb2gib", "mib2kib", "byte2bit", "gbit2gibit"], rng);
    if (variante === "gib2gb") {
      var gib = L.pick([2, 4, 8, 16, 32], rng);
      var mb = gib * 1024 * 1024 * 1024 / 1000000;   // in MB
      var gb = Math.round(mb / 10) / 100;             // GB mit 2 Nachkommastellen
      return {
        typ: "generator", generator: "datenmengen",
        frage: "Ein Speichermodul hat " + gib + " GiB (Gibibyte). Wie viel ist das in GB (Gigabyte, dezimal)? Runden Sie auf 2 Nachkommastellen.",
        antwort: [String(gb).replace(".", ","), String(gb)],
        einheit: "GB",
        weg: [
          "1 GiB = 1024³ Byte = 1.073.741.824 Byte; 1 GB = 1000³ Byte = 1.000.000.000 Byte",
          gib + " GiB = " + gib + " × 1.073.741.824 Byte = " + (gib * 1073741824).toLocaleString("de-DE") + " Byte",
          "÷ 1.000.000.000 = " + String(gb).replace(".", ",") + " GB"
        ]
      };
    }
    if (variante === "gb2gib") {
      var gb2 = L.pick([1, 2, 4, 8], rng);
      var gib2 = Math.round(gb2 * 1000000000 / 1073741824 * 100) / 100;
      return {
        typ: "generator", generator: "datenmengen",
        frage: "Eine Festplatte ist mit " + gb2 + " GB (dezimal) beschriftet. Wie viel GiB (binär) zeigt das Betriebssystem ungefähr an? Runden Sie auf 2 Nachkommastellen.",
        antwort: [String(gib2).replace(".", ","), String(gib2)],
        einheit: "GiB",
        weg: [
          gb2 + " GB = " + gb2 + " × 1.000.000.000 Byte",
          "÷ 1024³ (= 1.073.741.824) = " + String(gib2).replace(".", ",") + " GiB",
          "Deshalb zeigt das Betriebssystem weniger an, als auf der Packung steht."
        ]
      };
    }
    if (variante === "mib2kib") {
      var mib = L.pick([2, 4, 8, 16, 64], rng);
      var kib = mib * 1024;
      return {
        typ: "generator", generator: "datenmengen",
        frage: "Rechnen Sie um: " + mib + " MiB = ? KiB (binäre Präfixe).",
        antwort: [String(kib)],
        einheit: "KiB",
        weg: ["Binäre Präfixe: 1 MiB = 1024 KiB", mib + " × 1024 = " + kib + " KiB"]
      };
    }
    if (variante === "byte2bit") {
      var mb2 = L.pick([5, 10, 25, 50, 125], rng);
      var mbit = mb2 * 8;
      return {
        typ: "generator", generator: "datenmengen",
        frage: "Eine Datei ist " + mb2 + " MB groß. Wie viele Mbit sind das? (1 Byte = 8 Bit)",
        antwort: [String(mbit)],
        einheit: "Mbit",
        weg: ["1 Byte = 8 Bit → MB × 8 = Mbit", mb2 + " × 8 = " + mbit + " Mbit"]
      };
    }
    var gbit = L.pick([1, 2, 4, 8], rng);            // gbit2gibit
    var gibit = Math.round(gbit * 1000000000 / 1073741824 * 1000) / 1000;
    return {
      typ: "generator", generator: "datenmengen",
      frage: "Ein Netzwerk-Link überträgt " + gbit + " Gbit/s (dezimal). Wie viel Gibit/s (binär) sind das? Runden Sie auf 3 Nachkommastellen.",
      antwort: [String(gibit).replace(".", ","), String(gibit)],
      einheit: "Gibit/s",
      weg: [
        gbit + " Gbit = " + gbit + " × 10⁹ Bit",
        "÷ 2³⁰ (= 1.073.741.824) = " + String(gibit).replace(".", ",") + " Gibit",
        "Merke: Gbit (dezimal, 10⁹) ≠ Gibit (binär, 2³⁰)."
      ]
    };
  };

  /* ⚠️⚠️ `stufe` JE GENERATOR-ART – NUTZER-ENTSCHEID 09.09.2026.
     BIS DAHIN setzte `genAlsFrage()` `schwierigkeit: S.level`, und S.level bleibt im
     Automatik-Modus DAUERHAFT 1 (geschrieben wird es nur ueber den Regler im manuellen Modus).
     Folge: **jede vierte Aufgabe trug beim Lerner das Tag „Anfaenger"** – auch fuer jemanden,
     der in allen Themen auf Stufe 4 steht. Und die Lernfluss-Probe zaehlte 26 % der Ziehungen
     als Stufe 1, was jeden Stufenanteil am falschen Nenner rechnete (BEFUNDE_LERNFLUSS.md).
     ⛔ Eine Themenstufe koennen die Generatoren NICHT erben: ihre Themen („Zahlensysteme",
     „RAID", „Netzplantechnik", „Datenuebertragung & Uebertragungszeit") stehen gar nicht im
     Pool – `stufeFuer` faellt dort auf S.level zurueck. Deshalb eine feste Stufe je Art.
     ►► DIE WERTE SIND AM POOL ABGELESEN, NICHT GESCHAETZT (09.09., `pool_query.js`):
        „Berechnungen: Daten & Uebertragung"  13 Fragen, Schwerpunkt Stufe 3 (8)  -> uebertragung 3
        „Subnetting"                           8 Fragen, Schwerpunkt Stufe 3 (6)  -> subnetting 3
        „Netzplan & Puffer"                   29 Fragen, Schwerpunkt Stufe 3 (20) -> netzplan 3
        „Datenmengen & Praefixe"              12 Fragen, 6x Stufe 3 / 4x Stufe 2  -> datenmengen 2,
          weil die GENERIERTE Aufgabe eine Einzelumrechnung ohne Szenario ist – die Stufe-3-Fragen
          des Themas tragen einen Anwendungskontext, den der Generator nicht hat.
        zahlensysteme und raid haben kein Pool-Thema: Zahlensysteme ist eine reine Umrechnung (2),
          die RAID-Kapazitaet verlangt die Wahl der richtigen Formel (3).
     ⚠️ Wer eine Generator-Art ergaenzt, setzt `stufe` mit – `test_rechnen` haelt das fest. */
  L.GENERATOREN = {
    uebertragung: { name: "Übertragungszeit", modul: "M03", thema: "Datenübertragung & Übertragungszeit", stufe: 3, fn: function (rng) { return L.genUebertragung(rng); } },
    subnetting: { name: "Subnetting", modul: "M04", thema: "Subnetting", ap2: true, stufe: 3, fn: function (rng) { return L.genSubnetting(rng); } },
    zahlensysteme: { name: "Zahlensysteme", modul: "M03", thema: "Zahlensysteme", stufe: 2, fn: function (rng) { return L.genZahlensysteme(rng); } },
    datenmengen: { name: "Datenmengen (GiB/GB, Bit/Byte)", modul: "M03", thema: "Datenmengen & Präfixe", stufe: 2, fn: function (rng) { return L.genDatenmengen(rng); } },
    raid: { name: "RAID-Kapazität (AP2-Zusatz)", modul: "M03", thema: "RAID", ap2: true, stufe: 3, fn: function (rng) { return L.genRaid(rng); } },
    netzplan: { name: "Netzplan", modul: "M01", thema: "Netzplantechnik", stufe: 3, fn: function (rng) { return L.genNetzplan(rng); } }
  };

  /* ---------------- Export ---------------- */
  if (typeof module !== "undefined" && module.exports) module.exports = L;
  else root.L = L;
})(typeof window !== "undefined" ? window : globalThis);
/* #79 – Fragetyp-Registry L.TYP (grade/simAuto/sek/punkte je Typ); TYPEN/SIM_TYPEN/TYP_META abgeleitet; L.grade-Dispatch */
/* v3.3 – neue Fragetypen: mehrfach, reihenfolge, dropdown (gradeMehrfach/Reihenfolge/Dropdown) */
