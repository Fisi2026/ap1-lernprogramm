# Fortsetzungs-Prompt (in neuen Chat kopieren) – FISI-2026-Lern-App
#
# ⚠️ **DIESE DATEI HAT EINE FESTE STRUKTUR. SIE WIRD ÜBERSCHRIEBEN, NICHT ERGÄNZT.**
# Bis zum 27.07.2026 wuchs der Kopf durch Anhängen, bis der Stand aus `git log` rekonstruiert
# werden musste – aus genau der Datei, die ihn nennen soll. **Wer hier etwas ändert, ändert den
# betroffenen Abschnitt und lässt die Struktur stehen.** Chronik → `START_PROMPT_ARCHIV.md`.
#
# ============
# 1) ZUERST MESSEN, DANN GLAUBEN
# ============
# ►►► **SEIT 22.09.2026 GENUEGT EIN AUFRUF: `bash tools/start.sh --neuer-chat <konto>`** - er
#   faehrt die drei Befehle unten UND misst Push-Stand, CI-URTEIL und Wache. ⚠️ Fuer WERKZEUG-
#   und NEUBAU-Arbeit reicht danach **`EINSTIEG.md`** (~3 KB, erzeugt) statt dieser Datei; wer
#   Pool, Frage, Verweis oder Lehrtext anfasst, liest hier UND die Themendatei aus Abschnitt 6 ganz
#   (seit N49 W1, 11.10.2026: `regeln/*.md` statt START_PROMPT + LEHREN am Stück).
# ► **JEDER CHAT BEGINNT MIT DIESEN DREI BEFEHLEN, VOR JEDER INHALTLICHEN ENTSCHEIDUNG:**
#       `bash tools/umgebung.sh`      (Umgebung: npm, gh, Mount, git-Lock, oberster Commit)
#       `git status --porcelain`      (was liegt wirklich im Baum?)
#       `bash tools/suite.sh --waermen`  (einmalig ~45 s – danach kostet JEDE Einzelsuite ~2 s)
# ⛔⛔ **NUR EIN CHAT JE ARBEITSBAUM – BELEGT AM 07.09.** Zwei Sitzungen liefen gleichzeitig auf
#   demselben Mount. Der Commit `916d64d` („34 rote Suiten…") hat die noch nicht committeten
#   Änderungen der ANDEREN Sitzung an `tools/prueflauf.sh` und `START_PROMPT.md` **mit
#   eingesammelt und unter seiner Botschaft abgelegt.** Verloren ging nichts – aber `git add`
#   sieht den Baum, nicht den Urheber. ►► **VOR JEDEM COMMIT `git log --oneline -3` LESEN: steht
#   dort ein Commit, den DIESER Chat nicht geschrieben hat, arbeitet ein zweiter mit.** Dann nur
#   die eigenen Pfade adden, nie `-a`, und den Nutzer bitten, den anderen Chat zu schließen.
# ► **DIE SCHNELLE SCHLEIFE: ERST DIE BETROFFENE PRÜFUNG, DER VOLLE ZYKLUS ERST VOR DEM COMMIT.**
#   ⛔ **`node tests/test_X.js` SCHEITERT** (flaches Verzeichnis nötig) – richtig ist **`bash
#      tools/suite.sh <name>`**. Messung, die das ausgelöst hat: Archiv 03.09.
#   **WAS ANGEFASST → WAS ZUERST FAHREN (Stand N34 T6c: 7 Suiten, Rechenkern in `neu/src/kern`):**
#     Fachbegriff/Stichwort → `suite.sh wirtschaft` · Freitext/Schlüsselbegriffe → `suite.sh freitext` ·
#     Längen, Kürzel im Fragetext → `suite.sh didaktik` · Bewertung, Typen, Lernen, Rechnen →
#     `bash check.sh schnell` (vitest `neu/src/kern`) · Bild/SVG → `node tools/pool_query.js svg` + rendern.
#     ⚠️ **Die Pool-Wächter aus `check.sh` sind KEINE Suiten**, haben aber eigene Proben:
#     `node tools/pool_query.js zitate|zufall|verweise|firmen|begriffe|abdeckung|verrat`.
#   ⚠️ **Grün heißt nur „diese Prüfung ist zufrieden"** – „der Lauf ist grün" sagt allein
#      `bash check.sh` (voll), Pflicht vor jedem Commit (Arbeitsregel 6).
# ► **ZWEI SPARREGELN (Messung 26./27.08., Archiv 03.09.):** **(1) SECHS BIS ACHT FRAGEN JE
#   `pool_query frage`-AUFRUF** – acht Datensätze passen in ein Ausgabefenster. **(2) BERICHTE ALS
#   LISTE, NICHT ALS AUFSATZ** (Nutzer-Entscheid 27.08.): Befunde vollständig ins `BEFUNDE_*.md`,
#   **in den Chat nur Befund, Fehlerklasse und Entscheidungsbedarf – nicht die Herleitung.**
#
# ⚠️ **NUTZER-ANWEISUNG 28.07.2026: IMMER FRAGEN, OB EIN WERKZEUG DAS KANN — NIE ANNEHMEN,
#   ES GINGE NICHT** (Anlass und Nachschärfung: Archiv 03.09.). **`WebSearch`/`WebFetch` waren die
#   ganze Zeit da; „npm-Registry nicht erreichbar" gilt für npm, nicht für das Web.**
#   **Das heißt konkret, in dieser Reihenfolge:**
#     1. **Die Werkzeugliste ist die Wahrheit, nicht die Erinnerung.** Was am Anfang des Chats
#        verfügbar ist, kann sich ändern; freigegebene Werkzeuge kommen dazu.
#     2. **Erst nachsehen, ob ein Werkzeug es kann – dann erst fragen oder auslagern.**
#        Auch bei Aufgaben, die nach „geht in der Sandbox nicht" klingen.
#     3. **Wenn ein Werkzeug fehlt: benennen, welches gebraucht würde**, statt die Aufgabe als
#        unmöglich abzuräumen. Der Nutzer kann es freigeben – er kann es nur nicht raten.
#     4. **Was der Nutzer freigegeben hat, wird ab dann auch benutzt** – nicht einmal probiert
#        und dann wieder vergessen. `WebSearch` gehört seit dem 28.07. zum Standardrepertoire
#        für jede Gesetzes-, Norm- oder Faktenprüfung im Pool.
#   ⛔ **AUSNAHMEN, DIE KEIN WERKZEUG AUFHEBT:** Push nur über die Training Shell, nie `--force` ·
#   Verifikation nie an einen Agenten · ein CI-Status nur aus der URTEIL-Zeile von `ci2.sh`.
#
# ⚠️ **UMGEBUNGS-ANNAHMEN SIND VERDERBLICHE WARE.** Der teuerste Fehler des 27.07. war eine
#   geglaubte Doku-Aussage („npm 403") – `tools/umgebung.sh` misst sie nach. Volltext: Archiv 03.09.
# ⚠️ **DER ARBEITSBAUM IST DIE WAHRHEIT** – am 27.07. stand hier „Arbeitsbaum sauber", während 17
#   geänderte Dateien im Baum lagen. **Der Satz stimmte, als er geschrieben wurde** – wie „A4 ist
#   knapp" (09.09. widerlegt) und ein Werkzeug-Kommentar, der nach EINER Stunde falsch war.
#
# ============
# 2) STAND
# ============
#
# ══ DER STAND STEHT IN GENAU DIESEN ZWEI ZEILEN – NIRGENDWO SONST IN DIESER DATEI. ══
# **APP_VERSION 2.13.2 · app-sw ap1-app-2.13.2 · Pool 1487 Fragen + 9 Fälle · 7 von 7 Suiten GRÜN**
# **LIVE beim Lerner: v2.13.2 · committet auf main: v2.13.2 · PUSH DURCH**
# ►►► **TRAINING SHELL, `device_bash`, 60-s- und 8190-Zeichen-Deckel, Verknüpfung je Chat:** `regeln/bruecke.md`.
#   ►► https://ap1-lernprogramm.fisi2026lernapp.workers.dev · Stand-Guard, Tag als Live-Beleg, Bump-Regel: `regeln/git.md`.
# ►►► **DER NEUBAU `neu/` (React+TS) IST DIE APP** (seit N29, 24.09.; gerechnet wird seit N34 in `neu/src/kern`) – `SCHIENE_NEU.md`, Plan+Entscheide `PLAN_NEUBAU.md`; WIE gebaut, geprüft und ausgeliefert wird: ARBEITSANLEITUNG unter N25 in `PLAN_NEUBAU.md`. Die zwei Standzeilen oben gelten IHM; die alte App liegt nur als Referenz in `referenz/`. **Der nächste Griff steht NUR in der Schlusszeile „Damit offen" des letzten BUILD_LOG-Eintrags.**
# ►►► **ÜBERGABE: SCHRITT 1 IST DER PUSH-STAND** – Rezept, Belege und Verbote in `regeln/git.md`. Pool-Stand: `regeln/pool.md`.
#
# ► **ZWEI EXTERNE MASSSTÄBE (Prüfungskatalog vor Lehrbuch, Nenner benennen) → `regeln/pool.md`.**
#
# ============
# 3) NÄCHSTER GRIFF
# ============
# ►► Steht NUR in der Schlusszeile „Damit offen“ des letzten `BUILD_LOG.md`-Eintrags; die Reihenfolge der Etappen in
#    `PLAN_NEUBAU.md` „Reihenfolge ab 11.10.“. Was gemessen, verworfen oder durch ist (NICHT erneut vorschlagen): `regeln/pool.md`.
# ============
# 4) OFFEN BEIM NUTZER
# ============
#   ⛔ **HANDY-TEST NIE WIEDER ANBIETEN ODER NACHFRAGEN** (Nutzer-Entscheid 27.07.2026, wörtlich:
#      „handy test in zukunft nicht mehr nachfragen. ich mache das seperat"). **Erledigt – nicht
#      weil getestet, sondern weil der Nutzer ihn selbst führt.** Auch nicht als „falls du magst".
#   ► Alle übrigen Nutzer-Entscheide (Bildfragen, Firmennamen, Lehrbuchrechte, kein `buchbeleg`, DIN 69901 …): `regeln/pool.md` – NICHT erneut vortragen.

