#!/usr/bin/env python3
"""Fuegt die 20 neuen AP1-Wirtschaftsfragen (FB-R3, Nutzerbefund WiSo) in den Pool ein.

HINTERGRUND: Der Nutzer vermisste WiSo-Fragen in der AP1. Messung ergab: der Wirtschaftsstoff
ist da (rund 180 AP1-Fragen), aber ueber M01/M02/M03/M07 verteilt. Sieben vom Katalog
NAMENTLICH genannte Stichworte waren jedoch echte Luecken (1-3 Treffer):
  3.4 fixe/variable Kosten, Pay-per-Use, Wertschoepfung
  7.4 Matrixorganisation, Prokura, Handlungsvollmacht
  7.1 Mietvertrag
Bewusst NICHT ergaenzt: Abschreibung/AfA - duenn, steht aber nicht im AP1-Katalog.

ALLE Rechtsaussagen sind am Gesetzestext geprueft (Lehre aus FB-R2b.3, Regel 11):
  § 48 Abs. 1 HGB  Prokura nur durch Inhaber/gesetzl. Vertreter, ausdruecklich
  § 49 Abs. 1 HGB  Umfang: alle Geschaefte, die der Betrieb EINES Handelsgewerbes mit sich bringt
  § 49 Abs. 2 HGB  Grundstuecke veraeussern/belasten nur mit besonderer Befugnis
  § 52 Abs. 1 HGB  jederzeit widerruflich
  § 52 Abs. 2 HGB  nicht uebertragbar
  § 53 Abs. 1 HGB  Anmeldung zum Handelsregister; Eintragung ist DEKLARATORISCH
  § 54 Abs. 1 HGB  Handlungsvollmacht: Geschaefte, die der Betrieb eines DERARTIGEN Handels-
                   gewerbes GEWOEHNLICH mit sich bringt
  § 54 Abs. 2 HGB  Grundstuecke, Wechselverbindlichkeiten, Darlehen, Prozesse nur besonders
  § 535 Abs. 1 BGB Gebrauchsueberlassung auf Zeit; Vermieter erhaelt die Sache im vertrags-
                   gemaessen Zustand; Mieter zahlt die vereinbarte Miete

Aufruf:  python3 tools/r3_wirtschaft_neu.py           (schreibt)
         python3 tools/r3_wirtschaft_neu.py --probe   (nur pruefen, nichts schreiben)
Danach ZWINGEND: python3 build_fragen.py
"""
import json
import os
import sys
from pathlib import Path

