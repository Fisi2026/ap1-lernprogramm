# regeln/messen.md – MESSEN – Waechter, Gegenproben, Messwerkzeuge und Kennzahlen

**Wann lesen:** Pflicht vor jedem Waechter, jeder Pruefung, Gegenprobe oder jedem Messwerkzeug – und vor jeder Kennzahl, Quote oder Mengenaussage.

⚠️ Entstanden am 11.10.2026 (N49 W1, Nutzer-Entscheid): die Bloecke unten stehen **verbatim** aus `START_PROMPT.md` und `docs/archiv/LEHREN.md` (verschoben mit `tools/rotiere.py`, Gegenprobe 0) – nichts gekuerzt, nichts umformuliert. Abschnittsnummern und „siehe oben“ darin beziehen sich auf die Ur-Fassung (`git log -p START_PROMPT.md`, Stand vor N49 W1).
⛔ Diese Datei traegt keinen Stand (der steht in den zwei Standzeilen von `START_PROMPT.md`). **Neue Lehren kommen ans Ende, mit Datum und Beleg.**

## Aus docs/archiv/LEHREN.md verschoben am 11.10.2026 (N49 W1, verbatim, rotiere.py)

### aus docs/archiv/LEHREN.md, Zeilen 14-17 der Ur-Fassung

### aus START_PROMPT.md, Zeilen 351-452 der Ur-Fassung

# ⚠️ **EINE PRÜFUNG, DIE WÜRFELT, IST KEINE PRÜFUNG.** `test_axe` zog EINE Frage zufällig und hielt
#   einen `aria-command-name`-Verstoß grün; deterministisch: acht weitere Fragetypen, fünf critical.

### aus docs/archiv/LEHREN.md, Zeilen 24-31 der Ur-Fassung

# ⛔⛔ **WER DIE APP MISST, MISST IN DER APP.** Am 31.08. waren DREI Messungen falsch, alle weil
#   außerhalb der laufenden App gemessen wurde (falscher Nenner · Endzustand statt Ziehungszeitpunkt ·
#   `THEMA_RELEVANZ` per `require` „0 Einträge", in der App 80). ►► **Jede hätte einen Scheinbefund
#   ergeben. Ein Nachbau misst, was man sich denkt.** Die drei Fälle: Archiv 03.09.
#   ⛔⛔ **UND EINE WIDERLEGTE MESSUNG, DIE ALS BEGRÜNDUNG IM WERKZEUG STEHEN BLEIBT, VERDECKT DIE
#   URSACHE WEITER:** genau dieser `require`-Satz stand am 10.09. noch im Kopf von
#   `probe_lernfluss.js` und hielt M08 zehn Tage als offene Frage (B148). ►► **Wer eine Messung
#   widerlegt, sucht ihren Wortlaut in den Werkzeugen.**

### aus docs/archiv/LEHREN.md, Zeilen 32-34 der Ur-Fassung

# ⛔⛔ **EINE KENNZAHL, DIE INNERHALB EINER SITZUNG MITTELT, BEANTWORTET KEINE FRAGE ÜBER WOCHEN** –
#   auch wenn die Überschrift darüber danach fragt (B149, 10.09.: „erste/letzte 10" flach bei
#   +0,01, der Lernweg stieg 1,35 → 3,03). **Dritter Fall nach B147.** ►► **Erst prüfen, WORÜBER.**

### aus docs/archiv/LEHREN.md, Zeilen 41-43 der Ur-Fassung

# ⚠️⚠️ **EIN WERKZEUG, DAS AM ERSTEN TAG GEBAUT WIRD, IST AM ERSTEN TAG NOCH NICHT GEPRÜFT** –
#   `pool_query.js verweise` las „WCAG 2.1" als Abschnitt 2.1 und hätte neun richtige Verweise
#   „repariert". **Ein neues Messwerkzeug erst an einem Fall prüfen, dessen Antwort man kennt.**

### aus docs/archiv/LEHREN.md, Zeilen 44-47 der Ur-Fassung

