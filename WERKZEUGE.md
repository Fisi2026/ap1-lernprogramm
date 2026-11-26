# WERKZEUGE – was es schon gibt, bevor man es nachbaut

⚠️ **WOZU DIESE DATEI.** Bis zum 17.09.2026 war das Abschnitt 8 von `START_PROMPT.md`. Er ist
**verbatim** hierher verschoben (`tools/rotiere.py`, Gegenprobe 0). **Vor jedem neuen Mess- oder
Hilfsskript hier nachsehen** – am 28.07. entstanden acht Wegwerf-Skripte, eines zählte falsch.
⚠️ Verweise auf „Abschnitt 1/2/6" meinen `START_PROMPT.md`; die Lehren aus Abschnitt 6 stehen seit 11.10.2026 in `regeln/*.md` (`LEHREN.md` ist das Verzeichnis).

## Ausgelagert aus START_PROMPT.md am 2026-09-17 (verbatim, rotiere.py)

### aus START_PROMPT.md, Zeilen 368-463 der Ur-Fassung

# ⚠️ **`tools/pool_query.js` NUTZEN STATT AD-HOC NODE-EINZEILER** (TASKLIST-Sparregel 6; sie steht
#   hier, weil gelesen wird diese Datei). Am 28.07. acht Wegwerf-Skripte, **eines zählte falsch**.
#   ► **VOR JEDEM MESSSKRIPT: `node tools/pool_query.js` OHNE ARGUMENT AUFRUFEN** – druckt seit
#     10.09. das Kommandoverzeichnis aus dem EIGENEN Kopf (vorher eine Zeile Fehlermeldung, rc 1).
#     ⚠️ **`stufe` braucht sein Argument `<1-4>`** – ohne filtert es auf NaN und meldet NICHTS.
#
#   `node tools/pool_query.js laengen [modul]` .. Tell-Treffer UND überlange Distraktoren, je mit
#                              Zielfenster in Zeichen. Gleiche Quelle wie die Wächter.
#   `node tools/pool_query.js frage <id>` ...... eine Frage komplett als JSON
#   `node tools/pool_query.js suche <regex>` ... IDs, deren JSON auf das Muster passt
#   `node tools/pool_query.js ohne <feld>` ..... Fragen ohne dieses Feld · `coverage`, `themen`,
#                              `typen`, `stufe`, `duenn`, `idcheck`, `freeids` – Kopf der Datei lesen
#   `node tools/pool_query.js verweise [modul]` . E2-Zählung + Matrix thema→Abschnitt (E3-Lauf)
#   `node tools/probe_lernfluss.js <kopie> [sitz] [fragen] [--antworten q] [--kette] [--gewichte]`
#                              **Was der Lerner in einer Sitzung sieht:** Themen-, Typ-, Stufen- und
#                              Wiedersehensverteilung über die ECHTE `naechsteFrage()`, geseedet.
#                              ⚠️ **`--gewichte` umhüllt `L.gewichteFrage`** – zeigt, was ein Modul drückt.
#                              ⚠️ **Der LERNWEG steht in „mittlere Stufe JE SITZUNG" und in den
#                              erreichten Themenstufen** – nicht in „erste/letzte 10" (die mitteln
#                              INNERHALB einer Sitzung, s. Abschnitt 6). Neu 10.09.
#                              ⚠️ **`--ohne-relevanz` ist die Gegenprobe zu Abschnitt 1:** ohne
#                              Relevanzgewichtung fallen alle Modul-Abweichungen auf ±0,3 zusammen.
#   `python3 tools/e3_gegenprobe.py [--alle|--e2|--streng]` . **Gegenprobe zu Verweisen:** kommt ein
#                              Stichwort des Verweistextes im Zielabschnitt vor?
#                              ⚠️ **`--streng` (31.08.): JEDES fehlende Stichwort, nach BEGRIFF
#                              aggregiert** – der Vorgabelauf meldet nur Fragen ohne JEDEN Treffer
#                              und übersah so B90. Ohne `--alle` nur `tools/migration/e3_*.json`.
#                              ⚠️ **Kalibriert 24.08.** – unkalibriert meldete es 55 statt 19 Fälle.
#   `python3 tools/verweis_nachbar.py [--datei X.js]` . **zeigt ein Verweis ins NACHBARKAPITEL?**
#                              Wortgenau (kein 6-Zeichen-Stamm), meldet nur, was im Ziel fehlt UND
#                              in einem anderen Abschnitt derselben Datei steht. ⛔ **Kein Wächter**
#                              (78 Fehlalarme auf 4 Befunde, B146) – Handwerkzeug vor Verweis-Runden.
#   `python3 tools/verweis_setzen.py --batch <datei> [--trocken]` . **`verweis`-Felder setzen** –
#                              Rezept eingebaut. **Nie von Hand nachbauen.**
#   `node tools/pool_query.js kontext <re> [n]` . wie `suche`, aber MIT UMFELD – legt dieselbe
#                              Sachaussage aus mehreren Fragen nebeneinander (26.08.).
#   `node tools/pool_query.js zufall` ....... rechnet jede `rechenassistent`-Aufgabe deterministisch
#                              durch; meldet negative/ungültige Zwischenergebnisse. `check.sh` 4e5.
#   `node tools/pool_query.js zitate` ....... **Gesetzeszitate** (Text in Anführungszeichen neben
#                              einer Paragrafenangabe) gegen `zitate_belegt.json` UND Absatzangaben
#                              zu Vorschriften ohne Absätze. Quelle für `check.sh` 4e4 (26.08.).
#   `python3 tools/opt_ersatz.py --zeige <id>` . Optionslängen + Zielfenster einer Frage
#   **Antwortoptionen ändern NUR über `tools/opt_ersatz.py`** (Rohtext-Ersatz, alter Wert wird aus
#   dem Pool gelesen statt abgetippt, Längenfenster-Prüfung VOR dem Schreiben, kein `json.dump`).
#   `node tools/pool_query.js begriffe` . **Fachbegriffe, die schon einmal gegensaetzlich benutzt
#                              wurden**, gegen `begriffe_belegt.json`. Quelle fuer `check.sh` 4e6 (27.08.).
#   `… pool_query.js abdeckung`  welche Pruefung liest welchen Inhaltstraeger, gegen
#                              `inhaltstraeger.json`. Zaehlt jedes „gelesen" NACH. `check.sh` 4e7.
#   `… pool_query.js verrat` ... dropdown-Luecken, deren Loesungswort im Aufgabentext steht.
#   `… pool_query.js antworttell [k3]` mc/mehrfach/szenario2: A Echo, B Klammer, D themenfremde Falschantwort (K3-E66, Waechter 4e16).
#                              **Kandidatenfilter, kein Urteil**, ohne Ausnahmeliste. `check.sh` 4e8.
#   `… pool_query.js svg` ..... A wohlgeformt · C in der Zeichenflaeche · D Klickflaeche deckt den
#                              Kasten (alle FEHLER) · B Textueberlauf (HINWEIS). `check.sh` 4e9.
#   `tools/svg_bilder.py` .... Kontaktbogen: `<MODUL> --von n --bis m` oder `--id A,B`.
#   `tools/svg_breiter.py` · `tools/svg_linien.py` .. Grafik dehnen (⛔ bei `zonen` die Klick-
#                              flaechen MITZIEHEN) bzw. `<line>` vor die Kaesten legen.
#                              Abzaehlen. ⚠️ Bei „Cannot find module": `rm $SPIEGEL/.spiegel_stempel`.
#   `tools/work_dateien.sh` .. die EINE Kopierliste für das flache Testverzeichnis; `check.sh` und
#                              `tools/suite.sh` sourcen sie beide. Wer eine Datei ergänzt, ergänzt
#                              sie hier – **nicht in den Skripten.**
#   `tools/umbau_laeufe.sh` .. N51 A2 (12.10.): die vier teuren Laeufe von 4f_umbau (tsc, oxlint,
#                              vitest, Bau) EINMAL definiert; `check.sh` voll/neu startet sie nach den
#                              Vorpruefungen im Hintergrund, 4f_umbau holt ab (`umbau_hole`). Kein .rc
#                              = rot (125). `CHECK_SERIELL=1` = wie vorher nacheinander (Fehlersuche).
#   `python3 ../Buch/_aufbereitung/buch.py` .. Lehrbuch **LF1-5** nachschlagen (gliederung · wo ·
#                              seite · bild · suche · stichwort · check). **`buch.py pruefen` vor
#                              jeder Runde** - es fing eine Seitenverschiebung um 1.
#                              ⚠️ **LF6-9 und LF10-12 sind seit 10.09. aufbereitet** (eigener Weg:
#                              `aufbereiten_buch.py`, `LIESMICH_FACHSTUFE.md`) - **`buch.py` kennt
#                              sie NICHT.**
#   `bash tools/prueflauf.sh` .. **voller `check.sh` MIT Zeitmessung** – nennt danach den Weg fuer
#                              den Rest der Sitzung (voller Lauf oder Block). `--stand` zeigt den
#                              Messwert. ⚠️ Er liegt in `/tmp`: **sitzungsfluechtig, mit Absicht.**
#   `python3 tools/rotiere.py <spec.json> [--setze]` .. **Steuerdatei rotieren:** Bloecke verbatim
#                              ins Archiv, Ersatztext in den Kopf, **Gegenprobe eingebaut** (jede
#                              nicht leere Zeile muss im Archiv ODER im neuen Kopf stehen).
#                              ⛔ **Schreibt nie bei Verlust.** Loest die Handarbeit vom 03./04.09. ab.
#   `bash tools/umgebung.sh` . Umgebungsbefund (meldet auch, ob der Spiegel WARM oder KALT ist)
#   `python3 tools/befunde_index.py --pruefe --setze` .. erzeugt `BEFUNDE_INDEX.md`; `waechter_zusicherung.py` prueft die Pool-Waechter
#   `bash tools/start.sh --neuer-chat <konto>` .. **DER CHAT-START IN EINEM AUFRUF:** Umgebung,
#                              Baum, Log, Remote, ungepusht, CI-URTEIL, Wache, "Damit offen";
#                              Waermen im Hintergrund. ⛔ **Ohne `--neuer-chat` startet er die
#                              Wache NICHT** - ein Probelauf mitten im Chat setzte sie sonst auf 0.
#   `bash tools/einrichten.sh [--pruefen]` .. **EIN RECHNER FUER DIESES PROJEKT (26.09.):** DIE eine
#                              Liste - Programme, python3 (AUSGEFUEHRT), Git-Identitaet (vom letzten
#                              Commit), Zeilenenden, gh-Anmeldung, `.tooling` + `neu/node_modules` wie
#                              die CI, Training Shell = Repo-Fassung, `../Buch`. rc = Zahl der OFFENEN
#                              Punkte. Ohne `--pruefen` richtet es ein, was ohne Nutzer geht.
#                              `umgebung.sh` fragt es ab, statt eine zweite Liste zu fuehren.
#   `tools/einrichten.ps1` .. **DER WINDOWS-TEIL DAVOR** (winget python/node/jq, `gh auth login`,
#                              dann `einrichten.sh`). Aufruf: `powershell -ExecutionPolicy Bypass -File
#                              tools\einrichten.ps1`. Die vier Befehle VOR dem Klon stehen im
#                              claude.ai-Projekt „Training" (vorher gibt es kein Repo).
#   `python3 tools/abschnitt.py <datei> <marke> [--bis M] [--max N]` .. nur EINEN Abschnitt
#                              ausgeben, statt eine Steuerdatei ganz zu lesen. Kein Treffer ->
#                              rc=2 und die Liste der Ueberschriften. ⛔ `regeln/*.md` ausgenommen.
#   `bash tools/ci_warte.sh [sha]` .. wartet IM HINTERGRUND auf die CI **dieses Commits** und
#                              schreibt eine Zeile nach `_to_delete/helfer/ci.urteil`. Ersetzt die
#                              Abfrage-Schleife. Fehlt die Datei, wartet er noch.
#   `bash tools/umzug_v3_probe.sh [--probe|--voll|--arbeitsbaum|--ausgabe <dir>]` .. Generalprobe N40 V3 OHNE Netz: Baum aus `git archive HEAD`
#                              als EIN Commit von ap1 in einem Temp-Repo, Pruefung (Autor, Sperrliste, Fremdtext, Gmail, Pfad, Token,
#                              Groesse, Waechter 4e14); `--probe` = 11 Faelle mit bekannter Antwort. Nie pushen. Ablauf: `PLAN_UMZUG_V3.md`.
#   `python3 tools/einstieg.py --setze|--pruefe` .. erzeugt `EINSTIEG.md` (~3 KB) aus
#                              START_PROMPT und BUILD_LOG; `check.sh` 4f-einstieg haelt es buendig.
#   `python3 tools/rohe_elemente.py [--selbsttest]` .. **P7-Waechter des Neubaus** (`check.sh` 4f-roh):
#                              rohe `<input|button|…>` in `neu/src` ausserhalb `components/ui` gegen
#                              `neu/rohe_elemente.json`; rc 0/1/2 = gruen/rot/STUMM, verwaiste Ausnahme = rot.
#   `node tools/trennschaerfe.js [ID …]` .. **WARUM eine fremde Musterloesung durchrutscht:** je
#                              Opfer die durchrutschenden IDs (`*` = DASSELBE Feinthema), was sie je
#                              Pflichtgruppe treffen, und Kandidatenwoerter der eigenen Loesung.
#                              ►► **`--probe <datei>` rechnet Vorschlaege durch, OHNE den Pool
#                              anzufassen** – beliebig viele je Aufruf, mit den Azubi-Antworten aus
#                              `mess_freitext.js`. **Erst messen, dann schreiben.** Gegenprobe drin.
#   `python3 tools/schluessel_setzen.py --id <ID> --pflicht '<json>' [--kuer]` .. `schluesselbegriffe`
#                              setzen: **Rohtext-Ersatz**, Einrueckung aus dem Block abgeleitet,
#                              Schema- und Feld-fuer-Feld-Gegenprobe VOR dem Schreiben.
#                              ⛔ **`--nullprobe` zuerst** (schreibt unveraendert zurueck, `git
#                              status` muss leer sein) – sie fand 09.09. drei Bestandsabweichungen.
#   `bash tools/suite.sh <name> …` einzelne Suiten · `--waermen` einmal je Sitzung (s. Abschnitt 1)
#   `node tools/schnappschuss.js --pruefe|--setze|--zeige <route>` .. **STRUKTUR aller Screens**
#                              (19, jsdom, geseedet) – faengt still verschwundene Elemente, die
#                              Luecke der 45 Suiten. ⛔ Kein Aussehen. ⚠️ **Erst die Zeilen lesen,
#                              dann `--setze`** – sonst ist es kein Netz, sondern eine Gewohnheit.
#   `python3 tools/wache.py start --konto <name> | aufgabe|tick|stand|abschluss|konto|selbsttest`
#                              .. **KASSENBUCH FUER DEN
#                              KONTEXTVERBRAUCH EINES CHATS** (18.09.2026). Misst die BYTES der
#                              Bruecken-Ausgaben (`letzte_ausgabe.txt`) und die Runden; alles
#                              andere ist ein GENANNTER Zuschlag, keine Messung.
#                              **Regel:** verbraucht + Reserve + Rest der Aufgabe > Budget -> wechseln.
#                              ⚠️ `tick` wird an Aufrufe ANGEHAENGT, die ohnehin stattfinden, und
#                              SCHWEIGT, solange nichts zu melden ist. ⛔ Meldet es STUMM, misst es
#                              gerade nichts - dann den Grund beheben, nicht weiterarbeiten.
#                              Selbsttest laeuft in `check.sh` 4e11 mit; Historie: `tools/wache_historie.json`
#                              (⛔ NICHT in den Wurzelordner - eine .json dort geht an den Lerner).
#                              ►► **`konto --sitzung <p> --woche <p> [--reset-sitzung Z]
#                              [--reset-woche Z]`** verbucht eine ABLESUNG des Nutzers aus
#                              Einstellungen → Nutzung (18.09.2026). **ZWEI Ablesungen ergeben
#                              den KURS** in Prozent je 1000 Tokens; ⛔ **aus EINER folgt keiner** -
#                              das Werkzeug sagt es, statt einen zu erfinden. Zweite Regelzeile:
#                              Stand + (Rest + Reserve) x Kurs > 100 % -> Alarm. **Es gewinnt, was
#                              zuerst anschlaegt** (Kontext oder Konto). ⛔ **Beim Konto-Alarm
#                              hilft KEIN neuer Chat** - der Topf ist geteilt: sichern, Aufgabe
#                              teilen oder auf nach dem Reset verschieben. Der Kurs ueberdauert
#                              den Chat (`tools/wache_konto.json`) und wird nur MIT Datum und
#                              Herkunfts-Chat benutzt. ⚠️ Drei Grenzen stehen in JEDER Ausgabe:
#                              der Balken zaehlt andere Chats mit · der Kurs gilt nur bei
#                              aehnlichem Tempo · jede Ablesung ist eine Momentaufnahme.
#   ⛔⛔ **DIE KLADDE IST SEIT 21.09. DER MESSPUNKT, `tick` NUR NOCH DER MELDER.**
#                              Der Bruecken-Server haengt je Aufruf eine Zeile an
#                              `_to_delete/helfer/ausgabe_kladde.log`; die Wache liest ab einem
#                              gemerkten Byte-Versatz und zaehlt damit **vollstaendig, egal wann
#                              `tick` laeuft**. ⚠️ Fehlt die Kladde, faellt sie auf den alten Weg
#                              zurueck und **sagt es einmal je Chat** - dann ist die Zahl eine
#                              UNTERGRENZE. Abhilfe: `bash tools/training-shell/einspielen.sh`,
#                              **danach App neu starten**. `stand` nennt die Quelle.
#                              ⚠️ **Seit 21.09. (N24-Befund) zaehlt die Kladde auch die RUNDEN**
#                              (eine Zeile = ein Aufruf), `aufgabe`/`abschluss` verbuchen VORHER,
#                              und `start` beginnt am heutigen ENDE der Kladde.
#   `python3 tools/wache_sabotage.py` .. **DIE GEGENPROBE ZUR WACHE** (22 Sabotagen, Nullprobe
#                              vorher und nachher). ⛔ **Nicht parallel zu `check.sh` fahren** -
#                              sie aendert `tools/wache.py` waehrend des Laufs. Ein `check.sh`,
#                              das dabei laeuft, misst einen Zufall; sein Gruen ist kein Messwert.
#                              ⛔⛔ **ZWEI KONTEN AM SELBEN ARBEITSBAUM** (gmail, web.de – Nutzer
#                              18.09.). Die Kurse liegen **je Konto getrennt**; der Chat sagt beim
#                              Start, auf welchem er sitzt: **`start --konto <name>`**. ⛔ **Ohne Namen
#                              wird KEIN fremder Kurs übernommen und keiner gespeichert** – ein
#                              vergessenes Flag ergibt „kein Kurs“, nie einen falschen. Die
#                              Etappen-Historie bleibt **gemeinsam**: Kosten hängen an der Aufgabe.
#   `tools/training-shell/` ... **DIE QUELLE DES BRÜCKEN-SERVERS** (18.09. aus `_to_delete/` geholt –
#                              dort war sie nicht versioniert). `index.js` + `manifest.json`,
#                              `probe.py` (Gegenprobe über echtes JSON-RPC, **44 Proben seit 1.1**),
#                              `einspielen.sh` (prüft, packt .mcpb, kopiert in die Erweiterung;
#                              `--nur-packen` für einen frischen Rechner - dort MANUELL in der App
#                              installieren, ein Doppelklick öffnet nur einen Chat, gemessen 26.09.).
#                              **Fassung 1.1 (26.09.):** Kopfzeile `SERVER=<fassung>/<sha8>` + Warnung
#                              `⚠️ FASSUNG`, wenn das Repo abweicht · Läufe über 50 s gehen SELBST in den
#                              Hintergrund (`auto-…`, abholen mit `warte.sh`) · Kladde bucht die
#                              ANGEKOMMENE Länge (`voll=` daneben) · `info` misst die Umgebung ·
#                              Projektordner fällt auf `<Benutzer>\Claude\Projects\Training` zurück.
#                              ⛔ **Nach dem Einspielen MUSS die App neu gestartet werden**, sonst
#                              läuft die alte Fassung weiter und niemand merkt es.
#                              ⚠️ Er lehnt Befehle über 4000 Zeichen ohne `#ENDE` ab – s. Abschnitt 2.
#   `bash tools/gitc.sh <git-argumente>` .. git OHNE Sperren-Reibung: räumt index/HEAD.lock VOR und
#                              NACH dem Aufruf weg. **26.08.: 47 Git-Aufrufe für 9 Commits.**
#                              **`push` nur mit Stempel** (N49 W2): `tools/check_stempel.sh pruefe`.
#                              **Push gescheitert + Wirkung ungepusht** (N51 A4): Standzeile per
#                              Folge-Commit auf 'PUSH OFFEN' (nicht gepusht).
#   `python3 tools/standzeile.py vorab|offen|--probe` .. N51 A4 (12.10.): Auslieferungs-Zeile setzen.
#                              `vorab` = LIVE = committet = neu/package.json · PUSH DURCH (vor check.sh;
#                              rc 3, wenn schon Wirkung ungepusht liegt) · `offen` = LIVE aus origin/main.
#   `bash tools/check_stempel.sh baum|pruefe` .. Push-Sperre: gruener `check.sh` (voll/doku) stempelt den
#                              Baum, push nur wenn HEAD ihn traegt. Selbsttest `tools/test_check_stempel.sh`.
#   `cd neu && MESSUNG=1 npx vitest run src/messung` .. N48-Befundliste (P1 Rundlauf, P2 Laengen-Tell)
#                              nach `_to_delete/helfer/n48_befunde.json`; ohne MESSUNG uebersprungen.
#   `bash check.sh block start|weiter|ende` .. voller Prüflauf in Sandbox-Häppchen (~6 Aufrufe)
#   `bash tools/sabotage.sh --datei F --suite N --alt M [--neu E]` .. **GEGENPROBE IN EINEM AUFRUF.**
#                              Muster muss GENAU EINMAL passen · `trap` stellt die Datei IMMER
#                              wieder her · **rc=0 nur bei ROTER Suite** (1 = unbemerkt, 3 = Muster).
#   `python3 tools/sabotage_vt.py --datei F --alt M [--neu E] --test PFAD [--nullprobe]` ..
#                              **DIESELBE GEGENPROBE FUER VITEST (N30, 22.09.).** Pfade relativ zu `neu/`.
#                              Muster genau 1x · binaer gelesen/geschrieben · SHA-1 davor = danach.
#                              rc 0 = ROT (bestanden) · 1 = gruen/unbemerkt · 2 Aufruf · 3 Muster ·
#                              4 Wiederherstellung · **5 = KEIN TESTLAUF** (Transform-/Importfehler, keine
#                              roten Tests gezaehlt) · 6 Nullprobe schon rot · **7 = Absturz** (eigener
#                              Wert: ein Python-Absturz endet sonst mit 1 = „unbemerkt", gemessen 22.09.).
#   `bash tools/hinter.sh [--neu] <name> <befehl>` · `bash tools/warte.sh <name> [sek<=50] [zeilen]`
#                              .. **DAS NOHUP-REZEPT ALS WERKZEUG (N30).** Ausgabe/Marke unter
#                              `_to_delete/helfer/<name>.txt|.fertig`; alte Marke wird VOR dem Start
#                              geleert, Doppelstart = rc 3. `warte.sh` gibt den rc DES LAUFS zurueck,
#                              124 = laeuft noch; sek > 50 wird abgelehnt, nicht gekappt.
#                              ⚠️ Der Befehl laeuft in einer eigenen inneren bash - `exit` darin
#                              verschluckte sonst die Marke (Gegenprobe 22.09. fand es).
#                              ►► **Seit Training Shell 1.1 (26.09.) nur noch für BEWUSST benannte
#                              Läufe** - alles über 50 s schiebt der Server selbst in den Hintergrund
#                              (`auto-<zeit>-<pid>`), `warte.sh` liest dieselben Dateien.
#   `bash tools/release.sh <x.y.z> --text <datei> [--trocken]` .. **N25 Punkt 9 BIS VOR DEN COMMIT
#                              (N30):** Bump app_state/sw/CHANGELOG/Standzeile „PUSH OFFEN" + EINSTIEG,
#                              DANN `v2/` bauen, `git add`, Buendel traegt neue Version und nicht die
#                              alte. `--trocken` = nur Diff. `--nur-buendel <v>` = nur die Pruefung.
#                              ⛔ Kein Commit, kein Push; den Bump erfragt der Chat. Mit Bau > 60 s:
#                              ueber `hinter.sh`. ⚠️ Der Minifier setzt Backticks (`1.38.1`).
#   `tools/sichtpruefung/` ... **DIE SICHTPRÜFUNG IM ECHTEN BROWSER** (21.09. aus `_to_delete/`
#                              geholt – dort war sie nicht versioniert, dieselbe Lehre wie bei
#                              `tools/training-shell/` am 18.09.). `typen.js` (alle 20 Fragetypen),
#                              `p4.js` (fünf Zustände der Karteikarte), `p5.js` (die drei Listen
#                              und ihre Leerzustände, je gefüllt und leer), `p6.js` (Glossar und
#                              Spickzettel; **misst `offen0`: hat ein AUFGEKLAPPTER Abschnitt
#                              wirklich Höhe?**), `lupe3.js` (Zoom-Maße), `offline.js` (N33: offline je Bereich + Update-Fall, Port 8767), ~~`umschalten.js`~~ (N29, seit 13.10. in `tools/archiv/`), `dienst.py` (Testserver wie Cloudflare: no-cache + `_redirects` + seit 26.09. die Koepfe aus `_headers`, also SCHARFE CSP), **`rauch.js` (Audit AUD-B4, laeuft in der CI: jeder Bereich aus `kern/route.ts`, drei Bildfragen, offline, 0 CSP-/Trusted-Types-Verstoesse; Port 8769, `PW_KANAL=chrome|msedge`; playwright-core liegt seit 26.09. im Wurzel-`package.json`)**,
#                              `ids.json`, **`LIESMICH.md` = Aufrufe, Fallen, Grenzen.**
#                              ⛔⛔ **IN JSDOM IST JEDE GRÖSSE NULL** – „Element da, aber 0×0"
#                              (die Lupe, seit N23, gefunden am 21.09.) kann NUR hier auffallen.
#                              ⚠️ Läuft über `playwright-core` gegen das installierte **Edge**,
#                              zwei lokale `http.server`: Arbeitsbaum gegen `git archive HEAD v2`.
#                              ⛔ **Nach dem Schreiben des Lernstands `p.reload()`** – ein
#                              Hash-Wechsel lädt nicht neu (eine Stunde gekostet, 21.09.).

