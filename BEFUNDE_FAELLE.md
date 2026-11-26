# BEFUNDE – Etappe IV: die neun Fallaufgaben (begonnen 27.08.2026)

⚠️ **STAND: Die Vorabmessung ist durch, die inhaltliche Prüfung der 45 Teilaufgaben steht noch
aus.** Was hier steht, sind drei Befunde, die **vor der ersten gelesenen Fallfrage** aufgefallen
sind – sie liegen im Code, nicht im Inhalt.

## Wie sie gefunden wurden
Der Plan sah als ersten Schritt eine Messung vor: *Was tut der Löser mit einer Freitext-Teilaufgabe
ohne `schluesselbegriffe`?* (Keine der 45 hat welche.) Die Antwort war überraschend: **Der Löser
sieht diese Teilaufgaben nie.**

---

## B60 · Zwei Listen für dieselbe Entscheidung (mittel)
`logik.js` deklariert die Registry `L.TYP` ausdrücklich als „**Eine Quelle der Wahrheit je
Aufgabentyp**", mit dem Feld `simAuto` und der daraus abgeleiteten Sicht `L.SIM_TYPEN`.
**`app_sim.js` las das nie**, sondern führte in `autoBewertbar()` eine hartkodierte Aufzählung.
Die beiden waren auseinandergelaufen:

| | Typen |
|---|---|
| `L.SIM_TYPEN` (Registry) | mc · lueckentext · zuordnung · bild · mehrfach · reihenfolge · dropdown |
| `autoBewertbar()` (App) | mc · lueckentext · zuordnung · dropdown · mehrfach |

**`reihenfolge` stand auf `simAuto: true` und fehlte in der harten Liste — 23 AP1-Fragen waren
dadurch aus der Prüfungssimulation ausgeschlossen, ohne dass es jemand entschieden hätte.**
✅ `autoBewertbar()` liest jetzt `L.SIM_TYPEN`. Die bild→unterTyp-Auflösung bleibt.
►► **Zwei Listen für dieselbe Sache driften immer – auch im Code.** Dieselbe Klasse wie die
Doppelung, die am selben Tag in START_PROMPT/TASKLIST aufgelöst wurde.

## B61 · Vier grüne Prüfungen über einen toten Codepfad (mittel)
`L.buildSimulation` ist die Funktion, die `L.SIM_TYPEN` tatsächlich las – und sie wurde
**ausschließlich von `tests/test_logik.js`** aufgerufen. Die App baut ihre Simulation seit jeher
mit `buildAP1Exam()` in `app_sim.js`.
⚠️⚠️ **Vier Prüfungen bestätigten den toten Pfad, während `buildAP1Exam` KEINE einzige Suite hatte.**
Der Test „Sim: keine Freitexte" war grün und sagte nichts über das Produkt aus.
►►► **Dieselbe Familie wie „`test_axe` würfelte": eine Prüfung ist grün, weil sie etwas anderes
prüft als das, was läuft.** Die gefährlichere Variante – dort war die Stichprobe zu klein, hier war
der Prüfling der falsche.
✅ `L.buildSimulation` entfernt (19 Zeilen), an ihrer Stelle steht die Begründung. Neue Suite
**`tests/test_sim.js`** fährt `buildAP1Exam` über die echte Seite: Start-Button klicken,
gezogene Fragen prüfen. **13 Prüfungen.** `test_logik` 2158 → 2154.

## B62 · Acht von 45 Fall-Teilaufgaben waren für keinen Lerner erreichbar (mittel)
Die Fälle kommen **ausschließlich in der Simulation** vor (`FAELLE` steht in genau einer Datei).
Dort filtert `fallFuerSim` mit derselben Liste. Ergebnis: je eine Teilaufgabe in **acht der neun
Fälle** fiel heraus – 6 × `mtf`, 2 × `freitext`. Nur FALL-02 war vollständig sichtbar.

**Die Messung, warum `mtf` ausgeschlossen war, dreht den Befund.** Im Archiv steht wörtlich:
> `simAuto:false` (wie übrige interaktive Typen; **Sim-Renderer aus Scope – bewusst, dokumentiert**)

Der Ausschluss war also **keine didaktische, sondern eine Scope-Entscheidung**. Gemessen am 27.08.:
`renderSimFrage()` ruft `renderFrage()` auf – **denselben Renderer wie der Übungsmodus. Einen
eigenen Sim-Renderer gibt es nicht und gab es nie.**
Und die andere Hälfte: Die Fälle wurden laut Archiv bewusst mit „Formate je Fall gemischt
(mc/mehrfach/dropdown/mtf)" geschrieben – zu einem Zeitpunkt, als `mtf` bereits ausgeschlossen war.
►►► **Zwei für sich begründete Entscheidungen, die kollidieren, ohne dass es auffiel.** Und die
Begründung der einen war zu diesem Zeitpunkt schon abgelaufen: *eine dokumentierte Grenze ist eine
Behauptung über das Werkzeug, und die altert wie jede andere.*

✅ **Nutzer-Entscheid: `mtf` auf `simAuto: true`.** Sechs Fall-Teilaufgaben und 9 Pool-Fragen werden
sichtbar. ✅ **Nutzer-Entscheid: die zwei Freitext-Teilaufgaben auf einen bewertbaren Typ umbauen.**
FALL-01-t4 (Implementierungs- und Testplan) und FALL-03-t2 (DSGVO-Pflichten nach der Datenpanne)
sind jetzt `mtf` mit je fünf Aussagen – **inhaltlich aus der bisherigen Musterlösung abgeleitet**,
Phasenlogik bzw. Meldepflichten unverändert.
⚠️ **Damit haben alle neun Fälle dieselbe Struktur:** vier automatisch bewertbare Teilaufgaben plus
eine `mtf`. FALL-01 und FALL-03 waren die einzigen Ausreißer.
**45 von 45 Teilaufgaben sind erreichbar.**

