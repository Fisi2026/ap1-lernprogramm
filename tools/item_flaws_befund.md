# tools/item_flaws_befund.md – Item-Writing-Flaws im Pool (N50 Q1)

Stand 18.10.2026 · Werkzeug `tools/item_flaws.js` (Regeln nach Moore u. a. 2023, arXiv 2307.08161) · **Messung, kein Wächter, kein Eingriff in `pool/`.**
Pool: 1048 Auswahl-Einheiten (mc 491 · dropdown-Lücken 349 · mehrfach 134 · szenario2-Schritte 38 · bild 36; darin die mc-, dropdown- und mehrfach-Teilaufgaben der Fälle).
Aufruf: `node tools/item_flaws.js [--kurz|--json|--ziehe 20 --seed 1018|--min 0|--regel R2]` · `node tools/item_flaws.js --probe` (rc 1 bei Fehlurteil).

## 1. Zählung (gemessen)

| Regel | Befunde | davon „scharf“¹ | je Typ |
|---|---:|---:|---|
| R1 längste Option = richtig (Gleichstand zählt, Mindestlänge 25) | **147** | 66 | mehrfach 91 · szenario2 30 · dropdown 14 · mc 6 · bild 6 |
| R2 absoluter Begriff in richtiger Option | **161** | 43 | mc 88 · mehrfach 60 · dropdown 6 · szenario2 5 · bild 2 |
| R3 „keine/alle der genannten“ als Option | **1** | 1 | mc 1 (M02-018) |
| R4 Stammwort nur in der richtigen Option | **228** | 168 | mc 117 · mehrfach 88 · dropdown 15 · szenario2 5 · bild 3 |

¹ „scharf“ ist eine Zusatzspalte, die erst NACH der Handprüfung (Abschnitt 3) gebaut wurde; die Befundzahl der Regel bleibt die ungefilterte.
R2/R4 zählen je Option (eine Frage kann mehrfach auftauchen: M06-738 steht in der R2-Stichprobe zweimal, M07-028 in der R4-Stichprobe zweimal).

**R1 gegen Zufall** (Grundmenge = Einheiten mit längster Option ≥ 25 Zeichen und nicht alle gleich lang; Zufall = Σ richtige/Optionen):

| Typ | Grundmenge | Befunde | Zufall | Lesart |
|---|---:|---:|---:|---|
| mc | 450 | 6 (1,3 %) | 112 (25 %) | deutlich unter Zufall – der Pool ist hier bereinigt (Q1-Runde) |
| szenario2 | 36 | 30 (83 %) | 12 (33 %) | **echter Tell**, 2,5-fach über Zufall |
| dropdown | 39 | 14 (36 %) | 10,5 (27 %) | leicht darüber; mit `--min 0` 97 Treffer (Kurzoptionen, oft Zahlen/Begriffe) |
| mehrfach | 134 | 91 (68 %) | 81 (61 %) | kaum über Zufall (viele Optionen sind richtig) |
| bild | 10 | 6 | 2,5 | kleine Menge |

**Basisrate** (gleiche Regel auf FALSCHE Optionen angewandt – zeigt, ob die Regel richtige Optionen überhaupt anders trifft):
R2 mc: richtige 17,9 % (88/491) gegen falsche 32,7 % (482/1473); mehrfach 13,6 % (60/442) gegen 28,5 % (84/295) → Absolutbegriffe stehen **häufiger in Distraktoren**, wie Moore es beschreibt; die Regel „nicht in der richtigen“ hat aber kaum etwas zu fangen.
R4 mc: richtige 23,8 % (117/491) gegen falsche 28,6 % (421/1473); mehrfach 19,9 % gegen 25,8 %; dropdown 4,3 % gegen 3,7 % → **kein Gefälle richtig/falsch**: die Wortwiederholung trifft falsche Optionen genauso oft; R4 ist im Pool kein Tell.

## 2. Was der vorhandene Wächter schon prüft (gemessen)

