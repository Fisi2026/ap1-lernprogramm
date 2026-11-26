# M09-Zusatzregeln für Fragen-Batches „Unser Unterricht" (ERGÄNZT prompts/fragen_batch.md)

Diese Regeln ÜBERSCHREIBEN bei Widerspruch die Basis-Vorlage:

1. **modul IMMER "M09"**, pruefungsteil IMMER **"AP1"** (Regel 4 der Basis-Vorlage gilt hier NICHT –
   M09 ist die getrennte Unterrichts-Kategorie, kein AP2-Stoff).
2. **thema exakt** aus dieser Liste (Batch-Validator prüft dagegen):
   "Wertschöpfung", "Aufgabenanalyse & -synthese", "Leitungssysteme", "Führungsstile",
   "Managementtechniken", "Gantt-Diagramm", "Netzplantechnik", "Kaufmannseigenschaft",
   "Die Firma", "Rechtsformen", "Handlungsvollmachten & Prokura",
   "Kundenauftrag: Anfrage & Angebot", "Berufsausbildung (BBiG/JArbSchG)"
3. **Vorgaben je Frage** (ID, Typ, Schwierigkeit, Thema, Inhaltsanker, Quelle) stehen in
   /tmp/m09/UNTERRICHT_MATRIX.md – NUR die dir zugewiesenen IDs bauen, Anker inhaltlich treffen.
4. **Fachliche Quellen sind VERBINDLICH:**
   - Fragen mit Quelle "W#": Inhalt MUSS mit /tmp/m09/M09_FAKTEN.md Lehrbuch-Abschnitt
     übereinstimmen (das sind die Musterlösungen des Lehrbuchs).
   - Fragen mit Quelle "G" oder "A/G": NUR Fakten aus Abschnitt „BBiG/JArbSchG" verwenden.
     KEINE Paragrafen oder Fristen erfinden. Fallnamen NEU erfinden (nicht Höring/Pfiffig/
     Netzer/Meier/Schreiber/Seidel – das sind die Originale des Unterrichts-Aufgabenblatts).
5. **verweis**-Feld: "Unser Unterricht – <Thema>" (es gibt keine Modul-Kapitel für M09).
6. **konsole-Typ = Kurzantwort-Eingabe** (Nutzer-Entscheid): Die `frage` erklärt ausdrücklich,
   dass ein FACHBEGRIFF einzutippen ist (kein Konsolenbefehl). `aufgaben[].loesung` enthält alle
   akzeptierten Schreibweisen (z. B. ["Prokura","prokura"] – Groß/klein, mit/ohne Bindestrich).
   Beispiel-Format eines konsole-Eintrags aus dem Bestand in /tmp/m09/beispiel_konsole.json.
7. **freitext/erklaeren**: `schluesselbegriffe` PFLICHT, kalibriert: 2–3 pflicht + 2–4 kuer.
   Ein pflicht-Eintrag darf eine Alternativliste sein: [["Puffer","Spielraum"],"Projektdauer"].
   Pflichtbegriffe MÜSSEN wörtlich in der musterloesung vorkommen. Keine Allerweltswörter.
8. **rechenassistent randomisiert**: `variablen` mit min/max/schritt + je Schritt `formel`
   (Format siehe Beispiele im Bestand: /tmp/m09/beispiel_rechen.json). Formeln nur mit
   definierten Variablen und s1..sN. Selbst mit Grenzwerten nachrechnen (keine Division durch 0,
   keine negativen Zwischenergebnisse, Netzplan: FEZ=FAZ+Dauer usw. exakt).
9. **SVG-Typen (hotspot/beschriftung/bild)**: viewBox="0 0 700 400" bevorzugt; nur Grundformen
   (rect, line, text, path), KEINE externen Refs; Zonen/Ziel-Koordinaten exakt auf den Elementen;
   Texte ≥ 14px; Farben NUR über die im Bestand üblichen Attribute (siehe Beispiel-Fragen).
10. **erklaerungLang**: 3–6 Sätze, bei Rechnungen vollständiger Rechenweg, bei Recht die
    Paragrafen. **distraktorErklaerungen**: konkret erklären, WARUM die Option falsch ist.
11. Ausgabe: NUR das JSON-Array nach /tmp/m09/<DEINE_DATEI>.json, dann
    `node /tmp/m09/tools/validate_batch.js /tmp/m09/<DEINE_DATEI>.json` bis 0 Fehler.
    Rückmeldung an das Hauptmodell: max. 10 Zeilen (Anzahl, IDs, Validierung, Annahmen).
