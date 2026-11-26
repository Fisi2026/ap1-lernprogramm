# shellcheck shell=bash
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
# ---- 4f: Umbau neu/ (React+TS) - Typen, Tests, Bau -------------------------
# Der Umbau haengt am selben Netz wie die alte App. Nicht "laeuft schon", sondern
# gemessen: Typpruefung, Vitest und ein vollstaendiger Bau, jedes mit eigenem Urteil.
# ⚠️ Die Zahl der Tests wird MITGELESEN. Ein Lauf, der stumm 0 Tests faehrt, ist
#    sonst gruen - dieselbe Falle wie bei den 45 alten Suiten (Sollwert-Abgleich).
# 4f-einstieg) IST EINSTIEG.md BUENDIG? (neu 22.09.2026, BUILD_LOG 26 Nachtrag 2)
#    EINSTIEG.md ist ERZEUGT aus START_PROMPT.md und BUILD_LOG.md. Eine erzeugte Datei, die
#    niemand nachzieht, ist schlimmer als keine: sie sieht aktuell aus. Drei Urteile wie ueberall,
#    2 = STUMM (Quelle nicht lesbar) und damit rot.
#    ⚠️ Das "4f-" im Namen heisst NICHT "nur Neubau" - es markiert die Bloecke, die
#       tools/waechter_zusicherung.py mitprueft (beide Zweige).
if [ -f tools/einstieg.py ]; then
  EI="$(python3 tools/einstieg.py --pruefe 2>&1)"; EI_RC=$?
  if [ "$EI_RC" -eq 2 ] || [ -z "$EI" ]; then
    melde "Einstieg: Werkzeug stumm, keine auswertbare Antwort ($(printf '%s' "$EI" | head -1))"
  elif [ "$EI_RC" -ne 0 ]; then
    melde "$EI"
  else
    ok "$EI"
  fi
else
  melde "Einstieg: tools/einstieg.py fehlt - EINSTIEG.md ist dann ungeprueft"
fi

