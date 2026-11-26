"use strict";
var TEXTE = {
  aktion: {
    pruefen: "Lösung prüfen",
    pruefenKurz: "Prüfen",
    alsAuswahl: "Als Auswahl anzeigen",
    alsFreitext: "Als Freitext anzeigen",
    antwortPruefen: "Antwort prüfen",
    weiter: "Nächste Aufgabe",
    weiterKurz: "Weiter",
    zurueckKurz: "Zurück",
    zurueckPfeil: "← Zurück",
    weiterPfeil: "Weiter →",
    abgeben: "Abgeben",
    pruefungStarten: "Prüfung starten",
    netzplanPruefen: "Netzplan prüfen",
    ganttPruefen: "Gantt prüfen",
    insBildKlicken: "Ins Bild klicken",
    fehlerhafteZeile: "Fehlerhafte Zeile anklicken",
    neueAufgabe: "Neue Aufgabe",
    neueNetzplanAufgabe: "Neue Netzplan-Aufgabe",
    neueGanttAufgabe: "Neue Gantt-Aufgabe",
    zuruecksetzen: "Zurücksetzen",
    markierungEntfernen: "Markierung entfernen",
    spaeterPruefen: "Später prüfen",
    zurStartseite: "Zur Startseite",
    neuLaden: "Neu laden",
    nochEineSerie: "Noch eine Serie",
    alsJsonHerunterladen: "Als JSON herunterladen",
    alsTextHerunterladen: "Als Text herunterladen",
    kompFortschrittLoeschen: "Kompletten Fortschritt löschen",
    ausblenden: "ausblenden",
    entfernen: "Entfernen",
    netzplanTrainingOeffnen: "Netzplan-Training öffnen",
    alleThemenBtn: "Alle Themen",
    einfuehrungstour: "Einführungs-Tour erneut zeigen",
    bedienhilfenEinblenden: "Bedienhilfen wieder einblenden",
    ichHabsUeberlegt: "Ich hab's überlegt – Optionen zeigen",
    neinSoLassen: "Nein, so lassen",
    hoch: "hoch",
    losGehts: "Los geht's",
    runter: "runter",
    zufaellig: "Zufällig",
    musterloesungAnzeigen: "Musterlösung anzeigen",
    melden: "Melden",
    ueberspringen: "Überspringen"
  },
  hinweis: {
    waehleAntwort: "Wähle rechts eine Antwort.",
    ordneAllePaare: "Ordne alle Paare zu.",
    waehleAlleRichtigen: "Wähle alle richtigen Antworten.",
    fuerJedeLuecke: "Für jede Lücke eine Option wählen.",
    ordneElementeMatrix: "Ordne alle Elemente in die Matrix.",
    ordneStellenZu: "Ordne alle Stellen zu.",
    bitteSelbsteinschaetzung: "Bitte Selbsteinschätzung bestätigen.",
    klickeStelleBildKurz: "Klicke die richtige Stelle im Bild an.",
    klickeFehlerhafteZeileKurz: "Klicke die fehlerhafte Zeile im Code an.",
    fuelleGeruest: "Fülle alle Stellen des Gerüsts.",
    rechenaufgabeZufall: "Rechenaufgabe mit Zufallswerten – Ergebnis(se) eintragen. Kommazahlen mit Komma oder Punkt.",
    zuordnungDragDropLoeser: "Ziehe einen linken Begriff per Drag &amp; Drop auf den passenden rechten – oder klicke erst links, dann rechts. Verbundenes Paar anklicken = lösen.",
    zuordnungKlickenFrage: "Erst links klicken, dann rechts – Paar wird verbunden. Verbundenes Paar anklicken = lösen.",
    /* FB-R2b: Spaltenüberschriften des Zuordnungs-Layouts. Bewusst neutral gehalten, weil der
       Typ für sehr verschiedene Inhalte genutzt wird (Begriff→Definition, Aussage→Modell …). */
    zuordnungLinks: "Zuordnen",
    zuordnungRechts: "… zu diesen",
    mehrfachauswahl: "Mehrfachauswahl – wähle ALLE zutreffenden Antworten.",
    mtfAuswahl: "Bewerte jede Aussage als wahr oder falsch. Als „richtig“ zählt die Aufgabe nur, wenn ALLE Aussagen korrekt bewertet sind.",
    mtfAlleMarkieren: "Bitte jede Aussage mit Wahr oder Falsch markieren.",
    mtfWahr: "Wahr",
    mtfFalsch: "Falsch",
    kreuztabelleAnkreuzen: "Kreuze in der Tabelle jede zutreffende Zelle an. Als „richtig“ zählt die Aufgabe nur, wenn ALLE Zellen korrekt gesetzt sind.",
    kreuztabelleMinEins: "Kreuze mindestens ein Feld an.",
    szenario2Ablauf: "Entscheide in zwei Schritten. Als „richtig“ zählt die Aufgabe nur, wenn BEIDE Schritte korrekt sind.",
    szenario2Schritt1: "Schritt 1",
    szenario2Schritt2: "Schritt 2",
    szenario2Konsequenz: "Konsequenz:",
    szenario2BeideWaehlen: "Bitte in beiden Schritten eine Option wählen.",
    reihenfolgeDragDrop: "Ziehe die Schritte per Drag &amp; Drop – oder nutze hoch/runter – in die richtige Reihenfolge.",
    hotspotBild: "Klicke die richtige Stelle im Bild an (die möglichen Bereiche sind markiert).",
    fehlersucheZeile: "Klicke die Zeile an, die den Fehler enthält.",
    rechenassistentSchritt: "Löse Schritt für Schritt – gib jedes Zwischenergebnis ein.",
    matrixZiehen: "Ziehe jedes Element in das passende Feld – oder Element anklicken, dann Feld anklicken.",
    beschriftungZiehenLoeser: "Ziehe jeden Begriff auf die passende nummerierte Stelle – oder Begriff anklicken, dann Stelle.",
    traceSchreibtisch: "Führe den Code im Kopf aus (Schreibtischtest) und trage die Werte je Schritt ein.",
    konsoleBefehl: "Gib den passenden Konsolenbefehl ein (Groß-/Kleinschreibung und Leerzeichen sind egal).",
    kalkulationZellen: "Fülle die leeren Zellen aus (Zwischen- und Endergebnisse). Feste Werte sind vorgegeben.",
    baukastenZiehen: "Ziehe die Bausteine an die richtigen nummerierten Stellen des Gerüsts (oder anklicken).",
    freitextErklaerenLoeser: "Erkläre den Begriff in eigenen Worten – die App gleicht anschließend Schlüsselbegriffe ab.",
    freitextAntwortLoeser: "Antwort formulieren – die App gleicht anschließend Schlüsselbegriffe ab.",
    freitextErklaerenFrage: "Erkläre den Begriff in eigenen Worten – danach mit der Musterlösung vergleichen.",
    freitextAntwortFrage: "Antwort formulieren – danach selbst mit der Musterlösung vergleichen.",
    abrufUeberlegen: "Abruf-Übung: Überlege die Antwort zuerst selbst – dann Optionen aufdecken.",
    abrufToggleLabel: "Abruf-Übung: Optionen erst verdecken",
    abrufToggleTitle: "Auswahl-Fragen (mc/dropdown/mehrfach) zeigen zuerst nur die Frage; du deckst die Optionen selbst auf. Gilt ab der nächsten Frage. Nicht in der Simulation.",
    vervollstaendigeLueckentext: "Vervollständige den Lückentext im rechten Feld.",
    waehleDropdownFeld: "Wähle im rechten Feld für jede Lücke die passende Option.",
    lueckenketteFreitext: "Fülle jede Lücke frei aus (Groß-/Kleinschreibung egal). Über den Umschalter kannst du stattdessen aus Optionen wählen.",
    /* FB-R3.3: Knotenschema auf die Fassung umgestellt, die der Fragenpool lehrt und M01-970
       abfragt – FAZ · Dauer · FEZ oben, SAZ · GP · SEZ unten. Die Dauer ist vorgegeben, es
       bleiben 5 Eingabefelder je Vorgang (6 Vorgänge = 30). FP entfällt (Nutzer-Entscheid). */
    netzplanReihenfolge: "Aufbau des Knotens: oben FAZ | Dauer | FEZ, unten SAZ | GP | SEZ",
    netzplanAlle30: "Alle 30 Felder ausfüllen – dann prüfen.",
    netzplanRotBlauGrau: "Rot = kritischer Pfad (Puffer 0), Blau = Vorgang mit Puffer, Grau = freier Puffer bis zum spätesten Ende.",
    ganttFuerJeden: "Für jeden Vorgang Start- und End-Tag eintragen – dann prüfen.",
    ganttPerfektGeplant: " Perfekt geplant.",
    netzplanPerfektGerechnet: " Perfekt gerechnet.",
    feldFalschRotMarkiert: " Falsche Felder sind rot markiert – die richtige Zahl steht im Tooltip (Maus über das Feld).",
    ganttVorgaengeKritisch: "Vorgänge auf dem kritischen Pfad dürfen sich nicht verzögern.",
    frageNichtGeladen: "Diese Frage konnte nicht geladen werden und wurde übersprungen.",
    nichtsFaelligDeck: "Nichts fällig – alles im grünen Bereich.",
    fertigFaelligeFragen: "Fertig – alle fälligen Fragen bearbeitet.",
    fertigMarkierteFragen: "Fertig – alle markierten Fragen bearbeitet.",
    nochNichtsMarkiert: "Noch nichts markiert. Klicke bei einer Frage im Üben-Modus auf „☆ Markieren“, um sie hier zu sammeln.",
    keineFragenGewaehlterFilter: "Keine Fragen im gewählten Filter vorhanden.",
    keineFragenLernfeld: "Keine Fragen im Lernfeld verfügbar.",
    zuWenigeFragen: "Zu wenige geeignete Fragen im Pool.",
    fragenbasisHinweis: "Fragenbasis: echter AP1-Stoff inkl. Subnetting/Datenmodell (M04), ohne WiSo. Ein Fragen-Gedächtnis sorgt dafür, dass sich Simulationen nicht wiederholen – weder komplette Durchläufe noch einzelne Fragen, bis der Pool weitgehend ausgeschöpft ist.",
    ap1PunkteVariieren: "In der echten AP1 hat jede der vier Aufgaben zwischen 20 und 30 Punkten (zusammen 100). Die Verteilung wird hier bei jedem Anlauf neu gezogen.",   // G3.6b
    ihkNotenschluessel: "IHK-Notenschlüssel: 100–92 sehr gut · 91–81 gut · 80–67 befriedigend · 66–50 ausreichend · 49–30 mangelhaft · unter 30 ungenügend · bestanden ab 50 %",
    simIntroPrefix: "Aufbau wie in der echten AP1: eine gemeinsame Ausgangssituation, <b>4 Aufgaben</b> über alle Handlungsfelder, <b>100 Punkte</b>, ",
    simIntroSuffix: ". Kein Feedback während der Prüfung, automatische Abgabe bei Zeitablauf. Jede Simulation enthält eine <b>Fallaufgabe</b> (Szenario mit zusammenhängenden Teilaufgaben) wie in echten AP1-Klausuren. Es werden nur automatisch bewertbare Formate gestellt (MC, Mehrfachauswahl, Dropdown-Lückentext, Zuordnung, Bild); WiSo ist nicht Teil der AP1. Bewertung nach IHK-Notenschlüssel, bestanden ab 50 %.",
    simDauerAutomatisch: "<b>Dauer automatisch</b> (aus Aufgabentypen)",
    simAusgangssituation: "<b>Ausgangssituation:</b> Sie absolvieren Ihre Ausbildung in der IT-Abteilung der <b>Rhaus-Metall-GmbH</b>, einem mittelständischen Fertigungsunternehmen mit mehreren Standorten. Die folgenden Aufgaben beziehen sich auf diese Situation.",
    simAufgabenGesamt: "Aufgaben gesamt (auf 4 Blöcke verteilt): ",
    netzplanTitel: "Netzplan-Training",
    netzplanHint: "Trage in jeden Knoten <b>FAZ, FEZ, SAZ, SEZ</b> und <b>GP</b> (Gesamtpuffer) ein – die Dauer steht schon da. Jedes Feld wird einzeln geprüft. Rechne erst vorwärts (FAZ/FEZ), dann rückwärts (SAZ/SEZ), dann den Puffer.",
    ganttTitel: "Gantt-Training (Balkenplan)",
    ganttHint: "Plane jeden Vorgang <b>so früh wie möglich</b> (Ende-Start-Beziehung, Tag 1 = Projektstart). Trage für jeden Vorgang den frühesten <b>Start-Tag</b> und <b>End-Tag</b> ein. Ein Nachfolger startet am Tag <b>nach</b> dem Ende seines spätesten Vorgängers; End-Tag = Start-Tag + Dauer − 1.",
    abkFreischaltHinweis: "Abkürzungs-Lexikon ab 31 beantworteten Fragen freigeschaltet",
    simulationsdauerHint: "0 = automatisch aus Aufgabentypen (Richtwerte)",
    ap2FokusTitle: "WiSo (M08), Subnetting-Rechnen und ER-Modell/Datenbanken sind laut Katalog 2. Auflage AP2-Stoff.",
    ap2Einbeziehen: " Auch AP2-Zusatzstoff (WiSo, Subnetting, Datenbanken) einbeziehen",
    /* FB-R3: Der wirtschaftliche AP1-Stoff liegt verteilt in M01/M02/M03/M07. Das Modul „WiSo"
       (M08) ist AP2 und im AP1-Modus leer – genau das hat der Nutzer als „keine WiSo-Fragen"
       erlebt. Dieser Schwerpunkt macht den vorhandenen Stoff quer über die Lernfelder auffindbar. */
    wirtschaftFilterTitle: "Zeigt nur die wirtschaftlichen Themen der AP1: Kalkulation, Marktformen, Nutzwertanalyse, Wirtschaftlichkeit/TCO, Vertragsarten, Aufbauorganisation und Soll-Ist-Vergleich. Sie liegen in mehreren Lernfeldern verteilt – „WiSo\" (M08) selbst ist AP2-Stoff.",
    wirtschaftFilter: " Nur Schwerpunkt Wirtschaft (lernfeldübergreifend)",
    wirtschaftLeer: "Im Schwerpunkt Wirtschaft gibt es zu den gewählten Lernfeldern keine Fragen. Nimm ein Lernfeld dazu oder schalte den Schwerpunkt ab.",
    fokusTitel: "Nebenelemente ausblenden, Aufgabe zentrieren",
    balkenplanKicker: "Balkenplan (korrekte Lösung)",
    loesungswegSchritt: "Lösungsweg Schritt für Schritt",
    kompletterLoesungsweg: "Kompletter Lösungsweg",
    bedienhilfeNichtMehr: "Diese Bedienhilfe nicht mehr zeigen"
  },
  feedback: {
    richtig: "Richtig.",
    falsch: "Leider falsch.",
    lob2: "Stark – weiter so.",
    lob3: "Genau richtig.",
    lob4: "Korrekt.",
    lob5: "Sitzt."
  },
  label: {
    musterloesung: "Musterlösung:",
    warumAndereFalsch: "Warum sind die anderen falsch?",
    ausfuehrlicheErklaerung: "Ausführliche Erklärung",
    warumFalsch: "Warum war das falsch?",
    eigeneNotiz: "Eigene Notiz zu dieser Frage",
    selbsteinschaetzung: "Selbsteinschätzung:",
    deineSelbsteinschaetzungStat: "Deine Selbsteinschätzung (zählt für Statistik &amp; Fehler-Deck):",
    naeherungBegriffsAbgleich: "Näherung per Begriffs-Abgleich (inkl. Abkürzungen, Synonymen und Schreibvarianten) – vergleiche deine Antwort mit der Musterlösung. <b>Deine Selbsteinschätzung zählt.</b>",
    automatischeEinschaetzung: "Automatische Einschätzung:",
    theorieNachlesen: "Theorie nachlesen",
    schwierigkeitErhoehen: "Schwierigkeit erhöhen?"
  },
  einschaetzung: {
    wahrscheinlichRichtig: "wahrscheinlich richtig",
    teilweiseRichtig: "teilweise richtig",
    eherUnvollstaendig: "eher unvollständig",
    nichtSicherBewertbar: "nicht sicher bewertbar",
    keineAntwortErkannt: "keine Antwort erkannt",
    wusste: "wusste ich",
    teilweiseWort: "teilweise",
    wussteNicht: "wusste ich nicht",
    vorschlagSuffix: " (Vorschlag)"
  },
  meta: {
    ap2Zusatz: "AP2-Zusatz",
    ap2TitelKurz: "Laut Prüfungskatalog AP2-Stoff",
    ap2TitelLang: "Laut Prüfungskatalog AP2-Stoff – hier als Zusatzübung",
    wiedervorlage: "Wiedervorlage",
    wiedervorlageTitel: "Wiedervorlage aus dem Fehler-Deck",
    themenSerie: "Themen-Serie",
    themenSerieTitel: "Aus der Themen-Serie (Mehr zu diesem Thema)"
  },
  aufgabe: {
    kicker: "Aufgabenstellung",
    kickerLoesung: "Deine Lösung",
    netzplanDiagrammAlt: "Netzplan-Diagramm"
  },
  overlay: {
    vergroessern: "Vergrößern",
    vergroessernAria: "Grafik vergrößern",
    schliessen: "Schließen"
  },
  // G1.6 #11: PWA-Update-Hinweis (erscheint nur in der installierten/http(s)-Fassung)
  pwa: {
    updateHinweis: "Neue Version verfügbar – wird geladen, sobald du die aktuelle Aufgabe abgeschlossen hast."
  },
  // G1.5 #46: Accessible Names für Formularelemente ohne sichtbar verknüpftes <label> (axe: label/select-name)
  aria: {
    lueckePrefix: "Lücke ",
    aktionsleiste: "Aktionen",
    onboardingDialog: "Einführungstour",
    /* ══════════ 2026-07-27: NAMEN FÜR BEDIENELEMENTE OHNE TEXTINHALT ══════════
       Ein <input>, ein leeres Ablage-<div> mit role="button" und eine leere Kopfzelle haben von
       sich aus KEINEN zugänglichen Namen. Ein Screenreader liest dann „Eingabefeld, Eingabefeld,
       Eingabefeld" – bei `trace` sind das zwölf Stück in einer Tabelle. axe meldet das als `label`
       (critical) bzw. `aria-command-name` (serious) bzw. `empty-table-header` (minor).
       ⚠️ Diese Befunde lagen JAHRELANG im Code, ohne dass test_axe sie sah: die Suite prüfte eine
       ZUFÄLLIG gezogene Frage (siehe Kopf von tests/test_axe.js). Seit dem 27.07. wird jeder
       Fragetyp einzeln geprüft – erst dadurch kamen acht Typen auf einmal zum Vorschein.
       ⚠️ Der Name soll SAGEN, WO MAN IST, nicht nur DASS da etwas ist: bei Tabellen also
       Spaltenkopf + Zeilennummer, bei Schritten der Aufgabentext, nicht bloß „Feld 3". */
    antwortPrefix: "Antwort ",
    ablagePrefix: "Ablagefeld ",
    befehlPrefix: "Befehl ",
    schrittPrefix: "Schritt ",
    zellePrefix: "Zeile "
  },
  fokus: {
    an: "Fokus: an",
    aus: "Fokus",
    verlassen: "✕ Fokus verlassen"
  },
  unterricht: {
    /* FB-R1.9: Der Bereich heisst in der Oberflaeche „Vorbereitung nächste Klausur" – das sagt,
       WOFUER er da ist. FB-R3 (2026-07-21): Der MODULNAME (UNTERRICHT_MODUL in app_pool.js, Tag an
       jeder Frage und im Begriffslexikon) heisst jetzt „Klausurvorbereitung" – er wurde von „Unser
       Unterricht" umbenannt (Nutzer-Entscheid). Die 105 „verweis"-Felder im Pool wurden dabei
       mitgezogen (Format „Klausurvorbereitung – <Thema>"). */
    kicker: "Vorbereitung nächste Klausur",
    erklaerung: "Dieser Bereich enthält den Stoff aus dem WiSo-Unterricht (Klasse FISI0126) – erstellt nach der Themenliste und den Aufgabenblättern aus dem Unterricht. Der Termin der nächsten Klausur steht in KLAUSUR_TERMIN (app_state.js); ist er gesetzt, erscheint oben ein Countdown. Er ist komplett vom AP1-Fragenpool getrennt: Diese Fragen erscheinen nie im normalen Üben, in der 5er-Serie oder in der Prüfungssimulation und zählen nicht in die AP1-Bereitschaft. Falsch beantwortete Fragen kommen wie gewohnt ins gemeinsame Fehler-Deck zur Wiedervorlage.",
    /* ⚠️ 2026-07-30 NUTZER-BEFUND: "der text oben ... stoert beim normalen bearbeiten. nur am
       anfang anzeigen und dann nicht mehr anzeigen". Der Absatz steht deshalb jetzt in einem
       statPanel: offen, solange in diesem Bereich noch keine Frage beantwortet wurde - danach
       eingeklappt. Wer ihn manuell auf- oder zuklappt, uebersteuert das dauerhaft (S.panelOffen). */
    infoTitel: "Was ist dieser Bereich?",
    /* ⚠️ 2026-08-04: Das Datum stand hier IM TEXT und ein zweites Mal als Date-Objekt in
       app_seiten.js. Zwei Quellen fuer denselben Termin - beim Ablaufen musste man beide
       finden. Jetzt ist {datum} ein Platzhalter, gefuellt aus KLAUSUR_TERMIN. */
    countdownPrefix: "Klausur am {datum}",
    countdownTage: " – noch {n} Tage",
    countdownHeute: " – HEUTE!",
    countdownVorbei: " (liegt zurück)",
    zurueckStart: "← Zurück zur Startseite",
    keineFragen: "Die Fragen für diesen Bereich werden gerade erstellt und erscheinen mit dem nächsten Update.",
    statTitel: "Dein Stand in diesem Bereich",
    alleThemen: "Alle Themen",
    nochKeineAntworten: "Noch keine Fragen beantwortet.",
    startenAktion: "Üben starten",
    naechsteAktion: "Nächste Frage",
    tabUeben: "Üben",
    tabKlausur: "Klausur",
    klausurH2: "Klausursimulation",
    klausurErklaerung: "Simuliert die WiSo-Klausur unter Prüfungsbedingungen: <b>25 Fragen</b> aus allen Themen dieses Bereichs, <b>60 Minuten</b>, kein Feedback während der Klausur. Falsch beantwortete Fragen kommen anschließend ins gemeinsame Fehler-Deck.",
    klausurStarten: "Klausur starten",
    klausurHistorieH2: "Klausur-Historie & Trend",
    klausurKopf: "Klausur · {thema}",
    klausurErgebnisProThema: "Ergebnis pro Thema",
    klausurFrageVon: "Frage {n} / {gesamt}",
    klausurWirklichAbgeben: "Klausur wirklich abgeben? Unbeantwortete Fragen zählen als falsch.",
    klausurZurueckZurUebersicht: "Zur Klausur-Übersicht"
  },
  nav: {
    start: "Start",
    ueben: "Üben",
    unterricht: "Vorbereitung nächste Klausur",   // FB-R1.9
    fehlerdeck: "Fehler-Deck",
    generator: "Rechen-Generator",
    netzplan: "Netzplan",
    gantt: "Gantt",
    simulation: "Prüfungssimulation",
    glossar: "Glossar",
    spickzettel: "Spickzettel",
    statistik: "Statistik",
    einstellungen: "Einstellungen"
  },
  /* G4.2 (#29): Deep-Link auf eine einzelne Frage (#frage=ID) */
  einzelfrage: {
    h2: "Einzelne Frage",
    nichtGefunden: "Diese Frage gibt es nicht (mehr).",
    zurStartseite: "Zur Startseite",
    normalWeiterueben: "Normal weiterüben",
    zaehltNicht: "Direkt aufgerufene Fragen zählen nicht für Statistik und Fehler-Deck."
  },
  theme: {
    hell: "Hell",
    dunkel: "Dunkel",
    sepia: "Sepia",
    kontrast: "Hochkontrast"
  },
  fehler: {
    schiefgelaufen: "Etwas ist schiefgelaufen",
    technischeDetails: "Technische Details",
    apVorbei: "AP1 <b>vorbei</b>",
    lsLadeFehler: "Gespeicherter Lernstand konnte nicht gelesen werden – Neustart mit leerem Stand.",
    lsSpeicherFehler: "Änderungen können derzeit NICHT gespeichert werden (Speicher voll/blockiert?)."
  },
  start: {
    frage: "Was möchtest du tun?",
    uebenSub: "Adaptives Training über alle Themen – mit Fehler-Deck-Einstreuung.",
    unterrichtSub: "WiSo-Klausur 31.07.: der Stoff aus unserem Unterricht – getrennt vom AP1-Pool.",
    serieTitel: "5er-Serie: Schwächstes Lernfeld",
    serieSubFallback: "5 Fragen gegen deine größte Schwäche.",
    serieHeuteSuffix: " Heute schon absolviert.",
    neuBadge: "NEU",
    fdSub: "Wiedervorlage falsch beantworteter Fragen (1/3/7-Tage-Rhythmus).",
    simSub: "AP1-Format: 4 Aufgaben, 100 Punkte, 90 Minuten – inkl. Fallaufgaben.",
    genSub: "Übertragungszeit, Subnetting, Zahlensysteme, Datenmengen – immer neue Werte.",
    netzplanSub: "Interaktive Netzpläne: FAZ, FEZ, SAZ, SEZ und Puffer selbst eintragen.",
    ganttTitel: "Gantt-Training",
    ganttSub: "Balkenplan/Terminplanung: Start- und End-Tage selbst bestimmen – mit kritischem Pfad.",
    glossarSubBase: "Begriffslexikon aus allen Erklär-Fragen.",
    glossarSubSuffix: " Jetzt auch mit IT-Abkürzungs-Lexikon.",
    spickzettelSub: "Formeln & Zusammenfassungen aller Module.",
    statSub: "Stärken, Schwächen und Verlauf im Detail.",
    einstSub: "Tagesziel, Prüfungsdatum, Design, Daten.",
    markiertTitel: "Markiert ★",
    markiertSub: "Deine per ★ markierten Fragen gezielt wiederholen.",
    standTitel: "Dein Stand",
    mehrStatistik: "Mehr Statistik anzeigen",
    aktivitaet14: "Aktivität (letzte 14 Tage)",
    nochOffen: "noch offen",
    trefferquoteModul: "Trefferquote je Gebiet"
  },
  ueben: {
    alleThemen: "alle Themen",
    themenFokus: "Themen-Fokus",
    /* FB-R3 Punkt 6: AP1/AP2-Themenauswahl */
    apModusLabel: "Prüfungsteil",
    apSegAp1: "AP1",
    apSegAp2: "AP2",
    apSegBeide: "Beide",
    apSegAp1Title: "Nur Prüfungsstoff aus Teil 1 der Abschlussprüfung (AP1).",
    apSegAp2Title: "Nur Prüfungsstoff aus Teil 2 der Abschlussprüfung (AP2) – derzeit Wirtschafts- und Sozialkunde.",
    apSegBeideTitle: "AP1 und AP2 gemischt (Voreinstellung).",
    ap1Kopf: "AP1 – Teil 1 der Abschlussprüfung",
    ap2Kopf: "AP2 – Teil 2 der Abschlussprüfung",
    wisoKachel: "WiSo",
    wisoSub: "Wirtschafts- und Sozialkunde (AP2)",
    ap2Bald: "bald",
    ap2BaldTitle: "Fragen zu diesem AP2-Prüfungsbereich sind in Vorbereitung.",
    ap2WeitereFk: "weitere Fragenkomplexe (in Vorbereitung)",   // FB-R3 Etappe 2: Katalog-Reststoff unter B1/B2
    feinthemen: "Feinthemen",                                   // FB-R3 Etappe 2: Aufklapp-Knopf je Gebiet
    auswahlZuruecksetzen: "Auswahl zurücksetzen",
    ap1AusHinweis: "Im AP1-Modus ausgeblendet – WiSo ist Prüfungsstoff der AP2.",
    schwierigkeitLabel: "Schwierigkeit:",
    schwierigkeitAuto: "passt sich je Thema automatisch an",          // G3.2 #6
    schwierigkeitAutoTitle: "Die App merkt sich für jedes Thema eine eigene Stufe (1–4). Nach je 3 Antworten zu einem Thema steigt sie um eine Stufe, wenn alle drei richtig waren, und sinkt um eine Stufe, wenn höchstens eine richtig war.",
    wischenZurueck: "‹ wischen: zurück",
    frageBlaettern: "Frage blättern (wischen)",
    wischenVor: "vor: wischen ›",
    /* 2026-07-30: Die zwei Bausteine der Verlaufsleiste standen als Literale in uebenRender().
       Sie werden seither von BEIDEN Übungsflüssen benutzt (AP1 und M09) – deshalb hier, damit
       eine Änderung nicht in einem Fluss hängen bleibt. Siehe macheVerlaufNav(). */
    verlaufZaehler: "Frage {n} / {m}",
    verlaufWiederholung: " · Wiederholung (zählt nicht)"
  },
  fehlerdeck: {
    h2: "Fehler-Deck üben",
    hinweis: "Falsch beantwortete Fragen kommen nach 1 → 3 → 7 Tagen wieder. Erst nach 3 richtigen Antworten in Folge verlässt eine Frage das Deck."
  },
  markiert: {
    h2: "Markierte Fragen ★",
    hinweis: "Deine per ★ markierten Fragen zum gezielten Wiederholen – unabhängig vom Fehler-Deck.",
    uebersicht: "Übersicht"
  },
  /* FB-R2b.1: Taschenrechner + Notizfeld. Nutzer-Entscheide 2026-07-21: wissenschaftlich,
     Notizfeld direkt darunter, NUR bei den Rechen-Typen, KEINE Zahlensysteme (dez/bin/hex). */
  rechner: {
    titel: "Taschenrechner",
    ariaEingabe: "Rechner-Eingabe",
    notizen: "Notizen (Nebenrechnung)",
    notizPlatzhalter: "Platz für Nebenrechnungen. Wird beim Fragenwechsel nicht gespeichert.",
    imSpeicher: "Im Speicher: ",
    speicherGeloescht: "Speicher gelöscht",
    hinweis: "Punkt oder Komma als Dezimaltrenner. Tippbar sind außerdem sqrt, ln, log, sin, cos, tan und pi; Winkel in Grad."
  },
  generator: {
    h2: "Rechenaufgaben-Generator",
    hinweis: "Immer neue Zufallswerte – diese Aufgaben zählen zur Tagesstatistik, aber nicht zum Fragen-Deck. Sie werden zusätzlich automatisch in den Übungs-Modus eingestreut. Netzpläne haben eine eigene Seite (Kachel Netzplan).",
    aufgabentypWaehlen: "Aufgabentyp wählen …"
  },
  simulation: {
    h2: "Prüfungssimulation AP1",
    historieH2: "Simulations-Historie & Trend",
    pruefungsaufbau: "Prüfungsaufbau",
    auswertungH2: "Auswertung",
    punkte: "Punkte",
    ergebnis: "Ergebnis",
    bestanden: "bestanden",
    nicht: "nicht",
    nichtBestanden: "nicht bestanden",
    abFuenfzig: " (ab 50 %)",
    ergebnisProAufgabe: "Ergebnis pro Aufgabe (Handlungsfeld)",
    alleFragenUeberblick: "Alle Fragen im Überblick",
    falscheFragenUebernommen: "Falsche Fragen wurden automatisch ins Fehler-Deck übernommen.",
    richtigTag: "[richtig]",
    falschTag: "[falsch]",
    deineAntwortLabel: "<b>Deine Antwort:</b> ",
    richtigLabel: "<br><b>Richtig:</b> ",
    wirklichAbgeben: "Wirklich abgeben?",
    wirklichVerlassenNav: "Simulation läuft – wirklich verlassen? Der Durchlauf geht verloren."
  },
  glossarSeite: {
    h2: "Nachschlagen",
    begriffeBtn: "Begriffe",
    abkBtn: "Abkürzungen",
    begriffslexikon: "Begriffslexikon",
    begriffeHinweisSuffix: " Begriffe aus den Erklär-Fragen, alphabetisch sortiert. Suche filtert nach Begriff und Definition.",
    begriffSuchenPlaceholder: "Begriff suchen …",
    keinBegriffGefunden: "Kein Begriff gefunden.",
    itWisoAbk: "IT-/WiSo-Abkürzungen",
    abkHinweisSuffix: " Abkürzungen, alphabetisch. Suche filtert nach Kürzel, Auflösung, Definition und Kategorie.",
    abkSuchenPlaceholder: "Abkürzung suchen … (z. B. DHCP, VLAN, SLA)",
    keineAbkGefunden: "Keine Abkürzung gefunden."
  },
  tabelle: {
    vorgangLabel: "Vorgang",
    dauerLabel: "Dauer",
    vorgaengerLabel: "Vorgänger",
    startTagLabel: "Start-Tag",
    endTagLabel: "End-Tag"
  },
  spickzettelSeite: {
    h2: "Spickzettel &amp; Formelsammlung",
    hinweis: "Kompakte Zusammenfassung aller Module inkl. Formeln. Die Suche filtert die Abschnitte.",
    suchenPlaceholder: "Suchen (z.B. Netzplan, Skonto, OSI, Backup, SLA) …",
    nichtsGefunden: "Nichts gefunden.",
    abschnittFallback: "Abschnitt"
  },
  serieSeite: {
    kicker: "5er-Serie · schwächstes Lernfeld",
    abgeschlossenH2: "Serie abgeschlossen",
    starkLernfeld: "Stark – dieses Lernfeld holt auf.",
    dranbleiben: "Dranbleiben – genau dafür ist die Serie da. Morgen gibt es einen neuen Durchgang."
  },
  statistikSeite: {
    h2: "Statistik – Stärken & Schwächen",
    keineDatenSuffix: " – noch keine Daten",
    schwaechsteThemenH2: "Schwächste Themen (mind. 3 Antworten)",
    /* FB-R2b.2 Stufen-Vorschau */
    stufenH2: "Was die Schwierigkeitsstufen bedeuten",
    stufenHint: "Für jede Aufgabenart und jede Stufe ein echtes Beispiel aus dem Fragen-Pool – aufklappen zeigt die vollständige Frage. Ein Strich heißt: zu dieser Kombination gibt es (noch) keine Frage.",
    stufenSpalteTyp: "Aufgabenart",
    stufenLeer: "—",
    stufenLeerTitel: "Zu dieser Aufgabenart gibt es auf dieser Stufe noch keine Frage.",
    stufenBeispiel: "Beispiel",
    stufenAnzahl: function(n){ return n === 1 ? "1 Frage" : n + " Fragen"; }
  },
  bereitschaft: {
    h2: "Prüfungs-Bereitschaft",
    hint: "Gewichteter Reifegrad über deine geübten Themen (relevante Themen zählen stärker).",
    gesamt: "Gesamt",
    nochKeine: "Noch keine Daten – beantworte Fragen, um deine Bereitschaft zu sehen.",
    startPrefix: "Bereitschaft",
    startKeine: "Bereitschaft: noch keine Daten – leg los."
  },
  einstellungenSeite: {
    tagesziel: "Tagesziel (Fragen/Tag):",
    pruefungsdatum: "AP1-Prüfungsdatum:",
    ansichtDesign: "Ansicht/Design:",
    uebenLabel: "Üben:",
    pruefungsnah: "prüfungsnah gewichten (IHK-relevante Themen häufiger)",
    begriffeLabel: "Begriffe:",
    begriffsTooltips: "Begriffs-Tooltips im Fragetext (Hover/Tap)",
    markierenLabel: "Markieren:",
    markierenAnLabel: "Button „Später prüfen“ bei jeder Frage anzeigen",
    barrierefreiheit: "Barrierefreiheit:",
    schriftgroesseLabel: "Schriftgröße:",
    schriftStufen: { normal: "Normal", gross: "Groß", sehrgross: "Sehr groß" },
    farbsymboleLabel: "Farbsymbole ✓/✗ zusätzlich zur Farbe anzeigen",
    ariaAltLabel: "ARIA-/Alt-Texte für Grafiken (Screenreader)",
    hilfeLabel: "Hilfe:",
    simulationsdauer: "Simulationsdauer (Min):",
    datenLabel: "Daten:",
    wirklichAlleLoeschen: "Wirklich ALLE lokalen Daten (Fortschritt, Fehler-Deck, Notizen, Historie) löschen?",
    gemeldeteFragen: "Gemeldete Fragen",
    keineGemeldeten: "Keine gemeldeten Fragen.",
    eigeneFragenErgaenzen: "<b>Eigene Fragen ergänzen (auch AP2):</b> Neue Einträge einfach in <code>fragen.js</code> an das Array anhängen – Schema siehe README.md. Beim Start prüft der Selbsttest alle Einträge und meldet Probleme verständlich.",
    versionLabel: "Version"
  },
  melden: {
    frageMeldenSummary: "⚑ Frage melden",
    nichtImPool: "(nicht im Pool)",
    detailsPlaceholder: "Details (optional) …",
    meldungEntfernen: "Meldung entfernen"
  },
  stern: {
    titel: "Zum gezielten Wiederholen markieren",
    markiert: "★ Markiert",
    markieren: "☆ Markieren"
  },
  placeholder: {
    deineAntwort: "Deine Antwort …",
    merkhilfe: "Merkhilfe, Eselsbrücke …"
  }
};

