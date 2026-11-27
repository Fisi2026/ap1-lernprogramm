# entscheide/ – eine Datei je Entscheidung (ab E072, N49 W3, Nutzer-Entscheid 10.10.2026)

Jeder Entscheid hat eine eigene Datei (E001–E071 am 27.11.2026 wortgleich aus der Tabelle in `PLAN_NEUBAU.md` verschoben, BUILD_LOG 305;
ab **E072** neu geschrieben). Jeder Nutzer-Entscheid bekommt eine Datei `E0xx-<kurztitel>.md` (Kleinbuchstaben, Ziffern, Bindestrich).
⛔ **Unveraenderlich:** wer einen Entscheid aendert, schreibt einen NEUEN mit „ersetzt E0xx“ und setzt beim alten nur
den Status auf „ersetzt durch E0yy“. `tools/entscheide.py` (Waechter 4g2) prueft: jede Nummer genau einmal, keine
Luecke, jede Datei mit Status und den drei Abschnitten. Gegenprobe: `python3 tools/entscheide.py --probe`.

Vorlage:

```
# E0xx – <Titel>
**Status:** angenommen (TT.MM.JJJJ, Nutzer) · **Quelle:** BUILD_LOG <n>

## Kontext
Was lag vor, was war gemessen (mit Befehl oder Datei).

## Entscheid
Was gilt jetzt – in einem Satz, dann Einzelheiten.

## Folgen
Was sich dadurch aendert, was dafuer in Kauf genommen wird, wo es geprueft wird.
```

## Index

