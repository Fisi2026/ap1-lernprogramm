# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e8) DIE LOESUNG STEHT IM AUFGABENTEXT - HINWEIS, KEIN FEHLER (neu 27.08.2026)
  # ⚠️ ANLASS: FALL-01 b) nannte "KundenID (Primaerschluessel)" und fragte danach, was KundenID
  #    sei. FALL-03 d) schrieb "(alle Aenderungen seit letzter VOLLsicherung)" und fragte nach
  #    "differentiell". Beide Schwierigkeit 3. Der Filter fand im Fragenpool 12 weitere; nach
  #    Einzelpruefung waren 11 echt, einer schwach - alle durch Umformulieren des AUFGABENTEXTS
  #    behoben, ohne eine einzige Antwort zu aendern. Stand danach: 0.
  # ⛔ BEWUSST KEIN 'melde' UND BEWUSST KEINE AUSNAHMELISTE. Der Filter kann Fehlalarme haben
  #    (dasselbe Wort in anderer Rolle). Ein FEHLER wuerde zu einer Ausnahmeliste fuehren - und
  #    genau die hat in diesem Projekt dreimal die Fundstelle des Fehlers stillgestellt
  #    (begriffe, zitate_belegt.json, laengen_ausnahmen.json). Ein Hinweis zwingt zum Lesen,
  #    ohne zum Ausnehmen zu verfuehren.
  if [ -f tools/pool_query.js ]; then
    local VR VR_N
    VR="$(node tools/pool_query.js verrat 2>/dev/null)"
    VR_N="$(printf '%s' "$VR" | sed -n 's/^LOESUNGSWORT STEHT WOERTLICH IM AUFGABENTEXT: \([0-9]*\).*/\1/p')"
    # B152 (10.09.2026, W1 Etappe E): HIER FEHLTE DER WERKZEUG-STUMM-ZWEIG. Lieferte
    # `pool_query.js verrat` nichts Auswertbares - abgestuerzt, umbenannt, Ausgabeformat
    # geaendert -, blieb $VR_N leer, die Bedingung `-n` war falsch und der Lauf meldete
    # `[ok] Loesungswort im Aufgabentext (0 dropdown-Luecken)`. **Gruen ueber Ungeprueftes,
    # mit einer Zahl, die nie gemessen wurde.** An den Originalzeilen nachgewiesen, bevor
    # der Zweig kam. Die sechs anderen Pool-Waechter hatten ihn seit jeher - dieser als
    # einziger nicht, weil er ein HINWEIS-Waechter ist und beim Bauen keiner der anderen
    # Vorlage folgte. ►► `tools/waechter_zusicherung.py` haelt das jetzt fuer alle sieben fest.
    # ⚠️ Ein stummes Werkzeug ist FEHLER, auch wenn der Befund selbst nur ein Hinweis ist:
    #    der Hinweis ist verhandelbar, seine Messung nicht.
    if [ -z "$VR_N" ]; then
      melde "Verrat-Guard: 'node tools/pool_query.js verrat' liefert keine auswertbare Zahl - Werkzeug pruefen"
    elif [ "$VR_N" -gt 0 ]; then
      echo "[hinweis] $VR_N dropdown-Luecke(n) nennen ihr Loesungswort im Aufgabentext."
      echo "          Am 27.08. waren es 0. Jeden Treffer EINZELN lesen (Fehlalarme moeglich),"
      echo "          dann den AUFGABENTEXT umformulieren - nie die Antwort aendern:"
      echo "          node tools/pool_query.js verrat"
    else
      ok "Loesungswort im Aufgabentext ($VR_N dropdown-Luecken)"
    fi
  fi