M03 = [
{
  "id": "M03-710", "pruefungsteil": "AP1", "modul": "M03",
  "thema": "Wirtschaftlichkeit & TCO", "typ": "mc", "schwierigkeit": 1,
  "frage": "Die Sailer Dentaltechnik GmbH stellt die Kosten ihres IT-Betriebs zusammen. Welche der Positionen ist ein Fixkostenanteil?",
  "optionen": [
    "Die monatliche Grundgebühr für die Standleitung ins Rechenzentrum",
    "Die Druckkosten, die pro ausgedruckter Seite anfallen",
    "Die Gebühr für Cloud-Speicher, die nach belegten Gigabyte abgerechnet wird",
    "Die Supportstunden eines Dienstleisters, die nach Aufwand abgerechnet werden"
  ],
  "loesungIndex": 0,
  "distraktorErklaerungen": [
    "",
    "Die Druckkosten steigen mit jeder gedruckten Seite – sie hängen von der Nutzungsmenge ab und sind damit variabel.",
    "Die Gebühr wächst mit dem belegten Speicher und ist damit von der Nutzungsmenge abhängig, also variabel.",
    "Aufwandsbezogene Supportstunden fallen nur an, wenn Support in Anspruch genommen wird – variable Kosten."
  ],
  "erklaerungKurz": "Fixkosten fallen unabhängig von der Nutzungsmenge an. Die Grundgebühr für die Standleitung ist jeden Monat gleich hoch, egal wie viele Daten übertragen werden.",
  "erklaerungLang": "Die Unterscheidung richtet sich danach, ob eine Kostenposition mit der Nutzungs- oder Ausbringungsmenge mitwächst.\n\nFIXKOSTEN bleiben in ihrer Höhe gleich, solange sich am Umfang der Ausstattung nichts ändert: Miete für den Serverraum, Grundgebühren für Leitungen, Pauschalen aus Wartungsverträgen, Gehälter fest angestellter Administratoren.\n\nVARIABLE KOSTEN verändern sich mit der Menge: Verbrauchsmaterial wie Toner, nutzungsabhängige Cloud-Gebühren, nach Aufwand abgerechnete Fremdleistungen.\n\nWichtig für die Praxis: Fixkosten verteilen sich bei steigender Nutzung auf mehr Einheiten, die Fixkosten JE EINHEIT sinken also. Das ist der Grund, warum sich Angebote mit hohen Fixkosten und niedrigen variablen Kosten erst ab einer bestimmten Menge rechnen.",
  "verweis": "Modul 03, Abschnitt 3.4 – Wirtschaftlichkeit von IT-Systemen (fixe und variable Kosten)"
},
{
  "id": "M03-711", "pruefungsteil": "AP1", "modul": "M03",
  "thema": "Wirtschaftlichkeit & TCO", "typ": "mehrfach", "schwierigkeit": 2,
  "frage": "Die Ottweiler Fensterbau GmbH sortiert ihre IT-Kosten. Welche Positionen sind variable Kosten? (Mehrere Antworten richtig)",
  "optionen": [
    "Toner, der pro gedruckter Seite verbraucht wird",
    "Cloud-Speicher, der nach tatsächlich belegten Gigabyte abgerechnet wird",
    "Die jährliche Miete für den Serverraum",
    "Supportstunden eines Dienstleisters, die nach Aufwand abgerechnet werden",
    "Die monatliche Pauschale aus dem Wartungsvertrag für die Server"
  ],
  "loesungIndizes": [0, 1, 3],
  "distraktorErklaerungen": [
    "", "",
    "Die Raummiete fällt in gleicher Höhe an, unabhängig davon, wie stark die Server genutzt werden – das sind Fixkosten.",
    "",
    "Eine Pauschale ist gerade dadurch gekennzeichnet, dass sie unabhängig vom tatsächlichen Aufwand gleich hoch bleibt – Fixkosten."
  ],
  "erklaerungKurz": "Variabel sind Toner, nutzungsabhängiger Cloud-Speicher und nach Aufwand abgerechnete Supportstunden. Raummiete und Wartungspauschale bleiben unabhängig von der Nutzung gleich.",
  "erklaerungLang": "Der Prüfstein lautet immer: Ändert sich die Kostenposition, wenn mehr oder weniger genutzt wird?\n\nVARIABEL: Toner (pro Seite), Cloud-Speicher nach Verbrauch (pro Gigabyte), Support nach Aufwand (pro Stunde). Bei doppelter Nutzung verdoppeln sich diese Kosten näherungsweise.\n\nFIX: Raummiete und Wartungspauschale. Sie ändern sich nicht, wenn ein Server stärker ausgelastet wird – erst wenn ein zusätzlicher Raum angemietet oder ein weiterer Wartungsvertrag geschlossen wird, springt der Betrag auf ein neues Niveau (man spricht dann von sprungfixen Kosten).\n\nAchtung bei der Formulierung eines Angebots: „monatlich\" allein sagt noch nichts über fix oder variabel aus. Entscheidend ist, ob der Betrag von der Menge abhängt.",
  "verweis": "Modul 03, Abschnitt 3.4 – Wirtschaftlichkeit von IT-Systemen (fixe und variable Kosten)"
},
{
  "id": "M03-712", "pruefungsteil": "AP1", "modul": "M03",
  "thema": "Wirtschaftlichkeit & TCO", "typ": "mc", "schwierigkeit": 2,
  "frage": "Warum wird bei einem Angebotsvergleich zwischen fixen und variablen Kosten unterschieden?",
  "optionen": [
    "Weil ein Angebot mit hohen Fixkosten und niedrigen variablen Kosten erst ab einer bestimmten Nutzungsmenge günstiger wird als ein Angebot mit umgekehrter Struktur",
    "Weil variable Kosten in der Gesamtkostenbetrachtung unberücksichtigt bleiben",
    "Weil Fixkosten immer den größeren Anteil an den Gesamtkosten ausmachen",
    "Weil nur Angebote mit reinen Fixkosten vergleichbar sind"
  ],
  "loesungIndex": 0,
  "distraktorErklaerungen": [
    "",
    "Variable Kosten gehören zur Gesamtkostenbetrachtung dazu – gerade sie machen den Unterschied bei hoher Nutzung aus.",
    "Welcher Anteil überwiegt, hängt vom Einzelfall ab. Bei nutzungsabhängigen Modellen können die variablen Kosten deutlich überwiegen.",
    "Auch Angebote mit variablen Anteilen sind vergleichbar – man muss dafür lediglich eine Nutzungsmenge annehmen und beide Angebote darauf umrechnen."
  ],
  "erklaerungKurz": "Erst mit einer angenommenen Nutzungsmenge werden zwei unterschiedlich aufgebaute Angebote rechnerisch vergleichbar. Der Punkt, an dem beide gleich teuer sind, heißt Break-even.",
  "erklaerungLang": "Zwei Angebote lassen sich nicht an einer einzelnen Zahl messen, wenn sie unterschiedlich aufgebaut sind.\n\nBEISPIEL: Angebot A kostet 4.800 EUR einmalig und danach nichts mehr. Angebot B kostet 0,25 EUR je Auswertung. Bei 1.000 Auswertungen ist B mit 250 EUR klar günstiger, bei 30.000 Auswertungen mit 7.500 EUR klar teurer.\n\nDer Umschlagpunkt liegt dort, wo beide gleich viel kosten: 4.800 / 0,25 = 19.200 Auswertungen. Unterhalb dieser Menge ist das nutzungsabhängige Angebot günstiger, oberhalb das Kaufangebot.\n\nDeshalb gehört zu jedem sauberen Angebotsvergleich eine begründete Mengenannahme – und im Zweifel eine zweite Rechnung mit einer vorsichtigeren Annahme.",
  "verweis": "Modul 03, Abschnitt 3.4 – Wirtschaftlichkeit von IT-Systemen (Angebotsvergleich)"
},
{
  "id": "M03-713", "pruefungsteil": "AP1", "modul": "M03",
  "thema": "Wirtschaftlichkeit & TCO", "typ": "mc", "schwierigkeit": 1,
  "frage": "Die Kirchlinde Spedition rechnet ihre Auswertungssoftware nach dem Pay-per-Use-Modell ab. Was bedeutet das?",
  "optionen": [
    "Die Kosten richten sich nach der tatsächlichen Nutzung, etwa nach Rechenzeit oder Zahl der Auswertungen",
    "Die Software wird einmalig gekauft und darf danach unbegrenzt genutzt werden",
    "Für eine feste Monatspauschale darf die Software beliebig oft genutzt werden",
    "Die Software ist unentgeltlich, der Quelltext ist frei einsehbar und veränderbar"
  ],
  "loesungIndex": 0,
  "distraktorErklaerungen": [
    "",
    "Das beschreibt den klassischen Kauf einer Lizenz mit einmaliger Zahlung – dort spielt die spätere Nutzungsmenge für den Preis keine Rolle.",
    "Das ist ein Abonnement beziehungsweise eine Flatrate. Der Betrag steht vorab fest und ändert sich mit der Nutzung nicht.",
    "Das beschreibt Open-Source-Software. Der Abrechnungsmodus ist etwas anderes als die Frage, ob der Quelltext offenliegt."
  ],
  "erklaerungKurz": "Pay-per-Use heißt: bezahlt wird, was tatsächlich genutzt wird. Abgerechnet wird über eine messbare Größe wie Rechenzeit, Transaktionen oder Zahl der Auswertungen.",
  "erklaerungLang": "Pay-per-Use ist ein nutzungsabhängiges Preismodell und kommt vor allem bei Cloud-Diensten vor.\n\nABRECHNUNGSGRÖSSEN: Rechenzeit (CPU-Stunden), Speicher (GB pro Monat), übertragene Datenmenge, Zahl der Transaktionen oder Auswertungen, Zahl aktiver Nutzerkonten.\n\nABGRENZUNG zu den anderen Modellen:\n- Kauf: einmalige Zahlung, danach unbegrenzte Nutzung, Kosten unabhängig von der Menge.\n- Miete/Abonnement: fester Betrag je Zeitraum, ebenfalls mengenunabhängig.\n- Pay-per-Use: kein oder nur ein kleiner Grundbetrag, der Hauptteil hängt an der Nutzung.\n\nKOSTENSTRUKTUR: Pay-per-Use verlagert Fixkosten in variable Kosten. Das senkt die Anfangsinvestition, macht die laufenden Kosten aber schwerer planbar – bei dauerhaft hoher Nutzung können die Gesamtkosten über denen eines Kaufs liegen.",
  "verweis": "Modul 03, Abschnitt 3.4 – Wirtschaftlichkeit von IT-Systemen (Pay-per-Use)"
},
{
  "id": "M03-714", "pruefungsteil": "AP1", "modul": "M03",
  "thema": "Wirtschaftlichkeit & TCO", "typ": "mehrfach", "schwierigkeit": 2,
  "frage": "Welche Aussagen über ein Pay-per-Use-Modell treffen zu? (Mehrere Antworten richtig)",
  "optionen": [
    "Die laufenden Kosten schwanken mit der tatsächlichen Nutzung",
    "Eine große Anfangsinvestition ist nicht erforderlich",
    "Der monatlich zu zahlende Betrag steht von vornherein fest",
    "Bei dauerhaft hoher Nutzung können die Gesamtkosten über denen eines Kaufs liegen",
    "Das Modell setzt voraus, dass die Software auf eigener Hardware im Haus betrieben wird"
  ],
  "loesungIndizes": [0, 1, 3],
  "distraktorErklaerungen": [
    "", "",
    "Ein von vornherein feststehender Monatsbetrag kennzeichnet gerade das Abonnement. Bei Pay-per-Use ergibt sich der Betrag erst aus der gemessenen Nutzung.",
    "",
    "Pay-per-Use wird typischerweise für Cloud-Dienste abgerechnet, die beim Anbieter laufen. Ein Betrieb auf eigener Hardware ist keine Voraussetzung."
  ],
  "erklaerungKurz": "Pay-per-Use spart die Anfangsinvestition und passt sich der Nutzung an, macht die Kosten dafür schlechter planbar. Bei hoher Dauernutzung kann es teurer werden als ein Kauf.",
  "erklaerungLang": "Für die Beurteilung eines Pay-per-Use-Angebots sind drei Punkte entscheidend.\n\n1. LIQUIDITÄT: Es fällt keine oder nur eine kleine Anfangszahlung an. Das Kapital bleibt im Unternehmen verfügbar – ein wesentlicher Grund, warum kleinere Betriebe dieses Modell wählen.\n\n2. PLANBARKEIT: Der Vorteil kehrt sich um, sobald budgetiert werden muss. Ein fester Monatsbetrag lässt sich planen, ein nutzungsabhängiger nicht. Viele Anbieter bieten deshalb Kostenobergrenzen oder Warnschwellen an.\n\n3. GESAMTKOSTEN: Über eine lange Laufzeit summieren sich nutzungsabhängige Beträge. Ab dem Break-even-Punkt ist der Kauf günstiger. Deshalb gehört zur Beurteilung immer eine Hochrechnung über die geplante Nutzungsdauer, nicht nur ein Blick auf die erste Rechnung.",
  "verweis": "Modul 03, Abschnitt 3.4 – Wirtschaftlichkeit von IT-Systemen (Pay-per-Use)"
},
{
  "id": "M03-715", "pruefungsteil": "AP1", "modul": "M03",
  "thema": "Wirtschaftlichkeit & TCO", "typ": "mc", "schwierigkeit": 3,
  "frage": "Die Bergedorfer Laborbedarf GmbH vergleicht zwei Angebote für eine Auswertungssoftware. Angebot A: einmaliger Kauf für 4.800,00 EUR, danach keine weiteren Kosten. Angebot B: 0,25 EUR je Auswertung, keine Grundgebühr. Ab welcher Zahl von Auswertungen ist der Kauf günstiger?",
  "optionen": [
    "ab mehr als 19.200 Auswertungen",
    "ab mehr als 1.200 Auswertungen",
    "ab mehr als 12.000 Auswertungen",
    "ab mehr als 24.000 Auswertungen"
  ],
  "loesungIndex": 0,
  "distraktorErklaerungen": [
    "",
    "1.200 ergäbe sich, wenn man 4.800 EUR durch 4 teilt. Der Preis je Auswertung beträgt aber 0,25 EUR, nicht 4,00 EUR.",
    "12.000 ergäbe sich bei einem Preis von 0,40 EUR je Auswertung. Mit 0,25 EUR liegt der Umschlagpunkt höher.",
    "24.000 ergäbe sich bei einem Preis von 0,20 EUR je Auswertung. Der Umschlagpunkt liegt bei 0,25 EUR entsprechend niedriger."
  ],
  "erklaerungKurz": "4.800,00 EUR / 0,25 EUR je Auswertung = 19.200 Auswertungen. Bei genau 19.200 kosten beide Angebote gleich viel; darüber ist der Kauf günstiger.",
  "erklaerungLang": "RECHENWEG\nGesucht ist der Break-even, also die Menge x, bei der beide Angebote gleich teuer sind.\n\nAngebot A: Kosten = 4.800,00 EUR (unabhängig von x)\nAngebot B: Kosten = 0,25 EUR × x\n\nGleichsetzen:\n4.800,00 = 0,25 × x\nx = 4.800,00 / 0,25\nx = 19.200 Auswertungen\n\nPROBE: 0,25 × 19.200 = 4.800,00 EUR – beide Angebote kosten hier dasselbe.\n\nDEUTUNG: Bis 19.200 Auswertungen ist das nutzungsabhängige Angebot B günstiger, ab der 19.201. Auswertung das Kaufangebot A. Wer im Betrieb mit etwa 400 Auswertungen im Monat rechnet, erreicht diesen Punkt erst nach vier Jahren – dann ist zusätzlich zu prüfen, ob die Software so lange überhaupt eingesetzt wird.",
  "verweis": "Modul 03, Abschnitt 3.4 – Wirtschaftlichkeit von IT-Systemen (Angebotsvergleich, Break-even)"
},
{
  "id": "M03-716", "pruefungsteil": "AP1", "modul": "M03",
  "thema": "Wirtschaftlichkeit & TCO", "typ": "mc", "schwierigkeit": 2,
  "frage": "Was beschreibt der Begriff Wertschöpfung in einem Unternehmen?",
  "optionen": [
    "Den Wertzuwachs, den das Unternehmen durch die eigene Leistung gegenüber den bezogenen Vorleistungen erzielt",
    "Den gesamten Umsatz eines Geschäftsjahres",
    "Die Summe aller Anschaffungskosten für Betriebsmittel",
    "Den Betrag, der nach Abzug der Steuern als Gewinn verbleibt"
  ],
  "loesungIndex": 0,
  "distraktorErklaerungen": [
    "",
    "Der Umsatz enthält auch den Wert der eingekauften Vorleistungen. Die Wertschöpfung ergibt sich erst, wenn man diese abzieht.",
    "Anschaffungskosten für Betriebsmittel sind eine Investitionsgröße und sagen nichts darüber aus, welchen Wert das Unternehmen selbst hinzufügt.",
    "Das beschreibt den Jahresüberschuss. Die Wertschöpfung ist größer, denn sie enthält unter anderem auch die Löhne und Gehälter."
  ],
  "erklaerungKurz": "Wertschöpfung = Gesamtleistung minus Vorleistungen. Sie misst, welchen Wert ein Unternehmen selbst hinzufügt.",
  "erklaerungLang": "Die Wertschöpfung beantwortet die Frage: Was hat das Unternehmen aus dem Eingekauften gemacht?\n\nBERECHNUNG: Wertschöpfung = Gesamtleistung − Vorleistungen\nVorleistungen sind alle von außen bezogenen Güter und Dienste: Handelsware, Material, Fremdleistungen, Energie, Lizenzen.\n\nBEISPIEL IT-Systemhaus: Es verkauft für 900.000 EUR Leistungen und zahlt 540.000 EUR an Vorlieferanten für Hardware, Software und Fremdmontage. Die Wertschöpfung beträgt 360.000 EUR – das ist der Teil, der auf die eigene Arbeit entfällt.\n\nWOFÜR WIRD SIE VERWENDET: Aus der Wertschöpfung werden Löhne und Gehälter, Zinsen, Steuern und der verbleibende Gewinn bezahlt. Deshalb ist sie eine aussagekräftigere Größe als der Umsatz, wenn es um die wirtschaftliche Leistung eines Betriebs geht.\n\nIT-BEZUG: Ein Systemhaus, das überwiegend Hardware durchhandelt, hat einen hohen Umsatz bei geringer Wertschöpfung. Ein Haus mit Beratungs- und Serviceschwerpunkt hat weniger Umsatz, aber eine höhere Wertschöpfung.",
  "verweis": "Modul 03, Abschnitt 3.4 – Wirtschaftlichkeit von IT-Systemen (Wertschöpfung)"
},
{
  "id": "M03-717", "pruefungsteil": "AP1", "modul": "M03",
  "thema": "Wirtschaftlichkeit & TCO", "typ": "mc", "schwierigkeit": 3,
  "frage": "Das IT-Systemhaus Denkendorfer Netzwerktechnik erzielt in einem Geschäftsjahr eine Gesamtleistung von 900.000,00 EUR. Für Hardware, Software und Fremdleistungen zahlt es 540.000,00 EUR an Vorlieferanten. Wie hoch ist die Wertschöpfung?",
  "optionen": [
    "360.000,00 EUR",
    "540.000,00 EUR",
    "900.000,00 EUR",
    "1.440.000,00 EUR"
  ],
  "loesungIndex": 0,
  "distraktorErklaerungen": [
    "",
    "540.000,00 EUR sind die Vorleistungen selbst, also der von außen bezogene Anteil – nicht der selbst geschaffene Wert.",
    "900.000,00 EUR sind die Gesamtleistung. Davon müssen die Vorleistungen noch abgezogen werden.",
    "1.440.000,00 EUR entstünde durch Addition statt Subtraktion. Vorleistungen werden abgezogen, nicht hinzugerechnet."
  ],
  "erklaerungKurz": "900.000,00 EUR − 540.000,00 EUR = 360.000,00 EUR Wertschöpfung.",
  "erklaerungLang": "RECHENWEG\nWertschöpfung = Gesamtleistung − Vorleistungen\nWertschöpfung = 900.000,00 EUR − 540.000,00 EUR = 360.000,00 EUR\n\nEINORDNUNG: Die Wertschöpfungsquote beträgt hier 360.000 / 900.000 = 40 Prozent. Von jedem eingenommenen Euro entfallen also 40 Cent auf die eigene Leistung und 60 Cent auf Zugekauftes.\n\nWARUM DAS ZÄHLT: Aus diesen 360.000,00 EUR müssen Löhne, Gehälter, Zinsen, Steuern und der Gewinn bestritten werden. Wer nur auf den Umsatz von 900.000,00 EUR schaut, überschätzt den wirtschaftlichen Spielraum des Betriebs erheblich.\n\nTYPISCHER FEHLER in der Prüfung: Umsatz und Wertschöpfung gleichzusetzen. Ein reiner Hardwarehändler kann Millionenumsätze bei sehr geringer Wertschöpfung machen.",
  "verweis": "Modul 03, Abschnitt 3.4 – Wirtschaftlichkeit von IT-Systemen (Wertschöpfung)"
},
]

