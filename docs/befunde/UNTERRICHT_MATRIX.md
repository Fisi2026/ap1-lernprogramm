# „Unser Unterricht" – Themen-Typ-Matrix (Phase 2, Stand 2026-07-20, ZUR FREIGABE)

> ⛔ **ÜBERHOLT – PLANUNGSSTAND VOM 20.07.2026, KEIN STATUS.** Diese Matrix beschreibt den Aufbau
> der 105 Fragen vom Juli. Seither: 19 BBiG-Fragen gestrichen und 24 neue nach der Probeklausur
> (30.07., 121 Fragen), dann **Etappe A der Auflösung am 04.08.2026** – 33 Fragen gelöscht,
> 48 nach M08/B3 umgezogen, **40 Fragen in 8 Themen übrig**. Die verbindliche Themenliste ist
> `L.M09_THEMEN` in `logik.js`, die Fragenzahl misst `node tools/pool_query.js themen`.
> Wer den Umzugsstand sucht: `START_PROMPT.md` Abschnitt 2.

105 Fragen = 21 Typen × exakt 5. Schwierigkeit nach E-U5 (aufsteigend): **42× St.1 · 32× St.2 ·
21× St.3 · 10× St.4** (40/30/20/10). IDs M09-001 ff. in Themenblöcken.

**Quellen-Codes:** K = Klausur-Themenliste · W# = Westermann-Lösungs-PDF Aufgabe # (verbindlich) ·
A = Aufgabenblatt Berufsausbildung (Struktur als Vorlage, NEUE Fälle, E-U2) · G = BBiG/JArbSchG-Gesetzestext (E-U6).
Einkleidung wo passend: Rhaus-Metall-GmbH.

**Themen-Bilanz vs. Zielvorgabe E-U4** (Abweichungen transparent):
| Thema | Soll | Ist | Diff |
|---|---|---|---|
| Wertschöpfung (WS) | 8 | 8 | ±0 |
| Aufbauorganisation gesamt (AA+LS+FS+MT) | 18 | 20 | +2 |
| Ablauforganisation gesamt (GA+NP) | 18 | 20 | +2 |
| Kaufmannseigenschaft (KE) | 8 | 7 | −1 |
| Die Firma (FI) | 8 | 7 | −1 |
| Rechtsformen (RF) | 9 | 8 | −1 |
| Handlungsvollmachten & Prokura (HV) | 8 | 7 | −1 |
| Kundenauftrag Anfrage/Angebot (KA) | 8 | 9 | +1 |
| Berufsausbildung BBiG/JArbSchG (BA) | 20 | 19 | −1 |
Grund: „jeder Typ exakt 5×" ist mit den Themenzielen überbestimmt; Über-/Unterhänge liegen bewusst
bei den bild-/rechenlastigen Themen (Netzplan/Gantt tragen die interaktiven Typen).

## Wertschöpfung (M09-001…008)
| ID | Typ | St. | Quelle | Inhaltsanker |
|---|---|---|---|---|
| 001 | mc | 1 | K | Definition Wertschöpfung (Output − Vorleistungen), Abgrenzung Umsatz/Gewinn |
| 002 | lueckentext | 1 | K | Wertschöpfungskette: Beschaffung → Produktion → Absatz (Rhaus-Metall) |
| 003 | reihenfolge | 1 | K | Stufen der Wertschöpfungskette in richtige Reihenfolge bringen |
| 004 | beschriftung | 1 | K | SVG Wertschöpfungskette: Kern- und Unterstützungsprozesse beschriften |
| 005 | freitext | 2 | K | Erklären, wie eine IT-Abteilung zur Wertschöpfung beiträgt (Schlüsselbegriffe) |
| 006 | kalkulation | 2 | K | Wertschöpfung berechnen: Umsatz − Vorleistungen je Sparte, Summenzeile |
| 007 | trace | 2 | K | Wertschöpfung über 3 Fertigungsstufen kumulieren (Tabelle je Stufe) |
| 008 | baukasten | 1 | K | Wertschöpfungskette aus Bausteinen zusammensetzen (mit Distraktor-Stufen) |

