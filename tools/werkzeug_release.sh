#!/usr/bin/env bash
# tools/werkzeug_release.sh [--pruefe|--bauen] - die FERTIGEN Installationsdateien als GitHub-Release (Nutzer-Entscheid 27.09.2026).
#   Im Repo stehen nur die Quellen; `fisi-<v>.plugin` (packen.py) und `training-shell.mcpb` (einspielen.sh)
#   sind gebaut und gitignored. Damit man sie auf JEDEM Rechner und im Browser ohne Python/Node bekommt,
#   haengen sie an einem Release "werkzeuge-fisi<v>-shell<v>" (Repo-Seite -> Releases), dazu das
#   Projekt-Dokument (tools/plugin/projekt_einstieg.md).
#   bash tools/werkzeug_release.sh            fehlt das Release oder seine Signatur: startet den Workflow
#                                             .github/workflows/werkzeuge.yml (baut, bescheinigt, haengt an)
#   bash tools/werkzeug_release.sh --pruefe   nur vergleichen: rc 0 = Release passt, 1 = fehlt/veraltet/unsigniert, 2 = stumm
#   bash tools/werkzeug_release.sh --bauen    nur bauen nach _to_delete/helfer/werkzeuge (fuer den Workflow)
# 26.11.2026 (BUILD_LOG 292): gebaut wird in GitHub Actions statt auf dem PC – Herkunft per
#   actions/attest-build-provenance, das Sigstore-Buendel haengt als <tag>.sigstore.json am Release
#   (Scorecard „Signed-Releases“). Pruefen: gh attestation verify <datei> --repo Fisi2026/ap1-lernprogramm
# ⛔ Der FINGERABDRUCK (SHA-1 der SKILL.md, der index.js und des Projekt-Dokuments) steht in den Release-Notizen.
#    Weicht er bei GLEICHER Version ab, wurde geaendert ohne hochzuzaehlen -> Abbruch statt stillem Ueberschreiben:
#    Version in tools/plugin/fisi/.claude-plugin/plugin.json bzw. tools/training-shell/manifest.json erhoehen.
set -u
cd "$(dirname "$0")/.." || exit 2
MODUS=${1:-}
command -v gh >/dev/null 2>&1 || [ "$MODUS" = --bauen ] || { echo "RELEASE: STUMM (gh fehlt)"; exit 2; }
PV=$(python3 -c "import json;print(json.load(open('tools/plugin/fisi/.claude-plugin/plugin.json'))['version'])" 2>/dev/null)
SV=$(python3 -c "import json;print(json.load(open('tools/training-shell/manifest.json'))['version'])" 2>/dev/null)
[ -n "$PV" ] && [ -n "$SV" ] || { echo "RELEASE: STUMM (Versionen nicht lesbar)"; exit 2; }
FP="skills=$(for f in tools/plugin/fisi/skills/*/SKILL.md; do printf '%s,' "$(sha1sum "$f" | cut -c1-8)"; done) index=$(sha1sum tools/training-shell/index.js | cut -c1-8) doku=$(sha1sum tools/plugin/projekt_einstieg.md | cut -c1-8)"
TAG="werkzeuge-fisi$PV-shell$SV"

if [ "$MODUS" != --bauen ]; then
  NOTIZ=$(gh release view "$TAG" --json body -q .body 2>/dev/null); DA=$?
  FP_REL=$(printf '%s\n' "$NOTIZ" | sed -n 's/^FINGERABDRUCK: //p')
  SIG=$(gh release view "$TAG" --json assets -q '[.assets[].name|select(endswith(".sigstore.json"))]|length' 2>/dev/null)
  if [ $DA -eq 0 ] && [ "$FP_REL" != "$FP" ]; then
    echo "RELEASE: VERALTET $TAG - Quellen geaendert ohne Versionssprung (Release: '$FP_REL', Repo: '$FP') -> Version erhoehen"
    exit 1
  fi
  if [ $DA -eq 0 ] && [ "${SIG:-0}" -gt 0 ]; then echo "RELEASE: ok $TAG (signiert)"; exit 0; fi
  ZUSTAND=$([ $DA -eq 0 ] && echo UNSIGNIERT || echo FEHLT)
  if [ "$MODUS" = --pruefe ]; then echo "RELEASE: $ZUSTAND $TAG -> bash tools/werkzeug_release.sh"; exit 1; fi
  # ⛔ Das Release zeigt auf main – die Quellen muessen DORT schon liegen (27.09.: das erste Release zeigte auf
  #    einen Commit ohne die neuen Quellen).
  git fetch -q origin main 2>/dev/null
  if [ -n "$(git status --porcelain -- tools/plugin tools/training-shell)" ] || [ -n "$(git log --oneline origin/main..HEAD -- tools/plugin tools/training-shell)" ]; then
    echo "RELEASE: ABBRUCH - tools/plugin oder tools/training-shell nicht committet/gepusht"; exit 1
  fi
  gh workflow run werkzeuge.yml --ref main >/dev/null || { echo "RELEASE: gh workflow run fehlgeschlagen"; exit 2; }
  echo "RELEASE: $ZUSTAND $TAG -> Workflow werkzeuge.yml gestartet (gh run list --workflow werkzeuge.yml)"; exit 0
fi

python3 tools/plugin/packen.py >/dev/null || { echo "RELEASE: packen.py fehlgeschlagen"; exit 2; }
bash tools/training-shell/einspielen.sh --nur-packen >/dev/null 2>&1 || { echo "RELEASE: einspielen.sh --nur-packen fehlgeschlagen"; exit 2; }
W=_to_delete/helfer/werkzeuge; rm -rf "$W"; mkdir -p "$W"
cp "_to_delete/helfer/fisi-$PV.plugin" "$W/fisi-$PV.plugin" || exit 2
cp tools/training-shell/training-shell.mcpb "$W/training-shell-$SV.mcpb" || exit 2
cp tools/plugin/projekt_einstieg.md "$W/projekt_einstieg.md"
cat > "$W/notiz.md" <<NOTIZ
Fertige Installationsdateien zur FISI-Lern-App (gebaut in GitHub Actions aus Commit $(git rev-parse --short HEAD)).

* **fisi-$PV.plugin** – Plugin mit den Skills agenten-orchestrierung und fisi-lernapp sowie dem Hook limits (Verbrauch). In der Claude-App im Konto installieren (in BEIDEN Konten), alte Konto-Skills gleichen Namens loeschen.
* **training-shell-$SV.mcpb** – Erweiterung Training Shell. In der Claude-Desktop-App MANUELL installieren (Doppelklick oeffnet nur einen Chat), danach App neu starten.
* **projekt_einstieg.md** – Projekt-Dokument fuer das claude.ai-Projekt "Training" (je Konto).
* **$TAG.sigstore.json** – Herkunftsnachweis (SLSA-Provenance, Sigstore) fuer die drei Dateien. Pruefen: gh attestation verify <datei> --repo Fisi2026/ap1-lernprogramm

Quelle: tools/plugin/, tools/training-shell/. Ablauf: tools/skill_nachtraege.md.

FINGERABDRUCK: $FP
NOTIZ
echo "RELEASE: gebaut $TAG in $W"
if [ -n "${GITHUB_OUTPUT:-}" ]; then
  { echo "tag=$TAG"; echo "fp=$FP"; echo "ordner=$W"; echo "titel=Werkzeuge: Plugin fisi $PV, Training Shell $SV"; } >> "$GITHUB_OUTPUT"
fi
