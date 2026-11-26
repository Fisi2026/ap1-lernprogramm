#!/usr/bin/env python3
"""tools/begriffe_r2a.py – FB-R2a: Schluesselbegriffe fuer die Fragen, die bisher keine hatten.

HERKUNFT DER EINTRAEGE: Haiku-Agent nach der Anweisung in prompts/begriffe_batch.md, danach von
Opus fachlich geprueft. Wo geprueft und geaendert wurde, steht ein Kommentar mit dem Grund – das
ist der eigentliche Wert dieser Datei: sie haelt fest, WAS am Agentenvorschlag falsch war.

REGELWERK (Nutzer-Entscheide 2026-07-21):
  * 2 bis 3 Pflicht-Eintraege, jeder als Alternativliste (zaehlt als EIN Begriff).
  * Mittelweg: gleichwertige deutsche Ausdruecke ja, Umschreibung ganzer Konzepte nein.
  * NIE die Gliederungsvokabel der Aufgabenstellung als Pflicht („Chancen", „Grenzen",
    „Position", „Massnahmen"). Wer das tut, belohnt das Abschreiben der Frage statt des Inhalts.
    Das war der EINZIGE systematische Fehler des Agenten in der M01-Probe (6/8 statt 7/8).
  * Jeder Pflichteintrag muss von der eigenen Musterloesung getroffen werden (test_freitext wacht).

Aufruf: python3 tools/begriffe_r2a.py   (danach ZWINGEND python3 build_fragen.py)
"""
import glob
import json
import os

