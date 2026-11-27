# PLAENE_ARCHIV – abgeschlossene Etappen der Qualitaetsrunde Q1 (ausgelagert 2026-07-28)
# Aktiver Plan: docs/archiv/PLAENE.md. Hier stehen die Etappen 0, 1, 4, 5 und 6 – alle ausgeliefert.
#
# ⚠️ **STATUSAUSSAGEN UND ZAHLEN HIER SIND MESSWERTE VON DAMALS.** Sie waren richtig, als sie
# geschrieben wurden, und sind es heute grossenteils nicht mehr (Beispiel aus Etappe 0:
# 'A4 bei 2,8 %, der Waechter ist ROT' – heute 4,95 % und gruen).
# **Wird GEZIELT NACHGESCHLAGEN** ('wie lief Etappe 1?', 'warum wurde die Schwelle so gesetzt?'),
# nicht am Stueck gelesen. Aktueller Stand: START_PROMPT.md Abschnitt 3.

### ETAPPE 0 — Wächter und Kleinkram → ✅ **v1.9.0 (draußen)**  ⏱ klein
> ✅ **ERLEDIGT AM 2026-07-27.** Alle sieben Punkte umgesetzt und geprüft (BUILD_LOG ganz oben).
> Neue Suite `tests/test_didaktik.js` (29, `sollwerte.env didaktik=29`). Istwerte am Ende der
> Etappe: längste Antwort **209/274 = 76,3 %** (Schwelle 78) · Stufenlücken **4** ·
> A4 **2,75 %** (Schwelle 2,5) · Abkürzungen ohne Lexikoneintrag **196** (Schwelle 196).
> ⚠️ **Die Schwelle des Abkürzungs-Wächters steht auf 196, nicht auf den in der Rückfrage
> genannten 72** — die Vormessung hatte echte Abkürzungen (FAZ/SAZ/GP, RFC/APIPA/RADIUS, IT, PC,
> AG) mit ignoriert. Begründung im Test und im BUILD_LOG. **„IT" allein sind 72 Treffer; ob es ins
> Lexikon kommt, wird in Etappe 1 entschieden.**
> ⚠️ **NICHT gebumpt und NICHT committet** — wartet auf Sichtprüfung (M06-304) und Freigabe.

*Kann sofort beginnen, hängt von nichts ab.*
1. **Wächter „längste Antwort" (`tests/test_didaktik.js`, NEU).** Misst den Anteil der MC-Fragen,
   bei denen die richtige Option die längste ist. **Ratsche:** Startschwelle **78 %** (heute 76,6 %)
   — der Wächter verhindert damit ab sofort eine Verschlechterung. **Nach jedem geprüften Modul die
   Schwelle auf den neuen Istwert + 1 Punkt senken.** Zielwert am Ende der Runde: **≤ 45 %**.
   ⚠️ Die Schwelle steht als Konstante im Test, NICHT in `sollwerte.env` (dort stehen Testanzahlen).
2. **Wächter „Stufenlücke"**: meldet Feinthemen, deren Stufen springen (heute 4). Startwert 4,
   nach Etappe 4 auf 0.
3. **Wächter „Gebiets-Unwucht"**: meldet, wenn ein AP1-Gebiet unter 3 % der Fragen fällt
   (heute A4 mit 2,8 % → der Wächter ist ROT, bis Etappe 3 läuft — **das ist gewollt und muss im
   Test als bekannter Ausnahmefall stehen**, sonst blockiert er alle Releases davor).
   ⚠️ **ENTSCHEIDUNG BEIM BAUEN:** entweder Schwelle zunächst auf 2,5 % und nach Etappe 3 auf 5 %
   anheben — das ist der saubere Ratschen-Weg und wird so gemacht.
4. **Wächter „Abkürzung ohne Lexikoneintrag"**: Kürzel im Fragetext, das nicht in
   `abkuerzungen.js` steht, wird gemeldet.
5. **M06-304 auf ECDHE umstellen.** Kernaussage hybrid bleibt; RSA-Transport als historischer
   Sonderfall benennen. `assert` auf den Ausgangstext, Gegenprobe.
6. **docs/befunde/COVERAGE.md Abschnitt 2 neu erheben** (FK01–FK07 gegen den heutigen Pool).
7. Gegenprobe für JEDEN neuen Wächter, `sollwerte.env` nachziehen, `check.sh block`-Vollauf.

