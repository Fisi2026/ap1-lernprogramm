#!/usr/bin/env python3
"""tools/rotiere.py – eine Steuerdatei rotieren: Bloecke verbatim ins Archiv, Ersatz in den Kopf.

WARUM ES DAS GIBT (07.09.2026): Dasselbe Verfahren wurde DREIMAL von Hand nachgebaut –
START_PROMPT am 03.09. (65 Bereiche), BUILD_LOG am 04.09., BUILD_LOG am 07.09.
TASKLIST-Sparregel 6: beim zweiten Mal gehoert eine Messung ins Werkzeug.
⚠️ DER TEURE FEHLER, DEN ES VERHINDERT: eine Steuerdatei NEU TIPPEN statt blockweise zu
   verschieben – dabei gehen Regeln still verloren. Deshalb werden die Originalbloecke
   VERBATIM angehaengt und jede nicht leere Zeile der Ur-Fassung gegengeprueft.

SPEZIFIKATION (JSON)
  {"quelle": "START_PROMPT.md",
   "archiv": "START_PROMPT_ARCHIV.md",
   "ueberschrift": "## ROTATION 2026-09-07 - was ausgelagert wurde",
   "bloecke": [{"von": 30, "bis": 42, "ersatz": "# kurzer Regelsatz\n"}, ...]}
  Zeilennummern 1-basiert und INKLUSIVE, aufsteigend, ueberschneidungsfrei.
  "ersatz" darf "" sein (Block faellt ersatzlos weg).

BENUTZUNG
  python3 tools/rotiere.py spec.json            # Trockenlauf: Zahlen + Gegenprobe, schreibt NICHTS
  python3 tools/rotiere.py spec.json --setze    # schreibt, aber nur wenn die Gegenprobe 0 meldet

⛔ ES SCHREIBT NIE BEI VERLUST. Meldet die Gegenprobe auch nur eine Zeile, die weder im neuen
   Kopf noch im Archiv steht, bricht der Lauf ab.
"""
import json
import os
import shutil
import sys
import tempfile
import time

for _s in (sys.stdout, sys.stderr):  # cp1252-Konsole unter Windows (BUILD_LOG 134)
    if hasattr(_s, "reconfigure"): _s.reconfigure(encoding="utf-8")

# B156 (10.09.2026): HIER STAND EIN FESTES /tmp. Unter Windows-Python gibt es das nicht -
#    shutil.copy scheiterte mit FileNotFoundError, und zwar NACH der bestandenen Gegenprobe
#    und VOR dem Schreiben. Verloren ging nichts, aber die Rotation war auf dem Rechner des
#    Nutzers schlicht nicht ausfuehrbar. Aufgefallen erst, als das Werkzeug zum ersten Mal
#    DORT lief - die drei Laeufe am selben Vormittag liefen in der Sandbox.
#    -> Ein Werkzeug ist auf der Umgebung geprueft, auf der es lief, nicht auf der, fuer die
#       es gedacht war.
SICHERUNG = tempfile.gettempdir()


def pruefe(ur, neu, archiv_neu):
    """Jede nicht leere Zeile der Ur-Fassung muss im neuen Kopf ODER im Archiv stehen.
       ⚠️ Erwartung ist NULL – die Bloecke gehen verbatim ins Archiv, es darf nichts fehlen."""
    vorhanden = set(neu) | set(archiv_neu)
    return [z for z in ur if z.strip() and z not in vorhanden]


def main():
    if len(sys.argv) < 2:
        print(__doc__); return 2
    with open(sys.argv[1], encoding="utf-8") as fh:
        spec = json.load(fh)
    setze = "--setze" in sys.argv
    quelle, archiv = spec["quelle"], spec["archiv"]

    with open(quelle, encoding="utf-8") as f:
        ur = f.read().split("\n")
    with open(archiv, encoding="utf-8") as f:
        arch_alt = f.read()

    bl = spec["bloecke"]
    letzte = 0
    for b in bl:
        if not (1 <= b["von"] <= b["bis"] <= len(ur)):
            raise SystemExit(f"Block {b!s} liegt ausserhalb der Datei (1..{len(ur):d})")
        if b["von"] <= letzte:
            raise SystemExit(f"Bloecke muessen aufsteigend und ueberschneidungsfrei sein: {b!s}")
        letzte = b["bis"]

    teile, arch_teile, cursor = [], [spec["ueberschrift"], ""], 0
    for b in bl:
        teile += ur[cursor:b["von"] - 1]
        if b.get("ersatz", ""):
            teile += b["ersatz"].rstrip("\n").split("\n")
        arch_teile.append("### aus {}, Zeilen {:d}-{:d} der Ur-Fassung".format(quelle, b["von"], b["bis"]))
        arch_teile.append("")
        arch_teile += ur[b["von"] - 1:b["bis"]]
        arch_teile.append("")
        cursor = b["bis"]
    teile += ur[cursor:]

    verlust = pruefe(ur, teile, arch_teile)
    gespart = len(ur) - len(teile)
    print(f"Quelle   {quelle!s:<28} {len(ur):d} -> {len(teile):d} Zeilen  ({-gespart:+d})")
    print("Bloecke  {} verschoben, {} Zeilen verbatim ins Archiv".format(len(bl), sum(b["bis"] - b["von"] + 1 for b in bl)))
    print(f"GEGENPROBE: {len(verlust):d} Zeile(n) weder im neuen Kopf noch im Archiv")
    for z in verlust[:20]:
        print(f"   VERLUST > {z[:96]}")
    if verlust:
        print("\n⛔ ABBRUCH – es wird nichts geschrieben.")
        return 1
    if not setze:
        print("\nTROCKENLAUF – nichts geschrieben. Mit --setze ausfuehren.")
        return 0

    stamp = time.strftime("%Y%m%d_%H%M%S")
    for p in (quelle, archiv):
        shutil.copy(p, os.path.join(SICHERUNG, f"rotiere_{stamp}_{os.path.basename(p)}"))
    # 17.09.2026: ohne newline schrieb Windows-Python CRLF (BUILD_LOG + Archiv, 14 535 Zeilen).
    with open(archiv, "w", encoding="utf-8", newline="\n") as f:
        f.write(arch_alt.rstrip("\n") + "\n\n" + "\n".join(arch_teile).strip("\n") + "\n")
    with open(quelle, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(teile))
    print("\nGESCHRIEBEN. Sicherung: {!s}".format(os.path.join(SICHERUNG, "rotiere_" + stamp + "_*")))
    return 0


if __name__ == "__main__":
    sys.exit(main())
