# E049 – N34: Werkzeuge (25.09.)
**Status:** angenommen (Nutzer, 16.09.–09.10.2026; Datum je Zeile in der Frage, soweit genannt) · **Quelle:** Tabelle E1–E71 in PLAN_NEUBAU.md §1, am 27.11.2026 wortgleich hierher verschoben (BUILD_LOG 305)

## Kontext
Frage: N34: Werkzeuge (25.09.). Die Tabellenform trug keinen eigenen Kontext; die Begründung steht im BUILD_LOG der jeweiligen Etappe und in `PLAN_NEUBAU.md` §2.

## Entscheid
**Direkt aus `kern/*.ts`** (AskUserQuestion ~08:40, wie empfohlen; verworfen: eigener JS-Bau des Kerns · Werkzeuge auf `referenz/logik.js`). Gemessen: Node 26 laedt `.ts` nativ, auch per `require` aus `.js` – **nur mit Endung `.ts` im Import** (ohne: „Cannot find module"). ⛔ Kern-Dateien, die ein Werkzeug laedt, importieren daher relativ mit `.ts`, nie `@/`. CI von Node 22 auf **24** (T0).

## Folgen
In der Tabellenform nicht gesondert erfasst; siehe die Etappen in `PLAN_NEUBAU.md` §2 und den BUILD_LOG.
