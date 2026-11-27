# E040 – N29: Pool-Leser (24.09.)
**Status:** angenommen (Nutzer, 16.09.–09.10.2026; Datum je Zeile in der Frage, soweit genannt) · **Quelle:** Tabelle E1–E71 in PLAN_NEUBAU.md §1, am 27.11.2026 wortgleich hierher verschoben (BUILD_LOG 305)

## Kontext
Frage: N29: Pool-Leser (24.09.). Die Tabellenform trug keinen eigenen Kontext; die Begründung steht im BUILD_LOG der jeweiligen Etappe und in `PLAN_NEUBAU.md` §2.

## Entscheid
**Ein gemeinsamer Lader** `tools/pool_laden.js` (wie empfohlen): baut FRAGEN/FAELLE aus `pool/*.json` wie `build_fragen.py`; Gegenprobe = identisch mit der heutigen `fragen.js`/`faelle.js`. Alle Leser (auch Werkzeuge außerhalb `check.sh`) stellen darauf um; erst dann entfallen `fragen.js`, `faelle.js`, `build_fragen.py` und der Drift-Guard.

## Folgen
In der Tabellenform nicht gesondert erfasst; siehe die Etappen in `PLAN_NEUBAU.md` §2 und den BUILD_LOG.
