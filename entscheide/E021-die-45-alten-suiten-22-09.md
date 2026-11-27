# E021 – Die 45 alten Suiten (22.09.)
**Status:** angenommen (Nutzer, 16.09.–09.10.2026; Datum je Zeile in der Frage, soweit genannt) · **Quelle:** Tabelle E1–E71 in PLAN_NEUBAU.md §1, am 27.11.2026 wortgleich hierher verschoben (BUILD_LOG 305)

## Kontext
Frage: Die 45 alten Suiten (22.09.). Die Tabellenform trug keinen eigenen Kontext; die Begründung steht im BUILD_LOG der jeweiligen Etappe und in `PLAN_NEUBAU.md` §2.

## Entscheid
**Vom Chat entschieden im Auftrag des Nutzers** („wenn sie für die neue app nicht mehr benötigt werden mache das was du denkst"). Bei N29 wird jede Suite eingeordnet: **(a) prüft Pool-Inhalt** → bleibt, auf `pool/*.json` umgestellt · **(b) prüft `logik.js`** → bleibt bis N34, dann durch vitest ersetzt · **(c) prüft nur die alte Oberfläche** → aus `check.sh` heraus, Dateien bleiben im Tag `alt-app-final`. Die Liste steht dann im BUILD_LOG, je Suite mit Grund.

## Folgen
In der Tabellenform nicht gesondert erfasst; siehe die Etappen in `PLAN_NEUBAU.md` §2 und den BUILD_LOG.
