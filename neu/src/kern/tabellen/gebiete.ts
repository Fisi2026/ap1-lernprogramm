/* ============================================================================
   N34 T1 (E49, E50, 25.09.2026): Themen, Relevanz und Pruefungsgebiete
   Uebernommen aus `referenz/logik.js` (Z. 109-165, 167-189, 191-207, 208-218) - Werte UND Kommentare wortgleich,
   per Skript ausgeschnitten. Gehalten von `tabellen.gleichheit.test.ts` gegen die
   eingefrorene `referenz/logik.js`.
   ⚠️ Bis T2-T5 rechnen die Funktionen in logik.js noch mit IHRER Abschrift dieser Werte;
      der Test haelt beide gleich. Ein Wert aendert sich hier nicht still.
   ⛔ Importiert wird relativ mit Endung `.ts`, nie ueber `@/` (E49: sonst laedt Node sie nicht).
   ⛔ Diese Datei importiert nichts - Werkzeuge laden sie direkt (T6).
   ============================================================================ */

/* Relevanz je kanonischem Thema, gesetzt nach Recherche der aktuellen
   AP1-Schwerpunkte (Prüfungskatalog-Cluster Stand 06/2026 + Community-Berichte).
   3 = Dauerbrenner, 2 = regelmäßig, 1 = selten/AP2-nah. Unbekannte Themen -> 2. */
