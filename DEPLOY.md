# DEPLOY.md – GitHub + Cloudflare (Stand 2026-07-17)

Kurzreferenz für den Betrieb. Wird nicht mit ausgeliefert (`.assetsignore` schließt `*.md` aus).
Alle Identifier sind namensfrei (kein Klarname), daher hier direkt notiert.

## Live
- **URL:** https://ap1-lernprogramm.fisi2026lernapp.workers.dev
- Statische Web-App auf Cloudflare (Workers Static Assets), Projektname `ap1-lernprogramm`.
- ⛔ **Seit v2.0.0 (N29, 24.09.2026): unter `/` läuft der Neubau.** Ausgeliefert wird NUR `v2/` (das
  Bauergebnis von `neu/`, `wrangler.jsonc` `assets.directory: "./v2"`). `v2/_redirects` leitet
  `lernprogramm_ap1.html` und `/v2/` auf `/` um; `/sw.js` und `/v2/sw.js` sind der Abschalt-SW für
  Geräte mit altem Service Worker (bleiben dauerhaft), der Neubau-SW heißt `/app-sw.js`.
  Die alte App liegt nur noch als Referenz im Wurzelordner (N29 Teil 2: `referenz/`).

## GitHub
- Öffentliches Repo **`Fisi2026/ap1-lernprogramm`**, Branch `main` – seit 26.11.2026 (N40 V3, BUILD_LOG 285) mit frischer
  Historie ab dem Erstcommit `1e98a44`. Das alte Repo liegt privat und archiviert als `Fisi2026/ap1-lernprogramm-archiv`.
- ⛔ **KEIN Token in `.git/config`** (gemessen 26.09.2026, Audit AUD-C6: seit dem neuen PC, BUILD_LOG 53, so –
  der Satz „PAT eingebettet“ hier war veraltet). Remote ist
  `https://github.com/Fisi2026/ap1-lernprogramm.git`; die Anmeldung hält der **Git Credential Manager**
  (Windows-Anmeldeinformationsverwaltung, `credential.helper=manager`). Bei Ablauf fragt Git beim nächsten
  Push per Browser nach. Prüfen: `git config --get remote.origin.url` darf kein `@` enthalten.

## Pushen (= löst Auto-Deploy aus)

⛔ **Ein `push.sh` GIBT ES NICHT MEHR** — am 10.09.2026 nach `_to_delete/` verschoben (W1 Etappe B).
Es legte bei Störungen `.git_broken_old` an und hat schon einmal das Repo im Mount zerlegt. Der
START_PROMPT verbot es seit dem 28.07. — dieses Dokument empfahl es bis zum 27.08. trotzdem weiter.
**Zwei Orte für dieselbe Sache, und nur einer stimmte. Eine Warnung, die man erst lesen muss,
schützt schlechter als eine Datei, die es nicht gibt.**

**Der Weg, vom Windows-Rechner aus:**
```
git status --porcelain          # muss leer sein
git log --oneline -3            # oberster Commit = der Bump
git push origin main
bash ci2.sh                     # URTEIL-Zeile am Ende ist maßgeblich
```
⛔ **Seit 26.09.2026 (Audit AUD-A1) liefert die CI aus, nicht mehr Cloudflare selbst:** Job `deploy` in
`.github/workflows/ci.yml`, `needs: check` – erst `check.sh` + Coverage-Schwelle + Rauchtest grün, dann
`wrangler d1 migrations apply ap1-meldungen --remote` und `wrangler deploy` (wrangler exakt gepinnt im
Wurzel-`package.json`). Vorher baute Cloudflare bei JEDEM Push selbst, parallel zur CI – auch rot.
Bei einem Version-Bump legt die Release-Action zusätzlich den Tag an.

**Einrichtung (einmalig, NUR der Nutzer):**
1. Cloudflare → *My Profile* → *API Tokens* → *Create Token* → Vorlage **„Edit Cloudflare Workers“**,
   dazu Berechtigung **Account → D1 → Edit**; nur dieses Konto. Token kopieren.
2. Cloudflare → *Workers & Pages* → Übersicht: die **Account ID** kopieren.
3. GitHub → Repo → *Settings* → *Secrets and variables* → *Actions* → *New repository secret*:
   `CLOUDFLARE_API_TOKEN` und `CLOUDFLARE_ACCOUNT_ID`.
