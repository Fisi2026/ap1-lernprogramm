# E034 – N29: Auslieferung (23.09.)
**Status:** angenommen (Nutzer, 16.09.–09.10.2026; Datum je Zeile in der Frage, soweit genannt) · **Quelle:** Tabelle E1–E71 in PLAN_NEUBAU.md §1, am 27.11.2026 wortgleich hierher verschoben (BUILD_LOG 305)

## Kontext
Frage: N29: Auslieferung (23.09.). Die Tabellenform trug keinen eigenen Kontext; die Begründung steht im BUILD_LOG der jeweiligen Etappe und in `PLAN_NEUBAU.md` §2.

## Entscheid
**Bauordner im Repo** (AskUserQuestion ~13:08, wie empfohlen): `wrangler.jsonc` `assets.directory: "./v2"` – Positivliste, keine Einstellung im Dashboard, kein Token. Verworfen: Cloudflare baut selbst (Build-Befehl im Dashboard) · GitHub Actions deployt (API-Token als Secret, Git-Verbindung trennen). `deploy_inhalt.py` liest den Ordner seitdem aus `wrangler.jsonc`.

## Folgen
In der Tabellenform nicht gesondert erfasst; siehe die Etappen in `PLAN_NEUBAU.md` §2 und den BUILD_LOG.
