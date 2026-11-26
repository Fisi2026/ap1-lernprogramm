# shellcheck shell=bash
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
# 4f-as) N37 U4 (E60, 27.09.2026): RATSCHE FUER `as`-UMWANDLUNGEN im App-Code von neu/src (ohne Tests).
#    Die Zahl darf nur SINKEN; die Grenze steht in neu/as_ratsche.json. Drei Urteile wie 4f-roh.
#    Seit N38 Q1 (30.09.2026, BUILD_LOG 92): gezaehlt werden nur UNSICHERE Umwandlungen laut oxlint
#    `typescript/no-unsafe-type-assertion`; der Selbsttest prueft eine Probe mit bekannter Antwort
#    (neu/werkzeug/as_probe, genau 3 Funde).
if [ -d neu ]; then
  if [ ! -f tools/as_ratsche.py ]; then
    melde "as-Ratsche neu/: tools/as_ratsche.py fehlt - Waechter stumm"
  else
    AR_S="$(python3 tools/as_ratsche.py --selbsttest 2>&1)"; AR_SRC=$?
    AR="$(python3 tools/as_ratsche.py 2>&1)"; AR_RC=$?
    AR_K="$(printf '%s' "$AR" | grep '^AS:')"
    if [ "$AR_SRC" -ne 0 ]; then
      melde "as-Ratsche neu/: Selbsttest faellt ($(printf '%s' "$AR_S" | tail -1)) - 'python3 tools/as_ratsche.py --selbsttest'"
    elif [ "$AR_RC" -eq 2 ] || [ -z "$AR_K" ]; then
      melde "as-Ratsche neu/: Werkzeug stumm ($(printf '%s' "$AR" | head -1))"
    elif [ "$AR_RC" -ne 0 ]; then
      melde "as-Ratsche neu/: $(printf '%s' "$AR" | tr '\n' ' ' | cut -c1-400)"
    else
      ok "as-Ratsche neu/ (${AR_K#AS: }$(printf '%s' "$AR" | grep -q '^HINWEIS' && echo ' - GESUNKEN, Grenze nachziehen'))"
    fi
  fi
fi
