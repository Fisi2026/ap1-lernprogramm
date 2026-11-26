#!/usr/bin/env python3
"""r3_2_gantt.py – FB-R3 Punkt 2 (Gantt: untere Stufen anspruchsvoller).

Baut die SECHS neuen M01-Gantt-Fragen (M01-482..487, je 3 auf Stufe 1 und 2) und
zeichnet die ZWEI defekten Bestands-Diagramme (M01-113, M01-481) neu.

WARUM EIN SKRIPT UND KEIN HANDGESCHRIEBENES SVG:
Der Befund vom 22.07. war, dass die beiden Bestands-Diagramme eine NICHT-LINEARE
Zeitachse hatten und die Balken nicht zur Achse passten (M01-481: 15/12/16/14 px
pro Tag; der Entwicklungs-Balken lag geometrisch bei Tag 9-19, beschriftet war er
mit "Tag 6-15" - die richtige Antwort war also nur aus dem Textlabel ablesbar,
nicht aus dem Bild). Genau solche Fehler entstehen beim Zeichnen von Hand. Hier
wird jede Balkenkante aus derselben Rasterfunktion berechnet wie die Achse, damit
beide gar nicht auseinanderlaufen KOENNEN.

RASTER (NUTZER-ENTSCHEID 2026-07-22: 20 Arbeitstage, 8-10 Vorgaenge je Plan):
  Tagesraster: x = 162 + (tag-1) * 30, also Tag 1..20 zwischen x=162 und x=762.
  Ueber der Achse zwei Ebenen: Wochenbaender (Woche 1..4 zu je 5 Arbeitstagen)
  und die Tagesnummern 1..20, jeweils MITTIG im Tagesfeld.
  Vorgangsnamen stehen in einer linken Spalte (bei 30 px je Tag passt kein Name
  in einen Balken). Zeilen: erste bei y=92, Abstand 40, Balkenhoehe 26.
  Meilenstein: Quadrat, um 45 Grad gedreht (RAUTE) - NICHT das Dreieck aus dem
  alten M01-113. Die Raute ist das Symbol, das M01-960 und M09-053 lehren.

⚠️ REGEL: **KEIN Balken traegt seinen Zeitraum als Text.** Die Achse ist die einzige
  Quelle. Sonst entsteht wieder das M01-481-Problem, bei dem sich die Aufgabe aus
  dem Label statt aus dem Bild loesen liess. test_gantt.js bewacht das aktiv.

Aufruf im Training-Ordner:  python3 tools/r3_2_gantt.py
Danach ZWINGEND:            python3 build_fragen.py
"""
import json
import os
import sys

POOL = os.path.join(os.path.dirname(__file__), "..", "pool", "pool_m01.json")

# ----------------------------------------------------------------- Tagesraster
VBW = 800                 # viewBox-Breite
NAMEX = 150               # rechte Kante der Namensspalte (text-anchor=end)
X0, DAY = 162, 30         # x des Tages 1, Breite eines Tages
TOP = 72                  # y der Zeitachse
ROW0, PITCH, BARH = 92, 40, 26
TAGE, WOCHENLAENGE = 20, 5
BAR_FILL, BAR_STROKE = "#cfe3ff", "#2A4B8D"
MS_FILL, MS_STROKE = "#F5A623", "#B8860B"
# Breitenschaetzung fuer sans-serif; bewusst grosszuegig, damit die Pruefung eher
# zu frueh als zu spaet anschlaegt.
CHAR_W = 6.9 / 13.0


def textbreite(s, fontsize):
    return len(s) * CHAR_W * fontsize


def tx(tag):
    """x-Koordinate der LINKEN Kante eines Arbeitstages (1-basiert)."""
    return X0 + (tag - 1) * DAY