## GEGENGEPROBT
* `reihenfolge` zurück auf `simAuto:false` → `FEHLER: reihenfolge ist im Bestand`.
* `mtf` zurück auf `simAuto:false` → `FEHLER: mtf ist im Bestand` **und** `FEHLER: jede
  Fall-Teilaufgabe ist erreichbar: FALL-01-t4, FALL-03-t2, FALL-04-t3, FALL-05-t2, FALL-06-t1,
  FALL-07-t2, FALL-08-t2, FALL-09-t2` – die Probe zeigt das alte Ausmaß vollständig.
* Beide zurückgenommen, wieder grün.
⚠️ Die erste Fassung von `test_sim.js` lief in den Zeitrahmen statt zu enden: **der Klausur-Timer
hält den Node-Prozess offen.** `simAbbrechen()` am Ende räumt ihn ab – wie in `test_timer.js`.

## OFFEN: DIE INHALTLICHE PRÜFUNG
Die 45 Teilaufgaben sind **noch nicht einzeln gelesen**. Das ist der eigentliche Auftrag von
Etappe IV. ► **Zusätzliche Prüfdimension gegenüber Einzelfragen:** ob die fünf Teilaufgaben
aufeinander aufbauen und das Szenario tragen.

---

# RUNDE II: DIE 45 TEILAUFGABEN EINZELN GELESEN (27.08.)

Gelesen wurde jede Teilaufgabe vollstaendig: Frage, alle Optionen, alle
Distraktorerklaerungen, erklaerungKurz und erklaerungLang. Jeder Rechenweg
wurde nachgerechnet. Zusaetzlich geprueft: Traegt das Szenario ueber alle
fuenf Teile, oder sind es fuenf Einzelfragen unter einer Ueberschrift?

## DER BEFUND, DER ALLES ANDERE ORDNET

Der Bestand zerfaellt in zwei Generationen, und die Grenze ist im Git belegbar:

    FALL-01, FALL-02, FALL-03   b44ebde  "AP1-Lernprogramm"  (Erstbestand)
    FALL-04 ... FALL-09         f793f08  "6 neue Faelle"

Die sechs neuen Faelle tragen eine durchgehende Fallkette: Brunnhuber
Metallverarbeitung richtet eine Ausbildungswerkstatt ein (FALL-04, M01),
beschafft dafuer Notebooks (FALL-05, M02), rollt sie aus (FALL-06, M05),
schliesst einen Wartungsvertrag (FALL-07, M07), versorgt die Halle mit WLAN
(FALL-08, M03) und schreibt ein Inventarskript (FALL-09, M04). Ein Lerner
durchlaeuft dieselbe Firma ueber sechs Module. Das ist die Staerke der Form.

Die drei Faelle des Erstbestands haben je eine eigene Firma, keine Verbindung
untereinander, und tragen praktisch alle Maengel dieser Runde.

## FALL-01 (M04, Wendland Stahlbau) - ERSTBESTAND

**B63 - Der Aufgabentext fuehrt auf die falsche Antwort.** Teil a) sagt:
"Der Dienstleister uebergibt Ihnen ein 50-Seiten-Dokument mit detaillierten
Anforderungen." Ein vom Dienstleister uebergebenes Dokument mit detaillierten
Anforderungen ist nach genau der Definition, die die Aufgabe abfragt, das
Pflichtenheft. Gewertet wird aber "Lastenheft, vom Auftraggeber erstellt".
Wer die Unterscheidung sicher beherrscht, kreuzt hier falsch an. Zusaetzlich
weicht die erklaerungLang die Loesung auf: "wird vom Auftraggeber ... oder
gemeinsam mit dem Auftragnehmer erstellt".

**B64 - Die Loesung steht im Aufgabentext.** Teil b) nennt die Attribute
"KundenID (Primaerschluessel), Name, E-Mail, Branche" und fragt danach, was
KundenID ist. Antwort: Primaerschluessel. Schwierigkeit 3 ist dafuer
nicht zu rechtfertigen. Ausserdem kommt Wendland Stahlbau in der Aufgabe
nicht mehr vor - eine Standardfrage mit Fallkopf darueber.

**B65 - GPL falsch aufgeloest, und im Widerspruch zum eigenen Bestand.**
Teil c) ordnet zu: "Open-Source-Lizenz (GPL) - Kostenlos, Quellcode einsehbar;
Aenderungen muessen veroeffentlicht werden." Die Bedingung fehlt: Die
Offenlegungspflicht greift bei Weitergabe, nicht bei interner Aenderung.
Und "kostenlos" ist kein Merkmal der GPL - GPL-Software darf verkauft werden.
Der uebrige Bestand sagt es ueberall richtig:
  pool_m04:        "wenn Sie ... das Produkt weitergeben, muessen Sie ..."
  abkuerzungen.js: "Aenderungen muessen bei Weitergabe offengelegt werden."
Nur der Fall sagt es falsch. Das ist ein Selbstwiderspruch des Bestands
ueber die Dateigrenze hinweg.

**B66 - funktional und nicht-funktional werden vertauscht erklaert.**
Die erklaerungLang zu d) zaehlt auf: "Funktionale Anforderungen fuer ein CRM
sind: (1) Sicherheit/DSGVO ... (4) Skalierbarkeit". Sicherheit und
Skalierbarkeit sind die Musterbeispiele *nicht-funktionaler* Anforderungen.
Der Satz danach ist noch schaedlicher: "Nicht-funktionale Anforderungen wie
'schoen aussehen' ... sind in der Analyse irrelevant." Nicht-funktionale
Anforderungen sind Bestandteil der Anforderungsanalyse; genau das wird in
AP1 gefragt. Ein Lerner, der die Unterscheidung gelernt hat, lernt sie hier
wieder ab.

**B67 - Scherz-Distraktor.** "Das System muss einen Fussball-Spieler als
Maskottchen haben." Verraet das Antwortmuster und kommt in keiner
IHK-Aufgabe vor.

