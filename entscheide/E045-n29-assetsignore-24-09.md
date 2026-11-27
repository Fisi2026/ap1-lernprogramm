# E045 – N29: `.assetsignore` (24.09.)
**Status:** angenommen (Nutzer, 16.09.–09.10.2026; Datum je Zeile in der Frage, soweit genannt) · **Quelle:** Tabelle E1–E71 in PLAN_NEUBAU.md §1, am 27.11.2026 wortgleich hierher verschoben (BUILD_LOG 305)

## Kontext
Frage: N29: `.assetsignore` (24.09.). Die Tabellenform trug keinen eigenen Kontext; die Begründung steht im BUILD_LOG der jeweiligen Etappe und in `PLAN_NEUBAU.md` §2.

## Entscheid
**Bleibt als Sicherheitsnetz** (wie empfohlen; verworfen: entfernen wie in E36 geplant) – DEPLOY.md „NIEMALS entfernen" (Schutz von `.git/config` bei Rückfall auf `.`). Kein Werkzeug liest sie; der Wurzelteil von `deploy_inhalt.py` ist entfernt (Rückfall auf `.` → rc 2).

## Folgen
In der Tabellenform nicht gesondert erfasst; siehe die Etappen in `PLAN_NEUBAU.md` §2 und den BUILD_LOG.
