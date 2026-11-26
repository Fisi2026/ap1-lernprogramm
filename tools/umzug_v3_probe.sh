#!/usr/bin/env bash
# shellcheck disable=SC2030,SC2031,SC2329,SC1091
# tools/umzug_v3_probe.sh - GENERALPROBE fuer N40 V3 (Umzug ins oeffentliche Repo), OHNE Netzwirkung.
#
#   bash tools/umzug_v3_probe.sh              Baum aus HEAD bauen, als EIN Commit von ap1 ablegen, pruefen
#   bash tools/umzug_v3_probe.sh --arbeitsbaum  statt HEAD: verfolgte + neue, nicht ignorierte Dateien des Arbeitsbaums
#   bash tools/umzug_v3_probe.sh --voll       zusaetzlich der volle check.sh im Temp-Baum (node_modules verlinkt)
#   bash tools/umzug_v3_probe.sh --probe      Selbsttest an 14 Faellen mit bekannter Antwort (2 gruene, 12 rote Sabotagen)
#   bash tools/umzug_v3_probe.sh --behalte    Temp-Verzeichnis nicht loeschen (Pfad steht in der Ausgabe)
#   bash tools/umzug_v3_probe.sh --ausgabe <neues-verzeichnis>
#                                             der ECHTE Erstcommit-Baum: wie oben, aber im genannten (nicht vorhandenen oder
#                                             leeren) Verzeichnis, das bleibt. Ist die Pruefung rot, wird es wieder geloescht.
#                                             Auch dann: kein remote, kein push - das macht der Mensch (PLAN_UMZUG_V3.md, Schritt 8).
#   rc 0 = alles gruen, 1 = Fund / Probe falsch, 2 = Aufruf oder Werkzeug kaputt.
#
# Was es misst: den Baum, den der spaetere Erstcommit tragen wuerde (PLAN_UMZUG_V3.md, Schritt 8) -
# `git archive HEAD` = genau die verfolgten Dateien, ohne .git, ohne Ignoriertes. In einem Temp-Verzeichnis
# entsteht ein FRISCHES Repo mit einem Commit; Identitaet nur ueber Umgebungsvariablen (globale/System-
# Konfiguration des Rechners wird ausgeschaltet - sie koennte die private Adresse tragen).
# ⛔ Kein remote, kein push, kein fetch, kein Netz. Das Projekt-.git wird nur GELESEN (archive/ls-files).
# ⛔ Sabotage (--probe) nur in Kopien des Temp-Baums, nie im Arbeitsbaum (regeln/messen.md, 14.10.2026).
#
# ⚠️ WO ES NICHTS MISST: sinngemaess uebernommener Fremdtext, Bilder (ein abfotografiertes Fremdwerk sieht nur
#    die Sperrliste), und die Klarnamen-Frage ueberhaupt (es kennt keinen Klarnamen - die Muster stehen in
#    tools/waechter/4e14_veroeffentlichung.sh; hier nur Autor/Committer und die Mailmuster). Die Historie des
#    ALTEN Repos wird nicht angefasst - dafuer gibt es sie in der Probe schlicht nicht (EIN Commit).
set -u
URSPRUNG="$(pwd)"
cd "$(dirname "$0")/.." || exit 2
QUELLE="head"; VOLL=0; PROBE=0; BEHALTE=0; AUSGABE=""
while [ $# -gt 0 ]; do
  A="$1"; shift
  case "$A" in
    --ausgabe) [ $# -gt 0 ] || { echo "--ausgabe braucht ein Verzeichnis"; exit 2; }; AUSGABE="$1"; shift; case "$AUSGABE" in /*|[A-Za-z]:*) ;; *) AUSGABE="$URSPRUNG/$AUSGABE" ;; esac ;;
    --arbeitsbaum) QUELLE=arbeitsbaum ;;
    --voll) VOLL=1 ;;
    --probe) PROBE=1 ;;
    --behalte) BEHALTE=1 ;;
    *) echo "Aufruf: bash tools/umzug_v3_probe.sh [--arbeitsbaum] [--voll] [--probe] [--behalte]"; exit 2 ;;
  esac
done
WURZEL="$(pwd)"
SOLL_NAME="ap1"; SOLL_MAIL="ap1@users.noreply.github.com"
MAXDATEI_MB="${UMZUG_MAXDATEI_MB:-50}"      # GitHub warnt ab 50 MB je Datei und lehnt ab 100 MB ab (angenommen, DOKU 18.10.2026)
T="$(mktemp -d "${TMPDIR:-/tmp}/umzug_v3.XXXXXX")" || exit 2
# shellcheck disable=SC2329  # Aufruf ueber trap
aufraeumen(){ if [ "$BEHALTE" = 1 ]; then echo "[behalten] $T"; else rm -rf "$T"; fi; }
trap aufraeumen EXIT

