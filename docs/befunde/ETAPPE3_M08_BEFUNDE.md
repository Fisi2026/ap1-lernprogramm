# ETAPPE 3 · M08 — BEFUNDE DER BATCH-PRÜFUNG

> ✅ **ALLE 55 FRAGEN VOLLSTÄNDIG GELESEN — alle Felder.**
> ✅✅ **KORREKTURLAUF ERLEDIGT (28.07.2026), Commit `5507b36`: „55 Fragen geprueft und korrigiert
> – Tell 27 → 9 (3,2 %)".** Reihenfolge wie geplant: Inhalt → Sprache → neu messen → Längen.
> ⛔ **HIER STAND BIS ZUM 02.09.2026 „DER EIGENTLICHE KORREKTURLAUF STEHT AUS".** Der Satz war
> wahr, als er geschrieben wurde, und wenige Stunden später falsch – der Lauf fand am selben Tag
> statt, nur der Kopf blieb stehen. Nachgemessen am 02.09.: A1 (`M08-001`, „§ 20 Abs. 2 BBiG")
> ist weg, A16 (`M08-602`, § 622 BGB) und A4 (`M08-613`, Günstigkeitsprinzip) sind neu gebaut.
> **Eine Statuszeile in einem Protokoll altert genauso wie eine Zahl.**

**Stand 2026-07-28 · Vorabmessung und Batch-Prüfung vollständig · 55 von 55 Fragen.**

**Ergebnis:** 20 schwere Befunde (A1–A20) · 13 mittlere (B1–B13) · **17 Gesetzesstellen belegt** ·
**6 Befunde haben im Modul selbst eine richtige Vorlage** (siehe Abschnitt D).
✅ **Keine offenen Prüfpunkte mehr** — auch die beiden zuletzt markierten (§ 64 Abs. 1 BetrVG für
die JAV-Amtszeit, § 21 Abs. 2 JArbSchG für den Ausgleichszeitraum) sind nachgeschlagen.

✅✅ **ALLE 15 STRITTIGEN GESETZESSTELLEN SIND BELEGT** — `docs/befunde/M08_PRUEFLISTE_GESETZE.md`.
13 Annahmen bestätigt, **eine differenzierter als gedacht** (Bäckerhandwerk: über 16 ab 5 Uhr,
über 17 ab 4 Uhr — die Pool-Aussage ist unvollständig, nicht falsch), **ein Verdacht entkräftet**
(„Name und Anschrift" IST Mindestinhalt des § 11 BBiG).
⚠️ **Zwei Korrekturen wären ohne die Recherche falsch geworden.** Die Befunde unten sind
entsprechend nachgeschärft.

---

## 0 · VORABMESSUNG (gemessen, nicht übernommen)

**55 Fragen nach dem `modul`-Feld.** Deckt sich mit `START_PROMPT.md`.

**Typen:** mc 23 · dropdown 9 · zuordnung 8 · freitext 7 · mehrfach 5 · erklaeren 3.
**Themen:** Ausbildungsvertrag & BBiG 14 · Tarifrecht 10 · Mitbestimmung: JAV & Betriebsrat 9 ·
Kündigung 9 · Rechte & Pflichten 7 · Arbeitsschutz & Arbeitszeit 6.
**Stufen:** 1→8 · 2→29 · 3→9 · 4→9. **Gebiet:** B3 (WiSo).

✅ **0 Fragen ohne `verweis`, 0 ohne `erklaerungLang`.** Darin ist M08 deutlich besser als M07.
⚠️ **4 Fragen mit fragilen Optionsverweisen:** M08-700, M08-701, M08-702, M08-703.
Im Code gegengeprüft (siehe M07-Befunde A1): `R_TYP.mc` und `R_TYP.mehrfach` mischen beide.

### Der Längen-Tell ist in M08 ein anderes Problem als in M07

**18 Treffer von 23 gewerteten mc-Fragen — 78 %.** Das ist der mit Abstand schlechteste Wert im
Pool. Entscheidender als die Zahl ist aber das Muster:

| ID | richtig | längster Distr. | Faktor |
|---|---|---|---|
| M08-203 | 329 | 56 | **5,88** |
| M08-613 | 477 | 119 | **4,01** |
| M08-205 | 149 | 39 | **3,82** |
| M08-603 | 298 | 89 | 3,35 |
| M08-605 | 255 | 79 | 3,23 |
| M08-102 | 308 | 96 | 3,21 |
| M08-107 | 259 | 92 | 2,82 |
| M08-105 | 215 | 80 | 2,69 |
| M08-103 | 241 | 90 | 2,68 |
| M08-106 | 217 | 86 | 2,52 |
| M08-601 | 281 | 114 | 2,46 |
| M08-609 | 312 | 129 | 2,42 |
| M08-113 | 237 | 113 | 2,10 |
| M08-005 | 132 | 81 | 1,63 |
| M08-010 | 129 | 81 | 1,59 |
| M08-201 | 119 | 78 | 1,53 |
| M08-101 | 157 | 107 | 1,47 |
| M08-013 | 166 | 123 | 1,35 |

**In M07 lag der höchste Faktor bei 4,10, und nur vier Fragen kamen über 2,5. Hier sind es zwölf.**
Die richtigen Antworten sind keine Antwortoptionen mehr, sondern Kurzaufsätze: M08-613 hat 477
Zeichen, M08-203 hat 329. Die Distraktoren daneben sind Einzeiler von 39 bis 129 Zeichen.

⚠️ **NUTZER-ENTSCHEID 28.07.: GEMISCHT NACH FAKTOR.** Bis etwa Faktor 2 werden die Distraktoren
ausgebaut wie in M07. Darüber wird die richtige Antwort auf ihre Kernaussage gebracht und die
Begründung in die `erklaerungLang` verschoben. **Das ist kein Verstoß gegen „nie die richtige
Antwort kürzen"** — die Regel schützt vor Präzisionsverlust, und beim Verschieben in die
Erklärung geht kein Satz verloren, er wechselt nur den Ort.

⚠️ **DIESE TABELLE IST NACH DEM INHALTSLAUF ÜBERHOLT** — viermal in Folge bestätigt, in M07 sind
zwei Faktoren durch die Sprachkorrektur sogar gestiegen. **Reihenfolge: Inhalt → Sprache →
NEU MESSEN → Längen.**

⚠️ **NUTZER-ENTSCHEID 28.07. zu halbwahren Distraktoren:** Jeder Distraktor wird darauf geprüft,
ob er sachlich zutrifft; wo ja, wird eine eindeutig falsche Fassung vorgeschlagen.

---

## A · SCHWERE BEFUNDE

### A1 · M08-001 — „§ 20 Abs. 2 BBiG" gibt es nicht

`verweis` und `distraktorErklaerungen[1]` berufen sich auf **§ 20 Abs. 2 BBiG**.
**§ 20 BBiG hat keine Absätze** — die Vorschrift besteht aus einem einzigen Absatz mit zwei
Sätzen: „Das Berufsausbildungsverhältnis beginnt mit der Probezeit. Sie muss mindestens einen
Monat und darf höchstens vier Monate betragen."

Das ist **derselbe Fehlertyp wie in M08-603**, wo auf einen nicht existierenden § 623 Abs. 2 BGB
verwiesen wurde (im M07-Lauf bereits korrigiert). **Der Verdacht liegt nahe, dass die Klasse in
M08 mehrfach vorkommt** — das Modul ist voller Paragrafenangaben. Wird beim Durchgang systematisch
geprüft und in A2 gesammelt.
→ Vorschlag: „§ 20 BBiG" ohne Absatzangabe. Die inhaltliche Aussage (1 bis 4 Monate) ist korrekt.

### A2 · Absatzangaben zu Paragrafen, die keine Absätze haben — vier Fundstellen

Alle 27 Absatzangaben in M08 und M09 wurden aufgelistet und einzeln geprüft. **Vier sind falsch,
weil die genannte Vorschrift gar nicht in Absätze gegliedert ist:**

| ID | steht dort | richtig |
|---|---|---|
| M08-001 | § 20 **Abs. 2** BBiG (`verweis` und Distraktorerklärung) | § 20 BBiG |
| M08-009 | § 20 **Abs. 1 und 2** BBiG | § 20 BBiG |
| M08-010 | § 13 **Abs. 1** BBiG | § 13 BBiG |
| M08-603 | § 623 **Abs. 1** BGB — **in der Antwortoption** | § 623 BGB |

**§ 20 BBiG** besteht aus einem Absatz mit zwei Sätzen, **§ 13 BBiG** aus einem Satz mit sieben
Nummern, **§ 623 BGB** aus einem einzigen Satz.

⚠️⚠️ **M08-603 IST EIN EIGENER FEHLER AUS DEM M07-LAUF.** Dort wurden die beiden erfundenen
Gesetzeszitate in der `erklaerungLang` korrigiert — **die falsche Absatzangabe in der
Antwortoption blieb stehen**, weil nur der Erklärungstext geprüft wurde. Der Befund war richtig
erkannt, aber nicht vollständig behoben. **Lehre: Bei einem Befund alle Felder der Frage
durchgehen, nicht nur das, in dem er aufgefallen ist.**

**Alle übrigen 23 Absatzangaben sind korrekt** — §§ 14, 15, 17, 22, 43 BBiG, § 60 und § 87 BetrVG,
§ 12 ArbSchG, §§ 8 und 10 JArbSchG, §§ 1 und 4 TVG, § 626 BGB, §§ 49 HGB.

✅ **ALLE DREI FÄLLE SIND GEGEN DEN GESETZESTEXT BELEGT** (WebSearch, 28.07.) — Nachweise in
**`docs/befunde/M08_PRUEFLISTE_GESETZE.md`**, Punkte 1, 2 und 14. Bei § 13 BBiG wird die Fundstelle durch die
Korrektur sogar präziser: **„§ 13 Satz 2 Nr. 7 BBiG"** statt „§ 13 Abs. 1".

### A3 · M08-005 — die Frage fragt nach der Wählbarkeit, die Antwort beschreibt die vertretene Gruppe

Fragetext: „Ab wann ist eine JAV erforderlich, **und wer darf sich wählen lassen**?"
Richtige Antwort: „Ab 5 jugendlichen Arbeitnehmern bzw. Auszubildenden; **vertreten werden**
Jugendliche unter 18 Jahren und Auszubildende unter 25 Jahren."

**Die zweite Hälfte der Frage wird nicht beantwortet.** Wer vertreten wird (aktives Wahlrecht,
§ 60 BetrVG) und wer sich wählen lassen darf (passives Wahlrecht, § 61 Abs. 2 BetrVG) sind zwei
verschiedene Gruppen: **Wählbar sind alle Arbeitnehmer des Betriebs, die das 25. Lebensjahr noch
nicht vollendet haben** — auch solche, die selbst gar nicht zur JAV-Wählerschaft gehören.

Die Distraktoren verstärken die Unschärfe, indem sie von „**Wahlberechtigten**" sprechen
(Distraktor 1 und 3) — also vom aktiven Wahlrecht, nach dem gar nicht gefragt war.
→ Vorschlag: Entweder den Fragetext auf „… und wen vertritt sie?" bringen (kleiner Eingriff, die
Antwort stimmt dann) **oder** die Antwort um die Wählbarkeit ergänzen und die Distraktoren
begrifflich sauber auf „wählbar" umstellen. **Entscheid nötig.**

### A4 · M08-613 — das Günstigkeitsprinzip wird falsch wiedergegeben

Die richtige Antwort (477 Zeichen, höchster Längen-Tell nach M08-203) sagt:
„Ansonsten gilt der Einzelarbeitsvertrag — aber das **Günstigkeitsprinzip** besagt: Gibt es einen
anwendbaren Tarifvertrag, **geht er vor**."

**Das ist nicht das Günstigkeitsprinzip.** § 4 Abs. 3 TVG regelt das Gegenteil: Abweichende
Abmachungen sind zulässig, **soweit sie für den Arbeitnehmer günstiger sind**. Der Tarifvertrag
setzt also eine Untergrenze, er verdrängt nicht jede abweichende Regelung. Was die Antwort
beschreibt, ist eher das Rangprinzip bei bestehender Tarifbindung.

Weitere Schwächen derselben Antwort:
* „Es **kann aber sein**, dass der TV durch Allgemeinverbindlichkeit (AVE) nach § 5 TVG
  **gekoppelt** ist" — „gekoppelt" ist kein Rechtsbegriff; gemeint ist „für allgemeinverbindlich
  erklärt". Und eine Stufe-4-Antwort, die mit „es kann aber sein" arbeitet, ist als Lösung schwach.
* „Auszubildende **sollten** mindestens Tarifniveau erhalten" — unverbindlich formuliert. Seit dem
  01.01.2020 gilt die **Mindestausbildungsvergütung nach § 17 Abs. 2 BBiG**; bei Tarifbindung gilt
  ohnehin der Tarifvertrag. Hier gehört eine belastbare Aussage hin.
* Distraktor 1: „kann frei zahlen und **urlaub** gewähren" — Kleinschreibung.

→ Vorschlag: Antwort auf die Kernaussage bringen („Ohne Verbandsmitgliedschaft und ohne
Allgemeinverbindlicherklärung besteht keine Tarifbindung; es gilt der Einzelvertrag, begrenzt
durch die Mindestausbildungsvergütung nach § 17 BBiG"), die Begründung in die `erklaerungLang`
verschieben und das Günstigkeitsprinzip dort **richtig** erklären. Damit wären A4 und der
Längen-Tell in einem Zug erledigt.

### A5 · M08-203 — der als falsch markierte Distraktor 3 ist sachlich zutreffend

Frage: Azubi kommt dreimal in zwei Monaten 15 Minuten zu spät, Betrieb will fristlos kündigen.
Als falsch markiert: „**Der Betrieb kann kündigen, aber nur mit wichtigem Grund.**"

**Nach der Probezeit ist genau das die Rechtslage** (§ 22 Abs. 2 Nr. 1 BBiG): Eine Kündigung durch
den Ausbildenden ist nur noch aus wichtigem Grund möglich. Die als richtig markierte Antwort sagt
inhaltlich dasselbe, nur ausführlicher: „Nur bei schwerem, wiederholtem Verstoß oder
Uneinsichtigkeit kann **nach Abmahnungen** fristlos gekündigt werden."

**Damit hat die Frage zwei vertretbare Antworten** — und der Lerner, der die knappe richtige wählt,
bekommt „falsch". Genau der Fall, den der Nutzer-Entscheid vom 28.07. adressiert.
→ Vorschlag: Distraktor 3 auf eine eindeutig falsche Aussage umstellen, z. B. „Der Betrieb kann
ohne Abmahnung kündigen, wenn die Verspätungen im Berichtsheft dokumentiert sind."

Nebenbefund: „schriftliche **Abmahnung(en)**" — Klammer-Plural im Lernertext.

---

### A6 · M08-006 — „mindestens jährlich" gilt für jugendliche Auszubildende nicht

Die Frage lautet ausdrücklich: „Wann muss ein Arbeitgeber seine Beschäftigten **und
Auszubildenden** in Arbeitssicherheit unterweisen?" Richtige Antwort und Erklärung sagen
„vor Aufnahme der Tätigkeit und danach **mindestens jährlich**" und stützen sich auf
§ 12 Abs. 1 ArbSchG und das DGUV-Regelwerk.

**Für Auszubildende unter 18 Jahren gilt § 29 JArbSchG: halbjährliche Unterweisung.** Die Frage
schließt diese Gruppe ausdrücklich ein, die Antwort deckt sie nicht ab. In einem WiSo-Modul, das
an anderer Stelle sorgfältig zwischen Jugendlichen und Erwachsenen unterscheidet (M08-101,
M08-110, M08-115 zum JArbSchG), ist das inkonsequent.
→ Vorschlag: In `erklaerungLang` ergänzen: „Bei Jugendlichen unter 18 Jahren verlangt § 29
JArbSchG eine Unterweisung **halbjährlich**." Die richtige Antwort bleibt unverändert.

### A7 · M08-014 — die Musterlösung handelt von einem anderen Betrieb als die Frage

Fragetext: Eine Auszubildende der **Halstenbeker Versandlager GmbH** soll regelmäßig allein Pakete
ausliefern. Musterlösung: „Ausbildungsfremde Tätigkeiten, die dem Ausbildungszweck nicht dienen
(**wie Paketauslieferung bei einem Metallfachbetrieb**), sind nicht zulässig."

**Bei einem Versandlager ist Paketauslieferung nicht ausbildungsfremd** — sie ist das Kerngeschäft.
Die Musterlösung braucht den Metallfachbetrieb, um ihre eigene Begründung zu tragen, und beweist
damit, dass der Fall mit einem anderen Betrieb im Kopf geschrieben wurde. **Die Frage ist in der
vorliegenden Fassung nicht sauber lösbar:** Ob die Tätigkeit zulässig ist, hängt genau an dem
Punkt, den der Fragetext falsch besetzt.
→ Vorschlag: Firma auf einen Ausbildungsbetrieb ändern, in dem Paketauslieferung eindeutig
ausbildungsfremd ist (z. B. „Halstenbeker Systemhaus GmbH", Ausbildung zum Fachinformatiker), und
den Klammerzusatz entsprechend anpassen. **Zweiter Fall dieser Art nach M07-608.**

Zweiter Befund derselben Frage: Als Ansprechpartner wird genannt „(4) bei Nichtbefolgung auch die
**Berufsgenossenschaft**". Die Berufsgenossenschaft ist Träger der gesetzlichen Unfallversicherung
und für Arbeitsschutz zuständig — **nicht für ausbildungsfremde Tätigkeiten.** Zuständig ist die
Kammer als zuständige Stelle (§§ 71 ff. BBiG), bei Verstößen gegen das JArbSchG die
Gewerbeaufsicht. → Vorschlag: Punkt (4) streichen oder durch „die Gewerbeaufsicht" ersetzen.

### A8 · M08-011 — die JAV bekommt Rechte zugeschrieben, die sie nicht hat

`musterloesung`: „Sie hat **Mitbestimmungs-**, Beratungs- und Informationsrechte nach dem BetrVG."
`erklaerungLang`: „Sie hat **Mitbestimmungsrechte** in Fragen der Ausbildung und des
Arbeitsschutzes." Und: „Die JAV ist dem Betriebsrat **untergeordnet**."

**Die JAV hat keine eigenen Mitbestimmungsrechte.** Nach § 70 BetrVG hat sie Antrags-,
Beratungs- und Informationsrechte; sie kann Maßnahmen beim Betriebsrat beantragen und an dessen
Sitzungen teilnehmen. **Die Mitbestimmung übt der Betriebsrat aus** — das ist der Kern der
Konstruktion. „Untergeordnet" trifft es ebenfalls nicht: Die JAV ist ein eigenständiges Organ ohne
eigene Durchsetzungsrechte gegenüber dem Arbeitgeber.

⚠️ **Der Fehler steht auch in `schluesselbegriffe.pflicht`** — dort wird „Mitbestimmung" als
Pflichtbegriff verlangt. Ein Lerner, der korrekt „Antrags- und Beratungsrechte" schreibt, wird
als unvollständig gewertet. **Dieselbe Konstellation wie M07-115.**

Dritter Punkt: Die Frage beschreibt die JAV als Vertretung „für Arbeitnehmer und Auszubildende
**unter 25 Jahren**". **M08-005 differenziert richtig** (jugendliche Arbeitnehmer unter 18,
Auszubildende unter 25). Die beiden Fragen widersprechen sich.
→ Vorschlag: „Mitbestimmung" durch „Antrags- und Beratungsrechte" ersetzen — in Musterlösung,
Erklärung UND `schluesselbegriffe`; „untergeordnet" durch „dem Betriebsrat zugeordnet"; die
Altersgrenzen an M08-005 angleichen.

### A9 · Auflösung zu A4 — M08-030 erklärt das Günstigkeitsprinzip bereits richtig

Wie schon bei „Kostenabweichung" in M07 führt der Pool die richtige Fassung selbst:
**M08-030** sagt „Eine arbeitsvertragliche Abweichung ist nur wirksam, wenn sie den Beschäftigten
BESSER stellt (§ 4 Abs. 3 TVG)" und schließt mit „**Der Tarifvertrag ist ein Mindeststandard,
keine Obergrenze — nach oben darf abgewichen werden, nach unten nicht.**"

**M08-613 behauptet das Gegenteil** („Gibt es einen anwendbaren Tarifvertrag, geht er vor").
→ Die Korrektur von A4 kann sich wörtlich an M08-030 orientieren. **Kein eigener Entscheid nötig.**

⚠️ Nebenbefund: **M08-030 ist die einzige M08-Frage mit einem `verweis` im Modul-Format**
(„Modul 08, Abschnitt 8.5 – …"). Die übrigen 54 benutzen das Gesetzesformat („BBiG § 20,
WiSo-Grundlagen: …"). M08-030 stammt aus Etappe 6 und wurde nach M07-Muster geschrieben.
**Vor einer Vereinheitlichung klären, welches Format für M08 gelten soll** — das hängt am
poolweiten Verweis-Griff.

### A10 · M08-104 — „Im Ausbildungskontext sind alle vier Varianten möglich" stimmt nicht

`erklaerungLang` schließt mit: „Merke: Im Ausbildungskontext (BBiG) sind **alle vier Varianten
möglich**." Genannt werden ordentliche Kündigung, außerordentliche Kündigung,
Änderungskündigung und Aufhebungsvertrag.

**Nach der Probezeit gibt es im Ausbildungsverhältnis keine ordentliche Kündigung durch den
Ausbildenden.** § 22 Abs. 2 BBiG lässt nur noch zwei Wege zu: die Kündigung aus wichtigem Grund
(Nr. 1) und die Kündigung durch den Auszubildenden bei Berufsaufgabe oder -wechsel mit vier Wochen
Frist (Nr. 2). Eine **Änderungskündigung** ist im Ausbildungsverhältnis praktisch ausgeschlossen —
der Ausbildungsinhalt ergibt sich aus der Ausbildungsordnung, nicht aus verhandelbaren
Arbeitsbedingungen.

Derselbe Denkfehler steckt schon im Aufzählungspunkt darüber: „Ordentliche Kündigung:
grundsätzlich zulässig mit Einhaltung der Frist (z. B. 4 Wochen nach BBiG § 22). **Sie erfordert
nach der Probezeit einen wichtigen Grund**." Eine ordentliche Kündigung, die einen wichtigen Grund
erfordert, ist begrifflich keine ordentliche Kündigung mehr — hier sind § 22 Abs. 2 Nr. 1 und Nr. 2
BBiG ineinandergeschoben. Auch der Klammerzusatz im `paare`-Element („Angabe von Gründen optional,
**außer bei Azubis nach Probezeit**") trägt diese Vermischung.

→ Vorschlag: Merksatz ersetzen durch „Im Ausbildungsverhältnis ist nach der Probezeit nur noch die
außerordentliche Kündigung aus wichtigem Grund möglich — sowie die Kündigung durch den
Auszubildenden bei Berufsaufgabe mit vier Wochen Frist (§ 22 Abs. 2 BBiG)." Den
Aufzählungspunkt zur ordentlichen Kündigung auf das allgemeine Arbeitsverhältnis beziehen.

### A11 · M08-101 — der Merksatz widerspricht M08-102

`erklaerungLang` von **M08-101** schließt: „Merke: Für Erwachsene gilt das ArbZG mit **maximal 10
Stunden täglich und 48 Stunden wöchentlich**."
**M08-102** stellt es richtig dar: „**8 Stunden werktäglich**; eine Verlängerung auf bis zu 10
Stunden ist zulässig, wenn innerhalb von 6 Kalendermonaten bzw. 24 Wochen im Durchschnitt 8 Stunden
werktäglich nicht überschritten werden."

Der Merksatz macht aus der **Ausnahme mit Ausgleichspflicht** die Regel. Wer nur M08-101 liest,
lernt „10 Stunden sind erlaubt" — und M08-102 sagt ihm das Gegenteil.
→ Vorschlag: „Merke: Für Erwachsene gilt das ArbZG: 8 Stunden werktäglich, ausnahmsweise 10 mit
Ausgleich innerhalb von 6 Monaten (§ 3 ArbZG)."

Zweiter Punkt derselben Frage: „mit wenigen Ausnahmen, z. B. Krankenhäuser oder **Bäckereien nach
4:00 Uhr**". § 14 Abs. 2 Nr. 4 JArbSchG erlaubt Jugendlichen über 16 Jahren im Bäckerhandwerk die
Arbeit **ab 5 Uhr**, nicht ab 4 Uhr. (Im Konditorenhandwerk ab 6 Uhr.)
⚠️ **Am Windows-Rechner gegen den Gesetzestext gegenprüfen.**

### A12 · Das Günstigkeitsprinzip steht dreimal richtig im Pool — nur M08-613 nicht

Nach M08-030 und M08-112 ist **M08-107** die dritte Fundstelle der korrekten Fassung: „Das
Günstigkeitsprinzip besagt: **Abweichungen sind nur zum Vorteil des Arbeitnehmers möglich**", und
der Distraktor „Abweichungen nach oben oder unten gleich zulässig" wird ausdrücklich verworfen.

**Damit ist M08-613 die einzige Frage im ganzen Modul, die es falsch darstellt** — ein Ausreißer,
kein systematisches Missverständnis. Die Korrektur ist entsprechend risikoarm.

### A13 · „Ausbildungsmittel" als Vertragsinhalt — zweite Fundstelle

Neben **M08-008** (siehe B3) führt auch **M08-109** die Vertragsinhalte auf und nennt darunter
„… Arbeitsort, **Ausbildungsmittel**, Vergütung, Probezeit". **§ 11 BBiG kennt diesen Punkt nicht**
(belegt, Prüfliste Punkt 4) — die kostenlose Bereitstellung ist eine Pflicht des Ausbildenden nach
§ 14 Abs. 1 Nr. 3 BBiG, kein Mindestinhalt der Vertragsniederschrift.
**Damit ist es eine Fehlerklasse, kein Einzelfall.** Beide Fragen in einem Zug korrigieren.

Zweiter Befund derselben Frage: `erklaerungKurz` beginnt mit „**BAV § 11**" — die Abkürzung gibt
es nicht, gemeint ist **BBiG**. In einer Kurzerklärung, die der Lerner als erstes sieht.

### A14 · M08-114 — § 102 BetrVG wird als „Mitbestimmung" einsortiert, ist aber Anhörung

Die Zuordnung führt als eigene Kategorie „**Mitbestimmung bei Personalmaßnahmen**" und beschreibt
sie mit „Der Betriebsrat muss VOR Kündigung angehört werden (§ 102 BetrVG)".

**§ 102 BetrVG ist ein Anhörungsrecht, keine Mitbestimmung.** Die `erklaerungLang` derselben Frage
weiß das und schreibt es auch hin: „Mitbestimmung bei Personalmaßnahmen (**Anhörungsrecht**,
§ 102 BetrVG) … Der Betriebsrat kann dabei eine Stellungnahme abgeben, **hat aber nicht dasselbe
Vetorecht** wie bei den echten Mitbestimmungsrechten." **Die Kategoriebezeichnung widerspricht der
eigenen Erklärung** — und der Lerner soll genau diese Abstufung lernen.

Echte Mitbestimmung bei Personalmaßnahmen gibt es übrigens: bei Einstellung, Eingruppierung und
Versetzung nach **§ 99 BetrVG**. Bei der Kündigung eben nicht.
→ Vorschlag: Kategorie umbenennen in „**Anhörung bei Kündigungen (§ 102 BetrVG)**". Damit stimmt
auch die Dreistufigkeit, die der Merksatz behauptet: Mitbestimmung – Anhörung – Information.

### A15 · M08-204 — das Günstigkeitsprinzip wird im `verweis` dem BGB zugeschrieben

`verweis`: „TVG § 1 ff.; **BGB § 4 (Günstigkeitsprinzip)**; BAG-Rechtsprechung".
**Das Günstigkeitsprinzip steht in § 4 Abs. 3 TVG**, nicht im BGB — belegt in der Prüfliste und
im Pool selbst viermal richtig zitiert (M08-030, M08-107, M08-112 und die `paare` **dieser
Frage**). Die Frage widerspricht damit ihrem eigenen Inhalt.
→ Korrektur: „TVG §§ 1 ff., § 4 Abs. 3 (Günstigkeitsprinzip); BAG-Rechtsprechung".

Nebenbefund: Als Beispiele für Haustarifverträge nennen die `paare` „**Siemens, Daimler**", die
`erklaerungLang` „**Siemens oder BMW**" — dieselbe Aussage mit unterschiedlichen Firmen, dazu drei
verwaiste Firmennamen (offener Punkt 5 der Gesamtliste). **M08-615 nennt Siemens ein drittes Mal**
(„Siemens etwa hat einen eigenen Tarifvertrag") — bei der Korrektur alle drei Stellen zusammen
anfassen. Ebenso überflüssig: „Das deutsche
Tarifrecht … unterscheidet sich stark vom anglo-amerikanischen System" — eine Wertung ohne
Prüfungsbezug.

### A16 · M08-602 — § 622 Abs. 2 BGB war vollständig verdreht ✅ **ERLEDIGT 28.07.**

> ✅✅ **NEU GEBAUT (Nutzer-Freigabe 28.07.: „baue die frage neu").** Typ **dropdown beibehalten**,
> damit die Typverteilung des Pools unverändert bleibt; **von zwei auf vier Lücken erweitert**.
> Die neue Frage prüft genau die drei Punkte, an denen die alte falsch lag:
> **(1)** Grundfrist vier Wochen zum Fünfzehnten **oder** zum Monatsende (§ 622 Abs. 1),
> **(2)** die Staffelung gilt **ausschließlich für den Arbeitgeber** (§ 622 Abs. 2),
> **(3)** ein Monat nach zwei Jahren, vier Monate nach zehn — **Monate, nicht Wochen**.
> Die `erklaerungLang` führt die vollständige Staffelung bis 20 Jahre auf, nennt § 622 Abs. 6
> (die Frist des Arbeitnehmers darf nie länger sein als die des Arbeitgebers) und grenzt gegen das
> Ausbildungsverhältnis ab (§ 22 Abs. 2 BBiG — dort keine ordentliche Kündigung durch den Betrieb).
> **Geprüft:** build 1073 Fragen · validate_pool OK · validate_schema OK · 8 Suiten grün
> (didaktik, meta, stufen, freitext, render_smoke, engine, logik, abk). Diff auf `pool_m08.json`
> begrenzt, 30 Zeilen.

**Der Befund im Wortlaut (Dokumentation, was falsch war):**

**Der Fragetext selbst enthält den Fehler**, nicht nur eine Erklärung:
„Die Kündigungsfrist **für den Arbeitnehmer** kann bei längerer Betriebszugehörigkeit **nach
Abs. 2** bis zu ___ **Wochen** zum Ende eines Kalendermonats betragen." Lösung: **4**.

**§ 622 Abs. 2 BGB gilt ausschließlich für die Kündigung DURCH DEN ARBEITGEBER** (belegt,
WebSearch 28.07.), und die Fristen sind **Monate, nicht Wochen**:
1 Monat nach 2 Jahren · 2 Monate nach 5 · 3 Monate nach 8 · 4 Monate nach 10 · bis 7 Monate nach
20 Jahren. **Der Arbeitnehmer kündigt auch nach langer Betriebszugehörigkeit mit der Grundfrist
von vier Wochen** (§ 622 Abs. 1); nach § 622 Abs. 6 BGB darf seine Frist nie länger sein als die
des Arbeitgebers.

Die `erklaerungLang` dreht es an drei Stellen falsch herum:
* „**Für den Arbeitnehmer** nach Betriebszugehörigkeit (§ 622 Abs. 2)" — es ist der Arbeitgeber.
* „höchstens bis zu 4 Wochen … nach einer Betriebszugehörigkeit von 2 Jahren – **dann 1 Monat**"
  — der Satz widerspricht sich in sich selbst.
* „**Für den Arbeitgeber bleibt es bei 4 Wochen**, sofern nicht ein Tarifvertrag anderes vorsieht."
  — **genau verkehrt.** Beim Arbeitgeber verlängert sich die Frist kraft Gesetzes.

Dazu lässt der Fragetext bei der Grundfrist den Termin „**zum Fünfzehnten**" weg (§ 622 Abs. 1
nennt „zum Fünfzehnten oder zum Ende eines Kalendermonats").

→ **Diese Frage ist nicht durch Wortkorrekturen zu retten** — Fragetext, beide Lücken und die
Erklärung transportieren dieselbe Verwechslung. **Vorschlag: inhaltlich neu bauen**, wie M07-306
und die beiden M02-Dubletten. Sinnvoller Zuschnitt: die Staffelung des § 622 Abs. 2 als
`zuordnung` (Betriebszugehörigkeit → Frist) statt als Lückentext.
⚠️ **Entscheid nötig** (E-Abschnitt).

### A17 · M08-606 — die Erklärung vergibt die Nummern des § 87 Abs. 1 BetrVG falsch

**Die `musterloesung` ist korrekt:** „§ 87 Abs. 1 **Nr. 2** BetrVG (Beginn und Ende der täglichen
Arbeitszeit einschließlich der Pausen) und **Nr. 3** (vorübergehende Verlängerung der
betriebsüblichen Arbeitszeit)."

**Die `erklaerungLang` derselben Frage widerspricht ihr:**
„Anfangs- und Endzeiten der täglichen Arbeit … – **Nr. 1**. Dazu zählen Pausen und deren Lage –
**Nr. 2**. Dazu zählen Betriebssicherheit und Arbeitshygiene – **Nr. 7**."

§ 87 Abs. 1 BetrVG: **Nr. 1** ist die Ordnung des Betriebs und das Verhalten der Arbeitnehmer,
**Nr. 2** umfasst Arbeitszeit UND Pausen zusammen, **Nr. 3** die vorübergehende Verlängerung,
**Nr. 7** die Verhütung von Arbeitsunfällen. Die Erklärung schiebt alles um eine Nummer und
trennt Arbeitszeit und Pausen, die in Nr. 2 gemeinsam stehen.
Der `verweis` trägt den Fehler mit: „§ 87 Abs. 1 **Nr. 1, 2**" statt Nr. 2, 3.
→ Korrektur: Erklärung und `verweis` an die Musterlösung angleichen.

### A18 · A8 ist eine Fehlerklasse — „JAV untergeordnet" und „eigene Mitbestimmungsrechte" auch in M08-605

Nach M08-011 findet sich dieselbe Doppelbehauptung in **M08-605**, dort sogar **in der
Antwortoption selbst**: „Die JAV ist dem Betriebsrat **untergeordnet** …", und die
`erklaerungLang` setzt nach: „Die JAV ist eine **Untervertretung** des Betriebsrats. Sie arbeitet
mit ihm zusammen, hat aber **eigene Mitbestimmungsrechte** bei Fragen der Ausbildung …"

**Beides ist belegt falsch** (§ 70 BetrVG, Prüfliste Punkt 9): Die JAV hat Antrags-, Beratungs-
und Informationsrechte und wirkt über den Betriebsrat. **Damit ist es keine Einzelstelle mehr,
sondern eine Fehlerklasse über mindestens zwei Fragen — und einmal in einer Antwortoption, die
der Lerner als richtig ankreuzen muss.**

⚠️ Positiv hervorzuheben: **M08-605 gibt die Altersgrenzen als einzige Frage vollständig richtig
wieder** („mindestens 5 Arbeitnehmer, die das 18. Lebensjahr noch nicht vollendet haben, **oder**
Auszubildende, die das 25. Lebensjahr noch nicht vollendet haben"). Für die Angleichung von
M08-005, M08-011 und M08-106 ist das die Vorlage.

### A19 · Die JAV-Altersgrenzen sind an VIER Stellen verkürzt — jetzt auch im Fragetext

Nach M08-005, M08-011 und M08-106 verkürzt auch **M08-608** die Schwelle, diesmal **im Fragetext
selbst**: „mindestens ___ jugendliche Arbeitnehmer oder Auszubildende **unter ___ Jahren**"
(Lösungen 5 und 25). Das legt nahe, die 25-Jahre-Grenze gelte für beide Gruppen.

**Richtig ist:** Arbeitnehmer, die das **18.** Lebensjahr noch nicht vollendet haben, **oder**
Auszubildende, die das **25.** noch nicht vollendet haben (§ 60 Abs. 1 BetrVG).
Die `erklaerungLang` derselben Frage sagt es korrekt — der Fragetext nicht.
→ **Vier Fragen in einem Zug angleichen**, Vorlage ist M08-605 bzw. die Erklärung von M08-608.

✅ **BELEGT (WebSearch, 28.07.):** M08-608 nennt für die zweijährige Amtszeit der JAV „§ 60 Abs. 2"
— **richtig ist § 64 Abs. 1 BetrVG** („Zeitpunkt der Wahlen und Amtszeit"): Die regelmäßige
Amtszeit beträgt zwei Jahre, die Wahlen finden alle zwei Jahre zwischen dem 1. Oktober und dem
30. November statt. § 60 BetrVG regelt nur die Errichtung. → Korrektur: **„§ 64 Abs. 1 BetrVG"**.

### A20 · M08-616 — das Günstigkeitsprinzip wird auf zwei Tarifverträge angewandt

`erklaerungLang`: „VERHÄLTNIS: Firmentarifverträge können ÜBER dem Flächentarifvertrag liegen,
z. B. mit höheren Löhnen, aber nicht darunter **(Günstigkeitsprinzip)**."
`Merke`: „Ein Firmentarifvertrag mit 35-Stunden-Woche ist zulässig, wenn der Flächentarifvertrag
38 Stunden vorsieht — umgekehrt (40 h gegen 38 h) wäre es unzulässig."

**Das Günstigkeitsprinzip des § 4 Abs. 3 TVG regelt das Verhältnis von Tarifvertrag zu
EINZELARBEITSVERTRAG**, nicht das Verhältnis zweier Tarifverträge zueinander. Kollidieren zwei
Tarifverträge, greifen Spezialitätsprinzip und Tarifeinheit (§ 4a TVG) — ein Firmentarifvertrag
kann durchaus schlechtere Bedingungen enthalten als der Flächentarifvertrag; genau das ist in
Sanierungsfällen der übliche Grund für seinen Abschluss.

**Bemerkenswert:** M08 stellt das Günstigkeitsprinzip an vier Stellen korrekt dar (M08-030,
M08-107, M08-112, M08-204) — hier wird es auf eine Konstellation angewandt, für die es nicht gilt.
→ Vorschlag: Klammerzusatz „(Günstigkeitsprinzip)" streichen und den Merksatz auf das Verhältnis
Tarifvertrag/Arbeitsvertrag umstellen.

Nebenbefund: Als Beispiele für Haustarifverträge nennt die Frage „**Siemens, VW oder Telekom**" —
zusammen mit M08-204 und M08-615 ist Siemens damit **viermal** im Modul. (IG Metall und
Südwestmetall sind dagegen sachlich notwendig, das sind die Tarifparteien.)

---

## B · MITTLERE BEFUNDE

### B13 · M08-614 — die Friedenspflicht wird auf laufende Tarifverhandlungen ausgedehnt
`musterloesung`: „Während eines gültigen Tarifvertrags **oder in der Tarifverhandlung**
verpflichten sich beide Seiten, KEINE Streiks oder Aussperrungen durchzuführen."
`erklaerungLang`: „Das gilt auch **während laufender Tarifverhandlungen bis zu einem Stichtag**."

**Das ist zu weit.** Die Friedenspflicht folgt aus dem laufenden Tarifvertrag und endet mit dessen
Ablauf. **Gerade in den Verhandlungen nach Ablauf sind Arbeitskämpfe zulässig** — sonst gäbe es
keine Warnstreiks in Tarifrunden. Die Frage sagt an anderer Stelle selbst richtig: „Nach Ablauf des
Tarifvertrags … endet die Friedenspflicht, Streiks werden legal." Beide Aussagen stehen
nebeneinander.
→ Vorschlag: „oder in der Tarifverhandlung" streichen, den Satz mit dem „Stichtag" ebenfalls.
✅ Das Zitat aus **Art. 9 Abs. 3 GG ist wörtlich korrekt** — anders als die erfundenen Zitate in
M07-107 und M08-603.

### B12 · M08-611 — zwei Zusätze zum Berichtsheft, die nicht im Gesetz stehen
Die Frage ist im Kern **vorbildlich**: Sie zitiert bereits „**§ 13 Satz 2 Nr. 7 BBiG**" — genau die
Fassung, die ich für M08-010 vorschlage (A2). Zwei Zusätze der `erklaerungLang` tragen aber nicht:
* „Der Betrieb muss dem Azubi Zeit und Gelegenheit dafür geben (**§ 15 Abs. 2 BBiG**)."
  § 15 Abs. 2 regelt die **Anrechnung der Berufsschulzeit**. Die Pflicht, das Führen des
  Ausbildungsnachweises zu ermöglichen, steht in **§ 14 Abs. 2 BBiG**.
* „Der Ausbildende muss das Berichtsheft regelmäßig – **mindestens monatlich** – kontrollieren."
  § 14 Abs. 2 BBiG verlangt, den Nachweis **regelmäßig durchzusehen** — eine Monatsfrist nennt das
  Gesetz nicht. → Zusatz streichen oder als Praxisempfehlung kennzeichnen.

### B11 · M08-609 und M08-610 — Freistellung zur „Prüfungsvorbereitung" gibt es so nicht
* **M08-610** nennt als Ausbilderpflicht „FREISTELLUNG ZUR PRÜFUNG: … für Zwischen- und
  Abschlussprüfungen **und Prüfungsvorbereitung** (§ 15 BBiG)". § 15 BBiG erfasst die Teilnahme an
  Prüfungen und Ausbildungsmaßnahmen — **eine allgemeine Freistellung zur Vorbereitung gibt es
  nicht.** Für Jugendliche gilt nur der Tag unmittelbar vor der schriftlichen Abschlussprüfung
  (§ 10 Abs. 1 Nr. 2 JArbSchG).
* **M08-609** schreibt: „Am Freitag vor der Abschlussprüfung sollte der Azubi Zeit zum Lernen haben
  (§ 10 JArbSchG)" — ohne die Altersgrenze und ohne die Beschränkung auf den unmittelbar
  vorausgehenden Tag.
* **M08-612** führt sie ein drittes Mal: `paare` „Prüfungen bezahlt freistellen;
  **Prüfungsvorbereitung ermöglichen** → Ausbildungsbetrieb".
**Damit ist es eine Fehlerklasse über drei Fragen. M08-110 macht die Unterscheidung vorbildlich**
und ist die Vorlage für alle drei Korrekturen.

Nebenbefund M08-612: „Azubi – **Gehorsamspflicht**". Das BBiG kennt den Begriff nicht; § 13 Satz 2
Nr. 3 spricht davon, Weisungen zu **folgen**. „Gehorsamspflicht" ist antiquiert und für ein
Lernprogramm von 2026 unpassend. → „Weisungsgebundenheit".

Nebenbefund M08-610: Die Frage lautet „Welche Pflichten hat ein Ausbilder **nach § 14 BBiG**?",
die Musterlösung führt aber auch §§ 11, 15 und 17 auf. → Frage auf „Pflichten des Ausbildenden"
öffnen oder die Antwort auf § 14 begrenzen.

Nebenbefund M08-609 (Sprache): „beschränkt die Tätigkeit klar auf die **Ausbildungsberuf**" ·
„**Unlimited** Weisungen sind nicht gedeckt" (englisches Wort im Lernertext) · „wenn keine
**anderen Arbeit** anfällt" · Fragetext „Aufgaben für einen privaten **Kunde**".

### B10 · M08-601 — die Distraktorerklärung antwortet auf eine andere Aussage
Distraktor 2 lautet „Nein, aber der Grund ist ausreichend, wenn **der Betrieb** 2 Wochen Frist
einhält." Die zugehörige Erklärung antwortet: „**Der Auszubildende** hat nach § 22 Abs. 2 BBiG eine
Frist von VIER Wochen, nicht zwei." Der Distraktor spricht vom Betrieb, die Erklärung vom
Auszubildenden. → Erklärung auf den Betrieb umstellen: Für ihn gibt es nach der Probezeit
überhaupt keine Frist-Kündigung, nur den wichtigen Grund.

### B9 · M08-202 — falscher Absatz und eine Schriftformbehauptung, die zu weit geht
* „Für Auszubildende ist die außerordentliche Kündigung strenger geregelt (**§ 22 Abs. 1 BBiG**)"
  — Abs. 1 regelt die Probezeit. Die außerordentliche Kündigung **nach** der Probezeit steht in
  **§ 22 Abs. 2 Nr. 1 BBiG**. Der Satz beschreibt beide Fälle, nennt aber nur den falschen Absatz.
* „Die Kündigung muss schriftlich erfolgen und **den Grund enthalten**." Für die außerordentliche
  Kündigung nach § 626 BGB gilt das **nicht** — der Grund ist auf Verlangen mitzuteilen
  (§ 626 Abs. 2 Satz 3 BGB), muss aber nicht im Kündigungsschreiben stehen. Die Pflicht zur
  Grundangabe im Schreiben gilt im **Ausbildungsverhältnis** (§ 22 Abs. 3 BBiG). Die Frage
  verallgemeinert eine Sonderregel.
→ Vorschlag: beide Sätze trennen — allgemeines Arbeitsrecht gegen Ausbildungsverhältnis.

### B8 · M08-201 — „ohne Grund kündigen" trifft es nicht
`distraktorErklaerungen[3]`: „Auszubildende können **auch ohne Grund** kündigen — der Betrieb muss
Grund haben (nach Probezeit)." Der Auszubildende braucht keinen **wichtigen** Grund, sehr wohl aber
einen Grund: § 22 Abs. 2 Nr. 2 BBiG setzt Berufsaufgabe oder Berufswechsel voraus, und § 22 Abs. 3
verlangt die **Angabe dieses Grundes**. Die als richtig markierte Antwort derselben Frage sagt es
korrekt („schriftlich und unter Angabe des Kündigungsgrundes") — die Distraktorerklärung
widerspricht ihr.
→ Vorschlag: „Auszubildende brauchen keinen *wichtigen* Grund, wohl aber den Grund der
Berufsaufgabe oder des Berufswechsels — und müssen ihn angeben."

### B7 · M08-111 — zwei Zusätze, die nicht im Gesetz stehen
§ 17 Abs. 7 BBiG verlangt, Mehrarbeit „besonders zu vergüten oder durch Freizeit auszugleichen".
Die Frage macht daraus zwei Aussagen, die das Gesetz nicht trägt:
* „Vergütung … **(Zuschlag, z. B. 25 %)**" — einen Zuschlagssatz nennt § 17 Abs. 7 BBiG nicht.
  „Besonders zu vergüten" heißt zusätzlich, nicht zwingend mit Zuschlag. → Prozentangabe streichen.
* „**Schriftlichkeit:** Die Regelung zu Überstunden muss im Ausbildungsvertrag oder einer
  Betriebsvereinbarung schriftlich geregelt sein." — Eine solche Pflicht gibt es nicht. § 11 BBiG
  verlangt die Angabe der täglichen Ausbildungszeit, keine Überstundenklausel. → Punkt streichen.

Dritter Punkt: Der `verweis` nennt „JArbSchG **§§ 8, 16**". **§ 16 JArbSchG ist die Samstagsruhe**
und hat mit Mehrarbeit nichts zu tun; einschlägig wären § 8 (Arbeitszeit) und § 21 (Ausnahmen,
Ausgleich). ✅ **BELEGT (WebSearch, 28.07.):** Die Frage behauptet, Mehrarbeit Jugendlicher sei „**in derselben
Woche**" auszugleichen. **§ 21 Abs. 2 JArbSchG gibt drei Wochen** („durch entsprechende Verkürzung
der Arbeitszeit innerhalb der folgenden drei Wochen"). Zudem gilt die Ausnahme nur für
**vorübergehende und unaufschiebbare Arbeiten in Notfällen**, wenn keine erwachsenen Beschäftigten
zur Verfügung stehen (§ 21 Abs. 1) — nicht für gewöhnliche Auftragsspitzen, wie die Frage nahelegt.
→ Korrektur: „innerhalb der folgenden drei Wochen (§ 21 Abs. 2 JArbSchG), und nur in Notfällen".

### B6 · M08-108 — zwei fragwürdige Sätze zur gestreckten Abschlussprüfung
Die Gewichtung 20 / 80 ist korrekt (und wird von `fakten_check.py` bewacht). Zwei Sätze der
`erklaerungLang` sind es nicht:
* „Ein schlechtes AP1-Ergebnis kann durch ein gutes AP2 **bis zu einem Punkt** korrigiert werden."
  Eine solche Punktekorrektur gibt es nicht. Was es gibt, ist die mündliche Ergänzungsprüfung in
  Teil 2 unter bestimmten Voraussetzungen. → Satz streichen oder auf die Ergänzungsprüfung umstellen.
* „Das ist eine **Besonderheit des IT-Berufs**" — die gestreckte Abschlussprüfung gibt es in vielen
  Ausbildungsberufen, und der Fragetext sagt das selbst („bei FiSi **und anderen Berufen**").
  Die Frage widerspricht sich in sich. → „in vielen modernen Ausbildungsberufen".

### B5 · M08-106 — der Betriebsrat ist nicht „neutral", und die Schwelle ist unvollständig
`erklaerungLang`: „Besonderheit: Der Betriebsrat ist **neutral** und nicht Partei einer
Gewerkschaft." Der Betriebsrat ist die **Interessenvertretung der Arbeitnehmer** — neutral ist er
gerade nicht. Richtig ist nur, dass er kein Gewerkschaftsorgan ist und nach § 2 BetrVG
vertrauensvoll mit dem Arbeitgeber zusammenarbeitet.
→ Vorschlag: „Der Betriebsrat vertritt die Arbeitnehmer, ist aber kein Organ der Gewerkschaft."

Zweiter Punkt: § 1 BetrVG verlangt **mindestens fünf ständige wahlberechtigte Arbeitnehmer,
von denen drei wählbar sind**. Die Frage nennt nur die Fünf-Personen-Schwelle.

Dritter Punkt: „die JAV für **unter 25-Jährige**" — **dritte Fundstelle** derselben ungenauen
Altersangabe nach M08-011 und M08-005. Korrekt: jugendliche Arbeitnehmer unter 18 **und**
Auszubildende unter 25. Die Angleichung sollte alle drei Fragen in einem Zug erfassen.

### B4 · M08-103 — drei verschiedene Paragrafen für dieselbe Aussage
Die richtige Antwort nennt „**§ 3 BUrlG**" für den Mindesturlaub, `distraktorErklaerungen[1]` nennt
„**§ 1 BUrlG**", der `verweis` ebenfalls „**BUrlG § 1**". Richtig ist **§ 3 BUrlG** (Dauer des
Urlaubs); § 1 BUrlG begründet nur den Anspruch dem Grunde nach.
→ Vorschlag: Distraktorerklärung und `verweis` auf § 3 BUrlG umstellen.

Zweiter Punkt: `distraktorErklaerungen[2]` sagt „JArbSchG § 19 Abs. 2 gewährt Jugendlichen
**mindestens 30 Werktage** Urlaub". Das gilt nur für unter 16-Jährige — die Staffelung lautet
30/27/25. Die richtige Antwort derselben Frage differenziert korrekt, die Distraktorerklärung nicht.

### B1 · M08-004 — die Paragrafenliste lässt die Freistellung aus
`erklaerungLang`: „Diese Regelungen finden sich vor allem in **§§ 13, 14, 17, 19 BBiG**."
Die Zuordnung enthält ausdrücklich „Freistellung für Berufsschule gewähren" — das ist **§ 15 BBiG**,
der in der Aufzählung fehlt. § 19 BBiG (Fortzahlung der Vergütung) kommt im Aufgabeninhalt dagegen
gar nicht vor. → Vorschlag: „§§ 13, 14, 15, 17 BBiG".

---

## C · SPRACHE, SCHREIBWEISE, KONSISTENZ

| Nr. | ID | Befund | Vorschlag |
|---|---|---|---|
| C1 | M08-613 | „kann frei zahlen und **urlaub** gewähren" | „Urlaub" |
| C2 | M08-203 | „schriftliche **Abmahnung(en)**" — Klammer-Plural | „eine oder mehrere schriftliche Abmahnungen" |
| C3 | M08-003 | Distraktorerklärung benutzt den Geviertstrich `—`, der Pool sonst `–` | poolweit erst prüfen (in M08 sind es laut Vorabscan 30+ Fragen) |

### B2 · M08-007 — die Kammer „genehmigt" keine Ausbildungspläne
`paare`: „Überwachung der Ausbildungsqualität und **Genehmigung von Ausbildungsplänen** → Kammer".
Die Kammer überwacht die Berufsausbildung (§ 76 BBiG) und trägt die Verträge ins Verzeichnis ein
(§ 34 BBiG). Der betriebliche Ausbildungsplan ist der Vertragsniederschrift beizufügen
(§ 11 Abs. 1 BBiG) — **genehmigt wird er nicht.**
→ Vorschlag: „Überwachung der Ausbildung und Führung des Verzeichnisses der Ausbildungsverhältnisse".

Nebenbefund: Zwei der fünf Paare zeigen auf dieselbe Institution, einmal als „Kammer (IHK/HwK)",
einmal als „Kammer/IHK-Ausbildungsberatung". Für eine Zuordnung ist das unnötig verwirrend.

### B3 · M08-008 — „Ausbildungsmittel" steht nicht in § 11 BBiG
Der Fragetext zählt die Mindestinhalte des Ausbildungsvertrags auf und nennt darunter
„**Ausbildungsmittel**". § 11 Abs. 1 BBiG verlangt Art, sachliche und zeitliche Gliederung, Ziel,
Beginn und Dauer, Ausbildungsmaßnahmen außerhalb der Ausbildungsstätte, tägliche Arbeitszeit,
Probezeit, Vergütung, Urlaub, Kündigungsvoraussetzungen und einen Hinweis auf Tarifverträge —
**Ausbildungsmittel gehören nicht dazu.** Deren kostenlose Bereitstellung ist eine Pflicht des
Ausbildenden nach § 14 Abs. 1 Nr. 3 BBiG, aber kein Vertragsmindestinhalt.
→ Vorschlag: „Ausbildungsmittel" durch „Dauer der Probezeit" ersetzen.

Nebenbefund: **Lücke 0 und Lücke 1 haben dieselbe Lösung** („Name und Anschrift"). Die zweite
Lücke prüft dadurch nichts Neues.

---

## D · GEPRÜFT UND OHNE BEFUND

* **M08-110 — die sauberste Frage des Moduls.** Sie trennt exakt, was in der Praxis ständig
  verwechselt wird: Freistellung für die Prüfung selbst (§ 15 Abs. 1 BBiG, für alle), Freistellung
  am Tag **unmittelbar davor** (§ 10 Abs. 1 Nr. 2 JArbSchG, **nur für Jugendliche**) und das
  Fehlen eines allgemeinen Anspruchs auf Lerntage (nur per Tarif- oder Betriebsvereinbarung).
  Beide Paragrafenangaben sind korrekt. **Als Vorlage für die Korrektur anderer Fragen geeignet.**
* **M08-105** — deckt sich mit dem belegten § 22 BBiG; Distraktor 3 („nur Auszubildende können
  kündigen") ist zu Recht als falsch markiert, der Betrieb kann außerordentlich kündigen.
* **M08-107** — Günstigkeitsprinzip korrekt, siehe A12.
* **M08-703 ist die Vorlage für A8/A18 UND für B5.** Zur JAV: „Die JAV hat **kein eigenes Recht**,
  Betriebsvereinbarungen zu schließen – sie **bringt ihre Anliegen über den Betriebsrat ein** und
  kann an dessen Sitzungen teilnehmen." Genau die Formulierung, die M08-011 und M08-605 fehlt.
  Zum Betriebsrat: „mindestens fünf ständigen wahlberechtigten Arbeitnehmern, **von denen drei
  wählbar sind**" — die vollständige Fassung des § 1 BetrVG, die M08-106 verkürzt.
* **M08-701** — Günstigkeitsprinzip zum fünften Mal korrekt, dazu die Tarifbindung sauber erklärt
  (Mitgliedschaft, Bezugnahmeklausel, Allgemeinverbindlicherklärung) und die Abgrenzung
  Gewerkschaft/Betriebsrat. Der Merksatz **„Günstiger geht immer, schlechter nie"** ist die
  knappste richtige Fassung im Modul.
* **M08-702 bestätigt A10 ein drittes Mal** („Nach der Probezeit steht dem Ausbildungsbetrieb keine
  ordentliche Kündigung offen") und ergänzt einen Punkt, den keine andere Frage hat: **Mit dem
  Bestehen der Abschlussprüfung endet das Ausbildungsverhältnis von selbst** (§ 21 Abs. 2 BBiG).
* **M08-700 liefert die Vorlage für A13/B3:** Option 1 nennt als Vertragsinhalt „Ausbildungsdauer,
  **tägliche Ausbildungszeit** und Vergütung", die `erklaerungLang` zählt § 11 BBiG vollständig und
  korrekt auf. **Genau die Fassung, die M08-008 und M08-109 fehlt.** Inhaltlich ohne Befund —
  nur die Optionsverweise („Option 0" … „Option 5") sind fragil.
* **M08-616** — Abgrenzung Flächen-/Firmentarifvertrag fachlich sauber, bis auf A20.
* **M08-115 — die sauberste Arbeitszeit-Frage des Moduls.** Alle fünf Paragrafen korrekt
  (§§ 3, 4, 5 ArbZG · §§ 8, 14 JArbSchG), Pausenstaffelung 30/45 Minuten richtig, Ruhezeit
  11 Stunden richtig — **und der Ausgleichszeitraum „sechs Kalendermonate oder 24 Wochen" steht
  ausdrücklich drin.** Damit widerlegt die Frage den fehlerhaften Merksatz aus M08-101 (A11)
  poolintern. ⚠️ Ihr `verweis` benutzt allerdings als einzige neben M08-030 das Modul-Format
  („Modul 08, Arbeitsschutz und Arbeitszeit") statt des Gesetzesformats.
* **M08-604 bestätigt A10 poolintern:** „Eine ordentliche Kündigung durch den Betrieb gibt es nach
  der Probezeit **NICHT** (§ 22 Abs. 2 BBiG) — bleibt nur die außerordentliche Kündigung aus
  wichtigem Grund." Genau das, was **M08-104** bestreitet („alle vier Varianten möglich").
  Der Pool weiß es also an zwei Stellen richtig und an einer falsch.
  ⚠️ Sprachlich hat M08-604 dennoch Mängel: „eine **verhaltensbedingter** Kündigung", „die
  Kündigung bei der Kammer **beschwert** werden" — beides in der `musterloesung`.
* **M08-601** — § 22 Abs. 2 Nr. 1 BBiG korrekt, Kostensparen zu Recht als unzureichender Grund
  dargestellt. Nur die eine Distraktorerklärung passt nicht (B10).
* **M08-112 — die beste Erklärung des Günstigkeitsprinzips im Pool.** Sie führt beide Richtungen
  vor (Tarif 30 / Vertrag 25 → 30 gilt; Tarif 30 / Vertrag 35 → 35 gilt) und nennt § 4 Abs. 3 TVG
  korrekt. **Vierte Fundstelle der richtigen Fassung** — die Korrektur von M08-613 kann sich
  wörtlich hieran orientieren.
* **M08-113** — die Beispielrechnung stimmt (6 h Unterricht + 1 h Weg = 7 h; zwei Schultage = 14 h;
  40 − 14 = 26 h Restarbeitszeit).
  ⚠️ **OFFEN, nicht abschließend geprüft:** Die pauschale Aussage „Berufsschulzeit **einschließlich
  Pausen und Wegezeit** wird vollständig angerechnet" ist möglicherweise zu grob — § 15 Abs. 2 BBiG
  differenziert nach Unterrichtstagen mit mehr als fünf Stunden und nach Blockunterricht.
  **Vor dem Korrekturlauf gegen den Gesetzestext prüfen.**

* **M08-030** — fachlich die stärkste Tarifrecht-Frage des Moduls, siehe A9. Distraktoren sauber
  begründet, Günstigkeitsprinzip korrekt und mit Gegenbeispiel („Stünden im Arbeitsvertrag 32 Tage
  …") erklärt.
* **M08-013** — §§ 3, 5, 12, 15, 16 ArbSchG alle korrekt zugeordnet, Rollenverteilung
  Arbeitgeber/Beschäftigte richtig dargestellt.
* **M08-012** — Duales System, ohne Befund.
* ⚠️ **EIN VERDACHT ENTKRÄFTET:** In M08-014 enthält `schluesselbegriffe.pflicht` einen String
  neben zwei Listen (`["unzulässig", [...], [...]]`), obwohl `START_PROMPT.md` das Feld als
  Liste von Listen beschreibt. **Poolweit nachgemessen: 11 Fragen bauen es so** (M01-007, M04-012,
  M04-106, M04-118, M04-322, M06-007, M06-114, M08-014, M08-112, M08-604, M09-126), und
  `validate_schema` sowie `test_freitext` laufen grün. **Das ist Bauart, kein Fehler.**

* **M08-001** inhaltlich (1 bis 4 Monate Probezeit) ✓ — nur die Absatzangabe ist falsch, siehe A1.
* **M08-002** § 22 Abs. 1 BBiG, fristlose Kündigung in der Probezeit von **beiden** Seiten ✓.
* **M08-003** § 22 Abs. 2 Nr. 2 BBiG (vier Wochen bei Berufsaufgabe/-wechsel), Schriftform und
  Grundangabe nach § 22 Abs. 3 BBiG ✓. Die Abgrenzung zu § 622 BGB („keine festen
  Kündigungstermine im BBiG") ist ausdrücklich gezogen und richtig.
* **M08-005** inhaltlich zur Schwelle: § 60 BetrVG, mindestens 5 jugendliche Arbeitnehmer bzw.
  Auszubildende unter 25 ✓ — der Befund A3 betrifft nur die zweite Hälfte der Frage.

---

## E · WAS ENTSCHIEDEN WERDEN MUSS

1. **A3 – M08-005:** Fragetext anpassen (klein) oder Antwort und Distraktoren um die Wählbarkeit
   erweitern (größer, aber prüfungsnäher)?
2. **A4 – M08-613:** Kernaussage in die Option, Begründung in die `erklaerungLang` — bestätigen.

---

## E · NUTZER-ENTSCHEIDE VOM 28.07.2026 — NICHT ERNEUT VORTRAGEN

1. **Längen: gemischt nach Faktor, Grenze bei 2,5.**
   **Ab 2,5** wird die richtige Antwort auf ihre Kernaussage gebracht, die Begründung wandert in
   die `erklaerungLang` — betrifft **10 Fragen**: M08-203 (5,88) · M08-613 (4,01) · M08-205 (3,82) ·
   M08-603 (3,35) · M08-605 (3,23) · M08-102 (3,21) · M08-107 (2,82) · M08-105 (2,69) ·
   M08-103 (2,68) · M08-106 (2,52).
   **Unter 2,5** werden die Distraktoren ausgebaut wie in M07 — betrifft **8 Fragen**: M08-601
   (2,46) · M08-609 (2,42) · M08-113 (2,10) · M08-005 (1,63) · M08-010 (1,59) · M08-201 (1,53) ·
   M08-101 (1,47) · M08-013 (1,35). Ziel wie in M07: **Gleichstand ±15 %, mindestens ein
   Distraktor strikt länger.**
2. **M08-005: Fragetext ändern** auf „… und wen vertritt sie?" — kleinster Eingriff, die
   vorhandene Antwort stimmt dann. Distraktoren bleiben unangetastet.
3. **`verweis`-Format: auf das Gesetzesformat vereinheitlichen.** M08-030 und M08-115 werden von
   „Modul 08, Abschnitt …" auf „BBiG § …, WiSo-Grundlagen: …" umgestellt — M08 stützt sich auf
   Gesetze, nicht auf Modulabschnitte.
4. **Alle vier Sprachpunkte kommen mit:**
   * **Fragile Optionsverweise** in M08-700 bis M08-703 → Optionstext zitieren statt Position.
   * **Firmennamen entfernen** — Siemens viermal, dazu VW, Telekom, Daimler, BMW in M08-204,
     M08-615, M08-616. (IG Metall und Südwestmetall bleiben: das sind die Tarifparteien.)
   * **JAV-Altersgrenzen angleichen** in M08-005, M08-011, M08-106, M08-608 — Vorlage ist
     M08-605 bzw. M08-703: „Arbeitnehmer unter 18 **oder** Auszubildende unter 25".
   * **Altbegriffe und Grammatik**: „Gehorsamspflicht" (M08-612), „Unlimited Weisungen"
     (M08-609), „verhaltensbedingter Kündigung" (M08-604) und die übrigen C-Punkte.
5. **Bereits erledigt (Einzelfreigabe):** M08-602 neu gebaut, siehe A16.

**Damit ist nichts mehr offen — der Korrekturlauf kann starten.**
Reihenfolge: **Inhalt (A1–A20) → Sprache → NEU MESSEN → Längen** → build → Drift 0 → Suiten.

---

## F · KORREKTURLAUF 28.07.2026 — ERGEBNIS

✅✅ **TELL IN M08: 18 → 0 von 23.** Poolweit **27 → 9 = 3,2 %** bei unverändertem Nenner 285.
**Kein Distraktor liegt über 1,15 ×** der richtigen Antwort — die Gegenprobe ist erstmals leer.

| Schritt | M08 | poolweit |
|---|---|---|
| vorher | 18 von 23 | 27 von 285 = 9,5 % |
| nach Inhalt + Sprache, vor dem Längenlauf | **18** (Faktoren verschoben) | – |
| nach dem Längenlauf | **0 von 23** | **9 von 285 = 3,2 %** |

⚠️ **FÜNFTE BESTÄTIGUNG: die Vorabmessung war nach dem Inhaltslauf überholt.**
M08-613 fiel von 4,01 auf 3,11, **weil die Korrektur des Günstigkeitsprinzips die Antwort kürzer
machte**. Umgekehrt stieg **M08-106 von 2,52 auf 2,85** und **M08-203 von 5,88 auf 3,67** — beide,
weil inhaltliche Ergänzungen („von denen drei wählbar sind", „eine oder mehrere schriftliche
Abmahnungen") die richtige Antwort verlängert haben.

⚠️ **UND DIE ZWEITE FALLE HAT WIEDER ZUGESCHLAGEN:** Beim Zurücknehmen zu langer Distraktoren
(M08-102, M08-103, M08-105) entstanden **drei neue Treffer**, weil die Kürzung zu weit ging.
Erst der dritte Messdurchgang war sauber. **Nach jeder Rücknahme neu messen — nicht nur nach dem
Ausbau.**

### Ein Wächter hat angeschlagen — und hatte recht

`test_freitext` meldete nach dem Lauf: „Themenfremde Musterlösung gilt nie als richtig —
durchgerutscht: **M08-012 ← M08-610**". Die Musterlösung zu den Ausbilderpflichten hätte bei der
Frage zum dualen System als richtig gegolten.

**Ursache war nicht der Wächter, sondern die Frage:** M08-012 verlangte als Pflichtbegriffe nur
„Ausbildungsbetrieb / Betrieb / Praxis" und „Berufsschule / Theorie" — beides steht zwangsläufig
auch in jeder Antwort über Ausbilderpflichten. Bei drei Pflichtgruppen und einer Schwelle von 65 %
genügen zwei Treffer.
→ **Behoben durch Schärfung der ersten Pflichtgruppe** auf „praktische Fertigkeiten / Praxis /
praktisch" — das ist der Aspekt, der das duale System ausmacht. Danach grün.
**Sechster Fall, in dem ein Wächter recht behalten hat.**

### Verifikation

`build_fragen.py` → 1073 Fragen / 9 Fälle · validate_pool OK · validate_schema OK · idcheck OK ·
fakten_check 0 Verdachtsfälle · **16 Suiten selbst gefahren, alle grün** (didaktik, meta, stufen,
abk, freitext, glossar, diagnose, engine, logik, registry, render_smoke, adaptiv, teilpunkte,
abruf, bereitschaft, matrix).
Diff: `pool_m08.json` (258 Zeilen), `pool_m07.json` (14 Zeilen — siehe unten), `fragen.js` gebaut.

### ⚠️ NACHTRAG ZUM M07-LAUF: A1 WAR NICHT ERLEDIGT

Beim Aufräumen der M08-Optionsverweise fiel auf, dass **die sieben M07-Fragen aus Befund A1 nie
korrigiert worden waren** — M07-028, M07-033, M07-042, M07-700, M07-704, M07-705, M07-706 trugen
weiterhin „Option 0" bis „Option 5" in der `erklaerungLang`. A1 war der **erste** schwere Befund
des M07-Berichts und stand im Umfang „Inhalt + Sprache", ist aber in keinem der Korrekturskripte
aufgetaucht.

**Jetzt erledigt:** Alle 11 betroffenen Fragen (7 aus M07, 4 aus M08) verweisen nicht mehr auf
Positionen, sondern zitieren den Optionstext — stabil gegen die Mischung durch `L.shuffle`.
**Poolweit bleiben 5 Fragen mit Positionsverweisen: M04-317, M05-700, M05-705, M05-706, M05-707.**
Sie gehören zum offenen Punkt 7 der Gesamtliste (M04/M05).

⚠️⚠️ **DAS IST DER ZWEITE FALL DIESER ART AN EINEM TAG** — nach M08-603, wo nur die
`erklaerungLang` korrigiert wurde und die Antwortoption stehen blieb. **Lehre: Nach einem
Korrekturlauf gegenprüfen, ob jeder A-Befund tatsächlich verschwunden ist — nicht darauf
vertrauen, dass er im Skript stand.**
