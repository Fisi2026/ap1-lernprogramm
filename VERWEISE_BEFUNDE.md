# POOLWEITER `verweis`-GRIFF – BEFUNDE (28.07.2026)

**Stand: ✅ ERLEDIGT (28.07.2026).** Freigabe erteilt für Gruppe A (31) und Gruppe B nach
Option 1 (6). **37 von 37 korrigiert, nachgemessen: 0 harte Fehler übrig.** Details in Abschnitt 7.

---

## 0. WAS GEMESSEN WURDE – UND WAS NICHT

Geprüft wurde: **nennt das `verweis`-Feld einen Abschnitt, den es in der Modul-Doku gibt?**
Grundlage sind die Kapitelüberschriften aus `01_…md` bis `07_…md`.

⚠️ **NICHT gemessen ist die zweite Fehlerklasse: „Abschnitt existiert, ist aber der falsche."**
Die findet nur, wer jede Frage gegen ihren Abschnitt liest. **Der M07-Bericht nannte 50 falsche
Verweise in M07 – meine Messung findet dort nur 2.** Die Differenz sind genau diese inhaltlichen
Fehlzuordnungen. **Die 37 unten sind also eine Untergrenze, keine Gesamtzahl.**

⚠️ **M08 und M09 sind außen vor.** Für sie gibt es keine Modul-Doku; ihre Verweise zeigen auf
Gesetzesstellen (`BBiG § 20, WiSo-Grundlagen: Probezeit`) bzw. auf `Klausurvorbereitung – …`.
Das ist eine eigene Systematik und kein Fehler.

⚠️ **Zwei Fehlalarme im ersten Durchgang entkräftet:** Mein Regex las Versionsnummern als
Abschnitte – `WCAG 2.1`, `BITV 2.0`, `TLS 1.3` in M03-611 und M06-304. **Beide Verweise sind in
Ordnung.** Deshalb ist unten „Abschnitt" als Wort der Anker, nicht die bloße Zahl.

---

## 1. ZAHLEN

| Modul | Fragen | **hart falsch** | weich (kein Abschnitt) | ganz ohne `verweis` |
|---|---|---|---|---|
| M01 | 111 | **16** | 16 | 4 |
| M02 | 110 | **2** | 28 | 1 |
| M03 | 194 | **13** | 41 | 2 |
| M04 | 193 | **1** | 8 | 16 |
| M05 | 68 | **1** | 9 | 4 |
| M06 | 112 | **2** | 25 | 11 |
| M07 | 134 | **2** | 7 | 11 |
| **Summe** | **922** | **37** | **134** | **49** |

**M01 ist der Schwerpunkt: 16 von 111.** Das Modul hat nur die Abschnitte 1.1, 1.2 und 1.3 –
verwiesen wird auf 1.4 bis 1.8 und sogar auf 4.2.

---

## 2. GRUPPE A – ZIEL BELEGT, KORREKTUR EINDEUTIG (31 Fragen)

Das richtige Ziel wurde durch Volltextsuche in der Modul-Doku bestimmt, nicht geraten.
In Klammern die Trefferzahl, die die Zuordnung stützt.

### M01 (14) – Doku hat nur 1.1, 1.2, 1.3
| Fragen | steht falsch auf | richtig | Beleg |
|---|---|---|---|
| M01-050, M01-054, M01-433, M01-960 | 1.4 | **1.1** | „Netzplan" 5×, „Gantt" 3× in 1.1 |
| M01-970, M01-990, M01-991, M01-992 | **4.2** | **1.1** | dito – 4.2 ist ein fremdes Modul |
| M01-021, M01-022 | 1.4 | **1.2** | „Stakeholder" 4×, „Risikoanalyse" 1× in 1.2 |
| M01-051 | 1.6 | **1.2** | dito |
| M01-539 | 1.4 | **1.2** | „Machbarkeit" 9× in 1.2 – Kapiteltitel nennt es |
| M01-053, M01-432 | 1.8 / 1.5 | **1.3** | „Eskalation" 8×, „Ticket" 25×, „Support-Level" in 1.3 |

