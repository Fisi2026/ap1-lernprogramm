# Modul 07 – Leistungserbringung und Auftragsabschluss

## Überblick
Dieses Modul behandelt die Erbringung von Leistungen gemäß Vertrag und den ordnungsgemäßen Auftragsabschluss. Es umfasst die rechtlichen Grundlagen (Vertragsarten, Vertragsstörungen), die Abstimmung mit Unternehmenszielen und der Aufbauorganisation, die Begleitung von Veränderungsprozessen, die Dokumentation der Leistungsübergabe und die abschließende Bewertung. Relevant für Lernfelder 2, 3, 6, 7 der Ausbildung zum Fachinformatiker Systemintegration.

**Inhaltsverzeichnis:**
- 7.1 Vertragsarten, Vertragsbestandteile und Vertragsstörungen
- 7.2 Zielsetzungen des Unternehmens und Leitbild
- 7.3 Umsetzungsvarianten der Leistungserbringung
- 7.4 Leistungserbringung und Aufbauorganisation
- 7.5 Veränderungsprozesse begleiten
- 7.6 Leistungsübergabe und Einweisungen planen
- 7.7 Leistungserbringung bewerten und dokumentieren

---

## 7.1 Vertragsarten, Vertragsbestandteile und Vertragsstörungen kennen und unterscheiden

**Einordnung:**  
Fragenkomplex 07, Taxonomiestufe Wissen und Verständnis. Essenziell für die rechtliche Abwicklung von IT-Projekten und die Differenzierung von Haftungsumfang und Leistungspflichten.

### Vertragsarten im IT-Kontext

**Kaufvertrag**  
Kauf einer Ware (z. B. Server, Laptop). Übergabe und Eigentum gehen auf den Käufer über. Gewährleistung: 2 Jahre.

**Mietvertrag**  
Überlassung einer Sache zur Nutzung gegen Miete, Eigentum bleibt beim Vermieter. Beispiel: Miete einer Serverinfrastruktur im Rechenzentrum (aber ohne Service = reines Hosting).

**Leasing**  
Nutzung auf Zeit gegen eine Rate, das Eigentum bleibt beim Leasinggeber. Wer Wartung, Versicherung und die Gefahr des Untergangs trägt, hängt von der Vertragsart ab – genau daran wird in der Prüfung unterschieden:
- **Operating-Leasing:** kurze Laufzeit, meist kündbar. Wartung, Versicherung und Restwertrisiko bleiben beim **Leasinggeber**. Das ist das „Gesamtpaket mit Service". Beispiel: 20 Arbeitsplatzcomputer inklusive Wartung und Austausch defekter Geräte.
- **Finanzierungsleasing:** lange Grundmietzeit, in der Grundmietzeit unkündbar, oft mit Kaufoption am Ende. Instandhaltung, Versicherung und Sachgefahr trägt der **Leasingnehmer**. Das ist der in der Praxis häufigere Fall.

Unterschied zur Miete: Beim Mietvertrag muss der Vermieter die Sache während der ganzen Mietzeit in vertragsgemäßem Zustand erhalten (§ 535 BGB). Beim Finanzierungsleasing ist genau diese Pflicht auf den Leasingnehmer abgewälzt – deshalb ist Leasing keine schlichte „Miete mit Service".

**Lizenzvertrag**  
Einräumung von Nutzungsrechten an Software oder immateriellen Gütern. Beispiel: Microsoft 365-Lizenz, Adobe CC. Eigentum bleibt beim Lizenzgeber.

**Servicevertrag mit SLA (Service Level Agreement)**  
Vereinbarung über Dienstleistungen mit messbaren Kennzahlen. Typische Größen:
- Verfügbarkeit: z. B. 99,9 % (Netzwerk sollte mindestens 99,9 % der Zeit erreichbar sein)
- Reaktionszeit: z. B. "Critical Issues innerhalb von 1 Stunde beantwortet"
- Lösungszeit (MTTR – **Mean Time to Resolution**): z. B. 4 Stunden bei Standard-Tickets.
  ⚠️ Dieselbe Abkürzung wird auch als *Mean Time To Repair* (reine Instandsetzungszeit)
  aufgelöst. **Im SLA ist die Lösungszeit gemeint** — die Zeit, bis der Kunde wieder arbeiten
  kann, nicht die Zeit am Schraubenzieher.
- Servicezeiten und Wartungsfenster: wann die zugesicherten Werte überhaupt gelten
  (z. B. Mo–Fr 8–18 Uhr) und wann geplant gewartet werden darf.
- **Pönale (Vertrags- oder Konventionalstrafe):** die im Vertrag vereinbarte Folge, wenn ein
  zugesicherter Wert nicht eingehalten wird — meist eine Gutschrift oder Minderung, gestaffelt
  nach dem Ausmaß der Unterschreitung.
  ⚠️ **Eine Pönale muss ausdrücklich vereinbart sein**; sie entsteht nicht von selbst aus einer
  Verfügbarkeitszusage. Und sie **ersetzt die Vertragsart nicht**: ob Erfolg (Werkvertrag) oder
  Tätigwerden (Dienstvertrag) geschuldet ist, entscheidet weiter der Vertrag — das SLA
  konkretisiert nur die messbare Servicegüte.

**Werkvertrag vs. Dienstvertrag (WICHTIGSTE Unterscheidung!)**

| Kriterium | Werkvertrag | Dienstvertrag |
|-----------|-------------|---------------|
| **Leistungspflicht** | Erfolg geschuldet | Tätigkeit/Bemühen geschuldet |
| **Haftung** | Unternehmer haftet für Fertigstellung | Dienstleister haftet nicht für Erfolg |
| **Beispiel (IT)** | Implementierung eines Netzwerks; Entwicklung einer Software; Datenmigration mit Abnahme | Beratungsstunden; Administrator-Support nach Stundensatz; Ticketbearbeitung |
| **Gewährleistung** | 2 Jahre möglich (Werkvertrag) | Keine Gewährleistung wie beim Kaufvertrag |
| **Abnahme** | Mit Abnahmeprotokoll → Gefahrenübergang | Nicht zwingende Abnahme |

### Vertragsbestandteile

1. **Leistungsbeschreibung:** Genaue Definition von Umfang, Qualität, technischen Anforderungen. Beispiel: "Installation von Windows Server 2022 auf 5 Servern, Konfiguration von Active Directory"
2. **Termine:** Fixtermin oder Lieferfrist. Beispiel: "Abschluss spätestens 30.11. des laufenden Jahres"
3. **Entgelte:** Festpreis oder Stundensatz. Beispiel: "Pauschalpreis 5.000 EUR" oder "80 EUR/h"
4. **Sanktionen/Konventionalstrafen:** Strafen bei Verzug oder Nichterfüllung. Beispiel: "Bei Verzug 100 EUR pro Tag, max. 10 % der Auftragssumme"

### Vertragsstörungen

**Nicht-Leistung (Leistung nicht erbracht)**  
Der Schuldner erfüllt die Leistungspflicht überhaupt nicht. Beispiel: Beauftragter Server wird nicht geliefert.

**Schlechtleistung (mangelhafte Qualität)**  
Leistung wird erbracht, entspricht aber nicht den Anforderungen. Beispiel: Netzwerk ist installiert, aber die dokumentierte Verfügbarkeit von 99,5 % wird nur zu 95 % erreicht.

**Verzug**
- **Lieferverzug:** Ware/Leistung kommt zu spät an.
- **Zahlungsverzug:** Kunde zahlt nicht pünktlich.

**Rechte des Käufers bei Vertragsstörung (Kurzform):**
- Nacherfüllung (Nachbesserung)
- Minderung der Vergütung
- Rücktritt vom Vertrag
- Schadensersatz

### Gewährleistung, Garantie und die Mängelrüge

**Gewährleistung und Garantie sind nicht dasselbe** — die Verwechslung ist eine Standardfrage:

| | **Gewährleistung** | **Garantie** |
|---|---|---|
| **Grundlage** | **gesetzlich** vorgeschrieben (BGB), gilt automatisch | **freiwillige** Zusage des Herstellers oder Verkäufers |
| **Umfang** | gesetzlich festgelegt | frei bestimmbar, geht über die Gewährleistung hinaus |
| **Wer haftet** | der Verkäufer | wer die Garantie gibt — oft der Hersteller |

⚠️ **Merksatz: Gewährleistung muss, Garantie kann.** Eine Garantie ersetzt die Gewährleistung
nicht, sie kommt obendrauf.

**Fristen:** Die Gewährleistung beginnt mit der **Abnahme** und beträgt typischerweise
**zwei Jahre**. Nach Ablauf dieser Frist sind Mängelansprüche **verjährt** — der Auftraggeber
kann sie dann nicht mehr durchsetzen, auch wenn der Mangel echt ist.

**Die Mängelrüge nach § 377 HGB — nur beim beidseitigen Handelskauf**

