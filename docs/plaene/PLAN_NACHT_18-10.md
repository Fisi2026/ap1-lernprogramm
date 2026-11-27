# docs/plaene/PLAN_NACHT_18-10.md – Nachtarbeit 17.10. 23:30 → 18.10. 10:00 (Leitung + Cloud-Arbeiter)

**Zweck:** Diese Datei reicht allein, um die Leitung zu übernehmen – aus einer neuen Cloud-Sitzung, einem Chat im Konto
web.de oder am PC (Nutzer-Entscheid 17.10. ~23:30: „auch web.de/PC“). Sie ersetzt keine Regel aus `START_PROMPT.md`,
`regeln/*.md` oder dem Skill `fisi:fisi-lernapp`; sie hält nur die Entscheide und den Ablauf dieser Nacht fest.
Liegt auf dem Zweig `claude/exciting-wright-e537gm` (Sitzungszweig der Leitung) und kommt mit dem ersten Push auf main.

## 0. Übernehmen (neue Leitung, egal welches Konto)

```
- [ ] Skill fisi:fisi-lernapp + fisi:agenten-orchestrierung laden; Einrichtung „Cloud baut, PC misst“ (git config ap1, npm ci ×3, pip)
- [ ] git fetch origin main claude/exciting-wright-e537gm 'refs/heads/m3-*:refs/remotes/origin/m3-*' 'refs/heads/n4*:refs/remotes/origin/n4*' 'refs/heads/n5*:refs/remotes/origin/n5*'
- [ ] git checkout -b leitung origin/claude/exciting-wright-e537gm   (alle übernommenen, grünen Stände)
- [ ] Diese Datei ganz lesen, dann Abschnitt 3 (Stand) gegen origin messen: git ls-remote origin; Tag: git ls-remote --tags origin v2.10.5
- [ ] Arbeiter-Sitzungen messen: get_session / list_events (claude-code-remote) für jede ID in Abschnitt 3 – ohne diese Werkzeuge
      (PC-/Projekt-Chat): Links im eingebauten Browser öffnen (Lehre regeln/bruecke.md 17.10.)
- [ ] Abschnitt 3 nachziehen, committen (Doku-Commit), auf den Sitzungszweig pushen – dann weiter bei der ersten offenen Phase
```
Alte Leitung: `session_01Pz3yG4t8cSgi462rgpBQtP` (Opus, Cloud, Konto gmail). Wer übernimmt, schreibt eine Zeile in Abschnitt 3.

## 1. Feste Entscheide dieser Nacht (Nutzer, 17.10. 21:40–23:30)

| # | Entscheid |
|---|---|
| N1 | **main bleibt zu**, bis `git ls-remote --tags origin v2.10.5` trifft (Release fährt die alte PC-Leitung). Kein Tag bis 01:30 → main bleibt bis zum Nutzer zu; alles Grüne nur auf `claude/exciting-wright-e537gm`. Danach: Push auf main, `bash tools/ci_warte.sh`. |
| N2 | **Kein Release, kein Tag, kein Deploy** in der Nacht (Plan: „Release vorher fragen“). Cloud darf ohnehin keine Releases (HTTP 403). |
| N3 | Stryker `break` bleibt `null`; erst neuer Gesamtwert (Phase 2), dann entscheidet der Nutzer. |
| N4 | Echter Fehler im Programmcode: kleine, eindeutige Korrektur erlaubt – Test vorher rot/nachher grün, **eigener Commit** „Fix: …“; `referenz/` nie ändern (seit 18.10.: Code/Verhalten nie, Kommentare nur auf Nutzer-Entscheid, SCHIENE_NEU E60). |
| N5 | 85-%-Regel (5h): Cloud-Sitzungen mit `rateLimitType ccr_promotional` / `status allowed` (aus `get_session`) brechen NICHT ab. |
| N6 | Budget Cloud-Guthaben: **60 $** für alle Sitzungen zusammen (Summe `usage.cost_usd`). Ist es erreicht oder endet das Guthaben: **weiter auf dem Planvolumen**; bei 5h ≥ 85 % gesichert anhalten und zum 5h-Reset übergeben (neue Sitzung/„weiter“); bei **7T ≥ 85 % Schluss**. |
| N7 | Leitungswechsel ab Kontext Start+400k erlaubt (neue Cloud-Sitzung mit Abschnitt 0 als Auftrag). |
| N8 | Phase 9: Stichprobe neu ziehen (Skript ins Repo), Pool-Fachfehler beheben erlaubt, Web-Recherche (IHK-Merkblätter) erlaubt. |
| N9 | Phase 10: Meldeweg in `SECURITY.md` = GitHub „Private vulnerability reporting“; keine E-Mail im Repo. |
| N10 | Phase 11: CI-Entwurf nur LOKAL messen; kein PR, keine Actions-Minuten. |
| N11 | Phase 12: harden-runner mit **vollem SHA** in der Erlaubnisliste (im Entwurf beschreiben; Einstellung erst nach N40 V3). |
| N12 | Entwürfe (Phasen 10–12) übernimmt die Leitung NICHT ohne Nutzer-Ja; Phase 8 (reines Messwerkzeug) und 9 (Pool-Fixes) schon, je mit grünem `check.sh`. |
| N13 | Keine geplanten Aufgaben (`create_trigger`) anlegen; Arbeiter sind Cloud-Sitzungen (`create_session`, Modell setzen). |