/* =================== Hilfen =================== */
function el(html){ var d=document.createElement("div"); d.innerHTML=html.trim(); return d.firstChild; }
function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }   // R4: '-Härtung für Single-Quote-Attribute
function heute(){ return Date.now(); }
/* R11 Anzeige-Helfer: ISO-dayKey "JJJJ-MM-TT" -> "TT.MM.JJJJ". NUR für die ANZEIGE –
   Speicher-Schlüssel (dailyCounts/serieDone/simHistorie.datum) bleiben ISO, L.dayKey NIE ändern!
   Ungültige/fremde Werte werden unverändert durchgereicht. */
function datumDE(key){
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(key == null ? "" : key));
  return m ? (m[3] + "." + m[2] + "." + m[1]) : key;
}
function bananen(stufe){ return "<span class='bananen'>" + "■".repeat(stufe) + "<span class='u-opacity-3' >" + "□".repeat(4-stufe) + "</span></span>"; }
// #47 SVG-Zoom: svgbox mit Vergrößern-Button bauen. #65: optionaler Alt-Text (role=img + aria-label) bei S.ariaAltTexte.
/* FB-R1.4: Zusaetzlich zum Lupen-Knopf oeffnet jetzt auch ein Tap/Klick auf das Bild selbst den
   Zoom. AUSNAHME hotspot (opts.keinTapZoom): dort IST das SVG die Antwortflaeche – ein Tap muss
   die Fehlerstelle waehlen, nicht vergroessern. Der Lupen-Knopf bleibt dort der einzige Weg. */