**B68 - Das Szenario kuendigt an, was nicht kommt.** Angekuendigt:
"Analysieren Sie die Dokumentation, definieren Sie das Datenmodell und
kalkulieren Sie Lizenzen." Eine Kalkulation findet nicht statt (c) ist eine
Zuordnung). Teil d) springt hinter die Lizenzen zurueck in die
Anforderungsanalyse, gehoert also der Sache nach vor b).

## FALL-02 (M03, Kirchmayr Praezisionstechnik) - ERSTBESTAND

**B69 - BITV als Rechtsgrundlage fuer Stuhl und Schreibtisch.** Teil c)
ordnet zu: "Ergonomischer Stuhl und Schreibtisch - ... (BITV/Ergonomie)",
und die erklaerungLang setzt nach: "Ergonomie und Barrierefreiheit (Stuhl,
Tisch, Monitor-Hoehe) gesetzlich vorgeschrieben (BITV, Arbeitsschutz)".
Die BITV ist die Barrierefreie-Informationstechnik-Verordnung und regelt die
Barrierefreiheit von Websites und IT-Anwendungen oeffentlicher Stellen des
Bundes. Fuer Bildschirmarbeitsplaetze gelten ArbSchG und ArbStaettV
(Anhang Nr. 6, Arbeiten an Bildschirmgeraeten). Zwei Fundstellen im selben
Item. Siehe auch B80 - der Waechter, der genau das verhindern soll, hat
den Fall nie gelesen.

**B70 - Das Planbarkeits-Argument steht auf der falschen Seite.** Teil e)
fragt nach Argumenten FUER den Kauf und wertet "Keine monatlichen Zahlungen;
bessere Budgetplanbarkeit (einmalig)" als richtig. Die gleichbleibende
Rate ist das klassische Planbarkeits-Argument des *Leasings*; eine einmalige
Grosszahlung belastet die Liquiditaet und ist das Gegenargument.

**B71 - "Bessere Abschreibungsmoeglichkeiten" ist mehrdeutig.** Ebenfalls
Teil e), als Kauf-Argument gewertet. Vertretbar nur in der engen Lesart
"AfA gibt es ueberhaupt nur bei Kauf". Wer gelernt hat, dass Leasingraten
sofort in voller Hoehe Betriebsausgabe sind und Leasing bilanzneutral wirkt,
kreuzt hier nicht an. Die erklaerungKurz sagt selbst: "Leasing = ...
vereinfachte Buchfuehrung."

**B72 - Zwei Antworten liegen auf Schicht 2.** Teil a) fragt nach der
Komponente auf OSI-Schicht 2. Die Distraktorerklaerung raeumt selbst ein:
"Access Point arbeitet auf Schicht 2 fuer WLAN". Unterschieden wird also
nicht ueber die Schicht - die Frage - sondern ueber eine falsche
Funktionsbeschreibung im Optionstext.

**B73 - Zuordnung ohne Zuordnungsleistung.** Teil c): SSD zu "Datenspeicher",
RAM zu "Zwischenspeicherung", CPU zu "Recheneinheit" - die Begriffe nennen
ihre eigene Antwort. Ausserdem sind "Ergonomischer Stuhl und Schreibtisch"
in einer Aufgabe, die "Hardware-Komponenten auswaehlen" laesst, keine
Hardware.

**B74 - Kleinkram.** Das Szenario nennt vier Aufgaben; d) Subnetting ist
keine davon. In b) steht der Fremdkoerper "Merke: Bit/Byte spielt hier keine
Rolle" in einer reinen Stromkostenrechnung.

## FALL-03 (M06, Osterloh Antriebstechnik) - ERSTBESTAND

**B75 - Protokollierung wird der Integritaet zugeschlagen.** Teil b) ordnet
"Anomalie-Detection und Revision-Logs" dem Schutzziel "Integritaet
(nachtraeglicher Nachweis von Veraenderungen)" zu. Protokollierung dient der
Zurechenbarkeit und Revisionssicherheit; Integritaet wird durch Hashwerte und
Signaturen gesichert - was dasselbe Item eine Zeile darueber korrekt sagt.
Die erklaerungLang weicht selbst aus: "Logs und Monitoring dienen der
Forensik und Nachverfolgung, gehoeren aber auch zum CIA-Kontext." Ein Satz,
der zugibt, dass die Zuordnung nicht traegt.

**B76 - Beide Luecken beantworten sich selbst.** Teil d): "eine ___ Sicherung
(alle Aenderungen seit letzten VOLLsicherung)" - der Klammerzusatz ist die
Definition von differentiell. "eine ___ Sicherung (alle Daten)" - dito fuer
vollstaendig. Dazu im selben Item zwei Schreibweisen, "differentielle" und
"Differenziell", und der Grammatikfehler "seit letzten VOLLsicherung".

**B77 - Ein Distraktor ist doppelt.** Teil a) bietet "Regelmaessige Backups
der Datenbank (verhindert Datenverlust)" und "Ein Backup-System mit
taeglicher Sicherung". Vier Optionen, drei verschiedene Aussagen.

**B78 - Scherz-Distraktor und ein fragwuerdiges Richtig.** Teil e):
"Ein kostenloses VPN fuer alle Mitarbeiter installieren." Und als richtig
gewertet: "Alle Software und Systeme muessen staendig die letzte Version
haben (Patching)" - ungetestetes Sofort-Patchen im Produktivbetrieb ist
kein Haertungsstandard, Patch-Management mit Test und Freigabe ist einer.

**B79 - Die Backup-Frage folgt nicht aus dem Fall.** Der Vorfall ist eine
Vertraulichkeitsverletzung; es gingen keine Daten verloren. Teil d) fragt
trotzdem nach der Backup-Strategie. Das Szenario verlangt "praeventive
Massnahmen" - Backup ist fuer diesen Vorfall keine.

## STRUKTURELL

