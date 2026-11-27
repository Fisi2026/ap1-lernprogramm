# TASKLIST_ARCHIV – Chronik der TASKLIST
#
# ROTIERT AM 2026-07-27. Grund: TASKLIST.md war auf 1159 Zeilen gewachsen und mischte Regeln mit
# Status. Der Kopf trug den Stand vom 20.07., darin sieben Behauptungen „NICHT GEPUSHT" ueber
# Versionen, die laengst live waren, und „APP_VERSION 0.14.0" als Statusaussage.
#
# ⚠️⚠️ **HIER STEHT EINE REGEL, DIE HEUTE FALSCH IST – UND ZWAR GEFAEHRLICH FALSCH.**
# Token-Sparregel 9 lautete: „KEIN git im Projektordner: Mount verbietet gits Lock-/Loeschoperationen
# … Versionierung stattdessen: Backup-Zip je Meilenstein." Das galt im Juli 2026 fuer wenige Tage.
# **Seit v0.8.0 wird committet, gepusht und getaggt**, es gibt eine GitHub-Release-Action und
# Cloudflare-Deploys. Wer die alte Regel befolgt, arbeitet grundlegend verkehrt.
# ⚠️ **ALLE STATUSAUSSAGEN IN DIESER DATEI SIND UEBERHOLT.** „NICHT GEPUSHT", „APP_VERSION 0.14.0",
# „OFFEN:", „UEBERFAELLIG" – alles stimmte zu seinem Zeitpunkt.
# **Es gilt START_PROMPT.md fuer den Status und TASKLIST.md fuer die Regeln. Gemessen wird am Code.**
#
# WOFUER DIESE DATEI GUT IST: Sie beantwortet „warum ist X so gebaut?" – die Entscheidungen der
# Bloecke A–F, des Arbeitspakets „29 Ideen", der Gruppen G1–G5, der Feedback-Runden FB-R1/R2/R3 und
# des M09-Unterrichtsprojekts stehen hier mit Begruendung. **Gezielt nachschlagen, nicht am Stueck
# lesen.**
#
# ══════════════════════════════════════════════════════════════════════════════════════════════

# TASKLIST – AP1-Lernprogramm (v3, Opus-Betrieb)

