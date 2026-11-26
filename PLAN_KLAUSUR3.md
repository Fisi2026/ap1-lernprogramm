# PLAN_KLAUSUR3.md – Klausurvorbereitung „nächste Klausur“ (K3)

Stand 23.11.2026 · Konto web.de · Status: L1–L6 DURCH, v2.11.0 LIVE (BUILD_LOG 235–248; L5b Meldungs-Prüfung P1–P7 im K3-Set: 240–246). Klausur **Fr. 27.11.2026**.
Eingrenzung der Themen folgt am **Di. 24.11.** (Aussage des Nutzers).
Quellen PRIVAT in `../Buch/klausur_k3/` (Fotos + Abschrift); hier stehen Themen und Entscheide. Aufgaben der K3-Vorlage dürfen wortgleich in die App (K3-E1).

## 1. Themen – MASSGEBLICH ist diese aktuelle Liste (Nutzer 23.11.)
Die Themen-Tabelle im Kopf des Probeklausur-Entwurfs ist NICHT entscheidend. Aus dem Entwurf zählen nur Aufgaben,
die zu einem der 7 Themen hier gehören (und nicht gestrichen sind).
| Nr. | Thema | LF | Punkte |
|---|---|---|---|
| 1 | DHCP – Adressvergabe und Betrieb | LF3 | 21 |
| 2 | Netzwerkredundanz (SPOF, redundante Komponenten, Stromversorgung, STP) | LF3 | 6 |
| 3 | Switching, Routing und VLAN (L2/L3, Access/Trunk, Paketweg, Fehlersuche) | LF3 | 13 |
| 4 | RAID und Datensicherheit (Kapazität, RAID 5/10, RAID 0+1 vs. 10; Backuparten, RPO/RTO, 3-2-1, GVS) | LF3 | 8 |
| 5 | IT-Sicherheit (Firewall, VLAN, VPN, IDS) | LF3/LF4 | 8 |
| 6 | Hardwareplanung und Leistungsbewertung (Systemvergleich mit Budget, SATA vs. NVMe, Engpässe, Netzteil) | LF2 | 12 |
| 7 | Hardwarefehler im Support | LF2/LF6 | 10 |

- Nicht mehr in der Endliste (Entwurf gestrichen bzw. herausgefallen): Subnetting/VLSM, Cyber-physische Systeme,
  Projektmanagement/Wasserfall, Netzwerkfehleranalyse, Serviceanfragen. USV-Dimensionierung stand nur im Entwurf (1A).
- Klausurform: offene Aufgaben mit Punkten („jede geforderte Aussage 1 Punkt“, 1 P ≈ 1 Min), Szenario je Aufgabe,
  Begründungen und Fachbegriffe werden verlangt. Entwurfsaufgaben können genau so vorkommen.

## 2. Wiederverwendung aus K2 (PLAN_KLAUSUR2.md)
Set-Datei wie `pool/sets/klausur_k2.json` (Pool-IDs als Verweis + neue Fragen), Üben über dieselbe Komponente,
Generator `genRaid`. K2 deckte schon Switch/Routing, RAID, Netzwerksicherheit, IDS, Hardware-Auswahl ab.

## 3. Offene Entscheide (Nutzer)

- ~~K3-E2 Umfang~~ ENTSCHIEDEN (Nutzer 23.11.): nur die 7 Themen der aktuellen Liste; Entwurfsinhalte außerhalb
  (USV-Dimensionierung, Wasserfall, Lasten-/Pflichtenheft, Subnetting) zählen nicht.
- ~~K3-E1 Wortlaut~~ ENTSCHIEDEN (Nutzer 23.11.): Die Entwurfsaufgaben der K3-Vorlage dürfen übernommen werden →
  nicht gestrichene Aufgaben zu den 7 Themen dürfen wortgleich in die App (Quelle `../Buch/klausur_k3/`).
  Ergänzend eigene Varianten (andere Zahlen/Szenarien) für Übung über die Vorlage hinaus.
