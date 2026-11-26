#!/usr/bin/env bash
# tools/einrichten.sh - EINEN Rechner fuer dieses Projekt einrichten oder pruefen.
#   bash tools/einrichten.sh            prueft UND richtet ein, was ohne Nutzer geht
#   bash tools/einrichten.sh --pruefen  prueft nur, aendert nichts (tools/umgebung.sh ruft das)
# Rueckgabewert = Zahl der offenen Punkte (0 = fertig). Jede Zeile: OK / GESETZT / OFFEN.
#
# ══════════ WARUM ES DAS GIBT (26.09.2026, erster Tag auf einem frischen PC) ══════════
# Der Umzug auf den PC des Benutzers `<benutzer2>` kostete eine Stunde Suchen, weil KEIN Schritt
# irgendwo stand: python3 zeigte auf den Store-Platzhalter (umgebung.sh haette die Store-Meldung
# als Version gedruckt), gh war nicht angemeldet (start.sh zeigte einen LEEREN CI-Abschnitt),
# Git-Identitaet und node_modules fehlten, und einspielen.sh brach an C:\Users\<benutzer1> ab.
# ►► Diese Datei ist die EINE Liste dessen, was ein Rechner braucht. umgebung.sh fragt sie ab,
#    statt eine zweite Liste zu fuehren (zwei Listen fuer dieselbe Sache driften immer).
# ⛔ GEPRUEFT WIRD BENUTZBARKEIT, NICHT EXISTENZ (LEHREN 30.07.): python3 wird AUSGEFUEHRT,
#    jsdom wird per require geladen, gh nach der Anmeldung gefragt.
# ⚠️ Was nur der Nutzer kann (winget/Admin, GitHub-Login im Browser, die Erweiterung
#    MANUELL in der App installieren, Kopie von ../Buch), wird als OFFEN mit dem genauen Schritt gemeldet.
#    Die Installationen davor macht tools/einrichten.ps1 (PowerShell, einmal je Rechner).
set -u
cd "$(dirname "$0")/.." || exit 99
NUR_PRUEFEN=0; [ "${1:-}" = "--pruefen" ] && NUR_PRUEFEN=1
OFFEN=0
zeile(){ printf '  %-8s %-18s %s\n' "$1" "$2" "$3"; }
ok(){ zeile OK "$1" "$2"; }
gesetzt(){ zeile GESETZT "$1" "$2"; }
offen(){ zeile OFFEN "$1" "⚠️ $2"; OFFEN=$((OFFEN+1)); }
WINDOWS=0; case "$(uname -s)" in MINGW*|MSYS*|CYGWIN*) WINDOWS=1 ;; esac
PS_HINWEIS="PowerShell: powershell -ExecutionPolicy Bypass -File tools\\einrichten.ps1"

echo "==== EINRICHTEN $( [ $NUR_PRUEFEN = 1 ] && echo '(nur pruefen)') $(date '+%Y-%m-%d %H:%M') ===="

# ---- 1. Programme (installiert von einrichten.ps1) ----
for P in git node npm gh jq; do
  if V="$($P --version 2>/dev/null | head -1)" && [ -n "$V" ]; then ok "$P" "$V"
  else offen "$P" "fehlt - $PS_HINWEIS"; fi
done
# Node: die CI faehrt Node 24 (.github/workflows/ci.yml, node-version). Andere Hauptversion =
# Tests laufen hier anders als dort.
SOLL_NODE="$(sed -n "s/.*node-version: *'\{0,1\}\([0-9]*\).*/\1/p" .github/workflows/ci.yml 2>/dev/null | head -1)"
IST_NODE="$(node -v 2>/dev/null | sed 's/^v\([0-9]*\).*/\1/')"
if [ -n "$SOLL_NODE" ] && [ -n "$IST_NODE" ] && [ "$SOLL_NODE" != "$IST_NODE" ]; then
  offen "node-Version" "hier $IST_NODE, CI $SOLL_NODE - winget install OpenJS.NodeJS.LTS"
