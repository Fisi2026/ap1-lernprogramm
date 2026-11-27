# E061 – Befund aus BUILD_LOG 71 (27.09.)
**Status:** angenommen (Nutzer, 16.09.–09.10.2026; Datum je Zeile in der Frage, soweit genannt) · **Quelle:** Tabelle E1–E71 in PLAN_NEUBAU.md §1, am 27.11.2026 wortgleich hierher verschoben (BUILD_LOG 305)

## Kontext
Frage: Befund aus BUILD_LOG 71 (27.09.). Die Tabellenform trug keinen eigenen Kontext; die Begründung steht im BUILD_LOG der jeweiligen Etappe und in `PLAN_NEUBAU.md` §2.

## Entscheid
**`validateFragen` bleibt wortgleich zur alten App** – `gebiet`, `modul`-/`id`-Muster und `thema` prueft zur Laufzeit weiter NUR das Schema in `check.sh` vor jedem Deploy (AskUserQuestion 13:58, wie empfohlen). Begruendung: der Pool kommt nur ueber den Deploy herein, und dort ist das Schema Pflicht. Verworfen: den Kern mitpruefen lassen (bewusste Regelaenderung gegen E60 „je Fall").

## Folgen
In der Tabellenform nicht gesondert erfasst; siehe die Etappen in `PLAN_NEUBAU.md` §2 und den BUILD_LOG.
