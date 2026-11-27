# Befunde: Lehrbuch LF1-5 und Prüfungskatalog als externe Prüfmaßstäbe

Runde vom 03.09.2026. Anlass: Das offizielle Ausbildungsbuch liegt digital vor
(Westermann, IT-Berufe Grundstufe, Lernfelder 1-5). Ziel dieser Runde war
**nicht** ein Durchgang, sondern eine **Probe**: taugt ein Abgleich gegen einen
externen Maßstab, und was kostet er?

## 1. Quellenlage - drei Maßstäbe, nicht einer

| Quelle | wo | Reichweite | Verbindlichkeit |
|---|---|---|---|
| **Prüfungskatalog FISI 2024** (2. Aufl.) | `tools/katalog/pruefungskatalog_ocr.txt` | AP1 **und** AP2, LF1-12 | **maßgeblich** für den Prüfungsumfang |
| **Lehrbuch LF1-5** | ausserhalb des Repos, Ordner `Buch` | nur Grundstufe LF1-5 | Lehrmeinung, nicht Prüfungsordnung |
| unser Bestand | `pool/`, `0X_*.md` | AP1 + WiSo | das zu Prüfende |

⚠️ **DAS BUCH IST NICHT DER MASSSTAB FÜR AP1.** Was dort fehlt, ist NICHT
automatisch eine Lücke bei uns - es kann schlicht ausserhalb der Grundstufe
liegen. Wer aus einer Buchlücke einen Befund macht, misst die falsche Sache.

## 2. Der Fund, der mehr wert ist als die Probe

**Der Prüfungskatalog führt die Lernfeld-Zuordnung selbst** - amtlich, im
Wortlaut, Fragenkomplex für Fragenkomplex:

* `06 Umsetzen, Integrieren und Prüfen von Maßnahmen zur IT-Sicherheit und zum
  Datenschutz | **LF4**`
* `02 Informieren und Beraten von Kunden und Kundinnen | **LF1, LF2**`
* `03 Beurteilen marktgängiger IT-Systeme | **LF2, LF3**`
* `05 Durchführen und Dokumentieren von qualitätssichernden Maßnahmen | **LF3, LF5, LF6**`

**Damit muss die Zuordnung Buch <-> unsere Module nicht geschätzt werden.** Sie
hat den Zuschnitt dieser Probe (M06 gegen LF4) nachträglich bestätigt.

⚠️ **Der Katalog liegt in `tools/katalog/`, nicht im Wurzelverzeichnis** -
`.assetsignore` schliesst `tools/**` vom Deploy aus, `*.txt` dagegen NICHT.
Im Wurzelverzeichnis wäre der Prüfungskatalog an den Lerner ausgeliefert worden.

## 3. Probe M06 gegen LF4 - Ergebnis

**Sachfehler in M06 gefunden: null.** Alle prüfbaren Anker halten stand:
ISO 27001 · Art. 32 DSGVO inkl. Abs. 1 und Abs. 4 · Art. 37 DSGVO + § 38 BDSG ·
Schutzbedarf normal/hoch/sehr hoch · Art. 33/34 mit der Feinheit "ab
Bekanntwerden, nicht ab dem Vorfall".

### B126 - Art. 33/34 DSGVO und die 72-Stunden-Frist stehen in KEINER der
### beiden externen Quellen. **Entscheid: stehen lassen.**

Dreifach gegengeprüft, damit es kein OCR-Artefakt ist: im Buch 0 Treffer für
"Meldepflicht", 0 für "Datenschutzverletzung/Datenpanne", von Art. 33-39 nur
Art. 37, "72" nur in Jahreszahlen und Festplattendrehzahlen. Der Katalog bleibt
auf der Ebene *"Einhaltung der **Grundzüge** der Datenschutzgesetze, national und
auf EU-Ebene, z. B. DSGVO, BDSG"* und nennt **keinen einzigen Artikel**.

⛔⛔ **DIE ERSTE MELDUNG DAZU WAR FALSCH, UND ZWAR AUF DIE TEUERSTE ART.**
Gemeldet war "31 von 112 M06-Fragen". Gezählt worden waren **Fundstellen über
alle Felder** - Frage, Erklärung, Distraktorerklärungen zusammen. Nachgemessen:

* **13 Fragen** berühren das Thema überhaupt,
* davon **5 mit echter Prüfsubstanz** (Fakt steht in Frage, richtiger Antwort,
  Musterlösung oder Pflichtbegriffen): **M06-017, M06-024, M06-110, M06-735, M06-739**,
* die übrigen 8 erwähnen es nur in einer Erklärung.

**5 von 112 sind kein Übergewicht.** Der Befund schrumpft auf "fünf Fragen hängen
an einem Detail, das zwei von drei Quellen nicht nennen" - und das Recht stimmt.
►► **Die Lehre ist die alte: den ZÄHLER lesen, nicht die Quote** - und bei einem
Pool-Scan über `json.dumps` zählt man Felder, nicht Fragen. Die Unterscheidung
"Prüfsubstanz gegen blosse Erwähnung" gehört ab jetzt in jede solche Messung.

### Zwei Verdachtsfälle, beide entkräftet - beide hätten Befunde werden können

* **"24 Stunden" neben "72 Stunden" im Lehrtext** sah nach der Fehlerklasse B106
  aus (Lehrtext gegen eigene Frage). Es ist die **gefälschte Frist in einer
  Phishing-Mail** als Lehrbeispiel: "Ihr Konto wird in 24 Stunden gesperrt."
* **Zwei Schutzbedarfs-Skalen im Buch.** S.422 löst es auf: *"Das BSI hat vier
  Schadenskategorien und vergleichbar drei Schutzbedarfskategorien."* Zwei
  verschiedene Dinge, kein Widerspruch.

## 4. Was die Probe über das VERFAHREN sagt

| Verfahren | Kosten | Ertrag bei M06 |
|---|---|---|
| **Anker-Abgleich** (Normen, Paragrafen, Fristen, Zahlen) - maschinell aus dem Pool ziehen, im Buch nachschlagen | ~6 Aufrufe je Modul | trug den einen belegten Befund |
| **Prosa-/Definitionsabgleich** - Lehrtext gegen Buchkapitel lesen | echtes Lesen | 0 zusätzliche Sachfehler, **2 Fehlalarme** |

►► **Empfehlung: den Anker-Abgleich ausdehnen, den Prosa-Abgleich nicht.**
Der OCR-Text erzeugt plausibel aussehende Scheinwidersprüche; beide
Verdachtsfälle waren von dieser Sorte.

## 5. Der Buch-Apparat (ausserhalb des Repos, Ordner `Buch/_aufbereitung/`)

662 Seiten, Volltext, **38 Kapiteldateien**, **183 Abschnitte** Feingliederung mit
Seitenzahl, **849 Stichworte**, **121 Kompetenzchecks**. Werkzeug: `buch.py`
(gliederung · kapitel · wo · seite · bild · suche · stichwort · check · pruefen).

⚠️⚠️ **JEDE SEITE DES BUCHS IST EIN SCAN - DER GANZE TEXT IST OCR**, auch der
Fliesstext (gemessen: ein bildschirmfüllendes Bildobjekt je Seite, null
Vektorobjekte). **Was eine Änderung an unserem Bestand auslöst - Wortlaut, Zahl,
Paragraf, Norm - wird VORHER am Seitenbild bestätigt** (`buch.py bild <seite>`).
Belege: die OCR las im Inhaltsverzeichnis `244` als `44` (drei Fälle), und aus der
farbigen Überschrift "Angemessene Auswahl der Maßnahmen von TOM nach DSGVO und
BSI" wurde `DD Ang A hl der Maßnahmen von TOM nach DSGVO`.

