#!/usr/bin/env python3
"""r3_5_matrix.py – FB-R3 Punkt 5 (Matrix-Inhalte realistischer).

BEFUND (Bestandsabgleich 2026-07-22, gemessen über alle 25 matrix-Fragen / 106 Elemente):
  1. **40 % der Elemente nannten die EINSTUFUNG wörtlich.** Bei den Achsen
     "Eintrittswahrscheinlichkeit" und "Schadenshöhe" stand im Element
     "Brand im Serverraum: sehr unwahrscheinlich, aber existenzbedrohender Schaden".
     Damit prüft die Aufgabe einen Vokabelabgleich und keine Beurteilung - dieselbe
     Fehlerklasse wie das Balkenlabel in M01-481 (FB-R3 Punkt 2).
     SIEBEN Fragen waren vollständig selbstverratend: M01-702, M01-704, M05-950,
     M06-950, M06-951, M09-042, M09-043.
  2. **Nur 4 von 25 Fragen enthielten überhaupt eine ZAHL** - genau der Anlass des
     Punktes ("branchenübliche Beispielwerte").
  3. **Starke Redundanz der Motive**: Serverausfall in 5 Fragen, Testrechner-ohne-Daten
     in 4, kosmetische Design-Kleinigkeit in 4.

NUTZER-ENTSCHEIDE 2026-07-22:
  * Schwerpunkt: **Selbstverräter raus UND Zahlen rein**.
  * Umfang: **alle 25 Fragen** durchgehen.
  * Redundanz: Beispiele je Frage nach Branche differenzieren, Matrixtypen behalten.

LEITREGEL, nach der jedes Element gebaut ist:
  Ein Element nennt **SACHVERHALTE** (Häufigkeit als Zahl, Schaden als Betrag oder
  Reichweite, Frist als Datum), aus denen die Einstufung ABGELEITET wird. Es nennt
  NICHT das Bewertungswort der Achse ("selten", "häufig", "wichtig", "dringend",
  "hoher Aufwand", "kaum Nutzen").
  ⚠️ ABGRENZUNG: Sachvokabular bleibt erlaubt. Eine Marktform lässt sich nicht ohne
  "ein einziger Anbieter" beschreiben, das Johari-Fenster nicht ohne "mir bekannt" -
  dort IST die Achsenaussage der gegebene Sachverhalt und nicht die Bewertungsleistung.
  test_matrix.js prüft deshalb gezielt BEWERTUNGSvokabular.

Aufruf im Training-Ordner:  python3 tools/r3_5_matrix.py
Danach ZWINGEND:            python3 build_fragen.py
"""
import json
import os
import sys

POOLDIR = os.path.join(os.path.dirname(__file__), "..", "pool")

# Quadranten-Lage (gegengeprueft an M01-551): 0 = oben links, 1 = oben rechts,
# 2 = unten links, 3 = unten rechts.
PATCH = {}

# ─────────────────────────────────────────────────────────── M01 (10 Fragen)
PATCH["M01-551"] = {
    "frage": "Ordne die Stakeholder der Sassenberg Moebelwerke GmbH bei der Einführung eines "
          "Dokumentenmanagementsystems in die Power-Interest-Matrix ein (Einfluss senkrecht, "
          "Interesse waagerecht).",
    "elemente": [
        (1, ("Die Geschäftsführerin hat das Budget von 240.000 Euro freigegeben und lässt sich "
            "jeden Freitag den Projektstand persönlich vortragen.")),
        (0, ("Der Betriebsrat muss der Einführung nach § 87 Abs. 1 Nr. 6 BetrVG zustimmen, hat das "
            "Thema aber in vier Sitzungen nicht auf die Tagesordnung gesetzt und keine Rückfrage gestellt.")),
        (3, ("Die 45 Sachbearbeiterinnen der Auftragsannahme arbeiten künftig täglich mit dem System "
            "und haben bereits 30 Verbesserungsvorschläge eingereicht; über den Funktionsumfang "
            "entscheidet die Projektleitung.")),
        (2, ("Ein Lieferant für Verpackungsmaterial erhält seine rund 20 Bestellungen im Jahr "
            "weiterhin per E-Mail; das neue System berührt seinen Ablauf nicht.")),
    ],
    "kurz": "Der Einfluss ergibt sich daraus, WER etwas verhindern oder freigeben kann - 240.000 Euro "
         "Budget oder die Zustimmung nach § 87 BetrVG -, das Interesse "
         "daraus, WIE OFT und WIE INTENSIV sich jemand einbringt. Die Geschäftsführerin bringt "
         "beides mit, der Betriebsrat nur ein Vetorecht, die Sachbearbeiterinnen nur Betroffenheit, "
         "der Lieferant nichts von beidem.",
    "lang": "Die Power-Interest-Matrix trennt zwei Fragen, die man leicht vermischt: Wie viel MACHT hat "
         "jemand über das Projekt, und wie stark INTERESSIERT es ihn? Die Geschäftsführerin gibt "
         "das Budget frei (Macht) und fordert wöchentliche Berichte (Interesse) - sie gehört eng "
         "eingebunden. Der Betriebsrat hat mit dem Zustimmungsrecht nach § 87 Abs. 1 Nr. 6 BetrVG "
         "eine sehr harte Machtposition, denn ohne seine Zustimmung darf ein System, das zur "
         "Leistungs- und Verhaltenskontrolle geeignet ist, nicht eingeführt werden. Dass er das "
         "Thema in vier Sitzungen nicht aufgerufen hat, zeigt geringes Interesse: Er ist "
         "zufriedenzustellen, damit er nicht spät und überraschend blockiert. Die 45 "
         "Sachbearbeiterinnen sind täglich betroffen und liefern 30 Vorschläge, entscheiden aber "
         "nicht mit - sie werden informiert und eingebunden, sonst kippt die Akzeptanz. Der "
         "Lieferant ist weder betroffen noch beteiligt; hier genügt Beobachten.",
}

PATCH["M01-552"] = {
    "frage": "Ordne die Aufgaben im IT-Support eines Ingenieurbüros mit 120 Arbeitsplätzen in die "
          "Eisenhower-Matrix ein (Wichtigkeit senkrecht, Dringlichkeit waagerecht).",
    "elemente": [
        (1, ("Die Klimaanlage im Serverraum ist ausgefallen; die Temperatur steigt seit 20 Minuten "
            "und liegt jetzt bei 41 Grad, ab 45 Grad schalten die Server selbsttätig ab.")),
        (0, ("Die Backup-Strategie für das kommende Geschäftsjahr soll bis zum 30. November stehen; "
            "heute ist der 12. August.")),
        (3, ("In Raum 3 ist der Toner leer und ein Kollege wartet auf seinen Ausdruck; der Wechsel "
            "dauert fünf Minuten und ist im Aushang Schritt für Schritt beschrieben.")),
        (2, ("Im Sammelpostfach liegen 600 Support-Mails aus 2023, deren Vorgänge alle geschlossen "
            "sind und deren Aufbewahrungsfrist abgelaufen ist.")),
    ],
    "kurz": "Dringlichkeit erkennt man am Zeitdruck (41 Grad und steigend gegen Frist am 30. November), "
         "Wichtigkeit an der Wirkung auf das Geschäft. Die Klimaanlage duldet keine Minute Aufschub, "
         "die Backup-Planung wirkt langfristig und hat noch dreieinhalb Monate Zeit.",
    "lang": "Die Eisenhower-Matrix verlangt zwei getrennte Urteile. DRINGEND ist, was einen engen "
         "Zeitbezug hat: Die Temperatur im Serverraum steigt in diesem Moment auf die Abschaltgrenze "
         "zu, der wartende Kollege am Drucker ebenfalls. NICHT dringend ist die Backup-Planung mit "
         "einer Frist in dreieinhalb Monaten und das Aufräumen des Postfachs ohne jede Frist. "
         "WICHTIG ist, was auf das Geschäftsziel einzahlt: Schalten die Server ab, steht das ganze "
         "Büro, und eine tragfähige Backup-Strategie entscheidet im Ernstfall über den "
         "Fortbestand. Der Tonerwechsel ist zwar "
         "eilig, aber fachlich anspruchslos und im Aushang beschrieben - genau das Muster für "
         "Delegieren. Das Aufräumen alter Mails ist weder eilig noch folgenreich; die Frist ist "
         "abgelaufen, es kann ersatzlos entfallen. Der häufigste Fehler ist, alles Dringende auch "
         "für wichtig zu halten und dabei die Backup-Planung immer weiter zu verschieben.",
}

