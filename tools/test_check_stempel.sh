#!/usr/bin/env bash
# tools/test_check_stempel.sh – Selbsttest der Push-Sperre (N49 W2) in einem Wegwerf-Repo.
#   bash tools/test_check_stempel.sh   -> rc 0 = alle Faelle wie erwartet
set -u
HIER="$(cd "$(dirname "$0")/.." && pwd)"
T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
cd "$T" || exit 2
git init -q . && git config user.email t@t && git config user.name t && git config core.autocrlf false
mkdir -p tools _to_delete/helfer && cp "$HIER/tools/check_stempel.sh" tools/
printf '_to_delete/\n' > .gitignore; echo a > datei.txt
git add -A && git commit -qm eins
F=0
erwarte() { # $1 = erwarteter rc, $2 = Beschreibung
  bash tools/check_stempel.sh pruefe >/dev/null 2>&1; rc=$?
  if [ "$rc" = "$1" ]; then echo "[ok] $2"; else echo "[FEHLER] $2 (rc=$rc, erwartet $1)"; F=$((F+1)); fi
}
erwarte 1 "ohne Stempel: Push verweigert (roter oder fehlender Lauf)"
bash tools/check_stempel.sh schreibe voll >/dev/null
erwarte 0 "gruener voller Lauf auf committetem Baum: Push geht"
echo b > datei.txt
erwarte 0 "Aenderung NACH dem Lauf, nicht committet: HEAD traegt weiter den geprueften Baum"
git commit -qam zwei
erwarte 1 "Aenderung nach dem Lauf committet: Push verweigert"
bash tools/check_stempel.sh schreibe doku >/dev/null
erwarte 0 "gruener doku-Lauf passend zum Baum: Push geht"
echo c > neu.txt; bash tools/check_stempel.sh schreibe voll >/dev/null
erwarte 1 "Lauf ueber Ungecommittetes: Push verweigert"
bash tools/check_stempel.sh schreibe schnell >/dev/null; git add -A; git commit -qm drei
erwarte 0 "schnell stempelt nicht, alter Stempel gilt fuer den neuen Baum: Gegenprobe gruen"
if PUSH_OHNE_CHECK=1 bash tools/check_stempel.sh pruefe >/dev/null 2>&1; then echo "[ok] Notausgang des Nutzers wirkt"
else echo "[FEHLER] Notausgang"; F=$((F+1)); fi
if [ "$F" -eq 0 ]; then echo "ALLE FAELLE OK"; else echo "$F FEHLER"; fi
exit "$F"
