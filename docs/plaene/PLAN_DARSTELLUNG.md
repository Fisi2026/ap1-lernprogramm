# Umbauplan Darstellungsschicht — „Karteikasten"

**Stand 10.09.2026, zweite Fassung.** Beschlossen: Komposition **B (Karteikasten)**, Tiefe
**CSS + gezielte Markup-Schnitte**.

⚠️ **Die Bildwelt hat gewechselt:** minions ist abgeloest, es gilt **shadcn/ui, Basis `neutral`,
nur Dark**. Entwurf: `_to_delete/helfer/shadcn_v1.html`.

**Was sich dadurch am Plan aendert:**

- **0.1 (Schriftfrage) ist entschieden** — Weg B, bewusster System-Stapel. shadcns eigene
  Grammatik ist eine Workhorse-Sans; es kommen keine Schriftdateien dazu. Der Punkt entfaellt.
- **Neuer Schritt S0: die Theme-Schicht faellt.** `styles.css` Zeilen 14–48 sind vier
  Theme-Bloecke (dark, sepia, kontrast + Sonderregeln). Alle vier gehen, ein einziger
  `.dark`-Block kommt. ⛔ Das trifft die Theme-Suiten und `test_a11y` — beide werden
  zurueckgebaut, das Kontrast-Theme ist ersatzlos gestrichen (Beschluss des Nutzers).
- **Die Radien-Token von heute frueh (`--r1..--r4`) werden abgeloest** durch shadcns
  `--radius`-Kette (`0.625rem` mit `calc`-Abstufungen). Die Abstands-Skala `--s0..--s11`
  bleibt — sie deckt sich mit shadcns 4px-Raster.
- **S7 (Anti-Muster beheben) entfaellt weitgehend**: die drei farbigen Seitenstreifen, der
  3,6:1-Kontrast und der 10,88px-Text haengen alle an Bauteilen, die S0 und S3 ohnehin ersetzen.

---

## 0. Drei Dinge, die VOR dem ersten Schnitt entschieden sein müssen

### 0.1 ⛔ Die drei Schriften gibt es auf deinem Rechner nicht

**Gemessen:** `C:\Windows\Fonts` und die Nutzerschriften enthalten **weder Space Grotesk noch
Hanken Grotesk noch JetBrains Mono**, und das Projekt liefert **keine einzige Schriftdatei** aus
(kein `.woff2`, kein `@font-face`). Die Stapel in `styles.css` fallen also überall auf
`system-ui` zurück.

►► **Die „drei Schriften" der minions-Bildsprache existieren nur im CSS, nicht auf dem Bildschirm.**
Du siehst heute auf deinem eigenen Rechner in der ganzen App Segoe UI.

Zwei Wege, einer muss gewählt werden, bevor die Typo-Skala steht:

| | Was passiert | Kosten | Risiko |
|---|---|---|---|
| **A: Schriften mitliefern** | Drei `woff2` in den Ordner, `@font-face` in `styles.css` | ~90 KB auf heute 3106 KB Deploy | Offline-Invariante bleibt heil (lokale Dateien). Lizenzen prüfen — alle drei sind OFL, das passt. |
| **B: Bewusster System-Stapel** | `ui-sans-serif, system-ui, "Segoe UI", …` festschreiben, die drei Namen streichen | 0 KB | Die Identität trägt dann Farbe, Raum und Detail — nicht die Schrift. Der Entwurf ist so gebaut. |

⚠️ Der Detektor meldet zu Space Grotesk zusätzlich: *„used on so many sites they no longer feel
distinctive"*. Weg B ist damit nicht nur billiger, er ist auch nicht schlechter.

### 0.2 Der Detektor findet 6 Anti-Muster in der heutigen App — bei grünem `check.sh`

| Befund | Ort | Warum es zählt |
|---|---|---|
| Kontrast **3,6:1** (nötig 4,5:1) | `.brand .wm small` — die Zeile „AP1 · FISI" in der Leiste | Echter Barrierefreiheitsfehler in der **ausgelieferten** App |
| Funktionstext **10,88 px** | `.side-theme` — der Knopf „ANSICHT: HELL" | Unter der 11px-Grenze für bedienbaren Text |
| Dicker farbiger Seitenstreifen, **3×** | `styles.css:300`, `:394`, `.nav-item.aktiv` | 4px/3px/6px Gelb an der Kante |
| Space Grotesk als Hauptschrift | `--f-display` | siehe 0.1 |

