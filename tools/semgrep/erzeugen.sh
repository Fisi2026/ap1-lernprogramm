#!/usr/bin/env bash
# Erzeugt tools/semgrep/requirements.txt (mit Hashes) aus requirements.in + overrides.txt - fuer Linux x86_64,
# weil die CI (Job `semgrep`) dort installiert. Laeuft auf Windows (Git Bash) wie unter Linux.
# AUSFUEHREN: bash tools/semgrep/erzeugen.sh [uv-Optionen]
#   Semgrep heben: Version in requirements.in setzen, dann  bash tools/semgrep/erzeugen.sh --upgrade-package semgrep
#   Alles neu aufloesen (auch transitive Pakete):           bash tools/semgrep/erzeugen.sh --upgrade
# Ohne --upgrade* haelt uv die Versionen der vorhandenen requirements.txt fest (kleinster Unterschied).
# uv kommt gepinnt in ein Wegwerf-venv; die CI braucht uv nicht (pip --require-hashes --no-deps).
# Gemessen 25.11.2026: Ergebnis gleich fuer --python-version 3.12, 3.13, 3.14.
set -euo pipefail
cd "$(dirname "$0")"
UV_VERSION=0.13.10
PY=$(command -v python3 || command -v python)
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
"$PY" -m venv "$TMP/venv"
if [ -x "$TMP/venv/bin/python" ]; then VPY="$TMP/venv/bin/python"; else VPY="$TMP/venv/Scripts/python.exe"; fi
"$VPY" -m pip install --quiet --disable-pip-version-check "uv==$UV_VERSION"
"$VPY" -m uv pip compile requirements.in \
  --override overrides.txt \
  --generate-hashes \
  --python-platform x86_64-unknown-linux-gnu \
  --python-version 3.14 \
  --custom-compile-command "bash tools/semgrep/erzeugen.sh" \
  --quiet \
  -o requirements.txt "$@"
echo "requirements.txt: $(grep -cE '^[a-z0-9]' requirements.txt) Pakete, $(grep -c 'hash=sha256' requirements.txt) Hashes"
