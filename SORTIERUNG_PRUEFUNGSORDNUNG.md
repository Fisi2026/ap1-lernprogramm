# Sortierung nach Pruefungsordnung – Referenz (Stand 2026-07-23)

> Single Source der Zuordnung: L.THEMA_GEBIET in logik.js (dazu L.GEBIETE, L.gebietFuer,
> L.gebietName, L.statProGebiet). Dieses Dokument ist daraus + aus fragen.js abgeleitet und
> jederzeit reproduzierbar. Jede Frage traegt das Feld gebiet; tools/validate_pool.js bewacht
> f.gebiet == L.gebietFuer(f).

Grundlage: Pruefungskatalog FISI 2024 (2. Auflage). AP1 = 5 Gebiete (Paragraf 9
Abs. 2), AP2 = 3 Pruefungsbereiche (Paragraf 21/22 und 4 Abs. 7). M9 Klausurvorbereitung ist
klassenspezifisch und bleibt separat (nicht Teil der Pruefungsordnung).

## Aufstellung: Fragen je Gebiet

⛔ **DIESE ZAHLEN WERDEN GEMESSEN, NICHT GEPFLEGT.** Bis zum 02.09.2026 standen hier ZWEI von
Hand gefuehrte Tabellen. Beide waren veraltet, und sie widersprachen einander schon untereinander
(A1: 127 gegen 142, tatsaechlich 148 · A4: 22 gegen 44, tatsaechlich 47 · B3: 54, tatsaechlich
103). Der angekuendigte Neu-Messpunkt nach Etappe 2 ist nie gesetzt worden – **eine von Hand
geschriebene Zahl ist eine Behauptung, kein Messwert.** Der Block unten erzeugt
`python3 tools/gebiete_stand.py --setze`; `check.sh` haelt ihn nach.

<!-- GEBIETE-BLOCK: erzeugt von tools/gebiete_stand.py - NICHT von Hand pflegen -->

| Code | Prüfungsteil | Gebiet / Prüfungsbereich | Fragen | Anteil an AP1 |
|---|---|---|---|---|
| A1 | AP1 | Kundenbedarfe ermitteln | 176 | 14.38 % |
| A2 | AP1 | Hard- und Software auswählen & beschaffen | 272 | 22.22 % |
| A3 | AP1 | IT-Arbeitsplatz konfigurieren, testen & absichern | 496 | 40.52 % |
| A4 | AP1 | Kunden und Kundinnen einweisen | 71 | 5.80 % |
| A5 | AP1 | Leistungserbringung kontrollieren & protokollieren | 209 | 17.08 % |
| B1 | AP2 | Konzeption und Administration von IT-Systemen | 10 | — |
| B2 | AP2 | Analyse und Entwicklung von Netzwerken | 150 | — |
| B3 | AP2 | Wirtschafts- und Sozialkunde | 103 | — |
| | | **Nenner AP1 (A1–A5)** | **1224** | 100 % |

**Ohne Gebiet (so gewollt):** 9 — die Fälle FALL-01, FALL-02, FALL-03, FALL-04, FALL-05, FALL-06, FALL-07, FALL-08, FALL-09.

<!-- /GEBIETE-BLOCK -->

## Warum hier KEIN Waechter fuer das groesste Gebiet steht

### Der Befund
`tests/test_didaktik.js` hat mit `SCHWELLE_GEBIET_MIN = 4.8` einen Waechter fuer das **kleinste**
Gebiet – aber **keinen fuer das groesste**. A3 haelt fast doppelt so viel wie das zweitgroesste
Gebiet und ein Vielfaches von A4, und nichts meldet das. Der Waechter draengt beim Schreiben neuer
Fragen sogar aktiv nach A4, waehrend A3 unbeobachtet weiterwaechst.
⛔⛔ **„A4 IST KNAPP" WAR EINE DENKSPERRE UND IST AM 09.09. NACHGERECHNET WIDERLEGT.** Hier stand
bis dahin „der Abstand betraegt rund zwei Zehntel Prozentpunkte" – ein Messwert von damals, der
den A4-Ausbau der Etappen D/F nicht kannte. **Gemessen (`tools/gebiete_stand.py`, Block oben):
der Puffer ist eine Groessenordnung groesser** – bis die Schwelle 4,8 reisst, muessten rund
**350 Nicht-A4-Fragen** dazukommen. ►► **Der Satz haette Fragen ausserhalb A4 verhindert, die
laengst unbedenklich sind.** ⚠️ **Wer das beurteilt, RECHNET NACH – er liest weder den Block noch
diesen Satz als Zustand:** `A4 / AP1-gesamt` gegen 4,8 %, beide Zahlen aus dem erzeugten Block.
**Eine Warnschwelle, die niemand nachrechnet, wird zur Denksperre.**
**Das ist dieselbe Einseitigkeit, die beim Laengenverhaeltnis 65 Fragen gekostet hat.**

