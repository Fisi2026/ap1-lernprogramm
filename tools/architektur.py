#!/usr/bin/env python3
"""tools/architektur.py - Schichtregeln der App mit dependency-cruiser (N43 M2, E67, BUILD_LOG 170).

Regeln: tools/architektur_regeln.cjs (keine Zyklen · kern/ ohne Oberflaeche/Pool-Laden/React zur Laufzeit ·
server/ zieht aus der App nur kern/pruefe.ts und kern/route.ts).
dependency-cruiser und typescript@6 liegen in .tooling/ (die App nutzt TypeScript 7, das dependency-cruiser
18.6 noch nicht liest - gemessen 14.10.).

Aufruf:  python3 tools/architektur.py           rc 0 keine Verstoesse · 1 Verstoesse · 2 stumm
         python3 tools/architektur.py --probe   bekannte Antworten an tools/architektur_probe/ (rc 0 nur bei exakt gleich)
STUMM (rc 2): Werkzeug fehlt, kein JSON, oder weniger als MIN_MODULE Module - ein Lauf, der nichts sieht,
ist kein gruener Lauf.
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent
NEU = WURZEL / "neu"
PROBE = WURZEL / "tools" / "architektur_probe"
DEPCRUISE = WURZEL / ".tooling" / "node_modules" / "dependency-cruiser" / "bin" / "dependency-cruiser.mjs"
KONFIG = WURZEL / "tools" / "architektur_regeln.cjs"
MIN_MODULE = 200  # gemessen 14.10.: 284 Module in neu/src

# Jede Probedatei bricht genau eine Regel; erlaubt.ts (import type), x.test.ts und server -> pruefe/route
# duerfen NICHT auftauchen.
PROBE_SOLL = {
    ("server-nur-pruefe-und-route", "src/server/worker.ts", "src/kern/glossar.ts"),
    ("kern-ohne-oberflaeche", "src/kern/seiteneffekt.ts", "src/schirme/seite.ts"),
    ("kern-ohne-oberflaeche", "src/kern/react_laufzeit.ts", "react"),
    ("kern-ohne-oberflaeche", "src/kern/pool_direkt.ts", "@pool/pool_m01.json"),
    ("kern-ohne-oberflaeche", "src/kern/dynamisch.ts", "src/lib/hilfe.ts"),
    ("keine-zyklen", "src/kern/z1.ts", "src/kern/z2.ts"),
}


class Stumm(Exception):
    """Das Werkzeug hat nichts geprueft."""


def lauf(cwd: Path) -> tuple[set[tuple[str, str, str]], int]:
    if not DEPCRUISE.exists():
        raise Stumm("dependency-cruiser fehlt in .tooling/ (cd .tooling && npm ci)")
    r = subprocess.run(
        ["node", str(DEPCRUISE), "src", "--config", str(KONFIG), "--output-type", "json"],
        cwd=cwd, capture_output=True, text=True, check=False,
    )
    try:
        d = json.loads(r.stdout)
    except json.JSONDecodeError as e:
        raise Stumm(f"kein JSON (rc {r.returncode}): {(r.stderr or r.stdout)[:200]}") from e
    if "TypeScript" in r.stderr and "missed" in r.stderr:
        raise Stumm("dependency-cruiser findet kein passendes typescript (.tooling braucht typescript@6)")
    verstoesse = {(v["rule"]["name"], v["from"], v["to"]) for v in d["summary"]["violations"]}
    return verstoesse, len(d["modules"])


def probe() -> int:
    ist, _ = lauf(PROBE)
    fehlt, zuviel = PROBE_SOLL - ist, ist - PROBE_SOLL
    for name, von, nach in sorted(PROBE_SOLL):
        print(f"{'ok  ' if (name, von, nach) in ist else 'FEHL'} {name}: {von} -> {nach}")
    for v in sorted(zuviel):
        print(f"ZUVIEL {v[0]}: {v[1]} -> {v[2]}")
    gut = not fehlt and not zuviel
    print(f"[architektur --probe] {len(PROBE_SOLL) - len(fehlt)}/{len(PROBE_SOLL)} erwartet, {len(zuviel)} zu viel")
    return 0 if gut else 1


def main() -> int:
    try:
        if "--probe" in sys.argv:
            return probe()
        verstoesse, module = lauf(NEU)
    except Stumm as e:
        print(f"STUMM: {e}")
        return 2
    if module < MIN_MODULE:
        print(f"STUMM: nur {module} Module gesehen (erwartet >= {MIN_MODULE})")
        return 2
    for name, von, nach in sorted(verstoesse):
        print(f"VERSTOSS {name}: {von} -> {nach}")
    print(f"ARCH: {len(verstoesse)} Verstoesse in {module} Modulen")
    return 1 if verstoesse else 0


if __name__ == "__main__":
    sys.exit(main())
