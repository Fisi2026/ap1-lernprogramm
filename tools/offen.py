#!/usr/bin/env python3
"""Schlusszeile 'Damit offen' aus aufgaben.json erzeugen und gegen BUILD_LOG.md pruefen.
  python3 tools/offen.py zeile     -> druckt die Zeile (in den BUILD_LOG-Eintrag kopieren)
  python3 tools/offen.py --pruefe  -> 0 = letzte Zeile im BUILD_LOG gleich, 1 = Abweichung, 2 = Quelle unlesbar (stumm = rot)
"""
import json
import sys
from pathlib import Path

STATUS = {"offen", "erledigt"}

def lade():
    d = json.loads(Path("aufgaben.json").read_text(encoding="utf-8"))
    a = d["aufgaben"]
    ids = [x["id"] for x in a]
    if len(set(ids)) != len(ids):
        raise ValueError("doppelte id")
    for x in a:
        if not all(x.get(k) for k in ("id", "titel", "status", "beleg")) or x["status"] not in STATUS:
            raise ValueError(f"Eintrag unvollstaendig oder Status unbekannt: {x.get('id')}")
    return a

def zeile(a):
    return "**Damit offen:** " + " · ".join(x["titel"] for x in a if x["status"] == "offen")

def main(arg):
    try:
        z = zeile(lade())
        if arg == "zeile":
            print(z); return 0
        letzte = [z for z in Path("BUILD_LOG.md").read_text(encoding="utf-8").split("\n") if z.startswith("**Damit offen:**")][-1]
    except (OSError, ValueError, KeyError, IndexError) as e:
        print(f"Aufgaben: Quelle nicht lesbar ({type(e).__name__}: {e})"); return 2
    if letzte != z:
        print("Aufgaben: letzte 'Damit offen'-Zeile im BUILD_LOG weicht von aufgaben.json ab - `python3 tools/offen.py zeile`"); return 1
    print("Aufgaben: Schlusszeile = aufgaben.json"); return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "--pruefe"))
