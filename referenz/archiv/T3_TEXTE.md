# T3 (#85) – TEXTE-Zentralisierung (Zusammenfassung)

Stand 2026-07-15. Reines Refactoring, **keine** funktionale/optische/Wortlaut-Änderung (verifiziert: Rück-
Substitution der TEXTE-Referenzen reproduziert das Original byte-identisch – bis auf 1 rein kosmetische
Komma-Abstand-Zeile in einem JS-Array; jeder TEXTE-Wert kam wörtlich im Original vor; alle 20 Suiten grün).

## Ergebnis
- **333 zentralisierte Vorkommen**, **279 eindeutige Keys** (0 undefined-Referenzen, 0 unbenutzte Keys).
- Zentrale Struktur: `var TEXTE = { … }` in **app_util.js** (lädt vor allen String-Modulen), gegliedert nach
  Bereich/Feature: aktion, hinweis, feedback, label, einschaetzung, meta, aufgabe, overlay, fokus, nav, theme,
  fehler, start, ueben, fehlerdeck, markiert, generator, simulation, glossarSeite, spickzettelSeite, serieSeite,
  statistikSeite, einstellungenSeite, melden, stern, placeholder, tabelle.
- **Betroffene Dateien:** app_util.js (TEXTE-Block + 3 Refs), app_ui.js (28), app_frage.js (39),
  app_loeser.js (79), app_seiten.js (69), app_sim.js (34), app_pages2.js (81). Keine anderen Dateien geändert.

## Bewusst lokal belassen (mit Begründung)
- **Dynamisch/interpoliert:** Strings, die mit Variablen/Zahlen zusammengesetzt sind (`"Frage " + n + " / "…`,
  `"Richtig: " + liste`, Gantt-/Netzplan-Ergebniszeilen, `esc(f.frage)`), bleiben komplett inline – ein Zerlegen
  hätte Wortlaut-/Abstands-Risiko ohne echten Nutzen.
- **Bereits benannte Label-/Daten-Maps:** LEVEL_NAMEN, TYP_HILFE, ONB_SCHRITTE, MELDE_GRUENDE – schon zentral,
  ein Verschieben wäre nur Doppel-Umbau.
- **Inhalts-/Algorithmus-Daten:** GLOSSAR_TIPS, AP1_AUFGABEN/M04_NETZ (Prüfungsstruktur), SYNONYME/SYN_MAP/
  STOPWORTE (Freitext-Heuristik) sowie der gesamte Pool (fragen/faelle/spickzettel/abkuerzungen) – Daten, kein
  UI-Chrome.
- **Reine Icon-Glyphen** (⤢, ✕ als alleiniger Button-Inhalt): nur die zugehörigen title/aria-Texte wurden
  zentralisiert, das Glyph selbst blieb inline.
- **Ein statisches `<select>`-Options-Markup** (5 Level-Optionen, app_seiten.js sUeben): nicht aufgesplittet
  (Risiko/Nutzen).

## Verifikation (falls erneut nötig)
Rück-Substitution: TEXTE.<pfad> im Code durch die Werte aus einer flachen Map ersetzen → muss Original ergeben.
Zusätzlich: 20 Suiten (Runtime lädt TEXTE), Offline/UTF-8/Anti-Pattern-Guards.
