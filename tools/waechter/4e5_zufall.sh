# shellcheck shell=bash
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e5) ZUFALLSAUFGABEN – FEHLER bei negativen oder ungueltigen Zwischenergebnissen (26.08.2026).
  # ⚠️ ANLASS: M07-760 nannte das Ergebnis in erklaerungKurz und erklaerungLang fest
  #    "Kostenueberschreitung". Die Bereiche von sollk (18-32 T EUR) und istk (16-35 T EUR)
  #    ueberlappen aber - in 47 % aller Ziehungen ist die Abweichung NEGATIV, und dann stand da
  #    "-10.500 EUR Kostenueberschreitung". Gleicher Tag, gleicher Befundtyp: M06-542 zog "tage"
  #    und "wochen" unabhaengig und setzte sie im Text gleich ("28 Tage (2 Wochen)").
  #    ►► EINE RANDOMISIERTE AUFGABE KANN MAN NICHT LESEN, MAN MUSS SIE DURCHRECHNEN. Beim Lesen
  #       sieht M06-542 stimmig aus; die Werte, die sie zerlegen, entstehen erst beim Wuerfeln.
  # ⚠️ DIE PROBE WUERFELT NICHT (Lehre "eine Pruefung, die wuerfelt, ist keine Pruefung"):
  #    Der Variablenraum wird VOLLSTAENDIG durchgerechnet, wo er unter 20000 Faellen bleibt -
  #    sonst ueber alle Eckpunkte plus Mitte. Stand 26.08.: 27 Aufgaben, 17429 Faelle.
  # ⚠️ Ein negatives Zwischenergebnis ist nicht per se falsch - eine Abweichung DARF negativ sein.
  #    Deshalb hat die Probe eine sichtbare Ausnahmeliste IM WERKZEUG (wie beim Firmen-Waechter).
  ZU="$(node tools/pool_query.js zufall 2>/dev/null)"
  ZU_A="$(printf '%s' "$ZU" | sed -n 's/^AUFFAELLIG: \([0-9]*\)$/\1/p')"
  ZU_N="$(printf '%s' "$ZU" | sed -n 's/^ZUFALLSAUFGABEN (rechenassistent): \([0-9]*\),.*/\1/p')"
  ZU_F="$(printf '%s' "$ZU" | sed -n 's/^ZUFALLSAUFGABEN (rechenassistent): [0-9]*, gepruefte Faelle: \([0-9]*\)$/\1/p')"
  if [ -z "$ZU_A" ] || [ -z "$ZU_N" ]; then
    melde "Zufall-Guard: 'pool_query.js zufall' liefert keine auswertbare Zahl - Werkzeug pruefen"
  elif [ "$ZU_A" -gt 0 ]; then
    melde "Zufallsaufgaben: $ZU_A Aufgabe(n) mit negativem oder ungueltigem Zwischenergebnis - 'node tools/pool_query.js zufall'"
  else
    ok "Zufallsaufgaben (${ZU_N:-?} Aufgaben, ${ZU_F:-?} Faelle deterministisch durchgerechnet)"
  fi

