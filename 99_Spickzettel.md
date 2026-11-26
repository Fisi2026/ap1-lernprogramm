# AP1-Spickzettel – Die wichtigsten Fakten, Formeln und Merksätze

Kompakte Gesamtzusammenfassung aller Module. Prüfung: „Einrichten eines IT-gestützten Arbeitsplatzes", 90 Minuten, 4 ungebundene Aufgaben, 100 Punkte, 20 % der Gesamtprüfung. **Nicht in AP1:** SQL, RAID, Normalformen, Struktogramm/PAP, WiSo als eigener Bereich.

---

## Modul 01 – Projektmanagement

**Projektmerkmale:** einmalig, klares Ziel, zeitlich begrenzt, begrenzte Ressourcen, komplex, eigene Organisation.

**Netzplan (Zeitpunkt-Methode):**
- FAZ (Frühester Anfangszeitpunkt), FEZ = FAZ + Dauer → Vorwärtsrechnung
- SEZ (Spätester Endzeitpunkt), SAZ = SEZ − Dauer → Rückwärtsrechnung
- **GP (Gesamtpuffer) = SAZ − FAZ** (oder SEZ − FEZ)
- **FP (Freier Puffer) = FAZ(Nachfolger) − FEZ(aktuell)**
- **Kritischer Weg:** alle Vorgänge mit GP = 0 → bestimmt die Projektdauer

**SMART:** Spezifisch, Messbar, Attraktiv/Akzeptiert, Realistisch, Terminiert.

**Gantt-Diagramm (Balkenplan):** Balkenlänge = Dauer, Zeitachse waagerecht, Vorgänge senkrecht.
- **Meilenstein = Raute**, ein Ereignis **ohne eigene Dauer**
- **Abhängigkeitspfeil:** Vorgang startet erst nach seinem Vorgänger
- **Überschneidung:** nur bei *gemeinsamen* Zeitabschnitten – Balken, die sich an der Grenze berühren, überschneiden sich **nicht**
- Gantt zeigt Zeit und Auslastung anschaulich, aber **keine Puffer und keinen kritischen Weg** – dafür der Netzplan

**Managementtechniken:** **MbO** (Führung über vereinbarte Ziele) · **MbE** (Eingriff nur bei Abweichung) · **MbD** (Aufgabe *und* Verantwortung delegieren).

**Eisenhower-Matrix** (Wichtigkeit × Dringlichkeit): wichtig+dringend → sofort selbst · wichtig+nicht dringend → terminieren · nicht wichtig+dringend → delegieren · keins von beidem → weglassen.

**Scrum:** Product Owner (WAS, Backlog), Scrum Master (Prozess), Entwicklungsteam (WIE); Sprint (1–4 Wochen), Daily, Review (Produkt), Retrospektive (Prozess). Wasserfall = sequenziell/planbar, Scrum = iterativ/flexibel.

**Tuckman:** Forming → Storming → Norming → Performing (→ Adjourning).

**Risiko = Eintrittswahrscheinlichkeit × Schadenshöhe.** Maßnahmen: vermeiden, vermindern, übertragen, akzeptieren.

**Support-Level:** 1st Level = Annahme + Standardfälle, 2nd = Spezialisten, 3rd = Entwickler/Hersteller.

> Merke: „Der kritische Weg hat keinen Puffer – jede Verzögerung dort verschiebt das Projektende."

---

## Modul 02 – Kundenberatung, Kommunikation, Marketing

**Marktformen:** Monopol (1 Anbieter) → Oligopol (wenige) → Polypol (viele).
**Käufermarkt:** Angebot > Nachfrage → Preise sinken. **Verkäufermarkt:** umgekehrt.

**4-Ohren-Modell (Schulz von Thun):** Sachebene, Selbstoffenbarung, Beziehung, Appell (SSBA).
**Sender-Empfänger-Modell:** Störungen technisch/semantisch/organisatorisch; Feedback deckt Missverständnisse auf.

**Fragetypen:** offen (kreativ, schwer auswertbar), geschlossen (schnell auswertbar), Skala (abgestuft).
**Primärdaten** = selbst erhoben, **Sekundärdaten** = vorhanden.

**Nutzwertanalyse (DIE Rechenaufgabe!):**
1. Kriterien festlegen → 2. gewichten (Summe 100 %) → 3. Punkte vergeben (z. B. 1–10) → 4. Punkte × Gewicht → 5. Summe je Alternative → höchste Summe gewinnt.

**Vertrieb:** direkt (Hersteller → Kunde: hohe Marge, hohe Kosten) vs. indirekt (über Händler: Reichweite, geringere Marge).

