# shellcheck shell=bash
# Teil von check.sh - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e17) GIT-RIEGEL ALS HOOK (neu 26.11.2026, BUILD_LOG 296, Nutzer-Entscheid „Riegel als Hook“)
  # ANLASS: „committen nur ueber gitc.sh“ und „nie --force“ standen nur als Text; laut Claude-Code-Doku ist
  #    Text „a request, not a guarantee“. Der Hook tools/hooks/git_riegel.js sperrt beides (rc 2).
  #    Hier: --probe (18 Faelle, 7 muessen sperren, darunter Heredoc-Texte) UND der Hook steht in .claude/settings.json.
  GR_OUT="$(node tools/hooks/git_riegel.js --probe 2>&1)"; GR_RC=$?
  if [ "$GR_RC" -ne 0 ]; then
    melde "Git-Riegel: $(printf '%s' "$GR_OUT" | tr '\n' ' ' | cut -c1-400) - node tools/hooks/git_riegel.js --probe"
  elif ! grep -q 'tools/hooks/git_riegel.js' .claude/settings.json 2>/dev/null; then
    melde "Git-Riegel: Hook fehlt in .claude/settings.json (PreToolUse, matcher Bash|PowerShell|mcp__Training_Shell__run)"
  else
    ok "Git-Riegel ($(printf '%s' "$GR_OUT" | tail -1 | sed 's/^\[git_riegel\] //'))"
  fi
