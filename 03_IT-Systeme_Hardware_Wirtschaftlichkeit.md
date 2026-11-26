# Modul 03 – IT-Systeme, Hardware, Wirtschaftlichkeit

**Fragenkomplex:** IHK-Prüfungskatalog 2. Auflage 2024, Fragenkomplex 03  
**Lernfelder:** 2 und 3  
**Prüfungsteil:** AP1 (Abschlussprüfung Teil 1)  
**Handlungsanforderungen laut Katalog:** kennen, unterscheiden, identifizieren, zuordnen, bestimmen, analysieren, beurteilen

## Modulübersicht

Dieses Modul behandelt die Kompetenz, marktgängige IT-Systeme und kundenspezifische Lösungen beurteilen zu können. Im Fokus stehen funktionale, ökonomische und ökologische Aspekte von Hardware und Software, die Identifikation von Einsatzbereichen, die Analyse von Leistungsfähigkeit und Energieeffizienz sowie die Beurteilung der Wirtschaftlichkeit. Absolute Tabus: RAID und SQL gehören zu AP2, nicht AP1.

### Inhaltsverzeichnis
1. [3.1 Marktgängige IT-Systeme kennen, unterscheiden und beurteilen](#31-marktgängige-it-systeme)
2. [3.2 Typische IT-Systeme und Einsatzbereiche identifizieren](#32-typische-it-systeme-und-einsatzbereiche)
3. [3.3 Leistungsfähigkeit und Energieeffizienz bestimmen und analysieren](#33-leistungsfähigkeit-und-energieeffizienz)
4. [3.4 Wirtschaftlichkeit von IT-Systemen beurteilen](#34-wirtschaftlichkeit-von-it-systemen)

---

## 3.1 Marktgängige IT-Systeme kennen, unterscheiden und beurteilen {#31-marktgängige-it-systeme}

**Einordnung:** Dies ist eine zentrale Kompetenz des Fragenkomplexes 03 (Taxonomiestufen 2–3). Die Fähigkeit, Hard- und Software nach funktionalen, ökonomischen und ökologischen Kriterien zu bewerten, ist Grundlage für alle weiteren Module und der Kundenberatung.

### Beurteilungskriterien für IT-Systeme

| Kriterium | Aspekt | Beispiele |
|-----------|--------|----------|
| **Funktional** | Erfüllung von Anforderungen | Leistung, Kompatibilität, Skalierbarkeit |
| **Ökonomisch** | Kosteneffizienz | Anschaffungs-, Betriebskosten, ROI |
| **Ökologisch** | Umweltverträglichkeit | Energieverbrauch, Recyclingfähigkeit, Emissionen |

### Hardwareprodukte

**CPU (Central Processing Unit – Zentralprozessor)**  
Die CPU ist die **zentrale Recheneinheit** eines Computers. Sie besteht nach von Neumann aus **Rechenwerk** (ALU – rechnet und vergleicht) und **Steuerwerk** (holt Befehle, entschlüsselt sie, steuert den Ablauf). ⚠️ **Das Rechenwerk ist ein Teil der CPU, nicht ihr Synonym.** Beurteilungskriterien: Taktfrequenz (GHz), Anzahl Kerne und Threads, Cache-Größe, Stromverbrauch (W), Architektur (x86/ARM), Wärmeleistung (TDP – Thermal Design Power).

**Motherboard (Hauptplatine)**  
Verbindet alle Komponenten und verwaltet Datenfluss sowie Stromversorgung. Wichtig: Chipset-Generation, Steckplätze (CPU-Socket, RAM-Slots, PCIe), BIOS/UEFI-Funktionen, Erweiterbarkeit.

**Speicher (RAM – Random Access Memory)**  
Arbeitsspeicher für aktive Daten und Programme. Beurteilung nach: Kapazität (GB), Typ (DDR4/DDR5), Geschwindigkeit (MHz), Latenz, ECC-Unterstützung (wichtig für Server).

**Datenspeicher**  
- **SSD (Solid State Drive):** Speichert Daten ohne bewegliche Teile, sehr schnell (IOPS, Durchsatz MB/s), geringerer Stromverbrauch, teurer pro GB als HDD.
- **HDD (Hard Disk Drive):** Magnetische Speicherung, langsamer aber kapazitätsreich und kostengünstig. Beurteilung: Umdrehungen (U/min), Zugriffszeit (ms), MTBF (Mean Time Between Failures).

**Netzteile (Power Supply Unit – PSU)**  
Wandelt Wechselstrom in Gleichstrom um. Beurteilung: Nennleistung (Watt), Wirkungsgrad (η in %), Modularität, Sicherheitszertifikate (80 PLUS), Redundanz bei Servern.

**Grafikkarte (GPU – Graphics Processing Unit)**  
Verarbeitet grafische Daten und entlastet die CPU. Wichtig: VRAM-Kapazität (GB), Schnittstellen (DisplayPort, HDMI), Stromverbrauch, bei Gaming/CAD: Speicherbandbreite (GB/s).

**Peripheriegeräte**  
Drucker, Scanner, Tastaturen, Maus: Beurteilung nach Zuverlässigkeit, Kompatibilität, Ergonomie, Verfügbarkeit von Treibern und Wartungsteilen.

**Sensoren und Aktoren**  
IoT-Geräte (Internet of Things), Bewegungsmelder, Temperaturfühler: Wichtig ist die Kommunikationsfähigkeit (Bluetooth, Zigbee, LoRaWAN), Messgenauigkeit, Batterielaufzeit. Ein **Sensor** erfasst eine physikalische Größe (z. B. Temperatur, Bewegung, Feuchte) und meldet sie als Messwert; ein **Aktor** setzt ein Steuersignal in eine Handlung um (z. B. Relais, Stellmotor, Lüfter, Türöffner).

**Netzwerkkomponenten**
- **WLAN-Router:** Verteilt drahtlose Netzwerksignale. Beurteilung: Frequenzband (2,4 GHz, 5 GHz, 6 GHz), Datenrate (Standard), Reichweite, QoS (Quality of Service)-Funktionen.
- **Switch (Netzwerk-Switch):** Verbindet Geräte in LAN, leitet Frames nach MAC-Adresse weiter. Wichtig: Anzahl Ports, Durchsatz (Gbps), VLAN-Unterstützung, PoE (Power over Ethernet).
- **Gateway:** Router an der Grenze zweier Netze, konvertiert Protokolle. Beurteilung: Durchsatzfähigkeit, VPN-Funktionen, Firewall-Leistung, Redundanz.
- **Access Point (AP):** Wireless-Zugriffspunkt, erweitert WLAN-Reichweite. Wichtig: Standard (802.11n/ac/ax), Antennenkonfiguration, PoE-Verfügbarkeit.

### Serverraum und 19-Zoll-Rack

Server, Switches und Speicher stehen nicht auf Tischen, sondern in einem **19-Zoll-Rack**
(Serverschrank). Die Bezeichnung stammt von der Einbaubreite der Frontblenden.

**Die Höheneinheit (HE, englisch U):** Die Bauhöhe wird in **Höheneinheiten** gemessen.
**1 HE = 44,45 mm** (Standard IEC 60297). Ein Rack mit 42 HE bietet also gut 1,86 m nutzbare
Einbauhöhe.

⚠️ **Rechenaufgaben dazu sind reine Subtraktion:** belegte HE addieren, von der nutzbaren Höhe
abziehen. Ein Patchpanel mit 2 HE, zwei Switches mit je 1 HE, ein Server mit 4 HE und eine USV
mit 3 HE belegen 11 HE — in einem 42-HE-Schrank bleiben **31 HE** frei.

**Typische Einbaureihenfolge von oben nach unten:**

| Position | Komponente | Warum dort |
|---|---|---|
| oben | **Patchpanel** | Kabelmanagement, kurze Wege zu den Switches |
| | **Switch** | direkt unter dem Patchpanel |
| | **Server** | Mitte |
| unten | **USV** | ⚠️ **schwerste Komponente nach unten — Kippsicherheit** |

**Was ein Serverraum zusätzlich braucht:**

- **USV (unterbrechungsfreie Stromversorgung)** — überbrückt Stromausfälle und fährt die Systeme
  kontrolliert herunter. ⚠️ **Nicht mit einem Notstromaggregat verwechseln:** Die USV wirkt
  **sofort** aus Akkus, das Aggregat braucht Anlaufzeit und ist für lange Ausfälle gedacht.
- **Klimatisierung** — Server erzeugen Abwärme; ohne Kühlung drosseln oder sterben sie.
  Ein Deckenventilator genügt dafür nicht.
- **Zutrittskontrolle, Brandfrüherkennung, Kabelmanagement.**

### Strukturierte Verkabelung

Die Verkabelung eines Firmengeländes wird in **drei Bereiche** gegliedert — von außen nach innen:

| Bereich | Was er verbindet | Verteiler |
|---|---|---|
| **Primärbereich** | Gebäude untereinander (Geländeverkabelung) | **Standortverteiler** |
| **Sekundärbereich** | Etagen innerhalb eines Gebäudes (Steigbereich) | **Gebäudeverteiler** |
| **Tertiärbereich** | Etage bis zum Arbeitsplatz | **Etagenverteiler** |

⚠️ **Merkrichtung: Primär ist das Größte, Tertiär das Kleinste.** Der Primärbereich überbrückt
die längsten Strecken — dort liegt in der Regel Glasfaser.

**Die Strecke vom Arbeitsplatz zum aktiven Gerät** besteht aus drei Gliedern:

**Anschlussdose (TO) am Arbeitsplatz → festverlegtes Kabel → Patchpanel im Etagenverteiler →
Patchkabel → Switch.**

⚠️ **Das Patchpanel ist passiv** — es rangiert nur Kabel und trifft keine Entscheidung. Aktiv
ist erst der Switch. Wer im Prüfungsbild das „aktive Gerät" sucht, meint den Switch.

### Netzwerktopologien

Die **Topologie** beschreibt, **wie** die Geräte eines Netzes miteinander verbunden sind. Sie
entscheidet nicht über die Geschwindigkeit, sondern über zwei andere Fragen: **Was passiert bei
einem Ausfall, und wie viel Kabel braucht man?**

| Topologie | Aufbau | Bei Ausfall | Heute |
|---|---|---|---|
| **Stern** | Alle Geräte hängen einzeln an einem zentralen Verteiler (Switch) | **Ein Endgerät oder Kabel fällt aus → nur dieses Gerät ist betroffen. Fällt der zentrale Switch aus → steht das ganze Netz.** | **LAN-Standard**, praktisch jedes Büronetz |
| **Bus** | Alle Geräte hängen an **einer** durchgehenden Leitung | **Ein Kabelbruch legt das ganze Segment lahm** | veraltet (Koaxialnetze), nur noch historisch und im Feldbus |
| **Ring** | Geräte sind kreisförmig verbunden, Daten laufen von Station zu Station | Ein unterbrochener Ring trennt das Netz — **Gegenmittel: Doppelring** | selten im LAN, noch im Backbone/WAN |
| **Mesh (vermascht)** | Jeder Knoten ist mit mehreren anderen verbunden | **Höchste Ausfallsicherheit**, es gibt Ausweichwege | WLAN-Mesh, Backbone; hoher Verkabelungsaufwand |

### Netzwerktopologien vertieft (AP2)

> **AP2-Stoff** (Prüfungskatalog Teil 2: „Netzwerkkonzepte (-topologien, -infrastrukturen)“, „Geeignete Topologien
> und Übertragungswege bewerten“) – hier für die Klausur im LF3.

**Baum-Topologie:** Mehrere Sterne sind **hierarchisch** über Verteiler verbunden – typisch ein **Kern-Switch** an der
Wurzel und je Etage ein **Etagen-Switch**. Fällt ein Etagen-Switch aus, ist nur **sein Ast** (die Geräte dieser Etage)
getrennt; fällt die **Wurzel** aus, ist das ganze Netz betroffen. Ohne zweite Verkabelung gibt es keinen Ersatzweg.

**Physische und logische Topologie:** Die **physische** Topologie beschreibt, wie die **Leitungen** liegen; die
**logische**, wie die **Daten tatsächlich fließen**. Beispiel **Hub**: physisch ein **Stern** (alle Geräte hängen am
Hub), logisch ein **Bus**, weil der Hub jedes Signal an alle Ports weitergibt – alle teilen sich ein Medium.

**Vermaschung:** Im **vollvermaschten** Netz ist jeder Knoten mit jedem direkt verbunden. Zahl der Verbindungen:
**n × (n − 1) ÷ 2** – bei 5 Routern 5 × 4 ÷ 2 = **10**, bei 10 Routern **45**. Deshalb wird meist nur **teilvermascht**:
wichtige Knoten bekommen redundante Wege. **WLAN-Mesh:** mehrere Zugangspunkte sind **per Funk** über mehrere Wege
verbunden; fällt ein Knoten aus, suchen die anderen einen neuen Weg.

**Ring:** Ein einfacher Ring ist nach einer Unterbrechung offen. Beim **Doppelring** läuft ein zweiter Ring in
**Gegenrichtung**; an der Bruchstelle wird der Verkehr umgeleitet.

**Netzarten nach Ausdehnung:**

| Netzart | Ausdehnung | Beispiel |
|---|---|---|
| **PAN** (Personal Area Network) | wenige Meter rund um eine Person | Bluetooth |
| **LAN** (Local Area Network) | ein Gebäude oder Firmengelände | Büronetz |
| **MAN** (Metropolitan Area Network) | eine Stadt oder Region | Stadtnetz |
| **WAN** (Wide Area Network) | Länder und Kontinente | Standortvernetzung |
| **GAN** (Global Area Network) | weltweit | über Satelliten |

**Topologie bewerten** – drei Fragen: **Was fällt bei einem Ausfall aus** (Single Point of Failure)? **Wie viel Kabel
und Hardware kostet es?** **Wie leicht ist es zu erweitern und zu diagnostizieren?**
- Der **Stern** ist LAN-Standard: Ein Kabelfehler betrifft nur ein Gerät, neue Geräte lassen sich ohne Unterbrechung
  anschließen, Fehler lassen sich einem Port und Kabel zuordnen. Er braucht **mehr Kabel als ein Bus**, und der
  zentrale Switch bleibt der Schwachpunkt.
- **Ausfälle im Stern:** Patchkabel oder Netzwerkkarte defekt → nur dieses Gerät ist offline. Zentraler Switch ohne
  Strom → kein Gerät erreicht ein anderes. Router zum Internet ausgefallen → das LAN arbeitet intern weiter, nur das
  Internet fehlt (sofern Dienste wie DHCP nicht auf dem Router laufen).
- Wenn **Ausfallsicherheit vor Kosten** geht (Produktion, Steuerungsnetze): eine **(teil)vermaschte Struktur** mit
  redundanten Wegen zwischen den Switches – ohne Single Point of Failure.

### Die Stern-Topologie im Detail

Ein typisches Büronetz besteht aus vier Rollen:

- **Zentraler Switch** — verbindet alle Geräte im LAN miteinander
- **Client-PCs** — die Arbeitsplätze, jeder mit eigenem Kabel zum Switch
- **Server** — ebenfalls am Switch, nur mit anderer Aufgabe
- **Router** — das einzige Gerät, das **das LAN mit dem Internet** verbindet

⚠️ **Der zentrale Switch ist der Single Point of Failure.** Genau das ist der Preis der
Stern-Topologie: Sie ist robust gegen einzelne Kabelbrüche und empfindlich gegen den Ausfall
der Mitte. **Gegenmittel in der Praxis:** ein zweiter Switch (Redundanz) und eine
unterbrechungsfreie Stromversorgung für den Verteilerschrank.

⚠️ **Nicht verwechseln:** Fällt ein **PC** aus, merkt das Netz nichts. Fällt der **Switch** aus,
können auch die intakten PCs nicht mehr miteinander reden — obwohl sie selbst funktionieren.

### Netzwerkredundanz und USV

> **Klausur 3 (LF3).** SPOF, Redundanz und USV sind AP1-Stoff; Spanning Tree, Link-Bündelung, Gateway-Redundanz
> und USV-Bauarten gehen darüber hinaus (AP2).

**Single Point of Failure (SPOF):** eine Komponente **ohne Ersatz**, deren Ausfall das Ganze stilllegt.
**Redundanz** heißt: wichtige Komponenten und Wege sind **mehrfach** vorhanden, und bei Ausfall übernimmt der Ersatz
**automatisch**. ⚠️ Redundanz wirkt nur gegen Ursachen, die **nicht alle Kopien zugleich** treffen: Zwei Core-Switches
an **derselben USV** fallen bei leerem Akku **gemeinsam** aus – dann ist die USV der SPOF.

| Ebene | Maßnahme | Was sie abfängt |
|---|---|---|
| Wege | jeder Access-Switch mit je einem Uplink zu **beiden** Core-Switches (Dual-Homing) | Ausfall eines Core-Switches oder Kabels |
| Wege | **Link Aggregation (LACP)**: mehrere Leitungen als eine logische Verbindung | Ausfall einer Leitung, dazu mehr Bandbreite |
| Schleifen | **Spanning Tree (STP, schneller: RSTP)** blockiert redundante Ports logisch, gibt sie bei Ausfall frei | Broadcast-Sturm durch Schleifen |
| Geräte | zwei gleichwertige Core-Switches, ggf. **Stacking** (mehrere Switches wie ein Gerät) | Geräteausfall, Wartung |
| Gateway | **VRRP/HSRP**: virtuelle Gateway-Adresse, die der zweite L3-Switch/Router übernimmt | Ausfall des Standardgateways |
| Strom | zwei Netzteile je Gerät an **zwei USVs bzw. Stromkreisen** (A/B-Einspeisung) | Ausfall einer USV oder Sicherung |

**Warum Schleifen schaden:** Switches leiten Broadcasts an alle Ports weiter. In einer Schleife kreisen sie endlos,
weil Ethernet-Frames **keine Lebensdauer (TTL)** haben, und vervielfachen sich (**Broadcast-Sturm**); dieselbe
MAC-Adresse taucht an wechselnden Ports auf (**MAC-Flattern**). Spanning Tree macht daraus einen schleifenfreien Baum.

**USV (unterbrechungsfreie Stromversorgung) – das Konzept:**
- **Aufgabe:** überbrückt Ausfälle und Schwankungen **sofort** aus Akkus.
- **Überbrückungszeit:** hängt von **Last und Akkukapazität** ab; sie muss mindestens bis zum vollständigen
  Herunterfahren reichen (mit Reserve) oder bis ein Notstromaggregat angelaufen ist.
- **Automatisches Herunterfahren:** Die USV meldet Stromausfall und Restlaufzeit per **Netzwerkkarte** (oder USB);
  eine **Shutdown-Software** auf jedem Server fährt bei einem Schwellwert geordnet herunter. Ohne diese Software
  laufen die Server, bis der Akku leer ist, und gehen hart aus.
- **Redundanz:** eine einzige USV ist selbst ein SPOF.

**USV dimensionieren:** Leistungen addieren → Reserve aufschlagen → in **VA** umrechnen.
Beispiel: 450 + 550 + 80 + 80 + 4 × 40 + 60 + 180 = **1560 W**; mit 25 % Reserve 1560 W × 1,25 = **1950 W**.
USVs werden meist in **Voltampere (VA, Scheinleistung)** angegeben: **W = VA × Leistungsfaktor**, also
**VA = W ÷ Leistungsfaktor** (bei 0,8: 1950 W ÷ 0,8 ≈ 2438 VA). Die Watt-Zahl allein reicht für die Auswahl nicht –
auch Überbrückungszeit, Bauart und Shutdown-Schnittstelle müssen passen.

| Bauart (IEC 62040-3) | Arbeitsweise | Einsatz |
|---|---|---|
| **Offline (VFD)** | Last am Netz, bei Ausfall Umschaltung auf Akku (wenige ms) | Arbeitsplätze |
| **Line-Interactive (VI)** | zusätzlich Spannungsregelung bei Über-/Unterspannung | kleine Server, Netzwerktechnik |
| **Online / Doppelwandler (VFI)** | Strom läuft **ständig** über Gleich- und Wechselrichter, **keine Umschaltzeit** | Serverraum |

> **Merke:** Redundanz ist nur so stark wie ihre gemeinsamen Abhängigkeiten. Eine USV schützt nur, wenn sie lange
> genug hält **und** die Server rechtzeitig sauber herunterfährt.

### Die Kopplungselemente und ihre Rolle

| Gerät | Was es tut | Wichtig |
|---|---|---|
| **Hub** | verteilt jedes Signal an **alle** Ports | **veraltet** — erzeugt unnötigen Verkehr und Kollisionen; im Prüfungskontext die „falsche" Antwort |
| **Switch** | leitet Frames gezielt an den **richtigen** Port weiter, anhand der MAC-Adresse | das Herz der Stern-Topologie |
| **Router** | verbindet **verschiedene Netze** und leitet Pakete zwischen ihnen weiter | das Gerät an der Grenze zum Internet |
| **Access Point** | bringt WLAN-Geräte ins kabelgebundene Netz | erweitert den Stern drahtlos |

### Switch und Router im Detail

**MAC-Adresstabelle (Switch):** Der Switch merkt sich zu jedem Port die **Quell-MAC-Adresse** der Frames, die dort
ankommen. Steht die **Ziel-MAC-Adresse** in der Tabelle, geht der Frame nur an diesen einen Port. Ist sie unbekannt,
**flutet** der Switch den Frame an alle Ports außer dem Eingangsport; ein Broadcast geht ebenso an alle Ports.

**Bridge (Netzwerkbrücke, AP2):** verbindet zwei Netzsegmente und arbeitet wie der Switch auf Schicht 2. Sie lernt die
MAC-Adressen je Port (**Bridge Table**) und lässt einen Frame nur ins andere Segment, wenn das Ziel nicht im Segment des
Absenders liegt; ein unbekanntes Ziel leitet sie ebenfalls weiter. Ein Switch ist eine **Multiport-Bridge**.

| Gerät | Kollisionsdomäne | Broadcastdomäne |
|---|---|---|
| **Hub** | **eine gemeinsame** für alle Ports | eine für alle Ports |
| **Switch** | **eine eigene je Port** | eine für alle Ports – Broadcasts werden weitergeleitet |
| **Router** | eine eigene je Schnittstelle | **trennt** Broadcastdomänen – Broadcasts gehen nicht in andere Netze |

**Routingtabelle (Router):** Jeder Eintrag nennt ein **Zielnetz**, den **Next Hop** (das nächste Gateway) und die
Schnittstelle. Passen mehrere Einträge, gilt der **spezifischste** (das längste Präfix, z. B. /16 vor /8). Die
**Standardroute 0.0.0.0/0** greift nur, wenn kein anderer Eintrag passt.

**Standardgateway (Client):** Der Client prüft mit seiner Subnetzmaske, ob das Ziel im eigenen Netz liegt. Ja → er
stellt den Frame direkt zu. Nein → er schickt den Frame an das **Standardgateway** (den Router); die **Ziel-IP-Adresse
im Paket bleibt die des Ziels**, nur die Ziel-MAC-Adresse im Frame ist die des Routers.

**VLAN (Virtual Local Area Network – virtuelles LAN, AP2):** teilt einen physischen Switch logisch in getrennte
**Broadcastdomänen**. Geräte verschiedener VLANs erreichen sich nur über einen **Router oder Layer-3-Switch**, auch wenn
sie am selben Switch hängen. Ein **Access-Port** gehört zu genau einem VLAN; die Frames zum Endgerät sind **ungetaggt**
(untagged). Ein **Trunk-Port** überträgt mehrere VLANs über ein Kabel; jeder Frame trägt dort ein **VLAN-Tag** nach
IEEE 802.1Q (**tagged**): 4 Byte im Ethernet-Header mit einer 12-Bit-VLAN-ID (nutzbar 1–4094; 0 und 4095 reserviert).
Das **native VLAN** eines Trunks ist die Ausnahme: seine Frames laufen **ohne Tag**; der Empfänger steckt jeden
ungetaggten Frame in sein natives VLAN – darum muss es an beiden Enden gleich eingestellt sein.

**Inter-VLAN-Routing (AP2):** Jedes VLAN ist ein eigenes IP-Netz; ein reiner Layer-2-Switch kann deshalb nicht zwischen
VLANs vermitteln. Zwei übliche Lösungen:

| Lösung | Aufbau | Bewertung |
|---|---|---|
| **SVI** (Switch Virtual Interface) auf dem **Layer-3-Switch** | je VLAN eine virtuelle Schnittstelle mit der Gateway-Adresse (z. B. 192.168.10.1 für VLAN 10) | routet intern mit Switch-Leistung – Standard im Firmennetz |
| **Router-on-a-Stick** | ein Router-Anschluss als Trunk, je VLAN eine Unterschnittstelle | günstig ohne Layer-3-Switch, aber jeder Verkehr zwischen VLANs läuft hin und zurück über **eine** Leitung (Engpass) |

**Paketweg zwischen VLANs:** Der Client erkennt mit der Subnetzmaske das fremde Netz → ARP auf das **Standardgateway** (SVI)
→ Frame an die Gateway-MAC, Ziel-IP = Server → der Layer-3-Switch routet laut Routingtabelle → ARP im Ziel-VLAN → **neuer
Frame** mit neuen MAC-Adressen. **Die IP-Adressen bleiben Ende zu Ende gleich, die MAC-Adressen gelten je Abschnitt.**

**VLAN-Fehlersuche – „im eigenen VLAN geht es, in andere VLANs nicht“:** Kabel und Access-Port sind dann in Ordnung; der
Fehler liegt am Übergang.

| Ursache | Prüfmaßnahme |
|---|---|
| Standardgateway am Client fehlt oder ist falsch | `ipconfig /all` lesen, Gateway anpingen |
| SVI fehlt, ist abgeschaltet, oder IP-Routing ist aus | Schnittstellenstatus und Routingtabelle des Layer-3-Switches |
| VLAN ist auf dem Trunk (Uplink) nicht erlaubt | Trunk-Übersicht: erlaubte VLANs am Uplink-Port |
| Zugriffsregel (ACL) sperrt den Verkehr | Regelwerk und Trefferzähler lesen |
| unklar, wo der Weg endet | `tracert` zum Ziel |

Merke: Fehlt ein VLAN auf dem Trunk, erreicht auch keine DHCP-Anfrage das Relay – nach Ablauf der Lease zeigen die Clients
eine APIPA-Adresse (169.254.x.x).

**STP (Spanning Tree Protocol, AP2):** Werden Switches zur Ausfallsicherheit redundant verbunden, entsteht eine Schleife,
in der Broadcasts endlos kreisen (**Broadcast-Sturm**). STP berechnet einen schleifenfreien Baum, **blockiert** die
überzähligen Ports und gibt einen davon frei, wenn eine aktive Verbindung ausfällt.

**ARP (Address Resolution Protocol – Adressauflösungsprotokoll, AP2):** Um einen Frame im eigenen Netz zuzustellen,
braucht der Sender die **MAC-Adresse** zur bekannten **IP-Adresse**. Er fragt per **ARP-Request** als **Broadcast**
„Wer hat 192.168.10.1?“; nur das Gerät mit dieser IP antwortet per **ARP-Reply** (Unicast) mit seiner MAC-Adresse.
Das Paar speichert der Sender im **ARP-Cache** (anzeigen mit `arp -a`). Liegt das Ziel in einem anderen Netz, fragt
der Client per ARP nach der MAC-Adresse des **Standardgateways**, nicht des Ziels.

**NAT/PAT (Network Address Translation – Netzwerkadressübersetzung / Port Address Translation – Portadressübersetzung, AP2):**
Private IPv4-Adressen (z. B. 192.168.0.0/16) werden im Internet nicht geroutet. Der Router am Internetzugang **ersetzt
die private Absenderadresse** ausgehender Pakete durch **seine öffentliche Adresse** und merkt sich die Zuordnung in
einer **Übersetzungstabelle**; Antworten übersetzt er zurück. Bei **PAT** (auch NAT-Overload, Masquerading) teilen sich
**viele interne Geräte eine öffentliche Adresse** – unterschieden werden die Verbindungen über die **Portnummer**.
Folge: Von außen ist nur der Router sichtbar; ein interner Server ist aus dem Internet erst erreichbar, wenn eine
**Portweiterleitung** eingerichtet ist.

**Welcher Schicht des OSI-Modells welches Gerät zugeordnet ist, steht in Abschnitt 3.2** —
dort geht es um die Protokolle, hier um den physischen Aufbau.

### Softwareprodukte

**Standardsoftware**
- Office-Pakete: **MS Office** (Word, Excel, PowerPoint, Outlook) und **LibreOffice** (Writer, Calc, Impress) – gleiche Aufgaben, andere Produktnamen
- Datenbank-Managementsysteme (DBMS): z. B. MS Access, MySQL, MariaDB
- Browser: Firefox, Chrome, Safari – Beurteilung nach Sicherheit, Kompatibilität, Datenschutz

**Branchensoftware**
- **ERP (Enterprise Resource Planning):** Integriert Vertrieb, Produktion, Lagerwirtschaft, Finanzen (z. B. SAP, NetSuite)
- **SCM (Supply Chain Management):** Optimiert Lieferkettenflüsse (z. B. Kinaxis, Blue Yonder)
- **CRM (Customer Relationship Management):** Verwaltung von Kundenbeziehungen (z. B. Salesforce, HubSpot)

**Systemsoftware**
Betriebssysteme (Windows, Linux, macOS), Treiber, Firmware, BIOS/UEFI – bildet Basis für Hardwarenutzung.

**Entwicklungssysteme**
- **Compiler:** Übersetzt Quellcode in Maschinencode (z. B. gcc für C/C++)
- **Virtuelle Maschinen (VM):** Emuliert Computersystem (z. B. VirtualBox, Hyper-V)
- **Interpreter:** Führt Code Zeile für Zeile aus (z. B. Python, JavaScript)
- **Editoren:** IDE wie Visual Studio Code, IntelliJ für Programmierung
- **Debugger:** Analysiert Fehler in Programmen

### Cloudlösungen

Cloud-Angebote unterscheiden sich danach, **wie viel der Anbieter übernimmt und wie viel der
Kunde selbst betreibt.** Von IaaS über PaaS zu SaaS wächst der Anteil des Anbieters:

| Modell | Der Anbieter stellt | Der Kunde macht selbst | Beispiel |
|---|---|---|---|
| **IaaS** (Infrastructure as a Service) | virtuelle Server, Speicher, Netz | Betriebssystem, Middleware, Anwendung installieren und pflegen | AWS EC2, Azure Virtual Machines |
| **PaaS** (Platform as a Service) | zusätzlich Betriebssystem, Laufzeitumgebung, Datenbank | nur die eigene Anwendung entwickeln und einspielen | Azure App Service, Heroku |
| **SaaS** (Software as a Service) | die fertige Anwendung | nur Daten und Benutzer pflegen | Microsoft 365, Google Workspace |

⚠️ **Merkrichtung: von IaaS (viel selbst) bis SaaS (fast nichts selbst).** Wer in der Prüfung
das Modell bestimmen soll, fragt: *Wo verläuft die Grenze zwischen Anbieter und Kunde?*

**SaaS (Software as a Service):** Anwendungen über Internet, keine Installation nötig (z. B.
Microsoft 365, Google Workspace). Vorteil: skalierbar, wartungsfrei; Nachteil: Abhängigkeit von
der Internetanbindung, Datenschutz.

**DaaS (Desktop as a Service):** **kein viertes Modell in der Reihe, sondern ein Sonderfall** –
statt einer einzelnen Anwendung liefert der Anbieter einen vollständigen Desktop aus der Cloud
(z. B. Citrix, Omnissa Horizon Cloud – früher VMware Horizon Cloud). Beurteilung: Latenz,
Durchsatz, Zuverlässigkeit des Providers.

### Virtualisierung: Hypervisor, virtuelle Maschine und Container

**Virtualisierung** heißt: Auf einer physischen Maschine laufen mehrere voneinander getrennte
Systeme. Das ist die Technik unter den Cloud-Modellen — was ein Anbieter als IaaS verkauft, sind
virtuelle Server auf seiner Hardware.

**Der Hypervisor** ist die Schicht, die diese Trennung herstellt und die Hardware verteilt:

| Typ | Läuft auf | Typischer Einsatz |
|---|---|---|
| **Typ 1** (Bare-Metal) | direkt auf der Hardware, ohne Wirtsbetriebssystem | Rechenzentrum, Server-Virtualisierung |
| **Typ 2** (Hosted) | als Programm auf einem vorhandenen Betriebssystem | Laptop, Test- und Schulungsumgebung |

**Virtuelle Maschine (VM) gegen Container — der Unterschied ist die Isolationsebene:**

| | Virtuelle Maschine | Container |
|---|---|---|
| Betriebssystem | **eigenes, vollständiges** je VM, über virtuelle Hardware | **teilt sich den Kernel des Wirtssystems** |
| Gekapselt wird | eine ganze Maschine | nur die Anwendung samt ihren Abhängigkeiten |
| Start und Bedarf | langsamer, mehr Arbeitsspeicher und Plattenplatz | schnell, ressourcenarm |
| Trennung | **stark** — bis auf die Hardware-Ebene | **schwächer** — gemeinsamer Kernel |
| Ressourcen | **fest zuteilbar** — CPU-Kerne und Arbeitsspeicher gehören dieser VM | teilen sich die Ressourcen des Wirts und **beeinflussen sich gegenseitig** |

⚠️ **Daraus folgt die Abwägung, und zwar in beide Richtungen.** Container gewinnen bei vielen
gleichartigen Diensten, die schnell starten und wenig kosten sollen. **Eine VM gewinnt in vier
Lagen:** hohe Sicherheitsanforderungen (Isolation), ein anderes Betriebssystem als der Wirt,
Altsoftware, die eine bestimmte Systemumgebung braucht (Kompatibilität, Treiber, Legacy) — **und
bei dauerhaft hoher Last**, weil sich einer VM CPU und Arbeitsspeicher **fest zuteilen** lassen.
„Container sind moderner" ist keine Begründung — gefragt ist, **wie stark getrennt werden muss
und wie verlässlich die Ressourcen gehören müssen**.
⚠️⚠️ **„Leichter" heisst nicht „leistungsfähiger".** Container brauchen *im Leerlauf* weniger,
teilen sich die Maschine aber mit allen anderen: **unter Last bremsen sie sich gegenseitig**,
während eine VM ihren Anteil behält.

### KI-Software und virtuelle Desktops

- **KI-Lösungen:** Machine Learning Tools (TensorFlow, PyTorch), Sprachmodelle (ChatGPT, Copilot) – Beurteilung nach Genauigkeit, Rechenzeit, Interpretierbarkeit
- **Virtuelle Desktops:** VDI (Virtual Desktop Infrastructure) vor Ort oder in der Cloud – hohe Sicherheit durch zentralisierte Verwaltung, aber Infrastrukturkosten

---

## 3.2 Typische IT-Systeme und Einsatzbereiche identifizieren {#32-typische-it-systeme-und-einsatzbereiche}

**Einordnung:** Taxonomiestufe 2–3 (Analyse, Anwendung). Systemintegratoren müssen erkennen, welches System für welchen Zweck geeignet ist und wie es in Unternehmensarchitekturen passt.

### Kommunikationssysteme

**Videokonferenzsysteme:** Ermöglichen Echtzeit-Audio/Video (z. B. Zoom, Microsoft Teams, Cisco Webex). Anforderungen: Bandbreite (≥ 2,5 Mbit/s für HD), niedrige Latenz (< 150 ms), End-to-End-Verschlüsselung.

**Social-Media-Systeme:** Plattformen für Kommunikation und Datenaustausch (LinkedIn, Slack, WhatsApp). Im Unternehmen: Collaboration-Tools wie Mattermost oder Rocket.Chat.

### Client-Server-Systeme und Domänen

**Architektur:** Ein zentraler Server verwaltet Ressourcen; viele Clients greifen darauf zu.  
**Einbindung in Domäne:** Alle Benutzer und Computer registrieren sich bei einem Domain Controller (DC). Windows-Domäne nutzt Active Directory (AD) zur zentralen Verwaltung von Benutzern, Gruppen, Policies und Ressourcenberechtigungen. Vorteil: Einheitliche Authentisierung, Skalierbarkeit; Nachteil: Single Point of Failure bei DC-Ausfall.

### Mobile Geräte

**Smartphone:** Tragbarer Computer mit Mobilfunk, GPS, Kameras, Sensoren. Beurteilung: Betriebssystem (iOS/Android), Speicher, Akkulaufzeit, Konnektivität (4G/5G, Bluetooth).

**Tablet:** Tablet-förmiges Gerät mit Touchscreen, zwischen Smartphone und Laptop. Einsatz: Mobile Anwendungen, Content-Consumption, leichte Produktivität (Office).

### Stationäre Geräteklassen

**Desktop-PC:** Rechner im eigenen Gehäuse mit separatem Monitor, Tastatur und Maus. Einsatz: fester Büroarbeitsplatz mit hohen Leistungsanforderungen (z. B. CAD, Videoschnitt). Beurteilung: viel Leistung fürs Geld, gut aufrüst- und reparierbar, braucht aber Platz und ist nicht mobil.

**All-in-One-PC:** Rechner und Monitor in **einem** Gehäuse, meist nur Strom- und Netzwerkkabel. Einsatz: Empfang, Schalter, Beratungsplätze mit wenig Platz. Beurteilung: platzsparend und aufgeräumt, aber kaum aufrüstbar und schwer zu reparieren – fällt der Bildschirm aus, ist der ganze Arbeitsplatz weg.

**Thin Client:** schlankes Endgerät mit wenig Rechenleistung und meist ohne eigene Datenhaltung. Anwendungen und Daten laufen auf einem **Terminalserver** oder in einer **VDI** (Virtual Desktop Infrastructure) im Rechenzentrum; der Thin Client zeigt nur das Bild und nimmt Tastatur- und Mauseingaben entgegen. Beurteilung: geringer Stromverbrauch, zentrale Verwaltung und Updates, keine Firmendaten auf dem Gerät (ein Diebstahl verrät nichts), lange Nutzungsdauer – aber **ohne Netz und Server kein Arbeiten**, und rechenintensive Arbeit am Platz (CAD, Videoschnitt) passt nicht.

⚠️ **Merke:** Desktop = Leistung am Platz, All-in-One = Platz sparen, Thin Client = alles zentral.

### Netzwerkprotokolle und OSI-Modell

**OSI-Modell (7 Schichten):**

| Schicht | Deutsch | English | Funktion | Beispiel |
|---------|---------|---------|----------|----------|
| 7 | Anwendung | Application | Benutzer-Programme, Dienste | HTTP, SMTP, FTP, SSH |
| 6 | Darstellung | Presentation | Datenformat, Verschlüsselung | TLS, JPEG, MPEG |
| 5 | Sitzung | Session | Dialog, Verbindung | NetBIOS, RPC |
| 4 | Transport | Transport | Ende-zu-Ende-Übertragung, Zuverlässigkeit | TCP, UDP |
| 3 | Vermittlung | Network | IP-Routing, logische Adressierung | IP, ICMP, Router |
| 2 | Sicherung | Data Link | MAC-Adressierung, Frames, Fehlerprüfung | Ethernet, PPP, MAC |
| 1 | Bitübertragung | Physical | Elektrische/optische Signale, Kabel | Kupferleitung, Glasfaser, LWL |

**Eselsbrücke für OSI-Schichten (von oben nach unten, Schicht 7 → 1):**  
*„**A**lle **P**riester **S**aufen **T**equila **N**ach **D**er **P**redigt"*
(**A**nwendung → **P** Darstellung (Presentation) → **S**itzung → **T**ransport → **N** Vermittlung (Network) → **D** Sicherung (Data Link) → **P** Bitübertragung (Physical))

**Wichtige Protokolle:**
- **Ethernet (Schicht 2):** Lokale Netzwerkverbindung, adressiert über MAC-Adressen (48 Bit, Format: XX:XX:XX:XX:XX:XX)
- **IP (Schicht 3):** Internet Protocol, adressiert über IP-Adressen (IPv4: 32 Bit, z. B. 192.168.1.1; IPv6: 128 Bit)
- **DNS (Schicht 7):** Domain Name System, übersetzt Domänen in IP-Adressen (z. B. www.example.com → 192.0.2.1 – eine nach **RFC 5737** für Beispiele reservierte Adresse)

- **ARP (Schicht 2):** Address Resolution Protocol – ermittelt zu einer bekannten IP-Adresse die
  zugehörige MAC-Adresse im lokalen Netz. Es schlägt die Brücke von der Adressierung der Schicht 3
  zur Adressierung der Schicht 2. Anzeigen mit `arp -a`.
- **DHCP (Schicht 7):** vergibt IP-Adresse, Subnetzmaske, Gateway und DNS-Server automatisch an
  Clients. Ohne DHCP-Server vergibt Windows eine APIPA-Adresse aus 169.254.0.0/16.
- **HTTPS (Schicht 7):** HTTP, dessen Nutzdaten über TLS (Schicht 6) verschlüsselt werden. Port 443
  gegenüber Port 80 bei HTTP.

**Welches Gerät auf welcher Schicht arbeitet** (das ist die Zuordnung, auf die Abschnitt 3.1 verweist):

| Schicht | Gerät | Woran es entscheidet |
|---|---|---|
| 1 Bitübertragung | **Repeater, Hub**, Medienkonverter, Kabel | gar nichts – das Signal wird nur verstärkt bzw. an **alle** Ports verteilt |
| 2 Sicherung | **Switch**, Bridge, Access Point | **MAC-Adresse** – der Frame geht gezielt an einen Port |
| 3 Vermittlung | **Router**, Layer-3-Switch | **IP-Adresse** – das Paket wird zwischen Netzen weitergeleitet |
| 4–7 | **Gateway** im engeren Sinn, Proxy, Application-Firewall | Inhalt bis hinauf zur Anwendung |

⚠️ **„Gateway" wird doppelt benutzt:** im Alltag heißt der Router am Netzübergang „Standard-Gateway"
(Schicht 3); im engeren Sinn ist ein Gateway ein Gerät, das **unterschiedliche Protokollwelten**
verbindet und dafür bis Schicht 7 hinaufreicht.

**Die Dateneinheit heißt auf jeder Schicht anders (PDU):**

| Schicht | Name der Dateneinheit |
|---|---|
| 1 | Bit |
| 2 | **Frame** (Rahmen) |
| 3 | **Paket** |
| 4 | **Segment** (TCP) bzw. Datagramm (UDP) |
| 5–7 | Daten |

**Kapselung:** Jede Schicht packt die Einheit der darüberliegenden in ihren eigenen Kopf ein –
von außen nach innen also **Ethernet-Frame → IP-Paket → TCP-Segment → Nutzdaten**. Beim Empfänger
wird in umgekehrter Reihenfolge ausgepackt.

**TCP-Verbindungsaufbau (Drei-Wege-Handshake):** `SYN` (Client fragt an) → `SYN-ACK` (Server
bestätigt und fragt seinerseits) → `ACK` (Client bestätigt). Erst danach fließen Nutzdaten.
UDP kennt keinen Handshake und verschickt Datagramme ohne Verbindungsaufbau.

⚠️ **Wozu die drei Schritte da sind: beide Seiten tauschen dabei ihre Sequenznummern aus.** Jede
Seite nennt im `SYN` bzw. `SYN-ACK` die Nummer, mit der sie zu zählen beginnt, und bestätigt mit
dem `ACK` die des Gegenübers. Die **Sequenznummer** nummeriert die Bytes eines Datenstroms und ist
der Grund, warum TCP verlorene Segmente erkennen, erneut anfordern und die Reihenfolge beim
Empfänger wiederherstellen kann. **Ein Handshake ohne diesen Austausch wäre nur ein Klingeln** —
danach wüsste keine Seite, wo der Datenstrom anfängt.

**Ports und Weiterleitung:** TCP und UDP (Schicht 4) unterscheiden die Dienste eines Rechners über **Portnummern**
(z. B. 80 für HTTP, 443 für HTTPS). Die Portnummer steht im Segment; Switch (Schicht 2) und Router (Schicht 3)
entscheiden nach MAC- bzw. IP-Adresse und brauchen sie nicht. Der Router packt den Frame aus und baut für das
nächste Netz einen **neuen Frame** mit neuen MAC-Adressen; die IP-Adressen bleiben.

**Fehlereingrenzung entlang der Schichten (von unten nach oben):** Link-LED aus oder Kabel defekt → Schicht 1.
Doppelte MAC-Adresse → Schicht 2. Falsche IP-Adresse, Subnetzmaske oder Gateway, `ping` schlägt fehl → Schicht 3
(ICMP). `ping` klappt, aber ein Dienst ist nicht erreichbar, weil der Verbindungsaufbau zu einem Port ausbleibt
(gesperrter Port, Dienst läuft nicht) → Schicht 4. Zertifikats- oder Verschlüsselungsfehler (TLS) → Schicht 6, sie
setzen eine bestehende Verbindung voraus. **Die unterste Schicht, die nicht mehr funktioniert, ist der Fehlerort.**

**Was beim ersten Aufruf einer Webseite nacheinander geschieht:** **DHCP** liefert IP-Adresse, Maske, Gateway und
DNS-Server. Liegen DNS-Server und Webserver in anderen Netzen, fragt der PC per **ARP** nach der MAC-Adresse des
Standardgateways. **DNS** löst den Namen in die IP-Adresse des Servers auf. Dann folgen der **TCP-Handshake**, der
**TLS**-Aufbau und die **HTTP**-Anfrage. Jeder Schritt braucht das Ergebnis des vorigen.

---

## 3.3 Leistungsfähigkeit und Energieeffizienz bestimmen und analysieren {#33-leistungsfähigkeit-und-energieeffizienz}

**Einordnung:** Kernkompetenz Taxonomiestufe 3 (Analyse). Systemintegratoren müssen Systeme vermessen, Engpässe erkennen und energieeffiziente Lösungen bewerten können.

### Kenngrößen und Leistungsdaten

**BIOS/UEFI-Einstellungen:**  
UEFI (Unified Extensible Firmware Interface) ist das moderne Gegenstück zu BIOS (Basic Input/Output System). Im UEFI lassen sich Taktfrequenzen (Undervolting, Overclocking), Hyperthreading, Secure Boot und Energiesparmodi einstellen. **Secure Boot** startet nur Bootloader und Betriebssysteme mit gültiger digitaler Signatur und hält so Schadsoftware ab, die sich vor dem Betriebssystem einnisten will (Bootkit). Diese Einstellungen gelten für die Hardware selbst, noch bevor ein Betriebssystem läuft.

**CPU-Parameter:**
- **Takt (GHz):** Clockspeed, höher = schneller Berechnung
- **Kerne/Cores:** Physische Prozessoren (z. B. 8-Core-CPU führt 8 Operationen parallel aus)
- **Threads:** Logische Prozessoren (mit Hyperthreading z. B. 8 Kerne × 2 = 16 Threads)
- **Cache (L1/L2/L3):** Schneller Zwischenspeicher für häufige Daten

**RAM:** Kapazität in GB (z. B. 16 GB DDR5), wichtig für Multitasking und große Datenmengen.

**Datenspeicher:** SSD-Geschwindigkeit in IOPS (Input/Output Operations per Second, z. B. 100.000 IOPS) oder sequenzielle Leserate (z. B. 500 MB/s); HDD nach Umdrehungen und MTBF.

**Dateisysteme:**

| Dateisystem | Max. Dateigröße | Einsatz | Besonderheiten |
|---|---|---|---|
| FAT32 | 4 GB | USB-Sticks, alte Systeme | Kompatibilität, einfach, veraltet |
| exFAT | 16 EB | Große USB-Sticks, SD-Karten, externe Platten | Nachfolger von FAT32: Dateien > 4 GB und von Windows, macOS und Linux les- und schreibbar — aber **keine Zugriffsrechte und kein Journaling** |
| NTFS | 16 EB | Windows-Standard | Journaling, Kompression, Verschlüsselung |
| APFS | 8 EB | macOS/iOS | Optimiert für SSDs, Snapshots |
| ext4 | 16 TB | Linux-Standard | Zuverlässig, Journaling, Performance |

**Grafikkarte:** VRAM (z. B. 12 GB GDDR6X), Speicherbandbreite (z. B. 648 GB/s), CUDA-Kerne (bei NVIDIA) oder Stream-Prozessoren (bei AMD).

**Netzwerkkarte/Gateway/Router:** Durchsatz in Gbps (z. B. Gigabit Ethernet = 1 Gbps, 10 Gigabit = 10 Gbps).

**LWL (Lichtwellenleiter):** Glasfaserkabel für sehr hohe Übertragungsraten (bis mehrere Tbit/s), immun gegenüber elektromagnetischen Störungen.

**Ethernet-Standards:**
- 100 Base-T: 100 Mbit/s
- Gigabit Ethernet: 1.000 Mbit/s = 1 Gbps
- 10 Gigabit Ethernet: 10 Gbps

**WLAN-Standards:**
- **802.11n (Wi-Fi 4):** bis 600 Mbit/s (2,4 GHz und 5 GHz)
- **802.11ac (Wi-Fi 5):** bis 3,5 Gbit/s (nur 5 GHz)
- **802.11ax (Wi-Fi 6):** bis 9.600 Mbit/s (≈ 10 Gbit/s), **2,4 GHz und 5 GHz**, OFDMA
- **Wi-Fi 6E:** kein eigener Standard, sondern 802.11ax **im zusätzlichen 6-GHz-Band**

**WLAN-Planung in einem Gebäude — drei Größen entscheiden:**
- **Reichweite:** 5 GHz trägt rund **15–30 m** und wird von Wänden und dicken Mauern stark
  gedämpft; 2,4 GHz trägt weiter, bietet aber weniger Kanäle und weniger Durchsatz.
- **Kapazität:** Ein einzelner Access Point begrenzt den Gesamtdurchsatz — je mehr Clients, desto
  weniger Datenrate je Client. **Reichweite ist nicht das einzige Argument für einen zweiten AP.**
- **Nahtloser Übergang:** Mehrere APs bekommen **dieselbe SSID** (den WLAN-Namen), damit Geräte
  beim Gehen wechseln können — das ist **Roaming**. Bei getrennten SSIDs bleibt das Gerät am
  schwachen AP hängen oder es entstehen Handover-Latenzen, die in Telefonie hörbar werden.
⚠️ **Merke für die Planung:** erst die Fläche und die Wände gegen die 5-GHz-Reichweite rechnen,
dann die Clientzahl gegen die Kapazität — und in beiden Fällen endet es bei **mehreren APs mit
einer SSID**, nicht bei einem stärkeren Gerät.
- **802.11be (Wi-Fi 7, seit 2024):** alle drei Bänder **gleichzeitig** (Multi-Link Operation), 4096-QAM

⚠️ **Das 6-GHz-Band kam erst mit Wi-Fi 6E, nicht mit Wi-Fi 6.** Das ist die klassische
Verwechslung: **Wi-Fi 6 = 2,4 + 5 GHz · Wi-Fi 6E = zusätzlich 6 GHz · Wi-Fi 7 = alle drei
gleichzeitig.**

### Hardwareplanung: SATA vs. NVMe, Engpässe, Netzteil

Typische Klausuraufgabe: zwei Systeme gegen **Anforderungen und Budget** bewerten und eine **begründete** Kaufentscheidung
treffen. Erst die Muss-Anforderungen prüfen (große CAD-Modelle, mehrere Anwendungen, 3D-Darstellung, Ladezeiten, Monitore),
dann das Budget. Ein System im Budget, das die Mindestanforderungen nicht erfüllt, ist eine **Fehlinvestition**; ein System
darüber braucht eine begründete Freigabe der Mehrkosten – oder ein angepasstes Angebot.

**Komponenten und was sie bringen:**

| Komponente | Kenngröße | Wofür entscheidend |
|---|---|---|
| CPU | Kerne / Threads (z. B. 12 / 24 durch Simultaneous Multithreading, bei Intel Hyper-Threading), Takt | mehrere Anwendungen und Berechnungen **parallel**; ein Programm, das nur einen Kern nutzt, profitiert kaum von mehr Kernen |
| RAM | Kapazität (GB), DDR4 / DDR5 | große Modelle, Multitasking; DDR5 ist schneller, aber **nicht steckkompatibel** mit DDR4-Steckplätzen |
| Grafikkarte (GPU) | VRAM (GB) | 3D-Darstellung, mehrere hochauflösende Monitore – Modelle und Texturen liegen im Grafikspeicher (VRAM) |
| SSD | Schnittstelle SATA oder NVMe | Ladezeiten großer Dateien, Auslagerung, viele parallele Zugriffe |
| Netzteil | Nennleistung (W), 80 PLUS | stabile Versorgung auch in Lastspitzen |

**SATA-SSD vs. NVMe-SSD:**

| | SATA-SSD | NVMe-SSD |
|---|---|---|
| Schnittstelle | SATA III (6 Gbit/s), für Festplatten entworfen | **PCI Express (PCIe)**, meist 4 Lanes, direkt an CPU oder Chipsatz |
| Protokoll | **AHCI** (Advanced Host Controller Interface): 1 Befehlswarteschlange mit 32 Befehlen | **NVMe** (Non-Volatile Memory Express): bis 65.535 Warteschlangen mit je bis 65.536 Befehlen, für Flash gebaut |
| Leistung | ca. 550–600 MB/s | PCIe 3.0 x4 ca. 3.500 MB/s, PCIe 4.0 x4 ca. 7.000 MB/s; mehr IOPS, geringere Latenz |
| Einsatzfälle | Büro-PC, Aufrüstung älterer Rechner (2,5-Zoll-Schacht), günstiger Datenspeicher | CAD/3D und Videoschnitt, Datenbank- und Virtualisierungsserver, schnelles Systemlaufwerk |

⚠️ **M.2 ist eine Bauform, kein Protokoll:** eine M.2-SSD kann über SATA **oder** über NVMe angebunden sein.
Jede PCIe-Generation verdoppelt ungefähr die Datenrate je Lane.

**Engpass (Flaschenhals) erkennen:** Der Engpass ist die Komponente, die zuerst an ihre Grenze kommt und das ganze System
bremst. Erst messen (Task-Manager / Ressourcenmonitor: Auslastung von CPU, Arbeitsspeicher, Datenträger, GPU-Speicher), dann kaufen.

| Symptom (z. B. mehrere CAD-Projekte offen) | Ursache | Maßnahme |
|---|---|---|
| Arbeitsspeicher ~100 %, Datenträger dauerhaft ausgelastet | RAM voll → Auslagerung (Swapping) auf die SSD | RAM aufrüsten (z. B. 32/64 GB) |
| GPU-Speicher voll, Darstellung ruckelt | VRAM zu klein | Grafikkarte mit mehr VRAM |
| Laden/Speichern dauert lange | SATA-SSD oder HDD zu langsam | NVMe-SSD |
| Takt fällt unter Dauerlast, Lüfter laut | Überhitzung (Thermal Throttling) | Kühlung reinigen, Wärmeleitpaste erneuern |
| CPU dauerhaft ~100 % | zu wenige Kerne/Threads | CPU mit mehr Kernen |

**Netzteil berechnen:** Leistung aller Komponenten addieren (CPU, Grafikkarte, Mainboard, RAM, SSD, Lüfter) und **20–30 %
Reserve** aufschlagen; dann die nächstgrößere übliche Netzteilgröße wählen.
Beispiel: 125 + 220 + 50 + 10 + 10 + 15 = 430 W · 1,3 = 559 W → **650-W-Netzteil**.
Das **80-PLUS-Siegel** (Bronze bis Titanium) beschreibt den **Wirkungsgrad**, nicht die Leistung: Gold verschwendet weniger
Energie als Wärme, liefert aber nicht mehr Watt.
Ein **zu schwaches Netzteil** führt zu Abstürzen, Neustarts oder Abschalten unter Last (Spannungseinbruch, Überlastschutz),
lässt stärkere Grafikkarten nicht zu und altert schneller (Dauerbetrieb an der Grenze, Hitze).

⚠️ **Merksatz:** Erst Anforderungen, dann Budget – und den Engpass messen, bevor eine Komponente gekauft wird.

### Binäre und dezimale Präfixe

Die häufigste Fehlerquelle beim Rechnen mit Datenmengen: **1 kB und 1 KiB sind nicht dasselbe.**

| | **Dezimal (SI)** | **Binär (IEC)** |
|---|---|---|
| Basis | Zehnerpotenzen | Zweierpotenzen |
| Kilo | **1 kB = 10³ = 1.000 Byte** | **1 KiB (Kibibyte) = 2¹⁰ = 1.024 Byte** |
| Mega | 1 MB = 10⁶ = 1.000.000 | 1 MiB (Mebibyte) = 2²⁰ = 1.048.576 |
| Giga | 1 GB = 10⁹ | 1 GiB (Gibibyte) = 2³⁰ = 1.073.741.824 |
| Tera | 1 TB = 10¹² | 1 TiB (Tebibyte) = 2⁴⁰ = 1.099.511.627.776 |

⚠️ **Merkregel: Das „bi" steht für binär.** Ki**bi**, Me**bi**, Gi**bi**, Te**bi** sind
Zweierpotenzen; k, M, G, T ohne „bi" sind Zehnerpotenzen.

⚠️ **Warum das praktisch wichtig ist:** Festplattenhersteller rechnen **dezimal** (1 TB =
10¹² Byte), Betriebssysteme zeigen oft **binär** an. Eine „1-TB"-Platte erscheint in Windows
deshalb als rund **931 GiB** — sie ist nicht kleiner geworden, sie wird nur anders gezählt.

⚠️ **Und: 1 Byte = 8 Bit.** Übertragungsraten werden in **Bit** pro Sekunde angegeben
(100 Mbit/s), Dateigrößen in **Byte**. Wer das verwechselt, rechnet um den Faktor 8 falsch.

### Barrierefreier Zugriff

**Hilfsmittel am Arbeitsplatz — was bei stark herabgesetzter Sehschärfe konkret hilft:**
**Screenreader** (Vorlesesoftware wie **NVDA** oder **JAWS**), dazu Alt-Texte für Bilder und ein
Test aller Anwendungen auf Kompatibilität · **Bildschirmlupe/Zoom** auf 200–300 % · **hoher
Kontrast** und dunkle Themes · größerer Bildschirm mit hoher Auflösung · **Tastatur-Navigation**
statt Mausbedienung, ergänzend Trackball oder Spracheingabe.
⚠️ **Ein Hilfsmittel allein genügt nicht** — geprüft wird immer die Kette aus Ausgabe (sehen oder
hören), Eingabe (bedienen) und Software (unterstützt sie das überhaupt).

**Hilfsmittel bei Hörbehinderung und für die Bedienung per Sprache:** **Untertitel** bzw.
Live-Transkription in Videokonferenzen · **optische statt akustischer Signale** (ein Hinweis
blinkt, statt zu piepen) · **Headset oder Lautsprecher mit kräftiger Lautstärke**, bei
Hörgeräten eine direkte Kopplung per Bluetooth · **Mikrofon bzw. Headset für die
Spracheingabe**, wenn Tastatur und Maus nicht bedienbar sind. ⚠️ Bei Gehörlosigkeit hilft kein
Lautsprecher – dann zählen Text und Bild.

Die **BITV** (Barrierefreie-Informationstechnik-Verordnung) bindet **öffentliche Stellen des Bundes** und verlangt für deren Websites und IT-Anwendungen Barrierefreiheit. Daneben stehen zwei weitere Rechtsgrundlagen – sie regeln **verschiedene Dinge** und ersetzen einander nicht:

- **§ 164 Abs. 4 SGB IX – der Arbeitsplatz des Beschäftigten:** Der Arbeitgeber richtet den Arbeitsplatz eines schwerbehinderten Beschäftigten behinderungsgerecht ein. Das gilt in jedem Unternehmen.
- **BFSG (Barrierefreiheitsstärkungsgesetz) – das Produkt für den Verbraucher:** Seit dem **28.06.2025** müssen auch **private** Unternehmen bestimmte Produkte und Dienstleistungen barrierefrei anbieten – unter anderem Online-Shops, E-Books, Bankdienstleistungen und Selbstbedienungsterminals. Kleinstunternehmen (unter 10 Beschäftigte und höchstens 2 Mio. € Jahresumsatz) sind bei Dienstleistungen ausgenommen. Das BFSG setzt den European Accessibility Act um.

⚠️ **Merke die Zuordnung:** **BITV** = öffentliche Stellen des Bundes · **BFSG** = private Anbieter gegenüber Verbrauchern · **§ 164 SGB IX** = eigener Beschäftigter am Arbeitsplatz.

Die technischen Mittel sind in allen drei Fällen dieselben:
- Bildschirmvergrößerung, hoher Kontrast, Sprachausgabe (Text-to-Speech)
- Tastaturnavigation ohne Maus, Untertitel bei Videos
- Webseiten: WCAG (Web Content Accessibility Guidelines) 2.1, i. d. R. Konformitätsstufe AA

**Ergonomie am Bildschirmarbeitsplatz (ArbStättV, Anhang Nummer 6)**

Die **Arbeitsstättenverordnung** schreibt die Gestaltung von Bildschirmarbeitsplätzen vor.
Die Richtwerte, die in Prüfungen abgefragt werden:

| Maß | Richtwert |
|---|---|
| **Sehabstand** zum Bildschirm | **50–70 cm** |
| **Ellenbogenwinkel** | ca. **90°** |
| **Kniewinkel** | ca. **90°** |
| **Bildschirmoberkante** | auf oder **leicht unter** Augenhöhe |
| **Blickwinkel** | ca. 15–20° **unter** der Waagerechten |

⚠️ **Der Bildschirm muss ENTSPIEGELT sein, nicht spiegelnd.** Spiegelungen blenden und ermüden
die Augen — das ist die klassische Falschantwort in Prüfungsaufgaben.
Weiter gefordert: **höhenverstellbarer Tisch** (Wechsel zwischen Sitzen und Stehen),
blendfreie Beleuchtung und ausreichend Bewegungsfläche.

### Gütesiegel für Energieeffizienz

- **Energy Star:** International anerkannt, Mindestanforderungen für Stromverbrauch
- **Blauer Engel:** Deutsches Gütesiegel, hohe Umweltstandards, Langlebigkeit
- **EPEAT:** Electronics Product Environmental Assessment Tool, auch Recyclingfähigkeit bewertet
- **80 PLUS:** Effizienzsiegel für Netzteile; mit steigender Stufe (Bronze → Silver → Gold → Platinum → Titanium) steigt der garantierte Wirkungsgrad von ca. 82 % bis über 92 % (abhängig von Auslastung)

### Übertragungsraten und Rechenbeispiele

**Formel:** Übertragungszeit = Datenmenge / Übertragungsrate

**Wichtig:** Unterscheidung zwischen dezimalen (kB = 1000 B) und binären (KiB = 1024 B) Einheiten; 1 Byte = 8 Bits.

**Beispiel 1:**  
Eine 2,5 GB große Datei soll über eine 50 Mbit/s-Internetleitung übertragen werden.

- 2,5 GB = 2,5 × 1.000 × 1.000 × 1.000 Byte = 2.500.000.000 Byte
- 2.500.000.000 Byte × 8 = 20.000.000.000 Bit = 20.000 Mbit
- Zeit = 20.000 Mbit ÷ 50 Mbit/s = 400 Sekunden ≈ 6 Minuten 40 Sekunden

(Hinweis: IHK-Aufgaben können dezimal (GB = 1 Mrd. Byte) oder binär (GiB = 1024³ Byte) rechnen; Aufgabentext beachten!)

### Strom, Spannung, Leistung und Energiekosten

**Grundformeln:**
- P (Watt) = U (Volt) × I (Ampere)  
- E (Kilowattstunden) = P (Watt) ÷ 1000 × t (Stunden)  
- Kosten = E × Strompreis (€/kWh)

**Wirkungsgrad:** η (eta) = P_out / P_in × 100%  
P_out ist die nutzbare **Ausgangsleistung**, P_in die zugeführte **Eingangsleistung**; der
Wirkungsgrad ist also das **Verhältnis** der beiden. Die Differenz geht als Wärme verloren.
Bei 80 PLUS Gold (η = 90%): Bei 1000 W Stromaufnahme werden nur 900 W genutzt, 100 W gehen als Wärme verloren.

**Beispiel 2: Energiekosten eines Office-PCs**
- Stromverbrauch: 150 W
- Betriebsdauer: 8 Stunden täglich
- Arbeitstage pro Jahr: 220 Tage
- Strompreis: 0,35 €/kWh

Rechnung:
- Jahresbetrieb: 150 W × 8 h × 220 Tage = 264.000 Wh = 264 kWh/Jahr
- Jahreskosten: 264 kWh × 0,35 €/kWh = 92,40 €/Jahr
- **Lifetime (5 Jahre):** 92,40 € × 5 = 462,00 €

---

## 3.4 Wirtschaftlichkeit von IT-Systemen beurteilen {#34-wirtschaftlichkeit-von-it-systemen}

**Einordnung:** Taxonomiestufe 3–4 (Analyse, Beurteilung). Kundenberatung erfordert Kostenvergleiche und Rentabilitätsanalysen.

### Kostenarten

**Anschaffungskosten (CAPEX – Capital Expenditure)**  
Einmalige Ausgaben für Hard- und Software (z. B. Kauf eines Servers für 5.000 €).

**Betriebskosten (OPEX – Operational Expenditure)**
- Strom, Kühlung, Gebäudemiete für Datacenter
- Wartung, Support, Reparaturen
- Versicherungen, Lizenzgebühren
- Mitarbeiterschulungen

**Variable Kosten:** Hängen von der Nutzung ab (z. B. Pay-per-Use, Datenverkehr in der Cloud).

**Fixe Kosten:** Unabhängig von Auslastung (z. B. Server-Leasing 500 €/Monat).

**Lizenzkosten:** Ermäßigungen durch Volumenlizenzverträge (z. B. Microsoft Campus-Lizenz).

**Finanzierungskosten:** Bei Kreditfinanzierung Zinsen einkalkulieren.

### Erwerbsmodelle im Vergleich

| Modell | Kaufpreis | Monatlich | Wartung | Eigentum | Flexibilität |
|--------|-----------|-----------|---------|----------|--------------|
| **Kauf** | Hoch | — | Selbst | Ja | Niedrig |
| **Leasing** | — | Mittel | Je nach Vertragsart | Nein | Mittel |
| **Finanzierung** | Teilweise | Mittel-Hoch | Selbst | Ab Bezahlung | Mittel |
| **Pay-per-Use** | — | Niedrig-Hoch | Provider | Nein | Hoch |

Zur Zeile Leasing: Beim **Operating-Leasing** wartet und versichert der Leasinggeber, beim **Finanzierungsleasing** der Leasingnehmer (Modul 07, Abschnitt 7.1 – Vertragsarten im IT-Kontext). In Rechenaufgaben steht deshalb immer in der Angabe, ob die Betriebskosten in der Rate enthalten sind.

**Beispiel 3: Kostenvergleich Kauf vs. Leasing (3 Jahre)**

Szenario: Server-System für KMU, Anschaffungspreis 8.000 €

**Kauf:**
- Anschaffung: 8.000 €
- Betriebskosten pro Jahr: 1.500 € (Strom, Wartung, Support)
- 3 Jahre Betrieb: 8.000 € + (1.500 € × 3) = 12.500 €
- Restwert nach 3 Jahren (30%): −2.400 €
- **Gesamtkosten:** 10.100 €

**Leasing:**
- Leasingrate: 250 €/Monat
- 3 Jahre (36 Monate): 250 € × 36 = 9.000 €
- Betriebskosten: 500 €/Jahr (Support durch Leasinggeber)
- 3 Jahre: 500 € × 3 = 1.500 €
- **Gesamtkosten:** 10.500 €

**Ergebnis:** Der Kauf ist in diesem Fall um 400 € günstiger. Vorteil des Leasings: Flexibilität, Planungssicherheit, keine Kapitalbindung. Vorteil des Kaufs: geringere Gesamtkosten bei langen Laufzeiten, Eigentum/Restwert.

### Preis-Leistungs-Verhältnis und Angebotsvergleich

**Preis-Leistungs-Verhältnis (PLV):** (Leistung in Punkten) / (Preis in €)  
Höhere PLV-Quote = besseres Angebot.

**Qualitativer Vergleich:**
- Herstellerreputation, Sicherheit, Datenschutz
- Support-Qualität, Verfügbarkeit von Ersatzteilen
- Zukunftssicherheit (längere Software-Updates)

**Quantitativer Vergleich:**
- CPU-Leistung (FLOPS, Benchmark-Punkte)
- Speicher (GB RAM, TB Storage)
- Durchsatz (Mbit/s, Transaktionen/Sekunde)

**Nutzwertanalyse (NWA):** Gewichtet qualitative und quantitative Kriterien (wird ausführlich in Modul 02 behandelt; hier: Schema kennen).

Beispiel:

| Kriterium | Gewicht | Angebot A (Punkte) | Angebot B (Punkte) |
|-----------|---------|--------------------|--------------------|
| Leistung | 40% | 8 → 3,2 | 9 → 3,6 |
| Preis | 30% | 9 → 2,7 | 7 → 2,1 |
| Support | 20% | 7 → 1,4 | 9 → 1,8 |
| Energieeffizienz | 10% | 6 → 0,6 | 8 → 0,8 |
| **Gesamtnutzwert** | — | **7,9** | **8,3** |

→ Angebot B ist trotz höherem Preis wirtschaftlicher.

### Total Cost of Ownership (TCO)

**Der Kaufpreis ist nicht der Preis.** Die TCO (Gesamtkosten des Eigentums) rechnet alle Kosten
zusammen, die ein System über seinen **Lebenszyklus** verursacht – von der Beschaffung bis zur
Entsorgung.

| Phase | Kostenpositionen |
|---|---|
| **Beschaffung** | Anschaffung, Lieferung, Installation, Erstschulung |
| **Betrieb** | Strom, Kühlung, Lizenzen, Wartung, Support, Ausfallkosten |
| **Ende der Nutzung** | Rückbau, Datenlöschung, **Entsorgung/Recycling** – abzüglich Restwert |

**Formel für Kostenvergleiche:**

> **TCO = Anschaffung + (Betriebskosten × Jahre) + Entsorgung − Restwert**

⚠️ **Die Entsorgung gehört dazu**, auch wenn sie in vielen Aufgaben mit 0 € angesetzt wird und
in der Kurzform deshalb fehlt. **Nicht** zur TCO gehören die Preise **anderer** Angebote – das ist
der Angebotsvergleich, nicht die TCO eines Systems.

**Beispiel (Zahlen aus Beispiel 3):** 8.000 € Anschaffung, 1.500 €/Jahr Betrieb, 30 % Restwert,
3 Jahre → 8.000 + 4.500 − 2.400 = **10.100 €** bei einer Entsorgung von 0 €. Fielen 300 €
Entsorgung an, wären es 10.400 €.

⚠️ **TCO ist eine Betrachtung über die ganze Nutzungsdauer.** Ein Gerät mit niedrigem Kaufpreis
und hohem Stromverbrauch kann über fünf Jahre teurer sein als das teurere, sparsamere – genau
darauf zielen die IHK-Aufgaben zum Gerätevergleich.

### ROI und Amortisationszeit

Die TCO zählt nur **Kosten**. ROI und Amortisationszeit beziehen zusätzlich die **Rückflüsse** ein –
das, was die Investition einspart oder zusätzlich einbringt (z. B. weniger Personal-, Lager- oder
Stromkosten).

- **ROI (Return on Investment – Kapitalrückfluss):** setzt die Rückflüsse ins Verhältnis zu den
  Investitionskosten. Je nach Formel als Faktor über die Nutzungsdauer (Rückflüsse ÷
  Investitionskosten) oder als Rendite in % pro Jahr.
- **Amortisationszeit** (Tilgungs-, Abzahlungsdauer): die Zeit, bis die Investitionskosten durch
  die Rückflüsse wieder hereingeholt sind.

> **Amortisationszeit = Investitionskosten ÷ jährliche Rückflüsse**

**Beispiel:** Ein Warenwirtschaftssystem kostet 100.000 € und spart jährlich 67.000 €;
Nutzungsdauer 3 Jahre. ROI = 3 × 67.000 ÷ 100.000 = **2,01** · Amortisationszeit = 100.000 ÷
67.000 ≈ **1,49 Jahre ≈ 17,9 Monate** (gleichwertig: 36 Monate ÷ 2,01).

**Bewertung:**
- Die Amortisationszeit muss **kürzer als die Nutzungsdauer** sein – sonst ist das System ersetzt,
  bevor es sich bezahlt gemacht hat. Bei IT liegt die Nutzungsdauer oft nur bei rund drei Jahren.
- **Je kürzer, desto geringer das Risiko**, weil weniger von unsicheren Zukunftszahlen abhängt.
- ⚠️ **Grenze der statischen Rechnung:** Sie sagt nichts über die Rückflüsse **nach** der
  Amortisation – also nichts über den Gesamtgewinn – und lässt Zinsen außer Acht. Sie misst das
  Risiko, nicht die Rentabilität.

### Wertschöpfung

**Definition:** Wertschöpfung ist die **Differenz zwischen dem Wert der erbrachten Leistung und
den von Dritten bezogenen Vorleistungen.** **Vorleistungen** sind alles, was zugekauft und nicht
im eigenen Betrieb erzeugt wurde — Hardware, Lizenzen, Fremdleistungen.
►► **Rechenschema:** Verkaufserlös − Vorleistungen = Wertschöpfung. Wer 12.000 € Hardware und
3.000 € Lizenzen einkauft und die installierte Lösung für 22.000 € verkauft, schöpft **7.000 €**
Wert — das ist die eigene Leistung: Planung, Installation, Einweisung, Gewährleistung.
⚠️ **Nicht mit Gewinn verwechseln:** von der Wertschöpfung gehen noch Löhne und Gemeinkosten ab.

Nicht nur Kosten senken, sondern auch Mehrwert schaffen:
- Produktivitätssteigerung (Zeit pro Vorgang ↓)
- Fehlerreduktion (Audit-Kosten ↓)
- Skalierbarkeit (Zukünftiges Wachstum ermöglicht)
- Wettbewerbsvorteil (unique selling proposition)

---

## Typische IHK-Aufgabenstellungen

1. **"Vergleichen Sie zwei angebotene Laptops anhand von Leistung, Energieverbrauch und Kosten über 4 Jahre."**  
   → Berechnen Sie Gesamtbetriebskosten (TCO – Total Cost of Ownership), nutzen Sie Leistungsdaten aus Prospekten.

2. **"Welche Netzwerkkomponenten benötigt eine Filiale mit 50 Arbeitsplätzen?"**  
   → Skizzieren Sie Switch, Gateway, Access Points, berücksichtigen Sie Redundanz.

3. **"Begründen Sie, ob ein Unternehmen Software eher kaufen oder leasen sollte."**  
   → Stellen Sie wirtschaftliche und organisatorische Argumente dar (Flexibilität, Planbarkeit).

4. **"Berechnen Sie die Datenübertragungszeit für ein 10 GB Backup über 100 Mbps VDSL."**  
   → Achten Sie auf korrekte Bit/Byte-Umrechnung und Dezimal/Binär-Konvention.

5. **"Skizzieren Sie das Netz einer Filiale als Stern-Topologie und benennen Sie den Single Point of Failure."**  
   → Zentraler Switch, daran Client-PCs und Server, Router zum Internet. Ausfallpunkt ist der Switch; Gegenmittel Redundanz und USV.

---

## Merksätze und Eselsbrücken

- **OSI-Schichten (von oben, 7 → 1):** *Alle Priester Saufen Tequila Nach Der Predigt* (Anwendung → Darstellung/Presentation → Sitzung → Transport → Vermittlung/Network → Sicherung/Data Link → Bitübertragung/Physical)

- **Energieeffizienz:** *Je höher der η (Wirkungsgrad), desto weniger Strom geht verloren.*

- **Wirtschaftlichkeit:** *TCO = Anschaffung + (Betriebskosten × Jahre) + Entsorgung − Restwert*

- **Datenmengen-Umrechnung:** *1 kB = 1000 B (dezimal) oder 1 KiB = 1024 B (binär); 1 Byte = 8 Bit*

- **Topologien:** *Stern hat eine Mitte, Bus hat eine Leitung, Ring hat einen Kreis, Mesh hat viele Wege.*

- **Ausfall merken:** *Im **Stern** trifft ein Kabelbruch **einen**, im **Bus** trifft er **alle**.* Dafür steht im Stern bei Ausfall der Mitte das ganze Netz.

- **Hub gegen Switch:** *Der **Hub** ruft in den Raum, der **Switch** spricht den Richtigen an.*

---

## Selbsttest

<details>
<summary><strong>Frage 1: Hardware-Begriffe</strong></summary>

Ordnen Sie folgende Komponenten ihrer Funktion zu:
- UEFI
- SSD
- Gateway
- Grafikkarte

A) Schnittstelle zwischen zwei Netzwerkdomänen  
B) Speichermedium ohne bewegliche Teile  
C) Firmware für Hardware-Initialisierung  
D) Verarbeitet grafische Daten  

