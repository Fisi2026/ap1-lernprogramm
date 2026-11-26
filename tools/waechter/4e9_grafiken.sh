# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e9) SIND DIE GRAFIKEN HEIL? (neu 27.08.2026)
  # ⚠️ ANLASS: M06-120 endete mit "</text></rect></svg>" - ein schliessendes </rect> ohne
  #    oeffnendes Gegenstueck. Die Grafik ist KEIN gueltiges XML und laesst sich nicht rendern.
  #    Gefunden wurde das erst, als der Kontaktbogen "RENDERT NICHT" hinschrieb. Kein Waechter
  #    hatte je das Markup im svg-Feld angesehen - check.sh prueft die JS-Syntax der Dateien und
  #    das Pool-Schema, aber nie den Inhalt dieses Feldes.
  # ⚠️ ZWEI TEILE, ZWEI SCHAERFEN:
  #    A) Wohlgeformtheit ist EXAKT messbar -> FEHLER. Eine Grafik, die nicht rendert, erscheint
  #       dem Lerner gar nicht; das ist kein Schoenheitsfehler.
  #    B) Ueberlaufender Text wird GESCHAETZT (Zeichenzahl x Schriftgroesse) -> nur HINWEIS,
  #       und bewusst ohne Ausnahmeliste. Am 27.08. waren es 10 Kandidaten, alle echt.
  if [ -f tools/pool_query.js ]; then
    local SV SV_A SV_B
    SV="$(node tools/pool_query.js svg 2>/dev/null)"
    SV_A="$(printf '%s' "$SV" | sed -n 's/^A) NICHT WOHLGEFORMT (rendert nicht): \([0-9]*\).*/\1/p')"
    SV_B="$(printf '%s' "$SV" | sed -n 's/^B) TEXT LAEUFT AUS SEINEM KASTEN: \([0-9]*\).*/\1/p')"
    SV_C="$(printf '%s' "$SV" | sed -n 's/^C) ELEMENT AUSSERHALB DER ZEICHENFLAECHE: \([0-9]*\).*/\1/p')"
    SV_D="$(printf '%s' "$SV" | sed -n 's/^D) KLICKFLAECHE DECKT SICH NICHT MIT IHREM KASTEN: \([0-9]*\).*/\1/p')"
    if [ -z "$SV_A" ]; then
      melde "SVG-Guard: 'node tools/pool_query.js svg' lieferte keine Summe"
    elif [ "$SV_A" -gt 0 ]; then
      melde "SVG-Guard: $SV_A Grafik(en) sind nicht wohlgeformt und RENDERN NICHT - 'node tools/pool_query.js svg'"
    else
      ok "Grafiken wohlgeformt (alle geprueft, keine rendert ins Leere)"
    fi
    # ⚠️ C) IST DIE KLASSE VON M04-119 - und sie war schon einmal "ausgeschlossen": Am 27.08.
    #    lief dafuer ein WEGWERF-SKRIPT ueber alle 96 mit 0 Treffern, danach gab es keinen
    #    Waechter mehr. Am selben Abend wurde beim Neuzeichnen von M03-019 ein Kasten 8 Einheiten
    #    ueber den Rand geschoben, und nichts meldete es.
    #    ►► Eine Messung, die einmal lief, ist keine Pruefung. Sie ist ein Zeitpunkt.
    if [ -z "$SV_C" ]; then
      melde "SVG-Guard: Abschnitt C lieferte keine Summe"
    elif [ "$SV_C" -gt 0 ]; then
      melde "SVG-Guard: In $SV_C Grafik(en) ragt ein Element aus der Zeichenflaeche - 'node tools/pool_query.js svg'"
    else
      ok "Grafiken vollstaendig in der Zeichenflaeche"
    fi
    # ⚠️ D) KAM AUS EINEM EIGENEN FEHLER: svg_breiter.py dehnte am 27.08. sechs hotspot-Grafiken,
    #    liess die `zonen` aber stehen - die Klickflaechen deckten danach nur noch drei Viertel
    #    jedes Kastens ab. KEINE andere Pruefung sieht das: wohlgeformt, in der Flaeche, Text
    #    passt - und die Aufgabe ist trotzdem kaputt. Auffallen wuerde es erst beim Lerner.
    if [ -z "$SV_D" ]; then
      melde "SVG-Guard: Abschnitt D lieferte keine Summe"
    elif [ "$SV_D" -gt 0 ]; then
      melde "SVG-Guard: $SV_D Klickflaeche(n) decken sich nicht mit ihrem Kasten - 'node tools/pool_query.js svg'"
    else
      ok "Klickflaechen decken sich mit ihren Kaesten"
    fi
    if [ -n "$SV_B" ] && [ "$SV_B" -gt 0 ]; then
      echo "[hinweis] In $SV_B Grafik(en) laeuft Text ueber den Rand seines Kastens."
      echo "          Geschaetzte Breite - jeden Treffer ansehen, nicht ausnehmen:"
      echo "          node tools/pool_query.js svg  ·  python3 tools/svg_bilder.py --id <ID>"
    fi
  fi