def _geruest(fid, titel, zeilen_anz, tage=TAGE):
    """Kopf, Wochenbaender, Tagesnummern und Tagesgitter."""
    gridbot = ROW0 + PITCH * (zeilen_anz - 1) + BARH + 30
    hoehe = gridbot + 34
    rechts = tx(tage + 1)
    p = [f"<svg viewBox='0 0 {VBW} {hoehe}' xmlns='http://www.w3.org/2000/svg' font-family=\"sans-serif\">"]
    p.append(f"<text x='{VBW // 2:d}' y='26' text-anchor='middle' font-size='15' font-weight='bold' "
             f"fill='#1a1a1a'>{titel!s}</text>")
    # Wochenbaender: jede zweite Woche leicht hinterlegt, damit man die Woche sieht,
    # ohne dass die Balken an Kontrast verlieren.
    woche = 0
    t = 1
    while t <= tage:
        bis = min(t + WOCHENLAENGE - 1, tage)
        woche += 1
        x, breite = tx(t), (bis - t + 1) * DAY
        if woche % 2 == 0:
            p.append(f"<rect x='{x}' y='{TOP}' width='{breite}' height='{gridbot - TOP}' fill='#f2f5f9'/>")
        p.append(f"<text x='{x + breite // 2}' y='44' text-anchor='middle' font-size='12' fill='#69707D'>Woche {woche}</text>")
        t = bis + 1
    # Tagesnummern (mittig im Tagesfeld) und Tagesgitter
    for d in range(1, tage + 2):
        x = tx(d)
        stark = (d - 1) % WOCHENLAENGE == 0 or d == tage + 1
        p.append("<line x1='{}' y1='{}' x2='{}' y2='{}' stroke='{}' stroke-width='1'/>".format(x, TOP, x, gridbot, "#9aa3ad" if stark else "#d8dce2"))
        if d <= tage:
            p.append(f"<text x='{x + DAY // 2}' y='64' text-anchor='middle' font-size='11' fill='#555'>{d}</text>")
    p.append(f"<line x1='{X0}' y1='{TOP}' x2='{rechts}' y2='{TOP}' stroke='#888' stroke-width='1'/>")
    p.append(f"<text x='{NAMEX:d}' y='64' text-anchor='end' font-size='11' fill='#69707D'>Arbeitstag</text>")
    return p, gridbot


def gantt(fid, titel, zeilen, tage=TAGE, meilenstein=None):
    """zeilen: Liste (name, starttag, dauer_in_tagen).
    meilenstein: (label, tag) - Raute am ENDE des genannten Arbeitstages."""
    n = len(zeilen) + (1 if meilenstein else 0)
    p, _gridbot = _geruest(fid, titel, n, tage)
    for i, (name, start, dauer) in enumerate(zeilen):
        if start < 1 or start + dauer - 1 > tage:
            sys.exit(f"ABBRUCH ({fid}): '{name}' liegt ausserhalb der {tage} gezeichneten Tage.")
        if textbreite(name, 11) > NAMEX - 8:
            sys.exit(f"ABBRUCH ({fid}): Vorgangsname '{name}' ({textbreite(name, 11):.0f} px) passt nicht in die {NAMEX - 8} px breite "
                     "Namensspalte.")
        y = ROW0 + i * PITCH
        p.append(f"<text x='{NAMEX:d}' y='{y + 17:d}' text-anchor='end' font-size='11' fill='#2A2F39'>{name!s}</text>")
        # KEIN Text im Balken - siehe Modul-Docstring.
        p.append(f"<rect x='{tx(start)}' y='{y}' width='{dauer * DAY}' height='{BARH}' fill='{BAR_FILL}' stroke='{BAR_STROKE}' stroke-width='2' />")
    if meilenstein:
        label, tende = meilenstein
        cx = tx(tende + 1)
        cy = ROW0 + len(zeilen) * PITCH + BARH // 2
        p.append(f"<line x1='{cx}' y1='{TOP}' x2='{cx}' y2='{cy - 16}' stroke='#B8860B' stroke-width='1' "
                 "stroke-dasharray='4,3'/>")
        p.append(f"<rect x='{cx - 13}' y='{cy - 13}' width='26' height='26' fill='{MS_FILL}' stroke='{MS_STROKE}' stroke-width='2' "
                 f"transform='rotate(45 {cx} {cy})'/>")
        p.append(f"<text x='{NAMEX:d}' y='{cy + 4:d}' text-anchor='end' font-size='11' fill='#2A2F39'>{label!s}</text>")
    p.append("</svg>")
    return "".join(p)


VERWEIS = "Modul 01, Abschnitt 1.1 - Gantt-Diagramm lesen"


def zone(zeile_index, start, dauer, richtig, label):
    """Hotspot-Zone deckungsgleich mit dem Balken derselben Zeile."""
    return {"x": tx(start), "y": ROW0 + zeile_index * PITCH, "w": dauer * DAY, "h": BARH,
            "richtig": richtig, "label": label}


# ===================================================================== FRAGEN
NEU = []

# ---------------------------------------------------------------- M01-482 (S1)
z482 = [("Bestandsaufnahme", 1, 3), ("Angebotsvergleich", 4, 3), ("Hardware-Lieferung", 7, 3),
        ("Kabelverlegung", 8, 5), ("Switch-Konfiguration", 11, 5), ("VLAN-Einrichtung", 16, 2),
        ("Lasttest", 16, 3), ("Abnahme", 19, 2)]
