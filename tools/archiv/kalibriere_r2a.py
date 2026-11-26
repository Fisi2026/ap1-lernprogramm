#!/usr/bin/env python3
"""tools/kalibriere_r2a.py – FB-R2a, 2026-07-21.

Senkt die zehn Fragen mit VIER Pflichtbegriffen auf zwei bis drei und nutzt dafuer die seit
2026-07-20 verfuegbaren ALTERNATIVLISTEN. Einmal-Skript, bewusst nachvollziehbar abgelegt statt
per Hand editiert – die Zuordnung ist eine fachliche Entscheidung und soll nachlesbar bleiben.

LEITLINIE DER AUSWAHL (aus dem Befund vom 19.07.: Ø 3,4 Pflicht -> 13 % Trefferquote):
  * Pflicht wird NUR, was eine fachlich richtige Antwort zwingend enthalten MUSS.
  * Jeder Pflichteintrag ist eine Alternativliste, die neben dem Fachwort auch die
    ALLTAGSFORMULIERUNG traegt – genau das war die Luecke im strengen Messgleis.
  * Alles, was eine gute Antwort schmueckt, aber nicht traegt, wandert nach `kuer`.
  * Was die FRAGE gar nicht verlangt, fliegt raus (M04-206 „Fremdschluessel": gefragt sind
    Entitaeten, Attribute und Kardinalitaet – ein Fremdschluessel kommt darin nicht vor).

MITTELWEG-REGEL (Nutzer-Entscheid 2026-07-21) – sie entscheidet, WAS als Alternative zaehlt:
  ZUGELASSEN ist der echte gleichwertige deutsche Ausdruck fuer DENSELBEN Begriff:
      Anschaffungskosten <-> Kaufpreis · Group Policies <-> Gruppenrichtlinien ·
      Active Directory <-> Verzeichnisdienst · Auszubildende <-> Azubis · Emotionen <-> Gefuehle
  NICHT ZUGELASSEN ist die Umschreibung eines ganzen KONZEPTS in Alltagsworten:
      „unter Wasser" fuer die verborgene Ebene · „im Kreis" fuer iterativ ·
      „zwei Stellen" fuer Lernorte · „glauben" fuer vertrauenswuerdig
  Begruendung des Nutzers: In der AP1 erwartet der Pruefer den Fachbegriff. Wer die Sache
  verstanden, aber kein Fachwort geschrieben hat, soll „teilweise" sehen – das ist eine
  ehrliche Rueckmeldung und kein Bewertungsfehler. Der Preis dafuer ist messbar und bewusst
  in Kauf genommen: strenges Messgleis 6/10 -> 2/10, realistisches Gleis unveraendert 10/10.
  Der Rueckgang ist inhaltlich stimmig: acht der zehn Fragen lauten „Erklaere den Begriff X" –
  wer X konsequent NICHT benennt, hat die Aufgabe nicht erfuellt, auch wenn er die Sache kennt.

Aufruf: python3 tools/kalibriere_r2a.py   (danach ZWINGEND python3 build_fragen.py)
"""
import glob
import json
import os

