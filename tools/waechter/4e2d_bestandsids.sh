# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e2d) BESTANDS-IDs: die Prosa-Liste muss laengen_ausnahmen.json VOLLSTAENDIG enthalten.
  # Begruendung und Ausgabeformat: tools/stand_ids.py
  if [ -f tools/stand_ids.py ] && [ -f laengen_ausnahmen.json ]; then
    local BID
    BID="$(python3 tools/stand_ids.py 2>/dev/null)"
    case "${BID:-KEINBLOCK}" in
      OK*)    ok "Bestands-IDs (${BID#OK } genannt, laengen_ausnahmen.json vollstaendig gedeckt)" ;;
      FEHLT*) melde "Stand-Guard: laengen_ausnahmen.json fuehrt IDs, die START_PROMPT nicht nennt: ${BID#FEHLT }" ;;
      ZAHL*)  melde "Stand-Guard: Bestands-ID-Block kuendigt eine andere Zahl an als er listet: ${BID#ZAHL }" ;;
      *)      melde "Stand-Guard: Bestands-ID-Block in regeln/pool.md nicht gefunden" ;;
    esac
  fi

