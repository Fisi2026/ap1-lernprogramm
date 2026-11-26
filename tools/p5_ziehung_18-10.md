# N48 P5-Rest – Ziehung und Urteile (Phase 9, Nacht 17./18.10.2026)

**Ziehung:** `node tools/p5_ziehen.js` (Seed 1110, mulberry32, je Typ 5, Probe `--probe` 7/7). Pool beim Ziehen: 1357 Fragen.
**Ausgeschlossen:** die sechs am 11.10. voll gelesenen Typen (baukasten, beschriftung, bild, dropdown, erklaeren, fehlersuche) und die
am 11.10. gelesenen, namentlich bekannten IDs M03-484, M04-513, M08-110, M03-115 (BUILD_LOG_ARCHIV 141).
**Nicht rekonstruierbar:** die alte Ziehung (`_to_delete/helfer/p5_ziehen.js`) ist weg, BUILD_LOG 141 nennt nur diese vier IDs. Unbekannt
bleiben die übrigen 26 gelesenen IDs – darunter die am 11.10. „teilweise“ gelesenen **freitext**-Fragen (welche und wie viele, steht
nirgends). Die freitext-Zeilen unten können also Fragen enthalten, die schon einmal gelesen wurden.

**Maßstab je Frage:** fachlich richtig? Erklärung passt zur Lösung (alle Felder, auch distraktorErklaerungen/feedback)? Widerspricht eine
andere Frage (poolweit `pool_query.js kontext`)? Quelle: Lehrtexte `0x_*.md` (M08 hat keine Kursdatei, dort Gesetzestext).

**Ergebnis:** 68 ok · 3 Fix (aus der Stichprobe) · 4 unklar. Dazu offener Fall M08-110 = Fix (mit M08-609), M03-115 = Befund.

