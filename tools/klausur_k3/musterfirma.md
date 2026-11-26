# Musterfirma K3 (K3-E50) – festgelegt von der Leitung am 23.11.2026

Gilt für ALLE `szenario2`-Ketten und Erklären-Aufgaben mit Szenario in K3. Einzelfragen dürfen wie bisher andere
(erfundene) Firmennamen tragen. Name mit Umlaut schreiben (Wächter `pool_query.js firmen`).

**Hollmann Gerätebau GmbH** – mittelständischer Hersteller von Mess- und Prüfgeräten, ca. 120 Beschäftigte, ein Standort
mit Verwaltung, Entwicklung und Fertigung, dazu 8 Außendienstmitarbeitende.

## Netz (fest)
| Baustein | Festlegung |
|---|---|
| Serverraum | zentral; 2 Core-Switches (Layer 3), verbunden über 2 Leitungen (LACP); je Access-Switch eine Leitung zu jedem Core-Switch |
| Access | 4 Access-Switches (Layer 2): Verwaltung, Entwicklung, Fertigung, Serverraum |
| VLAN 10 Entwicklung | 192.168.10.0/24, Gateway 192.168.10.1 (SVI auf dem Core) |
| VLAN 20 Verwaltung | 192.168.20.0/24, Gateway 192.168.20.1 |
| VLAN 30 Server | 192.168.30.0/24, Gateway 192.168.30.1 |
| VLAN 40 Fertigung | 192.168.40.0/24, Gateway 192.168.40.1 (Mess-PCs, Drucker) |
| VLAN 99 Management | 192.168.99.0/24 (Switches, USV-Netzwerkkarte) |
| DHCP | Windows-Server DHCP1 192.168.30.10 (VLAN 30); Relay auf den SVIs (`ip helper-address 192.168.30.10`); je VLAN ein Bereich .100–.199, Lease 8 h; Drucker per Reservierung; ab Kette „Ausfallsicherheit“: DHCP2 192.168.30.11 |
| Server | 2 physische Hyper-V-Hosts (SRV1 450 W, SRV2 550 W) |
| NAS | NAS1 192.168.30.20, 4 Platten à 4 TB (Ausgang RAID 5), nächtliche Sicherung |
| Firewall | Hardware-Firewall 60 W mit DMZ (Webserver) und VPN-Zugang für den Außendienst; IDS am Spiegelport des Cores |
| USV | 1 zentrale USV im Serverraum (Ausgangslage: beide Core-Switches daran = SPOF) |
| Leistungen | Core-Switch je 80 W, Access-Switch je 40 W, NAS 180 W (wie Entwurf 1A.3: Summe 1560 W, mit 25 % Reserve 1950 W) |
| Arbeitsplätze | Büro-PCs; in der Entwicklung CAD-Arbeitsplätze (Budget 1.600 € je Platz, Entwurf Aufgabe 4) |
| Support | eigene IT mit 3 Personen: 1st Level Helpdesk (Ticketsystem), 2nd Level Administration, 3rd Level Hersteller/Systemhaus |

## Regeln
- Zahlen und Adressen nur aus dieser Tabelle; eine Kette darf eine Änderung einführen („Die IT ersetzt …“), sagt das aber im Text.
- Entwurfsaufgaben der K3-Vorlage bleiben WORTGLEICH (ihr Szenario-Text), die Musterfirma steht nur in eigenen Varianten/Ketten.
