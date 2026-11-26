#!/usr/bin/env python3
"""tools/schluessel_setzen.py – `schluesselbegriffe` einer Frage setzen (2026-09-09).

WARUM ES DAS GIBT: die Runde "Trennschaerfe Freitext" fasst 25 Fragen an. START_PROMPT Abschnitt 3
warnt vor Wegwerf-Skripten fuer genau solche Serien, und das Rezept fuer Pool-Korrekturen steht
dort ebenfalls: Block abgrenzen, alten Wert suchen, auf GENAU EINE Fundstelle pruefen, ersetzen,
json.loads als Syntaxprobe VOR dem Schreiben, Sicherung vorher.

⛔⛔ WARUM NICHT ueber json.load/json.dump der GANZEN Datei – am 09.09. GEMESSEN, nicht vermutet:
   Eine Nullprobe (laden, unveraendert zurueckschreiben, `git status` muss leer sein) hat DREI
   Bestandsabweichungen gefunden, die ein "apply_batch-treues" Schreiben zu 2745 geaenderten
   Zeilen aufgeblasen haette:
     1. sort(key=id) gehoert zum EINSORTIEREN neuer Fragen, nicht zur Feldaenderung – dreizehn
        Pool-Dateien liegen unsortiert auf main.
     2. Nicht jede Pool-Datei endet mit einer Schluss-Newline.
     3. pool_m08.json ist ab M08-301 mit DREI statt vier Leerzeichen eingerueckt.
   ►► Deshalb ROHTEXT-ERSATZ: alles ausser dem einen Feld bleibt Byte fuer Byte stehen.
   ►► Und die Einrueckung wird aus dem VORGEFUNDENEN Block abgeleitet, nie angenommen.

EINGEBAUTE GEGENPROBE (Lehre 4 vom 07.09.): nach dem Ersatz wird die Datei erneut geparst und
Frage fuer Frage gegen den Stand davor gehalten. Weicht irgendetwas ausser `schluesselbegriffe`
der Ziel-ID ab, wird NICHTS geschrieben.

Schema-Sicherungen: pflicht/kuer sind Listen; ein Eintrag ist String ODER Liste mit MINDESTENS
ZWEI Alternativen (Klasse-9-Falle vom 04.09.: ["7"] wirft die Frage still aus dem Pool);
hoechstens 4 Pflichtgruppen (test_freitext, "zu streng").

Aufruf:
    python3 tools/schluessel_setzen.py --id M01-013 --pflicht '[["a","b"],"c"]' [--kuer '[...]'] [--trocken]
    python3 tools/schluessel_setzen.py --nullprobe        # schreibt jede Datei unveraendert zurueck
"""
import argparse
import glob
import json
import os
import shutil
import sys
import tempfile
import time

for _s in (sys.stdout, sys.stderr):  # cp1252-Konsole unter Windows (BUILD_LOG 134)
    if hasattr(_s, "reconfigure"): _s.reconfigure(encoding="utf-8")

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POOL = os.path.join(WURZEL, "pool")


def dateien():
    return sorted(glob.glob(os.path.join(POOL, "*.json")))


def roh(pfad):
    with open(pfad, encoding="utf-8") as fh:
        return fh.read()


def objekt_ende(text, start):
    """Index HINTER der schliessenden Klammer des Objekts, das bei text[start] == '{' beginnt.
    Zaehlt Klammern und ueberspringt Strings samt Escapes – ein naives Zaehlen wuerde an einer
    geschweiften Klammer IN einem Fragetext scheitern."""
    assert text[start] == "{"
    i, tiefe, in_str, esc = start, 0, False, False
    while i < len(text):
        c = text[i]
        if in_str:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == '"':
                in_str = False
        elif c == '"':
            in_str = True
        elif c == "{":
            tiefe += 1
        elif c == "}":
            tiefe -= 1
            if tiefe == 0:
                return i + 1
        i += 1
    sys.exit("ABBRUCH: keine schliessende Klammer gefunden – Datei nicht angefasst.")