NEU.append({
    "id": "M01-482",
    "pruefungsteil": "AP1",
    "modul": "M01",
    "thema": "Gantt & PSP",
    "typ": "bild",
    "unterTyp": "mc",
    "schwierigkeit": 1,
    "frage": "Der Balkenplan zeigt die Netzwerkmodernisierung der Reddemann Netzwerktechnik GmbH "
             "ueber 20 Arbeitstage. Wann ist die Switch-Konfiguration abgeschlossen?",
    "svg": gantt("M01-482", "Netzwerkmodernisierung (Gantt)", z482),
    "optionen": [
        "Am Ende von Tag 11",
        "Am Ende von Tag 15",
        "Am Ende von Tag 16",
        "Am Anfang von Tag 13"
    ],
    "loesungIndex": 1,
    "distraktorErklaerungen": [
        ("Tag 11 ist der Beginn des Balkens, nicht sein Ende. Der Balken laeuft von dort noch vier "
        "weitere Tage nach rechts."),
        "",
        ("An Tag 16 beginnen bereits VLAN-Einrichtung und Lasttest. Die rechte Kante der "
        "Switch-Konfiguration liegt einen Tag davor."),
        ("Der Anfang von Tag 13 ist ungefaehr die Mitte des Balkens. Abgeschlossen ist ein Vorgang "
        "erst an seiner RECHTEN Kante.")
    ],
    "erklaerungKurz": "Der Balken der Switch-Konfiguration beginnt an der Grenze zu Tag 11 und endet "
                      "an der Grenze nach Tag 15. Der Vorgang laeuft also ueber die Tage 11 bis 15 "
                      "und ist am Ende von Tag 15 fertig.",
    "erklaerungLang": "Im Gantt-Diagramm markiert die LINKE Kante eines Balkens den Start und die "
                      "RECHTE Kante das Ende eines Vorgangs; die Breite dazwischen ist die Dauer. "
                      "Die Switch-Konfiguration ist fuenf Tagesfelder breit und liegt ueber den "
                      "Tagen 11 bis 15. Die beiden haeufigsten Ablesefehler: den Starttag fuer das "
                      "Ende halten, oder die Tagesgrenze rechts vom Balken schon zum naechsten Tag "
                      "zaehlen. Merke: Ein Balken, der an der Grenze nach Tag 15 endet, ist am ENDE "
                      "von Tag 15 fertig - Tag 16 steht dann bereits fuer die naechsten Vorgaenge "
                      "zur Verfuegung. Beachte ausserdem die Ueberlappungen in diesem Plan: "
                      "Hardware-Lieferung und Kabelverlegung laufen an den Tagen 8 und 9 "
                      "gleichzeitig, Kabelverlegung und Switch-Konfiguration an den Tagen 11 und 12, "
                      "VLAN-Einrichtung und Lasttest ab Tag 16. Ein Balkenplan zeigt genau das auf "
                      "einen Blick.",
    "verweis": VERWEIS
})

# ---------------------------------------------------------------- M01-483 (S1)
z483 = [("Hardware-Beschaffung", 1, 4), ("Image-Erstellung", 3, 5), ("Testinstallation", 6, 3),
        ("Software-Paketierung", 7, 8), ("Nutzerdaten-Sicherung", 10, 2), ("Dokumentation", 13, 4),
        ("Vor-Ort-Tausch", 15, 4), ("Altgeraete-Entsorgung", 19, 2)]
