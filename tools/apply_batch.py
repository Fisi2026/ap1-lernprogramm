#!/usr/bin/env python3
"""tools/apply_batch.py – NEUE FRAGEN IN EINE POOL-DATEI EINSORTIEREN, mit festen Pruefklassen.

    python3 tools/apply_batch.py --pool pool/pool_m07.json --batch a.json b.json
    python3 tools/apply_batch.py --pool pool/pool_m07.json --batch a.json --write
    ... --neues-thema "Einweisung & Schulung"      (nur noetig, wenn das Thema neu ist)

⚠️ OHNE --write WIRD NICHTS GESCHRIEBEN. Der Probelauf ist die Regel, das Schreiben die Ausnahme.

══════════ WARUM ES DIESES SKRIPT GIBT (2026-07-27) ══════════
Der Einsortier-Helfer war bisher bewusst EPHEMER: je Etappe neu angelegt, danach weg. Diese Idee
zielte auf die DATEN (eine Batch-Datei soll nicht im Projekt liegen bleiben) – nicht auf die
PRUEFLOGIK. Die habe ich jedes Mal aus dem Gedaechtnis neu geschrieben, und in Etappe 5 fehlte
genau die Klasse, die ein liegengebliebenes `"loesungIndizes": null` in einer mc-Frage gefangen
haette. Gefunden habe ich es von Hand.
⚠️ **EINE PRUEFUNG, DIE MAN JEDES MAL NEU ERFINDET, IST JEDES MAL UNVOLLSTAENDIG.** Die Daten
bleiben ephemer, die Pruefklassen nicht.

DIE ZEHN PRUEFKLASSEN
  1. Datei ist gueltiges JSON – und VORHER: keine deutschen Anfuehrungszeichen mit geradem
     Schlusszeichen. `„…"` statt `„…“` hat am 27.07. zweimal die Datei zerlegt; die Fehlermeldung
     von json ist an der Stelle nutzlos ("Expecting ',' delimiter").
  2. ID ist im GESAMTEN Pool frei (nicht nur in der Zieldatei) und passt zum Modul-Praefix.
  3. Thema ist kanonisch: entweder im Bestand vorhanden oder ausdruecklich als --neues-thema erklaert.
  4. Gebiet stimmt mit dem ueberein, das der Bestand fuer dieses Thema fuehrt.
  5. Erklaerungsformat: erste Zeile kein Stichpunkt, >= 2 Zeilen „• ", letzte Zeile „Merke:",
     keine markerlose Zwischenzeile.
  6. KEIN LAENGEN-TELL: bei mc muss mindestens ein Distraktor LAENGER sein als die richtige Antwort.
     ⚠️ Gleichstand zaehlt als Tell – so misst es auch tests/test_didaktik.js.
     Kurzoption-Fragen (laengste Option < 25 Zeichen) sind ausgenommen, ebenfalls wie dort.
  7. Typ-Konsistenz: mc hat loesungIndex und KEIN loesungIndizes, mehrfach umgekehrt;
     distraktorErklaerungen (falls vorhanden) so lang wie optionen.
  8. Keine unbekannten Felder (gemessen am Bestand) und KEIN Feld mit dem Wert null.
  9. FELDTYP wie im Bestand. Nachgeruestet am 27.07., weil `schluesselbegriffe` als LISTE durch
     alle acht Klassen ging – bekannter Name, kein null, richtig geschrieben. Im Bestand ist es
     ein OBJEKT {pflicht: [[...]], kuer: [...]}. Gemeldet hat es erst validate_schema, NACH dem
     Schreiben in den Pool. Ein bekannter Feldname mit falschem Typ war die Luecke von Klasse 8.
 10. KEIN UEBERLANGER DISTRAKTOR: kein Distraktor laenger als MAX_FAKTOR x die richtige Antwort.
     ⚠️ NACHGERUESTET AM 28.07.2026 – UND ZWAR, WEIL KLASSE 6 NUR EINE RICHTUNG PRUEFTE.
     Sie verlangte „mindestens ein Distraktor laenger" und kannte keine Obergrenze. Das Ziel
     „Gleichstand +-15 %" stand seit Wochen in START_PROMPT.md und war NIRGENDS durchgesetzt.
     Gemessene Folge: 65 mc-Fragen im Bestand mit einem Distraktor ueber 1,15 x, Spitzenwert
     3,22 x - ohne dass je ein Test rot wurde. 42 davon wurden am 28.07. von Hand korrigiert.
     ►► EIN EINSEITIGER WAECHTER LAEDT DAZU EIN, IN DIE ANDERE RICHTUNG UEBER DAS ZIEL ZU
     SCHIESSEN. Wer Klasse 6 erfuellen will, verlaengert Distraktoren - ohne Klasse 10 beliebig
     weit. Der Lerner lernt dann „nimm die kuerzeste" statt „nimm die laengste".
     Ausnahmen: laengengrenzen_ausnahmen aus laengen_ausnahmen.json (Bestandsentscheide).
"""
import argparse
import glob
import json
import os
import re
import sys
from pathlib import Path

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUSNAHMEN = set()               # wird in main() aus laengen_ausnahmen.json gefuellt
# ⚠️ Grenzwerte NICHT hier hartkodieren – EINE Quelle fuer test_didaktik.js, apply_batch.py und
#    opt_ersatz.py ist laengen_ausnahmen.json. Drei Kopien koennen auseinanderlaufen, ohne dass
#    etwas rot wird: Ein Waechter mit 1,15 und ein apply_batch mit 1,25 waeren beide gruen.
MIN_OPTIONSLAENGE = None
MAX_FAKTOR = None


