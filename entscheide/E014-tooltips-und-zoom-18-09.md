# E014 – Tooltips und Zoom (18.09.)
**Status:** angenommen (Nutzer, 16.09.–09.10.2026; Datum je Zeile in der Frage, soweit genannt) · **Quelle:** Tabelle E1–E71 in PLAN_NEUBAU.md §1, am 27.11.2026 wortgleich hierher verschoben (BUILD_LOG 305)

## Kontext
Frage: Tooltips und Zoom (18.09.). Die Tabellenform trug keinen eigenen Kontext; die Begründung steht im BUILD_LOG der jeweiligen Etappe und in `PLAN_NEUBAU.md` §2.

## Entscheid
**Regel neu geschrieben** (`kern/glossartip.ts`, auf dem ROHTEXT) statt `glossarWrap` zu exportieren – die alte Fassung liefert HTML und bräuchte `dangerouslySetInnerHTML`; Gleichheit an allen 1131 Fragen gemessen. **Schalter `glossarTip` gleich mitgenommen** (er muss wirken, nicht nur im Lernstand stehen). **Zoom über Radix-Dialog/Popover** aus dem schon installierten Paket `radix-ui` statt eines handgebauten Overlays.

## Folgen
In der Tabellenform nicht gesondert erfasst; siehe die Etappen in `PLAN_NEUBAU.md` §2 und den BUILD_LOG.
