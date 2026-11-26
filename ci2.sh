#!/usr/bin/env bash
# ci2.sh - holt den CI-Befund ueber die GitHub-CLI
# Aufruf in Git Bash:  bash ci2.sh
# Ergebnis:            ci_log.txt   (Bildschirmausgabe kommt zusaetzlich)

cd "$(dirname "$0")" || exit 1
OUT="ci_log.txt"

# ── VORABPRUEFUNG (2026-07-26) ────────────────────────────────────────────────────────────────
# WARUM: Bis hierher lief das Skript auch dann bis zum Ende durch, wenn gh gar nicht vorhanden war
# (in der Sandbox: "gh: command not found"), und endete mit RUECKGABEWERT 0. Wer nur den Rueckgabe-
# wert oder die letzte Zeile las, hielt den CI-Status fuer geprueft, obwohl NICHTS gemessen wurde.
# Das ist die gefaehrlichste Sorte Fehler: eine Pruefung, die Erfolg meldet, ohne zu pruefen.
# Deshalb: fehlt gh oder ist es nicht angemeldet, bricht das Skript SOFORT ab und gibt 2 bzw. 3
# zurueck. ci_log.txt wird in dem Fall NICHT ueberschrieben, damit ein aelterer, echter Befund
# nicht durch eine Fehlermeldung ersetzt wird.
# ⚠️ Dieses Skript laeuft NUR auf dem Windows-Rechner des Nutzers. In der Sandbox gibt es kein gh
#    und wegen des Proxys auch keine Moeglichkeit, es nachzuinstallieren.
if ! command -v gh >/dev/null 2>&1; then
  echo "[ci2.sh] ABBRUCH: 'gh' (GitHub CLI) ist hier nicht installiert." >&2
  echo "         Dieses Skript laeuft nur auf dem Windows-Rechner, nicht in der Sandbox." >&2
  echo "         Es wurde NICHTS geprueft - der CI-Status ist damit UNBEKANNT, nicht gruen." >&2
  exit 2
fi
if ! gh auth status >/dev/null 2>&1; then
  echo "[ci2.sh] ABBRUCH: 'gh' ist installiert, aber nicht angemeldet ('gh auth login')." >&2
  echo "         Es wurde NICHTS geprueft - der CI-Status ist damit UNBEKANNT, nicht gruen." >&2
  exit 3
fi

run_all() {
  echo "==== CI-BEFUND $(date) ===="
  echo

  echo "---- Ist gh angemeldet? ----"
  gh auth status
  echo

  echo "---- Letzte 5 Laeufe ----"
  gh run list --limit 5
  echo

  # ⚠️ KORREKTUR 2026-09-30: alle Abfragen auf --workflow ci.yml begrenzt - ein fehlgeschlagener
  # Dependabot-Lauf (29.09., undici) lieferte sonst "URTEIL: FAILURE", obwohl CI gruen war.
  # ⚠️ KORREKTUR 2026-07-27: Hier stand 'gh run list --limit 1' - der NEUESTE Lauf ueberhaupt.
  # Am 27.07. war das ein GRUENER Cloudflare-Bot-Lauf auf einem PR-Branch, waehrend main ROT war.
  # Der Abschnitt "Fehlgeschlagene Schritte" blieb dadurch LEER und das Log sah gesund aus,
  # obwohl v1.10.0 nie getaggt wurde. Deshalb jetzt ZWEI feste Blickrichtungen:
  #   (a) der letzte Lauf auf BRANCH MAIN - der entscheidet ueber Tag und Deploy;
  #   (b) der letzte FEHLGESCHLAGENE Lauf auf main - mit --log-failed.
  RID=$(gh run list --workflow ci.yml --branch main --limit 1 --json databaseId --jq '.[0].databaseId' 2>/dev/null)
  echo "---- Letzter Lauf auf BRANCH MAIN: ID $RID ----"
  if [ -z "$RID" ]; then
    echo "  Keine Lauf-ID ermittelbar. Ausgabe von 'gh run list' oben ansehen."
  else
    gh run view "$RID"
  fi
  echo

  FID=$(gh run list --workflow ci.yml --branch main --status failure --limit 1 --json databaseId,headSha,displayTitle \
        --jq '.[0].databaseId' 2>/dev/null)
  echo "---- Letzter FEHLGESCHLAGENER Lauf auf main: ID $FID ----"
  if [ -z "$FID" ]; then
    echo "  Kein fehlgeschlagener Lauf auf main gefunden."
  else
    gh run view "$FID"
    echo
    echo "---- Fehlgeschlagene Schritte im Detail ----"
    gh run view "$FID" --log-failed
  fi
  echo

  echo "---- Tags auf dem Remote ----"
  git ls-remote --tags origin
  echo

  echo "==== ENDE ===="
}

