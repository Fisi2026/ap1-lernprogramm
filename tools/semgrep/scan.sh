#!/usr/bin/env bash
# Semgrep CE – statische Sicherheitsanalyse (SAST), Komplettpruefung 09.10.2026 (ND4, OpenSSF Scorecard „SAST").
# AUSFUEHREN: bash tools/semgrep/scan.sh   (CI-Job `semgrep`; lokal nur mit installiertem semgrep, Linux/WSL)
# ⛔ Die Regeln kommen aus github.com/semgrep/semgrep-rules an einem FESTEN Commit (REGELN_SHA) und nur die
#    Dateien aus regeln.txt – nie live aus der Registry: eine Pruefung, deren Regeln sich ohne Commit aendern,
#    wuerfelt (LEHREN „Eine Pruefung, die wuerfelt, ist keine Pruefung"). Auswahl: tools/semgrep/auswahl.py.
# ⛔ Ein Fund macht den Lauf rot (--error). Fehlalarm: `// nosemgrep` an der Zeile MIT Begruendung daneben.
# ⚠️ Semgrep CE wertet nur innerhalb einer Datei aus (kein dateiuebergreifender Datenfluss) – es ergaenzt
#    tsc/oxlint/check.sh, ersetzt keine Durchsicht. Regeln: Semgrep Rules License v1.0 (nur interne Nutzung).
set -euo pipefail
cd "$(dirname "$0")/../.."
REGELN_SHA=9bbf021d0acffa3095fcffd17b2bc7787eb4796d   # semgrep-rules main vom 08.10.2026
ZIEL="${SEMGREP_REGELN:-${RUNNER_TEMP:-/tmp}/semgrep-rules}"
if [ ! -d "$ZIEL/.git" ]; then
  git init -q "$ZIEL"
  git -C "$ZIEL" remote add origin https://github.com/semgrep/semgrep-rules.git
fi
git -C "$ZIEL" fetch -q --depth 1 origin "$REGELN_SHA"
git -C "$ZIEL" -c advice.detachedHead=false checkout -q FETCH_HEAD
args=()
n=0
while IFS= read -r r; do
  [ -z "$r" ] && continue
  [ -f "$ZIEL/$r" ] || { echo "[FEHLER] Regeldatei fehlt am Commit: $r"; exit 2; }
  args+=(--config "$ZIEL/$r"); n=$((n + 1))
done < tools/semgrep/regeln.txt
[ "$n" -ge 50 ] || { echo "[FEHLER] nur $n Regeldateien gelesen - regeln.txt leer oder kaputt"; exit 2; }
echo "Semgrep $(semgrep --version) · $n Regeldateien · Regeln @ ${REGELN_SHA:0:7}"
exec semgrep scan --metrics=off --disable-version-check --error \
  --exclude referenz --exclude node_modules --exclude v2 --exclude _to_delete --exclude .tooling \
  "${args[@]}" .