function svgBox(inner, alt, opts){
  opts = opts || {};
  var b = el("<div class='svgbox" + (opts.keinTapZoom ? "" : " tapzoom") + "'>" + inner + "</div>");
  if (typeof S !== "undefined" && S.ariaAltTexte && alt){
    var svg = b.querySelector("svg");
    if (svg){ svg.setAttribute("role", "img"); svg.setAttribute("aria-label", alt); }
  }
  b.appendChild(el("<button type='button' class='zoombtn' title='" + TEXTE.overlay.vergroessern + "' aria-label='" + TEXTE.overlay.vergroessernAria + "'>⤢</button>"));
  return b;
}
/* FB-R1.6: Statistik-Panel als aufklappbarer Block. Nutzer-Entscheid 2026-07-21: die Panels
   starten ZUGEKLAPPT; oeffnet der Nutzer eines, bleibt es ueber Sitzungen hinweg offen.
   Der Zustand haengt an einem stabilen SCHLUESSEL, nicht an der Ueberschrift – sonst wuerde jede
   Textaenderung die gemerkten Zustaende stillschweigend verwerfen.
   FB-R1.11 (Nutzer-Entscheid 2026-07-21, Aufloesung des Widerspruchs zu L1): der dritte Parameter
   `standardOffen` kehrt den Startzustand um. Genutzt vom Stand-Streifen der STARTSEITE, der nach
   dem alten L1-Entscheid „immer sichtbar" sein sollte – er startet jetzt OFFEN, laesst sich aber
   wegklappen. `S.panelOffen` speichert bewusst nur ABWEICHUNGEN vom jeweiligen Default: bei
   Rueckkehr zum Default wird der Schluessel geloescht. Damit bleibt das Verhalten der bisherigen
   (default-zu) Panels unveraendert – Merker nur solange offen – und die Map wird nicht voll
   redundanter false-Eintraege. */
