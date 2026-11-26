# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e11) DIE TOKEN-WACHE PRUEFT SICH SELBST (neu 18.09.2026)
  # ⚠️ `tools/wache.py` entscheidet, WANN ein Chat gewechselt wird. Ihr Kopf traegt drei Zahlen
  #    (Faktor Byte/Token, Zuschlag je Runde, Reserve fuer die Uebergabe) und eine Regel
  #    (verbraucht + Reserve + Rest der Aufgabe > Budget). Wer eine davon anfasst, verschiebt
  #    still den Zeitpunkt der Uebergabe - und merkt es nie, weil niemand ihren Selbsttest faehrt.
  # ⚠️ Beide Zweige sind durch SABOTAGE abgenommen (18.09.): Doppelzaehl-Schutz ausgehebelt ->
  #    3 rote Proben; Ausgabe-Umstellung ausgebaut -> 2 rote Proben (UnicodeEncodeError unter
  #    cp1252, gefunden erst beim Lauf am echten Fall). Nullprobe danach jeweils gruen.
  # ⛔ Werkzeug-stumm ist FEHLER: eine Wache, die nicht antwortet, sieht aus wie eine, die
  #    nichts zu melden hat - genau die Verwechslung, die 4e10 fuer die Pool-Waechter abstellt.
  if [ -f tools/wache.py ]; then
    local WA_S WA_N
    WA_S="$(python3 tools/wache.py selbsttest 2>&1)"
    WA_N="$(printf '%s' "$WA_S" | awk -F'[()]' '/^SELBSTTEST GRUEN/{print $2}')"
    if printf '%s' "$WA_S" | grep -q "^SELBSTTEST ROT"; then
      melde "Token-Wache: ihr eigener Selbsttest faellt durch - 'python3 tools/wache.py selbsttest'"
    elif [ -z "$WA_N" ]; then
      melde "Token-Wache: 'python3 tools/wache.py selbsttest' liefert kein Urteil - Werkzeug pruefen"
    else
      ok "Token-Wache ($WA_N, Selbsttest)"
    fi
  else
    melde "Token-Wache: tools/wache.py fehlt"
  fi