NEU.append({
    "id": "M01-483",
    "pruefungsteil": "AP1",
    "modul": "M01",
    "thema": "Gantt & PSP",
    "typ": "hotspot",
    "schwierigkeit": 1,
    "frage": "Der Balkenplan zeigt den Rechner-Rollout der Gerlinghoff Handelskontor GmbH. "
             "Zusaetzlich soll von Tag 9 bis Tag 12 eine Anwenderschulung stattfinden. Klicke den "
             "Vorgang an, der waehrend dieser vier Tage DURCHGEHEND parallel laeuft.",
    "svg": gantt("M01-483", "Rollout Arbeitsplatzrechner (Gantt)", z483),
    "zonen": [
        zone(0, 1, 4, False, "Hardware-Beschaffung"),
        zone(1, 3, 5, False, "Image-Erstellung"),
        zone(2, 6, 3, False, "Testinstallation"),
        zone(3, 7, 8, True, "Software-Paketierung"),
        zone(4, 10, 2, False, "Nutzerdaten-Sicherung"),
        zone(5, 13, 4, False, "Dokumentation"),
        zone(6, 15, 4, False, "Vor-Ort-Tausch"),
        zone(7, 19, 2, False, "Altgeraete-Entsorgung")
    ],
    "erklaerungKurz": "Die Software-Paketierung laeuft von Tag 7 bis Tag 14 und deckt damit alle "
                      "vier Schulungstage ab. Die Nutzerdaten-Sicherung liegt zwar innerhalb des "
                      "Zeitraums, aber nur an Tag 10 und 11 - nicht durchgehend.",
    "erklaerungLang": "Parallelitaet liest man im Gantt-Diagramm SENKRECHT ab: Man legt gedanklich "
                      "einen Streifen ueber den fraglichen Zeitraum (hier Tag 9 bis 12) und sieht "
                      "nach, welche Balken diesen Streifen VOLLSTAENDIG durchqueren. Die "
                      "Image-Erstellung endet nach Tag 7, die Testinstallation nach Tag 8 - beide "
                      "beruehren den Streifen nicht mehr. Dokumentation und Vor-Ort-Tausch beginnen "
                      "erst an Tag 13 beziehungsweise 15, liegen also dahinter. Die "
                      "Nutzerdaten-Sicherung ist der eigentliche Stolperstein: Sie liegt zwar mitten "
                      "im Zeitraum, aber nur an zwei der vier Tage. Die Frage lautet ausdruecklich "
                      "DURCHGEHEND - und das trifft nur auf die Software-Paketierung zu, die von "
                      "Tag 7 bis Tag 14 reicht und den Streifen damit vollstaendig ueberdeckt. "
                      "Solche Ueberschneidungen sind der Hauptnutzen des Balkenplans: Er zeigt, "
                      "welche Vorgaenge gleichzeitig laufen und um dieselben Mitarbeiter, Raeume "
                      "oder Geraete konkurrieren.",
    "verweis": VERWEIS
})

# ---------------------------------------------------------------- M01-484 (S1)
z484 = [("Planung", 1, 2), ("Ausschreibung", 3, 3), ("Vergabe", 6, 1), ("Geraetelieferung", 7, 3),
        ("Altanlage-Demontage", 10, 2), ("Kernbohrung", 12, 2), ("Montage Klimageraet", 17, 2),
        ("Inbetriebnahme", 19, 2)]
NEU.append({
    "id": "M01-484",
    "pruefungsteil": "AP1",
    "modul": "M01",
    "thema": "Gantt & PSP",
    "typ": "bild",
    "unterTyp": "dropdown",
    "schwierigkeit": 1,
    "frage": "Lies den Balkenplan der Prollmann Rechenzentrum GmbH ab: Zwischen dem Ende der "
             "Kernbohrung und dem Beginn der Montage liegen ___ Tage ohne geplanten Vorgang. Vom "
             "Start der Planung bis zum Ende der Inbetriebnahme vergehen insgesamt ___ Tage.",
    "svg": gantt("M01-484", "Serverraum-Klimatisierung (Gantt)", z484),
    "luecken": [
        {"optionen": ["2", "3", "4", "5"], "loesung": 1},
        {"optionen": ["17", "18", "20", "23"], "loesung": 2}
    ],
    "erklaerungKurz": "Die Kernbohrung endet nach Tag 13, die Montage beginnt zu Tag 17 - dazwischen "
                      "liegen die Tage 14, 15 und 16 ohne Balken, also 3 Tage. Das Projekt laeuft "
                      "von Tag 1 bis Tag 20, das sind 20 Tage.",
    "erklaerungLang": "Zwei Groessen, die im Balkenplan haeufig verwechselt werden: die LUECKE "
                      "zwischen zwei Balken und die GESAMTDAUER. Die Luecke misst man von der "
                      "rechten Kante des einen bis zur linken Kante des naechsten Balkens - hier von "
                      "der Grenze nach Tag 13 bis zur Grenze vor Tag 17, also drei volle Tagesfelder "
                      "(14, 15, 16). Die Gesamtdauer misst man von der linken Kante des ersten bis "
                      "zur rechten Kante des letzten Balkens: Tag 1 bis einschliesslich Tag 20 sind "
                      "20 Tage. Es sind ausdruecklich NICHT 17 Tage - das waere die Summe aller "
                      "Balkenlaengen (2+3+1+3+2+2+2+2), die die drei Wartetage unterschlaegt. Eine "
                      "solche Luecke ist meist ein Hinweis auf eine Abhaengigkeit von aussen: hier "
                      "muss der Beton der Kernbohrung aushaerten, bevor montiert werden darf. Genau "
                      "solche Wartezeiten machen den Unterschied zwischen Aufwand (Summe der "
                      "Balken) und Durchlaufzeit (Gesamtdauer).",
    "verweis": VERWEIS
})

# ---------------------------------------------------------------- M01-485 (S2)
z485 = [("Anforderungsanalyse", 1, 3), ("Konzeption", 4, 3), ("Datenmodell", 7, 2),
        ("Programmierung", 7, 8), ("Datenmigration", 12, 3), ("Testbetrieb", 13, 5),
        ("Schulung", 15, 3), ("Fehlerbehebung", 18, 2), ("Abnahme", 20, 1)]
