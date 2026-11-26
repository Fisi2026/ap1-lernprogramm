---
name: "fisi-lernapp"
description: "Einstieg und Arbeitsablauf für die FISI-2026-Lern-App (AP1-Lernprogramm, Projektordner Training): prüft die Verbindung zum Rechner, startet die Messung mit tools/start.sh, legt fest, was gelesen wird, und regelt Prüfen, Committen und Pushen über die Training Shell. Verwenden, sobald ein Chat am Training-Repo arbeitet – auch bei „weiter“, Lern-App, AP1-Lernprogramm, Neubau neu/, Pool, check.sh, Release, Push oder Übergabe an einen neuen Chat."
---

# FISI-Lern-App – Einstieg und Ablauf

Quelle: `tools/plugin/fisi/skills/fisi-lernapp/SKILL.md` im Repo; ändern nur dort (Abschnitt „Skill ändern“).
Dieser Skill trägt keinen Projektstand und keine Projektregeln – beides steht im Repo (`START_PROMPT.md`,
`TASKLIST.md`). Widerspricht er dem Repo, gilt das Repo, und der Widerspruch wird dem Nutzer gemeldet.
Datierte Belege zu den Regeln hier: `regeln/bruecke.md` (Block „08.10.2026 – Belege aus den fisi-Skills“).

## Start

```
- [ ] 1. Verbindung messen: get_device_info
- [ ] 2. Konto vom Nutzer (gmail | web.de), falls nicht bekannt
- [ ] 3. Training Shell: bash tools/start.sh --neuer-chat <konto>
- [ ] 4. Plugin-Abgleich aus der Startausgabe (Block PLUGIN) – Abweichung: erst beheben, dann Etappe
- [ ] 5. Verbrauch: kommt eine [limits]-Zeile? (Abschnitt „Verbrauch“)
- [ ] 6. Nur lesen, was der nächste Griff braucht
```

### 1. Verbindung – drei Stufen, in dieser Reihenfolge

| Stufe | Erkennbar an | Wenn sie fehlt |
|---|---|---|
| A. Chat mit dem Rechner verknüpft | `get_device_info` antwortet (nur dieser Test zählt) | `device_request_folder_access(["~/Claude/Projects/Training"])` aufrufen – das verknüpft oft selbst. Sonst führt der Nutzer den Chat in der Claude-Desktop-App auf dem PC bzw. wählt „Link to this computer“; die App bleibt offen. |
| B. Ordner verbunden | `connectedFolders` enthält den Ordner | `device_request_folder_access(["~/Claude/Projects/Training"])`, je Chat einmal |
| C. Training Shell da | `…Training_Shell__run` in der Werkzeugliste; `localMcpServers`: „Training Shell: announced“ | „Training Shell veraltet“ unten |

- Den Ordner immer als `~/Claude/Projects/Training` anfragen. Den tatsächlichen Pfad nennen danach
  `connectedFolders` und die Kopfzeile der Training Shell (`CWD=`). Keinen Rechner- oder Benutzernamen
  in einen Plugin-Skill schreiben (Wächter 4e12 in `check.sh`).
- Fehlt Stufe A: einmal `ToolSearch "+remote-devices"`, dann dem Nutzer Spalte 3 sagen – nicht in
  Schleife suchen. Nach einem Systemhinweis „now linked“ neu messen.
- Welche Brücken-Werkzeuge es gibt und wie die Training Shell heißt, sagt nur die Werkzeugliste
  dieser Sitzung (`ToolSearch`), nie ein notierter Stand.

**Frischer Rechner** (`homeDirectories` ohne `Claude`, keine Training Shell): Der Nutzer führt einmal in
PowerShell aus, was im claude.ai-Projekt „Training“ unter „Neuer Rechner“ steht, dann im Klon
`powershell -ExecutionPolicy Bypass -File tools\einrichten.ps1`, und installiert die `.mcpb` der Training
Shell von Hand in der App. In Terminals tippt nur der Nutzer (Computer-use darf dort nicht tippen);
was über die Training Shell geht, macht der Chat. Was offen ist: `bash tools/einrichten.sh --pruefen`.

**Alter Ordner** (Kopie vom alten PC): `git fetch` und `git rev-list --count HEAD..origin/main` messen;
lokale Änderungen nicht verwerfen, sondern fragen (Stash + `--ff-only`).

