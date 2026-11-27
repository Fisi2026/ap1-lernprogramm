"""Gegenprobe fuer tools/training-shell/index.js - faehrt den Server mit echtem
JSON-RPC ueber stdin und prueft jeden Zweig an Faellen mit bekannter Antwort.

WARUM: der Sentinel-Zweig entscheidet, ob ein Befehl ueberhaupt laeuft. Ein
Werkzeug, das am ersten Tag gebaut wird, ist am ersten Tag nicht geprueft
(docs/archiv/LEHREN.md). Laeuft in einem eigenen TRAINING_DIR, ruehrt das Projekt nicht an.

  python3 tools/training-shell/probe.py     ->  rc 0 = gruen

Seit Fassung 1.1 (26.09.2026) zusaetzlich: Kladde bucht die ANGEKOMMENE Laenge
(Probe 7 sicherte bis dahin das FALSCHE Verhalten ab), Fassung in der Kopfzeile,
Hintergrund nach TS_ANTWORT_MS, Abbruch, Projektordner-Rueckfall, info.
"""
import json
import json as _json
import os
import os as _os
import subprocess
import sys
import tempfile
import time
from pathlib import Path

# Fassung aus dem Manifest statt fest (09.10.2026: 1.1.0 stand hier fest, die Probe wurde beim Sprung auf 1.1.1 rot)
FASSUNG = _json.loads(Path(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "manifest.json")).read_text(encoding="utf-8"))["version"]

HIER = os.path.dirname(os.path.abspath(__file__))
SERVER = os.path.join(HIER, "index.js")

def fahre(befehle, ordner, env=None, werkzeug="run"):
    """befehle: Liste aus str (command) oder dict (arguments)."""
    zeilen = [json.dumps({"jsonrpc": "2.0", "id": 0, "method": "initialize",
                          "params": {"protocolVersion": "2025-06-18"}})]
    for i, b in enumerate(befehle, start=1):
        arg = b if isinstance(b, dict) else {"command": b}
        zeilen.append(json.dumps({"jsonrpc": "2.0", "id": i, "method": "tools/call",
                                  "params": {"name": werkzeug, "arguments": arg}}))
    umgebung = dict(os.environ, TRAINING_DIR=ordner)
    umgebung.update(env or {})
    r = subprocess.run(["node", SERVER], input="\n".join(zeilen) + "\n",
                       capture_output=True, text=True, encoding="utf-8",
                       errors="replace", env=umgebung, timeout=120, check=False)
    aus = {}
    for z in (r.stdout or "").splitlines():
        try:
            n = json.loads(z)
        except ValueError:
            continue
        if "result" in n and isinstance(n["result"], dict) and n["result"].get("content"):
            aus[n["id"]] = n["result"]["content"][0]["text"]
    return aus

fehler = []
zaehler = [0]
def pruefe(was, ist, soll):
    zaehler[0] += 1
    if ist != soll:
        fehler.append(was)
        print("  [FEHLER] " + was + ": ist " + repr(ist) + ", soll " + repr(soll))
    else:
        print("  [ok] " + was)

def kladde_zeilen(t):
    p = os.path.join(t, "_to_delete", "helfer", "ausgabe_kladde.log")
    if not os.path.exists(p):
        return []
    return [z for z in open(p, encoding="utf-8").read().splitlines() if z and not z.startswith("#")]