function statPanel(key, titel, standardOffen){
  standardOffen = !!standardOffen;
  var hat = !!(S && S.panelOffen && Object.prototype.hasOwnProperty.call(S.panelOffen, key));
  var offen = hat ? !!S.panelOffen[key] : standardOffen;
  var d = el("<details class='panel stat-panel'" + (offen ? " open" : "") + "><summary class='panel-kopf'>" + titel + "</summary></details>");
  d.ontoggle = function(){
    mutS(function(s){
      if (!s.panelOffen) s.panelOffen = {};
      if (d.open === standardOffen) delete s.panelOffen[key];
      else s.panelOffen[key] = d.open;
    });
  };
  return d;
}
/* #65: generischer Alt-Text je Grafiktyp (Nutzer-Entscheid „generisch je Typ"), optional mit Thema-Zusatz. */
function svgAltFuer(f){
  var t = (f && f.typ === "bild") ? (f.unterTyp || "bild") : (f && f.typ);
  var m = { hotspot:"Hotspot-Grafik zum Anklicken", beschriftung:"Beschriftungs-Grafik zum Zuordnen",
    matrix:"Matrix-Grafik", lueckentext:"Aufgaben-Grafik mit Lücken" };
  return (m[t] || "Aufgaben-Grafik") + (f && f.thema ? " zum Thema " + f.thema : "");
}
function oeffneZoom(svgHtml){
  if (document.querySelector(".zoomoverlay")) return;
  var ov = el("<div class='zoomoverlay'></div>");
  ov.appendChild(el("<div class='zoominner'>" + svgHtml + "</div>"));
  var close = el("<button type='button' class='zoomclose' aria-label='" + TEXTE.overlay.schliessen + "'>✕</button>");
  ov.appendChild(close);
  function zu(){ document.removeEventListener("keydown", onKey); if (ov.parentNode) ov.parentNode.removeChild(ov); }
  function onKey(e){ if (e.key === "Escape" || e.keyCode === 27) zu(); }
  ov.onclick = function(e){ if (e.target === ov) zu(); };
  close.onclick = zu;
  document.addEventListener("keydown", onKey);
  document.body.appendChild(ov);
}
document.addEventListener("click", function(e){
  var t = e.target;
  if (!t || !t.closest) return;
  /* Lupen-Knopf wirkt in JEDER svgbox; ein Tap auf das Bild nur in einer .tapzoom-Box (FB-R1.4). */
  var box = t.closest(".zoombtn") ? t.closest(".svgbox") : null;
  if (!box && !t.closest(".zoomoverlay")) box = t.closest(".svgbox.tapzoom");
  if (!box) return;
  var svg = box.querySelector("svg");
  if (svg) oeffneZoom(svg.outerHTML);
});
var LEVEL_NAMEN = {1:"Anfänger", 2:"Leicht", 3:"Mittel", 4:"Schwer"};
/* FB-R2b.2: Klarnamen der Aufgabentypen für die Stufen-Vorschau. Bis hierher trugen die Typen
   nur ihre internen Bezeichner – in G3.5 war „21 Typen bräuchten erst Namen" sogar ein Grund,
   die Format-Auswertung nicht zu bauen. Die Namen beschreiben, was der Lernende TUT, nicht wie
   der Typ intern heißt. `typName()` fällt auf den Rohnamen zurück, damit ein neuer Typ die
   Vorschau nicht leer lässt, sondern nur unschön aussieht. */
