#!/bin/bash
# check.sh – komplette Prüfsuite des AP1-Lernprogramms (Mini-Version von Task #88)
# Aufruf im Training-Ordner (bash/VM):  bash check.sh          (voll: alle Suiten inkl. jsdom, ~130 s)
#                                       bash check.sh schnell  (nur Mount/Syntax/vitest kern/ – für reine Inhalts-Tasks)
#                                       bash check.sh doku     (NUR wenn nur *.md / tools/plugin/ geaendert: Vorpruefungen + alle
#                                         billigen Waechter + EINSTIEG; Pfad-Tor bricht sonst ab. Nutzer-Entscheid 08.10.2026)
#                                       bash check.sh block start   ⎫ voller Lauf, aber in Haeppchen,
#                                       bash check.sh block weiter  ⎬ die in die 45 s der Sandbox
#                                         (so oft, bis "ALLE ERLEDIGT")  passen. Gleiche Abdeckung
#                                       bash check.sh block ende    ⎭ wie „voll".
#                                       bash check.sh teil <pruefung|suiten|tests|bau>   (N42 B5, ENTWURF) EIN Teil des vollen Laufs,
#                                         fuer parallele CI-Jobs. Die vier Teile zusammen = „voll" (Beweis: tools/ci_b5_entwurf.md);
#                                         stempelt nie, meldet „TEIL <name> GRÜN" statt „ALLES GRÜN".
set -u
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR" || exit 1
FEHLER=0
melde(){ echo "[FEHLER] $1"; FEHLER=$((FEHLER+1)); }
ok(){ echo "[ok] $1"; }
# N37 U6 (E60, 27.09.2026): Waechter liegen je in tools/waechter/<name>.sh und werden hier GESOURCT -
#   in EINEM Funktionsaufruf, damit `local`-Variablen wie vorher ueber die Bloecke eines Abschnitts reichen.
#   ⛔ Fehlt eine Datei, ist das ein FEHLER - ein stilles Auslassen waere ein Waechter weniger ohne Meldung.
waechter(){
  local _wdatei
  for _wdatei in "$@"; do
    # shellcheck source=/dev/null  # Waechterdatei, Name zur Laufzeit (N45 W1)
    if [ -f "tools/waechter/$_wdatei.sh" ]; then . "tools/waechter/$_wdatei.sh"
    else melde "Waechter fehlt: tools/waechter/$_wdatei.sh"; fi
  done
}
# Sollwerte (Single Source of Truth: sollwerte.env) – exakter Zähl-Abgleich je Suite (fängt stumm
# übersprungene/verschwundene Tests, die der reine Exit-Code nicht bemerkt).
declare -A SOLL=()
[ -f "$DIR/sollwerte.env" ] && while IFS='=' read -r k v; do [[ "$k" =~ ^[a-z] ]] && SOLL[$k]="$v"; done < "$DIR/sollwerte.env"
pruefe_zahl(){ # $1=name(test_x)  $2=Ausgabe
  local base="${1#test_}"; local soll="${SOLL[$base]:-}"
  [ -z "$soll" ] && return 0
  local got; got=$(echo "$2" | grep -oE '[0-9]+ *(Tests )?OK' | grep -oE '[0-9]+' | head -1)
  [ -n "$got" ] && [ "$got" != "$soll" ] && melde "$1: Anzahl $got != Soll $soll (sollwerte.env)" || true
}

# Frisches, exklusiv gehörendes Arbeitsverzeichnis. mktemp -d vermeidet EACCES durch
# nobody:nogroup-Reste früherer Sessions in /tmp (Tests sind pfad-agnostisch: relative
# require("./logik.js") / require("./_harness.js") + __dirname im Harness).
# ── BETRIEBSART ──────────────────────────────────────────────────────────────────────────────
# voll (Standard) · schnell · block <start|1..N|ende>
# Der Block-Modus existiert wegen der Sandbox: Ein voller Lauf dauert ~130 s, ein einzelner
# bash-Aufruf darf dort aber nur 45 s. Frueher hat sich jeder Chat den Ablauf neu zusammengebaut –
# am 26.07. hat genau das ~7 Minuten und 11 Aufrufe gekostet, weil der Nachbau unvollstaendig war
# (fehlendes app.html) und weil ein per nohup in den Hintergrund geschobener Lauf mit dem
# bash-Aufruf stirbt. Deshalb steht der Ablauf jetzt HIER, einmal und richtig.
MODUS="${1:-voll}"
UNTER="${2:-}"
# N42 B5 (ENTWURF): welche Abschnitte dieser Aufruf faehrt. Voll/alle anderen Modi: alles an (unveraendertes Verhalten).
#   pruefung = Vorpruefungen + billige Waechter + 4f ohne Umbau · suiten = jsdom-Suiten · tests = vitest neu/ · bau = tsc, oxlint, Bau, gzip, v2/-Drift
T_VOR=1; T_SUITEN=1; T_GUARDS=1; T_4FREST=1; UMBAU_TEIL="tsc oxlint vitest bau"
if [ "$MODUS" = "teil" ]; then
  T_VOR=0; T_SUITEN=0; T_GUARDS=0; T_4FREST=0; UMBAU_TEIL=""
  case "$UNTER" in
    pruefung) T_VOR=1; T_GUARDS=1; T_4FREST=1 ;;
    suiten)   T_SUITEN=1 ;;
    tests)    UMBAU_TEIL="vitest" ;;                                    # mit VITEST_SHARD=i/n nur ein Shard (N42)
    tests-merge) UMBAU_TEIL="vitest"; export VITEST_MERGE=1; unset VITEST_SHARD ;;   # Blobs der Shards zusammenfuehren (N42)
    bau)      UMBAU_TEIL="tsc oxlint bau" ;;
    *) echo "Aufruf: bash check.sh teil <pruefung|suiten|tests|tests-merge|bau>"; exit 2 ;;
  esac