def laengen_ausnahmen():
    """Bestandsentscheide UND Grenzwerte aus laengen_ausnahmen.json. Fehlt die Datei, wird NICHT
    stillschweigend mit Vorgabewerten weitergemacht - eine fehlende Liste wuerde Klasse 10 gegen
    Fragen feuern, fuer die es einen Nutzer-Entscheid gibt."""
    global MIN_OPTIONSLAENGE, MAX_FAKTOR
    p = os.path.join(WURZEL, "laengen_ausnahmen.json")
    if not os.path.exists(p):
        fehler(10, f"laengen_ausnahmen.json fehlt (erwartet in {WURZEL!s}). Ohne sie kann Klasse 10 "
                   "Bestandsentscheide nicht von echten Befunden unterscheiden.")
    with open(p, encoding="utf-8") as fh:
        d = json.load(fh)
    g = d.get("grenzwerte") or {}
    MIN_OPTIONSLAENGE = g.get("min_optionslaenge")
    MAX_FAKTOR = g.get("max_faktor")
    if not isinstance(MIN_OPTIONSLAENGE, int) or not isinstance(MAX_FAKTOR, float):
        fehler(10, "laengen_ausnahmen.json: grenzwerte.min_optionslaenge (int) und "
                   "grenzwerte.max_faktor (float) fehlen oder haben den falschen Typ.")
    return set(d.get("ausnahmen", {}))


def fehler(nr, msg):
    print(f"[apply_batch] KLASSE {nr}: {msg}", file=sys.stderr)
    sys.exit(1)


def lade_batch(pfad):
    roh = Path(pfad).read_text(encoding="utf-8")
    # Klasse 1a: deutsches Anfuehrungszeichen mit geradem Schluss. Vor json.loads pruefen,
    # weil die JSON-Fehlermeldung an der Stelle in die Irre fuehrt.
    for m in re.finditer(r'„[^"“]{0,120}"', roh):
        zeile = roh[:m.start()].count("\n") + 1
        fehler(1, f"Zeile {zeile:d}: „…\" mit GERADEM Schlusszeichen. Richtig ist „…“ – so wie hier: {m.group(0)[:60]!s}")
    try:
        return json.loads(roh)
    except json.JSONDecodeError as e:
        fehler(1, f"{pfad} ist kein gueltiges JSON: {e}")


