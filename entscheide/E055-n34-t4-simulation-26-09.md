# E055 – N34 T4: Simulation (26.09.)
**Status:** angenommen (Nutzer, 16.09.–09.10.2026; Datum je Zeile in der Frage, soweit genannt) · **Quelle:** Tabelle E1–E71 in PLAN_NEUBAU.md §1, am 27.11.2026 wortgleich hierher verschoben (BUILD_LOG 305)

## Kontext
Frage: N34 T4: Simulation (26.09.). Die Tabellenform trug keinen eigenen Kontext; die Begründung steht im BUILD_LOG der jeweiligen Etappe und in `PLAN_NEUBAU.md` §2.

## Entscheid
**Eine reine Datei `kern/pruefung.ts`, `logik.ts` bleibt bis T6** (AskUserQuestion ~20:40, beide wie empfohlen; verworfen: alles in `simulation.ts` – importiert `@/daten`, nicht Node-ladbar · zwei Dateien mit Note/Ergebnis in `bewertung.ts` · `logik.ts` schon jetzt entfernen – greift T6 vor). `simulation.ts` bleibt App-Schicht (Pool, Faelle, Lernstand). Seit T4 rechnet die App nichts mehr ueber `L`; `istLogik` prueft `validateFragen`.

## Folgen
In der Tabellenform nicht gesondert erfasst; siehe die Etappen in `PLAN_NEUBAU.md` §2 und den BUILD_LOG.
