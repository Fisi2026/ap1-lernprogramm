# regeln/pool.md – POOL – Arbeit an Pool, Fragen, Verweisen, Lehrtext und Spickzettel

**Wann lesen:** Pflicht vor jedem Griff an `pool/*.json`, an eine Frage, einen Verweis, eine Kursdatei `0X_*.md` oder `99_Spickzettel.md`.

⚠️ Entstanden am 11.10.2026 (N49 W1, Nutzer-Entscheid): die Bloecke unten stehen **verbatim** aus `START_PROMPT.md` und `docs/archiv/LEHREN.md` (verschoben mit `tools/rotiere.py`, Gegenprobe 0) – nichts gekuerzt, nichts umformuliert. Abschnittsnummern und „siehe oben“ darin beziehen sich auf die Ur-Fassung (`git log -p START_PROMPT.md`, Stand vor N49 W1).
⛔ Diese Datei traegt keinen Stand (der steht in den zwei Standzeilen von `START_PROMPT.md`). **Neue Lehren kommen ans Ende, mit Datum und Beleg.**

## Aus START_PROMPT.md verschoben am 11.10.2026 (N49 W1, verbatim, rotiere.py)

### aus START_PROMPT.md, Zeilen 67-69 der Ur-Fassung

# ► **E3 (185 `verweis`-Ziele), DIE DOPPELTE FRAGE UND DIE M09-AUFLÖSUNG SIND DURCH** (24./25.08.,
#   04.08.) – Volltext im Archiv. **Was weiter gilt:** ⚠️ **eine Frage kann redundant und trotzdem
#   Bestand sein – vor jeder Löschung fragen „was hängt daran".**

### aus START_PROMPT.md, Zeilen 74-77 der Ur-Fassung

# ✅ **TRENNSCHÄRFE-RUNDE DURCH (09.09.): 52 → 30 → 2.** Nicht nachprüfen. Zwei Lehren im Archiv:
#   **die Kür ist die zweite Hälfte der Schwelle** · **ein Pflichtbegriff wirkt über seinen STAMM**.
# ⚠️ **`test_freitext` TRENNT SEIT 09.09. THEMENFREMD VON THEMENGLEICH:** themenfremd = FEHLER (0),
#   Paare DESSELBEN Feinthemas = HINWEIS mit Zahl (Stand 2). ⛔ **Steigt sie, wachsen zwei zusammen.**

### aus START_PROMPT.md, Zeilen 125-155 der Ur-Fassung

