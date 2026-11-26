#!/usr/bin/env python3
"""tools/katalog/katalog_parse.py – DEN PRUEFUNGSKATALOG IN SEINE STRUKTUR ZERLEGEN.

    python3 tools/katalog/katalog_parse.py --pruefen    Selbstpruefung, schreibt nichts
    python3 tools/katalog/katalog_parse.py --zeigen     Ergebnis lesbar ausgeben
    python3 tools/katalog/katalog_parse.py --schreiben  katalog_teil1.json neu bauen

══════════ WARUM ES DIESES SKRIPT GIBT (04.09.2026) ══════════
Etappe C wollte die Katalog-Abdeckung messen. Das naive Verfahren – Begriffe aus dem Fliesstext
ziehen – ist gemessen und VERWORFEN: 578 Kandidaten, davon 111 „im Pool nicht auffindbar", und
fast alle davon Rauschen (`Fragenkompiex`, `Hinblick`) oder Kompositum-Artefakte (`Kl-Software`
fuer KI-Software). ►► **WORTEBENE TAUGT NICHT.**

Der Katalog ist aber STRUKTURIERT, und zwar dreispaltig:
    Spalte 1  Fragenkomplex   („01 Planen, Vorbereiten und Durchfuehren … § 4 Absatz 2 Nummer 1")
    Spalte 2  Themenkreis     („01 Merkmale und Methoden des Projektmanagements … koennen")
                              darunter eingerueckt die Inhaltspunkte („- Merkmale eines Projektes")
    Spalte 3  Beispiele fuer betriebliche Handlungen/Qualifikationen (Text der Ausbildungsordnung)

⚠️ **DER FLIESSTEXT `pruefungskatalog_ocr.txt` VERLIERT DIESE SPALTEN.** Tesseract gibt Spalte 2
komplett aus, dann Spalte 3 – die Zuordnung Themenkreis → Beispiel ist darin nicht mehr lesbar,
und auf mehreren Seiten reisst die OCR die Nummer vom Titel ab (Zeile 443 des Fliesstextes ist
nur „02"). Ein Parser auf diesem Text waere geraten, nicht gemessen.

►► **DESHALB LIEST DIESES SKRIPT DIE WORTKOORDINATEN**, nicht den Fliesstext: `tsv/k-NN.tsv`,
erzeugt mit `tesseract k-NN.png ausgabe -l deu tsv`. Jedes Wort bringt seine Kanten mit, und die
Spalten trennen sich damit von selbst. Gleiches Verfahren wie bei der Reparatur des
Buch-Inhaltsverzeichnisses am 03.09. – dort gingen 49 Abschnitte verloren, WEIL ein zeilenbasierter
Parser die Spaltengrenze nicht sah.

⚠️ **DIE TSV-DATEIEN LIEGEN IN `../Buch/katalog/tsv/`** (privat, seit 09.10.2026 - vorher `tools/katalog/tsv/`). Grund: `tesseract-ocr-deu` ist auf
dem Windows-Rechner nicht installiert und laesst sich dort ohne Administratorrechte nicht
nachinstallieren. Ohne die TSV waere dieses Skript in der naechsten Sitzung nicht mehr lauffaehig –
und ein Werkzeug, das nur einmal lief, ist eine Messung, keine Pruefung.

⚠️ **BENUTZBAR IST NUR TEIL 1** (PDF-Seiten 9–16). Die Trennung der Teile ist die wichtigste Regel
der ganzen Runde („eine Luecke gegenueber Teil 2 ist keine Luecke bei uns").

⛔ **`--teil 2` LIEST, BESTEHT SEINE EIGENE PROBE ABER NOCH NICHT.** Stand 06.09.: 15 Fragenkomplexe,
117 Themenkreise, 617 Inhaltspunkte – und **37 gemeldete Probleme**: neun Zeichenverluste (S.19, 26
und 32 verlieren ganze Zeilen; S.17, 18, 20, 23, 25, 27 nur die zweite und dritte Lernfeld-Angabe
einer Seite, weil `lernfelder` nur die erste behaelt), dazu fehlende Lernfeld-Angaben und
Themenkreise ohne Inhaltspunkte. ►► **DIE ZAHLEN AUS TEIL 2
SIND DESHALB NICHT ZU VERWENDEN**, und `katalog_teil2.json` wird bewusst NICHT im Repo gefuehrt.
Die Probe meldet es selbst – das ist der Zweck der Probe, nicht ihr Versagen. Warum die Arbeit
trotzdem drinsteht: die Wortkoordinaten und die Zeichenmessung fuer S.17–36 liegen vor, wer Teil 2
braucht, fixt nur noch das Zusammensetzen.

⚠️ **DAS ERGEBNIS IST EIN KANDIDATENFILTER, KEIN URTEIL.** Es sagt, was der Katalog nennt – nicht,
ob unser Pool es abdeckt. Jeder Abgleich gegen den Pool ist eine SUBSTANZPRUEFUNG von Hand:
steht der Begriff in Frage, richtiger Antwort, Musterloesung, Pflichtbegriffen, `paare`,
`luecken` oder `zeilen` – oder nur in einer Erklaerung bzw. einem Distraktor?

⚠️ **OCR-EIGENHEITEN BLEIBEN STEHEN** („2. B." statt „z. B.", „Kl-" statt „KI-", „$"/„8" statt
„§", „|T-Sicherheitsrichtlinien"). Sie werden NICHT stillschweigend repariert, damit niemand den
geglaetteten Text fuer den Wortlaut haelt. Vor jeder Aenderung am Bestand: Seitenbild lesen.
"""
import argparse
import collections
import csv
import json
import os
import re
import sys

