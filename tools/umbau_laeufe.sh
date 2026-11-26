# shellcheck shell=bash disable=SC2034  # NEU_COV, UMBAU_AUS, UMBAU_RC liest der gesourcte Waechter 4f_umbau
# tools/umbau_laeufe.sh - die vier teuren Laeufe von Waechter 4f_umbau (tsc, oxlint, vitest, Bau), EINMAL definiert.
# Wird von check.sh GESOURCT, nie allein aufgerufen.
#
# N51 A2 (12.10.2026, Nutzer-Entscheid BUILD_LOG 147: „behalten, wenn schneller", gilt auch in der CI).
# GEMESSEN 12.10. (Cloud, 2 Kerne): voller check.sh 240 s, davon 4f_umbau 214 s, darin vitest 215 s allein
#   (tsc 4 s, oxlint 2 s, Bau 2 s). Alles andere (7 Suiten, 30 Waechter) ~25 s - und lief NACHEINANDER davor.
# ►► Darum startet check.sh die vier Laeufe gleich nach den Vorpruefungen im Hintergrund; 4f_umbau holt an
#    seiner alten Stelle nur noch die Ergebnisse ab. Ausgabe, Reihenfolge und Urteil bleiben gleich - es
#    aendert sich nur, WANN gerechnet wird.
# ⛔ Ein Lauf, dessen .rc nicht kommt (abgestuerzt, Deckel), ist ROT, nie gruen (rc 125, Meldung im Text).
# ⚠️ CHECK_SERIELL=1 schaltet den Vorlauf ab (Fehlersuche, Vergleichsmessung) - dann rechnet 4f_umbau wie
#    bis 12.10. selbst, mit denselben Befehlen (umbau_* unten), also ohne zweite, driftende Fassung.

# Ein Name JE LAUF ($$): bricht check.sh ab (Deckel, Strg+C), kann ein verwaister vitest-Prozess noch spaeter
#   schreiben - gemessen 12.10.: `kill $(jobs -p)` im trap erreicht die Enkel (npx -> node) nicht. Mit eigenem
#   Namen ueberschreibt er nie den Bericht eines spaeteren Laufs. Weggeraeumt wird er im trap von check.sh.
NEU_JSON="_to_delete/helfer/vitest.$$.json"
# NP4 (Nachpruefung 26.09.2026): in der CI (CI=true) laeuft DERSELBE Lauf mit Coverage.
NEU_COV=""; NEU_COV_ARGS=()
if [ "${CI:-}" = "true" ]; then
  NEU_COV_ARGS=(--coverage --coverage.reporter=json-summary --coverage.reportsDirectory=../_to_delete/helfer/coverage)
  NEU_COV="${NEU_COV_ARGS[*]}"   # nur als Merker fuer 4f_umbau (Coverage-Zeile)
fi

umbau_tsc()    { ( cd neu && npx tsc -b --noEmit 2>&1 ); }
# ⛔ 12.10.2026 (BUILD_LOG 147): oxlint laesst in KI-Sitzungen (CLAUDECODE/AI_AGENT) die Summenzeile weg.
umbau_oxlint() { ( cd neu && env -u CLAUDECODE -u AI_AGENT npx oxlint 2>&1 | sed 's/\x1b\[[0-9;]*m//g' ); }
# N42 (18.10.2026, Nutzer-Entscheid Option A): vitest in Haeppchen. GEMESSEN 18.10. (Cloud, 2 Kerne): ein Lauf mit Coverage
#   416 s; drei Shards (--shard=i/3) 182/132/132 s, danach `--merge-reports` 3 s mit IDENTISCHER Coverage und denselben Tests.
#   * VITEST_SHARD=i/n (nur CI-Matrix): dieser Job faehrt EIN Haeppchen, schreibt einen Blob (_to_delete/helfer/vitest-blob/)
#     und den json-Bericht wie sonst; Coverage an, Schwellen AUS (ein Shard sieht nur einen Teil - sie muessten scheitern).
#     Rot/gruen heisst hier nur: Tests dieses Shards. Die Schwellen prueft der Merge.
#   * VITEST_MERGE=1 (`bash check.sh teil tests-merge`): fuehrt die Blobs zusammen, mit den Schwellen aus vitest.config.ts
#     (CI=true: Coverage an) - der Bericht ist derselbe wie beim Einzellauf, 4f_umbau urteilt wie bisher.
#   * Ohne beide Variablen bleibt alles wie vor N42.
VITEST_BLOB_DIR="_to_delete/helfer/vitest-blob"
# N52 (19.10.2026, Nutzer-Entscheid, BUILD_LOG 228): LOKAL die Worker-Zahl von vitest begrenzen.
# ⛔ GEMESSEN auf dem PC des Nutzers (12 logische Kerne): `trace` braucht ALLEIN 19,8 s, im vollen
#    `check.sh` kippte er in die 60-s-Grenze, und `kalkulation`/`mehrfach` fielen mit "Unable to find
#    a label" - weil vitest bis zu 11 Worker fuehrt UND check.sh daneben 7 Suiten, tsc, oxlint und den
#    Bau rechnet. CHECK_SERIELL=1 half nicht: es schaltet nur den Vorlauf ab, nicht vitests eigene
#    Parallelitaet. ►► Die HAELFTE der Kerne fuer vitest, die andere fuer alles, was daneben laeuft.
# ⚠️ In der CI NICHT begrenzen (2 Kerne, 3 Shards - dort gibt es die Ueberbuchung nicht); Erkennung an $CI.
#    Eigene Zahl zum Nachmessen: VITEST_WORKER=<n>.
NEU_WORKER=()
if [ -n "${VITEST_WORKER:-}" ]; then
  NEU_WORKER=(--maxWorkers="$VITEST_WORKER")