**Lösung:** UEFI → C, SSD → B, Gateway → A, Grafikkarte → D

</details>

<details>
<summary><strong>Frage 2: Datenübertragung</strong></summary>

Eine Datei von 3 GB soll über eine 25 Mbit/s-Leitung übertragen werden. Wie lange dauert das?

- 3 GB = 3 × 1.000.000.000 Byte = 3.000.000.000 Byte
- 3.000.000.000 Byte × 8 = 24.000.000.000 Bit = 24.000 Mbit
- Zeit = 24.000 Mbit ÷ 25 Mbit/s = 960 Sekunden = 16 Minuten

**Lösung:** 960 Sekunden oder 16 Minuten

</details>

<details>
<summary><strong>Frage 3: Energiekosten</strong></summary>

Ein Server verbraucht 400 W durchgehend (24/7, 365 Tage). Strompreis: 0,40 €/kWh. Wie viel kostet der Betrieb im ersten Jahr?

- Jahresstunden: 24 h × 365 Tage = 8.760 h
- Jahresenergie: 400 W × 8.760 h = 3.504.000 Wh = 3.504 kWh
- Kosten: 3.504 kWh × 0,40 €/kWh = 1.401,60 €

**Lösung:** 1.401,60 €/Jahr

</details>

<details>
<summary><strong>Frage 4: OSI-Modell</strong></summary>

