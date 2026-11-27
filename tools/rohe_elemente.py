#!/usr/bin/env python3
"""tools/rohe_elemente.py - der P7-Waechter des Neubaus (N25, Abschnitt D in docs/plaene/PLAN_NEUBAU.md).

Meldet jedes rohe HTML-Bedienelement <input|select|textarea|table|details|summary|button>
in neu/src AUSSERHALB von components/ui/ und AUSSERHALB der Tests, das nicht in
neu/rohe_elemente.json mit Grund ausgenommen ist.

DREI URTEILE, NICHT ZWEI:
  * rc=0  "ROHE: n Funde, n ausgenommen, 0 gemeldet"      - geprueft, sauber
  * rc=1  Fund ohne Ausnahme ODER Ausnahme ohne Fund       - rot
  * rc=2  WERKZEUG STUMM (neu/src fehlt, keine .tsx, Liste fehlt/kaputt) - rot, nie gruen
⛔ Eine Ausnahme, zu der es keinen Fund mehr gibt, ist ROT: eine Liste, die mehr ausnimmt,
   als es Funde gibt, verdeckt den naechsten (BUILD_LOG 21.09., P7-Vorarbeit).
⛔ Kommentare werden ausgeblendet (auch {/* ... */}); Zeilennummern bleiben erhalten.
⚠️ GRENZE: misst die SCHREIBWEISE, nicht die Bedeutung (steht auch in der Liste, `_grenze`).

BENUTZUNG
  python3 tools/rohe_elemente.py              # prueft neu/src gegen neu/rohe_elemente.json
  python3 tools/rohe_elemente.py --selbsttest # Faelle mit BEKANNTER Antwort, im Temp-Ordner
"""
import json
import os
import re
import shutil
import sys
import tempfile
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROH = ("input", "select", "textarea", "table", "details", "summary", "button")
MUSTER = re.compile(r"<(" + "|".join(ROH) + r")(?=[\s>/])")


def ohne_kommentare(t):
    def leer(m):
        return re.sub(r"[^\n]", " ", m.group(0))
    t = re.sub(r"/\*.*?\*/", leer, t, flags=re.DOTALL)
    t = re.sub(r"//[^\n]*", leer, t)
    return t


def scanne(wurzel):
    """Liefert (funde, zahl_gelesener_dateien)."""
    funde, n = [], 0
    for wz, _, dateien in os.walk(wurzel):
        wz = wz.replace("\\", "/")
        if "/components/ui" in wz + "/":
            continue
        for d in sorted(dateien):
            if not d.endswith((".tsx", ".ts")) or ".test." in d:
                continue
            p = wz + "/" + d
            with open(p, encoding="utf-8", newline="") as fh:
                roh = fh.read()
            n += 1
            for m in MUSTER.finditer(ohne_kommentare(roh)):
                funde.append((p, roh[:m.start()].count("\n") + 1, m.group(1)))
    return funde, n


def pruefe(basis):
    """rc, zeilen. basis = Ordner, der neu/src und neu/rohe_elemente.json enthaelt."""
    src = os.path.join(basis, "neu", "src")
    liste = os.path.join(basis, "neu", "rohe_elemente.json")
    if not os.path.isdir(src):
        return 2, ["STUMM: neu/src fehlt - nichts gemessen"]
    try:
        aus = json.loads(Path(liste).read_text(encoding="utf-8"))["ausnahmen"]
        paare = {(a["datei"], a["element"]) for a in aus if a.get("grund", "").strip()}
        if len(paare) != len(aus):
            return 2, ["STUMM: Ausnahme ohne Grund oder doppelt in neu/rohe_elemente.json"]
    except (OSError, ValueError, KeyError, TypeError, AttributeError) as e:   # fehlt, kaputt, falsche Form
        return 2, [f"STUMM: neu/rohe_elemente.json nicht lesbar ({type(e).__name__!s})"]
    funde, n = scanne(src)
    if n == 0:
        return 2, ["STUMM: keine .ts/.tsx in neu/src gelesen - nichts gemessen"]
    rel = lambda p: "neu/src" + p.replace("\\", "/").split("neu/src", 1)[1]
    gemeldet = [(rel(p), z, e) for p, z, e in funde if (rel(p), e) not in paare]
    getroffen = {(rel(p), e) for p, z, e in funde}
    verwaist = sorted(paare - getroffen)
    zeilen = [f"ROHE: {len(funde)} Funde in {n} Dateien, {len(funde) - len(gemeldet)} ausgenommen, {len(gemeldet)} gemeldet, {len(verwaist)} Ausnahme(n) ohne Fund"]
    zeilen += ["  roh: {}:{} <{}>".format(*f) for f in gemeldet]
    zeilen += ["  Ausnahme ohne Fund: {} <{}>".format(*v) for v in verwaist]
    return (1 if gemeldet or verwaist else 0), zeilen


