# TASKLIST – AP1-Lernprogramm: ARBEITSREGELN UND WERKZEUGE
#
# ⚠️⚠️ **DIESE DATEI ENTHÄLT REGELN, KEINEN STATUS.** Wer wissen will, wo das Projekt steht, liest
# `START_PROMPT.md` und misst mit `git status`. Bis zum 27.07.2026 stand hier beides gemischt: der
# Kopf trug den Stand vom 20.07., darin **sieben** Behauptungen „NICHT GEPUSHT" über Versionen, die
# längst live waren, dazu „APP_VERSION 0.14.0" als Statusaussage.
# ⚠️ **SCHLIMMER: Regel 9 der Token-Sparregeln lautete „KEIN git im Projektordner … Versionierung
# stattdessen: Backup-Zip je Meilenstein".** Das galt im Juli 2026 für wenige Tage und ist seit
# v0.8.0 falsch – es wird committet, gepusht und getaggt. Eine Sitzung, die das glaubt, arbeitet
# grundlegend verkehrt. **Genau deshalb sind Status und Regeln jetzt getrennt.**
# Chronik (Blöcke A–F, „29 Ideen", G1–G5, FB-R1/R2/R3, M09-Projekt): **`TASKLIST_ARCHIV.md`**.
#
# ══════════════════════════════════════════════════════════════════════════════════════════════
# 0. MODELL & AGENTEN (neu gefasst 08.10.2026 nach offizieller Doku – ersetzt die Fassung 15.07.)
# ══════════════════════════════════════════════════════════════════════════════════════════════
# Quellen: code.claude.com/docs/en/sub-agents · code.claude.com/docs/en/best-practices ·
#   platform.claude.com/docs/en/about-claude/models/choosing-a-model ·
#   anthropic.com/engineering/multi-agent-research-system. Probe-Agent (Haiku) gemessen 08.10.
# - HAUPTCHAT (Opus): Briefing, Agenten anleiten, Integration, fachliche Pruefung, Tests, Commit,
#   Push. Code selbst bei Eingriffen <~50 Zeilen.
# - WANN EIN AGENT (offizielle Faustregel): eine abgeschlossene Nebenaufgabe, die den Hauptkontext
#   mit Suchtreffern, Logs oder Dateiinhalten fluten wuerde, die danach keiner mehr braucht, und die
#   eine Zusammenfassung liefern kann. NICHT bei viel Hin-und-Her, geteiltem Kontext, kleinen
#   gezielten Aenderungen oder wenn Wartezeit zaehlt. ►► Coding ist laut Anthropic schlecht
#   parallelisierbar – Code-Arbeit bleibt im Hauptchat.
# - ⚠️ KOSTEN: Mehr-Agenten-Arbeit braucht ~15× die Tokens eines Chats (Anthropic). Gemessen 08.10.:
#   EIN Haiku-Agent mit 2 Werkzeugaufrufen = 83 534 Tokens Grundlast. ►► Kein Agent fuer etwas, das
#   1–3 eigene Aufrufe erledigen.
# - MODELL-MATRIX (billigstes ausreichendes Modell, `model`-Parameter JE AUFRUF setzen):
#   * HAIKU 5.5 (offiziell empfohlen fuer „sub-agent tasks" und Massenarbeit): Web-Recherche,
#     Doku-Abgleich, Fundstellensuche, Fragen-Batches nach `prompts/fragen_batch.md` (muss
#     `tools/validate_batch.js` selbst gruen liefern; danach NUR fachlich pruefen).
#   * SONNET 5.5: Code-Entwuerfe mit Kontextbedarf (`prompts/feature_draft.md`,
#     `prompts/fragetyp_neu.md`) auf /tmp-Kopien, **NIE auf Projektdateien**.
#   * OPUS / inherit: nur Gegenpruefung (unten) und echte Architekturfragen.
#   ►► SEIT 26.11.2026 (BUILD_LOG 297) feste Projekt-Agenten in `.claude/agents/`: `recherche` (Haiku, nur lesen+Web),
#   `pruefer` (Opus, nur Read/Grep/Glob), `entwurf` (Sonnet, schreibt nur in die Kopie), `Explore` (ersetzt den eingebauten,
#   der sonst das Modell des Hauptchats erbt – Doku sub-agents). Diese statt `general-purpose` + `model` verwenden.
# - UMFANG SKALIEREN (Anthropic): Faktfrage = 0–1 Agent, 3–10 Aufrufe · Vergleich = 2–4 Agenten,
#   je 10–15 Aufrufe · grosse Recherche = mehr, mit klar getrennten Zustaendigkeiten.
#   Unabhaengige Agenten IN EINER NACHRICHT starten (laufen parallel).
# - AUFTRAG – vier Pflichtteile (sonst doppelte Suchen und Luecken): (1) Ziel, (2) Ausgabeformat MIT
#   Deckel („max. 15 Zeilen Liste, je Befund Quelle + Datum"), (3) Quellen/Werkzeuge, (4) Grenzen:
#   was NICHT. Der Agent sieht den Chat NICHT – der Auftrag muss allein verstaendlich sein.
#   Recherche: erst kurz und breit suchen, dann eingrenzen; Primaerquellen (Hersteller-Doku,
#   Gesetzestext, IHK) vor SEO-Seiten.
# - ⛔⛔ RECHTE – GEMESSEN 08.10.: DER HAIKU-AGENT HAT `Training_Shell__run` UND `device_bash`, also
#   Schreib- und Git-Zugriff auf den PC. Jeder Auftrag enthaelt woertlich: „nur lesen; keine Dateien
#   im Projekt schreiben, kein git, keine Training Shell mit Schreibwirkung". Schreiben, Commit, Push
#   macht NUR der Hauptchat. (14.10.: laut Doku duerfen Agenten seit v2.1.219 selbst Agenten starten, Tiefe 3 – darum steht „keine weiteren Agenten starten“ in jedem Auftrag, Skill agenten-orchestrierung.)
# - GROSSE ERGEBNISSE: der Agent legt sie auf der Cloud-Seite unter /tmp/agent_<thema>.md ab und gibt
#   nur Pfad + Kern (≤10 Zeilen) zurueck – nicht den Volltext durch den Hauptkontext reichen.
# - ⛔ VERIFIKATION (START_PROMPT Regel 4, ergaenzt 08.10. per Nutzer-Entscheid): ein Agent-Ergebnis
#   ist Entwurf oder Hinweis, NIE Beleg. ERLAUBT: ein Gegenpruef-Agent mit frischem Kontext sucht
#   Luecken eines Diffs gegen den Plan („nur Luecken mit Wirkung auf Korrektheit oder Anforderung,
#   keine Stilwuensche"). Jeder Fund wird SELBST nachgemessen (Suite, Diff, Rechnung), bevor er zaehlt.
#
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
# ══════════════════════════════════════════════════════════════════════════════════════════════
# 1. LOOP JE TASK
# ══════════════════════════════════════════════════════════════════════════════════════════════
#   umsetzen → **selbst** prüfen → BUILD_LOG + START_PROMPT + (bei Planänderung) PLAENE nachziehen
#   → bei Feature-Meilenstein APP_VERSION-Bump + CHANGELOG → **PAUSIEREN**.
# - NICHTS ungeprüft übernehmen: jeden Agenten-Entwurf fachlich prüfen (nachrechnen, Zitate checken,
#   Diff lesen) und alle Tests SELBST ausführen, bevor ein Task als fertig gilt.
# - ⚠️ **PUSH NUR NACH GRÜNEM `check.sh`, ÜBER DIE TRAINING SHELL, NIE `--force`** (seit 17.09. pusht der
#   Chat selbst – Regel: START_PROMPT Abschnitt 5). ⛔ **Ein `push.sh` gibt es seit dem 10.09. bewusst nicht mehr.**
# - Ein Version-Bump fasst DREI Stellen an: `app_state.js APP_VERSION`, `sw.js CACHE_VERSION`,
#   `CHANGELOG.md`-Abschnitt. Seit 27.07. bewacht das der Versions-Guard in `check.sh`.
#
# ══════════════════════════════════════════════════════════════════════════════════════════════
# 2. PRÜFPROTOKOLL JE TASK (Pflicht, alles selbst ausführen)
# ══════════════════════════════════════════════════════════════════════════════════════════════
# - **SITZUNGSSTART:** `bash tools/umgebung.sh` + `git status --porcelain`. Vor jeder Entscheidung.
# - **Pool-/Inhalts-Tasks:** Änderung NUR in `pool/*.json`, dann `node tools/pool_laden.js --pruefe`
#   (E40: `fragen.js`/`faelle.js`/`build_fragen.py` entfielen mit N29 Teil 2). Danach `validate_pool`, `idcheck`,
#   `validate_schema`, bei Fakten zusätzlich `python3 tools/fakten_check.py`.
# - **Schnelle Schleife:** `bash tools/suite.sh <name> [name …]` – baut das flache Arbeitsverzeichnis
#   selbst und hält gegen `sollwerte.env`.
# - **Voller Prüflauf (vor jedem Release):** `bash check.sh block start` → `weiter` (wiederholen, bis
#   „ALLE ERLEDIGT") → `ende`. ⚠️ Der volle `bash check.sh` passt NICHT in die 45 s der Sandbox.
#   Nichts selbst nachbauen, nichts in den Hintergrund schieben – beides ist erprobt gescheitert.
# - **Neue Fragen:** fachliche Einzelprüfung JEDER Frage, kanonisches `thema` (Keys von
#   `L.THEMA_RELEVANZ`), `gebiet` laut `L.THEMA_GEBIET`, keine ID-Kollision, **kein Längen-Tell**.
#   Einsortieren über `tools/apply_batch.py` (prüft das per `assert`).
# - **Jeden neuen Test GEGENPROBEN** – eine Zusicherung, die nie gefallen ist, ist unbewiesen.
#
# ══════════════════════════════════════════════════════════════════════════════════════════════
# 3. TOOLING-FALLSTRICKE (kosten sonst Stunden – jeder hier ist mindestens einmal passiert)
# ══════════════════════════════════════════════════════════════════════════════════════════════
# - **45-s-LIMIT je bash-Aufruf.** Hintergrund-Prozesse (`nohup`, `&`) STERBEN am Aufruf-Ende.
#   Deshalb der Block-Modus von check.sh. Nicht umgehen wollen.
# - **MOUNT-TRUNCATION:** Nach File-Tool-Edits zeigt der bash-Mount die Datei zeitweise abgeschnitten.
#   `check.sh` hat dafür einen AUTO-WAIT (~40 s). Hilft das nicht: Workspace-Neustart.
# - **/tmp wird bei Workspace-Neustarts GELEERT.** jsdom/ajv/axe-core liegen persistent in `.tooling/`
#   (gitignored).
# - ⚠️ **Der node_modules-Spiegel MUSS auf `/node_modules` enden.** jsdom zieht über parse5 echte
#   ESM-Importe, und deren Auflösung ignoriert `NODE_PATH` vollständig – sie sucht nur in
#   Verzeichnissen, die `node_modules` HEISSEN. (`tools/suite.sh` macht das richtig.)
# - ⚠️ **Suiten laufen NUR im flachen Arbeitsverzeichnis**, nicht aus `tests/` heraus – die
#   require-Pfade sind relativ. Und `lernprogramm_ap1.html` muss dort **`app.html`** heißen.
# - **Tabellen-DOM: NIE `el("<tr>…")`** – der HTML-Parser verwirft tr/td außerhalb einer Tabelle und
#   liefert `null`. Immer `document.createElement`. (Zweimal gefixt, jetzt per Guard bewacht.)
# - **Encoding:** Kernfiles sind valides UTF-8; `file`/`grep` melden im C-Locale fälschlich „binary".
#   ⚠️ Bei „binary file matches" auf einer .js/.md trotzdem NIE weiterarbeiten, erst prüfen:
#   `python3 -c "print(open(F,'rb').read().count(b'\x00'))"` – `app_seiten.js` hatte ein NUL-Byte.
# - **Feldnamen, die regelmäßig verwechselt werden:** Schwierigkeitsstufe heißt `schwierigkeit`
#   (nicht `stufe`); `mehrfach` nutzt `loesungIndizes`, `mc` nutzt `loesungIndex`;
#   Statistik-Schlüssel `S.statistik["T:"+modul+":"+thema]`.
# - **Deutsche Anführungszeichen in JSON-Batches:** `„…"` mit geradem Schlusszeichen macht die Datei
#   ungültig. Das schließende Zeichen ist `“`. (`tools/apply_batch.py` meldet das.)
# - **Löschen scheitert am Mount** („Operation not permitted") → `allow_cowork_file_delete`.
#   Das gilt auch für ein verwaistes `.git/index.lock`, das `git add` blockiert.
#
# ══════════════════════════════════════════════════════════════════════════════════════════════
# 4. TOKEN-SPARREGELN (verbindlich ab 2026-07-12, Nutzer-Freigabe – gekürzt auf das noch Gültige)
# ══════════════════════════════════════════════════════════════════════════════════════════════
# 1. **Neuer Chat pro Task-Block.** Frischstart mit START_PROMPT.md ist billiger als ein langer Chat,
#    der den ganzen Verlauf mitschleppt.
# 2. **Modellwahl je Agent: NUR Abschnitt 0** (Matrix, Umfang, Rechte, Auftrag).
# 3. **Entscheidungsfragen bündeln:** alle Vorab-Fragen eines Blocks in EINE AskUserQuestion-Runde.
# 4. **Agenten-Selbstvalidierung:** Agent bekommt ein Prüfskript mit und muss es grün liefern.
# 5. **grep statt Read** zum Lokalisieren (Anker in `ARCHITECTURE.md`); Read nur für den exakten
#    Editierbereich; Testausgaben immer mit `| tail` kürzen.
# 6. **`tools/pool_query.js` nutzen** statt ad-hoc Node-Einzeiler
#    (themen, typen, frage <id>, ohne <feld>, ids-frei <präfix>, duenn, stufe, suche <regex>, coverage).
# 7. **Agent-Prompts über `prompts/`-Vorlagen**; Vorlagen + ARCHITECTURE.md + tools/ vorher nach /tmp.
# 8. **Schema referenzieren statt zitieren.**
# 9. **Web-Recherche: Haiku-Agent nach Abschnitt 0** – nur das Extrakt in den Hauptkontext.
# 10. **Checkpoint VOR großen Agenten-Aufrufen**, nicht nur danach.
# 11. **Doku-Deckel:** BUILD_LOG nach jedem Release rotieren; START_PROMPT und TASKLIST werden
#     ÜBERSCHRIEBEN, nicht ergänzt. Chronik gehört ins jeweilige `*_ARCHIV.md`.
#     ⚠️ **GESTRICHEN am 27.07.: die alte Regel 9 „KEIN git im Projektordner, Versionierung per
#     Backup-Zip".** Sie galt wenige Tage im Juli 2026 und ist seit v0.8.0 falsch. Backup-ZIPs
#     werden nicht mehr gezogen; es gilt git + GitHub-Release-Action.
# 13. **AUFRUFE SIND DER GROSSE POSTEN, NICHT DIE AUSGABEN – GEMESSEN 08.10.2026 (Sitzungsauswertung, BUILD_LOG 103):**
#     Gewichtet ≈ 2,5 Mio. Tokens: **50 % Grundanweisungen** (Systemtext + Werkzeug- und Skill-Liste,
#     122 000 Tokens schon in Runde 1, bei JEDEM Schritt neu gelesen), 85 Runden, davon **31 reine
#     Warte-Abfragen** auf `check.sh`. Ein Haiku-Probeagent (2 Aufrufe) ≈ 346 000 – mehr als die ganze
#     Web-Recherche (139 000). ►► Daraus:
#     * **`bash check.sh doku`** fuer Commits, die NUR `*.md` / `tools/plugin/` aendern (Pfad-Tor; spart
#       ~8 Warte-Runden je Lauf). Alles andere: voller Lauf wie bisher.
#     * **Alle Aenderungen erst fertig, dann EIN Pruflauf, EIN Commit** – am 08.10. waren es drei Runden.
#     * **Warte-Zeit mit Arbeit fuellen** (Commit-Nachricht, Doku vorbereiten AUSSERHALB des Repos), nie leer abfragen.
#     * **Kein Agent fuer 1–3 Abrufe** – ein direkter WebFetch ist billiger als die Grundlast eines Agenten.
#     * **Ungenutzte Plugins/Connectoren im Konto aus** (bio-research, data, Agensi, Asana, Slack, Notion,
#       ToolUniverse): die Skill-Liste allein kam 6× à ~29 000 Zeichen in den Verlauf. Macht der Nutzer.
# 12. **AUSGABEN KLEIN HALTEN – GEMESSEN 17.09.2026 (Werkzeug-Runde, BUILD_LOG):**
#     * **vitest:** `NO_COLOR=1 npx vitest run <pfad> --reporter=dot` – 11 729 → 437 Zeichen
#       (−96 %), Ergebnis vollständig. Ohne `NO_COLOR` stehen Farbcodes (`\x1b[32m`) in jeder Zeile.
#     * **`ci2.sh`** zeigt seit 17.09. nur die Kurzfassung (17,2 → 1,7 KB); `ci_log.txt` bleibt
#       vollständig, `CI2_VOLL=1 bash ci2.sh` zeigt alles.
#     * **RTK** (`rtk.exe`, v0.48.0, per winget, Telemetrie AUS) ist installiert, **aber OHNE Hook**:
#       ⛔⛔ **`rtk vitest` VERSCHLUCKT DAS TESTERGEBNIS** („All parsing tiers failed", Ausgabe ohne
#       Zahlen) und legt `neu/.vitest/` im Baum an. Ein Hook würde jeden vitest-Aufruf so umschreiben.
#       Gewinn nur bei `rtk git status` (189 → 23); `git log`, `grep`, `tsc` unverändert.
#       Pfad: `$LOCALAPPDATA/Microsoft/WinGet/Packages/rtk-ai.rtk*/rtk.exe` (erst nach Shell-Neustart im PATH).
#     * **Graphify** (graphifyy 0.9.63) ist GEMESSEN UND VERWORFEN: der Code-Graph kennt **169 von
#       195 benannten Importen nicht** – er löst den Alias `@/` nicht auf. ⛔ Nicht erneut vorschlagen.
#     * **TypeScript-LSP** (Plugin `typescript-lsp`, `typescript-language-server` 6.0.0 global) wirkt
#       **nur in Claude Code im Terminal**, nicht in Cowork (dort laufen Befehle über die Brücke).
#       Gemessen 17.09. (`claude -p`, angemeldet): ⚠️ **Claude Code IN `neu/` starten** – im Wurzelordner
#       findet der Server kein TypeScript. ⚠️ Das Werkzeug ist ZURÜCKGESTELLT (erst per ToolSearch laden).
#       ⛔ **`findReferences` sah 2 von 4 Stellen** von `distraktoren`: die Testdateien sind ein eigenes
#       tsconfig-Projekt (`tsconfig.test.json`). **Für „alle Verwendungen" zusätzlich `grep`.**
#     ⚠️ **Hooks aus `.claude/` greifen in Cowork nicht** – dort zählt nur, was im Befehl selbst steht.
#
# ══════════════════════════════════════════════════════════════════════════════════════════════
# 5. WO STEHT WAS
# ══════════════════════════════════════════════════════════════════════════════════════════════
# ⚠️⚠️ **DIE VOLLSTÄNDIGE DATEIÜBERSICHT STEHT IN `START_PROMPT.md` ABSCHNITT 7, DIE WERKZEUGE IN
#   ABSCHNITT 8. HIER STEHT SIE SEIT DEM 28.07. NICHT MEHR.**
#   Grund: Es gab beide Listen, und **beide sagten „BUILD_LOG ab v1.7.0", als längst bis v1.11.0
#   rotiert war.** Zwei Listen für dieselbe Sache driften – dieselbe Ursache wie bei den zwei
#   Kopierlisten von `check.sh` und `tools/suite.sh` (am selben Tag auseinandergelaufen).
#   **Wer hier etwas nachtragen will, trägt es in START_PROMPT nach.**
#
#   Nur das, was ausschließlich diese Datei betrifft:
#   `TASKLIST_ARCHIV.md` ..... **Chronik dieser Datei**: Blöcke A–F, „29 Ideen", G1–G5, FB-R1/R2/R3,
#                              das M09-Unterrichtsprojekt. Gezielt nachschlagen, nicht am Stück lesen.
#                              ⚠️ Statusaussagen dort sind ÜBERHOLT (siehe Kopf).
#   `ARCHITECTURE.md` ........ Fragen-Schema, Modulaufbau, Anker für grep