## 2. Ablauf je Arbeiter-Stand (Leitung)

```
- [ ] git fetch origin <zweig>; git log --oneline leitung..origin/<zweig>; git diff leitung...origin/<zweig> SELBST lesen:
      nur erlaubte Pfade? Tests prüfen Verhalten (Ausgabe, Rückgabe, Aufrufe), keine Spiegel der Umsetzung? referenz/ unberührt?
- [ ] git cherry-pick -n <basis>..origin/<zweig>   (ALLE Commits des Stands, nicht nur die Spitze – Falle 17.10.)
- [ ] bash tools/vorlauf.sh → voller bash check.sh (losgelöst, s. u.) → nur bei „ALLES GRÜN“: bash tools/gitc.sh commit -F <msg>
      (Werte aus dem Bericht, Hinweis „laut Arbeiter“ wenn nicht selbst gemessen; Endzeile Co-Authored-By)
- [ ] git push origin leitung:claude/exciting-wright-e537gm   (nie --force; main nur nach N1)
- [ ] Abschnitt 3 nachziehen
```
**Lange Läufe losgelöst starten** (ein Hintergrundlauf des Werkzeugs stirbt nach 30 min – gemessen 17.10.):
`setsid nohup bash -c '<lauf> > <log> 2>&1; echo rc=$? >> <log>' >/dev/null 2>&1 </dev/null & disown`; Ende per Monitor auf `^rc=`.
**Nie** `pkill -f stryker` aus einer Shell, deren Befehlszeile „stryker“ enthält (tötet sich selbst, rc 144). Abgebrochener Lauf:
`bash tools/stryker_lauf.sh --nur-heilen`. Stryker parallel zu `check.sh` nur in einer eigenen Arbeitskopie (`git worktree add --detach`,
`node_modules` ×3 verlinken), weil `inPlace` ~270 Dateien umschreibt.
**Fallen 18.10. (gemessen):** `tools/gitc.sh commit` nimmt nur den **Index** – nach einer Korrektur erst `git add`, vor dem Commit
`git status --short` ohne ` M`-Zeilen (827f245 ging ohne die Korrektur raus, 9d5e48c holte sie nach). Vor jedem Stryker-Lauf
`bash tools/vorlauf.sh`, nicht nur vitest (tsc/oxlint fielen erst im vollen check.sh auf). Push auf main nur über `tools/gitc.sh push`
(Stempel-Sperre); der Sitzungszweig wurde mit `git push origin leitung:claude/exciting-wright-e537gm` gesichert.
**Arbeiter hängt** (IDLE, kein Stryker läuft, > 90 min kein Push): `send_message` „weiter laut Auftrag; Stand melden“.

## 3. Stand (jede Leitung zieht ihn nach)

