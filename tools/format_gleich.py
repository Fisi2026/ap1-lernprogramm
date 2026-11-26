#!/usr/bin/env python3
"""format_gleich.py - beweist, dass umgestellte %-Formatierungen genau so formatieren wie vorher.

Entstanden 13.10.2026 (N45 W2, BUILD_LOG 161) fuer ruff UP031: "x %s" % a  ->  "x {}".format(a) / f"x {a}".
Vergleicht je Datei den Stand <ref> (Vorgabe HEAD) mit dem Arbeitsbaum:
  1. Jeder %-Ausdruck mit Literal links, den es im Arbeitsbaum nicht mehr gibt, hat in seinem Zeilenbereich
     (difflib-Abgleich, Umbauten ziehen Zeilen zusammen) genau ein Gegenstueck (.format()-Aufruf oder f-String) mit denselben Argumenten
     (gleiche Ausdruecke, gleiche Reihenfolge, Syntaxbaum-Vergleich).
  2. Ersetzt man alle Paare durch Platzhalter, ist der restliche Syntaxbaum gleich - sonst wurde
     nebenbei etwas anderes geaendert.
  3. Wertprobe: alt  fmt % werte  ==  neu  fmt.format(*werte)  fuer Beispielwerte des BELEGTEN Typs.
     Wirft schon die alte Zeile mit einem Beispielwert, passt der Beleg nicht zur Zeile (rot).
Die Typen stehen in einer Belegdatei (JSON), je Stelle von Hand aus dem Code begruendet:
  {"tools/x.py:12": {"typen": ["str", "int"], "grund": "fid aus sys.argv; len(...)"}}
  Typen: int (echter int, kein bool) · ganz (int oder bool - braucht {:d}) · float · zahl (int oder float) ·
  str · wert (beliebig, nur kein Tupel - %s/%r ohne Breite). "stern": true heisst: alt "%s=%d" % kv, neu "{}={}".format(*kv)
  (auch "x" % ((m,) + tuple(w)) -> .format(m, *w)).
  Mehrere Stellen auf einer Zeile: "datei:zeile:2" usw. (nach Spalte). Unbenutzte Belege sind rot.
Was es NICHT beweist: dass der Beleg stimmt. Den schreibt ein Mensch; das Werkzeug prueft, dass
Formatstring und Argumente fuer genau diesen Typ gleich sind und sonst nichts geaendert wurde.

Aufruf:  python3 tools/format_gleich.py --belege <json> [--ref HEAD] [datei.py ...]
         (ohne Dateien: alle .py, die git diff --name-only <ref> nennt)
         python3 tools/format_gleich.py --probe     (19 bekannte Faelle, 8 davon muessen rot sein)
rc 0 = alles bewiesen · 1 = Abweichung · 2 = Aufruffehler
"""
import argparse
import ast
import difflib
import json
import subprocess
import sys
from pathlib import Path

WURZEL = Path(__file__).resolve().parent.parent

BEISPIELE = {
    "int": [0, 1, -1, 7, 42, 100, 12345, -999, 10**12],
    "float": [0.0, 1.5, -2.25, 0.1, 1e-07, 123456.789, 1e20, 3.0, -0.0, 2.675],
    "str": ["", "abc", "äöü ß", "%s {} %%", "a\nb", " x ", "x" * 30, "{0}"],
}
BEISPIELE["ganz"] = [*BEISPIELE["int"], True, False]
BEISPIELE["zahl"] = BEISPIELE["int"] + BEISPIELE["float"]
BEISPIELE["wert"] = [*BEISPIELE["str"], 0, -3, 3.5, None, [1, "a"], {"a": 1}, True, b"x", frozenset()]


class Fehler(Exception):
    pass