#   **SCHRITT 2: Q1–Q3 SIND DURCH; DIE EINE OFFENE ETAPPE IST W1 (Abschnitt 3).** Protokolle:
#      `BEFUNDE_*.md`, `docs/archiv/PLAENE_ARCHIV.md`, Archiv. **Nicht neu anfangen, nicht nachpruefen.**
#      ⛔ **Der Wächter für den Widerspruch Lehrtext ↔ Pool ist am 06./07.09. als G2 GEMESSEN UND
#      VERWORFEN.** Nicht erneut vorschlagen. ⚠️ **A4 IST NICHT MEHR KNAPP** (09.09. nachgerechnet)
#      – ⛔ **Zahl NICHT hier**: erzeugter Block in `docs/befunde/SORTIERUNG_PRUEFUNGSORDNUNG.md`,
#      nachrechnen mit `tools/gebiete_stand.py`.
#      ►► **Vor jeder neuen Lehrtext-Runde:** `python3 tools/e3_gegenprobe.py --streng` – aber
#      **die Einzel-Kandidaten mitlesen, die es nur zaehlt** (B136, Abschnitt 3).
#      ⚠️ **DREI DER VIER SVG-WÄCHTER FANGEN FEHLER VON MIR** (B, C, D in `check.sh` 4e9). Wer eine
#      Grafik ändert: `pool_query.js svg` UND ansehen (`python3 tools/svg_bilder.py --id <ID>`).
#      ⚠️ **B86:** keine mc-Fall-Teilaufgabe darf den Längen-Tell haben – ein Distraktor muss
#      LÄNGER sein als die richtige Antwort, höchstens 1,15x (`test_didaktik.js` prüft NULL).
#   ⛔⛔ **WER EINEN FACHFEHLER KORRIGIERT, TRÄGT DEN BEGRIFF IN `begriffe_belegt.json` EIN.**
#      Beleg 27.08.: GPL eingetragen – der Wächter fand sofort VIER weitere Fundstellen.
#   ⚠️ **DIE LERNUNTERLAGEN SIND BESTAND** (Ziel von 961 Verweisen). Seit 27.08. lesen `begriffe`,
#      `zitate`, `firmen`, `kontext` und `suche` sie mit (Bestand `T`, Fundstellen `04#452 <…>`).
#      **Wer einen Pool-Fehler behebt, sieht im Lehrtext nach.**
#   ⚠️ **`inhaltstraeger.json` IST PFLICHT:** jede Zelle `gelesen` oder `nein: <Grund>`, 4e7 zählt
#      nach. Anlass: fünfmal an einem Tag meldete eine Prüfung grün über Ungeprüftes.
#   ► **DIE FEHLERKLASSEN – IN DIESER REIHENFOLGE SUCHEN:** erfundenes Gesetzeszitat · falsche
#      Absatzangabe · **der Bestand widerspricht sich selbst** (6 Fälle, einer über Modulgrenzen)
#      · **Distraktorerklärung erfindet eine Bedeutung** (4) · Zufallsaufgabe bricht nur beim
#      Ziehen · **Bild erst im Rendern kaputt** (3) · alternde Namen und Jahreszahlen · Fachbegriff
#      verdreht · Aufgabe und Bewertungsschlüssel driften (M04-735) · **das Verweisziel existiert,
#      aber der Begriff der Frage steht nicht darin** (B90/B91, Etappe VI).
#   ⚠️ **VOR JEDER MELDUNG ÜBER DEN POOL DIE AUSWERTENDE FUNKTION LESEN** (zwei Fehlalarme so
#      verhindert). ⚠️ **DIE VORABMESSUNG EINER RUNDE IST SELBST EIN MESSWERT** – **Standzeilen
#      neu ableiten, nie aus der Vorgängerzeile fortschreiben.**
#   ⚠️ **EINE GEGENPROBE BRAUCHT SELBST EINE ZUSICHERUNG, DASS SIE STATTGEFUNDEN HAT** –
#   dafür gibt es `tools/sabotage.sh`. ⚠️ **Wenn /tmp einem anderen Benutzer gehört**, laufen
#   `check.sh`/`suite.sh` über `CHECK_NM_SPIEGEL`/`CHECK_WORK`/`SUITE_WORK` (Zeile: `TASKLIST.md`).

### aus START_PROMPT.md, Zeilen 157-170 der Ur-Fassung

# ► **ETAPPE 3 (M01–M03, M07, M08) UND DER POOLWEITE LAENGENGRIFF SIND DURCH** – **nicht nachpruefen** (`ETAPPE3_M0X_BEFUNDE.md`).
# ⛔⛔ **16 IDs BLEIBEN ABSICHTLICH STEHEN – NUTZER-ENTSCHEIDE 27./28.07. Wer eine davon im
#   Messlauf sieht: STEHEN LASSEN, NICHT MELDEN.** Bei allen steckt die Länge in der Sache
#   (Rechenterme, Fachbegriffe mit Übersetzung, feststehende Kategorien) – formal Treffer,
#   didaktisch keine: **M01-117 · M02-017 · M02-301 · M03-001 · M03-002 · M03-018 · M03-020 ·
#   M03-715 · M04-308 · M04-317 · M06-002 · M06-008 · M06-011 · M06-306 · M06-307 · M07-008.**
#   ⚠️ **11 davon stehen in `laengen_ausnahmen.json`**, fünf meldet der Messlauf weiter und sie
#   stehen trotzdem. **`check.sh` hält beide Listen bündig.**
# ✅ **DIE RATSCHE STEHT AUF ZIEL 3,0 · SCHWELLE 3,0** (`test_didaktik.js`, gesenkt am 27.08. von
#   5,0/8,0, gegengeprobt). **NUR SENKEN, NIE ANHEBEN.** Istwert **6 von 302 = 1,99 %**.
#   ⚠️ **DER NENNER ENTHÄLT SEIT 27.08. DIE FALL-TEILAUFGABEN** (302 statt 287); dort hatten 10 von
#   14 den Tell. **Stufenlücken und Gebietsanteile lesen weiter nur `FRAGEN`.**
# ⚠️ **REIHENFOLGE JE MODUL: erst Inhalt, dann NEU MESSEN, dann Längen** – viermal war die vorab
#   notierte Faktor-Tabelle danach überholt. **Gleichstand zählt als Treffer.** Herleitung: Archiv.

### aus START_PROMPT.md, Zeilen 195-196 der Ur-Fassung

