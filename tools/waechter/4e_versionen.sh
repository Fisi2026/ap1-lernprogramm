# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh (N37 U6, E60) - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # =============== DIE VIER STAND-GUARDS: 4e, 4e2, 4e2b, 4e2b2 ===============
  # Sie pruefen dieselbe Klasse: stimmt das, was die DOKU ueber den Auslieferungsstand sagt, mit
  # dem ueberein, was Code und git ZEIGEN? Versionen (4e) - Standzeile (4e2) - Auslieferungszeile
  # (4e2b) - ungepushte Commits MIT Wirkung beim Lerner (4e2b2).
  # ⛔ KEIN UMBAU IHRER LOGIK (W1 Etappe E, Entscheid 10.09.2026): sie sind verschieden genug.
  #    Die Ueberschrift sagt, dass sie zusammengehoeren - mehr soll sie nie tun.
  # ⚠️ NAMENSKOLLISION, BEWUSST STEHENGELASSEN: der Waechter "VERWEIS-ZIELE" weiter unten traegt
  #    EBENFALLS die Nummer 4e2. Gefunden am 10.09. beim Setzen dieser Ueberschrift. Umbenennen
  #    ist ein Entscheid, kein Aufraeumen - deshalb steht es hier und nicht heimlich korrigiert.
  # ===========================================================================
  # 4e) VERSIONS-GLEICHKLANG (neu 2026-07-27). Ein Release fasst DREI Stellen an:
  #     app_state.js APP_VERSION · sw.js CACHE_VERSION · CHANGELOG.md-Abschnitt.
  #     ⚠️ BIS HEUTE BEWACHTE DAS NICHTS. Wer sw.js vergisst, liefert eine neue App unter dem alten
  #     Cache-Schluessel aus – der Service Worker gibt dann weiter die ALTE Fassung heraus. Das ist
  #     ein stiller, fuer den Lerner sichtbarer Fehler, den keine Suite bemerkt haette: Die Tests
  #     pruefen Verhalten im jsdom, nicht die Auslieferung. Die Release-Action wiederum liest nur
  #     APP_VERSION und haette einen falschen sw.js anstandslos getaggt.
  #     Der Wächter kostet nichts und schliesst die Luecke fuer jedes kuenftige Release.
  # ►► N29 Teil 2 (24.09.2026, E41): die EINZIGE Quelle der Version ist `neu/package.json` "version".
  #    `app_state.js`/`sw.js` gehoeren der alten App (jetzt `referenz/`). Der Gleichklang wird gegen
  #    den AUSGELIEFERTEN Neubau-SW geprueft: `v2/app-sw.js` traegt `ap1-app-<v>` aus dem Bau. Wer die
  #    Version hebt und nicht neu baut, liefert den alten Cache-Schluessel aus - genau die alte Luecke.
  local AV SV
  AV="$(node -e "process.stdout.write(String(require('./neu/package.json').version||''))" 2>/dev/null | grep -oE '^[0-9]+\.[0-9]+\.[0-9]+$')"
  # NP1 (26.09.2026): hinter der Version steht der Stempel der Dateiliste (`-<8 hex>`).
  SV="$(grep -aoE '"ap1-app-[0-9]+\.[0-9]+\.[0-9]+(-[0-9a-f]{8})?"' v2/app-sw.js 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)"
  if [ -z "$AV" ]; then
    melde "Versions-Guard: version in neu/package.json nicht lesbar (Single Source of Truth)"
  elif [ "$AV" != "$SV" ]; then
    melde "Versions-Guard: neu/package.json $AV != v2/app-sw.js ap1-app-${SV:-?} - neu bauen (cd neu && npx vite build)"
  elif ! grep -aq "^## v$AV\$" CHANGELOG.md; then
    melde "Versions-Guard: CHANGELOG.md hat keinen Abschnitt '## v$AV' - die Release-Action bricht daran ab"
  else
    ok "Versions-Gleichklang (neu/package.json $AV == v2/app-sw.js == CHANGELOG)"
  fi

