#!/usr/bin/env bash
# tools/training-shell/einspielen.sh - packt die Erweiterung (.mcpb) und spielt index.js in
# die INSTALLIERTE Erweiterung ein.
#   bash tools/training-shell/einspielen.sh               packen + einspielen
#   bash tools/training-shell/einspielen.sh --nur-packen  nur die .mcpb bauen (frischer Rechner)
#
# WARUM ES DAS GIBT: bis zum 18.09.2026 lag die EINZIGE Quelle des Bruecken-
# Servers in _to_delete/ - einem Ordner, der in .gitignore steht. Der Server,
# ueber den jeder Prueflauf laeuft, war damit nirgends versioniert.
# Seither ist tools/training-shell/ die Quelle (.assetsignore schliesst tools/**
# aus, es geht also nichts an den Lerner).
#
# ⛔ 26.09.2026: HIER STAND ZIEL=/c/Users/<benutzer1>/... - auf dem neuen PC (Benutzer <benutzer2>)
#    brach das Skript damit ab, und auf einem FRISCHEN Rechner gibt es gar keine installierte
#    Erweiterung, in die man einspielen koennte. Jetzt: Ziel aus %APPDATA%, und fehlt die
#    Installation, wird die .mcpb gebaut und die MANUELLE Installation
#    in der App verlangt (ein Doppelklick oeffnet nur einen neuen Chat - gemessen 26.09.2026).
#    Die Kennung local.mcpb.winterberg.training-shell kommt aus author.name im Manifest -
#    NICHT aendern, sonst installiert die App eine ZWEITE Erweiterung neben die alte.
#
# ACHTUNG: Die Desktop-App laedt den Server beim Start. Nach dem Einspielen
# MUSS die App beendet und neu gestartet werden. Seit 1.1 WARNT jede Antwort der
# Shell selbst, solange die laufende Fassung vom Repo abweicht (SERVER=... im Kopf).
set -u
cd "$(dirname "$0")/../.." || exit 1

# Wo liegt die INSTALLIERTE Erweiterung? Die Desktop-App legt sie je nach Installationsart unter
# %APPDATA%\Claude ODER unter %LOCALAPPDATA%\Claude-Data\claude_<kennung> ab (19.10.2026: auf dem
# PC des Nutzers NUR dort - einrichten.sh meldete die installierte Shell deshalb als fehlend).
#   bash tools/training-shell/einspielen.sh --ordner   druckt den Ordner (rc 1 = nicht installiert)
erweiterung() {
  local k
  for k in "$(cygpath -u "${APPDATA:-}" 2>/dev/null)/Claude" "$(cygpath -u "${LOCALAPPDATA:-}" 2>/dev/null)"/Claude-Data/*; do
    [ -f "$k/Claude Extensions/local.mcpb.winterberg.training-shell/server/index.js" ] \
      && { echo "$k/Claude Extensions/local.mcpb.winterberg.training-shell"; return 0; }
  done
  return 1
}
[ "${1:-}" = "--ordner" ] && { erweiterung; exit; }

QUELLE="tools/training-shell/index.js"
MCPB="tools/training-shell/training-shell.mcpb"

node --check "$QUELLE" || { echo "[einspielen] ABBRUCH: $QUELLE hat einen Syntaxfehler."; exit 1; }
python3 tools/training-shell/probe.py >/dev/null 2>&1 || { echo "[einspielen] ABBRUCH: probe.py ist rot - erst 'python3 tools/training-shell/probe.py' lesen."; exit 1; }

python3 - "$MCPB" <<'PY' || { echo "[einspielen] ABBRUCH: .mcpb liess sich nicht packen."; exit 1; }
import sys, zipfile
z = zipfile.ZipFile(sys.argv[1], "w", zipfile.ZIP_DEFLATED)
z.write("tools/training-shell/manifest.json", "manifest.json")
z.write("tools/training-shell/index.js", "server/index.js")
z.close()
PY
WIN_MCPB="$(cygpath -w "$PWD/$MCPB" 2>/dev/null || echo "$PWD/$MCPB")"
echo "[einspielen] .mcpb gepackt: $WIN_MCPB"
[ "${1:-}" = "--nur-packen" ] && exit 0

ORDNER="$(erweiterung)"
ZIEL="$ORDNER/server/index.js"
if [ -z "$ORDNER" ]; then
  echo "[einspielen] Erweiterung NICHT installiert (gesucht unter %APPDATA%\\Claude und %LOCALAPPDATA%\\Claude-Data\\*)."
  echo "[einspielen] ►► $WIN_MCPB MANUELL in der Claude-Desktop-App installieren (Doppelklick auf die .mcpb oeffnet nur einen neuen Chat - gemessen 26.09.2026), danach App neu starten."
  exit 3
fi

mkdir -p _to_delete/helfer
cp "$ZIEL" "_to_delete/helfer/index.js.vorher" 2>/dev/null
cp "$QUELLE" "$ZIEL" || { echo "[einspielen] ABBRUCH: Kopieren fehlgeschlagen (App laeuft?)."; exit 1; }
if cmp -s "$QUELLE" "$ZIEL"; then echo "[einspielen] eingespielt: $(wc -c < "$ZIEL") Byte"; else echo "[einspielen] ABBRUCH: Ziel weicht nach dem Kopieren ab."; exit 1; fi
# Das Manifest wirkt nur bei der INSTALLATION (Umgebung, Einstellungen) - einspielen reicht
# dafuer nicht. Weicht es ab, ist die manuelle Neuinstallation der .mcpb der Weg.
if ! cmp -s tools/training-shell/manifest.json "$ORDNER/manifest.json"; then
  echo "[einspielen] ⚠️ manifest.json weicht von der installierten ab - fuer Manifest-Aenderungen"
  echo "[einspielen]    $WIN_MCPB MANUELL in der Claude-Desktop-App installieren (Doppelklick auf die .mcpb oeffnet nur einen neuen Chat - gemessen 26.09.2026) (ersetzt die Installation, gleiche Kennung)."
fi
echo "[einspielen] ►► JETZT DIE CLAUDE-DESKTOP-APP BEENDEN UND NEU STARTEN."
#ENDE
