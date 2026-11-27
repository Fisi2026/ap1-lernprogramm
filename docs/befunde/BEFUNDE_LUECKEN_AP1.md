# BEFUNDE_LUECKEN_AP1 – Lücken des Fragenpools gegen die AP1-Katalogthemen (27.11.2026)

Etappe „Inhalt: Lücken messen" (aufgaben.json A09 „AP1 komplett bis Frühjahr 2027"), Konto web.de, Cloud-Sitzung. **Nur gemessen – am Pool, an den Lehrtexten und am Spickzettel wurde nichts geändert.**
Messwerkzeug (neu, nur lesend): `python3 tools/luecken_messen.py` (`--selbsttest` 5/5, `--abschnitte`, `--stichworte`). Alle Zahlen unten stammen aus diesem Werkzeug; Befehl = Beleg.

## 0. Wichtigste Grenzen (vorab lesen)

1. ⛔ **Katalog-OCR nicht gelesen.** `../Buch/katalog` (Repo Fisi2026/ap1-buch) fehlt in der Cloud; `add_repo` wurde in dieser Sitzung abgelehnt (Berechtigungsprüfung). Deshalb ist `tools/katalog/abdeckung.py` **nicht gelaufen**. Maßstab sind die Katalogthemen 1.1–7.7 aus `00_Themenuebersicht.md` (dort aus dem Katalog S. 9–16 abgeleitet) und der Handabgleich `docs/befunde/COVERAGE.md` §2. Ob der Katalog selbst einen Punkt führt, der in beiden fehlt: **angenommen: nein, nicht gemessen.**
2. ⛔ **Keine Prüfungsgewichtung messbar** (`docs/plaene/PLAN_INHALT.md`: Prüfungsordnung nennt keine Soll-Gewichtung, alte AP1-Prüfungen liegen nicht vor). „Prüfungsrelevanz" unten ist deshalb **angenommen** (Begründung je Zeile), nicht gemessen.
3. **Die Stichwort-Tabelle ist ein Kandidatenfilter, kein Urteil** (Regex über den Wortlaut, Lehre 10.10.: er kann Treffer verschlucken *und* zu viel melden). Eine Null heißt „Wortlaut fehlt", nicht „Stoff fehlt". Jede Zeile der Lückenliste ist vor dem Schreiben einzeln gegen den Pool zu lesen (Ablauf `PLAN_INHALT.md`).
4. **Spickzettel-Zahlen sind besonders grob:** `99_Spickzettel.md` hat je Modul nur 83–380 Wörter (gemessen, `--abschnitte`), die Treffer zählen Wortlaut im Modulabschnitt. 100 von 220 Stichworten haben dort 0 Treffer (57 davon mit ≥ 6 Fragen mit Prüfsubstanz) – das ist **ein Auftrag zur Entscheidung (wie dicht soll der Spickzettel sein?), keine Fehlerliste**.

## 1. Bestand (gemessen)

* Pool: 1487 Fragen, davon **1224 AP1** (`pruefungsteil`) – deckt sich mit dem Nenner in `SORTIERUNG_PRUEFUNGSORDNUNG.md` (A1–A5 = 1224). `python3 tools/luecken_messen.py --abschnitte`: Summe AP1 1224, AP2-Zusatz mit Abschnittsverweis 160, 103 Fragen ohne `Modul X, Abschnitt Y.Z` (WiSo/M08).
* AP1 nach Stufe 1/2/3/4: 156 / 440 / 503 / 125. Typen (AP1, 21 Typen): mc 408, zuordnung 118, dropdown 110, mehrfach 108, erklaeren 64, freitext 54, … lueckentext 11 (Aufruf: Skript in der Sitzung, Zählung über `pool_m*.json`, Nenner = AP1-Fragen).
* Zuordnung Frage → Katalogthema über das Feld `verweis` (1384 von 1393 Fragen mit Verweis-Muster – gemessen; die übrigen sind WiSo-Zitate bzw. 9 leer). ⚠️ Der Verweis zeigt auf den **Lehrtext-Abschnitt**, der nicht immer das inhaltliche Katalogthema ist (Beispiel 4.2 unten).