PATCH["M01-553"] = {
    "frage": "Ordne die Risiken der Netzleitstelle eines Stadtwerks in die Risikomatrix ein "
          "(Schadenshöhe senkrecht, Eintrittswahrscheinlichkeit waagerecht) und leite die "
          "Risikoklasse ab.",
    "elemente": [
        (0, ("Brand im Rechenzentrum der Netzleitstelle: im gesamten Verband seit 1998 zweimal "
            "aufgetreten; der Sachverständige beziffert den Wiederaufbau auf 2,4 Mio. Euro.")),
        (1, ("Die Fernwirktechnik läuft auf einem System, für das der Hersteller seit 2019 keine "
            "Sicherheitsupdates mehr liefert; im letzten Quartal wurden 14 Angriffsversuche "
            "protokolliert, und ein erfolgreicher Zugriff legt die Netzsteuerung still.")),
        (3, ("Beim Ablesen der Zählerstände unterlaufen den Monteuren rund 30 Zahlendreher pro "
            "Monat; jede Korrektur kostet eine Nachberechnung von etwa 8 Euro.")),
        (2, ("Das Ersatz-Notebook im Schulungsraum fällt etwa einmal im Jahr aus; ein baugleiches "
            "Austauschgerät steht im Schrank daneben.")),
    ],
    "kurz": "Aus 'zweimal seit 1998' folgt eine geringe Wahrscheinlichkeit, aus '2,4 Mio. Euro' eine "
         "hohe Schadenshöhe - solche Risiken versichert man. Aus '14 Angriffsversuche im Quartal' "
         "und 'Netzsteuerung steht still' folgt beides hoch: vermeiden, also das Altsystem ablösen.",
    "lang": "Die Risikomatrix multipliziert gedanklich zwei Größen. Die WAHRSCHEINLICHKEIT liest man "
         "aus der beobachteten Häufigkeit: zweimal in über 25 Jahren ist selten, 14 Angriffsversuche "
         "in drei Monaten und 30 Zahlendreher im Monat sind häufig, ein Ausfall pro Jahr liegt "
         "dazwischen und ist mit Ersatzgerät folgenlos. Die SCHADENSHÖHE liest man aus Betrag oder "
         "Reichweite: 2,4 Mio. Euro und eine stillstehende Netzsteuerung sind existenzbedrohend, "
         "8 Euro je Korrektur und ein Ersatzgerät im Schrank sind es nicht. Daraus folgen die vier "
         "Standardstrategien: Großer Schaden bei geringer Wahrscheinlichkeit lässt sich wirtschaftlich "
         "ÜBERTRAGEN (Versicherung) - man kann einen Brand nicht ausschließen, aber seine Folgen "
         "abfedern. Großer Schaden bei hoher Wahrscheinlichkeit muss VERMIEDEN werden, hier durch "
         "Ablösung des nicht mehr gepflegten Systems; Versichern wäre hier weder bezahlbar noch "
         "verantwortbar. Kleiner Schaden bei hoher Wahrscheinlichkeit wird VERMINDERT, etwa durch "
         "eine Plausibilitätsprüfung bei der Eingabe. Kleiner Schaden bei geringer Wahrscheinlichkeit "
         "wird schlicht AKZEPTIERT - jede Maßnahme wäre teurer als der Schaden.",
}

PATCH["M01-702"] = {
    "frage": "Ordne die Projektrisiken der Feldbrueck Chemiehandel GmbH in die Risikomatrix ein und "
          "wähle so die passende Risikostrategie (Schadenshöhe senkrecht, "
          "Eintrittswahrscheinlichkeit waagerecht).",
    "elemente": [
        (0, ("Brand im Gefahrstofflager: laut Versicherer tritt so ein Fall in "
            "einem von 2.000 Betriebsjahren ein; der Betrieb stünde danach mindestens sechs Wochen still.")),
        (1, ("Der einzige Fachadministrator für das Warenwirtschaftssystem hat in der Einführungswoche "
            "Urlaub beantragt und keine Vertretung eingearbeitet; ohne ihn kann keine Buchung "
            "korrigiert werden.")),
        (2, ("Einer der drei Testrechner im Schulungsraum gibt etwa alle zwei Jahre den Geist auf; "
            "die beiden anderen reichen für die Schulung aus.")),
        (3, ("Bei der manüllen Übernahme der 12.000 Artikelstammdaten entstehen erfahrungsgemäß "
            "rund 60 Tippfehler; jeder ist in etwa zwei Minuten korrigiert.")),
    ],
    "kurz": "Ein Fall in 2.000 Betriebsjahren bei sechs Wochen Stillstand gehört oben links: "
         "übertragen. Ein bereits genehmigter Urlaub ohne Vertretung ist dagegen keine Möglichkeit, "
         "sondern eine Gewissheit - und projektkritisch: vermeiden.",
    "lang": "Die Aufgabe verlangt, aus nackten Angaben eine Einstufung abzuleiten. 'Ein Fall in 2.000 "
         "Betriebsjahren' ist eine sehr geringe Wahrscheinlichkeit, 'sechs Wochen Stillstand' ein "
         "sehr hoher Schaden - der klassische Fall für eine Versicherung, also für das ÜBERTRAGEN "
         "des Risikos. Der Urlaub des einzigen Fachadministrators ist bereits beantragt: Die "
         "Wahrscheinlichkeit liegt praktisch bei eins, und ohne ihn steht die Einführung. Solche "
         "Risiken werden VERMIEDEN, indem man die Ursache beseitigt - Urlaub verschieben oder "
         "rechtzeitig eine Vertretung einarbeiten. Ein Geräteausfall alle zwei Jahre bei zwei "
         "verbleibenden Ersatzgeräten kostet nichts Nennenswertes und wird AKZEPTIERT. Die 60 "
         "Tippfehler treten sicher auf, kosten aber je zwei Minuten; hier VERMINDERT man, etwa durch "
         "einen Importlauf mit Prüfregeln statt manüller Erfassung. Merke: 'Vermeiden' heißt, die "
         "Ursache zu beseitigen, 'Vermindern' heißt, Eintritt oder Schaden zu verkleinern, "
         "'Übertragen' heißt, die finanziellen Folgen abzugeben, und 'Akzeptieren' heißt, das "
         "Risiko bewusst zu tragen.",
}

PATCH["M01-703"] = {
    "frage": "Priorisiere die eingehenden Tickets der Ostermann Klinikbetriebe GmbH nach Auswirkung und "
          "Dringlichkeit (Prioritätenmatrix).",
    "elemente": [
        (1, ("Das Krankenhausinformationssystem antwortet seit 10 Minuten nicht mehr; auf allen 14 "
            "Stationen lassen sich keine Befunde und keine Medikationen mehr aufrufen.")),
        (0, ("Ein Sicherheitsupdate muss auf 900 Clients verteilt werden; der Hersteller hat als "
            "Stichtag den 30. September genannt, heute ist der 3. September.")),
        (3, ("Das Notebook einer Oberärztin startet nicht; sie hält in 60 Minuten einen Vortrag vor "
            "der Klinikleitung, ihre Kolleginnen arbeiten normal weiter.")),
        (2, ("Ein Auszubildender bittet um eine zweite Maus für den Schulungsplatz, den er ab dem "
            "kommenden Quartal zwei Tage pro Woche nutzt.")),
    ],
    "kurz": "Auswirkung misst man an der Zahl der Betroffenen, Dringlichkeit am verbleibenden Zeitraum. "
         "14 Stationen ohne Befunde ist beides zugleich (Major Incident); das Notebook betrifft eine "
         "Person, duldet aber keinen Aufschub.",
    "lang": "In der Prioritätenmatrix des Incident-Managements ergibt sich die Priorität aus AUSWIRKUNG "
         "(impact) mal DRINGLICHKEIT (urgency). Die Auswirkung liest man an der Reichweite ab: 14 "
         "Stationen und 900 Clients sind groß, eine Oberärztin und ein Auszubildender sind klein. "
         "Die Dringlichkeit liest man am Zeitfenster ab: 10 Minuten Ausfall und 60 Minuten bis zum "
         "Vortrag sind akut, ein Stichtag in vier Wochen und ein Bedarf ab dem nächsten Quartal sind "
         "es nicht. Der Ausfall des Klinikinformationssystems ist groß und akut - ein Major Incident, "
         "der sofort eskaliert wird und bei dem es um Patientensicherheit geht. Das Sicherheitsupdate "
         "betrifft ebenfalls viele, hat aber vier Wochen Vorlauf und wird sauber eingeplant. Das "
         "Notebook der Oberärztin betrifft nur sie, duldet aber keinen Aufschub - man löst es "
         "schnell, ohne den Major Incident dafür zu unterbrechen. Die zweite Maus ist weder das eine "
         "noch das andere und läuft in der Standardbearbeitung. Der häufigste Fehler ist, die "
         "Lautstärke des Meldenden für Dringlichkeit zu halten.",
}

PATCH["M01-704"] = {
    "frage": "Die IT-Abteilung der Baumgartl Fensterbau GmbH priorisiert ihre Vorhaben nach Aufwand und "
          "Nutzen. Ordne die Vorhaben in die Aufwand-Nutzen-Matrix ein.",
    "elemente": [
        (0, ("Updates per Gruppenrichtlinie automatisch verteilen: einmalig zwei Personentage "
            "Einrichtung, spart danach die wöchentliche Handrunde von vier Stunden über 60 Rechner.")),
        (1, ("Ein neues ERP-System einführen: 18 Monate Laufzeit und 350.000 Euro Budget; danach "
            "entfällt die doppelte Erfassung zwischen Produktion und Buchhaltung, die heute zwei "
            "Vollzeitstellen bindet.")),
        (2, ("Die E-Mail-Signatur um den Hinweis 'Muss diese Mail gedruckt werden?' ergänzen: per "
            "Vorlage in einer halben Stunde verteilt; die Druckkosten lagen im Jahr davor bei 4.200 "
            "Euro und im Jahr danach bei 4.150 Euro.")),
        (3, ("Eine eigene Textverarbeitung entwickeln statt der vorhandenen Standardsoftware: "
            "geschätzt 24 Personenmonate, danach können die Sachbearbeiterinnen dasselbe tun wie heute.")),
    ],
    "kurz": "Der Aufwand steht als Zeit oder Geld dabei (zwei Personentage gegen 24 Personenmonate), der "
         "Nutzen als eingesparte Arbeit (vier Stunden pro Woche, zwei Vollzeitstellen) oder eben als "
         "keine Änderung.",
    "lang": "Die Aufwand-Nutzen-Matrix ordnet Vorhaben nach dem Verhältnis von Einsatz und Ertrag. Der "
         "Einsatz steht hier überall als Zahl: zwei Personentage, 18 Monate und 350.000 Euro, eine "
         "halbe Stunde, 24 Personenmonate. Der Ertrag ebenfalls: vier eingesparte Stunden pro Woche, "
         "zwei frei werdende Vollzeitstellen - oder eben nichts. Daraus ergeben sich die vier Felder. "
         "Die automatische Updateverteilung ist ein QUICK WIN: winziger Einsatz, dauerhafte Ersparnis, "
         "sie wird sofort gemacht. Die ERP-Einführung ist ein STRATEGISCHES PROJEKT: sehr teuer, aber "
         "sie beseitigt eine doppelte Erfassung, die zwei Stellen bindet - das rechnet sich, muss aber "
         "sorgfältig geplant werden. Der Signatur-Hinweis ist ein LÜCKENFÜLLER: er kostet fast "
         "nichts und hat messbar nichts bewirkt - 4.200 gegen 4.150 Euro Druckkosten -, er wird "
         "nur bei freier Kapazität gemacht. Die "
         "Eigenentwicklung einer Textverarbeitung ist zu VERMEIDEN: 24 Personenmonate für ein "
         "Ergebnis, das eine gekaufte Standardsoftware bereits liefert. Merke: Nicht der absolute "
         "Aufwand entscheidet, sondern sein Verhältnis zum Nutzen - deshalb ist das teuerste Vorhaben "
         "hier nicht das schlechteste.",
}