### Warum trotzdem keine Obergrenze gesetzt wurde (Entscheid 28.07.2026)
1. **A3 ist inhaltlich das breiteste Gebiet.** „IT-Arbeitsplatz konfigurieren, testen & absichern"
   deckt vier ganze Module ab: M04 (145 Fragen: Programmiersprachen 44, Konsolenbefehle 37,
   UML 31), M06 (111: Schutzziele, Verschluesselung, DSGVO, BSI-Grundschutz), M05 (67: QM, PDCA,
   Testprotokoll) und M03 (37: OSI-Modell, Ergonomie). **Dass es das groesste ist, ist erwartbar,
   nicht auffaellig.**
2. **Die Pruefungsordnung nennt keine Soll-Gewichtung.** Eine Schwelle waere eine erfundene Zahl,
   die spaeter niemand begruenden kann – und die sinnvolles Wachstum im pruefungsrelevantesten
   Gebiet blockiert. ⚠️ **Ein Waechter ohne fachliche Begruendung ist keine Sicherung, sondern
   eine Fessel.**
3. ►►► **DER AUSSCHLAGGEBENDE GRUND VON DAMALS: DIE ZAHLEN AENDERN SICH OHNEHIN.** Der Nenner ist
   seit dem 28.07. von 888 auf den Stand im Block oben gewachsen, und jeder Gebietsanteil hat sich
   mitverschoben. **Eine damals festgeschriebene Schwelle waere auf einem ueberholten Stand
   gemessen gewesen** – genau der Fehler, den `START_PROMPT.md` als „Umgebungs-Annahmen sind
   verderbliche Ware" fuehrt.
   ⚠️ **Das Argument hat sich abgenutzt:** es begruendete das Warten, und gewartet wurde bis der
   Referenzstand selbst falsch war. Der erzeugte Block nimmt ihm die Grundlage – die Zahlen sind
   jetzt jederzeit aktuell, also kann entschieden werden.

### Was stattdessen gilt
* **Der Block oben ist der Stand**, und er misst sich selbst. Kein „nach Etappe X neu messen" mehr.
* **Zu entscheiden bleibt**, ob eine Obergrenze fuer A3 noetig ist – jetzt mit einer Verteilung,
  die nicht mehr altert.
* Bis dahin bleibt der Befund benannt, aber unbewacht. **Das ist eine bewusste Entscheidung, kein
  Uebersehen** – wer ihn erneut findet, findet ihn hier beschrieben.

⛔ **AUCH DIESE NEUN TABELLEN WERDEN GEMESSEN.** Bis zum 02.09.2026 standen sie von Hand hier –
mit Kopfzahlen aus dem Juli (A1 „127 Fragen" statt 148, A4 „22" statt 47) und, nach der Trennung
des Themas „IP-Adressierung & Subnetting", mit einem AP1-Feinthema unter einem AP2-Gebiet.
Erzeugt von `python3 tools/gebiete_stand.py --setze`, nachgehalten von `check.sh` 4e2b3.

<!-- ZUORDNUNG-BLOCK: erzeugt von tools/gebiete_stand.py - NICHT von Hand pflegen -->

## Zuordnung: Feinthema -> Gebiet (mit alter Herkunft Modul)

### A1 – Kundenbedarfe ermitteln (AP1, 176 Fragen)

