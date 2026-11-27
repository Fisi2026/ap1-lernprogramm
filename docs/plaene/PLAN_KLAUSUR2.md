# docs/plaene/PLAN_KLAUSUR2.md – Klausurvorbereitung „nächste Klausur“ (K2)

Stand 14.10.2026 · Konto gmail · Status: DURCH – K2 Stufenmix bis Release v2.10.5 (BUILD_LOG 202–222, rotiert nach `BUILD_LOG_ARCHIV.md`; Beleg BUILD_LOG 248, nachgetragen 26.11.). Geplant ab BUILD_LOG 180. Klausur ca. **Di. 20.10.2026**.
Spiegel im claude.ai-Projekt „Training“: `claude/Klausur-2_Planung.md` – maßgeblich ist DIESE Datei.

## 1. Themen (Nutzer, 14.10.)
1 Topologie · 2 Subnetting rechnen · 3 Switch/Routing · 4 OSI · 5 Hardware-Auswahl/Beschaffung ·
6 RAID 1/5/10 · 7 Netzwerksicherheit · 8 IDS · 9 Lasten- und Pflichtenheft · 10 Fehleranalyse Netzwerk

## 2. Entscheide des Nutzers (14.10., AskUserQuestion und Chat)
| # | Entscheid |
|---|---|
| K2-E1 | Klausur ca. Di. 20.10.2026 (genaues Datum/Format offen) |
| K2-E2 | Quelle: nur die Themenliste (kein Unterrichtsmaterial) |
| K2-E3 | Pool-Fragen per **Verweis** (ID, keine Kopie) + **neue** Fragen für Lücken |
| K2-E4 | ~20 Fragen je Thema (~200) |
| K2-E5 | **Normales Üben wie im AP1-Teil** + Generatoren (Subnetting, RAID). Keine Klausur-Simulation, keine eigene Statistik |
| K2-E6 | Niveau wie AP1, Stufen 1–4 gemischt |
| K2-E7 | Thema 9 = Lasten- und Pflichtenheft · Thema 5 mit Angebotsvergleich, Nutzwertanalyse, Kauf/Leasing/Miete |
| K2-E8 | Neue katalogkonforme Fragen auch in den AP1-Pool; AP2-Stoff (RAID u. a.) als `pruefungsteil: "AP2"` |

## 3. Gemessen (14.10.)
- `neu/src/schirme/Klausurvorbereitung.tsx`: nur Zählschirm (E47), Üben fehlt. `istUnterrichtsFrage` = `modul === "M09"`
  (`neu/src/kern/auswahl.ts`); **kein Verweis-Mechanismus**. `pool/pool_m09_unterricht.json` leer. Pool 1208 Fragen.
- Generatoren `genSubnetting`, `genRaid` in `neu/src/kern/generatoren.ts`.
- Katalog-OCR: `git show 79ac003^:tools/katalog/pruefungskatalog_ocr.txt` (Teil 1 = Z. 338–1052, liegt sonst in `../Buch`).
  - AP1: OSI + Protokolle (Z. 572) · Router/Switch/LWL/Ethernet (586) · Hardware-Auswahl (538, 657) ·
    Angebotsvergleich/Nutzwert/Leasing-Kauf (613–620, 945) · Lasten-/Pflichtenheft „Zweck, Urheber, Inhalt“ (650) ·
    Troubleshooting IP/DHCP/WLAN/VPN, ping/traceroute/nslookup/ipconfig/arp (697–709) · Personal Firewall (829, 901)
  - **AP2**: Schichtenmodelle mit Routing/Switching/ARP (1360ff) · Topologien (1381, 1401, 1960) · VLAN, RADIUS, VPN ·
    **RAID** (1501; Vorwort Z. 35 „RAID ausschließlich in Teil 2“) · **IDS/IPS**, NGF (2074)
- Kandidaten je Thema (Thema-Feld + Stichwort-Regex über titel/frage/thema/erklaerungKurz; fachlich UNGEPRÜFT).
  AP1-Stufenmix gesamt: 1=14 % · 2=36 % · 3=42 % · 4=8 %.

| Thema | Kandidaten | Lücke bis ~20 (vor Prüfung) |
|---|---|---|
| 01 Topologie | 7 | ~13 neu (AP2) |
| 02 Subnetting | 24 (8 AP2) | 0 + Generator |
| 03 Switch/Routing | 69 | 0 |
| 04 OSI | 57 | 0 |
| 05 Hardware/Beschaffung | 131 | 0 |
| 06 RAID | 1 | ~19 neu (AP2) + Generator |
| 07 Netzwerksicherheit | 37 | 0 |
| 08 IDS | 4 | ~16 neu (AP2) |
| 09 Lasten-/Pflichtenheft | 13 | ~7 neu (AP1) |
| 10 Fehleranalyse Netz | 49 | 0 |

→ ~55 neue Fragen, davon ~48 AP2. Skript: `tools/klausur_k2/kandidaten.py` (schreibt `_to_delete/helfer/k2_kandidaten.json`).