# ► **ZWEI EXTERNE MASSSTÄBE (Prüfungskatalog vor Lehrbuch, Nenner benennen) → `docs/archiv/LEHREN.md`.**
#   ⛔ Pflicht vor JEDER Ergänzung aus Katalog oder Buch und vor jeder Mengenaussage.

### aus START_PROMPT.md, Zeilen 198-241 der Ur-Fassung

# ============
# 3) NÄCHSTER GRIFF
# ============
# ✅ **W1 „WERKZEUGE, WÄCHTER, AUFRÄUMEN" IST ABGESCHLOSSEN (10.09.).** A–E durch, **E1/E4 und
#   F1/F2 GEMESSEN UND GESTRICHEN** – nicht erneut vorschlagen (`docs/befunde/BEFUNDE_WERKZEUGE.md` §11).
#   ⚠️ **Aus E blieb die ZUSICHERUNG, nicht die Form:** `check.sh` 4e10 verlangt von jedem
#   Pool-Wächter einen **Werkzeug-stumm-** und einen **ok-Zweig** (`waechter_zusicherung.py`,
#   Selbsttest läuft mit). ⛔ **Keine Ausnahmeliste.** ⚠️ **Zwei Prüfungen heißen beide `4e2`**
#   (Stand-Zeile · Verweis-Ziele) – bekannt, **Umbenennen wäre ein Entscheid, kein Aufräumen.**
# **Q3, TRENNSCHÄRFE und die Stufe-3/4-Lücken sind durch** (`*_ARCHIV.md`, `BEFUNDE_*.md`).
# **Nicht nachprüfen.** ⚠️ **M01 hat für „Meilenstein" fast keinen Lehrtext** – dort **DIN 69901**.
# ⛔ **WAR DER GRIFF GETAN, GIBT ES WIEDER KEINEN PLAN.** Wer das vorfindet, **erfindet keine
#   Etappe**, sondern MISST und legt vor: `pool_query.js duenn|typen|stufe <1-4>` · `gebiete_stand.py`
#   · `probe_lernfluss.js <kopie> 60 50 --antworten 0.8 --kette` (misst IN der App, nicht daneben).
# ✅ **AM 10.09. GEFAHREN** (B148–B150, `docs/befunde/BEFUNDE_LERNFLUSS.md`): **kein Handlungsbedarf am Pool,
#   drei Fehler im MESSWERKZEUG**, behoben. **Der Lernweg steigt** (Sitzung 1 → 60: 1,35 → 3,03).
#   ► **OFFEN, KEINE BEFUNDE:** die drei dünnsten A3-Feinthemen (je 6: M04 WLAN & VPN, M04
#   GUI-Entwurf, M06 SbD) · M05 · Typ `konsole` (26 Poolfragen, 0,3 % der Ziehungen).
#   ⛔ **M08-Themen sind B3/AP2 – dort ist Dünne kein AP1-Befund.**
# ⛔⛔ **DIESE SIEBEN SIND GEMESSEN – NICHT WIEDERHOLEN, NICHT ERNEUT VORSCHLAGEN** (Herleitungen:
#   Archiv, `BEFUNDE_*.md`): **1.** die 96 `svg`-Fragen (07.09.) · **2.** Katalog-Abdeckung und
#   `--streng` (07.09.) · **3.** der Wächter Lehrtext↔Pool (07.09. verworfen, ~200 Ausnahmen nötig) ·
#   **4.** ein Dubletten-Filter über Wortüberlappung (09.09. verworfen – **er misst Vokabular, nicht
#   Aussage**; das kann nur `gradeTeilpunkte`, und `test_freitext` tut es an allen 15006 Paaren) ·
#   **5.** „A4 ist knapp" (09.09. widerlegt) · **6.** der Stufe-4-Vorrat (09.09.: kein Ausbau nötig,
#   `docs/befunde/BEFUNDE_LERNFLUSS.md` 4b) · **7.** **die Modul-Abweichung der Lernfluss-Probe** (10.09.: M08
#   −5,9 Punkte sind der SOLLWERT der Relevanzgewichtung – Gegenprobe `--ohne-relevanz` → ±0,3).
# ✅ **`lueckentext` AUSGEBAUT (09.09.): 6 → 12** – acht AP1-Themen standen auf null. **Nicht nachprüfen.**
# ►►► **DIE FÜNF LEHREN DES 07.09. GELTEN WEITER – WORTLAUT UND HERLEITUNG: ARCHIV; Rezepte und
#   Zahlen: `docs/befunde/BEFUNDE_LERNUNTERLAGE.md` (B136–B138).** Kurz: **1.** Was ein Werkzeug nicht
#   AUSDRUCKT, ist nicht geprüft – auch wenn es die Zahl nennt. **2.** Lehrtext gegen die
#   MUSTERLÖSUNG schreiben, nicht gegen den Fragetext. **3.** Wer einen fehlenden Begriff nachträgt,
#   prüft die Nachbarn desselben Themas mit. **4.** **Jeder neue Filter braucht Gegenproben mit
#   bekannter Antwort VOR dem ersten Urteil.** **5.** „Der Begriff steht in einem anderen Abschnitt"
#   ≠ „der Verweis ist falsch". ⛔⛔ Ein Wächter daraus ist am 07.09. gemessen und VERWORFEN – nicht
#   erneut vorschlagen. ✅ **M08 hat ABSICHTLICH keine Kursdatei** (24.08.) – wer dort misst, misst einen Entscheid.
#
#   ⚠️ **M04-317 bleibt ein Fehlalarm** (DHCP-Option). ⛔⛔ **EINE MESSUNG GILT FÜR DAS GEMESSENE** –
#   „Lernunterlage ohne belegte Lücke (34/34)" galt den VERWEISZIELEN, nicht dem Inhalt.
# ► **POOL-ARBEIT: Verfahren je Modul, Korrekturskripte, Verweis- und Toleranzregeln → `docs/archiv/LEHREN.md`.**
#   ⛔ Pflicht vor jeder Pool-Runde. Kurz: NIE `json.load`/`json.dump` auf Pool-Dateien.
#
# ✅ **M09-TABU ERLEDIGT (04.08.)**, die Kategorie bleibt.
#

