# ETAPPE 3 · M02 — BEFUNDE DER BATCH-PRÜFUNG

**Stand 2026-07-27 · 109 von 109 Fragen geprüft · KORREKTURLAUF ERLEDIGT.**
Verfahren wie bei M01: erst vollständig prüfen und vorlegen, dann in einem Zug korrigieren.

> ✅ **ALLES FREIGEGEBEN UND UMGESETZT (Nutzer-Entscheid 27.07.2026):** die elf schweren Befunde
> A1–A11 wie vorgeschlagen (M02-108 nach Weg a), die Inkonsistenzen B1–B9, die Sprachklassen
> C1–C10, das fehlende `verweis`-Feld in M02-019 … M02-028 und **alle 22 Längen-Tells**.
> **Tell-Zähler poolweit 102 → 80 (35,8 % → 28,1 %), M02 stellt jetzt keinen einzigen mehr.**
> Der Lauf steht unten in Abschnitt G.

**Fundorte:** `pool_m02.json` (90) · `pool_m_l4.json` (8) · `pool_m_g2_englisch.json` (6) ·
`pool_m_ausbau.json` (2) · `pool_m_transfer.json` (2) · `pool_m_szenario2.json` (1).
⚠️ Die 90 in der gleichnamigen Datei sind **nicht** das Modul — maßgeblich ist das `modul`-Feld.

**Verteilung:** Bezugskalkulation & Skonto 25 · Englische Fachtexte 21 · Kommunikationsmodelle 14 ·
Nutzwertanalyse 14 · Marktformen 10 · Bedarfsanalyse 9 · Präsentation & Quellen 9 · Vertriebsformen 7.
Typen: mc 42 · dropdown 12 · zuordnung 10 · mehrfach 10 · kalkulation 10 · freitext 6 · erklaeren 6 ·
rechenassistent 4 · reihenfolge 3 · bild 2 · matrix 2 · fehlersuche 1 · szenario2 1.
Stufen: 1→14 · 2→25 · 3→62 · 4→8. Gebiete: A1 75 · A2 25 · A4 9.

---

## A · SCHWERE BEFUNDE — Bedeutungsänderung, Freigabe nötig

### A1 · M02-113 — Zinssatz in der Distraktorerklärung widerspricht der Frage
Zahlungsziel 30 Tage, Skonto 2 % bei 10 Tagen. Richtige Antwort, `erklaerungKurz` und
`erklaerungLang` nennen übereinstimmend **36,7 %** — nachgerechnet: 2/98 × 360/20 = 36,7 % ✓.
**`distraktorErklaerungen[0]` sagt aber „die Annualisierung zeigt die echte Verzinslichkeit
(ca. 24 %)".** Die 24 % stammen erkennbar aus M02-016, wo das Zahlungsziel 40 Tage beträgt.
→ Vorschlag: 24 % durch 36,7 % ersetzen.

### A2 · M02-952 — vier Fehler in einer Frage (Softwarelizenz, englisch)
1. `erklaerungLang`: **„non-exclusive" = nicht exklusiv (Nutzer darf weiterverkaufen, aber ...)** —
   sachlich falsch und mitten im Satz abgebrochen. „Non-exclusive" heißt, dass **der Anbieter**
   dieselbe Software weiter an andere lizenzieren darf; über ein Weiterverkaufsrecht des Nutzers
   sagt es nichts — die nächste Klausel verbietet die Weitergabe sogar ausdrücklich.
2. `erklaerungLang`: **„Die Falsch-Antwort ‚auf mehreren Computern' wird oft als richtig gelesen"** —
   **diese Antwortoption existiert nicht.** Rest aus einer früheren Fassung.
3. `distraktorErklaerungen[2]`: „‚non-exclusive' bedeutet, dass Exklusivität NICHT gewährt wird;
   das ist also erlaubt." Verworren — gefragt ist, was **nicht erlaubt** ist.
4. `distraktorErklaerungen[3]`: „Das ist durch ‚without written consent' explizit erlaubt." Die
   Klausel erlaubt nichts explizit; sie setzt die Zustimmung als Weg voraus.
→ Vorschlag: `erklaerungLang` neu schreiben, dE[2] und dE[3] neu formulieren.

