> **Stand 2026-07-27, nachgezogen nach Etappe 5 (Abschnitte 2 und 3 neu erhoben in Etappe 0).** Dieses Dokument enthält nur noch
> die MANUELLEN Analysen. Die frühere Themen-Abdeckungsmatrix (Abschnitt 1) stand auf einem
> Poolstand von 579 Fragen und war damit seit Monaten falsch – der Pool hat inzwischen **1073**
> Fragen. Sie ist deshalb entfernt.
>
> **Aktuelle Abdeckung immer live erzeugen:** `node tools/pool_query.js coverage`
> (optional `> COVERAGE_GEN.md`). Für die Sortierung nach Prüfungsordnung siehe
> docs/befunde/SORTIERUNG_PRUEFUNGSORDNUNG.md (Single Source: `L.THEMA_GEBIET` in logik.js).
>
> Was hier BLEIBT, weil es sich nicht automatisch erzeugen lässt:
> Abschnitt 2 (Abgleich mit dem IHK-Prüfungskatalog AP1, FK01–FK07, mit Seitenverweisen) und
> Abschnitt 3 (Tiefencheck der Kernthemen). Beide sind Handarbeit und bleiben als Referenz.
>
> ⚠️ **WARUM DIESE DATEI EIN WIEDERHOLUNGSTÄTER IST.** Sie enthält Zahlen, die nur bei einer
> Neuerhebung mitwachsen – und genau das ist zweimal unterblieben. Der Prüfbericht vom 26.07. hat
> es an einer Stelle nachgewiesen: Abschnitt 2 führte „Englische Fachtexte: **NEIN**, nur 1 Treffer
> im gesamten Pool", tatsächlich waren es **19**. Bei der Erhebung am 27.07. haben sich vier
> weitere Urteile ins Gegenteil gedreht (Security by Design, Wertschöpfung, GUI-Maskenentwurf,
> KI im Störungsmanagement – alle 2026-07-10 geschlossen, aber oben nie nachgetragen).
> **Regel ab jetzt: Wer den Pool inhaltlich ausbaut, erhebt Abschnitt 2 und 3 im selben Zug neu
> oder trägt es in TASKLIST.md als offenen Punkt ein.** Eine veraltete Abdeckungsaussage ist
> schlimmer als gar keine, weil sie zu Fehlentscheidungen über den nächsten Ausbau führt.

# Themen-Abdeckung AP1-Lernprogramm – manuelle Analysen


## 2. Abgleich mit dem IHK-Prüfungskatalog AP1 (FK01-FK07)

**Neu erhoben am 2026-07-27** (Qualitätsrunde Q1, Etappe 0, Punkt 6) gegen den Poolstand
983 Fragen, **am selben Tag zweimal nachgezogen**: nach Etappe 4 (+44 Einstiegsfragen → 1027) und
nach Etappe 5 (+18 im Gebiet A4) und nach Etappe 6 (+28 auf Stufe 4 → **1073 Fragen**, 969 AP1 · 76 AP2-Zusatz · davon 105 im
Klausur-Sonderpool M09). Die Zahlen unten sind der Stand NACH Etappe 6.
⚠️ **NEU IN ETAPPE 5: Feinthema `M07|Einweisung & Schulung` (14 Fragen)** – damit hat das Gebiet
A4 „Kunden und Kundinnen einweisen" vier statt drei Feinthemen und ist von 2,85 % auf 4,88 % des
AP1-Bestands gewachsen. Es bleibt das kleinste AP1-Gebiet, ist aber kein Ausreißer mehr.
Grundlage: Prüfungskatalog FIS 2024, Fragenkomplexe FK01-FK07.

