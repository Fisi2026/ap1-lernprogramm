#!/usr/bin/env python3
"""Etappe A der M09-Aufloesung (Nutzer-Entscheide 04.08.2026):
   33 Fragen loeschen (thematisch im Hauptpool gedeckt),
   48 Fragen nach M08 / Gebiet B3 umziehen (WiSo-Stoff, laut IHK-Katalog kein AP1).
   ROHTEXT-MIGRATION: kein json.load/json.dump auf die Pool-Dateien (formatiert sonst um).
   json.loads wird NUR als Syntaxprobe vor dem Schreiben benutzt."""
import json
import os
import re
import sys

POOL = sys.argv[1] if len(sys.argv) > 1 else "pool"
M09 = os.path.join(POOL, "pool_m09_unterricht.json")
M08 = os.path.join(POOL, "pool_m08.json")

LOESCHEN = [
    "M09-061", "M09-062", "M09-063", "M09-064", "M09-065", "M09-070", "M09-071", "M09-074", "M09-075",
    "M09-051", "M09-052", "M09-053", "M09-054", "M09-055",
    "M09-111", "M09-112", "M09-113", "M09-118", "M09-155",
    "M09-021", "M09-025", "M09-026",
    "M09-015",
    "M09-042", "M09-045", "M09-046", "M09-047", "M09-048", "M09-049",
    "M09-127", "M09-128",
    "M09-001", "M09-005",
]

THEMEN = {
    "Rechtsformen": ("Rechtsformen",
        "HGB §§ 105 ff., 161 ff.; GmbHG § 5; AktG § 7 — WiSo-Grundlagen: Rechtsformen"),
    "Kaufmannseigenschaft": ("Kaufmannseigenschaft",
        "HGB §§ 1–7 — WiSo-Grundlagen: Kaufmannseigenschaft"),
    "Firma & Handelsregister": ("Firma & Handelsregister",
        "HGB §§ 8, 17–24 — WiSo-Grundlagen: Firma und Handelsregister"),
    "Führung & Managementtechniken": ("Führung & Managementtechniken",
        "WiSo-Grundlagen: Führungsstile und Managementtechniken"),
    "Aufgabenanalyse & -synthese": ("Aufgabenanalyse & -synthese",
        "WiSo-Grundlagen: Aufgabenanalyse und Aufgabensynthese"),
    "Vertragsanbahnung: Anfrage & Angebot": ("Vertragsanbahnung: Anfrage & Angebot",
        "BGB §§ 145–147 — WiSo-Grundlagen: Anfrage, Angebot und Vertragsanbahnung"),
}

# (alte ID, neue ID, Zielthema)
UMZUG = []
def band(ids, start, thema):
    for i, alt in enumerate(ids):
        UMZUG.append((alt, f"M08-{start + i:03}", thema))

band(["M09-101", "M09-102", "M09-103", "M09-104", "M09-105", "M09-106",
      "M09-107", "M09-108", "M09-109", "M09-110", "M09-158", "M09-159"], 301, "Rechtsformen")
band(["M09-081", "M09-082", "M09-083", "M09-084", "M09-085", "M09-086",
      "M09-087", "M09-088"], 321, "Kaufmannseigenschaft")
band(["M09-091", "M09-092", "M09-093", "M09-094", "M09-095", "M09-096",
      "M09-097", "M09-098", "M09-099"], 331, "Firma & Handelsregister")
band(["M09-031", "M09-032", "M09-033", "M09-034", "M09-035", "M09-041",
      "M09-044"], 341, "Führung & Managementtechniken")
band(["M09-011", "M09-012", "M09-013", "M09-014", "M09-018"], 351,
     "Aufgabenanalyse & -synthese")
band(["M09-121", "M09-123", "M09-124", "M09-125", "M09-126", "M09-130",
      "M09-151"], 361, "Vertragsanbahnung: Anfrage & Angebot")


def bloecke(text):
    """Zeichenspannen aller Objekte der obersten Ebene, nach id. Klammerzaehler,
       Strings und Escapes werden ausgelassen (ein '{' in einem Fragetext zaehlt nicht)."""
    spans = {}
    i, n = 0, len(text)
    tiefe = 0
    start = None
    instr = False
    esc = False
    while i < n:
        c = text[i]
        if instr:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == '"':
                instr = False
        else:
            if c == '"':
                instr = True
            elif c == "{":
                if tiefe == 0:
                    start = i
                tiefe += 1
            elif c == "}":
                tiefe -= 1
                if tiefe == 0:
                    roh = text[start:i + 1]
                    m = re.search(r'"id"\s*:\s*"([^"]+)"', roh)
                    if not m:
                        raise SystemExit(f"Block ohne id bei Zeichen {start}")
                    spans[m.group(1)] = (start, i + 1)
                    start = None
        i += 1
    if tiefe != 0:
        raise SystemExit("Klammern unausgeglichen")
    return spans