### A3 · M02-951 — falsche Uhrzeitumrechnung in der Erklärung
`erklaerungLang`: „‚10:00 PM to 2:00 AM' ist nicht exakt vier Stunden (**21:00 bis 02:00 = 5 Stunden**),
sondern etwa vier Stunden in der Formulierung."
10:00 PM ist **22:00**, nicht 21:00 — und 22:00 bis 02:00 sind **exakt vier Stunden**. Der Satz
widerspricht sich außerdem selbst. Die 21:00 stammen aus „by 9:00 PM" (Bestellschluss), einer
ganz anderen Zeitangabe derselben Meldung. **Die Antwortoptionen selbst sind korrekt.**
→ Vorschlag: Satz ersatzlos streichen oder auf „22:00 bis 02:00 = vier Stunden" korrigieren.

### A4 · M02-108 — zwei vertretbare Antworten
Szenario: Der Berater sagt **„Okay, ich notiere mir, dass die Rechner einfrieren"** (Kunde hatte
gesagt: „sie frieren häufig ein") **und** fragt dann nach Häufigkeit und Systemen.
Der erste Halbsatz **ist** Paraphrasieren. `distraktorErklaerungen[0]` behauptet das Gegenteil:
„Der Berater wiederholt nicht in paraphrasierender Form."
→ Zwei Wege: (a) den Paraphrase-Halbsatz aus dem Szenario nehmen, (b) die Frage auf „welche
Technik wendet er mit seiner **Rückfrage** an?" verengen. **Nutzer-Entscheid.**

### A5 · M02-006 — Sensitivitätsaussage ist rechnerisch falsch
`erklaerungLang`: „Sensitivitätsanalyse möglich: würde die Bildqualität auf 50 % gewichtet,
könnte Monitor A gewinnen."
Nachgerechnet: A − B = (7−9)·w_Preis + (8−6)·w_Bild + (6−8)·w_Ergo = 2·(2·w_Bild − 1).
Bei w_Bild = 50 % ist die Differenz **exakt null — immer, egal wie die restlichen 50 % aufgeteilt
werden.** A gewinnt erst **über** 50 %.
→ Vorschlag: „auf 60 % gewichtet" statt „auf 50 %". (Die eigentliche Rechnung der Frage ist
korrekt: A = 7,1 · B = 7,5 ✓.)

### A6 · M02-001 — „Käufermonopol ist kein Standardbegriff" ist falsch, und das Modul widerlegt sich selbst
`distraktorErklaerungen[3]`: „Käufermonopol ist kein Standardbegriff der Marktformenlehre."
Käufermonopol = Nachfragemonopol = **Monopson** ist eine der neun Standard-Marktformen.
**Direkter Widerspruch im eigenen Modul:** M02-306 führt „Monopson" als reguläre Option mit
korrekter Erklärung, und M02-701 (Matrix) baut den ganzen Quadranten „Nachfragemonopol (Monopson)".
→ Vorschlag: dE[3] auf den tatsächlichen Grund umstellen — hier gibt es viele Nachfrager, also
kein Nachfragemonopol.

### A7 · M02-106 — erfundene Datenkategorie als Tatsache
`distraktorErklaerungen[3]`: „**Quartärdaten** sind externe Quellen, nicht interne Ticketing-Daten."
Es gibt keine Quartärdaten; die Erklärung behandelt eine erfundene Kategorie als real. Zugleich
sagt dE[2]: „Tertiärdaten existieren nicht standardmäßig in der Forschungsmethodologie" — die
beiden Erklärungen widersprechen sich in der Haltung.
→ Vorschlag: dE[3] auf „Diese Kategorie gibt es nicht" umstellen; dE[2] entschärfen
(Tertiärquellen sind in der Informationswissenschaft durchaus gebräuchlich).

### A8 · M02-435 — Einstandspreis mit Selbstkosten gleichgesetzt
Letzter Schritt: „**Einstandspreis (Selbstkosten)** berechnen".
Der Einstandspreis (= Bezugspreis) ist das Ende der **Bezugskalkulation**. **Selbstkosten** enthalten
zusätzlich Handlungs-/Verwaltungs- und Vertriebsgemeinkosten — das ist eine Stufe weiter.
Zweitens nennen die `schritte` „2 % bei Zahlung innerhalb von 10 Tagen", die `erklaerungLang`
derselben Frage „2 % bei Zahlung unter 14 Tagen".
→ Vorschlag: „(Selbstkosten)" streichen, Frist vereinheitlichen.