NEU.append({
    "id": "M01-485",
    "pruefungsteil": "AP1",
    "modul": "M01",
    "thema": "Gantt & PSP",
    "typ": "bild",
    "unterTyp": "mc",
    "schwierigkeit": 2,
    "frage": "Die Projektleiterin der Bergstetter Medientechnik GmbH beschreibt den Balkenplan im "
             "Statusbericht so: (1) Die Anforderungsanalyse dauert drei Tage. (2) Der Testbetrieb "
             "beginnt erst, wenn die Programmierung vollstaendig abgeschlossen ist. (3) Die Schulung "
             "dauert genauso lang wie die Datenmigration. (4) Das Projekt endet mit Ablauf von "
             "Tag 20. Welche dieser vier Aussagen widerspricht dem Balkenplan?",
    "svg": gantt("M01-485", "Einfuehrung Redaktionssystem (Gantt)", z485),
    "optionen": ["Aussage (1)", "Aussage (2)", "Aussage (3)", "Aussage (4)"],
    "loesungIndex": 1,
    "distraktorErklaerungen": [
        ("Der Balken der Anforderungsanalyse ist drei Tagesfelder breit (Tag 1 bis 3). Die Aussage "
        "stimmt."),
        "",
        ("Die Schulung liegt ueber Tag 15 bis 17, die Datenmigration ueber Tag 12 bis 14 - beide sind "
        "drei Tage lang. Die Aussage stimmt."),
        ("Der am weitesten rechts endende Balken ist die Abnahme; ihre rechte Kante liegt an der "
        "Grenze nach Tag 20. Die Aussage stimmt.")
    ],
    "erklaerungKurz": "Aussage (2) ist falsch: Die Programmierung laeuft bis zum Ende von Tag 14, "
                      "der Testbetrieb beginnt aber schon zu Tag 13. Die beiden Balken ueberlappen "
                      "sich an Tag 13 und 14 - der Testbetrieb startet also VOR dem Abschluss der "
                      "Programmierung.",
    "erklaerungLang": "Diese Aufgabe prueft, ob ein Begleittext zum Balkenplan passt. Genau das ist "
                      "in der Praxis der haeufigste Fehler in Statusberichten: Der Text beschreibt "
                      "den urspruenglich gedachten Ablauf, waehrend der Plan inzwischen etwas "
                      "anderes zeigt. Vorgehen: jede Aussage EINZELN am Bild pruefen und nicht nach "
                      "der ersten plausibel klingenden aufhoeren. (1) Anforderungsanalyse Tag 1 bis "
                      "3, also drei Tage - stimmt. (2) Programmierung Tag 7 bis 14, Testbetrieb "
                      "Tag 13 bis 17. An den Tagen 13 und 14 laufen beide gleichzeitig; es liegt "
                      "also eine Ueberlappung vor und keine reine Reihenfolge - diese Aussage stimmt "
                      "NICHT. (3) Schulung Tag 15 bis 17 und Datenmigration Tag 12 bis 14 sind beide "
                      "drei Tage lang - stimmt. (4) Der letzte Balken (Abnahme) endet an der Grenze "
                      "nach Tag 20 - stimmt. Fachlich ist eine solche Ueberlappung nicht automatisch "
                      "ein Planungsfehler: Man spricht von einer Vorlaufzeit, wenn der Testbetrieb "
                      "bewusst schon mit fertigen Teilen beginnt, waehrend an anderen weitergebaut "
                      "wird. Falsch ist hier nur die BESCHREIBUNG im Bericht.",
    "verweis": VERWEIS
})

# ---------------------------------------------------------------- M01-486 (S2)
z486 = [("Datenanalyse", 1, 3), ("Feldmapping", 4, 3), ("Datenbereinigung", 7, 3),
        ("Testmigration", 10, 2), ("Fehlerkorrektur", 12, 2), ("Zweiter Testlauf", 14, 2),
        ("Echtmigration", 16, 3), ("Nachkontrolle", 19, 2)]
