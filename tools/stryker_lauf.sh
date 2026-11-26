#!/usr/bin/env bash
# tools/stryker_lauf.sh [--nur-heilen] [stryker-Argumente ...] - Mutationstest (N43 M3) mit Abbruchschutz.
#   bash tools/stryker_lauf.sh                       # Gesamtlauf nach neu/stryker.config.json
#   bash tools/stryker_lauf.sh --mutate src/kern/rechner.ts --incrementalFile ../_to_delete/helfer/stryker/inc_x.json
#   bash tools/stryker_lauf.sh --nur-heilen          # nur Reste eines abgebrochenen Laufs beseitigen
# Warum: inPlace (TS 7 laesst nichts anderes zu) schreibt ~270 Dateien in neu/ um. Ein harter Abbruch
#   (App-Absturz, Strom, Prozess beendet - gemessen 16.10.2026) laesst sie umgeschrieben liegen; Strykers
#   eigener Neustart stellt NICHT wieder her, sondern instrumentiert doppelt. Ein trap greift bei hartem
#   Abbruch nicht - darum heilt das Skript VOR jedem Start und prueft NACH jedem Ende.
# Heilen nur, was Stryker geschrieben hat (Zusatzzeile "// @ts-nocheck" bzw. stryNS_9fa48 im Diff);
#   jede andere Aenderung in neu/ -> rc 3, nichts wird angefasst.
# rc: Strykers rc · 3 = fremde Aenderungen in neu/ · 4 = nach dem Lauf nicht sauber (Liste in der Ausgabe)
set -u
cd "$(git rev-parse --show-toplevel)" || exit 9
MARKE=neu/.stryker-laeuft
stryker_dateien(){ git diff --name-only -- neu | while read -r f; do
  git diff -- "$f" | grep -q -E '^\+(// @ts-nocheck|.*stryNS_9fa48)' && echo "$f"; done; }
fremde(){ comm -23 <(git diff --name-only -- neu | sort) <(stryker_dateien | sort); }
heilen(){ local s; s=$(stryker_dateien)
  if [ -n "$s" ]; then echo "[stryker_lauf] stelle $(echo "$s" | wc -l) von Stryker umgeschriebene Datei(en) her"; echo "$s" | xargs git checkout --; fi
  rm -f neu/stryker-setup-*.js "$MARKE"; rm -rf neu/.stryker-tmp; }
f=$(fremde); if [ -n "$f" ]; then echo "[stryker_lauf] ⛔ fremde Aenderungen in neu/ - erst committen oder verwerfen:"; echo "$f" | head -20; exit 3; fi
heilen
[ "${1:-}" = "--nur-heilen" ] && { git status --porcelain -- neu; exit 0; }
vorher=$(git status --porcelain -- neu)
date +%FT%T > "$MARKE"
trap 'echo "[stryker_lauf] Abbruch - heile"; heilen; exit 130' INT TERM HUP
( cd neu && NO_COLOR=1 npx stryker run "$@" ); rc=$?
trap - INT TERM HUP
heilen
rest=$(comm -13 <(echo "$vorher" | sort) <(git status --porcelain -- neu | sort))
if [ -n "$rest" ]; then echo "[stryker_lauf] ⛔ nach dem Lauf nicht sauber:"; echo "$rest" | head -20; exit 4; fi
echo "[stryker_lauf] fertig rc=$rc, neu/ sauber"; exit $rc
