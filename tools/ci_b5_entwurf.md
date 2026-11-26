# N42 B5 – CI schneller: ENTWURF (18.10.2026, Zweig n42-b5)

**Status: ENTWURF (N12).** Nichts davon ist auf `main`, es gab keinen PR und keinen GitHub-Lauf (N10). Die Leitung übernimmt nur mit Nutzer-Ja.
Maschine der Messung: Cloud-Container, 4 Kerne (`nproc` = 4). **Alle Zeiten gemessen, wo nicht „angenommen" steht.**

## 1. Messung (Kopie von `check.sh` mit Zeitstempeln unter /tmp, 3 volle Läufe, Original unverändert)

Gesamtdauer voller Lauf: **103,1 / 101,2 / 101,3 s (Median 101,3 s)**, alle drei „ALLES GRÜN".

| Abschnitt von `check.sh` | Median s | hängt ab von |
|---|---|---|
| 0/1/1b/1c Vorprüfungen (`vorpruefungen`) | 1,4 | `.tooling` (ajv) |
| `fuelle_work` (flaches Testverzeichnis) | 0,2 | Pool-Lader, `referenz/`, `neu/src/kern/tabellen` |
| jsdom-Spiegel + `pkill` + 1 s Warten | ≈ 8 (Differenz aus Zeitstempeln) | `.tooling`; liefert `NODE_PATH` nur den Suiten |
| 45 jsdom-Suiten (parallel, 5 Prozesse) | 12,1 | `fuelle_work`, Spiegel; sonst nichts |
| 4f_einstieg/roh/as/qualitaet/architektur/unnoetig | 17,0 (qualitaet 11,1 · architektur 3,5 · as 2,1) | `neu/node_modules`, `.tooling`, ruff/lizard/shellcheck, root-`node_modules` (tsc-Ratsche) |
| 33 billige Wächter (`billige_guards`) | 6,3 | nur Quellbaum (`git`, `gh` fehlt → übersprungen) |
| 4f_umbau Hintergrund: tsc | 4,1 | `neu/node_modules` |
| 4f_umbau Hintergrund: oxlint | 3,9 | `neu/node_modules` |
| 4f_umbau Hintergrund: Bau (`vite build` → `$WORK/v2probe`) | 2,5 | `neu/node_modules`; **Vergleich `diff -r v2probe v2/` und gzip-Grenze hängen am Bau** |
| 4f_umbau Hintergrund: vitest (1499 Tests) | im vollen Lauf ≈ 95–98; **allein mit Coverage (CI=true) 107 s** | `neu/node_modules`; nichts anderes |
| 4f_umbau Abholen (wartet auf vitest) | 61,5 | alle vier Hintergrundläufe |
| Stempel (`check_stempel.sh schreibe voll`) | < 1 | **Ende des ganzen Laufs** (nur grüner „voll") |

Folge: die Wanduhr (≈ 101 s) ist **vitest** (≈ 97 s); alles andere zusammen wäre seriell ≈ 55 s und läuft schon unter vitest. Abhängigkeiten zwischen Teilen: nur Bau → v2/-Vergleich → gzip (gleicher Teil) und „alle Teile → Stempel". Suiten, Wächter, vitest, tsc/oxlint sind voneinander unabhängig.
(Hinweis: Die erste Einzelmessung von vitest zeigte 140 s, weil versehentlich zwei Messschleifen gleichzeitig liefen – verworfen; saubere Einzelmessung: 107 s.)

## 2. Entwurf: Jobaufteilung

`check.sh` bekommt `bash check.sh teil <pruefung|suiten|tests|bau>`; `bash check.sh` (voll) und alle anderen Modi tun unverändert dasselbe (Schalter `T_*`/`UMBAU_TEIL` stehen im Normalfall alle an). Ein Teil meldet `TEIL <name> GRÜN`, stempelt nie und sagt nie „ALLES GRÜN".

| Job (`ci.yml`) | Teil | fährt | gemessen (parallel) |
|---|---|---|---|
| `pruefung` | `teil pruefung` | Vorprüfungen, billige Wächter, 4f ohne Umbau | 31–34 s |
| `suiten` | `teil suiten` | `fuelle_work` + jsdom-Suiten | 17 s |
| `tests` | `teil tests` | vitest neu/ (in der CI mit Coverage, `CI=true`) | 95–99 s (ohne Coverage); 107 s allein mit |
| `bau` | `teil bau` | tsc, oxlint, Bau, gzip, v2/-Drift | 8–9 s |
| `rauch` | – | `node tools/sichtpruefung/rauch.js` (war letzter Schritt von `check`) | angenommen < 20 s |
| `check` (Sammel) | – | `needs` alle fünf, `if: always()`, rot bei jedem Ergebnis ≠ success **und** bei Anzahl ≠ 5, sonst „ALLES GRÜN" | < 5 s (angenommen) |

Der Sammel-Job behält Schlüssel `check` und Namen „check.sh (voll)", damit `release`/`deploy` (`needs: [check, semgrep]`) und eine mögliche Branch-Schutzregel unverändert greifen. Jeder Job installiert nur, was sein Teil braucht (`pruefung`: alles, auch Messwerkzeuge; `suiten`: nur `.tooling`; `tests`/`bau`: `.tooling` + `neu`; `rauch`: Wurzel).
Geänderte Dateien: `check.sh`, `tools/umbau_laeufe.sh` (`umbau_aktiv`), `tools/waechter/4f_umbau.sh` (vier `if umbau_aktiv …`-Hüllen, Meldungen unverändert), `.github/workflows/ci.yml`.

**Fund beim Beweis (behoben):** `check.sh` räumt vor den Suiten mit `pkill -f "node test_"`. Liefen vier Teile gleichzeitig auf einer Maschine, schoss `pruefung/tests/bau` die Suiten von `suiten` ab (3 Suiten rot, 5 s). Jetzt nur noch bei `T_SUITEN=1`. In der CI hat jeder Job eine eigene Maschine, der Fehler wäre dort nicht aufgetreten – lokal parallel schon.

## 3. Erwartete CI-Dauer
- Wanduhr der Teile (4 Kerne, gemessen): max = `tests` ≈ 100–107 s (statt Gesamtlauf ≈ 101 s lokal, Cloud 2 Kerne ≈ 233 s laut PLAN).
- Je Job kommen Checkout, setup-node, `npm ci` hinzu: **angenommen** 30–60 s mit Cache. Damit **angenommen ≈ 2,5 min** auf einem 4-Kern-Runner – unter 3 min.
- **Offen/angenommen:** `ubuntu-latest` hat in privaten Repos 2 Kerne. Dort ist vitest die Kette (laut PLAN 215 s allein) → Ziel < 3 min nur mit Shards (s. u.).
- Die heutige CI braucht die Summe aus Setup + 233 s (PLAN, Cloud 2 Kerne) + Rauchtest; **keine CI-Zeit wurde hier gemessen** (N10).

## 4. Beweis: Summe der Teil-Urteile = altes Urteil (lokal, gemessen)
Skripte lagen unter /tmp (Scratchpad); Ausgaben dort als `a_*.log`, `b_*.log`.

**(a) Sauberer Baum.** Vier Teile gleichzeitig (`bash check.sh teil <name>`), danach `bash check.sh`:
```
pruefung rc=0 (34 s) „TEIL pruefung GRÜN" · suiten rc=0 (17 s) · tests rc=0 (99 s) · bau rc=0 (8 s) · parallel gesamt 99 s
bash check.sh  → rc=0 (105 s) „ALLES GRÜN"
Vergleich: sort(alle [ok]/[FEHLER]-Zeilen der 4 Teile) vs sort(Zeilen des vollen Laufs): 80 = 80 Zeilen, diff leer → IDENTISCH
```
(Erster Anlauf: `suiten` rot durch das `pkill`-Problem oben, Vereinigung ≠ voll – so wurde der Fehler gefunden; nach dem Fix identisch.)

**(b) Absichtlich rot, Probe-Dateien nur für den Test, danach gelöscht (`git status` sauber).**
Probe 1 `neu/src/zz_probe_b5.test.ts` (`expect(1+1).toBe(3)`), Probe 2 `neu/src/zz_probe_b5_typ.ts` (`const x: number = "…"`):
```
pruefung rc=1  [FEHLER] Qualitaets-Ratsche: GESTIEGEN knip_dateien: 0 -> 1   (Probe-Datei ist ungenutzt)
suiten   rc=0  TEIL suiten GRÜN
tests    rc=1  [FEHLER] Umbau neu/ Tests: 1 Fehler in zz_probe_b5.test.ts
bau      rc=1  [FEHLER] Umbau neu/ Typen: src/zz_probe_b5_typ.ts(1,14): error TS2322 …
bash check.sh  rc=1 „3 PROBLEM(E) – siehe oben"  = 1 + 0 + 1 + 1
```
Jeder rote Teil ist rot, der unbeteiligte (`suiten`) grün, der volle Lauf rot mit genau der Summe der Teil-Probleme.
Nicht einzeln sabotiert: `suiten` (Gegenprobe der Zusammensetzung gilt über (a)), `rauch`, der Sammel-Job selbst (Logik nur gelesen, nicht ausgeführt).

## 5. Offene Punkte
1. **2-Kern-Runner:** vitest (≈ 100–215 s) bleibt die Kette. Hebel (nicht umgesetzt): `vitest --shard=i/n` in einer Matrix + `--reporter=blob`/`merge-reports`; dann müssten Mindestzahl (1160), Coverage-Schwellen und Status-Prüfung in `4f_umbau.sh` auf den zusammengeführten Bericht umgestellt werden. Alternativ `isolate: false` (vitest schätzt ≈ 15 s, nicht erprobt).
2. **ci.yml nie auf GitHub gelaufen** (N10): YAML nur mit `yaml.safe_load` geprüft; Aktionsversionen und SHAs unverändert übernommen. Ein erster echter Lauf (z. B. per `workflow_dispatch` auf dem Zweig – braucht einen Nutzer-Entscheid, kostet Minuten) ist nötig.
3. **Setup-Zeiten** je Job und Cache-Wirkung sind angenommen; `suiten`/`tests`/`bau` wurden lokal nicht in einer Umgebung mit *nur* den Job-Installationen gefahren (alle Abhängigkeiten lagen vor). Aus dem Code gelesen: Suiten brauchen nur node + `.tooling`; `4f_*`-Wächter außer `4f_umbau` kein jsdom.
4. **Branch-Schutz:** heißt die Pflichtprüfung „check.sh (voll)", bleibt sie erhalten (Sammel-Job). Heißt sie anders, greift sie nach dem Umbau ins Leere.
5. Der Rauchtest läuft jetzt parallel zu den Prüfungen statt danach; sein Urteil geht über `needs: rauch` in den Sammel-Job ein.
6. Koordination: `ci.yml` wird auch von anderen Phasen berührt (z. B. N41-Pins) – Merge-Konflikte möglich.
7. Aufräumen nötig durch den Nutzer: eine versehentliche Datei `/bg.txt` im Wurzelverzeichnis des Containers (Messskript mit leerer Variable); Löschen wurde von der Sicherheitsprüfung verweigert, liegt außerhalb des Repos.
