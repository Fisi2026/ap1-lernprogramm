# Arbeitsaufträge K3 – Cloud-Arbeiter A–D (Etappe L2, docs/plaene/PLAN_KLAUSUR3.md §5)

Stand 23.11.2026, Leitung (lokaler PC-Chat). Bindend: `docs/plaene/PLAN_KLAUSUR3.md` §3 (K3-E1…E61, nicht neu fragen – Auto-Modus,
keine Rückfragen an den Nutzer, K3-E31). Klausur Fr. 27.11.2026 – jedes fertige Thema zählt sofort.

## Für alle
1. Skill `fisi:fisi-lernapp` laden, `START_PROMPT.md`, `regeln/pool.md`, `regeln/messen.md` ganz lesen.
2. Quellen: Repo `Fisi2026/ap1-buch` (privat, nur lesen): `klausur_k3/` (Abschrift) + `klausur_k3/fotos/` (Commit 762b216),
   Lehrbuch `_aufbereitung/`. Wortgleich übernehmen darfst du die Entwurfsaufgaben der K3-Vorlage (K3-E1/E25).
3. Musterfirma für alle Ketten: `tools/klausur_k3/musterfirma.md` (K3-E50).
4. **Eigene Pool-Datei**: neue Fragen NUR in `pool/pool_m_k3_<gruppe>.json` (a/b/c/d) – keine andere Pool-Datei anfassen
   (sonst Konflikte beim Übernehmen). IDs NUR aus deinem Bereich unten. Schreiben wie `tools/apply_batch.py` (indent=2,
   sortiert, Schlussnewline); Gebiet nie raten (apply_batch sagt es). Katalogfremdes mit `"pruefungsteil": "AP2"` (K3-E39).
5. Je Entwurfsaufgabe der K3-Vorlage (nicht gestrichen, zu deinen Themen):
   - wortgleich als `erklaeren` (Eintippen Pflicht, danach Aussagenliste – K3-E27/E47); Musterlösung als Aussagenliste,
     je Punkt **Aussage + Begründung mit Fachbegriff** (K3-E48); englische Fachbegriffe ok (K3-E49);
   - **1–2 gebundene Varianten** (K3-E51) und, wo die Aufgabe ein Szenario hat, eine `szenario2`-Kette (K3-E28,
     Format wie `pool/pool_m_szenario2.json`) mit der Musterfirma.
6. Danach Einzelfragen für die Lücken deiner Themen (Liste unten), Mix wie AP1 (überwiegend gebundene Typen, K3-E3),
   Stufen 1–4 gemischt. Netzpläne/Skizzen als `svg` wo nötig (K3-E29) – jede Bildfrage rendern
   (`python3 tools/svg_bilder.py --id <ID>`). Distraktoren ohne Längen-Tell (richtige Antwort nie die längste).
7. `verweis` auf den passenden Abschnitt der Kursdatei; Buchstelle nur bei Zweifel im Kommentar (K3-E30).
8. Zuletzt Lehrtext (K3-E12/E57, kompakt: 1–2 Bildschirmseiten, Tabellen, Merksätze) im passenden Kursdatei-Abschnitt –
   nur wenn deine Gruppe einen hat (unten).
9. Prüfen: `node tools/pool_laden.js --pruefe`, `bash tools/vorlauf.sh`, `bash tools/suite.sh didaktik freitext wirtschaft`
   und die Pool-Wächter (`node tools/pool_query.js verweise|firmen|begriffe|verrat|zufall`). `START_PROMPT.md`,
   `sollwerte.env`, `BUILD_LOG.md`, `pool/sets/`, `neu/` und `v2/` NICHT anfassen – die Pool-Zahl, das Set und den Bau
   zieht die Leitung beim Übernehmen nach. Rote Suite wegen Poolzahl/Sollwert ist erwartet; jede andere rote Prüfung beheben.
10. Commit auf Zweig **`k3/<gruppe>`** (z. B. `k3/a-dhcp`), Push nur dorthin, **nie main, nie `--force`, kein Release**.
    Im Commit-Text: Liste der neuen IDs je Thema. Gern in Teilen pushen (erst wortgleiche Aufgaben, dann Rest) –
    die Leitung übernimmt Thema für Thema. Am Ende eine Hand-over-Notiz als letzte Nachricht: IDs, offene Punkte.

## Zielzahlen (neu, zusätzlich zu den Pool-Verweisen im Set; Set-Stand L1 in Klammern)
| Gruppe | Thema | Set L1 | neu etwa | ID-Bereich | Datei |
|---|---|---|---|---|---|
| A | 1 DHCP (21 P.) | 16 | **25** | M04-564 … M04-639 | `pool_m_k3_a.json` |
| B | 2 Redundanz + USV (6 P.) | 5 | **10** | M03-776 … M03-819 | `pool_m_k3_b.json` |
| B | 4 RAID + Backup (8 P.) | 26 | **8** | M06-543 … M06-579 | `pool_m_k3_b.json` |
| C | 3 Switching/VLAN (13 P.) | 27 | **8** | M03-840 … M03-879 | `pool_m_k3_c.json` |
| C | 5 IT-Sicherheit (8 P.) | 26 | **8** | M06-620 … M06-659 | `pool_m_k3_c.json` |
| D | 6 Hardwareplanung (12 P.) | 21 | **10** | M03-617 … M03-660 | `pool_m_k3_d.json` |
| D | 7 HW-Fehler + Support (10 P.) | 18 | **10** | M01-773 … M01-819 | `pool_m_k3_d.json` |

