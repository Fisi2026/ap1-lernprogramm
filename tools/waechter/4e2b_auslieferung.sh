# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e2b) AUSLIEFERUNGS-ZEILE "LIVE beim Lerner: vX · committet auf main: vY · PUSH OFFEN|DURCH"
  # ⚠️ ANLASS 27.08.2026: Derselbe Sachverhalt - was ist beim Lerner, was liegt auf main - stand an
  #    VIER Stellen in START_PROMPT.md. Zwei davon waren falsch, eine seit VIER WOCHEN ("v1.13.0
  #    bleibt die letzte Fassung auf dem Remote") - acht Zeilen unter der Regel, die genau das
  #    verbietet. Das ist keine Nachlaessigkeit: Wer vier Stellen pflegen muss, pflegt drei.
  #    ►► Jetzt gibt es EINE Zeile. Und weil eine Zahl, die niemand nachhaelt, veraltet, haelt
  #       dieses Skript sie nach. Geprueft wird nur, was hier PRUEFBAR ist:
  #         * "committet auf main" MUSS die Version aus neu/package.json sein - das ist der Arbeitsbaum.
  #         * LIVE == committet -> nichts liegt offen -> Marker MUSS "PUSH DURCH" sein.
  #           LIVE != committet -> etwas liegt auf main, das der Lerner nicht hat -> "PUSH OFFEN".
  # ⛔ NICHT geprueft wird, ob der Push wirklich gelaufen ist. Das sagt allein der Nutzer (GitHub
  #    ist aus der Sandbox 403). Der Guard prueft die INNERE Stimmigkeit der Zeile - er darf nie
  #    den Eindruck erwecken, er haette nachgesehen.
  # ⚠️ ERGAENZT 21.09.2026 (N25 P3, Nutzer-Entscheid): 4e2b und 4e2b2 haben sich WIDERSPROCHEN,
  #    sobald ein Teilschritt OHNE Bump committet dalag. 4e2b sah gleiche Versionsnummern und
  #    verlangte "PUSH DURCH", 4e2b2 sah einen ungepushten Commit mit Wirkung und verbot ihn:
  #    KEIN Marker war gruen, und der Zustand ist ein voellig normaler (Release erst nach P4).
  #    ►► Deshalb wird die Zahl JETZT SCHON gemessen und von beiden Pruefungen gelesen.
  #    ⛔ "nicht messbar" ist NICHT dasselbe wie "0": in der CI und ohne Ref origin/main wird der
  #       Marker bei gleicher Version gar nicht bewertet (UZ=-1), statt stumm gruen zu melden.
  #       Fehlt das WERKZEUG, bleibt es rot - ein stummes Werkzeug darf nie gruen sein.
  local AZ LIVE_V COMM_V MARKER UP UZ
  if [ -f tools/ungepusht.py ]; then
    # E44: das Kriterium kommt aus wrangler.jsonc + den Worker-Importen - erst an bekannten Faellen pruefen
    UST="$(python3 tools/ungepusht.py --selbsttest 2>&1)"
    if printf '%s' "$UST" | grep -qE '^SELBSTTEST ([0-9]+)/\1 richtig'; then ok "Wirkungs-Kriterium ($(printf '%s' "$UST" | grep -oE '[0-9]+/[0-9]+ richtig.*'))"
    else melde "Wirkungs-Kriterium (ungepusht.py --selbsttest): $(printf '%s' "$UST" | head -2 | tr '\n' ' ')"; fi
    UP="$(python3 tools/ungepusht.py --pruefe 2>/dev/null)"
    case "${UP:-KEINREF}" in
      OK*) UZ="$(printf '%s' "$UP" | awk '{print $2}')" ;;
      *)   UZ=-1 ;;
    esac
  else
    UP=""; UZ=-1
  fi
  AZ="$(grep -a 'LIVE beim Lerner:' START_PROMPT.md | head -1)"
  if [ -z "$AZ" ]; then
    melde "Stand-Guard: die Auslieferungs-Zeile (LIVE beim Lerner: ... committet auf main: ...) fehlt"
  else
    LIVE_V="$(printf '%s' "$AZ" | sed -n 's/.*LIVE beim Lerner: v\([0-9.]*\).*/\1/p')"
    COMM_V="$(printf '%s' "$AZ" | sed -n 's/.*committet auf main: v\([0-9.]*\).*/\1/p')"
    MARKER="$(printf '%s' "$AZ" | grep -o 'PUSH \(OFFEN\|DURCH\)' | head -1)"
    if [ -z "$LIVE_V" ] || [ -z "$COMM_V" ] || [ -z "$MARKER" ]; then
      melde "Stand-Guard: Auslieferungs-Zeile unvollstaendig (LIVE=${LIVE_V:-?} committet=${COMM_V:-?} Marker=${MARKER:-?})"
    elif [ "$COMM_V" != "$AV" ]; then
      melde "Stand-Guard: 'committet auf main: v$COMM_V' != Version $AV aus neu/package.json"
    elif [ "$LIVE_V" = "$COMM_V" ] && [ "$MARKER" != "PUSH DURCH" ] && [ "${UZ:-0}" -gt 0 ]; then
      ok "Auslieferungs-Zeile (v$LIVE_V · $MARKER · $UZ ungepushte(r) Commit(s) mit Wirkung, ohne Bump)"
    elif [ "$LIVE_V" = "$COMM_V" ] && [ "$MARKER" != "PUSH DURCH" ] && [ "${UZ:-0}" -lt 0 ] && [ -n "$UP" ]; then
      ok "Auslieferungs-Zeile (v$LIVE_V · $MARKER · ungepusht hier nicht messbar [$UP] - Marker nicht bewertet)"
    elif [ "$LIVE_V" = "$COMM_V" ] && [ "$MARKER" != "PUSH DURCH" ]; then
      melde "Stand-Guard: LIVE = committet = v$LIVE_V und nichts liegt ungepusht, aber die Zeile sagt '$MARKER'"
    elif [ "$LIVE_V" != "$COMM_V" ] && [ "$MARKER" != "PUSH OFFEN" ]; then
      melde "Stand-Guard: LIVE v$LIVE_V != committet v$COMM_V, aber die Zeile sagt '$MARKER'"
    else
      ok "Auslieferungs-Zeile (LIVE v$LIVE_V · committet v$COMM_V · $MARKER)"
    fi
  fi