### 09.10.2026 – Semgrep (statische Sicherheitsanalyse, ND4)
`bash tools/semgrep/scan.sh` ......... Semgrep CE mit 76 festen Regeldateien (semgrep-rules @ `REGELN_SHA`), rot bei
                                     jedem Fund. Laeuft als CI-Job `semgrep` (Linux); auf dem Windows-PC nicht eingerichtet.
`python3 tools/semgrep/auswahl.py <checkout>` .. erzeugt `regeln.txt` neu (security, nicht audit, confidence MEDIUM/HIGH).
Fehlalarm: `// nosemgrep -- <Begruendung>` an der Zeile (Beispiel `tools/sichtpruefung/rauch.js`).

### 10.10.2026 – Qualitaets-Ratschen (N43 M1)
`python3 tools/qualitaet_ratsche.py` .... Kennzahlen lizard, knip, ruff ohne EXE, ruff_s (Gruppe S, E080), shellcheck, tsc gegen
                                     `tools/qualitaet_ratsche.json`; rc 0 gleich/gesunken · 1 gestiegen · 2 stumm. Waechter `4f_qualitaet`.
`... --selbsttest` / `... --setze` ..... Probe `tools/ratsche_probe/` (bekannte Antwort) / Grenzen auf Ist setzen.
Werkzeuge: `tools/requirements-werkzeuge.txt` (mit Hashes, `bash tools/einrichten.sh`), knip als devDependency in `neu/`.

