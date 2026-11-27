# shellcheck shell=bash
# Teil von check.sh - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4g2) ENTSCHEIDE: JEDE NUMMER GENAU EINMAL (N49 W3, 11.10.2026, Nutzer-Entscheid 10.10.)
  # Jeder Entscheid E001... je eine Datei in entscheide/ (ADR-Muster; E1–E71 seit 27.11.2026, BUILD_LOG 305).
  # Doppelte Nummer, Luecke oder Datei ohne Status/Kontext/Entscheid/Folgen = FEHLER.
  # Gegenprobe: python3 tools/entscheide.py --probe (drei Kaputt-Faelle, je FEHLER erwartet).
  # (ohne `local`: shellcheck SC2168 – die Datei wird gesourct, nicht als Funktion gelesen; CI zaehlte 108 -> 110, BUILD_LOG 144)
  EU="$(python3 tools/entscheide.py 2>/dev/null)"
  case "$EU" in
    OK*)     read -r _ EA EB <<< "$EU"; ok "Entscheide ($EA Nummern, hoechste E$EB, je genau einmal)" ;;
    FEHLER*) melde "Entscheide: ${EU#FEHLER }" ;;
    *)       melde "Entscheide: tools/entscheide.py liefert '${EU:-nichts}' - Werkzeug stumm" ;;
  esac
