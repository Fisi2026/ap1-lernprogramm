# E3-Probelauf Modul 04 – falsche `verweis`-Ziele (2026-08-24)

**Auftrag:** START_PROMPT Abschnitt 3 Punkt 4 – „Das nächste Probemodul ist M04, nicht M02."
Grundlage war die Heuristik-Verteilung nach dem M01-Lauf: **M04 82 Verdachtsfälle** gegenüber
M03 39 · M07 40 · M06 15 · M02 12 · M01 11 · M05 9.

**Umfang:** alle **191 M04-Fragen**. Davon tragen **183** einen `verweis` mit Abschnittsnummer,
**8** nennen nur ein Thema oder den IHK-Katalog (Fehlerklasse E2, hier nicht behandelt).
Eine weitere – **M04-026** – verweist bewusst nach Modul 01 und blieb unangetastet.

---

## A) Das Ergebnis in einer Zeile

**95 von 183 Verweisen waren falsch = 51,9 %.**

⚠️⚠️ **DAS IST DAS FÜNFFACHE VON M01 (11,0 %) – UND DAMIT IST DIE HOCHRECHNUNG TOT.**
Aus `E3_M01_VERWEISE.md` stammte die Schätzung „rund 90 falsche Ziele poolweit". Allein M04
liefert 95. **Zwei Module, 11 % und 52 %: ein Mittelwert aus diesen beiden Zahlen sagt über
M02, M03, M05, M06 nichts aus.** Die einzige belastbare Aussage ist die je Modul gemessene.
► **Kein drittes Modul mehr hochrechnen – messen.**

## B) Warum M04 so viel schlechter ist als M01

Modul 01 hat **drei** Abschnitte, Modul 04 hat **acht**. Bei drei Abschnitten trifft man auch
durch Raten in einem Drittel der Fälle; bei acht nicht. Dazu kommt, dass die Abschnittsnamen in
M04 dicht beieinanderliegen – „4.3 Bedarfsgerechte Software-Auswahl" klingt für eine
Programmierfrage plausibel, führt aber zu einer Vergleichstabelle Windows/Linux/macOS.

**Die Herkunft der 95 falschen Verweise:**

| war | 4.1 | 4.2 | 4.3 | 4.4 | 4.5 | 4.6 | 4.7 |
|---|---|---|---|---|---|---|---|
| Anzahl | 3 | 21 | **38** | 12 | 13 | 7 | 1 |

**Die häufigsten Übergänge:** 4.3→4.7 (16) · 4.3→4.6 (15) · 4.2→4.5 (11) · 4.5→4.1 (9) ·
4.4→4.7 (6) · 4.3→4.8 (5) · 4.6→4.5 (5).

⚠️ **DIE MEHRHEIT WAR HIER DIE FALSCHE SEITE.** Beim Thema „Programmiersprachen &
Kontrollstrukturen" zeigten **21 Fragen auf 4.3** und nur **8 auf 4.6** – richtig waren die acht.
Bei „ER-Modell & Datenbanken" stand es 5 (4.3, falsch) zu 4 (4.8, richtig).
► **Hätte man nach Mehrheit entschieden, hätte man die richtigen Verweise kaputtgemacht.**
Genau davor warnt `E3_M01_VERWEISE.md` Abschnitt A – in M01 war die Mehrheit zufällig richtig.

## C) Die Abschnitte des Moduls (aus `04_IT-Loesungen_Software_Programmierung.md`)

| Abschnitt | Was wirklich drinsteht |
|---|---|
| **4.1** | Bedarfsanalyse · **Lastenheft vs. Pflichtenheft** · Installation und Einrichtung von Systemen · Praxisbeispiel **IPv6-Konfiguration** · IHK-Aufgabe „private IPv4-Range wählen" |
| **4.2** | **Geräteklassen** · mobile/stationäre Arbeitsplatzsysteme · **Barrierefreiheit** |
| **4.3** | Kategorien Anwendungssoftware · **Betriebssysteme** (Vergleichstabelle) · Standard- vs. Individualsoftware · **Open Source vs. Proprietär** · Beurteilungskriterien · **IDE** |
| **4.4** | Urheberrecht (UrhG) · **Lizenzarten** · Lizenzmodelle · GPL/Copyleft |
| **4.5** | Installation und Konfiguration · **Kommandozeile** · DHCP-DORA · WLAN · VPN · **Konsolenbefehle-Tabelle** · chmod/Dateiberechtigungen |
| **4.6** | Compiler/Linker/Interpreter · prozedural/OOP · Variablen und Datentypen · **Datenstrukturen** · **Kontrollstrukturen** · **Prozeduren und Funktionen** · Klassen · Bibliotheken · Skriptsprachen · Debugging |
| **4.7** | **Pseudocode für Kontrollstrukturen** · **UML** · Bildschirmausgabemasken · **Fehler in Quellcode finden und Schreibtischtest** |
| **4.8** | **ER-Modell** · Kardinalitäten |

## D) Die Entscheide, nach denen korrigiert wurde (Nutzer, 24.08.2026)