def selbsttest():
    """Faelle mit BEKANNTER Antwort - jeder Zweig, auch der stumme, muss einmal anschlagen."""
    def baue(dateien, ausnahmen):
        t = tempfile.mkdtemp(prefix="rohe_st_")
        os.makedirs(os.path.join(t, "neu"))
        for pfad, inhalt in dateien.items():
            p = os.path.join(t, pfad)
            os.makedirs(os.path.dirname(p), exist_ok=True)
            with open(p, "w", encoding="utf-8") as fh:
                fh.write(inhalt)
        if ausnahmen is not None:
            Path(os.path.join(t, "neu", "rohe_elemente.json")).write_text(json.dumps({"ausnahmen": ausnahmen}), encoding="utf-8")
        return t
    A = {"datei": "neu/src/f/X.tsx", "element": "input", "grund": "im Satz"}
    ROHX = {"neu/src/f/X.tsx": "export const X = () => <input value='' />;\n"}
    faelle = [
        ("rohes <input> ohne Ausnahme -> rot", ROHX, [], 1),
        ("dasselbe mit Ausnahme -> gruen", ROHX, [A], 0),
        ("<input> nur im Kommentar -> gruen",
         {"neu/src/f/X.tsx": "// <input>\nexport const X = () => <p>{/* <button> */}</p>;\n"}, [], 0),
        ("components/ui und .test. zaehlen nicht -> gruen",
         {"neu/src/components/ui/input.tsx": "const I = () => <input />;\n",
          "neu/src/f/X.test.tsx": "render(<button />);\n",
          "neu/src/f/Y.tsx": "export const Y = 1;\n"}, [], 0),
        ("Ausnahme ohne Fund -> rot", {"neu/src/f/Y.tsx": "export const Y = 1;\n"}, [A], 1),
        ("Ausnahme ohne Grund -> stumm", ROHX, [dict(A, grund="")], 2),
        ("neu/src fehlt -> stumm, nicht gruen", {}, [], 2),
        ("keine .tsx gelesen -> stumm", {"neu/src/f/leer.css": "a{}\n"}, [], 2),
        ("Ausnahmeliste fehlt -> stumm", ROHX, None, 2),
    ]
    falsch = 0
    for name, dateien, aus, soll in faelle:
        t = baue(dateien, aus)
        try:
            ist, _ = pruefe(t)
        finally:
            shutil.rmtree(t, ignore_errors=True)
        gut = ist == soll
        falsch += not gut
        print("  {} rc={} (soll {})  {}".format("ok  " if gut else "FALSCH", ist, soll, name))
    print(f"SELBSTTEST: {len(faelle) - falsch:d} von {len(faelle):d} Faellen richtig")
    return 1 if falsch else 0


if __name__ == "__main__":
    if "--selbsttest" in sys.argv:
        sys.exit(selbsttest())
    rc, zeilen = pruefe(".")
    print("\n".join(zeilen))
    sys.exit(rc)
