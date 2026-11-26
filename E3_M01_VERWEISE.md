# E3-Probelauf Modul 01 – falsche `verweis`-Ziele (2026-08-04)

**Auftrag:** Nutzer-Entscheid 04.08.2026 – „erst ein Modul als Probe". Ziel ist eine **gemessene**
Fehlerquote statt der Hochrechnung aus einem einzigen Modullauf (M07, 28.07.: 50 von 133 = 38 %).

**Umfang:** alle **125 M01-Fragen**. Davon tragen **109** einen `verweis` mit Abschnittsnummer,
**16** nennen nur ein Thema oder den IHK-Katalog (das ist Fehlerklasse E2, hier nicht behandelt).

---

## A) Das Verfahren – warum die Themenverteilung die Fehler zeigt

Statt 125 Fragen einzeln zu lesen, wurde je Frage das Paar **`thema` → verwiesener Abschnitt**
ausgezählt. Ein Thema, das überwiegend auf 1.1 zeigt und in drei Fällen auf 1.3, hat entweder eine
inhaltliche Ausnahme – oder drei Fehler. Jeder Ausreißer wurde einzeln gegen die Kursdatei geprüft
(Frage lesen, Abschnitt lesen), nicht nach Mehrheit entschieden.

⚠️ **Die Stichwortprobe allein reicht nicht.** Ein Skript, das ein Kernwort des Verweistextes im
verwiesenen Abschnitt sucht, meldete poolweit 218 Verdachtsfälle, davon in M01 **18**. Davon waren
**12 echt** und **6 Fehlalarme** (z. B. M01-104 „Planungswerkzeuge", M01-970 „Netzplantechnik",
M01-120 „Ticketpriorisierung" – Wortwahl des Verweises, nicht des Abschnitts). **Trefferquote der
Heuristik: 67 %.** Sie taugt als Kandidatenfilter, nicht als Urteil.

## B) Die Abschnitte des Moduls (aus `01_Projektmanagement_und_Arbeitsorganisation.md`)

| Abschnitt | Inhalt laut Kursdatei |
|---|---|
| **1.1** | Projektmerkmale · Strukturplan/Netzplan/**Gantt** · Netzplan-Rechenbeispiel · **Wasserfall vs. SCRUM** · **Tuckman-Teambildung** · **Reflektionsmethoden** · **SMART** |
| **1.2** | **Machbarkeitsanalyse** · **Vor-/Nachkalkulation** · Stakeholderanalyse · Risikoanalyse |
| **1.3** | Kundenkommunikation · Fehler-/Störungsmanagement · Ticketsystem · KI-Support · Support-Levels |

## C) Die zwölf Befunde – alle korrigiert

| ID | Thema | war | ist | Begründung |
|---|---|---|---|---|
| M01-481 | Gantt & PSP | 1.2 | **1.1** | Gantt steht in 1.1; die übrigen 17 Fragen des Themas zeigten längst dorthin |
| M01-023 | Machbarkeit & Kalkulation | 1.3 | **1.2** | Vor-/Nachkalkulation ist ein eigener Abschnitt in 1.2 |
| M01-024 | Machbarkeit & Kalkulation | 1.3 | **1.2** | Machbarkeitsanalyse steht in 1.2 |
| M01-052 | Machbarkeit & Kalkulation | 1.3 | **1.2** | dito, mit magischem Dreieck |
| M01-552 | Risiko & Stakeholder | 1.3 | **1.2** | ⚠️ Eisenhower kommt im Modul **gar nicht** vor – nächstliegender Abschnitt nach Entscheid Option 1 |
| M01-019 | SMART-Ziele | 1.2 | **1.1** | SMART steht in 1.1 |
| M01-020 | SMART-Ziele | 1.2 | **1.1** | dito |
| M01-431 | Scrum & Wasserfall | 1.2 | **1.1** | „Projektphasen: Wasserfallmodell vs. SCRUM" ist 1.1 |
| M01-601 | Teambildung & Reflexion | 1.3 | **1.1** | Tuckman-Modell steht in 1.1 |
| M01-602 | Teambildung & Reflexion | 1.3 | **1.1** | dito |
| M01-603 | Teambildung & Reflexion | 1.3 | **1.1** | Retrospektive/Lessons Learned stehen unter „Reflektionsmethoden" in 1.1 |
| M01-604 | Teambildung & Reflexion | 1.3 | **1.1** | Storming-Konflikte gehören zum Tuckman-Abschnitt in 1.1 |

**Stand danach:** Jedes M01-Thema zeigt auf **genau einen** Abschnitt, und jeder Abschnitt trägt
den Stoff wirklich.

## D) Die gemessene Fehlerquote

**12 von 109 Fragen mit nummeriertem Verweis = 11,0 %.**

Hochgerechnet auf die **823 nummerierten Verweise** des Pools: **rund 90 falsche Ziele.**
⚠️ **Das ist eine Hochrechnung aus EINEM Modul** – genau der Fehler, vor dem START_PROMPT bei der
alten 38-%-Schätzung warnt.

**Gemessene Verteilung der Heuristik-Verdachtsfälle nach dem M01-Lauf (Summe 208):**

| Modul | M01 | M02 | M03 | M04 | M05 | M06 | M07 |
|---|---|---|---|---|---|---|---|
| Verdachtsfälle | 11 | 12 | 39 | **82** | 9 | 15 | 40 |

⚠️ **Die 11 in M01 sind nachweislich ALLE Fehlalarme** – jeder einzelne wurde in diesem Lauf
geprüft. Sie entstehen, wenn der Verweistext ein Wort benutzt, das der Abschnitt nicht wörtlich
führt („Zielformulierung", „Planungswerkzeuge", „Pufferberechnung"). **Nach einer sauberen
Korrektur bleibt die Heuristik also NICHT bei null stehen** – wer sie als Wächter einsetzen will,
braucht erst eine Ausnahmeliste oder ein besseres Kriterium.
⚠️ **M04 sticht mit 82 heraus** – ob das an echten Fehlern oder an der Wortwahl der Verweise liegt,
ist NICHT gemessen. **Das nächste Probemodul sollte M04 sein, nicht das nächste in der Reihe.**

## E) Was dabei nebenbei auffiel – nicht behoben

* **16 M01-Fragen nennen keinen Abschnitt** (5 × KI im Störungsmanagement, 5 × Risiko & Stakeholder,
  3 × Netzplan & Puffer, 2 × Ticketsystem, 1 × Machbarkeit). Das ist **Entscheid E2**, poolweit 132.
* **Die Lernunterlage hat in M01 eine belegte Lücke:** Die **Eisenhower-Matrix** kommt in
  `01_Projektmanagement_und_Arbeitsorganisation.md` **null Mal** vor, obwohl vier Fragen sie prüfen
  (M01-521, M01-552, M01-952 und die Matrix-Fragen). Überbrückt nach Option 1, nicht behoben.
* **Zwei Konventionen nebeneinander:** Ein Teil der Fragen nennt „Abschnitt 1.2 – …", ein anderer
  „Abschnitt Projektmanagement – …" ohne Nummer. Solange beide existieren, findet kein Wächter alle.

## F) Empfehlung für den Rest

Ein **Wächter** wäre nach diesem Lauf billig zu bauen: Jedes `modul|thema` zeigt im sauberen
Zustand auf genau einen Abschnitt – eine Suite kann das erzwingen und meldet jede neue Abweichung
sofort. **Das verhindert den Fehler künftig, korrigiert aber den Bestand nicht.** Beides zusammen
wäre der vollständige Griff; die Reihenfolge ist ein Nutzer-Entscheid.
