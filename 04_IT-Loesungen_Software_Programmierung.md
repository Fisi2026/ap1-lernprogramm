# Modul 04 – IT-Lösungen, Software, Programmierung

## Modulübersicht

Dieses Modul behandelt den IHK-Fragenkomplex 04 „Entwickeln, Erstellen und Betreuen von IT-Lösungen" aus dem Prüfungskatalog 2. Auflage 2024 für die Abschlussprüfung Teil 1 (AP1) Fachinformatiker Systemintegration. Der Schwerpunkt liegt auf der Konzeptionierung und Konfiguration von IT-Systemen, bedarfsgerechter Hardware- und Softwareauswahl, Lizenzierungsfragen, Installationsaktivitäten, Programmiergrundlagen und Datenbankmodellierung.

**Hinweis:** SQL und RAID werden in AP2 behandelt und sind hier nicht enthalten.

## Inhaltsverzeichnis

1. [4.1 IT-Systeme konzeptionieren, konfigurieren, testen und dokumentieren](#41-it-systeme-konzeptionieren)
2. [4.2 Bedarfsgerechte Hardware-Auswahl](#42-hardware-auswahl)
3. [4.3 Bedarfsgerechte Software-Auswahl](#43-software-auswahl)
4. [4.4 Urheberrecht und Lizenzmodelle](#44-urheberrecht-lizenzmodelle)
5. [4.5 Installation, Konfiguration und Netzwerk](#45-installation-konfiguration)
6. [4.6 Programmiersprachen kennen und einordnen](#46-programmiersprachen)
7. [4.7 Programmierwerkzeuge und UML](#47-programmierwerkzeuge)
8. [4.8 Grundlagen relationaler Datenbanken](#48-datenbanken)

---

## 4.1 IT-Systeme konzeptionieren, konfigurieren, testen und dokumentieren können {#41-it-systeme-konzeptionieren}

**Einordnung:** Zentrale Fähigkeit zur systematischen Planung und Umsetzung von IT-Projekten. Taxonomiestufe: Verstehen und Anwenden. Hohe Prüfungsrelevanz in der AP1.

### Bedarfsanalyse

Die Bedarfsanalyse ist die erste Phase eines IT-Projektes:
- **Ziel:** Feststellung, welche IT-Lösung der Auftraggeber benötigt
- **Vorgehen:** Interviews, Fragebogen, Analyse von Geschäftsprozessen
- **Ergebnis:** Klare Anforderungen und Erwartungen dokumentieren

### Lastenheft vs. Pflichtenheft

| Kriterium | Lastenheft | Pflichtenheft |
|-----------|-----------|---------------|
| **Frage** | WAS will der Auftraggeber? | WIE setzt der Auftragnehmer um? |
| **Ersteller** | Auftraggeber (Kunde) | Auftragnehmer (Dienstleister/IT-Unternehmen) |
| **Zweck** | Anforderungsspezifikation | Lösungsspezifikation |
| **Inhalt** | Businessanforderungen, Ziele, Umfang | Technische Architektur, Implementierungsdetails, Termine, Kosten |
| **Verbindlichkeit** | Orientierungsvorgabe | Vertragsbestandteil, verbindlich |

**Merksatz:** Lastenheft = was? (Kunde), Pflichtenheft = wie? (Dienstleister)

**Typische Inhalte des Lastenhefts:** Ist-Zustand und Ziele (Soll-Zustand), funktionale und nichtfunktionale Anforderungen, Rahmenbedingungen (Termine, Budget, Schnittstellen). Servermodelle, Datenbank-Feinkonzept und Kalkulation legt erst der Auftragnehmer fest (Pflichtenheft bzw. Angebot).

| Kriterienart | Bedeutung | Beispiel |
|---|---|---|
| **Musskriterium** | unverzichtbar, wird bei der Abnahme geprüft | „Das System muss Lieferscheine als PDF erzeugen.“ |
| **Kannkriterium** (Wunschkriterium) | wünschenswert, verhandelbar nach Zeit und Budget | „Eine Smartphone-App wäre schön.“ |
| **Abgrenzungskriterium** | was ausdrücklich NICHT zum Auftrag gehört | „Die Lohnbuchhaltung ist nicht Teil des Projekts.“ |

**Funktionale Anforderungen** beschreiben, WAS das System tut (z. B. Belege hochladen). **Nichtfunktionale Anforderungen** beschreiben, WIE GUT es das tut (Antwortzeit, Verfügbarkeit, Sicherheit, Bedienbarkeit) – sie müssen messbar sein, sonst sind sie bei der Abnahme nicht prüfbar.

**Ablauf und Verbindlichkeit:** Bedarfsanalyse → Lastenheft (Auftraggeber) → Pflichtenheft (Auftragnehmer) → Prüfung und Freigabe durch den Auftraggeber → Umsetzung → Abnahme. Mit der Freigabe wird das Pflichtenheft verbindlich; Abweichungen vom Lastenheft muss der Auftraggeber VOR der Freigabe beanstanden, danach läuft eine Änderung über einen Änderungsantrag.

**Prüfen, auswählen, abnehmen:** Vor der Freigabe prüft der Auftraggeber das Pflichtenheft Punkt für Punkt: Ist jedes
Musskriterium aufgegriffen (nicht nur als spätere Option) und jede nichtfunktionale Anforderung **messbar** („99,5 %“
statt „hohe Verfügbarkeit“)? Beim Vergleich von Angeboten gilt: **Ein fehlendes Musskriterium schließt den Anbieter
aus**, auch bei niedrigerem Preis oder mehr erfüllten Kannkriterien – Muss- und Kannkriterien werden nicht gegeneinander
aufgerechnet. Muss das Budget gekürzt werden, entfallen zuerst **Kannkriterien** (nur so viele, wie die Kürzung
verlangt); Musskriterien bleiben. Bei der Abnahme gilt: Ein fehlendes Musskriterium ist nicht abnahmefähig, ein
Kannkriterium ohne Zusage und ein Abgrenzungskriterium sind kein Mangel, ein neuer Wunsch ist ein Änderungsantrag.

### Installation und Einrichtung von Systemen

#### Betriebssystem-Installation
- Wahl des BS (Windows, Linux, macOS) nach Einsatzzweck
- BIOS/UEFI: Firmware zum Hochfahren des Rechners
- Partitionierung: Festplatte in logische Bereiche aufteilen (z. B. C:, D:, Linux-Partitionen)
- Formatierung: Dateisystem erstellen (NTFS, ext4, FAT32)

#### Netzwerkanbindung und IP-Konfiguration

**IPv4 (32 Bit, dezimal):**
- Länge: 4 Oktette (z. B. 192.168.1.100)
- Private Bereiche (RFC 1918):
  - 10.0.0.0/8 (10.0.0.0 – 10.255.255.255)
  - 172.16.0.0/12 (172.16.0.0 – 172.31.255.255)
  - 192.168.0.0/16 (192.168.0.0 – 192.168.255.255)

**IPv6 (128 Bit, hexadezimal):**
- Format: 8 Blöcke à 4 Hexziffern, durch Doppelpunkt getrennt (z. B. 2001:0db8:85a3::8a2e:0370:7334)
- Link-Local-Adresse: fe80::/10 (Automatische Konfiguration ohne DHCP möglich)

#### Remote Desktop und KI-Software
- Remote Desktop: Fernzugriff auf den Arbeitsplatz (RDP, SSH)
- KI-Software (Künstliche Intelligenz): Integration von Sprachassistenten, Bildverarbeitung (z. B. ChatGPT, Copilot)

**Remote Desktop einrichten (Windows):** Das **Remote Desktop Protocol (RDP)** überträgt Bildschirm,
Tastatur und Maus eines entfernten Windows-Rechners; Standardport ist **3389** (TCP, zusätzlich UDP).
Schritte am Zielrechner:
1. **Remotedesktop aktivieren** (Einstellungen → System → Remotedesktop). ⚠️ Als Ziel taugt nur
   Windows **Pro oder Enterprise**; Windows Home kann nur als Client eine Verbindung
   aufbauen, aber keine annehmen.
2. Berechtigte Konten in die Gruppe **Remotedesktopbenutzer** aufnehmen – nicht jedes Konto
   bekommt Zugriff.
3. **Netzwerkebenen-Authentifizierung (NLA)** eingeschaltet lassen: Die Anmeldung wird geprüft,
   **bevor** eine Sitzung mit Anmeldebildschirm aufgebaut wird.
4. Die Firewall-Regel für RDP nur aus dem internen Netz erlauben.

⛔ **Port 3389 nie direkt ins Internet freigeben** – offene RDP-Zugänge werden automatisiert nach
schwachen Passwörtern abgesucht. Von außen nur **über VPN** oder ein **RD-Gateway** (das RDP in
HTTPS über Port 443 verpackt).
**SSH** (Secure Shell, Port **22**) ist der verschlüsselte Fernzugriff auf die **Kommandozeile**,
typisch für Linux-Server – ohne grafische Oberfläche.

### IP-Adressierung: Aufbau, Klassen und private Bereiche

Eine **IPv4-Adresse ist 32 Bit lang** und wird als vier Dezimalzahlen von 0 bis 255 notiert
(z. B. 192.168.10.7). Sie zerfällt in zwei Teile: **Netzanteil** und **Hostanteil**. Wo die
Grenze liegt, sagt die **Subnetzmaske** — oder kurz die **CIDR-Notation** `/24`, die angibt,
wie viele der 32 Bit zum Netzanteil gehören.

**Adressklassen (am ersten Oktett erkennbar):**

| Klasse | Erstes Oktett | Standardmaske | Typischer Einsatz |
|---|---|---|---|
| **A** | 1 – 126 | /8 (255.0.0.0) | sehr große Netze |
| **B** | 128 – 191 | /16 (255.255.0.0) | mittlere Netze |
| **C** | 192 – 223 | /24 (255.255.255.0) | kleine Netze, Standard im Büro |

⚠️ **127 fehlt in der Tabelle mit Absicht:** `127.0.0.0/8` ist für **Loopback** reserviert.
`127.0.0.1` ist immer der eigene Rechner — ein Ping darauf testet den TCP/IP-Stack, nicht das Netz.

**Private Adressbereiche nach RFC 1918** — im Internet nicht routbar, deshalb frei verwendbar:

| Bereich | CIDR | Adressen |
|---|---|---|
| 10.0.0.0 – 10.255.255.255 | 10.0.0.0/8 | 16.777.216 |
| 172.16.0.0 – 172.31.255.255 | 172.16.0.0/12 | 1.048.576 |
| 192.168.0.0 – 192.168.255.255 | 192.168.0.0/16 | 65.536 |

**Dazu APIPA:** `169.254.0.0/16`. Diese Adresse vergibt sich ein Windows-Client **selbst**, wenn
er **keinen DHCP-Server erreicht**. ⚠️ **Eine 169.254er-Adresse ist deshalb ein Befund, keine
Konfiguration** — sie bedeutet fast immer: DHCP antwortet nicht.

### Subnetting: ein Netz in mehrere Netze teilen

Wer ein /24-Netz auf mehrere Abteilungen aufteilen will, **leiht sich Bits vom Hostanteil** und
schlägt sie dem Netzanteil zu. Jedes geliehene Bit **verdoppelt die Zahl der Subnetze und
halbiert die Hosts pro Subnetz**.

**Die drei Formeln:**

```
Benötigte Bits n:        2^n ≥ gewünschte Anzahl Subnetze
Neues Präfix:            altes Präfix + n
Nutzbare Hosts:          2^(32 − Präfix) − 2
```

⚠️ **Das „− 2" ist Pflicht:** Die **erste** Adresse eines Subnetzes ist die **Netzadresse**, die
**letzte** die **Broadcastadresse**. Beide lassen sich keinem Gerät zuweisen.

**Die Tabelle, die man im Kopf haben sollte (ausgehend von einem /24):**

| Präfix | Subnetzmaske | Subnetze aus einem /24 | Blockgröße | Nutzbare Hosts |
|---|---|---|---|---|
| /24 | 255.255.255.0 | 1 | 256 | 254 |
| /25 | 255.255.255.128 | 2 | 128 | 126 |
| /26 | 255.255.255.192 | 4 | 64 | 62 |
| /27 | 255.255.255.224 | 8 | 32 | 30 |
| /28 | 255.255.255.240 | 16 | 16 | 14 |
| /29 | 255.255.255.248 | 32 | 8 | 6 |
| /30 | 255.255.255.252 | 64 | 4 | 2 |

**Rechenbeispiel 1 — vier Subnetze aus 192.168.20.0/24:**
4 Subnetze → 2^2 = 4 → **2 Bits leihen** → neues Präfix **/26**, Maske **255.255.255.192**,
**62 nutzbare Hosts** je Subnetz. Die vier Subnetze beginnen bei **.0, .64, .128 und .192**
(Blockgröße 64).

**Rechenbeispiel 2 — acht Abteilungen aus 172.16.8.0/24:**
8 Subnetze → 2^3 = 8 → **3 Bits** → **/27**, Maske **255.255.255.224**, **30 Geräte** je Subnetz.

**Zu welchem Subnetz gehört ein Host?** Blockgröße bestimmen, dann abwärts runden.
Beispiel: `192.168.20.135` bei /26 → Blockgröße 64 → 135 ÷ 64 = 2 Rest 7 → **Subnetz
192.168.20.128/26** (es reicht von .128 bis .191).

**Die vier Eckwerte eines Subnetzes — am Beispiel 10.0.5.0/25:**

| | Adresse | |
|---|---|---|
| Netzadresse | 10.0.5.**0** | nicht vergebbar |
| Erste Host-Adresse | 10.0.5.**1** | |
| Letzte Host-Adresse | 10.0.5.**126** | |
| Broadcastadresse | 10.0.5.**127** | nicht vergebbar |

⚠️ **Häufigster Fehler in Prüfungsaufgaben:** die Netzadresse als „erste verwertbare
Host-Adresse" anzugeben. Die erste Host-Adresse ist **immer Netzadresse + 1.**

**Umgekehrt gefragt: „Ich brauche mindestens 100 Hosts — welches Präfix?"**
/26 hätte nur 62, /25 hat 126 → **/25 ist die geringste ausreichende Maske.** ⚠️ Nicht die
Zahl der Subnetze mit der Zahl der Hosts verwechseln: hier ist der Hostbedarf die Vorgabe.

**Passen Subnetzzahl und Hostbedarf nicht zusammen?** Beide Vorgaben getrennt rechnen. Beispiel: 5 Abteilungen mit
je bis zu 40 Geräten aus einem /24. Fünf Subnetze brauchen 3 Bit (/27, nur 30 Hosts); 40 Hosts brauchen mindestens
/26 (62 Hosts), das ergibt aber nur 4 Subnetze. Ergeben die beiden Präfixe nicht dasselbe, ist der Adressblock zu
klein – es braucht einen größeren (z. B. ein /23, daraus entstehen acht /26-Subnetze). ⚠️ Plant man mit Wachstum,
rechnet man den **künftigen** Bedarf (28 Geräte + 20 % = 34, aufgerundet) und wählt danach das Präfix.
Aus einer Subnetzmaske wird zuerst das Präfix bestimmt (255.255.255.240 = /28), dann der Block: Das Standardgateway
bekommt häufig die **erste Host-Adresse** (Netzadresse + 1), der DHCP-Bereich umfasst die übrigen Host-Adressen.

### IPv6 in Kürze

Eine **IPv6-Adresse ist 128 Bit lang** und wird als **acht durch Doppelpunkte getrennte Gruppen
zu je vier Hexadezimalziffern** notiert:
`2001:0db8:0000:0000:0000:ff00:0042:8329`

**Zwei Kurzschreibregeln:**
- Führende Nullen einer Gruppe dürfen entfallen: `0042` → `42`
- `::` ersetzt eine zusammenhängende Folge von Nullgruppen — ⚠️ **aber höchstens EINMAL pro
  Adresse**, sonst wäre die Länge nicht mehr eindeutig rekonstruierbar.

Kurzform des Beispiels: `2001:db8::ff00:42:8329`

**Was man sich merken sollte:**
- **`fe80::/10` = Link-Local.** Gilt nur im selben Netzsegment, wird **ohne DHCP** automatisch
  konfiguriert. Das IPv6-Gegenstück zu APIPA — aber im Gegensatz zu APIPA **normal und gewollt**.
- **`/64` ist der Regelfall für Endgeräte-Subnetze.** Die unteren 64 Bit bilden die Interface-ID.

### Praxisbeispiel 1: Bedarfsanalyse und Lastenheft

**Szenario:** Ein Mittelständler möchte sein Büronetzwerk modernisieren.
- **Bedarfsanalyse-Ergebnisse:** 25 Mitarbeiter, diverse Betriebssysteme, zentrale Datenverwaltung erforderlich
- **Lastenheft:** „Bereitstellung von aktuellen Windows-11-Arbeitsplätzen mit Netzwerkanbindung, zentrale Datenspeicherung mit Backuplösung, Remote-Zugriff für mobile Mitarbeiter"
- **Pflichtenheft (Auszug):** „Installation von 25 Windows-11-Systemen mit IPv4-Adressen aus dem Bereich 192.168.1.0/24, Fileserver mit täglicher Datensicherung, VPN-Zugang via OpenVPN"

### Praxisbeispiel 2: IPv6-Konfiguration

Ein Unternehmen plant die Migration zu IPv6. Ein Client erhält die Link-Local-Adresse fe80::1 und kann sich ohne zusätzliche Konfiguration in das lokale Netzwerk einfügen.

### Typische IHK-Aufgabenstellungen

- Erläutern Sie den Unterschied zwischen Lastenheft und Pflichtenheft mit Beispielsinhalten.
- Ein Unternehmen hat 50 Arbeitsplätze. Welche private IPv4-Range wählen Sie? Begründen Sie.
- Beschreiben Sie die Schritte bei der Installation eines neuen Betriebssystems (Partitionierung, Formatierung, Netzwerk).
- Erklären Sie, warum Link-Local-IPv6-Adressen (fe80::/10) für lokale Kommunikation relevant sind.
- Ein /24-Netz in eine vorgegebene Zahl gleich großer Subnetze aufteilen: Präfix, Maske und nutzbare Hosts angeben
- Zu einer Host-Adresse das zugehörige Subnetz, die Netz- und die Broadcastadresse bestimmen
- Aus einem Hostbedarf die geringste ausreichende Subnetzmaske herleiten
- Eine IPv6-Adresse in die Kurzschreibweise überführen und begründen, warum `::` nur einmal vorkommen darf

### Merksätze

- **Lastenheft vor Pflichtenheft:** Erst die Anforderung (Lastenheft), dann die Lösung (Pflichtenheft).
- **Private IPv4-Ranges:** Drei Bereiche nach RFC 1918 auswendig lernen (10.x, 172.16–31.x, 192.168.x).
- **Ein Bit mehr Netz = doppelt so viele Subnetze, halb so viele Hosts.**
- **Nutzbare Hosts = 2^(32 − Präfix) − 2.** Die 2 sind Netzadresse und Broadcast — nie vergessen.
- **Blockgröße = 256 − letztes Oktett der Maske.** Bei /26 ist die Maske …192, also Blockgröße 64: die Subnetze beginnen bei 0, 64, 128, 192.
- **169.254.x.x ist kein Netz, sondern eine Fehlermeldung:** der Client hat keinen DHCP-Server gefunden.
- **`::` nur einmal.** Zweimal wäre mehrdeutig.

### Selbsttest

**Frage 1:** Was ist das Hauptziel des Lastenhefts?
<details>
<summary>Lösung anzeigen</summary>
Das Lastenheft dokumentiert die Anforderungen und Wünsche des Auftraggebers (WAS), bevor die technische Umsetzung geplant wird.
</details>

**Frage 2:** Nennen Sie zwei Unterschiede zwischen IPv4 und IPv6.
<details>
<summary>Lösung anzeigen</summary>
IPv4 hat 32 Bit (dezimal), IPv6 hat 128 Bit (hexadezimal). IPv6 unterstützt z. B. Link-Local-Adressen (fe80::/10) für lokale Netze ohne DHCP.
</details>

**Frage 3:** Was ist eine Link-Local-IPv6-Adresse und wofür wird sie verwendet?
<details>
<summary>Lösung anzeigen</summary>
Link-Local-Adressen (fe80::/10) werden automatisch konfiguriert und ermöglichen die Kommunikation im lokalen Netz ohne externe DHCP-Server.
</details>

**Frage 4:** Das Netz 192.168.1.0/24 soll in 8 gleich große Subnetze aufgeteilt werden. Präfix, Maske, nutzbare Hosts?
<details>
<summary>Lösung anzeigen</summary>
8 Subnetze → 2^3 = 8 → **3 Bits** leihen → Präfix **/27**, Subnetzmaske **255.255.255.224**,
**30 nutzbare Hosts** je Subnetz (2^5 − 2). Blockgröße 32, die Subnetze beginnen bei
.0, .32, .64, .96, .128, .160, .192, .224.
⚠️ 255.255.255.128 wäre /25 und damit nur **zwei** Subnetze.
</details>

**Frage 5:** Welche Broadcastadresse hat das Subnetz 192.168.5.64/26?
<details>
<summary>Lösung anzeigen</summary>
/26 → Blockgröße 64 → das Subnetz reicht von 192.168.5.**64** bis 192.168.5.**127**.
Die Broadcastadresse ist die letzte: **192.168.5.127**. Nutzbar sind .65 bis .126.
</details>

---

## 4.2 Bedarfsgerechte Hardware-Auswahl {#42-hardware-auswahl}

**Einordnung:** Fähigkeit zur Analyse von Anforderungen und Auswahl geeigneter Geräte. Taxonomiestufe: Verstehen und Analyse. Mittlere bis hohe Prüfungsrelevanz.

### Geräteklassen und Einsatzszenarien

| Gerätetyp | Einsatzszenario | Vorteile | Nachteile |
|-----------|-----------------|---------|----------|
| **Desktop-PC** | Büro, Arbeitsplatz mit hohen Leistungsanforderungen | Gute Leistung, günstig, erweiterbar | Unflexibel, platzbedürftig |
| **Notebook** | Mobiles Arbeiten, Außendienst | Mobil, kompakt | Höherer Preis, begrenzte Leistung, Wärmeabfuhr |
| **All-in-One** | Platzlimitierte Büros, Empfangsbereich | Platzsparend, elegant | Schwer reparierbar, höherer Preis |
| **Thin Client** | Terminal-Arbeitsplätze, VDI (Virtual Desktop Infrastructure) | Stromsparend, günstig, zentrale Verwaltung | Abhängig von Server, geringe Offline-Fähigkeit |
| **Tablet** | Präsentationen, Vor-Ort-Arbeiten, Notizen | Mobil, intuitiv, leicht | Begrenzte Leistung, kleine Bildschirme |
| **Smartphone** | Mobile Kommunikation, Fernzugriff | Sehr mobil, vernetzt | Kleine Bildschirme, begrenzte Produktivität |

### Mobile und stationäre Arbeitsplatzsysteme

- **Stationäre Systeme:** Desktop-PC mit LAN-Anschluss (kabelgebunden, stabil)
- **Mobile Systeme:** Notebook, Tablet mit WLAN-Zugang
- **Terminal-Arbeitsplätze:** Thin Client mit LAN zu Zentralserver (Apple Remote Desktop, RDP)

### Barrierefreiheit

Unterstützende Zusatzhardware für Menschen mit Behinderungen:
- **Sehbehinderung:** Größerer Monitor, Braillezeile, Screenreader
- **Motorische Behinderung:** Ergonomische Tastatur, Trackpad, Joystick-Maus
- **Hörbehinderung:** Visuelle Indikatoren, Lautsprecher mit hoher Lautstärke

### Praxisbeispiel 1: Büro mit Telearbeitsquote

**Szenario:** Ein Unternehmen mit 20 Mitarbeitern, davon 70 % im Homeoffice.
- **Für Büro:** 6 Desktop-PCs mit LAN (stabil, günstig)
- **Für Homeoffice:** 14 Notebooks mit WLAN (mobil, flexibel)
- **Für VDI-Terminalraum:** 4 Thin Clients mit zentraler Datenhaltung

### Praxisbeispiel 2: Barrierefreiheit am Arbeitsplatz

Ein Mitarbeiter mit Sehbehinderung benötigt:
- 32-Zoll-Monitor (statt 24-Zoll)
- Sprachausgabesoftware (Screenreader)
- Windows-Lupe für Texte

### Typische IHK-Aufgabenstellungen

- Wählen Sie für drei Szenarien (Büro, Außendienst, VDI) die geeignete Geräteklasse. Begründen Sie.
- Welche Nachteile hat ein Thin Client gegenüber einem Desktop-PC?
- Nennen Sie zwei Maßnahmen zur Gewährleistung von Barrierefreiheit.

### Merksätze

- **Desktop = Leistung, Notebook = Flexibilität, Thin Client = Zentralität**

### Selbsttest

**Frage 1:** Warum ist ein Thin Client stromsparender als ein Desktop-PC?
<details>
<summary>Lösung anzeigen</summary>
Ein Thin Client hat kaum eigene Rechenkapazität; die Verarbeitung erfolgt zentral auf dem Server. Deshalb benötigt das Gerät deutlich weniger Energie.
</details>

**Frage 2:** Ein Mitarbeiter ist mobil unterwegs und braucht Internetanbindung. Welche Geräte sind geeignet?
<details>
<summary>Lösung anzeigen</summary>
Notebook oder Tablet mit WLAN. Ein Smartphone ist als Backup denkbar, aber nicht primär als Arbeitsgerät.
</details>

**Frage 3:** Nennen Sie ein Barrierefreiheits-Merkmal für Menschen mit Motorikbehinderung.
<details>
<summary>Lösung anzeigen</summary>
Ergonomische oder programmierbare Tastatur, Trackpad-Alternativen, oder externe Maus mit angepasster Ergonomie.
</details>

---

## 4.3 Bedarfsgerechte Software-Auswahl {#43-software-auswahl}

**Einordnung:** Entscheidungskompetenz für Softwareauswahl nach Anforderungen. Taxonomiestufe: Verstehen, Analyse und Synthese. Mittlere Prüfungsrelevanz.

### Kategorien von Anwendungssoftware

- **Bürosoftware:** MS Office, LibreOffice (Tabellenkalkulation, Textverarbeitung)
- **Kommunikation:** Outlook, Teams, Slack
- **Spezialisierte Software (Branchensoftware):** CAD, ERP, CRM
- **Entwicklertools:** IDE (Integrated Development Environment), Compiler, Debugger
  ⚠️ Eine **IDE** vereint diese Werkzeuge in einer Oberfläche: **Editor** mit Syntax-Hervorhebung,
  **Compiler/Interpreter**, **Debugger** (Haltepunkte, Variablen inspizieren) und die
  **Versionskontrolle** (meist **Git**-Anbindung) samt Build-Werkzeugen.

### Betriebssysteme

| Aspekt | Windows | Linux | macOS |
|--------|---------|-------|-------|
| **Einsatzzweck** | Büro, Gaming, Enterprise | Server, Entwicklung, Open Source | Designer, Apple-Ökosystem |
| **Filemanagement** | Windows-Explorer | Dateimanager (Nautilus, Dolphin) | Finder |
| **Freigaben verwalten** | Samba/SMB, Group Policy | NFS, Samba | Sharing-Funktionen |
| **Lizenzmodell** | Proprietär | Meist GPL | Proprietär |

**Die vier klassischen Hauptaufgaben eines Betriebssystems:**

| Aufgabe | Was verwaltet wird |
|---|---|
| **Prozessverwaltung** | die CPU — welcher Prozess wann rechnen darf |
| **Speicherverwaltung** | der RAM — welcher Prozess welchen Bereich bekommt |
| **Dateiverwaltung** | die Festplatte — Ordner, Dateien, Zugriffsrechte |
| **Geräteverwaltung** | die Peripherie — Drucker, USB, Grafik, über Treiber |

⚠️ **Benutzeroberfläche, Virenschutz und Netzwerkdienste gehören NICHT dazu** — sie sind
Programme, die auf dem Betriebssystem laufen, nicht seine Kernaufgaben.

### Standard- vs. Individualsoftware

| Kriterium | Standardsoftware | Individualsoftware |
|-----------|-----------------|-------------------|
| **Zweck** | Allgemeine Anforderungen mehrerer Kunden | Spezifische Anforderungen eines Kunden |
| **Kosten (initial)** | Niedrig | Hoch (Entwicklung) |
| **Kosten (Wartung)** | Gering | Hoch (Support, Updates) |
| **Flexibilität** | Begrenzt | Hoch, vollständig anpassbar |
| **Time-to-Market** | Kurz (sofort verfügbar) | Lang (Entwicklungszeit) |
| **Beispiele** | MS Office, SAP, Adobe | Branchen-spezifische Systeme |

### Open Source vs. Proprietäre Software

- **Open Source (z. B. Linux, Apache):** Quellcode öffentlich einsehbar und veränderbar, Lizenzen wie GPL, Community-Support. ⚠️ **Meist ohne Lizenzkosten erhältlich — aber „Open Source" heißt quelloffen, nicht kostenlos.** Es gibt bezahlte Distributionen (z. B. Red Hat Enterprise Linux), und Support kostet in jedem Fall.
- **Proprietär (z. B. Windows, SAP):** Quellcode verschlossen, kommerzielle Lizenzen, professioneller Support

### Beurteilungskriterien

- **Anpassbarkeit:** Kann die Software an spezifische Prozesse angepasst werden?
- **Wartbarkeit:** Sind Updates und Bugfixes regelmäßig verfügbar?
- **Schnittstellen:** Lässt sich die Software mit anderen Systemen integrieren (API, Datenimport/Export)?
- **KI-Software:** Automatisierung von Prozessen, Predictive Analytics, Chatbots

### KI-Software auswählen

KI-Software (z. B. Chat-Assistenten, Übersetzung, Bild- und Spracherkennung) wird wie jede Software
nach Bedarf, Kosten und Schnittstellen beurteilt. Dazu kommen Kriterien, die bei KI besonders zählen:
- **Datenschutz:** Werden personenbezogene Daten eingegeben, gilt die DSGVO. Bei einem Cloud-Dienst
  braucht es einen **Auftragsverarbeitungsvertrag**, und die Verarbeitung sollte möglichst in der EU
  stattfinden.
- **Vertraulichkeit:** Nutzungsbedingungen prüfen – verwendet der Anbieter die Eingaben **zum
  Training** seiner Modelle? Für Geschäftsgeheimnisse nur Angebote ohne Trainingsnutzung.
- **Betriebsart:** **Cloud** (schnell startklar, Abo je Nutzer oder Abrechnung nach Nutzung) oder
  **lokal/On-Premises** (die Daten bleiben im Haus, es braucht aber leistungsfähige Hardware, meist
  mit Grafikprozessoren, und eigenen Betrieb).
- **Qualität und Kontrolle:** KI kann überzeugend klingende, aber falsche Antworten erzeugen
  (**Halluzinationen**) – die Ergebnisse prüft ein Mensch, bevor sie verwendet werden.
- **Nutzungsrechte:** Darf das Unternehmen die Ergebnisse kommerziell nutzen, und was erlaubt die
  Lizenz des Modells?

⚠️ **Merke:** Bei KI-Software zuerst fragen, **welche Daten hineingehen** – daraus folgen Anbieter,
Betriebsart und Vertrag.

### Praxisbeispiel 1: Standardsoftware vs. Individualsoftware

**Szenario:** Ein Handelsbetrieb braucht ein Lagerverwaltungssystem (LVS).
- **Standardsoftware:** Kaufen Sie ein bekanntes LVS (z. B. SAP, Odoo). Preis ca. 20.000 €, schnelle Einführung, begrenzte Anpassung.
- **Individualsoftware:** Beauftragen Sie eine Agentur, das LVS zu entwickeln. Preis ca. 80.000 €, lange Entwicklung (6–12 Monate), aber perfekt angepasst.

### Praxisbeispiel 2: IDE für Programmierung

Ein Entwickler wählt zwischen:
- **Visual Studio Code (VS Code):** Leicht, kostenfrei, Open Source, gute Community
- **JetBrains IntelliJ:** Mächtig, kommerzielle Lizenz, ausgezeichneter Debugger für Java

### Typische IHK-Aufgabenstellungen

- Vergleichen Sie Standardsoftware und Individualsoftware hinsichtlich Kosten, Flexibilität und Time-to-Market.
- Ein Unternehmen erwägt Open-Source-Software. Nennen Sie zwei Vor- und zwei Nachteile.
- Welche Beurteilungskriterien sind bei der Softwareauswahl entscheidend?

### Merksätze

- **Standard = schnell & günstig, Individuell = flexibel & teuer**
- **Open Source = quelloffen & prüfbar, Proprietär = ein Ansprechpartner & Gewährleistung**
  ⚠️ **Nicht „proprietär = sicherer":** Offener Quellcode kann von vielen geprüft werden, geschlossener wird vom Hersteller geprüft. Sicherheit hängt an der Pflege, nicht am Lizenzmodell.

### Selbsttest

**Frage 1:** Ein Unternehmen benötigt ein ERP-System. Sollte es Standard- oder Individualsoftware wählen? Begründen Sie kurz.
<details>
<summary>Lösung anzeigen</summary>
Meist Standardsoftware, da ERP-Systeme komplexe, bewährte Prozesse implementieren. Individualsoftware nur, wenn spezifische Prozesse vorliegen, die von Standardsoftware nicht abgedeckt werden.
</details>

**Frage 2:** Nennen Sie zwei Vorteile von Open-Source-Software.
<details>
<summary>Lösung anzeigen</summary>
Quellcode ist einsehbar (Transparenz, Sicherheit), keine Lizenzkosten, Community-Support, Flexibilität bei Anpassungen.
</details>

**Frage 3:** Was ist eine API und warum ist sie bei der Softwareauswahl wichtig?
<details>
<summary>Lösung anzeigen</summary>
Eine API (Application Programming Interface) ermöglicht die Kommunikation zwischen Softwaresystemen. Sie ist wichtig für die Integration mit anderen Systemen (z. B. ERP mit Buchhaltung).
</details>

---

## 4.4 Urheberrecht und Lizenzmodelle {#44-urheberrecht-lizenzmodelle}

**Einordnung:** Rechtliche und wirtschaftliche Grundlagen. Taxonomiestufe: Verstehen und Wissen. Prüfungsrelevanz: Hoch (Compliance-Fragen).

### Grundlagen des Schutzes der Urheber (UrhG)

Das Urheberrechtsgesetz (UrhG) schützt automatisch:
- **Automatische Entstehung:** Der Schutz entsteht mit der Schöpfung, keine Registrierung nötig (anders als z. B. Patente).
- **Software ist geschützt:** Auch Quellcode unterliegt dem UrhG.
- **Schutzdauer:** Während des Lebens des Urhebers + 70 Jahre (in der Regel)
- **Konsequenzen:** Unerlaubte Kopie oder Weitergabe ist strafbar.

### Lizenzarten

#### EULA (End User License Agreement)

- **Zweck:** Regelwerk zwischen Hersteller und Endnutzer
- **Umfang:** Bestimmt, was der Nutzer darf (z. B. Installation auf wie vielen Rechnern)
- **Beispiel:** Installation von Windows auf nur einem Rechner, keine Weitergabe an Dritte

#### OEM (Original Equipment Manufacturer)

- **Zweck:** Lizenz für Hardware-Hersteller
- **Besonderheit:** Gebunden an ein bestimmtes Gerät (z. B. Laptop)
- **Vorteil:** Günstiger als Einzelplatzlizenz
- **Nachteil:** Nicht übertragbar auf andere Hardware

#### GNU GPL (General Public License)

- **Zweck:** Copyleft-Lizenz für Open Source (z. B. Linux, Apache)
- **Verpflichtung (Copyleft-Klausel):** Wenn Sie eine geänderte Fassung **weitergeben**, müssen Sie den Quellcode dieser Fassung unter der GPL offenlegen. Wer GPL-Software nur im eigenen Betrieb anpasst und nicht weitergibt, muss nichts veröffentlichen.
- **Nicht verwechseln:** GPL heißt **nicht kostenlos**. Frei ist der Quellcode, nicht der Preis — GPL-Software darf verkauft werden.
- **Beispiel:** Linux ist GPL-lizenziert; jeder darf den Code nutzen und ändern. Wer eine geänderte Fassung als Produkt vertreibt, gibt den Quellcode mit heraus.

#### Pay-per-Use (Abrechnung nach Nutzung)

- **Zweck:** Abrechnung nach **tatsächlicher Nutzung** — Rechenzeit, Transaktionen, Datenmenge, Speicher
- **Beispiel:** Cloud-Rechenzeit je Stunde, Speicher je GB und Monat, API-Aufrufe je tausend
- **Vorteil:** Kein Grundpreis; wer nichts nutzt, zahlt nichts. Skaliert mit dem Bedarf
- **Nachteil:** Die Kosten sind vorab schwer zu beziffern und schwanken mit der Last
- ⚠️ **Nicht zu verwechseln mit Pay-per-Use ist die Subskription (Abo):** Microsoft 365 und Salesforce kosten eine **feste monatliche Gebühr je Nutzer** — unabhängig davon, wie viel damit gearbeitet wird. Das ist ein Abonnement, keine nutzungsabhängige Abrechnung.

### Unterscheidung von Lizenzmodellen

| Modell | Preis | Übertragbar | Quellcode | Beispiel |
|--------|-------|------------|-----------|----------|
| **Einzelplatzlizenz** | Mittelhoch | Nein | Nein | MS Word Einzellizenz |
| **Volumenlizenz** | Gering (pro Platz) | Nein | Nein | MS Office für 50 Mitarbeiter |
| **OEM-Lizenz** | Niedrig | Nur mit Hardware | Nein | Windows auf Neugerät |
| **GPL** | meist ohne Lizenzkosten — **nicht per Definition kostenlos** | Ja | Ja, offen | Linux |
| **Subskription (Abo)** | feste Gebühr je Nutzer und Zeitraum | Ja | Nein | MS 365, Adobe Creative Cloud |
| **Pay-per-Use** | schwankend, **nach tatsächlicher Nutzung** | Ja | Nein | Cloud-Rechenzeit je Stunde, API-Aufrufe je tausend |
| **Freeware** | Kostenlos | Ja | Nein | Adobe Acrobat Reader |
| **Shareware** | Probe kostenlos | Bedingt | Nein | WinRAR (Probeversion) |

### Praxisbeispiel 1: Lizenzauswahl für ein Unternehmen

**Szenario:** Ein Unternehmen mit 20 Mitarbeitern braucht Lizenzen.

**Option 1 – Einzellizenz:** 20 × 150 € = 3.000 € (teuer)
**Option 2 – Volumenlizenz:** 20 × 80 € = 1.600 € (wirtschaftlich)
**Option 3 – Subskription (Microsoft 365):** 20 × 10 €/Monat = 2.400 €/Jahr (flexibel, aber dauerhaft). ⚠️ **Das ist ein Abo, kein Pay-per-Use** — der Betrag steht vorab fest.

### Praxisbeispiel 2: GPL-Verpflichtungen

Ein Unternehmen integriert Linux-Kernel (GPL) in ein Produkt. Nach Verkauf an Kunden müssen die Änderungen am Kernel offengelegt werden (Copyleft-Pflicht).

### Typische IHK-Aufgabenstellungen

- Erläutern Sie die Unterschiede zwischen einer Einzelplatzlizenz und einer Volumenlizenz.
- Was ist die Copyleft-Klausel der GPL, und wann greift sie?
- Sie sollen 30 Lizenzen einkaufen. Welches Modell ist wirtschaftlich sinnvoll?
- Warum entsteht der Urheberrechtsschutz bei Software automatisch?

### Merksätze

- **UrhG: Schutz mit Schöpfung, keine Registrierung nötig**
- **GPL: Quellcode frei — und wer eine geänderte Fassung WEITERGIBT, gibt den Quellcode mit (Copyleft).** Wer nur intern anpasst, muss nichts veröffentlichen.
- **Pay-per-Use: Flexibel, langfristig teurer**

### Selbsttest

**Frage 1:** Wer muss eine EULA einhalten?
<details>
<summary>Lösung anzeigen</summary>
Der Endnutzer (Käufer). Die EULA regelt, wie die Software verwendet werden darf (z. B. Anzahl der Installationen).
</details>

**Frage 2:** Was ist der Vorteil einer Volumenlizenz gegenüber Einzelplatzlizenzen?
<details>
<summary>Lösung anzeigen</summary>
Volumenlizenz ist pro Platz günstiger, da der Hersteller Mengenrabatte gewährt (im Rechenbeispiel oben: 80 € statt 150 € pro Platz, also fast die Hälfte). Außerdem: einfachere zentrale Verwaltung der Lizenzen.
</details>

**Frage 3:** Sie verwenden GPL-Software in Ihrem Produkt und ändern den Quellcode. Was müssen Sie tun?
<details>
<summary>Lösung anzeigen</summary>
Das kommt darauf an, ob Sie das Produkt <strong>weitergeben</strong>.
<br>• <strong>Nur im eigenen Betrieb eingesetzt:</strong> Sie müssen nichts veröffentlichen. Die Copyleft-Pflicht wird erst durch die Weitergabe ausgelöst.
<br>• <strong>An Kunden ausgeliefert oder verkauft:</strong> Dann geben Sie den Quellcode Ihrer geänderten Fassung unter der GPL mit heraus — einsehbar und nutzbar für den Empfänger.
<br>⚠️ „Verkaufen" ist erlaubt. Die GPL verlangt einen offenen Quellcode, keinen Preis von null.
</details>

---

## 4.5 Installation, Konfiguration und Netzwerk {#45-installation-konfiguration}

**Einordnung:** Praktische Kompetenzen für IT-Fachkräfte. Taxonomiestufe: Anwenden und Analyse. Sehr hohe Prüfungsrelevanz (Praktikumsanteile).

### Installation und Konfiguration

- **Hardware:** BIOS/UEFI-Einstellungen, Speichererkennung, Boot-Reihenfolge
- **Betriebssystem:** Partitionierung, Formatierung, Installation, Treiber
- **Software:** Anwendungen installieren, Konfigurationsdateien anpassen
- **Netzwerk:** IP-Konfiguration, DHCP, DNS

### Arbeiten mit der Kommandozeile

**Befehlssyntax:** `Befehl [Optionen] [Argumente]`

**Beispiel:** `ipconfig /all` (Windows: zeigt alle Netzwerkadapter mit IP)

### Netzwerkkonfiguration: DHCP-DORA-Ablauf

DHCP (Dynamic Host Configuration Protocol) ermöglicht automatische IP-Zuweisung:

1. **Discover:** Client sendet Broadcast-Anfrage „Wer ist ein DHCP-Server?"
2. **Offer:** DHCP-Server antwortet mit Angebot (IP, Gateway, DNS)
3. **Request:** Client akzeptiert Angebot und fordert die IP an
4. **Acknowledge:** Server bestätigt endgültig die IP-Zuweisung

**Gültigkeitsdauer:** Lease-Time (z. B. 24 Stunden), dann Erneuerung nötig.

### DHCP im Betrieb: Relay, Bereich, Ausfallsicherheit

**Transport:** DHCP ist ein Anwendungsprotokoll (OSI-Schicht 7) über **UDP – Server Port 67, Client Port 68**.
Der Client hat anfangs keine Adresse, deshalb geht **Discover als Broadcast** an 255.255.255.255.

**Relay (ip helper-address).** Broadcasts enden an der VLAN- bzw. Router-Grenze. Steht der Server in einem anderen
VLAN, arbeitet die Gateway-Schnittstelle des Client-VLANs als **DHCP-Relay-Agent**: Sie nimmt den Broadcast an, schickt
ihn als **Unicast** an den Server und trägt ihre eigene Adresse als **giaddr** ein – daran wählt der Server den passenden
Bereich. Beispiel: auf der Schnittstelle 192.168.40.1 `ip helper-address 192.168.30.10`.

| Begriff | Bedeutung |
|---|---|
| **Bereich (Scope)** | Adresspool je Netz, z. B. 192.168.40.100–.199 |
| **Ausschluss** | Adresse im Bereich, die nie vergeben wird (für statisch eingetragene Geräte) |
| **Reservierung** | feste Adresse für eine **MAC-Adresse**, trotzdem per DHCP (Drucker) |
| **Option 003 / 006 / 015 / 051** | Router (Gateway) / DNS-Server / DNS-Domänenname / Lease-Zeit |
| **statisch** | Server, Router, Switch-Schnittstellen – müssen ohne DHCP erreichbar sein |

**Lease erneuern:** bei **50 % (T1)** Request per Unicast an den eigenen Server, bei **87,5 % (T2)** per Broadcast an
jeden Server; nach Ablauf gibt der Client die Adresse auf und beginnt neu – ohne Antwort setzt Windows **169.254.x.x
(APIPA)**. Bei 8 h Lease: T1 nach 4 h, T2 nach 7 h.

**Ausfallsicherheit:** Fällt der einzige Server aus, trifft es **neue Geräte sofort**, laufende erst am **Ende ihrer
Lease**. Die Lease-Zeit ist also die Reparaturfrist: lang = mehr Puffer und weniger Verkehr, aber Änderungen kommen spät an.

| Verfahren | Arbeitsweise |
|---|---|
| **Split-Scope 80/20** | zwei Server, getrennte Teilbereiche (z. B. .100–.179 und .180–.199), **kein Abgleich** |
| **Failover – Lastenausgleich** | beide vergeben gleichzeitig aus einem gemeinsamen Bereich, Leases werden **synchronisiert** |
| **Failover – Hot-Standby** | ein Server aktiv, der Partner übernimmt erst bei dessen Ausfall |

**Rogue-DHCP und DHCP-Snooping:** Ein nicht autorisierter DHCP-Server (z. B. ein eingesteckter Heimrouter) beantwortet
Discover mit falschem Gateway – Ausfall oder Man-in-the-Middle. **DHCP-Snooping** am Switch lässt DHCP-Antworten nur über
**trusted** Ports (Uplink, Serverport) zu; Endgeräte-Ports sind **untrusted**.

**Fehlersuche am Client:** `ipconfig /all` zeigt DHCP-Server, „Lease erhalten“ und „Lease läuft ab“ ·
`ipconfig /release` gibt die Lease frei · `ipconfig /renew` fordert eine neue an. Bleibt nach `/renew` 169.254.x.x,
liegt der Fehler auf dem Weg zum Server (Kabel, Port, VLAN, Relay) oder am Server. Ein fremder Eintrag bei
„DHCP-Server“ deutet auf Rogue-DHCP.

**DHCPv6 und SLAAC (Überblick, AP2):** DHCPv6 nutzt UDP 546 (Client) / 547 (Server) und Multicast statt Broadcast.
Bei **SLAAC** (Stateless Address Autoconfiguration) nennt der Router per Router Advertisement nur das Präfix, die
Interface-ID bildet der Client selbst; **stateful DHCPv6** vergibt und verwaltet die Adressen wie DHCP bei IPv4.

**Merksätze:** Broadcast endet an der Layer-3-Grenze – darum Relay je Client-VLAN. · Reservierung = fest per MAC aus dem
DHCP, Ausschluss = gar nicht aus dem DHCP. · Split-Scope teilt ohne Abgleich, Failover gleicht ab. · Gegen Rogue-DHCP
hilft DHCP-Snooping.

### WLAN-Zugang

- **WPA2/WPA3 Pre-Shared Key (PSK):** Einfacher Passwortschutz, für Heimbüros ausreichend
- **WPA2/WPA3 Enterprise (802.1X/RADIUS):** Professionelle Authentifizierung mit Benutzername/Passwort pro Benutzer; zentrale Verwaltung via RADIUS-Server
- **Einzelne Personen aussperren:** Bei PSK kennt jeder Ausgeschiedene das gemeinsame Passwort weiter – es muss auf allen Geräten geändert werden. Bei Enterprise wird nur sein Benutzerkonto auf dem RADIUS-Server gesperrt.
- **RADIUS als „Triple-A-System“:** **Authentifizierung** (wer meldet sich an? Benutzername und Passwort), **Autorisierung** (was darf der Benutzer? Zugriffsrechte, z. B. Gäste nur Internet) und **Accounting** (was wurde genutzt? Dauer und Datenmenge, etwa für die Abrechnung).

### VPN (Virtual Private Network)

- **Zweck:** Sichere Verschlüsselung von Datenverkehr über unsichere Netze (z. B. öffentliches WLAN)
- **Implementierung:** OpenVPN, WireGuard, IPsec

**Zero-Trust — „Never Trust, Always Verify".** Klassische Netze arbeiten mit **Perimeter-
Sicherheit**: Wer drinnen ist (im WLAN, im VPN-Tunnel), gilt als vertrauenswürdig. Genau diese
**implizite Vertrauenswürdigkeit** gibt Zero-Trust auf: **jeder einzelne Zugriff wird erneut
authentifiziert und autorisiert** — geprüft werden Nutzer-Identität, Gerätestatus, Ort und Zeit.
►► **Der Unterschied in einem Satz:** Perimeter-Sicherheit fragt einmal an der Tür, Zero-Trust
fragt bei jeder Ressource. Ein gestohlener VPN-Zugang öffnet damit nicht mehr das ganze Netz.
- **Use-Case:** Remote-Mitarbeiter verbinden sich vom Homeoffice ins Unternehmensnetz

**Der Tunnel — das Grundprinzip.** Ein VPN legt über das unsichere Netz einen **Tunnel**: einen
verschlüsselten Datenpfad zwischen zwei Endpunkten. Die ursprünglichen Pakete werden dabei in
neue Pakete verpackt (**Kapselung**) und erst am anderen Ende wieder ausgepackt. Wer unterwegs
mitliest, sieht nur den äußeren Umschlag.
⚠️ **Das Ergebnis ist der eigentliche Zweck:** Der entfernte Client verhält sich, als wäre er
**Mitglied des internen Netzes** — mit interner IP-Adresse, Zugriff auf Freigaben und interne
Server.

**Zwei Architekturen, und die Prüfung fragt nach dem Unterschied:**

| Architektur | Wer wird verbunden | Typischer Fall |
|---|---|---|
| **End-to-Site** (auch Remote-Access, Client-to-Site) | **ein einzelnes Gerät** mit einem Netz | Außendienst oder Homeoffice-Notebook wählt sich in die Firma ein; VPN-Client auf dem Gerät |
| **Site-to-Site** | **zwei ganze Netze** miteinander | Zentrale und Filiale werden dauerhaft gekoppelt; der Tunnel endet an den beiden **Routern**, die Endgeräte merken nichts davon |

⚠️ **Der Unterschied liegt im Endpunkt, nicht in der Verschlüsselung.** Bei End-to-Site sitzt ein
Tunnelende auf dem **Gerät**, bei Site-to-Site auf dem **Router** — deshalb braucht bei
Site-to-Site kein einziger Arbeitsplatz eine VPN-Software.
**Ein dritter Fall am Rande:** End-to-End verschlüsselt zwischen zwei einzelnen Geräten.

### Konsolenbefehle-Tabelle

| Zweck | Windows | Linux |
|-------|---------|-------|
| **Verzeichnisinhalt anzeigen** | `dir` | `ls` |
| **Verzeichnis erstellen** | `mkdir ordner` | `mkdir ordner` |
| **IP-Konfiguration anzeigen** | `ipconfig` oder `ipconfig /all` | `ifconfig` oder `ip addr show` (iproute2) |
| **Alias (Kurznamen) setzen** | `doskey ls=dir` | `alias ls='ls --color'` |
| **ARP-Tabelle** | `arp -a` | `arp -a` oder `ip neigh` |
| **Datei/Ordner löschen** | `del datei.txt` oder `rmdir` | `rm datei.txt` |
| **Datei kopieren** | `copy quelle ziel` | `cp quelle ziel` |
| **Dateiberechtigungen/-attribute ändern** | `icacls` (Berechtigungen), `attrib` (Attribute) | `chmod 755 datei` |
| **Ping (Erreichbarkeit testen)** | `ping 8.8.8.8` | `ping 8.8.8.8` |
| **Netzwerkrouten tracen** | `tracert 8.8.8.8` | `traceroute 8.8.8.8` |
| **DNS-Abfrage** | `nslookup example.com` | `nslookup example.com` oder `dig` |
| **DNS-Zwischenspeicher leeren** | `ipconfig /flushdns` | `resolvectl flush-caches` |
| **Aktive Verbindungen und offene Ports** | `netstat -an` | `netstat -an` oder `ss -tuln` |
| **Routing-Tabelle anzeigen** | `route print` | `ip route` oder `route -n` |
| **MAC-Adressen der Adapter** | `getmac` | `ip link` |
| **NetBIOS-Namen eines Zielrechners** | `nbtstat -a name` | – (Windows-eigen) |
| **Laufende Prozesse anzeigen** | `tasklist` | `ps aux` |
| **Prozess beenden** | `taskkill /PID 4321 /F` | `kill 4321` (erzwungen: `kill -9`) |
| **Angemeldeten Benutzer anzeigen** | `whoami` | `whoami` |
| **Systeminformationen** | `systeminfo` | `uname -a` und `lscpu` |

⚠️ **`netstat -an` zeigt die Ports numerisch** — ohne `-n` löst Windows Namen auf, was bei der
Fehlersuche nur bremst. **`tasklist` liefert die PID (Process Identifier)**, die `taskkill` bzw.
`kill` anschließend braucht: erst nachsehen, dann beenden.

**Alias im Detail (Linux):** `alias ll='ls -l'` legt einen Kurznamen an · `alias` ohne Argument
listet alle gesetzten Aliase · `unalias ll` entfernt ihn wieder. ⚠️ **Ein so gesetzter Alias gilt
nur in der aktuellen Shell-Sitzung**; dauerhaft wird er erst durch einen Eintrag in der Datei
`~/.bashrc`. Unter Windows übernimmt `doskey` diese Rolle.

### Praxisbeispiel 1: DHCP-Ablauf in einem Büro

**Szenario:** Neuer Mitarbeiter steckt sein Notebook ins LAN.

1. **Discover:** Notebook sendet Broadcast: „Ich brauche eine IP!"
2. **Offer:** DHCP-Server (192.168.1.1) antwortet: „Hier: 192.168.1.100, Gateway 192.168.1.1, DNS 8.8.8.8"
3. **Request:** Notebook bestätigt: „Ich nehme 192.168.1.100"
4. **Acknowledge:** Server: „OK, die IP ist für 24 Stunden dein"
5. **Nach 24 Stunden:** Erneuerung (ebenfalls DORA-Ablauf)

### Praxisbeispiel 2: Kommandozeilendiagnose

Ein Mitarbeiter kann nicht ins Internet:
```
C:\> ipconfig /all
→ IP ist 169.254.x.x (Fehler: Keine DHCP-IP erhalten)
C:\> ping 8.8.8.8
→ Request timed out (Keine Verbindung)
C:\> ping 192.168.1.1
→ Antwort von 192.168.1.1 (Router antwortet, aber kein Internet)
```

**Diagnose:** DHCP-Server erreichbar? `nslookup google.com` → Fehler → DNS-Problem oder DHCP-Lease vorbei.

### Die DNS-Zonendatei

Ein DNS-Server hält seine Namen in einer **Zonendatei** — je Zeile ein Eintrag aus Name, Klasse
(`IN`) und Eintragstyp:

| Typ | Bedeutung | Beispiel |
|---|---|---|
| **A** | Name → IPv4-Adresse | `www  IN  A  192.168.1.20` |
| **AAAA** | Name → IPv6-Adresse | `www  IN  AAAA  2001:db8::20` |
| **CNAME** | Name → **anderer Name** (Alias) | `shop  IN  CNAME  www.example.com.` |
| **MX** | zuständiger Mailserver der Zone | `@  IN  MX 10  mail.example.com.` |

⚠️⚠️ **DIE REGEL, AN DER DIE MEISTEN ZONENDATEIEN SCHEITERN: ein Name darf nicht gleichzeitig
einen A-Record und einen CNAME-Record haben** (RFC 1034 und RFC 2181). Steht `www` bereits als
A-Record in der Zone, ist ein zusätzliches `www IN CNAME …` unzulässig — **entweder das eine oder
das andere.** ⚠️ Dass ein CNAME auf einen Namen **außerhalb** der eigenen Zone zeigt, ist dagegen
völlig zulässig und der Normalfall bei Anbieterwechseln.

### Strukturierte Fehlersuche

⚠️⚠️ **EIN SPORADISCHER FEHLER WIDERLEGT DIE EINZELMESSUNG.** Meldet ein Nutzer „manchmal geht es
nicht", beweist ein einzelner erfolgreicher `ping` gar nichts — beobachtet werden muss **über die
Zeit**, bis ein Muster sichtbar wird:
- **Dauer-Ping mit Zeitstempel**: `ping -t <IP>` (Windows, dauerhaft) bzw. `ping <IP>` unter Linux,
  über Stunden mitprotokolliert. Gesucht sind **Paketverluste und Ausreißer in der Antwortzeit**,
  nicht der Durchschnitt.
- **Logfiles und Auslastung** des betroffenen Servers zu genau diesen Zeitpunkten: Läuft ein
  Cronjob, ein Backup, ein Virenscan? Fallen die Aussetzer auf **Stoßzeiten**?
►► **Erst die Korrelation Zeitpunkt ↔ Last macht aus der Beobachtung eine Diagnose.**

„Das Netzwerk geht nicht" ist keine Fehlermeldung, sondern eine Beobachtung. Die Suche folgt
immer derselben Reihenfolge:

1. **Eingrenzen — vor jedem Befehl.** Was genau funktioniert nicht, **seit wann**, und ist
   **nur ein Arbeitsplatz betroffen oder alle**? Die Antwort auf die letzte Frage halbiert die
   Suche sofort: ein einzelner Rechner deutet auf das Gerät, alle auf Switch, Router oder
   Provider.
2. **Von unten nach oben prüfen** (entlang des OSI-Modells, siehe Modul 03, Abschnitt 3.2):
   Kabel und Verbindungs-LED → IP-Adresse (`ipconfig` / `ip addr`) → Gateway erreichbar
   (`ping` auf den Router) → Namensauflösung (`nslookup`) → Anwendung.
3. **Eine Ursache nach der anderen ausschließen** — immer nur **eine** Änderung auf einmal,
   sonst weiß am Ende niemand, was geholfen hat.
4. **Ergebnis dokumentieren**, damit derselbe Fall beim nächsten Mal schneller gelöst ist
   (Ticketsystem, siehe Modul 07, Abschnitt 7.3).

⚠️ **Die häufigste Falle ist der Sprung zur Vermutung:** Wer sofort den Treiber neu installiert,
ohne zu wissen, ob der Nachbarplatz auch betroffen ist, sucht am falschen Ende.

### Typische IHK-Aufgabenstellungen

- Erklären Sie den DHCP-DORA-Ablauf Schritt für Schritt.
- Unterscheiden Sie WPA2 PSK und WPA2 Enterprise. Wann setzen Sie welches ein?
- Sie können kein Internet trotz LAN-Anschluss. Welche Befehle nutzen Sie zur Diagnose?
- Ordnen Sie Konsolenbefehle ihrem Zweck zu, z. B. `ipconfig` (Windows) und `ip addr` (Linux) zur Anzeige der IP-Konfiguration.

### Merksätze

- **DHCP: Discover → Offer → Request → Acknowledge (DORA)**
- **PSK = einfach & privat, Enterprise = sicher & professionell**

### Selbsttest

**Frage 1:** Ein Notebook erhält die IP 169.254.1.1. Was ist passiert?
<details>
<summary>Lösung anzeigen</summary>
Das Notebook konnte keine IP vom DHCP-Server erhalten und hat sich selbst eine Link-Local-Adresse (169.254.x.x) zugewiesen. DHCP-Server ist unerreichbar oder offline.
</details>

**Frage 2:** Welcher Befehl zeigt Dir unter Linux die aktuelle IP-Adresse?
<details>
<summary>Lösung anzeigen</summary>
`ifconfig` (alt) oder `ip addr show` (modern, iproute2). Unter Windows: `ipconfig`.
</details>

**Frage 3:** Wann würden Sie VPN einsetzen?
<details>
<summary>Lösung anzeigen</summary>
Wenn Mitarbeiter von extern (z. B. öffentliches WLAN, Homeoffice) sich sicher ins Unternehmensnetz verbinden müssen. VPN verschlüsselt die Daten.
</details>

---

## 4.6 Programmiersprachen kennen und einordnen {#46-programmiersprachen}

**Einordnung:** Verständnis von Programmierkonzepten und Sprachenklassifikation. Taxonomiestufe: Verstehen und Anwenden. Mittlere bis hohe Prüfungsrelevanz.

### Compiler, Linker, Interpreter

| Typ | Funktionsweise | Vorteile | Nachteile | Beispielsprachen |
|-----|---|---|---|---|
| **Compiler** | Übersetzt Quellcode einmalig zu Maschinencode (.exe, .bin) | Schnelle Ausführung, keine Abhängigkeiten | Längere Kompilierung, plattformabhängig | C, C++, Rust, Java (zu Bytecode) |
| **Interpreter** | Führt Quellcode zeilenweise aus (on-the-fly) | Plattformunabhängig, schnelle Fehlersuche | Langsamere Ausführung | Python, JavaScript, Bash, Ruby |
| **JIT (Just-in-Time)** | Hybridansatz: Kompilierung bei Ausführung | Balance zwischen Geschwindigkeit und Flexibilität | Komplexer | Java (JVM), C# (.NET) |

### Prozedurale und objektorientierte Programmierung

**Prozedural (Imperativ):**
- Ablauf: Schritt-für-Schritt-Anweisungen
- Fokus: **Wie** soll es getan werden? Der Ablauf steht im Mittelpunkt. (HOW)
- Beispiele: C, Pascal, Bash, Fortran
- Nachteil: Code-Wiederholung, schwer wartbar bei großen Projekten

**Objektorientiert (OOP):**
- Ablauf: Objekte mit Attributen und Methoden
- Fokus: Was sind die Objekte? (WHAT)
- Beispiele: Java, C++, C#, Python, Smalltalk
- Vorteil: Modularität, Wiederverwendung, Wartbarkeit

### Variablen und Datentypen

| Datentyp | Größe (Beispiel) | Wertebereich | Beispiel |
|----------|---|---|---|
| **Integer (int)** | 32 Bit (oft) | -2.147.483.648 bis 2.147.483.647 | 42, -15 |
| **Float/Double** | 32/64 Bit | Dezimalzahlen | 3.14, -0.5 |
| **Boolean (bool)** | logisch 1 Bit | true, false | Bedingungen |
| **Char (char)** | 8/16 Bit | einzelnes Zeichen | 'A', '5' |
| **String** | Variabel | Text beliebiger Länge | "Hallo Welt" |

### Datenstrukturen

- **Array:** Feste Größe, gleiche Datentypen, Index 0..n-1
  ```
  int zahlen[5] = {10, 20, 30, 40, 50};
  zahlen[2] = 30  // Index 2
  ```

- **Liste (dynamisch):** Variable Größe, auch unterschiedliche Datentypen
  ```
  Liste: [1, 'Hallo', 3.14]
  ```

### Kontrollstrukturen

#### Verzweigung (if/else, switch)

**if/else:**
```
if (bedingung) {
    // Code wenn wahr
} else {
    // Code wenn falsch
}
```

**switch:**
```
switch (variable) {
    case 1:
        // Code für Wert 1
        break;
    case 2:
        // Code für Wert 2
        break;
    default:
        // Standardfall
}
```

#### Schleifen (for, while, do-while)

| Schleife | Typ | Syntax | Anwendung |
|----------|-----|--------|-----------|
| **for** (**Zählschleife**) | Kopfgesteuert | `for (int i=0; i<10; i++) { }` | **Bekannte** Anzahl Iterationen |
| **while** | Kopfgesteuert | `while (bedingung) { }` | Unbekannte Anzahl, vor Prüfung |
| **do-while** | Fußgesteuert | `do { } while (bedingung);` | Mindestens 1x Ausführung |

**Unterschied:** Kopfgesteuert (for, while) prüft die Bedingung **vor** der Ausführung; fußgesteuert (do-while) **nach** ihr — deshalb läuft do-while mindestens einmal.
⚠️ **Die Prüfung unterscheidet zusätzlich nach dem Abbruchgrund:** Die **Zählschleife** (`for`) läuft eine **vorher bekannte** Anzahl von Durchläufen; die **bedingungsgesteuerte** Schleife (`while`, `do-while`) läuft, bis eine Bedingung umschlägt. Im Pseudocode heißen sie `FÜR i = 1 BIS n TUN` und `SOLANGE …` bzw. `WIEDERHOLE … BIS …`.

### Prozeduren und Funktionen

| Merkmal | Prozedur | Funktion |
|---------|----------|----------|
| **Rückgabewert** | Keiner (void) | Genau ein Wert (ggf. strukturiert, z. B. Objekt/Array) |
| **Syntax (Java)** | `void prozedur()` | `int funktion()` |
| **Beispiel** | `void print()` | `int add(a, b) { return a+b; }` |

### Klassen, Objekte, Methoden, Sichtbarkeit

**Klasse:** Bauplan für Objekte

```
class Auto {
    // Attribute (Sichtbarkeit)
    public String farbe;      // Öffentlich
    private int baujahr;      // Privat
    protected int ps;         // Geschützt (nur Subklassen)
    
    // Methoden
    public void fahren() {
        System.out.println("Fährt...");
    }
    
    private void warten() {
        System.out.println("Service...");
    }
}
```

**Sichtbarkeit:**
- `public (+)`: Von überall sichtbar und nutzbar
- `private (-)`: Nur innerhalb der Klasse
- `protected (#)`: Innerhalb der Klasse und Subklassen

### Bibliotheken und Frameworks

- **Bibliothek:** Sammlung von vordefinierten Funktionen (z. B. math.h in C, numpy in Python)
- **Framework:** Strukturierter Rahmen für Anwendungen (z. B. Spring in Java, Django in Python, React in JavaScript)

### Skriptsprachen

- **Shell-Skript (Bash):** Befehle für Linux/Unix-Automatisierung
- **PowerShell:** Befehle für Windows-Automatisierung
- **Python:** Universelle Skriptsprache, einfache Syntax, große Community

### Debugging und Fehlerarten

- **Formale Fehler (Syntaxfehler):** Falsche Grammatik, Compiler/Interpreter erkennt sie
- **Inhaltliche Fehler (Logikfehler):** Programm läuft, aber liefert falsche Ergebnisse
  
**Debugging-Methoden:**
- Print-Statements (Variablen ausgeben)
- Debugger (Breakpoints, Step-Into, Watch-Variablen)
- Unit-Tests

### Algorithmen und typische Rechenverfahren

Ein **Algorithmus** ist eine endliche, eindeutige Folge von Schritten, die aus einer Eingabe eine
Ausgabe erzeugt. In der Prüfung tauchen immer dieselben Grundverfahren auf — meist als
Schreibtischtest (Abschnitt 4.7) oder als Pseudocode-Lücke.

**Suchen in einer Liste**

| Verfahren | Vorgehen | Voraussetzung | Aufwand |
|---|---|---|---|
| **Lineare Suche** | jedes Element der Reihe nach vergleichen | keine | im Mittel halbe Listenlänge |
| **Binäre Suche** | Mitte prüfen, dann die Hälfte verwerfen, wiederholen | **Liste muss sortiert sein** | sehr schnell, halbiert bei jedem Schritt |

**Minimum oder Maximum bestimmen** ist der Sonderfall der linearen Suche: Erstes Element als
vorläufiges Minimum merken, jedes weitere damit vergleichen, bei kleinerem Wert den Merker
ersetzen. ⚠️ **Der Merker wird mit dem ersten Element vorbelegt, nicht mit 0** — sonst findet
man in einer Liste positiver Zahlen nie ein Minimum.

**Sortieren durch Tauschen (Bubble-Prinzip):** Zwei benachbarte Elemente vergleichen und
vertauschen, wenn sie in der falschen Reihenfolge stehen; das wiederholen, bis kein Tausch mehr
nötig ist. ⚠️ **Zum Tauschen zweier Variablen braucht man eine dritte (Hilfsvariable):**
`h = a; a = b; b = h`. Ohne sie überschreibt die erste Zuweisung den Wert, den man noch braucht.

**Rekursion** heißt: eine Funktion ruft sich selbst auf. Jede Rekursion braucht eine
**Abbruchbedingung**, sonst läuft sie unendlich (Stack Overflow).
Beispiel Fakultät: `n! = n × (n−1)!`, Abbruch bei `1! = 1`.
Werte: 1! = 1 · 2! = 2 · 3! = 6 · 4! = 24 · 5! = 120.
Dieselbe Aufgabe lässt sich **iterativ** mit einer Schleife lösen — in der Prüfung ist meist die
Schleifenvariante gefragt, weil sie sich im Schreibtischtest nachvollziehen lässt.

**Ganzzahldivision (DIV) und Restwertbildung (MOD, „Modulo“)**

- `17 DIV 5 = 3` — wie oft passt 5 vollständig in 17
- `17 MOD 5 = 2` — was bleibt übrig

⚠️ **MOD ist das Werkzeug für „Ziffern zerlegen" und „gerade oder ungerade".**
`zahl MOD 10` liefert die letzte Ziffer, `zahl DIV 10` schneidet sie ab — wiederholt angewandt
ergibt das die **Quersumme**. `zahl MOD 2 = 0` bedeutet: die Zahl ist gerade.

**Euklidischer Algorithmus (größter gemeinsamer Teiler), Subtraktionsmethode:**
Solange a ≠ b: den größeren durch die Differenz ersetzen. Übrig bleibt der ggT.
Beispiel 6 und 18 → 6/12 → 6/6 → **ggT = 6.**

**Fibonacci-Folge:** Jede Zahl ist die Summe ihrer beiden Vorgänger, Start 0 und 1:
0, 1, 1, 2, 3, 5, 8, 13, … Im Pseudocode werden dafür **zwei Merker** mitgeführt und in jedem
Durchlauf weitergeschoben.

**Eingabevalidierung:** Eine Eingabe wird geprüft, **bevor** mit ihr gerechnet wird. Das Muster
ist die fußgesteuerte Schleife: einlesen, prüfen, **wiederhole bis** der Wert im gültigen
Bereich liegt.

```
WIEDERHOLE
    Eingabe: zahl
    WENN zahl < 1 ODER zahl > 100 DANN
        Ausgabe: "Ungültige Eingabe"
    ENDE WENN
BIS zahl >= 1 UND zahl <= 100
Ausgabe: zahl
```

⚠️⚠️ **In diesem Muster stehen ZWEI Bedingungen, und sie sind zueinander negiert:**
* hinter **WENN** die **Ungültigkeits**bedingung — sie löst die Fehlermeldung aus
  (`zahl < 1 ODER zahl > 100`),
* hinter **BIS** die **Gültigkeits**bedingung — sie beendet die Schleife
  (`zahl >= 1 UND zahl <= 100`).

**`WIEDERHOLE … BIS` wiederholt so lange, BIS die Bedingung WAHR wird.** Wer dort die
Ungültigkeitsbedingung einsetzt, bekommt das genaue Gegenteil: Die Schleife endet bei einer
falschen Eingabe und läuft bei einer richtigen weiter.
⚠️ **Merke auch die Umkehrung der Verknüpfung:** aus `< 1 ODER > 100` wird `>= 1 UND <= 100`.
Aus ODER wird UND, wenn man negiert.

### Praxisbeispiel 1: Prozedural vs. OOP

**Prozedural (C):**
```c
int alter = 25;
char name[50] = "Max";
void person_info(char *n, int a) {
    printf("%s ist %d Jahre alt\n", n, a);
}
```

**Objektorientiert (Java):**
```java
class Person {
    public String name;
    public int alter;
    
    public void info() {
        System.out.println(name + " ist " + alter + " Jahre alt");
    }
}
Person max = new Person();
max.name = "Max";
max.alter = 25;
max.info();
```

### Praxisbeispiel 2: Compiler vs. Interpreter

**Compiler (Java):**
1. Quellcode → `javac` → Bytecode (.class)
2. JVM führt Bytecode aus (plattformunabhängig)
3. Schnell, aber Kompilierzeit

**Interpreter (Python):**
1. Quellcode → Python-Interpreter (zeilenweise)
2. Sofortige Ausführung und Fehlerdiagnose
3. Langsamer, aber flexibel

### Typische IHK-Aufgabenstellungen

- Unterscheiden Sie Compiler und Interpreter. Nennen Sie je zwei Beispielsprachen.
- Ein Programm soll 10x eine Datei verarbeiten. Welche Schleife nutzen Sie (for, while, do-while)?
- Erklären Sie die Unterschiede zwischen private, public und protected.
- Was ist ein Logikfehler? Nennen Sie ein Beispiel.

### Merksätze

- **Compiler = schnell, Interpreter = flexibel**
- **Prozedural = HOW, Objektorientiert = WHAT**
- **Kopfgesteuert prüft vor Ausführung, fußgesteuert nach**

### Selbsttest

**Frage 1:** Welche Schleife läuft mindestens 1x aus?
<details>
<summary>Lösung anzeigen</summary>
Die do-while-Schleife (fußgesteuert), da die Bedingung erst nach der Ausführung geprüft wird.
</details>

**Frage 2:** Kann ich auf ein Attribut mit `private` von außerhalb der Klasse zugreifen?
<details>
<summary>Lösung anzeigen</summary>
Nein, private Attribute sind nur innerhalb der Klasse sichtbar. Von außen sind Getter/Setter-Methoden nötig.
</details>

**Frage 3:** Unterscheiden Sie Prozedur und Funktion.
<details>
<summary>Lösung anzeigen</summary>
Eine Prozedur hat keinen Rückgabewert (void), eine Funktion gibt einen Wert zurück (int, String, etc.).
</details>

---

## 4.7 Programmierwerkzeuge und UML {#47-programmierwerkzeuge}

**Einordnung:** Praktische Modellierung und Visualisierung von Software. Taxonomiestufe: kennen und anwenden. Sehr hohe Prüfungsrelevanz (Diagramme, Pseudocode und Schreibtischtest werden in der Prüfung erwartet).

### Pseudocode für Kontrollstrukturen

Pseudocode ist eine sprachunabhängige Darstellung von Algorithmen:

**Beispiel: Verzweigung und Schleife**

```
Eingabe: Alter (in Jahren)

WENN Alter < 18 DANN
    Ausgabe: "Du bist minderjährig"
SONST WENN Alter >= 18 UND Alter < 65 DANN
    Ausgabe: "Du bist berufstätig"
SONST
    Ausgabe: "Du bist Rentner"
ENDE WENN

Summe = 0
FÜR i = 1 BIS 10 TUN
    Summe = Summe + i
    Ausgabe: "i = " + i + ", Summe = " + Summe
ENDE FÜR
```

### Struktogramm und Programmablaufplan

Beides sind **grafische Darstellungen eines Algorithmus** — der Unterschied liegt in der Form,
nicht im Inhalt.

**Programmablaufplan (PAP) nach DIN 66001** — Ablauf als Flussdiagramm mit Pfeilen:

| Symbol | Bedeutung |
|---|---|
| **Oval / abgerundetes Rechteck** | **Start/Ende (Grenzstelle)** |
| **Parallelogramm** | **Eingabe/Ausgabe** |
| **Rechteck** | **Anweisung (Operation)** |
| **Raute** | **Verzweigung (Entscheidung)** — zwei Ausgänge, „ja" und „nein" |

**Struktogramm (Nassi-Shneiderman)** — dieselbe Logik als ineinander geschachtelte Kästen ohne
Pfeile. Sequenz = Kästen untereinander, Verzweigung = geteiltes Dreieckfeld, Schleife = Rahmen
um den wiederholten Block.

⚠️ **Merkregel:** **PAP fließt, Struktogramm schachtelt.** Ein Struktogramm kann keinen Sprung
darstellen — genau das ist der Zweck: es erzwingt strukturierte Programmierung.

### UML (Unified Modeling Language)

#### Use-Case-Diagramm (Anwendungsfalldiagramm)

**Zweck:** Zeigt Interaktion zwischen Akteuren und Systemen

**Elemente:**
- **Akteur (Actor):** Benutzer oder externes System (Strichmännchen)
- **Anwendungsfall (Use Case):** Funktionalität (Oval)
- **include:** Starke Abhängigkeit (wird immer mit ausgeführt, gestrichelter Pfeil, Beschriftung "<<include>>")
- **extend:** Optionale Abhängigkeit (kann ausgeführt werden, gestrichelt, Label "<<extend>>")

**Beispiel: Online-Shop**

```
[Kunde] -----> (Artikel anzeigen)
  |
  +-----> (Artikel kaufen) 
            |
            +--- <<include>> ---> (Zahlung verarbeiten)
            |
            +--- <<extend>> ---> (Rabatt anwenden) [optional]
  
[Admin] -----> (Benutzer verwalten)
```

#### Klassendiagramm

**Zweck:** Struktur von Klassen und ihre Beziehungen darstellen

**Syntax:**

```
+------------------+
|    ClassName     |
+------------------+
| + öffentlich: int|
| - privat: String|
| # geschützt: bool|
+------------------+
| + methode1()     |
| - methode2(): int|
+------------------+
```

**Sichtbarkeit:**
- `+` public — von überall sichtbar
- `-` private — nur innerhalb der eigenen Klasse
- `#` protected — zusätzlich in abgeleiteten Klassen
- `~` package — innerhalb desselben Pakets

**Syntax laut Prüfungskatalog:**
- Attribut: `Sichtbarkeit Attributname : Typ {Eigenschaften}`
- Methode: `Sichtbarkeit Methodenname( parameter1 : Typ, … ) : Rückgabetyp {Eigenschaften}`
- Eigenschaften sind z. B. `{static, final}`

**Besondere Klassen:**
- **Abstrakte Klasse:** Name *kursiv* und mit `{abstract}` gekennzeichnet; sie kann nicht selbst
  instanziiert werden und enthält mindestens eine abstrakte Methode.
- **Schnittstelle:** mit `<<interface>>` über dem Namen; sie schreibt nur Methodenköpfe vor.
  Eine Klasse, die sie erfüllt, wird mit einer **gestrichelten** Linie und leerer Pfeilspitze
  verbunden (Implementierung) — im Unterschied zur durchgezogenen Linie bei der Vererbung.

**Beziehungen:**
- **Vererbung (Generalisierung):** Leere Pfeilspitze nach oben (z. B. Auto → Fahrzeug)
- **Assoziation:** Verbindungslinie (z. B. Fahrer —— Auto), ggf. mit Pfeil für Navigationsrichtung; Multiplizitäten an den Enden (1, *, 0..1)
- **Komposition:** Volle Raute (z. B. Haus ◆ Zimmer, starke Abhängigkeit)
- **Aggregation:** Leere Raute (z. B. Team ◇ Spieler, schwache Abhängigkeit)

**Multiplizitäten:**
- `1` genau eine
- `*` beliebig viele (0..*)
- `0..1` keine oder eine
- `1..*` mindestens eine

**Beispiel: E-Commerce-Klassen**

```
       +-------+
       |Product|
       +-------+
         ^  |
         |  | kauft (0..*)
         |  |
      +--+--+----+
      |  Order   |
      +----------+
      | - orderId|
      | - date   |
      +----------+
         ^ (1)
         | erstellt von
      +-----+
      |User |
      +-----+
```

#### Aktivitätsdiagramm

**Zweck:** Ablauf von Prozessen, Entscheidungen, parallele Aktionen

**Elemente:**
- **Startknoten:** Kreis mit Punkt (●)
- **Endknoten:** Kreis mit doppelter Linie (⊚)
- **Aktion:** Rechteck mit abgerundeten Ecken
- **Entscheidung/Verzweigung:** Raute
- **Parallele Abläufe:** Dicke Balken (Synchronisierung)

**Beispiel: Bestellprozess**

```
          ●
          |
          v
    [Artikel auswählen]
          |
          v
       Raute (Zahlungsart?)
       /              \
   (online)        (Lastschrift)
     /                  \
    v                    v
[Kreditkarte]      [Kontoinfo]
    \                  /
     v                v
 [Bestellung verarbeiten]
    |
    v
   ⊚
```

### Bildschirmausgabemasken (UI-Entwurf)

**Zweck:** Visualisierung von Benutzeroberflächen vor Implementierung

**Prinzipien:**
- **Softwareergonomie:** Einfach, intuitiv, keine Überladung
- **Corporate Identity:** Farben, Logos, Schriftzüge des Unternehmens
- **Barrierefreiheit:** Große Schriften, hoher Kontrast, Tastaturzugriff

**Beispiel: Login-Maske**

```
+=========================+
|  MyCompany Login        |
+=========================+
| [Logo]                  |
|                         |
| Benutzername: [____]    |
| Passwort:     [____]    |
|                         |
|  [Anmelden]  [Zurück]   |
+=========================+
```

**Die Grundsätze der Dialoggestaltung nach ISO 9241-110**

Die Norm nennt **sieben** Grundsätze dafür, wann eine Benutzeroberfläche gebrauchstauglich ist —
alle sieben werden geprüft:

| Grundsatz | Bedeutung | Beispiel aus dem Maskenentwurf |
|---|---|---|
| **Aufgabenangemessenheit** | Der Dialog stellt genau die Funktionen bereit, die für die Aufgabe nötig sind — **ohne unnötige Schritte** | keine Pflichtfelder, die für den Vorgang belanglos sind |
| **Selbstbeschreibungsfähigkeit** | Verständlich **ohne Vorwissen**, jeder Schritt erklärt sich selbst | zu jedem Feld ein Hinweistext mit dem erwarteten Format |
| **Erwartungskonformität** | einheitlich und **konsistent** | der OK-Button steht in allen Masken an derselben Stelle |
| **Steuerbarkeit** | Der Nutzer bestimmt **Ablauf und Tempo** | jeder Schritt lässt sich rückgängig machen |
| **Fehlertoleranz** | Ein Fehler führt **nicht zum Abbruch**, sondern lässt sich korrigieren | ein falsches Datum erzeugt eine korrigierbare Meldung |
| **Individualisierbarkeit** | anpassbar an den einzelnen Nutzer | erfahrene Nutzer verwenden Tastenkürzel statt Menüs |
| **Lernförderlichkeit** | unterstützt beim **Erlernen** des Systems | ein Assistent führt beim ersten Mal durch den Vorgang, Tastenkürzel werden im Menü mit angezeigt |

⚠️ **Die häufigste Prüfungsfrage betrifft die Fehlermeldung.** Eine Meldung wie „Fehler 37"
nennt weder Ursache noch Lösungsweg — das verletzt die **Selbstbeschreibungsfähigkeit**, nicht
die Fehlertoleranz. **Fehlertoleranz heißt: der Fehler ist korrigierbar. Selbstbeschreibungs-
fähigkeit heißt: der Nutzer versteht, was zu tun ist.**

⚠️ **Aufgabenangemessenheit meint NICHT „möglichst viele Hilfetexte"** und auch nicht
„auf jedem Gerät gleich aussehen" — sondern **möglichst wenige Schritte für die Aufgabe**.

**Barrierefreiheit in der Maske** gehört dazu: ausreichender Kontrast, skalierbare Schrift,
vollständige **Tastaturbedienbarkeit** ohne Maus, Beschriftungen, die ein Screenreader vorlesen
kann (siehe auch Modul 03, Abschnitt 3.3).

### Fehler in Quellcode finden und Schreibtischtest

**Formaler Fehler (Syntaxfehler):**
```java
int x = 5    // Fehler: Semikolon fehlt
```

**Logischer Fehler:**
```java
int summe = 0;
for (int i = 1; i <= 5; i++) {
    summe = i;  // Fehler: sollte summe += i sein
}
// Ergebnis: summe = 5 (statt 15)
```

### Schreibtischtest-Beispiel (ZWINGEND!)

Der Schreibtischtest wird meist an einer **Zählschleife** (FÜR-Schleife) geführt: Die Zahl der
Durchläufe steht vorher fest, deshalb lässt sich jede Zeile der Tabelle nachvollziehen. Bei
verschachtelten oder bedingungsgesteuerten Schleifen wird jede Wiederholung einzeln eingetragen.

**Pseudocode-Programm:**

```
Eingabe: n = 3

Summe = 0
FÜR i = 1 BIS n TUN
    Summe = Summe + i * 2
    Ausgabe: i, Summe
ENDE FÜR

Ausgabe: "Finale Summe: " + Summe
```

**Schreibtischtest-Tabelle:**

| Iteration | i | Bedingung (i <= n) | Summe (alt) | i*2 | Summe (neu) | Ausgabe |
|-----------|---|---|---|---|---|---|
| Start | - | - | 0 | - | 0 | - |
| 1 | 1 | 1 <= 3? JA | 0 | 2 | 0+2=2 | "1, 2" |
| 2 | 2 | 2 <= 3? JA | 2 | 4 | 2+4=6 | "2, 6" |
| 3 | 3 | 3 <= 3? JA | 6 | 6 | 6+6=12 | "3, 12" |
| 4 | 4 | 4 <= 3? NEIN | - | - | - | Schleife endet |
| Ende | - | - | - | - | 12 | "Finale Summe: 12" |

**Ergebnis:** Finale Summe = 12

### Praxisbeispiel 1: Use-Case-Diagramm für Krankenhaus

```
[Patient] -----> (Termin buchen)
  |
  +-----> (Behandlung)
            |
            +--- <<include>> ---> (Rechnung)

[Arzt] -----> (Diagnose stellen)
       |
       +-----> (Rezept ausstellen)
                 |
                 +--- <<extend>> ---> (Nebenwirkungswarnung) [optional]

[Admin] -----> (Benutzer verwalten)
```

### Praxisbeispiel 2: Klassendiagramm für Bibliothek

```
+---------+        +---------+
| Benutzer|--------|  Buch   |
+---------+        +---------+
| - id    |        | - isbn  |
| - name  | borgt  | - titel |
+---------+ -----> +---------+
                   | - autor |
                   | - jahr  |
                   +---------+
     (0..*)          (1..*)
```

### Typische IHK-Aufgabenstellungen

- Erstellen Sie ein Use-Case-Diagramm für ein Geldautomaten-System (Kunde, Admin, Netzwerk).
- Zeichnen Sie ein Klassendiagramm mit Vererbung: Fahrzeug, Auto, Motorrad.
- Beschreiben Sie den Unterschied zwischen include und extend im Use-Case-Diagramm.
- Führen Sie einen Schreibtischtest für einen gegebenen Pseudocode durch.
- Entwerfen Sie eine Benutzeroberfläche (UI-Mockup) für eine Buchungssoftware.

### Merksätze

- **Use-Case: Wer macht Was mit dem System?**
- **Klasse: Was sind die Eigenschaften und Fähigkeiten?**
- **Aktivität: Wie läuft der Prozess ab?**
- **Schreibtischtest: Variable Schritt für Schritt nachvollziehen**

### Selbsttest

**Frage 1:** Unterscheiden Sie include und extend im Use-Case-Diagramm.
<details>
<summary>Lösung anzeigen</summary>
include: Starke, obligatorische Abhängigkeit (muss immer ausgeführt werden). extend: Optionale, bedingte Abhängigkeit (kann ausgeführt werden).
</details>

**Frage 2:** Was bedeutet die Multiplizität `0..*` in einem Klassendiagramm?
<details>
<summary>Lösung anzeigen</summary>
Keine oder beliebig viele (unbegrenzte Anzahl). Beispiel: Ein Kunde kann 0 bis unendlich viele Bestellungen haben.
</details>

**Frage 3:** Sie erstellen ein Aktivitätsdiagramm. Wie notieren Sie parallele Abläufe?
<details>
<summary>Lösung anzeigen</summary>
Mit dicken Balken (Synchronisierungsbalken) oben und unten. Sie teilen den Fluss in mehrere parallele Pfade und synchronisieren ihn am Ende wieder.
</details>

---

## 4.8 Grundlagen relationaler Datenbanken {#48-datenbanken}

**Einordnung:** Verständnis von Datenmodellierung für Anwendungssysteme. Taxonomiestufe: Verstehen und Anwenden. Mittlere Prüfungsrelevanz (AP2 behandelt SQL und Normalformen).

### ER-Modell (Entity-Relationship-Modell)

Das ER-Modell dient zur konzeptionellen Modellierung von Datenbanken.

**Elemente:**

- **Entität (Entity):** ein konkretes Ding oder ein Begriff (z. B. Kunde, Produkt, Bestellung)
  - Darstellung: Rechteck

- **Attribut:** Eigenschaft einer Entität (z. B. Name, Alter, Preis)
  - Darstellung: Oval, verbunden mit Entität

- **Beziehung (Relationship):** Verbindung zwischen Entitäten (z. B. „Kunde kauft Produkt")
  - Darstellung: Raute, verbunden mit Entitäten

- **Kardinalität (Multiplizität):** Wie viele Elemente einer Entität können sich auf ein Element einer anderen Entität beziehen?

### Kardinalitäten: 1:1, 1:n, m:n

| Kardinalität | Bedeutung | Beispiel |
|---|---|---|
| **1:1** | Ein Element A bezieht sich auf genau ein Element B und umgekehrt | Person — Personalausweis (eine Person hat einen Ausweis, ein Ausweis gehört einer Person) |
| **1:n** | Ein Element A bezieht sich auf mehrere Elemente B, aber ein B gehört nur zu einem A | Kunde — Bestellung (ein Kunde viele Bestellungen, aber eine Bestellung nur einem Kunden) |
| **m:n** | Viele Elemente A beziehen sich auf viele Elemente B | Schüler — Kurs (ein Schüler nimmt an vielen Kursen teil, ein Kurs hat viele Schüler) |

**Notation (Chen-Notation):**
```
1 : n  →  1 ----- n (1 auf eine Seite, n auf die andere)
m : n  →  m -------- n
```

### Schlüssel und Normalisierung

**Primärschlüssel:** Der eindeutige Bezeichner einer Zeile. Zwei Bedingungen, beide zwingend:
**eindeutig pro Zeile** und **nicht leer (NOT NULL)**.

**Fremdschlüssel:** Ein Feld, das auf den Primärschlüssel einer **anderen** Tabelle zeigt und so
die Beziehung herstellt. Er sichert die **referenzielle Integrität**: Es lässt sich kein Auftrag
zu einem Kunden anlegen, den es nicht gibt.

⚠️ **m:n-Beziehungen lassen sich mit Fremdschlüsseln allein NICHT abbilden.** Ein Produkt kommt
in vielen Bestellungen vor, eine Bestellung enthält viele Produkte. Die Lösung ist eine
**Zwischentabelle** (auch Verknüpfungs- oder Beziehungstabelle), die zwei Fremdschlüssel führt —
je einen auf Produkt und auf Bestellung. **Aus einer m:n-Beziehung werden so zwei 1:n-Beziehungen.**

**Normalisierung** heißt: Daten so aufteilen, dass nichts doppelt gespeichert wird. Redundanz
ist gefährlich, weil sie zu **Anomalien** führt — ändert man eine Kundenadresse an einer Stelle
und an der anderen nicht, widersprechen sich die Daten.

| Normalform | Regel in einem Satz |
|---|---|
| **1. NF** | Jedes Feld enthält nur **einen** Wert — keine Listen in einer Zelle |
| **2. NF** | 1. NF **und** jedes Nichtschlüsselfeld hängt vom **ganzen** Primärschlüssel ab |
| **3. NF** | 2. NF **und** kein Nichtschlüsselfeld hängt von einem **anderen Nichtschlüsselfeld** ab |

**Merksatz zur 3. NF:** *Jedes Feld beschreibt den Schlüssel, den ganzen Schlüssel und nichts
als den Schlüssel.*

### Praxisbeispiel 1: Online-Shop (Kunde–Auftrag–Produkt)

**Entitäten und Attribute:**
- **Kunde:** KundenID, Name, Email, Adresse
- **Auftrag:** AuftragID, AuftragDatum, Gesamtpreis, KundenID
- **Produkt:** ProduktID, Name, Preis, Lagerbestand
- **Auftragsposition:** Zwischentabelle zur Auflösung der m:n-Beziehung zwischen Auftrag und Produkt (AuftragID, ProduktID, Menge)

**Beziehungen:**
- Kunde — Auftrag: **1:n** (ein Kunde, viele Aufträge)
- Auftrag — Produkt: **m:n** (viele Produkte in einem Auftrag, ein Produkt in vielen Aufträgen)

**ER-Diagramm:**

```
       +-------+  1        n  +-------+
       |Kunde  |-------------|Auftrag|
       +-------+             +-------+
       |KundenID|            |AuftragID|
       |Name   |             |Datum  |
       |Email  |             |Summe  |
       +-------+             +-------+
                                  |
                                  | m:n
                                  |
                             +----------+
                             |Produkt   |
                             +----------+
                             |ProduktID |
                             |Name      |
                             |Preis     |
                             +----------+
```

### Praxisbeispiel 2: Bibliothek (Benutzer–Ausleihe–Buch)

**Entitäten:**
- **Benutzer:** UserID, Name, Adresse, Telefon
- **Buch:** BuchID, Titel, Autor, ISBN
- **Ausleihe:** AusleihID, UserID, BuchID, AusleihDatum, RückgabeDatum

**Beziehungen:**
- Benutzer — Ausleihe: **1:n** (ein Benutzer, viele Ausleihen)
- Buch — Ausleihe: **1:n** (ein Buch kann in vielen Ausleihen vorkommen — nacheinander; jede Ausleihe betrifft genau ein Buch)

### Typische IHK-Aufgabenstellungen

- Erstellen Sie ein ER-Modell für ein Flugverwaltungssystem (Flughafen, Flugzeug, Flug, Passagier).
- Unterscheiden Sie die Kardinalitäten 1:1, 1:n und m:n mit je einem Beispiel.
- Erklären Sie, warum m:n-Beziehungen durch eine Zwischentabelle aufgelöst werden.
- Für einen Online-Shop: Modellieren Sie Kunde, Bestellung, Produkt.

### Merksätze

- **1:1 = eindeutig, 1:n = hierarchisch, m:n = flexibel (Zwischentabelle)**
- **ER vor SQL:** Modell erst konzeptionell — SQL kommt erst in der AP2

### Selbsttest

**Frage 1:** Erklären Sie die Kardinalität 1:n.
<details>
<summary>Lösung anzeigen</summary>
Ein Element auf der einen Seite kann sich auf mehrere Elemente der anderen Seite beziehen, aber umgekehrt nur auf ein Element. Beispiel: Ein <strong>Klassenlehrer</strong> betreut viele Schüler, aber jeder Schüler hat genau einen Klassenlehrer.
<br>⚠️ Achtung: „Ein Lehrer <em>unterrichtet</em> viele Schüler" wäre <strong>m:n</strong> — ein Schüler wird ja auch von mehreren Lehrern unterrichtet.
</details>

**Frage 2:** Warum ist m:n eine Beziehung, die durch eine Zwischentabelle aufgelöst wird?
<details>
<summary>Lösung anzeigen</summary>
In einem Relationalen DB-System (Tabellen) können m:n-Beziehungen nicht direkt dargestellt werden. Eine Zwischentabelle speichert die Paare (z. B. SchülerID, KursID) und erzeugt zwei 1:n-Beziehungen.
</details>

**Frage 3:** Geben Sie ein Beispiel für eine 1:1-Beziehung.
<details>
<summary>Lösung anzeigen</summary>
Person — Fahrerlaubnis: Eine Person hat eine Fahrerlaubnis, eine Fahrerlaubnis gehört einer Person. Oder: Patient — Krankenakte.
</details>

---

## Abschluss und Lernziele

Dieses Modul hat die acht zentralen Themen des Fragenkomplexes 04 der IHK AP1 Systemintegration abgedeckt:

- ✓ IT-Systeme konzeptionieren, konfigurieren, testen, dokumentieren (4.1)
- ✓ Hardware bedarfsgerecht auswählen (4.2)
- ✓ Software bedarfsgerecht auswählen (4.3)
- ✓ Urheberrecht und Lizenzmodelle kennen (4.4)
- ✓ Installation, Konfiguration, Netzwerk (4.5)
- ✓ Programmiersprachen kennen und einordnen (4.6)
- ✓ Programmierwerkzeuge: Pseudocode, UML, Schreibtischtest (4.7)
- ✓ Grundlagen relationaler Datenbanken: ER-Modelle (4.8)

**Vorbereitung auf die Prüfung:**
- Üben Sie Schreibtischtests und UML-Diagramme
- Lernen Sie DHCP-DORA-Ablauf auswendig
- Merken Sie sich RFC-1918-Bereiche und IPv6-Grundlagen
- Erstellen Sie ER-Modelle für verschiedene Szenarien

**Viel Erfolg bei der IHK-Prüfung!**