export const THEMA_RELEVANZ: Record<string, number> = {
  /* M01 */
  "Netzplan & Puffer": 3, "Gantt & PSP": 3, "Projektmerkmale & Meilensteine": 3,
  "Machbarkeit & Kalkulation": 3, "Scrum & Wasserfall": 3, "SMART-Ziele": 2,
  "Risiko & Stakeholder": 2, "Teambildung & Reflexion": 2, "Ticketsystem & Support-Level": 2,
  "KI im Störungsmanagement": 1,
  /* M02 */
  "Bezugskalkulation & Skonto": 3, "Nutzwertanalyse": 3, "Bedarfsanalyse & Marktforschung": 2,
  "Kommunikationsmodelle": 2, "Präsentation & Quellen": 2, "Englische Fachtexte": 2,
  "Marktformen & Marktsituation": 1, "Vertriebsformen": 1,
  /* M03 */
  "Berechnungen: Energie": 3, "Berechnungen: Daten & Übertragung": 3, "Datenmengen & Präfixe": 3,
  "Hardware-Komponenten": 3, "Netzwerkkomponenten & Medien": 3, "OSI-Modell & Protokolle": 3,
  "Netzwerk- und Arbeitsplatz-Ausstattung": 3, "Ergonomie & Barrierefreiheit": 3,
  "Wirtschaftlichkeit & TCO": 3, "WLAN & Übertragungsstandards": 2,
  "Cloud & Virtualisierung": 2, "Dateisysteme & Software": 2,
  /* M04 */
  "Programmiersprachen, Kontrollstrukturen & Systemgrundlagen": 3, "Lastenheft & Pflichtenheft": 3,
  "Lizenzen & Urheberrecht": 3, "Konsolenbefehle & Fehlersuche": 2, "UML & Schreibtischtest": 2,
  "DHCP & Netzwerkdienste": 2, "WLAN & VPN": 2, "GUI-Entwurf & Software-Ergonomie": 2,
  "Praxisszenarien": 2, "IP-Adressierung": 2, "Subnetting": 1, "ER-Modell & Datenbanken": 1,
  /* M05 */
  "PDCA & KVP": 3, "Testprotokoll": 3, "QM-Begriffe & Normen": 2, "Qualitätskosten": 2,
  "QM-Prozesse": 2, "Audit & Prüfverfahren": 1,
  /* M06 */
  "Schutzziele (CIA)": 3, "BSI-Grundschutz & Schutzbedarf": 3, "TOM & Rechtsgrundlagen": 3,
  "DSGVO & Datenschutz": 3, "Passwörter & Authentifizierung": 3,
  "Verschlüsselung & Signaturen": 2, "Phishing & Social Engineering": 2,
  "Backup & Verfügbarkeit": 2, "Härtung & Zugriffskontrolle": 2,
  "IT-Sicherheit und Datenschutz-Vorfall": 2, "Security by Design": 1,
  /* M07 */
  "Vertragsarten": 3, "Vertragsstörungen & Mängel": 3, "SLA & Servicevertrag": 3,
  "Abnahme & Übergabe": 3, "Soll-Ist & Nachkalkulation": 3,
  "Aufbauorganisation & Vollmachten": 2, "Unternehmensziele & Leitbild": 2,
  "Change Management": 2, "Onsite/Remote & Nachfolgeaufträge": 1,
  /* NEU 2026-07-27 (Qualitätsrunde Q1, Etappe 5): Gebiet A4 „Kunden und Kundinnen einweisen"
     hatte nur drei Feinthemen und war mit 24 von 843 AP1-Fragen (2,85 %) das mit Abstand
     dünnste Prüfungsgebiet. Einweisungsgespräch, Schulungsunterlagen, Übergabeprotokoll und
     Endanwender-Dokumentation lagen bisher in KEINEM Thema – sie unter „Abnahme & Übergabe"
     einzusortieren wäre fachlich schief (Abnahme ist der Rechtsakt, Einweisung die Leistung
     danach). Relevanz 2 wie die anderen A4-Themen außer Abnahme. */
  "Einweisung & Schulung": 2,
  /* M08 (in der App AP2-Stoff, greift nur bei inklAP2) */
  "Ausbildungsvertrag & BBiG": 1, "Kündigung": 1, "Mitbestimmung: JAV & Betriebsrat": 1,
  "Rechte & Pflichten": 1, "Tarifrecht": 1, "Arbeitsschutz & Arbeitszeit": 1,
  /* M08, Etappe A der M09-Aufloesung (2026-08-04): 48 Fragen aus der Klausurvorbereitung.
     Der IHK-Prüfungskatalog (2. Aufl. 2024, S. 9) stellt fest: „Wirtschafts- und Sozialkunde
     ist eigener Prüfungsbereich der AP2 – wirtschaftliche Themen tauchen in AP1 nur innerhalb
     der Fragenkomplexe 02, 03 und 07 auf." HGB-Stoff (Kaufmann, Firma, Rechtsformen),
     Führungslehre und Vertragsanbahnung stehen dort NICHT – deshalb B3 und nicht A1/A5. */
  "Rechtsformen": 1, "Kaufmannseigenschaft": 1, "Firma & Handelsregister": 1,
  "Führung & Managementtechniken": 1, "Aufgabenanalyse & -synthese": 1,
  "Vertragsanbahnung: Anfrage & Angebot": 1,
  /* K2 (14.10.2026, PLAN_KLAUSUR2 K2-E9/E10): AP2-Themen der Klausurvorbereitung – 1 = AP2-nah */
  "RAID-Systeme": 1, "IDS/IPS": 1, "Netzwerktopologien": 1,
};