PATCH["M01-950"] = {
    "frage": "Ordne die IT-Risiken eines Online-Versandhändlers in die Risikomatrix ein.",
    "elemente": [
        (0, ("Das Verteilzentrum liegt in einem Gebiet, für das die Behörde ein Hochwasser dieser "
            "Größenordnung alle 100 Jahre erwartet; die Lagerverwaltung stünde dann still und die "
            "Bestelldaten von 14 Tagen wären verloren.")),
        (1, ("Auf den Webservern läuft eine Shop-Software, deren Sicherheitslücke seit acht Wochen "
            "bekannt und nicht geschlossen ist; das Notfallteam zählt wöchentlich Verschlüsselungs"
            "versuche und müsste im Ernstfall den gesamten Kundenbestand wiederherstellen.")),
        (2, ("Der Etikettendrucker im Wareneingang fällt etwa alle 18 Monate aus; ein Ersatzgerät "
            "steht in der Halle und ist in zehn Minuten angeschlossen.")),
        (3, ("Das WLAN in der Pausenküche bricht mehrmals täglich für einige Sekunden ab; dort wird "
            "nicht gearbeitet.")),
    ],
    "kurz": "Aus 'alle 100 Jahre' folgt selten, aus '14 Tage Bestelldaten verloren' hoher Schaden. Aus "
         "'seit acht Wochen offen' und 'wöchentliche Versuche' folgt häufig, aus 'gesamter "
         "Kundenbestand' hoher Schaden.",
    "lang": "Die Risikomatrix bewertet jedes Risiko nach Eintrittswahrscheinlichkeit und Schadenshöhe. "
         "Beide Größen stehen hier als nachprüfbare Angabe im Text und müssen erst übersetzt "
         "werden. Ein behördlich erwartetes Jahrhundertereignis ist selten; acht Wochen offene "
         "Sicherheitslücke mit wöchentlich gezählten Angriffsversuchen ist häufig; ein "
         "Geräteausfall alle 18 Monate ist selten; mehrmals tägliche Abbrüche sind häufig. Für "
         "den Schaden gilt dasselbe: 14 Tage verlorene Bestelldaten und ein kompletter Kundenbestand "
         "sind groß, ein Ersatzdrucker in zehn Minuten und eine Pausenküche ohne Arbeitsplatz sind "
         "klein. Wichtig ist, die beiden Achsen sauber zu trennen: Das WLAN fällt viel öfter aus "
         "als das Verteilzentrum überflutet wird - trotzdem ist das Hochwasser das gravierendere "
         "Risiko, "
         "weil Häufigkeit allein noch nichts über die Folgen sagt. Genau diese Trennung ist der "
         "Zweck der Matrix.",
}

PATCH["M01-951"] = {
    "frage": "Ordne die Projektbeteiligten der Kluessendorf Energieversorgung AG bei der Ablösung des "
          "Abrechnungssystems in die Stakeholder-Matrix ein.",
    "elemente": [
        (0, ("Der Vorstand des Mutterkonzerns gibt jede Investition über 100.000 Euro frei; er hat "
            "die Freigabe in der ersten Sitzung erteilt und seither keinen Bericht angefordert.")),
        (1, ("Die Projektauftraggeberin verantwortet das Budget von 1,2 Mio. Euro, sitzt dem "
            "Lenkungsausschuss vor und fordert jeden Montag einen Statusbericht an.")),
        (2, ("Eine Kollegin aus dem Fuhrpark hat in der Kantine vom Projekt gehört; ihr Bereich "
            "nutzt weder das alte noch das neue System und kommt im 40-seitigen Projektauftrag "
            "kein einziges Mal vor.")),
        (3, ("Die 60 Mitarbeiterinnen der Kundenabrechnung erfassen künftig jeden Vorgang im neuen "
            "System und haben in der Vorab-Befragung 140 Anmerkungen zur Bedienung abgegeben; die "
            "Auswahl der Software war bereits entschieden.")),
    ],
    "kurz": "Einfluss zeigt sich an Entscheidungs- und Vetorechten (Freigabe über 100.000 Euro, "
         "Budgetverantwortung), Interesse an der Beteiligung (wöchentlicher Bericht, 140 "
         "Anmerkungen). Beides ist unabhängig voneinander.",
    "lang": "Die Stakeholder-Matrix verhindert den häufigsten Fehler der Projektkommunikation: alle "
         "gleich zu behandeln. Der Konzernvorstand hat mit der Freigabegrenze von 100.000 Euro sehr "
         "viel Einfluss, verfolgt das Projekt aber nicht - er wird zufriedengestellt, also knapp und "
         "anlassbezogen informiert, damit er nicht spät und überraschend eingreift. Die "
         "Projektauftraggeberin hat Einfluss UND Interesse und wird eng eingebunden. Die 60 "
         "Mitarbeiterinnen der Kundenabrechnung haben mit 140 Anmerkungen hohes Interesse, aber keine "
         "Entscheidungsmacht mehr, weil die Softwareauswahl bereits gefallen ist - sie werden "
         "informiert und ernst genommen, denn sie entscheiden über die Akzeptanz im Alltag, auch "
         "wenn sie formal nicht entscheiden. Die Kollegin aus dem Fuhrpark ist weder betroffen noch "
         "beteiligt; hier genügt geringer Aufwand. Merke: Wer viel Einfluss und wenig Interesse hat, "
         "ist der gefährlichste Fall - er schweigt lange und kann das Projekt spät noch kippen.",
}

PATCH["M01-952"] = {
    "frage": "Ordne die Aufgaben eines Rechenzentrumsbetriebs in die Eisenhower-Matrix ein.",
    "elemente": [
        (0, ("Die Migration von 300 Servern auf ein Betriebssystem mit Herstellersupport muss stehen, "
            "bevor der Support für die aktuelle Version in sechs Monaten ausläuft; danach gibt es "
            "keine Sicherheitsupdates mehr.")),
        (1, ("Der Produktivserver der Auftragsabwicklung ist ausgefallen; seit 15 Minuten kann kein "
            "Auftrag mehr angenommen werden, im Schnitt gehen 40 Aufträge pro Stunde ein.")),
        (2, ("Im persönlichen Postfach liegen 2.300 E-Mails aus abgeschlossenen Vorgängen, die "
            "niemand mehr aufruft und für die keine Aufbewahrungspflicht besteht.")),
        (3, ("Ein Kollege steht vor der Tür und braucht ein zurückgesetztes Standardpasswort, um "
            "sich anzumelden; das Service-Desk-Team erledigt rund 30 solcher Anfragen pro Tag.")),
    ],
    "kurz": "Der Serverausfall läuft jetzt und kostet 40 Aufträge pro Stunde - sofort selbst. Die "
         "Migration entscheidet über die Sicherheit, hat aber sechs Monate Vorlauf - terminieren.",
    "lang": "Wichtigkeit und Dringlichkeit sind zwei verschiedene Fragen, und die Eisenhower-Matrix "
         "zwingt dazu, sie einzeln zu beantworten. Der Serverausfall ist beides: Er läuft seit 15 "
         "Minuten und kostet 40 Aufträge je Stunde. Er wird sofort und persönlich angegangen. Die "
         "Migration von 300 Servern ist mindestens ebenso folgenreich - läuft der Support aus, gibt "
         "es keine Sicherheitsupdates mehr -, aber sie hat sechs Monate Vorlauf. Genau solche "
         "Aufgaben werden verdrängt, weil nie etwas brennt; sie gehören fest terminiert, sonst wird "
         "aus dem geplanten Projekt in fünf Monaten ein Notfall. Das Passwort-Zurücksetzen ist "
         "eilig, weil jemand wartet, aber fachlich anspruchslos und beim Service Desk ohnehin "
         "Routine - delegieren. Die 2.300 alten Mails ohne Aufbewahrungspflicht sind weder eilig noch "
         "folgenreich und können ersatzlos entfallen. Die Kunst liegt im Feld oben links: Wer dort "
         "nichts einplant, verbringt seinen Arbeitstag dauerhaft oben rechts.",
}