Kaufen zwei Kaufleute voneinander, gilt eine verschärfte Pflicht:

1. **Ware unverzüglich nach Eingang untersuchen**
2. **Erkennbare Mängel unverzüglich rügen**
3. **Nacherfüllung verlangen** — Nachbesserung oder Ersatzlieferung
4. **Angemessene Frist** zur Nacherfüllung setzen
5. **Erst nach erfolglosem Fristablauf:** Rücktritt, Minderung oder Schadensersatz

⛔⛔ **Wird die Rüge versäumt, gilt die Ware als genehmigt — sämtliche Gewährleistungsrechte
sind verloren.** Das ist die härteste Rechtsfolge in diesem Modul und der Kern jeder
Prüfungsaufgabe dazu.

⚠️ **Die Rangfolge ist nicht wählbar:** Nacherfüllung kommt IMMER zuerst. Rücktritt, Minderung
und Schadensersatz sind erst möglich, wenn die Nachfrist fruchtlos verstrichen ist. Wer sofort
zurücktritt, verliert vor Gericht.

### Übersichtstabelle aller Vertragsarten

| Vertragsart | Leistungsgegenstand | IT-Beispiel | Gewährleistung |
|------------|-------------------|-----------|----------------|
| Kaufvertrag | Ware | 10 × Notebook | 2 Jahre |
| Mietvertrag | Nutzung einer Sache | Rechenzentrum-Platz | Nach Vertrag |
| Leasing | Nutzung auf Zeit gegen Rate | 20 × PCs; Wartung beim Geber (Operating) oder beim Nehmer (Finanzierung) | Nach Vertrag |
| Lizenzvertrag | Nutzungsrecht | Microsoft 365 | Nach Lizenzgeber |
| Servicevertrag (SLA) | Dienstleistung mit Kennzahlen | 24/7-Helpdesk, 99,9 % Verfügbarkeit | Nach SLA |
| Werkvertrag | Erfolg/Werk | Netzwerk-Installation komplett | 2 Jahre (möglich) |
| Dienstvertrag | Tätigkeit | Admin-Support, 40 h/Monat | Nach Vereinbarung |

### Praxisnahe Beispiele

**Beispiel 1: Werkvertrag**  
Ein Unternehmen beauftragt eine IT-Firma mit der kompletten Umstellung eines Standortes von Windows 7 auf Windows 11. Zielleistung ist klar definiert: 100 Arbeitsplätze mit funktionierendem Windows 11, aktuellem Office, Netzwerkanbindung. Der IT-Dienstleister haftet für die Fertigstellung. Bei Abnahmeprotokoll gehen Gefahren und Gewährleistung über.

**Beispiel 2: Dienstvertrag**  
Ein Unternehmen beschäftigt einen freiberuflichen IT-Consultant für 20 Stunden pro Monat zur Beratung bei Infrastruktur-Entscheidungen. Der Consultant schuldet keinen konkreten Erfolg, sondern die Durchführung der Beratung. Die Qualität wird subjektiv beurteilt.

### Typische IHK-Aufgabenstellungen

- Unterscheiden Sie: Ein Unternehmen kauft Server (welcher Vertragstyp?) vs. mietet Serverplatz mit Support (welcher Vertragstyp?).
- Sie sollen einen Werkvertrag für die Migration von 500 Benutzer-Daten aufsetzen. Welche Vertragsbestandteile sind mindestens erforderlich?
- Ein Softwareentwickler schuldete "Erfolg" einer Entwicklung – ist dies ein Werk- oder Dienstvertrag?
- Was bedeutet "Lieferverzug" und welche Rechte hat der Käufer?

### Merksätze / Eselsbrücken

- **Werkvertrag = Werk/Erfolg geschuldet** → Dienstleister haftet für die fertige Lösung.
- **Dienstvertrag = Dienst/Bemühen geschuldet** → Dienstleister haftet nur für Durchführung, nicht für Erfolg.
- **SLA = messbar** → Service Level Agreements müssen konkrete Zahlen (z. B. 99,9 %) enthalten.
- **Abnahmeprotokoll beim Werkvertrag** → Mit Unterschrift beginnt Gewährleistungszeit und ist die Vergütung fällig.

### Selbsttest

<details>
<summary>Frage 1: Wer schuldet Erfolg – der Werkvertrag oder der Dienstvertrag?</summary>
Der Werkvertrag schuldet Erfolg. Der Dienstleister muss das Werk fertig abliefern (z. B. Netzwerk komplett installiert). Beim Dienstvertrag schuldet der Dienstleister nur die Tätigkeit, nicht den Erfolg.
</details>

<details>
<summary>Frage 2: Nennen Sie drei Bestandteile eines IT-Servicevertrag mit SLA.</summary>
- Verfügbarkeit (z. B. 99,9 %)
- Reaktionszeit (z. B. 1 Stunde für kritische Tickets)
- Lösezeit/MTTR (z. B. 4 Stunden für Standard-Tickets)
</details>

<details>
<summary>Frage 3: Welcher Unterschied besteht zwischen Leasing und Miete?</summary>
Beides ist Nutzung auf Zeit ohne Eigentumserwerb. Bei der Miete muss der Vermieter die Sache instand halten (§ 535 BGB). Beim Leasing hängt das von der Vertragsart ab: beim Operating-Leasing trägt der Leasinggeber Wartung und Versicherung, beim Finanzierungsleasing der Leasingnehmer.
</details>

<details>
<summary>Frage 4: Was ist die Folge einer mangelhaften Lieferung?</summary>
Die Folge ist Schlechtleistung. Der Käufer kann Nacherfüllung, Minderung, Rücktritt oder Schadensersatz verlangen.
</details>

<details>
<summary>Frage 5: Ein Unternehmen beauftragt einen Consultant mit strategischer Beratung zum Umstieg auf Cloud-Computing. Werkvertrag oder Dienstvertrag?</summary>
Dienstvertrag. Die Beratung ist eine Tätigkeit; es wird kein konkreter Erfolg (wie eine fertige Cloud-Migration) geschuldet.
</details>

---

## 7.2 Zielsetzungen des Unternehmens dem Leitbild entnehmen können

**Einordnung:**  
Fragenkomplex 07, Taxonomiestufe Verständnis. Zeigt, dass IT-Leistungserbringung den strategischen Unternehmenszielen untergeordnet ist.

### Arten von Unternehmenszielen

**Vision, Mission und Leitbild — drei Ebenen, die in Prüfungsaufgaben oft vermischt werden:**
- **Mission:** *Was tun wir, für wen, womit?* Das Geschäft von heute in einem Satz.
- **Vision:** *Wo wollen wir hin?* Ein anzustrebender Zustand in der Zukunft, bewusst ambitioniert.
- **Leitbild:** *Nach welchen Grundsätzen?* Die Werte, an denen die Arbeit gemessen wird.
►► **Ein brauchbares Leitbild wird an messbaren Zielen fest** — „bis 2030 klimaneutral
produzieren" ist prüfbar, „Verantwortung übernehmen" allein nicht.

**Ökonomische Ziele**  
Gewinn-, Rentabilitäts- und Umsatzziele. Beispiele:
- Umsatzsteigerung von 10 % pro Jahr
- Kostenreduktion um 5 % durch Automatisierung
- Rentabilität von min. 12 %

Im IT-Kontext: Projekte sollen kosteneffizient umgesetzt werden, Lizenzen sparen, Ausfallzeiten minimieren.

**Ökologische Ziele (Nachhaltigkeit)**  
Ressourcenschonung, Umweltschutz, Green IT. Beispiele:
- Energieverbrauch der Infrastruktur um 20 % senken
- Papierloses Büro durch Digitalisierung
- Recycling von Alt-Hardware, Rückgabe an zertifizierte Recycler
- Nutzung von Grünstrom für Rechenzentren

**Soziale Ziele (Corporate Social Responsibility)**  
Arbeitsbedingungen, Mitarbeiter-Wohlbefinden, Weiterbildung. Beispiele:
- Flexible Arbeitszeiten, Home-Office-Optionen
- Jährliche Weiterbildungsbudgets für jeden Mitarbeiter
- Chancengleichheit und Vielfalt in der Belegschaft
- Gute Vereinbarkeit von Beruf und Familie

### Zielbeziehungen

**Komplementäre Ziele**  
Ziele unterstützen sich gegenseitig. Beispiel: Digitalisierung (ökonomisch) und Papierloses Büro (ökologisch) ergänzen sich.

**Konkurrierende Ziele**  
Ziele behindern sich gegenseitig. Beispiel: Kostensenkung (ökonomisch) vs. Höchstes Sicherheitsniveau (kann teuer sein).

**Neutrale Ziele**  
Ziele beeinflussen sich nicht gegenseitig. Beispiel: Umsatzsteigerung und Schulungsangebot haben keinen direkten Zusammenhang.

