#!/usr/bin/env python3
"""tools/e3_gegenprobe.py – Gegenprobe zu den E3-Verweiskorrekturen (24.08.2026).

⚠️ WARUM MIT EINEM ANDEREN VERFAHREN: START_PROMPT Abschnitt 6 – „Die Gegenpruefung darf
nicht dieselbe sein, an der die Korrektur sich orientiert hat." Korrigiert wurde nach
INHALTLICHEM Urteil (Abschnittsinventar lesen, Frage lesen). Geprueft wird hier rein
MECHANISCH: kommen die Stichworte des neuen Verweistextes im Zielabschnitt der Kursdatei
ueberhaupt vor?

Ein Treffer beweist nichts, aber KEIN Treffer ist ein Kandidat zum Nachlesen – und bei
einer belegten Luecke der Lernunterlage ist er erwartet (Entscheid Option 1).

Aufruf: python3 tools/e3_gegenprobe.py            (nur die Korrekturauftraege)
        python3 tools/e3_gegenprobe.py --alle    (jeder nummerierte Verweis des Pools)
        python3 tools/e3_gegenprobe.py --intern  (die Verweise der KURSDATEIEN UNTEREINANDER)
        python3 tools/e3_gegenprobe.py --streng  (--alle PLUS jedes einzelne fehlende
                                                  Stichwort, nach Begriff aggregiert)
⚠️ --streng aendert die Ausgabe von --alle NICHT, es haengt einen Block an: check.sh liest
   zwei Zeilen daraus per sed und darf nichts anderes zu sehen bekommen.
"""
import glob
import json
import os
import re
import sys
from pathlib import Path

from poolzugang import fragen

BASIS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STRENG = "--streng" in sys.argv
STOPP = {"und", "oder", "der", "die", "das", "den", "dem", "des", "ein", "eine", "einer", "eines", "im", "in", "am", "an", "auf", "von", "zu", "zur", "zum", "fuer", "für", "mit", "bei", "als", "aus", "nach", "ueber", "über", "vor", "je", "pro", "sowie", "deren", "dessen", "ihre", "ihren", "modul", "abschnitt", "abschnitte", "praxisbeispiel", "typische", "aufgabenstellungen", "merksaetze", "merksätze", "selbsttest", "gekoppelt", "seine", "ihrem", "diesem", "jenem", "dabei", "dazu", "daran"}
# ⚠️ KALIBRIERT AM 31.08.2026 FUER --streng, an Faellen mit bekannter Antwort:
#   * „gekoppelt" war mit 10 Nennungen der haeufigste Treffer ueberhaupt - und ein reines
#     Verbindungswort aus dem Verweismuster „X gekoppelt mit Y". Fehlalarm, jetzt in STOPP.
#   * „zaehlschleife"/„zaehlschleifen" (7 Fragen) hat NULL Treffer in allen neun Kursdateien -
#     eine ECHTE Luecke. Sie muss sichtbar bleiben, und sie ist es.
#   * „referenzmodell" (6) ist der seit dem 31.08. dokumentierte Wortform-Fehlalarm
#     („OSI-Referenzmodell" gegen die Ueberschrift „OSI-Modell") und steht bewusst NICHT in
#     STOPP: er ist erklaerbar, aber kein Muell.
# ⛔ NICHT aufgenommen, obwohl mehrfach gemeldet: software, management, planung, berechnung,
#   vergleich, umfang, ueberblick. Das sind Fachbegriffe - wer sie ausnimmt, macht genau die
#   Luecken unsichtbar, fuer die das Werkzeug gebaut wurde.

def kursdatei(modul):
    n = modul[1:]                                   # "M04" -> "04"
    tr = glob.glob(os.path.join(BASIS, n + "_*.md"))
    return tr[0] if tr else None

