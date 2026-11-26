/* ============================================================================
   N34 T6b (E50, E56, 26.09.2026): Tooltip-Glossar und M09-Begriffe
   Uebernommen aus `referenz/app_glossar.js` (Z. 2-95) - Werte UND Kommentare wortgleich, per Skript
   ausgeschnitten. Seit T6b ist DIESE Datei die Quelle (die Wurzel-Datei faellt mit T6c).
   ⛔ Diese Datei importiert nichts - Werkzeuge laden sie direkt (E49).
   ============================================================================ */

/* =================== #53 Tooltip-Glossar (kuratierte Kernbegriffe) ===================
   Kurzdefinitionen zu Kernbegriffen. Im Fragetext werden max. 2 exakte Treffer als .glossar-term
   markiert; Tooltip per Hover (Desktop) / Tap (Handy). Gilt nur außerhalb der Simulation und nur bei
   S.glossarTip. Leak-Schutz: kein Treffer, dessen Begriff in einer Antwortoption/Musterlösung vorkommt;
   nur der Fragetext wird gescannt (nie die Optionen). Deutsche Anführungszeichen „…" statt geradem ". */
export const GLOSSAR_TIPS: Record<string, string> = {
  "OSI-Modell": "Referenzmodell mit 7 Schichten für Netzkommunikation (Bitübertragung bis Anwendung).",
  "OSI": "Schichten-Referenzmodell der Netzkommunikation (7 Schichten).",
  "SLA": "Service Level Agreement – vertraglich zugesicherte Dienstgüte (z. B. Verfügbarkeit, Reaktionszeit).",
  "DHCP": "Vergibt IP-Adresse und Netzparameter automatisch an Clients.",
  "DNS": "Domain Name System – löst Namen (z. B. web.de) in IP-Adressen auf.",
  "VLAN": "Virtuelles LAN – logische Trennung eines Switches in getrennte Netze.",
  "VPN": "Verschlüsselter Tunnel über ein öffentliches Netz.",
  "Firewall": "Filtert den Netzverkehr nach Regeln und trennt Netzbereiche.",
  "Subnetzmaske": "Trennt in einer IP-Adresse den Netz- vom Hostanteil.",
  "Subnetz": "Teilnetz eines IP-Netzes, festgelegt durch die Subnetzmaske.",
  "Gateway": "Übergang in andere Netze; typisch der Router als Standard-Gateway.",
  "IP-Adresse": "Eindeutige Adresse eines Geräts im IP-Netz (IPv4/IPv6).",
  "MAC-Adresse": "Weltweit eindeutige Hardware-Adresse einer Netzkarte.",
  "TCP": "Verbindungsorientiertes, zuverlässiges Transportprotokoll (mit Bestätigung).",
  "UDP": "Verbindungsloses, schnelles Transportprotokoll ohne Empfangsbestätigung.",
  "HTTPS": "HTTP über TLS – verschlüsselte Web-Kommunikation.",
  "Backup": "Datensicherung zur Wiederherstellung nach Verlust (voll/inkrementell/differenziell).",
  "Phishing": "Täuschung per Mail/Webseite zum Abgreifen von Zugangsdaten.",
  "Ransomware": "Schadsoftware, die Daten verschlüsselt und Lösegeld fordert.",
  "Malware": "Sammelbegriff für Schadsoftware (Viren, Würmer, Trojaner …).",
  "DSGVO": "EU-Datenschutz-Grundverordnung – Regeln für personenbezogene Daten.",
  "Skonto": "Preisnachlass bei Zahlung innerhalb der Skontofrist.",
  "Nutzwertanalyse": "Bewertung von Alternativen über gewichtete Kriterien × Punkte.",
  "Lastenheft": "Anforderungen des Auftraggebers (das Was) – vom Kunden formuliert.",
  "Pflichtenheft": "Umsetzungskonzept des Auftragnehmers (das Wie) – vom Anbieter erstellt.",
  "kritischer Pfad": "Längste Vorgangskette ohne Puffer – bestimmt die Projektdauer.",
  "Pufferzeit": "Zeitreserve eines Vorgangs, ohne das Projektende zu verzögern.",
  "Netzplan": "Ablaufplan mit Vorgängen, Dauern und Abhängigkeiten (FAZ/FEZ/Puffer).",
  "ROI": "Return on Investment – Verhältnis von Gewinn zu eingesetztem Kapital.",
  "TCO": "Total Cost of Ownership – Gesamtkosten über den Lebenszyklus.",
  "Amortisation": "Zeitraum, bis die Erträge die Investition gedeckt haben.",
  "UML": "Grafische Modellierungssprache für Software (z. B. Klassendiagramm).",
  "Scrum": "Agiles Rahmenwerk mit Sprints, Rollen und Artefakten.",
  "Verfügbarkeit": "Schutzziel: Anteil der Zeit, in der ein System nutzbar ist.",
  "Vertraulichkeit": "Schutzziel: nur Berechtigte haben Zugriff.",
  "Integrität": "Schutzziel: Daten sind unverändert und korrekt.",
  "Verschlüsselung": "Umwandlung von Klartext in Chiffrat mithilfe eines Schlüssels.",
  /* Begriffe aus „Klausurvorbereitung" (M09, 2026-07-20; Modul frueher „Unser Unterricht"). Sie stehen bewusst in DERSELBEN Tabelle:
     Tooltips sind eine reine Lesehilfe im Fragetext und haben mit der Modultrennung nichts zu tun –
     die betrifft die Fragen-ZIEHUNG. Mehrere dieser Begriffe kommen ohnehin auch in AP1-Fragen vor
     (Prokura und Handlungsvollmacht z. B. in Modul 07). Der Leak-Schutz greift unverändert. */
  "Prokura": "Weitreichende Handlungsvollmacht (§§ 48 ff. HGB) – auch außergewöhnliche Geschäfte, aber keine Grundstücksgeschäfte ohne Sondervollmacht.",
  "Handlungsvollmacht": "Vollmacht für die gewöhnlichen Geschäfte eines Handelsbetriebs (§ 54 HGB) – enger als die Prokura.",
  "Prokurist": "Person, der ein Kaufmann Prokura erteilt hat.",
  "Istkaufmann": "Kaufmann kraft Handelsgewerbes in kaufmännischer Weise (§ 1 HGB); Eintragung nur deklaratorisch.",
  "Kannkaufmann": "Kleingewerbetreibender, der sich freiwillig einträgt (§ 2 HGB) – erst die Eintragung macht ihn zum Kaufmann.",
  "Formkaufmann": "Kaufmann allein kraft Rechtsform (z. B. GmbH, AG), unabhängig von der Tätigkeit.",
  "Handelsregister": "Öffentliches Verzeichnis der Kaufleute. Abteilung A: e.K., OHG, KG. Abteilung B: Kapitalgesellschaften.",
  "Firma": "Der Handelsname eines Kaufmanns (§ 17 HGB) – nicht das Unternehmen selbst, sondern sein Name.",
  "Komplementär": "Persönlich und unbeschränkt haftender Gesellschafter einer KG.",
  "Kommanditist": "Gesellschafter einer KG, der nur bis zur Höhe seiner Einlage haftet.",
  "Stammkapital": "Mindestkapital einer GmbH: 25.000 Euro (AG: 50.000 Euro Grundkapital).",
  "Stabsstelle": "Beratende Stelle ohne Weisungsbefugnis; im Organigramm meist gestrichelt angebunden.",
  "Einliniensystem": "Jede Stelle hat genau einen Vorgesetzten – klare Wege, aber lange Dienstwege.",
  "Mehrliniensystem": "Eine Stelle erhält Weisungen von mehreren Fachvorgesetzten – schnell, aber konfliktanfällig.",
  "Stabliniensystem": "Einliniensystem, ergänzt um beratende Stäbe ohne Weisungsbefugnis.",
  "Matrixorganisation": "Zwei Leitungsdimensionen gleichzeitig, meist Funktion × Projekt – flexibel, aber komplex.",
  "Aufgabenanalyse": "Zerlegen der Gesamtaufgabe in Teil- und Elementaraufgaben (top-down).",
  "Aufgabensynthese": "Bündeln der Elementaraufgaben zu Stellen und Abteilungen (bottom-up).",
  "Elementaraufgabe": "Kleinste, nicht weiter sinnvoll teilbare Teilaufgabe der Aufgabenanalyse.",
  "Wertschöpfung": "Wert der erstellten Leistung abzüglich der von Dritten bezogenen Vorleistungen.",
  "Kernprozess": "Prozess, der unmittelbar zur Wertschöpfung beiträgt (Beschaffung, Produktion, Absatz).",
  "Unterstützungsprozess": "Prozess, der nur indirekt zur Wertschöpfung beiträgt (IT, Personal, Verwaltung).",
  "MbO": "Management by Objectives – Führung über gemeinsam vereinbarte Ziele.",
  "MbE": "Management by Exception – Eingriff nur bei Abweichungen vom Plan.",
  "MbD": "Management by Delegation – Übertragung von Aufgaben samt Verantwortung.",
  "Eisenhower-Matrix": "Priorisierung nach Wichtigkeit und Dringlichkeit: sofort, planen, delegieren, weglassen.",
  "Meilenstein": "Ereignis ohne eigene Dauer; im Gantt-Diagramm als Raute dargestellt.",
  "Gesamtpuffer": "Zeitreserve eines Vorgangs: GP = SAZ − FAZ. Vorgänge mit GP = 0 liegen auf dem kritischen Pfad.",
  "Bindefrist": "Zeitraum, in dem der Anbieter an sein Angebot gebunden ist.",
  "Freizeichnungsklausel": "Zusatz wie „freibleibend\", der ein Angebot unverbindlich macht.",
  "Bezugspreis": "Bareinkaufspreis zuzüglich Bezugskosten – das Ergebnis der Bezugskalkulation.",
  "Probezeit": "Beginn der Berufsausbildung, 1 bis 4 Monate (§ 20 BBiG); Kündigung jederzeit fristlos, aber schriftlich.",
  "JArbSchG": "Jugendarbeitsschutzgesetz – Arbeitszeit, Pausen und Urlaub für Beschäftigte unter 18.",
  "BBiG": "Berufsbildungsgesetz – Ausbildungsvertrag, Probezeit, Kündigung, Vergütung."
};
/* Begriffe der Kategorie „Klausurvorbereitung" fürs Begriffslexikon (Glossar-Seite, 2026-07-20).
   Das Lexikon speist sich sonst automatisch aus kurzen erklaeren-Fragen – die fünf M09-Erklärfragen
   sind aber Fallfragen (zu lang, mit Fragezeichen) und fallen durch diesen Filter. Deshalb hier eine
   ausdrückliche Liste. Sie enthält NUR Schlüssel, die Definition steht in GLOSSAR_TIPS: eine Quelle
   für Tooltip und Lexikon, damit beide nicht auseinanderlaufen (ein Test prüft das).
   Im Lexikon sind die Einträge durch den Modul-Tag „Klausurvorbereitung" als Nicht-AP1-Stoff erkennbar. */
export const GLOSSAR_M09_BEGRIFFE: string[] = ["Prokura", "Handlungsvollmacht", "Prokurist", "Istkaufmann", "Kannkaufmann",
  "Formkaufmann", "Handelsregister", "Firma", "Komplementär", "Kommanditist", "Stammkapital",
  "Stabsstelle", "Einliniensystem", "Mehrliniensystem", "Stabliniensystem", "Matrixorganisation",
  "Aufgabenanalyse", "Aufgabensynthese", "Elementaraufgabe", "Wertschöpfung", "Kernprozess",
  "Unterstützungsprozess", "MbO", "MbE", "MbD", "Eisenhower-Matrix", "Meilenstein", "Gesamtpuffer",
  "Bindefrist", "Freizeichnungsklausel", "Bezugspreis", "Probezeit", "JArbSchG", "BBiG"];
