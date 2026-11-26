> ⛔ **GESCHICHTE, KEINE ANLEITUNG (25.09.2026, E46).** Die 105 Fragen sind im Juli und August aufgelöst worden (M08, M01/02/03/07, gelöscht, gestrichen). Der Batch liegt jetzt unter `referenz/batches_m09/`. **Das `cp` unten NICHT ausführen** – es legte 66 Dubletten an.

# Projekt „Unser Unterricht" – Checkpoint-Datei
# Bei Token-Abbruch: HIER weiterlesen, dann BUILD_LOG. Dieses Projekt läuft PARALLEL zum
# AP1-Arbeitsblock (START_PROMPT.md); dortiger Stand bleibt unberührt (Freitext Schritt 3 offen).

## AUFTRAG (Kurzfassung)
Neue, strikt getrennte Übungskategorie „Unser Unterricht" für die WiSo-Klausur am 31.07.2026
(FISI0126). Eigene Kachel, eigener Pool, NIE im allgemeinen Zufallsmodus. Alle 21 Fragentypen,
~5 Fragen je Typ in Stufe 1. Vor jeder Phase: offene Fragen vorlegen, Freigabe abwarten.
Prüf-Loop durch Hauptinstanz, Subagenten für Generierung, Checkpoints je Phase.

## QUELLDOKUMENTE
1. Themenliste Klausur 31.07.2026 (Foto, gelesen): Wertschöpfung · Aufbauorganisation
   (Aufgabenanalyse/-synthese, Leitungssysteme, Führungsstile, Managementtechniken) ·
   Ablauforganisation (Gantt, Netzplantechnik) · Kaufmannseigenschaft · Die Firma ·
   Rechtsformen · Handlungsvollmachten & Prokura · Kundenauftrag (Anfrage, Angebot).
2. Aufgabenblatt Berufsausbildung (Foto, gelesen): 7 Blöcke Fallaufgaben BBiG/JArbSchG
   (Ausbilder-Voraussetzungen, Vertrag, Verstöße, Probezeit/Kündigung Florian Pfiffig,
   Fall Eva Netzer, zuständige Stellen, Vertragsbestandteile; Fälle Felix Höring, Gabi Meier).
   KEINE Musterlösungen vorhanden → Abgleich gegen Gesetzestext (Nutzer-Entscheid).
3. „Lösungen WiSo Fragen vom 17.07.26.pdf" (gelesen): Westermann-Lösungen Kapitel 4
   „Abwicklung von Kundenaufträgen" (Anfrage/Angebot/Annahmefristen/Freizeichnungsklauseln/
   Beschaffungsplanung, Fragen 1–11, Lehrbuch S. 79). Verbindliche Quelle NUR für das
   Thema Kundenauftrag. ⚠️ Zuerst hochgeladenes „Loesung_Arbeitsblatt_Hardware_LF2_Teil2.pdf"
   war eine Fehl-Lieferung und ist für dieses Projekt IRRELEVANT.

## NUTZER-ENTSCHEIDE (Phase 0, 2026-07-20 – alle per AskUserQuestion bestätigt)
- E-U1: Themenumfang = Klausurthemen + Berufsausbildung (BBiG/JArbSchG) als Unterthema.
- E-U2: Fallaufgaben: Struktur als VORLAGE, neue Fälle im Rhaus-Metall-Szenario (nicht 1:1 –
  Original-Blatt bleibt so zusätzliche Übung).
- E-U3: EIGENE Statistik auf der Kategorie-Seite; fließt NICHT in AP1-Bereitschafts-Score.
- E-U4: Gewichtung nach Klausur-Relevanz (Aufbau-/Ablauforganisation je ~15–20, Berufsausbildung
  ~20, Rechtsformen/Vollmachten/Kaufmann/Firma je ~8–10, Wertschöpfung + Kundenauftrag je ~8).
- E-U5: Schwierigkeitsverteilung AUFSTEIGEND: ~40 % St. 1, 30 % St. 2, 20 % St. 3, 10 % St. 4
  (Stoff ist neu). NICHT die klausurnahe 20/35/35/10.