fi
# ⚠️ BEWUSST /tmp UND NICHT $TMPDIR. GEMESSEN 2026-07-26: In der Sandbox zeigt TMPDIR auf
#    /sessions/<name>/tmp – das liegt auf dem MOUNT, nicht auf der lokalen Platte. Ein
#    Arbeitsverzeichnis dort ist unbenutzbar langsam: schon `ls` blieb haengen, eine einzelne
#    jsdom-Suite lief in 44 s nicht durch (auf /tmp: ~3 s). Ueberschreibbar mit CHECK_WORK.
BLOCK_WORK="${CHECK_WORK:-/tmp/ap1_check_block}"
if [ "$MODUS" = "block" ]; then
  # KEIN trap-Aufraeumen: das Verzeichnis MUSS den einzelnen bash-Aufruf ueberleben.
  WORK="$BLOCK_WORK"; mkdir -p "$WORK"
else
  WORK="$(mktemp -d)"
  # N51 A2: Hintergrund-Laeufe (tools/umbau_laeufe.sh) beim Abbruch mit beenden, dann erst aufraeumen.
  trap 'kill $(jobs -p) 2>/dev/null; rm -rf "$WORK"; rm -f "_to_delete/helfer/vitest.$$.json"' EXIT
fi

# 0) Mount-Vollständigkeit (Datei-Enden) – mit AUTO-WAIT gegen Mount-Truncation (TASKLIST Abschnitt 4).
#    Nach File-Tool-Edits zeigt der bash-Mount große Dateien oft abgeschnitten; statt sofort abzubrechen
#    pollen wir bis ~40s auf Mount-Sync (Fast-Path: bei intaktem Ende sofort weiter, kein Delay im Normalfall).
warte_ende(){ # $1=Datei  $2=tail-Bytes  $3=End-Marker  $4=Label
  local i
  for i in $(seq 1 20); do
    tail -c "$2" "$1" 2>/dev/null | grep -qa "$3" && { ok "$4-Ende intakt"; return 0; }
    [ "$i" -eq 1 ] && echo "[warte] $1 noch abgeschnitten – bis ~40s auf Mount-Sync pollen ..."
    sleep 2
  done
  melde "MOUNT UNVOLLSTÄNDIG: $1 abgeschnitten (auch nach ~40s – TASKLIST Abschnitt 4, ggf. Workspace-Neustart)"
  return 1
}
vorpruefungen(){        # Abschnitte 0/1/1b/1c – im Block-Modus nur bei "start" und "ende" noetig
warte_ende referenz/lernprogramm_ap1.html 20  "</html>"        "HTML"
warte_ende referenz/logik.js   120 "v3.3"                     "logik.js"
warte_ende referenz/app_pages2.js 30 "render()"                "app_pages2.js"
warte_ende referenz/app_glossar.js 160 "module.exports = { GLOSSAR_TIPS" "app_glossar.js"
warte_ende referenz/app_loeser.js 40 "return z;"               "app_loeser.js"
warte_ende referenz/app_verbuchen.js 90 "toter Code entfernt" "app_verbuchen.js"
if [ -s referenz/styles.css ]; then ok "styles.css vorhanden (referenz/)"; else melde "referenz/styles.css fehlt/leer"; fi
if [ "$FEHLER" -gt 0 ]; then echo "== ABBRUCH: erst Mount-Problem lösen (TASKLIST Abschnitt 4) =="; exit 2; fi

# 1) Syntax (app.js seit Block-E-Modularisierung in app_*.js aufgeteilt, in HTML in Reihenfolge geladen)
if node --check referenz/logik.js; then ok "logik.js Syntax (referenz/)"; else melde "referenz/logik.js Syntax"; fi
# N29 Teil 2 (E40): fragen.js/faelle.js gibt es nicht mehr - der Pool wird ueber den Lader geprueft
# (Pflichtfelder, ID-Format, Praefix, Pruefungsteil, Stufe, Dubletten; frueher beim Bau in build_fragen.py).
PL="$(node tools/pool_laden.js --pruefe 2>&1)"
if printf '%s' "$PL" | grep -qE '^POOL [0-9]+ [0-9]+ [0-9]+$'; then ok "Pool laedt ($PL)"; else melde "Pool laedt nicht: $(printf '%s' "$PL" | head -1) (node tools/pool_laden.js --pruefe)"; fi
# N29 Teil 2 (E39): die alte App liegt in referenz/ (seit N34 T6c auch logik.js und app_glossar.js)
for MOD in app_state app_pool app_util app_ui app_frage app_glossar app_loeser app_verbuchen app_seiten app_sim app_pages2; do
  F="referenz/$MOD.js"
  if node --check "$F"; then ok "$MOD.js Syntax"; else melde "$F Syntax"; fi
done

# 1b) Pool-Audit (#81/#87): ganzer Pool valide + IDs sauber
if node tools/validate_pool.js >/dev/null 2>&1; then ok "validate_pool (Pool valide)"; else melde "validate_pool: Pool-Probleme (node tools/validate_pool.js)"; fi
if node tools/pool_query.js idcheck >/dev/null 2>&1; then ok "idcheck (IDs sauber)"; else melde "idcheck: ID-Probleme (node tools/pool_query.js idcheck)"; fi

# 1c) Deklaratives JSON-Schema (#22): Pool gegen tools/schema/frage.schema.json (ajv, Defense in Depth)
#     ajv persistent in .tooling (wie jsdom); einmaliger Bootstrap, danach gecacht.
if [ ! -d "$DIR/.tooling/node_modules/ajv" ] && [ ! -d /tmp/node_modules/ajv ]; then
  echo "[info] installiere ajv nach $DIR/.tooling (einmalig, persistent) ..."
  ( cd "$DIR/.tooling" && timeout 90 npm ci --no-fund --no-audit --loglevel=error ) 2>/dev/null \
    || timeout 90 npm install ajv --prefix /tmp --no-fund --no-audit --loglevel=error 2>/dev/null
fi
if node tools/validate_schema.js >/dev/null 2>&1; then ok "validate_schema (Schema valide)"; else melde "validate_schema: Schema-Verstoß (node tools/validate_schema.js)"; fi
# N37 U3 (E60, 27.09.2026): Schema UND die daraus erzeugten TS-Typen (neu/src/daten/frage.generiert.ts) muessen dem
# Generator entsprechen - wer eine der beiden Dateien von Hand aendert oder den Generator nicht laufen laesst, faellt hier auf.
if SP="$(node tools/build_schema.js --pruefe 2>&1)"; then ok "Schema-Generat aktuell ($SP)"; else melde "Schema-Generat: $SP"; fi
}

