#!/usr/bin/env bash
# tools/plugin/soll.sh [konto] - was der Chat in SEINER Skill-Liste pruefen muss (27.09.2026, BUILD_LOG 72).
# Anlass: nach PC-Wechsel lief ein gmail-Chat mit den ALTEN Konto-Skills, das Plugin fehlte im Konto.
#   Die Shell sieht das Konto nicht - nur der Chat sieht seine Skill-Liste. Darum sagt start.sh hier,
#   WAS er pruefen muss, und vergleicht mit dem Vermerk je Konto in tools/plugin/installiert.txt.
P=tools/plugin/fisi; I=tools/plugin/installiert.txt
V=$(python3 -c "import json;print(json.load(open('$P/.claude-plugin/plugin.json'))['version'])")
S=$(for f in "$P"/skills/*/SKILL.md; do printf '%s ' "$(sha1sum "$f" | cut -c1-8)"; done)
# E077 (12.10.2026): die Skill-Namen kommen aus dem Ordner, nicht aus einer Liste hier (token-wache ist entfallen).
N=$(for d in "$P"/skills/*/; do basename "$d"; done | tr '\n' ' ')
L=$(for d in "$P"/skills/*/; do printf "'fisi:%s' " "$(basename "$d")"; done)
echo "SOLL fisi $V  SKILL.md sha1 ${S}(${N% })"
K="${1:-}"
if [ -n "$K" ]; then
  IST=$(awk -v k="$K" '$1==k{v=$2" ("$3")"} END{print v}' "$I" 2>/dev/null)
  if [ -z "$IST" ]; then echo "⚠️ Konto '$K': Plugin nie als installiert vermerkt -> packen.py, Datei schicken, Nutzer installiert + loescht alte Konto-Skills"
  elif [ "${IST%% *}" != "$V" ]; then echo "⚠️ Konto '$K' hat $IST, Repo $V -> Datei aus dem Release (bash tools/werkzeug_release.sh) schicken, Nutzer installiert"
  else echo "Konto '$K': fisi $IST vermerkt"; fi
fi
echo "►► CHAT PRUEFT SELBST (Shell sieht das Konto nicht): Skill-Liste NUR ${L% }"
echo "   (ohne 'fisi:' = alte Konto-Skills -> Nutzer loescht sie; fehlen ganz -> Plugin fehlt, tools/skill_nachtraege.md)."
bash tools/werkzeug_release.sh --pruefe 2>&1 | sed "s/^/   /"
echo "   Cloud-Seite: sha1sum /root/.claude/plugins/synced/*/fisi*/skills/*/SKILL.md == SOLL. Nach Installation $I nachziehen."
