# shellcheck shell=bash
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e2) VERWEIS-ZIELE – FEHLER, wenn ein Verweis ins Leere zeigt; HINWEIS bei duennem Treffer.
  # ⚠️ ANLASS 25.08.2026: An diesem Tag wurden 185 falsche `verweis`-Ziele korrigiert und
  #    134 fehlende nachgetragen. Danach war der Pool sauber - und NICHTS haette gemerkt, wenn
  #    ein spaeterer Griff das wieder zerschiesst. Die Kursdateien 0X_*.md sind von KEINER Suite
  #    abgedeckt: sie gehoeren nicht zur App, also faellt kein Test, wenn ein Abschnitt umbenannt
  #    oder geloescht wird - waehrend hunderte Verweise darauf zeigen.
  #    ►► Dieselbe Lehre wie beim BUILD_LOG: eine Regel, die ein Skript meldet, wird befolgt.
  # ⚠️ Die Stichwortprobe ist bewusst nur ein HINWEIS (kalibriert am 24.08., ~1,4 % Restmeldungen
  #    sind erklaerbare Komposita). Ein FEHLER ist nur der harte Fall: Abschnitt existiert nicht.
  if [ -f tools/e3_gegenprobe.py ]; then
    VW="$(python3 tools/e3_gegenprobe.py --alle 2>/dev/null)"
    VW_LEER="$(printf '%s' "$VW" | grep -c 'ABSCHNITT EXISTIERT NICHT' || true)"
    VW_OHNE="$(printf '%s' "$VW" | sed -n 's/^Ohne jeden Stichwort-Treffer: \([0-9]*\).*/\1/p')"
    VW_GES="$(printf '%s' "$VW" | sed -n 's/^POOLWEIT geprueft: \([0-9]*\).*/\1/p')"
    if [ "${VW_LEER:-0}" -gt 0 ]; then
      melde "Verweis-Ziele: $VW_LEER Verweis(e) zeigen auf einen Abschnitt, den es NICHT gibt"
    else
      ok "Verweis-Ziele (${VW_GES:-?} geprueft, kein Verweis zeigt ins Leere)"
    fi
    # 4e2f) VERWEISE DER KURSDATEIEN UNTEREINANDER (B131-Klasse)
    # ⚠️ ANLASS 04.09.2026: Abschnitt 3.1 endete mit "Welcher Schicht des OSI-Modells welches
    #    Geraet zugeordnet ist, steht in Abschnitt 3.2" - und in 3.2 stand es nicht. Der
    #    Verweis-Guard darueber prueft nur POOL -> Kursdatei; KURSDATEI -> KURSDATEI war
    #    unbewacht. Heute 10 solche Verweise, 0 zeigen ins Leere.
    # ⛔ NUR DIE EXISTENZ WIRD ROT. Die Stichwortquote traegt nachweislich nicht: der defekte
    #    Zustand von B131 lag bei 50 %, zwei gesunde Verweise liegen ebenfalls bei 50 %.
    #    Begruendung mit Messwerten in tools/e3_gegenprobe.py, Funktion interne_verweise.
    IV="$(python3 tools/e3_gegenprobe.py --intern 2>/dev/null)"
    IV_LEER="$(printf '%s' "$IV" | sed -n 's/^Ziel existiert nicht: \([0-9]*\).*/\1/p')"
    IV_GES="$(printf '%s' "$IV" | sed -n 's/^INTERN geprueft: \([0-9]*\).*/\1/p')"
    if [ "${IV_LEER:-0}" -gt 0 ]; then
      melde "Interne Verweise: $IV_LEER Verweis(e) der Kursdateien zeigen auf einen Abschnitt, den es NICHT gibt"
    else
      ok "Interne Verweise (${IV_GES:-?} Kursdatei-Verweise geprueft, keiner zeigt ins Leere)"
    fi

    if [ "${VW_OHNE:-0}" -gt 25 ]; then
      echo "[hinweis] $VW_OHNE von ${VW_GES:-?} Verweisen finden kein Stichwort im Zielabschnitt (> 25)."
      echo "          Am 25.08. waren es 13. Ein Sprung heisst: ein Abschnitt wurde umbenannt"
      echo "          oder eine neue Fragengruppe zeigt ins Ungefaehre. Pruefen mit:"
      echo "          python3 tools/e3_gegenprobe.py --alle"
    fi
  fi