### M02 (2)
| Fragen | falsch | richtig | Beleg |
|---|---|---|---|
| M02-943, M02-944 | 2.6 | **2.5** | „Nutzwertanalyse" 7× in 2.5 |

### M03 (11) – Doku hat nur 3.1 bis 3.4
| Fragen | falsch | richtig | Beleg |
|---|---|---|---|
| M03-051, M03-053, M03-750 | 3.5 / 3.6 | **3.2** | „OSI" in 3.2; M03-001 verweist bereits korrekt so |
| M03-052 | 3.6 | **3.1** | „VLAN" in 3.1 |
| M03-055 | 3.8 | **3.4** | „TCO" 2× in 3.4 – Kapitel „Wirtschaftlichkeit" |
| M03-942, M03-943, M03-944 | 3.5 | **3.3** | „kWh" 5× in 3.3 – Kapitel „Energieeffizienz" |
| M03-975, M03-976 | **2.1** | **3.1** | Hardware – 2.1 ist ein fremdes Modul |
| M03-746 | 3.6 | **3.1** | Arbeitsplatz-Ausstattung, „Ergonomie" in 3.1 |

### M04, M05, M06, M07 (4)
| Frage | falsch | richtig | Beleg |
|---|---|---|---|
| M04-996 | **1.3** | **4.7** | Kapiteltitel „Programmierwerkzeuge und UML" |
| M05-501 | 5.3 | **5.2** | „Testprotokoll" 11× in 5.2 (Doku hat nur 5.1, 5.2) |
| M06-052 | 6.7 | **6.4** | „Backup" 14×, „Datensicherung" in 6.4 |
| M07-041 | 7.8 | **7.5** | „Widerstand" in 7.5 „Veränderungsprozesse begleiten" |

---

## 3. GRUPPE B – DAS MODUL DECKT DAS THEMA NICHT AB (6 Fragen) → **ENTSCHEID NÖTIG**

Hier ist der Verweis nicht nur falsch nummeriert – **es gibt in der ganzen Modul-Doku keine
Stelle, auf die er zeigen könnte.** Die Volltextsuche findet das Thema nirgends.

| Fragen | steht auf | Thema | in der Doku |
|---|---|---|---|
| M01-025, M01-026 | 1.7 | Störungsmanagement, KI-Unterstützung | **„Störungsmanagement" kommt nicht vor** |
| M03-056 | 3.6 | Strukturierte Verkabelung, Längenbegrenzung | **„Verkabelung" kommt nicht vor** |
| M03-747 | 3.6 | Serverraum-Ausstattung | **„Serverraum" kommt nicht vor** |
| M06-053 | 6.6 | Datenschutzvorfall, Meldepflicht Art. 33/34 DSGVO | **weder „Meldepflicht" noch „Art. 33"** |
| M07-042 | 7.8 | Maßnahmen bei der Systemeinführung | **„Systemeinführung"/„Einweisung" kommen nicht vor** |