4. Nächster Push: im Actions-Lauf muss der Job „Deploy zu Cloudflare" grün sein (ohne Token: Warnung, übersprungen).
5. **Erst dann** Cloudflare → *Workers & Pages* → `ap1-lernprogramm` → *Settings* → *Build* → Git-Repository
   **trennen** (Disconnect). Bis dahin liefern beide Wege aus – harmlos, derselbe Stand.

✅ **Eingerichtet am 26.09.2026** (BUILD_LOG 55c): Secrets gesetzt, erster CI-Deploy gruen, Git-Anbindung getrennt.
✅ **Neu eingerichtet am 26.11.2026 im neuen Repo** (N40 V3 Schritt 7–10, BUILD_LOG 285): beide Secrets neu gesetzt, erster Lauf
45800170640 gruen inkl. Deploy; im Alt-Repo `…-archiv` sind die Secrets geloescht (Schritt 17).
Von Hand ausliefern ohne Commit: `gh workflow run CI --ref main` (prueft zuerst, liefert nur bei Gruen).
⚠️ **Token-Pflege (Nachpruefung NP2):** Der Token hat die Rechte der Vorlage „Edit Cloudflare Workers" + D1 Edit auf
diesem Konto – mehr, als der Deploy braucht, aber enger laesst Cloudflare es fuer Workers nicht zu. Deshalb **mit
Ablaufdatum** (Token → *Edit* → *TTL*, sonst neu erstellen) und vor Ablauf erneuern: neuen Token anlegen, GitHub-Secret
`CLOUDFLARE_API_TOKEN` ueberschreiben, alten Token loeschen, `gh workflow run CI --ref main` als Probe.
⛔ Ein Token gehoert NIE in den Chat und nie in den Namen eines Secrets (26.09.: genau das passiert, Token ersetzt).

⚠️ **Kein `--force`.** Wird ein Push abgelehnt: melden, nichts erzwingen.

## Herkunft prüfen (ENTWURF N41 S4, Zweig n41-s45 – wirkt erst nach Übernahme in main)
Der Job `deploy` bescheinigt nach `wrangler deploy` den Inhalt von `v2/` mit `actions/attest-build-provenance`
(SLSA-Provenance, signiert per GitHub-OIDC; Rechte `id-token: write` + `attestations: write` nur in diesem Job).
Prüfen, dass ein Bau wirklich aus diesem Repo und diesem Workflow kommt (Datei aus dem ausgecheckten `v2/`):
```
gh attestation verify v2/index.html --repo Fisi2026/ap1-lernprogramm --signer-workflow Fisi2026/ap1-lernprogramm/.github/workflows/ci.yml
```
Ein Treffer nennt Commit und Lauf; ein Fehler heißt: Datei nicht vom Deploy-Job (oder verändert). Hinweis: Bescheinigungen für
**private** Repos setzen GitHub Enterprise Cloud voraus – im öffentlichen Repo ohne Zusatz verfügbar (seit 26.11.2026; gemessen
26.11.: Lauf 45801828839, Schritt „Herkunft“ success, `gh attestation verify` rc 0, SLSA provenance v1).

## Cloudflare-Setup (bereits erledigt)
- Workers Static Assets, Deploy-Command `npx wrangler deploy`, Output-Dir `.` – ⛔ **seit N29 ist
  `assets.directory` in `wrangler.jsonc` `./v2`**; die Punkte zu `.assetsignore` unten betreffen seitdem
  nur noch die Geschichte (der Wurzelordner geht nicht mehr auf den Server). ⚠️ **E45 (24.09.): die Datei BLEIBT
  als Sicherheitsnetz** für einen Rückfall auf `.`; „Wirkung beim Lerner" misst `tools/ungepusht.py` aus `wrangler.jsonc` (E44).
- **`.assetsignore`** im Repo-Root schließt vom Deploy aus: `.git` (Token!), `*.env`, `*.sh`, `*.py`,
  `tests/`, `tools/`, `prompts/`, `*.md`, Backups, PDF. NIEMALS entfernen – sonst wäre `.git/config`
  (mit Token) wieder öffentlich abrufbar.
- **Seit 07.09.2026 zusätzlich:** `pool/`, `batches_m09/`, die Wächter-Datendateien
  (`begriffe_belegt.json`, `inhaltstraeger.json`, `laengen_ausnahmen.json`, `zitate_belegt.json`),
  `__pycache__/`, `*.pyc`, `*.bat`, `.gitignore`, `.gitattributes`. Grund: Sie gehören zur selben
  Klasse wie `tests/` und `tools/` – Eingabe und Werkzeug, nicht Auslieferung – standen aber nie in
  der Liste. **Deploy 6018 → 3048 KB, 64 → 27 Dateien.**
