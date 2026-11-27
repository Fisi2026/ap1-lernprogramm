# ETAPPE 3 · M03 — BEFUNDE DER BATCH-PRÜFUNG

> ✅ **KORREKTURLAUF ERLEDIGT — siehe Abschnitt G.** Tell-Zähler poolweit **80 → 47 (16,5 %)**,
> M03 von 36 auf 3 (drei Fachbegriff-Grenzfälle bleiben per Nutzer-Entscheid stehen).
> ✅ **ALLE 192 FRAGEN VOLLSTÄNDIG GELESEN (alle Felder).** Die zuletzt offenen 27 Fragen
> (M03-909/910, M03-930 … M03-934, M03-950 … M03-953, M03-960 … M03-964, M03-970 … M03-977,
> M03-980 … M03-982, M03-990 … M03-994) sind am 27.07. nachgeholt worden — **Ergebnis in
> Abschnitt F.2: bis auf eine Umlaut-Stelle ohne Befund.**

**Stand 2026-07-27 · Vorabmessung und Batch-Prüfung vollständig · 192 von 192 Fragen.**

**Fundorte (alle 192):** `pool_m03.json` (157) · `pool_m_g2.json` (7) · `pool_m_transfer.json` (6) ·
`pool_m_ausbau.json` (5) · `pool_m_l4.json` (5) · `pool_m_fehlerbild.json` (3) ·
`pool_m_g2_st4.json` (2) · `pool_m_kreuztabelle.json` (2) · `pool_m_mtf.json` (2) ·
`pool_m_szenario2.json` (2) · `pool_m_lueckenkette.json` (1).
⚠️ Die 157 in der gleichnamigen Datei sind **nicht** das Modul — maßgeblich ist das `modul`-Feld.

**Verteilung:** OSI-Modell & Protokolle 28 · Hardware-Komponenten 27 · Netzwerkkomponenten & Medien 26 ·
Wirtschaftlichkeit & TCO 23 · Berechnungen: Energie 16 · Berechnungen: Daten & Übertragung 13 ·
Cloud & Virtualisierung 13 · Datenmengen & Präfixe 11 · Ergonomie & Barrierefreiheit 9 ·
WLAN & Übertragungsstandards 9 · Dateisysteme & Software 9 · Netzwerk-/Arbeitsplatz-Ausstattung 8.
Typen: mc 54 · dropdown 21 · hotspot 21 · zuordnung 16 · beschriftung 15 · rechenassistent 14 ·
mehrfach 13 · freitext 10 · kalkulation 7 · erklaeren 5 · bild 5 · mtf 3 · kreuztabelle 3 ·
fehlersuche 2 · szenario2 2 · reihenfolge 1.
Stufen: 1→23 · 2→65 · 3→86 · 4→18. Gebiete: **A2 155 · A3 37** (M03 ist das größte A2-Modul).

---

## A · SCHWERE BEFUNDE

### A1 · M03-117 — zwei Energierechnungen, beide um eine Zehnerpotenz falsch
`musterloesung`: „25 Monitore × 6 Jahre × 20 W × 8 h/Tag × 250 Tage = **600 kWh**
Gesamtstromverbrauch; bei 0,30 €/kWh = **180 €** Energiekosten."
Nachgerechnet: 20 W × 8 h × 250 d = 40 kWh je Monitor und Jahr; × 25 × 6 = **6.000 kWh → 1.800 €**.
**Beide Zahlen sind um den Faktor 10 zu klein.**

`erklaerungLang`: „25 ineffiziente 50-W-Monitore × 6 Jahre × 8 h × 250 Tage = **1.200 kWh = 360 €**".
Nachgerechnet: 50 W × 8 × 250 = 100 kWh je Monitor und Jahr; × 25 × 6 = **15.000 kWh → 4.500 €**.
**Faktor 12,5 zu klein.**

Beide Angaben sind in sich stimmig (600 × 0,30 = 180 ✓, 1.200 × 0,30 = 360 ✓) — der Fehler steckt
jedes Mal in der kWh-Summe. Fatal ist die Wirkung auf die Aussage der Frage: Die genannte Ersparnis
schrumpft auf 180 €, tatsächlich sind es **2.700 €** (4.500 − 1.800). Damit belegt die Frage das
Gegenteil dessen, was sie belegen will.
→ Vorschlag: beide Rechnungen auf 6.000 kWh / 1.800 € und 15.000 kWh / 4.500 € korrigieren.

### A2 · M03-118 — Ersparnis in der Merke-Zeile falsch gerechnet
`erklaerungLang`, Merke: „spart die Wahl von A und D etwa **(21 − 12,60) × 25 × 6 ≈ 3.150 €**".
8,40 × 25 × 6 = **1.260 €**, nicht 3.150 €. Die 3.150 € sind 21 × 25 × 6, also die vollen Kosten
von Monitor C — der Differenzbetrag wurde durch den Gesamtbetrag ersetzt.
Die vier Jahreskosten der Frage selbst sind dagegen **alle korrekt nachgerechnet**
(A 12 € · B 16,80 € · C 21 € · D 13,20 €), ebenso die Rangfolge und die Antwort A + D.

### A3 · M03-118 — das Balkendiagramm ist nicht maßstabsgerecht
Die Balkenhöhen selbst vermessen (x-Achse bei y = 400, Höhe proportional zur Wattzahl,
Maßstab aus Monitor A: 6 px je Watt):

| Monitor | Watt | Höhe ist | Höhe soll | Abweichung |
|---|---|---|---|---|
| A | 20 W | 120 px | 120 px | — |
| B | 28 W | **145 px** | 168 px | **−23 px** |
| C | 35 W | **190 px** | 210 px | **−20 px** |
| D | 22 W | 130 px | 132 px | −2 px |

