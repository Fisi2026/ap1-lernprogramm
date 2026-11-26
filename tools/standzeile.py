#!/usr/bin/env python3
"""tools/standzeile.py - die Auslieferungs-Zeile in START_PROMPT.md setzen (N51 A4, 12.10.2026).

  python3 tools/standzeile.py vorab   # LIVE = committet = neu/package.json · PUSH DURCH
  python3 tools/standzeile.py offen   # LIVE = Version auf origin/main · PUSH OFFEN
  python3 tools/standzeile.py --probe # sechs Faelle mit bekannter Antwort (regeln/messen.md A5)

WARUM (Nutzer-Entscheid 12.10.2026, BUILD_LOG 147, „vorab DURCH"): Bis heute stand die Zeile beim Commit
auf „PUSH OFFEN" und brauchte nach dem Push einen EIGENEN Commit fuer „PUSH DURCH" - oder sie wurde zu frueh
umgestellt und check.sh war rot (BUILD_LOG 144: einer von vier roten Laeufen). Jetzt steht sie VOR check.sh
schon so, wie sie nach dem Push stimmt. Das geht, weil check.sh vor dem Commit laeuft: dann liegt noch
nichts ungepusht, 4e2b und 4e2b2 verlangen genau „LIVE = committet · PUSH DURCH".
⛔ Der Preis: zwischen Commit und Push stimmt die Zeile nicht. Darum gilt: nach einem Commit mit Wirkung
   beim Lerner SOFORT pushen. Scheitert der Push, ruft tools/gitc.sh `offen` und committet die Zeile
   (nicht gepusht) - so luegt der Stand auf main nie laenger als bis zum naechsten Push-Versuch.
⛔ `vorab` verweigert (rc 3), wenn schon Commits MIT Wirkung ungepusht liegen (tools/ungepusht.py):
   dann wuerde check.sh (4e2b2) rot - erst die liegenden Commits pushen.
rc 0 = gesetzt/unveraendert · 1 = Zeile kaputt/Probe falsch · 2 = Aufruffehler · 3 = verweigert.
"""
import json
import os
import re
import subprocess
import sys

DATEI = "START_PROMPT.md"
MUSTER = re.compile(r"LIVE beim Lerner: v(\d+\.\d+\.\d+) · committet auf main: v(\d+\.\d+\.\d+) · PUSH (OFFEN|DURCH)")


def setze(text, live, comm, marker):
    """Ersetzt die EINE Auslieferungs-Zeile; wirft ValueError, wenn sie nicht genau einmal da ist."""
    treffer = MUSTER.findall(text)
    if len(treffer) != 1:
        raise ValueError(f"Auslieferungs-Zeile {len(treffer)}x statt 1x")
    return MUSTER.sub(f"LIVE beim Lerner: v{live} · committet auf main: v{comm} · PUSH {marker}", text)


def version_aus(paket_json):
    return json.loads(paket_json)["version"]


def git(*a):
    return subprocess.run(["git", *a], capture_output=True, text=True, check=False)


def probe():
    zeile = "x\n# **LIVE beim Lerner: v2.8.1 · committet auf main: v2.8.1 · PUSH OFFEN**\ny\n"
    faelle = [
        ("vorab nach Bump", lambda: setze(zeile, "2.9.0", "2.9.0", "DURCH"),
         "LIVE beim Lerner: v2.9.0 · committet auf main: v2.9.0 · PUSH DURCH"),
        ("offen nach Fehlschlag", lambda: setze(zeile, "2.8.1", "2.9.0", "OFFEN"),
         "LIVE beim Lerner: v2.8.1 · committet auf main: v2.9.0 · PUSH OFFEN"),
        ("Rest der Datei bleibt", lambda: setze(zeile, "2.8.1", "2.8.1", "DURCH").startswith("x\n# **"), True),
        ("Zeile fehlt -> Fehler", lambda: setze("nichts\n", "1.0.0", "1.0.0", "DURCH"), ValueError),
        ("Zeile doppelt -> Fehler", lambda: setze(zeile + zeile, "1.0.0", "1.0.0", "DURCH"), ValueError),
        ("Version aus package.json", lambda: version_aus('{"name":"x","version":"3.0.0-rc.1"}'), "3.0.0-rc.1"),
    ]
    richtig = 0
    for name, f, soll in faelle:
        try:
            ist = f()
            ok = (soll in ist) if isinstance(soll, str) and isinstance(ist, str) and soll.startswith("LIVE") else ist == soll
        except ValueError:
            ok = soll is ValueError
            ist = "ValueError"
        richtig += ok
        print(("ok    " if ok else "FALSCH") + "  " + name + ("" if ok else f"  (ist: {ist!r})"))
    print(f"PROBE {richtig}/{len(faelle)} richtig")
    return 0 if richtig == len(faelle) else 1


def main():
    if len(sys.argv) != 2 or sys.argv[1] not in ("vorab", "offen", "--probe"):
        print("Aufruf: python3 tools/standzeile.py vorab|offen|--probe", file=sys.stderr)
        return 2
    if sys.argv[1] == "--probe":
        return probe()
    os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
    with open("neu/package.json", encoding="utf-8") as f:
        comm = version_aus(f.read())
    if sys.argv[1] == "vorab":
        u = subprocess.run([sys.executable, "tools/ungepusht.py", "--pruefe"], capture_output=True, text=True, check=False)
        teile = u.stdout.split()
        if len(teile) >= 2 and teile[0] == "OK" and teile[1].isdigit() and int(teile[1]) > 0:
            print(f"[standzeile] ⛔ verweigert: {teile[1]} Commit(s) mit Wirkung liegen ungepusht - erst pushen (tools/gitc.sh push origin main)")
            return 3
        live, marker = comm, "DURCH"
    else:
        r = git("show", "origin/main:neu/package.json")
        if r.returncode != 0:
            print("[standzeile] ⛔ origin/main:neu/package.json nicht lesbar - LIVE unbekannt, nichts gesetzt", file=sys.stderr)
            return 1
        live, marker = version_aus(r.stdout), "OFFEN"
    with open(DATEI, encoding="utf-8", newline="") as f:
        alt = f.read()
    try:
        neu = setze(alt, live, comm, marker)
    except ValueError as e:
        print(f"[standzeile] ⛔ {DATEI}: {e}", file=sys.stderr)
        return 1
    if neu == alt:
        print(f"[standzeile] unveraendert: LIVE v{live} · committet v{comm} · PUSH {marker}")
        return 0
    with open(DATEI, "w", encoding="utf-8", newline="") as f:
        f.write(neu)
    print(f"[standzeile] gesetzt: LIVE v{live} · committet v{comm} · PUSH {marker}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
