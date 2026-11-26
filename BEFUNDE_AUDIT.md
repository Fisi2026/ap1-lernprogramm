# BEFUNDE_AUDIT – Komplett-Audit 26.09.2026 (Stand v2.1.2, Commit f6969be)

Auftrag: Nutzer, „komplett neu", Bericht im Chat. Jeder Befund ist am Code gemessen (Datei:Zeile oder Befehl).

## Scores
| Kategorie | Note | Kurz |
|---|---|---|
| Code-Qualitaet & Architektur | 7/10 | strict TS, saubere Worker-Schicht; Altlast `logik.js` untypisiert (N34 laeuft) |
| Sicherheit & Datenschutz | 8/10 | keine kritische Luecke; Luecken bei Transparenz (Datenschutzhinweis) |
| Performance | 7/10 | Pool lazy; Hauptbuendel ohne Bereichs-Splitting |
| Tests & Doku | 8/10 | 1142 Tests, 93 % Anweisungen / 84 % Zweige; kein Coverage-Gate, kein E2E in CI |
| DevOps | 7/10 | Actions SHA-gepinnt, `permissions: {}`; Deploy nicht an CI gebunden |

## Messungen
- `npm audit` (neu/): 0 Schwachstellen. vite 8.3.0 – CVE-2026-39364 betrifft nur 8.0.0–8.0.4 mit `--host`: nicht betroffen.
- React 19.2 ohne Server Components – CVE-2025-55182 (React2Shell) nicht betroffen.
- `cn` 0.2.6 = offizielles Paket von shadcn-ui (github.com/shadcn-ui/cn), kein Typosquat.
- Coverage (`vitest --coverage`): Statements 92,86 %, Branches 83,8 %, Functions 92 %, Lines 94,86 %.
- Git-Historie: 0 Treffer auf PAT-/Token-Muster. `pool/*.json`: 0 × `<script`, `on*=`, `foreignObject`.
- Buendel: `index-*.js` 676 KB (211 KB gzip), `pooldaten-*.js` 2,37 MB (673 KB gzip, lazy).