PATCH["M01-953"] = {
    "frage": "Ordne die IT-Projektideen der Trentmann Onlinehandel GmbH in die Projektportfolio-Matrix ein.",
    "elemente": [
        (0, ("Den monatlichen Umsatzreport per Skript erzeugen: rund sechs Stunden Entwicklung, danach "
            "entfällt eine Handarbeit von zwei Stunden pro Monat, in der im letzten Jahr 7 Zahlendreher "
            "steckten.")),
        (1, ("Eine neue ERP-Software unternehmensweit einführen: drei Jahre Laufzeit, 2,1 Mio. Euro; "
            "danach laufen Einkauf, Lager und Buchhaltung auf einem Datenbestand statt auf vier "
            "getrennten Systemen.")),
        (2, ("Die Menüpunkte des internen Reporting-Tools alphabetisch statt nach Anlagedatum "
            "sortieren: eine Konfigurationszeile; in der Nutzerbefragung hat es keiner der 30 "
            "Anwender erwähnt.")),
        (3, ("Eine Individualsoftware für die Zollabwicklung eines einzelnen Ziellands entwickeln: "
            "geschätzt 14 Personenmonate; dorthin gingen im letzten Jahr 9 von 240.000 Sendungen.")),
    ],
    "kurz": "Sechs Stunden Aufwand gegen zwei gesparte Stunden pro Monat ist ein Quick Win. 14 "
         "Personenmonate für 9 von 240.000 Sendungen steht in keinem Verhältnis.",
    "lang": "Im Projektportfolio werden Vorhaben nach strategischem Nutzen und Umsetzungsaufwand "
         "sortiert, damit begrenzte Entwicklerzeit dorthin geht, wo sie am meisten bewirkt. Das "
         "Report-Skript amortisiert sich nach drei Monaten und beseitigt nebenbei eine Fehlerqülle - "
         "ein Quick Win, den man sofort mitnimmt. Die ERP-Einführung kostet 2,1 Mio. Euro und drei "
         "Jahre, beseitigt aber die Trennung von vier Datenbeständen; das ist ein strategisches "
         "Großprojekt, das sorgfältig geplant und in Stufen umgesetzt wird. Die alphabetische "
         "Menüsortierung kostet eine Konfigurationszeile und wurde von keinem der 30 Anwender "
         "gewünscht - so etwas nimmt man mit, wenn ohnehin jemand an der Datei arbeitet, plant es "
         "aber nicht ein. Die Zollsoftware "
         "für 9 von 240.000 Sendungen ist der klassische Fall, den man vermeidet: hoher Aufwand für "
         "einen Sonderfall, der sich günstiger von Hand oder über einen Dienstleister lösen lässt. "
         "Merke: Der Nutzen bemisst sich nicht daran, wie interessant ein Vorhaben technisch ist, "
         "sondern wie viel Arbeit oder Risiko es dauerhaft beseitigt.",
}

# ──────────────────────────────────────────────────────────── M02 (2 Fragen)
PATCH["M02-701"] = {
    "frage": "Ordne die Marktsituationen der jeweils passenden Marktform zu (Anzahl der Anbieter "
          "senkrecht, Anzahl der Nachfrager waagerecht).",
    "elemente": [
        (1, ("Ein einziger Hersteller vertreibt ein CAD-Programm für Blechabwicklung; in Deutschland "
            "arbeiten rund 4.000 Metallbaubetriebe damit, eine gleichwertige Alternative gibt es nicht.")),
        (3, ("Rund 900 Elektronikhändler verkaufen baugleiche Standard-Notebooks an mehrere Millionen "
            "Privatkunden; die Preise unterscheiden sich um wenige Euro.")),
        (2, ("Etwa 40 mittelständische Zulieferer fertigen ein Spezialbauteil, das ausschließlich in "
            "den Zügen eines einzigen Schienenfahrzeugherstellers verbaut wird.")),
        (0, ("Für eine Sondermaschine zur Tiefseekabelverlegung gibt es weltweit genau 1 Hersteller "
            "und 1 Betreiber; beide verhandeln jeden Auftrag einzeln aus.")),
    ],
    "kurz": "Die Marktform ergibt sich allein aus der Anzahl auf beiden Marktseiten: 1 Anbieter gegen "
         "4.000 Nachfrager, 40 Anbieter gegen 1 Nachfrager, einer gegen viele, "
         "viele gegen einen, viele gegen viele oder einer gegen einen.",
    "lang": "Marktformen werden nach der Zahl der Anbieter und der Zahl der Nachfrager eingeteilt; die "
         "Zahlen im Text sind die einzige Grundlage. Ein Anbieter und viele Nachfrager ergeben ein "
         "ANGEBOTSMONOPOL - der CAD-Hersteller kann den Preis weitgehend selbst setzen, weil 4.000 "
         "Betriebe keine Alternative haben. Viele Anbieter und ein Nachfrager ergeben ein "
         "NACHFRAGEMONOPOL: Die 40 Zulieferer konkurrieren um denselben einen Abnehmer, der dadurch "
         "die Preise drückt - man spricht auch vom Monopson. Viele auf beiden Seiten ergeben ein "
         "POLYPOL, den Markt mit dem stärksten Wettbewerb; dass sich die Notebook-Preise nur um "
         "wenige Euro unterscheiden, ist genau dessen Kennzeichen. Einer auf beiden Seiten ergibt ein "
         "BILATERALES (zweiseitiges) MONOPOL, in dem der Preis nicht durch den Markt, sondern durch "
         "Verhandlungsmacht entsteht. Merke: Nicht die Größe des Unternehmens entscheidet über die "
         "Marktform, sondern die ANZAHL der Marktteilnehmer auf jeder Seite.",
}

PATCH["M02-702"] = {
    "frage": "Ordne die Situationen aus dem Team der Kirschbaum Personaldienste GmbH den vier Bereichen "
          "des Johari-Fensters zu (anderen bekannt senkrecht, mir selbst bekannt waagerecht).",
    "elemente": [
        (0, ("In der Teamrunde sagt die Kollegin: 'Deine Präsentationen sind immer klar aufgebaut' - "
            "eine Rückmeldung, die ich in drei Feedbackgesprächen schon selbst so eingeschätzt habe.")),
        (1, ("Im Feedbackbogen kreuzen 6 von 8 Kolleginnen an, ich würde in Besprechungen oft "
            "ins Wort fallen; beim Lesen bin ich ehrlich überrascht.")),
        (2, ("Ich habe mich vor 3 Wochen intern auf die Stelle in der Niederlassung Kassel beworben "
            "und darüber bisher mit niemandem im Team gesprochen.")),
        (3, ("Ob ich eine Gruppe von 200 Zuhörern souverän moderieren kann, hat sich bisher nie "
            "gezeigt - weder ich noch das Team wissen es.")),
    ],
    "kurz": "Das Johari-Fenster kreuzt zwei Fragen: Weiß ICH davon, und wissen es die ANDEREN? Wenn 6 "
         "von 8 Kolleginnen etwas ankreuzen, das mich überrascht, ist es der blinde Fleck. Aus "
         "'bin ehrlich überrascht' folgt: mir unbekannt. Aus 'mit niemandem gesprochen' folgt: "
         "anderen unbekannt.",
    "lang": "Das Johari-Fenster von Joseph Luft und Harry Ingham ordnet Persönlichkeitsanteile nach "
         "zwei Fragen: Ist mir das bewusst, und ist es den anderen bekannt? Was beiden Seiten bekannt "
         "ist, bildet die ARENA (öffentliche Person) - hier die anerkannte Präsentationsfähigkeit, "
         "die ich selbst so einschätze. Was die anderen sehen und ich nicht, ist der BLINDE FLECK; "
         "die Überraschung beim Lesen des Feedbackbogens ist das verräterische Signal. Er lässt "
         "sich nur durch Rückmeldung verkleinern - genau deshalb sind Feedbackgespräche mehr als "
         "eine Formalie. Was ich weiß und zurückhalte, ist die FASSADE (Privatperson): die interne "
         "Bewerbung, über die ich nicht spreche. Sie schrumpft durch Selbstöffnung, und zwar "
         "freiwillig - niemand muss alles preisgeben. Was weder mir noch anderen bekannt ist, bleibt "
         "das UNBEKANNTE; es zeigt sich erst in neuen Situationen. Merke: Gute Zusammenarbeit "
         "vergrössert die Arena, indem beide Wege genutzt werden - Feedback geben und sich öffnen.",
}

# ──────────────────────────────────────────────────────────── M05 (3 Fragen)
PATCH["M05-702"] = {
    "frage": "Ordne die Kostenbeispiele aus der Fertigung der Duesterloh Schweisstechnik GmbH den vier "
          "Kategorien der Qualitätskosten zu.",
    "elemente": [
        (0, ("Zweitägige Schweißerschulung für acht Monteure vor Anlauf der neuen Baureihe: "
            "6.400 Euro.")),
        (1, ("Wareneingangskontrolle: eine Vollzeitstelle prüft stichprobenartig die angelieferten "
            "Bauteile, Personalkosten 52.000 Euro im Jahr.")),
        (2, ("Ausschuss: 140 fehlerhafte Werkstücke im Quartal werden wieder eingeschmolzen, "
            "Materialwert 9.800 Euro.")),
        (2, ("Nacharbeit an 60 Teilen, die die Endkontrolle nicht bestanden haben, bevor sie das Werk "
            "verlassen: 22 Arbeitsstunden.")),
        (3, ("Garantie-Reparaturen beim Kunden nach 18 Reklamationen im letzten Jahr: 31.000 Euro "
            "einschließlich Anfahrt und Monteurstunden.")),
        (3, ("Rückruf einer bereits ausgelieferten Charge von 400 Baugruppen: 145.000 Euro sowie "
            "Berichte in zwei Fachzeitschriften.")),
    ],
    "kurz": "Entscheidend ist der ZEITPUNKT, nicht die Höhe: 6.400 Euro Schulung vorher gegen 145.000 "
         "Euro Rückruf nachher. Also: vor der Entstehung (Fehlerverhütung), während der "
         "Prüfung (Prüfkosten), nach Entdeckung im Haus (interne Fehlerkosten) oder erst beim "
         "Kunden (externe Fehlerkosten).",
    "lang": "Die Qualitätskosten werden nach dem Zeitpunkt eingeteilt, zu dem sie anfallen. "
         "FEHLERVERHÜTUNGSKOSTEN entstehen, bevor überhaupt ein Fehler möglich ist - die "
         "Schweißerschulung für 6.400 Euro. PRÜFKOSTEN entstehen durch das Suchen nach Fehlern, "
         "unabhängig davon, ob welche gefunden werden - die Wareneingangskontrolle für 52.000 Euro "
         "im Jahr. INTERNE FEHLERKOSTEN entstehen, wenn ein Fehler im eigenen Haus entdeckt wird: "
         "Ausschuss und Nacharbeit, hier 9.800 Euro Material und 22 Arbeitsstunden. EXTERNE "
         "FEHLERKOSTEN entstehen, wenn der Fehler erst beim Kunden auffällt: 31.000 Euro "
         "Garantie-Reparaturen und 145.000 Euro Rückruf. Die Zahlen zeigen die zentrale Aussage der "
         "Zehnerregel: Je später ein Fehler entdeckt wird, desto teurer wird er - vom "
         "Materialwert des Ausschusses über die Garantiereparatur bis zum Rückruf, bei dem zu den "
         "145.000 Euro noch der Imageschaden aus den Fachzeitschriften kommt, der sich nicht "
         "beziffern lässt. Deshalb ist Geld für Schulung und Prüfung fast immer besser angelegt "
         "als für Nacharbeit.",
}

