# shellcheck shell=bash
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e3) FIRMEN-EIGENNAMEN – FEHLER bei ASCII-Umschrift oder zwei Schreibweisen derselben Firma.
  # ⚠️ ANLASS 25.08.2026: Der Nutzer hat am 27.07. entschieden, dass Umlaute AUCH in Firmen-
  #    Eigennamen korrigiert werden. Vier Wochen spaeter standen immer noch 37 Namen in ASCII-
  #    Umschrift ("Getraenkelogistik", "Konstruktionsbuero", "Quakenbrueck") - und ZWEI Firmen
  #    trugen im selben Pool beide Schreibungen (Weissger Sanitaer-/Sanitärtechnik, Vierkoetter/
  #    Vierkötter). Genau daran sieht man, dass es ein Rest ist und keine Absicht.
  #    ►► Ein Entscheid, den niemand nachmisst, zerfaellt. Also misst ihn jetzt ein Skript.
  # ⚠️ FEHLER, nicht Hinweis: die Messung hat eine sichtbare Ausnahmeliste (Itzehoer, Lohraer)
  #    und laesst Silbengrenzen ("Brauerei", "Bauelemente", "Steuerberatung") sowie deutsche
  #    Ortsnamen auf Ue-/Oe-/Ae- (Uetersen, Uelzen, Oelde) bewusst aus. Meldet sie doch etwas,
  #    ist entweder ein Name falsch geschrieben oder die Ausnahmeliste braucht einen Eintrag -
  #    beides gehoert entschieden, nicht ueberlesen.
  FI="$(node tools/pool_query.js firmen 2>/dev/null)"
  FI_A="$(printf '%s' "$FI" | sed -n 's/^A) ASCII-Umschrift.*: \([0-9]*\)$/\1/p')"
  FI_B="$(printf '%s' "$FI" | sed -n 's/^B) DIESELBE FIRMA IN ZWEI SCHREIBWEISEN: \([0-9]*\)$/\1/p')"
  FI_N="$(printf '%s' "$FI" | sed -n 's/^Firmen-Eigennamen in der Auswahl: \([0-9]*\).*/\1/p')"
  if [ -z "$FI_A" ] || [ -z "$FI_B" ]; then
    melde "Firmen-Guard: 'pool_query.js firmen' liefert keine auswertbare Zahl - Werkzeug pruefen"
  elif [ "$FI_A" -gt 0 ] || [ "$FI_B" -gt 0 ]; then
    melde "Firmen-Eigennamen: $FI_A in ASCII-Umschrift, $FI_B Firma(en) in zwei Schreibweisen (Entscheid 27.07.: Umlaute auch in Firmennamen) - 'node tools/pool_query.js firmen'"
  else
    ok "Firmen-Eigennamen (${FI_N:-?} geprueft, keine ASCII-Umschrift, keine Doppelschreibung)"
  fi