| Nr | Frage | Datei |
|---|---|---|
| E001 | Wozu der Neubau? | `E001-wozu-der-neubau.md` |
| E002 | Wie wird abgelöst? | `E002-wie-wird-abgeloest.md` |
| E003 | Welche der fünf fehlenden Schirme? | `E003-welche-der-fuenf-fehlenden-schirme.md` |
| E004 | Welche fehlenden Bedienelemente? | `E004-welche-fehlenden-bedienelemente.md` |
| E005 | shadcn-Bausteine? | `E005-shadcn-bausteine.md` |
| E006 | Taschenrechner? | `E006-taschenrechner.md` |
| E007 | Die 105 M09-Fragen? | `E007-die-105-m09-fragen.md` |
| E008 | Meldungen? (17.09.) | `E008-meldungen-17-09.md` |
| E009 | Stern? (17.09.) | `E009-stern-17-09.md` |
| E010 | Push? (17.09.) | `E010-push-17-09.md` |
| E011 | Tagesserie: Regelort? (17.09.) | `E011-tagesserie-regelort-17-09.md` |
| E012 | Tagesserie: Gebietswechsel? (17.09.) | `E012-tagesserie-gebietswechsel-17-09.md` |
| E013 | Adressen, Startbild, Einzelfrage (17.09.) | `E013-adressen-startbild-einzelfrage-17-09.md` |
| E014 | Tooltips und Zoom (18.09.) | `E014-tooltips-und-zoom-18-09.md` |
| E015 | Umfang von N24 (18.09.) | `E015-umfang-von-n24-18-09.md` |
| E016 | N25 (21.09.) | `E016-n25-21-09.md` |
| E017 | Alte App (22.09.) | `E017-alte-app-22-09.md` |
| E018 | Reihenfolge (22.09.) | `E018-reihenfolge-22-09.md` |
| E019 | Rechner: Prozent (22.09.) | `E019-rechner-prozent-22-09.md` |
| E020 | Rechner: T2 (22.09.) | `E020-rechner-t2-22-09.md` |
| E021 | Die 45 alten Suiten (22.09.) | `E021-die-45-alten-suiten-22-09.md` |
| E022 | Auslieferung nach dem Umschalten (22.09.) | `E022-auslieferung-nach-dem-umschalten-22-09.md` |
| E023 | Fehlerberichte (22.09.) | `E023-fehlerberichte-22-09.md` |
| E024 | Skills und Plugin (22.09.) | `E024-skills-und-plugin-22-09.md` |
| E025 | N31: Schema (22.09.) | `E025-n31-schema-22-09.md` |
| E026 | N31: unlesbarer Stand (22.09.) | `E026-n31-unlesbarer-stand-22-09.md` |
| E027 | N31: mehrere Tabs (22.09.) | `E027-n31-mehrere-tabs-22-09.md` |
| E028 | N31: Befunde (22.09.) | `E028-n31-befunde-22-09.md` |
| E029 | N32: Fehlerbericht (23.09.) | `E029-n32-fehlerbericht-23-09.md` |
| E030 | N32: Inhalt des Berichts (23.09.) | `E030-n32-inhalt-des-berichts-23-09.md` |
| E031 | N32: Pool nachladen (23.09.) | `E031-n32-pool-nachladen-23-09.md` |
| E032 | N32: Schnitt (23.09.) | `E032-n32-schnitt-23-09.md` |
| E033 | N33: Weg (23.09.) | `E033-n33-weg-23-09.md` |
| E034 | N29: Auslieferung (23.09.) | `E034-n29-auslieferung-23-09.md` |
| E035 | N29: alter SW (23.09.) | `E035-n29-alter-sw-23-09.md` |
| E036 | N29: Schnitt (23.09.) | `E036-n29-schnitt-23-09.md` |
| E037 | N29: Version (23.09.) | `E037-n29-version-23-09.md` |
| E038 | N29: Suiten (24.09.) | `E038-n29-suiten-24-09.md` |
| E039 | N29: (c)-Dateien (24.09.) | `E039-n29-c-dateien-24-09.md` |
| E040 | N29: Pool-Leser (24.09.) | `E040-n29-pool-leser-24-09.md` |
| E041 | N29: Version (24.09.) | `E041-n29-version-24-09.md` |
| E042 | N29: Standzeile (24.09.) | `E042-n29-standzeile-24-09.md` |
| E043 | N29: DOM-Schnappschuss (24.09.) | `E043-n29-dom-schnappschuss-24-09.md` |
| E044 | N29: Wirkung beim Lerner (24.09.) | `E044-n29-wirkung-beim-lerner-24-09.md` |
| E045 | N29: `.assetsignore` (24.09.) | `E045-n29-assetsignore-24-09.md` |
| E046 | N27: Ergebnis (25.09.) | `E046-n27-ergebnis-25-09.md` |
| E047 | N28: Umfang (25.09.) | `E047-n28-umfang-25-09.md` |
| E048 | N28: Schiene und Text (25.09.) | `E048-n28-schiene-und-text-25-09.md` |
| E049 | N34: Werkzeuge (25.09.) | `E049-n34-werkzeuge-25-09.md` |
| E050 | N34: Schnitt (25.09.) | `E050-n34-schnitt-25-09.md` |
| E051 | N34 T1: Tabellen (25.09.) | `E051-n34-t1-tabellen-25-09.md` |
| E052 | N34 T2: Bewertung (26.09.) | `E052-n34-t2-bewertung-26-09.md` |
| E053 | N34 T3: Lernen (26.09.) | `E053-n34-t3-lernen-26-09.md` |
| E054 | N34 T5: Generatoren (26.09.) | `E054-n34-t5-generatoren-26-09.md` |
| E055 | N34 T4: Simulation (26.09.) | `E055-n34-t4-simulation-26-09.md` |
| E056 | N34 T6: Schnitt und Daten (26.09.) | `E056-n34-t6-schnitt-und-daten-26-09.md` |
| E057 | N34 T6c: Waechter nach dem Schnitt (27.09.) | `E057-n34-t6c-waechter-nach-dem-schnitt-27-09.md` |
| E058 | N35: Schnitt (27.09.) | `E058-n35-schnitt-27-09.md` |
| E059 | N36: Plugin (27.09.) | `E059-n36-plugin-27-09.md` |
| E060 | N37: Code-Qualitaet (27.09.) | `E060-n37-code-qualitaet-27-09.md` |
| E061 | Befund aus BUILD_LOG 71 (27.09.) | `E061-befund-aus-build-log-71-27-09.md` |
| E062 | Lernstand-Inhalt (27.09.) | `E062-lernstand-inhalt-27-09.md` |
| E063 | N38: Leistung + Code (28.09.) | `E063-n38-leistung-code-28-09.md` |
| E064 | N38: Referenz (28.09.) | `E064-n38-referenz-28-09.md` |
| E065 | Komplettpruefung (09.10.) | `E065-komplettpruefung-09-10.md` |
| E066 | Oeffentliches Repo (09.10.) | `E066-oeffentliches-repo-09-10.md` |
| E067 | Code-Qualitaet 10 (09.10.) | `E067-code-qualitaet-10-09-10.md` |
| E068 | Alarm (09.10.) | `E068-alarm-09-10.md` |
| E069 | Release ND1 (09.10.) | `E069-release-nd1-09-10.md` |
| E070 | Push-Weg (09.10.) | `E070-push-weg-09-10.md` |
| E071 | Mutationstest (09.10.) | `E071-mutationstest-09-10.md` |
| E072 | Erst Arbeitsweise und Technikstand, dann Inhalt | `E072-reihenfolge-technik-vor-inhalt.md` |
| E073 | START_PROMPT als Kern, Lehren nach Thema in regeln/ | `E073-kern-und-themendateien.md` |
| E074 | Hotspot-Zonen mindestens 24 px, auch wenn die Zeichnung dann rollt | `E074-hotspot-mindestbreite.md` |
| E075 | Arbeitsweg schneller und billiger vor N43 | `E075-arbeitsweg-schneller.md` |
| E076 | Arbeitsweg „Cloud baut, PC misst“ | `E076-arbeitsweg-cloud-baut-pc-misst.md` |
| E077 | Verbrauch nur ueber den Hook; Skill token-wache entfaellt, wache.py nur Notfall | `E077-verbrauch-nur-ueber-den-hook.md` |
| E078 | Standzeile vorab „PUSH DURCH“, Push-Fehlschlag setzt OFFEN | `E078-standzeile-vorab-durch.md` |
| E079 | UP031-Rest: ruff schreibt um, Typ von Hand belegt, format_gleich.py beweist | `E079-up031-mischweg.md` |
| E080 | Sicherheitsgruppe S als eigene Ratschen-Zahl `ruff_s`, begruendete Ausnahmen statt noqa | `E080-ruff-s-sicherheitsgruppe.md` |
| E081 | „Kann ich schon“: Fragen ausblenden, als richtig gebucht, zurückholbar unter „Markierte Fragen“ | `E081-kann-ich-schon.md` |
