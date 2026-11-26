#!/usr/bin/env python3
"""tools/sabotage_vt.py - GEGENPROBE FUER VITEST IN EINEM AUFRUF (N30, 22.09.2026).

  python3 tools/sabotage_vt.py --datei src/kern/rechner.ts --alt 'a * b' --neu 'a + b' \
          --test src/kern/rechner.test.ts [--nullprobe]
  Mehrzeilig: --alt-datei / --neu-datei (Inhalt der Datei ist das Muster, bytegenau).
  Pfade relativ zu neu/ (ein fuehrendes "neu/" wird abgeschnitten).

Das Gegenstueck zu tools/sabotage.sh (alte Suiten), gleiche drei Zusagen:
  1. ZUSICHERUNG VOR DEM LAUF: Muster nicht GENAU EINMAL -> rc 3, nichts geaendert, kein Lauf.
  2. URTEIL UMGEKEHRT: vitest ROT (Tests failed) -> rc 0 = bestanden; GRUEN -> rc 1 = unbemerkt.
  3. WIEDERHERSTELLUNG IMMER (try/finally), Pruefsumme davor = danach, sonst rc 4 und laut.
Dazu, was sabotage.sh nicht kann:
  * rc 5 = KEIN TESTLAUF: vitest fiel, aber nicht an einem Test (Datei fehlt, "No test files",
    Uebersetzungsfehler ohne Testzahl). Ein Abbruch darf nicht wie ein bemerkter Fehler aussehen.
  * --nullprobe: erst UNVERAENDERT fahren; ist das schon rot, rc 6 - dann misst die Sabotage nichts.
Bytegenau: gelesen und geschrieben wird binaer (keine CRLF-Wandlung auf Windows); vitest-Ausgabe
mit encoding="utf-8", errors="replace" (sonst wirft Windows auf vitests Pfeilen, N25-Lehre).
rc 2 = Aufruffehler · rc 7 = Absturz des Werkzeugs selbst (eigener Wert: ein Python-Absturz endet
sonst mit 1 und saehe aus wie "unbemerkt" - so geschehen in der Gegenprobe am 22.09., cp1252-Konsole). Aendert den Arbeitsbaum waehrend des Laufs: nicht parallel fahren.
"""
import argparse
import hashlib
import os
import re
import shutil
import subprocess
import sys

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NEU = os.path.join(WURZEL, "neu")


def rel(p):
    p = p.replace("\\", "/")
    return p.removeprefix("neu/")


def lies_muster(text, datei):
    if datei:
        with open(datei, "rb") as f:
            return f.read()
    return None if text is None else text.encode("utf-8")


def vitest(test):
    env = dict(os.environ, NO_COLOR="1", FORCE_COLOR="0")
    npx = shutil.which("npx") or "npx"   # Windows: npx.CMD - als blosse Liste FileNotFoundError (BUILD_LOG 166)
    r = subprocess.run([npx, "vitest", "run", test, "--reporter=dot"], cwd=NEU, env=env,
                       capture_output=True, encoding="utf-8", errors="replace", check=False)
    aus = (r.stdout or "") + (r.stderr or "")
    m = re.search(r"Tests\s+(?:(\d+) failed)?[^\n]*?(?:(\d+) passed)?[^\n]*\((\d+)\)", aus)
    fehl = int(m.group(1)) if m and m.group(1) else 0
    gesamt = int(m.group(3)) if m else 0
    return r.returncode, fehl, gesamt, aus


def zeige(aus, n=12):
    z = [l for l in aus.splitlines() if re.search(r"FAIL|failed|passed|Error|×|✗|AssertionError", l)]
    for l in z[:n]:
        print("    " + l.strip()[:200])


def main():
    a = argparse.ArgumentParser()
    a.add_argument("--datei", required=True); a.add_argument("--test", required=True)
    a.add_argument("--alt"); a.add_argument("--neu", default="")
    a.add_argument("--alt-datei"); a.add_argument("--neu-datei")
    a.add_argument("--nullprobe", action="store_true")
    o = a.parse_args()
    datei, test = rel(o.datei), rel(o.test)
    alt = lies_muster(o.alt, o.alt_datei)
    neu = lies_muster(o.neu, o.neu_datei)
    if not alt:
        print("[sabotage_vt] --alt oder --alt-datei fehlt (leeres Muster ist keines).", file=sys.stderr); return 2
    pfad = os.path.join(NEU, datei)
    if not os.path.isfile(pfad):
        print("[sabotage_vt] Datei fehlt: neu/" + datei, file=sys.stderr); return 2
    if not os.path.exists(os.path.join(NEU, test)):
        print("[sabotage_vt] Test fehlt: neu/" + test, file=sys.stderr); return 2
    with open(pfad, "rb") as f:
        roh = f.read()
    vorher = hashlib.sha1(roh, usedforsecurity=False).hexdigest()
    n = roh.count(alt)
    if n != 1:
        print(f"[sabotage_vt] ABBRUCH: Muster kommt {n:d} mal vor, erwartet genau 1. Nichts geaendert, kein Lauf.", file=sys.stderr)
        return 3
    if o.nullprobe:
        rc, fehl, ges, aus = vitest(test)
        if rc != 0 or ges == 0:
            print(f"[sabotage_vt] ABBRUCH: Nullprobe schon rot/leer (rc={rc}, {fehl} von {ges} rot) - die Sabotage wuerde nichts messen.")
            zeige(aus); return 6
        print(f"[sabotage_vt] Nullprobe gruen ({ges} Tests).")
    ergebnis = None
    kaputt = False
    try:
        with open(pfad, "wb") as f:
            f.write(roh.replace(alt, neu, 1))
        print(f"[sabotage_vt] Muster genau 1x ersetzt ({len(alt):d} -> {len(neu):d} Byte), fahre vitest {test!s} ...")
        ergebnis = vitest(test)
    finally:
        with open(pfad, "wb") as f:
            f.write(roh)
        with open(pfad, "rb") as f:
            nachher = hashlib.sha1(f.read(), usedforsecurity=False).hexdigest()
        kaputt = nachher != vorher
    if kaputt:
        print(f"[sabotage_vt] WIEDERHERSTELLUNG FEHLGESCHLAGEN: neu/{datei} weicht ab - git diff pruefen!", file=sys.stderr)
        return 4
    print(f"[sabotage_vt] neu/{datei} wiederhergestellt (SHA-1 {vorher[:8]} davor = danach).")
    rc, fehl, ges, aus = ergebnis
    zeige(aus)
    if rc == 0:
        print(f"[sabotage_vt] URTEIL: vitest BLIEB GRUEN ({ges} Tests) - die Sabotage wird NICHT bemerkt."); return 1
    if fehl == 0:
        print(f"[sabotage_vt] URTEIL: KEIN TESTLAUF (rc={rc}, keine roten Tests gezaehlt) - kein Beleg."); return 5
    print(f"[sabotage_vt] URTEIL: {fehl} von {ges} Tests ROT - die Gegenprobe greift."); return 0


if __name__ == "__main__":
    for strom in (sys.stdout, sys.stderr):
        strom.reconfigure(encoding="utf-8", errors="replace")
    try:
        sys.exit(main())
    except SystemExit:
        raise
    except BaseException as e:   # noqa: BLE001 - jeder Absturz wird rc 7 "KEIN Urteil", nie ein falsches Urteil
        print(f"[sabotage_vt] ABSTURZ (rc 7, KEIN Urteil): {type(e).__name__}: {e}", file=sys.stderr)
        sys.exit(7)