⚠️ **Beim Bau des Apparats lieferte das Werkzeug bei `seite 440` die Buchseite
439** - zwei Seitenkonventionen vermischt. Aufgefallen ist es NUR durch den
Vergleich von Seitenbild und Text derselben Seite. Jede Suche, jeder Beleg wäre
um eins verschoben gewesen. Dagegen steht jetzt **`buch.py pruefen`**: es prüft
an 16 Stichproben, ob jede Seite ihre eigene gedruckte Seitenzahl im Rand trägt.
**Vor jeder Runde einmal laufen lassen.**

## 6. Was daraus für die nächste Runde folgt

* **87 der 121 Kompetenzchecks taugen als Fragen-Vorlage** (17 verweisen auf das
  Arbeitsbuch, das wir nicht haben; 17 sind offene Handlungsaufträge).
* Mehrere davon liegen in LF1-05 "Ausbildungsbetrieb präsentieren" und LF2-10
  "Lieferung, Installation und Übergabe" - also in **Gebiet A4**, unserem
  dünnsten mit 4,98 % bei Schwelle 4,8. **Neue Fragen dort heben den Anteil,
  statt ihn zu senken.**
* ⚠️ **OFFEN UND NICHT GERATEN:** Der Katalogblock "Kunden und Kundinnen in die
  Nutzung von Produkten und Dienstleistungen einweisen" steht auf einer Seite mit
  der Kopfzeile "Teil 2 der Abschlussprüfung". Ob er zu AP1 oder AP2 gehört, ist
  **am Seitenbild zu klären, bevor daraus AP1-Fragen werden.**

---

## 7. Ankerlauf M03 gegen LF2/LF3 (03.09.) — die Richtung war umgekehrt

Zuordnung aus dem Katalog, nicht geschätzt: `03 Beurteilen marktgängiger IT-Systeme und
kundenspezifischer Lösungen | LF 2, LF3`. Gemessen: **201 M03-Fragen**, darin 195 Norm-/
Standardnennungen (34 verschiedene), 186 Raten und Frequenzen, 144 Kapazitätsangaben.

### B127 — DAS LEHRBUCH IST AN DIESER STELLE FALSCH, NICHT UNSER POOL

Buch S.320, Tabelle „Mehrere Normen mit verschiedenen Frequenzbereichen". **Am Seitenbild
bestätigt** (`buch.py bild 320`) — die OCR hatte nichts verrutscht:

| im Buch | tatsächlich |
|---|---|
| `802.11ad` → **„Wi-Fi 6"** | 802.11ad ist WiGig (60-GHz-Band). Wi-Fi 6 ist 802.11ax |
| zwei Zeilen darunter: `802.11ax` → **„Wi-Fi6"** | **das Buch widerspricht sich in derselben Tabelle** |
| `802.11ad` steht **zweimal** in der Tabelle | einmal als „Wi-Fi 6", einmal als „Wireless Systems mit geringer Reichweite" |
| `802.11be` → „Wireless Gigabit, WGIG, MGWS", „60-GHz-Band" | WGIG gehört zu 802.11ad/ay; Wi-Fi 7 arbeitet auf 2,4/5/6 GHz |
| S.161: „Thunderbolt 4 **und 5** | bis 120 Gbit/s" | Thunderbolt 4 schafft 40 Gbit/s |

**Unser Bestand ist an allen diesen Stellen richtig.** `802.11ad` kommt im Pool überhaupt nicht
vor (0 Treffer). M03-013 und M03-613 führen sauber „Wi-Fi 6 = 802.11ax", „Wi-Fi 5 = 802.11ac",
„6 GHz kam erst mit Wi-Fi 6E". M03-904 trennt Thunderbolt 5 präziser als das Buch: 80 Gbit/s
bidirektional, 120 Gbit/s nur im Bandwidth-Boost in eine Richtung.

⛔⛔ **DAS KORRIGIERT DIE ANNAHME, AUF DER DIESE RUNDE GEBAUT WAR.** Das Buch war als Prüfmaßstab
ÜBER unseren Bestand gestellt. In M03 ist es umgekehrt. ►► **Wo Buch und Pool sich widersprechen,
entscheidet die SACHE, nicht die Quelle.** Wer einen Buchsatz ungeprüft als Korrektur in den Pool
trägt, verschlechtert ihn. Das ist ab jetzt die eigentliche Gefahr dieses Verfahrens — grösser als
die, einen Fehler zu übersehen.

⚠️ **Für den Lerner ist das direkt relevant:** Wer mit diesem Buch in der Berufsschule lernt,
bekommt 802.11ad als Wi-Fi 6 beigebracht. Unsere App sagt zu Recht etwas anderes.

### B128 — der Bestand schreibt die Kabelkategorien uneinheitlich

`Cat 6` 8× gegen `Cat.6` 7× · `Cat 7` 2× gegen `Cat.7` 3× · `Cat 5e` 4× gegen `Cat.5e` 2× und
`Cat.5` 1×. Fehlerklasse „der Bestand widerspricht sich selbst", hier in der Schreibweise.

**Gemessen, was daran hängt — VOR jeder Ersetzung:**

| Frage | Typ | Felder mit Cat-Schreibweise | Schreibweise |
|---|---|---|---|
| M03-056 | bild | `optionen`, `svg`, distraktorErklaerungen, erklaerungLang | `Cat 6`, `Cat 7` |
| M03-109 | zuordnung | `paare`, erklaerungLang | `Cat.6` |
| M03-202 | zuordnung | `paare` | `Cat.6` |
| M03-310 | zuordnung | `paare`, erklaerungLang | `Cat.5`, `Cat.5e`, `Cat.6`, `Cat.7` |
| M03-745 | mehrfach | nur Erklärungen | `Cat 6a` |
| M03-909 | szenario2 | nur Erklärung | `Cat 6`, `Cat 7` |
| M03-992 | hotspot | `svg`, `zonen`, Erklärungen | `Cat 5e`, `Cat 6a` |

✅ **Kein `schluesselbegriffe`, kein `luecken`, keine `musterloesung`** — eine Vereinheitlichung
bricht **keine Freitext- oder Dropdown-Prüfung**.
►► **Daraus folgt die Richtung: auf `Cat 6` OHNE Punkt vereinheitlichen.** Die beiden Grafiken
schreiben es bereits so; damit bleiben `svg` und `zonen` unangetastet und es sind nur DREI Fragen
in reinem Text zu ändern (M03-109, M03-202, M03-310). Andersherum müsste man zwei Grafiken samt
Klickflächen nachziehen. ⚠️ **Noch nicht ausgeführt — Nutzer-Entscheid steht aus.**

---

## 8. Ankerlauf M04 gegen LF5 (03.09.) — der Katalog sagt selbst, was gestrichen ist

Der Lauf hat den Pool kaum berührt, dafür die **Vorbemerkung des Prüfungskatalogs** freigelegt
(Seite 3). Sie ist die wichtigste Textstelle, die in dieser Runde gefunden wurde:

> „Insbesondere soll eine verbesserte Trennschärfe zwischen Teil 1 und Teil 2 der Abschlussprüfung
> erreicht werden, z. B. durch **Thematisierung von SQL und RAID ausschließlich in Teil 2** der
> Abschlussprüfung. Manche Themen wurden **gestrafft, gestrichen, wie z. B. Struktogramm und PAP**
> und dadurch Platz geschaffen für neuere Methoden wie **UML oder BPMN** oder neue Themen wie **KI**."

