# BEFUNDE LERNUNTERLAGE – Etappe VI (Qualitätsrunde Q2)

**Pilotdatei:** `03_IT-Systeme_Hardware_Wirtschaftlichkeit.md` (616 Zeilen, 34 Abschnitte)
**Gelesen:** 31.08.2026, 616 von 616 Zeilen, alle Abschnitte einzeln.
**Verfahren:** `PLAENE.md`, „GESAMTPLAN QUALITÄTSRUNDE Q2", Etappe VI. Nutzer-Entscheide 7–9.
**Nummernkreis:** fortlaufend nach `docs/befunde/BEFUNDE_FAELLE.md` (endete bei B89).

⚠️ **Als Stichprobe deklariert, nicht als Hochrechnung.** Über die restlichen sieben Kursdateien
sagt diese Datei nichts – die Entscheidung darüber fällt nach der Trefferquote (Plan, Etappe VI).

---

## STAND: 10 BEFUNDE, ALLE ENTSCHIEDEN UND KORRIGIERT (31.08.2026)

Vier gebündelte Nutzer-Entscheide am 31.08., danach **EIN** Korrekturlauf. Prüflauf danach:
`check.sh block start|weiter|weiter|ende` → **ALLES GRÜN**, 45 von 45 Suiten, Drift 0.

| Nr | Fehlerklasse | Fundstelle | Entscheid und Umsetzung |
|---|---|---|---|
| B90 | Verweisziel ohne Inhalt | 03#181 Cloudlösungen | ✅ **Abschnitt geschrieben**: Treppe IaaS → PaaS → SaaS als Tabelle, DaaS als Sonderfall |
| B91 | Verweisziel ohne Inhalt | 03 Abschnitt 3.4 | ✅ **neuer Abschnitt „Total Cost of Ownership (TCO)"** mit Phasentabelle, Formel, Rechenbeispiel |
| B92 | falscher `verweis` | M03-772 | ✅ 3.1 → **3.4**, über `tools/verweis_setzen.py --batch` |
| B93 | Bestand widerspricht sich (Modulgrenze) | 02#68 / 03#492 / 99#75 / M03-772 | ✅ **Formel ergänzt**: `+ Entsorgung`, in Kursdatei UND Spickzettel |
| B94 | Widerspruch Unterlage ↔ Pool | 03#244, 99#69 | ✅ **6 GHz zu Wi-Fi 6E gezogen** (Pool ist der geprüfte Stand), beide Stellen |
| B95 | Fachbegriff verdreht | 03#32, M03-018 | ✅ **CPU = Rechenwerk + Steuerwerk**, beide Stellen; Anker in `begriffe_belegt.json`, **gegengeprobt** |
| B96 | Lücke gegen den Pool | 03#244, 99#69 | ✅ **Wi-Fi 7 (802.11be) ergänzt**, Kursdatei und Spickzettel |
| B97 | falsches Beispiel | 03#159 | ✅ **MS Office und LibreOffice getrennt** (Excel fehlte) |
| B98 | alterndes Beispiel | 03#215, M03-001 | ✅ **192.0.2.1 (RFC 5737)** statt einer echten Adresse – kann per Norm nicht altern |
| B99 | alternde Rechtslage | 03#306 | ✅ **BFSG (seit 28.06.2025) aufgenommen**, „stattdessen" → drei getrennte Rechtsgrundlagen |

⚠️ **M03-612 im Pool blieb unangetastet.** Der Satz „die BITV bindet nur öffentliche Stellen des
Bundes" ist **richtig** – er wird durch das BFSG nicht falsch, nur unvollständig als Gesamtbild.
Eine Frage anzufassen, deren Aussage stimmt, wäre eine Korrektur ohne Befund.

---