def abschnitte(pfad, praefix):
    """{'4.6': 'text des abschnitts'} – ohne die globalen Schlussabschnitte."""
    z = Path(pfad).read_text(encoding="utf-8").split("\n")
    erg, akt = {}, None
    for l in z:
        m = re.match(r"^## (" + praefix + r"\.\d)\b", l)
        if m:
            akt = m.group(1); erg[akt] = [l]   # ⚠️ die UEBERSCHRIFT gehoert dazu: viele Verweise
            continue                            # zitieren genau sie ("Abschnitt 2.2 Zielgruppen-
                                                # gerechte Bedarfsanalyse ..."), und ihre Worte
                                                # stehen nicht zwangslaeufig im Fliesstext.
        if re.match(r"^## ", l) and not re.match(r"^## " + praefix + r"\.\d", l):
            akt = None                              # globaler Abschluss-Teil zaehlt nicht
            continue
        if akt: erg[akt].append(l)
    return {k: "\n".join(v).lower() for k, v in erg.items()}

def worte(text):
    """⚠️ NACHGESCHAERFT beim ersten Lauf: Die erste Fassung liess Bindestriche stehen und
       suchte „osi-referenzmodell" woertlich – der Text fuehrt „OSI-Modell". 55 Meldungen,
       fast alle Komposita-Fehlalarme. Jetzt: an Bindestrichen TRENNEN und ein Wort auch dann
       als getroffen werten, wenn sein 6-Zeichen-Stamm im Text vorkommt (Deklination,
       Fugen-s, Plural). **Ein mechanischer Test braucht selbst eine Kalibrierung, bevor
       seine Ausgabe etwas bedeutet.**"""
    roh = re.split(r"[^0-9A-Za-zÄÖÜäöüß]+", text.lower())
    return [w for w in roh if len(w) >= 4 and w not in STOPP and not re.match(r"^\d+$", w)]

def trifft(w, text):
    if w in text: return True
    return len(w) >= 6 and w[:6] in text

def alle_verweise():
    """Modus --alle: dieselbe Probe ueber JEDEN nummerierten Verweis des Pools, nicht nur ueber
       die heute geaenderten. Findet Bestandsfehler, die der inhaltliche Lauf uebersehen hat."""
    F = fragen()  # N29 Teil 2 (E40): pool/*.json ueber tools/pool_laden.js
    cache, gesamt, ohne, luecken = {}, 0, [], {}
    for f in F:
        v = str(f.get("verweis") or "")
        ziele = re.findall(r"Abschnitte?\s+(\d\.\d)((?:\s*(?:,|und|bis|/)\s*\d\.\d)*)", v)
        flach = []
        for a, b in ziele:
            flach.append(a); flach += re.findall(r"\d\.\d", b or "")
        flach = sorted(set(flach))
        if not flach: continue
        # ⚠️ Ein Verweis darf auf ein ANDERES Modul zeigen (M04-026 -> Modul 01, weil
        #    Support-Level in Modul 04 fehlen). Das Zielmodul steht im Text, nicht im Feld.
        mm = re.search(r"Modul\s+(\d\d)", v)
        modul = ("M" + mm.group(1)) if mm else f.get("modul", "")
        pfad = kursdatei(modul)
        if not pfad: continue
        praefix = modul[2:] if modul[1] == "0" else modul[1:]
        if modul not in cache: cache[modul] = abschnitte(pfad, praefix.lstrip("0") or "0")
        sek = cache[modul]
        gesamt += 1
        tail = v.split(flach[-1], 1)[-1]
        ws = worte(tail)
        if not ws: continue
        text = " ".join(sek.get(z, "") for z in flach)
        if not text:
            ohne.append((f["id"], flach, "ABSCHNITT EXISTIERT NICHT", v)); continue
        fehlt = [w for w in ws if not trifft(w, text)]
        if len(fehlt) == len(ws):
            ohne.append((f["id"], flach, f"0 von {len(ws):d} Stichworten", v))
        for w in fehlt:
            luecken.setdefault(w, []).append((f["id"], "+".join(flach)))
    print(f"POOLWEIT geprueft: {gesamt:d} nummerierte Verweise")
    print(f"Ohne jeden Stichwort-Treffer: {len(ohne):d}\n")
    for fid, z, grund, v in sorted(ohne):
        print("  {!s:<9} {!s:<9} {!s:<24} {!s}".format(fid, "+".join(z), grund, v[:78]))
    if STRENG: streng_bericht(luecken)


