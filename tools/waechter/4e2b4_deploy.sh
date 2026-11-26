# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e2b4) WAS LIEGT NACH DEM DEPLOY AUF DEM SERVER, UND WOZU?
  # ⚠️ ANLASS 07.09.2026: `.assetsignore` haelt `.git`, Skripte, Tests und Doku vom Server fern -
  #    aber gemessen hat nie jemand, was ueberhaupt oben landet. Gemessen: von 64 ausgelieferten
  #    Dateien (6018 KB) sind 37 (2871 KB) von der App nicht erreichbar - fast die Haelfte.
  #    Groesster Posten: pool/*.json (2432 KB), also die QUELLE von fragen.js, das die App
  #    ohnehin laedt. Dazu batches_m09/, ein .pyc und push_von_hier.bat.
  #    Nutzer-Entscheid 07.09.: das Loch wird geschlossen, `.assetsignore` nennt jetzt auch
  #    pool/, batches_m09/, die Waechter-Datendateien, *.pyc, *.bat und die git-Konfiguration.
  #    Danach gemessen: 27 Dateien, 3048 KB - und NULL unerreichbare. Die Ratsche steht auf null.
  # ⛔ ROT AB DER ERSTEN UNERREICHBAREN DATEI. Zwei Wege, sie wieder gruen zu bekommen: entweder
  #    die Datei gehoert zur App - dann in APP_FILES aufnehmen oder von dort aus verweisen -,
  #    oder sie gehoert nicht dazu und wird in `.assetsignore` genannt. Ein dritter Weg ist kein
  #    ⚠️ SEIT N29 (E44/E45): gemessen wird nur noch der Auslieferungsordner `v2/`; die Wurzel-`.assetsignore`
  #    ist Sicherheitsnetz. Faellt `wrangler.jsonc` auf "." zurueck, meldet deploy_inhalt.py rc 2.
  #    Weg: eine Datei, die weder die App braucht noch jemand ausschliesst, hat auf dem Server
  #    nichts verloren. Begruendung und Beleg in tools/deploy_inhalt.py.
  if [ -f tools/deploy_inhalt.py ]; then
    local DEP
    DEP="$(python3 tools/deploy_inhalt.py --pruefe 2>/dev/null)"
    # shellcheck disable=SC2086  # gewollt: Ausgabe in Felder zerlegen (N45 W1)
    set -- ${DEP:-}
    if [ "${1:-}" = "DEPLOY" ]; then
      if [ "${4:-0}" -gt 0 ]; then
        melde "Deploy-Inhalt: ${4} Datei(en) mit ${5} KB liegen auf dem Server, ohne dass die App sie holt - 'python3 tools/deploy_inhalt.py'"
      else
        ok "Deploy-Inhalt (${2:-?} Dateien, ${3:-?} KB, keine unerreichbare Datei)"
      fi
    else
      # ⛔ N29 (24.09.): vorher STUMM, wenn das Skript keine DEPLOY-Zeile lieferte (Abbruch, leerer
      #    Auslieferungsordner) - gruen an einer Stelle, an der nichts gemessen wurde.
      melde "Deploy-Inhalt: keine Messung - '${DEP:-leere Ausgabe}' ('python3 tools/deploy_inhalt.py')"
    fi
  fi