### B90 — IaaS und PaaS kommen in KEINER Kursdatei vor
**Fehlerklasse:** Verweisziel ohne Inhalt (die Klasse, für die Etappe VI angelegt wurde).
**Messung:** `grep -c "IaaS\|PaaS" 0*.md 99_Spickzettel.md` → **0 in allen neun Dateien.**
**Dagegen im Pool:** fünf Fragen, alle mit `verweis` auf Modul 03, Abschnitt 3.1 –
M03-015, M03-021 („Ordnen Sie den drei Cloud-Servicemodellen zu…"), M03-110, M03-207, M03-601.
**M03-601 nennt die Begriffe im Verweistext ausdrücklich:** „Modul 03, Abschnitt 3.1 –
Cloud Computing Modelle: IaaS, PaaS, SaaS".
**Was der Lerner erlebt:** Frage falsch → Verweis anklicken → Abschnitt 3.1 „Cloudlösungen"
führt **nur SaaS und DaaS**. Die beiden Begriffe der Frage stehen nirgends.
⚠️ Der `verweis`-Wächter kann das nicht finden – er prüft, ob der Abschnitt existiert.
**Entscheidungsbedarf:** Abschnitt „Cloudlösungen" um die Servicemodell-Treppe
IaaS → PaaS → SaaS ergänzen (mit DaaS als Sonderfall daneben)?

### B91 — TCO hat in Abschnitt 3.4 keinen Inhalt
**Fehlerklasse:** Verweisziel ohne Inhalt.
**Messung:** `TCO` steht in `03_*.md` nur in Zeile **470** (Liste „Typische IHK-Aufgaben­stellungen")
und Zeile **492** (Merksätze) – **beide außerhalb** von Abschnitt 3.4. In 3.4 selbst kommt der
Begriff nicht vor. `tools/e3_gegenprobe.py --alle` meldet M03-940 mit **0 von 3 Stichworten**.
**Dagegen im Pool:** M03-940 (`kalkulation`, „TCO über 3 Jahre, Tabelle vervollständigen") mit
`verweis` „Modul 03, Abschnitt 3.4 – Total Cost of Ownership".
**Entscheidungsbedarf:** eigenen Abschnitt „Total Cost of Ownership" in 3.4 schreiben?

### B92 — M03-772 verweist auf 3.1, TCO gehört nach 3.4
**Fehlerklasse:** `verweis` (E3-Klasse, nach Abschluss von E3 übrig geblieben).
**Fundstelle:** M03-772 „Welche Kostenpositionen gehören zur Total Cost of Ownership (TCO)…",
`verweis`: „Modul 03, Abschnitt **3.1** – TCO-Bestandteile (Lebenszykluskosten)".
3.1 ist „Marktgängige IT-Systeme"; Wirtschaftlichkeit ist 3.4.
**Entscheidungsbedarf:** nach B91 auf 3.4 umsetzen (`tools/verweis_setzen.py --batch`).

### B93 — Gehört die Entsorgung zur TCO? Der Bestand sagt beides
**Fehlerklasse:** der Bestand widerspricht sich selbst, **über Modulgrenzen** – dieselbe Klasse
wie „Pay-per-Use" am 27.08.
* `02#68`: „TCO … Gesamtkostenbetrachtung über Lebenszyklus (Kauf + Betrieb + Wartung +
  **Entsorgung**)"
* M03-772 (Pool, `erklaerungKurz`): „Zur TCO zählen Anschaffung, Energie, Wartung/Support/Ausfall
  **und Entsorgung** – also alle Kosten über den Lebenszyklus."
* `03#492` (Merksatz) **und** `99#75` (Spickzettel): „TCO = Anschaffung + (Betriebskosten × Jahre)
  − Restwert" — **ohne Entsorgung.**
⚠️ Der Lerner sieht die Kurzformel im Spickzettel und beantwortet M03-772 danach falsch.
**Entscheidungsbedarf:** Einzelfall (Entscheid 9). Formel um „+ Entsorgung" ergänzen, oder die
Kurzformel ausdrücklich als „vereinfachte Rechenformel für Kostenvergleiche" kennzeichnen?

### B94 — 6 GHz: Unterlage sagt Wi-Fi 6, der Pool sagt Wi-Fi 6E
**Fehlerklasse:** Widerspruch Unterlage ↔ Pool.
* `03#244`: „**802.11ax (Wi-Fi 6):** bis 10 Gbit/s (2,4 GHz, 5 GHz, **6 GHz**)"
* `99#69` (Spickzettel): „ax = Wi-Fi 6 (**auch 6 GHz**)"
* Pool, **sechs** Stellen dagegen: M03-013 („6 GHz kam erst mit Wi-Fi 6E"), M03-202, M03-613,
  M03-905, M03-906, FALL-08-t3.
⚠️ **Bei M03-613 hängt die richtige Antwort daran** („Wi-Fi 6 = 2,4/5 GHz – 6 GHz erst mit 6E").
Wer nach der Unterlage lernt, wählt in M03-613 falsch.
**Entscheidungsbedarf:** Unterlage und Spickzettel auf den Pool-Stand ziehen (der Pool ist der
in Etappe 3 gelesene Stand) – bestätigen?

### B95 — „Die CPU ist das Rechenwerk" – halber von-Neumann-Begriff
**Fehlerklasse:** Fachbegriff verdreht.
* `03#32`: „**Der Prozessor ist das Rechenwerk eines Computers.**"
* M03-018 (Pool, wortgleich): „Welche Komponente ist das Rechenwerk eines Computers und wird nach
  Taktfrequenz (GHz), Anzahl Kerne und Cache beurteilt?"
**Sachlage:** Nach von Neumann besteht die CPU aus **Rechenwerk (ALU) UND Steuerwerk**; das
Rechenwerk ist ein *Teil* der CPU, nicht ihr Synonym.
**Messung:** „Steuerwerk" kommt im **gesamten Bestand 0 Mal** vor – der Begriff, der die Aussage
richtigstellen würde, fehlt überall.
⛔ **Regel:** Wer diesen Fachfehler korrigiert, trägt „Rechenwerk/Steuerwerk" in
`begriffe_belegt.json` ein (Beleg GPL, 27.08.).
**Entscheidungsbedarf:** beide Stellen umformulieren („Die CPU ist die zentrale Recheneinheit;
sie besteht aus Rechenwerk und Steuerwerk") – bestätigen?

### B96 — Wi-Fi 7 (802.11be) fehlt in allen Kursdateien
**Fehlerklasse:** Lücke gegen den geprüften Pool.
**Messung:** `Wi-Fi 7`/`802.11be` → **0 Treffer** in allen neun Kursdateien. `03#244` endet bei
Wi-Fi 6. Der Pool führt Wi-Fi 7 an fünf Stellen (M03-013 „aktueller Nachfolger",
M03-202, M03-613 „seit 2024", M03-905 und M03-906 mit eigener Frage zu MLO/4K-QAM).
**Entscheidungsbedarf:** eine Zeile in `03#244` und im Spickzettel ergänzen – **oder** bewusst
weglassen, weil der Prüfungskatalog 2. Auflage 2024 Wi-Fi 7 nicht führt? (Dann als Entscheid
notieren, damit es nicht wieder auffällt.)

### B97 — Office-Produktnamen gemischt
**Fehlerklasse:** falsches Beispiel.
`03#159`: „Office-Pakete (MS Office, LibreOffice): **Word, Calc, PowerPoint, Outlook**".
**Calc** ist LibreOffice, Word/PowerPoint/Outlook sind MS Office – **Excel fehlt** ganz.
Der Lerner bekommt eine Produktliste, die es so bei keinem der beiden Hersteller gibt.
**Kein Pool-Treffer** – nur die Unterlage.
**Entscheidungsbedarf:** trennen („MS Office: Word, Excel, PowerPoint, Outlook · LibreOffice:
Writer, Calc, Impress") – bestätigen?

### B98 — `www.example.com → 93.184.216.34` ist ein alterndes Beispiel
**Fehlerklasse:** alternde Beispiele und Jahreszahlen.
**Fundstellen:** `03#215` und M03-001 (Pool), beide mit derselben Adresse.
**Sachlage:** 93.184.216.34 war jahrelang die Adresse von example.com; ICANN hat die Domain 2025
auf andere Adressen umgezogen. ⚠️ **Von hier nicht nachmessbar** – die DNS-Auflösung der Sandbox
läuft über einen Proxy und liefert Cloudflare-Adressen, also keinen belastbaren Wert.
**Vorschlag statt einer neuen echten Adresse:** **192.0.2.1** aus dem Dokumentationsbereich
**RFC 5737** (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`). Diese Adressen sind per
Norm für Beispiele reserviert und **können nie veralten**.
**Entscheidungsbedarf:** auf eine RFC-5737-Adresse umstellen, oder echte Adresse behalten?

### B99 — Barrierefreiheit im Privatunternehmen: seit 28.06.2025 auch BFSG
**Fehlerklasse:** alternde Rechtslage.
`03#306`: „Die BITV bindet öffentliche Stellen des Bundes … Im Privatunternehmen ergibt sich die
Pflicht **stattdessen** aus § 164 Abs. 4 SGB IX."
M03-612 (Pool) sagt dasselbe: „Die BITV bindet nur öffentliche Stellen des Bundes."
**Sachlage:** Beide Sätze sind für sich richtig, aber seit dem **28.06.2025** gilt zusätzlich das
**Barrierefreiheitsstärkungsgesetz (BFSG)** – die deutsche Umsetzung des European Accessibility
Act. Es verpflichtet **private** Unternehmen für bestimmte Verbraucherprodukte und
-dienstleistungen (u. a. Online-Shops, E-Books, Bankdienstleistungen, Selbstbedienungsterminals);
Kleinstunternehmen sind bei Dienstleistungen ausgenommen. Das Wort „**stattdessen**" ist damit
nicht mehr richtig: § 164 SGB IX regelt den Arbeitsplatz des Beschäftigten, das BFSG das Produkt
für den Verbraucher.
⚠️ **Der Prüfungskatalog 2. Auflage 2024 kennt das BFSG noch nicht.** Das ist eine
Nutzer-Entscheidung, kein Sachbefund: mehr Stoff als der Katalog verlangt, aber die Rechtslage,
die der Lerner im Betrieb antrifft.
**Entscheidungsbedarf:** BFSG in `03#306` aufnehmen (zwei Sätze), oder Unterlage beim
Katalogstand lassen und nur „stattdessen" zu „daneben" entschärfen?

---

## HINWEISE – KEIN BEFUND, KEIN ENTSCHEID NÖTIG

* `03#41` Tippfehler „**Arbeitspeicher**" → „Arbeitsspeicher" (ein fehlendes s). ✅ mitkorrigiert.
  Einziger Tippfehler der Datei.
* `03#159` „**Interpreter:** … (z. B. Python, JavaScript)" nennt **Sprachen** statt Interpreter.
  ⚠️ **Nicht als Widerspruch melden:** M04-010 im Pool formuliert es genauso
  („Interpreter (Python, JavaScript, Bash)"). Poolweit einheitlich, also Bestand.
* `03#159` „**Virtuelle Maschinen (VM):** Emuliert Computersystem" – fachlich virtualisiert eine
  VM, sie emuliert nicht. **M03-603 im Pool schreibt dasselbe** („VM: emuliert ein komplettes
  Betriebssystem") → kein Widerspruch, poolweiter Bestand. Nur mit Entscheid anfassen.
* `03#181` „VMware Horizon Cloud" heißt seit der Ausgliederung an Omnissa (2024) „Omnissa Horizon
  Cloud". Produktname, nicht Prüfungsstoff.
* `tools/e3_gegenprobe.py --alle` meldet für M03 sieben Kandidaten. **Fünf davon sind Fehlalarme:**
  M03-472, M03-703, M03-970, M03-971, M03-972 verweisen auf das „OSI-**Referenz**modell", die
  Unterlage überschreibt den Abschnitt mit „OSI-Modell". Wortform, kein Fehler – **nicht anfassen.**
  Die zwei echten sind B91 (M03-940) und B92 (M03-772).
* **Struktur:** „Barrierefreier Zugriff" und „Ergonomie am Bildschirmarbeitsplatz" stehen in
  Abschnitt **3.3 „Leistungsfähigkeit und Energieeffizienz"** – Inhalt passt nicht zum Titel.
  ⛔ **Vorschlag: Bestand.** An der Abschnittsstruktur hängen 959 `verweis`-Ziele; Umhängen
  repariert Richtiges kaputt (Lehre 24.08., M03-Lauf). Der Titel ist ohnehin schon einmal als
  „kein Inhaltsverzeichnis" belegt (START_PROMPT Abschnitt 6).

## NACHGERECHNET – ALLE RICHTIG

Alle sechs Rechenbeispiele der Datei einzeln nachgerechnet, **kein Fehler**:

| Stelle | Rechnung | Ergebnis |
|---|---|---|
| 03#65 Rack | 2+1+1+4+3 = 11 HE; 42 − 11 | 31 HE frei ✅ |
| 03#284 Präfixe | 10¹² / 2³⁰ | 931 GiB ✅ |
| 03#338 Beispiel 1 | 2,5 GB × 8 / 50 Mbit/s | 400 s = 6 min 40 s ✅ |
| 03#353 Beispiel 2 | 150 W × 8 h × 220 d × 0,35 €/kWh | 92,40 €/Jahr, 462 € auf 5 Jahre ✅ |
| 03#399 Beispiel 3 | Kauf 12.500 − 2.400 = 10.100 gegen Leasing 9.000 + 1.500 = 10.500 | Kauf 400 € günstiger ✅ |
| 03#428 Nutzwertanalyse | A 3,2+2,7+1,4+0,6 · B 3,6+2,1+1,8+0,8 | 7,9 gegen 8,3 ✅ |
| 03#504 Selbsttest 2 | 3 GB × 8 / 25 Mbit/s | 960 s = 16 min ✅ |
| 03#504 Selbsttest 3 | 400 W × 8.760 h × 0,40 €/kWh | 1.401,60 €/Jahr ✅ |
| 03#504 Selbsttest 5 | Kauf 3.500 gegen Leasing 3.600 | Kauf 100 € günstiger, ×20 = 2.000 € ✅ |

Ebenfalls gegen den Pool geprüft und **deckungsgleich** (kein Befund):
Höheneinheit 44,45 mm / IEC 60297 (M03-747, M03-994) · strukturierte Verkabelung Primär/Sekundär/
Tertiär und die drei Verteiler nach EN 50173 (M03-990) · Ergonomie-Richtwerte 50–70 cm, 90°, 15–20°
(M03-609, M03-610, M03-707, M03-708) · Dateisystem-Tabelle (M03-014, M03-023, M03-607) ·
802.11ac bis 3,5 Gbit/s (M03-201, M03-202, M03-613) · WCAG 2.1 / BITV 2.0 (M03-611, M03-612) ·
OSI-Schichtzuordnung der fünf Selbsttest-Protokolle.

---

## TREFFERQUOTE DES PILOTEN (Grundlage für den Entscheid über die restlichen sieben Dateien)

* **616 Zeilen, 34 Abschnitte, 10 Befunde** – rund **ein Befund je 62 Zeilen**.
* Verteilung der Klassen: **3 × Verweisziel ohne Inhalt** (B90, B91, und B96 als Lücke gegen den
  Pool) · **2 × Widerspruch** (B93 über Modulgrenzen, B94 Unterlage ↔ Pool) · **1 × falscher
  `verweis`** (B92) · **1 × Fachbegriff verdreht** (B95) · **2 × alternde Angabe** (B98, B99) ·
  **1 × falsches Beispiel** (B97).
* **Die teuerste Klasse des Pools fällt hier aus, wie in der Vorabmessung erwartet:**
  kein einziges erfundenes Gesetzeszitat, keine falsche Absatzangabe. Die drei Rechtsstellen der
  Datei (§ 164 Abs. 4 SGB IX, ArbStättV Anhang Nr. 6, BITV) sind **richtig**.
* **Die stärkste Klasse ist neu und war im Pool nicht sichtbar:** *der Pool prüft etwas, das die
  Unterlage nicht enthält.* Sie ist mechanisch messbar (`grep` des Begriffs gegen alle Kursdateien)
  und damit ein Kandidat für einen Wächter.
⚠️ **Keine Hochrechnung auf die anderen sieben Dateien.** Der Entscheid darüber ist der
**nächste Griff** und steht beim Nutzer.

---

## GEGENPROBE ZUM NEUEN WÄCHTER (Pflicht, bevor er zählt)

`begriffe_belegt.json` hat seit dem 31.08. einen achten Anker: **`Rechenwerk`**. Ein Wächter, der
nie angeschlagen hat, ist nicht geprüft (START_PROMPT Abschnitt 6). Verfahren wie
`tools/sabotage.sh`, aber für den Lehrtext: Ur-Zustand zurücksetzen, Probe fahren, per `finally`
**immer** wiederherstellen.

| Probe | Ergebnis |
|---|---|
| korrigierter Stand | `ok Rechenwerk: 0` |
| Ur-Zustand Lehrtext („Der Prozessor ist das Rechenwerk eines Computers.") | **`FEHLER Rechenwerk: 1 → 03#32`** ✅ |
| Wortlaut von M03-018 („…ist das Rechenwerk eines Computers und wird nach…") | **`FEHLER Rechenwerk: 1 → 03#32`** ✅ |
| nach Wiederherstellung | `ok Rechenwerk: 0` |

⚠️ Der Anker prüft **keine Bedeutung**, sondern die belegten Formulierungen – so wie es
`_grenze` in der Datei verlangt. Entwarnung: steht „Rechenwerk und Steuerwerk" oder „Teil der CPU"
im selben Fenster, ist der Satz in Ordnung.

---
---

# ZWEITE DATEI: `07_Leistungserbringung_und_Auftragsabschluss.md` (943 Zeilen, 42 Abschnitte)

**Gelesen:** 31.08.2026, Abschnitt für Abschnitt. **Ausgewählt nach Messung, nicht nach Gefühl:**
`e3_gegenprobe.py --alle` meldete für M07 **fünf** Kandidaten, für M04 einen, sonst null.

## STAND: 8 BEFUNDE – 7 KORRIGIERT, 1 BEWUSST LIEGEN GELASSEN (31.08.2026)

Zwei gebündelte Nutzer-Entscheide, danach **EIN** Korrekturlauf.

| Nr | Fehlerklasse | Fundstelle | Entscheid und Umsetzung |
|---|---|---|---|
| B100 | Verweisziel ohne Inhalt (**14 Fragen**) | 07 Abschnitt 7.6 | ✅ **Unterabschnitt „Einweisung der Anwender" geschrieben** (~70 Zeilen), deckt alle 14 Fragen; Multiplikatoren per Querverweis auf 7.5, nicht doppelt |
| B101 | Widerspruch Unterlage ↔ Pool + Sachfehler | 07#731 Selbsttest | ✅ **Abschnitt „Formen der Abnahme"** (ausdrücklich · konkludent · fiktiv, § 640 Abs. 2/3 BGB) **plus Selbsttest-Antwort neu geschrieben** |
| B102 | derselbe Name für zwei verschiedene Größen | 07#778 / M07-760 | ✅ **Erreichungsgrad und Abweichung als zwei Kennzahlen getrennt**, mit Hinweis auf die 100 Punkte Versatz |
| B103 | Vorzeichen verdreht | 07#758 Abweichungsanalyse | ✅ beide richtiggestellt: „+1 Woche über Plan", „−1.500 EUR Abweichung" |
| B104 | Rechenfehler (Rundung) | 07#852 Praxisbeispiel | ✅ **106,2 %** statt 106,1 %; beide Beispiele führen jetzt Erreichungsgrad UND Abweichung |
| B105 | Fachbegriff zweifach aufgelöst | 07#22 / M07-309 | ✅ **Mean Time to Resolution** als verbindlich, Repair als Nebenform benannt – in Unterlage UND Pool; Anker in `begriffe_belegt.json` (nur dokumentiert, Muster „MAC") |
| B106 | Fachbegriff zu grob | 07#22, 07#115, 07#149, 03#429, 99 Vertragstabelle | ✅ **belegt und korrigiert am 02.09.2026** (Wikipedia „Finanzierungsleasing" + IHK-Merkblatt Leasing). Fünf statt vier Stellen |
| B107 | alternde Datumsangaben | fünf Stellen in 07 | ✅ auf **relative Angaben** umgestellt („Ende des ersten Quartals", „TT.MM.JJJJ") – ein neues festes Datum wäre in einem Jahr wieder alt. Dazu die vier Sprachfehler |

⚠️ **Warum bei B105 „Resolution" gewonnen hat und nicht die Mehrheit:** Beide Stellen sprechen von
der **Lösungszeit** im SLA – also der Zeit, bis der Kunde wieder arbeiten kann. Das ist
*Resolution*; *Repair* ist die reine Instandsetzung. **Anker ist die Sache, nicht die Verteilung**
(Lehre vom 24.08.).

⚠️ **Nach dem Lauf gemessen:** `e3_gegenprobe.py --alle` meldet für M07 **nur noch M07-750** –
die vier Einweisungs-Kandidaten (M07-029/030/032/036) sind gedeckt. M07-750 („Gestaltung und
Bewertung von SLA-Klauseln") steht weiter offen und ist als Hinweis unten notiert.

---

### B100 — 14 Fragen verweisen auf „7.6 Einweisungen", der Abschnitt enthält dazu NICHTS
**Fehlerklasse:** Verweisziel ohne Inhalt – **zum zweiten Mal, und diesmal viermal so groß.**

**Messung.** 31 Fragen verweisen auf Abschnitt 7.6. **17 davon sind gedeckt** (Abnahmeprotokoll,
Mängelarten, § 640 BGB). **14 sind es nicht:**
M07-025 · M07-026 · M07-027 · M07-029 · M07-030 · M07-031 · M07-032 · M07-033 · M07-034 ·
M07-035 · M07-036 · M07-037 · M07-038 · M07-051 – Verweistexte wie „Methoden der Einweisung",
„Anwenderdokumentation", „Multiplikatorprinzip", „Erfolgskontrolle der Einweisung",
„Übergabe von Zugangsdaten", „Schulungsunterlagen".

**Gegenprobe über alle neun Kursdateien** (`grep -c`):

| Begriff | in Modul 07 | in allen Kursdateien |
|---|---|---|
| Anwenderdokumentation | **0** | **0** |
| Teilnehmer | **0** | **0** |
| Handbuch | **0** | **0** |
| Betriebsdokumentation | **0** | **0** |
| Rückfrage | **0** | 2 (andere Module) |
| Einweisung | 2 – **beide nur Überschrift** (Z. 12 und Z. 630) | 3 |

**Was 7.6 tatsächlich enthält:** Inhalt des Abnahmeprotokolls · rechtliche Bedeutung · Mängelarten ·
ein Musterprotokoll · Praxisbeispiel. **Kein Satz über Einweisung.**
**Wo der Stoff liegt, den es gibt:** in **7.5** unter „Veränderungsprozesse begleiten" – Blended
Learning (Z. 553), Multiplikatoren (Z. 560), Widerstände (Z. 577). Also unter Change-Management,
nicht unter Übergabe.

⚠️⚠️ **Das ist die Lehre aus START_PROMPT Abschnitt 6, buchstäblich eingetreten.** Dort steht, dass
15 Fragen einen Monat lang auf 7.7 lagen und am 28.07. nach 7.6 gezogen wurden, **weil der
Abschnitt wörtlich „Leistungsübergabe und Einweisungen planen und dokumentieren" heißt.** Der
Titel stimmte. Der Inhalt war nie da – und niemand hat danach gesehen, weil der Wächter nur prüft,
**ob** der Abschnitt existiert.
**Entscheidungsbedarf:** Unterabschnitt „Einweisung und Übergabe an den Anwender" in 7.6 schreiben
(Methoden, Anwenderdokumentation, Multiplikatoren mit Verweis auf 7.5, Erfolgskontrolle, Umgang mit
Rückfragen, Übergabe von Zugangsdaten)? Das sind rund 40–60 Zeilen Lehrtext.

### B101 — Der Selbsttest in 7.6 sagt das Gegenteil des Pools
**Fehlerklasse:** Widerspruch Unterlage ↔ Pool – **und die Unterlage hat unrecht.**
**Unterlage** (Selbsttest 7.6, Frage 3): „**Nein. Ohne Unterschrift ist die Abnahme nicht
wirksam.**"
**Pool, wörtlich dagegen:**
* M07-201: „Konkludente Abnahme nach § 640 BGB: Wenn der Kunde die Leistung nutzt, ohne Mängel zu
  rügen, gilt sie als abgenommen — **auch ohne Unterschrift.**"
* M07-305: „Konkludente Abnahme … **rechtlich genauso wirksam wie schriftliches
  Abnahmeprotokoll.**"
* M07-040 und M07-050 behandeln die **Formen der Abnahme** samt § 640 Abs. 2 BGB.

**Messung:** „konkludent" und „stillschweigend" haben **0 Treffer in allen neun Kursdateien.**
Die **fiktive Abnahme** nach § 640 Abs. 2 BGB (Fristsetzung, keine Verweigerung unter Angabe eines
Mangels → gilt als abgenommen) kommt ebenfalls nirgends vor.
⚠️ **Es ist eine Selbsttest-Antwort.** Der Lerner prüft sich selbst und bestätigt sich das Falsche.
**Entscheidungsbedarf:** Antwort korrigieren **und** einen Absatz „Formen der Abnahme"
(ausdrücklich · konkludent · fiktiv) in 7.6 ergänzen?

### B102 — „Kostenabweichung in %" bezeichnet in Unterlage und Pool zwei verschiedene Größen
**Fehlerklasse:** derselbe Name für zwei Größen – dieselbe Klasse wie „Pay-per-Use".
* **Unterlage** (7.7): „Kostenabweichung in % = (Tatsächliche Kosten / Angebotene Kosten) × 100 %",
  Beispiel **101,5 %**, Bewertungsskala „< 100 % · = 100 % · > 100 %".
* **M07-760** (Pool): „Berechne die absolute und die **prozentuale Abweichung (Istkosten −
  Sollkosten)**", `erklaerungKurz`: „{istk} − {sollk} = {s1} EUR; {s1} ÷ {sollk} × 100 = {s2} %".
  Dieselbe Zahlenlage ergäbe dort **1,5 %**.

**Beide Rechnungen sind für sich richtig – sie heißen nur gleich und unterscheiden sich um genau
100 Punkte.** Wer nach der Unterlage lernt und M07-760 rechnet, schreibt 101,5 statt 1,5 hin.
**Entscheidungsbedarf:** in der Unterlage umbenennen (z. B. „Kostenerreichungsgrad" für Ist/Soll)
und die echte Abweichungsformel danebenstellen?

### B103 — Beide Vorzeichen in der Abweichungsanalyse sind verdreht
**Fehlerklasse:** Vorzeichenfehler.
Die Tabelle darüber ist **richtig**: „1 Woche Überschreitung ✗", „1.500 EUR unterschritten ✓".
Der Fließtext direkt darunter dreht beide um:
* „**Zeitverzug (-1 Woche)**" – eine Überschreitung ist **+1**
* „**Budget unterschritten (+1.500 EUR)**" – eine Unterschreitung ist **−1.500**

⚠️ Genau dieses Vorzeichen ist im Pool bereits geklärt: M07-760 rechnet „Istkosten − Sollkosten"
und der Merksatz dort erklärt seit dem 26.08. ausdrücklich, dass die Abweichung **negativ sein
darf** (Kostenunterschreitung). Die Unterlage trägt die alte Verwirrung weiter.

### B104 — Rundungsfehler im zweiten Rechenbeispiel: 106,1 % statt 106,2 %
**Fehlerklasse:** Rechenfehler.
11.730 ÷ 11.050 × 100 = **106,153…** → auf eine Nachkommastelle **106,2 %**. Die Datei schreibt
zweimal **106,1 %** („6,1 % über Plan") – abgeschnitten statt gerundet.
✅ Zur Abgrenzung nachgerechnet: **alle übrigen Rechnungen der Datei stimmen** – 130 h × 85 € =
11.050 €, 138 h × 85 € = 11.730 €, +680 €; das erste Beispiel 3.960/3.900 = 101,5 %; der
Selbsttest 11.200/10.000 = 112 %.

### B105 — MTTR wird im Bestand zweifach aufgelöst
**Fehlerklasse:** Fachbegriff mit zwei Bedeutungen – dieselbe Lage wie „MAC".
* 07#22 (Unterlage) und M07-006: „MTTR – Mean Time to **Resolution**"
* M07-309: „MTTR – Mean Time To **Repair**"

Beide Auflösungen sind fachlich gebräuchlich; das Problem ist, dass **derselbe Bestand beide
führt**, ohne es zu sagen. `abkuerzungen.js` führt MTTR gar nicht.
**Entscheidungsbedarf:** eine Auflösung festlegen und die andere als Nebenform benennen – und
MTTR als Anker in `begriffe_belegt.json` (Muster „MAC", nur dokumentiert)?

### B106 — „Leasing = Miete plus Service durch den Leasinggeber" ist zu grob
**Fehlerklasse:** Fachbegriff zu grob. **Am 02.09.2026 belegt, entschieden und korrigiert.**

**Der Beleg — zwei voneinander unabhängige Quellen:**

| Quelle | Finanzierungsleasing | Operating-Leasing |
|---|---|---|
| Wikipedia, „Finanzierungsleasing" | „Maßnahmen zur Werterhaltung trägt der **Leasingnehmer** (Instandhaltung, Wartung, Versicherung)"; der Vertrag sieht „Überwälzung der Sach- und Preisgefahr auf den Leasingnehmer" vor | Investitionsrisiko bleibt beim Leasinggeber |
| IHK-Merkblatt Leasing (IHK Nürnberg/München) | „Sie tragen als Leasingnehmer bei den **meisten Vertragsformen** die volle Verantwortung für das Leasingobjekt … zuständig für Wartung, Instandhaltung und Versicherung" | „Instandhaltungspflichten liegen beim **Leasinggeber** (Wartung, Versicherung, Reparaturen)"; „Der Leasinggeber trägt das Restwertrisiko" |

Der Zweifel bestätigt sich: Der Satz beschrieb das **Operating-Leasing** und gab es als *die*
Definition von Leasing aus. Der in der Praxis häufigere Fall ist der umgekehrte.

**Zwei Dinge kamen beim Nachmessen dazu, die im ursprünglichen Befund fehlten:**

1. **Der Pool sagte längst das Richtige.** `M07-003` trägt seit Commit `12048bf` (Etappe 3, also
   lange vor dieser Prüfrunde) im Paar „Leasing": *„Instandhaltung **je nach Vertragsart**"*, und
   in der erklaerungLang: *„die Instandhaltung liegt beim Finanzierungsleasing regelmäßig beim
   Leasingnehmer."* Der Lehrtext widersprach damit der eigenen Frage. Das war kein Grenzfall
   mehr, sondern ein **Innenwiderspruch im Bestand** — und genau der Fall, den keiner der
   Wächter sieht: `verweis` prüft, ob das Ziel existiert, `--streng`, ob das Stichwort vorkommt.
   Dass Ziel und Frage einander *widersprechen*, prüft nichts.
2. **Es waren fünf Stellen, nicht vier.** Die fünfte ist die Vertragstabelle im Spickzettel
   (`99_Spickzettel.md`, Zeile 171) — also ausgerechnet das Blatt, das der Lerner am Prüfungstag
   liest. Der ursprüngliche Befund hatte nur die Modul-Dateien abgesucht. **Lehre: Wer einen Satz
   im Lehrtext korrigiert, sucht denselben Satz im Spickzettel.**

**Nutzer-Entscheid 02.09.2026:** alle fünf Stellen; Tiefe „zwei Formen, kurz".

**Korrigiert (alle fünf in einem Lauf, danach `check.sh block` → ALLES GRÜN):**

| # | Stelle | vorher | nachher |
|---|---|---|---|
| 1 | 07#22 Vertragsarten | „Spezialform der Miete, verbunden mit Instandhaltung, Versicherung, Wartung durch den Leasinggeber" | Zwei Spiegelstriche: Operating-Leasing (Service beim Geber, kurz, kündbar) und Finanzierungsleasing (Wartung, Versicherung, Sachgefahr beim Nehmer, Grundmietzeit, Kaufoption), dazu die Abgrenzung zu § 535 BGB |
| 2 | 07#115 Übersichtstabelle | „Nutzung + Service \| 20 × PCs mit Wartung" | „Nutzung auf Zeit gegen Rate \| 20 × PCs; Wartung beim Geber (Operating) oder beim Nehmer (Finanzierung)" |
| 3 | 07#149 Selbsttest F3 | „Gesamtpaket aus Nutzung, Wartung, Versicherung … durch den Leasinggeber" | Miete = Erhaltungspflicht des Vermieters (§ 535 BGB); Leasing = je nach Vertragsart |
| 4 | 03#429 Erwerbsmodelle | Spalte Wartung: „Leasinggeber" | „Je nach Vertragsart", plus eine Fußnote unter der Tabelle mit Verweis auf 7.1 und dem Hinweis, dass in Rechenaufgaben die Angabe sagt, ob Betriebskosten in der Rate stecken |
| 5 | 99 Vertragstabelle | „Nutzung + Service \| PCs inkl. Wartung" | „Nutzung auf Zeit \| PCs; Wartung je nach Vertragsart: Operating = Geber, Finanzierung = Nehmer" |

`spickzettel.js` wurde danach mit `python3 tools/build_spick.py` neu gebaut — der Spickzettel ist
erzeugt, nicht handgepflegt.

**Gegenprobe:** `pool_query.js begriffe` 0, `verrat` 0, `e3_gegenprobe.py --alle` unverändert 6
(dieselben sechs wie vorher, alle in 3.2 und 7.1 — keine neue Lücke), 45 Suiten grün.

### B107 — Fünf Datumsangaben liegen in der Vergangenheit
**Fehlerklasse:** alternde Beispiele und Jahreszahlen. „Abschluss bis Ende **Q1 2025**" (7.3) ·
„Alle PCs auf Windows 11 bis **30.06.2025**" (7.5) · Musterprotokoll „**30. Juni 2025**",
Nachbesserung „bis **10.07.2025**" (7.6, zweimal).
Ein Musterprotokoll mit einem Datum aus der Vergangenheit liest sich wie ein Altbestand.
**Entscheidungsbedarf:** auf relative Angaben umstellen („Ende Q1 des Folgejahres", „TT.MM.JJJJ")
statt auf ein neues festes Datum, das in einem Jahr wieder alt ist?

## HINWEISE – KEIN BEFUND

* Vier Sprachfehler: „Begrenzte **Diagnosis**" (→ Diagnose, 7.3) · „Muss in **deutscher**
  Rechenzentrum laufen" (7.3) · „**Aufwandige** Koordination" (7.4) · „Effizienz bei
  **IT-Projekte**" (7.4). Mitkorrigierbar, sobald ein Lauf ohnehin stattfindet.
* Die Gewährleistungsfrist wird pauschal „ab **Abnahme**" angesetzt. Beim Werkvertrag stimmt das
  (§ 634a BGB), beim Kaufvertrag beginnt sie mit **Ablieferung**. Im Kontext des Abschnitts
  (Werkvertrag/Abnahmeprotokoll) ist die Aussage richtig – **nicht anfassen ohne Entscheid.**
* 7.2 nennt „Umsatzsteigerung und Schulungsangebot" als **neutrale** Ziele. Diskutabel, aber ein
  Beispiel, kein Sachfehler.
* Die fünf `e3_gegenprobe.py`-Kandidaten waren **alle echt** – vier davon sind Teil von B100
  (M07-029/030/032/036), der fünfte ist M07-750 („Gestaltung und Bewertung von SLA-Klauseln"):
  7.1 erklärt, **was** ein SLA ist, aber nicht, wie man Klauseln gestaltet oder bewertet.
  ⚠️ **Anders als bei M03: kein einziger Fehlalarm.** Die Trefferquote des Werkzeugs schwankt
  stark je Modul – **Kandidatenfilter, kein Urteil**, gilt weiter.

## TREFFERQUOTE UND VERGLEICH MIT DEM PILOTEN

| | Pilot `03_IT-Systeme` | `07_Leistungserbringung` |
|---|---|---|
| Zeilen | 616 | 943 |
| Befunde | 10 | 8 |
| **je Zeile** | ein Befund je **62** | ein Befund je **118** |
| Verweisziel ohne Inhalt | 3 Befunde, **5 Fragen** betroffen | 2 Befunde, **18 Fragen** betroffen |
| erfundene Gesetzeszitate | 0 | 0 |
| Rechenfehler | 0 (9 Beispiele nachgerechnet) | 1 (Rundung) |

⚠️ **Zwei Dateien sind noch keine Quote.** Was sich abzeichnet, ist keine Zahl, sondern eine
**Klasse**: beide Dateien haben ihre schwersten Befunde dort, wo der Pool etwas prüft, das die
Unterlage nicht führt – 5 Fragen in Modul 03, **18 in Modul 07**. Und in beiden Fällen war die
Messung dafür ein `grep` über neun Dateien, keine Leseleistung.

---
---

# DRITTE DATEI: `04_IT-Loesungen_Software_Programmierung.md` (1414 Zeilen, 8 Abschnitte)

**Gelesen:** 31.08.2026, Abschnitt für Abschnitt. **Die größte Kursdatei und das größte Modul**
(191 Fragen). Ausgewählt nach der Messung des Vortags: M04 war das einzige Modul außer M07 mit
einem offenen Gegenprobe-Kandidaten.

⚠️ **NEU IN DIESER RUNDE: die Handmessung ist ins Werkzeug gewandert.**
`python3 tools/e3_gegenprobe.py --streng` meldet seit heute **jedes einzelne** fehlende Stichwort,
nach **Begriff** aggregiert — nicht nur die Fragen, bei denen KEIN Stichwort trifft. Anlass: der
Vorgabelauf hatte B90 nicht gefunden, weil bei M03-601 das Wort „Cloud" traf und `IaaS`/`PaaS`
damit unsichtbar blieben. **Kalibriert an Fällen mit bekannter Antwort** (siehe unten).

## STAND: 10 BEFUNDE, ALLE KORRIGIERT (31.08.2026)

Drei gebündelte Nutzer-Entscheide, danach **EIN** Korrekturlauf mit 18 Änderungen.
`check.sh block` danach: **ALLES GRÜN**, 45 von 45 Suiten.

| Nr | Fehlerklasse | Fundstelle | Entscheid und Umsetzung |
|---|---|---|---|
| B108 | Verweisziel ohne Inhalt | 04 Abschnitt 4.5 | ✅ **VPN-Architektur geschrieben**: Tunnel und Kapselung, Tabelle End-to-Site gegen Site-to-Site, Endpunkt als Unterscheidungsmerkmal |
| B109 | Verweisziel ohne Inhalt | 04#1089 | ✅ **Lernförderlichkeit als siebter Grundsatz ergänzt**, „sechs" → „sieben" |
| B110 | belegte Fehlerklasse, Rückfall | drei Stellen | ✅ alle drei: „quelloffen, nicht kostenlos"; Tabellenzeile GPL neu |
| B111 | belegte Fehlerklasse + Wächterlücke | Merksatz, Selbsttest | ✅ beide auf die **Weitergabe**-Bedingung gezogen; **Anker geschärft und gegengeprobt** |
| B112 | belegte Fehlerklasse | Lizenztabelle, Praxisbeispiel | ✅ **eigene Zeile „Subskription (Abo)"** eingezogen, Pay-per-Use auf echte Beispiele (Cloud-Rechenzeit, API-Aufrufe); **Anker geschärft und gegengeprobt** |
| B113 | Datei widerspricht sich selbst | 04#645 | ✅ „**Wie** soll es getan werden? (HOW)" |
| B114 | falsches Beispiel | Selbsttest 4.8 | ✅ Klassenlehrer–Schüler; die m:n-Falle steht jetzt ausdrücklich daneben |
| B115 | Verweisziel ohne Inhalt | 04 Abschnitt 4.5 | ✅ **Abschnitt „Strukturierte Fehlersuche"**: eingrenzen → von unten nach oben → eine Ursache nach der anderen → dokumentieren |
| B116 | Datei widerspricht sich selbst | Merksatz 4.3 | ✅ „Sicherheit hängt an der Pflege, nicht am Lizenzmodell" |
| B117 | Prüfungsbegriff fehlt | Schleifentabelle | ✅ `for` heißt jetzt **Zählschleife**, dazu die Abgrenzung zur bedingungsgesteuerten Schleife |

Dazu drei Sprachkorrekturen („Unternehmensnetze", „Concept", „Diamond").

---

### B108 — VPN: „Tunnel", „Site-to-Site" und „End-to-Site" kommen in KEINER Kursdatei vor
**Fehlerklasse:** Verweisziel ohne Inhalt.
**Messung:** `grep -c` über alle neun Kursdateien → **Tunnel 0 · Site-to-Site 0 · End-to-Site 0.**
**Dagegen im Pool:** **M04-314 ist ein Lückentext, der genau diese Wörter abfragt:** „Ein VPN
stellt einen verschlüsselten ___ zwischen Client und Server her und ermöglicht dem Client, als
___ des VPN-Netzes zu agieren. Ein Site-to-Site …", `verweis` „Modul 04, Abschnitt 4.5:
VPN-Architektur". Dazu M04-316 und M04-514.
**Was 4.5 zu VPN führt:** drei Zeilen — Zweck, Implementierungen (OpenVPN, WireGuard, IPsec),
Use-Case. **Keine Architektur, kein Tunnel, keine Unterscheidung Site-to-Site / End-to-Site.**
**Entscheidungsbedarf:** VPN-Absatz um die Architektur ergänzen (Tunnel als verschlüsselter
Datenpfad · End-to-Site für Einzelclients · Site-to-Site für zwei Standorte)?

### B109 — Die Unterlage führt sechs Grundsätze, der Pool prüft sieben
**Fehlerklasse:** Verweisziel ohne Inhalt.
`04#1089` schreibt: „Die Norm nennt Grundsätze … **Sechs davon** werden regelmäßig geprüft" und
listet Aufgabenangemessenheit, Selbstbeschreibungsfähigkeit, Erwartungskonformität, Steuerbarkeit,
Fehlertoleranz, Individualisierbarkeit.
**Dagegen im Pool:** M04-731 und M04-734 sagen beide ausdrücklich „**die sieben Grundsätze**" und
führen **Lernförderlichkeit** als siebten. **Messung: „Lernförderlichkeit" hat 0 Treffer in allen
neun Kursdateien.**
⚠️ **Offen und NICHT behauptet:** Die ISO 9241-110 wurde 2020 überarbeitet, und die Namen der
Grundsätze haben sich dabei geändert. **Ob der Prüfungskatalog 2024 die alten oder die neuen
Begriffe erwartet, habe ich nicht belegt** – Pool und Unterlage führen einheitlich die alten.
Das ist ein eigener Entscheid, kein Teil dieses Befundes.
**Entscheidungsbedarf:** Lernförderlichkeit als siebten Grundsatz ergänzen und „sechs" auf
„sieben" ziehen?

### B110 — Open Source wird dreimal mit „kostenlos" gleichgesetzt
**Fehlerklasse:** belegte Fehlerklasse, Rückfall (`begriffe_belegt.json`, Anker GPL, B89 vom 27.08.:
„GPL wird mit *kostenlos* gleichgesetzt – frei ist der Quellcode, nicht der Preis").
* `04#319`: „**Open Source** (z. B. Linux, Apache): Quellcode öffentlich, **kostenlos**, Lizenzen
  wie GPL"
* `04#412` (Merksatz): „**Open Source = kostenlos** & transparent"
* `04#476` (Tabelle „Unterscheidung von Lizenzmodellen"): Zeile **GPL · Preis: Kostenlos**

⚠️⚠️ **Die dritte Fundstelle steht sieben Zeilen unter dem Absatz, der das ausdrücklich
richtigstellt:** „**Nicht verwechseln: GPL heißt nicht kostenlos.** Frei ist der Quellcode, nicht
der Preis — GPL-Software darf verkauft werden." Der Abschnitt 4.4 wurde am 27.08. korrigiert; die
Tabelle darunter blieb stehen.
**Entscheidungsbedarf:** alle drei auf „lizenzkostenfrei erhältlich, aber nicht per Definition
kostenlos" ziehen?

### B111 — Der GPL-Merksatz nennt die Weitergabe nicht — und der Wächter merkt es nicht
**Fehlerklasse:** belegte Fehlerklasse **plus Lücke im Wächter**.
* `04#492` (Merksatz): „GPL: Quellcode frei, aber **Änderungen müssen zurückfließen** (Copyleft)"
* `04#508` (Selbsttest Frage 3): „Sie verwenden GPL-Software … und ändern den Quellcode. Was
  müssen Sie tun? → **Sie müssen die Änderungen ebenfalls unter GPL veröffentlichen.**"

Beide lassen die Bedingung weg, die der Fließtext desselben Abschnitts korrekt nennt: **nur bei
Weitergabe.** Wer GPL-Software im eigenen Betrieb anpasst, muss nichts veröffentlichen.
⛔⛔ **UND DER WÄCHTER SCHLÄGT NICHT AN.** `begriffe_belegt.json` führt als verbotenen Nachbarn
den Wortlaut „**Änderungen zurückfließen**". Im Text steht „Änderungen **müssen** zurückfließen" —
ein eingeschobenes Wort, und das Muster passt nicht mehr. **Der Anker wurde am 27.08. genau für
diese Fehlerklasse gebaut und übersieht sie hier.**
**Entscheidungsbedarf:** beide Stellen korrigieren **und** die Nachbarliste um die Variante mit
Einschub ergänzen (bzw. auf „zurückfließen" allein kürzen)?

### B112 — Die Lizenztabelle führt Microsoft 365 als Pay-per-Use
**Fehlerklasse:** belegte Fehlerklasse (Anker Pay-per-Use, der ERSTE Anker überhaupt) **plus
blinder Fleck des Wächters**.
* `04#476` (Tabelle): **Pay-per-Use · Preis: Niedrig (monatlich) · Beispiel: MS 365, Adobe
  Creative Cloud**
* `04#484` (Praxisbeispiel): „Option 3 – **Pay-per-Use (Microsoft 365)**: 20 × 10 €/Monat"

⚠️⚠️ **Sechs Zeilen darüber steht das Gegenteil, wörtlich:** „**Nicht zu verwechseln mit
Pay-per-Use ist die Subskription (Abo): Microsoft 365 und Salesforce kosten eine feste monatliche
Gebühr je Nutzer** — unabhängig davon, wie viel damit gearbeitet wird."
⛔⛔ **WARUM DER WÄCHTER SCHWIEG — UND WARUM MEINE ERSTE ERKLÄRUNG DAFÜR FALSCH WAR.**
Ich hatte hier zuerst geschrieben, der Abgrenzungssatz entwarne die Tabelle mit. **Das war eine
Vermutung, keine Messung** — und sie war falsch. Nachgemessen: Abgrenzungssatz und Tabelle sind
**zwei verschiedene Abschnittseinträge** (`04#453` gegen `04#461`), das Entwarnungsfenster reicht
gar nicht hinüber.
**Der wirkliche Grund war banal:** „Niedrig (monatlich)" und „MS 365" standen schlicht **nicht in
der Nachbarliste**. Der Wächter hatte kein Logik-, sondern ein Wortschatzproblem.
⚠️ **Was mich das gekostet hat:** Ich hatte auf die falsche Erklärung hin bereits einen
Sonderweg `harte_nachbarn` in `pool_query.js` gebaut, der die Entwarnung übersteuert. Er meldete
im ersten Lauf prompt **M04-008 und 04#453** — zwei Stellen, die **richtig** abgrenzen. Der
Mechanismus ist zurückgebaut.
►► **Die Lehre steht in START_PROMPT Abschnitt 6 und ich habe sie an diesem Tag selbst gebrochen:
vor jeder Meldung über den Pool die auswertende Funktion lesen.** Ein Werkzeug, das eine
vermutete Ursache behebt, behebt nichts.

### B113 — Die Datei sagt „HOW", meint aber „WHAT"
**Fehlerklasse:** die Datei widerspricht sich selbst.
`04#645`: „**Prozedural** … Fokus: **Was soll der Computer tun? (HOW)**" und „**Objektorientiert**
… Fokus: **Was sind die Objekte? (WHAT)**".
`04#894` (Merksatz derselben Datei): „**Prozedural = HOW, Objektorientiert = WHAT**" — richtig.
**Die deutsche Frage im Fließtext gehört zu WHAT, nicht zu HOW.** Prozedural fragt: *wie* soll es
getan werden (Ablauf), objektorientiert: *was* sind die Dinge.
**Entscheidungsbedarf:** Fließtext auf „**Wie** soll es getan werden? (HOW)" ziehen?

### B114 — „Ein Lehrer unterrichtet viele Schüler" ist kein 1:n-Beispiel
**Fehlerklasse:** falsches Beispiel.
`04#1232` (Selbsttest 4.8, Frage 1): „Ein Lehrer unterrichtet viele Schüler, aber ein Schüler hat
einen Klassenlehrer."
**Der erste Halbsatz beschreibt m:n** — ein Schüler wird von vielen Lehrern unterrichtet. Der Satz
wechselt dann stillschweigend auf „Klassenlehrer", was tatsächlich 1:n ist. **Als Beleg für 1:n
trägt er nicht**, und er steht ausgerechnet in der Antwort auf „Erklären Sie die Kardinalität 1:n".
**Entscheidungsbedarf:** durch ein sauberes Beispiel ersetzen (Kunde–Bestellung steht schon in der
Tabelle darüber; Klassenlehrer–Schüler wäre die konsistente Variante)?

### B115 — „Strukturierte Fehlersuche" hat keinen Lehrtext
**Fehlerklasse:** Verweisziel ohne Inhalt (klein).
M04-025 verweist auf „Abschnitt 4.5: Netzwerkdiagnose und **strukturierte Fehlersuche**"; die
richtige Antwort ist „**Eingrenzen** des Problems", die Erklärung nennt „technische Prüfungen
**von unten nach oben**". In 4.5 steht dazu nur ein Praxisbeispiel mit vier Befehlen — **kein
Vorgehen, keine Reihenfolge, kein Eingrenzen.**
**Entscheidungsbedarf:** vier Zeilen ergänzen (eingrenzen → Schicht für Schicht von unten nach
oben → eine Ursache nach der anderen ausschließen)?

### B116 — Sicherheit steht einmal bei Open Source und einmal bei proprietär
**Fehlerklasse:** die Datei widerspricht sich selbst.
`04#404` (Merksatz): „Open Source = kostenlos & transparent, **Proprietär = Support & Sicherheit**"
`04#409` (Selbsttest Frage 2): Vorteile von Open Source → „Quellcode ist einsehbar (Transparenz,
**Sicherheit**)"
**Entscheidungsbedarf:** Der Merksatz vergibt „Sicherheit" als Merkmal proprietärer Software,
fünf Zeilen später ist sie ein Open-Source-Vorteil. Merksatz umformulieren?

### B117 — Der Prüfungsbegriff „Zählschleife" kommt nicht vor
**Fehlerklasse:** Prüfungsbegriff fehlt. ⚠️ **KEINE Lücke im Stoff** – die Sache ist da.
**Messung:** „Zählschleife" 0 Treffer in allen neun Kursdateien, aber **7 Fragen** führen den
Begriff im Verweistext (M04-903/931/934/946/954/960/993).
**Nachgelesen:** Die Fragen selbst arbeiten mit „FÜR-Schleife", und die Datei erklärt genau das —
`for` und `FÜR i = 1 BIS 10 TUN`. Der Stoff ist vollständig, nur die Prüfungsbezeichnung fehlt.
Die Schleifentabelle teilt in **kopf-** und **fußgesteuert**; die IHK-Systematik kennt zusätzlich
die **Zählschleife** als eigene Kategorie.
**Entscheidungsbedarf:** in der Schleifentabelle „for" als **Zählschleife** benennen (ein Wort)?

## HINWEISE – KEIN BEFUND

* `04#1202` Das ASCII-Klassendiagramm benutzt `^` (im Text als **Vererbungs**pfeil definiert) für
  eine **Assoziation** zwischen Product und Order. Gleiches im E-Commerce-Beispiel.
  Grenzfall der ASCII-Darstellung — nur mit Entscheid anfassen.
* `04#1050` „Diamond (Zahlungsart?)" im Aktivitätsdiagramm; die Elementeliste sagt „Raute".
* `04#1260` Das ER-Diagramm zeigt Auftrag—Produkt als m:n **ohne** die im Text eingeführte
  Zwischentabelle „Auftragsposition". ⚠️ **Fachlich vertretbar** – im konzeptionellen ER-Modell
  ist m:n zulässig, die Auflösung gehört ins relationale Modell. **Nicht melden.**
* Sprachliches: „Unternehmensnetze" statt „-netz" (zweimal), „Concept" statt „Konzept",
  „Prozedural (**Imperativ**)" – imperativ ist der Oberbegriff, prozedural eine Unterform.
* **Alle Rechnungen der Datei nachgerechnet, kein Fehler:** Subnetztabelle /24 bis /30 ·
  vier Subnetze aus /24 · 192.168.20.135 bei /26 → .128/26 · Eckwerte 10.0.5.0/25 ·
  Hostbedarf 100 → /25 · IPv6-Kurzform · Schreibtischtest (Summe 12) · Logikfehler-Beispiel
  (summe = 5 statt 15) · Euklid 6/18 → 6 · Fakultät · Fibonacci · DIV/MOD · Lizenzrechnung
  20 × 10 € × 12 = 2.400 €.
* ⚠️ **Ein Fehlalarm meiner eigenen Messung, protokolliert statt gemeldet:** In der
  Adressklassen-Tabelle schien „128 ␣ 191" ein kaputtes Zeichen zu enthalten. **Gemessen:** kein
  U+FFFD, kein NUL-Byte in irgendeiner Kursdatei; in der Datei steht ein normaler Gedankenstrich.
  Es war ein Anzeigeartefakt der Werkzeugausgabe. **Erst messen, dann melden** – hier hat es
  einen falschen Befund verhindert.

## DIE GEGENPROBE ZUM NEUEN `--streng`-MODUS

Ein Werkzeug, das am ersten Tag gebaut wird, ist am ersten Tag noch nicht geprüft. Kalibriert an
Fällen mit **bekannter** Antwort:

| Begriff | Meldungen | Nachgemessen | Urteil |
|---|---|---|---|
| `gekoppelt` | **10** – der häufigste Treffer überhaupt | reines Verbindungswort aus dem Verweismuster „X gekoppelt mit Y" | **Fehlalarm → in `STOPP`** |
| `zählschleife` | 7 | 0 Treffer in allen neun Kursdateien | **echt** (B117) |
| `referenzmodell` | 6 | „OSI-Referenzmodell" gegen die Überschrift „OSI-Modell" | **Fehlalarm, dokumentiert – bleibt sichtbar** |
| `tunnel` | 1 | 0 Treffer, M04-314 fragt es als Lücke ab | **echt** (B108) |

⛔ **NICHT in `STOPP` aufgenommen, obwohl mehrfach gemeldet:** `software`, `management`,
`planung`, `berechnung`, `vergleich`, `umfang`, `überblick`. Das sind Fachbegriffe — wer sie
ausnimmt, macht genau die Lücken unsichtbar, für die das Werkzeug gebaut wurde.
⚠️ **Der Vorgabelauf ist unverändert:** `--alle` meldet weiter 959 geprüfte Verweise und 7 ohne
jeden Treffer. `check.sh` liest zwei Zeilen daraus per `sed` und sieht nichts Neues.

## TREFFERQUOTE – DREI DATEIEN

| | `03_IT-Systeme` | `07_Leistungserbringung` | `04_IT-Lösungen` |
|---|---|---|---|
| Zeilen | 616 | 943 | **1414** |
| Befunde | 10 | 8 | 10 |
| je Zeile | ein Befund je **62** | je **118** | je **141** |
| Verweisziel ohne Inhalt | 3 Befunde, 5 Fragen | 2 Befunde, 18 Fragen | 3 Befunde, 6 Fragen |
| Rückfall in eine **belegte** Fehlerklasse | 0 | 0 | **3 (B110–B112)** |

⚠️ **Das Neue an dieser Datei ist nicht die Quote, sondern die Klasse:** Modul 04 ist das Modul,
in dem am 27.08. die Anker `GPL` und `Pay-per-Use` entstanden sind — und **drei Fundstellen
derselben Fehler standen weiter darin**, teils sieben Zeilen unter der Richtigstellung.
⛔⛔ **In zwei von drei Fällen hat der Wächter geschwiegen, obwohl er dafür gebaut wurde:** einmal,
weil ein eingeschobenes Wort das Muster brach (B111), einmal, weil der Abgrenzungssatz die
Fundstelle des Fehlers mitentwarnt hat (B112). **Ein Anker prüft den Wortlaut, den er kennt —
nicht die Aussage.**


## DIE GEGENPROBE ZU DEN ZWEI GESCHÄRFTEN ANKERN

Ein Wächter, der nie angeschlagen hat, ist nicht geprüft. **Verfahren: erst schärfen, dann am
NOCH UNKORRIGIERTEN Text beweisen, dass er anschlägt, dann erst den Text korrigieren.**

| Schritt | Pay-per-Use | GPL |
|---|---|---|
| vor der Schärfung, Text falsch | `ok 0` ⛔ **übersehen** | `ok 0` ⛔ **übersehen** |
| nach der Schärfung, Text noch falsch | **`FEHLER 2`** → 04#461, 04#473 ✅ | **`FEHLER 2`** → 04#492, 04#498 ✅ |
| nach der Textkorrektur | `ok 0` ✅ | `ok 0` ✅ |
| Ur-Zustand einzeln zurückgesetzt (`finally` stellt wieder her) | **`FEHLER 1`** ✅ | **`FEHLER 1`** ✅ |

**Was genau geschärft wurde:**
* **GPL:** Der verbotene Nachbar hieß „Änderungen zurückfließen" und passte nicht auf „Änderungen
  **müssen** zurückfließen". Jetzt steht dort **`zurückfließen`** allein — ein eingeschobenes Wort
  kann das Muster nicht mehr brechen. Dazu zwei Varianten aus dem Selbsttest.
* **Pay-per-Use:** Neu ist **`Niedrig (monatlich)`** — die Preisangabe, die den Fehler ausmacht.
  ⚠️ **Produktnamen taugen als Nachbarn NICHT:** „MS 365" steht nach der Korrektur in der
  Subskriptionszeile **direkt über** der Pay-per-Use-Zeile, also im selben Fenster. Ich hatte sie
  zwischenzeitlich aufgenommen und wieder entfernt — sie melden die richtige Tabelle mit.
  **Gemessen, nicht geschätzt.**

---
---

# VIERTE DATEI: `05_Qualitaetssicherung.md` (235 Zeilen, 2 Abschnitte)

**Gelesen:** 31.08.2026, vollständig. **Nach Messung zuerst gelesen, nicht nach Größe:** Die
Vorabmessung nannte für M05 vier Begriffe mit null Treffern (`validierung`, `verifizierung`,
`10er`, `prüfverfahren`) — mehr als für 01, 02 und 06 zusammen.

⚠️ **Die auffälligste Zahl steht vor dem ersten Befund:** 235 Zeilen Lehrtext für **67 Fragen**.
Das ist **3,5 Zeilen je Frage** — die dünnste Datei des Bestands (04 hat 7,7, 02 hat 6,0).

## STAND: 2 BEFUNDE, BEIDE KORRIGIERT (31.08.2026)

| Nr | Fehlerklasse | Fundstelle | Entscheid und Umsetzung |
|---|---|---|---|
| B118 | Thema ohne Lehrtext (**10 Fragen**) | Modul 05 | ✅ **Abschnitt „Qualitätskosten" geschrieben**: die vier Kostenarten als Tabelle mit IT-Beispielen, Zehnerregel mit der Kostentreppe 1 € → 10 € → 100 € → 1.000 € |
| B119 | Thema ohne Lehrtext (**7 Fragen**) | Modul 05 | ✅ **Abschnitt „Audits und Prüfverfahren" geschrieben**: internes gegen externes Audit, Verifizierung gegen Validierung mit Merksatz und Beispiel, Vollprüfung gegen Stichprobe |

**Die Datei wächst dadurch von 235 auf 308 Zeilen** — von 3,5 auf 4,6 Zeilen je Frage.

**Zusammen sind das 17 von 67 Fragen — ein Viertel des Moduls prüft Stoff, den die Lernunterlage
nicht führt.**

---

### B118 — „Qualitätskosten": 10 Fragen, und in KEINER Kursdatei ein einziger Begriff dazu
**Fehlerklasse:** Verweisziel ohne Inhalt — **die bisher größte Fundstelle dieser Klasse.**
**Messung:** `pool_query` zählt in M05 das Thema **„Qualitätskosten" mit 10 Fragen**
(M05-013, -102, -201, -202, -307, -308, -402, -702, -950, -14). `grep` über **alle neun
Kursdateien**:

| Begriff | Treffer in allen neun Kursdateien |
|---|---|
| Qualitätskosten | **0** |
| Fehlerverhütungskosten / Fehlerverhütung | **0** |
| Prüfkosten | **0** |
| Fehlerkosten | **0** |
| Zehnerregel / 10er-Regel | **0** |
| Ausschuss | **0** |

**Was der Pool verlangt** (aus den richtigen Antworten):
* die **vier Kostenarten** — Fehlerverhütungskosten (Prävention), Prüfkosten, **interne** und
  **externe** Fehlerkosten — samt Zuordnung konkreter Ausgaben (M05-013, -202, -308, -702, -950)
* die **Zehnerregel der Fehlerkosten**: die Kosten verzehnfachen sich mit jeder Phase, in der der
  Fehler unentdeckt bleibt (M05-014, M05-201 rechnet damit: 100 € → **1.000 €**)

⚠️ **Die Datei erwähnt Kosten an keiner einzigen Stelle.** Sie führt QM-Begriffe, Zertifizierung,
PDCA und das Testprotokoll — und hört dort auf.
**Entscheidungsbedarf:** Abschnitt „Qualitätskosten" schreiben (vier Kostenarten als Tabelle mit
IT-Beispielen, Zehnerregel mit der Rechnung aus M05-201)? Rund 30 Zeilen.

### B119 — „Audit & Prüfverfahren": 7 Fragen, vier Zeilen Lehrtext
**Fehlerklasse:** Verweisziel ohne Inhalt.
**Was die Datei hat:** einen vierstufigen **Ablauf** der Zertifizierung (Vorbereitung → externes
Audit → Zertifikat → Überwachungsaudits) und die Gültigkeitsdauer.
**Was der Pool prüft und die Datei nicht führt:**
* **Internes gegen externes Audit** (M05-103, M05-309, M05-706) — wer prüft, mit welchem Zweck,
  und warum internes Audit die *Vorbereitung* auf die Zertifizierung ist. „internes Audit": **0
  Treffer** in allen neun Kursdateien.
* **Verifizierung gegen Validierung** (M05-104, M05-310 — ein Lückentext!): „Verifizierung prüft,
  ob das Produkt der Spezifikation entspricht (*das Produkt richtig gebaut*); Validierung prüft,
  ob es den Zweck erfüllt (*das richtige Produkt gebaut*)." **Beide Wörter: 0 Treffer.**
* **Stichprobenprüfung gegen Vollprüfung** (M05-105): bei vielen gleichartigen Einheiten ist die
  Stichprobe wirtschaftlich. „Stichprobe": **0 Treffer.**
* **Audit als Begriff** (M05-110, eine reine Begriffsfrage).

**Entscheidungsbedarf:** Abschnitt „Audits und Prüfverfahren" ergänzen (intern/extern,
Verifizierung/Validierung mit dem Merksatz, Stichprobe gegen Vollprüfung)? Rund 25 Zeilen.

## HINWEISE – KEIN BEFUND

* **Inhaltlich ist die Datei fehlerfrei.** ISO 9000 gegen ISO 9001, Zertifikatsdauer drei Jahre,
  jährliche Überwachungsaudits, PDCA mit einem durchgerechneten Beispiel, die Abgrenzung QS/QM —
  alles geprüft, nichts zu beanstanden. **Das Problem dieser Datei ist nicht, was falsch ist,
  sondern was fehlt.**
* Das Muster-Testprotokoll trägt das feste Prüfdatum **2026-07-03**. Dieselbe Klasse wie B107,
  aber nur wenige Wochen alt — mitkorrigieren, wenn ohnehin ein Lauf stattfindet.
* Der Selbsttest 5.2 Frage 2 (Schulung = Act oder Do?) ist gut gestellt und richtig begründet:
  aus der Check-Phase abgeleitet → Act; von Anfang an geplant → Do.

---
---

# FÜNFTE DATEI: `01_Projektmanagement_und_Arbeitsorganisation.md` (526 Zeilen, 3 Abschnitte)

**Gelesen:** 31.08.2026, vollständig. 125 Fragen, alle mit Verweis.

## STAND: 3 BEFUNDE, ALLE KORRIGIERT (31.08.2026)

| Nr | Fehlerklasse | Fundstelle | Entscheid und Umsetzung |
|---|---|---|---|
| B120 | Verweisziel ohne Inhalt | 01#19 | ✅ **DIN 69901 bei den Projektmerkmalen genannt** |
| B121 | **Rechenfehler** | 01#234 | ✅ **Summe auf 14.100 € korrigiert** (+1.400 €, +11,0 %), Bewertung angepasst und um den Hinweis ergänzt, dass die Gesamtkosten die Summe der Positionen sind |
| B122 | Begriff uneinheitlich | 01#29 | ✅ **„auch kritischer Pfad (englisch *critical path*)"** danebengestellt |

Dazu: „SCRUM" an **acht** Stellen auf **Scrum** gezogen (kein Akronym).

---

### B121 — Die Nachkalkulation rechnet nicht auf: 14.100 € stehen als 13.000 € da
**Fehlerklasse:** Rechenfehler. ⛔ **Der erste harte Rechenfehler in fünf gelesenen Kursdateien.**

Die Vorkalkulation stimmt: 3.400 + 2.400 + 5.100 + 1.800 = **12.700 €** ✅.
Die Nachkalkulation stimmt **positionsweise** und **in der Summe nicht**:

| Position | Rechnung | Kosten | Abweichung |
|---|---|---|---|
| Planung & Konzept | 45 h × 85 € | 3.825 € ✅ | +425 € ✅ |
| Softwarelizenzen | 12 × 200 € | 2.400 € ✅ | ±0 € ✅ |
| Implementierung & Tests | 75 h × 85 € | 6.375 € ✅ | +1.275 € ✅ |
| Schulung | 20 h × 75 € | 1.500 € ✅ | −300 € ✅ |
| **Summe laut Datei** | | **13.000 €** ⛔ | **+300 € (+2,4 %)** ⛔ |
| **Summe nachgerechnet** | | **14.100 €** | **+1.400 € (+11,0 %)** |

⚠️ **Die Bewertung darunter kippt mit:** „Projekt ist leicht über Budget (2,4 %), aber
akzeptabel." Bei **11 %** ist das eine andere Aussage — und Modul 07 nennt „meist < 5 %
akzeptabel" als Faustregel, also läge dieses Projekt außerhalb.
⚠️ **Der Lerner rechnet genau das nach** — die Datei fordert es in der IHK-Aufgabenliste
ausdrücklich („Vor- und Nachkalkulation vergleichen und Abweichungen analysieren").
**Entscheidungsbedarf:** Summe und Prozentwert korrigieren (14.100 € / +1.400 € / +11,0 %) und die
Bewertung anpassen — oder die Positionen so ändern, dass 13.000 € herauskommt?
►► **Ich schlage die erste Variante vor:** die Positionen sind einzeln richtig und mit den
Stundenzahlen belegt; falsch ist nur die Summe.

### B120 — DIN 69901 wird viermal geprüft und steht in keiner Kursdatei
**Fehlerklasse:** Verweisziel ohne Inhalt.
**Messung:** „DIN 69901" → **0 Treffer in allen neun Kursdateien.** Im Pool vier Fundstellen:
M01-001 („Welche Aussage definiert ein Projekt **nach DIN 69901** korrekt?"), M01-401, M01-461
und FALL-04-t1.
**Was die Datei hat:** eine Liste „Merkmale eines Projektes" (Einmaligkeit, Zielvorgabe, zeitliche
Begrenzung, begrenzte Ressourcen, Komplexität, projektspezifische Organisation) — **inhaltlich
deckungsgleich mit der Norm, aber ohne sie zu nennen.**
⚠️ **Das ist ein Nutzer-Entscheid vom 27./28.07.:** „IHK-Standard" = **DIN 69901**. Die Norm ist
gesetzt, nur der Lehrtext weiß nichts davon.
**Entscheidungsbedarf:** die Norm bei den Projektmerkmalen nennen (ein Halbsatz)?

### B122 — Der Lehrtext sagt „Kritischer Weg", fünf Verweise sagen „kritischer Pfad"
**Fehlerklasse:** Begriff uneinheitlich — dieselbe Lage wie MTTR (B105).
Die Datei schreibt konsequent **„Kritischer Weg (KW)"** (fünf Fundstellen inklusive Merksatz und
Selbsttest). Fünf Pool-Verweise nennen **„kritischer Pfad"**: M01-054, M01-433, M01-770, M01-772,
M01-992.
**Beide Bezeichnungen sind fachlich richtig und gebräuchlich** (englisch *critical path*), aber
der Lerner sucht nach dem Wort aus der Frage und findet es nicht.
**Entscheidungsbedarf:** die zweite Bezeichnung einmal danebenstellen („Kritischer Weg, auch
kritischer Pfad")?

## HINWEISE – KEIN BEFUND

* **Der Netzplan ist vollständig nachgerechnet und fehlerfrei** — Vorwärts- und Rückwärtsrechnung
  aller sechs Vorgänge, GP und FP je Vorgang, kritischer Weg A→C→D→E→F, Projektdauer 10 Tage,
  B mit 2 Tagen Puffer. **Das ist das sauberste Rechenbeispiel des Bestands.**
* Ebenfalls geprüft und richtig: Risikomatrix (alle fünf E×S-Produkte), Eisenhower-Matrix,
  Power-Interest-Grid, Tuckman-Modell, Support-Level-Anteile, Ticket-Lebenszyklus.
* „SCRUM" steht durchgehend in Großbuchstaben. **Scrum ist kein Akronym** — Kleinigkeit,
  mitkorrigierbar.
* „Meilenstein" kommt nur **einmal** vor, in einer Klammer im Gantt-Abschnitt, obwohl zwei Fragen
  ihn als Begriff abfragen (M01-103, M01-114). Grenzfall: die Definition ist ableitbar, aber dünn.
* **Zwei `--streng`-Kandidaten waren Fehlalarme**, wie erwartet: „lesen" (aus „Gantt-Diagramm
  lesen", 6 Fragen) und „zielformulierung" (die Datei hat „SMART-Prinzip für Ziele"). ⛔ Damit
  bestätigt sich: **das Werkzeug ist ein Kandidatenfilter, kein Urteil** — in dieser Datei war nur
  einer von drei Mehrfach-Treffern echt.

---
---

# SECHSTE DATEI: `06_IT-Sicherheit_und_Datenschutz.md` (495 Zeilen, 4 Abschnitte)

**Gelesen:** 31.08.2026, vollständig. 111 Fragen. **Die inhaltlich stärkste Datei des Bestands** —
CIA, TOM, DSGVO-Fristen, Social Engineering, Schutzbedarf, ISMS, Verschlüsselung: alles geprüft,
kein Sachfehler. Die zwei Befunde betreffen eine Lücke und eine Tabellenspalte.

## STAND: 2 BEFUNDE, BEIDE KORRIGIERT (31.08.2026)

| Nr | Fehlerklasse | Fundstelle | Entscheid und Umsetzung |
|---|---|---|---|
| B123 | Verweisziel ohne Inhalt | 06#311 | ✅ **Restore-Test, Offline-Kopie (Air-Gap) und Aufbewahrungsdauer ergänzt** — „Ein Backup, das nie zurückgespielt wurde, ist kein Backup" |
| B124 | Zahlenspalte wechselt die Bedeutung | 06#311 | ✅ **zwei getrennte Spalten**: „Für den Restore nötig" und „Belegter Speicher (kumuliert)", dazu der Hinweis, dass die Spalten bei inkrementeller Sicherung auseinanderfallen |

Dazu: „Schade:" → „Schaden:" (Risikotabelle) und „gleiche Input → gleiche Hash" berichtigt.

---

### B123 — „Restore-Test" fehlt, obwohl eine Frage genau danach fragt
**Fehlerklasse:** Verweisziel ohne Inhalt.
**Messung** über alle neun Kursdateien: „Restore-Test" **0** · „Rücksicherung" **0** ·
„Wiederherstellungstest" **0** · „Air-Gap" **0**.
**Dagegen im Pool:**
* **M06-772** fragt wörtlich: „**Warum gehört zu einem Backup-Konzept zwingend das regelmäßige
  Prüfen der Rücksicherung (Restore-Test)?**" — `verweis`: „Abschnitt 6.1 – Backup-Konzept:
  Restore-Test (Verfügbarkeit + Integrität)". Richtige Antwort: *Ein Backup ist nur so gut wie
  seine Wiederherstellbarkeit.*
* **M06-771** verweist auf „Verfügbarkeit/Backup-Konzept (**3-2-1, Restore-Test, Air-Gap**)" und
  prüft alle drei. **Von den dreien führt die Datei nur die 3-2-1-Regel.**

**Was die Datei hat:** Vollsicherung/differenziell/inkrementell, den Wochenplan, die 3-2-1-Regel
und NAS als Backup-Ziel. **Kein Satz darüber, dass eine Sicherung geprüft werden muss.**
⚠️ **Das ist der Kern der Frage, nicht ein Randthema:** Ein ungeprüftes Backup ist die
klassische Prüfungsfalle.
**Entscheidungsbedarf:** vier bis sechs Zeilen ergänzen — Restore-Test (regelmäßig, dokumentiert,
belegt Vollständigkeit und Integrität) und die Offline-/Air-Gap-Kopie als Schutz gegen
Ransomware, die erreichbare Backups mitverschlüsselt?

### B124 — Die Spalte „Kumulativ" im Wochenplan bedeutet in jeder Zeile etwas anderes
**Fehlerklasse:** Zahlenspalte ohne einheitliche Bedeutung.
Der Wochenplan (100 GB Bestand, 10 GB Änderung je Tag) führt:

| Tag | Größe | „Kumulativ" laut Datei | Summe aller Sicherungen | Für den Restore nötig |
|---|---|---|---|---|
| Mo Voll | 100 | 100 | 100 | 100 |
| Di Diff | 10 | 110 | 110 | 110 |
| Mi Diff | 20 | 120 | **130** | 120 |
| Do Diff | 30 | 130 | **160** | 130 |
| Fr Diff | 40 | 140 | **200** | 140 |
| Sa Voll | 100 | **240** | **300** | **100** |

**Bis Freitag rechnet die Spalte „Vollsicherung + aktuelle differenzielle Sicherung"** — also den
**Restore-Bedarf**, nicht den belegten Speicher. **Am Samstag wechselt sie die Bedeutung** und
addiert die neue Vollsicherung auf den Freitagswert: 140 + 100 = 240. Weder Restore-Bedarf (100)
noch Gesamtspeicher (300).
⚠️⚠️ **Und die Datei widerspricht sich selbst:** Selbsttest Frage 3 rechnet dieselbe Sache als
**Summe aller Sicherungen** und macht es dort **völlig richtig** (differenziell 50+100+150+200+
250+300 = 1.050 + 500 Voll = 1.550 GB; inkrementell 6 × 50 = 300 + 500 = 800 GB — beides
nachgerechnet ✅). **Zwei Zahlenlogiken für dieselbe Frage in einer Datei.**
⚠️ Die IHK-Aufgabenliste der Datei nennt ausdrücklich „**Wochenplan berechnen**".
**Entscheidungsbedarf:** Spalte in **„für Restore nötig"** umbenennen und die Samstagszeile auf
100 GB setzen — **oder** eine zweite Spalte „Summe aller Sicherungen" daneben, damit beide
Lesarten sichtbar sind? ►► **Ich schlage die zweite Variante vor:** Der Selbsttest fragt nach der
Summe, die Tabelle nach dem Restore-Bedarf — der Lerner braucht beide.

## HINWEISE – KEIN BEFUND

* **Kein einziger Sachfehler in 495 Zeilen.** Geprüft: CIA-Zuordnung, TOM nach Art. 32 DSGVO,
  DSB-Pflicht nach § 38 BDSG (20 Personen), die **72-Stunden-Frist ab Bekanntwerden** (Art. 33)
  und die Benachrichtigung Betroffener bei hohem Risiko (Art. 34), Anonymisierung gegen
  Pseudonymisierung, AVV nach Art. 28, Drittlandtransfer mit SCC, Maximumprinzip/Kumulations-/
  Verteilungseffekt, ISO 27001, die sieben Social-Engineering-Arten, Zugang gegen Zugriff,
  Hash/Zertifikat/Signatur, die drei Authentifizierungsfaktoren.
* Tippfehler: die Risikotabelle in 6.3 überschreibt drei Spalten mit „**Schade:** Normal / Hoch /
  Sehr hoch" statt „Schaden". Dazu „gleiche Input → gleiche Hash".
* **Zwei Risikomatrizen in derselben Datei** (6.3 „Risiko-Klassifikation" mit
  Wahrscheinlichkeits-Prozenten, direkt darunter „Risikoanalyse und Risikomatrix" mit den vier
  Strategien). Inhaltlich beide richtig und sie ergänzen sich — **kein Befund**, aber wer eine
  ändert, muss die andere mitlesen.
* ⚠️ **Ein Fehlalarm meiner eigenen Messung, gestoppt bevor er ein Befund wurde:**
  `pool_query.js suche "RPO"` meldete 18 Fundstellen — darunter „ISO 9241" und „Präsentation und
  Medienkompetenz". **`suche` matcht Teilzeichenketten:** „RPO" steckt in „Cor**po**rate", „RTO"
  in „Wo**rto**rdnung". **Vor jeder Meldung die auswertende Funktion lesen** — RPO/RTO sind im
  Bestand gar kein Thema.

---
---

# SIEBTE DATEI: `02_Kundenberatung_Kommunikation_Marketing.md` (678 Zeilen, 5 Abschnitte)

**Gelesen:** 31.08.2026, vollständig. 113 Fragen.
⚠️ **Diese Datei war die Gegenprobe zum Werkzeug:** Die Vorabmessung mit `--streng` nannte für M02
als einziges Modul **keinen einzigen** Kandidaten. **Das Lesen hat die Vorhersage bestätigt** —
kein einziges Verweisziel ohne Inhalt, kein Rechenfehler, kein Sachfehler.
►► **Ein Messwerkzeug, das auch richtig „nichts" sagt, ist mehr wert als eines, das nur Treffer
meldet.**

## STAND: 1 BEFUND, KORRIGIERT (31.08.2026)

| Nr | Fehlerklasse | Fundstelle | Entscheid und Umsetzung |
|---|---|---|---|
| B125 | alternde Jahreszahlen | 02#486 | ✅ **auf relative Angaben umgestellt** (Kriterium, Beispieltabelle und Selbsttest), dazu der Satz: **feste Jahreszahlen taugen als Maßstab nicht, gefragt ist der Abstand zum heutigen Tag** |

Dazu: „unterschied zwischen" berichtigt.

---

### B125 — Ausgerechnet der Abschnitt über Aktualität ist nicht mehr aktuell
**Fehlerklasse:** alternde Beispiele und Jahreszahlen (wie B107, B98).
Der Abschnitt „**Bewertung von Quellen: Seriosität, Aktualität, Urheber**" lehrt, Quellen auf ihr
Alter zu prüfen — und arbeitet dabei mit festen Jahreszahlen, die inzwischen selbst gealtert sind:

| Stelle | Text | Stand heute (2026) |
|---|---|---|
| Kriterium Aktualität | „Ein **Datenblatt von 2023 ist aktuell**" | drei Jahre alt |
| Beispieltabelle | BSI.de: „**2024 aktualisiert**" gegen Blog: „letztes Update vor 3 Jahren" | beide Angaben verschoben |
| Selbsttest Frage 1 | Stiftung Warentest **2022** gegen Sicherheits-Blog **2024** | die „aktuelle" Quelle ist zwei Jahre alt |

⚠️ **Die Aussage kippt mit der Zeit:** „von 2023 ist aktuell" war 2024 richtig und ist heute die
Gegenthese zu dem, was der Abschnitt lehren will.
**Entscheidungsbedarf:** auf **relative** Angaben umstellen („ein Datenblatt aus dem letzten Jahr",
„Update vor drei Jahren") — dieselbe Lösung wie bei B107. Die Selbsttest-Frage bleibt inhaltlich
gleich, nur ohne feste Jahre.

## HINWEISE – KEIN BEFUND

* **Alle Rechnungen nachgerechnet, alle richtig:**
  * Bezugskalkulation 5.000 − 20 % → 4.000 − 2 % → 3.920 + 80 = **4.000 €** ✅
  * Selbsttest: 2.000 − 10 % → 1.800 − 3 % → 1.746 + 50 = **1.796 €** ✅
  * Skonto-Jahreszins 2/98 × 360/40 × 100 = **18,4 %** ✅ und 3/97 × 360/20 × 100 = **55,7 %** ✅
  * Verkaufspreis 4.000 + 25 % = 5.000 + 19 % USt = **5.950 €** ✅
  * **Nutzwertanalyse: alle zwölf gewichteten Einzelwerte und alle drei Summen** (A 7,4 · B 7,4 ·
    C 7,6) ✅ — und der Gleichstand von A und B wird im Selbsttest sogar aufgegriffen.
* Ebenfalls geprüft und richtig: Marktformen, Käufer-/Verkäufermarkt, 4-Ohren-Modell mit
  Beispielanalyse, Sender-Empfänger-Modell mit den drei Störquellenarten, Fragetypen,
  Vertriebsformen.
* Sprachliches: „unterschied zwischen" (klein) in 2.4; „Polypol (**Polypoly**)" — die englische
  Entsprechung ist ungebräuchlich.
* Die Bezugskalkulation wechselt im Beispiel zum Stückpreis unangekündigt die Zahlen (4.000 € im
  Schema, dann „1.750 € für 250 Stück"). Rechnerisch richtig (7,00 €/Stück), didaktisch ein
  Sprung. Grenzfall.


---
---

# BILANZ DER ETAPPE VI — ALLE SIEBEN KURSDATEIEN GELESEN (31.08.2026)

| Datei | Zeilen | Fragen | Befunde | je Zeile | Verweisziel ohne Inhalt |
|---|---|---|---|---|---|
| `03_IT-Systeme` | 616 | — | 10 | je 62 | 3 Befunde, 5 Fragen |
| `07_Leistungserbringung` | 943 | ~185 | 8 | je 118 | 2 Befunde, **18 Fragen** |
| `04_IT-Lösungen` | 1414 | 191 | 10 | je 141 | 3 Befunde, 6 Fragen |
| `05_Qualitätssicherung` | **235** | 67 | 2 | je 118 | 2 Befunde, **17 Fragen** |
| `01_Projektmanagement` | 526 | 125 | 3 | je 175 | 1 Befund, 4 Fragen |
| `06_IT-Sicherheit` | 495 | 111 | 2 | je 248 | 1 Befund, 2 Fragen |
| `02_Kundenberatung` | 678 | 113 | **1** | je 678 | **0** |
| **Summe** | **4907** | | **36** | **je 136** | **12 Befunde, 52 Fragen** |

(`00_Themenuebersicht.md` und `99_Spickzettel.md` sind keine Verweisziele — **null** Fragen zeigen
darauf; der Spickzettel wurde bei B93/B94 mitkorrigiert.)

## WAS DIESE RUNDE GEZEIGT HAT

**1. Die stärkste Fehlerklasse war vorher unsichtbar.** „Das Verweisziel existiert, aber der
Begriff der Frage steht nicht darin" stellte **12 der 36 Befunde** und betraf **52 Fragen** —
mehr als alle anderen Klassen zusammen. Kein Wächter konnte sie finden: der `verweis`-Wächter
prüft, **ob** ein Abschnitt existiert, nie **was** darin steht.

**2. Die Klasse ist mechanisch messbar, und das Werkzeug dafür steht jetzt.**
`e3_gegenprobe.py --streng` meldet jeden Begriff, der in keinem Zielabschnitt vorkommt, nach
Begriff aggregiert. Es hat in dieser Runde `IaaS`/`PaaS`, `Zählschleife`, `Tunnel`,
`Validierung`, `Restore` und `DIN 69901` gefunden — und für `02_Kundenberatung` **richtig
vorhergesagt, dass dort nichts ist**. ⚠️ **Kandidatenfilter, kein Urteil:** In M03 waren fünf von
sieben Meldungen Wortformen, in M07 keine einzige. **Die Quote schwankt je Modul; jeder Treffer
wird einzeln gelesen.**

**3. Rechenfehler sind die Ausnahme, nicht die Regel.** Über sieben Dateien wurden **rund 40
Rechenbeispiele** nachgerechnet — Subnetting, Netzplan, Bezugskalkulation, Skonto-Jahreszins,
Nutzwertanalyse, TCO, Energiekosten, Schreibtischtest, Backup-Mengen. **Zwei waren falsch**
(B121 Summenzeile, B104 Rundung), einer war mehrdeutig (B124). Der Rest stimmte.

**4. Drei Rückfälle in belegte Fehlerklassen — alle in Modul 04.** Dort waren am 27.08. die Anker
`GPL` und `Pay-per-Use` entstanden; drei Fundstellen derselben Fehler standen weiter darin, einer
sieben Zeilen unter der Richtigstellung. **Beide Wächter schwiegen**, weil ein eingeschobenes Wort
das Muster brach und eine Preisangabe fehlte. Beide sind geschärft und gegengeprobt.

**5. Die dünnste Datei war die gefährlichste.** `05_Qualitätssicherung` hatte 3,5 Zeilen Lehrtext
je Frage — und ein Viertel des Moduls ohne jeden Lehrtext. **Zeilen je Frage ist ein billiger
Vorabindikator**, den man vor dem Lesen berechnen kann.

**6. Der teuerste Befund war der, den ich nicht belegen konnte.** B106 blieb am Ende von
Etappe VI offen, weil das `WebFetch`-Limit erreicht war — und Arbeitsregel 4 verbietet die
Bedeutungsänderung ohne Beleg. Nachgeholt am 02.09.2026: Der Zweifel war berechtigt, es waren
**fünf** statt vier Stellen, und der Pool hatte die richtige Fassung seit Etappe 3 im Haus. Der
Lehrtext widersprach also der eigenen Frage, und **kein Wächter kann das sehen**: `verweis` prüft
die Existenz des Ziels, `--streng` das Vorkommen des Stichworts. Den *Widerspruch* zwischen Frage
und Ziel prüft nichts. Das ist die nächste Lücke im Prüfwerkzeug.

✅ **Etappe VI hat damit keinen offenen Punkt mehr.**


## NACHLESE 07.09.2026 — `--streng` ein zweites Mal, sechs Tage später: B134 und B135

**Anlass:** Es stand nur noch eine Ermessensfrage offen (Lehrtext 3.2 ausbauen, unbelegt). Statt sie
zu entscheiden, wurde die Projektlehre befolgt — **„Vor jeder neuen Lehrtext-Runde:
`e3_gegenprobe.py --streng`"** — und der Lauf hat zwei echte Befunde geliefert, die 3.2 gar nicht
betreffen.

**Der Lauf meldet 215 Begriffe ohne Vorkommen im Zielabschnitt. Das ist ein Kandidatenfilter.**
Verfahren wie am 31.08.: die Kandidaten mit mehr als einem Verweis (34) durchgesehen und **gegen ALLE
Kursdateien gehalten** — nicht nur gegen den Zielabschnitt. Damit trennt sich die Wortform vom Loch:

| Kandidat | Treffer in den Kursdateien | Urteil |
|---|---|---|
| `referenzmodell` (6 Fragen) | 0 — der Text schreibt „OSI-Modell" | **Fehlalarm**, am 04.09. bereits entschieden |
| `stromkosten` (2) | „Energiekosten" 5 · „Stromverbrauch" 6 · „kWh" 7 | **Fehlalarm** — Thema voll abgedeckt |
| `mainboard` (2) · `partitionieren` (2) · `kenngrößen` (3) · `apipa` (2) | 1 · 4 · 2 · 4 | **Fehlalarme** |
| `suchalgorithmen` (2) | „lineare/binäre Suche" in **4.6**, Verweis zeigt auf **4.7** | **B135** |
| `exfat` (2) | **0 in allen Kursdateien** | **B134** |

### B134 — exFAT fehlte in der Dateisystem-Tabelle, die es versprach
Abschnitt 3.3 führt eine Tabelle mit **FAT32, NTFS, APFS, ext4**. **exFAT fehlte.**
⚠️ **Und es ist Prüfsubstanz, nicht Nebentext:** `M03-606` stellt vier Dateisysteme gegeneinander,
exFAT ist eine eigene Option („keine Rechteverwaltung, aber Dateien über 4 GB …"), hat eine eigene
Distraktorerklärung und einen eigenen Punkt in der Langerklärung. **Beide Verweise nennen es
ausdrücklich** — `„3.3 – Dateisysteme: Vergleich NTFS, exFAT, FAT32, APFS"`.
►► **Der Lerner klickt den Verweis genau dann, wenn er die Frage falsch hatte** — und fand von den
vier verglichenen Systemen nur drei. **Genau die B90/B91-Klasse.**
**Nutzer-Entscheid 07.09.: Tabellenzeile ergänzen.** Werte wortgleich zu dem, was die Frage bereits
behauptet: 16 EB · große USB-Sticks, SD-Karten, externe Platten · Nachfolger von FAT32, von Windows,
macOS und Linux les- und schreibbar, **keine Zugriffsrechte und kein Journaling**.

### B135 — der Verweis nannte ein Stichwort, das eine Tür weiter steht
`M04-944` und `M04-945` verwiesen auf `„4.7 – Schreibtischtest: Suchalgorithmen"`. **Der
Schreibtischtest steht dort tatsächlich** (4.7, „Schreibtischtest-Beispiel (ZWINGEND!)"), **lineare
und binäre Suche stehen aber in 4.6** — der Kurstext verlinkt von dort selbst nach 4.7 weiter.
⚠️ **Schwächer als B134, und deshalb anders behandelt:** das *gefragte Verfahren* steht am Ziel, nur
das Beiwort nicht. Beide Fragen sind Schreibtischtests auf Minimum- und Maximumsuche — „Suchalgorithmen"
war ein Etikett, kein Prüfgegenstand.
**Nutzer-Entscheid: Verweistext kürzen** (`verweis_setzen.py --batch`), kein Doppelverweis.

### Was diese Nachlese zeigt
⚠️⚠️ **DIE ERMESSENSFRAGE WAR DIE FALSCHE FRAGE.** Sechs Wochen lang stand „3.2 ausbauen?" als
einziger Lehrtext-Punkt im Kopf — unbelegt, weil ein Zeichen-je-Frage-Maß dahinterstand, das am
04.09. selbst als untauglich erkannt wurde. **Der Lauf, der stattdessen gefahren wurde, brauchte
vier Aufrufe und fand zwei belegte Befunde in ganz anderen Modulen.**
►► **Ein Kandidatenfilter, der nach dem Aufräumen erneut läuft, ist nicht verbraucht** — er meldet
weiter, was seither dazugekommen oder nie geprüft worden ist. `--streng` ist am 31.08. auf B90/B91
kalibriert worden; **die 34 Mehrfach-Kandidaten einmal gegen alle Kursdateien zu halten kostet einen
Aufruf und trennt Wortform von Loch.**


### B136 — 17 Begriffe standen in der Prüfsubstanz und in keiner Kursdatei (07.09., Nachmittag)

⚠️⚠️ **DER BEFUND VON HEUTE MORGEN WAR NUR DIE HÄLFTE DER MESSUNG.** `--streng` meldete 213
Begriffe; ich hatte die **34 mit mehr als einem Verweis** gelesen (→ B134, B135) und die
**181 mit nur einem Verweis liegen lassen** — weil das Werkzeug sie gar nicht ausdruckt. Der Kopf
des Werkzeugs sagt selbst, warum das riskant ist: *„eine Lücke wird erst sichtbar, wenn man sieht,
dass DERSELBE Begriff aus mehreren Verweisen fehlt"* — **das ist die Aggregationsregel, kein
Ausschlusskriterium.** B90 (IaaS/PaaS) hing seinerzeit an genau einer Frage.

#### Das Sieb — vier Aufrufe, und es gehört ins Repertoire
1. `--streng` **abfangen statt lesen:** `streng_bericht` durch einen Sammler ersetzen und
   `alle_verweise()` mit umgeleitetem `stdout` aufrufen. Man bekommt das volle `luecken`-Dict.
2. Die Einzel-Kandidaten (`len(v) == 1`) gegen den **Volltext ALLER Kursdateien** halten, nicht
   gegen ihren Zielabschnitt. **Ergebnis: 87 von 181 kommen nirgends vor.**
3. Diese 87 von Hand lesen. Der Großteil ist erwartbar Rauschen: Firmennamen (`sassenhagen`,
   `wenninghoff`, `kastenholz`), Wortformen (`ausdrücken`, `mehrfache`, `moderner`) und
   Komposita, deren Grundwort dasteht (`mittelwertberechnung`, `segmentlängen`).
4. Für die verbleibenden Fachbegriffe **`abdeckung.py --begriff` fahren** — es trennt
   Prüfsubstanz von Nebentext. **Damit stand die Zahl: 17 Begriffe mit Prüfsubstanz und null
   Fundstellen im Kurstext.**

#### Was gefunden wurde — drei Blöcke, alle bestätigt und alle geschlossen
**1. Virtualisierung (Modul 03).** „Virtualisierung", „Hypervisor" und „Container": **je 0
Treffer in allen Kursdateien** — bei einem Feinthema, das **„Cloud & Virtualisierung" heisst**.
Prüfsubstanz: `M03-602` (Hypervisor Typ 1 gegen Typ 2), `M03-603` und `M03-900` (VM gegen
Container), `M03-111`.
⚠️⚠️ **UND DAS IST DERSELBE ABSCHNITT WIE B90.** Am 31.08. wurde dort IaaS/PaaS nachgetragen
(heute 3 bzw. 2 Treffer) — **Hypervisor und Container blieben liegen.** Eine Lücke zu schliessen
heisst nicht, die Klasse zu schliessen: **wer einen fehlenden Begriff nachträgt, prüft die
Nachbarbegriffe desselben Themas mit.**
⚠️ **Der Prüfungskatalog führt Virtualisierung nur in Teil 2** (mit dem geparsten
`katalog_teil1.json` gemessen: 0 Treffer, nicht per grep geraten). **Das ist kein Grund, den
Lehrtext wegzulassen** — die Vorbemerkung sagt ausdrücklich, der Katalog „schränkt die
zugrundeliegenden Ordnungsmittel nicht ein", und Präzedenz B129 vom 03.09. lautete „stehen lassen".
**Nutzer-Entscheid 07.09.: Lehrtext ergänzen**, neuer Abschnitt in 3.1 (Hypervisor Typ 1/2,
VM gegen Container mit der Isolationsebene als Kern, und die Abwägung in BEIDE Richtungen).

**2. Konsolenbefehle (Modul 04).** Die Befehlstabelle in 4.5 führte `ipconfig`, `ping`, `tracert`,
`nslookup`, `arp` — **`netstat` (4 Fragen Substanz), `tasklist` (3), `getmac` (2), `whoami` (1)
fehlten.**
►► **Und der Nachscan hat die Lücke verdoppelt:** derselbe Griff über die Musterlösungen der
`konsole`-Fragen fand **sieben weitere Befehle ohne Fundstelle** — `taskkill`, `systeminfo`,
`route print`, `nbtstat`, `ps aux`, `kill`, `ipconfig /flushdns`. **Elf statt vier.**
⚠️ Hätte ich nur die vier gesetzt, wäre es „eine Korrektur, die nur den Scanner zufriedenstellt"
gewesen — die Fehlerklasse war die Tabelle, nicht der einzelne Befehl. Alle elf ergänzt, je mit
Windows- und Linux-Gegenstück, plus zwei Hinweise (`-n` bei `netstat`, PID vor `taskkill`).

**3. Vier Einzelfälle, alle geschlossen.** **Pönale** (3 Fragen: `M07-703`, `M07-771`, `FALL-07`;
der Kurstext kannte nur „Vertragsstrafe", 1×) → 7.1 um Pönale/Konventionalstrafe ergänzt, samt
der Abgrenzung, dass sie ausdrücklich vereinbart sein muss und die Vertragsart nicht ersetzt.
**Johari-Fenster** (`M02-702`, matrix) → 2.3 um das Vier-Felder-Modell **mit den Signalwörtern**
ergänzt, an denen die Zuordnung in der Frage tatsächlich hängt. **Sequenznummern** (`M03-436`) →
beim Drei-Wege-Handshake ergänzt, wozu die drei Schritte da sind. **Zonendatei** (`M04-516`) →
eigener Block in 4.5 mit A/AAAA/CNAME/MX und der Regel A-und-CNAME-am-selben-Namen.

#### Gegenprobe
Alle 17 Begriffe stehen jetzt im Kurstext (je 1–5 Treffer, einzeln nachgezählt). Das Sieb fällt von
**87 auf 74**, `--streng` insgesamt von **213 auf 199** Begriffe. Die verbleibenden 74 sind die
durchgesehenen Wortformen und Eigennamen. `check.sh block` → ALLES GRÜN.

⚠️⚠️ **DIE LEHRE, DIE TEUER WAR: ICH HABE DEN FILTER FÜR ERSCHÖPFT GEHALTEN, WEIL SEINE AUSGABE
ES NAHELEGTE.** Der Bericht druckt die Mehrfach-Kandidaten und nennt die Einzelnen nur als Zahl in
Klammern. **Zwölf Stunden vorher hatte derselbe Lauf zwei Befunde geliefert; dass 181 Kandidaten
ungedruckt danebenlagen, ist mir erst beim zweiten Hinsehen aufgefallen.**
►► **Was ein Werkzeug NICHT ausdruckt, ist nicht geprüft — auch wenn es die Zahl nennt.**


### Der Waechter „Pruefsubstanz ohne Lehrtext-Fundstelle": GEMESSEN UND VERWORFEN (07.09.)

**Der Gedanke lag nach B136 nahe:** wenn 17 Begriffe in der Pruefsubstanz standen und in keiner
Kursdatei, warum das nicht dauerhaft bewachen? Die Projektregel verlangt vorher die Messung —
**erst messen, ob es mechanisch billig geht.** Sie ist gefahren, und die Antwort ist nein.

**Messung** (ueber `abdeckung.py`, also mit der geprueften Substanz/Nebentext-Trennung, nicht
nachgebaut): Kandidaten waren Akronyme und Bezeichner in Backticks aus dem Rohtext aller Fragen.

| | Zahl |
|---|---|
| Kandidaten gesamt | 992 |
| davon ohne Fundstelle im Kurstext | 312 |
| davon **mit Pruefsubstanz** | **192** |

⛔ **Und die 192 sind ueberwiegend Rauschen — aber ein Rauschen, das sich nicht mechanisch
abtrennen laesst:**
* **Versalien zur Betonung.** `SOLLTEN`, `GESAMTEN`, `UNMITTELBAR`, `EINSCHLIESSLICH`,
  `BEDEUTEN` — Woerter, die eine Frage gross setzt, um sie hervorzuheben.
  ⚠️⚠️ **Und sie fehlen tatsaechlich im Kurstext** — nachgeprueft: „sollten" kommt in allen acht
  Kursdateien **null** Mal vor. **Die Lernunterlage ist so telegrafisch geschrieben, dass
  Allerweltswoerter darin nicht vorkommen.** Der Filter irrt also nicht, er misst nur etwas
  anderes als gedacht.
* **Modul 08 stellt allein rund ein Drittel** (`TARIFVERTRAG`, `AUSBILDUNGSVERTRAG`,
  `BERUFSSCHULE`, `MITBESTIMMUNG`, `OHG` …) — aus einem Grund, der kein Fehler ist, siehe unten.

►► **Ein Waechter braeuchte eine gepflegte Ausnahmeliste in der Groessenordnung von 200 Eintraegen**
— gegen 17 echte Funde einer einmaligen Durchsicht. `zitate_belegt.json` fuehrt 5 Eintraege,
`begriffe_belegt.json` 9. **Das ist eine andere Groessenordnung.** Absage, wie bei G1 und G2.
✅ **WAS STATTDESSEN GILT: das Sieb aus B136 von Hand fahren, wenn eine Lehrtext-Runde ansteht.**
Es kostet vier Aufrufe, weil seine Kandidaten aus **Verweistexten** stammen — und die enthalten
naturgemaess nur Fachbegriffe, kein Fliesstext-Rauschen. **Genau deshalb hat es funktioniert.**

### Nebenbefund, aufgeklaert: Modul 08 hat keine Kursdatei — und das ist Absicht

Die M08-Haeufung in der Messung sah zunaechst nach einer riesigen Luecke aus. **Sie ist keine.**
* Es gibt `00_` bis `07_`, aber **kein `08_*.md`** — Modul 08 (Wirtschafts- und Sozialkunde,
  Recht) hat keine Lernunterlage.
* **Alle 103 M08-Fragen haben trotzdem einen `verweis`** (100 %, wie jedes andere Modul) — er
  zeigt aber auf **Gesetzesstellen statt auf Abschnitte**: `„BBiG § 20, WiSo-Grundlagen:
  Probezeit"`. Deshalb schlaegt auch der Verweis-Ziele-Guard nicht an: er prueft nummerierte
  Abschnitte, und M08 nennt keine.
* Das ist der Entscheid vom 24.08. in der Praxis: **`WISO_SPICK_M08.md` bleibt eine reine Datei,
  nicht verdrahtet.**
⛔ **Kein Handlungsbedarf, nicht erneut aufwerfen.** Wer bei M08 eine „fehlende Lernunterlage"
misst, misst eine Bestandsentscheidung.


### Gegenlesen des eigenen Lehrtexts (07.09.) — ein Befund, und zwar B106 in eigener Sache

**Anlass:** Die 92 Zeilen Lehrtext aus B136 waren geschrieben, aber nie gegen die Fragen
gegengelesen worden, die sie stuetzen sollen. **Keine Suite deckt die `0X_*.md` ab** — und die
Projektlehre B106 sagt: *Ziel da, Begriff drin — und trotzdem falsch.* Also Diff gelesen und jede
gestuetzte Frage danebengehalten.

**Sieben von acht Ergaenzungen halten:** Hypervisor Typ 1/2 deckt `M03-602` wortgleich · die
Container/VM-Tabelle deckt `M03-900` · die elf Konsolenbefehle decken die Musterloesungen von
`M04-913/916/917/976/977/978` einschliesslich `taskkill /PID /F` und `kill 4321` · Poenale deckt
`M07-703`/`M07-771` · die Johari-Achsen stehen so, wie `M02-702` sie beschreibt · Sequenznummern
und Zonendatei passen zu `M03-436` und `M04-516`.

### ⚠️⚠️ B137 — der neue Lehrtext beantwortete die Frage nicht, auf die er verweist
`M03-603` fragt: *„warum ein Unternehmen fuer einen Webserver (**hoher Durchsatz, Massendaten,
tausende Prozesse**) eher zu VMs statt zu Containern greifen koennte"*. Die Musterloesung fuehrt
**vier** Gruende — Isolation, Kompatibilitaet, **Ressourcenzuteilung** und Altsysteme.
**Mein Abschnitt nannte drei davon und liess ausgerechnet den weg, der zum Szenario passt:**
dass sich einer VM CPU und Arbeitsspeicher **fest zuteilen** lassen, waehrend Container sich die
Maschine teilen.
⛔⛔ **UND ER LEGTE DAS GEGENTEIL NAHE.** Die Zeile „Container: schnell, ressourcenarm" gegen „VM:
langsamer, mehr Arbeitsspeicher" liest sich bei einer Last-Frage wie ein Argument FUER Container.
**Der Lerner, der die Frage falsch hatte und dem Verweis folgt, haette dort keinen passenden Grund
gefunden — sondern einen scheinbaren Gegengrund.**
✅ **Behoben:** eine Tabellenzeile „Ressourcen" (fest zuteilbar gegen geteilt) und die Abwaegung
auf **vier** Lagen erweitert, dazu der Satz **„leichter heisst nicht leistungsfaehiger"** — im
Leerlauf brauchen Container weniger, unter Last bremsen sie sich gegenseitig.

►►► **DIE LEHRE, UND SIE IST UNANGENEHM: ICH HABE B106 AM SELBEN TAG NACHGEBAUT, AN DEM ICH SIE
ZITIERT HABE.** Der Lehrtext entstand aus der Fragenlektuere — aber aus der Frage, nicht aus der
**Musterloesung**. Die Pflichtbegriffe waren gedeckt, der Waechter haette geschwiegen, und
`--streng` haette den Begriff gefunden. **Nichts von alledem prueft, ob der Abschnitt die Frage
beantwortet.**
►► **REGEL: Wer Lehrtext zu einer Frage schreibt, schreibt ihn gegen die MUSTERLOESUNG bzw. die
richtige Antwort — nicht gegen den Fragetext.** Und liest ihn danach noch einmal gegen das
Szenario der Frage.


### B138 — der Musterlösungs-Filter: 30 Lücken geschlossen, und drei Kalibrierungsfallen (07.09.)

**Der Filter folgt direkt aus B137:** `--streng` hält die Stichworte des **Verweistextes** gegen
den Zielabschnitt. Nach B137 war die Frage: hält der Zielabschnitt auch die **Pflichtbegriffe der
MUSTERLÖSUNG**? 101 Fragen haben beides.

#### ⚠️⚠️ DREI FEHLALARM-QUELLEN, JEDE EINZELN ENTLARVT — UND DIE ERSTE FAST ZU SPÄT
| Falle | Wirkung | Erkannt woran |
|---|---|---|
| **`abschnitte()` liefert KLEINGESCHRIEBENEN Text, `trifft()` vergleicht case-sensitive** | fast alles „fehlt" | zwei Läufe widersprachen sich (22 gegen 152), und `GPL` stand angeblich nicht in 4.4 „Urheberrecht und Lizenzmodelle" |
| **Aufgabenwerte als Pflichtbegriff** (`480`, `12 Stunden`) | Rechenwerte können nie im Lehrtext stehen | beim Lesen der Liste |
| **Markdown zerschneidet Wörter**: der Kurstext schreibt `**M**essbar` | SMART galt als ungedeckt, obwohl alle fünf Buchstaben dastehen | beim Nachschlagen der Stelle |

►►► **ICH HÄTTE FAST EINE LISTE MIT 152 „LÜCKEN" VORGELEGT.** Gerettet hat nicht die Sorgfalt,
sondern **ein Widerspruch zwischen zwei Läufen** — die Regel „vor jeder Meldung über den Pool die
auswertende Funktion lesen" habe ich erst befolgt, als die Zahl unplausibel war.
✅ **Gegenproben, die jetzt jeder Lauf vorweg fährt:** `gpl` in 4.4 · `vertraulichkeit` in 6.2 ·
`messbar` in 1.1 — drei Fälle mit bekannter Antwort, alle drei True.

#### Das belastbare Ergebnis
| | vor der Runde | nach der Runde |
|---|---|---|
| Rauschen (Zahlen, Zeitangaben) | 32 | 32 |
| **Klasse A** – Begriff nirgends im Modul | **16** | **2** |
| **Klasse B** – im Modul, nicht am Ziel | **14** | **7** |
Die verbliebenen 2 sind die Aufgabenwerte aus `M05-604`; die verbliebenen 7 sind Allerweltswörter
(`Verfügbarkeit`, `Updates`, `Firma`, `Monitoring` …), deren Verweis auf den **fachlich richtigen**
Abschnitt zeigt — der Begriff steht anderswo, das Thema aber am Ziel.

#### Was geschrieben wurde — elf Ergänzungen, alle gegen die MUSTERLÖSUNG
* **M01** Ursachen einer Kalkulationsabweichung (Datenqualität, Altlasten, Kompatibilität).
* **M02** **Teilnutzwert** und **Gesamtnutzwert** benannt (der Text sagte nur „Wertzahl") · warum
  die Anfragephase über die Wertschöpfung entscheidet (**Vorleistungen**, **Nacharbeit**).
* **M03** `P_out`/`P_in` als **Ausgangs- und Eingangsleistung** ausgeschrieben · **Wertschöpfung**
  definiert samt Rechenschema und Abgrenzung zum Gewinn · **WLAN-Planung** (Reichweite, Kapazität,
  **SSID** und **Roaming**) · **Screenreader**, Lupe, Kontrast, Tastatur-Navigation.
* **M04** **Zero-Trust** gegen **Perimeter-Sicherheit** · sporadische Fehler (**Dauer-Ping** mit
  Zeitstempel, **Logfiles** gegen Stoßzeiten) · **Versionskontrolle** als Teil der IDE.
* **M07** wie ein Prokurist zeichnet (**`ppa.`**, drei Bestandteile, Abgrenzung `i. V.`/`i. A.`) ·
  Aufbauorganisation als Hebel (Hierarchiestufen, **Wertschöpfung**, Weisungswege) · **Mission**,
  Vision und Leitbild getrennt.

⚠️ **Klasse B war zweimal ein Fehlalarm auf VERWEISEBENE und trotzdem eine echte Begriffslücke:**
Bei `M03-612` ist 3.3 der richtige Abschnitt (Barrierefreiheit steht dort) — es fehlten nur die
Hilfsmittel. Bei `M04-113` ist 4.3 richtig — es fehlte nur die Versionskontrolle.
►► **„Der Begriff steht in einem anderen Abschnitt" heisst nicht „der Verweis ist falsch".**

### B145 — drei Verweise zeigten ins Nachbarkapitel, und der Wächter sah darüber hinweg (08.09.)
**Fehlerklasse: das Verweisziel existiert, aber der Stoff der Frage steht nicht darin (B90/B91).**

Gefunden **nicht durch eine Messrunde, sondern beim Schreiben neuer Fragen** für dasselbe Thema:
`M05-104`, `M05-105` und `M05-310` verwiesen auf **Modul 05, Abschnitt 5.2**. Ihr Stoff steht in
**5.1**: „Verifizierung und Validierung — die Standardverwechslung" (Zeile 118) und „Vollprüfung
oder Stichprobe?" (Zeile 127) stehen beide unter *5.1 › Audits und Prüfverfahren*; 5.2 handelt von
Qualitätsplanung, PDCA und Testprotokoll. **Der Lerner klickt den Verweis genau dann, wenn er die
Frage falsch hatte** — und landet im falschen Kapitel.

#### Warum kein Wächter es gemeldet hat — die Stelle ist nachlesbar
`check.sh` prüft nur, **ob** der Abschnitt existiert; 5.2 existiert. `e3_gegenprobe.py` prüft, ob
ein Stichwort des Verweistextes im Ziel vorkommt — und dort sitzt die Blindstelle:
* `trifft(w, text)` wertet ein Wort auch dann als getroffen, wenn **sein 6-Zeichen-Stamm** im Ziel
  steht. Aus *Qualitätsregelkarte* wird `qualit` — das findet sich in 5.2 (Qualitätsplanung,
  Qualitätslenkung) mühelos.
* Der **Vorgabelauf meldet nur Fragen ohne JEDEN Treffer** (`len(fehlt) == len(ws)`). Ein einziger
  Scheintreffer deckt die beiden echten Fehltreffer zu.
* `--streng` hätte `stichprobe` und `vollprüfung` gelistet — aber **als Einzel-Kandidaten, und die
  druckt es nicht aus** (Lehre 1 vom 07.09., dieselbe Stelle wie B136).
►► **Die Kalibrierung, die Fehlalarme unterdrückt, unterdrückt auch Befunde.** Der 6-Zeichen-Stamm
wurde am 24.08. eingeführt, weil „osi-referenzmodell" gegen „OSI-Modell" 55 Fehlalarme erzeugte.
Er war richtig — und er hat hier drei Fälle verschluckt. **Ein Filter hat immer beide Richtungen.**

#### Der Nachscan derselben Klasse in Modul 05
Alle 34 nummerierten M05-Verweise wortgenau (ohne Stamm-Abkürzung) gegen ihren Zielabschnitt
gehalten: **drei Fälle, in denen der Fachbegriff im ANDEREN Abschnitt steht** (die drei oben).
Die übrigen Meldungen sind die bekannten Klassen — Komposita und Wortformen aus dem Verweistext,
die nirgends wörtlich vorkommen (`qualitätsbegriff`, `abweichungserkennung`, `kostensparen`).
⚠️ **Fehlalarm-Quote 31 von 34.** Der Filter bleibt ein Kandidatenfilter.

**✅ NUTZER-ENTSCHEID 08.09.: die drei Verweise auf 5.1 umsetzen** (`tools/verweis_setzen.py
--batch`), **den Lehrtext nicht anfassen** — der Stoff steht dort, nur der Zeiger war falsch.

#### Zwei Fragen desselben Themas widersprachen sich
`M05-105` erklärte: *„Steigt die Quote, wird sie erhöht oder auf Vollprüfung gewechselt."*
Der Lehrtext 5.1 sagt: *„Häufen sich Fehler in den Stichproben, wird nicht mehr Stichprobe geprüft
— dann wird der Prozess korrigiert."* **Beides stand monatelang nebeneinander.**
**✅ NUTZER-ENTSCHEID 08.09.:** Die Erklärung unterscheidet jetzt **Absichern von Beheben** — den
Umfang erhöhen oder auf Vollprüfung wechseln sichert ab, bis die Ursache im Prozess abgestellt ist.
Die neue `M05-312` prüft genau diese Unterscheidung.
✅ **„Qualitätsregelkarte" ist entfallen** — der Begriff stand in Verweis, Antwortoption und
Erklärung von M05-105 und **in keiner Kursdatei**. An seine Stelle tritt das Testprotokoll (5.2).
⚠️ **Nebenwirkung, die dabei sichtbar wurde:** M05-105 trug einen **Längen-Tell** (richtige Antwort
298 Zeichen, längster Distraktor 297 — Gleichstand zählt als Treffer). Der Ersatz hätte ihn
vertieft; stattdessen wurde Distraktor 2 mitgezogen (313 gegen 334, Faktor 1,07). **Ein Tell
weniger, ohne dass jemand danach gesucht hat.**
►► **`tools/opt_ersatz.py` hat den ersten Versuch abgebrochen** („das würde die RICHTIGE ANTWORT
kürzen, 298 → 289"). **Die Zusicherung im Werkzeug hat gehalten, wo die Regel in der Doku steht.**

### B146 — die B145-Klasse poolweit: 1016 Verweise, 78 Fehlalarme, vier echte Fälle (08.09.)
**Fehlerklasse: dieselbe wie B145** — das Verweisziel existiert, der Stoff steht nebenan.

B145 war in Modul 05 gefunden worden. **Ein Sachbefund ist ein Verdacht auf eine Fehlerklasse**,
also wurde die Klasse poolweit gesucht — mit einem eigenen Werkzeug, weil `e3_gegenprobe.py` sie
strukturell nicht findet (6-Zeichen-Stamm, „nur ohne JEDEN Treffer melden", Einzel-Kandidaten
werden nicht gedruckt; Herleitung in B145).

#### Das Werkzeug: `tools/verweis_nachbar.py`
Zwei Unterschiede zur Vorgabe-Gegenprobe, und beide sind der Punkt:
* **Wortgenauer Vergleich** statt Stamm-Abkürzung (Markdown-Marker `*_\`` werden vorher entfernt —
  die Falle `**M**essbar` aus B138).
* **Gemeldet wird nur, was im Ziel fehlt UND in einem ANDEREN Abschnitt derselben Kursdatei
  steht.** Das trennt den Zeiger-Fehler von der Wortform, die nirgends vorkommt — und genau
  diese Wortformen waren bei `--streng` die Mehrheit.

⚠️ **GEGENPROBE MIT BEKANNTER ANTWORT, IN BEIDE RICHTUNGEN, VOR DEM ERSTEN URTEIL** (Lehre 4 vom
07.09.): gegen `git show HEAD~1:fragen.js` meldet er **M05-104, M05-105 und M05-310** — die drei
Fälle aus B145. Gegen den Stand nach der Korrektur meldet er **keinen davon**. Erst danach wurden
die übrigen Kandidaten gelesen.

#### Die vier echten Fälle
* **M03-990** und **M03-991** zeigten auf **3.3**. Standortverteiler, Gebäudeverteiler,
  Etagenverteiler, Anschlussdose, Patchpanel und die Primär-/Sekundär-/Tertiärbereiche stehen
  sämtlich in **3.1**. → auf 3.1 gesetzt.
* **M06-771** und **M06-772** zeigten auf **6.1**. „3-2-1-Regel", „Air-Gap", „Rücksicherung" und
  „Datensicherung" stehen ausschließlich in **6.4**; „Backup-Konzept" kommt wörtlich nirgends vor.
  → auf 6.4 gesetzt.

⚠️⚠️ **UND EIN GESCHWISTERFALL, DER AUSDRÜCKLICH RICHTIG IST: `M03-992`** (250 m zwischen zwei
Etagenverteilern → LWL) zeigt ebenfalls auf 3.3 — und dort stehen Lichtwellenleiter und die
100-m-Grenze tatsächlich (`lwl` 3.2/3.3, `100 m` 3.3). **Drei Fragen derselben Serie zeigten
falsch, eine richtig, zwei weitere (M03-993/994) zeigten schon korrekt auf 3.1.**
►► **Die Serie ist kein Argument. Jeder Verweis wurde einzeln am Kurstext gelesen** — sonst wäre
M03-992 „mitrepariert" worden, wie es `pool_query.js verweise` am ersten Tag mit neun richtigen
Verweisen fast getan hätte.

#### Die vier Fehlalarm-Klassen (78 von 82)
1. **Beiwerk im Verweistitel, Sache im Ziel** — M04-012/024/923 „Schreibtischtest **und
   Debugging**": der Schreibtischtest steht in 4.7, nur *Debugging* in 4.6. Ziel richtig.
2. **Generische Wörter**, die in jedem Abschnitt stehen: `Risiko`, `Planung`, `Abgrenzung`,
   `Management`, `Umfang`, `Vergleich`, `prüfen`.
3. **Synonyme** — M03-903/904/931 nennen „Kenngrößen" (Wort in 3.3), gemeint ist die
   Taktfrequenz, und die steht in 3.1.
4. **Oberbegriffe** — M07-023/024/705/933 „Mängelarten" (Wort in 7.6), aber Nacherfüllung,
   Mängelrüge und Gewährleistung stehen alle in 7.1. Ziel richtig.

⛔⛔ **KEIN WÄCHTER DARAUS.** 78 Fehlalarme auf vier Befunde — das ist dieselbe Rechnung, an der
der G2-Kandidat am 07.09. gemessen und verworfen wurde (192 Kandidaten, ~200 Ausnahmen nötig).
**Das Werkzeug bleibt ein Messwerkzeug für die Hand**, zu fahren vor einer Verweis-Runde und nach
jedem Verweis-Befund. `check.sh` bekommt es nicht.
