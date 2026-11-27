#!/usr/bin/env bash
# tools/ci_warte.sh - wartet IM HINTERGRUND auf die CI eines Commits und schreibt EINE Zeile in
# _to_delete/helfer/ci.urteil (BUILD_LOG 26, Nachtrag 4, 22.09.2026). Ersetzt die Abfrage-Schleife
# (21.09.: 6 Aufrufe a ~55 s fuer ein URTEIL). Der Lauf wird ueber den COMMIT gesucht, nicht als
# "letzter Lauf auf main" - so kann kein aelterer Lauf das Urteil liefern.
# Benutzung nach dem Push:
#   nohup bash tools/ci_warte.sh >/dev/null 2>&1 &      # Commit = origin/main
#   ... weiterarbeiten ...;  cat _to_delete/helfer/ci.urteil   (fehlt die Datei: wartet noch)
# Drei Urteile: success | failure/cancelled/... | ZEITGRENZE/UNBEKANNT (nie gruen).
H=_to_delete/helfer; mkdir -p "$H"; OUT="$H/ci.urteil"; rm -f "$OUT"
# Paket 1 (27.11.2026, BUILD_LOG 316): main nur per PR. `gitc.sh push origin main` vermerkt den PR-Zweig in
#   $H/pr_zweig.txt; traegt er HEAD, wird OHNE Argumente der PR-Lauf (Ereignis pull_request) auf diesem Zweig abgewartet.
#   Aufruf jetzt: bash tools/ci_warte.sh [<sha> [<zweig>]]
SHA="${1:-}"; ZWEIG="${2:-}"
if [ -z "$SHA" ] && [ -f "$H/pr_zweig.txt" ] && [ "$(awk '{print $2}' "$H/pr_zweig.txt")" = "$(git rev-parse HEAD)" ]; then
  SHA="$(git rev-parse HEAD)"; ZWEIG="$(awk '{print $1}' "$H/pr_zweig.txt")"
fi
SHA="${SHA:-$(git rev-parse origin/main)}"; ZWEIG="${ZWEIG:-main}"; K="${SHA:0:7}"
command -v gh >/dev/null || { echo "CI $K: UNBEKANNT - gh fehlt" > "$OUT"; exit 2; }
for _ in $(seq 1 40); do                                   # 40 x 45 s = 30 min
  Z=$(gh run list --workflow ci.yml --branch "$ZWEIG" --commit "$SHA" --limit 1 --json status,conclusion --jq '.[0] | .status + " " + .conclusion' 2>/dev/null)
  case "$Z" in
    "completed "*) echo "CI $K ($ZWEIG): ${Z#completed } ($(date +%H:%M))" > "$OUT"; exit 0 ;;
  esac
  sleep 45
done
echo "CI $K: ZEITGRENZE 30 min - Status offen, NICHT gruen (letzter: ${Z:-kein Lauf})" > "$OUT"; exit 1
