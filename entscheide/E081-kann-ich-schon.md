# E081 – „Kann ich schon“: Fragen ausblenden, als richtig gebucht, zurückholbar unter „Markierte Fragen“
**Status:** angenommen (25.11.2026, Nutzer) · **Quelle:** BUILD_LOG 272

## Kontext
Nutzer-Wunsch 25.11.2026: „ich brauche eine möglichkeit fragen zu skippen wenn ich es schon kann“. Gemessen vorher: es gab
nichts dergleichen (grep nach überspring/skip/gekonnt in `neu/src`). `deckPick` (`kern/lernen.ts`) zieht jede Kandidatin genau
einmal je Runde; im Grundzustand hat das Üben-Deck 192 Fragen (Stufe 1; Stufe 2: 566, Stufe 3: 661 – `kern/auswahl.ts`
`kandidaten`, Messskript `_to_delete/helfer/skip_mess.mjs`). Ein kleineres Gewicht hätte nur die Reihenfolge in der Runde
geändert, nicht wie oft eine Frage kommt.

## Entscheid
Eine Frage lässt sich als „Kann ich schon“ ausblenden: Üben, Themen-Serie, Tagesserie und Fehler-Deck ziehen sie nicht mehr,
bis sie zurückgeholt wird. Einzelheiten (AskUserQuestion 25.11.):
* **Wirkung:** ausblenden (nicht „seltener“). Die Prüfungssimulation bleibt vollständig, die Klausurvorbereitung (M09) bekommt
  keinen Knopf.
* **Statistik:** „Kann ich schon“ VOR der Antwort zählt als richtige Antwort (`verbuche(…, true)`: Statistik, Tageszähler,
  Themenstufe, Fehler-Deck-Treffer). „Nicht mehr zeigen“ NACH der Antwort bucht nichts dazu.
* **Knopf:** vor der Antwort neben „Lösung prüfen / Aufgeben“ (und neben der Abruf-Übung), nach dem Prüfen „Nicht mehr zeigen“
  bzw. „Wird nicht mehr gezeigt – zurückholen“; in Üben, Tagesserie und „Markierte üben“.
* **Rückgängig:** Abschnitt „Übersprungen (n)“ im Bereich „Markierte Fragen“, je Frage und alle auf einmal.

## Folgen
Neues Lernstand-Feld `gekonnt` (Pool-Kennung -> Zeitpunkt), Fassung 1 -> 2 mit dem ersten Schritt in `MIGRATIONEN`
(sonst meldete `pruefe` bei jedem bisherigen Stand eine Reparatur). Die Bereitschaft enthält ab jetzt auch ungeprüfte Treffer
(in Kauf genommen). Ein alter Cache (2.12.1) liest einen Stand der Fassung 2 als „neuere Fassung“ und schreibt ihn ohne
`gekonnt` zurück – die Liste wäre dann leer. Geprüft in `kern/gekonnt.test.ts`, `schirme/gekonnt.faelle.jsdom.test.tsx`,
Sabotage `_to_delete/helfer/sabotage_gekonnt.sh` (8 Muster, 7 rot; das achte war eine Sperre ohne Wirkung und ist entfernt).