HIER = os.path.dirname(os.path.abspath(__file__))
# N40 V2 (09.10.2026, E66): die Katalog-DATEN liegen privat in ../Buch/katalog (Repo Fisi2026/ap1-buch),
# nicht im oeffentlichen Repo - die OCR traegt den ©-Vermerk des Katalog-Herausgebers. Fehlen sie: Meldung, rc 2.
DATEN = os.path.normpath(os.path.join(os.path.dirname(os.path.dirname(HIER)), "..", "Buch", "katalog"))


def daten_da():
    if os.path.isdir(DATEN):
        return
    sys.stderr.write(f"Katalog-Daten fehlen: {DATEN!s} - sie liegen privat im Repo Fisi2026/ap1-buch "
                     "(bash tools/einrichten.sh holt es nach ../Buch).\n")
    sys.exit(2)
TSV = os.path.join(DATEN, "tsv")
ZIEL = os.path.join(DATEN, "katalog_teil%s.json")
ZEICHEN = os.path.join(DATEN, "aufzaehlungszeichen.json")
# ⚠️ Teil 1 und Teil 2 stehen im SELBEN Tabellenaufbau, aber die Trennung ist die wichtigste
#    Regel der ganzen Runde: „eine Luecke gegenueber Teil 2 ist keine Luecke bei uns".
#    S.37-40 sind der Sinnbild-Anhang (EPK, BPMN, Netzplan, Koppelelemente), keine Themenkreise;
#    ab S.41 folgt der Anhang mit SQL, UML und den Praefixen.
TEILE = {
    "1": [f"{n:02d}" for n in range(9, 17)],
    "2": [f"{n:02d}" for n in range(17, 37)],
}
SEITEN = TEILE["1"]

KOPFZEILE_BIS = 300        # px; darueber steht der Seitenkopf, nicht die Tabelle
RANDNUMMER_AB = 1400       # px; alles weiter rechts ist die Seitenzahl, kein Inhalt
LEERBAND_MIN = 18          # px; ab dieser Breite gilt eine senkrechte Luecke als Spaltengrenze
ZEILENHOEHE = 14           # px; Woerter mit geringerem Hoehenunterschied stehen in EINER Zeile
GRENZE_NOTFALL = 540       # px; nur fuer Seiten, deren Spalte 1 (fast) leer ist
# Kasten links vom Zeilenanfang, in dem das Aufzaehlungszeichen steht (siehe zeichen_messen).
ZEICHEN_KASTEN = (-34, -6, -2, 24)   # x_von, x_bis, y_von, y_bis – relativ zu (xt, y)
ZEICHEN_SCHWELLE = 140               # Grauwert; darunter gilt ein Bildpunkt als Tinte

