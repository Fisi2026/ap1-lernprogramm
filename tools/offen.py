#!/usr/bin/env python3
"""Schlusszeile 'Damit offen' aus aufgaben.json erzeugen und gegen BUILD_LOG.md pruefen.
  python3 tools/offen.py zeile     -> druckt die Zeile (in den BUILD_LOG-Eintrag kopieren)
  python3 tools/offen.py --pruefe  -> 0 = Schlusszeile des LETZTEN Eintrags gleich, 1 = Abweichung, 2 = Quelle unlesbar (stumm = rot)
  python3 tools/offen.py --probe   -> baut bekannte Faelle in einem Temp-Ordner, rc 0 nur wenn jeder sein Urteil trifft
Der letzte Eintrag (ab der letzten Zeile mit '## ') muss GENAU EINE 'Damit offen'-Zeile tragen, und sie ist seine letzte
nicht leere Zeile (CLAUDE.md „Schlusszeile“; Gegenpruefung 27.11.2026, BUILD_LOG 311: vorher reichte irgendeine fruehere Zeile).
"""
import json
import sys
import tempfile
from pathlib import Path

STATUS = {"offen", "erledigt"}
MARKE = "**Damit offen:**"


def lade(wurzel):
    d = json.loads(Path(wurzel, "aufgaben.json").read_text(encoding="utf-8"))
    a = d["aufgaben"] if isinstance(d, dict) else None
    if not isinstance(a, list):
        raise TypeError("'aufgaben' ist keine Liste")
    if not all(isinstance(x, dict) for x in a):
        raise TypeError("ein Eintrag ist kein Objekt")
    ids = [x.get("id") for x in a]
    if len(set(ids)) != len(ids):
        raise ValueError("doppelte id")
    for x in a:
        if not all(isinstance(x.get(k), str) and x.get(k) for k in ("id", "titel", "status", "beleg")) or x["status"] not in STATUS:
            raise ValueError(f"Eintrag unvollstaendig oder Status unbekannt: {x.get('id')}")
    return a


def zeile(a):
    offen = [x["titel"] for x in a if x["status"] == "offen"]
    return MARKE + " " + (" · ".join(offen) if offen else "nichts")


def schlusszeile(wurzel):
    """Gibt (zeile|None, grund) des letzten Eintrags zurueck; ValueError, wenn es keinen Eintrag gibt."""
    t = Path(wurzel, "BUILD_LOG.md").read_text(encoding="utf-8").split("\n")
    kopf = [i for i, z in enumerate(t) if z.startswith("## ")]
    if not kopf:
        raise ValueError("kein Eintrag ('## ') im BUILD_LOG")
    rumpf = [z for z in t[kopf[-1] + 1:] if z.strip()]
    treffer = [z for z in rumpf if z.startswith(MARKE)]
    if len(treffer) != 1:
        return None, f"letzter Eintrag hat {len(treffer)} 'Damit offen'-Zeilen statt genau einer"
    if rumpf[-1] != treffer[0]:
        return None, "'Damit offen' ist nicht die letzte Zeile des letzten Eintrags"
    return treffer[0], ""


def pruefe(wurzel="."):
    try:
        z = zeile(lade(wurzel))
        letzte, grund = schlusszeile(wurzel)
    except (OSError, ValueError, KeyError, TypeError, AttributeError) as e:
        return 2, f"Aufgaben: Quelle nicht lesbar ({type(e).__name__}: {e})"
    if letzte is None:
        return 1, f"Aufgaben: {grund} - `python3 tools/offen.py zeile` als Schlusszeile anhaengen"
    if letzte != z:
        return 1, "Aufgaben: Schlusszeile des letzten BUILD_LOG-Eintrags weicht von aufgaben.json ab - `python3 tools/offen.py zeile`"
    return 0, "Aufgaben: Schlusszeile = aufgaben.json"


def probe():
    """Bekannte Faelle (regeln/messen.md: --probe vor dem Bestand, mindestens einer rot). Erwartet: rc je Fall."""
    gut = {"aufgaben": [{"id": "A01", "titel": "eins", "status": "offen", "beleg": "x"},
                        {"id": "A02", "titel": "zwei", "status": "erledigt", "beleg": "y"},
                        {"id": "A03", "titel": "drei · Sonderzeichen „ä“", "status": "offen", "beleg": "z"}]}
    soll = "**Damit offen:** eins · drei · Sonderzeichen „ä“"
    alt = "# Kopf\n\n## 1 - alt\ntext\n**Damit offen:** alt\n\n"
    faelle = [  # (name, aufgaben (dict oder roher Text), BUILD_LOG, erwarteter rc)
        ("gleich", gut, alt + "## 2 - neu\ntext\n" + soll + "\n", 0),
        ("Zeile geaendert", gut, alt + "## 2 - neu\ntext\n" + soll + " x\n", 1),
        ("letzter Eintrag ohne Schlusszeile", gut, alt + "## 1b\n" + soll + "\n\n## 2 - neu\ntext\n", 1),
        ("Schlusszeile nicht zuletzt", gut, alt + "## 2 - neu\n" + soll + "\nnachgeschoben\n", 1),
        ("zwei Schlusszeilen", gut, alt + "## 2 - neu\n" + soll + "\n" + soll + "\n", 1),
        ("Status unbekannt", {"aufgaben": [dict(gut["aufgaben"][0], status="offn")]}, alt, 2),
        ("JSON kaputt", '{"aufgaben": [', alt, 2),
        ("aufgaben keine Liste", {"aufgaben": 5}, alt, 2),
        ("Eintrag kein Objekt", {"aufgaben": ["x"]}, alt, 2),
        ("BUILD_LOG ohne Eintrag", gut, "# nur Kopf\n" + soll + "\n", 2),
        ("nichts offen", {"aufgaben": [gut["aufgaben"][1]]}, alt + "## 2\n**Damit offen:** nichts\n", 0),
    ]
    falsch = 0
    for name, auf, log, erwartet in faelle:
        with tempfile.TemporaryDirectory() as t:
            Path(t, "aufgaben.json").write_text(auf if isinstance(auf, str) else json.dumps(auf, ensure_ascii=False), encoding="utf-8")
            Path(t, "BUILD_LOG.md").write_text(log, encoding="utf-8")
            rc, text = pruefe(t)
        ok = rc == erwartet
        falsch += not ok
        print(("ok     " if ok else "FALSCH ") + f"{name}: rc {rc} (erwartet {erwartet}) {text}")
    print(f"PROBE {'GRUEN' if not falsch else 'ROT'} ({len(faelle) - falsch}/{len(faelle)})")
    return 1 if falsch else 0


def main(arg):
    if arg == "--probe":
        return probe()
    if arg == "zeile":
        try:
            print(zeile(lade(".")))
            return 0
        except (OSError, ValueError, KeyError, TypeError, AttributeError) as e:
            print(f"Aufgaben: Quelle nicht lesbar ({type(e).__name__}: {e})")
            return 2
    rc, text = pruefe(".")
    print(text)
    return rc


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "--pruefe"))
