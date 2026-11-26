# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4b) UTF-8-Validität der Kern-Files (Encoding-Korruption früh fangen)
  local U=0
  for f in referenz/logik.js pool/*.json referenz/app_*.js referenz/styles.css referenz/lernprogramm_ap1.html neu/src/kern/tabellen/*.ts; do
    [ -f "$f" ] && { iconv -f UTF-8 -t UTF-8 "$f" >/dev/null 2>&1 || { melde "UTF-8 ungueltig: $f"; U=1; }; }
  done
  [ "$U" -eq 0 ] && ok "UTF-8-Validität (Kern-Files)"

