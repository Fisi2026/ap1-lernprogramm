#!/usr/bin/env python3
"""tools/katalog/abdeckung.py – DEN POOL GEGEN DIE THEMENKREISE DES KATALOGS HALTEN.

    python3 tools/katalog/abdeckung.py                 Uebersicht je Themenkreis
    python3 tools/katalog/abdeckung.py --luecken       nur die Begriffe ohne Pruefsubstanz
    python3 tools/katalog/abdeckung.py --kreis 03/02   ein Themenkreis im Einzelnen
    python3 tools/katalog/abdeckung.py --begriff SCRUM wo steht dieser Begriff im Pool?

══════════ WARUM ES DIESES SKRIPT GIBT (04.09.2026) ══════════
Zweimal an zwei Tagen ist derselbe Fehler passiert: ein Scan ueber `json.dumps(frage)` meldet
einen Begriff als „im Pool vorhanden", obwohl er dort nur in einer ERKLAERUNG oder in einem
FALSCHEN Antwortsatz steht. Ein Lerner, der die Frage richtig beantwortet, hat den Begriff dann
nie geprueft bekommen. Umgekehrt hat derselbe Scan „31 von 112 Fragen" gemeldet, wo es 13 waren
und nur 5 mit Substanz – er zaehlte Felder, nicht Fragen.

►► **DESHALB TRENNT DIESES SKRIPT PRUEFSUBSTANZ VON NEBENTEXT.**
    Pruefsubstanz  frage · die RICHTIGE Antwort · musterloesung · schluesselbegriffe · paare ·
                   die richtige Wahl je Luecke · zeilen · schritte · variablen/formel
    Nebentext      erklaerungKurz · erklaerungLang · distraktorErklaerungen · die FALSCHEN
                   Antworten · verweis · thema
Nur die erste Spalte zaehlt als „geprueft". Die zweite wird trotzdem ausgewiesen, weil der
Unterschied selbst der Befund ist: ein Begriff, der nur im Nebentext steht, ist erklaert, aber
nicht geprueft – das ist eine andere Luecke als „kommt gar nicht vor", und sie wird anders
geschlossen.

⚠️⚠️ **KANDIDATENFILTER, KEIN URTEIL.** Sechs grosse Verdachtsmomente sind am 03./04.09. an genau
dieser Stelle zerfallen (RAID/SQL, BPMN, Lehrtext-Luecken, Praefixe, M03-502, die sechs leeren
Verweise). Was hier als Luecke erscheint, wird EINZELN gelesen, bevor irgendetwas geschrieben
wird – und zwar auf drei Fragen hin:
    1. Steht der Stoff unter einem ANDEREN Wort im Pool? („OSI-Modell" gegen „OSI-Referenzmodell")
    2. Gehoert er ueberhaupt zu Teil 1? (Der Katalog trennt scharf; wir pruefen nur Teil 1.)
    3. Ist der „Begriff" nur OCR-Rauschen? („Kl-Software", „2. B.", „Fragenkompiex")
"""
import argparse
import glob
import json
import os
import re
import sys
from pathlib import Path

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(os.path.dirname(HIER))
# N40 V2 (09.10.2026, E66): die Katalog-DATEN liegen privat in ../Buch/katalog (Repo Fisi2026/ap1-buch),
# nicht im oeffentlichen Repo - die OCR traegt den ©-Vermerk des Katalog-Herausgebers. Fehlen sie: Meldung, rc 2.
DATEN = os.path.normpath(os.path.join(os.path.dirname(os.path.dirname(HIER)), "..", "Buch", "katalog"))


def daten_da():
    if os.path.isdir(DATEN):
        return
    sys.stderr.write(f"Katalog-Daten fehlen: {DATEN!s} - sie liegen privat im Repo Fisi2026/ap1-buch "
                     "(bash tools/einrichten.sh holt es nach ../Buch).\n")
    sys.exit(2)
KATALOG = os.path.join(DATEN, "katalog_teil1.json")

