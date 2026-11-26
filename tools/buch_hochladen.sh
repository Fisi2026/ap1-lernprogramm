#!/usr/bin/env bash
# tools/buch_hochladen.sh - legt ../Buch EINMAL in das private Repo Fisi2026/ap1-buch (Nutzer-Entscheid 27.09.2026).
#   Auf dem Rechner fahren, auf dem ../Buch liegt (Git Bash oder Training Shell, cwd = Training):
#     bash tools/buch_hochladen.sh            # zeigt, was hochginge, und fragt NICHT - erst mit --los
#     bash tools/buch_hochladen.sh --los      # git init/commit/push nach Fisi2026/ap1-buch
#   Danach holt `bash tools/einrichten.sh` das Buch auf jedem anderen Rechner selbst (gh repo clone).
# ⛔ GitHub nimmt keine Datei ueber 100 MB - solche Dateien werden genannt und der Lauf bricht ab.
# ⛔ Ist ../Buch schon ein Git-Arbeitsbaum, wird nur gepusht, was committet ist - nichts ueberschrieben.
set -u
REPO="https://github.com/Fisi2026/ap1-buch.git"
B="$(cd .. && pwd)/Buch"
[ -d "$B" ] || { echo "⛔ $B fehlt - auf DIESEM Rechner liegt das Buch nicht."; exit 2; }
[ -f "$B/_aufbereitung/buch.py" ] || { echo "⛔ $B/_aufbereitung/buch.py fehlt - ist das der richtige Ordner?"; exit 2; }
# Nutzer-Entscheid 28.09.2026 (BUILD_LOG 85): Dateien ueber 95 MB (die drei Westermann-PDFs) bleiben
# LOKAL - sie kommen in ../Buch/.gitignore; auf einem neuen Rechner kopiert der Nutzer sie von Hand.
GROSS="$(cd "$B" && find . -path ./.git -prune -o -type f -size +95M -print | sed 's|^\./||' | sort)"
[ -n "$GROSS" ] && { echo "Bleiben lokal (ueber 95 MB, GitHub-Grenze 100 MB):"; printf '%s\n' "$GROSS" | sed 's/^/  /'; }
echo "Buch: $B · $(find "$B" -path "$B/.git" -prune -o -type f -size -95M -print | wc -l) Dateien ins Repo"
[ "${1:-}" = "--los" ] || { echo "Trockenlauf. Mit --los wird hochgeladen."; exit 0; }
if [ -n "$GROSS" ]; then
  touch "$B/.gitignore"
  printf '%s\n' "$GROSS" | while IFS= read -r f; do grep -qxF -- "/$f" "$B/.gitignore" || printf '/%s\n' "$f" >> "$B/.gitignore"; done
fi
cd "$B" || exit 2
if [ ! -d .git ]; then
  # Datenschutz (17.07.): gleiche anonyme Identitaet wie im Lern-App-Repo, nie die globale
  git init -q -b main && git config user.name "$(git -C "$OLDPWD" config user.name)"     && git config user.email "$(git -C "$OLDPWD" config user.email)" && git add -A && git commit -q -m "Lehrbuch-Aufbereitung: erster Stand (vom alten Rechner)" || exit 4
fi
git remote get-url origin >/dev/null 2>&1 || git remote add origin "$REPO"
git push -u origin main && git ls-remote origin refs/heads/main