**Quellenbewertung (SAU):** Seriosität, Aktualität, Urheber.

---

## Modul 03 – IT-Systeme, Hardware, Wirtschaftlichkeit

**OSI-Modell (7→1):** Anwendung, Darstellung, Sitzung, Transport, Vermittlung (IP), Sicherung (Ethernet/MAC), Bitübertragung. *„Alle Priester Saufen Tequila Nach Der Predigt."*
DNS/HTTP/SSH = Schicht 7, TCP/UDP = 4, IP/Router = 3, Switch/MAC = 2.

**Dateisysteme:** FAT32 (max. 4-GB-Dateien, kompatibel), NTFS (Windows, Rechte/Journaling), APFS (macOS), ext4 (Linux).

**WLAN:** 802.11n = Wi-Fi 4 (2,4 + 5 GHz), ac = Wi-Fi 5 (nur 5 GHz), ax = Wi-Fi 6 (2,4 + 5 GHz). **6 GHz erst mit Wi-Fi 6E**; alle drei Bänder gleichzeitig erst mit Wi-Fi 7 (802.11be, seit 2024).

**Formeln:**
- **Übertragungszeit = Datenmenge ÷ Übertragungsrate** — Einheiten! 1 Byte = 8 Bit; GB → Mbit: ×8×1000. *Beispiel: 2,5 GB über 50 Mbit/s = 20.000 Mbit ÷ 50 = 400 s ≈ 6:40 min.*
- **Energie: kWh = (Watt ÷ 1000) × Stunden; Kosten = kWh × Preis.** *150 W × 8 h × 220 Tage = 264 kWh × 0,35 € = 92,40 €/Jahr.*
- **Wirkungsgrad η = P_ab ÷ P_auf** (80-PLUS-Stufen für Netzteile).
- **TCO = Anschaffung + Betriebskosten × Jahre + Entsorgung − Restwert.** (Aufgaben ohne Entsorgungsposten rechnen die Kurzform.)

**Kostenarten:** einmalig (CAPEX) vs. laufend (OPEX); fix vs. variabel. Kauf vs. Leasing vs. Pay-per-Use über Laufzeit vergleichen.

**Gütesiegel:** Energy Star, Blauer Engel, EPEAT, 80 PLUS.

**Wertschöpfung = Output − Vorleistungen** — der *neue* Wert, den das Unternehmen selbst schafft.
**Wertschöpfungskette:** Beschaffung → Produktion → Absatz (**Kernprozesse**, direkt wertschöpfend). **Unterstützungsprozesse** (IT, Personal, Verwaltung) wirken nur indirekt – nicht weniger wichtig, aber ohne Wert am Produkt selbst.

---

## Modul 04 – IT-Lösungen, Software, Programmierung

**Lastenheft = WAS (Auftraggeber), Pflichtenheft = WIE (Auftragnehmer, verbindlich).**

**Private IPv4-Bereiche (RFC 1918):** 10.0.0.0/8 · 172.16.0.0/12 · 192.168.0.0/16.
**IPv6:** 128 Bit, hexadezimal; Link-Local fe80::/10. **APIPA 169.254.x.x = kein DHCP erreichbar!**

**DHCP-Ablauf: DORA** – Discover, Offer, Request, Acknowledge.

**WLAN-Auth:** PSK (gemeinsames Passwort, privat/KMU) vs. Enterprise (802.1X/RADIUS, pro Benutzer, einzeln sperrbar). RADIUS = AAA: Authentifizierung, Autorisierung, Accounting.

**Konsolenbefehle:** dir/ls, mkdir, del/rm, copy/cp, ipconfig / ip addr, arp, chmod (Linux-Rechte), ping, tracert/traceroute, nslookup.

**Lizenzen:** EULA (Endnutzer), OEM (an Gerät gebunden), GNU GPL (Copyleft: Änderungen müssen offen bleiben), Pay-per-Use. UrhG: Schutz entsteht automatisch mit der Schöpfung.

**Programmierung:**
- Compiler (einmal übersetzen, schnell: C/C++) vs. Interpreter (zeilenweise: Python, JS)
- Schleifen: for/while = kopfgesteuert, do-while = fußgesteuert (läuft mind. 1×)
- Funktion = Rückgabewert, Prozedur = keiner
- Sichtbarkeit: + public, − private, # protected
- Fehler: formal (Syntax, Compiler findet ihn) vs. inhaltlich/logisch (läuft, aber falsch)

**UML:** Use-Case (Akteure + Anwendungsfälle; «include» = immer, «extend» = optional), Klassendiagramm (Attribute/Methoden, Multiplizitäten 1, *, 0..1), Aktivitätsdiagramm (Ablauf, Raute = Entscheidung).