### Praxisbeispiel

Ein Unternehmen mit dem Leitbild "Nachhaltig wirtschaften, Mitarbeiter fördern, Kundenzufriedenheit maximieren":
- **Ökonomisch:** Digitalisierung zur Kosteneffizienz
- **Ökologisch:** Verlagerung in die Cloud statt eigenes Rechenzentrum
- **Sozial:** IT-Team erhält Schulung in Cloud-Architekturen, flexible Homeoffice-Regelung

### Typische IHK-Aufgabenstellungen

- Ordnen Sie Unternehmensziele der Leitbildstrategie zu.
- Erkennen Sie konkurrierende vs. komplementäre Ziele in einem Fallbeispiel.
- Begründen Sie, warum ökologische Ziele auch wirtschaftlich sinnvoll sind.

### Merksätze

- **Leitbild → Ziele → Projekte** → Alle IT-Maßnahmen leiten sich vom Leitbild ab.
- **Ökonomisch, Ökologisch, Sozial = 3-Säulen-Modell** → Nachhaltigkeit.

### Selbsttest

<details>
<summary>Frage 1: Nennen Sie je ein ökonomisches, ökologisches und soziales Ziel in der IT.</summary>
- Ökonomisch: Kostenreduktion durch Cloud-Migration
- Ökologisch: Energiesparmaßnahmen bei Servern
- Sozial: Weiterbildung des IT-Personals zu Cloud-Technologien
</details>

<details>
<summary>Frage 2: Sind Kosteneinsparung und maximale IT-Sicherheit komplementär oder konkurrierend?</summary>
Konkurrierend. Maximale Sicherheit ist in der Regel teurer (spezielle Software, Audits, Zertifizierungen).
</details>

---

## 7.3 Umsetzungsvarianten der Leistungserbringung kennen

**Einordnung:**  
Fragenkomplex 07, Taxonomiestufe Wissen. Zentral für die praktische Planung von IT-Projekten.

### Leistungserbringung Onsite vs. Remote

**Onsite (vor Ort)**

| Vorteil | Nachteil |
|--------|---------|
| Direkter Kundenkontakt, schnelle Kommunikation | Reisezeit und Reisekosten |
| Tatsächliche Hardwareprobleme fassbar | Geografische Abhängigkeit |
| Vertrauen durch Präsenz | Weniger flexibel bei vielen Orten |

**Remote (Fernwartung, Remote Desktop)**

| Vorteil | Nachteil |
|--------|---------|
| Zeitersparnis, ortsunabhängig | Nicht bei Hardwareaustausch möglich |
| Kosteneffizienz | Abhängig von stabiler Internetverbindung |
| Schnelle Skalierbarkeit | Begrenzte Diagnose bei physischen Problemen |

**Hybrid-Modell**  
Kombination: Initialer Onsite-Besuch zur Erfassung, dann regelmäßige Remote-Unterstützung, Onsite nur bei Hardware-Austausch.

### Ticketsystem

Verweis auf Modul 01: Das Ticketsystem strukturiert die Leistungserbringung durch:
- Zentrale Dokumentation von Anfragen
- Priorisierung (Critical, High, Medium, Low)
- Zuordnung an Techniker
- Nachverfolgung bis Abschluss
- Basis für SLA-Monitoring

### Kundenvorgaben bei der Umsetzung

**Termine:**  
Der Kunde gibt Lieferfristen vor (z. B. "Abschluss bis Ende des ersten Quartals"). Diese müssen in die Projektplanung einfließen.

**Erfüllungsort:**  
Wo findet die Leistung statt? Beim Kunden oder beim Dienstleister? Wichtig für Logistik, Reisen, Zeitzone (international).

**Technische Voraussetzungen:**  
- Betriebssystem: "Nur Windows 11 Enterprise"
- Softwarehersteller: "Nur Lösungen von Cisco für Netzwerk"
- Infrastruktur: "Muss in einem deutschen Rechenzentrum laufen" (Datenschutz)
- Sicherheit: "ISO 27001 zertifiziert"

**Einhaltung des Budgets:**  
Kosten dürfen Vereinbartes nicht übersteigen. Falls Nacharbeiten nötig: Nachkalkulation, Preisanpassung, ggf. Kulanzregelung.

### Praxisbeispiel

Ein Mittelständler beauftragt eine IT-Firma mit der Datenmigration von 300 Rechnern von Windows 7 zu Windows 11:
- **Termine:** 8 Wochen, mit Meilenstein nach 4 Wochen (50 % Rechner migriert)
- **Erfüllungsort:** Beim Kunden vor Ort (3 Techniker 2 Wochen täglich)
- **Technische Vorgaben:** Nur Corporate-Windows-Versionen, Netzwerk-anbindung via DHCP, keine lokalen Admin-Accounts
- **Budget:** 8.000 EUR pauschal

### Typische IHK-Aufgabenstellungen

- Begründen Sie, wann Onsite vs. Remote sinnvoll ist.
- Welche Kundenanforderung ist technisch nicht umsetzbar – und wie kommunizieren Sie das?
- Planen Sie die Umsetzung unter Berücksichtigung aller Kundenvorgaben.

### Merksätze

- **Onsite = Qualität, Remote = Effizienz** → Oft hybrid kombinieren.
- **Kundenvorgaben sind Nebenbedingungen** → Budget, Termin, Ort bestimmen Machbarkeit.

### Selbsttest

<details>
<summary>Frage 1: Nennen Sie ein Szenario, bei dem Remote-Support nicht ausreicht.</summary>
Hardware-Austausch (z. B. defekte Festplatte wechseln, Grafikkarte einbauen) erfordert physischen Zugriff.
</details>

<details>
<summary>Frage 2: Ein Kunde verlangt den Weiterbetrieb von Windows-7-Rechnern. Technisch ist das riskant (der Hersteller-Support ist längst ausgelaufen, keine Sicherheitsupdates mehr). Wie gehen Sie vor?</summary>
Dokumentieren Sie die Vorgabe, erklären Sie das Sicherheitsrisiko schriftlich und bieten Sie Alternativen (Migration auf ein aktuelles Betriebssystem) an. Bei Festhalten des Kunden: Risikoübernahme schriftlich klären, ggf. Netzsegmentierung als Schutzmaßnahme.
</details>

---

## 7.4 Leistungserbringung gemäß der Aufbauorganisation des eigenen Unternehmens abstimmen

**Einordnung:**  
Fragenkomplex 07, Taxonomiestufe Verständnis. Zeigt, wie interne Organisationsstrukturen die Leistungserbringung beeinflussen.

### Organisationsformen

**Einliniensystem**

```
        Geschäftsführung
              |
     +--------+--------+
     |                 |
   IT-Leiter      Vertriebsleiter
     |
 +---+---+
 |       |
Admin  Support
```

**Merkmal:** Jeder Mitarbeiter hat genau einen Vorgesetzten (klare Befehlskette).

**Vorteile:**
- Klare Verantwortlichkeit
- Eindeutige Entscheidungswege

**Nachteile:**
- Langsame Kommunikation bei Querverbindungen
- Wenig Spezialisierung
- Engpässe möglich

**Mehrliniensystem**

```
        Geschäftsführung
         /            \
   IT-Abteilung   Personal-Abteilung
      /    \
  Spez1  Spez2 (jeder hat mehrere "Chefs")
```

**Merkmal:** Ein Mitarbeiter hat mehrere Vorgesetzte (z. B. Fachverantwortlicher und Projektleiter).

**Vorteile:**
- Hohe Spezialisierung
- Flexibilität bei Ressourceneinsatz
- Schnellere Entscheidungen in Fachgruppen

**Nachteile:**
- Kompetenzkonflikte ("Wer hat das Sagen?")
- Unklar, wem man Bericht erstattet
- Motivationsprobleme bei widersprechenden Anweisungen

**Matrixorganisation**

```
        Geschäftsführung
         /            \
    Funktional    Projekte
      /    \       /    \
   Admin  Netz  Proj1  Proj2
    |      |     |      |
    +------+--+--+------+
         |  |  |  |
      Team-Mitglieder (Dual Reporting)
```

**Merkmal:** Zwei Dimensionen (z. B. Funktion × Projekt). Mitarbeiter berichten an Funktionsleiter (Admin, Netzwerk) und Projektleiter parallel.

**Vorteile:**
- Optimale Ressourcennutzung
- Flexibilität und Spezialisierung kombiniert
- Projektübergreifendes Wissen

**Nachteile:**
- Hohes Konfliktpotenzial
- Aufwendige Koordination
- Verwirrung über Prioritäten möglich

### Aufbau- und Ablauforganisation

Zwei Begriffe, die in Prüfungen regelmäßig vertauscht werden. **Die Unterscheidung gelingt über
eine einzige Frage: Geht es um Personen und Zuständigkeiten oder um Zeit?**

