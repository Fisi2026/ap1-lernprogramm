#!/usr/bin/env python3
"""tools/stand_ids.py – haelt die Prosa-Liste der Bestands-IDs und laengen_ausnahmen.json buendig.

══════════ WARUM ES DIESES SKRIPT GIBT (27.08.2026) ══════════
START_PROMPT.md nannte "ZWOELF IDs BLEIBEN ABSICHTLICH STEHEN ... STEHEN LASSEN, NICHT MELDEN"
und listete zwoelf. `laengen_ausnahmen.json` fuehrte eirf – davon VIER, die in der Prosa gar
nicht vorkamen (M02-017, M03-018, M04-308, M06-008). Vereinigung: sechzehn.
►► Genau der Fall, vor dem Abschnitt 7 derselben Datei warnt: **zwei Listen fuer dieselbe Sache
   driften immer.** Die JSON ist die Quelle fuer den Waechter, die Prosa sagt dem Menschen, was
   er nicht melden soll. Auseinandergehen duerfen sie – nur nicht unbemerkt.

Ausgabe (eine Zeile, fuer check.sh):
  OK <n>                        alles buendig, <n> IDs in der Prosa
  FEHLT <id> <id> ...           die JSON fuehrt IDs, die die Prosa nicht nennt
  ZAHL <angekuendigt> <gezaehlt> die angekuendigte Zahl passt nicht zur Liste
  KEINBLOCK                     der Block steht nicht (mehr) in regeln/pool.md
Rueckgabewert ist immer 0 – die Bewertung macht check.sh.
"""
import json
import re
import sys
from pathlib import Path

try:
    ids = set(json.loads(Path("laengen_ausnahmen.json").read_text(encoding="utf-8"))["ausnahmen"])
except Exception:                      # noqa: BLE001
    print("KEINBLOCK")
    sys.exit(0)

# N49 W1 (11.10.2026): der Block steht seit der Aufteilung in regeln/pool.md (verbatim verschoben).
with open("regeln/pool.md", encoding="utf-8") as fh:
    txt = fh.read()
# ⚠️ Der Block wird ueber SEINEN ANFANG gefunden und dann ein festes Fenster gelesen – nicht
#    ueber ein Endemuster. Ein nicht-gieriges "bis zum naechsten **" endete am ersten Fettdruck
#    INNERHALB des Blocks und fand null IDs; der erste Lauf meldete deshalb alle elf als fehlend.
m = re.search(r"\*\*(\d+) IDs BLEIBEN ABSICHTLICH STEHEN", txt)
if not m:
    print("KEINBLOCK")
    sys.exit(0)

fenster = txt[m.start(): m.start() + 1200]
genannt = set(re.findall(r"M0\d-\d{3}", fenster))
fehlt = sorted(ids - genannt)
zahl = int(m.group(1))
if fehlt:
    print("FEHLT " + " ".join(fehlt))
elif zahl != len(genannt):
    print(f"ZAHL {zahl} {len(genannt)}")
else:
    print(f"OK {len(genannt)}")
