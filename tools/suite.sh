#!/usr/bin/env bash
# tools/suite.sh – EINZELNE TESTSUITEN FAHREN, ohne das Arbeitsverzeichnis von Hand zu bauen.
#
#   bash tools/suite.sh didaktik              eine Suite (Praefix test_ darf entfallen)
#   bash tools/suite.sh axe engine themenauswahl   mehrere
#   bash tools/suite.sh --alle                alle Suiten NACHEINANDER (dauert – in der Sandbox
#                                             passt das NICHT in ein Zeitfenster, dafuer check.sh block)
#   bash tools/suite.sh --waermen             NUR Spiegel + Arbeitsverzeichnis bauen, keine Suite.
#                                             EINMAL JE SITZUNG, gleich nach tools/umgebung.sh:
#                                             danach kostet jede einzelne Suite ~2 s statt ~45 s.
#
# ══════════ WARUM ES DIESES SKRIPT GIBT (2026-07-27) ══════════
# An einem einzigen Tag habe ich das Arbeitsverzeichnis VIERMAL von Hand zusammenkopiert – und
# dabei zweimal genau die Fehler gemacht, vor denen check.sh im Kommentar warnt:
#   1. Suite aus tests/ heraus gestartet → `Cannot find module './fragen.js'`. Die Suiten erwarten
#      ein FLACHES Verzeichnis, in dem App-Dateien und Tests nebeneinander liegen.
#   2. node_modules nach /tmp/axenm gespiegelt → `Cannot find package 'entities'`. jsdom zieht ueber
#      parse5 ECHTE ESM-Importe, und deren Aufloesung ignoriert NODE_PATH vollstaendig: sie sucht
#      ausschliesslich in Verzeichnissen, die node_modules HEISSEN. Der Spiegelpfad MUSS also auf
#      /node_modules enden.
#   3. lernprogramm_ap1.html muss als app.html abgelegt werden – _harness.js oeffnet diesen Namen.
# Diese drei Fallen sind jetzt hier eingebaut statt in meinem Gedaechtnis.
#
# ⚠️ DAS ERSETZT check.sh NICHT. check.sh prueft zusaetzlich Drift, Determinismus, Sollwerte,
#    Offline-Audit und das Suiten-Inventar. Dieses Skript ist fuer die schnelle Schleife waehrend
#    der Arbeit; vor einem Release gilt weiterhin `bash check.sh block start|weiter|ende`.

set -u
cd "$(dirname "$0")/.." || exit 1
WORK="${SUITE_WORK:-/tmp/ap1_suite}"
# ⚠️ MUSS auf node_modules enden, siehe oben.
# 2026-07-30: Pfad jetzt ueber CHECK_NM_SPIEGEL uebersteuerbar – DIESELBE Variable, die check.sh
# schon kennt (check.sh:273). Grund: An diesem Tag lag /tmp/ap1_tooling einem anderen Benutzer
# ("nobody", Unterordner 0700) und war weder lesbar noch loeschbar; suite.sh brach mit
# "Spiegel unvollstaendig (1 von 2359 Dateien)" ab und hatte keinen Ausweg, waehrend check.sh
# einen hatte. Zwei Skripte, dieselbe Aufgabe, nur eines mit Schalter – das faellt beim naechsten
# Mal wieder auf. EINE Variable fuer beide.
# ⛔ 07.09.2026: DER PFAD TRAEGT DIE BENUTZERKENNUNG. Vorgefunden wurde ein
#    /tmp/ap1_tooling, das `nobody:nogroup` gehoerte – mit 0755, also lesbar. Der Stempel
#    darin passte, die Paketverzeichnisse waren da, der Inhalt aber gesperrt: 34 von 45
#    Suiten fielen mit „Cannot find module 'jsdom'" bei gesundem Code. Ein Spiegel mit
#    der eigenen uid im Namen kann gar nicht erst von einem anderen Benutzer stammen.
#    (Die Pruefung in tools/spiegel.sh faengt den Fall zusaetzlich ab – Guertel und
#    Hosentraeger, weil der Rueckfallweg vom Mount 36 s je Node-Prozess kostet.)
SPIEGEL="${CHECK_NM_SPIEGEL:-/tmp/ap1_tooling_$(id -u 2>/dev/null || echo 0)/node_modules}"