- **Lehrbuch** (Westermann Grundstufe LF1–5, `../Buch/_aufbereitung/buch.py`, OCR – Wortlaut vor Übernahme am Seitenbild prüfen):
  alle Klausurthemen stehen in der Grundstufe, fast alles in **LF3**: Topologien 3.4.1 (S. 309–311, mit Kompetenzcheck),
  Subnetting/Routing LF3-20/21, **RAID LF3-24 (54 Treffer)**, IDS LF3-20/24 (4 Treffer, dünn), Lasten-/Pflichtenheft LF2-10/11 und LF5-34.
  Fachstufen-Volltexte (`buecher/lf6-9`, `lf10-12`) haben RAID 14/9, IDS 16/28, Topologie 4/9 Zeilen.
  → Die Klausur prüft LF3-Unterrichtsstoff; der Katalog prüft LF3-Netzthemen in Teil 2 (Kopf Z. 1360: „LF3, LF4, LF5, …“).
  Für die Klausur ist darum ALLES relevant; AP1/AP2 entscheidet nur die Einordnung im IHK-Pool (K2-E10 bleibt).
  Quelle für neue Fragen in Etappe C: Buch LF3 zuerst (RAID, Topologie), IDS zusätzlich Fachstufe.

## 4. Lösungsweg
- Set-Datei `pool/klausur_k2.json`: je Thema Frage-IDs + Generator-Einträge. Die Klausurvorbereitung übt über
  DIESELBE Üben-Komponente wie AP1, gefiltert auf das Set (kein Nachbau). Beleg: Üben-jsdom-Tests auch im Set-Modus.
- Neue Fragen in die passenden Pool-Dateien (AP1 bzw. `pruefungsteil: "AP2"`), im Set verwiesen → keine Dubletten (Lehre E46).
- Generatoren im Set-Üben untergemischt (Vorschlag: 1 von 5 in Thema 2 und 6).

## 5. Etappen (ein Chat je Etappe)
| Wann | Etappe | Modell | Agenten |
|---|---|---|---|
| Sa. 17.10. | **A Bau**: Set-Schema + Laden + Prüfsuite, Üben über Set, Generatoren, jsdom-Tests → check.sh, Push | Sonnet | keine |
| Sa./So. | **B Auswahl**: ~20 Verweise je Thema, Stufenmix wie AP1 | Sonnet | ggf. 1 Haiku (Massenprüfung) |
| So. | **C Neue Fragen** (~55) nach `regeln/pool.md` | Sonnet | 2–3 Sonnet-Entwürfe + 1 Gegenprüfer |
| Mo. 19.10. | **D Abschluss**: Stufenmix messen, Sichtprüfung, Release | Sonnet | keine |

Rückfall, falls A nicht rechtzeitig fertig: neue Fragen trotzdem in den Pool (übbar über das normale Üben).
Agenten: `model` setzen; ab 80 % 7T vor jedem Agenten fragen; Ergebnis = Entwurf, selbst nachmessen.

## 6. Offen
- Genaues Klausurdatum/-format.
- ✅ **K2-E9 (Nutzer 14.10.): neue AP2-Themen für RAID und IDS anlegen** – in Etappe A (`THEMA_RELEVANZ`, Gebiet
  B2 prüfen, Wächter). Vorhanden sind nur B1 ER-Modell, B2 Subnetting, B3 WiSo.
- ✅ **K2-E10 (Nutzer 14.10.): Topologie nach Katalog, „sonst teilen“.** Gemessen (Katalog-OCR, Teil 1 = Z. 338–1052,
  Suche nach topolog/stern/bus/ring/masch/verkabel/LAN/WAN/infrastruktur): **Topologie steht in Teil 1 NICHT.** Teil 1
  nennt nur Nachbarn: Netzwerkkomponenten Switch/Router/Accesspoint (Z. 540–541), Ethernet/OSI (571), LAN/WLAN als
  Arbeitsplatzanbindung (662), Netzwerkanbindung/IP-Konfiguration (654). Topologien stehen in Teil 2: „Netzwerkkonzepte
  (-topologien, -infrastrukturen)“ mit LAN/WAN/MAN/GAN, strukturierter Verkabelung, VLAN (Z. 1381–1391), „Netzwerk-
  topologie“ (1401), „Geeignete Topologien und Übertragungswege bewerten“ (1960). **Daraus die Teilung:**
  - **AP1** (Thema „Netzwerkkomponenten & Medien“, A2): nur was an AP1-Komponenten hängt – Stern mit Switch als
    zentraler Komponente, Single Point of Failure, Rolle von Switch/Accesspoint im Büronetz.
  - **AP2** (neues Thema wie K2-E9): Topologien vergleichen (Bus/Ring/Stern/Masche/Baum, Ausfallverhalten),
    LAN/WAN/MAN/GAN, strukturierte Verkabelung, Topologie bewerten.
  - Die 7 vorhandenen AP1-Topologiefragen bleiben vorerst unverändert; in Etappe B je Frage prüfen, ob sie in die
    AP1-Seite passen oder umgestuft werden (Umstufen = Nutzer fragen, „was hängt daran“).