## 2. Je Katalogthema (Auszug aus `--abschnitte`; vollständig dort)

Spalten: Fragen AP1 · AP2-Zusatz · Stufen 1/2/3/4 · Lehrtext-Wörter des Abschnitts · Selbsttest im Lehrtext. (Typen: je Zeile im Werkzeug.)

| Thema | AP1 | Stufen 1/2/3/4 | Lehrtext Wörter | Selbsttest | Auffällig |
|---|---:|---|---:|---|---|
| 1.1 PM-Methoden | 88 | 17/24/40/7 | 1581 | ja | – |
| 1.2 Machbarkeit | 27 | 4/4/17/2 | 1260 | ja | Stufe 2 dünn |
| 1.3 Fehler-/Störungsmgmt. | 40 | 6/18/15/1 | 1532 | ja | – |
| 2.1 Marktsituation | 43 | 3/10/24/6 | 1472 | ja | – |
| **2.2 Bedarfsanalyse** | **8** | 2/2/4/0 | 487 | ja | wenig Fragen, keine Stufe 4 |
| 2.3 Kundenberatung | 40 | 4/15/19/2 | 787 | ja | – |
| **2.4 Aufbereiten/Quellen** | **10** | 2/4/4/0 | 699 | ja | Medienkompetenz 0 (Pkt. 3) |
| 2.5 Marketing/NWA | 23 | 3/2/14/4 | 823 | ja | – |
| 3.1 IT-Systeme | 109 (+56 AP2) | 12/41/44/12 | 3680 | **nein** | breit, aber ohne Selbsttest |
| 3.2 Typische IT-Systeme | 49 | 4/21/16/8 | 1151 | **nein** | |
| 3.3 Leistung/Energie | 88 | 8/29/41/10 | 2072 | **nein** | |
| 3.4 Wirtschaftlichkeit | 36 | 8/9/13/6 | 1775 | **nein** | |
| 4.1 Installation | 43 (+16) | 4/13/18/8 | 2036 | ja | – |
| **4.2 Hardware-Auswahl** | **0** | – | 411 | ja | nur der Verweis fehlt: Stoff liegt in 3.1 (Pkt. 8) |
| **4.3 Software-Auswahl** | **6** | 1/2/3/0 | 827 | ja | wenig Fragen, keine Stufe 4 |
| 4.4 Urheberrecht/Lizenz | 12 | 2/3/6/1 | 816 | ja | |
| 4.5 Installation/Netz | 101 | 7/38/40/16 | 2032 | ja | – |
| 4.6 Programmiersprachen | 39 | 1/22/14/2 | 1531 | ja | Stufe 1 dünn (1) |
| 4.7 UML/Werkzeuge | 56 | 3/18/32/3 | 1513 | ja | – |
| **4.8 Datenbanken/ER** | **0** (nur 10 AP2) | – | 925 | ja | **Entscheid nötig** (Pkt. 7) |
| 5.1 QM-Begriffe | 33 | 5/15/11/2 | 1106 | ja | – |
| 5.2 QM-Maßnahmen | 40 | 8/20/8/4 | 920 | ja | – |
| 6.1 Grundschutzniveau | 68 | 15/27/22/4 | 1701 | **nein** | – |
| **6.2 Schutzbedarfsanalyse** | **9** | **0**/2/5/2 | 245 | **nein** | kleinster Lehrtext, keine Stufe 1 |
| **6.3 Sicherheitskonzept** | **8** | 1/5/1/1 | 542 | **nein** | |
| 6.4 Umsetzung | 69 (+76) | 6/27/29/7 | 4003 | **nein** | – |
| 7.1 Verträge | 49 | 7/19/17/6 | 1365 | ja | – |
| **7.2 Unternehmensziele** | **9** | 3/2/3/1 | 403 | ja | wenig Fragen |
| **7.3 Umsetzungsvarianten** | **5** | 1/2/2/0 | 432 | ja | dünnstes Thema, keine Stufe 4 |
| 7.4 Aufbauorganisation | 36 | 8/15/12/1 | 911 | ja | – |
| 7.5 Veränderungsprozesse | 15 | 1/8/4/2 | 798 | ja | Einzelstichworte dünn (Pkt. 4) |
| 7.6 Übergabe/Einweisung | 45 | 6/16/19/4 | 1741 | ja | – |
| 7.7 Bewerten/Dokumentieren | 20 | 4/7/6/3 | 1248 | ja | – |

