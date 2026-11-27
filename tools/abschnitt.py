#!/usr/bin/env python3
"""tools/abschnitt.py - nur EINEN Abschnitt einer Datei ausgeben (BUILD_LOG 26, Nachtrag 9b).

Spart das Lesen ganzer Steuerdateien, wenn nur ein Abschnitt gebraucht wird.
  python3 tools/abschnitt.py <datei> <marke> [--bis <marke2>] [--max N]
Beginnt an der ersten Zeile, die <marke> enthaelt; endet VOR der naechsten Ueberschrift
derselben oder hoeheren Ebene (Markdown '#', oder '**X.' fuer Unterabschnitte wie in
PLAN_NEUBAU), oder vor <marke2>. Kein Treffer -> rc=2 und die Liste der Ueberschriften.
⛔ regeln/*.md (frueher docs/archiv/LEHREN.md) sind davon AUSGENOMMEN: dort bleibt vollstaendiges Lesen Pflicht (START_PROMPT 6).
"""
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):   # Git Bash: cp1252; ohne reconfigure (umgeleitet) bleibt es, wie es ist
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
a = sys.argv[1:]
if len(a) < 2: print(__doc__); sys.exit(2)
datei, marke = a[0], a[1]
bis = a[a.index("--bis") + 1] if "--bis" in a else None
mx = int(a[a.index("--max") + 1]) if "--max" in a else 400
z = Path(datei).read_text(encoding="utf-8").split("\n")
kopf = lambda s: re.match(r"^(#{1,6}) ", s)
fett = lambda s: re.match(r"^\*\*[A-Z0-9]+\. ", s)
start = next((i for i, s in enumerate(z) if marke in s), None)
if start is None:
    print(f"KEIN TREFFER fuer {marke!r}. Ueberschriften:")
    for s in z:
        if kopf(s) or fett(s): print("  " + s[:100])
    sys.exit(2)
k = kopf(z[start]); ebene = len(k.group(1)) if k else None
ende = len(z)
for i in range(start + 1, len(z)):
    s = z[i]
    if bis and bis in s: ende = i; break
    kk = kopf(s)
    if kk and (ebene is None or len(kk.group(1)) <= ebene): ende = i; break
    if ebene is None and fett(z[start]) and fett(s): ende = i; break
aus = z[start:min(ende, start + mx)]
print("\n".join(aus))
if ende - start > mx: print(f"... ({ende - start - mx} Zeilen gekappt, --max erhoehen)")
