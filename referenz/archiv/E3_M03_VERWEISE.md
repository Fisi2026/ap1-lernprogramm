# E3-Probelauf Modul 03 – falsche `verweis`-Ziele (2026-08-24)

**Auftrag:** vierter E3-Modullauf nach M01 (11,0 %), M07 (21,2 %) und M04 (51,9 %).
Die Heuristik meldete in M03 **39** Verdachtsfälle – nach M04 der zweitgrößte Posten.

**Umfang:** alle **199 M03-Fragen**. Davon nennen **158** mindestens einen Abschnitt
(134 einen, **24 ausdrücklich zwei oder drei**), **41** keinen (Fehlerklasse E2).

---

## A) Das Ergebnis

**33 von 158 waren falsch = 20,9 %.** Reihe der vier gemessenen Module:
**M01 11,0 % · M03 20,9 % · M07 21,2 % · M04 51,9 %.**

## B) ⚠️⚠️ ZUERST WAR DAS MESSGERÄT FALSCH

Der erste Lauf meldete für M03-611 den **Abschnitt 2.1** – in einem Modul, das nur 3.1 bis 3.4
hat. Der Verweistext lautet „Barrierefreiheit: **WCAG 2.1**, BITV 2.0". Das am 24.08. gebaute
`pool_query.js verweise` las **jede** Zahl der Form `n.m` als Abschnittsnummer.

► **Das ist exakt der Fehlertyp, vor dem START_PROMPT bei „(Option 42)" warnt** – ein Muster,
das auch dort passt, wo es nichts zu suchen hat. **Ein Werkzeug, das am ersten Tag gebaut wird,
ist am ersten Tag noch nicht geprüft.**