**B80 - Kein inhaltlicher Waechter liest faelle.js. Vierter Fall derselben
Klasse.** `pool_query.js` liest fragen.js. In der Datei steht es sogar
selbst, Zeile 271:

    "faelle.js ist NICHT dabei - pool_query liest fragen.js.
     FALL-* getrennt pruefen."

Ein getrennter Lauf existiert nicht und hat nie existiert. Betroffen sind
alle inhaltlichen Waechter: Fachbegriffe (4e6), Gesetzeszitate (4e4),
Firmen-Eigennamen (4e3), Verweis-Ziele, Laengen. Nur der Drift-Guard und
die Schema-Pruefung fassen faelle.js an - die pruefen die Form, nicht den
Inhalt.

Konkret: Der BITV-Fehler aus B69 stand die ganze Zeit unmittelbar neben der
gruenen Zeile

    [ok] Fachbegriffe (2 maschinell geprueft, 2 nur dokumentiert)
         ok  BITV: 0

Der Waechter wurde am 27.08. gebaut, weil BITV falsch aufgeloest wurde. Er
meldet null Treffer und hat den vorhandenen Treffer nie sehen koennen.
Das ist derselbe blinde Fleck wie bei der begriffe-Ausnahme, bei
zitate_belegt.json und bei laengen_ausnahmen.json: Die Pruefung sagt gruen
ueber einen Bereich, den sie nicht betritt.

**B81 - mtf-Aussagenzahl uneinheitlich.** FALL-01 und FALL-03 haben fuenf
Aussagen, FALL-04 bis FALL-09 haben vier. Die beiden Fuenfer sind die am
27.08. umgebauten.

**B82 - `thema` ist teils enger als der Fall.** FALL-04 heisst "Netzplan &
Puffer", obwohl nur b) Netzplan ist (a) Projektbegriff, c) Risiko,
d) Vorgehensmodelle, e) SMART). FALL-05 heisst "Bezugskalkulation & Skonto"
und enthaelt Nutzwertanalyse und TCO.

## WAS GEPRUEFT WURDE UND HAELT

Alle Rechenwege nachgerechnet, alle richtig:

    FALL-02 b)  10 PCs, 250 W, 8 h, 250 Tage, 0,28 EUR  ->  1.400 EUR
    FALL-02 d)  /24 in zwei /25, zweites ab .128
    FALL-05 b)  1200 x0,85 x0,98 +20                    ->  1.019,60 EUR
    FALL-05 c)  Skontodifferenz 3,60 je Geraet, 43,20 gesamt
    FALL-07 b)  8.760 h x 0,1 %                         ->  8,76 h
    FALL-07 b)  Servicezeit 8-17 Uhr werktags           ->  rund 2.350 h
    FALL-08 e)  20 GB x8 = 160.000 Mbit / 500           ->  320 s
    FALL-09 a)  Schreibtischtest, 2+4                   ->  6

FALL-07 zitiert §§ 611, 631, 634, 634a, 635, 637, 638, 640 Abs. 3, 641, 644
BGB. Alle geprueft, alle richtig zugeordnet - einschliesslich der genauen
Aussage zu § 640 Abs. 3 (Rechtsverlust nur bei Kenntnis ohne Vorbehalt).
Einzige Unschaerfe: "Ruecktritt oder Minderung (§ 638)" - § 638 regelt nur
die Minderung; der Ruecktritt folgt aus § 634 Nr. 3 in Verbindung mit
§§ 636, 323.

FALL-08 b) nennt alle vier PoE-Stufen mit Port- und Geraeteleistung
(15,4/12,95 - 30/25,5 - 60/51 - 90/71,3). Alle vier korrekt.

## BILANZ

    FALL-01   6 Befunde, davon 3 fachlich falsch
    FALL-02   6 Befunde, davon 2 fachlich falsch, 1 mehrdeutig
    FALL-03   5 Befunde, davon 1 fachlich falsch
    FALL-04   ohne Befund
    FALL-05   ohne Befund
    FALL-06   ohne Befund
    FALL-07   1 Unschaerfe (§ 638)
    FALL-08   ohne Befund
    FALL-09   ohne Befund
    Struktur  3 Befunde (B80 wiegt am schwersten)

Die sechs neuen Faelle sind der Massstab. Die drei alten liegen darunter.

---

# RUNDE III: ABGEARBEITET (27.08. abends)

Nutzer-Entscheide: Erstbestand neu schreiben · pool_query.js liest faelle.js mit ·
alle mtf auf fuenf Aussagen · § 638 und thema mitnehmen · alle zehn Tells
entschaerfen · test_didaktik nach der Korrektur aufnehmen und die Ratsche neu
setzen · BITV-Nachbarn aufnehmen und M03-117 mitpruefen.

## B80 GESCHLOSSEN - UND DER WAECHTER FAND SOFORT ZWEI WEITERE

`tools/pool_query.js` liest jetzt `B = FRAGEN + Fall-Teilaufgaben`. Jede
Teilaufgabe wird ein Eintrag `FALL-0N-tM`; Titel und Szenario haengen an t1,
damit jeder Text GENAU EINMAL im Bestand steht. Die strukturellen Kommandos
(idcheck, freeids, coverage, themen, typen, duenn, stufe, zufall) lesen weiter
`F` - `FALL-0N-tM` ist keine ID der Form M0X-NNN. Die Selbstauskunft "faelle.js
ist NICHT dabei" in `firmen` ist ersetzt.

**Kalibrierung bestanden:** `kontext BITV` zeigt jetzt `FALL-02-t3` mit beiden
Fundstellen; `firmen` zaehlt 262 statt 258 Namen; `verweise` 1107 statt 1062
Eintraege bei E2 = 0, also hat jede Teilaufgabe einen Abschnittsverweis.