1. **Schreibtischtest-/Trace-Cluster (40 Fragen): einzeln nach Inhalt.** Angewandte Regel:
   * Prüft die Aufgabe das **Nachvollziehen oder Modellieren** – Schreibtischtest durchführen,
     UML lesen, Fehler im Pseudocode finden → **4.7** (31 Fragen).
   * Prüft sie **Sprachwissen** – eine Kontrollstruktur bauen, Prozedur vs. Funktion,
     Array-Zugriff → **4.6** (5 Fragen: M04-961, -964, -967, -970, -972).
   ⚠️ **Alle acht `fehlersuche`-Fragen zeigen ein Pseudocode-Snippet und fragen nach der
   fehlerhaften Zeile** – strukturell identisch, aber sieben lagen im Thema „Programmiersprachen"
   und eine im Thema „UML & Schreibtischtest". **Der Themenname war hier der Zufall, nicht der
   Inhalt.** Alle acht gehen nach 4.7.
2. **Lernunterlage-Lücken: Option 1 (überbrücken), wie bisher.**
3. **„IP-Adressierung & Subnetting" (15 Fragen) einheitlich auf 4.1.**

## E) Die neu belegten Lücken der Lernunterlage – gemessen, nicht vermutet

Gezählt wurde die Zahl der Fundstellen im Modultext:

| Begriff | Treffer in `04_*.md` | betroffene Fragen |
|---|---|---|
| **Subnetting / Subnetz / CIDR** | **0** | ~10 (Thema IP-Adressierung & Subnetting) |
| **Such- und Sortieralgorithmen, binäre Suche** | **0** | M04-944, -945, -953, -970 |
| **Rekursion** | **0** | M04-941 |
| **Struktogramm / Programmablaufplan / PAP** | **0** | M04-701 |
| **Modulo** (DIV/MOD) | **0** | M04-050, -947, -951 |
| **Euklid / Fibonacci** | **0** | M04-948, -950 |
| **Eingabevalidierung** | **0** | M04-972 |
| **„Hauptaufgaben eines Betriebssystems"** | **0** | M04-115 |

⚠️ **Damit hat allein Modul 04 acht belegte Lücken** – die START_PROMPT-Liste stand vorher bei
zehn für den ganzen Pool. Alle nach Entscheid Option 1 auf den nächstliegenden Abschnitt gelegt.

## F) Was NICHT geändert wurde – und warum

* **M04-114** (Open-Source-ERP, Vor- und Nachteile) bleibt auf **4.3**. Das Thema heißt zwar
  „Lizenzen & Urheberrecht", die Frage ist aber eine **Auswahlentscheidung** – und „Open Source
  vs. Proprietäre Software" ist eine Überschrift in 4.3. **Der Themenname ist kein Verweisziel.**
* **M04-026** behält den modulübergreifenden Verweis nach Modul 01, Abschnitt 1.3
  (Support-Levels fehlen in Modul 04 ganz). Offener Punkt aus START_PROMPT b2.
* **M04-116** bleibt auf 4.1 – „#### Betriebssystem-Installation" steht dort wirklich.
* **Die 8 Fragen ohne Abschnittsnummer** sind Entscheid E2 und wurden nicht angefasst.

## G) Stand danach

Sechs der zehn M04-Themen zeigen jetzt auf **genau einen** Abschnitt: DHCP & Netzwerkdienste (4.5) ·
ER-Modell & Datenbanken (4.8) · IP-Adressierung & Subnetting (4.1) · Konsolenbefehle & Fehlersuche
(4.5) · Lastenheft & Pflichtenheft (4.1) · WLAN & VPN (4.5).

Die verbliebenen 32 „Ausreißer" der Heuristik sind **alle erklärt**: 21 sind die gewollte Trennung
Methode (4.7) / Stoff (4.6) innerhalb der beiden Programmierthemen, 7 sind Einzelentscheide aus
Abschnitt F, 4 liegen im Mischthema „Praxisszenarien", das naturgemäß streut.
⚠️ **Die Heuristik bleibt damit auch nach einer sauberen Korrektur bei 32 Meldungen** – dieselbe
Beobachtung wie in M01 (11 Fehlalarme nach der Korrektur). **Ein Wächter auf dieser Grundlage
braucht eine Ausnahmeliste.**

## H) Nebenbefund: zwei Themen sind falsch geschnitten, nicht die Verweise

„Programmiersprachen, Kontrollstrukturen & Systemgrundlagen" (43) und „UML & Schreibtischtest" (31) enthalten
beide sowohl Sprachwissen als auch Methodenaufgaben. Die 4.6/4.7-Streuung ist deshalb korrekt
und wird bleiben. **Wer sie beseitigen will, muss die Themen neu schneiden, nicht die Verweise.**
Das ist ein eigener Griff und kein Verweis-Problem.

## I) Werkzeug

Korrigiert wurde mit dem an diesem Tag neu gebauten **`tools/verweis_setzen.py`** (Rezept aus
START_PROMPT: Block von `"id"` bis zur nächsten ID abgrenzen, genau eine Fundstelle, `json.loads`
als Syntaxprobe VOR dem Schreiben, Sicherung nach /tmp, kein `json.dump`).
Auftragsdatei: `tools/migration/e3_m04_verweise_2026-08-24.json` (95 Einträge).
Gemessen wird mit dem neuen **`node tools/pool_query.js verweise [modul]`**.
**Diff: 95 Zeilen geändert, 95 Zeilen entfernt – keine Umformatierung.**
