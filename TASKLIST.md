# TASKLIST – AP1-Lernprogramm: ARBEITSREGELN UND WERKZEUGE
#
# ⚠️⚠️ **DIESE DATEI ENTHÄLT REGELN, KEINEN STATUS.** Wer wissen will, wo das Projekt steht, liest
# `START_PROMPT.md` und misst mit `git status`. Bis zum 27.07.2026 stand hier beides gemischt: der
# Kopf trug den Stand vom 20.07., darin **sieben** Behauptungen „NICHT GEPUSHT" über Versionen, die
# längst live waren, dazu „APP_VERSION 0.14.0" als Statusaussage.
# ⚠️ **SCHLIMMER: Regel 9 der Token-Sparregeln lautete „KEIN git im Projektordner … Versionierung
# stattdessen: Backup-Zip je Meilenstein".** Das galt im Juli 2026 für wenige Tage und ist seit
# v0.8.0 falsch – es wird committet, gepusht und getaggt. Eine Sitzung, die das glaubt, arbeitet
# grundlegend verkehrt. **Genau deshalb sind Status und Regeln jetzt getrennt.**
# Chronik (Blöcke A–F, „29 Ideen", G1–G5, FB-R1/R2/R3, M09-Projekt): **`TASKLIST_ARCHIV.md`**.
#
# ══════════════════════════════════════════════════════════════════════════════════════════════
# 0. MODELL & AGENTEN – REGELN IM SKILL, HIER NUR DIE PROJEKTBELEGE (entdoppelt 26.11.2026, BUILD_LOG 298)
# ══════════════════════════════════════════════════════════════════════════════════════════════
# ►► DIE REGELN (wann ein Agent, welcher Agent/welches Modell, Vorrang, Effort, Preise, Auftrag, Rechte, Pruefung)
#   stehen an EINER Stelle: Skill `fisi:agenten-orchestrierung` (Quelle `tools/plugin/fisi/skills/agenten-orchestrierung/
#   SKILL.md`). Feste Projekt-Agenten: `.claude/agents/{recherche,Explore,entwurf,pruefer}.md`. Hier nur datierte Belege.
# - 08.10.: EIN Haiku-Agent mit 2 Werkzeugaufrufen = 83 534 Tokens Grundlast; der Haiku-Agent (general-purpose) hatte
#   `Training_Shell__run` und `device_bash`, also Schreib- und Git-Zugriff auf den PC (Grund fuer feste Agenten mit `tools`).
# - 14.10.: Sonnet-Agent fuer 108 Stellen ≈ 130 000 Tokens; Doku: Agenten duerfen seit v2.1.219 selbst Agenten starten (Tiefe 3).
# - 08.10. Nutzer-Entscheid (START_PROMPT Regel 4): Agent-Ergebnis ist Entwurf, nie Beleg; Gegenpruef-Agent erlaubt.
# - 14.10. Nutzer-Entscheid (BUILD_LOG 174/175): ab 80 % Wochenlimit vor jedem Agenten fragen.
# - 26.11. (BUILD_LOG 297): feste Projekt-Agenten statt `general-purpose` + `model`; Explore ersetzt, sonst erbt er das Hauptmodell.
# - 26.11. (BUILD_LOG 298): Tiefensperre `env.CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1` in `.claude/settings.json` – Probe in
#   frisch gestarteter Sitzung: Haiku-Agent startet, meldet kein `Agent`-Werkzeug (57 112 Tokens, 0 Aufrufe). Gegenprobe der
#   Vorsitzung ohne Sperre beim Start: Werkzeug da. ►► „Keine weiteren Agenten“ ist damit deterministisch; `env` wirkt erst
#   beim Sitzungsstart.
# - 26.11. (BUILD_LOG 298) Advisor: `claude -p --model sonnet --advisor opus` nimmt das Flag an, scheitert aber an
#   „OAuth session expired“ der PATH-CLI 2.1.303 – Verfuegbarkeit im Abo nur per `/advisor` in der App messbar (Nutzer tippt).
#   Doku: experimentell, Abo zaehlt aufs Planlimit, API zu den Raten des Beratermodells.
#
# ══════════════════════════
# 0b. VERFAHRENSLEHREN AUS DEM 28.07.2026 → `regeln/messen.md` (verbatim verschoben 27.11.2026, BUILD_LOG 309)
# ══════════════════════════
# ⛔ Vor jedem Waechter, jeder Pruefung, Gegenprobe und Kennzahl dort lesen (START_PROMPT Pflichttabelle).
#
# ══════════════════════════════════════════════════════════════════════════════════════════════
# 1. LOOP JE TASK
# ══════════════════════════════════════════════════════════════════════════════════════════════
#   umsetzen → **selbst** prüfen → BUILD_LOG + START_PROMPT + (bei Planänderung) PLAENE nachziehen
#   → bei Feature-Meilenstein APP_VERSION-Bump + CHANGELOG → **PAUSIEREN**.
# - NICHTS ungeprüft übernehmen: jeden Agenten-Entwurf fachlich prüfen (nachrechnen, Zitate checken,
#   Diff lesen) und alle Tests SELBST ausführen, bevor ein Task als fertig gilt.
# - ⚠️ **PUSH NUR NACH GRÜNEM `check.sh`, ÜBER DIE TRAINING SHELL, NIE `--force`** (seit 17.09. pusht der
#   Chat selbst – Regel: START_PROMPT Abschnitt 5). ⛔ **Ein `push.sh` gibt es seit dem 10.09. bewusst nicht mehr.**
# - Ein Version-Bump fasst DREI Stellen an: `app_state.js APP_VERSION`, `sw.js CACHE_VERSION`,
#   `CHANGELOG.md`-Abschnitt. Seit 27.07. bewacht das der Versions-Guard in `check.sh`.
#
# ══════════════════════════════════════════════════════════════════════════════════════════════
# 2. PRÜFPROTOKOLL JE TASK (Pflicht, alles selbst ausführen)
# ══════════════════════════════════════════════════════════════════════════════════════════════
# - **SITZUNGSSTART:** `bash tools/umgebung.sh` + `git status --porcelain`. Vor jeder Entscheidung.
# - **Pool-/Inhalts-Tasks:** Änderung NUR in `pool/*.json`, dann `node tools/pool_laden.js --pruefe`
#   (E40: `fragen.js`/`faelle.js`/`build_fragen.py` entfielen mit N29 Teil 2). Danach `validate_pool`, `idcheck`,
#   `validate_schema`, bei Fakten zusätzlich `python3 tools/fakten_check.py`.
# - **Schnelle Schleife:** `bash tools/suite.sh <name> [name …]` – baut das flache Arbeitsverzeichnis
#   selbst und hält gegen `sollwerte.env`.
# - **Voller Prüflauf (vor jedem Release):** `bash check.sh block start` → `weiter` (wiederholen, bis
#   „ALLE ERLEDIGT") → `ende`. ⚠️ Der volle `bash check.sh` passt NICHT in die 45 s der Sandbox.
#   Nichts selbst nachbauen, nichts in den Hintergrund schieben – beides ist erprobt gescheitert.
# - **Neue Fragen:** fachliche Einzelprüfung JEDER Frage, kanonisches `thema` (Keys von
#   `L.THEMA_RELEVANZ`), `gebiet` laut `L.THEMA_GEBIET`, keine ID-Kollision, **kein Längen-Tell**.
#   Einsortieren über `tools/apply_batch.py` (prüft das per `assert`).
# - **Jeden neuen Test GEGENPROBEN** – eine Zusicherung, die nie gefallen ist, ist unbewiesen.
#
# ══════════════════════════════════════════════════════════════════════════════════════════════
# 3. TOOLING-FALLSTRICKE (kosten sonst Stunden – jeder hier ist mindestens einmal passiert)
# ══════════════════════════════════════════════════════════════════════════════════════════════
# - **45-s-LIMIT je bash-Aufruf.** Hintergrund-Prozesse (`nohup`, `&`) STERBEN am Aufruf-Ende.
#   Deshalb der Block-Modus von check.sh. Nicht umgehen wollen.
# - **MOUNT-TRUNCATION:** Nach File-Tool-Edits zeigt der bash-Mount die Datei zeitweise abgeschnitten.
#   `check.sh` hat dafür einen AUTO-WAIT (~40 s). Hilft das nicht: Workspace-Neustart.
# - **/tmp wird bei Workspace-Neustarts GELEERT.** jsdom/ajv/axe-core liegen persistent in `.tooling/`
#   (gitignored).
# - ⚠️ **Der node_modules-Spiegel MUSS auf `/node_modules` enden.** jsdom zieht über parse5 echte
#   ESM-Importe, und deren Auflösung ignoriert `NODE_PATH` vollständig – sie sucht nur in
#   Verzeichnissen, die `node_modules` HEISSEN. (`tools/suite.sh` macht das richtig.)
# - ⚠️ **Suiten laufen NUR im flachen Arbeitsverzeichnis**, nicht aus `tests/` heraus – die
#   require-Pfade sind relativ. Und `lernprogramm_ap1.html` muss dort **`app.html`** heißen.
# - **Tabellen-DOM: NIE `el("<tr>…")`** – der HTML-Parser verwirft tr/td außerhalb einer Tabelle und
#   liefert `null`. Immer `document.createElement`. (Zweimal gefixt, jetzt per Guard bewacht.)
# - **Encoding:** Kernfiles sind valides UTF-8; `file`/`grep` melden im C-Locale fälschlich „binary".
#   ⚠️ Bei „binary file matches" auf einer .js/.md trotzdem NIE weiterarbeiten, erst prüfen:
#   `python3 -c "print(open(F,'rb').read().count(b'\x00'))"` – `app_seiten.js` hatte ein NUL-Byte.
# - **Feldnamen, die regelmäßig verwechselt werden:** Schwierigkeitsstufe heißt `schwierigkeit`
#   (nicht `stufe`); `mehrfach` nutzt `loesungIndizes`, `mc` nutzt `loesungIndex`;
#   Statistik-Schlüssel `S.statistik["T:"+modul+":"+thema]`.
# - **Deutsche Anführungszeichen in JSON-Batches:** `„…"` mit geradem Schlusszeichen macht die Datei
#   ungültig. Das schließende Zeichen ist `“`. (`tools/apply_batch.py` meldet das.)
# - **Löschen scheitert am Mount** („Operation not permitted") → `allow_cowork_file_delete`.
#   Das gilt auch für ein verwaistes `.git/index.lock`, das `git add` blockiert.
#
# ══════════════════════════════════════════════════════════════════════════════════════════════
# 4. TOKEN-SPARREGELN (verbindlich ab 2026-07-12, Nutzer-Freigabe – gekürzt auf das noch Gültige)
# ══════════════════════════════════════════════════════════════════════════════════════════════
# 1. **Neuer Chat pro Task-Block.** Frischstart mit START_PROMPT.md ist billiger als ein langer Chat,
#    der den ganzen Verlauf mitschleppt.
# 2. **Modellwahl je Agent: NUR Skill `fisi:agenten-orchestrierung`** (Agenten, Umfang, Rechte, Auftrag; Belege Abschnitt 0).
# 3. **Entscheidungsfragen bündeln:** alle Vorab-Fragen eines Blocks in EINE AskUserQuestion-Runde.
# 4. **Agenten-Selbstvalidierung:** Agent bekommt ein Prüfskript mit und muss es grün liefern.
# 5. **grep statt Read** zum Lokalisieren (Anker in `ARCHITECTURE.md`); Read nur für den exakten
#    Editierbereich; Testausgaben immer mit `| tail` kürzen.
# 6. **`tools/pool_query.js` nutzen** statt ad-hoc Node-Einzeiler
#    (themen, typen, frage <id>, ohne <feld>, ids-frei <präfix>, duenn, stufe, suche <regex>, coverage).
# 7. **Agent-Prompts über `prompts/`-Vorlagen**; Vorlagen + ARCHITECTURE.md + tools/ vorher nach /tmp.
# 8. **Schema referenzieren statt zitieren.**
# 9. **Web-Recherche: Agent `recherche` (Haiku)** – nur das Extrakt in den Hauptkontext.
# 10. **Checkpoint VOR großen Agenten-Aufrufen**, nicht nur danach.
# 11. **Doku-Deckel:** BUILD_LOG nach jedem Release rotieren; START_PROMPT und TASKLIST werden
#     ÜBERSCHRIEBEN, nicht ergänzt. Chronik gehört ins jeweilige `*_ARCHIV.md`.
#     ⚠️ **GESTRICHEN am 27.07.: die alte Regel 9 „KEIN git im Projektordner, Versionierung per
#     Backup-Zip".** Sie galt wenige Tage im Juli 2026 und ist seit v0.8.0 falsch. Backup-ZIPs
#     werden nicht mehr gezogen; es gilt git + GitHub-Release-Action.
# 13. **AUFRUFE SIND DER GROSSE POSTEN, NICHT DIE AUSGABEN – GEMESSEN 08.10.2026 (Sitzungsauswertung, BUILD_LOG 103):**
#     Gewichtet ≈ 2,5 Mio. Tokens: **50 % Grundanweisungen** (Systemtext + Werkzeug- und Skill-Liste,
#     122 000 Tokens schon in Runde 1, bei JEDEM Schritt neu gelesen), 85 Runden, davon **31 reine
#     Warte-Abfragen** auf `check.sh`. Ein Haiku-Probeagent (2 Aufrufe) ≈ 346 000 – mehr als die ganze
#     Web-Recherche (139 000). ►► Daraus:
#     * **`bash check.sh doku`** fuer Commits, die NUR `*.md` / `tools/plugin/` aendern (Pfad-Tor; spart
#       ~8 Warte-Runden je Lauf). Alles andere: voller Lauf wie bisher.
#     * **Alle Aenderungen erst fertig, dann EIN Pruflauf, EIN Commit** – am 08.10. waren es drei Runden.
#     * **Warte-Zeit mit Arbeit fuellen** (Commit-Nachricht, Doku vorbereiten AUSSERHALB des Repos), nie leer abfragen.
#     * **Kein Agent fuer 1–3 Abrufe** – ein direkter WebFetch ist billiger als die Grundlast eines Agenten.
#     * **Ungenutzte Plugins/Connectoren im Konto aus** (bio-research, data, Agensi, Asana, Slack, Notion,
#       ToolUniverse): die Skill-Liste allein kam 6× à ~29 000 Zeichen in den Verlauf. Macht der Nutzer.
# 12. **AUSGABEN KLEIN HALTEN – GEMESSEN 17.09.2026 (Werkzeug-Runde, BUILD_LOG):**
#     * **vitest:** `NO_COLOR=1 npx vitest run <pfad> --reporter=dot` – 11 729 → 437 Zeichen
#       (−96 %), Ergebnis vollständig. Ohne `NO_COLOR` stehen Farbcodes (`\x1b[32m`) in jeder Zeile.
#     * **`ci2.sh`** zeigt seit 17.09. nur die Kurzfassung (17,2 → 1,7 KB); `ci_log.txt` bleibt
#       vollständig, `CI2_VOLL=1 bash ci2.sh` zeigt alles.
#     * **RTK** (`rtk.exe`, v0.48.0, per winget, Telemetrie AUS) ist installiert, **aber OHNE Hook**:
#       ⛔⛔ **`rtk vitest` VERSCHLUCKT DAS TESTERGEBNIS** („All parsing tiers failed", Ausgabe ohne
#       Zahlen) und legt `neu/.vitest/` im Baum an. Ein Hook würde jeden vitest-Aufruf so umschreiben.
#       Gewinn nur bei `rtk git status` (189 → 23); `git log`, `grep`, `tsc` unverändert.
#       Pfad: `$LOCALAPPDATA/Microsoft/WinGet/Packages/rtk-ai.rtk*/rtk.exe` (erst nach Shell-Neustart im PATH).
#     * **Graphify** (graphifyy 0.9.63) ist GEMESSEN UND VERWORFEN: der Code-Graph kennt **169 von
#       195 benannten Importen nicht** – er löst den Alias `@/` nicht auf. ⛔ Nicht erneut vorschlagen.
#     * **TypeScript-LSP** (Plugin `typescript-lsp`, `typescript-language-server` 6.0.0 global) wirkt
#       **nur in Claude Code im Terminal**, nicht in Cowork (dort laufen Befehle über die Brücke).
#       Gemessen 17.09. (`claude -p`, angemeldet): ⚠️ **Claude Code IN `neu/` starten** – im Wurzelordner
#       findet der Server kein TypeScript. ⚠️ Das Werkzeug ist ZURÜCKGESTELLT (erst per ToolSearch laden).
#       ⛔ **`findReferences` sah 2 von 4 Stellen** von `distraktoren`: die Testdateien sind ein eigenes
#       tsconfig-Projekt (`tsconfig.test.json`). **Für „alle Verwendungen" zusätzlich `grep`.**
#     ⚠️ **Hooks aus `.claude/` greifen in Cowork nicht** – dort zählt nur, was im Befehl selbst steht.
#
# ══════════════════════════════════════════════════════════════════════════════════════════════
# 5. WO STEHT WAS
# ══════════════════════════════════════════════════════════════════════════════════════════════
# ⚠️⚠️ **DIE VOLLSTÄNDIGE DATEIÜBERSICHT STEHT IN `START_PROMPT.md` ABSCHNITT 7, DIE WERKZEUGE IN
#   ABSCHNITT 8. HIER STEHT SIE SEIT DEM 28.07. NICHT MEHR.**
#   Grund: Es gab beide Listen, und **beide sagten „BUILD_LOG ab v1.7.0", als längst bis v1.11.0
#   rotiert war.** Zwei Listen für dieselbe Sache driften – dieselbe Ursache wie bei den zwei
#   Kopierlisten von `check.sh` und `tools/suite.sh` (am selben Tag auseinandergelaufen).
#   **Wer hier etwas nachtragen will, trägt es in START_PROMPT nach.**
#
#   Nur das, was ausschließlich diese Datei betrifft:
#   `TASKLIST_ARCHIV.md` ..... **Chronik dieser Datei**: Blöcke A–F, „29 Ideen", G1–G5, FB-R1/R2/R3,
#                              das M09-Unterrichtsprojekt. Gezielt nachschlagen, nicht am Stück lesen.
#                              ⚠️ Statusaussagen dort sind ÜBERHOLT (siehe Kopf).
#   `ARCHITECTURE.md` ........ Fragen-Schema, Modulaufbau, Anker für grep
