# BEFUNDE LERNFLUSS – Etappe VII (Qualitätsrunde Q2)

**Gemessen:** 31.08.2026. **Werkzeug:** `tools/probe_lernfluss.js` (neu).
**Verfahren:** `PLAENE.md`, „GESAMTPLAN QUALITÄTSRUNDE Q2", Etappe VII.
⛔⛔ **NUR GEMESSEN. Keine Änderung an der Ziehungslogik** – Nutzer-Entscheid 10 vom 27.08.:
„nichts ändern ohne Entscheid". An den Sperren hängen 38 Tests.

**Anlass:** Die Wächter messen die Zusammensetzung des **Pools**. Was aus 50 gezogenen Fragen
tatsächlich wird, hatte nie jemand gemessen.

---

## DAS WERKZEUG

`node tools/probe_lernfluss.js <arbeitskopie> [sitzungen] [fragen] [--antworten <quote>]`

* **Es würfelt nicht.** `Math.random` wird je Sitzung durch einen geseedeten PRNG ersetzt
  (mulberry32, Seed = Sitzungsnummer). Derselbe Aufruf liefert dieselben Zahlen — sonst gäbe es
  kein Vorher/Nachher. (Lehre: „Eine Prüfung, die würfelt, ist keine Prüfung.")
* **Es misst die echte Funktion, keinen Nachbau.** Gezogen wird über `w.naechsteFrage()` aus
  `app_seiten.js` — mit Themen-Serie, Fehler-Deck- und Generator-Einstreuung,
  `kandidatenMitTypWechsel`, `deckPick` und `gewichteFrage`.
* **Es schreibt nichts** ins Projekt und ändert kein Produktverhalten.
* `--antworten q` beantwortet jede Frage mit Trefferquote q, damit sich `S.themaLevel` bewegt.

⚠️⚠️ **ZWEIMAL HATTE ICH DEN FALSCHEN NENNER — BEIDE MALE SELBST GEFUNDEN, BEVOR ES EIN BEFUND
WURDE.** Das gehört ins Protokoll, weil es die Messung erst belastbar gemacht hat:

| Versuch | Nenner | Ergebnis | Warum falsch |
|---|---|---|---|
| 1 | der **ganze Pool** (1062) | M03 schien **+17,9 Punkte** überrepräsentiert | Gezogen wird nur aus `kandidaten()`, und die filtert über `aufStufeFiltern` auf die aktuelle Stufe — im Startzustand **169 von 1062** |
| 2 | Kandidaten **im Endzustand** | M08 schien **−6,3 Punkte** | Die Kandidatenmenge **wächst während der Sitzung** mit der Stufe (164 → 240). Der Nenner passte nicht zum Zähler |
| 3 ✅ | **Erwartungswert je Ziehung** | s. u. | Vor **jeder** Ziehung wird die Modulverteilung der aktuellen Kandidaten erfasst und gemittelt |

►► **Die Lehre des Projekts hat hier zweimal gegriffen: vor jeder Meldung die auswertende
Funktion lesen.** Ein Messwerkzeug ist am ersten Tag noch nicht kalibriert.

---

## DIE MESSUNG — 20 Sitzungen à 50 Fragen, Trefferquote 70 %

### 1. Themenverteilung — **unauffällig, sogar gut**

| | Wert |
|---|---|
| verschiedene Themen je Sitzung | **29,4** (Spanne 24–33) |
| größtes Thema | 4,5 Fragen (Spanne 3–6) |
| halbe Sitzung stammt aus | 8,4 Themen |

**Kein Thema dominiert.** Bei 50 Fragen aus knapp 30 Themen sieht der Lerner breit gestreut.

### 2. Derselbe Fragetyp hintereinander — **0 von 980 Übergängen**

`kandidatenMitTypWechsel()` arbeitet **lückenlos**: in 1000 Ziehungen kam **kein einziges Mal**
derselbe Typ zweimal hintereinander, längste Serie 1. ✅

### 3. Stufenlogik — **sie funktioniert und ist an die Leistung gekoppelt**

| simulierte Trefferquote | mittlere Stufe erste 10 | letzte 10 | Differenz | Anteil Stufe 3 |
|---|---|---|---|---|
| ohne Antworten | 1,00 | 1,00 | ±0 | 0 % |
| 55 % | 1,06 | 1,23 | **+0,17** | 0,4 % |
| 70 % | 1,05 | — | — | 1,2 % |
| 85 % | 1,05 | 1,39 | **+0,34** | 1,1 % |

**Der bessere Lerner steigt doppelt so schnell.** Genau das war die Frage der Etappe — die Antwort
ist ja. ⚠️ **Ohne Antworten bewegt sich nichts** (Stufe 1 zu 100 %): die Stufe hängt an
`S.themaLevel`, nicht an der Zahl der gezogenen Fragen.

### 4. Wiedersehen einer Frage — **0 in 1000 Ziehungen**

Innerhalb einer Sitzung kommt **keine Frage doppelt**. `deckPick` über `S.seen` zieht
ausschließlich aus noch nicht Gesehenem. ✅

### 5. Woher die Frage kam

| Herkunft | Anteil | Sollwert |
|---|---|---|
| Deck (normale Ziehung) | 74,0 % | — |
| **Generator** (frisch erzeugte Rechenaufgabe) | **26,0 %** | 1 von 4 = 25 % ✅ |
| Fehler-Deck (Wiedervorlage) | **0,0 %** | 1 von 5 — **greift nie in derselben Sitzung** |
| Themen-Serie | 0,0 % | nur nach falscher Antwort mit Nutzer-Zustimmung |

⚠️ **Dass das Fehler-Deck nie greift, ist ABSICHT und dokumentiert.** `L.fdOnWrong` setzt
`due = jetzt + 1 Tag`; `tests/test_logik.js` hält das mit „FD: nicht sofort fällig" fest, und der
Kommentar in `logik.js` begründet es (Spaced Repetition über Monate). **Kein Befund** — aber der
Messwert erklärt, warum die Einstreuung „1 von 5" im Erlebnis des Lerners nicht vorkommt: sie
wirkt erst am Folgetag. Am Ende der Sitzung lagen **11 Karten** im Fehler-Deck, **0 davon fällig**.

---

## L1 — M08 WIRD HALB SO OFT GEZOGEN WIE ERWARTET — URSACHE BELEGT, KEIN FEHLER

| Modul | gezogen | erwartet | Abweichung |
|---|---|---|---|
| M01 | 16,4 % | 13,3 % | +3,1 |
| M02 | 6,4 % | 7,8 % | −1,4 |
| M03 | 21,1 % | 17,8 % | +3,3 |
| M04 | 7,2 % | 9,7 % | −2,5 |
| M05 | 9,2 % | 8,5 % | +0,7 |
| M06 | 13,5 % | 11,1 % | +2,4 |
| M07 | 19,2 % | 17,3 % | +1,9 |
| **M08** | **7,2 %** | **14,6 %** | **−7,4** |

**Alle anderen Module liegen zwischen −2,5 und +3,3 Punkten. M08 fällt aus dem Rahmen** — es
stellt knapp 15 % der Kandidaten und bekommt gut 7 % der Ziehungen.

**AUFGEKLÄRT AM SELBEN TAG — ES IST KEIN FEHLER, SONDERN EINE ENTSCHEIDUNG.**

`tools/probe_lernfluss.js --gewichte` umhüllt `L.gewichteFrage` und protokolliert je Aufruf,
welcher Faktor gegriffen hat (der Rückgabewert bleibt der der Originalfunktion — reine Messung):

| Modul | Aufrufe | **mittleres Gewicht** | Interleaving-Malus | Adaptiv aktiv |
|---|---|---|---|---|
| M01 | 16.405 | 2,450 | 3,0 % | 0,5 % |
| M02 | 9.601 | 1,984 | 1,8 % | 0,0 % |
| M03 | 22.330 | 2,707 | 6,7 % | 3,0 % |
| M04 | 12.253 | 2,229 | 4,8 % | 2,7 % |
| M05 | 10.685 | 2,333 | 4,7 % | 1,5 % |
| M06 | 13.497 | 2,460 | 3,1 % | 0,6 % |
| M07 | 21.818 | 2,234 | 4,7 % | 2,4 % |
| **M08** | 19.469 | **0,993** | **1,0 %** | 0,1 % |

**M08 läuft mit dem halben Gewicht — und es liegt weder am Interleaving (dort greift es am
seltensten) noch am Adaptiv-Gate (0,1 %).** Es liegt an der Basis.

**Die Quelle:** `L.THEMA_RELEVANZ` in `logik.js:108` — **80 Einträge**, Skala
„**3 = Dauerbrenner, 2 = regelmäßig, 1 = selten/AP2-nah**", unbekannte Themen → 2.
**Alle ZWÖLF M08-Themen stehen auf 1** — Rechtsformen, Kaufmannseigenschaft, Tarifrecht,
Kündigung, Mitbestimmung, BBiG, Arbeitsschutz, Firma & Handelsregister, Führung,
Aufgabenanalyse, Rechte & Pflichten, Vertragsanbahnung. Kein einziges auf 2 oder 3.
Die mittlere Relevanz der anderen Module liegt zwischen 2,19 (M02) und 2,84 (M03).

►► **Damit ist L1 erklärt und geschlossen: Die −7,4 Punkte sind die exakte Folge einer bewusst
gesetzten Gewichtung.** Gewicht 1 gegen rund 2,4 im Rest — also etwa halb so oft gezogen. Das
Verhalten ist korrekt; die Ziehung tut genau das, was in der Tabelle steht.

⛔⛔ **NACHTRAG 02.09.2026 — HIER STAND EINE UNGEPRÜFTE BEHAUPTUNG VON MIR.** Der Satz lautete:
„In der AP1 zählt B3 mit eigenem Anteil, und der Pool führt 103 M08-Fragen." **Der erste Halbsatz
ist falsch**, und er war das einzige Argument, das für eine Höherstufung sprach. Gemessen am
02.09.:

| Messung | Wert |
|---|---|
| `pruefungsteil` der M08-Fragen | **103 von 103 = AP2**, keine einzige AP1 |
| B3 „Wirtschafts- und Sozialkunde" laut Prüfungskatalog FISI 2024, Raster S. 6 | **AP2**, § 4 Abs. 7, 60 Minuten, **10 % Gewichtung an der Gesamtprüfung** |
| Legende in `logik.js` | „1 = selten/**AP2-nah**" |
| Übungs-Default `S.uebenAP` | `"beide"` (Nutzer-Entscheid 23.07.) — AP2 ist bewusst beigemischt, gedämpft |
| `THEMA_RELEVANZ` in der App | 80 Einträge, **jedes Pool-Thema gelistet**, keines auf dem Default, kein verwaister Eintrag |

**Alle vier Einstellungen stimmen überein.** M08 ist das einzige Modul ohne ein Thema über 1 — und
das ist konsistent, weil es als einziges vollständig AP2 ist. **Die Stufung 1 ist nicht nur
bewusst gesetzt, sie ist belegt richtig.** Der Punkt ist am 02.09. geschlossen.

►► **Die Lehre ist dieselbe wie bei „Modul 07 hält keinen Fundort vor" und bei B106:** ein Satz,
den ich selbst notiere, ist damit nicht geprüft. Er hat hier vier Wochen als offener Nutzer-Punkt
gestanden — und die Prüfung, die ihn erledigt hat, hat zwanzig Minuten gedauert.

⛔⛔ **UND EIN DRITTER MESSFEHLER MEINERSEITS, DER GENAU HIER SASS.** Ich hatte die
Relevanzgewichtung zuvor als Ursache **ausgeschlossen** mit der Begründung „`THEMA_RELEVANZ` ist
leer (0 Einträge)". Das war falsch: Ich hatte sie über `require("./logik.js")` **außerhalb der
laufenden App** gemessen, wo sie nicht befüllt ist. In der App hat sie **80 Einträge**.
►► **Wer die App misst, misst IN der App.** Alle drei Fehlmessungen dieses Tages hatten dieselbe
Wurzel: ein Nachbau oder eine Abkürzung statt der laufenden Umgebung.

## L2 — DER LERNER SIEHT JE ZIEHUNG NUR EIN FÜNFTEL DES POOLS

**Kandidatenmenge je Ziehung: im Mittel 194 von 1062 Poolfragen** (Spanne 164–240).
`aufStufeFiltern` schneidet auf die aktuelle Stufe; der Rest ist unerreichbar, bis die Stufe
steigt. **Kein Befund** — so ist die Adaptivität gebaut. Aber es ordnet alle anderen Zahlen ein:
Die 0 % Wiederholungen in 50 Ziehungen sind bei 194 Kandidaten kein Kunststück.

## L3 — JEDE VIERTE AUFGABE IST EINE GENERIERTE RECHENAUFGABE

**26,0 %** der Sitzung sind Generator-Aufgaben — exakt der Sollwert `generatorEinstreuung: 4`.
**Kein Befund, aber ein Entscheid, den man kennen sollte:** In einer Sitzung mit 50 Aufgaben sind
13 Rechenaufgaben mit frischen Zufallswerten. Ob das dem gewünschten Prüfungsbild entspricht, ist
eine Nutzer-Frage, keine technische.

---

## ZUSAMMENFASSUNG

**Vier von fünf Fragen der Etappe sind mit „das funktioniert" beantwortet:**
Themenverteilung breit ✅ · Typwiederholung null ✅ · Stufenlogik steigt mit der Leistung ✅ ·
kein Wiedersehen in der Sitzung ✅.

**L1 ist aufgeklärt und seit dem 02.09. geschlossen:** M08 läuft mit dem halben Gewicht, weil
**alle zwölf WiSo-Themen in `L.THEMA_RELEVANZ` auf 1 („selten/AP2-nah") stehen**. Die Ziehung tut
genau das, was in der Tabelle steht — **kein Fehler.** Und die Einstufung ist **belegt richtig**:
alle 103 M08-Fragen sind AP2, und B3 ist laut Prüfungskatalog ein AP2-Prüfungsbereich (Nachtrag
oben). **Beim Nutzer liegt daraus nichts mehr.**

**L2 und L3 sind Einordnungen, keine Befunde.**

⛔ **AN DER ZIEHUNGSLOGIK WURDE NICHTS GEÄNDERT** (Nutzer-Entscheid 10). Neu ist allein das
Messwerkzeug `tools/probe_lernfluss.js`, das nichts ins Projekt schreibt.

⚠️ **Die teuerste Lehre dieser Etappe ist methodisch:** Drei meiner Messungen waren falsch, und
alle drei aus demselben Grund — ich hatte außerhalb der laufenden App gemessen (Pool statt
Kandidaten, Endzustand statt Ziehungszeitpunkt, `require` statt App-Kontext). **Jede der drei
hätte einen Scheinbefund ergeben.** Gefunden wurden sie, weil das Ergebnis jeweils zu groß war,
um ungeprüft zu bleiben.

### B147 — die Lernfluss-Probe war 20 Sitzungen lang blind für ihre eigene Überschrift (08.09.)
**Fehlerklasse: ein Nachbau misst, was man sich dabei denkt** (die Klasse vom 31.08.).

Abschnitt 3 der Probe heißt **„STUFENLOGIK – FÜHRT SIE VOM LEICHTEN ZUM SCHWEREN?"** und meldete
seit jeher rund **80 % Stufe 1, 20 % Stufe 2, 1 % Stufe 3, 0 % Stufe 4**. Diese Zahl liest sich
wie ein vernichtender Befund über die App — sie ist aber eine Aussage über die **Bauart der
Probe**: Zeile 101 setzte je Sitzung `w.S.themaLevel = {}`. **Gemessen wurden 20 unabhängige
Erstsitzungen.** Ein Anfänger startet in jedem Thema auf Stufe 1, und eine Sitzung berührt im
Mittel **29,6 Themen bei 50 Fragen** — also 1,7 Fragen je Thema, während der Aufstieg drei
richtige am Stück verlangt. **Die Probe konnte Lernfortschritt gar nicht zeigen.**

⚠️⚠️ **UND ICH HÄTTE DIE ZAHL FAST GEMELDET.** Sie passte zu gut zu dem, was ich am selben Tag
belegt hatte (die Stufe-3/4-Lücken) — genau deshalb wurde sie geprüft, bevor sie in einen Bericht
ging. ►► **Vor jeder Meldung die auswertende Funktion lesen** – hier reichten zwölf Zeilen Code.

#### Der Schalter, und was er misst
`--kette` lässt `themaLevel` und `themaTrack` über die Sitzungen stehen, wie es die App tut
(beides wird in `app_state.js` persistiert). Bei 60 Prozent Trefferquote:

| | Stufe 1 | Stufe 2 | Stufe 3 | Stufe 4 |
|---|---|---|---|---|
| ohne `--kette` (20 Erstsitzungen) | 78,9 % | 20,3 % | 0,8 % | 0 % |
| mit `--kette`, 20 Sitzungen | 42,1 % | 33,7 % | 18,5 % | 5,7 % |
| mit `--kette`, 60 Sitzungen | 33,3 % | 21,8 % | 22,1 % | **22,8 %** |
| **Anteil im Pool** | 15,5 % | 34,0 % | 42,4 % | **8,1 %** |

✅ **Die Stufenlogik trägt.** Wer dranbleibt, kommt oben an — die sechs Fragen vom selben Tag
werden also tatsächlich gezogen.

⚠️ **DER NEUE BEFUND STECKT IN DER LETZTEN ZEILE: STUFE 4 WIRD 2,8-FACH ÜBERZOGEN.** 91 Fragen
tragen 22,8 % der Ziehungen eines Fortgeschrittenen. **Der geübte Lerner sieht dieselben wenigen
Stufe-4-Fragen immer wieder** — Stufe 3 ist mit 475 Fragen dagegen unterversorgt gezogen (0,5-fach).
►► **Das ist der Gegenbefund zur Stufe-3/4-Lücke von heute Vormittag:** dort fehlten die
anspruchsvollen Fragen in drei Themen, hier fehlen sie in der Breite.

### ✅ ENTSCHIEDEN UND UMGESETZT AM 09.09.2026 — „Nachbarstufe bei Knappheit" (v1.26.0)

**Nutzer-Entscheid 09.09.:** `aufStufeFiltern` behält die exakte Stufe, nimmt aber die Stufe
**darunter** dazu, solange das Thema auf seiner Stufe weniger als `L.CONFIG.stufeMinKandidaten`
Fragen hat. Nach oben wird **nie** ergänzt.

⛔⛔ **DIE KNAPPHEIT IST JE THEMA ZU MESSEN, NICHT ÜBER DIE GANZE MENGE — und daran wäre der
Griff fast gescheitert.** Die Kandidatenmenge umfasst rund 240 Fragen aus ~35 Themen; **global
ist sie nie knapp**, während einzelne Feinthemen auf ihrer Stufe leerlaufen. Ein globaler Test
hätte hier nichts gefunden — dieselbe Klasse wie „ein Pool-Scan über `json.dumps` zählt Felder,
nicht Fragen". Der alte Fallback (`mitLevel.length ? mitLevel : menge`) griff aus genau diesem
Grund **nie**: solange irgendein anderes Thema lieferte, blieb er still.

⚠️ **UND EIN FALLBACK JE THEMA WÄRE ZU VIEL GEWESEN.** Der erste Entwurf gab bei leerer Gruppe
die **ganze** Themengruppe zurück. Folge: im Grundzustand kamen Themen **ohne** Stufe-1-Frage
mit ihren höheren Stufen herein — eine Verhaltensänderung, die niemand entschieden hatte.
`test_adaptiv` hat sie im ersten Lauf gemeldet („kandidaten() liefert im Grundzustand nur
Stufe-1-Fragen"). ►► **Hat ein Thema auf seiner Stufe nichts, bleibt es draußen**, wie vorher.

⛔⛔ **DIE ERSTE MESSREIHE STAND AM FALSCHEN NENNER — GEFUNDEN AM SELBEN TAG, EINE STUNDE SPÄTER.**
`genAlsFrage()` setzt `schwierigkeit: S.level`, und `S.level` bleibt im Automatik-Modus **dauerhaft
1** (geschrieben wird es nur im manuellen Modus, `app_seiten.js`). **26 % der Ziehungen zählten
also unabhängig vom Lernstand als „Stufe 1" — und können bauartbedingt nie Stufe 3 oder 4 sein.**
Die Modulverteilung nimmt Generatoren seit jeher aus („Generatoren sind ausgenommen"); die
Stufenverteilung tat es nicht. ►► **Zwei Nenner in einem Bericht sind einer zu viel.**
`tools/probe_lernfluss.js` rechnet die Stufen seit dem 09.09. über die **Pool-Ziehungen** und
druckt den Sitzungsanteil daneben. **Alle Zahlen unten sind die korrigierten.**
⚠️ **Der Fehler traf die eigene Messung von einer Stunde vorher** — dieselbe Klasse, die derselbe
Eintrag oben beschreibt („die Kennzahl war richtig gerechnet und am falschen Nenner").

**DIE MESSREIHE — der Wert ist GEMESSEN, nicht gesetzt** (60 Sitzungen à 50, `--kette`,
Trefferquote 60 %, Pool 1125, **nur Pool-Ziehungen**; Pool-Anteile Stufe 1/2/3/4 =
15,4 / 33,8 / 42,2 / 8,6 %):

| `stufeMinKandidaten` | Stufe 1 | Stufe 2 | Stufe 3 | Stufe 4 | Faktor Stufe 4 | Faktor Stufe 3 |
|---|---|---|---|---|---|---|
| 1 (= alte exakte Logik) | 8,9 % | 26,2 % | 35,3 % | 29,6 % | **3,44-fach** | 0,84-fach |
| 2 | 11,9 % | 23,7 % | 47,0 % | 17,4 % | 2,02-fach | 1,11-fach |
| **3 (gesetzt)** | 12,7 % | 27,6 % | **50,3 %** | **9,5 %** | **1,10-fach** | 1,19-fach |
| 4 | 13,8 % | 26,9 % | 51,4 % | 7,9 % | 0,92-fach | 1,22-fach |
| 6 | 15,0 % | 31,1 % | 48,1 % | 5,8 % | 0,67-fach | 1,14-fach |

**3 ist der letzte Wert, der Stufe 4 nicht unter ihren Pool-Anteil drückt** (1,10-fach); ab 4
kippt sie in Unterversorgung. ⚠️ **Der korrigierte Nenner hat die Wahl nicht verändert, aber
ihre Begründung** — die Überziehung vorher war **3,4-fach**, nicht 2,5-fach.

**Gegenprobe an einer zweiten Trefferquote** — beim geübten Lerner (80 %), um den es geht, ist
der Effekt am größten (nur Pool-Ziehungen):

| Trefferquote 80 % | Stufe 1 | Stufe 2 | Stufe 3 | Stufe 4 |
|---|---|---|---|---|
| vorher (exakt) | 4,8 % | 10,6 % | 36,2 % | **48,4 % (5,6-fach)** |
| nachher (N=3) | 7,2 % | 13,4 % | **62,9 %** | **16,5 % (1,9-fach)** |

⚠️ **Bei Stufe 4 bleibt auch nach der Änderung eine Überziehung von 1,9-fach für den sehr guten
Lerner.** **Nicht durch weiteres Lockern zu beheben** — ab N=4 kippt schon der Normalfall in
Unterversorgung.

#### ✅ NACHGEMESSEN AM 09.09. — UND DIE VERMUTUNG DAZU WAR FALSCH

Hier stand zuerst: „das ist kein Restfehler der Ziehung, sondern der Vorrat — 97 Stufe-4-Fragen
tragen, wer alle Themen hochgestuft hat". **Das klang plausibel und war ungemessen.** Abschnitt 4
der Probe zählt Wiederholungen nur **innerhalb** einer Sitzung (dort seit jeher 0) — und daraus
wurde gelesen, der Lerner sehe keine Frage doppelt. **Die Messung galt aber nur für das
Gemessene: der Lerner übt über Wochen.** Deshalb misst die Probe seit heute auch das Wiedersehen
über die ganze Messung (Abschnitt 4b), 60 Sitzungen à 50, Trefferquote 80 %:

| Stufe | verschiedene Fragen gezogen | Ziehungen | im Mittel je Frage | Spitzenreiter |
|---|---|---|---:|---|
| 1 | 97 von 173 | 160 | 1,6× | M03-011 (6×) |
| 2 | 163 von 380 | 297 | 1,8× | M06-944 (10×) |
| 3 | 337 von 475 | 1397 | **4,1×** | M06-774 (12×) |
| 4 | **87 von 97** | 366 | **4,2×** | M07-219 (13×) |

⛔ **STUFE 3 UND STUFE 4 WERDEN GLEICH OFT WIEDERHOLT — 4,1× gegen 4,2×.** Und der Vorrat wird
**besser** ausgeschöpft als auf Stufe 3: 87 von 97 Fragen (90 %) gegen 337 von 475 (71 %).
►► **Der 1,9-fach-Wert bedeutet nicht, dass der Lerner dieselben wenigen Fragen im Kreis sieht.**
Er ist die Folge davon, dass ein sehr guter Lerner in vielen Themen oben steht — dort gibt es
eben Stufe-4-Fragen und, bei Knappheit, Stufe-3-Fragen. **Kein Handlungsbedarf, kein Ausbau
nötig.** ⚠️ Ohne die Messung wäre daraus eine Etappe „mehr Stufe-4-Fragen schreiben" geworden.

✅ **Zweimal mit `tools/sabotage.sh` gegengeprobt** (beide rc=0): die Ergänzung zu weit getrieben
(`< 99` statt `< minN`) → rot; nach **oben** ergänzt (`>=` statt `===`) → rot. Sollwert
`adaptiv` 55 → 56. ⚠️ Der alte Test „alle gezogenen Fragen passen zur Stufe ihres Themas" hätte
jede Aufweichung durchgewinkt oder alles blockiert; er ist durch **zwei** Prüfungen ersetzt —
nichts über der Themenstufe, und darunter nur bei belegter Knappheit.

#### Ein zweiter Fehler, den erst die Gegenprobe gezeigt hat
Der alte Reset war **inkonsistent**: `themaLevel` wurde zurückgesetzt, `themaTrack` (die laufende
Trefferserie je Thema) **nicht** — die Serie lief über Sitzungsgrenzen weiter, während die Stufe
zurückfiel. Deshalb weicht der Lauf ohne `--kette` nach der Korrektur um **0,8 Punkte** von den
alten Zahlen ab (78,9 statt 79,7 % Stufe 1). ⛔ **Die Gegenprobe war damit NICHT bitgleich — und
das ist der richtige Ausgang:** eine erzwungene Übereinstimmung hätte den Fehler konserviert.

---

## MESSRUNDE 10.09.2026 — die Vorlage aus START_PROMPT Abschnitt 3, gefahren

**Werkzeuge:** `pool_query.js duenn|typen|stufe <1-4>` · `gebiete_stand.py` ·
`probe_lernfluss.js /tmp/ap1_suite 60 50 --antworten 0.8 --kette`.
**Rohdaten:** `_to_delete/mess9_2026-09-10.txt` (Messung), `_to_delete/gegen9_2026-09-10.txt`
(die drei Gegenproben). ⛔ **Am Pool wurde nichts geändert** — die Runde hat zwei Fehler im
MESSWERKZEUG gefunden und sonst nichts.

⚠️ **Die Shell der Sandbox mountete den Projektordner auch am 10.09. nicht** (zweite Messung,
nach dem Neustart der Desktop-App). Alle Läufe dieser Runde liefen in Git Bash auf dem
Windows-Rechner, gelesen wurden die Dateien in `_to_delete/`.

### B148 — die Modul-Abweichung der Probe war der SOLLWERT, nicht ein Befund
**Fehlerklasse: eine widerlegte Messung, die als Begründung im Werkzeug stehen bleibt.**

Abschnitt 1 der Probe meldete `M08 -5,9 Punkte` (gezogen 3,7 %, erwartet 9,6 %) — die größte
Abweichung überhaupt. Im Kopf von `probe_lernfluss.js` stand als Begründung, warum die Ursache
offen sei: „Relevanzgewichtung (**THEMA_RELEVANZ ist leer**) … als Ursache ausgeschlossen".

**Nachgemessen am 10.09.:**

* `require("./logik.js").THEMA_RELEVANZ` hat **81 Einträge**.
* `S.relevanzGewichtung` steht in `app_state.js` per Default auf **true** (Nutzer-Entscheid 12.07.).
* **Alle zwölf M08-Themen stehen auf Relevanz 1** — halbes Gewicht gegenüber dem Default 2.

⛔⛔ **Der Satz „THEMA_RELEVANZ ist leer" war genau die `require`-Falschmessung vom 31.08.**, die
START_PROMPT Abschnitt 6 seither als Lehre führt („per `require` 0 Einträge, in der App 80").
**Die Lehre war notiert — der Kommentar im Werkzeug nicht.** Er hat die Ursache über zehn Tage
verdeckt und wäre am 10.09. fast ein zweites Mal als Befund vorgetragen worden.

**Gegenprobe mit bekannter Antwort** (neuer Schalter `--ohne-relevanz`, setzt
`S.relevanzGewichtung = false`, schreibt nichts):

| Modul | mit Relevanz (Default) | ohne Relevanz |
|---|---:|---:|
| M03 | +4,2 Punkte | +0,1 |
| M07 | +2,4 Punkte | +0,3 |
| **M08** | **−5,9 Punkte** | **+0,3** |

**Alle acht Module fallen auf ±0,3 Punkte zusammen.** Damit ist die Ursache belegt und die Spalte
„Abweichung" als das erkannt, was sie ist: der Erwartungswert zählt **Kandidaten**, gezogen wird
über `L.gewichteFrage` — **mit** Relevanz, Themenschwäche und Interleaving-Malus. Die Probe sagt
das jetzt in zwei Zeilen selbst und nennt den Stand des Schalters je Lauf.

### B149 — „die Stufung steigt nicht" war eine Aussage über das Zeitfenster der Kennzahl
**Fehlerklasse: eine Messung gilt für das Gemessene** (dritter Fall — nach B147 und
„0 Wiederholungen galt der SITZUNG, nicht den Wochen").

Abschnitt 3 meldete bei 60 verketteten Sitzungen und 80 % Trefferquote `mittlere Stufe erste 10:
2,80 / letzte 10: 2,81 (+0,01)` — unter der Überschrift **„FÜHRT SIE VOM LEICHTEN ZUM SCHWEREN?"**.

**Beide Zeilen mitteln INNERHALB einer Sitzung**, über alle Sitzungen hinweg. Mit `--kette`
startet Sitzung 30 auf dem Stand von Sitzung 29 — **der Anstieg liegt zwischen den Sitzungen und
fällt aus dem Fenster.** Die Zahl konnte gar nicht steigen.

**Neu gedruckt (nur Messung):** mittlere Stufe **je Sitzung** und die **erreichten Themenstufen**
am Ende. Damit sagt Abschnitt 3, was seine Überschrift verspricht:

| | Sitzung 1 | 15 | 30 | 45 | 60 |
|---|---:|---:|---:|---:|---:|
| mittlere Stufe (ohne Generatoren) | 1,35 | 2,81 | 3,27 | 3,14 | 3,03 |

**Erreichte Themenstufen am Ende: Stufe 1: 1 · Stufe 2: 7 · Stufe 3: 7 · Stufe 4: 62 Themen**
(77 berührte Themen). **Die Stufenlogik trägt.**

⚠️ **Nebenmesswert, ausdrücklich ohne Vorschlag:** die mittlere Stufe **fällt nach Sitzung 30
wieder** (3,27 → 3,03), während 62 der 77 Themen auf Stufe 4 stehen. Das ist `stufeMinKandidaten`,
das bei dünnem Stufe-4-Vorrat (97 Fragen im Pool) nach unten ergänzt — **genau das gewollte
Verhalten**. Er ordnet sich dem Entscheid vom 09.09. unter („Stufe-4-Vorrat: kein Ausbau nötig").

### Die drei Gegenproben mit bekannter Antwort (VOR dem Urteil, Lehre 4 vom 07.09.)

| Probe | erwartet | gemessen |
|---|---|---|
| ohne `--antworten` | Stufen dürfen sich **nicht** bewegen | Sitzungsreihe konstant **1,00**, „erreichte Themenstufen: keine" ✅ |
| 80 % + `--kette` | Reihe **muss steigen** | 1,35 → 3,03 ✅ |
| `--ohne-relevanz` | Abweichungen **fallen zusammen** | alle acht auf ±0,3 ✅ |

### Was die Runde sonst gemessen hat (Zahlen, keine Befunde)

* **Stufen im Pool:** 173 / 384 / 477 / 97 (Summe 1131). Gezogen (nur Pool-Ziehungen, Nenner
  2220 von 3000): 6,2 / 13,9 / 62,8 / 17,1 %.
* **Dünnste Feinthemen:** M08 „Aufgabenanalyse & -synthese" **5** · je **6**: M04 WLAN & VPN,
  M04 GUI-Entwurf, M06 Security by Design, M08 Arbeitsschutz & Arbeitszeit.
  ⛔ **Die beiden M08-Themen sind B3/AP2** — dort ist Dünne kein AP1-Befund (Lehre 03./04.09.).
* **Typ `konsole`:** 26 Poolfragen, aber **0,3 %** der Ziehungen — niedrigster Wert aller Typen,
  bei gleicher Poolgröße wie `matrix` (2,2 %). **Kandidat, kein Urteil** — Ursache nicht gemessen.
* **A4:** 66 Fragen = **6,53 %** bei Wächterschwelle 4,8 %. Der Puffer vom 09.09. bestätigt sich.

### B150 — `pool_query.js` ohne Argument kannte den Aufruf nicht, den START_PROMPT vorschreibt
**Fehlerklasse: Doku und Werkzeug driften.**

START_PROMPT Abschnitt 8 schreibt vor: „VOR JEDEM MESSSKRIPT `pool_query.js` OHNE ARGUMENT
AUFRUFEN". Das Werkzeug antwortete darauf mit **einer** Zeile („Unbekanntes Kommando. Siehe Kopf
der Datei.") und Rückgabewert **1**. Es druckt jetzt das Kommandoverzeichnis **aus dem eigenen
Kopf** — nicht abgetippt, sonst driften zwei Listen. Gegenproben: unbekanntes Kommando meldet
weiter „Unbekanntes Kommando" mit rc 1, `stufe 3` liefert unverändert 477.

⚠️ **Eigener Messfehler derselben Runde, protokolliert weil er beinahe ein Befund geworden wäre:**
`stufe` wurde ohne sein Argument `<1-4>` aufgerufen und filterte auf `NaN` — **leere Ausgabe, rc 0**.
Eine leere Ausgabe sieht aus wie „nichts gefunden", nicht wie „falsch gefragt".
