#!/usr/bin/env python3
"""Nimmt M09-051, M09-053 und M09-054 aus der Loeschung zurueck (Nutzer-Entscheid 04.08.2026).
   Grund: sie tragen den Gantt-BILDbestand, nicht nur den Themenstoff – test_gantt verlangt
   >= 12 Gantt-SVGs und >= 2 Meilenstein-Rauten; von drei Rauten im ganzen Pool lagen zwei
   in M09-051 und M09-053. Rohtext aus dem Backup, kein json.dump."""
import json
import re
import sys

BACKUP = sys.argv[1]
ZIEL = "pool/pool_m09_unterricht.json"
IDS = ["M09-051", "M09-053", "M09-054"]


def bloecke(text):
    spans, i, tiefe, start, instr, esc = {}, 0, 0, None, False, False
    while i < len(text):
        c = text[i]
        if instr:
            if esc: esc = False
            elif c == "\\": esc = True
            elif c == '"': instr = False
        else:
            if c == '"': instr = True
            elif c == "{":
                if tiefe == 0: start = i
                tiefe += 1
            elif c == "}":
                tiefe -= 1
                if tiefe == 0:
                    roh = text[start:i + 1]
                    spans[re.search(r'"id"\s*:\s*"([^"]+)"', roh).group(1)] = (start, i + 1)
        i += 1
    return spans


with open(BACKUP, encoding="utf-8") as fh:
    alt = fh.read()
with open(ZIEL, encoding="utf-8") as fh:
    neu = fh.read()
sa, sn = bloecke(alt), bloecke(neu)
for i in IDS:
    if i in sn:
        raise SystemExit(i + " liegt bereits im Pool – Abbruch")

# hinter der letzten noch vorhandenen ID vor 051 einhaengen (Blockreihenfolge bleibt aufsteigend)
anker = next((a for a in ["M09-050", "M09-044", "M09-043", "M09-028"] if a in sn), None)
if not anker:
    raise SystemExit("kein Anker gefunden")
pos = sn[anker][1]
teile = [alt[sa[i][0]:sa[i][1]] for i in IDS]
out = neu[:pos] + "".join(",\n " + t for t in teile) + neu[pos:]

daten = json.loads(out)          # Syntaxprobe VOR dem Schreiben
ids = [f["id"] for f in daten]
assert len(set(ids)) == len(ids), "ID-Dublette"
with open(ZIEL, "w", encoding="utf-8") as fh:
    fh.write(out)
print("M09 jetzt {:d} Fragen, zurueckgenommen: {!s}".format(len(daten), ", ".join(IDS)))
