# Modul 01 – Projektmanagement und Arbeitsorganisation

## Modulübersicht

Dieses Modul behandelt die Grundlagen des Projektmanagements und der Arbeitsorganisation gemäß IHK-Prüfungskatalog (Fragenkomplex 01). Es verbindet theoretische Methoden der Projektplanung mit praxisorientierter Anwendung im IT-Umfeld. Das Verständnis von Projektstrukturen, Machbarkeitsbewertungen und professioneller Arbeitsabwicklung ist zentral für die Abschlussprüfung Teil 1 (20 % Gewichtung, 90 Min).

## Inhaltsverzeichnis
- 1.1 Merkmale und Methoden des Projektmanagements
- 1.2 Machbarkeit und Wirtschaftlichkeit von Projekten
- 1.3 Arbeitsaufgaben im Rahmen von Geschäfts- und Leistungsprozessen

---

## 1.1 Merkmale und Methoden des Projektmanagements

**Einordnung:**
Fragenkomplex 01 (Taxonomiestufe: kennen, beurteilen, anwenden können). Projektmanagement ist Kernkompetenz bei der Planung und Durchführung von IT-Arbeitsaufgaben; die IHK erwartet sichere Beherrschung von Planungsmethoden und Phasenmodellen.

### Merkmale eines Projektes

