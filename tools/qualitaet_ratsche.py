#!/usr/bin/env python3
"""RATSCHEN FUER DIE CODE-QUALITAET (N43 M1, E67; 10.10.2026, BUILD_LOG 121).

Je Kennzahl eine Grenze in tools/qualitaet_ratsche.json; jede Zahl darf nur SINKEN (Muster: as_ratsche.py).
Werkzeuge gepinnt: knip und typescript in neu/package.json, lizard/ruff/shellcheck-py in tools/requirements-werkzeuge.txt.
Ausgangswerte: BUILD_LOG 118 (lizard, ruff, shellcheck gleich gemessen) und 121 (knip 6 zaehlt anders als knip 5).

Kennzahlen und Nenner:
  lizard_*   Funktionen in neu/src ohne *.test.* (lizard -l typescript): CCN > 15 / > 20, NLOC > 50 / > 80.
  knip_*     neu/ (knip --reporter json): unbenutzte Dateien, Exporte, Typen; Pakete = dependencies +
             devDependencies + unlisted + unresolved + binaries.
  ruff       Befunde in tools/ OHNE die Regelgruppe EXE: EXE prueft das Ausfuehrbar-Bit, das es unter
             Windows nicht gibt (gemessen 10.10.: Windows 801, Linux 841 = +40 EXE001). Ohne EXE zaehlen
             PC und CI gleich.
  ruff_s     Sicherheitsgruppe S (flake8-bandit) in tools/ - N45 W2, E080, BUILD_LOG 166. Ausgenommen mit Grund:
             S603/S607 (lokale Werkzeuge rufen git/node/npx auf - S603 ist nicht behebbar, S607-Vollpfade
             bringen keinen Gewinn), S101 (assert als Plausibilitaet; python -O wird nicht benutzt),
             tools/archiv/ (wird von nichts aufgerufen, README dort). Alles andere zaehlt: shell=True, eval,
             fester /tmp-Pfad, sha1/md5 ohne usedforsecurity=False ...
  shellcheck Meldungen in allen verfolgten *.sh ohne node_modules/.tooling.
  tsc_tools  Typfehler in tools/**/*.js (tsc mit checkJs und strict, tools/tsconfig.tools.json, ohne tools/archiv/)
             - N43 M4, BUILD_LOG 152; seit N45 W3 (BUILD_LOG 169) strict und 0 - die fruehere Zahl
             tsc_tools_streng ist darin aufgegangen (Fehler ohne strict sind eine Teilmenge, gemessen 14.10.).
  no_unsafe  oxlint typescript/no-unsafe-{member-access,call,assignment,return,argument} (typgestuetzt) im App-Code
             ohne Tests/testhilfe/generiert - N44 C4, BUILD_LOG 173 (Nutzer-Entscheid 14.10.: als Ratsche, nicht auf 0).
             Ohne src/kern/validierung.ts (Nutzer-Entscheid 27.11.2026, BUILD_LOG 303): dort ist `Roh = any` begruendet -
             der Eingang ist rohes JSON, und validierung.gleichheit.test.ts vergleicht auch die WURF-Meldungen mit
             referenz/logik.js; jede Typverengung aendert deren Ausdruckstext (gemessen: Ersatztyp -> 73 tsc-Fehler).
             Probe: neu/werkzeug/as_probe/unsafe.ts, genau ein Befund je Regel in den Zeilen 6-10.
             Ein Konfigurationsfehler (TS5xxx/TS6xxx) bricht die Pruefung ab, ohne dass tsc Dateien prueft -
             gemessen 13.10. (3 statt 789 Fehler); er macht den Waechter darum STUMM, nicht gruen.
Selbsttest (bekannte Antwort): tools/ratsche_probe/ (ruff: genau F401 · ruff_s: genau S324 + S602 in probe_s.py · shellcheck: genau SC2148 + SC2086 ·
lizard: eine Funktion mit CCN 16 · tsc: genau TS2339 + TS2554 in probe_typ.js) und knip muss neu/werkzeug/as_probe/probe.ts als unbenutzte Datei melden.
Die Probe-Dateien sind aus den Zaehlungen ausgenommen.

Urteile: 0 = alles gleich/gesunken (bei gesunken HINWEIS), 1 = mindestens eine Zahl gestiegen,
         2 = Werkzeug stumm (fehlt, kein JSON, Grenze unlesbar). Erste Zeile: `QR: name=zahl/grenze ...`.
--setze schreibt die gemessenen Zahlen als neue Grenzen (nur nach Nutzer-Entscheid oder bei HINWEIS).
"""
import csv
import io
import json
import os
import pathlib
import re
import shutil
import subprocess
import sys