In welcher OSI-Schicht arbeiten folgende Protokolle?
- DNS
- Ethernet
- TCP
- IP
- SSH

**Lösung:**
- DNS: Schicht 7 (Anwendung)
- Ethernet: Schicht 2 (Sicherung) (und Schicht 1)
- TCP: Schicht 4 (Transport)
- IP: Schicht 3 (Vermittlung)
- SSH: Schicht 7 (Anwendung)

</details>

<details>
<summary><strong>Frage 5: Kauf vs. Leasing</strong></summary>

Ein Unternehmen plant Anschaffung von Workstations (je 2.000 € Kaufpreis) für 5 Jahre. Betriebskosten: 300 €/Jahr pro Workstation. Leasing-Alternative: 60 €/Monat pro Workstation (Betriebskosten inklusive). 

Welche Variante ist über 5 Jahre pro Workstation günstiger — und um wie viel?

**Lösung:**
- Kosten pro Workstation über 5 Jahre:
  - **Kauf:** 2.000 € + (300 € × 5) = 3.500 €
  - **Leasing:** 60 € × 60 Monate = 3.600 €
- **Der Kauf ist um 100 € pro Workstation günstiger** (bei 20 Workstations: 2.000 € Ersparnis).
- Zusatzargument: Beim Kauf käme ggf. noch ein Restwert hinzu; beim Leasing sind dafür Wartung/Austausch und Liquiditätsschonung Vorteile.

