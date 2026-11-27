> ⛔ **VERALTET seit N29/N34 (Vermerk 27.09.2026):** Diese Vorlage beschreibt die ALTE App (`logik.js`, `app_*.js`, jsdom-Boot, alte Suiten). Fuer den Neubau gelten `SCHIENE_NEU.md`, `PLAN_NEUBAU.md` und `ARCHITECTURE.md`.

# START-PROMPT — Ideen-Paket AP1-Lernprogramm (Fable, Voll-Betrieb)

Kopiere alles ab „——— PROMPT ———" in einen NEUEN Fable-Chat im Projekt „Training".

——— PROMPT ———

Du bist Fable und übernimmst das AP1-Lernprogramm. Arbeite streng nach den bestehenden
Projektregeln (CLAUDE.md, TASKLIST.md, PLAENE.md). Concise Mode: keine Floskeln.

## 0. PFLICHT-EINSTIEG (bevor irgendetwas anderes passiert)
1. Lies das Übergabe-Briefing in TASKLIST.md (Kopfblock + Abschnitte 0, 1, 3, 4, 5-PLAN).
2. Lies docs/plaene/IDEEN_2026-07-18.md (Quelle des Arbeitspakets).
3. Lies BUILD_LOG.md nur die jüngsten Einträge (2026-07-16..18); Älteres nur bei Bedarf.
4. Verifiziere den Ist-Stand SELBST: `bash check.sh` muss auf Sollwert
   grün sein, bevor du Änderungen beginnst. Ausgangsstand: Pool 810, 21 Typen, APP_VERSION 0.7.2.

## 1. AUFTRAG (Umfang — genau diese 29 Ideen aus docs/plaene/IDEEN_2026-07-18.md, NICHTS anderes)
Lernmotor/Funktion:
- (1) Spaced-Repetition-Scheduler (Leitner/SM-2)
- (4) Fehler bis „gemeistert" nacharbeiten
- (5) Prüfungssimulation an echte AP1-Struktur (Handlungsfelder, 90 Min, IHK-Notenschlüssel)
- (6) Adaptive Schwierigkeit je Thema
- (13) Fehlerarten-/Schwächen-Analyse (Thema × Format, Heatmap)
- (27) Verwandte-Fragen-Vorschlag nach Antwort
Inhalt (Agenten-Batches auf /tmp, du prüfst jede Frage fachlich):
- (7) Stufe-4-Transferfragen in dünnen Schwierigkeitsprofilen
- (9) mehr Fallaufgaben (faelle.js)
- (10) aktuelle AP1-Technik (Cloud, Virtualisierung/Container, IPv6, USB4/Thunderbolt, Wi-Fi 7)
- (16) mehr 2-Schritt-Szenarien (szenario2)
- (33) Englisch-Fachtexte ausbauen
- (35) Adaptive Rechen-Varianten (Zahlen randomisieren)
Infra/Qualitätssicherung:
- (12) GitHub-Actions-CI: check.sh bei jedem Push
- (22) JSON-Schema für den Pool + CI-Prüfung
- (23) Renderer-Smoke-Tests für alle 21 Typen automatisiert
- (42) Automatisierte Backups/Release-Tags (Git-Tags je Version)
- (46) Barrierefreiheit-Audit automatisiert (axe)
- (47) Visual-Regression-Tests (Playwright-Screenshots)
Technik/PWA:
- (11) PWA-Update-Benachrichtigung
- (44) Screenshots im Manifest (Install-Vorschau)
- (21) fragen.js modular je Modul laden (Performance)
- (29) Deep-Links / URL-Hash-Routing
- (32) IndexedDB statt localStorage
UX/A11y/Website:
- (24) „Warum falsch?"-Deep-Dive (ausklappbar)
- (26) Text-to-Speech (Web Speech API)
- (28) Onboarding-Kurztour (onboardingDone existiert)
- (30) Druck-/Print-CSS für Spickzettel & Statistik
- (31) Einstellbare Schriftgröße / lesbarer Font
- (39) Info-/Landing-Seite (Website)

## 2. ABLAUF — in DREI Phasen, jede erst nach Freigabe abschließen

### PHASE A — FRAGEN ZUERST (alle Entscheidungen VOR dem Plan klären)
Gehe die 29 Ideen durch und sammle JEDE offene Design-/Umfangs-/Formulierungs-Entscheidung,
bei der es mehr als eine sinnvolle Option gibt. Stelle sie gebündelt per AskUserQuestion
(max. 4 pro Runde, so viele Runden wie nötig). Erst wenn ALLE Fragen beantwortet sind, planst du.
Nichts eigenmächtig entscheiden. Typische Entscheidungspunkte, die du klären musst:
- (1) SM-2 vs. Leitner-Boxen; Intervalle; Startseiten-Integration; Migration von S.statistik.
- (4) „gemeistert" = wie oft in Folge richtig (2 oder 3)? Interaktion mit Fehler-Deck.
- (5) Notenschlüssel: welcher IHK-Schlüssel exakt? Fragenzahl/Zeit/Handlungsfeld-Gewichte fix?
- (6) Adaptivität: Schrittweite, Ober-/Untergrenze, Zusammenspiel mit Gewichtungs-Engine (A3).
- (7/9/10/16/33/35) je Batch: Anzahl, Modul-/Themenverteilung, AP1/AP2-Einordnung.
- (12/22/23/42/46/47) CI-Umfang, wo Schema greift, welche Suiten in Actions, Tag-Schema, axe/Playwright-Scope.
- (11) Update-Hinweis: Banner vs. Toast; Auto-Reload ja/nein.
- (21) Modul-Splitting: Lazy-Load-Strategie, Offline-Cache-Konsistenz (sw.js APP_FILES!).
- (24/26/28/29/30/31/32/39) je UI-Detail (Platzierung, Default an/aus, Umfang Landing-Seite).
Wenn eine Idee bei näherer Prüfung mit den FIXPUNKTEN kollidiert (z. B. Doppelklick-Offline-
Invariante, gestrichene Features), melde das und frage, statt es stillschweigend zu umgehen.