### Nebenbefund, der eine offene Frage schliesst: die Teil-1/Teil-2-Grenze

Im OCR-Text liegt **Teil 1 zwischen Zeile 338 und 1052**, ab **1053 beginnt Teil 2**. Damit ist
belegt, was in Abschnitt 6 noch offen stand: der Block „Leistungsübergabe und Einweisungen planen"
(Zeile 1009) gehört zu **Teil 1** — die zehn A4-Fragen aus v1.23.0 sitzen richtig.
►► **`grep` auf ein Stichwort im Katalog genügt nicht. Immer die nächste vorangehende
Teil-Überschrift mitlesen**, sonst landet AP2-Stoff in einer AP1-Frage.

### B129 — zwei Fragen prüfen gestrichene Themen. ✅ ENTSCHEID 03.09.: STEHEN LASSEN.

| Frage | Teil | Was geprüft wird |
|---|---|---|
| **M04-701** | AP1 | „Benenne die Symbole des **Programmablaufplans (PAP nach DIN 66001)**" — die ganze Frage ist PAP |
| **FALL-09** | AP1 | Dropdown-Lücke mit der **Lösung „Struktogramm"** (Optionen: Klassendiagramm, Struktogramm, Netzplan, Anwendungsfalldiagramm) |

Beides ist Prüfsubstanz, kein Randvorkommen. ⚠️ **Gestrichen heisst nicht falsch** — der Lerner
lernt nichts Unrichtiges, er lernt nur etwas, das nicht mehr geprüft wird. Und die Projektlehre
gilt: **vor jeder Löschung fragen, was daran hängt** — FALL-09 ist ein Fall mit mehreren
Teilaufgaben.
►► **NUTZER-ENTSCHEID 03.09.: beide bleiben unverändert.** Begründung: der Stoff ist nicht falsch,
viele Berufsschulen lehren PAP und Struktogramm weiter, und an FALL-09 hängen mehrere Teilaufgaben.
**Nicht erneut vortragen** — der Befund steht hier, damit ihn keine spätere Runde neu „entdeckt".

### Vier Verdachtsfälle, die NICHT standhielten

