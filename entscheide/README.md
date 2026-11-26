# entscheide/ – eine Datei je Entscheidung (ab E072, N49 W3, Nutzer-Entscheid 10.10.2026)

E1–E71 stehen als Tabelle in `PLAN_NEUBAU.md` (Verzeichnis, wird nicht umgeschrieben). Ab **E072** bekommt jeder
Nutzer-Entscheid eine eigene Datei `E0xx-<kurztitel>.md` (Kleinbuchstaben, Ziffern, Bindestrich).
⛔ **Unveraenderlich:** wer einen Entscheid aendert, schreibt einen NEUEN mit „ersetzt E0xx“ und setzt beim alten nur
den Status auf „ersetzt durch E0yy“. `tools/entscheide.py` (Waechter 4g2) prueft: jede Nummer genau einmal, keine
Luecke, jede Datei mit Status und den drei Abschnitten. Gegenprobe: `python3 tools/entscheide.py --probe`.

Vorlage:

```
# E0xx – <Titel>
**Status:** angenommen (TT.MM.JJJJ, Nutzer) · **Quelle:** BUILD_LOG <n>

## Kontext
Was lag vor, was war gemessen (mit Befehl oder Datei).

## Entscheid
Was gilt jetzt – in einem Satz, dann Einzelheiten.

## Folgen
Was sich dadurch aendert, was dafuer in Kauf genommen wird, wo es geprueft wird.
```
