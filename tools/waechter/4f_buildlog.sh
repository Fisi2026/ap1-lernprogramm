# shellcheck shell=bash
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4f) BUILD_LOG-Laenge – HINWEIS, KEIN FEHLER.
  # ⚠️ ANLASS 28.07.2026: Der Kopf von BUILD_LOG.md traegt seit dem 26.07. die Regel "nach jedem
  #    Release rotieren". Danach gingen SECHS Releases durch, ohne dass rotiert wurde; die Datei
  #    stand bei 2360 Zeilen und wurde in jedem neuen Chat mitgeschleppt.
  #    ►► Eine Regel, die nur in einem Dateikopf steht, wird nicht befolgt.
  # ⚠️ BEWUSST KEIN 'melde': Ein rotes check.sh wegen Doku-Laenge blockiert Releases aus einem
  #    Grund, der nichts mit dem Code zu tun hat - und wird nach zwei Malen weggeklickt.
  #    Ein Hinweis im Bericht ist nicht uebersehbar und kostet nichts.
  BLZ="$(wc -l < BUILD_LOG.md 2>/dev/null || echo 0)"
  if [ "$BLZ" -gt 900 ]; then
    echo "[hinweis] BUILD_LOG.md hat $BLZ Zeilen (> 900). Nach dem naechsten Release rotieren:"
    echo "          alles bis zum letzten Release-Eintrag nach BUILD_LOG_ARCHIV.md, Kopf nachziehen."
  else
    ok "BUILD_LOG-Laenge ($BLZ Zeilen, Rotationsgrenze 900)"
  fi

