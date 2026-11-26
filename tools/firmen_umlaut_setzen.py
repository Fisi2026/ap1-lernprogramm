#!/usr/bin/env python3
"""tools/firmen_umlaut_setzen.py - Firmen-Eigennamen von ASCII-Umschrift auf Umlaute.

Nutzer-Entscheid 27.07.2026: "Umlaute werden auch in Firmen-Eigennamen korrigiert."
Gemessen mit `node tools/pool_query.js firmen`, freigegeben am 25.08.2026 (alle 37).

    python3 tools/firmen_umlaut_setzen.py --trocken [--auftrag <datei>]
    python3 tools/firmen_umlaut_setzen.py --setze

⚠️⚠️ NIE json.load/json.dump AUF EINE POOL-DATEI. Das formatiert sie um - am 27.07. wurden so
   37.000 Diff-Zeilen fuer 18 Wortkorrekturen erzeugt. Gearbeitet wird auf dem ROHTEXT.
Das Rezept aus START_PROMPT, hier eingebaut:
   1. Sicherung ZUERST (pool/ in den Temp-Ordner kopieren).
   2. Je Muster die Fundstellen ZAEHLEN und die Summe gegen die Messung halten - kein
      stilles "0 ersetzt".
   3. json.loads als SYNTAXPROBE, BEVOR geschrieben wird.
   4. Gegenprobe: nach dem Lauf darf `pool_query.js firmen` nichts mehr melden.
"""
import json
import os
import shutil
import sys
import tempfile
import time

for _s in (sys.stdout, sys.stderr):  # cp1252-Konsole unter Windows (BUILD_LOG 134)
    if hasattr(_s, "reconfigure"): _s.reconfigure(encoding="utf-8")

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POOL = os.path.join(WURZEL, "pool")
AUFTRAG_STD = os.path.join(WURZEL, "tools", "migration", "firmen_umlaute_2026-08-25.json")

def auftragsdatei():
    """--auftrag <datei> waehlt eine andere Auftragsliste.
    ⚠️ EIN NACHTRAG BEKOMMT EINE EIGENE DATEI, er wird NICHT an die alte angehaengt: nach dem
       ersten Lauf haben deren 37 Muster keine Fundstelle mehr, und die Zusicherung
       "Abbruch bei Muster ohne Fundstelle" wuerde jeden weiteren Lauf blockieren.
       Genau das ist am 25.08. passiert - der Schutz hat funktioniert."""
    if "--auftrag" in sys.argv:
        return sys.argv[sys.argv.index("--auftrag") + 1]
    return AUFTRAG_STD

def norm(s):
    s = s.lower()
    for a, b in [("ä","a"),("ae","a"),("ö","o"),("oe","o"),("ü","u"),("ue","u"),("ß","s"),("ss","s")]:
        s = s.replace(a, b)
    return s

def lade_auftrag():
    with open(auftragsdatei(), encoding="utf-8") as fh:
        paare = json.load(fh)["ersetzungen"]
    # Zusicherung: Alt und Neu duerfen sich NUR in der Umlaut-/ss-Schreibung unterscheiden.
    # Ohne sie koennte ein Tippfehler in der Auftragsdatei still einen Firmennamen umbenennen.
    for alt, neu in paare:
        if alt == neu or norm(alt) != norm(neu):
            sys.exit(f"ABBRUCH: {alt!r} -> {neu!r} ist mehr als eine Umlautkorrektur.")
    if len({a for a, _ in paare}) != len(paare):
        sys.exit("ABBRUCH: doppeltes Suchmuster in der Auftragsdatei.")
    return paare

def main():
    trocken = "--trocken" in sys.argv
    if not trocken and "--setze" not in sys.argv:
        sys.exit("Aufruf: --trocken oder --setze")
    paare = lade_auftrag()

    dateien = sorted(f for f in os.listdir(POOL) if f.endswith(".json"))
    roh = {}
    for d in dateien:
        with open(os.path.join(POOL, d), encoding="utf-8") as fh:
            roh[d] = fh.read()

    gesamt, je_muster, geaendert = 0, [], {}
    for alt, neu in paare:
        n = 0
        for d in dateien:
            k = roh[d].count(alt)
            if not k:
                continue
            n += k
            roh[d] = roh[d].replace(alt, neu)
            geaendert[d] = True
        je_muster.append((alt, neu, n))
        gesamt += n

    ohne = [a for a, _, n in je_muster if n == 0]
    for alt, neu, n in je_muster:
        print(f"{n:3}x  {alt:<36} -> {neu}")
    print(f"Fundstellen gesamt: {gesamt} in {len(geaendert)} Dateien")
    if ohne:
        # Ein Muster ohne Treffer heisst: die Messung und die Auftragsdatei sind auseinander.
        sys.exit("ABBRUCH: {:d} Muster ohne Fundstelle: {!s}".format(len(ohne), ", ".join(ohne)))

    # SYNTAXPROBE VOR DEM SCHREIBEN - nur pruefen, nicht zurueckschreiben.
    for d in geaendert:
        try:
            json.loads(roh[d])
        except ValueError as e:
            sys.exit(f"ABBRUCH: {d} waere kein gueltiges JSON mehr ({e})")
    print(f"Syntaxprobe: alle {len(geaendert):d} geaenderten Dateien bleiben gueltiges JSON.")

    if trocken:
        print("TROCKENLAUF - nichts geschrieben.")
        return
    sicherung = os.path.join(tempfile.gettempdir(), "pool_backup_firmen_{!s}".format(time.strftime("%H%M%S")))
    shutil.copytree(POOL, sicherung)
    print("Sicherung: " + sicherung)
    for d in geaendert:
        with open(os.path.join(POOL, d), "w", encoding="utf-8") as fh:
            fh.write(roh[d])
    print("Geschrieben: " + ", ".join(sorted(geaendert)))
    print("► Jetzt: node tools/pool_query.js firmen")

if __name__ == "__main__":
    main()
