# regeln/git.md – GIT – Push-Stand, CI, Tag, Release und die Sperren auf dem Mount

**Wann lesen:** Pflicht vor jedem Commit, Push, Release oder jeder Aussage ueber den Stand beim Lerner.

⚠️ Entstanden am 11.10.2026 (N49 W1, Nutzer-Entscheid): die Bloecke unten stehen **verbatim** aus `START_PROMPT.md` und `LEHREN.md` (verschoben mit `tools/rotiere.py`, Gegenprobe 0) – nichts gekuerzt, nichts umformuliert. Abschnittsnummern und „siehe oben“ darin beziehen sich auf die Ur-Fassung (`git log -p START_PROMPT.md`, Stand vor N49 W1).
⛔ Diese Datei traegt keinen Stand (der steht in den zwei Standzeilen von `START_PROMPT.md`). **Neue Lehren kommen ans Ende, mit Datum und Beleg.**

## Aus START_PROMPT.md verschoben am 11.10.2026 (N49 W1, verbatim, rotiere.py)

### aus START_PROMPT.md, Zeilen 93-99 der Ur-Fassung

#   ►► https://ap1-lernprogramm.fisi2026lernapp.workers.dev · **Beleg für LIVE ist der Tag auf dem Remote**, nicht ein Satz hier.
#   ⚠️ **BEIDE ZEILEN HÄLT `check.sh` NACH** (Stand-Guard): Version `neu/package.json` gegen `v2/app-sw.js`, Pool und
#   Suiten gegen den Code, **PUSH OFFEN/DURCH gegen LIVE ↔ committet** und seit 02.09. **gegen die
#   ungepushten Commits, die etwas AUSLIEFERN** (4e2b2, Kriterium aus `wrangler.jsonc`, E44).
#   ⛔ **Kein Commit-Hash hier, keine Zeilenzahl, kein Datum von Hand.** `git log` ist die Wahrheit.
#   ⚠️⚠️ **WAS AUF `main` ÜBER DEM LETZTEN TAG LIEGT, IST NICHT BEIM LERNER** – vier Wochen lang
#   der Normalzustand. **Nach jedem Feature-Meilenstein bumpen**; 4e2b2 meldet, was offen liegt.

### aus START_PROMPT.md, Zeilen 101-117 der Ur-Fassung

# ►►► **ÜBERGABE AN DEN NÄCHSTEN CHAT** ◄◄◄
#   **SCHRITT 1: PUSH-STAND MESSEN, VOR ALLEM ANDEREN** (seit 17.09. pusht der Chat SELBST,
#      Nutzer-Entscheid): `git log --oneline -1 origin/main` gegen `main` (vorher `git fetch`),
#      dann `python3 tools/ungepusht.py`. Liegt etwas offen und ist `check.sh` grün →
#      **`git push origin main` über die Training Shell**, danach `bash ci2.sh` (URTEIL-Zeile),
#      `git ls-remote --tags origin` (Tag bei Bump) und die Live-Seite. **Erst dann** Standzeile
#      auf `LIVE = committet · PUSH DURCH` und – nach einem Release – `BUILD_LOG.md` rotieren.
#      ⛔⛔ **DER REF IST DER BELEG, NICHT EINE ANTWORT ODER EIN RÜCKGABEWERT** (07.09.: „ja,
#      gepusht" kam, während `origin/main` drei Commits zurückstand). ⛔ **Nichts davon nachbauen.**
#      ⛔ **Wieviel ungepusht liegt, steht NICHT hier**: `python3 tools/ungepusht.py` zählen lassen.
#      ⚠️ **DER STILLE VORRAT IST DIE GEFAHR, NICHT DER EINZELNE COMMIT:** v1.23.0 trug am Ende
#      die Etappen C, D, E, F, G2, H und den Nebentext-Befund, alle ohne eigenen Bump. **Nach
#      jedem Feature-Meilenstein bumpen** – der Ungepusht-Guard erzwingt es, wenn etwas
#      Ausgeliefertes committet ist und die Zeile „PUSH DURCH" sagt.
#      ⛔ **v1.21.0 GIBT ES NICHT** – committet, nie getaggt; CHANGELOG auf 1.22.0 (Entscheid 03.09.).
#      ⛔ **Nie `--force`, nie ein CI-Status ohne `ci2.sh`-URTEIL – und aus dem Fehlen einer
#      Information keinen ableiten** (Beleg: Archiv 03.09.). Push abgelehnt → melden, nichts erzwingen.