**Training Shell veraltet** (Kopfzeile `⚠️ FASSUNG … neu starten` oder Meldung von `einrichten.sh`):
`bash tools/training-shell/einspielen.sh`, danach App neu starten. Meldet es „manifest weicht ab“, die
`.mcpb` von der Cloud-Seite mit `SendUserFile` schicken; der Nutzer installiert sie.

### 2.–3. Konto und Start

- Zwei Konten (gmail, web.de) arbeiten am selben Arbeitsbaum. Welches es ist, sagt der Nutzer.
- `bash tools/start.sh --neuer-chat <konto>` misst Umgebung, Arbeitsbaum, Log, Remote, Ungepushtes,
  CI-Urteil und Plugin-Stand und zeigt den nächsten Griff.

### 5. Verbrauch (E077)

- Der Hook des Plugins hängt jeder Nachricht eine Zeile `[limits] Kontext … · 5h … · 7T …` an. Dem Nutzer
  zeige ich die Werte NUR bei einer Zeile `[limits] SCHWELLE …` – und tue, was sie sagt. Eine eigene
  Grenze des Nutzers für die Sitzung gilt zusätzlich.
- Kommt keine `[limits]`-Zeile: Notfall `python3 tools/wache.py start --konto <k>` (Schätzung, `--help`)
  und den Plugin-Stand prüfen (`bash tools/plugin/soll.sh <konto>`).

### 4. Plugin-Abgleich

Auf der Cloud-Seite `sha1sum /root/.claude/plugins/synced/*/fisi*/skills/*/SKILL.md` mit den
Soll-Prüfsummen der Startausgabe vergleichen. Die Skill-Liste soll nur `fisi:`-Skills enthalten;
gleichnamige ohne Präfix sind alte Konto-Skills, die der Nutzer löscht.

**Abweichung = Pflicht, vor jeder Etappe** (Nutzer-Entscheid 14.10., BUILD_LOG 189 – web.de stand von 1.3.1 bis 1.3.8
unbemerkt alt, der Punkt war nur im „Damit offen“ weitergereicht und fiel dort heraus):

```
- [ ] Meldet PLUGIN „Konto '<k>' hat X, Repo Y“: .plugin aus dem Release holen
      (gh release download <tag> -p '*.plugin' -D _to_delete/helfer/plugin<Y>), per device_stage_files + SendUserFile schicken
- [ ] Nutzer installiert; auf seine Bestätigung warten – keine Etappe vorher
- [ ] Cloud-Seite: sha1sum der SKILL.md == SOLL der Startausgabe
- [ ] tools/plugin/installiert.txt nachziehen, mit dem nächsten Commit pushen
```

Nie nur ins „Damit offen“ schreiben.

### 6. Was lesen

| Arbeit | Lesen |
|---|---|
| Werkzeug, Neubau | `EINSTIEG.md` (aus START_PROMPT und BUILD_LOG erzeugt) |
| Pool, Frage, Verweis, Lehrtext, Spickzettel | `START_PROMPT.md` (Kern, < 200 Zeilen), `regeln/pool.md` und `regeln/messen.md`, alle ganz |
| Brücke, Rechnerwechsel, Skript schreibt Projektdateien | zusätzlich `regeln/bruecke.md` |
| Commit, Push, Release, Stand beim Lerner | zusätzlich `regeln/git.md` |
| zusätzlich bei `neu/` | `SCHIENE_NEU.md`, `PLAN_NEUBAU.md`, letzter `BUILD_LOG.md`-Eintrag |

Einzelne Abschnitte: `python3 tools/abschnitt.py <datei> <marke>` ausführen (rc 2 = kein Treffer, mit
Liste der Überschriften). `regeln/*.md` werden immer ganz gelesen; welche, sagt die Pflichttabelle in `START_PROMPT.md` Abschnitt 6. Im Zweifel lesen.

## Welche Shell wofür

| Shell | Wofür | Nicht für |
|---|---|---|
| Training Shell (Git Bash auf Windows) | `check.sh`, Suiten, vitest, tsc, Bau, git, Push, `ci2.sh`, `rm` | Schreiben mit Python (CRLF, außer `newline=""`) |
| `device_bash` (Linux-VM, Ordner unter `$HOME/mnt/Training`) | Lesen, `grep`, LF-sicheres Schreiben, `tools/rotiere.py` | Tests (`neu/node_modules` ist für Windows gebaut), git (hinterlässt Sperren), `rm` |
| Cloud-Seite (Bash dieses Chats) | Ändern, `check.sh`, Commit und Push – Arbeitsweg „Cloud baut, PC misst“ | Messungen, die Git Bash brauchen |

