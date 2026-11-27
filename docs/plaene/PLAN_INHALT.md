# PLAN_INHALT – Inhaltsrunden fuer den Fragenpool

⚠️ **Dieser Plan traegt keine Zahlen als Zustand.** Jede Runde misst neu (`abdeckung.py`, `pool_query.js`).
Pflicht vor jeder Runde: `START_PROMPT.md`, `regeln/pool.md` und `regeln/messen.md` GANZ (Pool-Arbeit, seit N49 W1).

## Entscheide (Nutzer, 10.10.2026, AskUserQuestion)

* **Schwerpunkt:** Katalog-Luecken pruefen – nur ECHTE Luecken fuellen.
* **Quellen:** keine neuen; Pruefungskatalog (`tools/katalog/`, massgeblich) und Lehrbuch wie bisher.
* **Reihenfolge:** meiste Kandidaten zuerst. „Nach Pruefungsgewicht" war gewuenscht, ist aber nicht messbar:
  die Pruefungsordnung nennt keine Soll-Gewichtung (`docs/befunde/SORTIERUNG_PRUEFUNGSORDNUNG.md`), alte Pruefungen liegen
  nicht vor. Kommen alte AP1-Pruefungen dazu, wird die Reihenfolge neu entschieden.
* **Ablauf je Runde:** erst Liste, dann Entscheid, dann Fragen schreiben.
* **Umfang:** ein Katalogbereich je Chat; umgesetzt wird erst nach dem Wochen-Reset des Kontingents.
* **Runde 1 (Nutzer-Entscheid 10.10. abends):** Liste UND Fragen in einem Zug, ohne Zwischenentscheid;
  3 Fragen je echter Luecke, Typen gemischt (mc hoechstens ~50 %), danach 2.4.0 + Push nach gruenem `check.sh`.

* **Runden 5–7 ohne Nutzer (Entscheid 11.10. mittags, AskUserQuestion, Nutzer 3 h weg):** alle drei Runden (01, 02, 05)
  in EINEM neuen Chat, bis das Sitzungslimit erreicht ist – die Wache sichert mit Reserve vorher. Je Runde echte Luecken
  UND Grenzfaelle fuellen, 3 Fragen je Luecke, 2 je Grenzfall, Typen gemischt (mc hoechstens ~50 %); KEIN Zwischenentscheid.
  Nur BESTEHENDE Themen – passt keins, kommt die Luecke nur auf die Liste. Fachfehler korrigieren, wenn am Original belegt
  (Primaerquelle per WebSearch/WebFetch, poolweit nachscannen, `begriffe_belegt.json` mit Gegenprobe); Unbelegtes nur listen.
  Je Runde committen (ohne Push); **EIN Release am Ende** (2.8.0) + Push. Stoppt die Wache vorher: das Fertige als 2.8.0
  releasen und pushen, Rest in „Damit offen". Fremd-Rot in `check.sh`: beheben, wenn eindeutig Test/Werkzeug (Gegenprobe
  vorher rot/nachher gruen, BUILD_LOG), sonst stoppen und sichern. Budget danach uebrig: `apply_batch.py`/`gebiete_stand.py`
  CRLF + cp1252 beheben (`newline=""`, UTF-8-Ausgabe; Gegenprobe 5630 → 0 CRLF-Zeilen).

## Ausgangsmessung 10.10.2026

`PYTHONIOENCODING=utf-8 python3 tools/katalog/abdeckung.py` (ohne `PYTHONIOENCODING` bricht es unter Windows
mit `UnicodeEncodeError` ab – gemessen): 33 Katalogpunkte, **122 Kandidatenzeilen** (76 FEHLT, 46 „nur erklaert").
⛔ **Kandidatenfilter, kein Urteil** (Ausgabe des Werkzeugs selbst): Wortabgleich. Beispiel Fehlalarm: „Thirdlevelsupport
FEHLT", obwohl das Thema „Ticketsystem & Support-Level" 13 Fragen hat. Pool: 1131 Fragen (1010 AP1, 121 AP2-Zusatz),
81 Themen, keines DUENN oder EINSEITIG (`node tools/pool_query.js coverage`).

| Runde | Katalogbereich | Kandidaten | Stand |
|---|---|---:|---|
| 1 | 03 | 31 | durch 10.10.: 29 Fehlalarme, 2 echte Luecken im Filter + 2 ausserhalb (Fragetext-Scan), 12 Fragen M03-215…226, BUILD_LOG 127 |
| 2 | 04 | 25 | durch 10.10.: 18 Fehlalarme, 3 echte Luecken + 2 Grenzfaelle (Nutzer: alle), 15 Fragen M03-227…232, M04-224…232, Lehrtext 03/04 an 5 Stellen, BUILD_LOG 128 |
| 3 | 06 | 21 | durch 11.10.: 13 Fehlalarme, 4 echte Luecken (eine ausserhalb des Filters) + 1 Grenzfall + 1 Fachfehler im Lehrtext (BSI-Anforderungsstufen), 14 Fragen M06-210…223, Lehrtext 06 an 4 Stellen, BUILD_LOG 129 |
| 4 | 07 | 17 | durch 11.10.: 15 Fehlalarme, 1 echte Luecke (Ursachen von Widerstaenden) + 1 Grenzfall (Chancen betonen), 5 Fragen M07-225…229, Lehrtext 07 an 1 Stelle, BUILD_LOG 130 |
| 5 | 01 | 14 | durch 11.10.: 10 Fehlalarme, 2 echte Luecken + 2 Grenzfaelle, 10 Fragen M01-208…217, Lehrtext 01 an 4 Stellen, BUILD_LOG 132; Nachtrag 11.10.: 2 Fachfehler im Lehrtext 01 (Stoerung/Fehler nach ITIL Incident/Problem; Dringlichkeit ist nicht die Nutzerzahl), BUILD_LOG 135 |
| 6 | 02 | 9 | durch 11.10.: 7 Fehlalarme, 2 echte Luecken, 6 Fragen M02-208…213, Lehrtext 02 an 2 Stellen, BUILD_LOG 132 |
| 7 | 05 | 5 | durch 11.10.: 5 Fehlalarme, 0 Luecken, 1 Fachfehler im Lehrtext (Qualitaetslenkung = Quality Control), BUILD_LOG 132 |

## Ablauf einer Runde

1. Messen: `abdeckung.py` neu, nur den Bereich der Runde.
2. ⚠️ **Zusaetzlich jeden Katalogpunkt des Bereichs gegen die FRAGETEXTE scannen** (Runde 1: zwei der vier Luecken meldete der Filter nicht, weil ihre Woerter nur in Erklaerungen standen). Dann jede Kandidatenzeile einzeln gegen den Pool lesen (`node tools/pool_query.js suche|kontext`) und einordnen:
   **Fehlalarm** (Begriff ist abgedeckt, andere Schreibweise/anderes Thema) · **echte Luecke AP1** · **AP2** (laut Katalog,
   LEHREN Teil A: „eine Luecke gegenueber einer Quelle ist keine Luecke bei uns" – Teil pruefen).
3. Dem Nutzer die echten AP1-Luecken als Liste vorlegen (AskUserQuestion), mit Fundstelle im Katalog.
4. Nach Entscheid: Fragen im Batch nach dem bewaehrten Verfahren (LEHREN Teil A, `tools/apply_batch.py`), Verweise,
   Suiten, Bau, `check.sh` voll; Release-Bump vorher erfragen.
5. Hier die Zeile der Runde nachziehen: Fehlalarme / echte Luecken / neue Fragen, Datum, BUILD_LOG-Nummer.