Hinweis zu 7.3: die Ticketsystem-Fragen (40 mit Prüfsubstanz) hängen im Verweis an 1.3, nicht an 7.3 – das Katalogthema 7.3 ist inhaltlich besser gedeckt als die Abschnittszahl 5 zeigt (siehe Pkt. 8, gleiche Klasse wie 4.2).

## 3. Lückenliste nach Priorität

Priorität = angenommene Prüfungsrelevanz × gemessene Lücke. **Relevanz angenommen** (nicht gemessen): hoch = Katalogpunkt der Taxonomiestufe „beurteilen/anwenden/bestimmen" in einem der großen AP1-Gebiete (A2/A3); mittel = „kennen/unterscheiden"; niedrig = Randpunkt oder Rest-Stichwort. Aufwand: Konvention `PLAN_INHALT.md` (3 Fragen je echte Lücke, 2 je Grenzfall); Lehrtext je Punkt 1 Absatz bis 1 Abschnitt – **Schätzung, angenommen**.

### A – Stoff mit (fast) fehlender Prüfsubstanz (Kandidaten, vor dem Schreiben einzeln lesen)

| # | Katalogpunkt (Thema) | Messung: Fragen mit Prüfsubstanz / nur Nebentext / Lehrtext-Treffer / Spickzettel | Relevanz (angen.) | Aufwand (angen.) |
|---|---|---|---|---|
| 1 | Medienkompetenz (2.4) | 0 / 1 / 4 / 0 – steht bisher nur in `M02-207` als Titelbegriff; derselbe Befund wie `COVERAGE.md` 27.07. („einziger Katalogpunkt ohne Fundstelle") | mittel | 3 Fragen (mc, zuordnung, freitext), Lehrtext 1 Absatz |
| 2 | Kundenkommunikation (1.3 / 2.3) | 1.3: 0 / 3 / 3 / 0; 2.3: 2 / 5 / 2 / 0 | mittel | 3 Fragen (szenario2/zuordnung) |
| 3 | Betroffenenrechte, BDSG, Anonymisierung, IT-Sicherheitsbeauftragter (6.1) | 5 (Lehrtext 0 als *Wort* „Betroffenenrechte", Lehrtext nennt „Betroffene" 3×) · BDSG 2 · Anonymisierung 2 · ITSiBe 1; Lehrtext 5–6 bzw. 1 | **hoch** (A3 = 40 % des AP1-Pools, DSGVO prüfbar) | 4 × 3 = ~12 Fragen, Lehrtext 06 ein Absatz „Betroffenenrechte" |
| 4 | Veränderungsprozesse (7.5): Promotoren (1), Blended Learning (2), Ursachen von Widerständen (3) | siehe `--stichworte` | mittel | ~8 Fragen |
| 5 | Software-Auswahl (4.3): Standard/Individual (2), IDE (1), Anwendungssoftware (3) · 3.1: Branchensoftware (0), Entwicklungssoftware (1), Standardsoftware (3) | Lehrtext je 1 Treffer | **hoch** (A2) | ~12 Fragen, Lehrtext 03/04 je ein Absatz „Softwarekategorien" |
| 6 | Wirtschaftlichkeit (3.4): fixe/variable Kosten (1), Lizenzkosten (1), Pay-per-Use (2), Anschaffungskosten (6, Lehrtext 1) · DaaS (1), Client-Server (2) | – | **hoch** (A2, Rechenaufgaben nahe) | ~12 Fragen |
| 7 | **ER-Modell: Kardinalität (0 Prüfsubstanz), Primär-/Fremdschlüssel (1)** (4.8) | Pool hat 10 ER-Fragen, alle `AP2`-gekennzeichnet; `00_Themenuebersicht.md` führt 4.8 unter AP1, `COVERAGE.md` §2 sagt „laut Katalog AP2-Stoff" – **Widerspruch** in zwei Dokumenten; Katalog-OCR nicht lesbar | offen | erst nach Entscheid (Frage unten) |
| 8 | Lizenz (4.4/7.1): EULA (1), Lizenzvertrag (1) | | niedrig–mittel | ~6 Fragen |
| 9 | Rest: Bildschirmmaske/GUI als Prüfsubstanz (1; Thema „GUI-Entwurf" hat laut `gebiete_stand` nur 6 Fragen), Kundenvorgaben (2), Nachfolgeaufträge (2), Kommunikationsverbindungen (3), technische/kaufmännische Texte (2) | | niedrig | ~10 Fragen |

### B – Dünne Abschnitte (Fragenzahl / Stufen)

| # | Thema | Messung | Aufwand (angen.) |
|---|---|---|---|
| 10 | 6.2 Schutzbedarfsanalyse + 6.3 Sicherheitskonzept | 9 bzw. 8 Fragen; 6.2 ohne Stufe 1; Lehrtext 6.2 nur 245 Wörter | je ~8 Fragen, Lehrtext 6.2 ausbauen |
| 11 | 2.2 Bedarfsanalyse (8, keine St. 4) · 4.3 (6, keine St. 4) · 2.4 (10, keine St. 4) · 7.2 (9) · 7.3 (5, keine St. 4; siehe Hinweis) | | je ~6–8 Fragen |
| 12 | Stufe 1 in 4.6 (1 Frage), Stufe 2 in 1.2 (4) | | je ~4 Fragen |

### C – Lehrtext und Spickzettel

| # | Befund | Messung | Aufwand (angen.) |
|---|---|---|---|
| 13 | **Kein `### Selbsttest`** in 3.1–3.4 und 6.1–6.4 (8 von 35 Abschnitten); alle übrigen haben einen | `--abschnitte` | ~8 Selbsttests à 3–5 Aufgaben – ⚠️ Nutzer-Entscheid 03.09.: Lehrtext-Änderungen immer mit Pool-/Verweis-Gegenprobe (`e3_gegenprobe.py --streng`) |
| 14 | Lehrtext-Wortlaut ≤ 1 Treffer bei Stichworten mit Fragen: Meilenstein (8 Fragen, bekannt: „M01 hat für Meilenstein fast keinen Lehrtext", `regeln/pool.md`), Projektmerkmale, Risikoanalyse, Risikomatrix, chmod | | je 1 Absatz |
| 15 | Spickzettel: 57 Stichworte mit ≥ 6 Fragen und 0 Wortlaut-Treffern (u. a. Ticketsystem 40, Peripherie 57, Mitarbeiterqualifizierung 48, Geräteklassen 44, Speicher 45, IP 54, Fehlersuche im Code 34, CPU 34) | `--stichworte` | **Entscheid nötig**: Spickzettel bleibt kompakt (Teilmenge) oder wächst; ⛔ Wortlaut-Zählung grob (Pkt. 0.4) |

### D – Verweise statt Inhalt

| 16 | 4.2 hat 0 Fragen über den Verweis, obwohl „Gerätekategorien" 44 Fragen mit Prüfsubstanz hat (sie hängen an 3.1); 7.3 ebenso (Ticketsystem an 1.3) | `--abschnitte`/`--stichworte` | Entscheid: Verweise lassen (Entscheid „Kursdatei = einziges Verweisziel", kein Zwang) oder 4.2/7.3-Verweise für Teilfragen setzen (`tools/verweis_setzen.py`, ~15 Fragen) |

## 4. Vorschlag: Reihenfolge der Etappen bis Frühjahr 2027

Termin: Frühjahr 2027 (Prüfungstermin **angenommen**, nicht erhoben; Etappen sind Chat-Einheiten, kein Kalender). Jede Etappe nach dem Muster `PLAN_INHALT.md`: Liste → Entscheid → Fragen → Lehrtext → Suiten → `check.sh` → Commit; je Etappe 1 Modul/Thema.

| Etappe | Inhalt | Warum zuerst | Umfang (angen.) |
|---|---|---|---|
| E1 | **6.1 Datenschutz-Rest** (Pkt. 3) + **6.2/6.3** dünn (Pkt. 10) + Selbsttests 6.1–6.4 (Pkt. 13) | größtes Gebiet A3, höchste angenommene Relevanz, kleinster Lehrtext | ~30 Fragen, 4 Selbsttests |
| E2 | **3.1/3.4/4.3 Softwarekategorien + Kosten** (Pkt. 5, 6) + Selbsttests 3.1–3.4 | A2, rechennah, gut messbar | ~25 Fragen, 4 Selbsttests |
| E3 | **M02**: Medienkompetenz, Kundenkommunikation, Bedarfsanalyse/Befragung, Stufe 4 (Pkt. 1, 2, 11) | wenig Aufwand, A1 | ~15 Fragen |
| E4 | **M07**: 7.2, 7.3, 7.5 Rest (Pkt. 4, 11) + Verweise 7.3 | A4/A5 | ~15 Fragen |
| E5 | **M04**: ER-Entscheid umsetzen (Pkt. 7), Lizenzen, GUI, Stufe 1 (Pkt. 8, 9, 12) | hängt am Entscheid | ~15 Fragen |
| E6 | **Spickzettel-Runde** (Pkt. 15) + Lehrtext-Dünnstellen (Pkt. 14) + Gesamtmessung (`luecken_messen.py` erneut, Vorher/Nachher) | zuletzt, weil Fragen Stichworte erst setzen | je Entscheid |

Je Etappe messen vor dem Schreiben (Lehre 10.10.: Filter beide Richtungen prüfen), Fachfehler nur mit Beleg korrigieren. **Gesamt ca. 100 Fragen + 8 Selbsttests + Spickzettel – ⚠️ Schätzung, angenommen.**

## 5. Entscheidungen für den Nutzer (siehe Chat, AskUserQuestion)

1. ER-Modell/Datenbank: AP1 oder AP2 (Widerspruch `00_Themenuebersicht.md` ↔ `COVERAGE.md`)?
2. Welche Etappe zuerst (Vorschlag E1)?
3. Spickzettel: kompakt lassen oder ausbauen?
4. Katalog-Daten: `add_repo Fisi2026/ap1-buch` freigeben bzw. Messung am PC wiederholen (`abdeckung.py` mit den OCR-Daten)?

## 6. Wie reproduziert (Befehle)

```
python3 tools/luecken_messen.py --selbsttest   # 5/5
python3 tools/luecken_messen.py                 # beide Tabellen
node tools/pool_query.js coverage|typen|stufe 1|stufe 4
python3 tools/gebiete_stand.py                  # Nenner 1224
```

Nicht gemessen / angenommen: Katalog-OCR-Abgleich, Prüfungsgewichtung, Prüfungstermin, Aufwandszahlen, Lehrtext-Qualität (nur Wortzahl und Selbsttest-Vorhandensein gemessen, nicht Richtigkeit).