PATCH["M05-950"] = {
    "frage": "Ordne die Fehlerarten aus der Serienfertigung der Weissger Sanitaertechnik GmbH in die "
          "Fehlerkosten-Matrix ein.",
    "elemente": [
        (0, ("Ein Fehler in der Maschinensteuerung, der in den letzten acht Jahren einmal auftrat; er "
            "legte die Fertigungsstraße damals fünf Tage lahm und kostete 190.000 Euro.")),
        (1, ("Ein Rundungsfehler in der Chargenverwaltung, der bei etwa jedem zwanzigsten Auftrag "
            "zuschlägt und dabei die Bestandsdaten so verfälscht, dass die Inventur der betroffenen "
            "Charge komplett wiederholt werden muss.")),
        (2, ("Ein Tippfehler in einer internen Wartungsnotiz, der ungefähr zweimal im Jahr vorkommt "
            "und beim Lesen sofort auffällt.")),
        (3, ("Ein Protokolleintrag der Testumgebung, der die Uhrzeit ohne Sekunden ausgibt; er "
            "entsteht bei jedem der rund 200 Testläufe pro Woche und wird von den 3 Entwicklern "
            "nicht ausgewertet.")),
    ],
    "kurz": "Einmal in acht Jahren bei 190.000 Euro gehört nach oben links; jeder zwanzigste Auftrag "
         "mit kompletter Inventurwiederholung nach oben rechts.",
    "lang": "Die Fehlerkosten-Matrix hilft, begrenzte Entwicklungskapazität auf die richtigen Fehler zu "
         "lenken. Die Auftretenshäufigkeit steht als Zahl da: einmal in acht Jahren, jeder "
         "zwanzigste Auftrag, zweimal im Jahr, bei jedem Aufruf. Die Folgekosten ebenfalls: 190.000 "
         "Euro und fünf Tage Stillstand, eine wiederholte Inventur, ein sofort sichtbarer Tippfehler, "
         "zwei Pixel in einer Testumgebung. Der wichtigste Merksatz lautet: Der häufigste Fehler ist "
         "nicht der teuerste. Der Protokolleintrag entsteht bei jedem der 200 Testläufe pro Woche und "
         "ist trotzdem der unwichtigste, weil ihn die 3 Entwickler gar nicht auswerten und keine "
         "Kundendaten berührt sind. Der "
         "Steuerungsfehler trat einmal auf und ist trotzdem gravierend. Oben rechts steht, was beides "
         "verbindet - der Rundungsfehler in der Chargenverwaltung ist deshalb zürst zu beheben. In "
         "der Praxis rechnet man dafür die Risikoprioritätszahl aus Häufigkeit und Bedeutung, wie "
         "sie auch in der FMEA verwendet wird.",
}

PATCH["M05-951"] = {
    "frage": "Ordne die geplanten QM-Maßnahmen der Ehrenfeld Maschinenbau GmbH in die "
          "Aufwand-Nutzen-Matrix ein.",
    "elemente": [
        (0, ("Eine Checkliste für Code-Reviews einführen: eine Seite, in zwei Stunden geschrieben; "
            "in der Pilotgruppe sank die Zahl der Produktionsfehler von 18 auf 5 im Quartal.")),
        (1, ("Ein Qualitätsmanagementsystem nach ISO 9001 aufbaün: 14 Monate, rund 90.000 Euro für "
            "Beratung, Schulung und Zertifizierung; drei Großkunden setzen das Zertifikat ab dem "
            "kommenden Jahr voraus.")),
        (2, ("Die Ablage der Prüfprotokolle von Aktenordnern auf Hängeregister umstellen: ein "
            "Nachmittag Arbeit; die Suchzeit je Protokoll lag vorher wie nachher bei rund 2 Minuten.")),
        (3, ("Ein eigenes Zertifizierungsverfahren für die Sonderbaureihe entwickeln: geschätzt "
            "acht Personenmonate; von der Baureihe wurden im letzten Jahr sechs Stück verkauft.")),
    ],
    "kurz": "2 Stunden Aufwand gegen 13 vermiedene Produktionsfehler je Quartal (18 auf 5) ist ein Quick "
         "Win. 8 Personenmonate für 6 verkaufte Stück lohnen sich nicht.",
    "lang": "Auch im Qualitätsmanagement gilt, dass Maßnahmen nach ihrem Verhältnis von Aufwand und "
         "Wirkung ausgewählt werden. Die Review-Checkliste kostet zwei Stunden und senkt die "
         "Produktionsfehler messbar von 18 auf 5 je Quartal - ein Quick Win, den man sofort "
         "umsetzt und dessen Wirkung sich sogar belegen lässt. Das ISO-9001-System kostet 14 Monate "
         "und 90.000 Euro, ist aber strategisch: Ohne Zertifikat fallen ab dem kommenden Jahr drei "
         "Großkunden weg, der Aufwand ist also faktisch eine Marktzutrittsbedingung. Die neue Ablage "
         "der Prüfprotokolle kostet wenig, hat aber nachweislich nichts bewirkt - die Suchzeit "
         "blieb bei 2 Minuten; so etwas macht man nur nebenbei. Das eigene "
         "Zertifizierungsverfahren für sechs verkaufte Stück ist zu vermeiden. Der Merksatz "
         "lautet: Eine QM-Maßnahme rechtfertigt sich nicht dadurch, dass sie gründlich ist, sondern "
         "dadurch, dass sie eine messbare Wirkung hat oder eine Anforderung erfüllt, ohne die man "
         "nicht am Markt bleibt.",
}

# ──────────────────────────────────────────────────────────── M06 (4 Fragen)
PATCH["M06-702"] = {
    "frage": "Ordne die technischen und organisatorischen Maßnahmen der Lengenfeld Jugendhilfe gGmbH "
          "in die Matrix ein: Art der Maßnahme senkrecht, Wirkungszeitpunkt waagerecht.",
    "elemente": [
        (0, ("Die Firewall am Standort Nord blockiert eingehende Verbindungen auf allen Ports außer "
            "443 und 22; die Regelliste umfasst 60 Einträge.")),
        (1, ("Nach dem Ransomware-Befall vom März wurden die Daten aus dem Band-Backup der Vornacht "
            "zurückgespielt; die Wiederherstellung dauerte elf Stunden.")),
        (2, ("Alle 210 Beschäftigten nehmen jährlich an einer zweistündigen Datenschutz- und "
            "Sicherheitsunterweisung teil; die Teilnahme wird per Unterschrift dokumentiert.")),
        (3, ("Nach einem Vorfall aktiviert die Leitung den Notfallplan; die Meldekette sieht vor, die "
            "Aufsichtsbehörde nach Art. 33 DSGVO binnen 72 Stunden zu informieren.")),
        (0, ("Die Festplatten aller 85 Firmen-Notebooks sind mit BitLocker verschlüsselt; der "
            "Wiederherstellungsschlüssel liegt im Tresor der Verwaltung.")),
        (2, ("Betriebsfremde tragen sich am Empfang ein, erhalten einen Besucherausweis und werden im "
            "Gebäude durchgehend begleitet; die Regelung gilt seit 2019 an allen 3 Standorten.")),
    ],
    "kurz": "Die Wiederherstellung nach 11 Stunden ist Technik und wirkt nachher, die Unterweisung von "
         "210 Beschäftigten ist Organisation und wirkt vorher. Die senkrechte Achse fragt also "
         "nach dem MITTEL (Technik oder Regel/Mensch), die waagerechte "
         "nach dem ZEITPUNKT (vor dem Vorfall oder danach). Eine Firewall ist Technik und wirkt "
         "vorher, eine Wiederherstellung ist Technik und wirkt nachher.",
    "lang": "Technische und organisatorische Maßnahmen (TOM) nach Art. 32 DSGVO lassen sich nach zwei "
         "unabhängigen Merkmalen sortieren. Die ART fragt, WOMIT die Maßnahme wirkt: durch ein "
         "technisches System (Firewall, Verschlüsselung, Backup-Wiederherstellung) oder durch eine "
         "Regel und das Verhalten von Menschen (Unterweisung, Besucherregelung, Notfallplan). Der "
         "ZEITPUNKT fragt, WANN sie wirkt: präventiv, also bevor etwas passiert, oder reaktiv, also "
         "um den Schaden nach einem Vorfall zu begrenzen. Beides ist unabhängig - deshalb ergeben "
         "sich vier Felder statt zwei. Das Backup ist der klassische Stolperstein: Es anzulegen ist "
         "Vorsorge, aber die Maßnahme, die hier beschrieben wird, ist das ZURÜCKSPIELEN nach dem "
         "Befall - also technisch-reaktiv. Ebenso der Notfallplan: Ihn zu schreiben ist Vorsorge, ihn "
         "zu AKTIVIEREN ist die Reaktion. Die 72-Stunden-Frist aus Art. 33 DSGVO zeigt, dass auch die "
         "Reaktion rechtlich verbindlich geregelt ist. Ein gutes Sicherheitskonzept besetzt alle vier "
         "Felder; wer nur präventiv denkt, steht nach dem ersten Vorfall ohne Plan da.",
}

