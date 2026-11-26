#!/usr/bin/env bash
# shellcheck shell=bash
# tools/vorlauf.sh - der VORLAUF vor jedem vollen check.sh (N51 A1, E075, 11.10.2026).
#
# Anlass (BUILD_LOG 144): am 11.10. liefen 10 volle check.sh-Laeufe, 4 davon rot an Dingen, die man
# vorher in Sekunden haette sehen koennen - Standzeile zu frueh, Schnappschuss, Bestands-ID nach W1,
# ruff-Ratsche. Jeder rote volle Lauf kostete ~5 min und mehrere Warte-Aufrufe der Bruecke.
#
# Was er tut (Reihenfolge = Ausgabe):
#   1. EINSTIEG.md neu erzeugen (`einstieg.py --setze`) - 3 von 8 Doku-Laeufen am 11.10. fielen daran.
#   2. die billigen Stand-Waechter aus check.sh: Versionen, Standzeile, Auslieferung, Ungepusht, CI,
#      Bestands-IDs (4e2d), START_PROMPT-Umfang (4g), Entscheide (4g2), EINSTIEG, BUILD_LOG.
#   3. die Qualitaets-Ratsche (ruff, shellcheck, lizard, knip) - GANZ, nicht nur auf geaenderten Dateien:
#      sie ist eine Summe ueber den Bestand, und der ganze Lauf kostet gemessen 4,4 s (Linux, 11.10.).
#   4. vitest, nur wenn neu/ oder pool/ geaendert ist:
#        - immer der Schnappschuss-Test (src/huelle/schnappschuss.jsdom.test.tsx, gemessen 9,6 s) -
#          er faellt auch bei reinem Pool-Zuwachs (andere erste Frage);
#        - geaenderte Dateien unter neu/src: `vitest related` darauf - AUSSER pool/ ist geaendert:
#          dann ist „related“ der ganze Bestand (gemessen 3 min 32 s) und gehoert in den vollen Lauf.
#
# ⛔ DER VORLAUF ERSETZT check.sh NICHT. Er faengt das Billige ab; gruen heisst „jetzt lohnt der volle
#    Lauf“, nicht „fertig“. Waechter werden aus tools/waechter/ GESOURCT - dieselben Dateien wie in
#    check.sh, keine zweite Fassung.
#
# Benutzung:  bash tools/vorlauf.sh           rc 0 = gruen, 1 = rot
#             bash tools/vorlauf.sh --probe   Abnahme: stellt die vier roten Laeufe vom 11.10. als
#                                             Sabotage nach (Kopien werden danach zurueckgelegt) und
#                                             verlangt, dass jeder gemeldet wird. rc 0 = alle vier gefunden.
set -u
DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$DIR" || exit 2

if [ "${1:-}" = "--probe" ]; then
  # Die vier Faelle vom 11.10. Jede Sabotage aendert EINE Datei; vorher gesichert, per trap zurueck.
  SP_START="START_PROMPT.md"
  SP_SNAP="neu/src/huelle/__schnappschuss__/typ-mc.txt"
  SP_ID="regeln/pool.md"
  SP_RUFF="tools/_vorlauf_probe_ruff.py"
  [ -e "$SP_RUFF" ] && { echo "ABBRUCH: $SP_RUFF existiert schon"; exit 2; }
  for f in "$SP_START" "$SP_SNAP" "$SP_ID"; do [ -f "$f" ] || { echo "ABBRUCH: $f fehlt"; exit 2; }; done
  SICHER="$(mktemp -d)"
  cp "$SP_START" "$SICHER/start"; cp "$SP_SNAP" "$SICHER/snap"; cp "$SP_ID" "$SICHER/id"
  # shellcheck disable=SC2329  # wird ueber trap aufgerufen
  zuruecklegen(){
    cp "$SICHER/start" "$SP_START"; cp "$SICHER/snap" "$SP_SNAP"; cp "$SICHER/id" "$SP_ID"
    rm -f "$SP_RUFF"; rm -rf "$SICHER"
  }
  trap zuruecklegen EXIT
  # 1 Standzeile zu frueh: Marker passt nicht zum Messwert (DURCH <-> OFFEN getauscht)
  if grep -q 'PUSH DURCH' "$SP_START"; then sed -i 's/PUSH DURCH/PUSH OFFEN/' "$SP_START"
  else sed -i 's/PUSH OFFEN/PUSH DURCH/' "$SP_START"; fi
  # 2 Schnappschuss: die gespeicherte Fassung weicht von der gezeichneten ab
  printf 'VORLAUF-PROBE\n' >> "$SP_SNAP"
  # 3 Bestands-ID: der Block steht nicht mehr, wo der Waechter ihn sucht (so am 11.10. nach dem Umzug in W1)
  sed -i 's/IDs BLEIBEN ABSICHTLICH STEHEN/IDs BLEIBEN STEHEN/' "$SP_ID"
  # 4 ruff-Ratsche: neue, unverfolgte Python-Datei mit ungenutztem Import
  printf 'import os\n' > "$SP_RUFF"
  AUS="$(bash "$0" 2>&1)"; RC=$?
  T=0; F=""
  printf '%s' "$AUS" | grep -q 'FEHLER\] Stand-Guard: .*sagt'          && T=$((T+1)) || F="$F Standzeile"
  printf '%s' "$AUS" | grep -q 'FEHLER\] vitest Schnappschuss'          && T=$((T+1)) || F="$F Schnappschuss"
  printf '%s' "$AUS" | grep -q 'FEHLER\] Stand-Guard: Bestands-ID-Block' && T=$((T+1)) || F="$F Bestands-ID"
  printf '%s' "$AUS" | grep -q 'FEHLER\] Qualitaets-Ratsche'            && T=$((T+1)) || F="$F Ratsche"
  if [ "$T" -eq 4 ] && [ "$RC" -ne 0 ]; then echo "PROBE 4/4 gemeldet (rc $RC)"; exit 0; fi
  echo "PROBE $T/4 gemeldet, rc $RC - NICHT gemeldet:$F"
  printf '%s\n' "$AUS" | grep -E 'FEHLER|VORLAUF' | head -20
  exit 1