⚠️ **Das ist derselbe Befund wie A3 aus dem M07-Lauf** („für Einweisung & Schulung hält das Modul
keinen Fundort vor", 15 Fragen). **Er ist nicht auf M07 beschränkt** – M01, M03 und M06 haben ihn
auch. Die Fragen sind fachlich richtig; **die Lernunterlage hinkt dem Fragenpool hinterher.**

### **ENTSCHEID E1 – wie sollen diese Verweise lauten?**
1. **Auf den thematisch nächsten vorhandenen Abschnitt** (M01-025/026 → 1.3 Störungen/Tickets,
   M03-056 → 3.1, M03-747 → 3.2, M06-053 → 6.1, M07-042 → 7.5). *Ehrlich genug, aber der
   Lernende findet dort nicht genau das Gefragte.*
2. **Auf den IHK-Katalog ausweichen**, wie es 134 Fragen schon tun
   (`IHK-Katalog FK…`). *Kein falscher Zeiger, aber auch kein Fundort in der eigenen Unterlage.*
3. **`verweis` leeren.** *Sauber, aber die Frage verliert ihren Beleg.*
4. **Die Modul-Doku ergänzen.** *Der eigentlich richtige Weg – aber ein eigener, großer Griff,
   und keine Pool-Arbeit.*

**Mein Vorschlag: (1) jetzt, (4) als eigener Posten vormerken.** Ein Verweis, der ins richtige
Kapitel führt, nützt mehr als gar keiner – und Option 4 ist die einzige, die den Mangel wirklich
behebt, aber sie gehört nicht in einen Pool-Lauf.

---

## 4. GRUPPE C – NICHT GEMESSEN, ABER VERMUTLICH DER GRÖSSERE POSTEN

**134 Fragen nennen keinen Abschnitt**, sondern nur ein Thema (`Modul 03 – Hardware-Komponenten
(Mainboard)`) oder den IHK-Katalog (`IHK-Katalog FK02 – Englische Fachtexte`, 22×).
**Das ist kein Fehler**, aber es ist auch kein Fundort: Der Lernende weiß nicht, wo er nachschlagen
soll. Bei den 22 FK02-Fragen ist das systematisch – für englische Fachtexte gibt es keine Doku.

**49 Fragen haben gar keinen `verweis`** – Schwerpunkt M04 (16) und M06 (11).

### **ENTSCHEID E2 – sollen diese beiden Gruppen in denselben Griff?**
Das wären statt 37 dann **220 Fragen**. Ich rate davon ab, beides zu vermischen: Gruppe A/B ist
Fehlerkorrektur mit belegbarem Ziel, Gruppe C ist inhaltliche Ergänzung mit Ermessen.
**Vorschlag: A und B jetzt, C als eigener Griff.**

---

## 5. WAS DAS NICHT FINDET – DIE ZWEITE FEHLERKLASSE

Nochmal, weil es der wichtigste Vorbehalt ist: **Ein Verweis auf „Abschnitt 3.2" gilt in dieser
Messung als richtig, sobald 3.2 existiert – auch wenn die Frage inhaltlich zu 3.4 gehört.**
Der M07-Lauf fand 50 solcher Fälle in 133 Fragen, also **rund 38 %**. Hochgerechnet auf die
922 Fragen aus M01–M07 wären das mehrere hundert. **Diese Hochrechnung ist eine Schätzung aus
einem einzigen Modul – sie kann deutlich danebenliegen.**

### **ENTSCHEID E3 – wird die zweite Klasse angefasst?**
Das hieße: jede der 922 Fragen gegen ihren verwiesenen Abschnitt lesen. Das ist ein Aufwand in
der Größenordnung eines kompletten Etappe-3-Modullaufs, eher mehr. **Nicht in diesem Griff.**
Wenn ja, dann modulweise mit eigener Freigabe.

---

## 6. VORSCHLAG FÜR DEN ABLAUF

1. **Freigabe für Gruppe A** (31 Fragen, Ziel belegt) – reine Zahlenkorrektur im `verweis`-Feld.
2. **Entscheid E1** für Gruppe B (6 Fragen).
3. Korrekturlauf über `pool/*.json`, **Rohtext-Ersatz, kein `json.load`/`json.dump`**
   (formatiert sonst alle 20 Pool-Dateien um), `json.loads` als Syntaxprobe vor dem Schreiben.
4. `python3 build_fragen.py` → Drift 0 → `validate_pool`/`schema`/`idcheck` → Suiten → Diff lesen.
5. **Kein Version-Bump**, kein Tag.

⚠️ **Nach dem Lauf: den freigegebenen Umfang gegen das Korrekturskript abhaken.** Genau das ist
am 28.07. bei Befund A1 aus M07 unterblieben – er stand im Umfang und wurde nie ausgeführt.

---

## 7. KORREKTURLAUF-ERGEBNIS (28.07.2026)

**Freigabe:** Gruppe A vollständig, Gruppe B nach **Option 1** (nächster vorhandener Abschnitt).

**37 von 37 geändert.** Werkzeug: `/tmp/fixverweis.py` – Rohtext-Ersatz je Frageblock, **kein
`json.load`/`json.dump`** (formatiert sonst alle Pool-Dateien um), `json.loads` als Syntaxprobe
vor dem Schreiben. Ersetzt wurde **nur die Abschnittsnummer**, der Rest des Verweises blieb
unangetastet. Das Skript bricht ab, wenn die erwartete Nummer nicht oder mehrfach im Feld steht.

**Berührte Dateien:** `pool_m01.json`, `pool_m02.json`, `pool_m03.json`, `pool_m04.json`,
`pool_m05.json`, `pool_m06.json`, `pool_m07.json`, `pool_m_l4.json`, `pool_m_ausbau.json`.
⚠️ **Drei der Fragen lagen nicht in der gleichnamigen Datei** (M01-990/991/992 in `pool_m_l4.json`,
M03-746/747/750 in `pool_m_ausbau.json`) – die Bearbeitung über das `modul`-Feld statt über
Dateinamen war also richtig.

### VERIFIKATION (selbst gefahren)
* **Nachmessung: 37 harte Fehler vorher → 0 nachher.**
* **Abhaken einzeln: 37 von 37 IDs stehen auf dem freigegebenen Sollwert, 0 Abweichungen.**
  (Das ist die Lehre aus Befund A1 – der Umfang wird jetzt gegen das Ergebnis geprüft, nicht
  gegen die Absicht.)
* `build_fragen.py` → **1073 Fragen**, `git diff --stat fragen.js` → **37 Zeilen geändert**,
  also genau eine je Korrektur. **Drift 0.**
* `validate_pool` OK · `validate_schema` OK · `idcheck` OK
* Suiten `test_meta`, `test_didaktik`, `test_logik`, `test_registry` grün.
* **Diff-Kontrolle: 0 geänderte Zeilen außerhalb von `verweis`-Feldern.**
* Weiche Gruppe unverändert **134**, leere Gruppe unverändert **49** – wie freigegeben nicht
  angefasst.

⚠️ **EIN MESS-FEHLALARM UNTERWEGS ENTKRÄFTET:** Eine Zwischenmessung meldete die weiche Gruppe
mit 109 statt 134 – als wäre dort etwas verändert worden. Ursache war ein anderes Kriterium
(„Wort *Abschnitt* fehlt ganz" statt „kein *Abschnitt X.Y*-Muster"). Die Differenz sind 25 Fragen,
die einen benannten statt einen nummerierten Abschnitt angeben (`Modul 01, Abschnitt
Risikomanagement – Risikomatrix`). **Kein Eingriff, nur zwei Messlatten.**

### WAS OFFEN BLEIBT
1. **Die zweite Fehlerklasse** („Abschnitt existiert, ist aber der falsche") – ungemessen.
   Aus M07 hochgerechnet potenziell mehrere hundert Fragen. **Entscheid E3, nicht getroffen.**
2. **134 weiche + 49 leere Verweise** – **Entscheid E2, als eigener Griff zurückgestellt.**
3. **Die Doku-Lücke aus Gruppe B:** Störungsmanagement (M01), Verkabelung und Serverraum (M03),
   Meldepflicht Art. 33/34 DSGVO (M06), Systemeinführung/Einweisung (M07) **fehlen in der
   Lernunterlage.** Die Verweise zeigen jetzt auf den nächstliegenden Abschnitt – **der Mangel
   selbst ist damit nicht behoben, nur überbrückt.** Eigener Griff an den `0X_*.md`-Dateien.