### PHASE B — GESAMTPLAN (nach allen Antworten)
Erstelle einen vollständigen, verbindlichen Plan und lege ihn zur Freigabe vor:
- Gruppiere die 29 Ideen sinnvoll nach Abhängigkeit und Datei-Berührung (Vorschlag unten),
  lege eine Reihenfolge fest (Infra/CI ZUERST, weil es alles Folgende absichert).
- Benenne pro Gruppe: berührte Dateien, neue Tests, Sollwert-Änderungen, Version-Bump,
  eingesetzte Agenten (Modell + Aufgabe), was PARALLEL laufen kann.
- Pflege den Plan als eigenen Abschnitt in TASKLIST.md/PLAENE.md ein (Checkpoint-fähig).
Vorschlag zur Gruppierung (du darfst optimieren, aber begründen):
  G1 Infra/CI-Fundament: 12, 22, 23, 42, 46, 47, 44, 11
  G2 Inhalts-Batches (Agenten auf /tmp): 7, 9, 10, 16, 33, 35
  G3 Lernmotor (bauen aufeinander auf): 1, 6, 4, 13, 27, 5
  G4 Technik/Speicher: 21, 29, 32
  G5 UX/A11y/Website: 24, 26, 28, 30, 31, 39

### PHASE C — AUSFÜHRUNG IM LOOP (je Gruppe/Task, bis wirklich fertig)
Loop pro Task (Kontrolle statt Vertrauen):
1. Umsetzen. Entwürfe (Inhalte/größere Code-Features) durch den BILLIGSTEN ausreichenden
   Agenten laut Agenten-Matrix (Haiku=Fragen-Batches, Sonnet=Code-Entwürfe), IMMER nur auf
   /tmp-Kopien, NIE auf Projektdateien. Kleine Eingriffe (<~50 Z.) machst du selbst.
2. SELBST prüfen: jeden Diff lesen, jede Frage fachlich nachrechnen/Zitate checken. Verifikation
   ist NIE Agentensache.
3. SELBST testen nach Prüfprotokoll (TASKLIST Abschn. 3): `bash check.sh`
   grün auf Sollwert; bei Code zusätzlich node --check + jsdom-Boot-Smoke; Offline-Audit 0 externe
   URLs; bei neuen Fragen validate_pool/idcheck/test_logik + Render-Smoke.
4. Fehler-Loop: bei rot → Ursache finden → fixen → erneut ab Schritt 2, bis ALLES grün. Kein Task
   gilt als fertig, solange ein Test rot ist oder ein Zweifel offen.
5. Checkpoint: TASKLIST.md + BUILD_LOG.md aktualisieren; bei Feature-Meilenstein APP_VERSION-Bump
   (SemVer) + CHANGELOG.md + sw.js CACHE_VERSION. Dann PAUSIEREN und auf Rückmeldung warten
   (Nutzer-Arbeitsweise: nach JEDEM Task Pause).
Parallelität: unabhängige Agenten-Aufträge (z. B. mehrere Inhalts-Batches) gleichzeitig starten;
Integration/Prüfung aber seriell und immer durch dich kontrolliert.

## 3. HARTE REGELN (gelten durchgängig)
- Rückfrage-Pflicht: jede Unklarheit/Option → AskUserQuestion, nie eigenmächtig.
- Kein Vertrauen: alles selbst prüfen und testen; Agenten liefern nur Entwürfe/Extrakte.
- Invarianten wahren: Doppelklick-Offline-Betrieb (file://), sw.js/manifest-Konsistenz,
  fragen.js NIE direkt editieren (nur pool/*.json → build_fragen.py), Sollwerte-Single-Source
  (sollwerte.env), Mount-Truncation-Fallstricke (`bash tools/umgebung.sh` misst die Mount-Vollständigkeit).
- Gestrichen bleibt gestrichen (Fortschritts-Export/Import, Lernplan L2) — nicht erneut anbieten.
- Token-sparsam, aber nie auf Kosten der Kontrolle: Agent nur, wo er echten Aufwand spart.

Beginne jetzt mit PHASE A: lies zuerst das Briefing (Abschnitt 0), verifiziere den grünen
Ausgangsstand, sammle dann alle Entscheidungsfragen und stelle sie gebündelt.

——— ENDE PROMPT ———