## 7. Fortschritt
- 14.10. (BUILD_LOG 181): Etappe C Paket 1 – Lasten-/Pflichtenheft +7 (M04-027–033), Lücke damit geschlossen (13 → 20).
- 14.10. (gmail, bei 95 % 7T): **RAID-Entwurf** `tools/klausur_k2/entwurf_raid.json` – 10 Fragen M06-025–029, 031–035
  (mc ×5, zuordnung, lueckentext, mehrfach, dropdown; Stufen 1–4), AP2, Thema „RAID-Systeme“, Gebiet „B2“ (Platzhalter).
  Probelauf `apply_batch.py … --neues-thema "RAID-Systeme"` GRÜN (10 Klassen). **NICHT im Pool.** Quelle Buch LF3 3.8.1 S. 379–380;
  ⚠️ Buch S. 379 nennt RAID 1 „doppelte Schreibgeschwindigkeit“ – fachlich falsch, NICHT übernommen.
- 14.10. (gmail, 96 % 7T): **IDS-Entwurf** `tools/klausur_k2/entwurf_ids.json` – 8 Fragen M06-036–043 (mc ×4, zuordnung ×2,
  dropdown, mehrfach; Stufen 1–4), AP2, Thema „IDS/IPS“, Gebiet „B2“ (Platzhalter). Probelauf mit `--neues-thema "IDS/IPS"` GRÜN.
  NICHT im Pool. Quelle Buch Fachstufe LF9 S. 351–352 (`buecher/lf6-9/volltext.txt` Z. 20740–20800) + Fachwissen.
- 14.10. (gmail, 96 % 7T): **Topologie-AP2-Entwurf** `tools/klausur_k2/entwurf_topologie.json` – 8 Fragen M03-029–036 (mc ×5, zuordnung ×3;
  Stufen 1–4): Ausfallverhalten, Merkmale, physisch/logisch, PAN–GAN, Vollvermaschung n(n−1)/2, Baum-Ausfall, strukturierte
  Verkabelung, Bewertung. AP2, neues Thema „Netzwerktopologien“, Gebiet „B2“ (Platzhalter). Probelauf GRÜN. NICHT im Pool.
- 14.10. (gmail): **Ergänzung** – RAID +5 (M06-044–048: RAID-0-Ausfall, RAID-6-Kapazität, ungleiche Platten, Hardware/Software-RAID,
  RAID 5→6) und IDS +4 (M06-049, 050, 054, 055: HIDS-Integritätsprüfung, Reaktion auf Alarm, NGFW, IPS-Fehlalarm) in die
  Entwurfsdateien angehängt. Probelauf je Thema über ALLE Entwürfe GRÜN (RAID 15, IDS 12). Stand Entwürfe: RAID 15, IDS 12, Topologie 8.
- 14.10. (gmail, 96–97 % 7T): **Topologie +5** (M03-037–041: Doppelring, Hub physisch Stern/logisch Bus, Gründe für Stern,
  WLAN-Mesh, Ausfallfolgen im Stern) angehängt; Probelauf über alle 13 GRÜN. **Stand Entwürfe: RAID 15, IDS 12, Topologie 13.**
- 14.10. (gmail, 97–98 % 7T): **RAID +4** (M06-056–059: Ausfalltoleranz je Level, Rebuild, XOR-Parität, Rebuild-Risiko gleicher Charge)
  und **IDS +4** (M06-060–063: Lückentext IDS/IPS, Portscan, HTTPS/TLS-Sicht, Firewall/IDS/IPS/Virenscanner). Probelauf GRÜN.
  **Stand Entwürfe: RAID 19, IDS 16, Topologie 13 – alle drei Lücken gedeckt.**

- 14.10. (web.de, BUILD_LOG 183): **Etappe A2 durch** – Lehrtexte 06 (RAID, IDS/IPS) und 03 (Topologien AP2), 48 Fragen gegengelesen und eingespielt (Pool 1254), drei Themen in `THEMA_RELEVANZ`/`THEMA_GEBIET` (B2), Set: Topologie/RAID/IDS je 20. Nächste: B.
- 14.10. (web.de, BUILD_LOG 184): **Etappe B durch** – `tools/klausur_k2/auswahl_b.py`, Set 434 → 183 Verweise (Liste und Stufen je Thema im BUILD_LOG). Lücken: Switch & Routing 13 (Pool dünn), IDS 16, Netzwerksicherheit ohne Stufe 4. Nächste: D.
- 14.10. (web.de, BUILD_LOG 186): **Etappe D durch** – Stufenmix 11/36/42/10 %, Sichtprüfung live, Version 2.10.0. K2 fertig; offen nur Optionales (BUILD_LOG 186).
- 15.10. (web.de, BUILD_LOG 192): **Etappe F1–F3 durch** – Set 196, Pool +11 (Firewall-Arten/DMZ, IDS-Platzierung, ARP, NAT/PAT), Lehrtext 03/06. F4: Release 2.10.1 (BUILD_LOG 193).