M07 = [
{
  "id": "M07-707", "pruefungsteil": "AP1", "modul": "M07",
  "thema": "Aufbauorganisation & Vollmachten", "typ": "mc", "schwierigkeit": 1,
  "frage": "Was kennzeichnet eine Matrixorganisation?",
  "optionen": [
    "Mitarbeiter erhalten Weisungen aus zwei Richtungen – von der Fachabteilung und von der Projektleitung",
    "Jeder Mitarbeiter hat genau einen Vorgesetzten, von dem alle Weisungen kommen",
    "Die Leitung besteht ausschließlich aus beratenden Stellen ohne Weisungsrecht",
    "Es gibt keine dauerhaften Abteilungen, jede Aufgabe wird intern neu ausgeschrieben"
  ],
  "loesungIndex": 0,
  "distraktorErklaerungen": [
    "",
    "Genau ein Vorgesetzter je Mitarbeiter kennzeichnet die Einlinienorganisation. Die Matrix durchbricht dieses Prinzip bewusst.",
    "Beratende Stellen ohne Weisungsrecht sind Stabsstellen. Eine Organisation kann nicht nur aus ihnen bestehen – irgendwo muss die Weisungsbefugnis liegen.",
    "Das beschreibt keine der klassischen Aufbauorganisationen. In der Matrix bleiben die Fachabteilungen dauerhaft bestehen."
  ],
  "erklaerungKurz": "In der Matrixorganisation überlagern sich zwei Weisungsstränge: die Fachlinie (zum Beispiel IT-Abteilung) und die Projekt- oder Produktlinie. Mitarbeiter haben dadurch zwei Vorgesetzte.",
  "erklaerungLang": "Die Matrixorganisation entsteht, wenn zwei Gliederungsprinzipien gleichzeitig angewandt werden.\n\nAUFBAU: Senkrecht stehen die Fachabteilungen (Entwicklung, Systemadministration, Support), waagerecht die Projekte oder Produkte. Ein Systemadministrator gehört fachlich zur IT-Abteilung und arbeitet zugleich im Rollout-Projekt mit – er hat einen Fachvorgesetzten und einen Projektleiter.\n\nWAS DAFÜR SPRICHT: Fachwissen und Projektsicht fließen in dieselbe Entscheidung ein. Spezialisten lassen sich flexibel mehreren Projekten zuordnen, statt sie fest zu binden.\n\nWAS DAGEGEN SPRICHT: Das Prinzip der Einheit der Auftragserteilung ist durchbrochen. Erteilen Fachvorgesetzter und Projektleiter widersprüchliche Weisungen, ist nicht von vornherein geregelt, wer Vorrang hat. Der Abstimmungsaufwand ist höher als in einer Einlinienorganisation, und Konflikte müssen aktiv geschlichtet werden – üblicherweise durch eine vorab festgelegte Kompetenzregelung.",
  "verweis": "Modul 07, Abschnitt 7.4 – Aufbauorganisation (Matrixorganisation)"
},
{
  "id": "M07-708", "pruefungsteil": "AP1", "modul": "M07",
  "thema": "Aufbauorganisation & Vollmachten", "typ": "mehrfach", "schwierigkeit": 2,
  "frage": "Welche Aussagen über die Matrixorganisation treffen zu? (Mehrere Antworten richtig)",
  "optionen": [
    "Fachwissen und Projektsicht wirken bei einer Entscheidung zusammen",
    "Bei widersprüchlichen Weisungen ist nicht von vornherein geregelt, wer Vorrang hat",
    "Der Abstimmungsaufwand ist höher als in einer Einlinienorganisation",
    "Das Prinzip der Einheit der Auftragserteilung bleibt gewahrt",
    "Die Fachabteilungen werden durch die Projektstruktur ersetzt"
  ],
  "loesungIndizes": [0, 1, 2],
  "distraktorErklaerungen": [
    "", "", "",
    "Die Einheit der Auftragserteilung wird gerade durchbrochen – das ist das Wesensmerkmal der Matrix. Gewahrt bleibt sie in der Einlinienorganisation.",
    "Die Fachabteilungen bleiben bestehen. Die Projektstruktur wird ihnen überlagert, sie ersetzt sie nicht."
  ],
  "erklaerungKurz": "Die Matrix bringt Fach- und Projektsicht zusammen, erkauft das aber mit Weisungskonflikten und höherem Abstimmungsaufwand. Beide Strukturen bestehen nebeneinander.",
  "erklaerungLang": "Die drei zutreffenden Aussagen beschreiben genau den Handel, den man mit einer Matrix eingeht.\n\nDAFÜR: Wer in einem Rollout-Projekt über die Auswahl eines Clients entscheidet, braucht die Fachsicht der Systemadministration UND die Terminsicht der Projektleitung. In der Matrix sitzen beide Stimmen strukturell am Tisch, statt dass eine nachträglich informiert wird.\n\nDAGEGEN: Weisungskonflikte sind kein Betriebsunfall, sondern in der Struktur angelegt. Erteilt der Fachvorgesetzte die Weisung, zuerst ein Sicherheitsupdate einzuspielen, und der Projektleiter die Weisung, zuerst die Testumgebung aufzubauen, hilft nur eine vorab getroffene Kompetenzregelung. Ohne sie landet die Entscheidung beim Mitarbeiter, der sie nicht treffen sollte.\n\nZUR ABGRENZUNG: In der Einlinienorganisation kommt jede Weisung über genau einen Dienstweg. Das ist eindeutig, aber langsam. Die Matrix tauscht Eindeutigkeit gegen Geschwindigkeit und Fachnähe.",
  "verweis": "Modul 07, Abschnitt 7.4 – Aufbauorganisation (Matrixorganisation)"
},
{
  "id": "M07-709", "pruefungsteil": "AP1", "modul": "M07",
  "thema": "Aufbauorganisation & Vollmachten", "typ": "mc", "schwierigkeit": 3,
  "frage": "Bei der Vellmarer Anlagenbau GmbH berichtet eine Systemadministratorin fachlich an die IT-Leitung und ist zugleich für die Dauer der Client-Rollouts der jeweiligen Projektleitung unterstellt. Welche Organisationsform liegt vor?",
  "optionen": [
    "Matrixorganisation",
    "Einlinienorganisation",
    "Mehrlinienorganisation",
    "Stabliniensystem"
  ],
  "loesungIndex": 0,
  "distraktorErklaerungen": [
    "",
    "In der Einlinienorganisation gibt es genau einen Vorgesetzten und genau einen Dienstweg. Hier sind es zwei Weisungsstränge.",
    "Auch die Mehrlinienorganisation kennt mehrere Vorgesetzte, dort sind es jedoch mehrere FACHvorgesetzte für verschiedene Sachgebiete (Funktionsmeisterprinzip). Hier überlagert eine zweite, projektbezogene Dimension die Fachlinie – das kennzeichnet die Matrix.",
    "Im Stabliniensystem gibt es zusätzlich zur Linie beratende Stabsstellen OHNE Weisungsbefugnis. Die Projektleitung erteilt hier aber echte Weisungen."
  ],
  "erklaerungKurz": "Zwei Weisungsstränge aus zwei verschiedenen Dimensionen – Fachabteilung und Projekt – kennzeichnen die Matrixorganisation.",
  "erklaerungLang": "Die Aufgabe verlangt, vier ähnliche Formen sauber auseinanderzuhalten.\n\nEINLINIE: ein Vorgesetzter, ein Dienstweg. Eindeutig, aber lange Wege.\n\nMEHRLINIE: mehrere Vorgesetzte, die aber alle FACHlich zuständig sind – einer für Betrieb, einer für Sicherheit, einer für Beschaffung. Alle stehen in derselben Dimension.\n\nMATRIX: zwei verschiedene Dimensionen überlagern sich, klassisch Funktion und Projekt. Genau das steht im Fall: fachlich IT-Leitung, projektbezogen Projektleitung, und zwar befristet auf die Dauer des Rollouts.\n\nSTABLINIE: Einlinie plus beratende Stabsstellen ohne Weisungsrecht.\n\nDAS UNTERSCHEIDUNGSMERKMAL zwischen Mehrlinie und Matrix ist also nicht die Zahl der Vorgesetzten, sondern ob sie aus derselben oder aus zwei verschiedenen Gliederungsdimensionen kommen.",
  "verweis": "Modul 07, Abschnitt 7.4 – Aufbauorganisation (Abgrenzung der Organisationsformen)"
},
{
  "id": "M07-710", "pruefungsteil": "AP1", "modul": "M07",
  "thema": "Aufbauorganisation & Vollmachten", "typ": "mc", "schwierigkeit": 1,
  "frage": "Wer kann in einem Handelsunternehmen Prokura erteilen?",
  "optionen": [
    "Nur der Inhaber des Handelsgeschäfts oder sein gesetzlicher Vertreter, und zwar durch ausdrückliche Erklärung",
    "Jeder bereits bestellte Prokurist, der die Prokura an weitere Mitarbeiter weitergibt",
    "Die Leitung der Personalabteilung im Rahmen der üblichen Personalentscheidungen",
    "Niemand gesondert – sie entsteht von selbst, sobald jemand längere Zeit eigenverantwortlich einkauft"
  ],
  "loesungIndex": 0,
  "distraktorErklaerungen": [
    "",
    "Die Prokura ist nicht übertragbar (§ 52 Abs. 2 HGB). Ein Prokurist kann sie deshalb nicht an andere weitergeben.",
    "Die Erteilung ist dem Inhaber oder seinem gesetzlichen Vertreter vorbehalten (§ 48 Abs. 1 HGB) und keine gewöhnliche Personalentscheidung.",
    "Eine Prokura entsteht nicht stillschweigend durch Zeitablauf. § 48 Abs. 1 HGB verlangt eine ausdrückliche Erklärung."
  ],
  "erklaerungKurz": "Nach § 48 Abs. 1 HGB kann die Prokura nur der Inhaber des Handelsgeschäfts oder sein gesetzlicher Vertreter erteilen, und nur durch ausdrückliche Erklärung.",
  "erklaerungLang": "Die Prokura ist die weitreichendste rechtsgeschäftliche Vollmacht des Handelsrechts. Weil sie so weit reicht, knüpft das Gesetz die Erteilung an enge Voraussetzungen.\n\nWER (§ 48 Abs. 1 HGB): nur der Inhaber des Handelsgeschäfts oder sein gesetzlicher Vertreter – bei einer GmbH also die Geschäftsführung, nicht die Abteilungsleitung.\n\nWIE (§ 48 Abs. 1 HGB): ausdrücklich. Eine stillschweigende oder durch schlüssiges Verhalten erteilte Prokura gibt es nicht. Sie kann mehreren Personen gemeinschaftlich erteilt werden – das ist die Gesamtprokura.\n\nNICHT ÜBERTRAGBAR (§ 52 Abs. 2 HGB): Der Prokurist kann seine Prokura nicht an andere weiterreichen. Er kann allerdings im Rahmen seiner Befugnisse eine gewöhnliche Vollmacht erteilen.\n\nJEDERZEIT WIDERRUFLICH (§ 52 Abs. 1 HGB): unabhängig davon, was im Arbeitsvertrag steht. Der Widerruf betrifft nur die Vollmacht, nicht das Anstellungsverhältnis.\n\nHANDELSREGISTER (§ 53 Abs. 1 HGB): Die Erteilung ist zur Eintragung anzumelden. Die Eintragung ist jedoch nur DEKLARATORISCH – die Prokura wirkt bereits mit der Erteilung, nicht erst mit der Eintragung.",
  "verweis": "Modul 07, Abschnitt 7.4 – Vollmachten (Prokura, §§ 48 ff. HGB)"
},
{
  "id": "M07-711", "pruefungsteil": "AP1", "modul": "M07",
  "thema": "Aufbauorganisation & Vollmachten", "typ": "mc", "schwierigkeit": 2,
  "frage": "Ein Prokurist der Ahrensfelder Kältetechnik GmbH möchte ein Betriebsgrundstück des Unternehmens verkaufen. Was gilt?",
  "optionen": [
    "Er benötigt dafür eine besonders erteilte Befugnis – die Prokura allein deckt die Veräußerung von Grundstücken nicht",
    "Die Prokura deckt Grundstücksgeschäfte in vollem Umfang mit ab",
    "Er darf den Verkauf abschließen, muss ihn dem Inhaber aber innerhalb eines Monats nachträglich anzeigen",
    "Die Prokura muss dafür zuvor im Handelsregister gelöscht und neu eingetragen werden"
  ],
  "loesungIndex": 0,
  "distraktorErklaerungen": [
    "",
    "§ 49 Abs. 2 HGB nimmt die Veräußerung und Belastung von Grundstücken ausdrücklich aus dem gesetzlichen Umfang der Prokura heraus.",
    "Eine nachträgliche Anzeigepflicht anstelle der vorherigen Befugnis sieht das Gesetz nicht vor. Ohne besondere Befugnis fehlt bereits die Vertretungsmacht.",
    "Eine Löschung und Neueintragung ist nicht vorgesehen. Erforderlich ist die besondere Befugnis nach § 49 Abs. 2 HGB, die zusätzlich zur Prokura erteilt wird."
  ],
  "erklaerungKurz": "Nach § 49 Abs. 2 HGB ist der Prokurist zur Veräußerung und Belastung von Grundstücken nur ermächtigt, wenn ihm diese Befugnis besonders erteilt ist.",
  "erklaerungLang": "Der Umfang der Prokura ist gesetzlich festgelegt und kann Dritten gegenüber nicht wirksam eingeschränkt werden – mit einer im Gesetz selbst geregelten Ausnahme.\n\nGRUNDSATZ (§ 49 Abs. 1 HGB): Die Prokura ermächtigt zu allen Arten von gerichtlichen und außergerichtlichen Geschäften und Rechtshandlungen, die der Betrieb EINES Handelsgewerbes mit sich bringt. Beachtenswert ist die Formulierung „eines\" – es kommt nicht darauf an, was in genau diesem Betrieb üblich ist. Der Prokurist eines IT-Systemhauses könnte danach auch ein branchenfremdes Geschäft wirksam abschließen.\n\nAUSNAHME (§ 49 Abs. 2 HGB): Grundstücke veräußern oder belasten darf der Prokurist nur, wenn ihm diese Befugnis BESONDERS erteilt ist. In der Praxis wird das als sogenannte Immobilienklausel mit ins Handelsregister eingetragen.\n\nFOLGE OHNE BESONDERE BEFUGNIS: Es fehlt die Vertretungsmacht. Der Vertrag ist zunächst schwebend unwirksam und wird nur wirksam, wenn der Inhaber ihn genehmigt.\n\nMERKHILFE: Prokura ist sehr weit – aber sie hört beim Grundstück auf.",
  "verweis": "Modul 07, Abschnitt 7.4 – Vollmachten (Umfang der Prokura, § 49 HGB)"
},
{
  "id": "M07-712", "pruefungsteil": "AP1", "modul": "M07",
  "thema": "Aufbauorganisation & Vollmachten", "typ": "mehrfach", "schwierigkeit": 2,
  "frage": "Welche Aussagen über die Prokura treffen zu? (Mehrere Antworten richtig)",
  "optionen": [
    "Sie muss ausdrücklich erteilt werden",
    "Sie ist zur Eintragung in das Handelsregister anzumelden",
    "Sie kann jederzeit widerrufen werden",
    "Der Prokurist kann sie auf einen anderen Mitarbeiter übertragen",
    "Sie wird erst mit der Eintragung im Handelsregister wirksam"
  ],
  "loesungIndizes": [0, 1, 2],
  "distraktorErklaerungen": [
    "", "", "",
    "Nach § 52 Abs. 2 HGB ist die Prokura nicht übertragbar. Der Prokurist kann sie nicht weitergeben.",
    "Die Eintragung ist nach § 53 Abs. 1 HGB zwar anzumelden, wirkt aber nur deklaratorisch. Die Prokura ist bereits mit der ausdrücklichen Erteilung wirksam."
  ],
  "erklaerungKurz": "Ausdrückliche Erteilung (§ 48 Abs. 1), Anmeldung zum Handelsregister (§ 53 Abs. 1) und jederzeitige Widerruflichkeit (§ 52 Abs. 1) treffen zu. Nicht übertragbar, und die Eintragung ist nur deklaratorisch.",
  "erklaerungLang": "Die beiden Distraktoren treffen genau die zwei häufigsten Irrtümer zur Prokura.\n\nIRRTUM 1 – ÜBERTRAGBARKEIT: Wer weitreichende Vollmacht hat, darf sie nicht automatisch weiterreichen. § 52 Abs. 2 HGB stellt klar, dass die Prokura nicht übertragbar ist. Der Prokurist kann lediglich im Rahmen seiner eigenen Befugnisse eine gewöhnliche rechtsgeschäftliche Vollmacht erteilen – das ist aber keine Prokura.\n\nIRRTUM 2 – KONSTITUTIVE EINTRAGUNG: Die Anmeldung zum Handelsregister ist nach § 53 Abs. 1 HGB Pflicht, die Eintragung selbst wirkt jedoch nur DEKLARATORISCH, also rein bekundend. Wirksam wird die Prokura schon mit der ausdrücklichen Erklärung des Inhabers. Das ist praktisch bedeutsam: Zwischen Erteilung und Eintragung kann der Prokurist bereits wirksam handeln.\n\nZUM WIDERRUF: § 52 Abs. 1 HGB erlaubt ihn jederzeit und ohne Grund. Davon zu trennen ist das Anstellungsverhältnis – der Widerruf der Prokura ist keine Kündigung, und ein Anspruch auf Fortbestand der Prokura lässt sich vertraglich nicht wirksam begründen.",
  "verweis": "Modul 07, Abschnitt 7.4 – Vollmachten (Prokura, §§ 48, 52, 53 HGB)"
},
{
  "id": "M07-713", "pruefungsteil": "AP1", "modul": "M07",
  "thema": "Aufbauorganisation & Vollmachten", "typ": "mc", "schwierigkeit": 1,
  "frage": "Wozu berechtigt eine allgemeine Handlungsvollmacht nach § 54 HGB?",
  "optionen": [
    "Zu den Geschäften, die der Betrieb eines derartigen Handelsgewerbes gewöhnlich mit sich bringt",
    "Zu allen Geschäften, die der Betrieb irgendeines Handelsgewerbes überhaupt mit sich bringen kann",
    "Ausschließlich zum Abschluss und zur Beendigung von Arbeitsverträgen",
    "Nur zu Geschäften, die zuvor im Einzelfall schriftlich genehmigt worden sind"
  ],
  "loesungIndex": 0,
  "distraktorErklaerungen": [
    "",
    "Das beschreibt den Umfang der PROKURA nach § 49 Abs. 1 HGB. Die Handlungsvollmacht ist enger und an das gewöhnliche Geschäft dieser Art von Betrieb gebunden.",
    "Auf Arbeitsverträge ist die Handlungsvollmacht nicht beschränkt. Sie erfasst das gewöhnliche Geschäft des Betriebs insgesamt.",
    "Eine Einzelgenehmigung wäre keine Vollmacht mehr, sondern jeweils eine neue Bevollmächtigung im Einzelfall."
  ],
  "erklaerungKurz": "Nach § 54 Abs. 1 HGB erstreckt sich die Handlungsvollmacht auf die Geschäfte, die der Betrieb eines DERARTIGEN Handelsgewerbes GEWÖHNLICH mit sich bringt.",
  "erklaerungLang": "Handlungsvollmacht und Prokura unterscheiden sich vor allem im Umfang – und der Unterschied steckt in zwei Wörtern des Gesetzestextes.\n\nPROKURA (§ 49 Abs. 1 HGB): Geschäfte, die der Betrieb EINES Handelsgewerbes mit sich bringt. Der Maßstab ist branchenunabhängig und damit sehr weit.\n\nHANDLUNGSVOLLMACHT (§ 54 Abs. 1 HGB): Geschäfte, die der Betrieb eines DERARTIGEN Handelsgewerbes GEWÖHNLICH mit sich bringt. Zwei Einschränkungen also: es zählt die konkrete Branche, und es zählt nur das Gewöhnliche.\n\nBEISPIEL: Der Handlungsbevollmächtigte eines IT-Systemhauses kann Hardware bestellen und Serviceaufträge annehmen. Den Kauf eines Lieferwagens deckt seine Vollmacht schon nicht mehr selbstverständlich, weil das für ein Systemhaus kein gewöhnliches Geschäft ist.\n\nARTEN: allgemeine Handlungsvollmacht (gesamter Betrieb), Artvollmacht (bestimmte Art von Geschäften, etwa Einkauf), Spezialvollmacht (ein einzelnes Geschäft).\n\nERTEILUNG: formfrei, auch stillschweigend möglich, und keine Eintragung im Handelsregister – anders als bei der Prokura. Gezeichnet wird üblicherweise mit dem Zusatz „i. V.\", bei der Prokura mit „ppa.\".",
  "verweis": "Modul 07, Abschnitt 7.4 – Vollmachten (Handlungsvollmacht, § 54 HGB)"
},
{
  "id": "M07-714", "pruefungsteil": "AP1", "modul": "M07",
  "thema": "Aufbauorganisation & Vollmachten", "typ": "mehrfach", "schwierigkeit": 3,
  "frage": "Welche Geschäfte darf ein Handlungsbevollmächtigter nach § 54 Abs. 2 HGB nur vornehmen, wenn ihm diese Befugnis besonders erteilt worden ist? (Mehrere Antworten richtig)",
  "optionen": [
    "Grundstücke veräußern oder belasten",
    "Wechselverbindlichkeiten eingehen",
    "Darlehen aufnehmen",
    "Prozesse führen",
    "Waren des üblichen Sortiments bestellen",
    "Anfragen von Bestandskunden beantworten"
  ],
  "loesungIndizes": [0, 1, 2, 3],
  "distraktorErklaerungen": [
    "", "", "", "",
    "Die Bestellung üblicher Ware gehört zum gewöhnlichen Geschäft und ist damit bereits von der allgemeinen Handlungsvollmacht gedeckt.",
    "Die Beantwortung von Kundenanfragen ist gewöhnliches Tagesgeschäft und bedarf keiner besonderen Befugnis."
  ],
  "erklaerungKurz": "§ 54 Abs. 2 HGB nennt vier Geschäfte, die eine besondere Befugnis erfordern: Grundstücke veräußern oder belasten, Wechselverbindlichkeiten eingehen, Darlehen aufnehmen und Prozesse führen.",
  "erklaerungLang": "§ 54 Abs. 2 HGB listet abschließend vier Geschäftsarten auf, die aus der allgemeinen Handlungsvollmacht herausgenommen sind:\n\n1. Grundstücke veräußern oder belasten\n2. Wechselverbindlichkeiten eingehen\n3. Darlehen aufnehmen\n4. Prozesse führen\n\nWAS DIESE VIER GEMEINSAM HABEN: Sie greifen besonders tief in die Vermögenslage des Unternehmens ein oder binden es langfristig. Der Gesetzgeber verlangt deshalb eine bewusste, gesonderte Entscheidung des Vollmachtgebers.\n\nVERGLEICH ZUR PROKURA: Dort ist nur EIN Geschäft ausgenommen – die Veräußerung und Belastung von Grundstücken (§ 49 Abs. 2 HGB). Darlehen aufnehmen und Prozesse führen darf der Prokurist ohne besondere Befugnis. Das zeigt noch einmal, wie viel weiter die Prokura reicht.\n\nSCHUTZ DES GESCHÄFTSVERKEHRS (§ 54 Abs. 3 HGB): Sonstige Beschränkungen der Handlungsvollmacht muss ein Dritter nur gegen sich gelten lassen, wenn er sie kannte oder kennen musste. Eine intern vereinbarte Wertgrenze wirkt gegenüber einem gutgläubigen Lieferanten also nicht.",
  "verweis": "Modul 07, Abschnitt 7.4 – Vollmachten (Umfang der Handlungsvollmacht, § 54 Abs. 2 HGB)"
},
{
  "id": "M07-715", "pruefungsteil": "AP1", "modul": "M07",
  "thema": "Aufbauorganisation & Vollmachten", "typ": "mc", "schwierigkeit": 3,
  "frage": "Worin unterscheiden sich Prokura und Handlungsvollmacht?",
  "optionen": [
    "Der Umfang der Prokura ist gesetzlich festgelegt und ihre Erteilung ist zur Eintragung ins Handelsregister anzumelden; für die Handlungsvollmacht gilt beides nicht",
    "Beide sind zur Eintragung in das Handelsregister anzumelden, unterscheiden sich aber im Umfang",
    "Die Handlungsvollmacht reicht im Umfang weiter als die Prokura",
    "Die Prokura kann formlos und auch stillschweigend erteilt werden, die Handlungsvollmacht dagegen nur schriftlich"
  ],
  "loesungIndex": 0,
  "distraktorErklaerungen": [
    "",
    "Nur die Prokura ist nach § 53 Abs. 1 HGB zur Eintragung anzumelden. Für die Handlungsvollmacht besteht keine Registerpflicht.",
    "Es ist umgekehrt: Die Prokura reicht weiter. Sie umfasst die Geschäfte eines Handelsgewerbes überhaupt, die Handlungsvollmacht nur die gewöhnlichen Geschäfte eines derartigen Betriebs.",
    "Es ist umgekehrt: Die Prokura verlangt nach § 48 Abs. 1 HGB eine ausdrückliche Erklärung, während die Handlungsvollmacht formfrei und auch stillschweigend erteilt werden kann."
  ],
  "erklaerungKurz": "Die Prokura ist im Umfang gesetzlich bestimmt, verlangt ausdrückliche Erteilung durch den Inhaber und ist zum Handelsregister anzumelden. Die Handlungsvollmacht ist enger, formfrei und nicht eintragungspflichtig.",
  "erklaerungLang": "GEGENÜBERSTELLUNG\n\nUMFANG\n- Prokura: alle Geschäfte, die der Betrieb EINES Handelsgewerbes mit sich bringt (§ 49 Abs. 1 HGB). Ausgenommen nur: Grundstücke veräußern/belasten (§ 49 Abs. 2 HGB).\n- Handlungsvollmacht: nur die GEWÖHNLICHEN Geschäfte eines DERARTIGEN Betriebs (§ 54 Abs. 1 HGB). Ausgenommen: Grundstücke, Wechselverbindlichkeiten, Darlehen, Prozesse (§ 54 Abs. 2 HGB).\n\nERTEILUNG\n- Prokura: nur durch den Inhaber oder seinen gesetzlichen Vertreter, ausdrücklich (§ 48 Abs. 1 HGB).\n- Handlungsvollmacht: formfrei, auch stillschweigend, und auch durch einen Prokuristen im Rahmen seiner Befugnisse.\n\nHANDELSREGISTER\n- Prokura: anzumelden (§ 53 Abs. 1 HGB), Eintragung wirkt deklaratorisch.\n- Handlungsvollmacht: keine Anmeldung, keine Eintragung.\n\nZEICHNUNG\n- Prokura: „ppa.\" (per procura)\n- Handlungsvollmacht: „i. V.\" (in Vollmacht)\n\nPRAKTISCHE FOLGE: Wer als Lieferant wissen will, ob sein Gegenüber wirksam vertreten darf, kann die Prokura im Handelsregister nachschlagen. Bei einer Handlungsvollmacht geht das nicht – dort schützt ihn § 54 Abs. 3 HGB, wonach interne Beschränkungen nur bei Kenntnis oder Kennenmüssen gegen ihn wirken.",
  "verweis": "Modul 07, Abschnitt 7.4 – Vollmachten (Abgrenzung Prokura / Handlungsvollmacht)"
},
{
  "id": "M07-716", "pruefungsteil": "AP1", "modul": "M07",
  "thema": "Vertragsarten", "typ": "mc", "schwierigkeit": 1,
  "frage": "Die Wolfenhauser Physiopraxis mietet für zwei Jahre zehn Notebooks bei einem IT-Dienstleister. Was kennzeichnet einen Mietvertrag?",
  "optionen": [
    "Der Vermieter überlässt die Sache für eine bestimmte Zeit zum Gebrauch, der Mieter zahlt dafür die vereinbarte Miete",
    "Das Eigentum an der Sache geht gegen Zahlung des Kaufpreises auf den Erwerber über",
    "Der Auftragnehmer schuldet die Herbeiführung eines bestimmten Erfolgs",
    "Der Auftragnehmer schuldet ein Tätigwerden, ohne für einen bestimmten Erfolg einzustehen"
  ],
  "loesungIndex": 0,
  "distraktorErklaerungen": [
    "",
    "Das beschreibt den Kaufvertrag (§ 433 BGB). Beim Mietvertrag wechselt das Eigentum gerade nicht.",
    "Das beschreibt den Werkvertrag (§ 631 BGB), etwa die Installation eines Netzwerks mit abnahmefähigem Ergebnis.",
    "Das beschreibt den Dienstvertrag (§ 611 BGB), etwa eine nach Stunden abgerechnete IT-Beratung."
  ],
  "erklaerungKurz": "Nach § 535 BGB überlässt der Vermieter dem Mieter den Gebrauch der Mietsache während der Mietzeit; der Mieter zahlt dafür die vereinbarte Miete. Das Eigentum bleibt beim Vermieter.",
  "erklaerungLang": "Der Mietvertrag ist ein Gebrauchsüberlassungsvertrag auf Zeit.\n\nHAUPTPFLICHTEN (§ 535 BGB):\n- Der Vermieter überlässt die Mietsache in einem zum vertragsgemäßen Gebrauch geeigneten Zustand und ERHÄLT sie während der Mietzeit in diesem Zustand. Die Instandhaltung liegt also grundsätzlich bei ihm.\n- Der Mieter zahlt die vereinbarte Miete.\n\nENTSCHEIDEND: Das Eigentum wechselt nicht. Nach Ablauf der Mietzeit geht die Sache zurück.\n\nABGRENZUNG ZU DEN ANDEREN VERTRAGSARTEN\n- Kaufvertrag (§ 433 BGB): Eigentumsübergang gegen Kaufpreis, dauerhaft.\n- Werkvertrag (§ 631 BGB): geschuldet ist ein ERFOLG, es gibt eine Abnahme. Beispiel: ein fertig eingerichtetes und funktionierendes Netzwerk.\n- Dienstvertrag (§ 611 BGB): geschuldet ist die TÄTIGKEIT, kein Erfolg. Beispiel: laufende IT-Betreuung nach Stundensatz.\n- Leasing: wirtschaftlich mietähnlich, rechtlich aber ein eigener Vertragstyp; häufig mit Kaufoption am Ende und mit auf den Leasingnehmer verlagerter Instandhaltung.\n\nMERKSATZ für die Prüfung: Wer schuldet was? Sache auf Zeit = Miete, Sache auf Dauer = Kauf, Erfolg = Werk, Tätigkeit = Dienst.",
  "verweis": "Modul 07, Abschnitt 7.1 – Vertragsarten (Mietvertrag, § 535 BGB)"
},
{
  "id": "M07-717", "pruefungsteil": "AP1", "modul": "M07",
  "thema": "Vertragsarten", "typ": "mc", "schwierigkeit": 2,
  "frage": "Bei einem der gemieteten Notebooks fällt nach acht Monaten der Akku aus. Wer muss den Mangel nach der gesetzlichen Regelung des Mietvertrags beseitigen?",
  "optionen": [
    "Der Vermieter – er muss die Mietsache während der Mietzeit in vertragsgemäßem Zustand erhalten",
    "Der Mieter, da er die Sache in Gebrauch hat und sie ihm zugerechnet wird",
    "Niemand – nach sechs Monaten Nutzung erlöschen alle Ansprüche des Mieters",
    "Der Hersteller unmittelbar, da zwischen ihm und dem Mieter ein Kaufvertrag zustande kommt"
  ],
  "loesungIndex": 0,
  "distraktorErklaerungen": [
    "",
    "Der Gebrauch allein verlagert die Erhaltungspflicht nicht. § 535 Abs. 1 BGB weist sie dem Vermieter zu. Etwas anderes gilt nur bei vom Mieter zu vertretenden Schäden.",
    "Eine solche Frist gibt es im Mietrecht nicht. Die Erhaltungspflicht des Vermieters besteht während der gesamten Mietzeit.",
    "Zwischen Mieter und Hersteller besteht kein Vertrag. Ansprüche richten sich gegen den Vermieter als Vertragspartner."
  ],
  "erklaerungKurz": "Nach § 535 Abs. 1 BGB muss der Vermieter die Mietsache während der gesamten Mietzeit in einem zum vertragsgemäßen Gebrauch geeigneten Zustand erhalten. Der Akkutausch ist seine Sache.",
  "erklaerungLang": "Die Erhaltungspflicht ist der Punkt, an dem sich Miete und Kauf im Betriebsalltag am deutlichsten unterscheiden.\n\nGESETZLICHE LAGE (§ 535 Abs. 1 BGB): Der Vermieter hat die Mietsache dem Mieter in einem zum vertragsgemäßen Gebrauch geeigneten Zustand zu ÜBERLASSEN und sie während der Mietzeit in diesem Zustand zu ERHALTEN. Anders als beim Kauf, wo die Gewährleistung an den Zustand bei Übergabe anknüpft, ist die Pflicht des Vermieters dauerhaft.\n\nPRAKTISCHE FOLGE für die IT-Beschaffung: Bei gemieteter Hardware trägt der Vermieter das Ausfallrisiko über die gesamte Laufzeit. Das ist ein wesentlicher Grund, warum Miet- und Servicemodelle trotz höherer Nominalkosten attraktiv sein können – Ersatzgeräte und Reparaturen sind eingepreist.\n\nGRENZE: Schäden, die der Mieter zu vertreten hat, fallen nicht darunter. Ein durch Sturz beschädigtes Display muss der Mieter ersetzen.\n\nUNTERSCHIED ZUM LEASING: Leasingverträge verlagern die Instandhaltung vertraglich regelmäßig auf den Leasingnehmer. Wer Angebote vergleicht, muss deshalb genau prüfen, wer Wartung und Reparatur schuldet – die Vertragsbezeichnung allein sagt das nicht.",
  "verweis": "Modul 07, Abschnitt 7.1 – Vertragsarten (Hauptpflichten beim Mietvertrag, § 535 BGB)"
},
{
  "id": "M07-718", "pruefungsteil": "AP1", "modul": "M07",
  "thema": "Vertragsarten", "typ": "mehrfach", "schwierigkeit": 2,
  "frage": "Welche Aussagen über einen Mietvertrag über IT-Hardware treffen zu? (Mehrere Antworten richtig)",
  "optionen": [
    "Der Vermieter muss die Sache während der Mietzeit in vertragsgemäßem Zustand erhalten",
    "Das Eigentum an der Hardware bleibt beim Vermieter",
    "Der Mieter zahlt ein Entgelt für die Gebrauchsüberlassung auf Zeit",
    "Mit der letzten Zahlung geht das Eigentum automatisch auf den Mieter über",
    "Der Mieter schuldet dem Vermieter die Herbeiführung eines Werkerfolgs"
  ],
  "loesungIndizes": [0, 1, 2],
  "distraktorErklaerungen": [
    "", "", "",
    "Ein automatischer Eigentumsübergang ist dem Mietvertrag fremd. Er kommt allenfalls beim Mietkauf oder über eine vereinbarte Kaufoption beim Leasing vor.",
    "Eine Werkleistung schuldet der Mieter nicht. Seine Hauptpflicht ist die Zahlung der Miete."
  ],
  "erklaerungKurz": "Kennzeichnend sind Gebrauchsüberlassung auf Zeit gegen Entgelt, Verbleib des Eigentums beim Vermieter und dessen Erhaltungspflicht (§ 535 BGB).",
  "erklaerungLang": "Die drei zutreffenden Aussagen geben die Hauptpflichten aus § 535 BGB wieder.\n\nDIE BEIDEN DISTRAKTOREN sind typische Verwechslungen:\n\nEIGENTUMSÜBERGANG mit der letzten Rate – das kennzeichnet den MIETKAUF, nicht die Miete. Beim Leasing gibt es häufig eine KaufOPTION, also ein Recht zum Erwerb gegen Restwert, aber keinen automatischen Übergang. Wer diese Modelle verwechselt, bilanziert und kalkuliert falsch.\n\nWERKERFOLG – das gehört zum Werkvertrag (§ 631 BGB) und beschreibt zudem die falsche Richtung: Beim Mietvertrag schuldet der MIETER lediglich die Zahlung, nicht eine Leistung an den Vermieter.\n\nFÜR DIE BESCHAFFUNGSENTSCHEIDUNG sind drei Fragen zu klären: Wem gehört die Hardware am Ende? Wer trägt Wartung und Ausfallrisiko? Wie hoch sind die Gesamtkosten über die Laufzeit im Vergleich zum Kauf? Erst diese drei Antworten zusammen tragen eine Empfehlung.",
  "verweis": "Modul 07, Abschnitt 7.1 – Vertragsarten (Mietvertrag, Abgrenzung Mietkauf/Leasing)"
},
]

