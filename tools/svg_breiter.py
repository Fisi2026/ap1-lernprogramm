#!/usr/bin/env python3
"""tools/svg_breiter.py – eine Grafik waagerecht dehnen, damit der Text hineinpasst.

    python3 tools/svg_breiter.py --id M03-982 --faktor 1.25
    python3 tools/svg_breiter.py --id M03-980,M03-981 --faktor 1.2 --trocken

⚠️ WOZU: `pool_query.js svg` meldet Text, der aus seinem Kasten laeuft. Die Antwort darauf ist
   fast nie, den Text zu kuerzen - bei M03-980/981/982 ist es der woertliche ipconfig-Feldname
   "Verbindungsspezifisches DNS-Suffix", der genau so auf dem Bildschirm steht. Gedehnt wird
   deshalb die Zeichenflaeche, nicht die Sprache.

⚠️ NUR FUER WAAGERECHTE KASTENLISTEN. Gedehnt werden viewBox-Breite, x, width, x1, x2 und cx -
   die Schriftgroesse NICHT. Bei einem Ablaufdiagramm mit schraegen Pfeilen verzerrt das die
   Geometrie; solche Grafiken werden neu gezeichnet, nicht gedehnt.
   ►► Nach jedem Lauf: `node tools/pool_query.js svg` UND ansehen mit svg_bilder.py.
"""
import glob
import json
import re
import sys

# ⚠️ 'width' NICHT in 'stroke-width' treffen - deshalb der Blick nach hinten.
MASSE = re.compile(r"(?<![-\w])(x|width|x1|x2|cx)='(-?[\d.]+)'")


def dehne(svg, f):
    def vb(m):
        z = m.group(1).split()
        z[2] = "%g" % (float(z[2]) * f)
        return "viewBox='{!s}'".format(" ".join(z))
    svg = re.sub(r"viewBox='([^']+)'", vb, svg, count=1)
    return MASSE.sub(lambda m: f"{m.group(1)}='{float(m.group(2)) * f:g}'", svg)


def main():
    a = sys.argv[1:]
    ids = a[a.index("--id") + 1].split(",")
    f = float(a[a.index("--faktor") + 1])
    trocken = "--trocken" in a
    offen = set(ids)
    for pfad in sorted(glob.glob("pool/*.json")):
        with open(pfad, encoding="utf-8") as fh:
            roh = fh.read()
        try:
            daten = json.loads(roh)
        except ValueError:
            continue
        if not isinstance(daten, list):
            continue
        neu = roh
        for frage in daten:
            if not isinstance(frage, dict):
                continue
            fid = frage.get("id")
            if fid not in offen or not frage.get("svg"):
                continue
            alt = frage["svg"]
            ges = dehne(alt, f)
            # ⚠️ Rohtext-Ersatz statt json.dump: der Rest der Datei bleibt Zeichen fuer Zeichen.
            alt_j = json.dumps(alt, ensure_ascii=False)[1:-1]
            ges_j = json.dumps(ges, ensure_ascii=False)[1:-1]
            if neu.count(alt_j) != 1:
                print(f"{fid!s:<9} FUNDSTELLE NICHT EINDEUTIG ({neu.count(alt_j):d}) - uebersprungen")
                continue
            neu = neu.replace(alt_j, ges_j, 1)
            if frage.get("zonen"):
                # ⛔ Die Klickflaechen liegen im SELBEN Koordinatensystem wie das SVG.
                #    Am 28.08. wurden sechs hotspot-Grafiken gedehnt und die Zonen
                #    vergessen - danach war die rechte Vierteflaeche jedes Kastens tot.
                print("{!s:<9} \u26a0\ufe0f hotspot mit {:d} Zonen - ZONEN MITZIEHEN, sonst "
                      "zeigen die Klickflaechen ins Leere. Pruefen: "
                      "node tools/pool_query.js svg (Abschnitt D)".format(fid, len(frage["zonen"])))
            offen.discard(fid)
            print("{!s:<9} {!s}  x{:.2f}  ({:d} -> {:d} Zeichen)".format(fid, pfad.split("/")[-1], f, len(alt), len(ges)))
        if neu != roh and not trocken:
            with open(pfad, "w", encoding="utf-8") as fh:
                fh.write(neu)
    if offen:
        print("NICHT GEFUNDEN: " + ", ".join(sorted(offen)))
        return 1
    if trocken:
        print("(trocken - nichts geschrieben)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