| Wer | Sitzung | Modell | Aufgabe | Zweig | Stand |
|---|---|---|---|---|---|
| Leitung 1 | session_01Pz3yG4t8cSgi462rgpBQtP | Opus | Leitung + A | leitung → claude/exciting-wright-e537gm | übergeben ~00:40 (Kontext Start+300k); Sitzungszweig 982b524 (+ dieser Plan-Commit) |
| Leitung 2 | session_01XwXgPDYnWQf8NJutt5rXns | Opus | Leitung ab 00:30 | wie oben | übernommen 00:35 (Abschnitt 0; C/D/E/F per send_message umgestellt); Tag v2.10.5 00:30 nicht da → main zu |
| A | (fertig) | Opus | kern/lernstandort.ts | 827f245 + 9d5e48c | **64,01 → 89,97 %** gemessen (Lauf 2: 304 K, 1 T, 34 S); Rest begründet in 827f245; offen: Z. 76 `Date.now`-Mutant |
| B | – | Sonnet | server/api.ts 72,34 → 97,07 % (laut B) | m3-api 2abf740 | übernommen (de3c78b) |
| C | session_0146j3KYTfWNpfAxwdJsLEGa | Opus | 9 Dateien < 80 % + freitext-Rest | m3-rest | **fertig** 00:33 (HEAD 7d58592, ganz übernommen); Werte laut C: klausur 65→99, antwortform 67→97, stand 79→94, zahlen 77→89, da/wirktyp/fehlerbericht →100, meldeversand 79→98, netzplan 80→96, freitext 91→93 |
| D | session_01YL937vaVnbxCxJCQjrKG2k | Sonnet | UI huelle (539) | m3-huelle | **fertig**, übernommen bac1c9f (69b293c); laut D Ist 75,06 %, 8 Dateien danach 73–100 % (useLernstand 73,3, Rest gleichwertig) |
| E | session_013dzYNXtDzXmRdDfm8UZbYZ | Sonnet | UI fragetypen (11 von 22) | m3-fragetypen | **fertig**, übernommen 7b76aee; Ist fragetypen 38,9 %, E-Dateien alle ≥ 80 |
| F | session_01FkdB1n7noheq87EgryxSs9 | Sonnet | UI schirme (12 von 25) | m3-schirme | **fertig**, übernommen bdf6432; Ist 58,55 %, alle 12 ≥ 80 |
| Q1 | session_0197EbvqAHMRth4v24qfv5cy | Sonnet | Phase 8 item_flaws | n50-q1 | **fertig**, übernommen b8238db (4c22310) |
| P5 | session_01TQqoYJmvkcYA9vNsBoMr1u | Opus | Phase 9 75 Fragen | n48-p5 | **fertig**, übernommen dac6c72..e5777c6 (4 Fixes M08-110/-609, M08-323, M08-312, M05-950; 4 unklar + M03-115 Befund) |
| C1-c | session_01KBBZmaXDzDArqDbDWuZPvU | Sonnet | Phase 3 rechner/verderben | n44-c1-rechner | **fertig**, übernommen b645428; rechner 91,40 → 91,36 % (toter √-Zweig) |
| C1-d | session_01UqMXD7Lpz46CuhvHkv232t | Sonnet | Phase 3 bedeutungsbaum | n44-c1-baum | **fertig**, übernommen ef65e6b; 86,15 → 86,96 % |
| C1-e | session_014AVzgtj8sJEhLZ3L4V7pEF | Sonnet | Phase 3 server | n44-c1-server | **fertig**, übernommen d95876d; 90,20 → 98,60 %; Ratsche gesenkt 3856961 (CCN>15 10 → 0, NLOC>80 2 → 0) |
| F2 | session_01GVQBF1EmqAFMAFH95rmpHg | Sonnet | Phase 1 schirme Teil 2 (13 Dateien) | m3-schirme2 | **fertig**, übernommen 9146c1a; alle 13 ≥ 80 |
| E2 | session_01ST7u3uWh8CMHB5wsqH5f1x | Sonnet | Phase 1 fragetypen Teil 2 (11 Dateien) | m3-fragetypen2 | **fertig**, übernommen 91ab422; alle ≥ 80 (register: Stryker-Artefakt) |
| V4 | session_016wKfXbq8LfYTpgyEi44HRE | Sonnet | Phase 10 Entwurf | n40-v4 | **fertig** 5d07b38, nicht übernommen (N12) |
| B5 | session_01LigmzMPkX7FjcPd99BSsDy | Sonnet | Phase 11 Entwurf | n42-b5 | **fertig** 6aee1b1, nicht übernommen (N12) |
| S45 | session_01FoHhLMEYP88zKbv7KcbxnM | Sonnet | Phase 12 Entwurf | n41-s45 | **fertig** 272fa7e, nicht übernommen (N12) |
| Leitung 2 | – | – | Phase 5 Zweig-Abdeckung | – | **gemessen** 01:45 auf 3856961: 90,36 % (3744/4143) ≥ 90 → keine Sitzung; Schwelle (86) nur nach Nutzer-Ja |
| G | session_01TJZfH4RPDHfQ3eP1VGRe6Q | Sonnet | Phase 2 kern1, dann fragetypen1 | m3-mess-kern1, m3-mess-fragetypen1 | **fertig** (ohne faulschirme-Test): kern1 92,06 · ft1 90,62 |
| H | session_013KgmrctFz9fja5e27TRUtn | Sonnet | Phase 2 kern2, dann fragetypen2 | m3-mess-kern2, …-fragetypen2 | **fertig**: kern2 91,78 · ft2 88,09 |
| I | session_01UDzNXPZh4UhBAtTadHqeo1 | Sonnet | Phase 2 kern3 | m3-mess-kern3 | **fertig**: kern3 93,33 |
| K1 | session_019BqY7mMEabeRkajsGaFPuq | Sonnet | Phase 2 schirme1 | m3-mess-schirme1 | **fertig**: 89,64 (9146c1a) |
| K2 | session_01Tp4c9HHBXGymmJaFJLTGTc | Sonnet | Phase 2 schirme2, dann fragetypen4 | m3-mess-schirme2, …-fragetypen4 | **fertig**: schirme2 92,04 · ft4 90,94 |
| J | session_01U5ZHCPSmzzybLkhAeTrCE5 | Sonnet | Phase 2 server+huelle, dann fragetypen3 | m3-mess-server-huelle, …-fragetypen3 | **fertig** (ohne faulschirme-Test): server 94,33 · huelle 90,41 · ft3 90,53 |
| **Phase 2 Ergebnis** | – | – | Gesamtwert | – | **kern+server 92,62 %** (17.10.: 86,28) · **gesamt 91,93 %** (113 Dateien); BUILD_LOG 220 |
| C1-a | session_01YLWRKYonjMTm2sQsrk4iJ2 | Opus | Phase 3 validierung | n44-c1-validierung | **fertig**, übernommen da3e78d; laut C1-a Stryker 95,47 → 98,05 % |
| C1-b | session_01AfMSDdVdXMcMpvNMffLxE7 | Sonnet | Phase 3 freitext/antwortform | n44-c1-bewertung | **fertig**, übernommen 1b708ab (v2/ von der Leitung gebaut) |
| Leitung 2 | – | – | Phase 4 ruff 2 → 0 | Sitzungszweig | **fertig** 6180819 (check.sh grün) |