def dump(knoten, platz):
    """Syntaxbaum als Text ohne Positionen; Knoten aus `platz` (id -> Name) werden zu ihrem Platzhalter."""
    if id(knoten) in platz:
        return platz[id(knoten)]
    if isinstance(knoten, ast.AST):
        teile = [f"{f}={dump(getattr(knoten, f, None), platz)}" for f in knoten._fields]
        return f"{type(knoten).__name__}({', '.join(teile)})"
    if isinstance(knoten, list):
        return "[" + ", ".join(dump(k, platz) for k in knoten) + "]"
    return repr(knoten)


def ist_prozent(k):
    return (isinstance(k, ast.BinOp) and isinstance(k.op, ast.Mod)
            and isinstance(k.left, ast.Constant) and isinstance(k.left.value, str))


def ist_format(k):
    return (isinstance(k, ast.Call) and isinstance(k.func, ast.Attribute) and k.func.attr == "format"
            and isinstance(k.func.value, ast.Constant) and isinstance(k.func.value.value, str))


def fstring_zerlegen(k):
    """f-String -> (Formatstring fuer .format, Argument-Ausdruecke)."""
    fmt, args = [], []
    for teil in k.values:
        if isinstance(teil, ast.Constant):
            fmt.append(teil.value.replace("{", "{{").replace("}", "}}"))
            continue
        spec = ""
        if teil.format_spec is not None:
            if not all(isinstance(s, ast.Constant) for s in teil.format_spec.values):
                raise Fehler("f-String mit verschachteltem Format")
            spec = ":" + "".join(s.value for s in teil.format_spec.values)
        konv = "" if teil.conversion == -1 else "!" + chr(teil.conversion)
        fmt.append("{" + konv + spec + "}")
        args.append(teil.value)
    return "".join(fmt), args


def neu_zerlegen(k):
    if isinstance(k, ast.JoinedStr):
        return fstring_zerlegen(k)
    if k.keywords:
        raise Fehler(".format mit Schluesselwort-Argumenten")
    return k.func.value.value, list(k.args)


def tiefe_sortiert(baum, pruef):
    """Knoten, die `pruef` erfuellen, innerste zuerst (fuer Verschachtelung)."""
    tiefe = {}

    def lauf(k, t):
        if pruef(k):
            tiefe[id(k)] = (t, k)
        for kind in ast.iter_child_nodes(k):
            lauf(kind, t + 1)
    lauf(baum, 0)
    return [k for _, k in sorted(tiefe.values(), key=lambda x: (-x[0], x[1].lineno, x[1].col_offset))]


def zeilen_karte(alt_text, neu_text):
    """Alte Zeile -> Bereich (von, bis) der neuen Zeilen, in dem sie jetzt steht (difflib).
    Noetig, weil ein Umbau Zeilen zusammenzieht und alles darunter verschiebt."""
    karte = {}
    sm = difflib.SequenceMatcher(None, alt_text.split("\n"), neu_text.split("\n"), autojunk=False)
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        for i in range(i1, i2):
            karte[i + 1] = (j1 + 1 + i - i1,) * 2 if op == "equal" else (j1 + 1, max(j2, j1 + 1))
    return lambda k: (min(karte[z][0] for z in range(k.lineno, k.end_lineno + 1)),
                      max(karte[z][1] for z in range(k.lineno, k.end_lineno + 1)))


def alt_signaturen(alt, p_alt):
    """Moegliche Argumentlisten des alten Ausdrucks -> [(liste, stern)].
    "x" % (a, b) -> a, b · "x" % kv -> kv oder *kv · "x" % ((m,) + tuple(w)) -> m, *w."""
    r = alt.right
    if isinstance(r, ast.Tuple):
        return [([dump(e, p_alt) for e in r.elts], False)]
    if (isinstance(r, ast.BinOp) and isinstance(r.op, ast.Add) and isinstance(r.left, ast.Tuple)
            and isinstance(r.right, ast.Call) and getattr(r.right.func, "id", None) == "tuple"
            and len(r.right.args) == 1 and not r.right.keywords):
        return [([dump(e, p_alt) for e in r.left.elts] + ["*" + dump(r.right.args[0], p_alt)], True)]
    return [([dump(r, p_alt)], False), (["*" + dump(r, p_alt)], True)]