var TYP_NAMEN = {
  mc: "Einfachauswahl", mehrfach: "Mehrfachauswahl", dropdown: "Auswahllisten",
  lueckentext: "Lückentext", zuordnung: "Zuordnen", reihenfolge: "Reihenfolge bilden",
  matrix: "Vier-Felder-Matrix", kreuztabelle: "Kreuztabelle", mtf: "Richtig/Falsch",
  beschriftung: "Grafik beschriften", hotspot: "Stelle im Bild anklicken",
  baukasten: "Bausteine einsetzen", fehlersuche: "Fehlerhafte Zeile finden",
  konsole: "Konsolenausgabe", trace: "Schreibtischtest", kalkulation: "Tabelle berechnen",
  rechenassistent: "Schritt-für-Schritt-Rechnung", generator: "Rechenaufgabe mit Zufallswerten",
  freitext: "Freie Antwort", erklaeren: "Begriff erklären", szenario2: "Fallszenario"
};
function typName(t){ return TYP_NAMEN[t] || t; }
/* Effektiver Fragetyp (bild zählt als sein Unter-Typ) */
function typVon(f){ return f.typ === "bild" ? (f.unterTyp || "mc") : f.typ; }
/* Fragen so anordnen, dass möglichst nie zwei gleiche Typen direkt aufeinander folgen */
function mischeTypen(fragen){
  var rest = L.shuffle(fragen.slice()), out = [];
  while (rest.length){
    var letzter = out.length ? typVon(out[out.length-1]) : null;
    var idx = -1;
    for (var i = 0; i < rest.length; i++){ if (typVon(rest[i]) !== letzter){ idx = i; break; } }
    if (idx < 0) idx = 0;
    out.push(rest.splice(idx, 1)[0]);
  }
  return out;
}

/* ===== Offline-Auto-Erkennung für Freitext/Erkläre (Schlüsselbegriff-Abgleich) =====
   Näherung: Kernbegriffe der Musterlösung mit der Antwort abgleichen. Keine echte
   Bedeutungsprüfung – dient nur als Hinweis, die Selbsteinschätzung bleibt maßgeblich. */
var STOPWORTE = {der:1,die:1,das:1,und:1,oder:1,ein:1,eine:1,einen:1,einer:1,eines:1,einem:1,ist:1,sind:1,war:1,wird:1,werden:1,kann:1,muss:1,soll:1,auch:1,nicht:1,bei:1,mit:1,fuer:1,von:1,zum:1,zur:1,den:1,dem:1,des:1,auf:1,aus:1,als:1,dass:1,sich:1,man:1,sie:1,ihr:1,wenn:1,ueber:1,unter:1,durch:1,diese:1,dieser:1,dieses:1,diesen:1,wie:1,was:1,aber:1,nur:1,noch:1,vor:1,nach:1,dabei:1,sowie:1,bzw:1,etc:1,mehr:1,sehr:1,koennen:1,sollte:1,sollten:1,haben:1,damit:1,ohne:1,gegen:1,zwischen:1,jeweils:1,beispiel:1,beispielsweise:1};
/* Normalisierung inkl. Umlaut-/ß-Varianten: "Verschlüsselung" und "Verschluesselung"
   werden identisch behandelt, ebenso ss/ß und Groß-/Kleinschreibung. */
function normText(s){
  return String(s==null?"":s).toLowerCase()
    .replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss")
    .replace(/[^a-z0-9 ]+/g," ").replace(/\s+/g," ").trim();
}
/* Synonym-/Abkürzungsgruppen (normalisierte Schreibweise!): eine Antwort zählt,
   wenn IRGENDEIN Mitglied der Gruppe vorkommt (Abkürzung ODER Langform).      */
