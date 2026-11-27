# E063 – N38: Leistung + Code (28.09.)
**Status:** angenommen (Nutzer, 16.09.–09.10.2026; Datum je Zeile in der Frage, soweit genannt) · **Quelle:** Tabelle E1–E71 in PLAN_NEUBAU.md §1, am 27.11.2026 wortgleich hierher verschoben (BUILD_LOG 305)

## Kontext
Frage: N38: Leistung + Code (28.09.). Die Tabellenform trug keinen eigenen Kontext; die Begründung steht im BUILD_LOG der jeweiligen Etappe und in `PLAN_NEUBAU.md` §2.

## Entscheid
**Hülle UND App vor dem Pool** (löst E31 ab; Nutzer: P1–P4 und Q1, Q2, Q4 per AskUserQuestion, alle gewählt): die App zeichnet sofort, nur Schirme, die Fragen brauchen, warten mit Ladezustand; der Pool wird per `modulepreload` parallel geholt. Anlass gemessen (Lighthouse 12, mobil, live, 28.09.): Score 65, LCP 5,5 s, TBT 470 ms – die Startseite erschien erst nach dem Pool (647 KB Übertragung, Start erst bei 566 ms), danach ein Task von 396 ms.

## Folgen
In der Tabellenform nicht gesondert erfasst; siehe die Etappen in `PLAN_NEUBAU.md` §2 und den BUILD_LOG.