**Und dann der eigentliche Ertrag.** Der BITV-Eintrag in `begriffe_belegt.json`
bekam die zweite Fehlverwendung als verbotene Nachbarschaft (Ergonomie,
ergonomisch, ArbStaettV, Arbeitsstaettenverordnung, Arbeitsschutz,
Bildschirmarbeitsplatz), Fenster 90. Der erste Lauf meldete VIER Treffer:

    M03-010   "Bildschirmarbeitsplaetze muessen ergonomisch ausgestattet
               sein (BITV, Arbeitsschutz)"
    M03-117   "Bildschirmarbeitsplaetze muessen ergonomisch sein
               (BITV, Arbeitsstaettenverordnung ArbStaettV)"
    M03-612   "Barrierefreiheit ist oft rechtlich verpflichtend
               (BITV 2.0, WCAG 2.1, ArbStaettV)"
    FALL-02-t3  der bekannte Fall

**B84:** Derselbe Fehler stand also nicht nur im Fall, sondern zweimal
ungesehen im Fragenpool. M03-010 und M03-117 nennen jetzt ArbSchG und
ArbStaettV Anhang Nr. 6 (Arbeiten an Bildschirmgeraeten).

**B85:** M03-612 betrifft einen Beschaeftigten im Privatunternehmen. Zustaendig
ist dort § 164 Abs. 4 SGB IX (behinderungsgerechte Einrichtung des
Arbeitsplatzes), nicht die BITV. Die Frage nennt jetzt diese Norm und grenzt
ab: "Die BITV bindet nur oeffentliche Stellen des Bundes". Genau dieser Satz
steht als `entwarnung` im Waechter - kein ID-Ausnahmeeintrag, sondern der
Abgrenzungssatz, wie bei Pay-per-Use. Sabotage-Gegenprobe: Wird der Satz
entfernt, meldet der Waechter M03-612 wieder.

## DIE DREI FAELLE SIND NEU GESCHRIEBEN

Alle drei haengen jetzt in der Brunnhuber-Kette. Damit durchlaeuft ein Lerner
dieselbe Firma ueber alle neun Faelle und sieben Module:

    FALL-04 M01  Werkstatt als Projekt planen
    FALL-05 M02  Notebooks beschaffen und kalkulieren
    FALL-01 M04  Werkstattverwaltungs-Software einfuehren      NEU
    FALL-02 M03  eigener Netzabschnitt und Betriebskosten      NEU
    FALL-08 M03  WLAN-Versorgung der Halle
    FALL-06 M05  Rollout und Qualitaetssicherung
    FALL-03 M06  verlorenes Schulungsnotebook, Datenpanne      NEU
    FALL-07 M07  Wartungsvertrag, SLA und Abnahme
    FALL-09 M04  Auswertungsskript fuer das Inventar

Alle 17 Befunde aus Runde II fallen damit. Im Einzelnen:

**B63** Der Aufgabentext von FALL-01 a) sagt jetzt eindeutig, wer welches
Dokument geschrieben hat: "Sie haben aufgeschrieben, was die Software leisten
soll. Er schickt zurueck, mit welcher Datenbank, welchen Masken und welchen
Schnittstellen er das umsetzen will." Damit fuehrt der Text auf das Lastenheft
und nicht mehr am Pflichtenheft vorbei.

**B64** FALL-01 b) nennt die Loesung nicht mehr im Text. Gefragt wird jetzt
nach der ROLLE eines Feldes in der ZWEITEN Tabelle (GeraetNr in Ausleihe =
Fremdschluessel) und nach der Kardinalitaet (1:n). Beides steht nirgends im
Aufgabentext.

**B65** Die GPL-Zeile lautet jetzt: "Quelloffen; wer eine geaenderte Fassung
WEITERGIBT, legt den Quellcode unter derselben Lizenz offen." Das Wort
"kostenlos" ist raus, und die erklaerungLang sagt es ausdruecklich: GPL heisst
nicht kostenlos, GPL-Software darf verkauft werden. Damit stimmt der Fall
wieder mit pool_m04 und abkuerzungen.js ueberein.

**B66** FALL-01 d) fragt jetzt umgekehrt: welche Punkte sind NICHT-funktional?
Richtig sind Antwortzeit, Bedienbarkeit, Verschluesselung und Portabilitaet;
funktional sind Ausleihe erfassen und Bericht ausgeben. Die erklaerungLang
sagt den Satz, der vorher fehlte: nicht-funktionale Anforderungen gehoeren ins
Lastenheft und sind der haeufigste Streitpunkt bei der Abnahme, weil sie oft
unmessbar formuliert werden.

**B67 / B78** Beide Scherz-Distraktoren sind weg (Maskottchen, kostenloses
VPN). An ihre Stelle treten plausible Fehlgriffe: ungeprueftes Sofort-Patchen
und eine HOECHSTlaenge fuer Kennwoerter.

**B68 / B74 / B79** Die Szenarien kuendigen nur noch an, was auch kommt, und
jede Teilaufgabe folgt aus dem Fall. In FALL-02 gehoert das Subnetting jetzt
zum Szenario ("bekommt einen eigenen Adressbereich"). In FALL-03 ist die
Backup-Frage durch eine Verschluesselungsfrage ersetzt - sie folgt aus dem
Vorfall, waehrend Backup es nicht tat.

**B69** Die BITV ist aus dem Fall verschwunden. FALL-02 c) sagt jetzt positiv:
"Bildschirmarbeitsplaetze muessen nach Arbeitsschutzgesetz und
Arbeitsstaettenverordnung ergonomisch eingerichtet sein."

**B70 / B71** FALL-02 d) fragt jetzt nach Argumenten FUER LEASING. Richtig sind
Planbarkeit der Rate, Schonung der Liquiditaet und der Geraetewechsel am
Laufzeitende. Falsch sind "in der Summe guenstiger", "erscheint beim
Leasingnehmer im Anlagevermoegen" und "Umbauten ohne Ruecksprache moeglich".
Damit stehen die Argumente auf der Seite, auf die sie gehoeren.

