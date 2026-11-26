# BEFUNDE – Inhaltsprüfung M04 / M05 / M06 (begonnen 2026-08-26)

⚠️ **WOZU DIESE DATEI.** Etappe 3 hat M01, M02, M03, M07 und M08 Frage für Frage gelesen
(82 schwere Befunde). **M04, M05 und M06 kamen nur durch den Batch-Lauf aus Etappe 1** – also
nie durch dieselbe Einzelprüfung. Diese Datei führt die Befunde dieser Nachholrunde.
Verfahren wie gehabt: Vorabmessung → Batches → **jeden Sachbefund poolweit als Fehlerklasse
nachscannen** → Befunde vorlegen → Entscheide → EIN Lauf.

## VORABMESSUNG (26.08.)
| | M04 | M05 | M06 |
|---|---|---|---|
| Fragen | 187 | 67 | 111 |
| Themen | 11 | 6 | 11 |
| Längen-Tell (`pool_query.js laengen`) | **0 von 39** | **0 von 22** | **0 von 33** |
| überlange Distraktoren | 0 | 0 | 0 |

► **Der Längengriff hat hier sauber gearbeitet – die Längen sind kein Thema mehr.**
Gesucht wird nach den Fehlerklassen aus Etappe 3: Erklärung widerspricht der Antwort ·
Rechnung um Faktor 10 falsch · falscher Wert in `schluesselbegriffe` · Musterlösung zu einer
anderen Firma · **erfundene Gesetzeszitate · falscher Paragraf · falsche Absatzangabe** ·
Fachbegriff verdreht.

---

## BATCH 1 (26.08.) – M06 „TOM & Rechtsgrundlagen" (6) und „DSGVO & Datenschutz" (11)
17 Fragen einzeln gelesen. **2 Sachbefunde, 2 Sprachbefunde.** Jede Gesetzesstelle mit
`WebFetch` gegen dejure.org / lxgesetze.de / gesetze.legal geprüft – nicht aus dem Gedächtnis.

### B1 · M06-203 – **erfundenes Gesetzeszitat** (schwer)
`erklaerungLang` gibt in einfachen Anführungszeichen als Wortlaut von Art. 32 DSGVO aus:
> 'Der Verantwortliche und der Auftragsverarbeiter treffen Maßnahmen zu Sicherung der Daten
> unter Berücksichtigung des Stands der Technik, der Implementierungskosten und der Art, des
> Umfangs, des **Kontexts** und der Zwecke der Verarbeitung sowie des **Risikos unterschiedlicher
> Wahrscheinlichkeit und Schwere** für die Rechte und Freiheiten natürlicher Personen.'

**Der amtliche Wortlaut (Art. 32 Abs. 1 Satz 1) lautet:**
> „Unter Berücksichtigung des Stands der Technik, der Implementierungskosten und der Art, des
> Umfangs, **der Umstände** und der Zwecke der Verarbeitung sowie **der unterschiedlichen
> Eintrittswahrscheinlichkeit und Schwere des Risikos** für die Rechte und Freiheiten
> natürlicher Personen treffen der Verantwortliche und der Auftragsverarbeiter **geeignete
> technische und organisatorische Maßnahmen, um ein dem Risiko angemessenes Schutzniveau zu
> gewährleisten**; diese Maßnahmen schließen gegebenenfalls unter anderem Folgendes ein:"

Drei inhaltliche Abweichungen, dazu der Grammatikfehler „zu Sicherung". **Es ist eine Paraphrase
im Zitatgewand** – genau die Klasse, die in Etappe 3 mehrfach auffiel.

### B2 · M06-110 – **Ausnahme des Art. 33 DSGVO zu weit gefasst** (mittel)
`erklaerungLang`: „Die Frist beträgt 72 Stunden, **es sei denn, das Risiko für die Rechte und
Freiheiten ist gering**." Art. 33 Abs. 1 befreit aber nur, wenn die Verletzung „**voraussichtlich
nicht zu einem Risiko** für die Rechte und Freiheiten natürlicher Personen führt".
► **Ein geringes Risiko befreit gerade nicht** – der Satz macht aus einer engen Ausnahme eine
Ermessensfrage. 72 Stunden und Art. 34 sind richtig.

### B3 · M06-203 `distraktorErklaerungen[1]` – Sprache
„**DSGVO hat durchaus Ressourcen** — die Flexibilität ist bewusst gewählt." Der Distraktor
behauptet, den **Aufsichtsbehörden** fehlten die Mittel. Die DSGVO ist eine Verordnung und hat
keine Ressourcen. Gemeint und zu schreiben: „Die Aufsichtsbehörden haben durchaus Mittel …".

### B4 · M06-108 – Zahlen in Option und Erklärung gehen auseinander (klein)
Option: „'5 Kunden kauften Produkt X zwischen Januar und März'". `erklaerungLang` greift dasselbe
Beispiel auf als „'im Januar 100 Kunden kauften Produkt X'". Sachlich beides richtig, aber der
Lerner sucht die Verbindung.

### GEPRÜFT UND IN ORDNUNG (nicht erneut vortragen)
M06-003 (Art. 32 DSGVO, § 38 BDSG) · M06-006 (Frist 1 Monat, Art. 12) · M06-007 (Pseudonymisierung,
Art. 4) · M06-013 · M06-020 (Art. 15) · M06-104 · M06-108 (Art.-4-Zitat **wörtlich korrekt**) ·
M06-109 (Art. 28 AVV) · M06-204 · M06-403 · M06-702 (Art. 33, 72 h) · M06-732 (Art. 25 Abs. 2) ·
M06-751 · M06-773 · M06-774 (Art. 5 Abs. 2) · M06-940 (Marktortprinzip Art. 3).
⚠️ **M06-751 nennt das EU-US Data Privacy Framework – am 26.08. nachgeschlagen: der
Angemessenheitsbeschluss ist weiter in Kraft** (EuG T-553/23 vom 03.09.2025 hat die Klage
abgewiesen; Rechtsmittel C-703/25 P läuft). **Kein Befund, aber ein Verfallsdatum.**
⚠️ **M06-110 nennt in der Erklärung die „Ellerbrock Physiotherapie GmbH", die in der Frage nicht
vorkommt.** Das ist der am 25.08. geprüfte und für unbedenklich erklärte Fall „die Erklärung führt
die Firma selbst als Beispiel ein" – **kein Befund.**

---

## FEHLERKLASSEN-NACHSCAN (Schritt 3) – poolweit
**Klasse: Gesetzestext in Anführungszeichen.** Suchmuster
`(Art\. ?[0-9]+|§ ?[0-9]+)[^']{0,150}'[^']{60,}'` über das ganze Frage-Objekt: **5 Treffer im
gesamten Pool** – M06-108, M06-203, M08-603, M08-609, M08-614. Deutsche Anführungszeichen: 0.
**Drei der fünf sind defekt.**

### B5 · M08-609 – **Zitat existiert nicht + falscher Absatz** (schwer)
`erklaerungLang`: „Ausbildungsprinzip (**§ 14 Abs. 1 BBiG**): Der Ausbildungsbetrieb muss 'eine den
Anforderungen des Ausbildungsberufs entsprechende Berufsausbildung gewährleisten, die dazu führt,
dass der Auszubildende die Fertigkeiten, Kenntnisse und Fähigkeiten [...] erwirbt.'"
* **Diesen Satz gibt es in § 14 BBiG nicht.** Abs. 1 Nr. 1 lautet: „dafür zu sorgen, dass den
  Auszubildenden die berufliche Handlungsfähigkeit vermittelt wird, die zum Erreichen des
  Ausbildungsziels erforderlich ist …".
