# shellcheck shell=bash
# Teil von check.sh - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
# 4h) 'Damit offen' im letzten BUILD_LOG-Eintrag = aus aufgaben.json erzeugt (BUILD_LOG 304, Entscheid R7).
#     Drei Urteile: 0 gleich, 1 Abweichung, 2 stumm (Quelle unlesbar) - beide ungleich 0 sind rot.
#     Seit BUILD_LOG 311: geprueft wird der LETZTE Eintrag (genau eine Schlusszeile, als letzte Zeile), und die
#     eingebaute Probe (elf bekannte Faelle) laeuft vorher - faellt sie, ist der Waechter rot statt blind gruen.
if [ -f tools/offen.py ]; then
  AU_P="$(python3 tools/offen.py --probe 2>&1)"; AU_PRC=$?
  AU="$(python3 tools/offen.py --pruefe 2>&1)"; AU_RC=$?
  if [ "$AU_PRC" -ne 0 ]; then melde "Aufgaben: Probe faellt ($(printf '%s' "$AU_P" | grep -m1 '^FALSCH' | cut -c1-200)) - python3 tools/offen.py --probe"
  elif [ "$AU_RC" -ne 0 ] || [ -z "$AU" ]; then melde "${AU:-Aufgaben: Werkzeug stumm}"; else ok "$AU"; fi
else
  melde "Aufgaben: tools/offen.py fehlt"
fi
