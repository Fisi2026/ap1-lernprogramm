# shellcheck shell=bash
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e4) GESETZESZITATE UND ABSATZANGABEN – FEHLER. Quelle: zitate_belegt.json (26.08.2026).
  # ⚠️ ANLASS: Der Pool gab an fuenf Stellen Gesetzestext in Anfuehrungszeichen wieder. DREI davon
  #    waren keine Zitate, sondern Paraphrasen im Zitatgewand: Art. 32 DSGVO (M06-203) mit drei
  #    inhaltlichen Abweichungen, ein in § 14 BBiG ueberhaupt nicht existierender Satz (M08-609)
  #    und "Die Schriftform wird nicht durch elektronische Form ersetzt" (M08-603). Ein viertes
  #    gab Art. 9 Abs. 3 GG mit "zu beeintraechtigen" statt "zu behindern" wieder (M08-614).
  #    ►► Ein Zitat ist eine Tatsachenbehauptung ueber den Wortlaut. Es stimmt oder es stimmt nicht.
  # ⚠️ TEIL B hat einen eigenen Anlass: M08-603 stand seit dem 28.07. mit der Korrektur "§ 623 BGB"
  #    im Pruefprotokoll - angekommen war sie nur in der ANTWORTOPTION. Vier weitere Fundstellen
  #    trugen weiter "Abs. 1", der verweis sogar einen erfundenen "Abs. 2". Eine Korrektur gilt
  #    erst, wenn sie im Pool gemessen ist, nicht wenn sie im Protokoll steht.
  # ⚠️ Wer ein neues Zitat schreibt, schlaegt es einmal nach (WebFetch) und traegt es ein.
  # ⚠️⚠️ HIER STAND BIS ZUM 27.08.2026: "Das Skript kann einen Wortlaut nicht pruefen." Das war
  #    falsch - `zitat_beginnt` lag seit dem 26.08. in der Belegdatei und wurde nur nicht gelesen.
  #    Der Satz hat die Luecke als unvermeidlich beschrieben, statt sie zu schliessen: eine
  #    verfaelschte Fassung von Art. 32 DSGVO lief durch. ►► Eine dokumentierte Grenze ist eine
  #    Behauptung ueber das Werkzeug - und die altert wie jede andere.
  ZI="$(node tools/pool_query.js zitate 2>/dev/null)"
  ZI_U="$(printf '%s' "$ZI" | sed -n 's/^A) UNBELEGT: \([0-9]*\)$/\1/p')"
  ZI_V="$(printf '%s' "$ZI" | sed -n 's/^A) EINTRAEGE OHNE FUNDSTELLE: \([0-9]*\)$/\1/p')"
  ZI_N="$(printf '%s' "$ZI" | sed -n 's/^A) GESETZESZITATE IM POOL: \([0-9]*\)$/\1/p')"
  ZI_B="$(printf '%s' "$ZI" | sed -n 's/^B) SUMME: \([0-9]*\)$/\1/p')"
  ZI_W="$(printf '%s' "$ZI" | sed -n 's/^A) WORTLAUT GEAENDERT: \([0-9]*\)$/\1/p')"
  if [ -z "$ZI_U" ] || [ -z "$ZI_B" ] || [ -z "$ZI_V" ]; then
    melde "Zitat-Guard: 'pool_query.js zitate' liefert keine auswertbare Zahl - Werkzeug pruefen"
  elif [ "${ZI_W:-0}" -gt 0 ]; then
    melde "Gesetzeszitate: bei $ZI_W belegtem Zitat hat sich der Wortlaut geaendert - neu nachschlagen ('node tools/pool_query.js zitate')"
  elif [ "$ZI_U" -gt 0 ]; then
    melde "Gesetzeszitate: $ZI_U unbelegt - Wortlaut nachschlagen und in zitate_belegt.json eintragen ('node tools/pool_query.js zitate')"
  elif [ "$ZI_B" -gt 0 ]; then
    melde "Absatzangabe zu einer Vorschrift OHNE Absaetze ($ZI_B Fundstelle(n)) - 'node tools/pool_query.js zitate'"
  elif [ "$ZI_V" -gt 0 ]; then
    melde "Zitat-Guard: $ZI_V Eintrag/Eintraege in zitate_belegt.json ohne Fundstelle im Pool - Liste pflegen"
  else
    ok "Gesetzeszitate (${ZI_N:-?} belegt, keine Absatzangabe zu absatzlosen Vorschriften)"
  fi