| Feinthema | alte Herkunft | Fragen |
|---|---|---|
| Machbarkeit & Kalkulation | M01 | 10 |
| Projektmerkmale & Meilensteine | M01 | 9 |
| Risiko & Stakeholder | M01 | 17 |
| SMART-Ziele | M01 | 8 |
| Scrum & Wasserfall | M01 | 7 |
| Teambildung & Reflexion | M01 | 12 |
| Bedarfsanalyse & Marktforschung | M02 | 16 |
| Englische Fachtexte | M02 | 23 |
| Kommunikationsmodelle | M02 | 14 |
| Marktformen & Marktsituation | M02 | 10 |
| Nutzwertanalyse | M02 | 19 |
| Vertriebsformen | M02 | 7 |
| Lastenheft & Pflichtenheft | M04 | 24 |

### A2 – Hard- und Software auswählen & beschaffen (AP1, 272 Fragen)

| Feinthema | alte Herkunft | Fragen |
|---|---|---|
| Bezugskalkulation & Skonto | M02 | 25 |
| Berechnungen: Daten & Übertragung | M03 | 13 |
| Berechnungen: Energie | M03 | 18 |
| Cloud & Virtualisierung | M03 | 13 |
| Dateisysteme & Software | M03 | 14 |
| Datenmengen & Präfixe | M03 | 12 |
| Hardware-Komponenten | M03 | 53 |
| Netzwerk- und Arbeitsplatz-Ausstattung | M03 | 18 |
| Netzwerkkomponenten & Medien | M03 | 43 |
| WLAN & Übertragungsstandards | M03 | 10 |
| Wirtschaftlichkeit & TCO | M03 | 39 |
| Lizenzen & Urheberrecht | M04 | 14 |

### A3 – IT-Arbeitsplatz konfigurieren, testen & absichern (AP1, 496 Fragen)

| Feinthema | alte Herkunft | Fragen |
|---|---|---|
| Ergonomie & Barrierefreiheit | M03 | 12 |
| OSI-Modell & Protokolle | M03 | 36 |
| DHCP & Netzwerkdienste | M04 | 41 |
| GUI-Entwurf & Software-Ergonomie | M04 | 6 |
| IP-Adressierung | M04 | 10 |
| Konsolenbefehle & Fehlersuche | M04 | 45 |
| Praxisszenarien | M04 | 11 |
| Programmiersprachen, Kontrollstrukturen & Systemgrundlagen | M04 | 54 |
| UML & Schreibtischtest | M04 | 37 |
| WLAN & VPN | M04 | 15 |
| Audit & Prüfverfahren | M05 | 9 |
| PDCA & KVP | M05 | 18 |
| QM-Begriffe & Normen | M05 | 13 |
| QM-Prozesse | M05 | 9 |
| Qualitätskosten | M05 | 11 |
| Testprotokoll | M05 | 13 |
| BSI-Grundschutz & Schutzbedarf | M06 | 17 |
| Backup & Verfügbarkeit | M06 | 19 |
| DSGVO & Datenschutz | M06 | 14 |
| Härtung & Zugriffskontrolle | M06 | 25 |
| IT-Sicherheit und Datenschutz-Vorfall | M06 | 11 |
| Passwörter & Authentifizierung | M06 | 12 |
| Phishing & Social Engineering | M06 | 10 |
| Schutzziele (CIA) | M06 | 16 |
| Security by Design | M06 | 7 |
| TOM & Rechtsgrundlagen | M06 | 10 |
| Verschlüsselung & Signaturen | M06 | 15 |

### A4 – Kunden und Kundinnen einweisen (AP1, 71 Fragen)

| Feinthema | alte Herkunft | Fragen |
|---|---|---|
| Präsentation & Quellen | M02 | 10 |
| Abnahme & Übergabe | M07 | 28 |
| Change Management | M07 | 15 |
| Einweisung & Schulung | M07 | 18 |

### A5 – Leistungserbringung kontrollieren & protokollieren (AP1, 209 Fragen)

| Feinthema | alte Herkunft | Fragen |
|---|---|---|
| Gantt & PSP | M01 | 21 |
| KI im Störungsmanagement | M01 | 7 |
| Netzplan & Puffer | M01 | 31 |
| Ticketsystem & Support-Level | M01 | 32 |
| Aufbauorganisation & Vollmachten | M07 | 36 |
| Onsite/Remote & Nachfolgeaufträge | M07 | 11 |
| SLA & Servicevertrag | M07 | 16 |
| Soll-Ist & Nachkalkulation | M07 | 14 |
| Unternehmensziele & Leitbild | M07 | 9 |
| Vertragsarten | M07 | 17 |
| Vertragsstörungen & Mängel | M07 | 15 |