**B72** In FALL-02 a) liegt nur noch EINE Antwort auf Schicht 2. Die uebrigen
drei nennen Schicht 1, 3 und 4 - unterschieden wird ueber die Frage, nicht
ueber eine falsche Funktionsbeschreibung.

**B73** Die Zuordnung, die ihre eigenen Antworten nannte, ist ersatzlos weg.
An ihrer Stelle steht die mtf-Aufgabe zu den Gesamtkosten.

**B75** FALL-03 b) ordnet Protokollierung jetzt der ZURECHENBARKEIT zu, und die
erklaerungLang fuehrt sie als viertes Schutzziel neben CIA ein - mit dem Satz,
der die Verwechslung aufloest: "Ein Protokoll sagt nichts darueber, ob eine
Datei veraendert wurde - es sagt, wer angemeldet war."

**B76** FALL-03 d) nennt keine Definitionen mehr im Text. Gefragt wird nach den
konkreten Verfahren: AES als symmetrisches Verfahren, SHA-256 als
Einwegfunktion.

**B77** Der doppelte Backup-Distraktor ist weg. FALL-03 a) bietet jetzt vier
verschiedene Massnahmen - und der beste Distraktor ist der lehrreichste: "Ein
Kennwort fuer das Benutzerkonto mit mindestens zwoelf Zeichen". Die Erklaerung
dazu: "Wer die Festplatte ausbaut oder von einem USB-Medium startet, liest sie
ohne jede Anmeldung."

Dazu neu im Bestand: die Bedingung aus Art. 34 Abs. 3 lit. a DSGVO - bei
verschluesselten Daten kann die Benachrichtigung der Betroffenen entfallen.
Das ist der wirtschaftliche Wert der Verschluesselung und macht aus a), c) und
e) einen zusammenhaengenden Gedanken.

## B83 - DER LAENGEN-TELL IN DEN FAELLEN

Sobald `laengen` die Faelle mitlas:

    Grundmenge   287 -> 301
    TELL           6 -> 16   (zehn von vierzehn mc-Teilaufgaben)
    UEBERLANG      0 ->  2   (FALL-08-t1 1,38x · FALL-08-t2 1,39x)

71 % gegen 2,09 % im Fragenpool. Die Faelle waren nie in der Ratsche und
standen deshalb noch auf dem Stand VOR der Qualitaetsrunde Q1.

Alle zehn sind entschaerft - **ausschliesslich durch Verlaengern der
Distraktoren, keine einzige richtige Antwort wurde gekuerzt.** Betroffen:
FALL-04-t1, FALL-04-t5, FALL-05-t5, FALL-06-t1, FALL-06-t5, FALL-07-t1,
FALL-07-t2, FALL-07-t5, FALL-09-t2; FALL-03-t1 fiel mit der Neuschrift weg.
Die beiden ueberlangen Distraktoren in FALL-08 sind gekuerzt.

    NACHHER:  TELL 6 von 302 = 1,99 %   UEBERLANG 0

Der gemeinsame Wert liegt UNTER dem des Fragenpools allein (2,09 %), weil die
Faelle jetzt fuenfzehn saubere mc-Aufgaben in den Nenner bringen. Die sechs
verbleibenden Treffer sind der Nutzer-Entscheid vom 27.07.: M01-117, M03-001,
M03-002, M03-020, M05-105, M07-008.

`tests/test_didaktik.js` liest die Faelle jetzt bei BEIDEN Laengenmassen
(Stufenluecken und Gebietsanteile bleiben auf FRAGEN - Teilaufgaben haben kein
Feld `gebiet`). Die Ratsche wurde GESENKT: Ziel und Schwelle von 5,0/8,0 auf
3,0/3,0.

## B86 - DIE QUOTE FAENGT DEN EINZELFALL NICHT

Beim Gegenproben aufgefallen: Ein einzelner neuer Tell hebt die Quote von
1,99 % auf 2,32 % und bleibt damit unter der Schwelle. Im Fragenpool ist das
kein Problem, weil `tools/apply_batch.py` jede neue Frage mit Tell schon beim
Einsortieren zurueckweist. Aber apply_batch nimmt eine FLACHE Fragenliste
(`--pool pool/pool_mNN.json`) und kann `pool_faelle.json` mit seiner
Teilaufgaben-Schachtelung nicht lesen. Fuer die Faelle gab es also kein Netz
je Aufgabe.

Ergaenzt wurde deshalb eine harte Null statt einer Quote: **keine einzige
Fall-Teilaufgabe darf den Tell haben.** Bezahlbar, weil es nur fuenfzehn
mc-Aufgaben sind, und heute erfuellt.

    ⚠️ Das ist eine Entscheidung, die beim Schreiben neuer Faelle bindet:
       mindestens ein Distraktor muss LAENGER sein als die richtige Antwort
       und hoechstens 1,15x so lang.

## ZWEI GEGENPROBEN, BEIDE BESTANDEN

    Faelle aus der Messung genommen   -> FEHLER: "Die Laengenmessung liest
                                          die Fall-Teilaufgaben mit (B80)"
    ein Tell in FALL-08-t1 gesetzt    -> FEHLER: "Keine einzige
                                          Fall-Teilaufgabe hat den
                                          Laengen-Tell (B86)"

Beim ersten Versuch schlug die zweite Probe NICHT an: Der gekuerzte Distraktor
war zwar kuerzer als die richtige Antwort, ein anderer aber noch laenger - es
gab also gar keinen Tell. Erst als alle Distraktoren unter der richtigen
Antwort lagen, meldete der Waechter. Die Probe war falsch, nicht der Waechter.
Festgehalten, weil eine Gegenprobe, die aus dem falschen Grund schweigt, wie
ein kaputter Waechter aussieht.

## KLEINBEFUNDE

**§ 638:** FALL-07 e) trennt jetzt "Minderung (§ 638)" von "Ruecktritt
(§ 634 Nr. 3 in Verbindung mit §§ 636, 323)".