## 8. ÜBERGABE – so macht ein anderes Konto (web.de) weiter  (⚠️ Sitzung 14.10. 17:15: zuerst §9 lesen – gilt vor Schritt 0)
0. **Nutzer 14.10. ~17:20 (web.de):** Etappe A **jetzt** starten (nicht erst Sa.), im neuen Chat nach App-Neustart. Gebiet-Frage (RAID/IDS/Topologie → B1 oder B2; Katalog Teil 2 ordnet nicht zu, gemessen Z. 137–158) zurückgestellt: „alles was nötig ist für Klausurvorbereitung zuerst“ → Platzhalter B2 bleibt, Gebiet erst nach der Klausur entscheiden.
1. Skill fisi-lernapp, `bash tools/start.sh --neuer-chat web.de`, diese Datei ganz lesen, dann `regeln/pool.md` + `regeln/messen.md`.
2. **Etappe A** (§5): AP2-Themen „RAID-Systeme“, „IDS/IPS“, „Netzwerktopologien“ in `THEMA_RELEVANZ` anlegen (Gebiet prüfen –
   B2 ist bisher Subnetting; `gebiete_stand.py`), Set `pool/klausur_k2.json`, Üben über Set, Generatoren.
3. Danach Entwurf einspielen: `verweis` je Frage auf echtes Lehrtext-Ziel setzen (Lehrtext für RAID fehlt in den Kursdateien – M04 sagt
   „SQL und RAID werden in AP2 behandelt“; Ort entscheiden), dann
   `python3 tools/apply_batch.py --pool pool/pool_m06.json --batch tools/klausur_k2/entwurf_raid.json --neues-thema "RAID-Systeme" --write`,
   vite build, voller `check.sh`, Commit, Push. Entwurfsdatei danach löschen (Daten sind ephemer, apply_batch-Kopf).
4. IDS-Entwurf genauso einspielen (`entwurf_ids.json`, `--neues-thema "IDS/IPS"`); IDS braucht danach noch ~8 Fragen bis ~20 (Kandidaten 4 + 8 Entwurf).
5. Topologie-Entwurf genauso einspielen (`entwurf_topologie.json`, Pool `pool_m03.json`, `--neues-thema "Netzwerktopologien"`).
6. Danach Etappe B (Auswahl) und D laut §5. Entwürfe vollständig (RAID 1+19, IDS 4+16, Topologie 7+13); Topologie fertig (7 AP1-Kandidaten + 13 Entwurf). Vor dem Einspielen jede Entwurfsfrage einmal gegenlesen (Opus-Entwurf, nicht gegengeprüft).

## 9. SITZUNG 14.10. 17:15–20:15 (web.de, Nutzer arbeitet nicht mit) – Entscheide und Ablauf
**Ersetzt §8 Schritt 0.** Ende: Etappe D fertig oder 7T 95 % (E15). Die ursprüngliche 20:15-Grenze entfällt (Nutzer 17:19: nach dem 5h-Reset per Planung weitermachen).
**K2-E24 (Nutzer 17:19) – 5h-Fenster, Reset 14.10. 21:50:** Zeigt die `[limits]`-Zeile **5h ≥ 85 %**: keine neue Etappe beginnen, laufende sauber abschließen (grün, Commit, Push, BUILD_LOG „Damit offen“), dann NICHT `fire_trigger`, sondern dieselbe Aufgabe per `update_trigger` (nur `run_once_at`, KEIN `prompt` – sonst braucht es eine Geräte-Freigabe) auf **2026-10-14T19:52:00Z (21:52 Ortszeit)** stellen und aufhören. Fällt die Grenze mitten in eine Etappe: oft committen (nur grün), damit nichts verloren geht. Wer nach einem Reset-Lauf fertig ist (D), schaltet die Aufgabe ab (`update_trigger enabled:false`).

| # | Entscheid (Nutzer 14.10. ~17:10–17:20, AskUserQuestion) |
|---|---|
| K2-E11 | Klausur-Üben fließt ganz normal in Lernstand, Wiederholung, Statistik und Bereitschaft |
| K2-E12 | Lehrtext: RAID und IDS als neuer, als AP2 gekennzeichneter Abschnitt in `06_*.md`; Topologie-AP2 in `03_*.md` „Netzwerktopologien“ ergänzen; `verweis` der Entwürfe darauf setzen |
| K2-E13 | Gegenlesen der 48 Entwürfe: Chat selbst + 1 Sonnet-Gegenprüf-Agent (frischer Kontext, nur lesen); jeder Fund selbst nachgemessen |
| K2-E14 | Version: Zwischen-Pushes ohne Bump; am Ende einmal **2.10.0** mit Sichtprüfung |
| K2-E15 | Budget: Stopp bei **7T 95 %** (web.de) – dann nur noch sauber abschließen |
| K2-E16 | Übergabe **nach jeder Etappe** (gilt als Zuruf für diese Sitzung). Weg: wiederverwendbare Aufgabe „K2 Übergabe (Klausurvorbereitung)“ `trig_014LAo9fdcueNQToustrrENS` – an den PC gebunden, **Freigabe automatisch (auto mode, gemessen am create_trigger-Ergebnis)**, Modell Opus (nicht wählbar). Auslösen mit `fire_trigger` (NICHT neu anlegen); vorher Skill-Checkliste „Übergabe“ Schritte 1–4. |
| K2-E17 | Themenwahl im Klausur-Üben: Standard alle 10 Themen gemischt, Filter je Thema an-/abwählbar |
| K2-E18 | Generatoren: 1 von 5 in Thema 2 (Subnetting) und 6 (RAID) untergemischt |
| K2-E19 | Etappe B: Chat wählt die ~20 je Thema selbst (Stufenmix wie AP1), Liste im Commit |
| K2-E20 | Klausurformat: **Ankreuzen** → Auswahl überwiegend gebundene Typen (mc, mehrfach, zuordnung, dropdown, lückentext); Rechnen nur wo das Thema es braucht (Subnetting, RAID-Kapazität) |
| K2-E21 | Reicht die Zeit nicht: **Bau zuerst** |
| K2-E22 | Die 7 AP1-Topologiefragen NICHT umstufen; nur ins Set verweisen (Umstufen nach der Klausur) |
| K2-E23 | Nur dieser Chat arbeitet am Repo (trotzdem vor jedem Commit `git log --oneline -3`) |

