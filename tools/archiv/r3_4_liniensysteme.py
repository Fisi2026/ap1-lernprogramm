#!/usr/bin/env python3
"""FB-R3 Punkt 4 – Liniensysteme ueberarbeiten.

BEFUND (2026-07-22, Bestandsabgleich ueber alle 18 Fragen mit Liniensystem-Bezug):

FACHLICH FALSCH – und zwar im WIDERSPRUCH zum eigenen Bestand:
  * M07-311 und M07-312 etikettieren beide dasselbe Beispiel ("Entwickler berichtet an
    IT-Leiter UND Projektleiter") als MEHRLINIENorganisation. Das ist eine MATRIX: zwei
    verschiedene Gliederungsdimensionen (Funktion x Projekt). Mehrlinie heisst mehrere
    FACHvorgesetzte in DERSELBEN Dimension (Funktionsmeisterprinzip).
    M09-021 und M09-024 machen es richtig, M07-709 (neu in v1.5.0) erklaert den Unterschied
    ausdruecklich -> der Pool widersprach sich selbst.
  * M07-312 fuehrte die Matrixorganisation ueberhaupt nicht auf, obwohl Katalog 7.4 sie nennt.
  * M09-027 begruendete mit "Hauptversammlung und Aufsichtsrat sind AG-Organe". Fuer die
    Hauptversammlung stimmt das (GmbH: Gesellschafterversammlung), fuer den Aufsichtsrat NICHT:
    § 52 GmbHG erlaubt ihn fakultativ, ab 500 Arbeitnehmern ist er nach DrittelbG zwingend.
    Die Loesung bleibt richtig, die Begruendung war zu absolut.
  * M07-109: zwei Tippfehler ("Beratungspositzionen", "Operatives" mitten im Satz).

VISUELL DEFEKT (strukturell nachgemessen; cairosvg ist hier nicht installierbar, npm/pip 403):
  * M07-009: die Verbindung Geschaeftsfuehrung -> "Leiter Netzwerk" FEHLT ganz, und zwei
    waagerechte Linien laufen bis x=560 ins Leere (rechtestes Element endet bei x=450).
  * M07-117: die drei Team-Boxen ueberlappen sich zweimal um 20 px, und sechs Linien enden
    unterhalb der Teams an keinem Element (Reste nie gezeichneter Mitarbeiter-Knoten).

NEU ENTWORFEN (Nutzer-Entscheid 2026-07-22):
  * M09-024 (Kreuztabelle) komplett neu: die alte Zeile "Fachkompetenz neben Hierarchie" war
    bei der Stablinie auf falsch gesetzt und damit angreifbar - Staebe SIND Fachleute neben der
    Linie, nur ohne Weisungsrecht. Die neuen sechs Zeilen sind je einzeln eindeutig entscheidbar
    und enthalten mit "zwei Gliederungsdimensionen" genau das Merkmal, das Mehrlinie von Matrix
    trennt.
  * M07-009 Bildunterschrift: nennt das Unterscheidungsmerkmal nicht mehr im Klartext, sondern
    nur noch eine neutrale Legende - sonst muss man das Diagramm gar nicht ansehen.

Aufruf:  python3 tools/r3_4_liniensysteme.py [--probe]
Danach ZWINGEND: python3 build_fragen.py
"""
import json
import os
import sys