NEU.append({
    "id": "M01-486",
    "pruefungsteil": "AP1",
    "modul": "M01",
    "thema": "Gantt & PSP",
    "typ": "bild",
    "unterTyp": "dropdown",
    "schwierigkeit": 2,
    "frage": "Im Plan der Kaltenbrink Versandapotheke GmbH folgt jeder Vorgang unmittelbar auf "
             "seinen Vorgaenger. Die Datenbereinigung beginnt vier Tage spaeter als geplant; Dauer "
             "und Reihenfolge aller Vorgaenge bleiben unveraendert. Die Echtmigration beginnt dann "
             "an Tag ___ und das Projekt endet mit Ablauf von Tag ___ .",
    "svg": gantt("M01-486", "Migration Warenwirtschaft (Gantt)", z486),
    "luecken": [
        {"optionen": ["18", "19", "20", "22"], "loesung": 2},
        {"optionen": ["22", "23", "24", "26"], "loesung": 2}
    ],
    "erklaerungKurz": "Geplant beginnt die Echtmigration an Tag 16 und das Projekt endet nach "
                      "Tag 20. Weil kein Vorgang Puffer hat, verschiebt eine Verzoegerung von vier "
                      "Tagen ALLE Nachfolger um vier Tage: Echtmigration Tag 20, Projektende "
                      "Tag 24.",
    "erklaerungLang": "Zuerst den Ist-Plan ablesen: Datenanalyse Tag 1 bis 3, Feldmapping 4 bis 6, "
                      "Datenbereinigung 7 bis 9, Testmigration 10 bis 11, Fehlerkorrektur 12 bis 13, "
                      "zweiter Testlauf 14 bis 15, Echtmigration 16 bis 18, Nachkontrolle 19 bis 20. "
                      "Die Balken schliessen ohne Luecke aneinander an - es gibt also keinen Puffer. "
                      "Genau das ist die Bedingung, unter der eine Verzoegerung ungebremst nach "
                      "hinten durchgereicht wird: Jeder Nachfolger kann erst starten, wenn sein "
                      "Vorgaenger fertig ist. Vier Tage Verzug bedeuten daher vier Tage spaeter fuer "
                      "JEDEN Folgevorgang - die Echtmigration rutscht von Tag 16 auf Tag 20, das "
                      "Projektende vom Ende des Tages 20 auf das Ende des Tages 24. Haette einer der "
                      "Vorgaenge Puffer, also eine Luecke zu seinem Nachfolger, wuerde ein Teil der "
                      "Verzoegerung darin aufgefangen und das Projektende verschoebe sich weniger "
                      "stark. Deshalb lohnt sich vor jeder Terminfrage der Blick auf die Luecken "
                      "zwischen den Balken.",
    "verweis": VERWEIS
})

# ---------------------------------------------------------------- M01-487 (S2)
z487 = [("Planung", 1, 2), ("Serverinstallation", 3, 4), ("Netzwerkanschluss", 7, 2),
        ("Softwarepaketierung", 3, 7), ("Lizenzpruefung", 10, 4), ("Client-Verteilung", 14, 3),
        ("Schulungsunterlagen", 14, 2), ("Funktionstest", 17, 2), ("Abnahme", 19, 2)]
NEU.append({
    "id": "M01-487",
    "pruefungsteil": "AP1",
    "modul": "M01",
    "thema": "Gantt & PSP",
    "typ": "bild",
    "unterTyp": "lueckentext",
    "schwierigkeit": 2,
    "frage": "Im Balkenplan der Nienhaus Schulungszentrum GmbH laufen nach der Planung zwei Zweige "
             "parallel: Zweig A ist Serverinstallation plus Netzwerkanschluss, Zweig B ist "
             "Softwarepaketierung plus Lizenzpruefung. Die Client-Verteilung kann erst beginnen, "
             "wenn BEIDE Zweige fertig sind. Zweig A hat dadurch einen Puffer von ___ Tagen. "
             "Verzoegert sich die Lizenzpruefung um zwei Tage, endet das Projekt mit Ablauf von "
             "Tag ___ .",
    "svg": gantt("M01-487", "Aufbau Schulungsraum (Gantt)", z487),
    "luecken": [
        ["5", "fuenf", "fünf"],
        ["22", "zweiundzwanzig"]
    ],
    "erklaerungKurz": "Zweig A endet nach Tag 8, Zweig B erst nach Tag 13 - Zweig A hat also 5 Tage "
                      "Puffer. Weil die Client-Verteilung auf den LAENGEREN Zweig wartet, verschiebt "
                      "eine Verzoegerung der Lizenzpruefung um zwei Tage das Projektende von Tag 20 "
                      "auf Tag 22.",
    "erklaerungLang": "Bei zwei parallelen Zweigen vor einem gemeinsamen Nachfolger bestimmt immer "
                      "der LAENGERE den Termin; der kuerzere hat Puffer. Ablesen: Planung Tag 1 bis "
                      "2. Zweig A besteht aus Serverinstallation (Tag 3 bis 6) und Netzwerkanschluss "
                      "(Tag 7 bis 8), endet also nach Tag 8. Zweig B besteht aus Softwarepaketierung "
                      "(Tag 3 bis 9) und Lizenzpruefung (Tag 10 bis 13), endet also nach Tag 13. "
                      "Beide starten gemeinsam an Tag 3, aber Zweig A ist fuenf Tage frueher fertig. "
                      "Diese fuenf Tage sind sein Puffer - Zweig A duerfte sich um bis zu fuenf Tage "
                      "verzoegern, ohne dass die Client-Verteilung spaeter beginnen muesste. Zweig B "
                      "dagegen hat KEINEN Puffer: Er liegt auf dem Weg, der die Projektdauer "
                      "bestimmt, also auf dem kritischen Weg. Jede Verzoegerung dort schlaegt eins "
                      "zu eins auf den Endtermin durch, hier von Tag 20 auf Tag 22. Die "
                      "Schulungsunterlagen (Tag 14 bis 15) liegen ebenfalls nicht auf dem kritischen "
                      "Weg und aendern am Endtermin nichts. Merksatz: Puffer besitzt nur, wer NICHT "
                      "auf dem kritischen Weg liegt.",
    "verweis": VERWEIS
})

