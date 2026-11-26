# shellcheck shell=bash
# Teil von check.sh (N43 M1, E67) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
# 4f-qualitaet) N43 M1 (10.10.2026, BUILD_LOG 121): RATSCHEN FUER DIE CODE-QUALITAET - lizard (Komplexitaet,
#    Funktionslaenge), knip (Unbenutztes), ruff (tools/ ohne EXE), shellcheck (*.sh). Jede Zahl darf nur
#    SINKEN; die Grenzen stehen in tools/qualitaet_ratsche.json. Drei Urteile wie 4f-as. Der Selbsttest
#    prueft jedes Werkzeug an tools/ratsche_probe/ (bekannte Antwort), knip an neu/werkzeug/as_probe.
#    Werkzeuge fehlen -> ROT (Nutzer-Entscheid 10.10.: fest eingebunden): bash tools/einrichten.sh.
if [ ! -f tools/qualitaet_ratsche.py ]; then
  melde "Qualitaets-Ratsche: tools/qualitaet_ratsche.py fehlt - Waechter stumm"
else
  QR_S="$(python3 tools/qualitaet_ratsche.py --selbsttest 2>&1)"; QR_SRC=$?
  QR="$(python3 tools/qualitaet_ratsche.py 2>&1)"; QR_RC=$?
  QR_K="$(printf '%s' "$QR" | grep '^QR:')"
  if [ "$QR_SRC" -ne 0 ]; then
    melde "Qualitaets-Ratsche: Selbsttest faellt ($(printf '%s' "$QR_S" | tail -1 | cut -c1-300)) - 'python3 tools/qualitaet_ratsche.py --selbsttest', Werkzeuge: bash tools/einrichten.sh"
  elif [ "$QR_RC" -eq 2 ] || [ -z "$QR_K" ]; then
    melde "Qualitaets-Ratsche: Werkzeug stumm ($(printf '%s' "$QR" | head -1 | cut -c1-300))"
  elif [ "$QR_RC" -ne 0 ]; then
    melde "Qualitaets-Ratsche: $(printf '%s' "$QR" | grep '^GESTIEGEN' | tr '\n' ' ' | cut -c1-400)"
  else
    ok "Qualitaets-Ratsche (${QR_K#QR: }$(printf '%s' "$QR" | grep -q '^HINWEIS' && echo ' - GESUNKEN, Grenze nachziehen'))"
  fi
fi