# ══════════ --streng: NACH BEGRIFF AGGREGIEREN, NICHT NACH FRAGE (31.08.2026) ══════════
# ⚠️⚠️ WARUM ES DAS GIBT: Der Vorgabelauf meldet eine Frage nur, wenn KEIN einziges Stichwort
#    des Verweistextes im Zielabschnitt vorkommt. Am 31.08. hat er deshalb B90 NICHT gefunden:
#    M03-601 verwies auf "Cloud Computing Modelle: IaaS, PaaS, SaaS", der Abschnitt heisst
#    "Cloudloesungen" - "cloud" traf, also war die Frage unauffaellig. Dass IaaS und PaaS in
#    KEINER der neun Kursdateien vorkamen, blieb unsichtbar. Gefunden wurde es von Hand.
#    ►► Dieselbe Handmessung fiel am selben Tag ein drittes Mal an (B100: 14 Fragen zur
#    Einweisung auf einen Abschnitt ohne einen Satz darueber). TASKLIST-Sparregel 6: beim
#    zweiten Mal gehoert eine Messung ins Werkzeug.
# ⚠️ NACH BEGRIFF aggregiert, nicht nach Frage - eine Luecke wird erst sichtbar, wenn man
#    sieht, dass DERSELBE Begriff aus mehreren Verweisen fehlt.
# ⛔ KANDIDATENFILTER, KEIN URTEIL. Wortformen schlagen hier genauso an wie echte Luecken
#    ("referenzmodell" gegen "OSI-Modell" ist KEIN Fehler). Jeder Treffer wird einzeln gegen
#    die Kursdatei gelesen.
def streng_bericht(luecken):
    mehr = sorted(((len(v), w, v) for w, v in luecken.items() if len(v) >= 2), reverse=True)
    einzeln = sum(1 for v in luecken.values() if len(v) == 1)
    print("\n" + "=" * 70)
    print("--streng: JEDES fehlende Stichwort, nach BEGRIFF aggregiert")
    print("=" * 70)
    print(f"Begriffe, die in KEINEM Zielabschnitt vorkommen: {len(luecken):d}")
    print(f"  davon aus mehr als einem Verweis: {len(mehr):d}   (nur einmal: {einzeln:d})\n")
    print("  Anz  Begriff              Fragen")
    for n, w, v in mehr:
        ids = ", ".join(sorted({f for f, z in v})[:6])
        if len({f for f, z in v}) > 6: ids += ", ..."
        print(f"  {n:3}  {w[:20]:<20} {ids}")
    print("\n  ⛔ Kandidatenfilter, kein Urteil: Wortformen schlagen genauso an wie Luecken.")