# ══════════ --waermen: DEN TEUREN ERSTAUFRUF EINER SITZUNG VORZIEHEN (27.08.2026) ══════════
# GEMESSEN am 27.08. im laufenden Betrieb: derselbe Aufruf `suite.sh wirtschaft` kostete
#   44,5 s beim ERSTEN Mal in der Sitzung  und  1,7 s bei jedem weiteren.
# Der Unterschied ist ausschliesslich die Spiegelung der 2359 node_modules-Dateien vom Mount
# nach /tmp – danach greift der Stempel aus tools/spiegel.sh und der Rest ist geschenkt.
# ►►► Die Kosten sind unvermeidbar, ihr ZEITPUNKT nicht. Wer sie an den Sitzungsanfang legt,
#     hat den ganzen Tag eine Zwei-Sekunden-Schleife statt einer Zwei-Sekunden-Schleife mit
#     einem 45-Sekunden-Loch an der unguenstigsten Stelle: naemlich dann, wenn gerade ein
#     Waechter rot geworden ist und man EINE Suite nachfahren will.
# ⚠️ Der Sinn ist NICHT, Zeit zu sparen – die Summe bleibt gleich. Der Sinn ist, dass die
#    Schleife waehrend der Arbeit berechenbar billig ist. Sonst weicht man auf den vollen
#    check.sh-Zyklus aus, und DER kostet vier Aufrufe.
WAERMEN=0
if [ "${1:-}" = "--waermen" ]; then WAERMEN=1; shift; fi

if [ "$#" -eq 0 ] && [ "$WAERMEN" = "0" ]; then
  echo "Aufruf: bash tools/suite.sh <name> [name ...]   |   --alle   |   --waermen" >&2
  echo "Vorhandene Suiten:" >&2
  compgen -G 'tests/test_*.js' | sed 's#tests/test_##; s#\.js##' | tr '\n' ' ' >&2; echo >&2
  exit 2
fi

# ── 1) Abhaengigkeiten bereitstellen ────────────────────────────────────────────────────────────
if [ ! -d ".tooling/node_modules/jsdom" ]; then
  echo "[suite] installiere jsdom ajv axe-core nach .tooling ..."
  ( cd .tooling && timeout 180 npm ci --no-fund --no-audit --loglevel=error ) \
    || { echo "[suite] ABBRUCH: npm nicht erreichbar. Ohne jsdom laeuft keine Suite." >&2; exit 3; }
fi
# ══════════ SPIEGEL BEREITSTELLEN – FORTSETZEN, NICHT NEU BEGINNEN (geaendert 30.07.2026) ══════════
# ⚠️⚠️ HIER STAND `rm -rf "$(dirname "$SPIEGEL")"` VOR JEDEM KOPIEREN. Das Kopieren von 2359
#   Dateien vom Mount passt NICHT in die 45 s der Sandbox – der cp wird abgeschnitten. Und weil
#   der naechste Aufruf zuerst loeschte, **hat jeder Versuch den Fortschritt des vorigen
#   weggeworfen.** Am 30.07. musste der cp deshalb von Hand laufen, zweimal.
#   ►►► `cp -r QUELLE/. ZIEL/` ist idempotent: ein zweiter Lauf vervollstaendigt nur.
#   Geloescht wird ab jetzt NUR noch, wenn der Spiegel fremd/defekt ist – und dann mit Ansage.
QUELLE=".tooling/node_modules"
# SCHNELLWEG (30.07.2026): Liegt ein gueltiger Stempel im Spiegel, entfaellt das Abzaehlen auf dem
# Mount (2085 ms) UND die require-Probe (697 ms). Begruendung und Grenzen: tools/spiegel.sh.
. tools/spiegel.sh
if spiegel_stempel_gueltig ".tooling" "$SPIEGEL"; then
  SPIEGEL_OK=1
else
  SPIEGEL_OK=0
fi
if [ "$SPIEGEL_OK" = "0" ]; then
SOLL_N="$(find "$QUELLE" -type f | wc -l)"
IST_N="$(find "$SPIEGEL" -type f 2>/dev/null | wc -l)"
if [ ! -d "$SPIEGEL/jsdom" ] || [ "$SOLL_N" != "$IST_N" ]; then
  # ⚠️ Fremder Eigentuemer ist NICHT "Mount langsam". Am 30.07. gehoerte /tmp/ap1_tooling dem
  #   Benutzer nobody (Unterordner 0700): nicht lesbar, nicht loeschbar. Die alte Meldung schickte
  #   in die falsche Richtung ("noch einmal starten") und half nie.
  if [ -e "$SPIEGEL" ] && [ ! -w "$SPIEGEL" ]; then
    echo "[suite] ⚠️ $SPIEGEL gehoert '$(stat -c '%U' "$SPIEGEL" 2>/dev/null || echo '?')' und ist nicht beschreibbar." >&2
    echo "[suite]    Das ist KEIN langsamer Mount. Ausweichpfad setzen, alle drei:" >&2
    echo "[suite]    CHECK_NM_SPIEGEL=/tmp/ap1_nm/node_modules CHECK_WORK=/tmp/ap1_cb2 SUITE_WORK=/tmp/ap1_work" >&2
    exit 4
  fi
  echo "[suite] spiegle node_modules nach $SPIEGEL ($IST_N von $SOLL_N da) ..."
  mkdir -p "$SPIEGEL"
  cp -r "$QUELLE/." "$SPIEGEL/" 2>/dev/null
  IST_N="$(find "$SPIEGEL" -type f | wc -l)"
  if [ "$SOLL_N" != "$IST_N" ]; then
    echo "[suite] ⚠️ Spiegel noch unvollstaendig ($IST_N von $SOLL_N Dateien)." >&2
    echo "[suite]    Der cp wurde vom Zeitfenster abgeschnitten – NICHTS ging verloren." >&2
    echo "[suite]    Einfach denselben Befehl noch einmal aufrufen, er setzt fort." >&2
    exit 4
  fi