- ~~K3-E3 Fragetypen~~ ENTSCHIEDEN (Nutzer 23.11.): **Mix wie AP1/K2** (überwiegend gebundene Typen).
- ~~K3-E4 Menge~~ ENTSCHIEDEN (Nutzer 23.11.): **nach Klausurpunkten gewichtet** (DHCP 21 P. am meisten, Redundanz 6 P. am wenigsten), etwa 120–150.
- K3-E5 Start: **jetzt** mit den 7 Themen bauen; was am 24.11. herausfällt, kommt aus dem Set (Fragen bleiben im Pool).
- K3-E6 Fotos: Aufgabe 9 (Hardwarefehler), Rest von 7 und der Erwartungshorizont kommen NICHT → Pool und eigene Fragen.
- K3-E7 USV: **mit Dimensionierungsrechnung** (1A.2 Konzept + 1A.3 Watt + Reserve), bei Thema 2. Ersetzt die USV-Zeile in K3-E2.
- K3-E8 Inhalte je Thema:
  - DHCP: DORA + Lease (T1/T2) · Scope, Ausschlüsse, Reservierung, Optionen, APIPA · Relay/ip helper, VLANs · Failover/Split-Scope, Rogue-DHCP, Snooping, Fehlersuche.
  - Redundanz: SPOF + Konzept · STP/RSTP · Link-Bündelung (LACP, Stacking) · Router-Redundanz (VRRP/HSRP) · USV (K3-E7).
  - RAID: **0, 1, 5, 6, 10, evtl. 0+1** (0+1 vs. 10) · Backuparten, RPO/RTO, 3-2-1, GVS.
  - IT-Sicherheit: Firewall, VLAN, VPN, IDS/IPS · Verschlüsselung symmetrisch/asymmetrisch/hybrid · Zugriffsrechte nur im Überblick · OSI-Schicht je Maßnahme.
  - Hardware (6/7): Systemvergleich + Budget · SATA vs. NVMe (AHCI/NVMe, Einsatzfälle), Engpässe, Netzteil · Fehlerbilder im Support · Support-Ablauf.
- K3-E9 Generatoren: `genRaid` um RAID 6 und 0+1 erweitern (Gleichheitstest gegen `referenz/logik.js` beachten) · neu USV-Dimensionierung (Thema 2) · neu DHCP-Bereich (Thema 1).
- K3-E10 App: **K3 ersetzt K2** im Schirm Klausurvorbereitung (`klausur_k2.json` bleibt im Repo).
- K3-E11 Neue Fragen in den Pool wie K2 (AP1 bzw. `pruefungsteil: "AP2"`), im Set verwiesen.
- K3-E12 Lehrtext: neue Abschnitte DHCP · Redundanz + USV · Backup + RAID 6/0+1.
- K3-E13 Gegenlesen wie K2-E13 (Chat + 1 Sonnet-Gegenprüf-Agent, jeder Fund nachgemessen).
- K3-E14 Version: Zwischen-Pushes ohne Bump, am Ende **2.11.0** mit Sichtprüfung.
- K3-E15 Budget: Stopp bei **7T 95 %**, dann nur noch sauber abschließen.
- K3-E16 Arbeitsweise: **Cloud-Arbeiter parallel** (eigene Zweige, nie main); **Leitung = PC-Chat** (Set, Schirm, Generatoren; übernimmt Zweige per `cherry-pick -n`, `check.sh`, Push).
- K3-E17 Eingrenzung 24.11.: Nutzer meldet, Leitung zieht ohne Rückfrage nach.
- K3-E18 Entwurfsaufgaben **doppelt**: wortgleich als Erklären-Aufgabe mit Musterlösung (Selbstbewertung je Punkt) UND gebundene Varianten zum selben Inhalt.
- K3-E19 Live: **jedes fertige Thema sofort** geprüft pushen (ohne Bump); 2.11.0 am Ende.
- K3-E20 Phase B des Umzugs: abends, wenn der Nutzer Zeit hat (unabhängig von K3).
- K3-E21 Arbeiter: **3–4 Sonnet-Cloud-Sitzungen, gruppiert** (z. B. DHCP · Redundanz + RAID/Backup · Sicherheit + Switching · Hardware 6/7).
- K3-E22 Üben wie K2 (K2-E11/E17/E18): Themenfilter, Generatoren 1 von 5, Stufen 1–4 gemischt, normaler Lernstand.
- K3-E23 Keine Probeklausur/Simulation.
- K3-E24 Vorrang bei Zeitnot: Set + Fragen nach Punkten (DHCP zuerst) → Generatoren → Lehrtext.
- K3-E25 Wortlaut der K3-Vorlage darf ins Repo und in die App; Arbeiter lesen `Fisi2026/ap1-buch` (privat):
  `klausur_k3/` (Abschrift) + Fotos (Commit 762b216) und das aufbereitete Lehrbuch `_aufbereitung/` (Westermann-Volltext, Kapitel).