NEU = {
    # ---------------- M01 (Haiku-Probe, von Opus korrigiert) ----------------
    "M01-013": {
        "pflicht": [["Lessons Learned", "gelernte Lektionen", "Lektionen"],
                    ["Dokumentation", "dokumentiert"],
                    ["Verbesserung", "kontinuierliche Verbesserung", "Wissenssicherung"]],
        "kuer": ["Projektabschluss", "Best Practices", "Reflexion", "Erkenntnisse"],
    },
    "M01-106": {
        "pflicht": [["Spezifisch", "Specific"],
                    ["Messbar", "Measurable", "quantifizierbar"],
                    ["Terminiert", "Time-bound", "Zeitgebunden"]],
        "kuer": ["SMART", "Realistisch", "Attraktiv", "Zielwert"],
    },
    # KORRIGIERT: „Position" war Gliederungsvokabel der Aufgabe. Bei einer Rechenaufgabe traegt
    # das ERGEBNIS die Antwort, nicht die Vokabel – deshalb der Zwischenwert 2.040 statt „Position".
    # Beide Schreibweisen noetig: die Normalisierung macht aus „3.360" -> „3 360", aus „3360" -> „3360".
    "M01-107": {
        "pflicht": [["Angebotssumme", "Gesamtsumme"],
                    ["2.040", "2040"],
                    ["3.360", "3360"]],
        "kuer": ["Netto", "Material", "Anfahrten", "Techniker"],
    },
    # KORRIGIERT: „Chancen"/„Grenzen" waren die Gliederungsvokabel der Aufgabenstellung. Eine
    # Antwort, die beide Chancen und beide Grenzen inhaltlich nennt, ohne die Woerter zu benutzen,
    # ist vollstaendig richtig und fiel vorher durch. Jetzt zaehlt der INHALT.
    "M01-111": {
        "pflicht": [["Verfügbarkeit", "Erreichbarkeit", "rund um die Uhr", "nachts"],
                    ["schneller", "sofort", "Zeitersparnis"],
                    ["komplexe", "mehrdeutige", "fehlinterpretiert", "Empathie"]],
        "kuer": ["Klassifizierung", "Bearbeitung", "Techniker", "Kundenerlebnis"],
    },
    "M01-114": {
        "pflicht": [["Meilenstein", "Milestone"],
                    ["zeitpunktbezogen", "Zeitpunkt", "Punkt in der Zeit"],
                    ["Dauer 0", "Dauer null", "keine Dauer"]],
        "kuer": ["Zwischenziel", "Projekt-Kontrolle", "Gantt-Diagramm", "Raute"],
    },
    "M01-204": {
        "pflicht": [["Retrospektive", "Retro"],
                    ["Reflexion", "Reflexions-Meeting", "überprüft", "zurückschaut"],
                    ["Verbesserung", "kontinuierliche Verbesserung"]],
        "kuer": ["Sprint", "Team", "SCRUM", "Start-Stop-Continue"],
    },
    "M01-604": {
        "pflicht": [["Moderation", "moderieren", "Konfliktmoderation"],
                    ["Rollenklärung", "Rollen klären", "Zuständigkeiten"],
                    ["Regeln", "Spielregeln"]],
        "kuer": ["Transparenz", "Team-Building", "Konflikt", "Norming"],
    },
    # KORRIGIERT: wie M01-111 – „Chancen"/„Grenzen" raus, Inhalt rein. Diese Frage war der Beleg:
    # die Testantwort nannte beide Chancen und beide Risiken und fiel trotzdem durch.
    "M01-733": {
        "pflicht": [["Entlastung", "Verfügbarkeit", "rund um die Uhr"],
                    ["Reaktionszeit", "schneller", "sofort", "vorqualifiziert"],
                    ["Halluzinationen", "falsche", "fehlerhafte", "erfundene"]],
        "kuer": ["Wissensdatenbank", "SLA", "Empathie", "Priorität"],
    },

    # ---------------- M02 (Haiku-Batch 2, von Opus geprueft) ----------------
    "M02-016": {
        "pflicht": [["Preisnachlass", "Rabatt", "Abzug"],
                    ["24,5", "24.5", "24,50"]],
        "kuer": ["30 Tage", "2,04", "Bankkredit", "Zahlungsziel"],
    },
    "M02-101": {
        "pflicht": [["1.529,10", "1529,10"], ["1.800", "1800"], ["1.530", "1530"]],
        "kuer": ["Mengenrabatt", "Skonto", "Lieferkosten", "Bezugspreis"],
    },
    # GEPRUEFT/ERWEITERT: „gleichzeitig" allein war zu schmal – eine Antwort, die schlicht mehrere
    # Kanaele aufzaehlt, ist vollstaendig. Alternativen erweitert statt Pflicht gestrichen.
    "M02-114": {
        "pflicht": [["mehrere Kanäle", "mehrere Vertriebswege", "unterschiedliche Kanäle",
                     "verschiedene Kanäle", "mehrere Vertriebskanäle"],
                    ["gleichzeitig", "parallel", "nebeneinander", "kombiniert"]],
        "kuer": ["Direktvertrieb", "Marktabdeckung", "Fachhändler", "Online-Marktplätze"],
    },
    "M02-115": {
        "pflicht": [["Mitarbeiter", "Nutzerzahl", "Abteilung", "wie viele"],
                    ["Dokumente", "Volumen", "Häufigkeit", "Druckvolumen"],
                    # „wichtig" stand hier zunaechst als vierte Alternative und liess die
                    # Floskel-Negativkontrolle durchfallen: zusammen mit „Mitarbeiter" und dem
                    # Stem-Treffer „dokumentieren" -> „Dokumente" bestand ein inhaltsleerer
                    # Fuelltext mit 60 %. Allerweltswoerter gehoeren nie in eine Alternativliste.
                    ["Anforderungen", "Funktionen", "Schnelligkeit", "Kopierfunktion"]],
        "kuer": ["offene Frage", "Bedarf", "Kopierfunktion", "Netzwerk"],
    },
    "M02-202": {
        "pflicht": [["direkt", "unmittelbar"],
                    ["Endkunde", "Endkunden", "Verbraucher"],
                    ["Zwischenhändler", "Distributor", "Händler", "Vermittler"]],
        "kuer": ["Website", "Vertriebsteam", "Showroom", "Gewinnmarge"],
    },
    # KORRIGIERT: Pflicht 3 lautete ["Gewichtung","beeinflusst","entscheidend"]. „beeinflusst" und
    # „entscheidend" sind keine gleichwertigen Ausdruecke fuer „Gewichtung", sondern Woerter aus der
    # Begruendung – Verstoss gegen die Mittelweg-Regel. Ersetzt durch echte Wortvarianten.
    "M02-305": {
        "pflicht": [["Teilnutzwert", "Teilnutzwerte"],
                    ["Gesamtnutzwert", "Gesamtpunktzahl", "Summe"],
                    ["Gewichtung", "gewichtet", "Gewichtungsfaktor"]],
        "kuer": ["Alternative", "Bewertungspunkte", "multiplizieren", "Kriterium"],
    },
    "M02-314": {
        "pflicht": [["Distributor", "Großhändler"],
                    ["Systemintegrator", "Systemhaus"],
                    ["Beratung", "Lösung", "Projektgeschäft", "Umsetzung"]],
        "kuer": ["Lagerhaltung", "Reseller", "Logistik", "Endkunde"],
    },

    # ---------------- M03 (Haiku-Batch 2, von Opus geprueft) ----------------
    # GEPRUEFT/ERWEITERT: die Aufgabe laesst „3 von vielen" Kriterien zu, die Musterloesung nennt
    # selbst Zusatzkriterien (Flimmerfreiheit, Blaulichtfilter). Die Alternativlisten decken jetzt
    # auch diese ab – sonst faellt durch, wer drei ANDERE richtige Kriterien nennt.
    "M03-010": {
        "pflicht": [["Größe", "Auflösung", "Zoll", "Pixel"],
                    ["entspiegelt", "Entspiegelung", "matt", "mattiert", "Blendung", "Reflexion"],
                    ["höhenverstellbar", "verstellbar", "neigbar", "Blickrichtung"]],
        "kuer": ["Flimmerfreiheit", "Blaulichtfilter", "Kopfschmerzen", "Nacken"],
    },
    "M03-111": {
        "pflicht": [["Energieverbrauch", "Stromverbrauch", "Energieeffizienz"],
                    ["Recycling", "Recyclingfähigkeit", "Materialwahl", "Rücknahme"],
                    ["Langlebigkeit", "Reparierbarkeit", "Ersatzteile", "modular"]],
        "kuer": ["Blauer Engel", "Energy Star", "Netzteil", "Demontage"],
    },
    "M03-116": {
        "pflicht": [["Lese- und Schreibvorgänge", "Operationen", "Zugriffe", "Schreibvorgänge"],
                    ["pro Sekunde", "je Sekunde"],
                    ["schneller", "Performance", "Durchsatz", "Engpass"]],
        "kuer": ["HDD", "NVMe", "Speichermedium", "Datenbank"],
    },
    "M03-117": {
        "pflicht": [["Größe", "Auflösung", "Zoll", "Pixel"],
                    ["höhenverstellbar", "verstellbar", "neigbar", "Blickrichtung"],
                    ["Energieeffizienz", "Stromverbrauch", "Watt", "Energy Star"]],
        "kuer": ["entspiegelt", "Blendung", "Blaulichtfilter", "Flicker-Free"],
    },
    "M03-120": {
        "pflicht": [["2.690", "2690"], ["2.400", "2400"],
                    ["Leasing", "günstiger", "wirtschaftlicher"]],
        "kuer": ["40.350", "36.000", "Kapitalbindung", "Flexibilität"],
    },
    "M03-603": {
        "pflicht": [["Isolation", "abgeschottet", "eigenes Betriebssystem", "eigener Kernel"],
                    ["Kompatibilität", "Treiber", "Legacy", "ältere Software"]],
        "kuer": ["Ressourcen", "Kernel", "Container", "Stabilität"],
    },
    # KORRIGIERT: Pflicht 3 lautete ["zuerst","danach","vor"]. Das ist die Gliederungsvokabel der
    # Aufgabenstellung („zuerst partitionieren, dann formatieren") und dazu mit „vor" ein
    # Drei-Zeichen-Begriff. Gestrichen – die Reihenfolge traegt schon das Szenario.
    "M03-608": {
        "pflicht": [["Partitionieren", "Partition", "logische Laufwerke", "aufgeteilt"],
                    ["Formatieren", "Dateisystem", "NTFS", "ext4"]],
        "kuer": ["Festplatte", "Windows", "Benutzerdaten", "Struktur"],
    },
    "M03-612": {
        "pflicht": [["Screenreader", "NVDA", "JAWS", "Vorlesesoftware"],
                    ["Lupe", "Zoom", "Vergrößerung", "vergrößern"],
                    ["Tastatur", "Tastatur-Navigation", "Trackball", "Spracherkennung"]],
        "kuer": ["Kontrast", "Alt-Text", "Clickable Areas", "Tremor"],
    },
    "M03-616": {
        "pflicht": [["Reichweite", "Dämpfung", "Wände", "Mauern"],
                    ["mehrere Access Points", "zwei APs", "zwei Access Points", "mehrere APs"],
                    ["SSID", "Roaming", "nahtlos"]],
        "kuer": ["Kanäle", "Kapazität", "Interferenz", "Durchsatz"],
    },
    "M03-743": {
        "pflicht": [["Wertschöpfungskette", "Stufen", "Tätigkeiten"],
                    ["Kosten", "günstiger", "wirtschaftlich"],
                    ["Kernkompetenz", "Kerngeschäft", "Know-how"]],
        "kuer": ["Make-or-Buy", "Eigenleistung", "Fremdleistung", "Kapazität"],
    },

    # ---------------- M04 / M05 / Transfer (Haiku-Batch 3, von Opus geprueft) ----------------
    "M04-009": {
        "pflicht": [["GPL", "GPL-Lizenz"],
                    ["Quellcode offenlegen", "Quellcode veröffentlichen", "Änderungen offenlegen",
                     "offenlegen", "veröffentlichen"],
                    ["weitergeben", "Weitergabe", "weitergibt"]],
        "kuer": ["Freiheit", "Linux", "Kernel", "verändern"],
    },
    "M04-015": {
        "pflicht": [["Kabel", "Verbindung", "LED", "eingesteckt"],
                    ["ipconfig", "ifconfig", "IP-Adresse prüfen", "169.254"],
                    ["ping", "Gateway", "DNS"]],
        "kuer": ["Switch", "Netzwerkport", "DHCP", "Namensauflösung"],
    },
    # GEPRUEFT/UMGEBAUT: Der Agent hatte ["7","4","1"] als EINE Alternativliste – damit haette eine
    # einzige beliebige dieser Ziffern gereicht. Bei einem Schreibtischtest ist aber die ganze
    # FOLGE die Leistung. Jetzt drei getrennte Pflichteintraege, alle drei muessen vorkommen.
    # Bekannte Schwaeche und bewusst akzeptiert: einstellige Zahlen sind schwache Begriffe – sie
    # brauchen Wortgrenzen, weshalb „10" den Eintrag „1" NICHT erfuellt. Das ist hier gewollt.
    # ⚠️ SCHREIBWEISE: ein EINZELNER Begriff ist ein schlichter String, KEINE einelementige Liste.
    # `["7"]` ist ungueltig – eine Alternativliste braucht >= 2 Eintraege (logik.js `eintragOk`,
    # gleiche Regel im JSON-Schema). Der Verstoss ist teuer, weil die Frage dann beim Boot STILL
    # aus dem POOL faellt: validate_pool/validate_schema schlagen an, und test_state kippt an
    # einer voellig anderen Stelle (State-Hygiene), was die Ursache gut versteckt.
    "M04-106": {
        "pflicht": ["7", "4", "1"],
        "kuer": ["Finale Wert", "Iteration", "Schleife", "Ausgabe"],
    },
    "M04-113": {
        "pflicht": [["IDE", "Entwicklungsumgebung"],
                    ["Editor", "Compiler", "Debugger"],
                    ["Versionskontrolle", "Git", "Build-Tools"]],
        "kuer": ["Syntax-Highlighting", "integriert", "Breakpoints", "Visual Studio"],
    },
    "M04-114": {
        "pflicht": [["Kostenersparnis", "Lizenzgebühren", "Lizenzkosten"],
                    ["Flexibilität", "Anpassbarkeit", "Quellcode"],
                    ["Support", "Vendor Lock-in", "Implementierungsaufwand", "Abhängigkeit"]],
        "kuer": ["Odoo", "SAP", "Open-Source", "proprietär"],
    },
    "M04-118": {
        "pflicht": [["/26", "26"], "62",
                    ["192.168.100.64", "192.168.100.128", "192.168.100.192"]],
        "kuer": ["Subnetzmaske", "Blockgröße", "Präfix", "Broadcast"],
    },
    "M04-303": {
        "pflicht": [["Auftraggeber", "Auftragnehmer", "IT-Dienstleister"],
                    ["Anforderungen", "Umsetzung", "technisch"],
                    ["Vertragsbestandteil", "verbindlich"]],
        "kuer": ["Lastenheft", "Pflichtenheft", "Orientierung", "detailliert"],
    },
    "M04-309": {
        "pflicht": [["m:n", "viele-zu-vielen", "n:m"],
                    ["mehreren Projekten", "mehrere Mitarbeiter"],
                    ["Zwischentabelle", "Fremdschlüssel"]],
        "kuer": ["Kardinalität", "Datenbank", "Beziehung", "unrealistisch"],
    },
    "M04-316": {
        "pflicht": [["Zero-Trust", "Never Trust", "Always Verify"],
                    ["authentifiziert", "autorisiert", "überprüft"],
                    ["Perimeter-Sicherheit", "implizite Vertrauenswürdigkeit", "kein Vertrauen"]],
        "kuer": ["Sicherheitsmodell", "Gerätestatus", "Ressourcen", "Standard"],
    },
    "M04-322": {
        "pflicht": [["ipconfig", "ifconfig"],
                    "ping",
                    ["tracert", "traceroute", "nslookup"]],
        "kuer": ["Hop", "DHCP", "Namensauflösung", "Konnektivität"],
    },
    "M04-735": {
        "pflicht": [["Selbstbeschreibungsfähigkeit", "ISO 9241-110", "erkennt nicht"],
                    ["Barrierefreiheit", "Farbenblinde", "nur über Farbe"],
                    ["Stern", "Legende", "Text oder Symbol", "zusätzlich Text"]],
        "kuer": ["Eingabemaske", "Ticketstatus", "Pflichtfeld", "wahrnehmbar"],
    },
    "M05-109": {
        "pflicht": [["Act", "Handlungsphase"],
                    ["Checkliste erweitern", "Prüfpunkte", "Checkliste"],
                    ["Schulung", "schulen", "geschult"]],
        "kuer": ["PDCA", "Fehlerquote", "optimieren", "Check-Phase"],
    },
    # GEPRUEFT/KORRIGIERT – lehrreichster Fall des Batches: „dokumentiert", „Beleg" und „Nachweis"
    # standen in drei VERSCHIEDENEN Pflichteintraegen, gehoeren aber alle DERSELBEN Synonymgruppe an
    # (nachweis/beleg/dokumentation/protokoll/dokumentieren/festhalten/...). Das eine Wort
    # „dokumentieren" in einem inhaltsleeren Fuelltext erfuellte damit ALLE DREI Pflichteintraege –
    # die Floskel-Negativkontrolle fiel mit 60 % durch. Pflichteintraege muessen in UNTERSCHIEDLICHEN
    # Synonymgruppen liegen, sonst sind sie nicht unabhaengig. test_freitext bewacht das jetzt aktiv.
    "M05-306": {
        "pflicht": [["Objektivität", "Nachvollziehbarkeit", "nachvollziehbar", "subjektiv"],
                    ["Haftung", "Fehlerverfolgung", "Streitfall"],
                    ["Abnahme", "Rechnungsstellung", "Kunde"]],
        "kuer": ["Testprotokoll", "Prüfpunkte", "Wiederholbarkeit", "Erinnerung"],
    },
    "M05-311": {
        "pflicht": [["Qualitätslenkung", "operativer Prozess", "laufende Produktion"],
                    ["Überwachung", "Prozessüberwachung", "überwacht", "Standards"],
                    ["Sofortkorrektur", "Abweichungen", "korrigiert"]],
        "kuer": ["Quality Control", "Qualitätsplanung", "Qualitätssicherung", "Umsetzung"],
    },
    "M05-604": {
        # RUECKFALL, von der Negativ-Kontrolle gefangen: „IST" und „SOLL" standen hier als
        # Alternativen. Beides sind zugleich ALLTAGSWOERTER („ist", „soll") und treffen damit in
        # fast jedem deutschen Satz. Genau diese zwei Begriffe waren am 20.07. schon einmal als
        # Solo-Begriffe entfernt worden – hier waren sie unbemerkt zurueckgekehrt. Folge: die
        # ISMS-Musterloesung von M06-114 bestand diese Frage als „richtig".
        "pflicht": [["12 Stunden", "12 h", "zwölf Stunden"],
                    ["4 Stunden", "vier Stunden"],
                    ["Knowledge-Base", "Ticket-Template", "Supporter schulen"]],
        "kuer": ["Plan", "Check", "Pilot", "standardisiert"],
    },
    # GEPRUEFT/KORRIGIERT: „Beziehungsebene" stand beim Agenten in Pflicht 1 UND Pflicht 3. Ein
    # einziges Vorkommen haette damit zwei Pflichteintraege erfuellt – die Frage waere leichter
    # gewesen, als die Zahl der Begriffe vorgibt. Pflicht 3 traegt jetzt die Reaktion, nicht das Modell.
    "M02-750": {
        "pflicht": [["Eisberg", "Sachebene", "Oberfläche"],
                    ["Emotionen", "Frust", "Angst", "nicht ernst genommen"],
                    ["Verständnis", "aktiv zuhören", "Empathie", "zuhören"]],
        "kuer": ["Beziehungsebene", "Existenzangst", "20", "80"],
    },
    "M03-750": {
        "pflicht": [["Ping", "Schicht 1", "Verbindung"],
                    ["Schicht 4", "Transport", "Port 80"],
                    ["DNS", "Namensauflösung", "nslookup"]],
        "kuer": ["OSI", "Bitübertragung", "Anwendungsschicht", "Routing"],
    },
    "M04-750": {
        "pflicht": [["längerer Zeitraum", "Beobachtung", "Muster", "beobachten"],
                    ["Dauer-Ping", "ping -t", "Zeitstempel", "Paketverlust"],
                    ["Logfiles", "Auslastung", "Cronjob", "Stoßzeiten"]],
        "kuer": ["zeitweise", "Switch", "Backup-Job", "korrelieren"],
    },

    # ============ ALTBESTAND: Fragen, die Begriffe hatten, aber KEINE Alternativlisten ============
    # Nutzer-Entscheid 2026-07-21 (nach Sichtung der Uebersicht): auch diese 25 auf Alternativlisten
    # heben, damit der Pool EIN Qualitaetsniveau hat. Vorher standen hier starre Einzelwoerter –
    # wer dieselbe Sache anders formulierte, fiel durch.
    "M01-007": {
        # KORRIGIERT: Der Agent bot ["Vermindern","Vermeiden"] als Alternativen an. Das sind zwei
        # VERSCHIEDENE Massnahmentypen – fuer R1 ist „Vermindern" richtig. Als Alternative haette
        # der falsche Typ die Pflicht erfuellt. Deshalb hier bewusst ein einzelner String.
        "pflicht": ["Vermindern",
                    ["Vertretungsregelung", "Vertretung", "Stellvertretung"],
                    ["Lieferant", "Backup-Lieferant", "Ausweichlieferant"]],
        "kuer": ["Wissenstransfer", "Eintrittswahrscheinlichkeit", "Schadenshöhe", "Backup"],
    },
    "M01-008": {
        "pflicht": [["Abweichung", "Kostenabweichung", "Differenz"],
                    ["800", "800 EUR"],
                    ["Datenqualität", "Kompatibilität", "Altlasten"]],
        "kuer": ["Nachkalkulation", "Puffer", "Schätzung", "Budget"],
    },
    "M01-012": {
        "pflicht": [["längste", "längster Weg", "laengste"],
                    ["Puffer", "Gesamtpuffer"],
                    ["Projektdauer", "Gesamtprojektdauer"]],
        "kuer": ["Netzplan", "Verzögerung", "Abhängigkeiten"],
    },
    # GESCHAERFT: vorher nur „Nutzwert" + „Monitor B". Jetzt tragen die beiden Gesamtpunktzahlen
    # die Antwort – bei einer Rechenaufgabe ist das Ergebnis die Leistung. „Monitor A" ist bewusst
    # KEINE Alternative zu „Monitor B": das ist die falsche Antwort.
    "M02-006": {
        "pflicht": [["7,1", "7.1"], ["7,5", "7.5"], ["Monitor B", "Modell B"]],
        "kuer": ["Nutzwertanalyse", "Gewichtung", "Bildqualität", "Ergonomie"],
    },
    "M02-012": {
        "pflicht": [["Angebot", "Überangebot"],
                    ["Nachfrage", "Marktnachfrage"],
                    ["Käufer", "Käuferseite", "Kunde"]],
        "kuer": ["Verhandlungsstärke", "sinken", "Wettbewerb", "Konditionen"],
    },
    "M03-009": {
        "pflicht": [["Kauf", "kaufen"], ["2.300", "2300"], ["2.400", "2400"]],
        "kuer": ["günstiger", "Gesamtbetriebskosten", "Leasing", "Nutzungsdauer"],
    },
    # KORRIGIERT: Der Agent setzte ["Leistung","Ausgangsleistung","Eingangsleistung"]. „Leistung"
    # allein ist ein Allerweltswort in diesem Fach und stand ausdruecklich auf der Verbotsliste.
    "M03-011": {
        "pflicht": [["Wirkungsgrad", "eta"],
                    ["Verhältnis", "Quotient"],
                    ["Ausgangsleistung", "Eingangsleistung", "Nutzleistung", "zugeführt"]],
        "kuer": ["Wärme", "Verlust", "Energieverschwendung", "Betriebskosten"],
    },
    "M04-005": {
        "pflicht": [["DHCP-Lease", "Lease"],
                    ["Gültigkeitsdauer", "Laufzeit", "Gültigkeit"],
                    ["IP-Adresse", "IP-Adressen"]],
        "kuer": ["DHCP-Server", "erneuern", "Renewal", "169.254"],
    },
    # Beim Schreibtischtest traegt die ZWISCHENFOLGE die Leistung, nicht nur das Endergebnis.
    # Einzelne Ziffern sind schwache Begriffe (Wortgrenzen noetig) – deshalb alle drei als Pflicht.
    "M04-012": {
        "pflicht": ["2", "6", "12"],
        "kuer": ["Iteration", "Schleife", "Summe", "Schreibtischtest"],
    },
    "M04-112": {
        "pflicht": [["VPN", "Virtual Private Network"],
                    ["Tunnel", "Netzwerk-Tunnel", "verschlüsselter Kanal"],
                    ["verschlüsselt", "Verschlüsselung"]],
        "kuer": ["Vertraulichkeit", "Homeoffice", "IPsec", "unsichere Netze"],
    },
    "M05-005": {
        "pflicht": [["Netzwerkanmeldung", "Domänenanmeldung", "Netzwerk", "Active Directory"],
                    ["Software", "Softwareinstallation", "Lizenzierung"],
                    ["Peripherie", "Drucker", "USB-Geräte"]],
        "kuer": ["Systemstart", "Berechtigungen", "Benutzerprofile", "Dateiserver"],
    },
    "M05-110": {
        "pflicht": [["Audit", "Audits"],
                    ["systematisch", "systematische", "objektiv"],
                    ["Überprüfung", "Kontrolle", "Inspektion", "überprüft"]],
        "kuer": ["Standards", "intern", "extern", "ISO 9001"],
    },
    # KORRIGIERT: Pflicht 3 des Agenten (["Richtlinie","Cloud-Datenverwaltung","Datensicherung"])
    # enthielt mit „Datensicherung" einen Begriff, der in der Musterloesung gar nicht vorkommt –
    # Verstoss gegen die Sanity-Bedingung. Ersetzt durch die tatsaechlich genannte Massnahme.
    "M06-017": {
        "pflicht": [["Vertraulichkeit", "Geheimhaltung"],
                    ["Verschlüsselung", "verschlüsseln", "AES"],
                    ["Richtlinie", "organisatorisch", "Zugriffskontrolle"]],
        "kuer": ["CIA", "Integrität", "DSGVO", "portable Medien"],
    },
    "M07-016": {
        "pflicht": [["Lessons Learned", "Lernpunkte"],
                    ["Dokumentation", "dokumentieren", "protokollieren"],
                    ["Verbesserung", "Verbesserungsmaßnahmen", "besser"]],
        "kuer": ["Projektabschluss", "Fehler", "Kundenbeziehung", "zukünftige Projekte"],
    },
    "M07-302": {
        "pflicht": [["SLA", "Service Level Agreement", "Servicevereinbarung"],
                    ["Verfügbarkeit", "99,5"],
                    ["Servicevertrag", "Mietvertrag", "Dauerleistung"]],
        "kuer": ["Werkvertrag", "Qualitätsstandards", "Eigentumsübergang", "laufende Leistung"],
    },
    "M09-005": {
        "pflicht": [["Unterstützungsprozess", "Sekundärprozess", "Unterstützungsprozesse"],
                    ["indirekt", "indirekte"],
                    ["Effizienz", "Kernprozesse", "Output"]],
        "kuer": ["Wertschöpfungskette", "ERP-System", "Vorleistungen", "Störungen"],
    },
    "M09-013": {
        "pflicht": [["Aufgabenanalyse", "Zerlegung", "zerlegt"],
                    ["Aufgabensynthese", "Bündelung", "bündelt"],
                    ["Elementaraufgaben", "Teilaufgaben"]],
        "kuer": ["Stellenbildung", "Aufbauorganisation", "Gesamtaufgabe", "Stellen"],
    },
    "M09-035": {
        "pflicht": [["kooperativ", "partizipativ", "Delegation"],
                    ["Motivation", "motivieren", "Eigenverantwortung"],
                    ["autoritär", "Laissez-faire"]],
        "kuer": ["Fachwissen", "Reifegrad", "Entscheidungen", "selbstständig"],
    },
    "M09-085": {
        "pflicht": [["Istkaufmann", "§ 1 HGB"],
                    ["Kleingewerbe", "Kleingewerbetreibender"],
                    ["Kannkaufmann", "§ 2 HGB"]],
        "kuer": ["Handelsregister", "konstitutiv", "kaufmännische Organisation", "freiwillig"],
    },
    "M09-096": {
        "pflicht": [["Wahrheit", "Grundsatz der Wahrheit", "irreführend"],
                    ["Rechtsformzusatz", "Rechtsform"],
                    ["Firma", "Firmenname"]],
        "kuer": ["§ 17 HGB", "Handelsregister", "täuschen", "Haftung"],
    },
    "M09-115": {
        "pflicht": [["Prokura", "Prokurist"],
                    ["Sondervollmacht", "besondere Vollmacht"],
                    ["Grundstück", "Grundstücke", "Veräußerung"]],
        "kuer": ["§ 49 HGB", "Handelsgewerbe", "unwirksam", "Belastung"],
    },
    "M09-125": {
        "pflicht": [["unverbindlich", "nicht bindend", "keine Verpflichtung"],
                    ["Kaufinteresse", "Interesse"],
                    ["Angebot", "Offerte"]],
        "kuer": ["Anfrage", "Vertrag", "Annahme", "Konditionen"],
    },
    # KORRIGIERT: Der Agent bot ["Antrag","Angebot"] an. „Angebot" steht in der Fragestellung und
    # kommt in jeder Antwort vor – die Pflicht waere wertlos gewesen. Nur „Antrag" zaehlt.
    "M09-126": {
        "pflicht": ["Antrag",
                    ["zugegangen", "erhalten", "empfangen", "Zugang"],
                    ["Annahmefrist", "Annahmefristen", "Bindefrist"]],
        "kuer": ["Freizeichnungsklauseln", "freibleibend", "gebunden", "vollständig"],
    },
    "M09-138": {
        "pflicht": [["Probezeit", "Probemonate"],
                    ["vier Wochen", "4 Wochen"],
                    ["schriftlich", "Schriftform"]],
        "kuer": ["§ 22 BBiG", "Kündigungsfrist", "Ausbildung aufgeben", "fristlos"],
    },
    # KORRIGIERT: Der Agent hatte „unzulässig" als Alternative zu „Probezeit" – das ist kein
    # gleichwertiger Ausdruck, sondern die Bewertung, und sie passt auf ALLE vier Punkte der
    # Aufgabe. Ersetzt durch die konkrete Zahl, um die es geht.
    "M09-139": {
        "pflicht": [["Probezeit", "5 Monate", "vier Monate"],
                    ["Mindesturlaub", "27 Werktage", "Urlaub"],
                    ["Arbeitszeit", "9 Stunden", "8 Stunden"]],
        "kuer": ["§ 20 BBiG", "§ 8 JArbSchG", "§ 11 BBiG", "Ausbildungsdauer"],
    },

    # ---------------- M06 / M07 / M08 (Haiku-Batch 4, von Opus geprueft) ----------------
    # QUALITAETSHINWEIS zu diesem Batch: der Agent lieferte durchgehend LEERE kuer-Listen (Vorgabe
    # war 2-4) und griff bei den Rechen-/Rechtsfragen mehrfach auf Zahlen aus der AUFGABENSTELLUNG
    # statt aus der Loesung zurueck. Kuer wurde von Opus ergaenzt, die Rechenfragen umgebaut.
    "M06-007": {
        "pflicht": ["personenbezogene Daten",
                    ["separater Schlüssel", "ID-Mapping", "Zuordnungstabelle"],
                    ["rückgängig", "umkehrbar", "reversibel", "wieder identifiziert"]],
        "kuer": ["Anonymisierung", "DSGVO", "zusätzliche Informationen", "zugeordnet"],
    },
    "M06-016": {
        "pflicht": [["zwei Faktoren", "zwei unterschiedliche Faktoren", "zweiter Faktor"],
                    ["Wissen", "Passwort"],
                    ["Besitz", "Smartphone", "Token", "SMS-Code"]],
        "kuer": ["Biometrie", "Fingerabdruck", "Identität", "Authentifizierung"],
    },
    "M06-020": {
        "pflicht": [["1 Monat", "einen Monat", "ein Monat"],
                    ["Verarbeitungszweck", "Zweck der Verarbeitung", "Empfänger", "Speicherdauer",
                     "gespeicherte personenbezogene Daten", "Kontaktdaten"]],
        "kuer": ["Art. 15", "DSGVO", "Auskunft", "verlängert"],
    },
    "M06-107": {
        "pflicht": [["Absenderadresse", "Absender", "gefälschte Adresse"],
                    ["Dringlichkeit", "dringende Aufforderung", "Zeitdruck", "sofort"],
                    ["Anhang", "Anhänge", "verdächtige Links", "Grammatikfehler"]],
        "kuer": ["Social Engineering", "Malware", "Handlungsdruck", "unpersönliche Anrede"],
    },
    "M06-114": {
        "pflicht": ["Managementsystem",
                    ["risikobasiert", "Risikoanalyse", "Risiken"],
                    ["PDCA", "ISO 27001", "regelmäßig überprüft"]],
        "kuer": ["Informationssicherheit", "Richtlinien", "Maßnahmen", "kontinuierlich"],
    },
    "M06-119": {
        "pflicht": [["Verfügbarkeit", "Ausfall"],
                    ["Vertraulichkeit", "Geheimhaltung"],
                    ["Integrität", "verfälscht", "Korrektheit"]],
        "kuer": ["Schutzbedarf", "sehr hoch", "DSGVO", "Ersatzgerät"],
    },
    # KORRIGIERT: „Menschen" als Alternative war ein Allerweltswort.
    "M06-202": {
        "pflicht": [["Manipulation", "manipuliert", "Angriffsmethode"],
                    ["menschliche Psychologie", "Psychologie", "Hilfsbereitschaft", "Autorität"],
                    ["Passwort", "unbefugte Zugriffe", "Geheimnisse"]],
        "kuer": ["Dringlichkeit", "IT-Support", "technische Schwachstellen", "Vortäuschung"],
    },
    "M06-305": {
        "pflicht": [["Hashwert", "Hash", "Prüfsumme"],
                    ["privater Schlüssel", "privaten Schlüssel"],
                    ["Integrität", "unverändert"]],
        "kuer": ["Authentizität", "öffentlicher Schlüssel", "SHA-256", "Signatur"],
    },
    "M06-308": {
        "pflicht": [["Update", "Patch", "Sicherheitspatch", "Patches"],
                    ["Firewall", "Ports", "Angriffsfläche"],
                    ["Least Privilege", "Rechtekonzept", "Administratorrechte", "Dienste deaktivieren"]],
        "kuer": ["Backup", "technisch", "organisatorisch", "Härtung"],
    },
    "M06-734": {
        "pflicht": [["Security by Design", "von Anfang an", "im Entwicklungsprozess"],
                    ["Security by Default", "Voreinstellungen", "sichere Standardeinstellung"],
                    ["Pflichtenheft", "Passwortwechsel", "Rechtekonzept", "Protokollierung"]],
        "kuer": ["Bedrohungsanalyse", "Code-Review", "Verschlüsselung", "restriktiv"],
    },
    "M06-751": {
        "pflicht": [["Auftragsverarbeitung", "AVV", "Auftragsverarbeitungsvertrag", "Art. 28"],
                    ["Drittland", "Drittlandtransfer", "Standardvertragsklauseln", "Data Privacy Framework"],
                    ["Einwilligung", "berechtigtes Interesse"]],
        "kuer": ["Verantwortliche", "weisungsgebunden", "TOM", "Widerspruchsrecht"],
    },
    "M07-007": {
        "pflicht": [["Vereinbarung", "Abkommen", "vereinbart"],
                    ["messbare Kennzahlen", "Kennzahlen", "Metriken"],
                    ["Verfügbarkeit", "Reaktionszeit", "Lösungszeit"]],
        "kuer": ["Uptime", "Vertragsstrafe", "Service-Credits", "Servicequalität"],
    },
    "M07-010": {
        "pflicht": [["4.320", "4320"], ["120", "120 %"]],
        "kuer": ["3.600", "720", "über Plan", "Wirtschaftlichkeit"],
    },
    "M07-011": {
        "pflicht": [["Skeptiker", "Bremser"],
                    ["Schulung", "Training", "Mentoring", "schulen"],
                    ["Gespräch", "Ängste", "Bedenken", "einbinden"]],
        "kuer": ["Power-User", "Erfolgsgeschichten", "kleine Schritte", "Gewohnheit"],
    },
    # UMGEBAUT: Der Agent nahm „8" (die VERZUGSTAGE AUS DER AUFGABE) als Pflichtbegriff. Das ist
    # eine Angabe der Fragestellung, keine Rechenleistung. Jetzt traegt das Ergebnis die Antwort
    # plus der Befund, dass die Deckelung NICHT greift.
    "M07-104": {
        # Pflicht 3 lautete zuerst ["greift nicht", ...] und fiel durch die Sanity-Pruefung:
        # „nicht" ist ein STOPWORT, damit bleibt vom Mehrwort-Begriff nur ein Token uebrig und der
        # Token-Fallback greift nicht mehr (er verlangt mindestens zwei inhaltstragende Tokens).
        # Jetzt prueft Pflicht 3, ob die Deckelung ueberhaupt BEDACHT wurde – das ist der Kern.
        "pflicht": [["480", "480 EUR"],
                    ["1.000", "1000"],
                    ["Deckelung", "gedeckelt", "Höchstgrenze", "maximal"]],
        "kuer": ["Konventionalstrafe", "Werktage", "Verzug", "0,3"],
    },
    "M07-112": {
        "pflicht": [["Multiplikator", "interner Trainer"],
                    ["schult", "trainiert", "Schulung"],
                    ["Kostenersparnis", "Akzeptanz", "Kollegen", "gleiche Abteilung"]],
        "kuer": ["externe Trainer", "Change Management", "kurze Wege", "Praxis"],
    },
    "M07-113": {
        "pflicht": [["Wartungsvertrag", "Instandhaltung", "laufende Unterstützung"],
                    ["Monitoring", "Patch-Management", "Incident-Response"],
                    ["Reaktionszeit", "SLA", "Verfügbarkeits-Garantie"]],
        "kuer": ["Projektabschluss", "monatlich", "Umfang", "Preis"],
    },
    # UMGEBAUT: Der Agent nahm „6" und „7" (die Wochen AUS DER AUFGABE) als Pflicht. Die Leistung
    # ist die BEWERTUNG der beiden Abweichungen, nicht das Abschreiben der Vorgabewerte.
    "M07-115": {
        "pflicht": [["1 Woche", "eine Woche", "14,3"],
                    ["2.000", "2000"],
                    ["96", "96 %"]],
        "kuer": ["Anforderungs-Freigaben", "Ersparnis", "Überschreitung", "Automation"],
    },
    "M07-307": {
        "pflicht": [["Gefahrenübergang", "Risikoübergang"],
                    ["Risiko", "Gefahr"],
                    ["Abnahme", "vor Abnahme", "nach Abnahme"]],
        "kuer": ["Auftraggeber", "Auftragnehmer", "zerstört", "beschädigt"],
    },
    "M07-310": {
        "pflicht": [["Service-Credit", "Service-Credits", "Gutschrift"],
                    ["automatisch", "pauschal"],
                    ["SLA", "nicht eingehalten", "unterschritten"]],
        "kuer": ["Verfügbarkeit", "Kompensation", "Anreiz", "monatliche Gebühr"],
    },
    "M07-314": {
        "pflicht": [["30.000", "30000"], ["75", "75 %"]],
        "kuer": ["40.000", "Ersparnis", "Automatisierung", "unter Budget"],
    },
    "M07-604": {
        "pflicht": [["Updates", "Patches", "Sicherheits-Updates"],
                    ["Support", "Helpdesk"],
                    ["planbare Kosten", "Kundenbindung", "wiederkehrende Einnahmen"]],
        "kuer": ["präventive Wartung", "Monitoring", "Dokumentation", "Vor-Ort"],
    },
    # KORRIGIERT: Der Agent schrieb „Visionare" – ein Tippfehler, der nie getroffen haette.
    "M07-608": {
        "pflicht": [["Mission", "Vision"],
                    ["ökologisch", "CO2", "Green IT", "Recycling"],
                    ["sozial", "Ausbildungsquote", "Weiterbildung", "faire Arbeitsbedingungen"]],
        "kuer": ["Leitbild", "Nachhaltigkeit", "Transparenz", "Verantwortung"],
    },
    # Bei Rechtsfragen IST das Urteil der Kern der Antwort – „unzulaessig" ist hier ausnahmsweise
    # Inhalt und nicht Gliederungsvokabel. Es steht aber nie allein.
    "M08-014": {
        "pflicht": ["unzulässig",
                    ["§ 14", "BBiG", "Ausbildungszweck"],
                    ["IHK", "Betriebsrat", "JAV", "Ausbilder", "Gewerkschaft"]],
        "kuer": ["ausbildungsfremd", "Schlichtungsausschuss", "angemessen", "Verrichtungen"],
    },
    # KORRIGIERT: Pflicht 3 lautete ["volljährig","zulässig"] – „zulaessig" ist die Gliederungs-
    # vokabel der Frage („Ist das rechtlich zulaessig?") und stand auf der Verbotsliste.
    "M08-110": {
        "pflicht": [["§ 15", "Freistellung", "freistellen"],
                    ["jugendlich", "§ 10 JArbSchG", "unter 18", "Jugendliche"],
                    ["kein Anspruch", "Lerntage", "unmittelbar vorausgeht"]],
        "kuer": ["BBiG", "JArbSchG", "Abschlussprüfung", "Volljährige"],
    },
    "M08-111": {
        "pflicht": [["Ausnahmefall", "unüblich", "Ausbildungszweck"],
                    ["Vergütung", "Freizeitausgleich", "§ 17"],
                    ["§ 8 JArbSchG", "40 Stunden", "8 Stunden"]],
        "kuer": ["Überstunden", "BBiG", "Jugendliche", "Entgelt"],
    },
    "M08-112": {
        "pflicht": ["Günstigkeitsprinzip",
                    ["zum Vorteil", "günstigere", "nicht nachteilig"],
                    ["Tarifvertrag", "Arbeitsvertrag"]],
        "kuer": ["Arbeitnehmer", "Urlaub", "abweichen", "Tarifrecht"],
    },
    # KORRIGIERT: Pflicht 1 lautete ["verhaltensbedingt","Kündigung"] – „Kuendigung" steht in der
    # Fragestellung und kommt in jeder Antwort vor. Jetzt tragen Abmahnung und Schriftform.
    "M08-604": {
        "pflicht": ["verhaltensbedingt",
                    ["Abmahnung", "abgemahnt", "abmahnen"],
                    ["wichtiger Grund", "fristlos", "schriftlich", "Schriftform"]],
        "kuer": ["Betriebsrat", "JAV", "Anhörung", "Fehlverhalten"],
    },
    # KORRIGIERT: „nicht zulaessig"/„unzulaessig" als Pflicht 1 war Gliederungsvokabel; „VORHER"
    # als Pflicht 3 ein Allerweltswort. Jetzt traegt die Rechtsgrundlage die Antwort.
    "M08-606": {
        "pflicht": [["§ 87", "BetrVG"],
                    ["Mitbestimmung", "mitzubestimmen", "Mitbestimmungsrecht"],
                    ["unwirksam", "vorher beteiligt", "Zustimmung", "Einigungsstelle"]],
        "kuer": ["Arbeitszeit", "Pausen", "Betriebsrat", "nachträglich"],
    },
    "M08-610": {
        "pflicht": [["fachgerecht", "Fertigkeiten", "Kenntnisse"],
                    ["kostenlos", "Ausbildungsmittel", "Werkzeuge", "Lehrmittel"],
                    ["Freistellung", "Ausbildungsnachweis", "Berufsschule"]],
        "kuer": ["§ 14 BBiG", "Gefährdung", "angemessen", "Ausbildungsberuf"],
    },
    "M08-614": {
        "pflicht": [["Tarifautonomie", "Art. 9"],
                    ["Friedenspflicht", "Arbeitskampf", "Streik"],
                    ["Laufzeit", "Planungssicherheit", "während"]],
        "kuer": ["Gewerkschaften", "Arbeitgeberverbände", "staatliche Einmischung", "Aussperrung"],
    },
}


def main():
    basis = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
    gesetzt = 0
    for pfad in sorted(glob.glob(os.path.join(basis, "pool", "*.json"))):
        with open(pfad, encoding="utf-8") as fh:
            daten = json.load(fh)
        fragen = daten if isinstance(daten, list) else daten.get("fragen", daten)
        treffer = False
        for f in fragen:
            neu = NEU.get(f.get("id"))
            if not neu:
                continue
            f["schluesselbegriffe"] = {"pflicht": neu["pflicht"], "kuer": neu["kuer"]}
            treffer = True
            gesetzt += 1
        if treffer:
            with open(pfad, "w", encoding="utf-8") as fh:
                json.dump(daten, fh, ensure_ascii=False, indent=2)
                fh.write("\n")
            print("geschrieben:", os.path.basename(pfad))
    print(f"\n{gesetzt:d} von {len(NEU):d} Fragen gesetzt.")
    if gesetzt != len(NEU):
        raise SystemExit("ABBRUCH: nicht alle IDs im Pool gefunden.")
    print("JETZT: python3 build_fragen.py")


if __name__ == "__main__":
    main()
