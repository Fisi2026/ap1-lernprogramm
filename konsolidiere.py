#!/usr/bin/env python3
"""S1: pool/pool_m*.json (70 Dateien) -> pool_m01..pool_m08.json (8 Dateien), gruppiert nach modul, sortiert nach id."""
import json, glob, io, sys, collections

SRC_GLOB = "pool/pool_m*.json"
ZIEL_DATEIEN = {f"M{n:02d}": f"pool/pool_m{n:02d}.json" for n in range(1, 9)}

alle = []
quelldateien = sorted(glob.glob(SRC_GLOB))
for pfad in quelldateien:
    with io.open(pfad, encoding="utf-8") as f:
        daten = json.load(f)
    if not isinstance(daten, list):
        sys.exit(f"{pfad}: kein JSON-Array")
    alle.extend(daten)

print(f"Quelle: {len(quelldateien)} Dateien, {len(alle)} Fragen gesamt")

# Vorher-Snapshot: id -> kompletter Inhalt (als kanonischer JSON-String) fuer Mengen-Diff
vorher = {f["id"]: json.dumps(f, sort_keys=True, ensure_ascii=False) for f in alle}
ids = [f["id"] for f in alle]
dupl = {i for i in ids if ids.count(i) > 1}
if dupl:
    sys.exit(f"Doppelte IDs in Quelle: {dupl}")

# Gruppieren nach modul
gruppen = collections.defaultdict(list)
unbekannt = []
for f in alle:
    m = f.get("modul")
    if m not in ZIEL_DATEIEN:
        unbekannt.append(f["id"])
        continue
    gruppen[m].append(f)

if unbekannt:
    sys.exit(f"Unbekanntes modul-Feld bei IDs: {unbekannt}")

# Innerhalb jeder Gruppe nach id sortieren, in Zieldateien schreiben
for modul, zielpfad in ZIEL_DATEIEN.items():
    liste = sorted(gruppen.get(modul, []), key=lambda f: f["id"])
    with io.open(zielpfad, "w", encoding="utf-8") as f:
        json.dump(liste, f, ensure_ascii=False, indent=1)
    print(f"{zielpfad}: {len(liste)} Fragen geschrieben")

# Nachher-Snapshot einlesen und vergleichen
nachher_alle = []
for zielpfad in ZIEL_DATEIEN.values():
    with io.open(zielpfad, encoding="utf-8") as f:
        nachher_alle.extend(json.load(f))
nachher = {f["id"]: json.dumps(f, sort_keys=True, ensure_ascii=False) for f in nachher_alle}

fehlend = set(vorher) - set(nachher)
neu = set(nachher) - set(vorher)
veraendert = {i for i in (set(vorher) & set(nachher)) if vorher[i] != nachher[i]}

print(f"\nDIFF: fehlend={len(fehlend)} neu={len(neu)} inhaltlich veraendert={len(veraendert)}")
if fehlend or neu or veraendert:
    print("fehlend:", fehlend)
    print("neu:", neu)
    print("veraendert:", veraendert)
    sys.exit("DIFF NICHT LEER -- ABBRUCH")
else:
    print("DIFF LEER -- Menge identisch. Quelldateien fuer Bereinigung:")
    for p in quelldateien:
        if p not in ZIEL_DATEIEN.values():
            print(" ", p)