fi
# ⚠️ Benutzbarkeit, nicht Existenz (dieselbe Lehre wie in tools/umgebung.sh, 30.07.):
if ! NODE_PATH="$SPIEGEL" node -e "require('jsdom')" >/dev/null 2>&1; then
  echo "[suite] ⚠️ $SPIEGEL ist vollzaehlig, aber require('jsdom') scheitert – Spiegel unbrauchbar." >&2
  echo "[suite]    Ausweichpfad: CHECK_NM_SPIEGEL=/tmp/ap1_nm/node_modules" >&2
  exit 4
fi
# Erst JETZT stempeln: vollzaehlig UND benutzbar nachgewiesen.
spiegel_stempel_setzen ".tooling" "$SPIEGEL"
fi   # Ende SPIEGEL_OK = 0

# ── 2) Flaches Arbeitsverzeichnis bauen ─────────────────────────────────────────────────────────
rm -rf "$WORK"; mkdir -p "$WORK"
# ⚠️ DIE KOPIERLISTE STEHT SEIT 28.07.2026 IN tools/work_dateien.sh – dieselbe Quelle, die auch
#    check.sh sourct. Vorher standen hier eigene cp-Zeilen; sie liefen an diesem Tag auseinander.
. tools/work_dateien.sh
work_dateien_kopieren "$WORK"

if [ "$WAERMEN" = "1" ]; then
  echo "[suite] Spiegel gestempelt, Arbeitsverzeichnis $WORK steht."
  echo "[suite] Ab jetzt kostet 'bash tools/suite.sh <name>' rund 2 s statt 45 s."
  exit 0
fi

# ── 3) Namen aufloesen ──────────────────────────────────────────────────────────────────────────
if [ "${1:-}" = "--alle" ]; then
  NAMEN=$(compgen -G 'tests/test_*.js' | sed 's#tests/##; s#\.js##')
else
  NAMEN=""
  for N in "$@"; do
    case "$N" in test_*) T="$N" ;; *) T="test_$N" ;; esac
    if [ ! -f "tests/$T.js" ]; then echo "[suite] Unbekannte Suite: $N (erwartet tests/$T.js)" >&2; exit 2; fi
    NAMEN="$NAMEN $T"
  done
fi

# ── 4) Fahren und gegen sollwerte.env halten ────────────────────────────────────────────────────
declare -A SOLL=()
[ -f sollwerte.env ] && while IFS='=' read -r k v; do [[ "$k" =~ ^[a-z] ]] && SOLL[$k]="$v"; done < sollwerte.env
FEHLER=0
for T in $NAMEN; do
  AUS="$(cd "$WORK" && NODE_PATH="$SPIEGEL" timeout "${SUITE_TIMEOUT:-180}" node "$T.js" 2>&1)"
  RC=$?
  LETZTE="$(echo "$AUS" | tail -1)"
  GOT="$(echo "$AUS" | grep -oE '[0-9]+ *(Tests )?OK' | grep -oE '[0-9]+' | head -1)"
  S="${SOLL[${T#test_}]:-}"
  HINWEIS=""
  if [ -n "$S" ] && [ -n "$GOT" ] && [ "$GOT" != "$S" ]; then
    HINWEIS="  ⚠️ Anzahl $GOT != Soll $S (sollwerte.env)"; FEHLER=$((FEHLER+1))
  fi
  [ "$RC" -ne 0 ] && FEHLER=$((FEHLER+1))
  printf '%-24s rc=%-3s %s%s\n' "$T" "$RC" "$LETZTE" "$HINWEIS"
  # Bei Fehlschlag die Befundzeilen zeigen – sonst muss man den Lauf noch einmal von Hand machen.
  [ "$RC" -ne 0 ] && echo "$AUS" | grep -iE "FEHLER|FAIL|Error" | head -12 | sed 's/^/    /'
done

echo "---"
if [ "$FEHLER" -eq 0 ]; then echo "ALLE GEFAHRENEN SUITEN GRUEN (Sollwerte stimmen)"; else echo "$FEHLER PROBLEM(E)"; fi
exit "$FEHLER"
