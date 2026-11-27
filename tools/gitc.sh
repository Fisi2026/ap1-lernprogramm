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

# ══════════ PAKET 1 (27.11.2026, BUILD_LOG 316, Nutzer-Entscheid): main NUR NOCH UEBER EINEN PR ══════════
# Gemessen 27.11.: Ruleset „main“ (id 28155914) verlangt PR + die Checks „check.sh (voll)“ und „Semgrep“;
# `git push origin main` scheitert mit „2 of 2 required status checks are expected“. Repo: nur Squash, Auto-Merge an.
#   bash tools/gitc.sh push origin main  ->  Stempel -> HEAD auf Zweig pr/<JJJJ-MM-TT>-<sha7> -> gh pr create
#                                            (Titel = Commit-Betreff) -> gh pr merge --auto --squash. Wartet NICHT.
#   Ohne gh-Anmeldung (Cloud-Sitzung: GH_TOKEN vom Proxy, GraphQL 403) nur den Zweig pushen; PR und Auto-Merge macht
#   der Chat ueber die GitHub-Werkzeuge (create_pull_request, enable_pr_auto_merge). Zweigname: GITC_ZWEIG setzt ihn.
#   bash tools/gitc.sh nachziehen        ->  main auf origin/main, NUR wenn main darin enthalten ist ODER denselben
#                                            Baum traegt (Squash) und der Arbeitsbaum sauber ist; sonst laut, rc 1.
# Nach dem Squash hat origin/main eine andere SHA als der lokale main - ohne `nachziehen` zaehlte ungepusht.py alles.
H_PR="_to_delete/helfer"

nachziehen() {
  git fetch -q origin main || { echo "[nachziehen] ⛔ git fetch origin main gescheitert" >&2; return 1; }
  git rev-parse -q --verify refs/heads/main >/dev/null || { echo "[nachziehen] ⛔ kein lokaler Zweig main" >&2; return 1; }
  local l o art="" akt
  l="$(git rev-parse main)"; o="$(git rev-parse origin/main)"
  if [ "$l" = "$o" ]; then echo "[nachziehen] main = origin/main (${o:0:7}) - nichts zu tun"; return 0; fi
  if git merge-base --is-ancestor "$o" "$l"; then
    echo "[nachziehen] main liegt $(git rev-list --count "$o..$l") Commit(s) vor origin/main - nichts nachzuziehen (ungepusht: python3 tools/ungepusht.py)"
    return 0
  fi
  if git merge-base --is-ancestor "$l" "$o"; then art="vorgespult"
  elif [ "$(git rev-parse "$l^{tree}")" = "$(git rev-parse "$o^{tree}")" ]; then art="Baum gleich (gesquasht)"
  else
    echo "[nachziehen] ⛔⛔ main (${l:0:7}) und origin/main (${o:0:7}) tragen verschiedene Inhalte - NICHT nachgezogen." >&2
    local x
    for x in $(git rev-list "$o..$l"); do
      if [ "$(git rev-parse "$x^{tree}")" = "$(git rev-parse "$o^{tree}")" ]; then
        echo "   ►► ${x:0:7} traegt den Baum von origin/main; die Commits darueber sind neu:" >&2
        git log --oneline "$x..$l" >&2
        echo "   ►► uebertragen (Basis-Baeume gleich, also konfliktfrei): git rebase --onto origin/main ${x:0:7} main" >&2
        return 1
      fi
    done
    echo "   ►► kein lokaler Commit traegt den Baum von origin/main - von Hand klaeren (git log main origin/main)" >&2
    return 1
  fi
  akt="$(git branch --show-current)"
  if [ "$akt" = "main" ]; then
    if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
      echo "[nachziehen] ⛔⛔ Arbeitsbaum nicht sauber - main NICHT nachgezogen ($art moeglich). Erst committen oder klaeren." >&2
      return 1
    fi
    git reset -q --keep "$o" || { echo "[nachziehen] ⛔ git reset --keep gescheitert" >&2; return 1; }
  else
    git branch -f main "$o" || return 1
  fi
  echo "[nachziehen] main ${l:0:7} -> ${o:0:7} ($art)"
}

