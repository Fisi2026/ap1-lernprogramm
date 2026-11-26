# referenz/ – die alte App (nicht ausgeliefert)

Seit N29 Teil 2 (24.09.2026, E39) liegt hier die alte App; ausgeliefert wird nur `v2/` (`wrangler.jsonc`).
Unveraendert eingefroren im Tag **`alt-app-final`**. Sie dient nur noch als Referenz:

* `tests/` im Wurzelordner: Suiten mit `boot()` laden sie flach (`tools/work_dateien.sh`).
* `neu/`: die Gleichheitstests lesen sie ueber `neu/src/testhilfe/altquelle.ts`.
* `referenz/tests/`: die 28 Suiten der Sorte (c) nach E21/E38 – laufen NICHT mehr.

⛔ Nicht weiterentwickeln (E17). Der Kern (`logik.js` u. a.) liegt bis N34 an der Wurzel.
