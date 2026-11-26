#!/usr/bin/env python3
"""RATSCHE FUER UNSICHERE `as`-UMWANDLUNGEN IM APP-CODE von neu/src (N37 U4, E60; umgestellt N38 Q1, 30.09.2026).

Gezaehlt wird, was die oxlint-Regel `typescript/no-unsafe-type-assertion` (typgestuetzt, tsgolint) meldet:
eine Umwandlung, die ENGER ist als der Ausdruck oder aus `any` kommt – eine Behauptung, die tsc nicht prueft.
Sichere Umwandlungen (weiter, `as const`) zaehlen nicht. Die Zahl darf nur SINKEN.
⛔ Bis 30.09.2026 zaehlte diese Datei JEDES `as` als Text (217 von 222); Nutzer-Entscheid N38 Q1: EINE Ratsche,
   und zwar die, die das Ziel misst (BUILD_LOG 92).

App-Code = neu/src/**/*.ts(x) OHNE Tests (`.test.`), `testhilfe/` und erzeugte Dateien (`generiert`).
Selbsttest (bekannte Antwort): neu/werkzeug/as_probe/probe.ts traegt GENAU 3 unsichere Umwandlungen
(Zeilen 7, 8, 9) und 3 sichere; gefunden werden muessen genau diese drei Zeilen.

Urteile: 0 = gleich/gesunken (bei gesunken HINWEIS: Grenze in neu/as_ratsche.json nachziehen),
         1 = gestiegen, 2 = Werkzeug stumm (Grenze fehlt/kaputt, oxlint lief nicht oder lieferte kein JSON).
Erste Zeile der Ausgabe: `AS: <zahl> von <grenze>`.
"""
import collections
import json
import pathlib
import subprocess
import sys

WURZEL = pathlib.Path(__file__).resolve().parent.parent
NEU = WURZEL / "neu"
GRENZE = NEU / "as_ratsche.json"
REGEL = "typescript/no-unsafe-type-assertion"
PROBE = "werkzeug/as_probe"
PROBE_ZEILEN = [7, 8, 9]


def oxlint(pfad: str):
    """Liste der Befunde als (datei, zeile) – oder None, wenn oxlint stumm blieb."""
    cmd = ["node", "node_modules/oxlint/bin/oxlint", "-A", "all", "-D", REGEL, "--type-aware", "-f", "json", pfad]
    try:
        r = subprocess.run(cmd, cwd=NEU, capture_output=True, text=True, encoding="utf-8", timeout=120, check=False)
    except Exception as e:  # noqa: BLE001 - jedes Problem beim Start macht den Waechter stumm
        print(f"STUMM: oxlint startet nicht ({e})")
        return None
    t = r.stdout.lstrip()
    if r.returncode not in (0, 1) or not t.startswith("{"):
        print(f"STUMM: oxlint rc {r.returncode}, kein JSON ({(r.stdout + r.stderr).strip()[:200]})")
        return None
    try:
        d = json.loads(t)["diagnostics"]
    except Exception as e:  # noqa: BLE001
        print(f"STUMM: oxlint-JSON nicht lesbar ({e})")
        return None
    fremd = [x.get("code") for x in d if REGEL.split("/")[1] not in str(x.get("code"))]
    if fremd:
        print(f"STUMM: fremde Regeln im Ergebnis ({fremd[:3]})")
        return None
    return [(x["filename"].replace("\\", "/"), x["labels"][0]["span"]["line"]) for x in d]


def zaehlbar(datei: str) -> bool:
    name = datei.rsplit("/", 1)[-1]
    return datei.startswith("src/") and ".test." not in name and "generiert" not in name \
        and not datei.startswith("src/testhilfe/")


def selbsttest() -> int:
    b = oxlint(PROBE)
    if b is None:
        print("SELBSTTEST ROT (oxlint stumm)")
        return 1
    zeilen = sorted(z for _, z in b)
    ok = zeilen == PROBE_ZEILEN
    print(f"SELBSTTEST {'GRUEN' if ok else 'ROT'} (Probe: soll Zeilen {PROBE_ZEILEN}, ist {zeilen})")
    return 0 if ok else 1


def main() -> int:
    if "--selbsttest" in sys.argv:
        return selbsttest()
    try:
        grenze = int(json.loads(GRENZE.read_text(encoding="utf-8"))["grenze"])
    except Exception as e:  # noqa: BLE001 - jedes Problem mit der Grenze macht den Waechter stumm
        print(f"STUMM: {GRENZE.name} nicht lesbar ({e})")
        return 2
    b = oxlint("src")
    if b is None:
        return 2
    je = collections.Counter(d for d, _ in b if zaehlbar(d))
    zahl = sum(je.values())
    print(f"AS: {zahl} von {grenze}")
    if "--je-datei" in sys.argv or zahl > grenze:
        for datei, n in je.most_common(15):
            print(f"  {n:4d}  {datei}")
    if zahl > grenze:
        print(f"GESTIEGEN um {zahl - grenze} – die Zahl darf nur sinken (Feld eingrenzen statt behaupten)")
        return 1
    if zahl < grenze:
        print(f"HINWEIS: gesunken um {grenze - zahl} – Grenze in neu/{GRENZE.name} auf {zahl} setzen")
    return 0


if __name__ == "__main__":
    sys.exit(main())