**Zweiter Fehler derselben Messung:** **24 Verweise nennen absichtlich MEHRERE Abschnitte**
(„Modul 03, Abschnitt 3.1 und 3.3, Speichermedien und Kenngrößen") – 22 davon in M03. Der Zähler
nahm den ersten und meldete den Rest als Ausreißer. **Das ganze Thema „Datenmengen & Präfixe"
(9 Fragen) sah dadurch falsch aus und war vollständig korrekt.**

**Beides ist behoben:** gezählt wird nur noch, was hinter `Abschnitt(e)` steht; Mehrfachverweise
werden getrennt ausgewiesen und aus der Matrix genommen; Zahlen ohne `Abschnitt` davor werden als
Versionsnummern gemeldet. **Ohne diese Korrektur wären 9 richtige Verweise „repariert" worden.**

## C) Die Abschnitte des Moduls – und die zwei Verwechslungen, die fast alles erklären

| Abschnitt | Was wirklich drinsteht |
|---|---|
| **3.1** | Beurteilungskriterien · **Hardwareprodukte: CPU, Motherboard, RAM, SSD/HDD, Netzteil, GPU, Peripherie, Sensoren – und ausdrücklich „Netzwerkkomponenten": WLAN-Router, Switch, Gateway, Access Point** · Softwareprodukte · Cloudlösungen · KI & virtuelle Desktops |
| **3.2** | **Kommunikationssysteme (Videokonferenz, Social Media)** · Client-Server-Systeme und Domänen · Mobile Geräte · **Netzwerkprotokolle und OSI-Modell** |
| **3.3** | Kenngrößen und Leistungsdaten (**Dateisysteme**, GPU, Durchsatz, **LWL**, **Ethernet-Standards**, **WLAN-Standards**) · **Barrierefreier Zugriff** · **Gütesiegel für Energieeffizienz** · Übertragungsraten und Rechenbeispiele · **Strom, Spannung, Leistung und Energiekosten** |
| **3.4** | Kostenarten · Erwerbsmodelle · Preis-Leistungs-Verhältnis und Angebotsvergleich · Wertschöpfung |

⚠️ **Verwechslung 1: „Netzwerkkomponenten" steht in 3.1, nicht in 3.2.** 3.2 heißt zwar
„Typische IT-Systeme", führt aber Videokonferenz und Social Media – **kein einziges Netzwerkgerät.**
Acht Verweise lagen deshalb falsch.
⚠️ **Verwechslung 2: „WLAN-Standards" und „Übertragungsmedien" stehen in 3.3, nicht in 3.2.**
3.3 heißt „Leistungsfähigkeit und Energieeffizienz" – dass dort die 802.11-Tabelle und der
LWL-Abschnitt liegen, verrät der Titel nicht. **Der Titel eines Abschnitts ist kein
Inhaltsverzeichnis.**

## D) Die 33 Korrekturen

| Ziel | Anzahl | Welche |
|---|---|---|
| **3.2** | **10** | Der komplette OSI-Block: M03-401, -436, -472, -501, -561, -960, -963, -970, -971, -972 – lagen auf 3.1 bzw. 3.4. **OSI kommt im Modul ausschließlich in 3.2 vor.** |
| **3.3** | **11** | WLAN-Standards (M03-201, -202, -905, -906) · strukturierte Verkabelung und Segmentlängen (M03-990, -991, -909) · Datenmengen/Übertragungsdauer (M03-050, -532, -533) · Ergonomie (M03-206) |
| **3.1** | **8** | Netzwerkgeräte und Topologien (M03-961, -973, -977) · CPU/Speicherhierarchie (M03-484) · Hardware (M03-962) · 19-Zoll-Rack (M03-993, -994) · Serverraum (M03-747) |
| **3.4** | **2** | M03-541 · M03-910 – Wirtschaftlichkeit und TCO |
| **3.1 und 3.2** | **2** | M03-964 und M03-933 fragen beide „auf welcher OSI-Schicht arbeitet welche Komponente" – **das braucht beide Abschnitte.** Einer stand auf 3.1, einer auf 3.2; jetzt tragen beide denselben Doppelverweis. |

## E) Was NICHT geändert wurde

* **„Dateisysteme & Software" (5 Fragen) auf 3.3 ist richtig** – die FAT32/NTFS/APFS/ext4-Tabelle
  steht in „Kenngrößen und Leistungsdaten". Sah nach einem Fehler aus, war keiner.
* **„Datenmengen & Präfixe" (9 Fragen)** – Doppelverweis „3.1 und 3.3", korrekt (siehe B).
* **M03-114/-115** (Client-Server, Domäne) bleiben auf 3.2, obwohl ihr Thema „Hardware-Komponenten"
  heißt. **Der Themenname ist kein Verweisziel.**
* **M03-008/-111** (Gütesiegel) und **M03-016** (Energiekosten) bleiben auf 3.3 – beides sind
  Unterabschnitte von 3.3, auch wenn die Themen „Wirtschaftlichkeit" bzw. „Hardware" heißen.
* **M03-611** hat gar keinen Abschnitt (nur „WCAG 2.1") – das ist E2, nicht E3.

## F) Lücken der Lernunterlage (0 Treffer in `03_*.md`)

**Subnetting-Analogon des Moduls:** **Netzwerktopologie** (Stern, Ring, Bus) – 0 Treffer, obwohl
mindestens sechs Fragen danach fragen, drei davon Bildfragen. Weiter: **strukturierte
Verkabelung** (0) · **19-Zoll-Rack / Höheneinheit** (0) · **Serverraum** (0, war bekannt) ·
**Binärpräfixe Kibi/Mebi/Gibi** (0) · **Bildschirmarbeitsplatz nach ArbStättV/BildschArbV** (0).
Alle nach Option 1 auf den nächstliegenden Abschnitt gelegt.
⚠️ **Topologien sind die größte Lücke dieses Moduls** – Stern-Topologie wird in drei Bildfragen
vorausgesetzt und im Text nie erklärt.

## G) Stand danach

Heuristik-Ausreißer **37 → 11**, acht von elf Themen zeigen auf genau einen Abschnitt.
Die verbliebenen 11 sind alle in E begründet – im Wesentlichen die zwei Mischthemen
„Netzwerkkomponenten & Medien" (Geräte 3.1 / Medien 3.3) und „Hardware-Komponenten".