def e2_kandidaten():
    """Modus --e2: Fuer jede Frage OHNE Abschnittsnummer den passendsten Abschnitt ihres Moduls
       vorschlagen. Rein mechanisch: Stichworte des Verweistextes gegen jeden Abschnitt zaehlen.
       ⚠️ KEIN Urteil, ein Kandidatenfilter – wie die Themenmatrix. Zweck: die offene Klasse E2
       einmal beziffern, statt sie zu schaetzen. Ein Vorschlag mit 0 Treffern heisst: das Modul
       fuehrt den Stoff nicht (Luecke), nicht dass die Frage schlecht ist."""
    F = fragen()  # N29 Teil 2 (E40): pool/*.json ueber tools/pool_laden.js
    cache, klar, unklar, ohne = {}, [], [], []
    for f in F:
        modul = f.get("modul", "")
        if modul == "M08":                       # Nutzer-Entscheid 24.08.: dauerhaft ausgenommen
            continue
        v = str(f.get("verweis") or "")
        if re.search(r"Abschnitte?\s+\d\.\d", v, re.IGNORECASE): continue
        pfad = kursdatei(modul)
        if not pfad: continue
        praefix = modul[2:].lstrip("0") or modul[2:]
        if modul not in cache: cache[modul] = abschnitte(pfad, praefix)
        ws = worte(re.sub(r"^Modul\s+\d\d[^–\-,:]*[–\-,:]?", "", v))
        if not ws: ohne.append((f["id"], v)); continue
        wertung = []
        for sek, text in sorted(cache[modul].items()):
            wertung.append((sum(1 for w in ws if trifft(w, text)), sek))
        wertung.sort(reverse=True)
        best, zweit = wertung[0], (wertung[1] if len(wertung) > 1 else (0, "-"))
        if best[0] == 0: ohne.append((f["id"], v))
        elif best[0] > zweit[0]: klar.append((f["id"], best[1], best[0], zweit[0], v))
        else: unklar.append((f["id"], best[1] + "/" + zweit[1], best[0], zweit[0], v))
    ges = len(klar) + len(unklar) + len(ohne)
    print(f"E2 gesamt (ohne M08): {ges:d}")
    print(f"  EINDEUTIGER Kandidat (ein Abschnitt fuehrt): {len(klar):d}")
    print(f"  MEHRDEUTIG (zwei Abschnitte gleichauf):      {len(unklar):d}")
    print(f"  KEIN Treffer -> Modul fuehrt den Stoff nicht: {len(ohne):d}")
    jeM = {}
    for lst in (klar, unklar): 
        for e in lst: jeM.setdefault(e[0][:3], [0,0,0])[0 if lst is klar else 1] += 1
    for e in ohne: jeM.setdefault(e[0][:3], [0,0,0])[2] += 1
    print("\n  Modul   eindeutig  mehrdeutig  ohne")
    for m in sorted(jeM): print("  {:<6} {:8} {:11} {:5}".format(m, *jeM[m]))
    print("\n--- OHNE TREFFER (Kandidaten fuer weitere Luecken) ---")
    for fid, v in sorted(ohne): print(f"  {fid!s:<9} {v[:82]!s}")

# ⚠️ OHNE \n IN DER NEGATION – gemessen am 06.09.: der Satz „Als Faustregel gilt eine
#    Abweichung bis etwa 5 % als tolerierbar (siehe Modul 07, Abschnitt 7.7)" laeuft ueber
#    einen Zeilenumbruch. Ein zeilenweiser Lauf schnitt ihn auf „tolerierbar (…)" zusammen und
#    meldete einen Fehlalarm mit genau EINEM Stichwort. Der Satz ist die Einheit, nicht die Zeile.
# ⚠️ ZWEIMAL NACHGESCHAERFT AM 06.09., beide Male an einem Fall mit bekannter Antwort:
#   1. OHNE \n IN DER NEGATION waere richtig – der Satz „Als Faustregel gilt eine Abweichung bis
#      etwa 5 % als tolerierbar (siehe Modul 07, Abschnitt 7.7)" laeuft ueber einen Zeilenumbruch,
#      ein zeilenweiser Lauf schnitt ihn auf „tolerierbar (…)" zusammen: ein Stichwort, Fehlalarm.
#   2. ABER OHNE JEDE GRENZE FRISST DER SATZ DIE GANZE TABELLE. In Markdown-Tabellen steht kein
#      Punkt; der Verweis in 03 zog 63 „Stichworte" aus den Tabellenzeilen darueber an sich.
#      ►► Grenzen sind deshalb: Satzzeichen, LEERZEILE, Tabellenstrich `|` und Listenanfang.
VERWEISSATZ = re.compile(
    r"[^.!?|\n]*(?:\n(?![\s|*\-#]|$)[^.!?|\n]*)*?"
    r"Abschnitt\s+(\d\.\d)"
    r"[^.!?|\n]*(?:\n(?![\s|*\-#]|$)[^.!?|\n]*)*[.!?]?")
