# Modul 06 – IT-Sicherheit und Datenschutz

## Modulübersicht
Dieses Modul behandelt die Umsetzung, Integration und Prüfung von Maßnahmen zur IT-Sicherheit und zum Datenschutz gemäß IHK-Prüfungskatalog (Fragenkomplex 06, Lernfeld 4). Es bildet einen Schwerpunkt der AP1-Prüfung und verknüpft technische, organisatorische und rechtliche Aspekte zu einem ganzheitlichen Verständnis von Informationssicherheit im Unternehmen.

## Inhaltsverzeichnis
- [6.1 Regelungen zur IT-Sicherheit auf Grundschutzniveau](#61-regelungen)
- [6.2 Schutzbedarfsanalyse nach BSI IT-Grundschutz](#62-schutzbedarfsanalyse)
- [6.3 Modellierung eines arbeitsplatzbezogenen Sicherheitskonzeptes](#63-modellierung)
- [6.4 Umsetzung des Sicherheitskonzeptes](#64-umsetzung)

---

## 6.1 Regelungen zur IT-Sicherheit auf Grundschutzniveau im eigenen Arbeitsbereich analysieren, anwenden und überprüfen {#61-regelungen}

**Einordnung:** Dieses Thema ist Grundlage für alle weiteren Sicherheitsmaßnahmen und gehört zu den häufigsten AP1-Aufgaben. Es verbindet theoretische Konzepte (CIA-Modell) mit praktischen Maßnahmen und rechtlichen Anforderungen.

### CIA-Schutzziele der Informationssicherheit

Die drei Schutzziele bilden das Fundament jeder IT-Sicherheitsstrategie:

| Schutzziel | Definition | IT-Beispiel | Typische Maßnahme |
|---|---|---|---|
| **Verfügbarkeit** (Availability) | Informationen/Systeme sind autorisiertem Personal rechtzeitig zugänglich | Produktivserver ist erreichbar, kein Ausfall | Redundante Systeme, regelmäßiges Backup, Monitoring |
| **Vertraulichkeit** (Confidentiality) | Nur berechtigte Personen können auf Daten zugreifen | Kundendaten bleiben privat, keine unbefugte Einsicht | Verschlüsselung, Zugriffsrechte, Authentifizierung |
| **Integrität** (Integrity) | Daten sind vollständig und unverändert | Datenbank wurde nicht manipuliert | Hashwerte, digitale Signaturen, Änderungsprotokolle |

**Merksatz:** CIA = Drei Säulen der Sicherheit – keiner darf wegfallen!

### Technische und organisatorische Maßnahmen (TOM)

**Rechtliche Grundlage:** Art. 32 DSGVO (Datenschutz-Grundverordnung) verpflichtet zur Implementierung angemessener technischer und organisatorischer Maßnahmen.

**Technische Maßnahmen (T):**
- **Verschlüsselung:** Symmetrisch (schnell, ein Schlüssel, z. B. AES), asymmetrisch (langsam, Schlüsselpaar öffentlich/privat, z. B. RSA), hybrid (Sitzungsschlüssel symmetrisch, Austausch asymmetrisch, z. B. TLS)
- Virenschutz und Malware-Protection
- Personal Firewall (Softwarezugriff auf Netzwerk limitieren)
- Backup und Notfallwiederherstellung (Verfügbarkeit)
- Netzwerk-Segmentierung und DMZ (Demilitarisierte Zone)

**Organisatorische Maßnahmen (O):**
- IT-Sicherheitsrichtlinien und Policies (z. B. Passwort-Policy)
- Schulungen und Awareness-Programme (Phishing-Simulation, Sensibilisierung)
- Berechtigungskonzepte (Prinzip der minimalen Rechte)
- Zutritts- und Zugriffskontrolle
- Berichtswesen und Incident Management

### Virenschutz (Malware-Schutz)

Virenschutz ist eine **technische Maßnahme** (TOM) gegen Schadsoftware (Malware: Viren, Würmer, Trojaner, Ransomware). Ein Virenschutzprogramm erkennt Schadsoftware auf drei Wegen:

| Verfahren | Wie es erkennt | Stärke / Grenze |
|---|---|---|
| **Signaturerkennung** | vergleicht Dateien mit bekannten Mustern (Signaturen) aus der Datenbank des Herstellers | zuverlässig bei bekannter Malware – erkennt nur, was schon bekannt ist |
| **Heuristik** | sucht verdächtige Merkmale im Programmcode, z. B. Befehle zum Verschlüsseln vieler Dateien | findet auch neue Varianten – mit Fehlalarmen |
| **Verhaltensanalyse** | beobachtet laufende Programme, z. B. massenhaftes Umbenennen von Dateien | fängt auch Unbekanntes – schlägt aber erst an, wenn das Programm schon läuft |

**Betrieb:**
- **Echtzeitschutz (On-Access):** prüft jede Datei beim Öffnen, Speichern oder Herunterladen.
- **Geplanter Scan (On-Demand):** durchsucht regelmäßig das ganze System.
- **Aktuelle Signaturen:** automatische Updates, mehrmals täglich – ein veralteter Virenschutz übersieht neue Schadsoftware.
- **Quarantäne:** Ein Fund wird isoliert statt sofort gelöscht – so lässt sich ein Fehlalarm rückgängig machen.
- **Zentrale Verwaltung:** Im Unternehmen meldet jeder Client an eine Verwaltungskonsole; die IT sieht veraltete Signaturen und Funde auf einen Blick.

**Grenze:** Virenschutz ersetzt weder Sicherheitsupdates noch Backups und Schulung. Ein befallenes Gerät wird zuerst vom Netz getrennt (siehe Datenschutzverletzung).

**Merksatz:** Signatur = schon bekannt, Heuristik = sieht verdächtig aus, Verhalten = tut gerade etwas Verdächtiges.

### IT-Sicherheitsbeauftragter vs. Datenschutzbeauftragter

| Rolle | Aufgabe | Rechtsgrundlage | Pflicht? |
|---|---|---|---|
| **IT-Sicherheitsbeauftragter** | Informationssicherheit im Unternehmen generell (Schutzziele, Maßnahmen) | Unternehmensverantwortung, BSI-Empfehlungen | Meist freiwillig |
| **Datenschutzbeauftragter (DSB)** | Schutz personenbezogener Daten, Compliance mit DSGVO/BDSG | Art. 37 DSGVO, § 38 BDSG | Pflicht (meist ab ~20 Personen mit ständiger automatisierter Verarbeitung) |

### IT-Sicherheitsrichtlinien – Passwort-Policy

Moderne BSI-Empfehlungen (Stand 2024):
- **Länge statt Komplexität:** Mindestens 12 Zeichen, lieber lange Passphrasen (z. B. „Blauer!Elefant-tanzt7x")
- **Keine erzwungenen regelmäßigen Wechsel** ohne Anlass (führt zu schwachen Passwörtern)
- **Keine Wiederverwendung** der letzten 5 Passwörter
- **Speicherung nur gehashed** (z. B. SHA-256 + Salt)
- **Multi-Faktor-Authentifizierung (MFA)** bevorzugt (2. Faktor: SMS, Authenticator-App, Hardware-Token)

### Social Engineering: der Angriff auf den Menschen

Die meisten erfolgreichen Angriffe brechen keine Verschlüsselung — sie **umgehen die Technik
und sprechen den Menschen an**. Beim **Social Engineering** bringt der Angreifer ein Opfer dazu,
freiwillig Daten herauszugeben oder eine Handlung auszuführen. Ausgenutzt werden dabei immer
dieselben vier Hebel: **Autorität, Zeitdruck, Hilfsbereitschaft und Neugier.**

⚠️ **Deshalb hilft gegen Social Engineering keine Firewall.** Die Gegenmaßnahme ist
organisatorisch: Schulung, klare Meldewege und feste Regeln für Ausnahmen.

**Die Angriffsarten, die man unterscheiden können muss:**

| Angriff | Vorgehen | Erkennungsmerkmal |
|---|---|---|
| **Phishing** | Massenhafte gefälschte E-Mails oder Webseiten, die zur Eingabe sensibler Daten verleiten | unpersönliche Anrede, generischer Text, an viele gleichzeitig |
| **Spear-Phishing** | **Gezielter** Angriff auf eine bestimmte Person, mit echtem Namen, Abteilung und Vorgang | wirkt persönlich und plausibel — deshalb gefährlicher |
| **CEO-Fraud / BEC** | Angeblicher Chef oder Geschäftspartner fordert eine **sofortige Überweisung** oder Daten | Autorität + extremer Zeitdruck, „streng vertraulich, keine Rückfragen" |
| **Pretexting** | Der Angreifer erfindet einen **Vorwand** und gibt sich als jemand anderes aus („Ich bin der IT-Support") | eine Rolle, die Vertrauen schafft, meist am Telefon |
| **Baiting** | Ein **Köder** wird ausgelegt, z. B. ein USB-Stick auf dem Parkplatz | „Gefundene" Datenträger, verlockende Downloads |
| **Shoulder Surfing** | Der Angreifer schaut **über die Schulter** mit — PIN, Passwort, Ausweis | physische Nähe, offene Bildschirme |
| **Tailgating / Piggybacking** | Der Angreifer **schlüpft hinterher** durch eine gesicherte Tür, ohne eigenen Ausweis | „Halten Sie mir bitte kurz die Tür auf, ich habe die Hände voll" |

⚠️ **Der Unterschied Phishing / Spear-Phishing ist eine Standardfrage:** **Phishing ist
Massenversand an viele, Spear-Phishing ist gezielt auf eine Person zugeschnitten** und nutzt
persönliche Daten. Beides läuft nicht nur per E-Mail — auch per SMS (Smishing) oder Telefon
(Vishing).

### Eine Phishing-Mail erkennen

Fünf Merkmale, von denen in einer Prüfungsaufgabe meist drei genannt werden sollen:

1. **Abweichende Absenderadresse** — sie sieht der echten zum Verwechseln ähnlich
   (`chef@aschhorn.de` gegen `chef@aschhom.de`). **Absenderadressen lassen sich leicht fälschen.**
2. **Dringlichkeit und Drohung** — „Ihr Konto wird in 24 Stunden gesperrt", „bitte sofort".
   **Handlungsdruck ist der Kern des Angriffs: Wer sich gehetzt fühlt, prüft nicht mehr.**
3. **Verdächtige Links oder Anhänge** — der angezeigte Text stimmt nicht mit dem echten Ziel
   überein. **Vor dem Klicken mit der Maus darüberfahren und das Linkziel lesen.**
4. **Unpersönliche Anrede** — „Sehr geehrter Kunde" bei einem Absender, der den Namen kennen müsste.
5. **Sprach- und Formatfehler** — bei automatisch übersetzten Massenmails häufig.
   ⚠️ **Aber: Fehlerfreie Mails sind kein Beweis für Echtheit.** Spear-Phishing ist sprachlich sauber.

**Richtiges Verhalten im Verdachtsfall:**
- **Nicht klicken, nicht antworten, keine Daten eingeben, Anhänge nicht öffnen.**
- **Über einen bekannten, zweiten Kanal rückfragen** — die Telefonnummer aus dem Vertrag, nicht
  die aus der Mail.
- **An die IT bzw. den IT-Sicherheitsbeauftragten melden**, auch wenn nichts passiert ist.
  ⚠️ **Eine gemeldete Mail schützt die Kollegen; eine gelöschte Mail schützt niemanden.**
- Wurde bereits geklickt oder ein Passwort eingegeben: **sofort melden und das Passwort ändern.**
  **Verschweigen ist der teuerste Fehler** — je später die Meldung, desto größer der Schaden.

**Organisatorische Gegenmaßnahmen im Unternehmen:**
- **Awareness-Schulungen und Phishing-Simulationen** (siehe TOM, organisatorische Maßnahmen)
- **Vier-Augen-Prinzip bei Zahlungen** — die wirksamste Einzelmaßnahme gegen CEO-Fraud
- **Feste Rückrufregel** bei Zahlungs- oder Datenanfragen per Mail
- **Besucherausweise und Zutrittsregeln** gegen Tailgating, **Clean Desk** und Blickschutzfilter
  gegen Shoulder Surfing

### Datenschutzgesetze: DSGVO und BDSG

**Personenbezogene Daten (Art. 4 DSGVO):** Alle Informationen, die sich auf eine natürliche Person beziehen (Name, Adresse, IP-Adresse, Cookies, Metadaten).

**Rechte der Betroffenen:**
- **Auskunftspflicht:** Unternehmen muss offenlegen, welche Daten es speichert
- **Berichtigung:** Fehlerhafte Daten müssen korrigiert werden
- **Löschung (Recht auf Vergessenwerden):** Daten müssen gelöscht werden, wenn Grund entfällt
- **Einschränkung der Verarbeitung:** Keine Nutzung, aber Speicherung
- **Datenübertragbarkeit:** Daten in strukturierter Form exportieren
- **Widerspruch:** Gegen bestimmte Verarbeitungen Widerspruch einlegen (z. B. Direktwerbung)

**Einwilligung (Art. 6 Abs. 1 lit. a und Art. 7 DSGVO):** eine von mehreren Rechtsgrundlagen – neben Vertragserfüllung, rechtlicher Verpflichtung und berechtigtem Interesse. Wirksam ist sie nur, wenn sie
- **freiwillig** erteilt wird – ein Vertrag darf nicht von der Einwilligung in eine Verarbeitung abhängen, die für ihn nicht nötig ist (Kopplungsverbot, Art. 7 Abs. 4),
- **für einen bestimmten Zweck**, **informiert** und **unmissverständlich** abgegeben wird – ein vorangekreuztes Kästchen genügt nicht,
- vom Verantwortlichen **nachgewiesen** werden kann (Art. 7 Abs. 1).

**Konsequenzen der Einwilligung:**
- Die betroffene Person kann sie **jederzeit widerrufen** – so einfach, wie sie sie erteilt hat (Art. 7 Abs. 3).
- Der Widerruf wirkt **nur für die Zukunft:** Was bis dahin verarbeitet wurde, bleibt rechtmäßig. Ab dem Widerruf endet die Verarbeitung für diesen Zweck; Daten ohne andere Rechtsgrundlage werden gelöscht.
- Wer ohne Rechtsgrundlage verarbeitet, riskiert Bußgeld und Schadensersatz.

**Anonymisierung vs. Pseudonymisierung:**

| Verfahren | Definition | Rückgängig machbar? | Beispiel |
|---|---|---|---|
| **Anonymisierung** | Personenbezug ist unmöglich herzustellen | Nein | Statistik: „5 Kunden kauften Produkt X" |
| **Pseudonymisierung** | Zuordnung nur mit separatem Schlüssel möglich | Ja | Kundennr. 12345 statt Name + separates ID-Mapping |

**Merksatz:** Anonymisiert = für immer weg; pseudonymisiert = nur gesperrt, aber wiederherstellbar.

### Datenschutzverletzung, Auftragsverarbeitung und Drittlandtransfer

**Meldepflicht bei einer Datenschutzverletzung (Art. 33 und 34 DSGVO)**

Geht ein unverschlüsseltes Notebook oder ein USB-Stick mit personenbezogenen Daten verloren, ist
das eine **meldepflichtige Verletzung des Schutzes personenbezogener Daten**.

| Wem | Frist | Grundlage |
|---|---|---|
| **Aufsichtsbehörde** | **unverzüglich, möglichst binnen 72 Stunden** nach Bekanntwerden | Art. 33 DSGVO |
| **Betroffene Personen** | unverzüglich, **wenn ein hohes Risiko** für sie besteht | Art. 34 DSGVO |

⚠️ **Die 72 Stunden laufen ab Bekanntwerden, nicht ab dem Vorfall.** Eine Meldung entfällt nur,
wenn ein Risiko für die Betroffenen **unwahrscheinlich** ist.
⚠️ **Verschlüsselung ist der Ausweg:** War das Gerät vollständig verschlüsselt, sind die Daten
für den Finder unzugänglich — das Risiko sinkt, und die Benachrichtigung der Betroffenen kann
entfallen. **Deshalb ist Geräteverschlüsselung keine Kür.**

**Erste Schritte bei einem Sicherheitsvorfall:** **melden und eindämmen** — betroffenes System
vom Netz trennen, Zuständige informieren, **Beweise sichern statt vernichten**.
⛔ **Nicht sofort neu aufsetzen** — das löscht die Spuren, die man für die Ursachenanalyse und
die Meldung braucht.

**Auftragsverarbeitung (Art. 28 DSGVO)**

Verarbeitet ein Dienstleister personenbezogene Daten **im Auftrag** — Cloud-Hosting,
Newsletter-Versand, externe Lohnbuchhaltung —, braucht es einen **Auftragsverarbeitungsvertrag
(AVV)**. ⚠️ **Die Verantwortung bleibt beim Auftraggeber**; der Dienstleister ist weisungsgebunden.

**Drittlandtransfer**

Ein **Drittland** ist jedes Land außerhalb der EU/des EWR. Werden Daten dorthin übermittelt,
reicht der AVV nicht — es braucht **zusätzliche Garantien**: einen Angemessenheitsbeschluss der
EU-Kommission, **Standardvertragsklauseln (SCC)** oder eine entsprechende Zertifizierung.
⚠️ **Ein US-Cloud-Anbieter ist deshalb nicht automatisch unzulässig, aber nie ohne Prüfung.**

### Beispiel: Datenschutz in der Praxis
Ein Unternehmen speichert Kundendaten (Name, E-Mail, Kaufhistorie). Maßnahmen:
- **Technisch:** Verschlüsselte Datenbank, regelmäßige Backups
- **Organisatorisch:** Zugriff nur für Sales-Team, Datenschutzrichtlinie, Schulung
- **Personell:** DSB benannt, Incident-Response definiert

---

## 6.2 Schutzbedarfsanalyse im eigenen Arbeitsbereich nach BSI IT-Grundschutz {#62-schutzbedarfsanalyse}

**Einordnung:** Die Schutzbedarfsanalyse ist das Werkzeug, um Risiken systematisch zu erfassen und Ressourcen gezielt einzusetzen. Sie wird häufig in AP1-Aufgaben abgefragt.

### Vorgehen der Schutzbedarfsfeststellung

1. **Objekt definieren:** Anwendung, IT-System, Raum/Infrastruktur, oder Kommunikationsverbindung
2. **Schutzbedarf je Schutzziel bewerten:**
   - Verfügbarkeit: Wie gravierend ist Ausfall? (Produktionskosten, Rufschaden)
   - Vertraulichkeit: Wie sensibel sind Daten? (Geschäftsgeheimnis, personenbezogene Daten)
   - Integrität: Welcher Schaden durch Manipulation? (Falsche Finanzdaten)
3. **Vererbungsprinzip anwenden:**
   - **Maximumprinzip:** Der höchste Schutzbedarf einer Anwendung bestimmt den Schutzbedarf des IT-Systems, auf dem sie läuft
   - **Kumulationseffekt:** Viele Anwendungen mit normalem Bedarf auf einem System können in Summe einen höheren Schutzbedarf ergeben
   - **Verteilungseffekt:** Redundanz (z. B. gespiegelte Systeme) kann den Schutzbedarf eines einzelnen Systems senken

### Schutzbedarfskategorien

| Kategorie | Schadensausmaß | Beispiel |
|---|---|---|
| **Normal** | Überschaubare Schäden | Office-PC mit Standard-Dokumenten |
| **Hoch** | Beträchtliche Schäden (wirtschaftlich, reputational) | Server mit Kundendatenbank |
| **Sehr hoch** | Existenzbedrohend, katastrophal | Produktionssteuerungssystem, Finanzbuchhaltung |

### Beispiel: Schutzbedarfsanalyse Büro-Arbeitsplatz mit Kundendatenbank-Zugriff

| Objekt | Schutzziel | Kategorie | Begründung |
|---|---|---|---|
| **PC** | Verfügbarkeit | Normal | Lokal-Backup, 1–2h Ausfall verkraftbar |
| **PC** | Vertraulichkeit | Hoch | Kundendaten (DSGVO), Geschäftsdaten |
| **PC** | Integrität | Hoch | Falsche Kundendaten → Geschäftsschaden |
| **Netzwerk** | Verfügbarkeit | Hoch | Kundenzugriff zentral abhängig |
| **Netzwerk** | Vertraulichkeit | Sehr hoch | Datenübertragung über Internet möglich |

**Gesamtschutz: Sehr hoch** (wegen Maximumprinzip)

---

## 6.3 Modellierung eines arbeitsplatzbezogenen Sicherheitskonzeptes nach BSI IT-Grundschutz {#63-modellierung}

**Einordnung:** Die Modellierung zeigt die praktische Anwendung des Grundschutz-Kompendiums und wird in AP1 oft mit Schutzbedarfsanalyse kombiniert.

### BSI IT-Grundschutz-Kompendium

Das BSI (Bundesamt für Sicherheit in der Informationstechnik) stellt im Kompendium standardisierte **Bausteine** bereit. Sie sind in **zehn Schichten** geordnet:

| Art | Schicht | Inhalt (Beispiel-Baustein) |
|---|---|---|
| Prozess | **ISMS** | Sicherheitsmanagement |
| Prozess | **ORP** | Organisation und Personal (z. B. Identitäts- und Berechtigungsmanagement) |
| Prozess | **CON** | Konzepte und Vorgehensweisen (z. B. Datensicherungskonzept) |
| Prozess | **OPS** | Betrieb (z. B. Patch- und Änderungsmanagement) |
| Prozess | **DER** | Detektion und Reaktion (z. B. Behandlung von Sicherheitsvorfällen) |
| System | **APP** | Anwendungen (z. B. Webbrowser) |
| System | **SYS** | IT-Systeme (z. B. SYS.2.1 Allgemeiner Client) |
| System | **IND** | Industrielle IT |
| System | **NET** | Netze und Kommunikation |
| System | **INF** | Infrastruktur (z. B. Serverraum) |

Jeder Baustein enthält:
- eine **Beschreibung** (Zielsetzung, Abgrenzung),
- die **Gefährdungslage** (typische Gefährdungen für das Zielobjekt),
- die **Anforderungen**, gegliedert in **Basis-Anforderungen** (vorrangig umzusetzen), **Standard-Anforderungen** (für normalen Schutzbedarf; zusammen mit den Basis-Anforderungen der Stand der Technik) und **Anforderungen bei erhöhtem Schutzbedarf**.

**Modellierung:** Jedem Zielobjekt des Informationsverbunds (Anwendung, IT-System, Raum, Verbindung) werden die passenden Bausteine zugeordnet – nach der Schutzbedarfsfeststellung.

⚠️ **Nicht verwechseln:** Basis-, Kern- und Standard-Absicherung sind die drei **Vorgehensweisen** nach BSI-Standard 200-2 – sie legen fest, wie umfassend eine Institution den IT-Grundschutz umsetzt. Anforderungsstufen eines Bausteins sind sie nicht.

### ISMS – Informations-Sicherheitsmanagementsystem

**Zweck:** Ein geplanter, gesteuerter, kontinuierlicher Prozess zur Etablierung und Aufrechterhaltung der Informationssicherheit im Unternehmen.

**Merkmale:**
- Risikobasiert (Schutzbedarf analysieren, Restrisiken akzeptieren)
- Dokumentiert (Richtlinien, Verfahren, Maßnahmen)
- Regelmäßig überprüft und angepasst (PDCA-Zyklus: Plan, Do, Check, Act)
- **Norm:** ISO 27001 (internationale Norm für ISMS)

### Risiko-Klassifikation

**Risiko = Eintrittswahrscheinlichkeit × Schadenshöhe**

| Wahrscheinlichkeit | Schaden: normal | Schaden: hoch | Schaden: sehr hoch |
|---|---|---|---|
| **Hoch** (>50%) | Mittel | Hoch | Kritisch |
| **Mittel** (10–50%) | Niedrig | Mittel | Hoch |
| **Niedrig** (<10%) | Niedrig | Niedrig | Mittel |

**Maßnahmenstrategie:**
- **Kritisch:** Sofort beheben oder System abschalten
- **Hoch:** Priorisiert umsetzen
- **Mittel/Niedrig:** Überwachen, bei Gelegenheit beheben

---

### Risikoanalyse und Risikomatrix

Nicht jedes Risiko verdient dieselbe Aufmerksamkeit. Die **Risikomatrix** ordnet Risiken nach
zwei Achsen: **Eintrittswahrscheinlichkeit** und **Schadenshöhe**.

| | **geringer Schaden** | **hoher Schaden** |
|---|---|---|
| **hohe Wahrscheinlichkeit** | **vermindern** — Standardmaßnahmen, Routine | ⛔ **sofort behandeln** — höchste Priorität |
| **geringe Wahrscheinlichkeit** | **akzeptieren** — bewusst tragen | **vermeiden oder übertragen** — Redundanz, Versicherung |

**Die vier Strategien:**

- **Vermeiden** — die risikobehaftete Tätigkeit unterlassen oder ersetzen
- **Vermindern** — Eintrittswahrscheinlichkeit oder Schaden senken (technische Maßnahmen)
- **Übertragen** — auf einen Dritten verlagern (Versicherung, Dienstleistervertrag)
- **Akzeptieren** — bewusst tragen, dokumentiert und mit Restrisiko-Freigabe

**Beispiel:** Ein zwölf Jahre alter Switch fällt selten aus, sein Ausfall wäre aber teuer →
**geringe Wahrscheinlichkeit, hoher Schaden** → Ersatzgerät vorhalten oder versichern.
Phishing dagegen passiert **häufig** und kann teuer werden → **sofort behandeln**: Schulung,
Filter, Meldewege.

⚠️ **Die Matrix ersetzt kein Urteil, sie ordnet es.** Zwei Risiken im selben Feld können
unterschiedlich dringend sein — die Einordnung ist der Anfang der Diskussion, nicht ihr Ende.

---


## 6.4 Umsetzung des arbeitsplatzbezogenen Sicherheitskonzeptes unterstützen {#64-umsetzung}

**Einordnung:** Die praktische Umsetzung ist das Ziel aller vorherigen Planungsschritte. AP1-Aufgaben fokussieren oft auf technische Härtung und Backup-Verfahren.

### Security by Design und Security by Default

- **Security by Design:** Sicherheit von Anfang an in Entwicklung und Planung einbeziehen (nicht nachträglich)
- **Security by Default:** Sichere Voreinstellungen ab Werk (z. B. Firewall aktiv, unnötige Ports geschlossen)

### Härtung des Betriebssystems

- Unnötige Dienste deaktivieren (Angriffsfläche minimieren)
- Updates und Patches zeitnah einspielen (Schwachstellen schließen)
- Minimale Rechte vergeben (Least Privilege Principle)
- Audit-Logging aktivieren (Änderungen protokollieren)

### Datensicherung und Backup-Verfahren

**Definitionen:**

| Verfahren | Speicherbedarf | Wiederherstellungsaufwand |
|---|---|---|
| **Vollsicherung** | Maximal (kompletter Datenbestand pro Sicherung) | Minimal (nur eine Sicherung nötig) |
| **Differenzielle Sicherung** | Mittel (alle Änderungen seit der letzten VOLLsicherung — wächst von Tag zu Tag) | Gering (Vollsicherung + letzte differenzielle Sicherung) |
| **Inkrementelle Sicherung** | Minimal (nur Änderungen seit der letzten Sicherung, egal welcher Art) | Hoch (Vollsicherung + ALLE inkrementellen Sicherungen seit der Vollsicherung, in richtiger Reihenfolge) |

**Beispiel: Wochenplan (100 GB Daten, täglich 10 GB neue/geänderte Daten)**

| Tag | Verfahren | Größe | **Für den Restore nötig** | **Belegter Speicher (kumuliert)** |
|---|---|---|---|---|
| Mo 09:00 | Vollsicherung | 100 GB | 100 GB (nur die Vollsicherung) | 100 GB |
| Di 09:00 | Diff (seit Mo) | 10 GB | 110 GB (Voll + Di) | 110 GB |
| Mi 09:00 | Diff (seit Mo) | 20 GB | 120 GB (Voll + Mi) | 130 GB |
| Do 09:00 | Diff (seit Mo) | 30 GB | 130 GB (Voll + Do) | 160 GB |
| Fr 09:00 | Diff (seit Mo) | 40 GB | 140 GB (Voll + Fr) | 200 GB |
| Sa 09:00 | Vollsicherung | 100 GB | 100 GB (neue Vollsicherung) | 300 GB |

⚠️⚠️ **Zwei Zahlen, die man nicht verwechseln darf.** „Für den Restore nötig" ist der Umfang, den
man zum **Wiederherstellen** braucht — bei differenzieller Sicherung immer **Vollsicherung + die
eine letzte Differenz**, nie mehr. „Belegter Speicher" ist die **Summe aller geschriebenen
Sicherungen** und wächst über die Woche. **Prüfungsaufgaben fragen mal das eine, mal das andere —
lies genau, wonach gefragt ist.**
⚠️ **Bei inkrementeller Sicherung fallen die zwei Spalten auseinander:** der belegte Speicher ist
kleiner (je 10 GB statt wachsend), der Restore braucht dafür **Vollsicherung + ALLE**
inkrementellen Sätze in der richtigen Reihenfolge.

**3-2-1-Regel:** Mindestens 3 Kopien (Original + 2 Backups), auf 2 verschiedenen Medientypen (z. B. Festplatte + Tape), 1 Kopie offsite (räumlich getrennt).

**Ein Backup, das nie zurückgespielt wurde, ist kein Backup — es ist eine Hoffnung.**

- **Restore-Test:** Die Rücksicherung wird **regelmäßig geprobt und dokumentiert** — auf einem
  Testsystem, mit einer echten Datei, gegen eine Prüfsumme. Erst das belegt, dass die Daten
  **vollständig und unverändert** zurückkommen. ⚠️ **Die häufigsten Ausfälle merkt man sonst erst
  im Ernstfall:** ein Sicherungsjob, der seit Wochen mit Fehler endet, ein defektes Band, eine
  Sicherung ohne die entscheidende Datenbank.
- **Offline-Kopie (Air-Gap):** Mindestens eine Sicherung liegt **physisch getrennt vom Netz** —
  ausgeworfenes Band, abgestecktes Laufwerk, unveränderbarer Cloud-Speicher. ⛔ **Ransomware
  verschlüsselt alles, was erreichbar ist**, und das schließt ein online eingebundenes NAS ein.
- **Aufbewahrungsdauer** (Retention) und **Sicherungsfenster** gehören ins Konzept: Wie viele
  Generationen werden aufbewahrt, und wann darf gesichert werden, ohne den Betrieb zu stören?

**NAS (Network Attached Storage):** Zentraler Speicher mit Netzwerkanbindung — sichert die Verfügbarkeit von Daten und dient als Backup-Ziel. (Redundanz durch RAID-Level ist laut Katalog Stoff der AP2 – siehe „RAID-Systeme (AP2)“ direkt hier unten.)

### Wiederherstellungsziele, Generationenprinzip und Snapshots

| Begriff | Bedeutung | Folgt daraus | Beispiel |
|---|---|---|---|
| **RPO** (Recovery Point Objective) | maximal tolerierbarer **Datenverlust** – Zeit zwischen letzter Sicherung und Ausfall | **Sicherungstakt** | „höchstens die Daten der letzten Stunde“ → RPO 1 h → mindestens stündlich sichern |
| **RTO** (Recovery Time Objective) | maximal tolerierbare **Ausfallzeit** bis zum Wiederanlauf | Restore-Verfahren, Ersatzhardware, geprobter Ablauf | „in vier Stunden wieder verfügbar“ → RTO 4 h |

⚠️ Eine nächtliche Sicherung erfüllt kein RPO von einer Stunde: Fällt das System kurz vor der nächsten Sicherung
aus, fehlen fast 24 Stunden. **Merkhilfe:** **P**oint = wie viele Daten weg, **T**ime = wie lange Stillstand.

**Großvater-Vater-Sohn-Prinzip (Generationenprinzip):** regelt die **Aufbewahrung** der Sicherungsmedien.
- **Sohn:** tägliche Sicherungen (z. B. Mo–Do), Medien nach einer Woche wieder überschrieben.
- **Vater:** wöchentliche Sicherung (z. B. freitags), Medien nach einem Monat wieder überschrieben.
- **Großvater:** monatliche Sicherung, lange aufbewahrt (z. B. ein Jahr), gern außer Haus.
- **Vorteil:** Auch ein Stand von vor Wochen oder Monaten lässt sich zurückholen (etwa wenn eine Beschädigung erst
  spät auffällt) – mit einer überschaubaren Zahl von Medien. ⚠️ Nicht mit der 3-2-1-Regel verwechseln: 3-2-1 regelt
  die **Verteilung** der Kopien, das Generationenprinzip ihre **Aufbewahrungsdauer**.

**Snapshot vs. Backup:** Ein **Snapshot** friert den Zustand eines Datenträgers in Sekunden ein und speichert danach
nur die Änderungen – gut für einen **schnellen Rückgriff** und ein kurzes RPO. Er liegt aber **auf demselben
System**: Defekt, Brand oder Ransomware treffen ihn mit. Ein **Backup** ist eine Kopie auf ein **anderes Medium bzw.
an einen anderen Ort**. Snapshots ergänzen Backups, sie ersetzen sie nicht.

| Sicherungsziel | Stärke | Schwäche |
|---|---|---|
| **Band (Tape)** | günstig je TB, entnehmbar, offline lagerbar | Restore langsamer |
| **NAS** im eigenen Netz | schneller Restore | dauerhaft online → durch Ransomware erreichbar |
| **Cloud** | automatisch außer Haus | Restore hängt an der Internetbandbreite |
| **USB-Festplatte im Wechsel** | einfach offline zu lagern | abhängig vom manuellen Wechsel |

**Eine Strategie für RPO 1 h / RTO 4 h:** wöchentlich Vollsicherung, täglich inkrementell oder differenziell,
zusätzlich **stündliche Snapshots bzw. Inkremente**; Ziel ein schnell zurückspielbares NAS **plus** eine Offline- bzw.
Offsite-Kopie (3-2-1); Rotation nach Großvater-Vater-Sohn; **Restore-Tests**, die die Wiederherstellungsdauer messen.

### RAID-Systeme (AP2)

> **AP2-Stoff** (Prüfungskatalog Teil 2) – hier für die Klausur im LF3. In der AP1 wird RAID nicht geprüft.

**RAID** (Redundant Array of Independent Disks) fasst mehrere Festplatten zu einem **Verbund** zusammen.
Ziel ist **Verfügbarkeit** (eine Platte darf ausfallen) und/oder **Geschwindigkeit**. Grundtechniken:

- **Striping** – die Daten werden blockweise auf mehrere Platten **verteilt** (schneller, aber keine Redundanz).
- **Spiegelung (Mirroring)** – dieselben Daten liegen **identisch** auf zwei Platten.
- **Parität** – aus den Datenblöcken eines Streifens wird per **XOR-Verknüpfung** ein Prüfblock berechnet.
  Fehlt ein Block, ergibt die XOR-Verknüpfung der übrigen Blöcke mit der Parität genau diesen Block
  (Beispiel: 1 ⊕ 0 = 1; fehlt der erste Block, gilt 0 ⊕ 1 = 1).

| Level | Prinzip | Mindestens | Nettokapazität (n Platten gleicher Größe) | Verkraftet sicher |
|---|---|---|---|---|
| **RAID 0** | Striping ohne Redundanz | 2 | n × Kapazität (100 %) | **keinen** Ausfall – fällt eine Platte aus, ist der **ganze Verbund** verloren |
| **RAID 1** | Spiegelung | 2 | Kapazität **einer** Platte (50 %) | einen Ausfall |
| **RAID 5** | Striping mit **verteilter Parität** | 3 | (n − 1) × Kapazität | einen Ausfall |
| **RAID 6** | Striping mit **doppelter** verteilter Parität | 4 | (n − 2) × Kapazität | **zwei** Ausfälle |
| **RAID 10** | Striping über gespiegelte Paare (1 + 0) | 4 | Hälfte des Rohspeichers (50 %) | einen sicher; mit Glück einen **je Spiegelpaar** – fallen beide Platten **eines** Paares aus, sind die Daten verloren |

**Rechenbeispiele:** 4 × 2 TB → RAID 5 = 3 × 2 TB = **6 TB** (75 %), RAID 10 = 8 TB ÷ 2 = **4 TB**, RAID 6 = 2 × 2 TB = **4 TB** (50 %).
6 × 4 TB als RAID 6 = (6 − 2) × 4 TB = **16 TB**. ⚠️ **Ungleiche Platten:** Jede Platte zählt nur mit der Größe der
**kleinsten** – ein RAID 1 aus 2 TB und 4 TB hat **2 TB** netto.

**Welches Level wofür?**
- Viel Speicher, ein Ausfall darf nichts kosten → **RAID 5** (bei vier Platten 75 % nutzbar).
- Zwei Ausfälle sollen verkraftbar sein → **RAID 6** (kostet eine weitere Platte für die zweite Parität).
- Viele Schreibzugriffe (Datenbank) → **RAID 10**: Es muss beim Schreiben **keine Parität** berechnen. RAID 5 muss
  bei jedem Schreiben die Parität lesen und neu berechnen (**Write Penalty**); RAID 10 schreibt nur doppelt, und der
  Rebuild kopiert nur einen Spiegel.
- Nur Geschwindigkeit, Daten unwichtig (Videoschnitt-Zwischenspeicher) → **RAID 0**.

**Betrieb und Ausfall:**
- **degraded** – eine Platte ist ausgefallen, der Verbund arbeitet **ohne Redundanz** weiter. Bei RAID 5 kostet jetzt
  jeder weitere Ausfall alle Daten → Platte **sofort** tauschen.
- **Rebuild** – der Controller berechnet die Daten der ausgefallenen Platte aus **Spiegel oder Parität** und schreibt
  sie auf die Ersatzplatte (nicht aus dem Backup; ein Wechsel des Levels heißt Migration).
- **Hot Spare** – eine zusätzliche, im Betrieb bereitstehende Platte; fällt eine Platte aus, startet der Rebuild
  **automatisch**. Die Zeit ohne Redundanz wird kürzer.
  Die Hot Spare trägt keine Daten und zählt **nicht** zur Nettokapazität; sie ersetzt weder Parität noch Backup.
- ⚠️ **Platten derselben Charge** altern gleich. Der Rebuild liest alle Platten vollständig und belastet sie stark –
  genau dann fällt oft eine zweite aus.
- ⚠️ **Im Zustand degraded gilt:** Platte sofort tauschen, ein aktuelles Backup sicherstellen (fällt eine zweite
  Platte aus, ist bei RAID 5 alles verloren) und die Last während des Rebuilds gering halten. Ein Umwandeln in
  RAID 0 gibt die Redundanz endgültig auf.

**RAID 0+1 und RAID 10 – nicht dasselbe:** Beide kombinieren Striping und Spiegelung (mindestens vier Platten,
50 % netto), aber in **umgekehrter Reihenfolge**.
- **RAID 0+1:** erst zwei **Stripesätze** (RAID 0), dann werden diese **gespiegelt**. Fällt eine Platte aus, ist ihr
  **ganzer Stripesatz** außer Betrieb; jeder weitere Ausfall im anderen Satz kostet alles (bei vier Platten **2 von 3**
  möglichen Fällen). Der Rebuild muss den ganzen Stripesatz neu schreiben.
- **RAID 10 (1+0):** erst **Spiegelpaare** (RAID 1), dann Striping über die Paare. Tödlich ist nur noch der Ausfall
  des **Spiegelpartners** (**1 von 3**), der Rebuild kopiert eine Platte. → **RAID 10 ist robuster** und Praxisstandard.

| | **Hardware-RAID** | **Software-RAID** |
|---|---|---|
| Wer rechnet? | eigener **Controller** mit eigenem Prozessor | das **Betriebssystem** |
| Vorteil | entlastet die Server-CPU, oft mit Pufferspeicher (Cache) und Batterie- oder Flash-Schutz | keine Zusatzhardware |
| Nachteil | Kosten, Bindung an den Controller | belastet die CPU |

⛔ **RAID ist kein Backup.** RAID schützt vor dem **Ausfall einer Platte** – nicht vor versehentlichem Löschen,
Ransomware, Brand oder Diebstahl. Eine gelöschte oder verschlüsselte Datei ist **sofort auf allen Platten** gelöscht
bzw. verschlüsselt. Nur ein Backup hält **ältere Stände** getrennt vor (3-2-1-Regel oben). Gegen Stromausfall hilft
eine **USV**, nicht das RAID.

### Zugangs- vs. Zugriffskontrolle

**Wichtige Unterscheidung:**

| Kontrollart | Frage | Beispiel | Maßnahme |
|---|---|---|---|
| **Zugang** (Access Control) | Wer kommt an das System? | Gebäudezutritt, Login am PC | Ausweiskarten, Passwort, Biometrie |
| **Zugriff** (Authorization) | Wer darf welche Daten nutzen? | Dateiberechtigungen, DB-Rollen | ACL (Access Control List), RBAC (Role-Based) |

**Merksatz:** Zugang ist das Türschloss zum Gebäude/System, Zugriff ist der Schlüssel zum einzelnen Aktenschrank (den Daten)!

### Verschlüsselungstechniken (Wiederholung + Vertiefung)

- **Symmetrisch:** AES-256 (schnell, sicher), für Daten in Ruhe (At-Rest)
- **Asymmetrisch:** RSA-2048 (langsam), für Schlüsselaustausch
- **Hybrid:** TLS mit temporären Sessionkeys (praktischer Standard) – asymmetrisch für Authentifizierung und
  Schlüsselaustausch, symmetrisch (AES) für die Nutzdaten, weil asymmetrische Verfahren für große Datenmengen zu langsam sind

**Unsichere Protokolle und ihr sicherer Ersatz:** Telnet, HTTP, FTP und POP3 übertragen alles im Klartext – auch Passwörter.

| unsicher | sicherer Ersatz |
|---|---|
| Telnet (Konsole) | **SSH**, Port 22 |
| HTTP | **HTTPS** = HTTP über TLS, Port 443 |
| FTP | **SFTP** (Dateiübertragung über SSH) oder FTPS (FTP über TLS) |
| POP3 / IMAP | **POP3S** (Port 995) / **IMAPS** (Port 993) |

**Sicherheitsmaßnahme und OSI-Schicht:** VLAN-Trennung und Port-Security → Schicht 2 · Paketfilter → Schicht 3 und 4
(IP-Adresse, Port) · IPsec-VPN → Schicht 3 · TLS → Schicht 6 (Prüfungszuordnung) · Proxy-Firewall → Schicht 7.

### Hashwerte, Zertifikate, digitale Signaturen

| Konzept | Definition | Einsatz | Beispiel |
|---|---|---|---|
| **Hashwert** | Einwegfunktion; gleicher Input → gleicher Hashwert | Integritätsprüfung, Passwort-Speicherung | SHA-256 |
| **Zertifikat** | Digitale Identität (ausgestellt von CA = Certificate Authority) | Webseiten-Authentizität, Vertrauen | SSL/TLS-Zertifikat |
| **Digitale Signatur** | Hash wird mit privatem Schlüssel signiert → Authentizität + Integrität | E-Mail-Authentizität, Vertragsunterzeichnung | Signierung mit privatem RSA-Schlüssel |

### Authentifizierung und Autorisierung

**Authentifizierungs-Faktoren (Was/Wer bin ich?):**
1. **Wissen:** Passwort, PIN, Geheimfrage
2. **Besitz:** Hardware-Token, Smartphone, Smartcard
3. **Biometrie:** Fingerabdruck, Iris-Scan, Gesichtserkennung

**Zwei-Faktor-Authentifizierung (2FA):** Kombination von mindestens 2 Faktoren (z. B. Passwort + SMS-Code oder Yubikey).

**Passwort-Policy bewerten:**
- ✓ Mindestens 12 Zeichen, Passphrasen bevorzugt
- ✓ Keine erzwungenen Wechsel ohne Anlass
- ✓ Sichere Speicherung (gehashed mit Salt)
- ✗ Keine unnötigen Sonderzeichen erzwingen (führt zu Schwachstellen)
- ✗ Keine regelmäßigen Rotationen (BSI empfiehlt dagegen)

### Personal Firewall konfigurieren

Eine **Personal Firewall** (Host-Firewall, z. B. die Windows-Firewall) läuft **auf dem einzelnen Rechner** und schützt nur ihn. Anders als die Netzwerk-Firewall am Übergang zum Internet kennt sie die **Programme**: Ihre Regeln können für eine bestimmte Anwendung gelten.

- **Ein-/Ausgangsregeln definieren:** Welche Anwendung darf nach draußen, welche Verbindung darf herein?
- **Beispiel:** Webbrowser erlaubt, aber P2P-Software blockiert
- **Softwarezugriff auf das Internet sperren:** eine **ausgehende** Regel für das Programm (Programmpfad) mit der Aktion **Blockieren** – das Programm läuft weiter, kommt aber nicht mehr ins Netz. In der Werkseinstellung blockiert die Windows-Firewall eingehende und erlaubt ausgehende Verbindungen; darum braucht das Sperren eine ausgehende Regel.
- **Standardrichtung:** Deny by default (erst zulassen, was nötig ist)
- **Regelreihenfolge:** Ein Firewall-Regelwerk wird **von oben nach unten** geprüft; die **erste passende Regel** entscheidet, spätere werden nicht mehr gelesen. Ein breites Verbot vor einer engen Erlaubnis macht diese wirkungslos – darum stehen spezielle Regeln oben und die Standardregel (alles verbieten) ganz unten. Das gilt für die Personal Firewall wie für die Netzwerk-Firewall.
- **Netzwerkprofile:** Windows unterscheidet Domäne, Privat und Öffentlich; im öffentlichen WLAN gelten die strengsten Regeln.
- **Zentral statt am Einzelplatz:** Im Unternehmen setzt die IT die Regeln per Gruppenrichtlinie, damit Benutzer sie nicht abschalten oder aufweichen.

**Merksatz:** Die Netzwerk-Firewall schützt das Netz an der Grenze, die Personal Firewall schützt den Rechner – und kennt die Programme.

### Netzwerk-Firewalls und DMZ (AP2)

> **AP2-Stoff** (Prüfungskatalog Teil 2) – hier für die Klausur im LF3.

Eine **Netzwerk-Firewall** steht am Übergang zwischen Netzen (z. B. LAN ↔ Internet); über sie läuft der gesamte
Verkehr nach außen. Die Firewall-Arten unterscheiden sich darin, **wie tief** sie ein Paket prüfen:

| Art | prüft | Merkmal |
|---|---|---|
| **Paketfilter** (statisch, zustandslos) | jedes Paket **einzeln** nach IP-Adressen, Protokoll und **Ports** (Schicht 3/4) | schnell und einfach; kennt keine Verbindung – Antwortpakete brauchen eine eigene Regel |
| **Stateful Inspection** (zustandsorientierter Paketfilter) | wie der Paketfilter **plus Verbindungszustand** (Schicht 3/4) | führt eine **Verbindungstabelle**; Antworten auf eine erlaubte, von innen aufgebaute Verbindung lässt sie automatisch durch, unaufgeforderte Pakete von außen nicht |
| **Application-Level-Gateway** (Proxy-Firewall) | den **Inhalt** bis zur **Anwendungsschicht** (Schicht 7), z. B. HTTP | der Proxy baut **eigene** Verbindungen nach außen auf, Client und Server sprechen nie direkt; kann Inhalte filtern, ist aber langsamer |
| **Next-Generation Firewall** (NGFW) | Anwendungen und Inhalte (Deep Packet Inspection) | erkennt Anwendungen unabhängig vom Port, oft mit integriertem IPS (siehe unten) |

Im Netzplan der IHK steht das Firewall-Symbol für eine **Stateful Inspection Firewall** (bis Schicht 4).

**DMZ (Demilitarisierte Zone):** ein **eigenes Netzsegment** zwischen Internet und LAN für Server, die **aus dem
Internet erreichbar** sein müssen – Webserver, Mailserver, Shop. Wird ein solcher Server übernommen, steht der Angreifer
in der DMZ, **nicht im internen LAN**. Aufbau: **zwei Firewalls** (Internet → äußere Firewall → DMZ → innere Firewall →
LAN) oder **eine Firewall mit drei Schnittstellen** (Internet, DMZ, LAN). Typische Regeln:
- Internet → DMZ: nur die nötigen Dienste (z. B. TCP 443 zum Webserver, 25 zum Mailserver)
- Internet → LAN: **gesperrt**
- DMZ → LAN: gesperrt bis auf eng begrenzte Ausnahmen (z. B. Webserver → Datenbank auf genau einem Port)
- LAN → DMZ und LAN → Internet: nach Bedarf erlaubt

Interne Server (Dateiserver, Datenbank mit Kundendaten, Domänencontroller) gehören **nicht** in die DMZ.

**Merksatz:** Je tiefer die Firewall prüft, desto mehr erkennt sie – und desto langsamer ist sie. Was von außen
erreichbar sein muss, steht in der DMZ, nie im LAN.

### Angriffserkennung: IDS und IPS (AP2)

> **AP2-Stoff** (Prüfungskatalog Teil 2) – hier für die Klausur im LF3.

Eine Firewall entscheidet nach **Regeln** (Adresse, Port), ob eine Verbindung erlaubt ist. Ein Angriff, der über
eine **erlaubte** Verbindung kommt (z. B. Port 443 zum Webserver), läuft durch. Dafür gibt es die Angriffserkennung:

| | **IDS** – Intrusion Detection System | **IPS** – Intrusion Prevention System |
|---|---|---|
| Aufgabe | erkennt Angriffe und **meldet** sie (Alarm) | erkennt Angriffe und **blockiert** sie (verwirft Pakete, unterbricht Verbindungen) |
| Lage | **passiv** – bekommt eine **Kopie** des Verkehrs über einen **Spiegelport** (Port Mirroring, SPAN) des Switches oder einen TAP | **inline** – liegt direkt im Datenstrom |
| Folge | bremst nichts, ein Ausfall unterbricht nichts; ein Fehlalarm stört den Betrieb nicht | jedes Paket läuft hindurch; ein **Fehlalarm kann legitime Verbindungen blockieren** |

**Bauformen:**
- **NIDS** (netzwerkbasiert) – beobachtet den Verkehr eines ganzen **Netzsegments**, z. B. am Spiegelport.
- **HIDS** (hostbasiert) – läuft als Software **auf einem Rechner** und wertet Logdateien, Prozesse und Dateien aus.
  Typisch ist die **Integritätsprüfung**: Das HIDS speichert **Prüfsummen (Hashes)** wichtiger Systemdateien und meldet,
  wenn sich eine Datei unerwartet ändert.

**Platzierung im Netzplan:** Ein NIDS sieht nur den Verkehr des Segments, an dem es hängt.
- **Hinter der Firewall** (im LAN bzw. in der DMZ): sieht nur, was die Firewall **durchgelassen** hat – also genau die
  Angriffe, die über erlaubte Verbindungen kommen; wenige, aussagekräftige Alarme. Üblicher Platz.
- **Vor der Firewall** (Richtung Internet): sieht **alle** Angriffsversuche, auch die, die die Firewall ohnehin
  abweist – viele Alarme ohne Handlungsbedarf.
- **In der DMZ:** überwacht die aus dem Internet erreichbaren Server, das häufigste Angriffsziel.
- Ein **IPS** steht **inline** zwischen Firewall und zu schützendem Netz; ein **HIDS** läuft auf dem einzelnen Server.

**Erkennungsmethoden** (beide Bauformen können beide nutzen):
- **Signaturbasiert** – vergleicht mit **Mustern bekannter Angriffe**; wenige Fehlalarme, braucht **regelmäßige Updates**,
  ist blind für Neues.
- **Anomaliebasiert** – lernt zuerst das **normale Verhalten** und meldet Abweichungen; erkennt auch neue Angriffe
  (Zero-Day), neigt aber zu mehr Fehlalarmen.

**Fehlalarme:** **False Positive** = Alarm, obwohl der Verkehr harmlos war. **False Negative** = ein echter Angriff wird
übersehen – der gefährlichere Fehler. Blockiert ein IPS nach einem Signatur-Update legitimen Verkehr, wird der Fall
**geprüft** und eine **gezielte Ausnahme** angelegt – nicht das IPS abgeschaltet oder auf Updates verzichtet.

**Typisches Muster:** Viele Verbindungsversuche auf **viele verschiedene Ports** von **einer** Adresse = **Portscan**
(Suche nach offenen Diensten, oft Vorbereitung eines Angriffs).

⚠️ **Verschlüsselung:** Bei HTTPS ist der Inhalt per **TLS** verschlüsselt. Ein NIDS sieht nur Verbindungsdaten
(Adressen, Ports, Zeitpunkte) – außer der Verkehr wird an einer Stelle entschlüsselt (**TLS-Inspection**) oder ein HIDS
prüft auf dem Server.

**Next-Generation Firewall (NGFW):** prüft nicht nur Adressen und Ports wie ein einfacher **Paketfilter**, sondern
erkennt **Anwendungen** und Inhalte (Deep Packet Inspection) und bringt oft ein **integriertes IPS** mit.

**Reaktion auf einen Alarm:** (1) Alarm prüfen – echter Angriff oder Fehlalarm? (2) betroffenes System eingrenzen,
z. B. vom Netz trennen (3) Ursache und Ausmaß analysieren, Spuren sichern (4) Schwachstelle beheben, System bereinigen
(5) Vorfall dokumentieren, Regeln anpassen.

| System | Hauptaufgabe |
|---|---|
| Firewall | erlaubt oder sperrt Verbindungen nach Regeln |
| IDS | erkennt Angriffe und meldet sie |
| IPS | erkennt Angriffe und blockiert sie im Datenstrom |
| Virenscanner | findet Schadsoftware in Dateien auf dem Rechner |

**Merksatz:** IDS und IPS **ergänzen** Firewall und Virenschutz, sie ersetzen sie nicht.

---

## Typische IHK-Aufgabenstellungen

1. **Schutzbedarfsanalyse für ein konkretes Szenario durchführen** (Tabelle ausfüllen, Begründungen geben)
2. **Unterschied zwischen Anonymisierung und Pseudonymisierung erklären** und DSGVO-Konsequenzen benennen
3. **Backup-Verfahren vergleichen** (Speicherbedarf, Wiederherstellung, Wochenplan berechnen)
4. **Sicherheitsmaßnahmen für einen Arbeitsplatz mit sensiblen Daten empfehlen** (technisch, organisatorisch, personell)
5. **BSI IT-Grundschutz-Bausteine einem Szenario zuordnen** und Maßnahmen ableiten
6. **Social-Engineering-Angriffe unterscheiden und Gegenmaßnahmen ableiten** (Phishing, Spear-Phishing, CEO-Fraud, Pretexting, Baiting, Tailgating)
7. **Drei Erkennungsmerkmale einer Phishing-Mail nennen und begründen**, warum sie ein Warnsignal sind

---

## Selbsttest

**Frage 1:** Definieren Sie die CIA-Schutzziele und geben Sie je ein praktisches Beispiel aus Ihrem Arbeitsalltag.

<details>
<summary>Lösung anzeigen</summary>

- **Verfügbarkeit:** System ist verfügbar, wenn es angefordert wird (z. B. Webserver erreichbar). Gegenmaßnahme: Redundante Server, Backups.
- **Vertraulichkeit:** Nur berechtigte können Daten einsehen (z. B. Gehälter). Gegenmaßnahme: Verschlüsselung, Zugriffskontrolle.
- **Integrität:** Daten sind unverfälscht (z. B. Rechnungsbetrag nicht manipuliert). Gegenmaßnahme: Hashwerte, digitale Signaturen.

</details>

**Frage 2:** Welcher Unterschied besteht zwischen einem IT-Sicherheitsbeauftragten und einem Datenschutzbeauftragten? Ist der DSB eine gesetzliche Pflicht?

<details>
<summary>Lösung anzeigen</summary>

- **IT-Sicherheitsbeauftragter:** Generelle Informationssicherheit (Schutzziele, Richtlinien), i. d. R. freiwillig.
- **Datenschutzbeauftragter:** Speziell personenbezogene Daten, DSGVO/BDSG-Compliance.
- **Pflicht:** Ja — nach § 38 BDSG i. d. R. ab 20 Personen, die ständig mit automatisierter Verarbeitung personenbezogener Daten beschäftigt sind; unabhängig davon nach Art. 37 DSGVO u. a. bei umfangreicher Verarbeitung besonderer Datenkategorien.

</details>

**Frage 3:** Sie sichern täglich 50 GB neue Daten. Welches Backup-Verfahren würden Sie für eine Wochenplanung empfehlen und warum?

<details>
<summary>Lösung anzeigen</summary>

Beide Varianten durchrechnen (Vollsicherung Mo: 500 GB Datenbestand, danach täglich 50 GB Änderungen):

**Differenziell** (sichert immer alles seit Mo — wächst täglich):
- Di 50, Mi 100, Do 150, Fr 200, Sa 250, So 300 GB → Summe Di–So: 1.050 GB (+ 500 GB Voll = 1.550 GB)
- Wiederherstellung: Voll + letzte differenzielle Sicherung (nur 2 Sätze) → einfach und schnell

**Inkrementell** (sichert nur seit der letzten Sicherung — konstant):
- Di–So: je 50 GB → Summe 300 GB (+ 500 GB Voll = 800 GB)
- Wiederherstellung: Voll + alle 6 inkrementellen Sätze in richtiger Reihenfolge → aufwendiger, fehleranfälliger

**Empfehlung:** Bei knappem Speicher inkrementell, bei Priorität auf schneller/einfacher Wiederherstellung differenziell. In der IHK-Prüfung: Rechenweg und Begründung zeigen!

</details>

**Frage 4:** Erklären Sie die 3-2-1-Backup-Regel und nennen Sie konkrete Medien für ein mittelständisches Unternehmen.

<details>
<summary>Lösung anzeigen</summary>

**3-2-1-Regel:**
- **3 Kopien:** Original + 2 Backups (Original + Backup1 vor Ort + Backup2 offsite)
- **2 Medientypen:** z. B. Festplatte (NAS) + Tape oder Cloud
- **1 Kopie offsite:** Schutz vor Gebäudezerfall, Brand, Diebstahl

**Beispiel für Mittelstand:**
- Backup1: NAS im Serverraum (täglich)
- Backup2: externe HDD oder Tape Vault (wöchentlich)
- Backup3: Cloud-Speicher oder externes Rechenzentrum (monatlich)

</details>

**Frage 5:** Unterscheiden Sie Zugangs- und Zugriffskontrolle an einem Beispiel aus einem Unternehmen.

<details>
<summary>Lösung anzeigen</summary>

- **Zugang:** Wer kommt ins Gebäude/zum PC? → Ausweiskarte, Login + Passwort.
- **Zugriff:** Wer darf welche Daten sehen? → Dateirechte: Max (Entwickler) hat Zugriff auf Quellcode, Maria (HR) nicht.
- **Praxis:** Max kann sich am PC anmelden (Zugang), aber nicht die Personaldatenbank öffnen (Zugriff blockiert).

</details>

---

**Frage 6:** Eine Mitarbeiterin erhält eine E-Mail: „Ihr Konto wird in 24 Stunden gesperrt. Klicken Sie hier und bestätigen Sie Ihr Passwort." Um welchen Angriff handelt es sich, woran erkennt man ihn, und wie muss sie reagieren?

<details>
<summary>Lösung anzeigen</summary>

**Angriff:** **Phishing** — eine Form des Social Engineering. (Wäre die Mail mit Namen, Abteilung und einem echten Vorgang personalisiert, wäre es **Spear-Phishing**.)

**Erkennungsmerkmale:** künstlicher **Zeitdruck** („24 Stunden"), Aufforderung zur **Passworteingabe** über einen Link — kein seriöser Anbieter fragt so nach Zugangsdaten —, dazu meist eine **abweichende Absenderadresse** und eine **unpersönliche Anrede**.

**Reaktion:** nicht klicken, nicht antworten, keine Daten eingeben. **Über einen bekannten zweiten Kanal rückfragen** (Telefonnummer aus dem Vertrag, nicht aus der Mail) und die Mail **an die IT bzw. den IT-Sicherheitsbeauftragten melden** — auch dann, wenn nichts passiert ist. Falls doch geklickt wurde: **sofort melden und das Passwort ändern.**

</details>

## Zusammenfassung & Lernhilfen

**Eselsbrücken:**
- **CIA:** Vertraulichkeit (C), Integrität (I), Verfügbarkeit (A) — drei Säulen, keine Verzichte!
- **TOM:** Technische + Organisatorische Maßnahmen = Doppelschlag gegen Risiken
- **Zugang vs. Zugriff:** Zugang = Tür (Wer?), Zugriff = Akte (Was darf?).
- **Anonymisierung:** Weg für immer; Pseudonymisierung: Wiederherstellbar mit Schlüssel.
- **3-2-1:** Drei Kopien, zwei Medien, eine offsite.

**Empfohlene Vertiefung:**
- BSI IT-Grundschutz-Kompendium (bsi.bund.de)
- DSGVO Art. 32, 37 (technische/organisatorische Maßnahmen, DSB-Pflichten)
- ISO 27001 Übersicht (Struktur ISMS)
