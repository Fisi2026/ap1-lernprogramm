#!/usr/bin/env python3
"""tools/css_skala.py - Abstaende und Radien in styles.css auf die Skala ziehen.

    python3 tools/css_skala.py            Trockenlauf: jede Aenderung einzeln, schreibt NICHTS
    python3 tools/css_skala.py --setze    schreibt, wenn beide Zusicherungen halten
    python3 tools/css_skala.py --selbsttest   prueft die Zuordnung an bekannten Faellen

WARUM ES DAS GIBT (10.09.2026, Umbau der Darstellungsschicht):
Gemessen in styles.css: 178 px-Werte bei padding/margin/gap, verteilt auf 22 verschiedene
Zahlen - 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,20,22,26,30,52. Das ist keine Skala,
das ist Gewachsenes. Ein Unterschied von einem Pixel sieht niemand, aber jeder dieser Werte
will gepflegt werden. Genau diese Schicht nimmt einem sonst ein Framework ab.

⚠️ EHRLICH GEMESSEN, WAS ES BRINGT: die Zahl der Werte sinkt von 22 auf 12, nicht auf 5.
Die App steht auf einem 2px-Raster; eine groebere Skala waere nur zu haben, indem Abstaende
sichtbar wandern. Das ist ausdruecklich NICHT das Ziel dieser Runde. Der Gewinn ist, dass
die Sprache danach geschlossen ist: neuer Code erfindet kein 13px mehr, und eine spaetere
Aenderung am Rhythmus ist eine Zeile statt 178.

⛔ WAS ES NICHT ANFASST - und zwar mit Absicht:
  * Schriftgroessen. Sie haengen an der Grenze, ab der axe Text als "gross" wertet
    (18,66 px fett -> 3:1 statt 4,5:1). Ein Abrunden dort kippt einen Kontrasttest, der heute
    gruen ist. Schriftgroessen bekommen eine eigene Runde, mit Blick auf jeden Grenzfall.
  * Rahmen, Schatten, Umrisse, alles in calc() und alles mit var(). Ein 1px-Rahmen ist kein
    Abstand, und calc() umzuschreiben heisst rechnen statt ersetzen.
  * 1px bei Abstaenden: das sind Haarlinien und Ausgleiche (4 Vorkommen), keine Abstaende.
  * 0, negative Werte, Prozente.

⛔⛔ ZWEI ZUSICHERUNGEN VOR DEM SCHREIBEN - beide brechen ab, nichts wird geschrieben:
  1. GEGENPROBE: jede geaenderte Zeile wird aus der neuen Fassung zurueckgerechnet - jedes
     var(--x) wieder auf genau den Wert, der dafuer protokolliert wurde. Kommt dabei nicht
     Zeichen fuer Zeichen die alte Zeile heraus, oder hat sich eine Zeile geaendert, fuer
     die nichts protokolliert ist, hat das Werkzeug mehr angefasst als angekuendigt.
     ⚠️ Der erste Entwurf verlangte hier die unveraenderte Ausgangsdatei. Das war falsch:
     bei einem verschobenen Wert kann das nie halten, die Zusicherung waere entweder immer
     rot oder in Wahrheit leer gewesen. Der Selbsttest hat es aufgedeckt, nicht der Lauf.
  2. TOKEN-PRUEFUNG: jedes Token, das eingesetzt wird, muss in styles.css schon definiert
     sein. Sonst faellt die Regel im Browser stumm aus - der Schnappschuss saehe das nicht,
     weil er das Markup liest und keine Stylesheets.

WERTE, DIE WEITER ALS GRENZE von jeder Stufe entfernt liegen, werden NICHT ersetzt, sondern
aufgelistet. Sie sind bewusste Ausnahmen und gehoeren von Hand entschieden, nicht von einer
Skala ueberfahren.
"""
import os
import re
import sys

