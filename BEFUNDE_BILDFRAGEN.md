# BEFUNDE — Sichtprüfung der Bildfragen (Stand 2026-09-07)

**Was hier steht:** das Protokoll der vollständigen Durchsicht aller Fragen mit `svg`-Feld —
gerendert, angesehen und einzeln gegen Frage, Lösung und Erklärung gelesen.
**Wozu:** damit die nächste Runde nicht neu misst, was schon geprüft ist. Abschnitt 3 führt
ausdrücklich die Fragen, die geprüft und in Ordnung waren.

⛔⛔ **DIE VIER SVG-WÄCHTER SIND KEIN NETZ FÜR DIESE FEHLERKLASSE.** `pool_query.js svg` prüft
A) Wohlgeformtheit · B) Textüberlauf · C) Elemente in der Zeichenfläche · D) Klickfläche deckt
den Kasten. Für alle 96 Bilder melden sie **null Treffer — vor und nach dieser Runde.**
**Ob das Bild die Frage BEANTWORTET, prüft keiner.** Genau dort lagen B132 (07.09.) und die
vier Befunde dieser Runde. ►► **Wer eine Bildfrage prüft, rendert sie**
(`python3 tools/svg_bilder.py --id <ID>` oder `<MODUL> --von n --bis m`).

⚠️ **`cairosvg` fehlt im Desktop-Arbeitsraum** und ließ `svg_bilder.py` mit
`ModuleNotFoundError` abbrechen. `pip3 install cairosvg` genügt (07.09. gemessen, Netz erlaubt
es dort). **Kein Grund, die Sichtprüfung auszulassen.**

## 1 — Der Bestand

**96 Fragen tragen ein `svg`-Feld**, verteilt auf
M01 21 · M02 2 · M03 42 · M04 11 · M05 4 · M06 8 · M07 7 · M08 1.
Typen: `bild` (mit `mc`, `dropdown`, `lueckentext`), `hotspot`, `beschriftung`.
Gemessen mit `pool_query.js svg` und einem Zähllauf über `fragen.js`; gerendert in 20
Kontaktbögen zu je sechs Grafiken.

⚠️ **Die Klickflächen einer `hotspot`-Frage sind für den Lerner SICHTBAR** — `app_loeser.js`
zeichnet jede Zone als gestrichelten Kasten über das Bild. Eine Hotspot-Frage ist damit faktisch
eine Auswahlfrage über die markierten Stellen; ein Klick daneben löst nichts aus.
**Das ist beim Urteil über „wie viele Zonen braucht ein Bild" mitzulesen.**

## 2 — Die vier Befunde

### B141 — M03-562: drei von vier Beschriftungszielen waren aus dem Bild nicht ableitbar
**Fehlerklasse: das Bild beantwortet die Frage nicht (B132-Klasse).**

„Benenne die nummerierten Komponenten in dieser Stern-Topologie" — das Bild bestand aus **vier
gleichen Kästen** mit den Nummern 1 bis 4. Bestimmbar war allein Nr. 1 (Mitte = Switch).
Client-PC (2), Server (3) und Netzwerkdrucker (4) unterschieden sich durch **nichts**; 2 und 3
lagen sogar spiegelsymmetrisch auf gleicher Höhe. Der Lerner konnte nur raten — und die
Auswertung nannte sein Raten falsch.

**Poolweiter Nachscan der Klasse** (alle 28 `beschriftung`-Fragen, Kriterium: Bild ohne Texte
außer den Nummern UND kein Ordnungssatz im Fragetext): **M03-562 war der einzige Fall.**
Alle anderen tragen entweder unterscheidende Formen (M04-562 Rechteck/Oval/Raute · M04-701
PAP-Symbole · M03-705 Sockel/Slots/Ports · M03-706 Stern/Bus/Ring) oder eine Regel im Fragetext
(M03-960 „oben = anwendungsnah" · M03-991 „1 = arbeitsplatznah" · M04-563 „von oben nach unten" ·
M05-961 „in der Durchlaufreihenfolge" · M03-993 „schwere Geräte unten").