⚠️ **`check.sh` ist bei alldem grün.** Der Kontrast-Wächter prüft diese Kombination nicht. Das ist
kein Vorwurf an ihn — es ist die Lücke, die der Detektor schließt.

### 0.3 Der Schnappschuss muss einmal bewusst neu gesetzt werden

Schritt 3 unten fasst die Seitenleiste an. Die steht auf **allen 19 Schirmen**. Der
DOM-Schnappschuss wird also auf allen 19 anschlagen — **richtigerweise**. An genau dieser Stelle
ist `node tools/schnappschuss.js --setze` fällig, und das ist ein Beschluss, keine Routine:
► Vorher lesen, was er meldet. ► Danach die Zahl (19 Screens / heute 2844 Elemente) im BUILD_LOG
festhalten. ► Erst dann weiterschneiden.

---

## 1. Was die Komposition braucht — und was der Code dafür hergeben muss

**Gemessen, wie fest jedes Bauteil in den Suiten verankert ist:**

| Klasse | in Suiten | Stellen | Bedeutung für den Umbau |
|---|---|---|---|
| `opt` | **18** | **124** | ⛔ **Markup einfrieren.** Nur CSS. |
| `panel` | 3 | 64 | Klasse behalten, nur umhüllen |
| `split` | 6 | 14 | Klasse behalten, wird zum Kartenleib |
| `kicker` | 1 | 4 | frei (28 Stellen im JS-Code) |
| `tile` | 1 | 3 | frei |
| `nav-item` | 1 | 1 | frei |
| `stat-mini` | 1 | 1 | frei |
| `menu-grid` | **0** | **0** | völlig frei |
| `workspace` | **0** | **0** | völlig frei |
| `actionbar` | **0** | **0** | völlig frei |

►► **Der Start-Schirm und die Seitenleiste sind praktisch ungetestet — die Frage-Optionen sind es
maximal.** Genau umgekehrt zum Bauchgefühl. Der Plan folgt dieser Messung.

**Wo gebaut wird** (alles über `el("<div class='…'>")`-Vorlagen, keine Komponenten):

- `app_seiten.js:66` — `render()`, der einzige Router. Ruft `renderNav()`, `renderKopf()`, dann
  eine `sXxx(m)`-Funktion je Schirm.
- `app_ui.js:265` — `renderNav()`, 8 Zeilen, baut die zwölf Leistenknöpfe.
- `app_ui.js:49` — `renderKopf()`.
- `app_seiten.js:129/147` — `menu-grid` und die zwölf `tile`-Kacheln.
- `app_frage.js:5` — `renderFrage()`, hier liegen die `.opt`. **Nicht anfassen.**

---

## 2. Die Schnitte, in dieser Reihenfolge

Zwischen **jedem** Schnitt: `bash check.sh` **und** `node tools/schnappschuss.js --pruefe`.

### S1 — Typo-Skala *(nur CSS, kein Markup)*
**27 verschiedene rem-Größen** heute — `.9 / .86 / .92 / .8 / .95 / .88 / .85 / .82 / .78 / .96 …`
nebeneinander. Auf sieben Stufen im Verhältnis 1.125 ziehen, wie beim Abstands-Umbau, mit
`tools/css_skala.py` als Vorlage (Grenze, Gegenprobe, Token-Prüfung).
⚠️ `1.15rem` und `1.18rem` liegen an der axe-Grenze für „großen Text" — **nur nach oben runden.**
**Erwartung:** Schnappschuss unverändert. Suiten unverändert.

