#!/usr/bin/env bash
# tools/doku_commit.sh - Doku-/Plugin-Commit in EINEM Lauf (BUILD_LOG 216).
# Grund (gemessen 17.10.2026): check.sh doku scheiterte 3x an "EINSTIEG veraltet" und 3x an "CI laeuft noch";
# jeder Doku-Commit kostete 3-6 Brueckenaufrufe statt 2.
# Nutzung: bash tools/hinter.sh dc 'bash tools/doku_commit.sh _to_delete/helfer/<msg>.txt <pfad>...'
#          dann: bash tools/warte.sh dc 45   (bis "BELEG")
# rc: 0 ok - 1 Doku-Check rot (FEHLER-Zeilen) - 2 einstieg.py - 3 origin/main voraus - 4 Push/Ref weicht ab - 5 Aufruf
set -u
cd "$(git rev-parse --show-toplevel)" || exit 9
[ $# -ge 2 ] && [ -f "$1" ] || { echo "Aufruf: doku_commit.sh <nachricht.txt> <pfad>..."; exit 5; }
msg=$1; shift
log=_to_delete/helfer/doku_commit.log
python3 tools/einstieg.py --setze >/dev/null || exit 2
bash tools/ci_warte.sh >/dev/null 2>&1
bash check.sh doku >"$log" 2>&1 || { grep -a '\[FEHLER\]' "$log"; exit 1; }
git fetch -q
[ "$(git rev-list --count HEAD..origin/main)" = 0 ] || { echo "origin/main voraus"; exit 3; }
git add EINSTIEG.md "$@"
bash tools/gitc.sh commit -F "$msg" 2>&1 | tail -1
bash tools/gitc.sh push origin main 2>&1 | tail -1
h=$(git rev-parse --short HEAD); r=$(git ls-remote origin refs/heads/main | cut -c1-7)
echo "BELEG HEAD $h REMOTE $r"; [ "$h" = "$r" ] || exit 4