WURZEL = pathlib.Path(__file__).resolve().parent.parent
NEU = WURZEL / "neu"
GRENZE = WURZEL / "tools" / "qualitaet_ratsche.json"
PROBE = "tools/ratsche_probe"
KNIP_PROBE = "werkzeug/as_probe/probe.ts"
UNSAFE_PROBE = "werkzeug/as_probe/unsafe.ts"   # N44 C4 (BUILD_LOG 173): Probe der Zahl no_unsafe, ebenfalls unbenutzt
UNSAFE_AUSNAHMEN = ("src/kern/validierung.ts",)   # BUILD_LOG 303: begruendetes `Roh = any`, siehe Kopf
UNSAFE_REGELN = [f"typescript/no-unsafe-{r}" for r in ("member-access", "call", "assignment", "return", "argument")]
SCHRAEG = chr(92)


class Stumm(Exception):
    pass


def lauf(cmd, cwd=WURZEL, ok=(0, 1)):
    try:
        r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=180, check=False)
    except Exception as e:  # jedes Startproblem macht den Waechter stumm
        raise Stumm(f"{cmd[0]} startet nicht ({e})") from e
    if r.returncode not in ok:
        raise Stumm(f"{' '.join(cmd[:3])} rc {r.returncode}: {(r.stderr or r.stdout).strip()[:200]}")
    return r.stdout


def pfad(p: str) -> str:
    return p.replace(SCHRAEG, "/")


def lizard(ziel: str, cwd=WURZEL):
    aus = lauf([sys.executable, "-m", "lizard", "-l", "typescript", "-x", "*.test.*", "--csv", ziel], cwd=cwd, ok=(0,))
    zeilen = list(csv.reader(io.StringIO(aus)))
    if not zeilen:
        raise Stumm("lizard lieferte keine Funktion")
    return [(int(z[0]), int(z[1]), z[7]) for z in zeilen]


def ruff(ziel: str, ausnahme: bool = True):
    cmd = [sys.executable, "-m", "ruff", "check", ziel, "--output-format", "json", "-q", "--no-cache", "--extend-ignore", "EXE"]
    if ausnahme:
        cmd += ["--extend-exclude", PROBE]
    aus = lauf(cmd).strip()
    if not aus.startswith("["):
        raise Stumm(f"ruff lieferte kein JSON ({aus[:100]})")
    return [x["code"] for x in json.loads(aus)]


RUFF_S_AUSNAHMEN = "EXE,S603,S607,S101"


def ruff_s(ziel: str, ausnahme: bool = True):
    cmd = [sys.executable, "-m", "ruff", "check", ziel, "--select", "S", "--extend-ignore", RUFF_S_AUSNAHMEN,
           "--output-format", "json", "-q", "--no-cache"]
    if ausnahme:
        cmd += ["--extend-exclude", PROBE, "--extend-exclude", "tools/archiv"]
    aus = lauf(cmd).strip()
    if not aus.startswith("["):
        raise Stumm(f"ruff (S) lieferte kein JSON ({aus[:100]})")
    return [x["code"] for x in json.loads(aus)]


def shellcheck(dateien):
    exe = shutil.which("shellcheck")
    if not exe:
        raise Stumm("shellcheck nicht gefunden (pip install -r tools/requirements-werkzeuge.txt)")
    aus = lauf([exe, "-f", "json", *dateien], ok=(0, 1)).strip()
    if not aus.startswith("["):
        raise Stumm(f"shellcheck lieferte kein JSON ({aus[:100]})")
    return [x["code"] for x in json.loads(aus)]


