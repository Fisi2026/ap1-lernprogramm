#!/usr/bin/env bash
# tools/prueflauf.sh – den vollen Prueflauf fahren UND seine Dauer messen.
#
# WARUM ES DAS GIBT (Messung 07.09.2026): Arbeitsregel 6 schrieb den Block-Modus vor,
# begruendet mit "der volle check.sh passt NICHT in die 45 s der Sandbox". Gemessen:
#   voller Lauf   45 s in EINEM Aufruf
#   Block-Modus   61 s in VIER Aufrufen
# Das 45-s-Limit gab es zu dem Zeitpunkt nicht mehr - die Verbindung erlaubte 180 s.
# ⚠️ DIE REGEL WAR NICHT FALSCH, SIE WAR ALT. Genau die Klasse "Umgebungs-Annahmen sind
#    verderbliche Ware". Deshalb steht die Zahl jetzt NICHT in der Doku, sondern wird
#    gemessen: NUTZER-ENTSCHEID 07.09. - "am Anfang der Session einmal pruefen und dann
#    die Regel variabel halten".
#
# BENUTZUNG
#   bash tools/prueflauf.sh          # voller Lauf mit Zeitmessung, reicht den rc durch
#   bash tools/prueflauf.sh --stand  # nur melden, was zuletzt gemessen wurde
#
# ⛔ ES ERSETZT check.sh NICHT, es RUFT es auf. Der Rueckgabewert wird unveraendert
#    durchgereicht - ein roter Lauf bleibt rot.
# ⚠️ Der Messwert liegt in /tmp (ersatzweise im Sitzungs-HOME) und ist damit
#    SITZUNGSFLUECHTIG. Das ist Absicht: er soll je Sitzung neu erhoben werden, nicht
#    aus einer Datei geglaubt werden.

# ⚠️ ABLAGE JE BENUTZER GETRENNT (Befund 07.09.2026, zweite Sitzung): /tmp/ap1_prueflauf.env
#    lag von einem FREMDEN Benutzer da (nobody), der Stempel scheiterte mit "Permission denied" -
#    und `umgebung.sh` meldete danach in JEDER Sitzung "noch nicht gemessen", obwohl gemessen war.
#    Ein Werkzeug, dessen Ablage still fehlschlaegt, misst zwar, aber niemand erfaehrt es.
#    Deshalb: erster BESCHREIBBARER Kandidat gewinnt, und ein Fehlschlag wird LAUT gemeldet.
ablage_waehlen() {
  local k d
  for k in "${PRUEFLAUF_ABLAGE:-}" "/tmp/ap1_prueflauf_$(id -u).env" "$HOME/.ap1_prueflauf.env"; do
    [ -z "$k" ] && continue
    if [ -e "$k" ]; then
      [ -w "$k" ] && { printf '%s\n' "$k"; return 0; }
    else
      d=$(dirname "$k")
      [ -w "$d" ] && { printf '%s\n' "$k"; return 0; }
    fi
  done
  return 1
}
ABLAGE="$(ablage_waehlen)"
if [ -n "${PRUEFLAUF_ABLAGE:-}" ] && [ "$ABLAGE" != "$PRUEFLAUF_ABLAGE" ]; then
  echo "[prueflauf] PRUEFLAUF_ABLAGE=$PRUEFLAUF_ABLAGE ist nicht beschreibbar -> ${ABLAGE:-KEINE}" >&2
fi
RAHMEN="${PRUEFLAUF_RAHMEN:-180}"     # Zeitlimit eines Verbindungsaufrufs in Sekunden
MARGE="${PRUEFLAUF_MARGE:-120}"       # ab hier wieder Block-Modus (Sicherheitsabstand)
BEFEHL="${PRUEFBEFEHL:-bash check.sh}"

if [ "$1" = "--stand" ]; then
  # shellcheck source=/dev/null  # Ablage-Datei, Pfad zur Laufzeit (N45 W1)
  if [ -n "$ABLAGE" ] && [ -s "$ABLAGE" ]; then . "$ABLAGE"; echo "Pruflauf zuletzt gemessen: ${PL_SEK}s am ${PL_ZEIT} -> ${PL_RAT}"
  else echo "Pruflauf in dieser Sitzung NOCH NICHT gemessen -> ersten Lauf mit 'bash tools/prueflauf.sh' fahren"; fi
  exit 0
fi

S=$(date +%s)
$BEFEHL
RC=$?
E=$(date +%s)
D=$((E-S))

if [ "$D" -ge "$MARGE" ]; then
  RAT="BLOCK-MODUS (${D}s >= Marge ${MARGE}s bei Rahmen ${RAHMEN}s)"
else
  RAT="VOLLER LAUF am Stueck (${D}s, Marge ${MARGE}s, Rahmen ${RAHMEN}s)"
fi

if [ -n "$ABLAGE" ] && { echo "PL_SEK=$D"; echo "PL_ZEIT=\"$(date '+%Y-%m-%d %H:%M')\""; echo "PL_RAT=\"$RAT\""; } > "$ABLAGE" 2>/dev/null; then
  :
else
  echo "⚠️ MESSWERT NICHT ABGELEGT (kein beschreibbarer Pfad) - umgebung.sh meldet weiter 'nicht gemessen'." >&2
fi

echo "==================================="
echo "PRUEFLAUF: ${D}s, Rueckgabewert $RC"
echo "EMPFEHLUNG FUER DEN REST DER SITZUNG: $RAT"
[ "$D" -ge "$MARGE" ] && echo "  -> bash check.sh block start | weiter | ... | ende"
exit $RC
