# E027 – N31: mehrere Tabs (22.09.)
**Status:** angenommen (Nutzer, 16.09.–09.10.2026; Datum je Zeile in der Frage, soweit genannt) · **Quelle:** Tabelle E1–E71 in PLAN_NEUBAU.md §1, am 27.11.2026 wortgleich hierher verschoben (BUILD_LOG 305)

## Kontext
Frage: N31: mehrere Tabs (22.09.). Die Tabellenform trug keinen eigenen Kontext; die Begründung steht im BUILD_LOG der jeweiligen Etappe und in `PLAN_NEUBAU.md` §2.

## Entscheid
**„EIN Tab schreibt"** (Nutzer: „plane das neu", danach wie empfohlen). Gemessen: „neu lesen und Änderung neu anwenden" trägt NICHT (`Ueben.tsx:160` rechnet den Zug außerhalb der Änderung aus dem alten Stand). (1) Sperre `fisi_ap1_stand` über `navigator.locks`, wer sie hat, schreibt · (2) jeder weitere Tab ist **Zuschauer**: zeigt live (`storage`), schreibt nie, Hinweis „Die App ist in einem anderen Tab offen" + Knopf **„Hier weiterarbeiten"** · (3) der Knopf holt die Sperre per `BroadcastChannel`, der neue Tab liest frisch · (4) schließt der aktive Tab, geht die Sperre von selbst weiter · (5) **`rev`** als zweite Sicherung: vor jedem Schreiben Platte lesen, ist dort `rev` höher → nicht schreiben, Plattenstand übernehmen, Befund. Ohne `navigator.locks` gilt nur (5). **Läuft im aktiven Tab eine Simulation oder Tagesserie, fragt der Knopf zurück** („Im anderen Tab läuft … – trotzdem hier weiter? Dort wird abgebrochen.").

## Folgen
In der Tabellenform nicht gesondert erfasst; siehe die Etappen in `PLAN_NEUBAU.md` §2 und den BUILD_LOG.