`tests/test_didaktik.js` (läuft über die Auto-Glob-Suiten in `check.sh`; Schwelle `SCHWELLE_LAENGSTE` = 3,0 %) prüft **nur R1, nur `typ === "mc"`** (einschließlich der mc-Teilaufgaben der Fälle), Mindestlänge 25, Gleichstand zählt: Grundmenge **450**, Treffer **6** (M01-117, M03-001, M03-002, M03-020, M04-904, M07-008) = 1,33 %. `node tools/pool_query.js laengen` liefert dieselben 450/6; `item_flaws.js` liefert für mc ebenfalls 450/6 (Gegenprobe der beiden Werkzeuge).
Nicht geprüft: mehrfach (91 Treffer), szenario2 (30), dropdown-Lücken (14), bild (6) – **141 von 147 R1-Befunden liegen außerhalb des Wächters.** R2, R3, R4 prüft kein Wächter; `pool_query.js verrat` deckt nur Lösungswort-im-Text bei dropdown (verwandt mit R4, anderes Kriterium).

## 3. Handprüfung: 20 Befunde je Regel, Seed 1018

Ziehung: `node tools/item_flaws.js --ziehe 20 --seed 1018` (mulberry32, partielles Fisher-Yates auf der nach ID + Beleg sortierten Liste; wiederholbar). Jede Frage wurde mit Stamm und allen Optionen gelesen.
**Fehlalarm-Kriterien (vorher festgelegt):**
- R1: Fehlalarm, wenn (a) Vorsprung ≤ 5 Zeichen oder Gleichstand mit einer falschen Option, (b) mehr als 60 % der Optionen richtig sind (mehrfach: „die längste ist richtig“ ist dann ohnehin wahrscheinlich), oder (c) die Länge fachlich bedingt ist (Fachbegriff, Notation).
- R2: Fehlalarm, wenn ein Distraktor ebenfalls einen Absolutbegriff trägt (dann ist er kein Unterscheidungsmerkmal) oder der Begriff eine Sachaussage/Definition trägt (Quantor „alle Arbeitsplätze“, „nur die nötigen Daten“, „keine Installation“).
- R3: Fehlalarm, wenn die Option keine Sammel-Option ist.
- R4: Fehlalarm, wenn das Stammwort ein Allerweltswort ist oder durch das Präfix-Stemming (8 Zeichen) falsch zugeordnet wurde, oder wenn mehr als 60 % der Optionen richtig sind.

### R1 – Fehlalarmquote 16/20 = **80 %**

| Frage | Typ | Urteil | Grund |
|---|---|---|---|
| M06-402 | mehrfach | echt | 82 gegen 68 Z., 3 von 6 richtig |
| M07-405#s2 | szenario2 | Fehlalarm | Vorsprung 5 Z. (103/98) |
| M03-615 | mehrfach | Fehlalarm | 4 von 5 richtig |
| M05-461#l3 | dropdown | Fehlalarm | Fachbegriff „Kontinuierliche Verbesserung“, Vorsprung 6 Z., Distraktoren spiegeln ihn |
| M07-401 | mehrfach | Fehlalarm | 4 von 6 richtig |
| M04-210#l2 | dropdown | Fehlalarm | UML-Notation, nicht kürzbar |
| M04-027 | mehrfach | Fehlalarm | Gleichstand 57/57 |
| M05-402 | mehrfach | Fehlalarm | 4 von 6 richtig |
| M03-607 | mehrfach | Fehlalarm | 3 von 5 richtig (60 %) |
| M06-200 | mehrfach | Fehlalarm | Vorsprung 3 Z., 4 von 5 richtig |
| M03-232 | mehrfach | Fehlalarm | Vorsprung 4 Z. |
| M04-733 | mehrfach | Fehlalarm | Gleichstand 88/88 |
| M03-222 | mehrfach | Fehlalarm | 3 von 5 richtig |
| M08-700 | mehrfach | Fehlalarm | Vorsprung 1 Z. |
| M07-008 | mc | Fehlalarm | Vorsprung 1 Z., Aufzählung |
| M06-738 | mehrfach | Fehlalarm | 3 von 4 richtig |
| FALL-02-t4 | mehrfach | echt | 100 gegen 88 Z., 3 von 6 richtig |
| M06-053#s2 | szenario2 | echt | 101 gegen 75 Z., 1 von 3 |
| M07-229 | mehrfach | Fehlalarm | 3 von 5 richtig |
| M07-405#s1 | szenario2 | echt | 138 gegen 111 Z., 1 von 3 |

