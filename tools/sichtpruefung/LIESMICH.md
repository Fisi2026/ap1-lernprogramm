# Sichtprüfung im echten Browser — das Werkzeug der N25-Teilschritte

⛔ **WARUM ES HIER LIEGT UND NICHT IN `_to_delete/`:** bis zum 21.09.2026 lag es dort — also in
`.gitignore`, also **für den nächsten Chat verloren**. Dieselbe Lehre wie bei der Training Shell
am 18.09. **Ein Werkzeug, das jede Etappe braucht, gehört ins Repo.**

## Was es misst — und was nur es messen kann

⛔⛔ **IN JSDOM IST JEDE GRÖSSE NULL.** `getBoundingClientRect()` liefert dort überall 0, deshalb
kann **kein vitest-Test** sehen, ob ein Element zwar da ist, aber auf 0×0 zusammenfällt.
**Gemessen am 21.09.2026 (N25 P4): die Lupe ging seit N23 mit einem LEEREN Kästchen auf**, während
2264 Zeichen SVG-Markup im DOM standen und alle Tests grün waren. ►► **Wer Größe, Überlauf oder
Lesbarkeit behauptet, misst hier — nicht in jsdom.**

## Die drei Skripte

| Datei | Was sie tut |
|---|---|
| `typen.js` | alle 20 Fragetypen, 1280 und 390 px, alt gegen neu: Bedienelemente, Überläufer, Tabellenbreite, Konsolenfehler, Vollbild-Screenshots |
| `p4.js` | fünf **Zustände der Karteikarte** (Urteil · Melden · Bedienhilfe · Lupe · Kennung in „Markiert"), dieselben Maße |
| `p5.js` | die **Listen-Schirme** (Markiert, Fehler-Deck, Meldungsliste), je **gefüllt und leer**, dazu die Schlüsselabfrage — dieselben Maße plus `null0` (Elemente auf 0×0) und die Zahl der `listitem`. ⚠️ Die Meldungsliste braucht einen Server: `p5.js` beantwortet `/api/meldungen` selbst über `p.route` und legt den Schlüssel in den `localStorage`. |
| `p6.js` | **Glossar und Spickzettel** (zu, gesucht, Abkürzungen; Spickzettel voreingestellt und gesucht). ⛔⛔ Misst zusätzlich **`offen0`** — aufgeklappte Accordion-Abschnitte OHNE Höhe. Das ist die Klasse „leere Lupe": in jsdom nicht zu sehen. ⚠️ `tabellen` ist zwischen alt und neu NICHT vergleichbar — `<details>` hält alle Abschnitte im DOM, das Accordion nur die offenen. |
| `breite.js` | **N25b:** woher die Mindestbreite kommt - je Bereich `main`/`nav`, die Grid-Spalten, die Zahl der Ueberlaeufer und die Kette nach oben mit `minWidth`/`flex`/`grid-template`. Aendert nichts. |
| `breite_probe.js` | **Gegenprobe dazu:** setzt `minmax(0,1fr)` NUR IM BROWSER und misst vorher/nachher. ⛔ Je Bereich eine FRISCHE Seite - sonst wirkt der eingespritzte Stil weiter (Falle 1 unten, am 22.09. prompt zugeschlagen). |
| `rest.js` | **Was nach dem Fix noch uebersteht**, gruppiert nach `whiteSpace`/`minWidth`/`overflow`/`flexShrink` und auf die OBERSTEN Ueberlaeufer reduziert - 370 Einzelelemente sagen nichts, 2 oberste sagen alles. Die Abnahmemessung fuer N25b. |
| `rechner.js` | **N26 T6:** der Taschenrechner in seiner Klappe (rechenassistent, kalkulation), zu und auf, 1280/390: `doc`, `raus`, Tasten sichtbar / auf 0×0 / rechts raus, kleinste Taste, und **`erreichbar_gleich`/`erreichbar_notiz`** - nach dem Rollen im Fenster? ⚠️ Die Karte hat einen EIGENEN Rollbereich: ein Vollbild zeigt den Rechner darin nicht, deshalb rollt das Skript und macht davon eigene Bilder (`…-gleich.png`, `…-notiz.png`). |
| `zuschauer.js` | **N31, nachgeholt 23.09.:** Zuschauer-Hinweis (start, einst, nach Übernahme), Rückfrage-Dialog bei laufender Simulation, Einstellungen → „Speicher" sauber und repariert, 1280/390. Der Zuschauer ist ECHT: zwei Seiten im selben Kontext teilen `navigator.locks`. ⛔ Misst **`deckt`** (Titeltext unter einem Knopf) und **`badgeDeckt`** (Kachel-Badge auf dem Titel) über die TEXTZEILEN (`Range.getClientRects`) – die Box ist volle Breite und hätte bei 1280 falsch rot gemeldet; `textRaus` sieht einen absolut liegenden Knopf gar nicht. Nur Port 8765. |
| `offline.js` | **N33, seit N29 unter `/`:** Server `dienst.py` Port **8767**, Zeiger `_to_delete/helfer/offl.zeiger` → `_to_delete/helfer/offl/` (das Skript kopiert den Inhalt von `v2/` dorthin). Vorab-Cache nach dem ersten Besuch · offline JEDEN Bereich per Neuladen (Ladefehler, „noch nicht gebaut", Zeichenzahl) · Update-Fall: zweite Fassung (anderer Cache-Name in `sw.js`), **während einer laufenden Simulation KEIN Hinweis**, nach „Abgeben" ja · „Neu laden" → neuer Cache, alter eigener weg, Cache der alten App (`ap1-v…`) unberührt · Hinweis bei 390 px ohne Überdeckung. Urteil in `sicht4/offline.json`. (Der 404 auf `/favicon.ico` ist seit N29 behoben: `index.html` verlinkt `icon-192.png`.) |
| ~~`umschalten.js`~~ (13.10.2026 nach `tools/archiv/`, Umschaltung erledigt) | **N29 (R9):** ein Gerät mit BEIDEN alten SW (alte App unter `/`, Neubau 1.41 unter `/v2/`) landet nach dem Umschalten auf dem Neubau. Server `dienst.py` Port **8768**, Zeiger `_to_delete/helfer/umsch/wurzel.txt`: Phase 1 = alter Stand per `git archive` nach `_to_delete/helfer/umsch/web/`, Phase 2 schreibt den Zeiger auf `v2/` um. Misst 11 Punkte (Umleitungen 301, beide Seiten auf `/` mit Neubau, `#ueben` erhalten, nur `app-sw.js`, alte Caches weg, offline). ⛔ Phase 1 braucht den ALTEN Stand: nach dem Release-Commit `git archive v1.41.0` statt `HEAD`. ⚠️ Keine eigene Anfrage über den alten SW schicken, während der Abschalt-SW wartet – sie hielt ihn am 24.09. in „waiting" fest (ein Lerner löst das durch Neuladen/Schließen). |
| `rauch.js` | **Audit AUD-B4 (26.09.), laeuft in der CI:** der AUSGELIEFERTE Stand `v2/` mit den Koepfen aus `_headers` – jeder Bereich aus `BEREICHE` (`kern/route.ts`), `#frage=M01-002/471/511`, offline nach SW-Steuerung, und **0 CSP-/Trusted-Types-Verstoesse**. Port **8769**, startet `dienst.py` selbst. `PW_KANAL=chrome` (CI) oder `msedge` (Vorgabe). playwright-core kommt aus dem Wurzel-`package.json` (`npm ci` im Wurzelordner). Sabotage 26.09.: `font-src 'none'` → 15 Befunde, `trusted-types 'none'` → 9 Befunde. |
| `dienst.py` | **Testserver** wie Cloudflare: `Cache-Control: no-cache`, wertet `_redirects` aus, **seit 26.09. auch `_headers` (Block `/*`) – die CSP gilt also wie live**, Auslieferungsordner steht in einer Zeigerdatei (Umschalten ohne Kopieren). ⛔ **Nie `python -m http.server` für SW-Abnahmen** (24.09.: Edge nahm die alte `index.html` aus dem HTTP-Cache – Scheinbefund „Neubau startet nicht“). ⛔ **Vor dem Start alte Server beenden, mit `grep -a`** (`netstat` schreibt „ABHÖREN“, ohne `-a` überspringt grep die Zeile – zwei Server lagen auf demselben Port, der alte antwortete). |
| `n48p4.js` | **N48 P4 (11.10.2026): Darstellung auf Handy-Breite (390 px)** fuer bild/hotspot/beschriftung, dropdown mit Optionen ab 40 Zeichen und Fragen mit Sonderzeichen (oder `--nur ID,ID`), je frisch und nach „Aufgeben“: `raus` (rechts aus dem Fenster, ohne rollenden Vorfahren), `doc`, `svg0`, SVG rechts raus, Konsolenfehler und **`klein` nach WCAG 2.2 SC 2.5.8** – unter 24 px UND die Abstands-Ausnahme verfehlt (Radios zaehlen mit ihrem Label). Port **8770**, startet `dienst.py` selbst, misst `v2/`. Ergebnis `sicht4/n48p4.json`, Bilder nur bei Befunden ausser `klein`. Gegenprobe: `N48P4_SABOTAGE=1 … --nur M01-002` muss `raus` und `svg0` melden. ⚠️ `doc` bleibt 0, weil die Huelle waagerecht abschneidet – der Ueberlauf zeigt sich nur in `raus`. |
| `lupe3.js` | eine Einzelmessung am geöffneten Zoom: Kasten- und SVG-Maße im DOM |

`ids.json` nennt je Fragetyp eine Beispiel-Kennung. **Bilder und `mass.json` landen in
`_to_delete/helfer/sicht4/`** (gitignore — Screenshots gehören nicht ins Repo, sie werden ANGESEHEN).

## So läuft es (Training Shell, Windows)

⛔⛔ **BIS 13.10.2026 STAND HIER `python3 -m http.server` IM REPO-ORDNER – DAMIT MASS KEIN SKRIPT MEHR DIE APP.**
Seit N29 liegt die App unter `/` und laedt `/assets/…`; unter `/v2/` aus dem Repo-Ordner kamen die Assets mit 404, die
Seite blieb leer (0 Knoepfe, kein `<main>`), und p5/rest/breite meldeten trotzdem rc 0 (BUILD_LOG 154). ►► Immer `dienst.py`.

```
cd neu && npx vite build && cd ..                     # der Arbeitsbaum, nach v2/
bash tools/sichtpruefung/server.sh start             # EIGENER Aufruf: neu = v2/ auf 8765, alt = HEAD-Stand auf 8766, prueft Assets 200
bash tools/hinter.sh sicht 'NODE_PATH=$PWD/node_modules node tools/sichtpruefung/typen.js'   # playwright-core aus dem Wurzel-package.json
bash tools/sichtpruefung/server.sh stop
```
Die Skripte rufen weiter `…/v2/` auf – `dienst.py` leitet nach `_redirects` auf `/` um, der Hash bleibt erhalten.
`typen.js` braucht ~200 s (20 Typen × 2 Breiten × alt/neu): **nie mit kurzem `timeout`** – ein abgebrochener Lauf meldet
„Target crashed“, das ist dann der Abbruch, kein Absturz der App (gemessen 13.10.).
Dann **die Bilder ansehen** (`device_stage_files` → `Read`), nicht nur die Zahlen lesen.

## Drei Fallen, die schon zugeschlagen haben

* ⛔⛔ **EIN HASH-WECHSEL LÄDT DIE SEITE NICHT NEU.** Wer den Lernstand nach dem ersten Laden in
  `localStorage` schreibt und dann nur `#frage=…` anhängt, zeichnet weiter mit dem LEEREN Stand —
  Stern und Melden sehen kaputt aus und sind es nicht (gekostet: eine Stunde am 21.09.).
  ►► **Nach dem Schreiben `p.reload()`.**
* ⚠️ **`<details>` rendert seine verborgenen Kinder mit, ein `Collapsible` hängt sie aus.** Die Zahl
  der Bedienelemente ist deshalb zwischen altem und neuem Stand NICHT vergleichbar; vergleichbar
  sind **Überläufer (`raus`), waagerechter Rollweg (`doc`) und die Breite von `main`**.
* ⚠️ **`git archive HEAD v2` ist der AUSGELIEFERTE Stand, nicht der Quelltext von HEAD.** Liegt ein
  Teilschritt committet, aber ohne neues Bündel, misst man gegen den Stand DAVOR. Das ist gewollt
  (der Lerner sieht das Bündel), muss aber beim Lesen der Zahlen mitgedacht werden.
* ⛔ **Die zwei `http.server` in DERSELBEN Brücken-Zeile wie der Messlauf starten, hält den Aufruf bis
  zum 60-s-Deckel offen** (22.09.) - die Server laufen danach trotzdem. Server in einem eigenen Aufruf
  starten, den Lauf über `tools/hinter.sh`.
* ⚠️ **Server beenden:** `kill` aus Git Bash erreicht die Windows-Python-Prozesse nicht zuverlässig.
  PID über `netstat -ano | grep -a "127.0.0.1:876[56] "` - ⚠️ das deutsche Windows schreibt
  `ABHÖREN`, nicht `LISTEN`, und `grep` braucht `-a` - dann `taskkill //PID <n> //F`. Nie breit auf
  `python3.exe`.
* ⛔ **Ein abgebrochener Brücken-Aufruf beendet den Lauf NICHT** (60-s-Deckel). Vor dem Neustart
  `ps` lesen, sonst laufen zwei Läufe auf dieselben Dateien.
