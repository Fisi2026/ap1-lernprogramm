# ETAPPE 3 · M07 — BEFUNDE DER BATCH-PRÜFUNG

> ✅ **ALLE 133 FRAGEN VOLLSTÄNDIG GELESEN — alle Felder, alle 21 Tell-Treffer gesichtet.**
> ✅✅ **KORREKTURLAUF ERLEDIGT (28.07.2026) — siehe Abschnitt H.**
> **Tell in M07: 21 → 1. Poolweit: 47 → 27 = 9,5 % bei unverändertem Nenner 285.**
> Alle Entscheide aus Abschnitt E sind eingeholt und umgesetzt. Die 50 `verweis`-Felder bleiben
> per Nutzer-Entscheid **absichtlich offen** — eigener poolweiter Griff über alle Module.

**Stand 2026-07-28 · Vorabmessung und Batch-Prüfung vollständig · 133 von 133 Fragen.**

**Ergebnis in Zahlen:** 24 schwere Befunde (A1–A24) · 17 mittlere (B1–B17) · 38 Sprach- und
Konsistenzpunkte (C1–C38) · 8 poolweit nachgescannte Fehlerklassen · 3 entkräftete Verdachtsfälle ·
3 Funde für andere Module (Abschnitt F) · 10 Entscheide (Abschnitt E).

---

## 0 · VORABMESSUNG (gemessen, nicht übernommen)

**133 Fragen nach dem `modul`-Feld.** Bestätigt die Angabe aus `START_PROMPT.md`.

**Fundorte:** `pool_m07.json` (125) · `pool_m_ausbau.json` (2) · `pool_m_transfer.json` (2) ·
`pool_m_kreuztabelle.json` (1) · `pool_m_lueckenkette.json` (1) · `pool_m_mtf.json` (1) ·
`pool_m_szenario2.json` (1). ⚠️ Dazu **ein Fall in `pool_faelle.json`** mit `modul: M07` — der
zählt nicht in die 133, er landet in `faelle.js`. Beim Korrekturlauf nicht vergessen.

**Typen:** mc 52 · zuordnung 15 · mehrfach 15 · dropdown 12 · freitext 8 · erklaeren 7 ·
kalkulation 5 · reihenfolge 4 · rechenassistent 4 · bild 3 · kreuztabelle 2 · szenario2 2 ·
beschriftung 2 · matrix 1 · mtf 1.

**Themen:** Aufbauorganisation & Vollmachten 19 · Vertragsarten 16 · SLA & Servicevertrag 16 ·
Vertragsstörungen & Mängel 15 · Einweisung & Schulung 15 · Soll-Ist & Nachkalkulation 14 ·
Abnahme & Übergabe 12 · Unternehmensziele & Leitbild 9 · Onsite/Remote & Nachfolgeaufträge 9 ·
Change Management 8.

**Stufen:** 1→24 · 2→49 · 3→49 · 4→11. **Gebiete:** A5 und A4.

**Längen-Tell: 21 Treffer von 45 gewerteten mc-Fragen.** Deckt sich mit der Vorgabe.
Faktoren (richtige Antwort ÷ längster Distraktor), absteigend:

| ID | richtig | längster Distr. | Faktor |
|---|---|---|---|
| M07-203 | 168 | 41 | 4,10 |
| M07-205 | 114 | 40 | 2,85 |
| M07-103 | 30 | 11 | 2,73 |
| M07-201 | 213 | 85 | 2,51 |
| M07-118 | 126 | 60 | 2,10 |
| M07-305 | 84 | 47 | 1,79 |
| M07-109 | 86 | 52 | 1,65 |
| M07-770 | 142 | 94 | 1,51 |
| M07-715 | 163 | 112 | 1,46 |
| M07-605 | 91 | 67 | 1,36 |
| M07-018 | 59 | 44 | 1,34 |
| M07-716 | 116 | 88 | 1,32 |
| M07-311 | 117 | 89 | 1,31 |
| M07-601 | 114 | 87 | 1,31 |
| M07-107 | 104 | 83 | 1,25 |
| M07-707 | 101 | 82 | 1,23 |
| M07-711 | 116 | 103 | 1,13 |
| M07-005 | 73 | 65 | 1,12 |
| M07-710 | 109 | 100 | 1,09 |
| M07-717 | 94 | 89 | 1,06 |
| M07-008 | 30 | 29 | 1,03 |

⚠️ **DIESE TABELLE IST NACH DEM INHALTSLAUF ÜBERHOLT** — in M02 und M03 hat sich je ein Treffer
durch eine inhaltliche Korrektur von selbst erledigt. **Reihenfolge: Inhalt → Sprache → NEU
MESSEN → Längen.**

⚠️ **Beobachtung aus den bisher gesichteten 10 Treffern:** Es sind zwei verschiedene Muster.
Bei **M07-203 (4,10)**, **M07-205 (2,85)**, **M07-201 (2,51)** und **M07-103 (2,73)** ist die
richtige Antwort ein vollständiger Satz und die Distraktoren sind Stummel von 20–41 Zeichen — hier
müssen die **Distraktoren ausgebaut** werden, die richtige Antwort bleibt unangetastet.
Bei **M07-008 (1,03)** stehen sich zwei reine Aufzählungen mit **einem Zeichen Abstand** gegenüber
(„Ökonomisch, ökologisch, sozial" 30 gegen „Gewinn, Wachstum, Marktanteil" 29) — derselbe Typ
Grenzfall wie M01-117 und M03-001/002, die per Nutzer-Entscheid stehen bleiben durften.
**Entscheid nötig (E10).**

**Weitere Vorabbefunde:**

* **10 Fragen ohne `verweis`:** M07-019 … M07-024, M07-930 … M07-933. Deckt sich mit `START_PROMPT.md`.
* **3 Fragen ohne `erklaerungLang`:** M07-930, M07-931, M07-932. (Gehören zu den poolweit 29 —
  Nutzer-Entscheid vom 27.07.: eigener Griff, nicht in diesen Korrekturlauf.)
* **7 Fragen mit fragilen Optionsverweisen:** M07-028, M07-033, M07-042, M07-700, M07-704,
  M07-705, M07-706. Siehe A1.

---

## A · SCHWERE BEFUNDE

### A1 · Fragile Optionsverweise — im Code nachgeprüft ✅ **ERLEDIGT, ABER ERST AM 28.07. NACHTRÄGLICH**

> ⚠️⚠️ **DIESER BEFUND WURDE IM M07-KORREKTURLAUF ÜBERSEHEN.** Er stand als **erster** A-Befund im
> Bericht und im freigegebenen Umfang „Inhalt + Sprache", tauchte aber in keinem Korrekturskript
> auf. Aufgefallen ist es erst, als beim M08-Lauf dieselbe Klasse bearbeitet wurde.
> ✅ **Jetzt erledigt:** Alle sieben M07-Fragen (M07-028, 033, 042, 700, 704, 705, 706) zitieren
> statt Positionen den Optionstext. Zusammen mit den vier M08-Fragen sind es 11.
> **Lehre: Nach einem Korrekturlauf gegenprüfen, ob jeder A-Befund wirklich verschwunden ist.**

Sieben M07-Fragen verweisen in der `erklaerungLang` auf Positionen („Option 0" … „Option 5"):
**M07-028, M07-033, M07-042, M07-700, M07-704, M07-705, M07-706.**

Nachgesehen statt geglaubt — beide betroffenen Renderer mischen:

* `app_loeser.js:65` · `R_TYP.mc` → `L.shuffle([0,1,2,3])`
* `app_loeser.js:144` · `R_TYP.mehrfach` → `L.shuffle(f.optionen.map((_,i)=>i))`

Die sechs betroffenen `mehrfach`-Fragen werden also **jedes Mal in anderer Reihenfolge angezeigt**.
Der Satz „Warum Option 3 nicht stimmt: Die Kalkulation ist ein Geschäftsgeheimnis" (M07-028) trifft
beim Lerner auf eine beliebige andere Option. **Die Erklärung ist damit nicht nur nutzlos, sondern
irreführend.**

→ Vorschlag: Positionsverweise durch ein Zitat des Optionstextes ersetzen, z. B.
„Warum die **interne Kalkulation** nicht hineingehört: …". Das ist stabil gegen jede Mischung.
Betrifft die 7 M07-Fragen; poolweit sind es laut `START_PROMPT.md` noch M05 und M08 (offener
Punkt 7) — die M07-Hälfte wäre mit diesem Lauf erledigt.

### A2 · „Kostenabweichung in %" bezeichnet in M07 den Ist/Soll-Quotienten — das ist der falsche Begriff

**M07-012** (dropdown) definiert: „Kostenabweichung in % = (Tatsächliche Kosten ÷ Geplante Kosten)
× 100 %".
**M07-313** (mc) fragt „Welche **Kostenabweichung in Prozent** liegt vor?" bei 63.000 EUR ist zu
60.000 EUR soll — als richtig markiert ist „**105 %** (5 % Überschreitung)".

Rechnerisch ist 63.000 ÷ 60.000 = 105 % korrekt. **Aber das ist nicht die Kostenabweichung**,
sondern der Ist/Soll-Quotient (Kostendeckungsgrad, Erfüllungsgrad). Die **Abweichung** ist die
Differenz: (63.000 − 60.000) ÷ 60.000 = **5 %**. Der Klammerzusatz „(5 % Überschreitung)" in der
Antwortoption zeigt, dass die Doppeldeutigkeit beim Schreiben schon gespürt wurde — aufgelöst ist
sie nicht.

**Nachgescannt als Fehlerklasse:** Die dritte Fundstelle im Pool macht es richtig.
**M01-008** rechnet „Abweichung: 10.400 € − 9.600 € = **+800 € (8,3 % über Budget)**" — also
Differenzbezug. **M01 und M07 widersprechen sich damit im selben Pool.**
**M07-010** verstärkt es: „Berechnen Sie die **Nachkalkulation in Prozent**" mit der Musterlösung
120 % — hier ist der Begriff „Nachkalkulation in %" verwendet und damit unverfänglich.

→ In der AP1 ist beides prüfungsrelevant, aber unter verschiedenen Namen. Sauber wäre:
Quotient = „Kostendeckungsgrad" oder „Ist/Soll in %"; Differenz = „Kostenabweichung".
**Entscheid nötig** (siehe E1) — die Korrektur ist klein, aber sie ändert die richtige Antwort
von M07-313 **nicht**, nur ihre Bezeichnung.