# ⚠️ Das Zielmodul wird NICHT im selben Muster gefangen. Ein gieriger Satzanfang frisst sonst
#    das „Modul 07, " vor dem „Abschnitt 7.7", die Gruppe bleibt leer, und der Verweis wird auf
#    das EIGENE Modul bezogen - gemessen am 06.09.: sechs Verweise wurden dadurch faelschlich
#    als „Abschnitt existiert nicht" gemeldet. Gesucht wird es deshalb hinterher, und zwar das
#    LETZTE „Modul NN" vor der Abschnittsangabe.
MODULVOR = re.compile(r"Modul\s+(\d\d)")


def interne_verweise():
    """⚠️ DIE VERWEISE DER KURSDATEIEN UNTEREINANDER – BIS ZUM 04.09. VON NICHTS BEWACHT.

    ANLASS (B131, 04.09.2026): Abschnitt 3.1 endete mit dem Satz „Welcher Schicht des
    OSI-Modells welches Geraet zugeordnet ist, steht in Abschnitt 3.2" – und in 3.2 stand es
    nicht. `--alle` und der Verweis-Ziele-Guard pruefen nur POOL -> Kursdatei; ein Verweis
    KURSDATEI -> KURSDATEI war unbewacht. Fehlerklasse B90/B91, eine Ebene hoeher.

    ⛔ **EINE REINE EXISTENZPRUEFUNG HAETTE B131 NICHT GEFUNDEN.** Abschnitt 3.2 gab es ja.
    Falsch war, was er VERSPRACH.

    ⛔⛔ **UND DIE STICHWORTPROBE HAETTE ES AUCH NICHT.** Am 06.09. gemessen, an genau diesem Fall:
    der Zustand VOR der Reparatur erreichte 6 von 12 Stichworten (50 %), der Zustand danach 8 von
    12 (67 %). **50 % ist aber auch der Wert von zwei voellig gesunden Verweisen** (01 -> 7.7 und
    04 -> 3.3). Eine Schwelle dazwischen waere an EINEM Fall kalibriert und wuerde zwei richtige
    Verweise rot machen. ►► **DAS SEMANTISCHE VERSPRECHEN EINES VERWEISES IST MASCHINELL NICHT
    PRUEFBAR** - „3.2 erwaehnt OSI und Protokolle" und „3.2 sagt, welches Geraet auf welcher
    Schicht liegt" sehen fuer eine Wortzaehlung gleich aus. Wer das pruefen will, liest den
    Zielabschnitt; das ist die Substanzpruefung und bleibt Handarbeit.

    ⚠️ Was hier bleibt, ist deshalb bewusst schmal, aber exakt:
       FEHLER  = der Zielabschnitt existiert nicht (heute 0 von 10).
       HINWEIS = kein einziges Stichwort trifft. Kein Fehler - siehe oben, die Quote traegt nicht.
    """
    dateien = sorted(glob.glob(os.path.join(BASIS, "0?_*.md")) +
                     glob.glob(os.path.join(BASIS, "99_*.md")))
    cache, treffer = {}, []
    for pfad in dateien:
        name = os.path.basename(pfad)
        eigen = name[:2]
        with open(pfad, encoding="utf-8") as fh:
            text = fh.read()
        if True:
            for m in VERWEISSATZ.finditer(text):
                zeilennr = text.count("\n", 0, m.start()) + 1
                satz = " ".join(m.group(0).split())
                if not satz:
                    continue
                ziel = m.group(1)
                vorlauf = m.group(0)[:m.group(0).find("Abschnitt")]
                mods = MODULVOR.findall(vorlauf)
                zielmodul = mods[-1] if mods else eigen
                # Ein Verweis auf den eigenen Abschnitt ist eine Ueberschrift, kein Verweis.
                if zielmodul == eigen and ziel.split(".")[0] != eigen.lstrip("0"):
                    pass
                zpfad = kursdatei("M" + zielmodul)
                if not zpfad:
                    treffer.append((name, zeilennr, ziel, "MODUL HAT KEINE KURSDATEI", satz))
                    continue
                praefix = zielmodul.lstrip("0") or "0"
                if zielmodul not in cache:
                    cache[zielmodul] = abschnitte(zpfad, praefix)
                inhalt = cache[zielmodul].get(ziel)
                if inhalt is None:
                    treffer.append((name, zeilennr, ziel, "ABSCHNITT EXISTIERT NICHT", satz))
                    continue
                # Die Verweis-Formel selbst darf nicht mitzaehlen.
                rumpf = re.sub(r"(Modul\s+\d\d[,.]?\s*)?Abschnitt\s+\d\.\d", " ", satz)
                ws = [w for w in worte(rumpf) if w not in ("steht", "siehe", "modul")]
                if not ws:
                    continue
                if not [w for w in ws if trifft(w, inhalt)]:
                    treffer.append((name, zeilennr, ziel,
                                    f"0 von {len(ws):d} Stichworten", satz))
    gesamt = 0
    for pfad in dateien:
        gesamt += len(VERWEISSATZ.findall(Path(pfad).read_text(encoding="utf-8")))
    print(f"INTERN geprueft: {gesamt:d} Verweise der Kursdateien untereinander")
    hart = [t for t in treffer if "EXISTIERT NICHT" in t[3] or "KEINE KURSDATEI" in t[3]]
    print(f"Ziel existiert nicht: {len(hart):d}")
    print(f"Ohne jeden Stichwort-Treffer: {len(treffer) - len(hart):d}\n")
    for name, nr, ziel, grund, satz in treffer:
        print(f"  {name:<46} Z.{nr:<5} -> {ziel}  {grund:<24} {satz[:70]}")