### aus START_PROMPT.md, Zeilen 245-246 der Ur-Fassung

#   ⚠️ **„Fortschritt-Export/Import nicht weiterverfolgen" (27.08.) ist mit v2.2.0 überholt:** der
#      Lernstand als Datei ist gebaut (Audit, BUILD_LOG 55, `kern/lernstanddatei.ts`).

### aus START_PROMPT.md, Zeilen 250-272 der Ur-Fassung

#   ► **ALLE ENTSCHEIDE VOM 04./24./25.08. SIND GEFALLEN UND UMGESETZT** (Volltext im Archiv).
#      **Nicht erneut vortragen.** (Der offene „Wiedereintritt" hing an `gotoSeite` der alten App – entfallen mit N29.)
#   1. ✅ **ALLE 96 BILDFRAGEN GERENDERT UND ANGESEHEN (07.09.)** – `docs/befunde/BEFUNDE_BILDFRAGEN.md` §3.
#      ⛔⛔ **Alle vier SVG-Wächter waren dabei grün – sie prüfen nie, ob das Bild die Frage
#      BEANTWORTET.** ►► **WER EINE BILDFRAGE PRÜFT, RENDERT SIE** (`tools/svg_bilder.py --id <ID>`).
#   2.–9. ✅ **ALLE ERLEDIGT** → `START_PROMPT_ARCHIV.md`. ⚠️ **M08-335: der Aufgabentext steht
#      im `svg`-Feld** – wer eine Frage auf Vollständigkeit prüft, MUSS `svg` mitlesen.
#   ► ✅ **37 FIRMENNAMEN AUF UMLAUTE GEZOGEN (25.08.).** Messen `pool_query.js firmen` (Pool
#      über `tools/pool_laden.js`), setzen `tools/firmen_umlaut_setzen.py`; `check.sh` 4e3
#      meldet jeden Rückfall als FEHLER. ⚠️ Ausnahmen stehen sichtbar im Werkzeug.
#
# **NUTZER-ENTSCHEIDE VOM 03./04.09.2026 – NICHT ERNEUT VORTRAGEN.**
#   ✅ **Die Rechte am Lehrbuch liegen vor**, ausdruecklich auch fuer den Wortlaut (Nutzer, 03.09.).
#      **Die Urheberrechtsfrage ist damit beantwortet — nicht erneut aufwerfen.** Dass die App
#      oeffentlich abrufbar ist, ist einmal benannt worden; die Entscheidung liegt beim Nutzer.
#   ⛔ **KEIN `buchbeleg`-FELD IM POOL** (Entscheid 03.09.): die Kursdateien bleiben das EINZIGE
#      Verweisziel, Buchbelege stehen nur in den Protokollen. **Nicht erneut vorschlagen** — es
#      waere eine Schema-Aenderung plus Waechter plus Pflege bei 1074 Fragen.
#   ✅ B126 (Art. 33/72 h) und B129 (PAP/Struktogramm): **stehen lassen**, beide belegt entschieden.
#
# **NUTZER-ENTSCHEIDE VOM 27./28.07.2026 – NICHT ERNEUT VORTRAGEN.** Volltext im Archiv. Kurz:
#   „IHK-Standard" = **DIN 69901** · Eisenhower im Feinthema Risiko & Stakeholder · Umlaute auch in
#   Firmennamen · Längengriff abgeschlossen · CI auf `@v6` · Positionsverweise als Inhaltszitat.

