"""Waehlt die Semgrep-Regeldateien fuer tools/semgrep/scan.sh aus (Komplettpruefung 09.10.2026, ND4).
AUSFUEHREN: python3 tools/semgrep/auswahl.py <checkout von semgrep-rules>  > tools/semgrep/regeln.txt
Danach REGELN_SHA in scan.sh auf den Commit des Checkouts setzen.
Kriterium: category security, NICHT subcategory audit (Hinweis-Regeln, viel Rauschen), confidence MEDIUM/HIGH,
nur die Sprachen des Projekts. Am 09.10.2026: 76 Dateien, 4 Funde (alle localhost-fetch in tools/sichtpruefung)."""
import glob
import os
import sys

import yaml

BASEN = ["javascript", "typescript", "generic/secrets", "yaml/github-actions", "html", "json"]


def passt(regel):
    m = regel.get("metadata") or {}
    sub = m.get("subcategory") or []
    return m.get("category") == "security" and "audit" not in sub and m.get("confidence") in ("MEDIUM", "HIGH")


def main(wurzel):
    treffer = []
    for basis in BASEN:
        for pfad in glob.glob(os.path.join(wurzel, basis, "**", "*.yaml"), recursive=True):
            if pfad.endswith(".test.yaml"):
                continue
            try:
                with open(pfad, encoding="utf-8") as f:
                    daten = yaml.safe_load(f)
            except (yaml.YAMLError, UnicodeDecodeError):
                continue
            if isinstance(daten, dict) and any(passt(r) for r in daten.get("rules", [])):
                treffer.append(os.path.relpath(pfad, wurzel).replace(os.sep, "/"))
    if len(treffer) < 50:
        sys.exit(f"nur {len(treffer)} Regeldateien - falscher Checkout?")
    print("\n".join(sorted(treffer)))


if __name__ == "__main__":
    main(sys.argv[1])