def main():
    for s in (sys.stdout, sys.stderr):  # cp1252-Konsole unter Windows (BUILD_LOG 130/132)
        if hasattr(s, "reconfigure"): s.reconfigure(encoding="utf-8")
    p = argparse.ArgumentParser()
    p.add_argument("--pool", required=True, help="Zieldatei, z. B. pool/pool_m07.json")
    p.add_argument("--batch", required=True, nargs="+")
    p.add_argument("--neues-thema", default=None,
                   help="Thema, das es im Bestand noch NICHT gibt (muss vorher in L.THEMA_RELEVANZ "
                        "und L.THEMA_GEBIET eingetragen sein)")
    p.add_argument("--write", action="store_true")
    a = p.parse_args()
    os.chdir(WURZEL)

    global AUSNAHMEN
    AUSNAHMEN = laengen_ausnahmen()

    bestand = json.loads(Path(a.pool).read_text(encoding="utf-8"))

    # Bestandswissen sammeln: alle IDs poolweit, Thema->Gebiet, bekannte Feldnamen
    alle_ids, thema_gebiet, bekannte_felder = set(), {}, set()
    feldtypen = {}          # Feldname -> Menge der im Bestand vorkommenden Python-Typnamen
    for f in glob.glob("pool/pool_*.json"):
        for q in json.loads(Path(f).read_text(encoding="utf-8")):
            if q.get("id"):
                alle_ids.add(q["id"])
            bekannte_felder |= set(q.keys())
            for k, v in q.items():
                if v is not None:
                    feldtypen.setdefault(k, set()).add(type(v).__name__)
            if q.get("thema") and q.get("gebiet"):
                thema_gebiet.setdefault(q["thema"], set()).add(q["gebiet"])

    neu = []
    for b in a.batch:
        neu += lade_batch(b)

    # Modul-Soll aus dem Dateinamen: NUR das fuehrende M0X, ein Namenszusatz wird abgeschnitten.
    # ⚠️ 2026-07-30: Vorher wurde der ganze Rumpf genommen. Bei pool_m09_unterricht.json ergab das
    #    "M09_UNTERRICHT", und weil das mit "M0" beginnt, feuerte Klasse 2 gegen JEDE korrekte
    #    M09-Frage. Aufgefallen erst heute, weil M09 bis dahin nie einsortiert wurde - die einzige
    #    Pool-Datei mit Namenszusatz war zugleich die einzige, die das Skript nie gesehen hat.
    modul_soll = os.path.basename(a.pool).replace("pool_", "").replace(".json", "").upper()
    m_soll = re.match(r"(M0\d)(?:_|$)", modul_soll)
    if m_soll:
        modul_soll = m_soll.group(1)

    for q in neu:
        i = q.get("id", "<ohne id>")

        # 2) ID frei und Modul-Praefix
        if i in alle_ids:
            fehler(2, f"ID existiert bereits: {i}")
        if q.get("modul") and not i.startswith(q["modul"] + "-"):
            fehler(2, "{}: ID-Praefix passt nicht zu modul={}".format(i, q["modul"]))
        if modul_soll.startswith("M0") and q.get("modul") != modul_soll:
            fehler(2, "{}: modul={} gehoert nicht in {}".format(i, q.get("modul"), a.pool))

        # 3) Thema kanonisch
        th = q.get("thema")
        if th not in thema_gebiet and th != a.neues_thema:
            fehler(3, (f"{i}: Thema '{th}' gibt es im Bestand nicht. Wenn es neu sein SOLL: erst in "
                      "L.THEMA_RELEVANZ und L.THEMA_GEBIET eintragen, dann --neues-thema setzen."))

        # 4) Gebiet passt zum Thema
        if th in thema_gebiet:
            soll = thema_gebiet[th]
            if len(soll) == 1 and q.get("gebiet") not in soll:
                fehler(4, "{}: gebiet={}, der Bestand fuehrt '{}' unter {}".format(i, q.get("gebiet"), th, "/".join(sorted(soll))))

        # 5) Erklaerungsformat
        el = q.get("erklaerungLang", "")
        z = el.split("\n")
        if not el:
            fehler(5, f"{i}: erklaerungLang fehlt")
        if z[0].startswith("•"):
            fehler(5, f"{i}: erste Zeile ist ein Stichpunkt (Kernsatz fehlt)")
        if sum(1 for x in z if x.startswith("• ")) < 2:
            fehler(5, f"{i}: weniger als zwei Stichpunkte")
        if not z[-1].startswith("Merke:"):
            fehler(5, f"{i}: letzte Zeile ist keine Merke-Zeile")
        for n, x in enumerate(z):
            if n not in (0, len(z) - 1) and x.strip() and not x.startswith("• "):
                fehler(5, f"{i}: markerlose Zwischenzeile: {x[:60]}")

        # 6) Laengen-Tell
        if q.get("typ") == "mc":
            opt = q.get("optionen") or []
            li = q.get("loesungIndex")
            if not opt or li is None:
                fehler(7, f"{i}: mc ohne optionen/loesungIndex")
            if max(len(str(o)) for o in opt) >= MIN_OPTIONSLAENGE:
                r = len(opt[li])
                d = max(len(o) for n, o in enumerate(opt) if n != li)
                if r >= d:
                    fehler(6, f"{i}: LAENGEN-TELL – richtige Antwort {r} Zeichen, laengster Distraktor "
                              f"{d}. Mindestens ein Distraktor muss LAENGER sein (Gleichstand zaehlt "
                              "als Tell). ⚠️ Die richtige Antwort NICHT kuerzen.")

                # 10) Obergrenze – die zweite Richtung von Klasse 6.
                if i not in AUSNAHMEN and d > r * MAX_FAKTOR:
                    fehler(10, f"{i}: UEBERLANGER DISTRAKTOR – richtige Antwort {r} Zeichen, "
                               f"laengster Distraktor {d} (Faktor {d / r:.2f}, erlaubt bis {MAX_FAKTOR:.2f}). "
                               "⚠️ Den DISTRAKTOR kuerzen, nicht die richtige Antwort verlaengern. "
                               f"⚠️ Und nicht unter {r + 1} Zeichen – sonst ist die richtige Antwort die "
                               f"laengste und Klasse 6 faellt. Zielfenster: {r + 1} bis {int(r * MAX_FAKTOR)} Zeichen.")

        # 7) Typ-Konsistenz
        if q.get("typ") == "mc" and "loesungIndizes" in q:
            fehler(7, f"{i}: mc-Frage mit loesungIndizes – das Feld gehoert zu 'mehrfach'")
        if q.get("typ") == "mehrfach":
            if not q.get("loesungIndizes"):
                fehler(7, f"{i}: mehrfach ohne loesungIndizes")
            if "loesungIndex" in q:
                fehler(7, f"{i}: mehrfach-Frage mit loesungIndex")
        de = q.get("distraktorErklaerungen")
        if de is not None and q.get("optionen") and len(de) != len(q["optionen"]):
            fehler(7, "{!s}: distraktorErklaerungen ({:d}) != optionen ({:d})".format(i, len(de), len(q["optionen"])))

        # 8) Unbekannte Felder / null-Werte
        for k, v in q.items():
            if k not in bekannte_felder:
                fehler(8, f"{i}: unbekanntes Feld '{k}' (kommt im ganzen Pool nicht vor – Tippfehler?)")
            if v is None:
                fehler(8, f"{i}: Feld '{k}' steht auf null. Weglassen statt null setzen.")

        # 9) FELDTYP wie im Bestand (nachgeruestet 27.07.2026).
        #    ⚠️ ANLASS: In Etappe 6 ging `schluesselbegriffe` als LISTE durch alle acht Klassen –
        #    das Feld ist bekannt, der Wert war null-frei, der Name stimmte. Erst validate_schema
        #    meldete es, nach dem Schreiben in den Pool. Im Bestand ist es ein OBJEKT
        #    {pflicht: [[...]], kuer: [...]}. Ein bekannter Feldname mit falschem Typ ist genau
        #    die Luecke, die Klasse 8 offenlaesst.
        for k, v in q.items():
            typen_im_bestand = feldtypen.get(k)
            if typen_im_bestand and type(v).__name__ not in typen_im_bestand:
                fehler(9, ("{}: Feld '{}' ist ein {}, im Bestand ist es {}. "
                          "(Beispiel: schluesselbegriffe ist ein Objekt mit 'pflicht'/'kuer', keine Liste.)").format(i, k, type(v).__name__, " oder ".join(sorted(typen_im_bestand))))

        alle_ids.add(i)

    print(f"[apply_batch] Alle {len(neu):d} Fragen haben die zehn Pruefklassen bestanden.")

    if a.write:
        bestand += neu
        bestand.sort(key=lambda q: q["id"])
        with open(a.pool, "w", encoding="utf-8", newline="") as fh:  # LF auch unter Windows (BUILD_LOG 132)
            json.dump(bestand, fh, ensure_ascii=False, indent=2)
            fh.write("\n")
        print(f"[apply_batch] GESCHRIEBEN: {a.pool!s} hat jetzt {len(bestand):d} Fragen.")
        print("[apply_batch] ⚠️ JETZT NOCH: node tools/pool_laden.js --pruefe  +  betroffene Suiten (fragen.js gibt es seit N29 Teil 2 nicht mehr).")
    else:
        print("[apply_batch] Probelauf – nichts geschrieben. Mit --write anwenden.")


if __name__ == "__main__":
    main()
