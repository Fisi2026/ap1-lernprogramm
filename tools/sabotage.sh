#!/usr/bin/env bash
# tools/sabotage.sh – GEGENPROBE IN EINEM AUFRUF.
#
#   bash tools/sabotage.sh --datei pool/pool_m04.json --suite didaktik --alt '<muster>' --neu '<ersatz>'
#   (die alte App liegt seit N29 in referenz/: --datei referenz/app_seiten.js; welche Suiten noch
#    laufen, steht in sollwerte.env - zurueck_m09 u. a. liegen in referenz/tests/ und laufen nicht mehr)
#   ⚠️ N34 T6c: logik.js und die Suite logik gibt es nicht mehr. Fuer den Kern (neu/src/kern, vitest)
#      kann dieses Werkzeug nichts - Sabotagen dort als Einwegskript (SCHIENE_NEU.md Abschnitt 3).
#
#   Mehrzeilige Muster ueber Dateien:
#   bash tools/sabotage.sh --datei pool/pool_m04.json --suite didaktik \
#        --alt-datei /tmp/alt.txt --neu-datei /tmp/neu.txt
#
# ══════════ WARUM ES DIESES SKRIPT GIBT (30.07.2026) ══════════
# TASKLIST verlangt seit jeher „JEDEN NEUEN TEST GEGENPROBEN". Am 30.07. wurde eine neue Suite
# dreimal sabotiert, um zu zeigen, dass sie wirklich greift. **Der zweite Lauf blieb gruen** – und
# sah damit aus wie ein schwacher Test. Tatsaechlich hatte die Ersetzung gar nicht gegriffen
# (Einrueckung stimmte nicht), die Sabotage war nie im Code. Die Fehldeutung lag nahe und war
# teuer: man verdaechtigt den Test statt das eigene Werkzeug.
# ►►► **DREI DINGE MACHT DIESES SKRIPT DESHALB ANDERS:**
#   1. **ZUSICHERUNG VOR DEM LAUF.** Kommt das Muster nicht GENAU EINMAL vor, bricht es ab, bevor
#      irgendetwas laeuft. Eine Gegenprobe, die nicht stattgefunden hat, darf nicht wie eine
#      bestandene aussehen.
#   2. **URTEIL UMGEKEHRT.** Bei einer Sabotage ist GRUEN der Fehlschlag. Das Skript endet mit 0,
#      wenn die Suite ROT wird, und mit 1, wenn sie gruen bleibt. Wer `&&` verkettet, bekommt das
#      richtige Verhalten geschenkt.
#   3. **WIEDERHERSTELLUNG IMMER**, ueber `trap ... EXIT INT TERM`. Auch bei Abbruch, Zeitlimit
#      oder Fehler in der Suite. Am 30.07. lag die Sicherung von Hand in /tmp – ein vergessenes
#      `cp` zurueck haette die Sabotage in den Arbeitsbaum committet.
#
# ⚠️ ES AENDERT DEN ARBEITSBAUM WAEHREND DES LAUFS. Nicht parallel zu anderen Aufrufen benutzen.

set -u
cd "$(dirname "$0")/.." || exit 1

DATEI=""; SUITE=""; ALT=""; NEU=""; ALT_DATEI=""; NEU_DATEI=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --datei) DATEI="$2"; shift 2 ;;
    --suite) SUITE="$2"; shift 2 ;;
    --alt) ALT="$2"; shift 2 ;;
    --neu) NEU="$2"; shift 2 ;;
    --alt-datei) ALT_DATEI="$2"; shift 2 ;;
    --neu-datei) NEU_DATEI="$2"; shift 2 ;;
    *) echo "[sabotage] Unbekanntes Argument: $1" >&2; exit 2 ;;
  esac
done
[ -n "$ALT_DATEI" ] && ALT="$(cat "$ALT_DATEI")"
[ -n "$NEU_DATEI" ] && NEU="$(cat "$NEU_DATEI")"

if [ -z "$DATEI" ] || [ -z "$SUITE" ] || [ -z "$ALT" ]; then
  echo "Aufruf: bash tools/sabotage.sh --datei <F> --suite <name> --alt <muster> [--neu <ersatz>]" >&2
  echo "        --alt-datei/--neu-datei fuer mehrzeilige Muster." >&2
  exit 2
fi
[ -f "$DATEI" ] || { echo "[sabotage] Datei fehlt: $DATEI" >&2; exit 2; }

SICHER="$(mktemp)"
cp "$DATEI" "$SICHER"
# shellcheck disable=SC2329  # aufgerufen per trap (unten) (N45 W1)
wiederherstellen() {
  cp "$SICHER" "$DATEI" && rm -f "$SICHER"
  if cmp -s "$DATEI" "$SICHER" 2>/dev/null || [ ! -f "$SICHER" ]; then
    echo "[sabotage] $DATEI wiederhergestellt."
  else
    echo "[sabotage] ⚠️⚠️ WIEDERHERSTELLUNG UNKLAR – $DATEI von Hand gegen git diff pruefen!" >&2
  fi
}
trap wiederherstellen EXIT INT TERM

# ── Zusicherung: Muster genau einmal vorhanden? ────────────────────────────────────────────────
ALT="$ALT" NEU="$NEU" DATEI="$DATEI" python3 - <<'PY' || exit 3
import os, sys
d, alt, neu = os.environ["DATEI"], os.environ["ALT"], os.environ["NEU"]
s = open(d, encoding="utf-8").read()
n = s.count(alt)
if n != 1:
    sys.stderr.write("[sabotage] ABBRUCH: Muster kommt %d mal vor, erwartet genau 1.\n" % n)
    sys.stderr.write("[sabotage] Nichts geaendert. Haeufigste Ursache: Einrueckung.\n")
    sys.exit(3)
open(d, "w", encoding="utf-8").write(s.replace(alt, neu, 1))
print("[sabotage] Muster genau 1x ersetzt (%d -> %d Zeichen)." % (len(alt), len(neu)))
PY

# Syntaxprobe, damit ein Sabotage-Lauf nicht an einem kaputten Parser statt am Test scheitert.
case "$DATEI" in
  *.js) node --check "$DATEI" >/dev/null 2>&1 || echo "[sabotage] Hinweis: $DATEI ist nach der Sabotage syntaktisch kaputt – die Suite faellt dann aus diesem Grund." ;;
esac

echo "[sabotage] fahre Suite $SUITE ..."
AUS="$(bash tools/suite.sh "$SUITE" 2>&1)"
echo "$AUS" | grep -E "^test_|FEHLER:" | head -20

# ── Urteil: bei einer Sabotage ist GRUEN der Fehlschlag ────────────────────────────────────────
if echo "$AUS" | grep -q "ALLE GEFAHRENEN SUITEN GRUEN"; then
  echo "[sabotage] ⛔ URTEIL: Suite BLIEB GRUEN – die Sabotage wird NICHT bemerkt."
  echo "[sabotage]    Entweder deckt $SUITE diesen Fall nicht ab, oder das Muster sass an der"
  echo "[sabotage]    falschen Stelle. Erst pruefen, ob die Sabotage wirklich gewirkt haetten koennen."
  exit 1
fi
echo "[sabotage] ✅ URTEIL: Suite wird ROT – die Gegenprobe greift."
exit 0
