#!/usr/bin/env bash
# tools/doku_commit.sh - Doku-/Plugin-Commit in EINEM Lauf (BUILD_LOG 216).
# Grund (gemessen 17.10.2026): check.sh doku scheiterte 3x an "EINSTIEG veraltet" und 3x an "CI laeuft noch";
# jeder Doku-Commit kostete 3-6 Brueckenaufrufe statt 2.
# Nutzung: bash tools/hinter.sh dc 'bash tools/doku_commit.sh _to_delete/helfer/<msg>.txt <pfad>...'
#          dann: bash tools/warte.sh dc 45   (bis "BELEG")
# rc: 0 ok - 1 Doku-Check rot (FEHLER-Zeilen) - 2 einstieg.py - 3 main nicht nachziehbar - 4 Push/Ref weicht ab - 5 Aufruf
# Seit Paket 1 (27.11.2026, BUILD_LOG 316): main nur per PR. Vorher `gitc.sh nachziehen` (statt rev-list, das nach einem
#   Squash falsch „voraus“ meldete); Beleg ist der PR-Zweig auf dem Remote, nicht main (der Auto-Merge folgt nach der CI).
set -u
cd "$(git rev-parse --show-toplevel)" || exit 9
[ $# -ge 2 ] && [ -f "$1" ] || { echo "Aufruf: doku_commit.sh <nachricht.txt> <pfad>..."; exit 5; }
msg=$1; shift
log=_to_delete/helfer/doku_commit.log
python3 tools/einstieg.py --setze >/dev/null || exit 2
bash tools/ci_warte.sh >/dev/null 2>&1
bash check.sh doku >"$log" 2>&1 || { grep -a '\[FEHLER\]' "$log"; exit 1; }
bash tools/gitc.sh nachziehen || { echo "main nicht nachziehbar (siehe oben)"; exit 3; }
git add EINSTIEG.md "$@"
bash tools/gitc.sh commit -F "$msg" 2>&1 | tail -1
bash tools/gitc.sh push origin main 2>&1 | tail -3
z=$(awk '{print $1}' _to_delete/helfer/pr_zweig.txt 2>/dev/null)
h=$(git rev-parse --short HEAD); r=$(git ls-remote origin "refs/heads/${z:-?}" | cut -c1-7)
echo "BELEG HEAD $h ZWEIG ${z:-?} REMOTE $r"; [ -n "$z" ] && [ "$h" = "$r" ] || exit 4