# ================================================= NEUZEICHNUNG DER BESTANDSBILDER
# M01-113: Die Achse endete bei "9+", der Fragetext sprach von 10 Tagen; der
# Meilenstein sass bei Tag 5,5 statt bei Tag 7 und war ein winziges DREIECK statt
# der Raute, die M01-960 und M09-053 als Meilenstein-Symbol lehren. Der Plan wird
# auf Nutzer-Entscheid zugleich auf 20 Tage und 9 Vorgaenge aufgestockt.
# Die LOESUNG bleibt: die Freigabe endet zuletzt.
REP_113_SVG = gantt(
    "M01-113", "Software-Entwicklungsprojekt (Gantt)",
    [("Anforderung", 1, 3), ("Grobentwurf", 4, 2), ("Feinentwurf", 6, 3), ("Implementierung", 9, 5),
     ("Modultest", 12, 3), ("Dokumentation", 15, 3), ("Integrationstest", 15, 2),
     ("Abnahmetest", 17, 2), ("Freigabe", 19, 2)],
    meilenstein=("Meilenstein Code-Freeze", 14))
REP_113_FRAGE = ("Das Gantt-Diagramm zeigt ein Software-Entwicklungsprojekt mit 9 Vorgaengen ueber "
                 "20 Arbeitstage und einem Meilenstein am Ende von Tag 14. Welcher Vorgang endet "
                 "zeitlich zuletzt und bestimmt damit die Projektdauer?")
REP_113_OPTIONEN = ["Feinentwurf", "Implementierung", "Abnahmetest", "Freigabe"]
REP_113_DISTR = [
    "Der Feinentwurf endet bereits nach Tag 8 - er liegt im ersten Drittel des Plans.",
    ("Die Implementierung endet nach Tag 13. Sie ist zwar der laengste Balken, aber der laengste "
    "Vorgang ist nicht automatisch der spaeteste."),
    "Der Abnahmetest endet nach Tag 18. Danach folgt noch ein weiterer Balken.",
    ""
]
REP_113_KURZ = ("Die Freigabe liegt ueber Tag 19 und 20 und hat damit die am weitesten rechts "
                "liegende Balkenkante. Sie bestimmt das Projektende.")
REP_113_LANG = ("Den letzten Vorgang findet man, indem man die RECHTEN Balkenkanten vergleicht - "
                "nicht die Balkenlaengen. Die Implementierung ist mit fuenf Tagen der laengste "
                "Balken, endet aber schon nach Tag 13. Dokumentation und Integrationstest laufen ab "
                "Tag 15 parallel, der Abnahmetest endet nach Tag 18. Am weitesten rechts steht die "
                "Freigabe (Tag 19 bis 20); ihre rechte Kante markiert das Projektende an Tag 20. "
                "Die Raute an der Grenze nach Tag 14 ist ein Meilenstein: ein Zeitpunkt ohne eigene "
                "Dauer, hier der Code-Freeze. Meilensteine verlaengern das Projekt nicht, sie "
                "markieren nur einen Zustand - deshalb werden sie als Raute und nicht als Balken "
                "gezeichnet.")