- K3-E26 Inhalte, Runde 3 (Nutzer 23.11.), ergänzt K3-E8:
  - DHCP zusätzlich: UDP 67/68 + Broadcast (warum Relay) · konkrete Konfiguration (Windows-Konsole/Router-CLI, `ipconfig /all`) · DHCPv6/SLAAC im Überblick · statisch vs. dynamisch.
  - Switching zusätzlich: 802.1Q-Tag (VLAN-ID, tagged/untagged, natives VLAN) · Inter-VLAN-Routing (SVI vs. Router-on-a-Stick) · Paketweg L2/L3 (ARP, MAC-Tabelle, was sich ändert) · Fehlersuche VLAN.
  - RAID: **0+1 fest drin** · Hot-Spare + Rebuild · Hard- vs. Software-RAID · „RAID ist kein Backup“.
  - Backup zusätzlich: Medien + Orte (Band/NAS/Cloud, Offsite/Offline, Ransomware) · Snapshot vs. Backup · Restore-Test.
  - Hardwareplanung zusätzlich: Netzteil berechnen (Summe, Reserve, 80 PLUS) · Komponentenwissen (Kerne/Threads, DDR4/5, VRAM, PCIe, M.2). Keine Nutzwertanalyse.
  - Hardwarefehler: Start/POST · RAM + Speicher (Memtest, SMART) · Hitze + Mechanik · Treiber + Bluescreen.
  - Support: systematisches Vorgehen · 1st/2nd/3rd Level + Eskalation, SLA · Incident vs. Problem · ESD + Sicherheit, Garantie/Gewährleistung.
  - Sicherheit: Firewall-Arten (Paketfilter, Stateful, Proxy, NGFW, DMZ) · Regeltabelle lesen · Krypto: Prinzip + Beispiele (AES/RSA, Hybrid/TLS), Signatur + Zertifikat, unsicher → sicher (Telnet/SSH, HTTP/HTTPS, FTP/SFTP).
    VPN und IDS NUR Funktion und Einsatzzweck (VPN-Arten und IDS/IPS-Tiefe hat der Nutzer nicht gewählt).
- K3-E27 Offene Aufgaben: nach der Antwort zeigt die App die **erwarteten Aussagen als Liste**, dann entscheidet der
  Lerner „nochmal üben“ / „sitzt“ → Wiederholung. Umsetzung: vorhandener Typ `erklaeren` (Freitext.tsx hat schon
  Musterlösung + Selbsteinschätzung, zählt für Statistik/Wiederholung); Musterlösung als Aussagenliste. Neuer Typ nur, wenn das nicht reicht.
- K3-E28 **Szenario-Ketten** (Typ `szenario2`, wie `pool/pool_m_szenario2.json`) je Klausuraufgabe + Einzelfragen.
- K3-E29 **Netzpläne/Skizzen wo nötig** (Redundanz Core/Access, VLAN-Plan, DHCP-Relay) – vorhandene Bildmechanik der Fragen nutzen.
- K3-E30 Buchstelle nur bei Zweifel (im `verweis`/Kommentar), Gegenleser prüft dagegen.
- K3-E31 **Auto-Modus** für Leitung und Arbeiter (keine Rückfragen); Grenzen: nie `--force`, Arbeiter nie main, Version nur am Ende.
- K3-E32 5h-Fenster: ab **5h 85 %** sauber abschließen, nach dem Reset automatisch weiter (geplante Aufgabe wie K2-E24).
- K3-E33 Meldung an den Nutzer **nur am Ende** (Push-Nachricht, wenn K3 komplett und 2.11.0 live ist).
- K3-E34 DHCP-Konfiguration **nur Client-Seite** (`ipconfig /all`, `/release`, `/renew` lesen und deuten) – ersetzt „konkrete Konfiguration“ in K3-E26.
- K3-E35 DHCP-Ausfallsicherheit: Split-Scope 80/20 · Failover-Modi (Lastenausgleich vs. Hot-Standby) · Wirkung der Lease-Zeit bei Serverausfall (T1/T2, APIPA).
- K3-E36 STP **nur Prinzip** (Schleife, Broadcast-Sturm, MAC-Flattern, STP blockiert Ports); keine Root-Bridge-Wahl, keine Port-Rollen.
- K3-E37 USV zusätzlich: VA vs. Watt (Leistungsfaktor) · USV-Arten (VFD/VI/VFI) · Überbrückungszeit (Akku, Herunterfahren per Software/Netzwerkkarte).
- K3-E38 Generatoren genauer (ergänzt K3-E9): RAID = Kapazität + Ausfalltoleranz + Mindestanzahl Platten (0/1/5/6/10/0+1) ·
  USV = Watt-Summe + Reserve + Umrechnung in VA · DHCP-Bereich **nur /24** (Ausschlüsse, Reservierungen) · **neu Netzteil-Generator** (Thema 6: Komponenten + Reserve → Netzteilgröße).
