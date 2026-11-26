/* ============================================================================
   Synonym- und Abkuerzungsgruppen fuer die Freitext-Pruefung.

   ⛔ ZEICHENGLEICH aus app_util.js (Zeilen 628-781) uebernommen, samt Kommentaren.
      Diese Tabelle ist ueber Wochen datengetrieben gewachsen — jede Aenderung daran
      verschiebt Bewertungen. `freitext.gleichheit.test.ts` haelt sie gegen das
      Original, solange app_util.js existiert.

   Schreibweise ist NORMALISIERT (Kleinbuchstaben, Umlaute ausgeschrieben):
   eine Antwort zaehlt, wenn IRGENDEIN Mitglied der Gruppe vorkommt.
   ============================================================================ */

const SYNONYME: ReadonlyArray<readonly string[]> = [
  ["dsgvo","datenschutz grundverordnung","datenschutzgrundverordnung","gdpr"],
  ["bdsg","bundesdatenschutzgesetz"],
  ["usv","unterbrechungsfreie stromversorgung","ups"],
  ["nda","geheimhaltungsvereinbarung","verschwiegenheitsvereinbarung","vertraulichkeitsvereinbarung"],
  ["sla","service level agreement","dienstguetevereinbarung"],
  ["avv","auftragsverarbeitungsvertrag","auftragsverarbeitung"],
  ["vpn","virtual private network"],
  ["dhcp","dhcp server","dynamic host configuration protocol"],
  ["dns","domain name system","namensaufloesung"],
  ["nat","network address translation","adressuebersetzung"],
  ["lan","lokales netzwerk","local area network"],
  ["wlan","wireless lan","funknetz","wifi","wi fi"],
  ["tco","total cost of ownership","gesamtbetriebskosten","gesamtkosten"],
  ["roi","return on investment","kapitalrendite"],
  ["kvp","kontinuierlicher verbesserungsprozess","kaizen"],
  ["pdca","pdca zyklus","plan do check act","demingkreis","deming kreis"],
  ["bsi","bundesamt fuer sicherheit in der informationstechnik"],
  ["2fa","zwei faktor authentifizierung","zweifaktor authentifizierung","mfa","multi faktor authentifizierung","mehr faktor authentifizierung"],
  ["mtbf","mean time between failures"],
  ["mttr","mean time to repair","reparaturzeit"],
  ["os","betriebssystem","operating system"],
  ["pc","rechner","computer","arbeitsplatzrechner"],
  ["hdd","festplatte","magnetfestplatte"],
  ["ssd","solid state drive","halbleiterlaufwerk"],
  ["cpu","prozessor","hauptprozessor"],
  ["ram","arbeitsspeicher","hauptspeicher"],
  ["nas","network attached storage","netzwerkspeicher"],
  ["san","storage area network"],
  ["it","informationstechnik","informationstechnologie"],
  /* zusammengefuehrt 2026-07-20: "ip adresse" stand doppelt (hier und in der Netzadress-Gruppe);
  da SYN_MAP beim Aufbau ueberschreibt, verlor das Mitglied still den Anschluss an "ip". */
  ["ip","internet protocol","ip adresse","netzadresse","adresse im netz"],
  ["mac","mac adresse","hardwareadresse","physische adresse"],
  ["qs","qualitaetssicherung"],
  ["qm","qualitaetsmanagement"],
  ["psp","projektstrukturplan"],
  /* "ist" und "soll" 2026-07-20 als Solo-Mitglieder entfernt (Nutzer-Entscheid): als haeufigste
  deutsche Hilfsverben erfuellten sie jeden beliebigen Satz – "Das Ergebnis ist gut" traf den
  Pflichtbegriff "Ist-Zustand". Die zusammengesetzten Formen bleiben und tragen die Bedeutung. */
  ["ist zustand","istzustand","ist analyse","istanalyse","aktueller zustand","derzeitiger zustand"],
  ["soll zustand","sollzustand","soll konzept","sollkonzept","zielzustand","angestrebter zustand"],
  ["agb","allgemeine geschaeftsbedingungen"],
  ["b2b","business to business"],
  ["b2c","business to consumer"],
  ["ausfallsicherheit","verfuegbarkeit","hochverfuegbarkeit"],
  ["verschluesselung","chiffrierung","kryptografie","kryptographie"],
  ["sicherung","backup","datensicherung"],
  ["schadsoftware","malware","schadprogramm"],
  ["phishing","betrugsmail","betrugs mail"],
  ["firewall","paketfilter"],
  ["patch","update","aktualisierung","sicherheitsupdate"],
  ["redundanz","redundant","doppelt ausgelegt"],
  ["skalierbarkeit","skalierbar","erweiterbarkeit"],
  ["barrierefreiheit","barrierefrei","accessibility"],
  ["lastenheft","anforderungen des auftraggebers"],
  ["pflichtenheft","umsetzungskonzept des auftragnehmers"],
  /* --- Ausbau 2026-07-19 (Nutzer-Entscheid): Umschreibungen in eigenen Worten sollen haeufiger
  treffen. BEWUSST NUR echte Bedeutungsgleichheit im Pruefungskontext – fachlich verschiedene
  Begriffe (z. B. Leistung vs. Energie, Kosten vs. Preis) werden NICHT gleichgesetzt, sonst
  bewertet die Automatik falsche Antworten als richtig. --- */
  /* Projektmanagement / Netzplan */
  ["puffer","spielraum","zeitreserve","reserve","luft"],
  ["projektdauer","gesamtdauer","projektlaufzeit","laufzeit des projekts","gesamtprojektdauer"],
  ["laengste","laengster","laengsten","laengste kette","laengster pfad"],
  ["abhaengigkeiten","abhaengigkeit","vorgaenger","reihenfolgebeziehung"],
  ["verzoegerung","verzug","verspaetung","zeitverlust"],
  ["vorgang","taetigkeit","arbeitsschritt","aktivitaet"],
  ["meilenstein","zwischenziel"],
  /* Kalkulation / Wirtschaftlichkeit */
  ["abweichung","differenz","unterschied","mehrkosten","ueberschreitung"],
  ["schaetzung","kalkulation","annahme","planwert"],
  ["nachkalkulation","nachtraegliche kalkulation","ist kalkulation"],
  ["guenstiger","preiswerter","billiger","wirtschaftlicher","kostenguenstiger"],
  ["betriebskosten","laufende kosten","folgekosten","unterhaltskosten"],
  ["nutzungsdauer","lebensdauer","einsatzdauer"],
  ["wirtschaftlichkeit","rentabilitaet","kosten nutzen verhaeltnis"],
  ["nutzwert","nutzwertanalyse","punktbewertung","scoring"],
  ["gewichtung","gewichtet","wichtung","gewicht"],
  ["empfehlung","empfehlen","rat","vorschlag"],
  /* Markt / Kaufmaennisches */
  /* zusammengefuehrt 2026-07-20 (war doppelt, "kunde" verlor still den Anschluss an "kaeufer") */
  ["kaeufer","erwerber","abnehmer","kunde","kunden","nachfrager","auftraggeber","besteller"],
  ["anbieter","verkaeufer","lieferant"],
  ["nachfrage","bedarf","gefragte menge"],
  ["angebot","angebotene menge","warenangebot"],
  ["verhandlung","verhandlungsposition","verhandlungsmacht","verhandlungsstaerke"],
  ["sinken","sinkend","fallen","fallend","druecken","senken"],
  ["wettbewerb","konkurrenz","marktdruck"],
  /* Technik allgemein */
  ["verhaeltnis","quotient","anteil","relation"],
  ["waerme","abwaerme","verlustwaerme","hitze"],
  ["verlust","verluste","verlustleistung","entweicht"],
  ["nutzleistung","abgegebene leistung","ausgangsleistung"],
  ["eingangsleistung","zugefuehrte leistung","aufgenommene leistung"],
  ["gueltigkeitsdauer","gueltigkeit","zeitraum","leasedauer","mietdauer"],
  ["erneuern","erneuerung","verlaengern","neu anfordern","renewal"],
  /* Qualitaet / Audit */
  ["systematisch","strukturiert","methodisch","geplant","planmaessig"],
  ["ueberpruefung","pruefung","kontrolle","untersuchung","begutachtung"],
  ["standards","vorgaben","richtlinien","regelwerk","normen","anforderungen"],
  /* zusammengefuehrt 2026-07-20 (war doppelt, "dokumentation" verlor still den Anschluss an "nachweis") */
  ["nachweis","beleg","dokumentation","protokoll","dokumentieren","festhalten","protokollieren","aufzeichnen"],
  ["intern","innerbetrieblich","eigene mitarbeiter"],
  ["extern","unabhaengig","externe stelle","dritte"],
  ["peripherie","peripheriegeraete","zusatzgeraete","endgeraete"],
  ["berechtigungen","rechte","zugriffsrechte","zugriffsberechtigung"],
  ["lizenz","lizenzierung","lizenziert","nutzungsrecht"],
  ["anmeldung","login","anmelden","authentifizierung am system"],
  /* Programmierung */
  ["schleife","wiederholung","iteration","durchlauf"],
  ["summe","gesamtwert","ergebnis der addition"],
  ["schreibtischtest","trockentest","manueller durchlauf"],
  /* --- Ausbau 2. Runde (2026-07-19): datengetrieben ermittelt. Ausgewertet wurden alle Begriffe,
  die in >= 4 Musterloesungen der 99 Freitexte vorkommen und noch keine Gruppe hatten. Der
  Grossteil davon war Allgemeinsprache ("werden", "koennen", "zwischen") – dafuer sind Synonyme
  wirkungslos. Uebrig blieben diese echten Fachbegriffe. --- */
  ["massnahmen","massnahme","vorkehrungen","schritte","gegenmassnahmen","massnahmen planen","massnahmen festlegen"],
  ["schulung","einweisung","training","unterweisung","schulen","einweisen"],
  ["begruendung","begruenden","erlaeuterung","erklaerung","rechtfertigung"],
  ["verbesserung","optimierung","steigerung","verbessern","optimieren"],
  ["installation","einrichtung","aufsetzen","installieren","einrichten"],
  ["kontinuierlich","kontinuierliche","laufend","fortlaufend","staendig","stetig"],
  ["reduziert","reduzieren","verringert","gesenkt","vermindert","senkt"],
  ["mitarbeiter","beschaeftigte","personal","angestellte","belegschaft"],
  ["unternehmen","firma","betrieb","gesellschaft"],
  ["support","unterstuetzung","betreuung","hilfestellung","hilfe"],
  ["erreichbar","verfuegbar","zugaenglich","abrufbar"],
  ["techniker","servicetechniker","fachkraft","it fachkraft"],
  ["lessons learned","erfahrungssicherung","erkenntnisse","projekterfahrung"],
  ["pruefen","ueberpruefen","testen","kontrollieren","verifizieren"],
  ["zustaendig","verantwortlich","zustaendigkeit","verantwortung"],
  ["frist","termin","zeitvorgabe","stichtag","deadline"],
  /* --- Ausbau 3. Runde (2026-07-20): Mehrwort-Phrasen und ihre Abkuerzungen. Anlass war der Befund,
  dass Mehrwort-Begriffe ueberproportional ausfielen. Der Token-Fallback in begriffTreffer deckt
  den zusammengesetzten Fall ab; hier stehen die Faelle, in denen die KURZFORM ALLEIN als Antwort
  genuegen soll – die kann der Fallback prinzipbedingt nicht loesen. Alle Kuerzel sind <= 4 Zeichen
  und damit durch die Wortgrenzen-Regel geschuetzt ("ad" trifft NICHT in "Adresse"). --- */
  ["sso","single sign on","einmalanmeldung","einmalige anmeldung","zentrale anmeldung"],
  ["dc","domain controller","domaenencontroller","domaenen controller"],
  ["gpo","group policies","group policy","gruppenrichtlinien","gruppenrichtlinie"],
  ["ad","active directory","verzeichnisdienst"],
  ["product owner","produktverantwortlicher","produkt owner"],
  ["sprint backlog","backlog","product backlog","produkt backlog","anforderungsliste"],
  ["sprint review","sprint abnahme","ergebnispraesentation"],
  ["inkrement","zwischenergebnis","lauffaehiges ergebnis","teilergebnis"],
  /* "iteration" steht bewusst NUR in der Schleifen-Gruppe – keine Dopplung */
  ["iterativ","in wiederholungen","schrittweise","zyklisch","in iterationen"],
  /* Eisbergmodell (M02-109): Sach- und Beziehungsebene sind die gaengigen Lehrbuch-Bezeichnungen */
  ["sichtbare ebene","sachebene","sachliche ebene","sichtbarer teil","spitze des eisbergs"],
  ["verborgene ebene","beziehungsebene","verborgener teil","unsichtbare ebene","unter der oberflaeche"],
  ["emotionen","gefuehle","empfindungen","stimmung"],
  /* "beziehungsebene" steht bewusst NUR in der Gruppe darueber – keine Dopplung. Ueber das Mitglied
  "beziehung" trifft dieser Begriff trotzdem in "Beziehungsebene" (Kompositum, > KURZ_MAX). */
  ["beziehungsaspekte","beziehung","zwischenmenschliches","beziehungsebene der kommunikation"]
];

/** Mitglied -> Gruppe. Ein spaeterer Eintrag ueberschreibt einen frueheren — genau wie
    im Original; die dort dokumentierten Zusammenlegungen haengen daran. */
export const SYN_MAP: Record<string, readonly string[]> = {};
for (const gruppe of SYNONYME) for (const wort of gruppe) SYN_MAP[wort] = gruppe;