**Schreibtischtest:** Tabelle mit einer Spalte je Variable, Zeile für Zeile den Code durchgehen.

**ER-Modell:** Entität (Rechteck), Attribut (Oval), Beziehung (Raute); Kardinalitäten 1:1, 1:n, m:n — **m:n immer über Zwischentabelle auflösen.**

---

## Modul 05 – Qualitätssicherung

**QM** = Gesamtsystem, **QS** = Teil davon (prüfen/dokumentieren). **KVP** = kontinuierlicher Verbesserungsprozess.

**Normen:** ISO 9000 (Begriffe), **ISO 9001 (zertifizierbar, Anforderungen)**. Zertifikat: externes Audit, gültig i. d. R. 3 Jahre, jährliche Überwachungsaudits.

**PDCA:** Plan (Ist/Ziel/Maßnahmen) → Do (umsetzen) → Check (messen) → Act (anpassen, standardisieren) → wieder Plan.

**Testprotokoll Arbeitsplatz:** Datum, Prüfer, Prüfpunkte (Boot, Netzwerk/Domäne, Peripherie, Software), Ergebnis OK/Fehler, Bemerkung, Unterschrift, Freigabe.

> Merke: „Plan ohne Do ist Theorie, Do ohne Check ist Glücksspiel, Check ohne Act ist sinnlos."

---

## Modul 06 – IT-Sicherheit und Datenschutz

**Schutzziele (CIA):** Vertraulichkeit (Verschlüsselung, Rechte), Integrität (Hashwerte, Signaturen), Verfügbarkeit (Backup, Redundanz).

**TOM (Art. 32 DSGVO):** technische (Firewall, Verschlüsselung, Backup) + organisatorische Maßnahmen (Richtlinien, Schulung, Berechtigungskonzept).

**DSB-Pflicht:** § 38 BDSG — i. d. R. ab 20 Personen mit ständiger automatisierter Verarbeitung. IT-Sicherheitsbeauftragter: meist freiwillig.

**Verschlüsselung:** symmetrisch (1 Schlüssel, schnell, AES) / asymmetrisch (Schlüsselpaar, langsam, RSA) / **hybrid = Daten symmetrisch, Schlüsselaustausch asymmetrisch (TLS)**.

**Hash** = Einwegfunktion (Integrität, SHA-256); **Zertifikat** = Identität von CA bestätigt; **digitale Signatur** = Hash mit privatem Schlüssel → Authentizität + Integrität.

**Authentifizierungsfaktoren:** Wissen, Besitz, Biometrie → 2FA = zwei davon kombinieren.
**Passwort (BSI aktuell):** lang statt komplex, kein anlassloser Wechselzwang, gehasht + Salt speichern.

**Betroffenenrechte (DSGVO):** Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch.
**Anonymisierung** = Personenbezug unumkehrbar weg; **Pseudonymisierung** = mit Schlüssel umkehrbar.

**BSI IT-Grundschutz:** Schutzbedarf je Objekt (Anwendung, System, Raum, Verbindung) und Schutzziel bewerten. Kategorien: **normal / hoch / sehr hoch**. Vererbung: **Maximumprinzip** (höchster Bedarf gewinnt), Kumulationseffekt (viele normale → hoch), Verteilungseffekt (Redundanz senkt).

**Zugangskontrolle** = Wer kommt rein (Login, Tür)? **Zugriffskontrolle** = Wer darf welche Daten (Berechtigungen)?

**Backup:**
- **Voll** = alles (Restore: 1 Satz)
- **Differenziell** = alles seit letzter VOLLsicherung, wächst täglich (Restore: Voll + letzte Diff)
- **Inkrementell** = nur seit letzter Sicherung, klein (Restore: Voll + ALLE Inkremente)
- **3-2-1-Regel:** 3 Kopien, 2 Medientypen, 1 extern.

**Härtung:** unnötige Dienste aus, Patches zeitnah, minimale Rechte. **Security by Design/Default.**

---

## Modul 07 – Leistungserbringung und Auftragsabschluss

**Vertragsarten:**
| Vertrag | geschuldet | IT-Beispiel |
|---|---|---|
| **Werkvertrag** | **Erfolg** (Abnahme!) | fertiges Netzwerk |
| **Dienstvertrag** | **Tätigkeit** | Admin-Stunden |
| Kaufvertrag | Ware + Eigentum | 10 Notebooks |
| Mietvertrag | Nutzung | Serverstellplatz |
| Leasing | Nutzung auf Zeit | PCs; Wartung je nach Vertragsart: Operating = Geber, Finanzierung = Nehmer |
| Lizenzvertrag | Nutzungsrecht | Microsoft 365 |
| Servicevertrag/SLA | messbare Servicewerte | 99,9 % Verfügbarkeit, Reaktionszeit |