- E-U6: Berufsausbildungs-Fragen strikt gegen BBiG/JArbSchG-Gesetzeslage (kein Lösungsblatt
  vorhanden); Kundenauftrags-Fragen strikt gegen das Westermann-PDF.
- E-U7: Fehler-Deck GEMEINSAM (M09-Fragen landen im normalen Deck; Trennung betrifft nur die
  Zufallsauswahl neuer Fragen).
- E-U8: Architektur „neues Modul M09 + zentrale Sperre in passtAP()" ist grundsätzlich gewählt,
  aber Nutzer will vor Freigabe die DETAILLIERTE Änderungsliste je Datei sehen → Phase 1a.

## INVENTAR (Phase 0, verifiziert am Code)
- 21 Render-Typen (R_TYP in app_loeser.js): mc, mehrfach, dropdown, lueckentext, zuordnung,
  reihenfolge, matrix, mtf, kreuztabelle, hotspot, beschriftung, bild(unterTyp mc/luecke/dropdown),
  freitext, erklaeren, rechenassistent, kalkulation, konsole, trace, fehlersuche, baukasten,
  szenario2; plus Pseudo-Typ generator.
- Kategorien = Module M01–M08 (app_pool.js MODULE); M08=WiSo existiert (50 Fragen) und läuft im
  allgemeinen Pool MIT. Startseiten-Kacheln sind FUNKTIONS-Kacheln (app_seiten.js sStart).
- Zufalls-/Mischwege: kandidaten() (Üben; leere Modulwahl = alles), Themen-Serie
  (schwächstes Modul), Fehler-Deck, Simulation (app_sim.js:39 schließt heute NUR M08 aus –
  M09 würde ohne Sonderbehandlung REINRUTSCHEN), genAlsFrage(), Statistik/Glossar-Seiten.
- Absicherungen: L.validateFragen erzwingt modul /^M0[1-8]$/ (logik.js:337); build_fragen.py
  ID_RE ^M0\d-\d{3}$ (M09-tauglich); JSON-Schema via tools/build_schema.js; Drift-Guard fragen.js.

## ⚠️ EINSTIEG NEUER CHAT (Stand 2026-07-21 – PROJEKT ABGESCHLOSSEN)
PHASEN 0–4 UND AUSBAUSTUFE 2 SIND KOMPLETT. Alle Rückfragen sind gestellt und beantwortet –
NICHT erneut stellen. 105 M09-Fragen im Pool (gesamt 941), alle 30 Suiten auf Sollwert.
AUSBAUSTUFE 2 (alle vier Punkte, 2026-07-20/21): Deck-Wiedervorlage auf der Unterrichtsseite
(v0.12.1) · 15 SVG-Fragen visuell geprüft, 7 korrigiert (v0.12.2) · eigener M09-Spickzettel +
34 Begriffe im Lexikon (v0.13.0) · Klausur-Simulation 25 Fragen/60 Min (v0.14.0).
AN DIESEM PROJEKT IST NICHTS MEHR OFFEN. Diese Datei ist ab hier NACHSCHLAGEWERK, kein Auftrag.
Der nächste Task steht in START_PROMPT.md (AP1-Freitext Schritt 3).
Einziger offener Punkt beim NUTZER: der Unterrichtsbereich war noch nie auf einem Gerät –
Klausur ist am 31.07.2026.
Die folgenden Abschnitte PRÜFBERICHT/RÜCKFRAGEN sind Historie von Phase 3.
Alle 105 Fragen liegen fertig geprüft in **batches_m09/m09_alle105.json** (Einzelbatches
m09_b1–b7.json daneben; b1–b7 sind die Quelle, alle105 die sortierte Gesamtdatei – beide synchron).

## PRÜFBERICHT PHASE 3 (Endkontrolle 2026-07-20, alles selbst verifiziert)
- **Vollständigkeit:** 105/105 IDs exakt nach UNTERRICHT_MATRIX.md, keine Dubletten, kein
  Überhang. Typen: 21 × exakt 5. Schwierigkeit exakt 42/32/21/10. validate_batch: 0 Fehler
  (jede Batch-Datei einzeln UND die Gesamtdatei).