PATCH["M06-950"] = {
    "frage": "Ordne die Szenarien der Ostermann Klinikbetriebe GmbH in die Schutzbedarfs-Matrix ein.",
    "elemente": [
        (0, ("Der Speicher-Cluster der Patientenakten hat laut Hersteller eine erwartete Ausfallzeit "
            "von einer Stunde in zehn Jahren; fällt er aus, können 14 Stationen keine Befunde und "
            "keine Allergiehinweise mehr abrufen.")),
        (1, ("Auf das Postfach der Personalabteilung gehen wöchentlich rund 25 Phishing-Mails ein; "
            "gelingt ein Zugriff, liegen die Gehaltsdaten von 1.900 Beschäftigten offen.")),
        (2, ("Das Anmelde-Terminal im Foyer, über das Besucher den Wegeplan abrufen, hängt sich "
            "etwa zweimal im Jahr auf; ein Neustart dauert 3 Minuten.")),
        (3, ("Das Monitoring-Tool meldet täglich rund 40 Schwellwertüberschreitungen, von denen sich "
            "praktisch alle als Messspitzen ohne Datenverlust erweisen.")),
    ],
    "kurz": "Eine Stunde Ausfall in zehn Jahren ist selten, 14 Stationen ohne Allergiehinweise ist ein "
         "sehr hoher Schaden. 25 Phishing-Mails pro Woche sind häufig, 1.900 Gehaltsdatensätze ein "
         "hoher Schaden.",
    "lang": "Der BSI-Grundschutz kennt die drei Schutzbedarfskategorien normal, hoch und sehr hoch; die "
         "Matrix bereitet diese Einstufung vor, indem sie Häufigkeit und Schadenshöhe getrennt "
         "betrachtet. Die Häufigkeit ergibt sich hier aus den Angaben: eine Stunde in zehn Jahren, "
         "25 Mails pro Woche, zweimal im Jahr, 40 Meldungen täglich. Die Schadenshöhe ergibt sich "
         "aus dem, was betroffen ist: Befunde und Allergiehinweise auf 14 Stationen berühren "
         "unmittelbar die Patientensicherheit, 1.900 Gehaltsdatensätze sind besonders geschützte "
         "personenbezogene Daten, ein Wegeplan im Foyer und Messspitzen sind unkritisch. "
         "Für die Ableitung des Schutzbedarfs gilt im Grundschutz das MAXIMUMPRINZIP: Der "
         "Schutzbedarf eines Systems richtet sich nach der höchsten Anforderung der Anwendungen, die "
         "darauf laufen - deshalb erbt der Speicher-Cluster den sehr hohen Schutzbedarf der "
         "Patientenakte, auch wenn er selten ausfällt. Häufigkeit allein sagt also nichts über den "
         "Schutzbedarf: Das Monitoring-Tool meldet am öftesten und ist am unwichtigsten.",
}

PATCH["M06-951"] = {
    "frage": "Ordne die Szenarien eines Zahlungsdienstleisters in die Schutzbedarfs-Matrix ein.",
    "elemente": [
        (0, ("Die Signaturschlüssel für den Zahlungsverkehr liegen in einem Hardware-Sicherheitsmodul "
            "im Tresorraum; ein Diebstahl ist in der Branche zuletzt 2011 dokumentiert worden, "
            "erlaubte dort aber die Freigabe beliebiger Überweisungen.")),
        (1, ("Das Notfallteam verzeichnet seit Jahresbeginn 34 Verschlüsselungsversuche gegen die "
            "Kundendatenbank; ein erfolgreicher Angriff würde die Kontobewegungen von 480.000 Kunden "
            "unbrauchbar machen.")),
        (2, ("Der private Entwicklungsserver einer Praktikantengruppe fällt etwa alle acht Monate aus; "
            "er enthält ausschließlich Übungsdaten ohne Kundenbezug.")),
        (3, ("Der interne Wiki-Server ist im Schnitt an drei Tagen pro Monat für einige Minuten nicht "
            "erreichbar; er enthält Bedienungsanleitungen, die auch ausgedruckt vorliegen.")),
    ],
    "kurz": "Zuletzt 2011 dokumentiert ist selten, 'beliebige Überweisungen freigeben' ist der "
         "höchstmögliche Schaden. 34 Versuche seit Jahresbeginn sind häufig, 480.000 Kundenkonten "
         "ein sehr hoher Schaden.",
    "lang": "Die Schutzbedarfs-Matrix zwingt dazu, Häufigkeit und Schadenshöhe getrennt zu bewerten - "
         "gerade dort, wo das Bauchgefühl beides vermischt. Der Diebstahl der Signaturschlüssel ist "
         "das seltenste Ereignis der vier und zugleich das mit Abstand folgenschwerste, weil damit "
         "beliebige Überweisungen freigegeben werden könnten; solche Fälle werden mit sehr hohem "
         "Aufwand abgesichert (Hardware-Sicherheitsmodul, Tresorraum, Mehr-Augen-Prinzip), obwohl sie "
         "fast nie eintreten. Die Verschlüsselungsversuche gegen die Kundendatenbank sind häufig "
         "UND folgenschwer und haben deshalb die höchste Priorität. Der Übungsserver der "
         "Praktikanten fällt selten aus und enthält keine Kundendaten - hier genügt es, den "
         "Ausfall hinzunehmen. Der Wiki-Server fällt am öftesten aus, seine Inhalte liegen aber "
         "ausgedruckt vor; die Verfügbarkeit ist damit unkritisch. Merke: Aus 'fällt oft aus' folgt "
         "kein hoher Schutzbedarf, und aus 'ist noch nie passiert' folgt kein niedriger.",
}

PATCH["M06-952"] = {
    "frage": "Ordne die gemeldeten Vorfälle der Halmstedt Versicherungsmakler GmbH in die Matrix zur "
          "Priorisierung der Reaktion ein.",
    "elemente": [
        (0, ("Innerhalb von 30 Minuten melden 47 Beschäftigte dieselbe Massen-Mail mit "
            "Rechtschreibfehlern und einer Absenderdomain, die einen Buchstaben vom Original "
            "abweicht; niemand hat den Link angeklickt, aber im Sekretariat häufen sich die Rückfragen.")),
        (1, ("Der Geschäftsführer hat auf einen Link in einer persönlich formulierten Mail geklickt "
            "und seine Zugangsdaten für das Firmenkonto auf der Zielseite eingegeben; das war vor "
            "20 Minuten.")),
        (2, ("Eine schlecht übersetzte Werbe-Mail ohne Anhang und ohne Link liegt seit gestern "
            "zwischen 40 weiteren Nachrichten im Spam-Ordner.")),
        (3, ("Das BSI meldet eine laufende Kampagne einer bekannten Angreifergruppe gegen die "
            "Versicherungsbranche; im eigenen Haus ist bisher keine einzige Mail dieser Art eingegangen.")),
    ],
    "kurz": "Dringlichkeit kommt vom Zeitdruck (vor 20 Minuten eingegeben / 47 Meldungen in 30 Minuten), "
         "das Risiko vom möglichen Schaden. Der geklickte Link ist beides - sofort eskalieren.",
    "lang": "Bei Sicherheitsvorfällen wird die Reaktion nach zwei Größen priorisiert: Wie viel Schaden "
         "kann entstehen, und wie schnell muss gehandelt werden? Der Geschäftsführer hat vor 20 "
         "Minuten Zugangsdaten für das Firmenkonto auf einer gefälschten Seite eingegeben - hohes "
         "Risiko und höchste Eile, weil jede Minute zählt: Zugang sperren, Passwort zurücksetzen, "
         "Bank informieren. Die Massen-Mail ist leicht als Fälschung erkennbar und niemand hat "
         "geklickt, das Risiko ist also gering; dringend ist sie trotzdem, weil 47 Meldungen in 30 "
         "Minuten den Betrieb binden - eine kurze Rundmail schafft sofort Ruhe. Die BSI-Warnung "
         "beschreibt ein reales, hohes Risiko, aber es ist noch keine Mail eingegangen; sie wird "
         "beobachtet und in die Filterregeln aufgenommen, ohne den laufenden Vorfall zu verdrängen. "
         "Die Werbe-Mail im Spam-Ordner erfordert gar nichts. Merke: Viele gleichzeitige Meldungen "
         "erzeugen Dringlichkeit, sagen aber nichts über das Risiko - und eine ernste Warnung ohne "
         "eigenen Vorfall ist umgekehrt riskant, aber nicht eilig.",
}