- K3-E39 Katalogfremdes (DHCPv6, RAID 6/0+1, USV-Arten, ITIL …) als `pruefungsteil: "AP2"` wie K2.
- K3-E40 Schirm zeigt zusätzlich **Klausurpunkte je Thema** und **Fortschritt je Thema**; Themennamen **kurz**.
- K3-E41 Nach der Klausur (ab 28.11.) wird der Schirm Klausurvorbereitung **ausgeblendet** (am Set-Datum festmachen); Fragen bleiben im Pool.
- K3-E42 Musterlösungen der wortgleichen Aufgaben: Gegenlesen reicht, keine Freigabe durch den Nutzer.
- K3-E43 Bei **Blockade** holt die Leitung den Nutzer sofort per Push-Nachricht (Ausnahme zu K3-E33).
- K3-E44 Die Eingrenzung am 24.11. kommt **in den Leitungs-Chat** (Text oder Fotos).
- K3-E45 Keine Grenze je Arbeiter; nur 7T 95 % gesamt, die Leitung stoppt Arbeiter bei Bedarf.
- K3-E46 Gerät: Lernen am **PC** → Sichtprüfung in PC-Breite reicht.
- K3-E47 Offene Aufgaben: **Eintippen ist Pflicht**, erst dann erscheint die Aussagenliste.
- K3-E48 Musterlösung je Punkt: **Aussage + Begründung** mit Fachbegriff (Klausurstil).
- K3-E49 Fachbegriffe: übliche **englische** Begriffe (Lease, Relay, Spanning Tree, Hot-Spare, Incident) reichen, keine Zwangsübersetzung.
- K3-E50 **Eine Musterfirma** für alle K3-Ketten (erfundenes mittelständisches Unternehmen, festes Netz: Core/Access, VLAN 10/20/30, DHCP-Server, NAS, USV, Firewall). Die Leitung legt sie in L1 fest (Steckbrief in `pool/sets/klausur_k3_firma.md` oder im Arbeitsauftrag), die Arbeiter halten sich daran.
- K3-E51 **1–2 Varianten** je wortgleicher Aufgabe.
- K3-E52 OSI: Sicherheitsmaßnahmen **und** Geräte (Hub/Switch/Router/L3-Switch) **und** Protokolle (DHCP, ARP, STP) je Schicht.
- K3-E53 Keine Karteikarten für K3.
- K3-E54 Ziehung im Schirm: **gewichtet nach Klausurpunkten** (Vorgabe; Themenfilter bleibt). Ersetzt „alle gemischt“ aus K3-E22.
- K3-E55 „Nochmal üben“ → normale Wiederholungslogik.
- K3-E56 Neue Generatoren **überall** (auch normales Üben/Rechnen, als AP2-Zusatz wie `raid`).
- K3-E57 Lehrtext **kompakt** (1–2 Bildschirmseiten je Abschnitt, Tabellen, Merksätze).
- K3-E58 **Keine feste Frist** für Arbeiter; live geht Thema für Thema, sobald fertig.
- K3-E59 Leitung macht **nur K3**.
- K3-E60 Leitung darf **rund um die Uhr** arbeiten und pushen.
- K3-E61 Sichtprüfung vor 2.11.0 macht die **Leitung allein** (eingebauter Browser) und meldet das Ergebnis.
- K3-E62 (24.11., Nutzer) Eingrenzung = **genau die 7 festgelegten Themen** → L5 ohne Änderung durch.
- K3-E63 (24.11.) Lerner-Meldungen 6–20 ausgewertet (BUILD_LOG 239): **jede Meldungsklasse wird als Prüfung über ALLE Fragen
  geplant, jetzt aber nur auf das K3-Set angewendet**; Start nach der Fragenerstellung (= jetzt, K3-E62). Vor jeder Änderung fragen.