## Aus docs/archiv/LEHREN.md verschoben am 11.10.2026 (N49 W1, verbatim, rotiere.py)

### aus docs/archiv/LEHREN.md, Zeilen 14-40 der Ur-Fassung

### aus START_PROMPT.md, Zeilen 185-208 der Ur-Fassung

# ► **ZWEI EXTERNE MASSSTAEBE – UND SIE SIND NICHT GLEICHWERTIG.**
#   ⚠️⚠️ **MASSGEBLICH IST DER PRUEFUNGSKATALOG**, nicht das Lehrbuch: `tools/katalog/` (48 Seiten
#      OCR) plus **`katalog_teil1.json` und `abdeckung.py` – gegen die GEPARSTE Struktur messen,
#      nicht per `grep` raten.** Er fuehrt die Lernfeld-Zuordnung amtlich.
#      ⛔ Er liegt in `tools/`, weil `.assetsignore` `tools/**` ausschliesst, `*.txt` aber NICHT.
#      ⚠️ **Sein Anhang ist Referenzmaterial, KEIN Umfangsverzeichnis** – er ordnet nichts einem
#      Pruefungsteil zu (SQL steht neben dem Musterbeleg, obwohl Teil 2; BEFUNDE §16).
#      **Aus der Anwesenheit im Anhang folgt nichts.**
#   ⚠️ **Das Lehrbuch (LF1-5) liegt AUSSERHALB des Repos** (`Buch/_aufbereitung/`, `buch.py`), deckt
#      nur die Grundstufe, ist durchweg OCR – **was eine Aenderung ausloest, wird am Seitenbild
#      bestaetigt** (`buch.py bild`) – und seine Ankerlaeufe sind **ausgeschoepft.**
#   ⛔⛔ **EINE LUECKE GEGENUEBER EINER QUELLE IST KEINE LUECKE BEI UNS.** Dreimal am 03./04.09. sah
#      es nach Handlungsbedarf aus und war keiner (BPMN · SQL/RAID · Verpackungsgesetz – alle AP2
#      oder nur Vorbemerkung). ►► **Vor jeder Ergaenzung im Katalog nachschlagen UND den Teil
#      pruefen.** Ein blankes `grep` haette dreimal AP2-Stoff in eine AP1-Frage getragen.
#   ⛔⛔ **DAS BUCH KANN SELBST FALSCH SEIN – UND IST ES** (B127, am Seitenbild belegt; unser Pool
#      war richtig). ►► **Wo Quelle und Pool sich widersprechen, entscheidet die SACHE.** Ein
#      ungeprueft uebernommener Buchsatz verschlechtert den Pool – das ist die groessere Gefahr.
#      ►► **Anker-Abgleich (Normen, Paragrafen, Fristen) traegt; Prosa-Abgleich nicht** – der
#      OCR-Text erzeugt Scheinwidersprueche.
#   ⛔⛔ **EINE KENNZAHL KANN RICHTIG GERECHNET UND AM FALSCHEN NENNER SEIN – 3x BELEGT, VOR JEDER
#      MENGENAUSSAGE DEN NENNER BENENNEN:** `json.dumps` zaehlt FELDER statt Fragen (03.09.;
#      `abdeckung.py --begriff`) · Stufen-Knappheit JE THEMA, nie global · 26 % Generatoren als
#      „Stufe 1" (beide 09.09., zwei Nenner in EINEM Bericht).


### aus docs/archiv/LEHREN.md, Zeilen 41-69 der Ur-Fassung

### aus START_PROMPT.md, Zeilen 249-274 der Ur-Fassung

