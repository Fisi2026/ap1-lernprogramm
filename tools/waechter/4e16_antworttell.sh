# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort)
# Teil von check.sh - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e16) ANTWORTEN VERRATEN SICH - HINWEIS, KEIN FEHLER (K3-E66, 24.11.2026, Lerner-Meldungen 14/17)
  # Kandidatenfilter `pool_query.js antworttell k3` (A Echo, B Klammer, D themenfremd) ueber das Set klausur_k3.
  # ⛔ Wie 4e8 bewusst kein 'melde' und keine Ausnahmeliste. A und D haben Fehlalarme; deshalb meldet der Hinweis
  #    nur, was UEBER dem Stand liegt (STAND unten nach P5, 24.11.: A 4 und D 21 einzeln gelesen bzw. vom Agenten gelesen und nachgeprueft, docs/befunde/BEFUNDE_MELDUNGEN.md P4/P5).
  #    Wer einen neuen Treffer gelesen hat, behebt ihn oder hebt den Stand mit Begruendung im BUILD_LOG.
  # ⚠️ Ein stummes Werkzeug ist FEHLER (B152): der Hinweis ist verhandelbar, seine Messung nicht.
  if [ -f tools/pool_query.js ]; then
    local AT AT_A AT_B AT_D
    local STAND_A=4 STAND_B=0 STAND_D=21
    AT="$(node tools/pool_query.js antworttell k3 2>/dev/null)"
    AT_A="$(printf '%s' "$AT" | sed -n 's/^A) ECHO[^:]*: \([0-9]*\).*/\1/p')"
    AT_B="$(printf '%s' "$AT" | sed -n 's/^B) KLAMMER[^:]*: \([0-9]*\).*/\1/p')"
    AT_D="$(printf '%s' "$AT" | sed -n 's/^D) THEMENFREMD[^:]*: \([0-9]*\).*/\1/p')"
    if [ -z "$AT_A" ] || [ -z "$AT_B" ] || [ -z "$AT_D" ]; then
      melde "Antwort-Tell: 'node tools/pool_query.js antworttell k3' liefert keine auswertbare Zahl - Werkzeug pruefen"
    elif [ "$AT_A" -gt "$STAND_A" ] || [ "$AT_B" -gt "$STAND_B" ] || [ "$AT_D" -gt "$STAND_D" ]; then
      echo "[hinweis] Antwort-Tell im K3-Set ueber dem gelesenen Stand: A $AT_A/$STAND_A, B $AT_B/$STAND_B, D $AT_D/$STAND_D."
      echo "          Neue Treffer EINZELN lesen: node tools/pool_query.js antworttell k3"
    else
      ok "Antwort-Tell K3 (A $AT_A, B $AT_B, D $AT_D - nicht ueber dem gelesenen Stand)"
    fi
  fi