**Etappen dieser Sitzung (je Etappe ein Chat, Übergabe per `fire_trigger`):**
1. **A Bau** – AP2-Themen „RAID-Systeme“, „IDS/IPS“, „Netzwerktopologien“ in `THEMA_RELEVANZ`/`THEMA_GEBIET` (Gebiet B2 Platzhalter, §8 Z. 0); Set `pool/klausur_k2.json` (je Thema IDs + Generator) mit Schema und Prüfsuite; Klausurvorbereitung-Schirm übt über DIESELBE Üben-Logik gefiltert auf das Set (E11: normaler Lernstand), Themenfilter (E17), Generatoren 1/5 (E18); jsdom-Tests; vite build; check.sh; Push. Set darf zunächst nur die vorhandenen Kandidaten enthalten.
2. **A2 Einspielen** – Lehrtexte (E12), Gegenlesen (E13), drei Entwürfe per `apply_batch.py` einspielen (§8 Schritte 3–5), Entwurfsdateien löschen.
3. **B Auswahl** – ~20 Verweise je Thema ins Set (E19, E20, E22).
4. **D Abschluss** – Stufenmix messen, Sichtprüfung im eingebauten Browser, Version 2.10.0, Push, CI-Urteil.

## 10. ETAPPE F – Nachbesserung nach Abdeckungsabgleich (Nutzer 14.10. 21:09: „alles was du vorgeschlagen hast“, Opus-Chat als Kontrolle, Arbeit über Agenten)

**Befund (BUILD_LOG 190, gemessen per Stichwort, fachlich ungeprüft):** Set 190, Stufen 11/36/42/11 %, alle 190 IDs im Live-Bau
(`pooldaten-*.js` lokal = live). Lücken im SET, die der Pool füllt: Kauf/Leasing/Miete Set 1 / Pool 21 frei (K2-E7!) · Amortisation 0/4 ·
WLAN-Fehleranalyse 0/23 · strukturierte Verkabelung 1/25 · ARP 0/4 · NAT 0/2 · DMZ 1/1 · WPA 1/1. Echte Pool-Lücke: Firewall-Arten
(Paketfilter/zustandsorientiert/Proxy) – Pool 4, alle im Set; Buch 52 Treffer, Katalog nennt es. Bewusst NICHT: STP, VLSM, Port-Security,
Honeypot/SIEM (Buch ≈ 0). Messung (im Repo, läuft auf jedem PC mit `../Buch`):
`PYTHONIOENCODING=utf-8 python3 tools/klausur_k2/abdeckung.py --kandidaten` – Abdeckung je Unterthema und die freien Pool-Kandidaten
je Lücke nach `_to_delete/helfer/k2_f1_kandidaten.md` (81 Stück am 14.10.) – Eingabe für den Haiku-Agenten in F1.

**Rollen:** Opus-Chat = Leitung und Kontrolle (plant, prüft jedes Agenten-Ergebnis selbst nach, committet). Agenten nach Skill
`fisi:agenten-orchestrierung` (vorher laden; `model` immer setzen; ab 80 % 7T vor jedem Agenten fragen). Commit nur im Opus-Chat.

