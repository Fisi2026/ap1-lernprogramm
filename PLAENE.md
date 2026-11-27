# PLAENE – Detail-Umsetzungspläne + Alt-Protokolle (ausgelagert aus TASKLIST.md, 2026-07-12)
Pro Task NUR den betreffenden Abschnitt lesen (Token-Sparregel).

# ⚠️⚠️ **DIESE DATEI IST EIN PLAN, KEIN STATUS. JEDE ZAHL DARIN IST EIN MESSWERT VON DAMALS.**
# Status steht in `START_PROMPT.md` und wird am Code gemessen. Belegte Beispiele für die Lücke,
# alle am 28.07.2026 nachgemessen:
#   * „Wächter Gebiets-Unwucht … heute A4 mit **2,8 %** → der Wächter ist **ROT**" (Etappe 0)
#     → Schwelle steht auf **4,8**, A4 bei **4,95 %**, der Wächter ist **grün**.
#   * „Schnitt: **v1.12.0 nach M01–M03**, v1.13.0 nach M07+M08" (Etappe 3)
#     → **so nicht gelaufen.** v1.12.0 war Etappe 6; Etappe 3 lief komplett **ohne Version-Bump**.
#   * „Am Ende dieser Etappe muss der Längen-Wächter bei **≤ 45 %** stehen" (Etappe 3)
#     → Ratsche steht auf **8,0**, Istwert **3,16 %**.
# ►►► **WAS HIER WEITER GILT: die Nutzer-Entscheide und das VERFAHREN je Etappe.**
# ►►► **WAS NICHT GILT: Ist-Zahlen, Schwellenwerte, Release-Schnitte, „ROT/GRÜN"-Aussagen.**
# Das ist dieselbe Vermischung, für die `TASKLIST.md` am 27.07. und `START_PROMPT.md` am 28.07.
# auseinandergezogen wurden. Diese Datei hat die Behandlung noch nicht bekommen. (Die Zeilenzahl,
# die hier stand, war um 28 zu niedrig – in genau der Datei, deren Kopf vor solchen Zahlen warnt.)
# ⚠️ Wer hier eine Zahl liest und danach handelt, misst sie vorher nach.

## ✅ RUNDE Q3 – EXTERNE MASSSTÄBE: KOMPLETT DURCH (04.–07.09.2026)
Alle zehn Etappen (A, A+, B, C, D, E, F, G1, G2, H, I) sind abgeschlossen. **Der vollständige
Nachweis – jede Etappe mit Datum und Ergebnis, die Entscheide und die Verfahrenslehren – steht
verbatim in `PLAENE_ARCHIV.md`, Abschnitt „ROTATION 2026-09-10".**
⛔ **Nicht neu anfangen, nicht nachprüfen.** Was aus Q3 weiter gilt, steht in `START_PROMPT.md`
Abschnitt 3 (die sechs gemessenen Punkte) und in `BEFUNDE_BUCH_KATALOG.md`.

## 🚩 GESAMTPLAN „QUALITÄTSRUNDE Q2" (beschlossen 2026-08-27)

⚠️ **DIESE PLANUNG IST EIN PLAN, KEIN STATUS** – wie alles in dieser Datei. Der Etappenstand steht
in `START_PROMPT.md` Abschnitt 3.

**Wie er entstanden ist:** Nach Abschluss von M04 und M06 wurde gefragt, was noch ungeprüft ist.
Sieben Kandidaten wurden **gemessen statt geschätzt** vorgelegt; sechs davon sind hier geplant.
⛔ **Punkt 7 (Fortschritt-Export/Import) wird NICHT weiterverfolgt** – Nutzer-Entscheid 27.08.:
das Feature wird nicht weitergeführt. **Nicht erneut vortragen, auch nicht als „wäre schnell".**

**Elf Nutzer-Entscheide vom 27.08. – sie sind der Rahmen, nicht mein Vorschlag:**

| # | Frage | Entscheid |
|---|---|---|
| 1 | Reihenfolge | **Etappe II (Begriffe) VOR M05** – sie läuft poolweit und nimmt M05 mit |
| 2 | Begriffsprüfung | **Anker-Datei `begriffe_belegt.json` + Wächter**, analog `zitate_belegt.json` |
| 3 | Begriffsliste | **aus dem Pool erheben, dann filtern** (Begriffe mit Definition in mehreren Modulen) |
| 4 | Bilder | **alle 93 restlichen, modulweise**, beginnend mit M03 |
| 5 | Fälle: fehlende `schluesselbegriffe` | **erst messen**, was der Löser damit tut, dann entscheiden |
| 6 | Freitext-Klasse M04-735 | **wie M04-735 korrigieren + Wächter** in `test_freitext` |
| 7 | Lernunterlage: Zuschnitt | **erst eine Datei als Pilot** |
| 8 | Pilotdatei | **`03_IT-Systeme_Hardware_Wirtschaftlichkeit.md`** (616 Z.) |
| 9 | Unterlage ↔ Pool im Widerspruch | **Einzelfall vorlegen** – keine Faustregel |
| 10 | Lerner-Fluss | **messen und vorlegen**, nichts ändern ohne Entscheid |
| 11 | Ablage | **hier planen**, je Etappe ein eigenes `BEFUNDE_*.md`, eine Sammelzeile im START_PROMPT |

---

### Etappe II — BEGRIFFS-KONSISTENZ POOLWEIT (vor M05)
**Anlass:** „Pay-per-Use" stand in M03 richtig (nutzungsabhängig, Monatspauschale ausdrücklich als
Gegenbeispiel) und in M04 zweimal genau umgekehrt. **Erster Widerspruch über Modulgrenzen** – und
er fiel nur auf, weil zufällig `pool_query.js kontext` benutzt wurde. Innerhalb eines Moduls fällt
so etwas beim Lesen auf, über zwei Module hinweg nie.
**Verfahren:**
1. Begriffe erheben: alle Fachbegriffe, die in **mehr als einem Modul** definiert oder erklärt
   werden. Maschinell sammeln, dann von Hand auf die filtern, bei denen eine verbindliche
   Definition Sinn ergibt. Erwartete Größe 60–100.
2. Je Begriff die Fundstellen nebeneinanderlegen (`kontext`) und die Definitionen vergleichen.
3. Widersprüche als Befunde vorlegen → Entscheide → **EIN** Korrekturlauf.
4. `begriffe_belegt.json` anlegen: je Begriff die verbindliche Kurzdefinition **plus die
   Abgrenzung zum Nachbarbegriff**, mit Datum und Fundstelle.
5. Wächter in `check.sh`, der jede Frage meldet, die einem Anker widerspricht.
⚠️⚠️ **DER WÄCHTER IST DER SCHWIERIGE TEIL, NICHT DIE MESSUNG.** „Widerspricht" ist nicht
mechanisch entscheidbar. Der Wächter darf deshalb **nur prüfen, was prüfbar ist** – etwa: taucht
ein Begriff zusammen mit einem verbotenen Nachbarwort auf („Pay-per-Use" neben „Monatspauschale").
**Ein Wächter, der Bedeutung zu messen vorgibt, ist schlimmer als keiner.** Erst die Anker bauen,
dann sehen, welche davon sich überhaupt in eine Probe übersetzen lassen.
⚠️ **Erst an einem Fall prüfen, dessen Antwort man kennt** (Pay-per-Use) – Lehre vom 24.08.

### Etappe III — M05 LESEN (67 Fragen)
Das letzte Modul der Runde I. **Verfahren unverändert:** Batches à 10–15 Fragen · jeden Sachbefund
poolweit als Fehlerklasse nachscannen · Befunde vorlegen · Entscheide · EIN Lauf · `check.sh block`
· Commit. Protokoll `BEFUNDE_M04-M06.md`, fortlaufend ab **B42**.
► **Nach Etappe II ist eine Fehlerklasse weniger zu suchen** – die Begriffe sind dann poolweit
geprüft, also auch die von M05.

### Etappe IV — DIE NEUN FÄLLE (45 Teilaufgaben)
**Anlass:** In allen BEFUNDE-Protokollen zusammen **zwei Nennungen**. Die Fälle sind die einzigen
mehrstufigen Aufgaben und liegen der echten AP1 am nächsten – und haben die Behandlung nie bekommen.
**Gemessen 27.08.:** 9 Fälle · 45 Teilaufgaben · Typen mc 17, mehrfach 9, dropdown 8, mtf 6,
zuordnung 3, freitext 2 · **kein `svg`** · **kein einziges `schluesselbegriffe`**.
**Verfahren:** je Fall Szenario + fünf Teilaufgaben zusammenhängend lesen – **hier zählt zusätzlich,
ob die Teilaufgaben aufeinander aufbauen und das Szenario tragen.** Das ist die Prüfdimension, die
es bei Einzelfragen nicht gibt.
► **ZUERST:** in `app_loeser.js` nachsehen, was eine Freitext-Teilaufgabe **ohne**
`schluesselbegriffe` tut. Zeigt sie die Musterlösung zum Selbstvergleich, ist es Absicht und wird
als Entscheid dokumentiert; wertet sie stumm als falsch, ist es ein Befund.
⚠️ **Vor der Meldung die auswertende Funktion lesen** – die Lehre vom 26.08., zweimal bewährt.

### Etappe V — 93 BILDER ANSEHEN
**Anlass:** Drei kaputte Bilder in dieser Runde, **alle drei nur im gerenderten Zustand sichtbar**
(M06-019 keine Matrix, M04-119 Beschriftung außerhalb der Zeichenfläche, M04-996 drei Kästen statt
einer Klasse). **96 SVGs im Bestand, 3 geprüft.**
**Bereits erledigt:** die mechanische Probe auf den M04-119-Fehler (Element außerhalb der viewBox)
lief am 27.08. über alle 96 – **0 Treffer.** Diese Klasse ist damit ausgeschlossen.
**Was bleibt, ist semantisch** und findet nur Rendern und Hinsehen: falsche Achsen, vertauschte
Beschriftungen, ein Diagramm, das die Frage nicht trägt.
**Reihenfolge (modulweise):** M03 42 · M01 21 · M04 8 · M06 7 · M07 7 · M05 4 · M02 2 · M08 1.
**Rezept:** `svg`-Feld in eine Datei, stagen, mit `cairosvg` nach PNG, ansehen. Zwei Zeilen.
► **Ein Werkzeug daraus machen**, sobald es das zweite Mal gebraucht wird – nicht vorher.

