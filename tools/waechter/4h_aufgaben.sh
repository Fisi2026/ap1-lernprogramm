# shellcheck shell=bash
# Teil von check.sh - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
# 4h) 'Damit offen' im letzten BUILD_LOG-Eintrag = aus aufgaben.json erzeugt (BUILD_LOG 304, Entscheid R7).
#     Drei Urteile: 0 gleich, 1 Abweichung, 2 stumm (Quelle unlesbar) - beide ungleich 0 sind rot.
if [ -f tools/offen.py ]; then
  AU="$(python3 tools/offen.py --pruefe 2>&1)"; AU_RC=$?
  if [ "$AU_RC" -ne 0 ] || [ -z "$AU" ]; then melde "${AU:-Aufgaben: Werkzeug stumm}"; else ok "$AU"; fi
else
  melde "Aufgaben: tools/offen.py fehlt"
fi