# ── Neue SVGs ────────────────────────────────────────────────────────────────────────────
# M07-009 Matrix: Fachlinie waagerecht (durchgezogen), Projektlinie senkrecht (gestrichelt),
# Mitarbeiter an den Kreuzungspunkten. Beide Fachbereichsleitungen UND beide Projektleitungen
# haengen an derselben Sammelschiene unter der Geschaeftsfuehrung.
SVG_M07_009 = (
  "<svg viewBox='0 0 700 300' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'>"
  "<text x='350' y='16' text-anchor='middle' font-size='14' font-weight='bold' fill='#22293a'>Organigramm (Ausschnitt)</text>"
  # Geschaeftsfuehrung
  "<rect x='275' y='24' width='150' height='36' rx='8' fill='#e8f0fe' stroke='#2A4B8D' stroke-width='2'/>"
  "<text x='350' y='47' text-anchor='middle' font-size='13' fill='#22293a'>Geschäftsführung</text>"
  # Sammelschiene unter der GF
  "<line x1='350' y1='60' x2='350' y2='76' stroke='#2A4B8D' stroke-width='1.5'/>"
  "<line x1='14' y1='76' x2='460' y2='76' stroke='#2A4B8D' stroke-width='1.5'/>"
  # linker Strang zu den Fachbereichsleitungen
  "<line x1='14' y1='76' x2='14' y2='232' stroke='#2A4B8D' stroke-width='1.5'/>"
  "<line x1='14' y1='167' x2='30' y2='167' stroke='#2A4B8D' stroke-width='1.5'/>"
  "<line x1='14' y1='232' x2='30' y2='232' stroke='#2A4B8D' stroke-width='1.5'/>"
  # Fachbereichsleitungen
  "<rect x='30' y='150' width='140' height='34' rx='8' fill='#fff' stroke='#2A4B8D' stroke-width='2'/>"
  "<text x='100' y='172' text-anchor='middle' font-size='12' fill='#22293a'>Leiter Administration</text>"
  "<rect x='30' y='215' width='140' height='34' rx='8' fill='#fff' stroke='#2A4B8D' stroke-width='2'/>"
  "<text x='100' y='237' text-anchor='middle' font-size='12' fill='#22293a'>Leiter Netzwerk</text>"
  # Projektleitungen
  "<line x1='290' y1='76' x2='290' y2='90' stroke='#e08a00' stroke-width='1.5'/>"
  "<line x1='460' y1='76' x2='460' y2='90' stroke='#e08a00' stroke-width='1.5'/>"
  "<rect x='230' y='90' width='120' height='32' rx='6' fill='#FFE066' stroke='#e08a00' stroke-width='2'/>"
  "<text x='290' y='111' text-anchor='middle' font-size='12' fill='#22293a'>Projekt A</text>"
  "<rect x='400' y='90' width='120' height='32' rx='6' fill='#FFE066' stroke='#e08a00' stroke-width='2'/>"
  "<text x='460' y='111' text-anchor='middle' font-size='12' fill='#22293a'>Projekt B</text>"
  # Fachweisung waagerecht - endet exakt am rechten Rand des letzten Mitarbeiters
  "<line x1='170' y1='167' x2='477' y2='167' stroke='#2A4B8D' stroke-width='1.5'/>"
  "<line x1='170' y1='232' x2='477' y2='232' stroke='#2A4B8D' stroke-width='1.5'/>"
  # Projektweisung senkrecht - endet exakt am unteren Rand des letzten Mitarbeiters
  "<line x1='290' y1='122' x2='290' y2='249' stroke='#e08a00' stroke-width='1.5' stroke-dasharray='5,4'/>"
  "<line x1='460' y1='122' x2='460' y2='249' stroke='#e08a00' stroke-width='1.5' stroke-dasharray='5,4'/>"
  # Mitarbeiter an den Kreuzungspunkten
  "<circle cx='290' cy='167' r='17' fill='#fff' stroke='#2A4B8D' stroke-width='2'/><text x='290' y='172' text-anchor='middle' font-size='11'>MA</text>"
  "<circle cx='460' cy='167' r='17' fill='#fff' stroke='#2A4B8D' stroke-width='2'/><text x='460' y='172' text-anchor='middle' font-size='11'>MA</text>"
  "<circle cx='290' cy='232' r='17' fill='#fff' stroke='#2A4B8D' stroke-width='2'/><text x='290' y='237' text-anchor='middle' font-size='11'>MA</text>"
  "<circle cx='460' cy='232' r='17' fill='#fff' stroke='#2A4B8D' stroke-width='2'/><text x='460' y='237' text-anchor='middle' font-size='11'>MA</text>"
  # NEUTRALE Legende - nennt die Organisationsform NICHT
  "<text x='350' y='283' text-anchor='middle' font-size='12' fill='#555'>durchgezogen = Weisung der Fachbereichsleitung · gestrichelt = Weisung der Projektleitung</text>"
  "</svg>"
)