## Aufbauorganisation – Aufgabenanalyse & -synthese (M09-011…014)
| 011 | lueckentext | 1 | K | Analyse = Zerlegen der Gesamtaufgabe, Synthese = Bündeln zu Stellen |
| 012 | reihenfolge | 1 | K | Vorgehen: Gesamtaufgabe → Teilaufgaben → Elementaraufgaben → Stellenbildung |
| 013 | erklaeren | 2 | K | Aufgabenanalyse vs. -synthese am Rhaus-Beispiel erklären |
| 014 | fehlersuche | 3 | K | Beschreibungstext mit vertauschter Analyse/Synthese-Logik: Fehlerzeile finden |

## Aufbauorganisation – Leitungssysteme (M09-021…027)
| 021 | zuordnung | 1 | K | Einlinien-/Mehrlinien-/Stablinien-/Matrixorganisation ↔ Merkmale |
| 022 | hotspot | 1 | K | SVG-Organigramm: Stabsstelle anklicken |
| 023 | hotspot | 2 | K | SVG-Organigramm Mehrlinien: Stelle mit Mehrfachunterstellung anklicken |
| 024 | kreuztabelle | 2 | K | Systeme × Eigenschaften (klare Befehlswege, Fachkompetenz, Konfliktpotenzial…) |
| 025 | beschriftung | 2 | K | Organigramm-Ebenen beschriften (Instanz, Stab, ausführende Stelle) |
| 026 | bild (mc) | 1 | K | Abgebildetes Organigramm: welches Leitungssystem? |
| 027 | baukasten | 1 | K | Organigramm der Rhaus-Metall aus Bausteinen korrekt zusammensetzen |

## Aufbauorganisation – Führungsstile (M09-031…035)
| 031 | mehrfach | 1 | K | Merkmale des kooperativen Führungsstils (mehrere richtig) |
| 032 | zuordnung | 1 | K | autoritär/kooperativ/laissez-faire ↔ typische Situationen/Merkmale |
| 033 | matrix | 2 | K | Verhaltensgitter: Aufgaben-/Mitarbeiterorientierung, 4 Quadranten, Szenen einordnen |
| 034 | matrix | 3 | K | Führungskontinuum-Fälle in 4 Felder (autoritär→delegativ) einordnen |
| 035 | erklaeren | 3 | K | Empfehlung eines Führungsstils für gegebene Team-Situation mit Begründung |

## Aufbauorganisation – Managementtechniken (M09-041…044)
| 041 | zuordnung | 2 | K | Management by Objectives/Exception/Delegation ↔ Definitionen/Beispiele |
| 042 | matrix | 1 | K | Eisenhower: 4 Aufgaben in wichtig/dringend-Quadranten (einfach) |
| 043 | matrix | 2 | K | Eisenhower: 6 Rhaus-Alltagsaufgaben einordnen |
| 044 | matrix | 3 | K | MbO/MbE/MbD-Situationen in Technik×Eingriffsgrad-Feld einordnen |

## Ablauforganisation – Gantt (M09-051…057; Bestand: eigener Gantt-Trainer bleibt unberührt)
| 051 | hotspot | 1 | K | SVG-Gantt: Meilenstein anklicken |
| 052 | hotspot | 2 | K | SVG-Gantt: Vorgang anklicken, der sich mit Vorgang X überlappt |
| 053 | beschriftung | 1 | K | Gantt-Elemente beschriften (Balken, Meilenstein, Zeitachse, Abhängigkeit) |
| 054 | bild (dropdown) | 1 | K | Gantt ablesen: Dauer/Start von Vorgängen per Dropdown |
| 055 | bild (dropdown) | 2 | K | Gantt: kritische Kette und Gesamtdauer ablesen |
| 056 | rechenassistent | 2 | K | Projektdauer aus Vorgangsdauern/Überlappungen schrittweise (randomisiert) |
| 057 | trace | 3 | K | Wochenweiser Projektfortschritt: Tabelle fertige Vorgänge/Restdauer je Woche |

