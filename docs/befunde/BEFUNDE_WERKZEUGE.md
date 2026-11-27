# BEFUNDE — Werkzeuge, Wächter und Aufräumen (erhoben 2026-09-10)

> ⚠️ **ERHOBEN OHNE MESSUNG, NACHGEMESSEN AM SELBEN TAG.** Die Linux-Shell konnte den Projektordner
> nicht mounten („no Plan9 drive shares", auch nach Neustart der Desktop-App). Die Analyse unten
> stützte sich deshalb zunächst nur auf den Inhalt der Dateien.
> ✅ **NACHGEHOLT am 10.09. auf dem Windows-Rechner** (Git Bash, Ausgabe nach `_to_delete/`):
> voller `check.sh` **173 s**, ALLES GRÜN, und die Zeitmessung aus Abschnitt 1 — **Ergebnis dort.**
> ⛔⛔ **UND DIE MESSUNG HAT DEN VORSCHLAG AUS ABSCHNITT 1 WIDERLEGT.** Genau dafür war sie da.
> ►► **DIE LEHRE DES TAGES: eine Schätzung, die plausibel klingt, ist der teuerste Zustand** — sie
> liest sich wie ein Befund und trägt keinen. Der Vorschlag „acht Ladevorgänge derselben 2,4-MB-
> Datei" war richtig gezählt und trotzdem folgenlos, weil die Zahl daneben fehlte.

---

## 1. ZEIT: `check.sh` startet 39-mal Node und 16-mal Python

**Gezählt:** 39 `node`-Aufrufe, 16 `python3`-Aufrufe in `check.sh`. Davon entfallen **sieben auf
`tools/pool_query.js`** — jeweils ein eigener Prozess, der `fragen.js` (**2,4 MB**) neu lädt und
parst:

| Wächter | Aufruf |
|---|---|
| 4e3 Firmen-Eigennamen | `pool_query.js firmen` |
| 4e4 Gesetzeszitate | `pool_query.js zitate` |
| 4e5 Zufallsaufgaben | `pool_query.js zufall` |
| 4e6 Fachbegriffe | `pool_query.js begriffe` |
| 4e7 Abdeckung | `pool_query.js abdeckung` |
| 4e8 Lösungswort im Text | `pool_query.js verrat` |
| 4e9 Grafiken (A/C/D) | `pool_query.js svg` |

Dazu `idcheck` an anderer Stelle. **Acht Ladevorgänge derselben 2,4-MB-Datei in einem Lauf.**

►► **Vorschlag war:** ein Sammelmodus `pool_query.js check`, der die sieben Prüfungen in EINEM
Prozess fährt. ⛔⛔ **GEMESSEN AM 10.09. UND VERWORFEN — NICHT ERNEUT VORSCHLAGEN.**

| Messung | Wert |
|---|---:|
| voller `check.sh` (Windows, Git Bash) | 173 s |
| reiner Ladevorgang `fragen.js` (`node -e 'require("./fragen.js")'`) | **0,180 s** |
| die sieben Aufrufe einzeln | 0,218–0,350 s |
| die sieben zusammen | **1,746 s = 1,0 % des Laufs** |

**Der Ladeanteil ist real** — rund drei Viertel jedes Aufrufs sind das Laden der Datei. **Nur ist
der ganze Posten zu klein**, um den Umbau zu tragen: Ersparnis rund **eine Sekunde**, Preis sieben
neu verdrahtete Wächter plus sieben Sabotageläufe.
►► **DIE LEHRE: ein Anteil ist kein Betrag.** „Acht Ladevorgänge derselben 2,4-MB-Datei" beschreibt
eine echte Verschwendung und beziffert sie nicht — **die Frage ist nie „wird verschwendet?",
sondern „wie viel, gemessen am Ganzen?"** Dieselbe Klasse wie „immer den Zähler lesen, nicht die
Quote" (Abschnitt 6 in START_PROMPT).

---

## 2. WÄCHTER: sieben folgen demselben Muster

Die Blöcke **4e3 bis 4e9** (Zeilen ~424–640, rund **250 Zeilen**) sind strukturgleich:

```
AUSGABE="$(node tools/pool_query.js <name> 2>/dev/null)"
SUMME="$(printf '%s' "$AUSGABE" | grep -oE '<muster>' | head -1)"
if [ -z "$SUMME" ];  then melde "<Werkzeug pruefen>"
elif [ "$SUMME" -gt 0 ]; then melde "<Befund> - '<Werkzeugaufruf>'"
else ok "<Zusammenfassung>"
fi
```

►► **Vorschlag:** eine Funktion `pool_waechter <name> <muster> <fehlertext> <oktext>` plus eine
Tabelle der sieben Einträge. Das spart keine Laufzeit, aber **rund 200 Zeilen** und macht den
achten Wächter zu einer Tabellenzeile statt zu 35 kopierten Zeilen.
⚠️ **Der Preis:** die ausführlichen Begründungskommentare je Wächter (warum es ihn gibt, welcher
Befund ihn ausgelöst hat) dürfen NICHT mitverschwinden — sie sind der Grund, warum niemand einen
Wächter versehentlich entfernt. Sie gehören über die Tabelle, nicht in sie.

**Die vier Stand-Guards** (4e Versions-Gleichklang, 4e2 Stand-Zeile, 4e2b Auslieferungs-Zeile,
4e2b2 Ungepusht) prüfen alle dieselbe Klasse: **stimmt die Doku mit dem Code überein.** Sie
könnten unter einer Überschrift stehen — aber ihre Logik ist verschieden genug, dass eine
Zusammenfassung nur die Lesbarkeit verbessert, nicht die Wartbarkeit.

---

## 3. ✅ ERLEDIGT 10.09.: `verify.sh` WAR EINE FALLE — DIE LEHRE VOM 28.07. GALT DORT NICHT

> **Nach `_to_delete/` verschoben (W1 Etappe B).** Vorher gemessen: `grep -rn` findet **keinen
> Aufruf**, nur Erwähnungen. Vier aktive Dokumente nachgezogen (README, PROMPT_IDEEN-PAKET,
> PLAENE, dieses hier); die Fundstellen in den `*_ARCHIV.md` **bleiben unangetastet** — ein
> Archiv ist Chronik, und dort war der Satz richtig, als er geschrieben wurde.

`tools/work_dateien.sh` wurde am 28.07.2026 angelegt, weil die Kopierliste für das flache
Testverzeichnis **zweimal** existierte (in `check.sh` und in `tools/suite.sh`) und auseinanderlief.
Der Kommentar dort lautet: „**EIN KOMMENTAR ERZWINGT NICHTS. Deshalb jetzt eine Quelle, die beide
SOURCEN.**"

⛔ **`verify.sh` ist die DRITTE Stelle — und sie wurde nie angeschlossen.** Gemessen am Inhalt:
`grep -c work_dateien verify.sh` = **0**. Es baut sein Verzeichnis in Zeile 61–63 nach eigener
Liste: die Module, `styles.css`, `app.html`, `tests/*.js`. **Es fehlen** `index.html`,
`manifest.webmanifest`, `sw.js`, die fünf Icons/Screenshots, `laengen_ausnahmen.json` und
`tools/entkommentiere.js` — also genau das, was `test_pwa`, `test_didaktik` und
`test_entkommentiere` brauchen.

⚠️ **Und seine Begründung ist verfallen:** der Kopf verweist durchgehend auf das „45-s-Tool-Limit"
und darauf, Suiten einzeln aufzurufen. `tools/prueflauf.sh` hält seit dem 07.09. fest, dass es
dieses Limit nicht mehr gibt (voller Lauf 45 s in EINEM Aufruf, Rahmen 180 s).

►► **Vorschlag:** `verify.sh` nach `_to_delete/` verschieben. Wer heute Suiten fahren will, nimmt
`tools/suite.sh`; wer den vollen Lauf will, `tools/prueflauf.sh`. **Ein totes Werkzeug, das bei
Benutzung ein unvollständiges Verzeichnis baut, ist schlimmer als keines** — es liefert rote
Suiten bei gesundem Code, wie am 26.07. schon einmal (35 rote Suiten mit „ENOENT app.html").

---

## 4. ✅ ERLEDIGT 10.09.: `push.sh` LAG IM REPO, OBWOHL DIE DOKU VOR IHM WARNTE

> **Nach `_to_delete/` verschoben (W1 Etappe B).**
> ⛔⛔ **UND DIE WARNUNG WAR NICHT ÜBERALL ANGEKOMMEN:** `docs/plaene/UNTERRICHT_PROJEKT.md` Zeile 144 wies
> ausdrücklich an, `bash push.sh „…“` zu fahren — seit dem 28.07. gegen START_PROMPT und DEPLOY.
> **Eine Datei, die es nicht gibt, schützt besser als eine Warnung, die man erst lesen muss.**

`START_PROMPT.md` Arbeitsregel 2: „**`push.sh` NICHT benutzen** (legt `.git_broken_old` an)."
Die Datei liegt weiter im Wurzelordner (3,3 KB) und heißt, wie das, was man tun will.

►► **Vorschlag:** nach `_to_delete/`. Der Weg über den Windows-Rechner ist etabliert; eine
Warnung in einer Datei, die man erst lesen muss, schützt schlechter als eine Datei, die es nicht
gibt. **Dieselbe Klasse wie Punkt 3.**

---

## 5. ✅ ERLEDIGT 10.09. — ABER NUR ZEHN VON DREIZEHN

> **Verschoben nach `tools/archiv/`: zehn Skripte, rund 237 KB.**
> ⛔⛔ **DREI SIND GEBLIEBEN, UND DAS IST EIN BEFUND GEGEN DIESE LISTE:** `validate_batch.js`,
> `fakten_check.py` und `index.js` stehen im **aktiven** Prüfprotokoll bzw. erzeugen
> `FUNCTIONS.md`.
> ►► **Die Liste unten war aus GRÖSSE und ÄNDERUNGSDATUM gebaut, nicht aus Referenzen.** „Lange
> nicht geändert“ heißt nicht „wird nicht gebraucht“ — ein Werkzeug, das seine Aufgabe erfüllt,
> ändert sich nicht mehr. Aufgefallen ist es beim `grep` gegen die Doku, nicht beim Zählen.
> ⚠️ **Offen für Etappe D:** ob `validate_batch.js` durch `apply_batch.py` abgelöst ist — nicht
> gemessen.

| Datei | Größe | zuletzt geändert |
|---|---:|---|
| `r3_5_matrix.py` | 67 KB | 2026-07-22 |
| `r3_wirtschaft_neu.py` | 49 KB | 2026-07-21 |
| `begriffe_r2a.py` | 40 KB | 2026-07-21 |
| `r3_2_gantt.py` | 30 KB | 2026-07-22 |
| `r3_4_liniensysteme.py` | 22 KB | 2026-07-21 |
| `probe_m01.js` | 9 KB | 2026-07-21 |
| `kalibriere_r2a.py` | 8 KB | 2026-07-21 |
| `validate_batch.js` | 8 KB | 2026-07-21 |
| `make_screenshots.py` | 7 KB | 2026-07-18 |
| `t2_build.js` | 5 KB | 2026-07-14 |
| `diff_render.js` | 4 KB | 2026-07-14 |
| `fakten_check.py` | 4 KB | 2026-07-19 |
| `index.js` | 2 KB | 2026-07-14 |

►► **Vorschlag:** nach `tools/archiv/` verschieben (nicht löschen — sie dokumentieren, wie die
Etappen gebaut wurden). `tools/` enthält dann nur, was noch benutzt wird, und die Liste in
START_PROMPT Abschnitt 8 deckt sich wieder mit dem Verzeichnis.
⚠️ **Vor dem Verschieben prüfen:** `grep -rn "<dateiname>" check.sh tests/ tools/*.sh` — ein
Skript, das irgendwo gesourct wird, bleibt.

---

## 6. ✅ ERLEDIGT 10.09.: `PLAENE.md` WAR MIT 183 KB / 2277 ZEILEN DER GRÖSSTE AKTIVE BROCKEN

> **Rotiert am 10.09.: 2374 → 2054 Zeilen, 333 verbatim ins Archiv, Gegenprobe 0 Verluste.**
> `PLAENE_ARCHIV.md` 11 KB → 37 KB. Ebenso `BUILD_LOG.md` 976 → 51 Zeilen (924 ins Archiv).

`PLAENE_ARCHIV.md` hat dagegen nur 11 KB — die Rotation hat dort praktisch nie stattgefunden.
Rotationsreif und **eindeutig als erledigt markiert**:

| Block | Zeilen | Umfang | Marker |
|---|---|---:|---|
| Gesamtplan Runde Q3 | 20–316 | 297 | „**KOMPLETT DURCH 2026-09-07**" |
| Datengrundlage Stufe-3/4-Lücken | 696–731 | 36 | „**ERLEDIGT 2026-09-08**" |

►► **Spezifikation liegt bereit:** `tools/rotationen/plaene_2026-09-10.json` — 333 Zeilen ins
Archiv, 12 Zeilen Ersatz mit Verweis. Fahren mit
`python3 tools/rotiere.py tools/rotationen/plaene_2026-09-10.json` (erst Trockenlauf: die
Gegenprobe muss **0** melden).
⚠️ **Q1 und Q2 bleiben stehen** — START_PROMPT führt sie ausdrücklich „als Verfahrens-Vorlage".

---

## 7. KLEINERE FUNDE

* **`sollwerte.env`, Kopfzeile:** „entspricht TASKLIST Abschnitt 2". **Eine zweite Sollwert-Liste
  gibt es dort nicht mehr** (`grep -n "sollwerte" TASKLIST.md` findet nur einen Verweis auf die
  Datei selbst). Der Satz behauptet eine Drift-Quelle, die es nicht gibt — streichen oder auf
  „Single Source, TASKLIST verweist hierher" ändern.
* **45 Sollwerte, 45 Suiten** — die Zahlen decken sich. Kein Befund.
* **`.assetsignore` ist dicht:** `etappe5_a4_ausbau.html`, `Aufstellung_*.xlsx`, `ci_log.txt`,
  `.svgpruefung/`, `_to_delete/` und `backup_*.zip` sind über `.gitignore` gar nicht erst im Repo.
  ⚠️ **Als Verdacht notiert und beim Nachlesen entkräftet** — die Muster `*.xlsx` und
  `backup_*.zip` greifen. **Kein Auslieferungs-Befund.**
* **`__pycache__/`** liegt im Wurzelordner UND in `tools/` — beide über `.gitignore` gedeckt.

---

## 8. ORGANISATION FÜR NEUE CHATS — WAS GUT LÄUFT

* **Der Chat-Start ist auf drei Befehle eingedampft** und ausdrücklich als EIN Aufruf beschrieben.
* **START_PROMPT hält 599 von 600 Zeilen** und trägt in Abschnitt 3 eine Liste „diese sechs sind
  gemessen — nicht wiederholen". Das ist das wirksamste Mittel gegen doppelte Arbeit.
* **Die Standzeile wird von `check.sh` gegen den Code geprüft** — eine falsche Zahl im Kopf ist
  seit dem 30.07. nicht mehr möglich.
* **Werkzeuge tragen ihre Begründung im Kopf**, nicht nur ihre Bedienung.

### Was fehlte — ✅ beides erledigt am 10.09. (W1 Etappe D)

> **Einstiegspunkt:** `README.md` ist aufgefrischt (acht Gebiete, Wächter, Deployment, „wo steht
> was"), `ARCHITECTURE.md` an den Zahlen — und mit einer Marke, was daran NICHT nachgemessen ist.
> **Index:** `docs/befunde/BEFUNDE_INDEX.md`, erzeugt aus `tools/befunde_index.py`, 145 von 147 B-Nummern.

* **Kein Einstiegspunkt für „was ist dieses Projekt".** `README.md` (7 KB, zuletzt 2026-07-14)
  und `ARCHITECTURE.md` (10 KB, 2026-07-16) sind zwei Monate alt und kennen weder die Gebiete
  A1–B3 noch die Wächter-Landschaft. Ein neuer Chat liest START_PROMPT und ist informiert — ein
  **Mensch**, der das Projekt zum ersten Mal sieht, hat keinen Text, der bei null anfängt.
* **Die Befunde-Dateien sind ohne Index.** Es gibt neun `BEFUNDE_*.md` mit zusammen ~270 KB.
  START_PROMPT Abschnitt 7 listet sie, aber ohne die B-Nummern, unter denen sie zitiert werden
  (B90, B106, B127, B136–B147 …). Wer „B127" sucht, sucht in neun Dateien.

---

## 9. NACHTRAG 10.09.: ZWEI WERKZEUGE WAREN NICHT PLATTFORMNEUTRAL

### 9a `build_fragen.py` schrieb auf Windows CRLF — behoben

Der erste `check.sh`-Lauf auf dem Windows-Rechner meldete **zwei FEHLER** (`fragen.js` und
`faelle.js` weichen vom pool-Build ab). Beide waren Fehlalarm: der Neubau aus dem heutigen Pool ist
byte-identisch mit dem Arbeitsbaum. Ursache war `io.open(..., "w", encoding="utf-8")` **ohne
`newline=`** — Python übersetzt `\n` dann auf die Plattform-Konvention.

| Builder | CR | Bytes | byte-identisch |
|---|---:|---:|---|
| aus `HEAD` | 39 204 | 2 478 633 | nein |
| mit `newline="\n"` | 0 | 2 439 429 | ja |

⛔⛔ **Die Gefahr war nicht der Fehlalarm, sondern der naheliegende „Fix":** wer auf die Meldung hin
`build_fragen.py` auf dem Windows-Rechner nachfährt, schreibt 2,4 MB CRLF in eine **ausgelieferte**
Datei. **Ein roter Wächter ist eine Frage, keine Antwort.**
✅ Behoben, Begründung im Modulkopf. Danach `check.sh`: ALLES GRÜN, RC=0.
⚠️ **Offen als Klasse:** `build_fragen.py` war nicht das einzige Werkzeug, das nie auf Windows
lief. Wer dort das nächste Python-Werkzeug fährt, das eine Datei SCHREIBT, prüft zuerst `newline=`.
Kandidaten aus Abschnitt 8 der START_PROMPT-Werkzeugliste: `verweis_setzen.py`, `opt_ersatz.py`,
`schluessel_setzen.py`, `firmen_umlaut_setzen.py`, `rotiere.py`. **Nicht geprüft — gemessen ist
bisher nur `build_fragen.py`.**
✅ **Seit 9c ist der Schaden gedeckelt, nicht die Ursache:** `* text=auto eol=lf` sorgt dafür, dass
ein CRLF-Erzeugnis beim Commit wieder auf LF normalisiert wird. **Der Drift-Guard meldet trotzdem
rot**, solange der Arbeitsbaum die CRLF-Fassung trägt — der Guard vergleicht Dateien, nicht den
Index. **Ein `newline=` fehlt weiterhin überall dort oben.**

### 9c `.gitattributes` schützte die Zeilenenden gar nicht — behoben

Beim `add` des W1-Commits warnte Git **neunmal**: „LF will be replaced by CRLF the next time Git
touches it". Gemessen: `core.autocrlf` = **`true`**, `text`/`eol` für `fragen.js` **unspecified**,
und `git ls-files --eol` zeigt **282 `i/lf`** gegen **6 `i/-text`** (5 PNG, 1 `.pyc`).

⛔⛔ **Der Arbeitsbaum lag nur deshalb auf LF, weil die Dateien dort GESCHRIEBEN und nie
AUSGECHECKT wurden.** Der erste Clone hätte zwei Schäden erzeugt, und der zweite ist der größere:

| | Schaden |
|---|---|
| 1 | `fragen.js` mit 2,4 MB CRLF **in der Auslieferung**, Drift-Guard dauerhaft rot |
| 2 | **die 13 `*.sh` tot** — Git Bash bricht bei CRLF mit `$'\r': command not found` ab. Kein `check.sh`, kein `suite.sh`, kein `prueflauf.sh`. **Nach einem Clone läuft kein Prüfwerkzeug mehr.** |

✅ **Behoben:** `* text=auto eol=lf`. **Null-Diff VOR dem Commit belegt** — `git add --renormalize .`
zog 0 weitere Dateien mit.
►► **DIE LEHRE: die Warnung stand da.** Neun Zeilen, mitten in der Ausgabe eines *erfolgreichen*
Kommandos. **Eine Warnung neben einem grünen Ergebnis wird gelesen wie Dekoration.**
⚠️ **Nebenbefund für Etappe B:** `__pycache__/mig_g26.cpython-310.pyc` ist getrackt, obwohl
`.gitignore` `__pycache__` abdeckt — vor der Regel committet, nicht ausgeliefert. `git rm --cached`.

### 9b `rotiere.py`: zwei kosmetische Befunde, beide beim ersten echten Gebrauch

* **`ersatz` verliert seine abschließende Leerzeile.** Die Zeile 62 schneidet mit
  `.rstrip("\n")` ab; steht danach eine `##`-Überschrift, klebt sie am Text und Markdown setzt sie
  nicht mehr als Überschrift. **Zweimal passiert (PLAENE, beide Blöcke), von Hand nachgetragen.**
* **Ein ersatzlos entfallender Block lässt die Leerzeilen davor UND dahinter stehen** — im
  BUILD_LOG eine doppelte Leerzeile im Kopf.
⚠️ **Beides ist harmlos und beides fällt nur auf, wenn jemand hinsieht** — die eingebaute
Gegenprobe prüft Zeilen-VERLUST, nicht Zeilen-ZUSAMMENHANG. **Sie hat getan, wofür sie gebaut ist.**

## 10. NACHTRAG 10.09. (2): `befunde_index.py` hat beim ZWEITEN Lauf seine eigene Ausgabe gelesen

### B151 — ein Werkzeug, das schreibt, ist erst nach dem ZWEITEN Lauf geprüft
**Fehlerklasse: die Ausgabe wird zur Quelle** — verwandt mit „ein Nachbau misst, was man sich
dabei denkt", aber schärfer: hier misst das Werkzeug **sich selbst**.

`dateien = sorted(glob.glob("BEFUNDE_*.md"))` nimmt seit dem ersten `--setze` auch
`docs/befunde/BEFUNDE_INDEX.md` mit. **Der erste Lauf konnte das nicht zeigen** — da gab es die Datei noch
nicht. Der zweite Lauf las 9 statt 8 Dateien, und jede Tabellenzeile des Index (`| B90 | … |`)
ist selbst eine gültige Fundstelle nach Form B.

| | erster Lauf (10.09.) | zweiter Lauf | nach der Korrektur |
|---|---:|---:|---:|
| gelesene Dateien | 8 | **9** | 8 |
| „Mehrfach in verschiedenen Dateien" | 0 | **145** | 0 |
| Zeilen in `docs/befunde/BEFUNDE_INDEX.md` | 171 | **315** | 173 |

⛔⛔ **UND DIE GEGENPROBE BLIEB DABEI GRÜN.** Sie fragte `soll in ist` — „ist die erwartete Datei
**dabei**". Als plötzlich jede Nummer zwei Fundstellen hatte, war die erwartete immer noch dabei.
**Ein Wächter, der nur nach Anwesenheit fragt, sieht das Dazukommen nicht.**

**Behoben, drei Griffe:**

1. Die Ausgabe ist aus der Quellliste ausgeschlossen — plus eine **Zusicherung im Code** (nicht im
   Kommentar), die abbricht, falls sie je wieder hineingerät.
2. Die Gegenprobe vergleicht die Fundstellen-Menge **exakt** (`ist == [soll]`). Alle zehn bekannten
   Fälle sind per Definition in genau einer Datei. ⚠️ Wer eine Nummer einträgt, die wirklich in
   zwei Dateien steht, ändert die Zusicherung **mit ihr** — nicht weicht sie auf.
3. Die Erfolgsmeldung zählte `len(zeilen) + 1` und war um eine Zeile zu hoch. Klein — aber ein
   Werkzeug, das seine eigene Ausgabe falsch zählt, wird beim nächsten Vergleich geglaubt.

**Gegenproben (beide Richtungen, Lehre aus D1):**

* **Verschärfung erzeugt keine Fehlalarme:** alle zehn bekannten Fälle bleiben grün.
* **Verschärfung greift:** wird die Ausgabe absichtlich wieder in die Quellliste gelegt, gehen
  **10 von 10** Gegenproben ROT — der Fehler wäre beim ersten Lauf gemeldet worden.
* **Idempotenz:** zwei aufeinanderfolgende `--setze`-Läufe liefern eine **bitgleiche** Datei
  (md5 identisch) und wortgleiche Ausgabe. **Genau das war vorher nicht der Fall.**

►►► **DIE REGEL, DIE DARAUS FOLGT: ein Werkzeug, das in den Ordner schreibt, den es liest, wird
ZWEIMAL gefahren, bevor man ihm glaubt.** Der erste Lauf misst eine Welt ohne seine Ausgabe.

## 11. W1 ETAPPE E (10.09.2026): der Umbau wurde gemessen und verworfen — die Zusicherung blieb

### Warum E1 gestrichen ist — nachgerechnet, nicht abgewogen

Der Plan wollte die sieben Pool-Wächter (4e3 firmen · 4e4 zitate · 4e5 zufall · 4e6 begriffe ·
4e7 abdeckung · 4e8 verrat · 4e9 svg) hinter **eine** Funktion
`pool_waechter <kommando> <muster> <fehlertext> <oktext>` legen. Gemessen am Block:
**220 Zeilen, davon 114 Code und 99 Kommentar** (die bleiben, E2), 18 `sed`-Extraktionen,
20 `melde`, 9 `ok`.

| Wächter | Zahlen | Meldezweige | passt die Signatur? |
|---|---:|---:|---|
| 4e5 zufall · 4e6 begriffe · 4e7 abdeckung | 1–3 | 1 | ✅ |
| 4e3 firmen | 3 | 1 (zwei Zahlen in **einer** Meldung) | teilweise |
| 4e4 zitate | 5 | **4**, jeder mit eigenem Text | ❌ |
| 4e8 verrat | 1 | HINWEIS statt FEHLER | ❌ |
| 4e9 svg | 4 | **3 FEHLER + 1 Hinweis** | ❌ |

**Ersparnis rund 20 von 114 Codezeilen**, Preis: zwei Arten einen Wächter zu schreiben, plus
sieben Sabotageläufe an einem Umbau, der im Fehlerfall wie ein grüner Lauf aussieht.
⛔ **Dieselbe Rechnung, an der der Plan selbst F1 gestrichen hat** (1 % Laufzeit) — nur mit
Zeilen statt Sekunden. **Nutzer-Entscheid 10.09.: E1 und E4 gestrichen. Nicht erneut vorschlagen.**

►►► **Die Signatur war entworfen worden, ohne die sieben Wächter zu lesen.** Dieselbe Klasse wie
die Aufräumliste aus Etappe B, die aus Größe und Änderungsdatum gebaut war statt aus Referenzen.

### Und E3 ließ sich mit dem genannten Werkzeug gar nicht ausführen
`tools/sabotage.sh` fährt **`tools/suite.sh <name>`** — die sieben Pool-Wächter sind aber
**keine Suiten**, das steht sogar in START_PROMPT Abschnitt 1. **Der Plan nannte ein Werkzeug für
einen Fall, den es nicht kann.** Mit dem Wegfall von E1 wurde der Punkt gegenstandslos; die
Gegenproben liefen stattdessen gegen die neue Zusicherung, nach derselben Disziplin
(Muster genau einmal · Wiederherstellung zugesichert · rot ist der Erfolg).

### B152 — 4e8 meldete grün über ein Werkzeug, das gar nichts gesagt hatte
**Fehlerklasse: grün über Ungeprüftes** (die vierte Wiederholung dieser Klasse im Projekt).

Sechs der sieben Wächter haben einen Zweig für „Werkzeug stumm". **4e8 hatte ihn nicht** — als
einziger, weil er ein HINWEIS-Wächter ist und beim Bauen keiner Vorlage folgte:

```
if [ -n "$VR_N" ] && [ "$VR_N" -gt 0 ]; then  ... hinweis ...
else ok "Loesungswort im Aufgabentext (${VR_N:-0} dropdown-Luecken)"
```

Liefert `pool_query.js verrat` nichts Auswertbares — abgestürzt, umbenannt, Ausgabeformat
geändert —, bleibt `$VR_N` leer, die Bedingung ist falsch, und der Lauf meldet
**`[ok] Loesungswort im Aufgabentext (0 dropdown-Luecken)`**. Grün, **mit einer Zahl, die nie
gemessen wurde.** ►► **An den Originalzeilen aus `check.sh` nachgewiesen**, nicht an einem
Nachbau: Block herausgeschnitten, einzig der Werkzeugaufruf durch eine leere Ausgabe ersetzt.
Behoben; der Stumm-Zweig meldet jetzt FEHLER. ⚠️ **Ein stummes Werkzeug ist auch dann ein Fehler,
wenn der Befund selbst nur ein Hinweis ist: der Hinweis ist verhandelbar, seine Messung nicht.**

### Der Ersatz für E1: `tools/waechter_zusicherung.py` (check.sh 4e10)

Nicht die gleiche **Form**, sondern die gleichen **Zusicherungen**. Sie liest `check.sh` und
verlangt von jedem Wächter 4e3–4e9 zwei Zweige: **Werkzeug-stumm** und **ok**. Fehlt der erste,
läuft eine leere Ausgabe in den Erfolgsfall; fehlt der zweite, ist eine bestandene Prüfung von
einer übersprungenen nicht zu unterscheiden. ⛔ **Keine Ausnahmeliste** — sonst wäre die
Zusicherung verhandelbar. **Ihr Selbsttest läuft in `check.sh` mit**: eine Gegenprobe braucht
selbst eine Zusicherung, dass sie stattgefunden hat.

### B153 — der Meldezweig der neuen Zusicherung sagte im Fehlerfall „Binary file matches"
**Fehlerklasse: ein Meldezweig, der erst im Fehlerfall benutzt wird, ist erst dann geprüft.**

Die Sabotage machte 4e5 rot — und die Meldung lautete
`Waechter-Zusicherung: 1 von 7 ... fehlt ein Zweig - Binary file (standard input) matches`.
Ursache: `check.sh` suchte mit `grep FEHLT` im Fließtext, und der trägt Wächtertitel mit
Gedankenstrichen; auf der cp1252-Konsole hielt `grep` die Ausgabe für binär. **Das ist genau der
Fall, vor dem START_PROMPT Abschnitt 6 warnt** („bei 'binary file matches' NIE weiterarbeiten").
Behoben zweifach: das Werkzeug erzwingt UTF-8 auf stdout **und** druckt eine maschinenlesbare
ASCII-Zeile `LUECKEN: 4e5`, die `check.sh` mit `awk` liest. Danach lautet die Meldung
`1 von 7 Pool-Waechtern fehlt ein Zweig (4e5)`.
►► **Ohne die Gegenprobe wäre der Fehler erst an dem Tag aufgefallen, an dem er gebraucht wird.**

### B154 — Backslashes verlieren eine Ebene (KORRIGIERTE URSACHE, 10.09. nachgemessen)
Beim Einsetzen von 4e10 stand in der Auswertung eine `sed`-Ersetzung mit den Rückverweisen
`\1 \2`. Auf dem Weg durch die Brücke zum Windows-Rechner wurde daraus je ein einzelner
Backslash, Python las ihn als Oktal-Escape, und in `check.sh` landeten **zwei unsichtbare
Steuerzeichen** statt der Rückverweise. Der Ausdruck lieferte Müll, syntaktisch fehlerfrei.
**Gefunden, weil die geschriebene Zeile nachgelesen wurde** — der Lauf hätte nur „keine
auswertbare Zahl" gemeldet und die Ursache verschwiegen.
►► **Ausdrücke ohne Backslash sind hier nicht Geschmack, sondern Vorsicht: `awk` statt `sed`
mit Rückverweisen** — und **nach jedem Schreiben nachsehen, was drinsteht** (dieselbe Regel wie
nach dem 0-Byte-Unfall vom 24.08.).

⚠️⚠️ **URSACHE KORRIGIERT AM SELBEN TAG — der erste Eintrag hat sie falsch benannt.** „Die
Brücke frisst eine Ebene" war eine plausible Vermutung, keine Messung. Nachgemessen sind es
**zwei Schichten hintereinander**: der Befehlstext verliert beim **Kodieren des Werkzeugaufrufs**
eine Ebene (aus zwei Backslashes wird einer), und **Python frisst die zweite in nicht-rohen
Stringliteralen** (ein Backslash gefolgt von einer 1 ist dort das Steuerzeichen chr(1), nicht
Backslash-Eins). Deshalb ueberlebte Backslash-Klammer-auf als
gültiges `sed`-Muster, während die Rückverweise zu unsichtbaren Steuerzeichen wurden — ein Bild,
das die Ein-Ebenen-Erklärung gar nicht hergibt.
►► **Die Gegenmittel bleiben dieselben** (kein Backslash, oder rohe Strings), **die Begründung
nicht.** Eine Regel mit falscher Begründung hält genau so lange, bis jemand sie nachrechnet.

### B155 — der Befehlskanal schneidet bei rund 8 KB ab, ohne es zu sagen
**Fehlerklasse: eine Grenze, die schweigt.** Beim Schreiben von `aufbereiten_buch.py`
(rund 9,5 KB) landete die Datei **mitten im Wort** auf der Platte: `schreibe("outline.json", outlin`.
Der Rückgabewert war 0, gemeldet wurde nur eine Bash-Warnung über ein unbeendetes Here-Dokument.
►► **Dateien über ~5 KB in Häppchen schreiben und danach nachlesen, was drinsteht.** Für Dateien
im Training-Ordner ist der Dateikanal (`device_commit_files`) der sichere Weg; außerhalb, wie im
Buch-Ordner, hilft nur Anhängen in Stücken.

### B156 — `rotiere.py` war auf dem Rechner des Nutzers gar nicht ausführbar
**Fehlerklasse: ein Werkzeug ist auf der Umgebung geprüft, auf der es lief — nicht auf der, für
die es gedacht war.**

`rotiere.py` sichert vor dem Schreiben nach `/tmp`. Unter **Windows-Python gibt es das nicht**:
`shutil.copy` scheitert mit `FileNotFoundError` auf `/tmp` + Backslash + Dateiname — **nach** der
bestandenen Gegenprobe und **vor** dem Schreiben. ⚠️ **Verloren ging nichts** (die Reihenfolge
Sicherung-dann-Schreiben hat gehalten), aber die Rotation war dort schlicht nicht möglich.

►► **Aufgefallen erst, als das Werkzeug zum ersten Mal auf dem Windows-Rechner lief.** Die drei
Rotationen desselben Vormittags liefen in der Cloud-Sandbox — dort ist `/tmp` selbstverständlich.
**Ein Werkzeug, das für den Rechner des Nutzers gebaut wurde, war neun Tage lang nur in der
Sandbox erprobt.** Behoben mit `tempfile.gettempdir()`; die vierte Rotation lief danach durch
(603 → 600 Zeilen, Gegenprobe 0 Verluste).

⚠️ **Verwandt mit B154/B155:** alle drei sind Umgebungsannahmen, und alle drei sind erst
aufgefallen, als jemand die Umgebung gewechselt hat. **Seit die Läufe auf dem Windows-Rechner
stattfinden, fällt diese Klasse reihenweise an** — das ist kein Zufall, sondern der Preis dafür,
dass vorher alles in einer einzigen Umgebung lief.

## 12. DAS NETZ VOR DEM UMBAU (10.09.2026): `tools/schnappschuss.js`

**Entscheid:** Weg B — Darstellungsschicht neu, Architektur bleibt. **Kein React, kein Bundler.**
Begründung in einer Zahl: **41 der 45 Suiten sind DOM-gebunden** (1567 Tests, **380 KB Testcode**),
nur 4 sind reine Logik (2383 Tests, 32 KB). Ein Framework-Wechsel wirft das Netz genau in dem
Moment weg, in dem es gebraucht wird. ⛔ **React hebt die Design-Obergrenze nicht** — dasselbe
Bild ist in CSS plus etwas Markup erreichbar; React kauft Verhalten und Codeform, nicht Aussehen.

### Was die 45 Suiten NICHT sehen
Sie prüfen **Verhalten**: bucht der Knopf, wird richtig bewertet. **Ein Element, das beim Umbauen
still verschwindet, fällt keiner von ihnen auf** — dem Lerner sofort. Genau diese Lücke schließt
der Schnappschuss: er friert die **Struktur** ein (Tag, Klassen, ids, ARIA, Textlängenklasse) für
**19 Screens, 2844 Elemente**.

⛔ **Er prüft kein Aussehen.** Abstände, Farben, Größen sieht er nicht. Dafür ist der Bildvergleich
da — und der ist **bewusst kein Wächter**: eine Referenz, die man bei jeder gewollten Änderung
überschreibt, ist nach drei Runden keine Prüfung mehr, sondern eine Gewohnheit.

### Zwei Vorkehrungen gegen das Würfeln
1. `Math.random` wird geseedet (derselbe PRNG wie `probe_lernfluss.js`).
2. **Die Fragetypen werden über FESTE IDs gezeigt**, nicht über die Ziehung. Sonst wäre jede neue
   Pool-Frage ein Fehlalarm — das Netz hätte angeschlagen, wenn jemand *Inhalte ergänzt*, und nie
   beim Umbau. ⚠️ Textinhalt wird nicht gespeichert, nur seine **Längenklasse**: eine korrigierte
   Formulierung darf nicht auslösen, ein verschwundener Absatz schon.

### Gegenprobe, beide Richtungen
* **Kein Flackern:** zwei Läufe hintereinander bitgleich (19 / 2844).
* **Sabotage greift:** ein aus `SEITEN` entfernter Navigationspunkt schlägt auf **allen 19 Screens**
  an und nennt auf dem Gantt-Screen das verlorene Element beim Namen: `button.aktiv.nav-item`.
* **Wiederherstellung ohne Umweg:** `git show HEAD:app_ui.js > app_ui.js`, von `git` bestätigt.

### B157 — die Verbindung kann mitten in einer Sabotage abreißen
Genau das ist passiert: der Aufruf mit Sabotage **und** Messung **und** Wiederherstellung in einer
Kette wurde von einem Verbindungsabbruch unterbrochen. ⚠️ **Gutgegangen** — der `trap` hatte
zurückgespielt, und `git status` hat es bestätigt, nicht meine Annahme.
►►► **Aber die Lehre gilt trotzdem: eine Wiederherstellung, die an derselben Verbindung hängt wie
die Sabotage, ist keine Zusicherung.** Seither: Sabotage und Messung kurz halten, und
zurückgeholt wird aus `git`, nicht aus `/tmp` — das überlebt jeden Abbruch.
⚠️ Dieselbe Familie wie B154–B156: **jede dieser Grenzen fiel erst auf, als die Umgebung wechselte.**

### B158 — meine eigene Erfolgsmeldung brach mitten entzwei
`grep -oE` traf **zweimal** (die Ausgabe nennt die Zahl zweimal), die Meldung lief über zwei
Zeilen und endete ohne schließende Klammer: `[ok] DOM-Schnappschuss (19 Screens, 2844 Elemente`.
Gefunden, weil die Zeile nachgelesen wurde — `check.sh` war grün. ►► `head -1`.
**Dieselbe Klasse wie B153: ein Meldezweig ist erst geprüft, wenn jemand ihn liest.**


---

## 12b. Die Abstands- und Radien-Skala (`tools/css_skala.py`, 10.09.2026)

**Gemessen vor dem Eingriff:** 178 px-Werte bei `padding`/`margin`/`gap`, verteilt auf **22
verschiedene Zahlen** (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,20,22,26,30,52). Radien:
3,4,5,7,8,9,10,12px nebeneinander. `prefers-reduced-motion`: **0 Vorkommen**.

**Danach:** 276 Belegstellen auf `var(--s0..--s11)` / `var(--r1..--r4)`.

⚠️ **Ehrlich, was das bringt:** die Zahl der Werte sinkt von 22 auf 12, nicht auf 5. Die App
steht auf einem 2px-Raster; eine gröbere Skala wäre nur zu haben, indem Abstände sichtbar wandern.
Der Gewinn ist nicht Schönheit, sondern eine **geschlossene Sprache**: neuer Code erfindet kein
13px mehr, und eine spätere Änderung am Rhythmus ist eine Zeile statt 178.

**Die Grenze ist der ganze Punkt:** kein Wert wird weiter als **1px** verschoben. 13 Werte lagen
darüber. Sie wurden NICHT von der Skala überfahren, sondern **einzeln von Hand entschieden** —
zwölf um je 2px (Arbeitsfläche 26/30 → 24/32, Panel 22 → 24, Abstände 18 → 20), einer
(`padding-top:52px` im Fokus-Modus) bleibt roh und trägt jetzt einen Kommentar, der sagt warum.

### B159 — meine erste Zusicherung konnte nie halten
Der erste Entwurf verlangte: *Rückrechnung muss zeichengleich die Ausgangsdatei ergeben.* Bei
einem um 1px verschobenen Wert ist das unmöglich — die Zusicherung wäre **entweder immer rot oder
in Wahrheit leer** gewesen. ►► Jetzt wird jede geänderte Zeile aus dem **Protokoll** zurückgerechnet,
und eine Zeile, die sich ändert **ohne** Protokolleintrag, ist ein Fehler.
⚠️ Aufgedeckt hat es der **Selbsttest**, nicht der Lauf. Dieselbe Klasse wie B153/B158: ein
Meldezweig ist erst geprüft, wenn jemand ihn liest.

### B160 — der zweite Durchgang schrieb Radien falschen Zeilen zu
Der Zeilenindex wurde **einmal** aus der Ausgangsdatei gebaut. Nach dem ersten Durchgang stimmten
die Zeichenpositionen aber nicht mehr (`var(--s3)` ist länger als `8px`).
►► **Gefangen von der Gegenprobe beim echten `--setze`: sie hat abgebrochen und nichts geschrieben.**
Das ist der erste Fall, in dem eine Zusicherung dieses Projekts einen Schreibvorgang verhindert hat.

### B161 — die Token-Regex hätte fremde Variablen getroffen
`var\(--[a-z]\d+\)` trifft auch `var(--g300)` — seit jeher die Rahmenfarbe. Die Gegenprobe hätte
sie durch einen Platzhalter ersetzt und **falschen Alarm** geschlagen. ►► Das Muster wird jetzt aus
den Skalennamen gebaut, nicht geraten.

### B162 — fünf Utility-Klassen tragen ihren Wert im Namen
`.u-gap-5px { gap:5px }` auf die Skala gezogen hätte `gap:6px` ergeben — **der Name hätte gelogen**,
und `.u-gap-5px` wäre inhaltsgleich mit `.u-gap-6px` gewesen. ►► Diese fünf bleiben roh, bis der
Markup-Durchgang sie umbenennen und zusammenlegen kann. Offen, bewusst.

### Was der Schnappschuss hier belegt — und was nicht
⚠️ **Er meldete unverändert (19 / 2844). Das belegt nur, dass kein Markup angefasst wurde.**
Er liest keine Stylesheets. Ein Bildabgleich der verschobenen zwölf Werte steht aus.

---

## 13. INVENTUR 13.10.2026: Relevanz, Uebernahme und Sparpotenzial aller Werkzeuge (Nutzer-Auftrag, BUILD_LOG 152/153)

**Methode (aus §5 gelernt: Verweise, nicht Groesse/Datum):** einmaliges Skript `_to_delete/helfer/m4/inventur.py`, Probe 8/8 an
bekannten Faellen (zwei Messfehler dabei gefunden und behoben: generischer Name `index.js` traf fremde Stellen; Waechter werden
in `check.sh` OHNE `.sh` aufgerufen). Je Datei: Aufrufer in check.sh/CI/tools/tests (auto), Doku (aktive *.md), Chronik;
Syntax (compile / `node --check` / `bash -n`); Bezug zur alten App. Dazu jedes Werkzeug ohne Auto-Aufrufer EINMAL mit
`--help` in einer Wegwerf-Kopie (`git archive HEAD`) gestartet – schreibende Werkzeuge treffen so nie den echten Stand.
Bibliotheken per Import-Muster nachgezaehlt (`tools/kern.js` 6 Importeure, `tools/poolzugang.py` 3).

**Bestand:** 146 Code-Dateien unter `tools/`. Auto-Aufrufer: 96 (alle 35 Waechter, 48 Werkzeuge, plugin/semgrep/training-shell,
4 Sichtpruefungen). Syntaxfehler: 0. Ohne Auto-Aufrufer: 36 + `archiv/` 10 + `migration/` 5.

### 13a. Defekt, aber uebernehmbar (Funktion gebraucht, Umbau klein)
| Werkzeug | Befund (gemessen) | Weg |
|---|---|---|
| `trennschaerfe.js` | rc 1 beim Aufruf `node tools/trennschaerfe.js` (so in WERKZEUGE.md): `require("./_harness.js")` liegt nur in `tests/`, bootet die ALTE App. ⚠️ **Korrektur:** der Dateikopf verlangte die Kopie ins flache Arbeitsverzeichnis von `suite.sh` – DORT lief es (gemessen, rc 0). Defekt war der Weg in der Doku, nicht das Werkzeug | `H.boot()` → `tools/kern.js`; dort fehlt `freitext.ts` (`gradeTeilpunkte` ist in `neu/src/kern/freitext.ts`, `L.gradeTeilpunkte` = undefined) |
| `mess_freitext.js` | dito; wird von `trennschaerfe.js` mitgemessen | dito |

### 13b. Veraltet – Kandidaten fuer `tools/archiv/` (W4)
| Werkzeug | Befund |
|---|---|
| `index.js` + `FUNCTIONS.md` | indexiert nur `referenz/` (alte App: logik.js, app_*.js); fuer `neu/` nutzlos |
| `sichtpruefung/umschalten.js` | ENOENT `lernprogramm_ap1` – Umschaltung alt→neu (N29) ist erledigt |
| `probe_doppelziehung.js` | braucht eine Arbeitskopie MIT `app.html` (alte App) |
| `backup.sh` + `backup_rotate.sh` | `zip` fehlt auf dem PC (rc 1); prueft die alten Kernfiles `fragen.js/app.js/logik.js`; Sicherung ist git + GitHub |
| `migration/*.py` (5) | Einmal-Migrationen Juli/Aug.; laufen auf heutigem Pool nicht mehr (Traceback) – Chronik |

### 13c. Handwerkzeuge, laufen – bleiben
`abschnitt.py`, `befunde_index.py`, `css_skala.py`, `fakten_check.py`, `firmen_umlaut_setzen.py`, `katalog/abdeckung.py`,
`katalog/katalog_parse.py`, `lehrtext_pool.py`, `melde_ids.js`, `sabotage_vt.py`, `schluessel_setzen.py`, `svg_linien.py`
(bricht bei `--help` mit ValueError – erwartet `--id`, Argumentpruefung schwach), `test_check_stempel.sh`, `verweis_nachbar.py`,
`verweis_setzen.py`, `vorlauf.sh`, `wache_sabotage.py` (22/22), Bibliotheken `kern.js`, `poolzugang.py`.

### 13d. Sichtpruefung (11 nur in Doku)
Brauchen einen lokalen Server (`LIESMICH.md`); ohne ihn rc 1 – kein Defekt. Einmal-Etappen-Messungen (p5, p6b, rest, breite,
breite_probe, lupe3) gegen wiederverwendbare (n48p4, typen, rechner, zuschauer, offline) – einzeln am LIESMICH zu entscheiden.

### 13e. Sparpotenzial (gemessen)
* **Voller `check.sh`: 214 s**, davon Waechter 112 s (35). Spitzen IM Lauf: 4f_qualitaet 31 s, 4f_umbau 26 s, 4f_as 17 s.
  **Einzeln auf ruhiger Maschine:** 4f_qualitaet komplett ~6 s (lizard 0,4 · knip 1,2 · ruff 0,1 · shellcheck 1,6 · tsc 0,2+0,3 ·
  Selbsttest 1,4). ►► Die Waechter sind NICHT der Engpass – sie teilen die CPU mit den 4f-Hintergrundlaeufen (vitest ~90 %, N51 A2).
* **`start.sh` warm 43 s** (kalt heute ~100 s = zwei Warte-Aufrufe): `umgebung.sh` 18 s (davon `einrichten.sh --pruefen` 10 s,
  `npm view` Netz 2 s), CI-Abschnitt (`ci2.sh`, gh) 16 s – beide nacheinander, waehrend `suite.sh --waermen` im Hintergrund laeuft.
  ►► Vorschlag: `ci2.sh` zu Beginn im Hintergrund starten und im CI-Abschnitt nur abholen → warm ~27 s; ob kalt dann unter
  50 s bleibt, ist NICHT gemessen.
* `qualitaet_ratsche.py` faehrt knip zweimal (Selbsttest + Messung) – 1,2 s, lohnt keinen Umbau.

### 13f. Umgesetzt 13.10.2026 (BUILD_LOG 153)
* 13a: beide auf `tools/kern.js` + `pool_laden.js` (kern.js laedt jetzt `freitext.ts`; dessen Import `./freitext-synonyme` ohne `.ts` – als einziger im Kern – auf `.ts` gezogen). **Gegenprobe:** Liste, Diagnose (M02-109, M01-013) und `mess_freitext.js` Byte fuer Byte gleich der alten Ausgabe aus dem Arbeitsverzeichnis (5/18/16 Zeilen).
* 13b: alle fuenf Gruppen nach `tools/archiv/` (Nutzer-Entscheid); `tools/migration/*.json` bleiben (Eingaben von `e3_gegenprobe.py`, `firmen_umlaut_setzen.py`).
* 13e: `start.sh` startet `ci2.sh` parallel – warm **43 s → 19/20 s** (zwei Laeufe). Kalt nicht gemessen.

### 13g. Sichtpruefung nachgemessen 13.10.2026 (BUILD_LOG 154)
⛔ **Erster Lauf nach LIESMICH-Rezept war wertlos:** `python3 -m http.server` im Repo-Ordner + `/v2/` → `/assets/*.js` 404,
Seite leer (0 Knoepfe, kein `<main>`); p5/rest/breite meldeten trotzdem rc 0, typen/p4/p6/p6b liefen in mein 120-s-Limit
(Playwright meldet das als „Target crashed“ – Abbruch, kein App-Absturz; einzeln nachgestellt: kein Absturz).
**Mit `dienst.py` (neu `tools/sichtpruefung/server.sh start|stop`):** alle 11 rc 0 mit echten Werten – typen 201 s (20 Typen),
p4 74 s, p5 142 s, p6 222 s, p6b 123 s, breite 9 s, breite_probe 11 s, rest 28 s, rechner 39 s, zuschauer 42 s, lupe3 7 s.
Nutzer-Entscheid: **alle behalten**. Einziger auffaelliger Wert `rechner` kalkulation 390 px `raus 16`: gemessen alle in
einem `overflow-x-auto`-Rollbereich (Tabelle, 238 px), `doc` 0, `rechtsRaus` 0 – gewollt, kein Fehler.