DATEI = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "referenz", "styles.css")  # N29 Teil 2
GRENZE = 1.0          # px; darueber wird der Wert in Ruhe gelassen und gemeldet

# Die Skalen. Unten dicht (die App ist kompakt), oben grosszuegiger.
SKALA_ABSTAND = [("--s0", 2), ("--s1", 4), ("--s2", 6), ("--s3", 8), ("--s4", 10),
                 ("--s5", 12), ("--s6", 14), ("--s7", 16), ("--s8", 20), ("--s9", 24),
                 ("--s10", 32), ("--s11", 40)]
SKALA_RADIUS = [("--r1", 4), ("--r2", 8), ("--r3", 10), ("--r4", 12)]

ABSTAND = (r"padding|margin|gap|row-gap|column-gap|padding-top|padding-right|padding-bottom|"
           r"padding-left|padding-inline|padding-block|margin-top|margin-right|margin-bottom|"
           r"margin-left|margin-inline|margin-block")
RADIUS = r"border-radius|border-top-left-radius|border-top-right-radius|border-bottom-left-radius|border-bottom-right-radius"

GRUPPEN = [("Abstand", re.compile(r"(?<![\w-])(" + ABSTAND + r")\s*:\s*([^;{}]+)"), SKALA_ABSTAND, {1.0}),
           ("Radius", re.compile(r"(?<![\w-])(" + RADIUS + r")\s*:\s*([^;{}]+)"), SKALA_RADIUS, set())]

PXWERT = re.compile(r"(?<![\w.-])(\d+(?:\.\d+)?)px")


def naechster(px, skala):
    """Naechste Stufe. Bei Gleichstand gewinnt die groessere - Weissraum darf eher
    wachsen als schrumpfen, und 3px landet so auf 4 statt auf 2."""
    name, wert = min(skala, key=lambda s: (abs(s[1] - px), -s[1]))
    return name, wert, abs(wert - px)


def umbauen(quelle):
    """Liefert (neu, aenderungen, zu_gross). Aenderung: (zeile, eigenschaft, alt, token, abweichung)."""
    # ⚠️ Der Index wird VOR JEDEM Durchgang neu gebaut. Der erste Entwurf baute ihn einmal
    # aus der Ausgangsdatei - nach dem ersten Durchgang stimmten die Zeichenpositionen aber
    # nicht mehr (var(--s3) ist laenger als 8px), und die Radien wurden falschen Zeilen
    # zugeschrieben. Aufgefallen ist es der Gegenprobe, nicht mir.
    zeilen_index = []

    def index_bauen(text):
        del zeilen_index[:]
        pos = 0
        for z in text.split("\n"):
            zeilen_index.append(pos)
            pos += len(z) + 1

    def zeile_von(offset):
        lo, hi = 0, len(zeilen_index) - 1
        while lo < hi:
            m = (lo + hi + 1) // 2
            if zeilen_index[m] <= offset:
                lo = m
            else:
                hi = m - 1
        return lo + 1

    aenderungen, zu_gross = [], []
    neu = quelle
    for titel, muster, skala, ausnahmen in GRUPPEN:
        index_bauen(neu)
        def ersetze_block(m, skala=skala, ausnahmen=ausnahmen, titel=titel):
            eig, wert = m.group(1), m.group(2)
            if "var(" in wert or "calc(" in wert:
                return m.group(0)

            def ersetze_px(pm):
                px = float(pm.group(1))
                if px == 0 or px in ausnahmen:
                    return pm.group(0)
                name, ziel, ab = naechster(px, skala)
                if ab > GRENZE:
                    zu_gross.append((zeile_von(m.start()), titel, eig, pm.group(0), ziel, ab))
                    return pm.group(0)
                aenderungen.append((zeile_von(m.start()), titel, eig, pm.group(0), name, ab))
                return "var(" + name + ")"

            return m.group(1) + m.group(0)[len(m.group(1)):-len(wert)] + PXWERT.sub(ersetze_px, wert)

        neu = muster.sub(ersetze_block, neu)
    return neu, aenderungen, zu_gross