Abweichung 00:52 (Leitung 2): Phase 2 G–J vorgezogen, weil kern/server/huelle für Phase 1 fertig sind und die Laufzeit (17.10.: 6 h 42 min für kern+server) sonst nicht bis 09:30 reicht; dadurch zeitweise 10 Sitzungen statt ~6 (Messsitzungen warten meist, Kosten gering).
Kosten 05:53 (gemessen, alle Sitzungen seit 19:00 UTC): **94,15 $** (Opus 59,93, Sonnet 34,22) – Budget 60 $ überschritten, erst 05:10 bemerkt; danach keine neue Sitzung.
Kosten 00:52 (gemessen): Leitung 1 15,66 · Leitung 2 3,29 · P5 7,53 · Q1 1,81 $ + übrige ≈ 33 $.
Kosten 00:30 (gemessen, get_session): Leitung 1 14,51 · C 1,36 · D 1,41 · E 0,72 · F 0,58 $ = **18,58 $** (+ B, abgeschlossen, nicht gemessen). Alle `ccr_promotional`/`allowed`.
Kosten (`cost_usd`) 00:08: D 1,14 · E 0,57 · F 0,51 $; 23:10: Leitung 3,42 · C 1,36 $ – Summe bei Übergabe neu messen. Alle `ccr_promotional`/`allowed`.

