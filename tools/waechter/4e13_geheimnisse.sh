# shellcheck shell=bash disable=SC2168
#   (SC2168: gesourct INNERHALB von waechter() in check.sh - `local` gilt dort; N45 W1, BUILD_LOG 155)
# Teil von check.sh - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e13) KEIN GEHEIMNIS IM BAUM (neu 28.09.2026, Neupruefung NB2)
  # ⚠️ ANLASS: das damals private Repo hatte kein GitHub Secret Scanning und kein Code Scanning (API 404/403,
  #    gemessen 28.09.) - bis dahin suchte NIEMAND nach Tokens. `.git/config` trug frueher ein PAT.
  #    Seit 26.11.2026 ist das Repo oeffentlich (N40 V3); Secret Scanning ist dort noch AUS (gemessen 26.11.,
  #    `gh api repos/… --jq .security_and_analysis`, N41 S3). Dieser Waechter bleibt auch danach: er sieht
  #    ein Token schon VOR dem Commit.
  # ►► Gesucht wird in allen verfolgten UND neuen, nicht ignorierten Dateien (`--untracked`), damit
  #    ein Token schon VOR dem Commit auffaellt. Muster: GitHub (klassisch + fein), AWS-Schluessel,
  #    private Schluessel, Anthropic, Slack.
  # ⚠️ WO ER NICHTS MISST: ignorierte Dateien (`_to_delete/`, `node_modules/`), die Git-Historie und
  #    `.git/config` - die Historie wurde am 28.09. einmal von Hand durchsucht (`git log -S ghp_`: 0).
  #    Treffer werden nur mit Datei und Zeile gemeldet, NIE mit dem Wert.
  local GH_M GH_T GH_RC
  GH_M='gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|sk-ant-[A-Za-z0-9_-]{20,}|xox[abpr]-[A-Za-z0-9-]{10,}'
  GH_T="$(git grep --untracked -I -l -E "$GH_M" 2>/dev/null)"; GH_RC=$?
  if [ "$GH_RC" -gt 1 ]; then
    melde "Geheimnisse: 'git grep' mit Rueckgabewert $GH_RC - Werkzeug stumm, nichts geprueft"
  elif [ "$GH_RC" -eq 0 ]; then
    melde "Geheimnisse: Token-Muster in: $(printf '%s' "$GH_T" | tr '\n' ' ') - Wert entfernen, Token beim Anbieter sperren"
  else
    ok "Geheimnisse (kein Token-Muster in verfolgten und neuen Dateien)"
  fi