def feld_ersetze(block, feld, neu):
    muster = rf'("{re.escape(feld)!s}"\s*:\s*")((?:[^"\\]|\\.)*)(")'
    treffer = re.findall(muster, block)
    if len(treffer) != 1:
        raise SystemExit(f"Feld {feld!s} kommt {len(treffer):d}-mal vor (erwartet 1)")
    return re.sub(muster, lambda m: m.group(1) + neu.replace("\\", "\\\\") + m.group(3),
                  block, count=1)


def main():
    with open(M09, encoding="utf-8") as fh:
        src = fh.read()
    with open(M08, encoding="utf-8") as fh:
        dst = fh.read()
    spans = bloecke(src)

    alle = set(LOESCHEN) | {a for a, _, _ in UMZUG}
    fehlt = [i for i in alle if i not in spans]
    if fehlt:
        raise SystemExit("Nicht im Pool: " + ", ".join(sorted(fehlt)))
    if len(alle) != len(LOESCHEN) + len(UMZUG):
        raise SystemExit("ID doppelt in Loesch- und Umzugsliste")

    # 1) Umzugsbloecke ziehen und umschreiben
    neue = []
    for alt, neu_id, thema in UMZUG:
        a, b = spans[alt]
        blk = src[a:b]
        blk = feld_ersetze(blk, "id", neu_id)
        blk = feld_ersetze(blk, "pruefungsteil", "AP2")
        blk = feld_ersetze(blk, "modul", "M08")
        blk = feld_ersetze(blk, "thema", THEMEN[thema][0])
        blk = feld_ersetze(blk, "gebiet", "B3")
        blk = feld_ersetze(blk, "verweis", THEMEN[thema][1])
        # Einrueckung von 1 auf 2 Leerzeichen Basis anheben (pool_m08.json-Stil)
        blk = "\n".join((" " + z) if z.strip() else z for z in blk.split("\n"))
        neue.append(blk.lstrip())

    # 2) alle betroffenen Bloecke aus M09 entfernen (von hinten, damit Indizes halten)
    raus = sorted((spans[i] for i in alle), key=lambda s: -s[0])
    out = src
    for a, b in raus:
        ende = b
        while ende < len(out) and out[ende] in " \t":
            ende += 1
        if ende < len(out) and out[ende] == ",":
            ende += 1                      # nachfolgendes Komma mitnehmen
        else:                              # letzter Block: vorheriges Komma entfernen
            anf = a
            while anf > 0 and out[anf - 1] in " \t\r\n":
                anf -= 1
            if anf > 0 and out[anf - 1] == ",":
                a = anf - 1
        while ende < len(out) and out[ende] in " \t\r\n" and out[ende] != "]":
            if out[ende] == "\n":
                ende += 1
                break
            ende += 1
        out = out[:a] + out[ende:]
    out = re.sub(r"\n[ \t]*\n+", "\n", out)

    # 3) in M08 einhaengen: vor der letzten schliessenden Klammer
    pos = dst.rstrip().rfind("]")
    kopf = dst[:pos].rstrip()
    if not kopf.endswith(","):
        kopf += ","
    dst_neu = kopf + "\n  " + ",\n  ".join(neue) + "\n]\n"

    # 4) Syntaxprobe VOR dem Schreiben (fing am 30.07. einen Kommafehler)
    a09 = json.loads(out)
    a08 = json.loads(dst_neu)
    print(f"M09 nach Lauf: {len(a09):d} Fragen (vorher {len(spans):d})")
    print(f"M08 nach Lauf: {len(a08):d} Fragen")
    ids08 = [f["id"] for f in a08]
    if len(set(ids08)) != len(ids08):
        raise SystemExit("ID-Dublette in M08")
    for f in a08:
        if (f["modul"] != "M08" or f["gebiet"] not in ("B3",)) and f["id"].startswith("M08-3"):
            raise SystemExit("Feldfehler bei " + f["id"])
    for f in a09:
        if f["modul"] != "M09":
            raise SystemExit("M09-Datei enthaelt fremdes Modul: " + f["id"])

    with open(M09, "w", encoding="utf-8") as fh:
        fh.write(out)
    with open(M08, "w", encoding="utf-8") as fh:
        fh.write(dst_neu)
    print("geschrieben.")
    themen = {}
    for f in a09:
        themen[f["thema"]] = themen.get(f["thema"], 0) + 1
    print("M09-Restthemen:", json.dumps(themen, ensure_ascii=False, sort_keys=True))


main()
