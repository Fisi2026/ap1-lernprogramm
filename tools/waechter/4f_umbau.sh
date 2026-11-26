# shellcheck shell=bash
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
if [ -d neu ]; then
  if [ ! -d neu/node_modules ]; then
    melde "Umbau neu/: node_modules fehlt - 'cd neu && npm install' (ohne das ist jedes Urteil hier wertlos)"
  else
    # N51 A2 (12.10.2026): die vier teuren Laeufe stehen EINMAL in tools/umbau_laeufe.sh; im vollen Lauf
    #   rechnen sie schon im Hintergrund, hier wird nur abgeholt (umbau_hole). Meldungen unveraendert.
    if umbau_aktiv tsc; then
    umbau_hole tsc; NEU_T="$UMBAU_AUS"; NEU_TRC="$UMBAU_RC"
    if [ "$NEU_TRC" -ne 0 ]; then
      melde "Umbau neu/ Typen: $(printf '%s' "$NEU_T" | head -3 | tr '\n' ' ')"
    else
      ok "Umbau neu/ Typen (tsc ohne Befund)"
    fi
    fi   # umbau_aktiv tsc

    # N32 (23.09.2026): oxlint mit NULL Warnungen. Gemessen 22.09.: 21 Warnungen, darunter echte
    # (Komponente im Zeichnen gebaut, Ref im Zeichnen beschrieben). Ohne diese Zeile kaemen sie
    # still zurueck. ⛔ Fehlt die Summenzeile, lief oxlint nicht - das ist rot, nicht gruen.
    # ⛔ 12.10.2026 (BUILD_LOG 147, Nutzer-Entscheid 11.10./12.10.): oxlint laesst in KI-Sitzungen (CLAUDECODE/AI_AGENT)
    #    die Summenzeile weg (regeln/bruecke.md 11.10.) - darum ohne diese beiden Variablen (tools/umbau_laeufe.sh).
    if umbau_aktiv oxlint; then
    umbau_hole oxlint; NEU_L="$UMBAU_AUS"
    NEU_LS="$(printf '%s' "$NEU_L" | grep -E '^Found [0-9]+ warnings? and [0-9]+ errors?' | head -1)"
    if [ -z "$NEU_LS" ]; then
      melde "Umbau neu/ oxlint: keine Summenzeile - lief nicht ($(printf '%s' "$NEU_L" | tail -2 | tr '\n' ' '))"
    elif [ "$NEU_LS" != "Found 0 warnings and 0 errors." ]; then
      melde "Umbau neu/ oxlint: $NEU_LS - 'cd neu && npx oxlint'"
    else
      ok "Umbau neu/ oxlint (0 Warnungen, 0 Fehler)"
    fi
    fi   # umbau_aktiv oxlint

    # WARNUNG, GEMESSEN AM 11.09.2026: aus der Bildschirmausgabe laesst sich die Testzahl
    # NICHT zuverlaessig lesen. "--reporter=basic" druckt gar keine Summenzeile, und die
    # Standardausgabe schiebt ANSI-Codes MIT ZIFFERN (ESC[32m) zwischen "Tests" und die Zahl -
    # jeder grep darauf ist Glueckssache. Deshalb der maschinenlesbare JSON-Bericht.
    # Dieselbe Klasse wie B158: ein Meldezweig ist erst geprueft, wenn jemand ihn liest.
    # NP4 (Nachpruefung 26.09.2026): in der CI (CI=true) laeuft DERSELBE Lauf mit Coverage – die Schwellen
    #   stehen in neu/vitest.config.ts; unterschreitet einer, ist der Rueckgabewert != 0 (Meldung unten).
    #   Vorher fuhr die CI alle Tests ein zweites Mal nur fuer die Coverage (~2-3 min).
    #   NEU_JSON und NEU_COV setzt tools/umbau_laeufe.sh (eine Quelle fuer Vorlauf und Direktlauf).
    if umbau_aktiv vitest; then
    umbau_hole vitest; NEU_VRC="$UMBAU_RC"; NEU_VAUS="$UMBAU_AUS"
    if [ -n "$NEU_COV" ] && [ -z "${VITEST_SHARD:-}" ] && [ -f _to_delete/helfer/coverage/coverage-summary.json ]; then
      node -e "var t=require(process.argv[1]).total;console.log('  Coverage: Anweisungen '+t.statements.pct+' % · Zweige '+t.branches.pct+' % · Funktionen '+t.functions.pct+' % · Zeilen '+t.lines.pct+' %')" ./_to_delete/helfer/coverage/coverage-summary.json 2>/dev/null
    fi
    NEU_N=""; NEU_F=""
    if [ -f "$NEU_JSON" ]; then
      NEU_N="$(node -e "try{var r=require(process.argv[1]);process.stdout.write(String(r.numPassedTests))}catch(e){}" "./$NEU_JSON" 2>/dev/null)"
      NEU_F="$(node -e "try{var r=require(process.argv[1]);process.stdout.write(String(r.numFailedTests))}catch(e){}" "./$NEU_JSON" 2>/dev/null)"
    fi
    # ⛔⛔ ANLASS 14.09.2026: `generator.gleichheit.test.ts` ist an einem Syntaxfehler
    #    KOLLABIERT - die Datei lief gar nicht erst an. Der JSON-Bericht meldete trotzdem
    #    **numFailedTests: 0**, weil in einer Datei ohne Testfall auch nichts fehlschlagen
    #    kann. Aufgefallen ist es nur, weil die GESAMTZAHL nicht stimmte (392 statt 412).
    #    ►► Eine Datei mit status != "passed" ist ab jetzt ein Fehler, egal was die
    #       Testzahlen sagen. "Kein Fehler" und "nicht gelaufen" sind zwei verschiedene
    #       Dinge, und nur eines davon ist gruen.
    NEU_KAPUTT="$(node -e "try{var r=require(process.argv[1]);var k=(r.testResults||[]).filter(function(d){return d.status!=='passed';});process.stdout.write(k.map(function(d){var t=d.name.split('/');return t[t.length-1];}).join(', '))}catch(e){}" "./$NEU_JSON" 2>/dev/null)"
    # BEFUND 16.09.2026: EIN ZEITUEBERSCHRITTENER TEST WURDE ALS "GAR NICHT GELAUFEN"
    #    GEMELDET. Die Datei war gelaufen, hatte fuenf Ergebnisse und genau einen roten
    #    Test - der Zweig oben griff trotzdem, weil er nur auf status != "passed" sieht
    #    und VOR der Fehlerzahl steht.
    #    >> Eine Meldung, die die falsche Ursache nennt, kostet mehr Zeit als keine: wer
    #       "gar nicht gelaufen" liest, sucht einen Syntaxfehler, waehrend in Wahrheit
    #       eine Zusicherung rot ist.
    #    Unterschieden wird jetzt am ERGEBNISSATZ: keine Ergebnisse = die Datei kam nicht
    #    an (der Fall vom 14.09.); Ergebnisse vorhanden = Tests sind rot.
    NEU_LEER="$(node -e "try{var r=require(process.argv[1]);var k=(r.testResults||[]).filter(function(d){return d.status!=='passed' && (d.assertionResults||[]).length===0;});process.stdout.write(k.map(function(d){var t=d.name.split('/');return t[t.length-1];}).join(', '))}catch(e){}" "./$NEU_JSON" 2>/dev/null)"
    if [ "$NEU_VRC" -eq 125 ]; then
      melde "Umbau neu/ Tests: $(printf '%s' "$NEU_VAUS" | tail -1)"
    elif [ -z "$NEU_N" ]; then
      melde "Umbau neu/ Tests: vitest liefert keinen JSON-Bericht - Werkzeug stumm (cd neu && npx vitest run)"
    elif [ -n "$NEU_LEER" ]; then
      melde "Umbau neu/ Tests: Datei(en) gar nicht gelaufen: $NEU_LEER - 'cd neu && npx vitest run' zeigt den Grund"
    elif [ "${NEU_F:-0}" -ne 0 ]; then
      melde "Umbau neu/ Tests: $NEU_F Fehler in $NEU_KAPUTT - cd neu && npx vitest run"
    elif [ -n "$NEU_KAPUTT" ]; then
      melde "Umbau neu/ Tests: Datei(en) nicht bestanden ohne roten Test: $NEU_KAPUTT - 'cd neu && npx vitest run' zeigt den Grund"
    elif [ "$NEU_VRC" -ne 0 ]; then
      melde "Umbau neu/ Tests: $NEU_N gruen, aber Rueckgabewert $NEU_VRC - in der CI meist die COVERAGE-SCHWELLE (neu/vitest.config.ts) - 'cd neu && npx vitest run --coverage'"
    # Sollwert 974 (N31, 22.09.: 989 in 65 Dateien; vorher 945) (Kopfzahl stand bis 22.09. veraltet auf 827, der Code auf 842): am 21.09.2026 (N25 P6a) waren es 842 in 57 Dateien (78 Vertrag + 10 Bestand
    # + 62 Antwortform + 5 logik-ueber-Vite + 55 Eingaben + 9 Instanziierung
    # + 4 Lueckentext-Bestand + 6 Bausteine-Bestand + 7 Freitext-Gleichheit
    # + 21 Lernstand-Gleichheit + 8 Verbuchen-Gleichheit + 11 Urteil
    # + 83 Auswahl-Gleichheit + 18 Ziehung + 20 Generator-Gleichheit + 15 Kennzahlen
    # + 5 Statistik-Schirm + 6 Einstellungen + 11 Fehler-Deck + 24 Ueben-Schirm
    # + 11 Themen-Serie (Regel) + 16 Spickzettel (Regel) + 5 Spickzettel-Schirm
    # + 11 Generator-Schirm (Regel) + 8 Generator-Schirm ueber die Schiene
    # + 18 Glossar (Regel) + 8 Glossar ueber die Schiene
    # + 14 Gantt (Regel) + 6 Gantt ueber die Schiene
    # + 16 Netzplan (Regel) + 7 Netzplan ueber die Schiene
    # + 20 Simulation (Kern) + 15 Simulation ueber die Schiene
    # + 4 Parallelbetrieb am Lernstand der alten App
    # + 7 Rueckseite vollstaendig, N19
    # + 10 Lesezeichen/Meldungen-Gleichheit + 8 Stern/Melden/Markiert ueber die App
    # + 2 Zurueck-Sperre bei Zufallsaufgabe als erster Karte, N20a
    # + 21 Server-API gegen SQLite + 12 Versand/Durchgang + 9 Online-Meldungen/Ansicht, N20b
    # + 11 Tagesserie (Regel) + 3 Tagesserie-Gleichheit + 4 Tagesserie-Schirm, N21
    # + 2 Grid-Rollbereiche mit auto-rows-max, Fix 17.09.
    # + 6 Adressen + 10 Startseite (Regel) + 10 Startseite/Einzelfrage/Adressen ueber die App, N22
    # + 9 Tooltip-Regel + 3 Tooltip-Gleichheit + 7 Tooltips/Lupe ueber die App, N23
    # + 16 Schalter-Regeln gegen die alte App + 16 Schalter-Wirkung ueber die App, N24
    # + 8 Typ-Hilfe gegen die alte App + 4 Typ-Hilfe ueber die App, N24b
    # + 35 Bedeutungs-Schnappschuss (14 Bereiche, 20 Fragetypen, 1 Determinismus), N25 P0
    # + 2 aus N25 P1/P2 (Stand nach P2: 833) + 2 Bedienung jenseits des ersten Klicks, N25 P3
    # + 5 Karte: alert nur fuers Urteil, Melden bleibt offen, N25 P4
    # + 15 Ueberschriften-Ebenen je Bereich, N25 P7: Stand 22.09.2026 = 857 in 58 Dateien)
    # + 76 Rechner-Parser (Regeln, Fehlertexte, 3000 Zufallsausdruecke, kein eval), N26 T1:
    # Stand 22.09.2026 = 933 in 59 Dateien
    # + 3 Rechner-Gleichheit gegen app_util.js (6169 Vergleiche in einem Test), N26 T2:
    # Stand 22.09.2026 = 936 in 60 Dateien
    # + 12 Rechner-Oberflaeche (32 Tasten, Tastatur, Speicher, Notiz nicht persistent), N26 T3:
    # Stand 22.09.2026 = 948 in 61 Dateien
    # + 11 Rechner in der App + 1 kein Rechner in der Simulation (vi.mock), N26 T4:
    # Stand 22.09.2026 = 960 in 63 Dateien.
    # Eine Untergrenze weit unter der Wirklichkeit ist ein schwaches Netz: faellt eine ganze
    # Datei stumm weg, soll das auffallen und nicht in der Toleranz verschwinden.
    # N29 Teil 2 (24.09.2026): 1047 + 17 altQuelle (die alte App liegt in referenz/) = 1064 in 73 Dateien
    # N28 (25.09.2026): + 4 Klausurvorbereitung (E47) + je 1 in schnappschuss/ueberschriften (neuer Bereich) = 1070 gemessen
    # N34 T1 (25.09.2026): vorher 1074 (= 1122 - 48; T0 hatte den Sollwert nicht nachgezogen). + 48 tabellen.gleichheit = 1122 in 75 Dateien
    # Pruefbericht (26.09.2026, BUILD_LOG 54): + 17 server/api (Haertung, Aufbewahrung, wrangler-Waechter) + 1 sw (_headers) + 2 daten/svg = 1142 in 76 Dateien
    # Audit v2.2.0 (BUILD_LOG 55) hat den Sollwert NICHT nachgezogen (Regel 6 verpasst) – hier nachgeholt.
    # N34 T2 (26.09.2026): gemessen 1174 in 80 Dateien (darin 13 bewertung.gleichheit).
    # Nachpruefung NP1/NP3 (26.09.2026): + 1 api (Koepfe) = 1175 in 80 Dateien (sw.test: Faelle erweitert, Zahl gleich).
    # N34 T3 (26.09.2026): + 18 lernen.gleichheit = 1193 in 81 Dateien.
    # N34 T5 (26.09.2026): + 36 generatoren.gleichheit = 1229 in 82 Dateien.
    # N34 T4 (26.09.2026): + 18 pruefung.gleichheit = 1247 in 83 Dateien.
    # N34 T6a (26.09.2026): + 4 validierung.gleichheit = 1251 in 84 Dateien.
    # N34 T6b (27.09.2026): - 83 (logik.jsdom + vertrag.test mit logik.ts/vertrag.ts weg) + 7 daten.gleichheit
    #   + 2 bewertung.gleichheit (istAutomatischBewertbar) = 1177 in 83 Dateien.
    # N34 T6c (27.09.2026): die Wurzel-logik.js ist weg - die zweite Quelle in den Gleichheitstests (describe.each)
    #   entfaellt, daten.gleichheit auf Form (7 -> 6) = 1113 in 83 Dateien (gemessen).
    # N37 U1 (27.09.2026): + 2 kern/architektur.test.ts = 1115 in 84 Dateien (14.10. N43 M2: wieder entfernt, -2).
    # N37 U3 (27.09.2026): + 2 daten/schema.deckung.test.ts = 1117 in 85 Dateien.
    # N38 P3 (28.09.2026, BUILD_LOG 89): seit U3 nicht nachgezogen (Neupruefung, P1: 1155 gemessen)
    #   + 3 huelle/faulschirme.test.ts + 2 validierung.gleichheit geteilt (1 -> 3) = 1160 in 89 Dateien.
    elif [ -n "${VITEST_SHARD:-}" ]; then
      # N42: ein Shard faehrt nur einen Teil (Summe + Schwellen prueft `teil tests-merge`) - hier gilt nur: alle Tests des Shards gruen.
      ok "Umbau neu/ Tests Shard $VITEST_SHARD ($NEU_N gruen)"
    elif [ "$NEU_N" -lt 1160 ]; then
      melde "Umbau neu/ Tests: nur $NEU_N Tests gefahren (erwartet mindestens 1160) - faehrt der Lauf ins Leere?"
    else
      ok "Umbau neu/ Tests ($NEU_N gruen)"
    fi
    fi   # umbau_aktiv vitest

    # ⛔⛔ SEIT 17.09.2026 IST DAS BAUERGEBNIS AUSLIEFERUNG, NICHT NUR PROBE. Der
    #    Neubau wird nach `v2/` im Wurzelordner gebaut und MITCOMMITTET, weil
    #    Cloudflare den Wurzelordner ausliefert und selbst nichts baut. Damit gibt
    #    es dieselbe Gefahr wie bei fragen.js: **das Bauergebnis kann von seiner
    #    Quelle abdriften**, und niemand merkt es - beim Lerner laeuft dann ein
    #    alter Stand, waehrend hier alles gruen ist.
    #    ►► Gebaut wird in einen WEGWERF-Ordner und mit `v2/` verglichen. Der
    #       Arbeitsbaum wird dabei NICHT angefasst.
    if umbau_aktiv bau; then
    NEU_PROBE="$WORK/v2probe"
    umbau_hole bau "$NEU_PROBE"; NEU_B="$UMBAU_AUS"; NEU_BRC="$UMBAU_RC"
    NEU_KB="$(printf '%s' "$NEU_B" | grep -oE 'index-[A-Za-z0-9_-]+\.js +[0-9,\.]+ kB' | grep -oE '[0-9,\.]+ kB' | head -1)"
    if [ "$NEU_BRC" -ne 0 ]; then
      melde "Umbau neu/ Bau: $(printf '%s' "$NEU_B" | tail -3 | tr '\n' ' ')"
    elif [ -z "$NEU_KB" ]; then
      melde "Umbau neu/ Bau: kein Buendel gemeldet - Werkzeug stumm"
    else
      ok "Umbau neu/ Bau ($NEU_KB Buendel)"
    fi

    # N32 Schritt 3 (23.09.2026, E31): DER EINSTIEG BLEIBT UNTER 500 KB GZIP.
    # ⚠️ ANLASS: bis N32 war alles EIN Stueck (3,02 MB, gzip 876-890 KB), der Pool
    #    per `import.meta.glob` eingebaut. Jetzt ist der Pool ein eigener Chunk
    #    (`pooldaten-*.js`), der Einstieg mass 212 KB gzip. Ein einziger statischer
    #    Import von `daten/pooldaten` zoege ihn zurueck - das faengt HIER die Zahl,
    #    `modulebene.test.ts` den Quelltext. Fehlt die Zahl, ist die Pruefung stumm = rot.
    # N38 P3 (28.09.2026, E63): acht Schirme laden erst beim Betreten (`huelle/faulschirme.ts`),
    #    der Einstieg fiel von 212 auf 164 KB gzip. GRENZE 190 = neues Ist + Reserve: ein Schirm,
    #    der statisch zurueck in den Einstieg rutscht (Simulation/Einstellungen/Spickzettel je 6-9 KB,
    #    die geteilten UI-Teile ~18 KB), soll hier auffallen, nicht erst in Lighthouse.
    if [ "$NEU_BRC" -eq 0 ]; then
      NEU_GZ="$(printf '%s' "$NEU_B" | sed 's/\x1b\[[0-9;]*m//g' | grep -E 'index-[A-Za-z0-9_-]+\.js ' | grep -oE 'gzip: *[0-9,\.]+ kB' | grep -oE '[0-9,\.]+' | tr -d ',' | head -1)"
      if [ -z "$NEU_GZ" ]; then
        melde "Umbau neu/ Einstieg gzip: keine Zahl im Bau-Protokoll - Werkzeug stumm"
      elif awk -v g="$NEU_GZ" 'BEGIN{exit !(g > 190)}'; then
        melde "Umbau neu/ Einstieg ${NEU_GZ} KB gzip > 190 KB (E31, N38 P3) - zieht ein statischer Import den Pool oder einen faulen Schirm zurueck?"
      else
        ok "Umbau neu/ Einstieg ${NEU_GZ} KB gzip (Grenze 190, Pool und acht Schirme eigene Chunks)"
      fi
    fi

    # Drift zwischen Quelle und ausgeliefertem Bauergebnis - dieselbe Klasse wie
    # "fragen.js == pool-Build". Verglichen werden Dateiliste UND Inhalte.
    if [ "$NEU_BRC" -eq 0 ] && [ -d "$NEU_PROBE" ]; then
      if [ ! -d v2 ]; then
        melde "Auslieferung v2/: fehlt ganz - 'cd neu && npx vite build' und mitcommitten"
      elif ! diff -r -q "$NEU_PROBE" v2 >/dev/null 2>&1; then
        melde "Auslieferung v2/ weicht vom Bau ab - 'cd neu && npx vite build', dann committen"
      else
        ok "v2/ == neu-Build (kein Drift)"
      fi
    fi
    fi   # umbau_aktiv bau
  fi
else
  ok "Umbau neu/ (nicht vorhanden - uebersprungen)"
fi
