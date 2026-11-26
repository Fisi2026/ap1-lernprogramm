# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4c) Anti-Pattern-Guard: el() mit tr/td/th wird vom HTML-Parser verworfen (createElement nutzen!)
  local AP=0
  for f in referenz/app_*.js; do   # N34 T6c: an der Wurzel liegt keine app_*.js mehr
    ohne_kommentare "$f"
    grep -aqE "el\((\"|')<t[rdh]" "$NC_DATEI" && { AP=1; echo "    [treffer] $f"; }
  done
  if [ "$AP" -eq 0 ]; then ok "Anti-Pattern-Guard (kein el-Aufruf mit tr/td/th im Code)"; else melde "Anti-Pattern: el-Aufruf mit tr/td/th in app_*.js - document.createElement verwenden (bekannter Tabellen-DOM-Bug)"; fi

