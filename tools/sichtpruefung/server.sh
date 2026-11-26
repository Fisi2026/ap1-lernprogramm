#!/usr/bin/env bash
# tools/sichtpruefung/server.sh - die zwei Testserver fuer die alt/neu-Skripte (13.10.2026, BUILD_LOG 154).
#   bash tools/sichtpruefung/server.sh start   neu = Arbeitsbaum v2/ auf 8765, alt = HEAD-Stand von v2/ auf 8766
#   bash tools/sichtpruefung/server.sh stop    beendet beide (Windows: taskkill ueber die PID aus netstat)
# ⛔ WARUM NICHT `python -m http.server`: seit N29 liegt die App unter `/`, v2/index.html laedt `/assets/...`.
#    Aus dem Repo-Ordner ausgeliefert gab /v2/ eine LEERE Seite (Assets 404, 0 Knoepfe, kein <main>) -
#    gemessen 13.10.: alle alt/neu-Skripte massen danach nichts und meldeten trotzdem rc 0.
#    dienst.py liefert den Ordner aus einer Zeigerdatei aus und wertet _redirects (/v2/ -> /) und _headers aus.
# ⚠️ In einem EIGENEN Brueckenaufruf starten (LIESMICH, Falle 4); die Laeufe danach ueber tools/hinter.sh.
set -u
H=_to_delete/helfer/sicht_server; mkdir -p "$H"
stoppe() {
  for pid in $(netstat -ano | grep -a -E "127.0.0.1:876[56] " | grep -a -E 'ABH|LISTEN' | awk '{print $NF}' | sort -u); do
    taskkill //PID "$pid" //F > /dev/null 2>&1 || kill "$pid" 2> /dev/null
  done
}
case "${1:-}" in
  start)
    stoppe
    rm -rf "$H/altstand"; mkdir -p "$H/altstand"
    if ! git archive HEAD v2 | tar -x -C "$H/altstand"; then echo "ABBRUCH: git archive"; exit 1; fi
    w() { if command -v cygpath > /dev/null; then cygpath -w "$1"; else printf '%s' "$1"; fi; }
    w "$PWD/v2" > "$H/neu.zeiger"; w "$PWD/$H/altstand/v2" > "$H/alt.zeiger"
    ( python3 tools/sichtpruefung/dienst.py "$H/neu.zeiger" 8765 > "$H/neu.log" 2>&1 & )
    ( python3 tools/sichtpruefung/dienst.py "$H/alt.zeiger" 8766 > "$H/alt.log" 2>&1 & )
    sleep 2; rc=0
    js="$(grep -o 'index-[A-Za-z0-9_-]*\.js' v2/index.html | head -1)"
    for p in 8765 8766; do
      c="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$p/assets/$js")"
      echo "Port $p: /assets/$js -> $c"; [ "$c" = 200 ] || rc=1
    done
    [ $rc = 0 ] && echo "BEREIT: neu http://127.0.0.1:8765/  alt http://127.0.0.1:8766/" || echo "ABBRUCH: ein Server liefert die App nicht aus"
    exit $rc ;;
  stop) stoppe; echo "gestoppt" ;;
  *) echo "Aufruf: bash tools/sichtpruefung/server.sh start|stop"; exit 2 ;;
esac