# Woerter, die kein Fachbegriff sind. Bewusst kurz gehalten: lieber ein Kandidat zu viel als
# ein Begriff, der stillschweigend aus der Messung faellt.
STOPP = {"aber", "alle", "allem", "allen", "aller", "alles", "also", "andere", "anderen", "anderer", "anderes", "auch", "auf", "aus", "bei", "beide", "beiden", "beim", "bereits", "besondere", "bestimmte", "bzw", "dabei", "dafuer", "damit", "dann", "dass", "dazu", "dem", "den", "denen", "der", "deren", "des", "dessen", "die", "dies", "diese", "diesem", "diesen", "dieser", "dieses", "doch", "dort", "durch", "eine", "einem", "einen", "einer", "eines", "einzelne", "etwa", "fuer", "ganz", "gegen", "gibt", "haben", "hier", "hinblick", "ihre", "ihrem", "ihren", "ihrer", "ihres", "immer", "inhalt", "inhalte", "jede", "jedem", "jeden", "jeder", "jedes", "jene", "kann", "kein", "keine", "koennen", "koennte", "lassen", "mehr", "mehrere", "mit", "muss", "nach", "nicht", "noch", "nur", "oder", "ohne", "rahmen", "sein", "seine", "seinem", "seinen", "seiner", "sich", "sind", "sowie", "sowohl", "statt", "ueber", "und", "unter", "viele", "vom", "von", "vor", "waehrend", "war", "weil", "weitere", "welche", "wenn", "werden", "wie", "wird", "wobei", "wurde", "zum", "zur", "zwei", "zwischen", "anwenden", "beurteilen", "kennen", "unterscheiden", "nachweisen", "durchfuehren", "einordnen", "begruenden", "ermitteln", "identifizieren", "zuordnen", "analysieren", "bestimmen", "planen", "vorbereiten", "erstellen", "entwickeln", "betreuen", "umsetzen", "integrieren", "pruefen", "erbringen", "informieren", "beraten", "definieren", "festlegen", "bewerten", "vornehmen", "unterstuetzen", "aufbereiten", "praesentieren", "auswerten", "einhalten", "ueberpruefen", "abstimmen", "grundlagen", "grundverstaendnis", "merkmale", "methoden", "massnahmen", "moeglichkeiten", "bereich", "bereiche", "beispiel", "beispiele", "aspekte", "kriterien", "arten", "formen", "zwecke", "umfang", "eigene", "folgenden"}

# OCR-Rauschen, das kein Begriff ist. ⚠️ NICHT den Text reparieren – nur von der Messung
# ausnehmen, damit die Liste lesbar bleibt. Der Wortlaut bleibt, wie das Blatt ihn zeigt.
RAUSCHEN = re.compile(r"^(?:\d+|[A-Za-z]?\d+[A-Za-z]?|.{0,3})$")

BEGRIFF = re.compile(r"[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß0-9/\-]{3,}")


def entumlauten(s):
    return (s.lower().replace("ä", "ae").replace("ö", "oe").replace("ü", "ue")
            .replace("ß", "ss"))


def begriffe(text):
    """Kandidaten aus einem Inhaltspunkt. Nur Substantive im weiteren Sinn: Grossschreibung
    oder Versalien. Verben und Fuellwoerter fallen ueber STOPP heraus."""
    aus = []
    for w in BEGRIFF.findall(text):
        k = w.strip("-/")
        if RAUSCHEN.match(k) or entumlauten(k) in STOPP:
            continue
        if not (k[0].isupper() or k.isupper()):
            continue
        aus.append(k)
    # Reihenfolge erhalten, Doppelte entfernen
    gesehen, ergebnis = set(), []
    for k in aus:
        if entumlauten(k) not in gesehen:
            gesehen.add(entumlauten(k))
            ergebnis.append(k)
    return ergebnis


def blaetter(wert):
    """Alle Zeichenketten eines verschachtelten Wertes, egal wie tief."""
    if isinstance(wert, str):
        yield wert
    elif isinstance(wert, dict):
        for v in wert.values():
            yield from blaetter(v)
    elif isinstance(wert, list):
        for v in wert:
            yield from blaetter(v)