Auffällig: 12 der 20 sind `mehrfach`; dort sagt „längste = richtig“ wegen des hohen Richtig-Anteils fast nichts. Echt sind die Befunde mit wenigen richtigen Optionen und deutlichem Vorsprung – vor allem **szenario2** (drei der vier echten; 83 % gegen 33 % Zufall).

### R2 – Fehlalarmquote 20/20 = **100 %**

Alle 20 gezogenen Befunde sind Fehlalarme: in 19 Fällen tragen auch Distraktoren Absolutbegriffe (M06-080, M06-973, M05-101, M04-111, M04-041, M05-014, M03-483, M06-044, M03-228, M04-319, M03-207, M08-601, M06-212, FALL-03-t5, M06-021, M06-772, M03-615, M06-738 ×2), und fast immer ist der Begriff ein Quantor oder Teil der Definition („Least Privilege: nur die nötigen Rechte“, „RAID 0: alle Daten verloren“). M06-089 („trägt keine Daten“) ist die einzige Frage, in der kein Distraktor einen Absolutbegriff trägt – aber auch dort ist es eine Sachaussage. Die Regel in der Form „Absolutbegriff darf nicht in der richtigen Option stehen“ liefert in diesem Pool keinen Befund, der eine Änderung verdient. Moores Regel zielt auf Absolutbegriffe als Hinweis auf FALSCHE Optionen; das ist ein anderes Maß (Gefälle in der Basisrate oben: 32,7 % falsch gegen 17,9 % richtig).

### R3 – 1 Befund, Fehlalarmquote 0/1 (keine 20er-Stichprobe möglich)

| Frage | Urteil | Grund |
|---|---|---|
| M02-018 | echt | „Alle genannten sind mögliche Störquellen“ ist die richtige Option (Index 3 von 4) – klassischer „alle der obigen“-Fall |

Gegenprobe zur Vollständigkeit (Suche mit weiterem Muster: keine/alle/beide + davon/richtig/zutreffend/korrekt/falsch/genannt/obig): nur M02-018 und M06-301 (kein Treffer im Sinn der Regel). Der Pool enthält die Sammeloption praktisch nicht mehr.

### R4 – Fehlalarmquote 7/20 = **35 %**

| Frage | Typ | Urteil | Stammwort / Grund |
|---|---|---|---|
| M06-070 | mc | echt | „angeschlossen“ |
| M07-028 (Option 1) | mehrfach | echt | „Übergabe“, 3 von 6 richtig |
| M03-212 | mc | Fehlalarm | „liegt“ – Allerweltswort |
| M04-402 | mehrfach | Fehlalarm | „Server“ aus „DNS-Server“ gegen „DHCP-Server“ im Stamm |
| M06-747 | mc | echt | „eingebunden“ |
| M04-045 | mc | echt | „DNS-Server, Einstellung, ipconfig, nslookup“ |
| M03-721 | mc | echt | „Betriebssystem“ |
| M04-218 | mc | echt | „Bibliothek“ |
| M03-083 | mehrfach | Fehlalarm | 4 von 6 richtig |
| M05-601 | mc | echt | „Prozesse“ |
| M03-081 | mc | echt | „Access(-Port)“ |
| M04-060 | mc | Fehlalarm | „Geräten“ – Distraktoren schreiben „Geräte“, Präfix-Stemming (8 Zeichen) trennt die Endung |
| M03-077 | mehrfach | Fehlalarm | 3 von 5 richtig, „zentral/keine/daten“ Allerweltswörter |
| M08-115 | mehrfach | Fehlalarm | 3 von 5 richtig |
| M06-091 | mc | echt | „Platten, Spiegelpaar“ |
| M06-078 | mehrfach | echt | „abschalten“, 3 von 6 richtig |
| M07-028 (Option 3) | mehrfach | echt | „Übergabe“ (zweiter Befund derselben Frage) |
| M05-010 | mc | echt | „kontinuierlich“ |
| M06-462#l3 | dropdown | echt | „inkrementell“ steht im Lückentext – Lösungswort im Stamm (Verwandtschaft zu `pool_query.js verrat`) |
| M06-750 | mehrfach | Fehlalarm | 3 von 5 richtig |

