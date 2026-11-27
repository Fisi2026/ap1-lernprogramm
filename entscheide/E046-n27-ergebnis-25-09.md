# E046 – N27: Ergebnis (25.09.)
**Status:** angenommen (Nutzer, 16.09.–09.10.2026; Datum je Zeile in der Frage, soweit genannt) · **Quelle:** Tabelle E1–E71 in PLAN_NEUBAU.md §1, am 27.11.2026 wortgleich hierher verschoben (BUILD_LOG 305)

## Kontext
Frage: N27: Ergebnis (25.09.). Die Tabellenform trug keinen eigenen Kontext; die Begründung steht im BUILD_LOG der jeweiligen Etappe und in `PLAN_NEUBAU.md` §2.

## Entscheid
**Geschlossen, nichts übernommen** (AskUserQuestion ~07:55, wie empfohlen). Gemessen: `batches_m09/` ist der Rohbatch von v0.14.0 und längst aufgelöst – je Kennung aus `mig_m09_etappeA/B.py` gegen den Pool: 38 → M08, 28 → M01/02/03/07 (Zielkennungen alle vorhanden), 20 gelöscht (gedeckt), 19 gestrichen (BBiG), 0 ungeklärt. Übernahme hieße 66 Dubletten. `validate_pool`/`idcheck` bewusst nicht gefahren. Der Ordner liegt jetzt unter `referenz/batches_m09/`. `pool_m09_unterricht.json` bleibt `[]`.

## Folgen
In der Tabellenform nicht gesondert erfasst; siehe die Etappen in `PLAN_NEUBAU.md` §2 und den BUILD_LOG.