- **Feld-Hygiene:** erklaerungKurz/erklaerungLang/verweis überall; mc mit 4 distraktor-
  Erklärungen; freitext/erklaeren alle mit kalibrierten schluesselbegriffen (max. 3 Pflicht);
  keine Original-Fallnamen des Aufgabenblatts (neue Namen: Brenner, Voss, Dornbach, Kestler,
  Vogelsang, Bergmann).
- **Fachlich nachgerechnet:** beide Netzplan-Tabellen (069: GP B=2/C=0; 071: SAZ/SEZ/GP exakt),
  Bezugskalkulation 127 (A 6.100 < B 6.180), Nutzwert 128 (6,9 vs. 7,4 → B; bewusste Pointe:
  quantitativ A, qualitativ B), Vergütungstabelle 141 (33.480), Wertschöpfungs-Traces,
  alle rechenassistent-Formeln inkl. Grenzwerte (Validator rechnet Extremkombinationen).
- **Westermann-Treue:** 121–129 gegen das PDF geprüft (W4 a/b, W5-Antrag 3 Kriterien, W6
  Annahmefristen, W8a/b Bindefrist+Klauseln, W10c Anfrage-Inhalt, W10e unverbindlich).
- **SVG strukturell geprüft:** Zonen==Rechtecke (Validator), Gantt-Balken == behauptete Wochen
  (054: B startet W2, 4 Wochen; 055: kritische Kette B, Gesamt 5), Netzplan-Zahlen der SVGs
  selbst nachgerechnet (062 kritisch A-B-D; 064 GP C=1; 065 FEZ(B)=10/SAZ(B)=4), 095 enthält
  den Prokura-Eintrag, 063 zeigt sichtbare Nummern 1–6.
- **Im Prüf-Loop gefundene und behobene Agenten-Fehler** (Beleg, dass der Loop nötig war):
  Prokura-Eintragung fälschlich „konstitutiv" (113), Kredit fälschlich „nur mit Sondervollmacht"
  für Prokuristen (112/114), e.K. fälschlich ohne HR-Eintrag (105), OHG mit „Komplementären" (103),
  Bindefrist „nach Ablauf" (124), pauschal 30 Urlaubstage (133), Matrix-Quadranten inkonsistent
  zu den Achsen (033/034/044 neu konstruiert: Blake/Mouton, situatives Führen, Will-Skill),
  Eisenhower-Antwort-Leak im Fragetext (043), mehrdeutige Pausen-Formulierung (145),
  fehlende Probezeit-Angabe im Fall (147), Kreuztabellen-Fehler (024: Matrix≠klare Befehlswege,
  Stablinie≠kurze Wege), uneindeutige beschriftung-Slots (004).
- **Nebenprodukt-Fixes am Bestand:** logik.js validateFragen akzeptiert jetzt Alternativlisten
  in schluesselbegriffen (war inkonsistent zu Schema+gradeTeilpunkte – eine solche Pool-Frage
  wäre beim Boot STILL rausgefallen; von B3-Agent empirisch gefunden). test_logik weiter 2162.

## BEKANNTE EINSCHRÄNKUNGEN / LÖSUNGSVORSCHLÄGE (für Abschlussbericht Phase 4)
- ✅ ERLEDIGT 2026-07-20 (v0.12.2): die 15 SVG-Fragen sind jetzt VISUELL geprüft. Renderweg:
  `pip install cairosvg --break-system-packages`, dann svg2png(scale=2) → PNG einzeln ansehen.
  make_screenshots.py taugt dafür NICHT, das erzeugt nur die Manifest-Bilder. 7 Fragen korrigiert
  (022/023/025/051/053/055/065), Details im BUILD_LOG-Eintrag „Ausbaustufe 2, Teil 2".
- ✅ ERLEDIGT 2026-07-20: hotspot 051 Klickzone 20×20 → 32×32. ACHTUNG für künftige Zonen-Änderungen:
  validate_batch vergleicht den rect-String ZEICHENGENAU, Zone und SVG-rect müssen zusammen
  geändert werden – und die vergrößerte Zone darf keine Nachbarzone überlappen (passierte hier
  im ersten Anlauf mit Vorgang C, deshalb Mittelpunkt zusätzlich versetzt).