fi

# ---- 2. python3: AUSFUEHREN, nicht nur finden ----
# Windows-Python (python.org/winget) bringt python.exe, aber kein python3.exe; der Name python3
# faellt dann auf den Store-Platzhalter unter WindowsApps, der NICHTS ausfuehrt.
if V="$(python3 -c 'import sys; print(sys.version.split()[0])' 2>/dev/null)"; then ok "python3" "$V"
elif [ $WINDOWS = 1 ] && PY="$(python -c 'import sys; print(sys.executable)' 2>/dev/null)"; then
  if [ $NUR_PRUEFEN = 1 ]; then offen "python3" "nur Store-Platzhalter - 'bash tools/einrichten.sh' legt python3.exe neben $PY"
  else
    DIR="$(dirname "$(cygpath -u "$PY")")"
    if cp "$DIR/python.exe" "$DIR/python3.exe" && hash -r && python3 -c 'pass' 2>/dev/null; then gesetzt "python3" "python3.exe neben python.exe ($DIR)"; else offen "python3" "Kopie nach $DIR/python3.exe gescheitert"; fi
  fi
else offen "python3" "fehlt - $PS_HINWEIS"; fi

# ---- 3. Git: Identitaet und Zeilenenden ----
# Die Identitaet wird dem Projekt entnommen (Autor des letzten Commits), nicht hier notiert.
# ⛔ 12.10.2026 (BUILD_LOG 147): auf dem PC "w" stand global der Platzhalter "Vorname Nachname <deine@mail.de>"
#    und galt hier als OK - Commits haetten ihn getragen (Waechter 4e14 verlangt den noreply-Autor).
#    Darum zaehlt eine Platzhalter- oder Fremd-Identitaet wie eine fehlende; gesetzt wird nur im Repo.
ID_SOLL_MAIL="$(git log -1 --format=%ae 2>/dev/null)"
if [ -n "$(git config user.name)" ] && [ "$(git config user.email)" = "$ID_SOLL_MAIL" ]; then ok "git-Identitaet" "$(git config user.name) <$(git config user.email)>"
elif [ -n "$(git config user.name)" ] && [ $NUR_PRUEFEN = 1 ]; then offen "git-Identitaet" "$(git config user.email) ist nicht der Projekt-Autor <$ID_SOLL_MAIL> - 'bash tools/einrichten.sh' setzt ihn (nur dieses Repo)"
elif [ $NUR_PRUEFEN = 1 ]; then offen "git-Identitaet" "fehlt - 'bash tools/einrichten.sh' uebernimmt den Autor des letzten Commits"
else
  git config user.name "$(git log -1 --format=%an)" && git config user.email "$(git log -1 --format=%ae)" \
    && gesetzt "git-Identitaet" "$(git config user.name) <$(git config user.email)> (nur dieses Repo)"
fi
# .gitattributes erzwingt eol=lf - ein CRLF-Skript waere tot ($'\r': command not found).
if git ls-files --eol check.sh tools/start.sh 2>/dev/null | grep -q 'w/crlf'; then
  offen "Zeilenenden" "Skripte mit CRLF im Arbeitsbaum - git rm --cached -r . && git reset --hard (NUR bei sauberem Baum)"
else ok "Zeilenenden" "Skripte LF"; fi

# ---- 4. GitHub-Anmeldung (ci2.sh, ci_warte.sh, Push) ----
if ! command -v gh >/dev/null 2>&1; then :   # oben schon als OFFEN gezaehlt
elif gh auth status >/dev/null 2>&1; then ok "gh-Anmeldung" "$(gh auth status 2>&1 | sed -n 's/.*account \([^ ]*\).*/\1/p' | head -1)"
else offen "gh-Anmeldung" "PowerShell: gh auth login -h github.com -p https -w  (Browser, macht der Nutzer)"; fi