# 1d) ENTKOMMENTIERER + BILLIGE WÄCHTER (FB-R3 Punkt 12).
#     Die grep-Wächter durchsuchten bisher die ROHEN Dateien und trafen damit auch Kommentare,
#     die vor der jeweiligen Falle WARNEN. Genau daran ist der erste CI-Lauf von v1.3.0
#     gescheitert. tools/entkommentiere.js blendet Kommentare aus, ohne die Datei zu verkürzen
#     (längentreu, Zeilennummern bleiben gültig).
#     FAIL-SAFE, kein FAIL-OPEN: schlägt das Ausblenden fehl oder ist die gestrippte Fassung kein
#     gültiges JS mehr, wird das laut gemeldet UND auf der ROHDATEI weitergeprüft – lieber ein
#     Fehlalarm als ein Wächter, der still nichts mehr sieht (Falle aus R2a: Test immer grün).
#     Die Wächter hier sind billig (~2 s) und laufen deshalb AUCH im Schnell-Check – der teure
#     Drift-Guard (4a, python3-Build) bleibt dem vollen Lauf vorbehalten.
NC_DATEI=""
# shellcheck disable=SC2034,SC2329  # NC_DATEI lesen tools/waechter/{antimuster,offline}.sh; aufgerufen nur dort (N45 W1)
ohne_kommentare(){          # setzt NC_DATEI; bewusst KEIN $(...), sonst ginge der melde-Zähler
  local f="$1"; NC_DATEI="$f"          # in der Subshell verloren
  case "$f" in *.js|*.css|*.html|*.htm) ;; *) return 0 ;; esac   # JSON/Manifest roh lassen
  local ziel; ziel="$WORK/nc_$(echo "$f" | tr '/' '_')"
  if ! node tools/entkommentiere.js "$f" > "$ziel" 2>/dev/null; then
    melde "Entkommentierer fehlgeschlagen fuer $f - Waechter pruefen die Rohdatei weiter (tools/entkommentiere.js)"
    return 0
  fi
  case "$f" in *.js)
    node --check "$ziel" >/dev/null 2>&1 || {
      melde "Entkommentierer beschaedigt $f - gestrippte Fassung ist kein gueltiges JS, Waechter pruefen die Rohdatei weiter"
      return 0; } ;;
  esac
  NC_DATEI="$ziel"
}

billige_guards(){
  local f
  # N37 U6: die Waechter stehen je in tools/waechter/<name>.sh - Reihenfolge = Ausgabe-Reihenfolge.
  waechter \
    offline \
    utf8 \
    antimuster \
    rhaus \
    4e_versionen \
    4e2_standzeile \
    4e2b_auslieferung \
    4e2b2_ungepusht \
    4e2b2c_ci \
    4e2b3_gebiete \
    4e2b4_deploy \
    4e2c_zeilenzahlen \
    4e2d_bestandsids \
    4e2e_verweise \
    4e3_firmen \
    4e4_zitate \
    4e5_zufall \
    4e6_begriffe \
    4e7_abdeckung \
    4e8_loesungswort \
    4e16_antworttell \
    4e9_grafiken \
    4e10_zusicherung \
    4e11_wache \
    4e12_skillpfade \
    4e15_limits \
    4e13_geheimnisse \
    4e14_veroeffentlichung \
    4f_buildlog \
    4g_startprompt \
    4g2_entscheide
}