**✅ NUTZER-ENTSCHEID 07.09.: Formen unterscheiden.** Die drei Endgeräte haben jetzt eigene
Silhouetten — Monitor mit Fuß (2), Serverturm mit drei Einschüben und Betriebsanzeige (3),
Drucker mit Papierauswurf (4). Der Switch bleibt der neutrale Kasten in der Mitte.
►► **Das Bild trägt die Frage jetzt selbst; der Fragetext musste nicht nachhelfen.**

### B142 — M04-119: der Fragetext nannte den gesuchten Diagrammtyp
**Fehlerklasse: Lösungswort im Aufgabentext.**

„**Betrachten Sie das Aktivitätsdiagramm.** Welches UML-Diagramm ist dargestellt …?" — die
richtige Option lautete „Aktivitätsdiagramm". Alle drei Distraktoren waren mit dem ersten Satz
erledigt.

⚠️ **Der `verrat`-Wächter (`check.sh` 4e8) fängt das nicht** — er prüft `dropdown`-Lücken,
deren Lösungswort im Aufgabentext steht, nicht `mc`-Optionen.

**Poolweiter Nachscan der Klasse:** Filter über alle `mc`-Fragen — Wörter (ab 6 Zeichen) der
richtigen Option, die im Fragetext vorkommen und in **keinem** Distraktor. **50 Kandidaten,
49 Fehlalarme** (das Szenario nennt den Fachbegriff, den die Antwort aufgreift — z. B. M02-005
„Fachbegriffe", M03-020 „barrierefreie Informationstechnik" → BITV). **Echt war einer.**
►► **Kandidatenfilter, kein Urteil** — die 49 wurden einzeln gelesen.

**✅ NUTZER-ENTSCHEID 07.09.: Fragetext schärfen.** Erster Satz jetzt „Betrachten Sie das
abgebildete Diagramm." Bild, Legende und Optionen unverändert.

### B143 — M01-970: die gesuchte Abkürzung stand im Fragetext UND als Beschriftung im Bild
**Fehlerklasse: Lösungswort im Aufgabentext (Bildvariante).**

„Klicke im Vorgangsknoten das Feld für den frühesten Endzeitpunkt **(FEZ)** an." — das Bild
beschriftet die sechs Felder mit FAZ | Dauer | FEZ / SAZ | GP | SEZ. Frage und Bild nannten
dasselbe Kürzel; es blieb kein Wissensschritt, nur ein Mustervergleich.
**Der Nachbar M01-561 macht es richtig:** dort sind die Felder unbeschriftet und werden benannt.

