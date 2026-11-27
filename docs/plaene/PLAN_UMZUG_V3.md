# docs/plaene/PLAN_UMZUG_V3.md – Ablaufbuch für N40 V3 (Umzug ins öffentliche Repo)

**Wann lesen:** am Umzugstag (Entwurf für Mittwoch 21.10.2026, eine Sitzung) und vor jeder Änderung an N40 V3.
**Stand:** Fassung V3 vom 18.10.2026 (Nutzer-Entscheide O1–O9 eingearbeitet, Zweig `n40-ablauf`), **nachgemessen 25.11.2026** (Abschnitt 1a, O10; Werte in den Schritten nachgezogen: `v2.13.1`, `fisi 1.3.15`, `ci.yml:409`), **Phase B ausgeführt 26.11.2026** (BUILD_LOG 283–285; 16.4 Cloud-Probe ✅ BUILD_LOG 294; offen: Schritt 14 auf den anderen zwei PCs). Der Umzug selbst ändert GitHub,
Cloudflare und beide PCs – das macht der Nutzer mit dem Chat zusammen, Schritt für Schritt, mit Pause an jeder Prüfung.
**Grundlage:** `docs/plaene/PLAN_NEUBAU.md` N40 (E66, E70), `DEPLOY.md`, `regeln/git.md`, `regeln/bruecke.md`, BUILD_LOG 220–223.
V1 (Wächter `4e14_veroeffentlichung`), V2 (Katalog nach `../Buch`) und V4 (`LICENSE`, `SECURITY.md`, `README.md`, seit `5791c05`) sind erledigt.
**harden-runner kommt nirgends vor** (BUILD_LOG 223, Nutzer-Entscheid 18.10.).
**Nicht gewählte Optionen stehen nicht mehr in den Schritten** (Abschnitt 6 nennt sie je Frage mit „✅ entschieden“).