* **RAID in drei AP1-Fragen** — alle drei nennen es beiläufig: in M02-735 ist „RAID-Level" eine
  FALSCHE Dropdown-Option (Lösung: „Standardpasswort"), M03-533 ist eine Datenmengen-Rechnung mit
  „(RAID-Lösung)" als Kontextwort, M06-942 führt „Redundante Server (Cluster/RAID)" als Zeile in
  der CIA-Kreuztabelle. **Keine davon thematisiert RAID im Sinne des Katalogs.**
* **SQL in einer AP1-Frage** — M06-738 nennt „SQL-Injection" in einer Security-by-Design-Frage.
  Der Katalog meint mit „SQL" die Abfragesprache (Anhang, SQL-Syntax), nicht den Angriffsnamen.
* **BPMN mit 0 Fragen** — sah nach Lücke aus. Der Katalog nennt BPMN **nur in der Vorbemerkung**,
  in keinem einzigen Inhaltsabschnitt. **Keine belegte Lücke.**
* **SQL mit 0 Fragen in M04** — sah nach Lücke aus, ist aber genau die vom Katalog gewollte
  Trennschärfe. **Unser Pool liegt richtig.**

⛔⛔ **VON FÜNF VERDACHTSFÄLLEN HIELT EINER STAND.** Die Substanzprüfung — steht der Begriff in
Frage, richtiger Antwort, Musterlösung oder Pflichtbegriffen, oder nur in einer Erklärung bzw.
einem Distraktor? — ist damit **kein Zusatz zum Ankerlauf, sondern sein Kern**. Ohne sie hätte
dieser Lauf vier Fehlbefunde produziert und zwei davon hätten zu Änderungen an richtigem Bestand
geführt.

---

## 9. Die beiden „Lehrtext-Lücken" waren keine (04.09.)

Aus dem A4-Lauf blieb stehen: **Verpackungsgesetz und Arbeitssicherheit fehlen in allen
Kursdateien**, obwohl das Lehrbuch beides ausführlich behandelt (LF2, Abschnitte 2.10.2 und
2.10.4). Vor dem Ergänzen des Lehrtextes wurde geprüft, **in welchem Prüfungsteil der Katalog
diese Themen führt**. Ergebnis:

| Begriff | Treffer im Katalog | davon in **Teil 1** |
|---|---|---|
| Arbeitssicherheit · Arbeitsschutz · Unfall | 11 | **0** |
| Gesundheitsschutz | 3 | **0** |
| Umweltschutz · Entsorgung | 8 | **0** |
| Verpackung · ElektroG | **0 im ganzen Katalog** | 0 |
| Ergonomie | 6 | 2 |
| Recycling | 2 | 1 |

Alle Arbeitsschutz- und Umweltthemen stehen unter **„03 Sicherheit und Gesundheitsschutz bei der
Arbeit"** und **„04 Umweltschutz"** — den integrativ zu vermittelnden Berufsbildpositionen, die
in Teil 2 geprüft werden. In Teil 1 steht davon nur, was als **Auswahlkriterium für IT-Produkte**
dient: *„Funktionale, ökonomische und ökologische Aspekte, z. B. Ergonomie, Leistungsparameter,
einmalige und laufende Kosten, Nutzungsdauer, Energieverbrauch, Recyclingfähigkeit"* und
*„Entwurf der Bildschirmausgabemasken (Softwareergonomie, Corporate Identity, Barrierefreiheit)"*.

**Und das ist bei uns abgedeckt:** Ergonomie 22 Fragen (10 mit Prüfsubstanz), Recyclingfähigkeit
6 (5), Green-IT/Energieverbrauch 9 (4), Barrierefreiheit 12 (5). ►► **Keine Lücke, kein Auftrag.**

### ⛔⛔ DIE REGEL, DIE SICH AN EINEM TAG DREIMAL BEWIESEN HAT

**Ein Thema im Lehrbuch ist nicht automatisch AP1-Stoff, und eine Lücke gegenüber dem Buch ist
keine Lücke bei uns.** Dreimal am 03./04.09. sah es nach Handlungsbedarf aus und war keiner:

1. **BPMN** — im Katalog nur in der Vorbemerkung, in keinem Inhaltsabschnitt.
2. **SQL und RAID** — vom Katalog ausdrücklich „ausschliesslich in Teil 2"; unsere 0 Fragen in
   AP1 sind die gewollte Trennschärfe, kein Versäumnis.
3. **Verpackungsgesetz und Arbeitssicherheit** — Teil 2 beziehungsweise gar nicht im Katalog.

►► **Vor jeder Ergänzung: im Katalog nachschlagen, UND die nächste vorangehende
Teil-Überschrift mitlesen.** Ein `grep` auf das Stichwort allein hätte in allen drei Fällen zu
AP2-Stoff in einer AP1-Frage geführt — der teuersten Fehlhandlung dieses Verfahrens, weil der
Gebiets-Wächter sie nicht sieht.

---

## 10. Der Anhang des Prüfungskatalogs (S.41–48) — nie ausgewertet, und er ist ein Maßstab

Aufgefallen erst am 04.09. bei der Vollständigkeitsprüfung des Plans. Der Anhang enthält keine
Erläuterungen, sondern **Vorgaben, nach denen geprüft wird**:

| Seite | Inhalt | Bedeutung für uns |
|---|---|---|
| 41–42 | SQL-Syntax (CREATE TABLE, JOIN, Aggregatfunktionen …) | AP2 — ohne Belang |
| 43–45 | **UML-Notation**: Anwendungsfall-, Klassen-, Sequenzdiagramm | wir haben 32 UML-Fragen |
| **46** | **Dezimal- und Binärpräfixe** | **26 Fragen betroffen — siehe unten** |
| 47 | Musterbeleg (Anschreiben PrintTop GmbH → IT-Solution GmbH) | „einheitliche Belegsätze", offen |

### B130 — Der Präfix-Maßstab des Prüfungskatalogs gegen unseren Pool. ✅ GEPRÜFT 04.09.: KEIN BEFUND.

Der Katalog schreibt auf S.46 wörtlich vor:

> *„Dezimalpräfixe werden bei der Angabe von physikalischen Größen wie Strom, Leistung,
> Geschwindigkeit usw. verwendet. **Binärpräfixe werden bei der Angabe von Datenmengen
> verwendet.** … **Angaben zu Datenmengen sind nur mit Binärpräfixen richtig!**"*

Die Abweichung ist beziffert: **kB/KiB 2,4 % · MB/MiB 4,86 % · GB/GiB 7,37 % · TB/TiB 9,5 %.**

**Gemessen im Pool (04.09.):** 41 Fragen führen Dezimalpräfixe für Datenmengen, **26 davon in der
Prüfsubstanz** — gegen nur **6 mit Binärpräfix**. Schwerpunkt: M03 „Berechnungen: Daten &
Übertragung" (9), **„Datenmengen & Präfixe" (6)**, „Dateisysteme & Software" (5).

⚠️⚠️ **KEIN URTEIL — und hier ist die Verwechslungsgefahr besonders gross.** In *„Eine 2,5 GB grosse
Datei über eine 100 Mbit/s-Leitung"* ist die **Rate zu Recht dezimal** (physikalische Grösse), nur
die **Dateigrösse** müsste binär sein. Und das Thema **heisst** „Datenmengen & Präfixe" — dort kann
die Unterscheidung selbst der Gegenstand sein, also richtig. **Jede der 26 Fragen einzeln ansehen.**
►► **Und wer eine Zahl ändert, zieht die Musterlösung mit** — bei `rechenassistent`-Aufgaben steckt
sie in `variablen`/`formel`. `pool_query.js zufall` vor UND nach der Änderung fahren.

### ✅ Auflösung am 04.09.: alle 26 einzeln angesehen, Klasse (a) ist LEER

| Klasse | Zahl | Beispiele |
|---|---|---|
| **(a) Datenmenge mit falschem Präfix, Konvention nicht genannt** | **0** | – |
| (b) physikalische Grösse oder Kontextangabe → richtig | 15 | RAM „8 GB", FAT32-Grenze „4 GB", „16 GB statt 32 GB" in einer Vertragsfrage |
| (c) die Unterscheidung ist selbst der Gegenstand | 7 | M03-720 bis M03-726, Thema „Datenmengen & Präfixe" |
| (d) präfixneutrale Rechnung in EINER Einheit | 4 | „8 GB × 45 Tage = 360 GB" gilt für GiB genauso |

**Jede echte Rechenaufgabe nennt ihre Konvention ausdrücklich** — M03-951 Schritt 4: *„Rechne die
Byteanzahl in Kilobyte um (**dezimal, 1 KB = 1000 Byte**)"*, M03-761 in der Aufgabenstellung:
*„Rechne konsequent mit DEZIMALEN Präfixen (1 Mbit = 1.000.000 Bit, 1 GB = 1.000.000.000 Byte)"*.

**Und der Pool übt die Binärrechnung sehr wohl:** vier `rechenassistent`-Aufgaben rechnen mit
1024 beziehungsweise 2^n — **M03-953** („Ein Datenträger fasst {gib} GiB. Berechne schrittweise,
wie viel Bit das sind"), M03-726, M03-533, M06-542. Dazu lehrt das Thema „Datenmengen & Präfixe"
die Norm vollständig und korrekt, inklusive der Aussage, dass Übertragungsraten dezimal sind.

►► **Kein Befund, keine Änderung.** Das Abbruchkriterium aus `docs/archiv/PLAENE.md` Etappe A+ greift.
⛔ **Der vierte grosse Verdacht in zwei Tagen, der sich aufgelöst hat** — und der grösste: er sah
nach 26 betroffenen Fragen aus. **Die Substanzprüfung hat wieder alles entschieden.**

### Was die Vollständigkeitsprüfung sonst zutage förderte

Sechs Punkte aus dieser Runde standen **nirgends** und sind am 04.09. nachgetragen worden:

1. **Die Rechte am Lehrbuch** (Nutzer, 03.09., ausdrücklich auch für den Wortlaut) → START_PROMPT §4.
2. **Kein `buchbeleg`-Feld im Pool** (Nutzer-Entscheid 03.09.) → START_PROMPT §4 und PLAENE.
3. **Die 87 verwertbaren Kompetenzchecks** als Vorlagen-Fundus → PLAENE, Etappe D.
4. **Der Anhang des Katalogs** → dieser Abschnitt, PLAENE Etappen A+ und I.
5. **Der alte Kandidat „Wächter Lehrtext ↔ Pool"** (B106-Klasse) war aus dem Plan gefallen →
   PLAENE, Etappe G2.
6. **Die Seitenbild-Regel** stand in START_PROMPT und `buch.py`, aber nicht im Plan → PLAENE, Kopf.

⛔ **Die Lehre daraus:** Ein Plan, der aus dem Gedächtnis einer langen Sitzung geschrieben wird,
verliert die Entscheide, die zwischendurch gefallen sind — gerade die, die etwas VERBIETEN. **Nach
jedem Gesamtplan die Runde gegen die Dateien gegenprüfen**, so wie hier auf Nutzer-Auftrag geschehen.

---

## 11. Etappe B (M03) — beide Verdachtsmomente entkräftet, ein Maß als untauglich erkannt

### Die sechs „leeren Verweise" sind Wortform-Fehlalarme

* **Fünf Fragen verweisen auf „Modul 03, Abschnitt 3.2 – OSI-Referenzmodell"** (M03-472, M03-703,
  M03-970, M03-971, M03-972). Das OSI-Modell **steht dort** — Abschnitt „Netzwerkprotokolle und
  OSI-Modell", ab Zeile 232, mitten in 3.2. Der Lehrtext schreibt „OSI-Modell", der Verweistext
  „OSI-**Referenz**modell". Das Stichwort fehlt, der Stoff nicht.
* **M07-750** verweist auf „7.1 – Gestaltung und Bewertung von SLA-Klauseln", 0 von 3 Stichworten.
  SLA steht in 7.1 (Zeile 40: „Servicevertrag mit SLA", Verfügbarkeit 99,9 %, Lösungszeit). Die
  drei vermissten Wörter sind **„Gestaltung", „Bewertung", „Klauseln" — aus dem Verweistext**,
  nicht aus dem Stoff.

►► **Kein einziger Verweis ist wirklich leer.** `e3_gegenprobe.py --streng` sagt das selbst:
*„Kandidatenfilter, kein Urteil: Wortformen schlagen genauso an wie Lücken."*

### ⛔⛔ „ZEILEN LEHRTEXT JE FRAGE" TAUGT BEI TABELLARISCHEM STOFF NICHT

Das Maß hat am 31.08. M05 zu Recht auffliegen lassen. **Bei M03 führt es in die Irre.**

| Modul | Zeilen/Frage | Zeichen/Frage | Tabellenzeilen |
|---|---|---|---|
| **M03** | **2,3** | **172** | 80 |
| M01 | 3,2 | 208 | 81 |
| M05 | 3,4 | 248 | 48 |
| M07 | 4,8 | 320 | 102 |
| M04 | 5,7 | 321 | 193 |

Je M03-Abschnitt: 3.2 **101 Zeichen/Frage** (30 Fragen auf 30 Zeilen) · 3.3 119 · 3.1 154 · 3.4 371.

**Aber der Inhaltstest widerspricht der Zahl.** Abschnitt 3.2 enthält die vollständige
7-Schichten-Tabelle mit Deutsch, Englisch, Funktion und Beispielen je Schicht, eine Eselsbrücke und
die wichtigsten Protokolle mit Schichtzuordnung und Adresslängen (MAC 48 Bit, IPv4 32, IPv6 128).
**Eine Tabellenzeile trägt fünf Fakten in 80 Zeichen; Fließtext braucht dafür über 300.**
►► **Das Maß zählt Zeilen, nicht Inhalt — und M03 ist das tabellarischste Modul des Projekts.**
**Wer es anwendet, muss danach hinsehen.** Der niedrige Wert ist ein Anlass zur Prüfung, kein Befund.

### Was als Ermessensfrage bleibt

**3.2 ist mit 101 Zeichen/Frage der dünnste Abschnitt des dünnsten Moduls, und 28 Fragen zum Thema
„OSI-Modell & Protokolle" hängen daran.** Ich halte ihn für dicht genug — aber das ist ein Urteil,
kein Messwert. **Ein Ausbau von 3.2 wäre vertretbar, ist aber nicht belegt nötig.**
⚠️ Nutzer-Entscheid steht aus; ohne ihn wird nichts angefasst.

---

## 12. Etappe I — der UML-Teil des Katalog-Anhangs (04.09.)

### Der notierte „Widerspruch" war keiner

Teil 1 nennt drei Diagrammtypen, der Anhang zeigt ein Sequenzdiagramm — das sah nach Widerspruch
aus. **Gemessen:** `Sequenzdiagramm` hat **0 Treffer in Teil 1**, nur Teil 2 (Z.1645) und Anhang.
Der Anhang gilt für den ganzen Katalog, also auch AP2. **Kein Widerspruch.**

**Unsere Abdeckung passt genau zu Teil 1:**

| Diagrammtyp | im Katalog | bei uns |
|---|---|---|
| Anwendungsfall / Use Case | **Teil 1** | 7 Fragen, 1 mit Grafik |
| Klassendiagramm | **Teil 1** | 10 Fragen, 4 mit Grafik |
| Aktivitätsdiagramm | **Teil 1** | 3 Fragen, 1 mit Grafik ← dünnster der drei |
| Sequenzdiagramm | nur Teil 2 | 1 Frage — zu Recht wenig |
| Zustandsdiagramm | nur Teil 2 (FI AE) | 0 — richtig so |

Nebenbei bestätigt: Teil 1 führt unter „07 Programmierwerkzeuge" auch **„Schreibtischtest mit einem
gegebenen Quellcode"** und **„Fehler in einem gegebenen Quellcode finden"** — unser Thema heisst
„UML & Schreibtischtest", und den Typ `fehlersuche` gibt es. Beides abgedeckt.

### Vier Notationselemente ohne Prüfsubstanz — Kandidaten, keine belegte Lücke

Der Anhang S.44 zeigt die Klassendiagramm-Notation der Prüfung im Detail: dreigeteilter Kasten,
`<<interface>>`, abstrakte Klasse kursiv mit `{abstract}`, Sichtbarkeit **`+ public · # protected ·
- private · ~ package`**, Attribut- und Methodensyntax, und die Beziehungen Vererbung (hohles
Dreieck), Assoziation, gerichtete Assoziation, **Aggregation (hohle Raute)**, **Komposition
(gefüllte Raute)**, Implementierung, Multiplizität.

| Element | Erwähnungen | **Prüfsubstanz** |
|---|---|---|
| Klassenkasten, drei Bereiche | 2 | 3 (M04-013, M04-485, M04-563) |
| Multiplizität / Kardinalität | 40 | 7 |
| Interface / Schnittstelle | 7 | 3 |
| Vererbung | 27 | 2 |
| Komposition | 10 | 1 |
| **Sichtbarkeit `+ # - ~`** | 1 | **0** |
| **Assoziation** | 12 | **0** |
| **Aggregation** | 8 | **0** |
| **abstrakte Klasse** | 3 | **0** |

⚠️ **Und wie immer die Teil-Frage:** Teil 1 nennt UML unter *„07 Programmierwerkzeuge kennen und
anwenden können"* nur als drei Diagrammtypen, **ohne Detailnotation**. Die tiefe Modellierung steht
in Teil 2 unter *„02 Planen mit geeigneten Modellen"*. **Der Anhang gilt für beide Teile.**
►► **Urteil: Sichtbarkeitszeichen und Assoziation/Aggregation sind vertretbare Ergänzungen** — ein
Klassendiagramm ist ohne sie nicht lesbar, und der Anhang führt sie als Prüfungsnotation. **Belegt
nötig ist es nicht.** Ermessensfrage, Nutzer-Entscheid. **Nichts angefasst.**

---

## 13. B131 — der Lehrtext verweist auf etwas, das er selbst nicht enthält (04.09.)

**Gefunden beim Ausbau von 3.2, nicht gesucht.** Abschnitt 3.1 schliesst seine Tabelle der
Kopplungselemente mit dem Satz:

> *„**Welcher Schicht des OSI-Modells welches Gerät zugeordnet ist, steht in Abschnitt 3.2** —
> dort geht es um die Protokolle, hier um den physischen Aufbau."*

**In 3.2 stand diese Zuordnung nicht.** Der Lerner, der dem Satz folgt, findet nichts.

⛔ **Kein Wächter sieht das.** `verweis` und `e3_gegenprobe` prüfen ausschliesslich **Pool →
Kursdatei**. Ein Verweis von **Kursdatei → Kursdatei** ist unbewacht. Das ist die Fehlerklasse
B90/B91, nur eine Ebene höher — und sie war bisher nicht bekannt.

### Was der Ausbau von 3.2 belegt nötig machte

Gemessen wurde nicht „der Abschnitt ist dünn", sondern **welche Begriffe die 28 Fragen des Themas
„OSI-Modell & Protokolle" verlangen und in 3.2 nicht vorkommen**. Elf waren es:

| Begriff | Fragen, die ihn führen |
|---|---|
| Switch | 10 |
| Paket | 7 |
| Segment | 6 |
| HTTPS | 5 |
| ARP | 4 |
| DHCP · Handshake | je 3 |
| Gateway | 2 |
| Hub · Repeater · Kapselung | je 1 |

**Ergänzt wurden vier Blöcke**, alle gegen den Pool gegengelesen, damit kein Widerspruch entsteht:
Geräte-Schichtzuordnung (das eingelöste Versprechen aus 3.1, mit der Doppeldeutigkeit von
„Gateway"), die **PDU-Namen** je Schicht plus Kapselung, die Protokolle **ARP, DHCP, HTTPS**, und
der **TCP-Drei-Wege-Handshake**. **3.2 wächst von 30 auf 61 Zeilen, von 101 auf 172 Zeichen je
Frage** — damit auf den Modul-Durchschnitt.
**Gegenprobe:** alle elf Begriffe stehen jetzt in 3.2. `check.sh` grün, Verweis-Ziele unverändert.

### Sechster entkräfteter Verdacht: M03-502

Beim Gegenlesen fiel auf, dass M03-502 „Schicht 3: IP, Router, ICMP, **TCP**" führt — TCP gehört
auf Schicht 4. **Die Frage ist vom Typ `fehlersuche`**: *„Klicke die fehlerhafte Zeile an."* Genau
diese Zeile ist die gesuchte. ►► Die Projektlehre gilt unverändert: **falsche Antwortoptionen sind
absichtlich falsch** — bei der Bewertung nur prüfen, was der Pool als WAHR behauptet.

### Und eine kleine Lücke im UML-Lehrtext, ebenfalls geschlossen

4.7 führte die Sichtbarkeit nur mit `+ - #`. Der Katalog-Anhang nennt **vier**: `+ public ·
# protected · - private · ~ package`. Ergänzt wurden `~ package`, die Attribut- und Methodensyntax
des Katalogs und die besonderen Klassen (**abstrakt** mit `{abstract}`, **Schnittstelle** mit
`<<interface>>` und gestrichelter Implementierungslinie).

---

## 14. Etappe C, Durchsicht: 137 Kandidaten, drei die stehen bleiben (06.09.2026)

`tools/katalog/abdeckung.py` hat 484 Begriffe aus den 33 Themenkreisen gegen den Pool gehalten und
**137 gemeldet** — 90 ohne jede Erwähnung, 47 nur im Nebentext erklärt. Jede Zeile einzeln gelesen.

### Was von den 137 übrig bleibt: drei Kandidaten

**C1 — „Skriptsprachen" als Sprachkategorie (Themenkreis 04/06).** Der Themenkreis heißt
*„Programmiersprachen mit folgenden Merkmalen kennen, einordnen und unterscheiden können"* und
nennt neun Merkmale. **Acht davon prüft der Pool** (Compiler/Linker/Interpreter in M04-010 und
M04-113, prozedural/objektorientiert, Variablen, Kontrollstrukturen, Prozeduren, Klassen,
Bibliotheken, Debugging). **Skriptsprachen nicht.** Die sieben Fragen, die das Wort „Skript"
enthalten, handeln von Lizenzen (M04-008), Konsolenbefehlen (M04-984, M04-997), Risiko (M01-953)
und Nachkalkulation (M07-314) — keine ordnet eine Sprache als Skriptsprache ein.
**Verweisziel vorhanden:** Modul 04, Abschnitt 4.6.
⛔ **NACHTRAG 07.09. (Abschnitt 17): „prozedural/objektorientiert" war NICHT gedeckt.** Der Satz
oben stützte sich auf `--begriff OOP` — und dessen Treffer kamen aus „ko**op**erativ" (M08).
**Gemessen: 0 Fundstellen für `objektorient*` im ganzen Pool.** Geschlossen mit M04-222/M04-223.

**C2 — Die vier Objekttypen der Schutzbedarfsfeststellung (Themenkreis 06/02).** Der Katalog
listet: Anwendungen · IT-Systeme · Räume, Infrastruktur · Kommunikationsverbindungen. Der Pool
prüft den Schutzbedarf gut (7 Fragen mit Substanz: M06-008, M06-030, M06-105, M06-119, M06-203,
M06-950, M06-951 — erster Arbeitsschritt, Kategorien, Maximumprinzip, Kumulation), aber
**„Räume" und „Kommunikationsverbindungen" kommen in keiner Prüfsubstanz vor.** Die Liste als
Liste wird nicht abgefragt. ⚠️ **Dünn, nicht leer** — kleinere Klasse als C1.

**C3 — „Erfüllungsort" und „technische Voraussetzungen" als Kundenvorgaben (Themenkreis 07/03).**
Der Themenkreis selbst ist abgedeckt (eigenes Thema „Onsite/Remote & Nachfolgeaufträge", M07-019,
dazu Fernwartung in M06-051, M07-033, M06-970). Nur die beiden genannten Kundenvorgaben fehlen —
**„Erfüllungsort" hat 0 Fundstellen im ganzen Pool**, auch im Nebentext. ⚠️ **Am dünnsten.**

### Was NICHT stehen bleibt — und warum das die Mehrheit ist

**134 von 137 sind Fehlalarm.** Drei Klassen, alle schon aus früheren Läufen bekannt:

* **Schreibform (die größte Klasse).** „Accesspoint" gegen unsere 32× „Access Point" · „Filesysteme"
  gegen „Dateisystem" (11 Fragen) · „Zweifaktor" gegen „Zwei-Faktor" · „Promoter" gegen „Promotor"
  (M07-204 prüft Promotor, Bremser, Skeptiker und Widerständler zusammen) · „Virenschutz" gegen
  „Malware"/„Schadsoftware" (5 Fragen) · „Medienkompetenz" gegen das Thema „Präsentation & Quellen"
  (6 A4-Fragen) · Beugungsformen wie „IT-Sicherheitsbeauftragtem", „Sicherheitsbewusstseins",
  „Wasserfallmodells".
* **OCR-Rauschen.** „Kl-Software" (KI), „Kommandeozeile", „Befehissyntax", „Schwachstelien",
  „Entgeite", „DatenbankManagementsysteme", „BlendedLearning", „T-Sicherheitsmanagement".
  ⚠️ Diese Wörter bleiben im Katalog-JSON absichtlich stehen — wer sie glättet, hält den geglätteten
  Text irgendwann für den Wortlaut.
* **Kein Fachbegriff.** „Situationsgerechte", „Qualitativer", „Prozedurale", „Benennung", „Auszüge",
  „Motivierte", „Betonung", „Einbeziehung", „Einstellungsmöglichkeiten", „Leistungsdaten".

►► **DAS VERHÄLTNIS IST DER EIGENTLICHE BEFUND: 3 von 137.** Genau wie bei den sechs entkräfteten
Verdachtsmomenten vom 03./04.09. Ein Kandidatenfilter ohne Substanzprüfung hätte hier 137 Änderungen
angestoßen, von denen 134 richtigen Bestand kaputtgemacht hätten.

### Was der Lauf über das Werkzeug gesagt hat

Die Trennung **Prüfsubstanz gegen Nebentext trägt und ist selbst ein Befund.** 47 Begriffe stehen
nur im Nebentext — das heißt: der Pool *erklärt* sie, *prüft* sie aber nicht. Das ist eine andere
Lücke als „kommt gar nicht vor" und wird anders geschlossen. Beispiele mit 0 Substanz und mehreren
Nebentext-Fundstellen: **Personal Firewall** (0S/2N), **Thin Client** (0S/3N), **Netzwerkanbindung**
(0S/2N), **Qualifizierung** (0S/3N, aber „Schulung" 47S). Keiner davon ist für sich ein Auftrag —
aber die Klasse ist notiert.

---

## 15. Ankerläufe M07 und M05 (07.09.2026) — kein Befund, und warum das erwartbar war

Etappe E, mit der vorhergesagten Ausbeute: **null.** Beide Module mechanisch nach Ankern
durchsucht (Paragrafen, Gesetze, Normen, Fristen in der **Prüfsubstanz**), dann im Buch
nachgeschlagen.

### M07 (166 Fragen): 47 Paragrafen-Nennungen, 10 verschiedene — alle richtig

| Zitat | Sache | Urteil |
|---|---|---|
| § 15 Abs. 1 HGB | negative Publizität des Handelsregisters | ✓ |
| §§ 48 ff. HGB · § 49 Abs. 1 HGB | Prokura und ihr Umfang | ✓ |
| § 54 HGB (9 Nennungen) | Handlungsvollmacht | ✓ |
| § 377 HGB | Untersuchungs- und Rügepflicht | ✓ |
| § 433 · § 437 BGB | Kaufvertrag, Mängelrechte | ✓ |
| § 611 · § 631 BGB | Dienstvertrag, Werkvertrag | ✓ |
| § 640 Abs. 3 BGB (4 Nennungen) | Rechte bei Abnahme trotz bekanntem Mangel | ✓ |

⛔ **DAS BUCH KANN M07 GAR NICHT PRÜFEN.** Gemessen: der ganze Band führt **26**
Paragrafen-Nennungen, und nur zwei davon überschneiden sich mit unseren (§ 433, § 634a). Der
Grund steht im Buch selbst (S.262): *„In Lernfeld 8 (kaufmännische IT-Berufe) wird dieses Thema
ausführlich behandelt"* — und LF8 ist nicht Teil dieses Bandes. ►► **Ein externer Maßstab, der
den Stoff nicht führt, ist für diesen Stoff kein Maßstab.** Die zehn Zitate sind deshalb gegen
den Gesetzesinhalt selbst geprüft, nicht gegen das Buch.

**Wo sich Buch und Pool überschneiden, stimmen sie überein:** S.262 („Werkvertragsrecht für
individuell erstellte IT-Systeme, Kaufvertragsrecht für Serienprodukte, Dienstvertrag bei
Stundenlohn ohne vereinbartes Ergebnis") deckt sich wörtlich mit M07-003. § 634a BGB (S.268,
Verjährungsbeginn mit der Abnahme) deckt sich mit M07-306 und M07-005.

**Ein Verdacht geprüft und entkräftet:** Buch S.263 nennt die Beweislastumkehr „im ersten Jahr"
(§ 477 BGB, seit 2022 zwölf statt sechs Monate). Im Pool steht „sechs Monate" in M07-005 — aber
**als DISTRAKTOR**, samt Erklärung, warum er falsch ist. Siebter Fall derselben Art: *falsche
Antwortoptionen sind absichtlich falsch.*

### M05 (68 Fragen): 25 Norm-Nennungen, 4 verschiedene — alle richtig

ISO 9001 (19), ISO 9000 (4), DIN EN ISO 9000/9001 (je 1). Gegen Buch S.55 und S.142 gehalten:
Die Aussagen decken sich (ISO 9000 = Grundbegriffe und Qualitätsgrundsätze, ISO 9001 =
Anforderungen an ein QM-System, Zertifikat drei Jahre gültig).

**Was das Buch führt und wir nicht:** ISO 9241 (haben wir, 4 Fragen), ISO 14000, ISO/IEC 25010,
DIN ISO/IEC 27001 (1 Frage), ISO 50001. ⚠️ **Keine davon steht in Teil 1 des Prüfungskatalogs** —
dort heißt es nur „QS-Normen". ►► **Eine Lücke gegenüber dem Buch ist keine Lücke bei uns.**
Zum vierten Mal dieselbe Regel, zum vierten Mal trägt sie.

### Was daraus folgt

Der Ankerlauf hat über vier Module hinweg geliefert: M06 einen halben Befund, M03 zwei, M04 einen,
**M07 und M05 null.** ►► **DAS VERFAHREN IST AUSGESCHÖPFT.** M01 und M02 werden nicht mehr
gefahren — die Empfehlung im Plan war, sie zurückzustellen; nach diesem Ergebnis werden sie
gestrichen.


## 16. Der Musterbeleg S.47 — der letzte offene Punkt aus Etappe I. ✅ GEPRÜFT 07.09.: KEIN BEFUND.

**Die Frage, die seit dem 04.09. offenstand:** Der Anhang zeigt auf S.47 einen Musterbeleg
(Rechnung der PrintTop GmbH an die IT-Solution GmbH), und die Vorbemerkung nennt „**einheitliche
Belegsätze für alle IT-Berufe**" als Neuerung der 2. Auflage. Sollten unsere Fallaufgaben und die
269 eigenen Firmen-Eigennamen darauf umgestellt werden? Der Plan verlangte: **erst messen, wie oft
Belege in AP1-Aufgaben überhaupt vorkommen.**

### Messung 1 — der Katalog selbst: der Beleg ist kein Inhaltsmaßstab
Gesucht wurde im **gesamten Inhaltsteil** (Zeile 200–3900 des OCR, also Teil 1 UND Teil 2):

| Begriff | Fundstellen im Inhaltsteil |
|---|---|
| Rechnung | 1 — und die heißt „Positionen der eigenen **Entgelt**abrechnung" (WiSo, AP2) |
| Lieferschein · Skonto · Rabatt · Mehrwertsteuer · Umsatzsteuer · Verzug | **je 0** |

**Kein einziger Themenkreis nennt eines dieser Wörter.** Was Teil 1 an dieser Stelle wirklich
verlangt, sind **Angebotsbewertung/-vergleich** und **Vor- und Nachkalkulation** — und die stehen
dort ausdrücklich. Der Beleg selbst kommt nur im Anhang vor.

### Messung 2 — der Anhang ordnet nichts zu, und SQL ist der Gegenbeweis
⚠️⚠️ **AM SEITENBILD GEGENGEPROBT** (S.3, S.41, S.47), weil der ganze Katalogtext OCR ist.
Der Anhang trägt als einzige Kennzeichnung die Kopfzeile „**Anhang**". Darin stehen unbeschriftet
nebeneinander: **SQL-Syntax (S.41)**, UML-Notation (S.43–45), die Präfixtabelle (S.46) und der
Musterbeleg (S.47).
►►► **SQL IST DER GEGENBEWEIS: die Vorbemerkung verortet es ausdrücklich „ausschliesslich in Teil 2".**
**Aus der Anwesenheit im Anhang folgt also keine AP1-Relevanz** — sonst müsste dieselbe Logik
SQL zu AP1-Stoff machen. Der Anhang ist eine Sammlung von Referenzmaterial für alle IT-Berufe und
beide Prüfungsteile, kein Umfangsverzeichnis.
⚠️ Nebenbei: „Belegs**ätze**" (Plural) meint faktisch **einen** Beleg — eine Rechnung. Kein
Angebot, kein Lieferschein als eigenes Dokument, obwohl der Beleg deren Nummern führt.

### Messung 3 — unser Pool: die Inhalte sind da, die Form gibt es nirgends
* **Skonto 37 Fundstellen · Nachkalkulation 38 · Angebotsvergleich 13 · Lieferschein 2.**
  Zahlungsverzug ist seit v1.23.0 als Vertragsstörung des Kunden aufgenommen. **Inhaltlich deckt
  der Pool alles ab, was auf dem Musterbeleg steht.**
* **Gerenderte Belege: null.** Der Scan über alle 96 SVG-Fragen fand zwei Kandidaten (M01-482,
  M03-054) — beide **Fehlalarm**, das Wort „Angebot"/„Beleg" steht dort in anderer Bedeutung.
  Sieben Fragen führen Belegfelder (Nettopreis, Rechnungsbetrag) **im Aufgabentext**, keine als
  Dokument zum Ablesen.

### ✅ NUTZER-ENTSCHEID 07.09.: PUNKT SCHLIESSEN
**Kein Firmenwechsel, keine neue Frage.** Begründung: Es gibt keine belegte Lücke — kein
Themenkreis in Teil 1 verlangt den Beleg, und der Anhang taugt nach dem SQL-Gegenbeispiel nicht als
Nachweis. Ein Wechsel der 269 Firmennamen hätte ohnehin nichts an einem Beleg geändert: **es gibt
keinen.** ⛔ **Nicht erneut vortragen.**
⚠️ **Was ehrlicherweise offenbleibt und trotzdem kein Auftrag ist:** die 2. Auflage kann einen
Beleg als *Aufgabenmaterial* beilegen, und die Form „aus einem Dokument ablesen" übt der Pool
nirgends. **Das ist eine Vermutung über das Aufgabenformat, kein Inhaltsbefund** — und die
Projektlehre sagt: eine Lücke gegenüber einer Quelle ist erst dann eine Lücke bei uns, wenn die
Quelle sie verlangt.

---

## 17. Zweiter Lauf über die Katalog-Restliste (07.09.2026) — zwei Befunde, beide in der eigenen Durchsicht

**Anlass:** kein Plan war offen, also gemessen statt erfunden (START_PROMPT Abschnitt 3).
`tools/katalog/abdeckung.py` meldet **484 Begriffe geprüft · 82 ohne jede Erwähnung · 44 nur im
Nebentext** — dieselbe Messung wie am 06.09. (damals 90/47; der Unterschied ist der Zuwachs aus
den Etappen C, D, F).

### Was Etappe C geschlossen hat — nachgemessen, nicht geglaubt
C1 **Skriptsprache 18 Fundstellen** · C2 **Kommunikationsverbindung 10, Räume 5** ·
C3 **Erfüllungsort 10** (am 06.09.: „0 Fundstellen im ganzen Pool"). **Alle drei sind zu.**

### B139 — „objektorientiert" steht in keiner Frage des Pools
**Fehlerklasse: das Artefakt ist gedeckt, der Begriff nicht** (Klasse B90/B91).

`grep -oiE "objektorient[[:alpha:]]*" pool/*.json` → **0 Fundstellen**, Prüfsubstanz **und**
Nebentext. `prozedur*` gibt es 31-mal, aber ausschließlich als **Unterprogramm** („Prozeduren,
Funktionen"), nie als Paradigma. Die Artefakte dagegen sind reichlich da: **Klassendiagramm 14 ·
Klasse 19 · Objekt 13 · Vererbung 3 · Kapselung 1** (Fragen mit Prüfsubstanz).

⛔ **Das Protokoll vom 06.09. (Abschnitt 14) zählt „prozedural/objektorientiert" ausdrücklich zu
den acht gedeckten Merkmalen von 04/06.** Das war falsch, und der Weg dorthin ist rekonstruierbar:

⚠️⚠️ **`--begriff` MATCHT ALS TEILZEICHENKETTE.** `--begriff OOP` meldet **7 Fragen mit
Prüfsubstanz** — drei davon sind **M08-341, M08-342, M08-345 im Thema „Führung &
Managementtechniken"**, wo „ko**op**erativ" steht. Wer die **Zahl** liest und nicht die
**Trefferliste**, hält OOP für geprüft.
►► **Das ist Lehre 1 vom 07.09. zum zweiten Mal am selben Tag: was ein Werkzeug nicht ausdruckt,
ist nicht geprüft, auch wenn es die Zahl nennt.** Hier nennt es die Zahl sogar falsch.

⚠️ **Der Lehrtext hat den Abschnitt längst** — `04_…md` Zeile 741 „Prozedurale und
objektorientierte Programmierung" plus Praxisbeispiel 1 „Prozedural vs. OOP" (Zeile 945).
**Es fehlte nur die Prüfung.** ►► Deshalb wurde am Lehrtext NICHTS geändert: eine zweite
Darstellung desselben Stoffes hätte nur eine Stelle mehr geschaffen, die driften kann.

**✅ NUTZER-ENTSCHEID 07.09.: zwei Fragen, kein Lehrtext-Eingriff.**
* **M04-222** (mc, Stufe 2) stellt die Herangehensweisen gegenüber — Ablauf/WIE gegen Objekte/WAS.
* **M04-223** (mehrfach, Stufe 3) benennt Klasse, Objekt, Attribut und Methode als das, was sie
  sind, und grenzt die prozedurale Sicht ab.
* Beide **gegen den Abschnitt 4.6 geschrieben, nicht gegen den Fragetext** (Lehre 2 vom 07.09.):
  jede Musterlösung steht so im Lehrtext, Beispielsprachen eingeschlossen.

### B140 — die Unterscheidung IT-Sicherheitsbeauftragter ↔ Datenschutzbeauftragter wurde nie geprüft
**Fehlerklasse: Fehlklassifikation in einer Durchsicht** — und dahinter eine echte Substanzlücke.

Katalog 06/01 nennt sie wörtlich: *„Unterscheidung von IT-Sicherheitsbeauftragtem und
Datenschutzbeauftragtem"*. Gemessen: **Datenschutzbeauftragte(r) 6 Fragen mit Prüfsubstanz** ·
**IT-Sicherheitsbeauftragter genau 1 Fundstelle im ganzen Pool**, und die steht im **Nebentext**
(M06-960).

⛔ Am 06.09. lief „IT-Sicherheitsbeauftragtem" unter **„Beugungsformen"** — der Klasse, in der ein
Kandidat verworfen wird, weil die Grundform vorhanden ist. **Die Grundform war aber ebenfalls
nicht da.** ►► **Eine Fehlalarm-Klasse ist selbst eine Behauptung und braucht denselben Beleg wie
ein Befund.** „Beugungsform" heißt: *ich habe die Grundform gesehen* — wer das nicht nachsieht,
räumt einen echten Befund mit einer plausiblen Vokabel weg.

⚠️ Der Lehrtext hat auch hier alles: `06_…md` Zeile 48, Tabelle mit Schutzgut, Rechtsgrundlage
(Art. 37 DSGVO, § 38 BDSG) und Benennungspflicht — dazu Selbsttest-Frage 2 (Zeile 432).
**Wieder: erklärt, nicht geprüft.**

**✅ NUTZER-ENTSCHEID 07.09.: eine Frage in „TOM & Rechtsgrundlagen"** (Thema stand mit 7 Fragen
auf der Dünn-Liste). **M06-209** (mc, Stufe 2) stellt Schutzgut, Rechtsgrundlage und
Benennungspflicht beider Rollen gegenüber.

### Der Rest der 126 — dieselben drei Fehlalarm-Klassen wie am 06.09.
**Schreibform:** Accesspoint/Access Point (6) · Promoter/Promotor (M07-204 prüft alle vier Typen
zusammen) · Zweifaktor/Zwei-Faktor (2FA 5) · Virenschutz/Malware (3) · Medienkompetenz gegen das
Thema „Präsentation & Quellen" (M02-009 und M02-310 prüfen Quellenbewertung ausdrücklich) ·
ER-Modelle gegen das Thema „ER-Modell & Datenbanken".
**OCR-Rauschen:** Kl-Software · Kommandeozeile · Befehissyntax · Schwachstelien · Entgeite ·
DatenbankManagementsysteme · BlendedLearning (Blended 2, Multiplikator 5).
**Kein Fachbegriff:** Situationsgerechte · Qualitativer · Prozedurale · Benennung · Auszüge ·
Motivierte · Betonung · Einbeziehung · Einstellungsmöglichkeiten · Leistungsdaten.

**Notiert, kein Auftrag** (0 Prüfsubstanz, aber im Nebentext oder unter Nachbarbegriffen gedeckt):
Thin Client (0S/3N, Notebook 24S) · DBMS (0S/2N, Datenbank 19S) · Lautsprecher/Mikrofon (0S/0N,
Screenreader 4S) · Sensibilisierung (0S/0N, Awareness 3S).

►► **DAS VERHÄLTNIS BLEIBT DER BEFUND: 2 von 126.** Und beide sind nicht aus dem Katalog gefallen,
sondern **aus dem Protokoll der letzten Durchsicht**. ►► **Eine Durchsicht ist selbst prüfbar — und
die zweite Runde über dieselbe Liste ist billiger als die erste, weil nur noch die Urteile zu
prüfen sind, nicht die Kandidaten.**
