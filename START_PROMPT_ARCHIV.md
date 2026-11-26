# START_PROMPT_ARCHIV – Chronik des Fortsetzungs-Prompts
#
# ROTIERT AM 2026-07-27. Grund: START_PROMPT.md war auf 1270 Zeilen gewachsen, davon 283 „gültiger
# Stand" und 988 Chronik. Das erste Lesen in einer neuen Sitzung brach am Token-Limit ab, und der
# Kopf widersprach sich selbst – drei Abschnitte „HIER ANFANGEN", zwei längst ausgelieferte
# Release-Blöcke, „Etappe 1 ist der nächste Griff" acht Zeilen über „Etappe 1 ist komplett".
# **Regel ab jetzt: wie beim BUILD_LOG nach jedem Release rotieren.** Hier wird NICHTS gelöscht.
#
# ⚠️⚠️ **STATUS-AUSSAGEN IN DIESER DATEI SIND ÜBERHOLT.** Sätze wie „APP_VERSION steht auf 1.7.0",
#   „NEU OFFEN: …" oder „liegt uncommittet im Baum" stimmten zu ihrem Zeitpunkt und sind heute
#   falsch. Am 26.07. mussten drei solche Sätze als überholt entlarvt werden – einer hätte fast zu
#   einem falschen `git add` geführt.
#   **Es gilt START_PROMPT.md, und gemessen wird am Code.** Hier wird GEZIELT nachgeschlagen, wenn
#   eine konkrete Frage auftaucht („warum ist X so gebaut?"), nicht der Reihe nach gelesen.
#
# ══════════════════════════════════════════════════════════════════════════════════════════════
# TEIL A – DER KOPF, WIE ER BIS ZUM 27.07.2026 AUSSAH (Stand v1.10.1, Etappe 5 fertig)
# Vollständig erhalten, weil hier die Begründungen der Etappen 0/1/4/5 und der CI-Diagnose stehen.
# ══════════════════════════════════════════════════════════════════════════════════════════════

# Fortsetzungs-Prompt (in neuen Chat kopieren) – Stand 2026-07-27, **v1.9.0 COMMITTET, PUSH DURCH NUTZER**
# (Qualitätsrunde Q1: Etappe 0 ist durch und freigegeben. Etappe 1 ist der nächste Griff.)
#
# ══════════ ✅ v1.9.0 IST DRAUSSEN – NICHTS ZU PUSHEN, NICHTS NEU ZU COMMITTEN ══════════
# Freigabe am 27.07., **vom Windows-Rechner gepusht und vom Nutzer bestätigt („1.9 ist durch")**.
# Release-Commit **6321d11**, Doku-Nachtrag **684a593**. Bei grüner CI legt die Release-Action
# `refs/tags/v1.9.0` an, Cloudflare deployt → https://ap1-lernprogramm.fisi2026lernapp.workers.dev
# ⚠️ **NIEMALS UNGEFRAGT PUSHEN.** Die Freigabe galt NUR für v1.9.0.
# ⚠️ Der lokale `origin/main`-Ref bleibt stale (Push kam aus einem anderen Prozess) – das ist KEIN
#    Hinweis auf einen Fehlschlag. `git ls-remote`/`git fetch` scheitern am Sandbox-Proxy (403).
# ⚠️ `bash ci2.sh` läuft NUR auf dem Windows-Rechner (bricht in der Sandbox mit Code 2 ab).
#
# ══════════ ►►►►►► ZUERST MESSEN, DANN GLAUBEN ◄◄◄◄◄◄ ══════════
# ⚠️ **FANG JEDEN CHAT MIT `git status --porcelain` UND `git log --oneline -3` AN.** Am 27.07. stand
#    hier und in TASKLIST „Arbeitsbaum sauber" – tatsächlich lagen 17 geänderte Dateien vom 26.07.
#    im Baum. Der Satz stimmte, als er geschrieben wurde, und war am selben Abend falsch.
#
# ══════════ ✅ ETAPPE 0 DER QUALITÄTSRUNDE Q1 IST FERTIG (2026-07-27) ══════════
# Umgesetzt und selbst nachgemessen (Details: BUILD_LOG ganz oben, Plan: PLAENE.md):
#   * **NEUE SUITE `tests/test_didaktik.js` (29, `sollwerte.env didaktik=29`)** mit vier RATSCHEN.
#     Die Schwellen stehen als KONSTANTEN IM TEST, nicht in sollwerte.env (dort stehen Testanzahlen).
#     - „längste Antwort ist die richtige": **209/274 = 76,3 %**, Schwelle **78**, Ziel **45**.
#       ⚠️ GLEICHSTAND ZÄHLT ALS TREFFER. Auf „strikt länger" umzustellen würde den Wert über Nacht
#       auf 72,6 % senken, ohne dass sich eine Frage geändert hat. NICHT TUN.
#     - „Stufenlücke": **4** (M06 BSI {1,3,4} · M07 Abnahme {1,3} · M07 Change {1,3} · M08 Tarif
#       {1,2,4}), nach Etappe 6 auf 0.
#     - „Gebiets-Unwucht": kleinstes AP1-Gebiet **A4 22/799 = 2,75 %**, Schwelle **2,5**.
#       ⚠️ NACH ETAPPE 5 AUF 5,0 ANHEBEN – die einzige Schwelle, die steigen darf.
#     - „Abkürzung ohne Lexikoneintrag": **196 Treffer in 42 Kürzeln**, Schwelle 196.
#       ⚠️ **„IT" allein sind 72 davon** – ob es ins Lexikon kommt, ist in ETAPPE 1 zu klären.
#   * **M06-304 auf ECDHE umgestellt** (der einzige fachliche Befund des Prüfberichts). Optionen
#     dabei auf gleiche Länge gebracht → Längen-Wächter 210 → 209.
#   * **COVERAGE.md Abschnitt 2 UND 3 neu erhoben.** Nicht nur „Englische Fachtexte" war falsch,
#     sondern fünf Urteile (dazu Security by Design, Wertschöpfung, GUI-Maskenentwurf, KI).
#   * **41 von 42 Suiten grün** (nur test_axe, npm 403 – seit v1.6.0 akzeptiert), Drift 0,
#     Pool unverändert 983 Fragen + 9 Fälle.
#
# ✅ **FREIGABE ERTEILT 27.07., RELEASE-COMMIT 6321d11 LIEGT LOKAL.** APP_VERSION 1.9.0,
#    sw.js ap1-v1.9.0, CHANGELOG-Block v1.9.0. Die 24 Dateien enthalten auch die 17 vom 26.07.
#    liegengebliebenen (BUILD_LOG-Rotation, Q1-Plan, toter Code raus, SW-Cachelisten-Wächter) –
#    so vom Nutzer entschieden. Voller Prüflauf auf dem Release-Stand gefahren.
# ⚠️ **OFFEN BEIM NUTZER:**
#   1. **PUSH von v1.9.0** vom Windows-Rechner (siehe Kopf). Bei grüner CI legt die Release-Action
#      `refs/tags/v1.9.0` an, Cloudflare deployt → https://ap1-lernprogramm.fisi2026lernapp.workers.dev
#   2. **SICHTPRÜFUNG `m06_304_ecdhe_sichtpruefung.html`** (alt/neu nebeneinander). Die Freigabe
#      kam ohne ausdrückliche Rückmeldung dazu; kommt später ein Befund, wird er als **v1.9.1**
#      nachgezogen, nicht in Etappe 1 gemischt.
#   3. **HANDY-TEST v1.8.0** ist weiterhin nicht gelaufen – einmal anbieten (v1.9.0 ändert
#      sichtbar nur die eine TLS-Frage, der offene Test von v1.8.0 bleibt der größere).
#
# ══════════ ►►►►►► HIER ANFANGEN: ETAPPE 1 LÄUFT – ALS NÄCHSTES M06 ◄◄◄◄◄◄ ══════════
# **347 Fragen** in drei Modulen. **Reihenfolge auf Nutzer-Entscheid 27.07.: M05 → M06 → M04**
# (nicht wie im Plan notiert M04 zuerst – die drei hängen nicht voneinander ab, und das kleinste
# zuerst bringt die erste Befundliste früh). Diese drei Module überhaupt zuerst, WEIL M09 sie
# nicht berührt. Verfahren und Regeln: PLAENE.md, Etappe 1.
#   ✅ **M05 IST FERTIG (65 Fragen, 27.07.).** 2 Widersprüche, 1 Formulierung, 4 Sprachfehler
#      korrigiert; Längenausgleich in 18 mc + 3 mehrfach. Poolweit **76,3 % → 69,7 %**,
#      `SCHWELLE_LAENGSTE` 78 → **71**. „IT" ins Lexikon (112 → 113), `SCHWELLE_ABK` 196 → **124**.
#      41 von 42 Suiten grün, Drift 0. **Liegt uncommittet im Baum** – Release v1.10.0 ist erst
#      nach ALLEN DREI Modulen vorgesehen.
#   ✅ **M06 IST FERTIG (103 Fragen, 27.07.).** 3× dieselbe überholte Kryptografie (RSA-2048 →
#      ECDHE, SHA-256 → Argon2id, Hybrid-Erklärung), M06-301 hatte ZWEI vertretbare Antworten,
#      6 Sprachfehler; Längenausgleich in 22 mc + 4 mehrfach. **72,7 % → 63,7 %**, Schwelle → 65.
#      ⚠️ Dabei **Wächter-Regel korrigiert**: `MIN_OPTIONSLAENGE = 25` – Fragen mit lauter kurzen
#      Optionen („200 GB" gegen „150 GB") zählen nicht mehr mit. Das HOB den Istwert (69,7 → 72,7 %),
#      weil der Nenner schrumpfte. **Keine Pool-Verbesserung. Nicht weiter an der Regel drehen.**
#      Suite 29 → 32, `sollwerte.env didaktik=32`.
#   ✅ **M04 IST FERTIG (179 Fragen, 27.07.) – ETAPPE 1 IST DAMIT KOMPLETT.**
#      ⚠️⚠️ **DIE ERSTE FALSCH MARKIERTE ANTWORT DER GANZEN RUNDE: M04-107.** Rabattstaffel mit
#      Wertebereichen – markiert war `switch`, richtig ist die `if-else-if`-Kette (switch vergleicht
#      auf Gleichheit mit Einzelwerten, kann keine Bereiche und keine Kommazahlen). `loesungIndex`
#      0 → 1. **DER EINZIGE LÖSUNGSINDEX-WECHSEL DER RUNDE** – steht so im CHANGELOG.
#      ⚠️ **M04-501 brachte das Gegenteil bei:** `WENN zaehler = 5 DANN` war als Fehler markiert
#      („= ist eine Zuweisung"), obwohl SECHS andere Fragen desselben Themas genau diese Schreibweise
#      als korrekt zeigen. Jetzt in C-Syntax, damit die Begründung stimmt.
#      Dazu 6 weitere Befunde; Längenausgleich in 31 mc + 2 mehrfach. **63,7 % → 50,6 %**, Schwelle → 52.
#      ✅ **Selbst nachgerechnet und ohne Befund:** 20 Schreibtischtests Zeile für Zeile,
#      15 Subnetting-Aufgaben, 60 Konsolenbefehle. Das ist der solideste Teil des Pools.
#
# ══════════ ✅ v1.10.1 IST DRAUSSEN – NICHTS ZU PUSHEN, NICHTS NEU ZU COMMITTEN ══════════
# Release-Commit **f891af3**, am 27.07. gepusht, **CI GRÜN**, `refs/tags/v1.10.1` steht auf dem
# Remote (vom Nutzer belegt), Cloudflare hat deployt →
# https://ap1-lernprogramm.fisi2026lernapp.workers.dev
# ⚠️ **NIEMALS UNGEFRAGT PUSHEN.** Die Freigabe galt NUR für v1.10.1.
# ⚠️ **EINEN TAG v1.10.0 WIRD ES NIE GEBEN.** Der Commit 61ced9a ist gepusht, sein CI-Lauf war rot
#    (30247883708), die Version ist auf 1.10.1 weitergezogen. Die Release-Action taggt nur grüne
#    Stände – das ist gewolltes Verhalten, kein Fehler. **Nicht „nachtaggen" wollen.**
#    Der v1.10.0-Inhalt (Etappe 1, 347 geprüfte Fragen) ist in v1.10.1 vollständig enthalten.
# v1.10.1 selbst: derselbe Inhalt plus der Fix, der die CI rot gemacht hat.
#
# ⚠️⚠️ **DER GRUND WAR NICHT v1.10.0, SONDERN EINE SUITE, DIE WÜRFELT.** `test_axe` rendert die
#    Üben-Seite, und die zieht ihre Frage über `L.pick(arr, Math.random)`. ~32 von ~922 Fragen sind
#    `hotspot` → die Suite prüfte eine ZUFÄLLIGE Frage und traf einen Typ mit ~3,5 % pro Lauf.
#    Gemessen: CI traf M03-471 (3 Zonen), mein erster lokaler Lauf auf DEMSELBEN Commit traf
#    M01-483 (8 Zonen), drei weitere Läufe auf demselben Commit waren grün.
#    **Der Fehler lag seit R10 (a) im Code – die Suite hatte ihn nur nie gezogen.**
#    ⚠️ **EINE PRÜFUNG, DIE WÜRFELT, IST KEINE PRÜFUNG.** test_axe prüft jetzt zusätzlich JE
#    FRAGETYP eine feste Frage (`POOL.find`, kein Zufall). `sollwerte.env axe 5 → 26`.
# ⚠️⚠️ **npm GEHT WIEDER – DIE 403-SPERRE IST WEG.** test_axe lief am 27.07. zum ersten Mal in der
#    Sandbox. **„41 von 42 Suiten" ist überholt: es sind 42.** Der volle Lauf meldet ALLES GRÜN.
# ⚠️ **DER DETERMINISTISCHE TEST FAND ACHT WEITERE FRAGETYPEN** (Nutzer-Entscheid: alle beheben):
#    `label` (critical) in lueckentext · rechenassistent · trace (12 Felder!) · konsole ·
#    kalkulation; `aria-command-name` in beschriftung · baukasten; `empty-table-header` in
#    kreuztabelle. **Fünf Fragetypen waren für blinde Lerner praktisch unbedienbar.**
#    Neun Gegenproben gefahren, jede beißt genau bei ihrem Typ. Details: BUILD_LOG ganz oben.
#
# ►►► **WAS DAVON NOCH OFFEN IST:**
#   1. ⚠️⚠️ **ci2.sh WAR BLIND UND IST AM 27.07. KORRIGIERT WORDEN.** Es nahm `gh run list --limit 1`,
#      also den NEUESTEN Lauf überhaupt – und das war ein GRÜNER Cloudflare-Bot-Lauf auf einem
#      PR-Branch. „Fehlgeschlagene Schritte im Detail" blieb dadurch LEER, während main rot war.
#      Das ist genau die Fehlerklasse, vor der der Kopf des Skripts selbst warnt: eine Prüfung, die
#      Erfolg meldet, ohne zu prüfen. Jetzt schaut es auf **`--branch main`** UND zusätzlich auf den
#      **letzten `--status failure`-Lauf auf main** mit `--log-failed`. Syntax und Abbruch-Wächter
#      (kein gh → Rückgabewert 2, ci_log.txt bleibt unangetastet) nachgemessen.
#      ⚠️ **LEHRE: „der letzte Lauf" ist nicht „der Lauf meines Pushes".** Fremde Bots (Cloudflare
#      legt PRs an) schieben sich davor. Immer auf den Branch filtern, der getaggt werden soll.
#   2. **PUSH von v1.10.1** vom Windows-Rechner, danach `bash ci2.sh`. **NIEMALS UNGEFRAGT PUSHEN.**
#      Erst bei grüner CI entsteht `refs/tags/v1.10.1` und Cloudflare deployt.
#      ⚠️ Ein Tag `v1.10.0` wird es NIE geben – der Commit ist gepusht, der Lauf war rot, die
#      Version ist weitergezogen. Das ist kein Fehler, sondern das gewollte Verhalten der Action.
#   3. **SICHTPRÜFUNG `m04_korrekturen.html`** war beim Freigeben nicht ausdrücklich bestätigt.
#      Kommt später ein Befund, wird er als **v1.10.2** nachgezogen, nicht in die nächste Etappe gemischt.
#   4. **HANDY-TEST v1.8.0** ist weiterhin offen. ⚠️ Mit v1.10.1 lohnt zusätzlich ein Blick auf die
#      Fragetypen mit Eingabefeldern (Schreibtischtest, Konsole, Kalkulation) – dort wurden Namen
#      ergänzt. Sichtbar ändert sich nichts, aber genau das ist die Behauptung, die zu prüfen wäre.
#
# ══════════ ✅ ETAPPE 4 IST FERTIG (27.07., vorgezogen) ══════════
# **44 Stufe-1-Einstiegsfragen für 22 Feinthemen** geschrieben, je 2. Vorgezogen, weil Etappe 2
# bis zum Klausurtermin gesperrt ist. Stil vom Nutzer bestätigt („sieht gut aus").
#   * Pool **983 → 1027**, Stufe 1 **132 → 176**, Feinthemen ohne Stufe-1-Einstieg **26 → 4**
#     (die vier verbleibenden sind die bewusst ausgenommenen AP2-Themen).
#   * Typen: 27 mc + 17 zuordnung. **Kein `erklaeren`** (speist das Glossar), **kein `lueckentext`**
#     (laut Plan Restposten, nicht Teil der Runde).
#   * Längen-Tell **50,6 % → 45,6 %**, `SCHWELLE_LAENGSTE` 52 → **47**. A4 2,75 → 2,85 %.
#   * 41 von 42 Suiten grün, Drift 0, **keine Sollwert-Änderung nötig**. COVERAGE.md nachgezogen.
#   ⚠️ **LIEGT UNCOMMITTET IM BAUM** – Freigabe für Release v1.11.0 steht aus.
#
# ⚠️⚠️ **DIE WICHTIGSTE LEHRE AUS ETAPPE 4: DER LÄNGEN-TELL ENTSTEHT BEIM SCHREIBEN VON SELBST.**
#    Im ersten Entwurf hatten 5 von 6 mc-Fragen die richtige Antwort als längste Option – ohne
#    Absicht. Die richtige Antwort ist eben die vollständige, die Distraktoren sind knapp gesagt.
#    **Genau so ist der Tell über Jahre entstanden.** Über alle drei Batches mussten 14 Distraktoren
#    nachgezogen werden. **Bei Etappe 5 und 6 vor dem Einsortieren messen** – `apply_stufe1.py`
#    prüft es per `assert` mit und weist jede Frage mit Tell zurück.
# ⚠️ **DER RÜCKGANG AUF 45,6 % KAM AUS DEM NENNER, NICHT AUS EINER KORREKTUR.** Der Zähler blieb
#    bei 124 Treffern. Das Ziel 45 % **darf nicht durch weiteres Hinzufügen erreicht werden** –
#    die Altlasten liegen in M01/M02/M03/M07/M08 und gehören in Etappe 3 einzeln angefasst.
#
# ══════════ ✅ ETAPPE 5 IST FERTIG (27.07.) – A4 AUSGEBAUT ══════════
# **18 neue Fragen** im dünnsten AP1-Gebiet. Pool **1027 → 1045**, A4 **24 → 42** (2,85 → 4,88 %).
#   * **NEUES FEINTHEMA `M07|Einweisung & Schulung` (14 Fragen)**, Nutzer-Entscheid 27.07.
#     Registriert in `L.THEMA_RELEVANZ` (Gewicht 2) UND `L.THEMA_GEBIET` – beides Single Source.
#     ⚠️ Diese Inhalte gehören NICHT unter „Abnahme & Übergabe": **Abnahme ist der Rechtsakt,
#     Einweisung die Leistung danach.** Genau diese Trennung prüft M07-038.
#   * **STUFENLÜCKEN 4 → 2** (aus Etappe 6 vorgezogen): Abnahme & Übergabe und Change Management
#     haben jetzt je eine Stufe-2-Frage. Offen bleiben M06 BSI-Grundschutz und M08 Tarifrecht.
#   * **Gebiets-Wächter 2,5 → 4,8** – ⚠️ **NICHT auf die im Plan genannten 5,0.** A4 liegt bei
#     4,88 %, weil der NENNER mitwuchs (799 → 861). Nutzer-Entscheid: **die Schwelle folgt der
#     Messung, nicht die Messung der Planzahl.** Zwei Fragen für eine runde Zahl zu schreiben wäre
#     die verkehrte Richtung.
#   * **Längen-Tell 45,6 → 43,8 %**, Schwelle 47 → **45** (tiefer lässt der Test es nicht,
#     `SCHWELLE >= ZIEL`). ⚠️⚠️ **DAS ZIEL IST RECHNERISCH UNTERSCHRITTEN UND INHALTLICH NICHT
#     ERREICHT:** Der Zähler steht seit Etappe 1 bei **124**, gesunken ist nur der Nenner.
#     **Seit Etappe 1 wurde keine einzige schlechte Bestandsfrage verbessert.** Etappe 3 bleibt fällig.
#   * ⚠️ **DIE LEHRE AUS ETAPPE 4 HAT SOFORT WIEDER ZUGESCHLAGEN:** 4 von 12 mc-Fragen hatten im
#     Entwurf die richtige Antwort als längste, zweimal auf das Zeichen genau. Vor dem Einsortieren
#     gemessen und nachgezogen. **Für Etappe 6 gilt dasselbe: erst messen, dann einsortieren.**
#   * Drei Sollwerte mitgezogen: test_engine „73 distinct Themen" → 74, test_themenauswahl
#     „73 poolweit" → 74. sollwerte.env unverändert (keine Suite änderte ihre ANZAHL).
#   * 42 von 42 Suiten grün, Drift 0, fakten_check 0 Verdachtsfälle.
#   ⚠️ **LIEGT UNCOMMITTET IM BAUM** – zusammen mit Etappe 4 ergibt das **v1.11.0**, Freigabe offen.
#   📄 Render-Abzug zur Sichtprüfung: **`etappe5_a4_ausbau.html`**
#
# ══════════ ►►► DANACH: ETAPPE 2 (M09) UND ETAPPE 6 ◄◄◄ ══════════
# **Etappe 6** (Stufe 4 + die zwei verbliebenen Stufenlücken) berührt M09 nicht.
#
# ══════════ ►►► ETAPPE 2 – M09 AUFLÖSEN ◄◄◄ ══════════
# ⛔ **FRÜHESTENS 01.08.2026** – die Klausur ist am 31.07. Vorher KEINE M09-Datei anfassen.
# Katalogabgleich → Passendes in M01/M02/M03/M07/M08 eingliedern → Rest löschen (Liste vorher
# VORLEGEN) → Menüpunkt bleibt, `pool_m09_unterricht.json` wird geleert, Termin/Countdown auf
# „kein Termin gesetzt". Details: PLAENE.md, Etappe 2.
# Je Frage: markierte Antwort verifizieren → jeden Distraktor prüfen → **Distraktorlängen
# angleichen (NIEMALS die richtige Antwort kürzen)** → Erklärung gegenhalten.
# Befunde je Modul SAMMELN und vorlegen, nicht einzeln korrigieren. Nach jedem Modul:
# `build_fragen.py`, Drift 0, `fakten_check.py`, **Längen-Schwelle auf Istwert + 1 senken**,
# Render-Abzug zur Sichtprüfung.
# ⚠️⚠️ **LEHRE AUS M06 – EIN SACHBEFUND IST EIN VERDACHT AUF EINE FEHLERKLASSE.** Der TLS-Befund
#    des Prüfberichts galt als Einzelfall; im selben Modul lagen **drei weitere Fundstellen**, die
#    den veralteten Stand sogar als vorbildlich markierten. Nach JEDEM fachlichen Befund poolweit
#    nach demselben Muster suchen, nicht nur die gemeldete Stelle korrigieren.
# ⚠️⚠️ **LEHRE AUS M05 – NICHT ÜBER DAS ZIEL HINAUSSCHIESSEN.** Der erste Entwurf machte die
#    Distraktoren fast doppelt so lang wie die richtige Antwort (M05-770: 138 gegen 220/218/211).
#    **Der Wächter meldet das NICHT** – er misst nur „richtige ist die längste". Der Lerner würde
#    dann eben „nimm die kürzeste" lernen. **Ziel ist Gleichstand ±15 %, mit mindestens einem
#    Distraktor über der Länge der richtigen Antwort.** Der Helfer rechnet je Frage `Tell alt →
#    Tell neu` aus und listet die noch offenen IDs – diese Liste muss leer sein.
#
# ══════════ ✅ v1.8.0 IST DRAUSSEN – NICHTS ZU PUSHEN, NICHTS NEU ZU COMMITTEN ══════════
# Der Nutzer hat am 26.07. Freigabe erteilt, **vom Windows-Rechner gepusht und bestätigt („1.8 ist
# drauf")**. Release-Commit **3cc5bdf**. Lokal nachgemessen: oberster Commit stimmt, Arbeitsbaum sauber.
# Bei grüner CI legt die Release-Action `refs/tags/v1.8.0` an, Cloudflare deployt:
# https://ap1-lernprogramm.fisi2026lernapp.workers.dev
# * ⚠️ **NIEMALS UNGEFRAGT PUSHEN.** Die Freigabe vom 26.07. galt NUR für v1.8.0.
#   **`push.sh` NICHT benutzen** (legt bei jedem Lauf `.git_broken_old` an).
# * ⚠️ `git ls-remote` aus der Sandbox ist SINNLOS (Proxy-403). Der lokale `origin/main`-Ref bleibt
#   stale, weil der Push aus einem anderen Prozess kam – das ist KEIN Hinweis auf einen Fehlschlag.
# * ⚠️⚠️ **`bash ci2.sh` GEHT NUR AUF DEM WINDOWS-RECHNER, NICHT IN DER SANDBOX.** Gemessen am
#   26.07.: `gh: command not found` – die GitHub-CLI ist hier nicht installiert und wegen des
#   Proxys auch nicht nachinstallierbar. **Und das Skript endet trotzdem mit Rückgabewert 0**,
#   meldet also einen Erfolg, den es nicht hatte. Wer den CI-Status braucht: den NUTZER fragen
#   oder ihn `ci2.sh` auf seinem Rechner laufen lassen. NIE aus der Sandbox einen CI-Status
#   behaupten.
#
# ══════════ ►►►►►► HIER ANFANGEN: QUALITÄTSRUNDE Q1 IST FERTIG GEPLANT ◄◄◄◄◄◄ ══════════
# Der Nutzer hat am 26.07. eine komplette Analyse beauftragt, ALLE Rückfragen beantwortet und die
# Umsetzung geplant. **ES IST NICHTS MEHR OFFEN. NICHT ERNEUT FRAGEN — ANFANGEN.**
#
#   ►►► DER PLAN STEHT IN: **PLAENE.md, Abschnitt „🚩 GESAMTPLAN QUALITÄTSRUNDE Q1"** ◄◄◄
#       Dort stehen alle Nutzer-Entscheide in einer Tabelle, die Begründung der Reihenfolge und
#       sieben Etappen mit Releases. Hintergrund/Messwerte: `PRUEFBERICHT_2026-07-26.md`.
#
#   ✅ **ETAPPE 0 IST AM 27.07. ERLEDIGT** (alle sieben Punkte – siehe der Block ganz oben).
#      Dieser Absatz bleibt nur als Beschreibung dessen stehen, was gebaut wurde. **NICHT ERNEUT
#      BAUEN.** Der nächste Griff ist ETAPPE 1 (Batch-Prüfung M04/M05/M06).
#
# ⚠️⚠️ **DER WICHTIGSTE BEFUND, DER DIE GANZE RUNDE AUSLÖST:** In **210 von 274 MC-Fragen (76,6 %)
#    ist die richtige Antwort die LÄNGSTE Option** (Zufallserwartung 25 %). Wer „nimm die längste"
#    anwendet, liegt in drei von vier Fällen richtig, ohne etwas zu wissen. Entschärft wird das
#    beim Angleichen der DISTRAKTOREN — **NIEMALS die richtige Antwort kürzen**, das kostet
#    fachliche Präzision. Die Optionen werden übrigens beim Anzeigen gemischt, die auffällige
#    Positionsverteilung (71 % auf Platz 1) ist deshalb KEIN Problem und darf nicht „repariert" werden.
#
# ⛔ **M09 IST BIS EINSCHLIESSLICH 31.07.2026 TABU.** Die Klausur ist an diesem Tag; bis dahin wird
#    an M09 keine Datei angefasst. Ab 01.08. gilt Etappe 2 (eingliedern, Rest löschen, Menüpunkt
#    bleibt für künftige Klausuren). **Reihenfolge deshalb: erst M04/M05/M06 prüfen (die M09 nicht
#    berührt), dann M09, dann M01/M02/M03/M07/M08** — sonst werden Fragen zweimal angefasst.
#
# ══════════ (erledigt) WAS NACH DEM PUSH ANSTAND ◄◄◄ ══════════
#   1. **HANDY-TEST v1.8.0 ANBIETEN.** Sichtbar geändert haben sich (a) ALLE langen Erklärungen
#      (Kernsatz/Stichpunkte/„Merke:") und (b) die Reihenfolge der Feinthemen beim Üben. Beides
#      lohnt einen Blick auf dem Gerät. Der Handy-Test für v1.7.0 ist erledigt, der zählt nicht mehr.
#   2. **FB-R3 IST INHALTLICH DURCH** (Punkte 1–12). Es gibt KEINEN offenen R3-Rest.
#      Punkt 9 Teil 2 („Lücken") ist gegenstandslos – meine Rückfrage hatte eine falsche Prämisse
#      (der Pool trägt keine Lernfeld-Tags, kein Gebiet ist leer). NICHT wieder aufwärmen.
#   3. ✅ **„dünne Bereiche" IST BEANTWORTET UND EINGEPLANT.** 26 von 73 Feinthemen ohne Stufe-1-
#      Frage; davon werden **22 (AP1-Gebiete A1–A5) mit je 2 Fragen** geschlossen = 44 Stück.
#      Das ist **ETAPPE 4** des Gesamtplans. Datenbasis in PLAENE.md. **Keine offenen Fragen mehr.**
#   4. 📌 **ZWEITER VORGEMERKTER PLAN: „STARTLAST"** (PLAENE.md). 2 548 KB roh / ~686 KB gzip beim
#      Start, davon `erklaerungLang` 545 KB. **Nutzer-Entscheid 26.07.: nur planen, nicht anfassen.**
#      Vor jedem Umbau dort zuerst die Startzeit AUF EINEM GERAET messen – bisher gibt es nur
#      Dateigrößen.
#   5. **CODE- UND POOL-ANALYSE VOM 26.07. IST DURCH** (voller Durchgang auf Nutzer-Wunsch).
#      Keine inhaltlichen Widersprüche, keine doppelten Aufgaben. Vier Befunde behoben (totes
#      AP2-Federpaar, drei tote Funktionen, zwei leere Zusicherungen, doppelter Stufen-Rückfall),
#      einer geplant (Startlast). Details im BUILD_LOG. **Nicht erneut durchkämmen**, solange sich
#      der Pool nicht wesentlich ändert.
#   6. ⏰ **FÄLLIG AB 01.08.2026: DER M09-KLAUSURTERMIN IST ABGELAUFEN.** Der Termin steht HART im
#      Code (`app_seiten.js:859` `new Date(2026, 6, 31)`) plus Text in `app_util.js:219`. Danach
#      zeigt der Bereich dauerhaft „Klausur am 31.07.2026 (liegt zurück)", und 105 Fragen
#      (10,7 % des Pools) sind Stoff für eine gelaufene Klausur.
#      ⚠️ **NICHT eigenmächtig löschen oder umdatieren** – erst den Nutzer fragen: nächste Klausur
#      eintragen · Bereich ausblenden · M09 als allgemeinen WiSo-Stoff behalten.
#   7. Erst wenn der Nutzer eine neue Feedback-Runde bringt: neues Kapitel aufmachen.
#
# ══════════ ►►►►►► ZUERST LESEN: SO ARBEITEST DU IN DIESEM CHAT ◄◄◄◄◄◄ ══════════
# Dies ist ein laufendes, sorgfältig geführtes Projekt (FISI-2026-Lern-App). Du MUSST dich an die
# etablierten Vorgaben halten – sie stehen ausführlich weiter unten und in TASKLIST.md/PLAENE.md.
# DIE WICHTIGSTEN, NICHT VERHANDELBAR:
#   1. **RÜCKFRAGE-PFLICHT (AskUserQuestion):** Bei jeder Design-/Umfangs-/Formulierungs-Entscheidung
#      mit mehreren sinnvollen Optionen ZUERST den Nutzer fragen. Nie eigenmächtig, nie still vom Plan
#      abweichen. Vor jedem Task erst im Code/Pool nachsehen, was schon existiert.
#   2. **NIEMALS UNGEFRAGT PUSHEN oder committen-für-Release.** Push geht NUR vom Windows-Rechner
#      (Sandbox-Proxy sperrt GitHub, 403). `push.sh` NICHT benutzen. Fertiges bleibt liegen bis „Freigabe".
#   3. **Pool NUR über pool/*.json + `python3 build_fragen.py`** ändern – fragen.js/faelle.js NIE direkt
#      editieren (Drift-Guard). Nach jeder Änderung: build + Drift 0 + betroffene Suiten auf Sollwert
#      (sollwerte.env ist Single Source). Jeden neuen Test GEGENPROBEN.
#   4. **Verifikation ist NIE Agentensache** – alle Suiten selbst fahren, jeden Diff lesen, Zahlen selbst
#      nachrechnen. Keine Bedeutungsänderung an Inhalten ohne Beleg.
#   5. Loop je Task: umsetzen → selbst prüfen → BUILD_LOG/TASKLIST/PLAENE + DIESEN Prompt aktualisieren →
#      bei Feature-Meilenstein Version-Bump/CHANGELOG → PAUSIEREN. Aufgabenliste (TaskCreate) nutzen.
#   6. **PRÜFLAUF: `bash check.sh block start` → `weiter` (wiederholen) → `ende`.** Der volle
#      `bash check.sh` passt NICHT in die 45 s der Sandbox. Nichts selbst nachbauen, nichts in den
#      Hintergrund schieben – beides ist erprobt und beides geht schief (Details im BUILD_LOG 26.07.).
#

# ══════════════════════════════════════════════════════════════════════════════════════════════
# TEIL B – ÄLTERE CHRONIK (war schon vor dem 27.07. unterhalb der Historie-Linie)
# ══════════════════════════════════════════════════════════════════════════════════════════════