# Felder, die AUSDRUECKLICH Nebentext sind. Alles andere zaehlt als Pruefsubstanz.
# ⚠️ DIE RICHTUNG IST ABSICHT. Beim ersten Entwurf war es umgekehrt – eine Liste der
#    Substanz-Felder – und sie war beim ersten Lauf schon unvollstaendig: `matrix`, `aussagen`,
#    `svg` und ein Dutzend weitere Felder fielen still heraus, „Tablet" wurde als gar nicht
#    vorhanden gemeldet, obwohl es zweimal im Pool steht. ►► **EINE POSITIVLISTE VON FELDERN IST
#    BEI 20 FRAGETYPEN JEDES MAL UNVOLLSTAENDIG.** Ein unbekanntes Feld muss als Substanz zaehlen,
#    dann meldet das Werkzeug im Zweifel eine Luecke ZU WENIG statt einer zu viel – und eine
#    Luecke zu wenig kostet nichts, eine zu viel kostet eine Aenderung an richtigem Bestand.
NEBENTEXT_FELDER = {"erklaerungKurz", "erklaerungLang", "distraktorErklaerungen", "verweis",
                    "thema", "modul", "id", "pruefungsteil", "gebiet", "quelle", "hinweisFalsch"}
# Felder, die BEIDES enthalten und deshalb einzeln zerlegt werden.
GEMISCHTE_FELDER = {"optionen", "luecken"}


def substanz_und_nebentext(f):
    """Eine Frage in ihre zwei Textmengen zerlegen. ⚠️ Der Kern dieses Werkzeugs.

    Pruefsubstanz: alles, was der Lerner LIEFERN oder ANKREUZEN muss, um die Frage richtig zu
    beantworten. Nebentext: Erklaerungen, Verweise, Themennamen und die FALSCHEN Antworten.
    """
    s, n = [], []
    for feld, wert in f.items():
        if wert is None:
            continue
        if feld in NEBENTEXT_FELDER:
            n.extend(blaetter(wert))
        elif feld not in GEMISCHTE_FELDER:
            s.extend(blaetter(wert))

    opt = f.get("optionen") or []
    richtig = set()
    if isinstance(f.get("loesungIndex"), int):
        richtig.add(f["loesungIndex"])
    for i in (f.get("loesungIndizes") or []):
        if isinstance(i, int):
            richtig.add(i)
    for i, o in enumerate(opt):
        (s if i in richtig else n).extend(blaetter(o))

    # ⚠️ `luecken` hat ZWEI Gestalten im Bestand, und die zweite hat dieses Werkzeug beim
    #    ersten Lauf zerlegt: `dropdown` fuehrt {optionen, loesung} – dort ist nur die Wahl
    #    Substanz; `lueckentext`/`bild` fuehren eine Liste akzeptierter Schreibweisen – dort ist
    #    JEDE davon eine richtige Antwort und damit Substanz.
    for l in (f.get("luecken") or []):
        if isinstance(l, dict):
            o = l.get("optionen") or []
            i = l.get("loesung")
            for j, x in enumerate(o):
                (s if j == i else n).extend(blaetter(x))
            # ⚠️ Auch hier gilt die Umkehrung: alles ausser den FALSCHEN Optionen ist Substanz.
            #    `akzeptiert` (weitere gueltige Schreibweisen) hat die erste Fassung verloren -
            #    gemeldet hat es die Feldprobe, nicht das Auge (M06-943 „Mehr-Faktor").
            for schluessel, wert in l.items():
                if schluessel not in ("optionen", "loesung"):
                    s.extend(blaetter(wert))
        else:
            s.extend(blaetter(l))
    return entumlauten(" ".join(s)), entumlauten(" ".join(n))


def feldprobe():
    """⚠️ Geht bei der Zerlegung Text verloren?

    Geprueft wird auf BLATTEBENE: jede Zeichenkette jeder Frage – gleich wie tief verschachtelt –
    muss in einem der beiden Toepfe wieder auftauchen. Ohne diese Probe hat die erste Fassung
    14 Feldnamen still verschluckt und „Tablet" als gar nicht vorhanden gemeldet, obwohl es
    zweimal im Pool steht.
    """
    def strom(x):
        return re.sub(r"[^0-9a-z]", "", entumlauten(x))

    fehlend = []
    for f in rohfragen():
        sub, neb = substanz_und_nebentext(f)
        beides = strom(sub + neb)
        for feld, wert in f.items():
            if wert is None:
                continue
            for blatt in blaetter(wert):
                probe = strom(blatt)[:40]
                if probe and probe not in beides:
                    fehlend.append((f.get("id"), feld, blatt[:40]))
                    break
    return fehlend


