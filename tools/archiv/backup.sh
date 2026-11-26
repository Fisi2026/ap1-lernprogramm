#!/bin/bash
# backup.sh – Ein-Kommando-Backup nach Standardverfahren (mktemp-Zip → Mount, unzip -l-Gegenprüfung).
# Aufruf im Training-Ordner:  bash tools/backup.sh [name]
#   ohne Name:  backup_<YYYY-MM-DD>.zip   (mit Name: <name>.zip)
# Exclude: .git, *.zip, *.pdf, ziOrM0Wa, node_modules, .tooling  (identisch zur bisherigen Handroutine).
set -u
DIR="$(cd "$(dirname "$0")/.." && pwd)"; cd "$DIR" || exit 1
NAME="${1:-backup_$(date +%F)}"; ZIP="${NAME%.zip}.zip"
TMP="/tmp/$ZIP"
rm -f "$TMP" "$DIR/$ZIP"
zip -r -q "$TMP" . -x ".git/*" "*.zip" "*.pdf" "ziOrM0Wa" "node_modules/*" ".tooling/*" || { echo "[FEHLER] zip fehlgeschlagen"; exit 1; }
cp "$TMP" "$DIR/$ZIP"
echo "== $ZIP erstellt =="
ls -la "$DIR/$ZIP"
echo "== Kernfiles im Backup (Gegenprüfung) =="
unzip -l "$DIR/$ZIP" | grep -E "fragen\.js|app\.js|styles\.css|logik\.js|check\.sh|pool/pool_m" | head
KERN=$(unzip -l "$DIR/$ZIP" | grep -cE "fragen\.js|app\.js|styles\.css|logik\.js|check\.sh")
[ "$KERN" -ge 5 ] && echo "[ok] alle 5 Kernfiles enthalten" || echo "[FEHLER] Kernfiles unvollständig ($KERN/5) – Backup prüfen!"