`tools/entscheide.py` (11.10.2026, N49 W3) – jede Entscheidungs-Nummer genau einmal (Tabelle E1–E71 in PLAN_NEUBAU + `entscheide/E0xx-*.md`), keine Luecke, Pflichtabschnitte. `--probe` = Gegenprobe mit drei Kaputt-Faellen. Waechter 4g2.

### 11.10.2026 – Vorlauf vor dem vollen check.sh (N51 A1)
`bash tools/vorlauf.sh` ............... vor JEDEM vollen `check.sh`: `einstieg.py --setze`, Stand-Waechter (4e_versionen,
                                     4e2*, 4e2d, 4f_buildlog, 4g, 4g2, 4f_einstieg), Qualitaets-Ratsche ganz, vitest
                                     Schnappschuss + `vitest related` auf geaenderte `neu/src`-Dateien (nicht bei pool/-Aenderung).
                                     rc 0 gruen · 1 rot. Gemessen (Linux): ~17 s ohne vitest, mit eingabe.test.tsx ~70 s.
`... --probe` ........................ stellt die vier roten Laeufe vom 11.10. als Sabotage nach; rc 0 nur bei 4/4.
`python3 tools/format_gleich.py --belege <json> [--ref HEAD] [dateien]` . **beweist eine %-Umstellung (ruff UP031):**
                                     je verschwundenem `"…" % x` ein `.format`/f-String auf derselben Zeile mit denselben
                                     Argumenten, sonst gleicher Syntaxbaum, Wertprobe je von Hand belegtem Typ
                                     (int/ganz/float/zahl/str/wert, `stern`; Zeilen per difflib zugeordnet). Belege: `tools/format_belege/*.json`. rc 0/1/2.