| Nr | ID | Typ | Urteil | Beleg |
|---|---|---|---|---|
| 1 | M06-017 | freitext | unklar (gering) | „sekundär potenziell Integrität“ beim Verlust eines USB-Sticks: verfälscht wird der Firmenbestand nicht; Verfügbarkeit läge näher. Abgeschwächt („potenziell“), kein anderer Pooltreffer zum USB-Verlust nennt Integrität. erklaerungLang zieht Art. 33 und 34 für die Benachrichtigung Betroffener zusammen (Art. 34 wäre genau). |
| 2 | M08-312 | freitext | **Fix** 5692a7f | „gerade weil sie geprüfte Zahlen offenlegt“ – Prüfungspflicht erst ab mittelgroßer GmbH (§ 316 Abs. 1 HGB). |
| 3 | M08-328 | freitext | ok | § 1 HGB Gesamtbetrachtung, Eintragung deklaratorisch; deckt sich mit M08-323/324. |
| 4 | M05-306 | freitext | ok | Gründe für Testprotokolle (05 Abschnitt 5.2). |
| 5 | M07-115 | freitext | ok | 1/6 = 16,7 %, 2.000/50.000 = 4 %, 96 % nachgerechnet. Kleinigkeit: erklaerungLang „Kunde nicht erreichbar“ statt „verspätete Anforderungen“. |
| 6 | M01-471 | hotspot | ok | A-B-D 12, A-C-D 9, Puffer C = 3 nachgerechnet. |
| 7 | M05-701 | hotspot | ok | Act = Standardisieren (05 Abschnitt 5.2). |
| 8 | M07-411 | hotspot | ok | zwei einlaufende Linien bei M. im SVG nachgezählt. |
| 9 | M03-974 | hotspot | ok | LWL störungsimmun. |
| 10 | M01-701 | hotspot | ok | Bug in Standardsoftware → 3rd Level (Hersteller). |
| 11 | M03-314 | kalkulation | ok | 100/60/40, Summen 520/320/200 nachgerechnet. |
| 12 | M02-944 | kalkulation | ok | 2,40+1,50+1,80+1,75 = 7,45. |
| 13 | M03-940 | kalkulation | ok | 6.000+1.500+900 = 8.400, /3 = 2.800. |
| 14 | M03-055 | kalkulation | ok | 18.000+4.800 = 22.800; 20×30×48 = 28.800. |
| 15 | M02-940 | kalkulation | ok | 5.000 → 4.000 → 3.920 → 4.000. |
| 16 | M04-980 | konsole | ok | ip a / ip r / ping -c 4. |
| 17 | M04-981 | konsole | ok | ss -tulpen enthält -n; traceroute, dig. |
| 18 | M04-053 | konsole | unklar (gering) | Prompt „Gib die aktuelle … Adresse an den DHCP-Server zurück“ – eine APIPA-Adresse stammt nicht vom DHCP-Server; erklaerungLang „die Reihenfolge ist zwingend, sonst hält der Rechner an der alten Zuweisung fest“ – `ipconfig /renew` wirkt auch ohne `/release`. Didaktisch übliche Folge, Aussage überspitzt. |
| 19 | M04-913 | konsole | ok | route print / netstat -r, netstat -an, ipconfig /flushdns. |
| 20 | M04-983 | konsole | ok | pwd, cd /var/log, ls -l. |
| 21 | M07-052 | kreuztabelle | unklar | Zeile „Eine förmliche Abnahme ist vorgesehen“ (Werkvertrag): § 640 BGB verlangt keine förmliche Abnahme; M07-040 („muss nicht förmlich erfolgen“) und M07-219 (konkludent/fiktiv gleich wirksam) sagen das. „förmliche Abnahme“ steht aber auch in M07-202 und M07-716 als Sprachgebrauch für die Abnahme schlechthin (in M07-201/-770 nur in Distraktoren) – Klassenentscheid, nicht Einzelfix. |
| 22 | M03-932 | kreuztabelle | ok | IP L3, TCP/UDP L4, HTTP/DNS L7 (03 Abschnitt 3.2). |
| 23 | M03-933 | kreuztabelle | ok | Hub/Repeater L1, Switch L2, Router L3. |
| 24 | M01-954 | kreuztabelle | ok | Wasserfall vs. Scrum (01 Abschnitt 1.1). |
| 25 | M07-219 | kreuztabelle | unklar | Zeile 5 „tritt nicht ein, wenn der Auftraggeber mindestens einen Mangel benennt“ nur bei fiktiv angekreuzt; die konkludente Abnahme definiert Zeile 2 selbst als Nutzung „ohne Rüge“ – eine Mängelrüge spricht auch gegen sie (Rechtsprechung: Einzelfall). Lösung vertretbar, Trennschärfe der Zeile fraglich. |
| 26 | M08-323 | lueckentext | **Fix** 880f078 | „Die Feuchtwanger Textilwerke OHG ist z.B. ein Formkaufmann“ + „juristische Person mit Handelsgewerbe“ – widerspricht § 6 Abs. 2 HGB und M08-324/M08-327. |
| 27 | M04-058 | lueckentext | ok | 4 Bit, /28, .240, 14 Hosts, 7. Netz .96 nachgerechnet. |
| 28 | M06-312 | lueckentext | ok | Art. 32 DSGVO; Berechtigungskonzept organisatorisch wie M06-742 und Spickzettel 99#130. |
| 29 | M06-028 | lueckentext | ok | RAID 5 6 TB, RAID 10 4 TB. |
| 30 | M06-060 | lueckentext | ok | IDS/IPS. |
| 31 | M05-950 | matrix | **Fix** 40aadee | erklaerungLang „zwei Pixel in einer Testumgebung“, „bei jedem Aufruf“ – Element ist ein Protokolleintrag ohne Sekunden bei 200 Testläufen/Woche. |
| 32 | M01-521 | matrix | ok | Quadranten-Indizes gegen Eisenhower geprüft. |
| 33 | M06-051 | matrix | ok | Risikomatrix (06 Abschnitt 6.3). |
| 34 | M06-702 | matrix | ok | TOM × präventiv/reaktiv; Art. 33 72 h. |
| 35 | M01-953 | matrix | ok | Portfolio Nutzen × Aufwand. |
| 36 | M03-002 | mc | ok | LWL = Schicht 1. |
| 37 | M06-108 | mc | ok | Anonymisierte Statistik kein personenbezogenes Datum (Art. 4 DSGVO). |
| 38 | M06-065 | mc | ok | zustandsloser Paketfilter L3/L4. |
| 39 | M04-022 | mc | ok | Urheberrecht nicht übertragbar (§ 29 UrhG), nur Nutzungsrechte. |
| 40 | M01-515 | mc | ok | Netzplan vs. Gantt. |
| 41 | M05-401 | mehrfach | ok | PDCA vier Phasen. |
| 42 | M02-734 | mehrfach | ok | Advisory-Text gegen Optionen gelesen. |
| 43 | M07-210 | mehrfach | ok | Nacherfüllung vor Minderung/Rücktritt. |
| 44 | M03-708 | mehrfach | ok | Ergonomie-Richtwerte (03 Abschnitt 3.3). |
| 45 | M03-401 | mehrfach | ok | L2/L3-Zuordnung. |
| 46 | M06-941 | mtf | ok | 2FA, Salt, Länge. |
| 47 | M03-931 | mtf | ok | Netzteil in Watt; 64 Bit > 4 GiB. |
| 48 | M03-901 | mtf | ok | IaaS/PaaS/SaaS, geteilte Verantwortung. |
| 49 | M07-415 | mtf | ok | Gantt = Ablauforganisation. |
| 50 | M07-218 | mtf | ok | Hinweis: „Online-Gruppen kleiner“ hat keinen Satz in 07 – Fachlich vertretbar, kein Fehler. |
| 51 | M03-761 | rechenassistent | ok | Formeln dezimal korrekt. |
| 52 | M01-501 | rechenassistent | ok | GP_B = FEZ_C − FEZ_B (= SAZ_B − FAZ_B) nachgerechnet. |
| 53 | M03-544 | rechenassistent | ok | Wirkungsgrad/Verlust. |
| 54 | M03-908 | rechenassistent | ok | Amortisation über Stromersparnis. |
| 55 | M02-760 | rechenassistent | ok | Bezugskalkulation. |
| 56 | M01-431 | reihenfolge | ok | Wasserfall-Phasen. |
| 57 | M04-029 | reihenfolge | ok | Lastenheft → Pflichtenheft → Freigabe. |
| 58 | M05-960 | reihenfolge | ok | PDCA. |
| 59 | M05-703 | reihenfolge | ok | Testdurchlauf. |
| 60 | M06-704 | reihenfolge | ok | Art. 33 (Behörde, 72 h) / Art. 34 (Betroffene bei hohem Risiko). |
| 61 | M07-222 | szenario2 | ok | Widerständler = aktive Ablehnung, Gespräch – deckt sich mit 07 Zeile 611–613. |
| 62 | M06-944 | szenario2 | ok | Phishing-Merkmale. |
| 63 | M08-308 | szenario2 | ok | UG ab 1 €, 25 % Rücklage (§ 5a GmbHG). |
| 64 | M03-910 | szenario2 | ok | A 16.000, B 15.800 nachgerechnet. |
| 65 | M03-909 | szenario2 | ok | 100 m Twisted-Pair (90 + 10). |
| 66 | M04-946 | trace | ok | Tabelle nachgerechnet. |
| 67 | M04-943 | trace | ok | 1→2→4→8→16→32, fußgesteuert. |
| 68 | M04-947 | trace | ok | 173 → 3, 7, 1. |
| 69 | M04-945 | trace | ok | Maximum 10. |
| 70 | M04-903 | trace | ok | 2, 4, 6. |
| 71 | M01-602 | zuordnung | ok | Tuckman fünf Phasen; deckt sich mit M01-006. |
| 72 | M06-207 | zuordnung | ok | Objektarten der Schutzbedarfsfeststellung. |
| 73 | M04-006 | zuordnung | ok | Konsolenbefehle. |
| 74 | M01-006 | zuordnung | ok | Tuckman 1965, Adjourning 1977. |
| 75 | M03-213 | zuordnung | ok | Kommunikationssysteme. |

