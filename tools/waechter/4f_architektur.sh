# shellcheck shell=bash
# Teil von check.sh (N43 M2, E67) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
# 4f-architektur) N43 M2 (14.10.2026, BUILD_LOG 170): SCHICHTREGELN mit dependency-cruiser (.tooling/, typescript@6) -
#    Regeln in tools/architektur_regeln.cjs: keine Zyklen · kern/ ohne Oberflaeche/Pool-Laden/React zur Laufzeit ·
#    server/ nur kern/pruefe + kern/route. Erst die Probe (tools/architektur_probe/, 6 bekannte Verstoesse, 3 erlaubte
#    Faelle), dann der echte Baum. Ersetzt kern/architektur.test.ts (Regex, liess 5 von 12 verbotenen Sabotagen durch).
#    Werkzeug fehlt -> ROT (stumm), nicht gruen: cd .tooling && npm ci.
if [ ! -f tools/architektur.py ]; then
  melde "Architektur: tools/architektur.py fehlt - Waechter stumm"
else
  AR_P="$(python3 tools/architektur.py --probe 2>&1)"; AR_PRC=$?
  AR="$(python3 tools/architektur.py 2>&1)"; AR_RC=$?
  if [ "$AR_PRC" -ne 0 ]; then
    melde "Architektur: Probe faellt ($(printf '%s' "$AR_P" | tail -1 | cut -c1-200)) - 'python3 tools/architektur.py --probe'"
  elif [ "$AR_RC" -eq 2 ]; then
    melde "Architektur: Werkzeug stumm ($(printf '%s' "$AR" | head -1 | cut -c1-200))"
  elif [ "$AR_RC" -ne 0 ]; then
    melde "Architektur: $(printf '%s' "$AR" | grep '^VERSTOSS' | tr '\n' ' ' | cut -c1-400)"
  else
    ok "Architektur ($(printf '%s' "$AR" | tail -1 | sed 's/^ARCH: //'), Probe 6/6)"
  fi
fi