/* M09 „Klausurvorbereitung" (2026-07-20): kanonische Themenliste des Unterrichtsmoduls.
   BEWUSST getrennt von THEMA_RELEVANZ – das ist eine GEWICHTUNGS-Tabelle und speist Ziehung
   und Bereitschafts-Score, von denen M09 ausgeschlossen ist (Sperre in passtAP()). Dies hier
   ist eine reine Vokabelliste für die Validierung; die beiden Mengen MÜSSEN disjunkt bleiben
   (bewacht durch tests/test_unterricht.js). Single Source für validate_batch.js,
   validate_pool.js und tools/build_schema.js; MUSS mit docs/befunde/UNTERRICHT_MATRIX.md übereinstimmen.
   ⚠️ GEÄNDERT 2026-07-30 nach der Probeklausur „Übungsfragen WiSo 31.07.2026 – FISI0126":
   NEU „Aufbau- & Ablauforganisation" (Klausuraufgaben 3, 4, 5, 19, 21 und der Abschnitt
   „Ablauforganisation"); ENTFERNT „Berufsausbildung (BBiG/JArbSchG)" – die 19 Fragen
   M09-131…149 wurden gestrichen, weil die Probeklausur das Thema mit keinem Wort nennt
   (Nutzer-Entscheid 30.07.: die Probeklausur ist laut Lehrer der Bauplan der echten Klausur,
   nicht bloß eine Stichprobe). BBiG-Stoff bleibt in M08 erhalten.
   ⚠️ GEÄNDERT 2026-08-04, Etappe A der M09-Aufloesung (Nutzer-Entscheid nach abgelaufenem
   Klausurtermin): Fünf Themen sind KOMPLETT nach M08/B3 umgezogen und stehen jetzt in
   THEMA_RELEVANZ – „Rechtsformen", „Kaufmannseigenschaft", „Die Firma" (dort
   „Firma & Handelsregister"), „Führungsstile" (dort „Führung & Managementtechniken") und
   „Aufgabenanalyse & -synthese". Sie MÜSSEN hier raus, sonst reisst die Disjunktheits-
   Zusicherung in tests/test_unterricht.js. Die acht verbliebenen Themen warten auf Etappe B
   (Umzug nach M01/M02/M03/M07), die erst laufen kann, wenn A4 ausgebaut ist – der
   Gebiets-Wächter erlaubt nur 28 zusätzliche AP1-Fragen, gebraucht werden 45. */
export const M09_THEMEN: string[] = ["Wertschöpfung", "Aufbau- & Ablauforganisation",
  "Leitungssysteme", "Managementtechniken", "Gantt-Diagramm", "Netzplantechnik",
  "Handlungsvollmachten & Prokura", "Kundenauftrag: Anfrage & Angebot"];

/* FB-R3 (2026-07-23): Sortier-Struktur nach Prüfungsordnung (FISI, Prüfungskatalog 2. Aufl.).
   Oberkategorie „gebiet" (Feld an jeder Frage). AP1 = 5 Gebiete (§ 9 Abs. 2), AP2 = 3 Prüfungs-
   bereiche (§ 21/§ 22/§ 4 Abs. 7), M9 = Klausurvorbereitung (klassenspezifisch, separat).
   L.GEBIETE ist die Anzeige-Reihenfolge + Klarnamen; L.THEMA_GEBIET ist die SINGLE SOURCE der
   Zuordnung Thema→Gebiet und wird von validate_pool gegen das Pool-Feld „gebiet" geprüft
   (Tippfehler-/Drift-Wächter, analog WIRTSCHAFT_THEMEN). */
export const GEBIETE: Array<[string, string, string]> = [
  ["A1", "Kundenbedarfe ermitteln", "AP1"],
  ["A2", "Hard- und Software auswählen & beschaffen", "AP1"],
  ["A3", "IT-Arbeitsplatz konfigurieren, testen & absichern", "AP1"],
  ["A4", "Kunden und Kundinnen einweisen", "AP1"],
  ["A5", "Leistungserbringung kontrollieren & protokollieren", "AP1"],
  ["B1", "Konzeption und Administration von IT-Systemen", "AP2"],
  ["B2", "Analyse und Entwicklung von Netzwerken", "AP2"],
  ["B3", "Wirtschafts- und Sozialkunde", "AP2"],
  ["M9", "Klausurvorbereitung", "M09"]
];