**Kennzeichnung:** **[N]** Nutzer-Klick (GitHub / Cloudflare / claude.ai) · **[PC]** Training Shell (Git Bash) auf dem PC ·
**[C]** Cloud-Sitzung · *gemessen* = am 18.10.2026 selbst gefahren · *angenommen* = aus Doku, Code oder Erinnerung, nicht gefahren.
**Quellen der GitHub-Doku** (18.10.2026 über WebSearch gelesen; `docs.github.com` ist aus der Cloud-Sitzung per WebFetch nicht erreichbar –
DNS-Fehler, gemessen): [Renaming a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository) ·
[Archiving repositories](https://docs.github.com/en/repositories/archiving-a-github-repository/archiving-repositories) ·
[Managing GitHub Actions settings for a repository](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository) ·
[Creating rulesets for a repository](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository) ·
[Configuring private vulnerability reporting](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/configure-vulnerability-reporting/configuring-private-vulnerability-reporting-for-a-repository) ·
[GitHub-hosted runners](https://docs.github.com/en/actions/reference/runners/github-hosted-runners) ·
[Claude Code im Browser](https://code.claude.com/docs/en/claude-code-on-the-web). Menü-Beschriftungen ändert GitHub oft – **die Menüpfade unten sind
Doku-Wortlaut, am Umzugstag am Bildschirm gegenlesen.**

## 0. Der Plan in einem Satz
Altes Repo umbenennen und stilllegen, neues **privates** leeres Repo gleichen Namens anlegen, **einen** Erstcommit aus dem geprüften Baum als `ap1` dorthin schieben,
**genau einen** CI-Lauf messen (Tag `v2.13.1`, Deploy, Live), **dann erst öffentlich schalten** (Schritt 12), danach Einstellungen, beide PCs, Cloud-Sitzungen und
Werkzeuge-Release; das Alt-Repo wird erst nach grüner Probe archiviert. Die Reihenfolge hält die Zahl der CI-Läufe vor dem Umschalten auf 1–2 (Abschnitt 1, Zeile „Actions-Minuten").
**Nie `--force`, nie die alte Historie anfassen.** Das alte Repo bleibt als Archiv unverändert lesbar – es ist der Rückweg.

## 1. Gemessene Ausgangslage (18.10.2026, `gh api` aus der Cloud-Sitzung)
| Was | Wert | Beleg |
|---|---|---|
| Altes Repo | `Fisi2026/ap1-lernprogramm`, **privat**, Standardzweig `main`, nicht archiviert, Repo-Größe ~21 MB | `gh api repos/…` *gemessen* |
| Zweige auf dem Remote | **37** (u. a. `main`, 4 `cloud-*`, 17 `m3-*`, `n40-v4`, `n41-s45`, `n42-b5`, `n44-c1-baum`, 2 `dependabot/*`, `claude/*`) | `gh api …/branches --paginate` *gemessen* |
| Offene Pull Requests | **2** (beide Dependabot: `betrieb-alle`, `actions-alle`); offene Issues sonst **0** | `gh api …/pulls` *gemessen* |
| Releases | **92**: 67 App-Releases `v…`, 25 Werkzeuge-Releases `werkzeuge-fisi<v>-shell<v>`; **75 Anhänge, 683 KB**, alle an den 25 Werkzeuge-Releases (je `.plugin`, `.mcpb`, `projekt_einstieg.md`) | `gh api …/releases` *gemessen* |
| Tags | 98 (inkl. `alt-app-final`, `v0.8.0` … `v2.10.5`); **`v2.3.3` und `v2.10.5` existieren schon** | `git ls-remote --tags` *gemessen* |
| Features | Issues an, Wiki/Pages/Discussions aus, `delete_branch_on_merge` **an**, `description` und `topics` leer | `gh api repos/…` *gemessen* |
| Nicht lesbar von der Cloud-Seite (Proxy 403) | Actions-Einstellungen (`/actions/permissions`), Secret-Namen, Webhooks, Environments, Pages | *gemessen* – **[N] liest sie in Schritt 2 ab** |
| Rulesets / Branch-Schutz | nicht verfügbar im privaten Free-Repo („Upgrade to GitHub Pro or make this repository public"), Branch-Schutz 403 | *gemessen* (deckt sich mit `docs/befunde/BEFUNDE_AUDIT.md`) |
| Baum des Erstcommits | **870 Dateien, 16,4 MB, größte Datei 2,7 MB** (`v2/assets/pooldaten-*.js`), Pack ~5,3 MiB | `tools/umzug_v3_probe.sh` *gemessen* |
| Verwendete Actions in `ci.yml` | nur `actions/checkout`, `actions/setup-node`, `actions/attest-build-provenance` – **alle GitHub-eigen**, am vollen SHA | `grep uses: .github/workflows/ci.yml` *gemessen* |
| Actions-Minuten des Kontos | Free-Konto: **2000 min/Monat** für **private** Repos; ein CI-Lauf ≈ **17 min** Runner-Zeit (Summe der parallelen Jobs); **heute ~1800 min verbraucht** → Rest ≈ 200 min = **höchstens ~11 Läufe**. Das Alt-Repo zählt zum selben Konto. Das neue private Repo zählt **bis zum Öffentlich-Schalten gegen dieselben 2000 min**; Standard-Runner in öffentlichen Repos sind laut Doku frei (*angenommen*) | Zahlen: Angabe der Leitung/des Kontos 18.10., hier nicht nachgemessen (Abrechnungsseiten sind von der Cloud-Sitzung nicht lesbar, *angenommen*); Doku-Aussage nicht gefahren |
| `.claude/settings.json` | **eingecheckt**: Start-Haken `bash tools/postfach.sh start` und Freigaben (`tools/postfach.sh`, `gh pr comment 1`/`2 --repo Fisi2026/ap1-postfach`, `gitc.sh push origin main`). `.gitignore` hat die Ausnahme `!.claude/settings.json` – die Datei **wandert im Erstcommit mit**; damit wird der Name des privaten Postfach-Repos öffentlich | `git ls-files .claude`, `.gitignore` *gemessen* |
| Postfach-Repo | `Fisi2026/ap1-postfach` (**privat**, PR #1/#2) **bleibt, zieht nicht um**. Der Start-Haken liest es per `gh api` und endet immer mit Rückgabewert 0 – auch wo es nicht erreichbar ist (Meldung „Postfach nicht erreichbar", so in dieser Sitzung *gemessen*) | `tools/postfach.sh`, `regeln/bruecke.md:248` (Code gelesen) |
| Klon in der Cloud-Sitzung | **flach** (`git rev-parse --is-shallow-repository` = true) – die Zahl „33 Commits mit privater Adresse" (BUILD_LOG 113) ist von hier nicht neu messbar | *gemessen* |

## 1a. Nachmessung 25.11.2026 (Cloud-Sitzung web.de, Stand `be07ddb`; ersetzt die abweichenden Zeilen in Abschnitt 1)
| Was | Wert 25.11. | Beleg |
|---|---|---|
| Altes Repo | weiter **privat**, nicht archiviert, nicht umbenannt – Phase B nicht begonnen | `curl` anonym 404; `api.github.com/repos/…` `private: true` *gemessen* |
| Zweige / offene PRs | **2** (`main` + Arbeitszweig der Sitzung) / **0** – die 37 Zweige und 2 Dependabot-PRs aus Abschnitt 1 sind weg | `…/branches`, `…/pulls?state=open` *gemessen* |
| Releases / Tags | 98 / 104; Werkzeuge-Release `werkzeuge-fisi1.3.15-shell1.1.2` **fehlt** (auch im Alt-Repo) – es entsteht einmal, im neuen Repo (Schritt 15) | `…/releases`, `start.sh` Block PLUGIN *gemessen* |
| Version | `neu/package.json` **2.13.1**, `CHANGELOG.md` hat `## v2.13.1` → der erste Lauf legt `v2.13.1` an (O2 sinngemäß) | *gemessen* |
| Generalprobe | `--probe` 12/12; Normallauf grün: **904 Dateien, 17,4 MB, größte 3,0 MB**, Pack 5,60 MiB, `.claude/settings.json` ja, 1 Commit `ap1` | `tools/umzug_v3_probe.sh` *gemessen* (Cloud; `--voll` bleibt Sache des PCs, Abschnitt 5) |
| Actions in `ci.yml` | nur GitHub-eigene: `checkout`, `setup-node`, `upload-artifact`, `download-artifact`, `attest-build-provenance` – Schritt 7.2 („Allow actions created by GitHub") reicht weiter | `grep uses:` *gemessen* |
| Jobs / Kosten je Lauf | 12 Jobs (`tests` in 3 Shards, dazu `bau`, `rauch`, `tests-merge`); **17 min** (Job-Dauern je Job auf volle Minuten aufgerundet), Wanduhr 3:49 | Lauf 45625026741, Jobs-API *gemessen*; die Abrechnungs-Spalte `billable` der API liefert 0 – nicht verwertbar |
| Actions-Minuten November | **111 Läufe, ≈ 1.064 min** (je Job aufgerundet, alle Ereignisse inkl. 52 Dependabot-Läufe `dynamic`); 23.–25.11. je ≈ 330 min | Jobs-API über alle Läufe ab 01.11. *gemessen*; Abrechnungsseite nicht lesbar, Rückstellung zum 01.12. *angenommen* |
| Folge Minuten | die „~200 min Rest" aus Abschnitt 1 gelten nicht mehr; der Rest bis Monatsende reicht für Schritt 10 + Fehlerfall. Im Tempo vom 23.–25.11. wäre das private Kontingent nach ≈ 3 Tagen erschöpft – ein Grund **für** den Umzug | aus den Zeilen oben gerechnet |
| Lehrbuch-Fremdtext | 8-Wort-Folgen gegen den Westermann-Volltext (`ap1-buch/_aufbereitung`): 206 Treffer in 19 Dateien, fast nur Gesetzestext (DSGVO Art. 32, BBiG) und Zahlenfolgen – **keine Übernahme gefunden** | Skript der Sitzung, *gemessen* (deckt Abschnitt 7 „sinngemäß übernommener Fremdtext" nur für wörtliche Folgen ab) |
| Wortlaut der K3-Vorlage | ≈ 8 % der 6-Wort-Folgen der privaten Abschrift stehen im Pool (v. a. `pool/pool_m_k3_b.json`); darf öffentlich werden, **aber nicht als solcher gekennzeichnet** (O10) → Schritt 4a **✅ erledigt 26.11.** | *gemessen*; Nutzer-Entscheid 25.11. |
| Live-App | ohne Anmeldung erreichbar (HTTP 200) – der Pool ist schon heute öffentlich sichtbar | `curl` *gemessen* |
| Cloud-Sitzungen mit Alt-Klon | K3-Arbeiter A–D (Cloud, ruhend), K3-Leitung (Brücke, ruhend), die Sitzung dieser Nachmessung – **neue Lücke**, Schritt 6.0 | `list_sessions` *gemessen* |
| Inventur Schritt 2 | Stand 19.10. (`_to_delete/helfer/schritt2_inventur.md`, nur PC) – am Umzugstag vom PC per `gh api` neu lesen | – |

## 2. Entscheidungen (alle getroffen; Fragetexte und nicht gewählte Optionen: Abschnitt 6)

**✅ ENTSCHIEDEN (Nutzer, 18.10.2026, Cloud-Leitung, BUILD_LOG 226):** O1 **erst privat**, nach grüner Probe öffentlich · O2 **`v2.10.5` automatisch** durch die CI ·
O3 **nichts mitnehmen** · O4 **archivieren erst nach grüner Probe (Schritt 17)** · O5 **neutral umschreiben** (Kommentare/Doku; Suchmuster der Wächter
`4e14_veroeffentlichung.sh`/`umzug_v3_probe.sh` bleiben; `referenz/` nur Kommentarzeilen, Regel geschärft – `SCHIENE_NEU.md` E60) · O6 **kein Probe-Release** ·
O7 **alten Cloudflare-Token weiterverwenden** (Secret im Alt-Repo trotzdem löschen) · O8 **erledigt** (Stash verworfen, BUILD_LOG 225) ·
O9 Beschreibung **„AP1-Lernprogramm für die FISI-Ausbildung“**.
**Neu aufgenommen:** (a) `.claude/settings.json` ist eingecheckt (Start-Haken `tools/postfach.sh`, Freigaben) und **wandert mit** – der Name des privaten Postfach-Repos wird öffentlich (Schritt 4, 8, 14);
(b) `Fisi2026/ap1-postfach` bleibt privat und **zieht nicht um** (Schritt 14, 16); (c) Actions-Minuten: das private neue Repo zählt bis zum Öffentlich-Schalten gegen dieselben 2000 min des Kontos
(~1800 verbraucht, ~17 min je Lauf) – die Schritte sind so geordnet, dass bis dahin **ein** Lauf entsteht (Schritt 10), ein zweiter nur im Fehlerfall; nach dem Umschalten sind Standard-Runner frei (*angenommen*, Doku).

---

## 3. Ablaufbuch

### Phase A – Vorbereitung (Stunden bis Tage vorher, ohne Risiko)

**Schritt 1 – Ausgangszustand messen und festschreiben** · **[PC]** (Training Shell)
- Befehle (im Projektordner):
  ```
  git fetch origin && git status --porcelain          # leer
  git stash list                                      # leer erwartet (O8: Stash verworfen, BUILD_LOG 225)
  python3 tools/ungepusht.py                          # 0 offen
  git ls-remote --tags origin v2.13.1                 # Tag da
  bash ci2.sh                                         # URTEIL-Zeile grün
  ```
- Erwartet: Baum leer, kein Stash (O8 erledigt), 0 offen, Tag da, URTEIL grün, **Schritt 4a erledigt** (Prüfzeile dort). Hier **keinen** CI-Lauf anstoßen (Minuten des Kontos) – nur `bash ci2.sh` lesen.
- Rückweg: nichts geändert. Ist etwas rot, wird der Umzug verschoben.

**Schritt 2 – Inventur des alten Repos** · **[N]** (⚠️ 25.11.: gefahren am 19.10., Ergebnis nur auf dem PC; am Umzugstag vom PC per `gh api` neu lesen – BUILD_LOG 231 zeigt, dass der PC diese Endpunkte lesen darf) (liest ab und schreibt die Antworten in den Chat; die Cloud-Sitzung kann diese Seiten nicht lesen)
Alles in `github.com/Fisi2026/ap1-lernprogramm` → *Settings*. Je Zeile: Ist-Wert notieren, **nichts ändern**.

| Ort in der Oberfläche | Was ablesen | Warum |
|---|---|---|
| *Settings → General* | Name, Sichtbarkeit; *Features*: Issues, Wikis, Discussions; *Pull Requests*: erlaubte Merge-Arten, „Automatically delete head branches" | im neuen Repo nachbauen (N41 S6: `delete_branch_on_merge`) |
| *Settings → Actions → General* | *Actions permissions* (Vorgabe laut BUILD_LOG 117/220: „Allow … select actions", **Require actions to be pinned to a full-length commit SHA**, erlaubte Liste); *Workflow permissions* (Read/Write); *Fork pull request workflows* | N41 S2 muss **vor dem ersten Push** im neuen Repo stehen (siehe Schritt 7), sonst `startup_failure` (BUILD_LOG 222) |
| *Settings → Secrets and variables → Actions* (Reiter *Secrets*, *Variables*) | **nur die Namen** (Werte kann GitHub nicht anzeigen). Erwartet: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (DEPLOY.md). Weitere Namen? Variablen? | Secrets lassen sich **nicht kopieren** – neu tippen (Schritt 7) |
| *Settings → Secrets and variables → Dependabot* | Namen | wie oben |
| *Settings → Environments* | gibt es welche (z. B. `production`)? | `ci.yml` nennt keine; *angenommen*: keine |
| *Settings → Webhooks* und *Settings → Deploy keys* | Anzahl, Ziel-Adressen | Webhooks/Schlüssel wandern nicht mit |
| *Settings → Branches* / *Rules → Rulesets* | leer (privat, Free) | Rückfrage ob doch etwas steht |
| *Settings → Code security* (Doku: *Advanced Security*) | Dependabot alerts, Dependabot security updates, Secret scanning | im neuen Repo neu einschalten (Schritt 13, nach dem Öffentlich-Schalten) |
| *Settings → Integrations → GitHub Apps* (bzw. `github.com/settings/installations`) | ist die **Claude**-App am Repo, „All repositories" oder „Only select"? | Schritt 16 |
| *Settings → Collaborators* | wer hat Zugriff | neue Einladungen nötig, falls jemand außer `Fisi2026` |
| *Settings → Pages* | aus (`has_pages=false`, gemessen) | – |
| Cloudflare → *Workers & Pages* → `ap1-lernprogramm` → *Settings* → *Build* | „Git repository": **getrennt** (DEPLOY.md: 26.09. getrennt) | bleibt getrennt; verbunden würde Cloudflare vom alten/neuen Repo selbst bauen |
| Cloudflare → *My Profile → API Tokens* | Name, Ablaufdatum, „Last used" des bisherigen Tokens | O7: **derselbe Token bleibt in Gebrauch** (Schritt 5); sein Ablaufdatum muss hinter dem Umzugstag liegen |
- Rückweg: nichts geändert.

**Schritt 3 – Zugriffswege prüfen (nichts wird mitgenommen)** · **[PC]**
O3: **keine** alten Releases/Tags ziehen um; die 92 Releases und 98 Tags bleiben im Archiv lesbar, im neuen Repo zählt nur der Stand, `CHANGELOG.md` erzählt die Versionen.
Wo kommen `.plugin` / `.mcpb` her? Gemessen im Code: `tools/werkzeug_release.sh` baut sie (`tools/plugin/packen.py`, `tools/training-shell/einspielen.sh --nur-packen`) und
hängt sie an das Release `werkzeuge-fisi<v>-shell<v>` **des aktuellen `origin`**; der Skill holt sie mit `gh release download <tag> -p '*.plugin'`
(`tools/plugin/fisi/skills/fisi-lernapp/SKILL.md:78`), die Cloud-Seite über `gh api repos/Fisi2026/ap1-lernprogramm/releases/…` nach `add_repo` (`regeln/bruecke.md:175`),
`projekt_einstieg.md:30` verweist auf *github.com/Fisi2026/ap1-lernprogramm → Releases*. **Folge:** im neuen Repo gibt es zunächst **kein** Werkzeuge-Release; Schritt 15 legt es neu an (Quellen im Baum, nichts wird heruntergeladen).
Die installierten Plugins und die Training-Shell-Erweiterung liegen lokal in den Claude-Apps und hängen **nicht** am Repo (*angenommen*: `manifest.json` kennt nur den Ordner `projektordner`).
- Prüfen: `git ls-files tools/plugin tools/training-shell | head` zeigt die Quellen – damit ist Schritt 15 ohne Alt-Repo machbar.
- Rückweg: nichts geändert.

**Schritt 4 – Generalprobe** · **[PC]** oder **[C]**
```
bash tools/umzug_v3_probe.sh --probe        # Selbsttest: 14/14 richtig (2 grüne, 12 rote Fälle; einer davon: .claude/settings.json fehlt im Baum)
bash tools/umzug_v3_probe.sh                # Baum aus HEAD, EIN Commit als ap1, prüfen
bash tools/umzug_v3_probe.sh --voll         # zusätzlich voller check.sh im Temp-Baum
```
- Erwartet: `PROBE: 14/14 richtig …`, `UMZUG: Baum gruen (1 Commit von ap1, …)` samt Zeile „.claude/settings.json im Baum: ja", bei `--voll` am Ende `check.sh im Temp-Baum rc=…` (Ergebnis und Abweichungen siehe Abschnitt 5).
- Rückweg: Probe schreibt nur nach `$TMPDIR` und löscht sich; Projekt-`.git` wird gelesen, nie geschrieben.
- ⛔ Findet sie etwas: Umzug stoppen, Fund beheben, **erst dann** weiter. Kein Weg an der Probe vorbei.

**Schritt 4a – Kennzeichnung der K3-Vorlage entfernen (O10)** · **✅ erledigt 26.11.2026 (gmail, BUILD_LOG 281)**, normaler Commit auf `main`, **vor** Schritt 6
Der Wortlaut darf öffentlich werden, aber nirgends als Wortlaut der K3-Vorlage erkennbar sein. Umgeschrieben (gemessen 26.11.):
- App-Inhalt: `pool/pool_m_k3_b.json` (Präfix „Klausuraufgabe … (…):“ ×11 → „Aufgabe 1A:“/„1B:“/„5:“, Zusatz-Zeile ×2), `pool/pool_m_k3_d.json` (×1), `pool/sets/klausur_k3.json` und
  `tools/klausur_k3/set_bauen.py` (Set-Name → „Klausur 3“), `03_IT-Systeme_Hardware_Wirtschaftlichkeit.md:191` (→ „Klausur 3 (LF3)“), Schnappschuss `neu/src/huelle/__schnappschuss__/bereich-unterricht.txt`, danach Bau `v2/`.
- Doku: `docs/plaene/PLAN_KLAUSUR3.md` (9 Stellen), `tools/klausur_k3/auftraege.md` (6), `tools/klausur_k3/musterfirma.md` (1), `CHANGELOG.md:24`, `BUILD_LOG_ARCHIV.md` (4), dieses Ablaufbuch – neutral „K3-Vorlage“; Dateiname der privaten Abschrift nur noch als Ordner `klausur_k3/`.
- **Nicht** gemeint (anderer Sinn): „Klassenlehrer"/„Berufsschullehrer" (`04_…md`, `pool_m08.json`), „handschriftliche Unterschrift" (`pool_m08.json`), „laut Lehrer" zur Probeklausur 30.07. (`gebiete.ts:82`, `referenz/logik.js:177`).
- Regel für die Umschrift: neutral („Aufgabe 1A:", „Zusatz:", Set „Klausur 3"); Inhalt und Punkte bleiben. Die Quelle bleibt privat in `ap1-buch/klausur_k3/`.
- Prüfen: `bash tools/umzug_v3_probe.sh` (Klasse „Vorlage“, Muster `M_VORLAGE`, Gegenprobe in `--probe`) meldet nichts – seit 26.11. Teil der Generalprobe (Schritt 4).
- Rückweg: normaler Folgecommit.

**Schritt 5 – Cloudflare-Token bereitlegen (O7: der bisherige Token bleibt)** · **[N]** (Cloudflare)
Es wird **kein** neuer Token erstellt. Nötig sind zwei Werte, **nur im Browser/Passwortverwaltung/Zwischenablage halten – nie in den Chat, nie in einen Dateinamen** (DEPLOY.md, 26.09.):
den **Wert** des bisherigen `CLOUDFLARE_API_TOKEN` (Vorlage „Edit Cloudflare Workers" + *Account → D1 → Edit*) und die *Account ID* (*Workers & Pages* → Übersicht).
- ⚠️ *Angenommen* (Cloudflare-Verhalten): ein Token-Wert wird nur **bei der Erstellung** angezeigt. Liegt er nicht mehr vor (GitHub zeigt Secret-Werte ebenfalls nie), bleibt in *My Profile → API Tokens* → Token → *Roll*: gleicher Token, neuer Wert – der alte Wert wird dabei ungültig (das Alt-Repo liefert ohnehin nicht mehr aus, Schritt 6.2). Das ist dann kein Austausch des Tokens, nur der Zeichenfolge.
- Prüfen: Token steht in der Liste, ist aktiv, **Ablaufdatum hinter dem Umzugstag** (DEPLOY.md, Token-Pflege NP2); Account ID liegt bereit.
- Rückweg: nichts geändert. (Das Alt-Repo-Secret wird trotzdem in Schritt 17 gelöscht, der Token selbst **nicht** widerrufen – er läuft weiter im neuen Repo.)

### Phase B – Umzug (die eigentliche Sitzung)

**Schritt 6 – Altes Repo stilllegen und umbenennen** · **[N]** (+ **[PC]** für die Weiche)
0. **✅ erledigt 26.11. (BUILD_LOG 283).** **Cloud-Sitzungen zuerst (neu 25.11.):** Jede Cloud- oder Brücken-Sitzung mit einem Klon des Alt-Repos könnte nach Schritt 7 einen neuen Zweig in das **neue** Repo pushen –
   mit der kompletten alten Historie samt privater Adresse (Abschnitt 7). Darum vor dem Umbenennen **alle** solchen Sitzungen archivieren (claude.ai/code; 25.11.: K3-Arbeiter A–D,
   K3-Leitung, die Nachmess-Sitzung) und keine neue gegen den alten Namen starten. Ob die App-Freigabe an der Repo-ID (BUILD_LOG 231) so einen Push schon verhindert, ist *nicht gemessen*.
   Prüfen: `list_sessions` zeigt keine laufende/ruhende Sitzung mit dem Repo außer der Umzugs-Sitzung, die selbst nicht pusht.
1. **Weiche zuerst, auf JEDEM PC:** damit der alte Klon später nie in das neue Repo schiebt (zwischen Schritt 7 und 9 ist das neue Repo leer, ein Push des alten `main` würde die
   komplette alte Historie samt privater Adresse hineinlegen):
   ```
   cd <alter Projektordner> && git remote remove origin && git remote -v      # keine Ausgabe
   ```
   (Der alte Ordner wird in Schritt 14 ohnehin weggestellt. *Gemessen* im Code: kein Skript braucht `origin` ohne `git fetch` davor.)
2. *Settings → Actions → General* → **Disable actions** (verhindert, dass das Alt-Repo mit den alten Secrets noch einmal nach Cloudflare ausliefert **und** Minuten des Kontos verbraucht) – Rückweg: wieder *Allow*.
3. *Settings → General → Repository name* → `ap1-lernprogramm-archiv` → *Rename*. Doku (Renaming a repository): Git-Zugriffe und Links auf den alten Namen werden **umgeleitet**, aber
   „reusing the original name of the renamed repository for a future repository stops redirects … from working", und **Aufrufe einer Action in einem umbenannten Repo werden nicht umgeleitet**.
   Beides ist hier gewollt: nach Schritt 7 zeigt der alte Name auf das **neue** Repo.
4. **Nicht archivieren** (O4: erst in Schritt 17 nach grüner Probe). Archiviert = schreibgeschützt (Doku: Issues, PRs, Code, Releases, Tags, Branches read-only); ein Rückweg
   per Umbenennen bräuchte erst *Unarchive*.
- Prüfen: `gh repo view Fisi2026/ap1-lernprogramm-archiv --json name,isPrivate,isArchived` → `…-archiv`, `true`, `false`. `curl -sI https://github.com/Fisi2026/ap1-lernprogramm` → noch 301 auf `-archiv`. *Gemessen 26.11.:* anonym **404** statt 301 – ein privates Repo leitet für Unangemeldete nicht um; die Prüfung gilt per `gh` (angemeldet).
- Rückweg (solange das neue Repo noch nicht existiert): *Settings → General* → Name zurück auf `ap1-lernprogramm`; Actions wieder an; `git remote add origin https://github.com/Fisi2026/ap1-lernprogramm` auf den PCs.

**Schritt 7 – Neues Repo PRIVAT anlegen und vorbereiten (VOR dem ersten Push)** · **[N]**
1. `github.com` → **+** → *New repository*: Owner `Fisi2026`, Name **`ap1-lernprogramm`**, Sichtbarkeit **Private** (O1), Beschreibung **„AP1-Lernprogramm für die FISI-Ausbildung“** (O9; Themen leer),
   **ohne** README, `.gitignore`, Lizenz (sonst gibt es einen zweiten Commit und der Erstcommit wäre nicht mehr der erste).
2. *Settings → Actions → General* (N41 S2, Werte aus Schritt 2): *Actions permissions* → „Allow Fisi2026, and select non-Fisi2026, actions and reusable workflows" mit **„Allow actions created by GitHub"**
   (alle drei Actions in `ci.yml` sind GitHub-eigen, *gemessen*) und **„Require actions to be pinned to a full-length commit SHA"**; *Workflow permissions*: Read; Fork-PR-Workflows: Freigabe verlangen
   (Vorgabe für öffentliche Repos, *angenommen*). Doku (Managing GitHub Actions settings): bei einer Erlaubnisliste passen Einträge mit Tag/Branch nicht – hier ohne Belang, weil `ci.yml` am vollen SHA steht.
   ⛔ **Nicht** „Allow select actions" aktivieren, ohne die Häkchen zu setzen: dann `startup_failure` wie bei BUILD_LOG 222. **Das ist der teuerste Fehler dieses Schritts:** ein verpasster Lauf kostet ~17 min des Kontos – deshalb vor dem Push gegenlesen (Prüfen unten).
3. *Settings → Secrets and variables → Actions → New repository secret* ×2: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (Werte aus Schritt 5). Setzt man sie **vor** dem ersten Push, beweist der **eine** CI-Lauf Deploy und Tag in einem;
   ohne sie überspringt der Deploy-Job mit Warnung (`ci.yml`, „Ohne Token kein Deploy") und man bräuchte einen zweiten Lauf (`gh workflow run CI --ref main`, wieder ~17 min).
4. **Nicht** hier: *Private vulnerability reporting*, Ruleset, Dependabot-Schalter – sie gelten laut Doku für öffentliche Repos bzw. fehlen im privaten Free-Repo (Ruleset: 403, *gemessen* am Alt-Repo) und kommen in Schritt 13.
- Prüfen: `gh repo view Fisi2026/ap1-lernprogramm --json isEmpty,isPrivate,description,defaultBranchRef` → leer, `isPrivate: true`, Beschreibung wie O9; `gh api repos/Fisi2026/ap1-lernprogramm/actions/permissions` (nur vom PC, Cloud-Proxy sperrt) zeigt `sha_pinning_required: true`.
  `gh secret list -R Fisi2026/ap1-lernprogramm` (PC) nennt beide Namen.
- Rückweg: Repo löschen (*Settings → General → Danger Zone → Delete this repository*) und Schritt 7 wiederholen – verliert nichts, solange noch nichts gepusht ist. Alt-Repo bleibt unberührt.

**Schritt 8 – Erstcommit bauen und prüfen** · **[PC]**
Der Baum entsteht aus `git archive HEAD` in einem **neuen** Ordner (nie `git init` im Arbeitsordner, nie `git add -A` dort):
```
bash tools/umzug_v3_probe.sh --ausgabe ../Training_erstcommit
cd ../Training_erstcommit
git log --format='%an | %ae | %cn | %ce' | sort -u      # genau: ap1 | ap1@users.noreply.github.com | ap1 | ap1@users.noreply.github.com
git rev-list --count HEAD                                # 1
git remote -v                                            # leer
git ls-files .claude                                     # genau: .claude/settings.json (Start-Haken + Freigaben wandern mit)
```
- Erwartet: `UMZUG: Erstcommit-Baum liegt in … (kein Remote, nichts gepusht)`. Bei rotem Befund löscht das Skript den Ordner wieder. Fehlt `.claude/settings.json` im Baum, meldet die Probe „Einstellungen: …" (Ursache wäre eine fehlende `.gitignore`-Ausnahme `!.claude/settings.json`).
- Hinweis zum Postfach-Haken: im neuen Klon läuft `tools/postfach.sh start` beim Sitzungsstart; ohne Zugriff auf das private `Fisi2026/ap1-postfach` meldet er „nicht erreichbar" und endet mit 0 (Schritt 14, 16).
- Hinweis: Das Skript schaltet die globale/System-Git-Konfiguration nur für seinen eigenen Commit aus. Danach (`git push`) gilt wieder die normale Konfiguration – das schadet nicht, es steht nur der Commit.
- Rückweg: Ordner löschen.

**Schritt 9 – Push (der Umzug)** · **[PC]**
```
cd ../Training_erstcommit
git remote add origin https://github.com/Fisi2026/ap1-lernprogramm.git
git push -u origin main                                  # NIE --force
git ls-remote origin refs/heads/main                     # = git rev-parse HEAD
```
- Erwartet: Push ok, `ls-remote` nennt denselben Commit. **Abgelehnt oder „remote not empty" → STOPP, melden, nichts erzwingen** (Regel `regeln/git.md`).
  Blockiert GitHub den Push wegen *Push protection* (Secret-Muster), dann ist die Probe unvollständig: Fund beheben, Ordner neu bauen (Schritt 8).
- Anmeldung: der Git Credential Manager (`DEPLOY.md`: „Windows-Anmeldeinformationsverwaltung") fragt ggf. per Browser nach – *angenommen*, gleiche Anmeldung wie beim alten Repo.
- **Minutenbudget:** dieser Push startet den **einen** geplanten CI-Lauf (~17 min des Kontos). Danach **kein weiterer Push** in das private Repo, bis Schritt 12 durch ist.
- Rückweg: Repo löschen und ab Schritt 7 neu (siehe dort); der Erstcommit darf neu gebaut werden, solange das Repo privat und nichts veröffentlicht ist (O1).

**Schritt 10 – CI messen (Tag und Deploy)** · **[PC]** (und **[C]**)
```
bash tools/ci_warte.sh            # im Hintergrund; oder: bash ci2.sh
gh run list --workflow ci.yml --branch main --limit 1 --json status,conclusion,headSha
git ls-remote --tags origin       # erwartet: refs/tags/v2.13.1
```
- Erwartet (nach `ci.yml`, gelesen): Jobs `pruefung`, `suiten`, `tests`, `semgrep`, Sammel-Job „check.sh (voll)", dann `release` (legt aus `neu/package.json` das Tag **`v2.13.1`** an,
  Notizen aus `CHANGELOG.md` Abschnitt `## v2.13.1`) und `deploy` (D1-Migrationen: „No migrations to apply" *angenommen*, `wrangler deploy`). BUILD_LOG 222 hat den ersten Gesamtlauf mit 6:52 gemessen.
  Der Schritt „Herkunft von v2/ bescheinigen" läuft **nur im öffentlichen Repo** (`!github.event.repository.private`, `ci.yml:409`) – in diesem (privaten) Lauf ist er **übersprungen**; das ist hier richtig. Er wird in Schritt 12 gemessen.
  Der Job `release` legt das Tag nur bei `push` an (`ci.yml`, `if: github.event_name == 'push' …`); der spätere Handstart in Schritt 12 (`workflow_dispatch`) legt kein zweites Tag an, deployt aber (`deploy`-Bedingung nennt `workflow_dispatch`, *gelesen*).
- Bekannter Stolperstein (*angenommen*, Code gelesen): `tools/waechter/4e2b2c_ci.sh` meldet auf dem PC „liefert keine auswertbare Antwort – Werkzeug stumm", solange das neue Repo **noch keinen** Lauf hat.
  Er wird grün, sobald der erste Lauf fertig ist; bis dahin keinen weiteren Commit vorbereiten.
- **Minuten:** ~17 min (gemessen am Konto, Angabe der Leitung; BUILD_LOG 222 nennt 6:52 Laufzeit als Wanduhrzeit, die Runner-Minuten sind die Summe der parallelen Jobs). Bleibt der Lauf rot wegen einer Einstellung, ist der **zweite** (und letzte vor dem Umschalten) erlaubte Lauf fällig – nicht mehr: bei zweitem Rot **stoppen und melden**, nicht weiter probieren (Rest des Kontos ≈ 200 min).
- Rückweg bei rot: **kein** `--force`, kein leerer Commit. Ursache aus `bash ci2.sh` lesen. Ist sie ein Einstellungsfehler (Actions-Erlaubnis, Secret fehlt/falsch): korrigieren und
  *Actions → CI → Re-run* bzw. `gh workflow run CI --ref main`. Ist sie ein Baumfehler: normaler Folgecommit. Ist der Erstcommit selbst unbrauchbar (z. B. falscher Autor): Repo löschen, ab Schritt 7.

**Schritt 11 – Live-Probe** · **[PC]** oder **[C]**
Beachte die Falle aus `regeln/git.md` (14.10.): `WebFetch` puffert 15 Minuten je URL – **immer `?v=<kurz-sha>`**.
```
SHA=$(git rev-parse --short origin/main)
curl -s "https://ap1-lernprogramm.fisi2026lernapp.workers.dev/app-sw.js?v=$SHA" | grep -o 'var CACHE = "[^"]*"'
grep -o 'var CACHE = "[^"]*"' v2/app-sw.js        # beide Zeilen gleich
```
- ⚠️ **Grenze der Probe:** Der Erstcommit hat **denselben Bau** wie der bisherige Live-Stand (`ap1-app-<Version>-…`, 25.11.: 2.13.1). Die Cache-Zeile ist also vorher und nachher gleich – sie beweist „Live = Bau des neuen Repos",
  **nicht** „das neue Repo hat ausgeliefert". Den Beleg für den Deploy liefern: (a) der grüne `deploy`-Job im Lauf des neuen Repos (`gh run view <id>`), (b) `cd <Projekt> && npx wrangler deployments list`
  (zeigt Zeitpunkt und Quelle der jüngsten Version; *angenommen*: `wrangler login` besteht auf dem PC, DEPLOY.md), (c) Cloudflare → *Workers & Pages* → `ap1-lernprogramm` → *Deployments*. Ein Probe-Release 2.10.6 gibt es nicht (O6).

**Schritt 12 – Öffentlich schalten (O1)** · **[N]**, erst wenn Schritt 10 und 11 grün sind
Veröffentlichung ist **nicht rücknehmbar** (Forks, Caches, Suchmaschinen) – deshalb erst jetzt, mit dem gemessenen Lauf im Rücken.
1. **Letzte Prüfung vor dem Klick** · **[PC]**/**[C]**: `bash tools/umzug_v3_probe.sh` (frischer Lauf, grün) · `gh api repos/Fisi2026/ap1-lernprogramm/commits?per_page=3 --jq '.[].commit.author.email'` → nur `ap1@users.noreply.github.com` ·
   `gh repo view Fisi2026/ap1-lernprogramm --json description,isPrivate` → Beschreibung (O9) steht · im Baum liegt `.claude/settings.json` (nennt `ap1-postfach` – bewusst öffentlich).
2. **[N]** *Settings → General → Danger Zone → Change repository visibility* → **Make public** (Menüpfad *angenommen*, Doku „Setting repository visibility"; GitHub verlangt zur Bestätigung das Eintippen des Repo-Namens – am Bildschirm gegenlesen).
3. **Danach, in dieser Reihenfolge:**
   a. `gh repo view Fisi2026/ap1-lernprogramm --json isPrivate -q .isPrivate` → `false`.
   b. **Private Vulnerability Reporting** und das **Ruleset** (Schritt 13.1/13.3) setzen – beides geht laut Doku erst jetzt (*angenommen* für PVR; Ruleset im privaten Free-Repo: 403, *gemessen* am Alt-Repo).
   c. **Zweiter Lauf, jetzt öffentlich und (angenommen) ohne Minutenverbrauch:** `gh workflow run CI --ref main` · **[PC]**. Er führt die **Herkunftsbescheinigung** (`ci.yml:409`) zum ersten Mal aus und deployt erneut denselben Stand (D1: keine neue Migration, *angenommen*).
      Messen: `bash ci2.sh` (URTEIL) · `gh run view <id> --json jobs --jq '.jobs[] | select(.name|test("Deploy")) | .steps[] | select(.name|test("Herkunft")) | .conclusion'` → `success` ·
      `gh attestation verify v2/app-sw.js --repo Fisi2026/ap1-lernprogramm` (DEPLOY.md:69; Prüfung für ein einzelnes `v2/`-Artefakt, *angenommen* passend zur Bescheinigung von `v2/**`).
      Ob die Standard-Runner jetzt wirklich nichts mehr vom Konto abziehen: Kontostand der Actions-Minuten **vor** und **nach** dem Lauf ablesen (*Settings → Billing and plans* des Kontos, Menüpfad *angenommen*) – das ist die Messung, die die Annahme belegt oder widerlegt.
- Prüfen: Schritt 13 (Endzustand `.private=false`); `ci.yml:409`-Schritt im Lauf **nicht** „skipped".
- Rückweg: Sichtbarkeit lässt sich zurückstellen, **das Veröffentlichte nicht**. Wer nach dem Umschalten etwas Verbotenes findet (Geheimnis!): Wert widerrufen, nicht nur Datei löschen – Historie, Forks und Caches behalten sie.

**Schritt 13 – Einstellungen im neuen Repo (N41-Anteile, jetzt im öffentlichen Repo)** · **[N]**
Reihenfolge: erst die zwei Einstellungen, die der Rest braucht. Sie stehen **nach** dem Umschalten, weil sie laut Doku öffentliche Repos voraussetzen (PVR) bzw. im privaten Free-Repo fehlen (Ruleset).
1. **Private vulnerability reporting** an: *Settings → Advanced Security* (Doku: „Security and quality") → *Private vulnerability reporting* → *Enable*. Gilt nur für **öffentliche** Repos (Doku).
   Danach `SECURITY.md` Zeilen 12–14 („Der Weg ist erst aktiv …") streichen (Folgecommit, [C]/[PC]).
2. **Dependabot alerts** und **Dependabot security updates** an (gleiches Menü). `.github/dependabot.yml` ist im Baum.
3. **Ruleset für `main`** (N41 S1, E70): *Settings → Rules → Rulesets* (Doku: „Settings → Rulesets → New ruleset → New branch ruleset"), Ziel `main` (Default branch), **nur**
   „Restrict deletions" und „Block force pushes" (beide per Vorgabe an, Doku), **keine** PR-Pflicht, **keine** Statusprüfung (E70). Im privaten Free-Repo ging das nicht (403, gemessen).
4. `delete_branch_on_merge` an (Wert aus Schritt 2).
5. Weitere N41-Punkte (CodeQL, Secret scanning + Push-Schutz, Scorecard) sind **eigene Etappen** nach dem Umzug – hier nicht.
- Prüfen: `gh api repos/Fisi2026/ap1-lernprogramm --jq '.private,.delete_branch_on_merge'` → `false`/`true` (`false` = öffentlich, Schritt 12); Reiter *Security* zeigt „Report a vulnerability" (so prüft es `SECURITY.md` selbst).
- Rückweg: jede Einstellung ist einzeln umkehrbar.

**Schritt 14 – Beide PCs umhängen** · **[PC]** (je PC einmal; Reihenfolge: der PC, der gerade arbeitet, zuerst)
Empfehlung: **frischer Klon an denselben Pfad**, damit Training Shell (`projektordner`), Cowork-Ordnerfreigabe und `projekt_einstieg.md` unverändert passen (*angenommen*: die Freigabe hängt am Pfad).
```
cd "$USERPROFILE/Claude/Projects"
mv Training Training_alt_<JJJJ-MM-TT>               # alter Ordner bleibt: _to_delete/, Stashes, lokale Zweige
gh repo clone Fisi2026/ap1-lernprogramm Training
cd Training
git config user.name ap1 && git config user.email ap1@users.noreply.github.com
powershell -ExecutionPolicy Bypass -File tools/einrichten.ps1          # oder: bash tools/einrichten.sh
bash tools/einrichten.sh --pruefen                                     # sagt, was OFFEN ist (npm, ../Buch)
bash tools/start.sh --neuer-chat gmail
```
- `.claude/settings.json` kommt mit dem Klon (`git ls-files .claude`); beim ersten Start einer Claude-Sitzung im Ordner fragt Claude Code ggf. nach Vertrauen für Projekt-Einstellungen/Haken (*angenommen*) – bestätigen. Das private `Fisi2026/ap1-postfach` zieht **nicht** um: `bash tools/postfach.sh start` muss dort wie bisher laufen (`gh auth login` des Kontos genügt, *angenommen*); ohne Zugriff meldet er nur „nicht erreichbar" und endet mit 0.
- Erwartet: `git rev-list --count HEAD` = 1 (+ spätere Commits), `git remote -v` zeigt `…/ap1-lernprogramm`, `start.sh` ohne ROT; Standzeile `LIVE … v2.13.1 · PUSH DURCH`; `git log -1 --format=%ae` = noreply.
- Mitnehmen aus dem alten Ordner (nur wenn nötig): ungepushte Zweige (`git branch -vv`), `_to_delete/helfer/*` (Arbeitsdateien; wird neu angelegt).
  ⛔ **Niemals** `git fetch`/`git pull` des neuen Repos in den alten Ordner und kein `git reset --hard` dort – die Historien sind unverwandt.
- Rückweg: `Training` löschen, `Training_alt_…` zurückbenennen, `git remote add origin …-archiv` (nur wenn der Umzug abgebrochen wird).
- Dasselbe auf dem **zweiten PC** (BUILD_LOG 53: „neuer PC"). Gemeinsamer Prüfbefehl: `git rev-parse origin/main` ist auf beiden gleich.

**Schritt 15 – Werkzeuge-Release im neuen Repo** · **[PC]**
```
bash tools/werkzeug_release.sh --pruefe        # rc 1: "RELEASE: FEHLT werkzeuge-fisi1.3.15-shell1.1.2"
bash tools/werkzeug_release.sh                 # baut, legt an: "RELEASE: angelegt …" + 3 Dateinamen
gh release view werkzeuge-fisi1.3.15-shell1.1.2 --json assets -q '.assets[].name'
```
- Erwartet: `fisi-1.3.15.plugin`, `training-shell-1.1.2.mcpb`, `projekt_einstieg.md`. Der Fingerabdruck in den Notizen entspricht den Quellen (`werkzeug_release.sh` prüft das selbst).
  Damit funktionieren `gh release download` im Skill und der Link in `projekt_einstieg.md:30` wieder; installierte Plugins brauchen **keine** Neuinstallation (Versionen unverändert, `tools/plugin/installiert.txt`).
- Rückweg: `gh release delete werkzeuge-… --cleanup-tag -y` und neu; das Alt-Repo-Release bleibt als Kopie.

**Schritt 16 – Claude-Zugriff: GitHub-App und Cloud-Sitzungen** · **[N]** und **[C]**
Doku (code.claude.com, „Claude Code in the cloud", 18.10.2026): Über die Browser-Verbindung kann eine Sitzung in ein **privates** Repo nur arbeiten, wenn die **Claude GitHub App** dort installiert ist
(*github.com/settings/installations*; „Repository access"); öffentliche Repos kann sie klonen.
1. **[N]** `github.com/settings/installations` → *Claude* → *Configure* → *Repository access*: bei „All repositories" nichts zu tun; bei „Only select repositories" **`ap1-lernprogramm` (das neue) hinzufügen**, das archivierte entfernen/behalten.
   Fehlt die Verbindung ganz: `https://claude.ai/connect-github` (Konto gmail, bei Bedarf web.de), App-Installation: `https://github.com/apps/claude/installations/select_target`.
2. **[N]** `claude.ai/code` → neue Sitzung → Repository-Auswahl: das **neue** `Fisi2026/ap1-lernprogramm` wählen, Zweig `main`. Gespeicherte Umgebungen (Netzwerk, Variablen, Setup-Skript) sind *angenommen* repo-unabhängig – im Menü der Umgebung gegenlesen.
   Laufende alte Sitzungen und die Leitung `session_018wmbbzt8G63TmfQMcCE6yZ` zeigen weiter auf das Alt-Repo; sie nicht weiterverwenden, sondern neu starten (Auftrag mitgeben).
3. Das **Postfach** (`Fisi2026/ap1-postfach`, privat, nicht umgezogen) braucht für Cloud-Sitzungen weiterhin `add_repo Fisi2026/ap1-postfach` bzw. die App-Freigabe dort; ohne sie meldet der Start-Haken „nicht erreichbar" (so in dieser Sitzung *gemessen*) und läuft weiter.
4. **[C]** Probe aus der neuen Sitzung: `list_repos` mit `query: ap1-lernprogramm` nennt das neue Repo; `add_repo Fisi2026/ap1-lernprogramm` (`access: push`) → klonen →
   `git push origin HEAD:refs/heads/probe/cloud-zugriff` → ok → `git push origin --delete probe/cloud-zugriff`. (Cloud-Push war am 12.10. *gemessen* möglich – gegen das alte Repo.)
   Bei Ablehnung: `read_documentation github.access` (Tool der Cloud-Sitzung).
- Rückweg: App-Zugriff wieder auf das alte Repo; neue Sitzungen gegen `…-archiv` (nur lesbar, wenn archiviert).

**Schritt 17 – Aufräumen und Alt-Repo archivieren (O4)** · **[N]**, erst wenn Schritte 10–16 grün sind (Probe grün, auch der Lauf aus Schritt 12)
1. Alt-Repo (`…-archiv`) → *Settings → Secrets and variables → Actions*: beide Secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) **löschen** (Hygiene, O7: der Token selbst bleibt gültig und im neuen Repo in Gebrauch – **nicht widerrufen**; GitHub zeigt Werte nie, aber das Archiv soll nichts ausliefern können).
2. Alt-Repo → *Settings → General → Danger Zone → Archive this repository*. Doku (Archiving repositories): danach schreibgeschützt; *Unarchive* macht es rückgängig.
3. Zweige und PRs bleiben im Archiv (25.11.: nur `main` + ein Sitzungszweig, 0 offene PRs); im neuen Repo gibt es nur `main`.
- Prüfen: `gh repo view Fisi2026/ap1-lernprogramm-archiv --json isArchived -q .isArchived` → `true`; `curl -sI https://github.com/Fisi2026/ap1-lernprogramm` → 200 (neues Repo, kein Redirect). Cloudflare → *API Tokens* → „Last used" des Tokens zeigt den Zeitpunkt des Laufs aus Schritt 12.
- Rückweg: *Unarchive*; Secrets neu tippen; Actions wieder an. Danach wäre nur noch das Zurückbenennen offen – möglich, solange das neue Repo gelöscht ist.

**Schritt 18 – Doku nachziehen** · **[C]/[PC]** (ein Commit auf `main`, Stand-Guard beachten)
`DEPLOY.md` (Zeilen 16, 54, 72, 158), `SECURITY.md` (12–14), `docs/plaene/PLAN_NEUBAU.md` (N40-Zeilen, E69), `BUILD_LOG.md`-Eintrag, `START_PROMPT.md` Standzeile nur falls nötig; Liste in Abschnitt 4.
Ab hier ist das Repo öffentlich und Pushes kosten (angenommen) keine Konto-Minuten mehr; vorher gab es höchstens die Läufe aus Schritt 10 und 12.
Das Projekt-Dokument „Training" in beiden Konten (gmail, web.de) wird **nicht** neu hochgeladen, solange sich `projekt_einstieg.md` nicht ändert.

## 4. Stellen im Repo, die Namen oder Alt-Repo voraussetzen (grep über `tools/`, `tools/plugin/`, `.github/`, `*.md`, `neu/`, `wrangler.jsonc`, Training-Shell-Code; *gemessen* 18.10.2026)
Suchbegriffe: `Fisi2026`, `ap1-lernprogramm`, `fisi2026lernapp`, `github.com/`, `releases/`, `--repo`, `gh release`, `gh run`, `gh api`, `add_repo`, „privat". Ohne Treffer: `neu/src`, `tests/`, `tools/training-shell/index.js`, `v2/_headers`,
`neu/index.html` (kein Repo-Name, keine GitHub-Adresse). Ausgenommen sind Verlaufsdateien (`BUILD_LOG*.md`, `*ARCHIV*.md`, `referenz/`, `entscheide/`, `docs/plaene/PLAN_NACHT_18-10.md`, `package-lock.json`-Fremdlinks).
**Ä** = nach dem Umzug zu ändern · **P** = prüfen/Voraussetzung · **–** = bleibt, weil der Name gleich bleibt.

| # | Datei:Zeile | Inhalt | |
|---|---|---|---|
| 1 | `DEPLOY.md:16` | „Privates Repo `Fisi2026/ap1-lernprogramm`" | **Ä** → öffentlich |
| 2 | `DEPLOY.md:158` | „Repo **privat**" im Datenschutz-Status | **Ä** |
| 3 | `DEPLOY.md:72` | „im öffentlichen Repo (nach N40 V3)" | **Ä** (Zusatz „seit 21.10."), wenn gelaufen |
| 4 | `DEPLOY.md:54` | „Eingerichtet am 26.09.2026 … Secrets gesetzt" | **Ä** Datum der Neu-Einrichtung ergänzen (Schritt 7.3) |
| 5 | `DEPLOY.md:44–52` | Einrichtung Secrets / Git-Anbindung trennen | – gilt als Rezept, wird in Schritt 5–7 neu gefahren |
| 6 | `DEPLOY.md:19`, `:69` | Remote-URL, `gh attestation verify … --repo Fisi2026/ap1-lernprogramm` | – (`:69` wirkt erst nach dem ersten Deploy im **öffentlichen** Repo) |
| 7 | `DEPLOY.md:7–8` | Live-URL, Projektname | – |
| 8 | `SECURITY.md:12–14` | „Der Weg ist erst aktiv, wenn … umgezogen" | **Ä** streichen nach Schritt 13.1 |
| 9 | `SECURITY.md:22` | Live-URL | – |
| 10 | `.github/workflows/ci.yml:406–409` | Bescheinigung nur `!github.event.repository.private` | **P** im privaten ersten Lauf übersprungen; läuft erst im zweiten Lauf nach Schritt 12; Kommentar „(nach N40 V3)" danach anpassen |
| 11 | `.github/workflows/ci.yml:367–368` | `secrets.CLOUDFLARE_*` | **P** Schritt 7.3 |
| 12 | `.github/workflows/ci.yml:279–350` | Release-Job: Tag aus `neu/package.json`, `gh release create` (Zeile 344) | **P** legt im neuen Repo das **erste** Tag `v2.13.1` (O2; 25.11.) |
| 13 | `.github/dependabot.yml` (ganz) | kein Repo-Name | **P** wirkt erst mit aktivem Dependabot (Schritt 13.2) |
| 14 | `ci2.sh:40,51,60,109,114` | `gh run list …` auf dem aktuellen `origin` | **P** erste Zeile leer, bis der erste Lauf da ist |
| 15 | `tools/ci_warte.sh:11,14` | `origin/main`, `gh run list … --commit` | **P** wie 14 |
| 16 | `tools/waechter/4e2b2c_ci.sh:25–35` | leere Laufliste → Meldung „Werkzeug stumm" | **P** *angenommen* rot bis zum ersten Lauf |
| 17 | `tools/werkzeug_release.sh:5,20,51` | `gh release view/create` am aktuellen `origin` | **P** legt im neuen Repo das erste Werkzeuge-Release (Schritt 15) |
| 18 | `tools/plugin/fisi/skills/fisi-lernapp/SKILL.md:78` | `gh release download <tag> -p '*.plugin'` | **P** braucht das Werkzeuge-Release im neuen Repo |
| 19 | `tools/plugin/fisi/skills/fisi-lernapp/SKILL.md:133` | `add_repo Fisi2026/ap1-lernprogramm (push)` | – Name gleich; **P** App-Zugriff (Schritt 16) |
| 20 | `regeln/bruecke.md:175`, `:218` | `add_repo …`, `gh api repos/…/releases/tags/<tag>` | – (Lehren-Text, nicht ändern); **P** wie 18/19 |
| 21 | `tools/plugin/projekt_einstieg.md:25,30` | `gh repo clone Fisi2026/ap1-lernprogramm`, „github.com/… → Releases" | – (`:30` stimmt erst nach Schritt 15) |
| 22 | `tools/plugin/projekt_einstieg.md:63` | Cloud-Sitzung anlegen (Repository wählen) | **P** Repo-Auswahl neu (Schritt 16) |
| 23 | `tools/einrichten.ps1:7` | `gh repo clone Fisi2026/ap1-lernprogramm "$env:USERPROFILE\Claude\Projects\Training"` | – |
| 24 | `tools/training-shell/manifest.json:42` | „Klon von Fisi2026/ap1-lernprogramm" (nur Beschreibung) | – |
| 25 | `tools/start.sh:19–28`, `tools/doku_commit.sh:17,21`, `tools/ungepusht.py:192` | lokaler Ref `origin/main`, `ls-remote` | – nach frischem Klon richtig; im alten Ordner **nicht** mehr benutzen |
| 26 | `wrangler.jsonc:2,13` | Worker-Name `ap1-lernprogramm`, D1 `ap1-meldungen` | – Cloudflare-Seite, nicht GitHub |
| 27 | `package.json:2`, `package-lock.json:2,7` | npm-Paketname `ap1-lernprogramm-betrieb` | – |
| 28 | `README.md:8`, `CHANGELOG.md:269`, `START_PROMPT.md:73`, `regeln/git.md:12` | Live-URL `…fisi2026lernapp.workers.dev` | – |
| 29 | `tools/schema/frage.schema.json:3`, `tools/build_schema.js:39` | `$id: https://ap1-lernprogramm/…` (Pseudo-URL) | – |
| 30 | `tools/buch_hochladen.sh:2,10,29`, `tools/einrichten.sh:123–142`, `tools/katalog/abdeckung.py:44,52`, `tools/katalog/katalog_parse.py:67,75`, `tools/plugin/projekt_einstieg.md:34,40` | `Fisi2026/ap1-buch` (**anderes**, privat bleibendes Repo) | – nicht betroffen |
| 31 | `tools/waechter/4e13_geheimnisse.sh:5` | Kommentar „das Repo ist privat" | **Ä** (nur Kommentar, optional) |
| 32 | `tools/ci_b5_entwurf.md:49` | „ubuntu-latest hat in privaten Repos 2 Kerne" | **P** öffentliche Repos: laut Doku (Enterprise-Cloud-Fassung der Runner-Seite) 4 vCPU/16 GB, kostenlos – Chance für die offene Aufgabe `tests`-Job 6:17 (BUILD_LOG 222/223); Seitenfassungen widersprechen sich, *angenommen*; **nach** dem Öffentlich-Schalten (Schritt 12, zweiter Lauf) messen |
| 33 | `docs/plaene/PLAN_NEUBAU.md:593–607` (N40), `:83,86` (E66, E69), `:603` | Plan-Text V3, „Release 2.3.3" | **Ä** Status ✅ + Widerspruch E69 auflösen (O2) |
| 34 | `docs/plaene/PLAN_NEUBAU.md:609–626` (N41 S2/S3/S6) | „im neuen Repo nach V3 NEU setzen" | **P** S2 und S6 stehen in Schritt 7/12; S3 bleibt offen |
| 35 | `docs/befunde/BEFUNDE_AUDIT.md:157,199` | „Repo privat (Free) …" | – Befund-Protokoll, bleibt Geschichte |
| 36 | `tools/s45_entwurf.md:11,24` | Entwurf mit Repo-Namen und harden-runner | – Geschichte (BUILD_LOG 223) |
| 37 | `tools/plugin/installiert.txt` | Konto/Version/Datum | – unverändert (Versionen bleiben) |
| 38 | `.claude/settings.json`, `.gitignore` (`.claude/*` + `!.claude/settings.json`) | Start-Haken `tools/postfach.sh start`, Freigaben; Ausnahme im Ignore | **P** wandert im Erstcommit mit (die Probe prüft es seit N40 V3); macht den Namen `ap1-postfach` öffentlich |
| 39 | `tools/postfach.sh:8,15,20`, `regeln/bruecke.md:248` | `REPO=Fisi2026/ap1-postfach` (privat, **zieht nicht um**) | – Name bleibt; **P** Zugriff aus dem neuen Klon und aus Cloud-Sitzungen (Schritt 14, 16) |
| 40 | `docs/plaene/PLAN_KLAUSUR3.md:63`, `tools/klausur_k3/auftraege.md:8` (neu 25.11.) | `Fisi2026/ap1-buch` (privat, bleibt) als Quelle der K3-Arbeiter | – nicht betroffen; Kennzeichnung dort: Schritt 4a (erledigt 26.11.) |
| 41 | Pool/Set/Lehrtext/Doku mit Kennzeichnung der K3-Vorlage (neu 25.11.) | Kennzeichnung | **Ä** vor Schritt 6 – ✅ erledigt 26.11. (Schritt 4a, O10) |

**Zahl der Fundstellen:** 41 Zeilen in der Tabelle (**Ä** 8: Nr. 1, 2, 3, 4, 8, 31, 33, 41 · **P** 13 · **–** 20; Stand 25.11., Zeilen 10–12 neu gezählt, 40–41 neu). Keine Datei im App-Code (`neu/src`) und kein Test setzt den Repo-Namen voraus.
**✅ Umgesetzt 26.11.2026 (Schritt 18, BUILD_LOG 285):** **Ä** Nr. 1, 2, 3, 4, 8, 33 (41 schon in Schritt 4a). Nr. 31 und der Kommentar zu Nr. 10 folgten am selben Tag (BUILD_LOG 286).

## 5. Ergebnisse der Generalprobe (18.10.2026, Stand `1d523d0`, *gemessen*)
**Nachtrag Fassung V3 (18.10.2026, Stand `14fb4f1` + Probe-Änderung, *gemessen*):** `--probe` jetzt **12/12** (2 grüne, 10 rote Fälle) – neu der Fall `settings_ohne_ignore_ausnahme`: in der Kopie fehlt die `.gitignore`-Zeile `!.claude/settings.json`, `git add -A` lässt die Datei still weg, die Probe meldet „Einstellungen: …". Der Normallauf zeigt zusätzlich „.claude/settings.json im Baum: ja"; Baum **881 Dateien, 16,4 MB, größte 2,7 MB**, Pack 5,32 MiB, Wächter 4e14 grün. Die unten stehenden Zahlen (870 Dateien, 11/11) sind der Stand vom Entwurf.
- `bash tools/umzug_v3_probe.sh --probe` → **11/11 richtig**: 2 grüne Fälle (sauberer Baum; web.de-Adresse + Herausgeber-Name ohne ©-Vermerk bleiben erlaubt) und 9 rote Sabotagen werden erkannt
  (Katalogdatei, `.tsv`, ©-Vermerk des Katalog-Herausgebers, Gmail-Adresse, Benutzerpfad, Token-Muster, Datei über der Größengrenze, Gmail als Autor, zwei Commits).
- `bash tools/umzug_v3_probe.sh` → Baum grün: 870 Dateien, 16,4 MB, 1 Commit von `ap1 <ap1@users.noreply.github.com>`, Sperrliste/Fremdtext/Gmail/Pfad/Token leer, Wächter 4e14 (aus dem Temp-Baum gesourct) grün.
  Hinweise ohne Urteil: 4 Dateien mit web.de-Adresse (erlaubt, Datenschutzhinweis), 19 Dateien nennen die Prüfungseinrichtung als Quellenname (O5), 6 Dateien enthalten „©" (Wächter-Quelltext, Pläne, Archiv, ein Fremdpaket-Kopf in `v2/assets/input-*.js`).
- `--voll` (voller `check.sh` im Temp-Baum, 870 Dateien, `node_modules` verlinkt): **2 Läufe, beide rc=1** – Lauf 1: „1 PROBLEM(E)“ (Zeile nicht erfasst, Ausgabe war auf 25 Zeilen gekürzt; das Skript zeigt seither alle `[FEHLER]`-Zeilen), Lauf 2: `test_freitext` und 2 vitest-Dateien (`schema.deckung.test.ts`, `validierung.gleichheit.test.ts`). Dieselben Dateien einzeln im Temp-Baum: **9/9 Tests grün, `suite.sh freitext` 38 OK** (im echten Baum im vollen Lauf grün). Ursache **angenommen**: Zeitüberschreitung unter Last (die Cloud-Maschine braucht für diese 9 Tests ~55–60 s; der volle Lauf dauerte >20 min statt ~5), nicht ein Baumfehler – nicht bewiesen. Der volle `check.sh` im echten Arbeitsbaum (inkl. dieser Dateien) war **ALLES GRÜN** (*gemessen*). Folge für den Umzugstag: `--voll` auf dem **PC** fahren (dort ~5 min), nicht in der Cloud.
  Der Temp-Baum hat keinen `origin`; Remote-Wächter (CI-Befund, Ungepusht) verhalten sich dort anders als im echten Klon – das ist **kein** Befund am Baum.

## 6. Nutzer-Fragen – alle entschieden (18.10.2026, Cloud-Leitung, BUILD_LOG 226)
Jede Frage bleibt mit ihrem Fragetext stehen; „✅ entschieden“ nennt die Wahl und die Schritte, in denen sie wirkt. Die nicht gewählten Optionen stehen nur hier, nicht mehr in den Schritten.
**O1 – Sichtbarkeit beim ersten Push.** (a) privat anlegen, pushen, CI und Probe messen, dann veröffentlichen · (b) gleich öffentlich anlegen.
**✅ entschieden: (a) erst privat, nach grüner Probe öffentlich.** Wirkt in Schritt 7 (Private), 9/10 (ein Lauf, Minutenbudget), **12 (Öffentlich schalten, eigener Schritt)**, 13 (PVR/Ruleset/Dependabot erst danach); `ci.yml:409` läuft erst im zweiten Lauf (Schritt 12).
**O2 – Erstes Tag im neuen Repo.** E69/N40 („Release 2.3.3 … erstes Tag", `docs/plaene/PLAN_NEUBAU.md:86,607`) ist überholt – `v2.3.3` existiert seit 10.10. (BUILD_LOG 124, `git ls-remote --tags`, *gemessen*), der Stand ist **v2.10.5** (`neu/package.json`, *gemessen*).
Ein Tag unter dem Stand hieße `neu/package.json` zurückzudrehen (Wächter `4e_versionen` und `app-sw` würden rot). Optionen: (a) `v2.10.5` automatisch · (b) zusätzlich Probe-Release 2.10.6 (O6) · (c) alte Tags nachbauen (O3).
**✅ entschieden: (a) `v2.10.5` automatisch durch die CI, kein weiteres Release.** Gemessen im Code: der CI-Job `release` legt beim ersten Lauf automatisch `v2.10.5` an (`CHANGELOG.md` hat `## v2.10.5`). Wirkt in Schritt 10; `docs/plaene/PLAN_NEUBAU.md` E69 ist in Schritt 18 nachzuziehen. (25.11.: sinngemäß `v2.13.1`, Abschnitt 1a.)
**O3 – Alte Releases/Tags mitnehmen?** (a) nichts mitnehmen · (b) nur das jüngste Werkzeuge-Release · (c) alle Tags auf den Erstcommit.
**✅ entschieden: (a) nichts mitnehmen** (die Historie ist der Zweck des Archivs; `CHANGELOG.md` erzählt die Versionen). Wirkt in Schritt 3 (nur noch Zugriffswege prüfen) und 15 (Werkzeuge-Release wird aus den Quellen neu gebaut).
**O4 – Archivieren wann?** (a) erst nach grüner Probe · (b) sofort bei Schritt 6.
**✅ entschieden: (a) erst nach grüner Probe (Schritt 17).** Der Rückweg per Umbenennen bleibt bis dahin offen; Actions im Alt-Repo sind ab Schritt 6 aus.
**O5 – Name der Prüfungseinrichtung als Quellenname in 19 Dateien** (z. B. `docs/plaene/PLAN_NEUBAU.md`, `tools/gebiete_stand.py`, `neu/src/kern/tabellen/gebiete.ts`, `referenz/*.js`): (a) so lassen · (b) neutral umschreiben · (c) einzeln entscheiden.
**✅ entschieden: (b) neutral umschreiben** (Kommentare/Doku; Suchmuster der Wächter `4e14_veroeffentlichung.sh` und `umzug_v3_probe.sh` bleiben; `referenz/` nur Kommentarzeilen, Regel geschärft – `SCHIENE_NEU.md` E60). Umgesetzt in eigenem Auftrag **vor** dem Umzug (Zweig `n40-o5`); die Probe zählt die Dateien als Hinweis ohne Urteil.
**O6 – Probe-Release 2.10.6?** (a) nein, Deploy per Lauf-ID und `wrangler deployments list` belegen · (b) ja.
**✅ entschieden: (a) kein Probe-Release.** Wirkt in Schritt 11 (Beleg über Lauf-ID, `wrangler deployments list`, Cloudflare-Oberfläche).
**O7 – Cloudflare-Token neu oder weiterverwenden?** (a) neu · (b) denselben nochmals eintragen.
**✅ entschieden: (b) alter Token wird weiterverwendet.** Wirkt in Schritt 5 (Wert bereitlegen, ggf. *Roll*), 7.3 (eintragen) und 17.1 (Secret im Alt-Repo trotzdem löschen; Token **nicht** widerrufen).
**O8 – Alter Stash „halber Release 2.10.5" auf dem PC** (BUILD_LOG 222): (a) verwerfen · (b) vorher sichern.
**✅ entschieden: (a) verworfen** (erledigt, BUILD_LOG 225). Schritt 1 erwartet `git stash list` leer.
**O9 – Beschreibung des neuen Repos** (der Alt-Repo-Name `ap1-lernprogramm-archiv` ist klarnamenfrei; Wächter 4e14 prüft nur den Baum): (a) leer · (b) eine Zeile.
**✅ entschieden: (b) „AP1-Lernprogramm für die FISI-Ausbildung“.** Wirkt in Schritt 7.1 und 12.1.

**O10 – Wortlaut der K3-Vorlage im öffentlichen Repo** (25.11.2026, web.de-Sitzung): K3-E25 erlaubte ihn „ins Repo und in die App" – entschieden, als das Repo privat war.
**✅ entschieden (Nutzer 25.11.): darf öffentlich werden, aber nicht als solcher gekennzeichnet.** Umgesetzt in Schritt 4a (26.11.) und Abschnitt 4 Zeile 41.

## 7. Grenzen dieses Ablaufbuchs
- Nicht gemessen und nicht messbar von hier: die Alt-Repo-Einstellungen aus Schritt 2 (Proxy 403), Menü-Wortlaute der Oberflächen (Doku-Stand 18.10.), ob die Cowork-Ordnerfreigabe am Pfad hängt, ob die gespeicherten claude.ai-Umgebungen repo-unabhängig sind, GitHub-Verhalten bei Push-Schutz.
- Nicht gemessen: Actions-Minuten des Kontos (Abrechnungsseiten nicht lesbar; 18.10.: ~1800/2000 verbraucht laut Leitung; 25.11.: ≈ 1.064 min aus Job-Dauern geschätzt, 17 min je Lauf aus der Jobs-API – Abschnitt 1a), die Aussage „öffentliche Repos kosten keine Standard-Runner-Minuten“ (Doku, *angenommen* – Schritt 12.3.c misst sie), der Menüpfad *Change repository visibility*, die Roll-Funktion des Cloudflare-Tokens.
- Die Generalprobe prüft den **Baum und die Identität des Erstcommits**, nicht GitHub, Cloudflare oder die Cloud-Sitzungen. Sie sagt nichts über sinngemäß übernommenen Fremdtext und über Bilder.
- Die private Adresse in den alten Commits (33, BUILD_LOG 113) betrifft die **Historie des Alt-Repos**; sie bleibt dort, privat, und ist im neuen Repo nicht vorhanden, weil dort nur der eine Commit liegt.
