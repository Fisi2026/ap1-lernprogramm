# Der Neubau `neu/` — die Schiene

⚠️ **DIESE DATEI IST DER WEGWEISER, NICHT DER STAND.** Der laufende Stand des Neubaus steht im
`BUILD_LOG.md` (Etappen `N…`), die Zahlen im Code und in `check.sh` Abschnitt 4f. **Was hier steht,
ist am 15.09.2026 abgeschrieben; im Zweifel gilt die gemessene Quelle**, die je Punkt genannt ist.
⚠️ **Was noch ansteht und was dazu entschieden ist, steht in `docs/plaene/PLAN_NEUBAU.md`** (Nutzer-Entscheide
vom 16.09.2026: der Neubau soll die alte App ablösen, erst parallel ausgeliefert).
⛔ **Keine zweite Liste offener Punkte hier** — zwei Listen für dieselbe Sache driften immer. Die
eine steht als Schlusszeile („Damit offen: …") im **letzten** BUILD_LOG-Eintrag.

## 1. Was der Neubau ist — und was er nicht ist

⚠️⚠️ **SEIT 22.09.2026 (E17 in `docs/plaene/PLAN_NEUBAU.md`) IST DIE ALTE APP NUR NOCH REFERENZ.** Die beiden ⛔⛔-Sätze
unten gelten bis zum Umschalten (N29) bzw. bis der Kern in TypeScript steht (N34); abgelöst werden sie dort, nicht vorher.

**React 19 + TypeScript + Vite, Tests mit vitest (jsdom), Oberfläche shadcn/ui auf `neutral`, nur
Dark** (Entscheid 10.09., Herleitung in `docs/plaene/PLAN_DARSTELLUNG.md`). Es ist **kein Python**, und es ist
kein zweites Programm neben der alten App: es ist **dieselbe App in neuer Darstellung**.

~~DIE ALTE APP BLEIBT DAS, WAS BEIM LERNER LÄUFT~~ – **abgelöst mit N29** (24.09.2026): beim Lerner läuft der
Neubau; die alte App liegt nur noch als Referenz in `referenz/` (Tag `alt-app-final`).

⛔⛔ **GERECHNET WIRD IN `kern/`** (seit N34 T6c, 27.09.2026; vorher `logik.js`). Jede Regel steht genau
einmal unter `neu/src/kern/`; Oberfläche und Werkzeuge (`tools/kern.js`) rufen sie auf. Wer eine Regel
anderswo nachbaut, hat zwei Fassungen derselben Regel gebaut — und die laufen auseinander.

## 2. Die Bereiche (vierzehn in der Schiene, dazu zwei ohne Eintrag)

⛔ **Quelle ist der Code**: `BEREICHE` in `neu/src/kern/route.ts` (seit N22, dort hängen die Adressen `#ueben`, `#frage=ID` dran), die Schiene in `neu/src/huelle/Schiene.tsx`, eingehängt in
`neu/src/App.tsx`. Die folgende Liste ist eine Abschrift vom 15.09.2026.

| Bereich | Stand |
|---|---|
| Startseite (`start`) | **gebaut** (N22) — Kacheln mit gemessenen Badges, „Dein Stand", öffnet ohne Adresse |
| Üben (`ueben`) | **gebaut** — Ziehung, Verlauf, Zufallsaufgaben, Themen-Serie |
| Klausurvorbereitung (`unterricht`) | **gebaut** (N28, E47) — nur der ehrliche Schirm: zählt M09 im Pool, sagt bei 0 selbst „kein Klausurstoff"; Ziehung erst mit Stoff |
| Tagesserie (`serie`) | **gebaut** (N21) — 5 Fragen aus dem schwächsten Gebiet, Gebiet ab Start fest, `serieDone` |
| Fehler-Deck (`fd`) | **gebaut** — Liste, nicht zweiter Übungsschirm |
| Markierte Fragen (`markiert`) | **gebaut** (N20a) — Liste, Entfernen, „Markierte üben“ |
| Statistik (`stat`) | **gebaut** — Bereitschaft je Prüfungsgebiet |
| Einstellungen (`einst`) | **gebaut** — Termin, Tagesziel, Prüfungsteil |
| Prüfungssimulation (`sim`) | **gebaut** — Start, Lauf mit Uhr und Navigation, Auswertung |
| Rechen-Generator (`gen`) | **gebaut** — Art wählen, rechnen, Lösungsweg; bucht nur `GEN:` und den Tag |
| Netzplan (`netzplan`) | **gebaut** — fünf Felder je Knoten, kritischer Weg erst nach dem Prüfen |
| Gantt (`gantt`) | **gebaut** — Planungsaufgabe, Balkenplan erst nach dem Prüfen |
| Glossar (`glossar`) | **gebaut** — Begriffe aus dem Pool + Klausurliste, Abkürzungen hinter dem Tor |
| Spickzettel (`spickzettel`) | **gebaut** - neun Abschnitte, Suche, Markdown |
| Einzelfrage (`frage`, **nicht in der Schiene**) | **gebaut** (N22) — `#frage=ID` oder Klick auf eine Kennung (Markiert, Fehler-Deck, Meldungsliste); bucht nichts |
| Meldungen (`meldungen`, **nicht in der Schiene**) | **gebaut** (N20b) — über die Einstellungen |

⚠️ **Ein nicht gebauter Bereich sagt es selbst** („… ist in dieser Fassung noch nicht gebaut",
`App.tsx`) — er ist nicht heimlich leer und nicht ausgeblendet.

## 3. Wie im Neubau gemessen wird

| Frage | Befehl |
|---|---|
| Laufen die Tests? | `cd neu && npx vitest run` |
| Stimmen die Typen? | `cd neu && npx tsc -b --noEmit` |
| Hält das ganze Netz? | `bash check.sh` — Abschnitt **4f** prüft Typen, Tests, Bau |
| Hat sich die BEDIENUNG still verschoben? | `npx vitest run src/huelle/schnappschuss` – der Bedeutungsbaum je Bereich/Fragetyp (N25 P0); gewollte Änderung mit `-u`, Diff lesen, im BUILD_LOG begründen |
| Trägt ein neuer Test? | Sabotage: Muster **genau einmal** ersetzen, Datei **immer** wiederherstellen, **rot ist das Bestehen** |

⚠️ **Der Sollwert der Testzahl steht in `check.sh` 4f** (nicht hier) und wird bei jeder Etappe
nachgezogen — er fängt den Lauf, der stumm ins Leere fährt. **Eine Datei mit `status != "passed"`
ist ein Fehler, auch wenn 0 Tests fehlschlagen**: „kein Fehler" und „nicht gelaufen" sind zwei
verschiedene Dinge (Anlass 14.09., `generator.gleichheit.test.ts`).
⛔ **`tools/sabotage.sh` kann nur die 45 alten Suiten**, nicht vitest. Für den Neubau gibt es noch
kein Werkzeug; die Sabotagen laufen als Einwegskript in `_to_delete/helfer/`.
### Drei Werkzeugfallen, die in diesem Umbau mehrfach zugeschlagen haben

| Falle | Wie sie aussieht | Was hilft |
|---|---|---|
| **8-KB-Grenze** beim Schreiben über die Brücke | Die Datei kommt **abgeschnitten** an (208 Zeilen wurden 188, mitten im JSX) — und der Rest der Shell-Zeile wird als Heredoc-Inhalt verschluckt | Lange Dateien **in Stücken** schreiben (`cat >` dann `cat >>`) und danach `wc -l` prüfen |
| **Backslashes kollabieren** unterwegs | `new RegExp("… \(0 %\)")` wird zu `(0 %)` — aus der Klammer wird eine Gruppe, der Test findet nichts und fällt scheinbar grundlos | Regex meiden, wo eine ganze Zeichenkette reicht; sonst mit Python schreiben und Backslashes über `chr(92)` bauen |
| **Python schreibt CRLF** unter Windows | Zehn Dateien lagen im Arbeitsbaum auf CRLF, obwohl `.gitattributes` `eol=lf` erzwingt (der Index blieb sauber) | Beim Schreiben `io.open(…, newline="")` mitgeben |

⚠️ **Jeder Brückenaufruf ist bei 60 s gedeckelt** — Testlauf und `check.sh` gehören in den
Hintergrund (Rezept in `START_PROMPT.md` Abschnitt 2).

## 4. Die Etappen — Herleitung jeweils im BUILD_LOG

`N1` Vertrag mit logik.js · `N2` Gegenprobe pool/ gegen fragen.js · `N4a–N4g` alle Fragetypen
bedienbar, mit Gleichheitsbeweis gegen die alte App · `N5a/N5b` der Lernstand (**kein neues
Format**) · `N6a–N6c` Auswahl, Ziehung, ziehender Schirm · `N7` Zufallsaufgaben · `N8` der Kopf
(gemessene Zahlen statt erfundener) · `N9` Einstellungen · `N10` Fehler-Deck · `N11` Themen-Serie · `N12` Spickzettel ·
`N13` Rechen-Generator als eigener Schirm · `N14` Glossar · `N15` Gantt-Training · `N16` Netzplan-Training · `N17a` Simulation: Kern und Regel-Umzug nach logik.js · `N17b` Simulations-Schirm · `N18` parallel unter `/v2/` · `N19` Rückseite vollständig · `N20a` Stern, Melden, Markiert · `N20b` Online-Meldungen (Worker + D1, `neu/src/server/`, Betrieb: `DEPLOY.md`) · `N21` Tagesserie (neu geschrieben, Gleichheitsbeweis gegen `sSerie`) · `N22` Startseite, Einzelfrage, Adressen (Hash-Routing) · `N23` Begriffs-Tooltips und Lupe · `N24` Einstellungen nachziehen (Abruf-Übung, Bildbeschreibungen, Simulationsdauer, Gewichtung) · `N24b` Typ-Hilfe „So geht's“ und ihr Schalter.

## 5. Die Lehren dieses Umbaus, die weiter gelten

* ⛔⛔ **EIN ZWEIG, DEN KEIN AUFRUFER ERREICHT, IST KEIN FEATURE** (N11). `ziehen.ts` gab der
  Themen-Serie vom ersten Tag an Vorrang und war dafür grün getestet — gefüllt hat sie niemand.
* ⛔⛔ **EIN GEBAUTER FALL IST ERST EIN FALL, WENN ER DEN WEG NIMMT, DEN ER MESSEN SOLL** (N11).
  Der Kollisionstest baute gegen **M09** — das die Übenauswahl ohnehin verwirft.
* ⛔⛔ **EIN STATE-UPDATER IST KEIN ORT FÜR SEITENEFFEKTE** (N6c) und **eine Abbruchbedingung, die
  am Ergebnis hängt, bricht nicht ab, wenn das Ergebnis anderswo landet** (N7).
* ⛔⛔ **WAS SICH NICHT MESSEN LÄSST, WIRD WEGGELASSEN, NICHT GENULLT** (N8) — im Kopf standen vier
  erfundene Zahlen, an der sichtbarsten Stelle des Programms.
* ⛔ **LÖSCHEN PASSIERT AUF KLICK, NICHT BEIM LADEN** (N10). Die alte App räumt still beim Start
  auf; hier ausdrücklich nicht — es ist der einzige Schritt, der Lernstand vernichtet.
* ⛔⛔ **EINE BEWUSSTE REGELAENDERUNG IM KERN MACHT DEN GLEICHHEITSTEST ROT – DAS IST RICHTIG SO** (E60,
  27.09.2026). `referenz/` bleibt eingefroren. Wer eine Regel in `kern/` absichtlich aendert, stellt **genau den
  betroffenen** Gleichheitstest auf eine Eigenschaft der neuen Regel um und **benennt die Abweichung zur alten App
  im Test** (Frage-ID/Fall, alt → neu, Nutzer-Entscheid). Nie `referenz/` anpassen, nie den Test abschalten.
  ►► **Geschärft 18.10.2026 (Nutzer-Entscheid):** **Code und Verhalten** in `referenz/` nie ändern. Reine **Kommentarzeilen** nur auf
  Nutzer-Entscheid und mit Beleg: Diff enthält nur Kommentarzeilen, alle 17 `*.gleichheit.test.ts` grün (Anlass: N40 V3 O5, Quellenname).
* ⛔⛔ **DIE CI WAR NEUN LÄUFE ROT, UND LOKAL WAR ALLES GRÜN** (14.09.): `neu/` hatte dort nie seine
  Abhängigkeiten bekommen. **Ein grüner Lauf zu Hause ist kein CI-Befund.**
