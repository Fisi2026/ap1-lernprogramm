> ⛔ **VERALTET seit N29/N34 (Vermerk 27.09.2026):** Diese Vorlage beschreibt die ALTE App (`logik.js`, `app_*.js`, jsdom-Boot, alte Suiten). Fuer den Neubau gelten `SCHIENE_NEU.md`, `docs/plaene/PLAN_NEUBAU.md` und `ARCHITECTURE.md`.

# Rezept: Neuen Fragetyp einbauen (gilt für ALLE Block-C-Typen und künftige)

Jeder neue Typ folgt exakt diesem Muster – nicht neu erkunden, nur abarbeiten.
Der Hauptprompt an einen Sonnet-Agenten lautet: „Lies /tmp/prompts/fragetyp_neu.md und
/tmp/prompts/feature_draft.md. Neuer Typ: [NAME, Schema, Wertungsregel laut TASKLIST-Entscheid]."

## 1. Engine (logik.js)
- Typname in L.TYPEN ergänzen.
- validateFragen: Pflichtfelder-Checks des neuen Schemas (Muster: bestehende Typ-Blöcke ~Z.230–350;
  Maße/Längen konsistent prüfen, z. B. Matrix-Zeilen == Lösungs-Zeilen).
- gradeXxx(frage, eingabe) als reine Funktion; bei Teilpunkten: {korrekt:bool, punkte, max} zurückgeben
  – Entscheid 2026-07-12: Teilpunkte ANZEIGEN, korrekt (Fehler-Deck/Statistik) erst ab 100 %.
- duplikatScan: neue Textfelder des Schemas in die Signatur aufnehmen (sonst blind für Duplikate).

## 2. Renderer (lernprogramm_ap1.html, loeseFrage)
- Neuen `else if (iTyp === "xxx")`-Branch analog zum ähnlichsten bestehenden Typ (Tabelle → trace/
  kalkulation als Vorlage, Auswahl → mehrfach, Ketten → dropdown).
- Prüfen über setAktion-Footer (nicht eigene Buttons); nach Wertung: Färbung je Element,
  zeigeFeedback(...), ggf. zeigeDiagnose-Callsite (Guard !korrekt && !opts.simulation),
  fertig(korrekt).
- PFLICHT: document.createElement für tr/td/th; esc() für alle Inhalte; keine geraden " in el()-Strings.

## 3. Tests
- tests-Suite erweitern (Muster test_logik.js): Validierung (gültig + je Pflichtfeld ein Negativfall),
  grade (voll richtig / teilweise / falsch / Grenzfälle), gcheck: JEDE neue Frage mit Musterlösung
  → korrekt===true.
- jsdom: Frage rendern, richtig UND falsch durchspielen, Färbung + Feedback prüfen.

## 4. Inhalte
- Nach prompts/fragen_batch.md (Selbstvalidierung inklusive); ID-Bereich vorher per
  `node tools/pool_query.js ids-frei M0X-` klären.

## 5. Abschluss (Hauptmodell)
- Fachliche Einzelprüfung, bash check.sh voll grün, Checkpoint (max. 6 Zeilen).