with tempfile.TemporaryDirectory() as t:
    KURZ = "echo MARKE_KURZ"
    # 4600 Zeichen: sicher ueber LANG_AB (4000), weit unter der Kuerzungsgrenze (~8190)
    FUELL = "\n".join(["# " + ("f" * 60)] * 75)
    LANG_OHNE = "echo MARKE_LANG\n" + FUELL
    LANG_MIT = LANG_OHNE + "\n#ENDE"
    a = fahre([KURZ, LANG_OHNE, LANG_MIT, LANG_OHNE + "\n#ENDE   "], t)

    print("1) Ein kurzer Befehl laeuft ohne Sentinel")
    pruefe("laeuft", "MARKE_KURZ" in a.get(1, ""), True)
    pruefe("Kopf nennt die angekommene Laenge",
           "BEFEHL=" + str(len(KURZ)) + " Zeichen" in a.get(1, ""), True)

    print("2) Ein langer Befehl OHNE Sentinel wird ABGELEHNT - und nichts laeuft")
    pruefe("Laenge ist wirklich ueber 4000", len(LANG_OHNE) > 4000, True)
    pruefe("abgelehnt", "ABGELEHNT" in a.get(2, ""), True)
    pruefe("nichts ausgefuehrt", "MARKE_LANG" in a.get(2, ""), False)
    pruefe("nennt die angekommene Zeichenzahl", str(len(LANG_OHNE)) in a.get(2, ""), True)
    pruefe("sagt, was zu tun ist", "in Stuecken" in a.get(2, ""), True)

    print("3) Derselbe Befehl MIT Sentinel laeuft")
    pruefe("laeuft", "MARKE_LANG" in a.get(3, ""), True)
    pruefe("nicht abgelehnt", "ABGELEHNT" in a.get(3, ""), False)

    print("4) Leerzeichen hinter dem Sentinel stoeren nicht")
    pruefe("laeuft trotzdem", "MARKE_LANG" in a.get(4, ""), True)

    print("5) SABOTAGE: ein gekuerzter langer Befehl verliert den Sentinel")
    # Genau der Schadensfall: die letzten Zeichen fehlen, der Sentinel ist weg.
    gekuerzt = LANG_MIT[:len(LANG_MIT) - 30]
    b = fahre([gekuerzt], t)
    pruefe("wird abgelehnt statt still ausgefuehrt", "ABGELEHNT" in b.get(1, ""), True)
    pruefe("und der Rest laeuft NICHT", "MARKE_LANG" in b.get(1, ""), False)

    print("6) DIE KLADDE: jeder Aufruf hinterlaesst GENAU EINE Zeile")
    # Der eigentliche Zweck: vollstaendig zaehlen, unabhaengig davon, wann
    # jemand nachsieht. Deshalb wird hier die ZAHL der Zeilen geprueft, nicht
    # ihre Anwesenheit - "da ist was" ist keine Mengenaussage (docs/archiv/LEHREN.md).
    zeilen = kladde_zeilen(t)
    pruefe("Kladde wurde angelegt", len(zeilen) > 0, True)
    # 4 Aufrufe + 1 Sabotage; die zwei abgelehnten laufen nicht und buchen nicht -> 3.
    pruefe("eine Zeile je AUSGEFUEHRTEM Aufruf", len(zeilen), 3)
    teile = zeilen[0].split()
    pruefe("Zeile hat Zeit, Bytes, Zeichen, Rueckgabewert, voll=", len(teile), 5)
    pruefe("Bytes sind eine Zahl > 0", teile[1].isdigit() and int(teile[1]) > 0, True)
    pruefe("Zeichen sind eine Zahl > 0", teile[2].isdigit() and int(teile[2]) > 0, True)
    pruefe("fuenfte Spalte ist voll=<zahl>", teile[4].startswith("voll=") and teile[4][5:].isdigit(), True)

    print("7) Die Kladde bucht die ANGEKOMMENE Antwort, die volle Laenge steht daneben")
    # Bis 1.0 sicherte diese Probe das Gegenteil ab (volle Laenge gebucht) - genau das
    # liess die Wache am 25.09. ~388k statt ~95k melden (BUILD_LOG 52).
    vorher = len(zeilen)
    fahre(["seq 1 20000"], t)   # rund 110000 Zeichen, Antwort bei 40000 gekuerzt
    zeilen2 = kladde_zeilen(t)
    pruefe("eine Zeile dazu", len(zeilen2) - vorher, 1)
    z = zeilen2[-1].split()
    pruefe("gebucht wird hoechstens die Antwort (< 40500 Zeichen)", int(z[2]) < 40500, True)
    pruefe("gebucht wird aber die Antwort, nicht 0 (> 39000)", int(z[2]) > 39000, True)
    pruefe("voll= nennt die erzeugte Laenge (> 100000)", int(z[4][5:]) > 100000, True)

    print("8) Die Kopfzeile nennt die laufende Fassung - und warnt bei Abweichung")
    c = fahre([KURZ], t)
    pruefe("SERVER=<fassung>/<sha8> steht im Kopf", f"SERVER={FASSUNG}/" in c.get(1, ""), True)
    pruefe("ohne Quelle im Projekt keine Warnung", "FASSUNG:" in c.get(1, ""), False)
    q = os.path.join(t, "tools", "training-shell")
    os.makedirs(q)
    with open(SERVER, encoding="utf-8", newline="") as fh:
        quelle = fh.read()
    Path(os.path.join(q, "index.js")).write_text(quelle, encoding="utf-8", newline="")
    c = fahre([KURZ], t)
    pruefe("gleiche Quelle: keine Warnung", "FASSUNG:" in c.get(1, ""), False)
    with open(os.path.join(q, "index.js"), "a", encoding="utf-8", newline="") as fh:
        fh.write("// geaendert\n")
    c = fahre([KURZ], t)
    pruefe("geaenderte Quelle: WARNUNG mit Neustart-Hinweis",
           "FASSUNG:" in c.get(1, "") and "neu starten" in c.get(1, ""), True)

    print("9) DER HINTERGRUND: ein Lauf ueber TS_ANTWORT_MS antwortet trotzdem - und laeuft weiter")
    h = os.path.join(t, "_to_delete", "helfer")
    t0 = time.time()
    d = fahre(["echo FRUEH; sleep 3; echo SPAET"], t, env={"TS_ANTWORT_MS": "1000"})
    antw = d.get(1, "")
    pruefe("Antwort sagt IM HINTERGRUND", "IM HINTERGRUND" in antw, True)
    pruefe("Antwort zeigt, was bis dahin kam", "FRUEH" in antw, True)
    pruefe("Antwort zeigt NICHT, was danach kam", "SPAET" in antw, False)
    name = [w for w in antw.split() if w.startswith("auto-")]
    pruefe("Antwort nennt einen Laufnamen", len(name) > 0, True)
    name = name[0].strip("'") if name else "?"
    # Der Server beendet sich erst, wenn der Hintergrund fertig ist (stdin ist hier zu).
    pruefe("Server wartete auf den Hintergrund (>= 3 s)", time.time() - t0 >= 3, True)
    marke = os.path.join(h, name + ".fertig")
    pruefe(".fertig-Marke im Format von hinter.sh", os.path.exists(marke) and
           Path(marke).read_text(encoding="utf-8").strip() == "rc=0", True)
    txt = os.path.join(h, name + ".txt")
    inhalt = Path(txt).read_text(encoding="utf-8") if os.path.exists(txt) else ""
    pruefe("Ausgabedatei hat ANFANG und ENDE", "FRUEH" in inhalt and "SPAET" in inhalt, True)
    # Der Abholweg `tools/warte.sh <name>` liest genau diese .fertig/.txt; er macht aber
    # cd auf SEIN Projekt, nicht auf dieses TRAINING_DIR - gegengeprueft wird er im
    # echten Betrieb (BUILD_LOG 53), hier nur das Dateiformat.

    print("10) Die Zeitgrenze bricht ab - im Vordergrund und im Hintergrund")
    e = fahre([{"command": "sleep 5; echo NIE", "timeout_ms": 1500}], t)
    pruefe("Vordergrund: ABGEBROCHEN", "ABGEBROCHEN" in e.get(1, ""), True)
    pruefe("Vordergrund: Rest lief nicht", "NIE" in e.get(1, ""), False)
    e = fahre([{"command": "echo X; sleep 6; echo NIE", "timeout_ms": 2500}], t, env={"TS_ANTWORT_MS": "1000"})
    nm = [w.strip("'") for w in e.get(1, "").split() if w.startswith("auto-")]
    nm = nm[0] if nm else "?"
    m = os.path.join(h, nm + ".fertig")
    pruefe("Hintergrund: Marke da, rc != 0", os.path.exists(m) and
           Path(m).read_text(encoding="utf-8").strip() != "rc=0", True)
    inh = Path(os.path.join(h, nm + ".txt")).read_text(encoding="utf-8") if os.path.exists(os.path.join(h, nm + ".txt")) else ""
    pruefe("Hintergrund: ABGEBROCHEN vermerkt, Rest lief nicht", "ABGEBROCHEN" in inh and "NIE" not in inh, True)

    print("11) Projektordner: eine nicht ersetzte Manifest-Variable faellt auf den Benutzerordner zurueck")
    with tempfile.TemporaryDirectory() as heim:
        ziel = os.path.join(heim, "Claude", "Projects", "Training")
        os.makedirs(ziel)
        f = fahre(["pwd"], "${user_config.projektordner}", env={"HOME": heim, "USERPROFILE": heim})
        pruefe("CWD ist <Benutzerordner>/Claude/Projects/Training",
               "CWD=" + ziel in f.get(1, ""), True)

    print("12) info misst die Umgebung (Benutzbarkeit)")
    g = fahre([{}], t, werkzeug="info").get(1, "")
    for wort in ("Projektordner:", "python3", "gh-login", "identitaet", "node_modules", f"SERVER={FASSUNG}/"):
        pruefe("info nennt " + wort, wort in g, True)

if fehler:
    print("PROBE ROT: " + str(len(fehler)) + " Abweichung(en)")
    sys.exit(1)
print("PROBE GRUEN (" + str(zaehler[0]) + " Proben)")