## 4. Phasen

### Phase 1 – Dateien unter 80 % und UI-Teil (läuft, Arbeiter A/C/D/E/F)
Abnahme je Datei: Wert vorher → nachher (Stryker nur diese Datei), gleichwertige Mutanten im Code begründet, nur Testdateien
(+ erlaubte Fixes N4), `check.sh` grün. A: nach dem Lauf Survivors in `lernstandort.ts` lesen, Tests nachziehen, gleichwertige
benennen, `lernstandort.ts` selbst NICHT ändern; dann in den Hauptbaum (`git -C /home/user/wt-a format-patch` → `git am`), `check.sh`.

### Phase 2 – neuer Gesamtwert (nach dem Einsammeln von Phase 1)
Grundlage: `claude/exciting-wright-e537gm`. Fünf Sonnet-Sitzungen, NUR messen, nichts ändern:
G/H/I = `src/kern` in drei Teilen (gleich viele Mutanten; Liste per Stryker-Trockenlauf oder nach Dateigröße), J = `src/server` + `src/huelle`,
K = `src/fragetypen` + `src/schirme`. Je Sitzung `--concurrency 2`, losgelöst, Ausgabe `werte_<teil>.json` (je Datei killed, timeout,
survived, nocoverage, ignored, score) auf Zweig `m3-mess-<teil>`. Leitung: Gesamtwert = (killed+timeout)/(killed+timeout+survived+nocoverage),
Vergleich mit 17.10. (86,28 %, BUILD_LOG 212), Vorschlag für `break` an den Nutzer (N3).

### Phase 3 – N44 C1: Komplexität ≤ 15, Funktion ≤ 80 Zeilen
Gemessen 17.10. 23:10 (`python3 -m lizard -l typescript -x "*.test.*" --csv neu/src`; Ratsche: CCN>15 = 10, NLOC>80 = 2):

| Sitzung | Modell | Funktionen (CCN/NLOC) | Zweig |
|---|---|---|---|
| C1-a | Opus (Plan: „aus dem Schema ableiten“) | kern/validierung.ts: anonym 109/132, validateFragen 44/44 | n44-c1-validierung |
| C1-b | Sonnet | kern/freitext.ts autoCheckText 31/101 · kern/antwortform.ts falscheAntwort 18/31 | n44-c1-bewertung |
| C1-c | Sonnet | kern/rechner.ts zerlege 24/39 · testhilfe/verderben.ts varianten 26/41 | n44-c1-rechner |
| C1-d | Sonnet | huelle/bedeutungsbaum.ts geh 19/22, zustand 18/20 | n44-c1-baum |
| C1-e | Sonnet | server/fehlerregeln.ts pruefeFehler 17/21 · server/regeln.ts pruefeEingang 16/18 | n44-c1-server |

Grundlage: Sitzungszweig NACH Phase 1 (die neuen Mutationstests sind das Schutznetz). Abnahme: alle vorhandenen Tests unverändert
grün, Schnappschuss unverändert, Mutationswert der Datei nicht schlechter, `lizard` je Funktion ≤ 15 / ≤ 80, `check.sh` grün.
Danach senkt die Leitung `tools/qualitaet_ratsche.json` auf die neuen Ist-Werte (eigener Commit). Phase 2 misst den Stand VOR C1.

### Phase 4 – N45 W2: ruff 2 → 0 (Leitung, klein)
B006 `tools/verweis_setzen.py`, RUF015 `tools/r3_2_gantt.py` (laut BUILD_LOG); Ratsche `ruff` 2 → 0.

