# FISI-2026-Lern-App – Einstieg für einen neuen Chat

**Dieses Dokument ist nur ein Wegweiser. Stand und Regeln stehen im Repo, nicht hier.**
Quelle: `tools/plugin/projekt_einstieg.md` im Repo – in JEDEM Konto als Projekt-Dokument „Training" hinterlegen
(neu gefasst 17.09., ergänzt 26.09. „Neuer Rechner", 27.09. Plugin, Lehrbuch-Repo, Verknüpfen; 28.09. Lehrbuch ohne PDFs).

## So fängt ein Chat an

1. **In der Claude-Desktop-App auf dem PC starten.** Fehlen die Rechner-Werkzeuge, aber
   `device_request_folder_access` ist da: diesen mit `%USERPROFILE%\Claude\Projects\Training` aufrufen –
   das hat am 27.09. den Chat verknüpft, als „Link to this computer" nicht angeboten wurde.
2. **Skill `fisi:fisi-lernapp` benutzen** (Plugin „fisi", je Konto installiert). Er beschreibt den Start:
   `bash tools/start.sh --neuer-chat <gmail|web.de>`, Shells, Arbeitsweg über die Cloud-Seite, Prüfen/Pushen.
3. **Skill-Liste ansehen:** nur `fisi:agenten-orchestrierung` und `fisi:fisi-lernapp` (token-wache entfiel mit fisi 1.3.2, E077). **Ohne `fisi:`** = alte
   Konto-Skills (löschen); fehlen sie = Plugin fehlt. `start.sh` zeigt im Abschnitt PLUGIN die SOLL-Fassung
   und warnt, wenn das Konto älter ist.
4. Ohne Skill: Ordner verbinden und **`START_PROMPT.md` lesen und exakt danach arbeiten.**

## Neuer Rechner (einmal, macht der Nutzer in PowerShell)

```powershell
winget install -e --id Git.Git ; winget install -e --id GitHub.cli
# PowerShell schliessen und neu oeffnen, dann:
gh auth login -h github.com -p https -w
gh repo clone Fisi2026/ap1-lernprogramm "$env:USERPROFILE\Claude\Projects\Training"
cd "$env:USERPROFILE\Claude\Projects\Training"
powershell -ExecutionPolicy Bypass -File tools\einrichten.ps1
```

**Fertige Dateien ohne Klon:** github.com/Fisi2026/ap1-lernprogramm → **Releases** → neuestes
„Werkzeuge: Plugin fisi …, Training Shell …" (`fisi-<v>.plugin`, `training-shell-<v>.mcpb`, dieses Dokument).

`einrichten.ps1` installiert Python, Node, jq, fährt `tools/einrichten.sh` (Git-Identität, Node-Pakete,
**Lehrbuch: klont das private Repo `Fisi2026/ap1-buch` nach `..\Buch`**) und zeigt am Ende
`tools\training-shell\training-shell.mcpb` im Explorer. **Diese Datei MANUELL in der Desktop-App
installieren** (Doppelklick öffnet nur einen Chat) und **die App neu starten**.
Danach im Chat: `bash tools/einrichten.sh --pruefen` – sagt, was noch OFFEN ist.
**Lerner-Meldungen lesen** (Cloudflare D1 `ap1-meldungen`, BUILD_LOG 122): einmal in Git Bash im Ordner `neu`
`npx wrangler login` (Browser-Anmeldung beim Cloudflare-Konto). Pruefen: `npx wrangler whoami`.
Das Lehrbuch liegt seit 28.09. im Repo `Fisi2026/ap1-buch` – **ohne die drei Westermann-PDFs**
(je über 100 MB, GitHub-Grenze; sie stehen in `..\Buch\.gitignore`). **Diese PDFs von Hand nach
`..\Buch` kopieren** (USB-Stick o. ä.); `einrichten.sh --pruefen` meldet, wenn sie fehlen.

## Neues Konto (oder Plugin-Update)

Das **Plugin „fisi"** hängt am **Konto**, nicht am Rechner. Der Chat baut es aus dem Repo und legt
es als Release ab (`bash tools/werkzeug_release.sh`, siehe oben „Fertige Dateien") und schickt die Datei; der Nutzer installiert sie **in beiden Konten**
und löscht alte Konto-Skills gleichen Namens. Danach trägt der Chat die Fassung in
`tools/plugin/installiert.txt` ein. Ablauf: `tools/skill_nachtraege.md`.
Ebenfalls je Konto: **dieses Projekt-Dokument** (Quelle oben) und der Connector „Cloudflare Developer Platform".

## Arbeit in der Cloud verteilen (gemessen 17.10.2026, BUILD_LOG 220)

**Grundsatz:** Lange oder parallele Arbeit läuft in **eigenen Cloud-Sitzungen** (claude.ai/code), nicht als Agenten im Leitungs-Chat und nicht als geplante Aufgabe. Eine Leitung (ein Chat) committet und pusht main; die Arbeiter-Sitzungen pushen nur eigene Zweige, die Leitung übernimmt per `cherry-pick -n` + grünem `check.sh`.

| Weg | Repo? | Modell wählbar? | Guthaben „Cloud-Sitzungen“? | Wofür |
|---|---|---|---|---|
| Cloud-Sitzung, angelegt über claude.ai/code (Browser, Desktop-Code-Tab → **Cloud**, Handy) | ja, beim Anlegen wählen | ja, Auswahl am Eingabefeld | **ja** (Support-Artikel 17152539) | Arbeiter und Leitung ohne PC-Bedarf |
| Geplante Aufgabe (`create_trigger`) | **nein** – kein Feld, `add_repo` fehlt in der Sitzung (gemessen) | ja per `update_trigger model`, nur ohne PC-Bindung | **nein** (Routines ausgenommen) | nur Arbeit über den PC (Training Shell): Release, Übergabe |
| Chat im Projekt / mit PC verknüpft (Cowork) | über `add_repo` | beim Start | **nein** (Cowork/Projects ausgenommen) | Leitung, wenn der PC gebraucht wird |
| Agent im Chat (`Agent`, `model` setzen) | teilt das Repo des Chats | ja | wie der Chat | kurze Nebenaufgaben; teilt die 2 Kerne der Sitzung |

**Cloud-Sitzung selbst anlegen (ohne Nutzer):** Skill `anthropic-skills:built-in-browser` → `preview_start https://claude.ai/code` (der eingebaute Browser hat eine eigene Anmeldung; Passwort gibt nur der Nutzer ein, sie bleibt gespeichert) → Repository `Fisi2026/ap1-lernprogramm`, Branch `main`, Berechtigungen **Auto**, Modell wählen → Auftrag ins Feld „Prompt“ (`form_input`) → Senden → Sitzungs-Link aus der Adresszeile notieren. Computer-use kann die Claude-App selbst nicht steuern (gemessen: „No requested app could be resolved“). **Steuern/Fortsetzen:** Cloud-Sitzungen sind nicht per `SendMessage` erreichbar (gemessen: `ListAgents` zeigt sie nicht). Lesen und „weiter“ schreiben nur über den eingebauten Browser. **Auftrag an Arbeiter:** allein verständlich; Einrichtung (Skill fisi-lernapp, `git config user.name ap1` / `ap1@users.noreply.github.com`, `npm ci` in Wurzel, `neu/`, `.tooling/`, `pip install --break-system-packages -r tools/requirements-werkzeuge.txt`), eigener Zweig, nie main, nie Release, kein BUILD_LOG, Schlussbericht mit Belegen. **Verbrauch:** Guthaben „Credits für Cloud-Sitzungen“ (Pro 100 $, verfällt 04.11. PT) zahlt nur normale Cloud-Sitzungen; Planvolumen (5h/7T) zahlt Chats im Projekt, geplante Aufgaben und deren Agenten. Stand im Menü „Nutzung“. Am 17.10. stieg 5h 63→77 %, während das Guthaben nur 98→97 $ sank – Leitung deshalb in eine Cloud-Sitzung verlegt. **Grenzen:** Cloud-Sitzungen dürfen keine Releases anlegen (HTTP 403) – Release nur über die Training Shell. Stryker in der Cloud: `--concurrency 2`, Tests vorher committen (`stryker_lauf.sh` rc 3).

## Wo was steht (alles im Repo)

| Datei | Inhalt |
|---|---|
| `START_PROMPT.md` | Stand, Übergabe, Arbeitsregeln, PFLICHT-Tabelle |
| `EINSTIEG.md` | Kurzfassung (erzeugt) – genügt für Werkzeug- und Neubau-Arbeit |
| `regeln/*.md` | die teuren Lehren nach Thema (pool, messen, git, bruecke, dateien) – welche Pflicht ist, sagt `START_PROMPT.md` Abschnitt 6 |
| `PLAN_NEUBAU.md` | Neubau `neu/`, Entscheide E1–E62 |
| `DEPLOY.md` | Auslieferung, Cloudflare-Worker, D1 `ap1-meldungen` |
| `BUILD_LOG.md` | was zuletzt geschah („Damit offen: …" im letzten Eintrag) |

⛔ **Nur ein Chat je Arbeitsbaum.** Commit-, Push- und Versionsstand stehen absichtlich nirgends hier –
`git log --oneline -5`, `git status --porcelain` und `python3 tools/ungepusht.py` sind die Wahrheit.
