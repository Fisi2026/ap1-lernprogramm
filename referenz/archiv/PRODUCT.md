# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primär: **Auszubildende zum Fachinformatiker Systemintegration (FiSi) im ersten Jahr**, konkret
der Verfasser und seine Klasse/Azubi-Kollegen. Sie kennen einander; es ist kein anonymes Publikum.

Die Lage, in der gelernt wird: **am Schreibtisch, an Laptop oder Desktop** — bestätigt als
Hauptfall. Handynutzung kommt vor (die App hat Wischgesten und eine Handy-Ansicht), ist aber
nicht der Fall, auf den hin entschieden wird.

Die Aufgabe: sich auf die **AP1 (Abschlussprüfung Teil 1)** vorbereiten, in verteilten Sitzungen
über Monate, meist allein.

## Product Purpose

Ein Übungsprogramm, das den Prüfungsstoff der AP1 in Fragen, Fälle und Rechenaufgaben zerlegt und
den Lernstand mitführt. Erfolg heißt: der Lernende trifft in der Prüfung die Themen wieder, die
er hier geübt hat, und kann sich beim Üben auf das verlassen, was das Programm ihm sagt.

## Positioning

Der Fragenbestand ist **an der Prüfungsordnung ausgerichtet und belegt**, nicht gesammelt: die
Zuordnung Thema → Gebiet ist eine einzige Quelle im Code, die Gebietsverteilung wird gegen die
Prüfungsordnung nachgezählt, Gesetzeszitate und Fachbegriffe sind einzeln belegt. Ein
zusammengekaufter Fragenkatalog kann das nicht behaupten.

Zweitens: es **läuft ohne Netz und ohne Konto**. Doppelklick auf eine Datei genügt.

## Operating Context

- Verteilte Sitzungen über Monate, nicht ein Durchlauf. Der Lernstand liegt lokal.
- Zwölf Bereiche: Start, Üben, Vorbereitung nächste Klausur, Fehler-Deck, Rechen-Generator,
  Netzplan, Gantt, Prüfungssimulation, Glossar, Spickzettel, Statistik, Einstellungen.
- Betrieb auf zwei Wegen: als ausgelieferte Seite (Cloudflare) **und** per Doppelklick über
  `file://`. Beides muss funktionieren.
- Ausgeliefert wird nur, was `.assetsignore` durchlässt — heute 27 Dateien, 3106 KB.

## Capabilities and Constraints

**Umfang (Stand v1.26.0):** 1131 Fragen, 9 Fälle, 27 Zufallsaufgaben mit durchgerechneten Fällen,
Netzplan- und Gantt-Werkzeuge, Prüfungssimulation, Fehler-Deck, Glossar, Spickzettel, Statistik.

**Technische Zwänge — bindend, keine Geschmacksfrage:**

- **Kein Build-Schritt.** Vanilla JavaScript, 17 feste `<script src>`-Tags, eine `styles.css`.
  Nichts wird zusammengesetzt, nichts transpiliert.
- **Offline-Invariante.** Kein `fetch`, kein `XMLHttpRequest`, kein dynamisches `import`, kein
  berechnetes `.src =` im App-Code. Keine externen URLs. Ein Wächter prüft das bei jedem Lauf.
- **45 Testsuiten** in jsdom, davon 41 DOM-gebunden (1567 Tests). Sie kennen die heutige
  Markup-Struktur. Jede Änderung am Markup schlägt hier an.
- **DOM-Schnappschuss** über 19 Schirme und 2844 Elemente friert die Struktur ein.
- **`check.sh`** mit rund 50 Wächtern ist die Abnahme. Rot heißt: nicht ausliefern.
- **Vier Themes** (hell, dunkel, sepia, kontrast) sind im Code verdrahtet, der Kontrast-Modus mit
  eigenen Rahmenstärken.
- Abstände und Radien stehen seit dem 10.09.2026 auf einer Token-Skala (`--s0..--s11`,
  `--r1..--r4`), Schriftgrößen noch nicht (28 verschiedene Werte).

**Ausdrücklich nicht entschieden:** ob das Programm über die Klasse hinaus öffentlich wird.

## Brand Commitments

⚠️ **Am 10.09.2026 abgeloest.** Die gewachsene Bildsprache „minions" (Wortmarke, gelber Akzent
`#F4C20D`, dunkle Textleiste, Space/Hanken Grotesk) wurde auf Ansage des Nutzers aufgegeben:
*„vergesse minion und benutze shadcn als design system"*. Sie ist damit Beleg, nicht Autoritaet.