# ÜBERGABE-BRIEFING (Stand 2026-07-20). KERN (T/L/R/C/F/S) KOMPLETT. Arbeitspaket „29 IDEEN": PHASE A+B fertig.
# G1 (v0.8.0), G2 (v0.9.0) und G4 (mit v0.10.0) SIND DURCH. Tag v0.10.0 ist auf GitHub (dbb51c6) – Punkt erledigt.
# NEU 2026-07-19: GRUPPE G3 IST KOMPLETT → v0.11.0, NOCH NICHT GEPUSHT.
#   G3.2 (#6 Adaptive Schwierigkeit JE THEMA) umgesetzt; G3.5 (#13) auf Nutzer-Entscheid NICHT gebaut
#   (Themenliste existierte längst); G3.6b (AP1-Gewichte) recherchiert und umgesetzt.
# Stand 2026-07-20: Pool 941 Fragen (836 AP1/AP2 + 105 M09), 9 Fälle/45 Teilaufgaben, 21 Typen,
# APP_VERSION 0.14.0, sw.js ap1-v0.14.0. Backups: backup_2026-07-19.zip + _19c.zip.
# OFFEN (Reihenfolge vom Nutzer am 2026-07-19 neu festgelegt):
#   1. AP1-BLOCK „Freitext-Bewertung" – kommt NACH der M09-Ausbaustufe (Nutzer-Entscheid 2026-07-20).
#      Details + Messwerte im BUILD_LOG-Eintrag vom 2026-07-20 zu Schritt 1+2.
#      Ziel: Freitext tauglich machen, DANN die Simulation für ungebundene Formate öffnen.
#      STAND 2026-07-20: Schritt 1 (Mehrwort + Abkürzungen) und Schritt 2 (Alternativen je Begriff)
#      SIND FERTIG. Dabei zwei Bestandsfehler behoben (Substring ohne Wortgrenze → „Die Kosten sind
#      gesunken" erfüllte den Begriff OS; 3 stille Synonym-Kollisionen). Falsch-Positive 8→0,
#      keine Regression, realistische Azubi-Antworten 0/6 → 4/6 als „richtig".
#      OFFEN ist Schritt 3: Nachrüstung der 89 Fragen ohne Begriffe + Nachkalibrierung der 15
#      Bestandsfragen (max. 4 Pflicht, Ziel 2–3; Alternativlisten stehen jetzt bereit).
#      (Der Nebenbefund aus G3.6b – AP1 besteht nur aus ungebundenen Aufgaben – ist damit entschieden:
#      ungebundene Formate werden ERGÄNZT, die Ankreuzformate bleiben unangetastet.)
#   2. Push: ERLEDIGT 2026-07-21 – EIN Release v0.14.0 (Commit 64ddeea, Tag v0.14.0 auf GitHub,
#      CI grün). Die Zwischenstände v0.11.0–v0.13.0 wurden bewusst nie einzeln getaggt.
#   3. #31 Schriftgrößen + #30 Print-CSS … FERTIG 2026-07-21 (v0.15.0). Nutzer-Entscheide:
#      nur 3 Stufen (kein Font-Toggle), Print nur Spickzettel+Statistik, Details aufgeklappt drucken.
#      data-schrift/data-seite am <html>; beforeprint-Hook, weil CSS <details> nicht sicher öffnet.
#      test_a11y 25→38.
#   4. Aufräumen: 7 Backup-ZIPs (18 MB, Stand 2026-07-21 nachgezählt), tote Level-Reste,
#      NAECHSTER_CHAT.md/COVERAGE.md. ✅ 25.07. erledigt: NAECHSTER_CHAT.md geloescht, COVERAGE.md
#      auf die manuellen Analysen gekuerzt. Hinweis: Backups sind per .gitignore ausgeschlossen,
#      belegen also nur lokal Platz. Löschen scheitert am Mount → per allow_cowork_file_delete.
#   5. GRUPPE G5 UX → v1.0.0 … FERTIG 2026-07-21. Detailplan AP2-G5 in PLAENE.md angelegt;
#      Bestandsabgleich: #24/#28 waren gebaut, #26 gestrichen, #30/#31 am selben Tag fertig,
#      real offen war nur #39 Landing-Page → index.html ist jetzt eine echte Einstiegsseite,
#      manifest start_url auf lernprogramm_ap1.html, Offline-Audit deckt index/manifest/sw mit ab,
#      test_pwa 22→32. → ARBEITSPAKET „29 IDEEN" ABGESCHLOSSEN, APP_VERSION 1.0.0 (NICHT GEPUSHT).
# 30 Suiten, Single Source sollwerte.env (2026-07-21: unterricht 28→62, a11y 25→38, freitext 11→27, engine 70).
# PARALLEL-PROJEKT „Unser Unterricht" (M09, WiSo-Klausur 31.07.2026): PHASE 0–4 KOMPLETT
#   (2026-07-20). 105 Fragen im Pool, gesamt 941. NICHT GEPUSHT. Rückfragen sind gestellt und
#   beantwortet – NICHT erneut stellen. Entscheide/Messwerte: docs/plaene/UNTERRICHT_PROJEKT.md (PHASENSTAND).
#   NEBENBEI: gesamter Pool auf indent=2 vereinheitlicht (fragen.js/faelle.js byte-identisch);
#   L.M09_THEMEN in logik.js ist jetzt Single Source für validate_batch/validate_pool/validate_schema.
# M09-AUSBAUSTUFE 2 (Nutzer wählte alle vier Punkte, 2026-07-20), danach AP1-Freitext Schritt 3:
#   1. Deck-Einstreuung Unterrichtsseite … FERTIG v0.12.1 (dueUnterricht, test_unterricht 30→38)
#   2. SVG-Fragen visuell geprüft … FERTIG v0.12.2 (7 von 15 korrigiert; cairosvg→PNG als Renderweg)
#   3. Glossar/Spickzettel um M09 … FERTIG v0.13.0 (spickzettel_m09.js + tools/build_spick_m09.py,
#      GLOSSAR_M09_BEGRIFFE, GLOSSAR_TIPS 37→71, Reiter Üben|Spickzettel)
#   4. Klausur-Simulation nur aus M09 … FERTIG v0.14.0 (loeseFrage statt renderFrage, opts.klausur,
#      buildM09Klausur, eigener Verlauf; test_unterricht 45→62) → AUSBAUSTUFE 2 KOMPLETT
# NEU 2026-07-21: TESTER-FEEDBACK eingegangen → Arbeitspaket „FEEDBACK-RUNDEN FB-R1–R3",
#   Detailplan in PLAENE.md Abschnitt „FB". Nutzer-Entscheide (E1–E4) dort dokumentiert:
#   Feedback VOR Freitext-S3 (S3 wird in FB-R2 integriert); „Rhaus" → pro Aufgabe passende
#   Beispielfirmen; Markieren nur ausblenden (Default AUS); Drag&Drop = echtes Drag + Klick-Fallback.
#   Je Runde: voller Kontroll-Zyklus + Version-Bump + Checkpoint + PAUSE (Nutzer testet am Handy).
# CHECKPOINT 2026-07-21: **FB-R1 IST FERTIG → v1.1.0 (NICHT GEPUSHT).** Alle 10 Punkte umgesetzt.
#   Neue Suite tests/test_fb_r1.js (42) → jetzt **31 Suiten**; markiert 18→26, unterricht 62→64.
#   Kern-Befund: der Kontrast-Bug war EIN fehlender Token – das Dark-Theme überschrieb --text,
#   aber nicht --gelb-wash (1,04:1). Details, alle Nutzer-Entscheide und die vier Gegenproben
#   stehen im BUILD_LOG-Eintrag GANZ OBEN – den zuerst lesen.
#   Neue State-Felder (ohne STATE_VERSION-Bump): S.markierenAn (false), S.panelOffen ({}).
# CHECKPOINT 2026-07-21 (Nachtrag) → **v1.1.1**: die beiden offenen R1-Fragen sind ENTSCHIEDEN.
#   (a) UMGESETZT: Stand-Streifen der Startseite zuklappbar, startet OFFEN. `statPanel` hat einen
#       dritten Parameter `standardOffen`; S.panelOffen speichert nur Abweichungen vom Default.
#       test_fb_r1 42 → **51**, zwei Gegenproben bissen. Neuer Text TEXTE.start.standTitel.
#   (b) ENTSCHIEDEN/VERTAGT: UNTERRICHT_MODUL wird VOLL umbenannt, aber erst in **R3**
#       (PLAENE „FB-R3" Punkt 11: 1 Code-Zeile + 105 verweis-Felder im Pool). Vorher nicht anfassen.
#   ⚠️ test_axe (5) konnte NICHT laufen – npm 403. [ERLEDIGT 22.07.: lief in der CI von
#      v1.6.0 und war gruen; der Tag waere sonst nicht entstanden. Kein offener Punkt mehr.]
# CHECKPOINT 2026-07-21: **FB-R2a IST FERTIG → v1.2.0 (NICHT GEPUSHT).**
#   Zuschnitt (Nutzer-Entscheid): R2a = Freitext + Alternativantworten, R2b = Rest.
#   BESTANDSABGLEICH entlarvte R2.2 (Drag&Drop) als BEREITS GEBAUT, R2.5 zur Hälfte (Shuffle läuft
#   längst stufenunabhängig) und R2.6 als reines Content-Thema (Engine kann Alternativen längst).
#   ERGEBNIS: alle 109 freitext/erklaeren-Fragen haben Schlüsselbegriffe (vorher 35), 107 mit
#   Alternativlisten. Zwei echte Bewertungsfehler behoben: Kür-Begriffe werteten eine vollständige
#   Antwort ab, und L.normAntwort normalisierte keine Umlaute.
#   Messwerte, Agenten-Probe und die vier teuren Fallen stehen im BUILD_LOG GANZ OBEN.
#   test_logik 2162→2168 · test_freitext 27→38 (vier neue Wächter, jeder mit Gegenprobe).
#   ⚠️ LEHRE: Ein Schwellenwert-Test fängt keinen Einzelfehler. Der IST/SOLL-Rückfall bewegte das
#   Kreuzprodukt nur 51 → 52; erst der gezielte Stoppwort-Wächter beißt.
#   ⚠️ test_axe (5) läuft weiter NICHT (npm 403) – vor dem Push nachholen.
# CHECKPOINT 2026-07-21 (FB-R2b angefangen, KEIN Bump): Bestandsabgleich ergab – Taschenrechner
#   und Stufen-Vorschau existieren NICHT (echte Neubauten), das Links/Rechts-Layout der Zuordnung
#   war tatsächlich offen und ist jetzt UMGESETZT (bestehende .split-Klasse, am Handy einspaltig).
#   test_fb_r1 51 → 57, beide Gegenproben bissen.
#   ⚠️ Der Handy-Test von v1.2.0 wurde ÜBERSPRUNGEN und steht weiterhin aus.
# CHECKPOINT 2026-07-21 (R2b.1 fertig, KEIN Bump): **Taschenrechner + Notizfeld UMGESETZT.**
#   Nutzer-Entscheide: Handy-Test v1.2.0 ÜBERSPRUNGEN (v1.2.0 gilt als abgenommen) · KEINE
#   Zahlensysteme im Rechner · Reihenfolge Rechner → Vorschau → Fragen.
#   rechnerAuswerten/rechnerPanel in app_util.js (eigener Parser, KEIN eval), Einhängung über
#   rechnerAnhaengen() in app_loeser.js an genau drei Stellen; in Simulation UND M09-Klausur aus.
#   NEUE SUITE tests/test_rechner.js (**123**) → jetzt **32 Suiten**, sollwerte.env rechner=123.
#   ⚠️ ZWEI FALLEN: das Anzeigefeld trug erst die Klasse `luecke` (Selektor der ANTWORTfelder) und
#   ließ test_diagnose fallen; und der Mobile-Test war ZWEIMAL still grün, weil sein Textausschnitt
#   erst bis zum Dateiende reichte und dann den eigenen Kommentar traf. Details im BUILD_LOG.
#   ⚠️ test_axe (5) läuft weiter NICHT (npm 403). Funktionierender jsdom-Weg jetzt: `tar` statt `cp`.
# CHECKPOINT 2026-07-21 (R2b.2 fertig, KEIN Bump): **STUFEN-VORSCHAU UMGESETZT.**
#   Nutzer-Entscheide: volle Matrix Aufgabenart × Stufe · Beispiel aufklappbar mit voller Frage ·
#   NICHT mitdrucken. `stufenVorschauPanel()` in app_pages2.js, neu `TYP_NAMEN`/`typName()`.
#   NEUE SUITE tests/test_stufen.js (**46**) → damals als "33 Suiten" notiert; die Zahl war schon
#   ab a11y_proxy falsch, tatsächlich 34 (korrigiert am 2026-07-22).
#   ⚠️ DREI BEFUNDE: Druck-Kollision mit #30 (beforeprint öffnet ALLE details) · ein verwaister
#   CSS-Kommentar zerlegte styles.css und wurde nur zufällig gefunden (CSS hat kein Syntax-Gate) ·
#   ein Test las nach einem Re-Render ein abgehängtes DOM. Details im BUILD_LOG.
#   ►►► POOL-BEFUND für den nächsten Task: 25 von 76 Typ/Stufe-Feldern sind leer, fast alle auf
#       Stufe 1 und 4 – die Vorschau weist sie jetzt selbst aus.
# CHECKPOINT 2026-07-21: **FB-R2b IST KOMPLETT → v1.3.0 (NICHT GEPUSHT).** Alle vier Punkte.
#   R2b.3: 16 neue mehrfach-Fragen (je 4 in M01/M05/M07/M08, je 8 auf Stufe 1 und 2).
#   Pool 941 → **957**, mehrfach AP 47 → 63, Stufe 1: 2 → 10, Stufe 2: 12 → 20.
#   ⚠️ DER HAIKU-BATCH WAR UNBRAUCHBAR und lief trotzdem mit „0 Fehler" durch validate_batch:
#   acht Sachfehler, vier davon am Gesetzestext widerlegt (§22 BBiG, §1 BetrVG, §3 TVG, §5 BBiG).
#   Nutzer-Entscheid: alle 16 Fragen selbst geschrieben. Regeln 11–13 in prompts/fragen_batch.md.
#   ⚠️ SELBSTKORREKTUR: Meine Meldung „14 von 16 verletzen 2–3 Richtige" betraf MEINE Vorgabe,
#   nicht den Pool – 31 der 52 Bestandsfragen haben 4 Richtige. Wächtergrenze deshalb bei 4.
#   Zweite Fassung desselben Fehlers: „mind. 2 Distraktoren" hätte 18 Bestandsfragen beanstandet.
#   **LEHRE: vor jeder neuen Regel am Bestand messen, ob der Bestand sie einhält.**
#   NEU: Wächter in tools/validate_batch.js (0 Beanstandungen im Bestand, fängt 3 echte Ausreißer).
#   Suiten: 33 (test_rechner 123, test_stufen 46 neu). 32 auf Sollwert, test_axe weiter blockiert.
# CHECKPOINT 2026-07-21 (Nachtrag): **FREIGABE ERTEILT, COMMIT 0709344 LOKAL, PUSH BLOCKIERT.**
#   `push.sh` hat committet, der Push scheitert am Sandbox-Proxy (403 auf github.com – derselbe
#   Block wie bei npm). NICHT erneut committen; sobald das Netz offen ist, genügt `bash push.sh`.
#   NEU: tests/test_a11y_proxy.js (**9**, sollwerte a11y_proxy=9) als Teilersatz für das weiter
#   ausgefallene test_axe – prüft nur die NEUEN Elemente, ersetzt axe nicht.
#   ⚠️ NEBENBEFUND, noch nicht eingeplant: sechs Bestandsstellen ohne zugängliche Beschriftung
#   (input.luecke-Antwortfelder, Suchfeld, Auswahl + Notizfeld des Spickzettels). Eigener Task.
# CHECKPOINT 2026-07-22: **v1.4.0 GETAGGT UND LIVE** (FB-R3 Punkte 1 + 11). Push vom Windows-
#   Rechner, CI grün, Cloudflare deployt. Handy-Test von v1.4.0 per Nutzer-Entscheid ENTFALLEN.
# CHECKPOINT 2026-07-22 (R3.12 fertig, KEIN Bump): **grep-WÄCHTER SEHEN NUR NOCH ECHTEN CODE.**
#   NEU tools/entkommentiere.js (längentreuer Kommentar-Stripper JS/CSS/HTML, Invariante:
#   gleiche Länge, Ersetzung nur durch Leerzeichen – prüft sich selbst und wirft sonst).
#   Umgestellt: Offline-Audit, UTF-8, Anti-Pattern (4c), Rhaus (4d) – **vier** Wächter, nicht einer;
#   der Offline-Audit hatte dasselbe Muster und wäre bei jeder URL in einem Kommentar rot geworden.
#   FAIL-SAFE: Stripper kaputt → laut melden UND auf der Rohdatei weiterprüfen (nie still grün).
#   Nutzer-Entscheid: alle billigen Wächter laufen jetzt AUCH in `check.sh schnell` (4 s → 6,4 s) –
#   genau die Lücke, durch die der v1.3.0-Fehlalarm erst in der CI auffiel.
#   NEUE SUITE tests/test_entkommentiere.js (**46**), sollwerte.env entkommentiere=46.
#   8 Gegenproben für die Wächter + 2 Gegenproben für die Suite selbst, alle bestanden.
#   ⚠️ NEBENBEFUND BEHOBEN: `npm` HÄNGT seit dem 22.07. unbegrenzt, statt 403 zu liefern – der
#   volle check.sh war dadurch gar nicht mehr fahrbar. Alle npm-Aufrufe haben jetzt `timeout`.
#   ⚠️ ZÄHL-DRIFT: es waren nie „33 Suiten" – a11y_proxy fehlte in der Zählung. Jetzt **35 Suiten /
#   35 Sollwerte**, per `comm -3` als deckungsgleich gegengeprüft. Diese Probe gehört ab jetzt
#   zu jeder neuen Suite dazu.
# CHECKPOINT 2026-07-22 (Nutzerbefund, KEIN Bump): **WIRTSCHAFTSSTOFF DER AP1 AUFFINDBAR + 20 FRAGEN.**
#   Meldung: „für die AP1 werden keine WiSo-Fragen angezeigt". Befund: M08 „WiSo" ist AP2 (Katalog),
#   im AP1-Modus zwangsläufig leer – ABER der wirtschaftliche AP1-Stoff existiert (rund 180 Fragen),
#   verteilt über M01/M02/M03/M07. ⚠️ Ich hatte das zuerst als reines Bedienproblem gemeldet; der
#   Nutzer widersprach zu Recht. Die Quelle, die ich selbst zitiert hatte, nannte im NACHSATZ die
#   Komplexe 02/03/07. **Lehre: eigene Belegstelle bis zum Ende auswerten.**
#   NEU 20 Fragen (M03 +8, M07 +12), Pool **957 → 977**, für die vom Katalog namentlich genannten
#   Lücken: fixe/variable Kosten, Pay-per-Use, Wertschöpfung, Matrixorganisation, Prokura,
#   Handlungsvollmacht, Mietvertrag. ALLE selbst geschrieben (Regel 11: reine Normfragen), jede
#   Rechtsaussage am Gesetzestext belegt (§§ 48/49/52/53/54 HGB, § 535 BGB).
#   ⚠️ Abschreibung/AfA bewusst NICHT ergänzt – dünn, steht aber nicht im AP1-Katalog.
#   NEU Schwerpunkt-Filter „Wirtschaft": WIRTSCHAFT_THEMEN (13 kuratierte Modul/Thema-Paare),
#   istWirtschaft(), wirtschaftAnzahl(); Häkchen MIT Trefferzahl (172), UND-verknüpft mit der
#   Lernfeld-Auswahl, sprechender Leerzustand. Kein neues Modul, kein neues Pool-Feld.
#   NEUE SUITE tests/test_wirtschaft.js (**32**), sollwerte.env wirtschaft=32 → jetzt **36 Suiten**.
#   Kernstück: Tippfehler-Wächter (jedes Paar muss im Pool existieren). 3 Gegenproben bestanden.
# CHECKPOINT 2026-07-22 (Testlaufzeit, gehört zu v1.5.0): **SUITEN LAUFEN PARALLEL.**
#   Nutzerfrage nach der langen Laufzeit. GEMESSEN: ~95 % der Testzeit ist jsdom-Boot
#   (~3,0 s × 41 boot-Aufrufe = ~123 s von ~129 s). Zwei Hypothesen in der Messung widerlegt:
#   Pool verkleinern bringt NICHTS (20 vs. 977 Fragen: identisch 2,96 s), und „ein paar langsame
#   Suiten" gibt es nicht (die 7 ohne jsdom laufen zusammen < 2 s).
#   UMGESETZT: Worker-Pool via xargs -P (Vorgabe Kerne+1, Deckel 8, CHECK_JOBS=1 = sequenziell).
#   Ausgabe bleibt deterministisch (je Suite eine Datei, Auswertung in fester Reihenfolge).
#   Fehlender Rückgabewert = GEFALLEN, nicht übersprungen.
#   GEWINN: 10 Suiten 25,6 s → 11,2 s (Faktor 2,3 auf zwei Kernen).
#   3 Gegenproben bestanden (Durchfaller, SIGKILL ohne .rc, Sollwert-Abweichung).
#   ⚠️ ZWEI dieser Proben meldeten im ERSTEN Anlauf fälschlich „0 Probleme", weil mein Eingriff
#   gar nicht griff (kill hinter process.exit; Suchmuster traf nicht). **Eine grüne Gegenprobe
#   belegt erst dann etwas, wenn der Eingriff nachweislich stattgefunden hat.**
#   ⚠️ SANDBOX: abgekoppelte Prozesse (setsid nohup) überleben den bash-Aufruf NICHT.
#   OFFEN, bewusst NICHT gemacht: test_state (7 Boots, 18 s) entkoppeln; dritte check.sh-Stufe
#   „nur betroffene Suiten". Beides vom Nutzer vorerst abgewählt.
# CHECKPOINT 2026-07-22: **v1.5.0 IST GETAGGT UND LIVE.** Freigabe erteilt, Release-Commit
#   **cbc8df2**, Push vom Windows-Rechner, CI komplett grün, refs/tags/v1.5.0 auf cbc8df2
#   (gegengeprüft), Cloudflare deployt. Enthält: Wirtschaftsschwerpunkt + 20 neue Fragen
#   (Pool 977), FB-R3 Punkt 12 (Wächter auf echtem Code), parallele Suiten, 36 Suiten.
#   ✅ test_axe lief in der CI mit – die einzige Lücke des lokalen Kontroll-Zyklus ist zu.
#   ✅ Der volle check.sh lief dort erstmals MIT Parallelisierung über alle 36 Suiten am Stück.
# CHECKPOINT 2026-07-22 (R3.4 fertig, KEIN Bump): **LINIENSYSTEME ÜBERARBEITET.**
#   18 Fragen geprüft, 7 geändert. ⚠️ KERNBEFUND: DER POOL WIDERSPRACH SICH SELBST – M07-311/312
#   nannten ein Matrix-Beispiel (Fachbereich + Projekt) „Mehrlinienorganisation", während
#   M09-021/024 und mein eigenes M07-709 aus v1.5.0 es richtig erklärten.
#   **LEHRE: beim Einpflegen neuer Fragen den BESTAND zum selben Thema gegenlesen** – mein
#   v1.5.0-Zusatz hat den Widerspruch erzeugt, ohne dass es auffiel.
#   Weiter: Matrix fehlte ganz in M07-312 (jetzt 5 Paare) · M09-027 begründete zu absolut
#   (Aufsichtsrat ist in der GmbH möglich, § 52 GmbHG / DrittelbG ab 500 AN) · Tippfehler M07-109.
#   BEIDE Organigramm-SVGs waren defekt: M07-009 fehlte die Linie GF→Leiter Netzwerk und zwei
#   Linien liefen ins Leere; M07-117 hatte 2× überlappende Boxen und 6 Linien ohne Ziel. Neu
#   gezeichnet, M07-009 zusätzlich mit neutraler Legende (die alte verriet die Lösung).
#   M09-024 (Kreuztabelle) neu entworfen – die alte Zeile „Fachkompetenz neben Hierarchie" war
#   bei der Stablinie angreifbar.
#   ⚠️ cairosvg NICHT installierbar (pip 403) – statt Sichtprüfung eine GEOMETRIEPRÜFUNG gebaut.
#   NEUE SUITE tests/test_liniensysteme.js (**29**) → jetzt **37 Suiten**, sollwerte liniensysteme=29.
#   Begriffs-Wächter + Geometrie-Wächter; die Prüffunktion testet sich selbst mit. 3 Gegenproben
#   bestanden, zusätzlich an den ALTEN SVGs verifiziert (4 bzw. 6 Befunde).
# CHECKPOINT 2026-07-22 (R3.3 fertig, R3.2 OFFEN, KEIN Bump): **NETZPLAN VEREINHEITLICHT.**
#   Befund schärfer als der Plan: nicht zwei Zeichenstile, sondern ZWEI KNOTENSCHEMATA. Pool lehrt
#   FAZ·Dauer·FEZ / SAZ·GP·SEZ (M01-970 fragt es als Hotspot ab), die Menüseite verlangte
#   FAZ·FEZ / SAZ·SEZ / GP·FP. sNetzplan folgt jetzt dem Pool; Dauer vorgegeben, FP entfällt
#   (Nutzer-Entscheid) → 30 statt 36 Felder. TEXTE/CSS/aria-labels mitgezogen.
#   Funktionsprobe: 30 von 30 Feldern richtig, kritischer Pfad weiter ausgewiesen.
#   ⚠️ NEBENBEFUND: --g300 fehlte im DARK-Theme (R1.1-Fehlerklasse) – die Netzplan-Eingaben nutzen
#   ihn seit jeher für den Rahmen. Ergänzt, alle vier Theme-Blöcke geprüft.
#   ⚠️ EIGENER FEHLER: beim CSS-Edit ist ein KAPUTTER HEX-WERT entstanden (Fremdzeichen im
#   Farbcode). Nur durch gezielte Nachprüfung gefunden – CSS hat kein Syntax-Gate.
#   **Nach jedem CSS-Edit: Klammer-/Kommentarbilanz, Hex-Regex, Nicht-ASCII prüfen.**
#   ⚠️ EIGENE FEHLMESSUNG korrigiert: „Gantt 13 Fragen, 1:4·2:5·3:4" war falsch – das waren M01
#   (AP1, 6) und M09 (Klausurvorbereitung, 7) zusammengezählt. Beim Zählen über `thema` IMMER
#   nach Modul trennen.
# CHECKPOINT 2026-07-22 (R3.2 fertig, KEIN Bump): **GANTT-STUFEN ANGEHOBEN.**
#   6 neue Fragen M01-482…487 (je 3 auf Stufe 1 und 2), jede mit eigenem Balkendiagramm.
#   M01 „Gantt & PSP" 6 → 12 Fragen; Stufe 1: 1 → 4, Stufe 2: 2 → 5. Pool 977 → **983**.
#   Vier Antwortmechaniken (Nutzer-Entscheid): bild/mc, bild/dropdown, bild/lueckentext, hotspot.
#   ⚠️ UMFANG NACHGESCHAERFT (Nutzer nach Sichtpruefung der 1. Fassung): die erste Fassung mit
#   6 Kalenderwochen und 3-4 Vorgaengen war ZU DUENN. Verbindlich sind jetzt **mind. 20 Arbeitstage
#   und 8-10 Vorgaenge je Plan**, auch fuer die zwei reparierten Bestandsbilder. Tagesraster mit
#   30 px je Tag, Wochenbaendern und Tagesnummern; Vorgangsnamen in einer linken Spalte.
#   ⚠️ REGEL: KEIN Balken traegt seinen Zeitraum als Text - die Achse ist die einzige Quelle.
#   ⚠️ BESTANDSBEFUND, größer als der Plan: ZWEI DER DREI STUFE-3-FRAGEN WAREN SELBST DEFEKT.
#   M01-481 hatte eine NICHT-LINEARE Achse (15/12/16/14 px je Tag) und Balken, die nicht dazu
#   passten – die Lösung war nur aus dem Textlabel im Balken ablesbar, nicht aus dem Bild.
#   M01-113 nannte „Meilenstein am Tag 7", die Markierung saß bei Tag 5,5 und war ein DREIECK,
#   obwohl M01-960/M09-053 die RAUTE lehren. Beide auf Nutzer-Entscheid mitrepariert.
#   Erzeugt mit tools/r3_2_gantt.py (idempotent; Achse und Balken aus DERSELBEN Rasterfunktion,
#   Abbruch bei zu breitem Vorgangsnamen). NEUE SUITE tests/test_gantt.js (**73**) → **38 Suiten**.
#   13 Gegenproben gefahren, 13 bissen. Alle 37 lauffähigen Suiten selbst gefahren, alle grün.
#   ⚠️ ZWEI LEHREN, beide teuer:
#   (a) **Ein Attributregex ohne Ziffern (`[a-zA-Z-]+`) übersah `x1`/`y2`** – die Gitterliste war
#       leer und ALLE Geometrieprüfungen wären still wirkungslos grün gewesen. Aufgefallen nur,
#       weil die abhängigen Lösungsprüfungen laut fehlschlugen.
#   (b) **Die Geometrieprüfung fand meine EIGENE Achsen-Inkonsistenz nicht** (mittige vs.
#       kantenbündige Tagesbeschriftung in zwei Fragen desselben Moduls) – beide Varianten sind
#       für sich linear. Erst der gerenderte Sichtabzug zeigte es; ebenso kam die Rückmeldung
#       „zu wenige Tage und Vorgänge" erst aus der Sichtprüfung. Zahlen- und Sichtprüfung
#       ersetzen einander NICHT.
#   (c) **Eine Gegenprobe hat eine echte Testlücke aufgedeckt:** die Meilenstein-Raute liess sich
#       durch Aendern NUR des Drehpunkts im transform verschieben, ohne dass der Test anschlug –
#       er rechnete die Position aus x + width/2 des Rechtecks. Test liest jetzt den Drehpunkt.
#   (d) **Zwei stumme Gegenproben lagen an der PROBE, nicht am Test** (Suchmuster traf nicht;
#       eingeschmuggelter Text auf einer y-Koordinate ausserhalb jedes Balkens). Bei einer stummen
#       Gegenprobe zuerst pruefen, ob die Manipulation das Geprüfte ueberhaupt trifft.
#   ⚠️ Ein 13. Gegenprobe-Versuch GRIFF NICHT und meldete „0 Fehler" (FB-R2a-Falle). Die
#       Probe-Funktion prüft jetzt VOR dem Testlauf, dass sich die Datei geändert hat.
# CHECKPOINT 2026-07-22 (R3.5 fertig, KEIN Bump): **MATRIX-INHALTE ÜBERARBEITET.**
#   Alle 25 matrix-Fragen: 106 Elementtexte, 25 Fragetexte, 50 Erklärungen neu
#   (tools/r3_5_matrix.py, selbst geschrieben, KEIN Agenten-Batch).
#   ⚠️ BEFUND ANDERS ALS DER PLANTEXT: nicht die Beispielwerte waren das Hauptproblem, sondern dass
#   **40 % der Elemente die EINSTUFUNG WÖRTLICH nannten** ("sehr unwahrscheinlich, aber
#   existenzbedrohend" bei genau diesen Achsen). Vokabelabgleich statt Beurteilung - dieselbe
#   Fehlerklasse wie das Balkenlabel in M01-481 bei Punkt 2, nur in Textform.
#   MESSWERTE: Bewertungsvokabular 42 -> 0 von 106 · Fragen mit Ziffern 4 -> 24 ·
#   Design-Kleinigkeit als Motiv 5 -> 0 Fragen · Serverraum-Motiv 5 -> 3.
#   Quadranten-Zuordnung (= die fachliche Lösung) unverändert, vorab abgeglichen.
#   NEUE SUITE tests/test_matrix.js (**31**) -> **39 Suiten**. 14 Gegenproben, 14 bissen.
#   ⚠️ DREI LEHREN:
#   (a) **Ich schrieb alle 106 Texte in ASCII-Umschrift**, während 957 von 983 Pool-Fragen echte
#       Umlaute tragen. Die Rückumstellung ist die v1.4.0-Falle in Reinform: ein Regex-Ansatz
#       verrutschte beim Quote-Pairing über die Datei und benannte eine CODE-Variable um.
#       Lösung: Pythons `tokenize` (nur STRING-Token) + Ausnahmeliste (Pool-Feldnamen, die elf
#       etablierten Beispielfirmen, "ue" aus "eu"/"au") + Token-Vergleich als Gegenprobe
#       (2.122 Code-Token vorher wie nachher, keine Abweichung außerhalb von Strings).
#       → **Bei Textumstellungen NIE per Regex über Quotes gehen.**
#   (b) **Zwei Gegenproben deckten echte Lücken im TEST auf:** die Artikel "ein/eine/einen" in
#       meiner Zahlwortliste machten den Wächter "jedes Element trägt eine konkrete Angabe"
#       wirkungslos (jeder deutsche Satz galt als konkret; danach fielen 7 Elemente durch, die
#       tatsächlich keine Angabe trugen); und die Rechtsbezug-Prüfung über JSON.stringify war
#       zahnlos, weil der Paragraf auch in der Erklärung steht.
#       → **Eine stumme Gegenprobe ist zuerst ein Befund über den TEST, nicht über den Pool.**
#   (c) Rechtsbezüge von Hand am Gesetzestext geprüft (Lehre R2b.3): § 87 Abs. 1 Nr. 6 BetrVG,
#       Art. 32 DSGVO (TOM), Art. 33 DSGVO (72-Stunden-Meldefrist). In test_matrix.js verankert.
# CHECKPOINT 2026-07-22: **v1.6.0 IST LIVE UND GETAGGT.** Push vom Windows-Rechner, vom Nutzer
#   bestaetigt; origin/main = e5f3111, refs/tags/v1.6.0 liegt auf demselben Commit (geprueft mit
#   git ls-remote --tags). CI damit komplett gruen - **einschliesslich test_axe**, das lokal seit
#   v1.1.1 nicht fahrbar ist und dessen offene Schuld hiermit beglichen ist.
#   Enthaelt FB-R3 Punkte 2, 3, 4 und 5. APP_VERSION 1.6.0, sw.js ap1-v1.6.0, CHANGELOG-Block
#   ## v1.6.0 vorhanden (die Release-Action liest genau diesen Block; ohne ihn bricht sie ab).
#   Voller Kontrollzyklus vor dem Release: check.sh schnell, alle 38 lauffaehigen Suiten einzeln,
#   Drift-Guard (fragen.js UND faelle.js == pool-Build), Offline-Audit, Sollwert-Abgleich,
#   git status ohne Fremddateien. test_axe laeuft lokal nicht (npm gesperrt) und ist in der CI
#   erstmals seit v1.5.0 wieder dabei - wenn der Tag ausbleibt, ZUERST dort nachsehen.
#   ⚠️ Push geht NICHT aus der Sandbox (Proxy sperrt GitHub, gegengeprueft).
#   ⚠️ Offen beim Nutzer: **Handy-Test von v1.6.0**, besonders die neuen 20-Tage-Balkenplaene
#   (Lesbarkeit am Geraet), die Hotspot-Frage M01-483 mit 8 Klickflaechen und die Netzplan-Seite.
#   Befunde als v1.6.1 nachziehen, nicht in Punkt 6 mischen.
# CHECKPOINT 2026-07-23 (R3.6 fertig, KEIN Bump, NICHT gepusht): **THEMEN-AUSWAHL NEU (AP1/AP2).**
#   Umschalter AP1/AP2/Beide (Default beide) + manuelles Mischen; AP1-Sektion mit eingebettetem
#   Wirtschafts-Chip + M01–M07; AP2-Sektion mit WiSo (M08, sichtbar hierher gerückt: Label „WiSo" +
#   „Wirtschafts- und Sozialkunde (AP2)" + Fragenzahl) und zwei „bald"-Platzhaltern mit Katalog-
#   Fragenkomplexen; 3-Spalten-Raster Desktop / 1 Spalte Handy; „Auswahl zurücksetzen".
#   ⚠️ Reichweite NUR die Üben-Auswahl: NEUER Üben-lokaler Filter S.uebenAP/uebenPasst() – passtAP()/
#   S.inklAP2 (Startseite, Statistik, Relevanz, Simulation) UNVERÄNDERT (Sim-Invariante „nur AP1"
#   bleibt; test_themenauswahl Abschnitt 10 bewacht es). AP2-Struktur aus dem gescannten
#   Prüfungskatalog per Seiten-Rendering verifiziert: 3 AP2-Prüfungsbereiche, der dritte (WiSo)
#   existiert schon als M08. AP2_PLATZHALTER (app_pool.js) so angelegt, dass AP2-Fragen später nur
#   eingefüllt werden. NACHTRAG (Nutzerbefund „AP2 leer"): die 22 AP2-Fragen aus M04 (Subnetting,
#   Datenbanken) sind jetzt als thema-genaue Kacheln in der AP2-Spalte sichtbar (S.ap2Themen +
#   AP2_FACHTHEMEN + themaGewaehlt). NEUE SUITE test_themenauswahl (60) → **40 Suiten**; 5 Gegenproben bissen;
#   alle 39 lokalen Suiten auf Sollwert; Drift 0; check.sh schnell grün; Render-Abzug dem Nutzer
#   vorgelegt. Sechs Nutzer-Entscheide per AskUserQuestion (u. a. „Katalog erst prüfen", „beide",
#   Chip in AP1-Spalte, WiSo mit AP2-Hinweis, Fragenkomplex-Unterthemen, nur Üben). Details im
#   BUILD_LOG-Eintrag vom 2026-07-23. KEIN Bump – Zuschnitt wie Punkte 2–5 (bündeln/release später).
# CHECKPOINT 2026-07-23 – SONDER-TASK „POOL NACH PRÜFUNGSORDNUNG SORTIEREN" (Nutzer-Wunsch,
#   NICHT FB-R3 Punkt 6). KEIN Bump, NICHT gepusht. **Dieser Sonder-Task hat Vorrang vor Punkt 7.**
#   ✅ TAGGING: Feld `gebiet` (A1–A5/B1–B3/M9) an ALLEN 983 Fragen; `modul`/`id`/`thema` unangetastet
#      (IDs M0x-NNN bleiben, validate_pool erzwingt modul==Präfix). Single Source in logik.js:
#      L.GEBIETE/L.THEMA_GEBIET/L.gebietFuer/L.gebietName/L.statProGebiet; validate_pool-Wächter
#      (f.gebiet==Soll, Gegenprobe biss); Schema Pflichtfeld. Jede der 878 Fragen einzeln geprüft.
#   ✅ SORTIERUNG ETAPPE 1: Statistik/Bereitschaft/Serie JE GEBIET (aus T:modul:thema abgeleitet,
#      Buchung unverändert). L.bereitschaft.gebiete; schwaechstesGebiet; test_bereitschaft 31→36,
#      test_unterricht angepasst. ALLE 39 Suiten grün, Drift 0, check.sh schnell grün.
#   ✅ SORTIERUNG ETAPPE 2 (2026-07-23): Üben-Themenauswahl auf GEBIET umgestellt. Neu S.gebiete/
#      S.themen (S.module/S.ap2Themen als Legacy leer, nicht mehr gelesen); themaGewaehlt/kandidaten/
#      genAlsFrage gebiet-basiert; sUeben iteriert L.GEBIETE mit aufklappbaren Gebiets-Blöcken
#      (gespiegeltes „ganzes Gebiet"-Häkchen) + „bald"-Info unter B1/B2 (Nutzer-Entscheide via
#      AskUserQuestion). test_themenauswahl 60→75 (5 Gegenproben bissen), test_wirtschaft 32 /
#      test_adaptiv 49 umgestellt. ALLE 39 Suiten Sollwert, Drift 0, check.sh schnell grün.
#      Details: BUILD_LOG 2026-07-23 (oberster Eintrag). **SONDER-TASK DAMIT KOMPLETT.**
#   ⚠️ Referenz im Projektordner (persistiert): SORTIERUNG_PRUEFUNGSORDNUNG.md (getrackt) +
#      Aufstellung_Themen_nach_Pruefungsordnung.xlsx / themenauswahl_preview.html (.gitignore).
#      Zuordnung ist über L.THEMA_GEBIET reproduzierbar. Lücke: LF 7/10b/11b/12b=0.
# CHECKPOINT 2026-07-23 – **FB-R3 PUNKT 7 (ONBOARDING-TOUR) ERLEDIGT** (KEIN Bump, NICHT gepusht).
#   Tour existierte (6 Schritte) → NEUER Schritt „Werkzeuge & Handy-App" (7). Nutzer-Entscheide:
#   (1) Abruf-Übung wird Voreinstellung (S.abrufAn persistiert, Default true), Umschalter nur noch
#   leise in den Einstellungen; (2) EIN neuer Tour-Schritt. Befund: M09-Klausur war via
#   opts.klausur⇒opts.simulation schon geschützt (redundantes !opts.klausur wieder entfernt).
#   NEUE SUITE test_onboarding (26) → 41 Suiten; test_abruf 18→21; test_hilfe 6→7. 4 Gegenproben
#   bissen. Alle 40 Suiten Sollwert, Drift 0. Details: BUILD_LOG oberster Eintrag.
# CHECKPOINT 2026-07-26 – **FB-R3 IST KOMPLETT. RELEASE v1.8.0 COMMITTET, PUSH BEIM NUTZER.**
#   Punkt 10 fertig (763/763 Erklärungen im Format Kernsatz + Stichpunkte + „Merke:"), Lexikon
#   70 → 112 Einträge, **sieben Sachbefunde korrigiert**, Punkt 9 Teil 1 (Feinthemen sortiert nach
#   Modul, darin alphabetisch, test_themenauswahl 75 → 81), Punkt 8 war bereits gebaut und wurde nur
#   gehärtet (Filter jetzt thema UND modul). Aufräumen erledigt (NAECHSTER_CHAT.md weg, COVERAGE.md
#   21 → 12 KB). Neu: `tools/fakten_check.py` (12 harte Norm-/Rechtszahlen, 0 Verdachtsfälle).
#   Voller Testlauf: **40 von 41 Suiten auf Sollwert, 0 Fehler** (nur test_axe fällt lokal aus,
#   npm 403), Determinismus grün, **Drift 0 für fragen.js UND faelle.js**. Pool unverändert bei
#   983 Fragen + 9 Fällen. APP_VERSION 1.8.0, sw.js ap1-v1.8.0, CHANGELOG-Block v1.8.0.
#   ✅ **GEPUSHT UND BESTÄTIGT 26.07.** („1.8 ist drauf"), Release-Commit 3cc5bdf, Baum sauber.
#   🚩 **QUALITÄTSRUNDE Q1 IST GEPLANT UND FREIGEGEBEN (26.07.) — HIER GEHT ES WEITER.**
#      Vollständiger Plan: **PLAENE.md → „🚩 GESAMTPLAN QUALITÄTSRUNDE Q1"**. Alle Rückfragen sind
#      beantwortet, es ist NICHTS offen. Messwerte: PRUEFBERICHT_2026-07-26.md.
#      Etappen: 0 Wächter+Kleinkram (v1.9.0) → 1 Batch M04/M05/M06 (v1.10.0) → 2 M09 eingliedern
#      ab 01.08. (v1.11.0) → 3 Batch M01/M02/M03/M07/M08 (v1.12.0/v1.13.0) → 4 Stufe-1 44 Fragen
#      (v1.14.0) → 5 A4-Ausbau +18 (v1.15.0) → 6 Stufe 4 + Stufenlücken 23 Fragen (v1.16.0)
#      → 7 Startlast auf dem Gerät messen.
#      **Umfang: 878 Fragen prüfen, 85 neu schreiben, 4 Wächter, 8 Releases.**
#      ⚠️ Die Stufe-1-Lücken sind Etappe 4 und auf **AP1-Gebiete A1–A5 (22 Themen, 44 Fragen)**
#      eingegrenzt — der frühere „26 Themen"-Vermerk ist damit überholt.
#      ⛔ M09 bis 31.07. nicht anfassen (Klausurtermin).
#   ✅ **ETAPPE 0 IST FERTIG (2026-07-27)** – alle sieben Punkte, Details im BUILD_LOG ganz oben.
#      Neue Suite `tests/test_didaktik.js` (**29**, sollwerte.env `didaktik=29`) mit vier Ratschen:
#      längste Antwort 76,3 % (Schwelle 78, Ziel 45) · Stufenlücken 4 (Ziel 0) · kleinstes AP1-Gebiet
#      A4 2,75 % (Schwelle 2,5, nach Etappe 5 auf 5,0) · Abkürzungen ohne Lexikoneintrag 196
#      (Schwelle 196). M06-304 auf ECDHE. COVERAGE.md Abschnitt 2+3 neu erhoben.
#      **41 von 42 Suiten grün** (nur test_axe, npm 403), Drift 0, Pool unverändert 983.
#      ✅ **FREIGEGEBEN 27.07. – Release-Commit 6321d11 liegt LOKAL** (APP_VERSION 1.9.0,
#      sw.js ap1-v1.9.0, CHANGELOG v1.9.0, 24 Dateien inkl. der 17 vom 26.07.). Baum danach sauber.
#      ✅ **GEPUSHT UND BESTÄTIGT 27.07.** („1.9 ist durch"). Offen: Sichtprüfung
#      `m06_304_ecdhe_sichtpruefung.html` (Befund später → v1.9.1, nicht in Etappe 1 mischen).
#   🔄 **ETAPPE 1 LÄUFT.** Reihenfolge auf Nutzer-Entscheid 27.07.: **M05 → M06 → M04**.
#      ✅ **M05 fertig (65 Fragen):** 2 Widersprüche (M05-440 Act/Umsetzen, M05-402 externe
#      Fehlerkosten), 1 Formulierung (M05-707), 4 Sprachfehler; Längenausgleich in 18 mc + 3
#      mehrfach. Poolweit 76,3 % → **69,7 %**, `SCHWELLE_LAENGSTE` 78 → **71**. „IT" ins Lexikon
#      (112 → 113), `SCHWELLE_ABK` 196 → **124**. 41 von 42 Suiten grün, Drift 0, NICHT committet.
#      Abzüge: `m05_befunde.html`, `m05_korrekturen.html`.
#      ✅ **M06 fertig (103 Fragen):** 3× überholte Kryptografie (RSA-2048 → ECDHE, SHA-256 →
#      Argon2id, Hybrid-Erklärung), M06-301 hatte zwei vertretbare Antworten, 6 Sprachfehler;
#      Längenausgleich in 22 mc + 4 mehrfach. **72,7 % → 63,7 %**, Schwelle 71 → **65**.
#      Wächter-Regel `MIN_OPTIONSLAENGE = 25` neu (Kurzoptionen zählen nicht mehr), Suite 29 → 32,
#      sollwerte.env `didaktik=32`. Abzüge: `m06_befunde.html`, `m06_korrekturen.html`.
#      ✅ **M04 fertig (179 Fragen):** **erste falsch markierte Antwort der Runde** (M04-107,
#      switch → if-else-if, loesungIndex getauscht), M04-501 widersprach sechs anderen Fragen,
#      6 weitere Befunde; Längenausgleich in 31 mc + 2 mehrfach. **63,7 % → 50,6 %**, Schwelle → 52.
#      20 Schreibtischtests, 15 Subnetting-Aufgaben und 60 Konsolenbefehle selbst nachgerechnet: ohne Befund.
#   ✅ **ETAPPE 1 KOMPLETT (347 Fragen).** Release **v1.10.0 vorbereitet** – APP_VERSION 1.10.0,
#      sw.js ap1-v1.10.0, CHANGELOG. 41 von 42 Suiten grün, Drift 0. **NICHT committet, NICHT gepusht.**
#   ✅ **FREIGEGEBEN 27.07. – Release-Commit 61ced9a liegt LOKAL.** Baum sauber. NICHT GEPUSHT.
#   ✅ **ETAPPE 4 ERLEDIGT (27.07., vorgezogen):** 44 Stufe-1-Einstiegsfragen für 22 Themen.
#      Pool **983 → 1027**, Stufe 1 **132 → 176**, Feinthemen ohne Stufe-1-Einstieg **26 → 4**.
#      Längen-Tell **50,6 % → 45,6 %**, `SCHWELLE_LAENGSTE` 52 → **47**. COVERAGE.md nachgezogen.
#      41 von 42 Suiten grün, Drift 0, KEINE Sollwert-Änderung nötig. **NICHT committet.**
# ►►► NÄCHSTER TASK: **Push von v1.10.0 durch den Nutzer** (Windows-Rechner) bestätigen lassen,
#     dann Freigabe für die Etappe-4-Fragen (Release **v1.11.0**) einholen.
#     Danach: **Etappe 5 (A4-Ausbau, +18 Fragen)** – ebenfalls ohne M09. **Etappe 2 (M09) bleibt
#     bis 31.07. GESPERRT.** Verfahren steht in PLAENE.md: markierte Antwort
#     verifizieren · Distraktoren prüfen · **Distraktorlängen angleichen, NIE die richtige Antwort
#     kürzen** · Erklärung gegenhalten. Befunde je Modul SAMMELN und vorlegen, nicht einzeln
#     korrigieren. Nach jedem Modul die Schwelle des Längen-Wächters auf Istwert + 1 senken.
#     ⚠️ Beim Angleichen auf **Gleichstand ±15 %** zielen, nicht auf längere Distraktoren – sonst
#     entsteht der umgekehrte Tell, den der Wächter NICHT meldet (Lehre aus M05).
#     Nebenbei einmal anbieten: **Handy-Test für v1.8.0** (alle Erklärungen und die
#     Themen-Reihenfolge haben sich sichtbar geändert). FB-R3 hat keinen offenen Rest. ◄◄◄
Dieses Briefing ist so geschrieben, dass JEDES Modell in einem NEUEN Chat nahtlos weiterarbeiten kann.
Einstieg: (1) diesen Block + Abschnitt **7-PLAN2** (verbindlicher Gesamtplan der 29 Ideen, G1–G5, alle Nutzer-Entscheide)
+ PLAENE **„AP2-G2"** (G2-Detailplan) lesen, (2) BUILD_LOG.md nur die jüngsten 2026-07-19er G2-Einträge
(Älteres in BUILD_LOG_ARCHIV.md – NICHT lesen, außer gezielt nötig), (3) mit GRUPPE G3 in
Abschnitt 7-PLAN2 weitermachen. Der alte 5-PLAN (T–F) ist erledigte Historie. Detailpläne: PLAENE.md – pro Task NUR
den betreffenden Abschnitt; **AP2-G3 bis AP2-G5 existieren noch NICHT** und sind bei Gruppenbeginn anzulegen.
⚠️ INHALTE NIE DIREKT EDITIEREN: fragen.js UND faelle.js werden aus pool/*.json gebaut (`python3 build_fragen.py`);
beide haben einen Drift-Guard in check.sh. ⚠️ TOOLING: .tooling/jsdom hängt beim require → jsdom-Suiten über frische /tmp/jt fahren
(npm i jsdom; NODE_PATH=/tmp/jt/node_modules; test_timer als Boot-Probe). `bash check.sh schnell` läuft ohne jsdom.
NUTZER-ARBEITSWEISE (verbindlich): nach JEDEM Task pausieren und auf Rückmeldung/Fortsetzung warten.
⚠️ PUSH NUR AUF AUSDRÜCKLICHE FREIGABE (Nutzer 2026-07-21, nachdrücklich wiederholt). Eine Freigabe
gilt für GENAU EINEN Release, nicht dauerhaft. Fertige Versionen bleiben lokal liegen; alles andere
(Version, CHANGELOG, BUILD_LOG, Tests) wird normal abgeschlossen.
FIXPUNKTE (Nutzer 2026-07-15): AP1-PRÜFUNG = MITTWOCH, 24.02.2027. Fortschritts-Export/Import =
ENDGÜLTIG GESTRICHEN (nicht erneut anbieten). PWA = GitHub Pages, ganz am Ende (Phase F).

## 0. MODELL & AGENTEN (verbindlich ab 2026-07-15, Opus-Betrieb)
- HAUPTMODELL: Opus. Macht NUR: Briefing lesen, Agenten anleiten, Integration, fachliche Prüfung,
  Tests ausführen, Checkpoints. Opus schreibt selbst Code nur bei Eingriffen <~50 Zeilen.
- AGENTEN-MATRIX (immer das billigste ausreichende Modell):
  * Inhalte/Fragen-Batches nach Template (prompts/fragen_batch.md): HAIKU-Agent. Muss
    tools/validate_batch.js selbst grün liefern (Self-Grade); Opus prüft danach NUR fachlich.
  * Code-Entwürfe mit Kontextverständnis (Features/Refactorings, prompts/feature_draft.md,
    prompts/fragetyp_neu.md): SONNET-Agent auf /tmp-Kopien, NIE auf Projektdateien.
  * Recherche (Web/PDF lesen): billigster Agent, liefert nur das Extrakt, nie Volltext-Dumps.
  * Verifikation ist NIE Agentensache: Opus führt alle Suiten selbst aus und liest jeden Diff.
- RÜCKFRAGE-PFLICHT (gilt in JEDEM Chat, auch künftigen): Bei jeder Unklarheit, jedem Widerspruch
  zwischen Doku und Code, jeder Design-/Umfangs-Entscheidung mit mehreren sinnvollen Optionen →
  Nutzer per AskUserQuestion fragen (Fragen bündeln, bis 4 pro Runde). NIE eigenmächtig entscheiden,
  NIE stillschweigend vom Plan abweichen. Kontrolle statt Vertrauen – auch gegenüber der eigenen Annahme.

## 1. Arbeitsweise (verbindlich, vom Nutzer vorgegeben)
- Entwürfe (Inhalte/Code) durch Subagenten laut Agenten-Matrix (Abschnitt 0); Hauptmodell macht nur
  Anleitung, Integration, Qualitätskontrolle. AUSNAHME: kleine Eingriffe (<~50 Zeilen) direkt selbst –
  Agent-Overhead wäre teurer. Agenten arbeiten NUR auf /tmp-Kopien, nie auf Projektdateien.
- NICHTS ungeprüft übernehmen: jeden Agenten-Entwurf selbst fachlich prüfen (nachrechnen, Zitate checken,
  Diff lesen) und alle Tests SELBST ausführen, bevor ein Task als fertig gilt.
- Bei JEDER Entscheidung mit mehreren sinnvollen Optionen (Design/Umfang/Formulierung): Nutzer VORHER
  per AskUserQuestion fragen. Keine eigenmächtigen Entscheidungen.
- Loop je Task: umsetzen → selbst prüfen → TASKLIST + BUILD_LOG aktualisieren (Checkpoint, damit bei
  Abbruch nahtlos fortgesetzt werden kann) → BEI FEATURE-MEILENSTEIN: APP_VERSION-Bump (app_state.js,
  SemVer) + CHANGELOG.md-Eintrag → START_PROMPT.md auf den nächsten Task setzen → PAUSIEREN.

## 2. Ist-Zustand der App (verifiziert 2026-07-15, alle 20 Suiten grün, backup_2026-07-15.zip)
- Dateien: lernprogramm_ap1.html (53 Z. Markup; lädt styles.css + logik/fragen/faelle/spickzettel/
  abkuerzungen.js + 11 app_*.js in LADEREIHENFOLGE state→pool→util→ui→frage→glossar→loeser→verbuchen→seiten→sim→pages2 (R7),
  logik.js (974 Z., Node+Browser, inkl. #79-Registry L.TYP + L.grade), fragen.js (GENERIERT aus
  pool/*.json via `python3 build_fragen.py` – NIE direkt editieren!), faelle.js, spickzettel.js,
  abkuerzungen.js; Tests in tests/ (20 Suiten + _harness.js), Werkzeuge in tools/, Vorlagen in prompts/.
- Suiten-Sollwerte (alle grün 2026-07-16; Single Source = sollwerte.env, 21 Suiten): logik 2162, registry 118,
  engine 70, diagnose 76, state 25, meta 75, timer 18, markiert 18, zurueck 19, swipe 11, zoom 18, abruf 18,
  fokus 15, melden 19, glossar 24, abk 20, teilpunkte 19, a11y 25, hilfe 21, robust 24, bereitschaft 31.
  (Stand G1: +render_smoke 21 (G1.2), +axe 5 (G1.5), +pwa 22 (G1.6) → 24 Suiten; Single Source = sollwerte.env.)
  (registry/meta durch C4 #50 szenario2 erhöht: 114→118, 72→75.)
- Pool: 809 Fragen (Stand nach C4 #50: +6 szenario2 in pool_m_szenario2.json), 21 Fragetypen (L.TYP; +szenario2), 73 kanonische Themen (= exakt die Keys von L.THEMA_RELEVANZ in logik.js),
  Prüfungsteil-Regel: Subnetting/ER-Modell/M08-WiSo = "AP2", Rest "AP1".
- State: STATE_VERSION 5, zentrale migriereState() in der HTML (VOR `var S = ladeState()` initialisiert –
  Hoisting-Bug wurde behoben, nicht wieder einführen!). v5-Felder bereits angelegt (KEINE Migration mehr
  nötig für kommende Features): markiert{}, simDauerMin:90, fokus:false, meldungen{},
  relevanzGewichtung:true, farbsymbole:false, ariaAltTexte:false, onboardingDone:false, typHilfeAus{}.
- Gewichtungs-Engine (A3): logik.js L.THEMA_RELEVANZ/L.gewichteFrage/L.pickGewichtet, L.deckPick hat
  optionalen 6. Param gewichtFn; HTML: gewichtsKontext(), anzahlBeantwortet(), Session-Vars
  letzteThemen/themenSerie, naechsteFrage nutzt gewichtete Ziehung, Toggle in sEinstellungen.
- Diagnose (A4): zeigeDiagnose(c,f,typ,info) + 6 Call-Sites in loeseFrage (mc/mehrfach/dropdown/
  rechenassistent/kalkulation/trace), Guard `!korrekt && !opts.simulation`.
- 18+ Fragetypen, 12 Routen (start ueben fd gen netzplan gantt sim glossar spickzettel serie stat einst).

## 3. Prüfprotokoll je Task (Pflicht, alles selbst ausführen)
- Pool-/Inhalts-Tasks: `python3 build_fragen.py && node test_logik.js` (im Training-Ordner, bash).
- App-/Code-Tasks: frische Kopien nach /tmp (Fallstricke s. Abschnitt 4!), dann:
  Inline-JS-Syntax: script-Block per Python-Regex `<script>(.*?)</script>` extrahieren → `node --check`.
  jsdom: `JSDOM.fromFile('/tmp/app.html',{runScripts:'dangerously',resources:'usable',pretendToBeVisual:
  true,beforeParse(w){w.confirm=()=>true;w.alert=()=>{};/*localStorage-Stub s.u.*/}})` + ~2,5 s warten.
  localStorage unter file:// wirft → Stub via Object.defineProperty(w,'localStorage',{configurable:true,
  value:{getItem,setItem,removeItem,_store}}) in beforeParse. NIE Skripte per w.eval laden ("use strict"
  macht top-level var dann eval-lokal, S bleibt undefined) – immer fromFile mit echten script-Tags.
- Suiten: `bash check.sh` (Auto-Glob über tests/test_*.js: test_logik 2162, test_engine 70,
  test_diagnose 76, test_state 23) – alle müssen grün bleiben; neue Feature-Tests als tests/test_*.js
  anlegen (nutzen tests/_harness.js: boot(preState)→window, t/close/within, report()→process.exit).
- Offline-Audit: `grep -n "http\|cdn" lernprogramm_ap1.html` → nur w3.org-SVG-Namespaces sind erlaubt.
- Bei neuen Fragen zusätzlich: fachliche Einzelprüfung JEDER Frage (nachrechnen/Fakten), kanonisches
  thema, pruefungsteil-Regel, keine ID-Kollision, Duplikat-Scan läuft in test_logik mit.

## 4. Tooling-Fallstricke (kosten sonst Stunden!)
- MOUNT-TRUNCATION (Top-Zeitfresser, 20+ Vorkommen): Nach File-Tool-Edits zeigt der bash-Mount die Datei oft
  ABGESCHNITTEN (Ende fehlt), teils Minuten lang; auch mehrfach editierte Dateien einer Session gleichzeitig.
  NEU (2026-07-13): `check.sh` hat jetzt AUTO-WAIT – der Mount-Gate (Abschnitt 0) pollt Datei-Enden bis ~40s
  statt sofort abzubrechen (Fast-Path ohne Delay im Normalfall). Daher meist KEINE Handarbeit mehr nötig:
  einfach `bash check.sh` laufen lassen; wenn nach 40s immer noch stale, hilft ein Workspace-Neustart (danach
  Mount i.d.R. vollständig). NEU (2026-07-15): `bash verify.sh` umgeht den Lag ganz – Suiten laufen gegen eine
  native /tmp-Kopie (setup→sync/python-Patch→run), nie gegen den stalen Mount. Details in Abschnitt 5b. Manuelle Prüfung weiterhin: `tail -c 30 app.js | grep render()` /
  `tail -c 80 logik.js | grep v3.3` (HTML: `</html>`, fragen.js: `module.exports = FRAGEN;`).
  Nur als Notnagel, wenn Neustart nicht geht: fehlendes Ende via Read-Tool holen und in mktemp-Workdir
  rekonstruieren (`head -n X <mount-datei> > $W/datei` + echten Tail als heredoc; Nahtstelle auf doppelte/
  fehlende Zeile prüfen) – EINDEUTIGE Erfahrung: Mount-Head hat die Edits, nur der Tail fehlt.
- /tmp wird bei Workspace-Neustarts GELEERT. NEU (2026-07-13): jsdom liegt jetzt PERSISTENT in `.tooling/`
  (gitignored); `check.sh` nutzt `NODE_PATH=.tooling/node_modules` mit /tmp-Fallback → kein Reinstall mehr
  nach Neustart. Einmalig neu aufsetzen falls .tooling fehlt: `npm install jsdom --prefix .tooling`.
- Encoding: Kernfiles sind valides UTF-8. `file`/`grep` melden im C-Locale fälschlich „binary" (Umlaute/–);
  check.shs Offline-Audit nutzt daher `grep -oa` (Text-Modus erzwungen), damit UTF-8-Dateien nicht als binary
  behandelt werden und Treffer nicht verschluckt werden.
- Projektdateien IMMER über das File-Tool (Windows-Pfade %USERPROFILE%\Claude\Projects\Training\...)
  editieren. Ausnahme: pool/*.json-Massenänderungen per python3 direkt auf dem Mount funktionieren.
- NEU (2026-07-15) bash-Aufrufe haben 45s-LIMIT: voller check.sh passt nicht in einen Aufruf. Praxis:
  `bash check.sh schnell` (1 Aufruf) + jsdom-Suiten PAARWEISE im mktemp-Workdir (je Paar 1 Aufruf,
  `timeout 20 node test_X.js`, NODE_PATH=<Training>/.tooling/node_modules, HTML als app.html kopieren).
  Hintergrund-Prozesse (nohup/&) STERBEN am Aufruf-Ende – nicht verwenden.
- NEU (2026-07-15) Marker-Check: `tail -c 120 logik.js | grep v3.3` (80 Bytes sind ZU KURZ, letzte
  Zeile ist ~97 Bytes → False-Negative).
- NEU (2026-07-15) Mount-Konsistenz-Verfahren (wenn Auto-Wait nicht reicht): Workdir-Rekonstruktion
  (Mount-Head bis zur Abbruchzeile + echten Tail via Read-Tool) → node --check + betroffene Suiten
  grün → DANN darf die Rekonstruktion per `cp` über die Mount-Datei (Inhalt == Host-Stand; NIEMALS
  den stalen Mount-Stand selbst zurückschreiben).
- Tabellen-DOM: NIE el("<tr>...") – HTML-Parser verwirft tr/td außerhalb von table (liefert null).
  Immer document.createElement für tr/td/th (bekannter, zweimal gefixter Bug).
- In fragen.js: mehrfach nutzt `loesungIndizes` (nicht loesung); mc nutzt `loesungIndex`;
  Thema-Statistik-Keys: S.statistik["T:"+modul+":"+thema].

## 5-PLAN. GESAMTPLAN ab 2026-07-15 (verbindlich, Nutzer-Entscheid: „Technik zuerst")
Prüfung: Mi 24.02.2027 (~7,5 Monate) → voller Plan realistisch. Reihenfolge FIX, Detailpläne je Task
in PLAENE.md (Abschnitte „T1"–„F3"). Je Task gilt: Agenten-Matrix (Abschn. 0), Prüfprotokoll (Abschn. 3),
Checkpoint + Pause. Bei Refactorings (Phase T): Vorher/Nachher ALLE 20 Suiten identisch grün.

**PHASE T – Technik / Block E-Rest** (sauberes Fundament, macht Phase C billiger)
- T1 #78 Renderer-Registry [FERTIG 2026-07-15; R_TYP-Registry in app_loeser.js, alle 20 Suiten grün]
- T2 #84 Inline-Styles → CSS-Klassen [FERTIG 2026-07-15; 135 statische Styles → 67 .u-Utilities;
  54 bewusst inline (Spezifitätskonflikt/display:none, s. T2_RESTLISTE.md); 0 visuelle Änderung (jsdom-
  computedStyle-Differential) + alle 20 Suiten grün]
- T3 #85 TEXTE-Zentralisierung [FERTIG 2026-07-15; 333 UI-Strings → var TEXTE (279 Keys) in app_util.js,
  strukturiert nach Feature; lokal belassen dokumentiert (T3_TEXTE.md); 0 Wortlaut-/Verhaltens-/Optik-
  Änderung (Rück-Substitution byte-identisch) + alle 20 Suiten grün]
- T4 #83 CONFIG-Konstanten [FERTIG 2026-07-15; L.CONFIG (14 Keys) in logik.js + APP_CONFIG (6 Keys) in
  app_state.js; alle Werte byte-identisch; alle 20 Suiten identisch grün]
- T5 #82 State-Kapselung [FERTIG 2026-07-15; setS/mutS in app_state.js (persist-Flag), ~35 direkte S.x=…-Writes
  in 7 Modulen gekapselt, Lesen bleibt S.x, transiente Writes persist:false; 20 Suiten grün + LS-Roundtrip 9/9;
  nur S=defaultState() inline. Mount-Lag: gegen verify/-Rekon getestet, voller check.sh+Backup nach Neustart offen]
- T6 #96 Version/Changelog [FERTIG 2026-07-15; var APP_VERSION="0.1.0" (SemVer, Single Source of Truth) in app_state.js;
  Anzeige klein/zentriert unten in sEinstellungen (app_pages2.js); TEXTE.einstellungenSeite.versionLabel (app_util.js);
  neue CHANGELOG.md (v0.1.0). Nutzer-Entscheid Start 0.1.0. 20 Suiten grün, Offline 0, Render-Smoke ok, keine sonstige
  Funktions-/UI-Änderung]. #86 ENDGÜLTIG GESTRICHEN (durch S1 obsolet: Pool bereits konsolidiert).
  → PHASE T KOMPLETT. NÄCHSTER TASK: L1 G1 Bereitschafts-Score (PLAENE „L1"; VORAB Ampel-Schwellen fragen).

**PHASE L – Lernnutzen** (nach T; Reihenfolge L1→L4)
- L1 G1 Bereitschafts-Score [FERTIG 2026-07-15; L.bereitschaft(statistik) in logik.js (gewichteter Mittel der
  Themen-Quoten, Gewicht=THEMA_RELEVANZ, NUR geübte Themen – Nutzer-Entscheid) + L.ampelFuer/BEREITSCHAFT_AMPEL
  (60/80); Panel in sStatistik + Zeile in sStart (immer) + TEXTE.bereitschaft. tests/test_bereitschaft.js (31).
  Alle 21 Suiten grün, Offline 0. NÄCHSTER: L2]
- L2 G3 Lernplan aus Prüfungsdatum [ENDGÜLTIG GESTRICHEN 2026-07-15 (Nutzer-Entscheid) – nicht mehr anbieten;
  Prüfungsdatum-Feld bleibt nur für Countdown-Anzeige, keine Lernplan-Logik]
- L3 A7 #71 Transferaufgaben [FERTIG 2026-07-15; 20 Fragen (13 mc+7 mehrfach) in pool/pool_m_transfer.json,
  8 Themenpaare gekoppelt (M01/M02/M03/M05/M06/M07), alle AP1, von Opus entworfen+fachl. geprüft; build 769,
  test_logik 2162, validate_pool/idcheck sauber, Self-Grade 20/20. NÄCHSTER: L4]
- L4 A7 #74 Diagramm-Aufgaben + #75 Englisch [FERTIG 2026-07-16: Nutzer-Entscheide 8+8, Mix Netzplan/
  Verkabelung/Rack, beide zusammen. pool/pool_m_l4.json (16): 8 SVG-Diagramme (4 hotspot+4 beschriftung,
  M01-990..992, M03-990..994; Sonnet-Entwurf, Rechenwerte von Opus nachgerechnet, SVG-Formel-/Summen-Leaks
  + Label-Giveaway entfernt) + 8 Englisch (M02-950..957, 5 mc+3 mehrfach; Haiku-Entwurf, 3 fachliche Fehler
  von Opus korrigiert). build 785, validate_pool/idcheck sauber, test_logik 2162, check.sh schnell GRÜN.
  → PHASE L KOMPLETT. NÄCHSTER: R8]

**PHASE R – Review-Fixes** (3 Analysen 2026-07-15; Detailpläne PLAENE „R1"–„R11".
STAND 2026-07-16: PHASE R KOMPLETT – R1–R11 + L4 alle FERTIG. NÄCHSTE PHASE: C (C1 = #101 mtf).)
- R1 Instanziierungs-Kopie-Bug [FERTIG 2026-07-16: Option (a) zentral – L.instanziiere liefert IMMER Kopie
  (falsy bleibt falsy für #91-Guard); test_zurueck +3 (=19, sollwerte.env), alle 21 Suiten grün, Offline 0]
- R2 localStorage-Fehler sichtbar machen [FERTIG 2026-07-16: Flags LS_LADE/SPEICHER_FEHLER (app_state),
  fixierter Banner oben auf jeder Seite (Nutzer-Entscheid; lsFehlerBanner in render(), role=alert),
  TEXTE.fehler+2, styles .lsbanner; test_robust +5 (=21). Speichern-Erfolg setzt Flag zurück.]
- R3 Sim-Timer wanduhrbasiert [FERTIG 2026-07-16: restSek = dauerMin*60 − floor((Date.now()−startTs)/1000)
  im Interval-Callback (app_sim); Sonnet-Entwurf, Opus-geprüft; test_timer +3 (=18, Date.now-Mock).]
- R4 esc() Single-Quote-Härtung [FERTIG 2026-07-16: esc() + .replace(/'/g,"&#39;") (app_util.js);
  test_robust +1 (=22, sollwerte.env). Alle 21 Suiten grün (inkl. glossar/Apostroph-sensibel), Offline 0.]
- R5 State-Hygiene [FERTIG 2026-07-16: sanitizeState(poolIndex,s) PURE in app_state.js (Kopie, Kriterium
  streng !POOL_INDEX[id], AP2 bleibt; simUsedIds/meldungen unangetastet) + stateHygiene-IIFE Ende app_pool.js
  (Sicherheitsnetz POOL.length>0 && !POOL_FEHLER.length, Anwendung via mutS) + migriereState-Early-Exit bei
  version===STATE_VERSION. test_state +2 (=25, sollwerte.env). Alle 21 Suiten grün (verify.sh, Mount stale),
  Offline 0. Opus direkt (<50 Z.).]
- R6 Abruf-Übung: Typ-Hilfe nicht mitverdecken [FERTIG 2026-07-16: Guard in abrufVerdecken (defensiv –
  aktuell hat kein Abruf-Typ eine TYP_HILFE, Befund war theoretisch); test_abruf +1 (=18).]
- R7 app_loeser.js-Split Glossar/Renderer/Verbuchung [FERTIG 2026-07-16: byte-identisch (cat TOP+GLOS+MID+VERB
  == Original, diff leer am Mount) in app_glossar.js (metaTags+Tooltip-Glossar) + app_loeser.js (R_TYP+loeseFrage+
  abruf) + app_verbuchen.js (verbucheAntwort+zeigeLevelDialog); je eigenes "use strict" (Nutzer-Entscheid).
  HTML: frage→glossar→loeser→verbuchen→seiten. check.sh Marker/node-check/Copy +2, verify.sh MODULE 14→16,
  FUNCTIONS.md regeneriert, ARCHITECTURE.md-Modulkarte nachgezogen. Alle 21 Suiten grün (Sollwerte unverändert),
  Offline 0, kein Version-Bump (Refactoring). → PHASE R KOMPLETT.]
- R8 CHANGELOG/Versions-Prozess [FERTIG 2026-07-16: APP_VERSION 0.1.0→0.2.0 (app_state.js:6); CHANGELOG.md
  v0.2.0-Block oben (Bereitschafts-Score, +20 Transfer, L4, R1–R3-Fixes, Version in Einstellungen); Bump-Regel
  in Task-Loop (Abschn.1) verankert. node --check + check.sh schnell GRÜN, „0.2.0" nur Code+CHANGELOG. Doku-Task.]
- R9 README-Sync [FERTIG 2026-07-16: README.md komplett neu (Haiku-Entwurf, Opus-korrigiert: sollwerte.env-
  Ort, keine driftenden Hard-Werte, Teilpunkte-/Ampel-Regeln präzise). Doku-Task, keine Suiten.]
- R10 A11y-Feinschliff [FERTIG 2026-07-16: (a) chipTastatur(el) in app_util.js (tabindex=0/role=button/
  onkeydown Enter+Space→onclick, leak-frei via Zuweisung) an 13 Stellen in app_loeser.js (zuordnung/matrix/
  beschriftung/baukasten-Chips+Slots+Zonen, hotspot-rects, fehlersuche-Zeilen); (b) fbHost aria-live=polite +
  fehlerbanner role=alert (app_seiten); (c) :focus-visible global (styles.css); (d) Nummerierungs-Spans
  gelb-hover→var(--text2) (3 Stellen). test_a11y +4 (=25, sollwerte.env). Alle 21 Suiten grün, Offline 0.]
- R11 Datumsformat TT.MM.JJJJ [FERTIG 2026-07-16: datumDE(key) in app_util.js (Regex, Fremdwerte
  unverändert durch); 3 Anzeige-Stellen umgestellt (app_sim:94/97 Sim-Historie+Trend-title, app_seiten:106
  Aktivitäts-Tooltip). Schlüssel (dailyCounts/serieDone/dayKey), pruefungsdatum-Input (ISO) und meldungen
  (bereits de-DE) UNVERÄNDERT. test_robust +2 (=24, sollwerte.env). Alle 21 Suiten grün, Offline 0.]

**PHASE C – Neue Fragetypen** (Rezept prompts/fragetyp_neu.md; Entscheid gilt: Teilpunkte anzeigen,
„richtig" nur bei 100 %; dank #78/#79 je Typ: L.TYP-Eintrag + Renderer-Registry-Eintrag + Inhalte)
- C1 #101 mtf [FERTIG 2026-07-16: neuer Typ „mtf" (Multiple-True-False). logik.js gradeMtf (bool=100 %,
  Nutzer-Entscheid) + mtfTreffer (Anzeige) + Validierung + Registry {simAuto:false,120,2}; R_TYP.mtf in
  app_loeser.js (2 Schalter/Aussage, ALLE Pflicht, Teilpunkte-Anzeige, chipTastatur); styles .mtf-*; TEXTE
  mtf*. pool_m_mtf.json = 6 Fragen (M03-930/931,M04-920,M06-940/941,M07-930; fachl. geprüft). build 791.
  mtf-Render-Smoke 12/12 + alle 21 Suiten grün; sollwerte registry 106→110, meta 66→69; APP_VERSION 0.3.0.]
- C2 #103 kreuztabelle [FERTIG 2026-07-16: neuer Typ „kreuztabelle" (Raster ankreuzen). logik.js gradeKreuztabelle
  (bool=100 %, Nutzer-Entscheid) + kreuztabelleTreffer (Anzeige) + Matrix-Validierung + Registry {simAuto:false,120,2};
  R_TYP.kreuztabelle in app_loeser.js (Tabelle ZWINGEND document.createElement für tr/th/td, Toggle-Buttons aria-pressed
  +chipTastatur, Prüfen ab ≥1 Kreuz, Teilpunkte-Anzeige, kt-soll/kt-fehlt/kt-zuviel); styles .kt-*; TEXTE kreuztabelle*.
  pool_m_kreuztabelle.json = 6 Fragen (M03-932/933,M06-942,M07-931,M01-954,M04-921; fachl. geprüft). build 797.
  Render-Smoke 55/55 + alle 21 Suiten grün; sollwerte registry 110→114, meta 69→72; APP_VERSION 0.4.0.]
- C3 #102 lueckenkette [FERTIG 2026-07-16: dropdown-Typ ERWEITERT (Nutzer-Entscheid, kein neuer Typ) um
  Freitext-Modus, pro Aufgabe umschaltbar. logik.js gradeDropdownText + dropdownAkzeptiert (Toleranz wie
  gradeLuecke) + Validierung optional f.freitext/luecken[].akzeptiert; R_TYP.dropdown mit Umschalt-Button
  (Freitext=input.luecke/gradeDropdownText, Auswahl=selects/gradeDropdown+Diagnose); TEXTE alsAuswahl/alsFreitext/
  lueckenketteFreitext. 6 Fragen freitext:true (M03-934,M06-943,M04-922,M01-955,M07-932,M05-952). build 803.
  Smoke 44/44 + alle 21 Suiten grün (sollwerte UNVERÄNDERT – kein neuer Typ); APP_VERSION 0.5.0.]
- C4 #50 szenario2 [FERTIG 2026-07-16: neuer Typ „szenario2" (2-Schritt-Entscheidungen). logik.js gradeSzenario2
  (antwort {s1,s2}; „richtig" nur wenn BEIDE Schritte korrekt – Nutzer-Entscheid) + szenario2Treffer (0..2, Anzeige)
  + Validierung (schritt1/schritt2 mit frage/optionen≥2/loesungIndex, feedback1 je Schritt-1-Option) + Registry
  {simAuto:false,120,2}; R_TYP.szenario2 in app_loeser.js (Situation=frage links; Schritt-1-Buttons → Konsequenz-
  Feedback + Schritt-2-Buttons erscheinen; Prüfen erst wenn BEIDE gewählt; Scoring „X/2 Schritte richtig (P %)"
  analog mtf/kreuztabelle – Nutzer-Entscheid; chipTastatur; .opt richtig/falsch). styles .sz-*; TEXTE szenario2*.
  pool_m_szenario2.json = 6 Fragen Rhaus-Metall (M04-923 Szenarien Rhaus, M04-924 APIPA-Diagnose, M06-944 Phishing,
  M06-945 Datenschutzvorfall 72h, M07-933 Mängelrüge/Nacherfüllung, M01-956 Ticket-Prio/Eskalation; jede fachl.
  geprüft). build 809. szenario2-Render-Smoke 12/12 + alle 21 Suiten grün; sollwerte registry 114→118, meta 72→75;
  APP_VERSION 0.6.0. MOUNT-LAG massiv (logik/app_loeser/app_util/styles bash-seitig truncated) → Verifikation via
  /tmp-Rekonstruktion (Host=Wahrheit). → PHASE C KOMPLETT. NÄCHSTER: PHASE F, F1.]

**PHASE F – PWA über GitHub Pages** (Nutzer-Entscheid 2026-07-15; Doppelklick-Betrieb bleibt Invariante)
- F1 GitHub-Repo + Pages einrichten [IN ARBEIT – bereit zum Ausführen im NEUEN Chat. STAND 2026-07-17:
  Voll-Check GRÜN (21 Suiten auf Sollwert), Backup backup_2026-07-16g.zip gezogen (behalten e/f/g). GitHub-Connector
  vom Nutzer eingerichtet (Endpoint api.githubcopilot.com), aber die laufende Session hat ihn nicht mehr übernommen
  (MCP-Bindung nur bei Session-Start) → im frischen Chat ToolSearch „github" prüfen, dann F1 ausführen.
  Nutzer-Entscheide 2026-07-16: (a) Repo ÖFFENTLICH (public, nötig für gratis Pages), (b) Name „ap1-lernprogramm",
  (c) Upload-Weg = GitHub-Connector (in claude.ai-Einstellungen autorisieren; KEINE Tokens im Chat) → Repo-Anlage +
  Push in FOLGE-Session, sobald Connector verbunden. VORBEREITET: verifiziertes Pages-Paket (nur Runtime-Dateien aus
  /tmp-Rekonstruktion = Host-Wahrheit) → outputs/ap1-lernprogramm_pages.zip (20 Dateien: html+css+logik/fragen/faelle/
  spickzettel/abkuerzungen+11 app_*.js + README/CHANGELOG; node --check 0 Fehler, Boot-Smoke jsdom 0 JS-Fehler,
  Pool 809/21 Typen/v0.6.0/Render ok, offline-clean – einzige http-URL ist fiktiver Fragetext wiki.rhaus-metall.local
  in fragen.js, keine Ressource). NÄCHSTE Session nach Connector-Auth: (1) frischer Mount + check.sh grün, (2) Repo
  ap1-lernprogramm (public) via GitHub-Connector anlegen, (3) Runtime-Dateien pushen (Exclude: *.zip/*.pdf/.tooling/
  .git/ziOrM0Wa + Kursmaterial 00–07_*.md + 99_Spickzettel.md; spickzettel.js BEHALTEN; pool/tools/tests optional als
  Quelle), (4) Pages auf main/root, (5) Nutzer testet am Handy (Laden + LocalStorage). PLAENE „F1".]
- F2 manifest.webmanifest + sw.js + Icons + iOS-Meta [FERTIG 2026-07-18: manifest.webmanifest (start_url ".",
  scope ".", display standalone, theme/background #15171C, Icons icon-192/512.png „any maskable" – Nutzer-Entscheid:
  schlichtes „AP1"-Textlogo gelb #F4C20D auf dunkel, PNG maskable safe-zone, per PIL erzeugt) + sw.js (Cache-First,
  CACHE_VERSION „ap1-v0.7.0", activate-Cleanup, fetch nur GET, navigate-Fallback lernprogramm_ap1.html; APP_FILES = 24
  Einträge inkl. "."/index.html + alle 16 Runtime-JS/CSS/HTML + manifest + 3 Icons). HTML-Head: link rel=manifest,
  theme-color, mobile/apple-mobile-web-app-capable, apple-mobile-web-app-status-bar-style/-title, apple-touch-icon-180.png,
  icon-192.png. SW-Registrierung als GUARDED Inline-Script am Body-Ende: nur wenn 'serviceWorker' in navigator &&
  location.protocol startet mit "http" → file://-Doppelklick still übersprungen (Invariante gewahrt). VERIFIZIERT:
  node --check sw.js + inline-Block, manifest-JSON valide, Cache-Liste ⊇ alle HTML-Ressourcen (Diff leer), Offline-Audit 0
  externe URLs, jsdom-Boot-Smoke 0 JS-Fehler (SW-Guard skippt korrekt, POOL 809, v0.7.0), ALLE 21 Suiten exakt auf
  Sollwert grün. APP_VERSION 0.6.0→0.7.0 + CHANGELOG v0.7.0. TOOLING-HINWEIS: persistente .tooling/jsdom hing beim
  require → frische jsdom nach /tmp/jt installiert, Suiten mit NODE_PATH=/tmp/jt/node_modules gefahren. NÄCHSTER: F3.]
- F3 Mobil-Feinschliff (Touch ≥44px, Drag-Typen am Handy) [CSS-TEIL FERTIG 2026-07-18: Touch-Audit + Fix.
  Nutzer-Entscheide: (a) nur Touch via @media (pointer:coarse) – Desktop-Optik unverändert, (b) ALLE interaktiven
  Elemente ≥44px. Neuer coarse-Block am Ende styles.css: min-height 44px auf button.b/.nav-item/.side-theme/.opt/
  .mtf-btn/.kt-box/.zoombtn/.zoomclose; Kompaktbuttons (.b.leise Reihenfolge-↑/↓, .mtf-btn, .kt-box, zoom) zusätzlich
  min-width 44px + inline-flex zentriert; .opt flex-zentriert; Sammelselektor [role=\"button\"]:not(rect){min-height:44px
  !important} deckt alle chipTastatur-Elemente (Zuordnung/Matrix/Beschriftung/Baukasten-Chips+Slots+Zonen, Fehlersuche-
  Zeilen) ab, SVG-Zonen ausgenommen. Verifiziert: Klammer-Balance ok, Offline 0, jsdom-Boot 0 JS-Fehler (v0.7.1),
  ALLE 21 Suiten auf Sollwert grün. APP_VERSION 0.7.0→0.7.1 + sw.js CACHE_VERSION ap1-v0.7.1 + CHANGELOG.
  OFFEN (Nutzer): tatsächlicher Handy-Test der Drag-Typen am installierten Stand; Befunde → gezielte Fixes.]

**PHASE S – Schlussqualität** (vorgezogen 2026-07-18 auf Nutzerwunsch)
- S-A #77 Fakten-Review-Stichprobe [FERTIG 2026-07-18: Stichprobe 20 norm-/zahlenkritische Fragen (BBiG/BGB/BetrVG/
  DSGVO/Krypto/WLAN/Datenmengen), selbst geprüft (kein Agent). Alle gradierten Antworten fachlich korrekt; 3 kleine
  Musterlösungs-Ungenauigkeiten korrigiert (Nutzer-Freigabe alle): M08-606 §87 Abs.1 Nr.2/Nr.3 statt Nr.1 + Tippfehler
  „Pausenpausen"; M08-014 §14 Abs.2 statt Abs.1 BBiG; M03-109 Reichweiten Cat.6/Multimode vorsichtiger. Pool-Edits per
  gezielter Textersetzung (kein Reformat), validate_pool/idcheck/test_logik 2162 GRÜN.]
- S-B Coverage-Endkontrolle + Sim-Kalibrierung [FERTIG 2026-07-18: pool_query coverage – KEINE dünnen Themen, 1
  einseitiges („Arbeitsschutz & Arbeitszeit", nur mc) → 1 AP2-Mehrfachfrage M08-115 (ArbZG/JArbSchG, fachl. geprüft)
  ergänzt → Thema jetzt OK (mc5+mehrfach1). Sim gut kalibriert (buildAP1Exam punktgewichtet über M01–M07, AP1-Pool 738,
  Zeitbudget aus TYP_META, Default 40 Fragen/90 Min). Pool 809→810. APP_VERSION 0.7.1→0.7.2 + sw.js CACHE ap1-v0.7.2 +
  CHANGELOG. → PHASE S KOMPLETT.]
IDEENSPEICHER (NICHT eingeplant, nur auf Nutzerwunsch): G2 Selbstbewertungs-Sim, G4 Altprüfungs-Analyse.
NUTZER-PUNKTE: P22 Browser-Smoke-Test ERLEDIGT 2026-07-19 (Doppelklick/file:// läuft, App funktioniert);
Prüfungsdatum 24.02.2027 eingetragen, Countdown läuft ERLEDIGT. Offen bleibt nur der Handy-Test der
Drag-Typen (seit F3).

## 5. Reihenfolge + Status HISTORIE (Blöcke A–F; Entscheidungen sind dokumentiert und GELTEN)
Grundsatz-Entscheidungen des Nutzers (2026-07-12): Reihenfolge „Lernnutzen zuerst"; GESTRICHEN: #58,
#59, #86, #92, #93, #99, #100; GEBÜNDELT: #51+#62+#97+#60, #64+#65, #66+#67.

- **A1** #56 migrate()  [FERTIG: 23 Tests (test_migrate.js, nur in Session-Outputs), STATE_VERSION 5]
- **A2** #69 Distraktor-Erklärungen  [FERTIG: 24 ergänzt, 100 % Abdeckung mc/mehrfach, alle fachlich geprüft]
- **A3** Gewichtungs-Engine  [FERTIG: test_a3.js 70 grün. Entschieden: Default AN, multiplikativ mit
  Floor 0.15, Interleaving immer aktiv (Malus x0.3, letzte 2 Themen), Themen-Serie 5 Fragen, Gate >30]
- **A4** #63 Diagnose  [FERTIG: test_a4.js 76 grün, 6 Typen, keine Diagnose in Simulation]
- **A5** #70 Normen/Zahlen  [FERTIG: 5 Korrekturen (Wi-Fi 6E/7 in M03-013/613/202; M07-202 § 640 Abs. 3
  BGB statt falscher unverzüglicher Rügepflicht/„§ 377 BGB"; M08-101 § 14 JArbSchG). Keine weiteren Befunde.]

- **S1** Pool-Konsolidierung 70→8 Dateien  [FERTIG 2026-07-13: pool_m01..pool_m08.json (720 Fragen,
  Mengen-Diff leer verifiziert vor UND nach Umbau), check.sh voll ALLES GRÜN (2162/70/76/23). 62
  Altdateien vollständig gelöscht (via allow_cowork_file_delete-Freigabe, danach check.sh erneut
  ALLES GRÜN). pool/ hat jetzt genau 9 Dateien (pool_m01..08 + pool_faelle). pool_faelle.json
  unverändert (separates Schema).]
- **S2** tests/-Ordner + Auto-Glob in check.sh  [FERTIG 2026-07-13: tests/ = _harness.js +
  test_logik/test_engine/test_diagnose/test_state.js (aus test_logik/a3/a4/migrate, Verhalten
  identisch, OK-Zahlen 2162/70/76/23 unverändert). check.sh: Auto-Glob über tests/test_*.js
  (schnell = nur test_logik), frisches `mktemp -d`-Workdir statt blankem /tmp (EACCES-fest gegen
  nobody-Reste), Inline-Check dort. Voll + schnell GRÜN, Dummy-Fail-Test wurde erkannt.
  4 Alt-Root-Tests via allow_cowork_file_delete gelöscht.]
- **S3** COVERAGE.md durch `pool_query.js coverage` ersetzen  [FERTIG 2026-07-13: neues Kommando
  `node tools/pool_query.js coverage` erzeugt Abschnitt-1-Matrix (Modul×Thema, Stufen 1/2/3/4, Formate,
  Bewertung DÜNN<5 / EINSEITIG=1 Format|1 Stufe) live aus fragen.js → Markdown, Redirect `> COVERAGE_GEN.md`.
  Verifiziert: Per-Thema-Zahlen == `themen` (Diff leer), Summe 720. Alte COVERAGE.md nur mit VERALTET-
  Kopfhinweis versehen (Abschnitt 2/3 = manuelle Analysen bleiben). check.sh ALLES GRÜN.]
  (Nicht eingeplant, nur Idee: Fortschritts-Export/-Import im LocalStorage – bei Block B ggf. erneut anbieten.)

  **→ NÄCHSTER TASK: A6** (#49 Fehlerbild-Hotspots, s. u.)

- **A6** #49 Fehlerbild-Aufgaben  [FERTIG 2026-07-13: 9 hotspot-Fehlerbilder in pool/pool_m_fehlerbild.json
  (M03-980/981/982 ipconfig: Gateway außerhalb Subnetz / Maske 255.255.0.0 statt /24 / DNS=Broadcast;
  M04-997/998/999 Konsole: /displaydns statt /flushdns / Ping-Ziel=Gateway statt Internet / route-Gateway
  außerhalb Lokalnetz; M06-970/971/972 Härtung: Telnet:23 / Firewall ANY→ANY-Allow / Freigabe Jeder-Vollzugriff).
  Sonnet-Agent-Entwurf auf /tmp, validate_batch 0 Fehler; ich habe jede Frage fachlich geprüft (genau 1 echter
  Fehler, alle übrigen Werte korrekt, AP1=Fehler-erkennen), gradeHotspot beidseitig + jsdom-Render 3 Stichproben
  (12/12 OK) selbst getestet. build_fragen 729 Fragen; check.sh ALLES GRÜN.  → NÄCHSTER TASK: A7.]
  [Ursprüngliche Vorstrukturierung (erledigt):]
  1. ENTSCHIEDEN (Nutzer 2026-07-12, KEINE Frage mehr nötig): 9 Stück, Mix 3x M03
     (ipconfig/Netzdiagramm), 3x M04 (Konsole/Konfig), 3x M06 (Sicherheits-Konfig).
  2. Schema-Vorlage: pool/pool_m_hotspot2.json, Frage M03-970. Felder: {id, pruefungsteil:"AP1", modul,
     thema (KANONISCH, aus Object.keys(L.THEMA_RELEVANZ)), typ:"hotspot", schwierigkeit (2–3), frage
     („Klicke die fehlerhafte Stelle an …"), svg (viewBox, weiße rects #fff mit stroke #2A2F39 + <text>),
     zonen:[{x,y,w,h,richtig,label}]}. REGELN: Zonen-Koordinaten EXAKT == rect-Koordinaten; GENAU eine
     Zone richtig:true; alle Zonen im viewBox; der markierte Wert muss WIRKLICH fachlich falsch sein und
     ALLE anderen Werte korrekt (kein zweiter versteckter Fehler!). gradeHotspot: logik.js ~Z.383.
  3. Freie ID-Bereiche (2026-07-12 geprüft): M03-980+, M04-997+, M06-970+ (belegt sind u. a.
     M03-950..977, M04-950..996, M06-950..961 – vor Vergabe nochmal `grep -o "M0X-9[0-9][0-9]"` über pool/).
  4. Neue Datei pool/pool_m_fehlerbild.json; Sonnet-Agent entwirft (Template + Regeln wörtlich mitgeben,
     ipconfig-Fehlerbilder z. B.: Gateway außerhalb Subnetz, Maske /24 vs. /16 falsch, DNS=Broadcast;
     ACHTUNG AP1-Regel: reine Subnetting-RECHNUNG wäre AP2 – hier geht es um FEHLER ERKENNEN, das ist als
     „Konsolenbefehle & Fehlersuche"/„Netzwerkkomponenten & Medien"/„Härtung & Zugriffskontrolle" AP1-fähig).
  5. Hauptmodell prüft JEDE Frage: SVG parst (python xml), Zone==Box-Abgleich per Skript, genau-1-richtig,
     fachliche Einzelprüfung, jsdom-Render von 2–3 Stichproben; dann build_fragen.py + test_logik.js.
  6. Checkpoint (TASKLIST-Status + BUILD_LOG-Eintrag).

- **A7** Inhalts-Ausbau [IN ARBEIT – Teil-Batches mit Pause, „dünne Themen zuerst" (Nutzer 2026-07-13)]:
  #72 Rechenvarianten, #68 Stufe-4, #71 Transfer, #74 Diagramme, #75 Englisch, P21d-Rest.
  - Batch 1 FERTIG 2026-07-13: 8 Fragen (Haiku-Entwurf /tmp/a7, von mir fachl. geprüft + 4 korrigiert)
    → pool/pool_m_ausbau.json: M01-734/735 (KI-Störungsmgmt), M03-746/747 (Netzwerk-/Arbeitsplatz-Ausst.),
    M06-737/738 (Security by Design), M06-739/740 (Datenschutzvorfall, Art.33/72h). Alle DÜNN(<5)-Themen weg.
    build 737 Fragen, check.sh GRÜN.
  - Batch 2 (#68 Stufe-4) FERTIG 2026-07-13: 8 St4-Transferfragen (Sonnet-Entwurf /tmp/a7b, von mir fachl.
    geprüft, 0 Korrekturen) → pool_m_ausbau.json (jetzt 16): M02-750 Komm.-Konflikt (Eisberg+4-Ohren),
    M03-750 OSI-Schichtanalyse DNS, M04-750 Diagnosestrategie, M04-751 Off-by-one (mc), M04-752 Komposition
    (mc), M06-750 CIA-Mehrfachverletzung (mehrf.), M06-751 DSGVO AVV+Drittland+Art.6/21, M07-750 SLA-Gestaltung
    (mehrf.). Jedes Zielthema hat jetzt St4. build 745, check.sh GRÜN, Render-Smoke 3/3.
  - Batch 3 (#72 Rechenvarianten, „beides gemischt") FERTIG 2026-07-13: 4 NEUE rechenassistent-Fragen
    (Sonnet /tmp/a7c, je 2 Varianten, verify-Skript): M03-760 Energiekosten, M03-761 Datenmengen (dezimal),
    M02-760 Bezugskalkulation, M07-760 Soll-Ist – alle Werte von mir unabhängig nachgerechnet. PLUS je 2
    Zahlen-Varianten (selbst, mit Nachrechnung) auf bestehende M03-950/951/952/953. build 749, Grade-Sanity
    (instanziiere→gradeRechenassistent) + check.sh GRÜN, Render-Smoke 3/3.
  - ZURÜCKGESTELLT (Nutzer 2026-07-13): #71 Transfer, #74 Diagramme, #75 Englisch – neue Fragen-Batches
    erstmal hinten anstellen. Wiederaufnahme jederzeit möglich (Pool aktuell 749 Fragen).
  ENTSCHIEDEN (Nutzer 2026-07-12): insgesamt ~40 Fragen gezielt (je Teil 5–8, Fokus dünnste
  Themen via `pool_query duenn` + Stufe-4 wo <5 schwere existieren); #75 = Kurztext + mc/mehrfach wie
  M02-734 (KEINE Vokabel-Zuordnung). Verbleibende Detailfragen je Teil nur noch bei echten Alternativen. Für #72: Werte per Skript nachrechnen (verifycalc-Ansatz); für #74: SVG-Koordinaten-
  Template wie A6; für #75: Einsortierung M02/„Englische Fachtexte"/AP1.
- **A8 (vorgezogen aus E, Token-Sparregel 1)** #80 JS-Auslagern  [FERTIG 2026-07-13: Inline-JS → app.js
  (1867 Z.) UND Inline-CSS → styles.css (184 Z.), HTML nur noch ~43 Z. Markup + <link>/<script src>.
  Dry-Run in /tmp: alle 4 Suiten identisch (2162/70/76/23) + Boot-Smoke; dann per python auf Mount
  geschrieben (Enden geprüft). check.sh angepasst: app.js/styles.css-Mount-Checks, node --check app.js
  statt Inline-Extraktion, cp app.js+styles.css ins Workdir, Offline-Audit scannt app.js+styles.css.
  check.sh voll GRÜN. (P22 Doppelklick-Offline-Test inzwischen vom Nutzer bestätigt, 2026-07-19.)]
- **B** Lern-Features [IN ARBEIT]. #73 TYP_META [FERTIG 2026-07-13: logik.js L.TYP_META (18 Typen, sek/
  punkte, auf realistische AP1-Zeit kalibriert – Nutzerwerte) + L.TYP_META_DEFAULT{90,1} + L.metaFuer(f)
  mit Frage-Override f.sek/f.punkte. tests/test_meta.js (66, Auto-Glob) grün; alle Suiten 2162/70/76/23+66.
  Anbindung an Timer/Simulation folgt in Folge-Tasks. Backup backup_2026-07-13b.zip vorher gezogen.]
  #45 Timer [FERTIG 2026-07-13: Timer-Kern war schon da; 4 Lücken geschlossen (app.js): Budget aus TYP_META-
  Summe bzw. S.simDauerMin-Override (Nutzer-Entscheid), Einstellungsfeld „Simulationsdauer (Min)" 0=auto,
  LEAK-FIX render()→simAbbrechen bei Seitenwechsel, zeitSek in simHistorie + „Benötigte Zeit"-Anzeige (nur
  Gesamtzeit). tests/test_timer.js (15, jsdom) grün; Suiten 2162/70/76/23+66+15. MOUNT-LAG: logik.js/app.js
  waren im bash-Mount abgeschnitten – Platte korrekt; vor bash-check.sh Datei-Enden abwarten (s. BUILD_LOG).]
  #46 Lesezeichen [FERTIG 2026-07-13: app.js renderStern (Toggle S.markiert, ☆/★, guarded !opts.simulation)
  in loeseFrage; neue Route sMarkiert + markierteIds (passtAP), "Markierte üben"-Durchlauf, einzeln entfernbar,
  Leerzustand; markiert:sMarkiert im Dispatch (NICHT in SEITEN-Nav, wie serie); Start-Kachel "Markiert ★" +
  Badge nur wenn belegt; Reset via Daten-löschen (defaultState). tests/test_markiert.js (18). check.sh-
  Äquivalent GRÜN: 2162/70/76/23+66+15+18. Nutzer-Entscheide: kein Stern in Sim, Reset in Daten-löschen,
  Kachel nur wenn belegt.]
  #52 Zurück-Navigation [FERTIG 2026-07-13: app.js Session-Verlauf uebenVerlauf/uebenIdx + uebenRender mit
  „← Zurück"/„Weiter →"-Leiste (#uebennav) + Zähler; naechsteFrage pusht ans Ende, sUeben resettet Verlauf.
  live=neueste unbeantwortete Frage (bucht), Wiederholung aus Verlauf=Review (onGraded no-op, Variant erhalten).
  tests/test_zurueck.js (16). Alle Suiten GRÜN 2162/70/76/23+66+15+18+16. Mount-Lag app.js (Tests gegen
  rekonstruierte Vollversion).]
  #54 Swipe-Gesten [FERTIG 2026-07-13: app.js macheWischLeiste – dedizierte Wisch-Leiste (Nutzer-Entscheid),
  KEIN #main-Handler → kein Drag-Konflikt; .ontouch*, Schwelle 60px, horizontal>vertikal, touch-action:pan-y.
  Rechts=zurück/Links=vor. Üben: zurück+vor (am Ende neue Frage nur wenn beantwortet). Fehler-Deck+Markiert
  (Nutzer-Entscheid): „nur vor" nach Antwort. tests/test_swipe.js (11). Alle Suiten GRÜN 2162/70/76/23+66+15+
  18+16+11.]
  #47 SVG-Zoom [FERTIG 2026-07-13: app.js svgBox(inner)-Factory (svgbox + ⤢-Button) statt 4x Inline-svgbox;
  oeffneZoom(svgHtml) baut Overlay (statisch max 92vw/92vh, SVG outerHTML) + document-Click-Delegation auf
  .zoombtn (deckt alle 4 svgbox-Typen). Schließen: Esc/Hintergrund/✕ (keydown-Listener sauber entfernt,
  Doppel-Overlay-Guard). styles.css .svgbox/.zoombtn/.zoomoverlay/.zoominner/.zoomclose. Hotspot-Zonen bleiben
  in der Frage klickbar (Zoom nur ansehen). Nutzer-Entscheide: statisch (kein Pinch/Pan), alle 4 Typen, 3
  Schließ-Wege. tests/test_zoom.js (18). Alle Suiten GRÜN 2162/70/76/23+66+15+18+16+11+zoom18, Offline 0.
  MOUNT-LAG app.js ab Z.1996 → Tests gegen rekonstruierte Vollversion.]
  #98 Abruf-Übung [FERTIG 2026-07-13: app.js Session-Schalter abrufAn + abrufVerdecken(R) (Optionen nach
  „Deine Lösung"-Kicker in versteckten Container verschieben, Aufdeck-Button; Handler bleiben erhalten) +
  abrufToggle(). Aufruf am Ende loeseFrage nur mc/dropdown/mehrfach & !opts.simulation, Grade unverändert.
  Toggle im Kopf von Üben/Fehler-Deck/Markiert/Serie (Nutzer-Entscheide: Session-Schalter im Üben-Kopf, alle
  4 Modi, nicht Simulation, Typen mc/dropdown/mehrfach). tests/test_abruf.js (17). Alle Suiten GRÜN
  2162/70/76/23+66+15+18+16+11+zoom18+abruf17, Offline 0. MOUNT-LAG app.js ab Z.2010 → rekonstruierte
  Vollversion (2038 Z.).]
  #55 Fokus-Modus [FERTIG 2026-07-13: app.js setFokus(v) (S.fokus persistiert + body.classList.toggle('fokus'))
  + IIFE initFokus (Umschalter #btnFokus in Sidebar, #btnFokusExit im Inhalt, wendet S.fokus beim Laden an).
  Reiner CSS-Toggle, kein Re-Render. styles.css body.fokus: Sidebar aus, .app 1 Spalte, .workspace zentriert
  (max 1000px), fusshinweis+Badges aus; .fokus-exit fixiert. Nutzer-Entscheide: Sidebar-Umschalter + Verlassen-
  Button, auch Nebenelemente reduzieren, gilt überall inkl. Simulation. tests/test_fokus.js (15). Alle Suiten
  GRÜN 2162/70/76/23+66+15+18+16+11+zoom18+abruf17+fokus15, Offline 0. MOUNT-LAG app.js ab Z.2049 →
  rekonstruierte Vollversion (2063 Z.).]
  #57 Frage melden [FERTIG 2026-07-13: app.js renderMelden(c,f) neben renderStern (Aufruf loeseFrage, beide
  !opts.simulation): ⚑-Details mit Schnellgründen (MELDE_GRUENDE) + optionalem Text → S.meldungen[id]=
  {grund,text,datum}, Status + Entfernen, keine Wertungs-Auswirkung. Export meldungenJSON/meldungenText +
  downloadDatei (Blob, file://-tauglich). sEinstellungen-Panel „Gemeldete Fragen" (Liste, Entfernen, Download
  JSON/Text). Nutzer-Entscheide: Schnellgründe+Text, Datei-Download, alle Modi außer Sim. tests/test_melden.js
  (19). Alle Suiten GRÜN 2162/70/76/23+66+15+18+16+11+zoom18+abruf17+fokus15+melden19, Offline 0. MOUNT-LAG
  app.js ab Z.2069 → rekonstruierte Vollversion (2134 Z.).]
  #53 Tooltip-Glossar [FERTIG 2026-07-14: kuratierte GLOSSAR_TIPS-Map (~37 Kernbegriffe) + glossarListe
  (Regex je Begriff, längster zuerst, Overlap-Schutz) / glossarLeakStr (Begriff in Option/Musterlösung →
  überspringen) / glossarWrap (max 2 Treffer, arbeitet auf esc(f.frage), Attribute doppelt-gequotet) /
  glossarPopEl+Show+Hide+Attach (Custom Popover: Hover Desktop / Tap Handy, schließt bei Außenklick/Esc/Resize;
  document-Listener nur EINMAL → kein Leak, Span-Listener sterben mit host.innerHTML). loeseFrage-Frage-text:
  `(opts.simulation ? esc : glossarWrap)` + glossarAttach nur !sim; renderFrage (Sim) unberührt. defaultState
  glossarTip:true (kein STATE_VERSION-Bump, Object.assign liefert Altnutzern Default). Toggle in sEinstellungen.
  styles.css .glossar-term/.glossar-pop. Nutzer-Entscheide: kuratierte Liste, Custom Popover, max 2, überall
  außer Sim + Toggle. tests/test_glossar.js (24). Alle 14 Suiten GRÜN 2162/70/76/23/66/15/18/16/11/18/17/15/19/24,
  Offline 0. Render-Probe: 88 Pool-Fragen mit Treffer, Leak-Kontrolle 97/97 leak-frei. MOUNT-LAG app.js ab
  Z.2161 → gegen rekonstruierte Vollversion (2278 Z.) getestet.]
  #61 IT-Abkürzungs-Lexikon [FERTIG 2026-07-14: NEUE Datei abkuerzungen.js (dual-env, var ABKUERZUNGEN, 70
  Einträge {kurz,lang,def,kat}, 6 Kategorien Netzwerk/Sicherheit/Hardware/Software/Projekt-QS/Wirtschaft-Recht,
  jede Auflösung fachlich geprüft; Draft via Sonnet-Agent). Eingebunden: <script> in HTML (nach spickzettel.js),
  check.sh Mount-Marker + node --check + Copy-Liste. sGlossar zu Tab-Wrapper umgebaut: glossarBegriffeView
  (alt) + glossarAbkView (neu, durchsuchbar kurz/lang/def/kat, alphabetisch). Nutzer-Entscheide: eigene Datei,
  Tab IM Glossar, ~70, Gate>30. RECONCILE (Tab statt eigener Route): Abkürzungen-Tab nur sichtbar bei
  anzahlBeantwortet()>30; darunter Hinweis „ab 31 …"; Glossar-Startkachel ergänzt Hinweis wenn freigeschaltet.
  tests/test_abk.js (20; require ./abkuerzungen.js – flach wie check.sh). Alle 15 Suiten GRÜN 2162/70/76/23/66/
  15/18/16/11/18/17/15/19/24/20, Offline 0. Render-Probe: Gate zu→nur Begriffe, Gate offen→Abk-Tab (RAID/USV
  sichtbar), Kachel-Hinweis. MOUNT-LAG app.js ab Z.2284 + NUL-Padding an test_abk.js → Testkopie rekonstruiert
  (2320 Z.) + tr -d '\000'.]
  #76 Teilpunkte via gewichtete Schlüsselbegriffe [FERTIG 2026-07-14: Schema `schluesselbegriffe:{pflicht[],kuer[]}`
  optional auf freitext/erklaeren (logik.js-Validierung additiv/abwärtskompatibel). app.js: gradeTeilpunkte
  (Pflicht=Gewicht 2 / Kür=Gewicht 1, Anteil=getroffenes Gewicht÷Gesamtgewicht) + begriffTreffer (nutzt normText
  /synGruppe/Stem-Toleranz wie autoCheckText). Freitext-Block: bei vorhandenem Feld gradeTeilpunkte sonst
  autoCheckText; Anzeige „x/y Kernpunkte getroffen (+ z Zusatzpunkte) (P %)". Schwelle 65 %=richtig. Nutzer-
  Entscheide: Pflicht/Kür-Schema, Schwelle 65 %, SELBSTEINSCHÄTZUNG bleibt maßgeblich (Teilpunkte nur Anzeige+
  Vorschlag), ~15 Demo-Fragen. 15 Pool-Fragen (je Modul ~2, breit) mit Schlüsselbegriffen ausgestattet (Draft
  via Sonnet-Agent, ICH habe jede fachlich geprüft + 5 zu spezielle/negative Pflicht-Begriffe zu Kür verschoben:
  M07-302 Werkvertrag, M04-112 Remote-Mitarbeiter, M06-017 Integrität/DSGVO, M07-016 Kundenbindung/Nachfolge,
  M01-007 Vermeiden). build_fragen 749 (Diff vs backup_2026-07-13b = NUR die 15 Felder, kein A7-Leak).
  tests/test_teilpunkte.js (19). Alle 16 Suiten GRÜN 2162/70/76/23/66/15/18/16/11/18/17/15/19/24/20/19, Offline 0.
  Selbstkonsistenz-Probe: 15/15 Musterlösungen treffen alle eigenen Begriffe (100 %), leere Antwort=leer, 1/2
  Pflicht=25 %. MOUNT-LAG: logik.js@943 + app.js@2296 abgeschnitten → gegen rekonstruierte Vollversionen
  getestet (2358 Z.).]  → BLOCK B KOMPLETT. NÄCHSTER TASK: mit Nutzer klären (Block C Neue Fragetypen ODER A7
  Inhalts-Ausbau fortsetzen).
  Empfohlene Einzelreihenfolge: #73 TYP_META → #45 Timer (nutzt TYP_META +
  simDauerMin; sSimulation ~Z.1456ff, Interval-Handle + clearInterval bei Seitenwechsel!) → #46 Lesezeichen
  (S.markiert existiert; Stern in loeseFrage beim Notiz-Muster; neue Route analog sFehlerdeck) → #52
  Zurück-Navigation (Session-Array uebenVerlauf) → #54 Swipe (braucht #52; Drag&Drop-Typen ausnehmen!) →
  #47 SVG-Zoom (Event-Delegation, 4 svgbox-Stellen) → #98 Abruf-Übung → #55 Fokus (S.fokus existiert) →
  #57 Melden (S.meldungen existiert) → #53 Tooltip-Glossar (Leak-Prüfung!) → #61 Abkürzungslexikon
  (Gate >30) → #76 Teilpunkte (Vorab: Schwelle/Gewichtung fragen). Details je Feature: PLAENE.md.
- **C** Neue Fragetypen #101 mtf / #103 kreuztabelle / #102 lueckenkette / #50 szenario2: je Typ
  logik.js (TYPEN + Validierung + grade + Tests) + Renderer in loeseFrage (Registry existiert NICHT –
  klassisch einhängen) + Inhalte + gcheck. ENTSCHIEDEN (Nutzer 2026-07-12): Teilpunkte anteilig
  ANZEIGEN, als „richtig" (Fehler-Deck/Statistik) zählt nur 100 % – konsistent zu mehrfach.
  Für kreuztabelle: document.createElement-Regel (Abschnitt 4) beachten!
- **D** Barrierefreiheit & Hilfe.
  #64+#65 Barrierefreiheit [FERTIG 2026-07-14: #64 reines CSS (body.farbsymbole ✓/✗ an .opt richtig/falsch +
  .fb ok/nein b::before) + setFarbsymbole(v) (Body-Klassen-Toggle, kein Re-Render, Apply beim Laden). #65
  svgBox(inner,alt) setzt role=img + aria-label nur bei S.ariaAltTexte; svgAltFuer(f) generisch je Typ
  (Nutzer-Entscheid) + Thema-Zusatz; 4 svgBox-Call-Sites versorgt (bild ×2, netzplan, beschriftung). Einstellungen:
  Block „Barrierefreiheit" mit 2 Checkboxen (aria-Toggle löst render() aus, damit aktuelle Grafik neu beschriftet
  wird). Beide default AUS. Nutzer-Entscheide: ✓/✗ nur Auswahl+Feedback (CSS), Alt-Text generisch je Typ.
  tests/test_a11y.js (21). Alle 17 Suiten GRÜN 2162/70/76/23/66/15/18/16/11/18/17/15/19/24/20/19/21, Offline 0.
  MOUNT-LAG app.js@2359 + styles.css + NUL/Trunc an test_a11y.js → gegen rekonstruierte Vollversionen getestet
  (app 2387 Z.); Workspace-Contention (jsdom-Timeouts) → Suiten einzeln per Exit-Code verifiziert.]
  #66+#67 Onboarding & Kontext-Hilfe [FERTIG 2026-07-14: #66 ONB_SCHRITTE (5) + starteOnboarding/zeichneOnb/
  onboardingFertig (Overlay .onb-overlay, Weiter/Zurück/Überspringen/Esc, letzter Schritt „Los geht's" →
  onboardingDone=true+persist). Auto-Start via `if(!S.onboardingDone) setTimeout(starteOnboarding,0)` (nach
  render). Reaktivierbar: Einstellungen-Button „Einführungs-Tour erneut zeigen". #67 TYP_HILFE-Map (10 interaktive
  Typen) + renderTypHilfe(container,typ) mit „nicht mehr zeigen"-Häkchen (S.typHilfeAus[typ]); Aufruf in
  loeseFrage nach „Deine Lösung"-Kicker, nur !simulation (renderFrage/Sim ruft es nie auf). Einstellungen-Button
  „Bedienhilfen wieder einblenden" (S.typHilfeAus={}). styles.css .onb-overlay/.onb-card/.typ-hilfe. Nutzer-
  Entscheide: Auto-Overlay 1. Start, Kontext-Hilfe auto einmalig je Typ mit Häkchen. tests/test_hilfe.js (21).
  Alle 18 Suiten GRÜN 2162/70/76/23/66/21/24/20/19/15/18/16/11/18/17/15/19/21, Offline 0. MOUNT-LAG app.js@2370
  + test_a11y/test_hilfe Trunc → rekonstruierte Vollversionen (app 2463 Z.); Workspace-Contention → Suiten einzeln
  per Exit-Code.]  → BLOCK D KOMPLETT. NÄCHSTER: mit Nutzer klären (Block C Neue Fragetypen ODER Block E Technik/
  Refactoring inkl. app.js-Modularisierung ODER A7 Inhalts-Ausbau ODER Block F/PWA).
- **E** Technik/Refactoring (bewusst NACH den Lern-Blöcken; #88 check.sh + #80 A8 bereits erledigt).
  FUNDAMENT-TOOLING [FERTIG 2026-07-14, mount-sicher gewählt]: #89 build_fragen.py gehärtet (Abbruch bei
  ID-Format/Pflichtfeld/Präfix/pruefungsteil/schwierigkeit/JSON/Dublette; Ausgabe bei sauberem Pool
  BYTE-IDENTISCH – md5 verifiziert; Negativtests grün). #87 pool_query.js Kommando `idcheck` (Dubletten/
  Formfehler/Präfix + je Modul Anzahl+Min/Max-ID; 749/keine Probleme). #81 NEU tools/validate_pool.js
  (L.validateFragen + Zusatzregeln über den GANZEN Pool → „Pool valide", 749/73 Themen) + SCHEMA.md
  (Feld-Referenz je Typ). #95 ARCHITECTURE.md aktualisiert (Stand 749 Fragen, abkuerzungen.js, 18 Test-Suiten,
  tools-Liste, Funktions-Anker aller Block-B/D-Features). check.sh um Pool-Audit (validate_pool + idcheck)
  ergänzt. test_logik 2162 grün, fragen.js unverändert. Kein app.js/logik.js-Code geändert → 18 Suiten bleiben grün.
  app.js-MODULARISIERUNG [FERTIG 2026-07-14]: app.js (2463 Z.) per bash-Skript in 9 Module geschnitten
  (app_state 56 / app_pool 28 / app_util 190 / app_ui 144 / app_frage 370 / app_loeser 656 / app_seiten 385 /
  app_sim 218 / app_pages2 424 Z.). Reiner Partition-Split: Reassemblierung der Module (ohne die je
  vorangestellte „use strict";-Zeile in Modul 2–9) == alte app.js BYTE-IDENTISCH (diff leer). HTML lädt die 9
  Module in Abhängigkeitsreihenfolge (state→…→pages2, letzteres endet mit render()). app.js GELÖSCHT (Rollback:
  backup_2026-07-14.zip + Reassembly). check.sh auf Module umgestellt (Mount-Gate app_pages2/app_loeser, node
  --check-Loop über 9 Module, Copy-Liste, Offline/UTF-8/Anti-Pattern über app_*.js). FUNCTIONS.md neu (186
  Symbole/12 Dateien). ARCHITECTURE.md-Modulkarte. VERIFIZIERT: alle 18 Suiten grün gegen modulare HTML
  (Workdir) + check.sh schnell GRÜN im echten Layout (9 Module Syntax, Pool-Audit, test_logik 2162) + Guards
  (Offline 0/UTF-8/Anti-Pattern) + jsdom-Stichprobe (glossar/a11y) im echten Layout. Mount-Lag: File-Tool-Edits
  (HTML/check.sh) laggten im bash-Mount → HTML im bash aus Head+realem Tail konsistent gemacht.
  #90/#91 Robustheit [FERTIG 2026-07-14]: #90 render()-Fehlerfänger – Dispatch in try/catch, unbekannte Route →
  Fallback sStart; bei Absturz zeigeFehlerPanel(m,e,kontext) (Kurzmeldung + aufklappbare technische Details +
  „Zur Startseite"/„Neu laden") statt Weißbild; console.error-Log. #91 loeseFrage-Guard: falsy/typloses f (z. B.
  veraltete Fehler-Deck-/Markiert-ID) → „übersprungen"-Panel + Weiter-Aktion statt Crash (id→Frage-Flows waren
  schon per filter(frageById) existenzgeprüft). Beide in den Modulen app_seiten.js/app_loeser.js. tests/
  test_robust.js (16). Alle 19 Suiten GRÜN 2162/70/76/23/66/24/20/19/21/21/15/18/16/11/18/17/15/19/16, Offline 0.
  #94 Pool-Index [FERTIG 2026-07-14]: app_pool.js POOL_INDEX = Object.create(null) (id→Frage, prototype-frei),
  im selbsttest befüllt; frageById(id) → POOL_INDEX[id] (O(1) statt POOL.find). Verhalten identisch (Smoke:
  Objekt-Identität, undefined bei fehlend, kein toString-Leak, Index==POOL). Alle 19 Suiten GRÜN.
  #79 Typ-Registry [FERTIG 2026-07-15: L.TYP (18 Typen, grade/simAuto/sek/punkte) + L.grade-Dispatcher +
  abgeleitete TYPEN/SIM_TYPEN/TYP_META in logik.js (Vorsession ohne Checkpoint unterbrochen); Abschluss =
  gradeZuordnung-Guard (undefined→false, L.grade wirft nie). tests/test_registry.js 106/0; logik 2162 /
  engine 70 / state 23 grün (gegen rekonstruierte Vollversion, Mount-Lag). Voller check.sh nach Mount-Refresh
  + Backup-Zip ausstehend.]
  #78 Renderer-Registry [FERTIG 2026-07-15: R_TYP={typ:fn(f,ctx)} in app_loeser.js; loeseFrage = Rahmen +
  Dispatch (R_TYP[iTyp]||R_TYP.freitext)(f,ctx), ctx={R,fbHost,opts,fertig,iTyp}. Reiner mechanischer
  Schnitt (Sonnet /tmp), 1 Opus-Fix: iTyp via ctx an freitext/erklaeren (sonst ReferenceError). Nur
  loeseFrage umgebaut (renderFrage/Sim bleibt – Nutzer-Entscheid). Alle 20 Suiten grün, Offline 0.]
  #84 Styles→Klassen [FERTIG 2026-07-15: 135 statische Inline-Styles → 67 .u-Einzeldeklarations-Utilities
  (Block am styles.css-Ende); 54 bewusst inline belassen wegen Spezifitätskonflikt (button.b/label.check …)
  bzw. laufzeit-getoggeltem display:none → dokumentiert in T2_RESTLISTE.md für Folge-Refactoring. Determin.
  Bau (t2_build.js), verifiziert: jsdom-computedStyle-Differential orig==neu 0 Abweichungen, alle 20 Suiten grün.]
  #85 TEXTE [FERTIG 2026-07-15: 333 statische UI-Strings → var TEXTE (279 Keys, nach Feature gegliedert) in
  app_util.js; dynamische/Daten-Strings bewusst lokal (T3_TEXTE.md). Sonnet /tmp; verifiziert per Rück-
  Substitution (Code byte-identisch außer 1 kosmet. Komma-Zeile), Werte wörtlich aus Original, 20 Suiten grün.]
  #83 CONFIG [FERTIG 2026-07-15: L.CONFIG (logik.js, 14 Keys: sperrfrist/interleavingMalus/gewichtFloor/
  adaptivMinGesamt/levelFenster/levelAbSchwelle/reifeFenster/reifeSchwelle/fdTage*/fdStreakWeg/serie/gate) +
  APP_CONFIG (app_state.js, 6 Keys: tagesziel/simAnzahl/fd+generatorEinstreuung/teilpunkteRichtig 0.65/
  teilpunkteTeilweise 0.35). Werte byte-identisch, 20 Suiten grün. Bewusst inline: S.antworten-Cap 30 (anderer
  Kontext), sSerie .slice(0,5), Pflicht/Kür-Gewichte 2/1, Laplace 1/2.]
  OFFEN in E (weitere Refactorings):
  #82 State-Kapselung, #86/#96 Kosmetik. Je Task: Vorher/Nachher-Suite identisch.
  HINWEIS: Bearbeiten jetzt am jeweiligen app_*.js-MODUL, nie mehr an „app.js" (existiert nicht mehr).
  VORGEMERKT (Nutzer 2026-07-13): app.js (1878 Z.) MODULARISIEREN – erst bei FRISCHEM Mount (nach
  Workspace-Neustart), nicht bei Truncation. Fixierter Split-Plan (alle plain <script src>, geteilte Globals,
  file://-tauglich, in Abhängigkeitsreihenfolge laden): app_state.js (Z.3–54) → app_pool.js (56–81) →
  app_util.js (83–198, inkl. normText/autoCheckText) → app_ui.js (200–241) → app_frage.js (241–560) →
  app_loeser.js (552–1039) → app_sim.js (1312–1537) → app_seiten.js (render-Dispatch + restliche Routen).
  Pflicht: Vorher/Nachher alle 4 Suiten identisch (2162/70/76/23 + Feature-Tests) + jsdom-Render jeder
  Route/jedes Typs, HTML lädt alle Module in Reihenfolge, node --check je Modul, Offline-Audit über alle.
- **F** #48 PWA (Vorab: Hosting klären – file:// kann kein SW; Doppelklick-Betrieb MUSS erhalten bleiben)
  + P22 Browser-Smoke-Test durch den NUTZER: ERLEDIGT 2026-07-19, App läuft per Doppelklick.

## 5b. Übergabe-Helfer (2026-07-12 erstellt)
- `bash check.sh` = komplette Prüfsuite in einem Befehl (Mount-Check, Syntax, alle 4 Testsuiten
  2162/70/76/23, Offline-Audit) – nach JEDEM Task ausführen, muss „ALLES GRÜN" melden.
- `bash verify.sh` (2026-07-15) = LAG-FREIER Prüfweg: Suiten laufen gegen native /tmp-Kopie statt gegen den
  lahmenden Mount. Unterbefehle: `setup` (Workdir bauen + node --check-Gate), `sync <datei>` (editierte Datei
  sauber nachziehen – 1 Datei/Aufruf; Alternative: Edit per python direkt im Workdir = kein Warten),
  `run <suite…>` (PASS/FAIL vs. Sollwert; jsdom-Suiten wegen 45-s-Limit EINZELN), `check`, `offline`, `names`.
  Empfehlung: bei Code-Tasks mit Mount-Lag statt Handarbeit nutzen. Auto-pkill räumt hängende node-Prozesse.
- `sollwerte.env` (2026-07-15) = SINGLE SOURCE der 20 Suiten-Sollwerte; check.sh UND verify.sh lesen sie und
  vergleichen die exakte Test-Anzahl je Suite (fängt stumm übersprungene Tests, nicht nur Exit-Code). Bei
  legitimer Anzahl-Änderung NUR hier anpassen.
- `bash tools/backup_rotate.sh [keepN]` (2026-07-15) = Backup-Hygiene: Keep/Delete-Plan (behalte neuste N=3 +
  ziOrM0Wa-Altzip als Kandidat). Löscht NICHT selbst (Mount verbietet rm) → Kandidaten per Löschfreigabe entfernen.
- ARCHITECTURE.md = Code-Landkarte (Funktionen + ~Zeilen, Schema, gefixte Bugs) – statt App selbst erkunden.
- START_PROMPT.md = fertiger Text für den neuen Chat.
- backup_2026-07-12.zip = kompletter geprüfter Stand nach A5 (ohne PDF).
- test_state.js (früher test_migrate.js) liegt in tests/ (23 Tests; relevanzGewichtung-Erwartung an A3-Default angepasst).

## 7. Token-Sparregeln (verbindlich ab 2026-07-12, Nutzer-Freigabe)
1. **#80 (JS-Auslagerung) ist VORGEZOGEN** und läuft als eigener Task direkt nach A7 (vor Block B):
   Inline-JS → app.js auslagern. Grund: HTML ist der größte Token-Fresser (Reads, Rekonstruktionen,
   Agent-Kontext). Sicherheitsnetz: check.sh vorher/nachher identisch grün, Verhalten unverändert.
2. **Neuer Chat pro Task-Block** (nach A6, A7, je 2–3 B-Features …): Frischstart mit START_PROMPT.md
   ist billiger als ein langer Chat, der den ganzen Verlauf mitschleppt.
3. **Haiku-Agenten für reine Inhalte** nach festem Template (Fragen-Batches wie A6/A7);
   Sonnet nur für Code-Entwürfe, die Kontextverständnis brauchen.
4. **Entscheidungsfragen bündeln:** alle Vorab-Fragen eines Blocks in EINE AskUserQuestion-Runde
   (bis 4 Fragen) statt einzelner Rückfrage-Turns.
5. **Agenten-Selbstvalidierung:** Agent bekommt ein Prüfskript mit (Schema, Zonen==Boxen, ID-frei)
   und muss es grün liefern; Hauptmodell prüft danach NUR fachlich (Stichproben, Rechnungen).
6. **grep statt Read** zum Lokalisieren (Anker in ARCHITECTURE.md); Read nur für den exakten
   Editierbereich; Testausgaben immer mit `| tail` kürzen.
7. **tools/pool_query.js nutzen** statt ad-hoc Node-Einzeiler (Kommandos: themen, typen, frage <id>,
   ohne <feld>, ids-frei <präfix>, duenn, stufe, suche <regex>). Getestet, funktioniert.
8. **Agent-Prompts über prompts/-Vorlagen:** prompts/fragen_batch.md (Inhalte, inkl. Pflicht-
   Selbstvalidierung via tools/validate_batch.js), prompts/feature_draft.md (Code-Entwürfe) und
   prompts/fragetyp_neu.md (Rezept für JEDEN neuen Fragetyp – Block C damit abarbeiten statt erkunden).
   Hauptprompt an Agenten = 3 Zeilen (Vorlage + Parameter); Vorlagen + ARCHITECTURE.md + tools/
   vorher nach /tmp kopieren. Zukunfts-Feature-Ideen mit Baustein-Hinweisen: PLAENE.md „Ideenspeicher".
9. **KEIN git im Projektordner:** Mount verbietet gits Lock-/Löschoperationen (2026-07-12 getestet,
   init scheitert). Es liegen harmlose .git-/.gitignore-Reste im Ordner – Nutzer kann sie im Explorer
   löschen. Versionierung stattdessen: Backup-Zip je Meilenstein (backup_JJJJ-MM-TT.zip via /tmp
   erstellen und cp auf den Mount; zip direkt auf den Mount scheitert ebenfalls).
10. **BUILD_LOG-Deckel:** neue Einträge max. ~6 Zeilen; Belege liegen in test_*.js und Checkpoints.
11. **Web-Recherche in Agenten auslagern:** Agent liest die Seiten und liefert nur das Extrakt;
    große Fetch-Dumps nie in den Hauptkontext ziehen.
12. **Schema referenzieren statt zitieren:** Agenten auf /tmp/ARCHITECTURE.md (Abschnitt Fragen-Schema)
    + eine Beispiel-Pooldatei verweisen, keine JSON-Blöcke in Prompts einbetten.
13. **Checkpoint VOR großen Agenten-Aufrufen** (nicht nur nach Task-Ende) und bei spürbar langem Chat
    lieber früh pausieren + neuen Chat starten – Unterbrechungen/Workspace-Neustarts kommen vor.

## 6. Offene Punkte für den Nutzer
- P22: 5-Minuten-Smoke-Test im Browser (Doppelklick auf lernprogramm_ap1.html, alle Kacheln einmal) –
  ÜBERFÄLLIG, bitte zeitnah; danach Rückmeldung im Chat.
- Prüfungsdatum 24.02.2027 in den App-Einstellungen eintragen (nur noch für Countdown; Lernplan L2 gestrichen).
- Für Phase F1: GitHub-Account/Repo bereitstellen (wird im Task gemeinsam eingerichtet).
- P23 (S1, 2026-07-13): ERLEDIGT – 62 leere Alt-Dateien im pool/-Ordner via allow_cowork_file_delete
  gelöscht (Freigabe durch Nutzeranfrage, danach check.sh erneut ALLES GRÜN). pool/ hat jetzt 9 Dateien.

## 7-PLAN2. ARBEITSPAKET „29 Ideen" (Freigabe Nutzer 2026-07-18) — verbindlich, Reihenfolge FIX
Ausgangsstand verifiziert grün: Pool 810, 21 Typen, APP_VERSION 0.7.2, test_logik 2162.
Reihenfolge: G1 Infra/CI → G2 Inhalte → G3 Lernmotor → G4 Technik → G5 UX. Minor-Bump je Gruppe:
G1→0.8.0, G2→0.9.0, G3→0.10.0, G4→0.11.0, G5→1.0.0 (Auto-Tag+Release je Version, Idee 42).
Pause nach JEDEM Task. ZURÜCKGESTELLT (IDEENSPEICHER): #47 Playwright, #32 IndexedDB.
Detail-Entscheide siehe PLAENE „AP2-G1".."AP2-G5".

**G1 Infra/CI-Fundament → v0.8.0** (Ideen 12,22,23,42,46,44,11)
- #22 JSON-Schema pro Fragetyp streng: tools/schema/ + tools/validate_schema.js (lokal+CI). NEUER Guard.
- #23 Render-Smoke: tests/test_render_smoke.js (je Typ 1 Frage rendern+graden) → NEUER sollwerte-Key render_smoke;
  in check.sh (voll) + CI.
- #12 CI: .github/workflows/ci.yml (jsdom-Install, voller check.sh bei Push+PR).
- #42 Auto-Tag vX.Y.Z + GitHub-Release (CHANGELOG-Auszug) bei Version-Bump.
- #46 axe: CI-Job über Hauptseiten, BLOCKIEREND.
- #11 PWA-Update: sw.js+Inline-Guard, „neue Version → Hinweis, dann Auto-Reload" (nur wenn keine Frage offen).
- #44 2 Manifest-Screenshots (Start+Üben, narrow), per PIL.
- Berührt: neue CI/Tooling, sw.js, manifest.webmanifest, HTML-Head, check.sh, sollwerte.env, styles.css.
- Agenten: Sonnet-Entwürfe CI/Schema /tmp; ich prüfe+integriere. Parallel: Schema + Render-Smoke.

**G2 Inhalts-Batches → v0.9.0** (Ideen 10,9,7,16,33,35) — STAND: G2.1 FERTIG 2026-07-19 (Pool 810→820,
pool/pool_m_g2.json, 10 Fragen Cloud/IPv6/USB4-TB/Wi-Fi 7; Nutzer-Entscheide: IPv6 unter „IP-Adressierung &
Subnetting" mit AP1 (Thema jetzt gemischt 12 AP2 + 3 AP1), Verteilung 3/3/2/2, Formatmix inkl. mtf/
kreuztabelle/dropdown. Detailplan „AP2-G2" in PLAENE.md nachgetragen).
G2.2 #9 BATCH 1/2 FERTIG 2026-07-19: faelle.js wird jetzt WIRKLICH gebaut (build_fragen.py, byte-identisch
verifiziert; faelle.js nie direkt editieren) + Fall-Guards (Drift in check.sh, Teilaufgaben-Validierung in
validate_pool über L.validateFragen) + FALL-04 (M01), FALL-05 (M02), FALL-06 (M05) → 6 Fälle/30 Teilaufgaben.
G2.2 #9 KOMPLETT 2026-07-19: Batch 2 = FALL-07 (M07 Verträge/SLA/Abnahme), FALL-08 (M03 WLAN/PoE),
FALL-09 (M04 Kontrollstrukturen/Schreibtischtest – bewusst NICHT Konsole, dort ist M04 schon dicht belegt)
→ 9 Fälle / 45 Teilaufgaben; jedes AP1-Modul hat mindestens einen Fall (M01 1, M02 1, M03 2, M04 2, M05 1,
M06 1, M07 1).
G2.3 #7 FERTIG 2026-07-19: 6 Stufe-4-Aufgaben in pool/pool_m_g2_st4.json, Pool 820 → 826. Das Plan-Kriterium
„dünne Profile" greift nicht mehr (coverage meldet KEIN dünnes/einseitiges Thema); Zielmenge waren deshalb die
41 Themen GANZ OHNE Stufe-4-Frage. Nutzer-Entscheide: (a) Auswahl „breit über Module" = Hardware-Komponenten
(M03-907 mehrfach), Berechnungen: Energie (M03-908 rechenassistent), PDCA & KVP (M05-962 mtf), Testprotokoll
(M05-963 mc), Passwörter & Authentifizierung (M06-973 mehrfach), Lastenheft & Pflichtenheft (M04-928 mc);
(b) Stufe-4-Auslegung „Mix je Thema" – rechenbares Thema mehrschrittig mit Rechnung, die übrigen fünf als
Transfer auf eine neue Situation. Wirkung: jedes der 6 Themen hat jetzt genau 1 St4; Themen ohne St4 41 → 35.
Kein Version-Bump, Sollwerte unverändert (kein neuer Typ).
G2.4 #16 FERTIG 2026-07-19: +4 szenario2 an pool/pool_m_szenario2.json angehängt, Typ-Bestand 6 → 10,
Pool 826 → 830. Nutzer-Entscheide: (a) „Lücken schließen" – M02/M03/M05 hatten noch keine szenario2;
(b) Stufenmix 2x St2 / 2x St3. Neu: M02-926 St3 Bezugskalkulation & Skonto (Angebotsvergleich über den
Bezugspreis), M03-909 St2 Netzwerkkomponenten & Medien (120-m-Strecke, 100-m-Grenze), M03-910 St3
Wirtschaftlichkeit & TCO (Anschaffung vs. Energie über 5 Jahre), M05-964 St2 Testprotokoll (Durchlauf bei
nicht erfüllter Vorbedingung = ungültig). Der Typ deckt jetzt ALLE sieben AP1-Module ab. Kein Version-Bump;
Sollwerte unverändert (registry/meta zählen pro Typ, nicht pro Frage).
G2.5 #33 FERTIG 2026-07-19: +6 Englisch in pool/pool_m_g2_englisch.json, Pool 830 → 836; Thema „Englische
Fachtexte" 13 → 19. Nutzer-Entscheide: (a) Textsorten-Paket „Betrieb & Beschaffung", (b) 3 mc / 3 mehrfach,
St2+St3 gemischt. Neu (alle M02/AP1, Muster M02-734, keine Vokabel-Zuordnung): M02-958 mc St2 End-of-Life
Notice, M02-959 mehrfach St3 Returns Policy/RMA, M02-960 mc St2 Request for Quotation, M02-961 mehrfach St3
Incident Report, M02-962 mc St3 Handbuch-Sicherheitshinweis, M02-963 mehrfach St2 Privacy Notice. Alle
Textsorten waren im Bestand noch nicht vertreten. Kein Version-Bump, Sollwerte unverändert.
G2.6 #35 FERTIG 2026-07-19: echte Laufzeit-Randomisierung für rechenassistent. logik.js: Mini-Formelparser
L.evalFormel (kein eval), L.rundeAuf/toleranzFuer/zahlAusText/zieheWert/fuelleText/rechneAufgabe;
L.instanziiere rechnet Aufgaben mit „variablen" zur Laufzeit durch (wirft NIE – Rückfallebene);
gradeRechenassistent prüft berechnete Schritte numerisch mit 1-Cent-Toleranz; Validator + JSON-Schema
kennen beide Bauformen und prüfen ALLE Extremkombinationen. 23 von 25 Aufgaben migriert (M04-538 und
M02-535 behalten feste Varianten – Textantworten, Nutzer-Entscheid „Hybrid"). Gegenprobe: 234 alte
Sollwerte exakt reproduziert, 46 Erklärungstexte byte-genau zurückgefüllt, danach alle 23 von Hand
nachgelesen (5 Zahlen-Kollisionen + 1 Altfehler in M02-540 korrigiert). Neue Suite tests/test_rechnen.js
(64) → sollwerte.env `rechnen=64`, jetzt 25 Suiten. Migrationsskripte in tools/migration/.
→ **GRUPPE G2 KOMPLETT UND VERÖFFENTLICHT 2026-07-19**: APP_VERSION 0.9.0, sw.js ap1-v0.9.0, CHANGELOG,
alle 25 Suiten grün, Commit b66cdfd auf origin/main, refs/tags/v0.9.0 durch die CI erzeugt.
NÄCHSTE GRUPPE: **G3 Lernmotor → v0.10.0**. Detailplan „AP2-G3" ist am 2026-07-19 in PLAENE.md ANGELEGT
(Bestandsaufnahme + Task-Zerlegung G3.1–G3.6 + offene Entscheide E1–E3). Der Plan hat drei Kollisionen mit
dem Bestand aufgedeckt: (1) es gibt bereits ein Wiedervorlage-System (Fehler-Deck mit Fälligkeiten), das
sich mit Leitner überschneidet; (2) die Statistik ist THEMEN-, nicht fragebasiert → Leitner/Meisterung
brauchen neue State-Struktur + STATE_VERSION 5→6; (3) es gibt bereits eine globale Schwierigkeits-Mechanik
mit Level-Dialog, die #6 durch themenweise Automatik ersetzen würde.
Die zugehörigen Entscheide E1 (Fehler-Deck vs. Leitner), E2 (Migration der Bestandsdaten) und E3 (Zukunft
der globalen Stufe) hat der Nutzer am 2026-07-19 bewusst VERTAGT → G3.1–G3.3 sind blockiert.
ARBEITSFÄHIG OHNE DIESE ENTSCHEIDE waren: G3.4, G3.5, G3.6(a).
STAND 2026-07-19 (Nutzer: „mache g3.4 und g3.6(a), Rest zurückstellen"):
- G3.4 #27 FERTIG. Befund: war als #60 bereits umgesetzt (zeigeThemenSerieAngebot, getestet in
  test_engine E4). Einzige Änderung: Adaptiv-Gate (>30 beantwortete Fragen) an der Aufrufstelle entfernt,
  damit das Angebot „Mehr zu diesem Thema üben" auch beim Einstieg erscheint.
- G3.6(a) #5 FERTIG. Ergebnis-Screen war vollständig; ergänzt wurde der Notenschlüssel: L.note trennt
  jetzt 49–30 (Note 5 mangelhaft) und unter 30 (Note 6 ungenügend); L.NOTEN_SCHLUESSEL +
  L.NOTE_BESTANDEN_AB als Single Source. Neue Suite tests/test_note.js (41) → sollwerte `note=41`,
  jetzt 26 Suiten. TEXTE-Hinweis um die 30er-Grenze ergänzt.
- ZURÜCKGESTELLT: G3.1–G3.3 (blockiert durch E1–E3) und G3.5 (#13, auf Nutzerwunsch).
- KEIN Version-Bump: G3 ist noch nicht abgeschlossen (Ziel 0.10.0).
OFFEN in G3.6: Teil (b) – reale AP1-Gewichte für AP1_AUFGABEN recherchieren (aktuell 25/25/26/24),
Befund vorlegen, erst danach umbauen.
- #10 ~10 Fragen (Cloud/Virt-Container/IPv6/USB4-TB/Wi-Fi7), AP1; IPv6-ADRESSAUFBAU AP1 (Rechnen=AP2).
- #9 6 neue Fälle (faelle.js, breit inkl. M01/M02). #7 ~6 Stufe-4 (dünne Profile via pool_query coverage).
- #16 +4 szenario2 (→10). #33 +6 Englisch (Kurztext+mc/mehrfach).
- #35 ECHTE Laufzeit-Randomisierung rechenassistent (Formel+Wertebereiche, Musterlösung berechnet) → logik.js+Tests.
- Agenten: Haiku (10/16/33), Sonnet (Fälle+#35) auf /tmp; ich rechne JEDE Frage/Formel selbst nach.
  Parallel entwerfen, Integration/Prüfung seriell.

**G3 Lernmotor → v0.10.0** (Ideen 1,6,4,13,27,5)
- #1 SR Leitner 5 Boxen, Intervalle 1/3/7/16/35 Tage; Migration aus S.statistik NACH QUOTE; sichtbar nur im
  „üben"-Fluss; Interleaving „fällig zuerst, bei Gleichstand mischen". SR ERSETZT A3-Gewichtung in naechsteFrage;
  A3 bleibt DORMANT (test_engine=70 bleibt grün).
- #6 Adaptiv default AN (±1 je Thema nach 3, Grenzen 1–4), filtert Stufe. #4 Meisterung 2× in Folge → raus aus Deck.
- #13 kompakte Top-Schwächen-Liste (Thema×Format) auf Statistik-Seite. #27 nur nach FALSCHER Antwort Button
  „Ähnliches üben" (gleiches Thema).
- #5 Sim: Standard-IHK-100-Punkte-Schlüssel (92/81/67/50/30) + Ergebnis-Screen (Note/Punkte/%). REALE AP1-Gewichte:
  ERST recherchieren → Befund VORLEGEN → dann erst umbauen (dieser Teiltask pausiert für Nutzer-Rückmeldung).
- Berührt: logik.js, app_state.js (SR-State + Migration, STATE_VERSION-Bump), app_sim.js, app_seiten/app_pages2,
  app_loeser.js. Neue Suiten test_leitner/test_adaptiv/test_note → neue sollwerte-Keys.

**G4 Technik → v0.11.0** (Ideen 21,29; #32 zurückgestellt)
- #21 EAGER-Split fragen.js je Modul (mehrere <script src>, alle beim Start) — Offline-Doppelklick garantiert;
  sw.js APP_FILES + build_fragen.py anpassen.
- #29 Deep-Links: Hash-Routing alle Routen + echter Zurück-Button + Einzelfrage #frage=ID (file://-fähig).

**G5 UX/A11y/Website → v1.0.0** (Ideen 24,26,28,30,31,39)
- #24 ausklappbar „Warum falsch?" (Default zu). #26 Vorlese-Button (Web Speech, Default aus, nur wenn unterstützt).
- #28 Onboarding-Schritt-Tour beim 1. Start (onboardingDone, überspringbar, aus Einstellungen erneut startbar).
- #30 Print-CSS Spickzettel+Statistik. #31 Schriftgröße 3 Stufen + „gut lesbarer Font"-Toggle.
- #39 echte Landing (index.html = Info+Install+„App starten"; start_url/scope/sw.js-Cache anpassen).

QUERSCHNITT: sollwerte.env wächst; STATE_VERSION steigt in G3; je Gruppe Version-Bump+CHANGELOG+sw.js CACHE_VERSION;
Offline-Invariante + „fragen.js nur via build" durchgängig gewahrt.

STAND G1:
- G1.1 #22 JSON-Schema FERTIG 2026-07-18 (tools/build_schema.js→schema/frage.schema.json + validate_schema.js
  mit ajv in .tooling; check.sh-Einbau; 0 Verstöße/858 Obj., Negativtest 15/15; kein Version-Bump).
- G1.2 #23 Render-Smoke FERTIG 2026-07-18 (tests/test_render_smoke.js, je L.TYP 1 reale Frage über loeseFrage/R_TYP;
  sollwerte render_smoke=21; 21/21 grün, Negativtest greift; kein Version-Bump).
- G1.3 #12 CI FERTIG 2026-07-19 (.github/workflows/ci.yml: ubuntu-latest, node 22, npm install jsdom+ajv nach /tmp,
  voller `bash check.sh` bei push(main)+PR; .assetsignore um .github ergänzt → Deploy-Invariante gewahrt; kein Bump).
- G1.4 #42 Release-Tags FERTIG 2026-07-19 (Job „release" in ci.yml, needs:check, nur push/main, contents:write:
  APP_VERSION aus app_state.js → Tag-Existenz = Bump-Erkennung → CHANGELOG-Auszug (fehlend = BLOCKIEREND) →
  `gh release create`. Nutzer-Entscheide: in ci.yml / v0.7.2 rückwirkend mittaggen / Fehlschlag bei fehlendem
  CHANGELOG. Logik lokal verifiziert inkl. Negativtest; kein Bump).
- G1.5 #46 axe FERTIG 2026-07-19 (tests/test_axe.js, 5 Hauptseiten, BLOCKIEREND bei jedem Verstoß, color-contrast
  aus (jsdom ohne Layout); sollwerte axe=5; axe-core in check.sh-Bootstrap + ci.yml. Nutzer-Entscheide: alle
  Verstöße blockieren / alle 9 IST-Verstöße sofort beheben / als Suite lokal+CI. FIXES: aria-labels für
  Selects+Zahlen-/Datumsfelder+Lückenfelder (Texte aus bestehenden TEXTE-Labels, neue TEXTE-Gruppe `aria`),
  Onboarding-Overlay role=dialog, #actionbar role=region. Alle 23 Suiten auf Sollwert; kein Bump).
- G1.6 #11 PWA-Update FERTIG 2026-07-19 (sw.js: unbedingtes skipWaiting RAUS + message-Listener SKIP_WAITING;
  app_ui.js: PWA_UPDATE_BEREIT/_pwaAktiviere/setFrageOffen/frageOffen (inkl. simLaeuft)/pwaBanner/
  pwaUpdateBereit/pwaVersuchReload; Hooks in clearAktion/loeseFrage/verbucheAntwort/render; TEXTE.pwa +
  .pwabanner; Inline-Guard um updatefound/statechange/reg.waiting/controllerchange erweitert (nur http(s)).
  Nutzer-Entscheide: Auto-Reload im nächsten sicheren Moment (kein Button) / Sim blockiert / Logik in app_ui.js.
  tests/test_pwa.js (22), sollwerte pwa=22; Negativtest greift; alle 24 Suiten auf Sollwert; kein Bump).
- G1.7 #44 Manifest-Screenshots FERTIG 2026-07-19 (tools/make_screenshots.py → screenshot-start.png +
  screenshot-ueben.png, je 412×915, PIL-Nachbau im dunklen App-Look; manifest „screenshots"[] mit
  form_factor narrow + label; sw.js APP_FILES 24→26. Nutzer-Entscheide: PIL jetzt/echte später ersetzbar,
  Format 412×915. Maße/Cache-Abgleich verifiziert; kein Bump).
TOOLING-CAVEAT: .tooling/jsdom hängt hier beim require → jsdom-Suiten über frische /tmp/jt fahren (NODE_PATH).
- GRUPPEN-ABSCHLUSS G1 ERLEDIGT 2026-07-19: APP_VERSION 0.7.2→0.8.0, sw.js CACHE ap1-v0.8.0, CHANGELOG
  v0.8.0; Backup backup_2026-07-19.zip (129 Dateien) VOR dem Bump gezogen (Nutzer-Entscheid „vorher sichern";
  ein rückwirkender v0.7.2-Tag entfällt, da der letzte Commit noch 0.6.0 trägt und F2/F3/S-B/G1 alle
  ungepusht waren → ein Commit bis 0.8.0). Voll-Check-Äquivalent grün (24 Suiten, Drift/UTF-8/Determinismus/
  Schema/Offline), Boot zeigt 0.8.0, Cache-Abgleich vollständig.
→ G1 KOMPLETT, GEPUSHT UND GETAGGT (2026-07-19): origin/main = b22631a, refs/tags/v0.8.0 vorhanden →
  voller check.sh in der CI grün (24 Suiten) + Release-Action funktioniert. Zwei einmalige Hürden gelöst:
  PAT braucht „Workflows = Read and write"; CI-Deps müssen nach .tooling (nicht /tmp), sonst findet
  validate_schema sein ajv nicht. Push→Tag dauert ~4–5 Min.
  NÄCHSTE GRUPPE: G2 (Inhalts-Batches, Ideen 10/9/7/16/33/35 → v0.9.0), Detailplan PLAENE „AP2-G2".