## Ablauforganisation – Netzplantechnik (M09-061…073; FAZ/FEZ/SAZ/SEZ/GP)
| 061 | reihenfolge | 2 | K | Vorgehen: Vorgangsliste → Vorwärts- → Rückwärtsrechnung → Puffer → krit. Pfad |
| 062 | hotspot | 1 | K | SVG-Netzplan: Knoten auf dem kritischen Pfad anklicken |
| 063 | beschriftung | 1 | K | Vorgangsknoten-Felder beschriften (FAZ/Dauer/FEZ/SAZ/GP/SEZ) |
| 064 | beschriftung | 2 | K | Netzplan: kritischen Pfad + Pufferwerte an Knoten beschriften |
| 065 | bild (lueckentext) | 2 | K | Netzplan ablesen: FEZ/SAZ bestimmter Vorgänge eintragen |
| 066 | rechenassistent | 2 | K | Vorwärtsrechnung 4 Vorgänge (randomisierte Dauern) |
| 067 | rechenassistent | 3 | K | Vorwärts+Rückwärts, GP eines Vorgangs (randomisiert) |
| 068 | rechenassistent | 4 | K | Netzplan mit Parallelpfaden: krit. Pfad + Verzögerungswirkung (randomisiert) |
| 069 | kalkulation | 3 | K | Netzplan-Tabelle: FAZ/FEZ/SAZ/SEZ/GP je Vorgang vervollständigen |
| 070 | trace | 3 | K | Vorwärtsrechnung als Schreibtischtest (Zeile je Vorgang: FAZ, FEZ) |
| 071 | trace | 4 | K | Rückwärtsrechnung + GP als Trace-Tabelle |
| 072 | fehlersuche | 3 | K | Netzplan-Rechnung mit einem Rechenfehler: fehlerhafte Zeile finden |
| 073 | baukasten | 2 | K | Formel-Gerüst füllen: FEZ=FAZ+Dauer, GP=SAZ−FAZ, krit. Pfad GP=0 |

## Kaufmannseigenschaft (M09-081…087)
| 081 | mc | 1 | K | Istkaufmann §1 HGB: wer ist Kaufmann kraft Handelsgewerbe? |
| 082 | mehrfach | 1 | K | Merkmale „in kaufmännischer Weise eingerichteter Geschäftsbetrieb" |
| 083 | lueckentext | 1 | K | Ist-/Kann-/Formkaufmann mit §§ 1–6 HGB |
| 084 | mtf | 1 | K | Aussagen zu Kleingewerbe/Eintragungswirkung wahr/falsch |
| 085 | freitext | 2 | K | Fall: Ist Handwerker H. Kaufmann? Prüfung mit Begründung (Schlüsselbegriffe) |
| 086 | konsole | 1 | K | ⚠️ VORBEHALT (s. offene Frage 2): Kurzantwort „Kaufmannsart eingeben" |
| 087 | fehlersuche | 2 | K | Text über Kaufmannseigenschaft mit einer falschen Aussage: Zeile finden |

## Die Firma (M09-091…097)
| 091 | mc | 1 | K | Definition Firma (§17 HGB): Name des Kaufmanns, nicht das Unternehmen |
| 092 | mehrfach | 1 | K | Firmengrundsätze: Wahrheit, Klarheit, Beständigkeit, Ausschließlichkeit… |
| 093 | dropdown | 1 | K | Firmenarten: Personen-/Sach-/Fantasiefirma + Rechtsformzusatz zuordnen |
| 094 | mtf | 1 | K | Zulässigkeit konkreter Firmennamen wahr/falsch |
| 095 | bild (dropdown) | 1 | K | Handelsregister-Auszug (SVG) ablesen: Abteilung A/B, Firma, Prokura |
| 096 | erklaeren | 2 | K | Warum darf „Rhaus-Metall-GmbH" nicht als „Rhaus Stahl AG" auftreten? Grundsätze |
| 097 | konsole | 1 | K | ⚠️ VORBEHALT: Kurzantwort „Registerabteilung für GmbH eingeben" (HRB) |