Ein Projekt ist durch folgende Charakteristika definiert — sie stammen aus der
**DIN 69901**, der deutschen Norm für Projektmanagement, und werden in der Prüfung oft
ausdrücklich danach gefragt:
- **Einmaligkeit**: Kein Serienprodukt, jedes Projekt ist einzigartig
- **Zielvorgabe**: Klare, definierte Ziele (z. B. „Netzwerk in Zweigstelle einrichten")
- **Zeitliche Begrenzung**: Festgelegte Start- und Endtermine
- **Begrenzte Ressourcen**: Budget, Personal, Material sind limitiert
- **Komplexität**: Mehrere Teilaufgaben, Abhängigkeiten zwischen Arbeiten
- **Projektspezifische Organisation**: Eigens für das Projekt gebildetes Team mit klarer Struktur

### Projektplanung mit Strukturplan, Netzplan und Gantt-Diagramm

#### Strukturplan
- Hierarchische Zerlegung des Gesamtprojekts in Arbeitspakete (Work Breakdown Structure, WBS)
- Ermöglicht Übersicht, Kostenschätzung, Ressourcenverteilung
- Baumstruktur: Projekt → Phasen → Arbeitspakete → Tätigkeiten
- **Arbeitspaket:** die unterste Ebene des PSP, die nicht weiter zerlegt wird. Es hat ein festgelegtes Ergebnis, einen Verantwortlichen, einen Termin und einen geschätzten Aufwand – darauf bauen Kostenplanung und Netzplan auf.
- **Gliederungsarten:** objektorientiert (nach Bestandteilen des Ergebnisses, z. B. Server, Netzwerk, Clients), funktionsorientiert (nach Tätigkeiten, z. B. Beschaffen, Installieren, Testen), phasenorientiert (nach Projektphasen, z. B. Analyse, Umsetzung, Abnahme). Gemischte Formen sind üblich.
- **Codierung:** Jedes Element erhält eine Nummer nach seiner Lage im Baum (z. B. 2.3 = drittes Arbeitspaket im zweiten Teilprojekt).
- ⚠️ Der PSP zeigt, **was** zu tun ist – keine Reihenfolge und keine Dauern. Die kommen erst im Netzplan und im Gantt-Diagramm dazu.

#### Netzplan (Zeitpunkt-Methode, IHK-Standard)
Zur **Terminplanung** werden folgende Parameter berechnet:

| Parameter | Bedeutung |
|-----------|-----------|
| **FAZ** | Frühester Anfangszeitpunkt (Vorwärtsrechnung) |
| **FEZ** | Frühester Endzeitpunkt (FEZ = FAZ + Dauer) |
| **SAZ** | Spätester Anfangszeitpunkt (Rückwärtsrechnung) |
| **SEZ** | Spätester Endzeitpunkt |
| **GP** | Gesamtpuffer = SAZ − FAZ (oder SEZ − FEZ) |
| **FP** | Freier Puffer = FAZ(Nachfolger) − FEZ(aktuell) |

**Kritischer Weg (KW), auch kritischer Pfad (englisch *critical path*):** Kette von Vorgängen ohne Pufferzeit (GP = 0); bestimmt die Gesamtprojektdauer. ⚠️ **Beide Bezeichnungen meinen dasselbe** und kommen in Prüfungsaufgaben nebeneinander vor.

**Lösungsmöglichkeiten bei Terminproblemen:**
- Parallelisierung (Aufgaben nebeneinander statt hintereinander) – spart Zeit, erhöht aber das Risiko, weil ein Vorgang beginnt, bevor sein Vorgänger fertig ist
- Ressourcenumschichtung: zusätzliche Mitarbeiter, Überstunden oder externe Kräfte auf die Vorgänge des kritischen Wegs setzen – das kostet Geld; Personal aus Vorgängen mit Puffer kann dafür abgezogen werden, solange deren Puffer reicht
- Kürzung von Teilaufgaben (Scope Management): Umfang verringern oder Teile in eine spätere Ausbaustufe verschieben – nur in Absprache mit dem Auftraggeber
- Lässt sich der Termin nicht halten: den Auftraggeber frühzeitig informieren und einen neuen Termin vereinbaren
- ⚠️ **Nur Maßnahmen an Vorgängen des kritischen Wegs verkürzen die Projektdauer.** Wer einen Vorgang mit Puffer beschleunigt, gewinnt keinen Tag.

#### Gantt-Diagramm
- Balkendiagramm: y-Achse = Vorgänge, x-Achse = Zeit
- Visualisiert Dauer, Abhängigkeiten, Meilensteine (wichtige Etappenziele)
- Ideal zur Kommunikation mit Stakeholdern

#### SMART-Prinzip für Ziele
- **S**pezifisch: Ziel ist klar und konkret formuliert
- **M**essbar: Ergebnis ist überprüfbar (z. B. Anzahl Server, Verfügbarkeit 99,9 %)
- **A**ttraktiv/Akzeptiert: Ziel wird vom Team unterstützt
- **R**ealistisch: Umsetzbar mit vorhandenen Ressourcen
- **T**erminiert: Fester Endtermin vorhanden

### Rechenbeispiel: Netzplan mit Zeitpunkt-Methode

**Projekt: „Windows-Rollout für 5 Arbeitsplätze"**

| VG | Tätigkeitsname | Dauer (T) | Vorgänger |
|----|---|---|---|
| A | Hardware-Bestellung | 2 | – |
| B | Windows-Lizenzen beschaffen | 1 | – |
| C | Hardware-Annahme prüfen | 1 | A |
| D | Windows auf Masterimage installieren | 3 | B, C |
| E | Software/Treiber-Tests | 2 | D |
| F | Rollout auf 5 Arbeitsplätze | 2 | E |

**Vorwärtsrechnung (FAZ, FEZ):**

| VG | FAZ | FEZ | Vorgänger |
|----|---|---|---|
| A | 0 | 2 | – |
| B | 0 | 1 | – |
| C | 2 | 3 | A (FAZ = 2) |
| D | 3 | 6 | C (FAZ = 3; B endet 1, hat Puffer) |
| E | 6 | 8 | D (FAZ = 6) |
| F | 8 | 10 | E (FAZ = 8) |

**Projektdauer: 10 Tage**

**Rückwärtsrechnung (SAZ, SEZ):** (Zielendtermin SEZ(F) = 10)

| VG | SAZ | SEZ | Nachfolger |
|----|---|---|---|
| F | 8 | 10 | – |
| E | 6 | 8 | F (SEZ = 8) |
| D | 3 | 6 | E (SEZ = 6) |
| C | 2 | 3 | D (SEZ = SAZ des Nachfolgers = 3; SAZ = 3 − 1 = 2) |
| B | 2 | 3 | D (SEZ = 3; SAZ = 3 − 1 = 2) |
| A | 0 | 2 | C (SEZ = 2; SAZ = 2 − 2 = 0) |

**Puffer:**

| VG | GP (SAZ − FAZ) | FP (FAZ Nachf. − FEZ) | Kritisch? |
|----|---|---|---|
| A | 0 | 0 | ✓ JA |
| B | 2 | 2 | nein |
| C | 0 | 0 | ✓ JA |
| D | 0 | 0 | ✓ JA |
| E | 0 | 0 | ✓ JA |
| F | 0 | – | ✓ JA |

**Kritischer Weg:** A → C → D → E → F (Gesamtpuffer = 0 Tage; Projektdauer = 10 Tage)  
**Puffervorgänge:** B hat 2 Tage Gesamtpuffer (B kann um bis zu 2 Tage verzögert werden, ohne Projektendtermin zu gefährden).

### Projektphasen: Wasserfallmodell vs. Scrum

#### Wasserfallmodell (klassisch)
1. **Anforderungsanalyse**: Anforderungen dokumentieren
2. **Entwurf**: Systemarchitektur planen
3. **Implementierung**: Code schreiben, Systeme aufbauen
4. **Test**: Prüfung auf Fehler
5. **Inbetriebnahme**: Deployment in Produktionsumgebung
6. **Wartung**: Bugfixes, Support

**Merkmale:** Sequenziell, Phase für Phase; Rückkehr zu früherer Phase schwierig; gesamte Anforderung muss am Anfang bekannt sein.

#### Scrum (agil)
- **Sprint**: Iterative Arbeitsblöcke (typisch 1–4 Wochen)
- **Product Owner**: Verwaltet Anforderungen, priorisiert Features
- **Scrum Master**: Prozessverantwortlicher, moderiert Rituale
- **Entwicklungsteam**: Umsetzt Features
- **Product Backlog**: Alle Anforderungen und Verbesserungen
- **Sprint Backlog**: Aufgaben für aktuellen Sprint
- **Daily (Daily Standup)**: Täglich 15 Min Austausch (Was habe ich gemacht? Was mache ich heute? Wo stecke ich fest?)
- **Sprint Review**: Demonstrationen von fertigen Inkrementen
- **Sprint Retrospektive**: Team reflektiert Verbesserungspotenzial

**Merkmale:** Flexibel, iterativ; Anforderungen können sich ändern; regelmäßiges Feedback; kürzere Time-to-Market.

**Vergleich:**
| Aspekt | Wasserfall | Scrum |
|--------|---|---|
| Änderungen | Schwierig, teuer | Erwünscht, flexibel |
| Dokumentation | Umfassend, phasenweise | Schlanker, laufend |
| Kundenkontakt | V. a. am Anfang und Ende | Dauerhaft (über Product Owner) |
| Fehler/Risiken | Werden oft erst spät (Testphase) sichtbar | Werden früh sichtbar (jeder Sprint liefert Ergebnis) |
| Geeignet für | Klare, stabile Anforderungen | Unklare, sich ändernde Anforderungen |

### Phasen der Teambildung (Tuckman-Modell)

1. **Forming (Orientierungsphase)**: Team bildet sich, Rollenklärung, höflich-distanziert
2. **Storming (Konfrontationsphase)**: Konflikte, Machtkämpfe, Widerstände entstehen
3. **Norming (Kooperationsphase)**: Regeln etablieren sich, Zusammenhalt wächst
4. **Performing (Leistungsphase)**: Team arbeitet produktiv, autonom, mit Vertrauen
5. **(Adjourning)**: Projektende, Verabschiedung, Lessons Learned

### Reflektionsmethoden

- **Feedback-Kultur**: Konstruktives, regelmäßiges Feedback im Team (auch 360°-Feedback)
  - **Regeln für den Feedback-Geber:** Ich-Botschaften verwenden („Mir ist aufgefallen …“), konkretes und beobachtbares Verhalten beschreiben statt die Person zu bewerten, zeitnah und möglichst unter vier Augen rückmelden, mit einem Vorschlag für die Zukunft schließen
  - **Regeln für den Feedback-Nehmer:** zuhören und ausreden lassen, nicht rechtfertigen oder verteidigen, bei Unklarem nachfragen, sich bedanken – und selbst entscheiden, was er annimmt
  - **360°-Feedback:** Rückmeldung aus mehreren Richtungen – Vorgesetzte, Kollegen, Mitarbeiter, gegebenenfalls Kunden – plus eine Selbsteinschätzung
- **Lessons Learned**: Dokumentation von Erfolgen und Fehlern nach Projektabschluss (Was lief gut? Was hätte besser laufen können?)
- **Retrospektive (Scrum)**: z. B. „Start – Stop – Continue" (Was anfangen? Was beenden? Was beibehalten?)

### Typische IHK-Aufgabenstellungen

- Netzplan mit Vorgängen vervollständigen, FAZ/FEZ/SAZ/SEZ berechnen, kritischen Weg bestimmen
- Zwei Merkmale eines Projektes nennen und erläutern
- Gantt-Diagramm aus Netzplandaten zeichnen
- Pufferzeit-Berechnung und deren Bedeutung erklären
- Unterschied zwischen Wasserfall und Scrum beschreiben

### Merksätze

- **GP = SAZ − FAZ**: Gesamtpuffer aus Spätestem und Frühestem Anfang
- **Kritischer Weg = Longest Path**: Längste ununterbrochene Vorgangskette bestimmt Projektdauer
- **SMART-Ziele** sind nicht verhandelbar in Projekten
- **Wasserfall = planbar; Scrum = flexibel**

### Selbsttest

1. **Was ist der kritische Weg und warum ist er wichtig?**
   <details><summary>Lösung anzeigen</summary>
   Der kritische Weg ist die längste Vorgangskette ohne Pufferzeit (Gesamtpuffer = 0). Er bestimmt die Gesamtprojektdauer. Verzögerungen auf dem kritischen Weg führen direkt zu Projektverzögerungen. Nicht-kritische Vorgänge haben Pufferzeit und können um diese Dauer verzögert werden, ohne das Projekt zu gefährden.
   </details>

2. **Unterschied zwischen Gesamtpuffer (GP) und Freiem Puffer (FP)?**
   <details><summary>Lösung anzeigen</summary>
   **Gesamtpuffer (GP):** Spielraum, den ein Vorgang hat, ohne den Gesamtprojekttermin zu beeinträchtigen (GP = SAZ − FAZ). **Freier Puffer (FP):** Spielraum, um die Nachfolgevorgänge nicht zu verzögern (FP = FAZ_Nachfolger − FEZ_aktuell). FP ≤ GP, da FP nur den lokalen Effekt berücksichtigt.
   </details>

3. **Nenne die fünf Phasen des Tuckman-Modells der Teambildung.**
   <details><summary>Lösung anzeigen</summary>
   Forming (Orientierung) → Storming (Konfrontation) → Norming (Kooperation) → Performing (Leistung) → Adjourning (Verabschiedung)
   </details>

4. **Wodurch unterscheiden sich Wasserfall und Scrum bei der Behandlung von Änderungen?**
   <details><summary>Lösung anzeigen</summary>
   Im Wasserfallmodell sind Änderungen an Anforderungen schwierig und teuer umzusetzen, da Phase für Phase linear durchlaufen wird. In Scrum werden Änderungen erwartet und flexibel in den nächsten Sprint aufgenommen; das Product Backlog wird laufend angepasst.
   </details>

---

## 1.2 Machbarkeit und Wirtschaftlichkeit von Projekten beurteilen

**Einordnung:**
Fragenkomplex 01 (Taxonomiestufe: beurteilen können). Vor Projektstart muss geklärt werden, ob ein Projekt überhaupt realisierbar und wirtschaftlich sinnvoll ist. Die IHK erwartet praktische Fähigkeit, Machbarkeitsanalysen und Kalkulationen durchzuführen.

### Machbarkeitsanalyse

Eine Machbarkeitsanalyse (Feasibility Study) prüft vier zentrale Dimensionen:

1. **Technische Machbarkeit:**
   - Gibt es Technologien, um die Anforderungen umzusetzen?
   - Sind Schnittstellenprobleme gelöst?
   - Sind Sicherheit und Performance realisierbar?

2. **Wirtschaftliche Machbarkeit:**
   - Liegen geschätzte Kosten unter dem Budget?
   - Amortisiert sich die Investition (ROI, Return on Investment)?
   - Welche Kostenrisiken bestehen?

3. **Organisatorische Machbarkeit:**
   - Hat die Organisation die notwendigen Ressourcen (Mitarbeiter, Zeit, Know-how)?
   - Sind Schnittstellen zu anderen Projekten geklärt?
   - Passen Projekt-Ziele zur Unternehmensstrategie?

4. **Rechtliche/Zeitliche Machbarkeit:**
   - Sind Compliance-Anforderungen erfüllbar (z. B. DSGVO (Datenschutz-Grundverordnung))?
   - Reicht die verfügbare Zeit zur Umsetzung?
   - Existieren vertragliche oder regulatorische Fristen?

### Vor- und Nachkalkulation

**Vorkalkulation (Planung):**
- Geschätzte Kosten und Aufwand vor Projektbeginn
- Basiert auf historischen Daten, Expertenschätzung, Parameterschätzung
- Dient als Budgetvorgabe

**Nachkalkulation (Abrechnung):**
- Tatsächliche Kosten und Aufwand nach Projektabschluss
- Vergleich mit Vorkalkulation zeigt Wirtschaftlichkeit

⚠️ **Eine Abweichung ist erst dann ausgewertet, wenn die URSACHE benannt ist.** Die
wiederkehrenden Ursachen bei IT-Projekten: **Datenqualität und Altlasten** (Bestandsdaten sind
schlechter als angenommen, die Bereinigung dauert länger als geschätzt), **Kompatibilitäts-
probleme**, die zusätzliche Tests erzwingen, und **zu optimistische Schätzungen** ohne Puffer für
komplexe Daten. ►► In der Prüfung genügt die Zahl nicht — **Abweichung in Euro UND Prozent, dann
zwei plausible Ursachen, dann die Lehre für die nächste Vorkalkulation.**

#### Rechenbeispiel: Kalkulation eines IT-Helpdesk-Projekts

**Vorkalkulation:**

| Position | Std./Einheit | Satz | Kosten |
|----------|---|---|---|
| Planung & Konzept | 40 h | 85 €/h | 3.400 € |
| Softwarelizenzen (Ticketsystem) | 12 Monate | 200 €/Monat | 2.400 € |
| Implementierung & Tests | 60 h | 85 €/h | 5.100 € |
| Schulung (3 Mitarbeiter × 8 h) | 24 h | 75 €/h | 1.800 € |
| **Gesamtbudget** | | | **12.700 €** |

**Nachkalkulation (real):**

| Position | Std./Einheit | Kosten (real) | Abweichung |
|----------|---|---|---|
| Planung & Konzept | 45 h | 3.825 € | +425 € |
| Softwarelizenzen | 12 Monate | 2.400 € | ±0 € |
| Implementierung & Tests | 75 h | 6.375 € | +1.275 € |
| Schulung | 20 h | 1.500 € | −300 € |
| **Gesamtkosten (real)** | | **14.100 €** | **+1.400 € (+11,0 %)** |

**Bewertung:** Das Projekt liegt mit **+1.400 €** rund **11 % über Budget** — Planung und
Implementierung waren aufwändiger, die Schulung effizienter als erwartet.
⚠️ **11 % sind keine Kleinigkeit:** Als Faustregel gilt eine Abweichung bis etwa **5 %** als
tolerierbar (siehe Modul 07, Abschnitt 7.7). Hier gehören die Ursachen in die Lessons Learned und
in die nächste Vorkalkulation — die Schätzung für Implementierung war um 25 % zu niedrig.
⚠️ **Nachrechnen ist der Sinn der Übung:** Die Gesamtkosten sind die **Summe der Positionen**
(3.825 + 2.400 + 6.375 + 1.500), die Abweichung ihre Differenz zur Vorkalkulation
(14.100 − 12.700). Wer die Summenzeile nicht nachrechnet, übernimmt jeden Fehler darin.

### Aufgabenpriorisierung: die Eisenhower-Matrix

Wer mehr Aufgaben hat als Zeit, braucht eine Reihenfolge. Die **Eisenhower-Matrix** sortiert
nach zwei Kriterien, die man leicht verwechselt:

- **Dringlichkeit** erkennt man am **Zeitdruck** — läuft eine Frist, entsteht der Schaden jetzt?
- **Wichtigkeit** erkennt man an der **Wirkung auf das Geschäft** — was passiert langfristig,
  wenn es unterbleibt?

| | **dringend** | **nicht dringend** |
|---|---|---|
| **wichtig** | **A – sofort selbst erledigen** | **B – terminieren**, Termin fest einplanen |
| **nicht wichtig** | **C – delegieren** | **D – streichen** (Papierkorb) |

**Beispiele aus dem IT-Alltag:**

- Die Klimaanlage im Serverraum steigt auf 41 Grad → **dringend und wichtig, sofort selbst.**
- Die Migration auf ein sicheres System hat sechs Monate Vorlauf, entscheidet aber über die
  Sicherheit → **wichtig, nicht dringend: terminieren.**
- Eine Routineanfrage mit Frist heute, die jeder im Team beantworten kann → **dringend, nicht
  wichtig: delegieren.**

⚠️ **Die häufigste Falle: dringend mit wichtig gleichzusetzen.** Wer nur nach Dringlichkeit
arbeitet, erledigt den ganzen Tag Quadrant C und kommt nie zu B — genau dort liegt aber die
Arbeit, die spätere Notfälle verhindert.

### Stakeholderanalyse

Stakeholder sind Personen/Gruppen, die vom Projekt betroffen sind oder Einfluss auf es haben.

**Einfluss/Interesse-Matrix (Power-Interest-Grid):**

| | Interesse hoch | Interesse niedrig |
|---|---|---|
| **Einfluss hoch** | Eng managen (Manage Closely) | Zufriedenstellen (Keep Satisfied) |
| **Einfluss niedrig** | Informieren (Keep Informed) | Beobachten (Monitor) |

- **Eng managen (Einfluss hoch, Interesse hoch):** z. B. Geschäftsführung, Auftraggeber → intensive Kommunikation, Entscheidungsbeteiligung
- **Zufriedenstellen (Einfluss hoch, Interesse niedrig):** z. B. Budgetverantwortliche, Betriebsrat → wichtige Infos gezielt liefern, nicht verärgern
- **Informieren (Einfluss niedrig, Interesse hoch):** z. B. betroffene Anwender → regelmäßige Updates
- **Beobachten (Einfluss niedrig, Interesse niedrig):** übrige Beteiligte → minimaler Aufwand

### Risikoanalyse

**Risiko = Eintrittswahrscheinlichkeit (E) × Schadenshöhe (S)**

Klassifizierung:
- **E:** 1 (sehr gering) bis 5 (sehr hoch)
- **S:** 1 (gering) bis 5 (sehr hoch)
- **Risikoprio = E × S:** 1–25 (höher = kritischer)

#### Risikomatrix (Priorisierung)

| Risiko | E | S | Prio (E×S) | Maßnahme (Typ) |
|--------|---|---|---|---|
| Hardware-Lieferung verzögert sich | 3 | 4 | 12 | Vermindern: früh bestellen, Zweitlieferant |
| Ausfall der einzigen Fachkraft | 2 | 5 | 10 | Vermindern: Dokumentation, Wissenstransfer, Vertretung |
| Anforderungsänderung durch Kunden | 4 | 3 | 12 | Akzeptieren: Änderungsprozess (Change Request) vereinbaren |
| Datenverlust bei Migration | 2 | 5 | 10 | Übertragen/Vermindern: externen Dienstleister mit Haftung beauftragen, Backup vorher |
| Einsatz ungetesteter Beta-Software | 3 | 4 | 12 | Vermeiden: nur stabile Version einsetzen |

**Vier Maßnahmentypen:**
1. **Vermeiden (Avoid):** Risiko wird nicht eingegangen (z. B. andere Technologie wählen)
2. **Vermindern (Mitigate):** Eintrittswahrscheinlichkeit oder Schadenshöhe reduzieren
3. **Übertragen (Transfer):** Risiko auf Dritte (z. B. Versicherung, Dienstleister)
4. **Akzeptieren (Accept):** Bewusst akzeptiert, mit Notfallplan (Contingency)

### Typische IHK-Aufgabenstellungen

- Machbarkeitsanalyse durchführen (4 Dimensionen bewerten)
- Vor- und Nachkalkulation vergleichen und Abweichungen analysieren
- Stakeholder in Matrix eintragen und Kommunikationsstrategie ableiten
- Risiken identifizieren, in Matrix eintragen, Maßnahmen vorschlagen
- Risikoprioritäten (E × S) berechnen

### Merksätze

- **Machbar ≠ Wirtschaftlich**: Ein Projekt kann technisch umsetzbar, aber zu teuer sein
- **Risiko = E × S**: Je höher beide Faktoren, desto kritischer das Risiko
- **Nachkalkulation offenbart Schwachstellen**: Abweichungen zur Vorkalkulation zeigen Schätzungsfehler und Optimierungspotenzial
- **Stakeholder-Management verhindert Überraschungen**: Frühzeitiges Einbinden reduziert Widerstand

### Selbsttest

1. **Erkläre die vier Dimensionen der Machbarkeitsanalyse kurz.**
   <details><summary>Lösung anzeigen</summary>
   **Technische:** Sind Technologien vorhanden? **Wirtschaftliche:** Kosten vs. Nutzen? **Organisatorische:** Ressourcen und Strategie? **Rechtliche/Zeitliche:** Compliance und Fristen erfüllbar?
   </details>

2. **Ein Projekt hat geplante Kosten von 50.000 € und tatsächliche Kosten von 48.000 €. Ist das ein Erfolg?**
   <details><summary>Lösung anzeigen</summary>
   Ja, monetär: 4 % unter Budget ist eine positive Abweichung. Aber die Qualität muss geprüft werden: War Scope vollständig? Wurde Zeit gespart oder wurde qualitativ geschnitten? Nachkalkulation allein sagt nicht alles.
   </details>

3. **Ein IT-Manager (hoher Einfluss, hohes Interesse) hat Zweifel am Projekt. Welche Strategie wählst du?**
   <details><summary>Lösung anzeigen</summary>
   Der Manager gehört zur Kategorie „Manage" (Power-Interest-Grid). Strategie: **Intensive Kommunikation**, regelmäßige Updates, aktive Einbindung in Entscheidungen, Bedenken ernst nehmen und lösungsorientiert adressieren. Ziel: Überzeugung und aktive Unterstützung.
   </details>

4. **Wie priorisierst du zwei Risiken: R1 (E=4, S=3) und R2 (E=2, S=5)?**
   <details><summary>Lösung anzeigen</summary>
   R1: 4 × 3 = 12; R2: 2 × 5 = 10. R1 hat höhere Priorität (12 > 10). Allerdings: R2 hat hohe Schadenshöhe (könnte Projekt scheitern lassen), daher sollte auch R2 beobachtet werden. Bei gleicher Priorität würde S (Schadenshöhe) höher gewichtet.
   </details>

---

## 1.3 Arbeitsaufgaben im Rahmen von Geschäfts- und Leistungsprozessen planen, vorbereiten und durchführen

**Einordnung:**
Fragenkomplex 01 (Taxonomiestufe: planen, vorbereiten und durchführen können). Dieses Thema verbindet Projektmanagement mit alltäglicher IT-Service-Erbringung. Die IHK prüft praktische Kommunikations-, Ticket- und Eskalationsfähigkeiten.

### Kundenkommunikation

Professionelle Kundenkommunikation ist Basis aller IT-Serviceaufgaben:

- **Anforderung verstehen:** Aktiv zuhören, Nachfragen stellen, Kundensituation erfassen
- **Erwartungen klären:** Zeitrahmen, Priorität, Budget abstimmen
- **Transparenz:** Regelmäßige Status-Updates, auch bei Problemen
- **Sprache:** Kunden-gerecht erklären (keine Fachjargon-Überflutung)
- **Dokumentation:** Absprachen schriftlich festhalten (Email, Ticket)
- **Problemlösung:** Lösungsvorschläge mit Pros/Contras präsentieren

**Häufige Fehler:** Keine Rückfragen, Versprechungen die nicht haltbar sind, fehlende Updates, Jargon statt Verständlichkeit.

### Fehlermanagement & Störungs-Management

**Störung (Incident):** jede ungeplante Unterbrechung eines IT-Services oder Minderung seiner Qualität – vom ausgefallenen Mailserver bis zum einzelnen Nutzer, der nicht drucken kann. Ziel des Störungs-Managements: den Betrieb so schnell wie möglich wiederherstellen, notfalls mit einem Workaround. Jede Störung wird nach **Dringlichkeit** (wie zeitkritisch?) und **Auswirkung** (Nutzeranzahl, Geschäftsschaden) eingestuft.

**Fehler (Problem):** die Ursache – oder mögliche Ursache – einer oder mehrerer Störungen. Ziel des Fehlermanagements (in ITIL: Problem Management): die Ursache finden und dauerhaft beseitigen. Ist die Ursache analysiert und dokumentiert, aber noch nicht behoben, spricht man von einem **bekannten Fehler (Known Error)**; bis zur Behebung hilft ein dokumentierter Workaround.

| Unterschied | Störung (Incident) | Fehler (Problem) |
|---|---|---|
| Blick | Symptom: Service fällt aus oder ist beeinträchtigt | Ursache hinter einer oder mehreren Störungen |
| Ziel | Betrieb schnell wiederherstellen | Ursache dauerhaft beseitigen, Wiederholung verhindern |
| Beispiel | Mailserver nicht erreichbar | volle Festplatte stoppt den Maildienst immer wieder |
| Typische Maßnahme | Workaround, z. B. Dienst neu starten | Ursachenanalyse (RCA), dauerhafte Lösung |

**Fehler-Management-Prozess:**
1. Fehler dokumentieren (Ticketsystem)
2. Ursache analysieren (Root Cause Analysis, RCA)
3. Behebung planen und testen
4. Implementieren
5. Verifikation und Dokumentation

**Workaround und dauerhafte Lösung:** Ein Workaround (Umgehungslösung) stellt den Betrieb schnell wieder her, beseitigt aber nicht die Ursache – z. B. an einem anderen Drucker drucken. Die dauerhafte Lösung entsteht erst durch die Ursachenanalyse. Wer nur das Symptom behebt (z. B. den Dienst immer wieder neu startet), bekommt denselben Fehler wieder. Lösung und Ursache werden im Ticket bzw. in der Wissensdatenbank festgehalten, damit der nächste Fall schneller gelöst wird.

### Ticketsystem & Ticket-Lebenszyklus

Ein Ticketsystem (z. B. Jira Service Desk, osTicket, Zendesk) strukturiert Support-Anfragen:

**Ticket-Lebens­zyklus (Standard):**

1. **Neu (New)**: Anfrage eingegangen, noch nicht bearbeitet
2. **Offen (Open)**: Bestätigt, wartet auf Bearbeiter
3. **In Bearbeitung (In Progress)**: Techniker arbeitet daran
4. **Gelöst (Resolved)**: Lösung implementiert (Workaround oder endgültige Behebung), wartet auf Kundenbestätigung
5. **Geschlossen (Closed)**: Kunde bestätigt Lösung, Ticket archiviert

**Priorisierung nach:**
- **Dringlichkeit (Urgency):** Wie schnell muss es gelöst sein? 1 (niedrig) bis 4 (kritisch)
  - Kritisch: duldet keinen Aufschub, die Arbeit steht
  - Hoch: Arbeit stark behindert, noch am selben Tag lösen
  - Mittel: Workaround existiert, kann etwas warten
  - Niedrig: nicht zeitkritisch
  
- **Auswirkung (Impact):**
  - Hoch: Gesamtes Unternehmen oder Abteilung betroffen
  - Mittel: Team oder mehrere Nutzer
  - Niedrig: Einzelner Nutzer oder kosmetisches Problem

**Priorität ergibt sich aus der Kombination von Dringlichkeit und Auswirkung** (Prioritätsmatrix: hohe Dringlichkeit + hohe Auswirkung = höchste Priorität).

### KI-Unterstützung im Support

KI ermöglicht Automatisierung und Effizienzsteigerung:

- **Chatbots**: Automatisierte Beantwortung häufiger Fragen (FAQ), Ticket-Erstellung ohne Umschweife
- **Automatische Ticket-Klassifizierung**: KI erkennt Ticket-Kategorie, priorisiert und leitet an passende Warteschlange
- **Predictive Ticketing**: KI vorhersagt ähnliche Probleme, schlägt Lösungsmuster vor
- **Wissensbase-Integration**: KI durchsucht Lösungsdatenbank, präsentiert passende Artikel
- **Stimmungsanalyse (Sentiment Analysis)**: erkennt Kundenfrust aus dem Ticket-Text, eskaliert kritische Fälle

**Vorsicht:** KI (Künstliche Intelligenz) ersetzt nicht die persönliche Kommunikation bei komplexen Problemen; Datenschutz beachten (DSGVO).

### Support-Levels: First-, Second-, Third-Level-Support

**First-Level-Support (1st-Line, L1):**
- Erste Kontaktperson des Kunden (Helpdesk)
- **Aufgaben:** Anfrage aufnehmen, Standard-Probleme lösen (Password Reset, Drucker-Treiber, Neustart), Dokumentation, einfache Troubleshooting
- **Eskalationskriterien:** Problem nicht nach 15–30 Min gelöst → L2
- **Kompetenz:** Kommunikation, Basis-IT-Wissen, Geduld
- **Anteil:** ~60–70 % aller Tickets gelöst auf L1

**Second-Level-Support (2nd-Line, L2):**
- Spezialisierte Techniker (z. B. für Netzwerk, Systeme, Datenbanken)
- **Aufgaben:** Komplexere Fehlersuche, Systemkonfiguration, Logs analysieren, Testumgebung nutzen
- **Eskalationskriterien:** Problem nicht nach 2–4 Std gelöst oder erfordert Architekt-Entscheidung → L3
- **Kompetenz:** Tiefes technisches Wissen in Spezialgebiet
- **Anteil:** ~20–30 % der Tickets

**Third-Level-Support (3rd-Line, L3):**
- Entwickler, Architekten, Hersteller-Support (Vendor Support)
- **Aufgaben:** Entwicklung neuer Hotfixes, Architektur-Änderungen, Koordination mit Herstellern
- **Eskalationskriterien:** Kritische Fehler, neue Probleme ohne Lösung in der Datenbank
- **Kompetenz:** Höchste technische Expertise, Systemkompetenz
- **Anteil:** ~5–10 % der Tickets

**Eskalationsweg (typisch):**
```
Kunde → L1 (Helpdesk) 
       ↓ (Problem nicht lösbar)
       L2 (Spezialist)
       ↓ (Problem nicht lösbar)
       L3 (Entwickler/Vendor)
       ↓ (Fix entwickelt)
       → L2 (implementiert)
       → L1 (kommuniziert an Kunde)
```

### Hardwarefehler im Support: Fehlerbilder und Ablauf

**Systematisches Vorgehen** (statt Raten und Neuinstallieren):
1. **Aufnehmen:** Fehlerbild, Zeitpunkt, Fehlermeldung (z. B. Stop-Code), letzte Änderungen (Update, Treiber, Umbau) im Ticket festhalten.
2. **Reproduzieren und eingrenzen:** Tritt der Fehler immer auf? Hardware oder Software? Ereignisanzeige lesen, Diagnosewerkzeuge nutzen.
3. **Ursache prüfen:** eine Hypothese nach der anderen testen – gezielt (Speichertest, SMART-Werte, Temperaturen) oder per Tausch gegen ein funktionierendes Teil.
4. **Beheben**, dann **mit dem Nutzer testen**.
5. **Dokumentieren** (Ursache und Lösung, Wissensdatenbank) und Ticket schließen.

**Fehlerbilder, Ursachen, Prüfungen:**

| Fehlerbild | mögliche Ursache | Prüfung / Maßnahme |
|---|---|---|
| keine Reaktion: keine LED, kein Lüfter | Stromversorgung: Kabel, Schalter, Netzteil | Kabel/Steckdose prüfen, Netzteil testen oder tauschen |
| Pieptöne, kein Bild, Start bricht ab | **POST** (Power-On Self-Test) findet einen Fehler, oft RAM oder Grafik | Piepcode im Mainboard-Handbuch nachschlagen (herstellerabhängig), RAM neu stecken, Riegel einzeln testen |
| wechselnde Bluescreens, Abstürze in verschiedenen Programmen | defekter Arbeitsspeicher | Speichertest (z. B. **Memtest86**, Windows-Speicherdiagnose) über mehrere Durchläufe |
| Lesefehler, langsamer Zugriff, „No bootable device“ | Datenträger defekt oder Bootreihenfolge falsch | **SMART**-Werte auslesen (z. B. neu zugewiesene Sektoren), Daten sichern, Datenträger tauschen; Bootreihenfolge im UEFI |
| Abschalten oder Drosseln unter Last, laute Lüfter | Überhitzung (Staub, Lüfter defekt, Wärmeleitpaste ausgetrocknet) | Temperaturen auslesen, Lüfter/Kühler reinigen, Wärmeleitpaste erneuern |
| Klackern, Schleifen, Vibration | Mechanik: HDD-Lager, Lüfter | Daten sofort sichern, Teil tauschen |
| Bluescreen nach Treiber-Update | fehlerhafter Treiber | abgesicherter Modus, Treiber zurücksetzen (Rollback), Stop-Code und Ereignisanzeige auswerten |
| Abstürze nur unter Volllast | Netzteil zu schwach | Leistungsbedarf gegen Nennleistung rechnen, stärkeres Netzteil |

**Support-Ablauf:** Der 1st Level (Helpdesk) nimmt auf, priorisiert und löst Standardfälle; was er nicht löst, **eskaliert**
er dokumentiert an den 2nd Level (Administration, z. B. RAM tauschen, Dump analysieren), dieser an den 3rd Level (Hersteller,
Systemhaus). Ein **SLA** (Service Level Agreement) legt messbar fest, wie schnell reagiert (**Reaktionszeit**) und wie schnell der
Service wiederhergestellt sein muss (**Lösungszeit**). Jeder einzelne Ausfall ist ein **Incident** (Störung); wiederholt sich
derselbe Fehler, wird die gemeinsame Ursache als **Problem** untersucht und dauerhaft beseitigt.

**ESD und Sicherheit beim Schrauben:** herunterfahren, **Netzstecker ziehen**, **Erdungsarmband** und ESD-Unterlage nutzen
(ESD = elektrostatische Entladung zerstört Bauteile, oft unbemerkt), Bauteile an den Kanten anfassen, in ESD-Beuteln lagern;
nie auf Teppich arbeiten, Netzteil nicht öffnen.

**Gewährleistung vs. Garantie:** Gewährleistung ist **gesetzlich** und richtet sich an den **Verkäufer** (in der Regel zwei
Jahre), die Garantie ist eine **freiwillige** Zusage, meist des Herstellers, und kommt obendrauf. Vor dem Einsenden eines
Datenträgers Firmendaten sichern und **sicher löschen** – oder den Datenträger einbehalten.

⚠️ **Merksatz:** Aufnehmen – eingrenzen – testen – beheben – dokumentieren; erst Daten sichern, dann schrauben.

### Typische IHK-Aufgabenstellungen

- Ticket-Lebens­zyklus erläutern (Zustände und Übergänge)
- Priorität eines Tickets bestimmen (Urgency + Impact)
- Eskalationsszenario beschreiben (welcher L-Level ist zuständig?)
- Kundenkommunikation strukturieren (Anfrage → Analyse → Lösung → Bestätigung)
- KI-Einsatz im Support bewerten (Chancen und Grenzen)
- Störung vs. Fehler unterscheiden und handhaben

### Merksätze

- **L1 = Gatekeeper:** Filtert 60–70 % der Tickets, nur schwierige eskalieren
- **Ticketsystem = goldenes Gedächtnis:** Jedes Problem wird dokumentiert; nächstes Mal schneller lösen
- **Priorität zuerst:** Kritische Tickets vor Nice-to-Have, sonst Chaos
- **KI hilft, ersetzt aber nicht:** Automatisierung für Routine, Mensch für Empathie und Komplexes
- **Kommunikation gewinnt Vertrauen:** Ehrliche, regelmäßige Updates halten Kunden zufrieden

### Selbsttest

1. **Definiere die Unterschiede zwischen Fehler und Störung an einem Beispiel.**
   <details><summary>Lösung anzeigen</summary>
   **Störung:** Die nächtliche Datensicherung läuft nicht durch – der Service ist beeinträchtigt. Sofortmaßnahme: die Sicherung von Hand nachholen (Workaround), damit keine Lücke entsteht. **Fehler (Problem):** die Ursache dahinter, z. B. ein Backup-Skript, das bei vollem Zielspeicher abbricht. Es wird analysiert und dauerhaft behoben – sonst kommt die Störung in der nächsten Nacht wieder.
   </details>

2. **Ein Ticket: Ein Nutzer kann nicht auf Netzlaufwerk zugreifen. Urgency: mittel (Workaround: lokal arbeiten). Impact: niedrig (nur dieser Nutzer). Welche Priorität?**
   <details><summary>Lösung anzeigen</summary>
   Priorität: niedrig/mittel. Nicht dringend (Workaround da), Auswirkung gering. Kann nach kritischen Tickets bearbeitet werden. L1 versucht zuerst einfache Lösungen (Netzverbindung prüfen, Rechte prüfen); wenn nicht, L2-Eskalation.
   </details>

3. **Wann eskaliert man vom First-Level zum Second-Level?**
   <details><summary>Lösung anzeigen</summary>
   Wenn nach **15–30 Minuten** kein Erfolg oder es geht über Basis-Troubleshooting hinaus (z. B. Systemkonfiguration, Fehleranalyse in Logs, Hardware-Defekt). Kriterium: L1 kann es nicht lösen und es erfordert Spezial-Wissen.
   </details>

4. **Ein Chatbot-System klassifiziert automatisch Tickets. Welche Grenzen hat dieses System?**
   <details><summary>Lösung anzeigen</summary>
   KI kann Standardprobleme schnell klassifizieren, aber: (1) mehrdeutige Anfragen werden fehlinterpretiert, (2) neue Problemtypen werden nicht erkannt, (3) emotionale/kritische Kundenanliegen brauchen einen Menschen, (4) Fehlklassifizierungen sind möglich. Lösung: Mensch prüft nach, komplexe Fälle werden manuell eskaliert.
   </details>

---

**Viel Erfolg bei der Vorbereitung auf die IHK-Prüfung AP1!**
