#!/usr/bin/env python3
"""tools/svg_linien.py – Verbindungslinien HINTER die Kaesten legen.

    python3 tools/svg_linien.py --id M03-019,M03-483
    python3 tools/svg_linien.py --id M03-019 --trocken

⚠️ WOZU: In M03-019 und M03-483 standen die <line>-Elemente NACH den <rect>-Elementen. In SVG
   gewinnt das spaeter Gezeichnete - die Verbindungen liefen also ueber die Kaesten und durch die
   Beschriftungen. "Router", "Server", "PC 1" sahen durchgestrichen aus, und die Topologie war
   nicht mehr eindeutig lesbar (eine Sterntopologie sah aus wie eine Kette).

⚠️ DAS VORBILD STAND IM BESTAND: M03-702 zeichnet dieselbe Sterntopologie zuerst die Linien,
   dann die Kaesten mit fill='#fff' - die Kaesten verdecken die Linienenden sauber.
   ►► Bevor eine Grafik neu gezeichnet wird: nachsehen, ob dieselbe Sache anderswo schon
      richtig gezeichnet ist.

⛔ NUR SINNVOLL, WENN DIE KAESTEN DECKEND GEFUELLT SIND. Bei fill='none' oder transparenten
   Klassen aendert die Reihenfolge nichts - dann ist die Fuellung das Problem, nicht die
   Reihenfolge. Das Werkzeug meldet das und ruehrt die Grafik nicht an.
"""
import glob
import json
import re
import sys

LINIE = re.compile(r"<line\b[^>]*/>")
KOPF = re.compile(r"(<svg\b[^>]*>(?:\s*<defs\b[\s\S]*?</defs>)?(?:\s*<style\b[\s\S]*?</style>)?)")


def ohne_fuellung(svg):
    """Kaesten ohne deckende Fuellung – dann hilft Umsortieren nicht."""
    stil = (re.search(r"<style\b[\s\S]*?</style>", svg) or [""])
    stil = stil.group(0) if hasattr(stil, "group") else ""
    if re.search(r"fill\s*:\s*none", stil):
        return True
    rects = re.findall(r"<rect\b[^>]*>", svg)
    if not rects:
        return True
    hat_fill = [r for r in rects if re.search(r"fill=['\"](?!none)", r) or "class=" in r]
    return len(hat_fill) == 0


def main():
    a = sys.argv[1:]
    ids = set(a[a.index("--id") + 1].split(","))
    trocken = "--trocken" in a
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
        for f in daten:
            if not isinstance(f, dict) or f.get("id") not in ids or not f.get("svg"):
                continue
            alt = f["svg"]
            linien = LINIE.findall(alt)
            if not linien:
                print("{!s:<9} keine <line>-Elemente".format(f["id"])); ids.discard(f["id"]); continue
            if ohne_fuellung(alt):
                print("{!s:<9} KAESTEN NICHT DECKEND - nicht angefasst".format(f["id"])); ids.discard(f["id"]); continue
            rumpf = LINIE.sub("", alt)
            m = KOPF.match(rumpf)
            if not m:
                print("{!s:<9} Kopf nicht erkannt - nicht angefasst".format(f["id"])); ids.discard(f["id"]); continue
            ges = m.group(1) + "".join(linien) + rumpf[m.end(1):]
            aj = json.dumps(alt, ensure_ascii=False)[1:-1]
            bj = json.dumps(ges, ensure_ascii=False)[1:-1]
            if neu.count(aj) != 1:
                print("{!s:<9} Fundstelle nicht eindeutig".format(f["id"])); continue
            neu = neu.replace(aj, bj, 1)
            ids.discard(f["id"])
            print("{!s:<9} {!s}  {:d} Linie(n) nach vorn".format(f["id"], pfad.split("/")[-1], len(linien)))
        if neu != roh and not trocken:
            with open(pfad, "w", encoding="utf-8") as fh:
                fh.write(neu)
    if ids:
        print("NICHT GEFUNDEN: " + ", ".join(sorted(ids)))
        return 1
    if trocken:
        print("(trocken - nichts geschrieben)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
