# E080 – Sicherheitsgruppe S als eigene Ratschen-Zahl `ruff_s`, begruendete Ausnahmen statt noqa
**Status:** angenommen (13.10.2026, Nutzer) · **Quelle:** BUILD_LOG 166

## Kontext
`ruff check tools --select S` mass 39 Befunde (S108 12, S607 9, S603 8, S101 4, S324 4, S602 1, S307 1; 14 davon in
`tools/archiv/`). Auf dem PC gemessen: `/tmp/…` wird zu `C:\tmp\…` (dort 0 Sicherungen), `["npx", …]` als Liste scheitert mit
FileNotFoundError, `shutil.which("npx")` findet `npx.CMD`; `hashlib.sha1(…, usedforsecurity=False)` loest S324 ohne noqa.

## Entscheid
`ruff_s` = `ruff check tools --select S --extend-ignore S603,S607,S101 --extend-exclude tools/archiv` in
`tools/qualitaet_ratsche.py`; die 9 verbleibenden Befunde werden behoben (S324 usedforsecurity=False, S602 Liste ueber
shutil.which, S108 tempfile.gettempdir()), danach Grenze 0.

## Folgen
Neue Sicherheitsbefunde (shell=True, eval, fester /tmp-Pfad, md5/sha1 ohne Kennzeichnung …) machen die Ratsche rot.
S603/S607 (Aufrufe lokaler Werkzeuge), S101 (assert) und das Archiv zaehlen nicht – Grund im Kopf von qualitaet_ratsche.py.
Pool-Sicherungen von opt_ersatz/verweis_setzen/schluessel_setzen/firmen_umlaut_setzen liegen auf dem PC jetzt in
`AppData\Local\Temp` statt `C:\tmp` (Linux/CI unveraendert `/tmp`). Selbsttest: `tools/ratsche_probe/probe_s.py` = genau S324 + S602.