# ⛔⛔ **EIN WERKZEUG, DAS IN DEN ORDNER SCHREIBT, DEN ES LIEST, WIRD ZWEIMAL GEFAHREN** – der erste
#   Lauf misst eine Welt ohne seine Ausgabe. `befunde_index.py` las im zweiten `docs/befunde/BEFUNDE_INDEX.md`
#   mit (0 → 145 „Mehrfach"), **und die Gegenprobe blieb grün: sie fragte nur, ob die erwartete
#   Datei DABEI ist** (B151). ►► **Anwesenheit prüfen heißt nicht Menge prüfen.**

### aus docs/archiv/LEHREN.md, Zeilen 48-49 der Ur-Fassung

# ⚠️ **EINE VERSIONSANGABE IN DER DOKU IST EIN MESSWERT VON DAMALS, KEIN ZUSTAND** – **vor dem
#   Umsetzen eines notierten Versionssprungs die Release-Seite aufrufen** (`WebSearch`/`WebFetch`).

### aus docs/archiv/LEHREN.md, Zeilen 53-56 der Ur-Fassung

# ⚠️ **DER GEBIETS-WÄCHTER MISST EINEN ANTEIL – JEDE NEUE FRAGE AUSSERHALB VON A4 SENKT IHN.**
#   26 Fragen außerhalb A4 hätten A4 von 4,88 auf 4,73 % gedrückt und den Wächter (Schwelle 4,8)
#   rot gemacht, ohne dass sich an A4 etwas verschlechtert hätte. **Gegenmittel ist Verteilung,
#   nicht Schwellensenkung. Bei jedem größeren Zuwachs vorher nachrechnen.**

### aus docs/archiv/LEHREN.md, Zeilen 57-59 der Ur-Fassung

# ⚠️ **EIN SINKENDER ANTEIL IST NOCH KEINE VERBESSERUNG – IMMER DEN ZÄHLER LESEN, NICHT DIE QUOTE.**
#   Der Tell-Anteil fiel von 50,6 auf 43,8 %, während der Zähler unverändert bei 124 stand: gewachsen
#   war allein der Nenner. **Das Ziel darf nicht durch Hinzufügen erreicht werden.**

### aus docs/archiv/LEHREN.md, Zeilen 112-118 der Ur-Fassung

### 26.09.2026, web.de – ein Audit-Befund „fehlt" ist eine Behauptung ueber das GANZE Repo
⛔ **Beleg:** Im Komplett-Audit standen zwei Befunde, die nicht stimmten. „SVG ohne Waechter" – gesucht nur in
`tools/`, `tests/`, `check.sh`; der Waechter lag seit dem Morgen in `neu/src/daten/svg.test.ts`. „PAT im Klartext
in `.git/config`" – aus DEPLOY.md abgeschrieben; gemessen stand dort seit dem neuen PC kein Token mehr.
►► **Wer „es fehlt X" meldet, zeigt die Suche ueber das ganze Repo (inkl. `neu/src`) – und wer einen Zustand
aus der Doku meldet, misst ihn vorher.** Beide Fehler fielen erst beim Umsetzen auf, nicht beim Pruefen.


### aus docs/archiv/LEHREN.md, Zeilen 163-170 der Ur-Fassung

