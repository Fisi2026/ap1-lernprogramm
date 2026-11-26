#!/usr/bin/env bash
# backup_rotate.sh – Backup-Hygiene: Keep/Delete-Plan für backup_*.zip (+ Altzip ziOrM0Wa).
# Aufruf im Training-Ordner:  bash tools/backup_rotate.sh [keepN]   (Standard keepN=3)
# HINWEIS: `rm` scheitert auf dem Mount ("Operation not permitted"). Dieses Skript LÖSCHT NICHT,
# sondern erstellt nur den Plan. Das eigentliche Löschen läuft über die Cowork-Datei-Löschfreigabe
# (allow_cowork_file_delete) oder den Nutzer im Explorer. So bleibt der Ordner schlank ohne Risiko.
set -u
DIR="$(cd "$(dirname "$0")/.." && pwd)"; cd "$DIR" || exit 1
KEEP="${1:-3}"

green(){ printf '\033[32m%s\033[0m\n' "$*"; }
red(){   printf '\033[31m%s\033[0m\n' "$*"; }

# Backups nach Änderungszeit, neuste zuerst
mapfile -t ZIPS < <(ls -1t backup_*.zip 2>/dev/null)
n=${#ZIPS[@]}
echo "== Backup-Bestand: $n Zip(s), behalte neuste $KEEP =="
i=0; delsize=0; DEL=()
for z in "${ZIPS[@]}"; do
  sz=$(stat -c%s "$z" 2>/dev/null); szh=$(numfmt --to=iec "$sz" 2>/dev/null || echo "$sz")
  if [ "$i" -lt "$KEEP" ]; then green "  KEEP    $z  ($szh)"
  else red "  LÖSCHEN $z  ($szh)"; DEL+=("$z"); delsize=$((delsize+sz)); fi
  i=$((i+1))
done
# Altzip ohne Endung
if [ -f ziOrM0Wa ]; then
  sz=$(stat -c%s ziOrM0Wa 2>/dev/null); szh=$(numfmt --to=iec "$sz" 2>/dev/null || echo "$sz")
  red "  LÖSCHEN ziOrM0Wa  ($szh)  [alter Backup-Zip ohne Endung]"; DEL+=("ziOrM0Wa"); delsize=$((delsize+sz))
fi

echo
if [ "${#DEL[@]}" -eq 0 ]; then green "Nichts zu tun – Bestand bereits schlank."
else
  echo "Löschkandidaten (${#DEL[@]}), freimachbar: $(numfmt --to=iec "$delsize" 2>/dev/null || echo "$delsize B")"
  echo "Zum Löschen (Mount verbietet rm) an Claude: diese Dateien per Löschfreigabe entfernen:"
  printf '  %s\n' "${DEL[@]}"
fi
