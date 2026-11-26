# shellcheck shell=bash
# tools/spiegel.sh – EINE Quelle fuer die Frage „ist der node_modules-Spiegel benutzbar?"
#
# ══════════ WARUM ES DIESE DATEI GIBT (30.07.2026) ══════════
# `tools/suite.sh` und `check.sh` beantworten dieselbe Frage, und beide beantworteten sie TEUER:
# durch Abzaehlen aller Dateien unter `.tooling/node_modules`. Gemessen an diesem Tag:
#
#     find .tooling/node_modules -type f | wc -l   ->  2085 ms   (2359 Dateien, auf dem MOUNT)
#     dasselbe im Spiegel unter /tmp               ->     7 ms
#     node -e "require('jsdom')"                   ->   697 ms
#
# Das sind ~2,8 s Buchhaltung VOR dem ersten Test – bei JEDEM Aufruf. `suite.sh axe` brauchte
# damit 8,1 s, wovon die Suite selbst 5,0 s war. Bei einem `check.sh block`-Lauf faellt es
# viermal an, bei einer Arbeitssitzung mit zwanzig Suiten-Aufrufen ueber eine Minute.
# ►►► Der Mount ist langsam. **Was auf dem Mount gezaehlt wird, sollte nicht bei jedem Aufruf
#     neu gezaehlt werden.**
#
# DER STEMPEL: Nach einer vollstaendig geprueften Spiegelung liegt in `$SPIEGEL/.spiegel_stempel`
# der Schluessel `<mtime> <groesse>` von `.tooling/package-lock.json`. Die Datei schreibt npm bei
# JEDER Installation neu – aendert sich an den Abhaengigkeiten etwas, passt der Stempel nicht mehr
# und der teure Weg laeuft erneut. Ein `stat` darauf kostet 2 ms statt 2085 ms.
#
# ⚠️ DER STEMPEL ERSETZT DIE PRUEFUNG NICHT, ER MERKT SICH IHR ERGEBNIS. Deshalb:
#   * Er liegt IM Spiegel. Ist der Spiegel weg (Sandbox-Neustart), ist auch der Stempel weg –
#     der erste Aufruf je Sitzung zahlt den vollen Preis. Das ist Absicht.
#   * Gehoert der Spiegel einem anderen Benutzer (am 30.07. `nobody`, 0700), ist der Stempel nicht
#     lesbar und nicht schreibbar -> es geht automatisch den langsamen Weg, der das korrekt meldet.
# ⛔⛔ **GENAU DIESE ANNAHME IST AM 07.09.2026 GERISSEN – SIE HING AN DEN RECHTEN 0700.**
#   Vorgefunden: `/tmp/ap1_tooling` gehoerte `nobody:nogroup`, aber mit **0755**. Folge: der
#   Stempel war LESBAR, er PASSTE (dasselbe package-lock.json), und `[ -d ]` fand jsdom, ajv und
#   axe-core – die Verzeichnisse waren ja da. Alle drei billigen Pruefungen sagten ja. Nur der
#   INHALT war fuer uns nicht lesbar (`find: Permission denied`, 0 von 2359 Dateien).
#   ►► Ergebnis: der Schnellweg meldete „Spiegel gut", `NODE_PATH` zeigte auf ein unbrauchbares
#   Verzeichnis, und **34 von 45 Suiten fielen mit „Cannot find module 'jsdom'"** – bei voellig
#   gesundem Code. Der dokumentierte Rueckfallweg (vom Mount laden, 36 s, korrekt) wurde nie
#   erreicht, weil der Schnellweg vorher „alles in Ordnung" sagte.
#   ►►► **EINE PRUEFUNG, DIE NUR AUF ANWESENHEIT SCHAUT, FAELLT IM ZWEIFEL AUF „GUT".**
#   Deshalb pruefen wir jetzt zusaetzlich zwei Dinge, beide `stat`-billig:
#     1. **Ist der Spiegel fuer UNS beschreibbar?** Ein fremder Spiegel ist keiner.
#     2. **Liegt in einem der Pakete eine LESBARE Datei?** Ein leeres Verzeichnis ist kein Paket.
#   * Zusaetzlich wird billig geprueft, dass die drei erwarteten Pakete ueberhaupt da sind. Das
#     faengt groben Schaden ab, den ein blosser Stempel nicht sehen wuerde.
# ⚠️ **VOLLZAEHLIGKEIT DER DATEIEN BEWEIST NICHT, DASS DIE BIBLIOTHEK BENUTZBAR IST** (Lehre aus
#   check.sh: parse5 zog ESM-Importe, die NODE_PATH ignorieren). Die `require`-Probe gehoert
#   deshalb auf den langsamen Weg – aber eben nur dorthin.
#
# Aufruf:  . tools/spiegel.sh
#          spiegel_stempel_gueltig "<tooling-verzeichnis>" "<spiegelpfad>"   # 0 = Schnellweg frei
#          spiegel_stempel_setzen  "<tooling-verzeichnis>" "<spiegelpfad>"   # nach erfolgreicher Pruefung

spiegel_schluessel() {   # $1 = .tooling-Verzeichnis
  stat -c '%Y %s' "$1/package-lock.json" 2>/dev/null
}

spiegel_stempel_gueltig() {   # $1 = .tooling, $2 = Spiegelpfad
  local tool="$1" sp="$2" schluessel gemerkt p
  schluessel="$(spiegel_schluessel "$tool")"
  [ -n "$schluessel" ] || return 1                 # kein Lockfile -> nichts zu merken
  [ -r "$sp/.spiegel_stempel" ] || return 1
  gemerkt="$(cat "$sp/.spiegel_stempel" 2>/dev/null)"
  [ "$gemerkt" = "$schluessel" ] || return 1
  # ⛔ 07.09.2026: fremder Spiegel mit 0755 – lesbar, passend, Verzeichnisse da, Inhalt gesperrt.
  #    Ein Spiegel, in den wir nicht schreiben koennen, gehoert uns nicht und wird nicht geglaubt.
  [ -w "$sp" ] || return 1
  for p in jsdom ajv axe-core; do [ -d "$sp/$p" ] || return 1; done
  # ⛔ … und ein Verzeichnis ist noch kein Paket: eine LESBARE Datei daraus muss ankommen.
  [ -r "$sp/jsdom/package.json" ] || return 1
  return 0
}

spiegel_stempel_setzen() {   # $1 = .tooling, $2 = Spiegelpfad
  local schluessel; schluessel="$(spiegel_schluessel "$1")"
  [ -n "$schluessel" ] && printf '%s' "$schluessel" > "$2/.spiegel_stempel" 2>/dev/null
  return 0
}