* **Die Vorschrift, um die es in der Frage geht, ist § 14 Absatz 3 BBiG:** „Auszubildenden dürfen
  nur Aufgaben übertragen werden, die dem Ausbildungszweck dienen und ihren körperlichen Kräften
  angemessen sind." Betroffen sind `erklaerungKurz`, `erklaerungLang` und der `verweis`.
* Belege: lxgesetze.de/bbig/14 und gesetze.legal/bund/bbig/14, beide am 26.08. abgerufen.
* ✅ § 10 Abs. 1 Nr. 2 JArbSchG (Freistellung am Vortag der schriftlichen Prüfung) ist **richtig**.

### B6 · M08-014 – **derselbe Absatzfehler** (schwer)
„Nach **§ 14 Abs. 2 BBiG** dürfen dem Auszubildenden nur Verrichtungen übertragen werden, die dem
Ausbildungszweck dienen" → **Abs. 3.** Abs. 2 regelt seit der BBiG-Novelle 2020 den
Ausbildungsnachweis.
⚠️ **M08-611 zitiert § 14 Abs. 2 BBiG für den Ausbildungsnachweis – das ist RICHTIG.**
**Nicht mitkorrigieren.** Die Mehrheit ist hier nicht die falsche Seite, aber auch nicht die
Regel: jede Fundstelle einzeln.

### B7 · M08-603 – **eine Korrektur vom 28.07., die nur zur Hälfte angekommen ist** (schwer)
`M08_PRUEFLISTE_GESETZE.md` Punkt 14 hält fest: § 623 BGB hat **keine Absätze**, Korrektur
„§ 623 BGB". **Angekommen ist das nur in der Antwortoption.** Im Pool stehen weiterhin:
* `distraktorErklaerungen[1]`: „§ 623 **Abs. 1** BGB schreibt Schriftform vor …"
* `distraktorErklaerungen[2]`: „§ 623 **Abs. 1** BGB verlangt ausdrücklich: ‚**Die Schriftform wird
  nicht durch elektronische Form ersetzt.**'" → **zweites erfundenes Zitat**; das Gesetz sagt
  „die elektronische Form ist ausgeschlossen".
* `erklaerungKurz`: „§ 623 **Abs. 1** BGB: …"
* `verweis`: „BGB § 623 **Abs. 1, Abs. 2** …" – nennt einen Absatz 2, den dasselbe Protokoll als
  erfunden benannt hat.
✅ Das lange Zitat in `erklaerungLang` ist **wörtlich korrekt**.
►► **DIE LEHRE:** Eine Korrektur gilt erst, wenn sie im Pool gemessen ist, nicht wenn sie im
Protokoll steht. **Vier von fünf Fundstellen haben vier Wochen überlebt.**

### B8 · M08-614 – **ungenaues Zitat des Art. 9 Abs. 3 GG** (mittel)
Pool: „'… Abreden, die dieses Recht einschränken oder **zu beeinträchtigen** suchen, sind nichtig.'"
Grundgesetz: „Abreden, die dieses Recht einschränken oder **zu behindern** suchen, sind nichtig,
hierauf gerichtete Maßnahmen sind rechtswidrig." Dazu ist Satz 1 umgestellt und der Nachsatz ohne
Auslassungszeichen weggelassen.

### KLASSE „Absatzangabe" – Zwischenstand
Alle 33 Fundstellen mit `Abs.` in M04/M05/M06 einzeln gelistet und geprüft: **kein Fehler.**
(Art. 5 Abs. 2, Art. 6 Abs. 1 lit. a/f, Art. 21 Abs. 2, Art. 25 Abs. 2 DSGVO · § 29 UrhG ·
§ 640 BGB · § 38 BDSG – alle korrekt.)
⚠️ **Die Fehler liegen in M08** – dort steht der Satz „die übrigen 23 Absatzangaben … habe ich
einzeln durchgesehen und halte sie für korrekt" (`M08_PRUEFLISTE_GESETZE.md`, Abschnitt F).
**Zwei davon sind falsch.** Durchsehen ist kein Nachschlagen.

---

## ENTSCHEIDE UND UMSETZUNG (26.08.)
**Nutzer-Entscheid: alle acht Befunde korrigieren; Wächter „ja, aber breiter" – also nicht nur
gegen Absatzangaben, sondern gegen jedes unbelegte Zitat.**

### Der Lauf (13 Einzeländerungen, 2 Pool-Dateien)
Nach dem START_PROMPT-Rezept: Blockgrenze je ID, **genau eine Fundstelle je Ersetzung** (sonst
Abbruch), `json.loads` als Syntaxprobe VOR dem Schreiben, Sicherung des ganzen Pools vorher.
Kein `json.load`/`json.dump`. Trockenlauf zuerst, dann `--setze`.
**Diff: 13 Zeilen in `pool_m06.json` und `pool_m08.json`, danach `build_fragen.py`, Drift 0.**

| Befund | Datei | was ersetzt wurde |
|---|---|---|
| B1 | M06-203 | Paraphrase → Wortlaut Art. 32 Abs. 1 Satz 1 DSGVO |
| B2 | M06-110 | „Risiko gering" → „voraussichtlich nicht zu einem Risiko … führt" |
| B3 | M06-203 | „DSGVO hat Ressourcen" → „Die Aufsichtsbehörden haben durchaus Mittel" |
| B4 | M06-108 | Beispiel in der Erklärung an die Antwortoption angeglichen |
| B5 | M08-609 | erfundenes Zitat → § 14 **Abs. 3** BBiG im Wortlaut (3 Stellen + `verweis`) |
| B6 | M08-014 | § 14 Abs. 2 → **Abs. 3** BBiG |
| B7 | M08-603 | 4 × „§ 623 Abs. 1" → „§ 623 BGB"; zweites erfundenes Zitat ersetzt; `verweis` ohne „Abs. 1, Abs. 2" |
| B8 | M08-614 | Art. 9 Abs. 3 GG im Wortlaut, „zu behindern", Nachsatz ergänzt |

### Der Wächter (check.sh 4e4 + `pool_query.js zitate` + `zitate_belegt.json`)
* **Teil A – Zitate:** Text in Anführungszeichen neben einer Paragrafen-/Artikelangabe **muss** in
  `zitate_belegt.json` stehen, mit Fundstelle, Quelle und Prüfdatum. Fehlt der Eintrag → FEHLER.
  **Das Skript prüft keinen Wortlaut – es verlangt, dass ihn ein Mensch einmal nachgeschlagen hat.**
  Umgekehrt meldet es auch Einträge, zu denen es keine Fundstelle mehr gibt.
* **Teil B – Absätze:** Vorschriften ohne Absatzgliederung (§ 623 BGB, § 20 BBiG, § 13 BBiG) mit
  einer Absatzangabe → FEHLER. Die Liste steht sichtbar in derselben Datei, mit Beleg und Datum.
* **Stand nach dem Lauf: 5 Zitate, alle belegt · 0 Absatzverstöße.**