# Muster so geschrieben, dass sie sich in dieser Datei selbst NICHT treffen (Geschwister: 4e14).
M_SPERR='^tools/katalog/(tsv/|pruefungskatalog|katalog_teil[0-9]*\.json$|teilbegriffe\.json$|aufzaehlungszeichen\.json$)|^referenz/batches_m09/M09_FAKTEN\.md$|\.(pdf|tsv|xlsx|mcpb|plugin)$|(^|/)\.env|(^|/)\.dev\.vars|^_to_delete/|(^|/)node_modules/|\.git_broken_old|(^|/)backup_[^/]*\.zip$'
M_FREMD='©[[:space:]]*ZPA|^level[[:space:]]page_num[[:space:]]block_num'
M_GMAIL='[a-z0-9._%+-]+@g(oogle)?mail\.com'
M_PFAD='[A-Za-z]:.Users.[A-Za-z0-9]|/[a-z]/Users/[A-Za-z0-9]|desktop-[a-z0-9]{7}'
# Kennzeichnung der K3-Vorlage (Schritt 4a, O10): Lehrer/Klassenlehrer bleiben erlaubt, nur diese Bezeichnungen nicht.
# Gross-/Kleinschreibung ausgeschrieben statt -i, damit Base64 (package-lock) das Kuerzel nicht zufaellig trifft.
M_VORLAGE='[Ll]ehr[k]raft|LEHR[K]RAFT|[Ll]ernziel[k]ontrolle|LZ[K][ _-]?[0-9]'
M_TOKEN='gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|sk-ant-[A-Za-z0-9_-]{20,}|xox[abpr]-[A-Za-z0-9-]{10,}|cfut_[A-Za-z0-9]{20,}'

# baue_baum <ziel>: Dateien des kuenftigen Erstcommits nach <ziel> (ohne .git)
baue_baum(){
  mkdir -p "$1" || return 2
  if [ "$QUELLE" = head ]; then
    git -C "$WURZEL" archive HEAD | tar -x -C "$1" || return 2
  else
    git -C "$WURZEL" ls-files -z --cached --others --exclude-standard --deduplicate \
      | tar --null --ignore-failed-read -T - -cf - -C "$WURZEL" 2>/dev/null | tar -x -C "$1" || return 2
  fi
}

# commit_baum <dir> [autor-mail] [zweiter-commit]: frisches Repo, EIN Commit; Identitaet nur ueber die Umgebung
commit_baum(){
  local D="$1" MAIL="${2:-$SOLL_MAIL}" ZWEI="${3:-0}"
  (
    cd "$D" || exit 2
    export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null GIT_CONFIG_NOSYSTEM=1
    export GIT_AUTHOR_NAME="$SOLL_NAME" GIT_AUTHOR_EMAIL="$MAIL" GIT_COMMITTER_NAME="$SOLL_NAME" GIT_COMMITTER_EMAIL="$MAIL"
    git init -q -b main . || exit 2
    git add -A >/dev/null 2>&1 || exit 2
    git commit -q -m "${COMMIT_MSG:-Erstcommit (Generalprobe N40 V3)}" >/dev/null || exit 2
    if [ "$ZWEI" = 1 ]; then git commit -q --allow-empty -m "zweiter Commit" >/dev/null || exit 2; fi
  )
}