def pruefe_gruppen(name, wert):
    if not isinstance(wert, list):
        sys.exit(f"ABBRUCH: {name} ist keine Liste.")
    for e in wert:
        if isinstance(e, str):
            if not e.strip():
                sys.exit(f"ABBRUCH: leerer Eintrag in {name}.")
        elif isinstance(e, list):
            if len(e) < 2:
                sys.exit(f"ABBRUCH: {name} enthaelt {e!r} – eine Alternativliste braucht MINDESTENS ZWEI "
                     "Eintraege, sonst wirft das Schema die Frage still aus dem Pool.")
            if not all(isinstance(x, str) and x.strip() for x in e):
                sys.exit(f"ABBRUCH: {name} enthaelt eine Liste mit Nicht-Strings.")
        else:
            sys.exit(f"ABBRUCH: {name} enthaelt {e!r} (weder String noch Liste).")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--id")
    p.add_argument("--pflicht")
    p.add_argument("--kuer")
    p.add_argument("--trocken", action="store_true")
    p.add_argument("--nullprobe", action="store_true")
    a = p.parse_args()

    if a.nullprobe:
        for f in dateien():
            t = roh(f)
            with open(f, "w", encoding="utf-8") as fh:
                fh.write(t)
        print("[schluessel] Nullprobe geschrieben. `git status --porcelain pool/` muss LEER sein.")
        return

    if not a.id or not a.pflicht:
        sys.exit("Aufruf: --id <ID> --pflicht '<json>' [--kuer '<json>'] | --nullprobe")

    pflicht = json.loads(a.pflicht)
    pruefe_gruppen("pflicht", pflicht)
    if len(pflicht) > 4:
        sys.exit(f"ABBRUCH: {len(pflicht):d} Pflichtgruppen – test_freitext laesst hoechstens 4 zu.")
    kuer = json.loads(a.kuer) if a.kuer else None
    if kuer is not None:
        pruefe_gruppen("kuer", kuer)

    # ── 1) DIE POOL-DATEI WIRD GEMESSEN, NICHT GERATEN (Lehre 08.09.) ──────────────────────────
    marke = f'"id": "{a.id}"'
    treffer = [f for f in dateien() if marke in roh(f)]
    if len(treffer) != 1:
        sys.exit(f"ABBRUCH: {a.id!s} steht in {len(treffer):d} Dateien: {treffer!s}")
    pfad = treffer[0]
    text = roh(pfad)
    if text.count(marke) != 1:
        sys.exit(f"ABBRUCH: {a.id!s} steht {text.count(marke):d} mal in {pfad!s}.")
    vorher = json.loads(text)

    # ── 2) Den Frageblock abgrenzen ────────────────────────────────────────────────────────────
    pos = text.index(marke)
    start = text.rindex("{", 0, pos)
    ende = objekt_ende(text, start)
    block = text[start:ende]
    if block.count('"schluesselbegriffe"') != 1:
        sys.exit("ABBRUCH: {!s} hat {:d} schluesselbegriffe-Felder.".format(a.id, block.count('"schluesselbegriffe"')))

    fpos = block.index('"schluesselbegriffe"')
    zeilenanfang = block.rindex("\n", 0, fpos) + 1
    einzug = block[zeilenanfang:fpos]                    # Einrueckung der Feldzeile, wie vorgefunden
    if einzug.strip():
        sys.exit("ABBRUCH: schluesselbegriffe steht nicht am Zeilenanfang – Rezept greift nicht.")
    # Schrittweite aus DIESER Datei ableiten: Feldzeile gegen die Objektzeile darueber.
    obj_zeilenanfang = text.rindex("\n", 0, start) + 1
    obj_einzug = text[obj_zeilenanfang:start]
    schritt = max(1, len(einzug) - len(obj_einzug))

    wert_start = block.index("{", fpos)
    wert_ende = objekt_ende(block, wert_start)
    alt_roh = block[wert_start:wert_ende]
    alt = json.loads(alt_roh)

    neu = {"pflicht": pflicht, "kuer": kuer if kuer is not None else alt.get("kuer", [])}
    neu_roh = json.dumps(neu, ensure_ascii=False, indent=schritt)
    neu_roh = "\n".join((einzug + z if i else z) for i, z in enumerate(neu_roh.split("\n")))

    print(f"[schluessel] {a.id!s} in {os.path.relpath(pfad, WURZEL)!s} (Einzug {len(einzug):d}, Schritt {schritt:d})")
    print("  ALT pflicht: " + json.dumps(alt.get("pflicht"), ensure_ascii=False))
    print("  NEU pflicht: " + json.dumps(neu["pflicht"], ensure_ascii=False))
    if kuer is not None:
        print("  ALT kuer   : " + json.dumps(alt.get("kuer"), ensure_ascii=False))
        print("  NEU kuer   : " + json.dumps(neu["kuer"], ensure_ascii=False))

    neu_text = text[:start] + block[:wert_start] + neu_roh + block[wert_ende:] + text[ende:]

    # ── 3) Syntaxprobe UND Feld-fuer-Feld-Gegenprobe VOR dem Schreiben ─────────────────────────
    nachher = json.loads(neu_text)                       # Syntaxprobe (keine Formalitaet, 30.07.)
    if len(vorher) != len(nachher):
        sys.exit(f"ABBRUCH: Fragenzahl haette sich geaendert ({len(vorher):d} -> {len(nachher):d}).")
    abweichungen = []
    for v, n in zip(vorher, nachher):
        if v.get("id") != n.get("id"):
            sys.exit("ABBRUCH: Reihenfolge haette sich geaendert.")
        for k in set(v) | set(n):
            if v.get(k) != n.get(k) and not (n.get("id") == a.id and k == "schluesselbegriffe"):
                abweichungen.append(n.get("id") + "." + k)
    if abweichungen:
        sys.exit("ABBRUCH: unerwartete Abweichungen: " + ", ".join(abweichungen[:10]))
    if nachher[[q["id"] for q in nachher].index(a.id)]["schluesselbegriffe"] != neu:
        sys.exit("ABBRUCH: der geschriebene Wert ist nicht der gewuenschte.")

    if a.trocken:
        print("[schluessel] Trockenlauf – Gegenprobe bestanden, nichts geschrieben.")
        return

    sicher = os.path.join(tempfile.gettempdir(), f"schluessel_{os.path.basename(pfad)!s}_{int(time.time()):d}.json")
    shutil.copy2(pfad, sicher)
    with open(pfad, "w", encoding="utf-8") as fh:
        fh.write(neu_text)
    print(f"[schluessel] GESCHRIEBEN (Sicherung: {sicher!s}).")
    print("[schluessel] ⚠️ JETZT NOCH: bash tools/suite.sh freitext")


if __name__ == "__main__":
    main()