### Phase 5 – Zweig-Abdeckung (Ziel N43: ≥ 90 %, 09.10.: 87,8 %)
Messen (`cd neu && npx vitest run --coverage` auf dem Sitzungszweig). Unter 90 %: je Ordner mit den meisten offenen Zweigen eine
Sonnet-Sitzung, nur Tests, Regeln wie Phase 1. Schwelle in `check.sh` 4f (AUD-B4) erst nach Nutzer-Ja anheben.

### Phase 8 – N50 Q1: Item-Writing-Flaws als Messwerkzeug (Sonnet, Zweig n50-q1)
Neu `tools/item_flaws.py` (oder `.js`, wie `pool_query.js`) über den Pool (`pool/*.json`), Regeln nach PLAN_NEUBAU N50 Q1
(Moore u. a. 2023, arXiv 2307.08161): (1) längste Option = richtig, ALLE Auswahltypen (der Pool-Wächter prüft nur einen Teil – erst messen,
welchen); (2) absolute Begriffe („immer“, „nie“, „alle“, „nur“) nur in Distraktoren; (3) „keine der genannten“ / „alle genannten“;
(4) Wortwiederholung Fragestamm ↔ richtige Antwort. Ausgabe: Befundliste je Regel (Frage-ID, Regel, Beleg), Zählung je Regel und Typ.
Pflicht `--probe` (regeln/messen.md 11.10.): ≥ 5 gebaute Fälle mit bekannter Antwort je Regel, darunter Grenzfälle und einer, der rot sein muss.
Danach Fehlalarmquote an 20 gezogenen Befunden je Regel von Hand prüfen und angeben. KEIN Wächter, KEINE Pool-Änderung (Plan: „erst Befundliste,
dann je Regel entscheiden“). Leitung übernimmt Werkzeug + Befundliste (Datei unter `tools/` bzw. Bericht im BUILD_LOG).

### Phase 9 – N48 P5-Rest: 75 Fragen inhaltlich (Opus, Zweig n48-p5)
Lesen: `START_PROMPT.md`, `regeln/pool.md`, `regeln/messen.md` ganz; BUILD_LOG_ARCHIV (141). Ziehung neu (N8): `tools/p5_ziehen.js` ins Repo,
5 je Fragetyp, Seed 1110, die 30 am 11.10. gelesenen ausgeschlossen (Typen baukasten, beschriftung, bild, dropdown, erklaeren, fehlersuche,
freitext teilweise – IDs, soweit in BUILD_LOG 141 genannt; sonst je Typ die ersten 5 der alten Ziehung NICHT rekonstruierbar → im Bericht sagen).
Je Frage: fachlich richtig? Erklärung passt zur Lösung? widerspricht eine andere Frage? Quelle: Lehrtexte `0x_*.md`, Lehrbuch nur mit Zitat.
Eindeutige Fachfehler beheben wie am 11.10.: Fix + Anker in `begriffe_belegt.json` + Gegenprobe (Ur-Zustand rot → grün) + poolweite Suche
nach derselben Aussage. Offene Fälle: M08-110 (Freistellung vor AP1, § 15 BBiG – IHK-Merkblätter im Web lesen, Quelle + Datum), M03-115 (gering).
Unklares → Befundliste, nicht ändern. Abnahme: `check.sh` grün; Leitung übernimmt (N12). Beim Lerner erst mit dem nächsten Release (Nutzer).

### Phase 10 – N40 V4: öffentliche Hülle, ENTWURF (Sonnet, Zweig n40-v4)
`LICENSE`: „Alle Rechte vorbehalten“ (E66: keine Lizenz), Inhaber „ap1“ bzw. wie im Repo. `SECURITY.md`: Meldeweg GitHub „Private vulnerability
reporting“ (N9), Hinweis: erst nach N40 V3 aktiv; was im Rahmen ist (App, Worker-API), was nicht. `README.md` für Fremde: was die App ist,
Live-Adresse (START_PROMPT), wie man lokal baut/prüft (`check.sh`), Hinweis auf fehlende Lizenz. Wächter 4e14 (keine private E-Mail, kein
Katalog-Fremdtext) und 4e12 beachten. Nur Entwurf; Leitung übernimmt NICHT (N12).

