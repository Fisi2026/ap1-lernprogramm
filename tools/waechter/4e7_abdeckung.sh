# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e7) ABDECKUNG: WELCHE PRUEFUNG LIEST WELCHEN INHALTSTRAEGER (neu 27.08.2026)
  # ⚠️ ANLASS: An EINEM Tag fuenfmal derselbe Fehler - eine Pruefung meldet gruen ueber ein Gebiet,
  #    das sie nicht betritt. pool_query.js las faelle.js nicht (der BITV-Fehler stand direkt neben
  #    "ok BITV: 0"). test_didaktik.js las faelle.js nicht (10 von 14 mc-Aufgaben hatten den Tell).
  #    apply_batch.py kann pool_faelle.json gar nicht lesen. KEIN Waechter las die 5207 Zeilen
  #    Lernunterlagen (dort standen Pay-per-Use und GPL falsch - beides Fehler, die im Pool bereits
  #    korrigiert waren). Und der begriffe-Waechter kannte GPL nicht, obwohl derselbe Fehler am
  #    selben Tag in FALL-01 korrigiert wurde - vier weitere Fundstellen blieben unsichtbar.
  # ⛔ DIE MATRIX IST KEINE NOTIZ. "gelesen" wird nachgezaehlt: Enthaelt der Bestand, den die
  #    Pruefung laut inhaltstraeger.json liest, wirklich Eintraege dieses Traegers? Wer eine Zelle
  #    auf "gelesen" setzt, ohne den Lader zu aendern, bekommt hier einen Fehler.
  # ⚠️ GEPRUEFT WIRD ABDECKUNG, NICHT QUALITAET - siehe "_grenze" in inhaltstraeger.json.
  if [ -f inhaltstraeger.json ] && [ -f tools/pool_query.js ]; then
    local AB AB_S
    AB="$(node tools/pool_query.js abdeckung 2>/dev/null)"
    AB_S="$(printf '%s' "$AB" | sed -n 's/^SUMME: \([0-9]*\).*/\1/p')"
    if [ -z "$AB_S" ]; then
      melde "Abdeckungs-Guard: 'node tools/pool_query.js abdeckung' lieferte keine Summe"
    elif [ "$AB_S" -gt 0 ]; then
      melde "Abdeckungs-Guard: $AB_S Luecke(n) in inhaltstraeger.json - 'node tools/pool_query.js abdeckung'"
    else
      ok "Abdeckung ($(printf '%s' "$AB" | grep -c '^   ok ') Traeger-Pruefung-Paare nachgezaehlt, keine Luecke)"
    fi
  else
    melde "Abdeckungs-Guard: inhaltstraeger.json fehlt"
  fi