var SYNONYME = [
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
var SYN_MAP = {};                                        // Mitglied -> Gruppe
SYNONYME.forEach(function(g){ g.forEach(function(w){ SYN_MAP[w] = g; }); });
/* ⚠️ HIER STAND `synGruppe(k)` – seit der Zusammenlegung der Treffer-Heuristik (2026-07-20)
   ungenutzt und am 2026-07-26 ENTFERNT (der angekuendigte „eigene kleine Task"). SYN_MAP selbst
   bleibt: sie wird von synonymTreffer() gebraucht. */
function autoCheckText(antwort, referenz){
  var refToks = normText(referenz).split(" ").filter(Boolean);
  var seen = {}, keys = [];
  refToks.forEach(function(t){
    if (STOPWORTE[t]) return;
    var istZahl = /^[0-9]+$/.test(t);
    if ((t.length >= 5 || istZahl && t.length >= 2 || SYN_MAP[t]) && !seen[t]) { seen[t] = 1; keys.push(t); }
  });
  keys.sort(function(a,b){ return b.length - a.length; });
  if (keys.length > 14) keys = keys.slice(0, 14);
  var antText = " " + normText(antwort) + " ";
  var gefunden = [], fehlend = [];
  /* 2026-07-20: Diese Schleife war eine Kopie der Treffer-Heuristik aus begriffTreffer und trug den
     Substring-Fehler daher weiter. Jetzt EINE gemeinsame Codestelle, damit die Wortgrenzen-Regel
     nicht an zwei Orten gepflegt werden muss. Gemessen ohne Wirkung auf die Kennzahlen dieser
     Funktion (74/74 Musterloesungen weiterhin "richtig", 0 Falsch-Positive bei 74 themenfremden
     Antworten und 222 Floskeln) – die 65-%-Schwelle ueber viele Keys faengt Einzelfehler ohnehin ab. */
  keys.forEach(function(k){
    if (begriffTreffer(antText, k)) gefunden.push(k); else fehlend.push(k);
  });
  var anzahl = keys.length, treffer = gefunden.length, score = anzahl ? treffer/anzahl : 0;
  var leer = normText(antwort).length < 3;
  var stufe = leer ? "leer" : (anzahl < 3 ? "unklar" : (score >= 0.65 ? "richtig" : score >= 0.35 ? "teilweise" : "unvollständig"));
  return { anzahl:anzahl, treffer:treffer, prozent:Math.round(score*100), gefunden:gefunden, fehlend:fehlend, stufe:stufe };
}
/* ===== #76 Teilpunkte via gewichtete Schlüsselbegriffe =====
   Zwei-Stufen-Schema: Pflicht-Begriffe (Gewicht 2) + Kür-Begriffe (Gewicht 1). Anteil = getroffenes Gewicht ÷
   Gesamtgewicht. Nutzt dieselbe Treffer-Heuristik wie autoCheckText (Normalisierung, Synonymgruppen, Stem-
   Toleranz). Bestehens-Schwelle 65 % (= "richtig"). Nur Anzeige/Vorschlag – die Selbsteinschätzung zählt. */
/* WORTGRENZEN-REGEL (2026-07-20, Nutzer-Entscheid). Bis dahin wurde jede Variante als nackter
   Substring gesucht. Dadurch erfuellte "Die Kosten sind gesunken" den Begriff OS/Betriebssystem
   (k-OS-ten) und "Die Mitarbeiter wurden geschult" den Begriff IT (m-IT-arbeiter) – 7 von 7
   Kontrollsaetzen falsch-positiv. Begriffe bis KURZ_MAX Zeichen muessen deshalb als eigenes Wort
   vorkommen; laengere duerfen weiterhin im Kompositum stehen, sonst verloere "Gesamtbetriebskosten"
   den legitimen Treffer auf "Betriebskosten" (M03-009). Messung: Falsch-Positive 7 -> 0, Treffer auf
   den 147 Musterloesungs-Begriffen unveraendert 145, keine Regression. */
var KURZ_MAX = 4;
/* TIPPFEHLER-TOLERANZ IM FREITEXT (2026-08-04, Nutzer-Entscheid). Sie SCHALTET SICH SELBST AB.
   ⚠️ WARUM NICHT PAUSCHAL: Gemessen am 04.08. stehen in DERSELBEN Frage 49 Begriffspaare in
   Levenshtein-Distanz 1 – darunter `ipconfig`/`ifconfig` (M04-015, Windows gegen Linux), die
   Nutzwertpunkte `7,1`/`7,5` (M02-006) und die Betraege `2.300`/`2.400` (M03-009). Eine pauschale
   Distanz-1-Regel haette genau die Unterscheidung getilgt, die diese Fragen pruefen – und damit
   den Schutz aufgehoben, den der Token-Fallback weiter unten ausdruecklich aufbaut
   ("Monitor A erfuellt Monitor B NICHT").
   ►► DIE REGEL: Toleranz nur, wenn der Begriff (1) mindestens L.TIPP_MINLAENGE Zeichen hat,
   (2) keine Ziffer enthaelt, (3) EIN Wort ist und (4) in DIESER Frage keinen Nachbarn in
   Distanz 1 hat. Gemessen: 1274 von 1512 Schluesselbegriffen (84,3 %) bekommen Toleranz, alle
   drei kritischen Faelle oben sind korrekt ausgeschlossen.
   `tol` ist die frageindividuelle Pruefung aus gradeTeilpunkte; fehlt sie, gilt der alte Stand. */
function tippbar(v, tol){
  return !!tol && v.indexOf(" ") < 0 && v.length >= (typeof L !== "undefined" ? L.TIPP_MINLAENGE : 6) &&
    !/[0-9]/.test(v) && tol(v);
}
function variantenTreffer(antTextNorm, v, tol){
  if (!v) return false;
  if (v.length <= KURZ_MAX) return antTextNorm.indexOf(" " + v + " ") >= 0;
  if (antTextNorm.indexOf(v) >= 0) return true;
  /* Flexions-/Schreibvarianten-Toleranz, aber NUR bei Einwort-Varianten. Auf einer Mehrwort-Phrase
     wuerde der Stem den letzten Bestandteil abschneiden und damit genau die Unterscheidung tilgen,
     auf die es ankommt: "monitor b" -> "monito" haette in "Monitor A erreicht 7,1 Punkte" getroffen. */
  if (v.indexOf(" ") >= 0) return false;
  var stem = v.slice(0, Math.max(4, v.length - 3));
  if (stem.length >= 4 && antTextNorm.indexOf(" " + stem) >= 0) return true;
  /* Der Stem faengt den Tippfehler am WORTENDE. Was blieb, war der Fehler am Wortanfang –
     der gemeldete Fall „ufgabenanalyse". Genau dafuer die Distanz-1-Pruefung je Wort. */
  if (!tippbar(v, tol)) return false;
  var woerter = antTextNorm.split(" ");
  for (var i = 0; i < woerter.length; i++) {
    if (woerter[i].length >= 4 && L.distanzEins(v, woerter[i])) return true;
  }
  return false;
}
function begriffTreffer(antTextNorm, begriff, tol){
  var key = normText(begriff);
  if (!key) return false;
  var gruppe = SYN_MAP[key];
  if (gruppe){
    for (var i = 0; i < gruppe.length; i++) if (variantenTreffer(antTextNorm, gruppe[i], tol)) return true;
    return false;
  }
  if (variantenTreffer(antTextNorm, key, tol)) return true;
  /* TOKEN-FALLBACK (2026-07-20, Nutzer-Entscheid). Ein Mehrwort-Begriff OHNE eigene Gruppe wurde
     bisher nur als Ganzes nachgeschlagen und fand die Gruppen seiner Bestandteile nie – das erklaert,
     warum Mehrwort-Phrasen ueberproportional ausfielen (6 von 26 Ausfaellen bei nur 13 % Mehrwort-
     Anteil). Jetzt wird je Token die Gruppe geprueft, aber der Begriff gilt nur als getroffen, wenn
     ALLE inhaltstragenden Tokens treffen. Die Alles-Bedingung ist der Schutz gegen Falsch-Positive:
     bei M02-006 erfuellt "Monitor A" den Pflichtbegriff "Monitor B" weiterhin NICHT, weil das Token
     "b" fehlt. Sie ist zugleich die Grenze des Verfahrens – wo die Kurzform ALLEIN genuegen soll
     ("PDCA" fuer "PDCA-Zyklus"), reicht der Fallback nicht und es braucht eine explizite Gruppe. */
  var toks = key.split(" ").filter(function(t){ return t && !STOPWORTE[t]; });
  if (toks.length < 2) return false;
  for (var j = 0; j < toks.length; j++){
    var g = SYN_MAP[toks[j]], hit = false;
    if (g){ for (var m = 0; m < g.length && !hit; m++) hit = variantenTreffer(antTextNorm, g[m], tol); }
    else hit = variantenTreffer(antTextNorm, toks[j], tol);
    if (!hit) return false;
  }
  return true;
}
/* ALTERNATIVEN JE BEGRIFF (2026-07-20, Nutzer-Entscheid). Ein Eintrag in `pflicht`/`kuer` darf statt
   eines Strings eine LISTE gleichwertiger Formulierungen sein, z. B.
       "pflicht": [["Puffer","Spielraum","Reserve"], "Projektdauer"]
   Der Eintrag zaehlt als EIN Begriff und gilt als getroffen, sobald IRGENDEINE Alternative trifft.
   Das ist der gezielte Weg fuer frageindividuelle Formulierungen, waehrend die Synonymtabelle die
   global gueltigen Gleichsetzungen traegt. Gewichtung und Prozentrechnung bleiben unveraendert,
   weil die Listenlaenge nicht in `pflicht.length` eingeht. */
function begriffErfuellt(antTextNorm, b, tol){
  if (Array.isArray(b)){
    for (var i = 0; i < b.length; i++) if (begriffTreffer(antTextNorm, b[i], tol)) return true;
    return false;
  }
  return begriffTreffer(antTextNorm, b, tol);
}
/* Anzeige-/Protokollform: Alternativlisten werden zu "Puffer / Spielraum / Reserve" verflacht, damit
   `gefunden` und `fehlendPflicht` weiterhin reine String-Arrays sind (Aufrufer nutzen .join()). */
function begriffLabel(b){ return Array.isArray(b) ? b.join(" / ") : String(b); }
/* Baut die frageindividuelle Toleranz-Freigabe: ein Begriff bekommt sie nur, wenn in DIESER
   Frage kein anderer Begriff in Distanz 1 zu ihm steht. Einmal je Bewertung berechnet, nicht
   je Begriff – die Liste ist kurz, aber der Aufruf steckt in einer dreifach verschachtelten
   Schleife (Begriff x Gruppe x Token). */
function toleranzFreigabe(pflicht, kuer){
  if (typeof L === "undefined" || typeof L.distanzEins !== "function") return null;
  var alle = [];
  function sammle(b){ (Array.isArray(b) ? b : [b]).forEach(function(x){ var n = normText(x); if (n) alle.push(n); }); }
  pflicht.forEach(sammle); kuer.forEach(sammle);
  return function(v){
    for (var i = 0; i < alle.length; i++) if (alle[i] !== v && L.distanzEins(alle[i], v)) return false;
    return true;
  };
}
function gradeTeilpunkte(antwort, f){
  var sb = f.schluesselbegriffe || {};
  var pflicht = Array.isArray(sb.pflicht) ? sb.pflicht : [];
  var kuer = Array.isArray(sb.kuer) ? sb.kuer : [];
  var antTextNorm = " " + normText(antwort) + " ";
  var tol = toleranzFreigabe(pflicht, kuer);
  var pTreffer = 0, kTreffer = 0, gefunden = [], fehlendPflicht = [];
  pflicht.forEach(function(b){ if (begriffErfuellt(antTextNorm, b, tol)){ pTreffer++; gefunden.push(begriffLabel(b)); } else fehlendPflicht.push(begriffLabel(b)); });
  kuer.forEach(function(b){ if (begriffErfuellt(antTextNorm, b, tol)){ kTreffer++; gefunden.push(begriffLabel(b)); } });
  var gesamtGewicht = 2 * pflicht.length + 1 * kuer.length;
  var trefferGewicht = 2 * pTreffer + 1 * kTreffer;
  var score = gesamtGewicht ? trefferGewicht / gesamtGewicht : 0;
  var leer = normText(antwort).length < 3;
  /* FB-R2a (Nutzer-Entscheid 2026-07-21): WER ALLE PFLICHTBEGRIFFE TRIFFT, IST „RICHTIG" – egal,
     wie viele Kuer-Begriffe die Frage noch anbietet. Grund ist ein Rechenfehler, der beim
     Kalibrieren sichtbar wurde: der Nenner (2*Pflicht + Kuer) waechst mit JEDEM Kuer-Begriff, also
     senkt jeder zusaetzliche Kuer-Begriff die Note einer vollstaendig richtigen Antwort. Bei 3
     Pflicht + 4 Kuer landet eine Antwort mit ALLEN Pflichtbegriffen bei 2*3/(2*3+4) = 60 % und
     damit unter der 65-%-Schwelle – Bestehen war rein rechnerisch unmoeglich. Umgestellt auf
     „Kuer ist Bonus": die Prozentzahl bleibt unveraendert (sie zeigt weiter die Vollstaendigkeit),
     nur die STUFE haengt jetzt zuerst an den Pflichtbegriffen.
     GEMESSEN: strenges Messgleis 3/10 -> 6/10, realistisches Gleis unveraendert 10/10,
     Falsch-Positive unveraendert 0 (tools/mess_freitext.js). */
  var allePflicht = pflicht.length > 0 && pTreffer === pflicht.length;
  var stufe = leer ? "leer"
    : (allePflicht || score >= APP_CONFIG.teilpunkteRichtig) ? "richtig"
    : score >= APP_CONFIG.teilpunkteTeilweise ? "teilweise" : "unvollständig";
  return {
    pflichtTreffer:pTreffer, pflichtGesamt:pflicht.length,
    kuerTreffer:kTreffer, kuerGesamt:kuer.length,
    prozent:Math.round(score*100), stufe:stufe, gefunden:gefunden, fehlendPflicht:fehlendPflicht
  };
}
/* R10 (a) Tastatur-Bedienbarkeit: macht klickbare Chips/Slots/Zonen/Zeilen fokussierbar (tabindex=0,
   role=button) und per Enter/Leertaste auslösbar (ruft el.onclick). onkeydown-ZUWEISUNG statt
   addEventListener, damit beim zeichne()-Re-Render-Muster keine Listener akkumulieren.
   Funktioniert auch für SVG-Elemente (setAttribute). */
function chipTastatur(elm){
  elm.setAttribute("tabindex", "0");
  elm.setAttribute("role", "button");
  elm.onkeydown = function(ev){
    if (ev.key === "Enter" || ev.key === " " || ev.key === "Spacebar"){
      ev.preventDefault();
      if (typeof elm.onclick === "function") elm.onclick(ev);
    }
  };
  return elm;
}

/* =====================================================================
   FB-R2b.1 – Wissenschaftlicher Taschenrechner mit Notizfeld
   ---------------------------------------------------------------------
   rechnerAuswerten(ausdruck) ist ein REINER Parser: eigener Tokenizer +
   rekursiver Abstieg. KEIN eval(), KEIN new Function() – Nutzereingabe
   wird nie als Code ausgefuehrt (auch offline eine unnoetige
   Angriffsflaeche). Die Funktion wirft NIE, jeder Fehlerfall liefert
   { ok:false, fehler:"<deutscher Klartext>" }.
   rechnerPanel() baut das Bedien-Panel ueber statPanel(...,false) – es
   startet also ZUGEKLAPPT und merkt sich den Zustand wie die uebrigen
   Panels seit R1.6.
   NUTZER-ENTSCHEIDE 2026-07-21: wissenschaftlich (Wurzel, Potenz,
   Klammern, Prozent, Vorzeichen, Speicher), Notizfeld DIREKT DARUNTER
   im selben Panel, nur bei den Rechen-Typen eingebunden, und
   AUSDRUECKLICH KEINE Zahlensystem-Umrechnung (dezimal/binaer/hex).
   sin/cos/tan rechnen im GRADMASS, nicht im Bogenmass – in den
   Pruefungsaufgaben werden Winkel in Grad angegeben.
   Das Notizfeld ist BEWUSST NICHT persistent: es landet nichts in S,
   der Inhalt verfaellt beim Fragenwechsel (Fortschritts-Export ist
   endgueltig gestrichen).
   ===================================================================== */
var rechnerAuswerten, rechnerPanel;
(function(){
  var RECHNER_FUNKTIONEN = { sqrt:1, ln:1, log:1, sin:1, cos:1, tan:1 };

  /* ---- Tokenizer ---------------------------------------------------
     Erkennt Zahlen (Dezimalpunkt ODER -komma – genau EIN Trenner je
     Zahl; das Komma ist damit KEIN Argumenttrenner, es gibt keine
     mehrargumentigen Funktionen), Bezeichner (pi als Konstante,
     sqrt/ln/log/sin/cos/tan als Funktionen) sowie Operatoren/Klammern.
     Die Anzeige-Zeichen × ÷ − √ der Tasten werden gleich mitverstanden,
     damit der Parser auch dann stimmt, wenn sie ungefiltert ankommen. */
  function rechnerTokenisiere(s){
    var tokens = [], i = 0, n = s.length;
    while (i < n){
      var c = s.charAt(i);
      if (c === " " || c === "\t" || c === "\n" || c === "\r"){ i++; continue; }
      var istZifferStart = (c >= "0" && c <= "9") ||
        ((c === "." || c === ",") && s.charAt(i+1) >= "0" && s.charAt(i+1) <= "9");
      if (istZifferStart){
        var start = i, trennerGesehen = false;
        while (i < n){
          var ch = s.charAt(i);
          if (ch >= "0" && ch <= "9"){ i++; continue; }
          if ((ch === "." || ch === ",") && !trennerGesehen){ trennerGesehen = true; i++; continue; }
          break;
        }
        var roh = s.slice(start, i).replace(",", "."), wert = Number(roh);
        if (roh === "" || isNaN(wert)) throw { rechnerFehler: "Ungültige Zahl" };
        tokens.push({ art:"zahl", wert:wert });
        continue;
      }
      if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z")){
        var startN = i;
        while (i < n && ((s.charAt(i) >= "a" && s.charAt(i) <= "z") || (s.charAt(i) >= "A" && s.charAt(i) <= "Z"))) i++;
        var name = s.slice(startN, i).toLowerCase();
        if (name === "pi"){ tokens.push({ art:"zahl", wert:Math.PI }); continue; }
        if (RECHNER_FUNKTIONEN[name]){ tokens.push({ art:"funktion", name:name }); continue; }
        throw { rechnerFehler: "Unbekanntes Zeichen: " + name };
      }
      if (c === "√"){ tokens.push({ art:"funktion", name:"sqrt" }); i++; continue; }
      if (c === "×"){ tokens.push({ art:"stern" }); i++; continue; }
      if (c === "÷"){ tokens.push({ art:"slash" }); i++; continue; }
      if (c === "−" || c === "–" || c === "—" || c === "-"){ tokens.push({ art:"minus" }); i++; continue; }
      if (c === "+"){ tokens.push({ art:"plus" }); i++; continue; }
      if (c === "*"){ tokens.push({ art:"stern" }); i++; continue; }
      if (c === "/"){ tokens.push({ art:"slash" }); i++; continue; }
      if (c === "^"){ tokens.push({ art:"dach" }); i++; continue; }
      if (c === "%"){ tokens.push({ art:"prozent" }); i++; continue; }
      if (c === "("){ tokens.push({ art:"klauf" }); i++; continue; }
      if (c === ")"){ tokens.push({ art:"klzu" }); i++; continue; }
      throw { rechnerFehler: "Unbekanntes Zeichen: " + c };
    }
    tokens.push({ art:"ende" });
    return tokens;
  }

  function rechnerFunktionAnwenden(name, x){
    switch (name){
      case "sqrt":
        if (x < 0) throw { rechnerFehler: "Wurzel aus negativer Zahl nicht möglich" };
        return Math.sqrt(x);
      case "ln":
        if (x <= 0) throw { rechnerFehler: "Logarithmus nur für positive Zahlen" };
        return Math.log(x);
      case "log":
        if (x <= 0) throw { rechnerFehler: "Logarithmus nur für positive Zahlen" };
        return Math.log(x) / Math.LN10;
      case "sin": return Math.sin(x * Math.PI / 180);
      case "cos": return Math.cos(x * Math.PI / 180);
      case "tan": return Math.tan(x * Math.PI / 180);
    }
    throw { rechnerFehler: "Unbekannte Funktion: " + name };
  }

  /* ---- Parser (rekursiver Abstieg) ---------------------------------
       ausdruck := term (('+'|'-') term)*
       term     := unaer (('*'|'/') unaer)*
       unaer    := ('-'|'+') unaer | potenz
       potenz   := postfix ('^' unaer)?     // rechtsassoziativ: 2^3^2 = 512
       postfix  := primaer ('%')*           // Postfix-Prozent = /100
       primaer  := ZAHL | '(' ausdruck ')' | FUNKTION '(' ausdruck ')'
     Unaeres Minus bindet lockerer als '^': -2^2 = -4 (Standardkonvention),
     der Exponent darf aber ein Vorzeichen tragen (2^-2 = 0,25). */
  function rechnerParser(tokens){
    var pos = 0;
    function peek(){ return tokens[pos]; }
    function next(){ return tokens[pos++]; }
    function erwarte(art, fehlertext){
      if (peek().art !== art) throw { rechnerFehler: fehlertext };
      return next();
    }
    function parseAusdruck(){
      var wert = parseTerm();
      while (peek().art === "plus" || peek().art === "minus"){
        var op = next().art, rechts = parseTerm();
        wert = (op === "plus") ? (wert + rechts) : (wert - rechts);
      }
      return wert;
    }
    function parseTerm(){
      var wert = parseUnaer();
      while (peek().art === "stern" || peek().art === "slash"){
        var op = next().art, rechts = parseUnaer();
        if (op === "stern"){ wert = wert * rechts; }
        else {
          if (rechts === 0) throw { rechnerFehler: "Division durch null" };
          wert = wert / rechts;
        }
      }
      return wert;
    }
    function parseUnaer(){
      if (peek().art === "minus"){ next(); return -parseUnaer(); }
      if (peek().art === "plus"){ next(); return parseUnaer(); }
      return parsePotenz();
    }
    function parsePotenz(){
      var basis = parsePostfix();
      if (peek().art === "dach"){ next(); basis = Math.pow(basis, parseUnaer()); }
      return basis;
    }
    function parsePostfix(){
      var wert = parsePrimaer();
      while (peek().art === "prozent"){ next(); wert = wert / 100; }
      return wert;
    }
    function parsePrimaer(){
      var tok = peek();
      if (tok.art === "zahl"){ next(); return tok.wert; }
      if (tok.art === "klauf"){
        next();
        var wert = parseAusdruck();
        erwarte("klzu", "Klammern stimmen nicht");
        return wert;
      }
      if (tok.art === "funktion"){
        next();
        erwarte("klauf", "Klammern stimmen nicht");
        var arg = parseAusdruck();
        erwarte("klzu", "Klammern stimmen nicht");
        return rechnerFunktionAnwenden(tok.name, arg);
      }
      if (tok.art === "klzu") throw { rechnerFehler: "Klammern stimmen nicht" };
      if (tok.art === "ende") throw { rechnerFehler: "Unerwartetes Ende des Ausdrucks" };
      throw { rechnerFehler: "Unerwartetes Zeichen" };
    }
    var ergebnis = parseAusdruck();
    if (peek().art !== "ende"){
      if (peek().art === "klzu") throw { rechnerFehler: "Klammern stimmen nicht" };
      throw { rechnerFehler: "Ungültiger Ausdruck" };
    }
    return ergebnis;
  }

  /* Anzeige-Helfer liegen bewusst INNERHALB der Closure, damit ausser
     rechnerAuswerten/rechnerPanel keine neuen globalen Namen entstehen. */
  function rechnerNormalisiereAnzeige(s){
    return String(s == null ? "" : s)
      .replace(/×/g, "*").replace(/÷/g, "/")
      .replace(/[−–—]/g, "-").replace(/√/g, "sqrt");
  }
  function rechnerFormatiereZahl(n){
    if (!isFinite(n)) return String(n);
    if (n === 0) return "0";
    return String(Math.round(n * 1e9) / 1e9);   // Gleitkomma-Rauschen kappen
  }

  rechnerAuswerten = function(ausdruck){
    var s = rechnerNormalisiereAnzeige(ausdruck).trim();
    if (s === "") return { ok:false, fehler:"Leere Eingabe" };
    try {
      var tokens = rechnerTokenisiere(s);
      if (tokens.length <= 1) return { ok:false, fehler:"Leere Eingabe" };
      var wert = rechnerParser(tokens);
      if (typeof wert !== "number" || isNaN(wert)) return { ok:false, fehler:"Ergebnis ist keine gültige Zahl" };
      if (!isFinite(wert)) return { ok:false, fehler:"Ergebnis ist zu groß" };
      return { ok:true, wert:wert };
    } catch (e){
      if (e && e.rechnerFehler) return { ok:false, fehler:e.rechnerFehler };
      return { ok:false, fehler:"Ausdruck konnte nicht ausgewertet werden" };
    }
  };

  rechnerPanel = function(){
    var speicher = 0;
    var d = statPanel("rechner", esc(TEXTE.rechner.titel), false);
    var wrap = el("<div class='rechner-wrap'></div>");
    d.appendChild(wrap);

    /* ⚠️ ABSICHTLICH OHNE die Klasse `luecke`. Sie ist der Selektor der ANTWORTFELDER –
       test_diagnose zaehlt `input.luecke` gegen die Zahl der Rechenschritte bzw. der
       Loesungszellen. Mit `luecke` am Rechnerfeld sind zwei Bestandstests sofort gefallen.
       Genau die Falle „neue Elemente kollidieren mit vorhandenen Test-Selektoren" aus dem
       BUILD_LOG – hier zusaetzlich fachlich richtig: das Rechnerfeld ist keine Antwort. */
    var anzeige = el("<input type='text' class='rechner-anzeige' autocomplete='off' spellcheck='false' aria-label='" + esc(TEXTE.rechner.ariaEingabe) + "'>");
    wrap.appendChild(anzeige);
    var tastenWrap = el("<div class='rechner-tasten'></div>");
    wrap.appendChild(tastenWrap);
    var ergebnisZeile = el("<div class='rechner-ergebnis' aria-live='polite'></div>");
    wrap.appendChild(ergebnisZeile);
    wrap.appendChild(el("<div class='hinweis'>" + esc(TEXTE.rechner.hinweis) + "</div>"));

    var notizId = "rechnerNotiz" + Math.random().toString(36).slice(2, 8);
    wrap.appendChild(el("<label class='rechner-notiz-label' for='" + notizId + "'>" + esc(TEXTE.rechner.notizen) + "</label>"));
    var notiz = el("<textarea rows='4' class='rechner-notiz' id='" + notizId + "' placeholder='" + esc(TEXTE.rechner.notizPlatzhalter) + "'></textarea>");
    wrap.appendChild(notiz);

    function einfuegen(text){
      var start = anzeige.selectionStart, ende = anzeige.selectionEnd, val = anzeige.value;
      if (start == null || ende == null){ anzeige.value = val + text; anzeige.focus(); return; }
      anzeige.value = val.slice(0, start) + text + val.slice(ende);
      var pos = start + text.length;
      anzeige.focus(); anzeige.setSelectionRange(pos, pos);
    }
    function rueckschritt(){
      var start = anzeige.selectionStart, ende = anzeige.selectionEnd, val = anzeige.value;
      if (start != null && ende != null && start !== ende){
        anzeige.value = val.slice(0, start) + val.slice(ende);
        anzeige.focus(); anzeige.setSelectionRange(start, start); return;
      }
      var pos = (start == null) ? val.length : start;
      if (pos <= 0) return;
      anzeige.value = val.slice(0, pos - 1) + val.slice(pos);
      anzeige.focus(); anzeige.setSelectionRange(pos - 1, pos - 1);
    }
    function meldung(text, istFehler){
      ergebnisZeile.textContent = text;
      if (istFehler) ergebnisZeile.classList.add("fehler"); else ergebnisZeile.classList.remove("fehler");
    }
    function leeren(){ anzeige.value = ""; meldung("", false); anzeige.focus(); }
    function auswerten(){
      var r = rechnerAuswerten(anzeige.value);
      if (!r.ok){ meldung(r.fehler, true); return; }
      var text = rechnerFormatiereZahl(r.wert);
      meldung("= " + text, false);
      anzeige.value = text;                       // Weiterrechnen mit dem Ergebnis
      anzeige.focus();
    }
    function speichern(){
      var r = rechnerAuswerten(anzeige.value);
      if (!r.ok){ meldung(r.fehler, true); return; }
      speicher += r.wert;
      meldung(TEXTE.rechner.imSpeicher + rechnerFormatiereZahl(speicher), false);
    }
    function abrufen(){ einfuegen(rechnerFormatiereZahl(speicher)); }
    function speicherLoeschen(){ speicher = 0; meldung(TEXTE.rechner.speicherGeloescht, false); }

    anzeige.onkeydown = function(e){
      if (e.key === "Enter" || e.keyCode === 13){ e.preventDefault(); auswerten(); }
    };
    function taste(zeichen){ return function(){ einfuegen(zeichen); }; }

    var TASTEN = [
      { label:"MC", fn:speicherLoeschen }, { label:"MR", fn:abrufen }, { label:"M+", fn:speichern },
      { label:"C", fn:leeren }, { label:"←", fn:rueckschritt },
      { label:"(", fn:taste("(") }, { label:")", fn:taste(")") },
      { label:"^", fn:taste("^") }, { label:"%", fn:taste("%") }, { label:"√", fn:taste("√(") },
      { label:"7", fn:taste("7") }, { label:"8", fn:taste("8") }, { label:"9", fn:taste("9") },
      { label:"÷", fn:taste("÷") }, { label:"×", fn:taste("×") },
      { label:"4", fn:taste("4") }, { label:"5", fn:taste("5") }, { label:"6", fn:taste("6") },
      { label:"−", fn:taste("−") }, { label:"+", fn:taste("+") },
      { label:"1", fn:taste("1") }, { label:"2", fn:taste("2") }, { label:"3", fn:taste("3") },
      { label:"0", fn:taste("0") }, { label:",", fn:taste(",") },
      { label:"=", fn:auswerten }
    ];
    TASTEN.forEach(function(t){
      var knopf = el("<button type='button' class='b leise rechner-taste'>" + esc(t.label) + "</button>");
      knopf.onclick = t.fn;
      tastenWrap.appendChild(knopf);
    });
    return d;
  };
})();