- konsole = Kurzantwort-Eingabe (Nutzer-Entscheid E-konsole): Fragetexte sagen ausdrücklich
  „Fachbegriff eintippen"; akzeptierte Schreibvarianten hinterlegt.
- ✅ ERLEDIGT 2026-07-21: Glossar/Spickzettel haben M09-Inhalte (v0.13.0: eigener Spickzettel
  spickzettel_m09.js + 34 Begriffe im Lexikon) und die Deck-Wiedervorlage greift auf der
  Unterrichtsseite (v0.12.1, dueUnterricht). OFFEN bleibt nur: generator bewusst nicht in M09.
- Themen-Bilanz weicht ±1–2 vom E-U4-Ziel ab (vom Nutzer akzeptiert).

## VORBEREITETE RÜCKFRAGEN (ERLEDIGT 2026-07-20 – Antworten im PHASENSTAND. Nur noch Historie.)
1. **Push-Strategie:** Es liegt ALLES ungepusht: v0.11.0 (G3), Freitext Schritt 1+2, M09 Phase 1+3.
   Optionen: (a) nach Phase 4 EIN Push als v0.12.0 (empfohlen: ein sauberer Release mit
   Changelog v0.11.0+v0.12.0, CI läuft einmal), (b) erst v0.11.0 pushen, dann v0.12.0 separat.
2. **Pool-Formatierung (offen aus AP1-Block):** pool_m04/m05.json wurden am 19.07. von 1er- auf
   2er-Einrückung umformatiert → ~13.000-Zeilen-Diff. Vor dem Push zurückformatieren
   (empfohlen, kleiner Schritt: json.dump mit indent=1 reproduzieren + build_fragen + Diff
   prüfen) oder so lassen?
3. **test_unterricht erweitern?** Nach Integration einen Test ergänzen „POOL enthält exakt 105
   M09-Fragen / alle 21 Typen vertreten" (Sollwert 28 → 30, sollwerte.env nachziehen). Empfohlen.
4. **Reihenfolge danach:** erst AP1-Freitext Schritt 3 (89 Fragen nachrüsten + 15 nachkalibrieren,
   Alternativlisten jetzt verfügbar) oder erst M09-Ausbaustufe-2-Ideen? (Klausur 31.07. spricht
   für: nach Phase 4 kurz M09 am Handy testen, dann AP1 weiter.)

## PHASE-4-ANLEITUNG (nach den Rückfragen, Schritt für Schritt)
1. `cp batches_m09/m09_alle105.json pool/pool_m09_unterricht.json` (Datei ist bereits ein
   valides Pool-Array; danach NIE fragen.js direkt editieren).
2. `python3 build_fragen.py` → muss „pool_m09_unterricht.json: 105 Fragen" und gesamt 941 melden.
3. `bash check.sh schnell` (validate_pool + idcheck + Schema + test_logik).
4. jsdom frisch: `mkdir -p /tmp/jt && (cd /tmp/jt && npm install jsdom axe-core)`; flaches
   Arbeitsverzeichnis bauen (siehe START_PROMPT-Kasten); ALLE 30 Suiten einzeln auf Sollwert
   (test_unterricht zieht jetzt echte M09-Fragen; ggf. Erweiterung aus Rückfrage 3 zuerst).
5. Lade-Test JEDER M09-Frage (Phase-4-Pflicht aus dem Auftrag): Einmal-Skript in jsdom – alle
   105 via `loeseFrage(L.instanziiere(f), host, …)` rendern, Fehlerzähler MUSS 0 sein;
   für szenario2/hotspot zusätzlich einen Klickpfad. Danach 5 Stichproben von Hand beantworten.
6. Trennungstest erneut AKTIV (test_unterricht + 500-Ziehungen-Probe), Boot-Smoke, Offline-Audit.
7. APP_VERSION „0.12.0", sw.js-Cache „ap1-v0.12.0", CHANGELOG-Block v0.12.0 (Kategorie,
   105 Fragen, Trennungs-Garantien, Freitext-Verbesserungen aus v0.11.0-Block NICHT doppeln).
