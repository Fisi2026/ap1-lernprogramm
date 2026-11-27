# AP1-Lernprogramm – Fachinformatiker Systemintegration

Lern-App zur Vorbereitung auf die **AP1** (Abschlussprüfung Teil 1) für Fachinformatiker/-innen
Systemintegration: Fragen üben, Tagesserie, Fehler-Deck, Prüfungssimulation, Rechen-Generator,
Netzplan, Gantt, Glossar, Spickzettel u. a. Die App läuft im Browser, funktioniert offline, und der
Lernstand bleibt lokal im Browser – es gibt kein Konto.

**Live:** https://ap1-lernprogramm.fisi2026lernapp.workers.dev

## Lizenz

⚠️ **Dieses Repository hat keine offene Lizenz: Alle Rechte vorbehalten** (siehe `LICENSE`).
Du darfst es ansehen und die Live-Seite benutzen; Kopieren, Weitergeben oder Wiederverwenden
von Quelltext, Fragenpool oder Lernunterlagen braucht vorher eine schriftliche Erlaubnis.

## Sicherheitslücke gefunden?

Bitte vertraulich melden, nicht als öffentliches Issue – Weg und Rahmen in `SECURITY.md`.

## Lokal bauen und prüfen

Voraussetzungen: `git`, Node.js 24 (wie in `.github/workflows/ci.yml`), `npm`, Python 3, `bash`
(unter Windows Git Bash). Der Fragenpool und die Werkzeuge liegen im Repository.

```bash
npm ci                               # Wurzel
(cd neu && npm ci)                   # die App
(cd .tooling && npm ci)              # Prüfwerkzeuge (ajv, jsdom)
pip install -r tools/requirements-werkzeuge.txt
bash tools/einrichten.sh --pruefen   # meldet, was auf dem Rechner noch fehlt (ändert nichts)

cd neu && npx vite build             # App bauen (Ausgabe nach v2/)
cd neu && npx vitest run             # Tests der App
bash check.sh                        # voller Prüflauf; Ziel: „ALLES GRÜN“
```

`bash tools/einrichten.sh` (ohne `--pruefen`) richtet zusätzlich ein, was ohne Zutun möglich ist.
Einige Prüfungen setzen private Lehrbuch-Dateien voraus, die nicht im Repository liegen und von
`einrichten.sh` als „OFFEN“ gemeldet werden – ohne sie sind nur diese Teilprüfungen nicht möglich.
Der Rest dieser Datei richtet sich an die Mitarbeit am Projekt.

---

## Für Mitarbeitende

Das Folgende war bisher der gesamte Inhalt dieser README.

⚠️ **Zahlen (Fragen, Tests, Version) stehen hier bewusst nicht** – sie veralten. Den Stand nennen die
Standzeilen in `START_PROMPT.md` (von `check.sh` gegen den Code gehalten) und `CHANGELOG.md`.

### Aufbau

| Ort | Inhalt |
|---|---|
| `neu/` | **Die App:** React 19 + TypeScript + Vite, Oberfläche shadcn/ui (nur Dark), Tests mit vitest |
| `neu/src/kern/` | **Der Rechenkern** – Bewertung, Wiederholung/Fehler-Deck, Ziehung, Simulation, Generatoren, Schema-Prüfung; `kern/tabellen/` die Daten (Konfiguration, Gebiete, Noten, Glossar, Abkürzungen, Spickzettel). **Gerechnet wird nur hier.** |
| `neu/src/schirme/`, `huelle/`, `fragetypen/` | Bereiche, Rahmen (Schiene, Kopf), je Fragetyp eine Eingabe |
| `neu/src/server/` | Worker (Cloudflare) + D1: „Frage melden" und Fehlerberichte |
| `v2/` | Gebaute App (`cd neu && npx vite build`), das wird ausgeliefert |
| `pool/*.json` | Der Fragenpool – gelesen **nur** über `tools/pool_laden.js` |
| `0*_*.md`, `99_Spickzettel.md` | Lernunterlagen (Ziel der `verweis`-Felder); `tools/build_spick.py` baut daraus `kern/tabellen/spickzettel.ts` |
| `tools/` | Pool-Werkzeuge (`pool_query.js`, `validate_*.js`, `kern.js` = der Kern für Node), Prüf- und Brückenwerkzeuge, Plugin `tools/plugin/fisi` |
| `tests/` | Pool-Suiten (Node + jsdom), Sollwerte in `sollwerte.env` |
| `referenz/` | Die **alte** App (bis v1.x) – nur noch Vergleichsgrundlage der Gleichheitstests, nicht ausgeliefert (Tag `alt-app-final`) |