# M01-481: Die Zeitachse war NICHT LINEAR (15/12/16/14 px je Tag) und die Balken
# passten nicht zu ihr - der Entwicklungs-Balken lag geometrisch bei Tag 9-19,
# beschriftet war er mit "Tag 6-15". Die richtige Antwort (10 Tage) war nur aus
# dem Textlabel ablesbar, nicht aus dem Bild. Jetzt durchgehend 30 px je Tag und
# auf Nutzer-Entscheid auf 9 Vorgaenge aufgestockt. Optionen bleiben unveraendert.
REP_481_SVG = gantt(
    "M01-481", "Projektplan (Gantt)",
    [("Anforderungsaufnahme", 1, 2), ("Design", 3, 3), ("Datenbankschema", 4, 3),
     ("Entwicklung", 6, 10), ("Code-Review", 11, 5), ("Testen", 16, 2), ("Schulung", 16, 3),
     ("Fehlerbehebung", 18, 2), ("Deployment", 20, 1)])
REP_481_FRAGE = ("Wie lange dauert die Aktivitaet 'Entwicklung' in diesem Gantt-Diagramm? "
                 "Lies die Dauer an der Breite des Balkens ab.")
REP_481_DISTR = [
    "5 Tage ist die Dauer des Code-Reviews (Tag 11 bis 15), nicht die der Entwicklung.",
    "",
    ("15 Tage waeren die Spanne vom Beginn der Entwicklung bis zum Projektende (Tag 6 bis 20) - "
    "das ist nicht die Dauer des Vorgangs, sondern die Restlaufzeit des Projekts."),
    "20 Tage ist die Gesamtdauer des ganzen Projekts, nicht die eines einzelnen Vorgangs."
]
REP_481_KURZ = ("Der Entwicklungs-Balken beginnt an der Grenze zu Tag 6 und endet an der Grenze "
                "nach Tag 15. Er ueberdeckt damit zehn Tagesfelder: 10 Tage.")
REP_481_LANG = ("Die Dauer eines Vorgangs liest man an der BREITE seines Balkens ab, gemessen in "
                "Tagesfeldern der Zeitachse. Der Balken der Entwicklung reicht von der linken Kante "
                "des Tages 6 bis zur rechten Kante des Tages 15 und ueberdeckt damit die Tage 6, 7, "
                "8, 9, 10, 11, 12, 13, 14 und 15 - also 10 Tage. Drei typische Fehler lauern hier: "
                "die Dauer eines anderen Balkens ablesen (das Code-Review dauert 5 Tage), die "
                "Restlaufzeit des Projekts ab dem Start des Vorgangs nehmen (Tag 6 bis 20 = "
                "15 Tage), oder die Gesamtdauer des Projekts angeben (20 Tage). Beachte auch, dass "
                "sich Entwicklung und Code-Review von Tag 11 bis 15 ueberlappen und Testen und "
                "Schulung ab Tag 16 parallel laufen - Balken duerfen sich ueberschneiden, wenn "
                "Vorgaenge gleichzeitig bearbeitet werden.")


def main():
    with open(POOL, encoding="utf-8") as fh:
        pool = json.load(fh)
    vorher = len(pool)
    idx = {f["id"]: f for f in pool}

    # Idempotent: ein zweiter Lauf ERSETZT die sechs Fragen, statt sie zu verdoppeln.
    erneut = [f["id"] for f in NEU if f["id"] in idx]
    if erneut:
        print("ERSETZE bestehende Fragen: {!s}".format(", ".join(erneut)))
        pool = [f for f in pool if f["id"] not in erneut]
        idx = {f["id"]: f for f in pool}
    for fid in ("M01-113", "M01-481"):
        if fid not in idx:
            sys.exit(f"ABBRUCH: {fid!s} nicht im Pool gefunden.")

    q = idx["M01-113"]
    q["svg"], q["frage"] = REP_113_SVG, REP_113_FRAGE
    q["optionen"], q["loesungIndex"] = REP_113_OPTIONEN, 3
    q["distraktorErklaerungen"] = REP_113_DISTR
    q["erklaerungKurz"], q["erklaerungLang"] = REP_113_KURZ, REP_113_LANG

    q = idx["M01-481"]
    q["svg"], q["frage"] = REP_481_SVG, REP_481_FRAGE
    q["distraktorErklaerungen"] = REP_481_DISTR
    q["erklaerungKurz"], q["erklaerungLang"] = REP_481_KURZ, REP_481_LANG

    # NICHT global sortieren: pool_m01.json ist gewachsen und NICHT nach ID sortiert.
    # Ein sort() wuerde die ganze Datei umschichten und den Diff unlesbar machen.
    pos = next(i for i, f in enumerate(pool) if f["id"] == "M01-481") + 1
    pool[pos:pos] = NEU
    with open(POOL, "w", encoding="utf-8") as fh:
        json.dump(pool, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    print(f"pool_m01.json: {vorher:d} -> {len(pool):d} Fragen ({len(NEU):d} neu, 2 Bestandsbilder neu gezeichnet)")
    print("JETZT ZWINGEND:  python3 build_fragen.py")


if __name__ == "__main__":
    main()
