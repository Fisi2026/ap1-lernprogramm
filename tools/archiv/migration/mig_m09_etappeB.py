#!/usr/bin/env python3
"""Etappe B der M09-Aufloesung (Nutzer-Entscheid 04.08.2026): die letzten 43 Fragen ziehen aus
   der Klausurvorbereitung in die AP1-Module. Danach ist M09 leer und wartet auf die naechste
   Klausur. Moeglich wurde das erst durch die drei neuen A4-Fragen (M07-043/044/045):
   A4 steht bei 47/891 = 5,27 %, der Nenner darf jetzt bis 979 wachsen.

   ROHTEXT-MIGRATION wie in Etappe A: kein json.load/json.dump auf die Pool-Dateien,
   json.loads nur als Syntaxprobe VOR dem Schreiben."""
import json
import os
import re
import sys
from pathlib import Path

POOL = sys.argv[1] if len(sys.argv) > 1 else "pool"
QUELLE = os.path.join(POOL, "pool_m09_unterricht.json")

# (alte ID, neue ID, Zieldatei, Zielmodul, Zielthema, Gebiet, verweis)
def gruppe(paare, datei, modul, thema, gebiet, verweis):
    return [(a, n, datei, modul, thema, gebiet, verweis) for a, n in paare]

UMZUG = []
UMZUG += gruppe([("M09-066", "M01-500"), ("M09-067", "M01-501"), ("M09-068", "M01-502"),
                 ("M09-069", "M01-503"), ("M09-072", "M01-504"), ("M09-073", "M01-505"),
                 ("M09-076", "M01-506")],
                "pool_m01.json", "M01", "Netzplan & Puffer", "A5",
                "Modul 01, Abschnitt 1.1 – Netzplantechnik: Vorwärts- und Rückwärtsrechnung")
UMZUG += gruppe([("M09-051", "M01-510"), ("M09-053", "M01-511"), ("M09-054", "M01-512"),
                 ("M09-056", "M01-513"), ("M09-057", "M01-514"), ("M09-058", "M01-515")],
                "pool_m01.json", "M01", "Gantt & PSP", "A5",
                "Modul 01, Abschnitt 1.1 – Gantt-Diagramm")
UMZUG += gruppe([("M09-050", "M01-520")],
                "pool_m01.json", "M01", "SMART-Ziele", "A1",
                "Modul 01, Abschnitt 1.1 – SMART-Ziele")
UMZUG += gruppe([("M09-043", "M01-521")],
                "pool_m01.json", "M01", "Risiko & Stakeholder", "A1",
                "Modul 01, Abschnitt 1.2 – Priorisierung mit der Eisenhower-Matrix")
UMZUG += gruppe([("M09-114", "M07-402"), ("M09-115", "M07-403"), ("M09-116", "M07-404"),
                 ("M09-117", "M07-405"), ("M09-119", "M07-406"), ("M09-120", "M07-407"),
                 ("M09-154", "M07-408"), ("M09-156", "M07-409")],
                "pool_m07.json", "M07", "Aufbauorganisation & Vollmachten", "A5",
                "Modul 07, Abschnitt 7.4 – Handlungsvollmacht und Prokura")
UMZUG += gruppe([("M09-022", "M07-410"), ("M09-023", "M07-411"), ("M09-024", "M07-412"),
                 ("M09-027", "M07-413"), ("M09-028", "M07-414")],
                "pool_m07.json", "M07", "Aufbauorganisation & Vollmachten", "A5",
                "Modul 07, Abschnitt 7.4 – Leitungssysteme der Aufbauorganisation")
UMZUG += gruppe([("M09-016", "M07-415"), ("M09-017", "M07-416"), ("M09-019", "M07-417"),
                 ("M09-020", "M07-418")],
                "pool_m07.json", "M07", "Aufbauorganisation & Vollmachten", "A5",
                "Modul 07, Abschnitt 7.4 – Aufbau- und Ablauforganisation")
UMZUG += gruppe([("M09-002", "M03-311"), ("M09-003", "M03-312"), ("M09-004", "M03-313"),
                 ("M09-006", "M03-314"), ("M09-007", "M03-315"), ("M09-008", "M03-316"),
                 ("M09-009", "M03-317")],
                "pool_m03.json", "M03", "Wirtschaftlichkeit & TCO", "A2",
                "Modul 03, Abschnitt 3.4 – Wertschöpfung")