## Rechtsformen von Unternehmen (M09-101…108)
| 101 | mc | 1 | K | GmbH: Mindeststammkapital, Haftungsbeschränkung |
| 102 | dropdown | 1 | K | e.K./OHG/KG/GmbH/AG: Haftung + Kapital per Dropdown im Text |
| 103 | zuordnung | 1 | K | Rechtsform ↔ Leitungsorgan (Geschäftsführer, Vorstand, Komplementär…) |
| 104 | mtf | 1 | K | Aussagen zu OHG/KG-Haftung wahr/falsch |
| 105 | kreuztabelle | 2 | K | Rechtsformen × Eigenschaften (jur. Person, Mindestkapital, Registerpflicht…) |
| 106 | kreuztabelle | 3 | K | Rechtsformen × Haftungs-/Gewinnverteilungsregeln (Detailniveau) |
| 107 | konsole | 1 | K | ⚠️ VORBEHALT: Kurzantwort „passende Rechtsform zum Fall eingeben" |
| 108 | szenario2 | 3 | K | Fallentscheidung: Gründung – Schritt 1 Rechtsformwahl, Schritt 2 Konsequenz |

## Handlungsvollmachten & Prokura (M09-111…117)
| 111 | dropdown | 1 | K | Arten: Einzel-/Gesamt-/Filialprokura, Art-/Einzel-/Gesamthandlungsvollmacht |
| 112 | zuordnung | 2 | K | Geschäfte ↔ „darf Prokurist / darf nur mit Sondervollmacht / darf nicht" |
| 113 | mtf | 1 | K | Aussagen zu Erteilung/Eintragung/Erlöschen der Prokura wahr/falsch |
| 114 | kreuztabelle | 3 | K | Vollmachtsarten × erlaubte Geschäfte (Grundstücke, Kredite, Alltag…) |
| 115 | erklaeren | 3 | K | Fall: Prokurist verkauft Firmengrundstück – wirksam? §49 HGB erklären |
| 116 | konsole | 1 | K | ⚠️ VORBEHALT: Kurzantwort „Vollmachtsart zum Fall eingeben" |
| 117 | szenario2 | 3 | K | Fall: Mitarbeiter überschreitet Handlungsvollmacht – 2-stufige Entscheidung |

## Abwicklung Kundenauftrag: Anfrage & Angebot (M09-121…129, strikt nach Westermann-PDF)
| 121 | reihenfolge | 1 | W4.1–4.6 | Ablauf: Anfrage → Bestandsaufnahme → Verhalten → Beschaffung → Angebot → Vergleich |
| 122 | mehrfach | 2 | W4 | Richtig/falsch-Aussagen zu Anfragebeantwortung + „Fach-Chinesisch" (W4a/b) |
| 123 | lueckentext | 2 | W8b | Freizeichnungsklauseln: „Preis freibleibend", „solange der Vorrat reicht"… |
| 124 | dropdown | 2 | W5/W8a | Bindefristen: unter Anwesenden sofort, Brief ~1 Woche, gesetzte Frist |
| 125 | freitext | 3 | W10e | Rechtliche Wirkung der Anfrage (unverbindlich, bekundet Kaufinteresse) |
| 126 | erklaeren | 3 | W5/W6 | Wann ist ein Angebot ein Antrag + warum Annahmefristen nötig sind |
| 127 | kalkulation | 4 | W (4.6) | Quantitativer Angebotsvergleich: Bezugskalkulation zweier Angebote |
| 128 | kalkulation | 4 | W (4.6) | Angebotsvergleich mit Nutzwert (quantitativ + qualitativ kombiniert) |
| 129 | baukasten | 3 | W10c | Anfrage zusammensetzen: Grund, Menge/Qualität, Preise/Lieferbedingungen, Liefertermin |