# ══════════ ►►►►►► AB HIER: HISTORIE – NICHT AM STÜCK LESEN ◄◄◄◄◄◄ ══════════
# Alles oberhalb dieser Linie ist der GÜLTIGE STAND. Alles darunter ist Chronik: erledigte Etappen,
# Begründungen alter Beschlüsse, Lehren aus Fehlern. Darin wird GEZIELT NACHGESCHLAGEN, wenn eine
# konkrete Frage auftaucht („warum ist X so gebaut?"), nicht der Reihe nach durchgelesen.
# ⚠️ **STATUS-AUSSAGEN GELTEN NUR OBERHALB DER LINIE.** Weiter unten stehen Sätze wie „APP_VERSION
#    steht auf 1.7.0" oder „NEU OFFEN: …", die zum damaligen Zeitpunkt stimmten und heute falsch
#    sind. Am 26.07. mussten drei solche Sätze als überholt entlarvt werden – einer hätte fast zu
#    einem falschen `git add` geführt. **Im Zweifel gilt der Kopf, und gemessen wird am Code.**
#
# ══════════ (HISTORIE) HANDY-APP-TEST VON v1.7.0 BESTANDEN (2026-07-23) ══════════
# Der Nutzer hat v1.7.0 am Gerät getestet und für gut befunden (Gebiete-Themenauswahl/3-Spalten-Raster,
# Tour-Schritt „Werkzeuge & Handy-App", Selbstabfrage-Voreinstellung). ⚠️ **Dieser Test ist mit v1.8.0
# VERBRAUCHT** – v1.8.0 ändert alle Erklärungstexte und die Reihenfolge der Feinthemen, beides sichtbar.
# Für v1.8.0 einen NEUEN Handy-Test anbieten (siehe Kopf, Punkt 1).
#
# ══════════ ✅ FB-R3 PUNKT 10 FERTIG UND BEREINIGT – ►►► JETZT: SICHTPRÜFUNG DURCH NUTZER ◄◄◄ ══════════
# Nutzer-Auftrag: alle langen Erklärungen (`erklaerungLang`) modulweise ins Format **Kernsatz +
# Stichpunkte („• " über Zeilenumbrüche \n) + „Merke:"-Zeile** bringen; Abkürzungen im Text EINZELN
# erklären (z. B. „KI (Künstliche Intelligenz)"); fehlende ins `abkuerzungen.js` (Dubletten-Wächter
# test_abk beachten, Zählwerte 2× nachziehen). **KEINE Bedeutungsänderung**, Zahlen/Fakten/Rechen-
# assistent-Platzhalter ({liste}, {s1|2} …) exakt erhalten. Nutzer-Entscheide stehen: Format bestätigt,
# Rollout modulweise, Felder = erklaerungLang + Abkürzungen. Der Renderer (app_frage.js) macht \n→<br>,
# also KEIN Code-Eingriff nötig.
#   ✅ **ALLE MODULE FERTIG: M01 86 + M02 79 + M03 142 + M04 164 + M05 59 + M06 82 + M07 97 +
#      M08 54 = 763/763.** Gegenprobe je Modul gefahren, alle formatkonform.
#   ✅ M08 (2026-07-25): drei Batches (BBiG 14 · Mitbestimmung 9 + Rechte/Pflichten 7 · Kündigung 9 +
#      Tarifrecht 9 + Arbeitsschutz 6). Das ist das Modul, vor dem die Lehre aus R2b.3 warnt
#      (Rechts-/Norm-/Fristenfragen) – komplett selbst geschrieben, 13 Zahl-Wächter-Treffer
#      nachgezogen, kein --force. Lexikon **102 → 112**: BBiG, BetrVG, JAV, JArbSchG, TVG, ArbZG,
#      ArbSchG, BUrlG, HwK, GG. Das Lexikon kannte bis dahin KEIN Ausbildungs-/Arbeitsgesetz.
#   ✅ **SAMMELLISTE ERLEDIGT (Nutzer-Entscheid „alle fünf korrigieren"):** M08-611 (fehlende
#      Verneinung), M08-105 (§ 22 BBiG ohne festen Endtermin), M07-201 (§ 377 HGB statt BGB, plus
#      Klarstellung, dass er beim Werkvertrag nicht gilt), M05-401 (Do-Phase, Erklärung UND
#      Antwortoption – loesungIndizes unverändert), M04-735 (CI statt CI/CD). Ephemerer Prüfer
#      pruef_befunde.py + Gegenprobe, Logik im BUILD_LOG. Der Pool ist an diesen fünf Stellen
#      widerspruchsfrei.
#   ✅ **„§ 20 Abs. 3" ERLEDIGT** (Nutzer-Entscheid 25.07.): 5 Stellen korrigiert – und dabei zeigte
#      sich, dass der Fehler auch in `verweis` und `distraktorErklaerungen` stand. ⚠️ **LEHRE:
#      Pool-Scans IMMER über das GANZE Frage-Objekt fahren** (json.dumps), nie nur über frage/
#      erklaerungKurz/erklaerungLang. Weitere Textfelder: verweis · optionen · distraktorErklaerungen
#      · musterloesung · paare · zeilen · labels. Mitkorrigiert wurde die identische Fehlerklasse
#      wie Befund 2: zwei Distraktor-Erklärungen nannten „2 Wochen" statt VIER für § 22 Abs. 2 BBiG.
#   (erledigt, s. u.) **M08-604 `musterloesung`, drei Fehler in EINEM Satz:** (a) die 2-Wochen-Frist
#      ab Kenntnis steht in § 626 Abs. 2 BGB, nicht in § 622 BGB / § 22 Abs. 2 BBiG; (b) eine
#      ordentliche Kündigung durch den Betrieb gibt es nach der Probezeit gar nicht (so auch
#      M08-105/601/702); (c) „anfechten vor dem BAG" – zuständig ist das Arbeitsgericht, das BAG ist
#      Revisionsinstanz. Dem Nutzer vorlegen.
#   ✅ **SICHTPRÜFUNG ERLEDIGT (26.07.): „alles ok".** Der Nutzer hat die Render-Abzüge
#      (erklaerung_preview_m04…m08.html, befunde_korrekturen.html, punkt9_sortierung.html)
#      geprüft und KEINE Befunde gemeldet. Damit war der Weg zum Release frei.
#   ✅ **VOLLER KONTROLLZYKLUS GEFAHREN (25.07., Nutzer-Entscheid „Testlauf, kein Bump"):
#      40 von 41 Suiten auf Sollwert, 0 Fehler.** Nur `test_axe` fehlt (npm 403, nur CI – seit
#      v1.6.0 akzeptiert). Dazu Drift 0 (fragen.js UND faelle.js), validate_pool/idcheck/schema,
#      Befund-Prüfer (7), Suiten-Inventar leer, keine Fremddateien, check.sh schnell komplett grün.
#      (ÜBERHOLT: damals stand APP_VERSION noch auf 1.7.0. Am 26.07. auf **1.8.0** gebumpt,
#      CHANGELOG geschrieben, Release-Commit lokal angelegt – siehe Kopf dieser Datei.)
#   ✅ **PARALLEL SCHON VORBEREITET: FB-R3 PUNKT 9.** Der Nutzer wusste im Juli nicht mehr, welche
#      Liste mit „Sortierung" gemeint war; PLAENE schreibt vor, Render-Abzüge vorzulegen statt
#      erneut zu fragen. **`punkt9_kandidaten.html` liegt vor** – vier Kandidaten nebeneinander:
#      A Themen-Auswahl (Üben), B Statistik, C1 Spickzettel, C2 Glossar mit Abkürzungs-Tab.
#      ✅ **PUNKT 9 TEIL 1 IST GEBAUT (25.07.):** `gebietThemen()` sortiert jetzt nach Modul und
#      darin alphabetisch (localeCompare „de"). test_themenauswahl **75 → 80**, sollwerte.env
#      nachgezogen, 3 Gegenproben bissen, Render-Abzug punkt9_sortierung.html.
#      ⚠️ **NEBENBEFUND BEHOBEN: app_seiten.js enthielt ein NUL-BYTE** (`code + "\x00" + key` in
#      gebietThemen). Folge war, dass jedes normale `grep` nur „binary file matches" meldete.
#      check.sh war NICHT blind (dessen Wächter nutzen `grep -a`). Jetzt NUL-frei und per Test
#      bewacht. **Bei „binary file matches" auf einer .js/.md NIE weiterarbeiten, erst prüfen:**
#      `python3 -c "print(open(F,'rb').read().count(b'\x00'))"`.
#      ⚠️ **PUNKT 9 TEIL 2 („Lücken") IST OFFEN – meine Rückfrage hatte eine falsche Prämisse:**
#      Der Pool trägt KEINE Lernfeld-Tags (steht so in SORTIERUNG_PRUEFUNGSORDNUNG.md), die
#      Auswahl ist gebiets-basiert, und KEIN Gebiet ist leer. Dem Nutzer korrigiert vorgelegt.
#      ✅ **NUTZER-ENTSCHEID 25.07.: „Beispiel A war gemeint"** – gemeint ist also die
#      **THEMEN-AUSWAHL IM ÜBEN-BEREICH** (`sUeben` in app_seiten.js, Gebiets-Blöcke A1–A5/B1–B3
#      mit aufklappbaren Feinthemen). Punkt 9 kann damit gebaut werden. ⚠️ VORHER die konkreten
#      Sortier-Kriterien mit dem Nutzer klären (das Feedback lautete „nach Typ/Instanz/Firma"
#      sortieren statt verschachtelter Baumstruktur ohne klare Reihenfolge und mit Lücken") –
#      auf die Gebiets-/Feinthemen-Liste übersetzt heißt das noch nichts Eindeutiges.
#   ✅ **PUNKT 8 („ähnliche Fragen") IST ERLEDIGT – ES WAR SCHON GEBAUT.** Nutzer-Entscheid war
#      „ähnlich = gleiches Feinthema"; genau das macht `zeigeThemenSerieAngebot()` seit #60:
#      Knopf „📚 Mehr zu diesem Thema üben" bei FALSCHER Antwort, füllt `themenSerie` mit bis zu
#      L.CONFIG.serie = 5 Fragen desselben Themas, `naechsteFrage()` gibt der Serie Vorrang.
#      Getestet in test_engine E4/E5. **Der Bestandsabgleich hat verhindert, dass ich es doppelt
#      baue – wie damals bei R2.6.** Gehärtet wurde nur der Filter: vorher nur `thema`, jetzt
#      `thema` UND `modul` (Lehre aus R3.2: „Gantt 13 Fragen" = M01 6 + M09 7). ⚠️ Verhalten
#      ändert sich heute NICHT, weil 0 von 73 Themennamen in zwei Modulen vorkommen – die Härtung
#      ist Vorsorge und wird durch einen POOL-Wächter abgesichert (test_themenauswahl 80 → 81),
#      nicht durch einen Verhaltenstest.
#   ✅ **M08-604 KORRIGIERT** (drei Sachfehler in einem Satz): § 626 Abs. 2 BGB statt § 622/§ 22
#      für die 2-Wochen-Frist; keine „ordentliche Kündigung" nach der Probezeit; Kündigungsschutz-
#      klage vor dem **Arbeitsgericht** statt „anfechten vor dem BAG".
#   ✅ **SYSTEMATISCHER WIDERSPRUCHS-SCAN NACHGESCHOBEN (25.07.): 0 echte Befunde.** Die sieben
#      korrigierten Sachfehler waren alle Zufallsfunde; deshalb ein Wächter über 12 harte Zahlen
#      (§ 626 BGB 2 Wochen · ArbZG 11 h/8 h · JArbSchG 8 h/40 h · BUrlG 24 Werktage · DSGVO Art. 33
#      72 h · ISO 9001 3 Jahre · Probezeit 1–4 Monate · AP1 20 % / AP2 80 %). 36 Fundstellen,
#      alle korrekt. Gegenprobe (11 h → 9 h in M08-102) biss, Restore sauber, Drift 0.
#      ✅ Dauerhaft gesichert als **`tools/fakten_check.py`** (`python3 tools/fakten_check.py`);
#      bewusst NICHT in check.sh/sollwerte.env – Analysewerkzeug für Content-Tasks, kein Dauertest.
#      ⚠️⚠️ **LEHRE FÜR JEDEN KÜNFTIGEN FAKTEN-SCAN: FALSCHE Antwortoptionen und ihre
#      `distraktorErklaerungen` sind ABSICHTLICH falsch und dürfen NICHT geprüft werden.** Die erste
#      Fassung meldete deshalb 14 Fehlalarme (z. B. „Zertifizierung 5 Jahre gültig" – das IST der
#      Distraktor). Geprüft wird NUR, was der Pool als WAHR behauptet: frage · erklaerungKurz ·
#      erklaerungLang · musterloesung · verweis + die Optionen aus loesungIndex/loesungIndizes.
#      (Steht NICHT im Widerspruch zur Lehre „Scans über das GANZE Frage-Objekt": die gilt für die
#      Suche nach einer falschen Zeichenkette, diese hier für die Bewertung von Sachaussagen.)
#   ►►► **DAMIT SIND ALLE INHALTLICHEN R3-PUNKTE ERLEDIGT** (1–12), bis auf Punkt 9 Teil 2
#      („Lücken", Prämisse war falsch – siehe oben) und die Sichtprüfung durch den Nutzer.
#      DANACH: Aufräumen. ⚠️ **INVENTUR 25.07.: das meiste ist schon erledigt.**
#      `.git_broken_old` EXISTIERT NICHT MEHR (0 Dateien) · keine Backup-ZIPs im Ordner ·
#      kein toter Level-Code (das, was noch „Level" heißt, ist die aktive Schwierigkeitsstufe:
#      S.level/S.levelModus/LEVEL_NAMEN). OFFEN sind nur zwei getrackte Doku-Leichen, die sich
#      SELBST als veraltet markierten. ✅ ERLEDIGT auf Nutzer-Entscheid 25.07.: NAECHSTER_CHAT.md
#      GELÖSCHT (war nur ein Verweis auf START_PROMPT/TASKLIST); COVERAGE.md GEKÜRZT – die
#      veraltete Matrix (Stand 579 Fragen, Pool hat 983) ist raus, die manuellen Analysen bleiben
#      (Abschnitt 2 IHK-Katalog FK01–FK07, Abschnitt 3 Tiefencheck). 21 KB → 12 KB.
#      **Aktuelle Abdeckung erzeugt `node tools/pool_query.js coverage`.**
#   (historisch) Zwischenstand vor M08: M01–M07 = 709.
#   ✅ M07 KOMPLETT (2026-07-25): fünf Batches (Aufbauorganisation 19 · SLA 13 + Change 6 ·
#      Vertragsarten 12 + Vertragsstörungen 11 · Nachkalkulation 11 + Abnahme 9 · Leitbild 9 +
#      Onsite/Remote 7). 97/97 formatkonform, Drift 0, 15 jsdom-Suiten auf Sollwert.
#      Lexikon **101 → 102** (nur CISO). IT bewusst NICHT aufgenommen – Konsistenz zu M04–M06.
#   ⚠️ **VOR DEM UMSCHREIBEN PRÜFEN, WELCHE SUITE DEN TEXT BEWACHT:** `grep -l erklaerungLang tests/*.js`
#      → test_fb_r1, test_liniensysteme, test_logik, test_matrix, test_rechnen. In M07 hing
#      **test_liniensysteme (29)** an fünf Schlüsselbegriffen in M07-009/311/312/707: „Matrix" neben
#      „Mehrlinie", „Gliederungsdimension" (≥2 Fragen), „Funktionsmeister" (≥1). Diese Wörter beim
#      Umschreiben WORTGLEICH übernehmen, sonst fällt die Suite.
#   ⚠️ **DER KERNSATZ DARF KEIN RECHENERGEBNIS UND KEINE PARAGRAFENNUMMER WIEDERHOLEN,** die im
#      Original nur einmal vorkommt (in M07 7× angeschlagen: 36 min, 43,2 min, 105 %, 1.000 EUR,
#      §§ 15/28/32/33). Aussage in Worten in den Kernsatz, Zahl allein in den Stichpunkt.
#   ✅ M06 KOMPLETT (2026-07-25): vier Batches (Verschlüsselung 13 + Security by Design 4 · CIA 11 +
#      Passwörter 9 · DSGVO 7 + TOM 6 + BSI 7 · Backup 7 + Härtung 7 + Phishing 7 + Vorfall 4).
#      82/82 formatkonform, Drift 0, alle Prüfungen grün, dieselben 14 jsdom-Suiten auf Sollwert.
#      Lexikon **94 → 101** (SHA, ISMS, ACL, RBAC, CA, RTO, RPO – alle Kategorie Sicherheit).
#      ⚠️ MAC ging NICHT ins Lexikon: der Kurzname ist durch „Media Access Control" belegt.
#   ⚠️ **PLATZHALTER-VERGLEICH MUSS AUF SORTIERTEN LISTEN LAUFEN, nicht auf Mengen.** In M06 kam die
#      erste `rechenassistent`-Frage vor (M06-542, Erklärung fast nur aus `{tage}`, `{s1}`, `{s4|2}` …).
#      Ein Mengenvergleich würde eine verdoppelte oder verlorene Wiederholung NICHT bemerken.
#   ⚠️ **ARTIKELNUMMERN SIND ZAHLEN.** In M06 schlug der Wächter 6× an, weil der Kernsatz eine Norm
#      nannte, die im Original nur einmal stand (Art. 15/28/32/33). Lösung: Nummer im Stichpunkt
#      lassen, Kernsatz ohne. Gleiche Klasse wie die ISO-Nummern in M05.
#   ✅ M05 KOMPLETT (2026-07-25): vier Batches (PDCA/KVP 16 · QM-Begriffe 10 + Audit 7 · Testprotokoll 9
#      + QM-Prozesse 9 · Qualitätskosten 8). Gegenprobe: 59/59 formatkonform. Drift 0, alle Prüfungen
#      grün, dieselben 14 jsdom-Suiten auf Sollwert. Lexikon **89 → 94** (DIN, EN, FMEA, ITIL, B2B),
#      test_abk an zwei Stellen nachgezogen, Suite bleibt 20. Render-Abzug erklaerung_preview_m05.html.
#   ⚠️ **NEUES TEXTMUSTER aus M05, das in M07 (4×) und M08 (4×) WIEDERKOMMT:** mehrfach-Fragen mit
#      zweitem Absatz „Warum die anderen nicht stimmen:" und Verweisen „(Option 0)…(Option 5)".
#      Ein Leerabsatz + markerlose Zeile fällt durch den Format-Wächter. LÖSUNG: je Falschaussage
#      ein eigener Stichpunkt „• Warum Option N nicht stimmt: …", Option-Verweis erhalten.
#   ⚠️ **BEI NORMFRAGEN IST DIE NENNUNGSZAHL SELBST INHALT.** In M05 schlug der Zahl-Wächter 7×
#      an; zweimal war eine ISO-9001-Nennung echt verloren, einmal hatte ich eine ERFUNDEN.
#      NICHT mit --force übergehen – jede Stelle nachziehen, bis das Multiset exakt stimmt.
#   ✅ M04 KOMPLETT ABGESCHLOSSEN (2026-07-25): Batch E (ER-Modell 10 + Lasten/Pflichtenheft 9 + GUI 5)
#      und Batch F (Praxisszenarien 8 + Lizenzen 7) nachgezogen. Gegenprobe im Pool: 164/164 im neuen
#      Format, Rest leer. **Drift 0** (fragen.js UND faelle.js), validate_pool/idcheck/schema grün,
#      check.sh schnell grün, Suiten-Inventar leer. Jsdom-Suiten auf Sollwert: logik 2158 · matrix 31 ·
#      freitext 38 · rechnen 64 · teilpunkte 19 · diagnose 76 · glossar 24 · abk 20 · render_smoke 21 ·
#      hilfe 21 · state 25 · meta 75 · registry 118 · engine 70.
#   ✅ **LEXIKON-SCHULD BEGLICHEN:** abkuerzungen.js **76 → 89** (Nutzer-Entscheid „Kernthemen", 13:
#      SQL, DBMS, PK, FK, ERM, UML, HTML, SaaS, WCAG, ISO, GPL, EULA, OEM). test_abk an ZWEI Stellen
#      nachgezogen (Z. 14 + Z. 29), Suite bleibt 20. Netzwerk-Reste (APIPA, RADIUS, FQDN, CNAME, RFC,
#      IANA, ISP, NTP) bewusst NICHT aufgenommen – das Lexikon bleibt kuratiert. NICHT neu aufrollen.
#   ►►► OFFEN: kein Modul mehr. Punkt 10 ist inhaltlich abgeschlossen.
#      ⚠️ Der Lexikon-Abgleich ist ab jetzt JE MODUL am Modulende zu machen, nicht mehr aufschieben.
#   ✅ **SAMMELLISTE – ALLE FÜNF ERLEDIGT (Wortlaut der Korrekturen im BUILD_LOG ganz oben) (Nutzer-Entscheid: erst am Ende von Punkt 10 gebündelt
#      entscheiden, bis dahin UNVERÄNDERT lassen; beim Weiterarbeiten an M06–M08 fortführen):**
#      1. **M04-735** nennt „ISO-9241-Grundsatz, Barrierefreiheitsregel oder **CI/CD-Vorgabe**", meint
#         aber erkennbar CI = Corporate Identity (zwei Zeilen später steht „falsche Farben/Logos die
#         Corporate Identity"). CI/CD steht im Lexikon als Continuous Integration/Delivery. Die
#         Abkürzung ist dort deshalb bewusst NICHT aufgelöst.
#      2. **Do-Phase: der Pool widerspricht sich, 1 gegen 4.** M05-401 lehrt „Do: Im realen Betrieb
#         (nicht Pilot!) testen" – und seine Antwortoption sagt „Umsetzung … im Normalbetrieb".
#         M05-440 / M05-701 / M05-960 / M05-961 lehren „im kleinen Rahmen / Pilot". Der klassische
#         Deming-Zyklus stützt die vier, die ISO-9001-Lesart stützt M05-401. Hier wäre nicht nur eine
#         Erklärung, sondern auch eine Antwortoption zu ändern – deshalb offen.
#      3. **§ 377: falsches Gesetzbuch UND falscher Anwendungsbereich.** M07-201 zitiert die
#         Rügepflicht als „§ 377 BGB" (richtig: HGB) und wendet sie auf einen Werkvertrags-
#         Abnahmefall an. M07-202 stellt zwei Fragen weiter ausdrücklich klar, dass § 377 HGB „nur
#         beim beiderseitigen Handelskauf von Waren, NICHT beim Werkvertrag" gilt.
#      4. **M08-105: § 22 Abs. 2 BBiG mit falschem Kündigungstermin** – „mit 4 Wochen Frist zum 15.
#         oder Monatsende". Das ist die § 622-BGB-Regel für ARBEITSverhältnisse; das BBiG kennt
#         keinen festen Endtermin. M08-003, M08-201 und M08-602 sagen es richtig. ⚠️ Genau dieser
#         Fehler steht seit R2b.3 in den Lehren unten – damals offenbar nur an EINER Stelle behoben.
#      5. **M08-611: fehlende Verneinung – der Satz lehrt das Gegenteil.** „Lückenhafte Berichte
#         können zur Prüfungszulassung führen" (gemeint: zur VERSAGUNG). Der Satz davor sagt im
#         selben Text „Ohne Berichtsheft keine Zulassung zur AP". **Der gefährlichste der fünf.**
#      ✅ Alle fünf sind KORRIGIERT; Details und Gegenprobe im BUILD_LOG-Eintrag ganz oben.
#   VORGEHEN (bewährt, exakt so weitermachen):
#     a) Themen zählen: `python3 -c "import json,collections; qs=json.load(open('pool/pool_mNN.json'));
#        print(collections.Counter(q['thema'] for q in qs if q.get('erklaerungLang')))"`
#     b) Je Thema dumpen (id/typ/Text), umschreiben, als JSON-Patch {id: neuerText} in die outputs-
#        Scratch-Datei schreiben, dann anwenden + ZAHLEN-CHECK. Der Helfer outputs/apply.py ist EPHEMER
#        (neu anlegen!). Seine Logik, Stand 25.07. (drei Prüfungen, ohne `--write` wird NICHTS geschrieben):
#          (a) ID existiert und hat erklaerungLang;
#          (b) Zahl-Multiset ALT == NEU: Tokens `\d[\d.,:]*`, Punktuation strippen, bloße Listenmarker
#              1–9 ignorieren. ⚠️ **VOR der Zahlprüfung die Kardinalitäts-NOTATION entfernen**
#              (1:n, m:n, 1:1, 0..N, 1..N) – sonst Fehlalarm „Zahl neu hinzugekommen", sobald der
#              Kernsatz ein `1:n` wiederholt (bei M04 viermal passiert, jedes Mal harmlos).
#          (c) ZIELFORMAT: erste Zeile kein Stichpunkt, ≥2 Zeilen mit „• ", letzte Zeile „Merke:",
#              keine markerlose Zwischenzeile.
#        So gefundene echte Lücke bei M01-704 (ERP-Kosten) wurde nachgetragen. Gegenproben zum Helfer
#        (Zahl löschen / Merke-Zeile löschen) fahren und die Manipulation per `assert` bestätigen.
#     c) Nach jedem Modul: `python3 build_fragen.py`, validate_pool/schema, **Drift 0** (fragen.js ==
#        Frischbau), Suiten `logik matrix freitext rechnen` (+ ggf. teilpunkte/diagnose) auf Sollwert.
#     d) BUILD_LOG-Checkpoint je Modul; DIESEN Block auf den nächsten Modulstand setzen. PAUSE nach jedem
#        Modul anbieten (der Nutzer wollte Qualität vor Tempo, Handoff über Sitzungen ist ok).
#   ⚠️ Alle 763 sind **UNCOMMITTED** im Arbeitsbaum (pool/*.json + fragen.js
#     + faelle.js + abkuerzungen.js + tests/test_abk.js). Sie gehören NICHT zum gepushten v1.7.0. Erst
#     wenn Punkt 10 fertig ist, mit dem Nutzer über Release/Bump reden. NICHTS ungefragt pushen.
#   Details/Batch-Historie: BUILD_LOG-Einträge „PUNKT 10 … M01/M02/M03 KOMPLETT".
#
# ══════════ ✅ RELEASE v1.7.0 IST DRAUSSEN – NICHTS ZU PUSHEN, NICHTS NEU ZU COMMITTEN ══════════
# Der Nutzer hat am 23.07. Freigabe erteilt, **vom Windows-Rechner gepusht und den Erfolg bestätigt
# („ist durch")**. Commit **96fdc2b „Release v1.7.0"**. Arbeitsbaum sauber. v1.7.0 bündelt Punkt 6 +
# Gebiets-Sortierung (Feld `gebiet`, Statistik je Gebiet) + Etappe 2 (Üben gebiet-basiert) + Punkt 7
# (Onboarding-Schritt „Werkzeuge & Handy-App" + Abruf-Voreinstellung) + Aufräumen (toter Level-Code
# raus, lokaler Müll gelöscht). APP_VERSION/sw.js/CHANGELOG = 1.7.0. Alle 40 Suiten grün, Drift 0.
# ⚠️ Die Release-Action taggt v1.7.0 bei komplett grüner CI (dort läuft auch test_axe) → Cloudflare
#    deployt automatisch, live unter https://ap1-lernprogramm.fisi2026lernapp.workers.dev
# ⚠️ Lokal ist der Tag NICHT sichtbar (`git fetch --tags` scheitert am Sandbox-Proxy-403); er
#    entsteht serverseitig. Der lokale `origin/main`-Ref bleibt stale, WEIL der Push aus einem
#    ANDEREN Arbeitsverzeichnis (Windows) lief – das ist normal und KEIN Fehler.
# ⚠️ **NIEMALS UNGEFRAGT PUSHEN.** Die Freigabe galt NUR für v1.7.0. `push.sh` NICHT benutzen.
#
# ══════════ ✅ SONDER-TASK „POOL NACH PRÜFUNGSORDNUNG" KOMPLETT (2026-07-23) – KEIN Bump, NICHT gepusht ══════════
# Nutzer-Wunsch: Sortier-Kategorien komplett nach Prüfungsordnung, alle Fragen einsortieren, Zählung.
# ✅ TEIL 1 (TAGGING): Feld `gebiet` (A1–A5 AP1, B1–B3 AP2, M9) an ALLEN 983 Fragen. `modul`/`id`/
#    `thema` unangetastet. Single Source `L.GEBIETE`/`L.THEMA_GEBIET`/`L.gebietFuer` in logik.js;
#    validate_pool-Wächter (f.gebiet==Soll); Schema-Pflicht. REFERENZ: SORTIERUNG_PRUEFUNGSORDNUNG.md.
#    ⚠️ Lücke: LF 7/10b/11b/12b = 0 Fragen. ⚠️ Zwei weiche Zuordnungen: Engl. Fachtexte→A1,
#    Aufbauorganisation/Vollmachten→A5 (vertretbar, bleibt so).
# ✅ TEIL 2 ETAPPE 1: Statistik / Bereitschaft / Serie laufen JE GEBIET (aus T:modul:thema abgeleitet,
#    Buchung unverändert). L.bereitschaft liefert `gebiete`; L.statProGebiet/L.themaKeyTeile.
# ✅ TEIL 2 ETAPPE 2 (NEU 2026-07-23): Üben-Themenauswahl auf GEBIET umgestellt.
#    STATE: neu `S.gebiete` (A1..B3) + `S.themen` ("modul|thema") ersetzen funktional S.module/
#      S.ap2Themen (die als LEGACY leer stehen bleiben, nicht mehr gelesen). uebenAP/wirtschaftNur bleiben.
#    app_seiten.js: themaGewaehlt() = leer→alle sonst f.gebiet∈gebiete ODER modul|thema∈themen; neue
#      Ableitung gebietThemen() (poolweit f.gebiet→Feinthemen+Zähler, M9 aus). `sUeben` iteriert
#      L.GEBIETE (AP1-Sektion Wirtschafts-Chip+A1–A5, AP2-Sektion B1–B3), jedes Gebiet aufklappbar
#      (Session-Var gebietOffen, Knopf schaltet REIN im DOM) mit „ganzes Gebiet"-Häkchen + Feinthemen;
#      genAlsFrage filtert Generatoren über L.gebietFuer({modul,thema}); Reset leert gebiete/themen/
#      wirtschaftNur, uebenAP="beide". CSS: .gebiet-block/.geb-kopf/.geb-toggle/.geb-feinthemen/
#      .platzhalter-info (nur vorhandene Tokens; .geb-toggle in die 44px-Regel).
#    ⚠️ NUTZER-ENTSCHEIDE (AskUserQuestion): (1) AP2-Katalog-Fragenkomplexe aus Punkt 6 bleiben als
#      „bald"-Info unter B1/B2 (match über Gebietsname); (2) „ganzes Gebiet"-Häkchen ist mit den
#      Feinthemen GESPIEGELT (an→Feinthemen mitgewählt; alle Feinthemen an→verdichtet zum Gebiet;
#      ein Feinthema abwählen→Gebiet löst sich in Einzelthemen auf).
#    ⚠️ NUANCE: Generatoren mit Thema NICHT in L.THEMA_GEBIET (uebertragung/zahlensysteme/raid)
#      werden bei aktiver Auswahl ausgeschlossen; bei leerer Auswahl kommen sie wie bisher.
#    TESTS: test_themenauswahl.js KOMPLETT neu (gebiet-basiert) 60→**75**; test_wirtschaft 32 und
#      test_adaptiv 49 auf S.gebiete/S.themen umgestellt (Zahl gleich). 5 Gegenproben bissen, nach
#      Restore 75/0. ALLE 39 Suiten auf Sollwert, check.sh schnell grün, Suiten-Inventar leer,
#      Drift 0. sollwerte.env: themenauswahl 60→75. Render-Abzug themenauswahl_preview.html neu.
# ⚠️ OFFEN BEIM NUTZER: Sichtprüfung des Render-Abzugs; Handy-Test sobald live (3-Spalten-Raster,
#    Aufklappen der Gebiete, Lesbarkeit der „bald"-Fragenkomplexe).
#
# ══════════ ✅ v1.6.0 IST DRAUSSEN – NICHTS ZU PUSHEN, NICHTS NEU ZU COMMITTEN ══════════
# Der Nutzer hat am 22.07. Freigabe erteilt und **vom Windows-Rechner gepusht; er hat den Erfolg
# bestätigt** („1.6 ist da"). Gegengeprüft: `git log --oneline origin/main..HEAD` ist LEER,
# `origin/main` steht auf **e5f3111 „Release v1.6.0"**. Arbeitsbaum sauber.
# ⚠️ Das funktioniert nur, weil der Push aus DEMSELBEN Arbeitsverzeichnis lief – dadurch hat git
#    das remote-tracking-Ref lokal mitgeschrieben. Ein `git fetch` ist aus der Sandbox weiterhin
#    unmöglich (Proxy-403), man kann den Remote-Stand hier also NICHT unabhängig nachsehen.
# ✅ **DER TAG v1.6.0 STEHT** – vom Nutzer geprüft: `refs/tags/v1.6.0` liegt auf
#    **e5f31117497b72c7cc996a28951bc5bbad8a52eb**, also exakt auf dem Release-Commit.
#    Die Release-Action taggt NUR bei komplett grüner CI, damit ist die CI durchgelaufen.
#    Cloudflare deployt automatisch → **v1.6.0 ist live** unter
#    https://ap1-lernprogramm.fisi2026lernapp.workers.dev
#    ⚠️ Lokal ist der Tag NICHT sichtbar (`git tag` ist leer) – er entsteht serverseitig und käme
#    erst über `git fetch --tags` herein, was aus der Sandbox am Proxy scheitert.
# ✅ **DAMIT IST DIE OFFENE SCHULD AUS v1.1.1 BEGLICHEN: test_axe IST GELAUFEN UND GRÜN.**
#    Die Suite ist Teil der CI, und ohne sie gäbe es den Tag nicht. Lokal bleibt sie unfahrbar
#    (npm 403), sie muss also weiterhin NICHT vor jedem Push nachgeholt werden – aber ein Release
#    ohne Tag ist ab jetzt immer auch ein axe-Verdacht.
# ⚠️ **NIEMALS UNGEFRAGT PUSHEN.** Die Freigabe galt NUR für v1.6.0, nicht dauerhaft.
# ⚠️ **`push.sh` NICHT benutzen** (legt bei jedem Lauf `.git_broken_old` an; aktuell nicht vorhanden).
#
# ══════════ ►►► WORAUF DER NUTZER WARTET: HANDY-TEST VON v1.6.0 ◄◄◄ ══════════
# Sobald v1.6.0 live ist (ap1-lernprogramm.fisi2026lernapp.workers.dev), lohnt ein Blick am Gerät
# auf genau die Dinge, die diese Runde verändert hat:
#   * **Die neuen Gantt-Balkenpläne** (M01-482…487, M01-113, M01-481): 20 Arbeitstage sind breit –
#     sind Tagesnummern und Balken am Handy noch lesbar, funktioniert der Tap-Zoom?
#   * **Die Hotspot-Frage M01-483**: acht Klickflächen, treffen die Finger die richtigen Balken?
#   * **Die Netzplan-Seite**: 30 statt 36 Eingabefelder, drei Spalten je Knoten.
# Kommen Befunde: als Patch-Version (v1.6.1) nachziehen, NICHT in den nächsten R3-Punkt mischen.
#
# ══════════ ✅ WAS v1.6.0 BRINGT (FB-R3 Punkte 2, 3, 4 und 5) ══════════
# **FB-R3 PUNKT 4 – Liniensysteme.** 18 Fragen geprüft, 7 geändert, beide Organigramm-SVGs neu.
#   Kernbefund: DER POOL WIDERSPRACH SICH SELBST (Details unten bei den Lehren).
#   NEUE SUITE `tests/test_liniensysteme.js` (**29**).
# **FB-R3 PUNKT 3 – Netzplan.** Nicht zwei Zeichenstile, sondern zwei KNOTENSCHEMATA. Die
#   Menüseite folgt jetzt dem Pool-Schema (FAZ·Dauer·FEZ / SAZ·GP·SEZ), FP entfällt, 30 statt
#   36 Felder. Funktionsprobe 30/30 grün.
# **FB-R3 PUNKT 2 – Gantt-Stufen.** 6 neue Fragen M01-482…487 (je 3 auf Stufe 1 und 2), jede mit
#   eigenem Balkendiagramm; M01 „Gantt & PSP" 6 → 12 Fragen, Stufe 1: 1 → 4, Stufe 2: 2 → 5.
#   Kernbefund: **zwei der drei Stufe-3-Fragen waren SELBST DEFEKT** (Details unten bei den Lehren),
#   beide auf Nutzer-Entscheid neu gezeichnet. NEUE SUITE `tests/test_gantt.js` (**73**).
#   Erzeugt mit `tools/r3_2_gantt.py` – idempotent, Achse und Balken aus DERSELBEN Rasterfunktion.
#   ⚠️ **VERBINDLICHE NUTZER-VORGABE FÜR ALLE KÜNFTIGEN BALKENPLÄNE (22.07., nach Sichtprüfung):**
#      **mind. 20 Arbeitstage und 8–10 Vorgänge je Plan.** Die erste Fassung (6 Wochen, 3–4
#      Vorgänge) war zu dünn und wurde komplett neu gerechnet. Raster: 30 px je Arbeitstag,
#      Wochenbänder + Tagesnummern über der Achse, Vorgangsnamen in einer linken Spalte.
#      **KEIN Balken trägt seinen Zeitraum als Text** – die Achse ist die einzige Quelle.
#      test_gantt.js bewacht beides aktiv.
# **FB-R3 PUNKT 5 – Matrix-Inhalte.** Alle 25 matrix-Fragen überarbeitet: 106 Elementtexte,
#   25 Fragetexte, 50 Erklärungen. Kernbefund: **40 % der Elemente nannten die Einstufung
#   WÖRTLICH** – Vokabelabgleich statt Beurteilung, dieselbe Fehlerklasse wie das Balkenlabel
#   in M01-481. Bewertungsvokabular 42 → 0, Fragen mit Ziffern 4 → 24.
#   NEUE SUITE `tests/test_matrix.js` (**31**), erzeugt mit `tools/r3_5_matrix.py`.
# STAND: **40 Suiten** (test_themenauswahl 60 aus R3.6 dazu), alle 39 lauffähigen grün (test_axe
#   nur in der CI), Pool **983**, Drift 0.
# ✅ VOR DEM RELEASE GEFAHREN: check.sh schnell, alle 38 Suiten einzeln, Drift-Guard (fragen.js
#    und faelle.js == pool-Build), Offline-Audit, Sollwert-Abgleich, keine Fremddateien im Ordner.
#
# ══════════ ✅ FB-R3 PUNKT 6 ERLEDIGT (2026-07-23, KEIN Bump, NICHT gepusht) ══════════
# Themen-Auswahl neu gebaut: AP1/AP2-Clear-Cut mit Umschalter AP1/AP2/Beide (Default **beide**),
# AP1-Sektion (Wirtschafts-Chip eingebettet + M01–M07), AP2-Sektion (WiSo/M08 sichtbar hierher
# gerückt + zwei „bald"-Platzhalter mit Katalog-Fragenkomplexen), 3-Spalten-Raster Desktop /
# 1 Spalte Handy, „Auswahl zurücksetzen". Details im BUILD_LOG-Eintrag GANZ OBEN.
#   * ⚠️ **Reichweite bewusst eng:** NEUER Üben-lokaler Filter `S.uebenAP`/`uebenPasst()` (app_pool.js);
#     `passtAP()`/`S.inklAP2` (Startseite, Statistik, Relevanz, Simulation) sind UNVERÄNDERT – die
#     Sim-Invariante „nur AP1" bleibt. test_themenauswahl Abschnitt 10 bewacht das aktiv.
#   * ⚠️ **AP2-Struktur aus dem gescannten Prüfungskatalog** (keine Textebene!) per Seiten-Rendering
#     gelesen: 3 AP2-Prüfungsbereiche, der dritte (WiSo) existiert schon als M08. `AP2_PLATZHALTER`
#     in app_pool.js ist so angelegt, dass AP2-Fragen später nur eingefüllt werden.
#   * ⚠️ **NACHTRAG 2026-07-23 (Nutzerbefund „AP2 hat keine Themeninhalte mehr"):** Die AP2-Spalte
#     zeigte nur WiSo + 2 Platzhalter, obwohl 22 AP2-Fragen in M04 stecken (Subnetting 12, ER-Modell/
#     Datenbanken 10 – laut Katalog AP2-Stoff, technisch im AP1-Modul M04). GEFIXT: neuer State
#     `S.ap2Themen` + Konstante `AP2_FACHTHEMEN` (app_pool.js) + `themaGewaehlt()` in kandidaten
#     (Union aus Lernfeld- UND thema-genauer AP2-Auswahl). Die AP2-Spalte hat jetzt zwei echte,
#     wählbare Fachthema-Kacheln (mit Fragenzahl) NEBEN WiSo. ⚠️ Diese Themen sind GEMISCHT
#     (Subnetting = 12 AP2 + 3 AP1): im AP2-Modus bleibt nur der AP2-Anteil, im Beide-Modus beide.
#   * NEUE SUITE `tests/test_themenauswahl.js` (**60**) → **40 Suiten**, 5 Gegenproben bissen (3+2),
#     alle 39 lokalen Suiten auf Sollwert, Drift 0, check.sh schnell grün.
#   * OFFEN: Sichtprüfung des Render-Abzugs (liegt dem Nutzer vor); Handy-Test erst, wenn live.
#
# ══════════ ✅ FB-R3 PUNKT 7 (ONBOARDING-TOUR) ERLEDIGT (2026-07-23) – KEIN Bump, NICHT gepusht ══════════
# Bestand: Tour existierte (ONB_SCHRITTE/S.onboardingDone, 6 Schritte). ERWEITERT:
#  * NEUER Schritt „Werkzeuge & Handy-App" (6→7): Fokus-Modus, Selbstabfrage, Handy-App/offline.
#  * ⚠️ NUTZER-ENTSCHEID 1: Abruf-Übung wird VOREINSTELLUNG (S.abrufAn persistiert, Default true,
#    ersetzt Session-var) und der Umschalter verschwindet aus dem Üben – nur noch „leise" in den
#    Einstellungen (sEinstellungen, Abschnitt „Üben"). loeseFrage liest S.abrufAn; die 4
#    abrufToggle()-Aufrufe (Üben/Unterricht/Deck/Markiert) sind entfernt.
#  * BEFUND: M09-Klausur war schon geschützt (opts.klausur setzt opts.simulation=true; Guard hängt
#    an !opts.simulation). Ein zunächst ergänztes !opts.klausur war redundant → wieder entfernt.
#  * ⚠️ NUTZER-ENTSCHEID 2: EIN neuer Schritt (nicht zwei, nicht eingewoben).
#  * NEUE SUITE test_onboarding (26) → 41 Suiten; test_abruf 18→21; test_hilfe 6→7 Durchklick.
#    4 Gegenproben bissen. Alle 40 lokalen Suiten Sollwert, Drift 0, check.sh schnell grün.
#    Render-Abzug: onboarding_preview.html. Details: BUILD_LOG oberster Eintrag.
# ══════════ ►►► NÄCHSTER TASK: FB-R3 PUNKT 10 (ERKLÄRUNGEN ÜBERARBEITEN) ◄◄◄ ══════════
# Detailplan: PLAENE.md → FB-R3 Punkt 10 (ausführliche Erklärungen gliedern, Abkürzungen einzeln
#   erklären/mit abkuerzungen.js abgleichen, leichte Verständlichkeit; Haiku-Batches je Modul auf
#   /tmp, Opus prüft jede Änderung fachlich, KEINE Bedeutungsänderung).
# Punkt 8 („ähnliche Fragen") braucht ZUERST eine Konzept-Rückfrage (Feature ja/nein, Definition
#   von „ähnlich"); Punkt 9 (Sortierung) ZUERST Render-Abzüge der drei Kandidaten-Ansichten – der
#   Nutzer weiß selbst nicht mehr, welche Liste gemeint war. Punkt 11 (UNTERRICHT_MODUL-Umbenennung)
#   ist mit v1.4.0 bereits erledigt.
#
# ══════════ ⚠️ DIE SECHS TEUERSTEN LEHREN DIESER SITZUNG – VOR JEDEM TASK LESEN ══════════
# 0. **DIE LÖSUNG DARF NICHT IM AUFGABENTEXT STEHEN.** Dreimal an einem Tag dieselbe Klasse:
#    M01-481 verriet die Dauer im Balkenlabel, und **40 % aller Matrix-Elemente nannten die
#    Einstufung wörtlich** („sehr unwahrscheinlich, aber existenzbedrohend" bei genau den Achsen
#    Eintrittswahrscheinlichkeit und Schadenshöhe). Solche Aufgaben prüfen einen Vokabelabgleich
#    statt einer Beurteilung. → **Ein Aufgabentext nennt SACHVERHALTE (Zahlen, Fristen, Beträge),
#    aus denen die Einstufung ABGELEITET wird.** Abgrenzung: Sachvokabular bleibt erlaubt – eine
#    Marktform braucht „ein einziger Anbieter", das Johari-Fenster braucht „mir bekannt".
# 1. **DER POOL KANN SICH SELBST WIDERSPRECHEN – IM TEXT WIE IM BILD.**
#    (a) Text: M07-311/312 nannten ein Matrix-Beispiel (Fachbereich + Projekt)
#        „Mehrlinienorganisation", während M09-021/024 und mein eigenes M07-709 aus v1.5.0 es
#        richtig erklärten. **Mein v1.5.0-Zusatz hat den Widerspruch erzeugt, ohne dass es
#        auffiel**, weil ich nur die neue Frage geprüft habe.
#    (b) Bild: M01-113 zeichnete den Meilenstein als **Dreieck**, während M01-960 und M09-053 im
#        selben Pool die **Raute** lehren. Dieselbe Fehlerklasse, nur in der Bildsprache.
#    → **Beim Einpflegen neuer Fragen IMMER den Bestand zum SELBEN Thema gegenlesen** – Text UND
#    Diagramme. Ein Pool aus fachlich korrekten Einzelfragen kann als Ganzes falsch lehren.
# 2. **DIAGRAMME NICHT VON HAND ZEICHNEN, SONDERN RECHNEN.** M01-481 hatte eine nicht-lineare
#    Zeitachse (15/12/16/14 px je Tag) und Balken, die nicht dazu passten: der Balken lag bei
#    Tag 9–19, beschriftet war er mit „Tag 6-15". Die richtige Antwort war nur aus dem TEXTLABEL
#    ablesbar, nicht aus dem Bild. → Achse und Balken aus DERSELBEN Rasterfunktion erzeugen
#    (`tools/r3_2_gantt.py`), dann können sie gar nicht auseinanderlaufen.
# 3. **ZAHLENPRÜFUNG UND SICHTPRÜFUNG ERSETZEN EINANDER NICHT.** Zweimal an einem Tag belegt:
#    (a) Meine erste Fassung beschriftete die Tagesachse in M01-113 mittig, in M01-481
#        kantenbündig – zwei Lesarten derselben Achse. Die Geometrieprüfung sah nichts, weil beide
#        Varianten für sich linear sind.
#    (b) Dass die Pläne mit 6 Wochen und 3–4 Vorgängen inhaltlich ZU DÜNN waren, kann keine
#        Zahlenprüfung wissen – das kam aus der Sichtprüfung durch den Nutzer.
#    → Bei Bildarbeit IMMER beides fahren und den gerenderten Abzug vorlegen.
# 4. **CSS HAT KEIN SYNTAX-GATE – und das ist mir zum Verhängnis geworden.** Beim Dark-Theme-Fix
#    ist ein Fremdzeichen mitten in einen Hex-Wert geraten (`#3C4插250`). `node --check` und
#    `check.sh` sehen styles.css NICHT an. Gefunden nur durch gezielte Nachprüfung.
#    → **Nach JEDEM CSS-Edit prüfen:** Klammer- und Kommentarbilanz, Regex auf defekte Hex-Werte,
#    Nicht-ASCII außerhalb von Kommentaren, und ob ein neuer Token in ALLEN VIER Theme-Blöcken
#    steht (`--g300` fehlte im Dark-Theme – dieselbe Klasse wie der R1.1-Kontrastbug).
# 5. **EIN TEST KANN STILL WIRKUNGSLOS SEIN, UND EINE GEGENPROBE KANN INS LEERE GREIFEN.**
#    (a) In test_gantt.js las mein Attribut-Parser `([a-zA-Z-]+)=` – **Attributnamen mit ZIFFERN
#        (`x1`, `y2`) fielen durch**, die Gitterliste war leer, ALLE Geometrieprüfungen wären
#        wirkungslos grün gewesen. Aufgefallen nur, weil abhängige Prüfungen laut fehlschlugen.
#    (b) Gegenproben meldeten „0 Probleme", weil `process.kill` hinter `process.exit` stand bzw.
#        das Suchmuster die Datei gar nicht traf. → **Immer erst prüfen, DASS manipuliert wurde**,
#        und sonst UNGÜLTIG statt grün melden.
#    (c) **Zwei Gegenproben deckten echte Lücken im Test auf:** die Artikel „ein/eine/einen" in
#        einer Zahlwortliste machten den Wächter „jedes Element trägt eine konkrete Angabe"
#        wirkungslos, und eine Prüfung über `JSON.stringify` war zahnlos, weil der gesuchte
#        Paragraf auch in der Erklärung steht. → **Eine stumme Gegenprobe ist zuerst ein Befund
#        über den TEST, nicht über den Pool.**
#    Verwandt: beim Zählen über `thema` nach Modul trennen – „Gantt 13 Fragen" waren in Wahrheit
#    M01 (6) + M09 (7), zwei verschiedene Module.
# 6. **TEXTUMSTELLUNGEN NIE PER REGEX ÜBER QUOTES.** Ich hatte alle 106 Matrix-Texte versehentlich
#    in ASCII-Umschrift geschrieben (957 von 983 Pool-Fragen tragen echte Umlaute). Beim
#    Zurückstellen verrutschte ein `"([^"\\]*)"`-Muster über die Datei und benannte eine
#    CODE-Variable um. → **Nur echte STRING-Token anfassen** (Pythons `tokenize`), Ausnahmeliste
#    ZUERST (Pool-Feldnamen wie `erklaerungKurz`, die elf etablierten Beispielfirmen, „ue" aus
#    „eu"/„au" wie in Steuerung/dauert/neue), und **als Gegenprobe beide Fassungen tokenisieren
#    und die Code-Token vergleichen** – 2.122 vorher wie nachher, keine Abweichung.
#
# ══════════ (HISTORIE, überholt durch v1.6.0) v1.5.0 IST GETAGGT UND LIVE ══════════
# Release-Commit **cbc8df2**, Push vom Windows-Rechner, CI komplett grün, **refs/tags/v1.5.0**
# liegt auf cbc8df2 (gegengeprüft). Cloudflare deployt automatisch. Arbeitsbaum sauber.
# **NICHTS zu pushen, NICHTS erneut zu taggen, NICHT neu committen.**
# ✅ In diesem CI-Lauf ist auch **test_axe** mitgelaufen (lokal nicht fahrbar, npm gesperrt) UND
#    der volle `check.sh` erstmals MIT der neuen Parallelisierung über alle 36 Suiten am Stück.
# ⚠️ **PUSH GEHT NUR VOM WINDOWS-RECHNER** (`push_von_hier.bat` / `git push origin main`).
#    Der Sandbox-Proxy sperrt GitHub – NIE aus der Sandbox pushen. CI-Status: `bash ci2.sh`
#    **auf dem Windows-Rechner** (in der Sandbox fehlt `gh`, siehe Warnung ganz oben).
# ⚠️ **`push.sh` NICHT benutzen.** Es legt bei JEDEM Lauf `.git_broken_old` an.
#    ⚠️ HISTORISCH: Der Ordner stand einmal bei 2,0 MB / 94 Dateien. **Stand 25.07. ist er WEG**
#    (0 Dateien) – die Warnung gilt weiter, der Aufräum-Punkt ist erledigt.
# ⚠️ **NIEMALS ungefragt pushen.** Die Freigabe vom 22.07. galt NUR für v1.5.0, nicht dauerhaft.
#
# ══════════ WAS IN v1.5.0 DRIN IST ══════════
#   * **Nutzerbefund „keine WiSo-Fragen in der AP1"**: Schwerpunkt-Häkchen „Wirtschaft" im
#     Themen-Fokus (172 Fragen, lernfeldübergreifend über M01/M02/M03/M07) + 20 neue Fragen für
#     die vom Katalog namentlich genannten Lücken. Pool **957 → 977**.
#   * **FB-R3 Punkt 12**: grep-Wächter sehen nur noch echten Code (tools/entkommentiere.js),
#     alle billigen Wächter laufen jetzt auch in `check.sh schnell`.
#   * **Testlaufzeit**: Suiten laufen parallel (Faktor 2,3 gemessen), `CHECK_JOBS=1` = sequenziell.
#   * Zwei neue Dauersuiten: test_entkommentiere (46), test_wirtschaft (32) → **36 Suiten**.
#
# ══════════ ✅ FB-R3 PUNKT 4 ERLEDIGT (22.07., nach v1.5.0, KEIN Bump, NICHT gepusht) ══════════
# Liniensysteme überarbeitet: 18 Fragen geprüft, 7 geändert, beide Organigramm-SVGs neu gezeichnet.
# NEUE SUITE `tests/test_liniensysteme.js` (**29**) → jetzt **37 Suiten**.
# ⚠️ **DIE WICHTIGSTE LEHRE DARAUS – vor jedem Content-Task lesen:**
#    **DER POOL WIDERSPRACH SICH SELBST.** M07-311/312 nannten ein Matrix-Beispiel (Fachbereich +
#    Projekt) „Mehrlinienorganisation", während M09-021/024 und mein eigenes M07-709 aus v1.5.0 die
#    Abgrenzung richtig erklärten. **Mein v1.5.0-Zusatz hat den Widerspruch erzeugt, ohne dass es
#    auffiel.** → **Beim Einpflegen neuer Fragen IMMER den Bestand zum selben Thema gegenlesen**,
#    nicht nur die neue Frage prüfen. Ein Pool kann fachlich korrekte Einzelfragen enthalten und
#    trotzdem als Ganzes falsch lehren.
# ⚠️ **cairosvg ist NICHT installierbar** (pip 403, wie npm). Für SVG-Prüfungen steht jetzt eine
#    GEOMETRIEPRÜFUNG in test_liniensysteme.js: keine überlappenden Boxen, kein Linienende ohne
#    Anschluss, nichts außerhalb der viewBox. Sie ersetzt die Sichtprüfung nicht – dafür die
#    Diagramme im Chat rendern lassen und den Nutzer draufschauen lassen.
# ⚠️ **Punkt 5 ist KLARGESTELLT**: „Matrix-Beispielbilder" meint die INHALTE der Matrix-Aufgaben
#    (Zahlen, Kriterien), NICHT Bilder – keine der 25 matrix-Fragen hat ein SVG. Steht in PLAENE.
#
# ══════════ STAND UND NÄCHSTER SCHRITT ══════════
# ✅ **v1.4.0 ist live und getaggt** (FB-R3 Punkte 1+11). **Handy-Test von v1.4.0 ist per
#    Nutzer-Entscheid vom 22.07. ENTFALLEN – nicht erneut anbieten** (wie schon bei v1.2.0).
# ✅ **NUTZERBEFUND „keine WiSo-Fragen in der AP1" ERLEDIGT** (22.07., KEIN Bump).
#    Befund: M08 „WiSo" ist laut Katalog AP2 und im AP1-Modus zwangsläufig leer – der wirtschaftliche
#    AP1-Stoff EXISTIERT aber (rund 180 Fragen) und liegt verteilt in M01/M02/M03/M07.
#    ⚠️ **LEHRE, die Zeit gekostet hat:** Ich meldete zuerst „nur ein Bedienproblem, Inhalte sind
#    korrekt". Der Nutzer widersprach zu Recht – der Satz aus 00_Themenuebersicht.md, den ich SELBST
#    zitiert hatte, nennt im Nachsatz die Komplexe 02/03/07. **Eigene Belegstelle bis zum Ende lesen.**
#    GEBAUT: 20 neue Fragen (Pool **957 → 977**) für die vom Katalog namentlich genannten Lücken
#    (fixe/variable Kosten, Pay-per-Use, Wertschöpfung, Matrixorganisation, Prokura,
#    Handlungsvollmacht, Mietvertrag) + Schwerpunkt-Häkchen „Wirtschaft" im Themen-Fokus
#    (`WIRTSCHAFT_THEMEN` in app_pool.js, 172 Fragen, UND-verknüpft mit der Lernfeld-Auswahl).
#    NEUE SUITE `tests/test_wirtschaft.js` (**32**) mit Tippfehler-Wächter, 3 Gegenproben bestanden.
#    ⚠️ Abschreibung/AfA bewusst NICHT ergänzt – dünn, steht aber NICHT im AP1-Katalog. Nicht nachholen.
#    ⚠️ Das nimmt Punkt 6 einen Teil vorweg; was dort offen bleibt, steht in PLAENE.md bei Punkt 6.
# ✅ **FB-R3 Punkt 12 ist ERLEDIGT** (22.07., KEIN Version-Bump – reines Prüfwerkzeug, nicht die App).
#    NEU `tools/entkommentiere.js` + Dauersuite `tests/test_entkommentiere.js` (**46**).
#    Die grep-Wächter durchsuchen jetzt nur noch ECHTEN Code; **vier** waren betroffen, nicht einer
#    (Offline-Audit, UTF-8, Anti-Pattern 4c, Rhaus 4d). Alle billigen Wächter laufen jetzt AUCH in
#    `check.sh schnell` (Nutzer-Entscheid) – die Lücke, durch die der v1.3.0-Fehlalarm erst in der
#    CI auffiel, ist damit zu. 8 + 2 Gegenproben bestanden. Details im BUILD_LOG ganz oben.
#
# ►►► **NÄCHSTER TASK: FB-R3 Punkte 2–10** (PLAENE.md → „FB-R3").
#     2 Gantt-Stufen · 3 Netzplan-Vereinheitlichung · 4 Liniensysteme · 5 Matrix-Bilder ·
#     6 Themen-Auswahl (AP1/AP2-Clear-Cut) · 7 Onboarding · 8 „Ähnliche Fragen" · 9 Sortierung ·
#     10 Erklärungen überarbeiten.
#     ⚠️ **Punkt 8** braucht ZUERST die Konzept-Rückfrage (Feature ja/nein, Definition von „ähnlich").
#     ⚠️ **Punkt 9: Rückfrage ist GESTELLT, der Nutzer weiß es selbst nicht mehr.** Also NICHT
#        nachfragen, sondern Render-Abzüge/Screenshots der drei Kandidaten erzeugen (Themen-Auswahl,
#        Statistik, Spickzettel/Glossar) und den Nutzer daraufzeigen lassen. Erst danach bauen.
#
# ══════════ ⚠️ TESTLAUFZEIT: SUITEN LAUFEN SEIT 22.07. PARALLEL ══════════
# `check.sh` fährt die Suiten über einen Worker-Pool (`xargs -P`), Vorgabe = Kerne+1, Deckel 8.
# **`CHECK_JOBS=1 bash check.sh`** schaltet auf sequenziell zurück – bei Fehlersuche nutzen.
# Die Ausgabe bleibt DETERMINISTISCH (je Suite eine Datei, Auswertung in fester Glob-Reihenfolge);
# zwei Läufe sind Zeile für Zeile gleich. Fehlt der Rückgabewert einer Suite, gilt sie als GEFALLEN.
# GEMESSEN: 10 Suiten sequenziell 25,6 s → parallel 11,2 s (Faktor 2,3 auf zwei Kernen).
# ⚠️ WARUM NICHT MEHR: ~95 % der Testzeit ist jsdom-Boot (~3,0 s × 41 boot-Aufrufe). Zwei
#    naheliegende Ideen sind MESSBAR WIDERLEGT und nicht erneut zu versuchen:
#    (a) Pool verkleinern bringt NICHTS – Boot mit 20 statt 977 Fragen dauert identisch 2,96 s.
#    (b) „Ein paar langsame Suiten" gibt es nicht – die 7 Suiten ohne jsdom laufen zusammen < 2 s.
#    Wer weiter will, muss die ZAHL der Boots senken: test_state hat 7, test_a11y 3,
#    abk/glossar/fokus/hilfe je 2. test_timer (8,8 s) ist echte Wartezeit für gedrosselte Tabs –
#    NICHT kürzen, das macht den Test wackelig.
# ⚠️ In dieser Sandbox überleben abgekoppelte Prozesse (`setsid nohup … &`) den bash-Aufruf NICHT
#    (eigener PID-Namespace je Aufruf). Lange Läufe nur in Teilmengen messen, nicht mit nohup.
#
# ══════════ ⚠️ DREI TOOLING-FALLEN AUS DER SITZUNG 25.07. – VOR DEM ERSTEN AUFRÄUMEN LESEN ══════════
# 1. **LÖSCHEN IST IM PROJEKTORDNER STANDARDMÄSSIG GESPERRT.** `rm` und `git rm` scheitern mit
#    „Operation not permitted"; Anlegen und Ändern geht. **Nicht aufgeben und auch nicht dem Nutzer
#    sagen, es ginge nicht** – es gibt ein Werkzeug, das die Freigabe anfordert
#    (`allow_cowork_file_delete`). Danach funktioniert alles normal. Freigabe HOLEN, BEVOR man mit
#    einem Aufräum-Task anfängt – sonst bleiben halbfertige Reste liegen (mir ist so eine Testdatei
#    in `.git/` entstanden, die ich erst nach der Freigabe wieder loswurde).
# 2. **EIN VERWAISTER `.git/index.lock` BLOCKIERT JEDEN SCHREIBZUGRIFF.** Symptom: „Unable to
#    create '.git/index.lock': File exists". Am 25.07. lag dort ein 0-Byte-Lock vom 24.07. ohne
#    laufenden git-Prozess – Rest eines abgebrochenen Laufs (mutmaßlich `push.sh`). Vor dem
#    Entfernen prüfen: Größe, Alter, `pgrep git`, `git rev-parse`, `git fsck`. Danach mit
#    `git add -N` + `git reset` gegenprüfen. **Ohne den Fund wäre auch der nächste Commit auf dem
#    Windows-Rechner gescheitert.**
# 3. **`cmd && echo "ok" || echo "weg"` LÜGT.** Schlägt `cmd` fehl, bricht die `&&`-Kette ab und der
#    `||`-Zweig meldet Erfolg. Ist mir am 25.07. ZWEIMAL passiert („(Datei ist weg)", obwohl sie
#    noch da war). **Verifikation nie in eine `&&`/`||`-Kette hängen** – Befehle einzeln absetzen
#    und `echo "-> $?"` ausgeben. Shell-Variante von Lehre 5.
#
# ══════════ ⚠️ ZWEI TOOLING-FALLEN (22.07.) – VOR DEM ERSTEN check.sh LESEN ══════════
# 1. **`npm` HÄNGT jetzt unbegrenzt, statt 403 zu liefern.** Der volle `check.sh` blieb bei
#    `npm install axe-core` >2 min ohne Ausgabe stehen. BEHOBEN: alle npm-Aufrufe in check.sh haben
#    einen `timeout`-Deckel (90/120 s). Danach läuft die Suite weiter, nur test_axe fällt lokal aus.
# 2. **Der volle `check.sh` ist in dieser Sandbox trotzdem nicht durchfahrbar**: er setzt NODE_PATH
#    auf `.tooling/node_modules` (Mount) und hängt dort beim require – die lange dokumentierte Falle.
#    WAS FUNKTIONIERT: einmalig `mkdir -p /tmp/jt2 && (cd .tooling && tar cf - node_modules |
#    (cd /tmp/jt2 && tar xf -))`, dann flaches Arbeitsverzeichnis bauen
#    (`cp lernprogramm_ap1.html /tmp/w/app.html && cp index.html manifest.webmanifest sw.js
#    styles.css *.js tools/entkommentiere.js /tmp/w/ && cp tests/*.js /tmp/w/`) und die Suiten mit
#    `NODE_PATH=/tmp/jt2/node_modules` in Paketen von 5–8 fahren. **`tools/entkommentiere.js` NICHT
#    vergessen** – sonst fällt test_entkommentiere mit „nicht gefunden".
#
# ══════════ (HISTORIE) v1.4.0 IST LIVE UND GETAGGT ══════════
# ✅ **v1.4.0 ist veröffentlicht** (Tag v1.4.0, CI grün, Cloudflare deployt automatisch,
#    live: ap1-lernprogramm.fisi2026lernapp.workers.dev). Enthält FB-R3 Punkte 1+11:
#    pool-weite Firmennamen (319 statt „Rhaus-Metall"), UNTERRICHT_MODUL → „Klausurvorbereitung",
#    Thema → „Praxisszenarien", M09-093-Korrektur, Rhaus-Guard in check.sh.
#    Arbeitsbaum sauber, alle Commits auf dem Remote (bis b8a1f79). NICHTS zu pushen.
# ⚠️ **PUSH GEHT NUR VOM WINDOWS-RECHNER DES NUTZERS** (`git push origin main` / push_von_hier.bat).
#    Der Sandbox-Proxy sperrt GitHub (alles außer Anthropic-Adressen) – NIE aus der Sandbox pushen.
#    CI-Status prüfen mit `bash ci2.sh` (auf dem Windows-Rechner, schreibt ci_log.txt).
# ⚠️ **LEHREN aus v1.4.0 (Details BUILD_LOG oben), damit sie nicht wiederkehren:**
#    (a) Pool-weite Ersetzungen zerschlagen technische Tokens (Hostnamen „x.local", Mails „@x.de“) –
#        immer gesondert prüfen. (b) Shell-/Config-Edits IMMER mit `bash -n` auf der GESTAGETEN
#        Fassung prüfen (`git show :check.sh | bash -n /dev/stdin`) – der Mount zeigt nach einem
#        File-Edit evtl. die alte Datei, `check.sh schnell` lief deshalb grün trotz Syntaxfehler.
#        (c) Guard-Meldungen in check.sh: keine geraden Anführungszeichen im melde-Text.
#
# ══════════ (erledigt) Handy-Test entfallen, Punkt 12 erledigt ══════════
# ✅ Handy-Test von v1.4.0 UND der Rest-Handy-Test aus v1.3.0 (Rechner, Stufen-Vorschau) sind per
#    Nutzer-Entscheid vom 22.07. ENTFALLEN. Nicht erneut anbieten.
# ✅ FB-R3 Punkt 12 erledigt – siehe Block ganz oben.
# ⚠️ **KORRIGIERT 26.07.:** Diese Zeile behauptete, `push_von_hier.bat` sei unversioniert – **das
#    stimmt seit Commit ff59fcd nicht mehr**, das Skript liegt zusammen mit `ci2.sh` bewusst IM Repo.
#    Unversioniert und bewusst draußen sind: `ABSTIMMUNG_R3.md` (Arbeitsdoku), die `*_preview*.html`
#    /`punkt9_*.html`-Abzüge, `ci_log.txt`, `.tooling/`, PDF und XLSX – alle über `.gitignore`.
#    Trotzdem **kein `push.sh` und kein `git add -A`**: `git add -A` würde jede NEUE, noch nicht
#    ignorierte Streudatei einsammeln. Immer die Pfade einzeln nennen und `git status` vorher lesen.
#
# ══════════ WAS v1.4.0 GEBRACHT HAT (Details im BUILD_LOG ganz oben) ══════════
#   * **FB-R3 Punkt 1:** Beispielfirma „Rhaus-Metall-GmbH" pool-weit ersetzt – 319 verschiedene
#     Firmen, je Aufgabe passend (strikt E7), gemischte Branchen. 6 Sperrlisten-Fragen von Hand
#     geprüft (Firmenrecht/Stahl/M+E hängt am Namen). Rhaus-Guard in check.sh (4d) hält es auf 0.
#   * **FB-R3 Punkt 11:** UNTERRICHT_MODUL „Unser Unterricht" → „Klausurvorbereitung" (1 Code-Zeile
#     + 105 verweis + Kommentare + 5 Test-Fundstellen). Thema „Szenarien Rhaus" → „Praxisszenarien"
#     mit idempotenter State-Migration (adaptive Stufe bleibt).
#   * **M09-093 korrigiert** (war fachlich falsch: Siemens = Personen-, nicht Fantasiefirma).
#   ⚠️ FALLE, teuer: mechanische Namensersetzung zerschlug Hostnamen/Mails (Firmenname mit
#     Leerzeichen in „wiki.x.local"/„chef@x.de"). 6 Stellen von Hand gefixt. Bei künftigen
#     pool-weiten Ersetzungen IMMER technische Tokens (.local/@/http/UNC) gesondert prüfen.
#
# ══════════ NÄCHSTER TASK: FB-R3 Punkte 2–10 (nach dem Handy-Test) ══════════
#   Punkte 1 und 11 sind erledigt. Es bleiben die inhaltlichen R3-Punkte (PLAENE.md → „FB-R3"):
#   2 Gantt-Stufen, 3 Netzplan-Vereinheitlichung, 4 Liniensysteme, 5 Matrix-Bilder, 6 Themen-Auswahl,
#   7 Onboarding, 8 „Ähnliche Fragen" (Konzept-Rückfrage), 9 Sortierung (Screenshot-Rückfrage),
#   10 Erklärungen überarbeiten, 12 Anti-Pattern-Guard nachschärfen (mit Gegenprobe).
#
# ══════════ (HISTORIE) v1.3.0 – DER PUSH HING, IST ABER ERLEDIGT ══════════
# Der Nutzer hat am 21.07. FREIGABE ERTEILT und der Release-Commit war LOKAL ANGELEGT:
#   **0709344 „Release v1.3.0: Feedback-Runde R2b komplett …"** plus der Doku-Commit
#   **32eea77 „Doku: Uebergabe nach v1.3.0 …"**. Arbeitsbaum sauber, NICHTS liegt unversioniert.
# **DER PUSH SELBST IST GESCHEITERT** – die Sandbox blockiert GitHub:
#   `fatal: unable to access 'https://github.com/Fisi2026/ap1-lernprogramm.git/':
#    Received HTTP code 403 from proxy after CONNECT`
# Gegengeprüft: github.com, codeload.github.com und api.github.com liefern alle 000/403.
# Es ist DERSELBE Proxy-Block, an dem auch `npm install` seit dem 21.07. scheitert.
# ►►► ALSO ZUERST: `timeout 20 git ls-remote origin` versuchen.
#     * ANTWORTET DAS REMOTE → nur noch `bash push.sh` (ohne Nachricht; der Commit steht schon,
#       push.sh committet dann nur einen leeren Rest oder nichts). Danach `git ls-remote --tags
#       origin` prüfen, ob die Release-Action den Tag **v1.3.0** angelegt hat.
#     * KOMMT WIEDER 403 → NICHT herumprobieren, sondern dem Nutzer sagen, dass der Push aus
#       dieser Umgebung nicht geht. Der Commit liegt sicher lokal, es geht nichts verloren.
# ⚠️ **NICHT ERNEUT COMMITTEN.** 0709344 + 32eea77 enthalten den kompletten Stand. Ein weiterer
#    Commit mit derselben APP_VERSION würde die Historie unnötig aufblähen.
#    Die Release-Action liest APP_VERSION aus app_state.js – der Tag heißt v1.3.0, egal wie viele
#    Commits davor liegen.
# ⚠️ **test_axe (5) LIEF WEITERHIN NICHT** (npm 403, axe-core nicht installierbar). Ersatzweise
#    wurde ein Proxy-Check über die neuen Elemente gefahren (doppelte IDs, Feld-Beschriftungen,
#    Button-Namen, Tabellen-Kopfzellen): **7 von 7 grün für Rechner und Stufen-Matrix.** Das
#    ERSETZT test_axe NICHT. Sobald die CI läuft, fährt sie die Suite selbst – wenn der Tag
#    v1.3.0 ausbleibt, ZUERST dort nachsehen.
# ⚠️ (HISTORISCH, erledigt) `push.sh` hatte `.git_broken_old` gefüllt (2,0 MB, 94 Dateien) – bei
#    Gelegenheit wegräumen, gehört zum Aufräum-Task nach R3.
#
# ══════════ ZUERST: WORAUF DER NUTZER WARTET ══════════
# ⚠️ **HANDY-TEST VON v1.3.0 STEHT AUS.** Die Runde R2b ist fertig und gebumpt; der Nutzer testet
#    am Gerät, bevor R3 beginnt. Besonders ansehen lassen: der neue TASCHENRECHNER bei einer
#    Rechenaufgabe (Tastengröße, Notizfeld) und die STUFEN-VORSCHAU auf der Statistik-Seite
#    (fünf Spalten, muss waagerecht scrollen statt zu quetschen).
#    Kommen Befunde: als Patch-Version in R2b nachziehen, NICHT in R3 mischen.
# ✅ Der Handy-Test von v1.2.0 ist per Nutzer-Entscheid ENTFALLEN – nicht erneut anbieten.
#    (Der Handy-Test der DRAG-TYPEN aus v0.7.1 und des Unterrichtsbereichs steht weiterhin aus.)
#
# ══════════ FB-R2b IST KOMPLETT → v1.3.0 (alle vier Punkte) ══════════
#   ✅ Links/Rechts-Layout der Zuordnung (bestehende `.split`-Klasse, am Handy einspaltig)
#   ✅ Taschenrechner + Notizfeld: `rechnerAuswerten`/`rechnerPanel` (app_util.js), Einhängung
#      über `rechnerAnhaengen(host, opts)` (app_loeser.js) an generator/rechenassistent/
#      kalkulation; in Simulation UND M09-Klausur aus. Eigener Parser, KEIN eval.
#   ✅ Stufen-Vorschau: `stufenVorschauPanel()` (app_pages2.js), volle Matrix 19 Aufgabenarten ×
#      4 Stufen, Beispiele AUS DEM POOL, aufklappbar. NEU `TYP_NAMEN`/`typName()` (app_util.js).
#      Wird per Print-Regel NICHT mitgedruckt.
#   ✅ 16 neue mehrfach-Fragen (je 4 in M01/M05/M07/M08, je 8 auf Stufe 1 und 2).
#      Pool 941 → **957**, mehrfach AP 47 → 63, Stufe 1: 2 → 10, Stufe 2: 12 → 20.
#
# ══════════ NÄCHSTER TASK: FB-R3 (nach dem Handy-Test) ══════════
#   ►►► **R3 BEGINNT MIT DEN PUNKTEN 1 UND 11** – den beiden pool-weiten Umbenennungen
#       (Firmennamen „Rhaus" → passende Beispielfirmen, UNTERRICHT_MODUL). Beide fassen JEDE
#       Frage an; zuerst abräumen, solange kein anderer Task im Pool arbeitet.
#       Detailplan: PLAENE.md → „FB-R3". VORHER mit dem Nutzer abstimmen: die Mapping-Tabelle
#       der Firmennamen und der neue Anzeigename für UNTERRICHT_MODUL.
#   ⚠️ NICHT ERNEUT ANGEHEN: R2.2 (Drag&Drop) und die Antwort-Rotation aus R2.5 sind ERLEDIGT
#      bzw. waren nie ein Problem – siehe BUILD_LOG-Eintrag zu FB-R2a, Abschnitt Bestandsabgleich.
#   ⚠️ NICHT ERNEUT FRAGEN: Zahlensysteme (dez/bin/hex) im Rechner = NEIN (Nutzer-Entscheid 21.07.).
#
# ══════════ ⚠️ DIE WICHTIGSTE LEHRE AUS R2b.3 – VOR JEDEM CONTENT-BATCH LESEN ══════════
#   **Ein Haiku-Batch lief mit „0 Fehler" durch validate_batch und war fachlich unbrauchbar.**
#   Acht Sachfehler in sechs Fragen, VIER davon am Gesetzestext widerlegt (§ 22 BBiG: Kündigungs-
#   frist ohne Monatsende · § 1 BetrVG: Betriebsrat ab FÜNF Arbeitnehmern · § 3 TVG: Tarifbindung
#   nur für Mitglieder · § 5 BBiG: 2–3 Jahre, nicht „2,5–3,5"). Der Agent meldete dazu
#   „Unsicherheiten: keine".
#   → **Bei Rechts-, Norm- und Fristenfragen ist der Agenten-Weg NICHT geeignet.** Selbst
#     schreiben oder jede Zahl einzeln am Gesetzestext prüfen. Regeln 11–13 stehen jetzt in
#     prompts/fragen_batch.md.
#   → **UND DIE GEGENLEHRE, ebenfalls teuer:** Zwei meiner eigenen neuen Regeln waren am Bestand
#     gemessen FALSCH („2–3 Richtige" – 31 der 52 Bestandsfragen haben 4; „mind. 2 Distraktoren" –
#     18 Bestandsfragen haben 1). **Vor jeder neuen Regel am Bestand messen, ob der Bestand sie
#     überhaupt einhält** – sonst entstehen zwei Qualitätsniveaus im Pool.
#
# ══════════ WAS FB-R2a GEBRACHT HAT (Kurzfassung, Details im BUILD_LOG ganz oben) ══════════
#   * Alle **109** freitext/erklaeren-Fragen haben Schlüsselbegriffe (vorher 35), 107 davon mit
#     Alternativlisten. Der Altbestand wurde auf Nutzer-Entscheid mit angehoben.
#   * **Rechenfehler behoben:** Kür-Begriffe senkten die Note einer vollständig richtigen Antwort.
#     Jetzt gilt „alle Pflicht getroffen ⇒ mindestens richtig".
#   * **Umlaut-Lücke behoben:** `L.normAntwort` normalisierte keine Umlaute – „Unterstuetzungs-
#     prozesse" galt in Lückentexten als falsch. Betrifft auch Rechenassistent/Trace/Konsole.
#   * Messwerte: realistisches Gleis 8/10 → **10/10**, strenges Gleis 0/10 → 2/10 (bewusst, siehe
#     Mittelweg-Regel), Falsch-Positive durchgehend **0**.
#   * R2.6 brauchte KEINEN Code: die Engine kann Alternativantworten längst (`luecken` ist eine
#     Liste, dropdown hat `akzeptiert`). Distraktor-Stichprobe (M05, 19 mc) ohne Befund.
#     EMPFEHLUNG steht: restliche Module nicht einzeln prüfen, in R3 mitlaufen lassen.
# ⚠️ VIER FALLEN AUS DIESER RUNDE, die viel Zeit gekostet haben (Details im BUILD_LOG ganz oben):
#    1. **Einelementige Alternativlisten sind UNGÜLTIG.** `["7"]` kippt die Frage beim Boot STILL
#       aus dem POOL – und der Fehler zeigt sich in **test_state** (State-Hygiene), nicht dort, wo
#       er entsteht. Ein einzelner Begriff ist ein schlichter String, eine Liste braucht ≥2.
#    2. **Zwei Pflichtbegriffe aus derselben Synonymgruppe sind nicht unabhängig** – ein Wort
#       erfüllt beide. test_freitext bewacht das jetzt; beim Lesen sieht man es nicht.
#    3. **Keine Allerweltswörter** in Alternativlisten („wichtig" ließ einen reinen Floskeltext
#       mit 60 % bestehen). Ebenso: „IST"/„SOLL" sind normalisiert Stoppwörter und treffen fast
#       jeden Satz – test_freitext bewacht das jetzt gezielt (Test 13).
#    4. **Ein Schwellenwert-Test ist kein Fänger für Einzelfehler.** Der IST/SOLL-Rückfall bewegte
#       das Kreuzprodukt nur von 51 auf 52 Paarungen. Die erste Fassung des Trennschärfe-Tests sah
#       schützend aus und war es nicht – erst die Gegenprobe zeigte das.
# ✅ **ERLEDIGT (22.07., mit v1.6.0): die offene Schuld aus v1.1.1 ist beglichen.** test_axe lief
#    in der CI von v1.6.0 und war grün – der Tag v1.6.0 wäre sonst nie entstanden. Lokal bleibt
#    die Suite unfahrbar (`npm install axe-core` → 403, `.tooling/node_modules` hat nur jsdom+ajv);
#    das ist ab sofort AKZEPTIERT und kein offener Punkt mehr. Merke aber: Bleibt bei einem
#    künftigen Release der Tag aus, ist test_axe der erste Verdacht, weil es die einzige Suite
#    ist, die lokal nie mitläuft.
#
# ABLAUF je Runde: umsetzen → voller Kontroll-Zyklus (alle 36 Suiten, jeden Diff lesen,
# Render-Smoke, Offline-Audit, Mobile-Audit pointer:coarse/44px, GEGENPROBE zu jedem neuen Test)
# → Version-Bump minor + CHANGELOG + BUILD_LOG + TASKLIST-Checkpoint → PAUSE: Nutzer testet am
# Handy → erst nach Freigabe die nächste Runde.
# ✅ (nach FB-R3) Aufräumen ist ERLEDIGT: keine Backup-ZIPs, kein toter Level-Code,
#    .git_broken_old existiert nicht mehr, NAECHSTER_CHAT.md gelöscht, COVERAGE.md auf die
#    manuellen Analysen (FK01–FK07, Tiefencheck) gekürzt – die veraltete 579-Fragen-Matrix ist raus.
#
# ══════════ NEU ENTSCHIEDEN 2026-07-21 – NICHT ERNEUT FRAGEN ══════════
#   * **GRUNDSATZFRAGE SIM-FORMATE (lag lange offen): MISCHFORM.** Die Simulation soll ungebundene
#     Aufgaben zulassen UND mit auto-bewertbaren mischen. Die Vorbedingung („erst Freitext-
#     Bewertung tauglich machen") ist mit R2a erfüllt. Detailplan: PLAENE.md → **„FB-R2c"**.
#     Der Punkt ist damit aus der OFFEN-Liste raus. Offene Rückfrage dort: Mischungsverhältnis.
#   * **R3 BEGINNT MIT DEN PUNKTEN 1 UND 11** – den beiden pool-weiten Umbenennungen
#     (Firmennamen, UNTERRICHT_MODUL). Beide fassen jede Frage an; zuerst abräumen, solange kein
#     anderer Task im Pool arbeitet. Steht in PLAENE.md bei FB-R3 Punkt 11.
#
# ══════════ DIE ZWEI R1-FRAGEN SIND ENTSCHIEDEN (2026-07-21) – NICHT ERNEUT FRAGEN ══════════
#   (a) ERLEDIGT in v1.1.1: Der Stand-Streifen der STARTSEITE ist zuklappbar, startet aber OFFEN.
#       `statPanel(key, titel, standardOffen)` hat dafür einen dritten Parameter bekommen;
#       `S.panelOffen` speichert weiterhin nur ABWEICHUNGEN vom jeweiligen Default.
#   (b) ENTSCHIEDEN, VERTAGT: `UNTERRICHT_MODUL` wird VOLL umbenannt – als Pool-Task in **R3**
#       (jetzt PLAENE.md „FB-R3" Punkt 11, mit gemessenem Umfang: 1 Code-Zeile + 105 `verweis`-
#       Felder). Nicht vorher anfassen. Anzeigenamen vorher mit dem Nutzer abstimmen.
# OFFEN BEIM NUTZER: Handy-Test der Drag-Typen (seit v0.7.1) und des Unterrichtsbereichs.
#   (Der Handy-Test von v1.2.0 ist am 21.07. per Nutzer-Entscheid ENTFALLEN – nicht erneut anbieten.)
# ⚠️ INVARIANTE: Die AP1-Sim (app_sim.js) filtert über `passtAP()` und schließt M09 aus – das MUSS
#    so bleiben. Die Gegenstücke für M09 sind `dueUnterricht()` und `buildM09Klausur()`; beide
#    filtern über `istUnterricht`. test_unterricht bewacht die Trennung aktiv (62 Tests).
#
# ══════════ STAND ══════════
#   Pool **983** Fragen (878 AP1/AP2 + 105 M09) · 9 Fälle/45 Teilaufgaben · 21 Typen
#   Freitext/erklaeren MIT Schlüsselbegriffen: **109 von 109** (R2a abgeschlossen)
#   Davon nutzen 107 ALTERNATIVLISTEN. Ausnahmen M04-012/M04-106 (Schreibtischtests, Pflicht =
#   einzelne Zahlen – dort gibt es keine gleichwertige Formulierung). Der Altbestand wurde am
#   21.07. auf Nutzer-Entscheid mit angehoben, damit EIN Qualitätsniveau im Pool liegt.
#   test_logik 2168 (R2.6a) · test_freitext 38 (R2a) · test_fb_r1 57 (R2b-Layout) ·
#   **test_rechner 123 (NEU, R2b.1)** · **test_stufen 46 (NEU, R2b.2)**
#   APP_VERSION **1.6.0** · sw.js ap1-v1.6.0 · **40 Suiten** (Single Source: sollwerte.env)
#   ⚠️ Zuletzt dazugekommen: test_gantt (73, R3.2), test_matrix (31, R3.5) und
#   **test_themenauswahl (60, R3.6)**.
#   ⚠️ Die Zahl „33 Suiten" stand hier lange FALSCH – a11y_proxy fehlte in der Zählung. Bei jeder
#   neuen Suite gegenprüfen: `comm -3 <(grep '^[a-z]' sollwerte.env | cut -d= -f1 | sort) \
#   <(ls tests/test_*.js | sed 's|tests/test_||;s|\.js$||' | sort)` muss LEER sein.
#   Zuletzt geändert (FB-R1, v1.1.0/v1.1.1): styles.css, app_frage.js, app_loeser.js, app_util.js,
#   app_seiten.js, app_pages2.js, app_state.js, app_ui.js, sw.js, sollwerte.env,
#   tests/test_fb_r1.js (NEU, **57**), tests/test_markiert.js (26), tests/test_unterricht.js (64).
#   R2a zusätzlich: app_util.js (gradeTeilpunkte), pool/*.json, fragen.js, tests/test_freitext.js
#   (27 → **38**), NEU tools/kalibriere_r2a.py · tools/begriffe_r2a.py · tools/mess_freitext.js ·
#   tools/probe_m01.js · prompts/begriffe_batch.md
#   Neue Bausteine, die man in R2/R3 wiederverwenden sollte statt neu zu bauen:
#     `resetKnopf(host, fn)` (app_loeser.js) · `statPanel(key, titel)` (app_util.js) ·
#     `svgBox(inner, alt, {keinTapZoom})` (app_util.js) · State: S.markierenAn, S.panelOffen.
#     `statPanel` hat seit v1.1.1 einen dritten Parameter `standardOffen` – für Panels, die offen
#     starten sollen. Die Map speichert nur Abweichungen vom Default.
#     NEU aus R2b.1: `rechnerAuswerten(ausdruck)` (app_util.js, reiner Parser ohne eval, liefert
#     {ok,wert} bzw. {ok:false,fehler}) · `rechnerPanel()` · `rechnerAnhaengen(host, opts)`
#     (app_loeser.js). Wer eine weitere Rechen-Ansicht baut, hängt den Rechner darüber ein.
#     NEU aus R2b.2: `typName(t)` / `TYP_NAMEN` (app_util.js) – Klarnamen aller 20 Aufgabentypen,
#     mit Rückfall auf den Rohnamen · `stufenVorschauPanel()` (app_pages2.js).
#   ⚠️ **KLASSE `luecke` IST RESERVIERT für Antwortfelder.** test_diagnose zählt `input.luecke`
#     gegen die Zahl der Rechenschritte/Lösungszellen – ein neues Eingabefeld mit dieser Klasse
#     lässt zwei Bestandstests fallen (genau so passiert bei R2b.1).
#   ⚠️ **WER AUF STATISTIK/SPICKZETTEL ETWAS AUFKLAPPBARES ERGÄNZT, muss gegen den
#     beforeprint-Hook gegenlesen** (`druckVorbereiten` in app_ui.js öffnet ALLE `<details>`).
#     Bei R2b.2 hätte der Statistik-Ausdruck sonst 51 vollständige Fragen mitgenommen.
#   ⚠️ **CSS HAT KEIN SYNTAX-GATE.** `node --check` und `check.sh` prüfen styles.css NICHT. Ein
#     verwaister Kommentar-Rumpf ist bei R2b.2 nur zufällig aufgefallen – CSS-Diffs gegenlesen.
#   ⚠️ PUSH-STAND: auf GitHub liegen v0.14.0 (64ddeea) und v0.15.0 (0fac57f), beide getaggt.
#   **v1.0.0 bis v1.3.0 sind als EIN Release-Commit 0709344 lokal committet** (Freigabe erteilt),
#   der Push scheitert am Proxy-403 – siehe den Block GANZ OBEN. Nach erfolgreichem Push legt die
#   Release-Action nur EINEN Tag an: v1.3.0 (Nutzer-Entscheid: ein Release statt vieler Tags).
#
# ══════════ ERSTAKTION ══════════
#   (1) **BUILD_LOG.md lesen – die obersten ZWEI Einträge**: R2b-Anfang (kurz) und FB-R2a
#       (ausführlich: vier teure Fallen, alle Messwerte, Agenten-Probe). Bei Bedarf den
#       v1.1.1-Nachtrag darunter. Älteres nur gezielt.
#   (2) `bash check.sh schnell` muss grün sein (2168 test_logik + validate_pool + idcheck +
#       validate_schema).
#   (3) Für jsdom-Suiten ZUERST frische jsdom nach /tmp/jt:
#       `mkdir -p /tmp/jt && (cd /tmp/jt && npm install jsdom axe-core)` – axe-core NICHT vergessen,
#       sonst scheitert test_axe. Suiten dann mit NODE_PATH=/tmp/jt/node_modules fahren.
#       ⚠️ npm gibt **weiterhin 403 (Registry gesperrt)**, Stand 21.07. abends erneut geprüft.
#       ⚠️ **`cp -r .tooling/node_modules /tmp/jt/` REICHT NICHT** – der Mount liefert unvollständig
#       (2302 von 2330 Dateien), jsdom bricht dann mit ERR_MODULE_NOT_FOUND ab. WAS FUNKTIONIERT:
#         `mkdir -p /tmp/jt2 && (cd .tooling && tar cf - node_modules | (cd /tmp/jt2 && tar xf -))`
#       Danach `NODE_PATH=/tmp/jt2/node_modules`. Liefert jsdom+ajv, aber KEIN axe-core
#       (test_axe fällt deshalb weiter aus, s. o.). Vor dem Push npm erneut versuchen.
#       ⚠️ NODE_PATH direkt auf `.tooling/node_modules` HÄNGT beim require – nicht versuchen.
#       ⚠️ Die Suiten laufen NICHT aus tests/ heraus – der Harness erwartet ein FLACHES Verzeichnis:
#       `mkdir /tmp/w && cp lernprogramm_ap1.html /tmp/w/app.html && cp tests/*.js *.js styles.css /tmp/w/`
#       (genau das macht check.sh in einem mktemp-Verzeichnis).
#       ⚠️ bash-Aufrufe haben 45 s Limit → Suiten in Paketen von 5–8 fahren, nicht alle 30 auf einmal.
#   (4) Vor JEDEM Task: RÜCKFRAGE-PFLICHT beachten (TASKLIST Abschnitt 0) und nach jedem Task
#       pausieren.
#   (5) ⚠️ **NIEMALS ungefragt pushen** (Nutzer-Anweisung 2026-07-21, nachdrücklich wiederholt).
#       Fertige Stände bleiben LIEGEN, bis der Nutzer ausdrücklich „Freigabe" sagt. Eine erteilte
#       Freigabe gilt NUR für den einen Release, nicht dauerhaft. Arbeit trotzdem normal
#       fertigstellen: Version bumpen, CHANGELOG, BUILD_LOG, Tests – nur `push.sh` nicht aufrufen.
#
# ══════════ WAS IN DIESER SITZUNG TEUER WAR (nicht wiederholen) ══════════
#   * **Themes vollständig prüfen, wenn ein Farb-Token angefasst wird.** Der Kontrast-Bug aus R1.1
#     war EIN im Dark-Theme fehlender Token (`--gelb-wash`) und schlug auf fünf UI-Stellen durch.
#     Bei jeder Farbänderung alle vier Blöcke (:root/dark/sepia/kontrast) gegenlesen.
#   * **Inline-Styles hebeln Media-Queries aus.** Die Wisch-Leiste hatte `style="display:flex"` –
#     eine `@media (pointer:coarse)`-Regel wäre wirkungslos geblieben. Erst das Inline weg.
#   * **`R_TYP.mc` mischt die Optionen** und bewertet erst über den globalen `#btnAktion`. Tests,
#     die per Index klicken oder das Prüfen weglassen, sehen NIE ein Feedback.
#   * **Neue Buttons kollidieren mit vorhandenen Test-Selektoren.** „← Zurück zur **Start**seite"
#     wurde von `/start/i` als Klausur-Startknopf eingesammelt. Nach jedem neuen Button die Suiten
#     laufen lassen, bevor man den Fehler dem Feature zuschreibt.
#   * **`innerHTML`-Neuzeichnen + `<details>` vertragen sich nicht:** wer den Panel-Inhalt per
#     `innerHTML` neu setzt, löscht die `<summary>`-Zeile mit. Eigenes Rumpf-Element verwenden.
#   * **Zonen bei hotspot:** validate_batch vergleicht den rect-String ZEICHENGENAU. SVG-rect und
#     zonen-Eintrag immer gemeinsam ändern – und prüfen, dass die neue Zone keine Nachbarzone
#     überlappt (passierte bei M09-051 mit Vorgang C).
#   * **beschriftung/baukasten:** die Auswahl-Chips kommen aus `labels`, NICHT aus dem Fragetext.
#     Vor jeder Umformulierung `labels` gegenlesen – sonst verrät man versehentlich einen Distraktor
#     (passiert bei M09-053).
#   * **Textsuche in Tests:** „Wiedervorlage" steht auch im Erklärungstext der Unterrichtsseite. Ein
#     textContent-Test wäre immer grün gewesen. Gezielt Elemente prüfen (`#main .meta .tag`).
#   * **Flakiness:** `dueUnterricht` blendet die letzten 10 gezogenen Fragen aus. Tests, die eine
#     bestimmte Karte erwarten, müssen `unterrichtZuletzt` vorher leeren.
#   * **SVG visuell prüfen:** `pip install cairosvg --break-system-packages`, dann svg2png(scale=2)
#     und die PNGs EINZELN ansehen. `tools/make_screenshots.py` taugt dafür NICHT (nur Manifest-Bilder).
#   * **Jeden neuen Test GEGENPROBEN**, bevor er als Absicherung zählt: Feature absichtlich kaputt
#     machen, Test MUSS fallen. Zweimal in dieser Sitzung war ein Test still immer grün.
#   * **Renderer-Unterschied:** `renderFrage` (app_frage.js, AP1-Sim) kennt nur 5 Typen,
#     `loeseFrage` (app_loeser.js, Üben + M09-Klausur) alle 21. Bewertbar ≠ darstellbar.
#   * **Tests auf Dateiinhalt:** nicht per indexOf auf Textvorkommen prüfen – „styles.css" steht
#     auch im Kommentar der Datei. Auf echte Einbindungen prüfen (`<link href=…>`, `<script src=…>`).
#   * **Widersprüchliche Quellen:** die Ideenliste (TASKLIST ~Z. 760) und die OFFEN-Kurzliste (~Z. 24)
#     weichen bei Umfang ab (bei #30/#31 zweimal passiert). Beide lesen und den Nutzer entscheiden lassen.
#   * **Vor jedem Push** `git status --short | grep "^??"` lesen: die Sandbox legt gelegentlich
#     ZIP-Dateien mit Zufallsnamen im Projektordner ab. `push.sh` nutzt `git add -A`.