# ► **WAS AUS DEN ERLEDIGTEN ETAPPEN WEITER GILT** (Chronik: `START_PROMPT_ARCHIV.md`) ◄
#   ⚠️ **DIE GRENZE 6 UND DIE ZIFFERNSPERRE DER TIPPFEHLER-TOLERANZ SIND GEMESSEN, NICHT
#      GESETZT** – vor jeder Lockerung neu messen (BUILD_LOG 04.08. (3)).
#   ⚠️ **Je mehr Freitextfragen in EIN Thema fallen, desto enger der Trennschärfe-Wächter**
#      (`test_freitext`, Grenze 60). **Grenze nicht anheben – Pflichtbegriffe schärfen.**
#   ⚠️⚠️ **42 VERWEISE NENNEN ABSICHTLICH MEHRERE ABSCHNITTE** („Abschnitt 3.1 und 3.3"), meist in
#      M03 – **kein Fehler.** ⚠️⚠️ **DIE MEHRHEIT KANN DIE FALSCHE SEITE SEIN:** in M04 zeigten 21
#      Fragen auf 4.3 und nur 8 auf 4.6 – **richtig waren die acht. Anker ist die Kursdatei, nie
#      die Verteilung.** ⛔⛔ **KEINE HOCHRECHNUNG AUS EINEM MODUL** – 11 % in M01, 52 % in M04.
#      ► Messen `pool_query.js verweise [modul]` · Setzen `tools/verweis_setzen.py --batch <datei>`.
#   ✅ **Startlast gemessen: drei Viertel sind `fragen.js`** – die Poolgröße kostet Übertragung,
#      keine Rechenzeit. ⛔ Zahl NICHT hier; **der Gerätewert bleibt offen und wird NICHT
#      nachgefragt** (27.07.). ✅ **GEBIETSVERTEILUNG: `tools/gebiete_stand.py`**, Block in
#      `docs/befunde/SORTIERUNG_PRUEFUNGSORDNUNG.md`, 4e2b3.
#
# 📋 **DAS BEWÄHRTE VERFAHREN JE MODUL:**
#   1. Vorabmessung (`node tools/pool_query.js`), 2. Batches von 8–12 Fragen VOLLSTÄNDIG ausgeben
#   und einzeln prüfen (Antwort · Distraktoren · Längen · Erklärung), 3. **jeden Sachbefund poolweit
#   als Fehlerklasse nachscannen** (bei M01 fünfmal Zusatzfunde, zweimal Verdacht entkräftet),
#   4. Bildfragen selbst nachrechnen, 5. Befunde vorlegen → Entscheide → EIN Lauf → build → Suiten.
#   ⚠️ **KORREKTURSKRIPTE: NIE über `json.load`/`json.dump`** – das formatiert die Pool-Datei um.
#      **Rezept (Volltext im Archiv):** Block von ID bis zur nächsten ID abgrenzen, alten Wert auf
#      **genau eine** Fundstelle prüfen, `json.loads` als Syntaxprobe VOR dem Schreiben, vorher sichern.
#   ⚠️ **ZEICHEN-NORMALISIERUNG PER REGEX IST ERST FERTIG, WENN DER DIFF SIE BESTÄTIGT.**
#      ⛔ **In `rechenassistent`-Fragen ist das Minus INNERHALB von `{…}` FORMELSYNTAX** und darf nie
#      ersetzt werden. `test_rechner` fängt das.


### aus docs/archiv/LEHREN.md, Zeilen 91-94 der Ur-Fassung

# ⛔⛔ **EIN ANKER PRÜFT DEN WORTLAUT, DEN ER KENNT – NICHT DIE AUSSAGE.** Am 31.08. schwiegen
#   `GPL` und `Pay-per-Use` bei drei Fundstellen genau ihrer Klasse. ►► **Nachbarlisten so kurz wie
#   möglich** und **am Ur-Zustand gegenproben, BEVOR korrigiert wird.** ⚠️ **Ursache messen, nicht
#   vermuten** – ein Sonderweg gegen eine vermutete Ursache meldete zwei RICHTIGE Stellen.

### aus docs/archiv/LEHREN.md, Zeilen 95-103 der Ur-Fassung

# ⚠⚠ **EIN VERWEISZIEL KANN EXISTIEREN UND TROTZDEM LEER SEIN.** `verweis` prüft, **ob** ein
#   Abschnitt existiert – nie, **ob der Begriff der Frage darin vorkommt.** Am 31.08.: `IaaS`/`PaaS`
#   in **keiner** Kursdatei, in M07 **14 Fragen auf einmal** auf 7.6 ohne einen Satz dazu. **Der
#   Lerner klickt den Verweis genau dann, wenn er die Frage falsch hatte.** ►► `python3
#   tools/e3_gegenprobe.py --alle` prüft das. **Kandidatenfilter:** M03 5 von 7 Fehlalarme, M07 0 von 5.
#   ⛔ **UND DIE NÄCHSTE STUFE SIEHT KEIN WÄCHTER: ZIEL DA, BEGRIFF DRIN – UND TROTZDEM FALSCH**
#   (B106, 02.09.: der Lehrtext definierte Leasing gegen die eigene Frage `M07-003`). ►► **Wer einen
#   Fachsatz im Lehrtext anfasst, liest die Fragen dazu** (`pool_query.js suche`) **und sucht
#   denselben Satz im Spickzettel** – dort stand die fünfte, zuerst übersehene Stelle.

