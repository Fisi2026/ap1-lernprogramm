"""tools/poolzugang.py - der Pool fuer Python-Werkzeuge (N29 Teil 2, E40, 24.09.2026).

⛔ KEIN ZWEITER LADER: ruft `node tools/pool_laden.js --json <art>` und gibt das Ergebnis zurueck.
   Pruefungen, Reihenfolge und Dateiliste stehen NUR dort. Wirft bei einem Befund (rc != 0),
   statt einen halben Pool zurueckzugeben.
   from poolzugang import fragen, faelle      (Werkzeuge laufen als `python3 tools/x.py`,
                                               tools/ steht damit vorn in sys.path)
"""
import json
import os
import subprocess

_LADER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pool_laden.js")


def _lies(art):
    r = subprocess.run(["node", _LADER, "--json", art], capture_output=True, check=False)
    if r.returncode != 0:
        raise RuntimeError("pool_laden.js --json {}: rc={} {}".format(art, r.returncode, r.stderr.decode("utf-8", "replace").strip()))
    return json.loads(r.stdout.decode("utf-8"))


def fragen():
    return _lies("fragen")


def faelle():
    return _lies("faelle")
