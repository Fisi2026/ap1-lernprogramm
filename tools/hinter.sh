#!/usr/bin/env bash
# tools/hinter.sh <name> <befehl ...> - EIN LAUF IM HINTERGRUND, am 60-s-Deckel der Bruecke vorbei.
#   bash tools/hinter.sh vt 'cd neu && NO_COLOR=1 npx vitest run --reporter=dot'
#   bash tools/warte.sh vt 50        # wartet hoechstens 50 s, gibt rc und Schluss aus
#
# Das nohup-Rezept aus START_PROMPT §2 / Skill §4, einmal statt in jedem Chat abgeschrieben (N30).
# Ausgabe: _to_delete/helfer/<name>.txt · Marke: _to_delete/helfer/<name>.fertig (Inhalt "rc=<n>").
# ⛔ Eine alte Marke und Ausgabe gleichen Namens werden VOR dem Start geleert - sonst meldet
#    warte.sh sofort den Rueckgabewert des VORIGEN Laufs (die Falle jeder Handfassung).
# ⛔ Laeuft unter demselben Namen schon etwas (Ausgabe da, Marke fehlt): rc 3, kein zweiter Start.
#    --neu erzwingt den Start trotzdem (wenn der alte Lauf erwiesen tot ist).
# rc 0 = gestartet · 2 = Aufruffehler · 3 = laeuft schon.
set -u
cd "$(dirname "$0")/.." || exit 2
ERZWINGEN=0
[ "${1:-}" = "--neu" ] && { ERZWINGEN=1; shift; }
NAME="${1:-}"; shift || true
if [ -z "$NAME" ] || [ "$#" -eq 0 ]; then
  echo "Aufruf: bash tools/hinter.sh [--neu] <name> <befehl ...>" >&2; exit 2
fi
case "$NAME" in *[!A-Za-z0-9_-]*) echo "[hinter] Name nur aus A-Z a-z 0-9 _ - : '$NAME'" >&2; exit 2 ;; esac
H=_to_delete/helfer; mkdir -p "$H"
AUS="$H/$NAME.txt"; MARKE="$H/$NAME.fertig"
if [ "$ERZWINGEN" = 0 ] && [ -f "$H/$NAME.laeuft" ] && [ ! -f "$MARKE" ]; then
  echo "[hinter] '$NAME' laeuft schon (seit $(cat "$H/$NAME.laeuft")). Erst warte.sh, oder --neu." >&2; exit 3
fi
: > "$AUS"; rm -f "$MARKE"
[ -f "$MARKE" ] && { echo "[hinter] alte Marke $MARKE laesst sich nicht entfernen" >&2; exit 2; }
BEFEHL="$*"
date '+%H:%M:%S' > "$H/$NAME.laeuft"
# ⛔ Der Befehl laeuft in einer EIGENEN inneren bash: ein `exit 3` darin beendete sonst die Huelle,
#    bevor sie die Marke schreibt - warte.sh meldete dann ewig "laeuft noch" (Gegenprobe 22.09.).
# shellcheck disable=SC2016  # $0..$2 wertet die innere bash aus - gewollt (N45 W1)
nohup bash -c 'bash -c "$2" > "$0" 2>&1; echo rc=$? > "$1"' "$AUS" "$MARKE" "$BEFEHL" >/dev/null 2>&1 &
echo "[hinter] '$NAME' gestartet (pid $!). Ausgabe $AUS · warten: bash tools/warte.sh $NAME [sek]"
exit 0