### S2 — Eyebrows raus
`.kicker` ist eine Überschriftenmarke über der Überschrift („AUFGABENSTELLUNG", „DEINE LÖSUNG",
„WAS MÖCHTEST DU TUN?"). Das Playbook verbietet sie ausdrücklich — die Überschrift trägt sich
selbst. 28 Stellen in 5 Dateien, 4 Teststellen in 1 Suite.
**Erwartung:** Schnappschuss schlägt auf den betroffenen Schirmen an. 1 Suite nachziehen.

### S3 — Symbolschiene + Messschiene ⚠️ *der große Schnitt*
`renderNav()` von zwölf Textknöpfen (248 px) auf zwölf Symbolknöpfe (64 px), gruppiert in drei
Blöcke. `renderKopf()` bekommt die vier Zahlen: **heute · Trefferquote · Fehler-Deck fällig ·
Tage bis AP1** — alle vier liegen schon im Zustand, nichts muss gerechnet werden, was es nicht
schon gibt.
**Erwartung:** Schnappschuss schlägt auf **allen 19** Schirmen an → hier 0.3 abarbeiten.
1 Teststelle (`nav-item`).
⚠️ Symbole müssen **gezeichnete SVG** sein, keine Emoji — sonst fällt der Detektor darüber.
Der Entwurf hat sie schon, einheitlich 1,7 px Strichstärke.

### S4 — Reiterband der acht Gebiete *(neu, in `sUeben`)*
Acht Reiter mit Füllstand, der aktive physisch mit der Karte verbunden. Datenquelle:
`L.GEBIETE` + der Themenstand — beides vorhanden, keine neue Rechnung.
Der Fehler-Deck-Knopf wandert als neuntes Fach ans rechte Ende.
**Erwartung:** Schnappschuss nur auf `ueben`. Keine Teststelle.

### S5 — Start: zwölf Kacheln → Fachübersicht
`menu-grid` und `tile` (0 bzw. 3 Teststellen) fallen. An ihre Stelle: derselbe Reiterkasten wie
in S4, aufgeklappt als Übersicht — welches Fach wie voll ist, was fällig ist, wo du schwach bist.
Die zwölf Werkzeuge sind dann nur noch in der Symbolschiene, nicht doppelt.
**Erwartung:** Schnappschuss auf `start`. 1 Suite (3 Stellen).

### S6 — Statistik aufklappen
⛔ **Der schwerste Befund der Bestandsaufnahme: die Statistik-Seite zeigt keine Statistik.**
Drei zugeklappte `<details>`, 85 % leere Fläche bei 1440×900. Die Inhalte existieren — sie sind
nur zu. Aufklappen, in die Breite legen, die Bereitschaft nach oben.
**Erwartung:** Schnappschuss auf `stat`.

### S7 — Die vier Anti-Muster aus 0.2 beheben
Kontrast, 10,88px-Text, drei Seitenstreifen. Danach `impeccable detect` auf null.

---

## 3. Was ausdrücklich NICHT angefasst wird

- ⛔ **`renderFrage()` und alles unter `.opt`** — 18 Suiten, 124 Stellen.
- ⛔ **Der Lernstand.** Kein Schnitt geht an `app_state.js` oder `app_verbuchen.js`.
- ⛔ **Netzplan, Gantt, Prüfungssimulation, Rechen-Generator.** Eigene Zeichenflächen mit
  eigenen Wächtern (Klickflächen, Grafiken vollständig). Sie erben nur Farbe und Abstand.
- Die vier Themes bleiben alle vier, der Kontrast-Modus mit seinen 2px-Rahmen.
- Die Offline-Invariante: keine externe URL, kein `fetch`. Auch nicht für Schriften.

---

## 4. Ehrliche Risiken

1. **Der Karteikasten hat eine Ausnahme.** Netzplan, Gantt und Simulation passen in keine
   Karteikarte. Sie bekommen den Rahmen (Schiene + Messschiene + Reiterband), aber innen ihre
   eigene Fläche. Eine Ausnahme im System ist ein echter Preis — er ist bewusst bezahlt.
2. **S3 setzt den Schnappschuss neu.** Das Netz, das seit heute früh hängt, wird einmal komplett
   neu geknüpft. In genau diesem Moment ist es keine Prüfung. ►► Deshalb steht S3 hinter S1/S2,
   damit die harmlosen Schnitte vorher durch das *alte* Netz gegangen sind.
3. **Die Symbolschiene kostet Klarheit.** Zwölf Wörter werden zwölf Zeichen. Der Entwurf fängt
   das mit `title`-Beschriftungen ab — das ist nicht dasselbe wie ein Wort. Wenn es dich stört,
   ist die Antwort eine ausklappbare Schiene, nicht der Rückbau.
4. **Was der Lerner merkt:** alles. Das ist der Punkt der Übung. Aber nichts davon berührt
   seinen Stand, seine Fragen oder seine Ergebnisse.