# Einrueckungsstufen in Spalte 2, gemessen als Versatz zur Kante des ersten Themenkreis-Kopfes.
# Gemessen am 04.09. auf allen acht Seiten: die vier Stufen liegen bei 0-9, 39-48, 62-74, 87-94.
STUFE_KOPF = 20
STUFE_TITELFORTSETZUNG = 55
STUFE_PUNKT = 80

# OCR-Varianten der Aufzaehlungszeichen. « und ® sind Fehllesungen von •, > von ▸.
MARKER = re.compile(r"^\s*([-–—*«»®>▸•·])\s*")
NUR_MARKER = set("-–—*«»®>▸•·")
NUMMER = re.compile(r"^(\d{2})\s+(\S.*)$")
# Lernfeld-Angabe: muss OCR-Rauschen vertragen. Gemessen kamen vor: „LF1,LFZ,LF3,LF5,LF6",
# „LF 2, LF3", „LFS5", „|LF4". ⚠️ Ein zu enges Muster hat „LFS5" auf Seite 12 fallen lassen –
# gemeldet hat das erst die Zeichenprobe, nicht das Auge.
LERNFELD = re.compile(r"[|\s]*(?:LF\s?[A-Za-z0-9]{0,3}[,\s]*)+")


def woerter(seite):
    """Alle Woerter einer Seite als dict(x, y, b, t). OHNE Kopfzeile und Randnummer."""
    pfad = os.path.join(TSV, f"k-{seite}.tsv")
    with open(pfad, newline="", encoding="utf-8") as fh:
        roh = [r for r in csv.DictReader(fh, delimiter="\t", quoting=csv.QUOTE_NONE)
               if r["text"] and r["text"].strip()]
    aus = []
    for r in roh:
        x, y, b = int(r["left"]), int(r["top"]), int(r["width"])
        if y < KOPFZEILE_BIS or x > RANDNUMMER_AB:
            continue
        aus.append({"x": x, "y": y, "b": b, "t": r["text"]})
    return aus


