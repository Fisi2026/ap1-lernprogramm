#!/usr/bin/env bash
# tools/alt_klon_weiche.sh - Umzug N40 V3, Schritt 6.1 (docs/plaene/PLAN_UMZUG_V3.md), Nutzer-Entscheid 26.11.2026 (BUILD_LOG 284):
#   Ein Klon mit der ALTEN Historie darf nie in das neue Repo schieben (ab Schritt 7 zeigt der alte Name auf das neue Repo;
#   ein Zweig-Push laege dort mit der ganzen alten Historie samt privater Adresse). Darum entfernt dieses Skript in jedem
#   alten Klon `origin` - auf allen PCs beim naechsten Start (SessionStart-Haken tools/postfach.sh, tools/start.sh).
# Erkennung ohne Netz: Wurzelcommit der alten Historie. Im neuen Repo (eigener Erstcommit) tut das Skript nichts.
# Endet immer mit 0 (darf einen Sitzungsstart nicht stoeren).
ALT_WURZEL=b44ebde1f116ebe8a477fa232cf75af582716fe8
cd "$(dirname "$0")/.." || exit 0
git rev-list --max-parents=0 HEAD 2>/dev/null | grep -qx "$ALT_WURZEL" || exit 0
if git remote get-url origin >/dev/null 2>&1; then
  if bash tools/gitc.sh remote remove origin >/dev/null 2>&1 && ! git remote get-url origin >/dev/null 2>&1; then
    echo "⛔ UMZUG-WEICHE: alter Klon erkannt - origin entfernt (docs/plaene/PLAN_UMZUG_V3.md Schritt 6.1). Dieser Ordner pusht nicht mehr; neuer Klon in Schritt 14."
  else
    echo "⛔ UMZUG-WEICHE: alter Klon, origin liess sich NICHT entfernen - nicht pushen, Nutzer fragen (git remote remove origin)."
  fi
else
  echo "UMZUG-WEICHE: alter Klon ohne origin (Schritt 6.1 erledigt) - nicht pushen; neuer Klon kommt in Schritt 14."
fi
exit 0
