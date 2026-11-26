#!/usr/bin/env bash
# tools/release.sh <version> --text <datei> [--trocken] - EIN RELEASE BIS VOR DEN COMMIT (N30).
#   bash tools/release.sh 1.39.0 --text _to_delete/helfer/cl.txt --trocken   # nur Diff zeigen
#   bash tools/hinter.sh rel 'bash tools/release.sh 1.39.0 --text _to_delete/helfer/cl.txt'
#   bash tools/release.sh --nur-buendel 1.38.1                               # nur Schritt 4
#
# Punkt 9 der N25-Anleitung, in DIESER Reihenfolge (jede Umstellung ist schon schiefgegangen):
#   1. Bump: neu/package.json + neu/package-lock.json "version" (EINZIGE Quelle seit N29 Teil 2, E41) ·
#      CHANGELOG "## v<x>" + Text aus --text · START_PROMPT-Standzeilen (APP_VERSION/app-sw neu; seit N51 A4 "LIVE beim Lerner: v<x> ·
#      committet auf main: v<x> · PUSH DURCH" - vorab, Push sofort danach) · EINSTIEG.md neu erzeugt (einstieg.py --setze).
#   2. ERST DANN v2/ bauen (npm run build in neu/) - das Buendel traegt die Version (__APP_VERSION__).
#   3. git add -A neu v2 + die fuenf Dateien (deploy_inhalt.py sieht neue Dateien erst nach add).
#   4. Pruefung: v2/index.html zeigt auf ein vorhandenes index-*.js, das die NEUE Version traegt
#      und die ALTE nicht mehr.
# ⛔ KEIN COMMIT, KEIN PUSH (E10) - danach check.sh, commit, push von Hand. Den Bump erfragt der
#    Chat VORHER beim Nutzer; dieses Skript entscheidet ihn nicht.
# ⛔ Der CHANGELOG-Text kommt aus einer Datei, nie als Platzhalter: er geht an den Lerner.
# ⚠️ Dauert mit Bau > 60 s -> ueber tools/hinter.sh fahren.
# --wurzel DIR: nur Schritt 1, in einer KOPIE (fuer die Gegenprobe); kein Bau, kein add.
# rc 0 = fertig · 2 = Aufruf/Vorbedingung · 3 = Bau · 4 = Buendel traegt die Version nicht.
set -u
cd "$(dirname "$0")/.." || exit 2
V=""; TEXT=""; TROCKEN=0; WURZEL="."; NUR_B=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --text) TEXT="${2:-}"; shift 2 ;;
    --trocken) TROCKEN=1; shift ;;
    --wurzel) WURZEL="${2:-}"; shift 2 ;;
    --nur-buendel) NUR_B="${2:-}"; shift 2 ;;
    -*) echo "[release] unbekannt: $1" >&2; exit 2 ;;
    *) V="$1"; shift ;;
  esac
done