ZIEL = {"pool/pool_m03.json": M03, "pool/pool_m07.json": M07}


def main():
    probe = "--probe" in sys.argv
    basis = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    gesamt = 0
    for rel, neue in ZIEL.items():
        pfad = os.path.join(basis, rel)
        with open(pfad, encoding="utf8") as fh:
            roh = fh.read()
        daten = json.loads(roh)
        # Round-Trip-Probe VOR der Aenderung (Lehre v1.4.0: nur indent=2 ist byte-identisch)
        if json.dumps(daten, ensure_ascii=False, indent=2) + "\n" != roh:
            print(f"ABBRUCH: {rel} ist mit indent=2 nicht byte-identisch – Format erst klaeren.")
            return 2
        vorhanden = {q["id"] for q in daten}
        doppelt = [q["id"] for q in neue if q["id"] in vorhanden]
        if doppelt:
            print(f"ABBRUCH: ID bereits vergeben in {rel}: {doppelt}")
            return 2
        eigen = [q["id"] for q in neue]
        if len(set(eigen)) != len(eigen):
            print(f"ABBRUCH: doppelte IDs innerhalb des Batches fuer {rel}")
            return 2
        daten.extend(neue)
        gesamt += len(neue)
        if not probe:
            Path(pfad).write_text(json.dumps(daten, ensure_ascii=False, indent=2) + "\n", encoding="utf8")
        print(f"{'[probe] ' if probe else ''}{rel}: +{len(neue)} -> {len(daten)} Fragen")
    print(f"{'[probe] ' if probe else ''}Summe neu: {gesamt}")
    if not probe:
        print("JETZT ZWINGEND:  python3 build_fragen.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