# ──────────────────────────────────────────────────────────── M07 (1 Frage)
PATCH["M07-950"] = {
    "frage": "Ordne die eingehenden Tickets der Vierkoetter Systemhaus GmbH in die Priorisierungs-Matrix "
          "ein.",
    "elemente": [
        (0, ("Ein bekannter Fehler im Berichtsmodul betrifft alle 500 Nutzer; die Berichte werden "
            "erstmals wieder zum Quartalsabschluss am 30. September gebraucht, heute ist der 2. September.")),
        (1, ("Der zentrale E-Mail-Server antwortet seit fünf Minuten nicht mehr; alle 500 Mitarbeitenden "
            "können weder senden noch empfangen, das SLA sieht eine Reaktionszeit von 30 Minuten vor.")),
        (2, ("In einem internen Tool, das laut Nutzungsstatistik 4-mal im Monat aufgerufen wird, ist "
            "die Namensspalte so schmal, dass lange Firmennamen abgeschnitten dargestellt werden; "
            "gemeldet hat es 1 Nutzer.")),
        (3, ("Der Laptop der Geschäftsführerin fällt aus; sie hat in einer Stunde einen Kundentermin, "
            "die übrigen 499 Arbeitsplätze laufen normal.")),
    ],
    "kurz": "Auswirkung liest man an der Zahl der Betroffenen ab (500 gegen 1), Dringlichkeit an der "
         "verbleibenden Zeit (fünf Minuten Ausfall gegen vier Wochen bis zum Quartalsabschluss).",
    "lang": "Die Priorisierungs-Matrix aus dem Service-Management kombiniert Auswirkung und "
         "Dringlichkeit zur Priorität. Die Auswirkung ergibt sich aus der Reichweite: 500 Nutzer "
         "gegenüber einer Person oder einem viermal monatlich genutzten Tool. Die Dringlichkeit "
         "ergibt sich aus dem Zeitfenster: fünf Minuten laufender Ausfall mit 30 Minuten "
         "SLA-Reaktionszeit gegenüber einer Frist in vier Wochen. Der E-Mail-Ausfall ist groß und "
         "akut und hat damit höchste Priorität - hier läuft zusätzlich eine vertragliche Frist. "
         "Der Berichtsfehler betrifft ebenso viele Menschen, hat aber vier Wochen Vorlauf und wird "
         "geplant behoben. Der Laptop der Geschäftsführerin ist der Fall, an dem sich die "
         "Disziplin zeigt: Die Auswirkung ist gering, weil 499 andere Arbeitsplätze laufen, die "
         "Dringlichkeit hoch. Er wird schnell gelöst, verdrängt aber nicht den E-Mail-Ausfall - "
         "Hierarchie ist kein Priorisierungskriterium. Die zu schmale Namensspalte in einem 4-mal "
         "monatlich genutzten Tool ist beides nicht und läuft in der Standardbearbeitung.",
}

# ──────────────────────────────────────────────────────────── M09 (5 Fragen)
PATCH["M09-033"] = {
    "frage": "Ordne die Szenen in das Verhaltensgitter nach Blake und Mouton ein "
          "(Aufgabenorientierung waagerecht, Mitarbeiterorientierung senkrecht).",
    "elemente": [
        (0, ("Die Teamleiterin beginnt jeden Morgen mit einer Runde zum Befinden und verschiebt die "
            "Zielvereinbarung nun im dritten Quartal in Folge, um niemanden unter Druck zu setzen.")),
        (1, ("Der Schichtleiter legt die Tagesziele offen dar, lässt zwei Einwände zur Reihenfolge "
            "gelten und beschließt mit dem Team eine geänderte Abarbeitung, die den Termin hält.")),
        (2, ("Der Gruppenleiter leitet Termine unkommentiert weiter, fragt bei Verzögerungen nicht "
            "nach und hat in 14 Monaten Amtszeit kein einziges Mitarbeitergespräch geführt.")),
        (3, ("Der Geschäftsführer gibt jeden Arbeitsschritt in einer 20-seitigen Anweisung vor und "
            "kontrolliert stündlich den Stand; Vorschläge aus dem Team nimmt er nicht entgegen.")),
    ],
    "kurz": "Die Aufgabenorientierung zeigt sich daran, wie klar Ziele gesetzt und verfolgt werden - 20 "
         "Seiten Anweisung gegen 3 verschobene Quartale -, die "
         "Mitarbeiterorientierung daran, wie ernst Menschen und ihre Einwände genommen werden. "
         "Beides ist unabhängig voneinander steigerbar.",
    "lang": "Das Verhaltensgitter von Blake und Mouton beschreibt Führung über zwei getrennte "
         "Dimensionen: die Orientierung an der Aufgabe und die an den Menschen. Die Teamleiterin "
         "kümmert sich intensiv um ihr Team, vermeidet aber jede Leistungsvorgabe - das ist der "
         "Glacehandschuh-Stil (1,9), oft als 'Wohlfühlklima ohne Ergebnis' beschrieben. Der "
         "Geschäftsführer treibt die Aufgabe maximal und lässt keinen Menschen zu Wort kommen - "
         "Befehl-Gehorsam-Stil (9,1). Der Gruppenleiter tut weder das eine noch das andere und "
         "verwaltet nur; das ist der Überlebens- oder Laissez-faire-Stil (1,1), im Modell die "
         "schwächste Ausprägung. Der Schichtleiter verbindet beides: klare Ziele UND ernst "
         "genommene Einwände, und genau daraus entsteht die bessere Lösung, die den Termin hält. "
         "Das ist der Team-Stil (9,9), den Blake und Mouton als Idealfall beschreiben. Der zentrale "
         "Gedanke des Modells ist, dass die beiden Dimensionen KEIN Gegensatz sind: Man muss "
         "Menschlichkeit nicht gegen Ergebnisorientierung eintauschen.",
}

PATCH["M09-034"] = {
    "frage": "Situatives Führen nach Hersey und Blanchard: Ordne die vier Mitarbeitersituationen der "
          "Sundermann Baustoffhandel GmbH in das Raster ein (Fachkompetenz waagerecht, "
          "Engagement/Motivation senkrecht) und wähle so den passenden Führungsstil.",
    "elemente": [
        (0, ("Der Auszubildende im ersten Lehrjahr meldet sich für jede Zusatzschicht an der Kantbank "
            "und fragt viel; er hat das Gerät bisher dreimal unter Aufsicht bedient.")),
        (1, ("Die Abteilungsleiterin führt ihr Ressort seit neun Jahren, hat den Bereich zweimal "
            "erfolgreich umgebaut und bringt von sich aus Vorschläge in die Bereichsrunde ein.")),
        (2, ("Der Praktikant erscheint unregelmäßig, hat die Arbeitsanweisung nach vier Wochen noch "
            "nicht gelesen und fragt bei Unklarheiten nicht nach.")),
        (3, ("Der CNC-Techniker beherrscht alle fünf Maschinentypen und schult sonst die Neuen; seit "
            "der abgelehnten Beforderung im März bearbeitet er nur noch die ihm zugewiesenen Aufträge.")),
    ],
    "kurz": "Fachkompetenz zeigt sich an Erfahrung und Ergebnissen (neun Jahre, fünf Maschinentypen "
         "gegen dreimal unter Aufsicht), Engagement am Verhalten (meldet sich freiwillig gegen "
         "erscheint unregelmäßig).",
    "lang": "Das Modell des situativen Führens von Hersey und Blanchard sagt: Es gibt keinen generell "
         "besten Führungsstil, sondern nur einen, der zum Reifegrad des Mitarbeiters passt. Der "
         "Reifegrad setzt sich aus Können und Wollen zusammen. Der Auszubildende will sehr, kann "
         "aber noch nicht - er braucht ANLEITUNG UND ZUSPRUCH zugleich (Überzeugen/Trainieren), also "
         "fachliche Führung, ohne seine Begeisterung auszubremsen. Die Abteilungsleiterin kann und "
         "will; ihr wird Verantwortung vollständig übergeben (DELEGIEREN) - engmaschige Kontrolle "
         "wäre hier der eigentliche Führungsfehler und würde sie demotivieren. Der Praktikant kann "
         "nicht und will nicht; hier bleibt zunächst klares ANWEISEN mit enger Kontrolle und "
         "überprüfbaren Zwischenschritten. Der CNC-Techniker kann sehr wohl, will aber seit der "
         "abgelehnten Beförderung nicht mehr - hier hilft weder Anleitung noch Kontrolle, sondern "
         "BETEILIGEN: das Gespräch suchen, die Ursache klären, ihm eine Aufgabe mit Gestaltungsraum "
         "geben. Der häufigste Fehler ist, auf sinkende Leistung mit mehr Kontrolle zu reagieren, "
         "obwohl das Können gar nicht das Problem ist.",
}

PATCH["M09-042"] = {
    "frage": "Ordne die vier Aufgaben eines Fertigungsmeisters in die Eisenhower-Matrix ein "
          "(Wichtigkeit senkrecht, Dringlichkeit waagerecht).",
    "elemente": [
        (1, ("Der größte Lieferant hat soeben angerufen: Er droht mit Lieferstopp ab Montag, wenn "
            "die Reklamation nicht heute geklärt wird; er deckt 60 Prozent des Materialbedarfs.")),
        (0, ("Für die neue Fertigungsmaschine ist bis zum Jahresende ein Schulungsplan für 24 "
            "Bediener zu erstellen; die Maschine wird im Januar in Betrieb genommen.")),
        (2, ("Im Archivraum stehen Ordner mit Prüfprotokollen von 2016, deren gesetzliche "
            "Aufbewahrungsfrist abgelaufen ist und die niemand mehr anfordert.")),
        (3, ("Die wöchentliche Sichtprüfung der Sicherheitsschränke steht heute an; sie dauert "
            "20 Minuten und ist in der Checkliste Schritt für Schritt beschrieben, der Vorarbeiter "
            "ist eingewiesen.")),
    ],
    "kurz": "Aus 'ab Montag' und '60 Prozent des Materialbedarfs' folgt dringend und wichtig. Aus 'bis "
         "Jahresende' und 'Inbetriebnahme im Januar' folgt wichtig, aber noch nicht dringend.",
    "lang": "Die Eisenhower-Matrix trennt zwei Fragen, die im Alltag ständig vermischt werden. DRINGEND "
         "ist, was einen engen Termin hat: der drohende Lieferstopp ab Montag und die heute fällige "
         "Sichtprüfung. WICHTIG ist, was auf das Ergebnis durchschlägt: ein Lieferant mit 60 Prozent "
         "des Materialbedarfs und die Schulung von 24 Bedienern, ohne die die neue Maschine im Januar "
         "nicht anläuft. Daraus folgen die vier Felder. Die Reklamation wird sofort und persönlich "
         "geklärt. Der Schulungsplan ist genauso folgenreich, hat aber Monate Zeit - er gehört fest "
         "terminiert, denn genau solche Aufgaben werden verschoben, bis sie im Dezember zum Notfall "
         "werden. Die Sichtprüfung ist heute fällig, aber fachlich anspruchslos und in der "
         "Checkliste beschrieben; sie wird an den eingewiesenen Vorarbeiter delegiert. Die Ordner von "
         "2016 mit abgelaufener Aufbewahrungsfrist sind weder eilig noch folgenreich und können "
         "vernichtet werden. Merke: Das Feld oben links entscheidet über den Erfolg - wer dort nichts "
         "einplant, arbeitet dauerhaft im Krisenmodus.",
}