Die Bereiche der App (Üben, Tagesserie, Fehler-Deck, Markiert, Statistik, Prüfungssimulation,
Rechen-Generator, Netzplan, Gantt, Glossar, Spickzettel, Klausurvorbereitung, Einstellungen …)
stehen mit ihrem Stand in `SCHIENE_NEU.md`.

### Die acht Gebiete

Jede Frage trägt ein Feld `gebiet`. Grundlage ist der **Prüfungskatalog FISI 2024**
(2. Aufl.), nicht ein Lehrbuch. AP1 hat fünf Gebiete, AP2 drei Prüfungsbereiche:

| Code | Teil | Gebiet |
|---|---|---|
| A1 | AP1 | Kundenbedarfe ermitteln |
| A2 | AP1 | Hard- und Software auswählen & beschaffen |
| A3 | AP1 | IT-Arbeitsplatz konfigurieren, testen & absichern |
| A4 | AP1 | Kunden und Kundinnen einweisen |
| A5 | AP1 | Leistungserbringung kontrollieren & protokollieren |
| B1 | AP2 | Konzeption und Administration von IT-Systemen |
| B2 | AP2 | Analyse und Entwicklung von Netzwerken |
| B3 | AP2 | Wirtschafts- und Sozialkunde |

⛔ **Die Fragenzahlen je Gebiet stehen hier bewusst NICHT.** `python3 tools/gebiete_stand.py`
schreibt den gemessenen Block in `docs/befunde/SORTIERUNG_PRUEFUNGSORDNUNG.md`, `check.sh` hält ihn nach.

### Eigene Fragen ergänzen

Neue Fragen in die passende `pool/pool_mXX.json` (Felder: `SCHEMA.md`). Danach
`node tools/pool_laden.js --pruefe` und `node tools/validate_pool.js`; für neue Stapel
`node tools/validate_batch.js`. `thema` muss ein Schlüssel von `THEMA_RELEVANZ` in
`neu/src/kern/tabellen/gebiete.ts` sein. **Pool-Dateien nie über `json.load`/`json.dump` umschreiben**
(Rezept in `LEHREN.md`).

### Qualitätssicherung

```bash
bash check.sh                  # voller Prüflauf: Pool, Wächter, Suiten, Neubau (Typen, oxlint, vitest, Bau)
bash check.sh schnell          # Syntax, Pool-Audit, vitest auf neu/src/kern
bash check.sh neu              # nur der Neubau (Zwischenstand, kein Ersatz für den vollen Lauf)
bash tools/suite.sh <name> …   # einzelne Pool-Suiten
cd neu && npx vitest run       # alle vitest-Tests (Sollwert: check.sh Abschnitt 4f)
```

Der größere Teil von `check.sh` sind **Wächter** – je aus einem konkreten Fehler entstanden, mit
Begründung im Kommentar: Standzeile gegen den Code, Gesetzeszitate (`zitate_belegt.json`), Fachbegriffe
(`begriffe_belegt.json`), Verweis-Ziele in den Lernunterlagen, SVG-Grafiken, `v2/` gleich dem Bau,
Auslieferungsinhalt. ⚠️ **Kein Wächter prüft, ob ein Bild die Frage beantwortet** – das geht nur mit Ansehen.

### Deployment

Cloudflare Workers (Static Assets + Worker + D1). **Ausgeliefert wird nur über die CI:** der Job `deploy`
in `.github/workflows/ci.yml` läuft erst nach grünem `check.sh`; ein Version-Bump legt den Tag an.
Einzelheiten, Secrets und Token-Pflege: **`DEPLOY.md`**.

### Wo steht was

| Datei | Inhalt |
|---|---|
| `ARCHITECTURE.md` | Code-Landkarte des Neubaus |
| `SCHIENE_NEU.md` / `PLAN_NEUBAU.md` | Bereiche und Messwege / Entscheide (E1 …) und Etappen |
| `SCHEMA.md` | Fragen-Schema, Feld für Feld, je Typ |
| `DEPLOY.md` | GitHub, Cloudflare, CI-Deploy |
| `docs/befunde/SORTIERUNG_PRUEFUNGSORDNUNG.md` | Gebiets-Zuordnung A1–B3, gemessener Stand |
| `BEFUNDE_*.md`, `docs/befunde/BEFUNDE_INDEX.md` | Prüfprotokolle, Index der B-Nummern (erzeugt) |
| `BUILD_LOG.md` | Bauprotokoll seit dem letzten Rotieren; älteres im `_ARCHIV` |
| `START_PROMPT.md`, `EINSTIEG.md`, `LEHREN.md`, `regeln/` | Arbeitsanweisung für die KI-Sitzungen – **kein Einstieg für Menschen** |