### aus docs/archiv/LEHREN.md, Zeilen 110-112 der Ur-Fassung

# ⚠️ **DER TITEL EINES ABSCHNITTS IST KEIN INHALTSVERZEICHNIS.** Modul 03: 3.2 „Typische
#   IT-Systeme" führt **kein einziges Netzwerkgerät** (die stehen in 3.1), 3.3 enthält die
#   802.11-Tabelle und LWL. **21 der 33 M03-Fehler kamen aus diesen zwei Verwechslungen.**

### aus docs/archiv/LEHREN.md, Zeilen 120-122 der Ur-Fassung

# ⚠️ **EIN ABSCHNITT MIT DÜNNEM INHALT IST TROTZDEM DER RICHTIGE ABSCHNITT.** „Modul 07 hält für
#   ‚Einweisung & Schulung' keinen Fundort vor" – **7.6 heißt wörtlich „… und Einweisungen".**
#   15 Fragen lagen einen Monat falsch. **„kein Fundort" ≠ „zu wenig Inhalt".**

### aus docs/archiv/LEHREN.md, Zeilen 128-131 der Ur-Fassung

# ⚠️ **DER LÄNGEN-TELL ENTSTEHT BEIM SCHREIBEN VON SELBST** – die richtige Antwort ist eben die
#   vollständige (5 von 6 bzw. 4 von 12 neuen mc-Fragen). **VOR dem Einsortieren messen**;
#   `tools/apply_batch.py` weist per `assert` jede Frage mit Tell zurück.
#

### aus docs/archiv/LEHREN.md, Zeilen 132-150 der Ur-Fassung

# ⚠️ **DIE WÄCHTER SIND KLÜGER ALS ICH – SIE HABEN AM 27.07. FÜNFMAL RECHT BEHALTEN.** Wer beim
#   Schreiben neuer Fragen einen Wächter anschlagen sieht, **verdächtigt NICHT zuerst den Wächter**;
#   alle Fälle waren echte Fehler von mir. **Die Fälle stehen verbatim im Archiv, die Regeln hier:**
#   * **Nie das Gebiet raten – `apply_batch.py` sagt es** (viermal falsch vermutet, u. a.
#     „Netzwerkkomponenten & Medien" und „Netzplan & Puffer").
#   * **`test_matrix` hat drei INHALTLICHE Wächter:** konkrete Zahl je Element · kein Beispielmotiv
#     in mehr als 3 Matrix-Fragen · Kurzerklärung greift eine Zahl aus den Elementen auf.
#   * **`schluesselbegriffe` ist ein OBJEKT** `{pflicht:[[...]], kuer:[...]}`, und `pflicht` verlangt
#     String ODER Liste mit **mindestens zwei** Synonymen. `apply_batch` prüft nur den ÄUSSEREN
#     Feldtyp. ►► **Nach JEDEM Hand-Eingriff in eine Pool-Datei `validate_schema`.**
#   * ⛔ **`.assetsignore` SCHLIESST `*.json` NICHT AUS — EINE .json IM WURZELORDNER GEHT AN DEN
#     LERNER** (06.09.). **Arbeitsdateien nach `tools/`**, nie in den Wurzelordner – und **den
#     Ungepusht-Guard nach jedem Commit LESEN**, nicht nur laufen lassen; er hat es gefunden.
#   * **Pool-Datei von Hand geändert → so zurückschreiben, wie `apply_batch` schreibt:**
#     `json.dump(..., ensure_ascii=False, indent=2)` + `sort(key=id)` + Schluss-Newline
#     (`indent=1` machte aus einer Feldkorrektur 12485 geänderte Zeilen).
#   * **Der Abkürzungs-Wächter liest NUR `f.frage`** – Spaltenköpfe nicht. Zwei Wege: ins Lexikon
#     (Nutzer-Entscheid nötig!) oder im Fragetext ausschreiben.
#

### aus docs/archiv/LEHREN.md, Zeilen 158-161 der Ur-Fassung