```
- [x] F0 Start: fisi-lernapp (Plugin 1.3.9 in beiden Konten? sonst zuerst), agenten-orchestrierung laden, Messskripte laufen lassen
- [x] F1 Set-Tausch (keine neuen Fragen): Agent Haiku prüft die freien Pool-Kandidaten je Lücke (passt fachlich zum Thema, Stufe, Typ,
       keine Dublette im Set) → Liste. Opus wählt: Thema 5 +3–4 Leasing/Miete +1 Amortisation · Thema 10 +3 WLAN · Thema 1 +2 strukt.
       Verkabelung · Thema 3 +2 ARP/NAT · Thema 7 DMZ M06-312, WPA M03-905 prüfen. Je Zugang eine schwächere/doppelte Frage raus,
       Stufenmix je Thema halten. Änderung NUR über `tools/klausur_k2/auswahl_b.py` (erzeugt das Set), nicht von Hand.
- [x] F2 Neue Fragen Firewall-Arten (+4) und DMZ/Netzwerksicherheit (+2–4), Ziel Thema 7 = 20 und IDS = 20 (+4, z. B. IDS-Platzierung,
       Firewall vs. IDS im Netzplan): 2 Agenten Sonnet schreiben Entwürfe nach `regeln/pool.md` in `tools/klausur_k2/entwurf_f2_*.json`
       (Quelle Buch LF3 zuerst, Wortlaut am Seitenbild prüfen), 1 frischer Agent Sonnet liest gegen (fachlich, Distraktoren, Verweisziel).
       Opus prüft selbst, Lehrtext 06 ergänzen, wo ein Begriff im Verweisziel fehlt; `apply_batch.py` (Probelauf, dann echt).
- [x] F3 Set nachziehen (`auswahl_b.py`), Messskripte neu (keine `<<` mehr außer den bewusst ausgelassenen), Stufenmix gesamt messen,
       Schnappschüsse/Gebietsblock wie BUILD_LOG 188, Bau, voller check.sh GRÜN, Commit, Push
- [x] F4 Release 2.10.1 (Nutzer-Zusage 14.10. 21:09 gilt), Sichtprüfung live `/#klausur…` , BUILD_LOG mit Modell, Agenten und 7T vorher/nachher
```

## 11. PRÜFUNG 15.10.2026 (BUILD_LOG 198) – alle 204 Set-Fragen gegen Klausurthemen, Buch und Katalog
**Auftrag (Nutzer 11:19):** „schaue dir die klausurvorbereitung nochmal genau an. messe neu und nehme keine annahmen … prüfe die fragen und abdeckung gegen die bücher und katalog“. Themenliste des Nutzers = die 10 Set-Themen (deckungsgleich).
**Gemessen:** `tools/klausur_k2/abdeckung.py` (Stichwort, je Unterthema) · alle 204 Fragen vollständig gelesen (Frage, Optionen, Lösung, Kurzerklärung; Dump ohne erklaerungLang/distraktorErklaerungen) · SVG-Texte der 27 Bildfragen ausgelesen (NICHT gerendert) · Katalog-OCR Teil 1 (Z. 530–720) und Teil 2 FiSi (Z. 1360–1440, 1995–2110) · Buch-Volltext per Regex mit Kontext.
**Katalog:** Vorbemerkung: RAID „ausschließlich in Teil 2“. Topologie, VLAN, Spanning Tree, Routing statisch/dynamisch, IDS/IPS stehen in Teil 2 FiSi; Teil 1 nennt Netzwerkkomponenten, OSI, IP-Konfiguration, Lasten-/Pflichtenheft (Zweck, Urheber, Inhalt), Angebotsvergleich, Geräteklassen, Konsolenbefehle (ipconfig, ifconfig/ip, iproute2, arp, ping, traceroute, nslookup). Set: 72 von 204 Fragen AP2.
**Sachbefunde (Entscheid: alle 5 korrigieren; 614/615 vorher per Websuche belegen):**
- M03-981 (T10): Frage „erreicht Nachbarabteilungen, obwohl er es nicht sollte“ widerspricht der eigenen Erklärung („fälschlich als direkt erreichbar behandelt“): mit /16 statt /24 stellt der PC fremde Subnetze per ARP direkt zu und erreicht sie gerade NICHT (außer gleiche Broadcastdomäne). Szenario umdrehen.
- M04-997 (T10): Zweck „IP neu beziehen + DNS-Cache leeren“ – Zeile 4 `netsh winsock reset` passt ebenfalls nicht → zweite vertretbare Antwort. Zeile 4 durch einen passenden Befehl ersetzen.
- M04-007 (T7): richtige Option „Benutzername/Passwort pro Gerät“ → bei Enterprise je Benutzer.
- M03-615 (T10): als richtig markiert „Datenrate-Drops von 50 %+“ (unbelegte Zahl); „3 nicht-überlappende Kanäle (1, 6, 11) in Europa“ – Buch 0 Treffer zu Kanälen.
- M03-614 (T10): Reichweiten 30 m / 15 m als einzig richtige Lücken, Kurzerklärung nennt Spannen 30–50 / 15–30 m; Buch ohne Beleg.
**Schwache Passung (Entscheid: alle 3 austauschen):** M06-733 (T9, Security by Design) · M03-533 (T6, Backup-Rechnung mit „RAID-Redundanzfaktor 2–4“) · M04-977 (T3, nbtstat/getmac – nicht im Katalog). Ersatz kommt aus den Lücken unten; Themengröße halten.
**Lücken (Entscheid: alle schließen):**
- T3: Bridge (Katalog Teil 2; Buch-Abschnitt „Bridge und Switch“) · VLAN-Tagging/802.1Q (Buch: tagged/untagged frames; Set hat nur 2 VLAN-Fragen) · Spanning Tree (Katalog Teil 2; Buch 1 Stichpunkt) – Pool je 0 → neu schreiben.
- T4: PDU-Namen Segment/Paket/Frame – Set 0, Pool 0 (Katalog nennt PDU nicht) → neu.
- T5: Geräteklassen/Thin Client (Katalog Teil 1 04/02; Buch 2.7.3) – Pool frei M03-221/223/227/228/229/746 · Energie-Gütesiegel (Katalog Teil 1) – Pool frei M03-008/016/108/111/117/304 → tauschen.
- T6: RAID 10 Mindestplattenzahl – Set 0, Pool 0 → neu.
- T10: `arp -a`, `ip a`/iproute2 (Katalog Teil 1) – im Set nur Distraktor; Pool frei M04-914, M04-980 (iproute2), M04-321 → tauschen.
**Keine Lücke (gemessen):** VLSM (Buch nur als Name der CIDR-Schreibweise, Katalog 0) · Honeypot/SIEM (Katalog 0, Buch 0) · netstat (Katalog 0, Buch 0) · Port-Security (Katalog 0, Buch 0).
**Fachlich ohne Befund:** T1, T2 (alle Rechnungen nachgerechnet), T4, T5 (Skonto 36,7 %, Kauf/Miete 5.600/7.200, Amortisation 2,5 J nachgerechnet), T6 (Kapazitäten), T8, T9 (bis auf Passung).
**Nicht geprüft:** die 27 Bildfragen gerendert (nur ihr SVG-Text gegen die Lösung).
**Umsetzung:** neuer Chat (Sonnet, Nutzer-Entscheid). Reihenfolge: Sachfehler → Tausch aus Pool → neue Fragen über `apply_batch.py` → `auswahl_b.py` → `abdeckung.py` neu messen.
**Umgesetzt:** Teil 1 (5 Sachfehler) BUILD_LOG 199 · Teil 2 + 3 BUILD_LOG 200 – Entscheide 15.10. 12:5x: T3 auf 24 wachsen, T5 raus M02-213/M03-772, T10 Konsole tauschen (M04-912/914 statt 911/975), T4/T6/T9 wie vorgeschlagen. Set 204 → 207. §11 damit erledigt.

## 12. STUFENMIX NEU (Nutzer 15.10. 13:44, BUILD_LOG 202) – GEPLANT, nichts gebaut
**Auftrag (wörtlich):** „ich möchte das 1 am wenigsten hat und 4 am meisten, gleichmässig über alle themen in der theorie aber angepasst an die ihk aufteilung“.
**Entscheide (AskUserQuestion 13:4x):** K2-E25 Ziel je Thema **10/20/30/40 %** (St1/St2/St3/St4) · K2-E26 „IHK-Aufteilung“ = **Taxonomie je Katalogpunkt** („kennen“-Themen leichter, „beurteilen“-Themen schwerer; Mix je Thema darf um das Ziel abweichen) · K2-E27 schwere Fragen **neu schreiben** (St1/St2 raus, St3/St4 neu).
**Ist (gemessen 15.10., Set 207):** gesamt 22/80/83/22 = 10,6/38,6/40,1/10,6 % · bei 207 und 10/20/30/40: 21/41/62/83 → **+61 St4, −39 St2, −21 St3**. Freie Pool-Kandidaten St4 je Thema 0–4 (T5: 11), Stichwortliste `_to_delete/helfer/k2_kandidaten.json` vom 14.10., fachlich ungeprüft. Eine IHK-Vorgabe zu Schwierigkeitsanteilen gibt es im Repo nicht (Suche über alle *.md); der Katalog nennt nur Taxonomiestufen.
**Etappen (je ein Chat):**
1. **G1 Planung (Opus):** Taxonomiestufe je Katalogpunkt der 10 Themen messen (Katalog-OCR `../Buch/katalog/pruefungskatalog_ocr.txt`, Teil 1 Z. 338–1052, Teil 2 FiSi Z. 1360ff.) → Zielzahl St1–St4 je Thema um 10/20/30/40 → Tabelle hier, Nutzer bestätigt. Dabei festlegen, was „Stufe 4“ heißt (Kriterien aus `regeln/pool.md`/Bestand messen, nicht annehmen).
2. **G2…Gn Schreiben (Sonnet, je 2–3 Themen):** neue St3/St4-Fragen über `apply_batch.py` (gebundene Typen, K2-E20), Lehrtext prüfen, `auswahl_b.py` (St1/St2 raus), `abdeckung.py`, check.sh, Push.
3. **Abschluss:** Stufenmix je Thema messen, Release (Nutzer fragen). Klausur Di. 20.10. – reicht die Zeit nicht: Themen mit dem größten Abstand zum Ziel zuerst.
**G1 ERLEDIGT (15.10. ~14:10, BUILD_LOG 203) – Entscheide K2-E28–E30 (AskUserQuestion):**
- **K2-E28 Taxonomiegruppen** (Verben der Themenkreise, `../Buch/katalog/katalog_teil1.json` + OCR Teil 2 Z. 1360–1420, 1485–1505, 1960–2085): **niedrig** 15/25/30/30 % = T4 OSI (T1 03.02 „identifizieren und zuordnen“, T2 01.01 „benennen und zuordnen“), T9 (04.01 „Zweck, Urheber, Inhalt“) · **mittel** 10/20/30/40 % = T1 (T2 01.03 „benennen und charakterisieren“, FiSi „Topologien … bewerten“), T2 (04.01 konfigurieren), T3 (T2 01.02 „vergleichen und beschreiben“, FiSi „administrieren“) · **hoch** 5/15/30/50 % = T5 (03.01/03.04 „beurteilen“, 04.02 „begründen“), T6 (T2 „Sicherstellung des Betriebes beurteilen“), T7 (06.01 „analysieren“, FiSi „implementieren“), T8 (FiSi „implementieren“), T10 (04.05 „kennen und beurteilen“).
- **K2-E29 Stufe 4** = Fallsituation mit mehreren Angaben + Abwägen/Begründen ODER mehrschrittige Rechnung, gebundener Typ (Vorbilder im Set: M03-046, M04-033, M06-033, M02-113).
- **K2-E30 Reihenfolge:** größter Abstand zuerst. Themengröße bleibt.

| Thema | Gruppe | n | Ist St1/2/3/4 | Ziel St1/2/3/4 | neu St4 | neu St3 | raus St1/2/3 |
|---|---|---|---|---|---|---|---|
| T7 Netzwerksicherheit | hoch | 22 | 3/9/8/2 | 1/3/7/11 | **9** | 0 | 2/6/1 |
| T3 Switch & Routing | mittel | 24 | 2/9/11/2 | 2/5/7/10 | 8 | 0 | 0/4/4 |
| T5 Hardware/Beschaffung | hoch | 20 | 3/8/7/2 | 1/3/6/10 | 8 | 0 | 2/5/1 |
| T8 IDS/IPS | hoch | 20 | 3/7/8/2 | 1/3/6/10 | 8 | 0 | 2/4/2 |
| T10 Fehleranalyse | hoch | 20 | 1/7/10/2 | 1/3/6/10 | 8 | 0 | 0/4/4 |
| T1 Topologie | mittel | 20 | 2/10/6/2 | 2/4/6/8 | 6 | 0 | 0/6/0 |
| T2 Subnetting | mittel | 20 | 2/5/11/2 | 2/4/6/8 | 6 | 0 | 0/1/5 |
| T6 RAID | hoch | 20 | 2/8/6/4 | 1/3/6/10 | 6 | 0 | 1/5/0 |
| T4 OSI | niedrig | 21 | 2/12/5/2 | 3/5/7/6 | 4 | 2 | St1 +1 aus Pool; 0/7/0 |
| T9 Lasten-/Pflichtenheft | niedrig | 20 | 2/5/11/2 | 3/5/6/6 | 4 | 0 | St1 +1 aus Pool; 0/0/5 |
| **Summe** | | 207 | 22/80/83/22 | 17/38/63/89 | **67** | 2 | 7/42/22 |

**G2 ff. (Sonnet, je Chat 2–3 Themen in obiger Reihenfolge):** je Thema zuerst freie Pool-Kandidaten St4 prüfen (gemessen 15.10.: wenige), Rest neu über `apply_batch.py`; raus zuerst Dubletten und schwächste Passung; `auswahl_b.py`, `abdeckung.py`, check.sh, Push; Release erst am Ende (Nutzer fragen).
**K2-E31 (Nutzer 15.10. 14:01):** „schmeisse keine fragen raus aber nehme die planung für neue so“ → Spalte „raus“ entfällt; nur die 67 neuen St4 + 2 neuen St3 kommen dazu (+2 St1 aus dem Pool für T4/T9 entfallen ebenfalls, da nur Zugang). Ergebnis bei 276 Fragen (nachgerechnet): St1/2/3/4 = 22/80/85/89 = 8,0/29,0/30,8/32,2 % – St4 knapp vorn.
**G2 T7 ERLEDIGT (15.10. ~17:00, BUILD_LOG 204):** +9 St4 (M04-040…043, M06-075…079), T7 jetzt 31 Fragen 3/9/8/11, Set 216 = 22/80/83/31. Weiter laut Tabelle: T3 (+8), dann T5, T8, T10.
**G2 T3 ERLEDIGT (15.10. ~17:15, BUILD_LOG 205):** +8 St4 (M03-066…073), T3 jetzt 32 Fragen 2/9/11/10, Set 224 = 22/80/83/39. Weiter laut Tabelle: T5 (+8), dann T8, T10.
**G2 T5 ERLEDIGT (15.10. ~18:00, BUILD_LOG 206):** +8 St4 (M02-029/030, M03-074…078, M07-046), T5 jetzt 28 Fragen 3/8/7/10, Set 232 = 22/80/83/47. Weiter laut Tabelle: T8 (+8), dann T10.
**G2 T8 ERLEDIGT (15.10. ~19:00, BUILD_LOG 207):** +8 St4 (M06-080…087), T8 jetzt 28 Fragen 3/7/8/10, Set 240 = 22/80/83/55. Weiter laut Tabelle: T10 (+8), dann T1/T2/T6.
**G2 T10 ERLEDIGT (15.10. ~19:25, BUILD_LOG 208):** +8 St4 (M04-044…048, M03-079…081), T10 jetzt 28 Fragen 1/7/10/10, Set 248 = 22/80/83/63. Weiter laut Tabelle: T1/T2/T6 (je +6), dann T4/T9 (+4).
**G2 T1 ERLEDIGT (16.10. ~08:10, BUILD_LOG 209):** +6 St4 (M03-082…087), T1 jetzt 26 Fragen 2/10/6/8, Set 254 = 22/80/83/69. Weiter laut Tabelle: T2/T6 (je +6), dann T4/T9 (+4, T4 +2 St3).