- Gibt es weder `device_bash` noch `device_stage_files`/`device_commit_files`: alles über die Training
  Shell; Dateien auf den PC per `cat > datei <<'EOF'` in Stücken, `sha1sum` auf beiden Seiten.
- Sichtprüfung am Live-Stand mit dem eingebauten Browser (`…/#<bereich>`; `/v2/` leitet dorthin um).
- Ein Chat je Arbeitsbaum: vor jedem Commit `git log --oneline -3` lesen. Ein fremder Commit heißt,
  ein zweiter Chat arbeitet mit – nur eigene Pfade adden, Nutzer bitten, den anderen Chat zu schließen.

### Grenzen der Training Shell

- **Zeit:** ein Aufruf ist bei ~60 s gedeckelt. Läufe über 50 s schiebt der Server selbst in den
  Hintergrund (`### IM HINTERGRUND … Lauf 'auto-…'`); abholen mit `bash tools/warte.sh <name> 45`
  (rc 124 = läuft noch). Gemessen: `warte.sh <lauf> 45` braucht unter Git Bash ~47 s je Aufruf – unter
  dem 50-s-Deckel; seit Shell 1.1.2 sagt auch ihre Werkzeugbeschreibung 45. Benannte Läufe:
  `bash tools/hinter.sh <name> '<lauf>'`. `sleep` plus Warten je Aufruf unter 50 s halten.
- **Länge:** Befehle werden bei ~8190 Zeichen still abgeschnitten – rc 0, der Rest läuft trotzdem.
  Darum endet jeder Befehl über 4000 Zeichen mit einer eigenen Zeile `#ENDE` (fehlt sie, lehnt der
  Server ab), und alles über ~6000 Zeichen wird in Stücken geschrieben (`cat >`, dann `cat >>`) und
  mit `wc -c` geprüft. Die Kopfzeile nennt die angekommene Länge (`BEFEHL=<n> Zeichen`).
- **Aufrufe bündeln:** jeder Brücken-Aufruf kostet ~4 s Leerlauf. Messungen zusammenfassen, die
  Wartezeit eines Hintergrundlaufs mit anderer Arbeit füllen.
- **Ausgaben klein:** `NO_COLOR=1 npx vitest run <pfad> --reporter=dot`; große Ausgaben nach
  `_to_delete/helfer/` umleiten und mit `grep`/`tail` lesen; `bash ci2.sh` zeigt die Kurzfassung
  (alles in `ci_log.txt`). Kein `rtk vitest` – es verschluckt das Ergebnis.

### Arbeitsweg „Cloud baut, PC misst“ (Nutzer-Entscheid 12.10.2026)

```
- [ ] Cloud: add_repo Fisi2026/ap1-lernprogramm (access: push), git clone --depth 1, fetch --depth=1000
- [ ] Cloud: git config user.name ap1 / user.email ap1@users.noreply.github.com (sonst 4e14 rot)
- [ ] Cloud: npm ci in Wurzel, neu/ UND .tooling/ (jsdom/ajv/axe-core; sonst tsc_tools zu hoch, Vorlauf rot),
      pip install -r tools/requirements-werkzeuge.txt
- [ ] Cloud: ändern → bash check.sh → Commit → Push (Ablauf unten; kein Vorlauf davor)
- [ ] PC (Training Shell): git pull --ff-only; nur Messungen, die Git Bash brauchen
```

- Committet wird auf GENAU EINER Seite – sonst laufen zwei Stände auseinander. Vor jedem Commit
  `git fetch` + `git rev-list --count HEAD..origin/main` (0 erwartet).
- Etwas auf dem PC messen, bevor es committet ist: Dateien als `tar --mode=u+w` nach
  `/mnt/user-data/outputs/` → `device_commit_files` nach `_to_delete/helfer/` → auf dem PC `sha1sum`,
  `tar -xf`, messen, danach `git checkout -- <dateien>` (der PC bleibt sauber, `git pull` holt den Commit).
  Je Übertragung ein neuer Dateiname.