# ---- 5. Node-Pakete - genau wie die CI (.github/workflows/ci.yml) ----
if node -e "require('./.tooling/node_modules/jsdom');require('./.tooling/node_modules/ajv');require('./.tooling/node_modules/axe-core')" >/dev/null 2>&1; then
  ok ".tooling" "jsdom, ajv, axe-core laden"
elif [ $NUR_PRUEFEN = 1 ]; then offen ".tooling" "fehlt - bash tools/einrichten.sh"
else
  if (cd .tooling && npm ci --no-fund --no-audit --loglevel=error) >/dev/null 2>&1; then gesetzt ".tooling" "jsdom, ajv, axe-core nach Lockfile"; else offen ".tooling" "npm ci scheiterte"; fi
fi
# Inhalt statt Zeitstempel (15.10.2026): git pull machte das Lockfile "neuer" ohne Aenderung -> Fehlalarm.
# Wurzel dazu (26.11.2026, BUILD_LOG 286/287): im frischen Klon fehlte ./node_modules (playwright-core fuer die
# Qualitaets-Ratsche, wrangler) - check.sh war rot, --pruefen meldete trotzdem "nichts offen".
for NM_DIR in . neu; do
  NM_NAME="$([ "$NM_DIR" = . ] && echo "Wurzel/node_modules" || echo "$NM_DIR/node_modules")"
  if NM_GRUND=$(node tools/lock_passt.js "$NM_DIR" 2>&1); then
    ok "$NM_NAME" "passt zum Lockfile (Inhalt)"
  elif [ $NUR_PRUEFEN = 1 ]; then offen "$NM_NAME" "${NM_GRUND:-weicht ab} - bash tools/einrichten.sh"
  else
    if (cd "$NM_DIR" && npm ci --no-fund --no-audit --loglevel=error >/dev/null 2>&1); then gesetzt "$NM_NAME" "npm ci nach Lockfile"; else offen "$NM_NAME" "npm ci scheiterte"; fi
  fi
done

# ---- 5b. Messwerkzeuge fuer tools/qualitaet_ratsche.py (N43 M1, 10.10.2026) ----
# Geprueft wird die FASSUNG, nicht nur die Anwesenheit: eine andere ruff-Fassung zaehlt anders.
WZ_FALSCH=""
while read -r PAKET VER; do
  IST="$(python3 -m pip show "$PAKET" 2>/dev/null | sed -n 's/^Version: //p')"
  [ "$IST" = "$VER" ] || WZ_FALSCH="$WZ_FALSCH $PAKET(${IST:-fehlt}/$VER)"
done < <(grep -o '^[a-z-]*==[0-9.]*' tools/requirements-werkzeuge.txt | tr '=' ' ' | tr -s ' ')
if [ -z "$WZ_FALSCH" ] && command -v shellcheck >/dev/null; then ok "Messwerkzeuge" "lizard, ruff, shellcheck nach tools/requirements-werkzeuge.txt"
elif [ $NUR_PRUEFEN = 1 ]; then offen "Messwerkzeuge" "abweichend:$WZ_FALSCH - bash tools/einrichten.sh"
else
  if python3 -m pip install --disable-pip-version-check -q --require-hashes -r tools/requirements-werkzeuge.txt >/dev/null 2>&1; then
    gesetzt "Messwerkzeuge" "pip install nach tools/requirements-werkzeuge.txt"
  else offen "Messwerkzeuge" "pip install scheiterte"; fi
fi