def main():
    for s in (sys.stdout, sys.stderr):  # cp1252-Konsole unter Windows (BUILD_LOG 133/134)
        if hasattr(s, "reconfigure"): s.reconfigure(encoding="utf-8")
    if "--intern" in sys.argv: return interne_verweise()
    if "--alle" in sys.argv or STRENG: return alle_verweise()
    if "--e2" in sys.argv: return e2_kandidaten()
    auftraege = sorted(glob.glob(os.path.join(BASIS, "tools", "migration", "e3_*.json")))
    if not auftraege: raise SystemExit("keine Auftragsdateien gefunden")
    cache, gesamt, ohne = {}, 0, []
    for a in auftraege:
        for fid, verweis in sorted(json.loads(Path(a).read_text(encoding="utf-8")).items()):
            mods = re.findall(r"\b(\d)\.\d\b", verweis)
            ziele = re.findall(r"\b(\d\.\d)\b", verweis)
            if not ziele: continue
            modul = "M0" + mods[0]
            pfad = kursdatei(modul)
            if not pfad: continue                   # M08 hat keine Kursdatei
            if modul not in cache: cache[modul] = abschnitte(pfad, mods[0])
            sek = cache[modul]
            gesamt += 1
            tail = verweis.split(ziele[-1], 1)[1]
            ws = worte(tail)
            if not ws: continue
            text = " ".join(sek.get(z, "") for z in ziele)
            if not text:
                ohne.append((fid, ziele, "ABSCHNITT EXISTIERT NICHT", verweis)); continue
            treffer = [w for w in ws if trifft(w, text)]
            if not treffer:
                ohne.append((fid, ziele, f"0 von {len(ws):d} Stichworten", verweis))
    print(f"Geprueft: {gesamt:d} korrigierte Verweise aus {len(auftraege):d} Auftragsdateien")
    print(f"Ohne jeden Stichwort-Treffer im Zielabschnitt: {len(ohne):d}\n")
    for fid, z, grund, v in ohne:
        print("  {!s:<9} {!s:<9} {!s:<24} {!s}".format(fid, "+".join(z), grund, v[:80]))

if __name__ == "__main__":
    main()