def tsc(konfig: str):
    exe = NEU / "node_modules" / "typescript" / "bin" / "tsc"
    if not exe.exists():
        raise Stumm("typescript fehlt in neu/node_modules (cd neu && npm ci)")
    # 13.10.2026 (BUILD_LOG 152): ohne playwright-core zaehlt tsc 7 Fehler mehr (CI installierte es nach check.sh).
    if not (WURZEL / "node_modules" / "playwright-core" / "package.json").exists():
        raise Stumm("playwright-core fehlt im Wurzel-node_modules (npm ci im Projektordner) - tsc zaehlte sonst anders als die CI")
    aus = lauf(["node", str(exe), "-p", konfig, "--pretty", "false"], ok=(0, 1, 2))
    codes = re.findall(r"error (TS[0-9]+)", aus)
    konf = sorted({c for c in codes if c[2] in "56"})
    if konf:
        raise Stumm(f"tsc-Konfiguration {konfig} fehlerhaft ({', '.join(konf)}) - es wurde nichts geprueft")
    return codes


def sh_dateien():
    # 11.10.2026 (BUILD_LOG 144): auch NEUE, noch nicht verfolgte Dateien – sonst war die Ratsche lokal gruen
    # und in der CI (nach dem Commit) rot: 4g2_entscheide.sh brachte 108 -> 110.
    aus = lauf(["git", "ls-files", "--cached", "--others", "--exclude-standard", "*.sh"], ok=(0,))
    return [p for p in aus.splitlines() if p and "node_modules" not in p and ".tooling" not in p and not p.startswith(PROBE)]


def knip():
    knip_js = NEU / "node_modules" / "knip" / "bin" / "knip.js"
    if not knip_js.exists():
        raise Stumm("knip fehlt in neu/node_modules (cd neu && npm ci)")
    aus = lauf(["node", str(knip_js), "--reporter", "json", "--no-progress"], cwd=NEU).strip()
    if not aus.startswith("{"):
        raise Stumm(f"knip lieferte kein JSON ({aus[:100]})")
    zahl = {"dateien": 0, "exporte": 0, "typen": 0, "pakete": 0}
    dateien = []
    for i in json.loads(aus)["issues"]:
        if i.get("files"):
            dateien.append(pfad(i["file"]))
        zahl["exporte"] += len(i.get("exports") or [])
        zahl["typen"] += len(i.get("types") or [])
        for k in ("dependencies", "devDependencies", "unlisted", "unresolved", "binaries"):
            zahl["pakete"] += len(i.get(k) or [])
    zahl["dateien"] = len([d for d in dateien if d not in (KNIP_PROBE, UNSAFE_PROBE)])
    return zahl, dateien


def no_unsafe(ziel: str):
    """N44 C4 (BUILD_LOG 173): Befunde der fuenf typgestuetzten oxlint-Regeln no-unsafe-* als (regel, datei, zeile).
    Gezaehlt wird wie bei der as-Ratsche nur App-Code: ohne Tests, testhilfe/ und erzeugte Dateien.
    oxlint laeuft ohne CLAUDECODE/AI_AGENT (in KI-Sitzungen aendert es sonst seine Ausgabe, BUILD_LOG 147)."""
    exe = NEU / "node_modules" / "oxlint" / "bin" / "oxlint"
    if not exe.exists():
        raise Stumm("oxlint fehlt in neu/node_modules (cd neu && npm ci)")
    cmd = ["node", str(exe), "-A", "all", "--type-aware", "-f", "json"]
    for r in UNSAFE_REGELN:
        cmd += ["-D", r]
    umg = {k: v for k, v in os.environ.items() if k not in ("CLAUDECODE", "AI_AGENT")}
    try:
        r = subprocess.run([*cmd, ziel], cwd=NEU, capture_output=True, text=True, encoding="utf-8", errors="replace",
                           timeout=180, check=False, env=umg)
        diag = json.loads(r.stdout)["diagnostics"]
    except Exception as e:  # kein Start, kein JSON -> stumm, nie gruen
        raise Stumm(f"oxlint no-unsafe lieferte kein JSON ({e})") from e
    aus = []
    for x in diag:
        datei = pfad(x["filename"])
        name = datei.rsplit("/", 1)[-1]
        if ziel == "src" and (".test." in name or "generiert" in name or datei.startswith("src/testhilfe/") or datei in UNSAFE_AUSNAHMEN):
            continue
        aus.append((x["code"], datei, x["labels"][0]["span"]["line"] if x.get("labels") else 0))
    return aus