- ⚠️ **Ausgangsmenge des Deploys ist `git ls-files`, nicht der Arbeitsordner.** Cloudflare ist mit
  dem Repo verbunden; was `.gitignore` ausschließt (`.tooling/`, `_to_delete/`, `node_modules/`),
  kommt nie in die Nähe des Servers. Wer den Ordner misst, misst 53 MB und liegt falsch.
- **Gemessen wird das jetzt:** `python3 tools/deploy_inhalt.py` listet auf, was ausgeliefert wird
  und was davon die App überhaupt anfassen kann. `check.sh` macht daraus einen **roten Wächter ab
  der ersten unerreichbaren Datei** – Ratsche steht auf null.

## Server-Teil: Online-Meldungen (seit v1.29.0, N20b)
- **`wrangler.jsonc` im Repo** (seit 17.09.2026). Vorher erzeugte Cloudflare die Konfiguration selbst;
  deren Werte (Name, `compatibility_date`, `nodejs_compat`, Observability, Assets aus `.`) sind übernommen.
- **Worker-Code:** `neu/src/server/worker.ts` – läuft NUR für `/api/*` (`assets.run_worker_first`), alles
  andere liefert Cloudflare wie bisher direkt aus den Assets. `.assetsignore` gilt weiter und sperrt
  zusätzlich `wrangler.jsonc`, `wrangler.toml`, `.dev.vars*`.
- **Datenbank:** D1 `ap1-meldungen` (Region WEUR, ID steht in `wrangler.jsonc`). Schema nur über
  Migrationen in `neu/src/server/migrationen/`:
  `npx wrangler d1 migrations apply ap1-meldungen --remote` – ⛔ seit 26.09. macht das der Deploy-Job der CI
  VOR dem Ausliefern. 0003 (Index auf `erstellt`) wurde am 26.09. von Hand eingespielt, Abfrageplan live:
  `SEARCH … USING COVERING INDEX idx_meldungen_erstellt`.
- **Schlüssel der geschützten Ansicht:** Worker-Secret `MELDE_SCHLUESSEL` (mind. 16 Zeichen). Setzen/ändern
  NUR der Nutzer selbst: `npx wrangler secret put MELDE_SCHLUESSEL` (PowerShell). Ohne Secret ist die
  Ansicht gesperrt (503), Meldungen kommen trotzdem an.
- **Meldungen lesen (Chat):** Cowork-Connector „Cloudflare Developer Platform“ → `d1_database_query`, z. B.
  `SELECT nr, frage_id, grund, text, erstellt, version FROM meldungen WHERE status='offen' ORDER BY erstellt`.
  Die Spalte `geraet` (Zufallskennung für die Mengenbremse) wird nicht ausgegeben und nicht gebraucht.
- **Fehlerberichte (seit N32, Migration 0002):** die Error Boundary eines Bereichs schreibt nach Tabelle `fehler`
  (`POST /api/fehler`, Regeln `neu/src/server/fehlerregeln.ts`). Lesen wie oben, z. B.
  `SELECT nr, bereich, meldung, stack, version, erstellt FROM fehler ORDER BY erstellt DESC LIMIT 50`.
  ⛔ Frage-Kennungen und Adressteile sind dort geschwärzt (E30) – das ist Absicht, kein Datenfehler.
- **Lokal testen:** `npx wrangler dev --local --assets <kleine Kopie>` – auf den ganzen Ordner scheitert der
  Datei-Beobachter an `.tooling/node_modules` (EACCES). Probe-Deploy ebenso: `--dry-run --assets <Kopie>`.
- **Kennungsliste:** `neu/src/server/fragen-ids.ts` ist ERZEUGT (`node tools/melde_ids.js`); ein Test meldet
  jede Abweichung vom Pool. **Nach jeder Pool-Änderung mit neuen oder entfernten IDs neu erzeugen.**

### Härtung seit v2.1.1 (Prüfbericht 26.09.2026, BUILD_LOG 54)
- **Nur JSON von der eigenen Seite:** `POST /api/meldung` und `/api/fehler` antworten 415 ohne
  `application/json` und 403 bei fremdem `Origin`/`Sec-Fetch-Site`.