### Etappe VI — LERNUNTERLAGE, PILOT `03_IT-Systeme` (616 Z.)
**Anlass:** Rund 5.000 Zeilen in acht Kursdateien, **von keiner Suite abgedeckt** – der
Verweis-Wächter prüft nur, ob Abschnitte existieren, nicht was drinsteht. Das ist der Text, den der
Lerner liest, wenn er etwas falsch hatte.
**Vorabmessung 27.08.:** Gesetzeszitate sind dort **fast keine** – 1 Kandidat, 4 Absatzangaben in
allen Dateien zusammen. Die teuerste Klasse des Pools fällt hier also weitgehend aus.
**Warum M03 der Pilot ist:** Dort kamen schon einmal **21 von 33 Fehlern aus zwei
Abschnitts-Verwechslungen** („der Titel eines Abschnitts ist kein Inhaltsverzeichnis").
**Gesucht wird:** verdrehte Fachbegriffe · alternde Beispiele und Jahreszahlen · Zahlen ohne Beleg ·
Abschnitte, deren Inhalt nicht zum Titel passt · Widersprüche zum geprüften Pool.
⛔ **Bei Widerspruch Unterlage ↔ Pool: Einzelfall vorlegen, keine Faustregel** (Entscheid 9).
**Nach dem Piloten:** Trefferquote messen und **dann** über die restlichen sieben entscheiden.
⚠️ **Als Stichprobe deklariert, nicht als Hochrechnung** – „keine Hochrechnung aus einem Modul"
gilt hier genauso wie bei den Verweisen (11 % in M01 gegen 52 % in M04).

### Etappe VII — WAS DER LERNER IN EINER SITZUNG SIEHT
**Anlass:** Die Wächter messen die Zusammensetzung des **Pools**. Was aus 50 gezogenen Fragen
tatsächlich wird, hat nie jemand gemessen.
**Zu messen (in jsdom, wie `tools/probe_doppelziehung.js`):** Themenverteilung über eine Sitzung ·
wie oft derselbe Fragetyp hintereinander kommt · ob die Stufenlogik wirklich vom Leichten zum
Schweren führt · Abstand bis zum Wiedersehen einer Frage.
⛔ **NUR MESSEN. Keine Änderung ohne Entscheid** (Entscheid 10) – die sechs Sperren in
`unterrichtZiehe()` hängen an 38 Tests, und „auffällig" ist bei Ziehungslogik oft Geschmackssache.

### NEBENHER, KEIN EIGENER BLOCK
**Sechs Freitextfragen der Klasse M04-735** (Aufgabe nennt eine Anzahl, Bewertung erzwingt bestimmte
Begriffe): **M03-603 · M03-616 · M04-114 · M04-206 · M05-306 · M07-608.** Verdächtig sind vor allem
**M03-616** und **M07-608** – „mindestens zwei" bei **drei** Pflichtgruppen.
✅ Entscheid 6: korrigieren wie M04-735 (Aufgabenstellung an die Pflichtgruppen), **plus Wächter in
`test_freitext`**: nennt der Fragetext eine Anzahl N und stehen mehr als N Pflichtgruppen da → Fehler.
⚠️ **Den Wächter gegenproben**, bevor er zählt – er muss an M04-735 im Ur-Zustand anschlagen.

---

## 🚩 GESAMTPLAN „QUALITÄTSRUNDE Q1" (beschlossen 2026-07-26)
# ⚠️ Die Überschrift trug bis zum 28.07. den Zusatz „NOCH NICHTS UMGESETZT". Das stimmte am
# 26.07. und war zwei Tage später falsch: Etappe 0, 1, 3, 4, 5 und 6 sind durch.
# **Aktueller Etappenstand: `START_PROMPT.md` Abschnitt 3.**
**Alle Entscheidungen des Nutzers liegen vor — es ist NICHTS mehr offen. Einfach oben anfangen.**
Grundlage: `PRUEFBERICHT_2026-07-26.md` (gitignoriert, liegt im Projektordner).

### Die Nutzer-Entscheide, damit sie nicht neu gefragt werden
| Frage | Entscheid |
|---|---|
| Batch-Prüfung und Längen-Tell | **zusammenlegen** — jede Frage nur EINMAL anfassen |
| M09 anfassen | ~~erst ab 01.08.2026~~ → **ÜBERHOLT 30.07.2026:** Tabu aufgehoben, M09 wurde auf die Probeklausur „Übungsfragen WiSo 31.07.2026 – FISI0126" ausgerichtet (19 Fragen gestrichen, 24 neu). Siehe BUILD_LOG 30.07. |
| M09 danach | gegen Katalog prüfen, **Passendes in den normalen Pool eingliedern**, **Rest löschen**; Menüpunkt bleibt für künftige Klausuren und bekommt dann **neu erzeugte** Fragen |
| Veröffentlichung | **mehrere kleine Releases**, nach jeder Etappe |
| Wer schreibt | **ich schreibe und prüfe alles selbst** (keine Agenten-Übernahme) |
| A4-Ausbau | auf **rund 40** Fragen (+18) |
| Stufe-1-Lücken | **nur AP1-Gebiete A1–A5**: 22 Themen × 2 = **44 Fragen** |
| Stufe 4 | **alle neun Formate**, je 2 = **18 Fragen** |
| Stufenlücken (4 Themen) | **schließen** (5 Fragen) |
| COVERAGE.md Abschnitt 2 | **neu erheben** |
| M06-304 (TLS) | **auf ECDHE umstellen** |

### ⚠️ WARUM DIE REIHENFOLGE SO IST (nicht umsortieren, ohne das zu lesen)
1. **Wächter zuerst.** Ohne Messung ist nach der Überarbeitung nicht belegbar, dass es besser wurde
   — und beim nächsten Ausbau schliche sich derselbe Tell wieder ein.
2. **M09 gliedert Fragen in M01, M02, M03, M07 und M08 ein** (Themen: Gantt, Netzplantechnik,
   Kundenauftrag, Vollmachten/Prokura, Rechtsformen, BBiG …). Würde die Batch-Prüfung dieser Module
   vorher laufen, kämen die eingegliederten Fragen **ungeprüft** hinterher.
   → Deshalb: **erst M04/M05/M06 prüfen** (die M09 nicht berührt), **dann M09 eingliedern**, **dann
   M01/M02/M03/M07/M08**. Das nutzt die Tage bis zum 31.07., ohne etwas doppelt zu tun.
3. **Neue Fragen zuletzt.** Sie sollen nach den Regeln entstehen, die die Prüfung erst festlegt
   (ausgeglichene Distraktorlängen) — sonst produziert man den Befund gleich wieder mit.

---

> ⚠️ **DIE RELEASE-NUMMERN HIER SIND ZUORDNUNGEN, KEIN FAHRPLAN (korrigiert 2026-07-27).**
> Sie standen bis zum 27.07. auf dem Stand der ersten Planung und waren falsch, weil Etappen
> VORGEZOGEN wurden: Etappe 4 und 5 liefen vor Etappe 2 (M09 war bis zum Klausurtermin gesperrt),
> und v1.10.0 blieb wegen eines roten CI-Laufs ohne Tag – der Inhalt ging mit **v1.10.1** raus.
> **Ein Tag v1.10.0 wird nie existieren.** Wer hier eine Nummer liest, prüft sie gegen
> `git log` und `app_state.js`, nicht umgekehrt.

> ⚠️ **ETAPPE 0, 1, 4, 5 UND 6 STEHEN SEIT DEM 28.07.2026 IN `PLAENE_ARCHIV.md`** – alle
> ausgeliefert. Hier stehen nur noch die OFFENEN. Die Release-Angaben in den Überschriften unten
> stammen aus der Planung vom 26.07. und **haben sich nicht bewahrheitet**: Etappe 3 lief komplett
> ohne Version-Bump, v1.12.0 war Etappe 6. **Aktueller Stand: `START_PROMPT.md` Abschnitt 3.**

### ETAPPE 2 — M09 auflösen und eingliedern  ⏱ mittel

> ✅ **ETAPPE 2 IST AM 04.08.2026 KOMPLETT DURCH – A UND B.** Der Klausurtermin ist abgelaufen.
> **Etappe A:** 30 Fragen gelöscht, 48 nach M08/Gebiet B3 umgezogen (sechs neue Themen),
> M09 121 → 43. Der AP1-Nenner blieb bei 888, A4 bei 4,95 % – deshalb konnte dieser Teil ohne
> Gegenmaßnahme laufen. Ablauf, Zuordnung je Frage und die zwei Lehren: **BUILD_LOG 04.08.**
> **Etappe B:** 43 Fragen nach M01 (+15), M07 (+17), M03 (+7) und M02 (+4); `pool_m09_unterricht.json`
> ist leer, die Kategorie bleibt. Sie war durch den Gebiets-Wächter blockiert (45 AP1-Fragen nötig,
> 28 erlaubt) – gelöst durch **drei neue A4-Fragen** (M07-043/044/045), gebaut nach einer Messung
> der A4-Katalog­lücken statt nach Gefühl. **A4 44/888 = 4,95 % → 47/934 = 5,03 %.**
> Mit erledigt: Klausurtermin auf **eine Konstante** (`KLAUSUR_TERMIN`), M09-Spickzettel in
> `99_Spickzettel.md` aufgegangen, `tests/_m09fixture.js` als EINE Quelle für synthetische
> M09-Testdaten. Details: **BUILD_LOG 04.08. und 04.08. (2)**.
> ⚠️ Die Zahlen in den Schritten unten stammen von VOR dem Umbau (105 bzw. 110 Fragen).
> ⚠️ Die Zuordnung „→ Release v1.12.0" ist überholt – v1.12.0 war Etappe 6 und ist live.
> ⚠️ **Schritt 2 unten nennt M07 als Ziel für Rechtsformen/Firma/Kaufmannseigenschaft – das war
> falsch geraten.** Der Prüfungskatalog führt diesen Stoff als AP2/WiSo; sie liegen jetzt in
> M08/B3. **Vermutete Zielmodule sind keine Katalogaussage.**
1. **Katalogabgleich:** alle 105 M09-Fragen gegen Prüfungskatalog FIS 2024 und die FISI-Lerninhalte
   halten. Ergebnis: Liste „passt → Zielmodul/Zielthema/Gebiet" bzw. „passt nicht".
2. **Passende eingliedern:** Modul, Thema, Gebiet und ID neu vergeben (IDs aus dem Zielmodul, freie
   Nummern; `idcheck` bewacht Kollisionen). Erwartete Zielmodule: M01 (Gantt, Netzplantechnik),
   M02 (Kundenauftrag), M03/M07 (Wertschöpfung), M07 (Vollmachten, Rechtsformen, Firma,
   Kaufmannseigenschaft), M08 (BBiG/JArbSchG).
3. **Rest löschen** (Nutzer-Entscheid). Vorher die Liste der zu löschenden Fragen VORLEGEN.
4. **Menüpunkt bleibt bestehen** für künftige Klausuren, dann mit neu erzeugten Fragen.
   → `pool_m09_unterricht.json` wird geleert, nicht entfernt. Termin/Countdown
   (`app_seiten.js:859`, `app_util.js:219`) auf „kein Termin gesetzt" umstellen, damit dort nicht
   dauerhaft ein abgelaufenes Datum steht.
   ⚠️ **`istUnterricht()`, `UNTERRICHT_MODUL` und die Trennung vom AP1-Pool bleiben unangetastet** —
   die Mechanik wird gebraucht, sobald die nächste Klausur ansteht.
5. Die eingegliederten Fragen werden in Etappe 3 mitgeprüft (sie landen in M01/M02/M03/M07/M08).

### ETAPPE 3 — Batch-Prüfung M01, M02, M03, M07, M08 → **Releases v1.13.0 / v1.14.0**  ⏱ sehr groß
> ►►► **M01, M02 UND M03 SIND KOMPLETT DURCH (27.07.2026)** — Inhalt, Sprache und Längen-Tell.
> M01: 110/110 Fragen, acht schwere Befunde, **22 von 23 Tell-Treffern entschärft** (M01-117 bleibt
> per Nutzer-Entscheid stehen: reine Rechenterme, 2 Zeichen Abstand).
> M02: 109/109 Fragen, **elf schwere Befunde**, zwei Dublettenpaare inhaltlich neu gebaut, drei
> Fragen umgehängt, `verweis` in zehn Fragen ergänzt, **alle 22 Tell-Treffer entschärft**.
> M03: 192/192 Fragen, **19 schwere Befunde**, zwei Bildkorrekturen (Balkenmaßstab, fehlende
> Nummerierung), 24 Inkonsistenzen, 17 Umlaut-Stellen, `verweis` in 20 Fragen, **33 von 36 Tells**.
> **Tell-Zähler poolweit 124 → 102 → 80 → 47 (43,8 % → 16,5 %) bei konstantem Nenner 285** — die
> erste echte Korrektur seit Etappe 1, ohne eine einzige neue Frage dafür zu schreiben.
> Protokolle: `docs/befunde/ETAPPE3_M01_BEFUNDE.md`, `docs/befunde/ETAPPE3_M02_BEFUNDE.md`, `docs/befunde/ETAPPE3_M03_BEFUNDE.md`.
> ✅ **M07 UND M08 SIND SEIT DEM 28.07.2026 DURCH** (Commits `12048bf`, `5507b36`; Protokolle
> `docs/befunde/ETAPPE3_M07_BEFUNDE.md`, `docs/befunde/ETAPPE3_M08_BEFUNDE.md`). ⛔ **Hier stand bis zum 02.09. „OFFEN:
> M07 · M08"** – fünf Wochen, nachdem beide erledigt waren. **Status gilt aus `START_PROMPT.md`.**
> ⚠️ **Reihenfolge im Modul: erst Inhalt und Sprache, dann NEU MESSEN, dann Längen.** Inhaltliche
> Korrekturen verschieben die Optionslängen — in M01 stimmte danach keine der vorab notierten
> Faktor-Angaben mehr (M01-201 notiert 4,0 ×, gemessen 3,39 ×); in M02 und in M03 hatte sich je
> ein Treffer durch die inhaltliche Korrektur sogar **von selbst erledigt**.
> ⚠️ **Gleichstand zählt als Treffer** (`len[i] === max`) — ein Distraktor muss STRIKT länger sein.
> ⚠️ **Bei Themen-Umhängungen die Wächter VORHER rechnen.** In M02 wurden drei Fragen umgehängt;
> A4 bekam eine und verlor eine, die Basis blieb 888 → Anteil unverändert 4,95 %. Nach dem Bau
> gemessen: exakt so. Ohne diese Vorabrechnung ist der Gebiets-Wächter ein Blindflug.

**599 Fragen, neu gemessen am 27.07. nach dem `modul`-Feld** (M01 110 · M02 109 · M03 192 ·
M07 133 · M08 55) **plus die aus M09 eingegliederten**. ⚠️ Die früheren Zahlen (531 bzw.
„601 = 99+90+157+125+55") waren beide falsch: Letztere summiert sich auf 526 und zählt nur die
gleichnamigen Pool-DATEIEN — M01 liegt z. B. auch in `pool_m_transfer.json` und `pool_m_l4.json`.
Gleiches Verfahren wie Etappe 1. Schnitt: v1.12.0 nach M01–M03, v1.13.0 nach M07+M08.
⚠️ **M08 ist das Rechts-/Fristen-Modul** — dort gilt die Lehre aus R2b.3: jede Zahl belegen, danach
`tools/fakten_check.py` um neue harte Zahlen erweitern.
**Am Ende dieser Etappe muss der Längen-Wächter bei ≤ 45 % stehen.**

### ETAPPE 7 — Startlast messen (kein Umbau)  ⏱ klein
⛔⛔ **DER HANDY-TEST WIRD NICHT MEHR ANGEBOTEN UND NICHT NACHGEFRAGT** – Nutzer-Entscheid
27.07.2026, wörtlich: „handy test in zukunft nicht mehr nachfragen. ich mache das seperat".
**Hier stand bis zum 02.09.2026 „Startzeit der App auf dem Handy messen".** Wer den Plan liest
statt der Steuerdatei, hätte ihn wieder vorgetragen – der Punkt stand schon einmal in jeder
Übergabe. ✅ **Ohne Gerät gemessen (25.08.):** 877 kB gzip, davon 600 kB `fragen.js` – die
Poolgröße kostet Übertragung, keine Rechenzeit. Der Gerätewert bleibt offen und wird es bleiben.

---

### Was NICHT Teil dieser Runde ist (bewusst)
* **`lueckentext` hat nur 5 Fragen** — beobachtet, aber kein Auftrag. Der Typ ist ein Restposten;
  ob er ausgebaut oder aufgegeben wird, ist eine eigene Entscheidung.
* **Startlast-Umbau** — erst messen (Etappe 7).
* **Positionsverteilung der richtigen Antwort** (71 % auf Position 1) — **kein Handlungsbedarf**,
  die Optionen werden beim Anzeigen gemischt (`app_loeser.js:65`). Nicht „reparieren".

### Gesamtumfang zur Einordnung
**878 Fragen prüfen** (+ eingegliederte aus M09) · **85 neue Fragen schreiben** (44 + 18 + 18 + 5) ·
**4 neue Wächter** · **8 Releases**. Das ist ein Vorhaben in der Größenordnung von FB-R3 insgesamt,
nicht ein Arbeitsschritt.

## 📌 VORGEMERKT, NICHT BEGONNEN: „STARTLAST" (geplant 2026-07-26, Nutzer: „für später planen")
**Kein Eingriff erfolgt. Die App ist offline-fähig und schnell genug – das hier ist Vorsorge für
den Fall, dass der Pool weiter wächst.**

### Messwerte (26.07., Pool 983 Fragen, v1.8.0)
| | roh | gzip |
|---|---:|---:|
| **Startlast gesamt** (18 Dateien aus lernprogramm_ap1.html) | **2 548 KB** | **~686 KB** |
| davon `fragen.js` | 2 019 KB | 524 KB |
| davon der ganze Rest (Code + CSS + faelle + Spickzettel) | 529 KB | ~162 KB |

Innerhalb der Fragen-Nutzdaten (1 648 KB):
`erklaerungLang` **545 KB (33 %)** · `svg` 165 KB (10 %) · `frage` 162 KB (10 %) ·
`erklaerungKurz` 145 KB (9 %) · `optionen` 114 KB (7 %) · `distraktorErklaerungen` 100 KB (6 %) ·
`musterloesung` 84 KB (5 %) · `verweis` 55 KB (3 %).

### Warum das überhaupt ein Thema ist
* Beim Start werden **alle 983 Fragen samt langer Erklärungen** geladen; in einer Sitzung sieht der
  Lerner davon vielleicht zwanzig.
* `erklaerungLang` ist der größte Einzelposten – **und genau der ist mit v1.8.0 gewachsen**
  (Kernsatz + Stichpunkte + Merke). Jede weitere inhaltliche Runde vergrößert ihn.
* Der Service Worker cacht alles, aber **`CACHE_VERSION` wird bei jedem Release erhöht** → neuer
  Cache, alle Dateien werden erneut geholt (soweit der Browser-Cache sie nicht liefert).
* ⚠️ **NICHT dramatisieren:** über die Leitung gehen dank gzip ~686 KB, einmal je Version. Das ist
  für eine installierte PWA vertretbar. Es gibt KEIN gemessenes Ruckeln: `POOL_INDEX` liefert
  O(1)-Zugriff, und die Filterläufe über 983 Einträge sind in JS unkritisch.

### Optionen (mit ehrlichen Kosten)
1. **Nichts tun, nur beobachten.** Schwelle festlegen (z. B. „ab 1 500 Fragen neu bewerten").
   Aufwand null. Solange die App startet, wie sie soll, die vernünftigste Wahl.
2. **`erklaerungLang` auslagern.** Ein zweites, nachgeladenes Bündel (`erklaerungen.js`), das erst
   beim ersten Aufdecken einer Erklärung geholt wird. Spart ~33 % der Fragen-Nutzdaten beim Start.
   ⚠️ Berührt: `build_fragen.py` (zweites Ziel), **Drift-Guard** (zweite Datei), `sw.js`-Cacheliste,
   `_harness.js`/Tests (die lesen `FRAGEN` direkt) und die Offline-Fähigkeit (das Bündel muss
   trotzdem vorab gecacht werden, sonst fehlt es offline – dann ist nichts gewonnen).
   **Realistisch nur sinnvoll, wenn man die Offline-Garantie aufweicht.**
3. **Pro Modul aufteilen** (`fragen_m01.js` …). Größter Umbau, bricht die einfache
   `module.exports = FRAGEN`-Struktur, auf der 41 Suiten und der Drift-Guard aufsetzen.
   **Nicht empfohlen**, solange kein echtes Problem gemessen ist.

### ⚠️ OFFEN – ABER ERST NACH DER MESSUNG (Etappe 7 des Gesamtplans)
**Nicht vorher fragen.** Solange die Startzeit auf dem Gerät nicht gemessen ist, sind diese drei
Punkte nicht entscheidbar:
1. Ist die **vollständige Offline-Fähigkeit unantastbar**? Wenn ja, fallen Option 2 und 3
   praktisch weg – dann bleibt nur „beobachten".
2. Welche **Schwelle** soll neu bewerten auslösen (Fragenzahl, KB, Startzeit auf dem Handy)?
3. Soll vorher überhaupt **auf dem Gerät gemessen** werden? Bisher sind alle Zahlen Dateigrößen,
   **keine gemessene Startzeit**. Ohne Messung am Handy wäre jeder Umbau blindes Optimieren.

## 📌 DATENGRUNDLAGE „TRENNSCHÄRFE FREITEXT" (erhoben 2026-09-08)
> ✅ **ERLEDIGT AM 09.09. — `check.sh` IST WIEDER GRÜN.** Der Block bleibt als Datengrundlage und
> Verfahrensvorlage stehen; **die geltende Zahl misst `bash tools/suite.sh freitext`, nicht dieser
> Text.** Der Weg dorthin steht unten unter „DRITTE RUNDE 09.09.".

**Was gemessen wurde:** `test_freitext` prüfte die Regel „themenfremde Musterlösung gilt nie als
richtig" an **zwei festen Versätzen (7 und 13)** über die Liste der 123 Fragen mit
`schluesselbegriffe` — also an **246 von 15 006 möglichen Paaren.** Welche 246 das sind, entscheidet
die **Pool-Reihenfolge**: nach einem Einsortierlauf war M02-012 nicht mehr mit M02-305 gepaart,
sondern mit M02-205 — und ein Bestandsfehler wurde sichtbar, der seit Monaten dalag.
►► **Ein fester Versatz über eine veränderliche Liste ist eine VERDECKTE Stichprobe.**
✅ **Alle 15 006 Paare kosten 1,8 s** — die Vollständigkeit war geschenkt und ist seit 08.09. drin.

**Der Befund: 52 Durchrutscher bei 29 Fragen.** Die Meldung der Suite nennt sie mit Zähler:

| Fragen | Durchrutscher |
|---|---|
| M04-106 | 9 |
| M01-013 · M01-111 · M02-006 · M04-012 · M07-016 | je 3 |
| M04-015 · M04-322 · M05-110 · M06-017 · M08-014 | je 2 |
| 18 weitere | je 1 |

**Die Diagnose, an zwei Fällen belegt:**
* **M04-106 führt die nackten Ziffern `7`, `4`, `1` als Pflichtbegriffe** (die Ausgabe eines
  Schreibtischtests). Jede Musterlösung mit einer Sieben, einer Vier und einer Eins besteht —
  neun tun es, aus Nutzwertanalyse, TCO, Ergonomie, Härtung, SLA, Nachkalkulation und OSI-Modell.
  ⚠️ Nebenbei verletzt sie die Schema-Regel „String ODER Liste mit mindestens zwei Synonymen".
* **M02-012** (am 08.09. bereits behoben) hatte `Käufer` als Pflichtbegriff — getroffen über die
  **Tippfehler-Toleranz aus „zugekaufte"**, dazu `Nachfrage` aus „Nachträge". 3 von 4 Pflichtgruppen
  und 67 % reichten über die 65-%-Schwelle. Behoben nach Hausregel **„Grenze nicht anheben —
  Pflichtbegriffe schärfen"**: `Käufer` → `Käufermarkt`, `Verhandlungsstärke` von Kür auf Pflicht.

⚠️⚠️ **DIE GEGENPROBE HAT DIE EIGENE ERWARTUNG KORRIGIERT.** Erwartet war: sprechende
Pflichtbegriffe für M04-106 räumen alle neun Fälle ab, 52 → 43. **Gemessen: 46.** Drei fremde
Musterlösungen bestehen auch dann noch, weil „Ausgabe" und „Iteration" ebenfalls überall vorkommen.
►► **Wer eine dieser 29 Fragen schärft, misst danach nach** — die Zahl sagt, ob die Schärfung trug.
Der Lauf ist deterministisch: 52 → 46 → 52 beim Zurücksetzen.

**✅ ERSTE RUNDE 08.09.: 52 → 36 DURCHRUTSCHER, 29 → 27 FRAGEN.** Geschärft wurden
`M04-106` (9 → 0), `M04-012` (3 → 0), `M02-006` (3 → 1), `M01-111` (3 → 1) — Ziffern behalten,
aber je zwei sachliche Pflichtbegriffe davor (`Schreibtischtest`, die Schleifenbedingung,
`Nutzwertanalyse`, `Chatbot`).

⛔⛔ **ZWEI FALLEN, BEIDE AUF DEM WEG GETRETEN UND BEIDE VON WÄCHTERN GEFANGEN:**
1. **Einelementige Listen (`["7"]`) werfen die Frage STILL AUS DEM APP-POOL.** Das Schema verlangt
   String ODER Liste mit **mindestens zwei** Synonymen. Aufgefallen ist es nur, weil die Meldung
   die **Paarzahl** nennt: 14 520 statt 15 006 — also 121 statt 123 Fragen. `validate_schema` und
   `check.sh` waren still. ►► **Richtig ist `"7"`, nicht `["7"]`** (Klasse-9-Falle vom 04.09.).
   ⚠️ **Eine Kennzahl im Meldetext hat den Fehler sichtbar gemacht** — ohne sie wäre der Verlust
   zweier Fragen durchgegangen.
2. **Höchstens VIER Pflichtbegriffe je Frage** (`test_freitext`: „zu streng"). Fünf sind rot.
   Deshalb tragen M04-106 und M04-012 nur die erste und letzte Ausgabe als Ziffer.

**✅ ZWEITE RUNDE 08.09.: 36 → 30, 27 → 25 Fragen.** Fünf geschärft; ein Griff (`["Hop",…]` als
vierte Gruppe bei M04-322) machte es SCHLIMMER (2 → 3) und wurde zurückgesetzt — kurze Wörter
treffen über die Tippfehler-Toleranz breit.

**✅ DRITTE RUNDE 09.09. — ERLEDIGT: 30 → 2, 23 Fragen geschärft.** Volltext: `BUILD_LOG.md`
2026-09-09 (1). ⛔ **Nicht neu anfangen, nicht nachprüfen.** Die drei Hebel, in dieser Reihenfolge:
1. **Fachkern statt Allerweltswort** (Nutzer-Entscheid 09.09. für die Lessons-Learned-Dublette;
   M01-013 und M07-016 je 3 → 0, ohne Eingriff in Fragetext oder Musterlösung).
2. ⚠️⚠️ **DIE KÜR IST DIE ZWEITE HÄLFTE DER SCHWELLE.** Sieben Fragen brauchten KEINEN neuen
   Pflichtbegriff: die fremde Musterlösung traf 2–3 von 4 Pflichtgruppen und kam über die 65 % —
   getragen von Kür-Begriffen, die in beiden Texten stehen. `allePflicht` ist der eine Weg zu
   „richtig", `score >= 0,65` der andere. **Wer Trennschärfe sucht, liest die Kür mit.**
3. ⚠️ **Ein Pflichtbegriff wirkt über seinen STAMM** (`v.slice(0, max(4, len-3))`): `Zeitbox` →
   `zeit`, `Timebox` → `time`. Eine Netzwerk-Fehlersuche bestand so die Scrum-Frage M01-115.
   **Mehrwortbegriffe sind dagegen scharf** — `variantenTreffer` bricht beim Leerzeichen ab.

**✅ NUTZER-ENTSCHEID 09.09.: `test_freitext` TRENNT JETZT THEMENFREMD VON THEMENGLEICH.** Die
verbliebenen zwei — M02-011 ← M02-305 (Nutzwertanalyse), M02-109 ← M02-750 (Eisbergmodell) — sind
Paare aus demselben Feinthema: die höherstufige Musterlösung erklärt den Begriff der Stufe-1/2-Frage
sachlich mit. **10 der 30 waren von dieser Art.** Themenfremd = FEHLER (0), themengleich = HINWEIS
mit Zahl und IDs. ⛔ **Kein Freibrief:** steigt die Zahl, wachsen zwei Fragen eines Themas zusammen.

**Verfahren je Frage (bewährt, für die nächste Runde):** Pflichtbegriffe auf den FACHKERN ziehen,
der in keiner fremden Musterlösung steht — **UND die Kür daraufhin durchsehen**; nie die Schwelle
anfassen; Vorschläge mit `node tools/trennschaerfe.js --probe <datei>` durchrechnen, BEVOR
geschrieben wird (es misst die Azubi-Antworten aus `mess_freitext.js` mit); setzen mit
`tools/schluessel_setzen.py`; danach `bash tools/suite.sh freitext`.

## ✅ DATENGRUNDLAGE „STUFE-3/4-LÜCKEN" – ERHOBEN 07.09., ERLEDIGT 08.09.2026 (v1.24.0)
Sechs Fragen geschrieben; nachgemessen haben nur noch die drei ausgenommenen B3-Themen höchstens
eine Frage auf Stufe 3/4. **Tabelle, Begründung und der Hinweis zum M01-Lehrtext stehen verbatim
in `PLAENE_ARCHIV.md`, Abschnitt „ROTATION 2026-09-10".**
⚠️ **Der geltende Wert wird gemessen, nicht gelesen:** `node tools/pool_query.js stufe 3|4`.

## 📌 DATENGRUNDLAGE „STUFE-1-LÜCKEN" (erhoben 2026-07-26)
> ⚠️ **DIE VIER FRAGEN AM ENDE DIESES ABSCHNITTS SIND BEANTWORTET — NICHT ERNEUT STELLEN.**
> Nutzer-Entscheide vom 26.07.: **nur AP1-Gebiete A1–A5** (22 statt 26 Themen) · **je 2 Fragen**
> (= 44) · **„Stufe 1" = Begriffs-/Zuordnungsfragen wie im Bestand** · **ich schreibe und prüfe
> selbst**. Umgesetzt wird das als **ETAPPE 4 des Gesamtplans ganz oben**. Die Tabelle unten bleibt
> als Datenbasis; die vier ausgenommenen AP2-Themen sind dort mit aufgeführt.

> ✅ **NACHGEMESSEN AM 07.09. (Pool 1113, 81 Feinthemen): NOCH 4 THEMEN OHNE STUFE-1-FRAGE —
> UND ES SIND EXAKT DIE VIER AP2-THEMEN, DIE DER ENTSCHEID VOM 26.07. AUSGENOMMEN HAT**
> (M04 Subnetting · M08 Rechte & Pflichten · M08 Arbeitsschutz & Arbeitszeit · M08 Kündigung).
> **Die Etappe ist damit belegt durch, nicht nur abgehakt.** ⚠️ Die Zahl „26 von 73" darunter ist
> ein Messwert vom 26.07. und stand hier zwei Monate unwidersprochen — **eine Planungszahl, die
> niemand nachrechnet, hält einen erledigten Task offen.**

### Befund (gemessen am 26.07., Pool 983 Fragen)
**26 von 73 Feinthemen haben keine einzige Frage auf Schwierigkeitsstufe 1** – dem Einstieg.
Zusammen enthalten diese Themen 282 Fragen, alle auf Stufe 2 und höher. Poolweit liegen nur
90 von 878 Fragen auf Stufe 1.
* **Warum das den Lerner trifft:** `app_seiten.js` (Kandidatenauswahl) filtert hart auf
  `f.schwierigkeit === stufeFuer(f)` und fällt, wenn dabei nichts übrig bleibt, **auf den GANZEN
  gefilterten Pool** zurück – nicht auf die nächstniedrigere Stufe. Wer ein solches Thema als
  Anfänger wählt, bekommt also sofort Stufe 2 oder 3. Kein Fehler, aber ein fehlender Einstieg.
* **Maßstab aus dem Bestand selbst:** Bei den 47 Themen, die Stufe 1 haben, sind es im **Median 2**
  Fragen (Spanne 1–5). Zwei Einstiegsfragen je Thema entsprechen also der gewachsenen Norm –
  daraus ergäben sich rund **52 neue Fragen**.

### Die 26 Themen, nach Größe (= wie auffällig die Lücke ist)
| Priorität | Thema | Modul | Gebiet | Fragen | Stufen 1/2/3/4 |
|---|---|---|---|---:|---|
| 1 | UML & Schreibtischtest | M04 | A3 | 28 | 0/10/17/1 |
| 2 | OSI-Modell & Protokolle | M03 | A3 | 24 | 0/13/10/1 |
| 3 | Bezugskalkulation & Skonto | M02 | A2 | 22 | 0/3/16/3 |
| 4 | Englische Fachtexte | M02 | A1 | 19 | 0/11/8/0 |
| 5 | IP-Adressierung & Subnetting | M04 | B2 | 15 | 0/3/10/2 |
| 6 | Risiko & Stakeholder | M01 | A1 | 13 | 0/2/11/0 |
| 7 | Kommunikationsmodelle | M02 | A1 | 12 | 0/2/9/1 |
| 8 | Vertragsstörungen & Mängel | M07 | A5 | 12 | 0/7/4/1 |
| 9 | Soll-Ist & Nachkalkulation | M07 | A5 | 12 | 0/6/4/2 |
| 10 | Cloud & Virtualisierung | M03 | A2 | 11 | 0/3/7/1 |
| 11 | Härtung & Zugriffskontrolle | M06 | A3 | 10 | 0/7/2/1 |
| 12 | Praxisszenarien | M04 | A3 | 9 | 0/2/5/2 |
| 13 | Kündigung | M08 | B3 | 9 | 0/4/2/3 |
| 14 | Lizenzen & Urheberrecht | M04 | A2 | 8 | 0/3/5/0 |
| 15 | Qualitätskosten | M05 | A3 | 8 | 0/1/7/0 |
| 16 | Machbarkeit & Kalkulation | M01 | A1 | 7 | 0/1/6/0 |
| 17 | Bedarfsanalyse & Marktforschung | M02 | A1 | 7 | 0/2/5/0 |
| 18 | Präsentation & Quellen | M02 | A4 | 7 | 0/3/4/0 |
| 19 | Dateisysteme & Software | M03 | A2 | 7 | 0/1/6/0 |
| 20 | IT-Sicherheit und Datenschutz-Vorfall | M06 | A3 | 7 | 0/2/5/0 |
| 21 | Onsite/Remote & Nachfolgeaufträge | M07 | A5 | 7 | 0/2/4/1 |
| 22 | Rechte & Pflichten | M08 | B3 | 7 | 0/4/1/2 |
| 23 | Arbeitsschutz & Arbeitszeit | M08 | B3 | 6 | 0/5/1/0 |
| 24 | SMART-Ziele | M01 | A1 | 5 | 0/1/4/0 |
| 25 | KI im Störungsmanagement | M01 | A5 | 5 | 0/2/3/0 |
| 26 | Netzwerk- und Arbeitsplatz-Ausstattung | M03 | A2 | 5 | 0/2/3/0 |

⚠️ **Zwei Themen sind zusätzlich schlicht DÜNN** (unter 5 Fragen gesamt, unabhängig von der Stufe):
**Aufgabenanalyse & -synthese (4)** und **Managementtechniken (4)**. Sie stehen NICHT in der
Tabelle oben, weil sie Stufe-1-Fragen haben – gehören aber in dieselbe Entscheidung.

### ✅ DIESE VIER FRAGEN SIND AM 26.07.2026 BEANTWORTET – NICHT ERNEUT STELLEN
**Umfang:** nur AP1-Gebiete A1–A5 → 22 Themen. **Zahl je Thema:** 2 → 44 Fragen.
**„Stufe 1":** Begriffs- und Zuordnungsfragen wie im Bestand. **Erzeugung:** selbst schreiben und
selbst prüfen. Der historische Wortlaut der Fragen steht darunter, nur noch zur Nachvollziehbarkeit:

#### (historisch) Die vier Fragen, wie sie gestellt wurden
1. **Umfang:** alle 26 Themen (~52 Fragen) · nur die Top 10 (~20) · nur AP1-Gebiete A1–A5
   (dann fallen IP-Adressierung/B2 und die drei B3-Themen aus M08 weg).
2. **Zahl je Thema:** 2 (Median des Bestands) oder 3 (spürbarer, aber +26 Fragen mehr).
3. **Was heißt „Stufe 1" inhaltlich?** Im Bestand sind das Begriffs- und Zuordnungsfragen. Zu
   klären ist, ob es dabei bleibt oder ob auch einfache Ablesefragen an Bildern dazukommen –
   das entscheidet über die Formate (mc/zuordnung vs. bild/hotspot) und den Aufwand.
4. **Erzeugung:** selbst schreiben (langsam, aber fachlich sicher) oder Haiku-Batches je Modul
   mit anschließender fachlicher Einzelprüfung – wie bei FB-R3 Punkt 10 gehandhabt.

### Vorgehen, wenn freigegeben (steht fest, muss nicht neu erfunden werden)
* Änderungen **ausschließlich in `pool/*.json`**, danach `python3 build_fragen.py`, **Drift 0**.
* `validate_pool` + `idcheck` + `validate_schema` nach jedem Batch; IDs im Schema des jeweiligen Moduls.
* Voller Prüflauf über `bash check.sh block start → weiter → ende`.
* ⚠️ **Sollwerte ziehen mit:** `test_logik` und die modulbezogenen Suiten zählen Pool-Inhalte.
  Jede geänderte Zahl NUR in `sollwerte.env` nachziehen – und **Gegenprobe fahren**, sonst ist
  der neue Sollwert nur eine Behauptung.
* Fachprüfung Frage für Frage, keine Übernahme ungelesener Agenten-Ausgabe (Projektregel 4).
* Am Ende: `tools/fakten_check.py` laufen lassen (neue Rechts-/Normzahlen ggf. dort ergänzen).

# GESAMTPLAN-DETAILS 2026-07-15 (Phasen T/L/F; C nutzt die bestehenden #101/#102/#103/#50-Abschnitte,
# L3/L4 die bestehenden #71/#74/#75-Abschnitte, S-A den #77-Abschnitt)
Gemeinsames Sicherheitsnetz JEDES T-Tasks (Refactoring, Verhalten identisch): Vorher-Lauf aller 20 Suiten
(Sollwerte in TASKLIST Abschn. 2) → Änderung → Nachher-Lauf identisch + node --check je Modul + Offline-
Audit 0 + jsdom-Render-Stichprobe. Suiten paarweise (45s-Limit, TASKLIST Abschn. 4). Agent = Sonnet auf
/tmp-Kopie mit prompts/feature_draft.md; Opus liest den kompletten Diff und integriert per File-Tool.

## T1 (#78) Renderer-Registry für loeseFrage
Ziel: die ~17 Typ-Branches in loeseFrage (app_loeser.js) in eine Registry `R_TYP = {typ: function(f, ctx)}`
überführen; loeseFrage wird Rahmen (Meta/Stern/Melden/Notiz/Glossar/Hilfe/Abruf) + Dispatch
`(R_TYP[typVon(f)] || skipPanel)(f, ctx)`. ctx kapselt {host, opts, onGraded-Wrapper, setAktion, feedback}.
REGELN: reiner Umbau, KEINE Verhaltensänderung; bild dispatcht auf unterTyp-Renderer über der Grafik;
Sonderpfade (fehlersuche→hotspot-ähnlich, generator) beibehalten; #91-Guard bleibt VOR dem Dispatch.
Vorgehen: Sonnet-Agent bekommt app_loeser.js + app_frage.js + ARCHITECTURE.md; Schnitt je Branch mechanisch
(Code verschieben, nicht umschreiben). Prüfung: 20 Suiten identisch + jsdom-Solve ALLER 18 Typen (je 1
richtig + 1 falsch, Muster aus VOLLPRÜFUNG 2026-07-11). VORAB Nutzer fragen: Registry auch für renderFrage
(Sim-Renderer, app_frage.js) im selben Task oder als Folgetask?

## T2 (#84) Inline-Styles → CSS-Klassen
Ziel: style="…"-Attribute in el()-Strings der app_*.js durch Klassen in styles.css ersetzen (Themes/Dark
Mode konsistent). Vorgehen: grep -n 'style="' app_*.js → Liste; Agent schlägt Klassennamen+CSS vor
(bestehende Variablen --panel/--rand/--text nutzen); mechanisch ersetzen. Prüfung: 20 Suiten + visueller
jsdom-DOM-Vergleich (className statt style vorhanden); KEINE Layout-Logik ändern. Rest-styles mit
dynamischen Werten (z. B. width in Fortschrittsbalken) BLEIBEN inline – nur statische auslagern.

## T3 (#85) TEXTE-Zentralisierung
Ziel: wiederkehrende UI-Strings (Buttons, Panel-Titel, Leerzustände, Fehlermeldungen) in `var TEXTE = {…}`
(app_util.js, vor ersten Nutzern geladen). NICHT: Fragen-/Pool-Inhalte, Erklärungen, einmalige Strings.
Umfang klein halten (~40–60 Keys). Prüfung: 20 Suiten + grep, dass keine TEXTE-Keys undefined rendern.

## T4 (#83) CONFIG-Konstanten
Ziel: Magic Numbers zentral. logik.js → L.CONFIG (Sperrfrist 10, FD-Intervalle 1/3/7 Tage, 3-Treffer,
Level-Schwellen ≥4/≤1 von 5, Gewichtungs-Floor 0.15, Interleaving-Malus 0.3, Serie 5, Gate 30);
app_state.js → APP_CONFIG (Teilpunkte-Schwelle 65/35 %, Sim-Default 40 Fragen, FD-Einstreuung 1/5,
Generator-Einstreuung 1/4, Tagesziel 20). Werte UNVERÄNDERT übernehmen; Verwendungsstellen per grep
finden und ersetzen. Prüfung: 20 Suiten identisch (Werte-Identität ist der Test).

## T5 (#82) State-Kapselung (Umfang VORAB mit Nutzer klären!)
Minimal-Variante (empfohlen): Schreibzugriffe bündeln – Helfer `setS(pfad, wert)` + `mutS(fn)` rufen
intern speichere(); direkte `S.x = …; speichere()`-Paare ersetzen. KEINE Getter-Abstraktion (Lesezugriffe
bleiben `S.x` – zu invasiv). Alternative Maxi-Variante (nur auf Nutzerwunsch): echtes Modul mit Zugriffs-API.
Prüfung: 20 Suiten + LocalStorage-Roundtrip + grep auf vergessene nackte speichere()-Paare.

## T6 (#96) Version/Changelog
`var APP_VERSION = "…"` (app_state.js) + Anzeige in sEinstellungen (klein, unten) + CHANGELOG.md
(nutzergerichtete Kurzliste je Meilenstein, aus BUILD_LOG destilliert). Direkt durch Opus (<50 Z.).

## L1 (G1) Bereitschafts-Score
Alles vorhanden: je Thema Relevanz (L.THEMA_RELEVANZ) × Quote (S.statistik["T:"+modul+":"+thema]).
Score = gewichteter Mittelwert der Themen-Quoten (Gewicht = Relevanz; Themen ohne Daten neutral 50 % mit
Kennzeichnung „zu wenig Daten"). Anzeige: Panel in sStatistik (je Modul + gesamt, Ampel) + kompakte Zeile
auf sStart. Reine Anzeige-Logik in logik.js (L.bereitschaft(statistik) – testbar!) + Render in app_pages2.
Neuer Test tests/test_bereitschaft.js (Berechnung, Randfälle leer/voll). VORAB Nutzer fragen: Schwellen
der Ampel (z. B. <60 rot / 60–80 gelb / >80 grün)?

## L2 (G3) Lernplan aus Prüfungsdatum (24.02.2027)  — ENDGÜLTIG GESTRICHEN 2026-07-15 (Nutzer-Entscheid; nicht mehr anbieten)
Plan = f(Resttage bis S.pruefungsdatum, anzahlBeantwortet, schwächste relevante Themen aus L1-Aggregation,
S.tagesziel). Ausgabe: Panel „Dein Lernplan" (sStart oder eigene Kachel): empfohlene Fragen/Tag, 3–5
Fokus-Themen der Woche mit Link in themengefiltertes Üben, Simulations-Empfehlung (z. B. 1/Woche ab 8
Wochen vor Termin). Logik in logik.js (L.lernplan(ctx) – testbar), Render app_pages2. Test
tests/test_lernplan.js. Hängt von L1 ab (nutzt Bereitschafts-Aggregation). VORAB Nutzer fragen:
Kachel oder Start-Panel? Simulations-Frequenz?

## F1 GitHub-Repo + Pages einrichten (mit Nutzer)
Mount verbietet git → Arbeitskopie: Ordnerinhalt (ohne Backups/PDF/.tooling/ziOrM0Wa) in ein frisches
/tmp-Repo kopieren, git init + commit dort, Nutzer legt GitHub-Repo an (privat reicht NICHT für Pages –
public oder Pages-fähiger Plan; VORAB klären!), Push via vom Nutzer bereitgestelltem Token/Remote oder
Nutzer pusht selbst (Zip-Übergabe). Pages auf main/root. Prüfung: Seite lädt am Handy, LocalStorage
funktioniert. WICHTIG: Pool/Inhalte sind eigene Werke – Prüfungskatalog-PDF und Kursmaterial-MDs NICHT
mit veröffentlichen (Exclude-Liste wie tools/backup.sh + 0X_*.md + 99_Spickzettel.md prüfen: Spickzettel
wird als spickzettel.js gebraucht → nur die .md ausschließen).

## F2 (#48) PWA-Dateien
Detailplan existiert unten („Feature 48"): manifest.webmanifest (name/short_name/start_url "."/standalone/
Icons 192+512 maskable), sw.js (Cache-First, versionierter Cache, activate-Cleanup, ALLE App-Dateien in
der Cache-Liste – inkl. der 9 app_*.js + abkuerzungen.js!), Registrierung nur bei http(s)-Protokoll
(file:// still übersprungen), iOS-Meta-Tags. Prüfung: node --check sw.js, Manifest-JSON valide,
Cache-Liste == HTML-Skriptliste (Skript-Abgleich!), Doppelklick-Betrieb unverändert, Offline-Audit
weiter 0 (SW-Registrierung ist relativ, keine externe URL).

## F3 Mobil-Feinschliff
Am installierten Stand (F1/F2) durch NUTZER am Handy: alle 18 Typen einmal lösen (Checkliste wird
gestellt), Fokus auf zuordnung/matrix/reihenfolge/beschriftung/baukasten (Touch), Touch-Ziele ≥44px
(CSS-Audit vorab per Agent). Befunde als Meldungen → gezielte Fixes.

# S1–S3: Struktur-Verbesserungen (2026-07-12 vom Nutzer eingeplant, VOR A6)

## S1 Pool-Konsolidierung (70 → ~9 Dateien)
Ziel: pool/ von 70 historisch gewachsenen Dateien auf je EINE pro Modul reduzieren:
pool_m01.json … pool_m08.json + pool_faelle.json. Vorgehen (python auf dem Mount, wie bei A5):
alle pool_*.json laden (außer faelle), Fragen nach modul gruppieren, innerhalb nach id sortieren,
in die 8 Zieldateien schreiben (ensure_ascii=False, indent=1); ALTE Dateien erst entfernen, wenn
Verifikation grün. VERIFIKATION (Pflicht): fragen.js vorher/nachher als MENGE identisch
(Vergleichsskript über id+kompletten JSON-Inhalt, Diff MUSS leer sein); bash check.sh voll grün;
720 Fragen unverändert. ACHTUNG Mount: Löschen alter Dateien kann an Rechten scheitern (wie .git) →
dann Alt-Dateien per Überschreiben zu leeren Arrays [] machen (Schreiben geht immer) und den Nutzer
bitten, die leeren Dateien im Explorer zu löschen (Liste ausgeben).

## S2 tests/-Ordner + Auto-Glob in check.sh
test_logik.js, test_a3.js, test_a4.js, test_migrate.js → tests/ verschieben, sprechend benennen
(test_logik.js, test_engine.js, test_diagnose.js, test_state.js). check.sh kopiert weiter flach nach
/tmp (require-Pfade der Tests bleiben dadurch gültig – prüfen!) und ersetzt die harte Aufruf-Liste
durch eine Schleife über tests/test_*.js (schnell-Modus: nur test_logik). Verifikation: check.sh voll
+ schnell grün; einmal absichtlicher Dummy-Fail-Test → wird erkannt → wieder entfernen.
ZUSÄTZLICH (Token-Vorbereitung für alle künftigen Feature-Tests): gemeinsames tests/_harness.js
extrahieren – boot(preState) mit JSDOM.fromFile + confirm/alert-Stubs + localStorage-Stub + Wartezeit,
dazu t()/close()-Helfer. test_engine/test_diagnose/test_state darauf umstellen (Verhalten identisch,
Suiten bleiben grün). Jede künftige Testdatei halbiert sich damit.

## S3 COVERAGE generieren statt pflegen
Neues Kommando `node tools/pool_query.js coverage`: Matrix Modul × Thema × Typ × Schwierigkeit live
aus fragen.js (Konsole, optional > COVERAGE_GEN.md). Alte COVERAGE.md bekommt Kopf-Hinweis
„VERALTET (Stand 612 Fragen) – aktuelle Zahlen: pool_query coverage" (Umbenennen am Mount evtl.
gesperrt → Hinweis-Variante reicht). Verifikation: Stichproben gegen pool_query themen/typen.

## Notizen für später
- A8 (JS-Auslagerung): CSS im selben Zug in styles.css auslagern (gleicher Handgriff/Verifikation).
- tools/pool_query.js: Kommando `next-id <modul>` ergänzen (max+1, gegen ID-Kollisions-Historie).
- Idee, NICHT eingeplant (Nutzer-Entscheid 2026-07-12): Fortschritts-Export/-Import (LocalStorage
  als JSON-Datei sichern/laden) – bei Block B erneut anbieten, schützt Lernfortschritt vor Browserwechsel/Cache-Löschung.

# IDEENSPEICHER „Block G" (2026-07-12, NICHT eingeplant – nur Struktur-Vorbereitung dokumentiert)
Vier Feature-Kandidaten, dem Nutzer vorgestellt, Entscheidung vertagt. Damit die spätere Umsetzung
ohne Neuanalyse startet, hier die vorhandenen Bausteine, auf denen sie aufsetzen:
- **G1 Bereitschafts-Score:** alles vorhanden – L.THEMA_RELEVANZ (Relevanz je Thema) ×
  S.statistik["T:"+modul+":"+thema] (Quote je Thema); nur Aggregation + Panel in sStatistik/sStart.
- **G2 Selbstbewertungs-Simulation (ungebundene Aufgaben wie echte AP1):** nutzt freitext/erklaeren-
  Bestand (95 Fragen mit Musterlösung) + erklaerungLang als Bewertungsraster; neuer Modus analog
  sSimulation, Punkte-Selbstvergabe je Teilaufgabe (Slider 0–max), Ergebnis in simHistorie
  (Feld selbstbewertet:true). Kein neuer Fragetyp nötig.
- **G3 Lernplan aus Prüfungsdatum:** S.pruefungsdatum existiert (sEinstellungen); Plan = f(Resttage,
  anzahlBeantwortet, dünnste relevante Themen aus G1-Aggregation, S.tagesziel). Reine Anzeige-Logik.
- **G4 Altprüfungs-Analyse-Workflow:** KEINE 1:1-Übernahme (Urheberrecht!). Workflow: Nutzer legt
  gekaufte Altprüfungen als PDF in einen NICHT versionierten Ordner → Agent extrahiert nur
  Themen-/Format-Frequenzen → Hauptmodell kalibriert L.THEMA_RELEVANZ + beauftragt eigene Nachbauten
  der Aufgaben-MUSTER via prompts/fragen_batch.md.
Umsetzungsrezepte: Features → prompts/feature_draft.md; neue Fragetypen → prompts/fragetyp_neu.md.

# GEPLANT (2026-07-11): SVG-Zoom + PWA (Android/iPhone) – Umsetzungsplan

## Feature 47 – SVG-Zoom (Grafik vergrößern)
Ziel: Bild-, Hotspot- und Beschriftungsgrafiken vergrößert ansehen (v. a. auf dem Handy).
CSS: `.svgbox{position:relative}`; `.svgbox .zoombtn{position:absolute;top:6px;right:6px;…}`; Overlay
`.zoomoverlay{position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:999}`
mit SVG auf max 92vw/92vh skaliert; Dark-Theme berücksichtigen.
JS: Helfer `oeffneZoom(svgHtml)` baut Overlay (`el`), fügt SVG groß ein, schließt bei Klick auf Hintergrund/✕/Esc
(keydown-Listener registrieren UND beim Schließen entfernen; kein doppeltes Overlay). Umsetzung per EVENT-DELEGATION:
einmaliger `document`-Click-Handler reagiert auf `.zoombtn` und nimmt das SVG der zugehörigen `.svgbox` → deckt alle
4 svgbox-Vorkommen (Z. 455/688/858/953) mit EINER Stelle ab. Jede svgbox bekommt beim Erzeugen einen ⤢-Button
(zentral, z. B. kleine Wrapper-Funktion statt 4× Copy-Paste). Interaktive Hotspot-Zonen bleiben klickbar (Zoom nur
über den Button, kein Konflikt); im Overlay ist die Grafik nur zum Ansehen.
Token-Spar-Agenten (Sonnet): Agent A entwirft CSS + `oeffneZoom` + Delegation-Handler; Agent B jsdom-Test
(⤢ öffnet Overlay mit vergrößertem SVG; Esc/Hintergrund schließt; Listener wird entfernt). Ich: Integration in die
eine HTML, node --check Inline-JS, jsdom-Render aller SVG-Typen, Mobil-Viewport-Check, Offline, Checkpoint.

## Feature 48 – Installierbar als App (PWA) – Ziel: Android, wenn möglich iPhone
WICHTIG (Auslieferung): Handys können keine `file://`-HTML per Doppelklick öffnen. Für mobil muss der Ordner
ausgeliefert werden (z. B. GitHub Pages / beliebiger Webspace / lokaler Server). Der Desktop-Doppelklick-Offline-
Betrieb bleibt unverändert (SW-Registrierung wird bei `file://` still übersprungen, keine Fehler).
Dateien:
- `manifest.webmanifest`: name, short_name, `start_url:"."`, `display:"standalone"`, theme_color, background_color,
  icons 192/512 px (maskable). Icon als PNG oder eigenständige SVG.
- `sw.js` (separate Datei): Cache-First für alle App-Dateien (HTML, logik/fragen/faelle/spickzettel.js, manifest, icons),
  versionierter Cache + activate-Cleanup → echte Offline-Fähigkeit der installierten App.
- `<head>`: `<link rel="manifest">`, `<meta name="theme-color">`.
ANDROID (Chrome): erfüllt Installierbarkeit über manifest+SW → „App installieren"/„Zum Startbildschirm".
iPHONE (Safari): zusätzlich `<meta name="apple-mobile-web-app-capable" content="yes">`,
  `<meta name="apple-mobile-web-app-status-bar-style">`, `<link rel="apple-touch-icon" href="…180.png">`.
  Installation über Teilen → „Zum Home-Bildschirm". Hinweis: Safari-SW/Offline eingeschränkter, aber App startet
  standalone; Grundfunktion (LocalStorage, Offline nach erstem Laden) funktioniert.
Registrierung im Inline-JS: `if('serviceWorker' in navigator && location.protocol.startsWith('http')) register('sw.js')`.
Kurzanleitung (README): „Ordner hosten (z. B. GitHub Pages) oder lokal `python -m http.server`, im Handy-Browser
öffnen → installieren." Mobil-Feinschliff prüfen: Touch-Ziele ≥44px, Drag&Drop-Typen (zuordnung/matrix/reihenfolge)
auf Touch testen, Viewport bereits gesetzt.
Token-Spar-Agenten (Sonnet): Agent A entwirft manifest + sw.js + Icons(SVG) + Registrierungs-Snippet + iOS-Meta;
Agent B validiert Manifest-JSON, `node --check sw.js`, simuliert Registrierungslogik (file:// übersprungen /
http registriert) und prüft Cache-Liste vollständig. Ich: Integration, sicherstellen dass Doppelklick weiter offline
läuft, Offline-Audit, (optional) Render im Mobil-Viewport, Checkpoint. Icons ggf. mit imagegen-Skill erzeugen.

# GEPLANT (2026-07-11): 9 Features – Umsetzungspläne (Entscheidungen geklärt)
Grundsatz: Erstellung/Entwurf durch Sonnet-Agenten, Integration + vollständige Prüfung durch mich im Loop bis
zufrieden; bei weiteren Design-Entscheidungen während der Umsetzung nachfragen. Gemeinsamer Abschluss je Feature:
Inline-JS node --check → jsdom-Render aller Routen/betroffenen Typen → LocalStorage-Roundtrip → Offline-Audit
(keine CDN) → Grade-Konsistenz unberührt → BUILD_LOG/TASKLIST-Checkpoint.

## #49 Fehlerbild-Aufgaben  [Entscheidung: vorhandenen hotspot-Typ nutzen → nur Inhalte]
~8–10 neue hotspot-Fragen: SVG zeigt eine Konfiguration (ipconfig-Ausgabe, kleines Netzdiagramm, RAID-Setup) mit
mehreren Werten als Zonen; die FEHLERHAFTE Stelle ist die richtig-Zone („Klicke den Fehler an"). Themen M03/M04/M06.
Kein Code – gradeHotspot/sHotspot bestehen. Agent entwirft SVG+Zonen nach striktem Koordinaten-Template (wie
hotspot2). Ich prüfe: Zone==Box-Koordinaten, genau 1 richtig, im viewBox, SVG parst UND fachlich (der markierte
Wert ist wirklich falsch, alle anderen korrekt), Render. ID-Range separat (z. B. M03-980+, M04-997+, M06-970+).

## #50 2-Schritt-Entscheidungen  [Entscheidung: viele kleine, im Üben]
Neuer Fragetyp „szenario2" in logik.js (TYPEN + Validierung + gradeSzenario2) und Renderer-Branch in loeseFrage.
Schema: {situation, schritt1:{frage,optionen[],loesungIndex}, schritt2:{frage,optionen[],loesungIndex}, feedback1[]}
– zeigt Situation, Schritt-1-Auswahl → kurzes Konsequenz-Feedback → Schritt-2-Auswahl. Wertung: beide Schritte
richtig = korrekt (Feedback nach jedem Schritt). Agent A: entwirft grade+Validierung+Renderer isoliert; Agent B:
liefert Inhalte (Rhaus-Metall, M04/M06/M07/M01). Ich: Engine integrieren, node-Tests + gcheck erweitern, jsdom-Render,
Eindeutigkeit/Logik jeder Aufgabe selbst prüfen. (Scoring-Detail Teilpunkte: bei Umsetzung nachfragen.)

## #51 IHK-Relevanz-Gewichtung  [Entscheidung: ICH setze Relevanz nach neuesten IHK-Prüfungen]
Schritt 0: Web-Recherche der aktuellen IHK-AP1-Teil-1-Schwerpunkte (neueste Prüfungstermine priorisiert). Daraus
`L.THEMA_RELEVANZ = {thema: 3|2|1}` (hoch/mittel/niedrig). Integration in die Fragenauswahl (Üben-Deck): gewichtete
Ziehwahrscheinlichkeit ∝ Relevanz. Toggle in sEinstellungen „prüfungsnah gewichten (an/aus)" → S.relevanzGewichtung.
Agent: entwirft die gewichtete Auswahl-Logik + Toggle. Ich: Recherche + Relevanz-Tabelle selbst festlegen/belegen,
statistische Prüfung (hohe Relevanz wird messbar öfter gezogen), keine Frage wird nie gezogen.

## #52 Zurück-Navigation (Üben)
Session-Array `uebenVerlauf` der gezeigten IDs; „← Zurück"-Button (Footer/Kopf) rendert die vorige Frage erneut
(ohne erneute Fehlerdeck-Buchung). Nur Session, kein persistenter State. Agent draftet + jsdom-Test (mehrere Fragen,
zurück, wieder vor). Ich integriere/prüfe.

## #53 Tooltip-Glossar  [Entscheidung: kuratierte Begriffsliste]
Begriff→Kurzdefinition-Map aus den erklaeren-Fragen (Logik wie sGlossar, Begriffe ≤ ~40 Zeichen). In loeseFrage den
Fragetext scannen und MAX 1–2 exakte Begriffs-Treffer in `<span class='glossar-term' title/tap>` wrappen; Tooltip mit
Kurzdefinition (Hover Desktop / Tap Handy). Schutz: esc-sicher, keine Treffer in Antwortoptionen, kein Antwort-Leak,
keine doppelten Wraps. Agent draftet Extraktion + CSS/JS + Tooltip. Ich prüfe: HTML intakt, Treffer korrekt,
Leak-Frei (Begriff verrät nicht die Lösung), Render Desktop+Mobil.

## #54 Swipe-Gesten (Handy)
touchstart/touchend am #main: horizontaler Swipe (Schwelle ~60px, kein vertikaler Scroll) → nächste/vorige Frage
(nutzt #52). KONFLIKT-Schutz: bei Drag&Drop-Typen (zuordnung/matrix/reihenfolge/beschriftung/baukasten/trace-Eingaben)
Swipe deaktivieren bzw. nur an einer dedizierten unteren Leiste. Agent draftet + Test mit simulierten TouchEvents.
Ich prüfe Konfliktfreiheit mit Drag-Typen und dass normales Scrollen nicht blockiert wird.

## #55 Fokus-/Konzentrationsmodus
Umschalter (Kopf) setzt `body.classList.toggle('fokus')` + `S.fokus` (persistiert, via #56 migriert). CSS blendet
Sidebar/Nav + Statistik-/Nebenpanels aus, zentriert die Aufgabe breiter. Agent draftet CSS+Toggle+Test. Ich integriere/prüfe
(alle Routen bleiben erreichbar, Umschalten überall möglich).

## #56 Schema-Versionierung/Migration  [Fundament – möglichst zuerst umsetzen]
Zentrale `migrate(state)` + `S.version`: füllt fehlende Felder aller Features (markiert, simDauerMin, fokus, meldungen,
relevanzGewichtung, uebenVerlauf gehört nicht dazu weil Session) mit Defaults, bumpt Version, ersetzt verstreute
„|| {}"-Fallbacks. Läuft direkt nach dem Laden in ladeState(). Agent draftet migrate + Tests (alter/teilweiser State →
vollständig migriert, idempotent). Ich prüfe Rückwärtskompatibilität mit einem echten Alt-State.

## #57 „Frage melden"-Button
⚑-Button je Frage (neben Stern/Notiz) → kleine Eingabe (Grund optional) → `S.meldungen[id]={grund,datum}`. In
sEinstellungen: Liste der gemeldeten Fragen ansehen, einzeln entfernen, als Text/JSON exportieren. Agent draftet
Button + Speicherung + Export-Ansicht + Test. Ich integriere/prüfe (Persistenz, Export korrekt, kein Einfluss auf Wertung).

# GEPLANT (2026-07-11): 10 Features (Batch 3) – Umsetzungspläne (Entscheidungen geklärt)
Entwurf durch Sonnet-Agenten, Integration + Prüfung durch mich im Loop; bei Detail-Entscheidungen nachfragen.
Gate-Helfer für „ab >30 Fragen": `anzahlBeantwortet()` = Summe aller `S.statistik[modul].gesamt`. Persistente
Felder über #56 (migrate) einführen. Abschluss je Feature: node --check → jsdom-Render → LocalStorage-Roundtrip →
Offline-Audit → Checkpoint.

## #58 IT-Taschenrechner-Overlay  [Entscheidung: IT-erweitert]
Kleiner „🖩"-Button (Kopf/Footer) öffnet ein Overlay-Panel: Grundrechnen + Umschalter DEC/BIN/HEX (Live-Umrechnung
der Eingabe), Modulo, Zweierpotenzen-Tabelle (2^0..2^16). Standardmäßig geschlossen, überlagert die Aufgabe ohne
Fokusklau (kein Neu-Rendern der Frage), schließbar/verschiebbar. Agent A: Rechner-Logik (Parser, Basiswechsel,
mod, pow) + UI; Agent B: node-Test der Rechen-/Umrechnungslogik (Stichproben gegen unabhängige Berechnung).
Ich: Integration, Rechnungen selbst gegenprüfen, kein Layout-/Tastatur-Konflikt.

## #59 Skizzen-/Notizfeld (Canvas)  [unaufdringlich]
Ausklappbares Freihand-Canvas (Maus+Touch, Stift/Radierer/Löschen) neben der Aufgabe. Standard zu, nur auf Wunsch
offen; NICHT persistiert (gilt für aktuelle Aufgabe/Session). pointer-events sauber, kein Konflikt mit Drag&Drop-
Fragen und kein Blockieren des Scrollens. Agent draftet Canvas+Toggle+Test; ich prüfe Touch/Maus + Konfliktfreiheit.

## #60 Ähnliche Fragen üben  [Entscheidung: gleiches Thema, Fallback Modul; ab >30]
Nach falscher Antwort Button „Mehr zu diesem Thema" → kleine Serie aus demselben `thema` (Fallback `modul`), mit
passtAP-Filter, ohne Wiederholung der aktuellen Frage. Nur sichtbar wenn `anzahlBeantwortet() > 30`. Agent draftet
Auswahl+UI+Test; ich prüfe Gate, Themenfilter, keine Endlosschleife.

## #61 IT-Abkürzungs-Lexikon  [ab >30]
Neuer Nachschlage-Bereich (Route/Kachel, erst ab >30 Fragen sichtbar) mit durchsuchbarer Liste IT-Abkürzung →
Auflösung + Kurzdefinition (DNS, DHCP, VLAN, RAID, OSI, ARP, NAT, VPN, TCP/UDP, SSD, USV, SLA, DSGVO, …). Inhalt als
eigene Datei (z. B. abkuerzungen.js oder Pool), Route analog sGlossar. Agent liefert kuratierte Liste; ich prüfe
fachliche Korrektheit jeder Auflösung + Gate + Render/Suche.

## #62 Adaptive Wiederholungsdichte  [ab >30]
Üben-Auswahl zusätzlich nach Themenschwäche gewichten (Gewicht ∝ 1 − Trefferquote je `thema`, geglättet). Erst aktiv
ab >30 Fragen (genug Daten). Muss mit Fehler-Deck-Einstreuung UND geplanter IHK-Relevanz (#51) additiv/multiplikativ
sinnvoll kombinieren (kombinierte Gewichtung, nichts fällt auf 0). Agent draftet Gewichtungsformel+Integration;
ich prüfe Verteilung statistisch (schwache Themen messbar häufiger) und Zusammenspiel mit #51/#62.

## #63 „Warum falsch?"-Diagnose  [Entscheidung: überall wo möglich]
Schrittbasiert (rechenassistent/kalkulation/trace): ersten falschen Schritt hervorheben + Sollwert nennen.
Auswahl (mc/bild-mc/dropdown/mehrfach): vorhandene `distraktorErklaerungen` zur gewählten falschen Option zeigen
(falls vorhanden), sonst generisch „richtig wäre …". Dezent/überspringbar (nur bei Bedarf ausklappen). Agent draftet
Diagnose je Typ; ich prüfe, dass wirklich der erste Fehlerschritt / die passende Distraktor-Erklärung erscheint.

## #64 Farbenblind-freundlich (✓/✗)  [Einstellung, default AUS]
Zusätzlich zu Farbe kleine ✓/✗-Symbole an Richtig/Falsch-Markierungen aller Fragetypen-Feedbacks. Schalter in
sEinstellungen (`S.farbsymbole`, default false). Agent draftet CSS + zentralen Markierungs-Hook + Test; ich prüfe
alle Typ-Feedbacks (mc, dropdown, hotspot, matrix, … ) mit/ohne Symbole.

## #65 ARIA/Alt-Texte für SVG  [Einstellung, default AUS]
Bei aktivierter Barrierefreiheit: SVG-Grafiken bekommen `role='img'` + `aria-label` (aus frage/verweis), damit
Screenreader sie beschreiben. Schalter in sEinstellungen (`S.ariaAltTexte`, default false), gebündelt mit #64 unter
„Barrierefreiheit". Agent draftet Alt-Text-Erzeugung + Injektion in `.svgbox`; ich prüfe valides ARIA, kein Render-Bruch.

## #66 Onboarding-Tour  [überspringbar]
Beim ersten Start (S.onboardingDone false) 3–5-Schritt-Overlay: Üben, Fehler-Deck, Simulation, Statistik, Einstellungen.
Buttons „Weiter", „Überspringen", „Nicht mehr zeigen" → setzt onboardingDone. Reaktivierbar in Einstellungen.
Agent draftet Tour-Overlay+Steuerung+Test; ich prüfe Skip/Persistenz/kein Blockieren.

## #67 Kontext-Hilfe pro Aufgabentyp  [am Erklärfenster abschaltbar]
Beim ersten Auftreten eines interaktiven Typs kurze Bedienhilfe (z. B. „Ziehen oder erst Begriff, dann Ziel antippen").
Direkt in der Hilfe ein „Diese Hinweise nicht mehr zeigen"-Häkchen → `S.typHilfeAus[typ]=true` (bzw. global). Agent
draftet Einblende-Logik je Typ + Abschalt-Häkchen + Test; ich prüfe pro Typ, Persistenz der Abschaltung.

# GEPLANT (2026-07-11): 10 Inhalts-Tasks (Batch 4) – Umsetzungspläne (Entscheidungen geklärt)
Grundsatz: Entwurf durch token-sparende Sonnet-Agenten, Integration + vollständige Prüfung durch mich im Loop;
bei ALLEN Detail-Entscheidungen vorher den Nutzer fragen. Standard-Verifikation je Inhalt: build_fragen →
node test_logik (Schema/Duplikate) → Pool-Audit (Modul/Thema/Prüfungsteil/Indizes/Schwierigkeit) → Grade-Konsistenz
→ fachliche Nachrechnung/Faktencheck → Checkpoint.

## #68 Stufe-4-Aufgaben  [Umfang: wenige, gezielt]
Nur wo am nötigsten wenige schwere Aufgaben (schwierigkeit 4) ergänzen. Korrekt einsortiert: kanonisches thema,
pruefungsteil-Regel, keine Dup-IDs, jac<0.85. Agent entwirft je Block; ich prüfe fachlich + Audit. Vorab klären:
Anzahl, Module/Themen, Formate.

## #69 Distraktor-Erklärungen (alle Auswahlfragen)
`distraktorErklaerungen` ergänzen wo fehlend (mc/bild-mc/mehrfach), in Blöcken (~20). Agent entwirft je Frage EINE
Kurzbegründung je falscher Option; ich prüfe JEDE fachlich (Option wirklich falsch, Begründung korrekt). Voraussetzung
für #63. Vorab klären: Priorität/Reihenfolge, Blockgröße.

## #70 Normen/Zahlen aktualisieren
Aktualität prüfen (Wi-Fi 6/7, USB4, DDR5, DSGVO/BBiG-Zitate, Standards/Jahreszahlen). ICH recherchiere an
Primärquellen (Web); Agent schlägt konkrete Textkorrekturen vor; ich verifiziere jede Änderung. Vorab klären:
welche Fragen ändern, Formulierungen.

## #71 Transferaufgaben (zwei Themen)
Wenige Aufgaben, die zwei Themen koppeln (z. B. Subnetting+Kosten, Netzplan+Risiko). Leit-Modul/Thema festlegen,
pruefungsteil-Regel beachten (Subnetting/ER→AP2!). Agent entwirft; ich rechne/prüfe. Vorab klären: Kombinationen,
Anzahl, Modul/Thema-Zuordnung.

## #72 Rechenthemen-Varianten  [gleichmäßig verteilt, wenige]
Wenige zusätzliche Varianten (Subnetting, GiB/GB, Übertragung, Energie, Netzplan), GLEICHMÄSSIG über Themen und
Schwierigkeitsstufen. Werte per Code nachgerechnet (verifycalc erweitern). Agent entwirft; ich verifiziere jede
Rechnung. Vorab klären: welche Themen, Anzahl je Stufe.

## #73 Aufgaben-Metadaten (Zeit/Punkte)  [pauschal je Typ]
`L.TYP_META = {typ:{sek, punkte}}` als Standard je Aufgabentyp (optional pro Frage überschreibbar). Genutzt in
Timer (#45) + Simulation. Agent entwirft Map + Anbindung; ich prüfe Plausibilität. Vorab klären: konkrete Sekunden/
Punkte je Typ.

## #74 Diagramm-Aufgaben ausbauen  [wenige]
Wenige neue Bild-/Hotspot-/Beschriftungs-Aufgaben mit echten Diagrammen (Netzplan, Verkabelung, Rack) über striktes
SVG-Koordinaten-Template. Agent entwirft SVG+Zonen/Ziele; ich prüfe x/y-Alignment gegen SVG-Text, genau-1-richtig,
Render, Fachlichkeit. Vorab klären: welche Diagramme, Anzahl, Themen.

## #75 Englische Fachtext-Aufgaben (M02)
Wenige Aufgaben „Englische Fachtexte": kurzer Text + Verständnis-/Vokabelfrage. Einsortierung M02 / thema
„Englische Fachtexte" / AP1. Agent entwirft; ich prüfe Sprache+Fachlichkeit. Vorab klären: Textlänge, Format
(mc/zuordnung), Anzahl.

## #76 Teilpunkte via gewichtete Schlüsselbegriffe  [Entscheidung]
Freitext/erklaeren: Schlüsselbegriffe gewichten; `gradeTeilpunkte` → Anteil getroffener Begriffe → Punkte + Anzeige
„x/y Kernpunkte getroffen". Baut auf vorhandenem Keyword-Abgleich auf; abwärtskompatibel (alte Fragen ohne Gewichte
= volle Punkte bei Treffer). Agent entwirft Logik+Schema; ich prüfe Bewertung an Beispielen. Vorab klären: Bestehens-
Schwelle, Gewichtungsschema.

## #77 Fakten-Review-Zyklus  [begrenzt: einmalig je größerer Änderung]
Nur nach größeren Inhalts-Updates, feste Stichprobengröße: Sonnet-Agent prüft eine Stichprobe auf Aktualität/
Korrektheit und liefert einen BERICHT mit Auffälligkeiten – KEINE automatischen Pool-Änderungen. Ich verifiziere die
Funde und entscheide über Korrekturen. Vorab klären: Stichprobengröße, Auslöser/Trigger.

# GEPLANT (2026-07-11): 19 Code-/Struktur-Tasks (#78–#96) – Strategie & Reihenfolge
Grundsatz: Entwurf durch Sonnet-Agenten, aber KEIN Vertrauen – ich prüfe jede Änderung selbst. Da die meisten
Tasks REFACTORINGS sind (Verhalten muss GLEICH bleiben), gilt als Sicherheitsnetz je Task ein Vorher/Nachher-
Vergleich mit der vollen Suite:
  A) node test_logik.js (Schema/Grade/Duplikate) identisch grün,
  B) jsdom-Render ALLER Routen + ALLER Fragetypen ohne Laufzeitfehler,
  C) Grade-Konsistenz (jede der 720 Musterlösungen → korrekt) unverändert,
  D) FRAGEN-Diff vor/nach = leer (bei Pool-/Build-Tasks),
  E) node --check des (ausgelagerten) JS, Offline-Audit (keine CDN), LocalStorage-Roundtrip.
Detailplan je Task steht in der jeweiligen Task-Beschreibung. Empfohlene Reihenfolge (Abhängigkeiten):
1. Fundament/Tooling zuerst: #88 check.sh, #89 Build-Härtung, #87 ID-Tool, #81 JSON-Schema, #95 ARCHITECTURE.md
   → schaffen das Sicherheitsnetz, mit dem alle folgenden Refactorings verlässlich geprüft werden.
2. Struktur-Refactoring: #80 JS-Auslagern (behebt Mount-Probleme, macht alles Weitere einfacher) → #78 Renderer-
   Registry → #79 Typ-Registry → #84 Styles→Klassen → #85 TEXTE → #83 CONFIG → #82 State-Kapselung.
3. Robustheit/Performance: #90 Fehlerfänger, #91 Guards, #94 Pool-Index, #92 Seed-Debug, #93 Dev-Modus.
4. Kosmetik/Doku: #86 Pool-Aufteilung, #96 Version/Changelog.
Bei jeder Design-Entscheidung (API-Form der Registry, Schema-Details, Aufteilungsschnitt) vorher nachfragen.

# GEPLANT (2026-07-11): 7 Features (Batch 6, #97–#103) – Umsetzungspläne (Entscheidungen geklärt)
Entwurf durch Sonnet-Agenten, Prüfung durch mich im Loop (kein Vertrauen); bei Detail-Entscheidungen nachfragen.
Neue Fragetypen profitieren von #78/#79 (Registry) – wenn vorhanden dort einhängen, sonst klassisch in loeseFrage.
Abschluss je Feature: node test_logik (Schema/Grade/Duplikate) → jsdom-Render aller Typen → Grade-Konsistenz über
ALLE 720+ Fragen → Offline-Audit → Checkpoint.

## #97 Interleaving-Modus
Schalter/Modus im Üben, der die Fragenauswahl bewusst über Themen mischt (statt Blöcke). Nutzt Pool-Index (#94)
falls vorhanden. Agent draftet Mischlogik; ich prüfe Verteilung statistisch (aufeinanderfolgende Fragen selten
gleiches Thema), keine Wiederholungen. Vorab klären: Sitzungsgröße, Mischgrad.

## #98 Abruf-Übung ohne Optionen  [Schalter im Üben, nur Auswahlfragen]
Bei mc/dropdown/mehrfach zuerst nur die Frage zeigen (Optionen verdeckt) + „Ich hab's überlegt" → dann Optionen
aufdecken und normal beantworten. Reiner UI-Zwischenschritt, Grade unverändert. Agent draftet Verdeck-/Aufdeck-Logik;
ich prüfe: nach Aufdecken identisches Verhalten/Wertung, sauberes Umschalten, andere Typen unberührt.

## #99 Elaborations-Prompt
Nach KORREKTER Antwort optionales, unbewertetes Feld „Erkläre kurz, warum das richtig ist" (Selbsterklärung).
Dezent/überspringbar/abschaltbar. Agent draftet UI; ich prüfe, dass es nichts blockiert und optional bleibt.
Vorab klären: welche Typen, ob Eingabe gespeichert wird.

## #100 Autoren-Vorschau
Versteckter Autoren-Bereich: JSON einer Frage einfügen → validateFragen live + sofortiges Rendern/Testen (inkl. Grade),
bevor sie in den Pool kommt. Agent draftet Editor+Vorschau+Fehleranzeige; ich prüfe mit gültigen UND absichtlich
ungültigen Beispielen (Fehler werden klar gemeldet, gültige rendern/graden). Vorab klären: Zugang/Sichtbarkeit.

## #101 Neuer Typ „mtf" (Multiple-True-False)  [Teilpunkte je Aussage]
Schema: {szenario?, aussagen:[{text, wahr:bool}]}. gradeMtf zählt korrekt als wahr/falsch markierte Aussagen →
Teilpunkte (x/n). logik.js: TYPEN + Validierung (≥3 Aussagen, boolsche wahr-Werte) + gradeMtf; Renderer: je Aussage
zwei Schalter (wahr/falsch), Auswertung färbt je Zeile. Inhalte per Agent (Szenarien Rhaus/Recht/Netz). Ich: test_logik
+ gcheck (Teilpunkte korrekt: alle richtig=voll, k falsch=Abzug) + jsdom-Render + fachlich. Vorab klären: Bestehens-Schwelle.

## #102 Verketteter Lückentext  [Freitext, pro Aufgabe/Nutzer auf Dropdown umschaltbar]
Fließtext mit mehreren Lücken; Standard = Freitext-Eingabefelder (tolerante Prüfung wie gradeLuecke), Umschalter
„Als Auswahl anzeigen" ersetzt sie durch Dropdowns aus denselben Optionen. Schema hält je Lücke Lösung(en) + optionale
Distraktoren. Neuer Typ „lueckenkette" oder Erweiterung von dropdown – im Plan festlegen (Registry-abhängig). Agent
draftet Renderer (beide Modi) + grade + Inhalte; ich prüfe BEIDE Modi (gleiche Wertung), Toleranz, jsdom-Render.
Vorab klären: Umschalt-Ebene (global/pro Aufgabe), Toleranzregeln.

## #103 Neuer Typ „kreuztabelle" (Raster ankreuzen)
Schema: {zeilen:[…], spalten:[…], loesung:[[bool…]…]} – je Zelle an/aus (z. B. OSI-Schicht × Protokoll, „gehört zu").
logik.js: TYPEN + Validierung (Matrix-Maße stimmen) + gradeKreuztabelle. Renderer: HTML-Tabelle mit Checkboxen –
ZWINGEND document.createElement für tr/td (der el("<tr>")-Bug aus dieser Session!). Inhalte per Agent. Ich: test_logik
+ gcheck + jsdom-Render (Tabellen-Alignment/kein null-appendChild) + fachlich. Vorab klären: Wertung exakt vs. Teilpunkte.

## Frühere geplante Features (Vorbatch)

## Feature 45 – Klausur-Timer in der Prüfungssimulation
Ziel: echtes Zeitgefühl. Sichtbarer Countdown, Auto-Abgabe bei Zeitablauf, Zeit-Auswertung.
State (defaultState ~Z.229): + `simDauerMin: 90`. Migration: `S.simDauerMin = S.simDauerMin || 90`.
sSimulation (~Z.1456): beim Start `simStart=Date.now()`; Countdown-Element oben im Panel; `setInterval` 1×/s
zeigt „mm:ss verbleibend"; letzte 5 Min rot; bei 0 → automatisch dieselbe Auswert-/Abgabe-Funktion wie der Button.
Interval-Handle in einer Modul-Variable; `clearInterval` bei Abgabe UND in render()/clearAktion (kein Leak beim
Seitenwechsel). Auswertung: `zeitSek` in simHistorie.push aufnehmen; Ergebnisanzeige „benötigte Zeit mm:ss" +
„Ø je Aufgabe". sEinstellungen: Feld „Simulationsdauer (Min)".
Token-Spar-Agenten (Sonnet):
- Agent A: entwirft isolierte Timer-Logik (formatTime, startTimer/stopTimer, Auto-Submit-Hook) passend zur
  sSimulation-Signatur → ich integriere in die HTML.
- Agent B: schreibt jsdom-Test mit Fake-Timern (Countdown runter, Auto-Abgabe bei 0, Interval-Stop bei Seitenwechsel).
- Ich selbst: Integration, node --check des Inline-JS, jsdom-Render, LocalStorage-Roundtrip, Offline-Check, Checkpoint.

## Feature 46 – Lesezeichen / „schwierige Fragen markieren"
Ziel: eigene Sammlung zum Wiederholen, unabhängig vom automatischen Fehler-Deck.
State (defaultState): + `markiert: {}` (id→1). Migration: `S.markiert = S.markiert || {}`. Persistenz via speichere().
loeseFrage (~Z.680, beim Notiz-Muster ~Z.665): Stern-Button (☆/★) toggelt `S.markiert[f.id]`, speichere(), Icon updaten.
Neue Route „markiert" → sMarkiert() analog sFehlerdeck (~Z.1322): Liste markierter Fragen (mit passtAP-Filter),
„Markierte üben"-Durchlauf, einzeln entfernbar, Leerzustand-Hinweis. SEITEN-Array + Dispatch + Start-Kachel
„Markiert ★" mit Anzahl-Badge. Reset-Button (Einstellungen) leert markiert via defaultState().
Token-Spar-Agenten (Sonnet):
- Agent A: entwirft sMarkiert() (bekommt sFehlerdeck als Vorlage) → ich integriere.
- Agent B: jsdom-Test: Toggle persistiert (https-localStorage), Route rendert, Üben nur markierter, Entfernen ok.
- Ich selbst: Integration, node --check, Render-/Persistenz-Test, Offline-Check, Grade-Konsistenz unberührt, Checkpoint.

Gemeinsamer Abschluss-Loop je Feature: Inline-JS node --check → jsdom-Render aller 12 Routen → LocalStorage-Roundtrip
→ Offline-Audit (keine CDN) → BUILD_LOG/TASKLIST aktualisieren. Nichts den Agenten glauben, alles selbst nachtesten.


Status: offen / in Arbeit / fertig / geprüft

**Hinweis (2026-07-03):** Beim Start von v2 lagen KEINE Programmdateien im Workspace
(kein lernprogramm_ap1.html, fragen.js, README.md, BUILD_LOG.md). Das Programm wird
daher von Grund auf neu gebaut — mit allen in v1 beschriebenen Basisfunktionen
(Adaptivität, Offline per Doppelklick, Minion-Farbwelt, erweiterbares Fragen-Schema
mit Feld `pruefungsteil`) plus allen v2-Features.

## Architektur-Entscheidung (P1)
- `lernprogramm_ap1.html` – App (UI + Steuerung), lädt lokale Skripte, offline-fähig
- `logik.js` – reine Logik (Deck, Spaced Repetition, Generatoren, Bewertung,
  Schema-Validierung); von Node testbar UND vom Browser nutzbar
- `fragen.js` – kompletter Fragenpool (aus `pool/pool_mXX.json` gebaut)
- `pool/pool_m01.json … pool_m08.json` – Quellpool je Modul (M08 = WiSo)
- `build_fragen.py` – baut fragen.js aus den JSON-Dateien
- `test_logik.js` – Node-Testskript (Qualitäts-Loop)

## Pakete

| Nr. | Paket | Status |
|---|---|---|
| P1 | TASKLIST + BUILD_LOG anlegen, Schema definieren | fertig |
| P2 | logik.js: Deck/Shuffle + Sperrfrist, Adaptivität, Notenschlüssel, Schema-Validierung | geprüft |
| P3 | logik.js: Fehler-Deck (1/3/7 Tage, 3-Treffer-Regel, Rückfall) | geprüft |
| P4 | logik.js: Rechen-Generatoren (Subnetting, RAID, Übertragung, Netzplan) mit Lösungsweg | geprüft |
| P5 | lernprogramm_ap1.html: Grundgerüst, Minion-Design, Dark Mode, Navigation, Selbsttest | fertig (Browser-Test durch Nutzer offen, P22) |
| P6 | HTML: 6 Fragetypen-Renderer (MC, Freitext, Lückentext, Zuordnung per Klick, Bild/SVG, Erklär-mir) | fertig (Browser-Test durch Nutzer offen, P22) |
| P7 | HTML: Üben-Modus (Themen-Fokus, Schwierigkeitsanzeige + manuell/auto, Feedback kurz/lang, Notizen) | fertig (Browser-Test durch Nutzer offen, P22) |
| P8 | HTML: Fehler-Deck-Modus + Einstreuung (max. 1 von 5) | fertig (Browser-Test durch Nutzer offen, P22) |
| P9 | HTML: Prüfungssimulation (Timer, Blättern, Markieren, Auswertung, Notenschlüssel, Historie) | fertig (Browser-Test durch Nutzer offen, P22) |
| P10 | HTML: Streak/Tagesziel, Prüfungs-Countdown, Statistik-Seite | fertig (Browser-Test durch Nutzer offen, P22) |
| P11 | Pool M01 Projektmanagement (≥18 Fragen, alle Formate) | geprüft |
| P12 | Pool M02 Kundenberatung/Marketing (≥18) | geprüft |
| P13 | Pool M03 IT-Systeme/Hardware (≥18) | geprüft |
| P14 | Pool M04 IT-Lösungen/Programmierung (≥18) | geprüft |
| P15 | Pool M05 Qualitätssicherung (≥12) | geprüft |
| P16 | Pool M06 IT-Sicherheit/Datenschutz (≥18) | geprüft |
| P17 | Pool M07 Leistungserbringung/Verträge (≥18) | geprüft |
| P18 | Pool M08 WiSo (Ausbildungsrecht, Kündigungsfristen, Mitbestimmung) (≥12) | geprüft |
| P19 | fragen.js bauen, Duplikat-Scan, Node-Testlauf (Qualitäts-Loop) | geprüft |
| P20 | README.md (Features + Anleitung eigene Fragen ergänzen) | geprüft |
| P21a | Pool-Vertiefung Runde 2: M01, M03, M04, M06 (je +20 Fragen, gesamt 220) | geprüft |
| P21b | Pool-Vertiefung Runde 2: M02, M05, M07, M08 (Schwerpunkt Wirtschaft/WiSo, gesamt 280) | geprüft |
| P21c | Runde 3: Themen-Normalisierung (66 kanonische Themen) + Lückenfüllung (gesamt 322) | geprüft |
| P21d | Runde 4: prüfungskritische Themen aufgefüllt (+43, gesamt 365); weiterer Ausbau Richtung 15–20 je Thema offen | teilweise |
| P22 | Browser-Smoke-Test durch Nutzer (Doppelklick, alle Modi einmal durchspielen) | offen |
| P23 | Verifikations-Durchgang: Grundstruktur + Zuordnung + AP1-Sinn (Loop 5); 3 Thema-Fehlzuordnungen korrigiert | geprüft |
| P24 | Katalog-AP2-Stoff (M08 WiSo, M04 Subnetting/DB = 44 Fragen) als pruefungsteil=AP2 markiert | geprüft |
| P25 | App-Filter AP1/AP2 (inklAP2-Flag, Üben-Checkbox, Simulation nur AP1, AP2-Badge); Syntax OK | geprüft |

## Wiederaufnahme nach Unterbrechung
Zuerst diese Datei lesen, dann beim ERSTEN offenen Paket weitermachen.
Fertige Pakete nicht erneut bearbeiten. Poolbau: fehlende pool_mXX.json ergänzen,
dann P19 (Build+Tests) erneut ausführen.

---

# GROSSES UPDATE v4 (Start 2026-07-09)

## Phase 1 – UI / Startseite / Aufräumen  ✅ (verifiziert 2026-07-09, Subagent-Check: Syntax OK, 1308 Node-Tests grün)
- [x] U1.1 Startseite: Kachel-/Plattenmenü (10 Kacheln, .menu-grid/.tile), Statistik als dezente Zeile + „Mehr Statistik"-Details → lernprogramm_ap1.html (sStart neu)
- [x] U1.2 Streak entfernt: Sidebar-Chip, Start-Karte, L.streak (logik.js), Streak-Tests (test_logik.js); dailyCounts bleibt (Tagesziel/Aktivität)
- [x] U1.3 TTS entfernt: vorlesen/vorleseButton/ttsVerfuegbar, S.tts, Einstellungs-Toggle → lernprogramm_ap1.html
- [x] U1.4 5er-Serie statt Frage des Tages: schwaechstesModul() aus S.statistik, sSerie mit Fortschritt/Auswertung; Route serie → lernprogramm_ap1.html
- [x] U1.5 Themenfokus als <details> einklappbar, Zustand in S.fokusZu → lernprogramm_ap1.html (sUeben)

## Phase 2 – Aufgabenformate & Interaktion  ✅
- [x] U2.1 Alle 81 Lückentexte → Dropdown (4 Subagent-Batches, fachliche Distraktoren, validiert; auch bild-unterTyp + Fallaufgaben) → pool/*.json, fragen.js/faelle.js neu gebaut. Pool: 88 dropdown, 0 lueckentext
- [x] U2.2 autoCheckText: Umlaut/ß-Normalisierung, ~50 Synonym-/Abkürzungsgruppen, Stemming; Keyword-Listen („Erkannt/Fehlt") aus UI entfernt → lernprogramm_ap1.html
- [x] U2.3 Fallaufgaben: Menüpunkt entfernt; je Simulation 1 Fall (auto-bewertbare Teilaufgaben, Szenario-Panel, geschlossener Block); faelle.js jetzt aus pool_faelle.json generiert
- [x] U2.4 Generator: Zahlensysteme (Dez/Bin/Okt/Hex) + Datenmengen (GiB/GB, Bit/Byte) neu in logik.js; Einstreuung in Üben (jede ~4. Frage, genAlsFrage); Menüpunkt bleibt
- [x] U2.5 Interaktiver Netzplan (sNetzplan): 6 Felder je Knoten, Feld-Validierung, kritischer-Pfad-Erklärung, 4 Rhaus-Metall-Szenarien mit benannten Vorgängen (L.NETZPLAN_SZENARIEN)

## Phase 3 – Aufgabenlogik & Varianz
- [x] U3.1 kandidatenMitTypWechsel(): nie gleicher Typ 2× in Folge (S.lastTyp), wenn vermeidbar
- [x] U3.2 mischeTypen() für Serien + zufällige Deck-Auswahl mit Typ-Filter
- [x] U3.3 Varianten-Engine: L.instanziiere + Validator prüft jede Variante; angewendet in Üben/FD/Serie/Sim. Alle 14 rechenassistent-Fragen + M03-726/727 mit je 2 nachgerechneten Zahlen-Varianten; Generator-Einstreuung deckt Subnetting/Übertragung/Zahlensysteme/Datenmengen/Netzplan ab
- [x] U3.4 Balance: +32 Fragen für unterrepräsentierte Formate (hotspot 3→10, matrix 3→10, beschriftung 5→11, reihenfolge 12→18, mehrfach 14→24; IDs M0X-70x, 5 neue pool_m_*3.json)

## Phase 4 – Schwierigkeitssystem  ✅
- [x] U4.1 Stufe „Anfänger": Skala 1–4, Migration alt 1..3→2..4 (State + Pool), danach inhaltliche Neueinstufung aller 538 Fragen durch 2 Subagents (179 Umstufungen angewendet). Verteilung: 68/159/272/39
- [x] U4.2 L.trackAntwort/L.levelReif (letzte 10 pro Modul+Stufe), Dialog zeigeLevelDialog bei ≥8/10 – nur mit Zustimmung, gilt auch bei manueller Stufe; kein Auto-Hochstufen mehr (autoLevel senkt nur)

## Phase 5 – Inhaltliche Qualitätssicherung  ✅
- [x] U5.1 COVERAGE.md erstellt (69→73 Themen, Matrix je Modul, FK01–FK07-Katalogabgleich, Kernthemen-Tiefencheck 10/10 bestanden); Top-5-Lücken + 2 DÜNN-Themen anschließend geschlossen (+24 Fragen, pool_m_luecken.json)
- [x] U5.2 Gibibit/Präfixe: Bestand war 0 Fragen zu GiB/GB & IEC-Präfixen → +9 Fragen (pool_m03f.json, M03-72x, inkl. 2 rechenassistent MIT Varianten) + neuer Generator L.genDatenmengen (GiB↔GB, MiB↔KiB, Byte↔Bit, Gbit↔Gibit)
- [x] U5.3 Simulationen: Fragen-Gedächtnis S.simUsedIds über MEHRERE Durchläufe (Reset erst bei ~70 % Poolverbrauch), mehr geeignete Formate (dropdown+mehrfach jetzt prüfbar), 1 Fallaufgabe je Sim mit Fall-Rotation → praktisch unbegrenzt viele nicht-wiederholende Klausuren
- [x] U5.4 Alte IHK-Original-Klausuren liegen NICHT mehr im Projekt (uploads leer) → ersatzweise Prüfungskatalog S. 9–16 als Bilder analysiert (Subagent). Zuordnung/Tabellen/Diagramm-Formate weitgehend vorhanden; NOCH FEHLENDE Formate als Vorschlag (nicht implementiert):
  1. Schreibtischtest/Trace-Tabelle (Code + Variablenwerte je Durchlauf eintragen) – explizit im Katalog S. 13
  2. Tabellenkalkulations-Aufgabe (NWA/Angebotsvergleich/Vor-/Nachkalkulation mit freien Eingabezellen)
  3. Pseudocode-/Struktogramm-Baukasten (Bausteine per Drag & Drop ins Gerüst)
  4. Interaktives Gantt-Diagramm (analog Netzplan)
  5. Konsolen-Simulation (Befehls-Eingabe mit toleranter Auswertung)

## Abschluss
- [x] UA.1 Selbsttests: 2126 Node-Tests grün (0 Fehler), Pool 603 Fragen / 0 Schemafehler / 0 Duplikate; Migrationslogik migriereState (Level-Shift, simLastIds→simUsedIds, Alt-Felder entfernt); finale App-Verifikation per Subagent
- [x] UA.2 Abschlussbericht siehe BUILD_LOG.md (v4) bzw. Chat-Zusammenfassung

# WIEDERAUFNAHME-VERIFIKATION (Session 2026-07-11) – Schritt 0 im Code geprüft
Ergebnis: v4-Update ist real umgesetzt (603 Fragen, Skala 1–4, 0 lueckentext/92 dropdown, Kachelmenü,
sNetzplan, sSerie, Varianten-Engine, Datenmengen-/Zahlensystem-Generator; TTS/Streak entfernt). ABER die
frühere „finale App-Verifikation" war unzureichend – im Code-Check gefunden und behoben:
- [x] FIX-1 (KRITISCH): Syntaxfehler im Inline-JS (sGenerator, Zeile ~1023): gerades ASCII-`"` in
  „(Kachel „Netzplan")" beendete el("…") vorzeitig → GANZE App startete im Browser nicht. Node-Tests
  deckten das nicht ab (nur logik.js). Behoben (Anführungszeichen entfernt); node --check des Inline-JS grün.
- [x] FIX-2: Offline-Verstoß – HTML lud Google Fonts via CDN (fonts.googleapis.com). Font-Links entfernt;
  System-Font-Fallbacks (--f-*) greifen. Jetzt KEINE externen Abrufe (nur w3.org-SVG-Namespaces, harmlos).
- [x] FIX-3: M08-601 Rechtszitat falsch (§ 20 Abs. 3 BBiG → korrekt § 22 Abs. 2 Nr. 1 BBiG).
- [x] FIX-4: M08-611 Zitat präzisiert (§ 13 Abs. 1 → § 13 Satz 2 Nr. 7 BBiG).
Nach Fixes: Build 603, 2126 Node-Tests grün, Inline-JS syntaktisch OK.
Stichproben fachlich geprüft: M08e-Recht (16, 2 Fehler s.o.), GiB/GB M03-720..728 (alle Rechnungen korrekt).
OFFEN: P22 Browser-Smoke-Test (Nutzer).

# AUSBAU: jeder Fragetyp ≥ 20 (2026-07-11, Agenten + Selbstprüfung)
Pool 612 → 720. Alle vormals dünnen Typen auf 20: trace, kalkulation, konsole, baukasten, matrix,
rechenassistent, fehlersuche, reihenfolge, hotspot, beschriftung. Erstellung durch Sonnet-Agenten,
Prüfung komplett selbst. Gefundene/behobene Fehler: baukasten M04-972 (WIEDERHOLE...BIS verkehrt),
2 ID-Kollisionen, 5 unlösbare beschriftung-SVGs (auf Nummer+Beschreibung umgebaut).
Abschluss-Test: JEDE der 720 Fragen einzeln geprüft – 625 bewertbare mit korrekt gewerteter Musterlösung
(0 Fehler), 95 Freitext mit Musterlösung; test_logik 2162 OK/0; Audit 0; keine doppelten IDs; 73 Themen;
Headless-Render aller neuen Typen ohne Laufzeitfehler.

# VOLLPRÜFUNG 2026-07-11 (Nutzer: „alles testen, nicht vertrauen")
- [x] Syntax aller Dateien inkl. Inline-HTML-Script; offline (keine CDN/Fonts)
- [x] test_logik.js 2162 OK/0; Pool-Audit 612 Fragen, 73 Themen, 0 Strukturfehler, Prüfungsteil-Regel überall ok
- [x] jsdom: 12 Routen + 18 Typen fehlerfrei; 25 interaktive Auswertungen (richtig+falsch) korrekt
- [x] Unabhängige Nachrechnung 18.200 Checks, 0 Abweichungen (Subnetting 3 Varianten, RAID, Übertragung,
      Zahlensysteme, Datenmengen, Netzplan FAZ/FEZ/SAZ/SEZ/GP, Gantt) + statische Inhalte von Hand
- [x] **BUG behoben:** gradeZuordnung index-basiert → für 11 many-to-one-Zuordnungen (mehrere Aussagen → selbe
      Kategorie) unlösbar. Auf textbasierte Wertung umgestellt + 4 Regressionstests. Betroffen M01-005/104/108,
      M04-304, M06-104/117/733, M08-004/607/612/616.

# U5.4 – 5 NEUE FORMATE umgesetzt & geprüft (Session 2026-07-11, Nutzer: „alle")
Engine in logik.js, Renderer in loeseFrage/sGantt, Inhalte in pool_m_*.json. Pool 603 → 612.
- [x] Trace / Schreibtischtest (typ "trace", gradeTrace) – pool_m_trace.json (3: M04-901/902/903)
- [x] Konsolen-Simulation (typ "konsole", gradeKonsole + normBefehl) – pool_m_konsole.json (2: M04-911/912)
- [x] Tabellenkalkulation (typ "kalkulation", gradeKalkulation) – pool_m_kalkulation.json (2: M02-921, M07-921)
- [x] Pseudocode-/Struktogramm-Baukasten (typ "baukasten", gradeBaukasten) – pool_m_baukasten.json (2: M04-931/932)
- [x] Interaktives Gantt/Balkenplan (Route "gantt", L.ganttBerechne/GANTT_SZENARIEN/genGantt, sGantt)
Verifikation: node test_logik.js 2158 OK / 0 Fehler (inkl. 23 Gantt-Tests, Rechnungen von Hand geprüft);
jsdom-Headless alle 12 Routen + alle 18 Fragetypen fehlerfrei; Integrations-Solve trace/kalkulation/konsole/
baukasten/gantt → korrekt=100 %; offline (keine CDN/Fonts). BUG behoben: Tabellen-Renderer nutzten
el("<tr>/<td>") (Parser verwirft sie → appendChild null) → auf document.createElement umgestellt.

# PHASE R – REVIEW-FIXES (unabhängige Code-Analyse 2026-07-15; Nutzer-Auftrag „komplett durchplanen")
Gemeinsam für R1–R6: Code-Tasks → volles Prüfprotokoll (alle 21 Suiten via check.sh schnell + verify.sh
paarweise, Offline-Audit, node --check); Umfang jeweils <50 Zeilen → Opus DIREKT (kein Agent), außer R7
(Sonnet). Neue/geänderte Tests IMMER in sollwerte.env nachziehen (Single Source). Fundstellen-Zeilennummern
= Stand 2026-07-15, vor Edits per grep verifizieren (FUNCTIONS.md/ARCHITECTURE.md).

## R1 – Instanziierungs-Kopie-Bug: _beantwortet mutiert POOL-Objekte  [WICHTIG, Bugfix]
BEFUND: L.instanziiere gibt bei Fragen OHNE varianten das Original zurück (logik.js:386). naechsteFrage
kopiert im Normalpfad NICHT (app_seiten.js:243, anders als Zweige :229/:233 mit Object.assign). uebenRender
setzt f._beantwortet=true (app_seiten.js:275) → landet auf dem POOL-Objekt. Erneute Ziehung derselben Frage
in der Session ⇒ live=false (:257) ⇒ Antwort wird NICHT verbucht („Wiederholung (zählt nicht)").
UMSETZUNG (2 Optionen, VORAB per grep entscheiden):
 (a) BEVORZUGT: zentral in logik.js:386 `return Object.assign({}, f);` statt `return f;` – deckt auch
     sFehlerdeck:309 / sMarkiert:335 / buildAP1Exam ab. VORHER `grep -n "instanziiere" tests/*.js` –
     falls ein Test Objekt-Identität von instanziiere erwartet, Test mit anpassen (Sollwert-neutral halten).
 (b) Fallback: nur Call-Site app_seiten.js:243 in `Object.assign({}, L.instanziiere(...))` ändern.
TEST NEU: in tests/test_zurueck.js: gleiche varianten-lose Frage 2x hintereinander „live" beantworten →
statistik gesamt==2 UND POOL-Objekt hat kein _beantwortet. sollwerte.env: zurueck 16→(neu).
KEINE VORAB-Nutzerfrage nötig (reiner Bugfix, Verhalten = offensichtlich gewollt).

## R2 – localStorage-Fehler sichtbar machen  [WICHTIG]
BEFUND: speichere() und ladeState() schlucken Fehler still (app_state.js:66/69) → voller Speicher oder
korrupter State = stiller Datenverlust bzw. Kommentarlos-Reset.
UMSETZUNG: app_state.js: Flags `var LS_LADE_FEHLER=false, LS_SPEICHER_FEHLER=false;`. ladeState-catch:
Flag setzen + console.warn(e); WICHTIG: Reset auf defaultState() bleibt (Verhalten unverändert). speichere-
catch: Flag setzen + einmalig console.warn. Anzeige: render() in app_seiten.js neben POOL_FEHLER-Banner
(:25–28) je Flag ein Banner (.fehlerbanner); Texte neu in TEXTE.fehler (app_util.js), z. B. lsLadeFehler=
„Gespeicherter Lernstand konnte nicht gelesen werden – Neustart mit leerem Stand." / lsSpeicherFehler=
„Änderungen können derzeit NICHT gespeichert werden (Speicher voll/blockiert?)."
VORAB-Nutzerfrage (bündeln mit R3/R5/R6): Speicher-Banner dauerhaft auf jeder Seite oder dezent nur auf
Start+Einstellungen? (Empfehlung: dauerhaft – Datenverlust ist kritisch.)
TESTS NEU: tests/test_robust.js +2: (1) localStorage.setItem wirft (Stub) → speichere ohne Exception +
Banner nach render(); (2) korruptes JSON in LS_KEY → App bootet mit Default + Lade-Banner. sollwerte robust 16→18.

## R3 – Sim-Timer wanduhrbasiert (Hintergrund-Tab-Drift)  [WICHTIG]
BEFUND: Countdown zählt per setInterval-Tick `sim.restSek--` (app_sim.js:76–81); gedrosselte Intervalle im
Hintergrund-Tab verlängern die Prüfungszeit. sim.startTs existiert bereits (:74), ungenutzt.
UMSETZUNG: im Interval-Callback `sim.restSek = sim.dauerMin*60 - Math.floor((Date.now()-sim.startTs)/1000);`
statt Dekrement; Rest (Anzeige, .warn<300, <=0→simAbgeben) unverändert. simAbgeben-zeitSek (:149) bleibt
konsistent (Budget − restSek, Math.max(0,…) fängt Überzieher). Randfall dokumentieren: Ticks können
Sekunden überspringen (Anzeige korrekt, kein Verhalten hängt an Einzelsekunden).
VORAB-Nutzerfrage: KEINE (Bugfix). TEST: tests/test_timer.js anpassen/ergänzen (Date.now-Mock vorspulen →
restSek folgt Wanduhr, nicht Tick-Zahl). sollwerte timer 15→(neu).

## R4 – esc() um Single-Quote härten  [optional, klein]
BEFUND: esc() escapt kein `'` (app_util.js:349); einzige dynamische Single-Quote-Attributstelle:
app_pages2.js:388 (value='…pruefungsdatum…') – nur Self-XSS, aber billige Härtung.
UMSETZUNG: in esc() `.replace(/'/g,"&#39;")` anhängen. RISIKO: Tests/Vergleiche, die esc-Ausgaben mit `'`
byte-vergleichen (glossar data-def enthält Apostrophe?) → alle 21 Suiten laufen lassen, abweichende
Erwartungen gezielt anpassen (Sollwert-Zahlen bleiben gleich, nur Strings). +1 Unit in test_robust
(esc("a'b")==="a&#39;b") → sollwerte robust +1.

## R5 – State-Hygiene: tote IDs bereinigen + migriereState-Early-Exit  [optional]
BEFUND A: Fall-Teilaufgaben-IDs („<fallId>-t<i>", app_sim.js:17) landen via simAbgeben (:163) im
Fehler-Deck, sind nie via frageById auflösbar → tote Einträge akkumulieren. BEFUND B: migriereState läuft
bei jedem Laden komplett (app_state.js:54–64), Early-Exit fehlt (nur Kosmetik).
UMSETZUNG A: Aufräum-IIFE NACH Pool-Init (Ende app_pool.js, nach POOL_INDEX-Befüllung): alle Keys aus
S.fehlerDeck (und S.markiert, s. VORAB) mit !POOL_INDEX[id] löschen; bei Änderung 1x speichere().
ACHTUNG: S.simUsedIds NICHT anfassen („FALL:"-Einträge sind gewollte Vermeide-Mechanik, app_sim.js:14/45);
S.meldungen NICHT anfassen (Anzeige „nicht im Pool" ist gewollt, app_pages2.js:441). AP2-Fragen sind via
frageById auffindbar → bleiben korrekt erhalten (Kriterium ist streng „nicht im Pool", NICHT passtAP).
UMSETZUNG B: in migriereState direkt nach `if(!s) return s;`: `if (s.version === STATE_VERSION) return s;`.
VORAB-Nutzerfrage: S.markiert mitbereinigen? (Empfehlung ja – markierteIds filtert ohnehin.)
ENTSCHIEDEN (Nutzer 2026-07-16): JA, fehlerDeck UND markiert bereinigen. Zusatzanforderungen des Nutzers
(sinngemäß auf unseren Plain-JS-Stack übertragen; TypeScript/useEffect aus der Antwort sind nicht anwendbar):
zentrale pure Funktion (z. B. sanitizeState(POOL_INDEX, S) → bereinigte Kopie, KEINE Direkt-Mutation),
Set/Index für O(1)-Lookup (POOL_INDEX existiert), SICHERHEITSNETZ: nur bereinigen, wenn der Pool
nachweislich vollständig geladen ist (POOL.length>0 && !POOL_FEHLER.length), sonst nichts löschen.
TESTS: tests/test_state.js +2 (tote FD-ID entfernt / echte + AP2-ID bleibt; version==5 → Objekt unverändert
durch Migration). sollwerte state 23→25.

## R6 – Abruf-Übung: Typ-Hilfe nicht mitverdecken  [optional, UX]
BEFUND: abrufVerdecken verschiebt ALLES nach dem Kicker in den verdeckten Container (app_loeser.js:625–635)
– auch die #67-Typ-Hilfe (renderTypHilfe wird vor dem Renderer eingehängt, :615).
UMSETZUNG: beim Einsammeln `if (x.classList && x.classList.contains("typ-hilfe")) return;` (Knoten bleibt
sichtbar an Ort). Listener-Erhalt unkritisch (Knoten wird gar nicht bewegt).
VORAB-Nutzerfrage: Typ-Hilfe sichtbar lassen ODER bewusst mitverdecken lassen (dann Task streichen)?
TEST: tests/test_abruf.js +1 (abrufAn + mc-Frage mit Typ-Hilfe-Typ… mc hat keine Typ-Hilfe → Test mit
dropdown-Frage: .typ-hilfe sichtbar, Optionen verdeckt). sollwerte abruf 17→18.

## R7 – app_loeser.js aufteilen (Glossar / Renderer / Verbuchung)  [optional, Refactoring, ZULETZT]
BEFUND: app_loeser.js (687 Z.) mischt 3 Verantwortungen: Glossar-Tooltip (Z.11–146), R_TYP-Renderer +
loeseFrage + Abruf (Z.148–641), Verbuchung/Level-Dialog (Z.643–686).
UMSETZUNG (Methode = app.js-Modularisierung, TASKLIST Abschn. 5 „E"): Partition-Split in app_glossar.js +
app_loeser.js (Rest) + app_verbuchen.js; Reassemblierung (ohne zusätzliche "use strict"-Zeilen) muss
BYTE-IDENTISCH zur alten Datei sein (diff leer). HTML-Ladereihenfolge: app_glossar.js VOR app_loeser.js,
app_verbuchen.js danach (vor app_seiten.js). check.sh anpassen: Mount-Gate-/node --check-/Copy-Listen um
neue Module ergänzen. FUNCTIONS.md + ARCHITECTURE.md-Modulkarte nachziehen. Sonnet-Agent auf /tmp-Kopie
(prompts/feature_draft.md), Opus liest kompletten Diff. Vorher/Nachher: ALLE 21 Suiten identisch grün,
sollwerte unverändert, Offline 0. VORAB-Nutzerfrage: Zuschnitt 3 Dateien ok (oder Verbuchung zu app_frage)?
NUR bei frischem Mount beginnen (Erfahrung app.js-Split).

## R8 – CHANGELOG/Versions-Prozess  [optional, Doku, kein Code-Risiko]
BEFUND (2. Analyse 2026-07-15): APP_VERSION steht auf 0.1.0 (app_state.js:6), obwohl seit T6 die Features
L1 (Bereitschafts-Score) und L3 (20 Transferfragen) dazukamen; CHANGELOG.md hat nur den v0.1.0-Block.
Die T6-Regel „Bump je Meilenstein" (app_state.js:3–5) hat keinen festen Auslöser im Task-Loop.
UMSETZUNG (idealer Zeitpunkt: direkt nach L4-Abschluss, dann ist Phase-L-Inhalt komplett):
 1. app_state.js:6 → `var APP_VERSION = "0.2.0";` (einzige Code-Zeile; „0.1.0" existiert laut T6-Verifikation
    nur dort). 2. CHANGELOG.md: neuen v0.2.0-Block OBEN einfügen, nutzergerichtet kurz: Bereitschafts-Score
    (Ampel in Start/Statistik), +20 Transferaufgaben, +L4-Fragen (#74/#75), Review-Fixes R1–R3 (zuverlässigere
    Speicherung/Timer/Statistik), Version sichtbar in Einstellungen. 3. Prozess verankern: in TASKLIST
    Abschnitt 1 (Task-Loop-Zeile) ergänzen „…TASKLIST+BUILD_LOG-Checkpoint → BEI FEATURE-MEILENSTEIN:
    APP_VERSION-Bump + CHANGELOG-Eintrag → START_PROMPT…".
VERIFIKATION: check.sh schnell (node --check app_state.js reicht faktisch); Render-Smoke „Version 0.2.0"
in sEinstellungen; grep: „0.2.0" nur in app_state.js+CHANGELOG. Keine Suiten-/sollwerte-Änderung erwartet
(kein Test prüft den Versions-STRING – vorher `grep -rn "0\.1\.0" tests/` zur Sicherheit).
VORAB-Nutzerfrage: KEINE (Nutzer hat R8 am 2026-07-15 beauftragt; SemVer-Schema aus T6 gilt).

## R9 – README-Sync  [Doku, klein aber wichtig – README ist der Projekteinstieg]
BEFUND (3. Analyse 2026-07-15): README.md veraltet – „140 Fragen" (Z.15), „test_logik.js … 1283 Prüfungen"
(Z.18), Root-Testskript statt tests/-Ordner; app_-Module/abkuerzungen.js/styles.css/tools/verify.sh fehlen.
UMSETZUNG: Datei-Tabelle + Funktionsliste aktualisieren (9 app_*.js-Module, tests/ mit 21 Suiten +
sollwerte.env, tools/, check.sh/verify.sh, CHANGELOG.md, abkuerzungen.js, styles.css). Fragenzahl NICHT
hart einbetten (driftet sonst wieder): „>750, generiert aus pool/*.json via build_fragen.py". Start-/
Offline-Absatz stimmt noch. KEINE Code-Änderung → keine Suiten nötig; kurzer Selbst-Review des Diffs.
VORAB-Nutzerfrage: KEINE.

## R10 – A11y-Feinschliff (Fortsetzung #64/#65)  [optional, Code, ~40–60 Zeilen, Opus direkt]
BEFUND (3. Analyse): (a) Chips/Zonen der Typen zuordnung/matrix/beschriftung/baukasten sind onclick-Spans
ohne tabindex (app_loeser.js:217/221/400/438/540 + Slots :393/:430/:534), Hotspot-rects (:319ff) und
Fehlersuche-Zeilen (:345ff) nicht fokussierbar → 6 Typen nicht mausfrei bedienbar. (b) Keine aria-live-
Region → Feedback wird nicht angesagt. (c) Eigener Fokus-Ring nur .glossar-term (styles.css:206).
(d) --gelb-hover (#C8920A) als Textfarbe ≈2,8:1 Kontrast (app_loeser.js:265/425/529).
UMSETZUNG: (a) Helper `chipTastatur(el)` in app_util.js: tabindex=0 + role=button + keydown Enter/Space →
el.onclick(); an allen Chip-/Slot-/Zonen-/Zeilen-Stellen aufrufen (SVG-rect: tabindex-Attribut setzen).
(b) fbHost bekommt aria-live="polite" (app_loeser.js:612); POOL_FEHLER-/R2-Banner role="alert".
(c) styles.css global: `:focus-visible { outline:2px solid var(--gelb); outline-offset:2px; }` (Buttons,
.opt, .zu-item, input, select, summary erben das automatisch). (d) Nummerierungs-Spans von
var(--gelb-hover) auf var(--text2) ODER neue Var --akzent-dunkel (hell #9a6b00 / dark unverändert prüfen).
VORAB-Nutzerfragen (bündeln): Teile a–d alle umsetzen oder Auswahl? (d): text2 oder neue Akzent-Var?
ENTSCHIEDEN (Nutzer 2026-07-16): ALLE Teile a+b+c+d umsetzen; (d) mit var(--text2) (Empfehlung angenommen).
Hinweis: (b) teilweise vorweggenommen – der R2-Banner hat bereits role="alert".
TESTS: tests/test_a11y.js erweitern (+~4: Chip hat tabindex/role, Enter wählt Option an, fbHost aria-live,
Nummerierung nutzt neue Farbe) → sollwerte a11y 21→(neu). Alle 21 Suiten + Render-Smoke.

## R11 – Datumsformat TT.MM.JJJJ in Anzeigen  [optional, Kosmetik, <30 Zeilen, Opus direkt]
BEFUND (3. Analyse): Anzeigen nutzen ISO-dayKey (JJJJ-MM-TT): Sim-Historie (app_sim.js:94, Trend-title :91),
Aktivitäts-Tooltips (app_seiten.js:93). L.dayKey selbst ist SPEICHER-SCHLÜSSEL (dailyCounts/serieDone/
simHistorie.datum, logik.js:581) – NIEMALS ändern, sonst Migrations-/Test-Bruch.
UMSETZUNG: Anzeige-Helfer `datumDE(key)` in app_util.js („2026-07-15"→„15.07.2026", ungültige Keys
unverändert durchreichen); NUR an Anzeige-Stellen einsetzen (vorher per `grep -n "datum\|dayKey" app_*.js`
alle Anzeige- vs. Schlüssel-Verwendungen klassifizieren; meldungen.datum-Ausgabe in Export/Einstellungen
mitprüfen). TESTS: +1–2 Units (test_robust: datumDE happy/ungültig) → sollwerte robust +1–2; alle 21 Suiten.
VORAB-Nutzerfrage: KEINE (kosmetisch, deutsche Locale offensichtlich gewollt).

## R-Notiz Phase F (kein eigener Task): fragen.js = 1,47 MB unminifiziert – lokal irrelevant; auf GitHub
Pages liefert der Server gzip/brotli (~80 % kleiner) automatisch. KEIN Minify einführen (Debugbarkeit,
byte-stabiler Build #89). In F2 nur kurz verifizieren (DevTools: content-encoding).

## AP2-G1 — Infra/CI-Fundament (Arbeitspaket 29 Ideen, Freigabe 2026-07-18)
Ziel-Version 0.8.0. Task-Reihenfolge innerhalb G1 (jeder Task: umsetzen→selbst prüfen→testen→Checkpoint→PAUSE):
- G1.1 #22 JSON-Schema (ZUERST, Schutznetz-Basis):
  * Struktur JE Fragetyp aus IST-Pool + logik.js-Validierung ableiten (nicht erfinden). Gemeinsame Pflichtfelder:
    id, modul, thema (KANONISCH = Object.keys(L.THEMA_RELEVANZ)), typ (∈ L.TYP), pruefungsteil (AP1|AP2),
    frage. Typ-spezifisch: mc(optionen[],loesungIndex), mehrfach(optionen[],loesungIndizes[]),
    dropdown(luecken[]/freitext), hotspot(svg,zonen[]), mtf/kreuztabelle/szenario2/… je Registry.
  * tools/schema/*.json (JSON-Schema Draft-07 je Typ) + tools/validate_schema.js (lädt fragen.js/pool, prüft je Typ).
    Muss auf IST-Pool (810) 0 Fehler liefern (sonst Schema zu streng → nachziehen, NICHT Pool ändern).
  * Einbau in check.sh (nach validate_pool) + später CI. KEIN sollwerte-Key (Pass/Fail-Gate).
- G1.2 #23 Render-Smoke: tests/test_render_smoke.js (jsdom boot, je L.TYP 1 reale Frage instanziieren→R_TYP rendern
  →graden ohne JS-Fehler). NEUER sollwerte-Key render_smoke=<#Typen>. In check.sh (voll) + _harness nutzen.
- G1.3 #12 CI: .github/workflows/ci.yml — ubuntu, node, `npm install jsdom`, `bash check.sh` (voll) bei push(main)+PR.
- G1.4 #42 Release-Tags: Actions-Step (bei Version-Bump auf main) Tag vX.Y.Z + Release mit CHANGELOG-Auszug.
- G1.5 #46 axe: CI-Job axe-core über gerenderte Hauptseiten (Start/Üben/Sim/Statistik/Einstellungen), blockierend.
- G1.6 #11 PWA-Update: sw.js (updatefound/statechange) + Inline-Guard → Hinweis, dann Auto-Reload NUR wenn keine
  Frage offen (loeseFrage-Zustand prüfen). styles.css Hinweis. file://-Pfad unberührt (Guard: nur http(s)).
- G1.7 #44 Manifest-Screenshots: 2 PNG (Start+Üben, narrow) per PIL; manifest „screenshots"[]; sw.js APP_FILES.
Abschluss G1: APP_VERSION 0.8.0 + sw.js CACHE_VERSION ap1-v0.8.0 + CHANGELOG; alle Suiten (inkl. render_smoke) grün.

## AP2-G2 — Inhalts-Batches (Arbeitspaket 29 Ideen; Detailplan nachgetragen 2026-07-19)
HINWEIS: Bei der G1-Planung wurde in START_PROMPT/TASKLIST auf „PLAENE AP2-G1..AP2-G5" verwiesen, tatsächlich
existierte nur AP2-G1. Maßgeblich für G2 ist der Block „G2" in TASKLIST 7-PLAN2; hier die Task-Zerlegung.
Ziel-Version 0.9.0. Reihenfolge (jeder Task: entwerfen → JEDE Frage selbst fachlich prüfen/nachrechnen →
build_fragen.py → Guards+Suiten → Checkpoint → PAUSE):
- G2.1 #10 ~10 Fragen zu aktueller Technik [FERTIG 2026-07-19, s. u.]
- G2.2 #9 sechs neue Fälle in faelle.js (breit, inkl. M01/M02; eigenes Schema, nicht pool/*.json!).
- G2.3 #7 ~6 Stufe-4-Aufgaben für dünne Profile (Auswahl per `node tools/pool_query.js coverage`).
- G2.4 #16 +4 szenario2 (Typ-Bestand damit 6 → 10).
- G2.5 #33 +6 Englisch (Kurztext + mc/mehrfach, Muster M02-734; KEINE Vokabel-Zuordnung).
- G2.6 #35 ECHTE Laufzeit-Randomisierung für rechenassistent: Formel + Wertebereiche im Datensatz,
  Musterlösung wird berechnet statt hinterlegt → Eingriff in logik.js (L.instanziiere/gradeRechenassistent)
  + neue/erweiterte Tests. ACHTUNG: einziger Task in G2 mit Logik-Änderung – Sollwerte können sich ändern.
Abschluss G2: APP_VERSION 0.9.0 + sw.js CACHE_VERSION ap1-v0.9.0 + CHANGELOG + alle Suiten grün + Push
(Tag/Release v0.9.0 entsteht automatisch über die G1.4-Action).

### G2.1 — Umsetzung (FERTIG 2026-07-19)
Nutzer-Entscheide: (a) IPv6-Aufbau unter „IP-Adressierung & Subnetting", aber pruefungsteil AP1 – das Thema
enthält damit erstmals gemischt AP1+AP2 (bisher 12/12 AP2); zulässig, weil die Teil-Zuordnung Konvention ist
und NICHT validiert wird (logik.js prüft nur AP1|AP2). (b) Verteilung Cloud 3 / IPv6 3 / USB4-TB 2 / Wi-Fi 7 2.
(c) Formatmix inklusive der neueren Typen statt nur mc/mehrfach.
Datei pool/pool_m_g2.json (10 Fragen): M03-900 mc Container vs. VM, M03-901 mtf Servicemodelle,
M03-902 kreuztabelle geteilte Verantwortung IaaS/PaaS/SaaS, M04-925 mc IPv6-Aufbau, M04-926 mehrfach
IPv6-Eigenschaften, M04-927 dropdown IPv6-Notation, M03-903 mc USB4-Mindestrate, M03-904 mehrfach
Thunderbolt 5, M03-905 mc Wi-Fi 7 MLO, M03-906 mehrfach 802.11be-Merkmale.
Wirkung: Pool 810 → 820. Cloud & Virtualisierung 8 → 11 (5 Formate), WLAN & Übertragungsstandards 7 → 9
(5 Formate), Hardware-Komponenten 23 → 25, IP-Adressierung & Subnetting 12 → 15.

### G2.3 — Umsetzung (FERTIG 2026-07-19)
PLANABWEICHUNG (bewusst, mit Rückfrage): Der Plan wollte Stufe-4-Aufgaben für „dünne Profile" laut
`node tools/pool_query.js coverage`. Dieses Kriterium ist LEER – seit S-B/G2.1 meldet coverage kein dünnes
und kein einseitiges Thema mehr. Ersatzkriterium: die 41 von 73 Themen ganz OHNE Stufe-4-Frage, sortiert
nach L.THEMA_RELEVANZ (rel=3 zuerst).
Nutzer-Entscheide: (a) Auswahl „breit über Module" (Alternativen waren „größter Bestand", PM-Schwerpunkt,
Rechen-Schwerpunkt); (b) Stufe-4-Auslegung „Mix je Thema" statt durchgängig Transfer bzw. durchgängig Rechnung.
Datei pool/pool_m_g2_st4.json (6 Fragen, alle AP1, schwierigkeit 4): M03-907 mehrfach Hardware-Komponenten
(CAD-Aufrüstung), M03-908 rechenassistent Berechnungen: Energie (5 Schritte bis Amortisationszeit, 2 Varianten),
M05-962 mtf PDCA & KVP (5 Aussagen zu einem Support-Verbesserungszyklus), M05-963 mc Testprotokoll
(„bestanden" trotz Soll-Ist-Abweichung), M06-973 mehrfach Passwörter & Authentifizierung (Richtlinie nach
aktuellem Stand der Technik), M04-928 mc Lastenheft & Pflichtenheft (Anforderung fehlt im Pflichtenheft).
Wirkung: Pool 820 → 826; die 6 Themen haben jetzt je genau 1 Stufe-4-Frage, Themen ohne St4 41 → 35.
Kein Version-Bump, Sollwerte unverändert (kein neuer Typ). Belege s. BUILD_LOG 2026-07-19 G2.3.

### G2.4 — Umsetzung (FERTIG 2026-07-19)
Nutzer-Entscheide: (a) Auswahl „Lücken schließen" – M02, M03, M05 hatten noch kein szenario2 (Bestand lag
auf M01, M04 x2, M06 x2, M07); (b) Stufenmix 2x St2 / 2x St3, weil der Bestand mit 5x St2 unten lastig war.
Angehängt an die BESTEHENDE pool/pool_m_szenario2.json (bewusst kein neuer Dateiname): M02-926 St3
Bezugskalkulation & Skonto, M03-909 St2 Netzwerkkomponenten & Medien, M03-910 St3 Wirtschaftlichkeit & TCO,
M05-964 St2 Testprotokoll. Wirkung: szenario2 6 → 10 (Planziel), Pool 826 → 830, Typ deckt jetzt alle sieben
AP1-Module ab. Sollwerte registry/meta UNVERÄNDERT – sie zählen pro Typ, nicht pro Frage (bei C4 stiegen sie
nur, weil der Typ damals neu war). Belege s. BUILD_LOG 2026-07-19 G2.4.

### G2.5 — Umsetzung (FERTIG 2026-07-19)
Nutzer-Entscheide: (a) Textsorten-Paket „Betrieb & Beschaffung"; (b) 3 mc / 3 mehrfach, St2+St3 gemischt.
Vorab-Abgleich gegen die 13 vorhandenen Fragen des Themas, damit sich keine Textsorte doppelt – die 6 neuen
bringen ausschließlich bis dahin fehlende Sorten. Datei pool/pool_m_g2_englisch.json (alle M02 / „Englische
Fachtexte" / AP1, Muster M02-734 = englischer Kurztext + deutsche Aussagen, KEINE Vokabel-Zuordnung):
M02-958 mc St2 End-of-Life Notice, M02-959 mehrfach St3 Returns Policy/RMA, M02-960 mc St2 Request for
Quotation, M02-961 mehrfach St3 Incident Report, M02-962 mc St3 Handbuch-Sicherheitshinweis, M02-963
mehrfach St2 Privacy Notice. Konstruktionsregel: JEDER Distraktor ist im englischen Text nachweislich
widerlegt (nicht nur „nicht erwähnt") – geprüft wird Leseverständnis, nicht Weltwissen.
Wirkung: Pool 830 → 836, Thema 13 → 19 (mc 10 / mehrfach 7 / dropdown 2; 11x St2, 8x St3).
Kein Version-Bump, Sollwerte unverändert. Belege s. BUILD_LOG 2026-07-19 G2.5.

### G2.6 — Umsetzung (FERTIG 2026-07-19)
Nutzer-Entscheide: Mini-Parser in logik.js (kein `new Function`) · ALLE 25 migrieren · ganzzahlige Ziehung
mit Schrittweite · 2 Dezimalen mit 1 Cent Toleranz · Erklärungen per Ausdrucks-Platzhalter automatisch
parametrisieren · Gegenprobe gegen alle Altwerte.
DATENFORMAT (neu, abwärtskompatibel): Die Frage trägt `variablen: {name:{min,max,schritt}}`, je Schritt
steht `formel` (Operatoren + - * / ( ), Variablen und `s1..sN` = Vorgängerergebnisse) statt `loesung`,
optional `dezimalen` (Default 2). Texte nutzen Platzhalter `{var}`, `{ausdruck}` und `{ausdruck|N}`.
Fragen OHNE `variablen` bleiben unverändert gültig – das Schema erzwingt per `oneOf` genau eine Bauform.
HYBRID: M04-538 (Subnetting) und M02-535 (Nutzwertanalyse) behalten feste Varianten, weil ihre Schritte
Text-Antworten verlangen („/27", IP-Listen, „Dienstleister B, 0,45").
FALLSTRICKE (dokumentiert, weil sie Zeit gekostet haben): (1) `instanziiere` darf NIE werfen – eine
entartende Kombination (Ersparnis 0 → Division durch 0) hätte `loeseFrage` abgebrochen; jetzt 25 Versuche
plus Rückfallebene, und der Validator prüft alle Extremkombinationen schon zur Bauzeit. (2) Bei der
Text-Parametrisierung ersetzen spätere Zahlregeln sonst Ziffern INNERHALB fertiger Platzhalter – Lösung:
ziffernfreie Token. (3) Zahlen-Kollisionen (z. B. „5 Wochentage" bei vollMB=500) kann keine automatische
Rückprobe finden, weil sie bei den Altwerten identisch aussehen – deshalb wurden alle 23 Texte von Hand
nachgelesen; 5 Kollisionen und 1 Altfehler (M02-540) kamen dabei ans Licht.
Wirkung: 23 Aufgaben echt randomisiert, neue Suite tests/test_rechnen.js (64) → 25 Suiten.
Belege s. BUILD_LOG 2026-07-19 G2.6. Migrationsskripte: tools/migration/.

### G2-ABSCHLUSS (ERLEDIGT 2026-07-19)
APP_VERSION 0.9.0, sw.js CACHE_VERSION ap1-v0.9.0, CHANGELOG-Block, alle 25 Suiten grün,
Commit b66cdfd auf origin/main, refs/tags/v0.9.0 durch die CI erzeugt. Belege s. BUILD_LOG.

## AP2-G3 — Lernmotor (Detailplan, angelegt 2026-07-19)
Ziel-Version **0.10.0** (nicht 1.0.0 – das wird erst G5). Ideen: #1 Spaced Repetition, #6 Adaptive
Schwierigkeit, #4 Meisterung, #13 Top-Schwächen-Liste, #27 „Ähnliches üben", #5 Simulation/Notenschlüssel.
Nutzer-Entscheid zur Reihenfolge (2026-07-19): **Motor zuerst, Anzeige danach.**

#### BESTANDSAUFNAHME (2026-07-19 im Code erhoben – WICHTIG, weil der Plan sie nicht kennt)
1. **Statistik ist THEMENbasiert, nicht fragebasiert:** `S.statistik["T:"+modul+":"+thema] = {richtig, gesamt}`
   (app_verbuchen.js:9). Auf Frage-Ebene existieren nur `S.seen`, `S.lastShown` und das Fehler-Deck.
   Leitner (#1) und Meisterung (#4) brauchen aber einen Stand PRO FRAGE → neue State-Struktur + Migration
   + STATE_VERSION 5 → 6.
2. **Es gibt bereits ein Wiedervorlage-System:** das Fehler-Deck mit Fälligkeiten (`L.fdDue`, logik.js:924),
   eingestreut in `naechsteFrage` (app_seiten.js:246, max. 1 von 5). Leitner würde dieselbe Aufgabe
   übernehmen → das Verhältnis beider Systeme MUSS geklärt werden, sonst hat eine Frage zwei
   widersprüchliche Termine.
3. **Es gibt bereits eine Schwierigkeits-Mechanik:** `S.level` (1–4) GLOBAL, `S.levelModus` auto/manuell,
   `S.levelTrack` + `L.trackAntwort`/`L.levelReif` (8 von 10 richtig) und `zeigeLevelDialog`
   (app_verbuchen.js:29) – der Nutzer wird GEFRAGT, es wird nichts automatisch umgestellt.
   `kandidaten()` filtert auf `f.schwierigkeit === S.level` mit Fallback auf den ganzen Pool.
   Idee #6 will stattdessen ±1 JE THEMA nach 3 Antworten, automatisch. Das ersetzt die globale Stufe
   faktisch → Entscheidung nötig, was aus Dialog und manuellem Modus wird.
4. **naechsteFrage ist mehrstufig** (app_seiten.js:240): Themen-Serie → Fehler-Deck-Einstreuung →
   Generator-Einstreuung → gewichtete Deck-Ziehung (A3 über `L.gewichteFrage`/`L.deckPick`).
   SR ersetzt laut Plan den A3-Zweig; A3 bleibt DORMANT, damit test_engine=70 grün bleibt.
5. **Notenschlüssel:** `L.note` kennt 92/81/67/50 und fasst alles darunter als Note 5 zusammen.
   Der IHK-Schlüssel unterscheidet zusätzlich 49–30 (mangelhaft, Note 5) und 29–0 (ungenügend, Note 6).
   Idee #5 nennt „92/81/67/50/30" – die 30er-Grenze fehlt also noch.
6. **Sim-Gewichte** stehen in `AP1_AUFGABEN` (app_seiten.js:430) mit 25/25/26/24 Punkten. Idee #5 verlangt,
   die REALEN AP1-Gewichte zu recherchieren, den Befund VORZULEGEN und erst danach umzubauen.

#### ENTSCHEIDE E1–E3 – GEKLÄRT AM 2026-07-19
- **E1 Fehler-Deck vs. Leitner → #1 (Leitner) WIRD GESTRICHEN.** Nutzer-Entscheid. Damit entfällt G3.1
  vollständig, ebenso die geplante State-Erweiterung auf Frage-Ebene und der STATE_VERSION-Bump 5 → 6.
  NACHTRÄGLICHER BEFUND, der den Entscheid stützt: Das Fehler-Deck IST bereits ein Leitner-System in
  vereinfachter Form – `L.fdOnWrong` setzt die Frage auf „morgen", `L.fdOnCorrect` staffelt auf 3 bzw.
  7 Tage (`fdTageStreak1`/`fdTageStreakRest`), und nach `fdStreakWeg` = 3 Treffern in Folge verlässt die
  Frage das Deck. Das entspricht einem 3-Box-Leitner mit 1/3/7 Tagen.
- **E2 Migration der Bestandsdaten → HINFÄLLIG.** Der Nutzer hatte „Themenquote bestimmt die Startbox"
  gewählt; ohne Leitner gibt es keine Boxen und keine Migration. Falls #1 je reaktiviert wird, gilt
  dieser Entscheid als gesetzt.
- **E3 Globale Stufe → #6 wird umgesetzt, der Level-Dialog ENTFÄLLT.** Nutzer-Entscheid: ±1 je Thema
  nach 3 Antworten, Grenzen 1–4, Default AN. Der MANUELLE Modus (`S.levelModus === "manuell"`) BLEIBT
  als Übersteuerung erhalten. Betroffen: `zeigeLevelDialog`, `L.trackAntwort`/`L.levelReif`,
  `S.levelTrack`/`S.levelDialogGezeigt`, `kandidaten()` (filtert bisher global auf `S.level`).

#### TASK-ZERLEGUNG
- **G3.1 #1 Spaced Repetition (Leitner)** – ❌ GESTRICHEN (E1, 2026-07-19). Das Fehler-Deck leistet das
  Wesentliche bereits (1/3/7 Tage, Ausscheiden nach 3 Treffern). Kein STATE_VERSION-Bump, keine
  Frage-Ebene-Migration, kein `test_leitner`. Bei Bedarf über den Ideenspeicher reaktivierbar.
- **G3.2 #6 Adaptive Schwierigkeit** – ✅ FERTIG 2026-07-19 (v0.11.0). Nutzer-Entscheide: 3er-Block mit
  Reset (3/3 → +1, ≤1 → −1, sonst gleich, höchstens eine Änderung je Block), `S.level` bleibt Startwert
  für unbekannte Themen und Übersteuerung im manuellen Modus, harter Filter je Thema mit dem bisherigen
  Pool-Fallback, alte Logik-Funktionen bleiben ungenutzt stehen (Sollwert test_logik 2162 unangetastet).
  Umgesetzt: `L.themaKey`/`L.themaStufe`/`L.adaptivBuchen` + `L.CONFIG.adaptivBlock`/`adaptivAbSchwelle`
  (logik.js), `S.themaLevel`/`S.themaTrack` (app_state.js, KEIN STATE_VERSION-Bump nötig – Defaults
  kommen über `Object.assign` in `ladeState()`), `stufeFuer()` + umgestelltes `kandidaten()`
  (app_seiten.js), `L.adaptivBuchen`-Aufruf statt 8/10-Block, `zeigeLevelDialog()` gelöscht
  (app_verbuchen.js), Auto-Hinweis statt Festwert auf der Übungsseite. Neue Suite `test_adaptiv` (49)
  → 28 Suiten. Details im BUILD_LOG.
- **G3.3 #4 Meisterung** – ✅ FAKTISCH BEREITS ERFÜLLT. `L.fdOnCorrect` entfernt eine Frage nach
  `L.CONFIG.fdStreakWeg` = **3** Treffern in Folge aus dem Fehler-Deck; die Idee nannte 2. Offen ist
  damit nur noch die Frage, ob der Schwellwert von 3 auf 2 gesenkt werden soll – eine Zeile in
  `L.CONFIG`, die die Sollwerte von test_logik berühren kann. NICHT als eigener Task nötig.
- **G3.4 #27 „Ähnliches üben"** – ✅ FERTIG 2026-07-19. BEFUND: war als #60 bereits umgesetzt
  (`zeigeThemenSerieAngebot`, app_seiten.js:174, getestet in test_engine E4). Einzige Änderung nach
  Nutzer-Entscheid: das Adaptiv-Gate (>30 beantwortete Fragen) an der Aufrufstelle entfernt, damit das
  Angebot auch beim Einstieg erscheint. `L.CONFIG.gate` bleibt für Adaptiv/Glossar/Abkürzungen aktiv.
- **G3.5 #13 Top-Schwächen-Liste** – ✅ GESCHLOSSEN 2026-07-19 (Nutzer-Entscheid: „nichts bauen").
  BEFUND, der den Entscheid trägt: Die Themen-Hälfte der Idee ist längst umgesetzt – Panel
  „Schwächste Themen (mind. 3 Antworten)" auf der Statistik-Seite, Top 8 nach Trefferquote mit Balken
  (app_pages2.js, sStatistik). Gefehlt hätte nur die FORMAT-Dimension, und dafür gibt es überhaupt
  keine Erfassung: `S.statistik` kennt nur Modul, `T:modul:thema` und `GEN:*`, nichts je Fragetyp.
  Format-Daten wären also erst ab Einbau entstanden (rückwirkend nichts), und für die 21 Typen hätten
  erst menschenlesbare Namen angelegt werden müssen. Aufwand/Nutzen dafür zu schlecht.
  FALLS JE REAKTIVIERT, gelten diese bereits getroffenen Nutzer-Entscheide: Format-Statistik global
  (Keys `F:typ`) plus eigenes Panel unter der Themenliste – NICHT die volle Kreuzung Thema × Format
  (zu datenhungrig); Schwelle **5 Antworten** je Format (strenger als die 3 bei den Themen, weil eine
  Quote aus 3 Antworten in 33er-Sprüngen schwankt); Panel **immer sichtbar** mit Hinweis, dass die
  Formatdaten ab jetzt gesammelt werden.
- **G3.6 #5 Simulation/Note** – zwei Teile: (a) Notenschlüssel um die 30er-Grenze ergänzen (Note 5/6
  trennen) + Ergebnis-Screen mit Note/Punkten/Prozent, neue Suite `test_note`; (b) REALE AP1-Gewichte
  recherchieren, Befund vorlegen, PAUSE für Nutzer-Entscheid, erst danach `AP1_AUFGABEN` anfassen.
  Teil (a) ist unabhängig von E1–E3, Teil (b) endet planmäßig in einer Pause.
  ✅ TEIL (a) FERTIG 2026-07-19: Der Ergebnis-Screen war bereits vollständig; ergänzt wurde der fehlende
  Teil des Notenschlüssels – `L.note` trennt jetzt 49–30 (Note 5 „mangelhaft") und unter 30 (Note 6
  „ungenügend"), Schlüssel und Bestehensgrenze liegen als `L.NOTEN_SCHLUESSEL`/`L.NOTE_BESTANDEN_AB`
  als Single Source vor. Neue Suite tests/test_note.js (41).
  ✅ TEIL (b) FERTIG 2026-07-19. RECHERCHE-BEFUND (zwei unabhängige Quellen): AP1 = vier ungebundene
  Aufgaben, je 20–30 Punkte, Summe 100, 90 Minuten; der Schwerpunkt jeder Aufgabe wird ZUFÄLLIG
  gezogen. Die festen 25/25/26/24 sind damit nicht falsch (Summe 100, alle im Korridor), aber nur eine
  von vielen Ausprägungen. Nutzer-Entscheide: Punkte je Simulationslauf würfeln; thematische Zuordnung
  der vier Aufgaben FEST lassen, damit jeder Durchlauf den ganzen Stoff abdeckt. Umgesetzt:
  `L.wuerfelPunkte` + `L.CONFIG.ap1PunkteMin/Max/Summe` (logik.js), `simPunkte`/`neuePunkteVerteilung()`/
  `punkteFuer(bi)` und Einfrieren als `sim.punkte` beim Start (app_sim.js), Hinweistext
  `TEXTE.hinweis.ap1PunkteVariieren`. test_note 41 → 55. NEBENBEFUND, noch offen: AP1 enthält
  ausschließlich UNGEBUNDENE Aufgaben (frei formuliert), die Simulation arbeitet mit auto-bewertbaren
  Formaten – grundsätzlicher Punkt, dem Nutzer vorgelegt, noch nicht entschieden.
- **Gruppen-Abschluss:** ✅ GRUPPE G3 KOMPLETT 2026-07-19. APP_VERSION 0.11.0 + sw.js ap1-v0.11.0 +
  CHANGELOG-Block v0.11.0 (enthält G3.2 UND G3.6b – v0.11.0 war beim Nachtrag noch nicht veröffentlicht,
  deshalb kein Phantom-Release 0.12.0). 28 Suiten. PUSH STEHT NOCH AUS.

#### ARBEITSREIHENFOLGE
Beschlossen ist „Motor zuerst". Da G3.1–G3.3 an E1–E3 hängen, ist die tatsächlich mögliche Reihenfolge:
zuerst die Entscheide E1–E3 klären, dann G3.1 → G3.2 → G3.3 → G3.4 → G3.5 → G3.6.
Solange E1–E3 offen sind, sind nur **G3.4, G3.5 und G3.6(a)** arbeitsfähig.

#### QUERSCHNITT
STATE_VERSION steigt in G3 (Migration in `migriereState`, app_state.js – Reihenfolge-Falle beachten:
muss VOR `var S = ladeState()` stehen). sollwerte.env wächst um test_leitner/test_adaptiv/test_note.
Offline-Invariante und „fragen.js nur via build" bleiben unangetastet. Vor G3.1 ein Backup ziehen
(State-Migration ist der riskanteste Eingriff der Gruppe).

## AP2-G4 — Technik (Detailplan, angelegt 2026-07-19)
Ziel-Version **0.11.0**. Ideen: #21 EAGER-Split von fragen.js je Modul, #29 Deep-Links/Hash-Routing.
(#32 IndexedDB ist im IDEENSPEICHER zurückgestellt.) Vom Nutzer am 2026-07-19 vor G3.1–G3.3/G3.5 gezogen.

#### BESTANDSAUFNAHME (2026-07-19)
1. **fragen.js ist 1,54 MB / 26.172 Zeilen** – mit Abstand die größte Datei (logik.js 81 KB,
   faelle.js 86 KB). Sie wird in `lernprogramm_ap1.html:18` als EIN `<script src>` eager geladen.
2. **Es gibt KEIN Routing.** Die aktuelle Seite steht in der globalen Variablen `seite`
   (app_ui.js:166), gesetzt an **10 Stellen** nach dem Muster `seite = "x"; render();`.
   Kein `location.hash`, kein `hashchange`, kein `popstate` – der Browser-Zurück-Button verlässt
   deshalb die App, statt eine Seite zurückzugehen. #29 ist also vollständig neu zu bauen.
3. **Der Service Worker cached mit einem versionierten Cache-Namen** (`CACHE_VERSION`, sw.js:8) und
   `cache.addAll(APP_FILES)` beim Install; beim Activate werden alle anderen Caches gelöscht.

#### ⚠️ BEFUND ZU #21 – der erwartete Nutzen greift so NICHT
Der Plan begründet den Split mit „Offline-Doppelklick garantiert". Das ist bereits erfüllt: Der
P22-Doppelklick-Test lief am 2026-07-19 erfolgreich, die App startet unter file:// vollständig.
Der zweite denkbare Nutzen – bei einem Update nur das geänderte Modul nachladen statt 1,5 MB – wird
durch die aktuelle Cache-Strategie aufgehoben: Weil der Cache-Name die APP-VERSION enthält, lädt der
Service Worker bei JEDEM Versions-Bump ohnehin **alle** Dateien neu. Ein Split allein ändert daran
nichts; er würde erst wirken, wenn zusätzlich die Cache-Strategie umgestellt wird (z. B. Cache-Name
je Datei-Hash statt global). Realer Restnutzen ohne Strategiewechsel: kleinere Git-Diffs und
handlichere Dateien beim Bearbeiten. Dem stehen Änderungen an build_fragen.py, sw.js APP_FILES, dem
HTML-Head, check.sh und dem Drift-Guard gegenüber – plus das Risiko, die Offline-Invariante zu brechen.
**→ Vor G4.1 zu entscheiden (E4):** Split trotzdem umsetzen (kleinere Diffs), Split + Cache-Strategie
umstellen (voller Nutzen, mehr Aufwand/Risiko), oder #21 in den Ideenspeicher zurückstellen und nur
#29 bauen.

#### TASK-ZERLEGUNG
- **G4.1 #21 fragen.js-Split** – ⏸️ ZURÜCKGESTELLT in den IDEENSPEICHER (Nutzer-Entscheid E4,
  2026-07-19). Begründung s. Befund oben: Der Offline-Nutzen ist bereits erfüllt, der Cache-Nutzen
  greift ohne Umbau der Cache-Strategie nicht, und dem geringen Restnutzen stehen Eingriffe in
  build_fragen.py, sw.js, HTML, check.sh und den Drift-Guard gegenüber. Wieder aufnehmbar, falls die
  Cache-Strategie ohnehin einmal angefasst wird (dann zusammen umsetzen).
- **G4.2 #29 Deep-Links** – ✅ FERTIG 2026-07-19 (Belege s. BUILD_LOG). Umgesetzt wie geplant:
  zentrale `gotoSeite(name, opts)` statt 10 verstreuter `seite = …`-Zuweisungen;
  `location.hash` als Quelle der Wahrheit (`#ueben`, `#stat`, …) plus `#frage=ID` für eine Einzelfrage;
  `hashchange`-Listener; echter Browser-Zurück-Button. MUSS unter file:// funktionieren (dort ist
  `history.pushState` eingeschränkt → Hash statt History-API, deshalb im Plan bewusst Hash-Routing).
  Neue Suite `test_routing` (29) → sollwerte `routing=29`. UNABHÄNGIG von E4.
  Fund beim Testen: ein Flag zur Unterscheidung „eigenes Hash-Schreiben vs. echte Navigation" bleibt
  hängen, wenn das hashchange-Event ausbleibt – ersetzt durch einen zustandslosen Zustandsvergleich.
- **Gruppen-Abschluss:** APP_VERSION 0.11.0 + sw.js ap1-v0.11.0 + CHANGELOG + voller check.sh + push.sh.
  Da G4.1 entfällt, besteht G4 faktisch nur aus G4.2.

#### RISIKEN
G4.2 fasst die Navigation an, die JEDE Seite betrifft – die jsdom-Suiten navigieren teils über `seite`
und `render()` direkt; sie müssen nach dem Umbau unverändert grün bleiben (sonst ist die Kapselung
unvollständig). G4.1 berührt den generierten Pool: `fragen.js NIE direkt editieren` gilt weiter, der
Drift-Guard muss alle neuen Dateien abdecken.

---

## AP2-G5 — UX/A11y/Website (Detailplan, angelegt 2026-07-21)

#### AUSGANGSLAGE (gemessen, nicht vermutet)
Die Gruppe umfasste ursprünglich sechs Ideen (24, 26, 28, 30, 31, 39). Beim Bestandsabgleich:
- **#24** ausklappbar „Warum falsch?" — BEREITS GEBAUT (Distraktor-Erklärungen in `zeigeErklaerung`).
- **#28** Onboarding-Tour — BEREITS GEBAUT (`ONB_SCHRITTE`, `S.onboardingDone`, 6 Schritte).
- **#26** Vorlese-Button — GESTRICHEN (Nutzer-Entscheid).
- **#30/#31** — FERTIG 2026-07-21 in v0.15.0 (siehe BUILD_LOG).
→ Real offen ist NUR noch **#39 Landing-Page**.

#### G5.1 — #39 echte Landing-Page
AUSGANGSLAGE: `index.html` ist eine 10-zeilige Meta-Refresh-Weiterleitung auf
`lernprogramm_ap1.html`. Das Manifest hat `start_url: "."` und `scope: "."` — die installierte App
startet also über index.html und nimmt den Umweg über die Weiterleitung.

NUTZER-ENTSCHEIDE 2026-07-21:
- `start_url` zeigt künftig DIREKT auf `lernprogramm_ap1.html`. Sonst würde die installierte App
  bei jedem Start auf der Landing hängen — ein Klick mehr, jedes Mal. `scope` bleibt "." , damit
  Landing UND App zum selben PWA-Scope gehören.
- Inhalt der Landing: Kurzbeschreibung + „App starten"-Button, Installations-Anleitung
  (Android UND iOS — iOS zeigt keinen automatischen Installations-Dialog), Funktionsübersicht,
  Offline-Hinweis samt Aussage, dass der Lernstand lokal im Browser bleibt.

UMSETZUNG:
- `index.html` neu: eigenständige Seite im Design der App (dieselben Farb-Tokens), aber BEWUSST
  ohne `styles.css`/`app_*.js` — die Landing muss ohne den App-Stack laden und darf die
  Offline-Invariante nicht berühren. Styles daher inline im `<head>`.
- `manifest.webmanifest`: `start_url` → `lernprogramm_ap1.html`.
- `sw.js`: `index.html` ist bereits in `APP_FILES`; CACHE_VERSION beim Release hochziehen.
- Die Weiterleitung entfällt ersatzlos — wer die Adresse aufruft, sieht die Landing.

INVARIANTEN, die NICHT brechen dürfen:
- **Doppelklick-Betrieb unter file://**: `lernprogramm_ap1.html` bleibt direkt per Doppelklick
  lauffähig; die Landing ist nur ein zusätzlicher Einstieg, kein Zwischenschritt.
- **Offline-Audit 0 externe URLs**: keine Fonts, keine CDN-Skripte, keine externen Bilder.
- **test_pwa** prüft Manifest und Cacheliste — muss nach der `start_url`-Änderung nachgezogen werden.

VERIFIKATION:
- `node --check` entfällt (reines HTML) → stattdessen HTML-Parse in jsdom + Prüfung, dass der
  „App starten"-Link auf `lernprogramm_ap1.html` zeigt.
- Manifest bleibt valides JSON, `start_url` innerhalb von `scope`.
- Offline-Audit über index.html mitziehen (bisher deckte es die Datei nicht ab).
- Neue Tests in `test_pwa`; Gegenprobe fahren, bevor sie als Absicherung gelten.

#### GRUPPEN-ABSCHLUSS
APP_VERSION 1.0.0 + sw.js ap1-v1.0.0 + CHANGELOG. Der Sprung auf 1.0.0 ist bewusst: mit G5 ist das
Arbeitspaket „29 Ideen" abgeschlossen. **Push NUR auf ausdrückliche Freigabe.**

#### RISIKEN
Die `start_url`-Änderung betrifft bereits installierte Instanzen: sie übernehmen das neue Manifest
erst nach einem Update-Zyklus. Das ist unkritisch (beide Ziele funktionieren), sollte aber im
CHANGELOG stehen. Zweites Risiko: eine Landing-Seite verleitet dazu, Fonts oder Icons von außen zu
laden — das würde die Offline-Invariante brechen und wird vom Offline-Audit gefangen.

## FB — FEEDBACK-RUNDEN 1–3 (Nutzer-Feedback 2026-07-21; Plan freigegeben-ausstehend)
Quelle: strukturiertes Tester-Feedback (UI/Design, Mechaniken, Inhalt, Navigation).
NUTZER-ENTSCHEIDE (2026-07-21, per AskUserQuestion):
  (E1) Feedback VOR AP1-Freitext S3; S3 wird in Runde 2 integriert (Überschneidung Toleranz-Auswertung).
  (E2) „Rhaus"/„Rhaus-Metall" (882 Vorkommen; fragen.js 399, faelle.js 17) KOMPLETT ersetzen durch
       PRO AUFGABE passende, neutrale Beispielfirmen (nicht ein Globalname). Hinweis: „Rheinmetall"
       kam nie vor — Namensähnlichkeit war der Anstoß.
  (E3) Markieren-Button NUR AUSBLENDEN (Einstellung, Default AUS); Feature+Tests bleiben.
       Melden-Button bekommt die markante Position.
  (E4) Drag&Drop: ECHTES Drag am Desktop + Klick-Mechanik als Touch-Fallback (beides),
       dazu Links/Rechts-Layout + Reset-Button.
NACHTRAG 2026-07-21 (zweite Rückfrage-Runde, per AskUserQuestion – die 5 offenen Vorab-Fragen sind ENTSCHIEDEN):
  (E5→FB-R2.5) MC Stufe 1/2: Antwort-Rotation für ALLE MC-Fragen (vorher prüfen, ob Shuffle schon
       existiert!) + kleiner Batch ~16 neue Mehrfach-Fragen Stufe 1/2 (≈2 je Modul, Haiku, Opus prüft).
  (E6→FB-R2.6) Alternativantworten: EINDEUTIG berechtigte Alternativen direkt einpflegen,
       nur GRENZFÄLLE gebündelt dem Nutzer vorlegen.
  (E7→FB-R3.1) Firmennamen: PRO AUFGABE kontextpassend wählen (keine feste Mini-Palette) –
       Agent schlägt je Aufgabe/Fall einen zur Aufgabe passenden, neutralen Namen vor;
       finale Namensliste (Aufgabe→Name) VOR der Ersetzung dem Nutzer zur Freigabe.
  (E8→FB-R3.8) „Ähnliche Fragen": als Button nach dem Beantworten („Ähnliche Frage üben",
       gleiches Thema, bevorzugt gleicher Typ/Stufe; offline, keine neuen Inhalte nötig).
  (E9→FB-R3.9) Sortierungs-Feedback: Nutzer weiß nicht sicher, welche Ansicht gemeint ist →
       beim R3-Start Screenshots der Kandidaten-Ansichten (Themen-Auswahl Üben / Statistik /
       Fälle-Liste) zeigen und Nutzer entscheiden lassen; erst DANN umbauen.
ARBEITSMODUS: 3 Runden, je Runde voller Kontroll-Zyklus (Agenten-Matrix Abschn. 0 TASKLIST;
Agenten NUR auf /tmp; Opus liest jeden Diff, führt ALLE Suiten selbst, Render-Smoke, Offline-Audit,
Mobile-Audit pointer:coarse/44px) → Version-Bump + CHANGELOG + Checkpoint → PAUSE, Nutzer testet
am Handy → erst nach Freigabe nächste Runde. KEIN Push ohne ausdrückliche Freigabe.

### FB-R1 — UI/UX-Quick-Wins  [FERTIG 2026-07-21 → v1.1.0; laengst ausgeliefert, spaetestens mit v1.3.0]
ERGEBNIS: alle 10 Punkte umgesetzt. Zwei Punkte waren im Plan falsch beschrieben und wurden nach
Nutzer-Rückfrage korrigiert: R1.5 meinte beschriftung/hotspot (matrix hat gar kein Bild), R1.10 war
halb erfüllt (Notiz war schon zugeklappt) → Funktion jetzt ganz ausgeblendet. Neue Suite
tests/test_fb_r1.js (42), Sollwerte markiert 26 / unterricht 64 / 31 Suiten. Messwerte, Ursache des
Kontrast-Bugs, Testfallen und die vier Gegenproben: BUILD_LOG-Eintrag ganz oben.
NACHTRÄGLICHE ENTSCHEIDE (2026-07-21): R1.4 Tap-Zoom überall außer hotspot · R1.6 Panels starten
zugeklappt, Zustand persistiert (S.panelOffen) · R1.8 S.markierenAn Default false.
ZWEI BEWUSSTE AUSNAHMEN, dem Nutzer vorgelegt: Startseiten-Statistik bleibt aufgeklappt (Konflikt
mit L1-Entscheid „Bereitschafts-Zeile immer sichtbar"); UNTERRICHT_MODUL bleibt „Unser Unterricht".

<details><summary>Ursprünglicher Detailplan (Historie)</summary>

1. Kontrast: ausgewählte Antworten (.opt.gewaehlt u. ä.) lesbar machen — Leuchten reduzieren,
   Textkontrast ≥4.5:1; test_a11y erweitern.
2. Falsche Antwort → Erklärung/<details> automatisch aufklappen (Guard: nicht in Simulation).
3. Reset-Button für zuordnung/matrix/beschriftung/baukasten (Zwischenstand verwerfen).
4. Bild-Zoom: SVG/Bilder per Tap/Klick vergrößern (bestehende zoombtn-Mechanik auf alle Bildtypen).
5. Matrix-Aufgaben: Bild unter die Antwortfläche; Darstellung-Bug prüfen und fixen.
6. Statistik-Panels in allen Ansichten einklappbar (<details>, Zustand in S persistiert).
7. Swipe-Hinweis/-Geste nur bei Touch (@media pointer:coarse bzw. Feature-Detect).
8. E3 umsetzen: Markieren ausblendbar (Default AUS), Melden markanter platzieren.
9. „Unser Unterricht" → „Vorbereitung nächste Klausur" (TEXTE zentral) + eigener Zurück-Button;
   Schwierigkeits-Skalierung M09 verifizieren (test_unterricht).
10. Eigene Notizen default ausblenden.
VERIFIKATION R1: alle 30 Suiten Sollwert (sollwerte.env), Render-Smoke, Offline 0, a11y-Kontrastmessung,
jsdom-Differential wo „0 visuelle Änderung" gilt. Version-Bump minor.
</details>

### FB-R2 — Mechaniken (Sonnet-Entwürfe auf /tmp; Opus integriert + prüft)
> STAND 2026-07-21 nach dem Bestandsabgleich: **R2a (Punkte 1 und 6) ist ERLEDIGT → v1.2.0.**
> Punkt 2 (Drag&Drop) war BEREITS GEBAUT – offen ist nur das Links/Rechts-Layout am Handy.
> Von Punkt 5 ist die Antwort-Rotation hinfällig (läuft längst stufenunabhängig für mc UND
> mehrfach); übrig bleiben die ~16 neuen Mehrfach-Fragen mit Schwerpunkt Stufe 1/2.
> **R2b = Punkte 3, 4, der Rest von 5 und das Layout aus 2.**
1. AP1-FREITEXT SCHRITT 3 (aus OFFEN-Liste) + tolerante Auswertung: Groß-/Kleinschreibung,
   Tippfehler-Toleranz (Levenshtein ≤1–2 nach Wortlänge), Deklinations-Endungen (-en/-em/-er …);
   89 Fragen ohne Begriffe nachrüsten, 15 Bestandsfragen kalibrieren (max. 4 Pflicht, Ziel 2–3).
   Messlatte: Falsch-Positive 0 halten, realistische Azubi-Antworten weiter ≥4/6.
2. E4 Drag&Drop: HTML5-Drag (Desktop) + Klick-Fallback (Touch), Links/Rechts-Layout, Reset (R1.3),
   Aufgabentext erklärt beide Wege. Render-Smoke je Typ, Handy-Test durch Nutzer.
3. Taschenrechner: einblendbares Panel bei rechen-/kalkulations-Typen (offline, eigenes JS, kein CDN).
4. Schwierigkeitsgrad-Vorschau: Ansicht „wie unterscheiden sich Stufen je Aufgabentyp" (Beispiele je Stufe).
5. MC/mehrfach mit mehreren richtigen Antworten + Antwort-Rotation auch bei Stufe 1/2 (Pool-Analyse,
   fehlende Varianten als Content-Task an Haiku; VORAB Nutzer-Rückfrage zum Umfang).
6. Flexiblere Validierung: Alternativantworten dort zulassen, wo mehrere Lösungen fachlich passen
   (z. B. Wertschöpfungskette/Kernprozesse) — Befundliste erstellen, Nutzer entscheidet je Fall.
VERIFIKATION R2: test_freitext-Sollwert neu, Kalibrier-Messwerte in BUILD_LOG, alle Suiten,
Drag-Smoke Desktop+Touch-Simulation, Offline 0. Version-Bump minor.

### FB-R2c — SIMULATION FÜR UNGEBUNDENE FORMATE ÖFFNEN (Task 9, Nutzer-Entscheid 2026-07-21)

Der lange offene GRUNDSATZ-NEBENBEFUND ist damit ENTSCHIEDEN und aus der OFFEN-Liste zu streichen.
AUSGANGSLAGE: Die echte AP1 besteht laut zwei unabhängigen Quellen ausschließlich aus ungebundenen
Aufgaben. `autoBewertbar()` (app_sim.js:24) lässt aber nur mc/lueckentext/zuordnung/dropdown/
mehrfach zu. Die Vorbedingung „erst die Freitext-Bewertung tauglich machen" ist mit **R2a erfüllt**
(alle 109 Fragen mit Schlüsselbegriffen, Bewertungsfehler behoben, 0 Falsch-Positive).

**NUTZER-ENTSCHEID: MISCHFORM.** Ungebundene Aufgaben zulassen UND mit auto-bewertbaren mischen.
Begründung: prüfungsnähere Aufgaben, aber eine Punktzahl, die belastbar bleibt.

UMSETZUNG (Entwurf — vor dem Bau mit dem Nutzer schärfen):
  * `autoBewertbar()` NICHT einfach erweitern, sondern trennen in „automatisch bewertbar" und
    „per Selbsteinschätzung bewertbar". freitext/erklaeren kommen in die zweite Gruppe.
  * Freitext in der Sim: `gradeTeilpunkte` liefert die VORBEWERTUNG (getroffene Pflichtbegriffe,
    Prozent), der Nutzer bestätigt oder korrigiert per Selbsteinschätzung. Der Baustein dafür
    existiert bereits — `teilp`/Selbstcheck in app_loeser.js:622 ff.
  * ⚠️ **Der Renderer-Unterschied ist die Hauptfalle:** `renderFrage` (app_frage.js) kennt nur
    5 Typen, `loeseFrage` (app_loeser.js) alle 21. Die Sim nutzt renderFrage. Bewertbar ≠
    darstellbar — vor jeder Format-Öffnung prüfen, ob die Sim den Typ überhaupt zeichnen kann.
  * ⚠️ **Punkteverteilung**: `L.wuerfelPunkte` und `sim.punkte` frieren die Verteilung beim Start
    ein (G3.6b). Ungebundene Aufgaben mit Teilpunkten müssen da hineinpassen, sonst laufen
    Vorschau, Kopfzeile und Auswertung auseinander.
  * ⚠️ **INVARIANTE bleibt**: M09 wird über `passtAP()` weiterhin aus der AP1-Sim ausgeschlossen.
  * Mischungsverhältnis ist eine NUTZER-RÜCKFRAGE (z. B. 2 von 4 Aufgaben ungebunden?).
  * TESTS: test_note (Punktesumme mit gemischten Typen), test_sim/render_smoke je neuem Typ,
    Gegenprobe zu jedem Test. Version-Bump minor.

### FB-R2b — DETAILPLAN (angelegt 2026-07-21, Bestandsabgleich bereits erledigt)

Der Plan entsteht VOR dem Bauen, wie es die Arbeitsregel für Gruppenbeginn verlangt. Der
Bestandsabgleich ist gemacht — die Ergebnisse stehen hier, damit die nächste Sitzung nicht erneut sucht.

**Punkt 4 (Links/Rechts-Layout der Zuordnung) ist am 21.07. bereits ERLEDIGT.** Bleiben drei.
**✅ R2b.1 (Taschenrechner) ist am 21.07. ebenfalls ERLEDIGT** – Details im BUILD_LOG-Eintrag ganz
oben. Bleiben ZWEI: R2b.2 Stufen-Vorschau, R2b.3 die ~16 Mehrfach-Fragen.
**REIHENFOLGE-ENTSCHEID 2026-07-21: Rechner → Vorschau → Fragen.**

#### R2b.1 Wissenschaftlicher Taschenrechner + Notizfeld — ✅ ERLEDIGT 2026-07-21
ABWEICHUNGEN VOM PLAN, alle bewusst und im BUILD_LOG begruendet:
  * **Zahlensysteme dez/bin/hex: NUTZER-ENTSCHEID NEIN** (die offene Rueckfrage ist damit weg).
    Der Rechner bleibt rein wissenschaftlich; fuer Subnetting bleibt der Generator zustaendig.
  * Ausgeblendet nicht nur in der Simulation, sondern AUCH in der M09-Klausur (`opts.klausur`).
  * Das Anzeigefeld traegt NICHT die Klasse `luecke` – die gehoert den Antwortfeldern und
    test_diagnose zaehlt darueber. Nicht zurueckdrehen, der Waechter in test_rechner faengt es.
Der urspruengliche Plantext steht unten weiter, weil die Umsetzungs-Hinweise fuer spaetere
Aenderungen am Rechner gueltig bleiben:

#### R2b.1 (Plantext, Nutzer-Entscheide 2026-07-21)
BESTAND: existiert nirgends im Code (`grep` nach rechner/calc/eval ohne Treffer) — echter Neubau.
NUTZER-ENTSCHEIDE:
  * **NUR bei den Rechen-Typen** einblendbar, nicht global und nicht in der Simulation.
    Die drei Einstiegspunkte stehen fest: `R_TYP.generator` (app_loeser.js:22),
    `R_TYP.rechenassistent` (:420), `R_TYP.kalkulation` (:564).
  * **Wissenschaftlicher Rechner**, nicht nur Grundrechenarten: zusätzlich Wurzel, Potenz,
    Klammern, Prozent, Vorzeichen, Speicher. (Zahlensystem-Umrechnung war nicht verlangt —
    vor dem Bau kurz rückfragen, ob dezimal/binär/hex mit hineinsoll, weil Subnetting davon lebt.)
  * **Notizfeld DIREKT DARUNTER** im selben Panel, für Nebenrechnungen von Hand.
UMSETZUNGS-HINWEISE (aus den Erfahrungen dieser Sitzungen):
  * ⚠️ **KEIN `eval()`** — eigener Parser oder strikte Tokenisierung. `eval` auf Nutzereingaben
    ist auch offline eine unnötige Angriffsfläche und würde bei der Code-Durchsicht auffallen.
  * ⚠️ **Offline-Invariante**: eigenes JS, KEIN CDN. `verify.sh offline` muss 0 externe URLs melden.
  * ⚠️ **Mobile-Audit**: alle Rechnertasten in den `@media (pointer:coarse)`-44px-Block aufnehmen
    (styles.css ~Z. 379). Ein Ziffernblock mit 30-px-Tasten ist am Handy unbrauchbar.
  * WIEDERVERWENDEN statt neu bauen: `statPanel(key, titel, standardOffen)` aus app_util.js gibt
    ein aufklappbares Panel samt gemerktem Zustand — der Rechner sollte ZUGEKLAPPT starten.
  * Das Notizfeld braucht KEINE Persistenz (Fortschritts-Export ist endgültig gestrichen);
    Inhalt darf beim Fragenwechsel verfallen. Falls doch gemerkt: NICHT in `S` ablegen, ohne
    STATE_VERSION zu prüfen.
  * TESTS: Rechenkette mit Klammern und Vorrang, Division durch null, Komma-Eingabe (die App
    normalisiert Komma zu Punkt), Tastengrößen im coarse-Block, Panel startet zu.
    GEGENPROBE nicht vergessen — in dieser Sitzungsreihe wären sonst drei Tests still grün geblieben.

#### R2b.2 Schwierigkeitsgrad-Vorschau — ✅ ERLEDIGT 2026-07-21
Nutzer-Entscheide beim Bauen: **volle Matrix** Aufgabenart × Stufe (19 × 4) · Beispiel
**aufklappbar mit vollständiger Frage** · **nicht mitdrucken** (der beforeprint-Hook hätte sonst
51 Fragen aufs Papier gebracht). NEU nebenbei entstanden: `TYP_NAMEN`/`typName()` — damit ist die
Namens-Lücke geschlossen, an der G3.5 seinerzeit gescheitert ist. Details im BUILD_LOG.
**MESSERGEBNIS für R2b.3: 25 von 76 Feldern sind leer, fast alle auf Stufe 1 und 4.**
Plantext unten bleibt als Referenz stehen:

#### R2b.2 (Plantext, Nutzer-Entscheid: als Panel auf der STATISTIK-Seite)
BESTAND: existiert nicht als Ansicht. WIEDERVERWENDEN: `LEVEL_NAMEN` (app_util.js:508),
`bananen(stufe)` (app_util.js:438), `stufeFuer(f)` (app_seiten.js:277 — die adaptive Stufe je Thema).
  * Als fünftes `statPanel` auf der Statistik-Seite (app_pages2.js, dort stehen schon vier).
    Es startet damit automatisch zugeklappt und merkt sich den Zustand — R1.6-Verhalten.
  * Inhalt: je Aufgabentyp ein Beispiel pro Stufe, gezogen AUS DEM POOL statt handgeschrieben,
    damit die Vorschau nicht veraltet. `POOL.filter(f => f.typ === t && f.schwierigkeit === n)[0]`.
  * Chance nebenbei: die Seite zeigt dann auch, welche Typ/Stufe-Kombinationen im Pool FEHLEN.

#### R2b.3 ~16 neue Mehrfach-Fragen — ✅ ERLEDIGT 2026-07-21, ABER NICHT WIE GEPLANT
Der vorgesehene Haiku-Weg ist GESCHEITERT: Der Agent lieferte validate_batch grün und meldete
„Unsicherheiten: keine", hatte aber acht Sachfehler eingebaut — vier davon am Gesetzestext
widerlegt (§ 22 BBiG, § 1 BetrVG, § 3 TVG, § 5 BBiG). Nutzer-Entscheid: alle 16 Fragen von Opus
selbst geschrieben. **Für Rechts- und Normthemen ist der Haiku-Batch-Weg nicht geeignet** —
Struktur prüft die Selbstvalidierung, Wahrheit nicht. Regeln 11–13 stehen jetzt in
prompts/fragen_batch.md, ein Wächter für die mehrfach-Grenzen in tools/validate_batch.js.
Plantext unten bleibt als Referenz stehen:

#### R2b.3 (Plantext, Nutzer-Entscheid)
BESTAND gemessen: 52 mehrfach-Fragen, Stufe 1: 5 · 2: 14 · 3: 29 · 4: 4 — die unteren Stufen sind
dünn, genau dort füllen. Weg: Haiku-Batch nach `prompts/fragen_batch.md`, der Agent muss
`tools/validate_batch.js` selbst grün liefern, Opus prüft danach JEDE Frage fachlich.
⚠️ Nur `pool/*.json` ändern, danach `python3 build_fragen.py`. `fragen.js` NIE direkt editieren.

VERIFIKATION R2b: alle Suiten, Render-Smoke je berührtem Typ, Offline-Audit, Mobile-Audit
(pointer:coarse/44px), Gegenprobe zu jedem neuen Test. Version-Bump minor am Rundenende.

### FB-R3 — Inhalt & Navigation (Haiku Content-Batches, Sonnet UI; Opus prüft fachlich JEDE Frage)
> ✅ **ABGESCHLOSSEN 2026-07-26 mit Release v1.8.0. Alle Punkte 1–12 sind erledigt.** Dieser Abschnitt
> ist ab jetzt HISTORIE und muss für neue Tasks nicht mehr gelesen werden – die Punkte 8, 9 und 10
> stehen unten einzeln als erledigt markiert. **Punkt 9 Teil 2 („Lücken") ist gegenstandslos:** die
> Rückfrage beruhte auf der falschen Annahme, es gebe Lernfeld-Tags bzw. leere Gebiete – beides
> stimmt nicht (Single Source: `L.THEMA_GEBIET` in logik.js). NICHT wieder aufwärmen.
1. E2 Firmennamen: Mapping-Tabelle (Modul/Kontext → Firmenname) VORAB mit Nutzer abstimmen;
   Ersetzung skriptgestützt auf pool/*.json (python3, direkt am Mount erlaubt), build_fragen,
   Duplikat-/Konsistenz-Scan, Stichproben-Lesung. „Rhaus" darf danach 0 Treffer haben (Guard in check.sh).
2. ✅ **ERLEDIGT 2026-07-22 – Gantt-Stufen angehoben.** 6 neue Fragen M01-482…487, je 3 auf
   Stufe 1 und 2, jede mit eigenem Balkendiagramm. M01 „Gantt & PSP" jetzt 12 Fragen
   (Stufe 1: 1 → 4, Stufe 2: 2 → 5, Stufe 3: 3). Pool **977 → 983**.
   Vier Antwortmechaniken (Nutzer-Entscheid): bild/mc, bild/dropdown, bild/lueckentext, hotspot.
   ⚠️ **UMFANG NACHGESCHÄRFT (Nutzer nach der Sichtprüfung der 1. Fassung):** die erste Fassung
   mit 6 Kalenderwochen und 3–4 Vorgängen war zu dünn. **Verbindlich sind jetzt mindestens
   20 Arbeitstage und 8–10 Vorgänge je Plan** – auch für die beiden reparierten Bestandsbilder.
   Raster: 30 px je Arbeitstag, Wochenbänder und Tagesnummern über der Achse, Vorgangsnamen in
   einer linken Spalte. Ist-Stand: alle acht Pläne 20 Tage, 8 bis 9 Vorgänge.
   ⚠️ **REGEL: kein Balken trägt seinen Zeitraum als Text.** Die Achse ist die einzige Quelle –
   sonst löst man die Aufgabe aus dem Label statt aus dem Bild (der M01-481-Fehler).
   Inhaltlich Diagramm LESEN statt Vokabeln: Endtermin an der Balkenkante, Parallelität senkrecht
   ablesen (mit einem Vorgang, der im Zeitraum liegt, aber nicht durchgehend), Lücke vs.
   Gesamtdauer (Distraktor = Summe der Balkenlängen), **Widerspruch zwischen Balkenplan und
   Begleittext**, Verzug ohne Puffer durchreichen, Puffer und kritischer Weg bei zwei
   mehrstufigen Parallelzweigen.
   ⚠️ **BESTANDSBEFUND, größer als der Plan: zwei der drei Stufe-3-Fragen waren selbst defekt.**
   M01-481 hatte eine NICHT-LINEARE Achse (15/12/16/14 px je Tag); der Entwicklungs-Balken lag
   geometrisch bei Tag 9–19, beschriftet war er mit „Tag 6-15" – die Lösung war nur aus dem
   Textlabel ablesbar, nicht aus dem Bild. M01-113 nannte „Meilenstein am Tag 7", die Markierung
   saß bei Tag 5,5 und war ein DREIECK, obwohl M01-960/M09-053 die RAUTE lehren.
   Beide auf Nutzer-Entscheid neu gezeichnet und mit aufgestockt; Lösungen inhaltlich unverändert.
   ⚠️ Erzeugt mit **`tools/r3_2_gantt.py`** (idempotent, bricht bei zu breitem Vorgangsnamen ab) –
   Achse und Balken kommen aus DERSELBEN Rasterfunktion und können nicht auseinanderlaufen.
   NEUE SUITE **`tests/test_gantt.js` (73)** → 38 Suiten; sie rechnet die Lösungen aus dem BILD
   nach und bewacht den Mindestumfang. 13 Gegenproben, alle bissen.
   ⚠️ **LEHRE:** Die Geometrieprüfung fand die Achsen-Inkonsistenz meiner EIGENEN ersten Fassung
   NICHT (mittige vs. kantenbündige Tagesbeschriftung) – beide Varianten sind für sich linear.
   Auch der zu geringe Umfang fiel nur am gerenderten Abzug auf. Zahlen- und Sichtprüfung
   ersetzen einander nicht.
3. ✅ **ERLEDIGT 2026-07-22 – Netzplan vereinheitlicht.** Befund: nicht zwei Zeichenstile, sondern
   **zwei Knotenschemata**. Der Pool lehrt FAZ·Dauer·FEZ / SAZ·GP·SEZ (M01-970 fragt das als
   Hotspot ab), die Menüseite verlangte FAZ·FEZ / SAZ·SEZ / GP·FP. `sNetzplan` folgt jetzt dem
   Pool-Schema, die Dauer ist vorgegeben, **FP entfällt** (Nutzer-Entscheid) → 30 statt 36 Felder.
   Mitgezogen: TEXTE (netzplanAlle30, netzplanReihenfolge, netzplanHint), CSS (.np-grid 3 Spalten,
   neue .np-dauer), aria-labels an den Eingaben.
   ⚠️ NEBENBEFUND BEHOBEN: `--g300` fehlte im Dark-Theme (R1.1-Fehlerklasse).
4. ✅ **ERLEDIGT 2026-07-22 – Liniensysteme überarbeitet.** 18 Fragen geprüft, 7 geändert.
   Kernbefund: **Pool-Selbstwiderspruch** – M07-311/312 nannten ein Matrix-Beispiel „Mehrlinie",
   während M09-021/024 und M07-709 es richtig erklärten. Behoben, dazu Matrix in die Zuordnung
   aufgenommen (5 Paare), M09-024 komplett neu entworfen, M09-027-Begründung präzisiert
   (§ 52 GmbHG / DrittelbG), Tippfehler in M07-109.
   Beide Organigramm-SVGs waren defekt (fehlende Weisungslinie + Linien ins Leere bei M07-009;
   überlappende Boxen + 6 Linien ohne Ziel bei M07-117) und wurden neu gezeichnet.
   ⚠️ **cairosvg war NICHT installierbar** (pip 403). Statt der geplanten Sichtprüfung wurde eine
   GEOMETRIEPRÜFUNG gebaut und als Dauersuite verankert – sie fängt genau die zwei aufgetretenen
   Fehlerklassen. Sichtprüfung durch den Nutzer erfolgte über gerenderte Diagramme im Chat.
   NEUE SUITE tests/test_liniensysteme.js (**29**), 3 Gegenproben + Selbsttest der Prüffunktion.
5. ✅ **ERLEDIGT 2026-07-22 – Matrix-Inhalte überarbeitet.** Alle **25 matrix-Fragen**,
   106 Elementtexte, 25 Fragetexte und 50 Erklärungen neu geschrieben (`tools/r3_5_matrix.py`,
   selbst geschrieben, kein Agenten-Batch).
   ⚠️ **DER BEFUND WAR EIN ANDERER ALS DER PLANTEXT.** Nicht die Beispielwerte waren das
   Hauptproblem, sondern: **40 % der Elemente nannten die EINSTUFUNG wörtlich** („sehr
   unwahrscheinlich, aber existenzbedrohend" bei den Achsen Eintrittswahrscheinlichkeit und
   Schadenshöhe). Die Aufgaben prüften einen Vokabelabgleich statt einer Beurteilung – dieselbe
   Fehlerklasse wie das Balkenlabel in M01-481 bei Punkt 2, nur in Textform. Sieben Fragen waren
   vollständig selbstverratend.
   LEITREGEL JETZT: Ein Element nennt SACHVERHALTE (Häufigkeit als Zahl, Schaden als Betrag,
   Frist als Datum), aus denen die Einstufung ABGELEITET wird.
   MESSWERTE: Bewertungsvokabular **42 → 0** · Fragen mit Ziffern **4 → 24** · kosmetische
   Design-Kleinigkeit als Motiv **5 → 0** Fragen · Serverraum-Motiv **5 → 3**.
   Die Quadranten-Zuordnung (= die fachliche Lösung) ist unverändert und wurde vorab abgeglichen.
   ⚠️ **ABGRENZUNG, ohne die der Wächter falsch wäre:** verboten ist BEWERTUNGSvokabular,
   erlaubt bleibt SACHvokabular – eine Marktform braucht „ein einziger Anbieter", das
   Johari-Fenster braucht „mir bekannt".
   ⚠️ **EIGENER FEHLER, teuer:** Ich schrieb alle 106 Texte in ASCII-Umschrift, während 957 der
   983 Pool-Fragen echte Umlaute tragen. Die Rückumstellung ist die v1.4.0-Falle in Reinform;
   ein Regex-Ansatz verrutschte beim Quote-Pairing und benannte eine CODE-Variable um. Gelöst
   über Pythons `tokenize` (nur STRING-Token) plus Ausnahmeliste (Pool-Feldnamen, die elf
   etablierten Beispielfirmen, „ue" aus „eu"/„au"), gegengeprüft über einen Token-Vergleich:
   2.122 Code-Token vorher wie nachher, keine Abweichung außerhalb von Strings.
   NEUE SUITE **`tests/test_matrix.js` (31)** → **39 Suiten**. 14 Gegenproben, alle bissen –
   **zwei davon deckten echte Lücken im Test auf** (Artikel „ein/eine" machten den
   Zahlen-Wächter wirkungslos; die Rechtsbezug-Prüfung über JSON.stringify war zahnlos).
   Rechtsbezüge von Hand geprüft: § 87 Abs. 1 Nr. 6 BetrVG, Art. 32 DSGVO, Art. 33 DSGVO.
   ⚠️ **OFFEN bleibt für Punkt 6** (unverändert): der AP1/AP2-Clear-Cut, AP2-Themen als
   Platzhalter, das 3-Spalten-Layout und die Kennzeichnung, dass M08 „WiSo" im AP1-Modus leer
   IST. Wer Punkt 6 baut, muss das Wirtschafts-Häkchen aus v1.5.0 sinnvoll einbetten.
6. ✅ **ERLEDIGT 2026-07-23 (KEIN Bump, NICHT gepusht).** Themen-Auswahl neu: AP1/AP2-Clear-Cut,
   AP2-Bereiche als „bald"-Platzhalter mit Katalog-Fragenkomplexen, Umschalter AP1/AP2/Beide
   (Default beide) + manuelles Mischen, 3-Spalten-Layout (Desktop) / 1 Spalte (Handy).
   Wirtschafts-Schwerpunkt als Chip in die AP1-Spalte eingebettet; WiSo (M08) sichtbar in die
   AP2-Spalte gerückt (Label „WiSo" + „Wirtschafts- und Sozialkunde (AP2)" + Fragenzahl).
   Reichweite bewusst NUR die Üben-Auswahl über den neuen Üben-lokalen Filter S.uebenAP/uebenPasst;
   passtAP/S.inklAP2 (Startseite, Statistik, Simulation) unverändert. AP2-Struktur aus dem
   gescannten Prüfungskatalog per Seiten-Rendering verifiziert (3 AP2-Prüfungsbereiche; der dritte
   = WiSo existiert schon). NEUE SUITE tests/test_themenauswahl.js (60), 5 Gegenproben, 40 Suiten.
   NACHTRAG (Nutzerbefund „AP2 hat keine Themeninhalte mehr"): die 22 AP2-Fragen aus M04 (Subnetting 12,
   Datenbanken 10) sind jetzt als thema-genaue Kacheln in der AP2-Spalte sichtbar (S.ap2Themen +
   AP2_FACHTHEMEN + themaGewaehlt = Union modulweit/thema-genau).
   Zukunft: AP2_PLATZHALTER (app_pool.js) so angelegt, dass AP2-Fragen später nur eingefüllt werden;
   ggf. Subnetting/Datenbanken ein eigenes AP2-Modul geben, damit der Clear-Cut auch pool-seitig sauber ist.
   Details im BUILD_LOG-Eintrag vom 2026-07-23.
7. ✅ ERLEDIGT (2026-07-23, KEIN Bump): Onboarding-Tour um Schritt „Werkzeuge & Handy-App" (6→7)
   erweitert (Fokus-Modus, Selbstabfrage, Handy-App/offline). Nutzer-Entscheide: Abruf-Übung wird
   VOREINSTELLUNG (S.abrufAn persistiert, Default true), Umschalter nur noch leise in den
   Einstellungen; EIN neuer Tour-Schritt. M09-Klausur war via opts.klausur⇒opts.simulation schon
   ausgenommen. NEUE SUITE test_onboarding (26); test_abruf 18→21; test_hilfe 6→7. Details BUILD_LOG.
8. „Ähnliche Fragen": ✅ ERLEDIGT 2026-07-25. Nutzer-Entscheid „ähnlich = gleiches Feinthema".
   ⚠️ Der Bestandsabgleich ergab: **Das Feature existiert seit #60 vollständig** –
   `zeigeThemenSerieAngebot()` in app_seiten.js, Knopf bei falscher Antwort, Serie aus bis zu
   L.CONFIG.serie = 5 Fragen desselben Themas, Vorrang in `naechsteFrage()`, getestet in
   test_engine E4/E5. Gehärtet wurde nur der Filter (thema UND modul statt nur thema); Verhalten
   unverändert, weil 0 von 73 Themennamen in zwei Modulen vorkommen. Pool-Wächter dafür in
   test_themenauswahl (80 → 81).
9. Sortierung/Auswahl-Listen: nach Typ/Instanz/Firma sortieren statt verschachtelter Baumstruktur
   ohne klare Reihenfolge und mit Lücken. VORAB Rückfrage an Nutzer, WELCHE Ansicht gemeint ist
   (Themen-Auswahl? Fragen-Filter? Statistik?) + gewünschte Sortier-Kriterien konkretisieren.
   ⚠️ STAND 2026-07-22: Rückfrage gestellt, **der Nutzer weiß es selbst nicht mehr sicher.**
   → Vor der Umsetzung Screenshots/Render-Abzüge der drei Kandidaten (Themen-Auswahl, Statistik,
   Spickzettel/Glossar) erzeugen und den Nutzer daraufzeigen lassen. Nicht vorher bauen.
   ✅ STAND 2026-07-25: **Render-Abzüge sind erzeugt** – `punkt9_kandidaten.html` (gitignored) zeigt
   VIER Kandidaten nebeneinander: A Themen-Auswahl (Üben), B Statistik, C1 Spickzettel, C2 Glossar
   inkl. Abkürzungs-Tab. Echte jsdom-Abzüge mit Beispiel-Lernstand (186 beantwortete Fragen),
   erzeugt mit `/tmp/w/render_p9.js` (ephemer: bootet den Harness, setzt `w.seite` und liest
   `#main.innerHTML`).
   ✅ **NUTZER-ENTSCHEID 2026-07-25: „Beispiel A war gemeint"** → gemeint ist die
   **Themen-Auswahl im Üben-Bereich** (`sUeben`, Gebiets-Blöcke mit aufklappbaren Feinthemen).
   ✅ **TEIL 1 ERLEDIGT 2026-07-25:** Sortier-Kriterium (Nutzer) = **nach Modul, darin
   alphabetisch**. `gebietThemen()` in app_seiten.js sortiert entsprechend (localeCompare „de",
   weil drei Paare sich sonst wegen Groß-/Kleinschreibung falsch einordnen). Reine Anzeige-Ordnung,
   Auswahl-Logik unberührt. test_themenauswahl 75 → 80, 3 Gegenproben.
   ⚠️ **TEIL 2 („Lücken sichtbar machen") OFFEN – Rückfrage hatte eine falsche Prämisse:** Der Pool
   trägt keine Lernfeld-Tags (die LF-Tabelle ist eine Handzuordnung in
   SORTIERUNG_PRUEFUNGSORDNUNG.md), die Auswahl ist gebiets-basiert, und kein Gebiet ist leer.
   Dem Nutzer korrigiert vorgelegt, nicht gebaut.
10. Erklärungen inhaltlich überarbeiten (Feedback: schwer verständlich): ausführliche Erklärungen
   besser strukturieren (Gliederung statt Fließtext), Abkürzungen EINZELN und freistehend erklären
   (Abgleich mit abkuerzungen.js, fehlende ergänzen), Formulierungen auf leichte Verständlichkeit.
   Haiku-Batches je Modul auf /tmp, Opus prüft jede Änderung fachlich; keine Bedeutungsänderung.
   FORMAT (Nutzer bestätigt): **Kernsatz + Stichpunkte („• " über `\n`) + „Merke:"-Zeile**; Rollout
   modulweise; Felder = `erklaerungLang` + Abkürzungen. Kein Code-Eingriff nötig (app_frage.js macht
   `\n`→`<br>`). STAND 2026-07-25: **M01 (86) + M02 (79) + M03 (142) + M04 (164) + M05 (59) +
   M06 (82) + M07 (97) + M08 (54) = **763/763 – PUNKT 10 INHALTLICH FERTIG**. abkuerzungen.js
   70 → 76 (M01–M03) → 89 (M04) → 94 (M05) → 101 (M06) → 102 (M07) → **112** (M08).
   ✅ Die fünf Sachbefunde sind auf Nutzer-Entscheid vom 25.07. KORRIGIERT (M08-611, M08-105,
   M07-201, M05-401 inkl. Antwortoption, M04-735). OFFEN: Sichtprüfung der Render-Abzüge durch den
   Nutzer, danach Release-Gespräch. NEU OFFEN: „BBiG § 20 Abs. 3" in M08-105/M08-601 (§ 20 hat nur
   zwei Absätze).
   ⚠️ Vor dem Umschreiben prüfen, welche Suite den Text bewacht: `grep -l erklaerungLang tests/*.js`.
   ⚠️ Der Lexikon-Abgleich gehört ab M05 an jedes Modulende, nicht sammeln.
   ⚠️ Textmuster „Warum die anderen nicht stimmen: … (Option N)" (M05 4×, kommt in M07 4× und M08 4×
   wieder): je Falschaussage EIN Stichpunkt „• Warum Option N nicht stimmt: …", kein zweiter Absatz.
   ✅ SAMMELLISTE inhaltlicher Befunde – am 25.07. gebündelt entschieden und ALLE KORRIGIERT:
   1. **M04-735** nennt „CI/CD-Vorgabe", meint aber CI = Corporate Identity (zwei Zeilen später
      ausgeschrieben).
   2. **Do-Phase, Pool widerspricht sich 1:4** – M05-401 („im realen Betrieb, nicht Pilot!", so auch
      seine Antwortoption) gegen M05-440/701/960/961 („im kleinen Rahmen / Pilot"). Betrifft nicht
      nur eine Erklärung, sondern auch eine Antwortoption.
   3. **§ 377: falsches Gesetzbuch UND falscher Anwendungsbereich** – M07-201 zitiert „§ 377 BGB"
      (richtig: HGB) und wendet die Rügepflicht auf einen Werkvertrags-Abnahmefall an; M07-202 sagt
      zwei Fragen weiter, dass § 377 HGB beim Werkvertrag gerade NICHT gilt.
   4. **M08-105: § 22 Abs. 2 BBiG „zum 15. oder Monatsende"** – das ist die § 622-BGB-Regel für
      Arbeitsverhältnisse; M08-003/201/602 sagen es richtig.
   5. **M08-611: fehlende Verneinung** – „Lückenhafte Berichte können zur Prüfungszulassung führen"
      (gemeint: zur Versagung). Gefährlichster Befund, weil der Satz das Gegenteil lehrt.
11. **`UNTERRICHT_MODUL` voll umbenennen** (Nutzer-Entscheid 2026-07-21, aus FB-R1 vertagt).
   ⚠️ REIHENFOLGE-ENTSCHEID 2026-07-21: **R3 beginnt mit den Punkten 1 und 11** – den beiden
   pool-weiten Umbenennungen (Firmennamen, UNTERRICHT_MODUL). Begruendung des Nutzers: beide
   fassen JEDE Frage an; sie zuerst abzuraeumen, solange kein anderer Task im Pool arbeitet,
   vermeidet Konflikte und danach ist an dieser Front Ruhe. Erst danach die inhaltlichen Punkte.
   Der Modulname „Unser Unterricht" ist der Tag an jeder M09-Frage und die Kategorie im
   Begriffslexikon; die Oberfläche heißt seit R1.9 „Vorbereitung nächste Klausur". Der Nutzer will
   den Namen ÜBERALL nachziehen — bewusst als Pool-Task hierher vertagt, weil er nicht nur eine
   Code-Zeile ist. GEMESSENER UMFANG (2026-07-21):
   - `app_pool.js:29` `UNTERRICHT_MODUL = ["M09", "Unser Unterricht"]` → neuer Anzeigename
   - **105 `verweis`-Felder** in `pool/pool_m09_unterricht.json`, Format „Unser Unterricht – <Thema>"
   - Kommentar-/Doku-Erwähnungen in app_glossar.js, app_pages2.js, app_seiten.js, app_util.js,
     logik.js, spickzettel_m09.js (nur Text, keine Logik) sowie die Überschrift in
     `SPICKZETTEL_M09`
   Ablauf zwingend: pool/*.json ändern → `python3 build_fragen.py` → validate_pool/idcheck →
   Suiten (test_unterricht wacht über die AP1/M09-Trennung). fragen.js NIE direkt editieren.
   Anzeigename vor der Umsetzung mit dem Nutzer abstimmen („Vorbereitung nächste Klausur" ist der
   Oberflächen-Text, als HERKUNFTS-Tag an einer Frage klingt er womöglich schief).
12. ✅ **ERLEDIGT 2026-07-22 – Anti-Pattern-Guard und die übrigen grep-Wächter nachgeschärft.**
   Umgesetzt über `tools/entkommentiere.js` (längentreuer Kommentar-Stripper für JS/CSS/HTML mit
   selbstgeprüfter Invariante). Umgestellt wurden **vier** Wächter, nicht nur einer: Offline-Audit
   (Abschnitt 3), UTF-8, Anti-Pattern (4c) und Rhaus (4d) – der Offline-Audit hatte dasselbe
   Muster und wäre bei jeder URL in einem Kommentar rot geworden.
   Fail-safe statt fail-open: schlägt das Strippen fehl, wird gemeldet UND auf der Rohdatei
   weitergeprüft. Alle Wächter laufen jetzt AUCH in `check.sh schnell` (Nutzer-Entscheid; +2,4 s).
   Acht Gegenproben bestanden, neue Dauersuite `tests/test_entkommentiere.js` (**46**) mit eigener
   zweifacher Gegenprobe. Nebenbefund mitbehoben: alle `npm install`-Aufrufe haben jetzt einen
   `timeout`-Deckel – der Proxy hängt seit dem 22.07. unbegrenzt, statt 403 zu liefern, und
   blockierte damit den vollen check.sh. Details im BUILD_LOG ganz oben.
VERIFIKATION R3: fachliche Einzelprüfung jeder neuen/geänderten Frage, validate_pool/idcheck,
alle Suiten, Render-Smoke der neuen UI, Mobile-Audit 3-Spalten→1-Spalte. Version-Bump minor.
⚠️ **VOR JEDEM RELEASE den VOLLEN `check.sh` mindestens einmal fahren**, notfalls in Abschnitten.
`check.sh schnell` lässt den Anti-Pattern-Guard und die jsdom-Suiten aus – deshalb fiel der
Fehlalarm erst in der CI auf.

OFFEN NACH R3: TASKLIST-Punkt 4 (Aufräumen), Handy-Gesamttest, ggf. Push-Freigabe.

## 🚩 GESAMTPLAN „W1 – WERKZEUGE, WÄCHTER, AUFRÄUMEN" (aufgestellt 2026-09-10)

> **Grundlage:** `docs/befunde/BEFUNDE_WERKZEUGE.md` (10.09.2026). ⚠️ **Die Grundlage ist GELESEN, nicht
> GEMESSEN** — an dem Tag mountete die Linux-Shell den Projektordner nicht. **Etappe A holt die
> Messung nach; ohne sie wird an der Laufzeit NICHTS umgebaut.**
> ⛔ **Reihenfolge ist nicht Geschmack:** die risikoarmen Etappen liegen vorn, damit ein Abbruch
> in der Mitte einen sauberen Baum hinterlässt. Der Wächter-Umbau steht bewusst am Ende.

### ✅ ETAPPE A — ERLEDIGT 2026-09-10, GEMESSEN AUF DEM WINDOWS-RECHNER

> **ERGEBNIS: `check.sh` 173 s · A3 (reiner Ladevorgang `fragen.js`) 0,180 s · A2 (sieben
> `pool_query`-Aufrufe) 1,746 s zusammen = 1,0 % des Laufs.**
> ⛔ **Damit ist F1 GESTRICHEN** — nach der Bedingung, die dieser Plan selbst formuliert hat.
> ⚠️ **Nebenbefund, der den Lauf aufgehalten hat:** der erste `check.sh` auf Windows meldete zwei
> Drift-Fehler. **Fehlalarm** — `build_fragen.py` schrieb dort CRLF. Behoben, Beleg: `BUILD_LOG.md`
> 10.09. (2). **Die Messung hat einen Fehler gefunden, den sie gar nicht gesucht hat.**

| Schritt | Befehl | wofür |
|---|---|---|
| A1 | `bash tools/prueflauf.sh` | Basislinie: wie lange dauert der volle Lauf HEUTE |
| A2 | `for k in firmen zitate zufall begriffe abdeckung verrat svg; do echo -n "$k "; { time node tools/pool_query.js $k >/dev/null; } 2>&1 \| grep real; done` | Ladeanteil je Aufruf |
| A3 | `time node -e 'require("./fragen.js")'` | was ein reiner Ladevorgang kostet |

**Die Entscheidung fällt an A3:** liegt der reine Ladevorgang unter ~0,2 s, sind die sieben
Aufrufe zusammen unter 1,5 s — **dann lohnt der Umbau aus Etappe F NICHT** und wird gestrichen.
⚠️ **Das Ergebnis wird notiert, auch wenn es gegen den Plan spricht.** Genau dafür ist A da.

### ✅ ETAPPE B — ERLEDIGT 2026-09-10 (mit einer Korrektur an der eigenen Vorlage)

> **B1/B2:** `verify.sh` und `push.sh` nach `_to_delete/`. Sieben aktive Dokumente nachgezogen:
> START_PROMPT, DEPLOY, TASKLIST, UNTERRICHT_PROJEKT, README, PROMPT_IDEEN-PAKET, T2_RESTLISTE.
> ⛔ **Die `*_ARCHIV.md` bleiben unangetastet** — ein Archiv ist Chronik.
> ⛔⛔ **B3 NUR ZEHN VON DREIZEHN.** `validate_batch.js`, `fakten_check.py` und `index.js` stehen
> im **aktiven** Prüfprotokoll (TASKLIST) bzw. erzeugen `FUNCTIONS.md`. **Die Liste in
> `docs/befunde/BEFUNDE_WERKZEUGE.md` §5 war aus Größe und Änderungsdatum gebaut, nicht aus Referenzen** —
> „lange nicht geändert“ heißt nicht „wird nicht gebraucht“. Verschoben sind zehn (~237 KB),
> `tools/archiv/README.md` nennt sie samt Grund.
> **B4:** `check.sh` blieb ALLES GRÜN — keine Zahl hat sich bewegt.
> ⚠️ **Nebenbefund erledigt:** `__pycache__/mig_g26.cpython-310.pyc` aus dem Index genommen.
> ⚠️ **Offen für D:** ob `validate_batch.js` durch `apply_batch.py` abgelöst ist — nicht gemessen.

### ETAPPE B — AUFRÄUMEN (risikoarm, jederzeit abbrechbar)

* **B1 `verify.sh` → `_to_delete/`.** Vorher `grep -rn "verify.sh" . --include='*.sh' --include='*.md' --include='*.yml'`;
  jede Fundstelle in der Doku mitziehen (Verweis auf `tools/suite.sh` bzw. `tools/prueflauf.sh`).
  ⛔ **Begründung im BUILD_LOG festhalten:** es baut sein Testverzeichnis nach eigener Liste und
  liefert deshalb rote Suiten bei gesundem Code — die Lehre vom 28.07. hat es nie erreicht.
* **B2 `push.sh` → `_to_delete/`.** Danach Arbeitsregel 2 in START_PROMPT anpassen: statt
  „`push.sh` NICHT benutzen" heißt es dann „Push nur vom Windows-Rechner; ein `push.sh` gibt es
  bewusst nicht mehr".
* **B3 Einmal-Skripte → `tools/archiv/`** (13 Dateien, ~255 KB; Liste in `docs/befunde/BEFUNDE_WERKZEUGE.md` §5).
  ⚠️ **Vor jedem Verschieben** `grep -rn "<datei>" check.sh verify.sh tests/ tools/ .github/` —
  was gesourct oder aufgerufen wird, bleibt.
* **B4** Nach B1–B3: `bash check.sh` **muss ALLES GRÜN bleiben.** Ändert sich eine Zahl, war eine
  der Dateien doch in Benutzung → zurückholen, nicht anpassen.

### ✅ ETAPPE C — ERLEDIGT 2026-09-10

> **C1** `BUILD_LOG.md` 976 → 51 Zeilen, 924 verbatim ins Archiv · **C2** `PLAENE.md` 2374 → 2054
> Zeilen, 333 verbatim · **beide Gegenproben 0 Verluste** · **C3** erledigt (Abschnitt 3 nennt
> jetzt `*_ARCHIV.md`).
> ⚠️ **Beide Specs waren ÄLTER als ihre Quelldateien** (100 s bzw. 196 s) — die Blockgrenzen wurden
> vor dem Lauf nachgemessen und saßen exakt. **Eine Zeilennummer in einer Spec ist ein Messwert von
> damals**, dieselbe Klasse wie eine Versionsangabe in der Doku.
> ⚠️ **Zwei kosmetische Befunde an `rotiere.py`** (beide von Hand nachgetragen, `BUILD_LOG` 10.09.
> (2)): `ersatz` verliert seine abschließende Leerzeile vor der nächsten Überschrift, und ein
> ersatzlos entfallender Block lässt die Leerzeilen davor UND dahinter stehen.

* **C1 BUILD_LOG:** `python3 tools/rotiere.py tools/rotationen/build_log_v1260.json` (erst
  trocken, Gegenprobe muss **0** melden), dann `--setze`. **Spec liegt bereit.**
* **C2 PLAENE:** `python3 tools/rotiere.py tools/rotationen/plaene_2026-09-10.json` — Q3 (297
  Zeilen) und die erledigte Stufe-3/4-Grundlage (36 Zeilen) ins Archiv. **Spec liegt bereit.**
  ⚠️ **Die Zeilennummern der Spec gelten für die Datei OHNE diesen Plan-Block** — er steht
  bewusst am ENDE. Wer vorher etwas in PLAENE einfügt, misst die Grenzen neu.
* **C3** Danach prüfen: nennt START_PROMPT Abschnitt 3 noch „`PLAENE.md`" als Q3-Nachweis? Dann
  auf `PLAENE_ARCHIV.md` umstellen.

### ✅ ETAPPE D — ERLEDIGT 2026-09-10

> **D1** `BEFUNDE_INDEX.md` erzeugt aus `tools/befunde_index.py` — **145 von 147 B-Nummern**.
> ⛔⛔ **Das im Plan vorgeschlagene Muster `^#+ *B[0-9]+` fand 109 von 198.** Die Nummern stehen
> in **sieben** Formen, darunter Bereiche (`B51–B55, B57–B59`). Drei Fassungen, jede mit
> Gegenprobe; die zweite fand sechs dazu und **verlor fünf**, ohne dass die Gesamtzahl es
> zeigte. ►► **Wer einen Filter verschärft, misst beide Richtungen.** Volltext: `BUILD_LOG`
> 10.09. (5).
> **D2** README trägt jetzt die acht Gebiete, die Wächter-Landschaft, Deployment und „wo steht
> was"; ARCHITECTURE ist an den Zahlen aufgefrischt (9→11 Module, 18→45 Suiten, 749→1131
> Fragen) und **sagt selbst, dass die Zeilenangaben NICHT nachgemessen sind**.
> ⚠️ **Nachzügler zu B:** `sollwerte.env` nannte `verify.sh` — eine `.env` stand in keinem
> `--include`-Muster meines greps. **Ein grep mit Dateifilter misst die Filter, nicht das Repo.**

### ETAPPE D — ORGANISATION FÜR NEUE CHATS

* **D1 `BEFUNDE_INDEX.md`:** eine Tabelle B-Nummer → Datei → Stichwort. Neun `BEFUNDE_*.md` mit
  ~270 KB, und die Doku zitiert durchgehend B-Nummern (B90, B106, B127, B136–B147), ohne dass
  eine Liste sagt, wo sie stehen. **Erzeugen, nicht pflegen:** ein kleines Skript, das
  `grep -oE "^#+ *B[0-9]+"` über die Dateien laufen lässt — eine gepflegte Liste driftet.
* **D2 `README.md` und `ARCHITECTURE.md` auffrischen** (beide zuletzt Mitte Juli). Zielgruppe ist
  **ein Mensch, der das Projekt zum ersten Mal sieht** — nicht der nächste Chat, der hat
  START_PROMPT. Hinein gehören: was die App ist, die acht Gebiete A1–B3, wie der Pool gebaut
  wird (`pool/*.json` → `build_fragen.py` → `fragen.js`), was `check.sh` prüft, wie deployt wird.
  ⛔ **Nicht aus dem Gedächtnis schreiben** — gegen `ARCHITECTURE.md`, `DEPLOY.md` und `SCHEMA.md`
  gegenlesen, das ist die B137-Lehre.

### ✅ ETAPPE E — ERLEDIGT 2026-09-10, ABER ANDERS: E1 UND E4 GEMESSEN UND GESTRICHEN

> **Gemessen:** die sieben Pool-Wächter sind 220 Zeilen (114 Code, 99 Kommentar). Die geplante
> Signatur passt auf **drei von sieben**; zitate (4 Meldezweige), verrat (Hinweis) und svg
> (3 Zweige + Hinweis) gar nicht. **Ersparnis rund 20 von 114 Codezeilen** — dieselbe Rechnung,
> an der dieser Plan selbst F1 gestrichen hat. ⛔ **E1/E4 gestrichen, Nutzer-Entscheid 10.09.**
> ⚠️ **E3 war mit dem genannten Werkzeug gar nicht ausführbar:** `sabotage.sh` fährt Suiten,
> die Pool-Wächter sind keine. **Der Plan nannte ein Werkzeug für einen Fall, den es nicht kann.**
> ✅ **E5 umgesetzt** (gemeinsame Überschrift, keine Logikänderung), **E2 galt ohnehin**.
> ►►► **Geblieben ist die ZUSICHERUNG statt der Form:** `tools/waechter_zusicherung.py`,
> `check.sh` 4e10 — jeder Wächter braucht Werkzeug-stumm- und ok-Zweig, ohne Ausnahmeliste.
> **Sie fand sofort B152** (4e8 meldete grün über ein stummes Werkzeug), die Gegenprobe fand
> **B153** (Meldezweig sagte „Binary file matches"), das Schreiben fand **B154** (Backslash
> verliert über die Brücke eine Ebene). Volltext: `docs/befunde/BEFUNDE_WERKZEUGE.md` §11.

### ETAPPE E — DER URSPRÜNGLICHE PLAN (Chronik)

* **E1** Funktion `pool_waechter <kommando> <muster> <fehlertext> <oktext>` in `check.sh`, dazu
  eine Tabelle der sieben Einträge (4e3 firmen · 4e4 zitate · 4e5 zufall · 4e6 begriffe ·
  4e7 abdeckung · 4e8 verrat · 4e9 svg).
* **E2** ⛔⛔ **DIE BEGRÜNDUNGSKOMMENTARE BLEIBEN.** Sie stehen über der Tabelle, nicht in ihr.
  Sie sind der Grund, warum niemand einen Wächter versehentlich entfernt — **ein Wächter ohne
  seine Geschichte wird beim nächsten Aufräumen gelöscht.**
* **E3** ⛔⛔ **JEDER DER SIEBEN WIRD EINZELN SABOTIERT** (`tools/sabotage.sh`), und jeder muss
  ROT werden. **Ein Umbau, der sieben Wächter still stellt, sieht aus wie ein grüner Lauf.**
  Das ist die teuerste Falle des ganzen Plans — sie kostet sieben Läufe und ist nicht verhandelbar.
* **E4** 4e9 (svg) hat **drei** Meldezweige (A/C/D) und passt nicht in die Tabelle. **Entweder
  Sonderfall lassen oder die Funktion um „mehrere Muster je Kommando" erweitern** — der Sonderfall
  ist ehrlicher, solange er der einzige ist.
* **E5** Die vier Stand-Guards (4e, 4e2, 4e2b, 4e2b2) bekommen nur eine gemeinsame Überschrift.
  **Kein Umbau der Logik** — sie prüfen dieselbe Klasse, aber verschieden genug.

### ⛔ ETAPPE F — F1 UND F2 GESTRICHEN AM 2026-09-10 (Etappe A hat sie NICHT gerechtfertigt)

> **Gemessen:** die sieben `pool_query`-Aufrufe kosten zusammen **1,746 s von 173 s = 1,0 %**, der
> reine Ladevorgang **0,180 s**. Der Sammelmodus spart höchstens **rund eine Sekunde**.
> ⛔ **Nicht erneut vorschlagen.** Der Umbau hätte sieben Wächter neu verdrahtet (und nach E3
> sieben Sabotageläufe gekostet) — **für 1 % Laufzeit.**
> ► **F3 bleibt offen**, es geht dort nicht um Rechenzeit, sondern um einen Verbindungsaufruf.
> ⚠️ **Solange die Linux-Shell nicht mountet, ist F3 gegenstandslos** — die Sitzung fährt die
> Läufe ohnehin auf dem Windows-Rechner, wo es keine Verbindungsaufrufe zu sparen gibt.

* ⛔ **GESTRICHEN — F1** Sammelmodus~~ `node tools/pool_query.js check`: fährt die sieben Prüfungen in EINEM Prozess
  und gibt je Prüfung einen Block mit fester Kopfzeile aus. `check.sh` ruft ihn einmal auf und
  schneidet die Blöcke heraus; **die Meldelogik je Wächter bleibt unverändert.**
* ⛔ **GESTRICHEN mit F1 — F2** Gegenprobe: **die sieben Meldungen müssen wortgleich dieselben sein wie vorher.**
  `bash check.sh > /tmp/nachher.txt` gegen einen vorher gesicherten Lauf `diff`en — nur die
  Laufzeit darf sich unterscheiden. ⚠️ **Und E3 gilt erneut**: nach F1 sind alle sieben Wächter
  neu verdrahtet, also alle sieben erneut sabotieren.
* **F3** `umgebung.sh` nimmt `suite.sh --waermen` mit — spart einen Verbindungsaufruf je Sitzung
  (~4 s Leerlauf, Messung 07.09.). **Nur wenn `--waermen` dort nicht stört**, wenn jemand
  `umgebung.sh` nur zur Diagnose ruft; sonst als Schalter `umgebung.sh --waermen`.

### WAS DIESER PLAN NICHT TUT

* **Kein Inhalt am Pool.** Keine neuen Fragen, keine Korrekturen — das ist Etappenarbeit und
  gehört nicht in einen Aufräumplan.
* **Keine Änderung an der Ziehungslogik**, an Schwellen oder an Sollwerten.
* **Kein Löschen.** Alles geht nach `_to_delete/` oder `tools/archiv/` — beides bleibt lesbar.