| | **Aufbauorganisation** | **Ablauforganisation** |
|---|---|---|
| **Sicht** | statisch — **wer** ist wofür zuständig | dynamisch — **wann** geschieht was |
| **Ergebnis** | Stellen, Abteilungen, Instanzen, Weisungswege | Arbeitsschritte in ihrer Reihenfolge |
| **Darstellung** | **Organigramm** | Ablaufdiagramm, **Netzplan**, Gantt-Diagramm |
| **Typische Begriffe** | Stelle, Instanz, Stabsstelle, Leitungsspanne | Reihenfolge, Durchlaufzeit, kritischer Pfad, Pufferzeit |

**Wie eine Aufbauorganisation entsteht — Aufgabenanalyse und Aufgabensynthese:**

1. **Aufgabenanalyse:** Die Gesamtaufgabe des Betriebs wird in **Teilaufgaben zerlegt** —
   nach Verrichtung (was wird getan), Objekt (woran), Rang (Leitung oder Ausführung),
   Phase (Planung, Durchführung, Kontrolle).
2. **Aufgabensynthese:** Die Teilaufgaben werden zu **Stellen** zusammengefasst — eine Stelle ist
   das Aufgabenbündel für **eine** Person. Mehrere Stellen bilden eine Abteilung.

⚠️ **Merkrichtung: erst zerlegen (Analyse), dann bündeln (Synthese).** Wer die Reihenfolge
vertauscht, hat die Definition umgedreht.

### Das Organigramm

Das **Organigramm** ist die grafische Darstellung der Aufbauorganisation. Es zeigt:

- **Instanzen** — Stellen **mit** Weisungsbefugnis (Geschäftsführung, Abteilungsleitung)
- **Ausführende Stellen** — ohne Weisungsbefugnis (Sachbearbeitung, Administration)
- **Weisungswege** — durchgezogene Linien
- **Stabsstellen** — angehängt mit **gestrichelter** Linie

**Lesen eines Organigramms:** Die Autorität nimmt von oben nach unten ab. Wer direkt unter der
Geschäftsführung steht und selbst Untergebene hat, ist die höchste Instanz darunter.

**Stabsstelle und Stabliniensystem**

Eine **Stabsstelle** berät und unterstützt eine Instanz, **hat aber KEINE Weisungsbefugnis**
gegenüber Mitarbeitern. Typische Beispiele: Datenschutzbeauftragter, IT-Sicherheitsbeauftragter
(CISO), Justiziar, Assistenz der Geschäftsführung.

⚠️ **Das ist das Prüfungsmerkmal schlechthin: beraten ja, anweisen nein.** Im Organigramm
erkennt man die Stabsstelle an der **gestrichelten** Verbindung — sie steht **neben** der Linie,
nicht **in** ihr.

Das **Stabliniensystem** ist ein Einliniensystem, dem Stabsstellen zur Seite gestellt sind: die
klare Befehlskette der Linie bleibt erhalten, das Fachwissen des Stabs kommt hinzu.

### Handlungs- und Entscheidungsspielräume

Mitarbeiter benötigen klare Grenzen ihrer Entscheidungsbefugnisse:

**Handlungsvollmacht**  
Berechtigung, im Namen des Unternehmens tätig zu werden (z. B. Service-Leiter darf bis 2.000 EUR investieren ohne Geschäftsführung-Genehmigung).

**Prokura**  
Umfassende, gesetzlich geregelte Vollmacht (§§ 48 ff. HGB (Handelsgesetzbuch)): berechtigt zu nahezu allen Geschäften, die der Betrieb eines Handelsgewerbes mit sich bringt (ausgenommen z. B. Verkauf des Unternehmens, Grundstücksveräußerung nur mit besonderer Befugnis). Wird ins Handelsregister eingetragen. Seltener in IT-Abteilungen, eher im kaufmännischen Bereich.

⚠️ **Wie ein Prokurist zeichnet — drei Bestandteile, alle drei nötig:** die **Firma** (der Name
der Gesellschaft), ein Zusatz, der die Prokura andeutet, und der eigene Name. Üblich und
anerkannt ist die Abkürzung **`ppa.`** (per procura). *„Meyer GmbH, ppa. Schmidt"* ist damit
formal richtig. ⚠️ Die **Handlungsvollmacht** zeichnet dagegen mit **`i. V.`** (in Vollmacht)
oder **`i. A.`** (im Auftrag) — sie ist die kleinere, nicht eintragungspflichtige Vollmacht und
für einen begrenzten Kreis von Geschäften gedacht (**Artvollmacht** für eine bestimmte Art,
**Einzelvollmacht** für ein einzelnes Geschäft).

**Vertretungsregeln**  
⚠️ **Die Aufbauorganisation ist ein Hebel auf die Durchlaufzeit, nicht nur ein Schaubild.**
Zwei Ansatzpunkte, wenn Aufträge liegenbleiben: **(1) Hierarchiestufen verringern** — muss für
jede Ersatzteilbestellung eine Instanz höher gefragt werden, entstehen Liege- und Wartezeiten,
die **keine Wertschöpfung** erzeugen; **Entscheidungsbefugnisse bis zu einer festen Wertgrenze**
auf die Sachbearbeitung zu verlagern, beseitigt sie. **(2) Weisungswege eindeutig machen** —
widersprüchliche Anweisungen aus Fach- und Projektlinie (**Mehrfachunterstellung**) kosten
Rückfragen; eine klare Kompetenzregelung sagt, wer im Konflikt entscheidet.
Bei Abwesenheit des Vorgesetzten: Wer entscheidet? (z. B. Deputy-Struktur, Eskalationskette).

### Praxisbeispiel

Ein IT-Unternehmen mit Matrixstruktur:
- **Funktional:** Admin-Team (Betriebssystem, User Management), Netzwerk-Team (Switches, Routing), Entwicklung (Apps)
- **Projekt:** Kunde A (Datenmigration), Kunde B (Netzwerk-Neubau)

Ein Admin wird 50 % für Kunde A (Projektleiter X) und 50 % für Stamm-IT (Admin-Leiter Y) eingeplant. Bei konfligierenden Prioritäten muss geklärt werden, wer entscheidet. Klassische Konfliktquelle!

### Typische IHK-Aufgabenstellungen

- Vergleichen Sie Einliniensystem und Matrixorganisation hinsichtlich der Effizienz bei IT-Projekten.
- Ein Techniker erhält widersprüchliche Anweisungen von zwei Vorgesetzten. Wie sollte die Organisation strukturiert sein, um dies zu vermeiden?
- Welche Vollmachten sind für einen IT-Projektleiter sinnvoll?

### Merksätze

- **Einlinie = Klarheit, aber Langsamkeit**
- **Matrix = Flexibilität, aber Komplexität**
- **Handlungsvollmacht = Entscheidungsfreiheit im definierten Rahmen**

### Selbsttest

<details>
<summary>Frage 1: Ein Support-Techniker hat zwei Vorgesetzte: den Support-Leiter und den Projektleiter. Welche Organisationsform ist das?</summary>
Mehrliniensystem oder Matrixorganisation (abhängig von Ausprägung). Beide erlauben mehrere Vorgesetzte.
</details>

<details>
<summary>Frage 2: Nennen Sie einen Vorteil und einen Nachteil der Matrixorganisation.</summary>
Vorteil: Optimale Ressourcennutzung, Flexibilität. Nachteil: Konfliktpotenzial bei widersprechenden Prioritäten.
</details>

---

## 7.5 Veränderungsprozesse begleiten und unterstützen

**Einordnung:**  
Fragenkomplex 07, Taxonomiestufe Verständnis und Handlung. Change Management ist zentral bei größeren IT-Projekten.

### Motivierte Herangehensweise

Der Schlüssel zu erfolgreicher Veränderung ist die **positive Grundhaltung**:
- Chancen und Vorteile betonen (z. B. "Mit Windows 11 arbeiten Sie schneller")
- Nicht nur Probleme aufzählen
- Mitarbeiter als Partner, nicht Objekte sehen
- Unsicherheiten anerkennen und reduzieren

### Identifizierung und Darstellung von Veränderungsschritten

**Klare Roadmap erstellen:**
1. IST-Zustand dokumentieren (z. B. "Aktuell 200 PCs mit Windows 7, 50 mit Windows 10")
2. Zielzustand definieren (z. B. "Alle PCs auf Windows 11 bis zum 30.06. des Folgejahres")
3. Meilensteine festlegen (z. B. Monat 1: Pilot mit 10 PCs, Monat 2–3: Rollout in Wellen)
4. Termine, Verantwortliche, Ressourcen klar kommunizieren

**Visualisierung:** Gantt-Diagramme, Roadmaps, einfache Grafiken helfen, das "Große Bild" zu vermitteln.

### Der Change-Management-Prozess

