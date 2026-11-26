# E076 – Arbeitsweg „Cloud baut, PC misst“
**Status:** angenommen (12.10.2026, Nutzer, AskUserQuestion) · **Quelle:** BUILD_LOG 147

## Kontext
Gemessen am 12.10.: Push von der Cloud-Seite geht (`094765b`, nach `add_repo` mit `access: push`); `device_bash` startet auf
PC „w" nicht („Workspace unavailable"); `device_stage_files`/`device_commit_files` uebertragen byte-gleich (SHA-1 beidseitig);
Backslashes kommen in der Training Shell an. Dateien ueber die Shell zu schreiben ist langsam und fehleranfaellig.

## Entscheid
Geaendert, geprueft (`check.sh`), committet und gepusht wird auf der Cloud-Seite; der PC zieht per `git pull --ff-only` und
misst nur, was Git Bash braucht. Committet wird auf genau einer Seite.

## Folgen
Der oxlint-Waechter laeuft ohne KI-Variablen (`env -u CLAUDECODE -u AI_AGENT`, BUILD_LOG 147). Vorab-Messungen auf dem PC
gehen per tar + `device_commit_files`, danach `git checkout --` auf dem PC. Skill fisi-lernapp beschreibt den Weg (fisi 1.3.2).