def rohfragen():
    for pfad in sorted(glob.glob(os.path.join(WURZEL, "pool", "pool_*.json"))):
        d = json.loads(Path(pfad).read_text(encoding="utf-8"))
        yield from (d if isinstance(d, list) else d.get("fragen", []))


def pool():
    aus = []
    for pfad in sorted(glob.glob(os.path.join(WURZEL, "pool", "pool_*.json"))):
        d = json.loads(Path(pfad).read_text(encoding="utf-8"))
        for f in (d if isinstance(d, list) else d.get("fragen", [])):
            sub, neb = substanz_und_nebentext(f)
            aus.append({"id": f.get("id"), "modul": f.get("modul"), "thema": f.get("thema"),
                        "gebiet": f.get("gebiet"), "sub": sub, "neb": neb})
    return aus


def treffer(fragen, begriff):
    b = entumlauten(begriff)
    mit_substanz = [f for f in fragen if b in f["sub"]]
    nur_neben = [f for f in fragen if b not in f["sub"] and b in f["neb"]]
    return mit_substanz, nur_neben


def laden():
    daten_da()
    with open(KATALOG, encoding="utf-8") as fh:
        return json.load(fh)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--luecken", action="store_true")
    p.add_argument("--kreis", help="z. B. 03/02 für Fragenkomplex 03, Themenkreis 02")
    p.add_argument("--begriff")
    a = p.parse_args()
    verloren = feldprobe()
    if verloren:
        for id_, feld, blatt in verloren[:20]:
            print(f"[FEHLER] {id_}: Feld {feld!r} geht bei der Zerlegung verloren ({blatt!r})")
        print(f"⛔ {len(verloren):d} Verlust(e) – die Messung waere wertlos. Erst `substanz_und_nebentext` "
              "erweitern.")
        return 1
    fragen = pool()
    if a.begriff:
        mit, neb = treffer(fragen, a.begriff)
        print(f"{a.begriff!r} – {len(mit):d} Frage(n) mit PRUEFSUBSTANZ, {len(neb):d} nur im Nebentext")
        for f in mit[:30]:
            print("  SUBSTANZ {} {} · {}".format(f["id"], f["gebiet"], f["thema"]))
        for f in neb[:30]:
            print("  nebentext {} {} · {}".format(f["id"], f["gebiet"], f["thema"]))
        return 0

    d = laden()
    gesamt = fehlt = nur_erklaert = 0
    for k in d["fragenkomplexe"]:
        for t in k["themenkreise"]:
            marke = "{}/{}".format(k["nummer"], t["nummer"])
            if a.kreis and a.kreis != marke:
                continue
            zeilen = []
            for punkt in t["punkte"]:
                for b in begriffe(punkt["text"]):
                    mit, neb = treffer(fragen, b)
                    gesamt += 1
                    if mit:
                        continue
                    if neb:
                        nur_erklaert += 1
                        zeilen.append(("nur erklaert", b, len(neb), punkt["text"]))
                    else:
                        fehlt += 1
                        zeilen.append(("FEHLT", b, 0, punkt["text"]))
            if a.luecken and not zeilen:
                continue
            print("\n== {!s}  {!s}".format(marke, t["titel"][:88]))
            if not a.luecken:
                print("   {:d} Inhaltspunkte, {:d} Begriffe ohne Pruefsubstanz".format(len(t["punkte"]), len(zeilen)))
            for art, b, n, quelle in zeilen:
                print(f"   {art!s:<12} {b!s:<34} {quelle[:70]!s}")
    print(f"\n{gesamt:d} Begriffe geprueft · {fehlt:d} ohne jede Erwaehnung · {nur_erklaert:d} nur im Nebentext erklaert")
    print("⚠️ KANDIDATENFILTER, KEIN URTEIL – jede Zeile einzeln gegen den Pool lesen.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