Neben der menschlichen Seite hat jede Änderung eine formale: **Wer darf was wann ändern, und
wer hat es genehmigt?** Der strukturierte Ablauf in fünf Phasen:

**Antrag → Genehmigung → Umsetzung → Monitoring → Dokumentation**

⚠️ **Die Genehmigung steht VOR der Umsetzung, die Dokumentation danach.** Ein Change ohne
Genehmigung ist ein unkontrolliertes Risiko; ein Change ohne Dokumentation ist beim nächsten
Störfall nicht nachvollziehbar.

Dieses Vorgehen stammt aus **ITIL** (IT Infrastructure Library), einer Sammlung bewährter
Verfahren für IT-Service-Management. ITIL beschreibt neben dem Change Management auch Incident
Management (Störungen schnell beheben) und Problem Management (Ursachen dauerhaft beseitigen).
⚠️ **ITIL ist kein Gesetz und keine Norm, sondern ein Rahmenwerk** — Unternehmen übernehmen
daraus, was zu ihnen passt.

### Einbeziehung der Mitarbeiter

**Qualifizierung durch Blended Learning**  
Kombination aus:
- Präsenz-Schulungen (1–2 Tage Workshop mit Hands-On)
- E-Learning (Online-Kurse, Videos zum Selbstlernen)
- Dokumentation, Hilfe-Center
- Post-Training-Support (FAQ, Helpdesk für Fragen)

**Einsatz von Multiplikatoren**  
Geschulte Mitarbeiter ("Botschafter", "Champions") werden intern Trainer:
- Pro Abteilung ein Power-User, der Windows 11 intensiv beherrscht
- Dieser Power-User schult Kolleginnen und Kollegen
- Schafft lokale Unterstützung und verringert Hürden
- Effizienter als externe Trainer für große Belegschaften

### Personentypen bei Veränderungen (Stakeholder-Analyse)

| Typ | Charakteristik | Umgang |
|-----|----------------|--------|
| **Promotoren** | Treiben die Veränderung aktiv voran; sehen Vorteile | Einbinden als Change Agents, Multiplikatoren nutzen |
| **Unterstützer** | Befürworten Veränderung, sind aber nicht aktiv | Regelmäßig informieren, Erfolgsgeschichten zeigen |
| **Skeptiker** | Haben Bedenken, sind aber offen für Diskussion | Transparente Kommunikation, Fragen beantworten, Versuchsphasen anbieten |
| **Bremser** | Sehen Risiken, sind passiv-resistent | Sachlich auf Argumente eingehen, Bedenken ernst nehmen, ggf. Zusicherungen treffen |
| **Widerständler** | Lehnen Veränderung aktiv ab | Offenes Gespräch suchen, Root Causes klären, ggf. Konsequenzen aufzeigen |

### Ursachen von Widerständen erkennen

- **Angst vor Kompetenzverlust:** "Ich kenne Windows 7, aber Windows 11 ist mir fremd" → Schulung + Mentoring, dazu eine Rolle als Key-User oder Multiplikator, damit die Erfahrung weiter zählt
- **Wissenslücken:** Mitarbeiter wissen nicht, wie das neue System bedient wird → Dokumentation, Schulung
- **Persönliche Historie:** Frühere Projekte sind schiefgelaufen → Vertrauensaufbau durch Kommunikation und Erfolge
- **Gewohnheit:** "Ich mache es immer so" → Erklären, warum Change notwendig ist
- **Angst um Job:** "Bin ich noch erforderlich?" → Klare Zusicherung und neue Aufgabenbereiche anbieten

### Praxisbeispiel: Windows 11-Migration

**Ausgangslage:** Unternehmen mit 300 Mitarbeitern, derzeit Windows 7/10. Viele ältere Mitarbeiter sind skeptisch oder widerstehen.

**Strategie:**
1. **Kick-Off-Veranstaltung:** Geschäftsführung erklärt Vorteile (Sicherheit, Leistung, langfristiger Hersteller-Support)
2. **Pilot-Phase:** 20 Volunteers aus verschiedenen Abteilungen bekommen Windows 11 zuerst
3. **Multiplikatoren:** Aus diesen 20 werden 3 Power-User geschult; jeder betreut 100 Kollegen
4. **Blended Learning:** 1-Stunden-Workshop + 15-Min-Videos zum Selbstlernen
5. **FAQ-Hotline:** Support-Team antwortet auf Fragen
6. **Welle-für-Welle:** Rollout monatlich 75 PCs, damit IT-Team nicht überfordert ist
7. **Erfolgs-Stories:** Regelmäßige Kommunikation: "Abteilung X arbeitet 20 % schneller mit Windows 11"

### Typische IHK-Aufgabenstellungen

- Identifizieren Sie in einem Fallbeispiel Promotoren, Skeptiker, Bremser.
- Entwickeln Sie ein Change-Management-Plan für eine neue IT-Lösung.
- Welche Widerstände erwarten Sie und wie begegnen Sie ihnen?
- Erklären Sie den Nutzen von Multiplikatoren im Schulungsprozess.

### Merksätze

- **Chancen betonen, nicht Probleme** → Motiviert statt frustriert
- **Multiplikatoren sparen Zeit und Kosten** → Skalieren Sie Schulung auf interne Trainer
- **Widerstand ist normal** → Vorausplanung und Kommunikation reduzieren es

### Selbsttest

<details>
<summary>Frage 1: Was ist der Unterschied zwischen Blended Learning und klassischer Präsenz-Schulung?</summary>
Blended Learning kombiniert Präsenztermine mit E-Learning. So kann der Mitarbeiter in eigenem Tempo lernen, die Präsenz ermöglicht Hands-On und Fragen. Flexibler und kosteneffizienter als reine Präsenz.
</details>

<details>
<summary>Frage 2: Ein Mitarbeiter lehnt die neue Dokumentenverwaltungs-Software ab: "Ich nutze immer noch Ordner auf der Festplatte." Welcher Personentyp ist das und wie gehen Sie vor?</summary>
Wahrscheinlich ein Skeptiker oder Bremser (Gewohnheit, evtl. Kompetenzangst). Vorgehen: Offenes Gespräch, zeigen, wie die neue Software Zeit spart, Schulung anbieten, Übergangsfrist setzen.
</details>

<details>
<summary>Frage 3: Nennen Sie zwei Ursachen von Widerständen bei IT-Veränderungen.</summary>
Z. B. Angst vor Kompetenzverlust, Wissenslücken, Angst um den Arbeitsplatz, Gewohnheit, frühere schlechte Erfahrungen.
</details>

---

## 7.6 Leistungsübergabe und Einweisungen planen und dokumentieren

**Einordnung:**  
Fragenkomplex 07, Taxonomiestufe Wissen und Handlung. Das Abnahmeprotokoll ist rechtlich bindend und zentral für Projektabschluss.

### Inhalt des Abnahmeprotokolls

Das Abnahmeprotokoll dokumentiert die formale Übergabe und Abnahme einer Leistung (besonders wichtig bei Werkverträgen):

| Element | Erklärung |
|---------|-----------|
| **Datum, Uhrzeit** | Zeitpunkt der Abnahme |
| **Beteiligte Personen** | Name, Titel, Unterschrift des Auftraggebers und Auftragnehmers (ggf. Zeugen) |
| **Leistungsumfang** | Was genau wurde abgeliefert? (z. B. "5 Server mit Windows Server 2022, Active Directory, DNS konfiguriert") |
| **Festgestellte Mängel** | Gibt es Abweichungen? (z. B. "Server 3: nur 16 GB RAM statt 32 GB vereinbart", "Dokumentation unvollständig") |
| **Frist zur Nachbesserung** | Wenn Mängel: Wie lange hat der Auftragnehmer Zeit diese zu beheben? (z. B. "2 Wochen") |
| **Unterschriften** | Beider Parteien (mit Datum) |

### Formen der Abnahme

⚠️ **Eine Abnahme braucht nicht zwingend eine Unterschrift.** Das ist der häufigste Irrtum zu
diesem Abschnitt. § 640 BGB kennt drei Wege:

| Form | Wie sie geschieht | Beispiel |
|---|---|---|
| **ausdrückliche Abnahme** | Erklärung, in der Regel durch **Unterschrift** unter das Protokoll | Auftraggeber unterschreibt das Abnahmeprotokoll |
| **konkludente (stillschweigende) Abnahme** | durch **schlüssiges Verhalten** – der Auftraggeber nutzt die Leistung produktiv, ohne Mängel zu rügen | Kunde arbeitet täglich mit dem neuen System und zahlt die Rechnung |
| **fiktive Abnahme** (§ 640 Abs. 2 BGB) | Der Auftragnehmer setzt eine **angemessene Frist** zur Abnahme; verweigert der Auftraggeber sie nicht **unter Angabe mindestens eines Mangels**, gilt das Werk nach Fristablauf als abgenommen | Frist von zwei Wochen läuft ab, der Kunde schweigt |