- Den Weg bestimmt die Werkzeugliste der Sitzung: fehlt die Training Shell, arbeitet die Cloud-Seite allein.

## Prüfen, committen, pushen

```
- [ ] 1. Nach jeder Änderung die Einzelprüfung: bash tools/suite.sh <name> bzw. vitest auf den Pfad
         (Zwischenstand neu/: bash check.sh neu – ersetzt den vollen Lauf nicht)
- [ ] 2. Alle Dateien fertig – auch BUILD_LOG.md und Doku (KEIN tools/vorlauf.sh, wenn der volle check.sh folgt)
- [ ] 3. Bei neu/: cd neu && npx vite build, dann git add -A v2
- [ ] 4. Im Hintergrund: bash check.sh   (nur *.md oder tools/plugin/ geändert: bash check.sh doku)
- [ ] 5. Nur bei „ALLES GRÜN“: bash tools/gitc.sh commit -F _to_delete/helfer/<nachricht>.txt
- [ ] 6. bash tools/gitc.sh push origin main
- [ ] 7. Im Hintergrund: bash tools/ci_warte.sh  → Urteil in _to_delete/helfer/ci.urteil
- [ ] 8. git ls-remote origin refs/heads/main = eigener Commit (Beleg ist der Ref)
```

**Weniger warten – PFLICHT für jedes Konto (Nutzer-Entscheide 25.11.2026, BUILD_LOG 278/279; Wortlaut `regeln/git.md`):**
- **Größere Pakete:** 2–3 Aufträge je Prüf- und Push-Runde bündeln; das Paket vorher per Entwurf (AskUserQuestion) abstimmen.
  Ausnahme nur, wenn ein Fix sofort zum Lerner muss – dann sagen, warum.
- **EIN voller `check.sh` je Runde, KEIN Vorlauf davor** (gemessen 25.11.: Vorlauf 121 s + check.sh 251 s). Zwischendurch nur die
  betroffenen vitest-Dateien (Sekunden).
- **Weiterarbeiten statt warten:** während `check.sh`/CI laufen, das nächste Paketstück bauen; committet wird erst bei Grün.
- **Belege ohne eigenen Push:** CI-/Live-Nachweise kommen in den nächsten echten Commit, nie als eigener Doku-Push.

- Nur `*.md` / `tools/plugin/` geändert: Schritte 2–8 in EINEM Lauf –
  `bash tools/hinter.sh dc 'bash tools/doku_commit.sh _to_delete/helfer/<msg>.txt <pfade>'`, dann `bash tools/warte.sh dc 45`
  (erledigt `einstieg.py --setze` und `ci_warte.sh` selbst – beides sonst Ursache roter Doku-Läufe, gemessen 17.10.).
- Committet wird am ENDE einer Etappe oder Messreihe, nicht je Einzelbefund. Zwischenstände nur in `BUILD_LOG.md`
  auf dem PC (übersteht einen Container-Neustart; flüchtig ist nur die Cloud-Seite).
- Rot in Schritt 4: beheben, Schritt 4 wiederholen. Nie mit rotem Lauf committen oder pushen.
- Schritt 3 vor 4, weil `check.sh` den Bau gegen `v2/` vergleicht und `deploy_inhalt.py` den Git-Index liest.
- Committen nur über `tools/gitc.sh`, nur eigene Pfade.
- Push macht der Chat selbst (Nutzer-Entscheid), nie `--force`. Einen Version-Bump vorher erfragen.
- Die Standzeile steht schon VOR `check.sh` auf „LIVE = committet · PUSH DURCH“ (`python3 tools/standzeile.py vorab`;
  `release.sh` setzt sie so). Ein Commit, der beim Lerner ankommt (`python3 tools/ungepusht.py`), wird
  SOFORT gepusht. Scheitert der Push, setzt `tools/gitc.sh` per Folge-Commit „PUSH OFFEN“.
- `ci.urteil` nennt seinen Commit – prüfen, dass es der eigene ist; im Zweifel
  `gh run list --branch main --limit 3 --json headSha,status,conclusion`. Beleg ist der Ref, nicht eine Antwort.

## Eine Etappe je Chat (Nutzer-Entscheid 14.10., BUILD_LOG 176)