## A. Hoechste Prioritaet
AUD-A1 **Deploy nicht an CI gebunden** – Cloudflare baut bei jedem Push auf main (DEPLOY.md „Pushen = Auto-Deploy"),
   parallel zur CI. Ein roter Commit geht live; einziger Riegel ist die lokale Regel „check.sh vor Commit".
   → Git-Anbindung in Cloudflare trennen, Deploy als Job `needs: check` mit `cloudflare/wrangler-action` (SHA-gepinnt).
AUD-A2 **Kein Datenschutzhinweis in der App** (grep „Datenschutz|Impressum" in schirme/: nur Lernstoff).
   Verarbeitet werden: Freitext der Meldung (kann Personenbezug enthalten, offen = unbegrenzt gespeichert),
   Geraetekennung (pseudonym, dauerhaft im localStorage), IP bei Cloudflare (Ratenbremse, Workers Logs).
   `Melden.tsx:109` sagt „anonym … ohne IP-Adresse" – gespeichert wird keine IP, aber pseudonym ≠ anonym.
   → kurzer Hinweis (Art. 13 DSGVO) in Einstellungen + am Melden-Dialog; Wortlaut „ohne Namen, IP wird nicht gespeichert".
AUD-A3 **Workers-Invocation-Logs an** (`observability.enabled: true`, keine Einschraenkung). Laut Cloudflare enthalten sie
   „Request, Response and related metadata"; Feldliste nicht dokumentiert → im Dashboard pruefen, ob IP/Header drin sind.
   → `"observability": { "enabled": true, "logs": { "invocation_logs": false } }` – eigene `console.error` bleiben.

## B. Mittel
AUD-B1 **wrangler nicht gepinnt** – kein Root-`package.json`; Cloudflare nimmt laut Doku die Version aus package.json.
   → Root-`package.json` mit `wrangler` exakt gepinnt + Lockfile, Dependabot-Eintrag `/`.
AUD-B2 **Kein Lernstand-Export/-Import** – nur `storage.persist()`; Geraeteverlust/Browserwechsel = Lernstand weg.
   Export gibt es nur fuer Meldungen (`Einstellungen.tsx:175`). → JSON-Export/Import des Lernstands.
AUD-B3 **Altkern `logik.js` (1760 Zeilen, UMD) untypisiert** – `kern/logik.ts:58` `[weiteres: string]: unknown`, 4 Importeure.
   Laeuft als N34 T2–T6; Befund bestaetigt die Prioritaet.
AUD-B4 **Kein Coverage-Gate, kein E2E in CI** – `vitest.config.ts` ohne `coverage.thresholds`; `tools/sichtpruefung/` nur lokal.
   → Schwellen knapp unter Ist (Stmts 92, Branches 83) + ein Playwright-Rauchtest (Start, Frage, Offline) in CI.
AUD-B5 **Werkzeug- und Doku-Last** – `check.sh` 1342 Zeilen, 175 Dateien in `tools/`, 3,2 MB Markdown im Repo.
   Wirksam, aber hohe Einarbeitungs- und Pflegekosten. → nichts Neues bauen ohne Stilllegung von Altem.

## C. Niedrig
AUD-C1 `meldungen` ohne Index auf `erstellt` – `COUNT(*) … WHERE erstellt > ?` (api.ts, zweimal je Meldung) scannt die Tabelle;
   offene Meldungen wachsen unbegrenzt. → Migration 0003 `CREATE INDEX idx_meldungen_erstellt ON meldungen (erstellt);`
AUD-C2 Hauptbuendel ohne Bereichs-Splitting (`App.tsx` importiert alle Schirme statisch). → `React.lazy` fuer Gantt,
   Netzplan, Simulation, Generator, Meldungsliste.
AUD-C3 Vorab-Cache laedt alle 5 Geist-Schnitte (kyrillisch, vietnamesisch, ~31 KB). → nur `latin`/`latin-ext` importieren.
AUD-C4 SVG per `dangerouslySetInnerHTML` (`Bildflaeche.tsx:69/97`, `Hotspot.tsx:41`) ohne Waechter. Heute sauber, CSP
   blockt Inline-Handler. → Test: kein `<script`, `on*=`, `foreignObject`, `javascript:` in Pool-SVGs.
AUD-C5 Admin-Liste `LIMIT 500` ohne Seitenweise. Admin-Statuspfad ohne JSON-/Herkunftspruefung (unkritisch: Bearer erzwingt Preflight).
AUD-C6 PAT im Klartext in `.git/config` (DEPLOY.md). → Git Credential Manager (Windows) statt URL-Token.
AUD-C7 `App.tsx:142–173` Ternaer-Kette fuer 17 Bereiche. → Tabelle `Bereich → Komponente`.
AUD-C8 CSP `style-src 'unsafe-inline'` (Radix/React-Inline-Styles – vertretbar). Trusted Types waeren der naechste Schritt.

## Aktionsplan
1. AUD-A3 invocation_logs aus · 2. AUD-A2 Datenschutzhinweis + Wortlaut · 3. AUD-A1 Deploy hinter CI · 4. AUD-B1 wrangler pinnen ·
5. AUD-C1 Index-Migration · 6. AUD-B2 Lernstand-Export · 7. AUD-B4 Coverage-Schwellen + E2E-Rauchtest · 8. AUD-C4 SVG-Waechter ·
9. AUD-C2/C3 Buendel · 10. AUD-B3 weiter mit N34.

## Stand der Umsetzung (26.09.2026, Release v2.2.0, BUILD_LOG 55)
| Befund | Stand |
|---|---|
| AUD-A1 | **gebaut:** Job `deploy` (`needs: check`) mit Migrationen + `wrangler deploy`; ohne Token Warnung. **Offen beim Nutzer:** Secrets setzen, dann Git-Anbindung in Cloudflare trennen (DEPLOY.md). |
| AUD-A2 | **erledigt:** Einstellungen → „Datenschutz" (Verantwortlicher J. Winterberg, Nutzer-Entscheid), „anonym" gestrichen; Test vergleicht die Fristen mit `AUFBEWAHRUNG`. |
| AUD-A3 | **erledigt:** `invocation_logs: false`, Waechter in `api.test.ts`. |
| AUD-B1 | **erledigt:** Wurzel-`package.json` (wrangler 4.141.0, playwright-core 1.63.0 exakt) + Lockfile + Dependabot `/`. |
| AUD-B2 | **erledigt:** Lernstand speichern/laden (Einstellungen → Speicher), Import ersetzt nach Rueckfrage und sichert den alten Stand. |
| AUD-B3 | **offen, gewollt:** N34 T2–T6 als eigene Etappe (Nutzer-Entscheid). |
| AUD-B4 | **erledigt:** Coverage-Schwellen in `vitest.config.ts` + CI-Schritt; Rauchtest `tools/sichtpruefung/rauch.js` in der CI (Sabotage zweimal rot). |
| AUD-B5 | **keine Handlung** – Hinweis, kein Umbau. |
| AUD-C1 | **erledigt:** Migration 0003, live eingespielt, Abfrageplan nutzt den Index. |
| AUD-C2 | **verworfen nach Messung:** Kandidaten ~55 KB von 683 KB (~8 %), nur Erstbesuch; react-dom allein 207 KB. Nutzer-Entscheid „weglassen". |
| AUD-C3 | **erledigt:** kyrillische/vietnamesische Schnitte nicht mehr im Vorab-Cache (Pool: 0 Zeichen aus deren Bereichen). |
| AUD-C4 | ⛔ **FEHLBEFUND:** den Waechter gibt es seit dem Pruefbericht 26.09. (`neu/src/daten/svg.test.ts`). Gesucht hatte ich nur in `tools/`, `tests/`, `check.sh`. |
| AUD-C5 | **erledigt:** `?vor=<nr>`, Seite 200, „Aeltere laden"; Statuspfad mit JSON-/Herkunftspforte. |
| AUD-C6 | ⛔ **FEHLBEFUND:** seit dem neuen PC steht kein Token in `.git/config` (GCM aktiv, gemessen); DEPLOY.md war veraltet und ist korrigiert. |
| AUD-C7 | **erledigt:** `SCHIRME: Record<Bereich, …>` in `App.tsx`. |
| AUD-C8 | **erledigt:** Trusted Types scharf (`trusted-types ap1`), Politik `src/lib/vertrauen.ts`; Rauchtest gruen, Sabotage `'none'` rot. |

## Nachpruefung 26.09.2026 abends (Stand v2.2.0 + N34 T2, Commit 099a354)
Gemessen: `npm audit` neu/, Wurzel, .tooling: je 0 · Coverage CI 93,45/84,25/92,6/95,56 · Rauchtest CI gruen · Deploy nur ueber CI
(`wrangler deployments list`: nach Push 15:32 UTC genau EIN Stand, 15:40 = CI) · `git grep` Token-Muster: 0 · Live: TT + CSP scharf, 0 Verstoesse.
| Kategorie | vorher | jetzt |
|---|---|---|
| Code-Qualitaet & Architektur | 7 | 7,5 (T2 fertig, T3–T6 offen) |
| Sicherheit & Datenschutz | 8 | 9 |
| Performance | 7 | 7 |
| Tests & Doku | 8 | 8,5 |
| DevOps | 7 | 9 |

**Neue Befunde**
- **NP1 (mittel) – Cache-Name nur aus der Version.** `cacheName()` = `ap1-app-<version>`; ein Deploy OHNE Bump (T1, T2) installiert
  in DENSELBEN Cache: `activate` loescht nur fremde Namen, also bleiben alte Buendel liegen (T2: `pooldaten-CQO1ZXh1.js` UND
  `pooldaten-41QwVXzc.js`, je ~2,4 MB) – und das neue `./` ersetzt das alte, waehrend der alte SW noch steuert: die neue Huelle
  kommt beim naechsten Neuladen OHNE Update-Hinweis (N33-Regel „nie waehrend Simulation/Serie" umgangen, wenn dabei neu geladen wird).
  → Cache-Name = Version + Pruefsumme der Dateiliste; Test in `sw.test.ts`.
- **NP2 (niedrig) – Cloudflare-Token breit und ohne Ablauf** (Vorlage „Edit Cloudflare Workers" + D1). → Ablaufdatum setzen, Rotation in DEPLOY.md.
- **NP3 (niedrig) – API-Antworten ohne eigene CSP/Frame-Sperre** (`json()` in api.ts setzt nur nosniff/no-store; `_headers` gilt fuer Worker-Antworten nicht).
  → `content-security-policy: default-src 'none'; frame-ancestors 'none'` in `json()`.
- **NP4 (niedrig) – CI faehrt vitest zweimal** (check.sh 4f + Coverage-Schritt, ~2–3 min). → Coverage in 4f nur in der CI.
- **NP5 (niedrig) – ~60 Kommentare nennen noch `L.grade*`** als Bewerter (fragetypen/, antwortform.ts). → mit N35 (Doku) nachziehen.
- **NP6 (Hinweis, keine Rechtsberatung) – Impressum**: ob eine private, nicht geschaeftsmaessige Lern-App eins braucht (§ 5 DDG), selbst pruefen.

**Weiter offen aus dem ersten Audit:** AUD-B3 (N34 T3–T6), AUD-B5 (Doku-/Werkzeuglast: `check.sh` 1344 Zeilen, 3,2 MB Markdown).

**Umsetzung der Nachpruefung (26.09.2026, BUILD_LOG 57):** NP1 erledigt (Cache-Name `ap1-app-<v>-<stempel>`, `stempelFuer` = SHA-256 der
Vorab-Liste; `activate` raeumt auch dieselbe Version mit altem Stempel – Test) · NP2 DEPLOY.md: Ablaufdatum + Erneuerung (Handgriff beim Nutzer) ·
NP3 erledigt (`API_KOEPFE` mit CSP `default-src 'none'; frame-ancestors 'none'` + `x-frame-options: DENY`, auch am 500 – Test) ·
NP4 erledigt (Coverage in check.sh 4f bei `CI=true`, eigener CI-Schritt weg; Sabotage `branches: 99` → rc 1 bei 1175/0) ·
NP5 erledigt (53 Kommentare in 25 Dateien: `L.grade*`/`L.TYP`/… → Namen aus `kern/bewertung.ts`) · NP6 bleibt beim Nutzer.

**Nachtrag 27.09.2026 (vor der Neupruefung):** AUD-B3 **erledigt** (N34 T6c, v2.2.1: gerechnet wird in `neu/src/kern/`, `logik.js` nur noch in `referenz/`) · AUD-B5 **teilweise** (10 Suiten und 4 Wurzel-Dateien entfernt, `_to_delete/` 44 MB → 218 KB; `check.sh`/Markdown-Umfang unveraendert Hinweis) · NP2 **erledigt** (Nutzer 27.09.: Ablaufdatum gesetzt – nicht messbar von hier) · NP6 **entschieden** (Nutzer 27.09.: kein Impressum noetig).

## Neupruefung 27.09.2026 (Stand v2.2.1 + N35/N36, Commit 75dfc92)
Auftrag: Nutzer, „vollstaendige Neupruefung". Jeder Wert gemessen (Befehl in Klammern).
**Messungen:** `npm audit` neu/ + Wurzel: je 0 · installiert vite 8.3.0 (8.3.1 verfuegbar), react 19.3.0, wrangler 4.141.0 (= aktuell) · CVE-2026-39364 (vite, seit Sept. 2026 aktiv ausgenutzt) betrifft nur 8.0.0–8.0.4 im Dev-Server mit `--host` – nicht betroffen; CVE-2026-0933 (wrangler) betrifft `wrangler pages deploy` – hier `wrangler deploy` · `neu/src`: 228 TS-Dateien, 27 716 Zeilen, `any` nur 1× begruendet (`validierung.ts` Roh-JSON), 2 Linter-Ausnahmen, strict + noUncheckedIndexedAccess, oxlint typeAware 0 · vitest 1113/1113, Coverage 94,69 / 87,23 / 93,52 / 96,36 (vorher 92,86 / 83,8 / 92 / 94,86) · Live-Koepfe: CSP mit `require-trusted-types-for 'script'`, HSTS, COOP, nosniff, DENY, no-referrer, Permissions-Policy; API: CSP `default-src 'none'`, 415 ohne JSON, 401 ohne Schluessel · Worker: nur gebundene SQL-Werte, Koerpergrenze, Herkunftspruefung, Ratenbremse, zeitkonstanter Schluesselvergleich · `invocation_logs: false` · Buendel 665 KB (210 KB gzip), Pool 2,37 MB (673 KB gzip, lazy) · CI: 3 letzte Laeufe auf main gruen, Actions SHA-gepinnt, `permissions: {}`, Dependabot fuer 4 Oekosysteme · Deploy nur ueber CI: am 26.09. gemessen, heute NICHT neu gemessen.
| Kategorie | 26.09. abends | 27.09. |
|---|---|---|
| Code-Qualitaet & Architektur | 7,5 | 8,5 (Kern ganz in TS, `logik.js` nur Referenz) |
| Sicherheit & Datenschutz | 9 | 9 |
| Performance | 7 | 7 |
| Tests & Doku | 8,5 | 8 (Tests besser, Doku-Drift, NA1) |
| DevOps | 9 | 9 |
**Neue Befunde**
- **NA1 (mittel, Doku) – `README.md` beschreibt die alte App:** „Doppelklick auf `lernprogramm_ap1.html`", `logik.js`, „45 Testsuiten", Version in `app_state.js` – alles seit N29/N34 falsch. Veraltete Suiten-Namen auch in `TASKLIST.md`, `PLAENE.md`, `UNTERRICHT_PROJEKT.md`, `VERWEISE_BEFUNDE.md`, `PROMPT_IDEEN-PAKET.md`, `prompts/*.md` (`git grep test_logik|test_unterricht`).
- **NA2 (niedrig, Werkzeug) – `tools/sabotage.sh`** nennt im Kopf `--datei logik.js --suite logik` (beides weg) und kann nur die 7 alten Suiten; Sabotagen am Kern laufen weiter als Einwegskripte (SCHIENE_NEU §3).
- **NA3 (niedrig, Tests) – Coverage-Schwellen** (92/83/91/94) liegen 2–4 Punkte unter dem Ist – ein Rueckgang faellt erst spaet auf. → knapp unter das Ist nachziehen.
- **NA4 (Hinweis)** vite 8.3.1 verfuegbar; Dependabot hebt am Montag an.
- **NA5 (Hinweis, Architektur)** 10 Gleichheitstests halten den Kern dauerhaft gegen die eingefrorene `referenz/logik.js`. Eine BEWUSSTE Regelaenderung im Kern macht sie rot – dann braucht es einen Entscheid wie E57 (Referenz fortschreiben oder Test auf Eigenschaften umstellen).
- **NA6 (Hinweis, Sicherheit)** Schreibwege lassen Anfragen ohne `Origin`/`Sec-Fetch-Site` zu (Werkzeuge): kein CSRF-Risiko, Spam begrenzt durch Ratenbremse + D1-Grenzen – keine Handlung.
**Offen aus frueheren Pruefungen:** keine (AUD-B5 Hinweis, NP2/NP6 beim Nutzer erledigt).

**Umsetzung der Neupruefung (27.09.2026, BUILD_LOG 68):** NA1 erledigt – `README.md` neu (Aufbau Neubau, Gebiete, Fragen ergaenzen, Pruefung, CI-Deploy; keine Zahlen), `ARCHITECTURE.md` neu als Landkarte des Neubaus (alte Fassung verbatim nach `referenz/ARCHITECTURE_ALT.md`), Veraltet-Vermerk in `prompts/feature_draft.md`, `prompts/fragetyp_neu.md`, `PROMPT_IDEEN-PAKET.md`; Protokolle (`PLAENE.md`, `UNTERRICHT_PROJEKT.md`, `VERWEISE_BEFUNDE.md`, TASKLIST-Lehre) bleiben als Geschichte · NA2 erledigt (`sabotage.sh`-Kopf) · NA3 erledigt (Schwellen 94/86/93/96, Lauf mit `--coverage` rc 0 bei 94,73/87,36/93,68/96,42).

## Rest 28.09.2026 (BUILD_LOG 84)
NA4 **erledigt** (vite 8.3.1 mit Dependabot #8, v2/ neu gebaut) · Actions checkout/setup-node v7 (#4) · NA5 bleibt Hinweis (kein Handlungsbedarf, solange keine Regel bewusst geaendert wird) · Dependabot-Sperren: Major fuer `typescript` (7.x ohne JS-Compiler-API) und `@types/node` (Laufzeit 24) · Deploy nur ueber CI nach dem Push neu gemessen (siehe unten).
**Offen aus den Audits:** keine.
**Deploy nur ueber CI – gemessen 28.09.2026 nach Push `4f50b6b`:** Check-Runs am Commit (`gh api …/commits/<sha>/check-runs`) nur `github-actions` („check.sh (voll)" → „Deploy zu Cloudflare (nach gruenem check.sh)" success 08:03 UTC), KEIN Cloudflare-Workers-Builds-Lauf (ebenso an `b1c41ac`); live `…/v2/` liefert `index-CXYAEcTV.js` = neuer Bau. `wrangler deployments list` auf diesem PC nicht moeglich (Wurzel-`node_modules` fehlt, `npx` verweigert).

## Neupruefung 28.09.2026 (Stand v2.2.3 + TS 7, Commit f5d4083, Konto web.de)
Auftrag: Nutzer, „vollstaendige Neupruefung". Jeder Wert gemessen (Skript `_to_delete/helfer/neupruef.sh`, Ausgabe `neupruef.txt`).
**Messungen:** `npm audit` neu/ + Wurzel: je 0 · Dependabot-Alarme offen: 0 · offene PRs: 0 · installiert vite 8.3.1, react 19.3.0, typescript 7.0.2, vitest 5.0.1 (5.0.2 da), oxlint 1.85.0, @types/node 24.13.6 (24.19.0 innerhalb der Sperre) · `neu/src`: 237 TS-Dateien (150 ohne Tests), 28 861 Zeilen, `any` nur 1× begruendet (`validierung.ts`), Linter-Ausnahmen 2 + `frage.generiert.ts` (erzeugt), tsc rc 0, oxlint 0/0 · vitest 1147/1147 (87 Dateien), Coverage 94,82 / 87,73 / 93,84 / 96,45 (Schwellen 94/86/93/96 halten) · Live `/`: CSP mit Trusted Types, HSTS, COOP, nosniff, DENY, no-referrer, Permissions-Policy; `/v2/` → 301 auf `/` (gewollt, `_redirects`); ausgeliefert `index-CXYAEcTV.js` = `v2/` · API live: text/plain 415, fremde Origin 403, ohne/falscher Schluessel 401, CSP `default-src 'none'` · Worker seit 27.09. nur zwei entfernte `as string` · `invocation_logs: false` · Buendel 669 KB (211 KB gzip), Pool 2,37 MB (673 KB gzip, lazy) · CI: letzte 5 Laeufe gruen, Deploy an `784ff52` nur `github-actions` · Geheimnis-Suche im Baum + `git log -S ghp_`: 0 Treffer, `.git/config` ohne Token.
| Kategorie | 27.09. | 28.09. |
|---|---|---|
| Code-Qualitaet & Architektur | 8,5 | 8,5 (Lernstand-Inhalt typisiert, E62) |
| Sicherheit & Datenschutz | 9 | 9 |
| Performance | 7 | 7 |
| Tests & Doku | 8 | 8 (NB1) |
| DevOps | 9 | 9 |
**Neue Befunde**
- **NB1 (mittel, Bau/Werkzeug) – `neu/coverage/` ist nicht ignoriert und vergiftet den Bau:** nach `cd neu && npx vitest run --coverage` (so rät es 4f_umbau.sh Zeile 75 selbst) war `check.sh` rot: „Auslieferung v2/ weicht vom Bau ab" – CSS, Einstieg, Pool-Chunk und `app-sw.js` anders. Ursache gemessen: Ordner weg → Probebau gleich `v2/`. Tailwind liest den nicht ignorierten HTML-Bericht als Quelle. Gefahr: ein Bau + `git add -A v2` danach liefert fremde Klassen aus. → `coverage/` in `neu/.gitignore` und `reportsDirectory` aus dem Arbeitsbaum.
- **NB2 (niedrig, Sicherheit) – kein Geheimnis-Scan:** Repo privat, GitHub Secret/Code Scanning aus (404/403), `check.sh` sucht nicht nach Tokens. Heute von Hand 0 Treffer. → einfacher Waechter (Muster wie oben, `git grep`) in `check.sh`.
- **NB3 (Hinweis, Plugin-Doku)** `fisi-lernapp` SKILL.md §1 nennt als Live-Stand `…/v2/#<bereich>`; die App liegt unter `/` (Umleitung haelt den #-Bereich). Mit dem naechsten Plugin-Release nachziehen.
- **NB4 (Hinweis, Robustheit)** `siebe` (`kern/stand.ts`) baut `gut` als `{}` – ein Schluessel `__proto__` ginge still verloren (kein Prototyp-Befall, keine echten Schluessel betroffen). Keine Handlung.
- **NB5 (Hinweis)** vitest/coverage-v8 5.0.2 und @types/node 24.19 verfuegbar – Dependabot.
**Offen aus frueheren Pruefungen:** keine (NA5 bleibt Hinweis).

**Umsetzung der Neupruefung (28.09.2026, BUILD_LOG 87, Nutzer-Auswahl NB1+NB2+NB3):** NB1 erledigt – `reportsDirectory` `../_to_delete/helfer/coverage` in `neu/vitest.config.ts` + `coverage` in `neu/.gitignore`; Gegenproben: Coverage-Lauf legt nichts mehr in `neu/` ab, Probebau = `v2/`; alter Bericht zurueck nach `neu/coverage/` → Probebau trotzdem = `v2/` (Netz haelt) · NB2 erledigt – Waechter `4e13_geheimnisse` (git grep `--untracked`, nennt nur Dateinamen); Gegenproben: sauber → ok, `ghp_…` in neuer Wurzeldatei → rot, `AKIA…` in `neu/` → rot, zwei Dateien → beide genannt, in ignorierter Datei → ok (so gewollt, Kopf sagt es), `GIT_DIR` kaputt → „Werkzeug stumm" · NB3 erledigt – SKILL.md Live-Stand `…/#<bereich>`, Plugin fisi 1.0.5 · NB4/NB5 Hinweise ohne Handlung.

## Neupruefung 09.10.2026 (Stand v2.3.1, Commit de0f48a, Konto web.de)
Auftrag: Nutzer, „weiter" → naechster Plan-Abschnitt nach N38 fehlte → Neupruefung (AskUserQuestion). Jeder Wert gemessen (`_to_delete/helfer/neupruef2.sh` → `neupruef2.txt`, `lh_a11y.sh` → `lh_a11y.txt`).
**Messungen:** tsc rc 0 · oxlint 0/0 · vitest 1187/1187, Coverage 94,73/87,76/94,05/96,36 (Schwellen 94/86/93/96) · `as`-Ratsche 21/21 · `neu/src` 158 Dateien ohne Tests, groesste `Simulation.tsx` 447 Zeilen · Einstieg `index-*.js` 163 KB gzip, Pool 673 KB gzip (lazy) · Live-Header CSP/HSTS/COOP/XFO/nosniff/Referrer/Permissions vorhanden, API-404 mit `default-src 'none'` · Lighthouse live (BUILD_LOG 106) LCP 2,2 s, TBT 40–100 ms · Lighthouse a11y/BP/SEO: `/` 100/100/91, `#einst` 100/100/91, `#ueben` **86**/100/91 · Pool 1140 (M01 129, M02 117, M03 210, M04 214, M05 74, M06 119, M07 174, M08 103).
| Kategorie | 28.09. | 09.10. |
|---|---|---|
| Code-Qualitaet & Architektur | 8,5 | 8,5 |
| Sicherheit & Datenschutz | 9 | 8,5 (NC1) |
| Performance | 7 | 9 (N38) |
| Tests & Doku | 8 | 8 |
| DevOps | 9 | 8 (NC2, NC4) |
| Barrierefreiheit (neu) | – | Uebens-Schirm 86 (NC3) |
**Neue Befunde**
- **NC1 (mittel, Sicherheit)** 16 offene Dependabot-Alarme (4 high: brace-expansion ×2 in neu/, undici ×2 in Wurzel), alle Scope `development` (shadcn-CLI, wrangler/miniflare) – nichts beim Lerner. PRs #10 (30.09.), #11 (30.09.), #12, #13 (05.10.) offen; #10–#12 CI gruen, nie gemergt.
- **NC2 (mittel, DevOps)** Dependabot-PRs fuer `neu/` scheitern strukturell: #13 „[FEHLER] Auslieferung v2/ weicht vom Bau ab" – `v2/` ist eingecheckte Bauausgabe, Dependabot baut nicht.
- **NC3 (mittel, Barrierefreiheit)** `#ueben`: 15 × color-contrast in der Tab-Leiste (`opacity-70`/`opacity-50` auf 11-px-`font-mono`, 3,62 bzw. 2,51 : 1 im Dunkelmodus) · `aria-label` auf `span` ohne Rolle (`Kartenkopf.tsx:23`) · `aria-controls` des aktiven Radix-Tabs zeigt auf ein nicht gerendertes Inhaltselement.
- **NC4 (niedrig, Werkzeug)** `.git/objects`: 870 `tmp_obj_*` (41 MB, 07.–10.09. und 25.09.) + 5476 lose Objekte (162 MB) bei 7 MB Pack – nie `git gc`.
- **NC5 (niedrig, Doku)** 3,4 MB Markdown getrackt (BUILD_LOG_ARCHIV 1,4 MB), 78 Dateien in der Wurzel, 6 Wurzel-`.md` ohne Verweis: E3_M03/M04/M07_VERWEISE, PRODUCT, T2_RESTLISTE, T3_TEXTE.
- **NC6 (niedrig, Fehler)** `Kartenkopf.tsx:24` zeichnet 3 Punkte und „Schwierigkeit ${n} von 3" – die 97 Stufe-4-Fragen zeigen „4 von 3" (Typ seit N37 U1 `1|2|3|4`).
- **NC7 (Hinweis)** `meta-description` fehlt (SEO 91) · Patches verfuegbar: vite 8.3.4, vitest/coverage-v8 5.0.3, oxlint 1.87, radix-ui 1.7.0, lucide-react 1.53, jsdom 30.1.2.
**Offen aus frueheren Pruefungen:** keine (NA5 bleibt Hinweis). **Nutzer-Auswahl 09.10.:** alle (NC1–NC7) → **N39** in `PLAN_NEUBAU.md`.

## Komplettpruefung 09.10.2026 abends (Stand v2.3.2, Commit 1ab6554, neuer PC, Konto web.de)
Auftrag: Nutzer, „kompletten Check des Projektes … online suchen, was der Standard ist". Pruefrahmen (gelesen 09.10.):
OWASP Top 10:2025 (top10.owasp.org/2025), OWASP ASVS 5.0.0 (owasp.org/www-project-ASVS), OpenSSF Scorecard (18 Checks, scorecard.dev),
WCAG 2.2 AA per axe-core 4, DSGVO Art. 13. Skript `_to_delete/helfer/komplett.sh` → `komplett.txt`; Barrierefreiheit auf der Cloud-Seite
(Playwright + axe-core gegen `git archive HEAD v2`, SHA-1 5451d070…).
**Messungen:** `check.sh` voll ALLES GRUEN (74 ok; tsc 0, oxlint 0/0, vitest 1187, Bau, Einstieg 166 KB gzip, Geheimnis-Waechter) ·
`git fsck` rc 0, keine losen Objekte (NC4 haelt) · `npm audit`: Wurzel 0, `.tooling` 0, `neu/` nur Laufzeit 0 – gesamt 7 high = EIN Hinweis
GHSA-vfj7-8cjw-p6xm (`braces` ≤3.0.3, kein Fix) ueber `shadcn`-CLI (dev; `shadcn` bleibt wegen `shadcn/tailwind.css`) · `npm audit signatures`:
194 Pakete mit Attestierung · Lizenzen Laufzeit: MIT 134, MPL-2.0 24 (lightningcss, nur Bau), ISC 3, Apache-2.0 2, OFL/BSD/0BSD je 1 – nichts Copyleft
im Buendel · Dependabot offen 1 (braces) · Live-Header unveraendert vollstaendig (CSP + Trusted Types, HSTS, COOP, XFO, nosniff, Referrer, Permissions),
API `default-src 'none'`, `no-store`; OPTIONS fremde Herkunft → 401 ohne CORS-Koepfe · Quelltextkarte live 404 · `security.txt` 404 ·
Historie: 6 Treffer auf Token-Muster = nur Doku/Regex-Text, kein echtes Token; `.git/config` ohne Token · keine Binaerdateien getrackt ·
CI letzte 5 gruen, Workflow `permissions: {}`, Actions SHA-gepinnt, Standardrecht `read`, Deploy nur `needs: check` auf main ·
Repo privat (Free): Branch-Schutz/Rulesets 403, Secret Scanning 404, Code Scanning 403 – auf diesem Plan nicht verfuegbar ·
axe (WCAG 2.0–2.2 A/AA + best-practice): 15 Bereiche × hell/dunkel × 1280/390 px = 60 Ansichten, 58 sauber; dazu 40 Fragezustaende in `#ueben`
(Frage + aufgedeckte Loesung) 0 Befunde; Tastatur: 25 Tab-Schritte auf `#start` alle mit sichtbarem Fokus.
**Kein Befund (geprueft):** `http://` liefert 200 ohne Umleitung – `.dev` steht als ganze TLD in der HSTS-Preload-Liste der Browser, ein Browser
geht nie per http dorthin · SQL nur ueber `bind()`, Grenzen im INSERT (A05) · Schluesselvergleich in fester Zeit, Bremse vor dem Schluessel (A07) ·
Koerper gestreamt mit Grenze, Fehler nach aussen nur „interner Fehler" (A10) · SVG nur ueber Trusted-Types-Politik + Pool-Waechter · Datenschutz-Schirm
mit Verantwortlichem, Zwecken, Fristen, Cloudflare/DPF, Rechtsgrundlage, Rechten, Beschwerde (Art. 13).
| Kategorie | 09.10. frueh | 09.10. abends |
|---|---|---|
| Code-Qualitaet & Architektur | 8,5 | 8,5 |
| Sicherheit & Datenschutz | 8,5 | 9 (NC1 erledigt) |
| Performance | 9 | 9 (live nicht neu gemessen) |
| Tests & Doku | 8 | 8,5 (Rauchtest im echten Browser in CI) |
| DevOps | 8 | 8,5 (NC2 erledigt) |
| Barrierefreiheit | 86 → 100 | 59 von 60 Ansichten sauber (ND1) |
**Neue Befunde**
- **ND1 (mittel, Barrierefreiheit, WCAG 2.1.1 Tastatur)** `#stat` bei 390 px: Scrollbereich ohne fokussierbaren Inhalt (axe `scrollable-region-focusable`,
  serious, hell+dunkel) – Tastaturnutzer koennen nicht scrollen. `Statistik.tsx:35` → `tabIndex={0}`, `role="region"`, `aria-label`.
  Startseite/Fehlerdeck (gleiche Klasse) haben Knoepfe und bestehen.
- **ND2 (niedrig, Sicherheit, ASVS V8/Token-Ablage)** Admin-Schluessel dauerhaft in `localStorage` (`Meldungsliste.tsx:36/39`). Heute gedeckt durch strenge
  CSP + Trusted Types; trotzdem → `sessionStorage` oder „Schluessel merken" als bewusste Wahl.
- **ND3 (niedrig, DevOps, Scorecard Pinned-Dependencies)** Repo-Einstellung `sha_pinning_required: false`, `allowed_actions: all` – die SHA-Pins haelt nur
  die eigene Disziplin. → Einstellung einschalten (`gh api -X PUT repos/…/actions/permissions`), Actions auf GitHub-eigene + benannte beschraenken.
- **ND4 (niedrig, Scorecard SAST)** Keine statische Sicherheitsanalyse ausser tsc/oxlint; CodeQL/Secret Scanning auf privatem Free-Repo nicht verfuegbar
  (gemessen 403/404). → Semgrep CE als CI-Schritt, ODER Repo oeffentlich (dann CodeQL, Secret Scanning, Branch-Schutz kostenlos) – Nutzer-Entscheid.
- **ND5 (niedrig, Pflege)** PR #15 (oxc-parser, 06:17 UTC – vor der Dependabot-Umstellung 06:22) offen, CI gruen · 7 alte Remote-Zweige
  (cloudflare/workers-autoconfig ×2 vom Juli, 5 Dependabot) · `delete_branch_on_merge: false`.
- **ND6 (Hinweis, DSGVO Art. 5 Abs. 1 lit. e)** offene Meldungen ohne Frist (Nutzer-Entscheid 26.09.) – Speicherbegrenzung haengt am Abarbeiten.
- **ND7 (Hinweis, OWASP A09:2025)** Fehlerberichte und Worker-Fehler landen in D1/Workers Logs, aber niemand wird benachrichtigt.
**Nicht gemessen:** Rechte des `CLOUDFLARE_API_TOKEN` (nur im Cloudflare-Dashboard sichtbar) · Laenge von `MELDE_SCHLUESSEL` (Code verlangt ≥16, ASVS-Sinn
≥128 Bit Zufall = ≥22 Zeichen Base64) · TLS 1.0/1.1 (openssl hier ohne diese Protokolle) · Coverage (prueft nur die CI; letzter Lauf gruen).
**Offen aus frueheren Pruefungen:** keine (NA5 bleibt Hinweis).
**Umsetzung (09.10.2026 abends, BUILD_LOG 111, Nutzer-Auswahl ND1+ND4 mit Semgrep):** ND1 erledigt – `Statistik.tsx` Scrollbereich `tabIndex={0}`,
`role="region"`, `aria-label="Statistik"`; Schnappschuss `bereich-stat` gewollt neu (Inhalt jetzt unter `region "Statistik"`) · ND4 erledigt – CI-Job
`semgrep` (Semgrep CE 1.180.0, 76 Regeldateien security/nicht-audit/MEDIUM+HIGH aus semgrep-rules @ 9bbf021), Release und Deploy `needs: [check, semgrep]`,
Dependabot pip `/tools/semgrep`. Gegenprobe Cloud-Seite: ohne Unterdrueckung rc 1 mit 4 Funden (localhost-`fetch` in `tools/sichtpruefung`), mit
`// nosemgrep` + Begruendung rc 0; `actionlint` ohne Befund. Ganze Registry-Ordner (ohne Auswahl) gaben 380 Funde, davon 0 echte Luecken in `neu/src`.
**Umsetzung (09.10.2026 spaet, BUILD_LOG 117, Nutzer-Auswahl „nur offene ND-Punkte"):** ND2 **bleibt** (Nutzer-Entscheid: CSP + Trusted Types decken es) ·
ND3 erledigt – `actions/permissions`: `allowed_actions=selected`, `sha_pinning_required=true`; `selected-actions`: nur GitHub-eigene (`github_owned_allowed=true`,
`verified_allowed=false`, keine Muster); gemessen per `gh api` GET. Die Workflows nutzen nur `actions/checkout` und `actions/setup-node` (SHA-gepinnt), Semgrep laeuft ueber pip ·
ND5 erledigt – `delete_branch_on_merge=true`; PR #15 (oxc-parser 0.151.0 → 0.153.0) lokal gemergt, `npm ci` + Bau + `check.sh` voll, dann Push. ND6/ND7 bleiben Hinweise.
**Neubewertung 09.10.2026 spaet (Stand 5c63ae7, nach BUILD_LOG 111/116/117; KEINE neue Messung ausser CI 2ab174e success und `gh api`-Einstellungen):**
| Kategorie | 09.10. abends | 09.10. spaet | Grund |
|---|---|---|---|
| Code-Qualitaet & Architektur | 8,5 | 8,5 | unveraendert (nur oxc-parser-Patch) |
| Sicherheit & Datenschutz | 9 | 9,5 | ND4 Semgrep als CI-Riegel; Rest ND2 (bewusst), ND7 |
| Performance | 9 | 9 | nicht neu gemessen |
| Tests & Doku | 8,5 | 8,5 | unveraendert |
| DevOps | 8,5 | 9,5 | ND3 SHA-Pflicht + nur GitHub-Actions erzwungen, ND5 Auto-Loeschen + PR #15; Rest: kein Branch-Schutz (Free-Plan, 403) |
| Barrierefreiheit | 59/60 | 60/60 erwartet | ND1 behoben, axe NICHT neu gefahren |
Inhalt/Veroeffentlichung: Verlagsname und Buch-Kuerzel aus Pool und Roh-Batches entfernt (BUILD_LOG 116); Doku-Nennungen bleiben (Nutzer-Entscheid).