---

## AP1-FREITEXT-BLOCK (Schritt 1+2 erledigt 2026-07-20, SCHRITT 3 OFFEN)
> AKTUALISIERT 2026-07-21: Schritt 3 ist jetzt **FB-R2 Punkt 1** (Nutzer-Entscheid E1) –
> er kommt NACH FB-R1, nicht mehr als erster Task. Fachliche Details unten gelten unverändert.

Nach G3 wurde auf Nutzerwunsch die Reihenfolge geaendert: zuerst Pruefungstreue der Simulation,
dann #31/#30, dann Aufraeumen. **Details und alle Messwerte im BUILD_LOG-Eintrag ganz oben** –
den ZUERST lesen, er ersetzt fuer diesen Block den Rest dieses Abschnitts.
Kurz: Freitext-Bewertung wird tauglich gemacht, bevor die Simulation ungebundene Formate zulaesst.

FERTIG (19.07.): 10 kalibrierte Musterfragen, Synonymtabelle ausgebaut, Negativ-Kontrolle (0 Falsch-
Positive bei 50 Faellen), Dauersuite `tests/test_freitext.js`.
FERTIG (20.07., Schritt 1+2): Treffer-Mechanik ueberarbeitet. Dabei kamen zwei BESTANDSFEHLER heraus,
die der eigentliche Grund fuer die schlechten Trefferquoten waren:
  * Begriffe wurden per nacktem Substring gesucht – „Die Kosten sind gesunken" erfuellte den
    Pflichtbegriff OS/Betriebssystem. Jetzt Laengenregel: <= 4 Zeichen brauchen Wortgrenzen.
  * Mehrwort-Begriffe fanden die Gruppen ihrer Bestandteile nie („PDCA-Zyklus" ≠ „pdca").
    Jetzt Token-Fallback, bei dem ALLE Tokens treffen muessen (schuetzt „Monitor B" vs. „Monitor A").
  * 3 stille Synonym-Kollisionen zusammengefuehrt; „ist"/„soll" als Solo-Begriffe entfernt.
  * `pflicht`/`kuer` duerfen jetzt Alternativlisten enthalten: `[["Monitor B","Angebot B"], "Nutzwert"]`
    – zaehlt als EIN Begriff. Schema (tools/build_schema.js) akzeptiert das, Pool nutzt es noch NICHT.
  Messwerte: Falsch-Positive 8 → 0 · Musterloesungen 144 → 145 (keine Regression) · Kollisionen 3 → 0 ·
  realistische Azubi-Antworten 0/6 → 4/6 „richtig" · test_freitext 11 → 27 · alle 29 Suiten auf Sollwert.