**B81:** Alle neun mtf-Teilaufgaben haben jetzt fuenf Aussagen im Verhaeltnis
3 wahr / 2 falsch. Die sechs neuen Aussagen sind keine Fueller: Modellwechsel
mitten im Projekt (FALL-04), Skonto auf Bezugskosten (FALL-05), "bestanden"
heisst nicht "laeuft durch" (FALL-06), Bezugsgroesse der Verfuegbarkeit
(FALL-07), Fremdbelegung im 2,4-GHz-Band (FALL-08), Zaehlschleife mit null
Durchlaeufen (FALL-09). Jede ist in der erklaerungLang aufgegriffen.

**B82:** `thema` beschreibt jetzt den ganzen Fall - FALL-04 "Projektbegriff,
Netzplan, Risiko und Zielformulierung", FALL-05 "Bezugskalkulation,
Nutzwertanalyse und Wirtschaftlichkeit".

## TYPVERTEILUNG NACH DER RUNDE

    mc 18 · mehrfach 9 · mtf 9 · dropdown 7 · zuordnung 2   = 45

Jeder der neun Faelle hat jetzt genau eine mtf-Teilaufgabe. Vorher hatte
FALL-02 gar keine.

---

# RUNDE IV: WAS DAS PROTOKOLL FUER DIE ZUKUNFT HERGIBT (27.08. nachts)

Auftrag: das Protokoll gegen den Rest des Projekts halten und nach Loesungen
suchen - Waechter oder andere Instrumente.

## DER GROESSTE FUND: DIE LERNUNTERLAGEN

5207 Zeilen Lehrtext in `0*.md` und `99_Spickzettel.md`. Darauf zeigen die 959
Verweise aus dem Fragenpool. Geprueft wurde daran bisher NUR, ob ein
verwiesener Abschnitt EXISTIERT (`tools/e3_gegenprobe.py`) - nie, was darin
steht. Kein inhaltlicher Waechter hat diese Dateien je gelesen.

**B87** `03_IT-Systeme` Z.308: "Arbeitsplatz-IT muss nach BITV zugaenglich
sein." Die BITV bindet oeffentliche Stellen des Bundes. Im Privatunternehmen
folgt die Pflicht aus § 164 Abs. 4 SGB IX (behinderungsgerechte Einrichtung
des Arbeitsplatzes). Die Datei trennt die Ergonomie im Uebrigen sauber nach
ArbStaettV Anhang Nr. 6 ab - besser als der Pool es tat.

**B88** `04_IT-Loesungen` Z.452: Pay-per-Use erklaert als "Zahlungsmodell fuer
Cloud-Software (SaaS), Beispiel: Microsoft 365, Salesforce (monatliche Gebuehr
je Nutzer)". **Das ist exakt der Fehler, der am 27.08. in M04-008 und M04-120
korrigiert wurde - der Fehler, wegen dem der `begriffe`-Waechter ueberhaupt
entstand.** Er stand unveraendert im Lehrtext.

**B89** `04_IT-Loesungen` Z.449: GPL-Offenlegung ohne die Weitergabe-Bedingung,
dazu "muss aber Aenderungen zurueckfliessen lassen". **Exakt der Fehler, der
am selben Tag in FALL-01 c) korrigiert wurde.**

►►► **DAS IST B80 EINE EBENE HOEHER.** Wird ein Fachfehler im Pool korrigiert,
prueft nichts, ob derselbe Fehler im Lehrtext sitzt, auf den die Frage
verweist. Korrektur und Quelle laufen auseinander. Fuenfter Fall derselben
Klasse an zwei Tagen.

## UND DIE GPL WAR EINE FAMILIE VON FUENF

Der `begriffe`-Waechter kannte GPL nicht - der Fehler war ja "nur" in einem
Fall aufgetreten. Sobald GPL als belegter Begriff eingetragen war, meldete er
VIER Fundstellen, alle ohne die Weitergabe-Bedingung:

    04#446   Lehrtext, zwei Stellen im selben Abschnitt
    M04-008  "Quellcode oeffentlich; Aenderungen muessen veroeffentlicht werden"
    M04-310  "Aenderungen muessen offengelegt werden"
    M04-311  zweimal, in der Zuordnung und in der Erklaerung

Dazu die fuenfte in FALL-01 c). Und andere M04-Fragen sagen es richtig
("wenn Sie ... das Produkt weitergeben"), ebenso `abkuerzungen.js` - **sechster
Fall von "der Bestand widerspricht sich selbst"**.

►► **DIE LEHRE:** Wer einen Fachfehler korrigiert, traegt den Begriff in
   `begriffe_belegt.json` ein. Sonst bleibt die Korrektur ein Einzelfall,
   waehrend dieselbe Aussage anderswo unbehelligt weitersteht. Der Waechter
   findet nur, was ihm jemand genannt hat - das ist seine Grenze, und sie ist
   in `_grenze` beschrieben.

Nachgetragen wurden drei Begriffe aus den heutigen Befunden: **GPL**
(maschinell pruefbar), **Zurechenbarkeit** und **nicht-funktionale
Anforderung** (nur dokumentiert - eine Nachbarschaftsprobe auf "Protokoll"
waere zu unscharf, und `_grenze` verbietet einen Waechter, der so tut, als
messe er Bedeutung).

## LOESUNG 1: DIE TEXTPRUEFUNGEN LESEN JETZT DEN LEHRTEXT

`pool_query.js` kennt jetzt drei Bestaende:

    F  fragen.js                                    strukturelle Kommandos
    B  + Fall-Teilaufgaben                          laengen, verweise
    T  + Lernunterlagen                             begriffe, zitate, firmen,
                                                    kontext, suche

Die `.md` werden je Abschnitt zerlegt; eine Fundstelle heisst dann
`04#452 Pay-per-Use (Nutzungsgebuehr)` - Datei, Zeile, Ueberschrift.
`spickzettel.js` braucht keinen eigenen Eintrag: `tools/build_spick.py` erzeugt
es aus `99_Spickzettel.md`.