# ⚠️ **EINE KORREKTUR, DIE NUR DEN SCANNER ZUFRIEDENSTELLT, IST KEINE KORREKTUR.** M02-771 galt als
#   erledigt, weil `Option \d` dort nichts mehr fand – die Positionsverweise waren nur zu „(0) … (1)
#   …" umgeschrieben. **Die Gegenprüfung darf nicht dieselbe sein, an der die Korrektur sich
#   orientiert hat**, und wer eine Fehlerklasse scannt, sucht nach der ZWEITEN Schreibweise.

### aus docs/archiv/LEHREN.md, Zeilen 162-163 der Ur-Fassung

# ⚠️ **EIN SACHBEFUND IST EIN VERDACHT AUF EINE FEHLERKLASSE.** Der TLS-Befund galt als Einzelfall;
#   im selben Modul lagen drei weitere. **Nach JEDEM fachlichen Befund poolweit nachscannen.**

### aus docs/archiv/LEHREN.md, Zeilen 164-167 der Ur-Fassung

# ⚠️ **NICHT ÜBER DAS ZIEL HINAUSSCHIESSEN.** Angeglichene Distraktoren waren im ersten Entwurf fast
#   doppelt so lang wie die richtige Antwort – **der Wächter meldet das NICHT**, er misst nur
#   „richtige ist die längste". **Ziel: Gleichstand ±15 %, mit mindestens einem Distraktor über der
#   richtigen Antwort.** ⚠️ **NIEMALS die richtige Antwort kürzen** – das kostet Präzision.

### aus docs/archiv/LEHREN.md, Zeilen 168-170 der Ur-Fassung

# ⚠️ **Pool-Scans IMMER über das GANZE Frage-Objekt** (`json.dumps`): Fehler stecken auch in
#   `verweis`, `optionen`, `distraktorErklaerungen`, `musterloesung`, `paare`. ⚠️ ABER: bei der
#   BEWERTUNG nur prüfen, was der Pool als WAHR behauptet – falsche Optionen sind ABSICHTLICH falsch.

### aus docs/archiv/LEHREN.md, Zeilen 171-172 der Ur-Fassung

# ⚠️ **Die Positionsverteilung der richtigen Antwort (71 % auf Platz 1) ist KEIN Problem** – die
#   Optionen werden beim Anzeigen gemischt (`app_loeser.js:65`). Nicht „reparieren".

### aus docs/archiv/LEHREN.md, Zeilen 284-290 der Ur-Fassung

### 10.10.2026, gmail – der Kandidatenfilter uebersieht Luecken, nicht nur meldet er zu viele
⛔ **Beleg:** Inhaltsrunde 1 (03): `abdeckung.py` meldete 31 Kandidaten, 29 davon Fehlalarme. Zwei echte Luecken
(Mobile Geraete, Sensoren) fehlten ganz in der Liste: „Smartphone" stand nur in MFA-Fragen, „Sensor" nur in
Erklaerungen – der Wortabgleich zaehlte das als belegt. Kein einziger Fragetext pruefte das Thema.
►► **Regel:** In jeder Inhaltsrunde alle Katalogpunkte des Bereichs zusaetzlich gegen `frage`/`optionen`/`paare`/
`musterloesung` scannen. Ein Filter, der Fehlalarme hat, kann auch Treffer verschlucken – beide Richtungen pruefen.


### aus docs/archiv/LEHREN.md, Zeilen 296-302 der Ur-Fassung

### 11.10.2026, gmail – ein Begriffsanker muss an der Fehlerstelle STEHEN
⛔ **Beleg:** Fuer den Fachfehler „Empfohlene Massnahmen (Standard, Kern, Zusatz)“ (Lehrtext 06#228) stand der erste
Eintrag in `begriffe_belegt.json` unter „Kern-Absicherung“. Gegenprobe am Ur-Zustand: **0 Treffer** – `pool_query
begriffe` sucht zuerst den BEGRIFF und erst in dessen Fenster die verbotenen Nachbarn, und der fehlerhafte Satz nennt
„Kern-Absicherung“ gar nicht. Ausserdem faellt `fenster: 0` still auf 200 zurueck (`b.fenster || 200`).
►► **Regel:** Den Anker nach dem Wort waehlen, das AN der Fehlerstelle steht (hier „Baustein“), nicht nach dem
richtigen Fachbegriff – und erst eintragen, wenn die Gegenprobe am Ur-Zustand die Fundstelle MELDET (hier 0 → 1 → 0).
