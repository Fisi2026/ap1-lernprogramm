# E029 – N32: Fehlerbericht (23.09.)
**Status:** angenommen (Nutzer, 16.09.–09.10.2026; Datum je Zeile in der Frage, soweit genannt) · **Quelle:** Tabelle E1–E71 in PLAN_NEUBAU.md §1, am 27.11.2026 wortgleich hierher verschoben (BUILD_LOG 305)

## Kontext
Frage: N32: Fehlerbericht (23.09.). Die Tabellenform trug keinen eigenen Kontext; die Begründung steht im BUILD_LOG der jeweiligen Etappe und in `PLAN_NEUBAU.md` §2.

## Entscheid
**Automatisch, mit Hinweis** (AskUserQuestion ~08:40, wie empfohlen). Die Error Boundary eines Bereichs sendet an `POST /api/fehler` und sagt es im Absturz-Kasten („Ein Fehlerbericht wurde gesendet – ohne Lernstand, ohne Person“).

## Folgen
In der Tabellenform nicht gesondert erfasst; siehe die Etappen in `PLAN_NEUBAU.md` §2 und den BUILD_LOG.
