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
