# E062 – Lernstand-Inhalt (27.09.)
**Status:** angenommen (Nutzer, 16.09.–09.10.2026; Datum je Zeile in der Frage, soweit genannt) · **Quelle:** Tabelle E1–E71 in PLAN_NEUBAU.md §1, am 27.11.2026 wortgleich hierher verschoben (BUILD_LOG 305)

## Kontext
Frage: Lernstand-Inhalt (27.09.). Die Tabellenform trug keinen eigenen Kontext; die Begründung steht im BUILD_LOG der jeweiligen Etappe und in `PLAN_NEUBAU.md` §2.

## Entscheid
**`pruefe` prueft bei zwoelf Feldern auch den INHALT** (Nutzer 16:56 „ja" auf (b)+(a), nach Rueckfrage „hat b einen Nachteil"): `lastShown`, `simUsedIds`, `gebiete`, `themen`, `module` (Text), `antworten`, `statistik`, `dailyCounts`, `themaLevel`, `themaTrack`, `fehlerDeck`, `simHistorie`. Verworfen wird nur der EINZELNE Eintrag, gemeldet als Reparatur → `lade` sichert den Rohtext (E26), Einstellungen zeigen es (E28). Geprueft wird nur, womit die App RECHNET (`simHistorie`: nur `prozent`; `richtig <= gesamt` nicht). Anlass: auch eine geladene Lernstand-Datei ging nur durch die Art-Pruefung. Verworfen: (a) allein (Annahme ungeprueft), (c) so lassen.

## Folgen
In der Tabellenform nicht gesondert erfasst; siehe die Etappen in `PLAN_NEUBAU.md` §2 und den BUILD_LOG.