Ein Chat = eine Etappe (z. B. N44 C2): Start, Arbeit, `check.sh`, Commit, Push, BUILD_LOG – dann Chatwechsel
vorschlagen. Grund (Doku costs.md, gemessen 14.10.): jede Anfrage traegt den ganzen bisherigen Verlauf; zehn Etappen in
einem Chat (535k Tokens Kontext) kosteten ein Vielfaches derselben Arbeit in kurzen Chats. Der Hook meldet ab Start+150k Tokens Kontext (Startwert = erste Messung der Sitzung, im Plugin-Store – übersteht Container-Neustarts; Plugin-Namen „fisi“ nie ändern).
Modell und Effort vor dem Start waehlen, nicht mittendrin (ein Wechsel kann den Prompt-Cache verwerfen – Blog
„Maximizing the value of your Claude Code sessions“, 14.08.2026).

**Modell je Etappe** (Support-Artikel „Models, usage, and limits in Claude Code“, geprueft 14.10.; Opus „uses meaningfully
more of your quota“ – wie viel, sagt Anthropic nicht):

| Etappe | Modell |
|---|---|
| Features, Tests, Refactors, Lint-/knip-/Typ-Befunde nach festem Plan | Sonnet („large majority of coding work“) |
| Planung, Architektur, Entscheid-Runden, schweres Debugging, breite Aenderungen | Opus („genuinely stuck or the change is wide“) |
| rein mechanisch (Umbenennen, Boilerplate) mit Pruefskript | Haiku („quick mechanical work“) |

Beim Chatwechsel-Vorschlag das Modell fuer die naechste Etappe nennen. Jeder BUILD_LOG-Eintrag nennt Modell und 7T-Stand
vorher/nachher (`[limits]`-Zeilen) – damit wird „billiger“ gemessen statt angenommen.

## Arbeit in der Cloud verteilen (Nutzer-Entscheid 17.10., BUILD_LOG 220)

- Lange oder parallele Arbeit: Arbeiter als eigene **Cloud-Sitzungen** (claude.ai/code, über den eingebauten Browser
  angelegt; Repo, Modell, Berechtigung „Auto“ beim Anlegen). Sie pushen nur eigene Zweige, nie main, nie Release.
- **Eine Leitung pusht main**: übernimmt je Zweig per `cherry-pick -n`, `check.sh` grün, Commit, Push.
- **Geplante Aufgaben nur für PC-Arbeit** (Release, Übergabe über die Training Shell): sie bekommen kein Repo und zahlen
  nicht aus dem Guthaben für Cloud-Sitzungen.
- Wege, Belege, Grenzen: `regeln/bruecke.md` (Lehre 17.10.2026) und `tools/plugin/projekt_einstieg.md`
  („Arbeit in der Cloud verteilen“).

## Übergabe an einen neuen Chat – NUR auf Zuruf (Nutzer-Entscheid 14.10., BUILD_LOG 179)

Nur wenn der Nutzer es in diesem Chat verlangt („Übergabe“, „neuer Chat“, „übergib“). Nie von selbst, auch nicht an einer
Kontext-Schwelle (dort nur vorschlagen). Der neue Chat ist eine geplante Aufgabe, die eine frische Sitzung startet und so
weitermacht, als hätte der Nutzer sie geöffnet und „weiter“ geschrieben.
⚠️ Die Übergabe-Sitzung hat **kein Repo** (geplante Aufgaben bekommen keins, `add_repo` fehlt dort – gemessen 17.10.) und
arbeitet darum über die Training Shell des PCs. Ohne PC-Bedarf stattdessen eine Cloud-Sitzung anlegen (Abschnitt oben).

```
- [ ] 1. Laufende Etappe abschließen; BUILD_LOG-Eintrag mit „Damit offen: …“ (nächster Griff + Modell-Empfehlung)
- [ ] 2. voller bzw. Doku-check.sh GRÜN → Commit → Push; Beleg: git ls-remote origin refs/heads/main == HEAD
- [ ] 3. Baum sauber auf BEIDEN Seiten: Cloud `git status --porcelain` leer; PC über die Training Shell
         `git fetch && git merge --ff-only origin/main`, dann `git status --porcelain` leer
- [ ] 4. Offene Fragen an den Nutzer? Dann KEINE Übergabe – erst klären
- [ ] 5. create_trigger: run_once_at = jetzt + 2 min · requires_local_device: true · initiation: human_request ·
         name „Übergabe <TT.MM. HH:MM>“ · permission_mode NICHT setzen · prompt (unten)
- [ ] 6. Dem Nutzer melden: Name der Aufgabe, Startzeit, welche Freigabe-Einstellung sie bekam; für Läufe ohne
         Rückfragen in den Einstellungen der Aufgabe „Automatically approve“ einschalten (wenn die Organisation es erlaubt)
```