Vollmessung nach der Aufnahme: **Zitate 0, Absatzangaben 0, Firmen 0 Maengel**
(260 statt 259 Namen). Alle sieben gefundenen Fundstellen sind korrigiert,
`begriffe` steht wieder auf 0.

## LOESUNG 2: DIE ABDECKUNGSMATRIX

`inhaltstraeger.json` fuehrt jeden Inhaltstraeger gegen jede inhaltliche
Pruefung. Jede Zelle ist entweder `gelesen` oder `nein: <Grund>`.

    5 Traeger x 5 Pruefungen = 25 Zellen, alle ausgefuellt

**`gelesen` ist eine PRUEFBARE BEHAUPTUNG, keine Notiz.** Das Kommando
`pool_query.js abdeckung` zaehlt nach, ob der Bestand, den die Pruefung laut
Matrix liest, wirklich Eintraege mit dem `id_muster` des Traegers enthaelt.
Wer eine Zelle auf `gelesen` setzt, ohne den Lader zu aendern, bekommt einen
Fehler - genau der Fall, der bei `faelle.js` monatelang unbemerkt blieb.

Zwei Gegenproben, beide bestanden:

    Zelle geleert                        -> A) UNAUSGEFUELLTE ZELLEN: 1
    "gelesen" ohne Lader behauptet       -> B) BEHAUPTET, ABER NICHT GELESEN: 1

Eingehaengt als `check.sh` Block **4e7**, als FEHLER (Nutzer-Entscheid: jede
Zelle muss ausgefuellt sein).

⚠️ Die Matrix prueft ABDECKUNG, nicht Qualitaet. Dass eine Pruefung einen
Traeger liest, sagt nichts darueber, ob sie darin das Richtige sucht. Der
`begriffe`-Waechter las den Fragenpool die ganze Zeit - und kannte GPL
trotzdem nicht.

## LOESUNG 3: DER VERRATS-FILTER

`pool_query.js verrat` - dropdown-Luecken, deren Loesungswort woertlich im
Aufgabentext steht. **12 Treffer im Fragenpool.** Einzeln gelesen: elf echt,
einer schwach, kein einziger Fehlalarm.

    M01-015 L1/L2  Satz 3 nannte "Dringlichkeit" und "Auswirkung" -
                   genau die beiden Woerter, nach denen L1 und L2 fragen
    M01-955 L2     "ohne Puffer" in Satz 1, "___" fragt nach "Puffer"
    M02-112 L2/L3  "(Aktualitaet des Inhalts)" und "(Qualifikation des
                   Urhebers)" - die Klammer IST die Antwort. Dieselbe
                   Frage macht es bei L1 richtig: "(Vertrauenswuerdigkeit
                   der Quelle)" statt "Serioesitaet"
    M04-318 L3     "ermoeglicht ___ Kommunikation im lokalen Netz"
    M04-922 L1     "eignet sich die ___-Schleife" neben der Luecke "Schleife"
    M05-461 L3     "beschreibt kontinuierliche Verbesserung" / KVP
    M06-461 L2     das Wort stand im LETZTEN Satz, die Luecke im ersten
    M07-304 L4     "bei der Abnahme" in Satz 1, "beginnt mit ___"
    M08-608 L3     "wird gewaehlt" in Satz 1, "wird selbst ___"
    M08-615 L1     "Inhalt eines Tarifvertrags" in Satz 2, Luecke in Satz 1

**Alle zwoelf behoben durch Umformulieren des AUFGABENTEXTS - keine einzige
Antwort, Option oder Erklaerung wurde geaendert.** Stand danach: 0.

⚠️ **EIGENTOR BEIM UMFORMULIEREN:** Meine erste Fassung von M01-015 lautete
"bei dem beide Faktoren auf der hoechsten Stufe stehen" - und L3 fragt nach
"hoechste". Der Filter meldete die Frage sofort wieder. Bei M06-461 hatte ich
den ersten Satz repariert, waehrend das Wort im letzten stand. **Ein Filter,
der nach der Korrektur noch einmal laeuft, faengt die Korrektur selbst.**

Eingehaengt als `check.sh` Block **4e8**, als **HINWEIS, nicht als Fehler** -
und **bewusst ohne Ausnahmeliste**. Der Filter kann Fehlalarme haben; ein
Fehler wuerde zu einer Ausnahmeliste fuehren, und genau die hat in diesem
Projekt dreimal die Fundstelle des Fehlers stillgestellt (`begriffe` erste
Fassung, `zitate_belegt.json`, `laengen_ausnahmen.json`). Ein Hinweis zwingt
zum Lesen, ohne zum Ausnehmen zu verfuehren.

## GEPRUEFT UND LEER - KEIN WAECHTER GEBAUT

Ein Waechter fuer eine leere Klasse ist Rauschen. Diese vier wurden gemessen
und verworfen:

    mtf einseitig bewertet (alles wahr / alles falsch)   0 von 21
    mc ohne jede Distraktorerklaerung                    0
    Szenario kuendigt an, was nicht kommt                nicht mechanisch fassbar
    Scherz-Distraktoren                                  nicht mechanisch fassbar

## EIN FEHLALARM, DER EINE LEHRE WERT IST

Die Probe "zwei wortgleiche Optionen in einer Frage" meldete M03-102. Fehlalarm
meiner eigenen Normalisierung: Sie warf Satzzeichen weg, wodurch "12,5 Mbit/s"
und "125 Mbit/s" identisch wurden. M03-102 ist eine Umrechnungsaufgabe.

►► **Eine Normalisierung, die Ziffern-Trennzeichen verwirft, erzeugt genau
   dort Fehlalarme, wo es um Zahlen geht.** Deshalb wurde daraus kein Waechter:
   Die Klasse ist im Bestand leer, und der einzige Treffer war ein Messfehler.