# Nur die Namen der beiden Skalen - NICHT r"--[a-z]\d+": das haette auch var(--g300)
# getroffen, das in styles.css seit jeher fuer Rahmenfarben steht.
TOKEN_IM_TEXT = re.compile(
    r"var\((" + "|".join(re.escape(n) for n, _ in SKALA_ABSTAND + SKALA_RADIUS) + r")\)")


def gegenprobe(quelle, neu, aenderungen):
    """Rechnet jede geaenderte Zeile zurueck und vergleicht mit der alten. Liefert die Liste
    der Beanstandungen - leer heisst: nichts angefasst ausser dem Protokollierten."""
    alt_zeilen, neu_zeilen = quelle.split("\n"), neu.split("\n")
    if len(alt_zeilen) != len(neu_zeilen):
        return [f"Zeilenzahl geaendert: {len(alt_zeilen):d} -> {len(neu_zeilen):d}"]

    protokoll = {}
    for zeile, _titel, _eig, alt, name, _ab in aenderungen:
        protokoll.setdefault(zeile, {}).setdefault(name, []).append(alt)

    fehler = []
    for i, (a, n) in enumerate(zip(alt_zeilen, neu_zeilen), start=1):
        if a == n:
            if i in protokoll:
                fehler.append(f"Z.{i:d}: Aenderung protokolliert, Zeile aber unveraendert")
            continue
        if i not in protokoll:
            fehler.append(f"Z.{i:d}: geaendert, ohne dass etwas protokolliert waere")
            continue
        vorrat = {k: list(v) for k, v in protokoll[i].items()}

        def einsetzen(m, vorrat=vorrat):
            liste = vorrat.get(m.group(1))
            if not liste:
                return "###UNERWARTET###"
            return liste.pop(0)

        zurueckgerechnet = TOKEN_IM_TEXT.sub(einsetzen, n)
        if zurueckgerechnet != a:
            fehler.append(f"Z.{i:d}: Rueckrechnung ergibt nicht die alte Zeile")
        elif any(vorrat.values()):
            fehler.append(f"Z.{i:d}: protokollierte Ersetzung kommt in der Zeile nicht vor")
    return fehler


def tokens_definiert(quelle, benutzt):
    fehlend = []
    for name in sorted(benutzt):
        if not re.search(r"(?<![\w-])" + re.escape(name) + r"\s*:", quelle):
            fehlend.append(name)
    return fehlend


def selbsttest():
    # Bei Gleichstand gewinnt die groessere Stufe - daher 3->4, 5->6, 7->8, 9->10.
    faelle = [(3, SKALA_ABSTAND, "--s1"), (5, SKALA_ABSTAND, "--s2"), (7, SKALA_ABSTAND, "--s3"),
              (9, SKALA_ABSTAND, "--s4"), (13, SKALA_ABSTAND, "--s6"), (8, SKALA_ABSTAND, "--s3"),
              (9, SKALA_RADIUS, "--r3"), (5, SKALA_RADIUS, "--r1"), (12, SKALA_RADIUS, "--r4")]
    fehler = 0
    for px, skala, soll in faelle:
        ist, _, ab = naechster(px, skala)
        if ist != soll or ab > GRENZE:
            print(f"   FEHLER {px:g}px -> {ist} (erwartet {soll})")
            fehler += 1

    probe = ("a{padding:3px 8px;border-radius:9px;margin:var(--x);gap:0}\n"
             "b{padding:8px;border:1px solid var(--g300)}\n"
             "c{padding:26px}\n"
             # Die Radien-Zeile steht mit Absicht ganz unten: bis dahin haben die
             # Abstands-Ersetzungen die Zeichenpositionen um ein gutes Stueck verschoben.
             # Genau daran ist der erste Entwurf gescheitert.
             "d{border-radius:7px;padding:12px}\n")
    neu, aend, gross = umbauen(probe)
    for text, soll in [("padding:var(--s1) var(--s3)", True), ("border-radius:var(--r3)", True),
                       ("margin:var(--x)", True), ("gap:0", True),
                       ("var(--g300)", True), ("border:1px", True), ("padding:26px", True)]:
        if (text in neu) != soll:
            print("   FEHLER Probezeile: '{}' {}".format(text, "fehlt" if soll else "steht drin"))
            fehler += 1
    if len(gross) != 1:
        print("   FEHLER 26px haette als zu weit entfernt gemeldet werden muessen")
        fehler += 1
    beanstandet = gegenprobe(probe, neu, aend)
    if beanstandet:
        print("   FEHLER Gegenprobe: " + "; ".join(beanstandet))
        fehler += 1

    # Gegenprobe der Gegenprobe: eine Zeile von Hand verbiegen, das MUSS auffallen.
    verbogen = neu.replace("gap:0", "gap:99px")
    if not gegenprobe(probe, verbogen, aend):
        print("   FEHLER Gegenprobe merkt eine fremde Aenderung nicht")
        fehler += 1

    print(f"SELBSTTEST: {len(faelle) + 10:d} Faelle, {fehler:d} Fehler")
    return 1 if fehler else 0


