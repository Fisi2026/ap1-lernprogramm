# E056 – N34 T6: Schnitt und Daten (26.09.)
**Status:** angenommen (Nutzer, 16.09.–09.10.2026; Datum je Zeile in der Frage, soweit genannt) · **Quelle:** Tabelle E1–E71 in PLAN_NEUBAU.md §1, am 27.11.2026 wortgleich hierher verschoben (BUILD_LOG 305)

## Kontext
Frage: N34 T6: Schnitt und Daten (26.09.). Die Tabellenform trug keinen eigenen Kontext; die Begründung steht im BUILD_LOG der jeweiligen Etappe und in `PLAN_NEUBAU.md` §2.

## Entscheid
**Drei Teile, je Commit mit `check.sh` gruen und Push** (AskUserQuestion ~21:05, alle wie empfohlen): **T6a** `validateFragen` → `kern/validierung.ts`, Werkzeuge ueber `tools/kern.js` auf `kern/*.ts` · **T6b** Glossar, Abkuerzungen, Spickzettel als `kern/tabellen/*.ts` (Kommentare wandern mit; `build_spick.py` schreibt `tabellen/spickzettel.ts`), `@wurzel` und `logik.ts` weg · **T6c** die 10 Suiten (b) und die Wurzel-Dateien weg, `check.sh`, Arbeitsregel 1, **Release 2.2.1** (Patch: fuer den Lerner nichts Sichtbares). Verworfen: ein Stueck · JSON (verliert Kommentare) · 2.3.0 / kein Release. `normText`/`duplikatScan` wandern NICHT mit – kein Aufrufer ausser logik.js selbst (gemessen).

## Folgen
In der Tabellenform nicht gesondert erfasst; siehe die Etappen in `PLAN_NEUBAU.md` §2 und den BUILD_LOG.
