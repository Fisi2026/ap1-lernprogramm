# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e2c) KEINE VON HAND GEPFLEGTEN ZEILENZAHLEN IN START_PROMPT.md
  # ⚠️ ANLASS 27.08.2026: In der Uebergabe stand "BUILD_LOG.md (406 Zeilen)" - einen Tag spaeter
  #    waren es 500. Solche Zahlen altern zwischen zwei Commits, und niemand merkt es.
  #    ►► Sie werden nicht nachgehalten, sondern VERBOTEN. Wer die Zahl braucht, ruft wc -l auf.
  #    Die Zeilenbudgets der Steuerdateien meldet dieses Skript ohnehin am Ende selbst.
  # ⚠️ ERWEITERT 02.09.2026 auf TASKLIST.md. Anlass: in docs/archiv/PLAENE.md stand "(1821 Zeilen)", die Datei
  #    hatte 1849 - in genau der Datei, deren Kopf vor handgepflegten Zahlen warnt.
  # ⛔ GEMESSEN, WELCHE DATEIEN DAS MUSTER TRAGEN, BEVOR DER GUARD AUSGEWEITET WURDE:
  #    BUILD_LOG.md (3), BUILD_LOG_ARCHIV.md (10), TASKLIST_ARCHIV.md (10), docs/befunde/BEFUNDE_FAELLE.md (1),
  #    ETAPPE3_M07/M08_BEFUNDE.md (je 1), docs/archiv/PLAENE.md (4). ►► In einer CHRONIK ist eine Zeilenzahl
  #    ein Messwert von DAMALS und voellig richtig - dort waere der Guard eine Fessel, keine
  #    Sicherung. Bewacht werden nur die LEBENDEN Steuerdateien, in denen eine Zahl eine Aussage
  #    ueber JETZT ist. docs/archiv/PLAENE.md gehoert bewusst NICHT dazu: sein eigener Kopf erklaert alle
  #    Zahlen darin zu Messwerten von damals, und drei seiner vier Treffer sind genau das
  #    (Kursdateigroessen im Etappenplan). Die vierte, die self-referenzielle, ist gestrichen.
  local ZD ZZ
  for ZD in START_PROMPT.md TASKLIST.md; do
    [ -f "$ZD" ] || continue
    ZZ="$(grep -aoE '\([0-9]{2,4} (Zeilen|Z\.)\)' "$ZD" | head -3 | tr '\n' ' ')"
    if [ -n "$ZZ" ]; then
      melde "Stand-Guard: handgepflegte Zeilenzahl in $ZD: $ZZ - streichen, nicht nachziehen"
    else
      ok "$ZD ohne handgepflegte Zeilenzahlen"
    fi
  done

