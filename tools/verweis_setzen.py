#!/usr/bin/env python3
"""tools/verweis_setzen.py – das `verweis`-Feld einzelner Fragen aendern.

WARUM ES DAS GIBT (24.08.2026): Das Rezept aus START_PROMPT Abschnitt 3 („Block von
"id" bis zur naechsten ID abgrenzen, alten Wert suchen, auf GENAU EINE Fundstelle
pruefen, ersetzen, json.loads als Syntaxprobe VOR dem Schreiben") wurde bis heute bei
jedem Verweis-Griff von Hand nachgebaut. Genau davor warnt TASKLIST Sparregel 6.
NIE ueber json.load/json.dump - das formatiert die Pool-Datei um (27.07.: 37.000
Diff-Zeilen fuer 18 Wortkorrekturen).

Aufruf im Training-Ordner:
  python3 tools/verweis_setzen.py --zeige M04-051
  python3 tools/verweis_setzen.py --setze M04-051 "Modul 04, Abschnitt 4.6 - Kontrollstrukturen"
  python3 tools/verweis_setzen.py --batch datei.json      (Objekt: {"M04-051": "neuer Text", ...})
  python3 tools/verweis_setzen.py --batch datei.json --trocken   (nur anzeigen, nichts schreiben)

Sicherungen: vor dem ersten Schreiben wird pool/ nach <Temp>/verweis_backup_<zeit>/ kopiert (tempfile.gettempdir()).
"""
import json
import os
import re
import shutil
import sys
import tempfile
import time

BASIS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POOL = os.path.join(BASIS, "pool")

def dateien():
    return sorted(os.path.join(POOL, f) for f in os.listdir(POOL) if f.endswith(".json"))

def finde(fid):
    """Liefert (pfad, text, start, ende) des Frage-Blocks - oder wirft."""
    marke = f'"id": "{fid}"'
    treffer = []
    for p in dateien():
        with open(p, encoding="utf-8") as fh:
            s = fh.read()
        n = s.count(marke)
        if n > 1:
            raise SystemExit(f"ABBRUCH: {fid!s} steht {n:d}x in {os.path.basename(p)!s}")
        if n == 1:
            treffer.append((p, s, s.index(marke)))
    if not treffer:
        raise SystemExit(f"ABBRUCH: {fid} in keiner Pool-Datei gefunden")
    if len(treffer) > 1:
        raise SystemExit(f"ABBRUCH: {fid} steht in mehreren Dateien")
    p, s, start = treffer[0]
    # Blockende = naechste ID (Pflicht laut Rezept), sonst Dateiende
    m = re.search(r'"id":\s*"M\d\d-\d\d\d"', s[start + len(marke):])
    ende = start + len(marke) + m.start() if m else len(s)
    return p, s, start, ende

FELD = re.compile(r'("verweis":\s*)"((?:[^"\\]|\\.)*)"')
# Sicherung des Pools hoechstens einmal je Lauf (war ein veraenderlicher Standardwert, ruff B006).
_GESICHERT = [False]

def lies(fid):
    p, s, a, b = finde(fid)
    treffer = FELD.findall(s[a:b])
    if len(treffer) != 1:
        raise SystemExit(f"ABBRUCH: {fid!s} hat {len(treffer):d} verweis-Felder im Block (erwartet 1)")
    return p, json.loads(f'"{treffer[0][1]}"')

def setze(fid, neu, trocken=False, gesichert=_GESICHERT):
    p, s, a, b = finde(fid)
    block = s[a:b]
    treffer = FELD.findall(block)
    if len(treffer) != 1:
        raise SystemExit(f"ABBRUCH: {fid!s} hat {len(treffer):d} verweis-Felder im Block (erwartet 1)")
    alt = json.loads(f'"{treffer[0][1]}"')
    if alt == neu:
        print(f"  = {fid} unveraendert")
        return False
    neu_roh = json.dumps(neu, ensure_ascii=False)
    neu_block, n = FELD.subn(lambda m: m.group(1) + neu_roh, block, count=1)
    if n != 1:
        raise SystemExit(f"ABBRUCH: Ersetzung in {fid} hat nicht genau einmal gegriffen")
    print(f"  {fid!s}\n      alt: {alt!s}\n      neu: {neu!s}")
    if trocken:
        return True
    neu_s = s[:a] + neu_block + s[b:]
    json.loads(neu_s)                      # Syntaxprobe VOR dem Schreiben - keine Formalitaet
    if not gesichert[0]:
        ziel = os.path.join(tempfile.gettempdir(), "verweis_backup_{!s}".format(time.strftime("%Y%m%d_%H%M%S")))
        shutil.copytree(POOL, ziel)
        print(f"Sicherung: {ziel!s}")
        gesichert[0] = True
    with open(p, "w", encoding="utf-8") as fh:
        fh.write(neu_s)
    return True

def main():
    a = sys.argv[1:]
    if not a:
        raise SystemExit(__doc__)
    trocken = "--trocken" in a
    a = [x for x in a if x != "--trocken"]
    if a[0] == "--zeige":
        p, v = lies(a[1])
        print(f"{a[1]!s}  ({os.path.basename(p)!s})\n  {v!s}")
    elif a[0] == "--setze":
        setze(a[1], a[2], trocken)
    elif a[0] == "--batch":
        with open(a[1], encoding="utf-8") as fh:
            auftrag = json.load(fh)
        n = sum(1 for fid, neu in sorted(auftrag.items()) if setze(fid, neu, trocken))
        print("{!s}: {:d} von {:d} geaendert".format("TROCKENLAUF" if trocken else "GESCHRIEBEN", n, len(auftrag)))
    else:
        raise SystemExit(__doc__)

if __name__ == "__main__":
    main()
