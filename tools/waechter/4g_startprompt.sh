# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4g) START_PROMPT: UMFANG IN ZEICHEN + PFLICHT-TABELLE (umgestellt 17.09.2026)
  # ⚠️ ANLASS 28.07.2026: Die Datei wurde am 27.07. umgebaut, WEIL sie durch Anhaengen unlesbar
  #    geworden war; sie wird in JEDEM neuen Chat vollstaendig gelesen.
  # ⛔ ANLASS 17.09.2026: Der alte Deckel zaehlte ZEILEN (600) – die Datei hielt ihn ein und war
  #    trotzdem 54 KB gross. Gemessen wird jetzt in Byte: ab 36 KB HINWEIS, ab 40 KB FEHLER.
  #    Dazu die Tabelle "PFLICHT: … → `DATEI`" (Abschnitt 6), die einzige Bruecke zu LEHREN.md und
  #    WERKZEUGE.md: fehlt sie oder zeigt sie ins Leere, ist das ein FEHLER.
  #    Begruendung, Ausgabeformat und Gegenproben: tools/steuer_umfang.sh, BUILD_LOG 17.09.
  local SU
  SU="$(bash tools/steuer_umfang.sh 2>/dev/null)"
  if [ -z "$SU" ]; then
    melde "START_PROMPT-Umfang: tools/steuer_umfang.sh liefert nichts - Werkzeug stumm"
  else
    while read -r URTEIL ART A1 A2 A3 REST; do
      case "$URTEIL $ART" in
        "OK UMFANG")      ok "START_PROMPT-Umfang ($A1 Byte, Hinweis ab $A2, Fehler ab $A3)" ;;
        "HINWEIS UMFANG") echo "[hinweis] START_PROMPT.md hat $A1 Byte (> $A2). Sie wird in JEDEM Chat gelesen -"
                          echo "          Lehren nach LEHREN.md, Werkzeuge nach WERKZEUGE.md (tools/rotiere.py)." ;;
        "FEHLER UMFANG")  melde "START_PROMPT-Umfang: $A1 Byte (Grenze $A3) - auslagern mit tools/rotiere.py" ;;
        "OK PFLICHT")     ok "START_PROMPT-Pflichttabelle ($A1 Zeilen, $A2 Zieldateien vorhanden)" ;;
        "FEHLER PFLICHT") melde "START_PROMPT-Pflichttabelle kaputt: $A1 Zeilen (mind. 5), fehlende Ziele:${A3:+ $A3}${REST:+ $REST}" ;;
        "OK KERN")        ok "START_PROMPT-Kern ($A1 Zeilen, Grenze $A2 – N49 W1)" ;;
        "FEHLER KERN")    melde "START_PROMPT-Kern: $A1 Zeilen (Grenze $A2) - Bloecke nach regeln/*.md mit tools/rotiere.py" ;;
        "OK REGELN")      ok "Themendateien ($A1 regeln/*.md, alle in der Pflichttabelle)" ;;
        "FEHLER REGELN")  melde "Themendatei ohne Zeile in der Pflichttabelle:${A2:+ $A2}${A3:+ $A3}${REST:+ $REST}" ;;
        *)                melde "START_PROMPT-Umfang: unbekannte Ausgabe '$URTEIL $ART'" ;;
      esac
    done <<< "$SU"
  fi