# 2) Testsuiten – tests/ flach ins Arbeitsverzeichnis kopieren, dann Auto-Glob über tests/test_*.js
#    (require-Pfade der Tests sind relativ: ./logik.js/./fragen.js/./_harness.js -> im flachen WORK gültig)
# ⚠️ DIESE LISTE IST DIE EINZIGE QUELLE. Sie steht bewusst in einer Funktion, damit der Block-Modus
#    (unten) dasselbe Arbeitsverzeichnis baut und nicht eine zweite, driftende Kopie pflegt.
#    GEMESSEN 2026-07-26: Ein von Hand nachgebautes Verzeichnis OHNE app.html lieferte 35 rote Suiten
#    mit "ENOENT app.html" – ein solcher Lauf ist nicht rot, sondern WERTLOS. Wer hier etwas ergaenzt,
#    ergaenzt es fuer beide Betriebsarten.
# ⚠️ DIE LISTE SELBST STEHT SEIT 28.07.2026 IN tools/work_dateien.sh – EINE Quelle fuer check.sh
#    UND tools/suite.sh. Vorher stand sie zweimal; an diesem Tag lief sie auseinander (die neue
#    laengen_ausnahmen.json fehlte in suite.sh, die Suite lief rot). Ein Kommentar "bitte beide
#    pflegen" stand da bereits und hat es nicht verhindert.
. tools/work_dateien.sh
fuelle_work(){ work_dateien_kopieren "$WORK"; }
# Ein NUMMERIERTER Block uebernimmt Vorpruefungen UND Arbeitsverzeichnis aus "block start" –
# beides noch einmal zu machen kostete gemessen ~10 s pro Aufruf, und genau die fehlten dann
# hinten (11 Suiten liefen mit Neubefuellung NICHT in 45 s durch, ohne schon).
# Das ist nur deshalb sicher, weil unten VOR jedem Block der Fingerabdruck der Quelldateien
# geprueft wird: Hat sich etwas geaendert, bricht der Block ab statt veraltet weiterzulaufen.
# 4f als Funktion (22.09.2026): 'bash check.sh neu' faehrt NUR Vorpruefungen + 4f (BUILD_LOG 26, 9c).
abschnitt_4f(){
# N37 U6: die Bloecke von 4f stehen je in tools/waechter/<name>.sh.
[ "$T_4FREST" = 1 ] && waechter \
  4f_einstieg \
  4f_roh \
  4f_as \
  4f_qualitaet \
  4f_architektur \
  4f_unnoetig
[ -n "$UMBAU_TEIL" ] && waechter 4f_umbau

[ "$T_GUARDS" = 1 ] && billige_guards          # 3 + 4b/4c/4d: Offline-Audit, UTF-8, Anti-Pattern, Rhaus (Abschnitt 1d)

echo "==================================="
# Im Block-Modus das persistente Arbeitsverzeichnis erst JETZT raeumen (vorher muss es die
# einzelnen bash-Aufrufe ueberleben). Bei Fehlern bleibt es liegen – dann will man hineinschauen.
if [ "$MODUS" = "block" ] && [ "$FEHLER" -eq 0 ]; then rm -rf "$BLOCK_WORK"; fi
}
# MODUS doku (08.10.2026, Nutzer-Entscheid, BUILD_LOG 103): GEMESSEN am 08.10.: fuenf volle Laeufe fuer
#   Commits, die nur Doku und Plugin-Quelle aenderten - drei davon rot an einem jsdom-Zeitlimit, das mit
#   der Aenderung nichts zu tun hatte; jeder Lauf ~5 min = ~8 Warte-Aufrufe der Bruecke. ►► Das PFAD-TOR
#   macht den Modus sicher: steht irgendetwas ausser *.md, tools/plugin/ oder _to_delete/ im Baum, bricht
#   er ab - dann ist der volle Lauf Pflicht. ⛔ neu/, pool/, v2/, tools/*.sh, check.sh selbst: NIE doku.
if [ "$MODUS" = "doku" ]; then
  DOKU_FREMD="$(git status --porcelain --untracked-files=all 2>/dev/null | cut -c4- | sed 's/.* -> //' \
    | grep -v -E '^(_to_delete/|tools/plugin/)' | grep -v -E '^([^/]+|regeln/[^/]+|entscheide/[^/]+)\.md$' )"
  if [ -n "$DOKU_FREMD" ]; then
    echo "[FEHLER] doku-Modus verweigert - geaendert ist mehr als Doku/Plugin:"; echo "$DOKU_FREMD" | head -10 | sed 's/^/    /'
    echo "►► bash check.sh  (voller Lauf)"; exit 1
  fi
  vorpruefungen; billige_guards; waechter 4f_einstieg
  echo "==================================="
  if [ "$FEHLER" -eq 0 ]; then bash tools/check_stempel.sh schreibe doku; echo "DOKU-CHECK GRÜN (nur Doku/Plugin im Baum - Pfad-Tor bestanden)"; exit 0; else echo "$FEHLER PROBLEM(E)"; exit 1; fi
fi
case "$MODUS:$UNTER" in
  block:weiter) : ;;
  neu:*)        vorpruefungen ;;
  teil:*)       [ "$T_VOR" = 1 ] && vorpruefungen; [ "$T_SUITEN" = 1 ] && fuelle_work ;;
  *)            vorpruefungen; fuelle_work ;;
esac
# N51 A2 (12.10.2026): die teuren 4f-Laeufe (vitest ~90 % der Zeit) starten JETZT im Hintergrund und rechnen,
#   waehrend Suiten und Waechter laufen; 4f_umbau holt die Ergebnisse an seiner alten Stelle ab.
. tools/umbau_laeufe.sh
if { [ "$MODUS" = "voll" ] || [ "$MODUS" = "neu" ] || [ "$MODUS" = "teil" ]; } && [ -n "$UMBAU_TEIL" ] && [ "${CHECK_SERIELL:-}" != "1" ] && [ -d neu/node_modules ]; then
  umbau_vorab_starten "$WORK/_4f" "$WORK/v2probe"
fi
# MODUS neu: nur der Neubau (4f). Fuer ZWISCHENSTAENDE bei Arbeit an neu/ - vor dem Commit IMMER voll.
if [ "$MODUS" = "neu" ]; then
  abschnitt_4f
  echo "==================================="
  if [ "$FEHLER" -eq 0 ]; then echo "NEU-CHECK GRÜN (nur 4f - kein Ersatz fuer den vollen Lauf)"; exit 0; else echo "$FEHLER PROBLEM(E)"; exit 1; fi
fi
[ "$T_SUITEN" = 1 ] && { pkill -f "node test_" 2>/dev/null; sleep 1; }                  # hängende node-Prozesse früherer Aufrufe räumen (Contention)
if [ "$MODUS" = "schnell" ]; then
  # N34 T6c (27.09.2026, E57): test_logik.js ist mit den Suiten (b) gegangen - der Schnell-Check faehrt
  # stattdessen vitest auf den Rechenkern `neu/src/kern` (dort wird seit N34 gerechnet).
  L="$( cd neu && NO_COLOR=1 npx vitest run src/kern --reporter=dot 2>&1 )"; C=$?
  echo "$L" | grep -E "Tests +[0-9]" | tail -1
  if [ "$C" -eq 0 ]; then ok "vitest neu/src/kern"; else melde "vitest neu/src/kern"; echo "$L" | tail -20; fi
  billige_guards                                            # FB-R3.12: Guards auch im Schnell-Check
  echo "==================================="
  if [ "$FEHLER" -eq 0 ]; then echo "SCHNELL-CHECK GRÜN (jsdom-Suiten und Drift-Guard übersprungen)"; exit 0; else echo "$FEHLER PROBLEM(E)"; exit 1; fi