**Neue Festlegung — bindend:**

- **shadcn/ui als Design-System**, Basis `neutral`, **ausschliesslich der Dark-Modus**. Die
  Token-Werte werden 1:1 von `ui.shadcn.com` uebernommen, nicht nachempfunden (oklch,
  `--radius: 0.625rem`).
- ⛔ **Nur die Token-Schicht und die Komponenten-Grammatik, nicht die Bibliothek.** shadcn/ui ist
  React + Tailwind + Radix; die App ist Vanilla ohne Build-Schritt. Die Bibliothek einzubauen
  wuerde drei bindende Zwaenge aus „Capabilities and Constraints" brechen.
- shadcn liefert kein `--success`-Token. Das eine abgeleitete Token ist als solches im CSS
  gekennzeichnet.
- Die Themes hell und sepia entfallen. Zum Kontrast-Theme siehe „Accessibility & Inclusion".

## Evidence on Hand

- Der vollständige Fragenbestand liegt im Projekt (`pool/`, gebaut zu `fragen.js`/`faelle.js`).
- Gerenderte Bildschirmaufnahmen aller Hauptschirme lassen sich jederzeit erzeugen
  (Playwright/Chromium), ebenso ein Struktur-Schnappschuss.
- Prüfungskatalog FISI 2024 als Quelle im Projekt, maschinell aufbereitet.
- Zwei Fachstufen-Lehrbücher (LF 6–9, LF 10–12) sind aufbereitet und liegen bereit.
- **Nicht vorhanden und nicht zu erfinden:** Nutzerzahlen, Erfahrungsberichte, Erfolgsquoten,
  Prüfungsergebnisse. Es gibt keine Belege, wie gut jemand damit abgeschnitten hat.

## Product Principles

1. **Belegt schlägt behauptet.** Was das Programm anzeigt, muss im Code oder in einer Quelle
   nachweisbar sein. Das gilt für Fragen genauso wie für Fortschrittsanzeigen.
2. **Der Lernstand ist heilig.** Kein Umbau darf ihn verlieren oder stillschweigend umdeuten.
3. **Ohne Netz, ohne Konto, ohne Build.** Diese drei Zwänge stehen über jeder Bequemlichkeit
   in der Umsetzung.
4. **Dichte vor Großzügigkeit.** Der Lernende sitzt am Schreibtisch und arbeitet Fragen ab. Luft
   ist Mittel zur Lesbarkeit, nicht Selbstzweck.
5. **Jede Änderung ist messbar oder sie findet nicht statt.** `check.sh`, die Suiten und der
   Schnappschuss sind Teil des Produkts, nicht Beiwerk.

## Accessibility & Inclusion

⚠️ **Stand 10.09.2026 — auf Ansage des Nutzers zurueckgenommen:** das **Kontrast-Theme wird
ersatzlos gestrichen**. Es gibt kuenftig genau ein Aussehen (shadcn neutral, dark). Damit faellt
die Zusage „reines Schwarz/Weiss mit verstaerkten Rahmen fuer schlecht Sehende"; die
Testsuiten, die es pruefen, werden zurueckgebaut.
►► Fuer die Akte, ohne Wiedervorlage: das Programm wird laut „Users" auch von Klassenkameraden
benutzt. Wer auf hohen Kontrast angewiesen ist, hat danach keine Einstellung mehr dafuer.

**Was bleibt und nicht zurueckgenommen wurde:**

- **Drei Schriftgroessen** (Normal, Gross, Sehr gross) als Einstellung.
- **Farbsymbole ✓/✗ zusaetzlich zur Farbe** — Richtig/Falsch haengt nicht an Farbe allein.
  ⚠️ Im shadcn-Neutral-Satz traegt ohnehin nur `--destructive` Farbe; die Symbole werden damit
  wichtiger, nicht unwichtiger.
- **ARIA-/Alt-Texte fuer Grafiken** als Einstellung.
- Eigene Testsuiten `test_a11y` und `test_a11y_proxy` (ohne die Kontrast-Theme-Faelle).
- `prefers-reduced-motion` global.
- Der Kontrast-Wert 4,5:1 fuer Fliesstext bleibt Pflicht und wird von
  `impeccable detect` geprueft — der shadcn-Dark-Satz erfuellt ihn.