⛔ **Die konkludente Abnahme ist rechtlich genauso wirksam wie die unterschriebene.** Wer die
Leistung in Betrieb nimmt und monatelang nutzt, kann später nicht sagen „abgenommen wurde nie".
Die Rechtsfolgen unten treten dann genauso ein – Gefahrenübergang, Gewährleistungsbeginn,
Fälligkeit der Vergütung.

⚠️ **Für den Auftragnehmer ist die Unterschrift trotzdem das Ziel** – nicht weil die Abnahme
sonst fehlt, sondern weil sie im Streitfall **beweisbar** ist. Konkludente und fiktive Abnahme
muss man erst darlegen; das unterschriebene Protokoll liegt vor.

**Abnahme unter Vorbehalt:** Der Auftraggeber nimmt ab, **obwohl** er einen Mangel kennt, und
vermerkt ihn ausdrücklich („unter Vorbehalt der Nachbesserung bis TT.MM.JJJJ"). Dann behält er
seine Mängelrechte. **Ohne diesen Vorbehalt verliert er sie für bekannte Mängel** (§ 640 Abs. 3
BGB) – siehe Merksätze am Ende des Abschnitts.

### Rechtliche Bedeutung des Abnahmeprotokolls

1. **Gefahrenübergang:** Mit Unterzeichnung gehen Risiken vom Auftragnehmer auf Auftraggeber über. Wenn danach ein Server ausfällt, trägt der Auftraggeber das Risiko.
2. **Beginn Gewährleistungszeit:** Gewährleistung läuft ab Abnahmeprotokoll (z. B. 2 Jahre bei Werkvertrag).
3. **Fälligkeit der Vergütung:** Mit Abnahme wird die Rechnung fällig. Vor Abnahme kann der Auftraggeber die Zahlung verweigern.
4. **Beweismittel:** Im Streitfall ist das Protokoll Beweis für Leistungserbringung.

### Mängel und Mängelarten

**Schlechtleistung (mangelhafte Qualität)**  
Die Leistung ist erbracht, entspricht aber nicht den Anforderungen.
- **IT-Beispiel:** Server ist installiert, aber der dokumentierte SLA von 99,5 % Verfügbarkeit wird nur 95 % erreicht

**Falschlieferung (aliud — etwas anderes geliefert)**  
Der Auftragnehmer liefert eine andere Leistung als vereinbart.
- **IT-Beispiel:** Vertraglich vereinbart: "10 × Cisco Switches"; geliefert: "10 × D-Link Switches"

**Minderlieferung**  
Zu wenig geliefert (quantitativ).
- **IT-Beispiel:** Vertraglich vereinbart: "100 Lizenzen Microsoft 365"; tatsächlich: "80 Lizenzen"

### Beispielhaftes Abnahmeprotokoll als Tabelle

```
============================================================
                    ABNAHMEPROTOKOLL
============================================================

Projekt:           Netzwerk-Migration Firma XYZ GmbH
Datum:             TT.MM.JJJJ, 14:00 Uhr
Ort:               Firma XYZ, IT-Raum, 3. Stock

BETEILIGTE:
Auftraggeber:      Hans Müller, IT-Leiter XYZ (Unterschrift: _____) 
Auftragnehmer:     Anna Schmidt, Projektleiter IT-Service (Unterschrift: _____)

LEISTUNGSUMFANG (Vereinbart):
- Austausch 5 × Core Switch gegen Cisco Catalyst 9300 48 PoE+
- Konfiguration VLAN 10 (Management), VLAN 20 (User), VLAN 30 (Drucker)
- Verkabelung CAT.6A, Dokumentation, Schulung IT-Team (2 Stunden)

LEISTUNGSUMFANG (Erbracht):
✓ 5 × Cisco Catalyst 9300 installiert und konfiguriert
✓ VLAN 10, 20, 30 aktiviert und getestet
✓ CAT.6A-Kabel verlegt (128 Ports, Durchgangsprüfung bestanden)
✓ Dokumentation übergeben (PDF, 45 Seiten)
✓ Schulung durchgeführt, IT-Team kann Basiskonfiguration ändern

FESTGESTELLTE MÄNGEL:
Bei gemeinsamer Begehung am Abnahmetag festgestellt:
- Kleines Leck in Kabelkanal bei Schrank 3 (keine Auswirkung auf Funktionalität)
- Dokumentation erwähnt Failover-Konfiguration nicht (wird nötig für Redundanz)

Vereinbarte Nachbesserung:
1. Leck beheben: bis TT.MM.JJJJ (zwei Wochen nach Abnahme)
2. Dokumentation Failover-Konfiguration ergänzen: bis TT.MM.JJJJ (zwei Wochen nach Abnahme)

UNTERSCHRIFT:
Auftraggeber:    _________________ Datum: ____________
Auftragnehmer:   _________________ Datum: ____________
```

### Praxisbeispiel: Abnahme einer Software-Lösung

Ein Unternehmen hat eine neue CRM-Software entwickelt. Im Abnahmeprotokoll wird dokumentiert:
- Alle vereinbarten Module (Kundenverwaltung, Reporting, Schnittstelle zu Buchhaltung) getestet
- Bug: "Druck-Funktion funktioniert nicht zuverlässig" → Nachbesserungsfrist 1 Woche
- Schulung der User durchgeführt und dokumentiert
- Mit Unterschrift: Leistung angenommen (trotz Minor-Bug), Gewährleistung läuft 24 Monate, Rechnung wird fällig

### Einweisung der Anwender

Die Übergabe ist mit dem Protokoll formal erledigt — **nutzbar** wird die Leistung erst, wenn die
Anwender damit arbeiten können. Genau das ist der Zweck der Einweisung: **Die Anwender sollen das
System selbstständig für ihre täglichen Aufgaben nutzen können.** Sie ist eine Leistung für den
Kunden, keine Vorführung des eigenen Könnens.

**Die vier Dokumente des Projektabschlusses — und wofür jedes da ist:**

| Dokument | Beantwortet die Frage | Zielgruppe |
|---|---|---|
| **Übergabeprotokoll** | **Was** wurde übergeben? | beide Vertragsparteien |
| **Anwenderdokumentation** | **Wie bedient** man es? | Endanwender |
| **Systemdokumentation** | **Wie ist es aufgebaut?** | IT-Betrieb, Administration |
| **Schulungsunterlage** | Begleitmaterial **zur Einweisung** | Teilnehmer der Schulung |

⚠️ **Anwender- und Systemdokumentation werden regelmäßig verwechselt.** Eine gute
**Anwender**dokumentation beschreibt **Arbeitsabläufe in der Sprache des Anwenders** und ist
gezielt **durchsuchbar**. Technische Details — Adressen, Konfigurationen, Schnittstellen —
gehören in die **System**dokumentation. In die **Schulungsunterlage** gehören die wichtigsten
Arbeitsschritte mit **Bildschirmfotos** und eine kurze Seite zum Nachschlagen; nicht Technik,
nicht Lizenzen, nicht der Projektplan.

**Eine Einweisung planen — fünf Schritte in dieser Reihenfolge:**

1. **Zielgruppe klären** — wer nimmt teil, mit welchem Vorwissen, in welcher Rolle?
2. **Lernziele festlegen** — was soll jeder danach *selbst tun können*?
3. **Unterlagen vorbereiten** — Schulungsunterlage und Anwenderdokumentation vor dem Termin
4. **Durchführen**
5. **Erfolg prüfen und nacharbeiten**

⚠️ **Die Reihenfolge ist die Aussage:** Wer die Unterlage vor den Lernzielen schreibt, schult den
Stoff statt die Aufgabe.

**Die wirksamste Methode: am eigenen Fall üben.** Die Teilnehmer führen die typischen
Arbeitsschritte **selbst am Gerät** an ihren eigenen Vorgängen aus, statt sie vorgeführt zu
bekommen. Vorführung erzeugt Zustimmung, Üben erzeugt Können.

**Große oder verteilte Gruppen: das Multiplikatorprinzip.** Bei vielen Anwendern an mehreren
Standorten wird **je Standort eine Schlüsselperson geschult**, die ihre Kollegen vor Ort einweist.
Das Verfahren und seine Wirkung stehen in **Abschnitt 7.5** („Einsatz von Multiplikatoren") —
dort im Zusammenhang mit Veränderungsprozessen, hier als Mittel der Übergabe.

**Einweisung per Fernwartung** ist möglich, aber an Bedingungen gebunden:
- **Zustimmung des Kunden** und **verschlüsselte** Verbindung
- **kleinere Gruppen** als vor Ort, damit alle aktiv mitarbeiten können
- **keine Echtdaten** in der Übung und **keine heimliche Aufzeichnung**
- ⚠️ Sie **ersetzt nicht jeden Vor-Ort-Termin** — Hardware-Handgriffe brauchen Anwesenheit.

**Umgang mit Teilnehmern und Rückfragen:**

| Situation | Angemessene Reaktion |
|---|---|
| Eine Frage, deren Antwort man **nicht sicher weiß** | **Offen sagen, dass man nachsieht**, die Frage notieren, die Antwort verbindlich nachreichen. ⚠️ **Raten beschädigt das Vertrauen stärker als Nichtwissen.** |
| Einzelne kommen **nicht mit** | Tempo herausnehmen, Einzelhilfe geben |
| Jemand **lehnt die Lösung ab** | Nicht im Termin ausdiskutieren — außerhalb klären (siehe 7.5, Widerstände) |
| **Dieselbe Frage kommt immer wieder** | Das ist ein Hinweis auf eine **Schwäche der Unterlage**, nicht auf die Teilnehmer |
| Ein Wunsch **außerhalb des Auftrags** | Aufnehmen und in ein **Angebot** überführen, nicht nebenbei erledigen |

**Erfolgskontrolle — woran man sie wirklich misst.** Erfolgsmaßstab ist die **selbstständige
Anwendung im Alltag**: Die Teilnehmer erledigen die eingeübten Aufgaben danach **ohne Rückfrage
zur Bedienung**. ⛔ **Anwesenheitslisten, gute Bewertungsbögen und ein vollständig abgearbeiteter
Stoffplan belegen das nicht** — sie sind die klassischen Falschantworten dazu.

**Übergabe von Zugangsdaten.** Werden bei der Übergabe administrative Zugänge ausgehändigt, gilt:
Im Protokoll wird **nur vermerkt, DASS** Zugangsdaten übergeben wurden — die **Kennwörter selbst
gehen getrennt über einen sicheren Weg**. Kennwörter gehören nie in den Protokolltext.

⚠️ **Abgrenzung: erbrachte Einweisung ist kein Mangel.** Ruft der Kunde Monate später an, weil
eine **neu eingestellte** Person das System nicht kennt, ist das eine **neue, zu beauftragende
Leistung** — nicht Gewährleistung. Gewährleistung greift nur bei Mängeln der **erbrachten**
Leistung. Dasselbe gilt für eine Nachschulung: **erst die Störungsmeldungen auswerten und den
Fehlertyp bestimmen** — liegt es an der Software, ist es ein Mangel; liegt es an der Bedienung
und war die Einweisung vertragsgemäß erbracht, ist die Nachschulung ein neuer Auftrag.

### Typische IHK-Aufgabenstellungen

- Erstellen Sie ein Abnahmeprotokoll für eine gegebene IT-Dienstleistung.
- Welche Auswirkung hat die Abnahmeprotokoll auf die Fälligkeit der Zahlung?
- Unterscheiden Sie: Schlechtleistung vs. Falschlieferung mit IT-Beispielen.
- Ein Auftraggeber möchte das Abnahmeprotokoll nicht unterzeichnen, da er die Schulung vergessen hat. Wie ist die Rechtslage?

### Merksätze

- **Abnahmeprotokoll = Beweis der Leistung** → Ohne Unterschrift kein Nachweis
- **Mit Abnahme → Gewährleistung läuft + Zahlung fällig** → Kritisch!
- **Bekannte Mängel immer ins Protokoll aufnehmen** → Wer einen bekannten Mangel bei der Abnahme nicht vorbehält (§ 640 Abs. 3 BGB), verliert dafür wesentliche Mängelrechte

### Selbsttest

<details>
<summary>Frage 1: Welche rechtliche Konsequenz hat die Unterzeichnung eines Abnahmeprotokolls?</summary>
1. Gefahrenübergang (Risiko wechselt zum Auftraggeber)
2. Beginn der Gewährleistungszeit
3. Fälligkeit der Rechnung/Zahlungsanspruch
4. Beweis der Leistungserbringung für Streitfall
</details>

<details>
<summary>Frage 2: Ein Unternehmen beauftragt die Installation von 20 Computern. Es werden nur 18 geliefert. Welche Mängelart liegt vor?</summary>
Minderlieferung. Quantitative Abweichung von der Vereinbarung.
</details>

<details>
<summary>Frage 3: Beim Abnahmeprotokoll wird ein Bug in der Software dokumentiert. Der Auftraggeber weigert sich, zu unterzeichnen. Kann der Auftragnehmer die Software trotzdem als "abgenommen" betrachten?</summary>
Nicht allein deshalb, weil er es möchte — aber die fehlende Unterschrift ist <strong>nicht</strong> das Ende der Sache. Drei Wege:
<br>1. <strong>Nachbesserung</strong> des Bugs, danach erneute Abnahme.
<br>2. <strong>Abnahme unter Vorbehalt</strong>: Unterschrift mit Vermerk "unter Vorbehalt der Nachbesserung bis TT.MM.JJJJ" — der Auftraggeber behält seine Mängelrechte (§ 640 Abs. 3 BGB).
<br>3. Nimmt der Auftraggeber die Software trotz des Bugs <strong>produktiv in Betrieb</strong> und rügt nichts weiter, liegt eine <strong>konkludente Abnahme</strong> nach § 640 BGB vor — rechtlich genauso wirksam wie die unterschriebene. Und wenn der Auftragnehmer eine angemessene Frist setzt und der Auftraggeber die Abnahme nicht unter Angabe eines Mangels verweigert, greift die <strong>fiktive Abnahme</strong> (§ 640 Abs. 2 BGB).
<br>⚠️ Der Bug ist hier ein <strong>benannter</strong> Mangel — deshalb kann der Auftraggeber die Abnahme berechtigt verweigern, solange der Mangel wesentlich ist. Die Unterschrift bleibt für den Auftragnehmer das Ziel, weil sie <strong>beweisbar</strong> ist.
</details>

---

## 7.7 Leistungserbringung bewerten und dokumentieren können

**Einordnung:**  
Fragenkomplex 07, Taxonomiestufe Analyse und Evaluation. Schließt den Projektkreislauf und liefert Basis für Verbesserungen.

### Soll-Ist-Vergleich und Abweichungsanalyse

**Soll-Ist-Vergleich:**  
Gegenüberstellung vereinbarter (Soll) vs. tatsächlicher (Ist) Größen:

| Kriterium | Soll | Ist | Abweichung |
|-----------|------|-----|-----------|
| Umfang | 100 % | 100 % | keine ✓ |
| Zeitplan | 8 Wochen | 9 Wochen | 1 Woche Überschreitung ✗ |
| Budget | 50.000 EUR | 48.500 EUR | 1.500 EUR unterschritten ✓ |
| Qualität (Verfügbarkeit) | 99,5 % | 99,8 % | 0,3 Prozentpunkte besser ✓ |
| Fehleranzahl | max. 5 | 3 | 2 unter dem Limit ✓ |

**Abweichungsanalyse:**  
Warum gibt es Abweichungen? Ursachen identifizieren:

1. **Zeitverzug (+1 Woche über Plan):** Ursache: Kunde war 1 Woche nicht erreichbar zur Freigabe → Klassisch, externe Abhängigkeit
2. **Budget unterschritten (−1.500 EUR Abweichung):** Ursache: Einsatz eines Senior-Entwicklers (höhere Produktivität, nicht mehr Stunden, aber schneller) → Positiv, Effizienzgewinn
3. **Qualität übertroffen:** Ursache: Zusätzliche Testphase investiert (aus Eigeninitiative) → Gut, aber ggf. als Kalkulation nicht vorgesehen

### Nachkalkulation

(Verweis auf Modul 01: Kostenrechnung)

Die Nachkalkulation bewertet, wie wirtschaftlich das Projekt war:

**Formel:**  
⚠️ **Zwei Kennzahlen, die verwechselt werden — sie unterscheiden sich um genau 100 Punkte:**

| Kennzahl | Formel | im Beispiel unten |
|---|---|---|
| **Kostenerreichungsgrad** | Ist ÷ Soll × 100 % | **101,5 %** |
| **Kostenabweichung** | (Ist − Soll) ÷ Soll × 100 % | **+1,5 %** |

⛔ **Wer nach „der prozentualen Abweichung" gefragt wird, meint die zweite Zeile.** Beide Werte
beschreiben dieselbe Lage, aber nur einer heißt Abweichung. Für Stunden gilt beides genauso
(Ist-Stunden gegen Angebots-Stunden).
⚠️ **Die Abweichung darf negativ sein** — ein Minus ist eine Kosten**unter**schreitung, kein
Rechenfehler.

**Bewertung am Erreichungsgrad:**
- < 100 % = wirtschaftlicher als geplant (Gewinn höher als kalkuliert)
- = 100 % = wie geplant kalkuliert
- > 100 % = unwirtschaftlicher als geplant (Kalkulation prüfen!)

### Zahlenbeispiel: Nachkalkulation

**Angebot an Kunde:**
- Projektleiter: 10 h à 120 EUR
- Techniker: 30 h à 90 EUR
- **Gesamt: (10 × 120) + (30 × 90) = 1.200 + 2.700 = 3.900 EUR**

**Tatsächliche Aufwendungen:**
- Projektleiter: 12 h (2 h mehr wegen Kundenkommunikation) à 120 EUR
- Techniker: 28 h (2 h weniger, effizienter) à 90 EUR
- **Gesamt: (12 × 120) + (28 × 90) = 1.440 + 2.520 = 3.960 EUR**

**Nachkalkulation:**
- Abweichung: 3.960 EUR - 3.900 EUR = +60 EUR (Mehrkosten)
- Erreichungsgrad: (3.960 / 3.900) × 100 % = 101,5 % · **Abweichung: +60 / 3.900 = +1,5 %**
- **Bewertung:** 1,5 % über Plan → Leicht unwirtschaftlich, aber im Toleranzbereich (meist < 5 % akzeptabel)

**Analyse:** Warum +60 EUR Mehrkosten?
- Projektleiter brauchte 2 h mehr (Kundenkommunikation war intensiver)
- Techniker sparte 2 h ein (effiziente Umsetzung)
- Netto: +60 EUR

**Kalkulation für Zukunft:** Kundentyp braucht intensivere Betreuung → In nächsten Angeboten 15 % Kommunikationspuffer einrechnen.

### Lessons Learned

Systematische Dokumentation, was gut und schlecht lief:

| Was lief gut? | Was hätte besser sein können? | Maßnahme für nächstes Projekt |
|---------------|-------------------------------|------------------------------|
| Kundenkommunikation klar | Datenbeschaffung vom Kunden langsam | Frühzeitig Checkliste mit Kunde abstimmen |
| Technische Umsetzung zügig | Keine Testumgebung geplant | In Planung 1 Woche Testing einrechnen |
| Budget eingehalten | Schulung wurde unterschätzt | 4 h Schulung immer einkalkulieren |
| Dokumentation vollständig | – | Standard-Template für nächste Projekte |

**Nutzen:** Lessons Learned verhindern, dass gleiche Fehler wiederholt werden. Kontinuierliche Verbesserung (KVP / Kaizen).

### Generierung von Nachfolgeaufträgen

Zufriedene Kunden sind die beste Quelle für neue Aufträge:

**Cross-Selling**  
Der Kunde hat Problem A gelöst bekommen → Zeige Lösung für Problem B. Beispiel: "Sie haben jetzt modernes Netzwerk. Wie steht es mit Ihrer Cybersecurity?"

**Wartungsverträge**  
Nach Projektabschluss: Angebot eines SLA-Servicevertrag für laufende Wartung. Beispiel: "Für 500 EUR/Monat übernehmen wir 24/7-Monitoring und Notfall-Support."

**Upgrades und Erweiterungen**  
Bestehende Systeme erweitern. Beispiel: "Sie haben 100 User-Lizenzen. Mit 200 Lizenzen könnten Sie die Außenstelle anschließen."

**Zufriedenheit als Basis**  
Ohne positive Erfahrung keine Nachfolgeaufträge. Daher:
- Problemlos Abnahmeprotokoll unterzeichnen (Kunde zufrieden)
- Post-Project-Support anbieten (Fragen beantworten)
- Regelmäßiger Kontakt (Newsletter, Jahresgespräch)
- Kundenreferenzen einholen (später in Ausschreibungen verwenden)

### Praxisbeispiel: Komplette Nachkalkulation

**Projekt:** Windows 11-Migration für 100 PCs

**Geplant (Angebot):**
- Vorbereitung + Planung: 20 h
- Migration selbst: 80 h
- Testing und Dokumentation: 20 h
- Schulung: 10 h
- **Total: 130 h à 85 EUR = 11.050 EUR**

**Tatsächlich:**
- Vorbereitung: 18 h (2 h Ersparnis durch bessere Tools)
- Migration: 90 h (10 h mehr wegen Hardware-Inkompatibilität 5 PCs)
- Testing: 18 h (2 h Ersparnis durch Automation)
- Schulung: 12 h (2 h mehr, weil CEO mitgeschult werden wollte)
- **Total: 138 h à 85 EUR = 11.730 EUR**

**Nachkalkulation:**
- Abweichung: 11.730 - 11.050 = +680 EUR (Mehrkosten)
- Erreichungsgrad: (11.730 / 11.050) × 100 % = 106,2 % · **Abweichung: +680 / 11.050 = +6,2 %**
- **Bewertung:** 6,2 % über Plan → Leicht unwirtschaftlich

**Lessons Learned:**
- Hardware-Kompatibilität vor Projekt prüfen (wird in nächsten Angeboten berücksichtigt)
- Schulung für C-Level extra einplanen
- Tools-Automation hat sich bewährt → Weiter nutzen

**Nachfolgeauftrag:**
- Kunde zufrieden → Wartungsvertrag angeboten: "500 EUR/Monat für 12 Monate" → Kunde akzeptiert
- Cross-Selling: "Jetzt auch Ihre Drucker ins Netzwerk?" → Neue Anfrage

### Typische IHK-Aufgabenstellungen

- Führen Sie einen Soll-Ist-Vergleich für ein gegebenes Projekt durch und analysieren Sie Abweichungen.
- Berechnen Sie die Nachkalkulation und bewerten Sie die Wirtschaftlichkeit.
- Dokumentieren Sie Lessons Learned für ein Projekt und leiten Sie Verbesserungen ab.
- Wie leiten Sie aus zufriedenen Kunden Nachfolgeaufträge ein?

### Merksätze

- **Soll-Ist-Vergleich = Transparenz über die Projektleistung** → Basis für kontinuierliche Verbesserung
- **Nachkalkulation > 100 % = Geld verloren** → Kalkulationen müssen überprüft und angepasst werden
- **Lessons Learned vermeiden Wiederholungsfehler** → Systemisch dokumentieren
- **Zufriedener Kunde = beste Neukundenquelle** → In Nachbetreuung investieren

### Selbsttest

<details>
<summary>Frage 1: Sie bieten Projekt-Stunden für 10.000 EUR an. Nachkalkulation ergibt 11.200 EUR. War das Projekt wirtschaftlich?</summary>
Nein. (11.200 / 10.000) × 100 % = 112 %. Das Projekt hat 12 % mehr gekostet als kalkuliert → Verlust von 1.200 EUR. Ursache ermitteln und in nächsten Angeboten berücksichtigen.
</details>

<details>
<summary>Frage 2: Nennen Sie drei Elemente einer Lessons-Learned-Dokumentation.</summary>
1. Was lief gut?
2. Was hätte besser sein können?
3. Konkrete Maßnahmen für nächste Projekte
(Optional: Kenntnis-Beobachtungen, Risiken, die hätten verhindert werden können)
</details>

<details>
<summary>Frage 3: Ein Projekt war technisch erfolgreich, aber 20 % über Budget. Was tun Sie?</summary>
1. Ursachen analysieren (Nachkalkulation)
2. Mit Kunde klären (ggf. Change-Request-Prozess, Zusatzrechnung)
3. Lessons Learned dokumentieren
4. Kalkulationen überprüfen und Buffers anpassen
5. In ähnlichen Projekten Puffer einrechnen
</details>

<details>
<summary>Frage 4: Welcher Unterschied besteht zwischen Cross-Selling und Wartungsvertrag?</summary>
Cross-Selling: Ein zusätzliches Problem des Kunden lösen (Upsell zu neuem Produkt/Service). Wartungsvertrag: Laufende Betreuung des bestehenden Systems nach Projektabschluss (Recurring Revenue).
</details>

---

## Zusammenfassung Modul 07

| Thema | Kernpunkt | Merkregel |
|-------|-----------|-----------|
| 7.1 Verträge | Werkvertrag = Erfolg, Dienstvertrag = Bemühen | Abnahmeprotokoll rechtlich bindend |
| 7.2 Ziele | Ökonomisch, ökologisch, sozial | Leitbild bestimmt Maßnahmen |
| 7.3 Umsetzung | Onsite vs. Remote | Kundenvorgaben sind Nebenbedingungen |
| 7.4 Organisation | Einlinie, Mehrlinie, Matrix | Klare Vollmachten vermeiden Konflikte |
| 7.5 Veränderung | Chancen betonen, Multiplikatoren nutzen | Widerstand ist normal; proaktiv kommunizieren |
| 7.6 Übergabe | Abnahmeprotokoll dokumentiert Mängel | Unterschrift = Gefahrenübergang + Fälligkeit |
| 7.7 Bewertung | Soll-Ist, Nachkalkulation, Lessons Learned | Zufriedenheit schafft Nachfolgeaufträge |

---

**Viel Erfolg bei der Vorbereitung!**