`... --probe` ........................ 19 bekannte Faelle, 8 davon muessen rot sein (float bei `%d`, bool ohne `:d`, Breite rechts, vertauscht …).
`node tools/js_gleich.js [--ref HEAD] <datei.js> ...` . **beweist, dass eine JS-Aenderung NUR Kommentare/Klammern betrifft**
                                     (N45 W3): Babel-AST alt (git) und neu ohne Kommentare, Klammern beim Parsen weg. rc 0 gleich ·
                                     1 ungleich (erste Abweichung) · 2 Fehler. Braucht `neu/node_modules` (@babel). Leerzeilen-Lage
                                     kann falsch-ROT melden (nie falsch-gruen) - dann den JSDoc-Block anders setzen.
`... --probe` ........................ 9 bekannte Faelle, 4 davon muessen rot sein (Bezeichner, Vorrang-Klammer, Umlaut, Kommentar im String).
`python3 tools/architektur.py` ....... **Schichtregeln der App** (N43 M2): dependency-cruiser aus `.tooling/` gegen `tools/architektur_regeln.cjs`.
                                     rc 0 keine Verstoesse · 1 Verstoesse (je Zeile `VERSTOSS regel: von -> nach`) · 2 stumm (< 200 Module, Werkzeug fehlt).
`... --probe` ........................ `tools/architektur_probe/`: 6 Verstoesse muessen kommen, 3 erlaubte Faelle duerfen nicht (import type, Testdatei, server -> pruefe/route).