### ETAPPE 1 — Batch-Prüfung M04, M05, M06 → ✅ **v1.10.0 / ausgeliefert mit v1.10.1**  ⏱ groß
> 🔄 **LÄUFT.** Nutzer-Entscheid 27.07.: **Reihenfolge M05 → M06 → M04** (statt M04 zuerst; die drei
> Module hängen nicht voneinander ab, und das kleinste zuerst bringt die erste Befundliste früh).
> ✅ **M05 fertig (65 Fragen, 27.07.):** 2 Widersprüche, 1 Formulierung, 4 Sprachfehler korrigiert;
> Längenausgleich in 18 mc + 3 mehrfach. Poolweit **76,3 % → 69,7 %**, Schwelle 78 → **71**.
> ✅ **M06 fertig (103 Fragen, 27.07.):** 3-mal dieselbe überholte Kryptografie (RSA-2048 → ECDHE,
> SHA-256 → Argon2id, Hybrid-Erklärung), 1 Frage mit zwei vertretbaren Antworten, 6 Sprachfehler;
> Längenausgleich in 22 mc + 4 mehrfach. **72,7 % → 63,7 %**, Schwelle 71 → **65**.
> ⚠️ Dabei die **Wächter-Regel korrigiert**: Fragen, deren längste Option unter 25 Zeichen hat,
> zählen nicht mehr mit (`MIN_OPTIONSLAENGE`). Das HOB den Istwert von 69,7 auf 72,7 %, weil der
> Nenner schrumpfte — keine Pool-Verbesserung, die Ratsche wurde neu gesetzt. Suite 29 → **32**.
> ✅ **M04 fertig (179 Fragen, 27.07.):** **die erste falsch markierte Antwort der Runde**
> (M04-107, switch statt if-else-if bei Wertebereichen — `loesungIndex` getauscht), M04-501 lehrte
> das Gegenteil der übrigen Pseudocode-Fragen, 6 weitere Befunde; Längenausgleich in 31 mc +
> 2 mehrfach. **63,7 % → 50,6 %**, Schwelle 65 → **52**.
> ✅ **ETAPPE 1 IST DAMIT KOMPLETT** — 347 Fragen geprüft. Release **v1.10.0** vorbereitet
> (APP_VERSION, sw.js, CHANGELOG), NICHT committet.
> ⚠️ Die verbleibenden 124 Längen-Treffer liegen fast vollständig in den Modulen der **Etappe 3**
> (M01, M02, M03, M07, M08). Das Ziel 45 % ist erreichbar, aber nur dort.
> ⚠️ **LEHRE: ein fachlicher Befund aus einer Stichprobe ist ein Verdacht auf eine FEHLERKLASSE.**
> Der TLS-Befund des Prüfberichts hatte drei Geschwister im selben Modul. Nach jedem Sachbefund
> poolweit nach demselben Muster suchen, nicht nur die gemeldete Stelle korrigieren.
> ⚠️ **LEHRE AUS M05 – beim Angleichen NICHT über das Ziel hinausschießen:** Der erste Entwurf machte
> die Distraktoren fast doppelt so lang wie die richtige Antwort. Der Wächter meldet das nicht (er
> misst nur „richtige ist die längste"), der Lerner würde aber einfach „nimm die kürzeste" lernen.
> Ziel ist **Gleichstand ±15 %**, mit mindestens einem Distraktor über der richtigen Antwort.
**423 Fragen** (M04 179 · M05 65 · M06 103 · davon 97 MC). Batches zu 15–25 Fragen, ~20 Batches.
Diese drei Module zuerst, **weil M09 sie nicht berührt.**

Je Frage vier Handgriffe, in dieser Reihenfolge:
1. **Markierte Antwort verifizieren** — bei Rechen-/Normfragen nachrechnen bzw. Paragraf prüfen.
2. **Jeden Distraktor prüfen:** plausibel, aber nachweisbar falsch? Keine zweite richtige Antwort?
3. **Distraktorlängen angleichen** (nur MC/mehrfach): Distraktoren auf das Niveau der richtigen
   Antwort bringen. ⚠️ **NICHT die richtige Antwort kürzen** — das kostet fachliche Präzision.
4. **Erklärung gegen die Antwort halten** (Kernsatz/Stichpunkte/Merke bleibt).

Regeln: Befunde **sammeln, nicht einzeln korrigieren** (bewährtes Verfahren aus Punkt 10), je Modul
vorlegen, dann in einem Zug korrigieren. Nach jedem Modul: `build_fragen.py`, **Drift 0**,
`validate_pool`/`idcheck`/`validate_schema`, `fakten_check.py`, betroffene Suiten auf Sollwert,
**Längen-Wächter-Schwelle senken**, Render-Abzug zur Sichtprüfung.

### ETAPPE 4 — Stufe-1-Einstiegsfragen → ✅ **fertig, geht mit v1.11.0 raus**  ⏱ groß
> ✅ **ERLEDIGT AM 2026-07-27** (vorgezogen, weil Etappe 2 bis zum Klausurtermin 31.07. gesperrt ist).
> 44 Fragen für 22 Themen geschrieben, Pool **983 → 1027**, Stufe 1 **132 → 176**.
> Feinthemen ohne Stufe-1-Einstieg: **26 → 4** (die vier bewusst ausgenommenen AP2-Themen).
> Typen: 27 mc + 17 zuordnung. Längen-Tell **50,6 % → 45,6 %**, Schwelle 52 → **47**.
> ⚠️ **LEHRE: Der Tell entsteht beim Schreiben von selbst.** Im ersten Entwurf hatten 5 von 6
> mc-Fragen die richtige Antwort als längste – die richtige Antwort ist eben die vollständige.
> 14 Distraktoren mussten vor dem Einsortieren nachgezogen werden. **Für Etappe 5 und 6 gilt:
> erst messen, dann einsortieren.** Der Helfer prüft es per `assert` mit.
> ⚠️ **Der Rückgang auf 45,6 % kam aus dem NENNER, nicht aus einer Korrektur** – der Zähler blieb
> bei 124. Das Ziel 45 % darf nicht durch weiteres Hinzufügen erreicht werden; die Altlasten
> liegen in den Modulen der Etappe 3.
**22 Themen × 2 = 44 neue Fragen**, nur AP1-Gebiete A1–A5. Ausgenommen (AP2, Nutzer-Entscheid):
IP-Adressierung & Subnetting, Kündigung, Rechte & Pflichten, Arbeitsschutz & Arbeitszeit.

Die 22 Themen: **M01** KI im Störungsmanagement · Machbarkeit & Kalkulation · Risiko & Stakeholder ·
SMART-Ziele — **M02** Bedarfsanalyse & Marktforschung · Bezugskalkulation & Skonto ·
Englische Fachtexte · Kommunikationsmodelle · Präsentation & Quellen — **M03** Cloud &
Virtualisierung · Dateisysteme & Software · Netzwerk- und Arbeitsplatz-Ausstattung ·
OSI-Modell & Protokolle — **M04** Lizenzen & Urheberrecht · Praxisszenarien · UML &
Schreibtischtest — **M05** Qualitätskosten — **M06** Härtung & Zugriffskontrolle ·
IT-Sicherheit und Datenschutz-Vorfall — **M07** Onsite/Remote & Nachfolgeaufträge ·
Soll-Ist & Nachkalkulation · Vertragsstörungen & Mängel.

„Stufe 1" heißt im Bestand: Begriffs- und Zuordnungsfragen (mc, zuordnung, erklaeren, lueckentext).
⚠️ Neue Fragen von Anfang an mit **ausgeglichenen Distraktorlängen** — sonst zieht der Wächter an.

### ETAPPE 5 — A4 „Kunden einweisen" ausbauen → ✅ **fertig, geht mit v1.11.0 raus**  ⏱ mittel
> ✅ **ERLEDIGT AM 2026-07-27.** 18 Fragen, A4 **24 → 42** (2,85 % → 4,88 %), Pool 1027 → 1045.
> Neues Feinthema **M07|Einweisung & Schulung** (14 Fragen) statt Einsortierung unter „Abnahme &
> Übergabe" — Abnahme ist der Rechtsakt, Einweisung die Leistung danach.
> Die beiden A4-Stufenlücken wurden mitgenommen (aus Etappe 6 vorgezogen): **Stufenlücken 4 → 2**.
> ⚠️ **Gebiets-Schwelle auf 4,8 statt der hier geplanten 5,0** — der Istwert liegt knapp darunter,
> weil der Nenner mitgewachsen ist. Nutzer-Entscheid: die Schwelle folgt der Messung.
> ⚠️ Längen-Tell 45,6 → 43,8 %, Schwelle 47 → 45. **Der Zähler steht unverändert bei 124** —
> das Ziel ist rechnerisch unterschritten, inhaltlich nicht erreicht. Etappe 3 bleibt fällig.
**+18 Fragen auf rund 40.** Heute: Abnahme & Übergabe (9), Präsentation & Quellen (7),
Change Management (6). Inhaltliche Zielrichtung: Einweisungsgespräch, Schulungsunterlagen,
Übergabeprotokoll, Endanwender-Dokumentation, Umgang mit Rückfragen.
⚠️ **Danach die Schwelle des Gebiets-Wächters von 2,5 % auf 5 % anheben.**

### ETAPPE 6 — Stufe 4 und Stufenlücken → ✅ **fertig, in v1.12.0**  ⏱ mittel
> ✅ **ERLEDIGT AM 2026-07-27** (vorgezogen, weil Etappe 2 bis zum Klausurtermin gesperrt war).
> **26 Fragen für 13 Typen statt der hier geplanten 18 für 9 Typen** — die Messung ergab vier
> weitere Typen ohne Stufe 4 (`fehlersuche`, `kalkulation`, `szenario2`, `trace`). Diese hatten
> Stufe 4 **nur in M09**; mit der Auflösung des Sonderpools in Etappe 2 wären sie verschwunden.
> Dazu die letzten zwei Stufenlücken (M06-030 BSI Stufe 2, M08-030 Tarifrecht Stufe 3).
> **Stufenlücken-Wächter steht auf 0.** Pool 1045 → 1073, Stufe-4-Fragen 54 → 80.
* **18 Fragen**: je 2 auf Stufe 4 für zuordnung, hotspot, matrix, konsole, baukasten, bild,
  beschriftung, erklaeren, kreuztabelle.
* **5 Fragen** für die vier Themen mit Stufensprung: BSI-Grundschutz & Schutzbedarf (Stufe 2),
  Abnahme & Übergabe (2), Change Management (2), Tarifrecht (3).
* Danach **Stufenlücken-Wächter auf 0** setzen.

## ROTATION 2026-09-10 – Q3 komplett und die erledigte Stufe-3/4-Grundlage

### aus docs/archiv/PLAENE.md, Zeilen 20-316 der Ur-Fassung

## ✅ GESAMTPLAN „RUNDE Q3 – EXTERNE MASSSTÄBE" (aufgestellt 2026-09-04, KOMPLETT DURCH 2026-09-07)
# ⚠️ **ALLE ZEHN ETAPPEN SIND ABGESCHLOSSEN** – jede Zeile der Tabelle durchgestrichen, mit Datum
# und Ergebnis. **Nicht neu anfangen, nicht nachprüfen.** Was als Ermessensfrage liegenblieb,
# steht in `START_PROMPT.md` Abschnitt 3 – es ist Nutzer-Entscheid, kein offener Auftrag.

# ⚠️ Alle Zahlen hier sind Messwerte vom 04.09.2026, erhoben VOR der Planung. Wer danach handelt,
# misst sie nach. Der Stand steht in START_PROMPT.md, nicht hier.

### Ausgangslage, gemessen am 04.09.

| Maß | Wert | Bemerkung |
|---|---|---|
| Pool | 1074 Fragen (953 AP1, 121 AP2), 81 Themen in 8 Modulen | |
| Gebiete AP1 | A1 15,53 % · A2 20,67 % · A3 38,72 % · **A4 5,98 %** · A5 19,10 % | Schwelle nur für A4 (4,80) |
| **A4-Puffer** | **234 Fragen ausserhalb A4**, dann reißt `test_didaktik` | vor den zehn A4-Fragen waren es 36 |
| Formatvielfalt | A1 14 · A2 19 · A3 19 · **A4 7** · A5 21 Formate | A4 ist auch hier das dünnste |
| Stufe 4 | A4 hat 3 · 29 von 72 Themen haben keine | |
| Dünne Themen | 14 unter 8 Fragen, dünnstes: M04 GUI-Entwurf (5), M08 Aufgabenanalyse (5) | `pool_query.js duenn` |
| **Zeilen Lehrtext je Frage** | **M03 2,3** · M01 3,2 · M06 3,3 · M05 3,4 · M02 4,3 · M07 4,8 · M04 5,7 | am 31.08. war 3,5 der Warnwert |
| Verweise | 971 geprüft, **6 ohne jeden Stichwort-Treffer** (5 davon auf „3.2 – OSI-Referenzmodell") | `e3_gegenprobe.py --streng` |
| Externe Quellen | Prüfungskatalog in `tools/katalog/`, Lehrbuch LF1-5 im Ordner `Buch` | seit 03.09. |

### ⛔ WAS NICHT ZU TUN IST — dreimal an einem Tag belegt

**Eine Lücke gegenüber dem LEHRBUCH ist keine Lücke bei uns.** BPMN (nur in der Vorbemerkung des
Katalogs), SQL und RAID (dort „ausschliesslich Teil 2"), Verpackungsgesetz und Arbeitssicherheit
(Teil 2 bzw. gar nicht im Katalog) sahen alle nach Handlungsbedarf aus und waren keiner.
►► **Vor jeder Ergänzung: im Katalog nachschlagen UND die nächste vorangehende Teil-Überschrift
mitlesen** (Teil 1 = Zeile 338–1052 des OCR-Textes, ab 1053 Teil 2).

**Und das Lehrbuch kann selbst falsch sein** (B127: WLAN-Normtabelle S.320). Wo Buch und Pool sich
widersprechen, entscheidet die Sache, nicht die Quelle.

**Der Buchtext ist OCR, jede Seite ein Scan.** Was eine Änderung am Bestand auslöst — Wortlaut,
Zahl, Paragraf, Norm — wird VORHER am Seitenbild bestätigt (`buch.py bild <seite>`). Gilt für jede
Etappe unten, die Inhalt anfasst.

**Ein Pool-Scan über `json.dumps` zählt Felder, nicht Fragen.** Jede Mengenaussage trennt
Prüfsubstanz (Frage, richtige Antwort, Musterlösung, Pflichtbegriffe, `paare`, `luecken`, `zeilen`)
von blosser Erwähnung in Erklärung oder Distraktor. Ohne diese Trennung hätte der M04-Lauf vier
Fehlbefunde produziert, zwei davon mit Änderungen an richtigem Bestand.

### Die Etappen

| # | Etappe | Aufwand | Ertrag erwartet | Entscheid nötig |
|---|---|---|---|---|
| ~~A~~ | ~~Release v1.23.0 abschliessen~~ | ✅ **07.09.: Push durch, CI grün, Tag v1.23.0 auf dem Remote** | – | erledigt |
| ~~A+~~ | ~~Präfix-Maßstab des Prüfungskatalogs~~ | ✅ **04.09. geprüft: KEIN BEFUND**, Klasse (a) leer | – | erledigt |
| ~~B~~ | ~~M03: dünnster Lehrtext, sechs leere Verweise~~ | ✅ **04.09.: beide entkräftet**, Maß als untauglich erkannt | – | erledigt (3.2 ausgebaut) |
| ~~C~~ | ~~Katalog-Abdeckung auf Themenkreis-Ebene~~ | ✅ **06.09.: Parser, Durchsicht, 9 Fragen** | – | erledigt |
| ~~D~~ | ~~Zwei belegte Inhaltslücken schliessen~~ | ✅ **04.09.: 7 Fragen geschrieben** (M03-200, M03-208..213) | – | erledigt |
| ~~E~~ | ~~Restliche Ankerläufe~~ | ✅ **07.09.: M07 und M05 gelaufen, KEIN Befund** — Verfahren ausgeschöpft, M01/M02 gestrichen | – | erledigt |
| ~~F~~ | ~~A4: Formatvielfalt und Stufe 4~~ | ✅ **07.09.: 8 Fragen, Formate 7 → 12, Stufe 4: 3 → 6** | – | erledigt |
| ~~G1~~ | ~~Wächter für Teil-Zugehörigkeit gegen den Katalog~~ | ✅ **06.09.: gemessen, VERWORFEN** — dafür ein exakter Wächter Pool gegen Pool | – | erledigt |
| ~~G2~~ | ~~Wächter für Widerspruch Lehrtext ↔ Pool~~ | ✅ **06./07.09.: B131-Teil gebaut, Widerspruchs-Teil gemessen und VERWORFEN** | – | erledigt |
| ~~H~~ | ~~Aufräumen~~ | ✅ **07.09.: 17 MB verschoben** (`Buch/_aufbereitung/_to_delete/`) | – | erledigt |
| ~~I~~ | ~~Anhang des Prüfungskatalogs auswerten~~ | ✅ **04.09.: 4.7 ergänzt + 6 Fragen** (M04-200, M04-208..212) | – | erledigt |

---

#### ✅ A — ERLEDIGT AM 07.09.
Nutzer hat gepusht und `ci2.sh` gefahren: **URTEIL „letzter Lauf auf main = SUCCESS"**, Tag
`v1.23.0` liegt auf dem Remote. `python3 tools/ungepusht.py` meldet **0 Commits, 0 mit Wirkung
beim Lerner**; Standzeile steht auf `LIVE = committet · PUSH DURCH`.
⚠️ **v1.23.0 trägt inzwischen die Etappen C, D, E, F, G2, H und den Nebentext-Befund mit** — sie
sind ohne eigenen Bump daraufgelaufen. **Der nächste Feature-Meilenstein braucht einen Bump.**

#### ✅ A+ — ERLEDIGT AM 04.09., KEIN BEFUND
**Ergebnis vorweg: alle 26 Fragen einzeln angesehen, Klasse (a) ist LEER — nichts zu ändern.**
Jede echte Rechenaufgabe nennt ihre Konvention ausdrücklich, und der Pool übt die Binärrechnung in
vier Aufgaben (M03-953, M03-726, M03-533, M06-542). Volltext: `docs/befunde/BEFUNDE_BUCH_KATALOG.md`, B130.
**Nicht wiederholen.** Der Maßstab selbst bleibt gültig und steht unten — für jede NEUE Frage mit
Datenmengen: entweder Binärpräfix, oder die dezimale Konvention ausdrücklich benennen.

##### Der Maßstab (bleibt gültig)
**Gefunden am 04.09. im ANHANG des Prüfungskatalogs (S.46) — der bis dahin nie ausgewertet war.**
Der Katalog schreibt dort wörtlich vor:
> *„Dezimalpräfixe werden bei der Angabe von physikalischen Größen wie Strom, Leistung,
> Geschwindigkeit usw. verwendet. **Binärpräfixe werden bei der Angabe von Datenmengen
> verwendet.** … **Angaben zu Datenmengen sind nur mit Binärpräfixen richtig!**"*
Die Tabelle beziffert die Abweichung: **kB/KiB 2,4 % · MB/MiB 4,86 % · GB/GiB 7,37 % · TB/TiB 9,5 %.**

**Gemessen im Pool (04.09.):** 41 Fragen enthalten Dezimalpräfixe für Datenmengen, davon
**26 in der PRÜFSUBSTANZ** — gegen nur **6 mit Binärpräfix**. Schwerpunkt:
M03 „Berechnungen: Daten & Übertragung" (9), **„Datenmengen & Präfixe" (6)**, „Dateisysteme &
Software" (5). Beispiele: *„Eine 2,5 GB große Datei über eine 100 Mbit/s-Leitung"*,
*„1,25 GB in genau 100 Sekunden"*, *„Jedes Backup benötigt 8 GB, nach 45 Tagen …"*.

⚠️⚠️ **KANDIDATENFILTER, KEIN URTEIL — und hier ist die Verwechslungsgefahr besonders gross.**
In *„2,5 GB Datei über 100 Mbit/s"* ist die **Rate zu Recht dezimal** (physikalische Größe) und nur
die **Dateigröße** müsste binär sein. Und das Thema heisst „Datenmengen & Präfixe" — dort kann die
Unterscheidung bereits GEGENSTAND der Frage sein, also richtig. **Jede der 26 Fragen einzeln
ansehen, bevor irgendetwas geändert wird.**
**Verfahren:** 1. Die 26 Substanz-Fragen einzeln lesen und in drei Klassen teilen: (a) Datenmenge
mit falschem Präfix, (b) physikalische Größe, also richtig, (c) die Unterscheidung ist selbst das
Thema. 2. Nur (a) korrigieren — und dabei **die Rechenergebnisse mitziehen**, sonst stimmt die
Musterlösung nicht mehr. 3. `rechenassistent`-Aufgaben zuletzt: dort steckt die Zahl in `variablen`
und `formel`. **`node tools/pool_query.js zufall` rechnet sie deterministisch durch** — vor UND
nach der Änderung fahren.
**Abbruchkriterium:** Wenn Klasse (a) klein ist (< 5 Fragen), ist es kein Befund, sondern eine
Fussnote. **Aufwand:** eine Runde. **Risiko:** hoch, weil Zahlen in Musterlösungen hängen.
**Entscheid nötig:** ob wir dem Katalog-Maßstab folgen. ⚠️ Er ist streng — die halbe IT-Branche schreibt
GB, wo GiB gemeint ist, und der Lerner sieht auf jeder Festplattenverpackung Dezimalpräfixe.

#### ✅ B — GEPRÜFT AM 04.09., BEIDE VERDACHTSMOMENTE ENTKRÄFTET
**Die sechs leeren Verweise sind Wortform-Fehlalarme** (Lehrtext schreibt „OSI-Modell", Verweis
„OSI-Referenzmodell"; bei M07-750 fehlen „Gestaltung/Bewertung/Klauseln" aus dem VERWEISTEXT).
**Und „Zeilen Lehrtext je Frage" taugt bei tabellarischem Stoff nicht** — 3.2 trägt die volle
7-Schichten-Tabelle. Volltext: `docs/befunde/BEFUNDE_BUCH_KATALOG.md` §11. **Nicht wiederholen.**
⚠️ **Offen als Ermessensfrage:** 3.2 hat 101 Zeichen/Frage bei 28 OSI-Fragen — ein Ausbau wäre
vertretbar, ist aber nicht belegt nötig. **Nutzer-Entscheid.**

##### Die ursprüngliche Begründung (überholt, als Verfahrens-Vorlage behalten)
**Der stärkste Befund der Vorabmessung, und zwei Messungen zeigen auf dieselbe Datei.**
* **2,3 Zeilen Lehrtext je Frage** — mit Abstand der niedrigste Wert, bei gleichzeitig **grösstem
  Modul (201 Fragen)**. Am 31.08. hatte M05 bei 3,5 ein Viertel des Moduls ohne Lehrtext.
* **5 der 6 leeren Verweise zeigen auf „Modul 03, Abschnitt 3.2 – OSI-Referenzmodell"**, und
  „Referenzmodell" kommt dort nicht vor (M03-472, M03-703, M03-970, M03-971, M03-972). Dazu
  M07-750 auf „7.1 – SLA-Klauseln", 0 von 3 Stichworten.
* ⚠️ Die alte Projektlehre passt dazu: **„Modul 03: 3.2 führt kein einziges Netzwerkgerät"** — 21
  der 33 M03-Fehler kamen seinerzeit aus genau dieser Abschnittsverwechslung.

**Verfahren:** 1. `e3_gegenprobe.py --streng` für M03 auswerten. 2. Prüfen, ob das OSI-Modell
überhaupt in 3.2 gehört oder ob die Verweise auf einen anderen Abschnitt zeigen müssten — **am
Inhaltsverzeichnis der Kursdatei, nicht an der Verteilung** (die Mehrheit kann die falsche Seite
sein). 3. Fehlt der Stoff ganz, Lehrtext ergänzen; zeigt er nur falsch, `verweis_setzen.py --batch`.
**Abbruchkriterium:** Wenn 3.2 den Stoff enthält und nur die Wortform abweicht, ist es ein
Fehlalarm des Kandidatenfilters — dann nur dokumentieren.
**Entscheid nötig:** Lehrtext ergänzen ist eine Inhaltsentscheidung.

#### ✅ C — ERLEDIGT AM 06.09. (Werkzeug, Durchsicht und die neun Fragen)
**Nutzer-Entscheid 06.09.: Parser bauen (gründlich).** Erledigt und im Repo:
* `tools/katalog/katalog_parse.py` — zerlegt Teil 1 in **7 Fragenkomplexe, 33 Themenkreise,
  176 Inhaltspunkte**. Liest die WORTKOORDINATEN (`tools/katalog/tsv/`), nicht den Fließtext, weil
  der die drei Spalten verliert. Ob eine Zeile ein neuer Punkt oder ein Umbruch ist, entscheidet
  eine Messung im Seitenbild (`aufzaehlungszeichen.json`) — Einrückung, Zeilenabstand und
  Zeilenlänge trennen das nachweislich NICHT. Selbstprüfung: `--pruefen`.
* `tools/katalog/abdeckung.py` — hält den Pool gegen die Themenkreise und trennt dabei
  **Prüfsubstanz von Nebentext**. Eine Feldprobe bricht ab, sobald bei der Zerlegung Text verloren
  geht (bei 1087 Fragen: 0 Verluste). `--luecken`, `--kreis 03/02`, `--begriff SCRUM`.

**Erste Messung, noch UNGEPRÜFT:** 484 Begriffe, davon **90 ohne jede Erwähnung** und **47 nur im
Nebentext erklärt**. ⚠️ Kandidatenfilter — beim Überfliegen sind „Accesspoint" (wir: „Access
Point"), „Filesysteme" (wir: „Dateisysteme") und die OCR-Wörter „Kl-Software", „Kommandeozeile",
„Befehissyntax" schon als Fehlalarm erkennbar.

**✅ DURCHSICHT ERLEDIGT AM 06.09. — 3 von 137 bleiben stehen.** Volltext: `docs/befunde/BEFUNDE_BUCH_KATALOG.md`
§14. **Nicht wiederholen.**
* **C1 Skriptsprachen als Sprachkategorie** (Themenkreis 04/06). Der Themenkreis nennt neun
  Merkmale von Programmiersprachen; **acht prüft der Pool, Skriptsprachen nicht.** Verweisziel
  Modul 04, Abschnitt 4.6 ist vorhanden. Der stärkste der drei.
* **C2 Die vier Objekttypen der Schutzbedarfsfeststellung** (06/02): Anwendungen · IT-Systeme ·
  Räume, Infrastruktur · Kommunikationsverbindungen. Schutzbedarf ist mit 7 Fragen gut abgedeckt,
  die Liste als Liste nicht. Dünn.
* **C3 „Erfüllungsort" und „technische Voraussetzungen" als Kundenvorgaben** (07/03). Der
  Themenkreis selbst ist abgedeckt; „Erfüllungsort" hat 0 Fundstellen im ganzen Pool. Am dünnsten.

**134 der 137 waren Fehlalarm** — Schreibform („Accesspoint" gegen unsere 32× „Access Point"),
OCR-Rauschen („Kl-Software", „Kommandeozeile") oder kein Fachbegriff („Qualitativer", „Benennung").
►► **3 von 137 ist der eigentliche Befund.** Ohne Substanzprüfung wären 134 Änderungen an richtigem
Bestand entstanden.

**Alle drei geschrieben (Nutzer-Entscheid 06.09.), neun Fragen:** C1 → M04-213 bis M04-216 (A3),
C2 → M06-200/206/207 (A3), C3 → M07-200/216 (A5). Kein Lehrtext-Ausbau nötig — 4.6, 6.2 und 7.3
enthielten den Stoff bereits. Gegenprobe mit dem eigenen Werkzeug: „Skriptsprache" 0 → 4 Fragen mit
Substanz, „Kommunikationsverbindung" 0 → 3, „Erfüllungsort" 0 → 1.

**Nebenbefund, notiert und ohne Auftrag:** 45 Begriffe stehen nur im NEBENTEXT — der Pool erklärt
sie, prüft sie aber nicht. Darunter Personal Firewall (0S/2N), Thin Client (0S/3N),
Netzwerkanbindung (0S/2N). ⚠️ **Das ist die nächstgrößere Klasse und sie zeigt auf BESTAND, nicht
auf Zuwachs** — die Projektlehre zieht das vor. Noch nicht angefasst.

##### Die ursprüngliche Begründung (überholt, als Verfahrens-Vorlage behalten)
**Das naive Verfahren ist gemessen und verworfen:** Begriffsextraktion aus Teil 1 liefert 578
Kandidaten, davon 111 „im Pool nicht auffindbar" — und fast alle sind Rauschen (`Fragenkompiex`,
`Hinblick`) oder Kompositum-Artefakte (`Kl-Software` für KI). **Wortebene taugt nicht.**
**Stattdessen:** Der Katalog ist strukturiert — Fragenkomplex (`0X … § 4 Absatz 2 Nummer X` + `|LF n`)
→ Themenkreis (`0X … können`) → Inhaltspunkte (`-`, `«`, `®`). Auf dieser Ebene sind es rund 30–40
Themenkreise für Teil 1, und die lassen sich einzeln gegen den Pool halten.
**Beleg, dass es trägt:** eine Stichprobe von 19 konkreten Inhaltspunkten fand **zwei echte Lücken**
und bestätigte 17 als abgedeckt.
**Aufwand:** Parser bauen (~1 Runde), dann je Themenkreis eine Substanzprüfung.
**Entscheid nötig:** ob der Parser gebaut wird, oder ob die Stichprobe genügt.

#### ✅ D — ERLEDIGT AM 04.09.
**Sieben Fragen geschrieben** (M03-200, M03-208 bis M03-213, alle A2): Zuordnung ERP/SCM/CRM/
Systemsoftware, ein Vertriebsfall, die Abgrenzung des ERP, die ausgeschriebenen Kürzel, die
Anforderungen an ein Videokonferenzsystem, ein Störungsfall Bandbreite gegen Latenz und die
Zuordnung der Kommunikationssysteme. Verweisziele vorher geprüft (3.1 „Softwareprodukte",
3.2 „Kommunikationssysteme"), Gebietsrechnung vorher gefahren: A4 5,98 → 5,90 %, Puffer bis 1187.
Kein neues Thema angelegt — die Fragen sind in „Dateisysteme & Software" und „Netzwerk- und
Arbeitsplatz-Ausstattung" eingehängt. Volltext: `BUILD_LOG.md`, 2026-09-04 (9). **Nicht wiederholen.**

##### Die ursprüngliche Begründung (als Verfahrens-Vorlage behalten)
Aus der Stichprobe von C, beide in Teil 1, beide ohne Prüfsubstanz im Pool:
* **Branchensoftware** (ERP, Supply Chain Management, Customer Relationship) — **0 Treffer im
  ganzen Pool** für „Branchensoftware"; ERP hat 10 Fragen, SCM 1, CRM 1.
* **Videokonferenzsysteme** — 2 Erwähnungen, **0 mit Substanz**. Der Katalog führt sie unter
  „Kommunikationssysteme, z. B. Videokonferenzsysteme, Social-Media-Systeme".
Dünn, aber vorhanden: Desktop as a Service (1), Client-Server-Systeme (1), Debugger (1).
**Rechnung vorab:** Diese Themen liegen in **A2**, senken also den A4-Anteil. Bei einem Puffer von
234 Fragen ist ein Stapel von 8–12 unkritisch — **trotzdem vor dem Schreiben nachrechnen.**
**Verweisziel prüfen, BEVOR geschrieben wird** (Lehre aus dem A4-Lauf: Verpackungsgesetz hatte keins).
**Vorlagen-Fundus:** `buch.py check` listet die 121 Kompetenzchecks des Lehrbuchs mit Seite und
Kapitel. **Gemessen brauchbar: rund 87** — 17 verweisen auf das Arbeitsbuch, das wir nicht haben,
17 sind offene Handlungsaufträge (recherchieren, diskutieren, präsentieren). ⚠️ Sie liefern das
THEMA und die Gewichtung, nicht den Wortlaut: Format und Formulierung entstehen bei uns, und das
Gebiet vergibt `apply_batch.py` aus dem Bestand.

#### E — Restliche Ankerläufe
Gemessene Ausbeute: M06 → 1 Befund (zurückgenommen auf einen halben), M03 → 2, M04 → 1 plus vier
entkräftete Verdachtsfälle. **Rund sechs Aufrufe je Modul.**
**Empfehlung: nur M07 und M05.** M07 ist gross (164 Fragen) und lief nie gegen eine externe Quelle;
M05 (68 Fragen) hat mit 3,4 Zeilen/Frage einen auffälligen Lehrtextwert. **M01 und M02
zurückstellen** — bei sinkender Ausbeute lohnt der Vollständigkeitsdrang nicht.

#### F — A4: Formatvielfalt und Stufe 4
A4 hat **7 Formate** gegen 14–21 in den anderen Gebieten und **3 Fragen auf Stufe 4**.
Nach dem Zuwachs vom 03.09. ist die Menge kein Problem mehr, die **Vielfalt** aber schon: wer A4
übt, sieht immer dieselben Aufgabenarten. **Kandidaten:** `matrix`, `kreuztabelle`, `szenario2`,
`fehlersuche`, `hotspot` — alle im Bestand vorhanden und in A4 unbenutzt.
⚠️ `test_matrix` hat drei inhaltliche Wächter (konkrete Zahl je Element, kein Motiv öfter als 3×,
Kurzerklärung greift eine Zahl auf). **Vor dem Schreiben lesen.**

#### G1 — Ein Wächter für die Teil-Zugehörigkeit
**Die teuerste Fehlhandlung dieses Verfahrens ist, AP2-Stoff in eine AP1-Frage zu schreiben** — und
**kein Wächter sieht das**: der Gebiets-Wächter misst Anteile, nicht Zugehörigkeit. Dreimal an einem
Tag stand dieser Fehlgriff kurz bevor.
**Denkbar:** ein Wächter, der für Begriffe aus einer gepflegten Liste prüft, ob eine AP1-Frage sie
in der Prüfsubstanz führt, obwohl der Katalog sie in Teil 2 verortet (SQL, RAID, Struktogramm, PAP …).
**Erst messen, ob das mechanisch billig geht** — genau wie beim Lehrtext-Pool-Wächter verlangt.
⚠️ **Und er darf nicht auf dem Katalog-OCR aufsetzen**: der Rohtext ist zu verrauscht für einen
Wortlautvergleich. Er müsste gegen eine **selbst gepflegte, belegte Begriffsliste** prüfen — so wie
`zitate_belegt.json` und `begriffe_belegt.json` es vormachen.

#### G2 — Der alte Kandidat: ein Wächter für den Widerspruch Lehrtext ↔ Pool
**Stand schon vor dem Buch im START_PROMPT und ist NICHT erledigt.** `verweis` prüft, ob das Ziel
existiert, `--streng`, ob das Stichwort darin vorkommt — **den inhaltlichen Widerspruch prüft
nichts.** B106 war genau das: der Lehrtext definierte Leasing gegen die eigene Frage `M07-003`,
monatelang, und wurde durch Zufall gefunden.
**Warum das jetzt anders aussieht:** Mit Buch und Katalog gibt es erstmals eine dritte Instanz.
Ein Widerspruch Lehrtext ↔ Pool lässt sich gegen sie auflösen, statt ihn nur zu bemerken.
**Erst messen, ob es mechanisch billig geht** — die alte Auflage dieser Etappe verlangte das schon.
**Verhältnis zu G1:** G1 prüft ZUGEHÖRIGKEIT (AP1 gegen AP2), G2 prüft AUSSAGEN. Beide brauchen
eine gepflegte Liste; **keiner darf auf dem Katalog- oder Buch-OCR aufsetzen.**

#### ✅ I — ERLEDIGT AM 04.09. (bis auf den Belegsatz, siehe unten)
**Ergebnis:** Der Anhang nannte eine vierte Sichtbarkeit (`~ package`), die Attribut- und
Methodensyntax und die besonderen Klassen — alles in 4.7 ergänzt (Commit 69ddc8c), dann **sechs
Fragen** (M04-200, M04-208 bis M04-212, A3). Vorher gemessen: von 30 Fragen des Themas prüfte
**keine einzige** Sichtbarkeit, Aggregation/Komposition, abstrakte Klasse oder Schnittstelle.
Der Widerspruch Aktivitäts-/Sequenzdiagramm wurde am Seitenbild geprüft und war **keiner** —
BEFUNDE §12. ✅ **Auch der Belegsatz (S.47) ist erledigt: 07.09., kein Befund** — BEFUNDE §16.
**Damit ist Etappe I vollständig geschlossen.**

##### Die ursprüngliche Aufstellung (Belegsatz noch offen)
**Der Anhang (S.41–48) war bis zum 04.09. nie angesehen worden** — er kam erst mit der deutschen
OCR ans Licht. Er enthält nicht Erläuterungen, sondern **Maßstäbe, nach denen geprüft wird:**
* **S.41–42 SQL-Syntax** — AP2, für uns ohne Belang (siehe „was nicht zu tun ist").
* **S.43–45 UML-Notation**: Anwendungsfall-, Klassen- und Sequenzdiagramm, so wie die Prüfung sie
  zeichnet. **Wir haben 32 UML-Fragen** — sie sollten dieselbe Notation verwenden, gerade die mit
  `svg`. **Messpunkt:** Notation der Bildfragen gegen S.43–45 halten, am Seitenbild.
  ⚠️ Der Katalog nennt in Teil 1 „Use Case bzw. Anwendungsfalldiagramm, Klassendiagramm,
  **Aktivitätsdiagramm**" — der Anhang zeigt statt des Aktivitäts- ein **Sequenzdiagramm**.
  **Diesen Widerspruch am Bild prüfen, bevor daraus etwas folgt.**
* **S.46 Präfixe** → eigene Etappe A+.
* **S.47 ein Musterbeleg** (Anschreiben PrintTop GmbH an IT-Solution GmbH). Die Vorbemerkung nennt
  „**einheitliche Belegsätze für alle IT-Berufe**" als Neuerung der 2. Auflage. **Offen: ob unsere
  Fallaufgaben und Firmennamen dazu passen sollten.** Wir führen 260 eigene Firmen-Eigennamen
  (`pool_query.js firmen`) — ein Wechsel auf die Katalog-Firmen wäre ein grosser Eingriff mit
  fraglichem Nutzen. **Erst messen, wie oft Belege in AP1-Aufgaben überhaupt vorkommen.**

#### H — Aufräumen
* **15 MB gerenderte Katalogseiten** liegen in `Buch\_aufbereitung\katalog_seiten\`. Löschen geht
  über die Verbindung nicht — in `_to_delete` verschieben oder vom Nutzer entfernen lassen.
* `Buch\_aufbereitung\bilder\` wächst mit jedem `buch.py bild`. Wegwerf-Ablage, unkritisch.
* **BUILD_LOG-Rotation ist erledigt** (04.09., 879 → 231 Zeilen). Nächste Rotation: nach dem
  Release, nicht erst bei 900 Zeilen.

### Reihenfolge und Begründung
**A vor allem anderen** (der Push entscheidet, ob v1.23.0 überhaupt beim Lerner ist).
**Dann A+**, obwohl es zuletzt gefunden wurde: es ist der einzige Punkt, an dem der Bestand
möglicherweise **falsch rechnet** — alles andere ist Vollständigkeit oder Feinschliff.
Dann **B**, weil zwei unabhängige Messungen auf dieselbe Datei zeigen und es Bestand betrifft, nicht
Zuwachs — die Projektlehre sagt: *das Ziel darf nicht durch Hinzufügen erreicht werden.*
Dann **I** (klein, und es kann A+ und F beeinflussen), dann **D** (klein, sicher, belegt), dann **C**
(das systematische Verfahren, das D überflüssig machen würde, wenn es früher fertig wäre), dann
**F**, dann **E**. **G1/G2** nur, wenn die Messung sagt, dass es billig geht. **H** nebenbei.

### Was in diesem Plan bewusst NICHT steht
* **Ein Handy-Test** — Nutzer-Entscheid 27.07., nie wieder anbieten.
* **Fortschritt-Export/Import** — Nutzer-Entscheid 27.08., wird nicht weiterverfolgt.
* **Der Gerätewert der Startlast** — Entscheid 27.07., wird nicht nachgefragt.
* **Ein `buchbeleg`-Feld im Pool** — Nutzer-Entscheid 03.09.: Verweise bleiben wie bisher, die
  Kursdateien sind das einzige Verweisziel. Buchbelege stehen nur in den Protokollen.
* **Das Lehrbuch als Korrektiv über dem Pool** — B127 hat gezeigt, dass es selbst falsch sein kann.


### aus docs/archiv/PLAENE.md, Zeilen 696-731 der Ur-Fassung

## ✅ DATENGRUNDLAGE „STUFE-3/4-LÜCKEN" (erhoben 2026-09-07, ERLEDIGT 2026-09-08)
> ✅ **NUTZER-ENTSCHEID 07.09.: schließen — je 2 Fragen für die drei AP1-Themen, AP2 ausgenommen
> wie am 26.07.** ✅ **UMGESETZT AM 08.09. in v1.24.0:** M05-111/M05-112 (QM-Begriffe & Normen),
> M05-300/M05-312 (Audit & Prüfverfahren), M01-400/M01-403 (Projektmerkmale & Meilensteine).
> **Nachgemessen:** die drei AP1-Themen stehen jetzt bei 2, 3 und 3 Fragen auf Stufe 3/4; poolweit
> haben nur noch **drei** Feinthemen höchstens eine — und das sind exakt die drei B3-Themen, die
> der Entscheid ausgenommen hat. **Nicht neu anfangen.** ⚠️ Die Tabelle unten ist der Messwert
> vom 07.09. und bleibt als Datenbasis stehen; **der geltende Wert wird gemessen, nicht gelesen.**

**Das Spiegelbild der Stufe-1-Lücken, gemessen an 81 Feinthemen (Pool 1113):**

| Thema | Modul | Gebiet | Fragen | Stufen 1/2/3/4 | AP1? |
|---|---|---|---:|---|---|
| QM-Begriffe & Normen | M05 | A3 | 10 | 2/8/0/0 | ja — **einziges Thema ohne jede Stufe 3/4** |
| Audit & Prüfverfahren | M05 | A3 | 7 | 1/5/1/0 | ja |
| Projektmerkmale & Meilensteine | M01 | A1 | 7 | 3/3/1/0 | ja |
| Kaufmannseigenschaft | M08 | B3 | 8 | 1/6/1/0 | nein (AP2) |
| Arbeitsschutz & Arbeitszeit | M08 | B3 | 6 | 0/5/1/0 | nein (AP2) |
| Aufgabenanalyse & -synthese | M08 | B3 | 5 | 1/3/1/0 | nein (AP2) |

**Warum das den Lerner trifft — dieselbe Mechanik wie 2026-07, nur am oberen Ende:**
`app_seiten.js` hebt die Themenstufe nach drei richtigen Antworten (`stufeFuer`), und
`aufStufeFiltern()` fällt auf die **ganze** Menge zurück, wenn zur Stufe nichts übrig bleibt.
Wer „QM-Begriffe & Normen" durcharbeitet, steigt also auf Stufe 3 **und bekommt dieselben
Einstiegsfragen wieder.** Kein Fehler, aber der Fortschritt läuft leer.
⚠️ **Insgesamt 37 von 324 Zellen (Thema × Stufe) sind leer** — die Tabelle oben ist die Auswahl
mit Handlungsbedarf, nicht die ganze Lücke.

⚠️ **BEIM SCHREIBEN:** M01 1.1 nennt „Meilenstein" in **einer** Zeile und definiert weder
Dauerlosigkeit noch die Formulierungsregel. **Dort auf die Projektmerkmale nach DIN 69901
schreiben** (die stehen vollständig da), nicht auf die Meilenstein-Formulierung — sonst zeigt der
`verweis` auf einen Abschnitt, in dem die Sache nicht steht (B90/B106-Klasse).
M05 5.1 trägt dagegen Zertifizierung (3 Jahre, jährliche Überwachungsaudits), die
Unabhängigkeitsregel des internen Audits und den Satz „die Stichprobe prüft den Prozess, nicht
das Einzelstück" — alles Anwendungsstoff, der im Pool bisher nur auf Stufe 1/2 vorkommt.
