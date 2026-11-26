#!/usr/bin/env bash
# tools/warte.sh <name> [sek<=50] [zeilen] - wartet auf einen Lauf von tools/hinter.sh.
#   Fertig:     druckt "rc=<n>" und die letzten <zeilen> (Vorgabe 15) der Ausgabe;
#               RUECKGABEWERT = der des Laufs (0 gruen, sonst dessen rc).
#   Nicht fertig nach <sek> (Vorgabe 45): "laeuft noch" + letzte 3 Zeilen, rc 124.
#   Kein solcher Lauf: rc 2.
# ⛔ sek ist bei 50 gedeckelt: der Aufruf selbst muss unter dem 60-s-Deckel der Bruecke bleiben.
#    Ein hoeherer Wert wird NICHT still gekappt, sondern abgelehnt (rc 2) - eine stille Kappung
#    ist genau die Art Grenze, die man hier nicht sieht.
set -u
cd "$(dirname "$0")/.." || exit 2
NAME="${1:-}"; SEK="${2:-45}"; ZEILEN="${3:-15}"
[ -z "$NAME" ] && { echo "Aufruf: bash tools/warte.sh <name> [sek<=50] [zeilen]" >&2; exit 2; }
case "$SEK$ZEILEN" in *[!0-9]*) echo "[warte] sek und zeilen muessen Zahlen sein" >&2; exit 2 ;; esac
[ "$SEK" -gt 50 ] && { echo "[warte] sek=$SEK > 50 - der Aufruf liefe in den 60-s-Deckel. Abgelehnt." >&2; exit 2; }
H=_to_delete/helfer; AUS="$H/$NAME.txt"; MARKE="$H/$NAME.fertig"
[ -f "$AUS" ] || [ -f "$MARKE" ] || { echo "[warte] kein Lauf '$NAME' ($AUS fehlt)" >&2; exit 2; }
t=0
while [ ! -f "$MARKE" ] && [ "$t" -lt "$SEK" ]; do sleep 2; t=$((t+2)); done
if [ ! -f "$MARKE" ]; then
  echo "[warte] '$NAME' laeuft noch (seit $(cat "$H/$NAME.laeuft" 2>/dev/null || echo ?), ${t}s gewartet). Letzte Zeilen:"
  tail -n 3 "$AUS"; exit 124
fi
RC="$(sed -n 's/^rc=\([0-9]*\).*/\1/p' "$MARKE" | head -1)"
echo "[warte] '$NAME' fertig: rc=${RC:-?} · $(wc -l < "$AUS" | tr -d ' ') Zeilen in $AUS"
tail -n "$ZEILEN" "$AUS"
exit "${RC:-2}"