### B1 – Konzeption und Administration von IT-Systemen (AP2, 10 Fragen)

| Feinthema | alte Herkunft | Fragen |
|---|---|---|
| ER-Modell & Datenbanken | M04 | 10 |

### B2 – Analyse und Entwicklung von Netzwerken (AP2, 150 Fragen)

| Feinthema | alte Herkunft | Fragen |
|---|---|---|
| Netzwerktopologien | M03 | 56 |
| Netzwerktopologien | M04 | 2 |
| Subnetting | M04 | 16 |
| IDS/IPS | M06 | 41 |
| RAID-Systeme | M06 | 35 |

### B3 – Wirtschafts- und Sozialkunde (AP2, 103 Fragen)

| Feinthema | alte Herkunft | Fragen |
|---|---|---|
| Arbeitsschutz & Arbeitszeit | M08 | 6 |
| Aufgabenanalyse & -synthese | M08 | 5 |
| Ausbildungsvertrag & BBiG | M08 | 14 |
| Firma & Handelsregister | M08 | 9 |
| Führung & Managementtechniken | M08 | 7 |
| Kaufmannseigenschaft | M08 | 8 |
| Kündigung | M08 | 9 |
| Mitbestimmung: JAV & Betriebsrat | M08 | 9 |
| Rechte & Pflichten | M08 | 7 |
| Rechtsformen | M08 | 12 |
| Tarifrecht | M08 | 10 |
| Vertragsanbahnung: Anfrage & Angebot | M08 | 7 |

<!-- /ZUORDNUNG-BLOCK -->

## Lernfeld-Abdeckung (fachliche Einschaetzung, primaer je Thema)

> Der Pool traegt KEINE Lernfeld-Tags. Diese Tabelle ist eine fachliche Zuordnung (jede Frage
> genau EINEM Lernfeld), kein exaktes Zaehlmerkmal. Detail je Thema im xlsx-Blatt LF-Zuordnung.
> Uebergreifend = Projektmanagement, Englisch, Qualitaetssicherung.

| Lernfeld | Fragen | Abdeckung |
|---|---|---|
| LF1 Das Unternehmen und die eigene Rolle beschreiben | 108 | gut |
| LF2 Arbeitsplaetze nach Kundenwunsch ausstatten | 147 | gut |
| LF3 Clients in Netzwerke einbinden | 85 | gut |
| LF4 Schutzbedarfsanalyse durchfuehren | 103 | gut |
| LF5 Software zur Verwaltung von Daten anpassen | 108 | gut |
| LF6 Serviceanfragen bearbeiten | 102 | gut |
| LF7 Cyber-physische Systeme ergaenzen | 0 | LUECKE |
| LF8 Daten systemuebergreifend bereitstellen | 11 | duenn |
| LF9 Netzwerke und Dienste bereitstellen | 17 | duenn |
| LF10b Serverdienste bereitstellen und Administration automatisieren | 0 | LUECKE |
| LF11b Betrieb und Sicherheit vernetzter Systeme gewaehrleisten | 0 | LUECKE |
| LF12b Kundenspezifische Systemintegration durchfuehren | 0 | LUECKE |
| WiSo Wirtschafts- und Sozialkunde (integrativ) | 54 | gut |
| Uebergreifend PM / Englisch / Qualitaetssicherung | 143 | - |

Kernbefund: LF 1-6 (AP1-Fundament) gut gefuellt; LF 7/10b/11b/12b = 0 (vertiefende Fachrichtungs-
Lernfelder des Abschlussjahres), LF 8/9 duenn. Gleiche Luecke wie bei den AP2-Bereichen.

## Weiche Zuordnungen (vom Nutzer bestaetigt 2026-07-23)

- Englische Fachtexte -> A1 (Englisch ist laut Katalog eigentlich bereichsuebergreifend).
- Aufbauorganisation und Vollmachten -> A5 (eher Unternehmensorganisation).

_Erzeugt 2026-07-23 aus logik.js (L.THEMA_GEBIET) + fragen.js. Bei Pool-Aenderungen neu erzeugen._
