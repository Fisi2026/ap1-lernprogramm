#!/usr/bin/env python3
"""tools/plugin/packen.py - baut das Plugin "fisi" als .plugin-Datei (N36, E59).
Aufruf im Projektordner:  python3 tools/plugin/packen.py
Ziel: _to_delete/helfer/fisi-<version>.plugin (nicht im Repo; die Quelle ist tools/plugin/fisi/).
⛔ Laut, nicht still: fehlt plugin.json, ein SKILL.md oder dessen name-Zeile, bricht es ab.
"""
import hashlib
import json
import os
import sys
import zipfile
from pathlib import Path

WURZEL = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
QUELLE = os.path.join(WURZEL, "tools", "plugin", "fisi")
with open(os.path.join(QUELLE, ".claude-plugin", "plugin.json"), encoding="utf-8") as fh:
    man = json.load(fh)
assert man.get("name") == "fisi" and man.get("version"), "plugin.json unvollstaendig"
skills = sorted(os.listdir(os.path.join(QUELLE, "skills")))
for s in skills:
    with open(os.path.join(QUELLE, "skills", s, "SKILL.md"), encoding="utf-8") as fh:
        t = fh.read()
    if not t.startswith("---") or (f'name: "{s}"') not in t.split("---")[1]:
        sys.exit(f"ABBRUCH: skills/{s}/SKILL.md ohne passende name-Zeile")
ziel = os.path.join(WURZEL, "_to_delete", "helfer", "fisi-{!s}.plugin".format(man["version"]))
os.makedirs(os.path.dirname(ziel), exist_ok=True)
with zipfile.ZipFile(ziel, "w", zipfile.ZIP_DEFLATED) as z:
    for w, _, fs in os.walk(QUELLE):
        for f in sorted(fs):
            p = os.path.join(w, f)
            z.write(p, os.path.relpath(p, QUELLE).replace(os.sep, "/"))
h = hashlib.sha1(Path(ziel).read_bytes(), usedforsecurity=False).hexdigest()
print("fisi {!s}: {:d} Skills ({!s}) -> {!s}  sha1 {!s}".format(man["version"], len(skills), ", ".join(skills), os.path.relpath(ziel, WURZEL), h[:12]))
