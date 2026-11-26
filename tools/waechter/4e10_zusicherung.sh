# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e10) HAT JEDER POOL-WAECHTER SEINE BEIDEN ZWEIGE? (neu 10.09.2026, W1 Etappe E)
  # ⚠️ ANLASS: Etappe E wollte die sieben Pool-Waechter hinter EINE Funktion legen. Nachgemessen
  #    spart das rund 20 von 114 Codezeilen und hinterlaesst zwei Arten, einen Waechter zu
  #    schreiben - dieselbe Rechnung, an der der Plan selbst F1 gestrichen hat. E1 IST GESTRICHEN.
  # ►►► WAS DIE VEREINHEITLICHUNG WIRKLICH WERT WAR, STEHT HIER: nicht die gleiche FORM, sondern
  #    die gleichen ZUSICHERUNGEN. Jeder Waechter braucht (1) einen Zweig fuer "Werkzeug stumm"
  #    und (2) einen ok-Zweig. Fehlt (1), laeuft eine leere Ausgabe in den ok-Zweig - gruen ueber
  #    Ungeprueftes. Fehlt (2), ist eine bestandene Pruefung von einer uebersprungenen nicht zu
  #    unterscheiden. B152: 4e8 hatte (1) nicht und meldete bei stummem Werkzeug
  #    "[ok] Loesungswort im Aufgabentext (0 dropdown-Luecken)" - an den Originalzeilen belegt.
  # ⚠️ Der Selbsttest laeuft MIT: eine Gegenprobe braucht selbst eine Zusicherung, dass sie
  #    stattgefunden hat (dieselbe Lehre wie tools/sabotage.sh).
  if [ -f tools/waechter_zusicherung.py ]; then
    local WZ_S WZ WZ_N WZ_F
    WZ_S="$(python3 tools/waechter_zusicherung.py --selbsttest 2>&1)"
    if ! printf '%s' "$WZ_S" | grep -q "^Selbsttest: alle"; then
      melde "Waechter-Zusicherung: ihr eigener Selbsttest faellt durch - ihrem Urteil ist nicht zu trauen"
    fi
    WZ="$(python3 tools/waechter_zusicherung.py 2>&1)"
    # ⚠️ AWK STATT SED MIT RUECKVERWEISEN: die erste Fassung benutzte   in einer
    #    sed-Ersetzung. Auf dem Weg durch die Werkzeugbruecke verlor der Backslash eine
    #    Ebene, aus den Rueckverweisen wurden zwei unsichtbare Steuerzeichen, und der
    #    Ausdruck lieferte Muell statt zweier Zahlen. Gefunden, weil die Zeile nachgelesen
    #    wurde - der Lauf haette es als "keine auswertbare Zahl" gemeldet und nicht als das,
    #    was es war. ►► Ausdruecke ohne Backslash sind hier nicht Geschmack, sondern Vorsicht.
    WZ_N="$(printf '%s' "$WZ" | awk '/Waechter-Bloecke geprueft,/{print $1}')"
    WZ_F="$(printf '%s' "$WZ" | awk -F'geprueft, ' '/Waechter-Bloecke geprueft,/{split($2,a," ");print a[1]}')"
    if [ -z "$WZ_N" ] || [ -z "$WZ_F" ]; then
      melde "Waechter-Zusicherung: 'python3 tools/waechter_zusicherung.py' liefert keine auswertbare Zahl - Werkzeug pruefen"
    elif [ "$WZ_F" -gt 0 ]; then
      melde "Waechter-Zusicherung: $WZ_F von $WZ_N Waechter-Bloecken fehlt ein Zweig ($(printf '%s' "$WZ" | awk -F': ' '/^LUECKEN:/{print $2}')) - 'python3 tools/waechter_zusicherung.py'"
    else
      ok "Waechter-Zusicherung ($WZ_N Pool-Waechter, jeder mit Werkzeug-stumm- und ok-Zweig)"
    fi
  else
    melde "Waechter-Zusicherung: tools/waechter_zusicherung.py fehlt"
  fi