Prompt der Aufgabe (wörtlich, Platzhalter füllen):
`weiter` – darunter: „Automatische Übergabe aus der Sitzung <Sitzungs-Link> am <Datum Uhrzeit>, Konto <gmail|web.de>.
Stand: Commit <sha> auf main. Skill fisi-lernapp laden und normal starten (start.sh). Nächster Griff laut BUILD_LOG
„Damit offen“.“

Grenzen (gemessen 14.10. an der Werkzeugbeschreibung): Das Modell der neuen Sitzung lässt sich NICHT wählen (kein
Parameter) – es läuft mit der Vorgabe der Umgebung. Freigaben: die Aufgabe bekommt ihre Einstellung vom Server;
automatisch ohne Rückfragen nur, wenn der Nutzer es an der Aufgabe einschaltet. Die neue Sitzung verbraucht ab Start
Kontingent, auch ohne Zuschauer.

## Am Ende einer Arbeitsrunde

`BUILD_LOG.md` (neuer Eintrag, Schlusszeile „Damit offen: …“) und `START_PROMPT.md` nach deren
Abschnitt 5 aktualisieren. START_PROMPT tauscht, sie wächst nicht (`check.sh` prüft die Größe in Byte).
Dann dem Nutzer kurz berichten: Ergebnis, offene Entscheide, nächster Griff. Was nur im Chatverlauf
steht – auch was bewusst nicht getan wurde –, ist verloren.

## Arbeitsweise (Nutzer-Entscheide)

- **Keine Grenze ohne Messung.** Wer „das geht nicht“ sagt, nennt im selben Satz den Befehl, der es
  zeigt, oder das Werkzeug, das fehlt. Das gilt auch für die eigenen Grenzen. Prüffrage des Nutzers:
  „gemessen oder angenommen?“
- **Jede Empfehlung ist gemessen und geprüft, bevor sie fällt** – auch jedes „(Empfohlen)“ in einer
  Rückfrage. Sie nennt den Befehl oder die Datei, auf der sie steht. Was dafür nicht gemessen ist,
  wird erst gemessen; geht das nicht, steht „angenommen“ dabei und keine Empfehlung.
- **Ist der beste Weg versperrt, fragen statt ausweichen:** die Sperre messen, die Alternativen mit
  ihrem Preis nennen, den Nutzer wählen lassen. Ein ungewähltes Ausweichen ist seine Entscheidung,
  von mir getroffen.
- **Annahmen selbst messen.** Jede Aussage, die ich als „angenommen“ markieren müsste, messe ich vor der Antwort,
  wenn ein Messweg mit ≤ 3 Aufrufen existiert (Programmcode, Dateisystem, kleine Probe). Sonst steht sie als
  Option mit Preis da, nie als Empfehlung. Bewährte Wege (17.10.): `uptime -s` (Container-Neustart), Strings im
  Engine-Programm (`/opt/claude-code/bin/claude`), kleine Dev-Mod als Probe, danach löschen.

## Skill ändern

Gilt für alle drei `fisi`-Skills. Nie im Konto von Hand ändern.

```
- [ ] tools/plugin/fisi/skills/<skill>/SKILL.md ändern
- [ ] Version in tools/plugin/fisi/.claude-plugin/plugin.json erhöhen
- [ ] python3 tools/plugin/packen.py; bash check.sh doku; Commit, Push
- [ ] bash tools/werkzeug_release.sh  (startet den Workflow werkzeuge.yml: baut .plugin und .mcpb in GitHub Actions,
      bescheinigt die Herkunft, hängt alles samt <tag>.sigstore.json ans Release; seit 26.11., BUILD_LOG 292) – über
      die Training Shell; danach `bash tools/werkzeug_release.sh --pruefe` = „ok … (signiert)“
- [ ] .plugin per SendUserFile an den Nutzer; er installiert sie in beiden Konten
- [ ] Cloud-Seite: sha1sum gegen die Startausgabe; tools/plugin/installiert.txt nachziehen
```