## Offene Fälle vom 11.10.

**M08-110 – Fix 627aa8a (mit M08-609).** § 15 Abs. 1 Satz 2 Nr. 5 BBiG (seit BBiMoG, 01.01.2020): Auszubildende sind „an dem Arbeitstag,
der der schriftlichen Abschlussprüfung unmittelbar vorangeht“ freizustellen – für alle, nicht nur Jugendliche. Teil 1 der gestreckten
Prüfung ist Teil der Abschlussprüfung; IHK Düsseldorf, IHK Elbe-Weser, IHK Würzburg-Schweinfurt und IHK Region Stuttgart nennen die
Freistellung ausdrücklich für Teil 1 und Teil 2, IHK Ulm/Bodensee-Oberschwaben nur vor schriftlichen Teilen. **Quelle:** WebSearch-Auszüge
vom 17./18.10.2026 (Wortlaut über gesetze.legal/lxgesetze.de/anwalt24.de, IHK-Seiten unter ihk.de bzw. wuerzburg.ihk.de). ⚠️ Die Seiten
selbst konnten nicht geöffnet werden: der Proxy dieser Cloud-Sitzung lehnt ihk.de und gesetze-im-internet.de ab (CONNECT 403, gemessen) –
gelesen sind nur die Suchauszüge, nicht die Merkblätter im Volltext. Poolweite Suche nach derselben Aussage („nur für Jugendliche“,
„noch jugendlich“ neben JArbSchG): M08-609 – mitkorrigiert.

**M03-115 – Befund, nicht geändert (gering).** Musterlösung: „wenn dieser [Domain Controller] ausfällt, können sich Benutzer nicht neu
anmelden“. Windows meldet Benutzer mit zwischengespeicherter Domänenanmeldung (Cached Logon) auch ohne DC am eigenen Rechner an; ohne Cache
oder an einem fremden Rechner geht es nicht, Zugriffe auf Domänenressourcen schlagen fehl. Die Aussage ist überspitzt, aber im Kern (Abhängigkeit
vom DC, deshalb zweiter DC) richtig. Vorschlag für eine spätere Runde: „… können sich Benutzer ohne zwischengespeicherte Anmeldung nicht
anmelden, und zentrale Ressourcen sind nicht erreichbar – deshalb betreibt man mindestens zwei Domain Controller.“