Die echten Wiederholungen sind schwache Hinweise (ein Inhaltswort, das der Stamm vorgibt); die Basisrate (kein Gefälle richtig/falsch) zeigt, dass sie im Pool kein systematischer Tell sind.

### Nachträgliche „scharf“-Teilmenge – nicht unabhängig geprüft

Die Zusatzspalte „scharf“ wurde aus den Urteilen oben abgeleitet. In der **gleichen** Stichprobe liegen von R1 sechs Befunde in der Teilmenge (4 echt, 2 Fehlalarm = 33 %), von R2 einer (Fehlalarm), von R4 sechzehn (13 echt, 3 Fehlalarm = 19 %). Das ist eine Schätzung an denselben Daten, aus denen der Filter entstand – ein neuer Seed (`--seed`) auf der scharfen Teilmenge wäre die ehrliche Gegenprobe, bevor irgendein Wächter daraus wird.

## 4. Gegenprobe des Werkzeugs (`--probe`, gemessen)

41 gebaute Fälle, rc 0 nur bei 0 Fehlurteilen: R1 = 11 · R2 = 7 · R3 = 6 · R4 = 7 · „scharf“ = 10 · Ziehung = 1 (fester Seed, Reihenfolge unabhängig, mehr gewünscht als da, leere Liste). Je Regel mindestens vier Fälle, die rot sein MÜSSEN, und Grenzfälle (Länge 24/25, Gleichstand, alle gleich lang, „niedrig“ ≠ „nie“, „Allerdings“ ≠ „alle“, „Alle Mitarbeiter“ ≠ „alle genannten“, Stammwort nur im Distraktor, Stammwort mit anderer Endung, leerer Stamm). Die Probe lief vor dem ersten Lauf über den Pool.

## 5. Einordnung (Empfehlung zur Entscheidung, nicht umgesetzt)

| Regel | Befund | Vorschlag (Annahme, vom Nutzer zu entscheiden) |
|---|---|---|
| R1 | mc sauber; **szenario2 auffällig** (83 % gegen 33 % Zufall), dropdown leicht, mehrfach kaum über Zufall | Wächter nur für szenario2 (und evtl. dropdown) sinnvoll; mehrfach nur mit der „scharf“-Bedingung (≤ 60 % richtige Optionen, Vorsprung > 5 Z.) |
| R2 | 100 % Fehlalarm in der Stichprobe | nicht als Wächter; wenn überhaupt die Gegenrichtung (Absolutbegriffe als Hinweis auf falsche Optionen) neu fassen |
| R3 | 1 echter Befund (M02-018) | Einzelfall; die Sammeloption fehlt sonst im Pool – ein Wächter hätte nichts zu bewachen |
| R4 | 35 % Fehlalarm, aber kein Gefälle richtig/falsch | kein Wächter; als Lesehilfe bei der Fragenpflege brauchbar |

Offen: M02-018 ist nicht geändert (keine Pool-Änderung in diesem Auftrag).