NEU = {
    # Sprint: Zeitbox, lieferbares Ergebnis, Wiederholung. Backlog/PO sind Rollen drumherum.
    "M01-115": {
        "pflicht": [
            ["zeitlich begrenzt", "Zeitraum", "Zeitabschnitt", "Zeitbox", "Timebox"],
            ["Inkrement", "fertiges Ergebnis", "lieferbar"],
            ["iterativ", "wiederholt", "wiederholen", "immer wieder", "Zyklus"],
        ],
        "kuer": ["Sprint Backlog", "Product Owner", "Sprint Review", "Retrospektive"],
    },
    # Nutzwertanalyse: Kriterien, Gewichtung, Gesamtsumme. „Alternativen" ergibt sich aus dem Vergleich.
    "M02-011": {
        "pflicht": [
            ["Kriterien", "Kriterium", "Merkmale"],
            ["Gewichtungsfaktoren", "Gewichtung", "gewichtet", "Wichtigkeit"],
            ["Gesamtpunktzahl", "Gesamtsumme", "Gesamtwertung", "Summe"],
        ],
        "kuer": ["Alternativen", "Entscheidungshilfeverfahren", "transparent", "Teilnutzen"],
    },
    # Eisberg: sichtbarer Teil, verborgener Teil, und WAS darin steckt.
    "M02-109": {
        "pflicht": [
            ["sichtbare Ebene", "Sachebene", "Sachinhalt", "sichtbar"],
            ["verborgene Ebene", "verborgen", "unsichtbar", "unterschwellig"],
            # „Beziehungsebene" musste hier raus: sie liegt in DERSELBEN Synonymgruppe wie
            # „verborgene Ebene" aus Pflicht 2 – ein Wort haette beide Pflichten erfuellt.
            # Gefunden vom neuen Kollisions-Waechter in test_freitext, nicht beim Lesen.
            ["Emotionen", "Gefuehle", "Beziehungsaspekte"],
        ],
        "kuer": ["Vertrauen", "Konflikte", "Botschaft"],
    },
    # TCO: nicht nur Anschaffung, sondern Betrieb ueber die Nutzungsdauer.
    "M03-012": {
        "pflicht": [
            ["Anschaffungskosten", "Kaufpreis", "Anschaffung"],
            ["Betriebskosten", "laufende Kosten", "Folgekosten"],
            ["Lebenszyklus", "Nutzungsdauer", "Lebensdauer"],
        ],
        "kuer": ["TCO", "Restwert", "Leasing", "Vergleich"],
    },
    # Domaene: zentrale Verwaltung, der Dienst dahinter, zentrale Regeln.
    # „Single Sign-On" war als Pflicht unfair – es ist eine FOLGE der Domaene, nicht ihr Kern.
    "M03-115": {
        "pflicht": [
            ["Domain Controller", "Domaenencontroller", "zentrale Verwaltung"],
            ["Active Directory", "Verzeichnisdienst"],
            ["Sicherheitsrichtlinien", "Group Policies", "Gruppenrichtlinien"],
        ],
        "kuer": ["Single Sign-On", "Rechteverwaltung", "Domaenenkonto", "Benutzer"],
    },
    # ER-Modell: genau das, was die Aufgabe in (1)(2)(3) abfragt.
    "M04-206": {
        "pflicht": [
            ["Entität", "Entitäten"],
            ["Attribute", "Merkmale", "Eigenschaften"],
            ["Kardinalität", "1:n", "1 zu n"],
        ],
        "kuer": ["Fremdschluessel", "Beziehung", "Primaerschluessel", "Mitarbeiter"],
    },
    # PDCA: der Name/die vier Schritte, der Einstieg ueber den Ist-Zustand, die Wiederholung.
    "M05-001": {
        "pflicht": [
            ["PDCA-Zyklus", "PDCA", "Plan Do Check Act"],
            # „analysieren" war als Alternative zu weit: die ISMS-Musterloesung (M06-114) erwaehnt
            # PDCA namentlich UND „analysiert" und bestand diese Frage dadurch mit 80 %.
            # Gefangen von der Negativ-Kontrolle mit anderem Paarungs-Versatz.
            ["Ist-Zustand", "Ist Analyse", "Ist-Analyse", "Ausgangslage"],
            ["iterativ", "wiederholt", "immer wieder", "kontinuierlich", "fortlaufend"],
        ],
        "kuer": ["Massnahmen planen", "Qualitaetsmanagement", "standardisieren", "umsetzen"],
    },
    # CA: sie stellt Zertifikate aus, man vertraut ihr, sie bestaetigt eine Identitaet.
    "M06-113": {
        "pflicht": [
            ["Zertifikat", "Zertifikate"],
            ["vertrauenswuerdig", "vertrauen", "Vertrauensstelle"],
            ["Identität", "Identitaetsnachweis", "Inhaber"],
        ],
        "kuer": ["signiert", "Browser", "SSL", "oeffentlicher Schluessel"],
    },
    # JAV: wen sie vertritt, fuer wen, mit welchem Recht.
    "M08-011": {
        "pflicht": [
            ["Interessenvertretung", "vertritt die Interessen", "Vertretung"],
            ["Auszubildende", "Azubis", "Jugendliche", "unter 25"],
            ["Mitbestimmung", "Mitbestimmungsrecht", "BetrVG"],
        ],
        "kuer": ["Betriebsrat", "Informationsrechte", "gewaehlt", "Arbeitgeber"],
    },
    # Duales System: die zwei Lernorte und was jeder beisteuert.
    "M08-012": {
        "pflicht": [
            ["Ausbildungsbetrieb", "Betrieb", "Praxis"],
            ["Berufsschule", "Theorie"],
            ["Lernorte", "Lernort", "zwei Orte"],
        ],
        "kuer": ["Ausbildungssystem", "praktische Fertigkeiten", "theoretisches Wissen", "Deutschland"],
    },
}


def main():
    basis = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
    geaendert = 0
    for pfad in sorted(glob.glob(os.path.join(basis, "pool", "*.json"))):
        with open(pfad, encoding="utf-8") as fh:
            daten = json.load(fh)
        fragen = daten if isinstance(daten, list) else daten.get("fragen", daten)
        treffer = False
        for f in fragen:
            neu = NEU.get(f.get("id"))
            if not neu:
                continue
            alt = f.get("schluesselbegriffe", {})
            print("{!s}: pflicht {:d} -> {:d}, kuer {:d} -> {:d}".format(f["id"], len(alt.get("pflicht", [])), len(neu["pflicht"]), len(alt.get("kuer", [])), len(neu["kuer"])))
            f["schluesselbegriffe"] = {"pflicht": neu["pflicht"], "kuer": neu["kuer"]}
            treffer = True
            geaendert += 1
        if treffer:
            with open(pfad, "w", encoding="utf-8") as fh:
                json.dump(daten, fh, ensure_ascii=False, indent=2)
                fh.write("\n")
            print("  geschrieben:", os.path.basename(pfad))
    print(f"\n{geaendert:d} Fragen kalibriert. JETZT: python3 build_fragen.py")
    if geaendert != len(NEU):
        raise SystemExit(f"ABBRUCH: erwartet {len(NEU):d}, geaendert {geaendert:d}")


if __name__ == "__main__":
    main()