def main():
    if "--selbsttest" in sys.argv:
        return selbsttest()
    setze = "--setze" in sys.argv
    with open(DATEI, encoding="utf-8") as fh:
        quelle = fh.read()
    neu, aenderungen, zu_gross = umbauen(quelle)

    exakt = sum(1 for a in aenderungen if a[5] == 0)
    verschoben = [a for a in aenderungen if a[5] > 0]
    print(f"styles.css: {len(aenderungen):d} Ersetzungen ({exakt:d} exakt, {len(verschoben):d} um <= {GRENZE:.0f} px verschoben)")
    if verschoben:
        print()
        print("Verschobene Werte - jede Zeile einzeln lesen:")
        for zeile, titel, eig, alt, name, ab in verschoben:
            print(f"   Z.{zeile:<5} {titel:<8} {eig:<16} {alt:<7} -> {name:<6} ({ab:+.0f} px)")
    if zu_gross:
        print()
        print(f"{len(zu_gross):d} Wert(e) liegen weiter als {GRENZE:.0f} px von jeder Stufe entfernt:")
        for zeile, titel, eig, alt, ziel, ab in zu_gross:
            print(f"   Z.{zeile:<5} {titel:<8} {eig:<16} {alt:<7} naechste Stufe {ziel}px ({ab:.0f} px entfernt)")
        print(">> Sie bleiben stehen. Bewusste Ausnahme oder Skala zu grob? Von Hand entscheiden.")

    benutzt = {a[4] for a in aenderungen}
    fehlend = tokens_definiert(quelle, benutzt)

    if not setze:
        print()
        if fehlend:
            print("HINWEIS: diese Token sind in styles.css noch nicht definiert: " + " ".join(fehlend))
            print("         Erst definieren, sonst faellt die Regel im Browser stumm aus.")
        print("TROCKENLAUF - nichts geschrieben. Mit --setze ausfuehren.")
        return 0

    if neu == quelle:
        print("Nichts zu tun.")
        return 0
    if fehlend:
        print()
        print("ABBRUCH: nicht definierte Token: " + " ".join(fehlend))
        return 1
    beanstandet = gegenprobe(quelle, neu, aenderungen)
    if beanstandet:
        print()
        print(f"ABBRUCH: die Gegenprobe beanstandet {len(beanstandet):d} Stelle(n) - es wurde mehr angefasst als"
              " angekuendigt. Nichts geschrieben.")
        for b in beanstandet[:20]:
            print("   " + b)
        return 1
    with open(DATEI, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(neu)
    print()
    print("GESCHRIEBEN: styles.css (Gegenprobe und Token-Pruefung bestanden)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