</details>

<details>
<summary><strong>Frage 6: Stern-Topologie und Ausfall</strong></summary>

In einem Büronetz sind zwölf Arbeitsplätze, ein Server und ein Router an einem zentralen Switch angeschlossen.

a) Welche Topologie liegt vor?
b) Was passiert, wenn das Kabel eines einzelnen Arbeitsplatzes bricht?
c) Was passiert, wenn der Switch ausfällt?
d) Nennen Sie zwei Maßnahmen gegen den Ausfall aus c).

---

**Lösung:**

a) **Stern-Topologie** — alle Geräte hängen einzeln an einem zentralen Verteiler.

b) **Nur dieser eine Arbeitsplatz ist offline.** Alle anderen Geräte kommunizieren unverändert weiter.

c) **Das gesamte Netz steht.** Auch intakte PCs erreichen einander nicht mehr, weil jede Verbindung über den Switch läuft — der Switch ist der **Single Point of Failure**.

d) **Redundanter zweiter Switch** (Ausweichpfad) und **USV für den Verteilerschrank** (Schutz gegen Stromausfall). Auch zulässig: Ersatzgerät vorhalten, Wartungsvertrag mit kurzer Reaktionszeit.
</details>

---

**Lernziele erreicht?**
- [x] Marktgängige Hard- und Software unterscheiden und beurteilen können
- [x] IT-Systeme Einsatzbereichen zuordnen
- [x] Leistungsdaten auslesen und interpretieren
- [x] Energieeffizienz quantifizieren
- [x] Wirtschaftlichkeit vergleichend darstellen
- [x] Rechenbeispiele (Datenübertragung, Energiekosten, Kostenvergleich) beherrschen
