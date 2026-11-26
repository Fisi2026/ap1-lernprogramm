# Modul 05 – Qualitätssicherung

## Modulübersicht
Dieses Modul behandelt die Grundlagen und praktische Anwendung von Qualitätsmanagementsystemen (QM-Systemen) im IT-Umfeld. Der Fokus liegt auf normativen Anforderungen (DIN EN ISO 9000er-Familie) und der Durchführung von Qualitätsmaßnahmen im eigenen Arbeitsbereich, insbesondere beim Einrichten von Arbeitsplätzen.

**Fragenkomplex:** IHK-Prüfungskatalog Fachinformatiker Systemintegration, AP1, Fragenkomplex 05  
**Lernfelder:** LF 3, 5, 6  
**Basis:** IHK-Katalog 2. Auflage 2024

### Inhaltsverzeichnis
1. [5.1 Fachbegriffe zu Qualitätsmanagementsystemen](#51-fachbegriffe-zu-qualitätsmanagementsystemen)
2. [5.2 QM-Maßnahmen planen und anwenden](#52-qm-maßnahmen-planen-und-anwenden)

---

## 5.1 Fachbegriffe zu Qualitätsmanagementsystemen

**Einordnung:**  
Fragenkomplex 05, Taxonomiestufe „Grundverständnis nachweisen". Grundlagen-Verständnis der QM-Begrifflichkeit ist zentral für die AP1. Häufige Aufgabenform: Definitionen zuordnen, Unterschiede erklären.

### Was ist Qualitätsmanagementsystem (QM-System)?

Ein **Qualitätsmanagementsystem (QMS; Quality Management System)** ist die organisierte Gesamtheit aller Prozesse, Richtlinien und Verfahren, um die Qualität von Produkten und Dienstleistungen sicherzustellen und ständig zu verbessern.

**Ziele eines QM-Systems:**
- Kundenerwartungen erfüllen und übertreffen
- Fehler und Verschwendung minimieren
- Vertrauen und Verlässlichkeit aufbauen
- Kontinuierliche Verbesserung (KVP — Kontinuierlicher Verbesserungsprozess) verankern

**KVP (Kaizen):**  
Systematischer Prozess, bei dem Mitarbeiter regelmäßig kleine, nachhaltige Verbesserungen einbringen. Im IT-Kontext: z. B. Optimierung von Ticketing-Prozessen, Automatisierung von Patches.

### QS-Normen: DIN EN ISO 9000er-Familie

**ISO 9000 – Grundlagen und Begriffe**
- Definiert Kernbegriffe des Qualitätsmanagements (z. B. Qualität, Konformität, Abweichung)
- Orientierungshilfe für QM-Verständnis

**ISO 9001 – Anforderungen an QM-Systeme (zertifizierbar)**
- Verbindliches Regelwerk für Aufbau und Betrieb von QM-Systemen
- Unternehmen, die zertifiziert sein möchten, müssen alle Anforderungen erfüllen
- Gilt branchenübergreifend (Industrie, Dienstleistung, auch IT-Betriebe)

**Nutzen von Normen:**
- Einheitliche, überprüfbare Standards
- Schaffung von Vergleichbarkeit
- Rechtssicherheit und Nachvollziehbarkeit
- Basis für externe Zertifizierung

### Qualitätskosten: was Qualität kostet — und was ihr Fehlen kostet

Qualität ist keine kostenlose Zugabe. **Alle Kosten, die durch das Erreichen oder Verfehlen von
Qualität entstehen, heißen Qualitätskosten.** Sie zerfallen in vier Arten — und die Reihenfolge
ist die Aussage:

| Art | Wann sie anfallen | IT-Beispiel |
|---|---|---|
| **Fehlerverhütungskosten** (Prävention) | **bevor** etwas passiert | Schulung der Techniker, Checklisten und Standardprozesse entwickeln, Testumgebung aufbauen |
| **Prüfkosten** | **während** der Herstellung | Testprotokoll je Arbeitsplatz, Abnahmeprüfung, internes Audit, Messmittel |
| **Interne Fehlerkosten** | Fehler wird **im Haus** entdeckt | Nacharbeit vor der Übergabe, Neuinstallation eines falsch aufgesetzten PCs, Ausschuss |
| **Externe Fehlerkosten** | Fehler erreicht den **Kunden** | Vor-Ort-Einsatz zur Nachbesserung, Gewährleistung, Kulanz, Vertragsstrafe, Imageschaden |

⚠️ **Die ersten beiden sind gewollte Ausgaben, die letzten beiden sind Schäden.** Prävention und
Prüfung sind planbar; Fehlerkosten sind es nicht.

**Die Zehnerregel der Fehlerkosten (10er-Regel)**

> **Die Kosten der Fehlerbehebung verzehnfachen sich mit jeder Phase, in der ein Fehler
> unentdeckt bleibt.**

| Wo der Fehler entdeckt wird | Kosten |
|---|---|
| in der Planung | **1 €** |
| in der Umsetzung | **10 €** |
| bei der internen Prüfung | **100 €** |
| beim Kunden | **1.000 €** |

**Beispiel:** Ein Konfigurationsfehler, der in der Planung 10 € gekostet hätte, kostet beim Kunden
etwa **1.000 €** — Anfahrt, Arbeitszeit, Stillstand beim Kunden, Vertrauensverlust.
⚠️ **Daraus folgt die ganze Logik des Qualitätsmanagements:** Geld für Prävention und Prüfung
auszugeben ist billiger, als Fehlerkosten zu tragen. **Wer an der Checkliste spart, zahlt beim
Kunden.**

### Zertifizierung

**Ablauf einer Zertifizierung:**
1. **Vorbereitung** – Unternehmen implementiert QM-System nach ISO 9001
2. **Externes Audit** – Akkreditierte Zertifizierungsstelle prüft Konformität
3. **Zertifikatsvergabe** – Bei Bestehen (Gültigkeitsdauer i. d. R. **3 Jahre**)
4. **Überwachungsaudits** – i. d. R. jährlich, um Konformität zu bestätigen

**Nutzen für das Unternehmen:**
- **Vertrauensaufbau:** Kunden sehen externe Bestätigung der Qualität
- **Wettbewerbsvorteil:** Differenzierung vom Markt
- **Kundenanforderung:** Viele große Auftraggeber fordern ISO 9001-Zertifikat als Geschäftsbedingung

### Audits und Prüfverfahren

Ein **Audit** ist eine **systematische, unabhängige Untersuchung**, ob Prozesse und Ergebnisse den
festgelegten Anforderungen entsprechen — und ob diese Anforderungen wirksam sind. Geprüft wird
gegen einen Maßstab (Norm, Richtlinie, Vertrag), nicht nach Gefühl.

| | **Internes Audit** | **Externes Audit** |
|---|---|---|
| **Wer prüft** | eigene, geschulte Mitarbeiter — **nicht im eigenen Bereich** | Zertifizierungsstelle, Kunde oder Lieferant |
| **Zweck** | Schwachstellen **selbst** finden, bevor es jemand anderes tut | Konformität nach außen belegen |
| **Folge** | Verbesserungsmaßnahmen | Zertifikat oder Auflagen |

⚠️ **Das interne Audit ist die Vorbereitung auf das externe.** Wer vor der ISO-9001-Zertifizierung
selbst prüft, findet die Lücken, solange sie noch nichts kosten.
⚠️ **Unabhängigkeit heißt: niemand auditiert die eigene Arbeit.** Sonst prüft man die eigene
Betriebsblindheit mit.

**Verifizierung und Validierung — die Standardverwechslung**

| Begriff | Prüft | Leitfrage | Merksatz |
|---|---|---|---|
| **Verifizierung** | ob das Ergebnis der **Spezifikation** entspricht | „Haben wir es richtig gebaut?" | **das Produkt richtig gebaut** |
| **Validierung** | ob das Ergebnis den **Zweck** erfüllt | „Haben wir das Richtige gebaut?" | **das richtige Produkt gebaut** |

**Beispiel:** Ein Arbeitsplatz wird genau nach Vorgabe eingerichtet — 16 GB RAM, zwei Monitore,
Standardsoftware. Die **Verifizierung** ist bestanden: alles wie spezifiziert. Stellt sich heraus,
dass die Anwenderin ein CAD-Programm braucht, das damit nicht läuft, ist die **Validierung**
gescheitert: richtig gebaut, aber das Falsche.

**Vollprüfung oder Stichprobe?**

| | Wann sinnvoll |
|---|---|
| **Vollprüfung** | wenige Einheiten, hohes Risiko, sicherheitskritisch — jedes Stück wird geprüft |
| **Stichprobenprüfung** | **viele gleichartige Einheiten** — z. B. 50 Arbeitsplätze täglich. Wirtschaftlich, solange der Prozess stabil ist |

⚠️ **Die Stichprobe prüft den Prozess, nicht das Einzelstück.** Häufen sich Fehler in den
Stichproben, wird nicht mehr Stichprobe geprüft — dann wird der Prozess korrigiert.

### Abgrenzung: QS und QM

| **Qualitätssicherung (QS)** | **Qualitätsmanagementsystem (QM)** |
|---|---|
| **Teil** des QM | **Ganzes System** |
| Fokus: Prüfen, Messen, Dokumentieren | Fokus: Planen, Umsetzen, Überprüfen, Verbessern |
| z. B. Testprotokolle, Checklisten | z. B. Prozessrichtlinien, Verantwortlichkeiten, KVP |

**Faustregel:** QM ist der Rahmen, QS ist ein Werkzeug *innerhalb* dieses Rahmens.

### Typische IHK-Aufgabenstellungen
- „Ordne die Begriffe QM, QS, KVP und ISO 9001 sachgerecht zu."
- „Erläutere, warum ISO 9001-Zertifizierung für den IT-Service-Betrieb vorteilhaft ist."
- „Nenne zwei Unterschiede zwischen QS und QM."
- „Beschreibe den Ablauf eines Zertifizierungsaudits."

### Merksätze
- **„QM ist die Strategie, QS ist die Praxis."**
- **„ISO 9001 = die Spielregeln, die ein Unternehmen befolgen muss."**
- **„KVP = kleine Schritte, große Wirkung."**

### Selbsttest

**Frage 1:** Was versteht man unter einem Qualitätsmanagementsystem (QMS)?  
<details><summary>Lösung anzeigen</summary>
Gesamtheit aller Prozesse, Richtlinien und Verfahren, um die Qualität von Produkten/Dienstleistungen sicherzustellen und kontinuierlich zu verbessern. Ziel: Kundenerwartungen erfüllen, Fehler minimieren, Vertrauen aufbauen.
</details>

**Frage 2:** Welche ISO-Norm ist **zertifizierbar** und legt verbindliche Anforderungen fest?  
<details><summary>Lösung anzeigen</summary>
ISO 9001 – Anforderungen an Qualitätsmanagementsysteme. Sie legt die verbindlichen Anforderungen fest, die ein Unternehmen für eine Zertifizierung erfüllen muss.
</details>

**Frage 3:** Wie lange ist eine ISO 9001-Zertifizierung gültig, und wie wird sie überwacht?  
<details><summary>Lösung anzeigen</summary>
Gültigkeitsdauer: i. d. R. 3 Jahre. Überwachung durch jährliche Überwachungsaudits einer akkreditierten Zertifizierungsstelle.
</details>

**Frage 4:** Nenne einen wesentlichen Unterschied zwischen Qualitätssicherung (QS) und Qualitätsmanagementsystem (QM).  
<details><summary>Lösung anzeigen</summary>
QS prüft und dokumentiert Ergebnisse (z. B. Testprotokoll); QM ist das gesamte System aus Planung, Umsetzung, Überprüfung und kontinuierlicher Verbesserung. QS ist **Teil** des QM.
</details>

**Frage 5:** Was ist KVP und gib ein IT-Beispiel.  
<details><summary>Lösung anzeigen</summary>
KVP = Kontinuierlicher Verbesserungsprozess (Kaizen). Beispiel IT: Regelmäßige Optimierung des Ticketing-Systems oder Automatisierung wiederkehrender Wartungsaufgaben.
</details>

---

## 5.2 QM-Maßnahmen planen und anwenden

**Einordnung:**  
Fragenkomplex 05, Taxonomiestufe „kennen, planen und anwenden". Die praktische Anwendung ist zentral. Häufige Aufgabenform: PDCA-Zyklus auf Szenarios anwenden, Testprotokolle erstellen und bewerten.

### Qualitätsplanung, Qualitätslenkung und Qualitätsverbesserung

**Qualitätsplanung (Quality Planning):**
- Ist-Zustand erfassen: Wie ist der aktuelle Prozess? Welche Probleme bestehen?
- Ziel-Zustand definieren: Messbare Qualitätsziele festlegen
- **Beispiel:** „Neue Arbeitsplatz-Installationen: Aktuell 8 % Fehlerquote → Ziel: max. 2 % Fehlerquote in 3 Monaten"

**Qualitätslenkung (Quality Control):**
- Maßnahmen umsetzen und steuern (Do-Phase)
- Prozesse korrigieren, wenn Abweichungen entstehen
- **Beispiel:** Checkliste erstellen, Schulung durchführen, tägliche Qualitätschecks durchführen

**Qualitätsverbesserung (Quality Improvement):**
- Langfristige Optimierung aus abgeleiteten Erkenntnissen
- Prozessoptimierung, Automatisierung, Best-Practice-Dokumentation

### Der PDCA-Zyklus (Deming-Kreis)

Der **PDCA-Zyklus (Plan-Do-Check-Act, Deming-Kreis)** ist das Kernmodell des Qualitätsmanagements. Er ist iterativ und läuft kontinuierlich.

| **Phase** | **Erklärung** | **IT-Beispiel: Installation neuer Arbeitsplätze** |
|---|---|---|
| **P – Plan** | Ist-Zustand analysieren, Ziel setzen, Maßnahmen planen | Aktuelle Fehlerquote: 5 %. Ziel: 2 %. Maßnahme: Checkliste + Schulung |
| **D – Do** | Plan umsetzen, Prozess durchführen | Checkliste einführen, Techniker schulen, erste 20 Installationen mit Checkliste durchführen |
| **C – Check** | Ergebnisse messen, prüfen, mit Ziel vergleichen | Fehlerquote nach 1 Monat messen: 3,5 % erreicht → Verbesserung, aber noch nicht am Ziel |
| **A – Act** | Erkenntnisse nutzen, Maßnahmen anpassen, standardisieren | Checkliste ergänzen (fehlende Prüfpunkte hinzufügen), weitere Schulung, Prozess standardisieren, nächster PDCA-Zyklus starten |

**Wichtig:** Der Zyklus ist kein einmaliger Durchlauf, sondern **kontinuierlich** — nach Act folgt wieder Plan (spiralförmige Verbesserung).

### Testprotokoll für Arbeitsplatzeinrichtung

**Zweck eines Testprotokolls:**
- Dokumentation, dass alle erforderlichen Prüfpunkte durchgeführt wurden
- Nachweis der Konformität mit Qualitätsstandards
- Nachvollziehbarkeit bei Fehlern oder Reklamationen
- Grundlage für Audits (intern oder extern)

**Typische Inhalte eines Testprotokolls:**
- Prüfdatum, Prüfer (Name, Unterschrift)
- Arbeitsplatz-Identifikation (Raum, Benutzer, Arbeitsplatz-Nr.)
- Prüfpunkte (z. B. Boot, Netzwerk, Software, Peripherie)
- Ergebnis je Prüfpunkt: OK / Fehler
- Bemerkungen / Abweichungen
- Gesamtergebnis: Freigegeben ja/nein

### Beispiel: Testprotokoll Büroarbeitsplatz

| **Prüfpunkt** | **Beschreibung** | **Ergebnis** | **Bemerkungen** |
|---|---|---|---|
| **Boot** | Rechner startet, Windows lädt, Desktop erreichbar | ✓ OK | Startzeit ca. 45 Sekunden |
| **Netzwerk** | Netzwerkverbindung aktiv (LAN/WLAN), Ping Test erfolgreich | ✓ OK | IP: 192.168.1.45 zugewiesen |
| **Domänenanmeldung** | Anmeldung an AD-Domäne erfolgreich, Benutzerprofile geladen | ✓ OK | Benutzer: j.mueller |
| **Peripherie – Monitor** | Monitor erkannt, Auflösung 1920×1080 eingestellt | ✓ OK | DP-Kabel verwendet |
| **Peripherie – Drucker** | Netzwerkdrucker sichtbar, Testseite gedruckt | ○ Fehler | Drucker nicht im Netzwerk erreichbar → IT-Support benachrichtigt |
| **Peripherie – Headset/USB** | USB-Ports funktionieren, Headset erkannt | ✓ OK | Alle 4 USB-3-Ports getestet |
| **Software – Office** | Office 365 installiert, Outlook konfiguriert | ✓ OK | Lizenz aktiviert |
| **Software – VPN** | VPN-Client installiert, Test-Verbindung erfolgreich | ✓ OK | Verbindung stabil |
| **Software – Antivirus** | Windows Defender aktiv, Signaturen aktuell | ✓ OK | Letzte Aktualisierung heute |
| **Benutzer-Ordner** | Persönlicher Ordner auf Dateiserver erreichbar (Z:\) | ✓ OK | Vollzugriff bestätigt |

---

**Prüfdatum:** 2026-07-03  
**Prüfer:** Max Mustermann  
**Unterschrift Prüfer:** _______________

**Gesamtergebnis:**
- ✓ **Arbeitsplatz freigegeben** (mit Vermerk: Drucker-Fehler muss vor Benutzung behoben sein)

---

### Typische IHK-Aufgabenstellungen
- „Ordne die folgenden Aktivitäten den PDCA-Phasen zu: Messung durchführen, Prozess optimieren, Checkliste erstellen, Ergebnisse prüfen."
- „Erstelle ein Testprotokoll für die Einrichtung eines Arbeitsplatzes mit mindestens 8 Prüfpunkten."
- „Beschreibe, wie ein fehlgeschlagener Drucktest in Prüfpunkt C (Check) des PDCA-Zyklus zu Maßnahmen in Phase A (Act) führt."
- „Erkläre, warum die Dokumentation in einem Testprotokoll notwendig ist."

### Merksätze
- **„PDCA ist wie eine Wendeltreppe: immer höher, immer besser."**
- **„Plan ohne Do ist Theorie; Do ohne Check ist Glücksspiel; Check ohne Act ist sinnlos."**
- **„Ein Testprotokoll ist der Beweis, dass Qualität stattgefunden hat."**

### Selbsttest

**Frage 1:** Beschreibe die vier Phasen des PDCA-Zyklus stichwortartig.  
<details><summary>Lösung anzeigen</summary>
**P (Plan):** Ist-Zustand analysieren, Ziel setzen, Maßnahmen planen.  
**D (Do):** Maßnahmen umsetzen.  
**C (Check):** Ergebnisse messen und prüfen.  
**A (Act):** Erkenntnisse nutzen, anpassen, standardisieren, nächsten Zyklus starten.
</details>

**Frage 2:** Ein IT-Betrieb stellt fest, dass 7 % der neu eingerichteten Arbeitsplätze beim ersten Versuch nicht arbeitsfähig sind. Welche PDCA-Phase müsste mit einer Schulungsmaßnahme reagieren (Do oder Act)?  
<details><summary>Lösung anzeigen</summary>
**Act** – die Schulung ist eine Anpassungsmaßnahme, die aus den Erkenntnissen der Check-Phase (Messung der 7-%-Quote) abgeleitet wird. Würde die Schulung von Anfang an zum Plan gehören, wäre ihre Durchführung Teil der Do-Phase.
</details>

**Frage 3:** Nenne drei Prüfpunkte, die in ein Testprotokoll für einen neu eingerichteten Arbeitsplatz gehören.  
<details><summary>Lösung anzeigen</summary>
Z. B.: (1) Boot/Systemstart, (2) Netzwerkanmeldung/Domäne, (3) Peripherie (Drucker/Monitor), (4) Software-Installation, (5) Berechtigungen/Benutzerordner. Mindestens 3 davon nennen.
</details>

**Frage 4:** Warum ist die Dokumentation in einem Testprotokoll wichtig?  
<details><summary>Lösung anzeigen</summary>
(1) Nachweis, dass alle Prüfpunkte durchgeführt wurden, (2) Nachvollziehbarkeit bei Fehlern/Reklamationen, (3) Grundlage für interne/externe Audits, (4) Qualitätssicherung und Compliance.
</details>

**Frage 5:** Der PDCA-Zyklus ist iterativ. Was bedeutet das praktisch für ein Unternehmen?  
<details><summary>Lösung anzeigen</summary>
Nach einem durchlaufenen Zyklus folgt sofort ein neuer Zyklus — es ist ein kontinuierlicher Prozess ohne Ende. Die Qualität verbessert sich spiralförmig, nicht einmalig. Beispiel: Nach der ersten Schulung und Messung folgt Anpassung der Checkliste, erneute Schulung, erneute Messung, etc.
</details>

---

## Zusammenfassung

Qualitätsmanagement ist in modernen IT-Abteilungen unverzichtbar. Die **ISO 9001-Zertifizierung** bildet den formalen Rahmen, während der **PDCA-Zyklus** das operative Werkzeug für ständige Verbesserung ist. **Testprotokolle** sind die konkrete Dokumentation von Qualitätskontrolle im täglichen Handwerk — insbesondere bei kritischen Prozessen wie der Arbeitsplatzeinrichtung. Ziel ist nicht perfektionistische Bürokratie, sondern **systematisch verankertes Vertrauen in die eigene Arbeit.**
