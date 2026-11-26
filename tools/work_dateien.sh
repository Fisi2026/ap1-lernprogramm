# shellcheck shell=bash
# tools/work_dateien.sh – EINE Kopierliste fuer das flache Testarbeitsverzeichnis.
#
# ⚠️ WARUM ES DIESE DATEI GIBT (28.07.2026): Die Liste stand ZWEIMAL – in check.sh (fuelle_work)
# und in tools/suite.sh. Beide bauen dasselbe Verzeichnis, aus verschiedenen Zeilen.
# An diesem Tag ist genau das passiert: `laengen_ausnahmen.json` wurde nur in check.sh ergaenzt,
# `tools/suite.sh` lief daraufhin rot mit "Cannot find module ./laengen_ausnahmen.json".
# Der Kommentar "wer hier etwas ergaenzt, ergaenzt es dort ebenfalls" stand da bereits.
# ►►► EIN KOMMENTAR ERZWINGT NICHTS. Deshalb jetzt eine Quelle, die beide SOURCEN.
#
# ⚠️ GEMESSEN 2026-07-26 UND WEITER GUELTIG: Ein von Hand nachgebautes Verzeichnis OHNE app.html
# lieferte 35 rote Suiten mit "ENOENT app.html". Ein solcher Lauf ist nicht rot, sondern WERTLOS.
# Wer hier etwas ergaenzt, ergaenzt es damit fuer BEIDE Betriebsarten – das ist der Zweck.
#
# Aufruf:  . tools/work_dateien.sh   dann   work_dateien_kopieren "$WORK"
# Erwartet das Projektwurzelverzeichnis als aktuelles Verzeichnis.

work_dateien_kopieren() {
  ZIEL="$1"
  [ -d "$ZIEL" ] || { echo "[work_dateien] Zielverzeichnis fehlt: $ZIEL" >&2; return 1; }

  # Kern: Logik, Pool-Erzeugnisse und alle App-Module (require-Pfade der Tests sind relativ).
  # ►► N29 Teil 2 (24.09.2026, E39): die alte App liegt in `referenz/` (nicht ausgeliefert). Die
  #    Suiten mit `boot()` laden sie weiter - FLACH kopiert wie bisher, nur aus dem neuen Ort.
  #    N34 T6c (27.09.2026): `logik.js` und `app_glossar.js` gibt es nur noch in `referenz/` - app.html
  #    (Boot-Suiten, probe_lernfluss) laedt sie per <script>, deshalb flach von dort.
  cp referenz/logik.js referenz/app_glossar.js "$ZIEL"/ 2>/dev/null
  # ►► N34 T6b (27.09.2026, E56): Abkuerzungen und Spickzettel haben ihre Quelle in
  #    `neu/src/kern/tabellen/*.ts`. Die alten Suiten (`require("./abkuerzungen.js")`) und app.html
  #    (`<script src=…>`) erwarten sie FLACH in UMD-Form – dieser Shim schreibt sie aus der Quelle.
  #    ⛔ Laut, nicht still: eine leere Tabelle bricht ab.
  # shellcheck disable=SC2016  # JavaScript fuer node -e, kein Shell-Ausdruck (N45 W1)
  node -e 'const fs = require("fs"), p = require("path"), z = process.argv[1], N = String.fromCharCode(10);
for (const [d, n] of [["abkuerzungen", "ABKUERZUNGEN"], ["spickzettel", "SPICKZETTEL"]]) {
  const w = require(p.resolve("neu", "src", "kern", "tabellen", d + ".ts"))[n];
  if (!w || !w.length) throw new Error("tabellen/" + d + ".ts: " + n + " leer");
  fs.writeFileSync(p.join(z, d + ".js"), `var ${n} = ${JSON.stringify(w)};` + N + `if (typeof module !== "undefined" && module.exports) module.exports = ${n};` + N);
}' "$ZIEL" || { echo "[work_dateien] Tabellen-Shim (abkuerzungen/spickzettel) fehlgeschlagen" >&2; return 1; }
  # ►► E40: fragen.js/faelle.js entstehen NUR hier, im Arbeitsordner, aus pool/*.json (die Suiten
  #    `require("./fragen.js")`, die alte HTML laedt sie per <script>). ⛔ Laut, nicht still: ein
  #    kaputter Pool bricht hier ab, statt Suiten gegen einen fehlenden Pool laufen zu lassen.
  node tools/pool_laden.js --js "$ZIEL" || { echo "[work_dateien] Pool nicht ladbar - node tools/pool_laden.js --pruefe" >&2; return 1; }
  cp referenz/app_state.js referenz/app_pool.js referenz/app_util.js referenz/app_ui.js \
     referenz/app_frage.js referenz/app_loeser.js referenz/app_verbuchen.js referenz/app_seiten.js \
     referenz/app_sim.js referenz/app_pages2.js referenz/styles.css "$ZIEL"/ 2>/dev/null

  # ⚠️ ANDERER NAME als im Projekt – tests/_harness.js oeffnet "app.html".
  cp referenz/lernprogramm_ap1.html "$ZIEL/app.html" 2>/dev/null

  # #39: test_pwa prueft Landing, Manifest und die SW-Cacheliste gegen die DATEIEN.
  cp referenz/index.html referenz/manifest.webmanifest referenz/sw.js "$ZIEL"/ 2>/dev/null

  # 2026-07-26: Icons/Screenshots, weil test_pwa seither prueft, dass JEDE Datei aus der
  # SW-Cacheliste wirklich existiert. Zusammen ~80 KB.
  cp icon-192.png icon-512.png apple-touch-icon-180.png \
     referenz/screenshot-start.png referenz/screenshot-ueben.png "$ZIEL"/ 2>/dev/null

  # 2026-07-28: Bestandsentscheide + Grenzwerte zum Laengenverhaeltnis.
  # tests/test_didaktik.js required die Datei flach (Waechter 5), tools/apply_batch.py liest
  # dieselbe aus der Wurzel – EINE Quelle fuer beide.
  cp laengen_ausnahmen.json "$ZIEL"/ 2>/dev/null

  # FB-R3.12: der Stripper wird von tests/test_entkommentiere.js flach required (46 Tests).
  cp tools/entkommentiere.js "$ZIEL"/ 2>/dev/null

  # Zuletzt die Suiten selbst, inkl. _harness.js (Abhaengigkeit, kein test_*).
  cp tests/*.js "$ZIEL"/ 2>/dev/null
}
