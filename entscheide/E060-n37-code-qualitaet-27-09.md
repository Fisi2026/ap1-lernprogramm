# E060 – N37: Code-Qualitaet (27.09.)
**Status:** angenommen (Nutzer, 16.09.–09.10.2026; Datum je Zeile in der Frage, soweit genannt) · **Quelle:** Tabelle E1–E71 in PLAN_NEUBAU.md §1, am 27.11.2026 wortgleich hierher verschoben (BUILD_LOG 305)

## Kontext
Frage: N37: Code-Qualitaet (27.09.). Die Tabellenform trug keinen eigenen Kontext; die Begründung steht im BUILD_LOG der jeweiligen Etappe und in `PLAN_NEUBAU.md` §2.

## Entscheid
**Alle sechs Vorschlaege der Neupruefung, in sechs Teilschritten U1–U6, je Commit mit `check.sh` gruen und Push, ein Release 2.2.2 am Ende** (Nutzer „mache alles"; AskUserQuestion ~12:00, alle wie empfohlen): Schema-Quelle = `tools/schema/frage.schema.json`, TS-Typen daraus GENERIERT (json-schema-to-typescript, nur devDependency), `validierung.ts` bleibt Laufzeitpruefung, ein Test haelt beide deckungsgleich · Referenz-Regel „je Fall": `referenz/` bleibt eingefroren, bei bewusster Regelaenderung wird genau der betroffene Gleichheitstest auf eine Eigenschaft umgestellt und die Abweichung dort benannt. Verworfen: valibot im Kern · Typen von Hand · alle Gleichheitstests jetzt umstellen · 2.3.0 / kein Release.

## Folgen
In der Tabellenform nicht gesondert erfasst; siehe die Etappen in `PLAN_NEUBAU.md` §2 und den BUILD_LOG.