# pruefe_repo <dir>: schreibt die Funde nach <dir>.funde (ein Fund je Zeile, Anfangswort = Klasse); leer = gruen
pruefe_repo(){
  local D="$1" F="$1.funde" N X MAXB
  : > "$F"
  (
    cd "$D" || exit 2
    export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null GIT_CONFIG_NOSYSTEM=1
    # 1) Historie: genau ein Commit, keine Tags, kein Remote
    N="$(git rev-list --count HEAD 2>/dev/null)"; [ "$N" = 1 ] || echo "Historie: $N Commits statt 1"
    [ -z "$(git tag)" ] || echo "Historie: Tags vorhanden"
    [ -z "$(git remote)" ] || echo "Historie: Remote eingetragen"
    # 2) Autor/Committer: nur ap1 + noreply, in allen Commits
    X="$(git log --format='%an|%ae|%cn|%ce' | sort -u)"
    [ "$X" = "$SOLL_NAME|$SOLL_MAIL|$SOLL_NAME|$SOLL_MAIL" ] || echo "Autor: Identitaet weicht ab (${X//$'\n'/ ; })"
    git log --format='%B' | grep -qiE "$M_GMAIL" && echo "Autor: Gmail-Adresse in einer Commit-Nachricht"
    # 3) Sperrliste (Pfade)
    X="$(git ls-files | grep -E "$M_SPERR" | head -5 | tr '\n' ' ')"; [ -z "$X" ] || echo "Sperrliste: $X"
    # 3b) Die eingecheckte Claude-Einstellung (Start-Haken, Freigaben) muss im Erstcommit stecken: `.gitignore` ignoriert
    #     `.claude/*` und nimmt nur `!.claude/settings.json` aus - fehlt die Ausnahme, laesst `git add -A` die Datei still weg.
    git ls-files --error-unmatch .claude/settings.json >/dev/null 2>&1 || echo "Einstellungen: .claude/settings.json fehlt im Baum (.gitignore-Ausnahme '!.claude/settings.json'?)"
    # 4) Fremdtext, Gmail, Benutzerpfad, Token (nur Dateinamen, nie der Wert)
    X="$(git grep -I -l -E "$M_FREMD" | head -5 | tr '\n' ' ')"; [ -z "$X" ] || echo "Fremdtext: $X"
    X="$(git grep -I -l -i -E "$M_GMAIL" | head -5 | tr '\n' ' ')"; [ -z "$X" ] || echo "Gmail: $X"
    X="$(git grep -I -l -E "$M_PFAD" | head -5 | tr '\n' ' ')"; [ -z "$X" ] || echo "Benutzerpfad: $X"
    X="$(git grep -I -l -E "$M_TOKEN" | head -5 | tr '\n' ' ')"; [ -z "$X" ] || echo "Geheimnis: $X"
    X="$(git grep -I -l -E "$M_VORLAGE" | head -5 | tr '\n' ' ')"; [ -z "$X" ] || echo "Vorlage: $X"
    # 5) Groesse: groesste Einzeldatei gegen die Grenze
    MAXB=$((MAXDATEI_MB * 1024 * 1024))
    X="$(git ls-files -z | xargs -0 du -b 2>/dev/null | awk -v m="$MAXB" '$1>m{print $2}' | head -3 | tr '\n' ' ')"
    [ -z "$X" ] || echo "Groesse: Datei(en) ueber ${MAXDATEI_MB} MB: $X"
    # 6) Der echte Waechter 4e14 aus DIESEM Baum, gesourct wie in check.sh (melde/ok als Zaehler)
    if [ -f tools/waechter/4e14_veroeffentlichung.sh ]; then
      W_OUT="$(
        # shellcheck disable=SC2329
        melde(){ echo "WAECHTER-ROT: $*"; }
        # shellcheck disable=SC2329
        ok(){ echo "WAECHTER-OK: $*"; }
        # shellcheck disable=SC2329
        lauf(){ . tools/waechter/4e14_veroeffentlichung.sh; }
        lauf
      )"
      case "$W_OUT" in
        WAECHTER-OK:*) ;;
        *) echo "Waechter4e14: ${W_OUT:-keine Ausgabe - Waechter stumm}" ;;
      esac
    else
      echo "Waechter4e14: Datei fehlt im Baum"
    fi
  ) > "$F" 2>&1
  return 0
}

# Anzeige (nur Information, kein Urteil)
bericht(){
  local D="$1"
  ( cd "$D" || exit 2
    export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null GIT_CONFIG_NOSYSTEM=1
    echo "  Dateien: $(git ls-files | wc -l | tr -d ' ') · Bytes (Inhalt): $(git ls-files -z | xargs -0 du -cb 2>/dev/null | tail -1 | cut -f1) · groesste: $(git ls-files -z | xargs -0 du -b 2>/dev/null | sort -rn | head -1 | tr '\t' ' ')"
    git gc -q 2>/dev/null; echo "  Packgroesse (.git): $(git count-objects -vH | sed -n 's/^size-pack: //p')"
    echo "  .claude/settings.json im Baum: $(git ls-files --error-unmatch .claude/settings.json >/dev/null 2>&1 && echo ja || echo NEIN)"
    echo "  Commit: $(git log -1 --format='%h Autor=%an <%ae> Committer=%cn <%ce>')"
    echo "  web.de-Adressen (erlaubt, E66-Rueckfrage): $(git grep -I -l -i -E '@web\.de' | wc -l | tr -d ' ') Datei(en)"
    echo "  'ZPA' ohne ©-Vermerk (Quellenname, nur Hinweis): $(git grep -I -l 'ZPA' | wc -l | tr -d ' ') Datei(en)"
    echo "  Dateien mit '©' (Hinweis, Lizenzkopf fremder Pakete?): $(git grep -I -l '©' | tr '\n' ' ')"
  )
}

