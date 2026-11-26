# E079 – UP031-Rest: ruff schreibt um, Typ von Hand belegt, format_gleich.py beweist
**Status:** angenommen (13.10.2026, Nutzer) · **Quelle:** BUILD_LOG 161

## Kontext
Offen waren 118 UP031-Stellen in 27 Dateien (ruff 194). Das Typ-Werkzeug `up031_typ.py` aus BUILD_LOG 158/160 lag nur unter
`_to_delete/` im Cloud-Container und ist verloren (`git ls-files`, `find _to_delete -iname '*up031*'` auf dem PC: leer).
Gemessen: `ruff --unsafe-fixes` schreibt 59 Stellen selbst um (`%s`/`%r`/`%g`/`%f`), die 59 Reste sind alle `%d`.
Die Ratsche (`qualitaet_ratsche.py`) laesst ruff nur sinken, ein Umbauwerkzeug haette danach also keine Arbeit mehr.

## Entscheid
Mischweg statt Werkzeug-Neubau: ruff schreibt die 59 Stellen um, die 59 `%d`-Stellen werden von Hand umgestellt; jede
Stelle bekommt einen Typ-Beleg mit Grund in `tools/format_belege/*.json`, und `tools/format_gleich.py` beweist die Gleichheit.
Der Entscheid vom 13.10. (BUILD_LOG 158: Stelle fuer Stelle, Archiv nicht ausnehmen) gilt weiter.

## Folgen
Zwei Commits (Teil 9: ruff-Stellen, Teil 10: `%d`). Das Werkzeug beweist Formatstring, Argumente und unveraenderten Rest,
nicht den Beleg selbst; der Beleg nennt die Codezeile, auf der er steht. Archiv-Stellen lassen sich nur mit `--help` und
ohne Argument vergleichen (alte Eingaben fehlen).
