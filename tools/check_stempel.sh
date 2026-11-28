#!/usr/bin/env bash
# tools/check_stempel.sh – N49 W2 (10.10.2026, Nutzer-Entscheid BUILD_LOG 123): PUSH NUR NACH GRUENEM LAUF.
#   bash tools/check_stempel.sh schreibe <voll|doku>   # ruft check.sh selbst, NUR bei gruenem Ende
#   bash tools/check_stempel.sh pruefe                 # ruft tools/gitc.sh vor jedem push; rc 0 = darf
#   bash tools/check_stempel.sh baum                   # Fingerabdruck des Arbeitsbaums (zum Nachsehen)
# Anlass: am 10.10. ging ein Push trotz „1 PROBLEM" hinaus (BUILD_LOG 121/122).
# Der Fingerabdruck ist der git-Baum des GANZEN Arbeitsbaums (alle nicht ignorierten Dateien, ueber einen
# Wegwerf-Index - der echte Index bleibt unberuehrt). Gepusht werden darf nur, wenn HEAD genau diesen Baum
# traegt: also alles, was geprueft wurde, ist committet, und nach dem Lauf hat sich nichts mehr geaendert.
# ⚠️ doku zaehlt wie voll (Nutzer-Entscheid 10.10.: passend zum Pfad-Tor) - das Pfad-Tor in check.sh
#    laesst den doku-Modus ohnehin nur zu, wenn ausser *.md / tools/plugin/ / _to_delete/ nichts geaendert ist.
# ⚠️ Notausgang nur fuer den NUTZER: PUSH_OHNE_CHECK=1 (wird laut gemeldet). Ein Chat setzt ihn nie selbst.
set -u
cd "$(dirname "$0")/.." || exit 2
STEMPEL="_to_delete/helfer/check_stempel.txt"

baum() {
  local idx; idx="$(mktemp)"; rm -f "$idx"
  # BUILD_LOG 318: erst HEAD einlesen - ein LEERER Index verlor unter Git fuer Windows (core.filemode=false)
  # die Ausfuehrungsrechte (100755 -> 100644), der Stempel passte nie zum Commit. Mit HEAD als Ausgang
  # behaelt git den Modus bekannter Dateien. Ohne HEAD (leeres Repo) bleibt der leere Index.
  GIT_INDEX_FILE="$idx" git read-tree HEAD 2>/dev/null || rm -f "$idx"
  GIT_INDEX_FILE="$idx" git add -A . 2>/dev/null
  GIT_INDEX_FILE="$idx" git write-tree
  local rc=$?; rm -f "$idx"; return $rc
}

case "${1:-}" in
  baum) baum ;;
  schreibe)
    m="${2:-}"
    case "$m" in voll|doku) ;; *) echo "[stempel] Modus '$m' stempelt nicht (nur voll|doku)"; exit 0 ;; esac
    mkdir -p "$(dirname "$STEMPEL")"
    b="$(baum)" || { echo "[stempel] ⚠️ Baum nicht messbar - kein Stempel"; exit 0; }
    printf '%s %s %s\n' "$b" "$m" "$(date +%Y-%m-%dT%H:%M:%S)" > "$STEMPEL"
    echo "[stempel] gruener $m-Lauf fuer Baum ${b:0:12} vermerkt" ;;
  pruefe)
    if [ "${PUSH_OHNE_CHECK:-}" = "1" ]; then echo "[stempel] ⚠️⚠️ PUSH_OHNE_CHECK=1 - Sperre vom Nutzer aufgehoben"; exit 0; fi
    [ -f "$STEMPEL" ] || { echo "[stempel] ⛔ Push verweigert: kein gruener check.sh-Lauf vermerkt. ►► bash check.sh (oder doku) -> commit -> push"; exit 1; }
    read -r sb sm sz < "$STEMPEL"
    kopf="$(git rev-parse 'HEAD^{tree}')"
    jetzt="$(baum)"
    if [ "$sb" != "$kopf" ]; then
      echo "[stempel] ⛔ Push verweigert: der gruene $sm-Lauf ($sz) galt Baum ${sb:0:12}, HEAD traegt ${kopf:0:12}."
      if [ "$jetzt" = "$sb" ]; then echo "   ►► Geprueftes ist noch nicht (ganz) committet."
      else echo "   ►► Nach dem Lauf wurde etwas geaendert - check.sh erneut fahren."; fi
      exit 1
    fi
    echo "[stempel] ✅ HEAD-Baum ${kopf:0:12} = gruener $sm-Lauf ($sz)" ;;
  *) echo "Aufruf: bash tools/check_stempel.sh schreibe <voll|doku> | pruefe | baum" >&2; exit 2 ;;
esac