# ---- 6. Training Shell (nur Windows: die Erweiterung der Claude-Desktop-App) ----
if [ $WINDOWS = 1 ]; then
  # Ablageort kennt einspielen.sh (%APPDATA%\Claude ODER %LOCALAPPDATA%\Claude-Data\* - 19.10.2026)
  ORDNER="$(bash tools/training-shell/einspielen.sh --ordner)"
  ERW="$ORDNER/server/index.js"
  if [ -z "$ORDNER" ]; then
    [ $NUR_PRUEFEN = 0 ] && bash tools/training-shell/einspielen.sh --nur-packen >/dev/null 2>&1
    offen "Training Shell" "nicht installiert - $(cygpath -w "$PWD/tools/training-shell/training-shell.mcpb") MANUELL in der Claude-Desktop-App installieren (Doppelklick auf die .mcpb oeffnet nur einen neuen Chat - gemessen 26.09.2026), danach App neu starten"
  elif ! cmp -s "$ERW" tools/training-shell/index.js; then
    offen "Training Shell" "installiert, aber aelter als das Repo - bash tools/training-shell/einspielen.sh, danach App neu starten"
  else ok "Training Shell" "installiert = Repo-Fassung"; fi
fi

# ---- 7. Das Lehrbuch liegt AUSSERHALB des Repos (LEHREN Teil A) ----
zeile HINWEIS "Plugin fisi" "je KONTO im Chat pruefen - die Shell sieht es nicht (bash tools/plugin/soll.sh <konto>)"
#    Seit 28.09.2026 im privaten Repo Fisi2026/ap1-buch (Nutzer-Entscheide 27./28.09.): fehlt es hier, wird es
#    geklont. Die Westermann-PDFs (je ueber 100 MB) stehen in ../Buch/.gitignore und kommen NICHT mit ->
#    von Hand kopieren; fehlen sie, meldet der Abschnitt sie als HINWEIS.
if [ ! -d ../Buch ] && [ $NUR_PRUEFEN = 0 ] && command -v gh >/dev/null 2>&1    && [ "$(gh repo view Fisi2026/ap1-buch --json isEmpty -q .isEmpty 2>/dev/null)" = "false" ]; then
  gh repo clone Fisi2026/ap1-buch ../Buch >/dev/null 2>&1
fi
if [ -f ../Buch/_aufbereitung/buch.py ]; then
  if [ ! -d ../Buch/.git ]; then zeile HINWEIS "../Buch" "da, aber noch nicht im Repo - hier: bash tools/buch_hochladen.sh --los"
  elif [ -n "$(git -C ../Buch status --porcelain 2>/dev/null)" ] || [ -n "$(git -C ../Buch log --oneline '@{u}..' 2>/dev/null)" ]; then
    zeile HINWEIS "../Buch" "Aenderungen nicht gepusht - in ../Buch committen und pushen"
  else ok "../Buch" "Lehrbuch da und mit Fisi2026/ap1-buch gleich"; fi
  FEHLT_PDF=0
  if [ -f ../Buch/.gitignore ]; then
    while IFS= read -r f; do case "$f" in /*) [ -f "../Buch$f" ] || FEHLT_PDF=$((FEHLT_PDF+1));; esac; done < ../Buch/.gitignore
  fi
  # N40 V2 (09.10.2026): die Katalog-Daten (OCR, TSV, JSON) liegen seit dem Umzug ins oeffentliche Repo hier.
  if [ -f ../Buch/katalog/katalog_teil1.json ]; then ok "../Buch/katalog" "Katalog-Daten da"
  else zeile HINWEIS "../Buch/katalog" "fehlt - tools/katalog/*.py melden rc 2; in ../Buch git pull"; fi
  [ $FEHLT_PDF -gt 0 ] && zeile HINWEIS "../Buch PDFs" "$FEHLT_PDF grosse PDF(s) aus ../Buch/.gitignore fehlen - nicht im Repo, von Hand kopieren"
else zeile HINWEIS "../Buch" "fehlt - nur fuer Pool-/Inhaltsarbeit noetig; gh repo clone Fisi2026/ap1-buch ../Buch, dann die grossen PDFs von Hand kopieren"; fi

echo "==== $( [ $OFFEN = 0 ] && echo 'FERTIG - nichts offen' || echo "$OFFEN OFFEN" ) ===="
exit $OFFEN
#ENDE