### 10.10.2026, web.de – eine Empfehlung aus Annahme drehte sich bei der ersten Messung um
⛔ **Beleg:** Zur Frage, ob die N43-Ratschen auch in der CI laufen, stand „Nur lokal (Empfohlen) – CI bleibt
schlank und unveraendert". Gemessen: `ci.yml` Zeile 78 faehrt schon `bash check.sh` – jede Ratsche dort laeuft
ohnehin in der CI, „nur lokal" gab es nicht. Erst die Rueckfrage des Nutzers („warum nicht im ci empfohlen")
loeste die Messung aus.
►► **Regel (Nutzer-Entscheid 10.10.):** jede Empfehlung wird VOR dem Aussprechen gemessen und geprueft und nennt
ihren Beleg (START_PROMPT Abschnitt 5 Regel 1, Skill fisi-lernapp „Arbeitsweise").

### 11.10.2026, Cloud-Seite – ein neues Messwerkzeug laeuft erst an fuenf bekannten Faellen, dann voll (N51 A5, E075)
⛔ **Beleg:** `tools/sichtpruefung/n48p4.js` lief am 11.10. viermal ueber 300 Fragen, zweimal nur wegen eigener
Fehlalarme (Label statt `<select>` gemessen; SVG im rollenden Kasten als „rechts raus“ – BUILD_LOG 140). Jeder volle
Lauf kostete Minuten und Warte-Aufrufe; beide Fehlalarme haetten fuenf ausgesuchte Fragen in Sekunden gezeigt.
►► **Regel (Nutzer-Entscheid 11.10.):** ein neues Mess- oder Pruefwerkzeug bekommt einen Schalter `--probe` und
laeuft damit ZUERST an mindestens fuenf Faellen mit bekannter Antwort – darunter Grenzfaelle (leer, Hoechstwert,
Sonderzeichen, der Fall, der die Regel gerade NICHT erfuellt) und mindestens einer, der rot sein muss. Erst wenn
`--probe` jeden Fall richtig nennt, laeuft das Werkzeug ueber den Bestand.
* Muster `--probe`: `tools/vorlauf.sh --probe` (stellt die vier roten Laeufe vom 11.10. als Sabotage nach, legt die
  Dateien danach zurueck, rc 0 nur bei 4/4) · `tools/entscheide.py --probe` (doppelt, Luecke, Datei ohne Abschnitte).
* Ein vorhandenes `--selbsttest` (7 Werkzeuge in `tools/`, z. B. `qualitaet_ratsche.py`, `ungepusht.py`) erfuellt die
  Regel, wenn es dieselben Faelle prueft – kein zweiter Schalter fuer dieselbe Sache.
* Die Probe gehoert ins Werkzeug, nicht in eine Wegwerfdatei unter `_to_delete/` – sonst ist sie beim naechsten
  Umbau weg (vgl. TASKLIST 0b: „eine Regel, die nur in der Doku steht, wird gebrochen“).

### 14.10.2026, Cloud-Seite – Sabotage nur an Probe-Dateien, Messreihen nur ohne Fremdlast (BUILD_LOG 170, 172, 168, 176)
⛔ **Beleg:** (1) Ein Sabotage-Skript gegen `kern/architektur.test.ts` schrieb in echte Dateien und ueberschrieb per falschem
`cp` `kern/route.ts` mit `anzeige.ts` – sofort per `git checkout` zurueck, aber nur, weil es auffiel. (2) Eine oxlint-Messung
mit Konfiguration in `/tmp` meldete 368 Scheinbefunde: `overrides`-Pfade gelten relativ zur Konfigurationsdatei. (3) Ein
vitest-Messpaar (N45 W5) lief unter fremder Last auf dem PC (332 statt ~90 s, ein Timeout) – drei Paare mussten nachgemessen werden.
►► **Regel:** Gegenproben und Sabotage NUR an Probe-Dateien oder in einem Wegwerf-Klon (`git clone file://…`), nie am
Arbeitsbaum (Muster: `tools/architektur_probe/`, `neu/werkzeug/as_probe/`) · Mess-Konfigurationen liegen dort, wo die echte
liegt · Zeitmessreihen auf dem PC: vor jedem Lauf die CPU-Last lesen (`powershell … LoadPercentage`) und Laeufe unter Fremdlast
verwerfen statt mitteln.

## Aus TASKLIST.md §0b (Verfahrenslehren vom 28.07.2026) verschoben am 27.11.2026 (Paket 2 Schritt 4, BUILD_LOG 309, verbatim, rotiere.py)

### aus TASKLIST.md, Zeilen 33-231 der Ur-Fassung

# ══════════════════════════════════════════════════════════════════════════════════════════════
# 0b. VERFAHRENSLEHREN AUS DEM 28.07.2026 – TEUER BEZAHLT, DESHALB HIER
# ══════════════════════════════════════════════════════════════════════════════════════════════
# ⚠️⚠️ **EINE REGEL, DIE NUR IN DER DOKU STEHT, WIRD GEBROCHEN. EINE IM SKRIPT NICHT.**
#   Die Warnung „beim Zurücknehmen zu langer Distraktoren entstehen neue Treffer" stand seit dem
#   27.07. in `START_PROMPT.md` und wurde in derselben Sitzung zitiert. Der Korrekturlauf lief
#   trotzdem hinein: **neun neue Längen-Tells auf einen Schlag.** Erst das Nachbesserungs-Skript
#   trug eine `assert`-Zusicherung – und die schlug sofort zweimal an.
#   ►► **WER EINE REGEL ZWEIMAL VERLETZT HAT, SCHREIBT SIE NICHT DEUTLICHER AUF, SONDERN BAUT SIE
#   IN DAS WERKZEUG.** Ergebnis: `tools/opt_ersatz.py` (prüft VOR dem Schreiben),
#   `tools/apply_batch.py` Klasse 10, `tests/test_didaktik.js` Wächter 5.
#
# ⚠️⚠️ **EIN EINSEITIGER WÄCHTER ERZEUGT DEN FEHLER IN DER GEGENRICHTUNG.** Klasse 6 verlangte
#   „mindestens ein Distraktor länger" und kannte keine Obergrenze. Wer sie erfüllen will,
#   verlängert Distraktoren – beliebig weit. Gemessene Folge: **65 Fragen mit einem Distraktor
#   über 1,15 ×, Spitzenwert 3,22 ×, ohne dass je ein Test rot wurde.**
#   ►► **BEI JEDEM NEUEN WÄCHTER FRAGEN: Was tut jemand, der ihn grün bekommen will – und ist das
#   erwünscht?** Zwei Wächter, die gemeinsam ein FENSTER aufspannen, sind sicherer als einer.
#
# ⚠️⚠️ **EIN TEST, DER SEINE TESTDATEN AUS DEM CONTENT-STAND ZIEHT, FÄLLT BEIM NÄCHSTEN
#   INHALTSSCHNITT – UND SIEHT DABEI AUS WIE EIN PRODUKTFEHLER (04.08.2026).** Beim Auflösen von
#   M09 fielen vier Suiten, ohne dass am geprüften Verhalten etwas falsch war: `test_stufen`
#   (`m09Fragen.length > 50`), `test_zurueck_m09` (drei echte mc-Fragen, dann TypeError auf
#   `mcs[1]`), `test_unterricht` (25 Fragen für die Klausursimulation) und `test_themenauswahl`
#   (`FRAGEN.find(f => f.modul === "M09")`). **`test_unterricht` hatte die richtige Idee schon im
#   Kopftext stehen** – „Da der echte M09-Pool leer sein kann, injizieren die Tests synthetische
#   Fragen" – die Injektion war nur nie groß genug.
#   ►► **TESTDATEN GEHÖREN IN DEN TEST, UND ZWAR IN EINE DATEI:** `tests/_m09fixture.js`.
#   Zwei Suiten mit je eigener Fixture laufen auseinander – dieselbe Ursache wie bei den zwei
#   Kopierlisten und den zwei Dateiübersichten. **Themen und Grenzwerte aus der Konstante lesen,
#   nicht danebenschreiben.**
#
# ⚠️ **EIN KOMMENTAR, DER EINE HERKUNFT BEHAUPTET, IST KEIN GENERATOR (04.08.2026).**
#   `spickzettel.js` trug seit Monaten den Kopf „Inhalt aus 99_Spickzettel.md" – gebaut wurde er
#   nie, sondern von Hand als JSON-escapter String parallel gepflegt. Gemessen waren beide am
#   04.08. **zufällig** noch zeichengleich (10437/10437). Seit dem 04.08. erzeugt
#   `tools/build_spick.py` die .js aus der .md (seit N34 T6b: `neu/src/kern/tabellen/spickzettel.ts`). **Wo zwei Dateien denselben Text führen, muss ein
#   Skript sie erzeugen – oder ein Wächter sie vergleichen.**
#
# ⚠️ **EINE FRAGE KANN THEMATISCH REDUNDANT UND TROTZDEM BESTAND SEIN (04.08.2026).** Fünf
#   M09-Gantt-Fragen waren inhaltlich von M01 gedeckt und trugen zugleich zwei der drei
#   Meilenstein-Rauten (`rotate(45)`) des ganzen Pools; `test_gantt` (≥ 12 Gantt-SVGs, ≥ 2 Rauten)
#   wurde rot. **Vor jeder Löschung nicht nur fragen „steht das woanders", sondern „was hängt
#   daran": Bilder, Fragetypen, Stufen, Gebietsanteile.**
#
# ⚠️⚠️ **EINE TOLERANZ IST EIN EINSEITIGER WÄCHTER – UND EIN NEUER WÄCHTER BRAUCHT EINEN FALL,
#   DEN NUR ER FÄNGT (04.08.2026).** Beim Bau der Tippfehler-Toleranz zwei Stolperstellen:
#   1. **Die Toleranz gehört NEBEN die exakte Prüfung, nicht hinein.** `L.gradeLuecke` bedient
#      vier Fragetypen (`lueckentext`, `trace`, `dropdown`-Freitextmodus, `rechenassistent`).
#      Wäre die Toleranz dort eingebaut worden, hätte sie `Stufe 1`/`Stufe 2` und
#      `ISO 9001`/`ISO 9000` stillschweigend gleichgesetzt. → eigene Funktion
#      `L.gradeLueckeTolerant`, die NUR `lueckentext` ruft.
#   2. **Die erste Gegenprobe war wertlos:** Der Testfall „ipconfog" wird schon von der ALTEN
#      Stem-Regel akzeptiert (Stamm „ipcon"), der Test wäre auch ohne die neue Toleranz grün
#      gewesen. Erst ein Fehler in den ersten fünf Zeichen („iconfig") trennt beide Regeln.
#   ►► **Vor jedem neuen Wächter fragen: Welchen Fall fängt AUSSCHLIESSLICH er? Und was tut
#   jemand, der ihn grün bekommen will?**
#
# ⚠️ **ZEICHEN NIE SCHÄTZEN.** Am 28.07. wurden Ersatztexte formuliert und ihre Länge im Kopf
#   gerechnet – viermal daneben, jedes Mal ein Fehlversuch. **Kandidaten zuerst in ein Skript
#   schreiben, Längen ausgeben lassen, dann einsetzen.** `python3 tools/opt_ersatz.py --zeige <ID>`
#   nennt das Zielfenster.
#
# ⚠️ **NACH EINEM KLASSENWEITEN GRIFF NACH DER ZWEITEN SCHREIBWEISE SUCHEN.** Der Scan
#   `Option \d` meldete 5 Fragen; die Klasse hatte eine zweite Notation `(0) … (1) …` mit vier
#   weiteren. **M02-771 galt deshalb fälschlich als erledigt** – die frühere Korrektur hatte das
#   Symptom vor dem Scanner versteckt. ►► **Die Gegenprüfung darf nicht die sein, an der die
#   Korrektur sich orientiert hat.** Der Unterscheider war hier die Null: Eine Aufzählung beginnt
#   nie bei 0, ein Index schon.
#
# ⚠️ **BESTANDSENTSCHEIDE GEHÖREN IN EINE DATEI, NICHT IN PROSA.** Ausnahmen, die nur im Fließtext
#   stehen, werden bei jedem Messlauf erneut „gefunden". → `laengen_ausnahmen.json`, gelesen von
#   Wächter und `apply_batch`. **Eintragen nur mit Nutzer-Entscheid, Datum und Begründung** – ein
#   Eintrag wirkt wie das Anheben einer Ratsche.
#
# ⚠️⚠️ **EIN PRÜFWERT, DER DEN GEPRÜFTEN WERT DUPLIZIERT, MISST IRGENDWANN ETWAS ANDERES.**
#   Zwei Gegenproben von Wächter 5 hatten die Zahlen 40/46/47 fest verdrahtet. Beim Verstellen des
#   Grenzwerts fielen sie, obwohl der Wächter korrekt arbeitete. **Fixtures aus der Konstante
#   RECHNEN**, nicht danebenschreiben.
#   Dieselbe Klasse: `MIN_OPTIONSLAENGE`/`MAX_FAKTOR` standen kurzzeitig in drei Dateien mit dem
#   Kommentar „identisch zu …". Ein Kommentar erzwingt nichts. → `laengen_ausnahmen.json`
#   `grenzwerte` ist die eine Quelle für Wächter, `apply_batch` und `opt_ersatz`.
#
# ⚠️ **BEVOR MAN EIN WERKZEUG VERDÄCHTIGT, PRÜFT MAN DEN PRÜFFALL.** Eine `opt_ersatz`-Gegenprobe
#   schlug scheinbar fehl – tatsächlich war der Prüffall falsch gebaut (nur eine von zwei Optionen
#   gekürzt, also lag korrekterweise kein Tell vor). Verwandt mit „die Wächter sind klüger als ich".
#
# 🕐 **VOR DEM SCHREIBEN EINES MESSSKRIPTS: `node tools/pool_query.js` OHNE ARGUMENT AUFRUFEN.**
#   Am 28.07. wurde dieselbe Längenmessung ACHTMAL als Wegwerf-Skript neu geschrieben, obwohl
#   `frage <id>` und `suche <regex>` längst existierten. **Eine Fassung zählte falsch** (Kurz-
#   optionen-Ausnahme vergessen) – daher stand einmal „65 Fälle" und einmal „49".
#   Seit dem 28.07. gibt es **`node tools/pool_query.js laengen [modul]`**: Tell-Treffer UND
#   überlange Distraktoren mit Zielfenster, aus derselben Quelle wie die Wächter.
#
# 🕵️ **EINE FRAGE AUF VOLLSTÄNDIGKEIT PRÜFEN? `svg` MITLESEN.**
#   Am 25.08. sah M08-335 aus wie eine kaputte Frage: „Lies den Handelsregister-Auszug" – im
#   Fragetext steht kein Auszug, und die Erklärung nennt eine Firma, die nirgends vorkommt.
#   **Die Frage ist `typ: "bild"`, der Auszug steht als gezeichnetes `svg` im Datensatz.**
#   Ein Scanner über `frage`/`optionen`/`luecken` hält JEDE Bildfrage für unvollständig.
#   ►► Dieselbe Klasse wie „das Lösungsfeld allein sagt nicht, was gefragt war" (M03-609).
#
# 🏭 **FIRMENNAMEN: `node tools/pool_query.js firmen`, nicht `grep`.**
#   Ein blankes `/ue/` meldete 47 Namen, **10 davon richtig geschrieben** („Brauerei",
#   „Steuerberatung", „Bauelemente" – „ue" aus „eu"/„au") plus deutsche Ortsnamen auf Ue-/Oe-/Ae-
#   (**Uetersen**, Uelzen, Oelde). Ein blankes `GmbH` traf „Die GmbH" als Firmennamen.
#   Das Werkzeug filtert beides und **zeigt seine Ausnahmen an**; `check.sh` 4e3 hält den Stand.
#   ⚠️ Es liest den Pool über `tools/pool_laden.js` (seit N29 Teil 2).
#
# 🔬 **DAS PROGRAMM IM BROWSER INSTRUMENTIEREN? ERST JSDOM VERSUCHEN.**
#   START_PROMPT Punkt 5 stand ein Vierteljahr auf „nur mit Instrumentierung im Browser zu klären".
#   **Beide Verdachtsfälle liefen dann in jsdom** (`tools/probe_doppelziehung.js`, 25.08.).
#   ►► **Ein Satz über die eigene Werkzeuglage ist eine Vermutung, kein Blocker.** Wer ihn beim
#   Wort nimmt, lässt einen Punkt offen, den zwei Aufrufe schließen.
#   **Was beim Messen an der laufenden App zu wissen ist** – beides hat mich am 25.08. je einen
#   Fehlschluss gekostet, beide vor dem Melden gefunden:
#   * Der Aktionsknopf ist **`#btnAktion` im globalen `#actionbar`, NICHT in `#main`.** Eine Suche
#     über `#main button` findet ihn nicht und meldet fälschlich „es gibt keinen Weiter-Knopf".
#     Antwortoptionen sind `#main button.opt`.
#   * **`f._beantwortet = true` von außen zu setzen genügt NICHT.** `loeseFrage` baut den
#     unbeantworteten Zustand jedes Mal neu auf. Nur echtes Durchklicken (Option → „Lösung
#     prüfen") erzeugt den Zustand, in dem Weiter-Fehler leben.
#   * Befunde **in eine Datei schreiben**, nicht auf stdout – der Testläufer filtert stdout.
#
# 🕐 **SANDBOX-TEMPO (spart je zwei Aufrufe):**
#   * `umgebung.sh` meldet, ob `/tmp/ap1_tooling` fehlt. **Fehlt der Spiegel, ist der erste
#     Suiten-Aufruf ein Aufwärmlauf und läuft in die 45 s.** Einplanen, nicht überrascht sein.
#   * Suiten **nur** über `bash tools/suite.sh <name>`. `node tests/test_x.js` direkt scheitert an
#     `NODE_PATH` – am 28.07. zweimal probiert, zweimal `MODULE_NOT_FOUND`.
#   * Voller Prüflauf = `check.sh block start` → 3–4 × `weiter` → `ende`. Rund sechs Aufrufe.
#   * `umgebung.sh` und `git status --porcelain` **in EINEM Aufruf**: Am 28.07. meldete das Skript
#     „index.lock nicht vorhanden (gut)" und eine Sekunde später stolperte `git status` über genau
#     diesen Lock. **Ein Umgebungsbefund ist eine Momentaufnahme, keine Garantie.**
#   * ⚠️⚠️ **/tmp KANN EINEM ANDEREN BENUTZER GEHÖREN (30.07.).** `/tmp/ap1_tooling`,
#     `/tmp/ap1_suite` und `/tmp/ap1_check_block` lagen als `nobody` mit `0700`-Unterordnern da –
#     weder lesbar noch löschbar. `suite.sh` brach mit „Spiegel unvollstaendig (1 von 2359
#     Dateien)" ab. **Das ist KEIN langsamer Mount, auch wenn die Meldung das nahelegt** – erst
#     `ls -ld /tmp/ap1_*` ansehen. Ausweg sind die drei Schalter, alle drei setzen:
#     `CHECK_NM_SPIEGEL=/tmp/ap1_nm/node_modules CHECK_WORK=/tmp/ap1_cb2 SUITE_WORK=/tmp/ap1_work`.
#     `suite.sh` liest `CHECK_NM_SPIEGEL` erst seit dem 30.07. – vorher hatte nur `check.sh` einen
#     Ausweg. **Zwei Skripte für dieselbe Aufgabe, nur eines mit Schalter: das fällt wieder auf.**
#   * **Das Spiegeln von `node_modules` passt NICHT in die 45 s** (2359 Dateien vom Mount). Der
#     `cp` bricht ab und muss ein zweites Mal laufen; danach ist er vollständig. **Kein Fehler.**
#   * ✅ **`check.sh block` braucht seit dem 30.07. nur noch 4 Aufrufe statt 6** (start · 2× weiter ·
#     ende): 30 Suiten passen jetzt in ein 45-s-Fenster statt 15. Grund war ein `sleep(2500)` im
#     Harness bei ~480 ms echter Startzeit. **Nicht überrascht sein, wenn es weniger Runden sind.**
#
# ⚠️ **GRÜN IST NICHT IMMER DAS RICHTIGE KRITERIUM (30.07.2026).** Beim Kürzen der Wartezeiten in
#   `test_axe` wäre „läuft noch grün" der Fehlerfall gewesen: Ein zu früher axe-Lauf findet WENIGER
#   Knoten und meldet deshalb WENIGER Verstöße. Geprüft wurde stattdessen die **Knotenabdeckung**
#   (Summe über `res.passes[].nodes`) – mit und ohne Warten identisch in allen 26 Läufen.
#   ►► **Vor jeder Beschleunigung fragen: Was würde ein zu früher/zu kleiner Lauf MELDEN?** Meldet
#   er weniger Fehler, ist Grün kein Beleg, sondern das Symptom. Dann eine Abdeckungszahl messen,
#   nicht das Urteil. (Danach zusätzlich gegengeprobt, dass die schnellere Suite noch beißt –
#   je ein entferntes `aria-label` in Teil 1 und Teil 2 lässt sie fallen.)
#
# ⚠️ **EIN PAUSCHALER `sleep` IST EINE ANNAHME, KEINE MESSUNG (30.07.2026).** `tests/_harness.js`
#   wartete 2500 ms nach jedem jsdom-Boot; gemessen war die App nach 445–486 ms bedienbar. Bei
#   44 `boot()`-Aufrufen im Repo waren das **über 110 s reines Schlafen je vollem Prüflauf** –
#   `test_state` allein 17,5 von 18,5 s. **Wo eine Wartezeit im Code steht, gehört daneben die
#   Messung, gegen die sie gewählt wurde.**
#   ⚠️ **MEHR PARALLELITÄT WAR NICHT DIE ANTWORT.** Gemessen (2 Kerne, 6 jsdom-Suiten): fest+`-P 3`
#   11757 ms · fest+`-P 12` 8432 ms · **Polling+`-P 3` 5965 ms** · Polling+`-P 12` **6242 ms –
#   wieder langsamer.** Parallelität wirkte nur, WEIL die Suiten schliefen. Ohne das Schlafen ist
#   die Arbeit CPU-gebunden und `Kerne+1` ist bereits das Optimum. **Erst die Ursache messen, dann
#   skalieren** – sonst optimiert man den Puffer statt der Sache.
#
# ⚠️ **EINE KENNZAHL, DIE MAN NICHT ERKLÄREN KANN, IST NOCH KEIN BEFUND (30.07.2026).** Beim
#   Entdichten von START_PROMPT meldete die Kontrollzählung „Warnzeichen 93 → 68, ABWEICHUNG" und
#   sah nach Inhaltsverlust aus. Sie zählte **Symbole statt Warnstellen** – die Zahl der Stellen
#   war unverändert (68/68). **Bevor eine Abweichung gemeldet oder korrigiert wird: prüfen, ob das
#   Messverfahren das misst, was der Satz behauptet.**
#
# ⚠️ **REIHENFOLGE IN MESSSKRIPTEN: ERST FRAGEN, DANN PRÜFEN.** `umgebung.sh` prüfte den
#   `.git/index.lock`, **bevor** es selbst `git status` aufrief — also den Zustand vor der eigenen
#   Frage. Ergebnis am 28.07.: „nicht vorhanden (gut)", eine Sekunde später stolperte ein
#   `git status` über genau diesen Lock. Seit dem 28.07. umgedreht.
#
# ⚠️ **BEIM LÖSCHEN IMMER WAS UND WARUM IN DENSELBEN SATZ.** „ist entfernt" ist keine Erklärung.
#   Das gilt auch für vorab erlaubte Löschungen wie `.git/index.lock`.
#
# ⚠️⚠️ **EINE GEGENPROBE BRAUCHT SELBST EINE ZUSICHERUNG, DASS SIE STATTGEFUNDEN HAT (30.07.2026).**
#   Beim Gegenproben einer neuen Suite blieb der zweite von drei Sabotage-Läufen grün. Der Test sah
#   damit schwach aus – tatsächlich hatte die Ersetzung nie gegriffen (Einrückung), die Sabotage
#   war gar nicht im Code. **„Grün nach Sabotage" heisst zuerst: die Sabotage prüfen, nicht den
#   Test.** ►►► **Nicht mehr von Hand sabotieren – `bash tools/sabotage.sh` benutzen.** Es bricht
#   ab, wenn das Muster nicht GENAU EINMAL vorkommt, stellt die Datei per `trap` immer wieder her
#   und **kehrt das Urteil um: rc=0 nur, wenn die Suite ROT wird.** Grün ist der Fehlschlag.
#
# ⚠️⚠️ **BEI VERHALTENSPROBEN ERST DEN ISTWERT AUSGEBEN, DANN BEHAUPTEN (30.07.2026).** Eine
#   unabhängige Probe der neuen M09-Navigation meldete zwei Fehler – **beide lagen in der Probe:**
#     * Sie klickte blind ein zweites Mal auf `#btnAktion`. Der heisst nach dem Bewerten aber
#       „Nächste Aufgabe" – der Klick blätterte weiter, statt eine Doppelbuchung zu versuchen,
#       und der Folgetest lief auf der falschen Frage auf.
#     * Sie mass den Lösungszustand erst NACH der eigenen zweiten Antwort, die selbst ein `.fb`
#       erzeugt. **Gemessen wurde die eigene Testhandlung.**
#   Beides sah nach einem Codefehler aus. **Wer eine Beschriftung, einen Klassennamen oder einen
#   Messzeitpunkt annimmt, misst am Ende sich selbst.** Erst `console.log` des Istwerts, dann die
#   Behauptung – und den Messpunkt an die Stelle setzen, an der der Zustand entsteht.
#