- **Ratenbremse am Rand** (`ratelimits` in `wrangler.jsonc`): `RL_SCHREIBEN` 10/min, `RL_ADMIN` 30/min, je IP
  und Zweck. ⛔ Die IP ist nur flüchtiger Zählschlüssel, gespeichert wird sie nicht (E8). Fällt die Bremse
  aus, halten die Grenzen in D1 (jetzt atomar im INSERT).
- **Aufbewahrung (Cron `23 3 * * *` UTC, `scheduled` in `worker.ts`):** Fehlerberichte nach 90 Tagen, erledigte
  Meldungen 365 Tage nach Erledigung. Offene Meldungen nie.
- **Sicherheits-Köpfe:** `v2/_headers` (erzeugt von `neu/sw/plugin.ts`): HSTS, nosniff, X-Frame-Options, Referrer-
  und Permissions-Policy, COOP; **CSP scharf** (seit 2.1.2; Konsolenprobe 26.09.: 0 Verstöße in allen Bereichen inkl. Bild-/Hotspot-Fragen,
  Positivprobe mit Inline-Skript meldete korrekt `script-src-elem`). **Seit 2.2.0 zusätzlich Trusted Types**
  (`require-trusted-types-for 'script'; trusted-types ap1`, Politik in `neu/src/lib/vertrauen.ts`). Jede
  Änderung prüft `tools/sichtpruefung/rauch.js` in der CI (0 Verstöße, alle Bereiche, offline).
- **Protokoll:** Abstürze im Worker gehen strukturiert nach Workers Logs (`ereignis`, `pfad`, `methode`, `fehler`) –
  ohne Körper, Gerätekennung oder IP. ⛔ Die automatischen **Invocation-Logs sind AUS** (Audit AUD-A3,
  `observability.logs.invocation_logs: false`) – sonst schrieb Cloudflare zu jeder Anfrage Metadaten mit.
- **Datenschutzhinweis** (Audit AUD-A2): Einstellungen → „Datenschutz“, Text in `neu/src/schirme/Datenschutz.tsx`.
  ⛔ Wer Melden, Fehlerberichte, Fristen, Hosting oder Logs ändert, zieht den Text nach (ein Test vergleicht die Fristen).
- **Schlüssel `MELDE_SCHLUESSEL`:** Vergleich über SHA-256 in fester Zeit. Empfehlung: 32 zufällige Byte, z. B.
  `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`, dann
  `npx wrangler secret put MELDE_SCHLUESSEL`. Er bleibt auf dem Gerät im localStorage (Nutzer-Entscheid 26.09.).
- **GitHub:** Dependabot-Alerts und -Sicherheitsupdates an, `.github/dependabot.yml` (npm `neu/`, `.tooling/`,
  Actions); Actions am Commit-SHA; `.tooling/package*.json` im Repo, CI mit `npm ci`.

## Mount-Eigenheit (wichtig für git in der Shell)
Der Cowork-Mount erlaubt **Erstellen/Umbenennen, aber KEIN Löschen**. Git hinterlässt daher nicht
löschbare `*.lock`/`tmp_obj_*`-Dateien; ein liegengebliebenes `HEAD.lock` blockiert den nächsten
Commit.

**In der Sandbox gilt seit dem 27.08.:** jeden git-Aufruf über den Wrapper
```
bash tools/gitc.sh <git-argumente>
```
Er räumt `index.lock`/`HEAD.lock` vor UND nach jedem Aufruf weg (`rm` scheitert, `mv` geht) und
reicht den Rückgabewert durch. **Auf dem Windows-Rechner ist das nicht nötig** — dort ist git
normal benutzbar.

## Datenschutz-Status (2026-07-17, erledigt)
- Repo seit 26.11.2026 **öffentlich** (N40 V3: frische Historie ohne private Adresse und ohne Katalog-OCR; bis dahin privat).
  Git-Commit-Identität anonym (Autor `ap1`, keine echte Mail).
- GitHub-User auf **Fisi2026** umbenannt (alter, namenshaltiger User nur noch im Cowork-Memory).
- Cloudflare-Konto-Subdomain auf **fisi2026lernapp** umbenannt (alte Subdomain nur noch im Cowork-Memory).
- Damit enthält weder die öffentliche URL noch der GitHub-User den Klarnamen.
- ERLEDIGT (Alt-URL, 2026-07-18): alte (namenshaltige) Adresse per WebFetch geprüft → liefert leeren
  Body, keine App mehr. Neue URL lädt korrekt. Datenschutz-Check abgeschlossen.
- Token-Hygiene: erstes (im Chat gezeigtes) Token widerrufen; aktuelles Token ist eng begrenzt.