def gegenstueck(alt, kandidaten, p_alt, p_neu, bereich):
    """Erster freier Kandidat im Zeilenbereich mit denselben Argumenten -> (Knoten, stern) oder (None, False)."""
    moeglich = alt_signaturen(alt, p_alt)
    for kand in kandidaten:
        if not bereich[0] <= kand.lineno <= bereich[1] or id(kand) in p_neu:
            continue
        _, args = neu_zerlegen(kand)
        ist = ["*" + dump(a.value, p_neu) if isinstance(a, ast.Starred) else dump(a, p_neu) for a in args]
        for soll, stern in moeglich:
            if ist == soll:
                return kand, stern
    return None, False


def paare_finden(alt_baum, neu_baum, karte):
    """-> (Liste (alt, neu, stern), Platzhalter alt, Platzhalter neu)."""
    p_alt, p_neu, paare = {}, {}, []
    neu_kand = tiefe_sortiert(neu_baum, lambda k: ist_format(k) or isinstance(k, ast.JoinedStr))
    neu_rest = tiefe_sortiert(neu_baum, ist_prozent)
    for nr, alt in enumerate(tiefe_sortiert(alt_baum, ist_prozent)):
        name, bereich = f"__P{nr}__", karte(alt)
        gleich = [n for n in neu_rest if bereich[0] <= n.lineno <= bereich[1] and id(n) not in p_neu
                  and dump(n, p_neu) == dump(alt, p_alt)]
        if gleich:
            p_alt[id(alt)] = p_neu[id(gleich[0])] = name
            continue
        treffer, stern = gegenstueck(alt, neu_kand, p_alt, p_neu, bereich)
        if treffer is None:
            raise Fehler(f"Zeile {alt.lineno}: %-Ausdruck ohne Gegenstueck mit denselben Argumenten")
        p_alt[id(alt)] = p_neu[id(treffer)] = name
        paare.append((alt, treffer, stern))
    return paare, p_alt, p_neu


def werte_reihen(typen):
    listen = [BEISPIELE[t] for t in typen]
    laenge = max(len(x) for x in listen)
    return [[x[(i + j) % len(x)] for j, x in enumerate(listen)] for i in range(laenge)]


def wertprobe(alt, neu, stern, beleg):
    typen = beleg.get("typen")
    if not typen or any(t not in BEISPIELE for t in typen):
        raise Fehler(f"Beleg ohne gueltige typen ({typen}); erlaubt: {sorted(BEISPIELE)}")
    if bool(beleg.get("stern")) != stern:
        raise Fehler(f"stern im Beleg ({bool(beleg.get('stern'))}) passt nicht zum Code ({stern})")
    fmt_neu, args = neu_zerlegen(neu)
    if not stern and len(args) != len(typen):
        raise Fehler(f"{len(args)} Argumente, aber {len(typen)} Typen belegt")
    for reihe in werte_reihen(typen):
        try:
            soll = alt.left.value % tuple(reihe)
        except (TypeError, ValueError) as e:
            raise Fehler(f"alte Zeile wirft schon mit {reihe!r} ({e}) - Beleg passt nicht") from e
        try:
            ist = fmt_neu.format(*reihe)
        except (TypeError, ValueError, IndexError, KeyError) as e:
            raise Fehler(f"neu wirft mit {reihe!r}: {e}") from e
        if ist != soll:
            raise Fehler(f"mit {reihe!r}: alt {soll!r} != neu {ist!r}")


