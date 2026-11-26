# tools/r1_szenario2_befund.md – R1 „längste Antwortoption ist richtig“ bei szenario2 (N50 Q1, B2)

Stand 18.10.2026 · Auftrag der Leitung (Q1-Empfehlung). **Keine Pool-Änderung** – diese Liste ist die Entscheidungsgrundlage für Leitung/Nutzer.

## 1. Messung (selbst nachgemessen)

- `node tools/item_flaws.js --regel R1 --min 25`: szenario2 hat 38 Einheiten (schritt1/schritt2), davon **36 in der R1-Grundmenge** (längste Option ≥ 25 Z., nicht alle gleich lang); **30 Treffer** (83 %), Zufallserwartung 11,9 (Σ richtige/Optionen) – deckt sich mit der Messung vom 18.10.
- Ausgeschlossen (38 − 36 = 2, gemessen): M04-924#s1 (`ipconfig /all`, längste Option 13 Z. < 25) und M02-926#s2 (alle Optionen 48 Z. lang bzw. keine längste).
- Gleiche Regel wie der Wächter in `tests/test_didaktik.js` (Gleichstand zählt). Unabhängig nachgebaut in `szenario2Laengste()` (Test): ebenfalls **30/36**.
- Von den 30 sind **25 „scharf“** (Vorsprung > 5 Z.; bei szenario2 ist immer genau eine von drei Optionen richtig, die 60-%-Grenze greift also nie), **5** sind Gleichstand/knapp (Vorsprung ≤ 5 Z.).

## 2. Wächter (Ratsche)

`tests/test_didaktik.js`: `SZENARIO2_LAENGSTE_MAX = 30` (Ist-Wert, **nur senken**). Rot ab 31, Meldung nennt die IDs.
Gegenprobe (gemessen): Obergrenze testweise auf 29 → `FEHLER: szenario2: Schritte mit laengster=richtig 30 <= Obergrenze 29 -> M01-506#s1, …`, 53 OK / 1 FEHLER; zurück auf 30 → grün. Zusätzlich im Lauf: Mini-Pool +1 Tell → 31 > 30 mit ID, kürzeste-richtige zählt nicht, Nicht-szenario2 zählt nicht.
`sollwerte.env`: `didaktik=49` → `54` (5 neue Zusicherungen).
**Wer Schritte entschärft, senkt die Obergrenze im selben Commit auf den neuen Ist-Wert.**

## 3. Befunde und Vorschläge (Längen in Zeichen)

Je Frage ein Vorschlag, **keiner umgesetzt**. Zielbild: mindestens ein Distraktor ist **länger** als die richtige Option und höchstens 1,15× so lang (Regel B86 für Fall-Teilaufgaben). Längenangaben „~“ sind Schätzungen („angenommen“, nicht nachgemessen). Bei Kürzungen der richtigen Option vor dem Umsetzen den Lehrtext-Verweis prüfen (kein Inhaltsverlust, z. B. Fristen/Paragrafen).