## Berufsausbildung BBiG/JArbSchG (M09-131…149, Fallstruktur nach Aufgabenblatt, NEUE Fälle)
| 131 | mc | 2 | A/G | Voraussetzungen Ausbilder (persönlich/fachlich, §§28–30 BBiG) |
| 132 | mehrfach | 2 | A/G | Pflicht-Vertragsbestandteile der Niederschrift (§11 BBiG) |
| 133 | dropdown | 1 | A/G | Eckdaten: Probezeit 1–4 Monate, Kündigungsfristen, Jugendlicher <18 |
| 134 | lueckentext | 1 | G | §22 BBiG: Kündigung in/nach der Probezeit (fristlos nur aus wichtigem Grund…) |
| 135 | mtf | 2 | G | JArbSchG: Arbeitszeit, Ruhepausen, Berufsschultage wahr/falsch |
| 136 | kreuztabelle | 2 | A/G | Zuständige Stellen (IHK, Berufsschule, Gewerbeaufsicht) × Aufgaben |
| 137 | reihenfolge | 2 | A/G | Weg zum Ausbildungsvertrag: Vertrag → Eintragung IHK → Probezeit → Prüfung |
| 138 | freitext | 3 | A/G | Neuer Fall (Struktur wie „Gabi Meier"): Kündigung prüfen mit §22 BBiG |
| 139 | freitext | 4 | A/G | Neuer Fall (Struktur wie „Eva Netzer"): mehrere Vertragsangaben rechtlich bewerten |
| 140 | rechenassistent | 3 | G | JArbSchG/BBiG-Fristen rechnen: Probezeitende, Urlaubsanspruch nach Alter (randomisiert) |
| 141 | kalkulation | 3 | A/G | Ausbildungsvergütungs-Tabelle über 3 Jahre inkl. Erhöhung vervollständigen |
| 142 | konsole | 1 | A/G | ⚠️ VORBEHALT: Kurzantwort „zuständige Stelle für Eintragung eingeben" (IHK) |
| 143 | trace | 4 | G | Fristen-Trace: Fall mit Datumsangaben → Tabelle Probezeitende/Kündigungswirkung |
| 144 | fehlersuche | 3 | A/G | Ausbildungsvertrag mit einem BBiG-Verstoß: fehlerhafte Klausel finden |
| 145 | fehlersuche | 4 | G | Wochenplan eines 17-Jährigen mit einem JArbSchG-Verstoß: Zeile finden |
| 146 | baukasten | 2 | G | §11-Niederschrift aus Bausteinen (mit unzulässigen Distraktor-Klauseln) |
| 147 | szenario2 | 4 | A/G | Neuer Fall (Struktur „Florian Pfiffig"): Probezeit-Kündigung 2-stufig |
| 148 | szenario2 | 4 | A/G | Neuer Fall: Azubi erscheint nicht (Struktur „Hannes Schreiber") – Reaktion 2-stufig |
| 149 | szenario2 | 4 | A/G | Neuer Fall: minderjähriger Azubi, Vertragsunterschrift/Elternrechte 2-stufig |

## Bilanz-Kontrolle
- Typen: 21 × exakt 5 = 105. Schwierigkeit: 42/32/21/10 (= 40/30/20/10 gerundet, E-U5).
- Pseudo-Typ „generator" läuft NICHT über den Pool und ist bewusst nicht enthalten
  (die Netzplan-/Gantt-Rechenübung deckt der Bestand ab; M09-Rechenfragen sind randomisierte
  rechenassistent-Fragen mit `variablen`, gleiche Technik).
- OFFENE FRAGE 1 (Konsole): Der Typ „konsole" ist technisch eine Befehlszeilen-Simulation
  (prompt → Eingabe). Für WiSo gibt es keine Konsolenbefehle; die 5 markierten Fragen
  zweckentfremden ihn als KURZANTWORT-Eingabe (Fachbegriff tippen statt Befehl). Alternative:
  Typ in Stufe 1 auslassen (dann 100 Fragen, 20 Typen). NUTZER-ENTSCHEID NÖTIG.
- OFFENE FRAGE 2: Themen-Bilanz weicht in 7 Themen um ±1–2 vom E-U4-Ziel ab (Tabelle oben).
  Akzeptieren oder umschichten? (Umschichten bricht „jeder Typ exakt 5".)
