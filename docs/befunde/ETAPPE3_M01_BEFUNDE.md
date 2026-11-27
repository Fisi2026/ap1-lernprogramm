# Etappe 3 · Modul M01 – Befundliste (**vollständig: 110 von 110 Fragen geprüft**)

> Verfahren nach docs/archiv/PLAENE.md: je Frage (1) markierte Antwort verifizieren, (2) jeden Distraktor prüfen,
> (3) Distraktorlängen angleichen, (4) Erklärung gegenhalten. **Befunde werden gesammelt, nicht
> einzeln korrigiert.** Diese Datei wird dem Nutzer vorgelegt; erst nach Freigabe wird geändert.

## Vorabmessung (ganzer Pool, Wächter-Definition aus `test_didaktik.js`)

| Modul | Fragen | Längen-Tell (mc) |
|---|---|---|
| M01 | 110 | 23 / 32 |
| M02 | 109 | 22 / 41 |
| M03 | 192 | 36 / 45 |
| M04 | 191 | **0 / 39** ← Etappe 1 |
| M05 | 67 | **0 / 22** ← Etappe 1 |
| M06 | 111 | **0 / 33** ← Etappe 1 |
| M07 | 133 | 21 / 45 |
| M08 | 55 | 18 / 23 |
| M09 | 105 | 4 / 5 |
| **gesamt** | **1073** | **124 / 285 = 43,5 %** |

**120 der 124 Tell-Treffer liegen in den fünf Modulen der Etappe 3**, die restlichen 4 in M09.
Etappe 3 kann den Zähler also von 124 auf ~4 drücken.

⚠️ **Umfangs-Korrektur:** START_PROMPT und PLAENE nennen „601 Fragen (M01 99 · M02 90 · M03 157 ·
M07 125 · M08 55)". Die Einzelzahlen summieren sich auf **526**, nicht 601 – sie zählen nur die
gleichnamigen Pool-**Dateien**. Nach dem `modul`-Feld gemessen sind es **599 Fragen**, verteilt auf
13 Pool-Dateien (M01 liegt z. B. auch in `pool_m_transfer.json`, `pool_m_l4.json`, `pool_m_ausbau.json`,
`pool_m_kreuztabelle.json`, `pool_m_lueckenkette.json`, `pool_m_szenario2.json`).
**Maßgeblich ist das `modul`-Feld → 599.**

---

## A · FACHLICHE BEFUNDE (Bedeutungsänderung, Nutzer-Entscheid nötig)

### A1 — M01-016 vs. M01-024 vs. M01-118: die Machbarkeitsanalyse hat zwei unvereinbare Systematiken
Im selben Feinthema „Machbarkeit & Kalkulation" stehen zwei Schemata nebeneinander:

* **M01-016** („vier Dimensionen"): technisch · wirtschaftlich · **organisatorisch** · rechtlich/zeitlich
  → richtige Antwort ist „Organisatorische Machbarkeit".
* **M01-118** („vier Dimensionen"): technisch · wirtschaftlich · **organisatorisch** · rechtlich
* **M01-024** (fünf Leitfragen, keine Zahl genannt): technisch · wirtschaftlich · **terminlich** ·
  **personell** · rechtlich — **„organisatorisch" kommt gar nicht vor.**

Ein Lerner, der M01-024 gelernt hat, kann M01-016 nicht lösen: „organisatorisch" existiert in seinem
Schema nicht.

> ⛔ **NUTZER-ENTSCHEID 27.07.2026, wörtlich: „aufteilung so lassen".**
> **Beide Systematiken bleiben unverändert.** M01-016, M01-118 und M01-024 werden NICHT angeglichen.
> Dieser Befund ist damit erledigt und darf nicht erneut vorgetragen werden.

### A2 — M01-016: Betriebsrat-Veto ist auch ein *rechtlicher* Befund
Szenario: Betriebsrat lehnt ab, weil er Massenentlassungen befürchtet. Die Distraktorerklärung zu
Option 3 sagt: „Zeitlich und rechtlich sind keine Hindernisse genannt." Das ist zu apodiktisch —
bei einer Betriebsänderung greifen **§ 111 BetrVG** (Interessenausgleich/Sozialplan) und je nach
Größe **§ 17 KSchG** (Massenentlassungsanzeige). Option 3 ist damit teilweise vertretbar.
Vorschlag: entweder das Szenario entschärfen (Betriebsrat lehnt aus Akzeptanzgründen ab, ohne
Entlassungen) oder die Distraktorerklärung präzisieren.

### A3 — M01-020: die Zusicherung „verletzt genau einen SMART-Punkt" trifft bei 2 von 4 Paaren nicht zu
`erklaerungKurz`: „Jede der vier Formulierungen erfüllt die übrigen SMART-Punkte, verletzt aber
genau einen."

* „Wir wollen den Support verbessern." → zugeordnet: **Spezifisch**.
  Verletzt aber ebenso **Messbar** und **Terminiert**.
* „Die Zufriedenheit soll spürbar steigen." → zugeordnet: **Messbar**.
  Verletzt ebenso **Terminiert**.
* „…bis Jahresende auf null Minuten" → **Realistisch**. ✅ sauber (terminiert, messbar, spezifisch erfüllt)
* „Erstlösungsquote 55 % → 70 %" → **Terminiert**. ✅ sauber

Bei einer Zuordnungsfrage ist das kritisch: die Zuordnung ist für Paar 1 und 2 nicht eindeutig
herleitbar. Vorschlag: die ersten beiden Beispiele so umschreiben, dass sie wie Paar 3 und 4 nur
genau einen Punkt verletzen (z. B. „Wir wollen bis 31.12.2026 den Support verbessern." verletzt dann
nur noch Spezifisch/Messbar — es braucht zwei getrennte Sätze).

### A4 — M01-001 / M01-401 / M01-461: „IHK-Standard/-Katalog" als fachliche Definitionsautorität
* M01-001 Fragetext: „…definiert ein Projekt **nach IHK-Katalog** korrekt?"
* M01-001 `erklaerungLang`: „**Nach IHK-Standard** (Industrie- und Handelskammer) ist ein Projekt…"
* M01-401 Fragetext: „…Merkmale eines Projektes **nach IHK-Standard**?"
* M01-461 `erklaerungLang`: „**Nach IHK-Katalog** (Industrie- und Handelskammer)…"

Die IHK gibt keinen Projektbegriff heraus. Die genannten Merkmale stammen aus **DIN 69901-5**.
Der Pool kennt DIN 69901 bisher an **keiner** Stelle.

> ✅ **NUTZER-ENTSCHEID 27.07.2026: auf DIN 69901 umstellen.**
> In M01-001, M01-401 und M01-461 wird „IHK-Standard/-Katalog" als Definitionsquelle durch
> **DIN 69901** ersetzt (Fragetext und Erklärungen). ⚠️ Der Abkürzungs-Wächter liest nur `f.frage` —
> vor dem Einsortieren prüfen, ob „DIN" dort den Zähler hochtreibt.
⚠️ Abgegrenzt: die **38 anderen** Treffer auf „IHK-Katalog" stehen im Feld `verweis`
(„IHK-Katalog FK02 – …") und meinen den Prüfungskatalog. **Das ist korrekt und bleibt.**

### A4a — M01-109: die Distraktorerklärung macht eine eindeutige Frage mehrdeutig **(schwer)**
Frage: Betriebsrat, hoher Einfluss, niedriges Interesse. Richtig ist **Zufriedenstellen** (Index 1).
Die Erklärung dazu lautet aber:

> „Das ist falsch: ‚Zufriedenstellen' ist richtig, aber ‚**Informieren' ist für hohen Einfluss +
> niedriges Interesse auch korrekt (Variante)**. ‚Zufriedenstellen' betont das ‚nicht verärgern' stärker."

Das ist sachlich falsch. In der Power-Interest-Matrix ist **Keep Informed = niedriger Einfluss +
hohes Interesse** – genau der Quadrant der 30 Beschäftigten in M01-051. Der Satz erfindet eine
zweite richtige Antwort, wo keine ist, und widerspricht M01-051 und M01-009.

**Dazu ein Struktur-Befund:** Die `distraktorErklaerungen` sind **um eine Position verschoben** —
der leere Eintrag steht auf Index 0, die Lösung ist aber Index 1. Wer richtig antwortet, bekommt
„Das ist falsch: …" zu lesen; wer Option 0 wählt, bekommt gar nichts.
⚠️ **Poolweit maschinell geprüft: M01-109 ist der EINZIGE Fall im ganzen Pool** (1073 Fragen).
Der Scan lohnt sich als Dauer-Wächter — Vorschlag: als Zusicherung in `validate_pool` aufnehmen.

### A4b — M01-107: „Brutto vor Mehrwertsteuer" ist ein Widerspruch in sich **(schwer)**
Fragetext: „Berechne die Angebotssumme (**Brutto vor Mehrwertsteuer**) Schritt für Schritt."
Die Musterlösung rechnet dann korrekt: „Angebotssumme (**Netto**) = 3.360 €."
Brutto heißt *einschließlich* Umsatzsteuer. Gefragt ist der Nettobetrag.
→ „(netto, ohne Umsatzsteuer)". Rechenweg selbst nachgerechnet und korrekt:
24 × 85 = 2.040 · + 1.200 · + 3 × 40 = **3.360 €**; brutto bei 19 % = 3.998,40 € ✓.

### A4c — M01-201: Rechenfehler in der Musterantwort für ein SMART-Ziel **(schwer)**
Die richtige Antwort lautet: „Bis 30.06.2026 erhöhen wir die Netzwerk-Verfügbarkeit von 95 % auf
**99 %** … Zielwert: max. **3,6 Stunden Ausfallzeit pro Jahr**."
Die `erklaerungLang` begründet das ausdrücklich: „Die Grenze von 3,6 Stunden Ausfall pro Jahr ist
konkret: **1 % von 8.760 Stunden**."

**1 % von 8.760 h sind 87,6 h, nicht 3,6 h.** 3,6 Stunden entsprechen einer Verfügbarkeit von
**99,96 %**. Die Frage ist ausgerechnet die, die zeigen soll, wie ein sauber messbares Ziel aussieht.

→ Entweder „99 % → max. **87,6 Stunden**" oder „**99,96 %** → max. 3,6 Stunden".
⚠️ **Fehlerklasse poolweit geprüft:** alle übrigen Verfügbarkeitsrechnungen im Pool wurden
nachgerechnet und sind **korrekt** — M07-101 (99,5 % von 720 h = 3,6 h) · M07-102 (0,1 % von
720 h = 43,2 min) · M07-308 (1 % von 744 h = 7,44 h; 98 % = 14,88 h; 99,75 % = 1,86 h) · M07-006.
**M01-201 ist der einzige Ausreißer.**

### A4d — M01-431: das sind nicht die Phasen des Wasserfallmodells **(schwer)**
Gefragt: „Bringe die folgenden Phasen eines **Wasserfallprojekts** in die richtige Reihenfolge."
Die Schritte lauten: Initialisierung → Planung → Durchführung → **Überwachung und Kontrolle** →
Abschluss.

Das sind die **fünf Prozessgruppen des klassischen Projektmanagements (PMBOK)**, nicht die Phasen
des Wasserfallmodells. Zwei Probleme:

1. Das Wasserfallmodell hat inhaltliche Phasen: Anforderungsanalyse → Entwurf → Implementierung →
   Test → Betrieb/Wartung.
2. „Überwachung und Kontrolle" ist eine **begleitende** Gruppe, die während der ganzen Laufzeit
   mitläuft. Sie als vierten Schritt zwischen Durchführung und Abschluss einzureihen, ist sachlich
   schief — die Aufgabe verlangt aber genau diese Reihenfolge als einzig richtige.

⚠️ **Drei Fragen im selben Modul nennen drei verschiedene Wasserfall-Phasenmodelle:**

| ID | genanntes Modell |
|---|---|
| M01-005 | „Sequenzielle Phasen: Analyse → Entwurf → Implementierung" |
| M01-207 | „linear (Anforderung → Design → Code → Test → Release)" |
| M01-431 | „Initialisierung → Planung → Durchführung → Überwachung → Abschluss" |

M01-005 und M01-207 sind miteinander verträglich (dasselbe Modell, unterschiedlich fein).
**M01-431 fällt heraus.** → entweder die Frage auf „Phasen eines klassischen
Projektmanagement-Ablaufs" umtiteln, oder die Schritte auf das echte Wasserfallmodell umstellen.

### A4e — M01-402: „SMART steht für Spezifisch, Messbar, Attraktiv, Realistisch"
`erklaerungKurz` im Wortlaut: „SMART steht für Spezifisch, Messbar, Attraktiv, Realistisch.
**'Terminiert' ist auch wichtig, gehört aber nicht zu den vier Kriterien in dieser Frage.**"

Der erste Satz ist falsch — SMART hat fünf Buchstaben, das T gehört dazu. Der zweite Satz ist so
verquast, dass er sich lesen lässt als „Terminiert ist kein SMART-Kriterium".
Die eigene Distraktorerklärung zu Option 5 sagt es richtig: „korrekt ist 'Terminiert'".
Widerspruch zu M01-019 („Wofür stehen die **fünf** Buchstaben") und M01-202 („Ordnen Sie die
**fünf** Buchstaben").
→ „SMART steht für Spezifisch, Messbar, Attraktiv, Realistisch und Terminiert. In dieser Frage
stehen vier davon zur Auswahl."

### A4f — M01-539: „Gewinnmarge" wird als Gewinn**zuschlag** gerechnet
Der Rechenassistent rechnet `s3 = s2 * marge/100`, also einen **Zuschlag auf die Kosten**:
bei 10.000 € Kosten und 20 % ergibt das 12.000 € Angebotspreis.
Eine **Marge** (Handelsspanne) ist üblicherweise auf den **Verkaufspreis** bezogen — 20 % Marge
auf 10.000 € Kosten wären 12.500 €. Die Formel ist als Zuschlagskalkulation richtig, nur der
Begriff ist falsch. In M02 ist die Unterscheidung Zuschlag/Spanne Prüfungsstoff.
→ **„Gewinnzuschlag"** statt „Gewinnmarge" (Fragetext, Schritt 3, `erklaerungKurz`).
Nebenbei: `erklaerungKurz` sagt „auf die **Selbstkosten**", der Fragetext „auf die
**Gesamtkosten**" — einen Begriff wählen.

### A11 — M01-552: die Eisenhower-Matrix liegt unter „Risiko & Stakeholder"
`thema` = „Risiko & Stakeholder", `gebiet` = A1. Inhaltlich geht es um **Zeitmanagement /
Selbstorganisation** (dringend × wichtig), nicht um Stakeholder oder Risiken.
Die Frage selbst ist fachlich einwandfrei (alle vier Quadranten und Zuordnungen geprüft ✓).
⚠️ Ein passenderes Feinthema existiert im Bestand womöglich nicht. **Entscheid beim Nutzer:**
so lassen · in ein bestehendes Feinthema verschieben · neues Feinthema anlegen.
⚠️ **Nicht eigenmächtig verschieben** — `apply_batch.py` führt das richtige Gebiet, und die
START_PROMPT warnt ausdrücklich davor, Gebiete zu raten.

### A12 — M01-561 und M01-970 zeigen den Vorgangsknoten in unvereinbaren Layouts **(schwer)**
Beide Fragen liegen im Feinthema „Netzplan & Puffer" und beschriften denselben Gegenstand.

* **M01-561** (`beschriftung`): Vorgangsknoten als **3 × 2**-Raster. Im SVG nachgemessen: Ziffern
  1–3 bei y = 44 (x = 51 · 125 · 198), Ziffern 4–6 bei y = 98. Also obere Reihe FAZ | Dauer | FEZ,
  untere Reihe SAZ | GP | SEZ. **Das ist die Standarddarstellung.**
* **M01-970** (`hotspot`): sechs Zonen **untereinander** — alle x = 15, w = 230, y = 10/50/90/130/
  170/210, in der Reihenfolge FAZ, Dauer, FEZ, SAZ, GP, SEZ. Also **1 × 6**.

Die eigene `erklaerungLang` von M01-970 beschreibt dabei das Raster-Layout: „Sechs Felder pro
Knoten – **oben die frühen, unten die späten** Zeiten." Das passt zu M01-561, nicht zum eigenen Bild.
Wer M01-561 gelernt hat, sucht FEZ oben rechts; in M01-970 liegt es an dritter Stelle von oben.
→ **M01-970 auf das 3 × 2-Raster umbauen** (Zonen und SVG), M01-561 bleibt Referenz.

### A13 — M01 hat elf Matrix-Fragen auf vier Muster, jedes zwei- bis dreimal
Alle elf sind fachlich einwandfrei (jede einzeln geprüft). Das Problem ist die **Wiederholung**:

| Muster | Fragen | gemeinsamer Aufbau |
|---|---|---|
| Risikomatrix | M01-553 · M01-702 · **M01-950** | seltener Großschaden → übertragen · sicherer kritischer Fall → vermeiden · **Geräteausfall mit Ersatzgerät** → akzeptieren · häufiger Kleinschaden durch Tippfehler → vermindern |
| Power-Interest | M01-051 · M01-551 · **M01-951** | mächtig+desinteressiert · mächtig+interessiert · irrelevanter Dritter · viele Betroffene ohne Macht |
| Eisenhower | M01-552 · M01-952 | akuter Serverausfall · langfristige Planung mit Frist · **alte Mails aufräumen** · triviale Anfrage delegieren |
| Aufwand-Nutzen | M01-704 · M01-953 | Quick Win per Skript · ERP-Großprojekt · wirkungslose Kosmetik · Eigenentwicklung statt Standard |

⚠️ **Der `test_matrix`-Wächter erlaubt höchstens 3 Fragen je Beispielmotiv.** Bei „Geräteausfall mit
Ersatzgerät" (Notebook · Testrechner · Etikettendrucker) und beim Power-Interest-Muster ist die
**Grenze erreicht** — eine vierte Frage dieser Art schlägt an.
→ Kein Korrekturbedarf an den bestehenden Fragen, aber: **bei künftigen Matrix-Fragen in M01 die
Motive wechseln.** Optional könnte je Muster eine Frage inhaltlich variiert werden.

### A5 — M01-007: Vertretungsregelung senkt den Schaden, nicht die Wahrscheinlichkeit
`musterloesung`: „…Eintrittswahrscheinlichkeit E wird durch Vertretung reduziert."
Eine Vertretungsregelung verhindert nicht, dass der Schlüssel-Mitarbeiter ausfällt (E bleibt) —
sie senkt die **Schadenshöhe S**. Fachlich sauber wäre: Wissenstransfer + Vertretung → S sinkt.

### A6a — Tuckman: drei Fragen sagen vier Phasen, zwei sagen fünf
Nach vollständiger Durchsicht von M01 ist das keine Einzelstelle, sondern eine Spaltung im Modul:

| ID | Aussage |
|---|---|
| M01-006 | „Tuckman beschreibt **vier** Phasen" (ohne Jahreszahl) |
| M01-203 | „Das Tuckman-Modell **(1965)** beschreibt vier Phasen" ✅ mit Jahreszahl korrekt |
| M01-707 | „Nach Tuckman durchläuft ein Team **vier** Phasen" |
| M01-601 | „Dies ist typisch die **3. von 5** Phasen" + fünf Phasen inkl. Adjourning |
| M01-602 | „Ordnen Sie die **fünf** Tuckman-Phasen zu" (mit Adjourning) |

Ein Lerner, der M01-602 übt und dann M01-006 liest, findet zwei verschiedene Modelle.
→ **Einheitlich: „vier Kernphasen (1965), 1977 um *Adjourning* ergänzt"** — dann stimmen alle fünf
Fragen, und M01-601/602 bleiben unverändert richtig.

### A6 — M01-006: „Tuckman beschreibt vier Phasen"
Tuckman/Jensen ergänzten 1977 **Adjourning** als fünfte Phase. Die Formulierung „beschreibt vier
Phasen" ist als Vollständigkeitsaussage falsch. Vorschlag: „vier Kernphasen (1965), 1977 um
*Adjourning* ergänzt".
✅ **M01-203 macht es bereits richtig**: „Das Tuckman-Modell **(1965)** beschreibt vier Phasen".
Mit der Jahreszahl ist die Aussage korrekt. → M01-006 an M01-203 angleichen, nicht umgekehrt.

### A7 — M01-116: FAZ wird in der Erklärung zu „muss spätestens starten"
Der Fragetext ist korrekt: „Sein Nachfolger D startet frühestens Tag 11 (**FAZ** D = 11)."
Die `erklaerungLang` schreibt dann: „C endet Tag 8, D **muss spätestens Tag 11 starten** →
FP(C) = 11 − 8 = 3."

„Muss spätestens starten" ist die Definition von **SAZ**, nicht FAZ. In einem Feinthema, dessen
ganzer Inhalt die Unterscheidung FAZ/SAZ/FEZ/SEZ ist, ist das eine ungünstige Verwechslung.
Der Rechenweg selbst stimmt: FP = FAZ(Nachfolger) − FEZ = 11 − 8 = 3 ✓.

### A8 — M01-119: der Klammersatz nährt das häufigste Puffer-Missverständnis
`erklaerungLang`: „Pfad 2: 9 Tage, **jeder Vorgang 1 Tag Puffer** (kann bei voller Ausschöpfung auf
10 Tage wachsen)."
Der Gesamtpuffer eines Pfades ist ein **gemeinsamer** Puffer — er lässt sich nur **einmal**
verbrauchen. „Jeder Vorgang 1 Tag" plus „volle Ausschöpfung" ergäbe gelesen 11 Tage; der
Klammerwert 10 ist richtig, die Formulierung dahin führt aber am Verständnis vorbei.
→ „Beide Vorgänge zusammen haben 1 Tag Gesamtpuffer; wird er verbraucht, sind es ebenfalls 10 Tage."

### A9 — M01-120: eine Antwortoption verrät im eigenen Text, dass sie falsch ist **(schwer)**
Option 3 lautet wörtlich:
> „Urgency: Niedrig, Impact: Niedrig → Priorität: Niedrig **(ist falsch, sollte Mittel sein)**"

Der Klammerzusatz gehört in eine Distraktorerklärung, nicht in die Option. Die zugehörige
Erklärung bestätigt das sogar: „Die Antwort ist **logisch falsch formuliert**; Niedrig + Niedrig =
Niedrig Priorität." — der Autor wusste also, dass die Option kaputt ist.
**Ohne den Klammerzusatz wäre die Option inhaltlich vertretbar** (ein einzelner Nutzer mit
Workaround lässt sich auch als Dringlichkeit „niedrig" einstufen). Die Option muss neu gebaut
werden, nicht nur bereinigt.

### A10 — M01-207: „Hybrid" ist bei sicherheitskritischer Maschinensteuerung vertretbar
Szenario: Software für **Echtzeit-Maschinensteuerung**, Anforderungen volatil → richtig ist Scrum.
Die Distraktorerklärung zu Option 3 sagt: „Hybrid ist manchmal sinnvoll, aber hier ist die
Maschinensteuerung selbst agil zu entwickeln."
Steuerungssoftware an Maschinen fällt regelmäßig unter **IEC 61508 / ISO 13849** mit
Dokumentations-, Verifikations- und Freigabepflichten, die ein rein iteratives Vorgehen
einschränken. Ein hybrides Modell ist dort gängige Praxis.
→ entweder Szenario entschärfen (keine sicherheitsgerichtete Steuerung) oder die
Distraktorerklärung abschwächen.

---

## B · INKONSISTENZEN INNERHALB EINER FRAGE

### B1 — M01-015: Fragetext nennt „Umfang", die Lücke verlangt „Auswirkung"
Fragetext: „Ein Ticket mit hoher Dringlichkeit und hohem **Umfang** erhält die ___ Priorität."
Lücke 2 der Frage lautet aber **Auswirkung**, und `erklaerungKurz` spricht von
„Kritisch + **Unternehmensweit**". Drei Begriffe für dieselbe Achse.
→ durchgehend **Auswirkung (Impact)**.

### B2 — M01-010: 10–30 Minuten vs. 15 Minuten in derselben Frage
`erklaerungKurz`: „Nach 10-30 Min, wenn keine Lösung in Sicht ist, sollte eskaliert werden."
`erklaerungLang`: „**10–15-Minuten-Regel**: Löst L1 das Problem nicht innerhalb von 15 Minuten…"
→ eine Zahl festlegen.

### B3 — M01-010: die Fragestellung passt nicht zu den Optionen
Gefragt wird „**Wann** ist Eskalation zu L2 gerechtfertigt?", geantwortet wird mit Ja/Nein.
→ „**Ist** eine Eskalation zu L2 jetzt gerechtfertigt?"

### B0 — Das Eskalationsfenster des First-Level-Supports hat drei verschiedene Werte
Alle drei im Feinthema „Ticketsystem & Support-Level":

| ID | Stelle | Wert |
|---|---|---|
| M01-010 | erklaerungKurz | „Nach 10-30 Min … sollte eskaliert werden" |
| M01-010 | erklaerungLang | „**10–15-Minuten-Regel**: … nicht innerhalb von 15 Minuten" |
| M01-112 | erklaerungKurz + Lang | „**15–30 Min**" (zweimal) |

Ein Lerner, der beide Fragen übt, bekommt drei Zahlen für dieselbe Regel.
→ **einen Wert festlegen und überall gleich schreiben.** Vorschlag: 15–30 Minuten (das ist der
Wert, der zweimal vorkommt und zu den Distraktorerklärungen in M01-112 passt).

### B4a — M01-103: kaputter Satz in der richtigen Antwort
Option 1: „…ein bedeutendes Ereignis oder Deliverable zu einem festen Termin, das ein wichtiges
Projektzwischenziel markiert **und die Dauer null ist**."
→ „…markiert und **dessen** Dauer null ist." (oder den Nebensatz ganz streichen).

### B4b — M01-102: unverständlicher Klammerzusatz in `erklaerungLang`
„Verzögerung von mehr als 2 bis 5 Tage: gefährdet einen Nachfolger, aber nicht die
Gesamtprojektdauer **(die hat andere Puffer)**."
Der Zusatz erklärt nichts. Gemeint ist: der Nachfolger hat selbst noch Puffer, deshalb schlägt die
Verzögerung nicht bis ans Projektende durch.

### B4 — M01-019: Distraktorerklärung nennt ein Wort, das in der Option nicht vorkommt
Option 1 lautet „Schnell, Motivierend, Anspruchsvoll, Rentabel, Transparent". Die Erklärung dazu
sagt: „Tempo und **Modernität** sagen nichts über die Qualität einer Zielformulierung." Modernität
gehört zu Option 3 („Aktuell").

---

## C · SPRACHE UND SCHREIBWEISE

| ID | Stelle | ist | soll |
|---|---|---|---|
| M01-001 | Option 0 | „eine routine Aufgabe mit klarem, wiederkehrenden Ablauf" | „eine Routineaufgabe mit klarem, wiederkehrendem Ablauf" |
| M01-004 | Fragetext | „Welcher SMART-Kriterien ist nicht erfüllt?" | „Welches SMART-Kriterium ist nicht erfüllt?" |
| M01-008 | Fragetext | „kalkuliert einen Datenmigrations-Projekt" | „kalkuliert ein Datenmigrationsprojekt" |
| M01-010 | Fragetext | „Email-Konto", „spezial-Wissen" | „E-Mail-Konto", „Spezialwissen" |
| M01-012 | musterloesung | „Vorgangskette …, auf **dem** alle Vorgänge" | „auf **der**" |
| M01-016 | Fragetext | „Weissger **Sanitaertechnik** GmbH" | „Sanitärtechnik" |
| M01-018 | erklaerungKurz | „Die sechs **Merkmal** eines Projektes" | „Merkmale" |
| M01-102 | distraktorErkl. 3 | ‚beliebig' (einfaches Anführungszeichen) | „beliebig" (deutsche Anführung wie sonst im Pool) |

| M01-105 | Paar 3 | „**Umsetzt** Features iterativ" | „**Setzt** Features iterativ **um**" |
| M01-105 | Paar 1 | „puffert Business-Schnittstelle" | unverständlich – umformulieren |
| M01-107 | Fragetext | „Kolbeck **Getraenkevertrieb** GmbH" | „Getränkevertrieb" |
| M01-108 | Paar 4 | „(**mobiles** Hotspot)" | „(mobiler Hotspot)" |
| M01-109 | distraktorErkl. 3 | „für **niedriges Einfluss**" | „für niedrigen Einfluss" |
| M01-106 | erklaerungKurz | „(ms statt ‚verbessern')" | deutsche Anführung |
| M01-115 | musterloesung | „ein fester, **zeitlich begrenzte** Arbeitsblock" | „zeitlich begrenzter" |
| M01-115 | musterloesung | „mit **angepasssten** Anforderungen" (3 × s) | „angepassten" |
| M01-115 | musterloesung | „produktionsreif oder **deliverbar**" | „lieferbar" |
| M01-115 | musterloesung | „Der **Vorgang** ist iterativ" | „Ablauf" – „Vorgang" ist im Netzplan ein Fachbegriff |
| M01-116 | Fragetext | „startet **am frühesten Tag 11**" | „startet frühestens an Tag 11" |
| M01-117 | Fragetext | „erstellt Vorkalkulation für Server-Upgrade" | „erstellt **eine** Vorkalkulation für **ein** Server-Upgrade" |
| M01-118 | erklaerungKurz | „ein **gravierender** Risiko" | „ein gravierendes Risiko" |
| M01-118 | Option 1 | „Team wird **dezimiert**" (bei einer Person) | „Wissen fehlt" o. ä. |
| M01-120 | distraktorErkl. 3 | „= Niedrig Priorität" | „= niedrige Priorität" |
| M01-120 | distraktorErkl. 2 | „nicht **unternehmenseinflussreich**" | „nicht unternehmenskritisch" |
| M01-201 | distraktorErkl. 2+3 | „**Zuvage**" (zweimal) | „Zu vage" |
| M01-203 | erklaerungKurz | „Rollen … **werden gerungen**" | „um Rollen … wird gerungen" |
| M01-203 | erklaerungLang | „hilft dabei **herauszuwachsen**" | umformulieren |
| M01-205 | distraktorErkl. 3 | „Schnittstellenverantwortung **folgt**." | Satz unvollständig |
| M01-433 | erklaerungLang | „Vorwärtspfad (**bottom-up**)", „Rückwärtspfad (**top-down**)" | Begriffe gehören nicht zur Netzplantechnik – streichen |
| M01-462 | erklaerungKurz | „SAZ ist **der späteste zulässige Anfangszeit**" | „der späteste zulässige Anfangszeitpunkt" |
| M01-539 | Fragetext | „ein Angebot für **einen** IT-Integrationsprojekt" | „für ein IT-Integrationsprojekt" |
| M01-603 | Fragetext | „ist **eine regelmäßig durchgeführte Meetings** …, **in dem**" | „ist ein regelmäßig durchgeführtes Meeting …, in dem" |
| M01-604 | musterloesung | „**Optionale 4. Maßnahme**" | „Optionale vierte Maßnahme" |
| M01-702 | Element 4 | „Bei der **manüllen** Übernahme" | „manuellen" |
| M01-735 | Option 4 | „keine **Kunde-sensiblen** Daten" | „keine sensiblen Kundendaten" |

⚠️ **Zum Umfang von C1:** Das Kriterium („kommt im Pool auch mit Umlaut vor") ist bewusst
konservativ. Firmennamen wie **Sassenberg Moebelwerke** (M01-551, M01-601) oder **Vierkoetter**
(M01-539) fallen durch, weil die Umlautform nirgends vorkommt. Die tatsächliche Zahl liegt also
über den gemessenen 35 Fragen. **Entscheid nötig: sollen Firmen-Eigennamen mit umgeschrieben
werden?** (Bei Eigennamen ist „oe" grundsätzlich zulässig — nur wirkt es hier unbeabsichtigt.)

### C3 — Redundanz: M01-003 und M01-462 fragen dasselbe
Beide sind `dropdown` im Feinthema „Netzplan & Puffer" und fragen die Formel `GP = ___ − FAZ`
sowie „GP = 0 liegt auf dem ___". M01-462 hat eine dritte Lücke mehr („hat ___ zeitlichen
Spielraum"), sonst sind sie deckungsgleich.
→ Kein Fehler, aber eine der beiden könnte einem anderen Aspekt gewidmet werden (z. B. freier
Puffer, oder die Rückwärtsrechnung). **Entscheid beim Nutzer.**

**Fehlerklasse „Email" poolweit gescannt:** 3 Treffer — M01-010, **M03-207**, **M06-201**.
(M06 war Teil von Etappe 1; der Befund ist dort durchgerutscht.)

### C1 — Fehlerklasse „Umlaut als ae/oe/ue geschrieben" — poolweit gemessen

Kriterium: das Wort kommt im Pool **auch** in korrekter Umlautschreibung vor (schließt Eigennamen
und Fremdwörter wie „Request", „Queue", „Bluetooth" sicher aus; die Typbezeichnung `erklaeren`
und das Wort „zuerst" sind herausgerechnet).

| Modul | betroffene Fragen | davon im **sichtbaren Aufgabentext** |
|---|---|---|
| M01 | 9 | **7** – M01-113, M01-481 bis M01-487 |
| M02 | 1 | 0 |
| M03 | 4 | 1 – M03-303 |
| M04 | 3 | 2 – M04-501, M04-913 |
| M05 | 1 | 0 |
| M06 | 1 | 0 |
| M08 | 1 | 0 |
| M09 | 15 | 15 (→ Etappe 2) |
| **gesamt** | **35** | **25** |

Betroffene Wörter u. a.: `Vorgaenge` · `Vorgaenger` · `Verzoegerung` · `Aktivitaet` ·
`Lizenzpruefung` · `Zusaetzlich` · `Altgeraete` · `Primaerschluessel` · `Fremdschluessel` ·
`Domaenencontroller` · `Identitaetsnachweis` · `Qualitaetsmanagement` · `Sachverstaendige`.
In M01 sitzen sie fast alle in den Gantt-Bildfragen **M01-481 bis M01-487**.
⚠️ Die 15 M09-Fälle gehören zu **Etappe 2** und werden hier nicht angefasst.

### C2 — Kosmetische Klassen, poolweit gemessen (Vorschlag: NICHT in Etappe 3 aufnehmen)

* **Gerade Apostrophe `'…'` statt deutscher Anführung „…"**: **180 Fragen** im ganzen Pool
  (M01 11 · M02 18 · M03 10 · M04 46 · M05 18 · M06 26 · M07 22 · M08 13 · M09 16).
  ⚠️ Dass M04 und M06 mit 46 bzw. 26 die Spitze bilden, zeigt: **Etappe 1 hat diese Klasse bewusst
  nicht angefasst.** Sie ist rein optisch und in der App kaum sichtbar. Vorschlag: weiter liegen
  lassen oder als eigener Kosmetik-Durchlauf über den ganzen Pool, nicht in Etappe 3 mischen.
* **Dezimalpunkt statt Komma**: nur **2 Fragen** — M02-953 („99.9%") und M02-956 („2.5 kW").
  Klein genug, um in Etappe 3 (Modul M02) mitgenommen zu werden.
* **`erklaerungLang` ist leer**: **29 Fragen** poolweit — M03 12 · M04 6 · M06 4 · M07 3 · M05 2 ·
  **M01 2 (M01-954, M01-955)**. Auch das hat Etappe 1 nicht angefasst. In M01 sind es nur zwei
  Fragen, die ließen sich hier mitnehmen; die übrigen 27 wären ein eigener Durchlauf.

### C4 — Geprüft und als KEIN Befund verworfen
* **`feedback2` fehlt bei M01-956.** Poolweit geprüft: es fehlt bei **allen 17** `szenario2`-Fragen.
  Das ist die Bauart des Fragetyps, kein Mangel dieser Frage. **Nicht anfassen.**

---

## D · LÄNGEN-TELL (Handgriff 3)

Bereits gemessen, noch nicht angeglichen. In den Fragen 001–024 betroffen:
**M01-001, M01-004, M01-009, M01-010, M01-011, M01-017.**

**Vollständige M01-Liste — 23 Treffer, jetzt komplett aufgelöst:**
M01-001 · M01-004 · M01-009 · M01-010 · M01-011 · M01-017 · M01-102 · M01-103 · M01-109 ·
M01-112 · M01-116 · M01-117 · M01-118 · M01-119 · M01-120 · M01-201 · M01-203 · M01-601 ·
M01-731 · M01-732 · **M01-734** · **M01-770** · **M01-771** (die letzten drei aus
`pool_m_ausbau.json` bzw. `pool_m_transfer.json`).

**Die krassesten Fälle** (richtige Antwort gegen längsten Distraktor):

| ID | richtige Antwort | längster Distraktor | Faktor |
|---|---|---|---|
| M01-770 | 213 Zeichen | 110 | 1,9 × |
| M01-201 | 192 | 48 | 4,0 × |
| M01-732 | 186 | 70 | 2,7 × |
| M01-103 | 168 | 65 | 2,6 × |
| M01-102 | 158 | 85 | 1,9 × |
| M01-771 | 156 | 108 | 1,4 × |
| M01-112 | 133 | 55 | 2,4 × |
| M01-119 | 128 | 45 | 2,8 × |

Bei M01-117 dagegen ist der Abstand **1 Zeichen** (33 gegen 32) — dort genügt ein Wort im
Distraktor. **Nicht alle 23 sind gleich viel Arbeit.**

⚠️ Ziel beim Angleichen (Lehre aus M05): **Gleichstand ±15 %, mindestens ein Distraktor über der
richtigen Antwort.** Die richtige Antwort wird **nie** gekürzt.

---

## E · WAS SAUBER IST (geprüft, kein Befund)

M01-002 (Netzplan, SVG-Daten vollständig, 10 Tage nachgerechnet ✓, Puffer B = 1 ✓) ·
M01-003 · M01-005 · M01-013 · M01-014 · M01-021 · M01-022 · M01-023 ·
M01-025 · M01-026 ·
M01-050 (Vorwärtsrechnung A0–3/B3–7/C3–9/D7–9/E9–14 komplett nachgerechnet ✓) ·
M01-051 (Power-Interest-Quadranten und alle vier Zuordnungen geprüft ✓, jedes Matrix-Element
trägt eine konkrete Zahl – der `test_matrix`-Wächter wäre zufrieden) ·
M01-052 · M01-053 ·
M01-054 (SVG-Dauern A3/B4/C6/D5/E2 gegen die Erklärung geprüft ✓, kritischer Pfad 16 Tage ✓) ·
M01-101 (alle fünf Lücken einzeln nachgerechnet: 14 · 7 · 5 · 4 · 1 ✓) ·
M01-104 · M01-106 (80 ms → 50 ms, alle fünf SMART-Punkte belegt ✓) ·
M01-108 (alle fünf Maßnahmentypen einzeln geprüft ✓) · M01-110 · M01-111 ·
M01-113 (**SVG-Balken einzeln vermessen**: Achse 30 px/Tag, Feinentwurf Tag 6–8, Implementierung
9–13, Abnahmetest 17–18, Freigabe 19–20 — alle vier Aussagen der Erklärung bestätigt ✓;
9 Vorgänge nachgezählt ✓. Nur die Umlaut-Schreibung ist zu korrigieren) ·
M01-114 · M01-117 (alle vier Optionen nachgerechnet: 9.300 · 5.635 · 6.800 · 6.545 ✓) ·
M01-202 · M01-204 · M01-205 · M01-206 ·
M01-401 (Lösungsindizes [0,2,4,5] geprüft, `distraktorErklaerungen` korrekt an den Lösungen leer ✓)

---

## F · STAND: M01 IST VOLLSTÄNDIG GEPRÜFT

**110 von 110 M01-Fragen** — alle 99 aus `pool_m01.json` plus die 11 aus `pool_m_ausbau.json`,
`pool_m_kreuztabelle.json`, `pool_m_l4.json`, `pool_m_lueckenkette.json`, `pool_m_szenario2.json`
und `pool_m_transfer.json`.

⚠️ **Es wurde NICHTS korrigiert.** Nutzer-Entscheid vom 27.07.: erst vollständig prüfen, dann in
einem Zug korrigieren.

### Die acht schweren Befunde (Bedeutungsänderung, Freigabe nötig)

| # | ID | Befund | Abschnitt |
|---|---|---|---|
| 1 | M01-201 | 3,6 h als „1 % von 8.760 h" — richtig sind 87,6 h | A4c |
| 2 | M01-109 | Distraktorerklärungen verschoben + erfundene zweite richtige Antwort | A4a |
| 3 | M01-107 | „Brutto vor Mehrwertsteuer" statt netto | A4b |
| 4 | M01-431 | PMBOK-Prozessgruppen als „Phasen des Wasserfallmodells" | A4d |
| 5 | M01-120 | Antwortoption verrät im eigenen Text, dass sie falsch ist | A9 |
| 6 | M01-970 | Vorgangsknoten als 1 × 6 statt 3 × 2 (Widerspruch zu M01-561) | A12 |
| 7 | M01-020 | „verletzt genau einen SMART-Punkt" stimmt bei 2 von 4 Paaren nicht | A3 |
| 8 | M01-402 | „SMART steht für Spezifisch, Messbar, Attraktiv, Realistisch" (T fehlt) | A4e |

Dazu die weicheren fachlichen Punkte A4f (Marge/Zuschlag), A5, A6a (Tuckman 4 vs. 5), A7 (FAZ als
„spätestens"), A8, A10, A11 (Eisenhower unter „Risiko & Stakeholder"), A13 (Matrix-Motive),
die vier Inkonsistenzen B0–B4 und **28 Sprachkorrekturen** in Abschnitt C.

### Was das über den Modulbestand sagt
Die Befunde verteilen sich **nicht** gleichmäßig:

* **Sauber — kein einziger Befund:** die Fragen aus den Etappen 4–6 (M01-019 bis M01-026,
  M01-050 bis M01-054, M01-202, M01-204) und die neueren Matrix-/Mehrfach-Fragen
  (M01-700 bis M01-707, M01-950 bis M01-953). Keine Tells, tragfähige Distraktoren,
  nachrechenbare Zahlen. **Der Qualitätssprung ist deutlich sichtbar.**
* **Alle acht schweren Befunde** liegen im Altbestand **M01-001 … M01-018**, **M01-101 … M01-207**
  und **M01-402 … M01-431**.
* **Alle Netzplan-Rechnungen wurden nachgerechnet** (M01-002, M01-050, M01-054, M01-101, M01-116,
  M01-471, M01-990, M01-991, M01-992, M01-770, M01-771) — **alle korrekt**.
* **Alle sieben Gantt-Bildfragen wurden im SVG vermessen** (M01-113, M01-481 bis M01-487): Achse
  30 px pro Tag, jeder Balken einzeln auf Start- und Endtag umgerechnet und gegen die Erklärung
  gehalten. **Alle fachlich einwandfrei** — dort ist nur die Umlautschreibung zu korrigieren.
  Insbesondere M01-487 (zwei parallele Zweige, Puffer 5 Tage, Verzögerung auf Tag 22) stimmt
  bis in die Folgevorgänge.

---

## G · KORREKTURLAUF AM 27.07.2026 — ERLEDIGT

**Nutzer-Entscheide vor dem Lauf:** alle acht schweren Befunde wie vorgeschlagen · M01-431 auf das
echte Wasserfallmodell umstellen · alle vier Sprachklassen inklusive Firmen-Eigennamen ·
Eisenhower-Feinthema bleibt · Machbarkeits-Aufteilung bleibt · IHK → DIN 69901.

### Umgesetzt

| Block | Umfang |
|---|---|
| Umlaute (C1) | **18 M01-Fragen**, inklusive SVG-Beschriftungen und Firmennamen (Möbelwerke, Vierkötter, Feldbrück, Klüssendorf, Neustädter, Sanitärtechnik, Getränkevertrieb) |
| Sprache (C) | **32 Ersetzungen** in 24 Fragen |
| Inhaltliche Befunde | **27 Korrekturen**: A4 (DIN 69901 in M01-001/401/461) · A4b · A4c · A4e · A4f · A5 · A6a · A7 · A8 · A10 · B0 · B1 · B3 · B4 · B4a · B4b |
| Neu geschrieben | **A3** M01-020 (vier Beispiele, jedes verletzt jetzt genau einen SMART-Punkt) · **A4a** M01-109 (Erklärungen an die richtige Position, Inhalt korrigiert) · **A4d** M01-431 (Wasserfall-Phasen) · **A9** M01-120 (Option 3 neu gebaut) · **A12** M01-970 (Zonen und SVG auf 3 × 2-Raster) |

### Prüflauf (alles selbst gefahren)

* `build_fragen.py` → **1073 Fragen**, 9 Fälle — Pool-Größe unverändert ✓
* **Drift 0** (zweiter Build byte-identisch) ✓
* `validate_pool` · `idcheck` · `validate_schema` · `fakten_check.py` (0 Verdachtsfälle) ✓
* Suiten gegen `sollwerte.env`: didaktik 32 · abk 20 · matrix 31 · stufen 46 · rechnen 64 ·
  freitext 38 · logik 2158 · render_smoke 21 · engine 70 · glossar 24 · teilpunkte 19 · **gantt 73** ✓

### ⚠️ Der Gantt-Wächter hat zu Recht angeschlagen
`test_gantt` fiel mit 6 Fehlern in M01-484 und M01-487. Ursache: der Test sucht die Balken über
ihre **SVG-Beschriftung** (`balkenMit(q, "Montage Klimageraet")`, `"Lizenzpruefung"`) — genau die
Wörter, die die Umlaut-Korrektur geändert hat. Die beiden Suchbegriffe wurden in `tests/test_gantt.js`
auf die Umlautschreibung nachgezogen; die Zusicherung selbst ist unverändert.

**Gegenprobe gefahren** (Pflicht nach TASKLIST): ein Balken im SVG von M01-487 um einen Tag
verschoben → der Test wurde rot (71/73). Zustand danach zurückgesetzt, wieder 73/73.
→ **Der Test misst weiterhin die Bildgeometrie, nicht nur die Beschriftung.**

---

## H · WAS NOCH OFFEN IST

### 1. Der Längen-Tell — 22 von 23 erledigt, M01 ist durch

✅✅ **ZWEITER LAUF AM 27.07.: 114 → 102 (35,8 % von 285).** Zusammen mit dem ersten Lauf:
**124 → 102**, Nenner unverändert 285 — beide Male echte Korrektur, keine Verdünnung.

**Zweiter Lauf, zwölf Fragen:** M01-116 · M01-118 · M01-119 · M01-120 · M01-201 · M01-203 ·
M01-601 · M01-731 · M01-732 · M01-734 · M01-770 · M01-771. Wieder ausschließlich Distraktoren
verlängert, **keine richtige Antwort gekürzt oder inhaltlich verändert**; alle
`distraktorErklaerungen` vorher gegengelesen, keine wurde durch die neue Formulierung ungültig.

| ID | richtig | längster Distraktor | Verhältnis | Spanne aller Distraktoren |
|---|---|---|---|---|
| M01-116 | 84 | 87 | 1,04 | 0,95–1,04 |
| M01-118 | 95 | 105 | 1,11 | 0,94–1,11 |
| M01-119 | 117 | 134 | 1,15 | 0,87–1,15 |
| M01-120 | 97 | 100 | 1,03 | 0,88–1,03 |
| M01-201 | 173 | 181 | 1,05 | 0,84–1,05 |
| M01-203 | 54 | 61 | 1,13 | 0,98–1,13 |
| M01-601 | 78 | 81 | 1,04 | 0,86–1,04 |
| M01-731 | 101 | 102 | 1,01 | 0,84–1,01 |
| M01-732 | 186 | 187 | 1,01 | 0,85–1,01 |
| M01-734 | 112 | 118 | 1,05 | 0,83–1,05 |
| M01-770 | 213 | 218 | 1,02 | 0,83–1,02 |
| M01-771 | 144 | 158 | 1,10 | 0,83–1,10 |

⚠️ **DIE FAKTOREN IN ABSCHNITT D WAREN VERALTET.** Dort steht für M01-201 „4,0 ד — gemessen
waren es 3,39 ×, weil der erste Korrekturlauf die richtige Antwort verändert hatte (87,6 h).
Auch M01-770 (1,9 → 1,85) und M01-119 (2,8 → 2,34) wichen ab. **Vor dem Angleichen neu messen,
nicht die Tabelle glauben** — sie beschreibt den Stand VOR dem ersten Lauf.

⛔ **M01-117 BLEIBT ABSICHTLICH STEHEN — NUTZER-ENTSCHEID 27.07.** Die vier Optionen sind reine
Rechenterme („3.000 + (40 × 95) + 2.500 = 9.300 €"), der Abstand beträgt **2 Zeichen** (35 gegen
33). Genau für solche Fälle gibt es `MIN_OPTIONSLAENGE = 25`; die Ausnahme greift hier nur deshalb
nicht, weil die längste Option mit 35 Zeichen über der Schwelle liegt. **Formal ein Treffer,
didaktisch keiner.** Verworfen wurden: alle vier Terme in Prosa umschreiben (ändert das
Erscheinungsbild der Rechenaufgabe) und Einheiten nur im Distraktor ergänzen (wäre selbst ein
neuer, kleinerer Tell). Der Zähler steht deshalb bei 102 und nicht bei 101.

### 1a. Der erste Lauf — 10 von 23 (Chronik)

✅ **DER ZÄHLER IST ERSTMALS SEIT ETAPPE 1 GESUNKEN: 124 → 114 (40,0 % von 285).**
Der Nenner blieb bei 285 — das ist also keine Verdünnung, sondern echte Korrektur.

Entschärft wurden: **M01-001 · M01-004 · M01-009 · M01-010 · M01-011 · M01-017 · M01-102 ·
M01-103 · M01-109 · M01-112.**
Bei allen zehn wurden **ausschließlich Distraktoren verlängert**, keine richtige Antwort gekürzt.
Jede hat jetzt mindestens einen Distraktor über der richtigen Antwort:

| ID | richtig | längster Distraktor | Verhältnis |
|---|---|---|---|
| M01-001 | 128 | 147 | 1,15 |
| M01-004 | 66 | 84 | 1,27 |
| M01-009 | 86 | 87 | 1,01 |
| M01-010 | 87 | 111 | 1,28 |
| M01-011 | 82 | 92 | 1,12 |
| M01-017 | 127 | 135 | 1,06 |
| M01-102 | 145 | 157 | 1,08 |
| M01-103 | 159 | 164 | 1,03 |
| M01-109 | 96 | 107 | 1,11 |
| M01-112 | 134 | 149 | 1,11 |

~~⚠️ **NOCH OFFEN IN M01 — 13 Fragen**~~ → **im zweiten Lauf erledigt, siehe Abschnitt 1 oben.**
Offen bleibt allein M01-117 (Nutzer-Entscheid: stehen lassen).

⚠️ **Schwelle und Ziel in `test_didaktik.js` bleiben bei 45.** Tiefer lässt es die Zusicherung
`SCHWELLE >= ZIEL` nicht zu, und das **Ziel zu senken ist ein Nutzer-Entscheid, der noch aussteht**.
Sinnvoll erst, wenn Etappe 3 komplett durch ist. Der Ratschenstand ist im Test dokumentiert.

### 2. Nicht angefasst (bewusst)
* Gerade Apostrophe (180 Fragen poolweit) — als eigener Kosmetik-Durchlauf vorgemerkt.
* Leere `erklaerungLang` in M01-954/M01-955 — im Entscheid enthalten, aber noch nicht geschrieben.
* M01-003 / M01-462 (fast deckungsgleiche Dropdowns) — kein Fehler, kein Entscheid eingeholt.

### 3. Committet, aber kein Release
Auf Nutzer-Anweisung vom 27.07. wurde der Stand **committet** (kein Push — der geht nur vom
Windows-Rechner). `APP_VERSION`, `sw.js` und `CHANGELOG` sind **unberührt**: Der Version-Bump
gehört ans Ende von Etappe 3, wenn M02, M03, M07 und M08 ebenfalls durch sind.
Das verwaiste `.git/index.lock` wurde entfernt, git arbeitet wieder normal.

Auffällig: **M01-019 bis M01-024 sind durchweg sauber gebaut** (keine Tells, Distraktoren auf
gleichem Niveau, Distraktorerklärungen greifen). Das sind die Etappe-4-Fragen vom 27.07.
Die Altlasten konzentrieren sich auf **M01-001 bis M01-018**.