fi
if [ "$T_SUITEN" = 1 ]; then   # N42 B5: bis "fi" unten nur fuer voll/schnell/block und teil suiten
# jsdom PERSISTENT in .tooling (überlebt /tmp-Wipe bei Workspace-Neustart); /tmp nur als Fallback.
# axe-core (G1.5 #46, für tests/test_axe.js) liegt daneben und wird zusammen mit jsdom installiert.
TOOL="$DIR/.tooling"
# ⚠️⚠️ NODE_MODULES NIEMALS DIREKT VOM MOUNT LADEN. GEMESSEN 2026-07-26, sauber gegeneinander:
#   require('jsdom') aus .tooling/node_modules (Mount) ....... 36 615 ms
#   require('jsdom') aus einem Spiegel unter /tmp ............     410 ms   -> Faktor 90
# jsdom besteht aus tausenden kleinen Dateien, und jeder einzelne Zugriff geht ueber den Mount.
# Das war jahrelang die wahre Ursache dafuer, dass der volle Lauf "einfach lange dauert": nicht
# die Tests, sondern das Nachladen der Bibliothek. Deshalb wird .tooling einmal je Sandbox nach
# /tmp gespiegelt und von dort geladen. Der Spiegel wird PAKETWEISE mit DATEIZAEHLUNG geprueft –
# ein blosses [ -d ] genuegt nicht: eine abgebrochene Kopie hinterlaesst vorhandene, aber halb
# gefuellte Verzeichnisse (real erlebt: parse5 mit 12 von 33 Dateien -> "Cannot find module").
# ⚠️ DER PFAD MUSS AUF "node_modules" ENDEN. NODE_PATH genuegt nur fuer require() (CommonJS).
#    jsdom zieht ueber parse5 auch ECHTE ESM-Importe, und deren Aufloesung ignoriert NODE_PATH
#    vollstaendig: sie sucht ausschliesslich in Verzeichnissen, die node_modules HEISSEN.
#    Erster Versuch mit /tmp/ap1_node_modules war dateivollstaendig (0 Abweichungen) und trotzdem
#    kaputt: "Cannot find package 'entities' imported from .../parse5/dist/tokenizer/index.js".
#    LEHRE: Vollzaehligkeit der Dateien beweist NICHT, dass die Bibliothek benutzbar ist.
# ⛔ 07.09.2026: DER PFAD TRAEGT DIE BENUTZERKENNUNG. Vorgefunden wurde ein
#    /tmp/ap1_tooling, das `nobody:nogroup` gehoerte – mit 0755, also lesbar. Der Stempel
#    darin passte, die Paketverzeichnisse waren da, der Inhalt aber gesperrt: 34 von 45
#    Suiten fielen mit „Cannot find module 'jsdom'" bei gesundem Code. Ein Spiegel mit
#    der eigenen uid im Namen kann gar nicht erst von einem anderen Benutzer stammen.
#    (Die Pruefung in tools/spiegel.sh faengt den Fall zusaetzlich ab – Guertel und
#    Hosentraeger, weil der Rueckfallweg vom Mount 36 s je Node-Prozess kostet.)
SPIEGEL="${CHECK_NM_SPIEGEL:-/tmp/ap1_tooling_$(id -u 2>/dev/null || echo 0)/node_modules}"
. "$DIR/tools/spiegel.sh"
spiegle_node_modules(){   # $1 = Quellverzeichnis node_modules; Rueckgabe 0 = vollstaendig
  local q="$1" p a b unvollstaendig=0
  [ -d "$q" ] || return 1
  # SCHNELLWEG (30.07.2026): Das Abzaehlen unten laeuft ueber den MOUNT und kostet dort gemessene
  # 2085 ms – bei einem block-Lauf viermal. Liegt ein gueltiger Stempel im Spiegel, wurde genau
  # diese Pruefung fuer genau dieses package-lock.json schon einmal bestanden. Details und Grenzen:
  # tools/spiegel.sh. Der langsame Weg bleibt vollstaendig erhalten und laeuft, sobald der Stempel
  # fehlt, nicht passt oder der Spiegel fremd ist.
  if spiegel_stempel_gueltig "$(dirname "$q")" "$SPIEGEL"; then return 0; fi
  mkdir -p "$SPIEGEL"
  for pp in "$q"/*; do [ -e "$pp" ] || continue; p="${pp##*/}"
    a=$(find "$q/$p" -type f 2>/dev/null | wc -l)
    b=$(find "$SPIEGEL/$p" -type f 2>/dev/null | wc -l)
    [ "$a" = "$b" ] && continue                      # schon vollstaendig da – ueberspringen
    rm -rf "${SPIEGEL:?}/$p"; cp -r "$q/$p" "$SPIEGEL/$p" 2>/dev/null
    b=$(find "$SPIEGEL/$p" -type f 2>/dev/null | wc -l)
    [ "$a" = "$b" ] || unvollstaendig=1
  done
  [ "$unvollstaendig" -eq 0 ] || return 1
  # BENUTZBARKEITS-PROBE statt blosser Dateizaehlung: laedt die Bibliothek wirklich. Faengt genau
  # den Fall ab, in dem alle Dateien da sind, die Aufloesung aber scheitert (ESM, s. o.).
  NODE_PATH="$SPIEGEL" node -e "require('jsdom')" >/dev/null 2>&1 || return 1
  spiegel_stempel_setzen "$(dirname "$q")" "$SPIEGEL"   # erst hier: vollzaehlig UND benutzbar
  return 0
}
if [ -d "$TOOL/node_modules/jsdom" ] && spiegle_node_modules "$TOOL/node_modules"; then
  export NODE_PATH="$SPIEGEL"
