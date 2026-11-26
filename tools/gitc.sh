#!/usr/bin/env bash
# tools/gitc.sh – GIT AUF DEM MOUNT, OHNE SPERREN-REIBUNG.
#
#   bash tools/gitc.sh status --porcelain
#   bash tools/gitc.sh add -A
#   bash tools/gitc.sh commit -F -   <<'EOF'   ... Nachricht ...   EOF
#
# ══════════ WARUM ES DIESES SKRIPT GIBT (27.08.2026) ══════════
# Git kann auf diesem Mount seine eigenen Dateien nicht loeschen ("Operation not permitted").
# Jeder schreibende Aufruf laesst deshalb `.git/index.lock`, oft `.git/HEAD.lock` und pro Objekt
# ein `tmp_obj_*` liegen. Der NAECHSTE Aufruf bricht dann ab mit „Another git process seems to be
# running" – obwohl keiner laeuft.
#
# GEMESSEN aus dem Sitzungsprotokoll vom 26.08.2026:
#   47 Git-Aufrufe fuer 9 Commits – rund fuenf je Commit statt einem.
#   10 davon endeten in einem Sperr-Fehler, drei weitere waren reines Wegraeumen.
# ►►► Nicht die Sperre war teuer, sondern dass jeder Chat sie neu entdeckt und von Hand loest.
#     Das Wegraeumen gehoert deshalb VOR UND NACH jeden Aufruf, nicht in die Erinnerung.
#
# ⚠️ GELOESCHT WIRD NICHTS. `rm` scheitert hier, `mv` funktioniert – die Sperren wandern nach
#    `_to_delete/gitlocks/` (steht in .gitignore). Der Nutzer kann den Ordner im Explorer leeren.
# ⚠️ `tmp_obj_*` bleiben liegen und stoeren git NICHT. Sie erzeugen nur Warnzeilen, die echte
#    Fehler zudecken. Deshalb werden GENAU DIESE Zeilen aus stderr gefiltert – und sonst keine.
#    Der Rueckgabewert von git wird unveraendert durchgereicht.
set -u
cd "$(dirname "$0")/.." || exit 1

SPERREN="_to_delete/gitlocks"

sperren_wegraeumen() {
  mkdir -p "$SPERREN" 2>/dev/null
  for f in index.lock HEAD.lock ORIG_HEAD.lock config.lock packed-refs.lock; do
    if [ -e ".git/$f" ]; then
      mv -f ".git/$f" "$SPERREN/${f}.$(date +%s%N)" 2>/dev/null \
        || echo "[gitc] ⚠️ .git/$f liegt und laesst sich nicht verschieben." >&2
    fi
  done
  return 0
}

if [ "$#" -eq 0 ]; then
  echo "Aufruf: bash tools/gitc.sh <git-argumente ...>" >&2
  echo "Beispiel: bash tools/gitc.sh commit -F - <<'EOF' ... EOF" >&2
  exit 2
fi

# N49 W2 (10.10.2026): push nur, wenn HEAD genau den Baum traegt, fuer den check.sh gruen war.
if [ "$1" = "push" ]; then
  bash tools/check_stempel.sh pruefe || exit 1
fi

# 14.10.2026 (BUILD_LOG 176): EINSTIEG.md wird aus START_PROMPT/BUILD_LOG ERZEUGT. Zweimal an einem Tag fehlte sie
#   im Commit (Push-Riegel verweigerte, check.sh rot). Beim Commit darum neu erzeugen und mitnehmen, wenn sie sich
#   aendert UND BUILD_LOG.md oder START_PROMPT.md im Commit stehen (nur dann ist sie Teil der Aenderung).
if [ "$1" = "commit" ] && git diff --cached --name-only | grep -qE '^(BUILD_LOG|START_PROMPT)\.md$'; then
  python3 tools/einstieg.py --setze >/dev/null 2>&1
  if ! git diff --quiet -- EINSTIEG.md; then
    git add EINSTIEG.md && echo "[gitc] EINSTIEG.md neu erzeugt und mitgenommen" >&2
  fi
fi

sperren_wegraeumen
FEHLERDATEI="$(mktemp)"
git "$@" 2>"$FEHLERDATEI"
RC=$?
sperren_wegraeumen

# Nur die bekannten, harmlosen Unlink-Warnungen ausblenden – alles andere muss sichtbar bleiben.
grep -v -e "warning: unable to unlink .*tmp_obj_" \
        -e "warning: unable to unlink .*\.git/index\.lock" \
        -e "warning: unable to unlink .*\.git/HEAD\.lock" \
        "$FEHLERDATEI" >&2
rm -f "$FEHLERDATEI"

# N51 A4 (12.10.2026, Nutzer-Entscheid „vorab DURCH", tools/standzeile.py): die Standzeile steht schon im
# Commit auf „PUSH DURCH". Scheitert der Push und liegt etwas mit Wirkung beim Lerner ungepusht, stimmt sie
# nicht mehr -> auf OFFEN setzen und als eigenen Commit festhalten (NICHT pushen - der Push ging ja nicht).
if [ "$1" = "push" ] && [ "$RC" -ne 0 ]; then
  UZ="$(python3 tools/ungepusht.py --pruefe 2>/dev/null | awk '$1=="OK"{print $2}')"
  if [ "${UZ:-0}" -gt 0 ] 2>/dev/null; then
    echo "[gitc] ⛔⛔ PUSH GESCHEITERT (rc $RC) - $UZ Commit(s) mit Wirkung beim Lerner liegen ungepusht." >&2
    if python3 tools/standzeile.py offen >&2 && python3 tools/einstieg.py --setze >/dev/null; then
      sperren_wegraeumen
      git add START_PROMPT.md EINSTIEG.md && git commit -q -m "Standzeile: PUSH OFFEN (Push gescheitert, tools/gitc.sh)" \
        && echo "[gitc] Standzeile auf PUSH OFFEN committet (nicht gepusht). Ursache beheben, dann erneut pushen." >&2
      sperren_wegraeumen
    else
      echo "[gitc] ⚠️ Standzeile NICHT umgestellt - von Hand: python3 tools/standzeile.py offen" >&2
    fi
  fi
fi
exit "$RC"