# ============
# 5) ARBEITSREGELN – NICHT VERHANDELBAR
# ============
#   1. **RÜCKFRAGE-PFLICHT (AskUserQuestion):** Bei jeder Design-/Umfangs-/Formulierungs-Entscheidung
#      mit mehreren sinnvollen Optionen ZUERST fragen – ebenso bei jedem Widerspruch zwischen Doku
#      und Code. **Fragen bündeln, bis vier pro Runde.** Nie eigenmächtig, nie still vom Plan abweichen.
#      Vor jedem Task erst im Code/Pool nachsehen, was schon existiert.
#      ⛔⛔ **JEDE EMPFEHLUNG IST GEMESSEN** (Nutzer-Entscheid 10.10.2026): auch jedes „(Empfohlen)"
#      nennt den Befehl oder die Datei, auf der es steht; Ungemessenes wird VOR der Frage gemessen.
#      ⛔⛔ **UND NIE STILL AUF DEN SCHLECHTEREN WEG AUSWEICHEN** (Nutzer-Entscheid
#      18.09.2026, woertlich: „nicht den schlechteren weg automatisch nehmen sondern erst
#      nachfragen“). Ist der beste Weg versperrt, wird das GEMESSEN belegt, die Alternativen
#      werden mit ihrem PREIS vorgelegt - und dann wird gefragt. **Ein Ausweichen, das der
#      Nutzer nicht gewaehlt hat, sieht aus wie eine Loesung und ist eine Entscheidung.**
#   2. **PUSH MACHT DER CHAT SELBST** (Nutzer-Entscheid 17.09.2026): erst wenn `check.sh` GRÜN ist,
#      über die Training Shell `git push origin main`, danach CI, Tag und Live-Seite MESSEN (Abschnitt 2,
#      Schritt 1). ⛔ **Nie `--force`**, nie mit rotem Lauf. **Einen Version-Bump (Release) weiter
#      vorher erfragen.** ⚠️ **PUSH-TAKT (gemessen 22.09.): EIN Push je Chat genuegt, solange nur
#      Werkzeuge, Tests und Doku committet sind** (`ungepusht.py` sagt es: `v2/`, Worker, Konfig zählen).
#      ⛔ **Standzeile VORAB auf „LIVE = committet · PUSH DURCH"** (N51 A4, `tools/standzeile.py vorab`,
#      `release.sh` setzt sie so); ein Commit mit Wirkung wird SOFORT gepusht – scheitert der Push, setzt
#      `tools/gitc.sh` per Folge-Commit 'PUSH OFFEN' (4e2b2 bleibt der Riegel). Auf die CI wartet
#      `tools/ci_warte.sh` im Hintergrund; das URTEIL liest sonst der naechste Chat beim Start.
#      ⛔ **Ein `push.sh` gibt es bewusst nicht mehr** (legte `.git_broken_old` an).
#   3. **Pool NUR in `pool/*.json`; gelesen wird er NUR über `tools/pool_laden.js`** (E40 – `fragen.js`/
#      `faelle.js`/`build_fragen.py` gibt es nicht mehr). Nach jeder Änderung: `pool_laden.js --pruefe` + betroffene Suiten auf Sollwert
#      (`sollwerte.env` ist Single Source). **Jeden neuen Test GEGENPROBEN.**
#   4. **Verifikation ist NIE Agentensache** – Suiten selbst fahren, jeden Diff lesen, Zahlen selbst
#      nachrechnen. Keine Bedeutungsänderung an Inhalten ohne Beleg.
#      Ein Gegenpruef-Agent darf Luecken FINDEN (TASKLIST 0, Nutzer-Entscheid 08.10.2026) – jeder
#      Fund wird selbst nachgemessen, erst dann zaehlt er.
#   5. Loop je Task: umsetzen → selbst prüfen → **BUILD_LOG + DIESE Datei + das jeweilige
#      Protokoll (`BEFUNDE_*`, `E3_*`)** aktualisieren – **TASKLIST/PLAENE nur, wenn sich eine
#      Regel oder ein Plan wirklich ändert** (bis 27.08. verlangte die Regel beides je Task; die
#      Dateien wurden trotzdem wochenlang nicht angefasst, und nichts hat es gemerkt) →
#      bei Feature-Meilenstein Version-Bump/CHANGELOG → **PAUSIEREN**. Aufgabenliste nutzen.
#   6. **PRÜFLAUF: DER WEG WIRD JE SITZUNG GEMESSEN, NICHT GEGLAUBT** (Nutzer-Entscheid 07.09.).
#      ►► Über die Erweiterung läuft `bash check.sh` am Stück – **im Hintergrund, wegen der
#      60-s-Deckelung der Brücke (Abschnitt 2).** `tools/prueflauf.sh` misst den Weg, `check.sh
#      block start → weiter → ende` bleibt der Ausweichweg. ⛔ **KEINE SEKUNDENZAHL HIERHER.**
#      Bis 07.09. stand hier „passt NICHT in die 45 s der Sandbox" – **das Limit gab es längst
#      nicht mehr**: verderbliche Ware wie die npm-403. (Zahlen: `BUILD_LOG`.)
#      ⚠️ **`check.sh` prüft seit 25.08. auch die VERWEIS-ZIELE.** Die `0X_*.md` sind von keiner
#      Suite abgedeckt; das ist ihr einziges Sicherungsnetz. **Nichts davon nachbauen.**
#      Für die schnelle Schleife zwischendurch: **`bash tools/suite.sh <name> [name ...]`**.
#      **Nur `*.md`/`tools/plugin/` geaendert: `bash check.sh doku` genuegt** (Pfad-Tor, Nutzer-Entscheid 08.10.).
#   ⚠️⚠️ **NICHT DIE RECHENZEIT SPAREN, SONDERN DIE AUFRUFE.** Gemessen 07.09.: **jeder
#      Verbindungsaufruf kostet rund vier Sekunden Leerlauf**, während **alle Werkzeuge unter
#      zwei Sekunden** brauchen (Tabelle: BUILD_LOG 07.09.). ►► **Messungen bündeln**, und der
#      Chat-Start aus Abschnitt 1 ist **EIN Aufruf für drei Befehle, nicht drei.**
#   7. **`bash ci2.sh` läuft über die Training Shell** (`gh` gibt es nur auf Windows). Rückgabewert
#      0/1 je nach letztem Lauf auf **Branch main**, 5 = läuft noch. **Maßgeblich ist die URTEIL-Zeile.**
#
# ============
# 6) LEHREN, DIE TEUER WAREN – VOR JEDEM ÄHNLICHEN GRIFF LESEN
# ============
# ⛔⛔ **DIE LEHREN STEHEN VERBATIM IN DEN THEMENDATEIEN `regeln/*.md`** (17.09.2026 nach `LEHREN.md`,
#   11.10.2026 nach Thema aufgeteilt – N49 W1, Nutzer-Entscheid; `LEHREN.md` ist nur noch das Verzeichnis).
#   Sie gelten unverändert – sie werden nur nicht mehr in JEDEM Chat gelesen, sondern **vor dem
#   Griff, den sie betreffen.** Diese Tabelle ist die Pflicht (`check.sh` 4g prüft: jede Datei existiert,
#   jede `regeln/*.md` steht hier, dieser Kern bleibt unter 200 Zeilen):
#   PFLICHT: Pool-Datei, Frage, Verweis, Lehrtext oder Spickzettel anfassen → `regeln/pool.md` + `regeln/messen.md`
#   PFLICHT: einen Wächter, eine Prüfung, eine Gegenprobe oder ein Messwerkzeug bauen/ändern → `regeln/messen.md`
#   PFLICHT: eine Kennzahl, Quote oder Mengenaussage melden → `regeln/messen.md`
#   PFLICHT: ein Python-Skript, das Projektdateien schreibt → `regeln/bruecke.md`
#   PFLICHT: mehr als einen Einzeiler über die Brücke schicken, Rechner- oder Kontowechsel → `regeln/bruecke.md`
#   PFLICHT: committen, pushen, Release, Aussage über den Stand beim Lerner → `regeln/git.md`
#   PFLICHT: eine Steuer- oder Protokolldatei suchen → `regeln/dateien.md`
#   PFLICHT: einen Nutzer-Entscheid festhalten (ab E072 je eine Datei) → `entscheide/README.md`
#   PFLICHT: ein Mess- oder Hilfsskript schreiben wollen → `WERKZEUGE.md` (es gibt es meist schon)
#   PFLICHT: am Neubau `neu/` arbeiten → `SCHIENE_NEU.md` und `PLAN_NEUBAU.md`
#   PFLICHT: Agenten einsetzen → Skill `fisi:agenten-orchestrierung`; Ausgaben kürzen, Tooling-Fallstricke → `TASKLIST.md`
#   PFLICHT: eine Inhaltsrunde (Katalog-Luecken) planen oder fahren → `docs/plaene/PLAN_INHALT.md`
#   ⚠️ **Im Zweifel lesen.** Eine Lehre, die man nicht gelesen hat, wird wiederholt – belegt fünfmal.
#
# ============
# 7) WO STEHT WAS
# ============
#   ►► Die Dateiliste steht in `regeln/dateien.md` – die EINZIGE Liste.
# ============
# 8) WERKZEUGE, DIE MAN SONST NACHBAUT
# ============
# ⛔ **DIE WERKZEUGLISTE STEHT VERBATIM IN `WERKZEUGE.md`** (ausgelagert 17.09.2026). **Vor jedem neuen
#   Mess- oder Hilfsskript dort nachsehen.** Die fünf, die jeder Chat braucht:
#   `bash tools/suite.sh <name>` (Einzelsuite) · `bash check.sh` (voller Lauf, im Hintergrund) ·
#   `bash tools/gitc.sh <git-args>` (git ohne Sperren) · `node tools/pool_query.js` (ohne Argument =
#   Kommandoverzeichnis) · `python3 tools/rotiere.py <spec>` (Steuerdatei rotieren, Gegenprobe drin).
