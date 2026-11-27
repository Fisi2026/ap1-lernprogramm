# E015 – Umfang von N24 (18.09.)
**Status:** angenommen (Nutzer, 16.09.–09.10.2026; Datum je Zeile in der Frage, soweit genannt) · **Quelle:** Tabelle E1–E71 in PLAN_NEUBAU.md §1, am 27.11.2026 wortgleich hierher verschoben (BUILD_LOG 305)

## Kontext
Frage: Umfang von N24 (18.09.). Die Tabellenform trug keinen eigenen Kontext; die Begründung steht im BUILD_LOG der jeweiligen Etappe und in `PLAN_NEUBAU.md` §2.

## Entscheid
**Geteilt:** N24 zieht `simDauerMin`, `relevanzGewichtung`, `ariaAltTexte` und den Abruf-Umschalter nach; die **Typ-Hilfe** wird die eigene Etappe **N24b**, weil `typHilfeAus` ein Feature voraussetzt, das der Neubau nicht hat. **Die Abruf-Uebung gilt auch in der Tagesserie** (im Neubau derselbe Uebungsweg), **nicht** in Simulation und Einzelfrage. **`svgAltFuer` wird in `kern/` neu geschrieben** und gegen `app_util.js` in node:vm gemessen — kein UMD-Ausgang in der alten App. **`ariaAltTexte` verbessert die Beschriftung, statt sie hinzuzufuegen:** aus = die generische Zeile bleibt, an = der inhaltliche Text. Ein unbeschriftetes Bild gibt es im Neubau nicht (bewusste Abweichung von der alten App).

## Folgen
In der Tabellenform nicht gesondert erfasst; siehe die Etappen in `PLAN_NEUBAU.md` §2 und den BUILD_LOG.