### aus START_PROMPT.md, Zeilen 119-142 der Ur-Fassung

# ⛔ **HIER STEHT KEIN PUSH-STAND UND KEINE COMMIT-ZAHL** – jeder solche Satz war Stunden spaeter
#   falsch. **Wer den Stand wissen will, misst ihn:** `git status --porcelain` (Baum) ·
#   `git log --oneline -5` (committet) · `python3 tools/ungepusht.py` (was dem Remote fehlt).
#   ⚠️ **OB EIN PUSH GELAUFEN IST UND OB DIE CI GRUEN WAR: MESSEN** – `git ls-remote origin` und
#   `bash ci2.sh` über die Training Shell. **Nie annehmen, nie aus einem Doku-Satz schliessen.**
#   ⚠️ Push über die Training Shell. Abgelehnt → **melden, nichts erzwingen**; kein `--force`.
#   ⛔ **Ein `push.sh` GIBT ES NICHT MEHR** (10.09., `_to_delete/`). **Tag/Release erst beim Push.**
#   ⚠️ `ci2.sh` zeigt auch aeltere FEHLGESCHLAGENE Laeufe – **massgeblich ist die URTEIL-Zeile.**
#
# ⛔ **KEIN COMMIT-HASH IN DIESE DATEI** – er steht in `git log`, dort ist er immer richtig.
#   ⚠️ `ci.yml` steht seit 28.07. auf `@v6` (erledigt, nicht vortragen). **Den CI-Status sagt nur
#   `ci2.sh`** (braucht `gh`, läuft über die Training Shell; ein laufender Lauf heißt „noch offen").
# ⛔⛔ **GIT AUF DEM MOUNT KANN SEINE EIGENEN DATEIEN NICHT LOESCHEN – DAUERZUSTAND, KEIN
#   ZWISCHENFALL.** Jeder schreibende Git-Aufruf laesst `index.lock`/`HEAD.lock` liegen; ein
#   liegengebliebenes `HEAD.lock` blockiert den naechsten Commit.
#   ►► **DESHALB IMMER `bash tools/gitc.sh <git-argumente>`** – raeumt vor und nach dem Aufruf auf
#   und reicht den Rueckgabewert durch. **Nicht von Hand, nicht nachbauen.**
#   ⛔ **DIE POOL-DATEI ZUR ID WIRD GEMESSEN, NICHT GERATEN** (08.09.): M03-990 liegt in
#   `pool_m_l4.json`, M06-771 in `pool_m_transfer.json` – **der ID-Präfix sagt das Modul, nicht
#   die Datei.** `git add` schweigt zu unveränderten Pfaden, und der Commit ging mit `fragen.js`
#   ohne seine Quellen raus. ►► **`grep -l '"id": "<ID>"' pool/*.json` VOR dem `add`.**
#   ⚠️ **`_to_delete/` (in `.gitignore`) ist die Ablage fuer alles, was hier nicht geloescht werden
#   kann** – Nutzer-Anweisung 27.07.: selbst erledigen, nicht melden und liegen lassen.
#

## Aus LEHREN.md verschoben am 11.10.2026 (N49 W1, verbatim, rotiere.py)

### aus LEHREN.md, Zeilen 20-25 der Ur-Fassung

# ⛔⛔ **EIN WÄCHTER, DER VERSIONEN VERGLEICHT, SIEHT KEINEN INHALT** – nach dem Push von v1.19.0 lag
#   der B106-Commit ungepusht auf main, beide Nummern gleich, und 4e2b hätte „PUSH DURCH" erzwungen.
#   **Cloudflare deployt bei JEDEM Push** (`DEPLOY.md`), nicht erst beim Tag; 4e2b2 schliesst das.
#   ►► **Und er sagt, wo er nichts misst:** in der CI ist der Zähler strukturell 0. **Ein grüner
#   Wächter an einer Stelle, an der er nichts messen kann**, ist die Falle vom 27.07. und 31.08. –
#   **vor dem Bauen an Fällen mit bekannter Antwort prüfen**, Meldezweig eingeschlossen.

### aus LEHREN.md, Zeilen 26-28 der Ur-Fassung