| ID | richtig | längste falsche | Vorsprung | Stufe | Vorschlag |
|---|---:|---:|---:|---|---|
| M01-506#s1 | 100 | 95 | +5 | knapp | Richtige kürzen: „…weil Vorgänge auf dem kritischen Pfad keinen Puffer haben“ → „…, da der kritische Pfad keinen Puffer hat“ (~85 Z.); dann ist ein Distraktor (95) der längste. |
| M01-506#s2 | 99 | 73 | +26 | scharf | Distraktoren auf ~90–100 Z. verlängern, z. B. „Die Pufferzeiten der Vorgänge außerhalb des kritischen Pfades aufbrauchen und so den Endtermin rechnerisch halten“; zweiten analog. |
| M06-053#s1 | 183 | 111 | +72 | scharf | Richtige kürzen auf ~120 Z. („Als meldepflichtige Datenschutzverletzung – Meldung an die Aufsichtsbehörde binnen 72 Stunden“) UND Distraktoren leicht verlängern (~120). |
| M06-053#s2 | 101 | 75 | +26 | scharf | Distraktoren verlängern (je ~95–105 Z.), z. B. „Ein längeres Anmeldekennwort, weil damit niemand an die Daten gelangen kann, auch nicht mit physischem Zugriff“. |
| M07-053#s1 | 97 | 97 | +0 | Gleichstand | Distraktor 1 (Lieferverzug) um ein paar Zeichen verlängern, damit er eindeutig die längste ist – oder richtige um ~8 Z. kürzen („…aber die Beschaffenheit weicht ab“). |
| M07-053#s2 | 98 | 84 | +14 | scharf | Distraktoren verlängern auf ~95–105 Z. (z. B. Rücktritt: „…einschließlich der 18 einwandfreien Geräte, ohne vorherige Fristsetzung“). |
| M07-222#s2 | 85 | 79 | +6 | scharf | Distraktor 1 verlängern („…ohne sie durchziehen und später nachschulen“), Ziel ~88 Z. |
| M07-223#s1 | 78 | 73 | +5 | knapp | Distraktor „Vollständige Abnahme…“ um ~8 Z. verlängern („…, weil elf von zwölf Plätzen fertig sind und der Rest nachgeliefert wird“). |
| M07-405#s1 | 138 | 111 | +27 | scharf | Richtige kürzen: „Nein – Kreditgeschäfte brauchen nach § 54 II HGB eine besondere Befugnis, die eine Handlungsvollmacht nicht abdeckt“ (~115). |
| M07-405#s2 | 103 | 98 | +5 | knapp | Richtige leicht kürzen („Nur mit ausdrücklicher besonderer Befugnis des Inhabers für Kreditgeschäfte (§ 54 II HGB)“, ~95); die Distraktoren (98/95) bleiben. |
| M07-406#s1 | 89 | 73 | +16 | scharf | Distraktoren verlängern auf ~85–90 Z. („Nein – der Widerruf wird erst mit der Löschung im Handelsregister wirksam, vorher bleibt die Prokura bestehen“). |
| M07-406#s2 | 120 | 84 | +36 | scharf | Richtige kürzen („Nein – solange das Erlöschen nicht eingetragen und bekannt gemacht ist, schützt § 15 HGB den Dritten“, ~100) und Distraktoren auf ~100 verlängern. |
| M08-308#s1 | 81 | 54 | +27 | scharf | Distraktoren verlängern auf ~75 Z. („GbR – einfache Gründung ohne besondere Kapitalvorgaben, aber mit persönlicher Haftung der Gesellschafter“ – Achtung: verrät dann die Haftung; Alternative: Richtige kürzen auf „UG (haftungsbeschränkt) – ab 1 € Stammkapital gründbar“, ~60). |
| M08-308#s2 | 124 | 84 | +40 | scharf | Richtige kürzen auf ~95 Z. („Sie müssen jährlich 25 % des Jahresüberschusses als Rücklage bilden, bis 25.000 € erreicht sind“) und „haften unbeschränkt“-Distraktor auf ~90 verlängern. |
| M08-310#s1 | 115 | 114 | +1 | knapp | Distraktor „Unzutreffend – …Thesaurierungspflicht…“ um ~4 Z. verlängern (nur Gleichstand-Nähe, geringes Risiko). |
| M08-310#s2 | 122 | 87 | +35 | scharf | Richtige kürzen („Sie muss jährlich ein Viertel des Gewinns als Rücklage binden und gilt als kapitalschwach“, ~95) und die Distraktoren auf ~100 verlängern. |
| M04-923#s1 | 64 | 57 | +7 | scharf | Distraktoren um ~8 Z. verlängern („Sofort den Quellcode an der vermuteten Stelle umschreiben, ohne den Fehler nachzustellen“). |
| M04-923#s2 | 68 | 58 | +10 | scharf | Distraktoren verlängern (z. B. „Das Mengenfeld ganz aus der Eingabemaske entfernen, damit es nicht mehr leer bleiben kann“, ~85). |
| M04-924#s2 | 72 | 53 | +19 | scharf | Distraktoren auf ~70 Z. verlängern („Der PC hat eine gültige öffentliche Internetadresse und ist direkt aus dem Internet erreichbar“). |
| M06-944#s2 | 79 | 65 | +14 | scharf | Distraktoren auf ~80 Z. verlängern (Logo-Distraktor: „Am Firmenlogo im Absender – mit Logo ist eine Mail immer vertrauenswürdig“, Z. 55→~75). |
| M06-945#s1 | 80 | 51 | +29 | scharf | Richtige kürzen: „Den Vorfall dem Datenschutzbeauftragten melden und dokumentieren“ (~62) und Distraktoren auf ~65 verlängern. |
| M06-945#s2 | 59 | 33 | +26 | scharf | Distraktoren auf ~55–60 Z. verlängern („Innerhalb von 30 Tagen nach Kenntnis, sobald der Schaden beziffert ist“; „Es besteht keinerlei Meldepflicht, solange kein Schaden eingetreten ist“). |
| M07-933#s1 | 74 | 61 | +13 | scharf | Distraktor „Die beschädigten Geräte kommentarlos entsorgen“ (46) auf ~70 verlängern, Distraktor 3 auf ~72. |
| M01-956#s1 | 77 | 65 | +12 | scharf | Distraktoren verlängern auf ~75–80 Z. („Niedrige Priorität – kann in der nächsten Woche bearbeitet werden, da nur ein Arbeitsplatz betroffen ist“). |
| M01-956#s2 | 78 | 61 | +17 | scharf | Distraktoren verlängern: „Das Ticket ohne Lösung schließen“ (32) → „Das Ticket ohne Lösung schließen, weil der Fall nicht im First Level liegt“ (~72); zweiten auf ~78. |
| M03-909#s1 | 90 | 84 | +6 | scharf | Distraktor 3 („Kabelkategorie…“) auf ~92 Z. verlängern. |
| M03-909#s2 | 110 | 84 | +26 | scharf | Richtige kürzen („Die Strecke über einen aktiven Zwischenverteiler aufteilen oder als Lichtwellenleiter ausführen“, ~95) und Distraktoren auf ~95 verlängern. |
| M03-910#s1 | 120 | 111 | +9 | scharf | Richtige kürzen („Die Gesamtkosten über die Nutzungsdauer (TCO): Anschaffung plus Betriebs-, Energie-, Support- und Entsorgungskosten“, ~110); der Energie-Distraktor (111) wird dann die längste. |
| M05-964#s1 | 115 | 87 | +28 | scharf | Richtige kürzen („Der Durchlauf ist ungültig: Die Vorbedingung war nicht erfüllt, der Testfall wird danach wiederholt“, ~100) und die Distraktoren auf ~100 verlängern. |
| M05-964#s2 | 102 | 67 | +35 | scharf | Distraktoren verlängern auf ~100 Z. („Nur der Wiederholungslauf, damit das Protokoll übersichtlich bleibt und keine Fehlversuche dokumentiert werden“). |

## 4. Offene Entscheide (Leitung/Nutzer)

1. Vorgehen: Distraktoren verlängern (Fachinhalt unverändert, Gefahr: Distraktor wird „zu gut ausgearbeitet“) oder richtige kürzen (Gefahr: Fachdetail geht verloren) – oder je Frage gemischt wie oben vorgeschlagen?
2. Reichweite: nur die 25 „scharfen“ oder alle 30 (Gleichstand/knapp ist didaktisch kaum wirksam, zählt aber im Wächter).
3. Nach der Umsetzung Obergrenze in `tests/test_didaktik.js` auf den neuen Ist-Wert senken; Zielwert unter Zufall + Spielraum (≈ 12–15) wäre eine Nutzerentscheidung.