### Phase 11 – N42 B5: CI schneller, ENTWURF (Sonnet, Zweig n42-b5)
`.github/workflows/ci.yml`: `check.sh` in parallele Jobs (Ziel < 3 min statt ~5), gleiches Urteil. Erst messen: welche Abschnitte von
`check.sh` wie lange laufen (lokal, `time` je Abschnitt, 3 Läufe), welche voneinander abhängen (Bau → Vergleich v2/, Stempel). Entwurf:
Jobs + Sammel-Job, der das alte Urteil „ALLES GRÜN“ bildet; lokal beweisen, dass die Summe der Teil-Urteile = altes Urteil (auch bei
einem absichtlich roten Teil an einer Probe-Datei, nicht am Arbeitsbaum). Kein PR (N10). Nur Entwurf.

### Phase 12 – N41 S4/S5: Herkunft und Pins, ENTWURF (Sonnet, Zweig n41-s45)
S4: `actions/attest-build-provenance` für den ausgelieferten Bau (`v2/`) im Deploy-Workflow, mit vollem SHA gepinnt; Prüfbefehl
(`gh attestation verify …`) in `DEPLOY.md`. S5: Semgrep und `.tooling` mit Prüfsummen (`pip --require-hashes`, Lockfile), harden-runner im
Audit-Modus mit vollem SHA (N11) – im Entwurf vermerken, dass die Erlaubnisliste (S2) den Eintrag `step-security/harden-runner@<SHA>` braucht
und erst nach N40 V3 gesetzt wird. Nur Entwurf; Wirkung erst im öffentlichen Repo.

### Reihenfolge und Parallelität
Jetzt: Phase 1. Danach parallel: Phase 2 (messen) + Phase 3 (C1) + Phase 8 + Phase 9. Wenn Plätze frei: 10 → 11 → 12, Phase 5 nach Phase 3.
Phase 4 macht die Leitung zwischendurch. Gleichzeitig höchstens ~6 Arbeiter. Jede Phase prüft vor dem Start das Budget (N6).

## 5. Arbeiter-Auftrag (Vorlage)
Alle Aufträge allein verständlich, Muster: Aufträge D/E/F vom 17.10. (in `list_events` der Sitzungen lesbar). Pflichtteile:
Leitungs-Sitzung als Empfänger der Berichte (`send_message`) · Einrichtung (Skill, git config ap1, npm ci ×3, pip) · Lesepflicht ·
eigener Zweig, nie main, nie Release, kein BUILD_LOG, keine geplanten Aufgaben, keine weiteren Sitzungen · Agenten nur mit `model` ·
lange Läufe losgelöst (Abschnitt 2) · Abnahme der Phase · N4/N5 · Schlussbericht ≤ 15 Zeilen mit Belegen („gemessen oder angenommen?“).
Modell beim `create_session` setzen (`claude-sonnet-5-5` / `claude-opus-5-5`), `outcome_branch` = Zweig, Tag `ap1-nacht-18-10`.

## 6. Abschluss (bis 10:00)
BUILD_LOG (220) über den Doku-Weg (nur Sitzungszweig, solange main zu): Modelle (D/E/F Sonnet, B Sonnet, C Opus, Leitung Opus), 7T vorher/
nachher, Ergebnisse je Datei/Phase, Entscheide N1–N13, Korrektur zur Lehre 17.10. in `regeln/bruecke.md` (gemessen 17.10. 22:20: aus einer
Cloud-Sitzung gehen `create_session`, `send_message`, `get_session`, `list_events` – der Browser-Weg ist nur ohne diese Werkzeuge nötig),
„Damit offen: …“ (u. a. fisi 1.3.14 releasen (PC), Nutzer installiert in gmail UND web.de, installiert.txt nachziehen; Projektdokument im
Konto web.de aus tools/plugin/projekt_einstieg.md ersetzen). Morgenbericht an den Nutzer: main/Tag, Commits, Werte, Kosten, offene Fragen
(Release, N40 V3 Umzug, break, Entwürfe 10–12, Coverage-Schwelle).
