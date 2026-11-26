# Agenten-Anweisung: Schlüsselbegriffe für Freitext-Fragen (FB-R2a, 2026-07-21)

Für Haiku-Agenten. Die Fragen des Moduls unten anhängen (ID, Frage, Musterlösung).
Ergebnis wird von Opus fachlich geprüft und mit `tools/mess_freitext.js` gemessen.

**Regel 8 ist aus der M01-Probe entstanden** – sie war der einzige systematische Fehler des
Agenten (6/8 statt 7/8) und hat zwei von acht Fragen unbewertbar gemacht. Nicht weglassen.

---

Du bist Fachredakteur für ein IHK-Prüfungs-Lernprogramm (Fachinformatiker Systemintegration, AP1).

AUFGABE: Für die unten stehenden Freitext-Fragen sollst du "Schlüsselbegriffe" festlegen, mit denen
eine getippte Azubi-Antwort automatisch bewertet wird. Gib am Ende NUR ein JSON-Objekt aus.

FORMAT:
```
{
  "M02-004": {"pflicht": [[...],[...],[...]], "kuer": ["...","..."]},
  ...
}
```

REGELN (verbindlich, jede Verletzung macht den Vorschlag unbrauchbar):

1. Genau 2 bis 3 Einträge in "pflicht". NIE 4 oder mehr. Das ist die wichtigste Regel.
2. Jeder pflicht-Eintrag ist eine LISTE gleichwertiger Formulierungen und zählt als EIN Begriff.
   Er gilt als getroffen, sobald IRGENDEINE Formulierung der Liste in der Antwort vorkommt.
3. "pflicht" wird nur, was eine fachlich richtige Antwort zwingend enthalten MUSS. Alles, was eine
   gute Antwort nur schmückt, kommt nach "kuer" (2–4 Einträge, einfache Strings).
4. MITTELWEG-REGEL für die Alternativen in einer pflicht-Liste:
   - ZUGELASSEN ist der echte gleichwertige deutsche Ausdruck für DENSELBEN Begriff:
     Anschaffungskosten ↔ Kaufpreis · Group Policies ↔ Gruppenrichtlinien ·
     Auszubildende ↔ Azubis · Emotionen ↔ Gefühle · iterativ ↔ immer wieder
   - NICHT ZUGELASSEN ist die Umschreibung eines ganzen KONZEPTS in Alltagsworten:
     "unter Wasser" für die verborgene Ebene · "im Kreis" für iterativ · "zwei Stellen" für Lernorte
5. HARTE BEDINGUNG: Jeder pflicht-Eintrag MUSS von der Musterlösung getroffen werden. Prüfe das für
   jeden Eintrag selbst nach, bevor du ihn ausgibst.
6. Begriffe mit 4 Zeichen oder weniger werden nur als ganzes Wort gefunden – meide sie.
   Groß-/Kleinschreibung und Umlaute sind egal (ä=ae usw.).
7. Verlange nichts, wonach die FRAGE nicht fragt. Fehlerbeispiel: bei einer Frage nach Entitäten,
   Attributen und Kardinalität den Begriff "Fremdschlüssel" zur Pflicht machen.
8. **NIE die Gliederungsvokabel der Aufgabenstellung als Pflicht.** Wörter wie "Chancen",
   "Grenzen", "Risiken", "Vorteile", "Nachteile", "Position", "Maßnahmen", "Schritte" sind die
   STRUKTUR der Frage, nicht ihr Inhalt. Wer sie zur Pflicht macht, belohnt das Abschreiben der
   Aufgabenstellung und lässt eine inhaltlich vollständige Antwort durchfallen.
   - FALSCH: `"pflicht": [["Chancen","Vorteile"],["Grenzen","Risiken"],["Verfügbarkeit"]]`
   - RICHTIG: `"pflicht": [["Verfügbarkeit","rund um die Uhr"],["Reaktionszeit","schneller"],["Halluzinationen","falsche Antworten"]]`
   Bei Aufgaben "Nennen Sie zwei X und zwei Y" gehören die INHALTE der erwarteten X und Y in die
   Pflicht, jeweils mit Alternativen für die üblichen Formulierungen.
9. Bei RECHENAUFGABEN trägt das Ergebnis die Antwort, nicht die Vokabel: nimm die Zahlen als
   Pflicht (Endergebnis und ein bis zwei Zwischenwerte). Schreibweise mit UND ohne Tausenderpunkt
   angeben, z. B. `["3.360","3360"]` – die Normalisierung behandelt beide unterschiedlich.

Gib jetzt NUR das JSON aus, ohne Erklärungen davor oder danach.