def spaltengrenzen(ws):
    """Senkrechte Leerbaender finden.
    ⚠️ NICHT die Zeilengruppierung von tesseract benutzen – auf den Seiten 10, 11, 14 und 15
    fasst sie alle drei Spalten zu EINER Zeile zusammen."""
    breite = 1700
    deckung = [0] * breite
    for w in ws:
        for x in range(max(0, w["x"]), min(breite, w["x"] + w["b"])):
            deckung[x] += 1
    baender, start = [], None
    for x in range(60, RANDNUMMER_AB):
        if deckung[x] == 0:
            start = x if start is None else start
        else:
            if start is not None and x - start >= LEERBAND_MIN:
                baender.append((start, x))
            start = None
    if start is not None:
        baender.append((start, RANDNUMMER_AB))

    def breitestes(lo, hi):
        k = [b for b in baender if lo <= (b[0] + b[1]) // 2 <= hi]
        return max(k, key=lambda b: b[1] - b[0]) if k else None

    a, b = breitestes(350, 660), breitestes(950, 1260)
    return ((a[0] + a[1]) // 2 if a else GRENZE_NOTFALL,
            (b[0] + b[1]) // 2 if b else 1080)


def spalten(seite):
    """Woerter nach Spalte trennen und INNERHALB der Spalte zu Zeilen buendeln.

    Je Zeile: x (linke Kante), xt (linke Kante des ersten Wortes NACH dem Aufzaehlungszeichen),
    rechts (rechte Kante), y (obere Kante), text, marker.
    ⚠️ `xt` und nicht `x` traegt die Einrueckungsstufe: die OCR verschluckt das Zeichen `•` auf
    drei von sechs Zeilen, dann beginnt die Zeile beim Text und `x` springt eine Stufe weiter.
    """
    ws = woerter(seite)
    g1, g2 = spaltengrenzen(ws)
    eimer = {1: [], 2: [], 3: []}
    for w in ws:
        eimer[1 if w["x"] < g1 else (2 if w["x"] < g2 else 3)].append(w)
    aus = {}
    for nr, liste in eimer.items():
        liste.sort(key=lambda w: (w["y"], w["x"]))
        roh, offen = [], None
        for w in liste:
            if offen is not None and abs(w["y"] - offen[0]["y"]) <= ZEILENHOEHE:
                offen.append(w)
            else:
                offen = [w]
                roh.append(offen)
        zeilen = []
        for gruppe in roh:
            gruppe.sort(key=lambda w: w["x"])
            i = 0
            while i < len(gruppe) and all(c in NUR_MARKER for c in gruppe[i]["t"]):
                i += 1
            marker = i > 0
            rest = gruppe[i:] if i < len(gruppe) else gruppe
            text = " ".join(w["t"] for w in rest)
            if not marker:
                m = MARKER.match(text)
                if m:                       # Zeichen klebt am Wort: „-Kundenkommunikation"
                    marker, text = True, text[m.end():]
            zeilen.append({"x": gruppe[0]["x"], "xt": rest[0]["x"], "y": gruppe[0]["y"],
                           "rechts": max(w["x"] + w["b"] for w in gruppe),
                           "text": text.strip(), "marker": marker})
        if nr == 2:
            gemessen = zeichen_tabelle().get(seite, {})
            for z in zeilen:
                z["tinte"] = gemessen.get(str(z["y"]))
        aus[nr] = zeilen
    return aus[1], aus[2], aus[3]


_ZEICHEN_CACHE = {}


def zeichen_tabelle():
    """Gemessene Tinte im Aufzaehlungs-Kasten je Zeile, aus `aufzaehlungszeichen.json`.

    ⚠️ **DAS IST DER GRUND, WARUM DIESER PARSER NICHT RAET.** Die OCR verschluckt jedes dritte
    Aufzaehlungszeichen; Zeilenabstand und Zeilenlaenge trennen „neuer Punkt" von „Umbruch" auf
    den acht Seiten NICHT sauber (gemessen 04.09.: der Abstand 21 px kommt auf Seite 9 zwischen
    zwei Punkten vor und auf Seite 11 innerhalb eines Punktes). Also wird nicht geraten, sondern
    IM SEITENBILD NACHGESEHEN, ob links vom Zeilenanfang ein Zeichen steht.
    Gemessen ueber alle 342 Zeilen der Spalte 2: 129 Zeilen mit GENAU NULL Bildpunkten (das sind
    die Umbrueche) und 213 mit mindestens drei. Dazwischen liegt nichts – eine saubere Trennung.

    Die Messung steht als Datei im Repo, weil die Seitenbilder es nicht tun (15 MB) und
    `tesseract-ocr-deu` auf dem Windows-Rechner fehlt. Neu erzeugen: `--zeichen-messen` mit den
    PNG unter `katalog_seiten/`.
    """
    if not _ZEICHEN_CACHE:
        if not os.path.exists(ZEICHEN):
            return {}
        with open(ZEICHEN, encoding="utf-8") as fh:
            _ZEICHEN_CACHE.update(json.load(fh))
    return _ZEICHEN_CACHE


def zeichen_messen(bilderordner):
    """Die Tinte im Aufzaehlungs-Kasten je Zeile nachmessen und `ZEICHEN` neu schreiben.
    Braucht die Seitenbilder und Pillow – laeuft nur dort, wo beides vorhanden ist."""
    from PIL import Image
    aus = {}
    for s in SEITEN:
        bild = Image.open(os.path.join(bilderordner, f"k-{s}.png")).convert("L")
        px, (_, hoehe) = bild.load(), bild.size
        _, sp2, _ = spalten(s)
        x_von, x_bis, y_von, y_bis = ZEICHEN_KASTEN
        d = {}
        for z in sp2:
            n = 0
            for X in range(max(0, z["xt"] + x_von), max(0, z["xt"] + x_bis)):
                for Y in range(max(0, z["y"] + y_von), min(hoehe, z["y"] + y_bis)):
                    if px[X, Y] < ZEICHEN_SCHWELLE:
                        n += 1
            d[str(z["y"])] = n
        aus[s] = d
    with open(ZEICHEN, "w", encoding="utf-8") as fh:
        json.dump(aus, fh, indent=0)
        fh.write("\n")
    return aus


def verbinden(alt, neu):
    """Zwei Zeilen zu einem Text fuegen – ein Trennstrich am Zeilenende faellt weg."""
    alt, neu = alt.strip(), neu.strip()
    if not alt:
        return neu
    if alt.endswith("-") and not alt.endswith(" -"):
        return alt[:-1] + neu
    return alt + " " + neu


def fragenkomplexe_der_seite(sp1):
    """Alle Fragenkomplex-Koepfe einer Seite, mit ihrer Hoehe.

    ⚠️ Es koennen MEHRERE auf einer Seite stehen (S.17 traegt zwei), und eine Seite kann
    gar keinen tragen, wenn ein Komplex ueber den Seitenumbruch laeuft. Die erste Fassung
    hat alle Zeilen der Spalte 1 zu EINEM Titel verklebt – auf S.17 wurden daraus zwei
    Fragenkomplexe mit den Themenkreisen 01,02,03,01,02,03 in einem Topf.
    """
    aus = []
    for z in sp1:
        t = z["text"].strip()
        if not t or re.fullmatch(r"\d{1,3}", t):
            continue
        m = re.match(r"^(\d{2})\s+(\S.*)$", t)
        if m:
            aus.append({"nummer": m.group(1), "titel": m.group(2).strip(), "y": z["y"]})
        elif aus:
            aus[-1]["titel"] = verbinden(aus[-1]["titel"], t)
    return aus


def themenkreise(sp2):
    """Aus Spalte 2 die Themenkreise mit ihren Inhaltspunkten lesen.

    Vier Einrueckungsstufen (Versatz zur Kante des ersten Themenkreis-Kopfes):
        0-20   Kopf des Themenkreises („01 Merkmale und Methoden … koennen")
        20-55  Fortsetzung dieses Kopfes
        55-80  Inhaltspunkt, Ebene 1 („- Merkmale eines Projektes")
        ab 80  Unterpunkt, Ebene 2 („• kritischer Weg")

    ⚠️ Innerhalb EINER Stufe unterscheidet die Einrueckung nicht zwischen neuem Punkt und
    Fortsetzung. Das taete das Aufzaehlungszeichen – aber die OCR verschluckt es reihenweise
    (auf Seite 9 drei von sechs `•`).
    ►► **ENTSCHIEDEN WIRD DESHALB IM SEITENBILD**, nicht an einer Regel: `zeichen_tabelle()`
    sagt je Zeile, wie viel Tinte links vom Zeilenanfang steht. Null heisst Umbruch, alles
    andere heisst neuer Punkt. Siehe dort, warum Zeilenabstand und Zeilenlaenge dafuer NICHT
    reichen.
    """
    if not sp2:
        return [], None
    koepfe = [z["xt"] for z in sp2
              if NUMMER.match(z["text"]) or re.fullmatch(r"\d{2}", z["text"].strip())]
    x0 = min(koepfe) if koepfe else min(z["xt"] for z in sp2)
    kreise, offen, lernfelder = [], None, None

    for z in sp2:
        t = z["text"].strip()
        if not t or re.fullmatch(r"\d{1,3}", t):
            continue
        if len(t) <= 30 and LERNFELD.fullmatch(t):
            lernfelder = lernfelder or re.sub(r"^[|\s]*", "", t)
            continue
        stufe = z["xt"] - x0
        kopf = NUMMER.match(t)
        if kopf and stufe < STUFE_KOPF:
            offen = {"nummer": kopf.group(1), "titel": kopf.group(2).strip(), "punkte": [],
                     "_y": z["y"]}
            kreise.append(offen)
            continue
        if offen is None:
            continue
        if stufe < STUFE_TITELFORTSETZUNG:
            offen["titel"] = verbinden(offen["titel"], t)
            continue
        ebene = 1 if stufe < STUFE_PUNKT else 2
        letzter = offen["punkte"][-1] if offen["punkte"] else None
        # Kein Zeichen links vom Zeilenanfang = Umbruch der vorigen Zeile, kein neuer Punkt.
        weiter = (z.get("tinte") == 0 and letzter is not None and letzter["ebene"] == ebene)
        if weiter:
            letzter["text"] = verbinden(letzter["text"], t)
        else:
            offen["punkte"].append({"ebene": ebene, "text": t})
    return kreise, lernfelder


def bauen(teil="1"):
    """Die Seiten eines Teils zu Fragenkomplexen zusammensetzen.

    ⚠️ Die Zuordnung Themenkreis -> Fragenkomplex laeuft ueber die HOEHE auf der Seite, nicht
    ueber die Reihenfolge der Seiten: ein Themenkreis gehoert zu dem letzten Fragenkomplex-Kopf,
    der ueber ihm steht. Nur so tragen Seiten mit ZWEI Komplexen (S.17) und Komplexe, die ueber
    den Seitenumbruch laufen (S.23/24, S.27/28), gleichzeitig.
    """
    komplexe, aktuell = [], None
    for s in TEILE[teil]:
        sp1, sp2, _sp3 = spalten(s)
        koepfe = fragenkomplexe_der_seite(sp1)
        tk, lf = themenkreise(sp2)
        marken = sorted(koepfe, key=lambda k: k["y"])
        for t in tk:
            passend = [k for k in marken if k["y"] <= t.get("_y", 0) + ZEILENHOEHE]
            if passend:
                kopf = passend[-1]
                if aktuell is None or aktuell.get("_kopf") is not kopf:
                    aktuell = {"nummer": kopf["nummer"], "titel": kopf["titel"],
                               "lernfelder": None, "seiten": [], "themenkreise": [],
                               "_kopf": kopf}
                    komplexe.append(aktuell)
            if aktuell is None:
                continue
            if int(s) not in aktuell["seiten"]:
                aktuell["seiten"].append(int(s))
            aktuell["lernfelder"] = aktuell["lernfelder"] or lf
            t.pop("_y", None)
            aktuell["themenkreise"].append(t)
        # Ein Kopf ohne eigenen Themenkreis auf derselben Seite (Komplex beginnt unten,
        # Themenkreise folgen erst auf der naechsten Seite) darf nicht verlorengehen.
        for kopf in marken:
            if not any(k.get("_kopf") is kopf for k in komplexe):
                aktuell = {"nummer": kopf["nummer"], "titel": kopf["titel"], "lernfelder": lf,
                           "seiten": [int(s)], "themenkreise": [], "_kopf": kopf}
                komplexe.append(aktuell)
    for k in komplexe:
        k.pop("_kopf", None)
    return {
        "_quelle": f"Pruefungskatalog FIS 2024, Teil {teil} (PDF-Seiten {TEILE[teil][0]}-{TEILE[teil][-1]}), OCR mit Wortkoordinaten",
        "_gebaut_von": "tools/katalog/katalog_parse.py",
        "_warnung": "KANDIDATENFILTER, KEIN URTEIL. Sagt, was der Katalog nennt - nicht, ob der "
                    "Pool es abdeckt. Jeder Abgleich ist eine Substanzpruefung von Hand.",
        "_ocr_hinweis": "OCR-Eigenheiten bleiben absichtlich stehen ('2. B.', 'Kl-', '$' fuer "
                        "Paragraf). Vor jeder Aenderung am Bestand das Seitenbild lesen.",
        "fragenkomplexe": komplexe,
    }


def zeichenprobe(teil="1"):
    """⚠️ DIE WICHTIGSTE PRUEFUNG: geht beim Zerlegen Text verloren?

    Am 03.09. hat ein Parser 49 Abschnitte des Buch-Inhaltsverzeichnisses still fallen lassen –
    gemerkt habe ich es erst beim Nachzaehlen. Deshalb wird hier je Seite der BUCHSTABENSTROM
    der Spalte 2 mit dem des Ergebnisses verglichen. Verglichen wird auf Zeichen- und nicht auf
    Wortebene, weil das Zerlegen Trennstriche aufloest („Projektmanage-" + „ments") – ein
    Wortvergleich meldete das als Verlust, obwohl nichts fehlt.
    """
    def strom(s):
        return re.sub(r"[^0-9A-Za-zÄÖÜäöüß]", "", s)

    befunde = []
    for s in TEILE[teil]:
        _, sp2, _ = spalten(s)
        tk, lf = themenkreise(sp2)
        soll = strom("".join(z["text"] for z in sp2
                             if not re.fullmatch(r"\d{1,3}", z["text"].strip())))
        ist = strom((lf or "") + "".join(t["nummer"] + t["titel"] +
                                         "".join(p["text"] for p in t["punkte"]) for t in tk))
        if sorted(soll) != sorted(ist):
            fehlt = collections.Counter(soll) - collections.Counter(ist)
            zuviel = collections.Counter(ist) - collections.Counter(soll)
            befunde.append((s, dict(fehlt), dict(zuviel)))
    return befunde


def pruefen(d, teil="1"):
    """Selbstpruefung. Ein Parser, der still danebenliegt, ist schlimmer als keiner."""
    fehler = []
    for s, fehlt, zuviel in zeichenprobe(teil):
        fehler.append(f"Seite {s}: Zeichenstrom weicht ab – fehlt {fehlt}, zuviel {zuviel}")
    ks = d["fragenkomplexe"]
    if teil == "1":
        if len(ks) != 7:
            fehler.append(f"Teil 1 hat 7 Fragenkomplexe (01-07), gefunden: {len(ks):d}")
        if [k["nummer"] for k in ks] != [f"0{i:d}" for i in range(1, len(ks) + 1)]:
            fehler.append("Fragenkomplex-Nummern nicht lueckenlos: %s" % [k["nummer"] for k in ks])
    else:
        # ⚠️ Teil 2 zaehlt DREIMAL von 01 an - je einmal fuer "Teil 1 und Teil 2 der AP2",
        #    "Teil 3 der AP2" und den wirtschafts- und sozialkundlichen Teil. Eine Pruefung auf
        #    eine durchlaufende Nummernfolge waere hier falsch.
        laeufe, vorher = 1, None
        for k in ks:
            if vorher is not None and int(k["nummer"]) <= int(vorher):
                laeufe += 1
            vorher = k["nummer"]
        if laeufe != 3:
            fehler.append(f"Teil 2 hat drei Nummernlaeufe, gefunden: {laeufe:d}")
    for k in ks:
        tk = k["themenkreise"]
        if not tk:
            fehler.append("Fragenkomplex {} hat keinen Themenkreis".format(k["nummer"]))
            continue
        if [t["nummer"] for t in tk] != [f"{i:02d}" for i in range(1, len(tk) + 1)]:
            fehler.append("FK {}: Themenkreis-Nummern {} nicht lueckenlos".format(k["nummer"], [t["nummer"] for t in tk]))
        if not k["lernfelder"]:
            fehler.append("FK {} ohne Lernfeld-Angabe".format(k["nummer"]))
        for t in tk:
            if not t["punkte"]:
                fehler.append("FK {} TK {} ohne Inhaltspunkte".format(k["nummer"], t["nummer"]))
            if len(t["titel"]) < 15:
                fehler.append("FK {} TK {}: Titel verdaechtig kurz: {!r}".format(k["nummer"], t["nummer"], t["titel"]))
    return fehler


def main():
    daten_da()
    p = argparse.ArgumentParser()
    p.add_argument("--zeigen", action="store_true")
    p.add_argument("--pruefen", action="store_true")
    p.add_argument("--schreiben", action="store_true")
    p.add_argument("--teil", default="1", choices=sorted(TEILE))
    a = p.parse_args()
    d = bauen(a.teil)
    if a.zeigen:
        for k in d["fragenkomplexe"]:
            print("\n=== FK {!s}  {!s}   [{!s}]  S.{!s}".format(k["nummer"], k["titel"], k["lernfelder"], ",".join(str(s) for s in k["seiten"])))
            for t in k["themenkreise"]:
                print("  -- {} {}".format(t["nummer"], t["titel"]))
                for pt in t["punkte"]:
                    print("     {} {}".format("*" if pt["ebene"] == 1 else "  -", pt["text"]))
        return 0
    f = pruefen(d, a.teil)
    for z in f:
        print(f"[FEHLER] {z}")
    n = sum(len(k["themenkreise"]) for k in d["fragenkomplexe"])
    m = sum(len(t["punkte"]) for k in d["fragenkomplexe"] for t in k["themenkreise"])
    print("Teil {}: {} Fragenkomplexe, {} Themenkreise, {} Inhaltspunkte – {}".format(a.teil, len(d["fragenkomplexe"]), n, m, f"{len(f)} PROBLEM(E)" if f else "OK"))
    if f:
        return 1
    if a.schreiben:
        with open(ZIEL % a.teil, "w", encoding="utf-8") as fh:
            json.dump(d, fh, ensure_ascii=False, indent=1)
            fh.write("\n")
        print("geschrieben: %s" % (ZIEL % a.teil))
    return 0


if __name__ == "__main__":
    sys.exit(main())
