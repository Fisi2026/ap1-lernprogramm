# shellcheck shell=bash
# Teil von check.sh - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e15) SELBSTTEST DES HOOK-MODULS limits.ts (neu 17.10.2026, BUILD_LOG 218)
  # ⚠️ ANLASS: limits.ts wurde am 17.10. dreimal geaendert und nur mit Wegwerf-Proben in _to_delete/ von Auge
  #    geprueft; "SCHWELLE geht beim Container-Neustart verloren" fiel erst im Betrieb auf (BUILD_LOG 216).
  #    Gegenprobe beim Bau: den Fehler von 1.3.12 wieder eingebaut -> 2 von 18 Faellen rot.
  #    Node >= 23.6 laedt .ts direkt (PC und CI: Node 24, gemessen 17.10.).
  LP_OUT="$(node --no-warnings tools/plugin/limits_probe.mjs 2>&1)"; LP_RC=$?
  if [ "$LP_RC" -eq 0 ]; then
    ok "Hook limits ($(printf '%s' "$LP_OUT" | tail -1 | sed 's/^\[limits_probe\] //'))"
  else
    melde "Hook limits: $(printf '%s' "$LP_OUT" | tr '\n' ' ' | cut -c1-400) - node tools/plugin/limits_probe.mjs"
  fi