### A3 · 50 von 133 `verweis`-Feldern zeigen ins Leere oder auf den falschen Abschnitt

Das war kein Verdacht, sondern ist gegen die Modul-Datei geprüft.
**`07_Leistungserbringung_und_Auftragsabschluss.md` hat die Abschnitte 7.1 bis 7.7** —
Inhaltsverzeichnis Zeile 8–14, `## `-Überschriften Zeile 17/142/216/301/428/530/653.

**A3.1 — Abschnitt 7.8 existiert nicht.** Zwei Fragen verweisen dorthin:
`M07-041` („7.8 – Umgang mit Widerstand") und `M07-042` („7.8 – Maßnahmen bei der
Systemeinführung"). Beide gehören inhaltlich in **7.5 Veränderungsprozesse begleiten**
(dort steht „### Ursachen von Widerständen erkennen", Zeile 477).

**A3.2 — 22 Verweise auf den falschen Abschnitt.** Auffällig ist die Häufung, nicht der Einzelfall:

| ID(s) | verweist auf | gehört nach | Thema |
|---|---|---|---|
| M07-605, M07-606, M07-607, M07-608 | 7.1 | **7.2** | Unternehmensziele & Leitbild |
| M07-601, M07-602, M07-603, M07-604 | 7.2 | **7.3 / 7.7** | Onsite/Remote & Nachfolgeaufträge |
| M07-921, M07-922 | 7.4 | **7.7** | Soll-Ist & Nachkalkulation |
| M07-940, M07-941 | 7.2 | **7.7** | Soll-Ist & Nachkalkulation |
| M07-942 | 7.3 | **7.7** | Soll-Ist & Nachkalkulation |
| M07-537 | 7.2 | **7.7** | Soll-Ist & Nachkalkulation |
| M07-461, M07-750 | 7.2 / 7.3 | **7.1** | SLA & Servicevertrag |
| M07-488 | 7.1 | **7.4** | Aufbauorganisation & Vollmachten |
| M07-442 | 7.3 | **7.5** | Change Management |
| M07-053 | 7.2 | **7.1 oder 7.6** | Vertragsstörungen & Mängel |
| M07-041, M07-042 | 7.8 (existiert nicht) | **7.5** | Change Management |

Zwei Fälle sind **keine Verweis-, sondern Themenfehler** und getrennt zu entscheiden:
* **M07-016** trägt `thema: Change Management`, behandelt aber Lessons Learned und verweist
  folgerichtig auf 7.7. Hier ist das **Thema** falsch, nicht der Verweis.
* **M07-113** trägt `thema: SLA & Servicevertrag`, behandelt aber Nachfolgeaufträge/
  Wartungsverträge und verweist auf 7.7. Ebenfalls Themenfrage.

**A3.3 — 7 Verweise ohne Abschnittsnummer** (uneinheitliches Format):
`M07-701`, `M07-702`, `M07-703`, `M07-770`, `M07-771` („Modul 07 – …" ohne Nummer),
`M07-950`, `M07-760` („Abschnitt Serviceverträge …" / „Abschnitt Soll-Ist-Vergleich …").

**A3.4 — 9 Verweise mit abweichendem Trennzeichen/Format:**
`M07-201` … `M07-205` benutzen den Geviertstrich `—` statt `–`;
`M07-488` benutzt ein Komma; `M07-750` einen Doppelpunkt;
`M07-536`, `M07-537`, `M07-543` haben **gar keinen Titel, sondern den Themennamen**
(„Modul 07, Abschnitt 7.1 SLA & Servicevertrag").

**A3.5 — der ärgerlichste Teilbefund: Für „Einweisung & Schulung" (15 Fragen) gibt es im
Modul keinen Fundort.** Alle 15 verweisen auf **7.7 „Leistungserbringung bewerten und
dokumentieren"** — dort steht Soll-Ist, Nachkalkulation, Lessons Learned, Nachfolgeaufträge, aber
nichts zur Einweisung. Zuständig wäre nach dem Titel **7.6 „Leistungsübergabe und Einweisungen
planen und dokumentieren"** — dessen Unterabschnitte (Zeile 535–618) behandeln jedoch
ausschließlich Abnahmeprotokoll, Mängelarten und ein Beispielprotokoll. **Das Modul hält, was
15 Fragen abfragen, an keiner Stelle vor.** Das ist ein Befund über das Lehrmaterial, nicht über
den Pool — Entscheid siehe E2.

### A4 · M07-006 — „Servicekonten" statt „Serviceverträge"

`erklaerungLang`: „Service Level Agreements sind **Servicekonten** mit definierten, überprüfbaren
Kennzahlen." Das Wort ergibt hier keinen Sinn; gemeint sind Serviceverträge.
Poolweit nachgescannt: **einzige Fundstelle.**
→ Vorschlag: „… sind Serviceverträge mit definierten, überprüfbaren Kennzahlen."

Zweiter Punkt in derselben Frage, **eigener Entscheid**: Die zweite Lücke fragt die Lösungszeit
„bei Standard-Tickets" ab, richtig ist **4**, im Angebot steht auch **8**. Beides ist in der Praxis
als Standard-Lösungszeit verteidigbar; die `erklaerungLang` sagt selbst „typisch 4 Stunden …, bis
24 Stunden". **Die Lücke ist nicht eindeutig.** → Vorschlag: Distraktor „8" gegen einen klar
falschen Wert tauschen (z. B. „0,5"), oder die Frage auf „bei Tickets hoher Priorität" schärfen.

### A5 · M07-005 — die Distraktorerklärung verwechselt Garantie und Gewährleistung

`distraktorErklaerungen[1]`: „Das Abnahmeprotokoll hat rechtliche Wirkung: Gefahren und
**Garantie** gehen über". Mit der Abnahme beginnt die **Gewährleistung** (gesetzlich, § 634a BGB);
die Garantie ist eine freiwillige Zusage und geht überhaupt nicht „über".
Die richtige Antwort und beide anderen Erklärungen der Frage sagen korrekt „Gewährleistungszeit" —
der Fehler steckt nur in dieser einen Zeile.

`distraktorErklaerungen[3]` ist im selben Zug zu prüfen: „Das Abnahmeprotokoll ist bei
Werkverträgen am wichtigsten, gilt aber **prinzipiell auch für andere Vertragsarten**." Die Abnahme
nach **§ 640 BGB ist ein Werkvertragsinstitut**; beim Kaufvertrag gibt es Übergabe und
Gefahrübergang, beim Dienstvertrag gar keine Abnahme. Der als falsch markierte Distraktor
(„Nur bei Werkverträgen gültig; bei Dienstverträgen keine Wirkung") ist damit **im Kern zutreffend**.
Die Frage bleibt lösbar, weil nur Option 0 eine *Wirkung* beschreibt — sauber ist es nicht.
→ Vorschlag: Distraktor 3 umformulieren, etwa „Sie wirkt erst, wenn zusätzlich die Rechnung
beglichen ist".

### A6 · M07-118 — die Erklärung widerspricht der als richtig markierten Antwort

Der Fragetext: Lieferfrist **12 Wochen**, tatsächlich **16 Wochen**, im Text ausdrücklich
„(**4 Wochen Verzug**)". Konventionalstrafe 500 EUR/Woche, Deckelung 5 % von 80.000 = 4.000 EUR.
Als richtig markiert ist „… Konventionalstrafe (**2.000 EUR für 4 Wochen Verzug**) …" — 4 × 500 =
2.000 ✓, unter der Deckelung ✓. **Die Antwort stimmt. Alles andere in der Frage nicht:**

* `erklaerungKurz`: „Lieferverzug nach **14 Wochen** (statt 12 geplant) = **2 Wochen** zu spät.
  Kunde kann: (1) Konventionalstrafe (**4 Wochen** × 500 EUR = 2.000 EUR …)" — im selben Satz
  erst 14 Wochen und 2 Wochen, dann 4 Wochen.
* `erklaerungLang`: „500 EUR pro Woche × **2 Wochen** (Tage 85–98) = **1.000 EUR**" und gleich
  darauf „ACHTUNG: Der Verzug beginnt bei Tag 85, nicht Tag 99 – also 2 Wochen (14 Tage) =
  2 × 500 EUR = **1.000 EUR**."
* `distraktorErklaerungen[3]`: „2 Wochen Verzug sind längst überschritten (es sind 2 Wochen =
  14 Tage Überschreitung)" — der Satz widerlegt sich selbst.

**Der Lerner antwortet richtig (2.000 EUR) und bekommt zur Belohnung zweimal 1.000 EUR erklärt.**
Offenbar wurde der Fragetext später von 14 auf 16 Wochen geändert und keine der Erklärungen
nachgezogen.
→ Vorschlag: alle Erklärungen auf **4 Wochen / 2.000 EUR** vereinheitlichen, die Tagesangaben
(„Tage 85–98") streichen — sie stammen aus der alten Fassung und rechnen zudem in Kalendertagen,
während die Strafe je Woche vereinbart ist. Zusätzlich in der richtigen Antwort
„Schadensersatz bei **Schuldverschulden**" → „bei Verschulden".

### A7 · M07-103 — die Rechnung in der Erklärung ist um den Faktor 10 falsch, und die Deckelung greift nicht

Auftragswert 100.000 EUR, 0,5 % je Werktag, 10 Werktage, Deckelung 5 %.
`erklaerungKurz`: „100.000 EUR × 0,5 % × 10 Werktage = **50.000 EUR**."
`erklaerungLang`: „Hier: 100.000 EUR × 0,005 × 10 = **50.000 EUR**."
Nachgerechnet: 100.000 × 0,005 × 10 = **5.000 EUR**. **Beide Angaben sind zehnmal zu groß.**
Die eigene `distraktorErklaerungen[2]` sagt dazu passenderweise: „Das ist 50 % Strafe – viel zu
hoch und **nicht die Rechnung**" — die Frage widerspricht sich also selbst.

Schwerer wiegt die didaktische Folge: **Die ungedeckelte Strafe beträgt genau 5.000 EUR, die
Deckelung liegt bei 5 % = 5.000 EUR.** Die Deckelung greift damit gar nicht, sie wird punktgenau
erreicht. Die Frage will die Deckelung prüfen und hat ein Zahlenbeispiel gewählt, in dem sie
wirkungslos ist; die als richtig markierte Option heißt trotzdem „5.000 EUR (Deckelung erreicht)".
→ Vorschlag: Verzug auf **15 Werktage** setzen. Dann sind es 7.500 EUR ungedeckelt, die Deckelung
greift echt, die richtige Antwort bleibt 5.000 EUR, und beide Erklärungen werden mit der
korrigierten Rechnung stimmig.
**Als Fehlerklasse nachgescannt** (alle „a × b × c = d"-Muster im Pool automatisch nachgerechnet):
**M07-103 ist die einzige Fundstelle.** M07-104 rechnet dieselbe Aufgabenart korrekt
(20.000 × 0,003 × 8 = 480, Deckelung 1.000, „ab 17 Werktagen greift sie" — nachgerechnet: 1.000 ÷ 60
= 16,7 ✓).

### A8 · M07-107 — erfundenes Gesetzeszitat in Anführungszeichen

`erklaerungLang`: „§ 640 Abs. 3 BGB schützt den Auftraggeber: **'Der Auftraggeber kann die Abnahme
verweigern, solange nicht die vertraglich vorgesehene Leistung erbracht ist. Die Abnahme kann unter
Vorbehalt der Beseitigung oder Minderung für die Mangelhaftigkeit erklärt werden.'**"

**Das ist nicht der Wortlaut.** § 640 Abs. 3 BGB lautet: „Nimmt der Besteller ein mangelhaftes Werk
gemäß Absatz 1 Satz 1 ab, obschon er den Mangel kennt, so stehen ihm die in § 634 Nr. 1 bis 3
bezeichneten Rechte nur zu, wenn er sich seine Rechte wegen des Mangels bei der Abnahme vorbehält."
Inhaltlich trifft die Frage das Richtige — und die als richtig markierte Antwort nennt mit
„Nachbesserung, Minderung, Rücktritt" sogar genau § 634 Nr. 1 bis 3. **Falsch ist nur, dass ein
selbst formulierter Satz als Gesetzestext in Anführungszeichen steht.**
→ Vorschlag: Anführungszeichen weg, Paraphrase stehen lassen, oder echten Wortlaut einsetzen.

**Fehlerklasse poolweit nachgescannt** (Zitate ab 40 Zeichen im Umfeld einer Paragrafenangabe):
**zwei Fundstellen — M07-107 und M08-603.**
⚠️ **M08-603 ist der schwerere Fall und gehört in den M08-Lauf:** Dort steht „§ 623 Abs. 1 BGB ist
zwingend: 'Die Beendigung eines Arbeitsverhältnisses eines Arbeiters oder eines Angestellten
(Arbeitnehmers) … bedarf zu ihrer Wirksamkeit der Schriftform; die Beendigung per Telefax genügt
nicht.'" und „Absatz 2 stellt klar: 'Die Schriftform wird nicht durch elektronische Form ersetzt.'"
Der echte § 623 BGB lautet: „Die Beendigung von Arbeitsverhältnissen durch Kündigung oder
Auflösungsvertrag bedürfen zu ihrer Wirksamkeit der Schriftform; die elektronische Form ist
ausgeschlossen." — **§ 623 BGB hat keinen Absatz 2.** Beide Zitate sind erfunden. Hier vorgemerkt,
damit es beim M08-Durchgang nicht neu gefunden werden muss.

### A9 · M07-115 — Prozentwert falsch berechnet, und der Fehler steht in `schluesselbegriffe.pflicht`

Soll 6 Wochen, Ist 7 Wochen. `musterloesung`: „Abweichung: +1 Woche (**14,3 %** Überschreitung)".
Nachgerechnet: 1 ÷ **6** = 16,7 %. 14,3 % ist 1 ÷ 7 — geteilt wurde durch den **Ist**-Wert statt
durch den Soll-Wert. Die Kostenseite derselben Frage macht es richtig: 2.000 ÷ 50.000 = 4 %,
also Bezug auf den Soll-Wert. Nachkalkulation 48.000 ÷ 50.000 = 96 % ✓.

⚠️ Besonders unangenehm: **„14,3" steht in `schluesselbegriffe.pflicht`** — die Freitext-Bewertung
verlangt vom Lerner also aktiv den falschen Wert und wertet die richtige Rechnung als unvollständig.
→ Vorschlag: Musterlösung auf **16,7 %** und `pflicht`-Eintrag `["1 Woche","eine Woche","16,7"]`.

### A10 · M07-117 — die Erklärung beschreibt Bildelemente, die es nicht gibt, und nennt eine Frage-ID

Zwei Befunde in derselben `erklaerungLang`:

1. „… das Admin-Team besteht aus einzelnen Mitarbeitern (**Punkte**)". Das SVG enthält
   **keine Punkte und keine Kreise** — es endet bei den drei Team-Rechtecken (`rect` bei y=212).
   Kreise gibt es nur in M07-009. Der Lerner sucht im Bild nach etwas, das nicht da ist.
2. „Merke: Im Gegensatz zur Matrixorganisation (**bei M07-009**) sind hier die Linien durchgängig".
   **Eine interne Frage-ID im Lernertext.** Die Fragen werden gemischt vorgelegt; „M07-009" ist für
   den Lerner ein Kürzel ohne Bedeutung.
   **Fehlerklasse poolweit nachgescannt:** genau **zwei** Fundstellen —
   M07-117 und **M03-533** („… siehe **M03-953**, das diesen Weg konsequent geht"). M03 gilt seit
   dem 27.07. als durch; **Entscheid nötig**, ob M03-533 mitgenommen wird.

Die SVG-Geometrie selbst wurde nachgerechnet und ist korrekt: Verteilungslinie y=80 von x=150 bis
550, Abzweige exakt auf den Kastenmitten 150 / 350 / 550; zweite Ebene y=178 von x=52 bis 266,
Abzweige auf 52 / 159 / 266, passend zu den Kastenmitten 52,5 / 159,5 / 266,5.

### A11 · M07-204 — die Personentypen werden dem falschen Modell zugeschrieben

`erklaerungLang`: „Ein gutes Change-Management-Modell (**z. B. nach Satir oder Kotter**) priorisiert
entlang dieser Typen." **Beide Modelle tun das nicht.** Die Satir-Kurve beschreibt den emotionalen
Verlauf einer Veränderung über die Zeit (Status quo → Widerstand → Chaos → Integration), Kotters
8 Stufen beschreiben die Schritte der Führung. **Eine Einteilung der Betroffenen in Anteile
(10–15 % / 30 % / 30 % / 10–15 %) stammt aus der Diffusionstheorie nach Rogers** (Innovatoren,
frühe Übernehmer, frühe und späte Mehrheit, Nachzügler) — die Frage benutzt mit „Early Adopter"
sogar dessen Vokabular.
→ Vorschlag: „z. B. nach Satir oder Kotter" durch „die Verteilung geht auf die Diffusionstheorie
nach Rogers zurück" ersetzen.

Nebenbefund derselben Frage: **Die Anteile summieren sich nicht.** 10–15 + 30 + 30 + 10–15 ergibt
80 bis 90 %. Der Merksatz spricht anschließend von „den anderen **85 %**" — das passt nur zur
oberen Grenze eines einzigen Anteils. → entweder auf 15 / 35 / 35 / 15 glätten oder die
Prozentangaben streichen.

### A12 · M07-203 — unsichtbares Steuerzeichen im `verweis`

Der Verweis lautet „… Change-Management-Phasen und **Multiplika[U+00AD]tor**-Strategie" — zwischen
„Multiplika" und „tor" steht ein **weiches Trennzeichen (Soft Hyphen)**. Es ist im Editor
unsichtbar, bricht aber Suche und Vergleich und kann je nach Renderer als Bindestrich erscheinen.

**Poolweit nachgescannt** (Soft Hyphen, Zero Width Space, geschütztes Leerzeichen, schmales
geschütztes Leerzeichen, Zero Width Joiner): **M07-203 ist die einzige Fundstelle im gesamten
Pool.** Alle anderen vier Klassen: 0 Treffer.
→ Zeichen ersatzlos entfernen.

### A13 · M07-608 — die Musterlösung beschreibt ein anderes Unternehmen als die Frage

Die Aufgabe: „Formulieren Sie für die **Glueckstadt Fischverarbeitung GmbH** ein
Unternehmensleitbild …". Die Musterlösung beginnt: „Die Glueckstadt Fischverarbeitung GmbH ist ein
führender Anbieter von **IT-Lösungen für mittelständische Industrieunternehmen** …" und führt das
konsequent durch — Vision „nachhaltige IT-Infrastruktur", ökologisches Ziel „Cloud-Services mit
erneuerbaren Energien und papierlose Prozesse".

**Eine Fischverarbeitung ist kein IT-Dienstleister.** Der Text stammt erkennbar aus M07-606, wo
„Wir bieten IT-Lösungen für mittelständische Industrieunternehmen" als Mission-Beispiel steht;
beim Übertragen wurde nur der Firmenname ersetzt. Ein Lerner, der die Aufgabe ernst nimmt und ein
Leitbild für einen Lebensmittelbetrieb schreibt, wird gegen eine Musterlösung geprüft, die von
etwas anderem handelt.
→ Vorschlag: Musterlösung auf die Fischverarbeitung umschreiben (Kühlkette, regionale Beschaffung,
Wasserverbrauch, Ausbildungsquote) — **oder** den Firmennamen in der Frage gegen einen
IT-Dienstleister tauschen. Zweiteres ist der kleinere Eingriff, passt aber schlechter zu A5 als
Prüfungsgebiet.

### A14 · M07-461 — die Klammer im Fragetext beschreibt die falsche Kennzahl

„Typische SLA-Kennzahlen sind ___ (Uptime-Garantie), **RTO (Recovery Time Objective)** und ___
(**Zielanforderung für Datenwiederherstellung**)." Gesucht ist **RPO**.
Das **RPO (Recovery Point Objective) ist der maximal tolerierbare Datenverlust** — der Zeitpunkt,
bis zu dem Daten wiederhergestellt werden können. Die **Wiederherstellungsdauer** ist das RTO,
das in derselben Zeile bereits genannt wird. **Die Klammer erklärt also das RTO ein zweites Mal.**
Die `erklaerungLang` macht es richtig: „RPO – maximal 1 Stunde Datenverlust".
→ Vorschlag: „(maximal tolerierbarer Datenverlust)".

### A15 · M07-309 — MTTR steht in derselben Frage für zwei verschiedene Kennzahlen

`erklaerungLang`: „Reaktionszeit (auch **MTTR – Mean Time To Response**)" und vier Zeilen später
„Lösungszeit (auch **MTTR – Mean Time To Resolution** oder RTO – Recovery Time Objective)".
**Dasselbe Kürzel für beide Größen — in einer Frage, deren einziger Zweck es ist, die beiden
auseinanderzuhalten.** Fachlich steht MTTR für Mean Time To Repair/Restore; für die Reaktionszeit
ist **MTTA (Mean Time To Acknowledge)** der übliche Begriff. Das RTO gehört in die
Notfallwiederherstellung, nicht in die SLA-Lösungszeit.
→ Vorschlag: Reaktionszeit = MTTA, Lösungszeit = MTTR, RTO streichen.

⚠️ **Und ein Widerspruch zu A4:** M07-006 setzt **4 Stunden Lösungszeit für Standard-Tickets** an,
M07-309 setzt **4 Stunden für Critical und 24 Stunden für Standard**. Die beiden Fragen
widersprechen sich direkt. **Das bestätigt A4:** Die Lücke in M07-006 ist auch deshalb nicht
eindeutig, weil der Pool selbst keine einheitliche Zahl führt. → gemeinsam entscheiden.

### A16 · M07-304 — falsche Paragrafenangabe für die Gewährleistungsfrist

`erklaerungLang`: „… läuft typisch 2 Jahre (bei Werkverträgen **§ 636 BGB**)".
§ 636 BGB regelt „Besondere Bestimmungen für Rücktritt und Schadensersatz". **Die Verjährung der
Mängelansprüche beim Werkvertrag steht in § 634a BGB.**

**Als Fehlerklasse nachgescannt** — alle 88 Paragrafenangaben des Pools aufgelistet und geprüft:
* **§ 636 BGB (M07-304) ist die einzige inhaltlich falsche Zuordnung in M07.** Die
  HGB-Vollmachtsangaben (§§ 48, 49, 52, 53, 54) und die Abnahme-Angaben (§ 640) sind korrekt.
* **Formatabweichungen:** `§ 48 ff. HGB` in M07-110 (einfaches Zeichen bei „ff.", siehe C14) und
  `§ 640 ff. BGB` in M07-202 (C20). M07-710 schreibt korrekt `§§ 48 ff. HGB`.
* **Poolweit außerhalb M07:** `§11 BBiG`, `§20 BBiG`, `§21 BBiG`, `§34 BBiG` in **M09-137** und
  `§48 HGB` in **M09-112** stehen ohne Leerzeichen. M09 ist bis 31.07. tabu — für Etappe 2 vermerkt.

### A17 · M07-306 und M07-441 sind dieselbe Aufgabe

Beide zerlegen den Abnahmeprozess in fünf Schritte, in derselben Reihenfolge, mit denselben
Inhalten: Übergabe → Prüfung → Abnahme oder Mängelrüge → Nachbesserung → Gefahrenübergang und
Fälligkeit. Beide sind Stufe 3, beide im Thema „Abnahme & Übergabe", beide verweisen auf 7.6.

Erschwerend: **M07-306 hat den falschen Aufgabentyp.** Die Frage lautet „Ordnen Sie … in die
richtige **Reihenfolge** (1. bis 5.)", der Typ ist aber `zuordnung` — und die linken Elemente
tragen die Nummern schon im Text („1. Übergabe der Leistung …", „2. Überprüfung …"). **Die
Reihenfolge, nach der gefragt wird, steht als Antwort daneben.** M07-441 macht dasselbe korrekt
als `reihenfolge`.
→ Vorschlag: M07-306 inhaltlich neu bauen (wie die beiden Dublettenpaare in M02) oder streichen.
**Nutzer-Entscheid nötig** — in M02 war die Entscheidung „inhaltlich neu bauen statt nur Längen
angleichen".

### A18 · M07-442 — die Kurzerklärung dreht zwei Schritte der Lösung um

Die als richtig gesetzte Reihenfolge endet mit
**S4 Statusbericht und Monitoring → S5 Dokumentation und Review.**
Die `erklaerungKurz` sagt: „Antrag → Genehmigung → Umsetzung → **Dokumentation → Monitoring**",
also S5 vor S4. **Wer die Aufgabe richtig löst, bekommt eine Erklärung, die ihm das Gegenteil
bestätigt.**

Nebenbefund: **S5 enthält „Rückkehrplan bereithalten", S4 enthält „bei Problemen Rückkehrplan
ausführen".** Man kann ihn nicht im vorletzten Schritt ausführen und im letzten bereithalten — der
Rollback-Plan gehört in die Planung (S3). Zudem heißt er in der `erklaerungLang` „Rollback",
in den Schritten „Rückkehrplan".
→ Vorschlag: „Rückkehrplan bereithalten" aus S5 in S3 verschieben, Begriff auf „Rollback-Plan"
vereinheitlichen, `erklaerungKurz` auf die Lösungsreihenfolge bringen.

### A19 · M07-314 — „Ist-Kosten" im Fragetext, aber die Rechnung behandelt sie als Zwischenwert

Fragetext: „**Ist-Kosten = 34.000 EUR**, Kosteneinsparungen durch Automatisierung = 6.000 EUR, aber
Nacharbeiten wegen Kundenverzögerungen = 2.000 EUR zusätzlich."
Musterlösung: 34.000 − 6.000 + 2.000 = **30.000 EUR**, Quote 75 %.

**Ist-Kosten sind die tatsächlich angefallenen Kosten.** Sind es 34.000, dann ist die Quote
34.000 ÷ 40.000 = **85 %** und die Einsparung ist darin bereits enthalten — man zieht sie nicht
noch einmal ab. Die Musterlösung nennt die 34.000 denn auch „Basis" und die `erklaerungLang`
„Roherstellung". **Der Fragetext benutzt einen Begriff, den die Lösung sofort umdeutet.**
→ Vorschlag: im Fragetext „Ist-Kosten" durch „Kosten laut Zwischenabrechnung vor Verrechnung"
ersetzen. Die Zahlen bleiben dann alle stehen (40.000 − 30.000 = 10.000 ✓).

Zweiter Befund derselben Frage: **Musterlösung und Erklärung bewerten gegensätzlich.** Die
Musterlösung urteilt „Bewertung: **AUSGEZEICHNET**", die `erklaerungLang` sagt „Das ist **NICHT
automatisch gut**: Es könnte gute Effizienz bedeuten (positiv) oder schlechte Planung … (negativ)".
Die differenzierte Fassung ist die bessere — die Musterlösung sollte ihr folgen.

### A20 · M07-401 — „Klaustrophobische Geheimhaltungsklauseln"

Antwortoption 2 (als falsch markiert): „**Klaustrophobische** Geheimhaltungsklauseln, die den
Kunden einengen". Klaustrophobie ist die Angst vor engen Räumen; auf eine Vertragsklausel
angewandt ergibt das Wort keinen Sinn. **Die zugehörige Distraktorerklärung schreibt es selbst
richtig:** „**Übermäßig einengende** Geheimhaltungsklauseln sind kein Standardbestandteil".
→ Vorschlag: Option auf „Übermäßig einengende Geheimhaltungsklauseln …" bringen.

Nebenbefund: Von sechs Optionen sind **vier richtig**, und die beiden falschen sind an ihrer
Wortwahl sofort erkennbar. Die Frage prüft dadurch weniger, als sie könnte. → Bei der Korrektur
einen der Distraktoren fachlich plausibel machen (z. B. „Die vollständige Offenlegung der
internen Kalkulation des Dienstleisters").

### A21 · M07-488 — der Buchhalter hängt im Organigramm an keiner Linie

Die Distraktorerklärung behauptet: „Der Buchhalter ist ebenfalls eine operative Position **unter
dem Innendienst**." Im SVG nachgemessen:
* Verbindungslinie unterhalb des Innendienstes: `x1=130 … x2=270` bei `y=280`.
* Sachbearbeiter-Kasten: `x=70`, `width=130` → 70…200, Mitte 135 — liegt im Bereich ✓.
* **Buchhalter-Kasten: `x=280`, `width=120` → 280…400, Mitte 340 — die Linie endet bei 270.**

**Der Buchhalter steht unverbunden im Bild.** Die Unterstellung, die die Erklärung behauptet, ist
nicht gezeichnet. Zusätzlich sind für die drei Kästen der untersten Ebene gar keine senkrechten
Abzweige gesetzt — die waagerechte Linie berührt sie nur.

Fachlicher Nebenbefund: **Eine Buchhaltung unter dem Vertriebsleiter** ist organisatorisch schief;
in M07-117 liegt die Buchhaltung korrekt als eigene Abteilung neben dem Vertrieb.
→ Vorschlag: Entweder die Linie bis x=340 verlängern und einen Abzweig setzen — oder, besser, den
Buchhalter durch eine vertriebsnahe Stelle ersetzen („Auftragsbearbeitung").

⚠️ **Ein Verdacht hat sich hier NICHT bestätigt:** M07-488 ist die einzige M07-Frage, deren SVG mit
CSS-Klassen statt mit Inline-Attributen arbeitet (`class='board'`, `.department`, `.team`). Die
Klassen sind aber **im SVG selbst per `<style>`-Block definiert** — geprüft, ebenso bei den elf
gleichartigen Bildern in M02 bis M06. **Kein Darstellungsproblem, kein Befund.**

### A22 · Leasing wird in M07-003 dem Leasinggeber, in M07-716/717 dem Leasingnehmer zugeordnet

Das war zunächst als milder Vereinfachungs-Befund notiert (B4). Mit den zuletzt gelesenen Fragen
ist daraus ein **direkter Widerspruch im Pool** geworden:

* **M07-003** (`paare`): „Leasing → Nutzung + Service (**Wartung, Versicherung**) **durch
  Leasinggeber**"
* **M07-716**: „Leasing: wirtschaftlich mietähnlich … häufig mit Kaufoption am Ende und mit **auf
  den Leasingnehmer verlagerter Instandhaltung**"
* **M07-717**: „UNTERSCHIED ZUM LEASING: Leasingverträge **verlagern die Instandhaltung
  vertraglich regelmäßig auf den Leasingnehmer**"

Zwei Fragen sagen dasselbe, die dritte das Gegenteil. Richtig ist die Mehrheit: Beim verbreiteten
Finanzierungsleasing trägt der Leasingnehmer Wartung und Versicherung; die Variante aus M07-003 ist
das Full-Service-Leasing und der Sonderfall.
→ Vorschlag: M07-003 auf „Nutzung auf Zeit gegen Rate; Eigentum beim Leasinggeber, Instandhaltung
je nach Vertragsart" ändern. **B4 entfällt damit und geht in diesem Befund auf.**

### A23 · M07-960 — die Erklärung nennt vier Vertragsarten, das Bild hat drei Positionen

Das SVG enthält **drei** nummerierte Zeilen: 1 Werk (§ 631), 2 Dienst (§ 611), 3 Kauf (§ 433).
Die `erklaerungLang` beginnt mit „**Die vier Vertragsarten des BGB** unterscheiden sich darin, was
geschuldet wird", listet vier auf und schließt: „Merke: Der Mietvertrag ist hier nur als
**Distraktor** genannt."

Zwei Probleme: **Das BGB kennt weit mehr als vier Vertragsarten** — der Satz behauptet eine
Vollständigkeit, die es nicht gibt. Und der Mietvertrag ist im Bild überhaupt nicht vorhanden;
er kann dort auch kein Distraktor sein.
→ Vorschlag: „Die drei im Bild gezeigten Vertragsarten unterscheiden sich …", Mietvertrag-Zeile
als Abgrenzung kennzeichnen statt als Distraktor.
Ebenfalls dünn: `erklaerungKurz` lautet vollständig „Wichtige Vertragsarten sind Werkvertrag,
Dienstvertrag und Kaufvertrag." — das erklärt nichts.

### A24 · Auflösung zu A2 — der Pool führt die richtige Terminologie bereits, an sieben Stellen

Nach dem vollständigen Durchgang ist der Befund A2 entschieden, ohne dass etwas erfunden werden
muss. **Sieben M07-Fragen trennen Differenz und Quotient sauber:**

| ID | Formulierung |
|---|---|
| M07-921 | „Abweichung = Ist − Soll = 5.000 EUR" **und** „Nachkalkulationsquote = Ist ÷ Soll × 100 = 110 %" |
| M07-922 | „Abweichung = 3.000 EUR", „Nachkalkulationsquote = 105 %" |
| M07-940 | „Abweichung je Kostenart (Istkosten − Sollkosten)" |
| M07-941 | „Abweichung (Ist − Soll) = 1.500 EUR", „**Abweichungsquote** = 1.500 ÷ 20.000 × 100 = 7,5 %" |
| M07-942 | Istkosten-Summe und Ist-Gewinn, sauber getrennt |
| M07-760 | „absolute und prozentuale Abweichung (Istkosten − Sollkosten)" |
| M07-314 | „Nachkalkulationsquote" |

**Nur M07-012 und M07-313 nennen den Quotienten „Kostenabweichung".**
Besonders deutlich wird es an **M07-922 gegen M07-313**: Beide rechnen mit **denselben Zahlen**
(60.000 Soll, 63.000 Ist). M07-922 nennt 3.000 EUR die Abweichung und 105 % die
Nachkalkulationsquote; M07-313 fragt „Welche **Kostenabweichung** in Prozent liegt vor?" und
erwartet 105 %.
→ **Vorschlag ist damit klar und minimal:** In M07-012 und M07-313 „Kostenabweichung" durch
„Nachkalkulationsquote" ersetzen. Die richtigen Antworten und alle Zahlen bleiben unverändert.
M01-008 muss nicht angefasst werden — es rechnet ohnehin die Differenz.

⚠️ **Nebenbefund:** M07-922 und M07-313 sind damit auch inhaltlich eine **Zahlen-Dublette**
(gleiche Werte, gleiche Rechnung, verschiedener Aufgabentyp). Kein Fehler, aber vorlegenswert.

---

## B · MITTLERE BEFUNDE

### B1 · M07-021 — Vorzeichen der Abweichung gegen die übliche Konvention
`erklaerungLang`: „Die Differenz heißt Abweichung. **Positiv bedeutet in der Regel: weniger
verbraucht als geplant.**" In der Kostenrechnung ist die Abweichung üblicherweise Ist − Soll;
**positiv heißt dann Überschreitung.** Die Aussage behauptet das Gegenteil und beruft sich dabei
auf „in der Regel". → Vorschlag: Vorzeichensatz streichen oder die Rechenrichtung ausschreiben.

### B2 · M07-052 — Zeile 5 der Kreuztabelle ist nicht trennscharf
Zeile „Es besteht eine Gewährleistung für Sachmängel des gelieferten Gegenstands" ist nur in der
Spalte **Kaufvertrag** als wahr gesetzt. Beim Werkvertrag besteht ebenfalls Mängelhaftung — die
`erklaerungLang` weiß das und grenzt hinterher ab („beim Werkvertrag heißt das Pendant
Mängelhaftung am Werk"). Der Lerner kreuzt beim Werkvertrag mit guten Gründen an und bekommt
„falsch". → Vorschlag: Zeile auf „Gewährleistung für Sachmängel **der gekauften Sache (§ 437
BGB)**" schärfen.

### B3 · M07-013 — „Beim Abnahmeprotokoll können drei Mängelarten auftreten"
Mängelarten treten an der **Leistung** auf, nicht am Protokoll; das Protokoll hält sie fest.
Kleine, aber vermeidbare begriffliche Unschärfe im Fragetext. → „Bei der Abnahme können …"

### B4 · M07-003 — Leasing zu eng beschrieben → **aufgegangen in A22**, dort entscheiden

### B15 · M07-750, M07-770, M07-771 — Formatbruch in der `erklaerungLang`
Diese drei Fragen schreiben die `erklaerungLang` als **durchgehenden Fließtext ohne
Aufzählungspunkte und ohne abschließenden „Merke:"-Satz**. Alle übrigen 130 M07-Fragen folgen dem
Muster „Einleitungssatz · Aufzählungspunkte · Merke:". Bei M07-750 ist der Absatz zudem rund 1.100
Zeichen lang. Auf dem Telefon ist das eine Textwand.
→ Vorschlag: in Punkte gliedern und einen Merksatz ergänzen.

### B16 · M07-750 und M07-771 — vier bzw. vier richtige Optionen bei nur einem Distraktor
Beide `mehrfach`-Fragen haben **fünf Optionen, davon vier richtig**. Wer nichts weiß und alles
ankreuzt, liegt zu 80 % richtig. Zum Vergleich: M07-028, M07-033, M07-042, M07-700, M07-703,
M07-704, M07-705 arbeiten mit sechs Optionen und drei Distraktoren.
→ Vorschlag: je zwei plausible Distraktoren ergänzen. (Bei M07-401 ist die Lage ähnlich, siehe A20.)

### B17 · M07-713 — ein Aufzählungspunkt bricht mitten im Gedanken ab
„• Der Unterschied zur Prokura steckt **in zwei Wörtern des Gesetzestextes**." → „• PROKURA
(§ 49 Abs. 1 HGB): …" → „• HANDLUNGSVOLLMACHT (§ 54 Abs. 1 HGB): **Zwei Einschränkungen also** –
es zählt die konkrete Branche, und es zählt nur das Gewöhnliche."
Der dritte Punkt beginnt mit dem Fazit und lässt den Gesetzeswortlaut aus, der angekündigt wurde.
→ Vorschlag: „HANDLUNGSVOLLMACHT (§ 54 Abs. 1 HGB): Geschäfte, die der Betrieb eines DERARTIGEN
Handelsgewerbes GEWÖHNLICH mit sich bringt. Das sind zwei Einschränkungen: …"

### B5 · M07-102 — die erste Lücke steht als Lösung im selben Satz
„Die maximale Ausfallzeit darf **___** Minuten nicht überschreiten. Rechnung: 720 × 60 × ___ =
**43,2 Minuten**." Lücke 1 ist „43,2" — und genau dieser Wert steht zwei Zeilen weiter als
Ergebnis der Rechnung. Die Lücke prüft nichts. (Die zweite Lücke, 0,001, ist in Ordnung; die
Rechnung 720 × 60 × 0,001 = 43,2 stimmt.)
→ Vorschlag: Ergebnis der Rechnung durch „= ___ Minuten" ersetzen, oder die erste Lücke streichen.

### B6 · M07-110 — das dritte Paar ist kategorial schief, und in einer Frage stehen drei Beträge
`paare`: „**Keine Vollmacht** → Rein private Handlungen ohne Unternehmens-Vollmacht (z. B.
Privateinkauf, privates Gehalt verhandeln)". „Keine Vollmacht" ist keine Vollmachtsart, und ein
privater Einkauf ist keine Handlung „im Namen des Unternehmens" — die Zeile prüft nichts.
→ Vorschlag: durch **Einzelvollmacht** oder **Artvollmacht** ersetzen (§ 54 HGB kennt Handlungs-,
Art- und Einzelvollmacht) — dann prüft die Zuordnung tatsächlich Vollmachtsstufen.

Nebenbefund derselben Frage: Für die Handlungsvollmacht werden **drei verschiedene Beträge**
genannt — „bis 5.000 EUR" (`paare`), „bis 10.000 EUR" und „typisch 20.000 EUR" (`erklaerungLang`).
Alle drei sind als Beispiel gekennzeichnet, wirken zusammen aber beliebig.
Fachlich korrekt ist dagegen die Prokura-Beschreibung (§ 49 Abs. 2 HGB, Grundstücksveräußerung).

### B7 · M07-117 — der Distraktor „Mehrliniensystem" wird schwach begründet
`distraktorErklaerungen[2]`: „Mehrlinie ist ähnlich, aber **nicht die präzise Bezeichnung** für
linear-hierarchisch." Das Mehrliniensystem ist nicht die unpräzisere Variante, sondern etwas
anderes: mehrere Fachvorgesetzte je Stelle. M07-009 macht genau diese Abgrenzung vorbildlich
(„Funktionsmeisterprinzip"). → Formulierung von dort übernehmen.

### B9 · M07-201 — „§ 640 Abs. 1 BGB" trägt die konkludente Abnahme nicht
Antwortoption und `erklaerungLang` sagen: „Nach § 640 **Abs. 1** BGB kann die Abnahme auch
'konkludent' erfolgen". Absatz 1 regelt die Abnahmepflicht des Bestellers und, dass wegen
unwesentlicher Mängel nicht verweigert werden darf; Absatz 2 die fiktive Abnahme nach Fristsetzung.
**Die konkludente Abnahme steht nirgends im Gesetz** — sie folgt aus der Auslegung von Verhalten
(§§ 133, 157 BGB) und ist ständige Rechtsprechung.
→ Vorschlag: „nach § 640 BGB" ohne Absatzangabe, oder „§ 640 BGB i. V. m. §§ 133, 157 BGB".
Der Rest der Frage ist fachlich stark: die Abgrenzung zu § 377 HGB ist ausdrücklich und richtig
gezogen — hier wird ein Fehler vermieden, den viele Lernmaterialien machen.

### B10 · M07-603 — ein Unterstrich zu viel erzeugt ein sichtbares Zeichen im Fragetext
Der vierte Platzhalter ist mit **vier** Unterstrichen geschrieben (`____`), die übrigen drei mit
drei. `R_TYP.dropdown` (app_loeser.js:344) zerlegt den Fragetext mit `f.frage.split("___")` —
der überzählige Unterstrich bleibt als Zeichen stehen und erscheint hinter dem vierten
Auswahlfeld. Die Frage ist lösbar, sieht aber falsch aus.
**Poolweit nachgescannt:** nur zwei Fragen haben vier oder mehr Unterstriche — M07-603 und
**M04-308** (`_____`). M04-308 ist vom Typ `mc` und wird nicht gesplittet, dort ist der Unterstrich
reine Textauszeichnung. **M07-603 ist der einzige echte Fall.**

### B11 · M07-302 — 100 VM-Stunden im Monat, die 24/7 laufen
Der Fragetext sagt „mietet … **100 Virtual-Machine-Stunden pro Monat**" und im nächsten Satz
„Die VMs sind konfiguriert und **laufen 24/7**". 24/7 sind rund 720 Stunden im Monat, nicht 100.
Für die gestellte Frage (Vertragsart) ist die Zahl belanglos, aber sie steht falsch da.
→ Vorschlag: entweder „100 VM-Stunden" streichen oder „laufen 24/7" durch „werden bedarfsweise
gestartet" ersetzen.

### B12 · M07-604 — Musterlösung und Erklärung nennen verschiedene Umsatzspannen
`musterloesung`: „Monatlich **2.000–3.000 €** … Wartung über 5 Jahre = **120.000–180.000 €**".
`erklaerungLang`: „kann **2.000–5.000 €**/Monat generieren … Über 5 Jahre sind das
**120.000–300.000 €**". Beide Rechnungen stimmen für sich (× 60 Monate), die Spannen widersprechen
sich. → auf eine Spanne festlegen.

### B13 · M07-537 — Überstundenzuschlag gegenüber dem Kunden
Die Aufgabe rechnet Mehraufwand dem Kunden mit dem **1,5-fachen Stundensatz** ab. Der
Überstundenzuschlag ist eine arbeitsrechtliche Größe im Verhältnis Arbeitgeber–Arbeitnehmer; im
Kundenverhältnis wird Mehraufwand üblicherweise zum vereinbarten Satz abgerechnet, ein Zuschlag
müsste ausdrücklich vereinbart sein. → Vorschlag: im Fragetext ergänzen „laut Vertrag werden
Stunden über dem Angebot mit dem 1,5-fachen Satz abgerechnet".
Die Rechenwege selbst sind korrekt und die Wertebereiche gut gewählt (`ist` 65–95 gegen `soll`
30–60 — Überstunden werden nie negativ).

### B14 · M07-536 — verwaister Firmenname nur im Merksatz
„Merke: Die **Krummhoern Hostingpartner GmbH** muss abwägen: Ist höhere Verfügbarkeit die Kosten
wert?" — die Firma kommt im Fragetext überhaupt nicht vor. M07-543 macht es richtig und nennt die
Wangerland Serverhosting GmbH schon in der Aufgabe. Gehört zu den 17 verwaisten Firmennamen
(offener Punkt 5).

### B8 · M07-112 — 20 Multiplikatoren schulen je 75 Kollegen
`musterloesung`: „Bei Windows-11-Migration werden 20 Power-User geschult und schulen **je 75
Kollegen**." Das sind 1.500 Anwender und eine Betreuungsspanne, die dem Verfahren widerspricht —
M07-032 nennt für 120 Beschäftigte an fünf Standorten je Standort einen Multiplikator, also rund
24 je Person. → Vorschlag: „je 15 Kollegen" (= 300 Anwender) oder die Zahl streichen.

---

## C · SPRACHE, SCHREIBWEISE, KONSISTENZ

| Nr. | ID | Befund | Vorschlag |
|---|---|---|---|
| C1 | M07-011 | Fragetext: „wie Sie mit einem Mitarbeiter umgehen **würde**" | „umgehen **würden**" |
| C2 | M07-013 | `erklaerungLang`: „**Schadersatz**" | „Schadensersatz" (poolweit einzige Fundstelle) |
| C3 | M07-016 | `musterloesung`: „**Verbessermaßnahmen**" | „Verbesserungsmaßnahmen" (poolweit einzig) |
| C4 | M07-012 | `erklaerungKurz`: „unwirtschaftliche **Projekten**" | „unwirtschaftliche Projekte" |
| C5 | M07-012 | Lückenlösung sagt „**Geplante** Kosten", `erklaerungKurz`/`Lang` sagen „**Angebotene** Kosten" | eine Bezeichnung durchziehen |
| C6 | M07-053 | „**Schadenersatz**" ohne Fugen-s; Pool nutzt 19× „Schadensersatz", nur M04-019 und M07-053 anders | vereinheitlichen (M04-019 mitnehmen — M04 ist seit Etappe 1 durch, daher **Entscheid nötig**) |
| C7 | M07-053 | „32 **GByte**" / „16 **GByte**"; Pool nutzt sonst „GB". Nur M03-050 schreibt ebenfalls GByte/MByte | auf „GB" vereinheitlichen? |
| C8 | M07-016 | „Dies ist nicht nur ein **PM**-Prozess" — Abkürzung nicht ausgeschrieben. Der Abkürzungs-Wächter liest nur `f.frage` und schlägt deshalb nicht an | „Projektmanagement-Prozess" |
| C9 | M07-018 | „Detaillierte **biographische** Daten des **Kundenbetriebs-Leiters**" | „biografische Daten der Leitung des Kundenbetriebs" |
| C10 | M07-011 | „**Kolleg:innen**" — Gender-Doppelpunkt; poolweit nur hier und in M07-112 | Entscheid: beibehalten oder auflösen |
| C11 | M07-004 / M07-013 | Beispiel einmal „**Cisco statt D-Link**", einmal „**D-Link statt Cisco**" — dieselbe Sache in zwei Richtungen; zugleich zwei der 17 verwaisten Firmennamen (offener Punkt 5) | Richtung angleichen oder Marken durch „Hersteller A/B" ersetzen |
| C12 | M07-114 | „ein neues, **anderesThema**" — fehlendes Leerzeichen. **Poolweit nachgescannt: einzige echte Fundstelle** (die übrigen 20 Treffer sind SVG-Attribute wie `markerWidth`, Produktnamen wie `DisplayPort`/`LibreOffice` oder UML-/Code-Bezeichner) | „anderes Thema" |
| C13 | M07-109 | `erklaerungKurz` schreibt „Chief Security Officer (**CSO**)", `erklaerungLang` „**CISO** = Chief Information Security Officer" — zwei Kürzel für dieselbe Rolle in einer Frage | auf CISO vereinheitlichen |
| C14 | M07-110 | „Prokura ist gesetzlich definiert in **§ 48 ff. HGB**" — bei „ff." gehört das doppelte Paragrafenzeichen hin; die `paare` derselben Frage schreiben korrekt „§§ 48 ff. HGB" | „§§ 48 ff. HGB" |
| C15 | M07-112 | „Kosteneinsparnis – **externe Trainer sparen sich**" | „externe Trainer entfallen" |
| C16 | M07-101 u. a. | „99,5**%**" ohne schmales Leerzeichen im selben Text, der sonst „99,5 %" schreibt; ebenso „**z.B.**" statt „z. B." in M07-104, M07-107, M07-109, M07-110, M07-112, M07-113, M07-115 | im Korrekturlauf mitziehen (rein typografisch, kein Wächter greift) |
| C17 | M07-204 | „Bremser: … mahnt zur **Bedacht**" | „mahnt zur Vorsicht" |
| C18 | M07-204 | „**Bedenken ernsthafte Argumente berücksichtigen**" — Satz ohne Struktur | „Bedenken als ernsthafte Argumente berücksichtigen" |
| C19 | M07-204 | „10-15%" / „30%" mit Bindestrich und ohne Leerzeichen; der Pool schreibt sonst „10–15 %" | angleichen |
| C20 | M07-202 | „(**§ 640 ff. BGB**" — bei „ff." doppeltes Paragrafenzeichen, gleiche Klasse wie C14 | „§§ 640 ff. BGB" |
| C21 | M07-302 | Fragetext „Ein Cloud-Service-Anbieter **mietet der** … GmbH 100 VM-Stunden" — der Anbieter vermietet, der Kunde mietet | „vermietet an" |
| C22 | M07-302 | `erklaerungKurz`: „definierten **Verfügbaritskennzahlen**" | „Verfügbarkeitskennzahlen" |
| C23 | M07-302 | Verweistitel „**Moderne** Servicevertrag" | „Moderner Servicevertrag" |
| C24 | M07-305 | Fragetext: „Der Auftraggeber **teste** die Switches selbstständig" | „testet" |
| C25 | M07-310 | „Service-Credits sind automatische **Rabatten**/Gutschriften" | „Rabatte" |
| C26 | M07-310 | Staffel „99,9 %-99,5 %: 5 %" dann „**99 %-99,4 %**: 10 %" — zweite Zeile aufsteigend statt absteigend | Reihenfolge angleichen |
| C27 | M07-314 | „Die **Roherstellung** kostet nur 34.000 EUR" · „**Manualarbeiten** reduziert" | „Grundkosten" · „manuelle Arbeiten" |
| C28 | M07-601 | „kann den Drucker remote via SSH **in das Netzwerk … zugreifen**" · D2 „kann **telefon** … erfolgen" | „auf den Drucker … zugreifen" · „telefonisch" |
| C29 | M07-601 | „**Teamviewer**" als Produktname in der Distraktorerklärung — gehört zu den verwaisten Firmennamen (offener Punkt 5) | „ein Fernwartungswerkzeug" |
| C30 | M07-602 | „**Up-Selling**" mit Bindestrich, M07-114/205 schreiben „Upselling" · „Upgrade zu **besserer/teurerem** Produkt" | vereinheitlichen · „zu einem besseren/teureren Produkt" |
| C31 | M07-604 | „Up-Selling/Cross-Selling **easier**" · „**Quartalweise** vor-Ort Checks" · „**Festplatte-Belegung**" | „leichter" · „Quartalsweise" · „Festplattenbelegung" |
| C32 | M07-606 | „Leitbild **codifiziert** Werte" | „kodifiziert" |
| C33 | M07-461 | „**essentiell** für die Geschäftskontinuität"; M07-007 schreibt „essenzielle" | „essenziell" |
| C34 | M07-537 | Schritt 2: „Anzahl der Überstunden (**Istunden** - Sollstunden)" | „Iststunden" |
| C35 | M07-543 | Fragetext rundet die Verfügbarkeit auf **2** Dezimalstellen (`\|2`), `erklaerungKurz` und `erklaerungLang` auf **1** (`\|1`) — derselbe Wert erscheint als „99,90 %" und „99,9 %" | einheitlich `\|2` |
| C36 | M07-760 | `erklaerungKurz`/`Lang` schreiben „{s1} / {sollk} **x** 100" mit kleinem x statt „×" | ⚠️ **NICHT per Regex** — siehe die Lehre im START_PROMPT; hier gezielt ersetzen |
| C37 | M07-950 | „hat damit höchste Priorität **-** hier läuft zusätzlich eine vertragliche Frist" — Bindestrich statt Gedankenstrich | „–" |
| C38 | M07-700/704/705/706 | Diese vier schreiben durchgängig „**Verjährungsfrist für Mängelansprüche**", während M07-005/107/202/304 „Gewährleistungsfrist" sagen. Juristisch ist die 700er-Fassung präziser | Entscheid: eine Fassung durchziehen |

**Ausdrücklich NICHT als Befund vorgetragen** (poolweiter Bestand, gemessen):
gerade Apostrophe in 254 Fragen und Geviertstrich `—` in 144 Fragen sind **keine M07-Eigenheit**.
Innerhalb von M07 ist es allerdings gemischt: M07-015/017 setzen `'best-effort'`, M07-029/030/034
setzen `„…"`. Eine Vereinheitlichung wäre ein eigener, poolweiter Griff — kein Thema für Etappe 3.

---

## D · GEPRÜFT UND OHNE BEFUND (damit es nicht zweimal geprüft wird)

* **M07-009 (bild, Matrixorganisation).** SVG-Koordinaten selbst nachgerechnet: Fachlinie
  waagerecht bei y=167 und y=232 (x von 170 bis 477), Projektlinien senkrecht bei x=290 und x=460
  (y von 122 bis 249), die vier MA-Kreise sitzen exakt auf den vier Kreuzungspunkten
  (290/167, 460/167, 290/232, 460/232), Projektkästen mittig darüber (Mitte 290 bzw. 460).
  **Bild und `erklaerungLang` stimmen überein.** Die Abgrenzung zur Mehrlinienorganisation in der
  Erklärung ist fachlich sauber.
* **M07-006.** „99,9 % = maximal 43 Minuten pro Monat" nachgerechnet: 30 d × 1.440 min = 43.200 min,
  0,1 % = 43,2 min ✓.
* **M07-010.** 48 h × 90 €/h = 4.320 €; 4.320 ÷ 3.600 = 120 %; Mehrkosten 720 € ✓.
* **M07-313.** 63.000 ÷ 60.000 = 105 % ✓ (nur die *Bezeichnung* ist strittig, siehe A2).
* **M07-038 `verweis`.** Sah in der Terminalausgabe nach einem Ersatzzeichen (U+FFFD) aus.
  Codepoints geprüft: `2013` — regulärer Halbgeviertstrich. **Poolweit 0 Treffer für U+FFFD.**
  Kein Befund. (Notiert, weil der Verdacht sonst wiederkommt.)
* **M07-101.** 720 h × 0,005 = 3,6 h = 3 h 36 min ✓. Alle drei Distraktor-Begründungen
  nachgerechnet: 7,2 h = 99 % ✓, 1,8 h = 99,75 % ✓, 5 h = 99,31 % ✓.
* **M07-104.** 20.000 × 0,003 × 8 = 480 ✓, Deckelung 5 % = 1.000 ✓, „ab 17 Werktagen greift die
  Deckelung" ✓ (1.000 ÷ 60 = 16,7). **Die Frage macht alles richtig, was M07-103 falsch macht** —
  sie eignet sich als Vorlage für dessen Korrektur.
* **M07-105, M07-106.** Gewährleistung/Garantie sauber getrennt, §§-Angaben stimmen. Bestätigt
  A5 als echten Einzelfehler in M07-005 statt als durchgängige Unschärfe.
* **M07-111.** Konkurrierende Ziele — bildet mit M07-017 (komplementär) ein sauberes Paar,
  gleiche Struktur, gleiche Distraktoren, gegenläufiges Ergebnis. Absicht, kein Dublettenverdacht.
* **M07-117 SVG-Geometrie** — siehe A10, Koordinaten nachgerechnet und korrekt.
* **M07-201, M07-202.** Beide grenzen ausdrücklich ab, dass **§ 377 HGB beim Werkvertrag nicht
  gilt** — ein Punkt, den viele Lernmaterialien falsch machen. Auch die Beweislastumkehr nach
  der Abnahme ist richtig dargestellt. Nur die Absatzangabe in M07-201 ist zu präzisieren (B9).
* **M07-205.** Upselling/Cross-Selling korrekt abgegrenzt und mit M07-114 widerspruchsfrei.
  Reiner Längen-Tell, kein Sachbefund.
* **M07-707 bis M07-718 — der stärkste Block des Moduls.** Zwölf Fragen zu Organisationsformen,
  Prokura, Handlungsvollmacht und Mietvertrag, **ohne einen einzigen Sachbefund.** Alle
  Paragrafenangaben einzeln geprüft und korrekt: § 48 Abs. 1 (Erteilung), § 49 Abs. 1/2 (Umfang,
  Grundstücke), § 52 Abs. 1/2 (Widerruf, Nichtübertragbarkeit), § 53 Abs. 1 (Anmeldung,
  deklaratorisch), § 54 Abs. 1/2/3 HGB (Umfang, vier Ausnahmen, Schutz des Geschäftsverkehrs),
  §§ 433/535/611/631 BGB. Auch die feinen Punkte stimmen: „eines" gegen „eines derartigen"
  Handelsgewerbes, die deklaratorische Wirkung der Eintragung, „ppa." gegen „i. V.".
* **M07-308.** 31 × 24 = 744 h; 744 × 0,01 = 7,44 h = 7 h 26 min ✓. Alle drei Distraktoren
  nachgerechnet und korrekt begründet (98 % / 99,5 % / 99,75 %).
* **M07-940, M07-941, M07-942.** Alle Summen und Quoten nachgerechnet: 800/−200/0 → 600 ✓;
  11.000 und 11.600 ✓; 1.500 ÷ 20.000 = 7,5 % ✓; 7.500 + 3.200 + 1.300 = 12.000, Gewinn 3.000 ✓.
* **M07-536, M07-543 (rechenassistent).** Formeln und Wertebereiche durchgerechnet:
  `ausfallH` 5–50 ergibt 99,95 % bis 99,50 %; 8.760 × 0,05 / 100 = 4,38 h → 262,8 min ✓.
  M07-537: `ist` 65–95 gegen `soll` 30–60 — Überstunden können nie negativ werden ✓.
* **M07-950 (matrix).** Gegen die drei inhaltlichen Wächter aus `test_matrix` geprüft: jedes der
  vier Elemente enthält eine konkrete Zahl (500 Nutzer · 4-mal im Monat · 1 Nutzer · 30 Minuten
  SLA · fünf Minuten · 499 Arbeitsplätze) ✓, kein Beispielmotiv mehrfach ✓, die Kurzerklärung
  greift die Zahlen auf („500 gegen 1") ✓. Die Quadrantenzuordnung ist sachlich stimmig.
* **M07-933 (szenario2) hat kein `feedback2`.** Das ist **kein Befund** — laut `START_PROMPT.md`
  ist das die Bauart aller 17 szenario2-Fragen. Der Verdacht wurde in M01 schon einmal entkräftet.
* **M07-712 `erklaerungLang`.** Sah in der Terminalausgabe nach zwei Ersatzzeichen vor
  „52 Abs. 2 HGB" aus. Codepoints geprüft: `a7` — reguläres Paragrafenzeichen. **Kein Befund.**
  (Zweiter Fehlalarm derselben Art nach M07-038; die Terminaldarstellung ist hier nicht zuverlässig,
  gemessen wird über Codepoints.)
* **M07-701 (beschriftung).** SVG-Geometrie nachgerechnet: Verteilerlinie y=120 von x=120 bis 280,
  Abzweige exakt auf den Kastenmitten 120 und 280; Stabsstelle gestrichelt seitlich bei y=84 ✓.
* **M07-931 (kreuztabelle).** Alle vier Zuordnungen korrekt, auch der Grenzfall „Reparatur eines
  Druckers mit garantierter Funktion" → Werkvertrag ✓.
* **M07-019 … M07-024, M07-025 … M07-042, M07-050 … M07-052** — die Stufe-1- und
  Einweisungs-Fragen sind inhaltlich durchweg korrekt und ungewöhnlich sauber formuliert;
  § 640 BGB (fiktive Abnahme), § 377 HGB (Rügepflicht), die Stufung der Mängelrechte und die
  Abgrenzung wesentlicher/unwesentlicher Mangel sind alle richtig dargestellt.

---

## E · WAS ENTSCHIEDEN WERDEN MUSS

1. ~~**A2 – Begriff „Kostenabweichung".**~~ ✅ **Durch A24 entschieden, kein Entscheid mehr nötig** —
   sieben M07-Fragen führen die richtige Terminologie bereits. Vorschlag: in M07-012 und M07-313
   „Kostenabweichung" → „Nachkalkulationsquote". Zahlen und richtige Antworten bleiben. **Bitte nur
   noch bestätigen.**
2. **A3.5 – „Einweisung & Schulung" ohne Fundort im Modul.** Verweise auf 7.6 umhängen (nominell
   zuständig, inhaltlich leer), auf 7.7 belassen, oder das Modulmaterial ergänzen (eigener Griff)?
3. **A3.2/A3.3/A3.4 – die übrigen 48 Verweise.** In diesem Lauf mit erledigen, oder als eigener
   Griff über alle Module? Die Fehlerklasse ist mit hoher Wahrscheinlichkeit **nicht** auf M07
   beschränkt — für M01/M02/M03 wurde sie in den bisherigen Läufen nicht gegen die Modul-Dateien
   geprüft.
4. **C6/C7 – Schreibweisen, die auch M03 und M04 betreffen.** Mitnehmen oder liegen lassen?
5. **B4 – Leasing-Beschreibung.** Vereinfachung stehen lassen oder schärfen?
6. **C10 – Gender-Doppelpunkt** in M07-011 und M07-112.
7. **C11 – Firmennamen Cisco/D-Link.** Teil der 17 verwaisten Firmennamen (offener Punkt 5).
8. **A10 – M03-533 mitnehmen?** Die Fehlerklasse „Frage-ID im Lernertext" hat genau zwei
   Fundstellen; die zweite liegt in einem Modul, das seit dem 27.07. als durch gilt.
9. **A7 – M07-103: Zahlen ändern oder nur die Rechnung korrigieren?** Nur die Rechnung zu
   korrigieren lässt die Frage bestehen, in der die Deckelung nichts bewirkt. 15 Werktage statt 10
   macht sie erst zu der Frage, die sie sein will — ändert aber den Fragetext.
10. **M07-008 als Längen-Tell stehen lassen?** 30 gegen 29 Zeichen, beide Optionen sind reine
    Dreier-Aufzählungen. Gleiche Lage wie bei M01-117 und M03-001/002, die stehen bleiben durften.
11. **A17 – M07-306 neu bauen oder streichen?** Sie ist inhaltsgleich mit M07-441 und hat zusätzlich
    den falschen Aufgabentyp. In M02 lautete der Entscheid „inhaltlich neu bauen".
12. **A22 – Leasing.** M07-003 an M07-716/717 angleichen (empfohlen) oder umgekehrt?
13. **C38 – „Gewährleistungsfrist" oder „Verjährungsfrist für Mängelansprüche"?** Der Pool führt
    beide Fassungen. Die zweite ist juristisch genauer, die erste im IHK-Sprachgebrauch verbreiteter.
14. **A15 / A4 – Welche Lösungszeit gilt für Standard-Tickets?** M07-006 sagt 4 Stunden,
    M07-309 sagt 24 Stunden (4 h für Critical). Eine Zahl muss weichen.

---

## G · WIE DER KORREKTURLAUF ABLAUFEN SOLLTE (Vorschlag, noch nicht ausgeführt)

1. **Sicherung:** `cp -r pool /tmp/pool_backup` vor der ersten Änderung.
2. **Inhalt** (A1–A24) — die Rechen- und Rechtsfehler zuerst: A6, A7, A9, A16, A19, A24.
3. **Sprache** (C1–C38) per gezieltem String-Ersatz im Rohtext, Block je Frage von `"id": "M07-NNN"`
   bis zur nächsten ID abgrenzen, auf **genau eine** Fundstelle prüfen, `json.loads` als Syntaxprobe
   **vor** dem Schreiben. ⛔ **Nicht über `json.load`/`json.dump`** — das formatiert alle Pool-Dateien
   um (37.000 Diff-Zeilen am 27.07.). ⛔ **C36 nicht per Regex** — die „Ziffer x Ziffer"-Regel ist
   am 27.07. schon einmal danebengegangen.
4. **NEU MESSEN.** Die Faktor-Tabelle in Abschnitt 0 ist danach überholt — in M02 und M03 hatte sich
   je ein Treffer durch die inhaltliche Korrektur von selbst erledigt. Zu erwarten ist das hier bei
   **M07-118** (die Erklärung wird umgeschrieben) und **M07-103** (Zahlen ändern sich).
5. **Längen** zuletzt. Ziel laut START_PROMPT: **Gleichstand ±15 %, mindestens ein Distraktor über
   der richtigen Antwort.** Nie die richtige Antwort kürzen. Bei M07-203, M07-205, M07-201 und
   M07-103 müssen die Distraktoren wachsen — dort sind sie 20 bis 41 Zeichen lang.
6. `python3 build_fragen.py` → **Drift 0** → `bash tools/suite.sh` für die betroffenen Suiten →
   `bash check.sh block start` / `weiter` / `ende`.
7. ⚠️ **Den M07-Fall in `pool_faelle.json` nicht vergessen** — er zählt nicht in die 133.
8. **Kein Version-Bump.** Der gehört ans Ende von Etappe 3, nach M08.

---

## F · VORGEMERKT FÜR SPÄTERE MODULE (hier gefunden, dort zu erledigen)

* **M08-603 — zwei erfundene Gesetzeszitate zu § 623 BGB, darunter ein Verweis auf einen nicht
  existierenden Absatz 2.** Siehe A8. M08 steht in Etappe 3 noch aus.
* **M03-533 — Frage-ID „M03-953" im Lernertext.** Siehe A10.
* **M04-019 — „Schadenersatz" ohne Fugen-s.** Siehe C6.

---

## H · KORREKTURLAUF 28.07.2026 — WAS TATSÄCHLICH GEÄNDERT WURDE

**Nutzer-Entscheide vom 28.07. (nicht erneut vortragen):**

* Umfang: **Inhalt + Sprache, ohne die Verweis-Felder.**
* Die **50 falschen `verweis`-Felder** werden ein **eigener poolweiter Griff** über alle Module —
  für M01/M02/M03 wurde diese Prüfung nie gemacht.
* **M07-306 inhaltlich neu gebaut** (nicht gestrichen), wie schon bei den M02-Dubletten.
* Aus anderen Modulen **nur M08-603** mitgenommen. M03-533 und M04-019 bleiben in Abschnitt F stehen.
* **M07-103 auf 15 Werktage** — damit die Deckelung tatsächlich greift.
* **M07-309 gilt:** 4 h Lösungszeit bei hoher Priorität, 24 h bei Standard. M07-006 wurde
  entsprechend geschärft, die Lücken-Lösung 4 bleibt und ist jetzt eindeutig.
* **M07-008 bleibt als Längen-Treffer stehen** (30 gegen 29 Zeichen, reine Aufzählungen) —
  wie M01-117 und M03-001/002.
* Sprachpunkte alle mitgenommen: Leasing angeglichen, Firmennamen entfernt, Gender-Doppelpunkt
  aufgelöst, auf „Verjährungsfrist für Mängelansprüche" vereinheitlicht.

**Ergebnis der Messung — Reihenfolge eingehalten (Inhalt → Sprache → NEU MESSEN → Längen):**

| Schritt | Tell in M07 | poolweit |
|---|---|---|
| vorher | 21 von 45 | 47 von 285 = 16,5 % |
| nach Inhalt + Sprache, vor dem Längenlauf | **21** (Faktoren verschoben) | – |
| nach dem Längenlauf | **1 von 45** (nur M07-008) | **27 von 285 = 9,5 %** |

⚠️ **Der Nenner ist unverändert 285 geblieben** — echte Korrektur, keine Verdünnung, keine neue
mc-Frage. Die eine neu gebaute Frage (M07-306) ist eine `zuordnung` und geht nicht in den Zähler ein.

⚠️ **Die Vorabmessung hat sich wieder als überholt erwiesen — zum vierten Mal in Folge.**
Nach dem Inhalts- und Sprachlauf standen zwar weiterhin 21 Treffer, aber mit **verschobenen
Faktoren**: M07-018 stieg von 1,34 auf 1,45 und M07-005 von 1,12 auf 1,17, **weil die Korrekturen
die richtige Antwort verlängert haben** — „Gewährleistungszeit" wurde zu „Verjährungsfrist für
Mängelansprüche", „biographische Daten des Kundenbetriebs-Leiters" zu „biografische Angaben zur
Leitung des Kundenbetriebs". M07-201 und M07-118 fielen umgekehrt leicht.
**Lehre für M08: Eine sprachliche Korrektur an einer Antwortoption ist immer auch ein Längeneingriff.**

**Gegenprobe „nicht über das Ziel hinausschießen":** Nach dem ersten Längenlauf lagen sechs
Distraktoren über dem Ziel von 1,15 × der richtigen Antwort (M07-107 mit 1,31, M07-205 mit 1,22,
M07-018 mit 1,20). **Alle drei wurden zurückgenommen.** Beim Zurücknehmen von M07-107 entstand
kurzzeitig ein neuer Treffer (102 gegen 104) — auch das gemessen und behoben.
Es verbleiben vier Fragen über 1,15, die **nicht angefasst wurden und Bestand sind**:
M07-014 (1,54), M07-015 (1,50), M07-024 (1,18), M07-116 (1,17). Der Wächter meldet das nicht,
weil er nur „richtige ist die längste" misst. **Für einen späteren Griff vorgemerkt.**

**Prüfung nach dem Lauf:**
`build_fragen.py` → 1073 Fragen, 9 Fälle · `validate_pool` OK · `validate_schema` OK ·
`pool_query idcheck` OK · `fakten_check` 0 Verdachtsfälle.
**18 Suiten selbst gefahren, alle grün:** didaktik (32), meta (75), abk (20), glossar (24),
rechner (123), matrix (31), stufen (46), wirtschaft (32), freitext (38), teilpunkte (19),
diagnose (76), engine (70), logik (2158), registry (118), render_smoke (21), adaptiv (49),
abruf (21), bereitschaft (36).

**Diff-Kontrolle:** Geändert wurden `pool_m07.json` (385 Zeilen), `pool_m08.json` (1 Zeile,
M08-603), `pool_m_ausbau.json` (M07-760), `pool_m_transfer.json` (M07-770, M07-771).
**Keine andere Frage im Pool ist berührt** — die Blockabgrenzung je `"id"` hat gehalten, es gab
keine Massenumformatierung. Die Datei wuchs um genau eine Zeile.

⚠️ **NICHT ERLEDIGT UND WEITER OFFEN:**
1. **Die 50 `verweis`-Felder** (A3) — eigener poolweiter Griff, siehe Entscheid.
2. **B15/B16** — Formatbruch und zu wenige Distraktoren in M07-750, M07-770, M07-771, M07-401.
   Das sind Umbauten an Aufgabenzuschnitten, keine Korrekturen; gehört in einen eigenen Griff.
3. **Die drei fehlenden `erklaerungLang`** (M07-930, 931, 932) und die **10 fehlenden `verweis`**
   — Nutzer-Entscheid vom 27.07.: eigener Griff, nicht in einem Korrekturlauf.
4. **M03-533 und M04-019** aus Abschnitt F.