- K3-E64 Zuordnung bekommt ein **Feld für Zusatzantworten** (Schema + Anzeige + Tests), dann 1–2 plausible falsche Antworten je K3-Zuordnung.
- K3-E65 In den K3-Plan: **Lückentext rot markieren**, **Rechner bei Rechenfragen** anderer Typen, **Zuordnung je Zeile mischen**.
  Ziehen bei Reihenfolge und Vorlesen: **nach der Klausur**.
- K3-E66 Kandidatenfilter bauen: **A Echo**, **B Klammer-Verrat**, **D themenfremde Falschantwort** (C Absolutwörter verworfen: 60/164 Rauschen).
- K3-E67 „Widerspricht der Angabe / offensichtlich unsinnig“: **ein Agent liest**, die Leitung prüft jeden Fund selbst nach.
- K3-E68 (24.11., Prüfung gegen die Entscheide) Menge: das Set bleibt bei **268** Fragen (ersetzt „etwa 120–150“ aus K3-E4); gewichtet wird über die Ziehung (K3-E54).
- K3-E69 Auslegung K3-E47: **„Aufgeben“ bleibt** bei offenen Aufgaben – ein bewusstes „weiß ich nicht“, als falsch verbucht; „Antwort prüfen“ erst nach Eintippen.
- K3-E70 Die sechs gemeldeten Fragen außerhalb des K3-Sets (M03-461, M03-909, M05-006, M05-401, M05-952, M07-110) werden **sofort** behoben, nicht erst mit der Pool-Prüfung.

## 5. Bauplan (Leitung = lokaler Chat am PC, Opus, Auto)

Zielmenge nach Punkten (≈ 1,8 Fragen je Klausurpunkt, K3-E4) – Pool-Verweise + neue Fragen:
| Thema | P. | Ziel | Pool-Treffer grob (Regex, 23.11.) | neu nötig vor allem |
|---|---|---|---|---|
| 1 DHCP | 21 | ~38 | 39 (viel MC) | Relay/Ports, Snooping/Rogue, Failover, DHCPv6/SLAAC, Konfiguration, Entwurf-Szenario, Generator |
| 2 Redundanz | 6 | ~12 | 24 | LACP/Stacking, VRRP/HSRP, USV-Konzept + Rechnung (1A.2/1A.3), Szenario 1A/1B |
| 3 Switching/VLAN | 13 | ~24 | 93 | Aufgabe 3 wortgleich (3.1–3.4), 802.1Q, SVI vs. Router-on-a-Stick |
| 4 RAID/Backup | 8 | ~15 | 62 | RAID 6, 0+1 vs. 10, Hot-Spare, 1A.4/1A.5 (RPO/RTO, Backuparten, 3-2-1, GVS), Snapshot, Restore-Test |
| 5 IT-Sicherheit | 8 | ~15 | 126 | 7.1 wortgleich, Krypto sym/asym/hybrid, Firewall-Arten, Regeltabelle, OSI-Schicht je Maßnahme |
| 6 HW-Planung | 12 | ~22 | 31 | Aufgabe 4 wortgleich (4.1–4.4), SATA/NVMe-Protokoll, Netzteil rechnen, Komponenten |
| 7 HW-Fehler/Support | 10 | ~18 | 25 | Fehlerbilder (POST, RAM, SMART, Hitze, BSOD), Support-Ablauf, Level/Eskalation, Incident/Problem, ESD |
(Die Regex-Treffer sind grob und überzählen; Etappe L1 zählt genau.)