**Poolweiter Nachscan der Klasse** (Lösungswort steht sowohl im Fragetext als auch im Bildtext,
über alle 96): **9 Kandidaten, 8 Fehlalarme** — geteilt war dort nur ein Allerweltswort
(„Schicht", „Regel", „Support", „Schlüssel", „route"), das die Aufgabe nicht löst.

**✅ NUTZER-ENTSCHEID 07.09.: „(FEZ)" streichen.** Der Lerner muss die Abkürzung jetzt kennen.

### B144 — M01-510: der Meilenstein lag auf keinem Termin
**Fehlerklasse: Bild und Erklärung driften.**

Die Raute stand bei `x=484`. Das Gitter misst 90 px je Woche (Linien 100 · 190 · 280 · 370 ·
460 · 550 · 640), Woche 5 reicht also von 460 bis 550: die Raute lag **im Verlauf von Woche 5**,
während `erklaerungKurz` „am Ende von Woche 5" behauptete. Vorgang C endet bei 460.
⚠️ **Falsch war nichts an der Auswertung** — die Zone deckte die Raute, Wächter D war grün.
**Ein Meilenstein markiert aber einen Zeitpunkt; „irgendwo in Woche 5" ist keiner.**

**✅ NUTZER-ENTSCHEID 07.09.: Raute auf die Wochengrenze.** `x=444` (Mittelpunkt 460 = Grenze
nach Woche 4, direkt hinter Vorgang C), Beschriftung und **Klickzone mitgezogen**
(⛔ sonst zeigt sie ins Leere — die Lehre aus `svg_breiter.py`), Kurzerklärung berichtigt.

## 3 — Angesehen, nachgerechnet, kein Befund

**Damit es niemand zweimal misst.** Bei diesen war die Erklärung nicht nur plausibel, sondern
am Bild nachgerechnet (Gitterweite, Balkenkanten, Balkenhöhen, Adressen):

* **M01-113** — Implementierung liegt über den Tagen 9–13 (fünf Tage, längster Balken, endet
  nach Tag 13), der Meilenstein sitzt exakt auf der Grenze 14/15. Alles wie in der Erklärung.
  ⚠️ **Auf dem Kontaktbogen sah der Balken aus, als reichte er bis Tag 14** — die Zahlen kamen
  erst aus dem SVG. **Ein Kontaktbogen findet Kandidaten, entschieden wird an den Koordinaten.**
* **M01-481 bis M01-487** — die sechs Gantt-Ablesefragen (Dauer, Ende, Lücke, Verschiebung,
  parallele Vorgänge, zwei Zweige mit Puffer): Balkenkanten stimmen mit jeder Angabe der
  Erklärungen überein.
* **M01-002 · M01-054 · M01-471 · M01-990 · M01-991 · M01-992** — Netzpläne: Dauern im Bild
  ergeben die Wege und Puffer der Erklärung.
* **M03-118** — Balkenhöhen sind proportional zu 20 / 28 / 35 / 22 W (Faktor 5,26 ± 0,01).
* **M03-980 · M03-981 · M03-982 · M04-997 · M04-998 · M04-999** — der fehlerhafte Wert ist im
  Bild sichtbar und genau der, den die Erklärung nennt.
* **M03-019/051/052/053/054/056 · M03-3xx · M03-4xx · M03-5xx · M03-7xx · M03-9xx** — Netz- und
  Komponentenbilder tragen ihre Frage.
* **M04-016/485/486/562/563/701/996 · M05-009/487/701/961 · M06-019/120/701/703/961/970/971/972 ·
  M07-009/117/410/411/488/701/960 · M08-335.**

## 4 — Notiert, kein Auftrag

* **M02-005** — das Sender-Kanal-Empfänger-Schema setzt „Störung / Rauschen" an den **Kanal**,
  die richtige Antwort ist eine **semantische** Störung (beim Empfänger). Fachlich ist das die
  übliche Schemadarstellung; wer die Frage neu fasst, kann es schärfen.
* **M03-051** — zeigt sieben OSI-Schichten, hat aber nur **vier** Klickflächen; M03-472 und
  M03-970 bis M03-972 markieren am selben Bildtyp alle sieben. **Uneinheitlich, nicht falsch**
  (vier Zonen = vier Auswahlmöglichkeiten, s. Abschnitt 1).
* **M05-701** — der PDCA-Kreis hat keine Richtungspfeile; die Reihenfolge ergibt sich nur aus
  der Anordnung. Für die Frage (Act anklicken) genügt das.
* **M08-335** — alle drei Lücken sind aus dem Auszug **abzulesen** (Abteilung B, GmbH,
  Einzelprokura). Das ist als Belegleseaufgabe gewollt; **kein Befund**, aber es ist keine
  Anwendungsaufgabe. Bekannt ist auch: **der Aufgabentext steht im `svg`-Feld.**

## 5 — Was die Runde über das Verfahren gelernt hat

⛔⛔ **EIN GRÜNER WÄCHTER IST EINE AUSSAGE ÜBER DAS, WAS ER MISST.** Vier SVG-Wächter, 96 Bilder,
null Treffer — und vier Befunde. **Die Wächter waren nicht falsch, sie waren nicht zuständig.**
⚠️ **DER KONTAKTBOGEN IST DIE MESSHILFE, DAS SVG IST DIE QUELLE.** Zwei Verdachtsfälle dieser
Runde (M01-113, M01-510) sahen auf dem Bogen gleich aus; erst die Koordinaten trennten den
Fehlalarm vom Befund.
⚠️ **JEDER DER DREI FEHLERKLASSEN WURDE POOLWEIT NACHGESCANNT** (Arbeitsregel: ein Sachbefund
ist ein Verdacht auf eine Fehlerklasse). Ergebnis: 1 von 28 · 1 von 50 · 1 von 9.
**Die Filter fanden ihre bekannten Fälle zuerst** — B142 und B143 waren die Gegenprobe mit
bekannter Antwort, bevor die übrigen Kandidaten gelesen wurden.