8. Abschlussbericht an Nutzer (Fragen je Typ/Thema, Code-Änderungen, Einschränkungen s. o.,
   Stufe-2-Vorschläge), dann NUR nach Freigabe der Push vom Windows-Rechner + Tag-Kontrolle.
   (Bis 10.09.2026 stand hier `bash push.sh "…"` — das Skript gibt es bewusst nicht mehr.)

## PHASENSTAND
- Phase 0 (Bestandsaufnahme + Klärung): ✅ KOMPLETT.
- Phase 1a (Detail-Änderungsliste): ✅ vorgelegt und freigegeben (11 Punkte).
- Phase 1b (Umsetzung + Tests): ✅ KOMPLETT 2026-07-20. M09 implementiert, 30 Suiten grün,
  Details im BUILD_LOG-Eintrag „Unser Unterricht Phase 0+1". Trennung dauerhaft bewacht durch
  tests/test_unterricht.js (28, Sollwert unterricht=28). Version bleibt 0.11.0, NICHT gepusht.
  ⚠️ LEHRE: Routing hat DREI Stellen (routen-Tabelle app_seiten.js, SEITEN app_ui.js,
  ROUTEN_NAMEN app_ui.js) – ROUTEN_NAMEN fehlte im Plan, Testsuite hat es gefunden.
- Phase 2 (Themen-Typ-Matrix): ✅ vorgelegt und freigegeben (inkl. Entscheide: konsole als
  Kurzantwort; Themen-Bilanz-Abweichungen akzeptiert). UNTERRICHT_MATRIX.md = verbindlich.
- Phase 3 (Generierung + Prüf-Loop): ✅ KOMPLETT 2026-07-20. 105/105 Fragen in
  batches_m09/ (7 Batches: b1 Grundtypen 25 · b2 Zuordnung/Matrix/Kreuz 20 · b3 freitext/
  erklaeren 10 · b4 rechnen/kalkulation/trace 15 · b5 SVG 15 · b6 szenario2/fehlersuche/
  konsole 15 · b7 baukasten 5 [von Hauptinstanz selbst]). Details im PRÜFBERICHT oben.