# M07-117 Einlinie: sauberer Baum, keine Ueberlappung, keine Linie ohne Ziel.
SVG_M07_117 = (
  "<svg viewBox='0 0 700 320' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif'>"
  "<text x='350' y='16' text-anchor='middle' font-size='14' font-weight='bold' fill='#22293a'>Organigramm (Ausschnitt)</text>"
  "<rect x='280' y='24' width='140' height='36' rx='8' fill='#e8f0fe' stroke='#2A4B8D' stroke-width='2'/>"
  "<text x='350' y='47' text-anchor='middle' font-size='13' fill='#22293a'>Geschäftsführung</text>"
  # erste Ebene
  "<line x1='350' y1='60' x2='350' y2='80' stroke='#2A4B8D' stroke-width='1.5'/>"
  "<line x1='150' y1='80' x2='550' y2='80' stroke='#2A4B8D' stroke-width='1.5'/>"
  "<line x1='150' y1='80' x2='150' y2='112' stroke='#2A4B8D' stroke-width='1.5'/>"
  "<line x1='350' y1='80' x2='350' y2='112' stroke='#2A4B8D' stroke-width='1.5'/>"
  "<line x1='550' y1='80' x2='550' y2='112' stroke='#2A4B8D' stroke-width='1.5'/>"
  "<rect x='80' y='112' width='140' height='36' rx='8' fill='#fff' stroke='#2A4B8D' stroke-width='2'/>"
  "<text x='150' y='135' text-anchor='middle' font-size='12' fill='#22293a'>IT-Abteilung</text>"
  "<rect x='280' y='112' width='140' height='36' rx='8' fill='#fff' stroke='#2A4B8D' stroke-width='2'/>"
  "<text x='350' y='135' text-anchor='middle' font-size='12' fill='#22293a'>Vertrieb</text>"
  "<rect x='480' y='112' width='140' height='36' rx='8' fill='#fff' stroke='#2A4B8D' stroke-width='2'/>"
  "<text x='550' y='135' text-anchor='middle' font-size='12' fill='#22293a'>Buchhaltung</text>"
  # zweite Ebene unter der IT-Abteilung - Boxen 95 breit, 12 Abstand, KEINE Ueberlappung
  "<line x1='150' y1='148' x2='150' y2='178' stroke='#2A4B8D' stroke-width='1.5'/>"
  "<line x1='52' y1='178' x2='266' y2='178' stroke='#2A4B8D' stroke-width='1.5'/>"
  "<line x1='52' y1='178' x2='52' y2='212' stroke='#2A4B8D' stroke-width='1.5'/>"
  "<line x1='159' y1='178' x2='159' y2='212' stroke='#2A4B8D' stroke-width='1.5'/>"
  "<line x1='266' y1='178' x2='266' y2='212' stroke='#2A4B8D' stroke-width='1.5'/>"
  "<rect x='5' y='212' width='95' height='34' rx='6' fill='#fff' stroke='#2A4B8D' stroke-width='2'/>"
  "<text x='52' y='233' text-anchor='middle' font-size='11' fill='#22293a'>Admin-Team</text>"
  "<rect x='112' y='212' width='95' height='34' rx='6' fill='#fff' stroke='#2A4B8D' stroke-width='2'/>"
  "<text x='159' y='233' text-anchor='middle' font-size='11' fill='#22293a'>Support-Team</text>"
  "<rect x='219' y='212' width='95' height='34' rx='6' fill='#fff' stroke='#2A4B8D' stroke-width='2'/>"
  "<text x='266' y='233' text-anchor='middle' font-size='11' fill='#22293a'>Netzwerk-Team</text>"
  "<text x='350' y='295' text-anchor='middle' font-size='12' fill='#555'>Durchgezogene Linien = Weisungsbeziehungen</text>"
  "</svg>"
)