**Wie gemessen wurde – damit es nachvollziehbar bleibt:**
* **Themenzahlen** stammen aus `node tools/pool_query.js coverage` (Feinthema = `modul` + `thema`).
* **Stichwortzahlen** („N Treffer") sind Fragen, in deren **ganzem Frage-Objekt** der Begriff
  vorkommt – also inklusive `verweis`, `optionen`, `distraktorErklaerungen`, `musterloesung`.
  ⚠️ Das ist die Lehre vom 25.07. („§ 20 Abs. 3"): Ein Scan nur über `frage`/`erklaerungKurz`
  übersieht regelmäßig die Hälfte der Fundstellen.
* ⛔ **M09 ist getrennt ausgewiesen und NICHT in die AP1-Zahlen eingerechnet.** Der Sonderpool wird
  ab 01.08.2026 aufgelöst (Etappe 2 des Q1-Plans); wo er heute etwas trägt, steht es als Zusatz
  dabei, damit nach dem Eingliedern sichtbar ist, was verloren ginge.

### FK01 - Planen und Umsetzen eines Projektauftrags (S. 9)

| Katalogpunkt | Abdeckung | Pool-Themen / Belege |
|---|---|---|
| Projektmerkmale | Ja | M01 Projektmerkmale & Meilensteine (7) |
| Struktur-/Netzplan/Gantt (krit. Weg, Puffer, SMART, Meilensteine) | Ja | M01 Netzplan & Puffer (20), Gantt & PSP (12), SMART-Ziele (7); dazu der interaktive Netzplan-Generator. M09-Zusatz: Netzplantechnik (13), Gantt-Diagramm (7) |
| Wasserfall vs. SCRUM | Ja | M01 Scrum & Wasserfall (7) |
| Teamphasen | Ja | M01 Teambildung & Reflexion (9) |
| Lessons Learned | Ja | in Teambildung & Reflexion enthalten (12 Treffer) |
| Machbarkeit (Budget, Vor-/Nachkalkulation, Stakeholder, Risikoanalyse) | Ja | M01 Machbarkeit & Kalkulation (9), Risiko & Stakeholder (15); Nachkalkulation zusätzlich M07 Soll-Ist & Nachkalkulation (14) |
| Fehler-/Störungsmanagement, Ticketsystem, 1st/2nd/3rd-Level | Ja | M01 Ticketsystem & Support-Level (12) |
| KI-Unterstützung im Störungsmanagement | Ja | M01 KI im Störungsmanagement (7), 11 Treffer. ⚠️ **War „teilweise (ca. 2)" – am 2026-07-10 geschlossen, hier nie nachgetragen** |

### FK02 - Kundenbedarf und Kundenberatung (S. 10)

| Katalogpunkt | Abdeckung | Pool-Themen / Belege |
|---|---|---|
| Marktformen | Ja | M02 Marktformen & Marktsituation (10) |
| Zielgruppen | Ja | in Bedarfsanalyse/Marktformen enthalten (9 Treffer) |
| Bedarfsanalyse / Kundenbefragung | teilweise | M02 Bedarfsanalyse & Marktforschung (9); **Kundenbefragung explizit nur 1 Treffer** |
| 4-Ohren-/Sender-Empfänger-Modell | Ja | M02 Kommunikationsmodelle (14) |
| Englische Fachtexte | Ja | M02 Englische Fachtexte (21: mc 10, mehrfach 7, dropdown 2, zuordnung 2). ⚠️ **Hier stand bis 27.07. „NEIN, nur 1 Treffer" – das war der Befund, der die Neuerhebung ausgelöst hat** |
| Präsentation / Medienkompetenz | teilweise | M02 Präsentation & Quellen (9); **Medienkompetenz 0 Treffer** – der einzige Katalogpunkt ohne jede Fundstelle |
| Nutzwertanalyse | Ja | M02 Nutzwertanalyse (14) |
| Vertriebsformen | Ja | M02 Vertriebsformen (7) |

### FK03 - IT-Arbeitsplatz, Hardware, Wirtschaftlichkeit (S. 11)

| Katalogpunkt | Abdeckung | Pool-Themen / Belege |
|---|---|---|
| Hardware (CPU, Mainboard, Speicher, Netzteil, Grafik, Peripherie, Router/Switch/AP) | Ja | M03 Hardware-Komponenten (26), Netzwerkkomponenten & Medien (25) |
| Software-Kategorien | Ja | M03 Dateisysteme & Software (9) |
| Cloud (SaaS, DaaS), virtuelle Desktops | teilweise | M03 Cloud & Virtualisierung (13); **DaaS 2 Treffer, virtuelle Desktops/VDI 2 Treffer** |
| Client-Server, Domäne, Netzwerkprotokolle, OSI | Ja | M03 OSI-Modell & Protokolle (26); Domäne 11 Treffer |
| BIOS/UEFI, RAM, SSD/HDD, Dateisysteme, LWL, WLAN-Standards | Ja | M03 Hardware-Komponenten (26), Dateisysteme & Software (9), WLAN & Übertragungsstandards (9) |
| Barrierefreiheit | Ja | M03 Ergonomie & Barrierefreiheit (9) |
| Übertragungsraten/-zeiten, Datenmengen | Ja | M03 Berechnungen: Daten & Übertragung (12), Datenmengen & Präfixe (11); plus Generatoren |
| Strom/Leistung/Wirkungsgrad/Energiekosten | Ja | M03 Berechnungen: Energie (16) |
| Kostenarten, Leasing/Kauf/Pay-per-Use, Wertschöpfung | Ja | M03 Wirtschaftlichkeit & TCO (22); Kostenarten 11 Treffer, Leasing/Pay-per-Use 13, Wertschöpfung 5. ⚠️ **War „teilweise, Wertschöpfung 0 Treffer" – am 2026-07-10 geschlossen (M03-741…743).** M09-Zusatz: eigenes Thema Wertschöpfung (8) |

### FK04 - Programmierung, Software, Netzwerkeinrichtung (S. 12-13)

| Katalogpunkt | Abdeckung | Pool-Themen / Belege |
|---|---|---|
| Lasten-/Pflichtenheft | Ja | M04 Lastenheft & Pflichtenheft (10) |
| Installation (Partitionierung, IPv4/v6, Remote) | Ja | M04 Konsolenbefehle & Fehlersuche (35), **IP-Adressierung (8, AP1)**; Partition 7 Treffer, IPv6 8, Remote 17. ⚠️ **Hier stand bis 02.09.2026 „IP-Adressierung & Subnetting (15, AP2-Kennung)" – eine AP1-Katalogzeile, belegt mit AP2-Fragen.** Der Katalog fuehrt „IP(v4/v6)-Konfiguration" und „IP-Adressen" auf S. 12 unter AP1; das Sammelthema ist getrennt (Befund N2) |
| Lizenzen/Urheberrecht (EULA, OEM, GNU) | Ja | M04 Lizenzen & Urheberrecht (10) |
| Kommandozeile/Konsolenbefehle, DHCP, WLAN, VPN | Ja | M04 Konsolenbefehle & Fehlersuche (35, davon 20 im Format `konsole`), DHCP & Netzwerkdienste (11), WLAN & VPN (6) |
| Programmierung (Compiler/Interpreter, Datentypen, Kontrollstrukturen, OO-Basis, Debugging) | teilweise | M04 Programmiersprachen, Kontrollstrukturen & Systemgrundlagen (42); **Datentypen explizit weiterhin nur 1 Treffer** |
| Pseudocode | Ja | 21 Treffer (in Programmier- und UML-Themen) |
| UML (Use Case, Klassen, Aktivität) | Ja | M04 UML & Schreibtischtest (30) |
| GUI-Maskenentwurf / Software-Ergonomie | Ja | M04 GUI-Entwurf & Software-Ergonomie (5), 8 Treffer. ⚠️ **War „teilweise (ca. 2)" – am 2026-07-10 geschlossen (M04-731…735)** |
| Fehlersuche im Code | Ja | Format `fehlersuche` in M04: 14 Fragen über fünf Themen |
| Schreibtischtest | Ja | M04 UML & Schreibtischtest (30, davon 11 im Format `trace`) |
| Einfache ER-Modelle | Ja | M04 ER-Modell & Datenbanken (10, als AP2 gekennzeichnet – laut Katalog AP2-Stoff, technisch im AP1-Modul M04) |
| SQL | korrekt ausgeklammert | nicht in AP1; 2 beiläufige Treffer |

### FK05 - Qualitätssicherung (S. 14)

| Katalogpunkt | Abdeckung | Pool-Themen / Belege |
|---|---|---|
| QM-Systeme/Normen/Zertifizierung | Ja | M05 QM-Begriffe & Normen (10), Audit & Prüfverfahren (7) |
| Qualitätsplanung/-lenkung | Ja | M05 QM-Prozesse (9), Qualitätskosten (10) |
| PDCA | Ja | M05 PDCA & KVP (18) |
| Testprotokoll | Ja | M05 Testprotokoll (13) |

### FK06 - IT-Sicherheit und Datenschutz (S. 15)

| Katalogpunkt | Abdeckung | Pool-Themen / Belege |
|---|---|---|
| Schutzziele | Ja | M06 Schutzziele (CIA) (16) |
| TOM | Ja | M06 TOM & Rechtsgrundlagen (6) |
| Sicherheits-/Datenschutzbeauftragter | teilweise | Datenschutzbeauftragter 7 Treffer, **IT-Sicherheitsbeauftragter 1 Treffer** |
| Passwort-Policy, 2FA | Ja | M06 Passwörter & Authentifizierung (12) |
| Firewall/Virenschutz | teilweise | Firewall 23 Treffer, **Virenschutz 3 Treffer** |
| Verschlüsselung sym/asym/hybrid, Hash/Zertifikate/Signaturen | Ja | M06 Verschlüsselung & Signaturen (13). ⚠️ M06-304 am 27.07. von RSA-Schlüsseltransport auf **ECDHE** umgestellt (TLS 1.3) |
| BSI-Grundschutz, Schutzbedarf | Ja | M06 BSI-Grundschutz & Schutzbedarf (7) |
| DSGVO/BDSG, Betroffenenrechte, Anonymisierung/Pseudonymisierung | teilweise | M06 DSGVO & Datenschutz (11); Betroffenenrechte 6 Treffer, Pseudonymisierung 4, **Anonymisierung 2, BDSG 1** |
| Risiko-Matrix | Ja | M01 Risiko & Stakeholder (13, davon 8 im Format `matrix`); Begriff „Risikomatrix" 4 Treffer |
| ISMS | teilweise | 3 Treffer |
| Security by Design | Ja | M06 Security by Design (6). ⚠️ **War „NEIN, 0 Treffer" – am 2026-07-10 geschlossen (M06-731…734)** |
| Härtung | Ja | M06 Härtung & Zugriffskontrolle (12) |
| Backup, NAS | Ja | M06 Backup & Verfügbarkeit (7); **NAS 3 Treffer** |
| Zugriffskontrolle | Ja | M06 Härtung & Zugriffskontrolle (12) |
| Sicherheitsvorfall / Phishing (im Katalog unter Sensibilisierung) | Ja | M06 Phishing & Social Engineering (8), IT-Sicherheit und Datenschutz-Vorfall (9) |

### FK07 - Leistungserbringung und Auftragsabschluss (S. 16)

| Katalogpunkt | Abdeckung | Pool-Themen / Belege |
|---|---|---|
| Vertragsarten inkl. SLA | Ja | M07 Vertragsarten (15), SLA & Servicevertrag (16) |
| Vertragsstörungen | Ja | M07 Vertragsstörungen & Mängel (14) |
| Leitbild (3 Säulen) | Ja | M07 Unternehmensziele & Leitbild (9) |
| Remote vs. vor Ort | Ja | M07 Onsite/Remote & Nachfolgeaufträge (9) |
| Aufbauorganisation/Organigramm/Vollmachten | Ja | M07 Aufbauorganisation & Vollmachten (19). M09-Zusatz: Handlungsvollmachten & Prokura (7), Leitungssysteme (7) |
| Veränderungsprozesse (Promoter/Bremser) | teilweise | M07 Change Management (6); **Promoter/Bremser 2 Treffer** |
| Abnahmeprotokoll, Mängelarten | Ja | M07 Abnahme & Übergabe (9), Vertragsstörungen & Mängel (14) |
| Soll-Ist/Abweichungsanalyse/Nachkalkulation | Ja | M07 Soll-Ist & Nachkalkulation (14) |

### Lücken (neu priorisiert, Stand 2026-07-27, nach Etappe 4)

> ✅ **Etappe 4 (27.07.) hat 44 Einstiegsfragen ergänzt** – je zwei für 22 Feinthemen, die bis dahin
> keine einzige Frage auf Stufe 1 hatten. Poolweit stieg Stufe 1 von **132 auf 176** Fragen; ohne
> Stufe-1-Einstieg sind jetzt nur noch **3 von 74** Feinthemen (bewusst ausgenommen, weil AP2-Stoff:
> Subnetting, Kündigung, Rechte & Pflichten, Arbeitsschutz & Arbeitszeit). ⚠️ **02.09.2026: „IP-Adressierung
> & Subnetting" stand hier als AP2-Ausnahme – nach der Trennung ist „IP-Adressierung" AP1 und hat mit
> M04-904/905 zwei Einstiegsfragen bekommen.**
> Die Themenzahlen in den Tabellen oben sind entsprechend nachgezogen.

⚠️ **Das sind INHALTLICHE Katalog-Lücken.** Die didaktischen Befunde des Prüfberichts (A4 zu klein,
fehlende Stufe-1-Einstiege, fehlende Stufe 4) stehen NICHT hier, sondern als Etappen 4–6 im
Q1-Gesamtplan in docs/archiv/PLAENE.md. Beides nicht vermischen.

| Prio | Katalogpunkt (FK) | Status | Empfehlung |
|---|---|---|---|
| 1 | Medienkompetenz (FK02) | **NEIN (0 Treffer)** | 3-4 Fragen: mc + zuordnung (Quellenbewertung, Umgang mit KI-Ausgaben, Urheberrecht an Bildern) |
| 2 | Datentypen explizit (FK04) | teilweise (1) | 3 Fragen: zuordnung (Wert → Datentyp) + fehlersuche (Typfehler im Code) |
| 3 | Kundenbefragung explizit (FK02) | teilweise (1) | 2 Fragen in Bedarfsanalyse einhängen (Fragebogen offen/geschlossen, Rücklauf) |
| 4 | BDSG (1), IT-Sicherheitsbeauftragter (1) (FK06) | teilweise | je 2 Fragen; BDSG in Abgrenzung zur DSGVO |
| 5 | Virtuelle Desktops / DaaS (FK03) | teilweise (je 2) | 2-3 Fragen: mc + erklaeren (VDI vs. lokaler Client) |
| 6 | Promoter/Bremser (FK07) | teilweise (2) | 2-3 Fragen: zuordnung (Rollen im Veränderungsprozess) |
| 7 | Anonymisierung (2), ISMS (3), Virenschutz (3), NAS (3) (FK03/FK06) | teilweise | je 1-2 Fragen ergänzen, Format mc/erklaeren |

**Was gegenüber der alten Liste WEGGEFALLEN ist** (alle am 2026-07-10 geschlossen, in der alten
Fassung aber nie abgehakt): Englische Fachtexte · Security by Design · Wertschöpfung ·
GUI-Maskenentwurf · KI im Störungsmanagement · Betroffenenrechte (jetzt 6 Treffer) ·
Kostenarten (11 Treffer).

**Pool-interne Lücken:** Die 2026-07-10 als DÜNN gemeldeten Themen sind erledigt – M03
„Netzwerk- und Arbeitsplatz-Ausstattung" hat heute 5 Fragen, M06 „IT-Sicherheit und
Datenschutz-Vorfall" 7. DÜNN sind nur noch **M09 Aufgabenanalyse & -synthese (4)** und
**M09 Managementtechniken (4)** – beide im Sonderpool, der in Etappe 2 aufgelöst wird.
„Einseitig" ist keines der 73 AP1-Feinthemen mehr: kein Thema hat nur eine Schwierigkeitsstufe
(nachgemessen 26.07.), und M08 „Arbeitsschutz & Arbeitszeit" hat inzwischen zwei Formate.

## 3. Wichtige Kernthemen - Tiefencheck

**Neu erhoben am 2026-07-27.** Kriterium unverändert: mindestens 5 Fragen UND mindestens
2 Schwierigkeitsstufen UND mindestens 2 Formate.

| Kernthema | Fragen | Stufen | Formate | Urteil |
|---|---:|---:|---:|---|
| Netzplan (M01 Netzplan & Puffer) | 20 | 4 | 9 | BESTANDEN - plus interaktiver Generator; vorbildlich breit |
| Subnetting (M04, AP2-Zusatz) | 15 | 3 | 6 | BESTANDEN - plus Subnetting-Generator; keine Stufe 1 |
| Schutzziele/TOM (M06, 2 Themen) | 22 | 4 | 8 | BESTANDEN - Schutzziele stark, TOM-Anteil (6) weiter schmaler |
| DSGVO (M06 DSGVO & Datenschutz) | 11 | 4 | 7 | BESTANDEN - Restlücke bei BDSG/Anonymisierung (s. Lücken Nr. 4 und 7) |
| Lasten-/Pflichtenheft (M04) | 10 | 4 | 4 | BESTANDEN |
| Nutzwertanalyse (M02) | 14 | 4 | 7 | BESTANDEN - inkl. rechenassistent |
| Übertragungsrechnung (M03) | 12 | 4 | 3 | BESTANDEN - weiterhin dropdown-lastig (5 von 12), Generator gleicht aus |
| Datenmengen/Präfixe (M03) | 11 | 3 | 5 | BESTANDEN - keine Stufe 4 |
| Vertragsarten (M07) | 15 | 4 | 6 | BESTANDEN - SLA separat mit 16 weiteren Fragen |
| OSI (M03 OSI-Modell & Protokolle) | 26 | 4 | 12 | BESTANDEN - Stufe-1-Einstieg mit Etappe 4 ergänzt (M03-027/028) |

**Ergebnis:** Alle 10 Kernthemen bestehen. Gegenüber der Erhebung vom 25.07. ist jedes Thema
gewachsen (Netzplan 12→20, OSI 12→26, Vertragsarten 8→15, Subnetting 12→15). Schwächster Kandidat
bleibt die Übertragungsrechnung wegen der Formatkonzentration auf `dropdown`. **OSI deckt seit
Etappe 4 alle vier Stufen ab** – die letzte Lücke unter den Kernthemen ist damit geschlossen.


---

## Update 2026-07-10 – Lückenschluss (pool_m_luecken.json, +24 Fragen; Pool jetzt 603)

Alle in der Lückenliste priorisierten Punkte wurden geschlossen:

| Lücke (Katalog) | Status | Neue Fragen |
|---|---|---|
| Englische Fachtexte (FK02) | geschlossen | M02-731…735 (5: mc/dropdown/mehrfach, neues Thema "Englische Fachtexte") |
| Security by Design/Default (FK06) | geschlossen | M06-731…734 (4, neues Thema "Security by Design") |
| Wertschöpfung (FK03) | geschlossen | M03-741…743 (3, Thema "Wirtschaftlichkeit & TCO") |
| GUI-Maskenentwurf/Ergonomie (FK04) | geschlossen | M04-731…735 (5, neues Thema "GUI-Entwurf & Software-Ergonomie") |
| KI im Störungsmanagement (FK01) | geschlossen | M01-731…733 (3, neues Thema "KI im Störungsmanagement") |
| DÜNN: M03 Netzwerk-/Arbeitsplatz-Ausstattung | aufgefüllt (+2) | M03-744, M03-745 |
| DÜNN: M06 IT-Sicherheit und Datenschutz-Vorfall | aufgefüllt (+2) | M06-735, M06-736 |

Damit sind keine DÜNN-Themen (<2 Fragen) mehr offen; die Matrix-Tabellen oben zeigen den Stand vor diesem Update.
Zusätzlich seit dem Basis-Stand: +32 Format-Fragen (hotspot/matrix/beschriftung/reihenfolge/mehrfach, IDs M0X-70x),
+9 Datenmengen/Präfix-Fragen (M03-72x), 28 Zahlen-Varianten auf 14 rechenassistent-Fragen (+4 auf M03-726/727).

⚠️ **NACHTRAG 2026-07-27:** Genau diese sieben geschlossenen Lücken standen in Abschnitt 2 noch
17 Tage später als „NEIN" oder „teilweise". Der Eintrag hier unten wurde geschrieben, die Tabelle
oben nicht nachgezogen. Deshalb die Regel im Kopf dieser Datei.