**NAECHSTER SCHRITT (3):** Nachruestung der 89 Fragen OHNE Begriffe PLUS Nachkalibrierung der 15
Bestandsfragen. Befund vom 19.07.: Ø 3,4 Pflichtbegriffe → nur 13 % Trefferquote; Ø 2,4 → 80 %.
Max. 4 Pflicht (test_freitext wacht darueber), Ziel 2–3. Alternativlisten stehen dafuer jetzt bereit
und sind das Mittel der Wahl fuer frageindividuelle Formulierungen; die Synonymtabelle bleibt fuer
global gueltige Gleichsetzungen. Kandidaten fuer die Nachkalibrierung sind alle Fragen mit 4 Pflicht-
begriffen (u. a. M01-115, M02-109, M03-115, M05-001).
DANACH: Simulation fuer ungebundene Formate oeffnen (Task 9), dann Aufraeumen.
(#31/#30 sind seit v0.15.0 erledigt, G5/#39 seit v1.0.0.)
Messungen ZWEIGLEISIG: streng (Fachwoerter gemieden) UND realistisch (normales Azubi-Vokabular).
⚠️ Die grosse Stichprobe (n=25) ist seit dem 19.07. NICHT wiederholt worden – die Antwortdaten lagen
in /tmp/w und sind weg. Sinnvoll erst nach Schritt 3, dann beide Messgleise nebeneinander.

## WO WIR STEHEN

Der geplante Kern (Phasen T/L/R/C/F/S) ist abgeschlossen. Das Arbeitspaket „29 Ideen" läuft in fünf
Gruppen: **G1 Infra/CI → G2 Inhalte → G3 Lernmotor → G4 Technik → G5 UX**. Detailpläne in PLAENE.md
(„AP2-G1" bis „AP2-G4"; **AP2-G5 existiert noch NICHT** und ist bei Gruppenbeginn anzulegen).

- **G1 → v0.8.0** komplett, getaggt (b22631a). CI, JSON-Schema, Render-Smoke, axe, PWA-Update, Auto-Tag.
- **G2 → v0.9.0** komplett, getaggt (b66cdfd). Pool 810 → 836, 9 Fälle, szenario2 über alle Module,
  echte Laufzeit-Randomisierung der Rechenaufgaben.
- **G4 Technik** – abgeschlossen: G4.2 (Hash-Routing) umgesetzt, G4.1 zurückgestellt (E4).
- **v0.10.0** veröffentlicht und getaggt (Tag liegt auf dbb51c6). Der beim letzten Sitzungsende offene
  Punkt „Tag fehlt" hat sich damit erledigt – die Release-Action war nur langsamer als erwartet.
- **G3 Lernmotor – KOMPLETT.** G3.1 gestrichen (E1), G3.2/G3.4/G3.6(a)/G3.6(b) umgesetzt, G3.3 war
  faktisch schon erfüllt, G3.5 auf Nutzer-Entscheid NICHT gebaut (Begründung s. u.).
- **v0.11.0–v0.13.0 wurden nie einzeln veröffentlicht** (G3.2 adaptive Schwierigkeit je Thema,
  G3.6b AP1-Punkteverteilung, Freitext-Mechanik, M09-Integration/Spickzettel). Sie stehen als eigene
  CHANGELOG-Blöcke, sind aber gemeinsam mit **v0.14.0** (Commit 64ddeea, getaggt) gepusht worden –
  Nutzer-Entscheid: EIN Release statt vieler Zwischen-Tags.

## PUSH-VERFAHREN (erledigt für v0.14.0 – hier als Merkzettel für den nächsten Release)
Ablauf: `bash check.sh schnell` + alle 30 Suiten grün → `bash push.sh "…"` → prüfen, ob der Tag
innerhalb weniger Minuten auf GitHub erscheint (`git ls-remote --tags origin`). Die Release-Action
legt ihn NUR bei komplett grüner CI an.
Häufige Ursachen, wenn der Tag ausbleibt: fehlender CHANGELOG-Block `## vX.Y.Z`; Test-Deps im
falschen Verzeichnis (die CI installiert nach `.tooling`, NICHT /tmp – sonst findet
`tools/validate_schema.js` sein ajv nicht); PAT-Permission „Workflows = Read and write".
⚠️ `push.sh` gibt beim Mount immer „unable to unlink … Operation not permitted"-Warnungen aus –
das ist normal (der Mount erlaubt kein Löschen) und KEIN Fehler; entscheidend ist die Zeile
„Gepusht: …" und danach der Remote-Abgleich.
⚠️ Vor dem Push `git status --short | grep "^??"` lesen: die Sandbox legt gelegentlich ZIP-Dateien
mit Zufallsnamen im Projektordner ab (zuletzt `zigbePZQ`, 1,7 MB). Sie stehen jetzt in .gitignore.

## WAS G3.2 GEÄNDERT HAT (für den Fall, dass etwas nachgezogen werden muss)
Nutzer-Entscheide: 3er-Block mit Reset (3/3 richtig → +1, höchstens 1 richtig → −1, sonst gleich);
`S.level` bleibt Startwert für unbekannte Themen und Übersteuerung im manuellen Modus; harter Filter je
Thema mit dem bisherigen Pool-Fallback; alte Logik-Funktionen bleiben ungenutzt stehen.
- logik.js: `L.themaKey`, `L.themaStufe`, `L.adaptivBuchen`, `L.CONFIG.adaptivBlock`/`adaptivAbSchwelle`
- app_state.js: `S.themaLevel`, `S.themaTrack` (KEIN STATE_VERSION-Bump – Defaults kommen über
  `Object.assign(defaultState(), s)` in `ladeState()`)
- app_seiten.js: neue `stufeFuer(f)`, `kandidaten()` filtert dagegen statt gegen `S.level`
- app_verbuchen.js: 8/10-Block und `zeigeLevelDialog()` gelöscht, stattdessen `L.adaptivBuchen`
- check.sh: Mount-Ende-Marker für app_verbuchen.js nachgezogen (zeigte auf den gelöschten Dialog)
- TOTE RESTE, bewusst stehen gelassen: `L.autoLevel`/`L.trackAntwort`/`L.levelReif` samt ihrer Tests in
  test_logik (hält den Sollwert 2162 stabil) sowie `S.levelTrack`/`S.levelDialogGezeigt`. Ein Aufräumen
  wäre ein eigener kleiner Task und würde die Sollwerte berühren.

## ENTSCHEIDE (alle vom Nutzer bestätigt, gelten weiter)
- **E1: Spaced Repetition (#1) GESTRICHEN.** Das Fehler-Deck ist bereits ein Leitner-System –
  `L.fdOnWrong` = morgen, `L.fdOnCorrect` staffelt auf 3 und 7 Tage, nach `fdStreakWeg` = 3 Treffern
  fliegt die Frage raus (= 3-Box-Leitner mit 1/3/7 Tagen).
- **E2 (Migration in Boxen): hinfällig**, da kein Leitner.
- **E3: #6 umgesetzt, Level-Dialog entfallen**, manueller Modus bleibt. → mit G3.2 erledigt.
- **G3.5 (#13) NICHT GEBAUT** (Nutzer-Entscheid 2026-07-19). Begründung: Das Panel „Schwächste Themen
  (mind. 3 Antworten)" auf der Statistik-Seite existiert längst; gefehlt hätte nur die Format-Dimension,
  für die es überhaupt keine Erfassung gibt (Format-Daten erst ab Einbau, 21 Typen bräuchten erst
  Namen). Falls je reaktiviert, gelten bereits: Keys `F:typ` + eigenes Panel (NICHT die volle Kreuzung
  Thema × Format), Schwelle 5 Antworten, Panel immer sichtbar mit Sammel-Hinweis.
- **E4: #21 (fragen.js-Split) zurückgestellt** – Offline-Nutzen längst erfüllt, Cache-Nutzen greift wegen
  des versionierten Cache-Namens nicht.
- **#4 Meisterung: faktisch schon erfüllt** (`fdStreakWeg` = 3 statt der geplanten 2). Offen ist nur die
  Frage, ob 3 → 2 gesenkt werden soll; das kann test_logik-Sollwerte berühren.
- **Versionierung:** Fertiges wird sofort veröffentlicht, statt auf ganze Gruppen zu warten.

## WAS G3.6b GEÄNDERT HAT
RECHERCHE-BEFUND (zwei unabhängige Quellen): AP1 = vier ungebundene Aufgaben, je **20–30 Punkte**,
Summe 100, 90 Minuten; der Schwerpunkt jeder Aufgabe wird ZUFÄLLIG gezogen. Die festen 25/25/26/24
waren nicht falsch, nur eine von vielen Ausprägungen. Nutzer-Entscheide: Punkte je Simulationslauf
würfeln; die thematische Zuordnung der vier Aufgaben FEST lassen, damit jeder Durchlauf den ganzen
Stoff abdeckt.
- logik.js: `L.wuerfelPunkte(n,min,max,summe,rng)` + `L.CONFIG.ap1PunkteMin/Max/Summe` (20/30/100)
- app_sim.js: `simPunkte`, `neuePunkteVerteilung()` (bei jedem Betreten der Sim-Startseite),
  `punkteFuer(bi)`; beim Start wird die Verteilung als `sim.punkte` EINGEFROREN – sonst laufen
  Vorschau, Kopfzeile und Auswertung auseinander, sobald zwischendurch neu gerendert wird
- app_seiten.js: `AP1_AUFGABEN[].punkte` ist nur noch Rückfallwert
- test_note 41 → 55 (Summe/Korridor über 300 Ziehungen, Randfälle, unerfüllbare Vorgabe)

## ✅ FRUEHER OFFENER NEBENBEFUND – ENTSCHIEDEN 2026-07-21: MISCHFORM (Detailplan PLAENE FB-R2c)
Die AP1 enthält laut Recherche **ausschließlich ungebundene Aufgaben** – frei formulierte Antworten,
Kurzaufsätze, Konstruktionsaufgaben –, KEIN Multiple Choice. Die Simulation arbeitet dagegen mit
auto-bewertbaren Formaten (`autoBewertbar` in app_sim.js: mc/lueckentext/zuordnung/dropdown/mehrfach).
Das ist eine Grundsatzfrage zur Prüfungstreue, kein Bug. Nicht eigenmächtig angehen – erst fragen.
(Ebenfalls bestätigt: der Prüfungskatalog seit Frühjahr 2025 hat SQL und RAID aus AP1 gestrichen; die
Pool-Abgrenzung passt bereits dazu.)

## ERLEDIGT (Historie): GRUPPE G5 UX → v1.0.0
#24 „Warum falsch?" ausklappbar, #26 Vorlese-Button, #28 Onboarding-Tour (existiert teilweise schon –
vorher prüfen!), #30 Print-CSS, #31 Schriftgrößen, #39 echte Landing-Page.
⚠️ Detailplan **„AP2-G5" ZUERST anlegen** (analog AP2-G4; existiert noch NICHT) – und wie in G3 ZUERST
im Code nachsehen, was schon da ist. In G3 waren drei von vier untersuchten Ideen bereits umgesetzt,
und G3.5 entfiel dadurch ganz. Das ist der wirksamste Einzelschritt der ganzen Arbeitsweise.

## ARBEITSWEISE (verbindlich, hat sich bewährt)
- **Vor jedem Task: im Code nachsehen, was schon existiert.** Das spart mehr Zeit als jede Umsetzung.
- Bei jeder Design-Entscheidung mit mehreren sinnvollen Optionen: AskUserQuestion, nie eigenmächtig.
- Je Task: umsetzen → SELBST prüfen (alle betroffenen Suiten einzeln) → BUILD_LOG/TASKLIST/PLAENE →
  START_PROMPT auf den nächsten Task → PAUSIEREN.
- Verifikation ist nie Agentensache. Jeden Diff lesen, Zahlen unabhängig nachrechnen.
- Neue Inhalte NUR nach pool/*.json → `python3 build_fragen.py`. **fragen.js und faelle.js NIE direkt
  editieren** (Drift-Guard in check.sh schlägt sonst an – und tut das zu Recht).
- Nach einer Pool-Korrektur IMMER `python3 build_fragen.py` laufen lassen, bevor gepusht wird.

## TOOLING-FALLSTRICKE
- **jsdom:** die persistente `.tooling/jsdom` hängt beim require → frische Installation nach `/tmp/jt`
  (`npm install jsdom axe-core`), Suiten mit `NODE_PATH=/tmp/jt/node_modules`. `test_timer` als Boot-Probe.
- **bash-Limit 45 s:** der volle `check.sh` passt nicht in einen Aufruf → `check.sh schnell` plus
  jsdom-Suiten in Blöcken von 4–6 (`timeout 33 node test_X.js`).
- **check.sh Mount-Gate:** meldet „MOUNT UNVOLLSTÄNDIG", wenn der End-Marker einer Datei fehlt. Wird das
  Dateiende bewusst geändert, ist der Marker in check.sh (Zeilen ~40–50) mit nachzuziehen – sonst jagt
  man einem Mount-Problem hinterher, das keines ist.
- **Mount:** Löschen ist gesperrt („Operation not permitted") → einmalig `allow_cowork_file_delete`
  freigeben. `push.sh` legt bei JEDEM Lauf `.git_broken_old` an und schiebt Lock-Dateien hinein – danach
  wegräumen, sonst wächst der Ordner.
- **zip** kann auf dem Mount nicht in-place schreiben → Archiv nach /tmp bauen, dann per `cp` kopieren.
  Beim Packen ausschließen: `.git`, `.git_broken_old`, `.tooling`, `*.zip`, `node_modules`.
- Nach File-Tool-Edits kann der bash-Mount die Datei kurz abgeschnitten zeigen → `sleep 3` oder
  `bash verify.sh`.

## FIXPUNKTE
Prüfung **Mi 24.02.2027** (im App-Einstellungsfeld eingetragen, Countdown läuft).
Fortschritts-Export/Import und Lernplan L2 sind ENDGÜLTIG GESTRICHEN – nicht erneut anbieten.
Doppelklick-**Offline-Invariante** (file://) wahren – deshalb Hash-Routing statt History-API.
Sollwerte-Single-Source = sollwerte.env. Deploy NUR via `bash push.sh "Nachricht"`;
live unter https://ap1-lernprogramm.fisi2026lernapp.workers.dev (Cloudflare).

## NUTZER-PUNKTE
- ✅ P22 Doppelklick-Test erledigt (2026-07-19), App läuft unter file://.
- ✅ Prüfungsdatum 24.02.2027 eingetragen, Countdown läuft.
- OFFEN: Handy-Test der Drag-Typen am installierten Stand (seit F3).
- Die beiden Manifest-Screenshots sind PIL-Nachbauten – bei Bedarf durch echte Handy-Screenshots
  gleicher Größe (412×915) und gleichen Namens ersetzen; Code/Manifest bleiben unberührt.

## IDEENSPEICHER (nicht eingeplant)
#47 Playwright · #32 IndexedDB · #21 fragen.js-Split (E4) · #1 Spaced Repetition (E1) ·
Aufräumen der toten Level-Reste (autoLevel/trackAntwort/levelReif, levelTrack/levelDialogGezeigt) ·
G2 Selbstbewertungs-Sim · G4 Altprüfungs-Analyse.


## Verschoben aus START_PROMPT.md am 2026-07-30 (Längendeckel 600 Zeilen)

# **WAS v1.12.0 GEBRACHT HAT (ETAPPE 6 IST DAMIT FERTIG):**
#   * **26 Stufe-4-Fragen für 13 Fragetypen** (je 2). ⚠️ **Der Plan nannte 9 Typen – gemessen waren
#     es 13.** `fehlersuche`, `kalkulation`, `szenario2` und `trace` hatten Stufe 4 NUR in M09;
#     mit der Auflösung des Sonderpools (Etappe 2) wären diese Vertretungen verschwunden.
#   * **Die letzten zwei Stufenlücken geschlossen** (M06 BSI-Grundschutz Stufe 2 = M06-030,
#     M08 Tarifrecht Stufe 3 = M08-030). **Stufenlücken-Wächter steht jetzt auf 0** – und darf
#     dort bleiben: Das ist keine Restschuld mehr, sondern eine Eigenschaft des Pools.
#   * Pool **1045 → 1073**, Stufe-4-Fragen **54 → 80**.
#

### Etappe-3-Chronik, verschoben aus START_PROMPT.md am 2026-07-30

#   ⚠️ **UMFANG NEU GEMESSEN 27.07.: 599 Fragen** nach dem `modul`-Feld
#   (M01 110 · M02 109 · M03 192 · M07 133 · M08 55). **Die alte Angabe „601 Fragen (M01 99 ·
#   M02 90 · M03 157 · M07 125 · M08 55)" war in sich falsch** – die Einzelzahlen summieren sich auf
#   526 und zählen nur die gleichnamigen Pool-DATEIEN. M01 liegt z. B. auch in `pool_m_transfer.json`,
#   `pool_m_l4.json` und vier weiteren. **Maßgeblich ist das `modul`-Feld.**
#   ✅ **VON URSPRÜNGLICH 120 TELL-TREFFERN IN DIESEN FÜNF MODULEN SIND NOCH 5 OFFEN**
#   (M01 **1** · M02 **0** · M03 **3** · M07 **1** · M08 **0**), dazu 4 in M09. M04/M05/M06 stehen
#   nach Etappe 1 auf **0**. Poolweit: **9 von 285 = 3,2 %.** Die 5 sind Nutzer-Entscheide
#   (M01-117, M03-001, M03-002, M03-020, M07-008) – **nicht erneut vortragen.**
#   Verfahren war wie Etappe 1: je Frage die markierte Antwort verifizieren, jeden Distraktor prüfen,
#   Distraktorlängen angleichen, Erklärung gegenhalten. Befunde je Modul SAMMELN und vorlegen.
#   ⚠️ **REIHENFOLGE:** Der Plan wollte Etappe 2 (M09) VOR Etappe 3. **NUTZER-ENTSCHEID 27.07.:
#   Etappe 3 beginnt sofort, die doppelte Arbeit an den eingegliederten M09-Fragen wird bewusst
#   in Kauf genommen.** Nicht erneut zur Diskussion stellen.
#
# ══════════════════════════════════════════════════════════════════════════════════════════════
# CI-Runtime v6 (28.07.2026) – ausgelagert am 30.07. aus START_PROMPT.md Abschnitt 2
# Der Griff ist abgeschlossen und belegt; hier steht, WARUM er so ausgefallen ist.
# ══════════════════════════════════════════════════════════════════════════════════════════════
# ✅ **NODE 20 IST AUS DER CI RAUS – `ci.yml` STEHT AUF `@v6`.** Die Workflows nutzten
#   `actions/checkout@v4` und `actions/setup-node@v4`; beide zielten auf die abgekündigte
#   Node-20-Runtime und wurden von GitHub nur noch zwangsweise auf Node 24 ausgeführt. Geändert
#   sind **genau drei `uses`-Zeilen** (checkout in beiden Jobs, setup-node im Job `check`);
#   `node-version: '22'` blieb unberührt – **das ist die Node-Version für die TESTS, nicht die
#   Runtime der Action.** Kein Pool-Eingriff, kein Bump.
#   ⚠️ **DER PLAN SAGTE `@v5` – GEMESSEN WAR v5 SELBST SCHON ABGELÖST** (checkout v6.0.3 vom
#   02.06.2026, setup-node v6.4.0 vom 20.04.2026). **Nutzer-Entscheid 28.07.: direkt auf v6.**
#   Vor dem Umstellen belegt statt gehofft: setup-node v5/v6 cacht automatisch nur bei
#   `packageManager` in `package.json` – **das Repo hat weder `package.json` noch Lockfile**;
#   checkout v6 legt `persist-credentials` unter `$RUNNER_TEMP`, was den `release`-Job nicht
#   berührt (er liest Tags lokal, released über `gh` + `GH_TOKEN`, pusht nicht); Mindest-Runner
#   v2.327.1/v2.329.0 ist auf `ubuntu-latest` weit übererfüllt.
#   ✅ **BELEGT (Nutzerangabe 28.07., `ci2.sh`): CI-Lauf 30387611949 auf main = SUCCESS**, beide
#   Jobs grün, 2m1s. ►► **Der Release-Job ist der eigentliche Beleg:** Er lief mit `checkout@v6`
#   und `fetch-depth: 0`, hat die Tags gelesen und mangels Bump korrekt übersprungen (7s) –
#   damit ist die `persist-credentials`-Änderung praktisch entkräftet, nicht nur theoretisch.
#   Die Node-20-Annotation kann nicht wiederkommen: Sie listet die Actions auf, die Node 20
#   anzielen, und davon gibt es keine mehr. **Der Griff war eine eigene CI-Runde wert.**

# ══════════════════════════════════════════════════════════════════════════════════════════════
# LÄNGENGRIFF UND RATSCHE (27./28.07.2026) – ausgelagert am 30.07. aus START_PROMPT.md Abschnitt 2
# Der Griff ist ABGESCHLOSSEN. Handlungsleitend bleiben nur die elf Bestandsentscheide und die
# Lehren; beides steht weiter in START_PROMPT.md (Abschnitt 2 kurz, Abschnitt 6 ausführlich).
# Hier die vollständige Herleitung: Zahlenverlauf, Einzelfälle, Absicherung.
# ══════════════════════════════════════════════════════════════════════════════════════════════
# ✅ **DER TELL-ZÄHLER FIEL IN SECHS LÄUFEN VON 124 AUF 9 (3,2 % von 285), Nenner konstant 285** –
#   echte Korrektur, keine Verdünnung. **Etappe 3 ist damit inhaltlich durch, alle fünf Module.**
#   **Rest: M01 1 · M02 0 · M03 3 · M07 1 · M08 0 · M09 4** (M09 ist Etappe 2).
#   Nur Distraktoren verlängert, **nie eine richtige Antwort gekürzt** – in M08 wurden bei zehn
#   Fragen über Faktor 2,5 die Antworten auf ihre Kernaussage gebracht und die Begründung in die
#   `erklaerungLang` verschoben (Nutzer-Entscheid 28.07.). **Kein Distraktor über 1,15 ×.**
#   ⚠️ **M07 STELLT NUR NOCH M07-008** (30 gegen 29 Zeichen, reine Aufzählungen) – Nutzer-Entscheid
#   28.07., bleibt stehen wie M01-117 und M03-001/002. **Nicht erneut vortragen.**
#   ✅ **ERLEDIGT 28.07.: DIE VIER BESTANDS-FRAGEN MIT ZU LANGEN DISTRAKTOREN.** M07-014 (1,54 →
#   **1,14**) · M07-015 (1,50 → **1,10**) · M07-024 (1,18 → **1,13**) · M07-116 (1,17 → **1,15**).
#   Die richtige Antwort blieb in allen vier unangetastet. **M07-116 auf Nutzer-Entscheid über die
#   ZU KURZEN Distraktoren gelöst** (Feld war 54/27/36/63, jetzt 54/61/46/62) – ein Kürzen von 63
#   auf 62 hätte nur die Kennzahl bedient.
#   ✅ **ERLEDIGT 28.07.: DER POOLWEITE LÄNGENGRIFF – 42 VON 49 FÄLLEN ENTSCHÄRFT.** Der Befund
#   war viel größer als die vier: poolweit hatten **65 mc-Fragen** einen Distraktor über 1,15 ×.
#   **16 davon haben eine richtige Antwort UNTER 25 Zeichen** – dort greift `MIN_OPTIONSLAENGE`,
#   sie wurden nicht angefasst. Von den verbleibenden 49 sind **42 korrigiert, 7 offen.**
#   ✅ **DER GRIFF IST SEIT DEM 28.07. AUCH ABGESICHERT – ER KANN NICHT MEHR ZURÜCKFALLEN:**
#   `tools/apply_batch.py` **Klasse 10** weist jede neue Frage mit Distraktor über 1,15 × ab,
#   `tests/test_didaktik.js` **Wächter 5** misst den Bestand mit **Schwelle 0**, und
#   `laengen_ausnahmen.json` führt die Bestandsentscheide maschinenlesbar. Neu ist außerdem
#   `tools/opt_ersatz.py` – Optionen ersetzen mit Längenprüfung VOR dem Schreiben.
#   ⚠️ **DIE AUSNAHMEDATEI IST EINE ESCAPE-LUKE.** Eine ID dort einzutragen macht den Wächter grün,
#   ohne dass sich eine Frage verbessert – **nur mit Nutzer-Entscheid, Datum und Begründung.**
#   ⛔ **DIE SIEBEN BLEIBEN ABSICHTLICH STEHEN – NUTZER-ENTSCHEID 28.07. NICHT ERNEUT VORTRAGEN:**
#   **M02-301 (1,53) · M06-307 (1,39) · M04-317 (1,37) · M06-002 (1,30) · M06-306 (1,16) ·
#   M03-715 (1,16) · M06-011 (1,15)**. Dort steckt die Länge in der Sache: Rechenterme, die den
#   falschen Weg ausschreiben (M02-301) · Fachbegriffe mit Übersetzung (RBAC/ABAC/DAC/MAC,
#   „Defense in Depth (mehrschichtige Verteidigung)") · Aufzählungen und Zahlen (M04-317,
#   M03-715). **Formal Treffer, didaktisch keine** – dieselbe Klasse wie M01-117 und
#   M03-001/002/020. ► **DAMIT IST DER LÄNGENGRIFF ABGESCHLOSSEN, NICHT NUR PAUSIERT.**
#   Wer künftig eine dieser sieben IDs im Messlauf sieht: **stehen lassen, nicht melden.**
#   ⚠️ **DER LAUF HAT NEUN NEUE TELLS ERZEUGT UND SIE NUR DURCH MESSEN GEFUNDEN** (M04-007,
#   M04-017, M04-201, M04-731, M05-010, M06-309, M06-731, M06-736, M06-772). Immer dieselbe
#   Ursache: Der Distraktor wurde so weit gekürzt, dass er KÜRZER wurde als die richtige Antwort.
#   **Das ist M07-107 in neunfacher Ausführung.** Die Warnung stand in dieser Datei und hat den
#   Fehler nicht verhindert. ► **Deshalb prüft das Skript jetzt VOR dem Schreiben per `assert`,
#   dass der neue Wert strikt länger als die richtige Antwort und höchstens 1,15 × ist. Die
#   Zusicherung hat zweimal angeschlagen.** **Eine Regel im Skript wird eingehalten, eine in der
#   Doku nicht.**
# ⛔ **VIER TREFFER BLEIBEN ABSICHTLICH STEHEN (Nutzer-Entscheide 27.07.). NICHT ERNEUT VORTRAGEN:**
#   **M01-117** (reine Rechenterme, 2 Zeichen Abstand) · **M03-001** und **M03-002** (reine
#   Fachbegriffe: „Router" 6 Zeichen gegen „Glasfaserkabel (Lichtwellenleiter/LWL)" 38) ·
#   **M03-020** (die Länge steckt im ausgeschriebenen Eigennamen „BITV (Barrierefreie-
#   Informationstechnik-Verordnung)"). Genau die Fälle, für die es `MIN_OPTIONSLAENGE = 25` gibt –
#   sie greift nur deshalb nicht, weil die längste Option über der Schwelle liegt.
#   **Formal Treffer, didaktisch keine.**
#
# ⚠️ **DIE FAKTOR-TABELLEN IN DEN BEFUNDE-DATEIEN SIND NACH DEM INHALTSLAUF ÜBERHOLT – VIERMAL
#   IN FOLGE BESTÄTIGT.** In M02 und M03 hatte sich je ein Treffer durch eine inhaltliche Korrektur
#   **von selbst erledigt** (22 → 21 bzw. 36 → 35). **In M07 stiegen zwei Faktoren sogar an**
#   (M07-018 1,34 → 1,45 · M07-005 1,12 → 1,17), weil die Sprachkorrektur die RICHTIGE ANTWORT
#   verlängert hat. **REIHENFOLGE JE MODUL: erst Inhalt und Sprache, dann NEU MESSEN, dann Längen.**
#   Gilt für M08 genauso.
# ⚠️ **GLEICHSTAND ZÄHLT ALS TREFFER** (`len[i] === max`). Ein Distraktor muss STRIKT länger sein.
#
# ✅ **DIE RATSCHE IST NACHGEZOGEN (Nutzer-Entscheid 28.07.): `test_didaktik.js` steht jetzt auf
#   ZIEL 5,0 · SCHWELLE 8,0** (vorher beides 45,0). Bei 285 gewerteten mc-Fragen wird der Test
#   **ab 23 Treffern rot** – heute sind es 9. Das ist bewusst Luft für neue Fragen; das eigentliche
#   Netz ist `tools/apply_batch.py`, das jede neue Frage mit Tell schon beim Einsortieren abweist.
#   ⚠️ **GEGENGEPROBT:** Mit testweiser Schwelle 3,0 bei Istwert 3,16 % meldet die Suite zwei
#   Fehler – der Wächter greift also wirklich. **NUR SENKEN, NIE ANHEBEN.**

# ============
# M09 UND DIE PROBEKLAUSUR (30.07.2026) – abgeloest durch Etappe A am 04.08.2026
# ============
# Hier stand bis zum 04.08. der Stand der Probeklausur-Ausrichtung. Er ist ueberholt:
# 30 der beschriebenen Fragen sind geloescht, 48 nach M08/B3 umgezogen (BUILD_LOG 04.08.).
# Die Lehren aus diesem Lauf gelten weiter und stehen deshalb im Wortlaut hier.
# ► **M09 IST AM 30.07. AUF DIE PROBEKLAUSUR AUSGERICHTET WORDEN – DAS TABU IST AUFGEHOBEN.**
# Der Nutzer hat `wiso_fragen_digitalisiert.pdf` geliefert („Übungsfragen WiSo 31.07.2026 –
# FISI0126", 46 Aufgaben). **Nutzer-Entscheid 30.07.: Das Blatt ist ein Goodie des Lehrers und der
# BAUPLAN der echten Klausur, keine Stichprobe.** Details im BUILD_LOG-Eintrag vom 30.07.
#   * **19 Fragen gestrichen** (M09-131…149, Thema `Berufsausbildung (BBiG/JArbSchG)` – kommt in
#     der Klausur nicht vor). **Das Thema ist aus `L.M09_THEMEN` raus.** BBiG bleibt in M08.
#   * **24 Fragen neu**, neues Thema **`Aufbau- & Ablauforganisation`**, dazu SMART und PDCA.
#   * **M09: 105 → 121 Fragen · 13 Themen · alle 21 Fragetypen · Stufen 44/37/33/7 (36/31/27/6 %).**
#   ✅ **NACHGEPRÜFT 30.07. (2. Durchgang) – Details im BUILD_LOG-Eintrag „30.07. (2)":**
#     Gewichtung Vollmachten 8,2 → 10,7 % (größtes Klausurthema) · frei formulierte Fragen
#     11,8 → 19,0 % (Klausur: 58,7 %) · **jedes Thema hat jetzt eine Stufe-3-Frage** ·
#     Wiedervorlage in M09 sofort fällig statt morgen · Ziehung ohne Typ-/Themenwiederholung.
#     ⚠️ **Regex-Trefferzählung täuscht** („GmbH" traf 53 Fragen – steht in jedem Firmennamen).
#       **Belastbar ist nur Klausuranteil gegen Poolanteil je `thema`.**
#     ⚠️ **DER STUFENLÜCKEN-WÄCHTER SIEHT KEINE ZU KURZE LEITER** – er sucht Lücken UNTERHALB
#       einer besetzten Stufe. Vier Themen endeten bei S2 und die Prüfung war grün.
#     ⚠️ **`test_freitext` TRENNSCHÄRFE (Grenze 60) IST EMPFINDLICH GEGEN NEUE FREITEXTFRAGEN.**
#       Generische Pflichtbegriffe (`Inhaber`, `Geschäftsführer`) treiben sie hoch. **Grenze NICHT
#       anheben.** Pflichtbegriffe müssen WÖRTLICH in der eigenen Musterlösung stehen, max. 4 Gruppen.
#     ⛔ **M09-157 GESTRICHEN** (redundant zu M09-115/120/156). **Wer drei Wächter gleichzeitig gegen
#       sich hat, hat kein Kennzahlenproblem, sondern eine überflüssige Frage.**
#   * **Längen-Tell in M09: 4 → 0.** Poolweit **9 → 5 = 1,72 %** – und die fünf sind nur noch die
#     Bestandsentscheide M01-117 · M03-001 · M03-002 · M03-020 · M07-008. **Nicht vortragen.**
#   * Entumlauteter Fließtext in M09 weg (67 Vorkommen). Spickzettel und Schema nachgezogen.
#   ⚠️ **DREI FALLEN, DIE DABEI AUFGEFALLEN SIND – ALLE VOR DEM NÄCHSTEN M09-GRIFF LESEN:**
#     1. `apply_batch.py` las das Sollmodul aus `pool_m09_unterricht.json` als `M09_UNTERRICHT`
#        und wies **jede** M09-Frage ab. Gefixt und gegengeprobt. **Die einzige Pool-Datei mit
#        Namenszusatz war die einzige, die das Skript nie gesehen hatte.**
#     2. `--neues-thema` pflegt das SCHEMA NICHT mit. Ein neues Thema muss zusätzlich in
#        `logik.js` (`L.M09_THEMEN`) und `tools/build_spick_m09.py` – sonst fallen erst
#        `validate_schema` und `test_unterricht`, also NACH dem Schreiben.
#     3. `schluesselbegriffe` gehört nur an Fragen **mit `musterloesung`**. An sieben mc-Fragen
#        gehängt: Klasse 8 und 9 blind, gemeldet von `test_freitext`. **Ein Feld kann typrichtig
#        und trotzdem am falschen Fragetyp sein.**
#   ⛔ **ETAPPE 2 IST VERSCHOBEN, NICHT GESTRICHEN** (Nutzer-Entscheid 30.07.). Wer sie später
#     angeht, fasst die 24 Fragen von heute erneut an – bekannt und in Kauf genommen.
#   ⚠️ **KLAUSURTERMIN 31.07. STEHT WEITER HART IM CODE** (`app_seiten.js:859`) – ab 01.08. zeigt
#     der Bereich „liegt zurück". **Vor einer Änderung fragen.**

# ============
# ETAPPE 3, WIE SIE GELAUFEN IST (28.–30.07.2026) – am 04.08. aus START_PROMPT ausgelagert
# ============
# Grund der Auslagerung: START_PROMPT stand bei 599 von 600 Zeilen. Der Block war dort schon
# als „nicht mehr handlungsleitend" gekennzeichnet. Die Lehren daraus stehen in Abschnitt 6
# von START_PROMPT und in TASKLIST 0b – hier steht die Chronik.
# ⚠️ ÜBERHOLT: Der Absatz „50 der 133 M07-verweis-Felder sind falsch" nennt eine Schätzung,
#   die am 04.08. GEMESSEN wurde: M01 hatte 12 von 109 falsch (11,0 %), poolweit hochgerechnet
#   rund 90 – nicht mehrere hundert. Siehe E3_M01_VERWEISE.md.
# ---- ARCHIV: wie Etappe 3 gelaufen ist (nicht mehr handlungsleitend) ----
#   ⚠️ **UMFANG: 599 Fragen** nach dem `modul`-Feld (M01 110 · M02 109 · M03 192 · M07 133 ·
#   M08 55) – NICHT nach den gleichnamigen Pool-Dateien. **Maßgeblich ist das `modul`-Feld.**
#   Von 120 Tell-Treffern in diesen fünf Modulen sind **5 offen, alle Nutzer-Entscheide**.
#   Verfahren, Reihenfolge-Entscheid und Zahlenhistorie: `START_PROMPT_ARCHIV.md`.
#   ✅ **M07 UND M08 SIND DURCH (28.07.).** Protokolle: `ETAPPE3_M07_BEFUNDE.md`,
#   `ETAPPE3_M08_BEFUNDE.md` – je mit Abschnitt H „was tatsächlich geändert wurde".
#
# ⚠️ **ZWEI LEHREN AUS DIESEN LÄUFEN, DIE WEITER GELTEN:**
#   1. **NACH JEDEM LAUF DEN FREIGEGEBENEN UMFANG GEGEN DAS SKRIPT ABHAKEN** – M07-A1 fiel sonst
#      komplett aus, obwohl er der erste Befund war.
#   2. **BEI EINEM BEFUND ALLE FELDER DER FRAGE DURCHGEHEN** – M08-603 war nur halb korrigiert.
#
# ✅ **WIEDERKEHRENDES MUSTER, DAS ARBEIT SPART:** Zu sechs der zwanzig M08-Befunde gab es im
#   SELBEN Modul eine Frage, die es richtig macht. **Erst suchen, ob der Pool die richtige Fassung
#   schon enthält – dann übernehmen, statt eine weitere Formulierung zu erfinden.**
#
# ⚠️ **DIE VIERTE BESTÄTIGUNG: EINE SPRACHKORREKTUR IST IMMER AUCH EIN LÄNGENEINGRIFF.**
#   In M07 stiegen nach dem Inhalts-/Sprachlauf **M07-018 von 1,34 auf 1,45** und **M07-005 von
#   1,12 auf 1,17** – weil „Gewährleistungszeit" zu „Verjährungsfrist für Mängelansprüche" wurde
#   und „biographische Daten des Kundenbetriebs-Leiters" zu „biografische Angaben zur Leitung des
#   Kundenbetriebs". **Wer eine Antwortoption sprachlich anfasst, muss die Länge danach neu messen.**
# ⚠️ **BEIM ZURÜCKNEHMEN ZU LANGER DISTRAKTOREN ENTSTEHEN NEUE TREFFER.** In M07-107 kippte die
#   Korrektur von 1,31 auf 1,02 – Gleichstand knapp verfehlt, aber der Wächter zählt ab `===`.
#   **Nach jeder Rücknahme erneut messen, nicht nur nach dem Ausbau.**
#   **Reihenfolge im Lauf: Inhalt → Sprache → NEU MESSEN → Längen.** Dreimal in Folge war die
#   vorab notierte Faktor-Tabelle danach überholt – in M02 und M03 hatte sich je ein Treffer durch
#   die inhaltliche Korrektur sogar von selbst erledigt.
#   ⚠️ **50 der 133 M07-`verweis`-Felder sind falsch** (Modul 07 hat nur 7.1–7.7, zwei zeigen auf
#   ein nicht existierendes 7.8; „Einweisung & Schulung" hat gar keinen Fundort). Details in A3.
#   **Für M01/M02/M03 wurde das nie geprüft – die Klasse ist wahrscheinlich poolweit. Entscheid E3.**
#   ⚠️ **`pool_faelle.json` enthält einen Fall mit `modul: M07`** – der zählt nicht in die 133
#   (er landet in `faelle.js`) und darf beim Korrekturlauf nicht vergessen werden.
#

# ============================================================
# Abschnitt 4 – erledigte Punkte (Stand 24.08.2026)
# Ausgelagert aus START_PROMPT.md, weil die Datei bei 596 von 600 Zeilen stand.
# ⚠️ ALLES HIER IST ERLEDIGT. Nichts davon erneut vortragen.
# ============================================================
#   2. ✅ **ERLEDIGT: M07-Commits gepusht, CI grün** (Stand 30.07., siehe Abschnitt 2). Die
#      Entscheide aus `ETAPPE3_M07_BEFUNDE.md` E sind getroffen. **Nicht erneut vortragen.**
#   3. ✅ **ERLEDIGT: Ratsche gesenkt**, `test_didaktik.js:119-120` = Schwelle 8,0 · Ziel 5,0.
#      **Wer einen Entscheid umsetzt, streicht ihn HIER** – dieser stand zwei Tage zu Unrecht offen.
#   4. ✅ **ERLEDIGT 30.07.: ALLE 40 `verweis`-Felder nachgetragen** (Nutzer-Freigabe: alle 40).
#      **`verweis` und `erklaerungLang` sind poolweit VOLLSTÄNDIG** – je 0 offen.
#      ⚠️ **DABEI DREI FALSCHE BESTANDSVERWEISE GEFUNDEN** (Kontrollstrukturen 4.3→4.6,
#      Konsolenbefehle 4.2→4.5, Nachkalkulation 7.4→7.7). **Nicht korrigiert – das ist E3.**
#   9. ✅ **ERLEDIGT 24.08.: M07 GEMESSEN – 31 von 146 = 21,2 %, alle korrigiert**
#      (`E3_M07_VERWEISE.md`). ⚠️⚠️ **ZWEI VON DREI TEILEN DIESES PUNKTES WAREN FALSCH:** ein
#      „nicht existierendes 7.8" gibt es nicht, und **7.6 heißt wörtlich „Leistungsübergabe und
#      Einweisungen"** – der Satz „hält keinen Fundort vor" hat 15 Fragen auf 7.7 gelegt.
#      ►► **EIN ABSCHNITT MIT DÜNNEM INHALT IST TROTZDEM DER RICHTIGE ABSCHNITT.**
#   6. ✅ **ERLEDIGT 30.07.: alle 29 `erklaerungLang` nachgetragen**, Format bei allen geprüft.
#   7. ✅ **ERLEDIGT 28.07.: die fragilen Optionsverweise sind poolweit weg** (0 nachgemessen).
#      ⚠️ **M02-771 STAND HIER ZU UNRECHT ALS ERLEDIGT.** M01-201 und M03-771 waren sauber auf
#      Inhalt umgestellt – **M02-771 trug die Verweise weiter, nur in der Schreibweise „(0) … (1)",
#      die der Scanner nicht findet.** ► **EINE KORREKTUR, DIE NUR DEN SCANNER ZUFRIEDENSTELLT,
#      IST KEINE KORREKTUR.** Nach einem Griff nicht mit der Prüfung gegenmessen, an der die
#      Korrektur sich orientiert hat.
#   8. ✅ **ERLEDIGT 30.07.: M06-542 auf dezimal** (vier Stellen, `test_rechner` grün, poolweit 0).

# ============================================================
# Abschnitt 3 (b2) – Lückenliste der Lernunterlage, Fassung bis 24.08.2026
# Ausgelagert, weil die Aufzählung in START_PROMPT auf 23 Zeilen gewachsen war.
# Der Kurzstand steht dort weiter; hier die Fassung mit allen Fundumständen.
# ============================================================
#   **(b2) ⚠️ DIE LERNUNTERLAGE HAT LÜCKEN.** Zu sechs Fragen gibt es in den `0X_*.md` keine Stelle:
#       Störungsmanagement (M01), Verkabelung/Serverraum (M03), Art. 33/34 DSGVO (M06),
#       Systemeinführung (M07, 15). Verweise zeigen auf den nächstliegenden Abschnitt (Entscheid
#       Option 1). **Überbrückt, nicht behoben.**
#       ► **NACHGEMESSEN 04.08. an den 91 heute geänderten Fragen – DREI WEITERE LÜCKEN belegt:**
#         **Eisenhower-Matrix kommt in Modul 01 überhaupt nicht vor** (0 Treffer; der Bestand
#         umgeht das mit „Abschnitt Projektmanagement" ohne Nummer), **Aufgabenanalyse/-synthese
#         und Ablauforganisation fehlen in Modul 07 ganz** (0 Treffer), **Stabsstelle und
#         Stabliniensystem fehlen in 7.4** (0 Treffer, obwohl M07-109 seit jeher dorthin zeigt).
#         Alle nach Option 1 auf den nächstliegenden Abschnitt gelegt. ⚠️ Dazu: **Support-Level
#       fehlen in Modul 04 ganz** – M04-026 trägt deshalb den ersten modulübergreifenden Verweis
#       des Pools. **Vorher klären, ob die IHK-Gliederung das vorsieht.**
#       ►► **NACHGEMESSEN 24.08. IN MODUL 04 – ACHT WEITERE LÜCKEN, ALLE MIT 0 TREFFERN:**
#         **Subnetting/Subnetz/CIDR** (~10 Fragen!) · **Such- und Sortieralgorithmen** (4) ·
#         **Rekursion** · **Struktogramm/Programmablaufplan** · **Modulo/DIV-MOD** (3) ·
#         **Euklid/Fibonacci** (2) · **Eingabevalidierung** · **„Hauptaufgaben eines
#         Betriebssystems"**. Alle nach Option 1 überbrückt (Nutzer-Entscheid 24.08.).
#         ⚠️ **Zehn Fragen prüfen Subnetting, das im Modul NICHT VORKOMMT** – das ist die größte
#         Einzellücke des Pools und ein Kandidat für „Kursdatei ergänzen" statt überbrücken.
#       ►► **MODUL 07, GEMESSEN 24.08. – FÜNF WEITERE:** **Organigramm** · **ITIL** ·
#         **Mängelrüge/§ 377 HGB** · **Verjährung** · **Garantie** (M07-105 fragt „Gewährleistung
#         vs. Garantie"; Gewährleistung 9 Treffer, **Garantie null**). Dazu: **7.6 trägt den Titel
#         „Einweisungen", aber nur vier beiläufige Erwähnungen** – Titel deckt es, Inhalt nicht.
#         **Stand: 24 belegte Lücken, 8 in M04, 5 in M07.**

# ============================================================
# Nutzer-Entscheide 27./28.07.2026 – Volltext
# Ausgelagert aus START_PROMPT.md am 24.08.2026 (Datei stand bei 601 von 600 Zeilen).
# ⚠️ ALLE ERLEDIGT bzw. dauerhaft gültig. Nicht erneut vortragen.
# ============================================================
# **NUTZER-ENTSCHEIDE VOM 27.07.2026 – NICHT ERNEUT VORTRAGEN:**
#   * Machbarkeits-Systematik bleibt uneinheitlich (wörtlich: „aufteilung so lassen").
#   * „IHK-Standard" → **DIN 69901** (in M01-001, M01-401, M01-461 umgesetzt).
#   * Eisenhower-Matrizen (M01-552, M01-952) bleiben im Feinthema „Risiko & Stakeholder".
#   * Umlaute werden auch in **Firmen-Eigennamen** korrigiert.
#   * Etappe 3 läuft vor Etappe 2, doppelte Arbeit bewusst in Kauf genommen.
#   * **M01-117 bleibt als Längen-Treffer stehen** (Rechenterme, 2 Zeichen Abstand).
#   * M02: alle elf schweren Befunde · Dubletten inhaltlich neu bauen statt nur Längen angleichen ·
#     Themen umhängen · SAU-Kürzel und Störungsarten-Taxonomie entschärfen · `verweis` nachtragen ·
#     alle 22 Längen-Tells **einschließlich** des Blocks „Englische Fachtexte".
#
# **NUTZER-ENTSCHEIDE VOM 28.07.2026 – NICHT ERNEUT VORTRAGEN:**
#   * CI direkt auf **`@v6`** statt auf das notierte `@v5` (v5 war beim Ausführen schon abgelöst).
#   * Verweis-Griff über **alle acht** Fragen, also auch die vier neu gefundenen 0-basierten.
#   * M07-116 über die **zu kurzen** Distraktoren lösen, nicht über den zu langen.
#   * Positionsverweise als **Inhaltszitat** ersetzen, nicht als wörtliches Optionszitat.
#   * Der poolweite Längengriff wird **durchgezogen** (42 Fragen in einem Zug).
#   * **Die sieben Rest-Längenfälle bleiben stehen** (M02-301, M06-307, M04-317, M06-002,
#     M06-306, M03-715, M06-011) – Länge steckt in der Sache. **Griff abgeschlossen.**
#
# **NUTZER-ENTSCHEIDE VOM 27.07.2026 (Fortsetzung):**
#   * M03: alle 19 schweren Befunde · M03-533 auf **dezimal** (nicht auf GiB) · alle B-Befunde ·
#     C1–C17 · `verweis` in 20 Fragen · **M03-001, M03-002 und M03-020 bleiben als Tell stehen**,
#     M03-715 wurde angeglichen · die 29 fehlenden `erklaerungLang` als eigener Griff.
#

# ============================================================
# Abschnitt 2 – M09-Auflösung (04.08.2026), Volltext
# Ausgelagert aus START_PROMPT.md am 24.08.2026. Der Kurzstand steht dort weiter.
# ============================================================
# ► **DIE M09-AUFLÖSUNG IST KOMPLETT DURCH (04.08.2026) – DER BEREICH IST LEER.** Der
#   Klausurtermin 31.07. ist abgelaufen; **Nutzer-Entscheid: die Kategorie bleibt für die nächste
#   Klausur, der Inhalt wurde einzeln geprüft** – passendes zog um, Gedecktes wurde gelöscht.
#   **Maßgeblich war der IHK-Prüfungskatalog** (`00_Themenuebersicht.md`, 2. Aufl. 2024): „Wirt-
#   schafts- und Sozialkunde ist eigener Prüfungsbereich der AP2 – wirtschaftliche Themen tauchen
#   in AP1 nur innerhalb der Fragenkomplexe 02, 03 und 07 auf."
#   * **Etappe A:** 30 gelöscht · 48 nach M08/**B3** in sechs neuen Themen (Rechtsformen 12 ·
#     Kaufmannseigenschaft 8 · Firma & Handelsregister 9 · Führung & Managementtechniken 7 ·
#     Aufgabenanalyse & -synthese 5 · Vertragsanbahnung: Anfrage & Angebot 7).
#   * **Etappe B:** 43 nach AP1 – **M01 +15** (Netzplan 7 · Gantt 6 · SMART 1 · Eisenhower 1) ·
#     **M07 +17** (Vollmachten 8 · Leitungssysteme 5 · Aufbau-/Ablauforganisation 4) ·
#     **M03 +7** (Wertschöpfung) · **M02 +4** (Bedarfserhebung, Anfragebeantwortung).
#   * **Pool 1089 → 1062 · M09 121 → 0 · M08 55 → 103 · AP1-Nenner 888 → 934.**
#   * **Vorher gebaut, weil der Gebiets-Wächter sonst gerissen wäre: M07-043/044/045.** Gemessen
#     wurde erst, welche A4-Katalogpunkte FEHLTEN (Mängelarten aus der Abnahmesituation 0,
#     Roadmap 0, Blended Learning 1). **A4 44/888 = 4,95 % → 47/934 = 5,03 %.**
#   ⚠️ **EINE FRAGE KANN THEMATISCH REDUNDANT UND TROTZDEM BESTAND SEIN.** Fünf gelöschte
#     Gantt-Fragen trugen zwei der drei Meilenstein-Rauten (`rotate(45)`) des ganzen Pools;
#     `test_gantt` wurde rot. **M09-051, -053, -054 zurückgenommen** (heute M01-510/511/512).
#     **Vor jeder Löschung nicht nur fragen „steht das woanders", sondern „was hängt daran".**
#   ⚠️ **TESTS, DIE IHRE TESTDATEN AUS DEM CONTENT-STAND ZIEHEN, FALLEN BEIM INHALTSSCHNITT** –
#     und sehen dabei aus wie Produktfehler. Vier Suiten waren betroffen. Die Injektion liegt
#     jetzt in **`tests/_m09fixture.js`** (30 Fragen, sechs Typen, Themen aus `L.M09_THEMEN`).
#     **Wer M09 anfasst, ändert die Fixture – nicht die Suiten einzeln.**
#   ⚠️ **DER KLAUSURTERMIN STAND DREIMAL IM CODE** und steht jetzt EINMAL: **`KLAUSUR_TERMIN` in
#     `app_state.js`**, `null` = kein Termin bekannt → keine Countdown-Zeile. **Für die nächste
#     Klausur genügt dort ein Datum** (`new Date(2027, 0, 15)`). Die dritte Fundstelle im
#     Erklärungstext hat erst der neue, mechanikprüfende Test gefunden.
#   ⚠️ **DER M09-SPICKZETTEL IST WEG – SEIN INHALT STEHT IN `99_Spickzettel.md`** (Nutzer-Entscheid:
#     eine Quelle statt zwei). `spickzettel_m09.js`, `tools/build_spick_m09.py`, der Tab und die
#     Texte sind entfernt. **`spickzettel.js` wird seit dem 04.08. von `tools/build_spick.py`
#     erzeugt** – vorher behauptete nur ein Kommentar, er stamme aus der Markdown-Datei.
#   ⚠️ **`WISO_SPICK_M08.md` IST WEITER NICHT VERDRAHTET** – die fünf B3-Abschnitte gehören NICHT
#     ins AP1-Blatt (das grenzt WiSo ausdrücklich ab). **Offener Entscheid, s. Abschnitt 4.**
#

# ============================================================
# Abschnitt 3 (b2) – Lückenliste, Fassung vor dem Schließen (25.08.2026)
# Alle hier genannten Lücken sind seit dem 25.08. geschlossen. Nur zur Nachvollziehbarkeit.
# ============================================================
#   **(b2) ⚠️ DIE LERNUNTERLAGE HAT 33 BELEGTE LÜCKEN – Stoff, den Fragen prüfen und die
#       `0X_*.md` nicht enthalten** (je 0 Treffer, gemessen 04.08. und 24.08.). Alle nach
#       **Entscheid Option 1 auf den nächstliegenden Abschnitt gelegt: überbrückt, nicht behoben.**
#       * **M04 (8):** Subnetting/CIDR · Such-/Sortieralgorithmen · Rekursion ·
#         Struktogramm/PAP · Modulo · Euklid/Fibonacci · Eingabevalidierung · BS-Hauptaufgaben
#       * **M03 (6):** **Netzwerktopologie** · strukturierte Verkabelung · 19-Zoll-Rack ·
#         Serverraum · Binärpräfixe Kibi/Mebi/Gibi · Bildschirmarbeitsplatz (ArbStättV)
#       * **M07 (5):** Organigramm · ITIL · Mängelrüge/§ 377 HGB · Verjährung · **Garantie**
#       * **nachgetragen 24.08. aus der Gegenprobe (3):** **Primär-/Fremdschlüssel und
#         Normalisierung (M04**, 3 Fragen: M04-205/-307/-308) · **„Social Engineering" fehlt in
#         Modul 06 ganz** (Thema mit 7 Fragen; nur „Phishing-Simulation" in einer Aufzählung) ·
#         **„TCO" fehlt in 3.4** – ⚠️ das ist eine **BEGRIFFSlücke, keine Stofflücke:** der
#         Gesamtkostenvergleich Kauf/Leasing steht dort, er heißt nur nicht so.
#         **Die beiden unterscheiden – eine Begriffslücke schließt ein Satz, eine Stofflücke nicht.**
#       * **älter (11):** Störungsmanagement (M01) · Eisenhower (M01) · Art. 33/34 DSGVO (M06) ·
#         Aufgabenanalyse/-synthese und Ablauforganisation (M07) · Stabsstelle/Stablinie (7.4) ·
#         Support-Level (M04 – daher M04-026, der einzige modulübergreifende Verweis) u. a.
#       ⚠️⚠️ **DIE ZWEI GRÖSSTEN: Subnetting (rund 10 Fragen) und Netzwerktopologie (6 Fragen,
#       drei davon Bildfragen, die die Stern-Topologie voraussetzen).** Beide sind Kandidaten für
#       „Kursdatei ergänzen" statt überbrücken – **Entscheid offen.**
#       ► Einzelnachweise in den vier `E3_M0X_VERWEISE.md`; Chronik im Archiv.


## Aus START_PROMPT ausgelagert am 26.08.2026 (Platz fuer die Uebergabe)

### Erledigte Naechste-Griffe (a)/(b)/(b2)/(c)/(d)
```
# ► **DER NÄCHSTE GRIFF – IN DIESER REIHENFOLGE, ERST NACH RÜCKFRAGE BEIM NUTZER:** ◄
#   **(a)/(b) ✅ ERLEDIGT bzw. ÜBERHOLT** – M09-Tabu aufgehoben (30.07.), `verweis`-Fehlerklasse 1
#       poolweit sauber (`VERWEISE_BEFUNDE.md`). ⛔ **Die alten Zahlen dort („38 %", „mehrere
#       hundert", „134 ohne Abschnitt") sind durch Punkt 4 unten ERSETZT – nicht mehr benutzen.**
#   **(b2) ✅ ERLEDIGT 25.08.: DIE LERNUNTERLAGE HAT KEINE BELEGTE LÜCKE MEHR** – 34 von 34 belegt,
#       0 offen; vier große Themen als eigene Abschnitte, 24 als Ergänzungen. Liste und
#       Fundumstände: `START_PROMPT_ARCHIV.md`, BUILD_LOG 25.08. (2)/(3)/(4).
#       ⚠️ **„Störungsmanagement" war nie eine Lücke** (steht mit Bindestrich in Modul 01).
#       **Eine 0-Treffer-Meldung ist ein Verdacht, kein Beweis.**
#   **(c)/(d) ✅ ERLEDIGT 28.07.: Optionsverweise (0 übrig) und Längengriff (42 von 49).**
#       ⚠️ **M04-317 bleibt ein Fehlalarm** („(Option 42)" = DHCP-Option, am 26.08. erneut bestätigt).
#       **Beides nicht erneut vortragen.**
```

### Punkt 5 – Ursache der doppelten Frage (belegt 25.08., ausgeliefert in v1.15.0)
```
#   **5. URSACHE der doppelten Frage – ✅ BELEGT 25.08.** (BUILD_LOG 25.08. (7)). Die Sperre
#      `unterrichtLetzteId` ist am 24.08. repariert (erst eine ANDERE fällige Karte) – erledigt.
#      ⚠️ **„Nur mit Instrumentierung im Browser zu klären" WAR FALSCH.** Beide Verdachtsfälle sind
#      in jsdom nachstellbar: `node tools/probe_doppelziehung.js <arbeitskopie>` (misst nur, ändert nichts).
#      **a) Neu-Rendern zieht NICHT nach:** `unterrichtRender()` allein = 0 Ziehungen, 300 Ziehungen
#         = 0 benachbarte Dubletten. Der Umbau vom 30.07. hält. **Verdacht 1 ist widerlegt.**
#      **b) Wischleiste UND Weiter-Knopf feuern wirklich beide** – aber nur in EINER Reihenfolge.
#         Die Leiste hängt `ontouchend` als Eigenschaft ans Element; `host.innerHTML = ""` nimmt das
#         Element aus dem DOM, **nicht den Handler.** Der Nachwisch läuft mit dem ALTEN `f`
#         (`_beantwortet === true`) und zieht ein zweites Mal. **Gemessen: Ziehungen=2, Verlauf 2→4,
#         eine Frage im Verlauf, die nie angezeigt wurde.** Gegenprobe erst Wisch, dann Knopf: harmlos
#         (1 Ziehung), `setAktion` hat `_aktionFn` neu gebunden. ⛔ **Das ÜBERSPRINGT, dubliert nicht.**
#      **c) Zur DUBLETTE wird es bei genau EINEM Kandidaten:** `var menge = frisch.length ? frisch :
#         basis;` fällt auf `basis` zurück (enthält die eben gezeigte Frage), die Sperre gibt auf, weil
#         `zweit` leer ist. **Gemessen mit auf 1 Frage eingedampftem Pool: 11 von 11 Übergängen
#         dieselbe Frage; mit 2 Fragen sauberer Wechsel.** ✅ **Nachwisch gesperrt 25.08.**
#      ⚠️ Ungeprüft bleibt allein ein echtes Touch-Gerät. **M09 ist im Pool leer (0 Fragen)** – die
#      Seite ist ohne `tests/_m09fixture.js` gar nicht bespielbar.
```


## Aus START_PROMPT ausgelagert am 27.08.2026 (Platz fuer die schnelle Schleife)

### Punkt 4 – E3-Verweisrunde: Quoten je Modul, Bezugskalkulation, Heuristik-Trefferquote
```
#   **4. E3: falsche `verweis`-ZIELE – ZWEI MODULE GEMESSEN, M01 UND M04.**
#      ✅ **E3 IST ÜBER ALLE MODULE DURCH (24.08.) – 185 Verweise korrigiert.**
#      **M02 ~5 % · M06 ~9 % · M05 ~10 % · M01 11,0 % · M03 20,9 % · M07 21,2 % · M04 51,9 %.**
#      Protokolle: `E3_M0{1,3,4,7}_VERWEISE.md`, M05/M06/M02 im BUILD_LOG 24.08. (5).
#      ►► **Die Spanne 5–52 % erklärt sich aus der Zahl und Ähnlichkeit der Abschnitte, nicht
#      aus der Pool-Qualität.** M01 hat 3 Abschnitte, M04 hat 8 mit ähnlich klingenden Titeln.
#      ⚠️⚠️ **24 VERWEISE NENNEN ABSICHTLICH MEHRERE ABSCHNITTE** („Abschnitt 3.1 und 3.3"),
#      22 davon in M03. **Das ist kein Fehler.** Wer sie als Ausreißer behandelt, repariert
#      Richtiges kaputt – im M03-Lauf hing daran ein ganzes Thema mit 9 Fragen.
#      ⛔⛔ **DIE HOCHRECHNUNG AUS EINEM MODUL IST TOT.** Die „rund 90 poolweit" vom 04.08. hat
#      allein M04 mit 95 überschritten. **11 % und 52 % – daraus folgt für M02/M03/M05/M06
#      NICHTS. Kein drittes Modul mehr schätzen, messen.**
#      ⚠️⚠️ **DIE MEHRHEIT KANN DIE FALSCHE SEITE SEIN.** In M04 zeigten 21 Kontrollstruktur-
#      Fragen auf 4.3 und nur 8 auf 4.6 – **richtig waren die acht.** In M01 war die Mehrheit
#      zufällig richtig. **Anker ist die Kursdatei, nie die Verteilung im Pool.**
#      ✅ **DIE 22 BEZUGSKALKULATIONS-FRAGEN IN M02 SIND ERLEDIGT (24./25.08.):** Abschnitt 2.1
#      wurde um den Stoff ergänzt (Stufenschema, Skonto-Effektivzins, Verkaufspreiskalkulation),
#      die Fragen zeigen dorthin. **Nachgemessen 25.08.: 26 von 31 Kalkulations-Fragen auf 2.1**,
#      die fünf anderen sind Vertriebsformen/Bedarfsanalyse und liegen richtig.
#      ⚠️ **DIE HEURISTIK IST EIN KANDIDATENFILTER, KEIN URTEIL** – Trefferquote 67 %; nach der
#      sauberen Korrektur meldet sie in M01 weiter 11 und in M04 weiter 32 Fälle, alle erklärt.
#      **Ein Wächter auf dieser Grundlage bräuchte erst eine Ausnahmeliste.**
#      ► **MESSEN MIT `node tools/pool_query.js verweise [modul]`, SETZEN MIT
#      `python3 tools/verweis_setzen.py --batch <datei> [--trocken]`** (beide neu am 24.08.,
#      Rezept eingebaut). **Nicht wieder als Einzeiler nachbauen.**
#      ⚠️ **Fehlerklasse 1 ist poolweit sauber** (kein Verweis zeigt ins Leere) – seit 25.08. hält
#      das ein Wächter in `check.sh` fest. ✅ **E2 IST ERLEDIGT: 0.** `pool_query.js verweise` meldet
#      1062 Fragen · 917 mit einem Abschnitt · 42 mit mehreren · 103 ohne = **genau die 103 aus M08,**
#      das per Entscheid vom 24.08. dauerhaft ausgenommen ist. **Nicht wieder zusammenzählen.**
```

### Punkt 2 – Tippfehler-Toleranz: der urspruengliche Befund und die Messung dazu
```
#      ---- Der ursprüngliche Befund, zur Einordnung: ---- „ufgabenanalyse" wird als falsch
#      gewertet; `L.normAntwort` normalisiert nur (Klein, Umlaute, Trim, Komma) und vergleicht dann
#      EXAKT. Messung: Bei `lueckentext` ist eine Toleranz von einem Zeichen **risikofrei** –
#      15 Lücken, **0 verwechselbare Paare** bei jeder Mindestlänge. ⚠️ Bei `dropdown` wäre sie
#      gefährlich (**85 Fälle** wie „SEZ"/„SAZ", „12"/„14") – dort wird aber ausgewählt, nicht
#      getippt. Bei `konsole` ausdrücklich NICHT: ein Befehl läuft oder läuft nicht.
#      **Empfehlung war: Distanz 1 ab 6 Zeichen, nur für `lueckentext`.**
#      ► **NUTZER-ENTSCHEID 04.08.: AUCH BEI FREITEXT-KURZANTWORTEN – umgesetzt.** Die Messung
#      ergab: `dropdown` im Freitextmodus (9 Paare ab 6 Zeichen, u. a. ISO 9001/ISO 9000) und
#      `trace` (Stufe 1/2/3) dürfen KEINE Toleranz bekommen; im Freitext stehen 49 Begriffspaare
#      in Distanz 1 in DERSELBEN Frage (ipconfig/ifconfig, 7,1/7,5) – deshalb schaltet sich die
#      Toleranz dort je Frage selbst ab. 1274 von 1512 Begriffen (84,3 %) bekommen sie.
```

## ZURÜCK-KNOPF IN M09 – Einzelheiten (ausgelagert 27.08.2026 aus START_PROMPT.md)

Gebaut am 30.07.2026. `unterrichtZiehe()` zieht und schreibt die Sperren fort,
`unterrichtRender()` zeigt nur an; die Leiste `macheVerlaufNav()` nutzen BEIDE Übungsflüsse.

⚠️ **DIE SECHS SPERREN DÜRFEN BEIM BLÄTTERN NICHT FORTGESCHRIEBEN WERDEN:**
`unterrichtZaehler`, `S.seenUnterricht`, `unterrichtZuletzt`, `unterrichtLetzteId`,
`unterrichtThemenRunde`, `unterrichtLetzterTyp`/`LetztesThema` – alle NUR in
`unterrichtZiehe()`, 38 Tests prüfen sie je einzeln (`tests/test_zurueck_m09.js`).

## E3-RUNDE, verweis-ZIELE POOLWEIT (ausgelagert 27.08.2026 aus START_PROMPT.md)

Abgeschlossen am 24.08.2026. **185 Verweise korrigiert**, alle sieben Module einzeln gegen
ihre Kursdatei gelesen.

Quoten fehlerhafter Verweise je Modul:
**M02 ~5 % · M06 ~9 % · M05 ~10 % · M01 11,0 % · M03 20,9 % · M07 21,2 % · M04 51,9 %.**

Protokolle: `E3_M01_VERWEISE.md`, `E3_M03_VERWEISE.md`, `E3_M04_VERWEISE.md`,
`E3_M07_VERWEISE.md`; M05, M06 und M02 im BUILD_LOG-Eintrag 24.08. (5).

✅ Die drei Nutzer-Entscheide vom 24.08. sind gefallen und umgesetzt (Abschnitt 4 des
damaligen START_PROMPT).

## STAND 25.08.2026, NEBEN DER DOPPELTEN FRAGE (ausgelagert 27.08.2026)

Am 25.08. ebenfalls erledigt: **E2 auf 0**, **34 von 34 belegten Stofflücken geschlossen**,
Nutzlast und Rechenzeit gemessen, **Manifest-Screenshots aus `APP_FILES` erzeugt.**
Die doppelte Frage betraf genau EINEN Kandidaten – erst dort wurde der Nachwisch zur Dublette.


## Nächster Griff, Punkte 1/2/5 (ausgelagert 31.08.2026)

Aus `START_PROMPT.md` Abschnitt 3, weil die Datei bei 600 von 600 Zeilen stand und Etappe VI
Platz brauchte. **Alle drei Punkte waren erledigt; was weiter gilt, steht in Abschnitt 2 bzw. blieb
als Einzeiler stehen.**

**1. Etappe B + A4-Ausbau (erledigt 04.08.).** Offen geblieben war: der Bereich „Vorbereitung
nächste Klausur" ist LEER und zeigt nur den Hinweistext. Er füllt sich erst, wenn ein neuer
Klausurstoff kommt – dann `KLAUSUR_TERMIN` setzen (`app_state.js`) und Fragen mit `modul: "M09"`
anlegen. ⚠️ `L.M09_THEMEN` führt weiter die acht alten Themen als Vokabelliste für Validierung,
Themenfilter und `tests/_m09fixture.js`; beim nächsten Klausurstoff ERST diese Liste setzen –
Fixture und Filter hängen daran. **(Beides steht unverändert in START_PROMPT Abschnitt 2.)**

**2. Tippfehler-Toleranz (erledigt 04.08.).** `L.gradeLueckeTolerant` (lueckentext) und die
selbstabschaltende Variante im Freitext (`toleranzFreigabe` in `app_util.js`). Eigene Suite
`test_toleranz` (36 Tests, dreimal sabotiert). Der ursprüngliche Befund samt Messung: 15 Lücken,
85 gefährliche dropdown-Paare, 49 Freitextpaare in DERSELBEN Frage, 1274 von 1512 Begriffen.
⚠️ **Die Grenze 6 und die Ziffernsperre sind GEMESSEN, nicht gesetzt** – dieser Satz ist als
Einzeiler in START_PROMPT geblieben.

**5. Die doppelte Frage (erledigt 25.08.).** Ursache war die abgehängte Wischleiste, die nach dem
Abräumen ein zweites Mal feuerte; Sperre `if (!document.contains(bar)) return;` seit 25.08.,
ausgeliefert in v1.15.0. Messung, Gegenproben und `tools/probe_doppelziehung.js`: BUILD_LOG
25.08. (7). **(Der Vorgang steht auch in START_PROMPT Abschnitt 2.)**

## Etappe VI – Pilot der Lernunterlage (31.08.2026)

Volltext der Befunde: `BEFUNDE_LERNUNTERLAGE.md`. Hier nur, was den Verlauf erklärt:
Die Vorabmessung des Plans sagte, die teuerste Pool-Klasse (erfundene Gesetzeszitate) falle in den
Kursdateien weitgehend aus – **sie hat gestimmt**: null erfundene Zitate, null falsche
Absatzangaben, die drei Rechtsstellen der Datei sind richtig. Was stattdessen kam, war eine Klasse,
die im Pool gar nicht sichtbar sein KANN: *der Pool prüft einen Begriff, den die Unterlage nicht
führt.* Sie hat drei von zehn Befunden gestellt und ist mechanisch messbar.
Ebenfalls neu und nur über Dateigrenzen sichtbar: der Spickzettel trug dieselbe falsche
Wi-Fi-Aussage wie die Kursdatei (B94) und dieselbe verkürzte TCO-Formel wie sie (B93) –
**wer eine Kursdatei korrigiert, sieht in `99_Spickzettel.md` nach.**

## Aus START_PROMPT ausgelagert am 03.09.2026 (Zeilenbudget 600/600, gruendliche Rotation)

Der Kopf stand bei 600 von 600 Zeilen; `tools/umgebung.sh` meldete ROTIEREN. Verfahren:
je Lehre bleibt der REGELSATZ im Kopf, die HERLEITUNG steht ab hier. Blockweise, mit den
Zeilennummern der Fassung vom 03.09.2026 vor der Rotation; Original unveraendert.

### Zeilen 4-8 (alt 5 Zeilen, im Kopf jetzt 3)

```
# Bis zum 27.07.2026 wuchs der Kopf durch Anhängen: 283 Zeilen mit DREI Abschnitten „HIER ANFANGEN",
# zwei längst ausgelieferten Release-Blöcken und einem Satz „Etappe 1 ist der nächste Griff" acht
# Zeilen über „Etappe 1 ist komplett". Der Stand musste aus `git log` rekonstruiert werden – aus
# genau der Datei, die ihn nennen soll. **Wer hier etwas ändert, ändert den betroffenen Abschnitt
# und lässt die Struktur stehen.** Chronik gehört nach `START_PROMPT_ARCHIV.md`.
```

### Zeilen 18-22 (alt 5 Zeilen, im Kopf jetzt 3)

```
#   **GEMESSEN 27.08. aus dem Protokoll des 26.08.:** `check.sh block` kostete **126 Aufrufe und
#   44 von 166 aktiven Minuten (27 %)** – 31 × `start`, aber nur **22 vollständige Zyklen**.
#   ►►► **Eine Einzelsuite kostet 1,7 s, ein voller Zyklus vier Aufrufe und gut eine Minute.**
#   ⛔ **`node tests/test_X.js` SCHEITERT** (flaches Verzeichnis nötig) – richtig ist **`bash
#      tools/suite.sh <name>`**. Diese Verwechslung kostete am 26.08. einen ganzen Zyklus.
```

### Zeilen 23-29 (alt 7 Zeilen, im Kopf jetzt 6)

```
#   **WAS ANGEFASST → WAS ZUERST FAHREN (jeweils unter 2 s):** Fachbegriff/Stichwort →
#     `suite.sh wirtschaft unterricht abk` · Freitext/Schlüsselbegriffe → `suite.sh freitext
#     toleranz teilpunkte` · Struktur, IDs, Themen, Typen → `suite.sh meta logik themenauswahl` ·
#     Bild/SVG → `suite.sh render_smoke a11y` · Längen → `suite.sh didaktik` · Dateiliste/Version
#     → `suite.sh pwa`. ⚠️ **Die vier Pool-Wächter aus `check.sh` sind KEINE Suiten**, haben aber
#     eigene Proben unter je einer halben Sekunde:
#     `node tools/pool_query.js zitate | zufall | verweise | firmen | begriffe | abdeckung | verrat`.
```

### Zeilen 32-37 (alt 6 Zeilen, im Kopf jetzt 4)

```
# ► **ZWEI SPARREGELN AUS DERSELBEN MESSUNG:** **(1) SECHS BIS ACHT FRAGEN JE `pool_query
#   frage`-AUFRUF** – am 26.08. waren es 3,4 (255 Fragen in 74 Aufrufen); vor jedem Aufruf steht
#   eine feste Denkpause, acht Datensätze passen in ein Ausgabefenster. **(2) BERICHTE ALS LISTE,
#   NICHT ALS AUFSATZ** (Nutzer-Entscheid 27.08.): 18 sichtbare Nachrichten, 23.700 Zeichen, die
#   zehn längsten machen **90 %** aus. Die Befunde stehen vollständig im `BEFUNDE_*.md`; **in den
#   Chat gehören Befund, Fehlerklasse und Entscheidungsbedarf – nicht die Herleitung.**
```

### Zeilen 39-46 (alt 8 Zeilen, im Kopf jetzt 4)

```
# ⚠️ **NUTZER-ANWEISUNG 28.07.2026: IMMER FRAGEN, OB EIN WERKZEUG DAS KANN — NIE ANNEHMEN,
#   ES GINGE NICHT.** Am 28.07. wurde eine ganze Prüfliste mit 15 Gesetzesstellen an den Nutzer
#   ausgelagert, mit der Begründung „in der Sandbox ist keine Recherche möglich". **`WebSearch`
#   und `WebFetch` waren die ganze Zeit verfügbar.** Der Satz „npm-Registry nicht
#   erreichbar" im Umgebungsblock gilt für npm, nicht für das Web.
#   **Vor jeder Auslagerung an den Nutzer: prüfen, ob ein Werkzeug existiert, das es selbst kann.**
#   ⚠️ **NACHGESCHÄRFT AM 28.07. AUF NUTZER-ANWEISUNG: „für aufgaben die du erledigen kannst wenn
#   ich tools freigebe auch beachten".** Das heißt konkret, in dieser Reihenfolge:
```

### Zeilen 59-65 (alt 7 Zeilen, im Kopf jetzt 4)

```
# ⚠️ **DER TEUERSTE FEHLER DES 27.07. WAR EINE GEGLAUBTE DOKU-AUSSAGE.** In allen drei
#   Steuerdateien stand „npm 403, test_axe läuft nur in der CI". Der Satz stimmte im Juni und war
#   an dem Tag falsch – npm ging wieder. Weil er geglaubt statt gemessen wurde, blieb ein
#   CI-Fehlschlag stundenlang unerklärt, der lokal in zwei Minuten reproduzierbar gewesen wäre.
#   **UMGEBUNGS-ANNAHMEN SIND VERDERBLICHE WARE.** `tools/umgebung.sh` misst sie nach.
# ⚠️ Am 27.07. stand hier außerdem „Arbeitsbaum sauber", während 17 geänderte Dateien vom Vortag
#   im Baum lagen. Der Satz stimmte, als er geschrieben wurde. **Der Arbeitsbaum ist die Wahrheit.**
```

### Zeilen 70-75 (alt 6 Zeilen, im Kopf jetzt 5)

```
# ► **E3 IST DURCH (24.08.): 185 `verweis`-Ziele korrigiert** (Archiv). Werkzeuge:
#   `pool_query.js verweise [modul]` · `tools/verweis_setzen.py --batch`.
# ► **DIE DOPPELTE FRAGE IST AUFGEKLÄRT (25.08.):** Nachwisch der **abgehängten** Wischleiste,
#   gesperrt mit `if (!document.contains(bar))`. ⚠️ **Der Satz „nur mit Instrumentierung im
#   Browser zu klären" war FALSCH und hat den Punkt ein Vierteljahr blockiert** – beides läuft in
#   jsdom: `node tools/probe_doppelziehung.js <kopie>`.
```

### Zeilen 92-95 (alt 4 Zeilen, im Kopf jetzt 3)

```
#   ⚠️ **BEIDE ZEILEN HÄLT `check.sh` NACH** (Stand-Guard): Version gegen `app_state.js`, Pool und
#   Suiten gegen den Code, **PUSH OFFEN/DURCH gegen LIVE ↔ committet** und seit 02.09. **gegen die
#   ungepushten Commits, die etwas AUSLIEFERN** (4e2b2, Kriterium `.assetsignore`) – der
#   Versionsvergleich allein sieht einen Inhalts-Commit ohne Bump nicht. Bis 27.08.: VIER Stellen.
```

### Zeilen 106-110 (alt 5 Zeilen, im Kopf jetzt 4)

```
#      ⛔ **Nicht selbst pushen, keinen CI-Status aus der Sandbox behaupten – und aus dem Fehlen
#      einer Information auch keine ableiten** (27.08.: „v1.16.0 wurde nie ausgeliefert" war frei
#      erfunden; sie lief seit dem Vortag beim Lerner). **Erst nach „ja, grün":** Standzeile auf
#      `LIVE = committet · PUSH DURCH`; `BUILD_LOG.md` **nur rotieren, wenn `check.sh` es meldet**
#      (ab 900 Zeilen) – nicht auf Verdacht; Etappen-Zeile **I** fortschreiben.
```

### Zeilen 115-119 (alt 5 Zeilen, im Kopf jetzt 4)

```
#      ✅ **B106, die M08-Stufung und N2 sind am 02.09. belegt und erledigt – nicht wieder
#      aufmachen** (Volltext: `BEFUNDE_LERNFLUSS.md`, BUILD_LOG 02.09.). M08 ist ganz AP2, die
#      Stufung 1 belegt richtig; N2 trennte `IP-Adressierung` (AP1/A3) von `Subnetting` (AP2/B2).
#      ⚠️ **A4 fiel dabei auf 4,98 %** (Schwelle 4,8): **noch 36 Nicht-A4-AP1-Fragen, dann reißt
#      `test_didaktik`.** Geltende Zahl im erzeugten Block, nicht hier.
```

### Zeilen 129-131 (alt 3 Zeilen, im Kopf jetzt 2)

```
#      ►► **Vor jeder neuen Lehrtext-Runde:** `python3 tools/e3_gegenprobe.py --streng` und
#      **Zeilen Lehrtext je Frage** rechnen. Beide trafen am 31.08.: M05 bei 3,5 Zeilen/Frage
#      hatte ein Viertel des Moduls ohne Lehrtext, M02 bei 6,0 war fehlerfrei.
```

### Zeilen 138-143 (alt 6 Zeilen, im Kopf jetzt 5)

```
#   ⚠️ **DIE LERNUNTERLAGEN SIND BESTAND** (Ziel von 961 Verweisen). Seit 27.08. lesen `begriffe`,
#      `zitate`, `firmen`, `kontext` und `suche` sie mit (Bestand `T`, Fundstellen `04#452 <…>`).
#      **Wer einen Pool-Fehler behebt, sieht im Lehrtext nach** – dort standen Pay-per-Use und GPL
#      falsch, im Pool längst korrigiert.
#   ⚠️ **`inhaltstraeger.json` IST PFLICHT:** jede Zelle `gelesen` oder `nein: <Grund>`, 4e7 zählt
#      nach. Anlass: fünfmal an einem Tag meldete eine Prüfung grün über Ungeprüftes.
```

### Zeilen 150-153 (alt 4 Zeilen, im Kopf jetzt 3)

```
#   ⚠️ **VOR JEDER MELDUNG ÜBER DEN POOL DIE AUSWERTENDE FUNKTION LESEN.** Zwei Fehlalarme wurden
#      so verhindert (`L.normBefehl` kleinschreibt · alle 17 `szenario2` haben nur `feedback1`).
#   ⚠️ **DIE VORABMESSUNG EINER RUNDE IST SELBST EIN MESSWERT** (sie nannte M04 mit 187, `themen`
#      zählt 191). **Standzeilen neu ableiten, nie aus der Vorgängerzeile fortschreiben.**
```

### Zeilen 154-160 (alt 7 Zeilen, im Kopf jetzt 5)

```
# ✅ **ZURÜCK-KNOPF IN M09 IST GEBAUT (30.07.), 38 Tests grün.** Die sechs Sperren dürfen beim
#   Blättern NICHT fortgeschrieben werden – alle nur in `unterrichtZiehe()`. Einzelheiten:
#   `START_PROMPT_ARCHIV.md`.
#   ⚠️ **EINE GEGENPROBE BRAUCHT SELBST EINE ZUSICHERUNG, DASS SIE STATTGEFUNDEN HAT** – dafür gibt
#   es `tools/sabotage.sh` (zählt das Muster VOR dem Lauf, stellt über `trap` wieder her).
#   ⚠️ **Wenn /tmp einem anderen Benutzer gehört**, laufen `check.sh` und `suite.sh` über
#   `CHECK_NM_SPIEGEL`/`CHECK_WORK`/`SUITE_WORK` – die Befehlszeile steht in `TASKLIST.md`.
```

### Zeilen 162-167 (alt 6 Zeilen, im Kopf jetzt 3)

```
# ► **ETAPPE 3 IST DURCH: M01, M02, M03, M07, M08** ◄ `ETAPPE3_M0X_BEFUNDE.md`: 599 Fragen
#   gelesen, **82 schwere Befunde**. **Nicht nachprüfen.**
#   ⚠️ **DIE FEHLERKLASSEN – wer ein Modul prüft, sucht sie gezielt:**
#   Erklärung widerspricht der richtigen Antwort · Rechnung um Faktor 10 falsch · falscher Wert in
#   `schluesselbegriffe` · Musterlösung zu einer anderen Firma · **erfundene Gesetzeszitate** ·
#   falscher Paragraf · Fachbegriff verdreht (RPO als RTO) · Absatzangaben falsch.
```

### Zeilen 169-171 (alt 3 Zeilen, im Kopf jetzt 2)

```
# ✅ **DER TELL-ZÄHLER FIEL VON 124 AUF 6** (27.08., `pool_query.js laengen`): **6 von 302 =
#   1,99 %** – echte Korrektur, keine Verdünnung. Rest: Bestandsentscheide.
# ✅ **DER POOLWEITE LÄNGENGRIFF IST ABGESCHLOSSEN** (28.07.) – **nicht erneut aufmachen.**
```

### Zeilen 183-185 (alt 3 Zeilen, im Kopf jetzt 2)

```
# ⚠️ **REIHENFOLGE JE MODUL: erst Inhalt, dann NEU MESSEN, dann Längen** – viermal war die vorab
#   notierte Faktor-Tabelle danach überholt. **Gleichstand zählt als Treffer.**
#   ►► Herleitung: Archiv, „LÄNGENGRIFF UND RATSCHE"; die Lehren stehen in Abschnitt 6.
```

### Zeilen 186-188 (alt 3 Zeilen, im Kopf jetzt 2)

```
# ⛔ **HIER STEHT AB JETZT KEIN PUSH-STAND UND KEINE COMMIT-ZAHL MEHR.**
#   Jeder solche Satz war ein paar Stunden später falsch, und jede Berichtigung kostete einen
#   eigenen Commit, der selbst wieder ungepusht war.
```

### Zeilen 198-200 (alt 3 Zeilen, im Kopf jetzt 2)

```
#   ⚠️ `ci2.sh` zeigt IMMER auch ältere FEHLGESCHLAGENE Läufe – **maßgeblich ist die URTEIL-Zeile
#   am Ende.** ⛔ Hier stand bis zum 27.08. ein Push-Stand vom 30.07. – acht Zeilen unter der
#   Regel, die genau das verbietet, **vier Wochen lang falsch.**
```

### Zeilen 205-207 (alt 3 Zeilen, im Kopf jetzt 2)

```
# ⚠️ **KEINEN COMMIT-HASH IN DIESE DATEI SCHREIBEN.** Am 28.07. trug dreimal hintereinander ein
#   Doku-Commit den Hash des vorigen nach und veraltete damit selbst. Der Hash steht in
#   `tools/umgebung.sh` und in `git log` – dort ist er immer richtig, hier nie lange.
```

### Zeilen 208-212 (alt 5 Zeilen, im Kopf jetzt 4)

```
# ⛔⛔ **GIT AUF DEM MOUNT KANN SEINE EIGENEN DATEIEN NICHT LÖSCHEN – DAS IST DAUERZUSTAND, KEIN
#   ZWISCHENFALL.** JEDER schreibende Git-Aufruf hinterlässt `.git/index.lock`, oft `.git/HEAD.lock`
#   und pro Objekt ein `.git/objects/**/tmp_obj_*`; `unlink` scheitert mit „Operation not permitted",
#   der Aufruf selbst läuft aber durch. **Ein liegengebliebenes `HEAD.lock` blockiert den nächsten
#   Ref-Update** – also den nächsten Commit.
```

### Zeilen 213-216 (alt 4 Zeilen, im Kopf jetzt 3)

```
#   ⚠️ **SO GEHT ES SEIT DEM 27.08.: `bash tools/gitc.sh <git-argumente>`** – der Wrapper räumt
#   `index.lock`/`HEAD.lock` VOR und NACH jedem Aufruf weg (`rm` scheitert, `mv` geht) und reicht
#   den Rückgabewert durch. **Nicht mehr von Hand, nicht nachbauen.** `git fsck --no-dangling`
#   war nach sieben Commits sauber.
```

### Zeilen 217-221 (alt 5 Zeilen, im Kopf jetzt 4)

```
#   ⚠️ **`_to_delete/` steht seit dem 24.08. in `.gitignore`** und ist die Ablage für alles, was
#   hier nicht gelöscht werden kann. Beim `git add -A` nichts weiter zu beachten.
#   ⛔ **Das früher hier genannte Werkzeug `allow_cowork_file_delete` GIBT ES IN DIESER UMGEBUNG
#   NICHT MEHR.** Nicht danach suchen. **Nutzer-Anweisung 27.07.: das selbst erledigen, nicht
#   melden und liegen lassen.** `tools/umgebung.sh` meldet den Lock in Zeile 1 des Git-Blocks.
```

### Zeilen 231-238 (alt 8 Zeilen, im Kopf jetzt 4)

```
#   | Etappe | Inhalt | Stand |
#   |---|---|---|
#   | 0,1,2,3,4,5,6,E3 | Wächter · M09-Auflösung · Batch M01–M08 · A4 · Stufen · `verweis`-Ziele | ✅ **alle durch** (v1.9.0–v1.13.0, 24.08.). Protokolle `ETAPPE3_M0X_BEFUNDE.md`, `E3_M0X_VERWEISE.md` |
#   | 7 | Startlast auf dem Gerät messen (kein Umbau) | 🔶 **Nutzlast und Rechenzeit gemessen (25.08.), offen bleibt nur der Gerätewert – wird NICHT nachgefragt** |
#   | **I** | **M04/M05/M06 inhaltlich nachholen** | ✅ **DURCH (27.08.): 369 von 369 Fragen gelesen, 51 Befunde.** `BEFUNDE_M04-M06.md` |
#   | **II–V** | **Q2: Begriffe · M05 · neun Fälle · 96 Grafiken** | ✅ **DURCH (28.08.): B60–B89, vier SVG-Wächter.** `BEFUNDE_BEGRIFFE.md`, `BEFUNDE_FAELLE.md` |
#   | **VI** | **Q2: Lernunterlage – ALLE SIEBEN KURSDATEIEN** | ✅ **DURCH (31.08.): 4907 Zeilen gelesen, B90–B125, 35 von 36 korrigiert.** `BEFUNDE_LERNUNTERLAGE.md` mit Bilanz |
#   | **VII** | **Q2: Lerner-Fluss** | ✅ **DURCH (31.08.): gemessen, nichts geändert.** Vier von fünf Fragen mit „funktioniert" beantwortet; L1 (M08 halb so oft gezogen) aufgeklärt: `THEMA_RELEVANZ` führt alle zwölf WiSo-Themen auf 1. Protokoll `BEFUNDE_LERNFLUSS.md`, Werkzeug `tools/probe_lernfluss.js` |
```

### Zeilen 240-244 (alt 5 Zeilen, im Kopf jetzt 4)

```
# ► **ERLEDIGT UND NICHT ERNEUT VORZUTRAGEN** (Volltext: `START_PROMPT_ARCHIV.md`): M09-Tabu
#   aufgehoben · `verweis`-Fehlerklasse 1 poolweit sauber · Optionsverweise 0 · Längengriff 42 von
#   49. ⚠️ **M04-317 bleibt ein Fehlalarm** (DHCP-Option). ⛔ **HIER STAND „LERNUNTERLAGE OHNE
#   BELEGTE LÜCKE (34/34)"** – das galt den VERWEISZIELEN, nicht dem Inhalt (31.08.: `IaaS`,
#   `PaaS`, Wi-Fi 7 fehlten in allen neun Kursdateien). **Eine Messung gilt für das Gemessene.**
```

### Zeilen 251-257 (alt 7 Zeilen, im Kopf jetzt 5)

```
#   ⚠️⚠️ **42 VERWEISE NENNEN ABSICHTLICH MEHRERE ABSCHNITTE** („Abschnitt 3.1 und 3.3"), die
#      meisten in M03. **Kein Fehler** – wer sie als Ausreißer behandelt, repariert Richtiges
#      kaputt. ⚠️⚠️ **DIE MEHRHEIT KANN DIE FALSCHE SEITE SEIN:** In M04 zeigten 21 Fragen auf
#      4.3 und nur 8 auf 4.6 – **richtig waren die acht. Anker ist die Kursdatei, nie die
#      Verteilung.** ⛔⛔ **KEINE HOCHRECHNUNG AUS EINEM MODUL** – 11 % in M01, 52 % in M04.
#      ► Messen `node tools/pool_query.js verweise [modul]` · Setzen `python3
#        tools/verweis_setzen.py --batch <datei> [--trocken]`. **Nicht als Einzeiler nachbauen.**
```

### Zeilen 258-263 (alt 6 Zeilen, im Kopf jetzt 4)

```
#   ✅ **Startlast ohne Gerät gemessen (25.08.):** 877 kB gzip, davon 600 kB `fragen.js` – **die
#      Poolgröße kostet Übertragung, keine Rechenzeit.** ⛔ **Der Gerätewert bleibt offen und
#      wird NICHT nachgefragt** (Entscheid 27.07.).
#       ✅ **GEBIETSVERTEILUNG: NICHT MEHR HIER.** Sie wird seit 02.09. erzeugt und bewacht –
#       `python3 tools/gebiete_stand.py`, Block in `SORTIERUNG_PRUEFUNGSORDNUNG.md`, Guard 4e2b3.
#       ⚠️ **A4 liegt knapp über der Schwelle 4,8** (`test_didaktik.js`) – Zahl im Block lesen.
```

### Zeilen 265-267 (alt 3 Zeilen, im Kopf jetzt 2)

```
# ---- ARCHIV: Etappe 3, wie sie gelaufen ist → **`START_PROMPT_ARCHIV.md`** (ausgelagert 04.08.,
#      diese Datei stand bei 599 von 600 Zeilen). Die Lehren daraus stehen unverändert in
#      Abschnitt 6; die E3-Zahlen dort sind durch `E3_M01_VERWEISE.md` überholt. ----
```

### Zeilen 274-279 (alt 6 Zeilen, im Kopf jetzt 4)

```
#   ⚠️ **KORREKTURSKRIPTE: NIE über `json.load`/`json.dump`** – das formatiert die Pool-Datei um
#      (27.07.: 37.000 Diff-Zeilen für 18 Wortkorrekturen). **Rezept:** Block von `"id": "M0X-NNN"`
#      bis zur nächsten ID abgrenzen (Pflicht!), alten Wert suchen, auf **genau eine** Fundstelle
#      prüfen, ersetzen, `json.loads` als Syntaxprobe VOR dem Schreiben. Vorher `cp -r pool /tmp/…`.
#      ⚠️ Am 30.07. hat genau diese Syntaxprobe einen Kommafehler gefangen, bevor eine Datei
#      angefasst wurde – **sie ist keine Formalität.**
```

### Zeilen 280-284 (alt 5 Zeilen, im Kopf jetzt 4)

```
#   ⚠️ **ZEICHEN-NORMALISIERUNG PER REGEX IST ERST FERTIG, WENN DER DIFF SIE BESTÄTIGT.** Die Regel
#      „Ziffer x Ziffer → ד traf `5.000 x 0,88`, aber nicht `Listenpreis x (1 − Rabatt)`. Ergebnis
#      waren Strings mit × und x nebeneinander – schlimmer als der Ausgangszustand.
#      ⛔ **In `rechenassistent`-Fragen ist das Minus INNERHALB von `{…}` FORMELSYNTAX**
#      (`{1-rabatt/100|2}`, `{liste-s2|2}`) und darf nie ersetzt werden. `test_rechner` fängt das.
```

### Zeilen 286-290 (alt 5 Zeilen, im Kopf jetzt 2)

```
# ✅ **DAS M09-TABU IST ERLEDIGT (04.08.2026).** Die Klausur ist gelaufen, die Auflösung hat mit
#    Etappe A begonnen (Abschnitt 2). **Die Kategorie bleibt für die nächste Klausur bestehen** –
#    Nutzer-Entscheid. ✅ **Nachgemessen 25.08.: das harte Datum ist WEG** – `KLAUSUR_TERMIN` in
#    `app_state.js` steht auf `null`, also keine Countdown-Zeile. Für die nächste Klausur genügt
#    dort ein Datum. ⚠️ **NICHT eigenmächtig setzen** – der Termin ist nicht bekannt.
```

### Zeilen 300-304 (alt 5 Zeilen, im Kopf jetzt 3)

```
#   ► **ALLE ENTSCHEIDE VOM 04./24./25.08. SIND GEFALLEN UND UMGESETZT** (BUILD_LOG 25.08. (8),
#      Volltext im Archiv): `WISO_SPICK_M08.md` bleibt eine reine Datei · Dubletten-Sperre ·
#      Bezugskalkulation nach 2.1 · drei Lücken als Kursabschnitte · Nachwisch gesperrt.
#      **Nicht erneut vortragen.** ⚠️ **Offen davon nur der Wiedereintritt** – erst messen, wie oft
#      `gotoSeite("unterricht")` real vorkommt. ⛔ Hängt am Gerät. Kein Freibrief zu vergessen.
```

### Zeilen 308-312 (alt 5 Zeilen, im Kopf jetzt 3)

```
#   2.–9. ✅ **ALLE ERLEDIGT** → `START_PROMPT_ARCHIV.md`, „Abschnitt 4 – erledigte Punkte".
#      Darunter: die „17 verwaisten Firmennamen" sind null (25.08.).
#      ⚠️ **M08-335 sah aus wie eine kaputte Frage** („Lies den Handelsregister-Auszug",
#      kein Auszug im Text). Er steht im **`svg`-Feld** – `typ: "bild"`. ►► **Wer eine Frage
#      auf Vollständigkeit prüft, MUSS `svg` mitlesen.**
```

### Zeilen 313-318 (alt 6 Zeilen, im Kopf jetzt 5)

```
#   ► ✅ **NEU 25.08.: 37 FIRMENNAMEN AUF UMLAUTE GEZOGEN** (Entscheid 27.07., vier Wochen offen).
#      41 Fundstellen, 9 Pool-Dateien, jede Änderung nur `ae→ä`/`oe→ö`/`ue→ü`/`ss→ß`.
#      Messen: **`node tools/pool_query.js firmen`** (⚠️ liest `fragen.js`, NICHT `faelle.js`).
#      Setzen: **`python3 tools/firmen_umlaut_setzen.py --trocken|--setze`**. `check.sh` 4e3
#      meldet jeden Rückfall als FEHLER. ⚠️ **Ein blankes `/ue/` meldet 10 richtige Namen mit**
#      („Brauerei", „Steuerberatung", „Uetersen") – die Ausnahmen stehen sichtbar im Werkzeug.
```

### Zeilen 320-324 (alt 5 Zeilen, im Kopf jetzt 4)

```
# **NUTZER-ENTSCHEIDE VOM 27./28.07.2026 – NICHT ERNEUT VORTRAGEN.** Vollständig ausgelagert nach
#   `START_PROMPT_ARCHIV.md`, Abschnitt „Nutzer-Entscheide 27./28.07.2026" (24.08., Platzgründe).
#   Kurz: Machbarkeits-Systematik bleibt · „IHK-Standard" = **DIN 69901** · Eisenhower bleibt im
#   Feinthema Risiko & Stakeholder · Umlaute auch in Firmennamen · Längengriff abgeschlossen, die
#   zwölf Bestands-IDs stehen in Abschnitt 2 · CI auf `@v6` · Positionsverweise als Inhaltszitat.
```

### Zeilen 360-362 (alt 3 Zeilen, im Kopf jetzt 2)

```
# ⚠️ **EINE PRÜFUNG, DIE WÜRFELT, IST KEINE PRÜFUNG.** `test_axe` zog EINE Frage zufällig, traf
#   einen Fragetyp mit ~3,5 % pro Lauf und hielt so einen `aria-command-name`-Verstoß seit R10 (a)
#   grün. Am 27.07. deterministisch: **acht weitere Fragetypen fielen auf, fünf critical.**
```

### Zeilen 363-371 (alt 9 Zeilen, im Kopf jetzt 6)

```
# ⛔⛔ **`open(P,"w").write(open(P).read().replace(...))` LEERT DIE DATEI.** Python wertet
#   `open(P,"w")` VOR dem inneren `read()` aus – gelesen wird aus der schon leeren Datei. Am
#   24.08. standen `app_state.js` und `sw.js` dadurch auf **0 Byte**.
#   ►► **REGEL: erst lesen, Handle schliessen, dann schreiben.** Zwei getrennte `with`-Blöcke,
#   nie beides in einem Ausdruck. **Und nach jedem Schreiben nachsehen, ob drinsteht, was
#   drinstehen soll** – aufgefallen ist es nur, weil ein `grep` auf die neue Version nichts fand.
#   ⚠️ **ZURÜCKHOLEN GEHT HIER NUR MIT `git show HEAD:datei > datei`.** `git checkout -- datei`
#   scheitert, weil es die alte Datei entfernen will und `unlink` auf dem Mount nicht darf.
#   Die Umleitung schreibt in die bestehende Datei und braucht kein unlink.
```

### Zeilen 372-378 (alt 7 Zeilen, im Kopf jetzt 4)

```
# ⛔⛔ **WER DIE APP MISST, MISST IN DER APP.** Am 31.08. waren DREI Messungen falsch, alle aus
#   demselben Grund: außerhalb der laufenden App gemessen. (1) Nenner = ganzer Pool statt
#   `kandidaten()` → M03 schien +17,9 Punkte überrepräsentiert. (2) Nenner = Kandidaten im
#   Endzustand statt zum Ziehungszeitpunkt → die Menge wächst mit der Stufe (164 → 240).
#   (3) `THEMA_RELEVANZ` per `require("./logik.js")` → „0 Einträge", also schloss ich sie als
#   Ursache AUS – in der App hat sie **80 Einträge**, und sie war es. ►► **Jede hätte einen
#   Scheinbefund ergeben. Ein Nachbau misst, was man sich denkt.**
```

### Zeilen 379-384 (alt 6 Zeilen, im Kopf jetzt 4)

```
# ⛔⛔ **EIN ANKER PRÜFT DEN WORTLAUT, DEN ER KENNT – NICHT DIE AUSSAGE.** Am 31.08. schwiegen die
#   Anker `GPL` und `Pay-per-Use` bei drei Fundstellen genau ihrer Klasse: „Änderungen **müssen**
#   zurückfließen" passte nicht auf das Muster „Änderungen zurückfließen".
#   ►► **Nachbarlisten so kurz wie möglich** und **am Ur-Zustand gegenproben, BEVOR korrigiert wird.**
#   ⚠️ **Ursache messen, nicht vermuten:** ein Sonderweg gegen eine vermutete Ursache meldete prompt
#   zwei Stellen, die RICHTIG abgrenzen. Zurückgebaut. Volltext: BUILD_LOG 31.08. (4).
```

### Zeilen 385-396 (alt 12 Zeilen, im Kopf jetzt 9)

```
# ⚠⚠ **EIN VERWEISZIEL KANN EXISTIEREN UND TROTZDEM LEER SEIN.** `verweis` prüft, **ob** ein
#   Abschnitt existiert – nie, **ob der Begriff der Frage darin vorkommt.** Am 31.08.: `IaaS`/`PaaS`
#   in **keiner der neun Kursdateien**; in Modul 07 dann **14 Fragen auf einmal** auf 7.6 („… und
#   Einweisungen"), das keinen Satz darüber enthielt. **Der Lerner klickt den Verweis genau dann,
#   wenn er die Frage falsch hatte.** ►► `python3 tools/e3_gegenprobe.py --alle` prüft das (fand
#   B91/B92/B100). **Kandidatenfilter:** in M03 5 von 7 Fehlalarme, in M07 0 von 5.
#   ⛔ **UND DIE NÄCHSTE STUFE SIEHT KEIN WÄCHTER: ZIEL DA, BEGRIFF DRIN – UND TROTZDEM FALSCH.**
#   B106 (02.09.): Der Lehrtext definierte Leasing als Operating-Leasing, während die eigene Frage
#   `M07-003` seit Etappe 3 „Instandhaltung je nach Vertragsart" sagte. `verweis` prüft die
#   Existenz, `--streng` das Vorkommen – den **Widerspruch zwischen Frage und Ziel** prüft nichts.
#   ►► **Wer einen Fachsatz im Lehrtext anfasst, liest die Fragen dazu** (`pool_query.js suche`)
#   **und sucht denselben Satz im Spickzettel** – dort stand die fünfte, zuerst übersehene Stelle.
```

### Zeilen 397-405 (alt 9 Zeilen, im Kopf jetzt 6)

```
# ⛔⛔ **EIN WÄCHTER, DER VERSIONEN VERGLEICHT, SIEHT KEINEN INHALT.** Nach dem Push von v1.19.0
#   lag der B106-Commit ungepusht auf main; beide Nummern der Auslieferungs-Zeile waren 1.19.0,
#   und 4e2b hätte den Marker **„PUSH DURCH" erzwungen** – während eine Änderung, die der Lerner
#   sieht, unveröffentlicht dalag. **Cloudflare deployt bei JEDEM Push** (`DEPLOY.md`), nicht erst
#   beim Tag. 4e2b2 schliesst genau das. ►► **Und er sagt, wo er nichts misst:** in der CI ist
#   `HEAD == origin/main` per Konstruktion, der Zähler dort **strukturell 0**. Ein grüner Wächter
#   an einer Stelle, an der er nichts messen kann, ist die Falle vom 27.07. (`test_axe` würfelte)
#   und vom 31.08. (`harte_nachbarn`). **Vor dem Bauen an vier Fällen mit bekannter Antwort
#   geprüft**, Meldezweig eingeschlossen – nicht erst hinterher.
```

### Zeilen 406-409 (alt 4 Zeilen, im Kopf jetzt 3)

```
# ⚠️ **DER TITEL EINES ABSCHNITTS IST KEIN INHALTSVERZEICHNIS.** Modul 03: 3.2 „Typische
#   IT-Systeme" führt **kein einziges Netzwerkgerät** (die stehen in 3.1), 3.3 „Leistungsfähigkeit
#   und Energieeffizienz" enthält die 802.11-Tabelle und LWL. **21 der 33 M03-Fehler kamen aus
#   diesen zwei Verwechslungen.**
```

### Zeilen 410-413 (alt 4 Zeilen, im Kopf jetzt 3)

```
# ⚠️⚠️ **EIN WERKZEUG, DAS AM ERSTEN TAG GEBAUT WIRD, IST AM ERSTEN TAG NOCH NICHT GEPRÜFT.**
#   `pool_query.js verweise` las am 24.08. **„WCAG 2.1" als Abschnitt 2.1** und hielt die 24
#   gewollten Mehrfachverweise für Ausreißer – **neun richtige Verweise wären „repariert" worden.**
#   **Ein neues Messwerkzeug erst an einem Fall prüfen, dessen Antwort man kennt.**
```

### Zeilen 414-418 (alt 5 Zeilen, im Kopf jetzt 3)

```
# ⚠️ **EIN ABSCHNITT MIT DÜNNEM INHALT IST TROTZDEM DER RICHTIGE ABSCHNITT.** „Modul 07 hält für
#   ‚Einweisung & Schulung' keinen Fundort vor" (Abschnitt 4, 28.07.) – **7.6 heißt wörtlich
#   „… und Einweisungen".** Geglaubt statt am Inhaltsverzeichnis geprüft: 15 Fragen lagen einen
#   Monat auf 7.7 (Nachkalkulation). Derselbe Satz erfand ein „7.8". **Zwei von drei Teilen einer
#   selbst notierten Behauptung waren falsch – „kein Fundort" ≠ „zu wenig Inhalt".**
```

### Zeilen 419-424 (alt 6 Zeilen, im Kopf jetzt 3)

```
# ⚠️ **EINE VERSIONSANGABE IN DER DOKU IST EIN MESSWERT VON DAMALS, KEIN ZUSTAND.** Der
#   Node-20-Befund stand hier als „`@v4` → `@v5`" – richtig notiert, als er notiert wurde. Beim
#   Ausführen am 28.07. war v5 selbst schon eine Generation zurück (checkout v6 seit 20.11.2025,
#   setup-node v6 seit 14.10.2025); der Griff hätte sich in Kürze wiederholt. **Vor dem Umsetzen
#   eines notierten Versionssprungs die Release-Seite aufrufen** – `WebSearch` und `WebFetch`
#   können das. Derselbe Fehlertyp wie „npm 403" am 27.07.
```

### Zeilen 425-428 (alt 4 Zeilen, im Kopf jetzt 3)

```
# ⚠️ **EIN REPORT, DESSEN URTEIL MAN SUCHEN MUSS, IST EIN HALBER REPORT.** `ci2.sh` zeigte den
#   neuesten Lauf ÜBERHAUPT im Detail – und das war ein grüner Cloudflare-Bot-Lauf auf einem
#   PR-Branch, während main rot war. „Fehlgeschlagene Schritte" blieb leer. **„Der letzte Lauf" ist
#   nicht „der Lauf meines Pushes".**
```

### Zeilen 429-432 (alt 4 Zeilen, im Kopf jetzt 3)

```
# ⚠️ **DER LÄNGEN-TELL ENTSTEHT BEIM SCHREIBEN VON SELBST.** In Etappe 4 hatten 5 von 6, in
#   Etappe 5 wieder 4 von 12 neuen mc-Fragen die richtige Antwort als längste – ohne Absicht. Die
#   richtige Antwort ist eben die vollständige. **VOR dem Einsortieren messen**; `tools/apply_batch.py`
#   weist per `assert` jede Frage mit Tell zurück.
```

### Zeilen 434-450 (alt 17 Zeilen, im Kopf jetzt 13)

```
# ⚠️ **DIE WÄCHTER SIND KLÜGER ALS ICH – SIE HABEN AM 27.07. FÜNFMAL RECHT BEHALTEN.** Wer beim
#   Schreiben neuer Fragen einen Wächter anschlagen sieht, sollte NICHT zuerst den Wächter
#   verdächtigen. Gemessene Fälle, alle in Etappe 5/6, alle echte Fehler von mir:
#   * **Gebiets-Prüfung (viermal!):** „Berechnungen: Daten & Übertragung", „Lizenzen & Urheberrecht",
#     „Netzwerkkomponenten & Medien", „Hardware-Komponenten" und „Netzplan & Puffer" liegen NICHT
#     dort, wo man sie vermutet. **Nie das Gebiet raten – der Bestand führt es, `apply_batch.py`
#     sagt einem das richtige.**
#   * **`test_matrix` hat drei INHALTLICHE Wächter:** jedes Matrix-Element braucht eine konkrete
#     Zahl oder Häufigkeit, kein Beispielmotiv darf in mehr als 3 Matrix-Fragen vorkommen
#     („Serverraum" war schon dreimal belegt), und die Kurzerklärung muss eine Zahl aus den
#     Elementen aufgreifen. Alle drei haben angeschlagen, alle drei zu Recht.
#   * **`schluesselbegriffe` ist ein OBJEKT** `{pflicht:[[...]], kuer:[...]}`, keine Liste. Ging als
#     Liste durch acht Prüfklassen, gemeldet erst von `validate_schema` NACH dem Schreiben →
#     `apply_batch.py` hat seither eine **neunte Klasse: Feldtyp gegen den Bestand**.
#   * **Der Abkürzungs-Wächter liest NUR `f.frage`.** Ein neues Kürzel dort treibt den Zähler hoch.
#     Zwei Wege: ins Lexikon (Nutzer-Entscheid nötig!) oder im Fragetext ausschreiben. In M01-050
#     wurde ausgeschrieben – die Spaltenköpfe dürfen FAZ/FEZ bleiben, die liest der Wächter nicht.
```

### Zeilen 452-456 (alt 5 Zeilen, im Kopf jetzt 4)

```
# ⚠️ **DER GEBIETS-WÄCHTER MISST EINEN ANTEIL – JEDE NEUE FRAGE AUSSERHALB VON A4 SENKT IHN.**
#   Vor Etappe 6 gerechnet: 26 Fragen alle außerhalb A4 hätten A4 von 4,88 % auf 4,73 % gedrückt und
#   den Wächter (Schwelle 4,8) rot gemacht – ohne dass sich an A4 etwas verschlechtert hätte.
#   Gegenmittel ist Verteilung, nicht Schwellensenkung: drei Fragen in A4-Themen gelegt, Stand
#   danach **4,95 %**. **Bei jedem größeren Zuwachs vorher nachrechnen.**
```

### Zeilen 457-462 (alt 6 Zeilen, im Kopf jetzt 3)

```
# ⚠️ **EIN SINKENDER ANTEIL IST NOCH KEINE VERBESSERUNG – IMMER DEN ZÄHLER LESEN, NICHT DIE QUOTE.**
#   Von Etappe 1 bis Etappe 5 fiel der Tell-Anteil von 50,6 auf 43,8 % und sah nach Fortschritt aus.
#   **Der Zähler stand die ganze Zeit unverändert bei 124** – gewachsen war allein der Nenner, weil
#   62 saubere neue Fragen dazukamen. Keine einzige schlechte Bestandsfrage war verbessert worden.
#   Erst Etappe 3 hat den Zähler bewegt: **124 → 102 bei konstantem Nenner 285.**
#   **Das Ziel darf nicht durch Hinzufügen erreicht werden.**
```

### Zeilen 463-468 (alt 6 Zeilen, im Kopf jetzt 4)

```
# ⚠️ **EINE KORREKTUR, DIE NUR DEN SCANNER ZUFRIEDENSTELLT, IST KEINE KORREKTUR.** M02-771 stand
#   als „erledigt", weil der Suchausdruck `Option \d` dort nichts mehr fand – die Positionsverweise
#   waren aber nur zu „(0) … (1) …" umgeschrieben und damit unsichtbar statt behoben. **Die
#   Gegenprüfung darf nicht dieselbe sein, an der die Korrektur sich orientiert hat.** Zweiter Nutzen
#   derselben Lehre: Wer eine Fehlerklasse scannt, sollte nach der ZWEITEN Schreibweise suchen –
#   hier war der Unterscheider die Null, weil eine Aufzählung nie bei 0 beginnt.
```

### Zeilen 469-471 (alt 3 Zeilen, im Kopf jetzt 2)

```
# ⚠️ **EIN SACHBEFUND IST EIN VERDACHT AUF EINE FEHLERKLASSE.** Der TLS-Befund galt als Einzelfall;
#   im selben Modul lagen drei weitere Fundstellen, die den veralteten Stand als vorbildlich
#   markierten. Nach JEDEM fachlichen Befund poolweit nach demselben Muster suchen.
```

### Zeilen 472-476 (alt 5 Zeilen, im Kopf jetzt 4)

```
# ⚠️ **NICHT ÜBER DAS ZIEL HINAUSSCHIESSEN.** Beim Angleichen der Distraktoren waren sie im ersten
#   Entwurf fast doppelt so lang wie die richtige Antwort. **Der Wächter meldet das NICHT** – er misst
#   nur „richtige ist die längste". Der Lerner würde dann „nimm die kürzeste" lernen.
#   **Ziel: Gleichstand ±15 %, mit mindestens einem Distraktor über der richtigen Antwort.**
# ⚠️ **NIEMALS die richtige Antwort kürzen** – das kostet fachliche Präzision.
```

### Zeilen 477-484 (alt 8 Zeilen, im Kopf jetzt 6)

```
# ⚠️ **Pool-Scans IMMER über das GANZE Frage-Objekt** (`json.dumps`), nie nur über frage/erklaerung:
#   Fehler stecken auch in `verweis`, `optionen`, `distraktorErklaerungen`, `musterloesung`, `paare`.
#   ⚠️ ABER: Bei der BEWERTUNG von Sachaussagen nur prüfen, was der Pool als WAHR behauptet –
#   falsche Antwortoptionen sind ABSICHTLICH falsch (`fakten_check.py` meldete deshalb 14 Fehlalarme).
# ⚠️ **Die Positionsverteilung der richtigen Antwort (71 % auf Platz 1) ist KEIN Problem** – die
#   Optionen werden beim Anzeigen gemischt (`app_loeser.js:65`). Nicht „reparieren".
# ⚠️ **Bei „binary file matches" auf einer .js/.md NIE weiterarbeiten**, erst prüfen:
#   `python3 -c "print(open(F,'rb').read().count(b'\x00'))"` – app_seiten.js hatte ein NUL-Byte.
```

### Zeilen 489-491 (alt 3 Zeilen, im Kopf jetzt 2)

```
#   ⚠️ **DIESE LISTE IST DIE EINZIGE. `TASKLIST.md` Abschnitt 5 verweist hierher und führt
#      keine zweite mehr.** Bis zum 28.07. gab es beide – und beide sagten „BUILD_LOG ab v1.7.0",
#      als längst bis v1.11.0 rotiert war. **Zwei Listen für dieselbe Sache driften immer.**
```

### Zeilen 492-495 (alt 4 Zeilen, im Kopf jetzt 3)

```
#   `TASKLIST.md` ............ **Agenten-Matrix, Prüfprotokoll, Tooling-Fallstricke, Token-Spar-
#                              regeln, Verfahrenslehren 0b.** ⚠️ **Kein Status – und seit 27.08.
#                              keine allgemeinen Arbeitsregeln mehr: die stehen ausschließlich in
#                              Abschnitt 5 dieser Datei.** Chronik: `TASKLIST_ARCHIV.md`.
```

### Zeilen 496-500 (alt 5 Zeilen, im Kopf jetzt 4)

```
#   `PLAENE.md` .............. **nur noch die OFFENEN Etappen** (2, 3-Rest, 7) + Alt-Pläne.
#                              Erledigte Etappen: `PLAENE_ARCHIV.md` (0, 1, 4, 5, 6, alle draußen).
#                              ⚠️ **PLANUNGSZAHLEN DARIN SIND MESSWERTE VON DAMALS**, keine
#                              Statusaussagen (z. B. „A4 bei 2,8 %, Wächter ROT" – der geltende
#                              Wert steht im erzeugten Block in `SORTIERUNG_PRUEFUNGSORDNUNG.md`).
```

### Zeilen 514-519 (alt 6 Zeilen, im Kopf jetzt 5)

```
#   `laengen_ausnahmen.json` . **Grenzwerte UND Bestandsentscheide zum Längenverhältnis der
#                              mc-Optionen.** EINE Quelle für `tests/test_didaktik.js` (Wächter 5),
#                              `tools/apply_batch.py` (Klasse 10) und `tools/opt_ersatz.py`.
#                              ⚠️ Ein Eintrag wirkt wie das Anheben einer Ratsche – **nur mit
#                              Nutzer-Entscheid, Datum und Begründung.** ⚠️ Seit 27.08. deckelt
#                              `faktor_bestand` jede Ausnahme auf den damals gemessenen Wert.
```

### Zeilen 520-523 (alt 4 Zeilen, im Kopf jetzt 3)

```
#   `begriffe_belegt.json` .. **gegensaetzlich benutzte Fachbegriffe** – **NEUN Eintraege**
#                              (31.08.: `Rechenwerk` gegengeprobt, `MTTR` nur dokumentiert).
#                              ⚠️ **Klein halten ist die Regel, nicht die Zahl** – aufgenommen wird
#                              ein Begriff erst, wenn der Widerspruch BELEGT ist (`_warnung` darin). ⚠️ Der Waechter misst KEINE Bedeutung (`_grenze` darin).
```

### Zeilen 524-527 (alt 4 Zeilen, im Kopf jetzt 3)

```
#   `zitate_belegt.json` ..... **Belegte Gesetzeszitate UND Vorschriften ohne Absatzgliederung.**
#                              EINE Quelle für `check.sh` 4e4 und `pool_query.js zitate`.
#                              ⚠️ Ein neues Zitat wird nachgeschlagen und eingetragen – sonst rot.
#                              ⚠️ Seit 27.08. wird auch der WORTLAUT geprüft (`zitat_beginnt`).
```

### Zeilen 533-538 (alt 6 Zeilen, im Kopf jetzt 4)

```
# ⚠️ **`TASKLIST.md` TOKEN-SPARREGEL 6 SAGT SEIT DEM 12.07.: „`tools/pool_query.js` NUTZEN STATT
#   AD-HOC NODE-EINZEILER." AM 28.07. WURDE SIE DEN GANZEN TAG GEBROCHEN** – acht Wegwerf-Skripte
#   für dieselbe Messung, **eines zählte falsch**, daher stand einmal „65 Fälle" und einmal „49".
#   Grund: Die Regel steht in TASKLIST, gelesen wird
#   diese Datei. **Deshalb steht sie jetzt hier.**
#   ► **VOR JEDEM MESSSKRIPT: `node tools/pool_query.js` OHNE ARGUMENT AUFRUFEN.**
```

### Zeilen 546-552 (alt 7 Zeilen, im Kopf jetzt 5)

```
#   `node tools/pool_query.js verweise [modul]` . E2-Zählung + Matrix thema→Abschnitt (E3-Lauf)
#   `node tools/probe_lernfluss.js <kopie> [sitz] [fragen] [--antworten q] [--gewichte]`
#                              **Was der Lerner in einer Sitzung sieht** (31.08.): Themen-,
#                              Typ-, Stufen- und Wiedersehensverteilung über die ECHTE
#                              `naechsteFrage()`. Geseedet, schreibt nichts.
#                              ⚠️ **`--gewichte` umhüllt `L.gewichteFrage`** und zeigt, welcher
#                              Faktor ein Modul drückt – so wurde L1 aufgeklärt.
```

### Zeilen 553-561 (alt 9 Zeilen, im Kopf jetzt 6)

```
#   `python3 tools/e3_gegenprobe.py [--alle|--e2|--streng]` . **Gegenprobe zu Verweisen.**
#                              ⚠️ **`--streng` (31.08.): JEDES fehlende Stichwort, nach BEGRIFF
#                              aggregiert** – der Vorgabelauf meldet nur Fragen ohne JEDEN
#                              Treffer und übersah so B90. Mechanisch:
#                              kommt ein Stichwort des Verweistextes im Zielabschnitt vor?
#                              Ohne `--alle` nur die Korrekturen aus `tools/migration/e3_*.json`.
#                              ⚠️ **Kalibriert am 24.08. in drei Schritten** (Komposita,
#                              Überschrift, modulübergreifende Verweise) – **eine unkalibrierte
#                              Fassung meldete 55 statt 19 Fälle.**
```

### Zeilen 562-564 (alt 3 Zeilen, im Kopf jetzt 2)

```
#   `python3 tools/verweis_setzen.py --batch <datei> [--trocken]` . **`verweis`-Felder setzen** –
#                              Rezept eingebaut (Blockgrenze, genau eine Fundstelle, json.loads
#                              VOR dem Schreiben, /tmp-Sicherung). **Nie von Hand nachbauen.**
```

### Zeilen 597-600 (alt 4 Zeilen, im Kopf jetzt 3)

```
#   `bash tools/sabotage.sh --datei F --suite N --alt M [--neu E]` .. **GEGENPROBE IN EINEM AUFRUF**
#                              (30.07.). Muster muss GENAU EINMAL passen, sonst Abbruch · `trap`
#                              stellt die Datei IMMER wieder her · **rc=0 nur bei ROTER Suite**
#                              (1 = unbemerkt, 3 = Muster passt nicht). **Nicht mehr von Hand.**
```

## ROTATION 2026-09-07 — sechs Bloecke aus Abschnitt 2 ausgelagert

⚠️ Anlass: 600 von 600 Zeilen, gemessen von `tools/umgebung.sh`. Abschnitt 2 „STAND" war mit
177 Zeilen der groesste — und widersprach damit seiner eigenen Regel („der Stand steht in genau
diesen zwei Zeilen"). Verfahren wie am 03.09.: **je Lehre bleibt der REGELSATZ im Kopf, die
HERLEITUNG kommt hierher.** Erstmals mit `tools/rotiere.py` statt von Hand; die Gegenprobe
(jede nicht leere Zeile steht im Archiv oder im neuen Kopf) faehrt das Werkzeug selbst.
⛔ **STATUS-AUSSAGEN HIER SIND UEBERHOLT** — im Zweifel gilt START_PROMPT, gemessen wird am Code.

### aus START_PROMPT.md, Zeilen 99-117 der Ur-Fassung

#   **SCHRITT 2: DIE QUALITÄTSRUNDE Q2 IST KOMPLETT DURCH (31.08.) – ES GIBT KEINE OFFENE ETAPPE.**
#      ✅ Etappen II–VII alle abgeschlossen: `BEFUNDE_BEGRIFFE.md`, `BEFUNDE_M04-M06.md`,
#      `BEFUNDE_FAELLE.md`, `BEFUNDE_LERNUNTERLAGE.md`, `BEFUNDE_LERNFLUSS.md`.
#      **Nicht neu anfangen, nicht nachprüfen.**
#      ✅ **B106, die M08-Stufung und N2 sind am 02.09. belegt und erledigt – nicht wieder
#      aufmachen** (Volltext: `BEFUNDE_LERNFLUSS.md`, BUILD_LOG 02.09.).
#      ⚠️ **A4 liegt knapp über der Schwelle 4,8**: **noch rund 36 Nicht-A4-AP1-Fragen, dann reißt
#      `test_didaktik`.** Geltende Zahl im erzeugten Block, nicht hier.
#      ⚠️ **SEIT 04.09. GIBT ES WIEDER EINEN PLAN:** `PLAENE.md`, „RUNDE Q3 – EXTERNE MASSSTÄBE",
#      acht Etappen, gegen Messungen vom selben Tag gestellt. **Er ersetzt den Satz „es ist nichts
#      offen", der vom 02.09. bis 04.09. galt.** Etappen mit Entscheidungsbedarf sind dort markiert
#      – **wer eine davon anfasst, fragt vorher.** Keine Etappe dazuerfinden, die dort nicht steht.
#      ►► **DER EINE KANDIDAT, FALLS ER EINE RUNDE WILL:** kein Wächter sieht, wenn **Lehrtext und
#      Pool einander widersprechen**. `verweis` prüft, ob das Ziel existiert, `--streng`, ob das
#      Stichwort darin vorkommt – den Widerspruch prüft nichts. B106 war genau das (der Lehrtext
#      definierte Leasing gegen die eigene Frage `M07-003`, monatelang) und wurde durch Zufall
#      gefunden. **Erst messen, ob das mechanisch billig geht, bevor etwas gebaut wird.**
#      ►► **Vor jeder neuen Lehrtext-Runde:** `python3 tools/e3_gegenprobe.py --streng` und
#      **Zeilen Lehrtext je Frage** rechnen – beide trafen am 31.08. (Belege: Archiv 03.09.).

### aus START_PROMPT.md, Zeilen 144-149 der Ur-Fassung

# ► **ETAPPE 3 IST DURCH: M01, M02, M03, M07, M08** ◄ `ETAPPE3_M0X_BEFUNDE.md`: 599 Fragen
#   gelesen, **82 schwere Befunde**. **Nicht nachprüfen.** Die E3-Fehlerklassen sind in der Liste
#   oben aufgegangen; die alte Fassung steht im Archiv 03.09.
#
# ✅ **DER POOLWEITE LÄNGENGRIFF IST ABGESCHLOSSEN** (28.07.) – **nicht erneut aufmachen.**
#   Der Tell-Zähler fiel von 124 auf **6 von 302 = 1,99 %** (27.08.); der Rest sind Bestandsentscheide.

### aus START_PROMPT.md, Zeilen 163-175 der Ur-Fassung

# ⛔ **HIER STEHT AB JETZT KEIN PUSH-STAND UND KEINE COMMIT-ZAHL MEHR** – jeder solche Satz war
#   Stunden später falsch, und jede Berichtigung kostete einen eigenen ungepushten Commit.
#   ► **WER DEN STAND WISSEN WILL, MISST IHN:**
#         `git status --porcelain`                   → was liegt im Baum?
#         `git log --oneline -5`                     → was ist committet?
#         `git log --oneline @{u}..HEAD` (falls Upstream gesetzt) → was fehlt dem Remote?
#   ⚠️ **OB EIN PUSH GELAUFEN IST UND OB DIE CI GRÜN WAR: DEN NUTZER FRAGEN.** Beides ist aus der
#   Sandbox nicht messbar (GitHub 403). **Nie annehmen, nie aus einem Doku-Satz schließen.**
#   ⚠️ Falls ein Push je abgelehnt wird: **melden, nichts erzwingen.** Kein `--force`, kein
#   `push.sh` (legt `.git_broken_old` an). Push geht NUR vom Windows-Rechner.
#   ⚠️ **Tag und Release entstehen erst beim Push** – die Action legt sie bei einem Bump selbst an.
#   ⚠️ `ci2.sh` zeigt IMMER auch ältere FEHLGESCHLAGENE Läufe – **maßgeblich ist die URTEIL-Zeile
#   am Ende.**

### aus START_PROMPT.md, Zeilen 177-181 der Ur-Fassung

# ✅ **ERLEDIGT 28.07.: `ci.yml` STEHT AUF `@v6`** (Archiv, „CI-Runtime v6"). **Nicht vortragen.**
#   ⚠️ **DER CI-STATUS IST DAMIT NICHT BEKANNT.** `bash ci2.sh` läuft nur auf dem Windows-Rechner.
#   **NIE aus der Sandbox einen CI-Status behaupten** – auch nicht nach einem bestätigten Push.
# ⚠️ **KEINEN COMMIT-HASH IN DIESE DATEI SCHREIBEN.** Er steht in `tools/umgebung.sh` und in
#   `git log` – dort ist er immer richtig, hier nie lange. (Beleg 28.07.: Archiv.)

### aus START_PROMPT.md, Zeilen 182-192 der Ur-Fassung

# ⛔⛔ **GIT AUF DEM MOUNT KANN SEINE EIGENEN DATEIEN NICHT LÖSCHEN – DAUERZUSTAND, KEIN
#   ZWISCHENFALL.** Jeder schreibende Git-Aufruf hinterlässt `.git/index.lock`, oft `.git/HEAD.lock`;
#   `unlink` scheitert, der Aufruf läuft durch. **Ein liegengebliebenes `HEAD.lock` blockiert den
#   nächsten Ref-Update** – also den nächsten Commit.
#   ⚠️ **SO GEHT ES SEIT DEM 27.08.: `bash tools/gitc.sh <git-argumente>`** – der Wrapper räumt
#   `index.lock`/`HEAD.lock` VOR und NACH jedem Aufruf weg (`rm` scheitert, `mv` geht) und reicht
#   den Rückgabewert durch. **Nicht mehr von Hand, nicht nachbauen.**
#   ⚠️ **`_to_delete/` steht in `.gitignore`** und ist die Ablage für alles, was hier nicht
#   gelöscht werden kann. ⛔ **`allow_cowork_file_delete` GIBT ES IN DIESER UMGEBUNG NICHT MEHR** –
#   nicht danach suchen. **Nutzer-Anweisung 27.07.: das selbst erledigen, nicht melden und liegen
#   lassen.** `tools/umgebung.sh` meldet den Lock in Zeile 1 des Git-Blocks.

### aus START_PROMPT.md, Zeilen 195-228 der Ur-Fassung

# ► **SEIT 03.09. GIBT ES ZWEI EXTERNE MASSSTAEBE - UND SIE SIND NICHT GLEICHWERTIG.**
#   ⚠️⚠️ **MASSGEBLICH IST DER PRUEFUNGSKATALOG**, nicht das Lehrbuch: `tools/katalog/`
#      (48 Seiten, deutsche OCR, durchsuchbar). ⚠️ **SEIN ANHANG S.41-48 IST EIN MASSSTAB, KEINE
#      ERLAEUTERUNG:** UML-Notation (43-45), **Praefixe (46: „Angaben zu Datenmengen sind nur mit
#      Binaerpraefixen richtig")**, Musterbeleg (47). Bis 04.09. nie ausgewertet - Etappen A+ und I.
#      **Er fuehrt die Lernfeld-Zuordnung amtlich**
#      (`06 ... IT-Sicherheit und Datenschutz | LF4`) - die muss nicht geschaetzt werden.
#      ⛔ Er liegt in `tools/`, weil `.assetsignore` `tools/**` ausschliesst, `*.txt` aber NICHT:
#      im Wurzelverzeichnis waere er an den Lerner ausgeliefert worden.
#   ⚠️ **Das Lehrbuch (LF1-5) liegt AUSSERHALB des Repos**, Ordner `Buch/_aufbereitung/`,
#      Werkzeug `buch.py`. **Es deckt nur die Grundstufe** - was dort fehlt, ist NICHT
#      automatisch eine Luecke bei uns. **Jede Seite ist ein Scan, der ganze Text ist OCR:**
#      was eine Aenderung am Bestand ausloest, wird am Seitenbild bestaetigt (`buch.py bild`).
#   ⛔⛔ **EINE LUECKE GEGENUEBER DEM BUCH IST KEINE LUECKE BEI UNS.** Dreimal am 03./04.09. sah
#      es nach Handlungsbedarf aus und war keiner: BPMN steht im Katalog nur in der Vorbemerkung ·
#      SQL und RAID sind dort „ausschliesslich Teil 2" · Verpackungsgesetz und Arbeitssicherheit
#      ebenso (Ergonomie und Recyclingfaehigkeit, die IN Teil 1 stehen, sind laengst abgedeckt).
#      ►► **Vor jeder Ergaenzung im Katalog nachschlagen UND die naechste vorangehende
#      Teil-Ueberschrift mitlesen** (Teil 1 = Zeile 338-1052, ab 1053 Teil 2). Ein blankes `grep`
#      haette dreimal AP2-Stoff in eine AP1-Frage getragen - das sieht kein Gebiets-Waechter.
#   ⛔⛔ **DAS BUCH KANN SELBST FALSCH SEIN - UND IST ES.** Seine WLAN-Normtabelle (S.320) fuehrt
#      `802.11ad` als „Wi-Fi 6" und widerspricht sich zwei Zeilen spaeter selbst (B127, am
#      Seitenbild bestaetigt). Unser Pool war richtig. ►► **Wo Buch und Pool sich widersprechen,
#      entscheidet die SACHE, nicht die Quelle.** Ein ungeprueft uebernommener Buchsatz
#      verschlechtert den Pool - das ist die groessere Gefahr, nicht das Uebersehen.
#   ✅ **PROBE M06 GEGEN LF4 IST DURCH (03.09.): null Sachfehler, ein Befund (B126),
#      zwei entkraeftete Verdachtsfaelle.** `BEFUNDE_BUCH_KATALOG.md`. **Nicht wiederholen.**
#      ✅ **ANKERLAUF M03 GEGEN LF2/LF3 DURCH (03.09.): B127 + B128.** Nicht wiederholen.
#      ►► **Anker-Abgleich (Normen, Paragrafen, Fristen) traegt; Prosa-Abgleich nicht** -
#      der OCR-Text erzeugt Scheinwidersprueche, beide Verdachtsfaelle waren solche.
#   ⛔⛔ **EIN POOL-SCAN UEBER `json.dumps` ZAEHLT FELDER, NICHT FRAGEN.** Am 03.09. wurden so
#      "31 von 112 M06-Fragen" gemeldet; es waren **13 Fragen, davon 5 mit Pruefsubstanz**
#      (Fakt in Frage, richtiger Antwort, Musterloesung oder Pflichtbegriffen). **Vor jeder
#      Mengenaussage: Pruefsubstanz von blosser Erwaehnung trennen.**

## ROTATION 2026-09-07 (3) — Feierabend-Rotation, fuenf Bloecke

⚠️ 592 von 600 Zeilen. Ausgelagert wurde die Chronik des 07.09. und drei erledigte Altblöcke;
**die Lehren daraus stehen als Regelsatz weiter im Kopf.** Volltext der Befunde B132-B138:
`BEFUNDE_LERNUNTERLAGE.md` und `BUILD_LOG_ARCHIV.md`, Eintraege vom 07.09.
⛔ **STATUS-AUSSAGEN HIER SIND UEBERHOLT** — im Zweifel gilt START_PROMPT, gemessen wird am Code.

### aus START_PROMPT.md, Zeilen 207-232 der Ur-Fassung

# ►►► **AUS Q3 IST NICHTS MEHR OFFEN – (2) Belegsatz, (3) Sichtprüfungen und (4) der Bump sind
#   am 07.09. erledigt** (BEFUNDE §16 · B132/B133 · v1.23.1). **(1) Lehrtext 3.2 ausbauen bleibt
#   unbelegt** und ist es auch nach der Messung vom 07.09. geblieben.
# ⚠️⚠️ **WAS DIE MESSUNG STATTDESSEN FAND – DREI BEFUNDE UND EINE DAUERHAFTE LEHRE:**
#   B134 (exFAT fehlte in der Tabelle, die ihn versprach) · B135 (Verweis-Stichwort eine Tür
#   weiter) · **B136: 17 Begriffe standen in der PRÜFSUBSTANZ und in KEINER Kursdatei** –
#   Virtualisierung/Hypervisor/Container, elf Konsolenbefehle, Pönale, Johari, Sequenznummer,
#   Zonendatei. Alle geschlossen. Volltext + Sieb-Rezept: `BEFUNDE_LERNUNTERLAGE.md`.
#   ⛔⛔ **`--streng` MELDET NUR „FEHLT IM ZIEL-ABSCHNITT", NIE „FEHLT ÜBERALL"** – und **druckt
#   die Einzel-Kandidaten gar nicht, es zählt sie nur** („nur einmal: 181"). Dort lag B136.
#   ►► **WAS EIN WERKZEUG NICHT AUSDRUCKT, IST NICHT GEPRÜFT, AUCH WENN ES DIE ZAHL NENNT.**
#   ►► **UND: WER EINEN FEHLENDEN BEGRIFF NACHTRÄGT, PRÜFT DIE NACHBARN DESSELBEN THEMAS MIT** –
#   B90 trug IaaS/PaaS nach und ließ Hypervisor/Container im selben Abschnitt liegen.
#   ⚠️ **Ein Kandidatenfilter ist nach dem Aufräumen NICHT verbraucht.**
#   ⚠️⚠️ **B138 – DER MUSTERLÖSUNGS-FILTER TRÄGT** (Pflichtbegriffe der Musterlösung gegen den
#   Zielabschnitt): Klasse A 16 → 2, Klasse B 14 → 7, elf Ergänzungen. **Rezept und die DREI
#   Kalibrierungsfallen: `BEFUNDE_LERNUNTERLAGE.md`.** ⛔ Ohne sie meldet er 152 statt 16:
#   **`abschnitte()` gibt KLEINGESCHRIEBENEN Text zurück, `trifft()` vergleicht case-sensitiv** ·
#   Aufgabenwerte als Pflichtbegriff · **Markdown zerschneidet Wörter** (`**M**essbar`).
#   ►► **Jeder Lauf fährt drei Gegenproben mit bekannter Antwort vorweg.**
#   ⚠️ **„Der Begriff steht in einem anderen Abschnitt" heißt NICHT „der Verweis ist falsch".**
#   ⛔⛔ **B137, teuer und selbst gebaut: WER LEHRTEXT ZU EINER FRAGE SCHREIBT, SCHREIBT IHN
#   GEGEN DIE MUSTERLÖSUNG – NICHT GEGEN DEN FRAGETEXT.** Am 07.09. deckte ein neuer
#   Abschnitt drei von vier Gründen der Musterlösung ab und legte beim vierten das Gegenteil
#   nahe. **Pflichtbegriffe gedeckt, `--streng` still, jeder Wächter still** – keiner prüft,
#   ob der Abschnitt die Frage BEANTWORTET. **Danach gegen das Szenario gegenlesen.**

### aus START_PROMPT.md, Zeilen 240-249 der Ur-Fassung

#   | Etappe | Inhalt | Stand |
#   |---|---|---|
#   | 0–6, E3, I–VII | Wächter · M09-Auflösung · Batch M01–M08 · A4 · Stufen · `verweis`-Ziele · M04–M06 · Q2 (Begriffe, Fälle, Grafiken, Lernunterlage, Lerner-Fluss) | ✅ **alle durch.** Protokolle: `ETAPPE3_M0X_BEFUNDE.md`, `E3_M0X_VERWEISE.md`, `BEFUNDE_M04-M06.md`, `BEFUNDE_BEGRIFFE.md`, `BEFUNDE_FAELLE.md`, `BEFUNDE_LERNUNTERLAGE.md`, `BEFUNDE_LERNFLUSS.md`. Zeile für Zeile: Archiv 03.09. |
#   | 7 | Startlast auf dem Gerät messen (kein Umbau) | 🔶 **Nutzlast und Rechenzeit gemessen (25.08.), offen bleibt nur der Gerätewert – wird NICHT nachgefragt** |
#
# ► **ERLEDIGT UND NICHT ERNEUT VORZUTRAGEN** (Volltext: `START_PROMPT_ARCHIV.md`): M09-Tabu
#   aufgehoben · `verweis`-Fehlerklasse 1 poolweit sauber · Optionsverweise 0 · Längengriff 42 von
#   49. ⚠️ **M04-317 bleibt ein Fehlalarm** (DHCP-Option). ⛔ **„Lernunterlage ohne belegte Lücke
#   (34/34)" galt den VERWEISZIELEN, nicht dem Inhalt. Eine Messung gilt für das Gemessene.**
#

### aus START_PROMPT.md, Zeilen 260-266 der Ur-Fassung

#   ✅ **Startlast ohne Gerät gemessen (25.08.):** 877 kB gzip, davon 600 kB `fragen.js` – **die
#      Poolgröße kostet Übertragung, keine Rechenzeit.** ⛔ **Der Gerätewert bleibt offen und wird
#      NICHT nachgefragt** (Entscheid 27.07.). ✅ **GEBIETSVERTEILUNG: NICHT MEHR HIER** –
#      `tools/gebiete_stand.py`, Block in `SORTIERUNG_PRUEFUNGSORDNUNG.md`, Guard 4e2b3.
#
# ---- ARCHIV: Etappe 3, wie sie gelaufen ist → **`START_PROMPT_ARCHIV.md`**. Die Lehren daraus
#      stehen in Abschnitt 6; die E3-Zahlen dort sind durch `E3_M01_VERWEISE.md` überholt. ----

### aus START_PROMPT.md, Zeilen 282-283 der Ur-Fassung

# ✅ **DAS M09-TABU IST ERLEDIGT (04.08.2026)**, die Kategorie bleibt (Nutzer-Entscheid).
#    ⚠️ `KLAUSUR_TERMIN` steht auf `null` – **NICHT eigenmächtig setzen**, der Termin ist nicht bekannt.

### aus START_PROMPT.md, Zeilen 296-307 der Ur-Fassung

#   1. ✅ **SICHTPRÜFUNGEN ERLEDIGT AM 07.09.** (alle drei, sechs Wochen nach dem Freigeben):
#      **zwei Befunde, beide behoben.** Volltext: `BUILD_LOG.md` 07.09. (8).
#      * **B132 · M04-486:** die Grafik zeigte an beiden Enden ein **„?"**, die Frage behauptete,
#        die Kardinalität sei „dargestellt". **Nutzer-Entscheid: Grafik beschriften** (1 und n).
#      * **B133 · M07-028:** Option „…und der übergebenen **Zugangsdaten**" stand gegen Lehrtext 7.6
#        und M07-035 („nur vermerkt, DASS"). **Nutzer-Entscheid: „Zugänge"** (`opt_ersatz.py`).
#      ⚠️⚠️ **BEIDE FANDEN NUR DURCH HINSEHEN.** B132 stand vier Wochen an allen vier SVG-Wächtern
#        vorbei – sie prüfen Wohlgeformtheit, Zeichenfläche und Klickfläche, **nie, ob das Bild die
#        Frage beantwortet.** ►► **Wer eine Bildfrage prüft, rendert sie** (`tools/svg_bilder.py`).
#      ⛔ **`m06_304_ecdhe_sichtpruefung.html` und `m04_korrekturen.html` gibt es nicht mehr** –
#        Render-Abzüge stehen in `.gitignore`. Geprüft wurde am **aktuellen Pool**, und das ist der
#        richtige Anker: der Abzug von damals belegt nur, was damals war.

## ROTATION 2026-09-08 – erledigte Bloecke aus Abschnitt 2 und 4

### aus START_PROMPT.md, Zeilen 63-67 der Ur-Fassung

# ► **E3 IST DURCH (24.08.): 185 `verweis`-Ziele korrigiert** (Archiv). Werkzeuge:
#   `pool_query.js verweise [modul]` · `tools/verweis_setzen.py --batch`.
# ► **DIE DOPPELTE FRAGE IST AUFGEKLÄRT (25.08.):** Nachwisch der **abgehängten** Wischleiste,
#   gesperrt mit `if (!document.contains(bar))`. ⚠️ **„nur im Browser zu klären" war FALSCH** –
#   beides läuft in jsdom: `node tools/probe_doppelziehung.js <kopie>`.

### aus START_PROMPT.md, Zeilen 69-78 der Ur-Fassung

# ► **DIE M09-AUFLÖSUNG IST DURCH (04.08.) – DER BEREICH IST LEER, DIE KATEGORIE BLEIBT.**
#   Zahlen im Archiv, Gebietsstand unter Punkt 6. **Was davon weiter gilt:**
#   ⚠️ **`KLAUSUR_TERMIN` in `app_state.js` ist die EINZIGE Quelle des Termins**, `null` = kein
#     Termin → keine Countdown-Zeile. Für die nächste Klausur genügt dort ein Datum.
#   ⚠️ **`L.M09_THEMEN` führt weiter die acht alten Themen** – Validierung, Themenfilter und `tests/_m09fixture.js` hängen daran. **Beim nächsten Klausurstoff ERST setzen.**
#   ⚠️ **Wer M09 anfasst, ändert `tests/_m09fixture.js` – nicht die Suiten einzeln.** Vier Suiten
#     zogen ihre Testdaten aus dem Content-Stand und fielen beim Inhaltsschnitt wie Produktfehler.
#   ✅ **`WISO_SPICK_M08.md` BLEIBT EINE REINE DATEI** (Entscheid 24.08.) – nicht verdrahten.
#   ⚠️ **Eine Frage kann thematisch redundant und trotzdem Bestand sein** (fünf gelöschte Gantt-
#     Fragen trugen zwei der drei Meilenstein-Rauten): **vor jeder Löschung fragen „was hängt daran".**

### aus START_PROMPT.md, Zeilen 302-312 der Ur-Fassung

#   1. ✅ **SICHTPRÜFUNGEN ERLEDIGT AM 07.09. – ZWEIMAL:** erst B132/B133 (v1.23.1), dann die
#      **vollständige Durchsicht ALLER 96 Bildfragen** → B141 M03-562 (vier gleiche Kästen,
#      drei Ziele nicht ableitbar) · B142 M04-119 und B143 M01-970 (Lösung stand in der Frage) ·
#      B144 M01-510 (Meilenstein lag auf keinem Termin). Alle behoben, v1.23.3.
#      ⛔⛔ **ALLE VIER SVG-WÄCHTER WAREN DABEI GRÜN (96 Bilder, 0 Treffer)** – sie prüfen
#      Wohlgeformtheit, Textüberlauf, Zeichenfläche und Klickfläche, **nie, ob das Bild die
#      Frage beantwortet.** ►► **WER EINE BILDFRAGE PRÜFT, RENDERT SIE**
#      (`python3 tools/svg_bilder.py --id <ID>`; ⚠️ `pip3 install cairosvg`, wenn es fehlt).
#   2.–9. ✅ **ALLE ERLEDIGT** → `START_PROMPT_ARCHIV.md`, „Abschnitt 4 – erledigte Punkte".
#      ⚠️ **M08-335 sah aus wie eine kaputte Frage** – der Aufgabentext steht im **`svg`-Feld**
#      (`typ: "bild"`). ►► **Wer eine Frage auf Vollständigkeit prüft, MUSS `svg` mitlesen.**

## ROTATION 2026-09-09 – E3/Doppelte Frage und die M09-Aufloesung ins Archiv

### aus START_PROMPT.md, Zeilen 63-73 der Ur-Fassung

# ► **E3 (185 `verweis`-Ziele, 24.08.) UND DIE DOPPELTE FRAGE (25.08.) SIND DURCH** – Volltext:
#   Archiv. ⚠️ **„nur im Browser zu klären" war FALSCH: beides läuft in jsdom.** Werkzeuge:
#   `pool_query.js verweise [modul]` · `verweis_setzen.py --batch` · `probe_doppelziehung.js <kopie>`.
#
# ► **DIE M09-AUFLÖSUNG IST DURCH (04.08.) – DER BEREICH IST LEER, DIE KATEGORIE BLEIBT**
#   (Zahlen im Archiv). **Was weiter gilt:** `KLAUSUR_TERMIN` in `app_state.js` ist die EINZIGE
#   Quelle des Termins (`null` = keine Countdown-Zeile) · `L.M09_THEMEN` führt weiter die acht
#   alten Themen, **beim nächsten Klausurstoff ERST setzen** · **wer M09 anfasst, ändert
#   `tests/_m09fixture.js`, nicht die Suiten einzeln** · `WISO_SPICK_M08.md` bleibt eine reine
#   Datei (24.08.) · ⚠️ **eine Frage kann redundant und trotzdem Bestand sein – vor jeder
#   Löschung fragen „was hängt daran".**

## ROTATION 2026-09-09 (2) – die fuenf Lehren des 07.09. mit ihrer Herleitung

### aus START_PROMPT.md, Zeilen 231-251 der Ur-Fassung

# ►►► **DIE FÜNF LEHREN DES 07.09. – SIE GELTEN WEITER, DIE HERLEITUNG STEHT IM ARCHIV:**
#   ⛔⛔ **1. WAS EIN WERKZEUG NICHT AUSDRUCKT, IST NICHT GEPRÜFT, AUCH WENN ES DIE ZAHL NENNT.**
#      `--streng` meldet nur „fehlt im ZIEL-Abschnitt", nie „fehlt ÜBERALL", und **druckt die
#      Einzel-Kandidaten gar nicht** („nur einmal: 181"). Genau dort lag B136 mit 17 Begriffen.
#   ⛔⛔ **2. WER LEHRTEXT ZU EINER FRAGE SCHREIBT, SCHREIBT IHN GEGEN DIE MUSTERLÖSUNG – NICHT
#      GEGEN DEN FRAGETEXT** (B137, selbst gebaut). Pflichtbegriffe gedeckt, jeder Wächter still –
#      **keiner prüft, ob der Abschnitt die Frage BEANTWORTET.** Danach gegen das Szenario lesen.
#   ⚠️ **3. WER EINEN FEHLENDEN BEGRIFF NACHTRÄGT, PRÜFT DIE NACHBARN DESSELBEN THEMAS MIT** –
#      B90 trug IaaS/PaaS nach und ließ Hypervisor/Container im selben Abschnitt liegen.
#   ⚠️ **4. EIN KANDIDATENFILTER IST NACH DEM AUFRÄUMEN NICHT VERBRAUCHT** – und **jeder neue
#      Filter braucht Gegenproben mit bekannter Antwort VOR dem ersten Urteil**: der
#      Musterlösungs-Filter (B138) meldete ohne sie **152 statt 16** Lücken. Drei Fallen:
#      `abschnitte()` gibt KLEINGESCHRIEBENEN Text, `trifft()` vergleicht case-sensitiv ·
#      Aufgabenwerte als Pflichtbegriff · **Markdown zerschneidet Wörter** (`**M**essbar`).
#   ⚠️ **5. „DER BEGRIFF STEHT IN EINEM ANDEREN ABSCHNITT" HEISST NICHT „DER VERWEIS IST FALSCH".**
#   ►► **Rezepte und Zahlen: `BEFUNDE_LERNUNTERLAGE.md` (B136, B137, B138).**
#   ⛔⛔ **EIN WÄCHTER DARAUS IST AM 07.09. GEMESSEN UND VERWORFEN** – 192 Substanz-Kandidaten
#   ohne Kurstext-Fundstelle, überwiegend Versalien-Betonung und M08; er bräuchte ~200
#   Ausnahmen (`zitate_belegt` hat 5). **Nicht erneut vorschlagen.** ✅ Und **M08 hat
#   ABSICHTLICH keine Kursdatei** – seine 103 Verweise nennen Gesetzesstellen statt
#   Abschnitte (Entscheid 24.08.). **Wer dort eine Lücke misst, misst einen Entscheid.**

## ROTATION 2026-09-09 (3) – Q3-Nachweis, Stufe-3/4-Einzelheiten, Etappenliste

### aus START_PROMPT.md, Zeilen 213-230 der Ur-Fassung

# **RUNDE Q3 IST SEIT DEM 07.09. KOMPLETT DURCH – ALLE ZEHN ETAPPEN (A, A+, B, C, D, E, F, G1,
# G2, H, I) SIND ABGESCHLOSSEN.** Der Nachweis steht in `PLAENE.md`, Abschnitt „🚩 RUNDE Q3 –
# EXTERNE MASSSTÄBE": jede Zeile durchgestrichen, mit Datum und Ergebnis. **Nicht neu anfangen,
# nicht nachprüfen.** Q1 und Q2 stehen dort nur noch als Verfahrens-Vorlage.
# ✅ **DIE STUFE-3/4-LÜCKEN SIND GESCHLOSSEN (08.09., v1.24.0):** sechs Fragen in M05 QM-Begriffe
#   & Normen, M05 Audit & Prüfverfahren, M01 Projektmerkmale & Meilensteine. **Nachgemessen:**
#   nur noch drei Feinthemen haben höchstens eine Frage auf Stufe 3/4 – **exakt die drei
#   B3-Themen, die der Entscheid ausgenommen hat.** `PLAENE.md`, „DATENGRUNDLAGE STUFE-3/4".
#   ⚠️ **M01 hat für „Meilenstein" fast keinen Lehrtext** (1.1 nennt ihn in EINER Zeile): wer dort
#   schreibt, schreibt auf **Projektmerkmale nach DIN 69901**, nicht auf die Formulierungsregel.
# ⛔ **WAR DER GRIFF GETAN, GIBT ES WIEDER KEINEN PLAN.** Wer diesen Zustand vorfindet,
#   **erfindet keine Etappe dazu**, sondern MISST und legt vor: `pool_query.js duenn|typen|stufe`
#   · `tools/katalog/abdeckung.py` · `e3_gegenprobe.py --streng` · `tools/gebiete_stand.py`.
#   ⛔ **NICHT MEHR die `svg`-Fragen: alle 96 sind am 07.09. gerendert und angesehen**
#   (B141–B144, `BEFUNDE_BILDFRAGEN.md`, Abschnitt 3 nennt die geprüften IDs).
#   ⛔ **UND NICHT MEHR Katalog-Abdeckung und `--streng`: am 07.09. NACH Q3 erneut gefahren,
#   beide reproduzieren den bekannten Stand** (dieselben drei Fehlalarm-Klassen; die Fachbegriffe
#   der 29er-Liste stehen im Kurstext, nur nicht im Zielabschnitt – Lehre 5). **Kein Befund.**

### aus START_PROMPT.md, Zeilen 245-248 der Ur-Fassung

# ► **ALLE ETAPPEN SIND DURCH** (0–6, E3, I–VII, Q3 A–I) – Protokolle: `ETAPPE3_M0X_BEFUNDE.md`,
#   `E3_M0X_VERWEISE.md`, `BEFUNDE_*.md`, `PLAENE.md`. **Nicht nachprüfen, nicht neu anfangen.**
#   ⚠️ **M04-317 bleibt ein Fehlalarm** (DHCP-Option). ⛔ **„Lernunterlage ohne belegte Lücke
#   (34/34)" galt den VERWEISZIELEN, nicht dem Inhalt. Eine Messung gilt für das Gemessene.**

## ROTATION 2026-09-09 (4) – Etappe 3 und der poolweite Laengengriff

### aus START_PROMPT.md, Zeilen 147-149 der Ur-Fassung

# ► **ETAPPE 3 (M01, M02, M03, M07, M08) UND DER POOLWEITE LAENGENGRIFF SIND DURCH** – 599 Fragen
#   gelesen, 82 schwere Befunde; der Tell-Zaehler steht bei knapp 2 %. **Beides nicht nachpruefen
#   und nicht erneut aufmachen.** Zahlen und Verlauf: `ETAPPE3_M0X_BEFUNDE.md` + Archiv.

## ROTATION 2026-09-09 (5) – der M09-Tabu-Hinweis

### aus START_PROMPT.md, Zeilen 281-282 der Ur-Fassung

# ✅ **M09-TABU ERLEDIGT (04.08.)**, die Kategorie bleibt. ⚠️ `KLAUSUR_TERMIN` steht auf `null` –
#    **NICHT eigenmächtig setzen**, der Termin ist nicht bekannt.

## ROTATION 2026-09-10 - Kopf war auf 600 von 600 Zeilen (Hinweisgrenze erreicht)

### aus START_PROMPT.md, Zeilen 64-69 der Ur-Fassung

# ► **E3 (185 `verweis`-Ziele), DIE DOPPELTE FRAGE UND DIE M09-AUFLÖSUNG SIND DURCH** (24./25.08.,
#   04.08.) – Volltext im Archiv, Abschnitt „ROTATION 2026-09-09". **Was weiter gilt:**
#   `KLAUSUR_TERMIN` in `app_state.js` ist die EINZIGE Quelle des Termins (`null` = keine
#   Countdown-Zeile) · **wer M09 anfasst, ändert `tests/_m09fixture.js`, nicht die Suiten einzeln**
#   · ⚠️ **eine Frage kann redundant und trotzdem Bestand sein – vor jeder Löschung fragen „was
#   hängt daran".** ⚠️ „nur im Browser zu klären" war FALSCH: beides läuft in jsdom.

### aus START_PROMPT.md, Zeilen 74-77 der Ur-Fassung

# ✅ **TRENNSCHÄRFE-RUNDE DURCH (09.09.): 52 → 30 → 2.** Nicht nachprüfen. Zwei Lehren (`BUILD_LOG`
#   09.09.): ⚠️⚠️ **DIE KÜR IST DIE ZWEITE HÄLFTE DER SCHWELLE** (`allePflicht` ist EIN Weg zu
#   „richtig", `score>=0,65` der zweite) · ⚠️ **ein Pflichtbegriff wirkt über seinen STAMM**:
#   `Zeitbox`→`zeit` (`slice(0,max(4,len-3))`) – Mehrwort scharf, kurze Stämme stumpf.

### aus START_PROMPT.md, Zeilen 108-118 der Ur-Fassung

#   **SCHRITT 2: Q1–Q3 SIND DURCH; DIE EINE OFFENE ETAPPE IST W1 (Abschnitt 3).** ✅ Q2 (31.08.),
#      Q3 (07.09.), B106, M08-Stufung, N2 (02.09.) – Protokolle `BEFUNDE_*.md`, `PLAENE_ARCHIV.md`.
#      **Nicht neu anfangen, nicht nachpruefen.**
#      ⛔ **Der alte „eine Kandidat" – ein Waechter fuer den Widerspruch Lehrtext ↔ Pool – ist am
#      06./07.09. als G2 GEMESSEN UND VERWORFEN.** Nicht erneut vorschlagen (Archiv, BEFUNDE).
#      ⚠️ **A4 IST NICHT MEHR KNAPP** – hier stand bis 07.09. „noch rund 36 Nicht-A4-Fragen, dann
#      reisst `test_didaktik`". **Nachgerechnet ist der Puffer eine Groessenordnung groesser**;
#      der A4-Ausbau der Etappen D/F hat ihn erzeugt. ⛔ **Zahl NICHT hier** – erzeugter Block in
#      `SORTIERUNG_PRUEFUNGSORDNUNG.md`, nachrechnen mit `tools/gebiete_stand.py`.
#      ►► **Eine Warnschwelle, die niemand nachrechnet, wird zur Denksperre:** sie haette
#      Nicht-A4-Fragen verhindert, die laengst wieder unbedenklich sind.

### aus START_PROMPT.md, Zeilen 141-142 der Ur-Fassung

# ✅ **ZURÜCK-KNOPF IN M09 IST GEBAUT (30.07.).** Die sechs Sperren dürfen beim Blättern NICHT
#   fortgeschrieben werden – alle nur in `unterrichtZiehe()`. Einzelheiten: Archiv.

### aus START_PROMPT.md, Zeilen 147-148 der Ur-Fassung

# ► **ETAPPE 3 (M01–M03, M07, M08) UND DER POOLWEITE LAENGENGRIFF SIND DURCH** (599 Fragen,
#   82 Befunde, Tell-Zaehler knapp 2 %) – **nicht nachpruefen.** `ETAPPE3_M0X_BEFUNDE.md` + Archiv.

### aus START_PROMPT.md, Zeilen 223-232 der Ur-Fassung

# ⛔⛔ **DIESE SECHS SIND GEMESSEN – NICHT WIEDERHOLEN, NICHT ERNEUT VORSCHLAGEN:** **1.** die 96
#   `svg`-Fragen (07.09., `BEFUNDE_BILDFRAGEN.md` §3) · **2.** Katalog-Abdeckung und `--streng`
#   (07.09. erneut, dieselben drei Fehlalarm-Klassen) · **3.** der Wächter Lehrtext↔Pool (07.09.
#   verworfen, ~200 Ausnahmen nötig) · **4.** ein **Dubletten-Filter über Wortüberlappung** (09.09.
#   verworfen: 0 Befunde auf 4 Fehlalarme, 2 von 3 bekannten Dubletten nicht gefunden – **er misst
#   Vokabular, nicht Aussage**; das kann nur `gradeTeilpunkte`, und `test_freitext` tut es an allen
#   15006 Paaren) · **5.** **„A4 ist knapp"** (09.09. nachgerechnet: Puffer rund **350** Nicht-A4-
#   Fragen statt 26) · **6.** **der Stufe-4-Vorrat** (09.09.: Stufe 3 und 4 werden gleich oft
#   wiederholt, 4,1x/4,2x, Stufe 4 sogar besser ausgeschöpft – **kein Ausbau nötig**,
#   `BEFUNDE_LERNFLUSS.md` 4b).

### aus START_PROMPT.md, Zeilen 233-235 der Ur-Fassung

# ✅ **`lueckentext` AUSGEBAUT (09.09.): 6 → 12** – je eine Frage in AP1-Themen ohne JEDE frei
#   abrufende Aufgabe; **acht standen auf null (Messwert: Anteil frei abrufender Typen je Thema).**
#   ► **OFFEN, KEINE BEFUNDE:** dünnste Feinthemen (je 6: M04 WLAN & VPN, M04 GUI, M06 SbD) · M05.

### aus START_PROMPT.md, Zeilen 236-247 der Ur-Fassung

# ►►► **DIE FÜNF LEHREN DES 07.09. GELTEN WEITER – WORTLAUT UND HERLEITUNG: ARCHIV, „ROTATION
#   2026-09-09 (2)"; Rezepte und Zahlen: `BEFUNDE_LERNUNTERLAGE.md` (B136–B138).** Kurz:
#   **1.** Was ein Werkzeug nicht AUSDRUCKT, ist nicht geprüft – auch wenn es die Zahl nennt.
#   **2.** Wer Lehrtext zu einer Frage schreibt, schreibt ihn gegen die MUSTERLÖSUNG, nicht gegen
#   den Fragetext – kein Wächter prüft, ob der Abschnitt die Frage BEANTWORTET.
#   **3.** Wer einen fehlenden Begriff nachträgt, prüft die Nachbarn desselben Themas mit.
#   **4.** **Jeder neue Filter braucht Gegenproben mit bekannter Antwort VOR dem ersten Urteil**
#   (B138: ohne sie 152 statt 16 Lücken). Ein Kandidatenfilter ist nach dem Aufräumen nicht
#   verbraucht. **5.** „Der Begriff steht in einem anderen Abschnitt" ≠ „der Verweis ist falsch".
#   ⛔⛔ **Ein Wächter daraus ist am 07.09. gemessen und VERWORFEN** (192 Kandidaten, ~200
#   Ausnahmen nötig). **Nicht erneut vorschlagen.** ✅ **M08 hat ABSICHTLICH keine Kursdatei** –
#   seine 103 Verweise nennen Gesetzesstellen (24.08.). **Wer dort misst, misst einen Entscheid.**

### aus START_PROMPT.md, Zeilen 294-298 der Ur-Fassung

#   1. ✅ **SICHTPRÜFUNGEN ERLEDIGT (07.09.): ALLE 96 BILDFRAGEN GERENDERT UND ANGESEHEN** –
#      B132/B133 (v1.23.1) und B141–B144 (v1.23.3) behoben. Protokoll: `BEFUNDE_BILDFRAGEN.md`,
#      Abschnitt 3 nennt die geprüften IDs. ⛔⛔ **Alle vier SVG-Wächter waren dabei grün – sie
#      prüfen nie, ob das Bild die Frage BEANTWORTET.** ►► **WER EINE BILDFRAGE PRÜFT, RENDERT
#      SIE** (`python3 tools/svg_bilder.py --id <ID>`; ⚠️ ggf. `pip3 install cairosvg`).

### aus START_PROMPT.md, Zeilen 301-305 der Ur-Fassung

#   ► ✅ **NEU 25.08.: 37 FIRMENNAMEN AUF UMLAUTE GEZOGEN** (Entscheid 27.07.).
#      Messen: **`node tools/pool_query.js firmen`** (⚠️ liest `fragen.js`, NICHT `faelle.js`).
#      Setzen: **`python3 tools/firmen_umlaut_setzen.py --trocken|--setze`**. `check.sh` 4e3
#      meldet jeden Rückfall als FEHLER. ⚠️ **Ein blankes `/ue/` meldet 10 richtige Namen mit** –
#      die Ausnahmen stehen sichtbar im Werkzeug.

### aus START_PROMPT.md, Zeilen 316-319 der Ur-Fassung

# **NUTZER-ENTSCHEIDE VOM 27./28.07.2026 – NICHT ERNEUT VORTRAGEN.** Volltext im Archiv,
#   Abschnitt „Nutzer-Entscheide 27./28.07.2026". Kurz: Machbarkeits-Systematik bleibt ·
#   „IHK-Standard" = **DIN 69901** · Eisenhower im Feinthema Risiko & Stakeholder · Umlaute auch in
#   Firmennamen · Längengriff abgeschlossen · CI auf `@v6` · Positionsverweise als Inhaltszitat.

## ROTATION 2026-09-10 (2) - die Waechter-Faelle vom 27.07./04.09./06.09. verbatim, Regeln bleiben im Kopf

### aus START_PROMPT.md, Zeilen 412-437 der Ur-Fassung

# ⚠️ **DIE WÄCHTER SIND KLÜGER ALS ICH – SIE HABEN AM 27.07. FÜNFMAL RECHT BEHALTEN.** Wer beim
#   Schreiben neuer Fragen einen Wächter anschlagen sieht, verdächtigt NICHT zuerst den Wächter.
#   Alle Fälle waren echte Fehler von mir:
#   * **Gebiets-Prüfung (viermal!):** „Berechnungen: Daten & Übertragung", „Lizenzen &
#     Urheberrecht", „Netzwerkkomponenten & Medien", „Hardware-Komponenten" und „Netzplan & Puffer"
#     liegen NICHT dort, wo man sie vermutet. **Nie das Gebiet raten – `apply_batch.py` sagt es.**
#   * **`test_matrix` hat drei INHALTLICHE Wächter:** jedes Matrix-Element braucht eine konkrete
#     Zahl oder Häufigkeit, kein Beispielmotiv darf in mehr als 3 Matrix-Fragen vorkommen, und die
#     Kurzerklärung muss eine Zahl aus den Elementen aufgreifen. Alle drei zu Recht.
#   * **`schluesselbegriffe` ist ein OBJEKT** `{pflicht:[[...]], kuer:[...]}`, keine Liste – ging
#     durch acht Prüfklassen; `apply_batch.py` prüft seither als **neunte Klasse den Feldtyp.**
#   * **Klasse 9 prüft den ÄUSSEREN Feldtyp, nicht die innere Form** (04.09.). `pflicht` war
#     richtig eine Liste von Listen, enthielt aber `["Aggregation"]` – das Schema verlangt String
#     ODER Liste mit **mindestens zwei** Synonymen. Alle zehn Klassen grün, gemeldet erst von
#     `validate_schema`. ►► **Nach JEDEM Hand-Eingriff in eine Pool-Datei `validate_schema`.**
#   * ⛔ **`.assetsignore` SCHLIESST `*.json` NICHT AUS — EINE .json IM WURZELORDNER GEHT AN DEN
#     LERNER** (06.09.). `teilbegriffe.json`, eine reine Messnotiz, stand nach einem Commit in der
#     Auslieferung. Gefunden hat es der **Ungepusht-Guard** („wird ausgeliefert"), nicht ich.
#     ►► Arbeitsdateien gehören nach `tools/` (ignoriert), nie in den Wurzelordner. Und: **den
#     Ungepusht-Guard nach jedem Commit LESEN, nicht nur laufen lassen.**
#   * **Pool-Datei von Hand geändert → so zurückschreiben, wie `apply_batch` schreibt:**
#     `json.dump(..., ensure_ascii=False, indent=2)` + `sort(key=id)` + Schluss-Newline. Mit
#     `indent=1` wurden aus einer Feldkorrektur 12485 geänderte Zeilen; die eine echte Änderung
#     ist dann nicht mehr auffindbar. Gegenprobe: `git show HEAD:<datei>` und Fragen vergleichen.
#   * **Der Abkürzungs-Wächter liest NUR `f.frage`.** Zwei Wege: ins Lexikon (Nutzer-Entscheid
#     nötig!) oder im Fragetext ausschreiben – Spaltenköpfe liest er nicht.

## ROTATION 2026-09-10 (3) - Herleitungen aus Abschnitt 3 und 6, Regeln bleiben im Kopf

### aus START_PROMPT.md, Zeilen 242-244 der Ur-Fassung

#   ⚠️ **M04-317 bleibt ein Fehlalarm** (DHCP-Option). ⛔ **„Lernunterlage ohne belegte Lücke
#   (34/34)" galt den VERWEISZIELEN, nicht dem Inhalt. Eine Messung gilt für das Gemessene** –
#   am 09.09. zum zweiten Mal belegt: „0 Wiederholungen" galt der SITZUNG, nicht den Wochen.

### aus START_PROMPT.md, Zeilen 255-258 der Ur-Fassung

#   ✅ **Startlast ohne Gerät gemessen** – **drei Viertel sind `fragen.js`; die Poolgröße kostet
#      Übertragung, keine Rechenzeit.** ⛔ Zahl NICHT hier (BUILD_LOG 07.09.), **der Gerätewert
#      bleibt offen und wird NICHT nachgefragt** (Entscheid 27.07.). ✅ **GEBIETSVERTEILUNG: NICHT
#      MEHR HIER** – `tools/gebiete_stand.py`, Block in `SORTIERUNG_PRUEFUNGSORDNUNG.md`, 4e2b3.

### aus START_PROMPT.md, Zeilen 396-398 der Ur-Fassung

# ⚠️⚠️ **EIN WERKZEUG, DAS AM ERSTEN TAG GEBAUT WIRD, IST AM ERSTEN TAG NOCH NICHT GEPRÜFT.**
#   `pool_query.js verweise` las „WCAG 2.1" als Abschnitt 2.1 – **neun richtige Verweise wären
#   „repariert" worden.** **Ein neues Messwerkzeug erst an einem Fall prüfen, dessen Antwort man kennt.**

### aus START_PROMPT.md, Zeilen 402-407 der Ur-Fassung

# ⚠️ **EINE VERSIONSANGABE IN DER DOKU IST EIN MESSWERT VON DAMALS, KEIN ZUSTAND.** Der notierte
#   Sprung „`@v4` → `@v5`" war beim Ausführen selbst schon eine Generation zurück. **Vor dem
#   Umsetzen eines notierten Versionssprungs die Release-Seite aufrufen** – `WebSearch`/`WebFetch`.
# ⚠️ **EIN REPORT, DESSEN URTEIL MAN SUCHEN MUSS, IST EIN HALBER REPORT.** `ci2.sh` zeigte den
#   neuesten Lauf ÜBERHAUPT – einen grünen Bot-Lauf auf einem PR-Branch, während main rot war.
#   **„Der letzte Lauf" ist nicht „der Lauf meines Pushes".**

## ROTATION 2026-09-10 (4) - Hinweisgrenze erreicht, drei erledigte Bloecke verdichtet

### aus START_PROMPT.md, Zeilen 73-75 der Ur-Fassung

# ✅ **TRENNSCHÄRFE-RUNDE DURCH (09.09.): 52 → 30 → 2.** Nicht nachprüfen. Zwei Lehren (Archiv,
#   `BUILD_LOG` 09.09.): **die Kür ist die zweite Hälfte der Schwelle** · **ein Pflichtbegriff wirkt
#   über seinen STAMM** (`Zeitbox`→`zeit`) – Mehrwort scharf, kurze Stämme stumpf.

### aus START_PROMPT.md, Zeilen 238-239 der Ur-Fassung

# ✅ **`lueckentext` AUSGEBAUT (09.09.): 6 → 12** – acht AP1-Themen standen auf null frei
#   abrufenden Aufgaben. **Nicht nachprüfen.**

### aus START_PROMPT.md, Zeilen 293-296 der Ur-Fassung

#   1. ✅ **SICHTPRÜFUNGEN ERLEDIGT (07.09.): ALLE 96 BILDFRAGEN GERENDERT UND ANGESEHEN**
#      (`BEFUNDE_BILDFRAGEN.md` §3). ⛔⛔ **Alle vier SVG-Wächter waren dabei grün – sie prüfen nie,
#      ob das Bild die Frage BEANTWORTET.** ►► **WER EINE BILDFRAGE PRÜFT, RENDERT SIE**
#      (`python3 tools/svg_bilder.py --id <ID>`; ⚠️ ggf. `pip3 install cairosvg`).

## ROTATION 2026-09-10 (5) - zwei Rezepte verdichtet, Herleitung ins Archiv

### aus START_PROMPT.md, Zeilen 269-272 der Ur-Fassung

#   ⚠️ **KORREKTURSKRIPTE: NIE über `json.load`/`json.dump`** – das formatiert die Pool-Datei um.
#      **Rezept:** Block von `"id": "M0X-NNN"` bis zur nächsten ID abgrenzen (Pflicht!), alten Wert
#      suchen, auf **genau eine** Fundstelle prüfen, ersetzen, `json.loads` als Syntaxprobe VOR dem
#      Schreiben, vorher `cp -r pool /tmp/…`. ⚠️ **Die Syntaxprobe ist keine Formalität** (30.07.).

### aus START_PROMPT.md, Zeilen 273-276 der Ur-Fassung

#   ⚠️ **ZEICHEN-NORMALISIERUNG PER REGEX IST ERST FERTIG, WENN DER DIFF SIE BESTÄTIGT** – „Ziffer
#      x Ziffer → ד traf `5.000 x 0,88`, nicht `Listenpreis x (1 − Rabatt)`: × und x nebeneinander.
#      ⛔ **In `rechenassistent`-Fragen ist das Minus INNERHALB von `{…}` FORMELSYNTAX**
#      (`{1-rabatt/100|2}`) und darf nie ersetzt werden. `test_rechner` fängt das.

## ROTATION 2026-09-27 (N35a) - Bloecke zur alten App und veraltete Suitenliste

### aus START_PROMPT.md, Zeilen 26-37 der Ur-Fassung

# ► **DIE SCHNELLE SCHLEIFE: ERST DIE BETROFFENE PRÜFUNG, DER VOLLE ZYKLUS ERST VOR DEM COMMIT.**
#   ►►► **Eine Einzelsuite kostet 1,7 s, ein voller Zyklus vier Aufrufe und gut eine Minute.**
#   ⛔ **`node tests/test_X.js` SCHEITERT** (flaches Verzeichnis nötig) – richtig ist **`bash
#      tools/suite.sh <name>`**. Messung, die das ausgelöst hat: Archiv 03.09.
#   **WAS ANGEFASST → WAS ZUERST FAHREN (jeweils unter 2 s):** Fachbegriff/Stichwort →
#     `suite.sh wirtschaft unterricht abk` · Freitext/Schlüsselbegriffe → `suite.sh freitext
#     toleranz teilpunkte` · Struktur, IDs, Themen, Typen → `suite.sh meta logik themenauswahl` ·
#     Bild/SVG → `suite.sh render_smoke a11y` · Längen → `suite.sh didaktik` · Dateiliste/Version
#     → `suite.sh pwa`. ⚠️ **Die vier Pool-Wächter aus `check.sh` sind KEINE Suiten**, haben aber
#     eigene Proben: `node tools/pool_query.js zitate|zufall|verweise|firmen|begriffe|abdeckung|verrat`.
#   ⚠️ **Grün heißt nur „diese Prüfung ist zufrieden"** – „der Lauf ist grün" sagt allein
#      `bash check.sh block ende`, Pflicht vor jedem Commit (Arbeitsregel 6).

### aus START_PROMPT.md, Zeilen 68-72 der Ur-Fassung

# ► **E3 (185 `verweis`-Ziele), DIE DOPPELTE FRAGE UND DIE M09-AUFLÖSUNG SIND DURCH** (24./25.08.,
#   04.08.) – Volltext im Archiv. **Was weiter gilt:** `KLAUSUR_TERMIN` in `referenz/app_state.js` ist die
#   EINZIGE Quelle des Termins (`null` = keine Countdown-Zeile) · **wer M09 anfasst, ändert
#   `tests/_m09fixture.js`, nicht die Suiten einzeln** · ⚠️ **eine Frage kann redundant und trotzdem
#   Bestand sein – vor jeder Löschung fragen „was hängt daran".**

### aus START_PROMPT.md, Zeilen 110-110 der Ur-Fassung

# ►►► **ZWEITER STRANG SEIT 11.09.: DER NEUBAU `neu/` (React+TS) – `SCHIENE_NEU.md`, Plan+Entscheide `PLAN_NEUBAU.md`.** **N25 (shadcn) läuft in Teilschritten P0–P7; WIE jeder gebaut, geprüft und ausgeliefert wird, steht in der ARBEITSANLEITUNG unter N25 in `PLAN_NEUBAU.md`.** Ziel seit 16.09.: er soll die alte App abloesen. Die zwei Standzeilen oben gelten der ALTEN App. **Der nächste Griff im Neubau steht NUR in der Schlusszeile „Damit offen" des letzten BUILD_LOG-Eintrags.**

### aus START_PROMPT.md, Zeilen 156-157 der Ur-Fassung

# ✅ **ZURÜCK-KNOPF IN M09 IST GEBAUT (30.07.).** Die sechs Sperren nur in `unterrichtZiehe()`,
#   beim Blättern NICHT fortschreiben. Einzelheiten: Archiv.

### aus START_PROMPT.md, Zeilen 245-245 der Ur-Fassung

# ✅ **M09-TABU ERLEDIGT (04.08.)**, die Kategorie bleibt. ⚠️ `KLAUSUR_TERMIN` steht auf `null` – **NICHT eigenmächtig setzen**.

### aus START_PROMPT.md, Zeilen 250-251 der Ur-Fassung

#   ⛔ **FORTSCHRITT-EXPORT/IMPORT WIRD NICHT WEITERVERFOLGT** (Nutzer-Entscheid 27.08.: „das
#      feature wird nicht weiterverfolgt"). **Nicht erneut vortragen, auch nicht als „wäre schnell".**

### aus START_PROMPT.md, Zeilen 255-257 der Ur-Fassung

#   ► **ALLE ENTSCHEIDE VOM 04./24./25.08. SIND GEFALLEN UND UMGESETZT** (Volltext im Archiv).
#      **Nicht erneut vortragen.** ⚠️ **Offen davon nur der Wiedereintritt** – erst messen, wie oft
#      `gotoSeite("unterricht")` real vorkommt. ⛔ Hängt am Gerät. Kein Freibrief zu vergessen.