**Etappe L1 – Leitung, sofort:** `tools/klausur_k3/kandidaten.py` (aus K2 kopiert, Regexe aus K3-E8/E26) → genaue
Kandidaten je Thema → `_to_delete/helfer/k3_kandidaten.json`; daraus erste Fassung `pool/sets/klausur_k3.json` nur mit
Pool-Verweisen; `klausur.ts` + `Klausurvorbereitung.tsx` auf K3 umstellen (K3-E10), Tests anpassen, Bau, `check.sh`, Push
(= sofort übbar, K3-E19). Dann Arbeitsaufträge je Gruppe schreiben (Lücken + Zielzahl + ID-Bereich, damit keine IDs kollidieren).
**Etappe L2 – Arbeiter starten (K3-E21), je eine Cloud-Sitzung, Sonnet, Auto, Repo ap1-lernprogramm + Zugriff ap1-buch:**
- A: DHCP (Thema 1) – größter Block zuerst (K3-E24).
- B: Redundanz + USV + RAID/Backup (Themen 2, 4).
- C: Switching/VLAN + IT-Sicherheit (Themen 3, 5).
- D: Hardwareplanung + Hardwarefehler/Support (Themen 6, 7).
Jeder Arbeiter: neue Fragen in die passenden Pool-Dateien (eigener ID-Bereich), wortgleiche Entwurfsaufgaben als
`erklaeren` (K3-E18/E27) + gebundene Varianten + `szenario2`-Ketten (K3-E28), Netzpläne wo nötig, dann Lehrtext-Abschnitt
seiner Themen (K3-E12, zuletzt), `bash tools/vorlauf.sh` + Pool-Suiten grün, Push NUR auf Zweig `k3/<gruppe>`; Liste der neuen IDs im Commit.
**Etappe L3 – Leitung parallel:** Generatoren (K3-E9): `genRaid` + RAID 6/0+1 (Gleichheitstest gegen `referenz/logik.js`
beachten), neu `genUsv` (Thema 2), neu `genDhcpBereich` (Thema 1), neu `genNetzteil` (Thema 6) – Umfang K3-E38; im Set eintragen; Tests.
**Etappe L4 – Übernahme je Zweig:** `cherry-pick -n`, Gegenlesen (Chat + 1 Sonnet-Agent, K3-E13), Set um neue IDs
ergänzen, `check.sh` grün, Push sofort (je Thema live, K3-E19).
**Etappe L5 – 24.11. Eingrenzung** einarbeiten, sobald der Nutzer sie meldet (K3-E17).
**Etappe L5b – Meldungs-Prüfung K3-Set (K3-E63..E67), Reihenfolge:**
| # | Klasse (Meldung) | Prüfung | K3-Stand 24.11. (gemessen) | Behebung |
|---|---|---|---|---|
| P1 | Ausschluss Zuordnung (18) | 1:1 ohne Zusatzantwort | 19 von 25 | K3-E64: Feld `extra`, je Frage 1–2 Zusatzantworten |
| P2 | Ausschluss Dropdown (6, 19, 20) | gleiche Optionsmenge = Lückenzahl; ≤ 3 Optionen je Lücke | 1 (M06-462); 4 von 19 | 1–2 plausible Optionen ergänzen |
| P3 | Zuordnung gleiche Reihenfolge (8) | Code `Zuordnung.tsx:40` | alle | je Zeile eigene Mischung (K3-E65) |
| P4 | Frage verrät Lösung (14) | A Echo, B Klammer (`pool_query`, Hinweis in check.sh) | A 5, B 0 | Fragetext umformulieren, nie die Antwort |
| P5 | Falschantwort zu offensichtlich (17) | D themenfremd + Agent (K3-E67) | D 24 (verrauscht) | Distraktor ersetzen, Längen-Tell beachten |
| P6 | Lückentext ohne Rot (11/12) | Code `Lueckentext.tsx` | 5 Lückentexte | falsche Lücken rot (K3-E65) |
| P7 | Rechner fehlt (15) | Rechenfragen außerhalb `RECHNER_TYPEN` | 9 Kandidaten (Text) | Kennzeichnung + Rechner-Klappe (K3-E65) |
Je Punkt: erst messen → Liste ins BEFUNDE → Nutzer fragen → beheben → `check.sh` → Commit; Push gebündelt. Danach Meldungen auf erledigt.
**Etappe L6 – Ende (spätestens Do. 26.11.):** Version 2.11.0, Sichtprüfung im Browser, BUILD_LOG, Push-Nachricht an den Nutzer (K3-E33).
Grenzen: 7T 95 % (K3-E15), 5h 85 % → nach Reset weiter (K3-E32).

## 4. Ablauf (Kurzform; Einzelheiten in §5)
1. Leitung (PC): Kandidaten je Thema aus dem Pool (`tools/klausur_k2/kandidaten.py` als Vorlage), Lücken zählen,
   Arbeitsaufträge je Thema schreiben, Cloud-Arbeiter anlegen.
2. Leitung parallel: Set `pool/sets/klausur_k3.json`, Schirm auf K3, Generatoren (K3-E9).
3. Arbeiter: neue Fragen + Lehrtext je Thema auf eigenen Zweigen; Leitung übernimmt, Gegenlesen, `check.sh`, Push.
4. Di. 24.11. Eingrenzung → Abschnitt 1 und Set nachziehen (K3-E17). Fertig spätestens Do. 26.11., dann 2.11.0.