elif [ -d "$TOOL/node_modules/jsdom" ]; then
  echo "[warnung] node_modules-Spiegel unter $SPIEGEL ist nicht benutzbar."
  echo "          Es wird vom MOUNT geladen – korrekt, aber rund 36 s je Node-Prozess."
  if [ -d "$SPIEGEL" ] && [ ! -w "$SPIEGEL" ]; then
    echo "          GRUND: der Spiegel gehoert einem anderen Benutzer ($(stat -c '%U' "$SPIEGEL" 2>/dev/null))."
    echo "          Abhilfe: CHECK_NM_SPIEGEL auf einen eigenen Pfad setzen, z. B."
    echo "          CHECK_NM_SPIEGEL=\"\$HOME/ap1_spiegel/node_modules\" bash tools/prueflauf.sh"
  else
    echo "          Abhilfe: 'bash check.sh' noch einmal starten, der Spiegel wird fortgesetzt."
  fi
  export NODE_PATH="$TOOL/node_modules"
elif [ -d /tmp/node_modules/jsdom ]; then
  export NODE_PATH=/tmp/node_modules
else
  echo "[info] installiere jsdom + axe-core nach $TOOL (einmalig, persistent) ..."
  if ( cd "$TOOL" && timeout 120 npm ci --no-fund --no-audit --loglevel=error ) 2>/dev/null; then  # nach Lockfile (26.09.2026)
    export NODE_PATH="$TOOL/node_modules"
  else
    timeout 120 npm install jsdom axe-core --prefix /tmp --no-fund --no-audit --loglevel=error
    export NODE_PATH=/tmp/node_modules
  fi
fi
# Nachinstallation, falls jsdom schon da war, axe-core aber noch fehlt (Bestandsinstallationen vor G1.5).
# ⚠️ timeout ZWINGEND: der Sandbox-Proxy antwortet seit 2026-07-22 nicht mehr mit 403, sondern HÄNGT.
#    Ohne Deckel blieb der volle check.sh hier unbegrenzt stehen (gemessen: >2 min ohne Ausgabe).
#    Mit Deckel läuft die Suite danach normal weiter; test_axe fällt dann als einzige Suite aus.
if [ ! -d "$NODE_PATH/axe-core" ]; then
  echo "[info] installiere axe-core nach $(dirname "$NODE_PATH") nach (max. 90 s) ..."
  timeout 90 npm install axe-core --prefix "$(dirname "$NODE_PATH")" --no-fund --no-audit --loglevel=error 2>/dev/null \
    || echo "[info] axe-core nicht installierbar (Registry gesperrt) – test_axe faellt lokal aus, laeuft in der CI"
fi
# ── Suiten PARALLEL fahren (2026-07-22) ──────────────────────────────────────────────────────
# WARUM: Gemessen dauert ein einzelner jsdom-Boot ~3,0 s. Bei 41 boot-Aufrufen über alle Suiten
# sind das ~123 s von ~129 s Gesamtlaufzeit – rund 95 % der Testzeit ist Hochfahren, nicht Testen.
# Gegengemessen: der Fragen-Pool ist NICHT die Ursache (Boot mit 20 statt 977 Fragen dauert
# identisch 2,96 s), und die sieben Suiten ohne jsdom laufen zusammen unter 2 s. Der einzige
# Hebel ohne Abdeckungsverlust ist deshalb Nebenläufigkeit.
# GEMESSEN: 5 Suiten sequenziell 15,7 s -> mit -P3 7,2 s (Faktor 2,2 auf 2 Kernen).
# ⚠️ DIE AUSGABE BLEIBT DETERMINISTISCH: Jede Suite schreibt in eine eigene Datei, ausgewertet
# wird danach in fester Glob-Reihenfolge. Sonst wäre die Ausgabe bei jedem Lauf anders sortiert
# und Diffs zwischen zwei Läufen wertlos.
# ⚠️ Fehlt die .rc-Datei (Prozess abgestürzt/abgeschossen), gilt die Suite als GEFALLEN – nicht
# als übersprungen. Ein stiller Ausfall wäre genau die „immer grün"-Falle aus R2a.
# Übersteuerbar mit CHECK_JOBS=1 (dann faktisch sequenziell, für die Fehlersuche).
KERNE="$( (command -v nproc >/dev/null 2>&1 && nproc) || echo 2 )"
JOBS="${CHECK_JOBS:-$((KERNE + 1))}"
case "$JOBS" in ''|*[!0-9]*) JOBS=2 ;; esac
[ "$JOBS" -lt 1 ] && JOBS=1
[ "$JOBS" -gt 8 ] && JOBS=8
LAUF="$WORK/_lauf"; mkdir -p "$LAUF"
cat > "$WORK/_runsuite.sh" <<'EOS'
#!/bin/bash
# $1 = Suitenname (ohne .js), $2 = Ausgabeverzeichnis. Laeuft im flachen Arbeitsverzeichnis.
# ⚠️ HARTER DECKEL je Suite: Ohne ihn blockiert eine einzige haengende Suite den ganzen Lauf, und
#    zwar OHNE Befund – man sieht nur, dass nichts mehr passiert. Mit Deckel wird daraus ein
#    normaler Fehlschlag (rc=124), den die Auswertung meldet. Uebersteuerbar mit SUITE_TIMEOUT.
cd "$(dirname "$0")" || exit 1
timeout "${SUITE_TIMEOUT:-180}" node "$1.js" > "$2/$1.out" 2>&1
RC=$?
[ "$RC" -eq 124 ] && echo "[check.sh] ABBRUCH: Suite lief laenger als ${SUITE_TIMEOUT:-180}s" >> "$2/$1.out"
echo "$RC" > "$2/$1.rc"
EOS
chmod +x "$WORK/_runsuite.sh"