push_offen_vermerken() {   # N51 A4, siehe unten: nur wenn NICHTS bei GitHub ankam
  local rc=$1 uz
  uz="$(python3 tools/ungepusht.py --pruefe 2>/dev/null | awk '$1=="OK"{print $2}')"
  if [ "${uz:-0}" -gt 0 ] 2>/dev/null; then
    echo "[gitc] ⛔⛔ PUSH GESCHEITERT (rc $rc) - $uz Commit(s) mit Wirkung beim Lerner liegen ungepusht." >&2
    if python3 tools/standzeile.py offen >&2 && python3 tools/einstieg.py --setze >/dev/null; then
      sperren_wegraeumen
      git add START_PROMPT.md EINSTIEG.md && git commit -q -m "Standzeile: PUSH OFFEN (Push gescheitert, tools/gitc.sh)" \
        && echo "[gitc] Standzeile auf PUSH OFFEN committet (nicht gepusht). Ursache beheben, dann erneut pushen." >&2
      sperren_wegraeumen
    else
      echo "[gitc] ⚠️ Standzeile NICHT umgestellt - von Hand: python3 tools/standzeile.py offen" >&2
    fi
  fi
}

pr_ablauf() {
  local sha7 zweig titel rc body url
  sha7="$(git rev-parse --short=7 HEAD)"
  zweig="${GITC_ZWEIG:-pr/$(date +%Y-%m-%d)-$sha7}"
  titel="$(git log -1 --format=%s)"
  sperren_wegraeumen
  git push origin "HEAD:refs/heads/$zweig"
  rc=$?
  sperren_wegraeumen
  if [ "$rc" -ne 0 ]; then push_offen_vermerken "$rc"; return "$rc"; fi
  mkdir -p "$H_PR"; printf '%s %s\n' "$zweig" "$(git rev-parse HEAD)" > "$H_PR/pr_zweig.txt"
  echo "[gitc] Zweig $zweig = HEAD $sha7 gepusht (Beleg: git ls-remote origin refs/heads/$zweig)"
  if ! command -v gh >/dev/null 2>&1 || ! gh auth status >/dev/null 2>&1; then
    echo "[gitc] ►► kein gh-Login (Cloud-Sitzung?): PR und Merge macht der Chat ueber die GitHub-Werkzeuge -"
    echo "        create_pull_request(base main, head $zweig, Titel \"$titel\"), dann enable_pr_auto_merge (SQUASH)."
    return 0
  fi
  body="$(mktemp)"
  { git log -1 --format=%b; echo; echo "Angelegt von tools/gitc.sh push origin main (Auto-Merge, Squash, wartet auf die Pflicht-Checks)."; } > "$body"
  url="$(gh pr create --base main --head "$zweig" --title "$titel" --body-file "$body")"; rc=$?
  rm -f "$body"
  if [ "$rc" -ne 0 ] || [ -z "$url" ]; then
    echo "[gitc] ⛔⛔ gh pr create gescheitert (rc $rc) - Zweig $zweig liegt auf GitHub, PR fehlt. Von Hand: gh pr create --base main --head $zweig" >&2
    return 6
  fi
  if ! gh pr merge "$url" --auto --squash; then
    echo "[gitc] ⛔⛔ Auto-Merge NICHT eingeschaltet: $url - von Hand: gh pr merge $url --auto --squash" >&2
    return 7
  fi
  echo "[gitc] PR $url: Auto-Merge (Squash) an - nach gruener CI landet er auf main. Danach: bash tools/gitc.sh nachziehen"
}

if [ "$1" = "nachziehen" ]; then nachziehen; exit $?; fi
if [ "$1" = "push" ] && [ "$#" -eq 3 ] && [ "$2" = "origin" ] && [ "$3" = "main" ]; then pr_ablauf; exit $?; fi

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
# Commit auf „PUSH DURCH". Scheitert ein Push und liegt etwas mit Wirkung beim Lerner ungepusht, stimmt sie
# nicht mehr -> auf OFFEN setzen und als eigenen Commit festhalten (NICHT pushen - der Push ging ja nicht).
# Seit Paket 1 (27.11.2026) gilt das fuer den Zweig-Push im PR-Ablauf (oben) und fuer andere Pushes hier;
# ein gepushter PR-Zweig ist KEIN Fehlschlag (der Auto-Merge bringt ihn nach main).
if [ "$1" = "push" ] && [ "$RC" -ne 0 ]; then push_offen_vermerken "$RC"; fi
exit "$RC"
