# tools/archiv/ — Einmal-Skripte abgeschlossener Etappen

Diese Skripte haben ihre Runde gebaut und werden **von nichts mehr aufgerufen**. Sie liegen hier
statt in `_to_delete/`, weil sie dokumentieren, **wie eine Etappe entstanden ist** — wer wissen
will, wie die Matrix-Fragen, die Gantt-Aufgaben oder die Liniensysteme erzeugt wurden, liest sie.

⛔ **NICHT LÖSCHEN.** Verschoben am 2026-09-10 (W1 Etappe B), nachdem `grep -rn` in `check.sh`,
`verify.sh`, `ci2.sh`, `tests/`, `tools/`, `.github/` und allen `*.md` **keinen einzigen Aufruf**
gefunden hat — nur Erwähnungen in Protokollen und Archiven.

| Datei | Größe | zuletzt geändert | wofür |
|---|---:|---|---|
| `r3_5_matrix.py` | 67 KB | 2026-07-22 | Matrix-Fragen der Runde R3 |
| `r3_wirtschaft_neu.py` | 49 KB | 2026-07-21 | Wirtschafts-Fragen R3 |
| `begriffe_r2a.py` | 40 KB | 2026-07-21 | Begriffsarbeit R2a |
| `r3_2_gantt.py` | 30 KB | 2026-07-22 | Gantt-Aufgaben R3 |
| `r3_4_liniensysteme.py` | 22 KB | 2026-07-21 | Liniensysteme R3 |
| `probe_m01.js` | 9 KB | 2026-07-21 | Einmalprobe M01 |
| `kalibriere_r2a.py` | 8 KB | 2026-07-21 | Kalibrierung R2a |
| `make_screenshots.py` | 7 KB | 2026-07-18 | Manifest-Bilder (⚠️ NICHT für Fragen-Screenshots) |
| `t2_build.js` | 5 KB | 2026-07-14 | deterministischer Bau T2 |
| `diff_render.js` | 4 KB | 2026-07-14 | visueller Vergleich orig ↔ neu (T2) |

Zusammen rund **237 KB**.

## ⚠️ DREI KANDIDATEN SIND BEWUSST IN `tools/` GEBLIEBEN

`BEFUNDE_WERKZEUGE.md` §5 hatte **dreizehn** Dateien vorgeschlagen. Die Liste war aus **Größe und
Änderungsdatum** gebaut — nicht daraus, ob jemand sie noch braucht. Der Abgleich mit der Doku hat
drei zurückgeholt:

| Datei | warum sie bleibt |
|---|---|
| `validate_batch.js` | steht im **aktiven Prüfprotokoll** (`TASKLIST.md` Abschn. 2 „Self-Grade") sowie in `SCHEMA.md`, `README.md`, `ARCHITECTURE.md` |
| `fakten_check.py` | `TASKLIST.md`: „bei Fakten zusätzlich `python3 tools/fakten_check.py`" |
| `index.js` | erzeugt `FUNCTIONS.md` — die Kopfzeile dort nennt es als Generator |

►► **DIE LEHRE: „lange nicht geändert" heißt nicht „wird nicht gebraucht".** Ein Werkzeug, das
seine Aufgabe erfüllt, ändert sich nicht mehr — genau das sah in der Liste aus wie Verfall.
⚠️ **Offen für Etappe D:** ob `validate_batch.js` durch die zehn Prüfklassen von `apply_batch.py`
abgelöst ist, ist **nicht gemessen**. Wer `README.md`/`ARCHITECTURE.md` auffrischt, misst es.

## Verschoben am 2026-10-13 (Werkzeug-Inventur, BUILD_LOG 153, `BEFUNDE_WERKZEUGE.md` §13b, Nutzer-Entscheid)

Vorher geprueft: `git grep` ohne Chronik (`*_ARCHIV.md`, BUILD_LOG, BEFUNDE_*, CHANGELOG) fand **keinen Code-Aufrufer**, nur Doku.
⚠️ Die Pfade IN den Skripten stimmen hier nicht mehr (z. B. `index.js` sucht `../referenz`) – sie sind Chronik, nicht Werkzeug.

| Datei | warum archiviert (gemessen 13.10.) |
|---|---|
| `index.js` + `FUNCTIONS.md` | indexiert nur die alte App in `referenz/` (logik.js, app_*.js) – fuer `neu/` ohne Nutzen |
| `umschalten.js` (aus `sichtpruefung/`) | N29-Umschaltung alt → neu erledigt; bricht mit ENOENT `lernprogramm_ap1` ab |
| `probe_doppelziehung.js` | braucht eine Arbeitskopie MIT `app.html` (alte App) |
| `backup.sh`, `backup_rotate.sh` | `zip` fehlt auf dem PC (rc 1), prueft die alten Kernfiles `fragen.js/app.js/logik.js`; gesichert wird mit git + GitHub |
| `migration/*.py` (5) | Einmal-Migrationen Juli/Aug. – laufen auf dem heutigen Pool nicht mehr (Traceback) |

⛔ **Die `tools/migration/*.json` bleiben, wo sie sind:** `e3_gegenprobe.py` (Zeile 294) und `firmen_umlaut_setzen.py`
lesen sie als Auftragsdateien.