# ── BLOCK-MODUS (2026-07-26) ─────────────────────────────────────────────────────────────────
# bash check.sh block start   Vorpruefungen + Arbeitsverzeichnis + Suitenplan (Ergebnisse werden geleert)
# bash check.sh block weiter  faehrt so viele OFFENE Suiten, wie ins Zeitbudget passen (wiederholen!)
# bash check.sh block ende    Determinismus + Drift-Guard + Auswertung ALLER Suiten + Gesamturteil
if [ "$MODUS" = "block" ]; then
  # ⚠️ KEINE FESTE BLOCKGROESSE. Erster Entwurf hatte "11 Suiten je Block" – gemessen ~35 s.
  #    Zwei Stunden spaeter brauchte EINE EINZIGE Suite 18 s (Sandbox unter Last), womit jeder
  #    feste Wert falsch ist: mal verschenkt er Zeit, mal reisst er den Deckel. Deshalb laeuft
  #    "block weiter" gegen ein ZEITBUDGET und faehrt so viele offene Suiten, wie hineinpassen.
  # Sekunden je Aufruf. Der Sandbox-Deckel liegt bei 45 s; 36 laesst Luft fuer Start und Ausgabe.
  # GEMESSEN 26.07. bei langsamer Maschine (18 s je Suite): mit 30 wurde JEDE Welle abgeschnitten,
  # der Lauf kam nicht voran. Wer eine noch langsamere Umgebung hat, setzt CHECK_JOBS=1.
  BUDGET="${CHECK_BUDGET:-36}"
  PLAN="$WORK/_alle.txt"; FINGER="$WORK/_fingerabdruck.txt"
  # Fingerabdruck ueber alle Quelldateien: verhindert einen STILL GEMISCHTEN Lauf, bei dem die
  # ersten Bloecke gegen alten und die spaeteren gegen neuen Code liefen.
  # shellcheck disable=SC2012  # ls -lL liefert Groesse + mtime fuer den Fingerabdruck - gewollt (N45 W1)
  fingerabdruck(){ ls -lL --time-style=+%s referenz/logik.js neu/src/kern/tabellen/*.ts referenz/app_*.js \
      tests/*.js pool/*.json referenz/sw.js referenz/index.html referenz/lernprogramm_ap1.html 2>/dev/null | awk '{print $5, $6, $7}' | md5sum; }
  case "$UNTER" in
    start)
      rm -rf "$LAUF"; mkdir -p "$LAUF"; rm -f "$WORK/_versuche.txt"   # Versuchszaehler mit zuruecksetzen
      compgen -G "$WORK/test_*.js" | xargs -n1 basename | sed 's/\.js$//' | sort > "$PLAN"
      fingerabdruck > "$FINGER"
      ANZ=$(wc -l < "$PLAN")
      echo "==================================="
      [ "$FEHLER" -eq 0 ] && echo "BLOCK-START OK – $ANZ Suiten vorgemerkt." \
                          || echo "$FEHLER PROBLEM(E) schon vor den Suiten – erst die beheben."
      echo "Jetzt so oft 'bash check.sh block weiter', bis es ALLE ERLEDIGT meldet, dann 'bash check.sh block ende'."
      [ "$FEHLER" -eq 0 ] && exit 0 || exit 1 ;;
    weiter)
      [ -s "$PLAN" ] || { echo "[FEHLER] Kein Blockplan – zuerst 'bash check.sh block start'."; exit 2; }
      if [ "$(fingerabdruck)" != "$(cat "$FINGER")" ]; then
        echo "[FEHLER] Quelldateien haben sich seit 'block start' geaendert."
        echo "         Ein gemischter Lauf waere wertlos – bitte mit 'bash check.sh block start' neu beginnen."
        exit 2
      fi
      # Offen = noch keine .rc-Datei. Damit ist der Fortschritt am ERGEBNIS abgelesen und nicht an
      # einem mitgezaehlten Blockindex, der nach einem Abbruch mitten im Lauf falsch waere.
      OFFEN="$(while read -r n; do [ -f "$LAUF/$n.rc" ] || echo "$n"; done < "$PLAN")"
      if [ -z "$OFFEN" ]; then echo "ALLE ERLEDIGT – weiter mit 'bash check.sh block ende'."; exit 0; fi
      ENDE=$(( $(date +%s) + BUDGET )); GEFAHREN=0
      # Wellen zu je $JOBS Suiten; vor jeder Welle die Uhr pruefen. So passt der Aufruf in den
      # Deckel, egal wie schnell die Maschine gerade ist.
      # ⚠️ Die Welle bekommt zusaetzlich das RESTBUDGET als harten Deckel. Wird sie abgeschnitten,
      #    entsteht keine .rc – die Suite bleibt schlicht offen und der naechste Aufruf holt sie.
      #    Damit das nicht ewig kreist, zaehlt _versuche.txt die Anlaeufe: nach dem dritten
      #    vergeblichen wird die Suite als GEFALLEN verbucht statt weiter im Kreis zu laufen.
      VERSUCHE="$WORK/_versuche.txt"; touch "$VERSUCHE"
      while [ -n "$OFFEN" ] && [ "$(date +%s)" -lt "$ENDE" ]; do
        WELLE="$(echo "$OFFEN" | head -n "$JOBS")"
        REST_S=$(( ENDE - $(date +%s) )); [ "$REST_S" -lt 5 ] && break
        for n in $WELLE; do echo "$n" >> "$VERSUCHE"; done
        echo "$WELLE" | timeout "$REST_S" xargs -P "$JOBS" -I{} "$WORK/_runsuite.sh" {} "$LAUF" || true
        for n in $WELLE; do printf '  %-22s rc=%s\n' "$n" "$(cat "$LAUF/$n.rc" 2>/dev/null || echo 'abgeschnitten, wird wiederholt')"; done
        GEFAHREN=$(( GEFAHREN + $(echo "$WELLE" | wc -l) ))
        OFFEN="$(echo "$OFFEN" | tail -n +$(( $(echo "$WELLE" | wc -l) + 1 )))"
      done
      # Dauerkandidaten nach drei Anlaeufen hart als Fehlschlag verbuchen.
      while read -r n; do
        [ -f "$LAUF/$n.rc" ] && continue
        [ "$(grep -c "^$n\$" "$VERSUCHE")" -ge 3 ] || continue
        echo "[check.sh] Suite wurde 3x angesetzt und wurde nie fertig – als Fehlschlag verbucht." > "$LAUF/$n.out"
        echo 125 > "$LAUF/$n.rc"
        echo "  $n: dreimal vergeblich angesetzt – gilt jetzt als GEFALLEN."
      done < "$PLAN"
      REST="$(while read -r n; do [ -f "$LAUF/$n.rc" ] || echo "$n"; done < "$PLAN" | grep -c . || true)"
      echo "[info] $GEFAHREN Suiten angesetzt, noch $REST offen."
      [ "$REST" -eq 0 ] && echo "ALLE ERLEDIGT – weiter mit 'bash check.sh block ende'." \
                        || echo "Noch einmal 'bash check.sh block weiter'."
      exit 0 ;;
    ende)
      [ -s "$PLAN" ] || { echo "[FEHLER] Kein Blockplan – zuerst 'bash check.sh block start'."; exit 2; }
      if [ "$(fingerabdruck)" != "$(cat "$FINGER")" ]; then
        echo "[FEHLER] Quelldateien haben sich waehrend des Laufs geaendert – Ergebnis waertlos, neu beginnen."
        exit 2
      fi
      # Nicht gefahrene Bloecke MUESSEN auffallen (sonst waere ein halber Lauf 'gruen').
      while read -r n; do
        [ -f "$LAUF/$n.rc" ] || melde "$n: nie gefahren – ein Block wurde ausgelassen"
      done < "$PLAN" ;;
    *)
      echo "Aufruf: bash check.sh block <start|weiter|ende>"; exit 2 ;;
  esac
else
  echo "[info] $(compgen -G "$WORK/test_*.js" | wc -l) Suiten, $JOBS parallel ..."
  compgen -G "$WORK/test_*.js" | xargs -n1 basename | sed 's/\.js$//' \
    | xargs -P "$JOBS" -I{} "$WORK/_runsuite.sh" {} "$LAUF"
fi
for tf in "$WORK"/test_*.js; do
  name="$(basename "$tf" .js)"
  OUT="$(cat "$LAUF/$name.out" 2>/dev/null)"
  if [ -f "$LAUF/$name.rc" ]; then C="$(cat "$LAUF/$name.rc")"; else C=1; OUT="$OUT
[check.sh] kein Rueckgabewert – Suite abgebrochen oder abgestuerzt"; fi
  LINE="$(echo "$OUT" | grep -E 'OK|Fehler|FEHLER' | tail -1)"
  if [ "$C" -eq 0 ]; then ok "$name ($LINE)"; else melde "$name ($LINE)"; echo "$OUT" | tail -20; fi
  pruefe_zahl "$name" "$OUT"
done
fi   # T_SUITEN

# 2b) Determinismus-Pruefung (test_logik 2x) ENTFALLEN mit N34 T6c (E57): test_logik.js liegt in referenz/tests/,
#     die Gleichheitstests in neu/src/kern wuerfeln geseedet.

# 3 + 4b/4c/4d) stehen seit FB-R3.12 in billige_guards() (Abschnitt 1d) und laufen auch im
# Schnell-Check. Hier nur noch der Aufruf plus der teure Drift-Guard.

# 4) Präventiv-Guards (fangen dokumentierte Footguns automatisch)
# 4a) ⛔ Drift-Guard "fragen.js == pool-Build" ENTFALLEN (N29 Teil 2, 24.09.2026, E40): es gibt kein
#     Bauergebnis mehr im Repo. Der Pool wird direkt gelesen und geprueft (tools/pool_laden.js, Abschnitt 1).
# ── DOM-SCHNAPPSCHUSS: IST DIE STRUKTUR DER SCREENS NOCH DIESELBE? (neu 10.09.2026) ──
# ⚠️ ANLASS: der Umbau der Darstellungsschicht fasst genau die Schicht an, die 41 der 45 Suiten
#    pruefen. Die Suiten pruefen VERHALTEN - ob ein Knopf bucht, ob eine Antwort richtig
#    bewertet wird. Ein Element, das beim Umbauen still verschwindet, faellt keiner von ihnen
#    auf; dem Lerner sofort. Gemessen an einer Sabotage: ein entfernter Navigationspunkt
#    schlaegt hier auf ALLEN 19 Screens an und nennt das verlorene 'button.aktiv.nav-item'.
# ⛔ ER PRUEFT KEIN AUSSEHEN. Abstaende, Farben, Groessen sieht er nicht - dafuer ist der
#    Bildvergleich da, und der ist bewusst KEIN Waechter, weil man seine Referenz wegdrueckt.
# ⚠️ STEHT HIER UNTEN, weil er jsdom braucht: NODE_PATH wird erst nach dem Waechterblock
#    gesetzt. Weiter oben eingebaut waere er still uebersprungen worden.
# ⛔ N29 Teil 2 (24.09.2026, E43): AUS DEM LAUF GENOMMEN. Der Schnappschuss friert die Struktur der
#    ALTEN Oberflaeche ein - dieselbe Sorte wie die (c)-Suiten nach E21, und die alte App wird nicht
#    mehr entwickelt (E17). Werkzeug und Referenz bleiben (Tag alt-app-final). ⚠️ So wie es liegt,
#    laeuft es NICHT: die HTML steht in referenz/, `logik.js` an der Wurzel ("Could not load script").

abschnitt_4f
# N49 W2: nur ein gruener VOLLER Lauf stempelt (block/schnell/neu nicht) - tools/gitc.sh push prueft den Stempel.
if [ "$MODUS" = "teil" ]; then   # N42 B5: ein Teil stempelt nie und sagt nie „ALLES GRÜN" - das urteilt der Sammel-Job
  if [ "$FEHLER" -eq 0 ]; then echo "TEIL $UNTER GRÜN"; exit 0; else echo "$FEHLER PROBLEM(E) – siehe oben (TEIL $UNTER)"; exit 1; fi
fi
if [ "$FEHLER" -eq 0 ]; then [ "$MODUS" = "voll" ] && bash tools/check_stempel.sh schreibe voll; echo "ALLES GRÜN"; exit 0; else echo "$FEHLER PROBLEM(E) – siehe oben"; exit 1; fi