Die beiden hohen Balken sind deutlich zu kurz. Optisch wirkt der Unterschied zwischen 20 W und 35 W
dadurch kleiner, als er ist. Die Zahlen stehen zwar als Beschriftung an den Balken, sodass die Frage
noch lösbar bleibt — aber ein Diagramm, das seinen eigenen Zahlen widerspricht, ist ein Fehler.
→ Vorschlag: Höhen auf 120 / 168 / 210 / 132 px setzen (Beschriftungs-`y` entsprechend nachziehen).

### A4 · M03-116 — Mbps und MB/s gleichgesetzt
`erklaerungLang`: „Durchsatz (**Mbps**): die Datenmenge (z. B. „500 **MB/s** sequenzielle Leserate")."
Mbps sind Megabit pro Sekunde, MB/s sind Megabyte pro Sekunde — Faktor 8. In einem Modul, dessen
halbe Rechenaufgaben genau auf dieser Unterscheidung beruhen (M03-050, M03-102), ist das besonders
schädlich. **M03-102 nennt die Verwechslung ausdrücklich den „häufigsten Prüfungsfehler".**
→ Vorschlag: „Durchsatz (MB/s oder Mbit/s)" und das Beispiel eindeutig als MB/s kennzeichnen.

### A5 · M03-107 — Surge und Sag als Frequenzschwankungen bezeichnet
`erklaerungLang`: „Sie schützt auch vor Spannungsspitzen und **Frequenzschwankungen (Surge, Sag)**."
Surge ist eine Überspannung, Sag ein Spannungseinbruch — beides Spannungs-, keine Frequenzereignisse.
→ Vorschlag: „vor Überspannungen (Surge) und Spannungseinbrüchen (Sag)".

### A6 · M03-202 — zwei Widersprüche INNERHALB derselben Frage
1. `paare`: „802.11ac (Wi-Fi 5): 5 GHz exklusiv, **bis ca. 3,5 Gbit/s**" gegen `erklaerungLang`:
   „802.11ac (Wi-Fi 5, 2013): nur 5 GHz, breite Kanäle (80, 160 MHz), **bis 1.300 Mbit/s**".
   Beide Zahlen sind für sich verteidigbar (Wave 1 gegen Wave 2), aber sie stehen unvermittelt
   nebeneinander in einer Frage.
2. `paare`: „802.11ax (Wi-Fi 6): 2,4 und 5 GHz (**6 GHz als Wi-Fi 6E**)" — richtig. `erklaerungLang`
   derselben Frage: „802.11ax (Wi-Fi 6, 2019): **auch 6-GHz-Band**" — falsch, 6 GHz kam erst mit
   Wi-Fi 6E. **M03-013 hat es an derselben Stelle richtig.**
→ Vorschlag: in der `erklaerungLang` auf 1.300 Mbit/s (Wave 1) bzw. „bis 3,5 Gbit/s (Wave 2)"
   vereinheitlichen und den 6-GHz-Satz auf Wi-Fi 6E einschränken.

### A7 · M03-310 — Cat.5e auf 100 Mbit/s heruntergestuft, im Widerspruch zur eigenen Zuordnung
`paare`: „Cat.5e Twisted Pair: Kupferkabel, **bis 1.000 Mbit/s (Gigabit)**" — richtig.
`erklaerungLang`: „Cat.5e: ältere Installationen (**100 Mbit/s, selten 1 Gbit/s**)" — falsch.
Cat.5e ist genau die Kategorie, die für 1000BASE-T spezifiziert wurde; 100 Mbit/s war Cat.5.
Zusätzlich verkürzt die Zuordnung Cat.6 pauschal auf „bis 55 Meter" — das gilt nur für 10 Gbit/s,
für Gigabit sind es 100 m. **M03-109 formuliert genau das korrekt** („bis 100 m, 10-Gigabit-Ethernet
nur bis ca. 55 m") — die beiden Fragen widersprechen sich also auch untereinander.

### A8 · M03-204 — falsche Begründung für die 4-GB-Grenze von FAT32
`erklaerungLang`: „Die 4-GB-Grenze in FAT32 kommt vom **32-Bit-Cluster-Zeiger**."
Sie kommt vom **32-Bit-Feld für die Dateigröße** im Verzeichniseintrag (2³² − 1 Byte). Der
Cluster-Zeiger bestimmt die maximale Anzahl der Cluster und damit die Partitionsgröße, nicht die
Dateigröße. Die Zahl stimmt, die Begründung ist falsch — und genau die Begründung ist das, was
eine Erklärung leisten soll.

### A9 · M03-307 — erfundene historische Tatsache in der Distraktorerklärung
`distraktorErklaerungen[3]`: „1 Byte hat nicht 10 Bit (**das ist eine alte, nicht mehr gebräuchliche
Einheit**)." Es gab historisch Bytes zu 6, 7 oder 9 Bit — ein 10-Bit-Byte war nie eine Einheit.
Dieselbe Fehlerklasse wie „Quartärdaten" in M02-106: Die Erklärung erfindet eine Kategorie, um
einen Distraktor zu erklären.

### A10 · M03-483 — die Erklärung widerlegt die richtige Antwort
Frage: „Was passiert in dieser Stern-Topologie, wenn **das zentrale Gerät** ausfällt?"
Richtige Antwort: „Alle angeschlossenen Geräte verlieren die Verbindung zueinander." ✓
`erklaerungKurz` bestätigt das ✓. **`erklaerungLang` sagt das Gegenteil:** „Fällt ein Kabel oder
Gerät aus, ist nur dieses betroffen, nicht das ganze Netz. Merke: Das ist der Vorteil der Stern-
gegenüber der Bus-Topologie." Das beantwortet eine andere Frage (Ausfall eines *Endgeräts*) und
liest sich für den Lernenden als Widerspruch zur soeben gegebenen richtigen Antwort.
→ Vorschlag: `erklaerungLang` auf die gestellte Frage umschreiben und den Single Point of Failure
   ausführen; der Vergleich zur Bus-Topologie kann als zweiter Punkt bleiben.


### A12 · M03-533 — „1 GB = 1.024 MB" als Regel, im Widerspruch zum ganzen Modul
`schritte`: „Wandle das Ergebnis in Gigabyte um (**1 GB = 1.024 MB**)" ·
`erklaerungLang`: „Bei Speicherkapazität gilt die **binäre Umrechnung (1 GB = 1.024 MB)**, nicht die
dezimale (1.000 MB)."
Beides ist falsch geschrieben: 1.024 MB sind **1 GiB**, nicht 1 GB. Gravierender ist der Widerspruch
im eigenen Modul — **M03-006, M03-050, M03-101, M03-103, M03-305 und M03-532 rechnen ausdrücklich
dezimal** (1 GB = 1.000 MB), und **der gesamte Lehrblock M03-720 … M03-728 hat genau diese
Unterscheidung zum Thema** und stellt klar: „RAM wird binär angegeben, Massenspeicher und
Übertragungsraten dezimal." Der Lernende bekommt in einer Frage 1.000 und in der nächsten 1.024,
jeweils als verbindliche Regel.
→ Vorschlag: In M03-533 entweder konsequent auf GiB umstellen (Formel `/1024`, Einheit „GiB") oder
   dezimal rechnen (`/1000`, Einheit „GB"). Die Formel selbst muss zur Einheit passen.

### A13 · M03-613 — die Erklärung verschiebt die gesamte Wi-Fi-Nomenklatur um eine Stufe
Richtige Antwort und `erklaerungKurz`: „Wi-Fi 4 = 802.11n; Wi-Fi 5 = 802.11ac; Wi-Fi 6 = 802.11ax" ✓
`erklaerungLang` derselben Frage:
„**Wi-Fi 3 (802.11n)** … **Wi-Fi 4 (802.11ac)** … **Wi-Fi 5 (802.11ax)**" — **alle drei falsch**,
jede um eine Generation verschoben. Damit widerspricht die Erklärung der als richtig markierten
Antwort **und** der eigenen Merke-Zeile („n/ac/ax = 4/5/6") in derselben Frage.
Dazu: „Die IEEE-802.11-Familie wurde **2021** umbenannt" — die Wi-Fi-Generationsnamen führte die
Wi-Fi Alliance **2018** ein.
**Wer die Erklärung liest, lernt genau das Falsche.** Der schwerste Befund des 6xx-Blocks.

### A14 · M03-726 — Platzhalter-Fehler erzeugt sichtbaren Unsinn
`erklaerungKurz`: „OS: Byte / **{tb}^30** ≈ {s3|1} GiB."
`erklaerungLang`, Schritt 2: „1 GiB = **{tb}^30** Byte = {s2} Byte".
Dort muss **2^30** stehen. `{tb}` ist die Herstellerangabe in TB (1–8), also erscheint im gerenderten
Text „1 GiB = **5^30** Byte = 1.073.741.824 Byte".
Die `formel`-Felder sind korrekt (`1073741824`) — nur der Erklärungstext ist kaputt.
⚠️ **Poolweit maschinell geprüft: M03-726 ist der einzige Fall dieser Art.**

### A15 · M03-562 — vier Kästen im Bild, nur drei sind nummeriert
Das SVG enthält **vier** Rechtecke, aber nur drei tragen eine Nummer. Der vierte
(`x=108, y=150, 54×28`) hängt an einer Linie unter dem Switch und bleibt **leer** — er kommt weder
in `ziele` noch in `labels` vor. Der Lernende sieht ein unbeschriftetes Gerät, das er nicht
zuordnen kann und auch nicht soll.
→ Vorschlag: entweder als vierte Nummer aufnehmen (Drucker o. Ä.) oder aus dem SVG entfernen.

### A16 · M03-609 / M03-610 — Berufung auf eine aufgehobene Verordnung
Beide Fragen berufen sich ausdrücklich auf die **Bildschirmarbeitsverordnung (BildschArbV)**.
Diese wurde **2016 aufgehoben**; ihre Inhalte stehen seither im **Anhang Nummer 6 der
Arbeitsstättenverordnung (ArbStättV)**. **M03-117 nennt die ArbStättV korrekt** — das Modul ist
also in sich uneinheitlich. Die fachlichen Richtwerte in beiden Fragen sind richtig.

### A17 · M03-610 — „Beleuchtung von hinten", dreifach widerlegt im eigenen Modul
`paare`: „Indirekte Beleuchtung **von hinten/oben** — keine Lichtquellen direkt im Sichtfeld".
Licht von hinten trifft den Bildschirm und erzeugt genau die Spiegelungen, die vermieden werden
sollen. **Drei andere M03-Fragen sagen es richtig:** M03-206 („Blickrichtung parallel zum Fenster"),
M03-707 („Blickrichtung parallel zum Fenster, gegen Blendung") und M03-708, dessen
Distraktorerklärung ausdrücklich lautet: „Der Bildschirm sollte **quer zum Fenster** stehen."

### A18 · M03-612 — medizinisch unsinnige Angabe im Fragetext
„Ein Mitarbeiter mit Sehbehinderung (**Rotationsmangel**, Sehtafel **1/10 statt normal 1/5**)".
„Rotationsmangel" ist kein augenärztlicher Begriff. Und die Visusangabe ist verdreht: Normalsicht
ist **Visus 1,0**; ein Visus von 1/5 (= 0,2) wäre bereits eine schwere Sehbehinderung und taugt
nicht als Normalwert. Dazu im selben Satz „barrierefreiheit gestalten".
→ Vorschlag: auf eine belastbare Formulierung umstellen, etwa „stark herabgesetzte Sehschärfe
   (Visus 0,1) und leichter Tremor".

### A19 · M03-204 und M03-605 — zweimal dieselbe falsche Begründung
M03-204: „Die 4-GB-Grenze in FAT32 kommt vom **32-Bit-Cluster-Zeiger**."
M03-605: „max. 4 GB pro Datei (**32-Bit-Cluster-Adressierung**)."
Beide Male falsch: Die Grenze stammt aus dem **32-Bit-Feld für die Dateigröße** im
Verzeichniseintrag (2³² − 1 Byte). Der Cluster-Zeiger bestimmt die Zahl der Cluster und damit die
Partitionsgröße. **Nach einem Sachbefund poolweit nachscannen** — hier hat es sich gelohnt.

### A11 · M03-301 — Distraktorerklärung rechnet nicht auf
`distraktorErklaerungen[0]`: „6 W entsteht durch Subtraktion (**24 - 0,5 x 2**), nicht die richtige
Formel." 24 − 1 = 23, nicht 6. Der angegebene Rechenweg führt nicht zum Distraktorwert.
(6 W entstünde etwa aus 24 × 0,5 ÷ 2.)

---

## B · INKONSISTENZEN (geprüfter Teil)

| # | ID(s) | Befund |
|---|---|---|
| B1 | **M03-107 · M03-109** | Verwaiste Firmennamen in der Merke-Zeile: „Bei **Hedderich Apotheken OHG** ist eine USV … Standard" und „Bei **Wintermann Fensterputz GmbH** – Cat.6 im Gebäude". Beide Firmen kommen im Fragetext nicht vor. (M03-115 nennt zwar auch eine Firma, führt sie aber ausdrücklich als Beispiel ein — dort kein Befund.) |
| B2 | **M03-004** | Distraktor 1: „Festplatte B ist schneller, da SSD-Technologie deutlich geringere **Zugriffszahlen** hat." Die **Hauptaussage der Option ist richtig** (B ist schneller), falsch ist nur die Begründung — und die hängt an einem einzigen Wort: Stünde dort „Zugriffs**zeiten**", wäre die Option vollständig korrekt und die Frage hätte zwei richtige Antworten. Sehr wahrscheinlich ein Tippfehler, der zufällig noch falsch ist. |
| B3 | **M03-021 / M03-110** | Beide ordnen die Cloud-Servicemodelle zu. M03-110 ergänzt DaaS, ist also keine echte Dublette — die Überschneidung ist aber groß, und M03-021 (Etappe 4) ist deutlich sauberer formuliert. |
| B4 | **M03-118** | `erklaerungKurz`: „Monitor A (20 W) und D (22 W) … zusammen **42 W durchschnittlich**". 42 W ist die Summe; der Durchschnitt wäre 21 W. |
| B5 | **M03-019** | Im SVG beginnt die Linie zum Internet bei `y=150`, also an der **Oberkante** des Router-Kastens (150–200), und läuft dann quer durch den Kasten nach unten. Kein inhaltlicher Fehler, aber die Verbindung sieht aus, als käme sie aus dem Server-Zweig. |
| B6 | **M03-016** | Ein Router mit „80 PLUS Gold Netzteil" — 80 PLUS ist eine Zertifizierung für PC- und Servernetzteile, nicht für Router. Die Aufgabe selbst (η als bewusster Ablenker) ist gut gebaut und rechnerisch korrekt. |
| B7 | **M03-013 / M03-201 / M03-202** | Für 802.11ac stehen im Modul **drei Zahlen** nebeneinander: „bis zu 3,5 Gbit/s" (M03-013), „bis 1.300 Mbit/s" (M03-201) und beides in M03-202. Für den Lernenden ist nicht erkennbar, welche gilt. |
| B8 | **M03-207** | `erklaerungLang`, Merke: „Für Lengerich **mit 150 Mitarbeitern** ist SaaS wirtschaftlich am sinnvollsten." Die Mitarbeiterzahl steht nirgends in der Frage — dieselbe Klasse wie die verwaisten Firmennamen, nur mit einer Zahl. |
| B9 | **M03-206** | Option 1: „Sitzabstand **mindestens 50–70 cm**" — ein Mindestwert kann kein Bereich sein; gemeint ist ein Sehabstand von 50 bis 70 cm. `erklaerungLang` verlegt außerdem die 20° von der Blickrichtung auf die Monitorhöhe. |
| B10 | **M03-309 · M03-310 · M03-201** | Drei weitere verwaiste Firmennamen in Merke-Zeilen: **Nordhelle Wohnungsbau eG**, **Mertesacker Fleischerei GmbH**, **Doernbach**. Damit sind es fünf im geprüften Teil (mit B1). |
| B18 | **M03-544** | `erklaerungLang`: „Ein Netzteil mit {wirkungsgrad} % ist typisch für **günstigere** PSUs; hochwertige erreichen 90-95 %." Die Variable `wirkungsgrad` läuft bis **94** — bei hohen Werten sagt der Satz, ein 94-%-Netzteil sei „typisch für günstigere PSUs", während „hochwertige 90–95 %" erreichen. **Solche Fehler zeigen sich nur, wenn man die Variablengrenzen mitliest.** |
| B19 | **M03-603** | In der Liste der Gründe **für VMs** steht als Punkt 3: „VMs erlauben genaue Kontrolle von CPU, RAM pro Service; **Container teilen den Kernel und sind feiner-granular**." Der zweite Halbsatz ist ein Argument für Container. |
| B20 | **M03-605** | „NTFS (Windows nativ, auf macOS/**Linux** nur lesend)" — Linux schreibt NTFS seit Kernel 5.15 nativ (`ntfs3`), davor per `ntfs-3g`. **M03-606 formuliert es korrekt** (nur macOS). |
| B21 | **M03-606** | „NTFS: … Dateien bis **16 Exabyte**" — das ist die theoretische Architekturgrenze; implementiert sind 16 TB (bis Windows 8) bzw. 8 PB (Windows 10+ mit 2-MB-Clustern). |
| B22 | **M03-607** | „Journaling gibt es auch in **ext4 (seit 2001)**" — 2001 erschien **ext3**; ext4 kam 2008. |
| B23 | **M03-615** | „Störquellen: … **DECT-Telefone (1,9 GHz)**" — bei 1,9 GHz stören sie das 2,4-GHz-Band gerade **nicht**. Die Aufzählung steht unter der Überschrift der 2,4-GHz-Störer. |
| B24 | **M03-771** | `erklaerungLang`: „Der häufige Fehler in **Option 4**". ⚠️ **Die Optionen werden beim Anzeigen gemischt** (`app_loeser.js:65`) — jeder Verweis auf eine Optionsnummer ist damit fragil. Poolweit betrifft das **18 Fragen**, siehe Abschnitt E. |
| B11 | **M03-303** | Ein Netzwerkdrucker mit **1.000 W über 6 Stunden täglich**. Die Rechnung ist korrekt, die Annahme unrealistisch: Laserdrucker ziehen 1.000 W nur beim Aufheizen, im Druckbetrieb 300–600 W, im Bereitschaftsbetrieb unter 20 W. |

---

## C · SPRACHE (geprüfter Teil)

**C1 · Umlaut-Ersatzschreibung — 17 Stellen im ganzen Modul** (poolweit gescannt, nicht nur im
geprüften Teil):
M03-009 Wirtschafts**pruefung** · M03-010 KdoeR (→ KdöR) · **M03-301 Foerdertechnik** ·
**M03-303 „taeglich" und „jaehrlichen" im FRAGETEXT** · M03-541 Gross**kuechen** ·
M03-701 Ingenieur**buero** · M03-702 Get**rae**nkemarkt · M03-743 Br**ue**gge ·
M03-745 Versicherungs**buero** · **M03-770 Bueroausstattung** · M03-909 Uttersh**ae**user ·
M03-990 Geb**ae**udetechnik · **M03-994 M**ue**nchhausener** · dazu **„waere"/„waeren" in den
Distraktorerklärungen von M03-301 und M03-307**.
⚠️ **M03-994 war beim ersten Scan durchgerutscht**, weil das Suchmuster mindestens zwei Zeichen vor
„ue" verlangte — „**M**uenchhausener" hat nur eines. Nach dem Nachschärfen ist die Liste vollständig
und gegengeprüft.
⚠️ **UND EINE IM SVG: M03-472 beschriftet die unterste Schicht als „Bituebertragungsschicht".**
Der erste Scan hatte das `svg`-Feld ausgeschlossen und den Treffer deshalb übersehen — bei M01
wurden SVG-Beschriftungen mitkorrigiert, hier muss das genauso geschehen.

⛔⛔ **VIER STELLEN, DIE TROTZ „oe/ue/ae" NICHT ANGEFASST WERDEN DÜRFEN:**
* **`schluesselbegriffe` in M03-115** enthält „Dom**ae**nencontroller" und „Dom**ae**nenkonto" als
  **absichtlich hinterlegte Antwortvarianten** für Lernende, die ohne Umlaute tippen — genau wie
  M05-001 und M06-113. Ein „Korrekturlauf" würde die Freitextbewertung verschlechtern.
* **`loesung`, `loesungIndex`, `schluesselbegriffe`** sind **Feldnamen des Schemas**. Ein
  Suchen-und-Ersetzen über den Rohtext trifft sie in fast jeder zweiten Frage.
* **`{hoehe}` in M03-951** ist ein **Variablenname des Rechenassistenten** (`variablen`, `schritte`,
  `erklaerungLang`). Ihn umzubenennen bricht die Formelauflösung — dieselbe Falle wie das Minus in
  `{1-rabatt/100|2}` beim M02-Lauf.
* CSS-Klassennamen im SVG (`valuelabel`) und SVG-IDs (`stoerung`).
**C2 · „ss" statt „ß" — 2 Fragen:** M03-541 **Gross**küchen · M03-742 **Gross**handel.
**C3** M03-018: „RAM ist **Arbeitspeicher**" → Arbeitsspeicher.
**C4** M03-120: „jedoch **hangt** das Ergebnis" → hängt.
**C5** M03-013: „aber nicht **das** neueste Standard" → der neueste Standard.
**C6** M03-005: „modernes **Anschlussstandard**" → moderner Anschlussstandard.
**C7** M03-112: „A: billiger, **alte Garantie**" (gemeint: kurze Garantie) · Distraktorerklärung
„**Tiefere Kosten** bedeuten nicht automatisch **besserer Wert**".
**C8** M03-110: Denglisch-Häufung — „Benutzer **managed** nichts", „**Kundenmanagement** von
Betriebssystem/Apps", „Kundenentwickler **deployt** nur Code, Provider **managed** Infrastruktur".
**C9** M03-116: „Eine Datenbank mit **niedriger IOPS-Speicher**" → mit langsamem Speicher.
**C10** M03-111: „Reduzierung der **Hardwaranzahl**" → Hardware-Anzahl · „recycelbare Materialien
(**Kunststoff statt Einwegmaterial**)" — Kunststoff ist kein Beleg für Recyclingfähigkeit.
**C11** M03-106: Distraktorerklärung „Anwendungen können sich nicht selbst aus Swap-Memory laden."
widerlegt die zugehörige Option nicht.
**C12** M03-005: „10/100/1000 **Mbps**" gegen „Mbit/s" im übrigen Modul.
**C13** M03-201: „Reichweite vs. **Störungsfreihheit**" → Störungsfreiheit.
**C14** M03-202: „kabelgebunden, bis 10 Gigabit, **keine Funk**" → kein Funk.
**C15** M03-206: „Fenster im Rücken erzeugen **Überblendung**" → Blendung bzw. Spiegelungen.
**C16** M03-207: „ohne eigene **On-Premise**-Server" → On-Premises.
**C17** M03-301: „P = U **x** I" und weitere Malzeichen als „x" (M03-303, M03-305, M03-308) —
dieselbe Klasse wie C7 im M02-Lauf. ⚠️ **Erst der Diff bestätigt, dass eine Regex-Normalisierung
vollständig ist** (siehe BUILD_LOG, M02-Lauf).

---

## D · LÄNGEN-TELL — 36 Treffer (Stand VOR jeder Korrektur)

⚠️ **DIESE TABELLE WIRD NACH DEM INHALTSLAUF ÜBERHOLT SEIN** — so war es in M01 und in M02.
**Erst Inhalt und Sprache korrigieren, dann neu messen, dann angleichen.**

Die krassesten Fälle: **M03-201 (3,37 ×)** · M03-002 (2,53 ×) · M03-206 (2,53 ×) ·
M03-712 (2,13 ×) · M03-716 (1,83 ×) · M03-905 (1,79 ×) · M03-107 (1,74 ×) · M03-113 (1,72 ×) ·
M03-770 (1,70 ×) · M03-112 (1,67 ×).
Am unteren Ende: M03-715 (**1,00 ×** — Gleichstand zählt als Treffer) · M03-613 (1,02 ×) ·
M03-004 (1,02 ×) · M03-114 (1,04 ×) · M03-728 (1,05 ×) · M03-773 (1,05 ×) · M03-001 (1,06 ×).

⚠️ **M03-002 ist ein Grenzfall wie M01-117:** Die Optionen sind reine Fachbegriffe
(„Router" 6 Zeichen, „TCP" 3 Zeichen) gegen „Glasfaserkabel (Lichtwellenleiter/LWL)" 38 Zeichen.
Die Ausnahme `MIN_OPTIONSLAENGE = 25` greift nicht, weil die längste Option über der Schwelle liegt.
**Hier ist Länge kein verwertbarer Hinweis — eigener Entscheid nötig.**

Vollständige Liste mit Faktoren: siehe Vorabmessung
(`node tools/pool_query.js` bzw. das Messskript aus dem M02-Lauf).

---

## E · POOLWEITE KLASSEN

* **20 M03-Fragen ohne `verweis`-Feld:** M03-021 … M03-028 (Etappe-4-Block) sowie M03-900 … M03-906,
  M03-930 … M03-934. In M02 wurden die entsprechenden zehn im selben Durchgang ergänzt —
  **hier genauso mitnehmen.**
* Von den poolweit 17 verwaisten Firmennamen außerhalb von M02 liegen **fünf in M03**:
  M03-107 (Hedderich Apotheken OHG), M03-109 (Wintermann Fensterputz GmbH), M03-201 (Doernbach),
  M03-309 (Nordhelle Wohnungsbau eG), M03-310 (Mertesacker Fleischerei GmbH).
  M03-115 führt seine Firma ausdrücklich als Beispiel ein — dort kein Befund.
* **12 M03-Fragen ohne `erklaerungLang`-Feld:** M03-900 … M03-906 und M03-930 … M03-934.
  Poolweit sind es **29** (M03 12 · M04 6 · M06 4 · M07 3 · M01 2 · M05 2).
  ⚠️ **Das ist derselbe Posten, der im M01-Lauf als „im Entscheid enthalten, aber noch nicht
  geschrieben" vermerkt wurde** (`docs/befunde/ETAPPE3_M01_BEFUNDE.md`, Abschnitt H.2) — er ist seither
  unverändert offen. Die betroffenen Fragen haben durchweg eine gute, ausführliche
  `erklaerungKurz`; es fehlt die Vertiefung.
* **18 Fragen mit fragilem Verweis auf Optionsnummern** (die Optionen werden beim Anzeigen
  gemischt): M01-201 („Option 2"), M02-771 („Option 5"), M03-771 („Option 4") sowie systematisch
  M05-700/705/706/707, M07-028/033/042/700/704/705/706 und M08-700 … M08-703, die in der
  `erklaerungLang` alle Optionen als „Option 0" bis „Option 5" durchzählen.
  ⚠️ **M01-201 und M02-771 sind bei den bereits gelaufenen Korrekturläufen durchgerutscht** —
  die Klasse war in M01 erkannt, aber nur in den damals angefassten Feldern bereinigt.


---

## F · GEPRÜFT UND SAUBER (M03-001 … M03-120)

**Alle Rechenaufgaben des geprüften Teils selbst nachgerechnet — bis auf A1 und A2 alle korrekt:**
M03-006 (200 s) · M03-007 (60 €) · M03-009 (2.300 / 2.400 EUR) · M03-016 (600 kWh, η bewusst als
Ablenker) · M03-050 (480.000 Mbit · 4.800 s · 1,33 h / 1.920 s · 0,53 h) · M03-055 (22.800 / 28.800) ·
M03-101 (36 MB) · M03-102 (100 Mbit/s) · M03-103 (600 KB) · M03-104 (840 W) · M03-105 (32 Threads) ·
M03-118 (12 / 16,80 / 21 / 13,20 €) · M03-119 (577,50 €) · M03-120 (2.690 / 2.400 EUR).

**Die vier Stufe-4-Aufgaben aus Etappe 6 einzeln durchgegangen** — M03-051 (Schicht 7 aus dem
Rückschluss auf das, was noch funktioniert), M03-052 (VLAN am Switch, nicht an der Firewall),
M03-053 (Kapselung Ethernet → IP → TCP → HTTPS), M03-056 (100-m-Grenze inklusive Patchkabel):
**fachlich einwandfrei und didaktisch die besten Fragen des Moduls.**

**Ohne Befund:** M03-001, -002, -003, -005, -008, -011, -012, -014, -015, -017, -021 bis -028,
-050 bis -056, -108, -109 (bis auf B1), -114, -115, -119.

**Der Etappe-4-Block M03-021 … M03-028 ist durchweg sauber** — keine Tells, tragfähige Distraktoren,
ausführliche und korrekte Erklärungen. Einziger Mangel: das fehlende `verweis`-Feld (Abschnitt E).
Wie in M01 und M02 konzentrieren sich die Befunde im **Altbestand M03-101 … M03-120**.

---

---

## F.2 · DIE 27 NACHGEHOLTEN FRAGEN — EIN EINZIGER BEFUND

Am 27.07. vollständig gelesen: M03-909, M03-910, M03-930 … M03-934, M03-950 … M03-953,
M03-960 … M03-964, M03-970 … M03-977, M03-980 … M03-982, M03-990 … M03-994.

**Einziger Befund: M03-994 „Muenchhausener Netzwerktechnik GmbH"** (Umlaut, siehe C1).

**Alles Übrige nachgerechnet und geprüft — ohne Befund:**
* **M03-910** (szenario2, TCO): A = 20 × 620 = 12.400 € + 1,2 kW × 2.000 h × 0,30 € × 5 J =
  3.600 € → **16.000 €**; B = 14.000 € + 1.800 € → **15.800 €**; Differenz **200 €** bei
  1.600 € höherem Anschaffungspreis. **Alle sechs Zwischenwerte stimmen.**
* **M03-909** (szenario2, 120-m-Strecke): 100-m-Grenze, Zwischenverteiler oder LWL ✓. Die
  Distraktoren sind fachlich sauber widerlegt („eine Kupplung teilt die Strecke nicht auf").
* **M03-930 / M03-931** (mtf): alle acht Wahr/Falsch-Aussagen korrekt bewertet, auch die
  hintergründige („Die abgegebene Leistung eines Netzteils wird in Volt angegeben" = falsch).
* **M03-932 / M03-933** (kreuztabelle): Lösungsmatrizen Zelle für Zelle geprüft —
  IP=L3, TCP=L4, HTTP=L7, UDP=L4, DNS=L7 ✓ · Hub=L1, Switch=L2, Router=L3, Repeater=L1 ✓.
* **M03-950 … M03-953** (rechenassistent): alle Formeln korrekt.
  ⚠️ **M03-953 ist der saubere Gegenpol zu A12**: Es rechnet konsequent GiB → MiB → KiB → Byte mit
  Faktor 1.024 und **nennt die Einheiten auch GiB/MiB/KiB**. Genau das, was M03-533 falsch macht,
  wenn es 1.024 MB „ein GB" nennt. Die Vorlage für die Korrektur steht also im eigenen Modul.
* **M03-960 … M03-964** (beschriftung): TCP/IP-Vierschichtenmodell, Topologien, PC-Komponenten,
  Protokoll- und Geräte-Zuordnung — alle `ziele` und Distraktor-`labels` korrekt.
* **M03-970 … M03-977** (hotspot): alle acht Zonen richtig gesetzt.
* **M03-980 / M03-981 / M03-982** (hotspot, ipconfig-Fehlersuche): **alle drei fachlich einwandfrei
  und die stärksten Fragen des Blocks.** Gateway 192.168.20.1 in einem /24-Netz 192.168.10.0 ✓ ·
  Maske 255.255.0.0 gegen dokumentiertes /24 ✓ · DNS-Server auf 192.168.40.255, der
  Broadcast-Adresse des Netzes ✓.
* **M03-990 / M03-991 / M03-993** (strukturierte Verkabelung, EN 50173): Primär-/Sekundär-/
  Tertiärbereich ✓ · Anschlussdose → Patchpanel → Switch mit 90-m-Grenze ✓ · Rack-Reihenfolge
  mit der USV unten aus Stabilitätsgründen ✓.
* **M03-992 / M03-994** (hotspot): 250 m → LWL ✓ · 42 HE − (2+1+1+4+3) = **31 HE** ✓.

**Damit bestätigt sich das Muster aus M01 und M02 ein drittes Mal:** Die Fragen aus den Etappen 4
bis 6 (hier die kompletten Bänder 9xx) sind durchweg sauber. **Alle 19 schweren Befunde liegen im
Altbestand M03-101 … M03-616.**

## ✅ FREIGABE UND NÄCHSTER SCHRITT

**Nutzer-Entscheid 27.07.2026 — alles freigegeben:**
* **A1–A19 wie vorgeschlagen**, M03-533 wird dabei auf **dezimal** umgestellt (1 GB = 1.000 MB,
  Formel `/1000`) — passend zum Lehrblock M03-720 … M03-728 und zu M03-953.
* **B1–B24 vollständig**, einschließlich der fünf verwaisten Firmennamen, der erfundenen
  „150 Mitarbeiter" in M03-207 und der Optionsverweise (auch **M01-201 und M02-771**, die bei den
  früheren Läufen durchgerutscht sind).
* **C1–C17 komplett** — Feldnamen, `{hoehe}` und die `schluesselbegriffe` von M03-115 bleiben
  unangetastet.
* **`verweis` in den 20 M03-Fragen** ohne dieses Feld.
* **Die 36 Längen-Tells zuletzt**, nach dem Inhaltslauf **neu gemessen**.
* **Die 29 fehlenden `erklaerungLang` poolweit** werden nachgetragen — ⚠️ als **eigener Griff**,
  nicht im selben Lauf: Das ist Schreibarbeit an 29 Fachtexten, keine Korrektur.

**Reihenfolge im Korrekturlauf: Inhalt → Sprache → neu messen → Längen**, wie in M01 und M02
bewährt. Backup nach `/tmp/pool_backup`, Rohtext-Ersatz mit Eindeutigkeitsprüfung je Treffer,
`json.loads` als Syntaxprobe vor dem Schreiben, danach Build → Drift 0 → Suiten → Diff lesen.

---

## G · KORREKTURLAUF AM 27.07.2026 — ERLEDIGT

**Reihenfolge wie festgelegt: Inhalt → Sprache → NEU MESSEN → Längen.**

### Umgesetzt

| Block | Umfang |
|---|---|
| Schwere Befunde | **19 Korrekturen** (A1–A19). Vier Erklärungen komplett neu geschrieben: M03-483 (Single Point of Failure statt Endgeräte-Ausfall), M03-613 (Wi-Fi-Nomenklatur), M03-533 (dezimal), M03-612 (medizinische Angabe). |
| Bildgeometrie | **M03-118**: Balkenhöhen auf 120/168/210/132 px gesetzt (6 px je Watt), Beschriftungs-`y` mitgezogen. **M03-562**: der vierte, unbeschriftete Kasten hat jetzt die Nummer 4, `ziele` und `labels` entsprechend ergänzt (Netzwerkdrucker). |
| Inkonsistenzen | **B1–B24**, darunter fünf verwaiste Firmennamen, die erfundenen „150 Mitarbeiter" in M03-207 und die fragilen Optionsverweise — **auch M01-201 und M02-771**, die bei den früheren Läufen durchgerutscht waren. |
| Sprache | **17 Umlaut-Stellen** (inkl. „Bituebertragungsschicht" im SVG von M03-472 und „taeglich/jaehrlichen" im Fragetext von M03-303), 2× „Gross" → „Groß", Grammatik, ×/− statt x/-. |
| Felder | **`verweis` in 20 Fragen** ergänzt (M03-021 … M03-028 und die 9xx-Blöcke). |
| Längen-Tell | **91 Optionen** in 32 Fragen verlängert. |

### Der Längen-Tell

✅✅ **TELL-ZÄHLER POOLWEIT 80 → 47 (28,1 % → 16,5 % von 285).** Nenner unverändert 285.
**M03: 36 → 3.**

⚠️ **DIE VORAB-TABELLE WAR WIEDER ÜBERHOLT — zum dritten Mal in Folge.** Aus 36 Treffern waren
nach dem Inhaltslauf **35** geworden: **M03-004 hatte sich durch die inhaltliche Umformulierung des
Distraktors von selbst erledigt**, und M03-206 war von 2,53 auf 2,42 gerutscht.

⛔ **DREI TREFFER BLEIBEN ABSICHTLICH STEHEN (Nutzer-Entscheid 27.07.):**
* **M03-001** (OSI-Schichtnamen) und **M03-002** („Router" 6 Zeichen, „TCP" 3 Zeichen gegen
  „Glasfaserkabel (Lichtwellenleiter/LWL)" 38) — reine Fachbegriffe.
* **M03-020** („BITV (Barrierefreie-Informationstechnik-Verordnung)") — die Länge steckt im
  ausgeschriebenen Eigennamen.
Derselbe Fall wie **M01-117**: formal ein Treffer, didaktisch keiner. **Nicht erneut vortragen.**
**M03-715** dagegen war reiner Gleichstand (31 gegen 31) und ist mit einem Wort behoben.

### Prüflauf (alles selbst gefahren)

* `build_fragen.py` → **1073 Fragen**, 9 Fälle — Pool-Größe unverändert ✓
* **Drift 0** (zweiter Build byte-identisch) ✓
* `validate_pool` (74 Themen) · `idcheck` · `validate_schema` · `fakten_check.py` (0) ✓
* Wächter: **A4 44 = 4,95 %** (Schwelle 4,8) · **Stufenlücken 0** · Feinthemen **74** ·
  **M03 ohne `verweis`: 0** ✓
* 20 Suiten auf Sollwert: logik 2158 · rechner 123 · themenauswahl 81 · diagnose 76 · gantt 73 ·
  engine 70 · rechnen 64 · unterricht 64 · note 55 · adaptiv 49 · stufen 46 · freitext 38 ·
  didaktik 32 · wirtschaft 32 · matrix 31 · liniensysteme 29 · glossar 24 · render_smoke 21 ·
  abk 20 · teilpunkte 19

### ⚠️ Beim Diff-Lesen und beim Nachscannen geprüft

* **Vier automatische Treffer waren Fehlalarme** und wurden von Hand widerlegt statt „korrigiert":
  M04-114 („150 Mitarbeitern" steht dort im **Fragetext**), M04-317 („**DHCP-Option 42**", kein
  Optionsverweis), M03-561 (die Schichtnummern stehen im Text „Schicht 7", nicht als eigene Marke)
  und M03-701 (die DIMM-Zone ist bewusst eine Sammelfläche über vier schmale Rechtecke).
* **Formelsyntax nachgeprüft:** kein Minuszeichen innerhalb von `{…}` verändert, `{hoehe}` in
  M03-951 unversehrt, `schluesselbegriffe` von M03-115 mit „Domaenencontroller" unangetastet.
  `test_rechner` (123) bestätigt das.

### OFFEN GEBLIEBEN — gehört nicht zu dieser Freigabe

* **M06-542** trägt denselben Fehler wie A12: „1 GB = 1.024 MB". Beim M06-Nachlauf mitnehmen.
* **14 Fragen mit Optionsverweisen** in M05, M07 und M08 (systematisch „Option 0" bis „Option 5").
* **Die 29 fehlenden `erklaerungLang`** poolweit — als eigener Griff freigegeben, nicht Teil
  dieses Laufs.

### Kein Bump, kein Release
`APP_VERSION`, `sw.js` und `CHANGELOG` sind unberührt — der Bump gehört ans Ende von Etappe 3,
wenn auch M07 und M08 durch sind.
