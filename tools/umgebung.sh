#!/usr/bin/env bash
# tools/umgebung.sh – SELBSTMESSUNG DER ARBEITSUMGEBUNG. Aufruf: bash tools/umgebung.sh
#
# ══════════ WARUM ES DIESES SKRIPT GIBT (2026-07-27) ══════════
# Am 27.07. stand in START_PROMPT, BUILD_LOG und TASKLIST uebereinstimmend: „npm 403, test_axe
# laeuft nur in der CI". Der Satz stimmte, als er im Juni geschrieben wurde, und war an diesem Tag
# falsch – npm ging wieder. Weil die Annahme geglaubt statt gemessen wurde, blieb ein CI-Fehlschlag
# stundenlang unerklaert, obwohl er in zwei Minuten lokal reproduzierbar gewesen waere.
# ⚠️ **UMGEBUNGS-ANNAHMEN SIND VERDERBLICHE WARE.** Sie stehen in der Doku wie Fakten und altern
# still. Dieses Skript misst sie nach, statt sie zu wiederholen. Es dauert wenige Sekunden und
# gehoert AN DEN ANFANG JEDER SITZUNG – vor die erste inhaltliche Entscheidung.
#
# Das Skript AENDERT NICHTS. Es meldet nur, was es vorfindet.

cd "$(dirname "$0")/.." || exit 1
echo "==== UMGEBUNGS-BEFUND $(date '+%Y-%m-%d %H:%M') ===="
echo "Verzeichnis: $(pwd)"
echo

sag(){ printf '  %-34s %s\n' "$1" "$2"; }

echo "---- Git ----"
# ⚠️ REIHENFOLGE GEAENDERT 28.07.2026 – DIE PRUEFUNG STAND VORHER VOR DEM git status UND LOG.
#    Gemessen an diesem Tag: Das Skript meldete "index.lock nicht vorhanden (gut)", eine Sekunde
#    spaeter stolperte ein 'git status' des Nutzers ueber genau diesen Lock. Grund: Der Lock
#    entsteht ERST durch einen Git-Aufruf – also durch die Zeile darunter. Wer vorher prueft,
#    prueft den Zustand vor der eigenen Frage. Jetzt wird erst gefragt, dann geprueft.
GEAENDERT="$(git status --porcelain 2>/dev/null | wc -l)"
if [ -f .git/index.lock ]; then
  sag "git index.lock" "⚠️ VORHANDEN – blockiert 'git add'. Loeschen (in der Sandbox nur ueber allow_cowork_file_delete, danach greift rm)."
else
  sag "git index.lock" "nicht vorhanden (nach eigenem git status geprueft)"
fi
sag "geaenderte Dateien im Baum" "$GEAENDERT"
sag "oberster Commit" "$(git log --oneline -1 2>/dev/null)"
echo "  ⚠️ Der Arbeitsbaum ist die Wahrheit, nicht der Kopf von START_PROMPT."
echo

echo "---- Werkzeuge (tools/einrichten.sh --pruefen - DIE eine Liste) ----"
# ⛔ 26.09.2026: HIER STAND `command -v python3 && python3 --version` - auf dem neuen PC fand
#    command -v den Store-Platzhalter, und die Zeile haette dessen Fehlermeldung als Version
#    gedruckt. Existenz statt Benutzbarkeit, dieselbe Klasse wie der Spiegel am 30.07. unten.
#    Dazu fehlten gh-Anmeldung, Git-Identitaet und node_modules ganz. Die Pruefung steht jetzt
#    NUR in tools/einrichten.sh; hier wird sie abgefragt, nicht nachgebaut.
bash tools/einrichten.sh --pruefen | sed -n '/^  /p'
echo

echo "---- Netz / npm (die Annahme, die am 27.07. falsch war) ----"
if ! command -v npm >/dev/null 2>&1; then
  sag "npm" "⚠️ FEHLT"
else
  if timeout 40 npm view axe-core version >/dev/null 2>&1; then
    sag "npm-Registry erreichbar" "JA → test_axe ist hier lokal fahrbar"
  else
    sag "npm-Registry erreichbar" "NEIN (Proxy?) → test_axe nur in der CI. NICHT gruen annehmen."
  fi
fi
for M in jsdom ajv axe-core; do
  if [ -d ".tooling/node_modules/$M" ]; then sag "  .tooling/$M" "installiert"; else sag "  .tooling/$M" "fehlt (npm install jsdom ajv axe-core --prefix .tooling)"; fi
done
# ⚠️ Der Spiegelpfad MUSS auf node_modules enden – jsdom zieht ueber parse5 echte ESM-Importe,
#    und deren Aufloesung ignoriert NODE_PATH und sucht nur in Verzeichnissen namens node_modules.
#
# ⚠️⚠️ HIER STAND BIS ZUM 30.07.2026 `[ -d /tmp/ap1_tooling/node_modules/jsdom ]` – EINE
#   EXISTENZPRUEFUNG. An diesem Tag gehoerte /tmp/ap1_tooling dem Benutzer `nobody`, die
#   Unterordner standen auf 0700 und waren nicht lesbar. Das Verzeichnis EXISTIERTE, also meldete
#   dieses Skript "vorhanden (Pfad endet korrekt)" – und der erste Suitenlauf lief trotzdem in
#   "Spiegel unvollstaendig (1 von 2359 Dateien)".
#   ►►► **DAS IST DIESELBE KLASSE WIE "npm 403" AM 27.07.: EXISTENZ GEPRUEFT STATT BENUTZBARKEIT.**
#   Ein Umgebungsskript, das einen kaputten Zustand als gut meldet, ist schlimmer als keines –
#   man glaubt ihm ja. check.sh macht es seit jeher richtig (`node -e "require('jsdom')"`).
SP="${CHECK_NM_SPIEGEL:-/tmp/ap1_tooling/node_modules}"
if [ ! -d "$SP/jsdom" ]; then
  sag "Spiegel $SP" "fehlt – tools/suite.sh legt ihn bei Bedarf an"