# ⚠️ **EIN REPORT, DESSEN URTEIL MAN SUCHEN MUSS, IST EIN HALBER REPORT.** `ci2.sh` zeigte einen
#   grünen Bot-Lauf auf einem PR-Branch, während main rot war. **„Der letzte Lauf" ist nicht „der
#   Lauf meines Pushes"** – maßgeblich ist die URTEIL-Zeile auf Branch main.

### 14.10.2026 – Live-Beleg mit Cache-Brecher, Release nur ueber die Training Shell (BUILD_LOG 176)
⛔ **Beleg:** `WebFetch …/app-sw.js` lieferte nach dem Push noch den alten Cache-Namen (das Werkzeug puffert 15 min je URL);
erst `…/app-sw.js?v=<kurz-sha>` zeigte den neuen Stand. `gh release create` aus der Cloud-Seite: HTTP 403.
►► **Live-Beleg immer mit `?v=<commit>`** und gegen `grep -o 'var CACHE = "[^"]*"' v2/app-sw.js` vergleichen ·
`tools/werkzeug_release.sh` nur ueber die Training Shell (seit 26.11.2026 startet es den Workflow `werkzeuge.yml`, der in
Actions baut und signiert – BUILD_LOG 292).

### 18.10.2026 – Actions-Minuten: ein Push = voller CI-Lauf (BUILD_LOG 226)
⛔ **Beleg:** privates Repo, 2.000 min/Monat; je Push auf main 12 Jobs ≈ 17 abgerechnete min (jeder Job auf volle Minuten aufgerundet,
aus den Job-Dauern gemessen), auch bei reiner Doku. 11 Einzel-Pushes an einem Tag ≈ 190 min → Mail „90 % verbraucht“.
►► **Pushes bündeln:** Übernahmen lokal committen (je mit grünem `check.sh`), am Ende EINMAL pushen; Doku nie einzeln. Zweige der Arbeiter
kosten nichts (CI nur bei `push: main` und PR gegen main). Seit dem Umzug ins öffentliche Repo (26.11.2026) sind Standard-Runner frei – *gemessen* 26.11.: `gh api …/actions/runs/<id>/timing` meldet `billable` 0 ms je Job (BUILD_LOG 295). Bündeln bleibt wegen der Wartezeit Pflicht.
►► **Weniger warten (Nutzer-Entscheid 25.11.2026, BUILD_LOG 278):** EIN `check.sh` je Runde (dazwischen nur die betroffenen
vitest-Dateien) · Live- und CI-Belege kommen in den NÄCHSTEN echten Commit, kein eigener Doku-Push dafür · während `check.sh`
oder CI laufen, weiterarbeiten statt warten.
►► **Verschärft 25.11.2026 (Nutzer: „immer noch zu langsam“, AskUserQuestion, alle drei gewählt, BUILD_LOG 279) – gilt für BEIDE Konten,
steht deshalb auch im Skill `fisi-lernapp` (Plugin 1.3.15):** (1) **kein `tools/vorlauf.sh`**, wenn ohnehin der volle `check.sh` folgt
(gemessen: Vorlauf 121 s + check.sh 251 s ≈ 6 min je Runde) · (2) **größere Pakete:** 2–3 Aufträge je Prüf-/Push-Runde, das Paket vorher
per Entwurf abstimmen · (3) **während `check.sh`/CI das nächste Paketstück bauen**, Commit erst bei Grün. Ausnahme nur, wenn ein Fix
sofort zum Lerner muss (dann sagen, warum).

### 26.11.2026 – Sichtpruefung der Live-Seite macht der Chat im eingebauten Browser (BUILD_LOG 296)
⛔ **Anlass:** „Sichtpruefungen (Nutzer)“ stand seit Wochen in jedem „Damit offen“. Anthropic („Effective harnesses for long-running
agents“, 26.11.2025) empfiehlt Ende-zu-Ende-Pruefung „as a human user would“ per Browser statt nur Unit-Tests; Nutzer-Entscheid 26.11.
►► **Nach jedem Push, der beim Lerner ankommt (`python3 tools/ungepusht.py`), und nach jedem Release:** Live-Seite
(`…/#<bereich>`, mit `?v=<commit>`) im eingebauten Browser oeffnen, die geaenderten Bereiche anklicken, Screenshot + `read_console_messages`
(nur Fehler) lesen und im BUILD_LOG-Beleg nennen. Der Handy-Test bleibt beim Nutzer und wird nicht angeboten (START_PROMPT 4).