def messen():
    f = lizard("src", cwd=NEU)
    k, _ = knip()
    return {
        "lizard_ccn_ueber_15": sum(c > 15 for _, c, _ in f),
        "lizard_ccn_ueber_20": sum(c > 20 for _, c, _ in f),
        "lizard_nloc_ueber_50": sum(n > 50 for n, _, _ in f),
        "lizard_nloc_ueber_80": sum(n > 80 for n, _, _ in f),
        "knip_dateien": k["dateien"],
        "knip_exporte": k["exporte"],
        "knip_typen": k["typen"],
        "knip_pakete": k["pakete"],
        "ruff": len(ruff("tools")),
        "ruff_s": len(ruff_s("tools")),
        "shellcheck": len(shellcheck(sh_dateien())),
        "tsc_tools": len(tsc("tools/tsconfig.tools.json")),
        "no_unsafe": len(no_unsafe("src")),
    }


def selbsttest() -> int:
    befunde = []
    try:
        r = sorted(ruff(PROBE, ausnahme=False))
        befunde.append(("ruff", r == ["F401"], r))
        rs = sorted(ruff_s(f"{PROBE}/probe_s.py", ausnahme=False))
        befunde.append(("ruff_s", rs == ["S324", "S602"], rs))
        s = sorted(shellcheck([f"{PROBE}/probe.sh"]))
        befunde.append(("shellcheck", s == [2086, 2148], s))
        lz = [(c, name) for _, c, name in lizard(f"{PROBE}/probe.ts")]
        befunde.append(("lizard", lz == [(16, "sechzehn")], lz))
        ts = sorted(tsc(f"{PROBE}/tsconfig.json"))
        befunde.append(("tsc", ts == ["TS2339", "TS2554"], ts))
        nu = sorted((c.split("(")[-1].rstrip(")"), z) for c, _, z in no_unsafe(UNSAFE_PROBE))
        soll = sorted([("no-unsafe-member-access", 6), ("no-unsafe-call", 7), ("no-unsafe-assignment", 8),
                       ("no-unsafe-return", 9), ("no-unsafe-argument", 10)])
        befunde.append(("no_unsafe", nu == soll, nu))
        _, kd = knip()
        befunde.append(("knip", KNIP_PROBE in kd, f"{len(kd)} Dateien"))
    except Stumm as e:
        print(f"SELBSTTEST ROT (stumm: {e})")
        return 1
    rot = [b for b in befunde if not b[1]]
    print(f"SELBSTTEST {'ROT' if rot else 'GRUEN'} " + " | ".join(f"{n} {'ok' if g else 'FALSCH'} ({w})" for n, g, w in befunde))
    return 1 if rot else 0


def main() -> int:
    if "--selbsttest" in sys.argv:
        return selbsttest()
    try:
        ist = messen()
    except Stumm as e:
        print(f"STUMM: {e}")
        return 2
    if "--setze" in sys.argv:
        GRENZE.write_text(json.dumps(ist, indent=2) + chr(10), encoding="utf-8", newline="")
        print("QR: Grenzen gesetzt " + " ".join(f"{k}={v}" for k, v in ist.items()))
        return 0
    try:
        grenze = {k: int(v) for k, v in json.loads(GRENZE.read_text(encoding="utf-8")).items()}
    except Exception as e:  # noqa: BLE001 - jedes Problem mit der Grenze macht den Waechter stumm
        print(f"STUMM: {GRENZE.name} nicht lesbar ({e})")
        return 2
    if set(grenze) != set(ist):
        print(f"STUMM: Kennzahlen in {GRENZE.name} passen nicht ({sorted(set(grenze) ^ set(ist))})")
        return 2
    print("QR: " + " ".join(f"{k}={ist[k]}/{grenze[k]}" for k in ist))
    hoch = [k for k in ist if ist[k] > grenze[k]]
    tief = [k for k in ist if ist[k] < grenze[k]]
    for k in hoch:
        print(f"GESTIEGEN {k}: {grenze[k]} -> {ist[k]} - die Zahl darf nur sinken")
    if tief:
        print("HINWEIS: gesunken (" + ", ".join(f"{k} {grenze[k]}->{ist[k]}" for k in tief) + ") - Grenze nachziehen: python3 tools/qualitaet_ratsche.py --setze")
    return 1 if hoch else 0


if __name__ == "__main__":
    sys.exit(main())
