# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e6) FACHBEGRIFFE, DIE SCHON EINMAL GEGENSAETZLICH BENUTZT WURDEN (neu 27.08.2026)
  # ⚠️ ANLASS: "Pay-per-Use" stand in M03-713/714 richtig (nutzungsabhaengig, die feste
  #    Monatspauschale ausdruecklich als GEGENbeispiel) und in M04-008/M04-120 genau umgekehrt.
  #    ERSTER WIDERSPRUCH UEBER MODULGRENZEN - innerhalb eines Moduls faellt so etwas beim Lesen
  #    auf, ueber zwei Module hinweg nie. Gefunden wurde er nur durch einen zufaelligen
  #    kontext-Aufruf, nicht durch ein Verfahren.
  # ⛔⛔ DIESER WAECHTER MISST KEINE BEDEUTUNG und darf nie so gelesen werden. "Widerspricht" ist
  #    nicht mechanisch entscheidbar. Geprueft wird ausschliesslich, ob ein Begriff im selben
  #    Textfenster neben einem Wort steht, das seiner Definition widerspricht - und ob ein
  #    Abgrenzungssatz danebensteht, der genau das erlaubt.
  #    ►► Was er NICHT faengt, steht in begriffe_belegt.json unter "_grenze". Wer sich darauf
  #       verlaesst statt zu lesen, benutzt ihn falsch.
  # ⚠️ Am 27.08. wurden drei Suchwege ueber mehrere hundert Begriffe gefahren; Pay-per-Use war der
  #    EINZIGE echte Widerspruch. Die Anker-Datei ist deshalb bewusst KLEIN - siehe "_warnung".
  if [ -f begriffe_belegt.json ] && [ -f tools/pool_query.js ]; then
    local BG BG_S
    BG="$(node tools/pool_query.js begriffe 2>/dev/null)"
    BG_S="$(printf '%s' "$BG" | sed -n 's/^SUMME: \([0-9]*\).*/\1/p')"
    if [ -z "$BG_S" ]; then
      melde "Begriffs-Guard: 'node tools/pool_query.js begriffe' lieferte keine Summe"
    elif [ "$BG_S" -gt 0 ]; then
      melde "Begriffs-Guard: $BG_S Frage(n) benutzen einen Begriff entgegen begriffe_belegt.json - 'node tools/pool_query.js begriffe'"
    else
      ok "Fachbegriffe ($(printf '%s' "$BG" | grep -c '^   ok ') maschinell geprueft, $(printf '%s' "$BG" | grep -c '^   -- ') nur dokumentiert)"
    fi
  fi