run_all > "$OUT" 2>&1

# ── KURZAUSGABE (2026-09-17) ───────────────────────────────────────────────────────────────────
# WARUM: Die Bildschirmausgabe war der ganze Befund – 17 KB, davon das komplette check.sh-Log des
# fehlgeschlagenen Laufs und rund 30 Tag-Zeilen. Der Chat liest davon nur das Urteil, den Lauf
# auf main und die FEHLER-Zeilen. ⛔ `ci_log.txt` bleibt VOLLSTAENDIG – gekuerzt wird nur, was
# auf den Bildschirm geht. `CI2_VOLL=1 bash ci2.sh` zeigt wie bisher alles.
if [ "${CI2_VOLL:-}" = "1" ]; then
  cat "$OUT"
else
  sed -n '/^---- Letzter Lauf auf BRANCH MAIN/,/^---- Letzter FEHLGESCHLAGENER/p' "$OUT" \
    | grep -v '^---- Letzter FEHLGESCHLAGENER' | grep -v '^\s*$' | head -30
  echo "$(grep -m1 '^---- Letzter FEHLGESCHLAGENER' "$OUT") (kann aelter sein als der obige!)"
  grep -E '\[FEHLER\]|##\[error\]' "$OUT" | cut -c1-300 | head -20
  echo "---- Tags auf dem Remote (neueste 3 von $(grep -c 'refs/tags/' "$OUT")) ----"
  grep -o 'refs/tags/v[0-9.]*$' "$OUT" | sed 's#refs/tags/##' | sort -V | tail -3
  echo "(vollstaendig: ci_log.txt oder CI2_VOLL=1 bash ci2.sh)"
fi
echo
echo "-------------------------------------------"
echo "Befund steht in: $(pwd)/$OUT"

# ── URTEIL UND RUECKGABEWERT (2026-07-27) ──────────────────────────────────────────────────────
# WARUM: Am 27.07. war main rot, und das Skript endete trotzdem mit Rueckgabewert 0. Der Fehlschlag
# stand nur als ein Wort ("failure") mitten in einer Tabelle mit fuenf Laeufen – leicht zu
# ueberlesen, und fuer eine Maschine unsichtbar. Ein Report, dessen Urteil man erst suchen muss,
# ist ein halber Report.
# ⚠️ Das Urteil betrachtet AUSSCHLIESSLICH den letzten Lauf auf BRANCH MAIN. Fremde Bots
#    (Cloudflare legt PRs an) erzeugen gruene Laeufe, die juenger sind und nichts bedeuten.
LETZTER_MAIN="$(gh run list --workflow ci.yml --branch main --limit 1 --json conclusion --jq '.[0].conclusion' 2>/dev/null)"
# ⚠️ KORREKTUR 2026-09-17: Ein LAUFENDER Lauf hat `conclusion` = "" – das Skript meldete dann
#    „kein Lauf ermittelbar" (rc 4), obwohl der Lauf oben in der Ausgabe stand. Deshalb wird bei
#    leerem Ergebnis der `status` nachgefragt; nur wenn auch der fehlt, gibt es wirklich keinen Lauf.
if [ -z "$LETZTER_MAIN" ]; then
  ST="$(gh run list --workflow ci.yml --branch main --limit 1 --json status --jq '.[0].status' 2>/dev/null)"
  [ -n "$ST" ] && LETZTER_MAIN="$ST"
fi
echo
case "$LETZTER_MAIN" in
  success)
    echo "URTEIL: letzter Lauf auf main = SUCCESS."
    echo "        Bei einem Version-Bump legt die Release-Action jetzt den Tag an und Cloudflare deployt."
    exit 0 ;;
  failure|cancelled|timed_out|startup_failure)
    echo "URTEIL: letzter Lauf auf main = ${LETZTER_MAIN^^}."
    echo "        ⚠️ ES ENTSTEHT KEIN TAG UND KEIN DEPLOY – die Release-Action haengt an 'needs: check'."
    echo "        Die FEHLER-Zeilen stehen oben; das ganze Log in ci_log.txt ('Fehlgeschlagene Schritte im Detail')."
    exit 1 ;;
  "")
    echo "URTEIL: kein Lauf auf main ermittelbar – Status UNBEKANNT, nicht gruen."
    exit 4 ;;
  *)
    echo "URTEIL: letzter Lauf auf main = $LETZTER_MAIN (laeuft noch?). Status noch offen."
    exit 5 ;;
esac
