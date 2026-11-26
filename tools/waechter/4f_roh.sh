# shellcheck shell=bash
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
# 4f-roh) N25 P7: ROHE BEDIENELEMENTE IN neu/src (neu 21.09.2026, PLAN_NEUBAU Abschnitt D).
#    Jedes rohe <input|select|textarea|table|details|summary|button> ausserhalb components/ui
#    und der Tests braucht einen Eintrag MIT GRUND in neu/rohe_elemente.json - und jede
#    Ausnahme einen Fund. Drei Urteile: 0 gruen, 1 rot, 2 WERKZEUG STUMM (auch rot).
#    Der Selbsttest laeuft mit; faellt er, ist das Urteil wertlos.
if [ -d neu ]; then
  if [ ! -f tools/rohe_elemente.py ]; then
    melde "Rohe Elemente neu/: tools/rohe_elemente.py fehlt - Waechter stumm"
  else
    RE_S="$(python3 tools/rohe_elemente.py --selbsttest 2>&1)"; RE_SRC=$?
    RE="$(python3 tools/rohe_elemente.py 2>&1)"; RE_RC=$?
    RE_K="$(printf '%s' "$RE" | grep '^ROHE:')"
    if [ "$RE_SRC" -ne 0 ]; then
      melde "Rohe Elemente neu/: Selbsttest faellt ($(printf '%s' "$RE_S" | tail -1)) - 'python3 tools/rohe_elemente.py --selbsttest'"
    elif [ "$RE_RC" -eq 2 ] || [ -z "$RE_K" ]; then
      melde "Rohe Elemente neu/: Werkzeug stumm, keine auswertbare Zahl ($(printf '%s' "$RE" | head -1))"
    elif [ "$RE_RC" -ne 0 ]; then
      melde "Rohe Elemente neu/: $(printf '%s' "$RE" | tr '
' ' ' | cut -c1-400) - bauen aus components/ui ODER mit Grund in neu/rohe_elemente.json"
    else
      ok "Rohe Elemente neu/ (${RE_K#ROHE: })"
    fi
  fi
fi