### A9 · M02-301 — Distraktor rechnet gegen sich selbst
Option 0: „5.000 − (5.000 × 0,12) − (5.000 × 0,025) + 150 = **4.825 EUR**".
Der gezeigte Rechenweg ergibt 5.000 − 600 − 125 + 150 = **4.425 EUR**.
Die anderen drei Optionen sind in sich stimmig (165 ✓, 5.135,50 ✓, richtige 4.440 ✓ nachgerechnet).
→ Vorschlag: Ergebnis auf 4.425 EUR korrigieren. Der Fehlertyp (beide Prozente vom Listenpreis)
bleibt damit erhalten.

### A10 · M02-202 — falsches Beispiel für Direktvertrieb
`musterloesung`: „(2) Unternehmenseigene Vertriebsteams, die Geschäftskunden besuchen
(z. B. **Großflächenhandelsketten**)".
Handelsketten sind Zwischenhändler, also gerade **kein** eigenes Vertriebsteam — das Beispiel
belegt den indirekten Vertrieb.
→ Vorschlag: Beispiel ersetzen (etwa „Außendienst eines Herstellers, der Geschäftskunden besucht").

### A11 · M02-101 — Textkorruption in der Musterlösung
„… die Bezugskosten kommen zum Schluss dazu**.t — das ist die korrekte Kaskade.**"
Angebrochener Satz mit Fremdzeichen. Die Rechnung selbst ist korrekt (1.800 → 1.530 → 1.484,10 →
**1.529,10 EUR** ✓), auch die Nebenrechnung 18 % − (15 % × 3 %) ≈ 17,55 % ✓.
→ Vorschlag: Satz glätten.

---

## B · INKONSISTENZEN UND DUBLETTEN

| # | ID(s) | Befund |
|---|---|---|
| B1 | **M02-103 / M02-304** | Nahezu identische Fragen (Nutzwertanalyse, Differenz 0,1 Punkte → Sensitivitätsanalyse). Die Schwellenangabe widerspricht sich: „< 0,5 Punkte Differenz" gegen „< 1 Punkt Differenz". |
| B2 | **M02-014 / M02-312** | Nahezu identische Fragen (Hersteller vertreibt über Systemhäuser) mit **wortgleicher richtiger Antwort**. |
| B3 | **M02-307** | `erklaerungLang` nennt „Ravensbusch Handelskontor GmbH" — die Firma kommt im Fragetext nicht vor. |
| B4 | **M02-314** | Vertriebskette endet mit „Endkunde (z. B. Kaltenborn **IT-Distribution GmbH**)" — eine Distributionsfirma als Beispiel für den Endkunden. |
| B5 | **M02-105 · M02-110 · M02-111** | Thema passt nicht zum Inhalt: Angebotsvergleich unter „Bezugskalkulation & Skonto"; Präsentations-Zielgruppen unter „Bedarfsanalyse & Marktforschung" (`verweis` zeigt auf 2.4); englisches Datenblatt unter „Präsentation & Quellen" (`verweis` auf 2.3). |
| B6 | **M02-311** | Lücke verlangt „15" Minuten, beide Erklärungen sagen „15–20 Minuten". |
| B7 | **M02-005 / M02-018** | „Das Sender-Empfänger-Modell kennt drei Störungsarten: technisch, semantisch, **organisatorisch**." Bei Shannon/Weaver sind es technische, semantische und Effektivitätsprobleme. Nur diese zwei Fragen betroffen. |
| B8 | **M02-009 · M02-112 · M02-310** | „**SAU-Kriterien**" (Seriosität, Aktualität, Urheber) als feststehender Fachbegriff. Kein etablierter IHK-Begriff — in der Prüfung erwartet niemand dieses Kürzel. |
| B9 | **M02-016** | `musterloesung` führt „10.000 EUR Rechnungsbetrag" ein, den die Frage nicht nennt. Gravierender: `schluesselbegriffe.pflicht` verlangt „24,5", während `erklaerungKurz` „ca. 24 %" sagt — wer der eigenen Kurzerklärung folgt und „24" schreibt, wird als falsch bewertet. |
| B10 | **M02-923** | Als einzige Frage des Moduls „Rechnungsbetrag (**brutto**)" ohne jeden USt-Bezug; alle anderen rechnen netto. Die Rechnung ist korrekt, die Bezeichnung fällt aus dem Rahmen. |

---

## C · SPRACHE UND SCHREIBWEISE

**C1 · Umlaut-Ersatzschreibung — 9 Fragen** (Nutzer-Entscheid vom 27.07. gilt auch für Eigennamen):
M02-016 Muehlensiep · M02-105 Poehlmann · M02-115 Rechtsanwaelte · M02-704 Architekturbuero ·
M02-926 Buerotechnik · M02-951 Coelber · M02-953 Amoeneburger · M02-955 Neustaedter ·
M02-956 Schroecker.
⚠️ **Separat davon: M02-952 „Wetteraer Lizenzberatung"** — das ist kein Umlaut, sondern
vermutlich ein Tippfehler für „Wetter**au**er" (Wetterau). Eigener Entscheid.

**C2** M02-017: „Der IT-Berater möchte **herauszufinden**" → „herausfinden".
**C3** M02-006: „**Führe** eine Nutzwertanalyse durch und **benennen** den Gewinner" — du/Sie gemischt
und Verbform falsch. (Einziger Fall dieser Art im ganzen Pool.)
**C4** M02-201, Option 1: „da **das Systemhaus** nur **Intermediäre sind**" — Numerus.
**C5** M02-306 und M02-307: „**spezialfall**" kleingeschrieben.
**C6** M02-314: „**Economische** Unterschiede" → „Ökonomische" · „z. B. **konsignationslager**" klein ·
„Schulung und **Mitarbeitertransfer**" (gemeint ist wohl Wissenstransfer).
**C7** „x" statt „×" und „-" statt „−" in M02-301, M02-302, M02-534, M02-535, M02-760 — teils
**innerhalb einer Frage gemischt** (M02-534: `erklaerungKurz` „x", `erklaerungLang` „×").
**C8** „z.B." ohne Leerzeichen (M02-202, M02-306, M02-314) gegen „z. B." im übrigen Pool.
**C9** „EUR" gegen „€": M02 schreibt fast durchgehend „EUR", nur **M02-770** nutzt „€".
Poolweit 10 Fragen mit „EUR" in den Optionen gegen 3 mit „€"; **M01-008 mischt beides in einer Frage.**
**C10** M02-955: „Das ist **standard** IT-Support-Logik".

---

## D · LÄNGEN-TELL — 22 Treffer

⚠️ **Diese Faktoren sind der Stand VOR den inhaltlichen Korrekturen.** In M01 hat sich gezeigt,
dass jede Textkorrektur die Längen verschiebt und die vorab notierten Faktoren wertlos macht
(M01-201 notiert 4,0 ×, gemessen 3,39 ×). **Vor dem Angleichen neu messen.**

| ID | richtig | längster Distraktor | Faktor | Thema |
|---|---|---|---|---|
| M02-201 | 231 | 85 | **2,72 ×** | Vertriebsformen |
| M02-113 | 152 | 60 | **2,53 ×** | Bezugskalkulation |
| M02-007 | 59 | 33 | 1,79 × | Bezugskalkulation |
| M02-107 | 136 | 81 | 1,68 × | Bedarfsanalyse |
| M02-962 | 183 | 112 | 1,63 × | Englische Fachtexte |
| M02-103 | 96 | 63 | 1,52 × | Nutzwertanalyse |
| M02-952 | 90 | 63 | 1,43 × | Englische Fachtexte |
| M02-116 | 121 | 86 | 1,41 × | Marktformen |
| M02-304 | 106 | 77 | 1,38 × | Nutzwertanalyse |
| M02-732 | 68 | 53 | 1,28 × | Englische Fachtexte |
| M02-307 / M02-312 | 75 | 63 | 1,19 × | Marktformen / Vertriebsformen |
| M02-106 | 63 | 54 | 1,18 × | Bedarfsanalyse |
| M02-105 | 66 | 56 | 1,18 × | Bezugskalkulation |
| M02-958 / M02-960 | 110 / 125 | 95 / 108 | 1,16 × | Englische Fachtexte |
| M02-955 | 77 | 68 | 1,13 × | Englische Fachtexte |
| M02-014 | 75 | 68 | 1,10 × | Vertriebsformen |
| M02-108 | 65 | 60 | 1,08 × | Kommunikationsmodelle |
| M02-302 | 97 | 93 | 1,04 × | Bezugskalkulation |
| M02-009 | 65 | 64 | 1,02 × | Präsentation & Quellen |
| M02-306 | 79 | 78 | 1,01 × | Marktformen |

**6 der 22 liegen in „Englische Fachtexte".** Dort ist Länge ein Sonderfall: Die richtige Antwort
ist oft die vollständige Übersetzung einer englischen Textstelle, die Distraktoren sind kurze
Fehldeutungen. Ein Angleichen ist möglich, verändert aber den Charakter der Aufgabe.
**Entscheid nötig, ob dieser Themenblock mit angeglichen wird.**

---

## E · POOLWEITE KLASSEN (bei den Nachscans aufgefallen, kein M02-Befund)

* **Fehlendes `verweis`-Feld: 70 Fragen poolweit** (M01 3 · M02 10 · M03 20 · M04 14 · M05 3 ·
  M06 10 · M07 10). Es sind praktisch genau die Fragen aus den Etappen 4/5/6 — in M02 der
  vollständige Block **M02-019 … M02-028**. `validate_schema` lässt das Feld zu, aber der Bruch
  ist systematisch. **Entscheid: nachtragen oder bewusst offen lassen.**
* **Verwaiste Firmennamen in Erklärungen: 19 poolweit**, davon 12 in M09 (tabu bis 31.07.).
  In M02 sind es M02-307 und M02-314 (siehe B3/B4). Ein Teil der übrigen dürfte als bewusstes
  Beispiel gemeint sein — vor einer Korrektur einzeln ansehen.
* ⛔ **NICHT ANFASSEN:** Umlaut-Ersatzschreibungen in `schluesselbegriffe` (M05-001
  „Qualitaetsmanagement", M06-113 „Schluessel"). Das sind **absichtlich hinterlegte
  Antwortvarianten** für Lerner, die ohne Umlaute tippen. Ein „Korrekturlauf" würde die
  Freitextbewertung verschlechtern.

---

## F · GEPRÜFT UND SAUBER

**Alle Rechenaufgaben selbst nachgerechnet — bis auf A9 alle korrekt:**
M02-006 (7,1/7,5) · M02-007 (1.814) · M02-016 (24,5 % p. a.) · M02-050 (Fehlerzeile 3, Skonto vom
Zieleinkaufspreis; Sollwerte 1.940 / 2.020 stimmen) · M02-101 (1.529,10) · M02-104 (1,5) ·
M02-113 (36,7 %) · M02-118 (3,2 / 7,4) · M02-301 (4.440) · M02-302 (18,4 %) ·
M02-535 **inklusive beider Varianten** (7,15/7,60 · 7,20/7,80 · 6,90/7,40) · M02-770 (932) ·
M02-921 (7,1) · M02-922 (1.750) · M02-923 (4.850) · M02-924 (7,55) · M02-925 (7,00/8,40) ·
M02-926 (3.648,00 gegen 3.673,85 — Differenz 25,85 ✓) · M02-940 (4.000) · M02-941 (1.746) ·
M02-942 (5.950) · M02-943 (38) · M02-944 (7,45). Auch die Formeln der vier `rechenassistent`-Fragen
(M02-534, M02-540, M02-760) sind korrekt aufgebaut.

**Beide Matrix-Fragen Quadrant für Quadrant nachgeprüft:**
M02-701 (Marktformen) — 1 Anbieter/4.000 Nachfrager → Angebotsmonopol ✓, 40 Zulieferer/1 Abnehmer →
Nachfragemonopol ✓, 900/Millionen → Polypol ✓, 1/1 → bilaterales Monopol ✓. Jedes Element trägt
eine konkrete Zahl, wie `test_matrix` es verlangt.
M02-702 (Johari-Fenster) — Arena, blinder Fleck, Fassade, Unbekanntes ✓ alle vier korrekt zugeordnet.

**Bildfrage M02-117 selbst vermessen:** Die Polylinie läuft von (80, 280) nach (710, 105); die
Achse steht bei y = 330, y wächst nach unten. Die Kurve **steigt** also tatsächlich monoton
(280 → 260 → 230 → 200 → 180 → 160 → 140 → 120 → 110 → 105). „Verkäufermarkt, Preise steigen"
ist richtig, die Distraktorerklärung „die Kurve steigt kontinuierlich" trifft zu.

**Ohne jeden Befund — der Qualitätssprung ist wie in M01 deutlich sichtbar:**
* **M02-019 … M02-028** (Etappe-4-Block): keine Tells, Distraktoren auf gleichem Niveau,
  tragfähige Distraktorerklärungen. Einziger Mangel: das fehlende `verweis`-Feld (Abschnitt E).
* **M02-958 … M02-963** (neuerer Englisch-Block): durchweg sauber gebaut, mit ausführlichen,
  korrekten Erklärungen. Der Kontrast zum Altbestand M02-950 … M02-956 (A2, A3) ist auffällig.
* M02-020, -022, -023, -024, -025, -026, -027, -028, -102, -110, -309, -313, -401, -461, -462,
  -703, -704, -731, -733, -734, -735, -750, -771, -950, -954, -957, -959, -961.

**Alle acht schweren Befunde und beide Dubletten liegen im Altbestand M02-001 … M02-314 sowie im
Englisch-Block M02-950 … M02-956.** Nichts davon in den Fragen der Etappen 4 bis 6.

---

## G · KORREKTURLAUF AM 27.07.2026 — ERLEDIGT

**Nutzer-Entscheide vor dem Lauf:** alle elf schweren Befunde wie vorgeschlagen · M02-108 nach
**Weg (a)** (der Paraphrase-Halbsatz fällt aus dem Szenario) · B1, B2, B3, B4, B5, B6 · B7 und B8
entschärfen · C1–C10 komplett · `verweis` in M02-019 … M02-028 nachtragen · **alle 22 Längen-Tells**
angleichen, einschließlich des Englisch-Blocks.

### Umgesetzt

| Block | Umfang |
|---|---|
| Schwere Befunde | **11 Korrekturen** (A1–A11), davon vier Erklärungen vollständig neu geschrieben (M02-952, M02-951, M02-435, M02-304) |
| Dubletten | **M02-304 und M02-312 inhaltlich neu gebaut** — Frage, alle vier Optionen, Distraktorerklärungen und Erklärungen. M02-304 fragt jetzt nach der **Bewertung** eines Sensitivitätsergebnisses statt nach der Maßnahme; M02-312 fragt nach dem **Nachteil** des indirekten Vertriebs statt nach dem Vorteil. Beide Dublettenpaare sind damit aufgelöst. |
| Themenzuordnung | **3 Fragen umgehängt**, jeweils mit `gebiet` und `verweis`: M02-105 → Nutzwertanalyse [A1], M02-110 → Präsentation & Quellen [A4], M02-111 → Englische Fachtexte [A1] |
| Sprache | 9 Umlaut-Eigennamen · „Wetteraer" → „Wetterauer" · Grammatik (M02-006, -017, -201) · „spezialfall" → Sonderfall · „Economische" → Ökonomische · „konsignationslager" → Konsignationslager · „Mitarbeitertransfer" → Wissenstransfer · **9× „z.B." → „z. B."** · ×/− statt x/- in fünf Rechenfragen · M02-770 von „€" auf „EUR" (26 Stellen) |
| Felder | `verweis` in **10 Fragen** ergänzt (M02-019 … M02-028), passend zum jeweiligen Thema |
| Längen-Tell | **65 Optionen** in 21 Fragen verlängert |

### Der Längen-Tell — M02 ist vollständig entschärft

✅✅ **TELL-ZÄHLER POOLWEIT 102 → 80 (35,8 % → 28,1 % von 285).** Nenner unverändert 285.
**M02 stellt keinen einzigen Treffer mehr** (vorher 22).

⚠️ **DIE FAKTOREN AUS ABSCHNITT D WAREN NACH DEM INHALTSLAUF ÜBERHOLT** — genau wie bei M01
vorhergesagt. Aus 22 Treffern waren 21 geworden: **M02-312 hatte sich durch den inhaltlichen
Neubau von selbst erledigt**, und die Faktoren von M02-201 (2,72 → 2,69), M02-304 (1,38 → 1,00)
und M02-306 (1,01 → 1,00) hatten sich verschoben. **Erst messen, dann angleichen — die Reihenfolge
Inhalt vor Längen war richtig.**

Angeglichen wurde nach demselben Maß wie in M01: **nur Distraktoren verlängert, keine richtige
Antwort gekürzt**, längster Distraktor bei **1,01–1,15 ×** der richtigen Antwort, kürzester nicht
unter **0,57 ×**. Drei Sonderfälle:
* **M02-007** (Rechenterme): Alle vier Optionen auf dieselbe dreiteilige Schreibweise gebracht
  („2.000 EUR − 10 % Rabatt = 1.800 EUR, davon − 2 % Skonto = …"). Anders als bei M01-117 war das
  hier möglich, ohne den Fehlertyp der Distraktoren zu verraten.
* **M02-113**: Die richtige Antwort nannte „ca. 37 %", die Erklärung 36,7 % — beim Angleichen
  mitkorrigiert auf **rund 36,7 % p. a.**
* **M02-304 und M02-306** standen auf **exakt 1,00 ×**. Der Wächter zählt Gleichstand als Treffer
  (`len[i] === max`); ein Distraktor muss **strikt** länger sein.

### Prüflauf (alles selbst gefahren)

* `build_fragen.py` → **1073 Fragen**, 9 Fälle — Pool-Größe unverändert ✓
* **Drift 0** (zweiter Build byte-identisch) ✓
* `validate_pool` (74 kanonische Themen) · `idcheck` · `validate_schema` (1077 Objekte) ·
  `fakten_check.py` (0 Verdachtsfälle) ✓
* **Wächter nach der Themen-Umhängung — vorher gerechnet, danach gemessen, beide Male gleich:**
  Gebiet **A4 44 = 4,95 %** (Schwelle 4,8) — M02-110 kommt hinein, M02-111 geht heraus, die Basis
  bleibt 888. **Stufenlücken 0.** Feinthemen weiterhin **74**.
* Suiten gegen `sollwerte.env`, alle grün: logik 2158 · rechner 123 · themenauswahl 81 · diagnose 76 ·
  gantt 73 · engine 70 · rechnen 64 · unterricht 64 · note 55 · adaptiv 49 · stufen 46 · freitext 38 ·
  didaktik 32 · wirtschaft 32 · matrix 31 · glossar 24 · render_smoke 21 · abk 20 · teilpunkte 19

### ⚠️ Beim Diff-Lesen gefunden — zwei Nachbesserungen

1. **Das Malzeichen war nur halb ersetzt.** Die Regel „Ziffer x Ziffer" traf `5.000 x 0,88`, aber
   nicht `Listenpreis x (1 − Rabatt)` und nicht `; x {1-skonto/100|2}`. Ergebnis waren Strings mit
   **× und x nebeneinander** — schlimmer als der Ausgangszustand. In M02-301, M02-534, M02-535,
   M02-540 und M02-760 einzeln nachgezogen.
   ⚠️ **Das Minus INNERHALB von `{…}` ist Formelsyntax des Rechenassistenten** (`{1-rabatt/100|2}`,
   `{liste-s2|2}`) und wurde bewusst nicht angefasst. `test_rechner` (123) bestätigt das.
2. Ein scheinbar zerschossenes `→` in M02-304 stellte sich als **Anzeigeartefakt der Diff-Pipe**
   heraus — die Datei war intakt. Ein poolweiter Scan auf Ersatzzeichen (`�`) ergab 0 Treffer.
   **Vor dem „Korrigieren" eines Zeichenfehlers erst die Datei selbst prüfen, nicht die Anzeige.**

### Nicht angefasst (bewusst)

* **B10** (M02-923 „Rechnungsbetrag (brutto)"): Die Rechnung ist korrekt, Skonto vom Bruttobetrag
  ist kaufmännische Praxis. Nur die Bezeichnung fällt im Modul aus dem Rahmen — kein Fehler.
* Die übrigen **60 Fragen ohne `verweis`** außerhalb von M02 (M03, M04, M06, M07). Gehören in die
  jeweiligen Modul-Durchgänge.
* Die **17 verwaisten Firmennamen** außerhalb von M02, davon 12 in M09 (tabu bis 31.07.).
* ⛔ Umlaut-Ersatzschreibungen in `schluesselbegriffe` (M05-001, M06-113). Das sind **absichtlich
  hinterlegte Antwortvarianten** für Lerner, die ohne Umlaute tippen.

### Kein Bump, kein Release
`APP_VERSION`, `sw.js` und `CHANGELOG` sind unberührt — der Bump gehört ans Ende von Etappe 3,
wenn auch M03, M07 und M08 durch sind.