UMZUG += gruppe([("M09-122", "M02-203"), ("M09-129", "M02-204"), ("M09-152", "M02-205"),
                 ("M09-153", "M02-206")],
                "pool_m02.json", "M02", "Bedarfsanalyse & Marktforschung", "A1",
                "Modul 02, Abschnitt 2.2 – Zielgruppengerechte Bedarfsanalyse durchführen können")


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
                    m = re.search(r'"id"\s*:\s*"([^"]+)"', roh)
                    if not m: raise SystemExit(f"Block ohne id bei {start}")
                    spans[m.group(1)] = (start, i + 1)
        i += 1
    if tiefe: raise SystemExit("Klammern unausgeglichen")
    return spans


def feld_ersetze(block, feld, neu):
    muster = rf'("{re.escape(feld)!s}"\s*:\s*")((?:[^"\\]|\\.)*)(")'
    n = len(re.findall(muster, block))
    if n != 1:
        raise SystemExit(f"Feld {feld!s} kommt {n:d}-mal vor (erwartet 1)")
    return re.sub(muster, lambda m: m.group(1) + neu.replace("\\", "\\\\") + m.group(3), block, count=1)


with open(QUELLE, encoding="utf-8") as fh:
    src = fh.read()
spans = bloecke(src)
alle = [u[0] for u in UMZUG]
if len(set(alle)) != len(alle):
    raise SystemExit("ID doppelt in der Umzugsliste")
fehlt = [i for i in alle if i not in spans]
if fehlt:
    raise SystemExit("Nicht im Pool: " + ", ".join(sorted(fehlt)))
if len(alle) != len(spans):
    uebrig = sorted(set(spans) - set(alle))
    raise SystemExit("NICHT ALLE M09-Fragen erfasst, uebrig: " + ", ".join(uebrig))

# 1) je Zieldatei die umgeschriebenen Bloecke sammeln
proDatei = {}
for alt, neu_id, datei, modul, thema, gebiet, verweis in UMZUG:
    a, b = spans[alt]
    blk = src[a:b]
    blk = feld_ersetze(blk, "id", neu_id)
    blk = feld_ersetze(blk, "modul", modul)
    blk = feld_ersetze(blk, "thema", thema)
    blk = feld_ersetze(blk, "gebiet", gebiet)
    blk = feld_ersetze(blk, "verweis", verweis)
    proDatei.setdefault(datei, []).append((neu_id, blk))

# 2) Zieldateien schreiben (Einrueckung der Zieldatei uebernehmen)
for datei, eintraege in sorted(proDatei.items()):
    pfad = os.path.join(POOL, datei)
    with open(pfad, encoding="utf-8") as fh:
        dst = fh.read()
    einzug = "  " if re.search(r"^\[\s*\n  \{", dst) else " "
    bloecke_neu = []
    for _, blk in eintraege:
        if einzug == "  ":
            blk = "\n".join((" " + z) if z.strip() else z for z in blk.split("\n"))
        bloecke_neu.append(blk.lstrip())
    pos = dst.rstrip().rfind("]")
    kopf = dst[:pos].rstrip()
    if not kopf.endswith(","):
        kopf += ","
    neu_txt = kopf + "\n" + einzug + ("," + "\n" + einzug).join(bloecke_neu) + "\n]\n"
    daten = json.loads(neu_txt)                     # Syntaxprobe VOR dem Schreiben
    ids = [f["id"] for f in daten]
    if len(set(ids)) != len(ids):
        raise SystemExit("ID-Dublette in " + datei)
    with open(pfad, "w", encoding="utf-8") as fh:
        fh.write(neu_txt)
    print(f"{datei!s:<18} {len(daten):3d} Fragen (+{len(eintraege):d})")

# 3) M09-Datei leeren – die Kategorie bleibt, der Inhalt ist umgezogen
with open(QUELLE, "w", encoding="utf-8") as fh:
    fh.write("[\n]\n")
assert json.loads(Path(QUELLE).read_text(encoding="utf-8")) == []
print(f"pool_m09_unterricht.json ist jetzt leer ({len(UMZUG):d} Fragen umgezogen)")
