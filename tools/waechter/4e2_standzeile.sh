# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e2) STAND-ZEILE IN START_PROMPT.md gegen den Code (neu 30.07.2026)
  # ⚠️ ANLASS: In Zeile 88 stand "Pool 1073 Fragen ... 16 von 16 Suiten gruen", waehrend es real
  #    1089 Fragen und 43 Suiten waren. Der Satz war TAGELANG falsch und ist nur zufaellig
  #    aufgefallen. Kein Wunder: START_PROMPT.md wurde in 37 der letzten 40 Commits angefasst –
  #    haeufiger als jede Codedatei. Von Hand gepflegte Zahlen in einer so oft angefassten Datei
  #    veralten zwangslaeufig.
  #    ►► Das Projekt kennt die Lehre schon: "Eine Regel, die nur in einem Dateikopf steht, wird
  #       nicht befolgt; eine, die ein Skript meldet, schon." Also meldet sie jetzt ein Skript.
  # ⚠️ BEWUSST 'melde' (rot), anders als die Laengen-Hinweise: Eine FALSCHE Zahl im Uebergabe-Kopf
  #    ist keine Formsache. Genau daraus entstehen die Fehlentscheidungen, vor denen Abschnitt 1
  #    dieser Datei warnt ("Umgebungs-Annahmen sind verderbliche Ware").
  # ⚠️ Die Zeile wird ueber ihre Bestandteile gesucht, nicht ueber eine feste Zeilennummer –
  #    sie wandert bei jeder Bearbeitung.
  local SPZ POOL_N FAELLE_N SUITEN_N
  SPZ="$(grep -a "APP_VERSION .* app-sw .* Pool .* Suiten" START_PROMPT.md | head -1)"
  if [ -z "$SPZ" ]; then
    melde "Stand-Guard: die LIVE-Zeile (APP_VERSION ... Pool ... Suiten) fehlt in START_PROMPT.md"
  else
    POOL_N="$(node tools/pool_laden.js --pruefe 2>/dev/null | awk '/^POOL /{print $2}')"
    FAELLE_N="$(node tools/pool_laden.js --pruefe 2>/dev/null | awk '/^POOL /{print $3}')"
    SUITEN_N="$(compgen -G 'tests/test_*.js' | wc -l | tr -d ' ')"
    local FEHLT=""
    echo "$SPZ" | grep -q "APP_VERSION $AV"          || FEHLT="$FEHLT APP_VERSION(soll $AV)"
    echo "$SPZ" | grep -q "app-sw ap1-app-$AV"       || FEHLT="$FEHLT app-sw(soll ap1-app-$AV)"
    echo "$SPZ" | grep -q "Pool $POOL_N Fragen"      || FEHLT="$FEHLT Pool(soll $POOL_N)"
    echo "$SPZ" | grep -q "$FAELLE_N Fälle"          || FEHLT="$FEHLT Fälle(soll $FAELLE_N)"
    echo "$SPZ" | grep -q "$SUITEN_N von $SUITEN_N"  || FEHLT="$FEHLT Suiten(soll $SUITEN_N)"
    if [ -n "$FEHLT" ]; then
      melde "Stand-Guard: START_PROMPT-Stand stimmt nicht mit dem Code ueberein –$FEHLT"
    else
      ok "START_PROMPT-Stand (v$AV, $POOL_N Fragen, $FAELLE_N Fälle, $SUITEN_N Suiten)"
    fi
  fi