# ── Textliche Korrekturen ────────────────────────────────────────────────────────────────
AENDERUNGEN = {

"M07-009": {
  "svg": SVG_M07_009,
  "erklaerungKurz": ("Das Schaubild zeigt eine Matrixorganisation: Jeder Mitarbeiter steht am Kreuzungspunkt "
    "zweier Weisungsstränge – waagerecht die Fachbereichsleitung, senkrecht die Projektleitung."),
  "erklaerungLang": ("Erkennungsmerkmal im Bild: Es gibt ZWEI verschiedene Gliederungsdimensionen, die sich "
    "überlagern.\n\nWAAGERECHT liegt die Fachlinie (Leiter Administration, Leiter Netzwerk) – die "
    "dauerhafte Zugehörigkeit des Mitarbeiters.\nSENKRECHT liegt die Projektlinie (Projekt A, Projekt B) "
    "– die befristete Zuordnung zu einem Vorhaben.\nAn jedem Kreuzungspunkt sitzt ein Mitarbeiter mit "
    "zwei Vorgesetzten.\n\nABGRENZUNG ZUR MEHRLINIENORGANISATION: Dort hat ein Mitarbeiter ebenfalls mehrere "
    "Vorgesetzte, diese sind aber alle FACHvorgesetzte derselben Dimension (Funktionsmeisterprinzip) – "
    "etwa je ein Verantwortlicher für Netzbetrieb, Serverbetrieb und Anwenderbetreuung. Nicht die ZAHL "
    "der Vorgesetzten unterscheidet die beiden Formen, sondern ob sie aus einer oder aus zwei "
    "Gliederungsdimensionen stammen.\n\nABGRENZUNG ZUM EINLINIENSYSTEM: dort genau ein Vorgesetzter je "
    "Stelle. ZUR SPARTENORGANISATION: dort wird nach Produkten oder Geschäftsbereichen gegliedert, "
    "jede Sparte mit eigener Struktur – aber weiterhin mit einfacher Unterstellung."),
},

"M07-117": {
  "svg": SVG_M07_117,
},

"M07-109": {
  "distraktorErklaerungen": [
    "",
    "Das ist eine Linienposition (z. B. Abteilungsleitung), keine Stabsstelle.",
    "Stabsstellen sind Beratungspositionen, keine operativen Abteilungen.",
    "Stabsstellen haben gerade KEINE Linienverantwortung."
  ],
  "optionen": [
    "Sie berät die Geschäftsführung, hat aber KEINE Weisungsbefugnis gegenüber Mitarbeitern",
    "Sie führt Mitarbeiter an und erteilt ihnen Weisungen",
    "Sie ist für das operative Tagesgeschäft zuständig",
    "Sie ist eine Abteilung mit Linienverantwortung"
  ],
},

# ── Der Kernfehler: Matrix-Beispiel war als Mehrlinie etikettiert ──────────────────────
"M07-311": {
  "frage": ("Bei der Hillesheimer Kunststofftechnik GmbH erhält eine Systemadministratorin ihre "
    "Weisungen von drei Fachverantwortlichen: vom Leiter Netzbetrieb für alles rund um das Netzwerk, "
    "vom Leiter Serverbetrieb für die Server und vom Leiter Anwenderbetreuung für die "
    "Support-Fälle. Welches Problem ist in dieser Mehrlinienorganisation strukturell angelegt?"),
  "optionen": [
    "Kompetenzkonflikte: Bei widersprüchlichen Weisungen aus mehreren Fachbereichen ist nicht geregelt, welche Vorrang hat",
    "Der Dienstweg wird länger, weil jede Weisung zuerst die Geschäftsführung passieren muss",
    "Es gibt keine weisungsbefugten Vorgesetzten mehr, sondern nur noch beratende Stabsstellen",
    "Die Mitarbeiterin ist niemandem mehr unterstellt, eine Aufsicht findet nicht statt"
  ],
  "loesungIndex": 0,
  "distraktorErklaerungen": [
    "",
    "Lange Dienstwege über die Hierarchie kennzeichnen das EINLINIENsystem. Die Mehrlinienorganisation verkürzt die Wege gerade, weil man sich direkt an den zuständigen Fachvorgesetzten wendet.",
    "Beratende Stellen ohne Weisungsbefugnis sind Stabsstellen und kennzeichnen die Stablinienorganisation. In der Mehrlinienorganisation sind alle genannten Leitungen weisungsbefugt.",
    "Mehrfachunterstellung ist das Gegenteil von gar keiner Unterstellung – die Mitarbeiterin hat hier mehr Vorgesetzte als üblich, nicht weniger."
  ],
  "erklaerungKurz": ("In der Mehrlinienorganisation ist eine Stelle mehreren FACHvorgesetzten unterstellt. "
    "Widersprechen sich deren Weisungen, fehlt eine Vorrangregel – das ist der strukturelle Preis für "
    "die kurzen Wege."),
  "erklaerungLang": ("Die Mehrlinienorganisation geht auf das Funktionsmeisterprinzip zurück: Statt eines "
    "Allzuständigen gibt es mehrere Spezialisten, die jeweils in ihrem Sachgebiet weisungsbefugt sind.\n\n"
    "WAS DAFÜR SPRICHT: kurze Wege und hohe Fachkompetenz. Wer ein Netzproblem hat, geht direkt zum Leiter "
    "Netzbetrieb, statt eine Hierarchie hinauf- und wieder hinunterzulaufen.\n\nWAS DAGEGEN SPRICHT: Das "
    "Prinzip der Einheit der Auftragserteilung ist durchbrochen. Verlangt der Leiter Serverbetrieb, zuerst "
    "ein Update einzuspielen, und der Leiter Anwenderbetreuung, zuerst ein Ticket zu lösen, entscheidet "
    "im Zweifel die Mitarbeiterin selbst – also genau die Stelle, die es nicht entscheiden sollte. "
    "Abhilfe schafft nur eine vorab festgelegte Vorrangregel.\n\n⚠️ NICHT VERWECHSELN MIT DER "
    "MATRIXORGANISATION: Auch dort gibt es mehrere Vorgesetzte. Der Unterschied liegt nicht in der ZAHL, "
    "sondern in der HERKUNFT der Weisungen. Mehrlinie: mehrere Fachvorgesetzte aus DERSELBEN Dimension. "
    "Matrix: zwei VERSCHIEDENE Gliederungsdimensionen überlagern sich, klassisch Funktion und Projekt – "
    "etwa wenn dieselbe Administratorin fachlich der IT-Leitung und zugleich befristet einer Projektleitung "
    "untersteht."),
},

"M07-312": {
  "frage": "Ordnen Sie die fünf Organisationsformen ihren charakteristischen Merkmalen zu:",
  "paare": [
    ["Einliniensystem", "Jede Stelle hat genau eine vorgesetzte Stelle; klare, aber lange Dienstwege"],
    ["Mehrliniensystem", "Mehrere FACHvorgesetzte für verschiedene Sachgebiete (Funktionsmeisterprinzip); kurze Wege, aber Kompetenzkonflikte"],
    ["Stablinienorganisation", "Stabsstellen beraten die Linie (z. B. Datenschutzbeauftragter), haben aber keine Weisungsbefugnis"],
    ["Matrixorganisation", "Zwei Gliederungsdimensionen überlagern sich (z. B. Fachbereich und Projekt); doppelte Unterstellung"],
    ["Sparten- / Divisionsorganisation", "Gliederung nach Produktlinien oder Geschäftsbereichen, jede Sparte mit eigener Struktur"]
  ],
  "erklaerungKurz": ("Die fünf Formen unterscheiden sich darin, WIE VIELE und WELCHE Vorgesetzten eine "
    "Stelle hat: Einlinie genau eine, Mehrlinie mehrere Fachvorgesetzte derselben Dimension, Matrix zwei "
    "verschiedene Dimensionen, Stablinie eine Linie plus beratende Stäbe, Sparten eine Gliederung nach "
    "Geschäftsfeldern."),
  "erklaerungLang": ("Die häufigste Verwechslung in der Prüfung ist Mehrlinie gegen Matrix, weil in "
    "beiden Fällen mehrere Vorgesetzte weisungsbefugt sind.\n\nDER UNTERSCHEIDUNGSTEST lautet: Kommen die "
    "Weisungen aus EINER oder aus ZWEI Gliederungsdimensionen?\n• Mehrere Fachverantwortliche "
    "(Netzbetrieb, Serverbetrieb, Anwenderbetreuung) – alle in der Fachdimension → MEHRLINIE.\n"
    "• Fachbereichsleitung UND Projektleitung – Funktion und Projekt, zwei Dimensionen → MATRIX.\n\n"
    "DIE STABLINIENORGANISATION ist im Kern ein Einliniensystem: Die Weisungsbefugnis bleibt bei der Linie, "
    "die Stäbe liefern nur Fachwissen. Ein Datenschutzbeauftragter kann deshalb beraten und beanstanden, "
    "aber keinem Administrator etwas anweisen.\n\nDIE SPARTENORGANISATION unterscheidet sich von allen "
    "anderen dadurch, dass sie an einem anderen Kriterium ansetzt: nicht an der Frage, wer wem weisungs"
    "befugt ist, sondern woran das Unternehmen überhaupt gegliedert wird – an Produkten oder "
    "Geschäftsbereichen statt an Funktionen."),
},

# ── Neu entworfene Kreuztabelle ────────────────────────────────────────────────────────
"M09-024": {
  "frage": "Kreuze an, welche Aussagen auf welches Leitungssystem zutreffen.",
  "zeilen": [
    "Jede Stelle hat genau eine vorgesetzte Stelle",
    "Mehrfachunterstellung ist vorgesehen",
    "Es gibt Stellen, die nur beraten und nicht anweisen dürfen",
    "Die Weisungen stammen aus zwei verschiedenen Gliederungsdimensionen",
    "Der Dienstweg über die Hierarchie ist lang",
    "Kompetenzkonflikte sind strukturell angelegt"
  ],
  "spalten": ["Einlinienorganisation", "Mehrlinienorganisation", "Stablinienorganisation", "Matrixorganisation"],
  "loesung": [
    [True,  False, True,  False],
    [False, True,  False, True ],
    [False, False, True,  False],
    [False, False, False, True ],
    [True,  False, True,  False],
    [False, True,  False, True ]
  ],
  "erklaerungKurz": ("Einlinie und Stablinie teilen den klaren, aber langen Dienstweg – die Stablinie "
    "ergänzt ihn nur um beratende Stäbe. Mehrlinie und Matrix teilen Mehrfachunterstellung und "
    "Konfliktpotenzial; unterscheiden lassen sie sich an den zwei Gliederungsdimensionen der Matrix."),
  "erklaerungLang": ("Die Tabelle ist so gebaut, dass sich die vier Systeme paarweise trennen lassen.\n\n"
    "ZEILE 1 und 5 trennen {Einlinie, Stablinie} von {Mehrlinie, Matrix}: Die Stablinienorganisation ist im "
    "Kern ein Einliniensystem – Stäbe hängen daneben, ohne die Linie zu verändern. Deshalb "
    "hat auch dort jede Stelle genau eine vorgesetzte Stelle und deshalb bleibt der Dienstweg lang.\n\n"
    "ZEILE 3 trennt die Stablinie von allen anderen: Nur dort gibt es Stellen ohne Weisungsbefugnis.\n\n"
    "ZEILE 4 ist der entscheidende Trennstrich zwischen Mehrlinie und Matrix. Beide haben Mehrfach"
    "unterstellung (Zeile 2) und beide haben Konfliktpotenzial (Zeile 6) – nur die Matrix bezieht ihre "
    "Weisungen aus ZWEI Dimensionen (Fachbereich und Projekt). In der Mehrlinienorganisation sind alle "
    "Vorgesetzten Fachvorgesetzte derselben Dimension.\n\nMERKSATZ: Nicht die Zahl der Chefs unterscheidet "
    "Mehrlinie und Matrix, sondern woher sie kommen."),
},

"M09-027": {
  "erklaerungKurz": ("Instanzen (Geschäftsführung, Abteilungsleitung) haben Weisungsbefugnis, die "
    "Stabsstelle berät nur, ausführende Stellen setzen um. Hauptversammlung und Aufsichtsrat "
    "gehören nicht in die Leitungslinie dieses Betriebs."),
  "erklaerungLang": ("Ein Organigramm der Leitungslinie zeigt, wer wem Weisungen erteilt. Drei Ebenen sind zu "
    "unterscheiden:\n• INSTANZEN mit Weisungsbefugnis: Geschäftsführung, Abteilungsleitung "
    "Produktion.\n• STABSSTELLEN: beraten und unterstützen, hier das Controlling – ohne "
    "Weisungsbefugnis gegenüber der Linie.\n• AUSFÜHRENDE STELLEN ohne eigene Weisungsbefugnis: "
    "der Maschinenbediener.\n\nWARUM DIE BEIDEN ANDEREN NICHT HINEINGEHÖREN – und zwar aus zwei "
    "VERSCHIEDENEN Gründen:\n• Die HAUPTVERSAMMLUNG ist ein Organ der Aktiengesellschaft. Das "
    "Gegenstück der GmbH heißt Gesellschafterversammlung.\n• Der AUFSICHTSRAT ist dagegen "
    "durchaus auch in einer GmbH möglich: freiwillig nach § 52 GmbHG, ab 500 Arbeitnehmern nach dem "
    "Drittelbeteiligungsgesetz sogar verpflichtend. Er gehört hier trotzdem nicht hinein, weil er ein "
    "KONTROLLorgan ist und nicht Teil der betrieblichen Leitungslinie – er überwacht die "
    "Geschäftsführung, erteilt aber den Abteilungen keine Weisungen."),
},
}