elif NODE_PATH="$SP" node -e "require('jsdom')" >/dev/null 2>&1; then
  # ⚠️ BENUTZBAR IST NICHT WARM. Gemessen 27.08.2026: derselbe Aufruf `suite.sh wirtschaft`
  #   kostet 44,5 s ohne gueltigen Stempel und 1,7 s mit. Der Unterschied ist die Spiegelung
  #   der 2359 Dateien vom Mount. Ein Umgebungsbefund, der beide Zustaende gleich meldet,
  #   verschweigt einen Faktor 25 – und man weicht dann auf den vollen check.sh-Zyklus aus.
  . tools/spiegel.sh
  if spiegel_stempel_gueltig ".tooling" "$SP"; then
    sag "Spiegel $SP" "WARM (gestempelt) – eine Einzelsuite kostet ~2 s"
  else
    sag "Spiegel $SP" "benutzbar, aber KALT – erster Suitenlauf kostet ~45 s"
    echo "     ►► Jetzt einmalig waermen: bash tools/suite.sh --waermen"
  fi
else
  BES="$(stat -c '%U' "$SP" 2>/dev/null || echo '?')"
  sag "Spiegel $SP" "⚠️ VORHANDEN, ABER UNBENUTZBAR – gehoert '$BES', require('jsdom') scheitert."
  echo "     ►► Ausweichpfad setzen, alle drei: CHECK_NM_SPIEGEL=/tmp/ap1_nm/node_modules"
  echo "        CHECK_WORK=/tmp/ap1_cb2 SUITE_WORK=/tmp/ap1_work"
fi
echo

# 2026-07-30: ZEILENBUDGET VORAB. Beide Dateien haben eine Grenze, die check.sh erst am ENDE
# eines vollen Laufs meldet – also nachdem alles geschrieben ist. Am 30.07. ging START_PROMPT
# auf 610 Zeilen und musste im Abschluss zurueckgebaut werden. **Wer den Platz vorher kennt,
# lagert beim Schreiben aus statt hinterher.**
# ---- Pruflauf-Weg: gemessen, nicht geglaubt (07.09.2026) ----
# ⚠️ Bis zum 07.09. schrieb Arbeitsregel 6 den Block-Modus fest vor, begruendet mit einem
#    45-s-Limit der Sandbox, das es laengst nicht mehr gab. Gemessen: voller Lauf 45 s in EINEM
#    Aufruf, Block-Weg 61 s in VIER. NUTZER-ENTSCHEID: je Sitzung einmal messen, Regel variabel.
echo "---- Prueflauf-Weg (je Sitzung einmal messen) ----"
printf "  %-34s " "voller Lauf vs. Block"
bash "$(dirname "$0")/prueflauf.sh" --stand 2>/dev/null || echo "prueflauf.sh fehlt"
echo ""
echo "---- Budget der Steuerdateien ----"
# ⚠️ START_PROMPT wird seit 17.09.2026 in ZEICHEN gemessen (tools/steuer_umfang.sh), nicht in Zeilen.
SUZ="$(bash tools/steuer_umfang.sh 2>/dev/null | head -1)"
# shellcheck disable=SC2086  # gewollt: die Ausgabe in Felder zerlegen (N45 W1)
set -- $SUZ
case "${1:-}" in
  OK)      sag "START_PROMPT.md" "$3 Byte (Hinweis ab $4, Fehler ab $5, noch $(( $4 - $3 )) frei)" ;;
  HINWEIS) sag "START_PROMPT.md" "⚠️ $3 Byte (> $4) – AUSLAGERN, bevor du schreibst" ;;
  *)       sag "START_PROMPT.md" "⚠️ ${3:-?} Byte – ueber der Grenze ${5:-?} oder Werkzeug stumm" ;;
esac
# shellcheck disable=SC2043  # Liste mit einem Eintrag, bewusst erweiterbar (N45 W1)
for PAAR in "BUILD_LOG.md 900"; do
  # shellcheck disable=SC2086  # gewollt: Paar in Felder zerlegen (N45 W1)
  set -- $PAAR; F="$1"; GRENZE="$2"
  if [ -f "$F" ]; then
    N=$(wc -l < "$F")
    if [ "$N" -ge "$GRENZE" ]; then sag "$F" "⚠️ $N von $GRENZE Zeilen – ROTIEREN/AUSLAGERN, bevor du schreibst"
    else sag "$F" "$N von $GRENZE Zeilen (noch $((GRENZE-N)) frei)"; fi
  fi
done
echo "  ⚠️ Chronik gehoert ins jeweilige _ARCHIV, nicht in diese Dateien."
echo

echo "---- Mount-Vollstaendigkeit (Stichprobe) ----"
for F in neu/src/kern/bewertung.ts pool/pool_m01.json referenz/lernprogramm_ap1.html; do
  if [ -s "$F" ]; then sag "$F" "$(wc -c < "$F") Byte"; else sag "$F" "⚠️ LEER ODER FEHLT – Mount unvollstaendig"; fi
done
echo "  ⚠️ Bei 'binary file matches' auf einer .js/.md NIE weiterarbeiten – erst auf NUL-Bytes pruefen:"
printf '%s\n' "     python3 -c \"print(open('DATEI','rb').read().count(b'\\x00'))\""
echo
echo "==== ENDE ===="