- Phase 4 (Integration + Abnahme + v0.12.0): ✅ KOMPLETT 2026-07-20. Die vorbereiteten Rückfragen
  sind gestellt und beantwortet (Entscheide s. u.). 105 Fragen im Pool (gesamt 941), APP_VERSION
  0.12.0, sw.js ap1-v0.12.0, CHANGELOG-Block v0.12.0. Alle 30 Suiten auf Sollwert. NICHT GEPUSHT –
  Push erst nach ausdrücklicher Freigabe.
  NUTZER-ENTSCHEIDE 2026-07-20 (Rückfragen 1–4):
  - Push: EIN Release als v0.12.0 nach Phase 4 (nicht v0.11.0 separat).
  - Pool-Formatierung: ALLE Pooldateien auf indent=2 vereinheitlicht (nicht nur m04/m05
    zurückgedreht). Hintergrund: der Pool war nie einheitlich (13× indent=2, 7× indent=1); das
    Skript vom 19.07., das schluesselbegriffe in 4 Fragen nachtrug, schrieb m04/m05 mit Pythons
    Default indent=2 neu. Verifiziert: fragen.js und faelle.js vorher/nachher byte-identisch.
  - test_unterricht NICHT um einen 105-Zähler erweitert (bewusst: Content-Zahl würde bei jedem
    Ausbau brechen) – STATTDESSEN um den Themen-Wächter (s. u.), Sollwert 28 → 30.
  - Reihenfolge danach: M09-Ausbaustufe 2 vor dem AP1-Freitext-Block.
  BEI DER INTEGRATION GEFUNDEN UND BEHOBEN (Phase 1 hatte nur die Hälfte nachgezogen):
  - validate_pool.js prüfte thema ausschließlich gegen L.THEMA_RELEVANZ → 105 Fehlmeldungen.
  - tools/build_schema.js hatte modul bereits auf M0[1-9], das id-Pattern aber noch auf M0[1-8].
  - validate_schema.js injizierte nur die AP1-Themen-Enum.
  - test_engine Block C forderte „jedes Thema in fragen.js steht in THEMA_RELEVANZ" – für M09
    bewusst falsch, Block ist jetzt auf modul !== "M09" eingeschränkt (Sollwert 70 unverändert).
  LÖSUNG (Nutzer-Entscheid): **L.M09_THEMEN in logik.js** als Single Source; validate_batch.js
  (hatte eine lokale Kopie), validate_pool.js und validate_schema.js lesen jetzt dieselbe Liste.
  validate_schema kompiliert ZWEI Schemata (AP-Themen / M09-Themen) und wählt nach modul – bewusst
  nicht die Vereinigung, sonst dürfte eine M03-Frage ein Unterrichts-Thema tragen. Gegenprobe
  gefahren: M03 mit M09-Thema abgelehnt, M09 mit AP1-Thema abgelehnt, M10-001 abgelehnt.
  test_unterricht bewacht die Disjunktheit der beiden Themenmengen aktiv (2 neue Tests).
  ABNAHME-MESSWERTE: alle 105 Fragen in jsdom gerendert (0 Fehler, 0 ohne Inhalt/Interaktion,
  21 Typen × 5), Klickpfade für 5 hotspot + 5 szenario2 grün, 5 Stichproben (mc/mehrfach/freitext/
  kalkulation/mtf) Musterlösung richtig und falsche Antwort falsch, freitext 100 % „richtig" vs.
  0 % „unvollständig". Buchung: eine M09-Antwort bewegt exakt die Keys M09 und T:M09:<Thema>,
  Bereitschafts-Score bleibt unberührt (themen=0), Deck-Eintrag entsteht und wird fällig.
  Boot-Smoke 0 JS-Fehler (POOL 941, POOL_FEHLER 0), 500× kandidaten() ohne M09-Leck,
  kandidatenUnterricht ausschließlich M09, Sim-Basis ohne M09, Offline-Audit 0 externe URLs.
  OFFEN aus diesem Schritt: die 15 SVG-Fragen sind weiterhin nur strukturell geprüft, nicht
  visuell (Durchklicken am Gerät); hotspot 051 hat weiterhin die knappe 20×20-px-Klickzone.
- (Ursprüngliche Phase-2-Notiz, überholt:)
  Vorgaben: Gewichtung E-U4, Schwierigkeit E-U5 (40/30/20/10), Rhaus-Metall-Einkleidung,
  Fallstruktur des Aufgabenblatts als Vorlage mit NEUEN Fällen (E-U2), Netzplan→Netzplan-Editor-
  Typen (trace/beschriftung/rechenassistent), Gantt→hotspot/bild, Rechtsformen/Vollmachten→
  zuordnung/matrix/kreuztabelle, Kundenauftrag strikt nach Westermann-PDF (E-U6).
  STOPP nach Vorlage – erst Freigabe, dann Phase 3.
- Phase 3 (Generierung per Subagenten in Typ-Batches + Prüf-Loop Hauptinstanz): ✅ KOMPLETT.
  Prüfkriterien: IHK-Niveau, eindeutige Lösung, plausible Distraktoren, Format validiert
  (validate_batch.js + testweise laden), Feedback mit Begründung, keine Dubletten, Deutsch.
  Zweifelsfälle (mehrdeutige Rechtslage) dem Nutzer vorlegen statt raten.
- Phase 4 (Integration in pool_m09_unterricht.json via build_fragen.py, jede Frage einmal laden,
  erneuter Trennungstest, Abschlussbericht, dann v0.12.0): ✅ KOMPLETT 2026-07-20.

## ARBEITSREGELN AUS DEM AP1-PROJEKT (gelten weiter)
Pool nur über pool/*.json + `python3 build_fragen.py`; fragen.js/faelle.js NIE direkt editieren.
`bash check.sh schnell` vor/nach jedem Schritt; jsdom-Suiten aus flachem /tmp-Verzeichnis
(siehe START_PROMPT). Sollwerte NUR in sollwerte.env. Kein Push ohne Nutzer-Freigabe.