**Abnahmeprotokoll (Werkvertrag):** Gefahrenübergang, Gewährleistungsbeginn, Vergütung wird fällig, Beweismittel. Bekannte Mängel immer vorbehalten (§ 640 Abs. 3 BGB)!

**Mängelarten:** Schlechtleistung (schlechte Qualität), Falschlieferung (aliud – etwas anderes), Minderlieferung (zu wenig). Rechte: Nacherfüllung, Minderung, Rücktritt, Schadensersatz.

**Unternehmensziele:** ökonomisch, ökologisch, sozial. Beziehungen: komplementär, konkurrierend, neutral.

**Organisation:** Einlinie (1 Chef, klar, langsam), Mehrlinie (mehrere Chefs, Spezialisierung, Konflikte), **Stablinie** (Linie + beratende Stäbe: Stabsstelle berät, hat **keine Weisungsbefugnis**, im Organigramm gestrichelt), Matrix (Funktion × Projekt, flexibel, Konfliktpotenzial).

**Aufbau = wer. Ablauf = wann.** Aufbauorganisation ist statisch (Stellen, Abteilungen, Instanzen; Werkzeug **Organigramm**), Ablauforganisation ist dynamisch (Reihenfolge und Termine; Werkzeuge **Gantt-Diagramm und Netzplan**). Die Aufbauorganisation entsteht aus **Aufgabenanalyse** (Gesamtaufgabe zerlegen) und **Aufgabensynthese** (Teilaufgaben zu Stellen bündeln).
**Dimensionen der Aufgabenanalyse:** Inhalt · Träger · Menge · Zeit · Rang · Sachmittel. *Der Marktpreis ist keine Dimension.*

**Vollmachten:** Handlungsvollmacht (§ 54 HGB) nur **gewöhnliche** Geschäfte; Prokura (§§ 48 ff. HGB) auch **außergewöhnliche**, aber nie Grundlagengeschäfte (Firma veräußern, Bilanz unterzeichnen, Insolvenzantrag) und Grundstücke nur mit Sondervollmacht (§ 49 II). Prokura erteilt **nur der Kaufmann selbst**; sie wirkt **ab Erteilung**, die Eintragung ins Handelsregister ist **deklaratorisch**.

**Anfrage und Angebot:** Die **Anfrage** ist unverbindlich und nennt Grund, Bedarf nach **Menge und Qualität**, Konditionen und Liefertermin. Das **Angebot** ist ein **Antrag** im Sinne des BGB, wenn es an eine bestimmte Person gerichtet, zugegangen und vollständig ist – der Vertrag entsteht erst durch **Antrag und Annahme**.
**Bindefristen:** unter Anwesenden sofort · per Brief etwa eine Woche · bei gesetzter Frist bis zum Fristablauf.
**Freizeichnungsklauseln** machen es unverbindlich: „freibleibend", „Preisänderung vorbehalten", „solange der Vorrat reicht".

**Change Management:** Promotoren einbinden, Skeptiker informieren, Widerständler ernst nehmen. Widerstandsursachen: Angst vor Kompetenzverlust, Wissenslücken, persönliche Historie. Werkzeuge: Blended Learning, Multiplikatoren.

**Nachkalkulation:** Ist ÷ Soll × 100 % — über 100 % = unwirtschaftlicher als geplant. Danach: Soll-Ist-Vergleich, Abweichungsanalyse, Lessons Learned, Nachfolgeaufträge (Cross-Selling, Wartungsvertrag).

---

## Die 10 häufigsten Rechenaufgaben-Typen der AP1

1. Netzplan: FAZ/FEZ/SAZ/SEZ, Puffer, kritischer Weg
2. Nutzwertanalyse mit Gewichtung
3. Übertragungszeit (Datenmenge ÷ Rate, Bit/Byte!)
4. Energiekosten (W → kWh → €)
5. Wirkungsgrad Netzteil
6. Kostenvergleich Kauf/Leasing/Pay-per-Use
7. Vor-/Nachkalkulation und Abweichung
8. Backup-Speicherbedarf (voll/differenziell/inkrementell)
9. Schreibtischtest (Variablen verfolgen)
10. Lizenzkostenvergleich (Einzel/Volumen/Abo)

**Prüfungstipps:** Einheiten immer mitschreiben und umrechnen (Bit vs. Byte!). Rechenweg zeigen — Teilpunkte! Bei „nennen" reichen Stichworte, bei „erläutern/begründen" ganze Sätze. Operatoren im Aufgabentext beachten.
