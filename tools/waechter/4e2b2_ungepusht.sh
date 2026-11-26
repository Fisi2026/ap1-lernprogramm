# shellcheck shell=bash
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e2b2) UNGEPUSHTE COMMITS MIT WIRKUNG BEIM LERNER GEGEN DEN MARKER DER AUSLIEFERUNGS-ZEILE
  # ⚠️ ANLASS 02.09.2026: 4e2b vergleicht VERSIONSNUMMERN. Nach dem Push von v1.19.0 lag der
  #    B106-Commit (spickzettel.js) ungepusht auf main - beide Nummern waren 1.19.0, und 4e2b
  #    haette "PUSH DURCH" ERZWUNGEN, waehrend eine Aenderung, die der Lerner sieht, unveroeffent-
  #    licht dalag. Cloudflare deployt bei JEDEM Push (DEPLOY.md), nicht erst beim Tag.
  # ⛔ DIE ERSTE FASSUNG HING AM FALSCHEN MASS: sie nahm handverlesen "Commits, die nur
  #    START_PROMPT.md anfassen" aus. Beim ersten echten Einsatz zeigte sich, dass `.assetsignore`
  #    die Frage schon beantwortet - es sagt, was NICHT ausgeliefert wird (*.md, *.sh, *.py,
  #    tools/**, tests/**). Gemessen: die App laedt zur Laufzeit keine .md, sw.js cacht keine.
  #    ►► Begruendung, Faelle und Grenzen: tools/ungepusht.py. Ein gemessenes Kriterium statt
  #       einer Liste, die ich pflegen muesste - und nicht zirkulaer, weil die Dateien, in denen
  #       der Push-Stand notiert wird, selbst nicht ausgeliefert werden.
  #    Geprueft am 02.09. an zehn Dateien und vier Commits mit bekannter Antwort: be09a68 ZAEHLT
  #    (spickzettel.js), d207d5c ZAEHLT (app_state.js, sw.js), 75f36ee und 4d3985a still.
  # ⚠️ UP/UZ sind seit 21.09.2026 schon oben gemessen (ein Aufruf statt zwei, eine Quelle).
  if [ -n "$MARKER" ] && [ -f tools/ungepusht.py ]; then
    case "${UP:-KEINREF}" in
      CI)      ok "Ungepusht-Guard (in der CI strukturell 0 - hier wird NICHT gemessen)" ;;
      KEINREF) ok "Ungepusht-Guard (kein lokaler Ref origin/main - nicht messbar)" ;;
      OK*)
        if [ "${UZ:-0}" -gt 0 ] && [ "$MARKER" = "PUSH DURCH" ]; then
          melde "Stand-Guard: $UZ ungepushte(r) Commit(s) aendern etwas beim Lerner, aber die Zeile sagt 'PUSH DURCH' - 'python3 tools/ungepusht.py' zeigt welche"
        else
          ok "Ungepusht-Guard ($(printf '%s' "$UP" | awk '{print $3}') Commit(s) offen, davon ${UZ:-0} mit Wirkung beim Lerner, Zeile sagt '$MARKER')"
        fi ;;
      *)       melde "Ungepusht-Guard: unerwartete Ausgabe von tools/ungepusht.py: $UP" ;;
    esac
  else
    ok "Ungepusht-Guard (kein Marker oder Werkzeug fehlt - nicht messbar)"
  fi