## Befundliste (nicht geändert)

1. M07-052 + Klasse „förmliche Abnahme“ (M07-202, M07-716): Werkvertrag verlangt eine Abnahme, keine förmliche – Nutzer-Entscheid, ob der Sprachgebrauch bleibt.
2. M07-219 Zeile 5: konkludente Abnahme und Mängelrüge.
3. M04-053: APIPA-Adresse „an den DHCP-Server zurückgeben“, „Reihenfolge zwingend“.
4. M06-017: Integrität beim USB-Verlust; Art. 33/34 zusammengezogen.
5. M03-115: Domain-Controller-Ausfall und zwischengespeicherte Anmeldung (s. o.).

## Urteile zur Befundliste (18.10., Etappe B1, Zweig n48-p5b)

Förmliche Abnahme (M07-052/-202/-716) ist mit BUILD_LOG 221 entschieden und behoben (`1f543ce`) – hier nicht angefasst.

1. **M04-053 – Fix** (Klausur-Set K2). Quelle: Microsoft Learn „ipconfig“ (`/release` „Sends a DHCPRELEASE message to the DHCP
   server … and discard the IP address configuration“; Suchauszug 18.10., Seite selbst vom Proxy gesperrt) + Lehrtext 04#134 (APIPA
   vergibt sich der Client selbst). Eine APIPA-Adresse hat keinen Lease beim DHCP-Server; `/renew` wirkt auch ohne `/release`.
   Geändert: `aufgaben[1].prompt` „Gib die aktuelle, unbrauchbare Adresskonfiguration frei.“, `erklaerungKurz` „Adresse freigeben“,
   `erklaerungLang` Punkt 4 ohne „Reihenfolge ist zwingend“. Akzeptierte Befehle unverändert. Kein Begriffsanker: „/release gibt die
   Adresse an den DHCP-Server zurück“ ist für echte Leases richtig – ein Wortanker würde Richtiges melden.
2. **M06-017 – Fix (Teil Art. 33/34)**. Quelle: Art. 33/34 DSGVO, Lehrtext 06#173 (Tabelle Aufsichtsbehörde Art. 33 / Betroffene
   Art. 34), Pool M06-704, M06-735. Geändert: `erklaerungLang` Punkt 5. Anker „betroffenen Personen“ (Gegenprobe Ur-Zustand 1 → 0).
   **Teil Integrität – bleibt, Nutzer-Frage**: „sekundär potenziell Integrität“ ist schwach (Lehrtext 06#26: Integrität = Daten
   vollständig und unverändert; der Firmenbestand ändert sich durch den Verlust nicht), aber nicht eindeutig falsch (manipulierte
   Kopie im Umlauf). Optionen: (a) lassen · (b) „sekundär ggf. Verfügbarkeit (falls keine Kopie existiert)“ · (c) Satz streichen.
3. **M07-219 – bleibt, Nutzer-Frage**. Zeile 5 nur bei fiktiv folgt § 640 Abs. 2 BGB; eine konkludente Abnahme scheitert nach
   BGH-Linie erst an wesentlichen Mängeln (Billigung „im Wesentlichen vertragsgemäß“, Einzelfall – Urteilsbesprechungen per
   WebSearch 18.10., kein Volltext). Lösung vertretbar, Trennschärfe gegen Zeile 2 („ohne Rüge“) bleibt. Optionen: (a) lassen ·
   (b) Zeile 5 an § 640 Abs. 2 angleichen: „…, wenn der Auftraggeber sie innerhalb der Frist unter Angabe mindestens eines Mangels
   verweigert“ · (c) Zeile 2 „etwa vorbehaltlose produktive Nutzung“.
4. **M03-115 – Fix**. Quelle: Microsoft Learn „Interactive logon: Number of previous logons to cache (in case domain controller is
   not available)“ – Anmeldung mit zwischengespeicherten Daten, Standard 10 (Suchauszug 18.10.). Geändert: `musterloesung` letzter
   Satz („ohne zwischengespeicherte Anmeldung …, zentrale Ressourcen nicht erreichbar – daher mindestens zwei Domain Controller“).
   Anker „Domain Controller“ (Gegenprobe Ur-Zustand 1 → 0).

**Nutzer-Entscheide 18.10. (AskUserQuestion, Leitung):** M06-017 → „sekundär ggf. Verfügbarkeit (falls keine Kopie der Daten
existiert)“ in `musterloesung` und `erklaerungLang` Punkt 2 (statt Integrität) · M07-219 Zeile 5 an § 640 Abs. 2 BGB angeglichen:
„Sie tritt nicht ein, wenn der Auftraggeber sie innerhalb der Frist unter Angabe mindestens eines Mangels verweigert“ (Lösung unverändert: nur fiktiv).