## A – DHCP (Thema 1, Vorrang K3-E24)
Kein Entwurfstext der K3-Vorlage vorhanden (DHCP ist neu in der Endliste) → eigene Erklären-Aufgaben im Klausurstil
(Szenario, „jede Aussage 1 Punkt“) + 2–3 `szenario2`-Ketten mit der Musterfirma.
Lücken (Pool hat v. a. DORA/Lease/APIPA als MC): UDP 67/68 + Broadcast → warum Relay/`ip helper` bei VLANs · Scope,
Ausschlüsse, Reservierung, Optionen (003 Router, 006 DNS, 015 Domäne) · Lease T1 50 %/T2 87,5 % · Failover-Modi
(Lastenausgleich vs. Hot-Standby), Split-Scope 80/20, Wirkung der Lease-Zeit bei Serverausfall (K3-E35) · Rogue-DHCP,
DHCP-Snooping · Fehlersuche Client-Seite NUR `ipconfig /all`, `/release`, `/renew` lesen und deuten (K3-E34) ·
DHCPv6/SLAAC im Überblick (AP2) · statisch vs. dynamisch. Lehrtext: neuer Abschnitt DHCP in `04_*.md` (dort, wo DHCP steht).

## B – Redundanz + USV (Thema 2) und RAID + Backup (Thema 4)
Wortgleich: **1A.1–1A.5** (USV-Teil zählt laut K3-E7), **1B.2, 1B.3, 1B.4** (1B.1 gestrichen), **5.1, 5.2** und die
handschriftliche Teilaufgabe „sind 0+1 / 10 das gleiche? Begründen“ (5.3 gestrichen).
Lücken Redundanz: SPOF-Konzept · STP nur Prinzip (Schleife, Broadcast-Sturm, MAC-Flattern, blockierte Ports – K3-E36) ·
LACP/Stacking · VRRP/HSRP · USV: VA vs. Watt (Leistungsfaktor), Arten VFD/VI/VFI, Überbrückungszeit, Herunterfahren per
Software/Netzwerkkarte (K3-E37), Dimensionierung mit Reserve.
Lücken RAID/Backup: RAID 6, 0+1 vs. 10 (Ausfallmuster), Hot-Spare + Rebuild, Hard-/Software-RAID, „RAID ist kein Backup“ ·
RPO/RTO · 3-2-1 · GVS · Medien/Orte (Band/NAS/Cloud, Offsite/Offline, Ransomware) · Snapshot vs. Backup · Restore-Test.
Lehrtext: Redundanz + USV (in `03_*.md`) und Backup + RAID 6/0+1 (in `06_*.md`).

## C – Switching/VLAN (Thema 3) und IT-Sicherheit (Thema 5)
Wortgleich: **3.1–3.4** (Szenario VLAN 10/20/30 auf L3-Switch) und **7.1** (Firewall, VLAN, VPN, IDS – Funktion und Zweck).
Lücken Switching: 802.1Q-Tag (VLAN-ID, tagged/untagged, natives VLAN) · Inter-VLAN-Routing SVI vs. Router-on-a-Stick ·
Paketweg L2/L3 (ARP, MAC-Tabelle, was sich je Hop ändert) · VLAN-Fehlersuche · OSI-Schicht je Gerät und Protokoll
(Hub/Switch/Router/L3-Switch; DHCP, ARP, STP – K3-E52).
Lücken Sicherheit: Firewall-Arten (Paketfilter, Stateful, Proxy, NGFW, DMZ), Regeltabelle lesen · Krypto sym/asym/hybrid
(AES/RSA, TLS), Signatur + Zertifikat · unsicher → sicher (Telnet/SSH, HTTP/HTTPS, FTP/SFTP) · OSI-Schicht je Maßnahme ·
VPN und IDS NUR Funktion und Zweck (K3-E26). Kein Lehrtext nötig (Pool und Kursdateien decken es), außer eine Lücke fällt auf.

## D – Hardwareplanung (Thema 6) und Hardwarefehler + Support (Thema 7)
Wortgleich: **4.1–4.4** (Systemvergleich A/B mit Budget 1.600 €, SATA vs. NVMe inkl. Protokoll AHCI/NVMe und Einsatzfälle,
Engpässe bei mehreren CAD-Projekten, zu schwaches Netzteil). Aufgabe 9 der K3-Vorlage ist NICHT fotografiert (K3-E6) →
Thema 7 nur aus eigenen Fragen.
Lücken HW-Planung: Netzteil berechnen (Summe, Reserve, 80 PLUS) · Kerne/Threads, DDR4/DDR5, VRAM, PCIe, M.2 · Engpass erkennen.
Keine Nutzwertanalyse (K3-E26).
Lücken Fehler/Support: Start/POST (Pieptöne), RAM + Speicher (Memtest, SMART), Hitze + Mechanik, Treiber + Bluescreen ·
systematisches Vorgehen · 1st/2nd/3rd Level + Eskalation, SLA · Incident vs. Problem · ESD + Sicherheit,
Garantie vs. Gewährleistung. Lehrtext: kompakter Abschnitt Fehlerbilder + Support-Ablauf im passenden Kursdatei-Abschnitt.