buendel() {  # $1 = neue Version, $2 = alte (optional)
  local js
  js="$(grep -oE 'index-[A-Za-z0-9_-]+\.js' v2/index.html | head -1)"
  [ -n "$js" ] && [ -f "v2/assets/$js" ] || { echo "[release] ⛔ v2/index.html zeigt auf kein vorhandenes index-*.js ('$js')"; return 4; }
  # Als String-Literal, in JEDER Quote: der Minifier setzt Backticks (`1.38.1`), gemessen 22.09.
  # Punkte maskiert, sonst zaehlte auch 1x38y1. Eine Zahl ohne Quote ist kein Versionseintrag.
  local n a=0 q="[\"'\`]"
  n="$(grep -oE "$q${1//./\\.}$q" "v2/assets/$js" | wc -l | tr -d ' ')"
  [ -n "${2:-}" ] && a="$(grep -oE "$q${2//./\\.}$q" "v2/assets/$js" | wc -l | tr -d ' ')"
  if [ "$n" -lt 1 ] || [ "$a" -gt 0 ]; then
    echo "[release] ⛔ Buendel $js: \"$1\" ${n}x, alte \"${2:-}\" ${a}x - traegt die Version NICHT"; return 4
  fi
  echo "[release] ✅ Buendel $js traegt \"$1\" (${n}x)${2:+, alte \"$2\" 0x}"
}

if [ -n "$NUR_B" ]; then buendel "$NUR_B"; exit $?; fi
[ -n "$V" ] && [ -n "$TEXT" ] || { echo "Aufruf: bash tools/release.sh <x.y.z> --text <datei> [--trocken]" >&2; exit 2; }

ALT="$(PYTHONIOENCODING=utf-8 V="$V" TEXT="$TEXT" TROCKEN="$TROCKEN" W="$WURZEL" python3 - <<'PY'
import difflib, os, re, sys
V, T, trocken, W = os.environ["V"], os.environ["TEXT"], os.environ["TROCKEN"] == "1", os.environ["W"]
def fehl(m): sys.stderr.write("[release] " + m + "\n"); sys.exit(2)
if not re.fullmatch(r"\d+\.\d+\.\d+", V): fehl("Version '%s' ist nicht x.y.z" % V)
def lies(p):
    with open(os.path.join(W, p), encoding="utf-8", newline="") as f: return f.read()
try:
    with open(T, encoding="utf-8", newline="") as f: text = f.read().strip("\n")
except OSError: fehl("--text %s nicht lesbar" % T)
if not text.strip(): fehl("--text ist leer - der CHANGELOG geht an den Lerner")
if re.search(r"^#", text, re.M): fehl("--text enthaelt eine Ueberschrift - die setzt das Skript selbst")
d = {p: lies(p) for p in ("neu/package.json", "neu/package-lock.json", "CHANGELOG.md", "START_PROMPT.md")}
m = re.search(r'^  "version": "(\d+\.\d+\.\d+)",$', d["neu/package.json"], re.M)
if not m: fehl("version in neu/package.json nicht lesbar")
alt = m.group(1)
if tuple(map(int, V.split("."))) <= tuple(map(int, alt.split("."))): fehl("%s ist nicht groesser als %s" % (V, alt))
if ("\n## v%s\n" % V) in d["CHANGELOG.md"]: fehl("CHANGELOG hat schon '## v%s'" % V)
neu = dict(d)
def ers(p, a, b, n=1):
    global neu
    k = neu[p].count(a)
    if k != n: fehl("%s: '%s' %dx statt %dx - nichts geschrieben" % (p, a, k, n))
    neu[p] = neu[p].replace(a, b)
ers("neu/package.json", '\n  "version": "%s",\n' % alt, '\n  "version": "%s",\n' % V)
# Lock: Kopf UND packages[""] tragen die Version - beide, sonst meldet npm ci keinen Fehler, aber der Lock luegt.
# ⚠️ VERANKERT (gemessen 24.09.: '"version": "2.0.0",' steht 16x im Lock - fremde Pakete gleicher Nummer).
ers("neu/package-lock.json", '\n  "name": "neu",\n  "version": "%s",\n' % alt, '\n  "name": "neu",\n  "version": "%s",\n' % V)
ers("neu/package-lock.json", '\n    "": {\n      "name": "neu",\n      "version": "%s",\n' % alt, '\n    "": {\n      "name": "neu",\n      "version": "%s",\n' % V)
ers("CHANGELOG.md", "# Changelog\n\n", "# Changelog\n\n## v%s\n\n%s\n\n" % (V, text))
ers("START_PROMPT.md", "APP_VERSION %s · app-sw ap1-app-%s ·" % (alt, alt), "APP_VERSION %s · app-sw ap1-app-%s ·" % (V, V))
s = neu["START_PROMPT.md"]
# N51 A4 (12.10.2026, „vorab DURCH"): die Zeile steht schon so, wie sie NACH dem Push stimmt - LIVE = neu.
#   Scheitert der Push, setzt tools/gitc.sh sie per Folge-Commit auf OFFEN (tools/standzeile.py offen).
z = re.findall(r"LIVE beim Lerner: v\d+\.\d+\.\d+ · committet auf main: v\d+\.\d+\.\d+ · PUSH (?:OFFEN|DURCH)", s)
if len(z) != 1: fehl("START_PROMPT: Auslieferungs-Zeile %dx statt 1x" % len(z))
neu["START_PROMPT.md"] = s.replace(z[0], "LIVE beim Lerner: v%s · committet auf main: v%s · PUSH DURCH" % (V, V))
for p in d:
    if trocken:
        sys.stderr.writelines(difflib.unified_diff(d[p].splitlines(True), neu[p].splitlines(True), p, p + " (neu)", n=0))
    else:
        with open(os.path.join(W, p), "w", encoding="utf-8", newline="") as f: f.write(neu[p])
        if lies(p) != neu[p]: fehl("%s: nach dem Schreiben nicht, was drinstehen soll!" % p)
print(alt)
PY
)" || exit 2
if [ "$TROCKEN" = 1 ]; then echo "[release] TROCKEN: $ALT -> $V, nichts geschrieben."; exit 0; fi
echo "[release] Schritt 1: $ALT -> $V in neu/package.json (+lock), CHANGELOG.md, START_PROMPT.md"
[ "$WURZEL" != "." ] && { echo "[release] --wurzel: Schritt 2-4 entfallen."; exit 0; }
python3 tools/einstieg.py --setze >/dev/null || { echo "[release] einstieg.py --setze fehlgeschlagen" >&2; exit 2; }
echo "[release] Schritt 2: v2/ bauen ..."
( cd neu && npm run build ) > _to_delete/helfer/release_bau.txt 2>&1 || { echo "[release] ⛔ Bau rot - _to_delete/helfer/release_bau.txt"; tail -5 _to_delete/helfer/release_bau.txt; exit 3; }
echo "[release] Schritt 3: git add"
bash tools/gitc.sh add -A neu v2 CHANGELOG.md START_PROMPT.md EINSTIEG.md || exit 2
buendel "$V" "$ALT" || exit 4
git diff --cached --stat | tail -1
echo "[release] FERTIG bis vor den Commit. Jetzt: check.sh (hinter.sh) -> ALLES GRUEN -> commit -> push."
