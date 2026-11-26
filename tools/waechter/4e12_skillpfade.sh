# shellcheck shell=bash
# Teil von check.sh - wird dort ueber `waechter` GESOURCT, nie allein aufgerufen.
  # 4e12) KEIN RECHNER IN DEN PLUGIN-SKILLS (neu 28.09.2026, BUILD_LOG 83)
  # ⚠️ ANLASS: fisi-lernapp 1.0.2 nannte `C:\Users\<benutzer2>\…` als Pfad "des neuen PCs" - gemessen lag
  #    der Ordner dort unter `C:\Users\<benutzer1>\…`. Jeder feste Benutzerpfad ist beim naechsten
  #    Rechner falsch, und jede Korrektur kostet ein Plugin-Release in BEIDEN Konten.
  #    ►► In den Skills steht nur `~/Claude/Projects/Training`; die App loest `~` selbst auf.
  SP_N=0; SP_TREFFER=""
  for f in tools/plugin/*/skills/*/SKILL.md; do
    [ -f "$f" ] || continue
    SP_N=$((SP_N+1))
    SP_T="$(grep -n -E '[A-Za-z]:\\Users\\[A-Za-z0-9]|/[a-z]/Users/[A-Za-z0-9]|/home/[a-z][a-z0-9_-]*/' "$f" | head -3)"
    [ -n "$SP_T" ] && SP_TREFFER="$SP_TREFFER $f: $(printf '%s' "$SP_T" | cut -c1-80 | tr '\n' ' ')"
  done
  if [ "$SP_N" -eq 0 ]; then
    melde "Skill-Pfade: keine tools/plugin/*/skills/*/SKILL.md gefunden - Waechter prueft nichts"
  elif [ -n "$SP_TREFFER" ]; then
    melde "Skill-Pfade: fester Benutzerpfad in Plugin-Skill -$SP_TREFFER - statt dessen ~/Claude/Projects/Training"
  else
    ok "Skill-Pfade ($SP_N Plugin-Skills, kein fester Benutzerpfad)"
  fi