def schluessel(datei, paare):
    """Belegschluessel je Paar: datei:zeile, bei mehreren auf einer Zeile datei:zeile:2 ..."""
    je_zeile, aus = {}, []
    for alt, _, _ in sorted(paare, key=lambda p: (p[0].lineno, p[0].col_offset)):
        n = je_zeile[alt.lineno] = je_zeile.get(alt.lineno, 0) + 1
        aus.append((f"{datei}:{alt.lineno}" + (f":{n}" if n > 1 else ""), alt))
    return {id(a): s for s, a in aus}


def datei_pruefen(datei, alt_text, neu_text, belege, benutzt):
    """-> Liste der Meldungen (leer = bewiesen)."""
    alt_baum, neu_baum = ast.parse(alt_text), ast.parse(neu_text)
    try:
        paare, p_alt, p_neu = paare_finden(alt_baum, neu_baum, zeilen_karte(alt_text, neu_text))
    except Fehler as e:
        return [f"ROT {datei}: {e}"]
    if dump(alt_baum, p_alt) != dump(neu_baum, p_neu):
        return [f"ROT {datei}: ausser den Paaren hat sich der Syntaxbaum geaendert"]
    meld, namen = [], schluessel(datei, paare)
    for alt, neu, stern in paare:
        sch = namen[id(alt)]
        if sch not in belege:
            meld.append(f"ROT {sch}: kein Beleg")
            continue
        benutzt.add(sch)
        try:
            wertprobe(alt, neu, stern, belege[sch])
        except Fehler as e:
            meld.append(f"ROT {sch}: {e}")
    print(f"  {datei}: {len(paare)} Paare, {len(paare) - len(meld)} bewiesen")
    return meld


def git(*args):
    r = subprocess.run(["git", *args], cwd=WURZEL, capture_output=True, text=True, encoding="utf-8", check=False)
    if r.returncode:
        raise Fehler(f"git {' '.join(args)}: {r.stderr.strip()}")
    return r.stdout


def lauf(belege_pfad, ref, dateien):
    belege = json.loads(Path(belege_pfad).read_text(encoding="utf-8"))
    if not dateien:
        dateien = [d for d in git("diff", "--name-only", ref, "--", "*.py").split() if d != "tools/format_gleich.py"]
    meld, benutzt = [], set()
    for d in dateien:
        meld += datei_pruefen(d, git("show", f"{ref}:{d}"), (WURZEL / d).read_text(encoding="utf-8"), belege, benutzt)
    meld += [f"ROT {s}: Beleg ohne Stelle" for s in sorted(set(belege) - benutzt)]
    print("\n".join(meld))
    print(f"FORMAT_GLEICH {'ROT' if meld else 'GRUEN'}: {len(dateien)} Dateien, {len(benutzt)} Belege benutzt, {len(meld)} Abweichung(en)")
    return 1 if meld else 0


