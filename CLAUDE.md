# AP1-Lernprogramm (FISI 2026) – Einstieg für Claude

<!-- Neu 26.11.2026 (BUILD_LOG 296, Nutzer-Entscheid nach Abgleich mit den Anthropic-Leitfäden).
     Diese Datei lädt Claude Code in JEDER Sitzung (Desktop, Cloud, CLI). Sie trägt KEINEN Stand und keine
     Regeln im Wortlaut – nur Wegweiser. Ziel laut Doku (code.claude.com/docs/en/memory): unter 200 Zeilen.
     Stand: START_PROMPT.md Abschnitt 2 · nächster Griff: letzter BUILD_LOG.md-Eintrag „Damit offen“. -->

Lern-App für die AP1-Prüfung (Fachinformatiker Systemintegration). Die App ist der Neubau `neu/` (React + TS),
ausgeliefert als `v2/` über Cloudflare; der Fragenpool liegt in `pool/`.

## Start jeder Sitzung
1. Skill `fisi:fisi-lernapp` laden (auch bei „weiter“) – er regelt Verbindung, Konto und Ablauf.
2. `bash tools/start.sh --neuer-chat <gmail|web.de>` – misst Baum, Log, Remote, CI, Plugin; zeigt den nächsten Griff.
3. Nur lesen, was der nächste Griff braucht: Werkzeug/Neubau → `EINSTIEG.md`; sonst `START_PROMPT.md` (Kern).

## Was wann gelesen wird
Die Pflichttabelle steht in `START_PROMPT.md` Abschnitt 6. Die Themendateien `regeln/*.md` werden ganz gelesen.
Beim Arbeiten an passenden Pfaden erinnern die pfadbezogenen Regeln in `.claude/rules/` daran.

## Riegel (deterministisch, nicht verhandelbar)
- Vor jedem Commit `bash check.sh` grün (nur Doku: `bash check.sh doku`); committen nur über `bash tools/gitc.sh commit -F <datei>`.
- Push nur über `bash tools/gitc.sh push origin main` (prüft den Stempel des grünen Laufs), nie `--force`.
  Der Hook `tools/hooks/git_riegel.js` sperrt direktes `git commit` und jeden Force-Push.
- Einen Version-Bump (Release) vorher beim Nutzer erfragen.
- Vor jedem Commit `git log --oneline -3` lesen – ein fremder Commit heißt: ein zweiter Chat arbeitet mit.

## Agenten
Feste Projekt-Agenten in `.claude/agents/` (Modell und Werkzeuge stehen dort): `recherche` (Haiku), `pruefer` (Opus),
`entwurf` (Sonnet, nur Kopien), `Explore` (Haiku). Regeln: Skill `fisi:agenten-orchestrierung`, `TASKLIST.md` Abschnitt 0.

## Arbeitsweise
- Keine Aussage und keine Empfehlung ohne Messung (Befehl oder Datei nennen); Ungemessenes heißt „angenommen“.
- Entscheidungen mit mehreren sinnvollen Wegen: erst fragen (AskUserQuestion), nie still ausweichen.
- Der Arbeitsbaum ist die Wahrheit, nicht die Doku.
- Nach einer Änderung an der Live-Seite selbst im eingebauten Browser prüfen (`regeln/git.md`, 26.11.2026).
- Am Ende einer Runde: `BUILD_LOG.md`-Eintrag mit Schlusszeile „Damit offen: …“.
