# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e2b2c) DER LETZTE CI-BEFUND AUF main (neu 14.09.2026)
  # ⛔⛔ ANLASS, UND ES IST EIN BEFUND UEBER MICH, NICHT UEBER DEN CODE: Seit dem 11.09. prueft
  #    Abschnitt 4f auch den Umbau in neu/. Der erste Schritt dieses Waechters fragt, ob
  #    neu/node_modules ueberhaupt da ist - und die CI hatte die Abhaengigkeiten nie bekommen.
  #    **NEUN Laeufe hintereinander rot** (11.09. bis 14.09.), jeder mit derselben Meldung.
  #    Lokal war alles gruen, `tools/ungepusht.py` meldete 0 offen - und ich habe neunmal
  #    gepusht, ohne ein einziges Mal hinzusehen. Bemerkt hat es der Nutzer.
  # ►► DIE HAUSREGEL GALT SCHON: "ein Meldezweig ist erst geprueft, wenn jemand ihn liest"
  #    (B153/B158). Sie stand nur nirgends fuer die CI. Jetzt liest check.sh den Befund selbst.
  # ⚠️ GEMESSEN WIRD DER LETZTE ABGESCHLOSSENE LAUF AUF main - also der Stand VOR dem naechsten
  #    Push. Genau das fehlte: es geht nicht darum, den eigenen Lauf vorherzusagen, sondern
  #    darum, keinen zehnten Push auf einen roten Stand zu setzen, ohne es zu wissen.
  # ⚠️ WERKZEUG-STUMM-ZWEIG: In der CI selbst und in der Sandbox gibt es kein angemeldetes gh.
  #    Dann wird NICHTS gemeldet und NICHTS behauptet - "nicht messbar" ist die ehrliche Antwort,
  #    "gruen" waere gelogen. Genau daran ist ci2.sh am 26.07. schon einmal gescheitert.
  if [ "${CI:-}" = "true" ]; then
    ok "CI-Befund (laeuft selbst in der CI - hier wird NICHT gemessen)"
  elif ! command -v gh >/dev/null 2>&1 || ! gh auth status >/dev/null 2>&1; then
    ok "CI-Befund (kein angemeldetes gh - nicht messbar, NICHT gruen)"
  else
    local CIZ CIST CIN CIID CISHA
    CIZ="$(gh run list --workflow ci.yml --branch main --limit 1 --json conclusion,displayTitle,databaseId,headSha 2>/dev/null)"
    CIST="$(printf '%s' "$CIZ" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{var r=JSON.parse(d);process.stdout.write(String((r[0]||{}).conclusion||''))}catch(e){}})" 2>/dev/null)"
    CIN="$(printf '%s' "$CIZ" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{var r=JSON.parse(d);process.stdout.write(String((r[0]||{}).displayTitle||''))}catch(e){}})" 2>/dev/null)"
    # BEFUND 08.10.2026: direkt nach einem Push laeuft der CI-Lauf noch - dann ist `conclusion` LEER und
    #    die Meldung lautete faelschlich "Werkzeug stumm" (zweimal an einem Tag). Gemessen: gh antwortete
    #    korrekt mit conclusion "" und einem Titel. ►► Titel da, Ergebnis leer = LAEUFT NOCH (rot bleibt es:
    #    gruen ist erst ein gemessener Erfolg - aber die Ursache stimmt jetzt).
    if [ -z "$CIST" ] && [ -n "$CIN" ]; then
      melde "CI-Befund: letzter Lauf auf main LAEUFT NOCH ($CIN) - 'bash tools/ci_warte.sh', dann neu pruefen"
    elif [ -z "$CIST" ]; then
      melde "CI-Befund: 'gh run list' liefert keine auswertbare Antwort - Werkzeug stumm ('bash ci2.sh')"
    elif [ "$CIST" = "success" ]; then
      ok "CI-Befund (letzter Lauf auf main gruen: $CIN)"
    else
      # AUSNAHME CI-KORREKTUR (11.10.2026, Nutzer-Entscheid, BUILD_LOG 144): seit der Push-Sperre (N49 W2) konnte ein
      #   Commit, der genau diesen roten Lauf behebt, nie gepusht werden (Sackgasse). `CI_KORREKTUR=<Lauf-ID oder
      #   die ersten 7 Zeichen des roten Commits>` macht aus DIESER Meldung einen Hinweis - nur fuer den benannten Lauf.
      #   Gegenprobe: falsche ID -> bleibt FEHLER.
      CIID="$(printf '%s' "$CIZ" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{var r=JSON.parse(d);process.stdout.write(String((r[0]||{}).databaseId||''))}catch(e){}})" 2>/dev/null)"
      CISHA="$(printf '%s' "$CIZ" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{var r=JSON.parse(d);process.stdout.write(String((r[0]||{}).headSha||'').slice(0,7))}catch(e){}})" 2>/dev/null)"
      if [ -n "${CI_KORREKTUR:-}" ] && { [ "$CI_KORREKTUR" = "$CIID" ] || [ "$CI_KORREKTUR" = "$CISHA" ]; }; then
        echo "[hinweis] CI-Befund: Lauf $CIID ($CISHA) ist '$CIST' - dieser Commit soll ihn beheben (CI_KORREKTUR). Nach dem Push: bash tools/ci_warte.sh"
        ok "CI-Befund (CI-Korrektur fuer Lauf $CIID benannt)"
      else
        melde "CI-Befund: letzter Lauf auf main ist '$CIST' ($CIN, Lauf $CIID, $CISHA) - 'bash ci2.sh' liest den Grund; ein Korrektur-Commit: CI_KORREKTUR=$CISHA bash check.sh"
      fi
    fi
  fi