PROBE = [
    # (Name, alt, neu, Belege, gruen erwartet)
    ("wert {}", 'x = "a %s" % b\n', 'x = "a {}".format(b)\n', {"p:1": {"typen": ["wert"]}}, True),
    ("f-String !r und .2f", 'x = "%r: %.2f" % (k, v)\n', 'x = f"{k!r}: {v:.2f}"\n',
     {"p:1": {"typen": ["str", "float"]}}, True),
    ("Breite links", 'x = "%-5s|" % s\n', 'x = "{:<5}|".format(s)\n', {"p:1": {"typen": ["str"]}}, True),
    ("%% und int", 'x = "%d %%" % n\n', 'x = f"{n} %"\n', {"p:1": {"typen": ["int"]}}, True),
    ("Stern", 'x = ", ".join("%s=%d" % kv for kv in d)\n', 'x = ", ".join("{}={}".format(*kv) for kv in d)\n',
     {"p:1": {"typen": ["str", "int"], "stern": True}}, True),
    ("Tupel plus tuple()", 'print("%-4s %3d %3d" % ((m,) + tuple(w[m])))\n', 'print("{:<4} {:3} {:3}".format(m, *w[m]))\n',
     {"p:1": {"typen": ["str", "int", "int"], "stern": True}}, True),
    ("verschachtelt", 'x = "%s - %s" % (a, "%d B" % n)\n', 'x = "{} - {}".format(a, f"{n} B")\n',
     {"p:1": {"typen": ["str", "str"]}, "p:1:2": {"typen": ["int"]}}, True),
    ("ganz mit {:d}", 'x = "Option %d" % i\n', 'x = f"Option {i:d}"\n', {"p:1": {"typen": ["ganz"]}}, True),
    ("ROT ganz ohne :d (bool)", 'x = "Option %d" % i\n', 'x = f"Option {i}"\n', {"p:1": {"typen": ["ganz"]}}, False),
    ("ROT %d mit float", 'x = "%d" % n\n', 'x = "{}".format(n)\n', {"p:1": {"typen": ["zahl"]}}, False),
    ("ROT Breite rechts", 'x = "%5s|" % s\n', 'x = "{:5}|".format(s)\n', {"p:1": {"typen": ["str"]}}, False),
    ("ROT vertauscht", 'x = "%s-%s" % (a, b)\n', 'x = "{}-{}".format(b, a)\n',
     {"p:1": {"typen": ["str", "str"]}}, False),
    ("ROT nebenbei geaendert", 'x = "%s" % a\ny = 1\n', 'x = "{}".format(a)\ny = 2\n',
     {"p:1": {"typen": ["str"]}}, False),
    ("ROT Beleg fehlt", 'x = "%s" % a\n', 'x = "{}".format(a)\n', {}, False),
    ("ROT wert mit Breite", 'x = "%-9s" % a\n', 'x = "{:<9}".format(a)\n', {"p:1": {"typen": ["wert"]}}, False),
    ("ROT Beleg passt nicht zur alten Zeile", 'x = "%d" % a\n', 'x = "{}".format(a)\n',
     {"p:1": {"typen": ["str"]}}, False),
    ("Zeilen verschoben", 'x = ("%s"\n     % a)\ny = "%d" % n\n', 'x = "{}".format(a)\ny = f"{n}"\n',
     {"p:1": {"typen": ["str"]}, "p:3": {"typen": ["int"]}}, True),
    ("ROT Zeilen vertauscht", 'x = "%s" % a\nz = 1\ny = "%5s" % a\n', 'x = "{:>5}".format(a)\nz = 1\ny = "{}".format(a)\n',
     {"p:1": {"typen": ["str"]}, "p:3": {"typen": ["str"]}}, False),
    ("unveraendert bleibt %", 'x = "%s" % a\ny = "%d" % n\n', 'x = "%s" % a\ny = f"{n}"\n',
     {"p:2": {"typen": ["int"]}}, True),
]


def probe():
    falsch = 0
    for name, alt, neu, belege, soll in PROBE:
        benutzt = set()
        meld = datei_pruefen("p", alt, neu, belege, benutzt)
        meld += [f"ROT {s}: Beleg ohne Stelle" for s in sorted(set(belege) - benutzt)]
        ok = (not meld) == soll
        falsch += not ok
        print(f"  {'ok    ' if ok else 'FALSCH'} {name}: {'gruen' if not meld else meld[0]}")
    print(f"PROBE {'GRUEN' if not falsch else 'ROT'}: {len(PROBE) - falsch}/{len(PROBE)} richtig")
    return 1 if falsch else 0


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0], formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--belege")
    ap.add_argument("--ref", default="HEAD")
    ap.add_argument("--probe", action="store_true")
    ap.add_argument("dateien", nargs="*")
    a = ap.parse_args()
    if a.probe:
        return probe()
    if not a.belege:
        ap.print_help()
        return 2
    try:
        return lauf(a.belege, a.ref, a.dateien)
    except Fehler as e:
        print(f"ABBRUCH: {e}")
        return 2


if __name__ == "__main__":
    sys.exit(main())