export const THEMA_GEBIET: Record<string, string> = {
  "M01|Machbarkeit & Kalkulation":"A1","M01|SMART-Ziele":"A1","M01|Projektmerkmale & Meilensteine":"A1","M01|Scrum & Wasserfall":"A1","M01|Risiko & Stakeholder":"A1","M01|Teambildung & Reflexion":"A1","M01|Gantt & PSP":"A5","M01|Netzplan & Puffer":"A5","M01|Ticketsystem & Support-Level":"A5","M01|KI im Störungsmanagement":"A5",
  "M02|Bedarfsanalyse & Marktforschung":"A1","M02|Kommunikationsmodelle":"A1","M02|Marktformen & Marktsituation":"A1","M02|Nutzwertanalyse":"A1","M02|Vertriebsformen":"A1","M02|Englische Fachtexte":"A1","M02|Präsentation & Quellen":"A4","M02|Bezugskalkulation & Skonto":"A2",
  "M03|Hardware-Komponenten":"A2","M03|Netzwerkkomponenten & Medien":"A2","M03|Cloud & Virtualisierung":"A2","M03|Dateisysteme & Software":"A2","M03|Datenmengen & Präfixe":"A2","M03|Berechnungen: Daten & Übertragung":"A2","M03|Berechnungen: Energie":"A2","M03|WLAN & Übertragungsstandards":"A2","M03|Wirtschaftlichkeit & TCO":"A2","M03|Netzwerk- und Arbeitsplatz-Ausstattung":"A2","M03|OSI-Modell & Protokolle":"A3","M03|Ergonomie & Barrierefreiheit":"A3",
  "M04|Konsolenbefehle & Fehlersuche":"A3","M04|DHCP & Netzwerkdienste":"A3","M04|WLAN & VPN":"A3","M04|GUI-Entwurf & Software-Ergonomie":"A3","M04|Programmiersprachen, Kontrollstrukturen & Systemgrundlagen":"A3","M04|UML & Schreibtischtest":"A3","M04|Praxisszenarien":"A3","M04|Lastenheft & Pflichtenheft":"A1","M04|Lizenzen & Urheberrecht":"A2","M04|IP-Adressierung":"A3","M04|Subnetting":"B2","M04|ER-Modell & Datenbanken":"B1",
  "M05|Audit & Prüfverfahren":"A3","M05|PDCA & KVP":"A3","M05|QM-Begriffe & Normen":"A3","M05|QM-Prozesse":"A3","M05|Qualitätskosten":"A3","M05|Testprotokoll":"A3",
  "M06|BSI-Grundschutz & Schutzbedarf":"A3","M06|Backup & Verfügbarkeit":"A3","M06|DSGVO & Datenschutz":"A3","M06|Härtung & Zugriffskontrolle":"A3","M06|IT-Sicherheit und Datenschutz-Vorfall":"A3","M06|Passwörter & Authentifizierung":"A3","M06|Phishing & Social Engineering":"A3","M06|Schutzziele (CIA)":"A3","M06|Security by Design":"A3","M06|TOM & Rechtsgrundlagen":"A3","M06|Verschlüsselung & Signaturen":"A3",
  "M07|Abnahme & Übergabe":"A4","M07|Change Management":"A4","M07|Einweisung & Schulung":"A4","M07|SLA & Servicevertrag":"A5","M07|Soll-Ist & Nachkalkulation":"A5","M07|Vertragsarten":"A5","M07|Vertragsstörungen & Mängel":"A5","M07|Onsite/Remote & Nachfolgeaufträge":"A5","M07|Aufbauorganisation & Vollmachten":"A5","M07|Unternehmensziele & Leitbild":"A5",
  "M08|Arbeitsschutz & Arbeitszeit":"B3","M08|Ausbildungsvertrag & BBiG":"B3","M08|Kündigung":"B3","M08|Mitbestimmung: JAV & Betriebsrat":"B3","M08|Rechte & Pflichten":"B3","M08|Tarifrecht":"B3",
  "M08|Rechtsformen":"B3","M08|Kaufmannseigenschaft":"B3","M08|Firma & Handelsregister":"B3","M08|Führung & Managementtechniken":"B3","M08|Aufgabenanalyse & -synthese":"B3","M08|Vertragsanbahnung: Anfrage & Angebot":"B3",
  /* K2 (14.10.2026): AP2-Themen, Gebiet B2 = Platzhalter bis nach der Klausur (PLAN_KLAUSUR2 §8 Schritt 0) */
  "M06|RAID-Systeme":"B2","M06|IDS/IPS":"B2","M03|Netzwerktopologien":"B2",
  /* K3 L4 (24.11.2026, BUILD_LOG 238): DHCPv6/SLAAC (M04-586/587, AP2) im Modul M04 – Nutzer-Entscheid: Tabelle ergaenzen */
  "M04|Netzwerktopologien":"B2"
};