fi

START=$(date +%s)
FEHLER=0
melde(){ echo "[FEHLER] $1"; FEHLER=$((FEHLER+1)); }
ok(){ echo "[ok] $1"; }
waechter(){
  local _wdatei
  for _wdatei in "$@"; do
    # shellcheck source=/dev/null  # Waechter-Dateien werden je Name gesourct
    if [ -f "tools/waechter/$_wdatei.sh" ]; then . "tools/waechter/$_wdatei.sh"
    else melde "Waechter fehlt: tools/waechter/$_wdatei.sh"; fi
  done
}

# 1) EINSTIEG neu erzeugen (schreibt nur, wenn sich etwas geaendert hat - einstieg.py vergleicht selbst)
if EI="$(python3 tools/einstieg.py --setze 2>&1)"; then ok "EINSTIEG erzeugt ($(printf '%s' "$EI" | tail -1 | cut -c1-80))"
else melde "einstieg.py --setze: $(printf '%s' "$EI" | tail -1)"; fi

# 2+3) Waechter - Reihenfolge wie check.sh; 4e_versionen setzt AV fuer die Stand-Waechter.
waechter_lauf(){
  waechter 4e_versionen 4e2_standzeile 4e2b_auslieferung 4e2b2_ungepusht 4e2b2c_ci 4e2d_bestandsids \
           4f_buildlog 4g_startprompt 4g2_entscheide 4f_einstieg 4f_qualitaet 4f_architektur
}
waechter_lauf

# 4) vitest - nur, wenn neu/ oder pool/ beruehrt ist
GEAENDERT="$(git status --porcelain --untracked-files=all 2>/dev/null | cut -c4- | sed 's/.* -> //')"
POOL_GEAENDERT="$(printf '%s\n' "$GEAENDERT" | grep -E '^pool/' | head -1)"
NEU_GEAENDERT="$(printf '%s\n' "$GEAENDERT" | grep -E '^neu/' | head -1)"
if [ -n "$POOL_GEAENDERT$NEU_GEAENDERT" ]; then
  if [ ! -d neu/node_modules ]; then
    melde "vitest: neu/node_modules fehlt (cd neu && npm ci)"
  else
    L="$( cd neu && NO_COLOR=1 npx vitest run src/huelle/schnappschuss.jsdom.test.tsx --reporter=dot 2>&1 )"; C=$?
    if [ "$C" -eq 0 ]; then ok "vitest Schnappschuss ($(printf '%s' "$L" | grep -oE 'Tests +[0-9]+ passed' | tail -1))"
    else melde "vitest Schnappschuss - 'cd neu && npx vitest run src/huelle/schnappschuss.jsdom.test.tsx' (Diff lesen; gewollt: -u)"
         printf '%s\n' "$L" | grep -E '✗|×|FAIL|Snapshot' | head -6; fi
    # nur bestehende Dateien unter neu/src (geloeschte kann vitest nicht aufloesen)
    QUELLEN="$(printf '%s\n' "$GEAENDERT" | grep -E '^neu/src/.*\.(ts|tsx)$' | while read -r q; do [ -f "$q" ] && printf '%s\n' "${q#neu/}"; done)"
    if [ -n "$QUELLEN" ] && [ -n "$POOL_GEAENDERT" ]; then
      echo "[info] vitest related uebersprungen: pool/ geaendert - das waere der ganze Bestand (voller Lauf)"
    elif [ -n "$QUELLEN" ]; then
      # shellcheck disable=SC2086  # QUELLEN ist eine Pfadliste ohne Leerzeichen (Repo-Dateinamen)
      L="$( cd neu && NO_COLOR=1 npx vitest related $QUELLEN --run --reporter=dot 2>&1 )"; C=$?
      N="$(printf '%s\n' "$QUELLEN" | wc -l | tr -d ' ')"
      if [ "$C" -eq 0 ]; then ok "vitest related auf $N geaenderte(n) Datei(en) ($(printf '%s' "$L" | grep -oE 'Test Files +[0-9]+ passed' | tail -1))"
      else melde "vitest related auf $N geaenderte(n) Datei(en)"; printf '%s\n' "$L" | grep -E 'FAIL|✗|×' | head -8; fi
    fi
  fi
else
  echo "[info] vitest uebersprungen: weder neu/ noch pool/ geaendert"
fi

DAUER=$(( $(date +%s) - START ))
echo "==================================="
if [ "$FEHLER" -eq 0 ]; then echo "VORLAUF GRÜN in ${DAUER} s - jetzt lohnt der volle Lauf: bash check.sh"; exit 0
else echo "VORLAUF ROT: $FEHLER PROBLEM(E) in ${DAUER} s - erst beheben, dann check.sh"; exit 1; fi