def main():
    probe = "--probe" in sys.argv
    basis = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    offen = set(AENDERUNGEN)
    for rel in ("pool/pool_m07.json", "pool/pool_m09_unterricht.json"):
        pfad = os.path.join(basis, rel)
        with open(pfad, encoding="utf8") as fh:
            roh = fh.read()
        daten = json.loads(roh)
        if json.dumps(daten, ensure_ascii=False, indent=2) + "\n" != roh:
            print(f"ABBRUCH: {rel} ist mit indent=2 nicht byte-identisch."); return 2
        n = 0
        for q in daten:
            if q["id"] in AENDERUNGEN:
                for k, v in AENDERUNGEN[q["id"]].items():
                    if k not in q:
                        print(f"ABBRUCH: {q['id']} hat kein Feld '{k}' – Struktur pruefen."); return 2
                    q[k] = v
                offen.discard(q["id"]); n += 1
        if not probe:
            with open(pfad, "w", encoding="utf8") as fh:
                fh.write(json.dumps(daten, ensure_ascii=False, indent=2) + "\n")
        print(f"{'[probe] ' if probe else ''}{rel}: {n} Fragen geaendert")
    if offen:
        print(f"ABBRUCH: nicht gefunden: {sorted(offen)}"); return 2
    if not probe:
        print("JETZT ZWINGEND:  python3 build_fragen.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
