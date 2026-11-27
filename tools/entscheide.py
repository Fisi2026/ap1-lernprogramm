#!/usr/bin/env python3
"""tools/entscheide.py – N49 W3 (11.10.2026): jede Entscheidungs-Nummer GENAU EINMAL.
Jeder Entscheid ist eine Datei entscheide/E072-<titel>.md (E001–E071 seit 27.11.2026 aus der Tabelle in
docs/plaene/PLAN_NEUBAU.md verschoben, BUILD_LOG 305) mit Status-Zeile und den Abschnitten Kontext, Entscheid, Folgen (ADR-Muster, unveraenderlich – ein Entscheid,
der einen alten ersetzt, bekommt eine NEUE Nummer und nennt „ersetzt E0xx“).
Ausgabe (eine Zeile, liest check.sh 4g2):
  OK <anzahl> <hoechste>
  FEHLER <grund> …      doppelt, Luecke, Datei ohne Pflichtabschnitt, Dateiname ohne Muster,
                        Datei fehlt im Index von entscheide/README.md, Index nennt fehlende Datei (seit BUILD_LOG 311)
  STUMM                 entscheide/ fehlt oder keine Nummer gefunden
Gegenprobe: python3 tools/entscheide.py --probe  (Temp-Ordner: echter Stand OK, fuenf Kaputt-Faelle je mit IHREM Grund)."""
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
    readme = os.path.join(ordner, "README.md")
    index = set(re.findall(r"`(E\d{3}-[a-z0-9-]+\.md)`", Path(readme).read_text(encoding="utf-8"))) if os.path.isfile(readme) else set()
    dateien = {d for d in os.listdir(ordner) if re.match(r"^E\d{3}-[a-z0-9-]+\.md$", d)}
    if dateien - index: fehler.append("nicht im Index " + ",".join(sorted(d[:4] for d in dateien - index)[:5]))
    if index - dateien: fehler.append("Index ohne Datei " + ",".join(sorted(index - dateien)[:5]))
    doppelt = sorted({n for n in nummern if nummern.count(n) > 1})
    if doppelt: fehler.append("doppelt " + ",".join(f"E{n}" for n in doppelt))
    luecke = [n for n in range(1, max(nummern) + 1) if n not in nummern]
    if luecke: fehler.append("Luecke " + ",".join(f"E{n}" for n in luecke[:5]))
    return ("FEHLER " + "; ".join(fehler)) if fehler else f"OK {len(nummern)} {max(nummern)}"

def probe():
    w = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    erg = []
    gut = "**Status:** angenommen" + chr(10) + chr(10).join(PFLICHT) + chr(10)
    # (fall, erwarteter Anfang bzw. Grund) - jeder Kaputt-Fall muss SEINEN Grund nennen, nicht irgendein FEHLER
    for fall, soll in (("echt", "OK "), ("doppelt", "doppelt"), ("luecke", "Luecke"), ("abschnitt", "ohne"),
                       ("index fehlt", "nicht im Index"), ("index tot", "Index ohne Datei")):
        t = tempfile.mkdtemp()
        try:
            shutil.copytree(os.path.join(w, "entscheide"), os.path.join(t, "entscheide"))
            ziel = os.path.join(t, "entscheide")
            hoch = max(int(d[1:4]) for d in os.listdir(ziel) if re.match(r"^E\d{3}-", d))
            neu = {"doppelt": (f"E{hoch:03d}-doppelt.md", gut), "luecke": (f"E{hoch + 2:03d}-luecke.md", gut),
                   "abschnitt": (f"E{hoch + 1:03d}-ohne.md", "**Status:** angenommen" + chr(10)),
                   "index fehlt": (f"E{hoch + 1:03d}-ohne-index.md", gut)}.get(fall)
            index_zeile = ""
            if neu:
                Path(ziel, neu[0]).write_text(neu[1], encoding="utf-8")
                if fall != "index fehlt": index_zeile = f"| x | x | `{neu[0]}` |" + chr(10)
            if fall == "index tot": index_zeile = f"| x | x | `E{hoch + 1:03d}-gibt-es-nicht.md` |" + chr(10)
            if index_zeile:
                with open(os.path.join(ziel, "README.md"), "a", encoding="utf-8") as f: f.write(index_zeile)
            r = pruefe(t)
            treffer = r.startswith(soll) if fall == "echt" else (r.startswith("FEHLER") and soll in r)
            erg.append((fall, treffer, r))
        finally:
            shutil.rmtree(t, ignore_errors=True)
    for f, ok, r in erg: print(("ok    " if ok else "FALSCH") + " " + f + ": " + r)
    return 0 if all(ok for _, ok, _ in erg) else 1

if __name__ == "__main__":
    if "--probe" in sys.argv: sys.exit(probe())
    print(pruefe(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