elif [ -z "${CI:-}" ]; then
  _k="$(node -e 'process.stdout.write(String(Math.max(2, Math.floor(require("os").cpus().length / 2))))' 2>/dev/null)"
  [ -n "$_k" ] && NEU_WORKER=(--maxWorkers="$_k")
fi

umbau_vitest() {
  rm -f "$NEU_JSON"
  if [ -n "${VITEST_SHARD:-}" ]; then
    mkdir -p "$VITEST_BLOB_DIR"; rm -f "$VITEST_BLOB_DIR"/blob-"${VITEST_SHARD//\//-}".json
    ( cd neu && npx vitest run --shard="$VITEST_SHARD" --reporter=blob --reporter=json \
        --outputFile.blob="../$VITEST_BLOB_DIR/blob-${VITEST_SHARD//\//-}.json" --outputFile.json="../$NEU_JSON" \
        --coverage --coverage.reporter=json-summary --coverage.reportsDirectory=../_to_delete/helfer/coverage-shard \
        --coverage.thresholds.statements=0 --coverage.thresholds.branches=0 \
        --coverage.thresholds.functions=0 --coverage.thresholds.lines=0 >/dev/null 2>&1 )
  elif [ -n "${VITEST_MERGE:-}" ]; then
    # Ein fehlender Blob (Shard-Job rot, Artefakt weg) darf nicht zu einem "gruenen" Teil-Merge werden.
    local n=0 soll="${VITEST_MERGE_N:-3}" b
    for b in "$VITEST_BLOB_DIR"/blob-*.json; do [ -e "$b" ] && n=$((n+1)); done
    if [ "$n" -ne "$soll" ]; then echo "[check.sh] $n Blob(s) in $VITEST_BLOB_DIR, erwartet $soll" >&2; return 125; fi
    ( cd neu && npx vitest run --merge-reports="../$VITEST_BLOB_DIR" --reporter=json --outputFile="../$NEU_JSON" "${NEU_COV_ARGS[@]}" >/dev/null 2>&1 )
  else
    ( cd neu && npx vitest run "${NEU_WORKER[@]}" --reporter=json --outputFile="../$NEU_JSON" "${NEU_COV_ARGS[@]}" >/dev/null 2>&1 )
  fi
}
umbau_bau()    { ( cd neu && npx vite build --outDir "$1" --emptyOutDir 2>&1 ); }

# N42 B5 (ENTWURF): `bash check.sh teil ...` fuehrt nur einen Teil der vier Laeufe (UMBAU_TEIL, von check.sh gesetzt);
#   ohne Setzung (voll, neu, andere Aufrufer) sind alle vier aktiv - unveraendertes Verhalten.
umbau_aktiv() { case " ${UMBAU_TEIL-tsc oxlint vitest bau} " in *" $1 "*) return 0 ;; esac; return 1; }

UMBAU_VORAB=""            # Ordner der Hintergrund-Laeufe; leer = 4f_umbau rechnet selbst
umbau_vorab_starten() {   # $1 = Ordner (unter $WORK), $2 = Ausgabeordner des Probebaus
  UMBAU_VORAB="$1"; mkdir -p "$UMBAU_VORAB"
  local n
  for n in tsc oxlint vitest; do
    umbau_aktiv "$n" || continue
    ( "umbau_$n" > "$UMBAU_VORAB/$n.out" 2>&1; echo $? > "$UMBAU_VORAB/$n.rc" ) &
  done
  if umbau_aktiv bau; then ( umbau_bau "$2" > "$UMBAU_VORAB/bau.out" 2>&1; echo $? > "$UMBAU_VORAB/bau.rc" ) & fi
  echo "[info] 4f-Laeufe (tsc, oxlint, vitest, Bau) im Hintergrund gestartet (N51 A2; seriell: CHECK_SERIELL=1)"
}

# umbau_hole <name> [arg] - setzt UMBAU_AUS (Ausgabe) und UMBAU_RC. Mit Vorlauf: wartet auf dessen .rc
# (hoechstens UMBAU_WARTE_S, Vorgabe 1200 s - vitest selbst hat Deckel je Test); ohne: rechnet jetzt.
umbau_hole() {
  local n="$1" t=0 max="${UMBAU_WARTE_S:-1200}"
  if [ -n "$UMBAU_VORAB" ]; then
    while [ ! -f "$UMBAU_VORAB/$n.rc" ] && [ "$t" -lt "$max" ]; do sleep 1; t=$((t+1)); done
    UMBAU_AUS="$(cat "$UMBAU_VORAB/$n.out" 2>/dev/null)"
    if [ -f "$UMBAU_VORAB/$n.rc" ]; then UMBAU_RC="$(cat "$UMBAU_VORAB/$n.rc")"
    else UMBAU_RC=125; UMBAU_AUS="$UMBAU_AUS
[check.sh] Hintergrund-Lauf '$n' lieferte nach ${max}s keinen Rueckgabewert"; fi
  else
    UMBAU_AUS="$("umbau_$n" "${2:-}")"; UMBAU_RC=$?
  fi
}
