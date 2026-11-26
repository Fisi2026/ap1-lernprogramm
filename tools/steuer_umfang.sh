#!/usr/bin/env bash
# tools/steuer_umfang.sh – UMFANG VON START_PROMPT IN ZEICHEN + DIE PFLICHT-TABELLE (17.09.2026)
#
# WARUM: Bis zum 17.09. war der Deckel 600 ZEILEN. Die Datei hielt ihn ein – und war trotzdem
#   54 KB gross (~15 000 Tokens in JEDEM Chat), weil die Zeilen immer laenger wurden. Die Kosten
#   entstehen je ZEICHEN. ►► Gemessen wird deshalb in Byte.
# UND: Seit dem 17.09. stehen Lehren und Werkzeuge in LEHREN.md / WERKZEUGE.md und werden nur
#   noch VOR dem betroffenen Griff gelesen. Die Tabelle "PFLICHT: … → `DATEI`" in START_PROMPT
#   Abschnitt 6 ist damit die einzige Bruecke dorthin. ⛔ Zeigt sie ins Leere oder fehlt sie, liest
#   niemand die Lehren mehr – das waere dieselbe Falle wie die Rotationsregel, die sechs Releases
#   lang nur im Dateikopf stand.
#
# AUSGABE (eine Zeile je Pruefung, fuer check.sh):
#   OK|HINWEIS|FEHLER UMFANG <byte> <hinweisgrenze> <fehlergrenze>
#   OK|FEHLER PFLICHT <anzahl_zeilen> <anzahl_ziele> [fehlende dateien…]
# ⚠️ Zwei Zweige, die man leicht vergisst, sind ABSICHT: fehlt START_PROMPT.md ganz, ist das
#    FEHLER (nicht "0 Byte, OK"); stehen weniger als 5 PFLICHT-Zeilen da, ist die Tabelle kaputt,
#    auch wenn alle genannten Dateien existieren.
cd "$(dirname "$0")/.." || exit 2
SP="${STEUER_DATEI:-START_PROMPT.md}"
HINWEIS=36000
GRENZE=40000
if [ ! -f "$SP" ]; then
  echo "FEHLER UMFANG 0 $HINWEIS $GRENZE"
  echo "FEHLER PFLICHT 0 0 $SP"
  exit 0
fi
B=$(wc -c < "$SP" | tr -d ' ')
if   [ "$B" -gt "$GRENZE" ];  then echo "FEHLER UMFANG $B $HINWEIS $GRENZE"
elif [ "$B" -gt "$HINWEIS" ]; then echo "HINWEIS UMFANG $B $HINWEIS $GRENZE"
else echo "OK UMFANG $B $HINWEIS $GRENZE"; fi

ZEILEN=$(grep -c '^#   PFLICHT:' "$SP")
# shellcheck disable=SC2016  # Backticks sind hier Suchtext, keine Befehlsersetzung (N45 W1)
ZIELE=$(grep '^#   PFLICHT:' "$SP" | grep -o '`[^`]*\.md`' | tr -d '`' | sort -u)
N=$(printf '%s\n' "$ZIELE" | grep -c .)
FEHLT=""
for D in $ZIELE; do [ -f "$D" ] || FEHLT="$FEHLT $D"; done
if [ "$ZEILEN" -lt 5 ] || [ "$N" -lt 1 ] || [ -n "$FEHLT" ]; then
  echo "FEHLER PFLICHT $ZEILEN $N$FEHLT"
else
  echo "OK PFLICHT $ZEILEN $N"
fi

# N49 W1 (11.10.2026): START_PROMPT ist der KERN, den jeder Chat liest – unter 200 Zeilen
# (Claude-Code-Doku „How Claude remembers your project“: laengere Anweisungsdateien „reduce adherence“).
# Und jede Themendatei regeln/*.md muss in der Pflichttabelle stehen, sonst liest sie niemand.
KZ=$(wc -l < "$SP" | tr -d ' ')
KGRENZE="${KERN_GRENZE:-200}"
if [ "$KZ" -gt "$KGRENZE" ]; then echo "FEHLER KERN $KZ $KGRENZE"; else echo "OK KERN $KZ $KGRENZE"; fi
RD="${REGELN_DIR:-regeln}"
OHNE=""; RN=0
for D in "$RD"/*.md; do
  [ -f "$D" ] || continue
  RN=$((RN + 1))
  printf '%s\n' "$ZIELE" | grep -qx "$D" || OHNE="$OHNE $D"
done
if [ "$RN" -lt 1 ]; then echo "FEHLER REGELN 0 keine"
elif [ -n "$OHNE" ]; then echo "FEHLER REGELN $RN$OHNE"
else echo "OK REGELN $RN"; fi
