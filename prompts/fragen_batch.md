# Agent-Vorlage: Fragen-Batch erstellen (für Haiku/Sonnet-Subagenten)

Der Hauptprompt an den Agenten lautet nur noch:
> Lies /tmp/prompts/fragen_batch.md und erstelle danach: [ANZAHL] Fragen vom Typ [TYP]
> zu [MODUL/THEMEN], IDs ab [ID-START], Ausgabe nach /tmp/[DATEI].json.
(Vorher nach /tmp kopieren: prompts/fragen_batch.md, ARCHITECTURE.md, eine Beispiel-Pooldatei,
logik.js, fragen.js UND tools/ – sonst scheitert die Selbstvalidierung in Regel 8.)

## Regeln (gelten immer)
1. Firmenkontext: Rhaus-Metall-GmbH (mittelständischer Metallbau, eigene IT). Szenarien dort ansiedeln,
   wo es passt; keine erfundenen Produkte/Personen nötig.
2. Schema: exakt wie die Beispiel-Pooldatei in /tmp bzw. Abschnitt „Fragen-Schema" in
   /tmp/ARCHITECTURE.md. Pflicht: id, pruefungsteil, modul, thema, typ, schwierigkeit,
   frage, erklaerungKurz, erklaerungLang, verweis + typspezifische Felder.
3. thema MUSS kanonisch sein (Liste = Keys von L.THEMA_RELEVANZ in /tmp/logik.js).
4. pruefungsteil-Regel: IP-Subnetting-RECHNUNGEN, ER-Modell, M08-WiSo = "AP2"; alles andere "AP1".
5. Niveau: IHK-AP1 (Fachinformatiker Teil 1). Eindeutig lösbar, keine Antwort-Leaks im Fragetext,
   Distraktoren fachlich plausibel aber klar falsch.
6. mc: genau 1 richtige (loesungIndex) + distraktorErklaerungen (Array == Optionenlänge, "" bei richtig).
   mehrfach: loesungIndizes + distraktorErklaerungen. Rechenaufgaben: Werte selbst nachrechnen und
   den Rechenweg in erklaerungLang zeigen.
   ⚠️ mehrfach-GRENZEN (seit FB-R2b.3 von validate_batch.js HART geprüft, nicht mehr nur Bitte):
   4–6 Optionen, 2–4 richtige, mindestens 1 Distraktor. Der leere String in distraktorErklaerungen
   muss GENAU an den richtigen Optionen stehen – sonst erklärt die App eine richtige Antwort als
   Fehler. Wenn ein Auftrag eine engere Vorgabe nennt (z. B. „2–3 richtige"), gilt die Vorgabe.
11. ⚠️ **RECHTS- UND NORMFRAGEN: KEINE ZAHL, FRIST ODER SCHWELLE AUS DEM GEDÄCHTNIS.** Anlass
   (2026-07-21): Ein Batch meldete „Unsicherheiten: keine" und enthielt vier belegbar falsche
   Rechtsaussagen – erfundene Ausbildungsdauer, erfundene Bindung der Kündigungsfrist ans
   Monatsende, Tarifbindung angeblich für alle Beschäftigten, Betriebsrat angeblich nicht ab fünf
   Arbeitnehmern. Alle vier sahen plausibel aus. Regel: Entweder du kennst die Fundstelle sicher,
   oder du formulierst die Frage so um, dass sie ohne die Zahl auskommt. Erfinde NICHTS.
12. ⚠️ **KEINE ZWEI OPTIONEN, DIE SICH GEGENSEITIG AUSSCHLIESSEN UND BEIDE ALS FALSCH GELTEN.**
   Im selben Batch waren „nach der Abnahme sind keine Mängel mehr reklamierbar" und „ein nicht
   protokollierter Mangel kann später geltend gemacht werden" beide als falsch markiert – logisch
   unmöglich. Lies deine Optionen am Ende paarweise gegen.
13. ⚠️ **KEINE WERTAUSSAGEN ALS RICHTIG/FALSCH.** Formulierungen mit „ist ideal", „ist sinnvoll",
   „lohnt sich" sind Meinungen und taugen weder als Lösung noch als Distraktor. Prüfbare Aussagen
   verwenden.
7. hotspot/beschriftung (SVG): viewBox setzen; Zonen-/Ziel-Koordinaten EXAKT == rect-Koordinaten;
   bei hotspot GENAU eine Zone richtig:true; markierter Fehler wirklich falsch, ALLE anderen Werte korrekt.
8. SELBSTVALIDIERUNG (Pflicht, Token-Sparregel 5): Nach dem Schreiben
   `node /tmp/tools/validate_batch.js /tmp/[DATEI].json` ausführen (liegt in /tmp; prüft Schema via
   L.validateFragen, ID-Duplikate gegen fragen.js, thema-Kanonik, Zonen==viewBox) und iterieren, bis 0 Fehler.
9. Antwort an das Hauptmodell: NUR Anzahl, ID-Liste, Validierungsergebnis, offene Annahmen (max. 10 Zeilen).

## Was das Hauptmodell danach selbst prüft (nicht deine Aufgabe)
Fachliche Einzelprüfung, Einpflege nach pool/, build_fragen.py, check.sh.