### GEGENPROBE – dreimal rot, einmal grün
⚠️ **Nicht nur das Werkzeug, sondern auch die Verdrahtung in `check.sh` geprüft** – dort steckt der
`sed`-Ausdruck, der die Zahl aus der Ausgabe zieht. Ein Wächter, dessen Zahl nie ankommt, ist grün
aus dem falschen Grund. Alle Läufe mit `trap`-Wiederherstellung, Diff danach unverändert:
1. „§ 623 Abs. 1" in `fragen.js` zurückgedreht → **ROT** („Absatzangabe … (1)"), Frage namentlich.
2. M06-203 aus der Belegliste entfernt → **ROT** („1 unbelegt").
3. Eintrag ohne Fundstelle (M99-999) eingefügt → **ROT** („1 Eintraege ohne Fundstelle").
0. Ausgangslage → **GRÜN**.

### WAS DIESER BATCH GELEHRT HAT
⚠️⚠️ **DIE FEHLER LAGEN NICHT DORT, WO GESUCHT WURDE.** Der Auftrag war M04/M05/M06. Zwei der
17 gelesenen M06-Fragen waren defekt – **aber der Fehlerklassen-Nachscan brachte drei weitere
Befunde in M08**, einem Modul, das Etappe 3 bereits gelesen hatte und dessen Gesetzesstellen im
Juli eigens auf einer Prüfliste standen. **Schritt 3 des Verfahrens ist nicht die Kür.**
⚠️⚠️ **„EINZELN DURCHGESEHEN UND FÜR KORREKT GEHALTEN" IST KEINE MESSUNG.** Genau dieser Satz
steht in `M08_PRUEFLISTE_GESETZE.md`, Abschnitt F, über 23 Absatzangaben. **Zwei davon waren
falsch** – beide § 14 BBiG, beide durch die BBiG-Novelle 2020 verschoben (Abs. 2 → Abs. 3).
►► **Wer eine Absatzangabe prüft, ruft die Vorschrift auf. Ansehen ist nicht nachschlagen.**
⚠️ **UND DIE MEHRHEIT WAR WIEDER NICHT DIE FALSCHE SEITE:** M08-611 zitiert § 14 **Abs. 2** BBiG
für den Ausbildungsnachweis – das ist richtig und wurde NICHT mitkorrigiert. Drei Fundstellen
derselben Vorschrift, zwei falsch, eine richtig.

---

## BATCH 2 (26.08.) – M06 „Backup & Verfügbarkeit" (8) und „Verschlüsselung & Signaturen" (13)
21 Fragen einzeln gelesen. **5 Befunde, 2 davon schwer – und beide schweren stecken nicht im
Fachinhalt, sondern in den RECHENAUFGABEN.** Die Krypto-Fragen selbst sind in gutem Zustand;
M06-304 (TLS 1.3, ECDHE, PFS) ist der Maßstab, an dem die anderen gemessen wurden.

### B9 · M06-542 – **zwei unabhängig gezogene Variablen, im Text als eine Zeitspanne** (schwer)
`tage` (14/21/28) und `wochen` (2/3/4) werden **getrennt gewürfelt**, der Fragetext behauptet
aber „{tage} Tage ({wochen} Wochen)".
**Gemessen über 3000 Ziehungen: 1042 stimmig = 34,7 %.** Zwei von drei Aufgaben lesen sich als
**„28 Tage (2 Wochen)"** oder „14 Tage (3 Wochen)".
⚠️ **Und es ist nicht nur der Text:** Schritt 1 rechnet die Vollsicherungen über `tage`, Schritt 2
die Zahl der differenziellen Sicherungen über `wochen`. **Die Endsumme addiert zwei verschiedene
Zeiträume.** Bei 28 Tagen und 2 Wochen fehlen zehn differenzielle Sicherungen.
✅ **Entscheid 26.08.: `wochen` streichen, alles aus `tage` rechnen.** Schritt 2 lautet jetzt
`5*tage/7` – 5 Werktage je Woche. `tage` ist durch 7 teilbar, die Zahl bleibt ganzzahlig.
**Nachgemessen: 2000 Ziehungen, 0 ungültige oder negative Zwischenergebnisse, Beispiel
21 Tage → 15 differenzielle Sicherungen.**
⚠️ Der Merksatz versprach außerdem eine Speicherersparnis, die es bei **täglicher** Vollsicherung
nicht gibt. Er nennt jetzt den echten Zweck: **kürzerer RPO**, nicht weniger Speicher.

### B10 · M07-760 – **das Vorzeichen wird unterstellt** (schwer, aus dem Nachscan)
`sollk` 18–32 T€ und `istk` 16–35 T€ überlappen. Die Erklärung nennt das Ergebnis trotzdem fest
„**Kostenüberschreitung**". **Gemessen: 706 von 1500 Ziehungen (47 %) liefern eine negative
Abweichung** – dann steht dort „−10.500 EUR Kostenüberschreitung".
✅ Korrigiert: neutral „absolute Abweichung", und der Merksatz erklärt jetzt das Vorzeichen
(positiv = Überschreitung, negativ = Unterschreitung), statt es vorwegzunehmen. **Die Bereiche
bleiben, wie sie sind – beide Richtungen sind fachlich richtig und beide kommen in der Prüfung vor.**

### B11 · M06-113 – **veralteter Stand als vorbildlich** (mittel)
„…wird die **grüne Schlosses-Anzeige** in der Adressleiste gezeigt." Grammatisch kaputt und
fachlich überholt: **Chrome hat das Schloss mit Version 117 (2023) durch ein Einstellungs-Icon
ersetzt**, ausdrücklich weil es Vertrauenswürdigkeit suggerierte; grün war schon 2018/19 weg.
Dieselbe Klasse wie der TLS-Befund aus Etappe 3.

### B12 · M06-120 – **widerspricht M06-304 im selben Thema** (mittel)
M06-120 schloss mit „Der AES-Schlüssel wird mit RSA verschlüsselt … **Merke: Das ist Standard bei
TLS/SSL (HTTPS)**". M06-304 belegt zwei Fragen weiter, dass **TLS 1.3 genau diesen
RSA-Schlüsseltransport ersatzlos gestrichen hat**. Für PGP/GPG und S/MIME stimmt die Darstellung,
für TLS seit 2018 nicht mehr. **Zwei Fragen desselben Themas dürfen sich nicht widersprechen.**

### B13 · M06-113 und M06-503 – **veraltete Beispiel-CAs** (klein)
**Entrust** stand als Beispiel für eine bekannte, vertrauenswürdige CA – **Chrome und Mozilla haben
Entrusts TLS-Zertifikaten Ende 2024 das Vertrauen entzogen.** **Comodo** heißt seit 2018 **Sectigo**.
Beide ersetzt durch DigiCert / Let's Encrypt / Sectigo.

### GEPRÜFT UND IN ORDNUNG (nicht erneut vortragen)
M06-009 · M06-010 · M06-018 (20+40+60+80 = 200 GB nachgerechnet) · M06-052 (Kreuztabelle, alle
18 Felder geprüft) · M06-118 · M06-462 (RTO/RPO korrekt herum) · M06-701 (Großvater-Vater-Sohn) ·
M06-005 · M06-014 · M06-111 · M06-112 · M06-304 · M06-305 · M06-461 · M06-703 · M06-705 · M06-706.

## FEHLERKLASSEN-NACHSCAN (Schritt 3) – Rechenaufgaben
**Klasse: Variablen, die zueinander passen müssen, werden unabhängig gezogen.**
Alle **29 `rechenassistent`-Aufgaben** mit je 1500 Ziehungen durchgerechnet und auf negative oder
ungültige Zwischenergebnisse geprüft; zusätzlich alle Aufgaben mit ≥2 Variablen auf Textmuster
gesucht, die zwei Platzhalter gleichsetzen.
**Ergebnis: genau zwei Treffer – M06-542 (Kopplung im Text) und M07-760 (Vorzeichen).**
⚠️⚠️ **DIESE KLASSE IST DURCH LESEN NICHT ZU FINDEN.** Wer M06-542 einmal liest, sieht eine
stimmige Aufgabe – die Werte, die sie zerlegen, kommen erst beim Würfeln. **Randomisierte Aufgaben
muss man simulieren, nicht lesen.**
⚠️ M03-908 wurde von der Textsuche gemeldet („{anzahlAlt} Server mit **je** {wattAlt} W") und ist
ein **Fehlalarm** – dort sind die Variablen zu Recht unabhängig. Kandidatenfilter, kein Urteil.

---

## BATCH 3 (26.08.) – DER REST VON M06: 73 FRAGEN, SIEBEN THEMEN
Damit ist **M06 vollständig gelesen: 111 von 111.** 7 Befunde.
⚠️ **Die Fragen zu Incident Response, Schutzzielen, Härtung und BSI-Schutzbedarf sind durchweg
sauber.** M06-023, M06-024 und M06-053 formulieren die Ausnahme des Art. 33 sogar **richtig**
(„voraussichtlich kein Risiko") – also genau so, wie M06-110 sie am selben Tag falsch hatte.
►► **Der Pool belegt seine eigene Korrektur. Wer eine Formulierung sucht, findet sie oft im
Bestand, statt sie neu erfinden zu müssen.**

### B14 · M06-019 – **das Bild widerspricht der Lösung** (schwer)
⚠️ **GEMESSEN, NICHT GELESEN:** Das SVG wurde nach PNG gerendert und angesehen. Erst dabei fiel
auf, was im Quelltext nicht ins Auge springt:
* **Es ist keine Matrix.** Die drei Farbflächen sind **senkrechte Streifen über die volle Höhe** –
  die Schadenshöhe geht in die Farbe überhaupt nicht ein. Der Punkt liegt im roten Streifen,
  gleich auf welcher Höhe.
* **„Sehr hoch" steht bei y=40 AUSSERHALB der Zeichenfläche** (die bei y=50 beginnt).
* **„Normal" steht bei y=110 INNERHALB der oberen Zeile** – auf derselben Höhe wie der Punkt X
  (cy=100). Der Lerner liest neben X das Wort „Normal", die Lösung sagt „sehr hohe Schadenshöhe".
* Die x-Achsen-Beschriftungen überlappen den Achsentitel.
* `erklaerungLang` sagt „hohe Wahrscheinlichkeit (>50%)", die Legende sagt „Hoch (67-100%)".
✅ **Entscheid 26.08.: ersetzen.** Neu gezeichnet als **3×3-Matrix**, Farbe aus BEIDEN Achsen,
Achsenstufen (Normal / Hoch / Sehr hoch) neben ihren Zeilen, X oben rechts im roten Feld.
Antwort und Distraktoren unverändert. **Vorher/Nachher als PNG gerendert und verglichen.**
►► **EIN BILD PRÜFT MAN, INDEM MAN ES ANSIEHT.** Der Quelltext eines SVG verrät die Fehlstellung
von zwei Beschriftungen nicht. `cairosvg` rendert in zwei Zeilen – das ist billiger als jede
Diskussion darüber, was im Markup wohl gemeint war.

### B15 · M06-116 – **Fachbegriff verdreht** (schwer)
`distraktorErklaerungen[1]` nannte „Alle Verbindungen erlaubt, nur ausdrücklich Gefährliches
blockieren" das **„unsichere 'Whitelist'-Modell (nur Erlaubtes blockieren)"**.
Das ist das **Blacklist**-Modell (Allow by Default); „nur Erlaubtes blockieren" ergibt zudem
keinen Sinn. **Whitelist ist genau die richtige Antwort der Frage.**
**Dieselbe Klasse wie „RPO als RTO" aus Etappe 3.** ✅ Korrigiert.

### B16 · M06-004 – **dem BSI wird eine Zahl zugeschrieben, die es nicht nennt** (mittel)
„Mindestens 12 Zeichen ist nach **BSI-Empfehlung 2024** zeitgemäß." Das BSI nennt **acht Zeichen
bei vier Zeichenarten oder 20 bis 25 Zeichen bei zweien** (bsi.bund.de, abgerufen 26.08.).
✅ Die **Kernaussage der Frage ist richtig**: Der rein zeitgesteuerte Wechsel ist im IT-Grundschutz
gestrichen (**ORP.4.A23**). Korrigiert wurden die Zahl und die Jahresangabe.

### B17 · M06-202 – **unbelegte 90-Prozent-Zahl** (mittel)
„Statistiken zeigen: rund 90% der erfolgreichen Cyber-Angriffe beginnen mit Social Engineering."
Der Verizon Data Breach Investigations Report, aus dem solche Zahlen stammen, führt **rund 60 bis
62 %** auf den Faktor Mensch zurück – **und das schließt Fehler ein, nicht nur Social Engineering.**
✅ Ersetzt durch die belegte Größenordnung mit Quellenname, ohne Jahreszahl.

### B18–B20 · Kleinbefunde (alle korrigiert)
* **M06-301** nannte **LastPass** als vorbildlichen Passwort-Manager – 2022 kompromittiert.
  Ersetzt durch 1Password / Bitwarden / KeePass. Ebenfalls raus: „(BSI 2024)".
* **M06-302** sagte „mindestens zwei Faktoren" und drei Zeilen später „MFA nutzt alle drei".
* **M06-119**: „GESAMTSCHUTZBEDAARF" und „**Der** Notebook".

### EIN FEHLALARM, DEN ICH SELBST ERZEUGT HABE
In der Ausgabe von M06-103 sah die `erklaerungLang` nach zerschossenen Zeichen aus („███" statt
„•"). **Das war meine eigene Zeilenkürzung per `cut -c`, die ein Mehrbyte-Zeichen zerschnitten
hat.** Nachgemessen: **0 Ersatzzeichen (U+FFFD) im gesamten Pool und in allen Kern-Dateien.**
►► **Ein Anzeigefehler im eigenen Werkzeug ist kein Befund über den Pool.** Dieselbe Klasse wie
„binary file matches" – erst messen, dann melden.

---

## BATCH 4 (26.08.) – M04 „IP-Adressierung & Subnetting" (15), „DHCP & Netzwerkdienste" (11)
und die 21 `konsole`-Aufgaben aus „Konsolenbefehle & Fehlersuche" mitgeprüft.
**4 Befunde – und drei davon widerlegt der Pool selbst an anderer Stelle.**

⚠️⚠️ **DAS IST DIE AUFFÄLLIGSTE KLASSE DIESES TAGES: DER POOL WIDERSPRICHT SICH.**
Dreimal am selben Tag: M06-120 gegen M06-304 (RSA-Schlüsseltransport), M04-401 gegen M04-105
(Größe von 172.16.0.0/12), M04-005/M04-318 gegen M04-920 (wann die DHCP-Lease erneuert wird).
**In allen drei Fällen war eine Stelle richtig und die andere falsch** – niemand musste etwas
nachschlagen, es genügte, beide Stellen nebeneinander zu legen.
►► **Neues Werkzeug: `node tools/pool_query.js kontext <regex> [n]`** – wie `suche`, zeigt aber
die Fundstelle mit Umfeld. Genau dafür gebaut. **An einem Fall geprüft, dessen Antwort ich kannte**
(die Lease-Erneuerung), bevor er hier steht.

### B21 · M04-401 – **172.16.0.0/12 mit 65.000 Adressen** (schwer)
`erklaerungLang`: „10.0.0.0/8 für große Netzwerke (16 Mio. Adressen), 172.16.0.0/12 für mittlere
(**65.000**), 192.168.0.0/16 für kleine (65.000)."
**/12 sind 2^20 = 1.048.576 Adressen**, nicht 65.000 – Faktor 16 daneben. Und beide Bereiche mit
derselben Zahl anzugeben, macht den Satz auch didaktisch sinnlos.
✅ **M04-105 im selben Thema nennt „1.048.576 Adressen" – richtig.** Korrigiert auf 1.048.576
bzw. 65.536.

### B22 · M04-005 und M04-318 – **„bei 50 % der Restzeit"** (mittel, zwei Fundstellen)
Die DHCP-Lease wird nicht „bei 50 % der Restzeit" erneuert – das wäre ein Wert, der sich
fortlaufend selbst verschiebt –, sondern **nach der Hälfte der Lease-DAUER (T1)**, spätestens
bei **87,5 % (T2)**.
✅ **M04-920 sagt es korrekt:** „nach der Hälfte der Laufzeit (T1) … spätestens bei 87,5 Prozent
(T2)". Beide Fundstellen daran angeglichen.

### B23 · M04-516 – **die lange Erklärung widerspricht der kurzen** (mittel)
`erklaerungKurz`: „Dass ein CNAME auf einen Namen außerhalb der eigenen Zone zeigt, ist völlig
normal." `erklaerungLang` zwei Zeilen später: „Ein CNAME soll **nicht auf die eigene Zone**
verweisen, sondern **nur innerhalb der Zone** oder auf externe FQDNs" – ein Satz, der sich in
sich selbst widerspricht. ✅ Neu formuliert; zusätzlich „Die Zeile 3" durch „Die letzte Zeile"
ersetzt (die Zählung war 0-basiert und für den Lerner irreführend).

### B24 · M04-985 – **`-r` auf eine einzelne Datei** (mittel)
Der Auftrag lautete „Durchsuche **die Datei** /var/log/syslog **rekursiv**" – eine einzelne Datei
kann man nicht rekursiv durchsuchen; `-r` ist die Option für Verzeichnisse. Akzeptiert wurde
ausschließlich `grep -r …`, die naheliegende und fachlich richtige Eingabe `grep "ERROR"
/var/log/syslog` wäre **als falsch gewertet worden.**
✅ „rekursiv" gestrichen, **beide Formen akzeptiert**, Erklärung und Merksatz stellen jetzt klar,
wofür `-r` da ist. **Mit `L.gradeKonsole` gegengeprobt: beide Eingaben werden angenommen.**
⚠️ **Nebenbei gemessen statt vermutet:** `L.normBefehl` senkt die Schreibweise ab – dass in der
Akzeptanzliste „error" klein steht, während der Auftrag „ERROR" schreibt, ist deshalb **kein**
Befund.

### GEPRÜFT UND IN ORDNUNG (nicht erneut vortragen)
Alle Subnetz-Rechnungen selbst nachgerechnet: M04-002 (/26, 62 Hosts) · M04-003 (.135 → .128/26) ·
M04-101 (/27, 30 Hosts) · M04-102 (/25 = 126) · M04-103 (Broadcast .127) · M04-506 (/27 = 224) ·
M04-515 (erste Host = Netz+1) · M04-538 (alle vier Schritte) · M04-104/925/926/927 (IPv6) ·
M04-105/462. DHCP: M04-004 (DORA) · M04-207 · M04-317 (Option 42 ist der DHCP-Fehlalarm von
Abschnitt 3, weiter richtig) · M04-319 · M04-402 · M04-437 · M04-514 · M04-920.
**Die 21 `konsole`-Aufgaben sind bis auf M04-985 sauber** – Windows wie Linux, inklusive
iproute2, nmcli, ss, nbtstat und der Signalwahl bei `kill`.

---

## BATCH 5 (26.08.) – M04 „Programmiersprachen & Kontrollstrukturen" (44 Fragen)
**Der Befund ist, wie wenig zu finden war.** 3 Kleinbefunde, kein einziger Sachfehler in der Logik.

### WAS SELBST NACHGERECHNET WURDE
* **Alle 9 Schreibtischtests (`trace`) Zeile für Zeile von Hand nachvollzogen:** Fakultät (M04-941),
  Potenz (M04-949), Quersumme mit DIV/MOD (M04-951), Ziffernzerlegung (M04-947), Maximumsuche
  (M04-945), Tauschdurchlauf (M04-953), verschachtelte Verzweigung (M04-955), WIEDERHOLE-BIS
  (M04-943), wiederholte Addition (M04-903). **Jede Zelle jeder Tabelle stimmt** – einschließlich
  der Abbruchbedingungen und der 1-basierten Listenindizes.
* **Alle 16 `baukasten`-Gerüste gegen ihre Ziele gehalten** – Schleifenrahmen, zweiseitige und
  mehrfache Verzweigung, fußgesteuerte Schleife, Funktionskopf und RÜCKGABE, Feld-Summe,
  Zähler, Dreieckstausch. **Alle korrekt**, auch der Randfall in M04-054 (leere Liste → -1).
* **Alle 7 `fehlersuche`-Aufgaben:** `=` statt `==`, Off-by-one bei `i < 10`, Nutzung vor
  Initialisierung, Index 3 statt 2, Schleife bis 4 statt 5, `maximum = b` in beiden Zweigen,
  nicht behandelter Randfall der leeren Liste. **Alle Fehlerzeilen richtig gesetzt.**

### B25/B26 · M04-051 und M04-507 – **Zeilen 0-basiert benannt** (klein, aber irreführend)
M04-051: „In **Zeile 4** fehlt die Prüfung" – gemeint ist Index 4, der Lerner sieht dort Zeile 5.
M04-507 spricht sogar von „**Zeile 0**", die es für einen Menschen nicht gibt.
✅ **Der Pool zählt sonst 1-basiert:** M01-520 tut es, und M04-993/M04-994 schreiben zur Sicherheit
„Zeile 2 (Index 1)". Beide angeglichen. **Dritter Fall derselben Klasse an einem Tag** (nach
M04-516 „Die Zeile 3").

### B27 · M04-018 – Distraktorerklärung passt nicht zur Option (klein)
Ein nach 32 Zeichen abgeschnittener Variablenname sei „kein Fehler, sondern ein **Stilmerkmal**".
Das ist eine Beschränkung des Übersetzers. ✅ Neu formuliert.

### B28 · M04-115 und M04-116 – **falsches Themen-Etikett** → Thema umbenannt (Nutzer-Entscheid)
Beide Fragen behandeln Betriebssystem-Kernaufgaben bzw. Partitionieren/Formatieren/Installieren,
standen aber im Thema „Programmiersprachen & Kontrollstrukturen".
⚠️⚠️ **ZUERST GEMESSEN, DANN ENTSCHIEDEN – und die Messung hat den Verdacht halbiert:**
Poolweite Klasse „`verweis` zeigt auf einen im eigenen Thema seltenen Abschnitt": **68 Abweichler
grob, 20 nach dem engen Filter – davon sind 18 RICHTIG SO.** Die 18 Fragen des Themas, die auf
**4.7** zeigen, sind die Schreibtischtests und der PAP; das Thema deckt 4.6 UND 4.7 ab. Umgekehrt
zeigen fünf Fragen aus „UML & Schreibtischtest" auf 4.6. „Praxisszenarien" streut per Definition.
M04-026 verweist auf **1.3**, also modulübergreifend – laut Protokoll vom 24.08. Absicht.
✅ **Und die Verweise der beiden Fragen sind RICHTIG** – im Kursbuch nachgesehen: **4.3
„Bedarfsgerechte Software-Auswahl" hat den Unterabschnitt „Betriebssysteme"**, **4.1 enthält
„Installation und Einrichtung von Systemen"**. Falsch war allein das Etikett.
► **Nutzer-Entscheid 26.08.: Thema umbenannt statt Fragen verschoben** –
**„Programmiersprachen, Kontrollstrukturen & Systemgrundlagen"**. Keine ID, kein Modul, kein
Verweis ändert sich; das Etikett stimmt jetzt für alle 44 Fragen.
**Umfang: 45 Fundstellen in 4 Pool-Dateien, 2 in `logik.js` (`THEMA_RELEVANZ` und die
Gebiets-Tabelle), 3 in der Doku** – je Datei mit erwarteter Trefferzahl abgesichert, `json.loads`
vor dem Schreiben.
⚠️ **GEGENGEPROBT:** Ein einziger zurückgedrehter Datensatz macht **`validate_pool` (2 Probleme)
UND `validate_schema` (1 Verstoß)** rot. **Ein stehen gebliebener alter Themenname bliebe also
nicht unbemerkt** – das ist die Zusicherung, dass die Umbenennung vollständig war.

### BEOBACHTET, NICHT GEÄNDERT
**M04-113** („Erkläre: IDE", Stufe 1) verlangt als **Pflicht**begriff eines aus „Versionskontrolle /
Git / Build-Tools". Wer Editor, Compiler und Debugger nennt – die Kernantwort – fällt durch.
⛔ **Nicht angefasst:** Pflichtbegriffe speisen den Trennschärfe-Wächter `test_freitext`
(Grenze 60); START_PROMPT sagt „Pflichtbegriffe schärfen, Grenze nicht anheben". **Das ist ein
Nutzer-Entscheid, kein Nebenbei-Fix.**

---

## BATCH 6 (26.08.) – M04 „UML & Schreibtischtest" (31 Fragen)
**4 Befunde, davon zwei fachlich.** Damit ist M04 zu zwei Dritteln gelesen.

### WAS SELBST NACHGERECHNET WURDE
**Alle 12 Schreibtischtests dieses Themas Zeile für Zeile nachvollzogen:** Euklid mit
Subtraktion (M04-948, ggT 24/18 = 6), Fibonacci mit Hilfsvariable (M04-950), Wechselgeld gierig
mit DIV/MOD (M04-050, 27 Cent = 4 Münzen), laufender Mittelwert (M04-952), Minimumsuche
(M04-944), Countdown (M04-942), Quadratsummen (M04-956), Zeichenzählung (M04-954), Summen
(M04-901/940), Zähler für gerade Zahlen (M04-946), SOLANGE mit Subtraktion (M04-902).
**Jede Zelle stimmt.** Ebenso die 5 Baukasten-Gerüste und die Fehlersuche-Zeilen.
►► **Zusammen mit Batch 5 sind damit 21 von 21 Schreibtischtests des Pools nachgerechnet – ohne
einen einzigen Fehler.** Der Rechenteil dieses Pools ist in sehr gutem Zustand.

### B29 · M04-013 – **das ER-Modell ist keine UML-Diagrammart** (fachlich)
`erklaerungLang` begann mit „Die **vier UML-Diagrammarten**" und führte dann Use-Case-,
Klassen-, Aktivitätsdiagramm **und das ER-Modell** auf. Das ER-Modell stammt von Chen und ist
keine UML-Notation; das UML-Gegenstück für Struktur ist das Klassendiagramm.
⚠️ **Die Frage selbst war sauber formuliert** („Modellierungs- bzw. Diagrammarten") – erst die
Erklärung zieht das ER-Modell unter das UML-Dach. ✅ Korrigiert und Abgrenzung ergänzt.

### B30 · M04-503 – **Logik-Inversion, vom eigenen Datensatz widerlegt** (fachlich)
`erklaerungKurz`: „Die Bedingung `ergebnis != 10` wird **niemals wahr** und die Schleife läuft
endlos." Umgekehrt: Sie wird niemals **falsch** – deshalb läuft die Schleife endlos.
✅ **Die `erklaerungLang` derselben Frage sagt es zwei Zeilen später richtig** („0!=10 ist wahr").
**Vierter Fall der Klasse „der Datensatz widerspricht sich selbst" an einem Tag.**

### B31 · M04-109 – **zwei Distraktorerklärungen erfinden UML-Symbole** (mittel)
* „**Doppellinie** ist für Multiplizitäten" – eine Doppellinie kennt die UML nicht; Multiplizitäten
  sind Textangaben an den Linienenden.
* „Gefüllte Pfeilspitze zeigt Assoziation/**Komposition**" – die Komposition ist eine gefüllte
  **Raute**. Die `erklaerungLang` derselben Frage sagt das richtig.
✅ Beide neu formuliert. **Dieselbe Klasse wie „Whitelist" (M06-116) und „Stilmerkmal" (M04-018):
eine Distraktorerklärung, die eine Bedeutung erfindet, statt die Option zu widerlegen.**

### B32 · M04-119 – **ein Drittel des Bildes lag außerhalb der Zeichenfläche** (mittel)
⚠️ **GERENDERT, NICHT GELESEN.** Drei Defekte, alle erst im PNG sichtbar:
* **Die Beschriftung „zurück" steht bei `x='-30'`** – der viewBox beginnt bei 0. **Sie war nie zu
  sehen.**
* Der Rücksprung des „nein"-Zweigs läuft als `M 0 260 L 0 110 …` exakt auf der linken Kante und
  endet bei (50,110) im Nichts – **er führt nicht zur Aktion zurück**, die bei y=130..180 liegt.
* **Die Legende zeigt für „Entscheidung" ein Dreieck** (`points='250,435 265,425 265,445'`),
  während das Diagramm eine ordentliche Raute verwendet.
✅ Repariert: Rücksprung nach innen auf x=20 mit Pfeilspitze in die Aktion, „zurück" bei x=28,
Legende als Raute. **Diagramm, Antwort und Distraktoren unverändert.** Vorher/Nachher gerendert.

### B33 · M04-996 – dieselbe Sache, zwei Darstellungen (Nutzer-Entscheid: angleichen)
M04-996 und M04-563 zeigen beide „die drei Bereiche einer UML-Klasse". **M04-563 zeichnet ein
Rechteck mit zwei Trennlinien – richtig. M04-996 zeichnete drei getrennte, abgerundete Kästen** –
das liest sich wie drei Klassen. ✅ An M04-563 angeglichen; die Hotspot-Zonen bleiben unverändert
an ihren Koordinaten, geprüft: Zone 1 (10–44), 2 (50–84), 3 (90–124) liegen in den Feldern
10–47 / 47–87 / 87–124.

### GEPRÜFT UND IN ORDNUNG
M04-012 · M04-023 · M04-024 · M04-050 · M04-106 · M04-110 (Multiplizitäten) · M04-111
(include/extend) · M04-485 · M04-563 · M04-752 (Komposition 1 -- 1..*) · M04-901/902/940/942/944/
946/948/950/952/954/956 · M04-961/964/967/970/972.

---

## Batch 7 · M04 Rest (53 Fragen) – Lizenzen, ER-Modell, Lastenheft, WLAN/VPN, GUI, Praxisszenarien

**Damit ist M04 vollständig gelesen: 191 von 191 Fragen** – Konsolenbefehle 37, Programmier-
sprachen 44, UML 31, DHCP 11, Subnetting 15 und die 53 dieses Batches.

⚠️ **KORREKTUR AN DER EIGENEN VORABMESSUNG.** Die Tabelle oben nennt für M04 **187** Fragen;
`node tools/pool_query.js themen` zählt **191**. Die Rundensumme ist **369, nicht 365**. Die
Batch-Zahlen stimmen, nur der Nenner war zu klein. **Stand nach diesem Batch: 302 von 369.**

### B34 · M04-008 + M04-120 – **der Pool definiert „Pay-per-Use" zweimal gegensätzlich** (schwer)
**Fünfter und sechster Fall der Klasse „der Bestand widerspricht sich selbst" – erstmals über
Modulgrenzen hinweg.**
* **M03-713** (Lösung): „Die Kosten richten sich nach der **tatsächlichen Nutzung**, etwa nach
  Rechenzeit oder Zahl der Auswertungen." Distraktorerklärung derselben Frage: „Für eine feste
  Monatspauschale … **Das ist ein Abonnement**." **M03-714** sagt dasselbe.
* **M04-008** paarte in der Zuordnung „Pay-per-Use" mit **„Monatliche/jährliche Gebühr für
  Software-Zugang (z. B. Microsoft 365)"** – also genau mit dem Gegenbeispiel aus M03-713.
  Die `erklaerungLang` setzte zusätzlich Pay-per-Use mit **SaaS** gleich; SaaS ist eine
  Bereitstellungsform, kein Abrechnungsmodell.
* **M04-120** nannte Microsoft 365 Enterprise zweimal „Pay-per-Use".
✅ **Nutzer-Entscheid: linke Seite umbenennen.** M04-008 paart jetzt „Subskription
(Abo-/Mietlizenz)" mit der Monatsgebühr – Microsoft 365 bleibt als Beispiel richtig, und der
Begriff Pay-per-Use bleibt M03-713/714 vorbehalten, wo er korrekt erklärt ist. Die
`erklaerungLang` grenzt beide Modelle jetzt ausdrücklich voneinander ab.

### B35 · M04-308 – **m:n-Auflösung ist nicht die 3. Normalform** (fachlich)
`Merke: Das Auflösen von m:n ist die Standard-Normalisierung (**3. Normalform**) in relationalen
Datenbanken.` Das Auflösen einer m:n-Beziehung ist die **Überführung des ER-Modells ins
relationale Modell** – sie ist immer nötig, weil das Relationenmodell m:n nicht abbilden kann.
Die 3. Normalform betrifft dagegen transitive Abhängigkeiten von Nichtschlüsselattributen.
✅ Merksatz auf „zwei 1:n-Beziehungen über eine Zwischentabelle" umgestellt. **Antwort und
Distraktoren unverändert** – die Frage selbst war richtig.

### B36 · M04-205 – **Distraktorerklärung erfindet eine Bedeutung** (klein)
„Primärschlüssel darf NICHT null sein — **das wäre ein Fremdschlüssel**." Ob ein Feld NULL
enthalten darf, entscheidet nicht darüber, ob es ein Fremdschlüssel ist; ein Fremdschlüssel
verweist auf den Primärschlüssel einer anderen Tabelle und **darf** je nach Modellierung NULL sein.
✅ Neu formuliert. **Vierter Fall derselben Klasse** nach „Whitelist" (M06-116), „Stilmerkmal"
(M04-018) und „Doppellinie" (M04-109).

### B37 · M04-735 – **die Bewertung passt nicht zur Aufgabenstellung** (mittel)
Die Frage nennt vier Mängel und verlangt eine Antwort **„zu drei der vier"** – freie Wahl. Die
`schluesselbegriffe.pflicht` erzwingen aber genau Mangel 1 **und** Mangel 2
(Selbstbeschreibungsfähigkeit · Barrierefreiheit · Stern/Legende).
⚠️ **In `app_util.js` nachgelesen, nicht vermutet:** `gradeTeilpunkte` vergibt „richtig" nur bei
`pTreffer === pflicht.length` – **alle** Pflichtgruppen. Wer die laut Aufgabe erlaubten Mängel
2, 3 und 4 bearbeitet, trifft höchstens zwei Gruppen und landet bei 40 % → „unvollständig".
**Eine vollständig richtige Antwort war als falsch bewertbar.**
✅ **Nutzer-Entscheid: alle vier Mängel verlangen.** Aufgabenstellung auf „zu allen vier Mängeln"
geändert, die Vorbemerkung „Drei Mängel genügen" aus der Musterlösung entfernt. Die Musterlösung
deckte ohnehin alle vier ab; Pflichtbegriffe und Trennschärfe bleiben unverändert.

### B38 · M04-120 – **„jederzeit kündbar, keine Strafzahlungen"** (fachlich)
`Microsoft 365 Enterprise ist ein Abo … und **jederzeit kündbar – keine Sperrfrist, keine
Strafzahlungen**.` Enterprise-Abos werden regelmäßig mit **Jahreslaufzeit** abgeschlossen; die
Kündigung wirkt dann zum Laufzeitende, nicht sofort. Nur die monatliche Laufzeit ist zum
Monatsende kündbar.
✅ Auf Laufzeitende umgestellt, Kündigungsfrist benannt. Die Kernaussage der Frage – die Migration
ist **rechtlich zulässig** – bleibt unverändert richtig.

### B39 · M04-120 – Visio-Zeichnungen sind keine CAD-Dateien (klein)
„Die **CAD-Dateien** müssen konvertiert werden (*.vsd zu *.odg) … (CAD = Computer Aided Design,
rechnergestütztes Konstruieren)." Die Frage selbst spricht von **Ablauf- und Netzplänen** aus
einer Diagramm-Software. ✅ Auf „Visio-Zeichnungen" geändert, `*.vsdx` als heutiges Format ergänzt.

### B40 · M04-114 – SAP Fiori auf einem Odoo-Stack (klein)
Der Hybrid-Vorschlag „Open Source für das Backend, **SAP Fiori für das Frontend**" ist technisch
nicht umsetzbar: Fiori ist die Oberflächenschicht von SAP und setzt SAP-Backends voraus.
✅ Durch eine tragfähige Zwischenlösung ersetzt (quelloffenes ERP als Basis + zugekaufte Module +
Wartungsvertrag mit Implementierungspartner).

### B41 · M04-117 – Tippfehler und alternde Jahreszahlen (klein)
„Lastenheft **definiertanforderungen**" (fehlendes Leerzeichen) sowie „Zeitrahmen: **Q2 2024**" /
„Go-Live **Juli 2024**" in einem Lernmittel für die Prüfung 2026.
✅ Tippfehler behoben, Jahreszahlen durch relative Angaben ersetzt („zweites Quartal des
Folgejahres", „drei Monate nach Auftragserteilung"). **Gleiche Klasse wie Entrust/Comodo/
LastPass** – Beispiele, die mit der Zeit falsch werden.

### GEPRÜFT UND IN ORDNUNG
* **GUI-Entwurf & Software-Ergonomie (5):** M04-731 · M04-732 · M04-733 · M04-734 · M04-735
  (nur die Bewertungslücke, s. B37). Die sieben Grundsätze der ISO 9241-110 sind in allen fünf
  Fragen einheitlich und richtig zugeordnet.
* **WLAN & VPN (6):** M04-007 · M04-112 · M04-313 · M04-314 · M04-315 · M04-316. WPA2-PSK vs.
  Enterprise/RADIUS, Site-to-Site, IPSec-Reihenfolge (IKE/Diffie-Hellman → AES → SHA), Zero Trust.
* **Praxisszenarien (11):** M04-015 (Prüfschritte decken sich mit den drei Pflichtgruppen) ·
  M04-017 · M04-019 · M04-025 · M04-026 · M04-118 · M04-439 · M04-702 · M04-923 (+ B37/B39/B41).
* **M04-118 nachgerechnet:** 256 ÷ 4 = 64 → Blockgröße 64, 2^6 = 64 → /26, 64 − 2 = 62 Hosts,
  Netzadressen .0/.64/.128/.192, Broadcasts .63/.127/.191/.255. **Alle Werte stimmen.**
* **Kein Befund, obwohl es nach einem aussah:** M04-923 hat `feedback1`, aber kein `feedback2`.
  **Gemessen statt vermutet:** alle 17 `szenario2`-Fragen im Bestand haben nur `feedback1`, und
  `logik.js` verlangt in der Strukturprüfung auch nur dieses eine Feld. Kein Fehler, sondern das
  Schema.

### NACHTRAG ZU B34 · der Wächter hat die Korrektur gefangen
`test_wirtschaft` prüft, dass **Pay-per-Use in ≥ 4 AP1-Fragen** belegt ist (Katalog-Stichwort aus
der Lernstoff-Lücken-Runde). Nach der Korrektur waren es 3 – **weil M04-120 den Begriff falsch
benutzt hat und der Zähler die falsche Verwendung als Abdeckung mitgezählt hatte.**
⛔ **Schwelle nicht gesenkt.** Stattdessen die Abgrenzung „Abo = fester Betrag je Zeitraum,
Pay-per-Use = nach tatsächlicher Nutzung" in M04-120 ergänzt, also genau dort, wo die
Verwechslung entstanden ist. Danach `check.sh block`: **ALLES GRÜN, 44 von 44.**

---

## Etappe III · M05 vollständig gelesen (27.08.2026) – 67 von 67

**Vorabmessung:** Längen-Tell **0**, überlange Distraktoren **0**. Sechs Themen: PDCA & KVP 18 ·
Testprotokoll 13 · QM-Begriffe & Normen 10 · Qualitätskosten 10 · QM-Prozesse 9 · Audit 7.

### B50 · Die Zehnerregel steht im Pool in vier verschiedenen Zahlen (mittel)
Poolweit nachgescannt, sechs Fundstellen:
* **M05-014:** Planung 1× · Entwicklung 10× · Test 100× · **Kunde 1000×**
* **M05-201:** Anforderung 1× · Entwicklung 10× · **Kunde 100×**
* **M05-102 / M05-307:** „1 € Prävention spart **10 €**"
* **M05-402:** „1 € Prävention spart **5–10 €**"
* **M05-308:** Reklamation „**ca. 10× teurer**" – ohne Bezugsgröße
⚠️ **M05-201 ist eine Rechenaufgabe, in der die Zahl die Antwort ist.** Wer M05-014 gelernt hat,
rechnet für „beim Kunden" mit 1000× und liegt falsch.
►► **Beide Fassungen sind für sich richtig** – der Faktor multipliziert je Phasenübergang, und wie
viele Phasen man zählt, hängt vom Prozessmodell ab. **Keine der Fragen sagte das dazu.**
✅ **Nutzer-Entscheid: jede Frage nennt ihre Phasen.** M05-014 „bei dieser Zählung mit vier Stufen",
M05-201 „hier mit drei Stufen gerechnet", M05-308 bekommt seine Bezugsgröße („so teuer wie dieselbe
Nacharbeit im eigenen Haus"), M05-402 auf „etwa 10 €" vereinheitlicht. **Der Merksatz von M05-014
sagt jetzt die Regel statt einer Endzahl.**

### B56 · M05-306 – der Bewertungsschlüssel passt nicht zur eigenen Musterlösung (mittel)
Aufgabe: „Nennen Sie **mindestens 3** Gründe." Pflichtgruppe 3 verlangte
„Abnahme / **Rechnungsstellung** / Kunde" – die Musterlösung nennt als dritten Grund aber
**„Audit- und Compliance-Sicherheit"**. Wer drei Gründe direkt aus der Musterlösung nimmt, fällt durch.
⚠️ **„Rechnungsstellung" kommt im ganzen Datensatz sonst nicht vor** – ein verwaister Suchbegriff.
✅ **Nutzer-Entscheid: Pflichtgruppe richtigstellen** auf „Audit / Compliance / Nachweis / ISO 9001".
Anders als bei M04-735 war hier **nicht die Aufgabenstellung** das Problem.
►► **Zweiter Fall der Klasse „Aufgabenstellung und Bewertungsschlüssel driften auseinander"** –
und der erste, den der Vorab-Scan vom 27.08. richtig vorhergesagt hat.

### B51–B55, B57–B59 · acht Kleinbefunde, alle korrigiert
* **M05-303:** „Kleinere Betriebe … folgen oft sogar **strengeren** Kriterien" – unbelegt. Die Norm
  gilt größenunabhängig; sie wird auf den Umfang angewendet, nicht danach gestaffelt.
* **M05-402:** „**Preventive** Costs" – der Fachbegriff heißt Prevention Costs (M05-307 richtig).
* **M05-105:** „**CEO**-Arbeitsplatz" und „Executive-Arbeitsplätze" in einer **Pflegeheim-gGmbH**.
  Ersetzt durch die Heimleitung. Klasse „das Beispiel passt nicht zum Betrieb".
* **M05-301:** „vorab **erkennt**" (Tippfehler) und „Check-Phase (auch **Controll**-Phase genannt)" –
  diesen Namen gibt es nicht; Deming selbst nannte die Phase „Study" (PDSA). Zusatz gestrichen.
* **M05-005:** „**Office 365**" – heißt seit 2020 Microsoft 365, **und M04 schreibt es bereits so.**
* **M05-204:** „**Protolokolle**" · **M05-501:** „**Installativer** Test" (kein Fachbegriff) ·
  **M05-311:** „**Korrektionen**" statt Korrekturen.

### GEPRÜFT UND IN ORDNUNG
* **PDCA & KVP (18):** die vier Phasen sind über alle 18 Fragen identisch definiert. **Beide
  Schaubilder geometrisch geprüft** – M05-009 (Pfeile PLAN→?→CHECK→ACT, „?" ist zwingend Do) und
  M05-487 (vier Kreise, Nummern 1–4, Pfeile im Kreis). Alle Koordinaten im viewBox.
* **QM-Prozesse (9):** die Zuordnung Plan/Do/Check/Act ↔ Planung/Lenkung/Sicherung/Verbesserung
  ist über fünf Fragen wortgleich konsistent.
* **QM-Begriffe & Normen (10):** ISO 9000 gegen ISO 9001, 3 Jahre, jährliche Überwachungsaudits,
  QM gegen QS – über sechs Fragen widerspruchsfrei.
* **Testprotokoll (13):** fachlich durchweg sauber. **M05-963 zitiert § 640 BGB korrekt** – als
  Verweis auf die Abnahme, ohne einen Wortlaut zu behaupten, also kein Fall für den Zitat-Wächter.
* **Audit & Prüfverfahren (7):** intern/extern, Verifizierung/Validierung, Stichprobe/Vollprüfung.