# ───────────────────────── --probe ─────────────────────────
if [ "$PROBE" = 1 ]; then
  BAUM="$T/basis"; baue_baum "$BAUM" || { echo "PROBE: Baum nicht baubar"; exit 2; }
  RICHTIG=0; FALSCH=0
  # fall <name> <erwartet: GRUEN|<Klasse>> <vorbereitung-funktion> [autor-mail] [zweiter-commit]
  fall(){
    local NAME="$1" ERW="$2" VOR="$3" MAIL="${4:-$SOLL_MAIL}" ZWEI="${5:-0}" K="$T/fall_$1" ERG
    cp -a "$BAUM" "$K" || { echo "PROBE: Kopie scheitert"; exit 2; }
    [ -z "$VOR" ] || "$VOR" "$K"
    commit_baum "$K" "$MAIL" "$ZWEI" || { echo "PROBE: Commit scheitert ($NAME)"; exit 2; }
    pruefe_repo "$K"; ERG="$(cat "$K.funde")"
    if [ "$ERW" = GRUEN ]; then
      if [ -z "$ERG" ]; then RICHTIG=$((RICHTIG+1)); echo "  [ok]   $NAME: gruen wie erwartet"
      else FALSCH=$((FALSCH+1)); echo "  [FALSCH] $NAME: sollte gruen sein, meldet: $ERG"; fi
    else
      case "$ERG" in
        *"$ERW"*) RICHTIG=$((RICHTIG+1)); echo "  [ok]   $NAME: rot wie erwartet ($ERW)" ;;
        *) FALSCH=$((FALSCH+1)); echo "  [FALSCH] $NAME: sollte '$ERW' melden, meldet: ${ERG:-nichts}" ;;
      esac
    fi
  }
  v_katalog(){ mkdir -p "$1/tools/katalog"; echo "Seite 1" > "$1/tools/katalog/pruefungskatalog_ocr.txt"; }
  v_zpa(){ printf '%s\n' "Teil von $(printf '\302\251') ZPA Nord-West - Alle Rechte vorbehalten" > "$1/probe_fremdtext.md"; }
  v_gmail(){ printf '%s\n' "Kontakt: privat@gm""ail.com" > "$1/probe_mail.md"; }
  v_tsv(){ printf '%s\n' "level	page_num" > "$1/probe_ocr.tsv"; }
  v_pfad(){ printf '%s\n' "Pfad C:\\Us""ers\\max\\Projekt" > "$1/probe_pfad.md"; }
  v_token(){ printf '%s\n' "token = gh""p_$(printf 'A%.0s' $(seq 1 36))" > "$1/probe_token.md"; }
  v_gross(){ yes 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' | head -c 2097152 > "$1/probe_gross.txt"; }
  v_ohne_ausnahme(){ grep -v '^!\.claude/settings\.json$' "$1/.gitignore" > "$1/.gitignore.neu" && mv "$1/.gitignore.neu" "$1/.gitignore"; }
  v_gut(){ printf '%s\n' "Datenschutz: kontakt@web.de" "Quelle: ZPA-Pruefungskatalog (ohne Vermerk)" "Leer: " "Der Klassenlehrer, laut Lehrer" > "$1/probe_erlaubt.md"; }
  v_vorlage(){ printf '%s\n' "Zusatz der Lehr""kraft: Nennen Sie zwei Beispiele." > "$1/probe_vorlage.md"; }
  v_kuerzel(){ printf '%s\n' '{ "name": "Klausur 3 - LZ''K 5" }' > "$1/probe_set.json"; }
  echo "== Generalprobe selbst: Gegenprobe mit bekannter Antwort (Baum: $(find "$BAUM" -type f | wc -l | tr -d ' ') Dateien)"
  fall sauber GRUEN ""
  fall gut_web_de_und_ZPA_ohne_Vermerk GRUEN v_gut
  fall katalogdatei Sperrliste v_katalog
  fall tsv Sperrliste v_tsv
  fall zpa_vermerk Fremdtext v_zpa
  fall gmail_in_datei Gmail v_gmail
  fall benutzerpfad Benutzerpfad v_pfad
  fall token Geheimnis v_token
  UMZUG_MAXDATEI_MB_ALT="$MAXDATEI_MB"; MAXDATEI_MB=1
  fall zu_gross Groesse v_gross
  MAXDATEI_MB="$UMZUG_MAXDATEI_MB_ALT"
  fall autor_gmail Autor "" "privat@gm""ail.com"
  fall zwei_commits Historie "" "$SOLL_MAIL" 1
  fall settings_ohne_ignore_ausnahme Einstellungen v_ohne_ausnahme
  fall vorlage_bezeichnung Vorlage v_vorlage
  fall vorlage_kuerzel Vorlage v_kuerzel
  GESAMT=$((RICHTIG+FALSCH))
  if [ "$FALSCH" = 0 ] && [ "$GESAMT" = 14 ]; then echo "PROBE: $RICHTIG/14 richtig (2 gruene Faelle, 12 rote Sabotagen erkannt)"; exit 0; fi
  echo "PROBE: FALSCH - $RICHTIG von $GESAMT richtig (erwartet 14/14)"; exit 1
fi

# ───────────────────────── Normallauf ─────────────────────────
echo "== N40 V3 Generalprobe (Quelle: $QUELLE, kein Netz, kein push) · Temp: $T"
if [ "$QUELLE" = head ] && [ -n "$(git status --porcelain --untracked-files=no 2>/dev/null)" ]; then
  echo "  [hinweis] Arbeitsbaum hat Aenderungen - die Probe misst HEAD ($(git rev-parse --short HEAD)); --arbeitsbaum misst den Stand der Dateien"
fi
BAUM="$T/ap1"
if [ -n "$AUSGABE" ]; then
  if [ -e "$AUSGABE" ] && [ -n "$(ls -A "$AUSGABE" 2>/dev/null)" ]; then echo "UMZUG: $AUSGABE ist nicht leer - nichts ueberschrieben"; exit 2; fi
  BAUM="$AUSGABE"
  VERSION="$(sed -n 's/^  "version": "\([0-9.]*\)".*/\1/p' neu/package.json | head -1)"
  COMMIT_MSG="Erstcommit aus bereinigtem Baum (Stand v${VERSION:-?})"; export COMMIT_MSG
fi
baue_baum "$BAUM" || { echo "UMZUG: Baum nicht baubar"; exit 2; }
commit_baum "$BAUM" || { echo "UMZUG: Erstcommit im Temp-Baum scheitert"; exit 2; }
pruefe_repo "$BAUM"; FUNDE="$(cat "$BAUM.funde")"; rm -f "$BAUM.funde"
bericht "$BAUM"
RC=0
if [ -n "$FUNDE" ]; then
  echo "UMZUG: ROT"; printf '%s\n' "$FUNDE" | sed 's/^/  - /'; RC=1
else
  echo "UMZUG: Baum gruen (1 Commit von $SOLL_NAME, Sperrliste/Fremdtext/Gmail/Pfad/Token/Vorlage leer, Waechter 4e14 gruen, Dateien <= ${MAXDATEI_MB} MB)"
fi
if [ -n "$AUSGABE" ]; then
  if [ "$RC" = 0 ]; then echo "UMZUG: Erstcommit-Baum liegt in $AUSGABE (kein Remote, nichts gepusht). Naechster Schritt: PLAN_UMZUG_V3.md Schritt 8."
  else rm -rf "$AUSGABE"; echo "UMZUG: Pruefung rot - $AUSGABE wieder geloescht, NICHTS pushen."; fi
fi
if [ "$VOLL" = 1 ]; then
  echo "== voller check.sh im Temp-Baum (node_modules verlinkt)"
  for P in node_modules neu/node_modules .tooling/node_modules; do
    [ -d "$WURZEL/$P" ] && [ ! -e "$BAUM/$P" ] && ln -s "$WURZEL/$P" "$BAUM/$P"
  done
  ( cd "$BAUM" && env -u CLAUDECODE -u AI_AGENT GIT_CONFIG_GLOBAL=/dev/null bash check.sh > "$T/check.log" 2>&1 ); CR=$?
  grep -E '^\[FEHLER\]' "$T/check.log" | cut -c1-400 | sed 's/^/  /'; tail -3 "$T/check.log"
  echo "UMZUG: check.sh im Temp-Baum rc=$CR (0 = ALLES GRUEN)"
  [ "$CR" = 0 ] || RC=1
fi
exit $RC
