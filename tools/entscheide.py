#!/usr/bin/env python3
"""tools/entscheide.py – N49 W3 (11.10.2026): jede Entscheidungs-Nummer GENAU EINMAL.
Jeder Entscheid ist eine Datei entscheide/E072-<titel>.md (E001–E071 seit 27.11.2026 aus der Tabelle in
PLAN_NEUBAU.md verschoben, BUILD_LOG 305) mit Status-Zeile und den Abschnitten Kontext, Entscheid, Folgen (ADR-Muster, unveraenderlich – ein Entscheid,
der einen alten ersetzt, bekommt eine NEUE Nummer und nennt „ersetzt E0xx“).
Ausgabe (eine Zeile, liest check.sh 4g2):
  OK <anzahl> <hoechste>
  FEHLER <grund> …      doppelt, Luecke, Datei ohne Pflichtabschnitt, Dateiname ohne Muster
  STUMM                 entscheide/ fehlt oder keine Nummer gefunden
Gegenprobe: python3 tools/entscheide.py --probe  (baut drei Kaputt-Faelle in einem Temp-Ordner, erwartet je FEHLER)."""
import os
import re
import shutil
import sys
import tempfile
from pathlib import Path

for _s in (sys.stdout, sys.stderr):
    if hasattr(_s, "reconfigure"): _s.reconfigure(encoding="utf-8")
PFLICHT = ("## Kontext", "## Entscheid", "## Folgen")

def pruefe(wurzel):
    nummern = []
    ordner = os.path.join(wurzel, "entscheide")
    if not os.path.isdir(ordner): return "STUMM"
    fehler = []
    for d in sorted(os.listdir(ordner)) if os.path.isdir(ordner) else []:
        if d == "README.md" or not d.endswith(".md"): continue
        m = re.match(r"^E(\d{3})-[a-z0-9-]+\.md$", d)
        if not m: fehler.append("Dateiname " + d); continue
        nummern.append(int(m.group(1)))
        t = Path(ordner, d).read_text(encoding="utf-8")
        fehlt = [p for p in PFLICHT if p not in t]
        if "**Status:**" not in t: fehlt.append("Status")
        if fehlt: fehler.append(d + " ohne " + "/".join(fehlt))
    if not nummern: return "STUMM"
    doppelt = sorted({n for n in nummern if nummern.count(n) > 1})
    if doppelt: fehler.append("doppelt " + ",".join(f"E{n}" for n in doppelt))
    luecke = [n for n in range(1, max(nummern) + 1) if n not in nummern]
    if luecke: fehler.append("Luecke " + ",".join(f"E{n}" for n in luecke[:5]))
    return ("FEHLER " + "; ".join(fehler)) if fehler else f"OK {len(nummern)} {max(nummern)}"

def probe():
    w = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    erg = []
    for fall in ("doppelt", "luecke", "abschnitt"):
        t = tempfile.mkdtemp()
        try:
            shutil.copytree(os.path.join(w, "entscheide"), os.path.join(t, "entscheide"))
            hoch = max(int(d[1:4]) for d in os.listdir(os.path.join(t, "entscheide")) if re.match(r"^E\d{3}-", d))
            ziel = os.path.join(t, "entscheide")
            gut = "**Status:** angenommen" + chr(10) + chr(10).join(PFLICHT) + chr(10)
            if fall == "doppelt": Path(ziel, f"E{hoch:03d}-doppelt.md").write_text(gut, encoding="utf-8")
            if fall == "luecke": Path(ziel, f"E{hoch + 2:03d}-luecke.md").write_text(gut, encoding="utf-8")
            if fall == "abschnitt": Path(ziel, f"E{hoch + 1:03d}-ohne.md").write_text("**Status:** angenommen" + chr(10), encoding="utf-8")
            r = pruefe(t)
            erg.append((fall, r.startswith("FEHLER"), r))
        finally:
            shutil.rmtree(t, ignore_errors=True)
    for f, ok, r in erg: print(("ok    " if ok else "FALSCH") + " " + f + ": " + r)
    return 0 if all(ok for _, ok, _ in erg) else 1

if __name__ == "__main__":
    if "--probe" in sys.argv: sys.exit(probe())
    print(pruefe(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