PATCH["M09-043"] = {
    "frage": "Ordne die sechs Aufgaben aus dem Arbeitstag der Betriebsleitung der Griesheimer "
          "Logistikzentrum GmbH in die Eisenhower-Matrix ein.",
    "elemente": [
        (1, ("Ein Kunde mit 18 Prozent Umsatzanteil meldet, dass die Lieferung von gestern nicht "
            "angekommen ist; die Ware wird dort morgen früh in der Produktion gebraucht.")),
        (0, ("Die neue Sortieranlage soll bis zum Frühjahr bestellt werden; das Angebot des Herstellers "
            "gilt noch fünf Monate, die Auswahl läuft seit sechs Wochen.")),
        (3, ("Das Marketing braucht bis 16 Uhr die Freigabe für einen Messeflyer; inhaltlich geht es "
            "um Öffnungszeiten und Anfahrt, die Assistenz kennt beide Angaben.")),
        (2, ("Die Besucherliste der Handelsmesse von 2023 soll alphabetisch sortiert werden; die "
            "Kontakte sind seit dem Systemwechsel ohnehin im CRM erfasst.")),
        (0, ("Für die Strategie 2027 ist ein Grundkonzept zu neuen Märkten zu erstellen; der "
            "Aufsichtsrat erwartet es zur Sitzung in acht Monaten.")),
        (3, ("Der Newsletter-Verteiler muss heute um 40 neue Adressen ergänzt werden, damit der "
            "Versand am Abend vollständig ist; die Pflege des Verteilers gehört zu den Aufgaben der "
            "Systemadministration.")),
    ],
    "kurz": "Zwei Aufgaben sind wichtig und noch nicht dringend (Sortieranlage, Strategie 2027), zwei "
         "sind dringend, aber fachlich anspruchslos und deshalb delegierbar (Flyerfreigabe, "
         "Verteilerpflege).",
    "lang": "Diese Aufgabe hat sechs statt vier Einträge, damit sichtbar wird, dass jedes Feld mehrfach "
         "belegt sein kann. DRINGEND sind die Aufgaben mit engem Termin: die fehlende Lieferung für "
         "die Produktion von morgen früh, die Flyerfreigabe bis 16 Uhr und die Verteilerpflege für "
         "den Versand am Abend. WICHTIG sind die, deren Wirkung weit reicht: ein Kunde mit 18 Prozent "
         "Umsatzanteil, die Investition in die Sortieranlage und das Strategiekonzept für den "
         "Aufsichtsrat. Die Reklamation ist beides und wird sofort selbst übernommen. Sortieranlage "
         "und Strategiekonzept sind folgenreich, haben aber fünf beziehungsweise acht Monate Zeit - "
         "sie werden terminiert, und zwar wirklich, sonst verdrängt sie das Tagesgeschäft. "
         "Flyerfreigabe und Verteilerpflege haben einen harten Termin, verlangen aber kein Urteil der "
         "Betriebsleitung: Die Assistenz kennt die Öffnungszeiten, die Verteilerpflege ist ohnehin "
         "Aufgabe der Systemadministration - beides wird delegiert. Die Besucherliste von 2023 ist "
         "durch das CRM überholt und entfällt ersatzlos. Merke: Delegierbar ist eine Aufgabe nicht "
         "deshalb, weil sie lästig ist, sondern weil jemand anders sie zuständig und "
         "sachgerecht erledigen kann.",
}

PATCH["M09-044"] = {
    "frage": "Will-Skill-Raster: Ordne die vier Mitarbeitenden der Pfungstaedter Getraenkewerke GmbH dem "
          "passenden Führungsverhalten zu (Können waagerecht, Wollen senkrecht).",
    "elemente": [
        (0, ("Die Auszubildende im ersten Lehrjahr bittet von sich aus um Zusatzstunden an der "
            "Abfüllanlage; bei der Umrüstung auf ein anderes Flaschenformat hat sie bisher 4-mal "
            "nur zugesehen.")),
        (1, ("Der Meister mit 15 Jahren Betriebszugehörigkeit hat die letzten 3 Umbauten geleitet "
            "und schlägt von sich aus vor, das nächste Projektteam zu übernehmen.")),
        (2, ("Die Aushilfe hat die Einweisung dreimal verschoben, bedient die Etikettiermaschine nach "
            "wie vor nicht und beantwortet Rückfragen einsilbig.")),
        (3, ("Der Konstrukteur mit 20 Jahren Erfahrung hat die Anlagenplanung für 3 Werke "
            "verantwortet; seit sechs Monaten liefert er nur noch, was ausdrücklich beauftragt wird, "
            "und bringt keine eigenen Vorschläge mehr ein.")),
    ],
    "kurz": "Können zeigt sich an nachweisbaren Ergebnissen (3 Umbauten geleitet, 3 Werke geplant "
         "gegen bisher nur zugesehen), Wollen am Verhalten (bittet um Zusatzstunden gegen dreimal "
         "verschoben).",
    "lang": "Das Will-Skill-Raster kreuzt zwei Fragen: Was bringt jemand mit (Skill), und was bringt "
         "jemand ein (Will)? Beide müssen aus dem Verhalten abgeleitet werden, nicht aus Sympathie. "
         "Die Auszubildende will sichtbar (bittet um Zusatzstunden), kann aber noch nicht (hat nur "
         "zugesehen) - sie wird QUALIFIZIERT: anleiten, üben lassen, Erfolge bestätigen. Der Meister "
         "kann und will; ihm wird DELEGIERT, im Sinne des Management by Delegation mit klar "
         "abgegrenzter Aufgabe, Kompetenz und Verantwortung. Die Aushilfe kann nicht und zeigt kein "
         "Interesse; hier bleibt zunächst enges Anleiten mit überprüfbaren Zwischenschritten - und "
         "die ehrliche Klärung, ob die Zusammenarbeit überhaupt fortgesetzt wird. Der Konstrukteur "
         "ist der eigentlich interessante Fall: Sein Können ist unbestritten, sein Einsatz ist seit "
         "sechs Monaten eingebrochen. Mehr Kontrolle würde die Lage verschlimmern; hier hilft nur "
         "MOTIVIEREN im Sinne einer echten Zielvereinbarung (Management by Objectives), verbunden mit "
         "der Frage, was sich vor sechs Monaten geändert hat. Merke: Bei nachlassender Leistung "
         "zürst prüfen, ob das Können oder das Wollen fehlt - die Maßnahmen sind gegensätzlich.",
}


def main():
    dateien = {}
    for name in os.listdir(POOLDIR):
        if not name.endswith(".json"):
            continue
        pfad = os.path.join(POOLDIR, name)
        with open(pfad, encoding="utf-8") as fh:
            dateien[pfad] = json.load(fh)

    gefunden, geaendert = set(), 0
    for pfad, pool in dateien.items():
        treffer = False
        for f in pool:
            p = PATCH.get(f.get("id"))
            if not p:
                continue
            if f.get("typ") != "matrix":
                sys.exit("ABBRUCH: {} ist kein matrix-Typ.".format(f["id"]))
            gefunden.add(f["id"])
            neu = [{"text": t, "quadrant": q} for q, t in p["elemente"]]
            alt_q = [e["quadrant"] for e in f["elemente"]]
            # Die Quadranten-Zuordnung ist die FACHLICHE Loesung und darf sich beim reinen
            # Umformulieren nicht verschieben. Wer sie bewusst aendert, muss das hier sehen.
            if [e["quadrant"] for e in neu] != alt_q:
                print("  HINWEIS {}: Quadranten-Reihenfolge geändert {} -> {}".format(f["id"], alt_q, [e["quadrant"] for e in neu]))
            f["frage"] = p["frage"]
            f["elemente"] = neu
            f["erklaerungKurz"] = p["kurz"]
            f["erklaerungLang"] = p["lang"]
            treffer, geaendert = True, geaendert + 1
        if treffer:
            with open(pfad, "w", encoding="utf-8") as fh:
                json.dump(pool, fh, ensure_ascii=False, indent=2)
                fh.write("\n")

    fehlt = set(PATCH) - gefunden
    if fehlt:
        sys.exit("ABBRUCH: nicht im Pool gefunden: {!s}".format(", ".join(sorted(fehlt))))
    print(f"{geaendert:d} matrix-Fragen überarbeitet.")
    print("JETZT ZWINGEND:  python3 build_fragen.py")


if __name__ == "__main__":
    main()
